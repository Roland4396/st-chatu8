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

window.zidongdianji = false;

setTriggerGeneration(triggerGeneration);
setGorkTriggerGeneration(triggerGeneration);
setShowImagePreview(showImagePreview);

// Present in the original bundle, but not wired to an event in this file.
const debouncedProcessVisible = debounce(() => {
  processMesTextElements();
  processIframes();
}, 200);

function enableTemporaryForceProcessing() {
  window.zidongdianji = true;

  if (autoClickTimer) {
    clearTimeout(autoClickTimer);
  }

  if (extension_settings[extensionName].zidongdianji2 !== 'true') {
    autoClickTimer = setTimeout(() => {
      window.zidongdianji = false;
      autoClickTimer = null;
    }, 5000);
  }
}

eventSource.on(event_types.GENERATION_ENDED, async () => {
  enableTemporaryForceProcessing();
});

eventSource.on(event_types.MESSAGE_SWIPED, async () => {
  enableTemporaryForceProcessing();
});

eventSource.on('js_generation_ended', async () => {
  enableTemporaryForceProcessing();
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
    document.addEventListener('DOMContentLoaded', processAllImagePlaceholders);
  } else {
    processAllImagePlaceholders();
  }
}
