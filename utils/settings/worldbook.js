import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { stylInput, stylishConfirm } from "../ui_common.js";
let isWorldBookInitialized = false;
export function initWorldBookSettings(_0x48653f) {
  console.log("[WorldBook] Initializing world book settings...");
  ensureWorldBookSettings();
  if (!isWorldBookInitialized) {
    setupWorldBookControls(_0x48653f);
    isWorldBookInitialized = true;
  }
  console.log("[WorldBook] World book settings initialized");
}
export function refreshWorldBookSettings(_0xf98112) {
  console.log("[WorldBook] Refreshing world book settings...");
  ensureWorldBookSettings();
  loadWorldBookPresetList();
  loadWorldBookPreset();
  console.log("[WorldBook] World book settings refreshed");
}
function ensureWorldBookSettings() {
  const _0x10dbd3 = extension_settings[extensionName];
  if (!_0x10dbd3.worldBookList) {
    _0x10dbd3.worldBookList = {
      默认添加末尾: {
        content: ""
      }
    };
  }
  if (!_0x10dbd3.worldBookList_id) {
    _0x10dbd3.worldBookList_id = "默认添加末尾";
  }
}
function setupWorldBookControls(_0x4928f6) {
  loadWorldBookPresetList();
  _0x4928f6.find("#worldBookList_id").on("change", worldbook_change);
  _0x4928f6.find("#worldbook_update_style").on("click", worldbook_update);
  _0x4928f6.find("#worldbook_save_style").on("click", worldbook_save);
  _0x4928f6.find("#worldbook_delete_style").on("click", worldbook_delete);
  _0x4928f6.find("#worldbook_export_current").on("click", worldbook_export_current);
  _0x4928f6.find("#worldbook_export_all").on("click", worldbook_export_all);
  _0x4928f6.find("#worldbook_import").on("click", worldbook_import);
  bindWorldBookFieldListeners();
  loadWorldBookPreset();
  setupWorldBookEventListener();
}
function loadWorldBookPresetList() {
  const _0x1b90d2 = extension_settings[extensionName];
  const _0x5c8018 = document.getElementById("worldBookList_id");
  if (!_0x5c8018) {
    return;
  }
  _0x5c8018.innerHTML = "";
  for (const _0x31dd in _0x1b90d2.worldBookList) {
    const _0x22b298 = document.createElement("option");
    _0x22b298.value = _0x31dd;
    _0x22b298.textContent = _0x31dd;
    _0x5c8018.add(_0x22b298);
  }
  _0x5c8018.value = _0x1b90d2.worldBookList_id;
}
function loadWorldBookPreset() {
  const _0x52da9d = extension_settings[extensionName];
  const _0x4d22b9 = document.getElementById("worldBookList_id");
  if (!_0x4d22b9) {
    return;
  }
  const _0x3ffea8 = _0x4d22b9.value;
  const _0x1209be = _0x52da9d.worldBookList_id;
  if (_0x1209be && _0x1209be !== _0x3ffea8) {
    const _0x554aa1 = _0x52da9d.worldBookList[_0x1209be] || {};
    const _0x418def = document.getElementById("worldbook_content");
    if (_0x418def && _0x418def.value !== (_0x554aa1.content || "")) {
      stylishConfirm("您有未保存的世界书数据。要放弃这些更改并切换预设吗？").then(_0x13f377 => {
        if (_0x13f377) {
          _0x52da9d.worldBookList_id = _0x3ffea8;
          loadWorldBookPresetData(_0x3ffea8);
          saveSettingsDebounced();
        } else {
          _0x4d22b9.value = _0x1209be;
        }
      });
      return;
    }
  }
  _0x52da9d.worldBookList_id = _0x3ffea8;
  loadWorldBookPresetData(_0x3ffea8);
  saveSettingsDebounced();
}
function loadWorldBookPresetData(_0x49a0fa) {
  const _0x5241fc = extension_settings[extensionName];
  const _0x9b93a0 = _0x5241fc.worldBookList[_0x49a0fa];
  if (!_0x9b93a0) {
    return;
  }
  const _0x59ee82 = document.getElementById("worldbook_content");
  if (_0x59ee82) {
    _0x59ee82.value = _0x9b93a0.content || "";
    const _0x53c47e = _0x59ee82.closest(".st-chatu8-field-col")?.querySelector(".st-chatu8-unsaved-warning");
    if (_0x53c47e) {
      $(_0x53c47e).hide();
    }
  }
}
function worldbook_change() {
  loadWorldBookPreset();
}
function worldbook_update() {
  const _0x4f0cea = extension_settings[extensionName];
  const _0x242c01 = _0x4f0cea.worldBookList_id;
  if (!_0x242c01 || !_0x4f0cea.worldBookList[_0x242c01]) {
    alert("没有活动的世界书预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前世界书预设 \"" + _0x242c01 + "\" 吗？").then(_0x7c0239 => {
    if (_0x7c0239) {
      saveCurrentWorldBookData(_0x242c01);
      alert("世界书预设 \"" + _0x242c01 + "\" 已更新。");
    }
  });
}
function worldbook_save() {
  stylInput("请输入新世界书预设的名称").then(_0x5b54d6 => {
    if (_0x5b54d6 && _0x5b54d6.trim() !== "") {
      const _0x18530d = extension_settings[extensionName];
      saveCurrentWorldBookData(_0x5b54d6);
      _0x18530d.worldBookList_id = _0x5b54d6;
      loadWorldBookPresetList();
      alert("世界书预设 \"" + _0x5b54d6 + "\" 已保存。");
    }
  });
}
function saveCurrentWorldBookData(_0x4346e3) {
  const _0x3f1cb3 = extension_settings[extensionName];
  const _0x3caae2 = document.getElementById("worldbook_content");
  if (_0x3caae2) {
    const _0x367d14 = {
      content: _0x3caae2.value || ""
    };
    _0x3f1cb3.worldBookList[_0x4346e3] = _0x367d14;
    saveSettingsDebounced();
    const _0x1a4037 = _0x3caae2.closest(".st-chatu8-field-col")?.querySelector(".st-chatu8-unsaved-warning");
    if (_0x1a4037) {
      $(_0x1a4037).hide();
    }
  }
}
function worldbook_delete() {
  const _0x482a09 = extension_settings[extensionName];
  const _0x2fda0c = document.getElementById("worldBookList_id");
  const _0x2e2767 = _0x2fda0c.value;
  if (_0x2e2767 === "默认添加末尾") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该世界书预设").then(_0x27442f => {
    if (_0x27442f) {
      delete _0x482a09.worldBookList[_0x2e2767];
      _0x482a09.worldBookList_id = "默认添加末尾";
      loadWorldBookPresetList();
      loadWorldBookPreset();
      saveSettingsDebounced();
    }
  });
}
function worldbook_export_current() {
  const _0x3c2a79 = extension_settings[extensionName];
  const _0x26ddcc = _0x3c2a79.worldBookList_id;
  if (!_0x26ddcc || !_0x3c2a79.worldBookList[_0x26ddcc]) {
    alert("没有选中的世界书预设可导出。");
    return;
  }
  const _0x248398 = {
    [_0x26ddcc]: _0x3c2a79.worldBookList[_0x26ddcc]
  };
  const _0x4ef359 = _0x248398;
  const _0x220851 = JSON.stringify(_0x4ef359, null, 2);
  const _0x5067b6 = new Blob([_0x220851], {
    type: "application/json"
  });
  const _0x454f4e = URL.createObjectURL(_0x5067b6);
  const _0x29d59f = document.createElement("a");
  _0x29d59f.href = _0x454f4e;
  _0x29d59f.download = "st-chatu8-worldbook-" + _0x26ddcc + ".json";
  document.body.appendChild(_0x29d59f);
  _0x29d59f.click();
  document.body.removeChild(_0x29d59f);
  URL.revokeObjectURL(_0x454f4e);
}
function worldbook_export_all() {
  const _0x445c65 = extension_settings[extensionName];
  if (!_0x445c65.worldBookList || Object.keys(_0x445c65.worldBookList).length === 0) {
    alert("没有世界书预设可导出。");
    return;
  }
  const _0x3e13d6 = JSON.stringify(_0x445c65.worldBookList, null, 2);
  const _0x1abba6 = new Blob([_0x3e13d6], {
    type: "application/json"
  });
  const _0x126354 = URL.createObjectURL(_0x1abba6);
  const _0x10e630 = document.createElement("a");
  _0x10e630.href = _0x126354;
  _0x10e630.download = "st-chatu8-worldbook-all.json";
  document.body.appendChild(_0x10e630);
  _0x10e630.click();
  document.body.removeChild(_0x10e630);
  URL.revokeObjectURL(_0x126354);
}
function worldbook_import() {
  const _0x2b4a55 = extension_settings[extensionName];
  const _0x5a66b5 = document.createElement("input");
  _0x5a66b5.type = "file";
  _0x5a66b5.accept = ".json";
  _0x5a66b5.onchange = _0x1a81ac => {
    const _0x409950 = _0x1a81ac.target.files[0];
    if (!_0x409950) {
      return;
    }
    const _0x4b9ae8 = new FileReader();
    _0x4b9ae8.onload = _0x440bd8 => {
      try {
        const _0x18f77f = JSON.parse(_0x440bd8.target.result);
        let _0x4b854c = 0;
        for (const _0x1e7885 in _0x18f77f) {
          if (_0x18f77f.hasOwnProperty(_0x1e7885)) {
            if (!_0x2b4a55.worldBookList.hasOwnProperty(_0x1e7885)) {
              _0x4b854c++;
            }
            _0x2b4a55.worldBookList[_0x1e7885] = _0x18f77f[_0x1e7885];
          }
        }
        saveSettingsDebounced();
        loadWorldBookPresetList();
        const _0x324d2a = Object.keys(_0x18f77f)[0];
        if (_0x324d2a) {
          _0x2b4a55.worldBookList_id = _0x324d2a;
          const _0x4ed2b7 = document.getElementById("worldBookList_id");
          if (_0x4ed2b7) {
            _0x4ed2b7.value = _0x324d2a;
          }
          loadWorldBookPresetData(_0x324d2a);
        }
        alert("成功导入 " + Object.keys(_0x18f77f).length + " 个世界书预设,其中 " + _0x4b854c + " 个是全新的。");
      } catch (_0x3cd7bf) {
        alert("导入失败,请确保文件是正确的JSON格式。\n错误信息: " + _0x3cd7bf.message);
        console.error("Error importing world books:", _0x3cd7bf);
      }
    };
    _0x4b9ae8.readAsText(_0x409950);
  };
  _0x5a66b5.click();
}
function bindWorldBookFieldListeners() {
  const _0x13250e = document.getElementById("worldbook_content");
  if (_0x13250e) {
    $(_0x13250e).on("input", function () {
      const _0x1b6f3f = extension_settings[extensionName];
      const _0x4e6936 = _0x1b6f3f.worldBookList_id;
      const _0x1a86e0 = _0x1b6f3f.worldBookList[_0x4e6936] || {};
      const _0x380d8b = $(this).val() !== (_0x1a86e0.content ?? "");
      const _0x4e4e4f = $(this).closest(".st-chatu8-field-col").find(".st-chatu8-unsaved-warning");
      if (_0x380d8b) {
        $(_0x4e4e4f).show();
      } else {
        $(_0x4e4e4f).hide();
      }
    });
  }
}
function isCharacterTriggered(_0x31ad83, _0x21014c) {
  if (!_0x21014c || !_0x31ad83) {
    return false;
  }
  if (_0x31ad83.nameCN) {
    const _0x384e56 = _0x31ad83.nameCN.split("|").map(_0x2a8105 => _0x2a8105.trim()).filter(_0x400ba2 => _0x400ba2);
    for (const _0x481373 of _0x384e56) {
      if (_0x21014c.includes(_0x481373)) {
        return true;
      }
    }
  }
  if (_0x31ad83.nameEN) {
    const _0x5e96f8 = _0x31ad83.nameEN.split("|").map(_0x1f6a19 => _0x1f6a19.trim()).filter(_0x1e7d31 => _0x1e7d31);
    for (const _0x7e13df of _0x5e96f8) {
      if (_0x21014c.toLowerCase().includes(_0x7e13df.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}
function getTriggeredCharacterName(_0x2fa468, _0x362fc9) {
  if (!_0x362fc9 || !_0x2fa468) {
    return null;
  }
  if (_0x2fa468.nameCN) {
    const _0x143ccf = _0x2fa468.nameCN.split("|").map(_0x38f144 => _0x38f144.trim()).filter(_0xfc1512 => _0xfc1512);
    for (const _0x180576 of _0x143ccf) {
      if (_0x362fc9.includes(_0x180576)) {
        return _0x180576;
      }
    }
  }
  if (_0x2fa468.nameEN) {
    const _0x31a47a = _0x2fa468.nameEN.split("|").map(_0x5a94e6 => _0x5a94e6.trim()).filter(_0x4180cc => _0x4180cc);
    for (const _0x5a9d13 of _0x31a47a) {
      if (_0x362fc9.toLowerCase().includes(_0x5a9d13.toLowerCase())) {
        return _0x5a9d13;
      }
    }
  }
  return null;
}
export function generateCharacterListText(_0x590fd0 = null) {
  const _0x29e459 = extension_settings[extensionName];
  const _0x1f0d10 = _0x29e459.characterEnablePresetId;
  const _0x384423 = _0x29e459.characterEnablePresets?.[_0x1f0d10];
  if (!_0x384423 || !Array.isArray(_0x384423.characters) || _0x384423.characters.length === 0) {
    return "（暂无启用的角色）";
  }
  const _0x22385d = [];
  for (const _0x34b7ac of _0x384423.characters) {
    const _0x5abe4 = _0x29e459.characterPresets?.[_0x34b7ac];
    if (!_0x5abe4) {
      continue;
    }
    if (_0x590fd0 !== null) {
      if (!isCharacterTriggered(_0x5abe4, _0x590fd0)) {
        continue;
      }
    }
    const _0x30b1dd = [];
    if (_0x5abe4.nameCN) {
      _0x30b1dd.push("中文名称：" + _0x5abe4.nameCN);
    }
    if (_0x5abe4.nameEN) {
      const _0x581b27 = _0x5abe4.nameEN.split("|")[0].trim();
      _0x30b1dd.push("英文名称：" + _0x581b27);
    }
    if (_0x5abe4.characterTraits) {
      _0x30b1dd.push("角色特征：" + _0x5abe4.characterTraits);
    }
    if (_0x5abe4.facialFeatures) {
      _0x30b1dd.push("五官外貌（正面）：" + _0x5abe4.facialFeatures);
    }
    if (_0x5abe4.facialFeaturesBack) {
      _0x30b1dd.push("五官外貌（背面）：" + _0x5abe4.facialFeaturesBack);
    }
    if (_0x5abe4.upperBodySFW) {
      _0x30b1dd.push("上半身SFW（正面）：" + _0x5abe4.upperBodySFW);
    }
    if (_0x5abe4.upperBodySFWBack) {
      _0x30b1dd.push("上半身SFW（背面）：" + _0x5abe4.upperBodySFWBack);
    }
    if (_0x5abe4.fullBodySFW) {
      _0x30b1dd.push("下半身SFW（正面）：" + _0x5abe4.fullBodySFW);
    }
    if (_0x5abe4.fullBodySFWBack) {
      _0x30b1dd.push("下半身SFW（背面）：" + _0x5abe4.fullBodySFWBack);
    }
    if (_0x5abe4.upperBodyNSFW) {
      _0x30b1dd.push("上半身NSFW（正面）：" + _0x5abe4.upperBodyNSFW);
    }
    if (_0x5abe4.upperBodyNSFWBack) {
      _0x30b1dd.push("上半身NSFW（背面）：" + _0x5abe4.upperBodyNSFWBack);
    }
    if (_0x5abe4.fullBodyNSFW) {
      _0x30b1dd.push("下半身NSFW（正面）：" + _0x5abe4.fullBodyNSFW);
    }
    if (_0x5abe4.fullBodyNSFWBack) {
      _0x30b1dd.push("下半身NSFW（背面）：" + _0x5abe4.fullBodyNSFWBack);
    }
    if (Array.isArray(_0x5abe4.outfits) && _0x5abe4.outfits.length > 0) {
      _0x30b1dd.push("服装列表：");
      for (const _0x492b84 of _0x5abe4.outfits) {
        const _0x5f5c5e = _0x29e459.outfitPresets?.[_0x492b84];
        if (!_0x5f5c5e) {
          continue;
        }
        const _0x4c5e99 = [];
        if (_0x5f5c5e.nameCN) {
          _0x4c5e99.push("\n  中文名称：" + _0x5f5c5e.nameCN);
        }
        if (_0x5f5c5e.nameEN) {
          const _0x3042bb = _0x5f5c5e.nameEN.split("|")[0].trim();
          _0x4c5e99.push("  英文名称：" + _0x3042bb);
        }
        if (_0x5f5c5e.upperBody) {
          _0x4c5e99.push("  上半身（正面）：" + _0x5f5c5e.upperBody);
        }
        if (_0x5f5c5e.upperBodyBack) {
          _0x4c5e99.push("  上半身（背面）：" + _0x5f5c5e.upperBodyBack);
        }
        if (_0x5f5c5e.fullBody) {
          _0x4c5e99.push("  下半身（正面）：" + _0x5f5c5e.fullBody);
        }
        if (_0x5f5c5e.fullBodyBack) {
          _0x4c5e99.push("  下半身（背面）：" + _0x5f5c5e.fullBodyBack);
        }
        if (_0x4c5e99.length > 0) {
          _0x30b1dd.push(_0x4c5e99.join("\n"));
        }
      }
    }
    if (_0x30b1dd.length > 0) {
      _0x22385d.push(_0x30b1dd.join("\n"));
    }
  }
  if (_0x22385d.length > 0) {
    return _0x22385d.join("\n\n");
  } else {
    return "（暂无被触发的角色）";
  }
}
export function generateOutfitEnableListText() {
  const _0x421335 = extension_settings[extensionName];
  const _0xfba56b = _0x421335.outfitEnablePresetId;
  const _0x5de7be = _0x421335.outfitEnablePresets?.[_0xfba56b];
  if (!_0x5de7be || !Array.isArray(_0x5de7be.outfits) || _0x5de7be.outfits.length === 0) {
    return "暂未配置通用服装";
  }
  const _0x50e4d5 = [];
  for (const _0x5195e1 of _0x5de7be.outfits) {
    const _0x41263a = _0x421335.outfitPresets?.[_0x5195e1];
    if (!_0x41263a) {
      continue;
    }
    const _0x5baebf = [];
    if (_0x41263a.nameCN) {
      _0x5baebf.push("中文名称：" + _0x41263a.nameCN);
    }
    if (_0x41263a.nameEN) {
      const _0x4e3aa8 = _0x41263a.nameEN.split("|")[0].trim();
      _0x5baebf.push("英文名称：" + _0x4e3aa8);
    }
    if (_0x41263a.upperBody) {
      _0x5baebf.push("上半身（正面）：" + _0x41263a.upperBody);
    }
    if (_0x41263a.upperBodyBack) {
      _0x5baebf.push("上半身（背面）：" + _0x41263a.upperBodyBack);
    }
    if (_0x41263a.fullBody) {
      _0x5baebf.push("下半身（正面）：" + _0x41263a.fullBody);
    }
    if (_0x41263a.fullBodyBack) {
      _0x5baebf.push("下半身（背面）：" + _0x41263a.fullBodyBack);
    }
    if (_0x5baebf.length > 0) {
      _0x50e4d5.push(_0x5baebf.join("\n"));
    }
  }
  return _0x50e4d5.join("\n\n");
}
export function generateCommonCharacterListText() {
  const _0x1c7861 = extension_settings[extensionName];
  const _0x1f82fa = _0x1c7861.characterCommonPresetId;
  const _0x42f24c = _0x1c7861.characterCommonPresets?.[_0x1f82fa];
  if (!_0x42f24c || !Array.isArray(_0x42f24c.characters) || _0x42f24c.characters.length === 0) {
    return "暂未配置通用角色";
  }
  const _0x463f22 = [];
  for (const _0x2947be of _0x42f24c.characters) {
    const _0x25d214 = _0x1c7861.characterPresets?.[_0x2947be];
    if (!_0x25d214) {
      continue;
    }
    const _0x2ff776 = [];
    if (_0x25d214.nameCN) {
      _0x2ff776.push(_0x25d214.nameCN);
    }
    if (_0x25d214.nameEN) {
      const _0x4e5e80 = _0x25d214.nameEN.split("|")[0].trim();
      _0x2ff776.push(_0x4e5e80);
    }
    if (_0x2ff776.length > 0) {
      _0x463f22.push(_0x2ff776.join(" "));
    }
  }
  return _0x463f22.join("\n");
}
export async function getEnabledCharacterImages(_0x414e48 = null) {
  const {
    getConfigImage: _0x511fe2
  } = await import("../configDatabase.js");
  const _0x5a6a88 = extension_settings[extensionName];
  const _0x4264b7 = _0x5a6a88.characterEnablePresetId;
  const _0x23c0c0 = _0x5a6a88.characterEnablePresets?.[_0x4264b7];
  if (!_0x23c0c0 || !Array.isArray(_0x23c0c0.characters) || _0x23c0c0.characters.length === 0) {
    return [];
  }
  const _0x269434 = [];
  for (const _0x4a1a2a of _0x23c0c0.characters) {
    const _0x164853 = _0x5a6a88.characterPresets?.[_0x4a1a2a];
    if (!_0x164853) {
      continue;
    }
    if (!_0x164853.sendPhoto) {
      continue;
    }
    if (_0x414e48 !== null) {
      if (!isCharacterTriggered(_0x164853, _0x414e48)) {
        continue;
      }
    }
    const _0x16003a = _0x164853.photoImageIds || [];
    if (_0x16003a.length > 0) {
      let _0x521fa7 = _0x164853.selectedPhotoIndex || 0;
      if (_0x521fa7 < 0 || _0x521fa7 >= _0x16003a.length) {
        _0x521fa7 = _0x16003a.length - 1;
      }
      const _0x102fee = _0x16003a[_0x521fa7];
      try {
        const _0x4d33a5 = await _0x511fe2(_0x102fee);
        if (_0x4d33a5) {
          const _0x1a4482 = _0x414e48 ? getTriggeredCharacterName(_0x164853, _0x414e48) : null;
          const _0x2b5266 = _0x1a4482 || _0x164853.nameCN?.split("|")[0] || _0x164853.nameEN?.split("|")[0] || _0x4a1a2a;
          const _0xae4d07 = {
            base64: _0x4d33a5,
            name: _0x2b5266 + " 的参考图片"
          };
          _0x269434.push(_0xae4d07);
        }
      } catch (_0xf4469b) {
        console.error("[WorldBook] Failed to get image " + _0x102fee + " for character " + _0x4a1a2a + ":", _0xf4469b);
      }
    }
    if (Array.isArray(_0x164853.outfits)) {
      for (const _0x3852dc of _0x164853.outfits) {
        const _0x5cfbc7 = _0x5a6a88.outfitPresets?.[_0x3852dc];
        if (!_0x5cfbc7 || !_0x5cfbc7.sendPhoto) {
          continue;
        }
        const _0x46a310 = _0x5cfbc7.photoImageIds || [];
        if (_0x46a310.length > 0) {
          let _0x223def = _0x5cfbc7.selectedPhotoIndex || 0;
          if (_0x223def < 0 || _0x223def >= _0x46a310.length) {
            _0x223def = _0x46a310.length - 1;
          }
          const _0x16523d = _0x46a310[_0x223def];
          try {
            const _0x5cf0c5 = await _0x511fe2(_0x16523d);
            if (_0x5cf0c5) {
              const _0x5aefbc = _0x414e48 ? getTriggeredCharacterName(_0x164853, _0x414e48) : null;
              const _0x2c8d87 = _0x5aefbc || _0x164853.nameCN?.split("|")[0] || _0x164853.nameEN?.split("|")[0] || _0x4a1a2a;
              const _0x1df32f = _0x5cfbc7.nameCN?.split("|")[0] || _0x5cfbc7.nameEN?.split("|")[0] || _0x3852dc;
              const _0x38552 = {
                base64: _0x5cf0c5,
                name: _0x2c8d87 + " 的 " + _0x1df32f + " 服装参考图片"
              };
              _0x269434.push(_0x38552);
            }
          } catch (_0x178884) {
            console.error("[WorldBook] Failed to get image " + _0x16523d + " for outfit " + _0x3852dc + ":", _0x178884);
          }
        }
      }
    }
  }
  return _0x269434;
}
export async function getEnabledOutfitImages() {
  const {
    getConfigImage: _0x5e8ec5
  } = await import("../configDatabase.js");
  const _0x3227ba = extension_settings[extensionName];
  const _0x2d99ae = _0x3227ba.outfitEnablePresetId;
  const _0x1a5467 = _0x3227ba.outfitEnablePresets?.[_0x2d99ae];
  if (!_0x1a5467 || !Array.isArray(_0x1a5467.outfits) || _0x1a5467.outfits.length === 0) {
    return [];
  }
  const _0x5d597b = [];
  for (const _0x8c5090 of _0x1a5467.outfits) {
    const _0x25242d = _0x3227ba.outfitPresets?.[_0x8c5090];
    if (!_0x25242d) {
      continue;
    }
    if (!_0x25242d.sendPhoto) {
      continue;
    }
    const _0x20a71a = _0x25242d.photoImageIds || [];
    if (_0x20a71a.length > 0) {
      let _0x45ab55 = _0x25242d.selectedPhotoIndex || 0;
      if (_0x45ab55 < 0 || _0x45ab55 >= _0x20a71a.length) {
        _0x45ab55 = _0x20a71a.length - 1;
      }
      const _0x1796db = _0x20a71a[_0x45ab55];
      try {
        const _0x3faa61 = await _0x5e8ec5(_0x1796db);
        if (_0x3faa61) {
          const _0x28f8ff = _0x25242d.nameCN || _0x25242d.nameEN?.split("|")[0] || _0x8c5090;
          const _0x4f400f = {
            base64: _0x3faa61,
            name: _0x28f8ff + " 的参考图片"
          };
          _0x5d597b.push(_0x4f400f);
        }
      } catch (_0x2598c7) {
        console.error("[WorldBook] Failed to get image " + _0x1796db + " for outfit " + _0x8c5090 + ":", _0x2598c7);
      }
    }
  }
  return _0x5d597b;
}
export async function getCommonCharacterImages() {
  const {
    getConfigImage: _0x455cc8
  } = await import("../configDatabase.js");
  const _0xb08052 = extension_settings[extensionName];
  const _0x2f7b9e = _0xb08052.characterCommonPresetId;
  const _0xade62a = _0xb08052.characterCommonPresets?.[_0x2f7b9e];
  if (!_0xade62a || !Array.isArray(_0xade62a.characters) || _0xade62a.characters.length === 0) {
    return [];
  }
  const _0x1324f1 = [];
  for (const _0x20abee of _0xade62a.characters) {
    const _0x22fab6 = _0xb08052.characterPresets?.[_0x20abee];
    if (!_0x22fab6) {
      continue;
    }
    if (!_0x22fab6.sendPhoto) {
      continue;
    }
    const _0x272d47 = _0x22fab6.photoImageIds || [];
    if (_0x272d47.length > 0) {
      let _0x138870 = _0x22fab6.selectedPhotoIndex || 0;
      if (_0x138870 < 0 || _0x138870 >= _0x272d47.length) {
        _0x138870 = _0x272d47.length - 1;
      }
      const _0x14fd65 = _0x272d47[_0x138870];
      try {
        const _0x11a7a4 = await _0x455cc8(_0x14fd65);
        if (_0x11a7a4) {
          const _0x1cbe8c = _0x22fab6.nameCN || _0x22fab6.nameEN?.split("|")[0] || _0x20abee;
          const _0x3a970c = {
            base64: _0x11a7a4,
            name: _0x1cbe8c + " 的参考图片"
          };
          _0x1324f1.push(_0x3a970c);
        }
      } catch (_0x41b562) {
        console.error("[WorldBook] Failed to get image " + _0x14fd65 + " for character " + _0x20abee + ":", _0x41b562);
      }
    }
  }
  return _0x1324f1;
}
export function setupWorldBookEventListener() {
  eventSource.on(event_types.WORLDINFO_ENTRIES_LOADED, _0x5b54a3 => {
    const _0x28a202 = extension_settings[extensionName];
    const _0x513c9e = generateCharacterListText();
    const _0xbc5d0d = generateOutfitEnableListText();
    const _0x2942d8 = generateCommonCharacterListText();
    console.log("[WorldBook] Character list text:", _0x513c9e);
    console.log("[WorldBook] Outfit enable list text:", _0xbc5d0d);
    console.log("[WorldBook] Common character list text:", _0x2942d8);
    if (_0x5b54a3 && Array.isArray(_0x5b54a3.globalLore)) {
      for (const _0x2d468a of _0x5b54a3.globalLore) {
        if (_0x2d468a.content && typeof _0x2d468a.content === "string") {
          if (_0x2d468a.content.includes("{{角色启用列表}}")) {
            _0x2d468a.content = _0x2d468a.content.replace(/\{\{角色启用列表\}\}/g, _0x513c9e);
          }
          if (_0x2d468a.content.includes("{{通用服装启用列表}}")) {
            _0x2d468a.content = _0x2d468a.content.replace(/\{\{通用服装启用列表\}\}/g, _0xbc5d0d);
          }
          if (_0x2d468a.content.includes("{{通用角色启用列表}}")) {
            _0x2d468a.content = _0x2d468a.content.replace(/\{\{通用角色启用列表\}\}/g, _0x2942d8);
          }
        }
      }
    }
    if (_0x5b54a3 && Array.isArray(_0x5b54a3.charLore)) {
      for (const _0x58864a of _0x5b54a3.charLore) {
        if (_0x58864a.content && typeof _0x58864a.content === "string") {
          if (_0x58864a.content.includes("{{角色启用列表}}")) {
            _0x58864a.content = _0x58864a.content.replace(/\{\{角色启用列表\}\}/g, _0x513c9e);
          }
          if (_0x58864a.content.includes("{{通用服装启用列表}}")) {
            _0x58864a.content = _0x58864a.content.replace(/\{\{通用服装启用列表\}\}/g, _0xbc5d0d);
          }
          if (_0x58864a.content.includes("{{通用角色启用列表}}")) {
            _0x58864a.content = _0x58864a.content.replace(/\{\{通用角色启用列表\}\}/g, _0x2942d8);
          }
        }
      }
    }
    console.log("[WorldBook] Processed globalLore and charLore entries", JSON.stringify(_0x5b54a3));
  });
}
export function initWorldBookControls(_0x557ffe) {
  initWorldBookSettings(_0x557ffe);
}