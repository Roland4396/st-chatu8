import { extension_settings } from '../../../../../extensions.js';
import { extensionName } from '../config.js';
import { checkSendBuClass } from '../utils.js';
import { isElementVisible, isIframeVisible } from './utils.js';
import { findAndReplaceInElement } from './placeholder.js';
import { injectButtonStyleToDocument } from '../settings/buttonstyle.js';
import { injectFrameStyleToDocument } from '../settings/framestyle.js';
import { injectCollapseStyleToDocument } from '../settings/collapsestyle.js';

const VIEWPORT_MARGIN_PX = 300;
const MIN_ELEMENT_TEXT_LENGTH = 100;
const MAX_ELEMENT_TEXT_LENGTH = 40000;
const MIN_DIRECT_TEXT_LENGTH = 50;

export function processMesTextElements() {
  if (!extension_settings[extensionName].scriptEnabled || checkSendBuClass()) {
    return;
  }

  const messageTextElements = document.getElementsByClassName('mes_text');
  const forceProcessing = window.zidongdianji === true;

  for (const element of messageTextElements) {
    if (!forceProcessing && !isElementVisible(element, VIEWPORT_MARGIN_PX)) {
      continue;
    }

    findAndReplaceInElement(element);
  }
}

export function processIframes() {
  if (!extension_settings[extensionName].scriptEnabled || checkSendBuClass()) {
    return;
  }

  const iframes = document.querySelectorAll('iframe');
  const forceProcessing = window.zidongdianji === true;

  iframes.forEach((iframe) => {
    if (!forceProcessing && !isIframeVisible(iframe, VIEWPORT_MARGIN_PX)) {
      return;
    }

    const processIframeContent = () => {
      try {
        const iframeDocument = iframe.contentDocument;

        if (!iframeDocument?.body) {
          return;
        }

        injectButtonStyleToDocument(iframeDocument);
        injectFrameStyleToDocument(iframeDocument);
        injectCollapseStyleToDocument(iframeDocument);

        processIframeBody(iframeDocument, forceProcessing);
      } catch (error) {
        console.warn('无法访问 iframe 内容:', error.message);
      }
    };

    try {
      const iframeDocument = iframe.contentDocument;

      if (iframeDocument && iframeDocument.readyState === 'complete') {
        processIframeContent();
      } else {
        iframe.addEventListener('load', processIframeContent);
      }
    } catch (error) {
      console.warn('无法访问 iframe:', error.message);
    }
  });
}

function processIframeBody(iframeDocument, forceProcessing) {
  const iframeWindow = iframeDocument.defaultView;
  const iframeHeight = iframeWindow?.innerHeight || 800;
  const iframeWidth = iframeWindow?.innerWidth || 600;

  const isInViewport = (element) => {
    if (!element?.getBoundingClientRect) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const isVerticallyNear =
      rect.bottom >= -VIEWPORT_MARGIN_PX && rect.top <= iframeHeight + VIEWPORT_MARGIN_PX;
    const isHorizontallyNear =
      rect.right >= -VIEWPORT_MARGIN_PX && rect.left <= iframeWidth + VIEWPORT_MARGIN_PX;

    return isVerticallyNear && isHorizontallyNear;
  };

  const isRenderableElement = (element) => {
    if (!element?.getBoundingClientRect) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }

    const style = iframeDocument.defaultView?.getComputedStyle(element);
    return !(style && (style.display === 'none' || style.visibility === 'hidden'));
  };

  const getDirectTextLength = (element) => {
    let textLength = 0;

    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        textLength += child.textContent.trim().length;
      }
    }

    return textLength;
  };

  const processCandidateElement = (element) => {
    if (!isRenderableElement(element)) {
      return;
    }

    if (!forceProcessing && !isInViewport(element)) {
      return;
    }

    const textLength = element.textContent?.length || 0;
    const directChildDivs = element.querySelectorAll(':scope > div');

    if (textLength < MIN_ELEMENT_TEXT_LENGTH || textLength > MAX_ELEMENT_TEXT_LENGTH) {
      if (directChildDivs.length > 0) {
        directChildDivs.forEach((childDiv) => processCandidateElement(childDiv));
        return;
      }

      if (textLength < MIN_ELEMENT_TEXT_LENGTH) {
        return;
      }
    }

    if (getDirectTextLength(element) >= MIN_DIRECT_TEXT_LENGTH) {
      findAndReplaceInElement(element);
      return;
    }

    findAndReplaceInElement(element);

    if (directChildDivs.length > 0) {
      directChildDivs.forEach((childDiv) => processCandidateElement(childDiv));
    }
  };

  const topLevelDivs = iframeDocument.body.querySelectorAll(':scope > div');

  if (topLevelDivs.length > 0) {
    topLevelDivs.forEach((div) => processCandidateElement(div));
  } else {
    findAndReplaceInElement(iframeDocument.body);
  }
}
