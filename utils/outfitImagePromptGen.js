import { eventSource } from "../../../../../script.js";
import { eventNames, extensionName } from "./config.js";
import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { stylishConfirm } from "./ui_common.js";
function generateRequestId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export function LLM_OUTFIT_DISPLAY_GET_PROMPT() {
  return new Promise((_0x284451, _0x1409fd) => {
    const _0x581492 = generateRequestId();
    console.log("[outfitImagePromptGen] 请求获取服装展示提示词 (ID: " + _0x581492 + ")");
    const _0x7e06bd = _0x4c9454 => {
      if (_0x4c9454.id !== _0x581492) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x7e06bd);
      const {
        prompt: _0x46e14b
      } = _0x4c9454;
      console.log("[outfitImagePromptGen] 已获取服装展示提示词 (ID: " + _0x581492 + "):", _0x46e14b);
      _0x284451(_0x46e14b);
    };
    eventSource.on(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x7e06bd);
    const _0x3d8792 = {
      id: _0x581492
    };
    eventSource.emit(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_REQUEST, _0x3d8792);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x7e06bd);
      _0x1409fd(new Error("获取服装展示提示词超时"));
    }, 10000);
  });
}
export function LLM_OUTFIT_DISPLAY(_0x514be1, _0x34ecab = {}) {
  return new Promise((_0x291cbc, _0x13c5eb) => {
    const _0x2d6614 = generateRequestId();
    const _0x21df9e = _0x34ecab.timeoutMs || 180000;
    console.log("[outfitImagePromptGen] 执行服装展示 LLM 请求 (ID: " + _0x2d6614 + ")");
    const _0x16f79d = _0x2ea62f => {
      if (_0x2ea62f.id !== _0x2d6614) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_RESPONSE, _0x16f79d);
      if (_0x2ea62f.success) {
        _0x291cbc(_0x2ea62f.result);
      } else {
        _0x13c5eb(new Error(_0x2ea62f.result || "LLM 请求失败"));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_DISPLAY_RESPONSE, _0x16f79d);
    const _0x2ddf45 = {
      prompt: _0x514be1,
      id: _0x2d6614
    };
    eventSource.emit(eventNames.LLM_CHAR_DISPLAY_REQUEST, _0x2ddf45);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_RESPONSE, _0x16f79d);
      _0x13c5eb(new Error("服装展示 LLM 请求超时"));
    }, _0x21df9e);
  });
}
function replacePlaceholder(_0x45b644, _0x1f0bde, _0x54d8bc, _0x29e312) {
  if (typeof _0x45b644 === "string") {
    if (_0x54d8bc && _0x45b644.includes(_0x1f0bde)) {
      if (_0x29e312) {
        _0x29e312.add(_0x1f0bde);
      }
    }
    return _0x45b644.replaceAll(_0x1f0bde, _0x54d8bc);
  }
  if (Array.isArray(_0x45b644)) {
    return _0x45b644.map(_0x1f9bf5 => replacePlaceholder(_0x1f9bf5, _0x1f0bde, _0x54d8bc, _0x29e312));
  }
  if (_0x45b644 && typeof _0x45b644 === "object") {
    const _0x3748f0 = {};
    for (const _0x47b4a5 in _0x45b644) {
      _0x3748f0[_0x47b4a5] = replacePlaceholder(_0x45b644[_0x47b4a5], _0x1f0bde, _0x54d8bc, _0x29e312);
    }
    return _0x3748f0;
  }
  return _0x45b644;
}
function getCurrentOutfitPreset() {
  const _0x14ef45 = extension_settings[extensionName];
  const _0x1494a4 = _0x14ef45.outfitPresetId;
  if (!_0x1494a4 || !_0x14ef45.outfitPresets[_0x1494a4]) {
    return null;
  }
  const _0x3e37c2 = {
    id: _0x1494a4,
    data: _0x14ef45.outfitPresets[_0x1494a4]
  };
  return _0x3e37c2;
}
function buildOutfitText(_0x33ec39) {
  const _0x15bb41 = _0x33ec39.data;
  let _0x1da30c = "<服装>\n";
  _0x1da30c += "中文名称: " + (_0x15bb41.nameCN || "") + "\n";
  _0x1da30c += "英文名称: " + (_0x15bb41.nameEN || "") + "\n";
  _0x1da30c += "上半身: " + (_0x15bb41.upperBody || "") + "\n";
  _0x1da30c += "上半身背面: " + (_0x15bb41.upperBodyBack || "") + "\n";
  _0x1da30c += "下半身: " + (_0x15bb41.fullBody || "") + "\n";
  _0x1da30c += "下半身背面: " + (_0x15bb41.fullBodyBack || "") + "\n";
  _0x1da30c += "</服装>";
  return _0x1da30c;
}
function getImageTags() {
  const _0x159056 = extension_settings[extensionName];
  const _0x59ec2c = _0x159056?.startTag || "image###";
  const _0x142e78 = _0x159056?.endTag || "###";
  const _0x2c7c2c = {
    startTag: _0x59ec2c,
    endTag: _0x142e78
  };
  return _0x2c7c2c;
}
function extractImagePrompt(_0x291234) {
  if (!_0x291234 || typeof _0x291234 !== "string") {
    return "";
  }
  const {
    startTag: _0x394c71,
    endTag: _0x2425ef
  } = getImageTags();
  const _0x558575 = _0x394c71.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const _0x25269e = _0x2425ef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const _0xbd3dfb = new RegExp(_0x558575 + "([\\s\\S]*?)" + _0x25269e);
  const _0x16a7b7 = _0x291234.match(_0xbd3dfb);
  if (_0x16a7b7 && _0x16a7b7[1]) {
    return _0x16a7b7[1].trim();
  }
  return "";
}
function readFileAsBase64(_0x2128f1) {
  return new Promise((_0xb8051a, _0x5e9e24) => {
    const _0x517a50 = new FileReader();
    _0x517a50.onload = () => _0xb8051a(_0x517a50.result);
    _0x517a50.onerror = _0x5e9e24;
    _0x517a50.readAsDataURL(_0x2128f1);
  });
}
function attachImagesToMessage(_0x54ebbf, _0x13c352, _0x532ef5, _0x321f6c = "参考图片") {
  if (!_0x532ef5 || _0x532ef5.length === 0 || _0x13c352 < 0 || _0x13c352 >= _0x54ebbf.length) {
    return _0x54ebbf;
  }
  const _0x5c02b3 = [..._0x54ebbf];
  const _0x25ae5f = _0x5c02b3[_0x13c352];
  const _0x58faa3 = [];
  if (typeof _0x25ae5f.content === "string") {
    const _0x4f64c0 = {
      type: "text",
      text: _0x25ae5f.content
    };
    _0x58faa3.push(_0x4f64c0);
  } else if (Array.isArray(_0x25ae5f.content)) {
    _0x58faa3.push(..._0x25ae5f.content);
  }
  if (_0x532ef5.length > 0) {
    const _0x349fef = {
      type: "text",
      text: "\n[以下是用户上传的" + _0x532ef5.length + "张" + _0x321f6c + "]"
    };
    _0x58faa3.push(_0x349fef);
  }
  _0x532ef5.forEach((_0x5073cd, _0x22ddc8) => {
    const _0x499534 = typeof _0x5073cd === "string" ? _0x5073cd : _0x5073cd.base64;
    const _0x4850c1 = typeof _0x5073cd === "object" && _0x5073cd.name ? _0x5073cd.name : "" + _0x321f6c + (_0x22ddc8 + 1);
    const _0x3e392e = {
      type: "text",
      text: "[" + _0x4850c1 + "]"
    };
    _0x58faa3.push(_0x3e392e);
    let _0x4b3019 = _0x499534;
    if (!_0x499534.startsWith("data:")) {
      _0x4b3019 = "data:image/png;base64," + _0x499534;
    }
    const _0xf5c6fb = {
      type: "image_url",
      image_url: {}
    };
    _0xf5c6fb.image_url.url = _0x4b3019;
    _0xf5c6fb.image_url.detail = "auto";
    _0x58faa3.push(_0xf5c6fb);
  });
  const _0x403060 = {
    ..._0x25ae5f
  };
  _0x403060.content = _0x58faa3;
  _0x5c02b3[_0x13c352] = _0x403060;
  return _0x5c02b3;
}
function findMessageIndexWithPlaceholder(_0x1e7e34, _0x623050) {
  for (let _0x32d693 = 0; _0x32d693 < _0x1e7e34.length; _0x32d693++) {
    const _0xa6900b = _0x1e7e34[_0x32d693];
    if (typeof _0xa6900b.content === "string" && _0xa6900b.content.includes(_0x623050)) {
      return _0x32d693;
    } else if (Array.isArray(_0xa6900b.content)) {
      for (const _0x550332 of _0xa6900b.content) {
        if (_0x550332.type === "text" && _0x550332.text.includes(_0x623050)) {
          return _0x32d693;
        }
      }
    }
  }
  return -1;
}
function showUserRequirementPopup() {
  return new Promise(_0x2f9dea => {
    const _0x56bab5 = [];
    const _0x2045ad = document.getElementById("st-chatu8-settings") || document.body;
    const _0x3efd16 = document.createElement("div");
    _0x3efd16.className = "st-chatu8-confirm-backdrop";
    const _0x4f6daf = document.createElement("div");
    _0x4f6daf.className = "st-chatu8-confirm-box st-chatu8-popup-modal";
    const _0x2f73fa = document.createElement("h3");
    _0x2f73fa.className = "st-chatu8-popup-title";
    _0x2f73fa.textContent = "生成服装图片提示词";
    _0x4f6daf.appendChild(_0x2f73fa);
    const _0xcaf34d = document.createElement("p");
    _0xcaf34d.className = "st-chatu8-popup-description";
    _0xcaf34d.textContent = "请输入您的具体需求，AI 将根据服装信息生成图片提示词：";
    _0x4f6daf.appendChild(_0xcaf34d);
    const _0x1cceb6 = document.createElement("textarea");
    _0x1cceb6.className = "st-chatu8-textarea";
    _0x1cceb6.rows = 4;
    _0x1cceb6.placeholder = "例如：展示服装全貌、特写细节、模特穿着效果...";
    _0x4f6daf.appendChild(_0x1cceb6);
    const _0x12a413 = document.createElement("div");
    _0x12a413.className = "st-chatu8-popup-upload-section";
    const _0x34c608 = document.createElement("div");
    _0x34c608.className = "st-chatu8-popup-upload-header";
    const _0xd36431 = document.createElement("span");
    _0xd36431.className = "st-chatu8-popup-upload-label";
    _0xd36431.textContent = "📎 参考图片（可选）";
    const _0x103982 = document.createElement("input");
    _0x103982.type = "file";
    _0x103982.accept = "image/*";
    _0x103982.multiple = true;
    _0x103982.style.display = "none";
    const _0x5d200d = document.createElement("button");
    _0x5d200d.type = "button";
    _0x5d200d.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加图片";
    _0x5d200d.className = "st-chatu8-btn st-chatu8-popup-upload-btn";
    _0x5d200d.addEventListener("click", () => _0x103982.click());
    _0x34c608.appendChild(_0xd36431);
    _0x34c608.appendChild(_0x5d200d);
    const _0x4bc00b = document.createElement("div");
    _0x4bc00b.className = "st-chatu8-popup-image-preview";
    const _0x4d662a = document.createElement("div");
    _0x4d662a.className = "st-chatu8-popup-empty-hint";
    _0x4d662a.textContent = "点击上方按钮添加参考图片";
    _0x4bc00b.appendChild(_0x4d662a);
    function _0x5563ec() {
      _0x4bc00b.innerHTML = "";
      if (_0x56bab5.length === 0) {
        const _0x59ee9a = document.createElement("div");
        _0x59ee9a.className = "st-chatu8-popup-empty-hint";
        _0x59ee9a.textContent = "点击上方按钮添加参考图片";
        _0x4bc00b.appendChild(_0x59ee9a);
        return;
      }
      _0x56bab5.forEach((_0x5bdc06, _0x5822b8) => {
        const _0x275e96 = document.createElement("div");
        _0x275e96.className = "st-chatu8-popup-image-item";
        const _0x5ae722 = document.createElement("div");
        _0x5ae722.className = "st-chatu8-popup-image-wrapper";
        const _0x390509 = document.createElement("img");
        _0x390509.src = _0x5bdc06.base64;
        const _0x3daefe = document.createElement("button");
        _0x3daefe.type = "button";
        _0x3daefe.className = "st-chatu8-popup-image-delete";
        _0x3daefe.innerHTML = "×";
        _0x3daefe.addEventListener("click", _0x276214 => {
          _0x276214.stopPropagation();
          _0x56bab5.splice(_0x5822b8, 1);
          _0x5563ec();
        });
        _0x5ae722.addEventListener("mouseenter", () => {
          _0x3daefe.style.opacity = "1";
        });
        _0x5ae722.addEventListener("mouseleave", () => {
          _0x3daefe.style.opacity = "0";
        });
        _0x5ae722.appendChild(_0x390509);
        _0x5ae722.appendChild(_0x3daefe);
        const _0x31b9e5 = document.createElement("input");
        _0x31b9e5.type = "text";
        _0x31b9e5.className = "st-chatu8-popup-image-name";
        _0x31b9e5.placeholder = "图" + (_0x5822b8 + 1);
        _0x31b9e5.value = _0x5bdc06.name || "";
        _0x31b9e5.addEventListener("input", _0x550c7c => {
          _0x56bab5[_0x5822b8].name = _0x550c7c.target.value;
        });
        _0x275e96.appendChild(_0x5ae722);
        _0x275e96.appendChild(_0x31b9e5);
        _0x4bc00b.appendChild(_0x275e96);
      });
      const _0x342165 = document.createElement("div");
      _0x342165.className = "st-chatu8-popup-image-count";
      _0x342165.textContent = "已添加 " + _0x56bab5.length + " 张图片";
      _0x4bc00b.appendChild(_0x342165);
    }
    _0x103982.addEventListener("change", async _0x544d11 => {
      const _0x5e92dc = _0x544d11.target.files;
      if (!_0x5e92dc || _0x5e92dc.length === 0) {
        return;
      }
      for (const _0x167df2 of _0x5e92dc) {
        if (!_0x167df2.type.startsWith("image/")) {
          continue;
        }
        try {
          const _0x4be620 = await readFileAsBase64(_0x167df2);
          const _0x298c38 = {
            base64: _0x4be620,
            name: ""
          };
          _0x56bab5.push(_0x298c38);
        } catch (_0x27c412) {
          console.error("[outfitImagePromptGen] Failed to read image:", _0x27c412);
        }
      }
      _0x5563ec();
      _0x103982.value = "";
    });
    _0x12a413.appendChild(_0x34c608);
    _0x12a413.appendChild(_0x103982);
    _0x12a413.appendChild(_0x4bc00b);
    _0x4f6daf.appendChild(_0x12a413);
    const _0x1dcb60 = document.createElement("div");
    _0x1dcb60.className = "st-chatu8-confirm-buttons";
    const _0xd1ec8a = document.createElement("button");
    _0xd1ec8a.textContent = "取消";
    _0xd1ec8a.className = "st-chatu8-btn";
    _0x1dcb60.appendChild(_0xd1ec8a);
    const _0x4ddc0f = document.createElement("button");
    _0x4ddc0f.innerHTML = "<i class=\"fa-solid fa-magic\"></i> 生成";
    _0x4ddc0f.className = "st-chatu8-btn st-chatu8-btn-primary";
    _0x1dcb60.appendChild(_0x4ddc0f);
    _0x4f6daf.appendChild(_0x1dcb60);
    _0x3efd16.appendChild(_0x4f6daf);
    _0x2045ad.appendChild(_0x3efd16);
    setTimeout(() => _0x1cceb6.focus(), 100);
    const _0x36530a = _0x3ed459 => {
      _0x2045ad.removeChild(_0x3efd16);
      _0x2f9dea(_0x3ed459);
    };
    _0xd1ec8a.addEventListener("click", () => _0x36530a(null));
    _0x4ddc0f.addEventListener("click", () => {
      const _0x132bcd = _0x1cceb6.value.trim();
      _0x36530a({
        text: _0x132bcd || "",
        images: [..._0x56bab5]
      });
    });
    const _0x2af1b4 = _0x25efe7 => {
      if (_0x25efe7.key === "Escape") {
        _0x36530a(null);
        document.removeEventListener("keydown", _0x2af1b4);
      } else if (_0x25efe7.key === "Enter" && _0x25efe7.ctrlKey) {
        _0x36530a({
          text: _0x1cceb6.value.trim() || "",
          images: [..._0x56bab5]
        });
        document.removeEventListener("keydown", _0x2af1b4);
      }
    };
    document.addEventListener("keydown", _0x2af1b4);
  });
}
function showResultConfirmPopup(_0x397bb8) {
  return new Promise(_0x594987 => {
    const _0x27e7dd = document.getElementById("st-chatu8-settings") || document.body;
    const _0x39fca7 = document.createElement("div");
    _0x39fca7.className = "st-chatu8-confirm-backdrop";
    const _0x5897e4 = document.createElement("div");
    _0x5897e4.className = "st-chatu8-confirm-box st-chatu8-popup-modal";
    const _0x15e77e = document.createElement("h3");
    _0x15e77e.className = "st-chatu8-popup-title";
    _0x15e77e.textContent = "生成结果";
    _0x5897e4.appendChild(_0x15e77e);
    const _0x5983cb = document.createElement("p");
    _0x5983cb.className = "st-chatu8-popup-description";
    _0x5983cb.textContent = "以下是生成的图片提示词，确认后将保存到服装预设中：";
    _0x5897e4.appendChild(_0x5983cb);
    const _0x1bec37 = document.createElement("textarea");
    _0x1bec37.className = "st-chatu8-textarea";
    _0x1bec37.value = _0x397bb8;
    _0x1bec37.rows = 8;
    _0x5897e4.appendChild(_0x1bec37);
    const _0x166752 = document.createElement("div");
    _0x166752.className = "st-chatu8-confirm-buttons";
    const _0x49b4da = document.createElement("button");
    _0x49b4da.textContent = "取消";
    _0x49b4da.className = "st-chatu8-btn";
    _0x166752.appendChild(_0x49b4da);
    const _0x2fde47 = document.createElement("button");
    _0x2fde47.innerHTML = "<i class=\"fa-solid fa-check\"></i> 确认保存";
    _0x2fde47.className = "st-chatu8-btn st-chatu8-btn-success";
    _0x166752.appendChild(_0x2fde47);
    _0x5897e4.appendChild(_0x166752);
    _0x39fca7.appendChild(_0x5897e4);
    _0x27e7dd.appendChild(_0x39fca7);
    const _0x436abc = (_0x2bdd93, _0x19b379 = null) => {
      _0x27e7dd.removeChild(_0x39fca7);
      _0x594987({
        confirmed: _0x2bdd93,
        prompt: _0x19b379 || _0x397bb8
      });
    };
    _0x49b4da.addEventListener("click", () => _0x436abc(false));
    _0x2fde47.addEventListener("click", () => {
      _0x436abc(true, _0x1bec37.value.trim());
    });
  });
}
export async function handleOutfitImagePromptGenerate(_0x418bdb, _0x1f7835 = []) {
  console.log("[outfitImagePromptGen] Starting outfit image prompt generation...");
  toastr.info("正在生成服装图片提示词...");
  try {
    const _0x5ed132 = extension_settings[extensionName];
    const _0x558246 = getCurrentOutfitPreset();
    if (!_0x558246) {
      toastr.error("请先选择一个服装预设");
      return;
    }
    console.log("[outfitImagePromptGen] Current preset:", _0x558246.id);
    const _0x5c28a7 = buildOutfitText(_0x558246);
    const _0x13a545 = [_0x418bdb || "", _0x5c28a7].filter(Boolean).join("\n");
    let _0x254a3d = buildPromptForRequestType("char_display", _0x13a545);
    const _0x44da6d = new Set();
    const _0x4688eb = findMessageIndexWithPlaceholder(_0x254a3d, "{{用户需求}}");
    console.log("[outfitImagePromptGen] User requirement message index:", _0x4688eb);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{当前服装}}", _0x5c28a7, _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{服装列表}}", _0x5c28a7, _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{用户需求}}", _0x418bdb || "", _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{当前角色}}", "", _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{上下文}}", "", _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{世界书触发}}", "", _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{角色启用列表}}", "", _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{通用服装启用列表}}", "", _0x44da6d);
    _0x254a3d = replacePlaceholder(_0x254a3d, "{{通用角色启用列表}}", "", _0x44da6d);
    console.log("[outfitImagePromptGen] Final prompt:", _0x254a3d);
    let _0x214ca8 = "";
    if (_0x44da6d.size > 0) {
      _0x214ca8 = "诊断：检测到以下变量被使用：" + [..._0x44da6d].join("、") + "\n";
    }
    if (_0x1f7835 && _0x1f7835.length > 0 && _0x4688eb >= 0) {
      _0x254a3d = attachImagesToMessage(_0x254a3d, _0x4688eb, _0x1f7835, "参考图片");
      console.log("[outfitImagePromptGen] Attached", _0x1f7835.length, "images to message at index", _0x4688eb);
    }
    updateCombinedPrompt(_0x254a3d, _0x214ca8);
    const _0x517385 = await LLM_OUTFIT_DISPLAY(_0x254a3d, {
      timeoutMs: 300000
    });
    console.log("[outfitImagePromptGen] LLM output:", _0x517385);
    if (!_0x517385) {
      toastr.error("LLM 返回结果为空");
      return;
    }
    const _0x11f7ac = extractImagePrompt(_0x517385);
    if (!_0x11f7ac) {
      const {
        startTag: _0x28165d,
        endTag: _0x172d20
      } = getImageTags();
      toastr.warning("未在 LLM 输出中检测到 " + _0x28165d + "..." + _0x172d20 + " 格式的提示词");
      console.log("[outfitImagePromptGen] Raw LLM output for debugging:", _0x517385);
      return;
    }
    console.log("[outfitImagePromptGen] Extracted prompt:", _0x11f7ac);
    const _0x578d4f = await showResultConfirmPopup(_0x11f7ac);
    if (!_0x578d4f.confirmed) {
      toastr.info("已取消保存");
      return;
    }
    const _0x2d7d1 = _0x5ed132.outfitPresets[_0x558246.id];
    if (_0x2d7d1) {
      _0x2d7d1.photoPrompt = _0x578d4f.prompt;
      saveSettingsDebounced();
      const _0x1a35d2 = document.getElementById("outfit_photo_prompt");
      if (_0x1a35d2) {
        _0x1a35d2.value = _0x578d4f.prompt;
      }
      toastr.success("服装图片提示词已生成并保存！");
    }
  } catch (_0x46eff3) {
    console.error("[outfitImagePromptGen] Error:", _0x46eff3);
    toastr.error("服装图片提示词生成失败: " + _0x46eff3.message);
  }
}
export async function handleOutfitPhotoGeneratePromptClick() {
  const _0x2ecd3e = await showUserRequirementPopup();
  if (_0x2ecd3e === null) {
    return;
  }
  await handleOutfitImagePromptGenerate(_0x2ecd3e.text, _0x2ecd3e.images);
}