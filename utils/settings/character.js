import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { defaultCharacterSettings } from "../character_config.js";
import { stylInput, stylishConfirm } from "../ui_common.js";
import { dbs } from "../database.js";
let isCharacterInitialized = false;
function encryptBase64(_0x4b08c4) {
  if (!_0x4b08c4) {
    return "";
  }
  try {
    return btoa(unescape(encodeURIComponent(_0x4b08c4)));
  } catch (_0x9e7b12) {
    console.error("Base64 加密失败:", _0x9e7b12);
    return _0x4b08c4;
  }
}
function decryptBase64(_0x1a6341) {
  if (!_0x1a6341) {
    return "";
  }
  try {
    return decodeURIComponent(escape(atob(_0x1a6341)));
  } catch (_0x3c10a7) {
    console.error("Base64 解密失败:", _0x3c10a7);
    return _0x1a6341;
  }
}
function encryptObjectFields(_0x1c40aa, _0x1c2619) {
  const _0x8e0d8b = JSON.parse(JSON.stringify(_0x1c40aa));
  _0x1c2619.forEach(_0x5e376a => {
    _0x8e0d8b[_0x5e376a] &&= encryptBase64(_0x8e0d8b[_0x5e376a]);
  });
  return _0x8e0d8b;
}
function decryptObjectFields(_0x2e6784, _0x88d708) {
  const _0xde0eaa = JSON.parse(JSON.stringify(_0x2e6784));
  _0x88d708.forEach(_0x29bab7 => {
    _0xde0eaa[_0x29bab7] &&= decryptBase64(_0xde0eaa[_0x29bab7]);
  });
  return _0xde0eaa;
}
function encryptCharacterPreset(_0x2e9872) {
  const _0x17161a = ["nameCN", "nameEN", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack"];
  const _0x5b8106 = encryptObjectFields(_0x2e9872, _0x17161a);
  if (_0x2e9872.outfits && Array.isArray(_0x2e9872.outfits)) {
    _0x5b8106.outfits = _0x2e9872.outfits.map(_0xe0b82a => encryptBase64(_0xe0b82a));
  }
  return _0x5b8106;
}
function decryptCharacterPreset(_0x3134de) {
  const _0x4a3603 = ["nameCN", "nameEN", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack"];
  const _0x305eab = decryptObjectFields(_0x3134de, _0x4a3603);
  if (_0x3134de.outfits && Array.isArray(_0x3134de.outfits)) {
    _0x305eab.outfits = _0x3134de.outfits.map(_0x55f4e3 => decryptBase64(_0x55f4e3));
  }
  return _0x305eab;
}
function encryptOutfitPreset(_0x4ecb52) {
  const _0x26e94f = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  return encryptObjectFields(_0x4ecb52, _0x26e94f);
}
function decryptOutfitPreset(_0x29f42b) {
  const _0x47353c = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  return decryptObjectFields(_0x29f42b, _0x47353c);
}
function encryptListPreset(_0x52b8fc, _0x2ca788) {
  const _0x25e32e = JSON.parse(JSON.stringify(_0x52b8fc));
  if (_0x52b8fc[_0x2ca788] && Array.isArray(_0x52b8fc[_0x2ca788])) {
    _0x25e32e[_0x2ca788] = _0x52b8fc[_0x2ca788].map(_0x4025aa => encryptBase64(_0x4025aa));
  }
  return _0x25e32e;
}
function decryptListPreset(_0x992f41, _0x564db0) {
  const _0x28152e = JSON.parse(JSON.stringify(_0x992f41));
  if (_0x992f41[_0x564db0] && Array.isArray(_0x992f41[_0x564db0])) {
    _0x28152e[_0x564db0] = _0x992f41[_0x564db0].map(_0x564ac4 => decryptBase64(_0x564ac4));
  }
  return _0x28152e;
}
function isEncryptedData(_0x401af0) {
  return _0x401af0 && _0x401af0._encrypted === true;
}
function encryptPresetNames(_0x54879c, _0x5b3d3f) {
  const _0x54ecc6 = {};
  const _0x4346c5 = {};
  let _0x5a07b4 = 1;
  for (const _0x8e30cd in _0x54879c) {
    const _0x37428d = "" + _0x5b3d3f + String(_0x5a07b4).padStart(3, "0");
    _0x54ecc6[_0x37428d] = _0x8e30cd;
    _0x4346c5[_0x37428d] = _0x54879c[_0x8e30cd];
    _0x5a07b4++;
  }
  const _0x4a7cd3 = {
    encryptedPresets: _0x4346c5,
    nameMap: _0x54ecc6
  };
  return _0x4a7cd3;
}
function decryptPresetNames(_0x5155b7, _0x15c505) {
  const _0xfa8b80 = {};
  for (const _0x5b26f2 in _0x5155b7) {
    const _0x9be55 = _0x15c505[_0x5b26f2];
    if (_0x9be55) {
      _0xfa8b80[_0x9be55] = _0x5155b7[_0x5b26f2];
    }
  }
  return _0xfa8b80;
}
function replaceNameReferences(_0x58c0bc, _0x114e4e) {
  if (Array.isArray(_0x58c0bc)) {
    return _0x58c0bc.map(_0x1b6699 => {
      if (typeof _0x1b6699 === "string" && _0x114e4e[_0x1b6699]) {
        return _0x114e4e[_0x1b6699];
      }
      return replaceNameReferences(_0x1b6699, _0x114e4e);
    });
  } else if (_0x58c0bc && typeof _0x58c0bc === "object") {
    const _0x48953f = {};
    for (const _0x15368c in _0x58c0bc) {
      _0x48953f[_0x15368c] = replaceNameReferences(_0x58c0bc[_0x15368c], _0x114e4e);
    }
    return _0x48953f;
  }
  return _0x58c0bc;
}
function restoreNameReferences(_0x22859f, _0x3800d1) {
  if (Array.isArray(_0x22859f)) {
    return _0x22859f.map(_0x42cbf8 => {
      if (typeof _0x42cbf8 === "string" && _0x3800d1[_0x42cbf8]) {
        return _0x3800d1[_0x42cbf8];
      }
      return restoreNameReferences(_0x42cbf8, _0x3800d1);
    });
  } else if (_0x22859f && typeof _0x22859f === "object") {
    const _0x3e9d4c = {};
    for (const _0x1282c0 in _0x22859f) {
      _0x3e9d4c[_0x1282c0] = restoreNameReferences(_0x22859f[_0x1282c0], _0x3800d1);
    }
    return _0x3e9d4c;
  }
  return _0x22859f;
}
async function encryptExportData(_0xe92657) {
  const _0x3c9fb3 = await stylishConfirm("是否对导出内容进行 Base64 加密保护?\n\n加密后可防止文本编辑器直接查看敏感内容。");
  if (_0x3c9fb3) {
    const _0x1ca9ce = {};
    const _0xa8f5cd = {};
    const _0xb685a9 = {};
    if (_0xe92657.characters) {
      const {
        encryptedPresets: _0xd884b3,
        nameMap: _0x118b72
      } = encryptPresetNames(_0xe92657.characters, "CHAR_");
      _0x1ca9ce.characters = _0x118b72;
      for (const _0x2d281d in _0x118b72) {
        _0xa8f5cd[_0x118b72[_0x2d281d]] = _0x2d281d;
      }
    }
    if (_0xe92657.outfits) {
      const {
        encryptedPresets: _0xffd065,
        nameMap: _0x36705b
      } = encryptPresetNames(_0xe92657.outfits, "OUTFIT_");
      _0x1ca9ce.outfits = _0x36705b;
      for (const _0x407653 in _0x36705b) {
        _0xb685a9[_0x36705b[_0x407653]] = _0x407653;
      }
    }
    if (_0xe92657.characters) {
      const {
        encryptedPresets: _0x59e9b7,
        nameMap: _0x5d3af2
      } = encryptPresetNames(_0xe92657.characters, "CHAR_");
      const _0x46d6ea = {};
      for (const _0x4a328f in _0x59e9b7) {
        const _0x373a01 = _0x59e9b7[_0x4a328f];
        let _0x40d2f8 = encryptCharacterPreset(_0x373a01);
        if (_0x40d2f8.outfits && _0x40d2f8.outfits.length > 0) {
          _0x40d2f8.outfits = _0x40d2f8.outfits.map(_0x368cee => {
            const _0x5ecf82 = decryptBase64(_0x368cee);
            const _0x204c37 = _0xb685a9[_0x5ecf82] || _0x5ecf82;
            return encryptBase64(_0x204c37);
          });
        }
        _0x46d6ea[_0x4a328f] = _0x40d2f8;
      }
      _0xe92657.characters = _0x46d6ea;
    }
    if (_0xe92657.outfits) {
      const {
        encryptedPresets: _0x4dd221
      } = encryptPresetNames(_0xe92657.outfits, "OUTFIT_");
      const _0x461370 = {};
      for (const _0x2022f4 in _0x4dd221) {
        _0x461370[_0x2022f4] = encryptOutfitPreset(_0x4dd221[_0x2022f4]);
      }
      _0xe92657.outfits = _0x461370;
    }
    if (_0xe92657.characterEnablePresets) {
      const {
        encryptedPresets: _0x59703c,
        nameMap: _0x31c1ec
      } = encryptPresetNames(_0xe92657.characterEnablePresets, "CHAR_EN_");
      _0x1ca9ce.characterEnablePresets = _0x31c1ec;
      const _0x58e48d = {};
      for (const _0x5829c2 in _0x59703c) {
        const _0x503a7f = _0x59703c[_0x5829c2];
        let _0x743156 = encryptListPreset(_0x503a7f, "characters");
        if (_0x743156.characters) {
          _0x743156.characters = _0x743156.characters.map(_0x447554 => {
            const _0x34eb6f = decryptBase64(_0x447554);
            return encryptBase64(_0xa8f5cd[_0x34eb6f] || _0x34eb6f);
          });
        }
        _0x58e48d[_0x5829c2] = _0x743156;
      }
      _0xe92657.characterEnablePresets = _0x58e48d;
    }
    if (_0xe92657.outfitEnablePresets) {
      const {
        encryptedPresets: _0x831ab9,
        nameMap: _0x1a4bc6
      } = encryptPresetNames(_0xe92657.outfitEnablePresets, "OUTFIT_EN_");
      _0x1ca9ce.outfitEnablePresets = _0x1a4bc6;
      const _0x1c5d86 = {};
      for (const _0x114824 in _0x831ab9) {
        const _0x1cc08a = _0x831ab9[_0x114824];
        let _0x1cd7fc = encryptListPreset(_0x1cc08a, "outfits");
        if (_0x1cd7fc.outfits) {
          _0x1cd7fc.outfits = _0x1cd7fc.outfits.map(_0x451c40 => {
            const _0x13e52f = decryptBase64(_0x451c40);
            return encryptBase64(_0xb685a9[_0x13e52f] || _0x13e52f);
          });
        }
        _0x1c5d86[_0x114824] = _0x1cd7fc;
      }
      _0xe92657.outfitEnablePresets = _0x1c5d86;
    }
    if (_0xe92657.characterCommonPresets) {
      const {
        encryptedPresets: _0x5bc1e2,
        nameMap: _0x347f01
      } = encryptPresetNames(_0xe92657.characterCommonPresets, "CHAR_COM_");
      _0x1ca9ce.characterCommonPresets = _0x347f01;
      const _0x50b204 = {};
      for (const _0x445df5 in _0x5bc1e2) {
        const _0x2388c5 = _0x5bc1e2[_0x445df5];
        let _0x5901ae = encryptListPreset(_0x2388c5, "characters");
        _0x5901ae.characters &&= _0x5901ae.characters.map(_0x575c0a => {
          const _0x26648e = decryptBase64(_0x575c0a);
          return encryptBase64(_0xa8f5cd[_0x26648e] || _0x26648e);
        });
        _0x50b204[_0x445df5] = _0x5901ae;
      }
      _0xe92657.characterCommonPresets = _0x50b204;
    }
    _0xe92657._nameMap = encryptBase64(JSON.stringify(_0x1ca9ce));
    _0xe92657._encrypted = true;
    _0xe92657._version = "1.0";
  }
  return _0xe92657;
}
function decryptImportData(_0x493e78) {
  if (!isEncryptedData(_0x493e78)) {
    console.log("[Character] 导入数据未加密,直接返回");
    return _0x493e78;
  }
  console.log("[Character] 检测到加密数据,开始解密...");
  const _0x3c0a69 = JSON.parse(JSON.stringify(_0x493e78));
  let _0xc02b94 = {};
  if (_0x3c0a69._nameMap) {
    try {
      _0xc02b94 = JSON.parse(decryptBase64(_0x3c0a69._nameMap));
      console.log("[Character] 名称映射表解密成功");
    } catch (_0x551766) {
      console.error("[Character] 名称映射表解密失败:", _0x551766);
    }
  }
  const _0x2c7964 = {};
  const _0x49dc3a = {};
  if (_0xc02b94.characters) {
    for (const _0x3ba5ea in _0xc02b94.characters) {
      _0x2c7964[_0x3ba5ea] = _0xc02b94.characters[_0x3ba5ea];
    }
  }
  if (_0xc02b94.outfits) {
    for (const _0x1aa1f9 in _0xc02b94.outfits) {
      _0x49dc3a[_0x1aa1f9] = _0xc02b94.outfits[_0x1aa1f9];
    }
  }
  if (_0x3c0a69.characters) {
    const _0x368573 = {};
    for (const _0x2647e5 in _0x3c0a69.characters) {
      const _0xb65b93 = _0xc02b94.characters ? _0xc02b94.characters[_0x2647e5] : _0x2647e5;
      let _0x20ce92 = decryptCharacterPreset(_0x3c0a69.characters[_0x2647e5]);
      if (_0x20ce92.outfits && _0x20ce92.outfits.length > 0) {
        _0x20ce92.outfits = _0x20ce92.outfits.map(_0x1df394 => _0x49dc3a[_0x1df394] || _0x1df394);
      }
      _0x368573[_0xb65b93] = _0x20ce92;
    }
    _0x3c0a69.characters = _0x368573;
  }
  if (_0x3c0a69.outfits) {
    const _0x16e7eb = {};
    for (const _0x394661 in _0x3c0a69.outfits) {
      const _0x48a76b = _0xc02b94.outfits ? _0xc02b94.outfits[_0x394661] : _0x394661;
      _0x16e7eb[_0x48a76b] = decryptOutfitPreset(_0x3c0a69.outfits[_0x394661]);
    }
    _0x3c0a69.outfits = _0x16e7eb;
  }
  if (_0x3c0a69.characterEnablePresets) {
    const _0xf3524a = {};
    for (const _0xda9fcb in _0x3c0a69.characterEnablePresets) {
      const _0x3f5073 = _0xc02b94.characterEnablePresets ? _0xc02b94.characterEnablePresets[_0xda9fcb] : _0xda9fcb;
      let _0xa4d071 = decryptListPreset(_0x3c0a69.characterEnablePresets[_0xda9fcb], "characters");
      if (_0xa4d071.characters) {
        _0xa4d071.characters = _0xa4d071.characters.map(_0x3f8d5d => _0x2c7964[_0x3f8d5d] || _0x3f8d5d);
      }
      _0xf3524a[_0x3f5073] = _0xa4d071;
    }
    _0x3c0a69.characterEnablePresets = _0xf3524a;
  }
  if (_0x3c0a69.outfitEnablePresets) {
    const _0x30eca7 = {};
    for (const _0x5c44bd in _0x3c0a69.outfitEnablePresets) {
      const _0x5530c6 = _0xc02b94.outfitEnablePresets ? _0xc02b94.outfitEnablePresets[_0x5c44bd] : _0x5c44bd;
      let _0x1278e0 = decryptListPreset(_0x3c0a69.outfitEnablePresets[_0x5c44bd], "outfits");
      _0x1278e0.outfits &&= _0x1278e0.outfits.map(_0x220a0e => _0x49dc3a[_0x220a0e] || _0x220a0e);
      _0x30eca7[_0x5530c6] = _0x1278e0;
    }
    _0x3c0a69.outfitEnablePresets = _0x30eca7;
  }
  if (_0x3c0a69.characterCommonPresets) {
    const _0x157e36 = {};
    for (const _0x55f5bf in _0x3c0a69.characterCommonPresets) {
      const _0x4e818d = _0xc02b94.characterCommonPresets ? _0xc02b94.characterCommonPresets[_0x55f5bf] : _0x55f5bf;
      let _0x18a2bd = decryptListPreset(_0x3c0a69.characterCommonPresets[_0x55f5bf], "characters");
      _0x18a2bd.characters &&= _0x18a2bd.characters.map(_0x4e7d05 => _0x2c7964[_0x4e7d05] || _0x4e7d05);
      _0x157e36[_0x4e818d] = _0x18a2bd;
    }
    _0x3c0a69.characterCommonPresets = _0x157e36;
  }
  delete _0x3c0a69._encrypted;
  delete _0x3c0a69._version;
  delete _0x3c0a69._nameMap;
  console.log("[Character] 数据解密完成");
  return _0x3c0a69;
}
export function initCharacterSettings(_0x5c327d) {
  console.log("[Character] Initializing character settings...");
  ensureCharacterSettings();
  if (!isCharacterInitialized) {
    setupSubNavigation(_0x5c327d);
    setupCharacterControls(_0x5c327d);
    setupOutfitControls(_0x5c327d);
    setupCharacterEnableControls(_0x5c327d);
    setupOutfitEnableControls(_0x5c327d);
    setupCharacterCommonControls(_0x5c327d);
    setupBananaCharacterControls(_0x5c327d);
    initTagAutocomplete();
    isCharacterInitialized = true;
  }
  console.log("[Character] Character settings initialized");
}
export function refreshCharacterSettings(_0x5d0928) {
  console.log("[Character] Refreshing character settings...");
  ensureCharacterSettings();
  loadCharacterPresetList();
  loadCharacterPreset();
  loadOutfitPresetList();
  loadOutfitPreset();
  loadCharacterEnablePresetList();
  loadCharacterEnablePreset();
  loadCharacterSelector();
  loadOutfitEnablePresetList();
  loadOutfitEnablePreset();
  loadOutfitEnableSelector();
  loadCharacterCommonPresetList();
  loadCharacterCommonPreset();
  loadCharacterCommonSelector();
  loadBananaCharacterPresetList();
  loadBananaCharacterPreset();
  resetSubNavigation(_0x5d0928);
  console.log("[Character] Character settings refreshed");
}
function resetSubNavigation(_0x39162c) {
  const _0x964fc9 = _0x39162c.find(".st-chatu8-sub-nav-link");
  const _0x3a1f7c = _0x964fc9.first();
  if (_0x3a1f7c.length > 0) {
    _0x964fc9.removeClass("active");
    _0x3a1f7c.addClass("active");
    const _0x42488e = _0x3a1f7c.data("sub-tab");
    _0x39162c.find(".st-chatu8-sub-tab-content").css("display", "none");
    _0x39162c.find("#" + _0x42488e).css("display", "block");
  }
}
function ensureCharacterSettings() {
  const _0x3b800d = extension_settings[extensionName];
  if (!_0x3b800d.characterPresets) {
    _0x3b800d.characterPresets = JSON.parse(JSON.stringify(defaultCharacterSettings.characterPresets));
  }
  if (!_0x3b800d.characterPresetId) {
    _0x3b800d.characterPresetId = defaultCharacterSettings.characterPresetId;
  }
  if (!_0x3b800d.outfitPresets) {
    _0x3b800d.outfitPresets = JSON.parse(JSON.stringify(defaultCharacterSettings.outfitPresets));
  }
  if (!_0x3b800d.outfitPresetId) {
    _0x3b800d.outfitPresetId = defaultCharacterSettings.outfitPresetId;
  }
  if (!_0x3b800d.characterAI) {
    _0x3b800d.characterAI = JSON.parse(JSON.stringify(defaultCharacterSettings.characterAI));
  }
  if (!_0x3b800d.outfitAI) {
    _0x3b800d.outfitAI = JSON.parse(JSON.stringify(defaultCharacterSettings.outfitAI));
  }
  if (!_0x3b800d.characterEnablePresets) {
    _0x3b800d.characterEnablePresets = JSON.parse(JSON.stringify(defaultCharacterSettings.characterEnablePresets));
  }
  if (!_0x3b800d.characterEnablePresetId) {
    _0x3b800d.characterEnablePresetId = defaultCharacterSettings.characterEnablePresetId;
  }
  if (!_0x3b800d.outfitEnablePresets) {
    _0x3b800d.outfitEnablePresets = JSON.parse(JSON.stringify(defaultCharacterSettings.outfitEnablePresets));
  }
  if (!_0x3b800d.outfitEnablePresetId) {
    _0x3b800d.outfitEnablePresetId = defaultCharacterSettings.outfitEnablePresetId;
  }
  if (!_0x3b800d.characterCommonPresets) {
    _0x3b800d.characterCommonPresets = JSON.parse(JSON.stringify(defaultCharacterSettings.characterCommonPresets));
  }
  if (!_0x3b800d.characterCommonPresetId) {
    _0x3b800d.characterCommonPresetId = defaultCharacterSettings.characterCommonPresetId;
  }
  if (!_0x3b800d.bananaCharacterPresets) {
    _0x3b800d.bananaCharacterPresets = {
      默认: {
        triggers: "触发词1|触发词2",
        conversation: {
          user: {
            text: "",
            image: ""
          },
          model: {
            text: "",
            image: ""
          }
        }
      }
    };
  }
  if (!_0x3b800d.bananaCharacterPresetId) {
    _0x3b800d.bananaCharacterPresetId = "默认";
  }
}
function setupSubNavigation(_0x29bee1) {
  _0x29bee1.find(".st-chatu8-sub-nav-link").off("click").on("click", function (_0xefcdc1) {
    _0xefcdc1.preventDefault();
    const _0x78d21c = $(this).data("sub-tab");
    _0x29bee1.find(".st-chatu8-sub-nav-link").removeClass("active");
    $(this).addClass("active");
    _0x29bee1.find(".st-chatu8-sub-tab-content").css("display", "none");
    _0x29bee1.find("#" + _0x78d21c).css("display", "block");
  });
  const _0x3ed72f = _0x29bee1.find(".st-chatu8-sub-nav-link");
  const _0x72d7ec = _0x3ed72f.first();
  if (_0x72d7ec.length > 0) {
    _0x3ed72f.removeClass("active");
    _0x72d7ec.addClass("active");
    const _0x37c319 = _0x72d7ec.data("sub-tab");
    _0x29bee1.find(".st-chatu8-sub-tab-content").css("display", "none");
    _0x29bee1.find("#" + _0x37c319).css("display", "block");
  }
}
function setupCharacterControls(_0x3f6a51) {
  const _0x4e94f2 = extension_settings[extensionName];
  loadCharacterPresetList();
  _0x3f6a51.find("#character_preset_id").on("change", loadCharacterPreset);
  _0x3f6a51.find("#character_update").on("click", updateCharacterPreset);
  _0x3f6a51.find("#character_save_as").on("click", saveCharacterPresetAs);
  _0x3f6a51.find("#character_export").on("click", exportCharacterPreset);
  _0x3f6a51.find("#character_export_all").on("click", exportAllCharacterPresets);
  _0x3f6a51.find("#character_import").on("click", importCharacterPreset);
  _0x3f6a51.find("#character_delete").on("click", deleteCharacterPreset);
  _0x3f6a51.find("#char_outfit_check").on("click", checkCharacterOutfitList);
  _0x3f6a51.find("#char_outfit_add").on("click", addOutfitFromSelector);
  _0x3f6a51.find("#char_outfit_refresh").on("click", loadCharacterOutfitSelector);
  _0x3f6a51.find("#char_replace_brackets").on("click", replaceEnglishBrackets);
  bindCharacterFieldListeners();
  loadCharacterPreset();
}
function setupOutfitControls(_0x441c9a) {
  const _0x7ff08f = extension_settings[extensionName];
  loadOutfitPresetList();
  _0x441c9a.find("#outfit_preset_id").on("change", loadOutfitPreset);
  _0x441c9a.find("#outfit_update").on("click", updateOutfitPreset);
  _0x441c9a.find("#outfit_save_as").on("click", saveOutfitPresetAs);
  _0x441c9a.find("#outfit_export").on("click", exportOutfitPreset);
  _0x441c9a.find("#outfit_export_all").on("click", exportAllOutfitPresets);
  _0x441c9a.find("#outfit_import").on("click", importOutfitPreset);
  _0x441c9a.find("#outfit_delete").on("click", deleteOutfitPreset);
  _0x441c9a.find("#outfit_replace_brackets").on("click", replaceOutfitEnglishBrackets);
  bindOutfitFieldListeners();
  loadOutfitPreset();
}
function loadCharacterPresetList() {
  const _0xf0e003 = extension_settings[extensionName];
  const _0x12ead1 = document.getElementById("character_preset_id");
  if (!_0x12ead1) {
    return;
  }
  _0x12ead1.innerHTML = "";
  for (const _0x3f0828 in _0xf0e003.characterPresets) {
    const _0x44a3a0 = document.createElement("option");
    _0x44a3a0.value = _0x3f0828;
    _0x44a3a0.textContent = _0x3f0828;
    _0x12ead1.add(_0x44a3a0);
  }
  _0x12ead1.value = _0xf0e003.characterPresetId;
}
function loadCharacterPreset() {
  const _0x32e0c7 = extension_settings[extensionName];
  const _0x33d315 = document.getElementById("character_preset_id");
  if (!_0x33d315) {
    return;
  }
  const _0x5422f7 = _0x33d315.value;
  const _0x2290dc = _0x32e0c7.characterPresetId;
  if (_0x2290dc && _0x2290dc !== _0x5422f7) {
    const _0x322f2c = _0x32e0c7.characterPresets[_0x2290dc] || {};
    const _0x4d3ed5 = ["nameCN", "nameEN", "facialFeatures", "upperBodySFW", "fullBodySFW", "upperBodyNSFW", "fullBodyNSFW"];
    let _0x5c1c58 = false;
    for (const _0x4eee34 of _0x4d3ed5) {
      const _0xe453bd = document.getElementById("char_" + _0x4eee34);
      if (_0xe453bd && _0xe453bd.value !== (_0x322f2c[_0x4eee34] || "")) {
        _0x5c1c58 = true;
        break;
      }
    }
    if (_0x5c1c58) {
      stylishConfirm("您有未保存的角色数据。要放弃这些更改并切换预设吗？").then(_0x389cf5 => {
        if (_0x389cf5) {
          _0x32e0c7.characterPresetId = _0x5422f7;
          loadCharacterPresetData(_0x5422f7);
          saveSettingsDebounced();
        } else {
          _0x33d315.value = _0x2290dc;
        }
      });
      return;
    }
  }
  _0x32e0c7.characterPresetId = _0x5422f7;
  loadCharacterPresetData(_0x5422f7);
  saveSettingsDebounced();
}
function loadCharacterPresetData(_0x480a8e) {
  const _0x30e4de = extension_settings[extensionName];
  const _0x2b6433 = _0x30e4de.characterPresets[_0x480a8e];
  if (!_0x2b6433) {
    return;
  }
  const _0x472574 = ["nameCN", "nameEN", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack"];
  _0x472574.forEach(_0x58d997 => {
    const _0x2c99c4 = document.getElementById("char_" + _0x58d997);
    if (_0x2c99c4) {
      _0x2c99c4.value = _0x2b6433[_0x58d997] || "";
      const _0x4d7018 = _0x2c99c4.closest(".st-chatu8-field-col")?.querySelector(".st-chatu8-unsaved-warning");
      if (_0x4d7018) {
        $(_0x4d7018).hide();
      }
    }
  });
  const _0x4a730d = document.getElementById("char_outfit_list");
  if (_0x4a730d) {
    _0x4a730d.value = (_0x2b6433.outfits || []).join("\n");
  }
  loadCharacterOutfitSelector();
}
function updateCharacterPreset() {
  const _0xb03205 = extension_settings[extensionName];
  const _0x5ec8ec = _0xb03205.characterPresetId;
  if (!_0x5ec8ec || !_0xb03205.characterPresets[_0x5ec8ec]) {
    alert("没有活动的角色预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前角色预设 \"" + _0x5ec8ec + "\" 吗？").then(_0x127b1e => {
    if (_0x127b1e) {
      saveCurrentCharacterData(_0x5ec8ec);
      alert("角色预设 \"" + _0x5ec8ec + "\" 已更新。");
    }
  });
}
function saveCharacterPresetAs() {
  stylInput("请输入新角色预设的名称").then(_0x12f189 => {
    if (_0x12f189 && _0x12f189.trim() !== "") {
      const _0x22c388 = extension_settings[extensionName];
      saveCurrentCharacterData(_0x12f189);
      _0x22c388.characterPresetId = _0x12f189;
      loadCharacterPresetList();
      alert("角色预设 \"" + _0x12f189 + "\" 已保存。");
    }
  });
}
function saveCurrentCharacterData(_0x10cf40) {
  const _0x4cd589 = extension_settings[extensionName];
  const _0x15905e = {};
  const _0x450753 = ["nameCN", "nameEN", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack"];
  _0x450753.forEach(_0x45dc77 => {
    const _0x3e20e6 = document.getElementById("char_" + _0x45dc77);
    if (_0x3e20e6) {
      _0x15905e[_0x45dc77] = _0x3e20e6.value || "";
    }
  });
  const _0x586379 = document.getElementById("char_outfit_list");
  if (_0x586379) {
    _0x15905e.outfits = _0x586379.value.split("\n").map(_0x56b7fd => _0x56b7fd.trim()).filter(_0x5ba275 => _0x5ba275.length > 0);
  } else {
    _0x15905e.outfits = [];
  }
  _0x4cd589.characterPresets[_0x10cf40] = _0x15905e;
  saveSettingsDebounced();
}
function deleteCharacterPreset() {
  const _0x2c3923 = extension_settings[extensionName];
  const _0x259d57 = document.getElementById("character_preset_id")?.value;
  if (_0x259d57 === "默认角色") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该角色预设").then(_0x232a86 => {
    if (_0x232a86) {
      delete _0x2c3923.characterPresets[_0x259d57];
      _0x2c3923.characterPresetId = "默认角色";
      loadCharacterPresetList();
      loadCharacterPreset();
      saveSettingsDebounced();
    }
  });
}
async function exportCharacterPreset() {
  const _0x56614e = extension_settings[extensionName];
  const _0x59d0e6 = _0x56614e.characterPresetId;
  const _0x43ee50 = _0x56614e.characterPresets[_0x59d0e6];
  if (!_0x43ee50) {
    alert("没有选中的角色预设可导出。");
    return;
  }
  const _0x1b166f = _0x43ee50.outfits || [];
  const _0x355aa3 = {
    [_0x59d0e6]: _0x43ee50
  };
  const _0x1dd1bd = {
    characters: _0x355aa3
  };
  let _0x3a6018 = _0x1dd1bd;
  if (_0x1b166f.length > 0) {
    const _0x103d18 = "检测到该角色包含 " + _0x1b166f.length + " 个服装:\n" + _0x1b166f.join("\n") + "\n\n是否一起导出相关服装?";
    const _0x40e040 = await stylishConfirm(_0x103d18);
    if (_0x40e040) {
      _0x3a6018.outfits = {};
      _0x1b166f.forEach(_0xc932e1 => {
        if (_0x56614e.outfitPresets[_0xc932e1]) {
          _0x3a6018.outfits[_0xc932e1] = _0x56614e.outfitPresets[_0xc932e1];
        }
      });
    }
  }
  _0x3a6018 = await encryptExportData(_0x3a6018);
  const _0x3a20c3 = JSON.stringify(_0x3a6018, null, 2);
  const _0x57ef99 = new Blob([_0x3a20c3], {
    type: "application/json"
  });
  const _0x5567f2 = URL.createObjectURL(_0x57ef99);
  const _0xfabcab = document.createElement("a");
  _0xfabcab.href = _0x5567f2;
  _0xfabcab.download = "st-chatu8-角色-" + _0x59d0e6 + ".json";
  document.body.appendChild(_0xfabcab);
  _0xfabcab.click();
  document.body.removeChild(_0xfabcab);
  URL.revokeObjectURL(_0x5567f2);
}
async function exportAllCharacterPresets() {
  const _0x1a6d7e = extension_settings[extensionName];
  if (!_0x1a6d7e.characterPresets || Object.keys(_0x1a6d7e.characterPresets).length === 0) {
    alert("没有角色预设可导出。");
    return;
  }
  const _0x1ed09a = new Set();
  for (const _0x8cff54 in _0x1a6d7e.characterPresets) {
    const _0x21c930 = _0x1a6d7e.characterPresets[_0x8cff54];
    const _0x392232 = _0x21c930.outfits || [];
    _0x392232.forEach(_0x552e86 => _0x1ed09a.add(_0x552e86));
  }
  const _0x14eff7 = {
    characters: _0x1a6d7e.characterPresets
  };
  let _0x51c86e = _0x14eff7;
  if (_0x1ed09a.size > 0) {
    const _0x2253b3 = "检测到所有角色共包含 " + _0x1ed09a.size + " 个不同的服装:\n" + Array.from(_0x1ed09a).join("\n") + "\n\n是否一起导出相关服装?";
    const _0x235f34 = await stylishConfirm(_0x2253b3);
    if (_0x235f34) {
      _0x51c86e.outfits = {};
      _0x1ed09a.forEach(_0x2c1944 => {
        if (_0x1a6d7e.outfitPresets[_0x2c1944]) {
          _0x51c86e.outfits[_0x2c1944] = _0x1a6d7e.outfitPresets[_0x2c1944];
        }
      });
    }
  }
  _0x51c86e = await encryptExportData(_0x51c86e);
  const _0x184b75 = JSON.stringify(_0x51c86e, null, 2);
  const _0x41ccb2 = new Blob([_0x184b75], {
    type: "application/json"
  });
  const _0x5390fb = URL.createObjectURL(_0x41ccb2);
  const _0x119bf0 = document.createElement("a");
  _0x119bf0.href = _0x5390fb;
  _0x119bf0.download = "st-chatu8-角色-全部.json";
  document.body.appendChild(_0x119bf0);
  _0x119bf0.click();
  document.body.removeChild(_0x119bf0);
  URL.revokeObjectURL(_0x5390fb);
}
function importCharacterPreset() {
  const _0x5b415a = extension_settings[extensionName];
  const _0x2477f8 = document.createElement("input");
  _0x2477f8.type = "file";
  _0x2477f8.accept = ".json";
  _0x2477f8.onchange = async _0x430cda => {
    const _0x49634d = _0x430cda.target.files[0];
    if (!_0x49634d) {
      return;
    }
    const _0x2895ac = new FileReader();
    _0x2895ac.onload = async _0x2bd2bf => {
      try {
        let _0x19e6e7 = JSON.parse(_0x2bd2bf.target.result);
        _0x19e6e7 = decryptImportData(_0x19e6e7);
        let _0xca9541 = {};
        let _0x38ca24 = {};
        if (_0x19e6e7.characters) {
          _0xca9541 = _0x19e6e7.characters;
          _0x38ca24 = _0x19e6e7.outfits || {};
        } else {
          _0xca9541 = _0x19e6e7;
        }
        let _0x35304e = false;
        if (Object.keys(_0x38ca24).length > 0) {
          const _0x2bac9a = Object.keys(_0x38ca24);
          const _0x5a195e = "检测到 " + _0x2bac9a.length + " 个相关服装:\n" + _0x2bac9a.join("\n") + "\n\n是否一起导入?";
          _0x35304e = await stylishConfirm(_0x5a195e);
        }
        let _0x1f4e35 = 0;
        for (const _0x46b619 in _0xca9541) {
          if (_0xca9541.hasOwnProperty(_0x46b619)) {
            if (!_0x5b415a.characterPresets.hasOwnProperty(_0x46b619)) {
              _0x1f4e35++;
            }
            _0x5b415a.characterPresets[_0x46b619] = _0xca9541[_0x46b619];
          }
        }
        let _0x5de3ae = 0;
        if (_0x35304e) {
          for (const _0x1ce08b in _0x38ca24) {
            if (_0x38ca24.hasOwnProperty(_0x1ce08b)) {
              if (!_0x5b415a.outfitPresets.hasOwnProperty(_0x1ce08b)) {
                _0x5de3ae++;
              }
              _0x5b415a.outfitPresets[_0x1ce08b] = _0x38ca24[_0x1ce08b];
            }
          }
        }
        saveSettingsDebounced();
        loadCharacterPresetList();
        if (_0x35304e) {
          loadOutfitPresetList();
        }
        const _0x3bbbe9 = Object.keys(_0xca9541)[0];
        if (_0x3bbbe9) {
          _0x5b415a.characterPresetId = _0x3bbbe9;
          const _0x5be204 = document.getElementById("character_preset_id");
          if (_0x5be204) {
            _0x5be204.value = _0x3bbbe9;
          }
          loadCharacterPresetData(_0x3bbbe9);
        }
        let _0x548000 = "成功导入 " + Object.keys(_0xca9541).length + " 个角色预设，其中 " + _0x1f4e35 + " 个是全新的。";
        if (_0x35304e) {
          _0x548000 += "\n同时导入 " + Object.keys(_0x38ca24).length + " 个服装预设，其中 " + _0x5de3ae + " 个是全新的。";
        }
        alert(_0x548000);
      } catch (_0x5778b9) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x5778b9.message);
        console.error("Error importing character presets:", _0x5778b9);
      }
    };
    _0x2895ac.readAsText(_0x49634d);
  };
  _0x2477f8.click();
}
function bindCharacterFieldListeners() {
  const _0x58aa7d = ["nameCN", "nameEN", "facialFeatures", "upperBodySFW", "fullBodySFW", "upperBodyNSFW", "fullBodyNSFW"];
  _0x58aa7d.forEach(_0x1e80db => {
    const _0x2d6411 = document.getElementById("char_" + _0x1e80db);
    if (_0x2d6411) {
      $(_0x2d6411).on("input", function () {
        const _0x14e774 = extension_settings[extensionName];
        const _0x44678f = _0x14e774.characterPresetId;
        const _0x387860 = _0x14e774.characterPresets[_0x44678f] || {};
        const _0x41fbe6 = $(this).val() !== (_0x387860[_0x1e80db] || "");
        const _0x82b295 = $(this).closest(".st-chatu8-field-col").find(".st-chatu8-unsaved-warning");
        if (_0x41fbe6) {
          $(_0x82b295).show();
        } else {
          $(_0x82b295).hide();
        }
      });
    }
  });
}
function loadOutfitPresetList() {
  const _0x2ec983 = extension_settings[extensionName];
  const _0x49495e = document.getElementById("outfit_preset_id");
  if (!_0x49495e) {
    return;
  }
  _0x49495e.innerHTML = "";
  for (const _0x292e18 in _0x2ec983.outfitPresets) {
    const _0x354323 = document.createElement("option");
    _0x354323.value = _0x292e18;
    _0x354323.textContent = _0x292e18;
    _0x49495e.add(_0x354323);
  }
  _0x49495e.value = _0x2ec983.outfitPresetId;
}
function loadOutfitPreset() {
  const _0x3fda4c = extension_settings[extensionName];
  const _0x36d5e2 = document.getElementById("outfit_preset_id");
  if (!_0x36d5e2) {
    return;
  }
  const _0x23bdbf = _0x36d5e2.value;
  const _0x5e152d = _0x3fda4c.outfitPresetId;
  if (_0x5e152d && _0x5e152d !== _0x23bdbf) {
    const _0x37c148 = _0x3fda4c.outfitPresets[_0x5e152d] || {};
    const _0x5d922e = ["nameCN", "nameEN", "upperBody", "fullBody"];
    let _0x3bde82 = false;
    for (const _0x216bcf of _0x5d922e) {
      const _0x3e59b2 = document.getElementById("outfit_" + _0x216bcf);
      if (_0x3e59b2 && _0x3e59b2.value !== (_0x37c148[_0x216bcf] || "")) {
        _0x3bde82 = true;
        break;
      }
    }
    if (_0x3bde82) {
      stylishConfirm("您有未保存的服装数据。要放弃这些更改并切换预设吗？").then(_0x31d670 => {
        if (_0x31d670) {
          _0x3fda4c.outfitPresetId = _0x23bdbf;
          loadOutfitPresetData(_0x23bdbf);
          saveSettingsDebounced();
        } else {
          _0x36d5e2.value = _0x5e152d;
        }
      });
      return;
    }
  }
  _0x3fda4c.outfitPresetId = _0x23bdbf;
  loadOutfitPresetData(_0x23bdbf);
  saveSettingsDebounced();
}
function loadOutfitPresetData(_0x1e4f65) {
  const _0x3fb019 = extension_settings[extensionName];
  const _0x2bf068 = _0x3fb019.outfitPresets[_0x1e4f65];
  if (!_0x2bf068) {
    return;
  }
  const _0x36acf3 = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  _0x36acf3.forEach(_0x11f4cc => {
    const _0x3c719c = document.getElementById("outfit_" + _0x11f4cc);
    if (_0x3c719c) {
      _0x3c719c.value = _0x2bf068[_0x11f4cc] || "";
      const _0x141f03 = _0x3c719c.closest(".st-chatu8-field-col")?.querySelector(".st-chatu8-unsaved-warning");
      if (_0x141f03) {
        $(_0x141f03).hide();
      }
    }
  });
}
function updateOutfitPreset() {
  const _0x597fe3 = extension_settings[extensionName];
  const _0x492ef5 = _0x597fe3.outfitPresetId;
  if (!_0x492ef5 || !_0x597fe3.outfitPresets[_0x492ef5]) {
    alert("没有活动的服装预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前服装预设 \"" + _0x492ef5 + "\" 吗？").then(_0x154c34 => {
    if (_0x154c34) {
      saveCurrentOutfitData(_0x492ef5);
      alert("服装预设 \"" + _0x492ef5 + "\" 已更新。");
    }
  });
}
function saveOutfitPresetAs() {
  stylInput("请输入新服装预设的名称").then(_0x3dcd7a => {
    if (_0x3dcd7a && _0x3dcd7a.trim() !== "") {
      const _0x19751a = extension_settings[extensionName];
      saveCurrentOutfitData(_0x3dcd7a);
      _0x19751a.outfitPresetId = _0x3dcd7a;
      loadOutfitPresetList();
      alert("服装预设 \"" + _0x3dcd7a + "\" 已保存。");
    }
  });
}
function saveCurrentOutfitData(_0x3161a0) {
  const _0x3dc561 = extension_settings[extensionName];
  const _0x324e95 = {};
  const _0x43e3a6 = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  _0x43e3a6.forEach(_0x39be45 => {
    const _0x3e17d8 = document.getElementById("outfit_" + _0x39be45);
    if (_0x3e17d8) {
      _0x324e95[_0x39be45] = _0x3e17d8.value || "";
    }
  });
  _0x3dc561.outfitPresets[_0x3161a0] = _0x324e95;
  saveSettingsDebounced();
}
function deleteOutfitPreset() {
  const _0x4a51a4 = extension_settings[extensionName];
  const _0x286ded = document.getElementById("outfit_preset_id")?.value;
  if (_0x286ded === "默认服装") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该服装预设").then(_0x5a5b1c => {
    if (_0x5a5b1c) {
      delete _0x4a51a4.outfitPresets[_0x286ded];
      _0x4a51a4.outfitPresetId = "默认服装";
      loadOutfitPresetList();
      loadOutfitPreset();
      saveSettingsDebounced();
    }
  });
}
async function exportOutfitPreset() {
  const _0x115c2b = extension_settings[extensionName];
  const _0x511dd3 = _0x115c2b.outfitPresetId;
  const _0x354989 = _0x115c2b.outfitPresets[_0x511dd3];
  if (!_0x354989) {
    alert("没有选中的服装预设可导出。");
    return;
  }
  const _0x47b613 = {
    [_0x511dd3]: _0x354989
  };
  const _0x580f54 = {
    outfits: _0x47b613
  };
  let _0x589b84 = _0x580f54;
  _0x589b84 = await encryptExportData(_0x589b84);
  const _0x4a3d16 = JSON.stringify(_0x589b84, null, 2);
  const _0xd033c8 = new Blob([_0x4a3d16], {
    type: "application/json"
  });
  const _0x533b10 = URL.createObjectURL(_0xd033c8);
  const _0x55d4e5 = document.createElement("a");
  _0x55d4e5.href = _0x533b10;
  _0x55d4e5.download = "st-chatu8-服装-" + _0x511dd3 + ".json";
  document.body.appendChild(_0x55d4e5);
  _0x55d4e5.click();
  document.body.removeChild(_0x55d4e5);
  URL.revokeObjectURL(_0x533b10);
}
async function exportAllOutfitPresets() {
  const _0x3727c7 = extension_settings[extensionName];
  if (!_0x3727c7.outfitPresets || Object.keys(_0x3727c7.outfitPresets).length === 0) {
    alert("没有服装预设可导出。");
    return;
  }
  const _0x3eda95 = new Set(Object.keys(_0x3727c7.outfitPresets));
  const _0x10b1d2 = {};
  for (const _0x18204d in _0x3727c7.characterPresets) {
    const _0x273a0b = _0x3727c7.characterPresets[_0x18204d];
    const _0x2b42f0 = _0x273a0b.outfits || [];
    const _0x3af1e0 = _0x2b42f0.some(_0x4cb8e3 => _0x3eda95.has(_0x4cb8e3));
    if (_0x3af1e0) {
      _0x10b1d2[_0x18204d] = _0x273a0b;
    }
  }
  const _0x1d44d4 = {
    outfits: _0x3727c7.outfitPresets
  };
  let _0x43cf42 = _0x1d44d4;
  if (Object.keys(_0x10b1d2).length > 0) {
    const _0x467427 = "检测到 " + Object.keys(_0x10b1d2).length + " 个角色使用了这些服装:\n" + Object.keys(_0x10b1d2).join("\n") + "\n\n是否一起导出相关角色?";
    const _0x325d01 = await stylishConfirm(_0x467427);
    if (_0x325d01) {
      _0x43cf42.characters = _0x10b1d2;
    }
  }
  _0x43cf42 = await encryptExportData(_0x43cf42);
  const _0x56fb9 = JSON.stringify(_0x43cf42, null, 2);
  const _0x39953e = new Blob([_0x56fb9], {
    type: "application/json"
  });
  const _0x35fde = URL.createObjectURL(_0x39953e);
  const _0x2c4250 = document.createElement("a");
  _0x2c4250.href = _0x35fde;
  _0x2c4250.download = "st-chatu8-服装-全部.json";
  document.body.appendChild(_0x2c4250);
  _0x2c4250.click();
  document.body.removeChild(_0x2c4250);
  URL.revokeObjectURL(_0x35fde);
}
function importOutfitPreset() {
  const _0x106162 = extension_settings[extensionName];
  const _0x11c0a2 = document.createElement("input");
  _0x11c0a2.type = "file";
  _0x11c0a2.accept = ".json";
  _0x11c0a2.onchange = _0x3ce334 => {
    const _0x163828 = _0x3ce334.target.files[0];
    if (!_0x163828) {
      return;
    }
    const _0x5e2c76 = new FileReader();
    _0x5e2c76.onload = _0x46bee1 => {
      try {
        let _0x2b2a13 = JSON.parse(_0x46bee1.target.result);
        _0x2b2a13 = decryptImportData(_0x2b2a13);
        let _0xd47127 = {};
        if (_0x2b2a13.outfits) {
          _0xd47127 = _0x2b2a13.outfits;
        } else {
          _0xd47127 = _0x2b2a13;
        }
        let _0x485986 = 0;
        for (const _0x1bd4f7 in _0xd47127) {
          if (_0xd47127.hasOwnProperty(_0x1bd4f7)) {
            if (!_0x106162.outfitPresets.hasOwnProperty(_0x1bd4f7)) {
              _0x485986++;
            }
            _0x106162.outfitPresets[_0x1bd4f7] = _0xd47127[_0x1bd4f7];
          }
        }
        saveSettingsDebounced();
        loadOutfitPresetList();
        const _0x2ea0c8 = Object.keys(_0xd47127)[0];
        if (_0x2ea0c8) {
          _0x106162.outfitPresetId = _0x2ea0c8;
          const _0x2b18da = document.getElementById("outfit_preset_id");
          if (_0x2b18da) {
            _0x2b18da.value = _0x2ea0c8;
          }
          loadOutfitPresetData(_0x2ea0c8);
        }
        alert("成功导入 " + Object.keys(_0xd47127).length + " 个服装预设，其中 " + _0x485986 + " 个是全新的。");
      } catch (_0x5a8598) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x5a8598.message);
        console.error("Error importing outfit presets:", _0x5a8598);
      }
    };
    _0x5e2c76.readAsText(_0x163828);
  };
  _0x11c0a2.click();
}
function bindOutfitFieldListeners() {
  const _0x3359a0 = ["nameCN", "nameEN", "upperBody", "fullBody"];
  _0x3359a0.forEach(_0x358d16 => {
    const _0x5aa597 = document.getElementById("outfit_" + _0x358d16);
    if (_0x5aa597) {
      $(_0x5aa597).on("input", function () {
        const _0x5e11da = extension_settings[extensionName];
        const _0x575b49 = _0x5e11da.outfitPresetId;
        const _0x5c1b95 = _0x5e11da.outfitPresets[_0x575b49] || {};
        const _0x48d2b8 = $(this).val() !== (_0x5c1b95[_0x358d16] || "");
        const _0x3e719d = $(this).closest(".st-chatu8-field-col").find(".st-chatu8-unsaved-warning");
        if (_0x48d2b8) {
          $(_0x3e719d).show();
        } else {
          $(_0x3e719d).hide();
        }
      });
    }
  });
}
function setupCharacterEnableControls(_0x4208cd) {
  loadCharacterEnablePresetList();
  _0x4208cd.find("#character_enable_preset_id").on("change", loadCharacterEnablePreset);
  _0x4208cd.find("#character_enable_update").on("click", updateCharacterEnablePreset);
  _0x4208cd.find("#character_enable_save_as").on("click", saveCharacterEnablePresetAs);
  _0x4208cd.find("#character_enable_export").on("click", exportCharacterEnablePreset);
  _0x4208cd.find("#character_enable_export_all").on("click", exportAllCharacterEnablePresets);
  _0x4208cd.find("#character_enable_import").on("click", importCharacterEnablePreset);
  _0x4208cd.find("#character_enable_delete").on("click", deleteCharacterEnablePreset);
  _0x4208cd.find("#character_enable_check").on("click", checkCharacterList);
  _0x4208cd.find("#character_enable_add").on("click", addCharacterFromSelector);
  _0x4208cd.find("#character_enable_refresh").on("click", loadCharacterSelector);
  loadCharacterEnablePreset();
  loadCharacterSelector();
}
function loadCharacterEnablePresetList() {
  const _0x4415c4 = extension_settings[extensionName];
  const _0x2f6dba = document.getElementById("character_enable_preset_id");
  if (!_0x2f6dba) {
    return;
  }
  _0x2f6dba.innerHTML = "";
  for (const _0x2ec7a6 in _0x4415c4.characterEnablePresets) {
    const _0x6e09c6 = document.createElement("option");
    _0x6e09c6.value = _0x2ec7a6;
    _0x6e09c6.textContent = _0x2ec7a6;
    _0x2f6dba.add(_0x6e09c6);
  }
  _0x2f6dba.value = _0x4415c4.characterEnablePresetId;
}
function loadCharacterEnablePreset() {
  const _0x590027 = extension_settings[extensionName];
  const _0xca9d60 = document.getElementById("character_enable_preset_id");
  if (!_0xca9d60) {
    return;
  }
  const _0x3311f2 = _0xca9d60.value;
  _0x590027.characterEnablePresetId = _0x3311f2;
  const _0x546592 = _0x590027.characterEnablePresets[_0x3311f2];
  const _0x4333a3 = document.getElementById("character_enable_list");
  if (_0x4333a3 && _0x546592) {
    _0x4333a3.value = (_0x546592.characters || []).join("\n");
  }
  saveSettingsDebounced();
}
function updateCharacterEnablePreset() {
  const _0x54dce8 = extension_settings[extensionName];
  const _0x32afb7 = _0x54dce8.characterEnablePresetId;
  if (!_0x32afb7 || !_0x54dce8.characterEnablePresets[_0x32afb7]) {
    alert("没有活动的角色启用预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前角色启用预设 \"" + _0x32afb7 + "\" 吗？").then(_0x339f88 => {
    if (_0x339f88) {
      saveCurrentCharacterEnableData(_0x32afb7);
      alert("角色启用预设 \"" + _0x32afb7 + "\" 已更新。");
    }
  });
}
function saveCharacterEnablePresetAs() {
  stylInput("请输入新角色启用预设的名称").then(_0x306ead => {
    if (_0x306ead && _0x306ead.trim() !== "") {
      const _0x1377e6 = extension_settings[extensionName];
      saveCurrentCharacterEnableData(_0x306ead);
      _0x1377e6.characterEnablePresetId = _0x306ead;
      loadCharacterEnablePresetList();
      alert("角色启用预设 \"" + _0x306ead + "\" 已保存。");
    }
  });
}
function saveCurrentCharacterEnableData(_0x22aaf7) {
  const _0x337084 = extension_settings[extensionName];
  const _0x19b8af = document.getElementById("character_enable_list");
  if (!_0x19b8af) {
    return;
  }
  const _0x1e0497 = _0x19b8af.value.split("\n").map(_0x133a24 => _0x133a24.trim()).filter(_0x413d96 => _0x413d96.length > 0);
  const _0x3206c3 = {
    characters: _0x1e0497
  };
  _0x337084.characterEnablePresets[_0x22aaf7] = _0x3206c3;
  saveSettingsDebounced();
}
function deleteCharacterEnablePreset() {
  const _0x44bf33 = extension_settings[extensionName];
  const _0x3277ed = document.getElementById("character_enable_preset_id")?.value;
  if (_0x3277ed === "默认启用列表") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该角色启用预设").then(_0x12d3de => {
    if (_0x12d3de) {
      delete _0x44bf33.characterEnablePresets[_0x3277ed];
      _0x44bf33.characterEnablePresetId = "默认启用列表";
      loadCharacterEnablePresetList();
      loadCharacterEnablePreset();
      saveSettingsDebounced();
    }
  });
}
async function exportCharacterEnablePreset() {
  const _0x20e453 = extension_settings[extensionName];
  const _0x34923e = _0x20e453.characterEnablePresetId;
  const _0x1f088b = _0x20e453.characterEnablePresets[_0x34923e];
  if (!_0x1f088b) {
    alert("没有选中的角色启用预设可导出。");
    return;
  }
  const _0x295f8d = _0x1f088b.characters || [];
  const _0x268bf3 = {
    [_0x34923e]: _0x1f088b
  };
  const _0x34924b = {
    characterEnablePresets: _0x268bf3
  };
  let _0x12ba09 = _0x34924b;
  if (_0x295f8d.length > 0) {
    const _0x5937a3 = "检测到该列表包含 " + _0x295f8d.length + " 个角色:\n" + _0x295f8d.join("\n") + "\n\n是否一起导出相关角色?";
    const _0x41feb8 = await stylishConfirm(_0x5937a3);
    if (_0x41feb8) {
      _0x12ba09.characters = {};
      _0x295f8d.forEach(_0x5b5828 => {
        if (_0x20e453.characterPresets[_0x5b5828]) {
          const _0x142f8 = _0x20e453.characterPresets[_0x5b5828];
          _0x12ba09.characters[_0x5b5828] = _0x142f8;
          const _0x4b7f81 = _0x142f8.outfits || [];
          if (_0x4b7f81.length > 0) {
            if (!_0x12ba09.outfits) {
              _0x12ba09.outfits = {};
            }
            _0x4b7f81.forEach(_0x35a54a => {
              if (_0x20e453.outfitPresets[_0x35a54a]) {
                _0x12ba09.outfits[_0x35a54a] = _0x20e453.outfitPresets[_0x35a54a];
              }
            });
          }
        }
      });
    }
  }
  _0x12ba09 = await encryptExportData(_0x12ba09);
  const _0xc389b4 = JSON.stringify(_0x12ba09, null, 2);
  const _0x58221c = new Blob([_0xc389b4], {
    type: "application/json"
  });
  const _0x45b4ea = URL.createObjectURL(_0x58221c);
  const _0x11a49f = document.createElement("a");
  _0x11a49f.href = _0x45b4ea;
  _0x11a49f.download = "st-chatu8-角色启用列表-" + _0x34923e + ".json";
  document.body.appendChild(_0x11a49f);
  _0x11a49f.click();
  document.body.removeChild(_0x11a49f);
  URL.revokeObjectURL(_0x45b4ea);
}
async function exportAllCharacterEnablePresets() {
  const _0xd0bc38 = extension_settings[extensionName];
  if (!_0xd0bc38.characterEnablePresets || Object.keys(_0xd0bc38.characterEnablePresets).length === 0) {
    alert("没有角色启用预设可导出。");
    return;
  }
  const _0x4aab88 = new Set();
  const _0x34996d = new Set();
  for (const _0x239b4a in _0xd0bc38.characterEnablePresets) {
    const _0x52ba80 = _0xd0bc38.characterEnablePresets[_0x239b4a];
    const _0x1da058 = _0x52ba80.characters || [];
    _0x1da058.forEach(_0x3a8078 => {
      _0x4aab88.add(_0x3a8078);
      if (_0xd0bc38.characterPresets[_0x3a8078]) {
        const _0xec0568 = _0xd0bc38.characterPresets[_0x3a8078].outfits || [];
        _0xec0568.forEach(_0x4ef54c => _0x34996d.add(_0x4ef54c));
      }
    });
  }
  const _0x2fb3c0 = {
    characterEnablePresets: _0xd0bc38.characterEnablePresets
  };
  let _0x29eb94 = _0x2fb3c0;
  if (_0x4aab88.size > 0) {
    const _0x5652dd = "检测到所有列表共包含 " + _0x4aab88.size + " 个不同的角色:\n" + Array.from(_0x4aab88).join("\n") + "\n\n是否一起导出相关角色?";
    const _0x586d38 = await stylishConfirm(_0x5652dd);
    if (_0x586d38) {
      _0x29eb94.characters = {};
      _0x4aab88.forEach(_0x218bfc => {
        if (_0xd0bc38.characterPresets[_0x218bfc]) {
          _0x29eb94.characters[_0x218bfc] = _0xd0bc38.characterPresets[_0x218bfc];
        }
      });
      if (_0x34996d.size > 0) {
        const _0x2ab926 = "同时检测到这些角色包含 " + _0x34996d.size + " 个不同的服装:\n" + Array.from(_0x34996d).join("\n") + "\n\n是否也一起导出?";
        const _0x2721eb = await stylishConfirm(_0x2ab926);
        if (_0x2721eb) {
          _0x29eb94.outfits = {};
          _0x34996d.forEach(_0x2c8d94 => {
            if (_0xd0bc38.outfitPresets[_0x2c8d94]) {
              _0x29eb94.outfits[_0x2c8d94] = _0xd0bc38.outfitPresets[_0x2c8d94];
            }
          });
        }
      }
    }
  }
  _0x29eb94 = await encryptExportData(_0x29eb94);
  const _0x370670 = JSON.stringify(_0x29eb94, null, 2);
  const _0x3973a5 = new Blob([_0x370670], {
    type: "application/json"
  });
  const _0x4234ac = URL.createObjectURL(_0x3973a5);
  const _0x16bb4c = document.createElement("a");
  _0x16bb4c.href = _0x4234ac;
  _0x16bb4c.download = "st-chatu8-角色启用列表-全部.json";
  document.body.appendChild(_0x16bb4c);
  _0x16bb4c.click();
  document.body.removeChild(_0x16bb4c);
  URL.revokeObjectURL(_0x4234ac);
}
function importCharacterEnablePreset() {
  const _0x2cc971 = extension_settings[extensionName];
  const _0x54012e = document.createElement("input");
  _0x54012e.type = "file";
  _0x54012e.accept = ".json";
  _0x54012e.onchange = async _0x4d003e => {
    const _0x2ebda5 = _0x4d003e.target.files[0];
    if (!_0x2ebda5) {
      return;
    }
    const _0x1f3206 = new FileReader();
    _0x1f3206.onload = async _0x2314b7 => {
      try {
        let _0x808494 = JSON.parse(_0x2314b7.target.result);
        _0x808494 = decryptImportData(_0x808494);
        let _0x125b8b = {};
        let _0x552f5a = {};
        let _0x3ae532 = {};
        if (_0x808494.characterEnablePresets) {
          _0x125b8b = _0x808494.characterEnablePresets;
          _0x552f5a = _0x808494.characters || {};
          _0x3ae532 = _0x808494.outfits || {};
        } else {
          _0x125b8b = _0x808494;
        }
        let _0x7f370f = false;
        if (Object.keys(_0x552f5a).length > 0) {
          const _0x3cea4a = Object.keys(_0x552f5a);
          const _0x53701c = "检测到 " + _0x3cea4a.length + " 个相关角色:\n" + _0x3cea4a.join("\n") + "\n\n是否一起导入?";
          _0x7f370f = await stylishConfirm(_0x53701c);
        }
        let _0x5ae35b = 0;
        for (const _0x3e3ea5 in _0x125b8b) {
          if (_0x125b8b.hasOwnProperty(_0x3e3ea5)) {
            if (!_0x2cc971.characterEnablePresets.hasOwnProperty(_0x3e3ea5)) {
              _0x5ae35b++;
            }
            _0x2cc971.characterEnablePresets[_0x3e3ea5] = _0x125b8b[_0x3e3ea5];
          }
        }
        let _0x24bdb6 = 0;
        let _0x43a3c9 = 0;
        if (_0x7f370f) {
          for (const _0x2a8002 in _0x552f5a) {
            if (_0x552f5a.hasOwnProperty(_0x2a8002)) {
              if (!_0x2cc971.characterPresets.hasOwnProperty(_0x2a8002)) {
                _0x24bdb6++;
              }
              _0x2cc971.characterPresets[_0x2a8002] = _0x552f5a[_0x2a8002];
            }
          }
          for (const _0x5f355c in _0x3ae532) {
            if (_0x3ae532.hasOwnProperty(_0x5f355c)) {
              if (!_0x2cc971.outfitPresets.hasOwnProperty(_0x5f355c)) {
                _0x43a3c9++;
              }
              _0x2cc971.outfitPresets[_0x5f355c] = _0x3ae532[_0x5f355c];
            }
          }
        }
        saveSettingsDebounced();
        loadCharacterEnablePresetList();
        if (_0x7f370f) {
          loadCharacterPresetList();
          loadOutfitPresetList();
        }
        const _0x56e7e2 = Object.keys(_0x125b8b)[0];
        if (_0x56e7e2) {
          _0x2cc971.characterEnablePresetId = _0x56e7e2;
          const _0x5f36bd = document.getElementById("character_enable_preset_id");
          if (_0x5f36bd) {
            _0x5f36bd.value = _0x56e7e2;
          }
          loadCharacterEnablePreset();
        }
        let _0xf3d70a = "成功导入 " + Object.keys(_0x125b8b).length + " 个角色启用预设，其中 " + _0x5ae35b + " 个是全新的。";
        if (_0x7f370f) {
          _0xf3d70a += "\n同时导入 " + Object.keys(_0x552f5a).length + " 个角色预设(" + _0x24bdb6 + " 个全新)";
          _0xf3d70a += "和 " + Object.keys(_0x3ae532).length + " 个服装预设(" + _0x43a3c9 + " 个全新)。";
        }
        alert(_0xf3d70a);
      } catch (_0x4e7aad) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x4e7aad.message);
        console.error("Error importing character enable presets:", _0x4e7aad);
      }
    };
    _0x1f3206.readAsText(_0x2ebda5);
  };
  _0x54012e.click();
}
function loadCharacterSelector() {
  const _0x5d7b8f = extension_settings[extensionName];
  const _0x6a46d4 = document.getElementById("character_enable_selector");
  if (!_0x6a46d4) {
    return;
  }
  _0x6a46d4.innerHTML = "<option value=\"\">-- 选择角色 --</option>";
  for (const _0x377673 in _0x5d7b8f.characterPresets) {
    const _0x2a61c2 = document.createElement("option");
    _0x2a61c2.value = _0x377673;
    _0x2a61c2.textContent = _0x377673;
    _0x6a46d4.add(_0x2a61c2);
  }
}
function addCharacterFromSelector() {
  const _0x161691 = document.getElementById("character_enable_selector");
  const _0x26a32a = document.getElementById("character_enable_list");
  if (!_0x161691 || !_0x26a32a) {
    return;
  }
  const _0x310687 = _0x161691.value;
  if (!_0x310687) {
    alert("请先选择一个角色");
    return;
  }
  const _0x20b860 = _0x26a32a.value.trim();
  const _0x1d83c9 = _0x20b860 ? _0x20b860.split("\n") : [];
  if (_0x1d83c9.includes(_0x310687)) {
    alert("该角色已在列表中");
    return;
  }
  _0x1d83c9.push(_0x310687);
  _0x26a32a.value = _0x1d83c9.join("\n");
}
function loadCharacterOutfitSelector() {
  const _0xf09514 = extension_settings[extensionName];
  const _0x144fb2 = document.getElementById("char_outfit_selector");
  if (!_0x144fb2) {
    return;
  }
  _0x144fb2.innerHTML = "<option value=\"\">-- 选择服装 --</option>";
  for (const _0x52136a in _0xf09514.outfitPresets) {
    const _0x4259c0 = document.createElement("option");
    _0x4259c0.value = _0x52136a;
    _0x4259c0.textContent = _0x52136a;
    _0x144fb2.add(_0x4259c0);
  }
}
function addOutfitFromSelector() {
  const _0x199c08 = document.getElementById("char_outfit_selector");
  const _0x3fff1a = document.getElementById("char_outfit_list");
  if (!_0x199c08 || !_0x3fff1a) {
    return;
  }
  const _0x558225 = _0x199c08.value;
  if (!_0x558225) {
    alert("请先选择一个服装");
    return;
  }
  const _0x263c33 = _0x3fff1a.value.trim();
  const _0x27e180 = _0x263c33 ? _0x263c33.split("\n") : [];
  if (_0x27e180.includes(_0x558225)) {
    alert("该服装已在列表中");
    return;
  }
  _0x27e180.push(_0x558225);
  _0x3fff1a.value = _0x27e180.join("\n");
}
function checkCharacterOutfitList() {
  const _0x30d8ec = extension_settings[extensionName];
  const _0x1a3c6b = document.getElementById("char_outfit_list");
  const _0x76b36f = document.getElementById("char_outfit_check_result");
  const _0x12730b = document.getElementById("char_outfit_check_content");
  if (!_0x1a3c6b || !_0x76b36f || !_0x12730b) {
    return;
  }
  const _0x5d9b12 = _0x1a3c6b.value.split("\n").map(_0x57f6bb => _0x57f6bb.trim()).filter(_0x9524a9 => _0x9524a9.length > 0);
  if (_0x5d9b12.length === 0) {
    alert("请先输入服装名称");
    return;
  }
  const _0x39aa0e = new Set();
  for (const _0x43d4ce in _0x30d8ec.outfitPresets) {
    _0x39aa0e.add(_0x43d4ce);
  }
  const _0x5830ab = {
    found: [],
    notFound: []
  };
  _0x5d9b12.forEach(_0x36493a => {
    if (_0x39aa0e.has(_0x36493a)) {
      _0x5830ab.found.push(_0x36493a);
    } else {
      _0x5830ab.notFound.push(_0x36493a);
    }
  });
  let _0x1acfa3 = "<div style=\"margin-bottom: 10px;\">";
  _0x1acfa3 += "<strong>总计：</strong>" + _0x5d9b12.length + " 个服装";
  _0x1acfa3 += "<br><strong>找到：</strong>" + _0x5830ab.found.length + " 个";
  _0x1acfa3 += "<br><strong>未找到：</strong>" + _0x5830ab.notFound.length + " 个";
  _0x1acfa3 += "</div>";
  if (_0x5830ab.found.length > 0) {
    _0x1acfa3 += "<div style=\"margin-bottom: 10px;\">";
    _0x1acfa3 += "<strong style=\"color: #28a745;\">✓ 已存在的服装：</strong>";
    _0x1acfa3 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x5830ab.found.forEach(_0x48e1d4 => {
      _0x1acfa3 += "<li>" + _0x48e1d4 + "</li>";
    });
    _0x1acfa3 += "</ul></div>";
  }
  if (_0x5830ab.notFound.length > 0) {
    _0x1acfa3 += "<div>";
    _0x1acfa3 += "<strong style=\"color: #dc3545;\">✗ 未找到的服装：</strong>";
    _0x1acfa3 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x5830ab.notFound.forEach(_0x2735d2 => {
      _0x1acfa3 += "<li>" + _0x2735d2 + "</li>";
    });
    _0x1acfa3 += "</ul></div>";
  }
  _0x12730b.innerHTML = _0x1acfa3;
  $(_0x76b36f).show();
}
function setupOutfitEnableControls(_0x59e415) {
  loadOutfitEnablePresetList();
  _0x59e415.find("#outfit_enable_preset_id").on("change", loadOutfitEnablePreset);
  _0x59e415.find("#outfit_enable_update").on("click", updateOutfitEnablePreset);
  _0x59e415.find("#outfit_enable_save_as").on("click", saveOutfitEnablePresetAs);
  _0x59e415.find("#outfit_enable_export").on("click", exportOutfitEnablePreset);
  _0x59e415.find("#outfit_enable_export_all").on("click", exportAllOutfitEnablePresets);
  _0x59e415.find("#outfit_enable_import").on("click", importOutfitEnablePreset);
  _0x59e415.find("#outfit_enable_delete").on("click", deleteOutfitEnablePreset);
  _0x59e415.find("#outfit_enable_check").on("click", checkOutfitEnableList);
  _0x59e415.find("#outfit_enable_add").on("click", addOutfitFromEnableSelector);
  _0x59e415.find("#outfit_enable_refresh").on("click", loadOutfitEnableSelector);
  loadOutfitEnablePreset();
  loadOutfitEnableSelector();
}
function loadOutfitEnablePresetList() {
  const _0x55a079 = extension_settings[extensionName];
  const _0x3a30b3 = document.getElementById("outfit_enable_preset_id");
  if (!_0x3a30b3) {
    return;
  }
  _0x3a30b3.innerHTML = "";
  for (const _0x2666cc in _0x55a079.outfitEnablePresets) {
    const _0x1b5d99 = document.createElement("option");
    _0x1b5d99.value = _0x2666cc;
    _0x1b5d99.textContent = _0x2666cc;
    _0x3a30b3.add(_0x1b5d99);
  }
  _0x3a30b3.value = _0x55a079.outfitEnablePresetId;
}
function loadOutfitEnablePreset() {
  const _0x49294c = extension_settings[extensionName];
  const _0x503d43 = document.getElementById("outfit_enable_preset_id");
  if (!_0x503d43) {
    return;
  }
  const _0x4bdcd9 = _0x503d43.value;
  _0x49294c.outfitEnablePresetId = _0x4bdcd9;
  const _0x5dd2a7 = _0x49294c.outfitEnablePresets[_0x4bdcd9];
  const _0x27d813 = document.getElementById("outfit_enable_list");
  if (_0x27d813 && _0x5dd2a7) {
    _0x27d813.value = (_0x5dd2a7.outfits || []).join("\n");
  }
  saveSettingsDebounced();
}
function updateOutfitEnablePreset() {
  const _0x2bddad = extension_settings[extensionName];
  const _0x1b3eb4 = _0x2bddad.outfitEnablePresetId;
  if (!_0x1b3eb4 || !_0x2bddad.outfitEnablePresets[_0x1b3eb4]) {
    alert("没有活动的通用服装列表预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前通用服装列表预设 \"" + _0x1b3eb4 + "\" 吗？").then(_0x3fbec1 => {
    if (_0x3fbec1) {
      saveCurrentOutfitEnableData(_0x1b3eb4);
      alert("通用服装列表预设 \"" + _0x1b3eb4 + "\" 已更新。");
    }
  });
}
function saveOutfitEnablePresetAs() {
  stylInput("请输入新通用服装列表预设的名称").then(_0x2a24a9 => {
    if (_0x2a24a9 && _0x2a24a9.trim() !== "") {
      const _0x55614d = extension_settings[extensionName];
      saveCurrentOutfitEnableData(_0x2a24a9);
      _0x55614d.outfitEnablePresetId = _0x2a24a9;
      loadOutfitEnablePresetList();
      alert("通用服装列表预设 \"" + _0x2a24a9 + "\" 已保存。");
    }
  });
}
function saveCurrentOutfitEnableData(_0x526621) {
  const _0x22e2f7 = extension_settings[extensionName];
  const _0x391159 = document.getElementById("outfit_enable_list");
  if (!_0x391159) {
    return;
  }
  const _0x49cd62 = _0x391159.value.split("\n").map(_0x4991ef => _0x4991ef.trim()).filter(_0x4e7d86 => _0x4e7d86.length > 0);
  const _0x564af5 = {
    outfits: _0x49cd62
  };
  _0x22e2f7.outfitEnablePresets[_0x526621] = _0x564af5;
  saveSettingsDebounced();
}
function deleteOutfitEnablePreset() {
  const _0x1b316b = extension_settings[extensionName];
  const _0x59d8c5 = document.getElementById("outfit_enable_preset_id")?.value;
  if (_0x59d8c5 === "默认服装列表") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该通用服装列表预设").then(_0x100ea7 => {
    if (_0x100ea7) {
      delete _0x1b316b.outfitEnablePresets[_0x59d8c5];
      _0x1b316b.outfitEnablePresetId = "默认服装列表";
      loadOutfitEnablePresetList();
      loadOutfitEnablePreset();
      saveSettingsDebounced();
    }
  });
}
async function exportOutfitEnablePreset() {
  const _0x493f64 = extension_settings[extensionName];
  const _0x38e37e = _0x493f64.outfitEnablePresetId;
  const _0x3b7cd2 = _0x493f64.outfitEnablePresets[_0x38e37e];
  if (!_0x3b7cd2) {
    alert("没有选中的通用服装列表预设可导出。");
    return;
  }
  const _0x191a02 = _0x3b7cd2.outfits || [];
  const _0x4ee69f = {
    [_0x38e37e]: _0x3b7cd2
  };
  const _0x3d0115 = {
    outfitEnablePresets: _0x4ee69f
  };
  let _0x202fb8 = _0x3d0115;
  if (_0x191a02.length > 0) {
    const _0x13cab8 = "检测到该列表包含 " + _0x191a02.length + " 个服装:\n" + _0x191a02.join("\n") + "\n\n是否一起导出相关服装?";
    const _0x4f03c7 = await stylishConfirm(_0x13cab8);
    if (_0x4f03c7) {
      _0x202fb8.outfits = {};
      _0x191a02.forEach(_0x353a09 => {
        if (_0x493f64.outfitPresets[_0x353a09]) {
          _0x202fb8.outfits[_0x353a09] = _0x493f64.outfitPresets[_0x353a09];
        }
      });
    }
  }
  _0x202fb8 = await encryptExportData(_0x202fb8);
  const _0x24325d = JSON.stringify(_0x202fb8, null, 2);
  const _0x1d0f87 = new Blob([_0x24325d], {
    type: "application/json"
  });
  const _0xb39b1 = URL.createObjectURL(_0x1d0f87);
  const _0x2e5497 = document.createElement("a");
  _0x2e5497.href = _0xb39b1;
  _0x2e5497.download = "st-chatu8-通用服装列表-" + _0x38e37e + ".json";
  document.body.appendChild(_0x2e5497);
  _0x2e5497.click();
  document.body.removeChild(_0x2e5497);
  URL.revokeObjectURL(_0xb39b1);
}
async function exportAllOutfitEnablePresets() {
  const _0x2d6507 = extension_settings[extensionName];
  if (!_0x2d6507.outfitEnablePresets || Object.keys(_0x2d6507.outfitEnablePresets).length === 0) {
    alert("没有通用服装列表预设可导出。");
    return;
  }
  const _0x2225e6 = new Set();
  for (const _0x55404e in _0x2d6507.outfitEnablePresets) {
    const _0x2dbbe1 = _0x2d6507.outfitEnablePresets[_0x55404e];
    const _0x5ee895 = _0x2dbbe1.outfits || [];
    _0x5ee895.forEach(_0x57e478 => _0x2225e6.add(_0x57e478));
  }
  const _0x34e7ab = {
    outfitEnablePresets: _0x2d6507.outfitEnablePresets
  };
  let _0x4bfee1 = _0x34e7ab;
  if (_0x2225e6.size > 0) {
    const _0x136d02 = "检测到所有列表共包含 " + _0x2225e6.size + " 个不同的服装:\n" + Array.from(_0x2225e6).join("\n") + "\n\n是否一起导出相关服装?";
    const _0x4b5b6d = await stylishConfirm(_0x136d02);
    if (_0x4b5b6d) {
      _0x4bfee1.outfits = {};
      _0x2225e6.forEach(_0x455783 => {
        if (_0x2d6507.outfitPresets[_0x455783]) {
          _0x4bfee1.outfits[_0x455783] = _0x2d6507.outfitPresets[_0x455783];
        }
      });
    }
  }
  _0x4bfee1 = await encryptExportData(_0x4bfee1);
  const _0x2150c0 = JSON.stringify(_0x4bfee1, null, 2);
  const _0x10de1a = new Blob([_0x2150c0], {
    type: "application/json"
  });
  const _0x4357f2 = URL.createObjectURL(_0x10de1a);
  const _0x219f2f = document.createElement("a");
  _0x219f2f.href = _0x4357f2;
  _0x219f2f.download = "st-chatu8-通用服装列表-全部.json";
  document.body.appendChild(_0x219f2f);
  _0x219f2f.click();
  document.body.removeChild(_0x219f2f);
  URL.revokeObjectURL(_0x4357f2);
}
function importOutfitEnablePreset() {
  const _0x5303e7 = extension_settings[extensionName];
  const _0x280877 = document.createElement("input");
  _0x280877.type = "file";
  _0x280877.accept = ".json";
  _0x280877.onchange = async _0x1cdae3 => {
    const _0x566258 = _0x1cdae3.target.files[0];
    if (!_0x566258) {
      return;
    }
    const _0x312d5b = new FileReader();
    _0x312d5b.onload = async _0x88814c => {
      try {
        let _0x2e7f45 = JSON.parse(_0x88814c.target.result);
        _0x2e7f45 = decryptImportData(_0x2e7f45);
        let _0x5eee30 = {};
        let _0x43832b = {};
        if (_0x2e7f45.outfitEnablePresets) {
          _0x5eee30 = _0x2e7f45.outfitEnablePresets;
          _0x43832b = _0x2e7f45.outfits || {};
        } else {
          _0x5eee30 = _0x2e7f45;
        }
        let _0x320f0a = false;
        if (Object.keys(_0x43832b).length > 0) {
          const _0x36e830 = Object.keys(_0x43832b);
          const _0x4a8fbf = "检测到 " + _0x36e830.length + " 个相关服装:\n" + _0x36e830.join("\n") + "\n\n是否一起导入?";
          _0x320f0a = await stylishConfirm(_0x4a8fbf);
        }
        let _0x46b8c8 = 0;
        for (const _0x9212b6 in _0x5eee30) {
          if (_0x5eee30.hasOwnProperty(_0x9212b6)) {
            if (!_0x5303e7.outfitEnablePresets.hasOwnProperty(_0x9212b6)) {
              _0x46b8c8++;
            }
            _0x5303e7.outfitEnablePresets[_0x9212b6] = _0x5eee30[_0x9212b6];
          }
        }
        let _0x26d9f5 = 0;
        if (_0x320f0a) {
          for (const _0x401904 in _0x43832b) {
            if (_0x43832b.hasOwnProperty(_0x401904)) {
              if (!_0x5303e7.outfitPresets.hasOwnProperty(_0x401904)) {
                _0x26d9f5++;
              }
              _0x5303e7.outfitPresets[_0x401904] = _0x43832b[_0x401904];
            }
          }
        }
        saveSettingsDebounced();
        loadOutfitEnablePresetList();
        if (_0x320f0a) {
          loadOutfitPresetList();
        }
        const _0x4c52e4 = Object.keys(_0x5eee30)[0];
        if (_0x4c52e4) {
          _0x5303e7.outfitEnablePresetId = _0x4c52e4;
          const _0x1ebe65 = document.getElementById("outfit_enable_preset_id");
          if (_0x1ebe65) {
            _0x1ebe65.value = _0x4c52e4;
          }
          loadOutfitEnablePreset();
        }
        let _0x125d31 = "成功导入 " + Object.keys(_0x5eee30).length + " 个通用服装列表预设，其中 " + _0x46b8c8 + " 个是全新的。";
        if (_0x320f0a) {
          _0x125d31 += "\n同时导入 " + Object.keys(_0x43832b).length + " 个服装预设，其中 " + _0x26d9f5 + " 个是全新的。";
        }
        alert(_0x125d31);
      } catch (_0x5e3023) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x5e3023.message);
        console.error("Error importing outfit enable presets:", _0x5e3023);
      }
    };
    _0x312d5b.readAsText(_0x566258);
  };
  _0x280877.click();
}
function loadOutfitEnableSelector() {
  const _0x52820f = extension_settings[extensionName];
  const _0x6c623c = document.getElementById("outfit_enable_selector");
  if (!_0x6c623c) {
    return;
  }
  _0x6c623c.innerHTML = "<option value=\"\">-- 选择服装 --</option>";
  for (const _0xf83184 in _0x52820f.outfitPresets) {
    const _0x3084b7 = document.createElement("option");
    _0x3084b7.value = _0xf83184;
    _0x3084b7.textContent = _0xf83184;
    _0x6c623c.add(_0x3084b7);
  }
}
function addOutfitFromEnableSelector() {
  const _0x4cb9a9 = document.getElementById("outfit_enable_selector");
  const _0x22c409 = document.getElementById("outfit_enable_list");
  if (!_0x4cb9a9 || !_0x22c409) {
    return;
  }
  const _0x2c821d = _0x4cb9a9.value;
  if (!_0x2c821d) {
    alert("请先选择一个服装");
    return;
  }
  const _0x1e5987 = _0x22c409.value.trim();
  const _0x11a3e1 = _0x1e5987 ? _0x1e5987.split("\n") : [];
  if (_0x11a3e1.includes(_0x2c821d)) {
    alert("该服装已在列表中");
    return;
  }
  _0x11a3e1.push(_0x2c821d);
  _0x22c409.value = _0x11a3e1.join("\n");
}
function checkOutfitEnableList() {
  const _0x4519ff = extension_settings[extensionName];
  const _0x930404 = document.getElementById("outfit_enable_list");
  const _0x4105b1 = document.getElementById("outfit_enable_check_result");
  const _0x25529c = document.getElementById("outfit_enable_check_content");
  if (!_0x930404 || !_0x4105b1 || !_0x25529c) {
    return;
  }
  const _0x553918 = _0x930404.value.split("\n").map(_0x9d33ad => _0x9d33ad.trim()).filter(_0x3d31a1 => _0x3d31a1.length > 0);
  if (_0x553918.length === 0) {
    alert("请先输入服装名称");
    return;
  }
  const _0x3bfbfc = new Set();
  for (const _0x2f7221 in _0x4519ff.outfitPresets) {
    _0x3bfbfc.add(_0x2f7221);
  }
  const _0x1458d5 = {
    found: [],
    notFound: []
  };
  _0x553918.forEach(_0x5f36cc => {
    if (_0x3bfbfc.has(_0x5f36cc)) {
      _0x1458d5.found.push(_0x5f36cc);
    } else {
      _0x1458d5.notFound.push(_0x5f36cc);
    }
  });
  let _0x138595 = "<div style=\"margin-bottom: 10px;\">";
  _0x138595 += "<strong>总计：</strong>" + _0x553918.length + " 个服装";
  _0x138595 += "<br><strong>找到：</strong>" + _0x1458d5.found.length + " 个";
  _0x138595 += "<br><strong>未找到：</strong>" + _0x1458d5.notFound.length + " 个";
  _0x138595 += "</div>";
  if (_0x1458d5.found.length > 0) {
    _0x138595 += "<div style=\"margin-bottom: 10px;\">";
    _0x138595 += "<strong style=\"color: #28a745;\">✓ 已存在的服装：</strong>";
    _0x138595 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x1458d5.found.forEach(_0xeb16c0 => {
      _0x138595 += "<li>" + _0xeb16c0 + "</li>";
    });
    _0x138595 += "</ul></div>";
  }
  if (_0x1458d5.notFound.length > 0) {
    _0x138595 += "<div>";
    _0x138595 += "<strong style=\"color: #dc3545;\">✗ 未找到的服装：</strong>";
    _0x138595 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x1458d5.notFound.forEach(_0x5ad0b3 => {
      _0x138595 += "<li>" + _0x5ad0b3 + "</li>";
    });
    _0x138595 += "</ul></div>";
  }
  _0x25529c.innerHTML = _0x138595;
  $(_0x4105b1).show();
}
function setupCharacterCommonControls(_0x410dba) {
  loadCharacterCommonPresetList();
  _0x410dba.find("#character_common_preset_id").on("change", loadCharacterCommonPreset);
  _0x410dba.find("#character_common_update").on("click", updateCharacterCommonPreset);
  _0x410dba.find("#character_common_save_as").on("click", saveCharacterCommonPresetAs);
  _0x410dba.find("#character_common_export").on("click", exportCharacterCommonPreset);
  _0x410dba.find("#character_common_export_all").on("click", exportAllCharacterCommonPresets);
  _0x410dba.find("#character_common_import").on("click", importCharacterCommonPreset);
  _0x410dba.find("#character_common_delete").on("click", deleteCharacterCommonPreset);
  _0x410dba.find("#character_common_check").on("click", checkCharacterCommonList);
  _0x410dba.find("#character_common_add").on("click", addCharacterFromCommonSelector);
  _0x410dba.find("#character_common_refresh").on("click", loadCharacterCommonSelector);
  loadCharacterCommonPreset();
  loadCharacterCommonSelector();
}
function loadCharacterCommonPresetList() {
  const _0x2dfc99 = extension_settings[extensionName];
  const _0x48dcdf = document.getElementById("character_common_preset_id");
  if (!_0x48dcdf) {
    return;
  }
  _0x48dcdf.innerHTML = "";
  for (const _0x2ba4ac in _0x2dfc99.characterCommonPresets) {
    const _0x395530 = document.createElement("option");
    _0x395530.value = _0x2ba4ac;
    _0x395530.textContent = _0x2ba4ac;
    _0x48dcdf.add(_0x395530);
  }
  _0x48dcdf.value = _0x2dfc99.characterCommonPresetId;
}
function loadCharacterCommonPreset() {
  const _0x3714e6 = extension_settings[extensionName];
  const _0x5f1b59 = document.getElementById("character_common_preset_id");
  if (!_0x5f1b59) {
    return;
  }
  const _0x1340e4 = _0x5f1b59.value;
  _0x3714e6.characterCommonPresetId = _0x1340e4;
  const _0x4f9905 = _0x3714e6.characterCommonPresets[_0x1340e4];
  const _0x4ca17c = document.getElementById("character_common_list");
  if (_0x4ca17c && _0x4f9905) {
    _0x4ca17c.value = (_0x4f9905.characters || []).join("\n");
  }
  saveSettingsDebounced();
}
function updateCharacterCommonPreset() {
  const _0xb80982 = extension_settings[extensionName];
  const _0x55f915 = _0xb80982.characterCommonPresetId;
  if (!_0x55f915 || !_0xb80982.characterCommonPresets[_0x55f915]) {
    alert("没有活动的通用角色列表预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前通用角色列表预设 \"" + _0x55f915 + "\" 吗？").then(_0x568e44 => {
    if (_0x568e44) {
      saveCurrentCharacterCommonData(_0x55f915);
      alert("通用角色列表预设 \"" + _0x55f915 + "\" 已更新。");
    }
  });
}
function saveCharacterCommonPresetAs() {
  stylInput("请输入新通用角色列表预设的名称").then(_0x35220a => {
    if (_0x35220a && _0x35220a.trim() !== "") {
      const _0x13f139 = extension_settings[extensionName];
      saveCurrentCharacterCommonData(_0x35220a);
      _0x13f139.characterCommonPresetId = _0x35220a;
      loadCharacterCommonPresetList();
      alert("通用角色列表预设 \"" + _0x35220a + "\" 已保存。");
    }
  });
}
function saveCurrentCharacterCommonData(_0x3826ab) {
  const _0x4f5fa0 = extension_settings[extensionName];
  const _0x5e93e1 = document.getElementById("character_common_list");
  if (!_0x5e93e1) {
    return;
  }
  const _0x5769ae = _0x5e93e1.value.split("\n").map(_0x3ed5f8 => _0x3ed5f8.trim()).filter(_0x1261ee => _0x1261ee.length > 0);
  const _0x2621dd = {
    characters: _0x5769ae
  };
  _0x4f5fa0.characterCommonPresets[_0x3826ab] = _0x2621dd;
  saveSettingsDebounced();
}
function deleteCharacterCommonPreset() {
  const _0xafff1a = extension_settings[extensionName];
  const _0x2ac829 = document.getElementById("character_common_preset_id")?.value;
  if (_0x2ac829 === "默认通用角色列表") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该通用角色列表预设").then(_0x5afe38 => {
    if (_0x5afe38) {
      delete _0xafff1a.characterCommonPresets[_0x2ac829];
      _0xafff1a.characterCommonPresetId = "默认通用角色列表";
      loadCharacterCommonPresetList();
      loadCharacterCommonPreset();
      saveSettingsDebounced();
    }
  });
}
async function exportCharacterCommonPreset() {
  const _0x5cfcf6 = extension_settings[extensionName];
  const _0x5da45c = _0x5cfcf6.characterCommonPresetId;
  const _0x22c329 = _0x5cfcf6.characterCommonPresets[_0x5da45c];
  if (!_0x22c329) {
    alert("没有选中的通用角色列表预设可导出。");
    return;
  }
  const _0x4cd6f0 = _0x22c329.characters || [];
  const _0x2e6ed3 = {
    [_0x5da45c]: _0x22c329
  };
  const _0x3f10e4 = {
    characterCommonPresets: _0x2e6ed3
  };
  let _0x3f167f = _0x3f10e4;
  if (_0x4cd6f0.length > 0) {
    const _0x40afe3 = "检测到该列表包含 " + _0x4cd6f0.length + " 个角色:\n" + _0x4cd6f0.join("\n") + "\n\n是否一起导出相关角色?";
    const _0x57fc49 = await stylishConfirm(_0x40afe3);
    if (_0x57fc49) {
      _0x3f167f.characters = {};
      _0x4cd6f0.forEach(_0x3a965d => {
        if (_0x5cfcf6.characterPresets[_0x3a965d]) {
          const _0x2a230f = _0x5cfcf6.characterPresets[_0x3a965d];
          _0x3f167f.characters[_0x3a965d] = _0x2a230f;
          const _0x3abb3e = _0x2a230f.outfits || [];
          if (_0x3abb3e.length > 0) {
            if (!_0x3f167f.outfits) {
              _0x3f167f.outfits = {};
            }
            _0x3abb3e.forEach(_0x2166cf => {
              if (_0x5cfcf6.outfitPresets[_0x2166cf]) {
                _0x3f167f.outfits[_0x2166cf] = _0x5cfcf6.outfitPresets[_0x2166cf];
              }
            });
          }
        }
      });
    }
  }
  _0x3f167f = await encryptExportData(_0x3f167f);
  const _0x433d14 = JSON.stringify(_0x3f167f, null, 2);
  const _0x2a8614 = new Blob([_0x433d14], {
    type: "application/json"
  });
  const _0x4eb0f4 = URL.createObjectURL(_0x2a8614);
  const _0x210948 = document.createElement("a");
  _0x210948.href = _0x4eb0f4;
  _0x210948.download = "st-chatu8-通用角色列表-" + _0x5da45c + ".json";
  document.body.appendChild(_0x210948);
  _0x210948.click();
  document.body.removeChild(_0x210948);
  URL.revokeObjectURL(_0x4eb0f4);
}
async function exportAllCharacterCommonPresets() {
  const _0x511406 = extension_settings[extensionName];
  if (!_0x511406.characterCommonPresets || Object.keys(_0x511406.characterCommonPresets).length === 0) {
    alert("没有通用角色列表预设可导出。");
    return;
  }
  const _0x1b1f43 = new Set();
  const _0x45db3a = new Set();
  for (const _0x1f8a12 in _0x511406.characterCommonPresets) {
    const _0x53a69a = _0x511406.characterCommonPresets[_0x1f8a12];
    const _0x58a990 = _0x53a69a.characters || [];
    _0x58a990.forEach(_0x2245c8 => {
      _0x1b1f43.add(_0x2245c8);
      if (_0x511406.characterPresets[_0x2245c8]) {
        const _0x370e8f = _0x511406.characterPresets[_0x2245c8].outfits || [];
        _0x370e8f.forEach(_0x37d464 => _0x45db3a.add(_0x37d464));
      }
    });
  }
  const _0x3e286b = {
    characterCommonPresets: _0x511406.characterCommonPresets
  };
  let _0x2bf5dd = _0x3e286b;
  if (_0x1b1f43.size > 0) {
    const _0x1cc932 = "检测到所有列表共包含 " + _0x1b1f43.size + " 个不同的角色:\n" + Array.from(_0x1b1f43).join("\n") + "\n\n是否一起导出相关角色?";
    const _0x5da5ad = await stylishConfirm(_0x1cc932);
    if (_0x5da5ad) {
      _0x2bf5dd.characters = {};
      _0x1b1f43.forEach(_0x30f17a => {
        if (_0x511406.characterPresets[_0x30f17a]) {
          _0x2bf5dd.characters[_0x30f17a] = _0x511406.characterPresets[_0x30f17a];
        }
      });
      if (_0x45db3a.size > 0) {
        const _0x5d12cd = "同时检测到这些角色包含 " + _0x45db3a.size + " 个不同的服装:\n" + Array.from(_0x45db3a).join("\n") + "\n\n是否也一起导出?";
        const _0x48283e = await stylishConfirm(_0x5d12cd);
        if (_0x48283e) {
          _0x2bf5dd.outfits = {};
          _0x45db3a.forEach(_0x15a313 => {
            if (_0x511406.outfitPresets[_0x15a313]) {
              _0x2bf5dd.outfits[_0x15a313] = _0x511406.outfitPresets[_0x15a313];
            }
          });
        }
      }
    }
  }
  _0x2bf5dd = await encryptExportData(_0x2bf5dd);
  const _0xec53b5 = JSON.stringify(_0x2bf5dd, null, 2);
  const _0x2b7e4b = new Blob([_0xec53b5], {
    type: "application/json"
  });
  const _0x3eb6d5 = URL.createObjectURL(_0x2b7e4b);
  const _0x2bfc53 = document.createElement("a");
  _0x2bfc53.href = _0x3eb6d5;
  _0x2bfc53.download = "st-chatu8-通用角色列表-全部.json";
  document.body.appendChild(_0x2bfc53);
  _0x2bfc53.click();
  document.body.removeChild(_0x2bfc53);
  URL.revokeObjectURL(_0x3eb6d5);
}
function importCharacterCommonPreset() {
  const _0x1c13e6 = extension_settings[extensionName];
  const _0x2a01f9 = document.createElement("input");
  _0x2a01f9.type = "file";
  _0x2a01f9.accept = ".json";
  _0x2a01f9.onchange = async _0x26a4ca => {
    const _0x49b977 = _0x26a4ca.target.files[0];
    if (!_0x49b977) {
      return;
    }
    const _0x3645f5 = new FileReader();
    _0x3645f5.onload = async _0x1bc81f => {
      try {
        let _0x45f098 = JSON.parse(_0x1bc81f.target.result);
        _0x45f098 = decryptImportData(_0x45f098);
        let _0x191dfc = {};
        let _0x18e83 = {};
        let _0xf01443 = {};
        if (_0x45f098.characterCommonPresets) {
          _0x191dfc = _0x45f098.characterCommonPresets;
          _0x18e83 = _0x45f098.characters || {};
          _0xf01443 = _0x45f098.outfits || {};
        } else {
          _0x191dfc = _0x45f098;
        }
        let _0x11eaa9 = false;
        if (Object.keys(_0x18e83).length > 0) {
          const _0x2959ec = Object.keys(_0x18e83);
          const _0x33f10c = "检测到 " + _0x2959ec.length + " 个相关角色:\n" + _0x2959ec.join("\n") + "\n\n是否一起导入?";
          _0x11eaa9 = await stylishConfirm(_0x33f10c);
        }
        let _0x509030 = 0;
        for (const _0x21229f in _0x191dfc) {
          if (_0x191dfc.hasOwnProperty(_0x21229f)) {
            if (!_0x1c13e6.characterCommonPresets.hasOwnProperty(_0x21229f)) {
              _0x509030++;
            }
            _0x1c13e6.characterCommonPresets[_0x21229f] = _0x191dfc[_0x21229f];
          }
        }
        let _0xde8bcb = 0;
        let _0x3b0635 = 0;
        if (_0x11eaa9) {
          for (const _0x1450a2 in _0x18e83) {
            if (_0x18e83.hasOwnProperty(_0x1450a2)) {
              if (!_0x1c13e6.characterPresets.hasOwnProperty(_0x1450a2)) {
                _0xde8bcb++;
              }
              _0x1c13e6.characterPresets[_0x1450a2] = _0x18e83[_0x1450a2];
            }
          }
          for (const _0x5dcecb in _0xf01443) {
            if (_0xf01443.hasOwnProperty(_0x5dcecb)) {
              if (!_0x1c13e6.outfitPresets.hasOwnProperty(_0x5dcecb)) {
                _0x3b0635++;
              }
              _0x1c13e6.outfitPresets[_0x5dcecb] = _0xf01443[_0x5dcecb];
            }
          }
        }
        saveSettingsDebounced();
        loadCharacterCommonPresetList();
        if (_0x11eaa9) {
          loadCharacterPresetList();
          loadOutfitPresetList();
        }
        const _0x289572 = Object.keys(_0x191dfc)[0];
        if (_0x289572) {
          _0x1c13e6.characterCommonPresetId = _0x289572;
          const _0x4fdd7f = document.getElementById("character_common_preset_id");
          if (_0x4fdd7f) {
            _0x4fdd7f.value = _0x289572;
          }
          loadCharacterCommonPreset();
        }
        let _0x95a27c = "成功导入 " + Object.keys(_0x191dfc).length + " 个通用角色列表预设，其中 " + _0x509030 + " 个是全新的。";
        if (_0x11eaa9) {
          _0x95a27c += "\n同时导入 " + Object.keys(_0x18e83).length + " 个角色预设(" + _0xde8bcb + " 个全新)";
          _0x95a27c += "和 " + Object.keys(_0xf01443).length + " 个服装预设(" + _0x3b0635 + " 个全新)。";
        }
        alert(_0x95a27c);
      } catch (_0x1d5df4) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x1d5df4.message);
        console.error("Error importing character common presets:", _0x1d5df4);
      }
    };
    _0x3645f5.readAsText(_0x49b977);
  };
  _0x2a01f9.click();
}
function loadCharacterCommonSelector() {
  const _0x23cbf9 = extension_settings[extensionName];
  const _0x2cd432 = document.getElementById("character_common_selector");
  if (!_0x2cd432) {
    return;
  }
  _0x2cd432.innerHTML = "<option value=\"\">-- 选择角色 --</option>";
  for (const _0x3f010f in _0x23cbf9.characterPresets) {
    const _0x142511 = document.createElement("option");
    _0x142511.value = _0x3f010f;
    _0x142511.textContent = _0x3f010f;
    _0x2cd432.add(_0x142511);
  }
}
function addCharacterFromCommonSelector() {
  const _0x4a57ea = document.getElementById("character_common_selector");
  const _0x5a17bf = document.getElementById("character_common_list");
  if (!_0x4a57ea || !_0x5a17bf) {
    return;
  }
  const _0x4d4173 = _0x4a57ea.value;
  if (!_0x4d4173) {
    alert("请先选择一个角色");
    return;
  }
  const _0x2e0e97 = _0x5a17bf.value.trim();
  const _0x135a37 = _0x2e0e97 ? _0x2e0e97.split("\n") : [];
  if (_0x135a37.includes(_0x4d4173)) {
    alert("该角色已在列表中");
    return;
  }
  _0x135a37.push(_0x4d4173);
  _0x5a17bf.value = _0x135a37.join("\n");
}
function checkCharacterCommonList() {
  const _0x22a192 = extension_settings[extensionName];
  const _0x24ac54 = document.getElementById("character_common_list");
  const _0xe04ca5 = document.getElementById("character_common_check_result");
  const _0xf81e2e = document.getElementById("character_common_check_content");
  if (!_0x24ac54 || !_0xe04ca5 || !_0xf81e2e) {
    return;
  }
  const _0xaaf6f = _0x24ac54.value.split("\n").map(_0x6d85ec => _0x6d85ec.trim()).filter(_0x4578d2 => _0x4578d2.length > 0);
  if (_0xaaf6f.length === 0) {
    alert("请先输入角色名称");
    return;
  }
  const _0x45b9a2 = new Set();
  for (const _0xb73803 in _0x22a192.characterPresets) {
    _0x45b9a2.add(_0xb73803);
  }
  const _0x14102a = {
    found: [],
    notFound: []
  };
  _0xaaf6f.forEach(_0x4eeed6 => {
    if (_0x45b9a2.has(_0x4eeed6)) {
      _0x14102a.found.push(_0x4eeed6);
    } else {
      _0x14102a.notFound.push(_0x4eeed6);
    }
  });
  let _0x1895d7 = "<div style=\"margin-bottom: 10px;\">";
  _0x1895d7 += "<strong>总计：</strong>" + _0xaaf6f.length + " 个角色";
  _0x1895d7 += "<br><strong>找到：</strong>" + _0x14102a.found.length + " 个";
  _0x1895d7 += "<br><strong>未找到：</strong>" + _0x14102a.notFound.length + " 个";
  _0x1895d7 += "</div>";
  if (_0x14102a.found.length > 0) {
    _0x1895d7 += "<div style=\"margin-bottom: 10px;\">";
    _0x1895d7 += "<strong style=\"color: #28a745;\">✓ 已存在的角色：</strong>";
    _0x1895d7 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x14102a.found.forEach(_0x3b3b81 => {
      _0x1895d7 += "<li>" + _0x3b3b81 + "</li>";
    });
    _0x1895d7 += "</ul></div>";
  }
  if (_0x14102a.notFound.length > 0) {
    _0x1895d7 += "<div>";
    _0x1895d7 += "<strong style=\"color: #dc3545;\">✗ 未找到的角色：</strong>";
    _0x1895d7 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x14102a.notFound.forEach(_0x41765d => {
      _0x1895d7 += "<li>" + _0x41765d + "</li>";
    });
    _0x1895d7 += "</ul></div>";
  }
  _0xf81e2e.innerHTML = _0x1895d7;
  $(_0xe04ca5).show();
}
function replaceEnglishBrackets() {
  const _0x4f3cb6 = ["facialFeatures", "upperBodySFW", "fullBodySFW", "upperBodyNSFW", "fullBodyNSFW"];
  let _0x170aff = 0;
  _0x4f3cb6.forEach(_0x5e9e71 => {
    const _0x5c4c06 = document.getElementById("char_" + _0x5e9e71);
    if (_0x5c4c06 && _0x5c4c06.value) {
      const _0x2b31ed = _0x5c4c06.value;
      const _0x2e3554 = _0x2b31ed.replace(/\(/g, "（").replace(/\)/g, "）");
      if (_0x2b31ed !== _0x2e3554) {
        _0x5c4c06.value = _0x2e3554;
        _0x170aff++;
        $(_0x5c4c06).trigger("input");
      }
    }
  });
  if (_0x170aff > 0) {
    alert("已替换 " + _0x170aff + " 个输入框中的英文括号为中文括号。");
  } else {
    alert("没有找到需要替换的英文括号。");
  }
}
function replaceOutfitEnglishBrackets() {
  const _0x3a23c0 = ["upperBody", "fullBody"];
  let _0xf48330 = 0;
  _0x3a23c0.forEach(_0xd516d1 => {
    const _0x3432b1 = document.getElementById("outfit_" + _0xd516d1);
    if (_0x3432b1 && _0x3432b1.value) {
      const _0x235ec1 = _0x3432b1.value;
      const _0x2041a4 = _0x235ec1.replace(/\(/g, "（").replace(/\)/g, "）");
      if (_0x235ec1 !== _0x2041a4) {
        _0x3432b1.value = _0x2041a4;
        _0xf48330++;
        $(_0x3432b1).trigger("input");
      }
    }
  });
  if (_0xf48330 > 0) {
    alert("已替换 " + _0xf48330 + " 个输入框中的英文括号为中文括号。");
  } else {
    alert("没有找到需要替换的英文括号。");
  }
}
function checkCharacterList() {
  const _0x3d9248 = extension_settings[extensionName];
  const _0x3a5dec = document.getElementById("character_enable_list");
  const _0x19279c = document.getElementById("character_enable_check_result");
  const _0x3148ff = document.getElementById("character_enable_check_content");
  if (!_0x3a5dec || !_0x19279c || !_0x3148ff) {
    return;
  }
  const _0xfeeaf8 = _0x3a5dec.value.split("\n").map(_0x36fb89 => _0x36fb89.trim()).filter(_0x42289d => _0x42289d.length > 0);
  if (_0xfeeaf8.length === 0) {
    alert("请先输入角色名称");
    return;
  }
  const _0x158fd3 = new Set();
  for (const _0x4308ee in _0x3d9248.characterPresets) {
    _0x158fd3.add(_0x4308ee);
  }
  const _0x3d696f = {
    found: [],
    notFound: []
  };
  _0xfeeaf8.forEach(_0x1c73ce => {
    if (_0x158fd3.has(_0x1c73ce)) {
      _0x3d696f.found.push(_0x1c73ce);
    } else {
      _0x3d696f.notFound.push(_0x1c73ce);
    }
  });
  let _0x4eed39 = "<div style=\"margin-bottom: 10px;\">";
  _0x4eed39 += "<strong>总计：</strong>" + _0xfeeaf8.length + " 个角色";
  _0x4eed39 += "<br><strong>找到：</strong>" + _0x3d696f.found.length + " 个";
  _0x4eed39 += "<br><strong>未找到：</strong>" + _0x3d696f.notFound.length + " 个";
  _0x4eed39 += "</div>";
  if (_0x3d696f.found.length > 0) {
    _0x4eed39 += "<div style=\"margin-bottom: 10px;\">";
    _0x4eed39 += "<strong style=\"color: #28a745;\">✓ 已存在的角色：</strong>";
    _0x4eed39 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x3d696f.found.forEach(_0x460dd0 => {
      _0x4eed39 += "<li>" + _0x460dd0 + "</li>";
    });
    _0x4eed39 += "</ul></div>";
  }
  if (_0x3d696f.notFound.length > 0) {
    _0x4eed39 += "<div>";
    _0x4eed39 += "<strong style=\"color: #dc3545;\">✗ 未找到的角色：</strong>";
    _0x4eed39 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x3d696f.notFound.forEach(_0x1a98ec => {
      _0x4eed39 += "<li>" + _0x1a98ec + "</li>";
    });
    _0x4eed39 += "</ul></div>";
  }
  _0x3148ff.innerHTML = _0x4eed39;
  $(_0x19279c).show();
}
async function handleAutocomplete(_0x17527d, _0x497a95) {
  const _0x21bae0 = _0x17527d.value;
  const _0x39c022 = _0x17527d.selectionStart;
  const _0x50643e = _0x21bae0.substring(0, _0x39c022);
  const _0x79be90 = _0x21bae0.substring(_0x39c022);
  const _0x3bd8a3 = Math.max(_0x50643e.lastIndexOf(","), _0x50643e.lastIndexOf("，"));
  const _0xda803d = _0x79be90.search(/[,，]/);
  const _0x35e0d2 = _0x3bd8a3 + 1;
  const _0xd73263 = _0xda803d !== -1 ? _0x39c022 + _0xda803d : _0x21bae0.length;
  const _0x57c172 = _0x21bae0.substring(_0x35e0d2, _0xd73263).trim();
  if (_0x57c172.length < 1) {
    _0x497a95.style.display = "none";
    return;
  }
  try {
    const _0x3aef2e = extension_settings[extensionName];
    const _0x2d7ef7 = String(_0x3aef2e.vocabulary_search_startswith) === "true";
    const _0x1f10b0 = parseInt(_0x3aef2e.vocabulary_search_limit, 10);
    const _0x180a63 = _0x3aef2e.vocabulary_search_sort;
    const _0x2ed478 = {
      startsWith: _0x2d7ef7,
      limit: _0x1f10b0,
      sortBy: _0x180a63
    };
    const _0x314659 = await dbs.searchTags(_0x57c172, _0x2ed478);
    _0x497a95.innerHTML = "";
    if (_0x314659.length > 0) {
      _0x314659.forEach(_0x45c459 => {
        const _0x330ad4 = document.createElement("div");
        _0x330ad4.className = "ch-autocomplete-item";
        _0x330ad4.textContent = _0x45c459.name + " (" + _0x45c459.translation + ")";
        _0x330ad4.addEventListener("click", () => handleResultClick(_0x17527d, _0x497a95, _0x45c459));
        _0x497a95.appendChild(_0x330ad4);
      });
      _0x497a95.style.display = "block";
    } else {
      _0x497a95.style.display = "none";
    }
  } catch (_0x1ea87c) {
    console.error("Tag search failed:", _0x1ea87c);
    _0x497a95.style.display = "none";
  }
}
function handleResultClick(_0x13c91a, _0x545644, _0x4622d2) {
  const _0x3bccf5 = _0x13c91a.value;
  const _0x17a300 = _0x13c91a.selectionStart;
  const _0x38ad14 = _0x3bccf5.substring(0, _0x17a300);
  const _0xb4f0f1 = _0x3bccf5.substring(_0x17a300);
  const _0x5b7423 = Math.max(_0x38ad14.lastIndexOf(","), _0x38ad14.lastIndexOf("，"));
  const _0x26d206 = _0xb4f0f1.search(/[,，]/);
  const _0xf3775a = _0x5b7423 + 1;
  const _0x1d90f = _0x26d206 !== -1 ? _0x17a300 + _0x26d206 : _0x3bccf5.length;
  const _0x29233b = _0x4622d2.name + "（" + _0x4622d2.translation + "）";
  const _0x52ae3f = _0x3bccf5.substring(0, _0xf3775a);
  const _0x4b0808 = _0x3bccf5.substring(_0x1d90f);
  const _0x2b60ab = _0x3bccf5.substring(_0xf3775a, _0xf3775a + 1) === " " ? " " : "";
  const _0x20acf8 = _0x4b0808.trim();
  const _0x1d46cc = _0x20acf8.length > 0 && !_0x20acf8.startsWith(",") ? ", " : "";
  const _0x30e8d6 = "" + (_0x52ae3f.trim() ? _0x52ae3f : "") + _0x2b60ab + _0x29233b + _0x1d46cc + (_0x4b0808.trim() ? _0x4b0808 : "");
  _0x13c91a.value = _0x30e8d6.replace(/，/g, ",");
  _0x545644.style.display = "none";
  _0x13c91a.focus();
  const _0x3bfe6d = (_0x52ae3f + _0x2b60ab + _0x29233b + _0x1d46cc).length;
  setTimeout(() => _0x13c91a.setSelectionRange(_0x3bfe6d, _0x3bfe6d), 0);
  $(_0x13c91a).trigger("input");
}
function initTagAutocomplete() {
  console.log("[Character] Initializing tag autocomplete...");
  document.addEventListener("click", _0x10244f => {
    if (!_0x10244f.target.closest(".st-chatu8-field-col") && !_0x10244f.target.closest(".ch-autocomplete-results")) {
      $(".ch-autocomplete-results").hide();
    }
  });
  const _0x1e5e69 = ["char_facialFeatures", "char_facialFeaturesBack", "char_upperBodySFW", "char_upperBodySFWBack", "char_fullBodySFW", "char_fullBodySFWBack", "char_upperBodyNSFW", "char_upperBodyNSFWBack", "char_fullBodyNSFW", "char_fullBodyNSFWBack"];
  _0x1e5e69.forEach(_0x1f8d67 => {
    const _0x2c4cda = document.getElementById(_0x1f8d67);
    const _0x260381 = document.getElementById(_0x1f8d67 + "-results");
    if (_0x2c4cda && _0x260381) {
      $(_0x2c4cda).off("input").on("input", () => handleAutocomplete(_0x2c4cda, _0x260381));
      $(_0x2c4cda).off("click").on("click", _0x1cb569 => _0x1cb569.stopPropagation());
      $(_0x260381).off("click").on("click", _0x155021 => _0x155021.stopPropagation());
    }
  });
  const _0x47733c = ["outfit_upperBody", "outfit_upperBodyBack", "outfit_fullBody", "outfit_fullBodyBack"];
  _0x47733c.forEach(_0x4f625f => {
    const _0x57e7db = document.getElementById(_0x4f625f);
    const _0x3004e5 = document.getElementById(_0x4f625f + "-results");
    if (_0x57e7db && _0x3004e5) {
      $(_0x57e7db).off("input").on("input", () => handleAutocomplete(_0x57e7db, _0x3004e5));
      $(_0x57e7db).off("click").on("click", _0x58b5c4 => _0x58b5c4.stopPropagation());
      $(_0x3004e5).off("click").on("click", _0x43886f => _0x43886f.stopPropagation());
    }
  });
  console.log("[Character] Tag autocomplete initialized");
}
function setupBananaCharacterControls(_0x43e344) {
  loadBananaCharacterPresetList();
  _0x43e344.find("#banana_char_preset_id").on("change", loadBananaCharacterPreset);
  _0x43e344.find("#banana_char_update").on("click", updateBananaCharacterPreset);
  _0x43e344.find("#banana_char_save_as").on("click", saveBananaCharacterPresetAs);
  _0x43e344.find("#banana_char_delete").on("click", deleteBananaCharacterPreset);
  setupBananaImageUpload("user");
  setupBananaImageUpload("model");
  loadBananaCharacterPreset();
}
function loadBananaCharacterPresetList() {
  const _0x5af7dc = extension_settings[extensionName];
  const _0x2bdc9b = document.getElementById("banana_char_preset_id");
  if (!_0x2bdc9b) {
    return;
  }
  _0x2bdc9b.innerHTML = "";
  for (const _0x21428a in _0x5af7dc.bananaCharacterPresets) {
    const _0x1313f9 = document.createElement("option");
    _0x1313f9.value = _0x21428a;
    _0x1313f9.textContent = _0x21428a;
    _0x2bdc9b.add(_0x1313f9);
  }
  _0x2bdc9b.value = _0x5af7dc.bananaCharacterPresetId;
}
function loadBananaCharacterPreset() {
  const _0x3d83f3 = extension_settings[extensionName];
  const _0x578d71 = document.getElementById("banana_char_preset_id");
  if (!_0x578d71) {
    return;
  }
  const _0x25f99c = _0x578d71.value;
  _0x3d83f3.bananaCharacterPresetId = _0x25f99c;
  const _0x360ed0 = _0x3d83f3.bananaCharacterPresets[_0x25f99c];
  if (!_0x360ed0) {
    return;
  }
  document.getElementById("banana_char_triggers").value = _0x360ed0.triggers || "";
  const _0x34c04d = _0x360ed0.conversation || {
    user: {
      text: "",
      image: ""
    },
    model: {
      text: "",
      image: ""
    }
  };
  document.getElementById("banana_char_user_text").value = _0x34c04d.user.text || "";
  document.getElementById("banana_char_model_text").value = _0x34c04d.model.text || "";
  updateBananaImageUI("user", _0x34c04d.user.image);
  updateBananaImageUI("model", _0x34c04d.model.image);
  saveSettingsDebounced();
}
function updateBananaCharacterPreset() {
  const _0x153471 = extension_settings[extensionName];
  const _0x3ceae8 = _0x153471.bananaCharacterPresetId;
  if (!_0x3ceae8 || !_0x153471.bananaCharacterPresets[_0x3ceae8]) {
    alert("没有活动的 Banana 角色预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前 Banana 角色预设 \"" + _0x3ceae8 + "\" 吗？").then(_0x2714e3 => {
    if (_0x2714e3) {
      saveCurrentBananaCharacterData(_0x3ceae8);
      alert("Banana 角色预设 \"" + _0x3ceae8 + "\" 已更新。");
    }
  });
}
function saveBananaCharacterPresetAs() {
  stylInput("请输入新 Banana 角色预设的名称").then(_0x4be83b => {
    if (_0x4be83b && _0x4be83b.trim() !== "") {
      const _0x4be797 = extension_settings[extensionName];
      saveCurrentBananaCharacterData(_0x4be83b);
      _0x4be797.bananaCharacterPresetId = _0x4be83b;
      loadBananaCharacterPresetList();
      alert("Banana 角色预设 \"" + _0x4be83b + "\" 已保存。");
    }
  });
}
function saveCurrentBananaCharacterData(_0x18f0ad) {
  const _0x5140e9 = extension_settings[extensionName];
  const _0x21076a = document.getElementById("banana_char_user_image").src;
  const _0x80ff63 = document.getElementById("banana_char_model_image").src;
  const _0x23e8ac = {
    triggers: document.getElementById("banana_char_triggers").value,
    conversation: {
      user: {
        text: document.getElementById("banana_char_user_text").value,
        image: _0x21076a.startsWith("data:image") ? _0x21076a : ""
      },
      model: {
        text: document.getElementById("banana_char_model_text").value,
        image: _0x80ff63.startsWith("data:image") ? _0x80ff63 : ""
      }
    }
  };
  _0x5140e9.bananaCharacterPresets[_0x18f0ad] = _0x23e8ac;
  saveSettingsDebounced();
}
function deleteBananaCharacterPreset() {
  const _0x306509 = extension_settings[extensionName];
  const _0xb5e12d = document.getElementById("banana_char_preset_id")?.value;
  if (Object.keys(_0x306509.bananaCharacterPresets).length <= 1) {
    alert("不能删除最后一个预设。");
    return;
  }
  stylishConfirm("是否确定删除该 Banana 角色预设 \"" + _0xb5e12d + "\"").then(_0x152472 => {
    if (_0x152472) {
      delete _0x306509.bananaCharacterPresets[_0xb5e12d];
      _0x306509.bananaCharacterPresetId = Object.keys(_0x306509.bananaCharacterPresets)[0];
      loadBananaCharacterPresetList();
      loadBananaCharacterPreset();
      saveSettingsDebounced();
    }
  });
}
const setupBananaImageUpload = _0x530eac => {
  const _0x1e0ce6 = document.getElementById("banana_char_" + _0x530eac + "_image_container");
  const _0x107ddd = document.getElementById("banana_char_" + _0x530eac + "_image");
  const _0x218041 = _0x1e0ce6.querySelector(".st-chatu8-image-placeholder");
  const _0x152993 = document.getElementById("banana_char_" + _0x530eac + "_image_remove");
  const _0x22d965 = document.getElementById("banana_char_" + _0x530eac + "_image_input");
  if (!_0x1e0ce6 || !_0x107ddd || !_0x218041 || !_0x152993 || !_0x22d965) {
    return;
  }
  _0x1e0ce6.addEventListener("click", _0x4ebebe => {
    if (_0x4ebebe.target !== _0x152993 && !_0x152993.contains(_0x4ebebe.target)) {
      _0x22d965.click();
    }
  });
  _0x22d965.addEventListener("change", () => {
    if (_0x22d965.files && _0x22d965.files[0]) {
      const _0x1d779e = new FileReader();
      _0x1d779e.onload = _0x20d497 => {
        _0x107ddd.src = _0x20d497.target.result;
        _0x107ddd.style.display = "block";
        _0x218041.style.display = "none";
        _0x152993.style.display = "block";
      };
      _0x1d779e.readAsDataURL(_0x22d965.files[0]);
    }
  });
  _0x152993.addEventListener("click", () => {
    _0x107ddd.src = "";
    _0x107ddd.style.display = "none";
    _0x218041.style.display = "block";
    _0x152993.style.display = "none";
    _0x22d965.value = "";
  });
};
const updateBananaImageUI = (_0x19e28a, _0x1cd87a) => {
  const _0x5cec25 = document.getElementById("banana_char_" + _0x19e28a + "_image");
  const _0x30c120 = document.getElementById("banana_char_" + _0x19e28a + "_image_container");
  if (!_0x5cec25 || !_0x30c120) {
    return;
  }
  const _0xc0b1f4 = _0x30c120.querySelector(".st-chatu8-image-placeholder");
  const _0xade973 = document.getElementById("banana_char_" + _0x19e28a + "_image_remove");
  if (_0x1cd87a) {
    _0x5cec25.src = _0x1cd87a;
    _0x5cec25.style.display = "block";
    _0xc0b1f4.style.display = "none";
    _0xade973.style.display = "block";
  } else {
    _0x5cec25.src = "";
    _0x5cec25.style.display = "none";
    _0xc0b1f4.style.display = "block";
    _0xade973.style.display = "none";
  }
};