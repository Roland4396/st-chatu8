import { saveSettingsDebounced, eventSource, event_types, saveChatConditional, chat, messageFormatting } from "../../../../../script.js";
import { EventType, extensionName } from "./config.js";
import { generateUniqueId, addLog, addSmoothShakeEffect } from "./utils.js";
import { extension_settings } from "../../../../extensions.js";
import { checkSendBuClass } from "./utils.js";
import { getContext } from "../../../../st-context.js";
import { stylishConfirm } from "./ui_common.js";
import { refreshCharacterSettings } from "./settings/character/index.js";
export function initializeNewlineFixer() {
  eventSource.on(event_types.MESSAGE_RECEIVED, async function (_0xd66009) {
    if (String(extension_settings[extensionName].newlineFixEnabled) !== "true") {
      return;
    }
    if (!chat[_0xd66009] || typeof chat[_0xd66009].mes !== "string") {
      return;
    }
    const _0x2fe8e8 = chat[_0xd66009].mes;
    const _0x5df044 = _0x2fe8e8.replaceAll("\n###", "###");
    if (_0x2fe8e8 !== _0x5df044) {
      console.log("ChatU8: Fixed newlines for message ID: " + _0xd66009);
      chat[_0xd66009].mes = _0x5df044;
      await saveChatConditional();
      render(_0xd66009);
    }
  });
  eventSource.on(event_types.MESSAGE_RECEIVED, async function (_0x49c2a0) {
    console.log("ChatU8: Extracting character and outfit tags for message ID: " + _0x49c2a0);
    if (!chat[_0x49c2a0] || typeof chat[_0x49c2a0].mes !== "string") {
      return;
    }
    const _0x429f52 = chat[_0x49c2a0].mes;
    const _0x459ab9 = extractCharacterAndOutfitTags(_0x429f52);
    if (_0x459ab9.characters.length === 0 && _0x459ab9.outfits.length === 0) {
      return;
    }
    await handleExtractedData(_0x459ab9);
  });
  eventSource.on(event_types.MESSAGE_EDITED, async function (_0x29f2ff) {
    console.log("ChatU8: Extracting character and outfit tags for message ID: " + _0x29f2ff);
    if (!chat[_0x29f2ff] || typeof chat[_0x29f2ff].mes !== "string") {
      return;
    }
    const _0xd24cf2 = chat[_0x29f2ff].mes;
    const _0x2f4959 = extractCharacterAndOutfitTags(_0xd24cf2);
    if (_0x2f4959.characters.length === 0 && _0x2f4959.outfits.length === 0) {
      return;
    }
    await handleExtractedData(_0x2f4959);
  });
}
function highlight_code(_0x4fae2b) {
  const _0x2d8738 = $(_0x4fae2b);
  if (_0x2d8738.hasClass("hljs") || _0x2d8738.text().includes("<body")) {
    return;
  }
  hljs.highlightElement(_0x4fae2b);
  _0x2d8738.append($("<i class=\"fa-solid fa-copy code-copy interactable\" title=\"Copy code\"></i>").on("click", function (_0x28de0f) {
    _0x28de0f.stopPropagation();
  }).on("pointerup", async function () {
    navigator.clipboard.writeText($(_0x4fae2b).text());
    toastr.info("已复制!", "", {
      timeOut: 2000
    });
  }));
}
const render = async _0xf0a5f4 => {
  console.log("rendering message:", _0xf0a5f4);
  const _0x1a1ab6 = document.querySelector("div.mes[mesid=\"" + _0xf0a5f4 + "\"]");
  if (!_0x1a1ab6) {
    return;
  }
  const _0x229bb9 = chat[_0xf0a5f4];
  if (_0x229bb9.swipes) {
    const _0x171a0d = _0x1a1ab6.querySelector(".swipes-counter");
    if (_0x171a0d) {
      _0x171a0d.textContent = _0x229bb9.swipe_id + 1 + "​/​" + _0x229bb9.swipes.length;
    }
  }
  const _0xf35525 = _0x1a1ab6.querySelector(".mes_text");
  if (_0xf35525) {
    _0xf35525.innerHTML = messageFormatting(_0x229bb9.mes, _0x229bb9.name, _0x229bb9.is_system, _0x229bb9.is_user, _0xf0a5f4);
  }
  _0x1a1ab6.querySelectorAll("pre code").forEach(_0x3bd57f => {
    highlight_code(_0x3bd57f);
  });
  await eventSource.emit(_0x229bb9.is_user ? event_types.USER_MESSAGE_RENDERED : event_types.CHARACTER_MESSAGE_RENDERED, _0xf0a5f4);
};
export function extractCharacterAndOutfitTags(_0x13eec0) {
  const _0x16eb81 = [];
  const _0x437225 = /<(人物|服装)>([\s\S]*?)<\/\1>/g;
  let _0x21a49c;
  while ((_0x21a49c = _0x437225.exec(_0x13eec0)) !== null) {
    const _0x15e979 = _0x21a49c[1];
    const _0x3def92 = preprocessTagContent(_0x21a49c[2]);
    const _0x55579d = _0x21a49c.index;
    if (_0x15e979 === "人物") {
      const _0x3f58ef = parseCharacterData(_0x3def92);
      if (_0x3f58ef) {
        const _0x4a75cb = {
          type: "character",
          data: _0x3f58ef,
          position: _0x55579d,
          matchedOutfits: []
        };
        _0x16eb81.push(_0x4a75cb);
      }
    } else if (_0x15e979 === "服装") {
      const _0x246bc3 = parseOutfitData(_0x3def92);
      if (_0x246bc3) {
        const _0x84d6da = {
          type: "outfit",
          data: _0x246bc3,
          position: _0x55579d
        };
        _0x16eb81.push(_0x84d6da);
      }
    }
  }
  _0x16eb81.sort((_0x7cef21, _0x2cc793) => _0x7cef21.position - _0x2cc793.position);
  let _0xa7077d = null;
  const _0x4d46b1 = [];
  const _0x3a9573 = [];
  for (const _0x3813de of _0x16eb81) {
    if (_0x3813de.type === "character") {
      _0xa7077d = _0x3813de;
      _0x4d46b1.push(_0x3813de);
    } else if (_0x3813de.type === "outfit") {
      if (_0xa7077d) {
        _0xa7077d.matchedOutfits.push(_0x3813de.data);
      } else {
        _0x3a9573.push(_0x3813de.data);
      }
    }
  }
  return {
    characters: _0x4d46b1.map(_0x17ed45 => ({
      ..._0x17ed45.data,
      matchedOutfits: _0x17ed45.matchedOutfits
    })),
    outfits: _0x3a9573
  };
}
function preprocessTagContent(_0x2de218) {
  let _0x36def2 = _0x2de218.replace(/:/g, ":").replace(/,/g, ",");
  _0x36def2 = _0x36def2.replace(/下半身NSWebcam:/g, "下半身NSFW背面:");
  _0x36def2 = _0x36def2.replace(/下半身NSFW_背面:/g, "下半身NSFW背面:");
  _0x36def2 = _0x36def2.replace(/上半身NSFW_背面:/g, "上半身NSFW背面:");
  return _0x36def2;
}
function parseCharacterData(_0x16ad3a) {
  const _0x49f31c = _0x16ad3a.split("\n").map(_0x35e59d => _0x35e59d.trim()).filter(_0x565ba0 => _0x565ba0);
  const _0x4ebea1 = {
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
  const _0x829c9d = {
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
  for (const _0x55d27a of _0x49f31c) {
    const _0x1d3eaf = _0x55d27a.indexOf(":");
    if (_0x1d3eaf === -1) {
      continue;
    }
    const _0x2dac08 = _0x55d27a.substring(0, _0x1d3eaf).trim();
    const _0x444832 = _0x55d27a.substring(_0x1d3eaf + 1).trim();
    if (_0x829c9d[_0x2dac08]) {
      _0x4ebea1[_0x829c9d[_0x2dac08]] = _0x444832;
    } else if (_0x2dac08 && _0x444832) {
      console.log("ChatU8: 未识别的人物字段 \"" + _0x2dac08 + "\"");
    }
  }
  if (!_0x4ebea1.nameCN) {
    return null;
  }
  console.log("ChatU8: 解析到的人物数据:", _0x4ebea1);
  return _0x4ebea1;
}
function parseOutfitData(_0x3d5fbc) {
  const _0x3946d2 = _0x3d5fbc.split("\n").map(_0x28547e => _0x28547e.trim()).filter(_0x278295 => _0x278295);
  const _0x3cc69b = {
    nameCN: "",
    nameEN: "",
    owner: "",
    upperBody: "",
    upperBodyBack: "",
    fullBody: "",
    fullBodyBack: ""
  };
  const _0x258d94 = {
    归属人: "owner",
    中文名称: "nameCN",
    英文名称: "nameEN",
    上半身: "upperBody",
    上半身背面: "upperBodyBack",
    下半身: "fullBody",
    下半身背面: "fullBodyBack"
  };
  for (const _0x46f2af of _0x3946d2) {
    const _0x5b5360 = _0x46f2af.indexOf(":");
    if (_0x5b5360 === -1) {
      continue;
    }
    const _0x12e362 = _0x46f2af.substring(0, _0x5b5360).trim();
    const _0x57de6a = _0x46f2af.substring(_0x5b5360 + 1).trim();
    if (_0x258d94[_0x12e362]) {
      _0x3cc69b[_0x258d94[_0x12e362]] = _0x57de6a;
    } else if (_0x12e362 && _0x57de6a) {
      console.log("ChatU8: 未识别的服装字段 \"" + _0x12e362 + "\"");
    }
  }
  if (!_0x3cc69b.nameCN) {
    return null;
  }
  console.log("ChatU8: 解析到的服装数据:", _0x3cc69b);
  return _0x3cc69b;
}
export async function handleExtractedData(_0x567edd, _0x8af99 = {}) {
  const {
    characters: _0x583656,
    outfits: _0xaca320
  } = _0x567edd;
  const {
    generationContext = "",
    generationWorldBook = "",
    generationVariables = {}
  } = _0x8af99;
  let _0x1676b8 = "检测到以下内容:\n\n";
  if (_0x583656.length > 0) {
    _0x1676b8 += "人物 (" + _0x583656.length + "个):\n";
    _0x583656.forEach(_0x5b1e85 => {
      _0x1676b8 += "  • " + _0x5b1e85.nameCN + " (" + (_0x5b1e85.nameEN || "无英文名") + ")\n";
    });
    _0x1676b8 += "\n";
  }
  if (_0xaca320.length > 0) {
    _0x1676b8 += "服装 (" + _0xaca320.length + "套):\n";
    _0xaca320.forEach(_0x1fb930 => {
      _0x1676b8 += "  • " + _0x1fb930.nameCN + " (" + (_0x1fb930.nameEN || "无英文名") + ")\n";
    });
    _0x1676b8 += "\n";
  }
  _0x1676b8 += "是否录入这些数据?";
  const _0x2a70ee = await stylishConfirm(_0x1676b8);
  if (!_0x2a70ee) {
    return;
  }
  const _0x411af5 = extension_settings[extensionName];
  const _0x538518 = [];
  const _0x3deb6b = [];
  const _0x1248f3 = {};
  for (const _0x1ffe04 of _0xaca320) {
    const _0x5bf6b2 = _0x1ffe04.nameCN;
    if (_0x411af5.outfitPresets[_0x5bf6b2]) {
      const _0x125774 = await stylishConfirm("服装 \"" + _0x5bf6b2 + "\" 已存在,是否覆盖?");
      if (!_0x125774) {
        continue;
      }
    }
    const _0x10a9c4 = {
      nameCN: _0x1ffe04.nameCN,
      nameEN: _0x1ffe04.nameEN,
      owner: _0x1ffe04.owner || "",
      upperBody: _0x1ffe04.upperBody,
      upperBodyBack: _0x1ffe04.upperBodyBack,
      fullBody: _0x1ffe04.fullBody,
      fullBodyBack: _0x1ffe04.fullBodyBack
    };
    _0x411af5.outfitPresets[_0x5bf6b2] = _0x10a9c4;
    console.log("ChatU8: 已保存服装预设 \"" + _0x5bf6b2 + "\":", _0x411af5.outfitPresets[_0x5bf6b2]);
    _0x3deb6b.push(_0x5bf6b2);
    if (_0x1ffe04.owner && _0x1ffe04.owner.trim()) {
      _0x1248f3[_0x5bf6b2] = _0x1ffe04.owner.trim();
    }
  }
  for (const _0x19ec7a of _0x583656) {
    const _0x163d24 = _0x19ec7a.nameCN;
    if (_0x411af5.characterPresets[_0x163d24]) {
      const _0x40c852 = await stylishConfirm("角色 \"" + _0x163d24 + "\" 已存在,是否覆盖?");
      if (!_0x40c852) {
        continue;
      }
    }
    const _0x2dbbb3 = [];
    if (_0x19ec7a.matchedOutfits && _0x19ec7a.matchedOutfits.length > 0) {
      for (const _0x82a77d of _0x19ec7a.matchedOutfits) {
        const _0x58d0f6 = _0x82a77d.nameCN;
        if (_0x411af5.outfitPresets[_0x58d0f6]) {
          const _0x132169 = await stylishConfirm("服装 \"" + _0x58d0f6 + "\" 已存在,是否覆盖?");
          if (!_0x132169) {
            continue;
          }
        }
        const _0x877fab = {
          nameCN: _0x82a77d.nameCN,
          nameEN: _0x82a77d.nameEN,
          owner: _0x82a77d.owner || "",
          upperBody: _0x82a77d.upperBody,
          upperBodyBack: _0x82a77d.upperBodyBack,
          fullBody: _0x82a77d.fullBody,
          fullBodyBack: _0x82a77d.fullBodyBack
        };
        _0x411af5.outfitPresets[_0x58d0f6] = _0x877fab;
        console.log("ChatU8: 已保存服装预设 \"" + _0x58d0f6 + "\" (关联到 " + _0x163d24 + "):", _0x411af5.outfitPresets[_0x58d0f6]);
        _0x3deb6b.push(_0x58d0f6);
        if (_0x82a77d.owner && _0x82a77d.owner.trim()) {
          _0x1248f3[_0x58d0f6] = _0x82a77d.owner.trim();
        } else {
          _0x2dbbb3.push(_0x58d0f6);
        }
      }
    }
    const _0x14102c = {
      nameCN: _0x19ec7a.nameCN,
      nameEN: _0x19ec7a.nameEN,
      characterTraits: _0x19ec7a.characterTraits,
      facialFeatures: _0x19ec7a.facialFeatures,
      facialFeaturesBack: _0x19ec7a.facialFeaturesBack,
      upperBodySFW: _0x19ec7a.upperBodySFW,
      upperBodySFWBack: _0x19ec7a.upperBodySFWBack,
      fullBodySFW: _0x19ec7a.fullBodySFW,
      fullBodySFWBack: _0x19ec7a.fullBodySFWBack,
      upperBodyNSFW: _0x19ec7a.upperBodyNSFW,
      upperBodyNSFWBack: _0x19ec7a.upperBodyNSFWBack,
      fullBodyNSFW: _0x19ec7a.fullBodyNSFW,
      fullBodyNSFWBack: _0x19ec7a.fullBodyNSFWBack,
      outfits: _0x2dbbb3,
      generationContext: generationContext,
      generationWorldBook: generationWorldBook,
      generationVariables: generationVariables
    };
    _0x411af5.characterPresets[_0x163d24] = _0x14102c;
    console.log("ChatU8: 已保存角色预设 \"" + _0x163d24 + "\" (关联服装: " + _0x2dbbb3.join(", ") + "):", _0x411af5.characterPresets[_0x163d24]);
    _0x538518.push(_0x163d24);
  }
  const _0x4aaaf4 = _0x338954 => {
    if (!_0x338954) {
      return "";
    }
    return _0x338954.toLowerCase().replace(/\s+/g, "");
  };
  for (const [_0x23a6ff, _0x37d98c] of Object.entries(_0x1248f3)) {
    let _0x193bb3 = null;
    const _0x2a9577 = _0x4aaaf4(_0x37d98c);
    for (const _0x3eb19d of _0x583656) {
      if (_0x3eb19d.nameEN && _0x4aaaf4(_0x3eb19d.nameEN) === _0x2a9577) {
        _0x193bb3 = _0x3eb19d.nameCN;
        break;
      }
    }
    if (!_0x193bb3) {
      for (const [_0x2b8c05, _0x527db5] of Object.entries(_0x411af5.characterPresets)) {
        if (_0x527db5.nameEN && _0x4aaaf4(_0x527db5.nameEN) === _0x2a9577) {
          _0x193bb3 = _0x2b8c05;
          break;
        }
      }
    }
    if (_0x193bb3) {
      const _0x2dabad = _0x411af5.characterPresets[_0x193bb3];
      if (_0x2dabad) {
        if (!_0x2dabad.outfits) {
          _0x2dabad.outfits = [];
        }
        if (!_0x2dabad.outfits.includes(_0x23a6ff)) {
          _0x2dabad.outfits.push(_0x23a6ff);
          console.log("ChatU8: 服装 \"" + _0x23a6ff + "\" 已归属到角色 \"" + _0x193bb3 + "\" (via owner: " + _0x37d98c + ")");
        }
      }
    } else {
      console.warn("ChatU8: 无法找到归属人 \"" + _0x37d98c + "\" 对应的角色,服装 \"" + _0x23a6ff + "\" 未归属");
    }
  }
  const _0x4e7a02 = $("#st-chatu8-tab-character");
  if (_0x4e7a02.length) {
    refreshCharacterSettings(_0x4e7a02);
  }
  if (_0x3deb6b.length > 0) {
    saveSettingsDebounced();
  }
  if (_0x538518.length > 0) {
    const _0x1fa55f = await stylishConfirm("是否在当前角色启用列表中启用这 " + _0x538518.length + " 个角色?");
    if (_0x1fa55f) {
      const _0x189545 = _0x411af5.characterEnablePresetId;
      if (_0x189545 && _0x411af5.characterEnablePresets[_0x189545]) {
        const _0x2f3772 = _0x411af5.characterEnablePresets[_0x189545];
        _0x2f3772.characters = [...new Set([..._0x2f3772.characters, ..._0x538518])];
        saveSettingsDebounced();
      }
    }
  }
  let _0x4fa0e5 = "录入完成!\n\n";
  if (_0x538518.length > 0) {
    _0x4fa0e5 += "✓ 已创建 " + _0x538518.length + " 个角色预设\n";
  }
  if (_0x3deb6b.length > 0) {
    _0x4fa0e5 += "✓ 已创建 " + _0x3deb6b.length + " 个服装预设\n";
  }
  toastr.success(_0x4fa0e5, "数据录入成功", {
    timeOut: 3000
  });
}