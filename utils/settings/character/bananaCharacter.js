import { extension_settings } from "../../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../../script.js";
import { extensionName } from "../../config.js";
import { stylInput, stylishConfirm } from "../../ui_common.js";
import { saveConfigImage, getConfigImage, deleteConfigImage } from "../../configDatabase.js";
export function setupBananaCharacterControls(_0x531721) {
  loadBananaCharacterPresetList();
  _0x531721.find("#banana_char_preset_id").on("change", loadBananaCharacterPreset);
  _0x531721.find("#banana_char_update").on("click", updateBananaCharacterPreset);
  _0x531721.find("#banana_char_save_as").on("click", saveBananaCharacterPresetAs);
  _0x531721.find("#banana_char_delete").on("click", deleteBananaCharacterPreset);
  setupBananaImageUpload("user");
  setupBananaImageUpload("model");
  loadBananaCharacterPreset();
}
export function loadBananaCharacterPresetList() {
  const _0x4428e9 = extension_settings[extensionName];
  const _0x21e9af = document.getElementById("banana_char_preset_id");
  if (!_0x21e9af) {
    return;
  }
  _0x21e9af.innerHTML = "";
  for (const _0x595e29 in _0x4428e9.bananaCharacterPresets) {
    const _0x24843e = document.createElement("option");
    _0x24843e.value = _0x595e29;
    _0x24843e.textContent = _0x595e29;
    _0x21e9af.add(_0x24843e);
  }
  _0x21e9af.value = _0x4428e9.bananaCharacterPresetId;
}
export async function loadBananaCharacterPreset() {
  const _0x517191 = extension_settings[extensionName];
  const _0x4a78e1 = document.getElementById("banana_char_preset_id");
  if (!_0x4a78e1) {
    return;
  }
  const _0x1e5096 = _0x4a78e1.value;
  _0x517191.bananaCharacterPresetId = _0x1e5096;
  const _0x37c4e9 = _0x517191.bananaCharacterPresets[_0x1e5096];
  if (!_0x37c4e9) {
    return;
  }
  let _0x48b1cd = false;
  const _0x1f099d = _0x37c4e9.conversation || {
    user: {
      text: ""
    },
    model: {
      text: ""
    }
  };
  if (_0x1f099d.user?.image && _0x1f099d.user.image.startsWith("data:image")) {
    const _0x263726 = await saveConfigImage(_0x1f099d.user.image);
    _0x1f099d.user.imageId = _0x263726;
    delete _0x1f099d.user.image;
    _0x48b1cd = true;
    console.log("[Character] 迁移 Banana 用户图片:", _0x263726);
  }
  if (_0x1f099d.model?.image && _0x1f099d.model.image.startsWith("data:image")) {
    const _0x344217 = await saveConfigImage(_0x1f099d.model.image);
    _0x1f099d.model.imageId = _0x344217;
    delete _0x1f099d.model.image;
    _0x48b1cd = true;
    console.log("[Character] 迁移 Banana 模型图片:", _0x344217);
  }
  if (_0x48b1cd) {
    saveSettingsDebounced();
  }
  document.getElementById("banana_char_triggers").value = _0x37c4e9.triggers || "";
  document.getElementById("banana_char_user_text").value = _0x1f099d.user?.text || "";
  document.getElementById("banana_char_model_text").value = _0x1f099d.model?.text || "";
  let _0x48327d = "";
  let _0x48d5f9 = "";
  if (_0x1f099d.user?.imageId && _0x1f099d.user.imageId.startsWith("cfgimg_")) {
    _0x48327d = (await getConfigImage(_0x1f099d.user.imageId)) || "";
  }
  if (_0x1f099d.model?.imageId && _0x1f099d.model.imageId.startsWith("cfgimg_")) {
    _0x48d5f9 = (await getConfigImage(_0x1f099d.model.imageId)) || "";
  }
  updateBananaImageUI("user", _0x48327d);
  updateBananaImageUI("model", _0x48d5f9);
  saveSettingsDebounced();
}
function updateBananaCharacterPreset() {
  const _0x409f45 = extension_settings[extensionName];
  const _0x20fbff = _0x409f45.bananaCharacterPresetId;
  if (!_0x20fbff || !_0x409f45.bananaCharacterPresets[_0x20fbff]) {
    alert("没有活动的 Banana 角色预设可保存。请先\"另存为\"一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前 Banana 角色预设 \"" + _0x20fbff + "\" 吗？").then(_0x5c134e => {
    if (_0x5c134e) {
      saveCurrentBananaCharacterData(_0x20fbff);
      alert("Banana 角色预设 \"" + _0x20fbff + "\" 已更新。");
    }
  });
}
function saveBananaCharacterPresetAs() {
  stylInput("请输入新 Banana 角色预设的名称").then(_0x50229b => {
    if (_0x50229b && _0x50229b.trim() !== "") {
      const _0x22996f = extension_settings[extensionName];
      saveCurrentBananaCharacterData(_0x50229b);
      _0x22996f.bananaCharacterPresetId = _0x50229b;
      loadBananaCharacterPresetList();
      alert("Banana 角色预设 \"" + _0x50229b + "\" 已保存。");
    }
  });
}
async function saveCurrentBananaCharacterData(_0x332bd1) {
  const _0x16ddd3 = extension_settings[extensionName];
  const _0x1dd94d = _0x16ddd3.bananaCharacterPresets[_0x332bd1];
  const _0x53b5a4 = document.getElementById("banana_char_user_image").src;
  const _0x47f9aa = document.getElementById("banana_char_model_image").src;
  const _0x94e7da = _0x1dd94d?.conversation?.user?.imageId || "";
  const _0x3fccef = _0x1dd94d?.conversation?.model?.imageId || "";
  let _0x2855b3 = "";
  let _0xdf7df = "";
  if (_0x53b5a4.startsWith("data:image")) {
    if (_0x94e7da && _0x94e7da.startsWith("cfgimg_")) {
      await deleteConfigImage(_0x94e7da).catch(_0x4907eb => console.warn("[Character] 删除旧用户图片失败:", _0x4907eb));
    }
    _0x2855b3 = await saveConfigImage(_0x53b5a4);
    console.log("[Character] Banana 用户图片已保存:", _0x2855b3);
  }
  if (_0x47f9aa.startsWith("data:image")) {
    if (_0x3fccef && _0x3fccef.startsWith("cfgimg_")) {
      await deleteConfigImage(_0x3fccef).catch(_0x3d6038 => console.warn("[Character] 删除旧模型图片失败:", _0x3d6038));
    }
    _0xdf7df = await saveConfigImage(_0x47f9aa);
    console.log("[Character] Banana 模型图片已保存:", _0xdf7df);
  }
  const _0x3fbef0 = {
    triggers: document.getElementById("banana_char_triggers").value,
    conversation: {
      user: {
        text: document.getElementById("banana_char_user_text").value,
        imageId: _0x2855b3
      },
      model: {
        text: document.getElementById("banana_char_model_text").value,
        imageId: _0xdf7df
      }
    }
  };
  _0x16ddd3.bananaCharacterPresets[_0x332bd1] = _0x3fbef0;
  saveSettingsDebounced();
}
async function deleteBananaCharacterPreset() {
  const _0x2a07e0 = extension_settings[extensionName];
  const _0x4283b9 = document.getElementById("banana_char_preset_id")?.value;
  if (Object.keys(_0x2a07e0.bananaCharacterPresets).length <= 1) {
    alert("不能删除最后一个预设。");
    return;
  }
  const _0xac76e3 = await stylishConfirm("是否确定删除该 Banana 角色预设 \"" + _0x4283b9 + "\"");
  if (_0xac76e3) {
    const _0x5c0444 = _0x2a07e0.bananaCharacterPresets[_0x4283b9];
    if (_0x5c0444?.conversation?.user?.imageId && _0x5c0444.conversation.user.imageId.startsWith("cfgimg_")) {
      await deleteConfigImage(_0x5c0444.conversation.user.imageId).catch(_0x57e11d => console.warn("[Character] 删除用户图片失败:", _0x57e11d));
    }
    if (_0x5c0444?.conversation?.model?.imageId && _0x5c0444.conversation.model.imageId.startsWith("cfgimg_")) {
      await deleteConfigImage(_0x5c0444.conversation.model.imageId).catch(_0x3f4fa2 => console.warn("[Character] 删除模型图片失败:", _0x3f4fa2));
    }
    delete _0x2a07e0.bananaCharacterPresets[_0x4283b9];
    _0x2a07e0.bananaCharacterPresetId = Object.keys(_0x2a07e0.bananaCharacterPresets)[0];
    loadBananaCharacterPresetList();
    await loadBananaCharacterPreset();
    saveSettingsDebounced();
  }
}
const setupBananaImageUpload = _0x459952 => {
  const _0x54dd25 = document.getElementById("banana_char_" + _0x459952 + "_image_container");
  const _0x31c01e = document.getElementById("banana_char_" + _0x459952 + "_image");
  const _0x219a51 = _0x54dd25.querySelector(".st-chatu8-image-placeholder");
  const _0x2457d5 = document.getElementById("banana_char_" + _0x459952 + "_image_remove");
  const _0x9fd5f9 = document.getElementById("banana_char_" + _0x459952 + "_image_input");
  if (!_0x54dd25 || !_0x31c01e || !_0x219a51 || !_0x2457d5 || !_0x9fd5f9) {
    return;
  }
  _0x54dd25.addEventListener("click", _0xc5b7e0 => {
    if (_0xc5b7e0.target !== _0x2457d5 && !_0x2457d5.contains(_0xc5b7e0.target)) {
      _0x9fd5f9.click();
    }
  });
  _0x9fd5f9.addEventListener("change", () => {
    if (_0x9fd5f9.files && _0x9fd5f9.files[0]) {
      const _0x357b6b = new FileReader();
      _0x357b6b.onload = _0x36d363 => {
        _0x31c01e.src = _0x36d363.target.result;
        _0x31c01e.style.display = "block";
        _0x219a51.style.display = "none";
        _0x2457d5.style.display = "block";
      };
      _0x357b6b.readAsDataURL(_0x9fd5f9.files[0]);
    }
  });
  _0x2457d5.addEventListener("click", () => {
    _0x31c01e.src = "";
    _0x31c01e.style.display = "none";
    _0x219a51.style.display = "block";
    _0x2457d5.style.display = "none";
    _0x9fd5f9.value = "";
  });
};
const updateBananaImageUI = (_0x3c8b78, _0x1ddf8c) => {
  const _0x1ebae2 = document.getElementById("banana_char_" + _0x3c8b78 + "_image");
  const _0x543154 = document.getElementById("banana_char_" + _0x3c8b78 + "_image_container");
  if (!_0x1ebae2 || !_0x543154) {
    return;
  }
  const _0x4f678f = _0x543154.querySelector(".st-chatu8-image-placeholder");
  const _0x1a7b08 = document.getElementById("banana_char_" + _0x3c8b78 + "_image_remove");
  if (_0x1ddf8c) {
    _0x1ebae2.src = _0x1ddf8c;
    _0x1ebae2.style.display = "block";
    _0x4f678f.style.display = "none";
    _0x1a7b08.style.display = "block";
  } else {
    _0x1ebae2.src = "";
    _0x1ebae2.style.display = "none";
    _0x4f678f.style.display = "block";
    _0x1a7b08.style.display = "none";
  }
};