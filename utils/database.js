import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { getRequestHeaders } from "./utils.js";
import { ImageSteganography } from "./steganography.js";
const objectStoreName = "tupianhuancun";
const metadataId = "tupianshuju";
let db;
function base64ToArrayBuffer(_0x150e15) {
  const _0x36592b = window.atob(_0x150e15);
  const _0x3f1f83 = _0x36592b.length;
  const _0x402ef6 = new Uint8Array(_0x3f1f83);
  for (let _0x29a8bc = 0; _0x29a8bc < _0x3f1f83; _0x29a8bc++) {
    _0x402ef6[_0x29a8bc] = _0x36592b.charCodeAt(_0x29a8bc);
  }
  return _0x402ef6.buffer;
}
function arrayBufferToBase64(_0x331176) {
  let _0x1874e6 = "";
  const _0x7afb76 = new Uint8Array(_0x331176);
  const _0x32c28f = _0x7afb76.byteLength;
  for (let _0x341afe = 0; _0x341afe < _0x32c28f; _0x341afe++) {
    _0x1874e6 += String.fromCharCode(_0x7afb76[_0x341afe]);
  }
  return window.btoa(_0x1874e6);
}
function blobToBase64(_0x1a5430) {
  return new Promise((_0x38eb73, _0x234672) => {
    const _0x233953 = new FileReader();
    _0x233953.onloadend = () => _0x38eb73(_0x233953.result);
    _0x233953.onerror = _0x234672;
    _0x233953.readAsDataURL(_0x1a5430);
  });
}
function generateUUID() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (_0x1c324f) {
    var _0x3eda14 = Math.random() * 16 | 0;
    var _0x12e6e6 = _0x1c324f == "x" ? _0x3eda14 : _0x3eda14 & 3 | 8;
    return _0x12e6e6.toString(16);
  });
}
async function getMergedAndSortedImages(_0x1c2b79) {
  const _0x5000a0 = {
    images: [],
    currentIndex: 0,
    hasServer: false,
    hasDB: false
  };
  const _0x33b114 = extension_settings[extensionName].jiuguanStorage || {};
  const _0x458aad = _0x33b114[_0x1c2b79];
  let _0x1c24ca = 0;
  if (_0x458aad && Array.isArray(_0x458aad.images) && _0x458aad.images.length > 0) {
    _0x5000a0.hasServer = true;
    _0x1c24ca = _0x458aad.index || 0;
    _0x458aad.images.forEach(_0x5d3736 => {
      const _0x3767cd = {
        ..._0x5d3736
      };
      _0x3767cd.source = "server";
      _0x3767cd.date = _0x5d3736.date || 0;
      _0x5000a0.images.push(_0x3767cd);
    });
  }
  const _0x58b16e = await getMetadata();
  const _0xbb3226 = _0x58b16e[_0x1c2b79];
  let _0x320146 = null;
  if (_0xbb3226 && Array.isArray(_0xbb3226.images) && _0xbb3226.images.length > 0) {
    _0x5000a0.hasDB = true;
    if (_0x1c24ca == 0) {
      _0x1c24ca = _0xbb3226.index;
    }
    _0xbb3226.images.forEach(_0xd8bf66 => {
      const _0x5f5058 = {
        ..._0xd8bf66
      };
      _0x5f5058.source = "db";
      _0x5f5058.date = _0xd8bf66.date || 0;
      _0x5000a0.images.push(_0x5f5058);
    });
  }
  _0x5000a0.images.sort((_0x3b01af, _0x4307da) => _0x3b01af.date - _0x4307da.date);
  _0x5000a0.currentIndex = _0x1c24ca;
  return _0x5000a0;
}
async function syncIndexToStorage(_0x1c451d, _0x4cdeae, _0x4ee5e0) {
  let _0x44efe2 = _0x4cdeae;
  if (_0x44efe2 < 0) {
    _0x44efe2 = 0;
  }
  if (_0x44efe2 >= _0x4ee5e0.length) {
    _0x44efe2 = _0x4ee5e0.length - 1;
  }
  let _0x45c8db = false;
  const _0x483389 = extension_settings[extensionName].jiuguanStorage;
  if (_0x483389 && _0x483389[_0x1c451d]) {
    if (_0x483389[_0x1c451d].index !== _0x44efe2) {
      _0x483389[_0x1c451d].index = _0x44efe2;
      saveSettingsDebounced();
      _0x45c8db = true;
    }
  }
  const _0xd28a2e = await getMetadata();
  if (_0xd28a2e[_0x1c451d]) {
    if (_0xd28a2e[_0x1c451d].index !== _0x44efe2) {
      _0xd28a2e[_0x1c451d].index = _0x44efe2;
      await setMetadata(_0xd28a2e);
    }
  }
  if (_0x45c8db) {
    await updateStegoImage();
  }
  return _0x44efe2;
}
function createThumbnailFromBuffer(_0xc815df, _0x1daa28 = 256, _0x5315c8 = 256) {
  return new Promise((_0x1df1fa, _0x194087) => {
    const _0x19e772 = new Blob([_0xc815df]);
    const _0x18cb83 = new Image();
    const _0x4dfbfb = URL.createObjectURL(_0x19e772);
    _0x18cb83.onload = () => {
      URL.revokeObjectURL(_0x4dfbfb);
      const _0x1c1cbf = document.createElement("canvas");
      const _0x42b3db = _0x1c1cbf.getContext("2d");
      let _0x544cd0 = _0x18cb83.width;
      let _0x39af94 = _0x18cb83.height;
      if (_0x544cd0 > _0x39af94) {
        if (_0x544cd0 > _0x1daa28) {
          _0x39af94 *= _0x1daa28 / _0x544cd0;
          _0x544cd0 = _0x1daa28;
        }
      } else if (_0x39af94 > _0x5315c8) {
        _0x544cd0 *= _0x5315c8 / _0x39af94;
        _0x39af94 = _0x5315c8;
      }
      _0x1c1cbf.width = _0x544cd0;
      _0x1c1cbf.height = _0x39af94;
      _0x42b3db.drawImage(_0x18cb83, 0, 0, _0x544cd0, _0x39af94);
      _0x1c1cbf.toBlob(_0x1569e0 => {
        if (_0x1569e0) {
          _0x1df1fa(_0x1569e0);
        } else {
          _0x194087(new Error("Canvas to Blob conversion failed for thumbnail."));
        }
      }, "image/jpeg", 0.85);
    };
    _0x18cb83.onerror = _0x42e394 => {
      URL.revokeObjectURL(_0x4dfbfb);
      _0x194087(_0x42e394);
    };
    _0x18cb83.src = _0x4dfbfb;
  });
}
function createDefaultVideoThumbnail(_0x1c1a83 = 256, _0x4aa806 = 256) {
  return new Promise((_0x3a2655, _0x104d03) => {
    const _0x560358 = document.createElement("canvas");
    _0x560358.width = _0x1c1a83;
    _0x560358.height = _0x4aa806;
    const _0x200455 = _0x560358.getContext("2d");
    _0x200455.fillStyle = "#1a1a2e";
    _0x200455.fillRect(0, 0, _0x1c1a83, _0x4aa806);
    const _0x3635a6 = _0x200455.createRadialGradient(_0x1c1a83 / 2, _0x4aa806 / 2, 0, _0x1c1a83 / 2, _0x4aa806 / 2, _0x1c1a83 / 2);
    _0x3635a6.addColorStop(0, "#16213e");
    _0x3635a6.addColorStop(1, "#0f0f23");
    _0x200455.fillStyle = _0x3635a6;
    _0x200455.fillRect(0, 0, _0x1c1a83, _0x4aa806);
    const _0x266f96 = _0x1c1a83 / 2;
    const _0x3b5587 = _0x4aa806 / 2;
    const _0x4e9b8d = Math.min(_0x1c1a83, _0x4aa806) * 0.3;
    _0x200455.beginPath();
    _0x200455.arc(_0x266f96, _0x3b5587, _0x4e9b8d, 0, Math.PI * 2);
    _0x200455.fillStyle = "rgba(255, 255, 255, 0.2)";
    _0x200455.fill();
    const _0x2e8355 = _0x4e9b8d * 0.6;
    _0x200455.beginPath();
    _0x200455.moveTo(_0x266f96 - _0x2e8355 * 0.4, _0x3b5587 - _0x2e8355 * 0.6);
    _0x200455.lineTo(_0x266f96 - _0x2e8355 * 0.4, _0x3b5587 + _0x2e8355 * 0.6);
    _0x200455.lineTo(_0x266f96 + _0x2e8355 * 0.6, _0x3b5587);
    _0x200455.closePath();
    _0x200455.fillStyle = "rgba(255, 255, 255, 0.9)";
    _0x200455.fill();
    _0x200455.font = "bold " + Math.floor(_0x1c1a83 * 0.1) + "px Arial";
    _0x200455.fillStyle = "rgba(255, 255, 255, 0.5)";
    _0x200455.textAlign = "center";
    _0x200455.fillText("VIDEO", _0x266f96, _0x4aa806 - 10);
    _0x560358.toBlob(_0x4c9380 => {
      if (_0x4c9380) {
        console.log("[DB] Default video thumbnail created successfully");
        _0x3a2655(_0x4c9380);
      } else {
        _0x104d03(new Error("Failed to create default video thumbnail"));
      }
    }, "image/jpeg", 0.85);
  });
}
async function createThumbnailFromVideo(_0x5dcc91, _0x5356c4 = 256, _0x4cdc09 = 256) {
  try {
    const _0x146edb = await extractVideoFrame(_0x5dcc91, _0x5356c4, _0x4cdc09);
    return _0x146edb;
  } catch (_0x304810) {
    console.warn("[DB] 无法从视频提取缩略图，使用默认占位图:", _0x304810.message);
    return await createDefaultVideoThumbnail(_0x5356c4, _0x4cdc09);
  }
}
function extractVideoFrame(_0x4fdbb7, _0x57cff1, _0x27e33d) {
  const _0x972392 = correctVideoMimeType(_0x4fdbb7);
  return new Promise((_0x5bec61, _0x3d2c5c) => {
    const _0x4ebe9a = document.createElement("video");
    _0x4ebe9a.muted = true;
    _0x4ebe9a.playsInline = true;
    _0x4ebe9a.preload = "auto";
    _0x4ebe9a.crossOrigin = "anonymous";
    let _0x258dd5 = false;
    let _0xb1a969 = null;
    const _0x488428 = () => {
      if (_0xb1a969) {
        clearTimeout(_0xb1a969);
        _0xb1a969 = null;
      }
      _0x4ebe9a.onloadeddata = null;
      _0x4ebe9a.onseeked = null;
      _0x4ebe9a.onerror = null;
      _0x4ebe9a.pause();
      _0x4ebe9a.src = "";
      _0x4ebe9a.removeAttribute("src");
    };
    const _0x1f9a53 = () => {
      if (_0x258dd5) {
        return;
      }
      try {
        const _0x57effd = document.createElement("canvas");
        const _0xeb32c5 = _0x57effd.getContext("2d");
        let _0x17fa07 = _0x4ebe9a.videoWidth || 256;
        let _0x48c1ca = _0x4ebe9a.videoHeight || 256;
        if (_0x17fa07 > _0x48c1ca) {
          if (_0x17fa07 > _0x57cff1) {
            _0x48c1ca *= _0x57cff1 / _0x17fa07;
            _0x17fa07 = _0x57cff1;
          }
        } else if (_0x48c1ca > _0x27e33d) {
          _0x17fa07 *= _0x27e33d / _0x48c1ca;
          _0x48c1ca = _0x27e33d;
        }
        _0x57effd.width = _0x17fa07;
        _0x57effd.height = _0x48c1ca;
        _0xeb32c5.drawImage(_0x4ebe9a, 0, 0, _0x17fa07, _0x48c1ca);
        _0x57effd.toBlob(_0x2a55a3 => {
          _0x488428();
          _0x258dd5 = true;
          if (_0x2a55a3 && _0x2a55a3.size > 0) {
            console.log("[DB] Video thumbnail captured successfully");
            _0x5bec61(_0x2a55a3);
          } else {
            _0x3d2c5c(new Error("Canvas to Blob conversion failed for video thumbnail."));
          }
        }, "image/jpeg", 0.85);
      } catch (_0x71184) {
        _0x488428();
        _0x258dd5 = true;
        _0x3d2c5c(_0x71184);
      }
    };
    _0x4ebe9a.onloadeddata = () => {
      console.log("[DB] Video loaded, attempting to seek...");
      try {
        const _0x59e1b7 = Math.min(0.5, _0x4ebe9a.duration / 4);
        _0x4ebe9a.currentTime = _0x59e1b7;
      } catch (_0x1442ce) {
        console.log("[DB] Cannot seek, capturing current frame");
        _0x1f9a53();
      }
    };
    _0x4ebe9a.onseeked = () => {
      console.log("[DB] Video seeked, capturing frame...");
      _0x1f9a53();
    };
    _0x4ebe9a.onerror = _0x168255 => {
      console.error("[DB] Video load error:", _0x168255);
      _0x488428();
      if (!_0x258dd5) {
        _0x258dd5 = true;
        _0x3d2c5c(new Error("Video load failed"));
      }
    };
    _0xb1a969 = setTimeout(() => {
      console.warn("[DB] Video thumbnail extraction timeout");
      if (!_0x258dd5) {
        _0x488428();
        _0x258dd5 = true;
        _0x3d2c5c(new Error("Video thumbnail extraction timeout."));
      }
    }, 3000);
    _0x4ebe9a.src = _0x972392;
    _0x4ebe9a.load();
  });
}
function correctVideoMimeType(_0x362862) {
  if (!_0x362862 || !_0x362862.startsWith("data:")) {
    return _0x362862;
  }
  const _0x492ca1 = _0x362862.indexOf(",");
  if (_0x492ca1 === -1) {
    return _0x362862;
  }
  const _0x116dbc = _0x362862.substring(5, _0x492ca1);
  const _0x41189c = _0x362862.substring(_0x492ca1 + 1);
  let _0x2085d3 = null;
  if (_0x116dbc.includes("video/h264-mp4") || _0x116dbc.includes("video/h264")) {
    _0x2085d3 = "video/mp4";
  } else if (_0x116dbc.includes("video/") && !_0x116dbc.includes("video/mp4") && !_0x116dbc.includes("video/webm") && !_0x116dbc.includes("video/ogg")) {
    if (_0x116dbc.includes("mp4")) {
      _0x2085d3 = "video/mp4";
    } else if (_0x116dbc.includes("webm")) {
      _0x2085d3 = "video/webm";
    } else {
      _0x2085d3 = "video/mp4";
    }
  }
  if (_0x2085d3) {
    const _0x3f1f75 = _0x116dbc.includes(";base64");
    const _0x27253e = _0x3f1f75 ? _0x2085d3 + ";base64" : _0x2085d3;
    console.log("[DB] 修正视频 MIME 类型: " + _0x116dbc + " -> " + _0x27253e);
    return "data:" + _0x27253e + "," + _0x41189c;
  }
  return _0x362862;
}
export async function migrateOldSettings() {
  if (window.chatu8_old_settings) {
    alert("[Settings Migration] 检测到旧版 chatu8 设置，开始迁移...");
    try {
      const _0x30e48c = window.chatu8_old_settings;
      const {
        yushe: _0xf6626b,
        novelaiApi: _0x3098d0,
        startTag: _0x402098,
        endTag: _0x273f8e,
        workers: _0x15d216
      } = _0x30e48c;
      const _0x4e318c = {};
      if (_0xf6626b && typeof _0xf6626b === "object") {
        for (const _0x99fe7c in _0xf6626b) {
          if (Object.hasOwnProperty.call(_0xf6626b, _0x99fe7c)) {
            _0x4e318c["old-" + _0x99fe7c] = _0xf6626b[_0x99fe7c];
          }
        }
      }
      const _0x37e76f = {};
      if (_0x15d216 && typeof _0x15d216 === "object") {
        for (const _0xc0fd7c in _0x15d216) {
          if (Object.hasOwnProperty.call(_0x15d216, _0xc0fd7c)) {
            _0x37e76f["old-" + _0xc0fd7c] = _0x15d216[_0xc0fd7c];
          }
        }
      }
      console.log(_0x37e76f);
      if (Object.keys(_0x4e318c).length > 0) {
        Object.assign(extension_settings[extensionName].yushe, _0x4e318c);
      }
      if (Object.keys(_0x37e76f).length > 0) {
        Object.assign(extension_settings[extensionName].workers, _0x37e76f);
      }
      if (_0x3098d0) {
        extension_settings[extensionName].novelaiApi = _0x3098d0;
      }
      if (_0x402098) {
        extension_settings[extensionName].startTag = _0x402098;
      }
      if (_0x273f8e) {
        extension_settings[extensionName].endTag = _0x273f8e;
      }
      saveSettingsDebounced();
      localStorage.setItem(migrationFlag, "true");
      alert("成功从旧版 chatu8 脚本迁移了设置！\n预设和工作流已被重命名，格式为 \"old-名称\" 以避免冲突。");
      const _0x228c07 = {
        yushe: _0x4e318c,
        workers: _0x37e76f,
        novelaiApi: _0x3098d0,
        startTag: _0x402098,
        endTag: _0x273f8e
      };
      console.log("[Settings Migration] 设置迁移成功！", _0x228c07);
    } catch (_0x5a7881) {
      console.error("[Settings Migration] 迁移设置时发生错误:", _0x5a7881);
      alert("迁移旧版 chatu8 设置失败，请查看控制台了解详情。");
      localStorage.setItem(migrationFlag, "true");
    }
  } else {
    localStorage.setItem(migrationFlag, "true");
  }
}
const oldDbName = "tupian";
const dbName = "chatu8_gallery";
const dbVersion = 6;
const migrationFlag = "chatu8_gallery_migration_v1_done";
const migrationDecisionKey = "chatu8_migration_user_decision";
function processMigrationDataForBatch(_0x1ce86a, _0x9b3ca9, _0x400b96 = []) {
  const _0x5680ba = [];
  const _0x5001f5 = {};
  for (const _0x3fe258 of _0x1ce86a) {
    if (_0x3fe258.id.length === 32 && _0x3fe258.id !== metadataId && _0x3fe258.tupian) {
      const _0x4e00c4 = _0x3fe258.id;
      if (_0x400b96.includes(_0x4e00c4)) {
        continue;
      }
      let _0x4e9100;
      if (typeof _0x3fe258.tupian === "string") {
        const _0x104dcb = _0x3fe258.tupian.split(",")[1] || _0x3fe258.tupian;
        _0x4e9100 = base64ToArrayBuffer(_0x104dcb);
      } else {
        _0x4e9100 = _0x3fe258.tupian;
      }
      const _0x25dfe7 = generateUUID();
      const _0xe07fc7 = _0x9b3ca9[_0x4e00c4] && _0x9b3ca9[_0x4e00c4][0] || new Date().getTime();
      const _0x24a1b9 = {
        id: _0x25dfe7,
        data: _0x4e9100
      };
      _0x5680ba.push(_0x24a1b9);
      if (!_0x5001f5[_0x4e00c4]) {
        _0x5001f5[_0x4e00c4] = {
          images: [],
          index: 0,
          change: ""
        };
      }
      const _0x874df = {
        uuid: _0x25dfe7,
        thumbnail_uuid: null,
        date: _0xe07fc7
      };
      _0x5001f5[_0x4e00c4].images.push(_0x874df);
    }
  }
  const _0x5d4664 = {
    items: _0x5680ba,
    metadataFragment: _0x5001f5
  };
  return _0x5d4664;
}
async function performMigration() {
  console.log("[DB Migration] 开始数据库迁移 (分批模式)...");
  let _0x1f8e23;
  const _0x292d5e = 50;
  try {
    const _0x482266 = await indexedDB.databases();
    if (!_0x482266.some(_0x30fac8 => _0x30fac8.name === oldDbName)) {
      console.log("[DB Migration] 未找到旧数据库。跳过迁移。");
      alert("未找到旧版图库数据，无需迁移。");
      localStorage.setItem(migrationFlag, "true");
      return;
    }
    console.log("[DB Migration] 发现旧数据库，正在准备迁移...");
    _0x1f8e23 = await new Promise((_0x5cb04d, _0x5210ff) => {
      const _0x13b29b = indexedDB.open(oldDbName);
      _0x13b29b.onsuccess = _0x1a71d0 => _0x5cb04d(_0x1a71d0.target.result);
      _0x13b29b.onerror = _0xa44da9 => _0x5210ff(_0xa44da9.target.error);
    });
    if (!_0x1f8e23.objectStoreNames.contains(objectStoreName)) {
      console.log("[DB Migration] 旧数据库中没有数据可迁移。");
      _0x1f8e23.close();
      localStorage.setItem(migrationFlag, "true");
      if (confirm("旧数据库为空，是否删除它以清理空间？")) {
        await indexedDB.deleteDatabase(oldDbName);
      }
      return;
    }
    const _0x2b7af5 = await openDB();
    const _0x19a4b3 = _0x1f8e23.transaction(objectStoreName, "readonly");
    const _0x43938f = _0x19a4b3.objectStore(objectStoreName);
    const [_0x3b853f, _0x39bc4a] = await Promise.all([new Promise((_0x414f0d, _0x5d3b6f) => {
      const _0x470a4b = _0x43938f.get(metadataId);
      _0x470a4b.onsuccess = _0x48484c => _0x414f0d(_0x48484c.target.result);
      _0x470a4b.onerror = _0x2fecc8 => _0x5d3b6f(_0x2fecc8.target.error);
    }), new Promise((_0x1f2236, _0x42cb46) => {
      const _0x1b4e4d = _0x43938f.count();
      _0x1b4e4d.onsuccess = _0x9aa5f4 => _0x1f2236(_0x9aa5f4.target.result);
      _0x1b4e4d.onerror = _0x249d0f => _0x42cb46(_0x249d0f.target.error);
    })]);
    const _0x3d4763 = _0x3b853f ? JSON.parse(_0x3b853f.shuju) : {};
    const _0x5e30cf = await storeReadOnly(metadataId);
    const _0x407d43 = _0x5e30cf ? JSON.parse(_0x5e30cf.shuju) : {};
    const _0x59006d = Object.keys(_0x407d43);
    console.log("[DB Migration] 在新数据库中找到 " + _0x59006d.length + " 个已存在的 MD5。");
    if (_0x39bc4a === 0 || _0x39bc4a - 1 <= _0x59006d.length) {
      console.log("[DB Migration] 旧数据库为空或没有新数据。");
      _0x1f8e23.close();
      localStorage.setItem(migrationFlag, "true");
      if (confirm("旧数据库为空或没有新数据，是否删除它？")) {
        await indexedDB.deleteDatabase(oldDbName);
      }
      return;
    }
    console.log("[DB Migration] 旧数据库总项目数: " + _0x39bc4a + "。开始迁移...");
    let _0x4a313a = 0;
    let _0x54e823 = 0;
    const _0x4b1ee3 = _0x1f8e23.transaction(objectStoreName, "readonly");
    const _0x2ce17b = _0x4b1ee3.objectStore(objectStoreName);
    const _0xfffccb = _0x2ce17b.openCursor();
    let _0x2b6c96 = [];
    const _0x415547 = async _0x34eaa2 => {
      if (_0x34eaa2.length === 0) {
        return;
      }
      const {
        items: _0x56f832,
        metadataFragment: _0x267053
      } = processMigrationDataForBatch(_0x34eaa2, _0x3d4763, _0x59006d);
      if (_0x56f832.length > 0) {
        const _0x278ae9 = _0x2b7af5.transaction(objectStoreName, "readwrite");
        const _0x18dee0 = _0x278ae9.objectStore(objectStoreName);
        _0x56f832.forEach(_0x51608f => _0x18dee0.put(_0x51608f));
        await new Promise((_0x35e258, _0x5a8073) => {
          _0x278ae9.oncomplete = _0x35e258;
          _0x278ae9.onerror = _0xf6ed0c => _0x5a8073(_0xf6ed0c.target.error);
        });
        Object.assign(_0x407d43, _0x267053);
        _0x54e823 += _0x56f832.length;
      }
      _0x4a313a += _0x34eaa2.length;
      console.log("[DB Migration] 已处理 " + _0x4a313a + "/" + _0x39bc4a + "...");
    };
    await new Promise((_0x45c76a, _0x7a7e3e) => {
      _0xfffccb.onerror = _0x6b1bc9 => _0x7a7e3e(_0x6b1bc9.target.error);
      _0xfffccb.onsuccess = async _0x1e77a9 => {
        const _0x1509d9 = _0x1e77a9.target.result;
        if (_0x1509d9) {
          if (_0x1509d9.value && _0x1509d9.value.id !== metadataId) {
            _0x2b6c96.push(_0x1509d9.value);
          }
          if (_0x2b6c96.length >= _0x292d5e) {
            try {
              await _0x415547(_0x2b6c96);
              _0x2b6c96 = [];
            } catch (_0x3fdf4c) {
              _0x7a7e3e(_0x3fdf4c);
              return;
            }
          }
          _0x1509d9.continue();
        } else {
          try {
            if (_0x2b6c96.length > 0) {
              await _0x415547(_0x2b6c96);
            }
            _0x45c76a();
          } catch (_0x11a546) {
            _0x7a7e3e(_0x11a546);
          }
        }
      };
    });
    _0x1f8e23.close();
    if (_0x54e823 > 0) {
      console.log("[DB Migration] 迁移完成！总共迁移了 " + _0x54e823 + " 张新图片。正在更新最终元数据...");
      await setMetadata(_0x407d43);
    } else {
      console.log("[DB Migration] 没有发现可迁移的新图片。");
    }
    localStorage.setItem(migrationFlag, "true");
    if (confirm("数据迁移完成！共迁移 " + _0x54e823 + " 张新图片。\n\n是否删除旧的数据库以释放磁盘空间？\n\n- 删除后不可恢复。\n- 如果不确定，可以选择“取消”。")) {
      await indexedDB.deleteDatabase(oldDbName);
      console.log("[DB Migration] 旧数据库已删除。");
    } else {
      console.log("[DB Migration] 用户选择保留旧数据库。");
    }
    if (_0x54e823 > 0 && confirm("是否为新迁移的图片生成缩略图？(推荐)")) {
      console.log("[DB Migration] 开始生成缩略图...");
      await generateMissingThumbnails();
    }
    console.log("[DB Migration] 数据库迁移流程完成。");
  } catch (_0x312952) {
    console.error("[DB Migration] 数据库迁移过程中发生错误:", _0x312952);
    alert("数据库迁移失败: " + _0x312952.message + "\n\n请检查控制台获取详细信息。");
    if (_0x1f8e23) {
      _0x1f8e23.close();
    }
    localStorage.setItem(migrationFlag, "true");
  }
}
export async function getItemImg(_0x36682c, _0x3a92c4 = null) {
  const _0x31865d = CryptoJS.MD5(_0x36682c).toString();
  const _0x1b9993 = await getMergedAndSortedImages(_0x31865d);
  if (_0x1b9993.images.length === 0) {
    return [false, false, false, false];
  }
  console.log("[DB] 获取图片 " + _0x36682c + "...", _0x1b9993.currentIndex);
  let _0x264c6e = _0x3a92c4;
  if (_0x264c6e === null || _0x264c6e === undefined) {
    _0x264c6e = _0x1b9993.currentIndex;
  }
  if (_0x264c6e < 0) {
    _0x264c6e = 0;
  }
  if (_0x264c6e >= _0x1b9993.images.length) {
    _0x264c6e = _0x1b9993.images.length - 1;
  }
  await syncIndexToStorage(_0x31865d, _0x264c6e, _0x1b9993.images);
  const _0x4ae08b = _0x1b9993.images[_0x264c6e];
  if (!_0x4ae08b) {
    return [false, false, false, false];
  }
  const _0x3be7d0 = _0x4ae08b.isVideo || false;
  const _0x112aaf = _0x4ae08b.originalUrl || "";
  const _0x40fc8a = extension_settings[extensionName].jiuguanStorage || {};
  const _0x1d9023 = _0x40fc8a[_0x31865d];
  const _0x13b272 = await getMetadata();
  const _0x2e7b26 = _0x13b272[_0x31865d];
  const _0x32d5c6 = _0x1d9023 && _0x1d9023.change || _0x2e7b26 && _0x2e7b26.change || "";
  if (_0x4ae08b.source === "server" && _0x4ae08b.path) {
    try {
      const _0x5239e8 = await fetch(_0x4ae08b.path);
      if (_0x5239e8.ok) {
        const _0x2422bc = await _0x5239e8.blob();
        const _0x9b306d = await blobToBase64(_0x2422bc);
        return [_0x9b306d, _0x32d5c6, _0x264c6e, _0x3be7d0, _0x112aaf];
      }
    } catch (_0x4cfbac) {
      console.error("Failed to fetch image from server:", _0x4cfbac);
    }
  } else if (_0x4ae08b.source === "db" && _0x4ae08b.uuid) {
    const _0x468525 = await storeReadOnly(_0x4ae08b.uuid);
    if (_0x468525 && _0x468525.data) {
      const _0x5c4d20 = _0x3be7d0 ? "video/mp4" : "image/png";
      const _0x6a1472 = "data:" + _0x5c4d20 + ";base64," + arrayBufferToBase64(_0x468525.data);
      return [_0x6a1472, _0x32d5c6, _0x264c6e, _0x3be7d0, _0x112aaf];
    }
  }
  return [false, false, false, false, ""];
}
let cleanupRunning = false;
const _0x251fba = {
  format: "png"
};
export async function setItemImg(_0x4a0d3e, _0x3d9b79, _0x32f9cc = _0x251fba) {
  const {
    change = "",
    characterName = "chatu8",
    filename: _0x4fa8c8,
    format: _0x63c162,
    isVideo = false,
    originalUrl = ""
  } = _0x32f9cc;
  if (extension_settings[extensionName].jiuguanchucun === "true") {
    const _0x11bb7f = CryptoJS.MD5(_0x4a0d3e).toString();
    const _0x233d35 = generateUUID();
    const _0x5a72f2 = generateUUID();
    const _0x50201d = new Date().getTime();
    const _0x3c9821 = _0x3d9b79.split(",")[1] || _0x3d9b79;
    let _0x3cf372 = "png";
    if (isVideo) {
      if (_0x63c162 && _0x63c162.includes("mp4")) {
        _0x3cf372 = "mp4";
      } else if (_0x63c162 && _0x63c162.includes("webm")) {
        _0x3cf372 = "webm";
      } else {
        _0x3cf372 = "mp4";
      }
    } else if (_0x63c162 && !_0x63c162.startsWith("video/") && !_0x63c162.startsWith("image")) {
      _0x3cf372 = _0x63c162;
    }
    const _0x318d6e = {
      image: _0x3c9821,
      format: _0x3cf372
    };
    const _0x5a4fa6 = _0x318d6e;
    if (characterName) {
      _0x5a4fa6.ch_name = characterName;
    }
    if (_0x4fa8c8) {
      _0x5a4fa6.filename = _0x4fa8c8;
    }
    console.log("[DB] Uploading " + (isVideo ? "video" : "image") + " to server, format: " + _0x3cf372 + ", size: " + _0x3c9821.length + " chars");
    try {
      const _0x43d206 = await fetch("/api/images/upload", {
        method: "POST",
        headers: getRequestHeaders(window.token),
        body: JSON.stringify(_0x5a4fa6)
      });
      if (!_0x43d206.ok) {
        throw new Error("Upload failed: " + _0x43d206.statusText);
      }
      const _0x4ce29d = await _0x43d206.json();
      const _0x324e0a = _0x4ce29d.path;
      let _0x59807b = null;
      try {
        let _0x4da2da;
        if (isVideo) {
          _0x4da2da = await createThumbnailFromVideo(_0x3d9b79);
        } else {
          const _0x214059 = base64ToArrayBuffer(_0x3c9821);
          _0x4da2da = await createThumbnailFromBuffer(_0x214059);
        }
        const _0x5b9fc8 = await blobToBase64(_0x4da2da);
        const _0x44c719 = _0x5b9fc8.split(",")[1] || _0x5b9fc8;
        const _0x51c40d = {
          image: _0x44c719,
          format: "jpeg"
        };
        const _0x5c17ee = _0x51c40d;
        if (characterName) {
          _0x5c17ee.ch_name = characterName;
        }
        if (_0x4fa8c8) {
          _0x5c17ee.filename = "thumb_" + (_0x4fa8c8 || _0x233d35);
        }
        const _0x1d8d68 = await fetch("/api/images/upload", {
          method: "POST",
          headers: getRequestHeaders(window.token),
          body: JSON.stringify(_0x5c17ee)
        });
        if (_0x1d8d68.ok) {
          const _0x32277a = await _0x1d8d68.json();
          _0x59807b = _0x32277a.path;
        } else {
          console.error("Failed to upload thumbnail:", _0x1d8d68.statusText);
        }
      } catch (_0x5dfbdb) {
        console.error("Failed to create or upload thumbnail:", _0x5dfbdb);
      }
      if (!extension_settings[extensionName].jiuguanStorage) {
        extension_settings[extensionName].jiuguanStorage = {};
      }
      const _0x2be5a5 = extension_settings[extensionName].jiuguanStorage;
      const _0x1bcefe = {
        uuid: _0x233d35,
        path: _0x324e0a,
        thumbnail_uuid: _0x5a72f2,
        thumbnail_path: _0x59807b,
        date: _0x50201d,
        isVideo: isVideo,
        originalUrl: originalUrl || ""
      };
      const _0x4fb197 = _0x2be5a5[_0x11bb7f];
      if (_0x4fb197) {
        if (!_0x4fb197.images) {
          _0x4fb197.images = [];
        }
        _0x4fb197.images.push(_0x1bcefe);
        _0x4fb197.change = change;
      } else {
        const _0x4c1321 = {
          images: [_0x1bcefe],
          index: 0,
          change: change
        };
        _0x2be5a5[_0x11bb7f] = _0x4c1321;
      }
      const _0x780e1 = await getMergedAndSortedImages(_0x11bb7f);
      _0x2be5a5[_0x11bb7f].index = _0x780e1.images.length > 0 ? _0x780e1.images.length - 1 : 0;
      saveSettingsDebounced();
      await new Promise(_0x1997dd => setTimeout(_0x1997dd, 50));
      if (!window.imagesid) {
        window.imagesid = {};
      }
      window.imagesid[_0x11bb7f] = _0x50201d;
      await updateStegoImage();
      return _0x324e0a;
    } catch (_0xc4e23f) {
      console.error("Failed to upload image to server:", _0xc4e23f);
      throw _0xc4e23f;
    }
  } else {
    const _0x875b91 = CryptoJS.MD5(_0x4a0d3e).toString();
    const _0x2ecc1c = base64ToArrayBuffer(_0x3d9b79.split(",")[1] || _0x3d9b79);
    const _0x542a54 = generateUUID();
    const _0x38c8ea = new Date().getTime();
    const _0x54a73b = generateUUID();
    try {
      let _0x17aefd;
      if (isVideo) {
        _0x17aefd = await createThumbnailFromVideo(_0x3d9b79);
      } else {
        _0x17aefd = await createThumbnailFromBuffer(_0x2ecc1c);
      }
      const _0x5a5e8c = await _0x17aefd.arrayBuffer();
      const _0x31dad0 = {
        id: _0x54a73b,
        data: _0x5a5e8c
      };
      await storeReadWrite(_0x31dad0);
    } catch (_0x23ff8d) {
      console.error("Failed to create or store thumbnail:", _0x23ff8d);
    }
    const _0x10dc14 = {
      id: _0x542a54,
      data: _0x2ecc1c
    };
    await storeReadWrite(_0x10dc14);
    const _0x14c199 = await getMetadata();
    const _0x2093de = _0x14c199[_0x875b91];
    const _0x5193f7 = {
      uuid: _0x542a54,
      thumbnail_uuid: _0x54a73b,
      date: _0x38c8ea,
      isVideo: isVideo,
      originalUrl: originalUrl || ""
    };
    if (_0x2093de) {
      if (!_0x2093de.images) {
        _0x2093de.images = [];
      }
      _0x2093de.images.push(_0x5193f7);
      const _0x5a96c1 = await getMergedAndSortedImages(_0x875b91);
      _0x2093de.change = change;
      _0x2093de.index = _0x5a96c1.images.length || 0;
    } else {
      const _0x1a5245 = await getMergedAndSortedImages(_0x875b91);
      const _0x56f7b4 = {
        images: [_0x5193f7],
        index: _0x1a5245.images.length || 0,
        change: change
      };
      _0x14c199[_0x875b91] = _0x56f7b4;
    }
    await setMetadata(_0x14c199);
    if (!window.imagesid) {
      window.imagesid = {};
    }
    window.imagesid[_0x875b91] = _0x38c8ea;
    return "indexeddb_saved";
  }
}
export async function openDB() {
  if (db) {
    return db;
  }
  return new Promise((_0xfcc5e4, _0x52b081) => {
    const _0x4c3af4 = indexedDB.open(dbName, dbVersion);
    _0x4c3af4.onupgradeneeded = _0x92333e => {
      const _0x17eb03 = _0x92333e.target.result;
      console.log("[DB] 数据库升级: 旧版本 " + _0x92333e.oldVersion + " -> 新版本 " + _0x92333e.newVersion);
      if (!_0x17eb03.objectStoreNames.contains(objectStoreName)) {
        _0x17eb03.createObjectStore(objectStoreName, {
          keyPath: "id"
        });
        console.log("[DB] Object store '" + objectStoreName + "' created.");
      }
      if (!_0x17eb03.objectStoreNames.contains("vocabularies")) {
        _0x17eb03.createObjectStore("vocabularies", {
          keyPath: "fileName"
        });
        console.log("[DB] Object store \"vocabularies\" created.");
      }
      if (!_0x17eb03.objectStoreNames.contains("groups")) {
        const _0x5cbf09 = _0x17eb03.createObjectStore("groups", {
          keyPath: "id_index"
        });
        _0x5cbf09.createIndex("fileName", "fileName", {
          unique: false
        });
        console.log("[DB] Object store \"groups\" created with fileName index.");
      }
      if (!_0x17eb03.objectStoreNames.contains("subgroups")) {
        const _0xc8b721 = _0x17eb03.createObjectStore("subgroups", {
          keyPath: "id_index"
        });
        _0xc8b721.createIndex("fileName", "fileName", {
          unique: false
        });
        console.log("[DB] Object store \"subgroups\" created with fileName index.");
      }
      if (!_0x17eb03.objectStoreNames.contains("tags")) {
        const _0x49b5eb = _0x17eb03.createObjectStore("tags", {
          autoIncrement: true
        });
        _0x49b5eb.createIndex("fileName", "fileName", {
          unique: false
        });
        _0x49b5eb.createIndex("hot", "hot", {
          unique: false
        });
        console.log("[DB] Object store \"tags\" created with fileName and hot indexes.");
      }
      if (_0x92333e.oldVersion < 5) {
        if (_0x17eb03.objectStoreNames.contains("tags")) {
          const _0x58600c = _0x92333e.target.transaction.objectStore("tags");
          if (!_0x58600c.indexNames.contains("hot")) {
            _0x58600c.createIndex("hot", "hot", {
              unique: false
            });
            console.log("[DB] Index \"hot\" created for \"tags\" store.");
          }
        }
      }
      if (_0x92333e.oldVersion < 6) {
        console.log("[DB] Upgrading to v6: Add default hot value to tags.json entries.");
        const _0x2792d3 = _0x92333e.target.transaction.objectStore("tags");
        const _0x59c540 = _0x2792d3.index("fileName");
        const _0xc32134 = _0x59c540.openCursor(IDBKeyRange.only("tags.json"));
        _0xc32134.onsuccess = _0x50fedc => {
          const _0x3fd995 = _0x50fedc.target.result;
          if (_0x3fd995) {
            const _0x4bccc2 = _0x3fd995.value;
            if (_0x4bccc2.hot === undefined) {
              _0x4bccc2.hot = -1;
            }
            _0x3fd995.update(_0x4bccc2);
            _0x3fd995.continue();
          } else {
            console.log("[DB] v6 upgrade complete for tags.json.");
          }
        };
      }
    };
    _0x4c3af4.onerror = _0x48d6ad => {
      console.error("[DB] 打开数据库失败:", _0x48d6ad.target.error);
      _0x52b081(_0x48d6ad.target.error);
    };
    _0x4c3af4.onsuccess = _0x410d5f => {
      db = _0x410d5f.target.result;
      console.log("[DB] 数据库 '" + dbName + "' v" + dbVersion + " 打开成功。");
      _0xfcc5e4(db);
    };
  });
}
export async function storeReadWrite(_0x220063) {
  const _0xadfe5f = db || (await openDB());
  const _0x1d7ed7 = _0xadfe5f.transaction([objectStoreName], "readwrite");
  const _0x519745 = _0x1d7ed7.objectStore(objectStoreName);
  return new Promise((_0x3c9d3c, _0x6b05ed) => {
    const _0x3bcfe8 = _0x519745.put(_0x220063);
    _0x3bcfe8.onsuccess = () => _0x3c9d3c();
    _0x3bcfe8.onerror = _0xa90bba => _0x6b05ed(_0xa90bba.target.error);
  });
}
async function getManualTags() {
  const _0xd87314 = await openDB();
  const _0x596fd4 = _0xd87314.transaction("tags", "readonly");
  const _0xfcfb78 = _0x596fd4.objectStore("tags");
  const _0x52e594 = _0xfcfb78.index("fileName");
  const _0x478f16 = _0x52e594.getAll(IDBKeyRange.only("manual"));
  return new Promise((_0x4e1020, _0x22baa6) => {
    _0x478f16.onsuccess = () => _0x4e1020(_0x478f16.result);
    _0x478f16.onerror = _0x3d97eb => _0x22baa6(_0x3d97eb.target.error);
  });
}
async function deleteTagByName(_0x4cda2a) {
  const _0x34ee67 = await openDB();
  const _0x31bc09 = _0x34ee67.transaction("tags", "readwrite");
  const _0x2fa3b4 = _0x31bc09.objectStore("tags");
  const _0x3b383b = _0x2fa3b4.openCursor();
  let _0x411165 = null;
  await new Promise((_0x21841b, _0xfb3049) => {
    _0x3b383b.onsuccess = _0x419908 => {
      const _0x3a2e4b = _0x419908.target.result;
      if (_0x3a2e4b) {
        if (_0x3a2e4b.value.name === _0x4cda2a && _0x3a2e4b.value.fileName === "manual") {
          _0x411165 = _0x3a2e4b.primaryKey;
          _0x3a2e4b.delete();
          _0x21841b();
          return;
        }
        _0x3a2e4b.continue();
      } else {
        _0x21841b();
      }
    };
    _0x3b383b.onerror = _0x566745 => _0xfb3049(_0x566745.target.error);
  });
  return new Promise((_0x50f541, _0x5f5a64) => {
    _0x31bc09.oncomplete = () => {
      if (_0x411165 !== null) {
        _0x50f541(true);
      } else {
        _0x50f541(false);
      }
    };
    _0x31bc09.onerror = _0x483426 => _0x5f5a64(_0x483426.target.error);
  });
}
export async function storeReadOnly(_0x5a884c) {
  const _0x1d8a79 = await openDB();
  const _0x3aadcb = _0x1d8a79.transaction([objectStoreName], "readonly");
  const _0x4ee350 = _0x3aadcb.objectStore(objectStoreName);
  return new Promise((_0x70337d, _0x57b9e7) => {
    const _0x34eaab = _0x4ee350.get(_0x5a884c);
    _0x34eaab.onsuccess = _0x1335c0 => _0x70337d(_0x1335c0.target.result);
    _0x34eaab.onerror = _0x3f85f0 => _0x57b9e7(_0x3f85f0.target.error);
  });
}
export async function storeDelete(_0x5474dd) {
  const _0x5137dc = db || (await openDB());
  const _0x477dac = _0x5137dc.transaction([objectStoreName], "readwrite");
  const _0x349d33 = _0x477dac.objectStore(objectStoreName);
  return new Promise((_0x4face7, _0x194e77) => {
    const _0x4772e3 = _0x349d33.delete(_0x5474dd);
    _0x4772e3.onsuccess = () => _0x4face7();
    _0x4772e3.onerror = _0x270f25 => _0x194e77(_0x270f25.target.error);
  });
}
async function getMetadata() {
  const _0x3b2eb5 = await storeReadOnly(metadataId);
  if (_0x3b2eb5 && _0x3b2eb5.shuju) {
    try {
      return JSON.parse(_0x3b2eb5.shuju);
    } catch (_0x4cbc4b) {
      console.error("Failed to parse image metadata:", _0x4cbc4b);
    }
  }
  return {};
}
async function setMetadata(_0x4b9caf) {
  await storeReadWrite({
    id: metadataId,
    shuju: JSON.stringify(_0x4b9caf)
  });
}
export async function generateMissingThumbnails() {
  console.log("Checking for missing thumbnails...");
  const _0x1ec168 = await getMetadata();
  let _0x37259a = false;
  let _0x4e3e8e = false;
  for (const _0x570e8a in _0x1ec168) {
    const _0x5bbd9d = _0x1ec168[_0x570e8a];
    if (_0x5bbd9d && _0x5bbd9d.images) {
      if (_0x5bbd9d.images.some(_0x1bda3d => !_0x1bda3d.thumbnail_uuid)) {
        _0x4e3e8e = true;
        break;
      }
    }
  }
  if (!_0x4e3e8e) {
    console.log("No missing thumbnails found. Aborting generation.");
    return;
  }
  for (const _0x29901c in _0x1ec168) {
    const _0x33296c = _0x1ec168[_0x29901c];
    if (_0x33296c && _0x33296c.images) {
      for (const _0x393164 of _0x33296c.images) {
        if (!_0x393164.thumbnail_uuid) {
          console.log("Generating thumbnail for image " + _0x393164.uuid + "...");
          try {
            const _0x48019f = await storeReadOnly(_0x393164.uuid);
            if (_0x48019f && _0x48019f.data) {
              const _0x32b978 = await createThumbnailFromBuffer(_0x48019f.data);
              const _0x58ab57 = await _0x32b978.arrayBuffer();
              const _0x58542d = generateUUID();
              const _0x985de4 = {
                id: _0x58542d,
                data: _0x58ab57
              };
              await storeReadWrite(_0x985de4);
              _0x393164.thumbnail_uuid = _0x58542d;
              _0x37259a = true;
              console.log("Thumbnail " + _0x58542d + " created for image " + _0x393164.uuid + ".");
            }
          } catch (_0x33551b) {
            console.error("Failed to generate thumbnail for " + _0x393164.uuid + ":", _0x33551b);
          }
          await new Promise(_0x50a5eb => setTimeout(_0x50a5eb, 2000));
        }
      }
    }
  }
  if (_0x37259a) {
    console.log("Finished generating missing thumbnails. Saving metadata...");
    await setMetadata(_0x1ec168);
  }
}
export async function getItemBlob(_0x446977, _0x2d1a3a = null) {
  const _0xf8ed9 = CryptoJS.MD5(_0x446977).toString();
  const _0x3a2702 = extension_settings[extensionName].jiuguanStorage || {};
  const _0x49ccc0 = _0x3a2702[_0xf8ed9];
  if (_0x49ccc0 && Array.isArray(_0x49ccc0.images) && _0x49ccc0.images.length > 0) {
    let _0x769927 = _0x2d1a3a;
    if (_0x769927 === null || _0x769927 === undefined) {
      _0x769927 = _0x49ccc0.index || 0;
    }
    if (_0x769927 < 0 || _0x769927 >= _0x49ccc0.images.length) {
      _0x769927 = _0x49ccc0.images.length - 1;
    }
    const _0x5e2f32 = _0x49ccc0.images[_0x769927];
    if (_0x5e2f32 && _0x5e2f32.path) {
      try {
        const _0x5ad4b5 = await fetch(_0x5e2f32.path);
        if (_0x5ad4b5.ok) {
          return await _0x5ad4b5.blob();
        }
      } catch (_0x127f82) {
        console.error("Failed to fetch image blob from server:", _0x127f82);
      }
    }
  }
  const _0x1db282 = await getMetadata();
  const _0x22c6ef = _0x1db282[_0xf8ed9];
  if (_0x22c6ef && Array.isArray(_0x22c6ef.images) && _0x22c6ef.images.length > 0) {
    let _0x1f67da = _0x2d1a3a;
    if (_0x1f67da === null || _0x1f67da === undefined) {
      _0x1f67da = _0x22c6ef.index || 0;
    }
    if (_0x1f67da < 0 || _0x1f67da >= _0x22c6ef.images.length) {
      _0x1f67da = _0x22c6ef.images.length - 1;
    }
    const _0x4e0081 = _0x22c6ef.images[_0x1f67da];
    if (!_0x4e0081) {
      return null;
    }
    const _0x217c37 = _0x4e0081.uuid;
    const _0x1afd61 = await storeReadOnly(_0x217c37);
    if (_0x1afd61 && _0x1afd61.data) {
      return new Blob([_0x1afd61.data], {
        type: "image/png"
      });
    }
  }
  return null;
}
export async function updateImageIndex(_0x24ad2f, _0x39decb) {
  const _0x577ad5 = CryptoJS.MD5(_0x24ad2f).toString();
  const _0x4a1567 = await getMergedAndSortedImages(_0x577ad5);
  if (_0x4a1567.images.length === 0) {
    console.error("No images found for tag " + _0x24ad2f);
    return;
  }
  await syncIndexToStorage(_0x577ad5, _0x39decb, _0x4a1567.images);
  await updateStegoImage();
}
export async function deleteImage(_0xd1529a, _0x476ec0) {
  const _0x24a38c = CryptoJS.MD5(_0xd1529a).toString();
  const _0x290064 = await getMergedAndSortedImages(_0x24a38c);
  if (!_0x290064.images || _0x290064.images.length === 0) {
    console.warn("No images found for tag: " + _0xd1529a);
    return;
  }
  if (_0x476ec0 < 0 || _0x476ec0 >= _0x290064.images.length) {
    console.error("Index " + _0x476ec0 + " out of bounds for tag " + _0xd1529a);
    return;
  }
  const _0x891a86 = _0x290064.images[_0x476ec0];
  const _0x4ca7ca = _0x891a86.source;
  if (_0x4ca7ca === "server") {
    const _0x1af6f8 = extension_settings[extensionName].jiuguanStorage;
    const _0x4107ae = _0x1af6f8?.[_0x24a38c];
    if (_0x4107ae && Array.isArray(_0x4107ae.images)) {
      const _0xacc0f8 = _0x4107ae.images.findIndex(_0x3016e8 => _0x3016e8.uuid === _0x891a86.uuid);
      if (_0xacc0f8 !== -1) {
        const [_0x2d6671] = _0x4107ae.images.splice(_0xacc0f8, 1);
        const _0x4f90b1 = [];
        if (_0x2d6671.path) {
          _0x4f90b1.push(_0x2d6671.path);
        }
        if (_0x2d6671.thumbnail_path) {
          _0x4f90b1.push(_0x2d6671.thumbnail_path);
        }
        for (const _0x59cab6 of _0x4f90b1) {
          try {
            const _0x1a4921 = {
              path: _0x59cab6
            };
            const _0x801b8a = await fetch("/api/images/delete", {
              method: "POST",
              headers: getRequestHeaders(window.token),
              body: JSON.stringify(_0x1a4921)
            });
            if (!_0x801b8a.ok) {
              console.error("Failed to delete image from server: " + _0x801b8a.statusText);
            }
          } catch (_0x56ab29) {
            console.error("Failed to delete image from server:", _0x56ab29);
          }
        }
        if (_0x4107ae.images.length === 0) {
          delete _0x1af6f8[_0x24a38c];
        } else if (_0x4107ae.index >= _0x4107ae.images.length) {
          _0x4107ae.index = _0x4107ae.images.length - 1;
        }
        saveSettingsDebounced();
        await updateStegoImage();
      }
    }
  } else if (_0x4ca7ca === "db") {
    const _0x517028 = await getMetadata();
    const _0x4fa93e = _0x517028[_0x24a38c];
    if (_0x4fa93e && Array.isArray(_0x4fa93e.images)) {
      const _0x2d932b = _0x4fa93e.images.findIndex(_0x44a95e => _0x44a95e.uuid === _0x891a86.uuid);
      if (_0x2d932b !== -1) {
        const [_0x525d1f] = _0x4fa93e.images.splice(_0x2d932b, 1);
        if (_0x525d1f.uuid) {
          await storeDelete(_0x525d1f.uuid);
        }
        if (_0x525d1f.thumbnail_uuid) {
          await storeDelete(_0x525d1f.thumbnail_uuid);
        }
        if (_0x4fa93e.images.length === 0) {
          delete _0x517028[_0x24a38c];
        } else if (_0x4fa93e.index >= _0x4fa93e.images.length) {
          _0x4fa93e.index = _0x4fa93e.images.length - 1;
        }
        await setMetadata(_0x517028);
      }
    }
  }
  if (window.imagesid && window.imagesid[_0x24a38c]) {
    const _0x365b45 = await getMergedAndSortedImages(_0x24a38c);
    if (_0x365b45.images.length === 0) {
      delete window.imagesid[_0x24a38c];
    } else {
      const _0x2efdb4 = _0x365b45.images.map(_0x46403d => _0x46403d.date).filter(_0x20d947 => _0x20d947);
      if (_0x2efdb4.length > 0) {
        window.imagesid[_0x24a38c] = Math.max(..._0x2efdb4);
      } else {
        delete window.imagesid[_0x24a38c];
      }
    }
  }
}
export async function migrateDatabase() {
  console.log("Manual database migration triggered...");
  try {
    await migrateOldSettings();
    if (confirm("是否查找迁移数据库(缓存图片)？")) {
      await performMigration();
    }
    console.log("Database migration check complete.");
  } catch (_0x252004) {
    console.error("Error during manual migration trigger:", _0x252004);
  }
}
export async function getAllImages(_0x4e3a40) {
  const _0x481131 = [];
  let _0x4ea6fc = _0x4e3a40;
  if (_0x4e3a40.length !== 32) {
    _0x4ea6fc = CryptoJS.MD5(_0x4e3a40).toString();
  }
  const _0x51e5c7 = extension_settings[extensionName].jiuguanStorage || {};
  const _0x55f914 = _0x51e5c7[_0x4ea6fc] || _0x51e5c7[_0x4e3a40];
  if (_0x55f914 && Array.isArray(_0x55f914.images)) {
    const _0x3dbace = _0x55f914.images.map(async _0x5907ae => {
      if (_0x5907ae.path) {
        try {
          const _0x48510d = await fetch(_0x5907ae.path);
          if (_0x48510d.ok) {
            const _0x2690de = await _0x48510d.blob();
            return await blobToBase64(_0x2690de);
          }
        } catch (_0x4c2c86) {
          console.error("Failed to fetch image:", _0x4c2c86);
        }
      }
      return null;
    });
    const _0x28e392 = await Promise.all(_0x3dbace);
    _0x481131.push(..._0x28e392.filter(_0x2a96ee => _0x2a96ee !== null));
  }
  const _0x47cd10 = await getMetadata();
  const _0x3ffcee = _0x47cd10[_0x4ea6fc] || _0x47cd10[_0x4e3a40];
  if (_0x3ffcee && Array.isArray(_0x3ffcee.images)) {
    const _0x12e207 = _0x3ffcee.images.map(async _0x39b0de => {
      const _0x202ff6 = await storeReadOnly(_0x39b0de.uuid);
      if (_0x202ff6 && _0x202ff6.data) {
        return "data:image/png;base64," + arrayBufferToBase64(_0x202ff6.data);
      }
      return null;
    });
    const _0x32f117 = await Promise.all(_0x12e207);
    _0x481131.push(..._0x32f117.filter(_0x53bc8 => _0x53bc8 !== null));
  }
  return _0x481131;
}
export async function getAllImageBlobs(_0x12894e) {
  const _0x9bcbb2 = [];
  let _0x22622d = _0x12894e;
  if (_0x12894e.length !== 32) {
    _0x22622d = CryptoJS.MD5(_0x12894e).toString();
  }
  const _0x53c199 = extension_settings[extensionName].jiuguanStorage || {};
  const _0x1358a0 = _0x53c199[_0x22622d] || _0x53c199[_0x12894e];
  if (_0x1358a0 && Array.isArray(_0x1358a0.images)) {
    const _0x1713aa = _0x1358a0.images.map(async _0x451ad2 => {
      if (_0x451ad2.path) {
        try {
          const _0x56cddc = await fetch(_0x451ad2.path);
          if (_0x56cddc.ok) {
            return await _0x56cddc.blob();
          }
        } catch (_0x182a61) {
          console.error("Failed to fetch image blob:", _0x182a61);
        }
      }
      return null;
    });
    const _0x2a53d1 = await Promise.all(_0x1713aa);
    _0x9bcbb2.push(..._0x2a53d1.filter(_0x34e580 => _0x34e580 !== null));
  }
  const _0x63c94d = await getMetadata();
  const _0x181b00 = _0x63c94d[_0x22622d] || _0x63c94d[_0x12894e];
  if (_0x181b00 && Array.isArray(_0x181b00.images)) {
    const _0x1a8669 = _0x181b00.images.map(async _0x1b2296 => {
      const _0x36ba7c = await storeReadOnly(_0x1b2296.uuid);
      if (_0x36ba7c && _0x36ba7c.data) {
        return new Blob([_0x36ba7c.data], {
          type: "image/png"
        });
      }
      return null;
    });
    const _0x23ab7f = await Promise.all(_0x1a8669);
    _0x9bcbb2.push(..._0x23ab7f.filter(_0x516402 => _0x516402 !== null));
  }
  return _0x9bcbb2;
}
export async function getImageByUUID(_0x22e362) {
  const _0x18273a = await storeReadOnly(_0x22e362);
  if (_0x18273a && _0x18273a.data) {
    return "data:image/png;base64," + arrayBufferToBase64(_0x18273a.data);
  }
  return null;
}
export async function getImageBlobByUUID(_0x45a791) {
  const _0x55b080 = await storeReadOnly(_0x45a791);
  if (_0x55b080 && _0x55b080.data) {
    return new Blob([_0x55b080.data], {
      type: "image/png"
    });
  }
  const _0x3c091a = extension_settings[extensionName].jiuguanStorage || {};
  for (const _0x5acc8a in _0x3c091a) {
    const _0x36b101 = _0x3c091a[_0x5acc8a];
    if (_0x36b101 && Array.isArray(_0x36b101.images)) {
      const _0x1e866d = _0x36b101.images.find(_0x144c14 => _0x144c14.uuid === _0x45a791);
      if (_0x1e866d && _0x1e866d.path) {
        try {
          const _0x5a17cc = await fetch(_0x1e866d.path);
          if (_0x5a17cc.ok) {
            return await _0x5a17cc.blob();
          } else {
            console.error("Failed to fetch image from server: " + _0x5a17cc.statusText);
          }
        } catch (_0x4d3bbc) {
          console.error("Failed to fetch image blob from server for uuid " + _0x45a791 + ":", _0x4d3bbc);
        }
      }
    }
  }
  return null;
}
export async function getImageThumbnailBlobByUUID(_0x47d250) {
  if (!_0x47d250) {
    return null;
  }
  const _0x23b96c = await storeReadOnly(_0x47d250);
  if (_0x23b96c && _0x23b96c.data) {
    const _0x5f4b9a = new Uint8Array(_0x23b96c.data);
    let _0x1eb5a0 = "image/png";
    if (_0x5f4b9a[0] === 255 && _0x5f4b9a[1] === 216 && _0x5f4b9a[2] === 255) {
      _0x1eb5a0 = "image/jpeg";
    }
    const _0x185ad2 = {
      type: _0x1eb5a0
    };
    return new Blob([_0x23b96c.data], _0x185ad2);
  }
  return null;
}
export async function getAllImageMetadata() {
  const _0x12ab45 = {};
  const _0x115d74 = extension_settings[extensionName].jiuguanStorage || {};
  for (const _0x27fe7b in _0x115d74) {
    const _0x53b22e = _0x115d74[_0x27fe7b];
    if (_0x53b22e && _0x53b22e.images) {
      _0x12ab45[_0x27fe7b] = {
        ..._0x53b22e,
        images: _0x53b22e.images.map(_0x43e9d9 => ({
          ..._0x43e9d9,
          source: "server"
        }))
      };
    }
  }
  const _0x476796 = await getMetadata();
  for (const _0x4e9bfc in _0x476796) {
    const _0xdab0a8 = _0x476796[_0x4e9bfc];
    if (_0xdab0a8 && _0xdab0a8.images) {
      if (!_0x12ab45[_0x4e9bfc]) {
        _0x12ab45[_0x4e9bfc] = {
          ..._0xdab0a8,
          images: _0xdab0a8.images.map(_0x1cfa5f => ({
            ..._0x1cfa5f,
            source: "db"
          }))
        };
      } else {
        _0x12ab45[_0x4e9bfc].images.push(..._0xdab0a8.images.map(_0x32d40e => ({
          ..._0x32d40e,
          source: "db"
        })));
      }
    }
  }
  return _0x12ab45;
}
export async function deleteMultipleImages(_0x278a24) {
  if (!Array.isArray(_0x278a24) || _0x278a24.length === 0) {
    return;
  }
  const _0x3ef5a4 = extension_settings[extensionName].jiuguanStorage;
  if (_0x3ef5a4) {
    const _0x7352ae = [];
    _0x278a24.forEach(_0x1aa7b9 => {
      const _0x14901c = _0x3ef5a4[_0x1aa7b9];
      if (_0x14901c && _0x14901c.images) {
        _0x14901c.images.forEach(_0x12f7b7 => {
          if (_0x12f7b7.path) {
            _0x7352ae.push(_0x12f7b7.path);
          }
          if (_0x12f7b7.thumbnail_path) {
            _0x7352ae.push(_0x12f7b7.thumbnail_path);
          }
        });
        delete _0x3ef5a4[_0x1aa7b9];
        if (window.imagesid && window.imagesid[_0x1aa7b9]) {
          delete window.imagesid[_0x1aa7b9];
        }
      }
    });
    for (const _0x20bc49 of _0x7352ae) {
      try {
        const _0x4cd6c5 = {
          path: _0x20bc49
        };
        const _0x3963ad = await fetch("/api/images/delete", {
          method: "POST",
          headers: getRequestHeaders(window.token),
          body: JSON.stringify(_0x4cd6c5)
        });
        if (!_0x3963ad.ok) {
          console.error("Failed to delete image from server: " + _0x20bc49);
        }
      } catch (_0x4bb619) {
        console.error("Failed to delete image from server: " + _0x20bc49, _0x4bb619);
      }
    }
    saveSettingsDebounced();
    await updateStegoImage();
  }
  const _0xe2ad8 = await getMetadata();
  const _0x29ea6e = [];
  let _0x3c7d00 = false;
  _0x278a24.forEach(_0x2f1098 => {
    const _0x36cfcb = _0xe2ad8[_0x2f1098];
    if (_0x36cfcb && _0x36cfcb.images) {
      _0x36cfcb.images.forEach(_0x2754dd => {
        if (_0x2754dd.uuid) {
          _0x29ea6e.push(_0x2754dd.uuid);
        }
        if (_0x2754dd.thumbnail_uuid) {
          _0x29ea6e.push(_0x2754dd.thumbnail_uuid);
        }
      });
      delete _0xe2ad8[_0x2f1098];
      _0x3c7d00 = true;
      if (window.imagesid && window.imagesid[_0x2f1098]) {
        delete window.imagesid[_0x2f1098];
      }
    }
  });
  if (_0x29ea6e.length > 0) {
    const _0x284087 = await openDB();
    const _0x16e215 = _0x284087.transaction([objectStoreName], "readwrite");
    const _0x3ef782 = _0x16e215.objectStore(objectStoreName);
    const _0x433dff = _0x29ea6e.map(_0x18f723 => {
      if (!_0x18f723) {
        return Promise.resolve();
      }
      return new Promise((_0x35217f, _0x46e902) => {
        const _0x3ba42d = _0x3ef782.delete(_0x18f723);
        _0x3ba42d.onsuccess = _0x35217f;
        _0x3ba42d.onerror = _0x46e902;
      });
    });
    await Promise.all(_0x433dff);
  }
  if (_0x3c7d00) {
    await setMetadata(_0xe2ad8);
  }
}
export async function deleteImagesByUuids(_0x4fbba0) {
  if (!Array.isArray(_0x4fbba0) || _0x4fbba0.length === 0) {
    return;
  }
  const _0x2d74aa = extension_settings[extensionName].jiuguanStorage;
  if (_0x2d74aa) {
    const _0x317233 = [];
    const _0x296db5 = new Map();
    for (const [_0xefe2a0, _0x4cf917] of Object.entries(_0x2d74aa)) {
      if (_0x4cf917.images && Array.isArray(_0x4cf917.images)) {
        _0x4cf917.images.forEach((_0x126ca3, _0x1580cd) => {
          _0x296db5.set(_0x126ca3.uuid, {
            md5: _0xefe2a0,
            index: _0x1580cd,
            path: _0x126ca3.path,
            thumbnail_path: _0x126ca3.thumbnail_path
          });
        });
      }
    }
    _0x4fbba0.forEach(_0x50947c => {
      const _0x5958a5 = _0x296db5.get(_0x50947c);
      if (_0x5958a5) {
        const {
          md5: _0x52026b,
          index: _0x97a2f0,
          path: _0x1b9ffd,
          thumbnail_path: _0x151d6d
        } = _0x5958a5;
        const _0x3733ba = _0x2d74aa[_0x52026b];
        if (_0x3733ba && _0x3733ba.images) {
          _0x3733ba.images.splice(_0x97a2f0, 1);
          if (_0x1b9ffd) {
            _0x317233.push(_0x1b9ffd);
          }
          if (_0x151d6d) {
            _0x317233.push(_0x151d6d);
          }
          if (_0x3733ba.images.length === 0) {
            delete _0x2d74aa[_0x52026b];
            if (window.imagesid && window.imagesid[_0x52026b]) {
              delete window.imagesid[_0x52026b];
            }
          } else {
            if (_0x3733ba.index >= _0x3733ba.images.length) {
              _0x3733ba.index = _0x3733ba.images.length - 1;
            }
            if (window.imagesid && window.imagesid[_0x52026b]) {
              const _0xb51009 = _0x3733ba.images.map(_0x2ccab5 => _0x2ccab5.date).filter(_0x46aa0d => _0x46aa0d);
              if (_0xb51009.length > 0) {
                window.imagesid[_0x52026b] = Math.max(..._0xb51009);
              } else {
                delete window.imagesid[_0x52026b];
              }
            }
          }
        }
      }
    });
    for (const _0x1035c7 of _0x317233) {
      try {
        const _0x1d9d39 = {
          path: _0x1035c7
        };
        const _0x37bd57 = await fetch("/api/images/delete", {
          method: "POST",
          headers: getRequestHeaders(window.token),
          body: JSON.stringify(_0x1d9d39)
        });
        if (!_0x37bd57.ok) {
          console.error("Failed to delete image from server: " + _0x1035c7);
        }
      } catch (_0x1af9cb) {
        console.error("Failed to delete image from server: " + _0x1035c7, _0x1af9cb);
      }
    }
    saveSettingsDebounced();
  }
  const _0x4d57a9 = await getMetadata();
  let _0x191794 = false;
  const _0x2dcd7e = new Set();
  const _0x2622eb = new Map();
  for (const [_0x241726, _0x4f66f8] of Object.entries(_0x4d57a9)) {
    if (_0x4f66f8.images && Array.isArray(_0x4f66f8.images)) {
      _0x4f66f8.images.forEach(_0x1e63be => _0x2622eb.set(_0x1e63be.uuid, _0x241726));
    }
  }
  _0x4fbba0.forEach(_0x48bbb6 => {
    const _0x183f99 = _0x2622eb.get(_0x48bbb6);
    if (_0x183f99 && _0x4d57a9[_0x183f99]) {
      const _0x3ab3c2 = _0x4d57a9[_0x183f99];
      const _0x479797 = _0x3ab3c2.images.findIndex(_0x5eeef1 => _0x5eeef1.uuid === _0x48bbb6);
      if (_0x479797 > -1) {
        const [_0x4cbb7f] = _0x3ab3c2.images.splice(_0x479797, 1);
        if (_0x4cbb7f.uuid) {
          _0x2dcd7e.add(_0x4cbb7f.uuid);
        }
        if (_0x4cbb7f.thumbnail_uuid) {
          _0x2dcd7e.add(_0x4cbb7f.thumbnail_uuid);
        }
        _0x191794 = true;
        if (_0x3ab3c2.images.length === 0) {
          delete _0x4d57a9[_0x183f99];
          if (window.imagesid && window.imagesid[_0x183f99]) {
            delete window.imagesid[_0x183f99];
          }
        } else {
          if (_0x3ab3c2.index >= _0x3ab3c2.images.length) {
            _0x3ab3c2.index = _0x3ab3c2.images.length - 1;
          }
          if (window.imagesid && window.imagesid[_0x183f99]) {
            const _0x1a914c = _0x3ab3c2.images.map(_0x45ea17 => _0x45ea17.date).filter(_0x5a662a => _0x5a662a);
            if (_0x1a914c.length > 0) {
              window.imagesid[_0x183f99] = Math.max(..._0x1a914c);
            } else {
              delete window.imagesid[_0x183f99];
            }
          }
        }
      }
    }
  });
  if (_0x2dcd7e.size > 0) {
    const _0x2ec1b9 = await openDB();
    const _0x516e90 = _0x2ec1b9.transaction([objectStoreName], "readwrite");
    const _0x55e36b = _0x516e90.objectStore(objectStoreName);
    const _0x3956f3 = Array.from(_0x2dcd7e).map(_0x432114 => {
      return new Promise((_0x375d55, _0x133335) => {
        const _0x56e942 = _0x55e36b.delete(_0x432114);
        _0x56e942.onsuccess = _0x375d55;
        _0x56e942.onerror = _0x133335;
      });
    });
    await Promise.all(_0x3956f3);
  }
  if (_0x191794) {
    await setMetadata(_0x4d57a9);
  }
}
async function installVocabulary(_0x868f35, _0x3c933b) {
  const _0x479444 = await openDB();
  const _0x530031 = _0x3c933b.tag_groups && _0x3c933b.tag_groups.length > 0 || _0x3c933b.tag_tags && _0x3c933b.tag_tags.length > 0;
  const _0x13f048 = _0x530031 ? ["vocabularies", "groups", "subgroups", "tags"] : ["vocabularies", "tags"];
  const _0xeb7db7 = _0x479444.transaction(_0x13f048, "readwrite");
  const _0x3bab16 = _0xeb7db7.objectStore("vocabularies");
  const _0x16d25f = _0xeb7db7.objectStore("tags");
  const _0x8aeae5 = _0x530031 ? _0xeb7db7.objectStore("groups") : null;
  const _0x4f8179 = _0x530031 ? _0xeb7db7.objectStore("subgroups") : null;
  for (const _0x3c742b of _0x13f048) {
    if (_0x3c742b === "vocabularies") {
      await new Promise((_0x221cfb, _0x3590f8) => {
        const _0x19f495 = _0xeb7db7.objectStore(_0x3c742b).delete(_0x868f35);
        _0x19f495.onsuccess = _0x221cfb;
        _0x19f495.onerror = _0x3590f8;
      });
    } else {
      const _0x3a0f4f = _0xeb7db7.objectStore(_0x3c742b);
      const _0xf2650 = _0x3a0f4f.index("fileName");
      let _0x2c2601 = _0xf2650.openKeyCursor(IDBKeyRange.only(_0x868f35));
      await new Promise(async (_0x33596e, _0x2276ce) => {
        const _0x3702bb = [];
        _0x2c2601.onsuccess = _0x2098ed => {
          const _0x620652 = _0x2098ed.target.result;
          if (_0x620652) {
            _0x3702bb.push(_0x620652.primaryKey);
            _0x620652.continue();
          } else {
            Promise.all(_0x3702bb.map(_0x4c5a2d => _0x3a0f4f.delete(_0x4c5a2d))).then(_0x33596e).catch(_0x2276ce);
          }
        };
        _0x2c2601.onerror = _0x23a9f0 => _0x2276ce(_0x23a9f0.target.error);
      });
    }
  }
  let _0xc409b4 = 0;
  if (_0x530031) {
    const {
      tag_groups: _0xda485,
      tag_tags: _0x1ffe49
    } = _0x3c933b;
    if (_0xda485 && _0xda485.length === 1 && (!_0xda485[0].subgroups || _0xda485[0].subgroups.length === 0)) {
      const _0x36fc15 = _0xda485[0];
      const _0x5275b4 = {
        id_index: _0x36fc15.id_index,
        group_id: _0x36fc15.id_index,
        name: _0x36fc15.name,
        fileName: _0x868f35
      };
      const _0x2b07fe = _0x5275b4;
      _0x4f8179.put(_0x2b07fe);
      if (_0x1ffe49) {
        _0xc409b4 = _0x1ffe49.length;
        for (const _0x2254fd of _0x1ffe49) {
          const _0x161ea5 = {
            name: _0x2254fd.text,
            translation: _0x2254fd.desc,
            subgroup_id: _0x2b07fe.id_index,
            hot: -1,
            fileName: _0x868f35
          };
          const _0xb7d308 = _0x161ea5;
          _0x16d25f.put(_0xb7d308);
        }
      }
      const {
        subgroups: _0x352a1e,
        ..._0x43f586
      } = _0x36fc15;
      const _0x559c8e = {
        ..._0x43f586
      };
      _0x559c8e.fileName = _0x868f35;
      _0x8aeae5.put(_0x559c8e);
    } else {
      if (_0xda485) {
        for (const _0x337525 of _0xda485) {
          if (_0x337525.subgroups && Array.isArray(_0x337525.subgroups)) {
            for (const _0x40553c of _0x337525.subgroups) {
              const _0x25f4c4 = {
                ..._0x40553c
              };
              _0x25f4c4.group_id = _0x337525.id_index;
              _0x25f4c4.fileName = _0x868f35;
              _0x4f8179.put(_0x25f4c4);
            }
          }
          const {
            subgroups: _0x430296,
            ..._0x539465
          } = _0x337525;
          const _0x306836 = {
            ..._0x539465
          };
          _0x306836.fileName = _0x868f35;
          _0x8aeae5.put(_0x306836);
        }
      }
      if (_0x1ffe49) {
        _0xc409b4 = _0x1ffe49.length;
        for (const _0x3a0fe4 of _0x1ffe49) {
          const _0x1de6bd = {
            name: _0x3a0fe4.text,
            translation: _0x3a0fe4.desc,
            subgroup_id: _0x3a0fe4.subgroup_id,
            hot: -1,
            fileName: _0x868f35
          };
          const _0xbf9a66 = _0x1de6bd;
          _0x16d25f.put(_0xbf9a66);
        }
      }
    }
  } else {
    let _0x5654ff = [];
    if (_0x3c933b.danbooru_tag) {
      _0x5654ff = _0x3c933b.danbooru_tag;
    } else if (Array.isArray(_0x3c933b)) {
      _0x5654ff = _0x3c933b;
    }
    _0xc409b4 = _0x5654ff.length;
    for (const _0x5265cc of _0x5654ff) {
      const _0x3416c9 = {
        name: typeof _0x5265cc === "object" ? _0x5265cc.tag || _0x5265cc.name : _0x5265cc,
        translation: typeof _0x5265cc === "object" ? _0x5265cc.translate || _0x5265cc.translation : "",
        hot: typeof _0x5265cc === "object" ? _0x5265cc.hot || 0 : 0,
        fileName: _0x868f35
      };
      _0x16d25f.put(_0x3416c9);
    }
  }
  _0x3bab16.put({
    fileName: _0x868f35,
    tagCount: _0xc409b4,
    installedDate: new Date()
  });
  return new Promise((_0x5abfae, _0x1c560b) => {
    _0xeb7db7.oncomplete = () => _0x5abfae();
    _0xeb7db7.onerror = _0x9bdbf5 => _0x1c560b(_0x9bdbf5.target.error);
  });
}
async function uninstallVocabulary(_0x35d310) {
  const _0x427ccf = await openDB();
  const _0x5d5cee = _0x35d310 === "tags.json";
  const _0x2f6789 = _0x5d5cee ? ["vocabularies", "groups", "subgroups", "tags"] : ["vocabularies", "tags"];
  const _0x317789 = _0x427ccf.transaction(_0x2f6789, "readwrite");
  for (const _0x4a2b35 of _0x2f6789) {
    if (_0x4a2b35 === "vocabularies") {
      await new Promise((_0x5927c6, _0x5ce79d) => {
        const _0x486aa1 = _0x317789.objectStore(_0x4a2b35).delete(_0x35d310);
        _0x486aa1.onsuccess = _0x5927c6;
        _0x486aa1.onerror = _0x5ce79d;
      });
    } else {
      const _0x3a5c37 = _0x317789.objectStore(_0x4a2b35);
      const _0xb992e = _0x3a5c37.index("fileName");
      const _0x59a3e1 = _0xb992e.openCursor(IDBKeyRange.only(_0x35d310));
      await new Promise((_0x1edf23, _0x2167de) => {
        _0x59a3e1.onsuccess = _0xe865c5 => {
          const _0x8ca088 = _0xe865c5.target.result;
          if (_0x8ca088) {
            _0x8ca088.delete();
            _0x8ca088.continue();
          } else {
            _0x1edf23();
          }
        };
        _0x59a3e1.onerror = _0x10052c => _0x2167de(_0x10052c.target.error);
      });
    }
  }
  return new Promise((_0x22326a, _0x546947) => {
    _0x317789.oncomplete = () => _0x22326a();
    _0x317789.onerror = _0x31cefc => _0x546947(_0x31cefc.target.error);
  });
}
async function getInstalledVocabularies() {
  const _0x4f1290 = await openDB();
  const _0x38171b = _0x4f1290.transaction("vocabularies", "readonly");
  const _0x407d08 = _0x38171b.objectStore("vocabularies");
  const _0x5b1a20 = _0x407d08.getAll();
  return new Promise((_0x1cf920, _0x3e0b40) => {
    _0x5b1a20.onsuccess = () => {
      _0x1cf920(_0x5b1a20.result);
    };
    _0x5b1a20.onerror = _0x29e592 => {
      _0x3e0b40(_0x29e592.target.error);
    };
  });
}
async function getTagsTreeData() {
  const _0x1bb6b0 = await openDB();
  const _0x36e9d3 = _0x1bb6b0.transaction(["groups", "subgroups", "tags"], "readonly");
  const _0x234960 = _0x36e9d3.objectStore("groups");
  const _0x184c4f = _0x36e9d3.objectStore("subgroups");
  const _0x1fdfd9 = _0x36e9d3.objectStore("tags");
  const [_0x24741d, _0xda8f34, _0x439759] = await Promise.all([new Promise((_0x4912bf, _0x3adb53) => {
    const _0x4a0902 = _0x234960.getAll();
    _0x4a0902.onsuccess = () => _0x4912bf(_0x4a0902.result);
    _0x4a0902.onerror = _0x3adb53;
  }), new Promise((_0x5d03e6, _0x542c8d) => {
    const _0x3b44eb = _0x184c4f.getAll();
    _0x3b44eb.onsuccess = () => _0x5d03e6(_0x3b44eb.result);
    _0x3b44eb.onerror = _0x542c8d;
  }), new Promise((_0x31a8ef, _0x2b427e) => {
    const _0x2c9d9f = _0x1fdfd9.getAll();
    _0x2c9d9f.onsuccess = () => _0x31a8ef(_0x2c9d9f.result);
    _0x2c9d9f.onerror = _0x2b427e;
  })]);
  const _0x10388d = _0xda8f34.reduce((_0x52b7a4, _0x57afe1) => {
    if (!_0x52b7a4[_0x57afe1.group_id]) {
      _0x52b7a4[_0x57afe1.group_id] = [];
    }
    _0x52b7a4[_0x57afe1.group_id].push(_0x57afe1);
    return _0x52b7a4;
  }, {});
  const _0x5e0c03 = _0x439759.reduce((_0x5ef9d2, _0x33b9a6) => {
    if (!_0x5ef9d2[_0x33b9a6.subgroup_id]) {
      _0x5ef9d2[_0x33b9a6.subgroup_id] = [];
    }
    _0x5ef9d2[_0x33b9a6.subgroup_id].push({
      text: _0x33b9a6.name,
      desc: _0x33b9a6.translation
    });
    return _0x5ef9d2;
  }, {});
  const _0x543487 = {
    tag_groups: _0x24741d.map(_0x3fb452 => ({
      ..._0x3fb452,
      subgroups: (_0x10388d[_0x3fb452.id_index] || []).map(_0x1c2ea3 => ({
        ..._0x1c2ea3,
        tags: _0x5e0c03[_0x1c2ea3.id_index] || []
      }))
    })),
    tag_tags: _0x439759.map(_0x444f25 => ({
      text: _0x444f25.name,
      desc: _0x444f25.translation,
      subgroup_id: _0x444f25.subgroup_id
    }))
  };
  return _0x543487;
}
async function searchTags(_0x34aac2, _0x4340fd = {}) {
  if (!_0x34aac2) {
    return [];
  }
  const {
    startsWith = false,
    limit = 100,
    sortBy = "hot_asc"
  } = _0x4340fd;
  const _0x396a82 = _0x34aac2.toLowerCase();
  const _0x5e95af = await openDB();
  const _0x456eae = _0x5e95af.transaction("tags", "readonly");
  const _0x5f1485 = _0x456eae.objectStore("tags");
  const _0x1ab20e = new Map();
  const _0x5b24e7 = _0x3674b8 => {
    if (_0x3674b8) {
      const _0xde96f = _0x3674b8.value;
      let _0xe9345 = false;
      let _0x232fc3 = false;
      if (startsWith) {
        _0xe9345 = _0xde96f.name && _0xde96f.name.toLowerCase().startsWith(_0x396a82);
        _0x232fc3 = _0xde96f.translation && _0xde96f.translation.toLowerCase().startsWith(_0x396a82);
      } else {
        _0xe9345 = _0xde96f.name && _0xde96f.name.toLowerCase().includes(_0x396a82);
        _0x232fc3 = _0xde96f.translation && _0xde96f.translation.toLowerCase().includes(_0x396a82);
      }
      if ((_0xe9345 || _0x232fc3) && !_0x1ab20e.has(_0xde96f.name)) {
        _0x1ab20e.set(_0xde96f.name, _0xde96f);
      }
      _0x3674b8.continue();
    }
  };
  await new Promise((_0x357603, _0x573620) => {
    const _0x418661 = _0x5f1485.openCursor();
    _0x418661.onerror = _0x1a851e => _0x573620(_0x1a851e.target.error);
    _0x418661.onsuccess = _0xf32f14 => {
      const _0x127f61 = _0xf32f14.target.result;
      if (_0x127f61) {
        _0x5b24e7(_0x127f61);
      } else {
        _0x357603();
      }
    };
  });
  let _0x347c21 = Array.from(_0x1ab20e.values());
  _0x347c21.sort((_0x586f3e, _0x48f692) => {
    if (_0x586f3e.hot === -1 && _0x48f692.hot !== -1) {
      return -1;
    }
    if (_0x586f3e.hot !== -1 && _0x48f692.hot === -1) {
      return 1;
    }
    if (_0x586f3e.hot === -1 && _0x48f692.hot === -1) {
      return _0x586f3e.name.localeCompare(_0x48f692.name);
    }
    if (sortBy === "hot_desc") {
      return _0x48f692.hot - _0x586f3e.hot;
    }
    if (sortBy === "hot_asc") {
      return _0x586f3e.hot - _0x48f692.hot;
    }
    if (sortBy === "key_asc") {
      return _0x586f3e.name.localeCompare(_0x48f692.name);
    }
    return 0;
  });
  return _0x347c21.slice(0, limit);
}
async function addTag(_0x2fc84a) {
  const _0x2e90cb = await openDB();
  const _0x22c9b5 = _0x2e90cb.transaction("tags", "readwrite");
  const _0x2f4e54 = _0x22c9b5.objectStore("tags");
  const _0x467852 = {
    name: _0x2fc84a.name,
    translation: _0x2fc84a.translation || "",
    hot: _0x2fc84a.hot || 0,
    fileName: _0x2fc84a.fileName || "manual"
  };
  const _0x5590bb = _0x467852;
  return new Promise((_0x1260e1, _0x100011) => {
    const _0x453cc6 = _0x2f4e54.put(_0x5590bb);
    _0x453cc6.onsuccess = () => _0x1260e1(_0x453cc6.result);
    _0x453cc6.onerror = _0x522a31 => _0x100011(_0x522a31.target.error);
  });
}
export async function syncServerImagesWithStorage(_0x4b093a = "chatu8", _0x31ad94 = null) {
  const _0x38878f = {
    deletedCount: 0,
    errors: []
  };
  try {
    if (_0x31ad94) {
      _0x31ad94(0, 100, "正在获取服务器图片列表...");
    }
    const _0x2df825 = {
      folder: _0x4b093a
    };
    const _0x3d9941 = await fetch("/api/images/list", {
      method: "POST",
      headers: getRequestHeaders(window.token),
      body: JSON.stringify(_0x2df825)
    });
    if (!_0x3d9941.ok) {
      throw new Error("获取服务器图片列表失败: " + _0x3d9941.statusText);
    }
    const _0xd498c8 = await _0x3d9941.json();
    if (!Array.isArray(_0xd498c8) || _0xd498c8.length === 0) {
      console.log("[Sync] 服务器文件夹为空，无需同步");
      if (_0x31ad94) {
        _0x31ad94(100, 100, "服务器文件夹为空");
      }
      return _0x38878f;
    }
    if (_0x31ad94) {
      _0x31ad94(20, 100, "正在分析插件存储...");
    }
    const _0x1c88ff = extension_settings[extensionName].jiuguanStorage || {};
    const _0x25f81f = await getMetadata();
    const _0x241f60 = new Set();
    for (const _0x12f0d2 in _0x1c88ff) {
      const _0x13b0af = _0x1c88ff[_0x12f0d2];
      if (_0x13b0af && _0x13b0af.images) {
        _0x13b0af.images.forEach(_0x29fe01 => {
          if (_0x29fe01.path) {
            const _0x23c620 = _0x29fe01.path.split("/").pop();
            _0x241f60.add(_0x23c620);
          }
          if (_0x29fe01.thumbnail_path) {
            const _0x2237e2 = _0x29fe01.thumbnail_path.split("/").pop();
            _0x241f60.add(_0x2237e2);
          }
        });
      }
    }
    for (const _0x3f6043 in _0x25f81f) {
      const _0x4fd42a = _0x25f81f[_0x3f6043];
      if (_0x4fd42a && _0x4fd42a.images) {
        _0x4fd42a.images.forEach(_0x5c8a26 => {
          if (_0x5c8a26.path) {
            const _0xceb347 = _0x5c8a26.path.split("/").pop();
            _0x241f60.add(_0xceb347);
          }
          if (_0x5c8a26.thumbnail_path) {
            const _0x2022df = _0x5c8a26.thumbnail_path.split("/").pop();
            _0x241f60.add(_0x2022df);
          }
        });
      }
    }
    console.log("[Sync] 服务器图片总数: " + _0xd498c8.length + ", 插件存储文件名数: " + _0x241f60.size);
    const _0x3d5bbc = _0xd498c8.filter(_0x227d08 => !_0x241f60.has(_0x227d08));
    console.log("[Sync] 找到 " + _0x3d5bbc.length + " 个需要删除的图片");
    if (_0x3d5bbc.length === 0) {
      if (_0x31ad94) {
        _0x31ad94(100, 100, "所有图片已同步，无需删除");
      }
      return _0x38878f;
    }
    const _0x5a3f56 = _0x3d5bbc.length;
    for (let _0x218906 = 0; _0x218906 < _0x3d5bbc.length; _0x218906++) {
      const _0x55c55b = _0x3d5bbc[_0x218906];
      const _0x31a662 = Math.floor(20 + _0x218906 / _0x5a3f56 * 80);
      if (_0x31ad94) {
        _0x31ad94(_0x31a662, 100, "正在删除 (" + (_0x218906 + 1) + "/" + _0x5a3f56 + "): " + _0x55c55b);
      }
      try {
        const _0x1f895e = "user/images/" + _0x4b093a + "/" + _0x55c55b;
        const _0x580723 = {
          path: _0x1f895e
        };
        const _0x149f16 = await fetch("/api/images/delete", {
          method: "POST",
          headers: getRequestHeaders(window.token),
          body: JSON.stringify(_0x580723)
        });
        if (_0x149f16.ok) {
          _0x38878f.deletedCount++;
          console.log("[Sync] 已删除: " + _0x1f895e);
        } else {
          const _0x2eda2c = "删除失败 (" + _0x149f16.status + "): " + _0x1f895e;
          _0x38878f.errors.push(_0x2eda2c);
          console.error("[Sync] " + _0x2eda2c);
        }
      } catch (_0x169455) {
        const _0x42ce9a = "删除异常: " + _0x55c55b + " - " + _0x169455.message;
        _0x38878f.errors.push(_0x42ce9a);
        console.error("[Sync] " + _0x42ce9a);
      }
      await new Promise(_0x4c526e => setTimeout(_0x4c526e, 50));
    }
    if (_0x31ad94) {
      _0x31ad94(100, 100, "同步完成");
    }
    console.log("[Sync] 同步完成。删除 " + _0x38878f.deletedCount + " 个图片，失败 " + _0x38878f.errors.length + " 个");
    return _0x38878f;
  } catch (_0x5a6d38) {
    console.error("[Sync] 同步过程发生错误:", _0x5a6d38);
    _0x38878f.errors.push(_0x5a6d38.message);
    return _0x38878f;
  }
}
const STEGO_FOLDER = "chatu8List";
const STEGO_FILENAME = "图片缓存列表";
export async function initJiuguanStorage() {
  const _0x18509d = new ImageSteganography();
  try {
    console.log("[Stego] 开始初始化 jiuguanStorage...");
    const _0x4a4069 = await fetchStegoImage();
    if (_0x4a4069) {
      console.log("[Stego] 找到隐写图片，开始解码...");
      try {
        const _0xbc2ba9 = await _0x18509d.decode(_0x4a4069);
        if (!extension_settings[extensionName].jiuguanStorage) {
          extension_settings[extensionName].jiuguanStorage = {};
        }
        extension_settings[extensionName].jiuguanStorage = _0xbc2ba9;
        console.log("[Stego] 从隐写图片加载数据成功，共", Object.keys(_0xbc2ba9).length, "个条目");
      } catch (_0x309d4a) {
        console.warn("[Stego] 隐写图片解码失败（可能是旧格式或已损坏），将使用 extension_settings 中的数据重建:", _0x309d4a.message);
        if (!extension_settings[extensionName].jiuguanStorage) {
          extension_settings[extensionName].jiuguanStorage = {};
        }
        const _0x39989f = extension_settings[extensionName].jiuguanStorage;
        if (_0x39989f && Object.keys(_0x39989f).length > 0) {
          console.log("[Stego] 检测到现有数据，尝试重建隐写图片...");
          try {
            await deleteStegoImage();
            await createStegoImage();
            console.log("[Stego] 隐写图片重建成功");
          } catch (_0x50a792) {
            console.error("[Stego] 重建隐写图片失败:", _0x50a792);
          }
        } else {
          console.log("[Stego] 无现有数据可用于重建");
          try {
            await deleteStegoImage();
          } catch (_0x9a038) {
            console.warn("[Stego] 删除损坏图片失败:", _0x9a038);
          }
        }
      }
    } else {
      console.log("[Stego] 隐写图片不存在，检查是否需要创建...");
      if (!extension_settings[extensionName].jiuguanStorage) {
        extension_settings[extensionName].jiuguanStorage = {};
      }
      const _0x4c9b3c = extension_settings[extensionName].jiuguanStorage;
      if (_0x4c9b3c && Object.keys(_0x4c9b3c).length > 0) {
        console.log("[Stego] 发现现有数据，创建隐写图片...");
        await createStegoImage();
      } else {
        console.log("[Stego] 无需创建隐写图片（数据为空）");
      }
    }
  } catch (_0x3d3478) {
    console.error("[Stego] 初始化失败:", _0x3d3478);
    if (!extension_settings[extensionName].jiuguanStorage) {
      extension_settings[extensionName].jiuguanStorage = {};
    }
    console.log("[Stego] 使用现有设置数据作为降级方案");
  }
}
function arrayBufferToBase64DataURL(_0x2c92db) {
  const _0x2423bc = new Uint8Array(_0x2c92db);
  let _0x1d7170 = "";
  for (let _0x5081fa = 0; _0x5081fa < _0x2423bc.byteLength; _0x5081fa++) {
    _0x1d7170 += String.fromCharCode(_0x2423bc[_0x5081fa]);
  }
  const _0x501e7d = window.btoa(_0x1d7170);
  return "data:image/png;base64," + _0x501e7d;
}
async function fetchStegoImage() {
  try {
    const _0x38df58 = "user/images/" + STEGO_FOLDER + "/" + STEGO_FILENAME + ".png";
    const _0x1d97e6 = await fetch("/" + _0x38df58, {
      method: "GET",
      headers: getRequestHeaders(window.token)
    });
    if (_0x1d97e6.ok) {
      const _0x4fdee8 = await _0x1d97e6.arrayBuffer();
      return arrayBufferToBase64DataURL(_0x4fdee8);
    }
    return null;
  } catch (_0x4fef5e) {
    console.error("[Stego] 获取图片失败:", _0x4fef5e);
    return null;
  }
}
async function createStegoImage() {
  const _0x43986b = new ImageSteganography();
  const _0x462d76 = extension_settings[extensionName].jiuguanStorage || {};
  try {
    const _0x2069f8 = await _0x43986b.encode(_0x462d76);
    await uploadStegoImage(_0x2069f8);
    console.log("[Stego] 新隐写图片创建并上传成功");
  } catch (_0x4e1ac2) {
    console.error("[Stego] 创建隐写图片失败:", _0x4e1ac2);
    throw _0x4e1ac2;
  }
}
export async function updateStegoImage() {
  const _0x1a5752 = new ImageSteganography();
  try {
    const _0x5665f6 = extension_settings[extensionName].jiuguanStorage || {};
    console.log("[Stego] 准备更新隐写图片，数据条目数:", Object.keys(_0x5665f6).length);
    const _0x17cc3c = await _0x1a5752.encode(_0x5665f6);
    await deleteStegoImage();
    await uploadStegoImage(_0x17cc3c);
    console.log("[Stego] 隐写图片更新成功");
  } catch (_0x24a7d6) {
    console.error("[Stego] 更新隐写图片失败:", _0x24a7d6);
  }
}
async function uploadStegoImage(_0x1c7cdd) {
  const _0x3cf65d = _0x1c7cdd.split(",")[1] || _0x1c7cdd;
  const _0x2667f3 = await fetch("/api/images/upload", {
    method: "POST",
    headers: getRequestHeaders(window.token),
    body: JSON.stringify({
      image: _0x3cf65d,
      format: "png",
      ch_name: STEGO_FOLDER,
      filename: STEGO_FILENAME
    })
  });
  if (!_0x2667f3.ok) {
    throw new Error("上传失败: " + _0x2667f3.statusText);
  }
  const _0x550a09 = await _0x2667f3.json();
  console.log("[Stego] 图片上传成功:", _0x550a09.path);
  return _0x550a09.path;
}
async function deleteStegoImage() {
  try {
    const _0x3a39ec = {
      path: "user/images/" + STEGO_FOLDER + "/" + STEGO_FILENAME + ".png"
    };
    const _0x4e3ca2 = await fetch("/api/images/delete", {
      method: "POST",
      headers: getRequestHeaders(window.token),
      body: JSON.stringify(_0x3a39ec)
    });
    if (_0x4e3ca2.ok) {
      console.log("[Stego] 旧图片删除成功");
    }
  } catch (_0x41708b) {
    console.warn("[Stego] 删除旧图片失败（可能不存在）:", _0x41708b);
  }
}
const _0x5483f7 = {
  openDB: openDB,
  migrateDatabase: migrateDatabase,
  setItemImg: setItemImg,
  getItemImg: getItemImg,
  getItemBlob: getItemBlob,
  updateImageIndex: updateImageIndex,
  deleteImage: deleteImage,
  getAllImages: getAllImages,
  getAllImageBlobs: getAllImageBlobs,
  getImageByUUID: getImageByUUID,
  getImageBlobByUUID: getImageBlobByUUID,
  getImageThumbnailBlobByUUID: getImageThumbnailBlobByUUID,
  getAllImageMetadata: getAllImageMetadata,
  deleteMultipleImages: deleteMultipleImages,
  deleteImagesByUuids: deleteImagesByUuids,
  getMergedAndSortedImages: getMergedAndSortedImages,
  syncServerImagesWithStorage: syncServerImagesWithStorage,
  storeReadOnly: storeReadOnly,
  storeReadWrite: storeReadWrite,
  storeDelete: storeDelete,
  initJiuguanStorage: initJiuguanStorage,
  updateStegoImage: updateStegoImage,
  installVocabulary: installVocabulary,
  uninstallVocabulary: uninstallVocabulary,
  getInstalledVocabularies: getInstalledVocabularies,
  getTagsTreeData: getTagsTreeData,
  searchTags: searchTags,
  addTag: addTag,
  getManualTags: getManualTags,
  deleteTagByName: deleteTagByName
};
export const dbs = _0x5483f7;