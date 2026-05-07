import { eventSource, event_types } from '../../../../../../script.js';
import { extension_settings } from '../../../../../extensions.js';
import { extensionName } from '../config.js';
import {
  applyGenerateButtonStyle,
  applyImageFrameStyle,
  isThemeDark,
} from '../settings/theme.js';
import { debounce } from './utils.js';
import { processMesTextElements, processIframes } from './chatProcessor.js';
import { setTriggerGeneration } from './dialogs.js';
import { setGorkTriggerGeneration } from './gorkVideo.js';
import { triggerGeneration, setShowImagePreview } from './generation.js';
import { showImagePreview } from './imagePreview.js';

let autoClickTimer = null;
let visibleAutoGenerateTimer = null;
let processingInitialized = false;

window.zidongdianji = false;
window.chatu8AutoGenerateVisible = false;

setTriggerGeneration(triggerGeneration);
setGorkTriggerGeneration(triggerGeneration);
setShowImagePreview(showImagePreview);

const debouncedProcessVisible = debounce(() => {
  processMesTextElements();
  processIframes();
}, 200);

function clearTemporaryForceProcessing() {
  if (autoClickTimer) {
    clearTimeout(autoClickTimer);
    autoClickTimer = null;
  }

  if (extension_settings[extensionName]?.zidongdianji2 !== 'true' && !window.autoClickTaskId) {
    window.zidongdianji = false;
  }
}

function enableVisibleAutoGenerateWindow() {
  if (extension_settings[extensionName]?.zidongdianji !== 'true') {
    window.chatu8AutoGenerateVisible = false;
    return;
  }

  window.chatu8AutoGenerateVisible = true;

  if (visibleAutoGenerateTimer) {
    clearTimeout(visibleAutoGenerateTimer);
  }

  if (extension_settings[extensionName]?.zidongdianji2 !== 'true') {
    visibleAutoGenerateTimer = setTimeout(() => {
      window.chatu8AutoGenerateVisible = false;
      visibleAutoGenerateTimer = null;
    }, 5000);
  }
}

function scheduleVisibleProcessing({ autoGenerate = false } = {}) {
  clearTemporaryForceProcessing();

  if (autoGenerate) {
    enableVisibleAutoGenerateWindow();
  }

  debouncedProcessVisible();
}

eventSource.on(event_types.GENERATION_ENDED, async () => {
  scheduleVisibleProcessing({ autoGenerate: true });
});

eventSource.on(event_types.MESSAGE_SWIPED, async () => {
  scheduleVisibleProcessing({ autoGenerate: true });
});

eventSource.on(event_types.MESSAGE_RECEIVED, async () => {
  scheduleVisibleProcessing();
});

eventSource.on(event_types.MESSAGE_EDITED, async () => {
  scheduleVisibleProcessing();
});

eventSource.on('js_generation_ended', async () => {
  scheduleVisibleProcessing({ autoGenerate: true });
});

export function processAllImagePlaceholders() {
  processMesTextElements();
  processIframes();
}

export function initializeImageProcessing() {
  if (extension_settings[extensionName]) {
    const currentTheme =
      extension_settings[extensionName].themes?.[extension_settings[extensionName].theme_id] || {};

    applyGenerateButtonStyle(
      extension_settings[extensionName].generate_btn_style || '默认',
      isThemeDark(currentTheme),
    );

    applyImageFrameStyle(
      extension_settings[extensionName].image_frame_style || '无样式',
      isThemeDark(currentTheme),
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        processingInitialized = true;
        processAllImagePlaceholders();
      },
      { once: true },
    );
  } else {
    if (!processingInitialized) {
      processingInitialized = true;
      processAllImagePlaceholders();
    } else {
      debouncedProcessVisible();
    }
  }
}
