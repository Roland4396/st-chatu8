import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced, eventSource } from "../../../../../script.js";
import { extensionName, eventNames } from "./config.js";
import { addLog } from "./utils.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { mergeAdjacentMessages } from "./promptProcessor.js";
let settings;
const SD_SYMBOL_PATTERN = /^([\(\[\{<]+)?(.*?)([\)\]\}>]+)?(:[\d.]+)?$/;
const SKIP_PATTERNS = [/^<lora:/i, /^<lyco:/i, /^<hypernet:/i, /^[\d.:]+$/, /^$/, /^\$.*\$$/];
function shouldSkipTranslation(_0x541d24) {
  return SKIP_PATTERNS.some(_0x26c2b4 => _0x26c2b4.test(_0x541d24.trim()));
}
export function tagsToJsonString(_0x20bc08) {
  if (!Array.isArray(_0x20bc08)) {
    return "[]";
  }
  return JSON.stringify(_0x20bc08.filter(_0x59cd7e => _0x59cd7e && typeof _0x59cd7e === "string"));
}
export function preprocessPromptForTranslation(_0x229408) {
  if (!_0x229408 || typeof _0x229408 !== "string") {
    return {
      originalTags: [],
      cleanedTags: [],
      cleanedText: "",
      tagMap: new Map()
    };
  }
  const _0x46e26f = _0x2ea3bf => {
    const _0x168f7f = [];
    let _0x95c143 = "";
    let _0x2a3a8c = false;
    for (let _0x2fb0e8 = 0; _0x2fb0e8 < _0x2ea3bf.length; _0x2fb0e8++) {
      const _0x1dbe41 = _0x2ea3bf[_0x2fb0e8];
      if (_0x1dbe41 === "$") {
        _0x2a3a8c = !_0x2a3a8c;
        _0x95c143 += _0x1dbe41;
      } else if ((_0x1dbe41 === "," || _0x1dbe41 === "，") && !_0x2a3a8c) {
        const _0x15c563 = _0x95c143.trim();
        if (_0x15c563) {
          _0x168f7f.push(_0x15c563);
        }
        _0x95c143 = "";
      } else {
        _0x95c143 += _0x1dbe41;
      }
    }
    if (_0x95c143.trim()) {
      _0x168f7f.push(_0x95c143.trim());
    }
    return _0x168f7f;
  };
  const _0x1f2286 = _0x46e26f(_0x229408);
  const _0x19be93 = [];
  const _0x31c63a = [];
  const _0x2c87b1 = new Map();
  for (const _0x582ebb of _0x1f2286) {
    const _0x49d541 = _0x582ebb.match(SD_SYMBOL_PATTERN);
    if (_0x49d541) {
      const _0x4ea127 = _0x49d541[1] || "";
      const _0x525f84 = (_0x49d541[2] || "").trim();
      const _0x47d4e9 = _0x49d541[3] || "";
      const _0x1f43fb = _0x49d541[4] || "";
      const _0x470c71 = {
        original: _0x582ebb,
        cleaned: _0x525f84,
        prefix: _0x4ea127,
        suffix: _0x47d4e9,
        weight: _0x1f43fb,
        skip: shouldSkipTranslation(_0x582ebb) || shouldSkipTranslation(_0x525f84)
      };
      _0x19be93.push(_0x470c71);
      if (!_0x470c71.skip && _0x525f84) {
        _0x31c63a.push(_0x525f84);
        _0x2c87b1.set(_0x525f84.toLowerCase(), _0x470c71);
      }
    } else {
      const _0x140f4f = {
        original: _0x582ebb,
        cleaned: _0x582ebb,
        prefix: "",
        suffix: "",
        weight: "",
        skip: shouldSkipTranslation(_0x582ebb)
      };
      _0x19be93.push(_0x140f4f);
      if (!_0x140f4f.skip && _0x582ebb) {
        _0x31c63a.push(_0x582ebb);
        _0x2c87b1.set(_0x582ebb.toLowerCase(), _0x140f4f);
      }
    }
  }
  return {
    originalTags: _0x19be93,
    cleanedTags: _0x31c63a,
    cleanedText: tagsToJsonString(_0x31c63a),
    tagMap: _0x2c87b1
  };
}
export function combineTranslationResult(_0x3d1b0c, _0x4a108c) {
  if (!_0x3d1b0c || !Array.isArray(_0x3d1b0c)) {
    return [];
  }
  const _0x364566 = {};
  if (_0x4a108c && typeof _0x4a108c === "object") {
    for (const [_0x1e035f, _0x2bf475] of Object.entries(_0x4a108c)) {
      _0x364566[_0x1e035f.toLowerCase()] = _0x2bf475;
    }
  }
  return _0x3d1b0c.map(_0x199b6d => {
    const {
      original: _0x408b3e,
      cleaned: _0x593d06,
      skip: _0x1bef0e
    } = _0x199b6d;
    if (_0x1bef0e) {
      const _0x237686 = {
        original: _0x408b3e,
        translation: "",
        cleaned: _0x593d06,
        skipped: true
      };
      return _0x237686;
    }
    const _0xc453cd = _0x364566[_0x593d06.toLowerCase()] || "";
    const _0x2b56f0 = {
      original: _0x408b3e,
      translation: _0xc453cd,
      cleaned: _0x593d06,
      skipped: false
    };
    return _0x2b56f0;
  });
}
export function formatTranslationDisplay(_0x3c68d6, _0x1457bf = {}) {
  const {
    separator = ", ",
    showOriginal = true,
    showTranslation = true
  } = _0x1457bf;
  if (!_0x3c68d6 || !Array.isArray(_0x3c68d6)) {
    return "";
  }
  return _0x3c68d6.map(_0xe34369 => {
    if (_0xe34369.skipped) {
      if (showOriginal) {
        return _0xe34369.original;
      } else {
        return "";
      }
    }
    const _0x34d5bc = [];
    if (showOriginal) {
      _0x34d5bc.push(_0xe34369.original);
    }
    if (showTranslation && _0xe34369.translation) {
      _0x34d5bc.push("(" + _0xe34369.translation + ")");
    }
    return _0x34d5bc.join(" ");
  }).filter(Boolean).join(separator);
}
export async function translatePromptTags(_0x5d61a7) {
  const {
    originalTags: _0x34acee,
    cleanedText: _0x3b7f04
  } = preprocessPromptForTranslation(_0x5d61a7);
  if (!_0x3b7f04) {
    return {
      results: [],
      displayText: "",
      originalTags: []
    };
  }
  try {
    const _0x5273bc = await callTranslation(_0x3b7f04);
    const _0x63e846 = parseTranslationResult(_0x5273bc);
    const _0x388e56 = combineTranslationResult(_0x34acee, _0x63e846);
    const _0x37387a = formatTranslationDisplay(_0x388e56);
    const _0x40e5b8 = {
      results: _0x388e56,
      displayText: _0x37387a,
      originalTags: _0x34acee
    };
    return _0x40e5b8;
  } catch (_0x13a10c) {
    console.error("st-chatu8: 翻译提示词标签失败:", _0x13a10c);
    throw _0x13a10c;
  }
}
export function parseTranslationResult(_0x32fe25) {
  if (!_0x32fe25) {
    return {};
  }
  try {
    const _0x4d149e = _0x32fe25.match(/\{[\s\S]*\}/);
    if (_0x4d149e) {
      const _0x5fede0 = JSON.parse(_0x4d149e[0]);
      if (typeof _0x5fede0 === "object" && _0x5fede0 !== null) {
        return _0x5fede0;
      }
    }
  } catch (_0x5ba30c) {
    console.warn("st-chatu8: JSON解析失败，尝试旧格式:", _0x5ba30c.message);
  }
  const _0x4d4ba3 = String(_0x32fe25).replace(/[\r\n]+/g, " ").replace(/^[\s"'`]+|[\s"'`]+$/g, "").trim();
  const _0x6eb87d = _0x4d4ba3.split(/[,，]/).map(_0xb5b2ba => _0xb5b2ba.trim()).filter(Boolean);
  const _0x5b581c = {};
  for (const _0x30c82a of _0x6eb87d) {
    const _0x333e20 = _0x30c82a.indexOf("\\");
    if (_0x333e20 > 0) {
      const _0x2b60c0 = _0x30c82a.slice(0, _0x333e20).trim();
      const _0xbdf566 = _0x30c82a.slice(_0x333e20 + 1).trim();
      if (_0x2b60c0) {
        _0x5b581c[_0x2b60c0] = _0xbdf566;
      }
    }
  }
  return _0x5b581c;
}
function generateRequestId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export function LLM_TRANSLATION_GET_PROMPT() {
  return new Promise((_0x36c784, _0x2090c5) => {
    const _0x86f285 = generateRequestId();
    console.log("st-chatu8: 请求获取翻译提示词 (ID: " + _0x86f285 + ")");
    const _0x112060 = _0x49d98c => {
      if (_0x49d98c.id !== _0x86f285) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_TRANSLATION_GET_PROMPT_RESPONSE, _0x112060);
      const {
        prompt: _0x4c22c5
      } = _0x49d98c;
      console.log("st-chatu8: 已获取翻译提示词 (ID: " + _0x86f285 + "):", _0x4c22c5);
      _0x36c784(_0x4c22c5);
    };
    eventSource.on(eventNames.LLM_TRANSLATION_GET_PROMPT_RESPONSE, _0x112060);
    const _0xc3e776 = {
      id: _0x86f285
    };
    eventSource.emit(eventNames.LLM_TRANSLATION_GET_PROMPT_REQUEST, _0xc3e776);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_TRANSLATION_GET_PROMPT_RESPONSE, _0x112060);
      _0x2090c5(new Error("获取翻译提示词超时"));
    }, 10000);
  });
}
export function LLM_TRANSLATION(_0x12e5c8, {
  timeoutMs = 60000
} = {}) {
  return new Promise((_0x3450b8, _0x2e5009) => {
    const _0x3d5b6f = generateRequestId();
    console.log("st-chatu8: 请求翻译 LLM (ID: " + _0x3d5b6f + ")");
    let _0xfd50c6 = null;
    const _0x6fc77a = () => {
      eventSource.removeListener(eventNames.LLM_TRANSLATION_RESPONSE, _0x468b9a);
      if (_0xfd50c6) {
        clearTimeout(_0xfd50c6);
      }
    };
    const _0x468b9a = _0x1ec7a1 => {
      if (_0x1ec7a1.id !== _0x3d5b6f) {
        return;
      }
      _0x6fc77a();
      console.log("st-chatu8: 已收到翻译 LLM 执行结果 (ID: " + _0x3d5b6f + "):", _0x1ec7a1);
      if (_0x1ec7a1.success) {
        _0x3450b8(_0x1ec7a1.result);
      } else if (_0x1ec7a1.error && _0x1ec7a1.error.name === "AbortError") {
        const _0x42dfca = new Error(_0x1ec7a1.error.message);
        _0x42dfca.name = "AbortError";
        _0x2e5009(_0x42dfca);
      } else {
        _0x2e5009(new Error(_0x1ec7a1.result));
      }
    };
    eventSource.on(eventNames.LLM_TRANSLATION_RESPONSE, _0x468b9a);
    const _0x20268f = {
      prompt: _0x12e5c8,
      id: _0x3d5b6f
    };
    eventSource.emit(eventNames.LLM_TRANSLATION_REQUEST, _0x20268f);
    _0xfd50c6 = setTimeout(() => {
      _0x6fc77a();
      _0x2e5009(new Error("翻译 LLM 执行超时（" + timeoutMs + "ms）"));
    }, timeoutMs);
  });
}
export async function callTranslation(_0x32b10b) {
  try {
    let _0xfc084 = buildPromptForRequestType("translation", _0x32b10b || "");
    _0xfc084 = mergeAdjacentMessages(_0xfc084);
    const _0x53f5d5 = [..._0xfc084, {
      role: "user",
      content: _0x32b10b || ""
    }];
    updateCombinedPrompt(_0x53f5d5);
    const _0x34b94e = await LLM_TRANSLATION(_0x53f5d5);
    return _0x34b94e;
  } catch (_0x46385e) {
    addLog("翻译失败: " + _0x46385e.message);
    console.error("翻译失败:", _0x46385e);
    throw _0x46385e;
  }
}
let isAiInitialized = false;
export function initAiSettings(_0x1fde25) {
  if (!isAiInitialized) {
    console.log("st-chatu8: AI 设置已统一到 LLM 设置页面");
    isAiInitialized = true;
  }
}