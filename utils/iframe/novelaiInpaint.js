import { createUnifiedDialog, createButtonContainer } from "./dialogs.js";
import { handleAutocomplete } from "./autocomplete.js";
import { stripChineseAnnotations } from "../utils.js";
async function handleGenerate(_0x5788f8, _0x5ab2a2, _0xbf00b5, _0xcc1460) {
  try {
    if (!_0x5788f8.originalImage || !_0x5788f8.imageCanvas) {
      showError(_0xcc1460, "无效的图片元素");
      return;
    }
    if (!_0x5788f8.prompt || _0x5788f8.prompt.trim() === "") {
      showError(_0xcc1460, "请输入生成提示词");
      return;
    }
    if (_0x5788f8.strength < 0 || _0x5788f8.strength > 1) {
      showError(_0xcc1460, "强度必须在 0 到 1 之间");
      return;
    }
    const _0x52daaa = applyGridAlignment(_0x5788f8.dataMaskCanvas);
    if (!_0x52daaa) {
      console.error("[NovelAI Inpaint] Failed to generate aligned mask");
      showError(_0xcc1460, "Mask 生成失败");
      return;
    }
    const _0x1faa55 = document.createElement("canvas");
    _0x1faa55.width = _0x5788f8.dataMaskCanvas.width;
    _0x1faa55.height = _0x5788f8.dataMaskCanvas.height;
    const _0x5c24c5 = _0x1faa55.getContext("2d");
    _0x5c24c5.putImageData(_0x52daaa, 0, 0);
    const _0xf718ee = await canvasToBase64(_0x5788f8.imageCanvas);
    const _0xb1a8c5 = await canvasToBase64(_0x1faa55);
    const _0x3782d4 = stripChineseAnnotations(_0x5788f8.prompt.trim());
    const _0x2296d9 = stripChineseAnnotations(_0x5788f8.negativePrompt.trim());
    window.novelaiInpaintImage = _0xf718ee;
    window.novelaiInpaintMask = _0xb1a8c5;
    window.novelaiInpaintPrompt = _0x3782d4;
    window.novelaiInpaintNegativePrompt = _0x2296d9;
    window.novelaiInpaintStrength = _0x5788f8.strength;
    window.novelaiInpaintWidth = _0x5788f8.originalImage.width;
    window.novelaiInpaintHeight = _0x5788f8.originalImage.height;
    const _0x5b40b4 = {
      imageSize: _0x5788f8.originalImage.width + "x" + _0x5788f8.originalImage.height,
      maskSize: _0x1faa55.width + "x" + _0x1faa55.height,
      prompt: _0x3782d4,
      negativePrompt: _0x2296d9,
      strength: _0x5788f8.strength
    };
    console.log("[NovelAI Inpaint] 存储参数:", _0x5b40b4);
    const _0x4690d8 = _0x5ab2a2.dataset.change || "";
    if (!_0x4690d8.includes("{NovelAI局部重绘}")) {
      _0x5ab2a2.dataset.change = _0x4690d8 + " {NovelAI局部重绘}";
    }
    _0x5ab2a2.click();
    _0xbf00b5();
  } catch (_0x16bc4b) {
    console.error("[NovelAI Inpaint] Error during generation:", _0x16bc4b);
    showError(_0xcc1460, "生成失败: " + _0x16bc4b.message);
  }
}
export async function showNovelAIInpaintDialog(_0x422e03, _0x4ec8ac) {
  if (!_0x422e03 || !_0x422e03.src) {
    console.error("[NovelAI Inpaint] Invalid image element");
    if (typeof toastr !== "undefined") {
      toastr.error("无效的图片元素");
    }
    return;
  }
  try {
    const _0x134f1d = new Image();
    _0x134f1d.crossOrigin = "anonymous";
    await new Promise((_0x435325, _0x2bf624) => {
      _0x134f1d.onload = _0x435325;
      _0x134f1d.onerror = () => _0x2bf624(new Error("图片加载失败"));
      _0x134f1d.src = _0x422e03.src;
    });
  } catch (_0x175f20) {
    console.error("[NovelAI Inpaint] Image validation failed:", _0x175f20);
    if (typeof toastr !== "undefined") {
      toastr.error("图片加载失败，请检查图片源");
    }
    return;
  }
  const _0x8d1672 = isMobileDevice();
  const _0xc2d3a2 = {
    title: "🎨 NovelAI 局部重绘",
    isMobile: _0x8d1672
  };
  const {
    backdrop: _0x6729a7,
    dialog: _0x517158,
    closeDialog: _0x1bb0b4
  } = createUnifiedDialog(_0xc2d3a2);
  const _0x588e93 = await createCanvasContainer(_0x422e03, _0x8d1672);
  _0x517158.appendChild(_0x588e93);
  if (!_0x8d1672) {
    const _0x1e5950 = parseInt(_0x588e93.dataset.displayWidth);
    if (_0x1e5950) {
      const _0x85e678 = _0x1e5950 + 60;
      _0x517158.style.width = _0x85e678 + "px";
      _0x517158.style.maxWidth = "95vw";
    }
  }
  const _0x449bd7 = document.createElement("style");
  _0x449bd7.textContent = "\n        /* Toolbar container base styles */\n        .st-chatu8-inpaint-toolbar-container {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            padding: 10px;\n            background-color: var(--st-chatu8-bg-secondary, #2a2a4a);\n            border-radius: 8px;\n            margin-bottom: 15px;\n        }\n        \n        /* Mobile-specific styles - no separate scrollbar */\n        .st-chatu8-inpaint-toolbar-container.mobile {\n            overflow: visible;\n            /* Let the dialog handle scrolling */\n        }\n        \n        /* Desktop-specific styles */\n        .st-chatu8-inpaint-toolbar-container.desktop {\n            overflow: visible;\n            max-height: none;\n        }\n        \n        /* Toolbar styles */\n        .st-chatu8-inpaint-toolbar {\n            display: flex;\n            gap: 10px;\n            align-items: center;\n            flex-wrap: wrap;\n        }\n        \n        .st-chatu8-inpaint-brush-label {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n        }\n        \n        .st-chatu8-inpaint-brush-slider {\n            width: 100px;\n        }\n        \n        .st-chatu8-tool-btn {\n            padding: 8px 12px;\n            border: 1px solid var(--st-chatu8-border-color, #444);\n            border-radius: 6px;\n            background: var(--st-chatu8-bg-secondary, #2a2a4a);\n            color: var(--st-chatu8-text-primary, #fff);\n            cursor: pointer;\n            transition: all 0.2s;\n        }\n        .st-chatu8-tool-btn:hover {\n            background: var(--st-chatu8-accent-secondary, #3a3a5a);\n        }\n        .st-chatu8-tool-btn.active {\n            background: var(--st-chatu8-accent-primary, #4a4a8a);\n            border-color: var(--st-chatu8-accent-primary, #6a6aaa);\n        }\n        \n        /* Denoise/Strength slider styles (matching ComfyUI) */\n        .st-chatu8-inpaint-denoise-group {\n            display: flex;\n            align-items: center;\n            gap: 10px;\n        }\n        \n        .st-chatu8-inpaint-denoise-label {\n            flex-shrink: 0;\n        }\n        \n        .st-chatu8-inpaint-denoise-slider {\n            flex: 1;\n            min-width: 100px;\n        }\n        \n        .st-chatu8-inpaint-denoise-value {\n            min-width: 40px;\n            text-align: right;\n        }\n        \n        /* Autocomplete styles for inpaint dialog */\n        .st-chatu8-edit-backdrop .ch-autocomplete-results {\n            display: none;\n            position: absolute;\n            background-color: var(--st-chatu8-dropdown-list-bg, #2a2a4a);\n            border: 1px solid var(--st-chatu8-border-color, #444);\n            border-radius: 6px;\n            max-height: 150px;\n            overflow-y: auto;\n            z-index: 10;\n            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n            max-width: 100%;\n        }\n        .st-chatu8-edit-backdrop .ch-autocomplete-item {\n            padding: 8px 12px;\n            cursor: pointer;\n            color: var(--st-chatu8-dropdown-text, #fff);\n            font-size: 0.9em;\n        }\n        .st-chatu8-edit-backdrop .ch-autocomplete-item:hover {\n            background-color: var(--st-chatu8-accent-secondary, #3a3a5a);\n            color: var(--st-chatu8-text-highlight, #fff);\n        }\n        \n        /* Prompt section styles */\n        .st-chatu8-inpaint-prompt-section {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            position: relative;\n        }\n        \n        .st-chatu8-inpaint-prompt-group {\n            display: flex;\n            flex-direction: column;\n            gap: 5px;\n            position: relative;\n        }\n    ";
  _0x517158.appendChild(_0x449bd7);
  const _0x289c86 = new MaskEditorState();
  _0x289c86.displayWidth = parseInt(_0x588e93.dataset.displayWidth);
  _0x289c86.displayHeight = parseInt(_0x588e93.dataset.displayHeight);
  _0x289c86.imageCanvas = _0x588e93._imageCanvas;
  _0x289c86.displayMaskCanvas = _0x588e93._displayMaskCanvas;
  _0x289c86.dataMaskCanvas = _0x588e93._dataMaskCanvas;
  _0x289c86.displayMaskCtx = _0x289c86.displayMaskCanvas.getContext("2d", {
    willReadFrequently: true
  });
  _0x289c86.dataMaskCtx = _0x289c86.dataMaskCanvas.getContext("2d", {
    willReadFrequently: true
  });
  const _0x526990 = new Image();
  _0x526990.crossOrigin = "anonymous";
  await new Promise(_0x551724 => {
    _0x526990.onload = _0x551724;
    _0x526990.src = _0x422e03.src;
  });
  _0x289c86.originalImage = _0x526990;
  _0x289c86.brushSize = 32;
  _0x289c86.mode = "draw";
  setupDrawingEvents(_0x289c86);
  setTimeout(() => {
    saveState(_0x289c86);
  }, 0);
  const _0xb81af3 = createToolbar(_0x289c86);
  const _0x4433d1 = createParameterInputs(_0x289c86);
  const _0x1229de = createToolbarContainer(_0x8d1672, _0xb81af3, _0x4433d1);
  _0x517158.appendChild(_0x1229de);
  const _0x239a32 = createStatusDiv();
  _0x517158.appendChild(_0x239a32);
  const _0x24f24a = {
    text: "生成",
    className: "send",
    onClick: async () => {
      hideError(_0x239a32);
      const _0x31edbe = _0x39cba3.querySelector(".send");
      if (_0x31edbe) {
        _0x31edbe.disabled = true;
        _0x31edbe.style.opacity = "0.6";
        _0x31edbe.style.cursor = "not-allowed";
      }
      try {
        await handleGenerate(_0x289c86, _0x4ec8ac, _0x1bb0b4, _0x239a32);
      } finally {
        if (_0x31edbe) {
          _0x31edbe.disabled = false;
          _0x31edbe.style.opacity = "1";
          _0x31edbe.style.cursor = "pointer";
        }
      }
    }
  };
  const _0x20296b = {
    text: "关闭",
    className: "cancel",
    onClick: _0x1bb0b4
  };
  const _0x39cba3 = createButtonContainer([_0x24f24a, _0x20296b]);
  _0x517158.appendChild(_0x39cba3);
}
class MaskEditorState {
  constructor() {
    this.originalImage = null;
    this.displayWidth = 0;
    this.displayHeight = 0;
    this.brushSize = 32;
    this.mode = "draw";
    this.isDrawing = false;
    this.lastPos = null;
    this.imageCanvas = null;
    this.displayMaskCanvas = null;
    this.dataMaskCanvas = null;
    this.displayMaskCtx = null;
    this.dataMaskCtx = null;
    this.prompt = "blue eyes, highly detailed, masterpiece";
    this.negativePrompt = "";
    this.strength = 0.54;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 20;
    this.onHistoryChange = null;
  }
}
function setupDrawingEvents(_0x48a395) {
  const _0x546699 = _0x48a395.displayMaskCanvas;
  function _0x4e41e5(_0x415c25) {
    const _0x16eaa4 = _0x546699.getBoundingClientRect();
    const _0x4d259e = (_0x415c25.clientX - _0x16eaa4.left) * (_0x546699.width / _0x16eaa4.width);
    const _0x1d5c89 = (_0x415c25.clientY - _0x16eaa4.top) * (_0x546699.height / _0x16eaa4.height);
    const _0x57573c = {
      x: _0x4d259e,
      y: _0x1d5c89
    };
    return _0x57573c;
  }
  function _0x2de2df(_0x488bd0) {
    _0x488bd0.preventDefault();
    _0x48a395.isDrawing = true;
    const _0x398b1d = _0x488bd0.touches ? _0x4e41e5(_0x488bd0.touches[0]) : _0x4e41e5(_0x488bd0);
    _0x48a395.lastPos = _0x398b1d;
    drawBrush(_0x48a395, _0x398b1d.x, _0x398b1d.y);
  }
  function _0x5f251f(_0x2b672e) {
    if (!_0x48a395.isDrawing) {
      return;
    }
    _0x2b672e.preventDefault();
    const _0x10a08a = _0x2b672e.touches ? _0x4e41e5(_0x2b672e.touches[0]) : _0x4e41e5(_0x2b672e);
    if (_0x48a395.lastPos) {
      drawLine(_0x48a395, _0x48a395.lastPos.x, _0x48a395.lastPos.y, _0x10a08a.x, _0x10a08a.y);
    } else {
      drawBrush(_0x48a395, _0x10a08a.x, _0x10a08a.y);
    }
    _0x48a395.lastPos = _0x10a08a;
  }
  function _0x1b855a(_0x2e7755) {
    if (_0x48a395.isDrawing) {
      _0x2e7755.preventDefault();
      saveState(_0x48a395);
    }
    _0x48a395.isDrawing = false;
    _0x48a395.lastPos = null;
  }
  _0x546699.addEventListener("mousedown", _0x2de2df);
  _0x546699.addEventListener("mousemove", _0x5f251f);
  _0x546699.addEventListener("mouseup", _0x1b855a);
  _0x546699.addEventListener("mouseleave", _0x1b855a);
  _0x546699.addEventListener("touchstart", _0x2de2df, {
    passive: false
  });
  _0x546699.addEventListener("touchmove", _0x5f251f, {
    passive: false
  });
  _0x546699.addEventListener("touchend", _0x1b855a, {
    passive: false
  });
  _0x546699.addEventListener("touchcancel", _0x1b855a, {
    passive: false
  });
}
function applyGridAlignment(_0x3c627d, _0x591925 = 8) {
  const _0xfb2b84 = _0x3c627d.width;
  const _0x884884 = _0x3c627d.height;
  const _0x12a08c = _0x3c627d.getContext("2d", {
    willReadFrequently: true
  });
  const _0x581939 = _0x12a08c.getImageData(0, 0, _0xfb2b84, _0x884884);
  const _0x966e57 = _0x581939.data;
  const _0x4aae01 = new ImageData(_0xfb2b84, _0x884884);
  const _0x17c123 = _0x4aae01.data;
  for (let _0x34886f = 0; _0x34886f < _0x884884; _0x34886f += _0x591925) {
    for (let _0x51c7e5 = 0; _0x51c7e5 < _0xfb2b84; _0x51c7e5 += _0x591925) {
      let _0x1fbf1d = false;
      for (let _0x23a181 = 0; _0x23a181 < _0x591925 && _0x34886f + _0x23a181 < _0x884884; _0x23a181++) {
        for (let _0x523127 = 0; _0x523127 < _0x591925 && _0x51c7e5 + _0x523127 < _0xfb2b84; _0x523127++) {
          const _0xd4ecc0 = _0x51c7e5 + _0x523127;
          const _0x41daf3 = _0x34886f + _0x23a181;
          const _0x52b1e3 = (_0x41daf3 * _0xfb2b84 + _0xd4ecc0) * 4;
          if (_0x966e57[_0x52b1e3] > 128 || _0x966e57[_0x52b1e3 + 1] > 128 || _0x966e57[_0x52b1e3 + 2] > 128) {
            _0x1fbf1d = true;
            break;
          }
        }
        if (_0x1fbf1d) {
          break;
        }
      }
      const _0x1b3a50 = _0x1fbf1d ? 255 : 0;
      for (let _0x54bcf4 = 0; _0x54bcf4 < _0x591925 && _0x34886f + _0x54bcf4 < _0x884884; _0x54bcf4++) {
        for (let _0x1ba31b = 0; _0x1ba31b < _0x591925 && _0x51c7e5 + _0x1ba31b < _0xfb2b84; _0x1ba31b++) {
          const _0x26c530 = _0x51c7e5 + _0x1ba31b;
          const _0x45b6e8 = _0x34886f + _0x54bcf4;
          const _0x3158a6 = (_0x45b6e8 * _0xfb2b84 + _0x26c530) * 4;
          _0x17c123[_0x3158a6] = _0x1b3a50;
          _0x17c123[_0x3158a6 + 1] = _0x1b3a50;
          _0x17c123[_0x3158a6 + 2] = _0x1b3a50;
          _0x17c123[_0x3158a6 + 3] = 255;
        }
      }
    }
  }
  return _0x4aae01;
}
function drawBrush(_0x596f59, _0xf535dc, _0x4a8147) {
  _0x596f59.displayMaskCtx.fillStyle = _0x596f59.mode === "draw" ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 0, 0, 1)";
  _0x596f59.displayMaskCtx.beginPath();
  _0x596f59.displayMaskCtx.arc(_0xf535dc, _0x4a8147, _0x596f59.brushSize / 2, 0, Math.PI * 2);
  _0x596f59.displayMaskCtx.fill();
  _0x596f59.dataMaskCtx.fillStyle = _0x596f59.mode === "draw" ? "#FFFFFF" : "#000000";
  _0x596f59.dataMaskCtx.beginPath();
  _0x596f59.dataMaskCtx.arc(_0xf535dc, _0x4a8147, _0x596f59.brushSize / 2, 0, Math.PI * 2);
  _0x596f59.dataMaskCtx.fill();
}
function drawLine(_0x3d9152, _0x1f9ac2, _0x410fb7, _0x4fdf2d, _0x521a13) {
  const _0x58b66c = Math.sqrt((_0x4fdf2d - _0x1f9ac2) ** 2 + (_0x521a13 - _0x410fb7) ** 2);
  const _0x1c9b57 = Math.max(1, Math.ceil(_0x58b66c / (_0x3d9152.brushSize / 4)));
  for (let _0x14392e = 0; _0x14392e <= _0x1c9b57; _0x14392e++) {
    const _0x33e160 = _0x14392e / _0x1c9b57;
    const _0xe85a19 = _0x1f9ac2 + (_0x4fdf2d - _0x1f9ac2) * _0x33e160;
    const _0x3f710f = _0x410fb7 + (_0x521a13 - _0x410fb7) * _0x33e160;
    drawBrush(_0x3d9152, _0xe85a19, _0x3f710f);
  }
}
function saveState(_0x16252b) {
  _0x16252b.history = _0x16252b.history.slice(0, _0x16252b.historyIndex + 1);
  const _0x4661a8 = _0x16252b.dataMaskCanvas.toDataURL("image/png");
  _0x16252b.history.push(_0x4661a8);
  if (_0x16252b.history.length > _0x16252b.maxHistory) {
    _0x16252b.history.shift();
    _0x16252b.historyIndex = _0x16252b.history.length - 1;
  } else {
    _0x16252b.historyIndex++;
  }
  console.log("[NovelAI Inpaint] State saved. History length:", _0x16252b.history.length, "Index:", _0x16252b.historyIndex);
  if (_0x16252b.onHistoryChange) {
    _0x16252b.onHistoryChange();
  }
}
function restoreState(_0x4bae80, _0x1f31dd) {
  const _0x5163e8 = new Image();
  _0x5163e8.onload = () => {
    _0x4bae80.displayMaskCtx.clearRect(0, 0, _0x4bae80.displayMaskCanvas.width, _0x4bae80.displayMaskCanvas.height);
    _0x4bae80.displayMaskCtx.globalCompositeOperation = "source-over";
    _0x4bae80.displayMaskCtx.drawImage(_0x5163e8, 0, 0);
    const _0x351b37 = _0x4bae80.displayMaskCtx.getImageData(0, 0, _0x4bae80.displayMaskCanvas.width, _0x4bae80.displayMaskCanvas.height);
    const _0x32d963 = _0x351b37.data;
    for (let _0xe98b73 = 0; _0xe98b73 < _0x32d963.length; _0xe98b73 += 4) {
      if (_0x32d963[_0xe98b73] > 128) {
        _0x32d963[_0xe98b73] = 255;
        _0x32d963[_0xe98b73 + 1] = 0;
        _0x32d963[_0xe98b73 + 2] = 0;
        _0x32d963[_0xe98b73 + 3] = 128;
      }
    }
    _0x4bae80.displayMaskCtx.putImageData(_0x351b37, 0, 0);
    _0x4bae80.dataMaskCtx.clearRect(0, 0, _0x4bae80.dataMaskCanvas.width, _0x4bae80.dataMaskCanvas.height);
    _0x4bae80.dataMaskCtx.drawImage(_0x5163e8, 0, 0);
  };
  _0x5163e8.src = _0x1f31dd;
}
function undo(_0x581d95) {
  console.log("[NovelAI Inpaint] Undo called. Current index:", _0x581d95.historyIndex, "History length:", _0x581d95.history.length);
  if (_0x581d95.historyIndex > 0) {
    _0x581d95.historyIndex--;
    restoreState(_0x581d95, _0x581d95.history[_0x581d95.historyIndex]);
    console.log("[NovelAI Inpaint] Undo executed. New index:", _0x581d95.historyIndex);
    if (_0x581d95.onHistoryChange) {
      _0x581d95.onHistoryChange();
    }
  } else {
    console.log("[NovelAI Inpaint] Cannot undo - at beginning of history");
  }
}
function redo(_0x33b472) {
  if (_0x33b472.historyIndex < _0x33b472.history.length - 1) {
    _0x33b472.historyIndex++;
    restoreState(_0x33b472, _0x33b472.history[_0x33b472.historyIndex]);
    if (_0x33b472.onHistoryChange) {
      _0x33b472.onHistoryChange();
    }
  }
}
function canvasToBase64(_0x119a01) {
  return new Promise(_0x4de791 => {
    _0x119a01.toBlob(_0x225ae6 => {
      const _0x37ab75 = new FileReader();
      _0x37ab75.onloadend = () => _0x4de791(_0x37ab75.result);
      _0x37ab75.readAsDataURL(_0x225ae6);
    }, "image/png");
  });
}
function createToolbarContainer(_0xd71d93, _0x4a1a4e, _0x15f4aa) {
  const _0x2ddc4c = document.createElement("div");
  _0x2ddc4c.className = "st-chatu8-inpaint-toolbar-container";
  _0x2ddc4c.style.position = "relative";
  _0x2ddc4c.style.zIndex = "1";
  if (_0xd71d93) {
    _0x2ddc4c.classList.add("mobile");
  } else {
    _0x2ddc4c.classList.add("desktop");
  }
  _0x2ddc4c.appendChild(_0x4a1a4e);
  _0x2ddc4c.appendChild(_0x15f4aa);
  return _0x2ddc4c;
}
function createToolbar(_0x5548e7) {
  const _0x247699 = document.createElement("div");
  _0x247699.className = "st-chatu8-inpaint-toolbar";
  _0x247699.innerHTML = "\n        <button id=\"tool-draw\" class=\"st-chatu8-tool-btn active\" title=\"画笔\">🖌️ 画笔</button>\n        <button id=\"tool-erase\" class=\"st-chatu8-tool-btn\" title=\"橡皮\">🧽 橡皮</button>\n        <button id=\"tool-undo\" class=\"st-chatu8-tool-btn\" title=\"撤销\">⤺ 撤销</button>\n        <button id=\"tool-redo\" class=\"st-chatu8-tool-btn\" title=\"重做\">⤻ 重做</button>\n        <button id=\"tool-clear\" class=\"st-chatu8-tool-btn\" title=\"清空\">🗑️ 清空</button>\n        <button id=\"tool-preview\" class=\"st-chatu8-tool-btn\" title=\"预览蒙版\">👁️ 预览</button>\n        <label class=\"st-chatu8-inpaint-brush-label\">\n            画笔: <input type=\"range\" id=\"brush-size\" min=\"8\" max=\"150\" step=\"8\" value=\"" + _0x5548e7.brushSize + "\" class=\"st-chatu8-inpaint-brush-slider\">\n            <span id=\"brush-size-value\">" + _0x5548e7.brushSize + "</span>px\n        </label>\n    ";
  setTimeout(() => {
    const _0xa2bea4 = _0x247699.querySelector("#tool-draw");
    const _0x335366 = _0x247699.querySelector("#tool-erase");
    const _0x6ad80a = _0x247699.querySelector("#tool-undo");
    const _0x58ea3e = _0x247699.querySelector("#tool-redo");
    const _0x1fa5a9 = _0x247699.querySelector("#tool-clear");
    const _0x1543e9 = _0x247699.querySelector("#tool-preview");
    const _0x2ae155 = _0x247699.querySelector("#brush-size");
    const _0xdf0d8a = _0x247699.querySelector("#brush-size-value");
    let _0x124bb6 = true;
    function _0x2ae274() {
      _0x6ad80a.disabled = _0x5548e7.historyIndex <= 0;
      _0x58ea3e.disabled = _0x5548e7.historyIndex >= _0x5548e7.history.length - 1;
      _0x6ad80a.style.opacity = _0x6ad80a.disabled ? "0.5" : "1";
      _0x6ad80a.style.cursor = _0x6ad80a.disabled ? "not-allowed" : "pointer";
      _0x58ea3e.style.opacity = _0x58ea3e.disabled ? "0.5" : "1";
      _0x58ea3e.style.cursor = _0x58ea3e.disabled ? "not-allowed" : "pointer";
    }
    _0x5548e7.onHistoryChange = _0x2ae274;
    _0xa2bea4.onclick = () => {
      _0x5548e7.mode = "draw";
      _0xa2bea4.classList.add("active");
      _0x335366.classList.remove("active");
    };
    _0x335366.onclick = () => {
      _0x5548e7.mode = "erase";
      _0x335366.classList.add("active");
      _0xa2bea4.classList.remove("active");
    };
    _0x6ad80a.onclick = () => {
      undo(_0x5548e7);
    };
    _0x58ea3e.onclick = () => {
      redo(_0x5548e7);
    };
    _0x1fa5a9.onclick = () => {
      _0x5548e7.displayMaskCtx.fillStyle = "#000000";
      _0x5548e7.displayMaskCtx.fillRect(0, 0, _0x5548e7.displayMaskCanvas.width, _0x5548e7.displayMaskCanvas.height);
      _0x5548e7.dataMaskCtx.fillStyle = "#000000";
      _0x5548e7.dataMaskCtx.fillRect(0, 0, _0x5548e7.dataMaskCanvas.width, _0x5548e7.dataMaskCanvas.height);
      saveState(_0x5548e7);
    };
    _0x1543e9.onclick = () => {
      _0x124bb6 = !_0x124bb6;
      _0x5548e7.displayMaskCanvas.style.opacity = _0x124bb6 ? "0.6" : "0";
      _0x1543e9.textContent = _0x124bb6 ? "👁️ 预览蒙版" : "👁️‍🗨️ 显示蒙版";
    };
    _0x2ae155.oninput = _0xa1f734 => {
      _0x5548e7.brushSize = parseInt(_0xa1f734.target.value);
      _0xdf0d8a.textContent = _0x5548e7.brushSize;
    };
    _0x2ae274();
  }, 0);
  return _0x247699;
}
function createParameterInputs(_0x397ce3) {
  const _0xbac136 = document.createElement("div");
  _0xbac136.className = "st-chatu8-inpaint-prompt-section";
  _0xbac136.style.cssText = "\n        display: flex;\n        flex-direction: column;\n        gap: 10px;\n        position: relative;\n    ";
  const _0xa04887 = document.createElement("div");
  _0xa04887.className = "st-chatu8-inpaint-prompt-group";
  _0xa04887.style.cssText = "\n        display: flex;\n        flex-direction: column;\n        gap: 5px;\n        position: relative;\n    ";
  _0xa04887.innerHTML = "\n        <label style=\"display: block;\">正面提示词:</label>\n        <textarea id=\"novelai-prompt\" rows=\"2\" placeholder=\"输入生成提示词，例如: blue eyes, highly detailed, masterpiece\" \n            class=\"st-chatu8-edit-input\" style=\"resize: vertical; box-sizing: border-box;\">" + _0x397ce3.prompt + "</textarea>\n        <div class=\"ch-autocomplete-results\" id=\"positive-autocomplete\"></div>\n    ";
  const _0x3e0bbb = document.createElement("div");
  _0x3e0bbb.className = "st-chatu8-inpaint-prompt-group";
  _0x3e0bbb.style.cssText = "\n        display: flex;\n        flex-direction: column;\n        gap: 5px;\n        position: relative;\n    ";
  _0x3e0bbb.innerHTML = "\n        <label style=\"display: block;\">负面提示词:</label>\n        <textarea id=\"novelai-negative-prompt\" rows=\"2\" placeholder=\"描述不想出现的内容...\" \n            class=\"st-chatu8-edit-input\" style=\"resize: vertical; box-sizing: border-box;\">" + (_0x397ce3.negativePrompt || "") + "</textarea>\n        <div class=\"ch-autocomplete-results\" id=\"negative-autocomplete\"></div>\n    ";
  const _0x1b0b33 = document.createElement("div");
  _0x1b0b33.className = "st-chatu8-inpaint-denoise-group";
  _0x1b0b33.innerHTML = "\n        <label class=\"st-chatu8-inpaint-denoise-label\">强度：</label>\n        <input type=\"range\" id=\"novelai-strength\" min=\"0\" max=\"1\" step=\"0.01\" value=\"" + _0x397ce3.strength + "\" \n            class=\"st-chatu8-inpaint-denoise-slider\">\n        <span id=\"strength-value\" class=\"st-chatu8-inpaint-denoise-value\">" + _0x397ce3.strength.toFixed(2) + "</span>\n    ";
  _0xbac136.appendChild(_0xa04887);
  _0xbac136.appendChild(_0x3e0bbb);
  _0xbac136.appendChild(_0x1b0b33);
  setTimeout(() => {
    const _0x9f8229 = _0xbac136.querySelector("#novelai-prompt");
    const _0x113607 = _0xbac136.querySelector("#novelai-negative-prompt");
    const _0x243ece = _0xbac136.querySelector("#novelai-strength");
    const _0x199ad8 = _0xbac136.querySelector("#strength-value");
    const _0x5204fb = _0xbac136.querySelector("#positive-autocomplete");
    const _0x2f88c9 = _0xbac136.querySelector("#negative-autocomplete");
    const _0x3d63cb = (_0x1ba273, _0x171c1f) => {
      if (_0x171c1f.style.display === "none") {
        return;
      }
      _0x171c1f.style.top = _0x1ba273.offsetTop + _0x1ba273.offsetHeight + 2 + "px";
      _0x171c1f.style.left = _0x1ba273.offsetLeft + "px";
      _0x171c1f.style.width = _0x1ba273.offsetWidth + "px";
    };
    _0x9f8229.addEventListener("input", _0x329d66 => {
      _0x397ce3.prompt = _0x329d66.target.value;
      const _0x43f1ce = _0x9f8229.value;
      let _0x370d91 = _0x43f1ce.replace(/，/g, ",");
      if (_0x43f1ce !== _0x370d91) {
        const _0x59e54f = _0x9f8229.selectionStart;
        _0x9f8229.value = _0x370d91;
        _0x9f8229.setSelectionRange(_0x59e54f, _0x59e54f);
        _0x397ce3.prompt = _0x370d91;
      }
      handleAutocomplete(_0x9f8229, _0x5204fb).then(() => {
        _0x3d63cb(_0x9f8229, _0x5204fb);
      });
    });
    _0x9f8229.addEventListener("blur", () => {
      setTimeout(() => {
        if (!_0x5204fb.matches(":hover")) {
          _0x5204fb.style.display = "none";
        }
      }, 150);
    });
    _0x113607.addEventListener("input", _0xd70a10 => {
      _0x397ce3.negativePrompt = _0xd70a10.target.value;
      const _0x589246 = _0x113607.value;
      let _0x1ddae0 = _0x589246.replace(/，/g, ",");
      if (_0x589246 !== _0x1ddae0) {
        const _0x519aeb = _0x113607.selectionStart;
        _0x113607.value = _0x1ddae0;
        _0x113607.setSelectionRange(_0x519aeb, _0x519aeb);
        _0x397ce3.negativePrompt = _0x1ddae0;
      }
      handleAutocomplete(_0x113607, _0x2f88c9).then(() => {
        _0x3d63cb(_0x113607, _0x2f88c9);
      });
    });
    _0x113607.addEventListener("blur", () => {
      setTimeout(() => {
        if (!_0x2f88c9.matches(":hover")) {
          _0x2f88c9.style.display = "none";
        }
      }, 150);
    });
    _0x243ece.addEventListener("input", _0x375dbe => {
      _0x397ce3.strength = parseFloat(_0x375dbe.target.value);
      _0x199ad8.textContent = _0x397ce3.strength.toFixed(2);
    });
  }, 0);
  return _0xbac136;
}
function createStatusDiv() {
  const _0x216827 = document.createElement("div");
  _0x216827.style.cssText = "\n        margin: 0 auto 15px auto;\n        padding: 10px;\n        background: #ef9a9a;\n        color: #c62828;\n        border-radius: 4px;\n        font-weight: bold;\n        text-align: center;\n        display: none;\n    ";
  return _0x216827;
}
function showError(_0x4fc38c, _0x4c695a) {
  _0x4fc38c.textContent = _0x4c695a;
  _0x4fc38c.style.display = "block";
}
function hideError(_0x30e54d) {
  _0x30e54d.style.display = "none";
  _0x30e54d.textContent = "";
}
function isMobileDevice() {
  return window.innerWidth <= 768;
}
async function createCanvasContainer(_0x192a7b, _0xf77c6e) {
  const _0x2cf708 = new Image();
  _0x2cf708.crossOrigin = "anonymous";
  await new Promise((_0x3be93d, _0xa7bc81) => {
    _0x2cf708.onload = _0x3be93d;
    _0x2cf708.onerror = () => _0xa7bc81(new Error("图片加载失败"));
    _0x2cf708.src = _0x192a7b.src;
  });
  const _0x1ae39c = _0x2cf708.width;
  const _0x5d2d4c = _0x2cf708.height;
  const _0x41d745 = _0xf77c6e ? Math.min(_0x1ae39c, window.innerWidth - 60) : Math.min(_0x1ae39c, 800);
  const _0x34d6b7 = _0x41d745 / _0x1ae39c;
  const _0x1c8735 = Math.floor(_0x1ae39c * _0x34d6b7);
  const _0x5aa708 = Math.floor(_0x5d2d4c * _0x34d6b7);
  const _0x2c0d30 = {
    original: _0x1ae39c + "x" + _0x5d2d4c,
    display: _0x1c8735 + "x" + _0x5aa708,
    scale: _0x34d6b7
  };
  console.log("[NovelAI Inpaint] Canvas setup:", _0x2c0d30);
  const _0x4bd9a9 = document.createElement("div");
  _0x4bd9a9.style.cssText = "\n        position: relative;\n        width: " + _0x1c8735 + "px;\n        height: " + _0x5aa708 + "px;\n        flex-shrink: 0;\n        align-self: center;\n        z-index: 0;\n        overflow: hidden;\n        box-sizing: content-box;\n    ";
  _0x4bd9a9.className = "st-chatu8-inpaint-editor-container";
  const _0xfb494c = document.createElement("canvas");
  _0xfb494c.width = _0x1ae39c;
  _0xfb494c.height = _0x5d2d4c;
  _0xfb494c.style.cssText = "\n        position: absolute; \n        top: 0; \n        left: 0;\n        width: " + _0x1c8735 + "px;    \n        height: " + _0x5aa708 + "px;\n    ";
  const _0x5aabeb = _0xfb494c.getContext("2d");
  _0x5aabeb.drawImage(_0x2cf708, 0, 0);
  const _0x5cd934 = document.createElement("canvas");
  _0x5cd934.width = _0x1ae39c;
  _0x5cd934.height = _0x5d2d4c;
  _0x5cd934.style.cssText = "\n        position: absolute; \n        top: 0; \n        left: 0;\n        width: " + _0x1c8735 + "px;    \n        height: " + _0x5aa708 + "px;\n        cursor: crosshair; \n        opacity: 0.6;\n    ";
  const _0x2a5a7f = _0x5cd934.getContext("2d", {
    willReadFrequently: true
  });
  _0x2a5a7f.fillStyle = "#000000";
  _0x2a5a7f.fillRect(0, 0, _0x1ae39c, _0x5d2d4c);
  const _0xdfde74 = document.createElement("canvas");
  _0xdfde74.width = _0x1ae39c;
  _0xdfde74.height = _0x5d2d4c;
  const _0x440829 = _0xdfde74.getContext("2d", {
    willReadFrequently: true
  });
  _0x440829.fillStyle = "#000000";
  _0x440829.fillRect(0, 0, _0x1ae39c, _0x5d2d4c);
  _0x4bd9a9.appendChild(_0xfb494c);
  _0x4bd9a9.appendChild(_0x5cd934);
  _0x4bd9a9.dataset.displayWidth = _0x1c8735;
  _0x4bd9a9.dataset.displayHeight = _0x5aa708;
  _0x4bd9a9.dataset.originalWidth = _0x1ae39c;
  _0x4bd9a9.dataset.originalHeight = _0x5d2d4c;
  _0x4bd9a9._imageCanvas = _0xfb494c;
  _0x4bd9a9._displayMaskCanvas = _0x5cd934;
  _0x4bd9a9._dataMaskCanvas = _0xdfde74;
  return _0x4bd9a9;
}