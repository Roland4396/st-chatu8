export class ImageSteganography {
  constructor() {
    this.MIME_TYPE = "data:image/png;base64,";
  }
  async encode(_0x4d96e7) {
    try {
      const _0x467c3d = JSON.stringify(_0x4d96e7);
      const _0x4572ce = this.stringToBase64(_0x467c3d);
      const _0x19ecf9 = this.MIME_TYPE + _0x4572ce;
      return _0x19ecf9;
    } catch (_0x422d1e) {
      console.error("[Stego] 编码失败:", _0x422d1e);
      throw _0x422d1e;
    }
  }
  async decode(_0xa508f5) {
    try {
      let _0x288f82 = _0xa508f5;
      if (_0x288f82.startsWith(this.MIME_TYPE)) {
        _0x288f82 = _0x288f82.substring(this.MIME_TYPE.length);
      } else if (_0x288f82.startsWith("data:")) {
        const _0x386e34 = _0x288f82.indexOf(",");
        if (_0x386e34 !== -1) {
          _0x288f82 = _0x288f82.substring(_0x386e34 + 1);
        }
      }
      const _0x1ca0b9 = this.base64ToString(_0x288f82);
      const _0x2a192c = JSON.parse(_0x1ca0b9);
      return _0x2a192c;
    } catch (_0x48aa73) {
      console.error("[Stego] 解码失败:", _0x48aa73);
      throw _0x48aa73;
    }
  }
  stringToBase64(_0xe63ad3) {
    const _0x5e1321 = new TextEncoder();
    const _0x50afbc = _0x5e1321.encode(_0xe63ad3);
    return this.uint8ArrayToBase64(_0x50afbc);
  }
  base64ToString(_0xc36871) {
    const _0x48b625 = this.base64ToUint8Array(_0xc36871);
    const _0x59f6e3 = new TextDecoder();
    return _0x59f6e3.decode(_0x48b625);
  }
  uint8ArrayToBase64(_0x4230e3) {
    let _0x1ce097 = "";
    const _0x1a3555 = _0x4230e3.byteLength;
    for (let _0x44f2ad = 0; _0x44f2ad < _0x1a3555; _0x44f2ad++) {
      _0x1ce097 += String.fromCharCode(_0x4230e3[_0x44f2ad]);
    }
    return window.btoa(_0x1ce097);
  }
  base64ToUint8Array(_0x560a36) {
    const _0x345d64 = window.atob(_0x560a36);
    const _0xa313f8 = _0x345d64.length;
    const _0x29bf88 = new Uint8Array(_0xa313f8);
    for (let _0x471273 = 0; _0x471273 < _0xa313f8; _0x471273++) {
      _0x29bf88[_0x471273] = _0x345d64.charCodeAt(_0x471273);
    }
    return _0x29bf88;
  }
  async verify(_0x1e4df3) {
    try {
      await this.decode(_0x1e4df3);
      return true;
    } catch {
      return false;
    }
  }
}