import { extension_settings } from "../../../../../../extensions.js";
import { saveSettingsDebounced, eventSource } from "../../../../../../../script.js";
import { extensionName, EventType } from "../../config.js";
import { stylInput, stylishConfirm } from "../../ui_common.js";
import { encryptExportData, decryptImportData } from "./crypto.js";
import { translatePromptTags } from "../../ai.js";
import { getConfigImage, saveConfigImage, deleteConfigImage } from "../../configDatabase.js";
import { handleOutfitPhotoGeneratePromptClick } from "../../outfitImagePromptGen.js";
import { handleOutfitPromptModify } from "../../outfitPromptModify.js";
import { showOutfitVisualSelector } from "./characterVisualSelector.js";
const activeOutfitPhotoRequests = new Map();
export function setupOutfitControls(_0xc32f7) {
  const _0x1cdb23 = extension_settings[extensionName];
  loadOutfitPresetList();
  _0xc32f7.find("#outfit_preset_id").on("change", loadOutfitPreset);
  _0xc32f7.find("#outfit_new").on("click", createNewOutfitPreset);
  _0xc32f7.find("#outfit_update").on("click", updateOutfitPreset);
  _0xc32f7.find("#outfit_save_as").on("click", saveOutfitPresetAs);
  _0xc32f7.find("#outfit_export").on("click", exportOutfitPreset);
  _0xc32f7.find("#outfit_export_all").on("click", exportAllOutfitPresets);
  _0xc32f7.find("#outfit_import").on("click", importOutfitPreset);
  _0xc32f7.find("#outfit_delete").on("click", deleteOutfitPreset);
  _0xc32f7.find("#outfit_visual_select").on("click", handleOutfitVisualSelect);
  _0xc32f7.find("#outfit_translate").on("click", translateOutfitFields);
  _0xc32f7.find("#outfit_photo_prompt_translate").on("click", translateOutfitPhotoPrompt);
  _0xc32f7.find("#outfit_clear_details").on("click", clearOutfitDetailParameters);
  _0xc32f7.find("#outfit_photo_generate").on("click", handleOutfitPhotoGenerate);
  _0xc32f7.find("#outfit_photo_generate_prompt").on("click", handleOutfitPhotoGeneratePrompt);
  _0xc32f7.find("#outfit_photo_modify_prompt").on("click", handleOutfitPhotoModifyPrompt);
  _0xc32f7.find("#outfit_photo_upload").on("click", () => {
    document.getElementById("outfit_photo_upload_input")?.click();
  });
  _0xc32f7.find("#outfit_photo_upload_input").on("change", handleOutfitPhotoUpload);
  _0xc32f7.find("#outfit_send_photo").on("change", function () {
    const _0x737364 = extension_settings[extensionName];
    const _0x1c3ec9 = _0x737364.outfitPresetId;
    if (_0x1c3ec9 && _0x737364.outfitPresets[_0x1c3ec9]) {
      _0x737364.outfitPresets[_0x1c3ec9].sendPhoto = this.checked;
      saveSettingsDebounced();
      console.log("[outfitPreset] 已保存服装发送图片设置:", this.checked);
    }
  });
  bindOutfitFieldListeners();
  loadOutfitPreset();
}
export function loadOutfitPresetList() {
  const _0x96add4 = extension_settings[extensionName];
  const _0x42e200 = document.getElementById("outfit_preset_id");
  if (!_0x42e200) {
    return;
  }
  _0x42e200.innerHTML = "";
  for (const _0x20289b in _0x96add4.outfitPresets) {
    const _0x3b1531 = document.createElement("option");
    _0x3b1531.value = _0x20289b;
    _0x3b1531.textContent = _0x20289b;
    _0x42e200.add(_0x3b1531);
  }
  _0x42e200.value = _0x96add4.outfitPresetId;
}
export function loadOutfitPreset() {
  const _0x398fcb = extension_settings[extensionName];
  const _0x19cde9 = document.getElementById("outfit_preset_id");
  if (!_0x19cde9) {
    return;
  }
  const _0x582080 = _0x19cde9.value;
  const _0x41a151 = _0x398fcb.outfitPresetId;
  if (_0x41a151 && _0x41a151 !== _0x582080) {
    const _0x806fa0 = _0x398fcb.outfitPresets[_0x41a151] || {};
    const _0x31db7d = ["nameCN", "nameEN", "upperBody", "fullBody"];
    let _0x48c08b = false;
    for (const _0x56bebe of _0x31db7d) {
      const _0x232e73 = document.getElementById("outfit_" + _0x56bebe);
      if (_0x232e73 && _0x232e73.value !== (_0x806fa0[_0x56bebe] || "")) {
        _0x48c08b = true;
        break;
      }
    }
    if (_0x48c08b) {
      stylishConfirm("您有未保存的服装数据。要放弃这些更改并切换预设吗？").then(_0x196d65 => {
        if (_0x196d65) {
          _0x398fcb.outfitPresetId = _0x582080;
          loadOutfitPresetData(_0x582080);
          saveSettingsDebounced();
        } else {
          _0x19cde9.value = _0x41a151;
        }
      });
      return;
    }
  }
  _0x398fcb.outfitPresetId = _0x582080;
  loadOutfitPresetData(_0x582080);
  saveSettingsDebounced();
}
export function loadOutfitPresetData(_0xf85eb7) {
  const _0x537294 = extension_settings[extensionName];
  const _0x5b1cba = _0x537294.outfitPresets[_0xf85eb7];
  if (!_0x5b1cba) {
    return;
  }
  const _0x5a30f3 = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  _0x5a30f3.forEach(_0x15db9b => {
    const _0x496ce3 = document.getElementById("outfit_" + _0x15db9b);
    if (_0x496ce3) {
      _0x496ce3.value = _0x5b1cba[_0x15db9b] || "";
      const _0x508279 = _0x496ce3.closest(".st-chatu8-field-col")?.querySelector(".st-chatu8-unsaved-warning");
      if (_0x508279) {
        $(_0x508279).hide();
      }
    }
  });
  const _0x196246 = document.getElementById("outfit_send_photo");
  if (_0x196246) {
    _0x196246.checked = _0x5b1cba.sendPhoto === true;
  }
  loadOutfitPhoto(_0x5b1cba);
}
function updateOutfitPreset() {
  const _0x417c19 = extension_settings[extensionName];
  const _0x4dcf22 = _0x417c19.outfitPresetId;
  if (!_0x4dcf22 || !_0x417c19.outfitPresets[_0x4dcf22]) {
    toastr.warning("没有活动的服装预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  saveCurrentOutfitData(_0x4dcf22);
  toastr.success("服装预设 \"" + _0x4dcf22 + "\" 已保存");
}
function saveOutfitPresetAs() {
  stylInput("请输入新服装预设的名称").then(_0xa1f2c4 => {
    if (_0xa1f2c4 && _0xa1f2c4.trim() !== "") {
      const _0x97d645 = extension_settings[extensionName];
      saveCurrentOutfitData(_0xa1f2c4);
      _0x97d645.outfitPresetId = _0xa1f2c4;
      loadOutfitPresetList();
      alert("服装预设 \"" + _0xa1f2c4 + "\" 已保存。");
    }
  });
}
function createNewOutfitPreset() {
  stylInput("请输入新服装预设的名称").then(_0x27cfd0 => {
    if (_0x27cfd0 && _0x27cfd0.trim() !== "") {
      const _0x1ef3f3 = extension_settings[extensionName];
      if (_0x1ef3f3.outfitPresets[_0x27cfd0]) {
        alert("服装预设 \"" + _0x27cfd0 + "\" 已存在，请使用其他名称。");
        return;
      }
      const _0x58af2f = {
        nameCN: "",
        nameEN: "",
        owner: "",
        upperBody: "",
        upperBodyBack: "",
        fullBody: "",
        fullBodyBack: "",
        photoImageIds: [],
        photoPrompt: "",
        sendPhoto: false
      };
      _0x1ef3f3.outfitPresets[_0x27cfd0] = _0x58af2f;
      _0x1ef3f3.outfitPresetId = _0x27cfd0;
      saveSettingsDebounced();
      loadOutfitPresetList();
      loadOutfitPresetData(_0x27cfd0);
      toastr.success("空白服装预设 \"" + _0x27cfd0 + "\" 已创建。");
    }
  });
}
function saveCurrentOutfitData(_0x2f184b) {
  const _0x55eb3a = extension_settings[extensionName];
  const _0x14dbee = {};
  const _0x35dba7 = ["nameCN", "nameEN", "upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  _0x35dba7.forEach(_0x571020 => {
    const _0x3ff465 = document.getElementById("outfit_" + _0x571020);
    if (_0x3ff465) {
      _0x14dbee[_0x571020] = _0x3ff465.value || "";
    }
  });
  const _0x502602 = document.getElementById("outfit_photo_prompt");
  if (_0x502602) {
    _0x14dbee.photoPrompt = _0x502602.value || "";
  }
  const _0x535155 = document.getElementById("outfit_send_photo");
  if (_0x535155) {
    _0x14dbee.sendPhoto = _0x535155.checked;
  }
  const _0x1d42a8 = _0x55eb3a.outfitPresets[_0x2f184b] || {};
  _0x14dbee.photoImageIds = _0x1d42a8.photoImageIds || [];
  _0x55eb3a.outfitPresets[_0x2f184b] = _0x14dbee;
  saveSettingsDebounced();
}
function deleteOutfitPreset() {
  const _0x13cded = extension_settings[extensionName];
  const _0x267b97 = document.getElementById("outfit_preset_id")?.value;
  if (_0x267b97 === "默认服装") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该服装预设").then(_0x234945 => {
    if (_0x234945) {
      delete _0x13cded.outfitPresets[_0x267b97];
      _0x13cded.outfitPresetId = "默认服装";
      loadOutfitPresetList();
      loadOutfitPreset();
      saveSettingsDebounced();
    }
  });
}
async function exportOutfitPreset() {
  const _0x4fc4df = extension_settings[extensionName];
  const _0x351e00 = _0x4fc4df.outfitPresetId;
  const _0x43164a = _0x4fc4df.outfitPresets[_0x351e00];
  if (!_0x43164a) {
    alert("没有选中的服装预设可导出。");
    return;
  }
  const _0x1b65d8 = {
    [_0x351e00]: _0x43164a
  };
  const _0x5c8dea = {
    outfits: _0x1b65d8
  };
  let _0x3c349d = _0x5c8dea;
  const _0x12c548 = new Set();
  if (_0x43164a.photoImageIds && _0x43164a.photoImageIds.length > 0) {
    _0x43164a.photoImageIds.forEach(_0x158346 => _0x12c548.add(_0x158346));
  }
  if (_0x12c548.size > 0) {
    _0x3c349d.images = {};
    for (const _0x2b5cf9 of _0x12c548) {
      try {
        const _0xac463f = await getConfigImage(_0x2b5cf9);
        if (_0xac463f) {
          _0x3c349d.images[_0x2b5cf9] = _0xac463f;
        }
      } catch (_0x406314) {
        console.error("[OutfitPreset] 获取图片 " + _0x2b5cf9 + " 失败:", _0x406314);
      }
    }
    console.log("[OutfitPreset] 导出 " + Object.keys(_0x3c349d.images).length + " 张图片");
  }
  _0x3c349d = await encryptExportData(_0x3c349d);
  const _0xe9b548 = JSON.stringify(_0x3c349d, null, 2);
  const _0x12722b = new Blob([_0xe9b548], {
    type: "application/json"
  });
  const _0x21f8ea = URL.createObjectURL(_0x12722b);
  const _0x5266a5 = document.createElement("a");
  _0x5266a5.href = _0x21f8ea;
  _0x5266a5.download = "st-chatu8-服装-" + _0x351e00 + ".json";
  document.body.appendChild(_0x5266a5);
  _0x5266a5.click();
  document.body.removeChild(_0x5266a5);
  URL.revokeObjectURL(_0x21f8ea);
}
async function exportAllOutfitPresets() {
  const _0x1e3ec7 = extension_settings[extensionName];
  if (!_0x1e3ec7.outfitPresets || Object.keys(_0x1e3ec7.outfitPresets).length === 0) {
    alert("没有服装预设可导出。");
    return;
  }
  const _0x91bd44 = new Set(Object.keys(_0x1e3ec7.outfitPresets));
  const _0x3ed620 = {};
  for (const _0x5a8864 in _0x1e3ec7.characterPresets) {
    const _0x5476d1 = _0x1e3ec7.characterPresets[_0x5a8864];
    const _0x4541e0 = _0x5476d1.outfits || [];
    const _0x59ec79 = _0x4541e0.some(_0x35a173 => _0x91bd44.has(_0x35a173));
    if (_0x59ec79) {
      _0x3ed620[_0x5a8864] = _0x5476d1;
    }
  }
  const _0xef7ec4 = {
    outfits: _0x1e3ec7.outfitPresets
  };
  let _0xff475b = _0xef7ec4;
  if (Object.keys(_0x3ed620).length > 0) {
    const _0x2e193d = "检测到 " + Object.keys(_0x3ed620).length + " 个角色使用了这些服装:\n" + Object.keys(_0x3ed620).join("\n") + "\n\n是否一起导出相关角色?";
    const _0x573c81 = await stylishConfirm(_0x2e193d);
    if (_0x573c81) {
      _0xff475b.characters = _0x3ed620;
    }
  }
  const _0x436117 = new Set();
  for (const _0x330cb2 in _0x1e3ec7.outfitPresets) {
    const _0x303f22 = _0x1e3ec7.outfitPresets[_0x330cb2];
    if (_0x303f22.photoImageIds && _0x303f22.photoImageIds.length > 0) {
      _0x303f22.photoImageIds.forEach(_0x7f985c => _0x436117.add(_0x7f985c));
    }
  }
  if (_0xff475b.characters) {
    for (const _0x29bcb4 in _0xff475b.characters) {
      const _0x360bca = _0xff475b.characters[_0x29bcb4];
      if (_0x360bca.photoImageIds && _0x360bca.photoImageIds.length > 0) {
        _0x360bca.photoImageIds.forEach(_0x36233e => _0x436117.add(_0x36233e));
      }
    }
  }
  if (_0x436117.size > 0) {
    _0xff475b.images = {};
    for (const _0x1390d1 of _0x436117) {
      try {
        const _0x3f626e = await getConfigImage(_0x1390d1);
        if (_0x3f626e) {
          _0xff475b.images[_0x1390d1] = _0x3f626e;
        }
      } catch (_0x39c805) {
        console.error("[OutfitPreset] 获取图片 " + _0x1390d1 + " 失败:", _0x39c805);
      }
    }
    console.log("[OutfitPreset] 导出全部：共 " + Object.keys(_0xff475b.images).length + " 张图片");
  }
  _0xff475b = await encryptExportData(_0xff475b);
  const _0x12dab4 = JSON.stringify(_0xff475b, null, 2);
  const _0x5746dd = new Blob([_0x12dab4], {
    type: "application/json"
  });
  const _0x1db751 = URL.createObjectURL(_0x5746dd);
  const _0x3354de = document.createElement("a");
  _0x3354de.href = _0x1db751;
  _0x3354de.download = "st-chatu8-服装-全部.json";
  document.body.appendChild(_0x3354de);
  _0x3354de.click();
  document.body.removeChild(_0x3354de);
  URL.revokeObjectURL(_0x1db751);
}
function importOutfitPreset() {
  const _0x5c6e6c = extension_settings[extensionName];
  const _0x2faf66 = document.createElement("input");
  _0x2faf66.type = "file";
  _0x2faf66.accept = ".json";
  _0x2faf66.onchange = async _0x9ecef4 => {
    const _0x318ae7 = _0x9ecef4.target.files[0];
    if (!_0x318ae7) {
      return;
    }
    const _0x136550 = new FileReader();
    _0x136550.onload = async _0x57690a => {
      try {
        let _0x44cb7d = JSON.parse(_0x57690a.target.result);
        _0x44cb7d = decryptImportData(_0x44cb7d);
        let _0x53b4a8 = {};
        let _0xbc2578 = _0x44cb7d.images || {};
        if (_0x44cb7d.outfits) {
          _0x53b4a8 = _0x44cb7d.outfits;
        } else {
          _0x53b4a8 = _0x44cb7d;
        }
        let _0x298147 = 0;
        const _0x4d6bde = {};
        if (Object.keys(_0xbc2578).length > 0) {
          console.log("[OutfitPreset] 正在导入 " + Object.keys(_0xbc2578).length + " 张图片...");
          for (const _0x2e2229 in _0xbc2578) {
            try {
              const _0xb46cc1 = _0xbc2578[_0x2e2229];
              const _0x46b770 = await saveConfigImage(_0xb46cc1);
              _0x4d6bde[_0x2e2229] = _0x46b770;
              _0x298147++;
            } catch (_0x45840d) {
              console.error("[OutfitPreset] 导入图片 " + _0x2e2229 + " 失败:", _0x45840d);
            }
          }
          console.log("[OutfitPreset] 成功导入 " + _0x298147 + " 张图片");
          for (const _0x496c3a in _0x53b4a8) {
            const _0x362eff = _0x53b4a8[_0x496c3a];
            if (_0x362eff.photoImageIds && _0x362eff.photoImageIds.length > 0) {
              _0x362eff.photoImageIds = _0x362eff.photoImageIds.map(_0x31f901 => _0x4d6bde[_0x31f901] || _0x31f901);
            }
          }
        }
        let _0x31b2ae = 0;
        for (const _0x1bee90 in _0x53b4a8) {
          if (_0x53b4a8.hasOwnProperty(_0x1bee90)) {
            if (!_0x5c6e6c.outfitPresets.hasOwnProperty(_0x1bee90)) {
              _0x31b2ae++;
            }
            _0x5c6e6c.outfitPresets[_0x1bee90] = _0x53b4a8[_0x1bee90];
          }
        }
        saveSettingsDebounced();
        loadOutfitPresetList();
        const _0x1ff845 = Object.keys(_0x53b4a8)[0];
        if (_0x1ff845) {
          _0x5c6e6c.outfitPresetId = _0x1ff845;
          const _0x46a9f8 = document.getElementById("outfit_preset_id");
          if (_0x46a9f8) {
            _0x46a9f8.value = _0x1ff845;
          }
          loadOutfitPresetData(_0x1ff845);
        }
        let _0x273dad = "成功导入 " + Object.keys(_0x53b4a8).length + " 个服装预设，其中 " + _0x31b2ae + " 个是全新的。";
        if (_0x298147 > 0) {
          _0x273dad += "\n同时导入 " + _0x298147 + " 张图片。";
        }
        alert(_0x273dad);
      } catch (_0x12a0be) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x12a0be.message);
        console.error("Error importing outfit presets:", _0x12a0be);
      }
    };
    _0x136550.readAsText(_0x318ae7);
  };
  _0x2faf66.click();
}
function handleOutfitVisualSelect() {
  showOutfitVisualSelector(_0x470d98 => {
    const _0x26babc = document.getElementById("outfit_preset_id");
    if (_0x26babc) {
      _0x26babc.value = _0x470d98;
    }
  });
}
function bindOutfitFieldListeners() {
  const _0x49e5c8 = ["nameCN", "nameEN", "upperBody", "fullBody"];
  _0x49e5c8.forEach(_0x48895a => {
    const _0x5714f8 = document.getElementById("outfit_" + _0x48895a);
    if (_0x5714f8) {
      $(_0x5714f8).on("input", function () {
        const _0x5a82c8 = extension_settings[extensionName];
        const _0x526f72 = _0x5a82c8.outfitPresetId;
        const _0xabcc10 = _0x5a82c8.outfitPresets[_0x526f72] || {};
        const _0x2adb07 = $(this).val() !== (_0xabcc10[_0x48895a] || "");
        const _0x39742e = $(this).closest(".st-chatu8-field-col").find(".st-chatu8-unsaved-warning");
        if (_0x2adb07) {
          $(_0x39742e).show();
        } else {
          $(_0x39742e).hide();
        }
      });
    }
  });
}
function cleanTagForTranslation(_0x211957) {
  return _0x211957.replace(/^[\{\[\(\<]+|[\}\]\)\>]+$/g, "").replace(/^\{+|\}+$/g, "").replace(/:[\d.]+$/, "").trim();
}
async function clearOutfitDetailParameters() {
  const _0x3a8918 = await stylishConfirm("确定要清空所有详细参数吗？\n\n这将清空以下字段：\n- 上半身描述（正面/背面）\n- 全身描述（正面/背面）\n\n此操作不会自动保存，您需要手动保存更改。");
  if (!_0x3a8918) {
    return;
  }
  const _0x20ffc2 = ["upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  _0x20ffc2.forEach(_0x2baf4a => {
    const _0xd743f3 = document.getElementById("outfit_" + _0x2baf4a);
    if (_0xd743f3) {
      _0xd743f3.value = "";
      $(_0xd743f3).trigger("input");
    }
  });
  toastr.success("详细参数已清空，请记得保存更改。");
}
async function translateOutfitFields() {
  const _0x681f01 = ["upperBody", "upperBodyBack", "fullBody", "fullBodyBack"];
  const _0x67e197 = [];
  const _0x5defd0 = [];
  const _0x4ee093 = /（[^）]*）/g;
  for (const _0x204e19 of _0x681f01) {
    const _0x396901 = document.getElementById("outfit_" + _0x204e19);
    if (_0x396901 && _0x396901.value && _0x396901.value.trim()) {
      const _0x203e31 = _0x396901.value.replace(_0x4ee093, "").trim();
      const _0x530c21 = {
        field: _0x204e19,
        element: _0x396901,
        originalValue: _0x396901.value,
        cleanedValue: _0x203e31
      };
      _0x67e197.push(_0x530c21);
      const _0x3157c7 = _0x203e31.split(/[,，]/).map(_0x4ad7ad => _0x4ad7ad.trim()).filter(Boolean);
      _0x5defd0.push(..._0x3157c7);
    }
  }
  if (_0x5defd0.length === 0) {
    toastr.info("没有找到需要翻译的内容。");
    return;
  }
  const _0x29ba79 = [...new Set(_0x5defd0)];
  const _0x3d34f1 = _0x29ba79.map(_0x1cfeb9 => cleanTagForTranslation(_0x1cfeb9)).filter(Boolean);
  const _0x25e56d = [...new Set(_0x3d34f1)];
  toastr.info("正在翻译服装描述...", "请稍候", {
    timeOut: 0,
    extendedTimeOut: 0
  });
  try {
    const _0x5477ec = _0x25e56d.join(", ");
    const _0x5b250c = await translatePromptTags(_0x5477ec);
    if (_0x5b250c && _0x5b250c.results) {
      const _0x1e2f26 = {};
      for (const _0x2d2bb0 of _0x5b250c.results) {
        if (_0x2d2bb0.original && _0x2d2bb0.translation) {
          _0x1e2f26[_0x2d2bb0.original.toLowerCase()] = _0x2d2bb0.translation;
        }
      }
      let _0x51102b = 0;
      for (const {
        field: _0x23a05d,
        element: _0x3c22b2,
        cleanedValue: _0x49c662
      } of _0x67e197) {
        const _0x505fdf = _0x49c662.split(/[,，]/).map(_0x34abe3 => _0x34abe3.trim()).filter(Boolean);
        const _0x338f15 = _0x505fdf.map(_0x18c233 => {
          const _0x16cf47 = cleanTagForTranslation(_0x18c233);
          const _0x11d756 = _0x1e2f26[_0x16cf47.toLowerCase()];
          if (_0x11d756) {
            return _0x18c233 + "（" + _0x11d756 + "）";
          }
          return _0x18c233;
        });
        _0x3c22b2.value = _0x338f15.join(", ");
        _0x51102b++;
        $(_0x3c22b2).trigger("input");
      }
      toastr.clear();
      toastr.success("已翻译 " + _0x51102b + " 个字段。");
    } else {
      toastr.clear();
      toastr.info("翻译结果为空。");
    }
  } catch (_0x4cb4df) {
    console.error("翻译失败:", _0x4cb4df);
    toastr.clear();
    toastr.error("翻译失败，请检查 LLM 设置。");
  }
}
async function loadOutfitPhoto(_0x5abda7) {
  const _0x5aa23e = document.getElementById("outfit_photo_preview");
  const _0x2249b6 = document.getElementById("outfit_photo_placeholder");
  const _0x536df2 = document.getElementById("outfit_photo_prompt");
  if (_0x536df2) {
    _0x536df2.value = _0x5abda7.photoPrompt || "";
  }
  if (_0x5abda7.photoImageId && (!_0x5abda7.photoImageIds || _0x5abda7.photoImageIds.length === 0)) {
    _0x5abda7.photoImageIds = [_0x5abda7.photoImageId];
    delete _0x5abda7.photoImageId;
    saveSettingsDebounced();
  }
  const _0x143313 = _0x5abda7.photoImageIds || [];
  let _0x195faa = _0x5abda7.selectedPhotoIndex || 0;
  if (_0x195faa < 0 || _0x195faa >= _0x143313.length) {
    _0x195faa = _0x143313.length > 0 ? _0x143313.length - 1 : 0;
  }
  if (_0x143313.length > 0) {
    const _0x400952 = _0x143313[_0x195faa];
    try {
      const _0x47f2c4 = await getConfigImage(_0x400952);
      if (_0x47f2c4 && _0x5aa23e && _0x2249b6) {
        _0x5aa23e.src = _0x47f2c4;
        _0x5aa23e.style.display = "block";
        _0x2249b6.style.display = "none";
        _0x5aa23e.style.cursor = "pointer";
        _0x5aa23e.onclick = () => showOutfitImageViewer(_0x143313, _0x195faa);
        return;
      }
    } catch (_0x229ee6) {
      console.error("[OutfitPreset] 加载服装照片失败:", _0x229ee6);
    }
  }
  if (_0x5aa23e && _0x2249b6) {
    _0x5aa23e.src = "";
    _0x5aa23e.style.display = "none";
    _0x2249b6.style.display = "flex";
    _0x5aa23e.onclick = null;
    _0x5aa23e.style.cursor = "default";
  }
}
async function handleOutfitPhotoGenerate() {
  const _0x4da096 = extension_settings[extensionName];
  const _0x315390 = _0x4da096.outfitPresetId;
  const _0x3c57a5 = _0x4da096.outfitPresets[_0x315390];
  if (!_0x3c57a5) {
    toastr.warning("请先选择一个服装预设");
    return;
  }
  const _0x47b6d9 = document.getElementById("outfit_photo_prompt");
  const _0x4f3439 = _0x47b6d9?.value?.trim() || "";
  if (!_0x4f3439) {
    toastr.warning("请先输入图片生成提示词");
    return;
  }
  const _0x3f8a6d = "outfit_photo_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  toastr.info("正在生成服装图片...", "请稍候", {
    timeOut: 0,
    extendedTimeOut: 0
  });
  const _0x3c0c7a = async _0x1fe5b6 => {
    if (_0x1fe5b6.id !== _0x3f8a6d) {
      return;
    }
    const _0xdec2c7 = activeOutfitPhotoRequests.get(_0x3f8a6d);
    if (_0xdec2c7) {
      eventSource.removeListener(EventType.GENERATE_IMAGE_RESPONSE, _0xdec2c7.listener);
      activeOutfitPhotoRequests.delete(_0x3f8a6d);
    }
    toastr.clear();
    if (_0x1fe5b6.success && _0x1fe5b6.imageData) {
      try {
        const _0x5a3152 = await saveConfigImage(_0x1fe5b6.imageData);
        if (!_0x3c57a5.photoImageIds) {
          _0x3c57a5.photoImageIds = [];
        }
        _0x3c57a5.photoImageIds.push(_0x5a3152);
        saveSettingsDebounced();
        const _0x5ad28c = document.getElementById("outfit_photo_preview");
        const _0x23f7aa = document.getElementById("outfit_photo_placeholder");
        if (_0x5ad28c && _0x23f7aa) {
          _0x5ad28c.src = _0x1fe5b6.imageData;
          _0x5ad28c.style.display = "block";
          _0x23f7aa.style.display = "none";
          _0x5ad28c.style.cursor = "pointer";
          _0x5ad28c.onclick = () => showOutfitImageViewer(_0x3c57a5.photoImageIds, _0x3c57a5.photoImageIds.length - 1);
        }
        toastr.success("服装图片生成成功");
      } catch (_0x131d08) {
        console.error("[OutfitPreset] 保存图片失败:", _0x131d08);
        toastr.error("保存图片失败: " + _0x131d08.message);
      }
    } else {
      toastr.error("图片生成失败: " + (_0x1fe5b6.error || "未知错误"));
    }
  };
  activeOutfitPhotoRequests.set(_0x3f8a6d, {
    listener: _0x3c0c7a,
    timestamp: Date.now()
  });
  eventSource.on(EventType.GENERATE_IMAGE_RESPONSE, _0x3c0c7a);
  const _0x5ba601 = {
    id: _0x3f8a6d,
    prompt: _0x4f3439
  };
  eventSource.emit(EventType.GENERATE_IMAGE_REQUEST, _0x5ba601);
}
function handleOutfitPhotoGeneratePrompt() {
  handleOutfitPhotoGeneratePromptClick();
}
async function handleOutfitPhotoUpload(_0x3e4bba) {
  const _0x2e2a57 = _0x3e4bba.target;
  if (!_0x2e2a57.files || !_0x2e2a57.files[0]) {
    return;
  }
  const _0x17cdb4 = extension_settings[extensionName];
  const _0x276cfd = _0x17cdb4.outfitPresetId;
  const _0x200305 = _0x17cdb4.outfitPresets[_0x276cfd];
  if (!_0x200305) {
    toastr.warning("请先选择一个服装预设");
    _0x2e2a57.value = "";
    return;
  }
  const _0x7202b9 = _0x2e2a57.files[0];
  if (!_0x7202b9.type.startsWith("image/")) {
    toastr.warning("请选择图片文件");
    _0x2e2a57.value = "";
    return;
  }
  const _0x35fad4 = new FileReader();
  _0x35fad4.onload = async _0x4dcd38 => {
    try {
      const _0x42cbae = _0x4dcd38.target.result;
      const _0x3c901a = await saveConfigImage(_0x42cbae);
      if (!_0x200305.photoImageIds) {
        _0x200305.photoImageIds = [];
      }
      _0x200305.photoImageIds.push(_0x3c901a);
      saveSettingsDebounced();
      const _0x5b1cd1 = document.getElementById("outfit_photo_preview");
      const _0x1942fd = document.getElementById("outfit_photo_placeholder");
      if (_0x5b1cd1 && _0x1942fd) {
        _0x5b1cd1.src = _0x42cbae;
        _0x5b1cd1.style.display = "block";
        _0x1942fd.style.display = "none";
        _0x5b1cd1.style.cursor = "pointer";
        _0x5b1cd1.onclick = () => showOutfitImageViewer(_0x200305.photoImageIds, _0x200305.photoImageIds.length - 1);
      }
      toastr.success("服装照片上传成功");
    } catch (_0xec4f54) {
      console.error("[OutfitPreset] 上传照片失败:", _0xec4f54);
      toastr.error("上传照片失败: " + _0xec4f54.message);
    }
  };
  _0x35fad4.onerror = () => {
    toastr.error("读取文件失败");
  };
  _0x35fad4.readAsDataURL(_0x7202b9);
  _0x2e2a57.value = "";
}
function readFileAsBase64ForPopup(_0x5dfbef) {
  return new Promise((_0x419378, _0x1ad66c) => {
    const _0x31ba0d = new FileReader();
    _0x31ba0d.onload = () => _0x419378(_0x31ba0d.result);
    _0x31ba0d.onerror = _0x1ad66c;
    _0x31ba0d.readAsDataURL(_0x5dfbef);
  });
}
function handleOutfitPhotoModifyPrompt() {
  const _0x4b5e14 = [];
  const _0x4f0914 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x6bb8da = document.createElement("div");
  _0x6bb8da.className = "st-chatu8-confirm-backdrop";
  const _0x3ca74c = document.createElement("div");
  _0x3ca74c.className = "st-chatu8-confirm-box st-chatu8-popup-modal";
  const _0x3b7bd9 = document.createElement("h3");
  _0x3b7bd9.className = "st-chatu8-popup-title";
  _0x3b7bd9.textContent = "修改服装提示词";
  _0x3ca74c.appendChild(_0x3b7bd9);
  const _0x2e33c0 = document.createElement("p");
  _0x2e33c0.className = "st-chatu8-popup-description";
  _0x2e33c0.textContent = "请输入您的修改需求，AI 将根据需求调整服装提示词：";
  _0x3ca74c.appendChild(_0x2e33c0);
  const _0x355a31 = document.createElement("textarea");
  _0x355a31.className = "st-chatu8-textarea";
  _0x355a31.rows = 4;
  _0x355a31.placeholder = "例如：增加更多细节描述、调整颜色描述、添加配饰细节...";
  _0x3ca74c.appendChild(_0x355a31);
  const _0x48db43 = document.createElement("div");
  _0x48db43.className = "st-chatu8-popup-upload-section";
  const _0x4d3ea1 = document.createElement("div");
  _0x4d3ea1.className = "st-chatu8-popup-upload-header";
  const _0x5ecba9 = document.createElement("span");
  _0x5ecba9.className = "st-chatu8-popup-upload-label";
  _0x5ecba9.textContent = "📎 参考图片（可选）";
  const _0x4af8b7 = document.createElement("input");
  _0x4af8b7.type = "file";
  _0x4af8b7.accept = "image/*";
  _0x4af8b7.multiple = true;
  _0x4af8b7.style.display = "none";
  const _0x52557a = document.createElement("button");
  _0x52557a.type = "button";
  _0x52557a.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加图片";
  _0x52557a.className = "st-chatu8-btn st-chatu8-popup-upload-btn";
  _0x52557a.addEventListener("click", () => _0x4af8b7.click());
  _0x4d3ea1.appendChild(_0x5ecba9);
  _0x4d3ea1.appendChild(_0x52557a);
  const _0x5d9e7e = document.createElement("div");
  _0x5d9e7e.className = "st-chatu8-popup-image-preview";
  const _0x12a703 = document.createElement("div");
  _0x12a703.className = "st-chatu8-popup-empty-hint";
  _0x12a703.textContent = "点击上方按钮添加参考图片";
  _0x5d9e7e.appendChild(_0x12a703);
  function _0x4397eb() {
    _0x5d9e7e.innerHTML = "";
    if (_0x4b5e14.length === 0) {
      const _0x38a624 = document.createElement("div");
      _0x38a624.className = "st-chatu8-popup-empty-hint";
      _0x38a624.textContent = "点击上方按钮添加参考图片";
      _0x5d9e7e.appendChild(_0x38a624);
      return;
    }
    _0x4b5e14.forEach((_0x2ecd1e, _0xb85835) => {
      const _0x5810f2 = document.createElement("div");
      _0x5810f2.className = "st-chatu8-popup-image-item";
      const _0x56298b = document.createElement("div");
      _0x56298b.className = "st-chatu8-popup-image-wrapper";
      const _0x36f112 = document.createElement("img");
      _0x36f112.src = _0x2ecd1e.base64;
      const _0x16a6b3 = document.createElement("button");
      _0x16a6b3.type = "button";
      _0x16a6b3.className = "st-chatu8-popup-image-delete";
      _0x16a6b3.innerHTML = "×";
      _0x16a6b3.addEventListener("click", _0xfef62 => {
        _0xfef62.stopPropagation();
        _0x4b5e14.splice(_0xb85835, 1);
        _0x4397eb();
      });
      _0x56298b.addEventListener("mouseenter", () => {
        _0x16a6b3.style.opacity = "1";
      });
      _0x56298b.addEventListener("mouseleave", () => {
        _0x16a6b3.style.opacity = "0";
      });
      _0x56298b.appendChild(_0x36f112);
      _0x56298b.appendChild(_0x16a6b3);
      const _0x59be11 = document.createElement("input");
      _0x59be11.type = "text";
      _0x59be11.className = "st-chatu8-popup-image-name";
      _0x59be11.placeholder = "图" + (_0xb85835 + 1);
      _0x59be11.value = _0x2ecd1e.name || "";
      _0x59be11.addEventListener("input", _0x3db772 => {
        _0x4b5e14[_0xb85835].name = _0x3db772.target.value;
      });
      _0x5810f2.appendChild(_0x56298b);
      _0x5810f2.appendChild(_0x59be11);
      _0x5d9e7e.appendChild(_0x5810f2);
    });
    const _0x3b1c67 = document.createElement("div");
    _0x3b1c67.className = "st-chatu8-popup-image-count";
    _0x3b1c67.textContent = "已添加 " + _0x4b5e14.length + " 张图片";
    _0x5d9e7e.appendChild(_0x3b1c67);
  }
  _0x4af8b7.addEventListener("change", async _0x591447 => {
    const _0x5f008b = _0x591447.target.files;
    if (!_0x5f008b || _0x5f008b.length === 0) {
      return;
    }
    for (const _0x2438f9 of _0x5f008b) {
      if (!_0x2438f9.type.startsWith("image/")) {
        continue;
      }
      try {
        const _0x27c6be = await readFileAsBase64ForPopup(_0x2438f9);
        const _0xac9a8d = {
          base64: _0x27c6be,
          name: ""
        };
        _0x4b5e14.push(_0xac9a8d);
      } catch (_0x451a1b) {
        console.error("[outfitPreset] Failed to read image:", _0x451a1b);
      }
    }
    _0x4397eb();
    _0x4af8b7.value = "";
  });
  _0x48db43.appendChild(_0x4d3ea1);
  _0x48db43.appendChild(_0x4af8b7);
  _0x48db43.appendChild(_0x5d9e7e);
  _0x3ca74c.appendChild(_0x48db43);
  const _0x24f159 = document.createElement("div");
  _0x24f159.className = "st-chatu8-confirm-buttons";
  const _0x1008b0 = document.createElement("button");
  _0x1008b0.textContent = "取消";
  _0x1008b0.className = "st-chatu8-btn";
  _0x24f159.appendChild(_0x1008b0);
  const _0x45a256 = document.createElement("button");
  _0x45a256.innerHTML = "<i class=\"fa-solid fa-check\"></i> 确认";
  _0x45a256.className = "st-chatu8-btn st-chatu8-btn-primary";
  _0x24f159.appendChild(_0x45a256);
  _0x3ca74c.appendChild(_0x24f159);
  _0x6bb8da.appendChild(_0x3ca74c);
  _0x4f0914.appendChild(_0x6bb8da);
  setTimeout(() => _0x355a31.focus(), 100);
  const _0x28d829 = () => {
    _0x4f0914.removeChild(_0x6bb8da);
  };
  _0x1008b0.addEventListener("click", _0x28d829);
  _0x45a256.addEventListener("click", () => {
    const _0x2bfbcd = _0x355a31.value.trim();
    _0x28d829();
    handleOutfitPromptModify(_0x2bfbcd, [..._0x4b5e14]);
  });
}
async function translateOutfitPhotoPrompt() {
  const _0x5dd853 = document.getElementById("outfit_photo_prompt");
  if (!_0x5dd853 || !_0x5dd853.value || !_0x5dd853.value.trim()) {
    toastr.info("没有找到需要翻译的提示词内容。");
    return;
  }
  const _0x1f5ed4 = /（[^）]*）/g;
  const _0x1a4b40 = _0x5dd853.value;
  const _0x102664 = _0x1a4b40.replace(_0x1f5ed4, "").trim();
  const _0x248d82 = _0x102664.split(/[,，]/).map(_0x18ebf6 => _0x18ebf6.trim()).filter(Boolean);
  if (_0x248d82.length === 0) {
    toastr.info("没有找到需要翻译的内容。");
    return;
  }
  const _0x4b14ab = [...new Set(_0x248d82)];
  toastr.info("正在翻译提示词...", "请稍候", {
    timeOut: 0,
    extendedTimeOut: 0
  });
  try {
    const _0x490ad9 = _0x4b14ab.join(", ");
    const _0x42f379 = await translatePromptTags(_0x490ad9);
    if (_0x42f379 && _0x42f379.results) {
      const _0x3f9be4 = {};
      for (const _0xf5d0e2 of _0x42f379.results) {
        if (_0xf5d0e2.original && _0xf5d0e2.translation) {
          _0x3f9be4[_0xf5d0e2.original.toLowerCase()] = _0xf5d0e2.original + "（" + _0xf5d0e2.translation + "）";
        } else if (_0xf5d0e2.original) {
          _0x3f9be4[_0xf5d0e2.original.toLowerCase()] = _0xf5d0e2.original;
        }
      }
      const _0x45586b = _0x248d82.map(_0x215750 => {
        return _0x3f9be4[_0x215750.toLowerCase()] || _0x215750;
      });
      _0x5dd853.value = _0x45586b.join(", ");
      $(_0x5dd853).trigger("input");
      toastr.clear();
      toastr.success("提示词翻译完成。");
    } else {
      toastr.clear();
      toastr.info("翻译结果为空。");
    }
  } catch (_0x2300f4) {
    console.error("翻译失败:", _0x2300f4);
    toastr.clear();
    toastr.error("翻译失败，请检查 LLM 设置。");
  }
}
async function showOutfitImageViewer(_0x40a2b9, _0x560dfc) {
  const _0x2ce3df = extension_settings[extensionName];
  const _0x2b6c0f = _0x2ce3df.outfitPresetId;
  const _0x51ffc9 = _0x2ce3df.outfitPresets[_0x2b6c0f];
  if (!_0x40a2b9 || _0x40a2b9.length === 0) {
    toastr.warning("没有可显示的图片");
    return;
  }
  let _0x25c81f = Math.max(0, Math.min(_0x560dfc, _0x40a2b9.length - 1));
  const _0x213623 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x26c81a = document.createElement("div");
  _0x26c81a.className = "st-chatu8-confirm-backdrop";
  _0x26c81a.style.cssText = "\n        z-index: 10002;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 20px;\n        box-sizing: border-box;\n    ";
  const _0x510296 = document.createElement("div");
  _0x510296.style.cssText = "\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        max-width: 95vw;\n        max-height: 95vh;\n        background: var(--SmartThemeBlurTintColor, rgba(0, 0, 0, 0.8));\n        border-radius: 12px;\n        padding: 20px;\n        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n    ";
  const _0x16f751 = document.createElement("div");
  _0x16f751.style.cssText = "\n        display: flex;\n        align-items: center;\n        gap: 15px;\n        position: relative;\n    ";
  const _0x1c52e7 = document.createElement("button");
  _0x1c52e7.innerHTML = "<i class=\"fa-solid fa-chevron-left\"></i>";
  _0x1c52e7.className = "st-chatu8-btn";
  _0x1c52e7.style.cssText = "\n        width: 50px;\n        height: 50px;\n        border-radius: 50%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 20px;\n        background: rgba(255, 255, 255, 0.1);\n        transition: all 0.2s ease;\n    ";
  _0x16f751.appendChild(_0x1c52e7);
  const _0x454f4c = document.createElement("img");
  _0x454f4c.style.cssText = "\n        max-width: calc(95vw - 180px);\n        max-height: calc(95vh - 160px);\n        object-fit: contain;\n        border-radius: 8px;\n        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);\n    ";
  _0x16f751.appendChild(_0x454f4c);
  const _0x13eb73 = document.createElement("button");
  _0x13eb73.innerHTML = "<i class=\"fa-solid fa-chevron-right\"></i>";
  _0x13eb73.className = "st-chatu8-btn";
  _0x13eb73.style.cssText = "\n        width: 50px;\n        height: 50px;\n        border-radius: 50%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 20px;\n        background: rgba(255, 255, 255, 0.1);\n        transition: all 0.2s ease;\n    ";
  _0x16f751.appendChild(_0x13eb73);
  _0x510296.appendChild(_0x16f751);
  const _0x40754c = document.createElement("div");
  _0x40754c.style.cssText = "\n        margin-top: 12px;\n        font-size: 14px;\n        color: var(--SmartThemeBodyColor, #ccc);\n        opacity: 0.8;\n    ";
  _0x510296.appendChild(_0x40754c);
  const _0x1f89c6 = document.createElement("div");
  _0x1f89c6.style.cssText = "\n        display: flex;\n        gap: 15px;\n        margin-top: 20px;\n        justify-content: center;\n    ";
  const _0x3e020d = document.createElement("button");
  _0x3e020d.innerHTML = "<i class=\"fa-solid fa-download\"></i> 下载图片";
  _0x3e020d.className = "st-chatu8-btn";
  _0x3e020d.style.cssText = "\n        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x1f89c6.appendChild(_0x3e020d);
  const _0x52ffcf = document.createElement("button");
  _0x52ffcf.innerHTML = "<i class=\"fa-solid fa-trash\"></i> 删除图片";
  _0x52ffcf.className = "st-chatu8-btn";
  _0x52ffcf.style.cssText = "\n        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x1f89c6.appendChild(_0x52ffcf);
  const _0x1583f3 = document.createElement("button");
  _0x1583f3.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i> 删除其他";
  _0x1583f3.className = "st-chatu8-btn";
  _0x1583f3.style.cssText = "\n        background: linear-gradient(135deg, #fd7e14 0%, #e65c00 100%);\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x1f89c6.appendChild(_0x1583f3);
  const _0x3c9057 = document.createElement("button");
  _0x3c9057.innerHTML = "<i class=\"fa-solid fa-xmark\"></i> 关闭";
  _0x3c9057.className = "st-chatu8-btn";
  _0x3c9057.style.cssText = "\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x1f89c6.appendChild(_0x3c9057);
  _0x510296.appendChild(_0x1f89c6);
  _0x26c81a.appendChild(_0x510296);
  _0x213623.appendChild(_0x26c81a);
  const _0x3a25bc = {};
  const _0x41798a = async _0x304477 => {
    if (_0x304477 < 0 || _0x304477 >= _0x40a2b9.length) {
      return;
    }
    _0x25c81f = _0x304477;
    const _0x486c4e = _0x40a2b9[_0x25c81f];
    _0x40754c.textContent = _0x25c81f + 1 + " / " + _0x40a2b9.length;
    _0x1c52e7.style.opacity = _0x25c81f === 0 ? "0.3" : "1";
    _0x1c52e7.style.pointerEvents = _0x25c81f === 0 ? "none" : "auto";
    _0x13eb73.style.opacity = _0x25c81f === _0x40a2b9.length - 1 ? "0.3" : "1";
    _0x13eb73.style.pointerEvents = _0x25c81f === _0x40a2b9.length - 1 ? "none" : "auto";
    try {
      let _0x30d909 = _0x3a25bc[_0x486c4e];
      if (!_0x30d909) {
        _0x30d909 = await getConfigImage(_0x486c4e);
        if (_0x30d909) {
          _0x3a25bc[_0x486c4e] = _0x30d909;
        }
      }
      if (_0x30d909) {
        _0x454f4c.src = _0x30d909;
      } else {
        _0x454f4c.src = "";
        toastr.warning("图片加载失败");
      }
    } catch (_0x490174) {
      console.error("[OutfitPreset] 加载图片失败:", _0x490174);
      _0x454f4c.src = "";
    }
  };
  const _0x13f563 = async () => {
    document.removeEventListener("keydown", _0x88490c);
    if (_0x51ffc9) {
      _0x51ffc9.selectedPhotoIndex = _0x25c81f;
      saveSettingsDebounced();
      const _0x549d1a = document.getElementById("outfit_photo_preview");
      const _0x1e6a0f = document.getElementById("outfit_photo_placeholder");
      if (_0x40a2b9.length > 0 && _0x25c81f >= 0 && _0x25c81f < _0x40a2b9.length) {
        try {
          const _0x4a9002 = _0x40a2b9[_0x25c81f];
          const _0xd5b197 = _0x3a25bc[_0x4a9002] || (await getConfigImage(_0x4a9002));
          if (_0xd5b197 && _0x549d1a && _0x1e6a0f) {
            _0x549d1a.src = _0xd5b197;
            _0x549d1a.style.display = "block";
            _0x1e6a0f.style.display = "none";
            _0x549d1a.style.cursor = "pointer";
            _0x549d1a.onclick = () => showOutfitImageViewer(_0x40a2b9, _0x25c81f);
          }
        } catch (_0x317ab) {
          console.error("[OutfitPreset] 更新预览图失败:", _0x317ab);
        }
      }
    }
    _0x213623.removeChild(_0x26c81a);
  };
  const _0x88490c = _0xb6f6c => {
    if (_0xb6f6c.key === "ArrowLeft" && _0x25c81f > 0) {
      _0x41798a(_0x25c81f - 1);
    } else if (_0xb6f6c.key === "ArrowRight" && _0x25c81f < _0x40a2b9.length - 1) {
      _0x41798a(_0x25c81f + 1);
    } else if (_0xb6f6c.key === "Escape") {
      _0x13f563();
    }
  };
  _0x1c52e7.addEventListener("click", () => {
    if (_0x25c81f > 0) {
      _0x41798a(_0x25c81f - 1);
    }
  });
  _0x13eb73.addEventListener("click", () => {
    if (_0x25c81f < _0x40a2b9.length - 1) {
      _0x41798a(_0x25c81f + 1);
    }
  });
  _0x3c9057.addEventListener("click", _0x13f563);
  document.addEventListener("keydown", _0x88490c);
  _0x3e020d.addEventListener("click", () => {
    try {
      const _0x59df62 = _0x3a25bc[_0x40a2b9[_0x25c81f]];
      if (!_0x59df62) {
        toastr.warning("图片未加载完成");
        return;
      }
      const _0x3d9551 = document.createElement("a");
      _0x3d9551.href = _0x59df62;
      const _0x481774 = _0x51ffc9?.nameCN || _0x51ffc9?.nameEN || _0x2b6c0f || "outfit";
      const _0x40fdb8 = new Date().toISOString().slice(0, 10);
      _0x3d9551.download = _0x481774 + "_" + (_0x25c81f + 1) + "_" + _0x40fdb8 + ".png";
      document.body.appendChild(_0x3d9551);
      _0x3d9551.click();
      document.body.removeChild(_0x3d9551);
      toastr.success("图片下载成功");
    } catch (_0x1cd4b3) {
      console.error("[OutfitPreset] 下载图片失败:", _0x1cd4b3);
      toastr.error("下载图片失败: " + _0x1cd4b3.message);
    }
  });
  _0x52ffcf.addEventListener("click", async () => {
    const _0x3c4c49 = await stylishConfirm("确定要删除这张服装图片吗？此操作不可撤销。");
    if (_0x3c4c49) {
      try {
        const _0x4f0cf3 = _0x40a2b9[_0x25c81f];
        if (_0x4f0cf3) {
          await deleteConfigImage(_0x4f0cf3);
        }
        if (_0x51ffc9 && _0x51ffc9.photoImageIds) {
          const _0xf2fdda = _0x51ffc9.photoImageIds.indexOf(_0x4f0cf3);
          if (_0xf2fdda > -1) {
            _0x51ffc9.photoImageIds.splice(_0xf2fdda, 1);
            saveSettingsDebounced();
          }
        }
        _0x40a2b9.splice(_0x25c81f, 1);
        if (_0x40a2b9.length > 0) {
          if (_0x25c81f >= _0x40a2b9.length) {
            _0x25c81f = _0x40a2b9.length - 1;
          }
          _0x41798a(_0x25c81f);
          toastr.success("图片已删除");
        } else {
          _0x13f563();
          toastr.success("图片已删除");
          const _0xb0301f = document.getElementById("outfit_photo_preview");
          const _0x5b0117 = document.getElementById("outfit_photo_placeholder");
          if (_0xb0301f && _0x5b0117) {
            _0xb0301f.src = "";
            _0xb0301f.style.display = "none";
            _0xb0301f.onclick = null;
            _0xb0301f.style.cursor = "default";
            _0x5b0117.style.display = "flex";
          }
        }
        delete _0x3a25bc[_0x4f0cf3];
      } catch (_0xf3262d) {
        console.error("[OutfitPreset] 删除图片失败:", _0xf3262d);
        toastr.error("删除图片失败: " + _0xf3262d.message);
      }
    }
  });
  _0x1583f3.addEventListener("click", async () => {
    if (_0x40a2b9.length <= 1) {
      toastr.info("没有其他图片可删除");
      return;
    }
    const _0xd767e = await stylishConfirm("确定要删除当前图片之外的 " + (_0x40a2b9.length - 1) + " 张图片吗？此操作不可撤销。");
    if (_0xd767e) {
      try {
        const _0x4e0a7a = _0x40a2b9[_0x25c81f];
        const _0x59845d = _0x40a2b9.filter((_0x4187d1, _0x58f29c) => _0x58f29c !== _0x25c81f);
        for (const _0x19e918 of _0x59845d) {
          if (_0x19e918) {
            await deleteConfigImage(_0x19e918);
            delete _0x3a25bc[_0x19e918];
          }
        }
        if (_0x51ffc9 && _0x51ffc9.photoImageIds) {
          _0x51ffc9.photoImageIds = [_0x4e0a7a];
          saveSettingsDebounced();
        }
        _0x40a2b9.length = 0;
        _0x40a2b9.push(_0x4e0a7a);
        _0x25c81f = 0;
        _0x41798a(0);
        toastr.success("已删除 " + _0x59845d.length + " 张其他图片");
      } catch (_0xe8a1b8) {
        console.error("[OutfitPreset] 删除其他图片失败:", _0xe8a1b8);
        toastr.error("删除其他图片失败: " + _0xe8a1b8.message);
      }
    }
  });
  await _0x41798a(_0x25c81f);
}