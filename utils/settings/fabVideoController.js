export function initVideoController(_0x57ec53, _0x25a94b = {}) {
  let _0x2b72f3 = false;
  let _0x3b715c = null;
  let _0x2fcc91 = false;
  const {
    isLoadingFn: _0x5764f9
  } = _0x25a94b;
  const _0x3c2d03 = {
    onDragStart: () => {
      if (_0x3b715c) {
        clearTimeout(_0x3b715c);
        _0x3b715c = null;
      }
      const _0x1213ff = _0x57ec53.getState();
      _0x2fcc91 = _0x1213ff.isPlayingThinking;
      _0x3b715c = setTimeout(() => {
        if (!_0x2b72f3) {
          _0x2b72f3 = true;
          _0x57ec53.switchToDraggingVideo();
        }
      }, 50);
    },
    onDragEnd: () => {
      if (_0x3b715c) {
        clearTimeout(_0x3b715c);
        _0x3b715c = null;
      }
      if (_0x2b72f3) {
        _0x2b72f3 = false;
        const _0x514d5e = _0x5764f9 ? _0x5764f9() : false;
        if ((_0x2fcc91 || _0x514d5e) && _0x57ec53.playThinkingVideo) {
          _0x57ec53.playThinkingVideo();
        } else {
          _0x57ec53.switchToIdleVideo();
        }
        _0x2fcc91 = false;
      }
    },
    cleanup: () => {
      if (_0x3b715c) {
        clearTimeout(_0x3b715c);
        _0x3b715c = null;
      }
      _0x2b72f3 = false;
      _0x2fcc91 = false;
    }
  };
  return _0x3c2d03;
}