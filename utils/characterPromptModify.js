import { eventSource } from "../../../../../script.js";
import { eventNames, extensionName } from "./config.js";
import { extension_settings } from "../../../../extensions.js";
import { getContext } from "../../../../st-context.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { generateCharacterListText, generateOutfitEnableListText, generateCommonCharacterListText } from "./settings/worldbook.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { refreshCharacterSettings } from "./settings/character/index.js";
import { stylishConfirm } from "./ui_common.js";
import { mergeAdjacentMessages, replaceAllPlaceholders, replacePlaceholder as _0x1efc76 } from "./promptProcessor.js";
function replacePlaceholder(_0x3e4aff, _0x519c38, _0x312237, _0x4f2ea4) {
  if (typeof _0x3e4aff === "string") {
    if (_0x312237 && _0x3e4aff.includes(_0x519c38)) {
      if (_0x4f2ea4) {
        _0x4f2ea4.add(_0x519c38);
      }
    }
    return _0x3e4aff.replaceAll(_0x519c38, _0x312237);
  }
  if (Array.isArray(_0x3e4aff)) {
    return _0x3e4aff.map(_0x4eef29 => replacePlaceholder(_0x4eef29, _0x519c38, _0x312237, _0x4f2ea4));
  }
  if (_0x3e4aff && typeof _0x3e4aff === "object") {
    const _0x34c0ad = {};
    for (const _0x11b0e3 in _0x3e4aff) {
      _0x34c0ad[_0x11b0e3] = replacePlaceholder(_0x3e4aff[_0x11b0e3], _0x519c38, _0x312237, _0x4f2ea4);
    }
    return _0x34c0ad;
  }
  return _0x3e4aff;
}
function attachImagesToMessage(_0x6d46e2, _0x814773, _0x18b42a, _0x4a8ede = "参考图片") {
  if (!_0x18b42a || _0x18b42a.length === 0 || _0x814773 < 0 || _0x814773 >= _0x6d46e2.length) {
    return _0x6d46e2;
  }
  const _0x4226f2 = [..._0x6d46e2];
  const _0x5d2fdf = _0x4226f2[_0x814773];
  const _0x2fa02c = [];
  if (typeof _0x5d2fdf.content === "string") {
    const _0x24e2a0 = {
      type: "text",
      text: _0x5d2fdf.content
    };
    _0x2fa02c.push(_0x24e2a0);
  } else if (Array.isArray(_0x5d2fdf.content)) {
    _0x2fa02c.push(..._0x5d2fdf.content);
  }
  if (_0x18b42a.length > 0) {
    const _0x4f48ec = {
      type: "text",
      text: "\n[以下是用户上传的" + _0x18b42a.length + "张" + _0x4a8ede + "]"
    };
    _0x2fa02c.push(_0x4f48ec);
  }
  _0x18b42a.forEach((_0x120b2a, _0x47ffb2) => {
    const _0x5b69a1 = typeof _0x120b2a === "string" ? _0x120b2a : _0x120b2a.base64;
    const _0x37ecd6 = typeof _0x120b2a === "object" && _0x120b2a.name ? _0x120b2a.name : "" + _0x4a8ede + (_0x47ffb2 + 1);
    const _0x5a359f = {
      type: "text",
      text: "[" + _0x37ecd6 + "]"
    };
    _0x2fa02c.push(_0x5a359f);
    let _0x1c0bfc = _0x5b69a1;
    if (!_0x5b69a1.startsWith("data:")) {
      _0x1c0bfc = "data:image/png;base64," + _0x5b69a1;
    }
    const _0x1c8514 = {
      url: _0x1c0bfc,
      detail: "auto"
    };
    const _0x47d5c7 = {
      type: "image_url",
      image_url: _0x1c8514
    };
    _0x2fa02c.push(_0x47d5c7);
  });
  const _0xf31155 = {
    ..._0x5d2fdf
  };
  _0xf31155.content = _0x2fa02c;
  _0x4226f2[_0x814773] = _0xf31155;
  return _0x4226f2;
}
function findMessageIndexWithPlaceholder(_0x501e24, _0x3c3171) {
  for (let _0x21cb7c = 0; _0x21cb7c < _0x501e24.length; _0x21cb7c++) {
    const _0xe8a62f = _0x501e24[_0x21cb7c];
    if (typeof _0xe8a62f.content === "string" && _0xe8a62f.content.includes(_0x3c3171)) {
      return _0x21cb7c;
    } else if (Array.isArray(_0xe8a62f.content)) {
      for (const _0x8bd482 of _0xe8a62f.content) {
        if (_0x8bd482.type === "text" && _0x8bd482.text.includes(_0x3c3171)) {
          return _0x21cb7c;
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
export function LLM_CHAR_MODIFY_GET_PROMPT() {
  return new Promise((_0x2c101f, _0x57af16) => {
    const _0x100aac = generateRequestId();
    console.log("[characterPromptModify] Requesting char modify prompt (ID: " + _0x100aac + ")");
    const _0x29c960 = _0x449feb => {
      if (_0x449feb.id !== _0x100aac) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x29c960);
      _0x2c101f(_0x449feb.prompt);
    };
    eventSource.on(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x29c960);
    const _0x5527e4 = {
      id: _0x100aac
    };
    eventSource.emit(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_REQUEST, _0x5527e4);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x29c960);
      _0x57af16(new Error("获取角色修改提示词超时"));
    }, 10000);
  });
}
export function LLM_CHAR_MODIFY(_0x6cd24c, _0x5ed62b = {}) {
  return new Promise((_0x4413e8, _0x56717b) => {
    const _0x5a1265 = generateRequestId();
    const _0x316bcc = _0x5ed62b.timeoutMs || 60000;
    let _0x3b9acf = null;
    console.log("[characterPromptModify] Executing char modify LLM request (ID: " + _0x5a1265 + ")");
    const _0x161453 = () => {
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_RESPONSE, _0x16e168);
      if (_0x3b9acf) {
        clearTimeout(_0x3b9acf);
        _0x3b9acf = null;
      }
    };
    const _0x16e168 = _0x5745f6 => {
      if (_0x5745f6.id !== _0x5a1265) {
        return;
      }
      _0x161453();
      if (_0x5745f6.success) {
        _0x4413e8(_0x5745f6.result);
      } else {
        _0x56717b(new Error(_0x5745f6.result || "LLM 请求失败"));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_MODIFY_RESPONSE, _0x16e168);
    const _0xa5f0fb = {
      prompt: _0x6cd24c,
      id: _0x5a1265
    };
    eventSource.emit(eventNames.LLM_CHAR_MODIFY_REQUEST, _0xa5f0fb);
    _0x3b9acf = setTimeout(() => {
      _0x161453();
      _0x56717b(new Error("角色修改 LLM 请求超时"));
    }, _0x316bcc);
  });
}
function preprocessTagContent(_0x133689) {
  let _0x444a5d = _0x133689.replace(/:/g, ":").replace(/,/g, ",");
  _0x444a5d = _0x444a5d.replace(/下半身NSWebcam:/g, "下半身NSFW背面:");
  _0x444a5d = _0x444a5d.replace(/下半身NSFW_背面:/g, "下半身NSFW背面:");
  _0x444a5d = _0x444a5d.replace(/上半身NSFW_背面:/g, "上半身NSFW背面:");
  return _0x444a5d;
}
function parseCharacterData(_0x5dbbe0) {
  const _0x50efd8 = _0x5dbbe0.split("\n").map(_0x25d571 => _0x25d571.trim()).filter(_0x5a66b7 => _0x5a66b7);
  const _0xd3ea71 = {
    nameCN: "",
    nameEN: "",
    characterTraits: "",
    facialFeatures: "",
    facialFeaturesBack: "",
    upperBodySFW: "",
    upperBodySFWBack: "",
    fullBodySFW: "",
    fullBodySFWBack: "",
    upperBodyNSFW: "",
    upperBodyNSFWBack: "",
    fullBodyNSFW: "",
    fullBodyNSFWBack: ""
  };
  const _0x28f9e5 = {
    中文名称: "nameCN",
    英文名称: "nameEN",
    角色特征: "characterTraits",
    五官外貌: "facialFeatures",
    五官外貌背面: "facialFeaturesBack",
    上半身SFW: "upperBodySFW",
    上半身SFW背面: "upperBodySFWBack",
    下半身SFW: "fullBodySFW",
    下半身SFW背面: "fullBodySFWBack",
    上半身NSFW: "upperBodyNSFW",
    上半身NSFW背面: "upperBodyNSFWBack",
    下半身NSFW: "fullBodyNSFW",
    下半身NSFW背面: "fullBodyNSFWBack"
  };
  for (const _0x4fb1a0 of _0x50efd8) {
    const _0x3e1905 = _0x4fb1a0.indexOf(":");
    if (_0x3e1905 === -1) {
      continue;
    }
    const _0x30327d = _0x4fb1a0.substring(0, _0x3e1905).trim();
    const _0x102675 = _0x4fb1a0.substring(_0x3e1905 + 1).trim();
    if (_0x28f9e5[_0x30327d]) {
      _0xd3ea71[_0x28f9e5[_0x30327d]] = _0x102675;
    } else if (_0x30327d && _0x102675) {
      console.log("[characterPromptModify] 未识别的人物字段 \"" + _0x30327d + "\"");
    }
  }
  if (!_0xd3ea71.nameCN) {
    return null;
  }
  console.log("[characterPromptModify] 解析到的人物数据:", _0xd3ea71);
  return _0xd3ea71;
}
function parseOutfitData(_0x276fd9) {
  const _0x591078 = _0x276fd9.split("\n").map(_0x317465 => _0x317465.trim()).filter(_0x270401 => _0x270401);
  const _0x1dac80 = {
    nameCN: "",
    nameEN: "",
    owner: "",
    upperBody: "",
    upperBodyBack: "",
    fullBody: "",
    fullBodyBack: ""
  };
  const _0x4cab7a = {
    归属人: "owner",
    中文名称: "nameCN",
    英文名称: "nameEN",
    上半身: "upperBody",
    上半身背面: "upperBodyBack",
    下半身: "fullBody",
    下半身背面: "fullBodyBack"
  };
  for (const _0x320453 of _0x591078) {
    const _0xd4eddc = _0x320453.indexOf(":");
    if (_0xd4eddc === -1) {
      continue;
    }
    const _0x18930f = _0x320453.substring(0, _0xd4eddc).trim();
    const _0x2fcbc0 = _0x320453.substring(_0xd4eddc + 1).trim();
    if (_0x4cab7a[_0x18930f]) {
      _0x1dac80[_0x4cab7a[_0x18930f]] = _0x2fcbc0;
    } else if (_0x18930f && _0x2fcbc0) {
      console.log("[characterPromptModify] 未识别的服装字段 \"" + _0x18930f + "\"");
    }
  }
  if (!_0x1dac80.nameCN) {
    return null;
  }
  console.log("[characterPromptModify] 解析到的服装数据:", _0x1dac80);
  return _0x1dac80;
}
function extractCharacterAndOutfitTags(_0x3ee294) {
  const _0x520a7d = [];
  _0x3ee294 = _0x3ee294.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
  const _0x13e1a2 = /<(人物|服装)>([\s\S]*?)<\/\1>/g;
  let _0x57b09e;
  while ((_0x57b09e = _0x13e1a2.exec(_0x3ee294)) !== null) {
    const _0x3c96f1 = _0x57b09e[1];
    const _0x2ab529 = preprocessTagContent(_0x57b09e[2]);
    const _0x14a485 = _0x57b09e.index;
    if (_0x3c96f1 === "人物") {
      const _0x4c740d = parseCharacterData(_0x2ab529);
      if (_0x4c740d) {
        const _0x1ef045 = {
          type: "character",
          data: _0x4c740d,
          position: _0x14a485,
          matchedOutfits: []
        };
        _0x520a7d.push(_0x1ef045);
      }
    } else if (_0x3c96f1 === "服装") {
      const _0x14ffe1 = parseOutfitData(_0x2ab529);
      if (_0x14ffe1) {
        const _0x44d628 = {
          type: "outfit",
          data: _0x14ffe1,
          position: _0x14a485
        };
        _0x520a7d.push(_0x44d628);
      }
    }
  }
  _0x520a7d.sort((_0x306617, _0x1b6679) => _0x306617.position - _0x1b6679.position);
  let _0x18ee33 = null;
  const _0x136ab8 = [];
  const _0x13f79f = [];
  for (const _0x278137 of _0x520a7d) {
    if (_0x278137.type === "character") {
      _0x18ee33 = _0x278137;
      _0x136ab8.push(_0x278137);
    } else if (_0x278137.type === "outfit") {
      if (_0x18ee33) {
        _0x18ee33.matchedOutfits.push(_0x278137.data);
      } else {
        _0x13f79f.push(_0x278137.data);
      }
    }
  }
  return {
    characters: _0x136ab8.map(_0x2ab61e => ({
      ..._0x2ab61e.data,
      matchedOutfits: _0x2ab61e.matchedOutfits
    })),
    outfits: _0x13f79f
  };
}
function getCurrentCharacterPreset() {
  const _0x17859e = extension_settings[extensionName];
  const _0x3bf9ee = _0x17859e.characterPresetId;
  if (!_0x3bf9ee || !_0x17859e.characterPresets[_0x3bf9ee]) {
    return null;
  }
  const _0x200fe7 = {
    id: _0x3bf9ee,
    data: _0x17859e.characterPresets[_0x3bf9ee]
  };
  return _0x200fe7;
}
function buildCharacterText(_0x1fe0c9) {
  const _0x3bef18 = _0x1fe0c9.data;
  let _0xf3d2c2 = "<人物>\n";
  _0xf3d2c2 += "中文名称: " + (_0x3bef18.nameCN || "") + "\n";
  _0xf3d2c2 += "英文名称: " + (_0x3bef18.nameEN || "") + "\n";
  _0xf3d2c2 += "角色特征: " + (_0x3bef18.characterTraits || "") + "\n";
  _0xf3d2c2 += "五官外貌: " + (_0x3bef18.facialFeatures || "") + "\n";
  _0xf3d2c2 += "五官外貌背面: " + (_0x3bef18.facialFeaturesBack || "") + "\n";
  _0xf3d2c2 += "上半身SFW: " + (_0x3bef18.upperBodySFW || "") + "\n";
  _0xf3d2c2 += "上半身SFW背面: " + (_0x3bef18.upperBodySFWBack || "") + "\n";
  _0xf3d2c2 += "下半身SFW: " + (_0x3bef18.fullBodySFW || "") + "\n";
  _0xf3d2c2 += "下半身SFW背面: " + (_0x3bef18.fullBodySFWBack || "") + "\n";
  _0xf3d2c2 += "上半身NSFW: " + (_0x3bef18.upperBodyNSFW || "") + "\n";
  _0xf3d2c2 += "上半身NSFW背面: " + (_0x3bef18.upperBodyNSFWBack || "") + "\n";
  _0xf3d2c2 += "下半身NSFW: " + (_0x3bef18.fullBodyNSFW || "") + "\n";
  _0xf3d2c2 += "下半身NSFW背面: " + (_0x3bef18.fullBodyNSFWBack || "") + "\n";
  _0xf3d2c2 += "</人物>";
  return _0xf3d2c2;
}
export async function handleCharacterPromptModify(_0x1a1025, _0x385ea2 = []) {
  console.log("[characterPromptModify] Starting character prompt modify request...");
  toastr.info("[characterPromptModify] 正在处理角色提示词修改请求...");
  try {
    const _0x577bda = getContext();
    const _0x3aa625 = extension_settings[extensionName];
    const _0x256c7b = getCurrentCharacterPreset();
    if (!_0x256c7b) {
      toastr.error("请先选择一个角色预设");
      return;
    }
    console.log("[characterPromptModify] Current preset:", _0x256c7b.id);
    const _0x5326a8 = _0x256c7b.data.generationContext || "";
    const _0x4a1eae = _0x256c7b.data.generationWorldBook || "";
    const _0x502ab0 = _0x256c7b.data.generationVariables || {};
    console.log("[characterPromptModify] Saved context:", _0x5326a8);
    console.log("[characterPromptModify] Saved world book:", _0x4a1eae);
    console.log("[characterPromptModify] Saved variables:", _0x502ab0);
    const _0x2d4b47 = _0x1a1025 || "";
    const _0x50f5dd = [];
    if (_0x1a1025) {
      _0x50f5dd.push(_0x1a1025);
    }
    if (_0x5326a8) {
      _0x50f5dd.push(_0x5326a8);
    }
    if (_0x4a1eae) {
      _0x50f5dd.push(_0x4a1eae);
    }
    const _0x181cb2 = _0x50f5dd.join("\n");
    console.log("[characterPromptModify] Character trigger text:", _0x181cb2);
    let _0x134dd8 = buildPromptForRequestType("char_modify", _0x2d4b47);
    const _0x30d3b5 = generateCharacterListText(_0x181cb2);
    const _0xd98652 = generateOutfitEnableListText();
    const _0x29463c = generateCommonCharacterListText();
    console.log("[characterPromptModify] Character list text (triggered):", _0x30d3b5);
    const _0x301f9e = _0x577bda.chatMetadata?.variables || {};
    const _0x1bf63d = buildCharacterText(_0x256c7b);
    _0x134dd8 = mergeAdjacentMessages(_0x134dd8);
    console.log("[characterPromptModify] 合并相邻消息后:", _0x134dd8);
    const _0x24d34b = findMessageIndexWithPlaceholder(_0x134dd8, "{{用户需求}}");
    console.log("[characterPromptModify] User requirement message index:", _0x24d34b);
    const _0x56391d = {
      ..._0x502ab0,
      ..._0x301f9e
    };
    const _0x1c3790 = {
      context: _0x5326a8,
      worldBookContent: _0x4a1eae,
      variables: _0x56391d,
      userDemand: _0x1a1025 || "",
      characterListText: _0x30d3b5,
      outfitEnableListText: _0xd98652,
      commonCharacterListText: _0x29463c
    };
    const _0x3af982 = _0x1c3790;
    const {
      messages: _0x46358b,
      replacedVariables: _0x1e136d
    } = replaceAllPlaceholders(_0x134dd8, _0x3af982);
    _0x134dd8 = _0x46358b;
    _0x134dd8 = _0x1efc76(_0x134dd8, "{{当前角色}}", _0x1bf63d, _0x1e136d);
    console.log("[characterPromptModify] Final prompt:", _0x134dd8);
    let _0x29c9f1 = "";
    if (_0x1e136d.size > 0) {
      _0x29c9f1 = "诊断：检测到以下变量被使用：" + [..._0x1e136d].join("、") + "\n";
    }
    if (_0x385ea2 && _0x385ea2.length > 0 && _0x24d34b >= 0) {
      _0x134dd8 = attachImagesToMessage(_0x134dd8, _0x24d34b, _0x385ea2, "参考图片");
      console.log("[characterPromptModify] Attached", _0x385ea2.length, "images to message at index", _0x24d34b);
    }
    updateCombinedPrompt(_0x134dd8, _0x29c9f1);
    const _0x24e17e = await LLM_CHAR_MODIFY(_0x134dd8, {
      timeoutMs: 300000
    });
    console.log("[characterPromptModify] LLM output:", _0x24e17e);
    if (!_0x24e17e) {
      toastr.error("LLM 返回结果为空");
      return;
    }
    const _0x25b670 = extractCharacterAndOutfitTags(_0x24e17e);
    if (_0x25b670.characters.length === 0 && _0x25b670.outfits.length === 0) {
      toastr.warning("未在 LLM 输出中检测到角色或服装标签");
      console.log("[characterPromptModify] No character/outfit tags found in output");
      console.log("[characterPromptModify] Raw LLM output for debugging:", _0x24e17e);
      return;
    }
    console.log("[characterPromptModify] Extracted data:", _0x25b670);
    if (_0x25b670.characters.length > 0) {
      const _0x3ad5a1 = _0x25b670.characters[0];
      await updateCharacterPresetFromLLM(_0x256c7b.id, _0x3ad5a1);
    }
    const _0xf30962 = [..._0x25b670.outfits];
    for (const _0x2641fe of _0x25b670.characters) {
      if (_0x2641fe.matchedOutfits && _0x2641fe.matchedOutfits.length > 0) {
        _0xf30962.push(..._0x2641fe.matchedOutfits);
      }
    }
    if (_0xf30962.length > 0) {
      await updateOutfitPresetsFromLLM(_0xf30962);
    }
    toastr.success("角色/服装提示词修改完成！");
  } catch (_0x54307e) {
    console.error("[characterPromptModify] Error:", _0x54307e);
    toastr.error("角色提示词修改失败: " + _0x54307e.message);
  }
}
async function updateCharacterPresetFromLLM(_0x3a99cf, _0x519532) {
  const _0x4211f0 = extension_settings[extensionName];
  const _0x1e679f = _0x4211f0.characterPresets[_0x3a99cf];
  if (!_0x1e679f) {
    toastr.error("找不到指定的角色预设");
    return;
  }
  const _0x4698d2 = {
    nameCN: "中文名称",
    nameEN: "英文名称",
    characterTraits: "角色特征",
    facialFeatures: "五官外貌",
    facialFeaturesBack: "五官外貌背面",
    upperBodySFW: "上半身SFW",
    upperBodySFWBack: "上半身SFW背面",
    fullBodySFW: "下半身SFW",
    fullBodySFWBack: "下半身SFW背面",
    upperBodyNSFW: "上半身NSFW",
    upperBodyNSFWBack: "上半身NSFW背面",
    fullBodyNSFW: "下半身NSFW",
    fullBodyNSFWBack: "下半身NSFW背面"
  };
  let _0x11243a = 0;
  for (const _0x34bfbf in _0x4698d2) {
    if (_0x519532[_0x34bfbf] && _0x519532[_0x34bfbf] !== _0x1e679f[_0x34bfbf]) {
      _0x11243a++;
    }
  }
  if (_0x11243a === 0) {
    toastr.info("没有检测到需要更新的内容");
    return;
  }
  const _0x9094b4 = "检测到角色 \"" + _0x3a99cf + "\" 有 " + _0x11243a + " 项更改,是否应用?";
  const _0x14f35c = await stylishConfirm(_0x9094b4);
  if (!_0x14f35c) {
    toastr.info("已取消更新");
    return;
  }
  for (const _0x381c52 in _0x4698d2) {
    if (_0x519532[_0x381c52]) {
      _0x1e679f[_0x381c52] = _0x519532[_0x381c52];
    }
  }
  saveSettingsDebounced();
  const _0xe086a5 = $("#st-chatu8-tab-character");
  if (_0xe086a5.length) {
    refreshCharacterSettings(_0xe086a5);
  }
  updateFormFields(_0x519532);
  console.log("[characterPromptModify] 已更新角色预设 \"" + _0x3a99cf + "\"");
}
async function updateOutfitPresetsFromLLM(_0x2099a0) {
  const _0xaa6bab = extension_settings[extensionName];
  const _0xccba7c = {
    nameCN: "中文名称",
    nameEN: "英文名称",
    owner: "归属人",
    upperBody: "上半身",
    upperBodyBack: "上半身背面",
    fullBody: "下半身",
    fullBodyBack: "下半身背面"
  };
  for (const _0x35f716 of _0x2099a0) {
    const _0x870621 = _0x35f716.nameCN;
    if (!_0x870621) {
      continue;
    }
    const _0x4ae86c = _0xaa6bab.outfitPresets?.[_0x870621];
    if (_0x4ae86c) {
      let _0x523681 = 0;
      for (const _0x17f8f2 in _0xccba7c) {
        if (_0x35f716[_0x17f8f2] && _0x35f716[_0x17f8f2] !== _0x4ae86c[_0x17f8f2]) {
          _0x523681++;
        }
      }
      if (_0x523681 === 0) {
        console.log("[characterPromptModify] 服装 \"" + _0x870621 + "\" 没有变更");
        continue;
      }
      const _0x337872 = "检测到服装 \"" + _0x870621 + "\" 有 " + _0x523681 + " 项更改,是否应用?";
      const _0x2028bf = await stylishConfirm(_0x337872);
      if (!_0x2028bf) {
        continue;
      }
      for (const _0x46da9e in _0xccba7c) {
        if (_0x35f716[_0x46da9e]) {
          _0x4ae86c[_0x46da9e] = _0x35f716[_0x46da9e];
        }
      }
      console.log("[characterPromptModify] 已更新服装预设 \"" + _0x870621 + "\"");
    } else {
      const _0x36627d = "检测到新服装 \"" + _0x870621 + "\",是否录入?";
      const _0x13e922 = await stylishConfirm(_0x36627d);
      if (!_0x13e922) {
        continue;
      }
      if (!_0xaa6bab.outfitPresets) {
        _0xaa6bab.outfitPresets = {};
      }
      const _0x2403ee = {
        nameCN: _0x35f716.nameCN,
        nameEN: _0x35f716.nameEN || "",
        owner: _0x35f716.owner || "",
        upperBody: _0x35f716.upperBody || "",
        upperBodyBack: _0x35f716.upperBodyBack || "",
        fullBody: _0x35f716.fullBody || "",
        fullBodyBack: _0x35f716.fullBodyBack || ""
      };
      _0xaa6bab.outfitPresets[_0x870621] = _0x2403ee;
      console.log("[characterPromptModify] 已创建服装预设 \"" + _0x870621 + "\"");
      if (_0x35f716.owner && _0x35f716.owner.trim()) {
        const _0x13a00a = _0x35f716.owner.trim().toLowerCase().replace(/\s+/g, "");
        for (const [_0x58423d, _0x103d2b] of Object.entries(_0xaa6bab.characterPresets || {})) {
          if (_0x103d2b.nameEN && _0x103d2b.nameEN.toLowerCase().replace(/\s+/g, "") === _0x13a00a) {
            if (!_0x103d2b.outfits) {
              _0x103d2b.outfits = [];
            }
            if (!_0x103d2b.outfits.includes(_0x870621)) {
              _0x103d2b.outfits.push(_0x870621);
              console.log("[characterPromptModify] 服装 \"" + _0x870621 + "\" 已归属到角色 \"" + _0x58423d + "\"");
            }
            break;
          }
        }
      }
    }
  }
  saveSettingsDebounced();
  const _0x54b311 = $("#st-chatu8-tab-character");
  if (_0x54b311.length) {
    refreshCharacterSettings(_0x54b311);
  }
}
function updateFormFields(_0x3ba457) {
  const _0x4ae3fc = ["nameCN", "nameEN", "characterTraits", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack"];
  _0x4ae3fc.forEach(_0x4d5ee8 => {
    if (_0x3ba457[_0x4d5ee8]) {
      const _0x52ce3c = document.getElementById("char_" + _0x4d5ee8);
      if (_0x52ce3c) {
        _0x52ce3c.value = _0x3ba457[_0x4d5ee8];
        $(_0x52ce3c).trigger("input");
      }
    }
  });
}