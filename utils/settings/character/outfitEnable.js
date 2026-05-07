import { extension_settings } from "../../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../../script.js";
import { extensionName } from "../../config.js";
import { stylInput, stylishConfirm } from "../../ui_common.js";
import { encryptExportData, decryptImportData } from "./crypto.js";
import { loadOutfitPresetList } from "./outfitPreset.js";
export function setupOutfitEnableControls(_0x14afe) {
  loadOutfitEnablePresetList();
  _0x14afe.find("#outfit_enable_preset_id").on("change", loadOutfitEnablePreset);
  _0x14afe.find("#outfit_enable_update").on("click", updateOutfitEnablePreset);
  _0x14afe.find("#outfit_enable_save_as").on("click", saveOutfitEnablePresetAs);
  _0x14afe.find("#outfit_enable_export").on("click", exportOutfitEnablePreset);
  _0x14afe.find("#outfit_enable_export_all").on("click", exportAllOutfitEnablePresets);
  _0x14afe.find("#outfit_enable_import").on("click", importOutfitEnablePreset);
  _0x14afe.find("#outfit_enable_delete").on("click", deleteOutfitEnablePreset);
  _0x14afe.find("#outfit_enable_check").on("click", checkOutfitEnableList);
  _0x14afe.find("#outfit_enable_add").on("click", addOutfitFromEnableSelector);
  _0x14afe.find("#outfit_enable_refresh").on("click", loadOutfitEnableSelector);
  loadOutfitEnablePreset();
  loadOutfitEnableSelector();
}
export function loadOutfitEnablePresetList() {
  const _0x1d904b = extension_settings[extensionName];
  const _0x345732 = document.getElementById("outfit_enable_preset_id");
  if (!_0x345732) {
    return;
  }
  _0x345732.innerHTML = "";
  for (const _0xd97b9e in _0x1d904b.outfitEnablePresets) {
    const _0x3cf416 = document.createElement("option");
    _0x3cf416.value = _0xd97b9e;
    _0x3cf416.textContent = _0xd97b9e;
    _0x345732.add(_0x3cf416);
  }
  _0x345732.value = _0x1d904b.outfitEnablePresetId;
}
export function loadOutfitEnablePreset() {
  const _0x3681df = extension_settings[extensionName];
  const _0x463070 = document.getElementById("outfit_enable_preset_id");
  if (!_0x463070) {
    return;
  }
  const _0x4da2d0 = _0x463070.value;
  _0x3681df.outfitEnablePresetId = _0x4da2d0;
  const _0x326647 = _0x3681df.outfitEnablePresets[_0x4da2d0];
  const _0xdc9b1c = document.getElementById("outfit_enable_list");
  if (_0xdc9b1c && _0x326647) {
    _0xdc9b1c.value = (_0x326647.outfits || []).join("\n");
  }
  saveSettingsDebounced();
}
function updateOutfitEnablePreset() {
  const _0x4286b0 = extension_settings[extensionName];
  const _0x4a5a6c = _0x4286b0.outfitEnablePresetId;
  if (!_0x4a5a6c || !_0x4286b0.outfitEnablePresets[_0x4a5a6c]) {
    toastr.warning("没有活动的通用服装列表预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  saveCurrentOutfitEnableData(_0x4a5a6c);
  toastr.success("通用服装列表预设 \"" + _0x4a5a6c + "\" 已保存");
}
function saveOutfitEnablePresetAs() {
  stylInput("请输入新通用服装列表预设的名称").then(_0x5b0bf2 => {
    if (_0x5b0bf2 && _0x5b0bf2.trim() !== "") {
      const _0x3bdedd = extension_settings[extensionName];
      saveCurrentOutfitEnableData(_0x5b0bf2);
      _0x3bdedd.outfitEnablePresetId = _0x5b0bf2;
      loadOutfitEnablePresetList();
      alert("通用服装列表预设 \"" + _0x5b0bf2 + "\" 已保存。");
    }
  });
}
function saveCurrentOutfitEnableData(_0x53ac78) {
  const _0x44f8bf = extension_settings[extensionName];
  const _0x1f1e49 = document.getElementById("outfit_enable_list");
  if (!_0x1f1e49) {
    return;
  }
  const _0x30cbcb = _0x1f1e49.value.split("\n").map(_0x152b64 => _0x152b64.trim()).filter(_0x41ad28 => _0x41ad28.length > 0);
  const _0x4b03a4 = {
    outfits: _0x30cbcb
  };
  _0x44f8bf.outfitEnablePresets[_0x53ac78] = _0x4b03a4;
  saveSettingsDebounced();
}
function deleteOutfitEnablePreset() {
  const _0x4a23c4 = extension_settings[extensionName];
  const _0x3b8656 = document.getElementById("outfit_enable_preset_id")?.value;
  if (_0x3b8656 === "默认服装列表") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该通用服装列表预设").then(_0x421247 => {
    if (_0x421247) {
      delete _0x4a23c4.outfitEnablePresets[_0x3b8656];
      _0x4a23c4.outfitEnablePresetId = "默认服装列表";
      loadOutfitEnablePresetList();
      loadOutfitEnablePreset();
      saveSettingsDebounced();
    }
  });
}
async function exportOutfitEnablePreset() {
  const _0x11a3b4 = extension_settings[extensionName];
  const _0x19f69f = _0x11a3b4.outfitEnablePresetId;
  const _0x4b523f = _0x11a3b4.outfitEnablePresets[_0x19f69f];
  if (!_0x4b523f) {
    alert("没有选中的通用服装列表预设可导出。");
    return;
  }
  const _0x1efbfc = _0x4b523f.outfits || [];
  const _0x36cc15 = {
    [_0x19f69f]: _0x4b523f
  };
  const _0x19f3ed = {
    outfitEnablePresets: _0x36cc15
  };
  let _0x506ef2 = _0x19f3ed;
  if (_0x1efbfc.length > 0) {
    const _0x48458a = "检测到该列表包含 " + _0x1efbfc.length + " 个服装:\n" + _0x1efbfc.join("\n") + "\n\n是否一起导出相关服装?";
    const _0xb3082a = await stylishConfirm(_0x48458a);
    if (_0xb3082a) {
      _0x506ef2.outfits = {};
      _0x1efbfc.forEach(_0x28b570 => {
        if (_0x11a3b4.outfitPresets[_0x28b570]) {
          _0x506ef2.outfits[_0x28b570] = _0x11a3b4.outfitPresets[_0x28b570];
        }
      });
    }
  }
  _0x506ef2 = await encryptExportData(_0x506ef2);
  const _0x59b210 = JSON.stringify(_0x506ef2, null, 2);
  const _0x1143c0 = new Blob([_0x59b210], {
    type: "application/json"
  });
  const _0x111497 = URL.createObjectURL(_0x1143c0);
  const _0x3ecd31 = document.createElement("a");
  _0x3ecd31.href = _0x111497;
  _0x3ecd31.download = "st-chatu8-通用服装列表-" + _0x19f69f + ".json";
  document.body.appendChild(_0x3ecd31);
  _0x3ecd31.click();
  document.body.removeChild(_0x3ecd31);
  URL.revokeObjectURL(_0x111497);
}
async function exportAllOutfitEnablePresets() {
  const _0x46ab3 = extension_settings[extensionName];
  if (!_0x46ab3.outfitEnablePresets || Object.keys(_0x46ab3.outfitEnablePresets).length === 0) {
    alert("没有通用服装列表预设可导出。");
    return;
  }
  const _0x5803e9 = new Set();
  for (const _0x20639f in _0x46ab3.outfitEnablePresets) {
    const _0x22fb12 = _0x46ab3.outfitEnablePresets[_0x20639f];
    const _0x12aceb = _0x22fb12.outfits || [];
    _0x12aceb.forEach(_0xce8fa6 => _0x5803e9.add(_0xce8fa6));
  }
  const _0x3e5ef6 = {
    outfitEnablePresets: _0x46ab3.outfitEnablePresets
  };
  let _0x438f98 = _0x3e5ef6;
  if (_0x5803e9.size > 0) {
    const _0xf225a0 = "检测到所有列表共包含 " + _0x5803e9.size + " 个不同的服装:\n" + Array.from(_0x5803e9).join("\n") + "\n\n是否一起导出相关服装?";
    const _0x28925c = await stylishConfirm(_0xf225a0);
    if (_0x28925c) {
      _0x438f98.outfits = {};
      _0x5803e9.forEach(_0x2ebe5d => {
        if (_0x46ab3.outfitPresets[_0x2ebe5d]) {
          _0x438f98.outfits[_0x2ebe5d] = _0x46ab3.outfitPresets[_0x2ebe5d];
        }
      });
    }
  }
  _0x438f98 = await encryptExportData(_0x438f98);
  const _0x4054c6 = JSON.stringify(_0x438f98, null, 2);
  const _0x52fa1c = new Blob([_0x4054c6], {
    type: "application/json"
  });
  const _0x46a85f = URL.createObjectURL(_0x52fa1c);
  const _0x145f34 = document.createElement("a");
  _0x145f34.href = _0x46a85f;
  _0x145f34.download = "st-chatu8-通用服装列表-全部.json";
  document.body.appendChild(_0x145f34);
  _0x145f34.click();
  document.body.removeChild(_0x145f34);
  URL.revokeObjectURL(_0x46a85f);
}
function importOutfitEnablePreset() {
  const _0x310a1d = extension_settings[extensionName];
  const _0x3834cb = document.createElement("input");
  _0x3834cb.type = "file";
  _0x3834cb.accept = ".json";
  _0x3834cb.onchange = async _0x230196 => {
    const _0x389ec0 = _0x230196.target.files[0];
    if (!_0x389ec0) {
      return;
    }
    const _0x13ee3b = new FileReader();
    _0x13ee3b.onload = async _0x2e86aa => {
      try {
        let _0x1bc606 = JSON.parse(_0x2e86aa.target.result);
        _0x1bc606 = decryptImportData(_0x1bc606);
        let _0xecff23 = {};
        let _0x4789ef = {};
        if (_0x1bc606.outfitEnablePresets) {
          _0xecff23 = _0x1bc606.outfitEnablePresets;
          _0x4789ef = _0x1bc606.outfits || {};
        } else {
          _0xecff23 = _0x1bc606;
        }
        let _0x585a51 = false;
        if (Object.keys(_0x4789ef).length > 0) {
          const _0xe3eb93 = Object.keys(_0x4789ef);
          const _0x112d56 = "检测到 " + _0xe3eb93.length + " 个相关服装:\n" + _0xe3eb93.join("\n") + "\n\n是否一起导入?";
          _0x585a51 = await stylishConfirm(_0x112d56);
        }
        let _0x3e5aa7 = 0;
        for (const _0x406caa in _0xecff23) {
          if (_0xecff23.hasOwnProperty(_0x406caa)) {
            if (!_0x310a1d.outfitEnablePresets.hasOwnProperty(_0x406caa)) {
              _0x3e5aa7++;
            }
            _0x310a1d.outfitEnablePresets[_0x406caa] = _0xecff23[_0x406caa];
          }
        }
        let _0x4009d2 = 0;
        if (_0x585a51) {
          for (const _0x21d906 in _0x4789ef) {
            if (_0x4789ef.hasOwnProperty(_0x21d906)) {
              if (!_0x310a1d.outfitPresets.hasOwnProperty(_0x21d906)) {
                _0x4009d2++;
              }
              _0x310a1d.outfitPresets[_0x21d906] = _0x4789ef[_0x21d906];
            }
          }
        }
        saveSettingsDebounced();
        loadOutfitEnablePresetList();
        if (_0x585a51) {
          loadOutfitPresetList();
        }
        const _0x4dcfcc = Object.keys(_0xecff23)[0];
        if (_0x4dcfcc) {
          _0x310a1d.outfitEnablePresetId = _0x4dcfcc;
          const _0x533ea8 = document.getElementById("outfit_enable_preset_id");
          if (_0x533ea8) {
            _0x533ea8.value = _0x4dcfcc;
          }
          loadOutfitEnablePreset();
        }
        let _0x56e024 = "成功导入 " + Object.keys(_0xecff23).length + " 个通用服装列表预设，其中 " + _0x3e5aa7 + " 个是全新的。";
        if (_0x585a51) {
          _0x56e024 += "\n同时导入 " + Object.keys(_0x4789ef).length + " 个服装预设，其中 " + _0x4009d2 + " 个是全新的。";
        }
        alert(_0x56e024);
      } catch (_0x498ed8) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x498ed8.message);
        console.error("Error importing outfit enable presets:", _0x498ed8);
      }
    };
    _0x13ee3b.readAsText(_0x389ec0);
  };
  _0x3834cb.click();
}
export function loadOutfitEnableSelector() {
  const _0x536f27 = extension_settings[extensionName];
  const _0x42aea2 = document.getElementById("outfit_enable_selector");
  if (!_0x42aea2) {
    return;
  }
  _0x42aea2.innerHTML = "<option value=\"\">-- 选择服装 --</option>";
  for (const _0x4f8429 in _0x536f27.outfitPresets) {
    const _0x243a94 = document.createElement("option");
    _0x243a94.value = _0x4f8429;
    _0x243a94.textContent = _0x4f8429;
    _0x42aea2.add(_0x243a94);
  }
}
function addOutfitFromEnableSelector() {
  const _0x34fb6c = document.getElementById("outfit_enable_selector");
  const _0x272ca4 = document.getElementById("outfit_enable_list");
  if (!_0x34fb6c || !_0x272ca4) {
    return;
  }
  const _0x547804 = _0x34fb6c.value;
  if (!_0x547804) {
    alert("请先选择一个服装");
    return;
  }
  const _0x24f7f4 = _0x272ca4.value.trim();
  const _0x3f797a = _0x24f7f4 ? _0x24f7f4.split("\n") : [];
  if (_0x3f797a.includes(_0x547804)) {
    alert("该服装已在列表中");
    return;
  }
  _0x3f797a.push(_0x547804);
  _0x272ca4.value = _0x3f797a.join("\n");
}
function checkOutfitEnableList() {
  const _0x4b2070 = extension_settings[extensionName];
  const _0x4174cd = document.getElementById("outfit_enable_list");
  const _0x2d8148 = document.getElementById("outfit_enable_check_result");
  const _0xe17eb7 = document.getElementById("outfit_enable_check_content");
  if (!_0x4174cd || !_0x2d8148 || !_0xe17eb7) {
    return;
  }
  const _0x118ffb = _0x4174cd.value.split("\n").map(_0x464194 => _0x464194.trim()).filter(_0x292004 => _0x292004.length > 0);
  if (_0x118ffb.length === 0) {
    alert("请先输入服装名称");
    return;
  }
  const _0x3792c3 = new Set();
  for (const _0x4f6d96 in _0x4b2070.outfitPresets) {
    _0x3792c3.add(_0x4f6d96);
  }
  const _0x3fe986 = {
    found: [],
    notFound: []
  };
  _0x118ffb.forEach(_0x43db55 => {
    if (_0x3792c3.has(_0x43db55)) {
      _0x3fe986.found.push(_0x43db55);
    } else {
      _0x3fe986.notFound.push(_0x43db55);
    }
  });
  let _0x432436 = "<div style=\"margin-bottom: 10px;\">";
  _0x432436 += "<strong>总计：</strong>" + _0x118ffb.length + " 个服装";
  _0x432436 += "<br><strong>找到：</strong>" + _0x3fe986.found.length + " 个";
  _0x432436 += "<br><strong>未找到：</strong>" + _0x3fe986.notFound.length + " 个";
  _0x432436 += "</div>";
  if (_0x3fe986.found.length > 0) {
    _0x432436 += "<div style=\"margin-bottom: 10px;\">";
    _0x432436 += "<strong style=\"color: #28a745;\">✓ 已存在的服装：</strong>";
    _0x432436 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x3fe986.found.forEach(_0x29d8af => {
      _0x432436 += "<li>" + _0x29d8af + "</li>";
    });
    _0x432436 += "</ul></div>";
  }
  if (_0x3fe986.notFound.length > 0) {
    _0x432436 += "<div>";
    _0x432436 += "<strong style=\"color: #dc3545;\">✗ 未找到的服装：</strong>";
    _0x432436 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x3fe986.notFound.forEach(_0x28ddee => {
      _0x432436 += "<li>" + _0x28ddee + "</li>";
    });
    _0x432436 += "</ul></div>";
  }
  _0xe17eb7.innerHTML = _0x432436;
  $(_0x2d8148).show();
}