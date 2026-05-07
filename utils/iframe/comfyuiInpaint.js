import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
import { addLog, stripChineseAnnotations } from "../utils.js";
import { handleAutocomplete } from "./autocomplete.js";
import { createUnifiedDialog, createUnifiedInput, createButtonContainer } from "./dialogs.js";
class MaskEditor {
  constructor(_0x35cdd1, _0x4778b7) {
    this.container = _0x35cdd1;
    this.imageUrl = _0x4778b7;
    this.brushSize = extension_settings[extensionName]?.inpaint_brush_size || 30;
    this.featherRadius = 10;
    this.mode = "draw";
    this.isDrawing = false;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 20;
    this.init();
  }
  async init() {
    this.container.style.cssText = "position: relative; display: flex; flex-direction: column; align-items: center;";
    this.originalImage = new Image();
    this.originalImage.crossOrigin = "anonymous";
    await new Promise((_0x47ed95, _0x28ebf5) => {
      this.originalImage.onload = _0x47ed95;
      this.originalImage.onerror = _0x28ebf5;
      this.originalImage.src = this.imageUrl;
    });
    const _0x2ea674 = window.top.innerWidth <= 768;
    const _0x29e971 = _0x2ea674 ? Math.min(this.originalImage.width, window.top.innerWidth - 60) : Math.min(this.originalImage.width, 800);
    const _0x2a6878 = _0x29e971 / this.originalImage.width;
    this.displayWidth = Math.floor(this.originalImage.width * _0x2a6878);
    this.displayHeight = Math.floor(this.originalImage.height * _0x2a6878);
    this.canvasContainer = document.createElement("div");
    this.canvasContainer.style.cssText = "position: relative; width: " + this.displayWidth + "px; height: " + this.displayHeight + "px;";
    this.imageCanvas = document.createElement("canvas");
    this.imageCanvas.width = this.displayWidth;
    this.imageCanvas.height = this.displayHeight;
    this.imageCanvas.style.cssText = "position: absolute; top: 0; left: 0;";
    const _0x82cb29 = this.imageCanvas.getContext("2d");
    _0x82cb29.drawImage(this.originalImage, 0, 0, this.displayWidth, this.displayHeight);
    this.maskCanvas = document.createElement("canvas");
    this.maskCanvas.width = this.displayWidth;
    this.maskCanvas.height = this.displayHeight;
    this.maskCanvas.style.cssText = "position: absolute; top: 0; left: 0; cursor: crosshair; opacity: 0.6;";
    this.maskCtx = this.maskCanvas.getContext("2d");
    this.maskCtx.fillStyle = "#000000";
    this.maskCtx.fillRect(0, 0, this.displayWidth, this.displayHeight);
    this.canvasContainer.appendChild(this.imageCanvas);
    this.canvasContainer.appendChild(this.maskCanvas);
    this.container.appendChild(this.canvasContainer);
    this.bindEvents();
    this.saveState();
  }
  bindEvents() {
    const _0x31b72e = _0x1775c7 => {
      const _0x95ed1d = this.maskCanvas.getBoundingClientRect();
      const _0x4cae79 = _0x1775c7.touches ? _0x1775c7.touches[0].clientX : _0x1775c7.clientX;
      const _0x360307 = _0x1775c7.touches ? _0x1775c7.touches[0].clientY : _0x1775c7.clientY;
      return {
        x: _0x4cae79 - _0x95ed1d.left,
        y: _0x360307 - _0x95ed1d.top
      };
    };
    const _0x25b309 = _0x356347 => {
      _0x356347.preventDefault();
      this.isDrawing = true;
      this.lastPos = _0x31b72e(_0x356347);
      this.draw(this.lastPos);
    };
    const _0x4d0878 = _0x281276 => {
      if (!this.isDrawing) {
        return;
      }
      _0x281276.preventDefault();
      const _0x4c22ef = _0x31b72e(_0x281276);
      this.drawLine(this.lastPos, _0x4c22ef);
      this.lastPos = _0x4c22ef;
    };
    const _0x2e6e28 = _0xb059b8 => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveState();
      }
    };
    this.maskCanvas.addEventListener("mousedown", _0x25b309);
    this.maskCanvas.addEventListener("mousemove", _0x4d0878);
    this.maskCanvas.addEventListener("mouseup", _0x2e6e28);
    this.maskCanvas.addEventListener("mouseleave", _0x2e6e28);
    this.maskCanvas.addEventListener("touchstart", _0x25b309, {
      passive: false
    });
    this.maskCanvas.addEventListener("touchmove", _0x4d0878, {
      passive: false
    });
    this.maskCanvas.addEventListener("touchend", _0x2e6e28);
    this.maskCanvas.addEventListener("touchcancel", _0x2e6e28);
  }
  draw(_0x317ac5) {
    this.maskCtx.beginPath();
    this.maskCtx.arc(_0x317ac5.x, _0x317ac5.y, this.brushSize / 2, 0, Math.PI * 2);
    this.maskCtx.fillStyle = this.mode === "draw" ? "#FFFFFF" : "#000000";
    this.maskCtx.fill();
  }
  drawLine(_0x16456d, _0x430eb5) {
    this.maskCtx.beginPath();
    this.maskCtx.moveTo(_0x16456d.x, _0x16456d.y);
    this.maskCtx.lineTo(_0x430eb5.x, _0x430eb5.y);
    this.maskCtx.strokeStyle = this.mode === "draw" ? "#FFFFFF" : "#000000";
    this.maskCtx.lineWidth = this.brushSize;
    this.maskCtx.lineCap = "round";
    this.maskCtx.lineJoin = "round";
    this.maskCtx.stroke();
  }
  saveState() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(this.maskCanvas.toDataURL());
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    this.historyIndex = this.history.length - 1;
  }
  setBrushSize(_0x1f1844) {
    this.brushSize = Math.max(5, Math.min(100, _0x1f1844));
  }
  setFeatherRadius(_0x296365) {
    this.featherRadius = Math.max(0, Math.min(50, _0x296365));
  }
  setMode(_0x19ea64) {
    this.mode = _0x19ea64;
  }
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState(this.history[this.historyIndex]);
    }
  }
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState(this.history[this.historyIndex]);
    }
  }
  restoreState(_0x1ef635) {
    const _0x578412 = new Image();
    _0x578412.onload = () => {
      this.maskCtx.clearRect(0, 0, this.displayWidth, this.displayHeight);
      this.maskCtx.drawImage(_0x578412, 0, 0);
    };
    _0x578412.src = _0x1ef635;
  }
  clear() {
    this.maskCtx.fillStyle = "#000000";
    this.maskCtx.fillRect(0, 0, this.displayWidth, this.displayHeight);
    this.saveState();
  }
  async getOriginalBlob() {
    const _0x5965e9 = document.createElement("canvas");
    _0x5965e9.width = this.originalImage.width;
    _0x5965e9.height = this.originalImage.height;
    const _0xc4e5e2 = _0x5965e9.getContext("2d");
    _0xc4e5e2.drawImage(this.originalImage, 0, 0);
    return new Promise(_0x1de702 => {
      _0x5965e9.toBlob(_0x1de702, "image/png");
    });
  }
  applyGaussianBlur(_0xc8130d, _0x3af8a1) {
    try {
      if (_0x3af8a1 === 0) {
        return _0xc8130d;
      }
      const _0x5d73a7 = _0xc8130d.width;
      const _0x3d283f = _0xc8130d.height;
      const _0x4445e8 = _0xc8130d.getContext("2d");
      const _0x54a12e = _0x4445e8.getImageData(0, 0, _0x5d73a7, _0x3d283f);
      const _0x2efe4a = _0x54a12e.data;
      const _0x1aa65c = document.createElement("canvas");
      _0x1aa65c.width = _0x5d73a7;
      _0x1aa65c.height = _0x3d283f;
      const _0x14a759 = _0x1aa65c.getContext("2d");
      const _0xee0aea = _0x14a759.createImageData(_0x5d73a7, _0x3d283f);
      const _0x674916 = _0xee0aea.data;
      const _0x17af36 = new Float32Array(_0x5d73a7 * _0x3d283f);
      const _0x96e8de = _0x3af8a1;
      for (let _0x3f4745 = 0; _0x3f4745 < _0x17af36.length; _0x3f4745++) {
        _0x17af36[_0x3f4745] = _0x96e8de + 1;
      }
      const _0x459fec = [];
      for (let _0x499eb2 = 0; _0x499eb2 < _0x3d283f; _0x499eb2++) {
        for (let _0x5172c6 = 0; _0x5172c6 < _0x5d73a7; _0x5172c6++) {
          const _0x123f2f = (_0x499eb2 * _0x5d73a7 + _0x5172c6) * 4;
          const _0x183c7a = _0x2efe4a[_0x123f2f];
          if (_0x183c7a > 128) {
            const _0x30ee63 = {
              x: _0x5172c6,
              y: _0x499eb2
            };
            _0x459fec.push(_0x30ee63);
            _0x17af36[_0x499eb2 * _0x5d73a7 + _0x5172c6] = 0;
          }
        }
      }
      for (let _0x55fc8d = 0; _0x55fc8d < _0x3d283f; _0x55fc8d++) {
        for (let _0x5f46c5 = 0; _0x5f46c5 < _0x5d73a7; _0x5f46c5++) {
          const _0x3b2f88 = _0x55fc8d * _0x5d73a7 + _0x5f46c5;
          if (_0x17af36[_0x3b2f88] === 0) {
            continue;
          }
          let _0x2427a8 = _0x96e8de + 1;
          const _0x15aaa5 = Math.min(_0x96e8de + 1, Math.max(_0x5d73a7, _0x3d283f));
          for (let _0x59052e = -_0x15aaa5; _0x59052e <= _0x15aaa5; _0x59052e++) {
            for (let _0x40a72c = -_0x15aaa5; _0x40a72c <= _0x15aaa5; _0x40a72c++) {
              const _0x150a34 = _0x5f46c5 + _0x40a72c;
              const _0x509fe0 = _0x55fc8d + _0x59052e;
              if (_0x150a34 < 0 || _0x150a34 >= _0x5d73a7 || _0x509fe0 < 0 || _0x509fe0 >= _0x3d283f) {
                continue;
              }
              const _0x3a9088 = _0x509fe0 * _0x5d73a7 + _0x150a34;
              if (_0x17af36[_0x3a9088] === 0) {
                const _0x87e46d = Math.sqrt(_0x40a72c * _0x40a72c + _0x59052e * _0x59052e);
                _0x2427a8 = Math.min(_0x2427a8, _0x87e46d);
              }
            }
          }
          _0x17af36[_0x3b2f88] = _0x2427a8;
        }
      }
      for (let _0x3a2273 = 0; _0x3a2273 < _0x3d283f; _0x3a2273++) {
        for (let _0x32e2fe = 0; _0x32e2fe < _0x5d73a7; _0x32e2fe++) {
          const _0x610382 = (_0x3a2273 * _0x5d73a7 + _0x32e2fe) * 4;
          const _0x5f3c3b = _0x17af36[_0x3a2273 * _0x5d73a7 + _0x32e2fe];
          let _0x5203f3;
          if (_0x5f3c3b === 0) {
            _0x5203f3 = 255;
          } else if (_0x5f3c3b <= _0x96e8de) {
            _0x5203f3 = Math.round((1 - _0x5f3c3b / _0x96e8de) * 255);
          } else {
            _0x5203f3 = 0;
          }
          _0x674916[_0x610382] = _0x5203f3;
          _0x674916[_0x610382 + 1] = _0x5203f3;
          _0x674916[_0x610382 + 2] = _0x5203f3;
          _0x674916[_0x610382 + 3] = 255;
        }
      }
      _0x14a759.putImageData(_0xee0aea, 0, 0);
      return _0x1aa65c;
    } catch (_0x41a9c3) {
      console.error("[Feathering] 羽化处理失败:", _0x41a9c3);
      addLog("[Feathering] 羽化处理失败，使用原始遮罩");
      return _0xc8130d;
    }
  }
  async getMaskBlobWithFeathering() {
    const _0x6261cb = document.createElement("canvas");
    _0x6261cb.width = this.originalImage.width;
    _0x6261cb.height = this.originalImage.height;
    const _0x251fb4 = _0x6261cb.getContext("2d");
    _0x251fb4.drawImage(this.maskCanvas, 0, 0, this.originalImage.width, this.originalImage.height);
    const _0x101195 = this.applyGaussianBlur(_0x6261cb, this.featherRadius);
    return new Promise(_0x3c77e4 => {
      _0x101195.toBlob(_0x3c77e4, "image/png");
    });
  }
  async getMaskBlob() {
    return this.getMaskBlobWithFeathering();
  }
  destroy() {
    this.container.innerHTML = "";
  }
}
function isMobileDevice() {
  return window.top.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function createToolbarContainer(_0x4c2bec, _0x25c652, _0x1126e3) {
  const _0x1e296d = document.createElement("div");
  _0x1e296d.className = "st-chatu8-inpaint-toolbar-container";
  if (_0x4c2bec) {
    _0x1e296d.classList.add("mobile");
  } else {
    _0x1e296d.classList.add("desktop");
  }
  _0x1e296d.appendChild(_0x25c652);
  _0x1e296d.appendChild(_0x1126e3);
  return _0x1e296d;
}
function calculateToolbarMaxHeight(_0x14fc2a, _0x535ddb, _0x168547, _0x50c798) {
  const _0x151249 = _0x14fc2a?.clientHeight || 0;
  const _0x56fe98 = _0x535ddb?.clientHeight || 0;
  const _0x108d9a = _0x168547?.clientHeight || 0;
  const _0x12249a = _0x50c798?.clientHeight || 0;
  const _0x380e86 = 50;
  const _0x414f18 = 40;
  const _0x5bc0d5 = _0x151249 - _0x56fe98 - _0x108d9a - _0x12249a - _0x380e86 - _0x414f18;
  return Math.max(100, _0x5bc0d5);
}
export async function showComfyUIInpaintDialog(_0x51c903, _0x3e8583) {
  const _0x5f4645 = document;
  const _0x5da0a3 = isMobileDevice();
  const {
    backdrop: _0x3e0095,
    dialog: _0x54b18e,
    closeDialog: _0x3e7a0b
  } = createUnifiedDialog({
    title: "🎨 ComfyUI 局部重绘",
    isMobile: _0x5da0a3
  });
  const _0x3bce2c = _0x5f4645.createElement("div");
  _0x3bce2c.id = "inpaint-editor-container";
  _0x3bce2c.className = "st-chatu8-inpaint-editor-container";
  _0x54b18e.appendChild(_0x3bce2c);
  const _0x3c3223 = extension_settings[extensionName]?.inpaint_positive_prompt || "";
  const _0x14c093 = extension_settings[extensionName]?.inpaint_negative_prompt || "";
  const _0xf4d7ce = extension_settings[extensionName]?.inpaint_denoise || "0.75";
  const _0x5e72ca = extension_settings[extensionName]?.inpaint_feather_radius || 0;
  const _0xfbbfdc = _0x5f4645.createElement("div");
  _0xfbbfdc.className = "st-chatu8-inpaint-toolbar";
  _0xfbbfdc.innerHTML = "\n        <button id=\"tool-draw\" class=\"st-chatu8-tool-btn active\" title=\"画笔\">🖌️ 画笔</button>\n        <button id=\"tool-erase\" class=\"st-chatu8-tool-btn\" title=\"橡皮\">🧽 橡皮</button>\n        <button id=\"tool-undo\" class=\"st-chatu8-tool-btn\" title=\"撤销\">⤺ 撤销</button>\n        <button id=\"tool-redo\" class=\"st-chatu8-tool-btn\" title=\"重做\">⤻ 重做</button>\n        <button id=\"tool-clear\" class=\"st-chatu8-tool-btn\" title=\"清空\">🗑️ 清空</button>\n        <label class=\"st-chatu8-inpaint-brush-label\">\n            画笔大小: <input type=\"range\" id=\"brush-size\" min=\"5\" max=\"100\" value=\"30\" class=\"st-chatu8-inpaint-brush-slider\">\n            <span id=\"brush-size-value\">30</span>px\n        </label>\n        <label class=\"st-chatu8-inpaint-brush-label\">\n            羽化强度: <input type=\"range\" id=\"feather-radius\" min=\"0\" max=\"50\" value=\"" + _0x5e72ca + "\" class=\"st-chatu8-inpaint-brush-slider\">\n            <span id=\"feather-radius-value\">" + _0x5e72ca + "</span>px\n        </label>\n    ";
  const _0x5c738f = _0x5f4645.createElement("style");
  _0x5c738f.textContent = "\n        /* Toolbar container base styles */\n        .st-chatu8-inpaint-toolbar-container {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            padding: 10px;\n            background-color: var(--st-chatu8-bg-secondary, #2a2a4a);\n            border-radius: 8px;\n            margin-bottom: 15px;\n        }\n        \n        /* Mobile-specific styles - no separate scrollbar */\n        .st-chatu8-inpaint-toolbar-container.mobile {\n            overflow: visible;\n            /* Let the dialog handle scrolling */\n        }\n        \n        /* Desktop-specific styles */\n        .st-chatu8-inpaint-toolbar-container.desktop {\n            overflow: visible;\n            max-height: none;\n        }\n        \n        /* Ensure toolbar items wrap properly */\n        .st-chatu8-inpaint-toolbar {\n            flex-wrap: wrap;\n        }\n        \n        /* Toolbar styles */\n        .st-chatu8-inpaint-toolbar {\n            display: flex;\n            gap: 10px;\n            align-items: center;\n            flex-wrap: wrap;\n        }\n        \n        .st-chatu8-inpaint-brush-label {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n        }\n        \n        .st-chatu8-inpaint-brush-slider {\n            width: 100px;\n        }\n        \n        .st-chatu8-tool-btn {\n            padding: 8px 12px;\n            border: 1px solid var(--st-chatu8-border-color, #444);\n            border-radius: 6px;\n            background: var(--st-chatu8-bg-secondary, #2a2a4a);\n            color: var(--st-chatu8-text-primary, #fff);\n            cursor: pointer;\n            transition: all 0.2s;\n        }\n        .st-chatu8-tool-btn:hover {\n            background: var(--st-chatu8-accent-secondary, #3a3a5a);\n        }\n        .st-chatu8-tool-btn.active {\n            background: var(--st-chatu8-accent-primary, #4a4a8a);\n            border-color: var(--st-chatu8-accent-primary, #6a6aaa);\n        }\n        \n        /* Autocomplete styles for inpaint dialog */\n        .st-chatu8-edit-backdrop .ch-autocomplete-results {\n            display: none;\n            position: absolute;\n            background-color: var(--st-chatu8-dropdown-list-bg, #2a2a4a);\n            border: 1px solid var(--st-chatu8-border-color, #444);\n            border-radius: 6px;\n            max-height: 150px;\n            overflow-y: auto;\n            z-index: 10;\n            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n            max-width: 100%;\n        }\n        .st-chatu8-edit-backdrop .ch-autocomplete-item {\n            padding: 8px 12px;\n            cursor: pointer;\n            color: var(--st-chatu8-dropdown-text, #fff);\n            font-size: 0.9em;\n        }\n        .st-chatu8-edit-backdrop .ch-autocomplete-item:hover {\n            background-color: var(--st-chatu8-accent-secondary, #3a3a5a);\n            color: var(--st-chatu8-text-highlight, #fff);\n        }\n        \n        /* Prompt section styles */\n        .st-chatu8-inpaint-prompt-section {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            position: relative;\n        }\n        \n        .st-chatu8-inpaint-prompt-group {\n            display: flex;\n            flex-direction: column;\n            gap: 5px;\n            position: relative;\n        }\n        \n        .st-chatu8-inpaint-denoise-group {\n            display: flex;\n            align-items: center;\n            gap: 10px;\n        }\n        \n        .st-chatu8-inpaint-denoise-label {\n            flex-shrink: 0;\n        }\n        \n        .st-chatu8-inpaint-denoise-slider {\n            flex: 1;\n            min-width: 100px;\n        }\n        \n        .st-chatu8-inpaint-denoise-value {\n            min-width: 40px;\n            text-align: right;\n        }\n    ";
  _0x54b18e.appendChild(_0x5c738f);
  const _0x2cba6d = "\n        <div class=\"st-chatu8-inpaint-denoise-group\">\n            <label class=\"st-chatu8-inpaint-denoise-label\">重绘幅度：</label>\n            <input type=\"range\" id=\"inpaint-denoise\" min=\"0\" max=\"1\" step=\"0.05\" value=\"" + _0xf4d7ce + "\" \n                class=\"st-chatu8-inpaint-denoise-slider\">\n            <span id=\"denoise-value\" class=\"st-chatu8-inpaint-denoise-value\">" + _0xf4d7ce + "</span>\n        </div>\n    ";
  const _0x3e85db = _0x5f4645.createElement("div");
  _0x3e85db.innerHTML = _0x2cba6d;
  const _0x5bc147 = createToolbarContainer(_0x5da0a3, _0xfbbfdc, _0x3e85db);
  _0x54b18e.appendChild(_0x5bc147);
  const _0x278220 = _0x5f4645.createElement("div");
  _0x278220.className = "st-chatu8-inpaint-prompt-section";
  _0x278220.innerHTML = "\n        <div class=\"st-chatu8-inpaint-prompt-group\">\n            <label>正面提示词（可选）：</label>\n            <textarea id=\"inpaint-positive-prompt\" rows=\"2\" placeholder=\"描述重绘区域想要的内容...\"\n                class=\"st-chatu8-edit-input\">" + _0x3c3223 + "</textarea>\n            <div class=\"ch-autocomplete-results\" id=\"positive-autocomplete\"></div>\n        </div>\n        <div class=\"st-chatu8-inpaint-prompt-group\">\n            <label>负面提示词（可选）：</label>\n            <textarea id=\"inpaint-negative-prompt\" rows=\"2\" placeholder=\"描述不想出现的内容...\"\n                class=\"st-chatu8-edit-input\">" + _0x14c093 + "</textarea>\n            <div class=\"ch-autocomplete-results\" id=\"negative-autocomplete\"></div>\n        </div>\n    ";
  _0x54b18e.appendChild(_0x278220);
  const _0x3927f9 = async () => {
    try {
      const _0x33bd65 = stripChineseAnnotations(_0x54b18e.querySelector("#inpaint-positive-prompt").value.trim());
      const _0x500f3c = stripChineseAnnotations(_0x54b18e.querySelector("#inpaint-negative-prompt").value.trim());
      const _0x143717 = parseFloat(_0x54b18e.querySelector("#inpaint-denoise").value);
      const _0x5b716e = _0x54b18e.querySelector("#inpaint-submit");
      _0x5b716e.disabled = true;
      _0x5b716e.textContent = "上传中...";
      const _0x5f4368 = await _0x3dc5c8.getOriginalBlob();
      const _0x4abf6b = await _0x3dc5c8.getMaskBlob();
      addLog("[Inpaint] 准备上传图片和遮罩到ComfyUI...");
      const _0x51d0f8 = extension_settings[extensionName]?.comfyuiUrl?.trim();
      if (!_0x51d0f8) {
        throw new Error("请先在设置中配置ComfyUI地址");
      }
      const _0x3dbf16 = await uploadToComfyUI(_0x5f4368, "inpaint_image.png", _0x51d0f8);
      const _0x37834 = await uploadToComfyUI(_0x4abf6b, "inpaint_mask.png", _0x51d0f8);
      addLog("[Inpaint] 上传成功: image=" + _0x3dbf16 + ", mask=" + _0x37834);
      window.comfyuiInpaintImage = _0x3dbf16;
      window.comfyuiInpaintMask = _0x37834;
      window.comfyuiInpaintPositivePrompt = _0x33bd65;
      window.comfyuiInpaintNegativePrompt = _0x500f3c;
      window.comfyuiInpaintDenoise = _0x143717;
      if (extension_settings[extensionName]) {
        extension_settings[extensionName].inpaint_positive_prompt = _0x33bd65;
        extension_settings[extensionName].inpaint_negative_prompt = _0x500f3c;
        extension_settings[extensionName].inpaint_denoise = _0x143717.toString();
      }
      const _0x3532f8 = _0x3e8583.dataset.change || "";
      if (!_0x3532f8.includes("{局部重绘}")) {
        _0x3e8583.dataset.change = _0x3532f8 + " {局部重绘}";
      }
      addLog("[Inpaint] 准备触发生成");
      _0x3e7a0b();
      _0x3e8583.click();
    } catch (_0x336384) {
      console.error("发送重绘失败:", _0x336384);
      addLog("[Inpaint] 发送失败: " + _0x336384.message);
      const _0x387392 = _0x54b18e.querySelector("#inpaint-submit");
      _0x387392.disabled = false;
      _0x387392.textContent = "发送重绘";
      if (typeof toastr !== "undefined") {
        toastr.error("发送重绘失败: " + _0x336384.message);
      }
    }
  };
  const _0x4cad4c = createButtonContainer([{
    text: "发送重绘",
    className: "send",
    onClick: _0x3927f9
  }, {
    text: "取消",
    className: "cancel",
    onClick: _0x3e7a0b
  }]);
  _0x4cad4c.querySelector(".st-chatu8-edit-button.send").id = "inpaint-submit";
  _0x54b18e.appendChild(_0x4cad4c);
  _0x3e0095.appendChild(_0x54b18e);
  _0x5f4645.body.appendChild(_0x3e0095);
  let _0x3dc5c8 = null;
  try {
    _0x3dc5c8 = new MaskEditor(_0x3bce2c, _0x51c903.src);
    await new Promise(_0x524567 => setTimeout(_0x524567, 100));
    _0x3dc5c8.setFeatherRadius(_0x5e72ca);
    if (!_0x5da0a3 && _0x3dc5c8.displayWidth) {
      const _0xfca08 = _0x3dc5c8.displayWidth + 60;
      _0x54b18e.style.width = _0xfca08 + "px";
      _0x54b18e.style.maxWidth = "95vw";
    }
  } catch (_0x3bfae8) {
    console.error("遮罩编辑器初始化失败:", _0x3bfae8);
    addLog("[Inpaint] 编辑器初始化失败: " + _0x3bfae8.message);
    _0x3e0095.remove();
    if (typeof toastr !== "undefined") {
      toastr.error("遮罩编辑器初始化失败");
    }
    return;
  }
  const _0x237e53 = _0x54b18e.querySelector("#tool-draw");
  const _0x6372ef = _0x54b18e.querySelector("#tool-erase");
  const _0x12b322 = _0x54b18e.querySelector("#brush-size");
  const _0x424a84 = _0x54b18e.querySelector("#brush-size-value");
  _0x237e53.onclick = () => {
    _0x3dc5c8.setMode("draw");
    _0x237e53.classList.add("active");
    _0x6372ef.classList.remove("active");
  };
  _0x6372ef.onclick = () => {
    _0x3dc5c8.setMode("erase");
    _0x6372ef.classList.add("active");
    _0x237e53.classList.remove("active");
  };
  _0x54b18e.querySelector("#tool-undo").onclick = () => _0x3dc5c8.undo();
  _0x54b18e.querySelector("#tool-redo").onclick = () => _0x3dc5c8.redo();
  _0x54b18e.querySelector("#tool-clear").onclick = () => _0x3dc5c8.clear();
  _0x12b322.oninput = _0x2427d4 => {
    const _0x42de8e = parseInt(_0x2427d4.target.value);
    _0x3dc5c8.setBrushSize(_0x42de8e);
    _0x424a84.textContent = _0x42de8e;
  };
  const _0x17c425 = _0x54b18e.querySelector("#feather-radius");
  const _0xc0b7b = _0x54b18e.querySelector("#feather-radius-value");
  _0x17c425.oninput = _0x1ab568 => {
    const _0x314283 = parseInt(_0x1ab568.target.value);
    _0x3dc5c8.setFeatherRadius(_0x314283);
    _0xc0b7b.textContent = _0x314283;
    if (extension_settings[extensionName]) {
      extension_settings[extensionName].inpaint_feather_radius = _0x314283;
    }
  };
  const _0x230ca6 = _0x54b18e.querySelector("#inpaint-denoise");
  const _0x5b5e9c = _0x54b18e.querySelector("#denoise-value");
  _0x230ca6.oninput = _0x1d70e7 => {
    const _0x256138 = parseFloat(_0x1d70e7.target.value);
    _0x5b5e9c.textContent = _0x256138.toFixed(2);
  };
  const _0x1b9bb6 = _0x54b18e.querySelector("#inpaint-positive-prompt");
  const _0x5218a0 = _0x54b18e.querySelector("#inpaint-negative-prompt");
  const _0x529b71 = _0x54b18e.querySelector("#positive-autocomplete");
  const _0x13e77e = _0x54b18e.querySelector("#negative-autocomplete");
  const _0xbf40aa = (_0x2ca6e4, _0xc035c8) => {
    if (_0xc035c8.style.display === "none") {
      return;
    }
    _0xc035c8.style.top = _0x2ca6e4.offsetTop + _0x2ca6e4.offsetHeight + 2 + "px";
    _0xc035c8.style.left = _0x2ca6e4.offsetLeft + "px";
    _0xc035c8.style.width = _0x2ca6e4.offsetWidth + "px";
  };
  _0x1b9bb6.addEventListener("input", () => {
    const _0x3e504d = _0x1b9bb6.value;
    let _0x159f5c = _0x3e504d.replace(/，/g, ",");
    if (_0x3e504d !== _0x159f5c) {
      const _0x6f90f = _0x1b9bb6.selectionStart;
      _0x1b9bb6.value = _0x159f5c;
      _0x1b9bb6.setSelectionRange(_0x6f90f, _0x6f90f);
    }
    handleAutocomplete(_0x1b9bb6, _0x529b71).then(() => {
      _0xbf40aa(_0x1b9bb6, _0x529b71);
    });
  });
  _0x1b9bb6.addEventListener("blur", () => {
    setTimeout(() => {
      if (!_0x529b71.matches(":hover")) {
        _0x529b71.style.display = "none";
      }
    }, 150);
  });
  _0x5218a0.addEventListener("input", () => {
    const _0x17abd7 = _0x5218a0.value;
    let _0x4291d6 = _0x17abd7.replace(/，/g, ",");
    if (_0x17abd7 !== _0x4291d6) {
      const _0x29adc8 = _0x5218a0.selectionStart;
      _0x5218a0.value = _0x4291d6;
      _0x5218a0.setSelectionRange(_0x29adc8, _0x29adc8);
    }
    handleAutocomplete(_0x5218a0, _0x13e77e).then(() => {
      _0xbf40aa(_0x5218a0, _0x13e77e);
    });
  });
  _0x5218a0.addEventListener("blur", () => {
    setTimeout(() => {
      if (!_0x13e77e.matches(":hover")) {
        _0x13e77e.style.display = "none";
      }
    }, 150);
  });
  _0x54b18e.querySelector("#inpaint-close").onclick = _0x3e7a0b;
  _0x54b18e.querySelector("#inpaint-cancel").onclick = _0x3e7a0b;
  overlay.onclick = _0x24aabf => {
    if (_0x24aabf.target === overlay) {
      _0x3e7a0b();
    }
  };
  _0x54b18e.querySelector("#inpaint-submit").onclick = async () => {
    try {
      const _0x2e67bf = stripChineseAnnotations(_0x54b18e.querySelector("#inpaint-positive-prompt").value.trim());
      const _0x3c4d22 = stripChineseAnnotations(_0x54b18e.querySelector("#inpaint-negative-prompt").value.trim());
      const _0x279442 = parseFloat(_0x54b18e.querySelector("#inpaint-denoise").value);
      const _0x349099 = _0x54b18e.querySelector("#inpaint-submit");
      _0x349099.disabled = true;
      _0x349099.textContent = "上传中...";
      const _0x208ed3 = await _0x3dc5c8.getOriginalBlob();
      const _0x2f9b35 = await _0x3dc5c8.getMaskBlob();
      addLog("[Inpaint] 准备上传图片和遮罩到ComfyUI...");
      const _0x4ef336 = extension_settings[extensionName]?.comfyuiUrl?.trim();
      if (!_0x4ef336) {
        throw new Error("请先在设置中配置ComfyUI地址");
      }
      const _0x24fd82 = await uploadToComfyUI(_0x208ed3, "inpaint_image.png", _0x4ef336);
      const _0x189ce7 = await uploadToComfyUI(_0x2f9b35, "inpaint_mask.png", _0x4ef336);
      addLog("[Inpaint] 上传成功: image=" + _0x24fd82 + ", mask=" + _0x189ce7);
      window.comfyuiInpaintImage = _0x24fd82;
      window.comfyuiInpaintMask = _0x189ce7;
      window.comfyuiInpaintPositivePrompt = _0x2e67bf;
      window.comfyuiInpaintNegativePrompt = _0x3c4d22;
      window.comfyuiInpaintDenoise = _0x279442;
      if (extension_settings[extensionName]) {
        extension_settings[extensionName].inpaint_positive_prompt = _0x2e67bf;
        extension_settings[extensionName].inpaint_negative_prompt = _0x3c4d22;
        extension_settings[extensionName].inpaint_denoise = _0x279442.toString();
      }
      const _0x203642 = _0x3e8583.dataset.change || "";
      if (!_0x203642.includes("{局部重绘}")) {
        _0x3e8583.dataset.change = _0x203642 + " {局部重绘}";
      }
      addLog("[Inpaint] 准备触发生成");
      _0x3e7a0b();
      _0x3e8583.click();
    } catch (_0x3efb49) {
      console.error("发送重绘失败:", _0x3efb49);
      addLog("[Inpaint] 发送失败: " + _0x3efb49.message);
      const _0x22ca1c = _0x54b18e.querySelector("#inpaint-submit");
      _0x22ca1c.disabled = false;
      _0x22ca1c.textContent = "发送重绘";
      if (typeof toastr !== "undefined") {
        toastr.error("发送重绘失败: " + _0x3efb49.message);
      }
    }
  };
}
async function uploadToComfyUI(_0x3f90fb, _0x255bbd, _0x578395) {
  const _0x2c8c21 = new FormData();
  _0x2c8c21.append("image", _0x3f90fb, _0x255bbd);
  const _0x5336a5 = await fetch(_0x578395 + "/upload/image", {
    method: "POST",
    body: _0x2c8c21
  });
  if (!_0x5336a5.ok) {
    const _0x42c146 = await _0x5336a5.text();
    throw new Error("上传失败: " + _0x42c146);
  }
  const _0x4ecfa3 = await _0x5336a5.json();
  return _0x4ecfa3.name;
}
function blobToBase64(_0x110597) {
  return new Promise((_0x16d405, _0x58970d) => {
    const _0x10ba24 = new FileReader();
    _0x10ba24.onloadend = () => _0x16d405(_0x10ba24.result);
    _0x10ba24.onerror = _0x58970d;
    _0x10ba24.readAsDataURL(_0x110597);
  });
}