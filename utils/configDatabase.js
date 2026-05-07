import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { getRequestHeaders } from "./utils.js";
const CONFIG_DB_NAME = "chatu8_config_images";
const CONFIG_DB_VERSION = 2;
const CONFIG_STORE_NAME = "config_images";
let configDb = null;
function generateUUID() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (_0x557de2) {
    var _0x2d9125 = Math.random() * 16 | 0;
    var _0x617759 = _0x557de2 == "x" ? _0x2d9125 : _0x2d9125 & 3 | 8;
    return _0x617759.toString(16);
  });
}
function generateConfigImageId() {
  return "cfgimg_" + generateUUID();
}
function base64ToArrayBuffer(_0x297994) {
  const _0x27ec4a = window.atob(_0x297994);
  const _0x479c29 = _0x27ec4a.length;
  const _0x53d8bb = new Uint8Array(_0x479c29);
  for (let _0xd602a9 = 0; _0xd602a9 < _0x479c29; _0xd602a9++) {
    _0x53d8bb[_0xd602a9] = _0x27ec4a.charCodeAt(_0xd602a9);
  }
  return _0x53d8bb.buffer;
}
function arrayBufferToBase64(_0x1afa96) {
  let _0x4ab593 = "";
  const _0x215ed6 = new Uint8Array(_0x1afa96);
  const _0xb03fed = _0x215ed6.byteLength;
  for (let _0x365a11 = 0; _0x365a11 < _0xb03fed; _0x365a11++) {
    _0x4ab593 += String.fromCharCode(_0x215ed6[_0x365a11]);
  }
  return window.btoa(_0x4ab593);
}
function blobToBase64(_0x2917cc) {
  return new Promise((_0x12076c, _0x4122a1) => {
    const _0x314c49 = new FileReader();
    _0x314c49.onloadend = () => _0x12076c(_0x314c49.result);
    _0x314c49.onerror = _0x4122a1;
    _0x314c49.readAsDataURL(_0x2917cc);
  });
}
async function openConfigDB() {
  if (configDb) {
    return configDb;
  }
  return new Promise((_0x402ce5, _0x37a995) => {
    const _0x5cd6ad = indexedDB.open(CONFIG_DB_NAME, CONFIG_DB_VERSION);
    _0x5cd6ad.onupgradeneeded = _0x571349 => {
      const _0x14f1b7 = _0x571349.target.result;
      if (!_0x14f1b7.objectStoreNames.contains(CONFIG_STORE_NAME)) {
        _0x14f1b7.createObjectStore(CONFIG_STORE_NAME, {
          keyPath: "id"
        });
        console.log("[ConfigDB] Object store '" + CONFIG_STORE_NAME + "' created.");
      }
    };
    _0x5cd6ad.onerror = _0x22dfb4 => {
      console.error("[ConfigDB] 打开数据库失败:", _0x22dfb4.target.error);
      _0x37a995(_0x22dfb4.target.error);
    };
    _0x5cd6ad.onsuccess = _0x49570d => {
      configDb = _0x49570d.target.result;
      console.log("[ConfigDB] 数据库 '" + CONFIG_DB_NAME + "' 打开成功。");
      _0x402ce5(configDb);
    };
  });
}
async function dbWriteConfigImage(_0x501761, _0x38a48f) {
  const _0x1a6df7 = await openConfigDB();
  const _0x1cef6c = _0x1a6df7.transaction([CONFIG_STORE_NAME], "readwrite");
  const _0x4d92fd = _0x1cef6c.objectStore(CONFIG_STORE_NAME);
  return new Promise((_0x414f72, _0x4c1ff1) => {
    const _0x25bd18 = _0x4d92fd.put({
      id: _0x501761,
      data: _0x38a48f,
      date: Date.now()
    });
    _0x25bd18.onsuccess = () => _0x414f72();
    _0x25bd18.onerror = _0x4bbefd => _0x4c1ff1(_0x4bbefd.target.error);
  });
}
async function dbReadConfigImage(_0x9b0050) {
  const _0x383a94 = await openConfigDB();
  const _0x3ccbd8 = _0x383a94.transaction([CONFIG_STORE_NAME], "readonly");
  const _0x17ceb0 = _0x3ccbd8.objectStore(CONFIG_STORE_NAME);
  return new Promise((_0x3b7064, _0x169f1f) => {
    const _0x2b98ef = _0x17ceb0.get(_0x9b0050);
    _0x2b98ef.onsuccess = _0x1af54d => _0x3b7064(_0x1af54d.target.result);
    _0x2b98ef.onerror = _0x1a833d => _0x169f1f(_0x1a833d.target.error);
  });
}
async function dbDeleteConfigImage(_0x307b08) {
  const _0x3ad6c4 = await openConfigDB();
  const _0xd2db2a = _0x3ad6c4.transaction([CONFIG_STORE_NAME], "readwrite");
  const _0x121169 = _0xd2db2a.objectStore(CONFIG_STORE_NAME);
  return new Promise((_0x11cbfe, _0xc99244) => {
    const _0x45c5d5 = _0x121169.delete(_0x307b08);
    _0x45c5d5.onsuccess = () => _0x11cbfe(true);
    _0x45c5d5.onerror = _0x25bc18 => _0xc99244(_0x25bc18.target.error);
  });
}
function ensureServerStorage() {
  if (!extension_settings[extensionName].configImageStorage) {
    extension_settings[extensionName].configImageStorage = {};
  }
  return extension_settings[extensionName].configImageStorage;
}
export async function saveConfigImage(_0x292008, _0xbaef8a = {}) {
  const {
    format = "png",
    filename: _0x363935
  } = _0xbaef8a;
  const _0x4d659f = generateConfigImageId();
  const _0xa32d01 = _0x292008.split(",")[1] || _0x292008;
  if (extension_settings[extensionName].jiuguanchucun === "true") {
    try {
      const _0x2d2c84 = {
        image: _0xa32d01,
        format: format,
        ch_name: "chatu8_config"
      };
      const _0x2643f3 = _0x2d2c84;
      if (_0x363935) {
        _0x2643f3.filename = _0x363935;
      }
      const _0xbd9d7e = await fetch("/api/images/upload", {
        method: "POST",
        headers: getRequestHeaders(window.token),
        body: JSON.stringify(_0x2643f3)
      });
      if (!_0xbd9d7e.ok) {
        throw new Error("Upload failed: " + _0xbd9d7e.statusText);
      }
      const _0x81e209 = await _0xbd9d7e.json();
      const _0x25913e = _0x81e209.path;
      const _0x211396 = ensureServerStorage();
      _0x211396[_0x4d659f] = {
        path: _0x25913e,
        date: Date.now()
      };
      saveSettingsDebounced();
      console.log("[ConfigDB] 配置图片已保存到服务器: " + _0x4d659f);
      return _0x4d659f;
    } catch (_0x2a5c4a) {
      console.error("[ConfigDB] 上传配置图片到服务器失败:", _0x2a5c4a);
      throw _0x2a5c4a;
    }
  } else {
    const _0x4478df = base64ToArrayBuffer(_0xa32d01);
    await dbWriteConfigImage(_0x4d659f, _0x4478df);
    console.log("[ConfigDB] 配置图片已保存到 IndexedDB: " + _0x4d659f);
    return _0x4d659f;
  }
}
export async function getConfigImage(_0x52fe0a) {
  if (!_0x52fe0a) {
    return null;
  }
  const _0x25d85d = extension_settings[extensionName].configImageStorage || {};
  const _0x322793 = _0x25d85d[_0x52fe0a];
  if (_0x322793 && _0x322793.path) {
    try {
      const _0x291a25 = await fetch(_0x322793.path);
      if (_0x291a25.ok) {
        const _0x1c3278 = await _0x291a25.blob();
        const _0x2339d2 = await blobToBase64(_0x1c3278);
        return _0x2339d2;
      }
    } catch (_0x1dd2d2) {
      console.error("[ConfigDB] 从服务器获取配置图片失败:", _0x1dd2d2);
    }
  }
  try {
    const _0xaff548 = await dbReadConfigImage(_0x52fe0a);
    if (_0xaff548 && _0xaff548.data) {
      return "data:image/png;base64," + arrayBufferToBase64(_0xaff548.data);
    }
  } catch (_0x4ac866) {
    console.error("[ConfigDB] 从 IndexedDB 获取配置图片失败:", _0x4ac866);
  }
  return null;
}
export async function deleteConfigImage(_0x1ed5b2) {
  if (!_0x1ed5b2) {
    return false;
  }
  let _0x22a0f3 = false;
  const _0x424d5d = extension_settings[extensionName].configImageStorage || {};
  const _0x3685d4 = _0x424d5d[_0x1ed5b2];
  if (_0x3685d4) {
    if (_0x3685d4.path) {
      try {
        const _0x4e302c = {
          path: _0x3685d4.path
        };
        const _0xaeeeaf = await fetch("/api/images/delete", {
          method: "POST",
          headers: getRequestHeaders(window.token),
          body: JSON.stringify(_0x4e302c)
        });
        if (!_0xaeeeaf.ok) {
          console.error("[ConfigDB] 删除服务器图片失败:", _0xaeeeaf.statusText);
        }
      } catch (_0x5370a9) {
        console.error("[ConfigDB] 删除服务器图片失败:", _0x5370a9);
      }
    }
    delete _0x424d5d[_0x1ed5b2];
    saveSettingsDebounced();
    _0x22a0f3 = true;
    console.log("[ConfigDB] 配置图片已从服务器删除: " + _0x1ed5b2);
  }
  try {
    const _0xb86258 = await dbReadConfigImage(_0x1ed5b2);
    if (_0xb86258) {
      await dbDeleteConfigImage(_0x1ed5b2);
      _0x22a0f3 = true;
      console.log("[ConfigDB] 配置图片已从 IndexedDB 删除: " + _0x1ed5b2);
    }
  } catch (_0x5efdba) {
    console.error("[ConfigDB] 从 IndexedDB 删除配置图片失败:", _0x5efdba);
  }
  return _0x22a0f3;
}
export async function hasConfigImage(_0x15e130) {
  if (!_0x15e130) {
    return false;
  }
  const _0x5d4bf1 = extension_settings[extensionName].configImageStorage || {};
  if (_0x5d4bf1[_0x15e130]) {
    return true;
  }
  try {
    const _0x44cbe5 = await dbReadConfigImage(_0x15e130);
    return !!_0x44cbe5;
  } catch (_0x16e8c2) {
    return false;
  }
}
export async function listConfigImageIds() {
  const _0x3a7b43 = new Set();
  const _0x39b882 = extension_settings[extensionName].configImageStorage || {};
  Object.keys(_0x39b882).forEach(_0x14eb4e => _0x3a7b43.add(_0x14eb4e));
  try {
    const _0x32671d = await openConfigDB();
    const _0x263d87 = _0x32671d.transaction([CONFIG_STORE_NAME], "readonly");
    const _0x280755 = _0x263d87.objectStore(CONFIG_STORE_NAME);
    const _0x51986d = await new Promise((_0x24d2cb, _0x51d6b0) => {
      const _0x31af9e = _0x280755.getAllKeys();
      _0x31af9e.onsuccess = () => _0x24d2cb(_0x31af9e.result);
      _0x31af9e.onerror = _0x43ff35 => _0x51d6b0(_0x43ff35.target.error);
    });
    _0x51986d.forEach(_0xc5a73f => _0x3a7b43.add(_0xc5a73f));
  } catch (_0x51c342) {
    console.error("[ConfigDB] 获取 IndexedDB ID 列表失败:", _0x51c342);
  }
  return Array.from(_0x3a7b43);
}
function utf8ToBase64(_0x2f78ca) {
  return window.btoa(unescape(encodeURIComponent(_0x2f78ca)));
}
function base64ToUtf8(_0x4dd5ec) {
  return decodeURIComponent(escape(window.atob(_0x4dd5ec)));
}
export async function saveAiChatHistory(_0x21feff) {
  const _0x6befe5 = "ai_chat_history";
  const _0x8a6f69 = JSON.stringify(_0x21feff);
  const _0x55332f = utf8ToBase64(_0x8a6f69);
  if (extension_settings[extensionName].jiuguanchucun === "true") {
    try {
      const _0x4ff037 = {
        image: _0x55332f,
        format: "png",
        ch_name: "chatu8_config",
        filename: "ai_chat_history.png"
      };
      const _0x52191b = _0x4ff037;
      const _0xfcc38e = await fetch("/api/images/upload", {
        method: "POST",
        headers: getRequestHeaders(window.token),
        body: JSON.stringify(_0x52191b)
      });
      if (!_0xfcc38e.ok) {
        throw new Error("Upload failed: " + _0xfcc38e.statusText);
      }
      const _0x4fd830 = await _0xfcc38e.json();
      const _0x271bb6 = ensureServerStorage();
      _0x271bb6[_0x6befe5] = {
        path: _0x4fd830.path,
        date: Date.now()
      };
      saveSettingsDebounced();
      console.log("[ConfigDB] 聊天记录已保存到服务器: " + _0x6befe5);
    } catch (_0x88196a) {
      console.error("[ConfigDB] 上传聊天记录到服务器失败:", _0x88196a);
    }
  } else {
    try {
      const _0xb2e28f = base64ToArrayBuffer(_0x55332f);
      await dbWriteConfigImage(_0x6befe5, _0xb2e28f);
      console.log("[ConfigDB] 聊天记录已保存到 IndexedDB: " + _0x6befe5);
    } catch (_0x191bef) {
      console.error("[ConfigDB] 聊天记录存入 IndexedDB 失败:", _0x191bef);
    }
  }
}
export async function getAiChatHistory() {
  const _0x515568 = "ai_chat_history";
  const _0x2397e1 = extension_settings[extensionName].configImageStorage || {};
  const _0x5710af = _0x2397e1[_0x515568];
  if (_0x5710af && _0x5710af.path) {
    try {
      const _0x19d982 = await fetch(_0x5710af.path);
      if (_0x19d982.ok) {
        const _0x16000d = await _0x19d982.text();
        try {
          return JSON.parse(_0x16000d) || [];
        } catch (_0x5bbea2) {
          try {
            const _0x2a183c = base64ToUtf8(_0x16000d.trim());
            return JSON.parse(_0x2a183c) || [];
          } catch (_0x2c7735) {
            console.warn("[ConfigDB] 服务器端记录JSON解析及Base64解码均失败:", _0x2c7735);
          }
        }
      }
    } catch (_0x3244c7) {
      console.error("[ConfigDB] 从服务器获取聊天历史失败:", _0x3244c7);
    }
  }
  try {
    const _0x5cf7cd = await dbReadConfigImage(_0x515568);
    if (_0x5cf7cd && _0x5cf7cd.data) {
      const _0x21169e = arrayBufferToBase64(_0x5cf7cd.data);
      const _0xc131df = base64ToUtf8(_0x21169e);
      return JSON.parse(_0xc131df) || [];
    }
  } catch (_0x262603) {
    console.error("[ConfigDB] 获取 IndexedDB 聊天历史失败:", _0x262603);
  }
  return [];
}
export async function clearAiChatHistory() {
  await deleteConfigImage("ai_chat_history");
}