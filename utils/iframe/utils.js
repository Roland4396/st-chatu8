export function findNodeAtPosition(_0x1ea2a8, _0x5589bb) {
  if (!_0x1ea2a8 || _0x1ea2a8.length === 0) {
    return null;
  }
  let _0x44d6d8 = 0;
  let _0x555123 = _0x1ea2a8.length - 1;
  while (_0x44d6d8 <= _0x555123) {
    const _0x2c9598 = Math.floor((_0x44d6d8 + _0x555123) / 2);
    const _0xd0e976 = _0x1ea2a8[_0x2c9598];
    if (_0x5589bb > _0xd0e976.start && _0x5589bb <= _0xd0e976.end || _0x5589bb === _0xd0e976.end) {
      return _0xd0e976;
    } else if (_0x5589bb <= _0xd0e976.start) {
      _0x555123 = _0x2c9598 - 1;
    } else {
      _0x44d6d8 = _0x2c9598 + 1;
    }
  }
  return null;
}
export function isElementVisible(_0x245c2b, _0x1dc1b4 = 200) {
  if (!_0x245c2b || !_0x245c2b.getBoundingClientRect) {
    return false;
  }
  const _0x3d13a0 = _0x245c2b.getBoundingClientRect();
  const _0x3e167d = window.innerHeight || document.documentElement.clientHeight;
  const _0x323b23 = window.innerWidth || document.documentElement.clientWidth;
  const _0x32910c = _0x3d13a0.bottom >= -_0x1dc1b4 && _0x3d13a0.top <= _0x3e167d + _0x1dc1b4;
  const _0x493da5 = _0x3d13a0.right >= -_0x1dc1b4 && _0x3d13a0.left <= _0x323b23 + _0x1dc1b4;
  return _0x32910c && _0x493da5;
}
export function isIframeVisible(_0x2e21d2, _0x549a1f = 200) {
  return isElementVisible(_0x2e21d2, _0x549a1f);
}
export function debounce(_0x326ddb, _0x1047e9 = 150) {
  let _0x45a44f = null;
  return function (..._0x223d72) {
    if (_0x45a44f) {
      clearTimeout(_0x45a44f);
    }
    _0x45a44f = setTimeout(() => {
      _0x326ddb.apply(this, _0x223d72);
      _0x45a44f = null;
    }, _0x1047e9);
  };
}
export function throttle(_0xedd1b5, _0xeae734 = 150) {
  let _0x32402d = 0;
  let _0x3168c6 = null;
  return function (..._0x404b03) {
    const _0x66de5d = Date.now();
    const _0x372ce1 = _0xeae734 - (_0x66de5d - _0x32402d);
    if (_0x372ce1 <= 0) {
      if (_0x3168c6) {
        clearTimeout(_0x3168c6);
        _0x3168c6 = null;
      }
      _0x32402d = _0x66de5d;
      _0xedd1b5.apply(this, _0x404b03);
    } else if (!_0x3168c6) {
      _0x3168c6 = setTimeout(() => {
        _0x32402d = Date.now();
        _0x3168c6 = null;
        _0xedd1b5.apply(this, _0x404b03);
      }, _0x372ce1);
    }
  };
}
export function generateStableId(_0x9dd7bf) {
  let _0x54ec30 = 0;
  for (let _0x1d4700 = 0; _0x1d4700 < _0x9dd7bf.length; _0x1d4700++) {
    const _0xcd4334 = _0x9dd7bf.charCodeAt(_0x1d4700);
    _0x54ec30 = (_0x54ec30 << 5) - _0x54ec30 + _0xcd4334;
    _0x54ec30 |= 0;
  }
  return "chatu8-id-" + Math.abs(_0x54ec30).toString(36);
}
export function generateElKey(_0x52f591) {
  if (!_0x52f591 || _0x52f591.length === 0) {
    return "";
  }
  const _0x34d19a = _0x52f591.length;
  const _0x4b7189 = 20;
  const _0x1cf48c = Math.max(0, Math.floor(_0x34d19a / 2) - Math.floor(_0x4b7189 / 2));
  return _0x52f591.substring(_0x1cf48c, _0x1cf48c + _0x4b7189);
}