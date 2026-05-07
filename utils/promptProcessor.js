import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { getContext } from "../../../../st-context.js";
import { getglobalvar, setglobalvar } from "./chatDataUtils.js";
import { getworldvar } from "./worldbookProcessor.js";
export function checkTriggerWords(_0x2087a0, _0x586c14) {
  if (!_0x2087a0 || !_0x586c14) {
    return false;
  }
  const _0x5761bf = _0x2087a0.split(",").map(_0x123612 => _0x123612.trim()).filter(_0x5cba8d => _0x5cba8d);
  if (_0x5761bf.length === 0) {
    return false;
  }
  for (const _0x36e67a of _0x5761bf) {
    if (_0x586c14.includes(_0x36e67a)) {
      return true;
    }
  }
  return false;
}
export function mergeAdjacentMessages(_0x32e3e8) {
  if (!_0x32e3e8 || _0x32e3e8.length === 0) {
    return [];
  }
  const _0x7512fa = [];
  let _0x5b2920 = null;
  for (const _0x2e768a of _0x32e3e8) {
    if (!_0x5b2920) {
      const _0xbfdc9a = {
        ..._0x2e768a
      };
      _0x5b2920 = _0xbfdc9a;
    } else if (_0x5b2920.role === _0x2e768a.role) {
      _0x5b2920.content = mergeContent(_0x5b2920.content, _0x2e768a.content);
    } else {
      _0x7512fa.push(_0x5b2920);
      const _0x3267ff = {
        ..._0x2e768a
      };
      _0x5b2920 = _0x3267ff;
    }
  }
  if (_0x5b2920) {
    _0x7512fa.push(_0x5b2920);
  }
  return _0x7512fa;
}
function mergeContent(_0xf597fb, _0x41eb65) {
  if (typeof _0xf597fb === "string" && typeof _0x41eb65 === "string") {
    return _0xf597fb + "\n" + _0x41eb65;
  }
  const _0x1d50b7 = normalizeToArray(_0xf597fb);
  const _0xf56ae0 = normalizeToArray(_0x41eb65);
  return [..._0x1d50b7, {
    type: "text",
    text: "\n"
  }, ..._0xf56ae0];
}
function normalizeToArray(_0x118dc6) {
  if (Array.isArray(_0x118dc6)) {
    return _0x118dc6;
  }
  return [{
    type: "text",
    text: _0x118dc6 || ""
  }];
}
export function replacePlaceholder(_0x4bbc31, _0x35f4f2, _0x89184f, _0x2df0b1) {
  if (typeof _0x4bbc31 === "string") {
    if (_0x89184f && _0x4bbc31.includes(_0x35f4f2)) {
      if (_0x2df0b1) {
        _0x2df0b1.add(_0x35f4f2);
      }
    }
    return _0x4bbc31.replaceAll(_0x35f4f2, _0x89184f || "");
  }
  if (Array.isArray(_0x4bbc31)) {
    return _0x4bbc31.map(_0x960320 => replacePlaceholder(_0x960320, _0x35f4f2, _0x89184f, _0x2df0b1));
  }
  if (_0x4bbc31 && typeof _0x4bbc31 === "object") {
    const _0x2de90e = {};
    for (const _0x4ae0ca in _0x4bbc31) {
      _0x2de90e[_0x4ae0ca] = replacePlaceholder(_0x4bbc31[_0x4ae0ca], _0x35f4f2, _0x89184f, _0x2df0b1);
    }
    return _0x2de90e;
  }
  return _0x4bbc31;
}
export function replaceAllPlaceholders(_0x1fe152, _0x1144d7) {
  const {
    context = "",
    body = "",
    worldBookContent = "",
    variables = {},
    userDemand = "",
    characterListText = "",
    outfitEnableListText = "",
    commonCharacterListText = ""
  } = _0x1144d7;
  const _0x2013fe = new Set();
  let _0x502297 = _0x1fe152;
  const _0x78f6cb = getContext();
  const _0x111972 = _0x78f6cb?.name1 || "";
  let _0x41f7df = worldBookContent;
  if (_0x41f7df) {
    _0x41f7df = _0x41f7df.replaceAll("{{user}}", _0x111972);
    _0x41f7df = _0x41f7df.replaceAll("<user>", _0x111972);
  }
  _0x502297 = replacePlaceholder(_0x502297, "{{上下文}}", context, _0x2013fe);
  _0x502297 = replacePlaceholder(_0x502297, "{{世界书触发}}", _0x41f7df, _0x2013fe);
  _0x502297 = replacePlaceholder(_0x502297, "{{正文}}", body, _0x2013fe);
  _0x502297 = replacePlaceholder(_0x502297, "{{角色启用列表}}", characterListText, _0x2013fe);
  _0x502297 = replacePlaceholder(_0x502297, "{{通用服装启用列表}}", outfitEnableListText, _0x2013fe);
  _0x502297 = replacePlaceholder(_0x502297, "{{通用角色启用列表}}", commonCharacterListText, _0x2013fe);
  _0x502297 = replacePlaceholder(_0x502297, "{{用户需求}}", userDemand, _0x2013fe);
  if (variables && Object.keys(variables).length > 0) {
    const _0x32d1f3 = /\{\{getvar::([^}]+)\}\}/g;
    const _0x4dfd5d = JSON.stringify(_0x502297);
    const _0x299c84 = [..._0x4dfd5d.matchAll(_0x32d1f3)];
    const _0x149729 = new Set();
    for (const _0x461fe1 of _0x299c84) {
      _0x149729.add(_0x461fe1[1]);
    }
    for (const _0x363f08 of _0x149729) {
      const _0x2416b9 = "{{getvar::" + _0x363f08 + "}}";
      const _0x48bcf1 = variables[_0x363f08] || "";
      _0x502297 = replacePlaceholder(_0x502297, _0x2416b9, _0x48bcf1, _0x2013fe);
    }
  }
  _0x502297 = processVariablePlaceholdersInMessages(_0x502297, _0x2013fe);
  const _0x1c81de = {
    messages: _0x502297,
    replacedVariables: _0x2013fe
  };
  return _0x1c81de;
}
function processVariablePlaceholdersInMessages(_0x4173dc, _0x4c2481) {
  if (!_0x4173dc || _0x4173dc.length === 0) {
    return _0x4173dc;
  }
  const _0x29abbc = getContext();
  if (!_0x29abbc.chatMetadata) {
    _0x29abbc.chatMetadata = {};
  }
  if (!_0x29abbc.chatMetadata.variables) {
    _0x29abbc.chatMetadata.variables = {};
  }
  return _0x4173dc.map(_0x5e1f91 => {
    if (!_0x5e1f91 || !_0x5e1f91.content) {
      return _0x5e1f91;
    }
    return {
      ..._0x5e1f91,
      content: processContentVariables(_0x5e1f91.content, _0x29abbc, _0x4c2481)
    };
  });
}
function processContentVariables(_0x30d961, _0x13bf12, _0x26815d) {
  if (typeof _0x30d961 === "string") {
    return processStringVariables(_0x30d961, _0x13bf12, _0x26815d);
  }
  if (Array.isArray(_0x30d961)) {
    return _0x30d961.map(_0x6cff7 => {
      if (_0x6cff7 && _0x6cff7.type === "text" && typeof _0x6cff7.text === "string") {
        return {
          ..._0x6cff7,
          text: processStringVariables(_0x6cff7.text, _0x13bf12, _0x26815d)
        };
      }
      return _0x6cff7;
    });
  }
  return _0x30d961;
}
function processStringVariables(_0x126192, _0x5591e0, _0xbe78be) {
  if (!_0x126192) {
    return _0x126192;
  }
  let _0x5624e3 = _0x126192;
  _0x5624e3 = _0x5624e3.replace(/\{@setvar::([^:@]+)::([\s\S]*?)@\}/g, (_0x14118c, _0x454b71, _0x47626a) => {
    const _0x7d46b0 = _0x454b71.trim();
    _0x5591e0.chatMetadata.variables[_0x7d46b0] = _0x47626a;
    if (_0xbe78be) {
      _0xbe78be.add("{@setvar::" + _0x7d46b0 + "@}");
    }
    return "";
  });
  _0x5624e3 = _0x5624e3.replace(/\{@getvar::([^@]+)@\}/g, (_0x34470f, _0x2115d1) => {
    const _0x4bc496 = _0x2115d1.trim();
    const _0x84d1f0 = _0x5591e0.chatMetadata.variables[_0x4bc496] || "";
    if (_0xbe78be) {
      _0xbe78be.add("{@getvar::" + _0x4bc496 + "@}");
    }
    return _0x84d1f0;
  });
  _0x5624e3 = _0x5624e3.replace(/\{@setglobalvar::([^:@]+)::([\s\S]*?)@\}/g, (_0xea97cd, _0x5b6626, _0x4c8e7e) => {
    const _0x47f9e7 = _0x5b6626.trim();
    setglobalvar(_0x47f9e7, _0x4c8e7e);
    if (_0xbe78be) {
      _0xbe78be.add("{@setglobalvar::" + _0x47f9e7 + "@}");
    }
    return "";
  });
  _0x5624e3 = _0x5624e3.replace(/\{@getglobalvar::([^@]+)@\}/g, (_0x55de87, _0x3199c9) => {
    const _0x183123 = _0x3199c9.trim();
    const _0x39180c = getglobalvar(_0x183123) || "";
    if (_0xbe78be) {
      _0xbe78be.add("{@getglobalvar::" + _0x183123 + "@}");
    }
    return _0x39180c;
  });
  _0x5624e3 = _0x5624e3.replace(/\{@getworldvar::([^@]+)@\}/g, (_0x442539, _0x46d39d) => {
    const _0xfa6b71 = _0x46d39d.trim();
    const _0x1855c4 = getworldvar(_0xfa6b71) || "";
    if (_0xbe78be) {
      _0xbe78be.add("{@getworldvar::" + _0xfa6b71 + "@}");
    }
    return _0x1855c4;
  });
  return _0x5624e3;
}
export function buildPromptWithTrigger(_0x433754) {
  const {
    requestType: _0x6b8392,
    contextData: _0x682fbb
  } = _0x433754;
  const _0x2a8d25 = extension_settings[extensionName]?.llm_request_type_configs || {};
  const _0x527135 = _0x2a8d25[_0x6b8392] || {
    context_profile: "默认"
  };
  const _0x2eea99 = _0x527135.context_profile || "默认";
  const _0x2631ac = extension_settings[extensionName]?.test_context_profiles || {};
  const _0x2f8209 = _0x2631ac[_0x2eea99] || _0x2631ac[Object.keys(_0x2631ac)[0]] || {};
  const {
    context = "",
    body = "",
    worldBookContent = "",
    userDemand = ""
  } = _0x682fbb;
  const _0x253e66 = [userDemand, context, body, worldBookContent].filter(Boolean).join("\n");
  const _0x560bca = [];
  if (_0x2f8209.entries && Array.isArray(_0x2f8209.entries)) {
    for (const _0x105476 of _0x2f8209.entries) {
      if (!_0x105476.enabled) {
        continue;
      }
      if (!_0x105476.content || _0x105476.content.trim() === "") {
        continue;
      }
      if (_0x105476.triggerMode === "trigger") {
        if (!checkTriggerWords(_0x105476.triggerWords, _0x253e66)) {
          continue;
        }
      }
      const _0x2a82bf = {
        role: _0x105476.role || "user",
        content: _0x105476.content
      };
      _0x560bca.push(_0x2a82bf);
    }
  } else if (_0x2f8209.history && Array.isArray(_0x2f8209.history)) {
    for (const _0x5bcee9 of _0x2f8209.history) {
      if (_0x5bcee9.user && _0x5bcee9.user.trim() !== "") {
        const _0x3ae63b = {
          role: "user",
          content: _0x5bcee9.user
        };
        _0x560bca.push(_0x3ae63b);
      }
      if (_0x5bcee9.assistant && _0x5bcee9.assistant.trim() !== "") {
        const _0x33f47c = {
          role: "assistant",
          content: _0x5bcee9.assistant
        };
        _0x560bca.push(_0x33f47c);
      }
    }
  }
  const _0x2f03af = mergeAdjacentMessages(_0x560bca);
  const {
    messages: _0x4e462a,
    replacedVariables: _0x2355e9
  } = replaceAllPlaceholders(_0x2f03af, _0x682fbb);
  return _0x4e462a;
}
export function getProcessedPrompt(_0x3b5026, _0x3e18f5) {
  const _0x51b81e = {
    requestType: _0x3b5026,
    contextData: _0x3e18f5
  };
  return buildPromptWithTrigger(_0x51b81e);
}