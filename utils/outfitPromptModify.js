import { eventSource } from "../../../../../script.js";
import { eventNames, extensionName } from "./config.js";
import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { loadOutfitPreset } from "./settings/character/index.js";
import { stylishConfirm } from "./ui_common.js";
function replacePlaceholder(_0x4c5db1, _0xcb2181, _0x3c552e, _0x2d288e) {
  if (typeof _0x4c5db1 === "string") {
    if (_0x3c552e && _0x4c5db1.includes(_0xcb2181)) {
      if (_0x2d288e) {
        _0x2d288e.add(_0xcb2181);
      }
    }
    return _0x4c5db1.replaceAll(_0xcb2181, _0x3c552e);
  }
  if (Array.isArray(_0x4c5db1)) {
    return _0x4c5db1.map(_0x708fc6 => replacePlaceholder(_0x708fc6, _0xcb2181, _0x3c552e, _0x2d288e));
  }
  if (_0x4c5db1 && typeof _0x4c5db1 === "object") {
    const _0x2a6121 = {};
    for (const _0x375cef in _0x4c5db1) {
      _0x2a6121[_0x375cef] = replacePlaceholder(_0x4c5db1[_0x375cef], _0xcb2181, _0x3c552e, _0x2d288e);
    }
    return _0x2a6121;
  }
  return _0x4c5db1;
}
function attachImagesToMessage(_0x4e97dd, _0x199c3a, _0x5d55d4, _0x45880c = "参考图片") {
  if (!_0x5d55d4 || _0x5d55d4.length === 0 || _0x199c3a < 0 || _0x199c3a >= _0x4e97dd.length) {
    return _0x4e97dd;
  }
  const _0x5113b0 = [..._0x4e97dd];
  const _0x4412fa = _0x5113b0[_0x199c3a];
  const _0x14cfb8 = [];
  if (typeof _0x4412fa.content === "string") {
    const _0xd0217d = {
      type: "text",
      text: _0x4412fa.content
    };
    _0x14cfb8.push(_0xd0217d);
  } else if (Array.isArray(_0x4412fa.content)) {
    _0x14cfb8.push(..._0x4412fa.content);
  }
  if (_0x5d55d4.length > 0) {
    const _0x4c70ac = {
      type: "text",
      text: "\n[以下是用户上传的" + _0x5d55d4.length + "张" + _0x45880c + "]"
    };
    _0x14cfb8.push(_0x4c70ac);
  }
  _0x5d55d4.forEach((_0x5b384a, _0x53eaf5) => {
    const _0x54acf6 = typeof _0x5b384a === "string" ? _0x5b384a : _0x5b384a.base64;
    const _0x5061ea = typeof _0x5b384a === "object" && _0x5b384a.name ? _0x5b384a.name : "" + _0x45880c + (_0x53eaf5 + 1);
    const _0x1b2ff3 = {
      type: "text",
      text: "[" + _0x5061ea + "]"
    };
    _0x14cfb8.push(_0x1b2ff3);
    let _0x5ad28e = _0x54acf6;
    if (!_0x54acf6.startsWith("data:")) {
      _0x5ad28e = "data:image/png;base64," + _0x54acf6;
    }
    const _0x2a0e7c = {
      type: "image_url",
      image_url: {}
    };
    _0x2a0e7c.image_url.url = _0x5ad28e;
    _0x2a0e7c.image_url.detail = "auto";
    _0x14cfb8.push(_0x2a0e7c);
  });
  const _0x1a87bb = {
    ..._0x4412fa
  };
  _0x1a87bb.content = _0x14cfb8;
  _0x5113b0[_0x199c3a] = _0x1a87bb;
  return _0x5113b0;
}
function findMessageIndexWithPlaceholder(_0x1845f8, _0x39c5fe) {
  for (let _0x2be464 = 0; _0x2be464 < _0x1845f8.length; _0x2be464++) {
    const _0x1db832 = _0x1845f8[_0x2be464];
    if (typeof _0x1db832.content === "string" && _0x1db832.content.includes(_0x39c5fe)) {
      return _0x2be464;
    } else if (Array.isArray(_0x1db832.content)) {
      for (const _0x42195c of _0x1db832.content) {
        if (_0x42195c.type === "text" && _0x42195c.text.includes(_0x39c5fe)) {
          return _0x2be464;
        }
      }
    }
  }
  return -1;
}
function generateRequestId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export function LLM_OUTFIT_MODIFY_GET_PROMPT() {
  return new Promise((_0x2dc1a8, _0x506385) => {
    const _0x3b0d9f = generateRequestId();
    console.log("[outfitPromptModify] Requesting outfit modify prompt (ID: " + _0x3b0d9f + ")");
    const _0x1f1092 = _0x3cea43 => {
      if (_0x3cea43.id !== _0x3b0d9f) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x1f1092);
      _0x2dc1a8(_0x3cea43.prompt);
    };
    eventSource.on(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x1f1092);
    const _0x2f0ba5 = {
      id: _0x3b0d9f
    };
    eventSource.emit(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_REQUEST, _0x2f0ba5);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x1f1092);
      _0x506385(new Error("获取服装修改提示词超时"));
    }, 10000);
  });
}
export function LLM_OUTFIT_MODIFY(_0x366b3d, _0x279272 = {}) {
  return new Promise((_0x39df26, _0x2ca88a) => {
    const _0x24f6c2 = generateRequestId();
    const _0x2fe131 = _0x279272.timeoutMs || 60000;
    console.log("[outfitPromptModify] Executing outfit modify LLM request (ID: " + _0x24f6c2 + ")");
    const _0x11e078 = _0x344fe1 => {
      if (_0x344fe1.id !== _0x24f6c2) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_RESPONSE, _0x11e078);
      if (_0x344fe1.success) {
        _0x39df26(_0x344fe1.result);
      } else {
        _0x2ca88a(new Error(_0x344fe1.result || "LLM 请求失败"));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_MODIFY_RESPONSE, _0x11e078);
    const _0x2d806e = {
      prompt: _0x366b3d,
      id: _0x24f6c2
    };
    eventSource.emit(eventNames.LLM_CHAR_MODIFY_REQUEST, _0x2d806e);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_RESPONSE, _0x11e078);
      _0x2ca88a(new Error("服装修改 LLM 请求超时"));
    }, _0x2fe131);
  });
}
function preprocessTagContent(_0x136af9) {
  let _0x40b837 = _0x136af9.replace(/:/g, ":").replace(/\(/g, "（").replace(/\)/g, "）").replace(/,/g, ",");
  return _0x40b837;
}
function parseOutfitData(_0xb5be93) {
  const _0x4436f1 = _0xb5be93.split("\n").map(_0x49a393 => _0x49a393.trim()).filter(_0x4d4954 => _0x4d4954);
  const _0x4a3498 = {
    nameCN: "",
    nameEN: "",
    upperBody: "",
    upperBodyBack: "",
    fullBody: "",
    fullBodyBack: ""
  };
  const _0x5f0d02 = {
    中文名称: "nameCN",
    英文名称: "nameEN",
    上半身: "upperBody",
    上半身背面: "upperBodyBack",
    下半身: "fullBody",
    下半身服装: "fullBody",
    下半身背面: "fullBodyBack"
  };
  for (const _0x399fad of _0x4436f1) {
    const _0x10b0ee = _0x399fad.indexOf(":");
    if (_0x10b0ee === -1) {
      continue;
    }
    const _0x58282e = _0x399fad.substring(0, _0x10b0ee).trim();
    const _0x56287b = _0x399fad.substring(_0x10b0ee + 1).trim();
    if (_0x5f0d02[_0x58282e]) {
      _0x4a3498[_0x5f0d02[_0x58282e]] = _0x56287b;
    } else if (_0x58282e && _0x56287b) {
      console.log("[outfitPromptModify] 未识别的服装字段 \"" + _0x58282e + "\"");
    }
  }
  if (!_0x4a3498.nameCN) {
    return null;
  }
  console.log("[outfitPromptModify] 解析到的服装数据:", _0x4a3498);
  return _0x4a3498;
}
function extractOutfitTags(_0x25ad65) {
  const _0x191264 = {
    outfits: []
  };
  _0x25ad65 = _0x25ad65.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
  const _0x52aad1 = /<服装>([\s\S]*?)<\/服装>/g;
  let _0x45aba0;
  while ((_0x45aba0 = _0x52aad1.exec(_0x25ad65)) !== null) {
    const _0x869145 = preprocessTagContent(_0x45aba0[1]);
    const _0x46d4c4 = parseOutfitData(_0x869145);
    if (_0x46d4c4) {
      _0x191264.outfits.push(_0x46d4c4);
    }
  }
  return _0x191264;
}
function getCurrentOutfitPreset() {
  const _0x239d2f = extension_settings[extensionName];
  const _0xc5ff5a = _0x239d2f.outfitPresetId;
  if (!_0xc5ff5a || !_0x239d2f.outfitPresets[_0xc5ff5a]) {
    return null;
  }
  const _0x2c9bc5 = {
    id: _0xc5ff5a,
    data: _0x239d2f.outfitPresets[_0xc5ff5a]
  };
  return _0x2c9bc5;
}
function buildOutfitText(_0x534629) {
  const _0x3bccc0 = _0x534629.data;
  let _0x1b064e = "<服装>\n";
  _0x1b064e += "中文名称: " + (_0x3bccc0.nameCN || "") + "\n";
  _0x1b064e += "英文名称: " + (_0x3bccc0.nameEN || "") + "\n";
  _0x1b064e += "上半身: " + (_0x3bccc0.upperBody || "") + "\n";
  _0x1b064e += "上半身背面: " + (_0x3bccc0.upperBodyBack || "") + "\n";
  _0x1b064e += "下半身: " + (_0x3bccc0.fullBody || "") + "\n";
  _0x1b064e += "下半身背面: " + (_0x3bccc0.fullBodyBack || "") + "\n";
  _0x1b064e += "</服装>";
  return _0x1b064e;
}
export async function handleOutfitPromptModify(_0x2bd68f, _0x55586e = []) {
  console.log("[outfitPromptModify] Starting outfit prompt modify request...");
  toastr.info("正在处理服装提示词修改请求...");
  try {
    const _0x520c38 = extension_settings[extensionName];
    const _0x5bf24e = getCurrentOutfitPreset();
    if (!_0x5bf24e) {
      toastr.error("请先选择一个服装预设");
      return;
    }
    console.log("[outfitPromptModify] Current preset:", _0x5bf24e.id);
    const _0x227d00 = buildOutfitText(_0x5bf24e);
    const _0x2c01be = [_0x2bd68f || "", _0x227d00].filter(Boolean).join("\n");
    let _0x3b12f5 = buildPromptForRequestType("char_modify", _0x2c01be);
    const _0x19cb1 = new Set();
    const _0xeb5c9a = findMessageIndexWithPlaceholder(_0x3b12f5, "{{用户需求}}");
    console.log("[outfitPromptModify] User requirement message index:", _0xeb5c9a);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{当前服装}}", _0x227d00, _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{服装列表}}", _0x227d00, _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{用户需求}}", _0x2bd68f || "", _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{当前角色}}", "", _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{上下文}}", "", _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{世界书触发}}", "", _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{角色启用列表}}", "", _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{通用服装启用列表}}", "", _0x19cb1);
    _0x3b12f5 = replacePlaceholder(_0x3b12f5, "{{通用角色启用列表}}", "", _0x19cb1);
    console.log("[outfitPromptModify] Final prompt:", _0x3b12f5);
    let _0x4a6f87 = "";
    if (_0x19cb1.size > 0) {
      _0x4a6f87 = "诊断：检测到以下变量被使用：" + [..._0x19cb1].join("、") + "\n";
    }
    if (_0x55586e && _0x55586e.length > 0 && _0xeb5c9a >= 0) {
      _0x3b12f5 = attachImagesToMessage(_0x3b12f5, _0xeb5c9a, _0x55586e, "参考图片");
      console.log("[outfitPromptModify] Attached", _0x55586e.length, "images to message at index", _0xeb5c9a);
    }
    updateCombinedPrompt(_0x3b12f5, _0x4a6f87);
    const _0x4126d9 = await LLM_OUTFIT_MODIFY(_0x3b12f5, {
      timeoutMs: 300000
    });
    console.log("[outfitPromptModify] LLM output:", _0x4126d9);
    if (!_0x4126d9) {
      toastr.error("LLM 返回结果为空");
      return;
    }
    const _0x868d2e = extractOutfitTags(_0x4126d9);
    if (_0x868d2e.outfits.length === 0) {
      toastr.warning("未在 LLM 输出中检测到服装标签");
      console.log("[outfitPromptModify] Raw LLM output for debugging:", _0x4126d9);
      return;
    }
    console.log("[outfitPromptModify] Extracted data:", _0x868d2e);
    const _0x5075e5 = _0x868d2e.outfits[0];
    await updateOutfitPresetFromLLM(_0x5bf24e.id, _0x5075e5);
    toastr.success("服装提示词修改完成！");
  } catch (_0x1007d4) {
    console.error("[outfitPromptModify] Error:", _0x1007d4);
    toastr.error("服装提示词修改失败: " + _0x1007d4.message);
  }
}
async function updateOutfitPresetFromLLM(_0x61161e, _0x1e91cf) {
  const _0x126bc2 = extension_settings[extensionName];
  const _0x1de397 = _0x126bc2.outfitPresets[_0x61161e];
  if (!_0x1de397) {
    toastr.error("找不到指定的服装预设");
    return;
  }
  let _0x489a60 = "准备更新服装 \"" + _0x61161e + "\" 的以下数据:\n\n";
  const _0x202ab7 = {
    nameCN: "中文名称",
    nameEN: "英文名称",
    upperBody: "上半身",
    upperBodyBack: "上半身背面",
    fullBody: "下半身",
    fullBodyBack: "下半身背面"
  };
  let _0x576237 = 0;
  for (const _0x2e3dd9 in _0x202ab7) {
    if (_0x1e91cf[_0x2e3dd9] && _0x1e91cf[_0x2e3dd9] !== _0x1de397[_0x2e3dd9]) {
      const _0xa9f59f = _0x1de397[_0x2e3dd9] || "(空)";
      const _0x1f7ec9 = _0x1e91cf[_0x2e3dd9];
      _0x489a60 += "• " + _0x202ab7[_0x2e3dd9] + ":\n";
      _0x489a60 += "  旧: " + _0xa9f59f.substring(0, 50) + (_0xa9f59f.length > 50 ? "..." : "") + "\n";
      _0x489a60 += "  新: " + _0x1f7ec9.substring(0, 50) + (_0x1f7ec9.length > 50 ? "..." : "") + "\n\n";
      _0x576237++;
    }
  }
  if (_0x576237 === 0) {
    toastr.info("没有检测到需要更新的内容");
    return;
  }
  _0x489a60 += "共 " + _0x576237 + " 项更改,是否应用?";
  const _0x223b3f = await stylishConfirm(_0x489a60);
  if (!_0x223b3f) {
    toastr.info("已取消更新");
    return;
  }
  for (const _0x51ceba in _0x202ab7) {
    if (_0x1e91cf[_0x51ceba]) {
      _0x1de397[_0x51ceba] = _0x1e91cf[_0x51ceba];
    }
  }
  saveSettingsDebounced();
  const _0x36b96e = $("#st-chatu8-tab-character");
  if (_0x36b96e.length) {
    loadOutfitPreset();
  }
  updateOutfitFormFields(_0x1e91cf);
  console.log("[outfitPromptModify] 已更新服装预设 \"" + _0x61161e + "\"");
}
function updateOutfitFormFields(_0xbf667d) {
  const _0x2f73f5 = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  _0x2f73f5.forEach(_0x5622ab => {
    if (_0xbf667d[_0x5622ab]) {
      const _0x47ca51 = document.getElementById("outfit_" + _0x5622ab);
      if (_0x47ca51) {
        _0x47ca51.value = _0xbf667d[_0x5622ab];
        $(_0x47ca51).trigger("input");
      }
    }
  });
}