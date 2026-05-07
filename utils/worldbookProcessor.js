import { extensionName } from "./config.js";
import { extension_settings } from "../../../../extensions.js";
import { getrWorlds, getcharWorld, getWorldEntries, getglobalvar, setglobalvar } from "./chatDataUtils.js";
import { getContext } from "../../../../st-context.js";
let worldVars = {};
export function getworldvar(_0xfba10a) {
  return worldVars[_0xfba10a] || "";
}
export function setworldvar(_0x6cc8f9, _0x5bc950) {
  worldVars[_0x6cc8f9] = _0x5bc950;
}
export function clearWorldVars() {
  worldVars = {};
}
export async function processWorldBooksWithTrigger(_0x163c40) {
  try {
    clearWorldVars();
    const _0x1e32ab = _0x163c40.join("\n");
    const _0x17b086 = extension_settings[extensionName];
    const _0x1e6615 = _0x17b086?.worldBookConfig || {};
    const _0x179be5 = _0x1e6615.worldBookSelections || {};
    const _0x40d134 = _0x1e6615.worldEntrySelections || {};
    const _0x38273d = await getcharWorld();
    const _0x5396b0 = {
      ..._0x179be5
    };
    const _0xe5fe14 = _0x5396b0;
    if (_0x38273d) {
      const _0x3867d6 = _0x40d134[_0x38273d] && Object.keys(_0x40d134[_0x38273d]).length > 0;
      if (_0x3867d6 || !_0x179be5.hasOwnProperty(_0x38273d)) {
        _0xe5fe14[_0x38273d] = true;
      }
    }
    const _0x2819e9 = await getrWorlds();
    let _0x5532ad = [];
    for (const _0x4d1f3c of _0x2819e9) {
      if (!_0xe5fe14[_0x4d1f3c]) {
        continue;
      }
      const _0x281b66 = await getWorldEntries(_0x4d1f3c);
      if (!_0x281b66) {
        continue;
      }
      const _0x1acc1b = Array.isArray(_0x281b66) ? _0x281b66 : Object.values(_0x281b66);
      const _0x305e66 = _0x40d134[_0x4d1f3c] || {};
      const _0x6528e3 = await processSingleWorldBook(_0x1acc1b, _0x305e66, _0x1e32ab);
      if (_0x6528e3) {
        const _0x134786 = {
          worldName: _0x4d1f3c,
          content: _0x6528e3
        };
        _0x5532ad.push(_0x134786);
      }
    }
    let _0x5983ec = _0x5532ad.map(_0x4fb46f => "=== " + _0x4fb46f.worldName + " ===\n" + _0x4fb46f.content).join("\n\n");
    _0x5983ec = processVariablePlaceholders(_0x5983ec);
    return _0x5983ec;
  } catch (_0x1dfa86) {
    console.error("[processWorldBooks] Error:", _0x1dfa86);
    return "";
  }
}
function processVariablePlaceholders(_0xc34fb0) {
  if (!_0xc34fb0) {
    return _0xc34fb0;
  }
  const _0xaa0447 = getContext();
  if (!_0xaa0447.chatMetadata) {
    _0xaa0447.chatMetadata = {};
  }
  if (!_0xaa0447.chatMetadata.variables) {
    _0xaa0447.chatMetadata.variables = {};
  }
  let _0x2ceaf2 = _0xc34fb0;
  _0x2ceaf2 = _0x2ceaf2.replace(/\{@setvar::([^:@]+)::([\s\S]*?)@\}/g, (_0x1ff899, _0xd51d2f, _0x412231) => {
    const _0x4b8aba = _0xd51d2f.trim();
    _0xaa0447.chatMetadata.variables[_0x4b8aba] = _0x412231;
    return "";
  });
  _0x2ceaf2 = _0x2ceaf2.replace(/\{@getvar::([^@]+)@\}/g, (_0x3af819, _0x451963) => {
    const _0x51779a = _0x451963.trim();
    const _0x470a70 = _0xaa0447.chatMetadata.variables[_0x51779a] || "";
    return _0x470a70;
  });
  _0x2ceaf2 = _0x2ceaf2.replace(/\{@setglobalvar::([^:@]+)::([\s\S]*?)@\}/g, (_0x362365, _0x41eab, _0x4d59ab) => {
    const _0x173496 = _0x41eab.trim();
    setglobalvar(_0x173496, _0x4d59ab);
    return "";
  });
  _0x2ceaf2 = _0x2ceaf2.replace(/\{@getglobalvar::([^@]+)@\}/g, (_0xcbdfcd, _0x325c8d) => {
    const _0x2dae7a = _0x325c8d.trim();
    const _0x3d4f17 = getglobalvar(_0x2dae7a) || "";
    return _0x3d4f17;
  });
  _0x2ceaf2 = _0x2ceaf2.replace(/\{@setworldvar::([^:@]+)::([\s\S]*?)@\}/g, (_0x40864a, _0x59e7f4, _0x1b5547) => {
    const _0x40ad3d = _0x59e7f4.trim();
    setworldvar(_0x40ad3d, _0x1b5547);
    return "";
  });
  _0x2ceaf2 = _0x2ceaf2.replace(/\{@getworldvar::([^@]+)@\}/g, (_0x55bcc5, _0x527173) => {
    const _0x12dbc5 = _0x527173.trim();
    const _0x3a03a6 = getworldvar(_0x12dbc5) || "";
    return _0x3a03a6;
  });
  return _0x2ceaf2;
}
async function processSingleWorldBook(_0x805aa7, _0x37a909, _0x49fe0a) {
  const _0x168e1e = _0x805aa7.filter(_0x221d61 => {
    if (_0x221d61.disable) {
      return false;
    }
    const _0x88107c = _0x221d61.uid;
    const _0x490303 = _0x37a909[_0x88107c];
    if (_0x490303 === "force") {
      return true;
    }
    return _0x490303 === true;
  });
  const _0x27c3fe = new Set();
  for (const _0x3c7cf1 of _0x168e1e) {
    const _0x472d5e = _0x37a909[_0x3c7cf1.uid];
    if (_0x472d5e === "force") {
      _0x27c3fe.add(_0x3c7cf1.uid);
    }
  }
  const _0x543649 = _0x168e1e.filter(_0x249146 => _0x249146.constant === true || _0x27c3fe.has(_0x249146.uid));
  const _0x2c6ce9 = _0x168e1e.filter(_0x1aee75 => _0x1aee75.constant !== true && !_0x27c3fe.has(_0x1aee75.uid));
  const _0x11f75d = _0x2c6ce9.filter(_0x38bfdc => _0x38bfdc.excludeRecursion === true);
  const _0x468e2f = _0x2c6ce9.filter(_0x5b40ab => _0x5b40ab.excludeRecursion !== true);
  const _0x7843a7 = _0x543649.filter(_0x35a699 => _0x35a699.preventRecursion === true);
  const _0x375c95 = _0x543649.filter(_0x486bfe => _0x486bfe.preventRecursion !== true);
  let _0x3d5f70 = [];
  let _0x1cb95c = _0x49fe0a;
  for (const _0x590ed1 of _0x11f75d) {
    if (checkEntryTrigger(_0x590ed1, _0x49fe0a)) {
      _0x3d5f70.push(_0x590ed1);
      if (_0x590ed1.preventRecursion !== true) {
        _0x1cb95c += "\n" + (_0x590ed1.content || "");
      }
    }
  }
  for (const _0x32ac61 of _0x375c95) {
    _0x3d5f70.push(_0x32ac61);
    _0x1cb95c += "\n" + (_0x32ac61.content || "");
  }
  const _0x2e3ae2 = await processEntriesRecursively(_0x468e2f, _0x1cb95c);
  _0x3d5f70.push(..._0x2e3ae2);
  _0x3d5f70.push(..._0x7843a7);
  _0x3d5f70.sort((_0xb1f597, _0x808709) => {
    const _0x3b11c3 = _0xb1f597.order ?? Infinity;
    const _0x29ec92 = _0x808709.order ?? Infinity;
    return _0x3b11c3 - _0x29ec92;
  });
  const _0x429a96 = _0x3d5f70.map(_0x26d5a9 => _0x26d5a9.content || "").filter(_0x5dc37b => _0x5dc37b.trim()).join("\n\n");
  return _0x429a96;
}
async function processEntriesRecursively(_0x501e42, _0x30dd5f) {
  let _0x14783d = [];
  let _0x252b8b = _0x30dd5f;
  let _0x4a4e6d = true;
  const _0x412472 = new Set();
  while (_0x4a4e6d) {
    _0x4a4e6d = false;
    for (const _0x2a3007 of _0x501e42) {
      const _0x579c75 = _0x2a3007.uid;
      if (_0x412472.has(_0x579c75)) {
        continue;
      }
      if (checkEntryTrigger(_0x2a3007, _0x252b8b)) {
        _0x14783d.push(_0x2a3007);
        _0x412472.add(_0x579c75);
        _0x4a4e6d = true;
        if (_0x2a3007.preventRecursion !== true) {
          _0x252b8b += "\n" + (_0x2a3007.content || "");
        }
      }
    }
  }
  return _0x14783d;
}
function checkEntryTrigger(_0x586dfa, _0x4e46a2) {
  if (!_0x586dfa.selective) {
    return checkKeywords(_0x586dfa.key, _0x4e46a2, _0x586dfa.caseSensitive, _0x586dfa.matchWholeWords);
  }
  const _0xd0ad0d = checkKeywords(_0x586dfa.key, _0x4e46a2, _0x586dfa.caseSensitive, _0x586dfa.matchWholeWords);
  if (!_0xd0ad0d) {
    return false;
  }
  const _0x8ecf32 = _0x586dfa.keysecondary || [];
  if (_0x8ecf32.length === 0) {
    return _0xd0ad0d;
  }
  const _0xd9937c = _0x586dfa.selectiveLogic || 0;
  switch (_0xd9937c) {
    case 0:
      return checkKeywords(_0x8ecf32, _0x4e46a2, _0x586dfa.caseSensitive, _0x586dfa.matchWholeWords, "any");
    case 1:
      return checkKeywords(_0x8ecf32, _0x4e46a2, _0x586dfa.caseSensitive, _0x586dfa.matchWholeWords, "all");
    case 2:
      return !checkKeywords(_0x8ecf32, _0x4e46a2, _0x586dfa.caseSensitive, _0x586dfa.matchWholeWords, "any");
    default:
      return _0xd0ad0d;
  }
}
function checkKeywords(_0x3b4dd9, _0x45f04c, _0x2364ec, _0x55583c, _0x4c209f = "any") {
  if (!_0x3b4dd9 || _0x3b4dd9.length === 0) {
    return false;
  }
  const _0x10b920 = Array.isArray(_0x3b4dd9) ? _0x3b4dd9 : [_0x3b4dd9];
  const _0x310e5a = _0x2364ec ? _0x45f04c : _0x45f04c.toLowerCase();
  const _0x312919 = _0x10b920.map(_0x4291e2 => {
    if (!_0x4291e2) {
      return false;
    }
    const _0x5db726 = _0x2364ec ? _0x4291e2 : _0x4291e2.toLowerCase();
    if (_0x55583c) {
      const _0x1310d6 = new RegExp("\\b" + escapeRegex(_0x5db726) + "\\b", _0x2364ec ? "" : "i");
      return _0x1310d6.test(_0x45f04c);
    } else {
      return _0x310e5a.includes(_0x5db726);
    }
  });
  if (_0x4c209f === "all") {
    return _0x312919.every(_0x22cd4e => _0x22cd4e);
  } else {
    return _0x312919.some(_0x58baa2 => _0x58baa2);
  }
}
function escapeRegex(_0x415c71) {
  return _0x415c71.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}