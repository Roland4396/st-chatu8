import { extension_settings } from "../../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../../script.js";
import { extensionName } from "../../config.js";
import { stylInput, stylishConfirm } from "../../ui_common.js";
import { encryptExportData, decryptImportData } from "./crypto.js";
import { loadCharacterPresetList } from "./characterPreset.js";
import { loadOutfitPresetList } from "./outfitPreset.js";
export function setupCharacterEnableControls(_0x1a27f2) {
  loadCharacterEnablePresetList();
  _0x1a27f2.find("#character_enable_preset_id").on("change", loadCharacterEnablePreset);
  _0x1a27f2.find("#character_enable_update").on("click", updateCharacterEnablePreset);
  _0x1a27f2.find("#character_enable_save_as").on("click", saveCharacterEnablePresetAs);
  _0x1a27f2.find("#character_enable_export").on("click", exportCharacterEnablePreset);
  _0x1a27f2.find("#character_enable_export_all").on("click", exportAllCharacterEnablePresets);
  _0x1a27f2.find("#character_enable_import").on("click", importCharacterEnablePreset);
  _0x1a27f2.find("#character_enable_delete").on("click", deleteCharacterEnablePreset);
  _0x1a27f2.find("#character_enable_check").on("click", checkCharacterList);
  _0x1a27f2.find("#character_enable_add").on("click", addCharacterFromSelector);
  _0x1a27f2.find("#character_enable_refresh").on("click", loadCharacterSelector);
  loadCharacterEnablePreset();
  loadCharacterSelector();
}
export function loadCharacterEnablePresetList() {
  const _0x515932 = extension_settings[extensionName];
  const _0x21d725 = document.getElementById("character_enable_preset_id");
  if (!_0x21d725) {
    return;
  }
  _0x21d725.innerHTML = "";
  for (const _0x1a786b in _0x515932.characterEnablePresets) {
    const _0xa30b77 = document.createElement("option");
    _0xa30b77.value = _0x1a786b;
    _0xa30b77.textContent = _0x1a786b;
    _0x21d725.add(_0xa30b77);
  }
  _0x21d725.value = _0x515932.characterEnablePresetId;
}
export function loadCharacterEnablePreset() {
  const _0x983578 = extension_settings[extensionName];
  const _0x18366c = document.getElementById("character_enable_preset_id");
  if (!_0x18366c) {
    return;
  }
  const _0x366b31 = _0x18366c.value;
  _0x983578.characterEnablePresetId = _0x366b31;
  const _0x5453f8 = _0x983578.characterEnablePresets[_0x366b31];
  const _0xb45509 = document.getElementById("character_enable_list");
  if (_0xb45509 && _0x5453f8) {
    _0xb45509.value = (_0x5453f8.characters || []).join("\n");
  }
  saveSettingsDebounced();
}
function updateCharacterEnablePreset() {
  const _0x566b64 = extension_settings[extensionName];
  const _0x3113ae = _0x566b64.characterEnablePresetId;
  if (!_0x3113ae || !_0x566b64.characterEnablePresets[_0x3113ae]) {
    toastr.warning("没有活动的角色启用预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  saveCurrentCharacterEnableData(_0x3113ae);
  toastr.success("角色启用预设 \"" + _0x3113ae + "\" 已保存");
}
function saveCharacterEnablePresetAs() {
  stylInput("请输入新角色启用预设的名称").then(_0xc23569 => {
    if (_0xc23569 && _0xc23569.trim() !== "") {
      const _0x33fd1a = extension_settings[extensionName];
      saveCurrentCharacterEnableData(_0xc23569);
      _0x33fd1a.characterEnablePresetId = _0xc23569;
      loadCharacterEnablePresetList();
      alert("角色启用预设 \"" + _0xc23569 + "\" 已保存。");
    }
  });
}
function saveCurrentCharacterEnableData(_0x570d62) {
  const _0x5ccdfc = extension_settings[extensionName];
  const _0x38473a = document.getElementById("character_enable_list");
  if (!_0x38473a) {
    return;
  }
  const _0x451d7f = _0x38473a.value.split("\n").map(_0x2af92c => _0x2af92c.trim()).filter(_0x454fe7 => _0x454fe7.length > 0);
  const _0x3889c0 = {
    characters: _0x451d7f
  };
  _0x5ccdfc.characterEnablePresets[_0x570d62] = _0x3889c0;
  saveSettingsDebounced();
}
function deleteCharacterEnablePreset() {
  const _0x3b6732 = extension_settings[extensionName];
  const _0x5168b9 = document.getElementById("character_enable_preset_id")?.value;
  if (_0x5168b9 === "默认启用列表") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该角色启用预设").then(_0x6d8342 => {
    if (_0x6d8342) {
      delete _0x3b6732.characterEnablePresets[_0x5168b9];
      _0x3b6732.characterEnablePresetId = "默认启用列表";
      loadCharacterEnablePresetList();
      loadCharacterEnablePreset();
      saveSettingsDebounced();
    }
  });
}
async function exportCharacterEnablePreset() {
  const _0x37574e = extension_settings[extensionName];
  const _0x561af3 = _0x37574e.characterEnablePresetId;
  const _0x5625c8 = _0x37574e.characterEnablePresets[_0x561af3];
  if (!_0x5625c8) {
    alert("没有选中的角色启用预设可导出。");
    return;
  }
  const _0x44dc3c = _0x5625c8.characters || [];
  const _0x4d0f1 = {
    [_0x561af3]: _0x5625c8
  };
  const _0x4a2817 = {
    characterEnablePresets: _0x4d0f1
  };
  let _0xfe8f6b = _0x4a2817;
  if (_0x44dc3c.length > 0) {
    const _0x39a3fb = "检测到该列表包含 " + _0x44dc3c.length + " 个角色:\n" + _0x44dc3c.join("\n") + "\n\n是否一起导出相关角色?";
    const _0x19d39b = await stylishConfirm(_0x39a3fb);
    if (_0x19d39b) {
      _0xfe8f6b.characters = {};
      _0x44dc3c.forEach(_0x5983c2 => {
        if (_0x37574e.characterPresets[_0x5983c2]) {
          const _0x406271 = _0x37574e.characterPresets[_0x5983c2];
          _0xfe8f6b.characters[_0x5983c2] = _0x406271;
          const _0x213879 = _0x406271.outfits || [];
          if (_0x213879.length > 0) {
            if (!_0xfe8f6b.outfits) {
              _0xfe8f6b.outfits = {};
            }
            _0x213879.forEach(_0x205e9c => {
              if (_0x37574e.outfitPresets[_0x205e9c]) {
                _0xfe8f6b.outfits[_0x205e9c] = _0x37574e.outfitPresets[_0x205e9c];
              }
            });
          }
        }
      });
    }
  }
  _0xfe8f6b = await encryptExportData(_0xfe8f6b);
  const _0xaa800a = JSON.stringify(_0xfe8f6b, null, 2);
  const _0x355b70 = new Blob([_0xaa800a], {
    type: "application/json"
  });
  const _0x510f22 = URL.createObjectURL(_0x355b70);
  const _0x1b16b0 = document.createElement("a");
  _0x1b16b0.href = _0x510f22;
  _0x1b16b0.download = "st-chatu8-角色启用列表-" + _0x561af3 + ".json";
  document.body.appendChild(_0x1b16b0);
  _0x1b16b0.click();
  document.body.removeChild(_0x1b16b0);
  URL.revokeObjectURL(_0x510f22);
}
async function exportAllCharacterEnablePresets() {
  const _0x5379b3 = extension_settings[extensionName];
  if (!_0x5379b3.characterEnablePresets || Object.keys(_0x5379b3.characterEnablePresets).length === 0) {
    alert("没有角色启用预设可导出。");
    return;
  }
  const _0x2cd66e = new Set();
  const _0x10a60e = new Set();
  for (const _0x539089 in _0x5379b3.characterEnablePresets) {
    const _0x1db3cc = _0x5379b3.characterEnablePresets[_0x539089];
    const _0x46d97d = _0x1db3cc.characters || [];
    _0x46d97d.forEach(_0x183494 => {
      _0x2cd66e.add(_0x183494);
      if (_0x5379b3.characterPresets[_0x183494]) {
        const _0x25955a = _0x5379b3.characterPresets[_0x183494].outfits || [];
        _0x25955a.forEach(_0x2c4bf2 => _0x10a60e.add(_0x2c4bf2));
      }
    });
  }
  const _0x149f07 = {
    characterEnablePresets: _0x5379b3.characterEnablePresets
  };
  let _0x2f89b7 = _0x149f07;
  if (_0x2cd66e.size > 0) {
    const _0x3ac1e1 = "检测到所有列表共包含 " + _0x2cd66e.size + " 个不同的角色:\n" + Array.from(_0x2cd66e).join("\n") + "\n\n是否一起导出相关角色?";
    const _0x2c3190 = await stylishConfirm(_0x3ac1e1);
    if (_0x2c3190) {
      _0x2f89b7.characters = {};
      _0x2cd66e.forEach(_0x17e029 => {
        if (_0x5379b3.characterPresets[_0x17e029]) {
          _0x2f89b7.characters[_0x17e029] = _0x5379b3.characterPresets[_0x17e029];
        }
      });
      if (_0x10a60e.size > 0) {
        const _0x4264d9 = "同时检测到这些角色包含 " + _0x10a60e.size + " 个不同的服装:\n" + Array.from(_0x10a60e).join("\n") + "\n\n是否也一起导出?";
        const _0x206dfe = await stylishConfirm(_0x4264d9);
        if (_0x206dfe) {
          _0x2f89b7.outfits = {};
          _0x10a60e.forEach(_0x24f95f => {
            if (_0x5379b3.outfitPresets[_0x24f95f]) {
              _0x2f89b7.outfits[_0x24f95f] = _0x5379b3.outfitPresets[_0x24f95f];
            }
          });
        }
      }
    }
  }
  _0x2f89b7 = await encryptExportData(_0x2f89b7);
  const _0x9c8c7a = JSON.stringify(_0x2f89b7, null, 2);
  const _0x5236b4 = new Blob([_0x9c8c7a], {
    type: "application/json"
  });
  const _0x53b561 = URL.createObjectURL(_0x5236b4);
  const _0x5e4c7c = document.createElement("a");
  _0x5e4c7c.href = _0x53b561;
  _0x5e4c7c.download = "st-chatu8-角色启用列表-全部.json";
  document.body.appendChild(_0x5e4c7c);
  _0x5e4c7c.click();
  document.body.removeChild(_0x5e4c7c);
  URL.revokeObjectURL(_0x53b561);
}
function importCharacterEnablePreset() {
  const _0x9ebdde = extension_settings[extensionName];
  const _0x3941de = document.createElement("input");
  _0x3941de.type = "file";
  _0x3941de.accept = ".json";
  _0x3941de.onchange = async _0x29d7f3 => {
    const _0x46ff0f = _0x29d7f3.target.files[0];
    if (!_0x46ff0f) {
      return;
    }
    const _0x4a8ece = new FileReader();
    _0x4a8ece.onload = async _0x625e91 => {
      try {
        let _0x32ad0b = JSON.parse(_0x625e91.target.result);
        _0x32ad0b = decryptImportData(_0x32ad0b);
        let _0x177d00 = {};
        let _0x11ccf6 = {};
        let _0x30295c = {};
        if (_0x32ad0b.characterEnablePresets) {
          _0x177d00 = _0x32ad0b.characterEnablePresets;
          _0x11ccf6 = _0x32ad0b.characters || {};
          _0x30295c = _0x32ad0b.outfits || {};
        } else {
          _0x177d00 = _0x32ad0b;
        }
        let _0xc3d8b6 = false;
        if (Object.keys(_0x11ccf6).length > 0) {
          const _0xcb4f8f = Object.keys(_0x11ccf6);
          const _0x27cd06 = "检测到 " + _0xcb4f8f.length + " 个相关角色:\n" + _0xcb4f8f.join("\n") + "\n\n是否一起导入?";
          _0xc3d8b6 = await stylishConfirm(_0x27cd06);
        }
        let _0x5603f2 = 0;
        for (const _0x23cdb2 in _0x177d00) {
          if (_0x177d00.hasOwnProperty(_0x23cdb2)) {
            if (!_0x9ebdde.characterEnablePresets.hasOwnProperty(_0x23cdb2)) {
              _0x5603f2++;
            }
            _0x9ebdde.characterEnablePresets[_0x23cdb2] = _0x177d00[_0x23cdb2];
          }
        }
        let _0xca471f = 0;
        let _0x1fb59c = 0;
        if (_0xc3d8b6) {
          for (const _0xf90d07 in _0x11ccf6) {
            if (_0x11ccf6.hasOwnProperty(_0xf90d07)) {
              if (!_0x9ebdde.characterPresets.hasOwnProperty(_0xf90d07)) {
                _0xca471f++;
              }
              _0x9ebdde.characterPresets[_0xf90d07] = _0x11ccf6[_0xf90d07];
            }
          }
          for (const _0x39fb6 in _0x30295c) {
            if (_0x30295c.hasOwnProperty(_0x39fb6)) {
              if (!_0x9ebdde.outfitPresets.hasOwnProperty(_0x39fb6)) {
                _0x1fb59c++;
              }
              _0x9ebdde.outfitPresets[_0x39fb6] = _0x30295c[_0x39fb6];
            }
          }
        }
        saveSettingsDebounced();
        loadCharacterEnablePresetList();
        if (_0xc3d8b6) {
          loadCharacterPresetList();
          loadOutfitPresetList();
        }
        const _0x2419ca = Object.keys(_0x177d00)[0];
        if (_0x2419ca) {
          _0x9ebdde.characterEnablePresetId = _0x2419ca;
          const _0x17eb8f = document.getElementById("character_enable_preset_id");
          if (_0x17eb8f) {
            _0x17eb8f.value = _0x2419ca;
          }
          loadCharacterEnablePreset();
        }
        let _0x1105aa = "成功导入 " + Object.keys(_0x177d00).length + " 个角色启用预设，其中 " + _0x5603f2 + " 个是全新的。";
        if (_0xc3d8b6) {
          _0x1105aa += "\n同时导入 " + Object.keys(_0x11ccf6).length + " 个角色预设(" + _0xca471f + " 个全新)";
          _0x1105aa += "和 " + Object.keys(_0x30295c).length + " 个服装预设(" + _0x1fb59c + " 个全新)。";
        }
        alert(_0x1105aa);
      } catch (_0x224373) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x224373.message);
        console.error("Error importing character enable presets:", _0x224373);
      }
    };
    _0x4a8ece.readAsText(_0x46ff0f);
  };
  _0x3941de.click();
}
export function loadCharacterSelector() {
  const _0x4677b0 = extension_settings[extensionName];
  const _0x247cfb = document.getElementById("character_enable_selector");
  if (!_0x247cfb) {
    return;
  }
  _0x247cfb.innerHTML = "<option value=\"\">-- 选择角色 --</option>";
  for (const _0x8ca7c2 in _0x4677b0.characterPresets) {
    const _0x4db9d9 = document.createElement("option");
    _0x4db9d9.value = _0x8ca7c2;
    _0x4db9d9.textContent = _0x8ca7c2;
    _0x247cfb.add(_0x4db9d9);
  }
}
function addCharacterFromSelector() {
  const _0x4f633e = document.getElementById("character_enable_selector");
  const _0x36f93c = document.getElementById("character_enable_list");
  if (!_0x4f633e || !_0x36f93c) {
    return;
  }
  const _0x56fd3b = _0x4f633e.value;
  if (!_0x56fd3b) {
    alert("请先选择一个角色");
    return;
  }
  const _0x499885 = _0x36f93c.value.trim();
  const _0x3dfaca = _0x499885 ? _0x499885.split("\n") : [];
  if (_0x3dfaca.includes(_0x56fd3b)) {
    alert("该角色已在列表中");
    return;
  }
  _0x3dfaca.push(_0x56fd3b);
  _0x36f93c.value = _0x3dfaca.join("\n");
}
export function checkCharacterList() {
  const _0x368970 = extension_settings[extensionName];
  const _0x3114e3 = document.getElementById("character_enable_list");
  const _0x55b45e = document.getElementById("character_enable_check_result");
  const _0x10019e = document.getElementById("character_enable_check_content");
  if (!_0x3114e3 || !_0x55b45e || !_0x10019e) {
    return;
  }
  const _0x3d4353 = _0x3114e3.value.split("\n").map(_0x5eb193 => _0x5eb193.trim()).filter(_0x2f44a1 => _0x2f44a1.length > 0);
  if (_0x3d4353.length === 0) {
    alert("请先输入角色名称");
    return;
  }
  const _0x1a2677 = new Set();
  for (const _0x566ec2 in _0x368970.characterPresets) {
    _0x1a2677.add(_0x566ec2);
  }
  const _0x1e8dfe = {
    found: [],
    notFound: []
  };
  _0x3d4353.forEach(_0x3df298 => {
    if (_0x1a2677.has(_0x3df298)) {
      _0x1e8dfe.found.push(_0x3df298);
    } else {
      _0x1e8dfe.notFound.push(_0x3df298);
    }
  });
  let _0x894679 = "<div style=\"margin-bottom: 10px;\">";
  _0x894679 += "<strong>总计：</strong>" + _0x3d4353.length + " 个角色";
  _0x894679 += "<br><strong>找到：</strong>" + _0x1e8dfe.found.length + " 个";
  _0x894679 += "<br><strong>未找到：</strong>" + _0x1e8dfe.notFound.length + " 个";
  _0x894679 += "</div>";
  if (_0x1e8dfe.found.length > 0) {
    _0x894679 += "<div style=\"margin-bottom: 10px;\">";
    _0x894679 += "<strong style=\"color: #28a745;\">✓ 已存在的角色：</strong>";
    _0x894679 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x1e8dfe.found.forEach(_0x39a64d => {
      _0x894679 += "<li>" + _0x39a64d + "</li>";
    });
    _0x894679 += "</ul></div>";
  }
  if (_0x1e8dfe.notFound.length > 0) {
    _0x894679 += "<div>";
    _0x894679 += "<strong style=\"color: #dc3545;\">✗ 未找到的角色：</strong>";
    _0x894679 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x1e8dfe.notFound.forEach(_0x4cc60c => {
      _0x894679 += "<li>" + _0x4cc60c + "</li>";
    });
    _0x894679 += "</ul></div>";
  }
  _0x10019e.innerHTML = _0x894679;
  $(_0x55b45e).show();
}