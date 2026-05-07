import { extension_settings } from "../../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../../script.js";
import { extensionName } from "../../config.js";
import { stylInput, stylishConfirm } from "../../ui_common.js";
import { encryptExportData, decryptImportData } from "./crypto.js";
import { loadCharacterPresetList } from "./characterPreset.js";
import { loadOutfitPresetList } from "./outfitPreset.js";
export function setupCharacterCommonControls(_0x49276e) {
  loadCharacterCommonPresetList();
  _0x49276e.find("#character_common_preset_id").on("change", loadCharacterCommonPreset);
  _0x49276e.find("#character_common_update").on("click", updateCharacterCommonPreset);
  _0x49276e.find("#character_common_save_as").on("click", saveCharacterCommonPresetAs);
  _0x49276e.find("#character_common_export").on("click", exportCharacterCommonPreset);
  _0x49276e.find("#character_common_export_all").on("click", exportAllCharacterCommonPresets);
  _0x49276e.find("#character_common_import").on("click", importCharacterCommonPreset);
  _0x49276e.find("#character_common_delete").on("click", deleteCharacterCommonPreset);
  _0x49276e.find("#character_common_check").on("click", checkCharacterCommonList);
  _0x49276e.find("#character_common_add").on("click", addCharacterFromCommonSelector);
  _0x49276e.find("#character_common_refresh").on("click", loadCharacterCommonSelector);
  loadCharacterCommonPreset();
  loadCharacterCommonSelector();
}
export function loadCharacterCommonPresetList() {
  const _0x43995f = extension_settings[extensionName];
  const _0x202a81 = document.getElementById("character_common_preset_id");
  if (!_0x202a81) {
    return;
  }
  _0x202a81.innerHTML = "";
  for (const _0x24c243 in _0x43995f.characterCommonPresets) {
    const _0x30f3dc = document.createElement("option");
    _0x30f3dc.value = _0x24c243;
    _0x30f3dc.textContent = _0x24c243;
    _0x202a81.add(_0x30f3dc);
  }
  _0x202a81.value = _0x43995f.characterCommonPresetId;
}
export function loadCharacterCommonPreset() {
  const _0x14a9b0 = extension_settings[extensionName];
  const _0x2dbbef = document.getElementById("character_common_preset_id");
  if (!_0x2dbbef) {
    return;
  }
  const _0xbe3d90 = _0x2dbbef.value;
  _0x14a9b0.characterCommonPresetId = _0xbe3d90;
  const _0x318617 = _0x14a9b0.characterCommonPresets[_0xbe3d90];
  const _0x404c8e = document.getElementById("character_common_list");
  if (_0x404c8e && _0x318617) {
    _0x404c8e.value = (_0x318617.characters || []).join("\n");
  }
  saveSettingsDebounced();
}
function updateCharacterCommonPreset() {
  const _0x18615d = extension_settings[extensionName];
  const _0x582f4c = _0x18615d.characterCommonPresetId;
  if (!_0x582f4c || !_0x18615d.characterCommonPresets[_0x582f4c]) {
    toastr.warning("没有活动的通用角色列表预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  saveCurrentCharacterCommonData(_0x582f4c);
  toastr.success("通用角色列表预设 \"" + _0x582f4c + "\" 已保存");
}
function saveCharacterCommonPresetAs() {
  stylInput("请输入新通用角色列表预设的名称").then(_0x189403 => {
    if (_0x189403 && _0x189403.trim() !== "") {
      const _0xfed6d7 = extension_settings[extensionName];
      saveCurrentCharacterCommonData(_0x189403);
      _0xfed6d7.characterCommonPresetId = _0x189403;
      loadCharacterCommonPresetList();
      alert("通用角色列表预设 \"" + _0x189403 + "\" 已保存。");
    }
  });
}
function saveCurrentCharacterCommonData(_0x2b1d7b) {
  const _0x3a5e77 = extension_settings[extensionName];
  const _0x35bee2 = document.getElementById("character_common_list");
  if (!_0x35bee2) {
    return;
  }
  const _0x51b6e2 = _0x35bee2.value.split("\n").map(_0x23e1d7 => _0x23e1d7.trim()).filter(_0x5cd72e => _0x5cd72e.length > 0);
  const _0x2f86c2 = {
    characters: _0x51b6e2
  };
  _0x3a5e77.characterCommonPresets[_0x2b1d7b] = _0x2f86c2;
  saveSettingsDebounced();
}
function deleteCharacterCommonPreset() {
  const _0x527d00 = extension_settings[extensionName];
  const _0x5d338a = document.getElementById("character_common_preset_id")?.value;
  if (_0x5d338a === "默认通用角色列表") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该通用角色列表预设").then(_0x3ea0d3 => {
    if (_0x3ea0d3) {
      delete _0x527d00.characterCommonPresets[_0x5d338a];
      _0x527d00.characterCommonPresetId = "默认通用角色列表";
      loadCharacterCommonPresetList();
      loadCharacterCommonPreset();
      saveSettingsDebounced();
    }
  });
}
async function exportCharacterCommonPreset() {
  const _0x2511bc = extension_settings[extensionName];
  const _0xdb6896 = _0x2511bc.characterCommonPresetId;
  const _0x3e1ca6 = _0x2511bc.characterCommonPresets[_0xdb6896];
  if (!_0x3e1ca6) {
    alert("没有选中的通用角色列表预设可导出。");
    return;
  }
  const _0x908aa1 = _0x3e1ca6.characters || [];
  const _0x2a8813 = {
    [_0xdb6896]: _0x3e1ca6
  };
  const _0x558ff1 = {
    characterCommonPresets: _0x2a8813
  };
  let _0x3fa755 = _0x558ff1;
  if (_0x908aa1.length > 0) {
    const _0x85d8a0 = "检测到该列表包含 " + _0x908aa1.length + " 个角色:\n" + _0x908aa1.join("\n") + "\n\n是否一起导出相关角色?";
    const _0x348a53 = await stylishConfirm(_0x85d8a0);
    if (_0x348a53) {
      _0x3fa755.characters = {};
      _0x908aa1.forEach(_0x26b654 => {
        if (_0x2511bc.characterPresets[_0x26b654]) {
          const _0x488f99 = _0x2511bc.characterPresets[_0x26b654];
          _0x3fa755.characters[_0x26b654] = _0x488f99;
          const _0x592adb = _0x488f99.outfits || [];
          if (_0x592adb.length > 0) {
            if (!_0x3fa755.outfits) {
              _0x3fa755.outfits = {};
            }
            _0x592adb.forEach(_0xaf6194 => {
              if (_0x2511bc.outfitPresets[_0xaf6194]) {
                _0x3fa755.outfits[_0xaf6194] = _0x2511bc.outfitPresets[_0xaf6194];
              }
            });
          }
        }
      });
    }
  }
  _0x3fa755 = await encryptExportData(_0x3fa755);
  const _0x395b73 = JSON.stringify(_0x3fa755, null, 2);
  const _0xbcac66 = new Blob([_0x395b73], {
    type: "application/json"
  });
  const _0x20b2ae = URL.createObjectURL(_0xbcac66);
  const _0x15d7ed = document.createElement("a");
  _0x15d7ed.href = _0x20b2ae;
  _0x15d7ed.download = "st-chatu8-通用角色列表-" + _0xdb6896 + ".json";
  document.body.appendChild(_0x15d7ed);
  _0x15d7ed.click();
  document.body.removeChild(_0x15d7ed);
  URL.revokeObjectURL(_0x20b2ae);
}
async function exportAllCharacterCommonPresets() {
  const _0x39a0b6 = extension_settings[extensionName];
  if (!_0x39a0b6.characterCommonPresets || Object.keys(_0x39a0b6.characterCommonPresets).length === 0) {
    alert("没有通用角色列表预设可导出。");
    return;
  }
  const _0x59e5e7 = new Set();
  const _0x1bf2ca = new Set();
  for (const _0x15a376 in _0x39a0b6.characterCommonPresets) {
    const _0x435b17 = _0x39a0b6.characterCommonPresets[_0x15a376];
    const _0x3e9c87 = _0x435b17.characters || [];
    _0x3e9c87.forEach(_0x3e8a65 => {
      _0x59e5e7.add(_0x3e8a65);
      if (_0x39a0b6.characterPresets[_0x3e8a65]) {
        const _0x1bd53e = _0x39a0b6.characterPresets[_0x3e8a65].outfits || [];
        _0x1bd53e.forEach(_0x3a88a3 => _0x1bf2ca.add(_0x3a88a3));
      }
    });
  }
  const _0x58dde5 = {
    characterCommonPresets: _0x39a0b6.characterCommonPresets
  };
  let _0x2ae59d = _0x58dde5;
  if (_0x59e5e7.size > 0) {
    const _0x47c5e4 = "检测到所有列表共包含 " + _0x59e5e7.size + " 个不同的角色:\n" + Array.from(_0x59e5e7).join("\n") + "\n\n是否一起导出相关角色?";
    const _0x98ae43 = await stylishConfirm(_0x47c5e4);
    if (_0x98ae43) {
      _0x2ae59d.characters = {};
      _0x59e5e7.forEach(_0x419ccb => {
        if (_0x39a0b6.characterPresets[_0x419ccb]) {
          _0x2ae59d.characters[_0x419ccb] = _0x39a0b6.characterPresets[_0x419ccb];
        }
      });
      if (_0x1bf2ca.size > 0) {
        const _0x471767 = "同时检测到这些角色包含 " + _0x1bf2ca.size + " 个不同的服装:\n" + Array.from(_0x1bf2ca).join("\n") + "\n\n是否也一起导出?";
        const _0xdbbbc5 = await stylishConfirm(_0x471767);
        if (_0xdbbbc5) {
          _0x2ae59d.outfits = {};
          _0x1bf2ca.forEach(_0x2932b9 => {
            if (_0x39a0b6.outfitPresets[_0x2932b9]) {
              _0x2ae59d.outfits[_0x2932b9] = _0x39a0b6.outfitPresets[_0x2932b9];
            }
          });
        }
      }
    }
  }
  _0x2ae59d = await encryptExportData(_0x2ae59d);
  const _0x4a530c = JSON.stringify(_0x2ae59d, null, 2);
  const _0x1c9489 = new Blob([_0x4a530c], {
    type: "application/json"
  });
  const _0x8c0232 = URL.createObjectURL(_0x1c9489);
  const _0x48264d = document.createElement("a");
  _0x48264d.href = _0x8c0232;
  _0x48264d.download = "st-chatu8-通用角色列表-全部.json";
  document.body.appendChild(_0x48264d);
  _0x48264d.click();
  document.body.removeChild(_0x48264d);
  URL.revokeObjectURL(_0x8c0232);
}
function importCharacterCommonPreset() {
  const _0x3d4d11 = extension_settings[extensionName];
  const _0x541500 = document.createElement("input");
  _0x541500.type = "file";
  _0x541500.accept = ".json";
  _0x541500.onchange = async _0x3d77d3 => {
    const _0x39a6ca = _0x3d77d3.target.files[0];
    if (!_0x39a6ca) {
      return;
    }
    const _0xb1d7e9 = new FileReader();
    _0xb1d7e9.onload = async _0x513827 => {
      try {
        let _0x4803ee = JSON.parse(_0x513827.target.result);
        _0x4803ee = decryptImportData(_0x4803ee);
        let _0x9d865d = {};
        let _0x1179b2 = {};
        let _0x408f4a = {};
        if (_0x4803ee.characterCommonPresets) {
          _0x9d865d = _0x4803ee.characterCommonPresets;
          _0x1179b2 = _0x4803ee.characters || {};
          _0x408f4a = _0x4803ee.outfits || {};
        } else {
          _0x9d865d = _0x4803ee;
        }
        let _0x19d220 = false;
        if (Object.keys(_0x1179b2).length > 0) {
          const _0x587d7f = Object.keys(_0x1179b2);
          const _0x34c614 = "检测到 " + _0x587d7f.length + " 个相关角色:\n" + _0x587d7f.join("\n") + "\n\n是否一起导入?";
          _0x19d220 = await stylishConfirm(_0x34c614);
        }
        let _0x3c4286 = 0;
        for (const _0x54a615 in _0x9d865d) {
          if (_0x9d865d.hasOwnProperty(_0x54a615)) {
            if (!_0x3d4d11.characterCommonPresets.hasOwnProperty(_0x54a615)) {
              _0x3c4286++;
            }
            _0x3d4d11.characterCommonPresets[_0x54a615] = _0x9d865d[_0x54a615];
          }
        }
        let _0x525bfb = 0;
        let _0x46545f = 0;
        if (_0x19d220) {
          for (const _0xa653d3 in _0x1179b2) {
            if (_0x1179b2.hasOwnProperty(_0xa653d3)) {
              if (!_0x3d4d11.characterPresets.hasOwnProperty(_0xa653d3)) {
                _0x525bfb++;
              }
              _0x3d4d11.characterPresets[_0xa653d3] = _0x1179b2[_0xa653d3];
            }
          }
          for (const _0x531b2f in _0x408f4a) {
            if (_0x408f4a.hasOwnProperty(_0x531b2f)) {
              if (!_0x3d4d11.outfitPresets.hasOwnProperty(_0x531b2f)) {
                _0x46545f++;
              }
              _0x3d4d11.outfitPresets[_0x531b2f] = _0x408f4a[_0x531b2f];
            }
          }
        }
        saveSettingsDebounced();
        loadCharacterCommonPresetList();
        if (_0x19d220) {
          loadCharacterPresetList();
          loadOutfitPresetList();
        }
        const _0x4b29b8 = Object.keys(_0x9d865d)[0];
        if (_0x4b29b8) {
          _0x3d4d11.characterCommonPresetId = _0x4b29b8;
          const _0x4e3651 = document.getElementById("character_common_preset_id");
          if (_0x4e3651) {
            _0x4e3651.value = _0x4b29b8;
          }
          loadCharacterCommonPreset();
        }
        let _0x30bf25 = "成功导入 " + Object.keys(_0x9d865d).length + " 个通用角色列表预设，其中 " + _0x3c4286 + " 个是全新的。";
        if (_0x19d220) {
          _0x30bf25 += "\n同时导入 " + Object.keys(_0x1179b2).length + " 个角色预设(" + _0x525bfb + " 个全新)";
          _0x30bf25 += "和 " + Object.keys(_0x408f4a).length + " 个服装预设(" + _0x46545f + " 个全新)。";
        }
        alert(_0x30bf25);
      } catch (_0x213511) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x213511.message);
        console.error("Error importing character common presets:", _0x213511);
      }
    };
    _0xb1d7e9.readAsText(_0x39a6ca);
  };
  _0x541500.click();
}
export function loadCharacterCommonSelector() {
  const _0x2c9805 = extension_settings[extensionName];
  const _0x2c5b8c = document.getElementById("character_common_selector");
  if (!_0x2c5b8c) {
    return;
  }
  _0x2c5b8c.innerHTML = "<option value=\"\">-- 选择角色 --</option>";
  for (const _0x1fba97 in _0x2c9805.characterPresets) {
    const _0x54ced5 = document.createElement("option");
    _0x54ced5.value = _0x1fba97;
    _0x54ced5.textContent = _0x1fba97;
    _0x2c5b8c.add(_0x54ced5);
  }
}
function addCharacterFromCommonSelector() {
  const _0x1ce7e2 = document.getElementById("character_common_selector");
  const _0x18bc06 = document.getElementById("character_common_list");
  if (!_0x1ce7e2 || !_0x18bc06) {
    return;
  }
  const _0x2bf2a4 = _0x1ce7e2.value;
  if (!_0x2bf2a4) {
    alert("请先选择一个角色");
    return;
  }
  const _0x21b927 = _0x18bc06.value.trim();
  const _0x11fef8 = _0x21b927 ? _0x21b927.split("\n") : [];
  if (_0x11fef8.includes(_0x2bf2a4)) {
    alert("该角色已在列表中");
    return;
  }
  _0x11fef8.push(_0x2bf2a4);
  _0x18bc06.value = _0x11fef8.join("\n");
}
function checkCharacterCommonList() {
  const _0x204b21 = extension_settings[extensionName];
  const _0x1fd796 = document.getElementById("character_common_list");
  const _0x55718a = document.getElementById("character_common_check_result");
  const _0x5b91c7 = document.getElementById("character_common_check_content");
  if (!_0x1fd796 || !_0x55718a || !_0x5b91c7) {
    return;
  }
  const _0x28df24 = _0x1fd796.value.split("\n").map(_0x453f34 => _0x453f34.trim()).filter(_0x53eb3e => _0x53eb3e.length > 0);
  if (_0x28df24.length === 0) {
    alert("请先输入角色名称");
    return;
  }
  const _0x35e38f = new Set();
  for (const _0x26d25b in _0x204b21.characterPresets) {
    _0x35e38f.add(_0x26d25b);
  }
  const _0x4aec49 = {
    found: [],
    notFound: []
  };
  _0x28df24.forEach(_0x3e1877 => {
    if (_0x35e38f.has(_0x3e1877)) {
      _0x4aec49.found.push(_0x3e1877);
    } else {
      _0x4aec49.notFound.push(_0x3e1877);
    }
  });
  let _0x18c3e1 = "<div style=\"margin-bottom: 10px;\">";
  _0x18c3e1 += "<strong>总计：</strong>" + _0x28df24.length + " 个角色";
  _0x18c3e1 += "<br><strong>找到：</strong>" + _0x4aec49.found.length + " 个";
  _0x18c3e1 += "<br><strong>未找到：</strong>" + _0x4aec49.notFound.length + " 个";
  _0x18c3e1 += "</div>";
  if (_0x4aec49.found.length > 0) {
    _0x18c3e1 += "<div style=\"margin-bottom: 10px;\">";
    _0x18c3e1 += "<strong style=\"color: #28a745;\">✓ 已存在的角色：</strong>";
    _0x18c3e1 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x4aec49.found.forEach(_0x58feb7 => {
      _0x18c3e1 += "<li>" + _0x58feb7 + "</li>";
    });
    _0x18c3e1 += "</ul></div>";
  }
  if (_0x4aec49.notFound.length > 0) {
    _0x18c3e1 += "<div>";
    _0x18c3e1 += "<strong style=\"color: #dc3545;\">✗ 未找到的角色：</strong>";
    _0x18c3e1 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x4aec49.notFound.forEach(_0x1e1882 => {
      _0x18c3e1 += "<li>" + _0x1e1882 + "</li>";
    });
    _0x18c3e1 += "</ul></div>";
  }
  _0x5b91c7.innerHTML = _0x18c3e1;
  $(_0x55718a).show();
}