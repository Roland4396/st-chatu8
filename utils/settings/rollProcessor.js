const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const DEFAULT_SEED_MAX = 100000;
const DEFAULT_STRING_LENGTH = 8;
const ROLL_PATTERN = /\{\{roll\s+(\d+)\}\}/gi;
function createSeededRandom(_0x197e9a) {
  return function () {
    let _0x5514ba = _0x197e9a += 1831565813;
    _0x5514ba = Math.imul(_0x5514ba ^ _0x5514ba >>> 15, _0x5514ba | 1);
    _0x5514ba ^= _0x5514ba + Math.imul(_0x5514ba ^ _0x5514ba >>> 7, _0x5514ba | 61);
    return ((_0x5514ba ^ _0x5514ba >>> 14) >>> 0) / 4294967296;
  };
}
export function seededRandomString(_0x4f09bb, _0x51f6b0 = DEFAULT_STRING_LENGTH) {
  const _0x284712 = createSeededRandom(_0x4f09bb);
  let _0x4e984a = "";
  for (let _0x50065a = 0; _0x50065a < _0x51f6b0; _0x50065a++) {
    const _0x449270 = Math.floor(_0x284712() * CHARSET.length);
    _0x4e984a += CHARSET[_0x449270];
  }
  return _0x4e984a;
}
export function processRollInContent(_0x57c315) {
  if (_0x57c315 == null || typeof _0x57c315 !== "string") {
    return _0x57c315;
  }
  if (_0x57c315 === "") {
    return _0x57c315;
  }
  return _0x57c315.replace(ROLL_PATTERN, (_0x42001d, _0x3b2434) => {
    let _0x48892e = parseInt(_0x3b2434, 10);
    if (isNaN(_0x48892e) || _0x48892e <= 0) {
      _0x48892e = DEFAULT_SEED_MAX;
    }
    const _0x388834 = Math.floor(Math.random() * (_0x48892e + 1));
    return seededRandomString(_0x388834);
  });
}
export function processRollPlaceholders(_0x40af53) {
  if (!Array.isArray(_0x40af53) || _0x40af53.length === 0) {
    return _0x40af53;
  }
  return _0x40af53.map(_0x23e95f => {
    if (!_0x23e95f || typeof _0x23e95f !== "object") {
      return _0x23e95f;
    }
    if (typeof _0x23e95f.content === "string") {
      return {
        ..._0x23e95f,
        content: processRollInContent(_0x23e95f.content)
      };
    }
    if (Array.isArray(_0x23e95f.content)) {
      return {
        ..._0x23e95f,
        content: _0x23e95f.content.map(_0x1f48a3 => {
          if (_0x1f48a3 && _0x1f48a3.type === "text" && typeof _0x1f48a3.text === "string") {
            return {
              ..._0x1f48a3,
              text: processRollInContent(_0x1f48a3.text)
            };
          }
          return _0x1f48a3;
        })
      };
    }
    return _0x23e95f;
  });
}