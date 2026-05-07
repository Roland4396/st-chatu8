import { saveSettingsDebounced } from "../../../../../../script.js";
import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
import { parsePromptStringWithCoordinates, stripChineseAnnotations } from "../utils.js";
import { callTranslation, parseTranslationResult, tagsToJsonString } from "../ai.js";
import { handleTagModifyRequest } from "../tagModify.js";
import { processCharacterPrompt } from "../characterprompt.js";
import { handleAutocomplete } from "./autocomplete.js";
import { isMobileDevice } from "../utils.js";
import { lockTagForElement, unlockTagForElement, isTagLocked, deleteTagForElement } from "../imageInserter.js";
import { showComfyUIInpaintDialog } from "./comfyuiInpaint.js";
import { showNovelAIInpaintDialog } from "./novelaiInpaint.js";
import { showGorkVideoDialog } from "./gorkVideo.js";
let _triggerGeneration = null;
export function setTriggerGeneration(_0x235a1) {
  _triggerGeneration = _0x235a1;
}
function getImageSizeConfigKeys(_0x5982f4) {
  const _0x9e03dd = {
    sd: {
      widthKey: "sd_cwidth",
      heightKey: "sd_cheight",
      modeName: "SD"
    },
    novelai: {
      widthKey: "novelai_width",
      heightKey: "novelai_height",
      modeName: "NovelAI"
    },
    comfyui: {
      widthKey: "comfyui_width",
      heightKey: "comfyui_height",
      modeName: "ComfyUI"
    },
    banana: {
      widthKey: null,
      heightKey: null,
      modeName: "Banana"
    }
  };
  return _0x9e03dd[_0x5982f4] || _0x9e03dd.comfyui;
}
function showImageSizePopup(_0x44241f, _0x18d1c5, _0xc34dc9) {
  return new Promise(_0x15e86d => {
    const _0x359b8a = window.top.document;
    const _0x85f33f = isMobileDevice();
    const _0x39ef6f = extension_settings[extensionName];
    const _0x89c36c = _0x39ef6f.mode || "comfyui";
    const {
      widthKey: _0x228cc4,
      heightKey: _0x6b269f,
      modeName: _0x463009
    } = getImageSizeConfigKeys(_0x89c36c);
    let _0x461607;
    let _0x12f9cf;
    if (_0x89c36c === "banana") {
      const _0x7f2250 = _0x44241f.dataset.aspectRatio || _0x39ef6f.banana?.aspectRatio || "1:1";
      _0x461607 = _0x7f2250;
      _0x12f9cf = "";
    } else {
      _0x461607 = _0x44241f.dataset.width || _0x39ef6f[_0x228cc4] || "1024";
      _0x12f9cf = _0x44241f.dataset.height || _0x39ef6f[_0x6b269f] || "1024";
      const _0x42b816 = {
        mode: _0x89c36c,
        widthKey: _0x228cc4,
        heightKey: _0x6b269f,
        buttonWidth: _0x44241f.dataset.width,
        buttonHeight: _0x44241f.dataset.height,
        configWidth: _0x39ef6f[_0x228cc4],
        configHeight: _0x39ef6f[_0x6b269f],
        currentWidth: _0x461607,
        currentHeight: _0x12f9cf
      };
      console.log("[showImageSizePopup] 读取配置:", _0x42b816);
    }
    let _0x2854eb = 10;
    let _0x58aaee = window.innerHeight - 10;
    if (_0x85f33f) {
      const _0x15cfbb = _0x359b8a.querySelector("#top-settings-holder");
      if (_0x15cfbb) {
        const _0x123863 = _0x15cfbb.getBoundingClientRect();
        _0x2854eb = _0x123863.bottom + 10;
      }
      const _0x1b62bd = _0x359b8a.querySelector("#send_form");
      if (_0x1b62bd) {
        const _0x15bb5d = _0x1b62bd.getBoundingClientRect();
        _0x58aaee = _0x15bb5d.top - 10;
      }
    }
    const _0x40ada7 = _0x58aaee - _0x2854eb;
    const _0x5adffe = _0x359b8a.createElement("div");
    _0x5adffe.id = "image-size-overlay";
    _0x5adffe.className = "st-chatu8-popup-overlay";
    const _0x2142a = _0x359b8a.createElement("div");
    _0x2142a.className = "st-chatu8-popup-bubble";
    if (_0x85f33f) {
      _0x2142a.classList.add("mobile");
      _0x2142a.style.top = _0x2854eb + "px";
      _0x2142a.style.maxHeight = _0x40ada7 + "px";
    }
    const _0xb38a3f = _0x359b8a.createElement("div");
    _0xb38a3f.textContent = "📐 图片大小设置 (" + _0x463009 + ")";
    _0xb38a3f.className = "st-chatu8-popup-title";
    const _0x53af70 = _0x359b8a.createElement("div");
    _0x53af70.textContent = _0x89c36c === "banana" ? "设置生成图片的纵横比" : "设置生成图片的宽度和高度";
    _0x53af70.className = "st-chatu8-popup-hint";
    const _0x35cab3 = _0x359b8a.createElement("div");
    _0x35cab3.className = "st-chatu8-popup-size-form";
    let _0x4f4121;
    let _0x222b17;
    if (_0x89c36c === "banana") {
      const _0x4d1f0c = _0x359b8a.createElement("div");
      _0x4d1f0c.className = "st-chatu8-popup-size-row";
      const _0x2648fa = _0x359b8a.createElement("label");
      _0x2648fa.textContent = "纵横比";
      _0x2648fa.className = "st-chatu8-popup-size-label";
      const _0x56af52 = _0x359b8a.createElement("select");
      _0x56af52.className = "st-chatu8-popup-size-input";
      ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"].forEach(_0x587ea5 => {
        const _0x1c624c = _0x359b8a.createElement("option");
        _0x1c624c.value = _0x587ea5;
        _0x1c624c.textContent = _0x587ea5;
        if (_0x587ea5 === _0x461607) {
          _0x1c624c.selected = true;
        }
        _0x56af52.appendChild(_0x1c624c);
      });
      _0x4d1f0c.appendChild(_0x2648fa);
      _0x4d1f0c.appendChild(_0x56af52);
      _0x35cab3.appendChild(_0x4d1f0c);
      _0x4f4121 = _0x56af52;
    } else {
      const _0x4ae452 = _0x359b8a.createElement("div");
      _0x4ae452.className = "st-chatu8-popup-size-row";
      const _0x2433f1 = _0x359b8a.createElement("label");
      _0x2433f1.textContent = "宽度";
      _0x2433f1.className = "st-chatu8-popup-size-label";
      _0x4f4121 = _0x359b8a.createElement("input");
      _0x4f4121.type = "number";
      _0x4f4121.value = _0x461607;
      _0x4f4121.min = "64";
      _0x4f4121.max = "4096";
      _0x4f4121.step = "64";
      _0x4f4121.className = "st-chatu8-popup-size-input";
      _0x4ae452.appendChild(_0x2433f1);
      _0x4ae452.appendChild(_0x4f4121);
      const _0x45abd2 = _0x359b8a.createElement("div");
      _0x45abd2.className = "st-chatu8-popup-size-row";
      const _0x416f0a = _0x359b8a.createElement("label");
      _0x416f0a.textContent = "高度";
      _0x416f0a.className = "st-chatu8-popup-size-label";
      _0x222b17 = _0x359b8a.createElement("input");
      _0x222b17.type = "number";
      _0x222b17.value = _0x12f9cf;
      _0x222b17.min = "64";
      _0x222b17.max = "4096";
      _0x222b17.step = "64";
      _0x222b17.className = "st-chatu8-popup-size-input";
      _0x45abd2.appendChild(_0x416f0a);
      _0x45abd2.appendChild(_0x222b17);
      const _0x2b473e = _0x359b8a.createElement("div");
      _0x2b473e.className = "st-chatu8-popup-size-row swap-row";
      const _0x131bf2 = _0x359b8a.createElement("button");
      _0x131bf2.type = "button";
      _0x131bf2.innerHTML = "⇅ 对调宽高";
      _0x131bf2.className = "st-chatu8-popup-swap-btn";
      _0x131bf2.onclick = () => {
        const _0x8d1367 = _0x4f4121.value;
        _0x4f4121.value = _0x222b17.value;
        _0x222b17.value = _0x8d1367;
      };
      _0x2b473e.appendChild(_0x131bf2);
      _0x35cab3.appendChild(_0x4ae452);
      _0x35cab3.appendChild(_0x45abd2);
      _0x35cab3.appendChild(_0x2b473e);
    }
    const _0x6b0778 = _0x359b8a.createElement("div");
    _0x6b0778.className = "st-chatu8-popup-buttons";
    const _0x900a02 = _0x359b8a.createElement("button");
    _0x900a02.textContent = "取消";
    _0x900a02.className = "st-chatu8-popup-btn-cancel";
    const _0x1d9efd = _0x359b8a.createElement("button");
    _0x1d9efd.textContent = "确定并生成";
    _0x1d9efd.className = "st-chatu8-popup-btn-confirm";
    const _0x1b68bc = _0x2a8e16 => {
      _0x5adffe.classList.add("closing");
      setTimeout(() => {
        _0x5adffe.remove();
        _0x15e86d(_0x2a8e16);
      }, 150);
    };
    _0x900a02.addEventListener("click", () => _0x1b68bc(null));
    _0x1d9efd.addEventListener("click", () => {
      if (_0x89c36c === "banana") {
        _0x44241f.dataset.aspectRatio = _0x4f4121.value;
        const _0x415748 = {
          aspectRatio: _0x4f4121.value
        };
        _0x1b68bc(_0x415748);
      } else {
        const _0x107b40 = _0x4f4121.value.trim();
        const _0x40e9f8 = _0x222b17.value.trim();
        _0x44241f.dataset.width = _0x107b40;
        _0x44241f.dataset.height = _0x40e9f8;
        const _0x56aeab = {
          width: _0x107b40,
          height: _0x40e9f8
        };
        _0x1b68bc(_0x56aeab);
      }
    });
    const _0x185bba = _0xec3f6b => {
      if (_0xec3f6b.key === "Escape") {
        _0x1b68bc(null);
        _0x359b8a.removeEventListener("keydown", _0x185bba);
      } else if (_0xec3f6b.key === "Enter") {
        _0x1d9efd.click();
        _0x359b8a.removeEventListener("keydown", _0x185bba);
      }
    };
    _0x359b8a.addEventListener("keydown", _0x185bba);
    _0x6b0778.appendChild(_0x900a02);
    _0x6b0778.appendChild(_0x1d9efd);
    _0x2142a.appendChild(_0xb38a3f);
    _0x2142a.appendChild(_0x53af70);
    _0x2142a.appendChild(_0x35cab3);
    _0x2142a.appendChild(_0x6b0778);
    _0x5adffe.appendChild(_0x2142a);
    _0x359b8a.body.appendChild(_0x5adffe);
    setTimeout(() => _0x4f4121?.focus(), 100);
  });
}
export function showBananaRetouchDialog(_0x8c7078, _0x203228) {
  const _0x50b9b0 = _0x8c7078.src;
  const _0x303e98 = isMobileDeviceDialog();
  const _0x3abbd5 = {
    title: "Banana 修图",
    isMobile: _0x303e98
  };
  const {
    backdrop: _0x16db44,
    dialog: _0x23e7ca,
    closeDialog: _0x55e6a2
  } = createUnifiedDialog(_0x3abbd5);
  const _0x3ee79f = document.createElement("img");
  _0x3ee79f.src = _0x50b9b0;
  _0x3ee79f.style.display = "block";
  _0x3ee79f.style.maxWidth = "100%";
  _0x3ee79f.style.maxHeight = "30vh";
  _0x3ee79f.style.objectFit = "contain";
  _0x3ee79f.style.margin = "0 auto 15px auto";
  _0x3ee79f.style.borderRadius = "8px";
  const _0x17bd87 = createUnifiedInput({
    placeholder: "输入修图指令，例如：\"给人物换上红色的连衣裙\"",
    value: _0x203228.dataset.retouchPrompt || "",
    rows: 2
  });
  const _0x197b13 = () => {
    const _0x458d0c = _0x17bd87.value.trim();
    if (!_0x458d0c) {
      toastr.warning("请输入修图指令。");
      return;
    }
    _0x203228.dataset.retouchPrompt = _0x458d0c;
    _0x203228.dataset.retouchImage = _0x50b9b0;
    if (!_0x203228.dataset.change) {
      _0x203228.dataset.change = _0x203228.dataset.link;
    }
    _0x203228.dataset.change = _0x203228.dataset.change + "{修图}";
    toastr.info("正在准备修图生成...");
    if (_triggerGeneration) {
      _triggerGeneration(_0x203228);
    }
    _0x55e6a2();
  };
  const _0x5439e9 = createButtonContainer([{
    text: "发送",
    className: "send",
    onClick: _0x197b13
  }, {
    text: "取消",
    className: "cancel",
    onClick: _0x55e6a2
  }]);
  _0x23e7ca.appendChild(_0x3ee79f);
  _0x23e7ca.appendChild(_0x17bd87);
  _0x23e7ca.appendChild(_0x5439e9);
  _0x17bd87.focus();
}
export function showEditDialog(_0x46ae22, _0x6ed1ba) {
  const _0x5b99ad = window.top.document;
  const _0x449a40 = _0x6ed1ba.dataset.change || _0x6ed1ba.dataset.link;
  const _0x595c6a = "st-chatu8-autocomplete-styles";
  if (!_0x5b99ad.getElementById(_0x595c6a)) {
    const _0x33843e = _0x5b99ad.createElement("style");
    _0x33843e.id = _0x595c6a;
    _0x33843e.innerHTML = "\n            /* Dialog Styles - scoped to edit backdrop */\n            .st-chatu8-edit-backdrop .st-chatu8-edit-dialog {\n                background-color: var(--st-chatu8-bg-primary);\n                color: var(--st-chatu8-text-primary);\n                border: 1px solid var(--st-chatu8-border-color);\n                box-shadow: 0 8px 24px rgba(0,0,0,0.2);\n                border-radius: 12px;\n                padding: 20px;\n                resize: both;\n                overflow-x: hidden;\n                overflow-y: auto;\n                min-width: 300px;\n                min-height: 200px;\n                max-width: 90vw;\n                max-height: 85vh;\n                display: flex;\n                flex-direction: column;\n            }\n            \n            /* 移动端增大滚动条宽度 */\n            @media (max-width: 768px) {\n                .st-chatu8-edit-backdrop .st-chatu8-edit-dialog::-webkit-scrollbar {\n                    width: 16px;\n                    height: 16px;\n                }\n                .st-chatu8-edit-backdrop .st-chatu8-edit-dialog::-webkit-scrollbar-track {\n                    background: var(--st-chatu8-bg-secondary, #1a1a2a);\n                    border-radius: 8px;\n                }\n                .st-chatu8-edit-backdrop .st-chatu8-edit-dialog::-webkit-scrollbar-thumb {\n                    background: var(--st-chatu8-accent-primary, #4a4a8a);\n                    border-radius: 8px;\n                    border: 2px solid var(--st-chatu8-bg-secondary, #1a1a2a);\n                }\n                .st-chatu8-edit-backdrop .st-chatu8-edit-dialog::-webkit-scrollbar-thumb:hover {\n                    background: var(--st-chatu8-accent-secondary, #6a6aaa);\n                }\n            }\n            \n            .st-chatu8-edit-backdrop .st-chatu8-edit-title {\n                color: var(--st-chatu8-text-primary);\n                font-size: 1.2em;\n                font-weight: bold;\n                margin-bottom: 15px;\n            }\n            .st-chatu8-edit-backdrop .st-chatu8-edit-input {\n                background-color: var(--st-chatu8-input-bg);\n                color: var(--st-chatu8-input-text);\n                border: 1px solid var(--st-chatu8-input-border);\n                border-radius: 6px;\n                padding: 10px;\n                width: 100%;\n                box-sizing: border-box;\n                min-height: 100px;\n                flex: 1 1 auto;\n                resize: both;\n            }\n            .st-chatu8-edit-backdrop .st-chatu8-edit-buttons {\n                margin-top: 15px;\n                display: flex;\n                justify-content: center;\n                flex-wrap: wrap;\n                gap: 8px;\n            }\n            .st-chatu8-edit-backdrop .st-chatu8-edit-button {\n                border-radius: 6px;\n                padding: 6px 12px;\n                font-weight: bold;\n                cursor: pointer;\n                border: none;\n                font-size: 0.9em;\n                white-space: nowrap;\n            }\n            .st-chatu8-edit-backdrop .st-chatu8-edit-button.send {\n                background-color: var(--st-chatu8-accent-primary);\n                color: white;\n            }\n            .st-chatu8-edit-backdrop .st-chatu8-edit-button.cancel {\n                background-color: var(--st-chatu8-bg-secondary);\n                color: var(--st-chatu8-text-secondary);\n            }\n\n            /* Autocomplete Styles - scoped to edit backdrop only */\n            .st-chatu8-edit-backdrop .ch-autocomplete-results {\n                display: none;\n                position: absolute;\n                background-color: var(--st-chatu8-dropdown-list-bg);\n                border: 1px solid var(--st-chatu8-border-color);\n                border-radius: 6px;\n                max-height: 150px;\n                overflow-y: auto;\n                z-index: 10;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n                max-width: 100%;\n            }\n            .st-chatu8-edit-backdrop .ch-autocomplete-item {\n                padding: 8px 12px;\n                cursor: pointer;\n                color: var(--st-chatu8-dropdown-text);\n                font-size: 0.9em;\n            }\n            .st-chatu8-edit-backdrop .ch-autocomplete-item:hover {\n                background-color: var(--st-chatu8-accent-secondary);\n                color: var(--st-chatu8-text-highlight);\n            }\n        ";
    _0x5b99ad.head.appendChild(_0x33843e);
  }
  _0x5b99ad.querySelector(".st-chatu8-edit-backdrop")?.remove();
  const _0x55a0f3 = _0x5b99ad.createElement("div");
  _0x55a0f3.className = "ch-autocomplete-results";
  let _0x116f09 = null;
  const _0x281401 = () => {
    return;
  };
  const _0x908aed = () => {
    return;
  };
  _0x55a0f3.restoreDialogSize = _0x908aed;
  const _0x1e7c0d = () => {
    if (_0x55a0f3.style.display === "none") {
      _0x908aed();
      return;
    }
    _0x55a0f3.style.top = _0x19bcff.offsetTop + _0x19bcff.offsetHeight + 2 + "px";
    _0x55a0f3.style.left = _0x19bcff.offsetLeft + "px";
    _0x55a0f3.style.width = _0x19bcff.offsetWidth + "px";
    _0x281401();
  };
  const _0x1f59fa = () => {
    _0xd4f7ba.remove();
  };
  const _0xd4f7ba = _0x5b99ad.createElement("div");
  _0xd4f7ba.className = "st-chatu8-edit-backdrop";
  const _0x34267e = _0x5b99ad.createElement("div");
  _0x34267e.className = "st-chatu8-edit-dialog";
  _0x34267e.style.position = "relative";
  _0x34267e.addEventListener("click", _0x2a17a1 => _0x2a17a1.stopPropagation());
  const _0x77e92f = window.top.innerWidth <= 768;
  const _0x36d292 = _0x5b99ad.querySelector("#send_textarea");
  let _0x906372 = 10;
  if (_0x77e92f) {
    const _0x28b333 = window.top.document.querySelector("#ai-config-button");
    _0x906372 = (_0x28b333?.offsetHeight || 0) + 10;
    _0xd4f7ba.style.alignItems = "flex-start";
    _0x34267e.style.marginTop = _0x906372 + "px";
  }
  if (_0x36d292) {
    const _0x223430 = _0x36d292.getBoundingClientRect();
    const _0x3a9b1d = _0x223430.top - _0x906372 - 20;
    _0x34267e.style.maxHeight = _0x3a9b1d + "px";
    _0x34267e.style.overflowY = "auto";
    if (_0x77e92f) {
      _0x34267e.style.height = _0x3a9b1d + "px";
    }
  }
  const _0x50b8d6 = _0x5b99ad.createElement("div");
  _0x50b8d6.className = "st-chatu8-edit-title";
  _0x50b8d6.textContent = "编辑图片标签";
  const _0x19bcff = _0x5b99ad.createElement("textarea");
  _0x19bcff.id = "st-chatu8-edit-input";
  _0x19bcff.className = "st-chatu8-edit-input";
  _0x19bcff.value = _0x449a40;
  const _0x4aaceb = _0x5b99ad.createElement("div");
  _0x4aaceb.className = "st-chatu8-edit-buttons";
  const _0x28ea32 = _0x5b99ad.createElement("div");
  _0x28ea32.className = "st-chatu8-tag-actions-container";
  _0x28ea32.style.cssText = "position: relative; display: inline-block;";
  const _0x470896 = _0x5b99ad.createElement("button");
  _0x470896.className = "st-chatu8-edit-button send";
  _0x470896.textContent = "Tag操作 ▼";
  _0x470896.type = "button";
  const _0x5a3906 = _0x5b99ad.createElement("div");
  _0x5a3906.className = "st-chatu8-tag-actions-menu";
  _0x5a3906.style.cssText = "\n        display: none;\n        position: absolute;\n        bottom: 100%;\n        left: 50%;\n        transform: translateX(-50%);\n        margin-bottom: 8px;\n        background-color: var(--st-chatu8-bg-primary, #2a2a2a);\n        border: 1px solid var(--st-chatu8-border-color, #444);\n        border-radius: 8px;\n        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);\n        padding: 8px;\n        z-index: 100;\n        min-width: 120px;\n        flex-direction: column;\n        gap: 6px;\n    ";
  const _0xf9de56 = _0x5b99ad.createElement("button");
  _0xf9de56.className = "st-chatu8-tag-action-item";
  _0xf9de56.innerHTML = "🔄 重置tag";
  _0xf9de56.style.cssText = "\n        display: flex;\n        align-items: center;\n        gap: 8px;\n        width: 100%;\n        padding: 8px 12px;\n        background: transparent;\n        border: none;\n        border-radius: 6px;\n        color: var(--st-chatu8-text-primary, #fff);\n        cursor: pointer;\n        font-size: 0.9em;\n        text-align: left;\n        transition: background-color 0.2s ease;\n    ";
  _0xf9de56.onmouseenter = () => {
    _0xf9de56.style.backgroundColor = "var(--st-chatu8-accent-secondary, #3a3a3a)";
  };
  _0xf9de56.onmouseleave = () => {
    _0xf9de56.style.backgroundColor = "transparent";
  };
  _0xf9de56.onclick = () => {
    _0x19bcff.value = _0x6ed1ba.dataset.link;
    _0x5a3906.style.display = "none";
    toastr.success("Tag已重置");
  };
  const _0x589303 = _0x5b99ad.createElement("button");
  _0x589303.className = "st-chatu8-tag-action-item";
  _0x589303.innerHTML = "🔒 锁定tag";
  _0x589303.style.cssText = _0xf9de56.style.cssText;
  _0x589303.onmouseenter = () => {
    _0x589303.style.backgroundColor = "var(--st-chatu8-accent-secondary, #3a3a3a)";
  };
  _0x589303.onmouseleave = () => {
    _0x589303.style.backgroundColor = "transparent";
  };
  _0x589303.onclick = async () => {
    _0x5a3906.style.display = "none";
    const _0x100bf1 = _0x6ed1ba.dataset.link;
    if (!_0x100bf1) {
      toastr.warning("未找到 tag");
      return;
    }
    let _0x4a4158 = _0x6ed1ba;
    while (_0x4a4158 && _0x4a4158.tagName !== "DIV") {
      _0x4a4158 = _0x4a4158.parentElement;
    }
    const _0x1289b3 = _0x4a4158?.closest(".mes_text") || _0x4a4158;
    const _0x10c22f = await isTagLocked(_0x1289b3, _0x100bf1);
    if (_0x10c22f) {
      const _0x5876dc = await unlockTagForElement(_0x1289b3, _0x100bf1);
      if (_0x5876dc.success) {
        toastr.success("Tag 已解锁");
        _0x589303.innerHTML = "🔒 锁定tag";
      } else {
        toastr.warning(_0x5876dc.message);
      }
    } else {
      const _0x116711 = await lockTagForElement(_0x1289b3, _0x100bf1);
      if (_0x116711.success) {
        toastr.success("Tag 已锁定，将不会被覆盖或删除");
        _0x589303.innerHTML = "🔓 解锁tag";
      } else {
        toastr.warning(_0x116711.message);
      }
    }
  };
  const _0xbef385 = _0x5b99ad.createElement("button");
  _0xbef385.className = "st-chatu8-tag-action-item";
  _0xbef385.innerHTML = "🗑️ 删除tag";
  _0xbef385.style.cssText = _0xf9de56.style.cssText;
  _0xbef385.style.color = "#ff6b6b";
  _0xbef385.onmouseenter = () => {
    _0xbef385.style.backgroundColor = "rgba(255, 107, 107, 0.15)";
  };
  _0xbef385.onmouseleave = () => {
    _0xbef385.style.backgroundColor = "transparent";
  };
  _0xbef385.onclick = async () => {
    _0x5a3906.style.display = "none";
    const _0x42798a = _0x6ed1ba.dataset.link;
    if (!_0x42798a) {
      toastr.warning("未找到 tag");
      return;
    }
    let _0x2f8c31 = _0x6ed1ba;
    while (_0x2f8c31 && _0x2f8c31.tagName !== "DIV") {
      _0x2f8c31 = _0x2f8c31.parentElement;
    }
    const _0x107205 = _0x2f8c31?.closest(".mes_text") || _0x2f8c31;
    const _0x3dbb55 = await deleteTagForElement(_0x107205, _0x42798a);
    if (_0x3dbb55.success) {
      let _0x8ce5a3 = _0x6ed1ba.closest(".st-chatu8-collapse-wrapper");
      if (!_0x8ce5a3) {
        _0x8ce5a3 = _0x6ed1ba.closest(".st-chatu8-image-span");
      }
      if (!_0x8ce5a3) {
        _0x8ce5a3 = _0x6ed1ba.closest(".st-chatu8-image-container");
      }
      if (_0x8ce5a3) {
        _0x8ce5a3.remove();
        console.log("[dialogs] Removed DOM container for deleted tag");
      } else {
        _0x6ed1ba.remove();
        console.log("[dialogs] Removed button for deleted tag");
      }
      toastr.success(_0x3dbb55.message);
      _0x1f59fa();
    } else {
      toastr.warning(_0x3dbb55.message);
    }
  };
  _0x5a3906.appendChild(_0xf9de56);
  _0x5a3906.appendChild(_0x589303);
  _0x5a3906.appendChild(_0xbef385);
  _0x470896.onclick = _0x41b00f => {
    _0x41b00f.stopPropagation();
    const _0x375934 = _0x5a3906.style.display === "flex";
    _0x5a3906.style.display = _0x375934 ? "none" : "flex";
  };
  _0x5b99ad.addEventListener("click", _0x390ec5 => {
    if (!_0x28ea32.contains(_0x390ec5.target)) {
      _0x5a3906.style.display = "none";
    }
  }, {
    once: false
  });
  _0x28ea32.appendChild(_0x470896);
  _0x28ea32.appendChild(_0x5a3906);
  const _0x248b73 = _0x5b99ad.createElement("button");
  _0x248b73.className = "st-chatu8-edit-button send";
  _0x248b73.textContent = "翻译";
  _0x248b73.onclick = async () => {
    try {
      _0x248b73.disabled = true;
      const _0x37a4c0 = _0x19bcff.value || "";
      const _0x4c15be = stripChineseAnnotations(_0x37a4c0).replace(/，/g, ",").replace(/[\r\n]+/g, ",");
      const _0x416d48 = _0x2a7416 => {
        const _0x525c53 = [];
        let _0x4a202f = "";
        let _0xb42b02 = false;
        for (let _0x35d38d = 0; _0x35d38d < _0x2a7416.length; _0x35d38d++) {
          const _0x29d80e = _0x2a7416[_0x35d38d];
          if (_0x29d80e === "$") {
            _0xb42b02 = !_0xb42b02;
            _0x4a202f += _0x29d80e;
          } else if ((_0x29d80e === "," || _0x29d80e === "，") && !_0xb42b02) {
            const _0x5831df = _0x4a202f.trim();
            if (_0x5831df) {
              _0x525c53.push(_0x5831df);
            }
            _0x4a202f = "";
          } else {
            _0x4a202f += _0x29d80e;
          }
        }
        if (_0x4a202f.trim()) {
          _0x525c53.push(_0x4a202f.trim());
        }
        return _0x525c53;
      };
      const _0x355756 = _0x30e181 => {
        return _0x30e181.startsWith("$") && _0x30e181.endsWith("$");
      };
      let _0x47a423 = [];
      if (_0x4c15be.includes("Scene Composition")) {
        const _0x18f637 = parsePromptStringWithCoordinates(_0x4c15be);
        const _0x308c0b = ["Scene Composition", "Character 1 Prompt", "Character 1 UC", "Character 2 Prompt", "Character 2 UC", "Character 3 Prompt", "Character 3 UC", "Character 4 Prompt", "Character 4 UC"];
        _0x308c0b.forEach(_0x310f51 => {
          const _0x54fa64 = _0x18f637?.[_0x310f51];
          if (typeof _0x54fa64 === "string" && _0x54fa64.trim()) {
            _0x416d48(_0x54fa64).forEach(_0x22ca52 => {
              if (_0x22ca52 && !_0x355756(_0x22ca52)) {
                _0x47a423.push(_0x22ca52);
              }
            });
          }
        });
      } else {
        _0x47a423 = [];
        let _0x1aff68 = "";
        let _0x58b27b = false;
        for (let _0xb8310d = 0; _0xb8310d < _0x4c15be.length; _0xb8310d++) {
          const _0x58febf = _0x4c15be[_0xb8310d];
          if (_0x58febf === "$") {
            _0x58b27b = !_0x58b27b;
            _0x1aff68 += _0x58febf;
          } else if (_0x58febf === "," && !_0x58b27b) {
            const _0x2659d0 = _0x1aff68.trim();
            if (_0x2659d0) {
              _0x47a423.push(_0x2659d0);
            }
            _0x1aff68 = "";
          } else {
            _0x1aff68 += _0x58febf;
          }
        }
        const _0x3b439a = _0x1aff68.trim();
        if (_0x3b439a) {
          _0x47a423.push(_0x3b439a);
        }
        _0x47a423 = _0x47a423.filter(_0x4f4461 => !_0x4f4461.startsWith("$") || !_0x4f4461.endsWith("$"));
      }
      _0x47a423 = Array.from(new Set(_0x47a423));
      if (_0x47a423.length === 0) {
        toastr.info("没有可翻译的标签。");
        _0x248b73.disabled = false;
        return;
      }
      const _0x41d8e4 = _0x3094bb => {
        return _0x3094bb.replace(/^[\{\[\(\<]+|[\}\]\)\>]+$/g, "").replace(/^\{+|\}+$/g, "").replace(/:[\d.]+$/, "").trim();
      };
      const _0x46a319 = [];
      for (const _0x3221d8 of _0x47a423) {
        const _0x5e6e43 = _0x41d8e4(_0x3221d8);
        if (_0x5e6e43) {
          _0x46a319.push(_0x5e6e43);
        }
      }
      const _0x70ceee = tagsToJsonString(Array.from(new Set(_0x46a319)));
      const _0x9ff76e = await callTranslation(_0x70ceee);
      const _0x46c9b3 = parseTranslationResult(_0x9ff76e);
      console.log("[翻译调试] 解析后的 map:", _0x46c9b3);
      const _0x306573 = _0x384c12 => {
        const _0x29979d = [];
        let _0x2f215d = "";
        let _0x220b1f = false;
        for (let _0x24c42c = 0; _0x24c42c < _0x384c12.length; _0x24c42c++) {
          const _0x5cd0f1 = _0x384c12[_0x24c42c];
          if (_0x5cd0f1 === "$") {
            _0x220b1f = !_0x220b1f;
            _0x2f215d += _0x5cd0f1;
          } else if (_0x5cd0f1 === "," && !_0x220b1f) {
            _0x29979d.push(_0x2f215d.trim());
            _0x2f215d = "";
          } else {
            _0x2f215d += _0x5cd0f1;
          }
        }
        if (_0x2f215d.trim()) {
          _0x29979d.push(_0x2f215d.trim());
        }
        return _0x29979d;
      };
      const _0x37450d = _0x306573(_0x4c15be);
      console.log("[翻译调试] originalTokens:", _0x37450d);
      const _0x39339b = _0x37450d.map(_0x38f1f3 => {
        if (_0x38f1f3.startsWith("$") && _0x38f1f3.endsWith("$")) {
          return _0x38f1f3;
        }
        const _0x22f38e = _0x41d8e4(_0x38f1f3);
        if (_0x46c9b3[_0x22f38e]) {
          console.log("[翻译调试] 匹配成功:", _0x38f1f3, "(清理后:", _0x22f38e, ") ->", _0x46c9b3[_0x22f38e]);
          return _0x38f1f3 + "（" + _0x46c9b3[_0x22f38e] + "）";
        }
        if (_0x46c9b3[_0x38f1f3]) {
          console.log("[翻译调试] 直接匹配成功:", _0x38f1f3, "->", _0x46c9b3[_0x38f1f3]);
          return _0x38f1f3 + "（" + _0x46c9b3[_0x38f1f3] + "）";
        }
        console.log("[翻译调试] 未匹配:", _0x38f1f3, "(清理后:", _0x22f38e, ")");
        return _0x38f1f3;
      });
      let _0x19615d = _0x39339b.join(", ");
      console.log("[翻译调试] annotated:", _0x19615d);
      const _0x1fde26 = ["Scene Composition:", "Character 1 Prompt:", "Character 1 UC:", "Character 1 coordinates:", "Character 2 Prompt:", "Character 2 UC:", "Character 2 coordinates:", "Character 3 Prompt:", "Character 3 UC:", "Character 3 coordinates:", "Character 4 Prompt:", "Character 4 UC:", "Character 4 coordinates:"];
      const _0x16bc69 = _0x1fde26.some(_0x4276f3 => _0x19615d.includes(_0x4276f3));
      if (_0x16bc69) {
        for (const _0x2d5eef of _0x1fde26) {
          _0x19615d = _0x19615d.replace(new RegExp("(?<!^)\\s*" + _0x2d5eef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "\n\n" + _0x2d5eef);
        }
        _0x19615d = _0x19615d.replace(/^\s+/, "").replace(/\n{3,}/g, "\n\n");
      }
      _0x19bcff.value = _0x19615d;
      toastr.success("翻译完成");
    } catch (_0x3f6162) {
      console.error("编辑标签翻译失败:", _0x3f6162);
      alert("翻译失败：" + (_0x3f6162.message || _0x3f6162));
    } finally {
      _0x248b73.disabled = false;
    }
  };
  const _0x505fa0 = _0x5b99ad.createElement("button");
  _0x505fa0.className = "st-chatu8-edit-button send";
  _0x505fa0.textContent = "发送";
  let _0x3ead27 = null;
  let _0x2a518b = false;
  const _0x1453be = 500;
  const _0x3d5431 = () => {
    toastr.info("正在生成图像...");
    const _0x2afbcb = _0x19bcff.value.trim();
    if (_0x2afbcb && _0x2afbcb !== _0x449a40) {
      _0x6ed1ba.dataset.change = _0x2afbcb;
    }
    if (_triggerGeneration) {
      _triggerGeneration(_0x6ed1ba);
    }
    _0x1f59fa();
  };
  const _0x5ccbdf = async () => {
    _0x2a518b = true;
    const _0x29979f = await showImageSizePopup(_0x6ed1ba, _0x19bcff);
    if (_0x29979f) {
      _0x3d5431();
    }
  };
  _0x505fa0.addEventListener("mousedown", _0x114a22 => {
    _0x2a518b = false;
    _0x3ead27 = setTimeout(_0x5ccbdf, _0x1453be);
  });
  _0x505fa0.addEventListener("mouseup", () => {
    clearTimeout(_0x3ead27);
    if (!_0x2a518b) {
      _0x3d5431();
    }
  });
  _0x505fa0.addEventListener("mouseleave", () => {
    clearTimeout(_0x3ead27);
  });
  _0x505fa0.addEventListener("touchstart", _0x13623e => {
    _0x2a518b = false;
    _0x3ead27 = setTimeout(_0x5ccbdf, _0x1453be);
  }, {
    passive: true
  });
  _0x505fa0.addEventListener("touchend", _0x3ea5f2 => {
    clearTimeout(_0x3ead27);
    if (!_0x2a518b) {
      _0x3ea5f2.preventDefault();
      _0x3d5431();
    }
  });
  _0x505fa0.addEventListener("touchcancel", () => {
    clearTimeout(_0x3ead27);
  });
  const _0xdae758 = _0x5b99ad.createElement("button");
  _0xdae758.className = "st-chatu8-edit-button cancel";
  _0xdae758.textContent = "取消";
  _0xdae758.onclick = _0x1f59fa;
  const _0x2be79b = _0x5b99ad.createElement("div");
  _0x2be79b.className = "st-chatu8-image-process-container";
  _0x2be79b.style.cssText = "position: relative; display: inline-block;";
  const _0x3e6f86 = _0x5b99ad.createElement("button");
  _0x3e6f86.className = "st-chatu8-edit-button send";
  _0x3e6f86.textContent = "图像处理 ▼";
  _0x3e6f86.type = "button";
  const _0x33bab6 = _0x5b99ad.createElement("div");
  _0x33bab6.className = "st-chatu8-image-process-menu";
  _0x33bab6.style.cssText = "\n        display: none;\n        position: absolute;\n        bottom: 100%;\n        left: 50%;\n        transform: translateX(-50%);\n        margin-bottom: 8px;\n        background-color: var(--st-chatu8-bg-primary, #2a2a2a);\n        border: 1px solid var(--st-chatu8-border-color, #444);\n        border-radius: 8px;\n        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);\n        padding: 8px;\n        z-index: 100;\n        min-width: 140px;\n        flex-direction: column;\n        gap: 6px;\n    ";
  const _0x535198 = "\n        display: flex;\n        align-items: center;\n        gap: 8px;\n        width: 100%;\n        padding: 8px 12px;\n        background: transparent;\n        border: none;\n        border-radius: 6px;\n        color: var(--st-chatu8-text-primary, #fff);\n        cursor: pointer;\n        font-size: 0.9em;\n        text-align: left;\n        transition: background-color 0.2s ease;\n        white-space: nowrap;\n    ";
  const _0x54108c = _0x5b99ad.createElement("button");
  _0x54108c.className = "st-chatu8-image-process-item";
  _0x54108c.innerHTML = "🍌 Banana修图";
  _0x54108c.style.cssText = _0x535198;
  _0x54108c.onmouseenter = () => {
    _0x54108c.style.backgroundColor = "var(--st-chatu8-accent-secondary, #3a3a3a)";
  };
  _0x54108c.onmouseleave = () => {
    _0x54108c.style.backgroundColor = "transparent";
  };
  _0x54108c.onclick = () => {
    _0x33bab6.style.display = "none";
    showBananaRetouchDialog(_0x46ae22, _0x6ed1ba);
    _0x1f59fa();
  };
  const _0x1a6c69 = _0x5b99ad.createElement("button");
  _0x1a6c69.className = "st-chatu8-image-process-item";
  _0x1a6c69.innerHTML = "🎬 Gork生成视频";
  _0x1a6c69.style.cssText = _0x535198;
  _0x1a6c69.onmouseenter = () => {
    _0x1a6c69.style.backgroundColor = "var(--st-chatu8-accent-secondary, #3a3a3a)";
  };
  _0x1a6c69.onmouseleave = () => {
    _0x1a6c69.style.backgroundColor = "transparent";
  };
  _0x1a6c69.onclick = () => {
    _0x33bab6.style.display = "none";
    showGorkVideoDialog(_0x46ae22, _0x6ed1ba);
    _0x1f59fa();
  };
  const _0x43794f = _0x5b99ad.createElement("button");
  _0x43794f.className = "st-chatu8-image-process-item";
  _0x43794f.innerHTML = "🎨 ComfyUI局部重绘";
  _0x43794f.style.cssText = _0x535198;
  _0x43794f.onmouseenter = () => {
    _0x43794f.style.backgroundColor = "var(--st-chatu8-accent-secondary, #3a3a3a)";
  };
  _0x43794f.onmouseleave = () => {
    _0x43794f.style.backgroundColor = "transparent";
  };
  _0x43794f.onclick = () => {
    _0x33bab6.style.display = "none";
    showComfyUIInpaintDialog(_0x46ae22, _0x6ed1ba);
    _0x1f59fa();
  };
  const _0x4c040f = _0x5b99ad.createElement("button");
  _0x4c040f.className = "st-chatu8-image-process-item";
  _0x4c040f.innerHTML = "🎨 NovelAI局部重绘";
  _0x4c040f.style.cssText = _0x535198;
  _0x4c040f.onmouseenter = () => {
    _0x4c040f.style.backgroundColor = "var(--st-chatu8-accent-secondary, #3a3a3a)";
  };
  _0x4c040f.onmouseleave = () => {
    _0x4c040f.style.backgroundColor = "transparent";
  };
  _0x4c040f.onclick = () => {
    _0x33bab6.style.display = "none";
    showNovelAIInpaintDialog(_0x46ae22, _0x6ed1ba);
    _0x1f59fa();
  };
  _0x33bab6.appendChild(_0x54108c);
  _0x33bab6.appendChild(_0x1a6c69);
  _0x33bab6.appendChild(_0x43794f);
  _0x33bab6.appendChild(_0x4c040f);
  _0x3e6f86.onclick = _0x1db39d => {
    _0x1db39d.stopPropagation();
    const _0x3937ec = _0x33bab6.style.display === "flex";
    _0x33bab6.style.display = _0x3937ec ? "none" : "flex";
  };
  _0x5b99ad.addEventListener("click", _0xdeb32 => {
    if (!_0x2be79b.contains(_0xdeb32.target)) {
      _0x33bab6.style.display = "none";
    }
  }, {
    once: false
  });
  _0x2be79b.appendChild(_0x3e6f86);
  _0x2be79b.appendChild(_0x33bab6);
  const _0x3f52c1 = _0x5b99ad.createElement("button");
  _0x3f52c1.className = "st-chatu8-edit-button send";
  _0x3f52c1.textContent = "修改tag";
  _0x3f52c1.onclick = async () => {
    let _0x315616 = _0x6ed1ba;
    while (_0x315616 && _0x315616.tagName !== "DIV") {
      _0x315616 = _0x315616.parentElement;
    }
    if (_0x315616) {
      const _0x540c0b = _0x315616.closest(".mes_text");
      if (_0x540c0b) {
        _0x315616 = _0x540c0b;
      }
    }
    if (_0x315616) {
      await handleTagModifyRequest(_0x315616, _0x19bcff.value, _0x19bcff);
    } else {
      toastr.warning("无法找到上下文元素");
    }
  };
  const _0x5f3de = _0x5b99ad.createElement("button");
  _0x5f3de.className = "st-chatu8-edit-button send";
  _0x5f3de.textContent = "展开预设";
  _0x5f3de.onclick = () => {
    const _0x2f5c65 = _0x19bcff.value;
    const _0x1a2968 = processCharacterPrompt(_0x2f5c65);
    if (_0x1a2968 !== _0x2f5c65) {
      _0x19bcff.value = _0x1a2968;
      toastr.success("角色/服装预设已展开");
    } else {
      toastr.info("未发现可展开的预设标记");
    }
  };
  _0x4aaceb.appendChild(_0x28ea32);
  _0x4aaceb.appendChild(_0x248b73);
  _0x4aaceb.appendChild(_0x5f3de);
  _0x4aaceb.appendChild(_0x3f52c1);
  _0x4aaceb.appendChild(_0x2be79b);
  _0x4aaceb.appendChild(_0x505fa0);
  _0x4aaceb.appendChild(_0xdae758);
  _0x34267e.appendChild(_0x50b8d6);
  _0x34267e.appendChild(_0x19bcff);
  _0x34267e.appendChild(_0x4aaceb);
  _0x34267e.appendChild(_0x55a0f3);
  _0xd4f7ba.appendChild(_0x34267e);
  _0x5b99ad.body.appendChild(_0xd4f7ba);
  _0x19bcff.focus();
  setTimeout(() => {
    _0x19bcff.style.height = "auto";
    _0x19bcff.style.height = _0x19bcff.scrollHeight + 5 + "px";
  }, 0);
  _0x19bcff.addEventListener("input", () => {
    const _0x55e64e = _0x19bcff.value;
    const _0x3ad94e = _0x55e64e.replace(/，/g, ",");
    if (_0x55e64e !== _0x3ad94e) {
      const _0x484dcc = _0x19bcff.selectionStart;
      _0x19bcff.value = _0x3ad94e;
      _0x19bcff.setSelectionRange(_0x484dcc, _0x484dcc);
    }
    handleAutocomplete(_0x19bcff, _0x55a0f3).then(() => {
      _0x1e7c0d();
    });
  });
  _0x19bcff.addEventListener("click", _0x42fa6a => _0x42fa6a.stopPropagation());
  _0x19bcff.addEventListener("blur", () => {
    setTimeout(() => {
      if (!_0x55a0f3.matches(":hover")) {
        _0x55a0f3.style.display = "none";
        _0x1e7c0d();
      }
    }, 150);
  });
}
function isMobileDeviceDialog() {
  return window.top.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
export function calculateDialogDimensions(_0x13a23e) {
  if (!_0x13a23e) {
    return {
      topMargin: 0,
      maxHeight: "85vh",
      shouldUseFullHeight: false
    };
  }
  const _0x507467 = window.top.document;
  let _0x38a95b = 10;
  let _0x4e31d2 = window.innerHeight - 10;
  const _0x5544fa = _0x507467.querySelector("#top-settings-holder");
  const _0x174f6a = _0x507467.querySelector("#ai-config-button");
  if (_0x5544fa) {
    const _0x27eb54 = _0x5544fa.getBoundingClientRect();
    _0x38a95b = _0x27eb54.bottom + 10;
  } else if (_0x174f6a) {
    _0x38a95b = (_0x174f6a.offsetHeight || 0) + 10;
  }
  const _0x18e590 = _0x507467.querySelector("#send_textarea");
  const _0x226806 = _0x507467.querySelector("#send_form");
  if (_0x18e590) {
    const _0x4df8d5 = _0x18e590.getBoundingClientRect();
    _0x4e31d2 = _0x4df8d5.top - 10;
  } else if (_0x226806) {
    const _0x1ceb18 = _0x226806.getBoundingClientRect();
    _0x4e31d2 = _0x1ceb18.top - 10;
  }
  const _0x53f5e8 = _0x4e31d2 - _0x38a95b;
  const _0x38803d = {
    topMargin: _0x38a95b,
    maxHeight: _0x53f5e8 + "px",
    shouldUseFullHeight: true
  };
  return _0x38803d;
}
export function createUnifiedDialog(_0x1eae6f) {
  const _0x513073 = window.top.document;
  const {
    title: _0x3d207c,
    isMobile: _0xa05bd7
  } = _0x1eae6f;
  _0x513073.querySelector(".st-chatu8-edit-backdrop")?.remove();
  const _0x43f528 = _0x513073.createElement("div");
  _0x43f528.className = "st-chatu8-edit-backdrop";
  const _0x529c97 = _0x513073.createElement("div");
  _0x529c97.className = "st-chatu8-edit-dialog";
  _0x529c97.style.position = "relative";
  _0x529c97.style.display = "flex";
  _0x529c97.style.flexDirection = "column";
  _0x529c97.addEventListener("click", _0x567850 => _0x567850.stopPropagation());
  const _0x199975 = calculateDialogDimensions(_0xa05bd7);
  if (_0xa05bd7) {
    _0x43f528.style.alignItems = "flex-start";
    _0x529c97.style.marginTop = _0x199975.topMargin + "px";
    _0x529c97.style.maxHeight = _0x199975.maxHeight;
    _0x529c97.style.overflowX = "hidden";
    _0x529c97.style.overflowY = "auto";
    if (_0x199975.shouldUseFullHeight) {
      _0x529c97.style.height = _0x199975.maxHeight;
    }
  } else {
    _0x529c97.style.maxHeight = _0x199975.maxHeight;
    _0x529c97.style.overflowX = "hidden";
    _0x529c97.style.overflowY = "auto";
  }
  const _0x25e855 = _0x513073.createElement("div");
  _0x25e855.className = "st-chatu8-edit-title";
  _0x25e855.textContent = _0x3d207c;
  _0x529c97.appendChild(_0x25e855);
  const _0x38efac = () => _0x43f528.remove();
  _0x43f528.appendChild(_0x529c97);
  _0x513073.body.appendChild(_0x43f528);
  const _0x2aa678 = {
    backdrop: _0x43f528,
    dialog: _0x529c97,
    closeDialog: _0x38efac
  };
  return _0x2aa678;
}
export function createUnifiedInput(_0x1696ae) {
  const {
    placeholder = "",
    value = "",
    rows = 2
  } = _0x1696ae;
  const _0x38c8b8 = document.createElement("textarea");
  _0x38c8b8.className = "st-chatu8-edit-input";
  _0x38c8b8.placeholder = placeholder;
  _0x38c8b8.value = value;
  _0x38c8b8.rows = rows;
  return _0x38c8b8;
}
export function createButtonContainer(_0x56277f) {
  const _0x3da107 = document.createElement("div");
  _0x3da107.className = "st-chatu8-edit-buttons";
  _0x56277f.forEach(_0x466d16 => {
    const _0x3cd3e1 = document.createElement("button");
    _0x3cd3e1.className = "st-chatu8-edit-button " + _0x466d16.className;
    _0x3cd3e1.textContent = _0x466d16.text;
    _0x3cd3e1.onclick = _0x466d16.onClick;
    _0x3da107.appendChild(_0x3cd3e1);
  });
  return _0x3da107;
}