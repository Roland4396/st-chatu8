import { extension_settings } from "../../../../../../extensions.js";
import { saveSettingsDebounced, eventSource } from "../../../../../../../script.js";
import { extensionName, EventType } from "../../config.js";
import { stylInput, stylishConfirm } from "../../ui_common.js";
import { encryptExportData, decryptImportData } from "./crypto.js";
import { loadOutfitPresetList } from "./outfitPreset.js";
import { getConfigImage, saveConfigImage, deleteConfigImage } from "../../configDatabase.js";
import { handleCharacterPromptModify } from "../../characterPromptModify.js";
import { handlePhotoGeneratePromptClick } from "../../imagePromptGen.js";
import { translatePromptTags } from "../../ai.js";
import { showCharacterVisualSelector } from "./characterVisualSelector.js";
const activePhotoRequests = new Map();
const CHARACTER_FIELDS = ["nameCN", "nameEN", "characterTraits", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack", "negative"];
export function setupCharacterControls(_0x330f07) {
  const _0x537bfb = extension_settings[extensionName];
  loadCharacterPresetList();
  _0x330f07.find("#character_preset_id").on("change", loadCharacterPreset);
  _0x330f07.find("#character_new").on("click", createNewCharacterPreset);
  _0x330f07.find("#character_update").on("click", updateCharacterPreset);
  _0x330f07.find("#character_save_as").on("click", saveCharacterPresetAs);
  _0x330f07.find("#character_export").on("click", exportCharacterPreset);
  _0x330f07.find("#character_export_all").on("click", exportAllCharacterPresets);
  _0x330f07.find("#character_import").on("click", importCharacterPreset);
  _0x330f07.find("#character_delete").on("click", deleteCharacterPreset);
  _0x330f07.find("#character_visual_select").on("click", handleCharacterVisualSelect);
  _0x330f07.find("#char_outfit_check").on("click", checkCharacterOutfitList);
  _0x330f07.find("#char_outfit_add").on("click", addOutfitFromSelector);
  _0x330f07.find("#char_outfit_refresh").on("click", loadCharacterOutfitSelector);
  _0x330f07.find("#char_translate").on("click", translateCharacterFields);
  _0x330f07.find("#char_photo_prompt_translate").on("click", translatePhotoPrompt);
  _0x330f07.find("#char_clear_details").on("click", clearCharacterDetailParameters);
  _0x330f07.find("#char_photo_generate").on("click", handlePhotoGenerate);
  _0x330f07.find("#char_photo_generate_prompt").on("click", handlePhotoGeneratePrompt);
  _0x330f07.find("#char_photo_modify_character_prompt").on("click", handlePhotoModifyCharacterPrompt);
  _0x330f07.find("#char_photo_character_data").on("click", handleCharacterData);
  _0x330f07.find("#char_photo_upload").on("click", () => {
    document.getElementById("char_photo_upload_input")?.click();
  });
  _0x330f07.find("#char_photo_upload_input").on("change", handleCharacterPhotoUpload);
  _0x330f07.find("#char_send_photo").on("change", function () {
    const _0x2403ab = extension_settings[extensionName];
    const _0x44fc59 = _0x2403ab.characterPresetId;
    if (_0x44fc59 && _0x2403ab.characterPresets[_0x44fc59]) {
      _0x2403ab.characterPresets[_0x44fc59].sendPhoto = this.checked;
      saveSettingsDebounced();
      console.log("[characterPreset] 已保存角色发送图片设置:", this.checked);
    }
  });
  bindCharacterFieldListeners();
  loadCharacterPreset();
}
export function loadCharacterPresetList() {
  const _0x9da274 = extension_settings[extensionName];
  const _0x20f9bd = document.getElementById("character_preset_id");
  if (!_0x20f9bd) {
    return;
  }
  _0x20f9bd.innerHTML = "";
  const _0x2c533c = {
    sensitivity: "base"
  };
  const _0x3a7356 = Object.keys(_0x9da274.characterPresets).sort((_0x1e13ae, _0x3ece88) => _0x1e13ae.localeCompare(_0x3ece88, "zh-CN", _0x2c533c));
  for (const _0x1cc281 of _0x3a7356) {
    const _0x2094ba = document.createElement("option");
    _0x2094ba.value = _0x1cc281;
    _0x2094ba.textContent = _0x1cc281;
    _0x20f9bd.add(_0x2094ba);
  }
  _0x20f9bd.value = _0x9da274.characterPresetId;
}
export function loadCharacterPreset() {
  const _0x35c000 = extension_settings[extensionName];
  const _0x55be6b = document.getElementById("character_preset_id");
  if (!_0x55be6b) {
    return;
  }
  const _0x3abe6d = _0x55be6b.value;
  const _0xcc4789 = _0x35c000.characterPresetId;
  if (_0xcc4789 && _0xcc4789 !== _0x3abe6d) {
    const _0x194a5c = _0x35c000.characterPresets[_0xcc4789] || {};
    let _0xd5c955 = false;
    for (const _0x2ed9e7 of CHARACTER_FIELDS) {
      const _0xfd0dde = document.getElementById("char_" + _0x2ed9e7);
      if (_0xfd0dde && _0xfd0dde.value !== (_0x194a5c[_0x2ed9e7] || "")) {
        _0xd5c955 = true;
        break;
      }
    }
    if (_0xd5c955) {
      stylishConfirm("您有未保存的角色数据。要放弃这些更改并切换预设吗？").then(_0x5af0fd => {
        if (_0x5af0fd) {
          _0x35c000.characterPresetId = _0x3abe6d;
          loadCharacterPresetData(_0x3abe6d);
          saveSettingsDebounced();
        } else {
          _0x55be6b.value = _0xcc4789;
        }
      });
      return;
    }
  }
  _0x35c000.characterPresetId = _0x3abe6d;
  loadCharacterPresetData(_0x3abe6d);
  saveSettingsDebounced();
}
export function loadCharacterPresetData(_0x19c791) {
  const _0x463393 = extension_settings[extensionName];
  const _0x1d08f5 = _0x463393.characterPresets[_0x19c791];
  if (!_0x1d08f5) {
    return;
  }
  CHARACTER_FIELDS.forEach(_0x6eb952 => {
    const _0x3fe559 = document.getElementById("char_" + _0x6eb952);
    if (_0x3fe559) {
      _0x3fe559.value = _0x1d08f5[_0x6eb952] || "";
      const _0x5ad7e1 = _0x3fe559.closest(".st-chatu8-field-col")?.querySelector(".st-chatu8-unsaved-warning");
      if (_0x5ad7e1) {
        $(_0x5ad7e1).hide();
      }
    }
  });
  const _0x43ce24 = document.getElementById("char_outfit_list");
  if (_0x43ce24) {
    _0x43ce24.value = (_0x1d08f5.outfits || []).join("\n");
  }
  const _0x63d256 = document.getElementById("char_send_photo");
  if (_0x63d256) {
    _0x63d256.checked = _0x1d08f5.sendPhoto === true;
  }
  loadCharacterPhoto(_0x1d08f5);
  loadCharacterOutfitSelector();
}
function updateCharacterPreset() {
  const _0x1f2441 = extension_settings[extensionName];
  const _0x2ebc2d = _0x1f2441.characterPresetId;
  if (!_0x2ebc2d || !_0x1f2441.characterPresets[_0x2ebc2d]) {
    toastr.warning("没有活动的角色预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  saveCurrentCharacterData(_0x2ebc2d);
  CHARACTER_FIELDS.forEach(_0x4cc9ce => {
    const _0x201c08 = document.getElementById("char_" + _0x4cc9ce);
    if (_0x201c08) {
      const _0x34fdc6 = _0x201c08.closest(".st-chatu8-field-col")?.querySelector(".st-chatu8-unsaved-warning");
      if (_0x34fdc6) {
        $(_0x34fdc6).hide();
      }
    }
  });
  toastr.success("角色预设 \"" + _0x2ebc2d + "\" 已保存");
}
function saveCharacterPresetAs() {
  stylInput("请输入新角色预设的名称").then(_0x5d0284 => {
    if (_0x5d0284 && _0x5d0284.trim() !== "") {
      const _0xac3044 = extension_settings[extensionName];
      saveCurrentCharacterData(_0x5d0284);
      _0xac3044.characterPresetId = _0x5d0284;
      loadCharacterPresetList();
      alert("角色预设 \"" + _0x5d0284 + "\" 已保存。");
    }
  });
}
function createNewCharacterPreset() {
  stylInput("请输入新角色预设的名称").then(_0x2e7cdf => {
    if (_0x2e7cdf && _0x2e7cdf.trim() !== "") {
      const _0x2aa844 = extension_settings[extensionName];
      if (_0x2aa844.characterPresets[_0x2e7cdf]) {
        alert("角色预设 \"" + _0x2e7cdf + "\" 已存在，请使用其他名称。");
        return;
      }
      const _0x4cb1d0 = {};
      CHARACTER_FIELDS.forEach(_0x1e5f28 => {
        _0x4cb1d0[_0x1e5f28] = "";
      });
      _0x4cb1d0.outfits = [];
      _0x4cb1d0.photoImageIds = [];
      _0x4cb1d0.photoPrompt = "";
      _0x4cb1d0.sendPhoto = false;
      _0x4cb1d0.generationContext = "";
      _0x4cb1d0.generationWorldBook = "";
      _0x4cb1d0.generationVariables = {};
      _0x2aa844.characterPresets[_0x2e7cdf] = _0x4cb1d0;
      _0x2aa844.characterPresetId = _0x2e7cdf;
      saveSettingsDebounced();
      loadCharacterPresetList();
      loadCharacterPresetData(_0x2e7cdf);
      toastr.success("空白角色预设 \"" + _0x2e7cdf + "\" 已创建。");
    }
  });
}
function saveCurrentCharacterData(_0x1b0c9f) {
  const _0x55df18 = extension_settings[extensionName];
  const _0x493e02 = {};
  CHARACTER_FIELDS.forEach(_0x2b966c => {
    const _0x1ccb07 = document.getElementById("char_" + _0x2b966c);
    if (_0x1ccb07) {
      _0x493e02[_0x2b966c] = _0x1ccb07.value || "";
    }
  });
  const _0xdf2416 = document.getElementById("char_outfit_list");
  if (_0xdf2416) {
    _0x493e02.outfits = _0xdf2416.value.split("\n").map(_0x58de12 => _0x58de12.trim()).filter(_0x5eb421 => _0x5eb421.length > 0);
  } else {
    _0x493e02.outfits = [];
  }
  const _0x1fbbdc = document.getElementById("char_photo_prompt");
  if (_0x1fbbdc) {
    _0x493e02.photoPrompt = _0x1fbbdc.value || "";
  }
  const _0x1e78b8 = document.getElementById("char_send_photo");
  if (_0x1e78b8) {
    _0x493e02.sendPhoto = _0x1e78b8.checked;
  }
  const _0x33b91a = _0x55df18.characterPresets[_0x1b0c9f] || {};
  _0x493e02.photoImageIds = _0x33b91a.photoImageIds || [];
  _0x493e02.generationContext = _0x33b91a.generationContext || "";
  _0x493e02.generationWorldBook = _0x33b91a.generationWorldBook || "";
  _0x493e02.generationVariables = _0x33b91a.generationVariables || {};
  _0x55df18.characterPresets[_0x1b0c9f] = _0x493e02;
  saveSettingsDebounced();
}
function deleteCharacterPreset() {
  const _0x36efd2 = extension_settings[extensionName];
  const _0x2cf32d = document.getElementById("character_preset_id")?.value;
  if (_0x2cf32d === "默认角色") {
    alert("默认预设不能删除");
    return;
  }
  stylishConfirm("是否确定删除该角色预设").then(_0x8459c9 => {
    if (_0x8459c9) {
      delete _0x36efd2.characterPresets[_0x2cf32d];
      _0x36efd2.characterPresetId = "默认角色";
      loadCharacterPresetList();
      loadCharacterPreset();
      saveSettingsDebounced();
    }
  });
}
function formatOutfitListForDialog(_0x2b0530, _0x1f2538 = 10) {
  if (!_0x2b0530 || !Array.isArray(_0x2b0530) || _0x2b0530.length === 0) {
    return "";
  }
  if (typeof _0x1f2538 !== "number" || _0x1f2538 <= 0) {
    _0x1f2538 = 10;
  }
  if (_0x2b0530.length <= _0x1f2538) {
    return ":\n" + _0x2b0530.join("\n");
  } else {
    return " (共 " + _0x2b0530.length + " 个服装)";
  }
}
async function exportCharacterPreset() {
  const _0x32a9a7 = extension_settings[extensionName];
  const _0x3f81c4 = _0x32a9a7.characterPresetId;
  const _0x34a0a2 = _0x32a9a7.characterPresets[_0x3f81c4];
  if (!_0x34a0a2) {
    alert("没有选中的角色预设可导出。");
    return;
  }
  const _0x43784d = _0x34a0a2.outfits || [];
  const _0x230af1 = {
    [_0x3f81c4]: _0x34a0a2
  };
  const _0x37acd7 = {
    characters: _0x230af1
  };
  let _0x5db445 = _0x37acd7;
  if (_0x43784d.length > 0) {
    const _0x4b3ea8 = formatOutfitListForDialog(_0x43784d);
    const _0x1d5f91 = "检测到该角色包含 " + _0x43784d.length + " 个服装" + _0x4b3ea8 + "\n\n是否一起导出相关服装?";
    const _0x2a0b9d = await stylishConfirm(_0x1d5f91);
    if (_0x2a0b9d) {
      _0x5db445.outfits = {};
      _0x43784d.forEach(_0x114cf0 => {
        if (_0x32a9a7.outfitPresets[_0x114cf0]) {
          _0x5db445.outfits[_0x114cf0] = _0x32a9a7.outfitPresets[_0x114cf0];
        }
      });
    }
  }
  const _0x474700 = new Set();
  if (_0x34a0a2.photoImageIds && _0x34a0a2.photoImageIds.length > 0) {
    _0x34a0a2.photoImageIds.forEach(_0x9310ff => _0x474700.add(_0x9310ff));
  }
  if (_0x5db445.outfits) {
    for (const _0x4d823a in _0x5db445.outfits) {
      const _0x49ac0f = _0x5db445.outfits[_0x4d823a];
      if (_0x49ac0f.photoImageIds && _0x49ac0f.photoImageIds.length > 0) {
        _0x49ac0f.photoImageIds.forEach(_0x4b5e99 => _0x474700.add(_0x4b5e99));
      }
    }
  }
  if (_0x474700.size > 0) {
    _0x5db445.images = {};
    for (const _0x13784 of _0x474700) {
      try {
        const _0xfe86e1 = await getConfigImage(_0x13784);
        if (_0xfe86e1) {
          _0x5db445.images[_0x13784] = _0xfe86e1;
        }
      } catch (_0x1c8f13) {
        console.error("[CharacterPreset] 获取图片 " + _0x13784 + " 失败:", _0x1c8f13);
      }
    }
    console.log("[CharacterPreset] 导出 " + Object.keys(_0x5db445.images).length + " 张图片");
  }
  _0x5db445 = await encryptExportData(_0x5db445);
  const _0x8ddbc6 = JSON.stringify(_0x5db445, null, 2);
  const _0x190b35 = new Blob([_0x8ddbc6], {
    type: "application/json"
  });
  const _0x32ad68 = URL.createObjectURL(_0x190b35);
  const _0x297ecf = document.createElement("a");
  _0x297ecf.href = _0x32ad68;
  _0x297ecf.download = "st-chatu8-角色-" + _0x3f81c4 + ".json";
  document.body.appendChild(_0x297ecf);
  _0x297ecf.click();
  document.body.removeChild(_0x297ecf);
  URL.revokeObjectURL(_0x32ad68);
}
async function exportAllCharacterPresets() {
  const _0x2f163c = extension_settings[extensionName];
  if (!_0x2f163c.characterPresets || Object.keys(_0x2f163c.characterPresets).length === 0) {
    alert("没有角色预设可导出。");
    return;
  }
  const _0x14db19 = new Set();
  for (const _0x440fe0 in _0x2f163c.characterPresets) {
    const _0x4cb6c6 = _0x2f163c.characterPresets[_0x440fe0];
    const _0x547652 = _0x4cb6c6.outfits || [];
    _0x547652.forEach(_0x36b2c5 => _0x14db19.add(_0x36b2c5));
  }
  const _0x30c1bf = {
    characters: _0x2f163c.characterPresets
  };
  let _0x21325f = _0x30c1bf;
  if (_0x14db19.size > 0) {
    const _0x3c4b50 = Array.from(_0x14db19);
    const _0x20df63 = formatOutfitListForDialog(_0x3c4b50);
    const _0x206a32 = "检测到所有角色共包含 " + _0x14db19.size + " 个不同的服装" + _0x20df63 + "\n\n是否一起导出相关服装?";
    const _0x57eb7f = await stylishConfirm(_0x206a32);
    if (_0x57eb7f) {
      _0x21325f.outfits = {};
      _0x14db19.forEach(_0x2ec62a => {
        if (_0x2f163c.outfitPresets[_0x2ec62a]) {
          _0x21325f.outfits[_0x2ec62a] = _0x2f163c.outfitPresets[_0x2ec62a];
        }
      });
    }
  }
  const _0x361a36 = new Set();
  for (const _0x2c7f66 in _0x2f163c.characterPresets) {
    const _0x320a33 = _0x2f163c.characterPresets[_0x2c7f66];
    if (_0x320a33.photoImageIds && _0x320a33.photoImageIds.length > 0) {
      _0x320a33.photoImageIds.forEach(_0x5c4b3c => _0x361a36.add(_0x5c4b3c));
    }
  }
  if (_0x21325f.outfits) {
    for (const _0x5363fb in _0x21325f.outfits) {
      const _0x8d7af6 = _0x21325f.outfits[_0x5363fb];
      if (_0x8d7af6.photoImageIds && _0x8d7af6.photoImageIds.length > 0) {
        _0x8d7af6.photoImageIds.forEach(_0x5203ce => _0x361a36.add(_0x5203ce));
      }
    }
  }
  if (_0x361a36.size > 0) {
    _0x21325f.images = {};
    for (const _0x466b6a of _0x361a36) {
      try {
        const _0x50c275 = await getConfigImage(_0x466b6a);
        if (_0x50c275) {
          _0x21325f.images[_0x466b6a] = _0x50c275;
        }
      } catch (_0x5d4289) {
        console.error("[CharacterPreset] 获取图片 " + _0x466b6a + " 失败:", _0x5d4289);
      }
    }
    console.log("[CharacterPreset] 导出全部：共 " + Object.keys(_0x21325f.images).length + " 张图片");
  }
  _0x21325f = await encryptExportData(_0x21325f);
  const _0x25e5cf = JSON.stringify(_0x21325f, null, 2);
  const _0x2480a5 = new Blob([_0x25e5cf], {
    type: "application/json"
  });
  const _0x3b66e4 = URL.createObjectURL(_0x2480a5);
  const _0x3f3a05 = document.createElement("a");
  _0x3f3a05.href = _0x3b66e4;
  _0x3f3a05.download = "st-chatu8-角色-全部.json";
  document.body.appendChild(_0x3f3a05);
  _0x3f3a05.click();
  document.body.removeChild(_0x3f3a05);
  URL.revokeObjectURL(_0x3b66e4);
}
function importCharacterPreset() {
  const _0x172043 = extension_settings[extensionName];
  const _0x19c698 = document.createElement("input");
  _0x19c698.type = "file";
  _0x19c698.accept = ".json";
  _0x19c698.onchange = async _0x41e9cc => {
    const _0xe8878b = _0x41e9cc.target.files[0];
    if (!_0xe8878b) {
      return;
    }
    const _0x51f355 = new FileReader();
    _0x51f355.onload = async _0x4584a5 => {
      try {
        let _0x3e6231 = JSON.parse(_0x4584a5.target.result);
        _0x3e6231 = decryptImportData(_0x3e6231);
        let _0x2b18db = {};
        let _0x237091 = {};
        let _0x2bf7ac = _0x3e6231.images || {};
        if (_0x3e6231.characters) {
          _0x2b18db = _0x3e6231.characters;
          _0x237091 = _0x3e6231.outfits || {};
        } else {
          _0x2b18db = _0x3e6231;
        }
        let _0x1e0451 = false;
        if (Object.keys(_0x237091).length > 0) {
          const _0x420e5e = Object.keys(_0x237091);
          const _0x58b6dc = "检测到 " + _0x420e5e.length + " 个相关服装:\n" + _0x420e5e.join("\n") + "\n\n是否一起导入?";
          _0x1e0451 = await stylishConfirm(_0x58b6dc);
        }
        let _0x1c2107 = 0;
        const _0x14e5ab = {};
        if (Object.keys(_0x2bf7ac).length > 0) {
          console.log("[CharacterPreset] 正在导入 " + Object.keys(_0x2bf7ac).length + " 张图片...");
          for (const _0x1db7c5 in _0x2bf7ac) {
            try {
              const _0x432b4e = _0x2bf7ac[_0x1db7c5];
              const _0x508b21 = await saveConfigImage(_0x432b4e);
              _0x14e5ab[_0x1db7c5] = _0x508b21;
              _0x1c2107++;
            } catch (_0x331134) {
              console.error("[CharacterPreset] 导入图片 " + _0x1db7c5 + " 失败:", _0x331134);
            }
          }
          console.log("[CharacterPreset] 成功导入 " + _0x1c2107 + " 张图片");
          for (const _0x2d5e51 in _0x2b18db) {
            const _0x58fa3f = _0x2b18db[_0x2d5e51];
            if (_0x58fa3f.photoImageIds && _0x58fa3f.photoImageIds.length > 0) {
              _0x58fa3f.photoImageIds = _0x58fa3f.photoImageIds.map(_0x573aca => _0x14e5ab[_0x573aca] || _0x573aca);
            }
          }
          for (const _0x527328 in _0x237091) {
            const _0x1c5241 = _0x237091[_0x527328];
            if (_0x1c5241.photoImageIds && _0x1c5241.photoImageIds.length > 0) {
              _0x1c5241.photoImageIds = _0x1c5241.photoImageIds.map(_0x33ad2c => _0x14e5ab[_0x33ad2c] || _0x33ad2c);
            }
          }
        }
        let _0x4aeeef = 0;
        for (const _0x3578 in _0x2b18db) {
          if (_0x2b18db.hasOwnProperty(_0x3578)) {
            if (!_0x172043.characterPresets.hasOwnProperty(_0x3578)) {
              _0x4aeeef++;
            }
            _0x172043.characterPresets[_0x3578] = _0x2b18db[_0x3578];
          }
        }
        let _0x22722b = 0;
        if (_0x1e0451) {
          for (const _0x58c533 in _0x237091) {
            if (_0x237091.hasOwnProperty(_0x58c533)) {
              if (!_0x172043.outfitPresets.hasOwnProperty(_0x58c533)) {
                _0x22722b++;
              }
              _0x172043.outfitPresets[_0x58c533] = _0x237091[_0x58c533];
            }
          }
        }
        saveSettingsDebounced();
        loadCharacterPresetList();
        if (_0x1e0451) {
          loadOutfitPresetList();
        }
        const _0x50a2ef = Object.keys(_0x2b18db)[0];
        if (_0x50a2ef) {
          _0x172043.characterPresetId = _0x50a2ef;
          const _0x129a5f = document.getElementById("character_preset_id");
          if (_0x129a5f) {
            _0x129a5f.value = _0x50a2ef;
          }
          loadCharacterPresetData(_0x50a2ef);
        }
        let _0x5b8770 = "成功导入 " + Object.keys(_0x2b18db).length + " 个角色预设，其中 " + _0x4aeeef + " 个是全新的。";
        if (_0x1e0451) {
          _0x5b8770 += "\n同时导入 " + Object.keys(_0x237091).length + " 个服装预设，其中 " + _0x22722b + " 个是全新的。";
        }
        if (_0x1c2107 > 0) {
          _0x5b8770 += "\n同时导入 " + _0x1c2107 + " 张图片。";
        }
        alert(_0x5b8770);
      } catch (_0x15f020) {
        alert("导入失败，请确保文件是正确的JSON格式。\n错误信息: " + _0x15f020.message);
        console.error("Error importing character presets:", _0x15f020);
      }
    };
    _0x51f355.readAsText(_0xe8878b);
  };
  _0x19c698.click();
}
function handleCharacterVisualSelect() {
  showCharacterVisualSelector(_0x4d1e16 => {
    const _0x295b4f = document.getElementById("character_preset_id");
    if (_0x295b4f) {
      _0x295b4f.value = _0x4d1e16;
    }
  });
}
function bindCharacterFieldListeners() {
  CHARACTER_FIELDS.forEach(_0x47f54e => {
    const _0x5e2a39 = document.getElementById("char_" + _0x47f54e);
    if (_0x5e2a39) {
      $(_0x5e2a39).on("input", function () {
        const _0x4ea602 = extension_settings[extensionName];
        const _0x5c4b11 = _0x4ea602.characterPresetId;
        const _0x2819c2 = _0x4ea602.characterPresets[_0x5c4b11] || {};
        const _0x158bd8 = $(this).val() !== (_0x2819c2[_0x47f54e] || "");
        const _0x6132cc = $(this).closest(".st-chatu8-field-col").find(".st-chatu8-unsaved-warning");
        if (_0x158bd8) {
          $(_0x6132cc).show();
        } else {
          $(_0x6132cc).hide();
        }
      });
    }
  });
}
function loadCharacterOutfitSelector() {
  const _0x9177da = extension_settings[extensionName];
  const _0x322920 = document.getElementById("char_outfit_selector");
  if (!_0x322920) {
    return;
  }
  _0x322920.innerHTML = "<option value=\"\">-- 选择服装 --</option>";
  for (const _0x2c674b in _0x9177da.outfitPresets) {
    const _0x19ba22 = document.createElement("option");
    _0x19ba22.value = _0x2c674b;
    _0x19ba22.textContent = _0x2c674b;
    _0x322920.add(_0x19ba22);
  }
}
function addOutfitFromSelector() {
  const _0x2b6b76 = document.getElementById("char_outfit_selector");
  const _0x505ce2 = document.getElementById("char_outfit_list");
  if (!_0x2b6b76 || !_0x505ce2) {
    return;
  }
  const _0x254674 = _0x2b6b76.value;
  if (!_0x254674) {
    alert("请先选择一个服装");
    return;
  }
  const _0x313ac2 = _0x505ce2.value.trim();
  const _0x1bdd74 = _0x313ac2 ? _0x313ac2.split("\n") : [];
  if (_0x1bdd74.includes(_0x254674)) {
    alert("该服装已在列表中");
    return;
  }
  _0x1bdd74.push(_0x254674);
  _0x505ce2.value = _0x1bdd74.join("\n");
}
function checkCharacterOutfitList() {
  const _0x12042e = extension_settings[extensionName];
  const _0x1d77f1 = document.getElementById("char_outfit_list");
  const _0x4324ae = document.getElementById("char_outfit_check_result");
  const _0xcb0754 = document.getElementById("char_outfit_check_content");
  if (!_0x1d77f1 || !_0x4324ae || !_0xcb0754) {
    return;
  }
  const _0x3e3d9a = _0x1d77f1.value.split("\n").map(_0x11847a => _0x11847a.trim()).filter(_0x3c0dd5 => _0x3c0dd5.length > 0);
  if (_0x3e3d9a.length === 0) {
    alert("请先输入服装名称");
    return;
  }
  const _0x3c9242 = new Set();
  for (const _0x326f74 in _0x12042e.outfitPresets) {
    _0x3c9242.add(_0x326f74);
  }
  const _0x36b1df = {
    found: [],
    notFound: []
  };
  _0x3e3d9a.forEach(_0xb3b348 => {
    if (_0x3c9242.has(_0xb3b348)) {
      _0x36b1df.found.push(_0xb3b348);
    } else {
      _0x36b1df.notFound.push(_0xb3b348);
    }
  });
  let _0x1fea99 = "<div style=\"margin-bottom: 10px;\">";
  _0x1fea99 += "<strong>总计：</strong>" + _0x3e3d9a.length + " 个服装";
  _0x1fea99 += "<br><strong>找到：</strong>" + _0x36b1df.found.length + " 个";
  _0x1fea99 += "<br><strong>未找到：</strong>" + _0x36b1df.notFound.length + " 个";
  _0x1fea99 += "</div>";
  if (_0x36b1df.found.length > 0) {
    _0x1fea99 += "<div style=\"margin-bottom: 10px;\">";
    _0x1fea99 += "<strong style=\"color: #28a745;\">✓ 已存在的服装：</strong>";
    _0x1fea99 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x36b1df.found.forEach(_0x490fe9 => {
      _0x1fea99 += "<li>" + _0x490fe9 + "</li>";
    });
    _0x1fea99 += "</ul></div>";
  }
  if (_0x36b1df.notFound.length > 0) {
    _0x1fea99 += "<div>";
    _0x1fea99 += "<strong style=\"color: #dc3545;\">✗ 未找到的服装：</strong>";
    _0x1fea99 += "<ul style=\"margin: 5px 0; padding-left: 20px;\">";
    _0x36b1df.notFound.forEach(_0x587e22 => {
      _0x1fea99 += "<li>" + _0x587e22 + "</li>";
    });
    _0x1fea99 += "</ul></div>";
  }
  _0xcb0754.innerHTML = _0x1fea99;
  $(_0x4324ae).show();
}
function cleanTagForTranslation(_0x31b82a) {
  return _0x31b82a.replace(/^[\{\[\(\<]+|[\}\]\)\>]+$/g, "").replace(/^\{+|\}+$/g, "").replace(/:[\d.]+$/, "").trim();
}
async function clearCharacterDetailParameters() {
  const _0x6a6a94 = await stylishConfirm("确定要清空所有详细参数吗？\n\n这将清空以下字段：\n- 角色特质\n- 面部特征（正面/背面）\n- 上半身描述（SFW/NSFW，正面/背面）\n- 全身描述（SFW/NSFW，正面/背面）\n- 负面提示词\n\n此操作不会自动保存，您需要手动保存更改。");
  if (!_0x6a6a94) {
    return;
  }
  const _0x2ccd5c = ["characterTraits", "facialFeatures", "facialFeaturesBack", "upperBodySFW", "upperBodySFWBack", "fullBodySFW", "fullBodySFWBack", "upperBodyNSFW", "upperBodyNSFWBack", "fullBodyNSFW", "fullBodyNSFWBack", "negative"];
  _0x2ccd5c.forEach(_0x2c2fdc => {
    const _0x3a0f6c = document.getElementById("char_" + _0x2c2fdc);
    if (_0x3a0f6c) {
      _0x3a0f6c.value = "";
      $(_0x3a0f6c).trigger("input");
    }
  });
  toastr.success("详细参数已清空，请记得保存更改。");
}
async function translateCharacterFields() {
  const _0x36346a = CHARACTER_FIELDS.filter(_0x39cc1e => _0x39cc1e !== "nameCN" && _0x39cc1e !== "nameEN");
  const _0x17d0b9 = [];
  const _0x55b2b5 = [];
  const _0x241fb7 = /（[^）]*）/g;
  for (const _0x4d2c38 of _0x36346a) {
    const _0x4a572c = document.getElementById("char_" + _0x4d2c38);
    if (_0x4a572c && _0x4a572c.value && _0x4a572c.value.trim()) {
      const _0x5b5ee2 = _0x4a572c.value.replace(_0x241fb7, "").trim();
      const _0x13d784 = {
        field: _0x4d2c38,
        element: _0x4a572c,
        originalValue: _0x4a572c.value,
        cleanedValue: _0x5b5ee2
      };
      _0x17d0b9.push(_0x13d784);
      const _0x2d72f9 = _0x5b5ee2.split(/[,，]/).map(_0x1f281e => _0x1f281e.trim()).filter(Boolean);
      _0x55b2b5.push(..._0x2d72f9);
    }
  }
  if (_0x55b2b5.length === 0) {
    toastr.info("没有找到需要翻译的内容。");
    return;
  }
  const _0x5d9491 = [...new Set(_0x55b2b5)];
  const _0x2be85a = _0x5d9491.map(_0x351aec => cleanTagForTranslation(_0x351aec)).filter(Boolean);
  const _0x1cbdee = [...new Set(_0x2be85a)];
  toastr.info("正在翻译角色描述...", "请稍候", {
    timeOut: 0,
    extendedTimeOut: 0
  });
  try {
    const _0x3799ce = _0x1cbdee.join(", ");
    const _0xe6a20a = await translatePromptTags(_0x3799ce);
    if (_0xe6a20a && _0xe6a20a.results) {
      const _0x44fb7a = {};
      for (const _0x47ddad of _0xe6a20a.results) {
        if (_0x47ddad.original && _0x47ddad.translation) {
          _0x44fb7a[_0x47ddad.original.toLowerCase()] = _0x47ddad.translation;
        }
      }
      let _0x47cc10 = 0;
      for (const {
        field: _0x4ac28a,
        element: _0x2bb27d,
        cleanedValue: _0x147d73
      } of _0x17d0b9) {
        const _0x2e70f8 = _0x147d73.split(/[,，]/).map(_0x2bd7b0 => _0x2bd7b0.trim()).filter(Boolean);
        const _0x3ba394 = _0x2e70f8.map(_0x46f7c8 => {
          const _0x28948f = cleanTagForTranslation(_0x46f7c8);
          const _0x18621a = _0x44fb7a[_0x28948f.toLowerCase()];
          if (_0x18621a) {
            return _0x46f7c8 + "（" + _0x18621a + "）";
          }
          return _0x46f7c8;
        });
        _0x2bb27d.value = _0x3ba394.join(", ");
        _0x47cc10++;
        $(_0x2bb27d).trigger("input");
      }
      toastr.clear();
      toastr.success("已翻译 " + _0x47cc10 + " 个字段。");
    } else {
      toastr.clear();
      toastr.info("翻译结果为空。");
    }
  } catch (_0xfe0ac8) {
    console.error("翻译失败:", _0xfe0ac8);
    toastr.clear();
    toastr.error("翻译失败，请检查 LLM 设置。");
  }
}
async function translatePhotoPrompt() {
  const _0x13aa08 = document.getElementById("char_photo_prompt");
  if (!_0x13aa08 || !_0x13aa08.value || !_0x13aa08.value.trim()) {
    toastr.info("没有找到需要翻译的提示词内容。");
    return;
  }
  const _0x2eba07 = /（[^）]*）/g;
  const _0x3addc7 = _0x13aa08.value;
  const _0x34243c = _0x3addc7.replace(_0x2eba07, "").trim();
  const _0x523655 = _0x34243c.split(/[,，]/).map(_0x5b8219 => _0x5b8219.trim()).filter(Boolean);
  if (_0x523655.length === 0) {
    toastr.info("没有找到需要翻译的内容。");
    return;
  }
  const _0x32bb69 = [...new Set(_0x523655)];
  const _0x2a014a = _0x32bb69.map(_0x35e617 => cleanTagForTranslation(_0x35e617)).filter(Boolean);
  const _0x578ab3 = [...new Set(_0x2a014a)];
  toastr.info("正在翻译提示词...", "请稍候", {
    timeOut: 0,
    extendedTimeOut: 0
  });
  try {
    const _0x10b2cc = _0x578ab3.join(", ");
    const _0x5e65c7 = await translatePromptTags(_0x10b2cc);
    if (_0x5e65c7 && _0x5e65c7.results) {
      const _0x2786d6 = {};
      for (const _0x401212 of _0x5e65c7.results) {
        if (_0x401212.original && _0x401212.translation) {
          _0x2786d6[_0x401212.original.toLowerCase()] = _0x401212.translation;
        }
      }
      const _0x17c663 = _0x523655.map(_0x32a8f5 => {
        const _0x20c548 = cleanTagForTranslation(_0x32a8f5);
        const _0x18120e = _0x2786d6[_0x20c548.toLowerCase()];
        if (_0x18120e) {
          return _0x32a8f5 + "（" + _0x18120e + "）";
        }
        return _0x32a8f5;
      });
      _0x13aa08.value = _0x17c663.join(", ");
      $(_0x13aa08).trigger("input");
      toastr.clear();
      toastr.success("提示词翻译完成。");
    } else {
      toastr.clear();
      toastr.info("翻译结果为空。");
    }
  } catch (_0x13a8f6) {
    console.error("翻译失败:", _0x13a8f6);
    toastr.clear();
    toastr.error("翻译失败，请检查 LLM 设置。");
  }
}
async function loadCharacterPhoto(_0x50f14d) {
  const _0x1e802b = document.getElementById("char_photo_preview");
  const _0x5cb220 = document.getElementById("char_photo_placeholder");
  const _0x408b38 = document.getElementById("char_photo_prompt");
  if (_0x408b38) {
    _0x408b38.value = _0x50f14d.photoPrompt || "";
  }
  if (_0x50f14d.photoImageId && (!_0x50f14d.photoImageIds || _0x50f14d.photoImageIds.length === 0)) {
    _0x50f14d.photoImageIds = [_0x50f14d.photoImageId];
    delete _0x50f14d.photoImageId;
    saveSettingsDebounced();
  }
  const _0xba8a1b = _0x50f14d.photoImageIds || [];
  let _0xd2bcbb = _0x50f14d.selectedPhotoIndex || 0;
  if (_0xd2bcbb < 0 || _0xd2bcbb >= _0xba8a1b.length) {
    _0xd2bcbb = _0xba8a1b.length > 0 ? _0xba8a1b.length - 1 : 0;
  }
  if (_0xba8a1b.length > 0) {
    const _0x17bd82 = _0xba8a1b[_0xd2bcbb];
    try {
      const _0x5a77d2 = await getConfigImage(_0x17bd82);
      if (_0x5a77d2 && _0x1e802b && _0x5cb220) {
        _0x1e802b.src = _0x5a77d2;
        _0x1e802b.style.display = "block";
        _0x5cb220.style.display = "none";
        _0x1e802b.style.cursor = "pointer";
        _0x1e802b.onclick = () => showImageViewer(_0xba8a1b, _0xd2bcbb);
        return;
      }
    } catch (_0x1b0e06) {
      console.error("[CharacterPreset] 加载角色照片失败:", _0x1b0e06);
    }
  }
  if (_0x1e802b && _0x5cb220) {
    _0x1e802b.src = "";
    _0x1e802b.style.display = "none";
    _0x5cb220.style.display = "flex";
    _0x1e802b.onclick = null;
    _0x1e802b.style.cursor = "default";
  }
}
async function handlePhotoGenerate() {
  const _0x1c54d9 = extension_settings[extensionName];
  const _0x92a455 = _0x1c54d9.characterPresetId;
  const _0x4923ac = _0x1c54d9.characterPresets[_0x92a455];
  if (!_0x4923ac) {
    toastr.warning("请先选择一个角色预设");
    return;
  }
  const _0x12d741 = document.getElementById("char_photo_prompt");
  const _0x7d3e20 = _0x12d741?.value?.trim() || "";
  if (!_0x7d3e20) {
    toastr.warning("请先输入图片生成提示词");
    return;
  }
  const _0x466a20 = "char_photo_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  toastr.info("正在生成角色图片...", "请稍候", {
    timeOut: 0,
    extendedTimeOut: 0
  });
  const _0x408751 = async _0xcd4041 => {
    if (_0xcd4041.id !== _0x466a20) {
      return;
    }
    const _0x5415db = activePhotoRequests.get(_0x466a20);
    if (_0x5415db) {
      eventSource.removeListener(EventType.GENERATE_IMAGE_RESPONSE, _0x5415db.listener);
      activePhotoRequests.delete(_0x466a20);
    }
    toastr.clear();
    if (_0xcd4041.success && _0xcd4041.imageData) {
      try {
        const _0xc6f732 = await saveConfigImage(_0xcd4041.imageData);
        if (!_0x4923ac.photoImageIds) {
          _0x4923ac.photoImageIds = [];
        }
        _0x4923ac.photoImageIds.push(_0xc6f732);
        saveSettingsDebounced();
        const _0x93d0e2 = document.getElementById("char_photo_preview");
        const _0x49bb86 = document.getElementById("char_photo_placeholder");
        if (_0x93d0e2 && _0x49bb86) {
          _0x93d0e2.src = _0xcd4041.imageData;
          _0x93d0e2.style.display = "block";
          _0x49bb86.style.display = "none";
          _0x93d0e2.style.cursor = "pointer";
          _0x93d0e2.onclick = () => showImageViewer(_0x4923ac.photoImageIds, _0x4923ac.photoImageIds.length - 1);
        }
        toastr.success("角色图片生成成功");
      } catch (_0x2da481) {
        console.error("[CharacterPreset] 保存图片失败:", _0x2da481);
        toastr.error("保存图片失败: " + _0x2da481.message);
      }
    } else {
      toastr.error("图片生成失败: " + (_0xcd4041.error || "未知错误"));
    }
  };
  activePhotoRequests.set(_0x466a20, {
    listener: _0x408751,
    timestamp: Date.now()
  });
  eventSource.on(EventType.GENERATE_IMAGE_RESPONSE, _0x408751);
  const _0x26f2fa = {
    id: _0x466a20,
    prompt: _0x7d3e20
  };
  eventSource.emit(EventType.GENERATE_IMAGE_REQUEST, _0x26f2fa);
}
function handlePhotoGeneratePrompt() {
  handlePhotoGeneratePromptClick();
}
async function handleCharacterPhotoUpload(_0x4f8ffa) {
  const _0x277ee6 = _0x4f8ffa.target;
  if (!_0x277ee6.files || !_0x277ee6.files[0]) {
    return;
  }
  const _0x32d223 = extension_settings[extensionName];
  const _0x5d1aa4 = _0x32d223.characterPresetId;
  const _0x20d3a3 = _0x32d223.characterPresets[_0x5d1aa4];
  if (!_0x20d3a3) {
    toastr.warning("请先选择一个角色预设");
    _0x277ee6.value = "";
    return;
  }
  const _0x51e2e0 = _0x277ee6.files[0];
  if (!_0x51e2e0.type.startsWith("image/")) {
    toastr.warning("请选择图片文件");
    _0x277ee6.value = "";
    return;
  }
  const _0x1b9802 = new FileReader();
  _0x1b9802.onload = async _0x3cf485 => {
    try {
      const _0x331aa8 = _0x3cf485.target.result;
      const _0x450c91 = await saveConfigImage(_0x331aa8);
      if (!_0x20d3a3.photoImageIds) {
        _0x20d3a3.photoImageIds = [];
      }
      _0x20d3a3.photoImageIds.push(_0x450c91);
      saveSettingsDebounced();
      const _0x2e5320 = document.getElementById("char_photo_preview");
      const _0x398e93 = document.getElementById("char_photo_placeholder");
      if (_0x2e5320 && _0x398e93) {
        _0x2e5320.src = _0x331aa8;
        _0x2e5320.style.display = "block";
        _0x398e93.style.display = "none";
        _0x2e5320.style.cursor = "pointer";
        _0x2e5320.onclick = () => showImageViewer(_0x20d3a3.photoImageIds, _0x20d3a3.photoImageIds.length - 1);
      }
      toastr.success("角色照片上传成功");
    } catch (_0x508064) {
      console.error("[CharacterPreset] 上传照片失败:", _0x508064);
      toastr.error("上传照片失败: " + _0x508064.message);
    }
  };
  _0x1b9802.onerror = () => {
    toastr.error("读取文件失败");
  };
  _0x1b9802.readAsDataURL(_0x51e2e0);
  _0x277ee6.value = "";
}
function readFileAsBase64ForPopup(_0x5d112d) {
  return new Promise((_0x8c1674, _0x5d54ac) => {
    const _0x56375b = new FileReader();
    _0x56375b.onload = () => _0x8c1674(_0x56375b.result);
    _0x56375b.onerror = _0x5d54ac;
    _0x56375b.readAsDataURL(_0x5d112d);
  });
}
function handlePhotoModifyCharacterPrompt() {
  const _0x27febb = [];
  const _0x2e7a04 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x116ac9 = document.createElement("div");
  _0x116ac9.className = "st-chatu8-confirm-backdrop";
  const _0x9f158d = document.createElement("div");
  _0x9f158d.className = "st-chatu8-confirm-box st-chatu8-popup-modal";
  const _0x465806 = document.createElement("h3");
  _0x465806.className = "st-chatu8-popup-title";
  _0x465806.textContent = "修改角色提示词";
  _0x9f158d.appendChild(_0x465806);
  const _0x104b84 = document.createElement("p");
  _0x104b84.className = "st-chatu8-popup-description";
  _0x104b84.textContent = "请输入您的修改需求，AI 将根据需求调整角色提示词：";
  _0x9f158d.appendChild(_0x104b84);
  const _0x2c2ced = document.createElement("textarea");
  _0x2c2ced.className = "st-chatu8-textarea";
  _0x2c2ced.rows = 4;
  _0x2c2ced.placeholder = "例如：让角色的表情更生动、增加背景描述、调整服装细节...";
  _0x9f158d.appendChild(_0x2c2ced);
  const _0x340f4d = document.createElement("div");
  _0x340f4d.className = "st-chatu8-popup-upload-section";
  const _0x1d6fb6 = document.createElement("div");
  _0x1d6fb6.className = "st-chatu8-popup-upload-header";
  const _0x5c8f1e = document.createElement("span");
  _0x5c8f1e.className = "st-chatu8-popup-upload-label";
  _0x5c8f1e.textContent = "📎 参考图片（可选）";
  const _0x3cfff7 = document.createElement("input");
  _0x3cfff7.type = "file";
  _0x3cfff7.accept = "image/*";
  _0x3cfff7.multiple = true;
  _0x3cfff7.style.display = "none";
  const _0x5725b9 = document.createElement("button");
  _0x5725b9.type = "button";
  _0x5725b9.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加图片";
  _0x5725b9.className = "st-chatu8-btn st-chatu8-popup-upload-btn";
  _0x5725b9.addEventListener("click", () => _0x3cfff7.click());
  _0x1d6fb6.appendChild(_0x5c8f1e);
  _0x1d6fb6.appendChild(_0x5725b9);
  const _0x250914 = document.createElement("div");
  _0x250914.className = "st-chatu8-popup-image-preview";
  const _0x587b28 = document.createElement("div");
  _0x587b28.className = "st-chatu8-popup-empty-hint";
  _0x587b28.textContent = "点击上方按钮添加参考图片";
  _0x250914.appendChild(_0x587b28);
  function _0x10fc25() {
    _0x250914.innerHTML = "";
    if (_0x27febb.length === 0) {
      const _0x5e4761 = document.createElement("div");
      _0x5e4761.className = "st-chatu8-popup-empty-hint";
      _0x5e4761.textContent = "点击上方按钮添加参考图片";
      _0x250914.appendChild(_0x5e4761);
      return;
    }
    _0x27febb.forEach((_0x525d00, _0x3275a5) => {
      const _0x40fc54 = document.createElement("div");
      _0x40fc54.className = "st-chatu8-popup-image-item";
      const _0x4a45a5 = document.createElement("div");
      _0x4a45a5.className = "st-chatu8-popup-image-wrapper";
      const _0x406cd1 = document.createElement("img");
      _0x406cd1.src = _0x525d00.base64;
      const _0x50004d = document.createElement("button");
      _0x50004d.type = "button";
      _0x50004d.className = "st-chatu8-popup-image-delete";
      _0x50004d.innerHTML = "×";
      _0x50004d.addEventListener("click", _0x16898e => {
        _0x16898e.stopPropagation();
        _0x27febb.splice(_0x3275a5, 1);
        _0x10fc25();
      });
      _0x4a45a5.addEventListener("mouseenter", () => {
        _0x50004d.style.opacity = "1";
      });
      _0x4a45a5.addEventListener("mouseleave", () => {
        _0x50004d.style.opacity = "0";
      });
      _0x4a45a5.appendChild(_0x406cd1);
      _0x4a45a5.appendChild(_0x50004d);
      const _0x424558 = document.createElement("input");
      _0x424558.type = "text";
      _0x424558.className = "st-chatu8-popup-image-name";
      _0x424558.placeholder = "图" + (_0x3275a5 + 1);
      _0x424558.value = _0x525d00.name || "";
      _0x424558.addEventListener("input", _0x552c8a => {
        _0x27febb[_0x3275a5].name = _0x552c8a.target.value;
      });
      _0x40fc54.appendChild(_0x4a45a5);
      _0x40fc54.appendChild(_0x424558);
      _0x250914.appendChild(_0x40fc54);
    });
    const _0x260bb4 = document.createElement("div");
    _0x260bb4.className = "st-chatu8-popup-image-count";
    _0x260bb4.textContent = "已添加 " + _0x27febb.length + " 张图片";
    _0x250914.appendChild(_0x260bb4);
  }
  _0x3cfff7.addEventListener("change", async _0x1cbdaa => {
    const _0x513f4b = _0x1cbdaa.target.files;
    if (!_0x513f4b || _0x513f4b.length === 0) {
      return;
    }
    for (const _0x3694f of _0x513f4b) {
      if (!_0x3694f.type.startsWith("image/")) {
        continue;
      }
      try {
        const _0xb67566 = await readFileAsBase64ForPopup(_0x3694f);
        const _0x4bcf16 = {
          base64: _0xb67566,
          name: ""
        };
        _0x27febb.push(_0x4bcf16);
      } catch (_0x19842c) {
        console.error("[characterPreset] Failed to read image:", _0x19842c);
      }
    }
    _0x10fc25();
    _0x3cfff7.value = "";
  });
  _0x340f4d.appendChild(_0x1d6fb6);
  _0x340f4d.appendChild(_0x3cfff7);
  _0x340f4d.appendChild(_0x250914);
  _0x9f158d.appendChild(_0x340f4d);
  const _0x345ccb = document.createElement("div");
  _0x345ccb.className = "st-chatu8-confirm-buttons";
  const _0x443ff5 = document.createElement("button");
  _0x443ff5.textContent = "取消";
  _0x443ff5.className = "st-chatu8-btn";
  _0x345ccb.appendChild(_0x443ff5);
  const _0x2aa29b = document.createElement("button");
  _0x2aa29b.innerHTML = "<i class=\"fa-solid fa-check\"></i> 确认";
  _0x2aa29b.className = "st-chatu8-btn st-chatu8-btn-primary";
  _0x345ccb.appendChild(_0x2aa29b);
  _0x9f158d.appendChild(_0x345ccb);
  _0x116ac9.appendChild(_0x9f158d);
  _0x2e7a04.appendChild(_0x116ac9);
  setTimeout(() => _0x2c2ced.focus(), 100);
  const _0x26d408 = () => {
    _0x2e7a04.removeChild(_0x116ac9);
  };
  _0x443ff5.addEventListener("click", _0x26d408);
  _0x2aa29b.addEventListener("click", () => {
    const _0x596150 = _0x2c2ced.value.trim();
    _0x26d408();
    handleCharacterPromptModify(_0x596150, [..._0x27febb]);
  });
}
function handleCharacterData() {
  const _0x44aae7 = extension_settings[extensionName];
  const _0x209e99 = _0x44aae7.characterPresetId;
  const _0xf8d81e = _0x44aae7.characterPresets[_0x209e99];
  if (!_0xf8d81e) {
    toastr.warning("请先选择一个角色预设");
    return;
  }
  const _0x3aaf33 = _0xf8d81e.generationContext || "";
  const _0x3f1ea3 = _0xf8d81e.generationWorldBook || "";
  const _0x53d5ff = _0xf8d81e.generationVariables || {};
  const _0x260bb0 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x509e95 = document.createElement("div");
  _0x509e95.className = "st-chatu8-confirm-backdrop";
  const _0x1971a4 = document.createElement("div");
  _0x1971a4.className = "st-chatu8-confirm-box st-chatu8-popup-modal st-chatu8-popup-modal-large";
  const _0x402fab = document.createElement("h3");
  _0x402fab.className = "st-chatu8-popup-title";
  _0x402fab.textContent = "角色数据 - " + _0x209e99;
  _0x1971a4.appendChild(_0x402fab);
  const _0x39d799 = document.createElement("div");
  _0x39d799.className = "st-chatu8-popup-content";
  const _0x40b6c2 = createDataSection("生成时的上下文", "char_data_context", _0x3aaf33, "角色生成时使用的上下文内容...", 6);
  _0x39d799.appendChild(_0x40b6c2);
  const _0x55b36b = createDataSection("生成时的世界书触发", "char_data_worldbook", _0x3f1ea3, "角色生成时触发的世界书内容...", 6);
  _0x39d799.appendChild(_0x55b36b);
  const _0x36229a = document.createElement("div");
  _0x36229a.className = "st-chatu8-field-col";
  const _0x41e355 = document.createElement("label");
  _0x41e355.textContent = "生成时使用的变量";
  _0x36229a.appendChild(_0x41e355);
  const _0x25e7e8 = document.createElement("textarea");
  _0x25e7e8.id = "char_data_variables";
  _0x25e7e8.className = "st-chatu8-textarea st-chatu8-popup-code-textarea";
  _0x25e7e8.rows = 4;
  _0x25e7e8.placeholder = "变量格式: 变量名=值（每行一个）...";
  _0x25e7e8.value = Object.entries(_0x53d5ff).map(([_0x1e7dba, _0x35ae1a]) => _0x1e7dba + "=" + _0x35ae1a).join("\n");
  _0x36229a.appendChild(_0x25e7e8);
  _0x39d799.appendChild(_0x36229a);
  _0x1971a4.appendChild(_0x39d799);
  const _0x4ce074 = document.createElement("div");
  _0x4ce074.className = "st-chatu8-confirm-buttons";
  const _0x13e663 = document.createElement("button");
  _0x13e663.textContent = "取消";
  _0x13e663.className = "st-chatu8-btn";
  _0x4ce074.appendChild(_0x13e663);
  const _0x117a6f = document.createElement("button");
  _0x117a6f.innerHTML = "<i class=\"fa-solid fa-save\"></i> 保存";
  _0x117a6f.className = "st-chatu8-btn st-chatu8-btn-primary";
  _0x4ce074.appendChild(_0x117a6f);
  _0x1971a4.appendChild(_0x4ce074);
  _0x509e95.appendChild(_0x1971a4);
  _0x260bb0.appendChild(_0x509e95);
  const _0x108226 = () => {
    _0x260bb0.removeChild(_0x509e95);
  };
  _0x13e663.addEventListener("click", _0x108226);
  _0x117a6f.addEventListener("click", () => {
    const _0x3b4281 = document.getElementById("char_data_context").value;
    const _0xdff797 = document.getElementById("char_data_worldbook").value;
    const _0x281cc0 = document.getElementById("char_data_variables").value;
    const _0x17c363 = {};
    _0x281cc0.split("\n").forEach(_0x2cd942 => {
      const _0x5a6fc4 = _0x2cd942.trim();
      if (!_0x5a6fc4) {
        return;
      }
      const _0x3f722d = _0x5a6fc4.indexOf("=");
      if (_0x3f722d > 0) {
        const _0x2b91ec = _0x5a6fc4.substring(0, _0x3f722d).trim();
        const _0x5e81f7 = _0x5a6fc4.substring(_0x3f722d + 1).trim();
        _0x17c363[_0x2b91ec] = _0x5e81f7;
      }
    });
    _0xf8d81e.generationContext = _0x3b4281;
    _0xf8d81e.generationWorldBook = _0xdff797;
    _0xf8d81e.generationVariables = _0x17c363;
    saveSettingsDebounced();
    _0x108226();
    toastr.success("角色数据已保存");
  });
}
function createDataSection(_0x26466e, _0x3b866e, _0x423a7b, _0x475020, _0x559afb) {
  const _0x33ae53 = document.createElement("div");
  _0x33ae53.className = "st-chatu8-field-col";
  const _0x20792c = document.createElement("label");
  _0x20792c.textContent = _0x26466e;
  _0x33ae53.appendChild(_0x20792c);
  const _0x329dda = document.createElement("textarea");
  _0x329dda.id = _0x3b866e;
  _0x329dda.className = "st-chatu8-textarea st-chatu8-popup-code-textarea";
  _0x329dda.rows = _0x559afb;
  _0x329dda.placeholder = _0x475020;
  _0x329dda.value = _0x423a7b;
  _0x33ae53.appendChild(_0x329dda);
  return _0x33ae53;
}
async function showImageViewer(_0x39cdaa, _0x53506c) {
  const _0x46f8c2 = extension_settings[extensionName];
  const _0x305093 = _0x46f8c2.characterPresetId;
  const _0x377b24 = _0x46f8c2.characterPresets[_0x305093];
  if (!_0x39cdaa || _0x39cdaa.length === 0) {
    toastr.warning("没有可显示的图片");
    return;
  }
  let _0x418e10 = Math.max(0, Math.min(_0x53506c, _0x39cdaa.length - 1));
  const _0xff2886 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x5a5535 = document.createElement("div");
  _0x5a5535.className = "st-chatu8-confirm-backdrop";
  _0x5a5535.style.cssText = "\n        z-index: 10002;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 20px;\n        box-sizing: border-box;\n    ";
  const _0x2134bb = document.createElement("div");
  _0x2134bb.style.cssText = "\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        max-width: 95vw;\n        max-height: 95vh;\n        background: var(--SmartThemeBlurTintColor, rgba(0, 0, 0, 0.8));\n        border-radius: 12px;\n        padding: 20px;\n        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n    ";
  const _0x2ebab1 = document.createElement("div");
  _0x2ebab1.style.cssText = "\n        display: flex;\n        align-items: center;\n        gap: 15px;\n        position: relative;\n    ";
  const _0x18a461 = document.createElement("button");
  _0x18a461.innerHTML = "<i class=\"fa-solid fa-chevron-left\"></i>";
  _0x18a461.className = "st-chatu8-btn";
  _0x18a461.style.cssText = "\n        width: 50px;\n        height: 50px;\n        border-radius: 50%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 20px;\n        background: rgba(255, 255, 255, 0.1);\n        transition: all 0.2s ease;\n    ";
  _0x2ebab1.appendChild(_0x18a461);
  const _0x2a59ed = document.createElement("img");
  _0x2a59ed.style.cssText = "\n        max-width: calc(95vw - 180px);\n        max-height: calc(95vh - 160px);\n        object-fit: contain;\n        border-radius: 8px;\n        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);\n    ";
  _0x2ebab1.appendChild(_0x2a59ed);
  const _0x5b4eea = document.createElement("button");
  _0x5b4eea.innerHTML = "<i class=\"fa-solid fa-chevron-right\"></i>";
  _0x5b4eea.className = "st-chatu8-btn";
  _0x5b4eea.style.cssText = "\n        width: 50px;\n        height: 50px;\n        border-radius: 50%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 20px;\n        background: rgba(255, 255, 255, 0.1);\n        transition: all 0.2s ease;\n    ";
  _0x2ebab1.appendChild(_0x5b4eea);
  _0x2134bb.appendChild(_0x2ebab1);
  const _0x8a6f64 = document.createElement("div");
  _0x8a6f64.style.cssText = "\n        margin-top: 12px;\n        font-size: 14px;\n        color: var(--SmartThemeBodyColor, #ccc);\n        opacity: 0.8;\n    ";
  _0x2134bb.appendChild(_0x8a6f64);
  const _0x672b0d = document.createElement("div");
  _0x672b0d.style.cssText = "\n        display: flex;\n        gap: 15px;\n        margin-top: 20px;\n        justify-content: center;\n    ";
  const _0x4880b3 = document.createElement("button");
  _0x4880b3.innerHTML = "<i class=\"fa-solid fa-download\"></i> 下载图片";
  _0x4880b3.className = "st-chatu8-btn";
  _0x4880b3.style.cssText = "\n        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x672b0d.appendChild(_0x4880b3);
  const _0x5ba4c3 = document.createElement("button");
  _0x5ba4c3.innerHTML = "<i class=\"fa-solid fa-trash\"></i> 删除图片";
  _0x5ba4c3.className = "st-chatu8-btn";
  _0x5ba4c3.style.cssText = "\n        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x672b0d.appendChild(_0x5ba4c3);
  const _0x5759c9 = document.createElement("button");
  _0x5759c9.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i> 删除其他";
  _0x5759c9.className = "st-chatu8-btn";
  _0x5759c9.style.cssText = "\n        background: linear-gradient(135deg, #fd7e14 0%, #e65c00 100%);\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x672b0d.appendChild(_0x5759c9);
  const _0x178195 = document.createElement("button");
  _0x178195.innerHTML = "<i class=\"fa-solid fa-xmark\"></i> 关闭";
  _0x178195.className = "st-chatu8-btn";
  _0x178195.style.cssText = "\n        padding: 10px 20px;\n        font-size: 14px;\n    ";
  _0x672b0d.appendChild(_0x178195);
  _0x2134bb.appendChild(_0x672b0d);
  _0x5a5535.appendChild(_0x2134bb);
  _0xff2886.appendChild(_0x5a5535);
  const _0x24699c = {};
  const _0xd73d31 = async _0x44f51f => {
    if (_0x44f51f < 0 || _0x44f51f >= _0x39cdaa.length) {
      return;
    }
    _0x418e10 = _0x44f51f;
    const _0x4315cb = _0x39cdaa[_0x418e10];
    _0x8a6f64.textContent = _0x418e10 + 1 + " / " + _0x39cdaa.length;
    _0x18a461.style.opacity = _0x418e10 === 0 ? "0.3" : "1";
    _0x18a461.style.pointerEvents = _0x418e10 === 0 ? "none" : "auto";
    _0x5b4eea.style.opacity = _0x418e10 === _0x39cdaa.length - 1 ? "0.3" : "1";
    _0x5b4eea.style.pointerEvents = _0x418e10 === _0x39cdaa.length - 1 ? "none" : "auto";
    try {
      let _0x504ea0 = _0x24699c[_0x4315cb];
      if (!_0x504ea0) {
        _0x504ea0 = await getConfigImage(_0x4315cb);
        if (_0x504ea0) {
          _0x24699c[_0x4315cb] = _0x504ea0;
        }
      }
      if (_0x504ea0) {
        _0x2a59ed.src = _0x504ea0;
      } else {
        _0x2a59ed.src = "";
        toastr.warning("图片加载失败");
      }
    } catch (_0x2e2e40) {
      console.error("[CharacterPreset] 加载图片失败:", _0x2e2e40);
      _0x2a59ed.src = "";
    }
  };
  const _0x19c7d9 = async () => {
    document.removeEventListener("keydown", _0x5eb994);
    if (_0x377b24) {
      _0x377b24.selectedPhotoIndex = _0x418e10;
      saveSettingsDebounced();
      const _0x1e6d27 = document.getElementById("char_photo_preview");
      const _0xaec686 = document.getElementById("char_photo_placeholder");
      if (_0x39cdaa.length > 0 && _0x418e10 >= 0 && _0x418e10 < _0x39cdaa.length) {
        try {
          const _0x45cea0 = _0x39cdaa[_0x418e10];
          const _0x4ae1cd = _0x24699c[_0x45cea0] || (await getConfigImage(_0x45cea0));
          if (_0x4ae1cd && _0x1e6d27 && _0xaec686) {
            _0x1e6d27.src = _0x4ae1cd;
            _0x1e6d27.style.display = "block";
            _0xaec686.style.display = "none";
            _0x1e6d27.style.cursor = "pointer";
            _0x1e6d27.onclick = () => showImageViewer(_0x39cdaa, _0x418e10);
          }
        } catch (_0x268b23) {
          console.error("[CharacterPreset] 更新预览图失败:", _0x268b23);
        }
      }
    }
    _0xff2886.removeChild(_0x5a5535);
  };
  const _0x5eb994 = _0x7be439 => {
    if (_0x7be439.key === "ArrowLeft" && _0x418e10 > 0) {
      _0xd73d31(_0x418e10 - 1);
    } else if (_0x7be439.key === "ArrowRight" && _0x418e10 < _0x39cdaa.length - 1) {
      _0xd73d31(_0x418e10 + 1);
    } else if (_0x7be439.key === "Escape") {
      _0x19c7d9();
    }
  };
  _0x18a461.addEventListener("click", () => {
    if (_0x418e10 > 0) {
      _0xd73d31(_0x418e10 - 1);
    }
  });
  _0x5b4eea.addEventListener("click", () => {
    if (_0x418e10 < _0x39cdaa.length - 1) {
      _0xd73d31(_0x418e10 + 1);
    }
  });
  _0x178195.addEventListener("click", _0x19c7d9);
  document.addEventListener("keydown", _0x5eb994);
  _0x4880b3.addEventListener("click", () => {
    try {
      const _0x23ebf5 = _0x24699c[_0x39cdaa[_0x418e10]];
      if (!_0x23ebf5) {
        toastr.warning("图片未加载完成");
        return;
      }
      const _0x51e289 = document.createElement("a");
      _0x51e289.href = _0x23ebf5;
      const _0x143d30 = _0x377b24?.nameCN || _0x377b24?.nameEN || _0x305093 || "character";
      const _0xf7c599 = new Date().toISOString().slice(0, 10);
      _0x51e289.download = _0x143d30 + "_" + (_0x418e10 + 1) + "_" + _0xf7c599 + ".png";
      document.body.appendChild(_0x51e289);
      _0x51e289.click();
      document.body.removeChild(_0x51e289);
      toastr.success("图片下载成功");
    } catch (_0x4d7bf1) {
      console.error("[CharacterPreset] 下载图片失败:", _0x4d7bf1);
      toastr.error("下载图片失败: " + _0x4d7bf1.message);
    }
  });
  _0x5ba4c3.addEventListener("click", async () => {
    const _0x3c5f1c = await stylishConfirm("确定要删除这张角色图片吗？此操作不可撤销。");
    if (_0x3c5f1c) {
      try {
        const _0x3a8d5 = _0x39cdaa[_0x418e10];
        if (_0x3a8d5) {
          await deleteConfigImage(_0x3a8d5);
        }
        if (_0x377b24 && _0x377b24.photoImageIds) {
          const _0x5259ff = _0x377b24.photoImageIds.indexOf(_0x3a8d5);
          if (_0x5259ff > -1) {
            _0x377b24.photoImageIds.splice(_0x5259ff, 1);
            saveSettingsDebounced();
          }
        }
        _0x39cdaa.splice(_0x418e10, 1);
        if (_0x39cdaa.length > 0) {
          if (_0x418e10 >= _0x39cdaa.length) {
            _0x418e10 = _0x39cdaa.length - 1;
          }
          _0xd73d31(_0x418e10);
          toastr.success("图片已删除");
        } else {
          _0x19c7d9();
          toastr.success("图片已删除");
          const _0x11c73e = document.getElementById("char_photo_preview");
          const _0x60c97 = document.getElementById("char_photo_placeholder");
          if (_0x11c73e && _0x60c97) {
            _0x11c73e.src = "";
            _0x11c73e.style.display = "none";
            _0x11c73e.onclick = null;
            _0x11c73e.style.cursor = "default";
            _0x60c97.style.display = "flex";
          }
        }
        delete _0x24699c[_0x3a8d5];
      } catch (_0x142b2a) {
        console.error("[CharacterPreset] 删除图片失败:", _0x142b2a);
        toastr.error("删除图片失败: " + _0x142b2a.message);
      }
    }
  });
  _0x5759c9.addEventListener("click", async () => {
    if (_0x39cdaa.length <= 1) {
      toastr.info("没有其他图片可删除");
      return;
    }
    const _0x3a1f3f = await stylishConfirm("确定要删除当前图片之外的 " + (_0x39cdaa.length - 1) + " 张图片吗？此操作不可撤销。");
    if (_0x3a1f3f) {
      try {
        const _0x48cb73 = _0x39cdaa[_0x418e10];
        const _0x106693 = _0x39cdaa.filter((_0x43afa3, _0x37879b) => _0x37879b !== _0x418e10);
        for (const _0x51f84d of _0x106693) {
          if (_0x51f84d) {
            await deleteConfigImage(_0x51f84d);
            delete _0x24699c[_0x51f84d];
          }
        }
        if (_0x377b24 && _0x377b24.photoImageIds) {
          _0x377b24.photoImageIds = [_0x48cb73];
          saveSettingsDebounced();
        }
        _0x39cdaa.length = 0;
        _0x39cdaa.push(_0x48cb73);
        _0x418e10 = 0;
        _0xd73d31(0);
        toastr.success("已删除 " + _0x106693.length + " 张其他图片");
      } catch (_0x3a3abc) {
        console.error("[CharacterPreset] 删除其他图片失败:", _0x3a3abc);
        toastr.error("删除其他图片失败: " + _0x3a3abc.message);
      }
    }
  });
  await _0xd73d31(_0x418e10);
}