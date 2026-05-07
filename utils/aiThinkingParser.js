export function parseThinkingContent(_0x212a8) {
  if (!_0x212a8 || typeof _0x212a8 !== "string") {
    return {
      hasThinking: false,
      thinkingBlocks: [],
      cleanedText: _0x212a8 || ""
    };
  }
  const _0x3fceb1 = [];
  let _0x5b9e5c = _0x212a8;
  const _0xab1c63 = _0x212a8.lastIndexOf("</think>");
  if (_0xab1c63 !== -1) {
    const _0x95e6b2 = _0x212a8.substring(0, _0xab1c63).trim();
    if (_0x95e6b2.length > 0) {
      const _0x30552d = _0x95e6b2.replace(/<\/?think>/gi, "").trim();
      if (_0x30552d.length > 0) {
        const _0x482e78 = _0x30552d.length > 10240 ? _0x30552d.substring(0, 10240) + "\n...(内容过长已截断)" : _0x30552d;
        const _0x2ad508 = {
          content: _0x482e78,
          startIndex: 0,
          index: 0
        };
        _0x3fceb1.push(_0x2ad508);
      }
    }
    _0x5b9e5c = _0x212a8.substring(_0xab1c63 + 8).trim();
  }
  return {
    hasThinking: _0x3fceb1.length > 0,
    thinkingBlocks: _0x3fceb1,
    cleanedText: _0x5b9e5c
  };
}
export function checkIncompleteThinking(_0x5aa96b) {
  if (!_0x5aa96b || typeof _0x5aa96b !== "string") {
    return {
      hasOpenTag: false,
      hasCloseTag: false,
      isComplete: true
    };
  }
  const _0x2839fc = _0x5aa96b.match(/<think>/gi);
  const _0x1f197f = _0x5aa96b.match(/<\/think>/gi);
  const _0x3fc833 = _0x2839fc ? _0x2839fc.length : 0;
  const _0x9ad870 = _0x1f197f ? _0x1f197f.length : 0;
  const _0x26dfe8 = _0x3fc833 > 0;
  const _0x817030 = _0x9ad870 > 0;
  const _0x19a84d = _0x3fc833 === _0x9ad870;
  const _0xe0aab0 = {
    hasOpenTag: _0x26dfe8,
    hasCloseTag: _0x817030,
    isComplete: _0x19a84d
  };
  return _0xe0aab0;
}
export function extractStreamingThinking(_0x58e07a) {
  if (!_0x58e07a || typeof _0x58e07a !== "string") {
    return [];
  }
  const _0x536627 = [];
  const _0x99f48d = _0x58e07a.lastIndexOf("</think>");
  if (_0x99f48d !== -1) {
    const _0x583501 = _0x58e07a.substring(0, _0x99f48d).trim();
    if (_0x583501.length > 0) {
      const _0x8797f5 = _0x583501.replace(/<\/?think>/gi, "").trim();
      if (_0x8797f5.length > 0) {
        const _0x390a18 = {
          content: _0x8797f5,
          isComplete: true,
          index: 0
        };
        _0x536627.push(_0x390a18);
      }
    }
  } else {
    const _0x4ff59d = _0x58e07a.replace(/^<think>/i, "").trim();
    if (_0x4ff59d.length > 0) {
      const _0x24e801 = {
        content: _0x4ff59d,
        isComplete: false,
        index: 0
      };
      _0x536627.push(_0x24e801);
    }
  }
  return _0x536627;
}