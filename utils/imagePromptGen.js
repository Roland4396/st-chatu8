import { eventSource } from "../../../../../script.js";
import { eventNames, extensionName } from "./config.js";
import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { stylishConfirm } from "./ui_common.js";
import { mergeAdjacentMessages, replacePlaceholder as _0x5c03bb } from "./promptProcessor.js";
function getImageTags() {
  const _0x5b1dcc = extension_settings[extensionName];
  const _0x470c3b = _0x5b1dcc?.startTag || "image###";
  const _0x539a1b = _0x5b1dcc?.endTag || "###";
  const _0xc90602 = {
    startTag: _0x470c3b,
    endTag: _0x539a1b
  };
  return _0xc90602;
}
function generateRequestId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export function LLM_CHAR_DISPLAY_GET_PROMPT() {
  return new Promise((_0x45ac9b, _0x7fee25) => {
    const _0x2b878f = generateRequestId();
    console.log("[imagePromptGen] 请求获取角色/服装展示提示词 (ID: " + _0x2b878f + ")");
    const _0x30a21b = _0x1c3603 => {
      if (_0x1c3603.id !== _0x2b878f) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x30a21b);
      const {
        prompt: _0x59ebc8
      } = _0x1c3603;
      console.log("[imagePromptGen] 已获取角色/服装展示提示词 (ID: " + _0x2b878f + "):", _0x59ebc8);
      _0x45ac9b(_0x59ebc8);
    };
    eventSource.on(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x30a21b);
    const _0x46ad51 = {
      id: _0x2b878f
    };
    eventSource.emit(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_REQUEST, _0x46ad51);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x30a21b);
      _0x7fee25(new Error("获取角色/服装展示提示词超时"));
    }, 10000);
  });
}
export function LLM_CHAR_DISPLAY(_0x4cabbe, _0x116752 = {}) {
  return new Promise((_0xafce1c, _0x538f5a) => {
    const _0xfc947a = generateRequestId();
    const _0x51ec55 = _0x116752.timeoutMs || 180000;
    let _0x176675 = null;
    console.log("[imagePromptGen] 执行角色/服装展示 LLM 请求 (ID: " + _0xfc947a + ")");
    const _0x39e4ae = () => {
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_RESPONSE, _0x5ad0fb);
      if (_0x176675) {
        clearTimeout(_0x176675);
        _0x176675 = null;
      }
    };
    const _0x5ad0fb = _0x3cc990 => {
      if (_0x3cc990.id !== _0xfc947a) {
        return;
      }
      _0x39e4ae();
      if (_0x3cc990.success) {
        _0xafce1c(_0x3cc990.result);
      } else {
        _0x538f5a(new Error(_0x3cc990.result || "LLM 请求失败"));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_DISPLAY_RESPONSE, _0x5ad0fb);
    const _0x5453f0 = {
      prompt: _0x4cabbe,
      id: _0xfc947a
    };
    eventSource.emit(eventNames.LLM_CHAR_DISPLAY_REQUEST, _0x5453f0);
    _0x176675 = setTimeout(() => {
      _0x39e4ae();
      _0x538f5a(new Error("角色/服装展示 LLM 请求超时"));
    }, _0x51ec55);
  });
}
function replacePlaceholder(_0x51131d, _0x2c315e, _0x6bd36b, _0x311bfd) {
  if (typeof _0x51131d === "string") {
    if (_0x6bd36b && _0x51131d.includes(_0x2c315e)) {
      if (_0x311bfd) {
        _0x311bfd.add(_0x2c315e);
      }
    }
    return _0x51131d.replaceAll(_0x2c315e, _0x6bd36b);
  }
  if (Array.isArray(_0x51131d)) {
    return _0x51131d.map(_0x1bd441 => replacePlaceholder(_0x1bd441, _0x2c315e, _0x6bd36b, _0x311bfd));
  }
  if (_0x51131d && typeof _0x51131d === "object") {
    const _0x15b5ae = {};
    for (const _0x27fb5a in _0x51131d) {
      _0x15b5ae[_0x27fb5a] = replacePlaceholder(_0x51131d[_0x27fb5a], _0x2c315e, _0x6bd36b, _0x311bfd);
    }
    return _0x15b5ae;
  }
  return _0x51131d;
}
function getCurrentCharacterPreset() {
  const _0x4b5b73 = extension_settings[extensionName];
  const _0x599dcd = _0x4b5b73.characterPresetId;
  if (!_0x599dcd || !_0x4b5b73.characterPresets[_0x599dcd]) {
    return null;
  }
  const _0xf741d4 = {
    id: _0x599dcd,
    data: _0x4b5b73.characterPresets[_0x599dcd]
  };
  return _0xf741d4;
}
function buildCharacterText(_0x441d57) {
  const _0x2c9a71 = _0x441d57.data;
  let _0x3bc65e = "<人物>\n";
  _0x3bc65e += "中文名称: " + (_0x2c9a71.nameCN || "") + "\n";
  _0x3bc65e += "英文名称: " + (_0x2c9a71.nameEN || "") + "\n";
  _0x3bc65e += "角色特征: " + (_0x2c9a71.characterTraits || "") + "\n";
  _0x3bc65e += "五官外貌: " + (_0x2c9a71.facialFeatures || "") + "\n";
  _0x3bc65e += "五官外貌背面: " + (_0x2c9a71.facialFeaturesBack || "") + "\n";
  _0x3bc65e += "上半身SFW: " + (_0x2c9a71.upperBodySFW || "") + "\n";
  _0x3bc65e += "上半身SFW背面: " + (_0x2c9a71.upperBodySFWBack || "") + "\n";
  _0x3bc65e += "下半身SFW: " + (_0x2c9a71.fullBodySFW || "") + "\n";
  _0x3bc65e += "下半身SFW背面: " + (_0x2c9a71.fullBodySFWBack || "") + "\n";
  _0x3bc65e += "上半身NSFW: " + (_0x2c9a71.upperBodyNSFW || "") + "\n";
  _0x3bc65e += "上半身NSFW背面: " + (_0x2c9a71.upperBodyNSFWBack || "") + "\n";
  _0x3bc65e += "下半身NSFW: " + (_0x2c9a71.fullBodyNSFW || "") + "\n";
  _0x3bc65e += "下半身NSFW背面: " + (_0x2c9a71.fullBodyNSFWBack || "") + "\n";
  _0x3bc65e += "</人物>";
  return _0x3bc65e;
}
function buildOutfitsText(_0x1a4a18) {
  const _0x5003b9 = extension_settings[extensionName];
  const _0x1ffaee = _0x1a4a18.data.outfits || [];
  if (_0x1ffaee.length === 0) {
    return "<服装列表>\n(无服装)\n</服装列表>";
  }
  let _0x4846f4 = "<服装列表>\n";
  for (const _0x3e30c6 of _0x1ffaee) {
    const _0x264f4b = _0x5003b9.outfitPresets[_0x3e30c6];
    if (_0x264f4b) {
      _0x4846f4 += "<服装>\n";
      _0x4846f4 += "服装名称: " + _0x3e30c6 + "\n";
      _0x4846f4 += "中文名称: " + (_0x264f4b.nameCN || "") + "\n";
      _0x4846f4 += "英文名称: " + (_0x264f4b.nameEN || "") + "\n";
      _0x4846f4 += "上半身: " + (_0x264f4b.upperBody || "") + "\n";
      _0x4846f4 += "上半身背面: " + (_0x264f4b.upperBodyBack || "") + "\n";
      _0x4846f4 += "下半身: " + (_0x264f4b.fullBody || "") + "\n";
      _0x4846f4 += "下半身背面: " + (_0x264f4b.fullBodyBack || "") + "\n";
      _0x4846f4 += "</服装>\n";
    } else {
      _0x4846f4 += "<服装>\n";
      _0x4846f4 += "服装名称: " + _0x3e30c6 + "\n";
      _0x4846f4 += "(找不到该服装预设)\n";
      _0x4846f4 += "</服装>\n";
    }
  }
  _0x4846f4 += "</服装列表>";
  return _0x4846f4;
}
function extractImagePrompt(_0x17a8c6) {
  if (!_0x17a8c6 || typeof _0x17a8c6 !== "string") {
    return "";
  }
  const {
    startTag: _0x332485,
    endTag: _0x1bd8a3
  } = getImageTags();
  _0x17a8c6 = _0x17a8c6.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
  const _0x24aa75 = /<images>([\s\S]*?)<\/images>/i;
  const _0x3ebb68 = _0x17a8c6.match(_0x24aa75);
  if (_0x3ebb68 && _0x3ebb68[1]) {
    const _0x81a6fe = _0x3ebb68[1];
    console.log("[imagePromptGen] Found <images> block:", _0x81a6fe.substring(0, 100) + "...");
    const _0x446589 = /<image>([\s\S]*?)<\/image>/gi;
    const _0x29db7d = [];
    let _0x20b3f4;
    while ((_0x20b3f4 = _0x446589.exec(_0x81a6fe)) !== null) {
      const _0xb191ea = _0x20b3f4[1];
      const _0x35c322 = _0x332485.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const _0x56081e = _0x1bd8a3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const _0x4c4414 = new RegExp(_0x35c322 + "([\\s\\S]*?)" + _0x56081e);
      const _0x5ea2f5 = _0xb191ea.match(_0x4c4414);
      if (_0x5ea2f5 && _0x5ea2f5[1]) {
        const _0x512f8f = _0x5ea2f5[1].trim();
        if (_0x512f8f) {
          _0x29db7d.push(_0x512f8f);
          console.log("[imagePromptGen] Extracted " + _0x332485 + "..." + _0x1bd8a3 + " from <image>:", _0x512f8f.substring(0, 50) + "...");
        }
      } else {
        const _0x1d609c = _0xb191ea.trim();
        if (_0x1d609c) {
          _0x29db7d.push(_0x1d609c);
          console.log("[imagePromptGen] Using <image> content directly:", _0x1d609c.substring(0, 50) + "...");
        }
      }
    }
    if (_0x29db7d.length > 0) {
      if (_0x29db7d.length === 1) {
        return _0x29db7d[0];
      } else {
        return _0x29db7d;
      }
    }
    const _0x15a066 = _0x81a6fe.trim();
    if (_0x15a066) {
      console.log("[imagePromptGen] No <image> tags found, using <images> block content directly");
      return _0x15a066;
    }
  }
  const _0x3f514a = _0x332485.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const _0x43168a = _0x1bd8a3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const _0x1f29e3 = new RegExp(_0x3f514a + "([\\s\\S]*?)" + _0x43168a);
  const _0x4ed38f = _0x17a8c6.match(_0x1f29e3);
  if (_0x4ed38f && _0x4ed38f[1]) {
    console.log("[imagePromptGen] Using legacy " + _0x332485 + "..." + _0x1bd8a3 + " format");
    return _0x4ed38f[1].trim();
  }
  return "";
}
function readFileAsBase64(_0x1ed6dc) {
  return new Promise((_0x33e479, _0x60afd1) => {
    const _0x169249 = new FileReader();
    _0x169249.onload = () => _0x33e479(_0x169249.result);
    _0x169249.onerror = _0x60afd1;
    _0x169249.readAsDataURL(_0x1ed6dc);
  });
}
function attachImagesToMessage(_0x111917, _0x506de4, _0x73d5af, _0x12a409 = "参考图片") {
  if (!_0x73d5af || _0x73d5af.length === 0 || _0x506de4 < 0 || _0x506de4 >= _0x111917.length) {
    return _0x111917;
  }
  const _0x721a15 = [..._0x111917];
  const _0x55661f = _0x721a15[_0x506de4];
  const _0xc16675 = [];
  if (typeof _0x55661f.content === "string") {
    const _0x38f5ba = {
      type: "text",
      text: _0x55661f.content
    };
    _0xc16675.push(_0x38f5ba);
  } else if (Array.isArray(_0x55661f.content)) {
    _0xc16675.push(..._0x55661f.content);
  }
  if (_0x73d5af.length > 0) {
    const _0x438ca3 = {
      type: "text",
      text: "\n[以下是用户上传的" + _0x73d5af.length + "张" + _0x12a409 + "]"
    };
    _0xc16675.push(_0x438ca3);
  }
  _0x73d5af.forEach((_0x1f2bf9, _0x3baf04) => {
    const _0x542fdf = typeof _0x1f2bf9 === "string" ? _0x1f2bf9 : _0x1f2bf9.base64;
    const _0x4544a2 = typeof _0x1f2bf9 === "object" && _0x1f2bf9.name ? _0x1f2bf9.name : "" + _0x12a409 + (_0x3baf04 + 1);
    const _0xb6c280 = {
      type: "text",
      text: "[" + _0x4544a2 + "]"
    };
    _0xc16675.push(_0xb6c280);
    let _0x2801e0 = _0x542fdf;
    if (!_0x542fdf.startsWith("data:")) {
      _0x2801e0 = "data:image/png;base64," + _0x542fdf;
    }
    const _0x54db0a = {
      url: _0x2801e0,
      detail: "auto"
    };
    const _0x6b55c1 = {
      type: "image_url",
      image_url: _0x54db0a
    };
    _0xc16675.push(_0x6b55c1);
  });
  const _0x585f35 = {
    ..._0x55661f
  };
  _0x585f35.content = _0xc16675;
  _0x721a15[_0x506de4] = _0x585f35;
  return _0x721a15;
}
function findMessageIndexWithPlaceholder(_0x2e3001, _0x644dd2) {
  for (let _0x29e0a5 = 0; _0x29e0a5 < _0x2e3001.length; _0x29e0a5++) {
    const _0x429732 = _0x2e3001[_0x29e0a5];
    if (typeof _0x429732.content === "string" && _0x429732.content.includes(_0x644dd2)) {
      return _0x29e0a5;
    } else if (Array.isArray(_0x429732.content)) {
      for (const _0x5b093e of _0x429732.content) {
        if (_0x5b093e.type === "text" && _0x5b093e.text.includes(_0x644dd2)) {
          return _0x29e0a5;
        }
      }
    }
  }
  return -1;
}
function showUserRequirementPopup() {
  return new Promise(_0x15f885 => {
    const _0x8184db = [];
    const _0xe4dcda = document.getElementById("st-chatu8-settings") || document.body;
    const _0x417af2 = document.createElement("div");
    _0x417af2.className = "st-chatu8-confirm-backdrop";
    const _0x5c03fe = document.createElement("div");
    _0x5c03fe.className = "st-chatu8-confirm-box st-chatu8-popup-modal";
    const _0x99d297 = document.createElement("h3");
    _0x99d297.className = "st-chatu8-popup-title";
    _0x99d297.textContent = "生成图片提示词";
    _0x5c03fe.appendChild(_0x99d297);
    const _0x2d74cb = document.createElement("p");
    _0x2d74cb.className = "st-chatu8-popup-description";
    _0x2d74cb.textContent = "请输入您的具体需求，AI 将根据角色和服装信息生成图片提示词：";
    _0x5c03fe.appendChild(_0x2d74cb);
    const _0x2cda78 = document.createElement("textarea");
    _0x2cda78.className = "st-chatu8-textarea";
    _0x2cda78.rows = 4;
    _0x2cda78.placeholder = "例如：角色站在花园中、穿着校服的日常场景、光线柔和的室内...";
    _0x5c03fe.appendChild(_0x2cda78);
    const _0x459e0d = document.createElement("div");
    _0x459e0d.className = "st-chatu8-popup-upload-section";
    const _0x34dd3e = document.createElement("div");
    _0x34dd3e.className = "st-chatu8-popup-upload-header";
    const _0x55be59 = document.createElement("span");
    _0x55be59.className = "st-chatu8-popup-upload-label";
    _0x55be59.textContent = "📎 参考图片（可选）";
    const _0x393aa1 = document.createElement("input");
    _0x393aa1.type = "file";
    _0x393aa1.accept = "image/*";
    _0x393aa1.multiple = true;
    _0x393aa1.style.display = "none";
    const _0x58fb69 = document.createElement("button");
    _0x58fb69.type = "button";
    _0x58fb69.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加图片";
    _0x58fb69.className = "st-chatu8-btn st-chatu8-popup-upload-btn";
    _0x58fb69.addEventListener("click", () => _0x393aa1.click());
    _0x34dd3e.appendChild(_0x55be59);
    _0x34dd3e.appendChild(_0x58fb69);
    const _0x4476af = document.createElement("div");
    _0x4476af.className = "st-chatu8-popup-image-preview";
    const _0x2f37c0 = document.createElement("div");
    _0x2f37c0.className = "st-chatu8-popup-empty-hint";
    _0x2f37c0.textContent = "点击上方按钮添加参考图片";
    _0x4476af.appendChild(_0x2f37c0);
    function _0x3bcffc() {
      _0x4476af.innerHTML = "";
      if (_0x8184db.length === 0) {
        const _0x177090 = document.createElement("div");
        _0x177090.className = "st-chatu8-popup-empty-hint";
        _0x177090.textContent = "点击上方按钮添加参考图片";
        _0x4476af.appendChild(_0x177090);
        return;
      }
      _0x8184db.forEach((_0x117e5a, _0x2d0638) => {
        const _0x111bc5 = document.createElement("div");
        _0x111bc5.className = "st-chatu8-popup-image-item";
        const _0x5505c2 = document.createElement("div");
        _0x5505c2.className = "st-chatu8-popup-image-wrapper";
        const _0x4f296d = document.createElement("img");
        _0x4f296d.src = _0x117e5a.base64;
        const _0x31fa77 = document.createElement("button");
        _0x31fa77.type = "button";
        _0x31fa77.className = "st-chatu8-popup-image-delete";
        _0x31fa77.innerHTML = "×";
        _0x31fa77.addEventListener("click", _0x1316af => {
          _0x1316af.stopPropagation();
          _0x8184db.splice(_0x2d0638, 1);
          _0x3bcffc();
        });
        _0x5505c2.addEventListener("mouseenter", () => {
          _0x31fa77.style.opacity = "1";
        });
        _0x5505c2.addEventListener("mouseleave", () => {
          _0x31fa77.style.opacity = "0";
        });
        _0x5505c2.appendChild(_0x4f296d);
        _0x5505c2.appendChild(_0x31fa77);
        const _0x227946 = document.createElement("input");
        _0x227946.type = "text";
        _0x227946.className = "st-chatu8-popup-image-name";
        _0x227946.placeholder = "图" + (_0x2d0638 + 1);
        _0x227946.value = _0x117e5a.name || "";
        _0x227946.addEventListener("input", _0x27eb9b => {
          _0x8184db[_0x2d0638].name = _0x27eb9b.target.value;
        });
        _0x111bc5.appendChild(_0x5505c2);
        _0x111bc5.appendChild(_0x227946);
        _0x4476af.appendChild(_0x111bc5);
      });
      const _0x5f19e8 = document.createElement("div");
      _0x5f19e8.className = "st-chatu8-popup-image-count";
      _0x5f19e8.textContent = "已添加 " + _0x8184db.length + " 张图片";
      _0x4476af.appendChild(_0x5f19e8);
    }
    _0x393aa1.addEventListener("change", async _0x5c20f1 => {
      const _0x575276 = _0x5c20f1.target.files;
      if (!_0x575276 || _0x575276.length === 0) {
        return;
      }
      for (const _0x4183ff of _0x575276) {
        if (!_0x4183ff.type.startsWith("image/")) {
          continue;
        }
        try {
          const _0x3e0776 = await readFileAsBase64(_0x4183ff);
          const _0x2b4d08 = {
            base64: _0x3e0776,
            name: ""
          };
          _0x8184db.push(_0x2b4d08);
        } catch (_0x1165e4) {
          console.error("[imagePromptGen] Failed to read image:", _0x1165e4);
        }
      }
      _0x3bcffc();
      _0x393aa1.value = "";
    });
    _0x459e0d.appendChild(_0x34dd3e);
    _0x459e0d.appendChild(_0x393aa1);
    _0x459e0d.appendChild(_0x4476af);
    _0x5c03fe.appendChild(_0x459e0d);
    const _0x16ca1b = document.createElement("div");
    _0x16ca1b.className = "st-chatu8-confirm-buttons";
    const _0x362111 = document.createElement("button");
    _0x362111.textContent = "取消";
    _0x362111.className = "st-chatu8-btn";
    _0x16ca1b.appendChild(_0x362111);
    const _0x38afb8 = document.createElement("button");
    _0x38afb8.innerHTML = "<i class=\"fa-solid fa-magic\"></i> 生成";
    _0x38afb8.className = "st-chatu8-btn st-chatu8-btn-primary";
    _0x16ca1b.appendChild(_0x38afb8);
    _0x5c03fe.appendChild(_0x16ca1b);
    _0x417af2.appendChild(_0x5c03fe);
    _0xe4dcda.appendChild(_0x417af2);
    setTimeout(() => _0x2cda78.focus(), 100);
    const _0x54c214 = _0x409681 => {
      _0xe4dcda.removeChild(_0x417af2);
      _0x15f885(_0x409681);
    };
    _0x362111.addEventListener("click", () => _0x54c214(null));
    _0x38afb8.addEventListener("click", () => {
      const _0x2e504f = _0x2cda78.value.trim();
      const _0x53c2db = {
        text: _0x2e504f || "",
        images: [..._0x8184db]
      };
      _0x54c214(_0x53c2db);
    });
    const _0x15f3c0 = _0x1cb41c => {
      if (_0x1cb41c.key === "Escape") {
        _0x54c214(null);
        document.removeEventListener("keydown", _0x15f3c0);
      } else if (_0x1cb41c.key === "Enter" && _0x1cb41c.ctrlKey) {
        _0x54c214({
          text: _0x2cda78.value.trim() || "",
          images: [..._0x8184db]
        });
        document.removeEventListener("keydown", _0x15f3c0);
      }
    };
    document.addEventListener("keydown", _0x15f3c0);
  });
}
function showResultConfirmPopup(_0x1e0484) {
  return new Promise(_0x5429c5 => {
    const _0x2db4c2 = document.getElementById("st-chatu8-settings") || document.body;
    const _0x4d3c9b = document.createElement("div");
    _0x4d3c9b.className = "st-chatu8-confirm-backdrop";
    const _0x5703fc = document.createElement("div");
    _0x5703fc.className = "st-chatu8-confirm-box st-chatu8-popup-modal";
    const _0x55748f = document.createElement("h3");
    _0x55748f.className = "st-chatu8-popup-title";
    _0x55748f.textContent = "生成结果";
    _0x5703fc.appendChild(_0x55748f);
    const _0x1ed72e = document.createElement("p");
    _0x1ed72e.className = "st-chatu8-popup-description";
    _0x1ed72e.textContent = "以下是生成的图片提示词，确认后将保存到角色预设中：";
    _0x5703fc.appendChild(_0x1ed72e);
    const _0x50a66c = document.createElement("textarea");
    _0x50a66c.className = "st-chatu8-textarea";
    _0x50a66c.value = _0x1e0484;
    _0x50a66c.rows = 8;
    _0x5703fc.appendChild(_0x50a66c);
    const _0x1e0f32 = document.createElement("div");
    _0x1e0f32.className = "st-chatu8-confirm-buttons";
    const _0x13c3b6 = document.createElement("button");
    _0x13c3b6.textContent = "取消";
    _0x13c3b6.className = "st-chatu8-btn";
    _0x1e0f32.appendChild(_0x13c3b6);
    const _0x226d53 = document.createElement("button");
    _0x226d53.innerHTML = "<i class=\"fa-solid fa-check\"></i> 确认保存";
    _0x226d53.className = "st-chatu8-btn st-chatu8-btn-success";
    _0x1e0f32.appendChild(_0x226d53);
    _0x5703fc.appendChild(_0x1e0f32);
    _0x4d3c9b.appendChild(_0x5703fc);
    _0x2db4c2.appendChild(_0x4d3c9b);
    const _0x12ec6a = (_0x1b8dbf, _0x32e826 = null) => {
      _0x2db4c2.removeChild(_0x4d3c9b);
      _0x5429c5({
        confirmed: _0x1b8dbf,
        prompt: _0x32e826 || _0x1e0484
      });
    };
    _0x13c3b6.addEventListener("click", () => _0x12ec6a(false));
    _0x226d53.addEventListener("click", () => {
      _0x12ec6a(true, _0x50a66c.value.trim());
    });
  });
}
export async function handleImagePromptGenerate(_0x3394bb, _0x33db22 = []) {
  console.log("[imagePromptGen] Starting image prompt generation...");
  toastr.info("正在生成图片提示词...");
  try {
    const _0x2a6c8e = extension_settings[extensionName];
    const _0x30f80a = getCurrentCharacterPreset();
    if (!_0x30f80a) {
      toastr.error("请先选择一个角色预设");
      return;
    }
    console.log("[imagePromptGen] Current preset:", _0x30f80a.id);
    const _0x1025b4 = buildCharacterText(_0x30f80a);
    const _0x661c92 = buildOutfitsText(_0x30f80a);
    const _0x24596b = [_0x3394bb || "", _0x1025b4, _0x661c92].filter(Boolean).join("\n");
    let _0x1a6ed4 = buildPromptForRequestType("char_display", _0x24596b);
    const _0x537a19 = new Set();
    _0x1a6ed4 = mergeAdjacentMessages(_0x1a6ed4);
    console.log("[imagePromptGen] 合并相邻消息后:", _0x1a6ed4);
    const _0x236046 = findMessageIndexWithPlaceholder(_0x1a6ed4, "{{用户需求}}");
    console.log("[imagePromptGen] User requirement message index:", _0x236046);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{当前角色}}", _0x1025b4, _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{服装列表}}", _0x661c92, _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{用户需求}}", _0x3394bb || "", _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{当前服装}}", "", _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{上下文}}", "", _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{世界书触发}}", "", _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{角色启用列表}}", "", _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{通用服装启用列表}}", "", _0x537a19);
    _0x1a6ed4 = _0x5c03bb(_0x1a6ed4, "{{通用角色启用列表}}", "", _0x537a19);
    console.log("[imagePromptGen] Final prompt:", _0x1a6ed4);
    let _0x296a71 = "";
    if (_0x537a19.size > 0) {
      _0x296a71 = "诊断：检测到以下变量被使用：" + [..._0x537a19].join("、") + "\n";
    }
    if (_0x33db22 && _0x33db22.length > 0 && _0x236046 >= 0) {
      _0x1a6ed4 = attachImagesToMessage(_0x1a6ed4, _0x236046, _0x33db22, "参考图片");
      console.log("[imagePromptGen] Attached", _0x33db22.length, "images to message at index", _0x236046);
    }
    updateCombinedPrompt(_0x1a6ed4, _0x296a71);
    const _0x3e999 = await LLM_CHAR_DISPLAY(_0x1a6ed4, {
      timeoutMs: 300000
    });
    console.log("[imagePromptGen] LLM output:", _0x3e999);
    if (!_0x3e999) {
      toastr.error("LLM 返回结果为空");
      return;
    }
    const _0x19cf92 = extractImagePrompt(_0x3e999);
    if (!_0x19cf92) {
      const {
        startTag: _0xbdd395,
        endTag: _0x7136ad
      } = getImageTags();
      toastr.warning("未在 LLM 输出中检测到 " + _0xbdd395 + "..." + _0x7136ad + " 格式的提示词");
      console.log("[imagePromptGen] Raw LLM output for debugging:", _0x3e999);
      return;
    }
    console.log("[imagePromptGen] Extracted prompt:", _0x19cf92);
    const _0x40088f = await showResultConfirmPopup(_0x19cf92);
    if (!_0x40088f.confirmed) {
      toastr.info("已取消保存");
      return;
    }
    const _0x1e801c = _0x2a6c8e.characterPresets[_0x30f80a.id];
    if (_0x1e801c) {
      _0x1e801c.photoPrompt = _0x40088f.prompt;
      saveSettingsDebounced();
      const _0x4a6796 = document.getElementById("char_photo_prompt");
      if (_0x4a6796) {
        _0x4a6796.value = _0x40088f.prompt;
      }
      toastr.success("图片提示词已生成并保存！");
    }
  } catch (_0x5cd8a7) {
    console.error("[imagePromptGen] Error:", _0x5cd8a7);
    toastr.error("图片提示词生成失败: " + _0x5cd8a7.message);
  }
}
export async function handlePhotoGeneratePromptClick() {
  const _0x2f12d1 = await showUserRequirementPopup();
  if (_0x2f12d1 === null) {
    return;
  }
  await handleImagePromptGenerate(_0x2f12d1.text, _0x2f12d1.images);
}