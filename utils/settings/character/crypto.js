import { stylishConfirm } from "../../ui_common.js";
export function encryptBase64(_0xe3123b) {
  if (!_0xe3123b) {
    return "";
  }
  try {
    return btoa(unescape(encodeURIComponent(_0xe3123b)));
  } catch (_0x3a71a3) {
    console.error("Base64 加密失败:", _0x3a71a3);
    return _0xe3123b;
  }
}
export function decryptBase64(_0xdc7611) {
  if (!_0xdc7611) {
    return "";
  }
  try {
    return decodeURIComponent(escape(atob(_0xdc7611)));
  } catch (_0x162a69) {
    console.error("Base64 解密失败:", _0x162a69);
    return _0xdc7611;
  }
}
export function encryptObjectFields(_0x265d2c, _0x288b85) {
  const _0x140d0a = JSON.parse(JSON.stringify(_0x265d2c));
  _0x288b85.forEach(_0x125bda => {
    if (_0x140d0a[_0x125bda]) {
      _0x140d0a[_0x125bda] = encryptBase64(_0x140d0a[_0x125bda]);
    }
  });
  return _0x140d0a;
}
export function decryptObjectFields(_0x48daf9, _0x3aa023) {
  const _0x218dd8 = JSON.parse(JSON.stringify(_0x48daf9));
  _0x3aa023.forEach(_0x5d5261 => {
    _0x218dd8[_0x5d5261] &&= decryptBase64(_0x218dd8[_0x5d5261]);
  });
  return _0x218dd8;
}
export function encryptCharacterPreset(_0x159109) {
  const _0x4ac4ca = ["nameCN", "nameEN", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack"];
  const _0x5d10d5 = encryptObjectFields(_0x159109, _0x4ac4ca);
  if (_0x159109.outfits && Array.isArray(_0x159109.outfits)) {
    _0x5d10d5.outfits = _0x159109.outfits.map(_0x3682f9 => encryptBase64(_0x3682f9));
  }
  return _0x5d10d5;
}
export function decryptCharacterPreset(_0x2e702e) {
  const _0xf38d14 = ["nameCN", "nameEN", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack"];
  const _0x3499db = decryptObjectFields(_0x2e702e, _0xf38d14);
  if (_0x2e702e.outfits && Array.isArray(_0x2e702e.outfits)) {
    _0x3499db.outfits = _0x2e702e.outfits.map(_0x311266 => decryptBase64(_0x311266));
  }
  return _0x3499db;
}
export function encryptOutfitPreset(_0x50ee52) {
  const _0x4c82e2 = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  return encryptObjectFields(_0x50ee52, _0x4c82e2);
}
export function decryptOutfitPreset(_0x344ba7) {
  const _0x1dcdb5 = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  return decryptObjectFields(_0x344ba7, _0x1dcdb5);
}
export function encryptListPreset(_0x39a5b4, _0x6f1635) {
  const _0x1699c8 = JSON.parse(JSON.stringify(_0x39a5b4));
  if (_0x39a5b4[_0x6f1635] && Array.isArray(_0x39a5b4[_0x6f1635])) {
    _0x1699c8[_0x6f1635] = _0x39a5b4[_0x6f1635].map(_0x5b73e3 => encryptBase64(_0x5b73e3));
  }
  return _0x1699c8;
}
export function decryptListPreset(_0x14969d, _0x26e95e) {
  const _0x226600 = JSON.parse(JSON.stringify(_0x14969d));
  if (_0x14969d[_0x26e95e] && Array.isArray(_0x14969d[_0x26e95e])) {
    _0x226600[_0x26e95e] = _0x14969d[_0x26e95e].map(_0x54a33e => decryptBase64(_0x54a33e));
  }
  return _0x226600;
}
export function isEncryptedData(_0x51af60) {
  return _0x51af60 && _0x51af60._encrypted === true;
}
export function encryptPresetNames(_0xaacbc4, _0x199d27) {
  const _0xbe4fb4 = {};
  const _0x12552b = {};
  let _0x43667e = 1;
  for (const _0x3ae446 in _0xaacbc4) {
    const _0x4aa7af = "" + _0x199d27 + String(_0x43667e).padStart(3, "0");
    _0xbe4fb4[_0x4aa7af] = _0x3ae446;
    _0x12552b[_0x4aa7af] = _0xaacbc4[_0x3ae446];
    _0x43667e++;
  }
  const _0x47d9dd = {
    encryptedPresets: _0x12552b,
    nameMap: _0xbe4fb4
  };
  return _0x47d9dd;
}
export function decryptPresetNames(_0x8e11e5, _0x48e8fe) {
  const _0x20a56c = {};
  for (const _0x3c2281 in _0x8e11e5) {
    const _0x4055f1 = _0x48e8fe[_0x3c2281];
    if (_0x4055f1) {
      _0x20a56c[_0x4055f1] = _0x8e11e5[_0x3c2281];
    }
  }
  return _0x20a56c;
}
export function replaceNameReferences(_0x1503cd, _0x4afa4d) {
  if (Array.isArray(_0x1503cd)) {
    return _0x1503cd.map(_0x3ee87b => {
      if (typeof _0x3ee87b === "string" && _0x4afa4d[_0x3ee87b]) {
        return _0x4afa4d[_0x3ee87b];
      }
      return replaceNameReferences(_0x3ee87b, _0x4afa4d);
    });
  } else if (_0x1503cd && typeof _0x1503cd === "object") {
    const _0x284902 = {};
    for (const _0x3ff2c6 in _0x1503cd) {
      _0x284902[_0x3ff2c6] = replaceNameReferences(_0x1503cd[_0x3ff2c6], _0x4afa4d);
    }
    return _0x284902;
  }
  return _0x1503cd;
}
export function restoreNameReferences(_0x571eb2, _0x5bdaa7) {
  if (Array.isArray(_0x571eb2)) {
    return _0x571eb2.map(_0x3cb071 => {
      if (typeof _0x3cb071 === "string" && _0x5bdaa7[_0x3cb071]) {
        return _0x5bdaa7[_0x3cb071];
      }
      return restoreNameReferences(_0x3cb071, _0x5bdaa7);
    });
  } else if (_0x571eb2 && typeof _0x571eb2 === "object") {
    const _0x189d67 = {};
    for (const _0x535899 in _0x571eb2) {
      _0x189d67[_0x535899] = restoreNameReferences(_0x571eb2[_0x535899], _0x5bdaa7);
    }
    return _0x189d67;
  }
  return _0x571eb2;
}
export async function encryptExportData(_0x1759ff) {
  const _0x12790b = await stylishConfirm("是否对导出内容进行 Base64 加密保护?\n\n加密后可防止文本编辑器直接查看敏感内容。");
  if (_0x12790b) {
    const _0x270d29 = {};
    const _0x7a3bb3 = {};
    const _0x1f633c = {};
    if (_0x1759ff.characters) {
      const {
        encryptedPresets: _0x3fdeb5,
        nameMap: _0xb9be04
      } = encryptPresetNames(_0x1759ff.characters, "CHAR_");
      _0x270d29.characters = _0xb9be04;
      for (const _0x1524aa in _0xb9be04) {
        _0x7a3bb3[_0xb9be04[_0x1524aa]] = _0x1524aa;
      }
    }
    if (_0x1759ff.outfits) {
      const {
        encryptedPresets: _0x5903f6,
        nameMap: _0x14821b
      } = encryptPresetNames(_0x1759ff.outfits, "OUTFIT_");
      _0x270d29.outfits = _0x14821b;
      for (const _0x8e1fd in _0x14821b) {
        _0x1f633c[_0x14821b[_0x8e1fd]] = _0x8e1fd;
      }
    }
    if (_0x1759ff.characters) {
      const {
        encryptedPresets: _0x413322,
        nameMap: _0x3616b5
      } = encryptPresetNames(_0x1759ff.characters, "CHAR_");
      const _0x225274 = {};
      for (const _0x1fa148 in _0x413322) {
        const _0x3f91f1 = _0x413322[_0x1fa148];
        let _0x17cd50 = encryptCharacterPreset(_0x3f91f1);
        if (_0x17cd50.outfits && _0x17cd50.outfits.length > 0) {
          _0x17cd50.outfits = _0x17cd50.outfits.map(_0x10fa12 => {
            const _0x1aba77 = decryptBase64(_0x10fa12);
            const _0x25ea9c = _0x1f633c[_0x1aba77] || _0x1aba77;
            return encryptBase64(_0x25ea9c);
          });
        }
        _0x225274[_0x1fa148] = _0x17cd50;
      }
      _0x1759ff.characters = _0x225274;
    }
    if (_0x1759ff.outfits) {
      const {
        encryptedPresets: _0x2aaa6f
      } = encryptPresetNames(_0x1759ff.outfits, "OUTFIT_");
      const _0x27748d = {};
      for (const _0x26c34d in _0x2aaa6f) {
        _0x27748d[_0x26c34d] = encryptOutfitPreset(_0x2aaa6f[_0x26c34d]);
      }
      _0x1759ff.outfits = _0x27748d;
    }
    if (_0x1759ff.characterEnablePresets) {
      const {
        encryptedPresets: _0x234c2c,
        nameMap: _0x4b9075
      } = encryptPresetNames(_0x1759ff.characterEnablePresets, "CHAR_EN_");
      _0x270d29.characterEnablePresets = _0x4b9075;
      const _0xe27946 = {};
      for (const _0x344430 in _0x234c2c) {
        const _0x4d7edb = _0x234c2c[_0x344430];
        let _0x2c59a5 = encryptListPreset(_0x4d7edb, "characters");
        _0x2c59a5.characters &&= _0x2c59a5.characters.map(_0x3c2d46 => {
          const _0x2cd69f = decryptBase64(_0x3c2d46);
          return encryptBase64(_0x7a3bb3[_0x2cd69f] || _0x2cd69f);
        });
        _0xe27946[_0x344430] = _0x2c59a5;
      }
      _0x1759ff.characterEnablePresets = _0xe27946;
    }
    if (_0x1759ff.outfitEnablePresets) {
      const {
        encryptedPresets: _0x2c46f5,
        nameMap: _0x37643e
      } = encryptPresetNames(_0x1759ff.outfitEnablePresets, "OUTFIT_EN_");
      _0x270d29.outfitEnablePresets = _0x37643e;
      const _0x4a9d05 = {};
      for (const _0x51030f in _0x2c46f5) {
        const _0x3f0ab1 = _0x2c46f5[_0x51030f];
        let _0x296f31 = encryptListPreset(_0x3f0ab1, "outfits");
        _0x296f31.outfits &&= _0x296f31.outfits.map(_0x257f7b => {
          const _0xe34f02 = decryptBase64(_0x257f7b);
          return encryptBase64(_0x1f633c[_0xe34f02] || _0xe34f02);
        });
        _0x4a9d05[_0x51030f] = _0x296f31;
      }
      _0x1759ff.outfitEnablePresets = _0x4a9d05;
    }
    if (_0x1759ff.characterCommonPresets) {
      const {
        encryptedPresets: _0x13ed4f,
        nameMap: _0x3afae1
      } = encryptPresetNames(_0x1759ff.characterCommonPresets, "CHAR_COM_");
      _0x270d29.characterCommonPresets = _0x3afae1;
      const _0x4678ae = {};
      for (const _0x221ec1 in _0x13ed4f) {
        const _0x14df1b = _0x13ed4f[_0x221ec1];
        let _0x35ac97 = encryptListPreset(_0x14df1b, "characters");
        _0x35ac97.characters &&= _0x35ac97.characters.map(_0x1bcec7 => {
          const _0x4864e1 = decryptBase64(_0x1bcec7);
          return encryptBase64(_0x7a3bb3[_0x4864e1] || _0x4864e1);
        });
        _0x4678ae[_0x221ec1] = _0x35ac97;
      }
      _0x1759ff.characterCommonPresets = _0x4678ae;
    }
    _0x1759ff._nameMap = encryptBase64(JSON.stringify(_0x270d29));
    _0x1759ff._encrypted = true;
    _0x1759ff._version = "1.0";
  }
  return _0x1759ff;
}
export function decryptImportData(_0x5e09b4) {
  if (!isEncryptedData(_0x5e09b4)) {
    console.log("[Character] 导入数据未加密,直接返回");
    return _0x5e09b4;
  }
  console.log("[Character] 检测到加密数据,开始解密...");
  const _0x3907cc = JSON.parse(JSON.stringify(_0x5e09b4));
  let _0x3d5e78 = {};
  if (_0x3907cc._nameMap) {
    try {
      _0x3d5e78 = JSON.parse(decryptBase64(_0x3907cc._nameMap));
      console.log("[Character] 名称映射表解密成功");
    } catch (_0x1831c8) {
      console.error("[Character] 名称映射表解密失败:", _0x1831c8);
    }
  }
  const _0x336e73 = {};
  const _0xa2cce8 = {};
  if (_0x3d5e78.characters) {
    for (const _0x4626ae in _0x3d5e78.characters) {
      _0x336e73[_0x4626ae] = _0x3d5e78.characters[_0x4626ae];
    }
  }
  if (_0x3d5e78.outfits) {
    for (const _0x41073f in _0x3d5e78.outfits) {
      _0xa2cce8[_0x41073f] = _0x3d5e78.outfits[_0x41073f];
    }
  }
  if (_0x3907cc.characters) {
    const _0x1ad235 = {};
    for (const _0x5bbee5 in _0x3907cc.characters) {
      const _0x590c75 = _0x3d5e78.characters ? _0x3d5e78.characters[_0x5bbee5] : _0x5bbee5;
      let _0x21bbb8 = decryptCharacterPreset(_0x3907cc.characters[_0x5bbee5]);
      if (_0x21bbb8.outfits && _0x21bbb8.outfits.length > 0) {
        _0x21bbb8.outfits = _0x21bbb8.outfits.map(_0x34b13b => _0xa2cce8[_0x34b13b] || _0x34b13b);
      }
      _0x1ad235[_0x590c75] = _0x21bbb8;
    }
    _0x3907cc.characters = _0x1ad235;
  }
  if (_0x3907cc.outfits) {
    const _0x1f71fe = {};
    for (const _0x467a0b in _0x3907cc.outfits) {
      const _0x588ccd = _0x3d5e78.outfits ? _0x3d5e78.outfits[_0x467a0b] : _0x467a0b;
      _0x1f71fe[_0x588ccd] = decryptOutfitPreset(_0x3907cc.outfits[_0x467a0b]);
    }
    _0x3907cc.outfits = _0x1f71fe;
  }
  if (_0x3907cc.characterEnablePresets) {
    const _0x3a2731 = {};
    for (const _0x4e6ab7 in _0x3907cc.characterEnablePresets) {
      const _0x3aed35 = _0x3d5e78.characterEnablePresets ? _0x3d5e78.characterEnablePresets[_0x4e6ab7] : _0x4e6ab7;
      let _0x4b85bf = decryptListPreset(_0x3907cc.characterEnablePresets[_0x4e6ab7], "characters");
      _0x4b85bf.characters &&= _0x4b85bf.characters.map(_0xfd9790 => _0x336e73[_0xfd9790] || _0xfd9790);
      _0x3a2731[_0x3aed35] = _0x4b85bf;
    }
    _0x3907cc.characterEnablePresets = _0x3a2731;
  }
  if (_0x3907cc.outfitEnablePresets) {
    const _0x25ef19 = {};
    for (const _0x17bbac in _0x3907cc.outfitEnablePresets) {
      const _0x1e6143 = _0x3d5e78.outfitEnablePresets ? _0x3d5e78.outfitEnablePresets[_0x17bbac] : _0x17bbac;
      let _0x40693d = decryptListPreset(_0x3907cc.outfitEnablePresets[_0x17bbac], "outfits");
      _0x40693d.outfits &&= _0x40693d.outfits.map(_0x510432 => _0xa2cce8[_0x510432] || _0x510432);
      _0x25ef19[_0x1e6143] = _0x40693d;
    }
    _0x3907cc.outfitEnablePresets = _0x25ef19;
  }
  if (_0x3907cc.characterCommonPresets) {
    const _0x154315 = {};
    for (const _0x24353a in _0x3907cc.characterCommonPresets) {
      const _0x382a3d = _0x3d5e78.characterCommonPresets ? _0x3d5e78.characterCommonPresets[_0x24353a] : _0x24353a;
      let _0x4cebf0 = decryptListPreset(_0x3907cc.characterCommonPresets[_0x24353a], "characters");
      _0x4cebf0.characters &&= _0x4cebf0.characters.map(_0x4769da => _0x336e73[_0x4769da] || _0x4769da);
      _0x154315[_0x382a3d] = _0x4cebf0;
    }
    _0x3907cc.characterCommonPresets = _0x154315;
  }
  delete _0x3907cc._encrypted;
  delete _0x3907cc._version;
  delete _0x3907cc._nameMap;
  console.log("[Character] 数据解密完成");
  return _0x3907cc;
}