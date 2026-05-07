import { extension_settings } from '../../../../../extensions.js';
import { eventSource, saveChatConditional } from '../../../../../../script.js';
import { getContext } from '../../../../../st-context.js';
import { extensionName } from '../config.js';
import { getItemImg } from '../database.js';
import { getcharData, setcharData } from '../promptReq.js';
import { fuzzyMatchLine } from '../imageInserter.js';
import { findNodeAtPosition, generateStableId, generateElKey } from './utils.js';
import { createAndShowImage, triggerGeneration } from './generation.js';
import { showEditDialog } from './dialogs.js';

const IGNORED_TEXT_PARENT_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'BUTTON',
  'PRE',
  'CODE',
  'TEXTAREA',
  'KBD',
  'SAMP',
  'VAR',
]);

const IGNORED_CLASS_FRAGMENTS = [
  'hljs',
  'highlight',
  'prism',
  'language-',
  'CodeMirror',
  'ace_',
];

const IMAGE_LOAD_BATCH_SIZE = 2;
const IMAGE_LOAD_BATCH_DELAY_MS = 35;

function delay(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getScrollableChatElement(ownerDocument) {
  const topDocument = ownerDocument?.defaultView?.top?.document;
  return topDocument?.getElementById('chat') || document.getElementById('chat');
}

async function runImageLoadTasks(tasks, ownerDocument) {
  const chatElement = getScrollableChatElement(ownerDocument);
  const shouldPreserveScroll =
    chatElement &&
    chatElement.scrollHeight - chatElement.scrollTop - chatElement.clientHeight > 32;

  let previousScrollHeight = shouldPreserveScroll ? chatElement.scrollHeight : 0;

  for (let index = 0; index < tasks.length; index += IMAGE_LOAD_BATCH_SIZE) {
    const batch = tasks.slice(index, index + IMAGE_LOAD_BATCH_SIZE);
    await Promise.all(batch.map((task) => task()));

    if (shouldPreserveScroll) {
      const nextScrollHeight = chatElement.scrollHeight;
      chatElement.scrollTop += nextScrollHeight - previousScrollHeight;
      previousScrollHeight = nextScrollHeight;
    }

    if (index + IMAGE_LOAD_BATCH_SIZE < tasks.length) {
      await delay(IMAGE_LOAD_BATCH_DELAY_MS);
    }
  }
}

function getImageTags() {
  const settings = extension_settings[extensionName];

  return {
    startTag: settings?.startTag || 'image###',
    endTag: settings?.endTag || '###',
  };
}

function normalizeImageTag(tag) {
  return tag.replaceAll('《', '<').replaceAll('》', '>').replaceAll('\n', '');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findExistingButton(element, tag) {
  const escapedTag = CSS.escape(tag);

  return element.querySelector(
    `button.image-tag-button[data-link="${escapedTag}"], ` +
      `button.image-tag-button[data-image-tag="${escapedTag}"]`,
  );
}

function createImageButton(document, tag, requestId, settings) {
  const button = document.createElement('button');

  button.className = 'image-tag-button st-chatu8-image-button';
  button.textContent = '生成图片';
  button.dataset.link = tag;
  button.dataset.requestId = requestId;
  button.dataset.imageTag = tag;

  let longPressTimer = null;
  let longPressTriggered = false;
  const longPressMs = 1200;

  const onPressStart = (event) => {
    if (event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    longPressTriggered = false;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      longPressTimer = null;
      event.preventDefault();

      if (settings.longPressToEdit == 'true') {
        showEditDialog(null, button);
      }
    }, longPressMs);
  };

  const clearLongPressTimer = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  button.addEventListener('click', (event) => {
    if (longPressTriggered) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    triggerGeneration(button);
  });

  button.addEventListener('mousedown', onPressStart);
  button.addEventListener('mouseup', clearLongPressTimer);
  button.addEventListener('mouseleave', clearLongPressTimer);
  button.addEventListener('touchstart', onPressStart);
  button.addEventListener('touchend', clearLongPressTimer);
  button.addEventListener('touchcancel', clearLongPressTimer);

  return button;
}

function createImageSpan(document, requestId) {
  const span = document.createElement('span');

  span.className = 'st-chatu8-image-span';
  span.dataset.requestId = requestId;

  return span;
}

async function loadExistingImageIntoSpan(tag, span, button, label, settings) {
  const [imageData, savedPrompt, , changeInfo, metadata] = await getItemImg(tag);

  if (!imageData) {
    return false;
  }

  createAndShowImage(span, imageData, label, button, savedPrompt, changeInfo, metadata);

  if (settings.dbclike === 'true') {
    button.style.setProperty('display', 'none', 'important');
  }

  return true;
}

function collectElementTextAndPositions(element) {
  const ownerDocument = element.ownerDocument || element;
  const textPositions = [];
  let fullText = '';

  const walker = ownerDocument.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        const parentTag = parent?.tagName;

        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
          return NodeFilter.FILTER_SKIP;
        }

        if (IGNORED_TEXT_PARENT_TAGS.has(parentTag)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (
          parent?.classList.contains('image-tag-button') ||
          parent?.classList.contains('st-chatu8-image-span')
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parent?.className && typeof parent.className === 'string') {
          for (const classFragment of IGNORED_CLASS_FRAGMENTS) {
            if (parent.className.includes(classFragment)) {
              return NodeFilter.FILTER_REJECT;
            }
          }
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  let node;
  while ((node = walker.nextNode())) {
    const start = fullText.length;
    let text = '';

    if (node.nodeType === Node.TEXT_NODE) {
      text = node.textContent;
    } else if (node.tagName === 'BR') {
      text = '\n';
    }

    fullText += text;
    textPositions.push({
      node,
      start,
      end: fullText.length,
    });
  }

  return {
    ownerDocument,
    textPositions,
    fullText,
  };
}

function getExplicitTagMatches(fullText, settings) {
  const imageTagRegex = new RegExp(
    `${escapeRegExp(settings.startTag)}([\\s\\S]*?)${escapeRegExp(settings.endTag)}`,
    'g',
  );

  const matches = [];
  let match;

  while ((match = imageTagRegex.exec(fullText)) !== null) {
    matches.push({
      fullMatch: match[0],
      content: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      isPatternMatch: true,
    });
  }

  return matches;
}

export async function getSavedImageMatches(fullText, element) {
  const matchedImages = [];

  try {
    if (element.querySelector('.st-chatu8-image-container')) {
      return matchedImages;
    }

    if (element?.classList?.contains('mes_text')) {
      let mesId = element.getAttribute('data-mesid');

      if (!mesId) {
        const messageElement = element.parentElement?.parentElement;
        mesId = messageElement?.getAttribute('mesid');
      }

      if (mesId) {
        const messageIndex = parseInt(mesId, 10);
        const context = getContext();
        const message = context.chat?.[messageIndex];

        if (message) {
          const swipeId = message.swipe_id ?? 0;
          const imageEntries = message.extra?.images?.[swipeId];

          if (Array.isArray(imageEntries) && imageEntries.length > 0) {
            appendSavedImageMatches(matchedImages, fullText, element, imageEntries);

            if (matchedImages.length > 0) {
              console.log(
                `[iframe] Matched from chat[${messageIndex}].extra.images[${swipeId}], tags:`,
                matchedImages.length,
              );
            }

            return matchedImages;
          }

          const imageGroups = (await getcharData('image_groups')) || {};
          const elementKey = generateElKey(fullText);

          if (elementKey && imageGroups[elementKey]) {
            const migratedEntries = imageGroups[elementKey];

            if (!message.extra) {
              message.extra = {};
            }

            if (!message.extra.images) {
              message.extra.images = {};
            }

            message.extra.images[swipeId] = migratedEntries;
            delete imageGroups[elementKey];

            await setcharData('image_groups', imageGroups);
            saveChatConditional();

            console.log(
              `[iframe] Migrated image group from elKey: ${elementKey} ` +
                `to chat[${messageIndex}].extra.images[${swipeId}]`,
            );

            appendSavedImageMatches(matchedImages, fullText, element, migratedEntries);

            if (matchedImages.length > 0) {
              console.log('[iframe] Matched from migrated data, tags:', matchedImages.length);
            }

            return matchedImages;
          }

          return matchedImages;
        }
      }
    }

    const imageGroups = (await getcharData('image_groups')) || {};
    const elementKey = generateElKey(fullText);

    if (!elementKey) {
      return matchedImages;
    }

    const imageEntries = imageGroups[elementKey];
    if (!Array.isArray(imageEntries) || imageEntries.length === 0) {
      return matchedImages;
    }

    appendSavedImageMatches(matchedImages, fullText, element, imageEntries, false);

    if (matchedImages.length > 0) {
      console.log('[iframe] Matched image group by key:', elementKey, 'tags:', matchedImages.length);
    }
  } catch (error) {
    console.error('[iframe] Error in getSavedImageMatches:', error);
  }

  return matchedImages;
}

function appendSavedImageMatches(
  output,
  fullText,
  element,
  imageEntries,
  allowFuzzyMatch = true,
) {
  const { startTag, endTag } = getImageTags();

  for (const imageEntry of imageEntries) {
    const explicitTagText = `${startTag}${imageEntry.tag}${endTag}`;
    const explicitTagStillExists = fullText.includes(explicitTagText);
    const existingButton = findExistingButton(element, imageEntry.tag);

    if (existingButton || explicitTagStillExists) {
      continue;
    }

    if (allowFuzzyMatch) {
      const fuzzyMatch = fuzzyMatchLine(fullText, imageEntry.regex, 0.5);

      if (fuzzyMatch) {
        output.push({
          content: imageEntry.tag,
          insertPosition: fuzzyMatch.endIndex,
        });
        continue;
      }
    }

    output.push({
      content: imageEntry.tag,
      insertPosition: imageEntry.endIndex,
    });
  }
}

export async function createButtonAtPosition(
  insertPosition,
  rawTag,
  textPositions,
  ownerDocument,
  containerElement,
  settings,
  shouldAutoGenerate,
  label = 'Generated Image',
) {
  const normalizedTag = normalizeImageTag(rawTag);
  const requestId = generateStableId(normalizedTag);
  const markerAttribute = `data-tag-inserted-${requestId}`;

  if (containerElement.hasAttribute && containerElement.hasAttribute(markerAttribute)) {
    const existingButton = findExistingButton(containerElement, normalizedTag);

    if (existingButton) {
      console.log('[iframe] Tag already inserted with button, skipping:', rawTag.substring(0, 50));
      return null;
    }

    console.log('[iframe] Tag marker exists but button missing, re-inserting:', rawTag.substring(0, 50));
    containerElement.removeAttribute(markerAttribute);
  }

  const existingButton = findExistingButton(containerElement, normalizedTag);

  if (existingButton) {
    console.log(
      '[iframe] Button already exists, skipping:',
      normalizedTag.substring(0, 50),
      'loading:',
      existingButton.hasAttribute('data-loading'),
    );

    if (containerElement.setAttribute) {
      containerElement.setAttribute(markerAttribute, 'true');
    }

    return null;
  }

  const targetPosition = findNodeAtPosition(textPositions, insertPosition);
  if (!targetPosition) {
    console.warn('[iframe] Could not find target node for position:', insertPosition);
    return null;
  }

  if (containerElement.setAttribute) {
    containerElement.setAttribute(markerAttribute, 'true');
  }

  const button = createImageButton(ownerDocument, normalizedTag, requestId, settings);
  const span = createImageSpan(ownerDocument, requestId);
  const range = ownerDocument.createRange();

  try {
    const targetNode = targetPosition.node;
    const offset = insertPosition - targetPosition.start;

    if (targetNode.nodeType === Node.TEXT_NODE) {
      range.setStart(targetNode, offset);
      range.setEnd(targetNode, offset);
    } else {
      range.setStartAfter(targetNode);
      range.setEndAfter(targetNode);
    }

    range.insertNode(span);
    range.insertNode(button);
  } catch (error) {
    console.error('[iframe] Error inserting button at position:', error);
    return null;
  }

  const loadExistingImage = async () => {
    const foundExistingImage = await loadExistingImageIntoSpan(
      normalizedTag,
      span,
      button,
      label,
      settings,
    );

    if (!foundExistingImage && shouldAutoGenerate) {
      console.log('[iframe] 自动点击直接触发生成:', button);
      triggerGeneration(button);
    }
  };

  await loadExistingImage();

  return button;
}

export async function findAndReplaceInElement(element, label = 'Generated Image') {
  if (!element) {
    return;
  }

  if (element.dataset && element.dataset.chatu8Processed === 'true') {
    const currentTextLength = element.textContent?.length || 0;
    const processedTextLength = parseInt(element.dataset.chatu8ContentLength || '0', 10);

    if (currentTextLength !== processedTextLength) {
      console.log('[iframe] Content length changed, re-processing:', {
        stored: processedTextLength,
        current: currentTextLength,
      });

      delete element.dataset.chatu8Processed;
      delete element.dataset.chatu8ContentLength;
    } else if (element.querySelector('button.image-tag-button')) {
      return;
    } else {
      console.log('[iframe] Element marked processed but no buttons found, re-processing');
      delete element.dataset.chatu8Processed;
      delete element.dataset.chatu8ContentLength;
    }
  }

  if (element.querySelector('button.image-tag-button[data-loading="true"]')) {
    console.log('[iframe] Element has loading button, skipping processing');
    return;
  }

  const settings = extension_settings[extensionName];

  if (!settings.startTag || !settings.endTag) {
    console.warn('[iframe] startTag or endTag is empty, skipping placeholder processing');
    return;
  }

  const autoGenerateEnabled =
    settings.zidongdianji === 'true' &&
    (window.zidongdianji || window.chatu8AutoGenerateVisible);
  const { ownerDocument, textPositions, fullText } = collectElementTextAndPositions(element);
  const explicitTagMatches = getExplicitTagMatches(fullText, settings);
  const savedImageMatches = await getSavedImageMatches(fullText, element);

  if (explicitTagMatches.length === 0 && savedImageMatches.length === 0) {
    return;
  }

  const imageLoadTasks = [];
  const autoGenerateButtons = [];
  const savedMatchesDescending = [...savedImageMatches].sort(
    (left, right) => right.insertPosition - left.insertPosition,
  );

  for (const savedMatch of savedMatchesDescending) {
    imageLoadTasks.push(() =>
      createButtonAtPosition(
        savedMatch.insertPosition,
        savedMatch.content,
        textPositions,
        ownerDocument,
        element,
        settings,
        false,
        label,
      ),
    );
  }

  for (let index = explicitTagMatches.length - 1; index >= 0; index--) {
    const match = explicitTagMatches[index];
    const overlappingTextPositions = textPositions.filter(
      (position) => match.startIndex < position.end && match.endIndex > position.start,
    );

    if (overlappingTextPositions.length === 0) {
      continue;
    }

    const firstPosition = overlappingTextPositions[0];
    const lastPosition = overlappingTextPositions[overlappingTextPositions.length - 1];
    const range = ownerDocument.createRange();

    try {
      if (!setRangeStart(range, firstPosition, match)) {
        continue;
      }

      if (!setRangeEnd(range, lastPosition, match)) {
        continue;
      }
    } catch (error) {
      console.error('st-chatu8: Error setting range. Skipping match.', error, match);
      continue;
    }

    range.deleteContents();

    const normalizedTag = normalizeImageTag(match.content);
    const requestId = generateStableId(normalizedTag);
    const markerAttribute = `data-tag-inserted-${requestId}`;

    if (element.hasAttribute && element.hasAttribute(markerAttribute)) {
      const existingButton = findExistingButton(element, normalizedTag);

      if (existingButton) {
        console.log('[iframe] Tag already inserted with button, skipping:', normalizedTag.substring(0, 50));
        continue;
      }

      console.log('[iframe] Tag marker exists but button missing, re-inserting:', normalizedTag.substring(0, 50));
      element.removeAttribute(markerAttribute);
    }

    const existingButton = findExistingButton(element, normalizedTag);

    if (existingButton) {
      console.log(
        '[iframe] Button already exists, skipping:',
        normalizedTag.substring(0, 50),
        'loading:',
        existingButton.hasAttribute('data-loading'),
      );

      if (element.setAttribute) {
        element.setAttribute(markerAttribute, 'true');
      }

      continue;
    }

    if (element.setAttribute) {
      element.setAttribute(markerAttribute, 'true');
    }

    const button = createImageButton(ownerDocument, normalizedTag, requestId, settings);
    const span = createImageSpan(ownerDocument, requestId);

    range.insertNode(span);
    range.insertNode(button);

    const imageLoadTask = async () => {
      const foundExistingImage = await loadExistingImageIntoSpan(
        normalizedTag,
        span,
        button,
        label,
        settings,
      );

      if (!foundExistingImage && autoGenerateEnabled) {
        autoGenerateButtons.unshift(button);
      }
    };

    imageLoadTasks.push(imageLoadTask);
  }

  runImageLoadTasks(imageLoadTasks, ownerDocument).then(() => {
    if (autoGenerateButtons.length > 0) {
      console.log('[iframe] 按正序触发自动生成，按钮数量:', autoGenerateButtons.length);

      for (const button of autoGenerateButtons) {
        console.log('[iframe] 自动点击触发生成:', button);
        triggerGeneration(button);
      }
    }

    if (window.autoClickTaskId) {
      eventSource.emit('st_chatu8_auto_click_complete', {
        taskId: window.autoClickTaskId,
        success: true,
      });

      console.log('[iframe] 自动点击任务已完成');
    } else if (window.chatu8AutoGenerateVisible && extension_settings[extensionName]?.zidongdianji2 !== 'true') {
      window.chatu8AutoGenerateVisible = false;
    }
  });

  if (element.dataset) {
    element.dataset.chatu8Processed = 'true';
    element.dataset.chatu8ContentLength = String(element.textContent?.length || 0);
  }
}

function setRangeStart(range, firstPosition, match) {
  const startOffset = match.startIndex - firstPosition.start;

  if (firstPosition.node.nodeType === Node.TEXT_NODE) {
    const textLength = firstPosition.node.textContent?.length ?? 0;

    if (textLength === 0 || startOffset > textLength) {
      console.warn('[iframe] StartOffset out of bounds:', {
        startOffset,
        startTextLength: textLength,
        matchInfo: match,
      });
      return false;
    }

    range.setStart(firstPosition.node, startOffset);
  } else {
    range.setStartBefore(firstPosition.node);
  }

  return true;
}

function setRangeEnd(range, lastPosition, match) {
  const endOffset = match.endIndex - lastPosition.start;

  if (lastPosition.node.nodeType === Node.TEXT_NODE) {
    const textLength = lastPosition.node.textContent?.length ?? 0;

    if (textLength === 0 || endOffset > textLength) {
      console.warn('[iframe] EndOffset out of bounds:', {
        endOffset,
        textLength,
        matchInfo: match,
      });
      return false;
    }

    range.setEnd(lastPosition.node, endOffset);
  } else {
    range.setEndAfter(lastPosition.node);
  }

  return true;
}
