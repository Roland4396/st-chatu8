import { saveSettingsDebounced } from "../../../../../../script.js";
import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
import { stylishConfirm, stylInput } from "../ui_common.js";
import { saveConfigImage, getConfigImage, deleteConfigImage } from "../configDatabase.js";
import { getRequestHeaders } from "../utils.js";
const isImageId = _0x24807a => _0x24807a && typeof _0x24807a === "string" && _0x24807a.startsWith("cfgimg_");
const isBase64Image = _0x92fd23 => _0x92fd23 && typeof _0x92fd23 === "string" && _0x92fd23.startsWith("data:image");
async function getImageData(_0x4b5d30, _0x304de3) {
  const _0x57003b = _0x4b5d30?.[_0x304de3];
  if (!_0x57003b) {
    return "";
  }
  if (_0x57003b.imageId && isImageId(_0x57003b.imageId)) {
    const _0xa5441d = await getConfigImage(_0x57003b.imageId);
    return _0xa5441d || "";
  }
  if (_0x57003b.image && isBase64Image(_0x57003b.image)) {
    return _0x57003b.image;
  }
  return "";
}
async function saveImageAndGetId(_0x50fb16, _0x32bc55 = "") {
  if (isBase64Image(_0x50fb16)) {
    if (_0x32bc55 && isImageId(_0x32bc55)) {
      await deleteConfigImage(_0x32bc55).catch(_0x254ab3 => console.warn("[BananaUI] 删除旧图片失败:", _0x254ab3));
    }
    const _0x50559c = await saveConfigImage(_0x50fb16);
    console.log("[BananaUI] 图片已保存到数据库:", _0x50559c);
    return _0x50559c;
  }
  return "";
}
async function deletePresetImages(_0x3a5757) {
  if (!_0x3a5757?.conversation) {
    return;
  }
  for (const _0xdf9929 of _0x3a5757.conversation) {
    if (_0xdf9929?.user?.imageId && isImageId(_0xdf9929.user.imageId)) {
      await deleteConfigImage(_0xdf9929.user.imageId).catch(_0x215ed9 => console.warn("[BananaUI] 删除图片失败:", _0x215ed9));
    }
    if (_0xdf9929?.model?.imageId && isImageId(_0xdf9929.model.imageId)) {
      await deleteConfigImage(_0xdf9929.model.imageId).catch(_0x252532 => console.warn("[BananaUI] 删除图片失败:", _0x252532));
    }
  }
}
async function migratePresetIfNeeded(_0xa1935f) {
  if (!_0xa1935f?.conversation) {
    return false;
  }
  let _0x3a757d = false;
  for (const _0x8b2d30 of _0xa1935f.conversation) {
    if (_0x8b2d30?.user?.image && isBase64Image(_0x8b2d30.user.image)) {
      const _0x5d808a = await saveConfigImage(_0x8b2d30.user.image);
      _0x8b2d30.user.imageId = _0x5d808a;
      delete _0x8b2d30.user.image;
      _0x3a757d = true;
      console.log("[BananaUI] 迁移用户图片:", _0x5d808a);
    }
    if (_0x8b2d30?.model?.image && isBase64Image(_0x8b2d30.model.image)) {
      const _0x723ab2 = await saveConfigImage(_0x8b2d30.model.image);
      _0x8b2d30.model.imageId = _0x723ab2;
      delete _0x8b2d30.model.image;
      _0x3a757d = true;
      console.log("[BananaUI] 迁移模型图片:", _0x723ab2);
    }
  }
  return _0x3a757d;
}
const setupImageUpload = (_0x59f695, _0x324b7e) => {
  const _0x3cb718 = _0x324b7e + 1;
  const _0x2ce0b1 = document.getElementById("st-chatu8-banana-" + _0x59f695 + "-image-container-" + _0x3cb718);
  const _0x5e8d41 = document.getElementById("st-chatu8-banana-" + _0x59f695 + "-image-" + _0x3cb718);
  const _0x53205b = _0x2ce0b1.querySelector(".st-chatu8-image-placeholder");
  const _0x4fcbad = document.getElementById("st-chatu8-banana-" + _0x59f695 + "-image-remove-" + _0x3cb718);
  const _0x8a259a = document.getElementById("st-chatu8-banana-" + _0x59f695 + "-image-input-" + _0x3cb718);
  if (!_0x2ce0b1 || !_0x5e8d41 || !_0x53205b || !_0x4fcbad || !_0x8a259a) {
    return;
  }
  _0x2ce0b1.addEventListener("click", _0x40cb09 => {
    if (_0x40cb09.target !== _0x4fcbad && !_0x4fcbad.contains(_0x40cb09.target)) {
      _0x8a259a.click();
    }
  });
  _0x8a259a.addEventListener("change", () => {
    if (_0x8a259a.files && _0x8a259a.files[0]) {
      const _0x232720 = new FileReader();
      _0x232720.onload = _0x2c629b => {
        _0x5e8d41.src = _0x2c629b.target.result;
        _0x5e8d41.style.display = "block";
        _0x53205b.style.display = "none";
        _0x4fcbad.style.display = "block";
      };
      _0x232720.readAsDataURL(_0x8a259a.files[0]);
    }
  });
  _0x4fcbad.addEventListener("click", () => {
    _0x5e8d41.src = "";
    _0x5e8d41.style.display = "none";
    _0x53205b.style.display = "block";
    _0x4fcbad.style.display = "none";
    _0x8a259a.value = "";
  });
};
const updateImageUI = (_0x25d7da, _0x430f8f, _0x38fd02) => {
  const _0x11f9d7 = _0x430f8f + 1;
  const _0x1fc643 = document.getElementById("st-chatu8-banana-" + _0x25d7da + "-image-" + _0x11f9d7);
  const _0x43668b = document.getElementById("st-chatu8-banana-" + _0x25d7da + "-image-container-" + _0x11f9d7);
  if (!_0x1fc643 || !_0x43668b) {
    return;
  }
  const _0x169bfb = _0x43668b.querySelector(".st-chatu8-image-placeholder");
  const _0x6fcd7f = document.getElementById("st-chatu8-banana-" + _0x25d7da + "-image-remove-" + _0x11f9d7);
  if (_0x38fd02) {
    _0x1fc643.src = _0x38fd02;
    _0x1fc643.style.display = "block";
    _0x169bfb.style.display = "none";
    _0x6fcd7f.style.display = "block";
  } else {
    _0x1fc643.src = "";
    _0x1fc643.style.display = "none";
    _0x169bfb.style.display = "block";
    _0x6fcd7f.style.display = "none";
  }
};
export function initBananaUI(_0x45ade5) {
  const _0x5dc7f1 = () => extension_settings[extensionName].banana;
  const _0x436c1e = document.getElementById("st-chatu8-banana-conversation-preset-id");
  const _0x3ab86d = document.getElementById("st-chatu8-banana-conversation-save");
  const _0x2c2eb5 = document.getElementById("st-chatu8-banana-conversation-save-as");
  const _0x3a2eac = document.getElementById("st-chatu8-banana-conversation-delete");
  const _0xfd4106 = document.getElementById("st-chatu8-banana-conversation-import");
  const _0x57987e = document.getElementById("st-chatu8-banana-conversation-export");
  const _0x219540 = document.getElementById("st-chatu8-banana-fixed-prompt");
  const _0x3a4229 = document.getElementById("st-chatu8-banana-postfix-prompt");
  const _0x33a430 = document.getElementById("st-chatu8-banana-model-select");
  const _0x2a5beb = document.getElementById("st-chatu8-banana-multimodal-section");
  const _0x27d84 = document.getElementById("st-chatu8-banana-api-url");
  const _0x51af7e = document.getElementById("st-chatu8-banana-api-key");
  const _0x2b49f5 = document.getElementById("st-chatu8-banana-aspect-ratio");
  const _0x1b5616 = document.getElementById("st-chatu8-banana-edit-preset");
  const _0x2022b8 = document.getElementById("st-chatu8-banana-video-model-select");
  const _0x4d3784 = document.getElementById("st-chatu8-banana-video-preset");
  const _0x37ff31 = () => {
    const _0x5189f4 = _0x5dc7f1();
    const _0x48b35a = _0x5189f4.conversationPresets || {};
    const _0x12be94 = Object.keys(_0x48b35a);
    const _0x1b6410 = _0x5189f4.editPresetId || "默认";
    if (!_0x1b5616) {
      return;
    }
    _0x1b5616.innerHTML = "";
    _0x12be94.forEach(_0x13189c => {
      const _0xa550ad = document.createElement("option");
      _0xa550ad.value = _0x13189c;
      _0xa550ad.textContent = _0x13189c;
      if (_0x13189c === _0x1b6410) {
        _0xa550ad.selected = true;
      }
      _0x1b5616.appendChild(_0xa550ad);
    });
  };
  const _0x1b6d33 = () => {
    const _0x10ab35 = _0x5dc7f1();
    const _0x4a4917 = _0x10ab35.conversationPresets || {};
    const _0x2810bd = Object.keys(_0x4a4917);
    const _0x48e54e = _0x10ab35.videoPresetId || "默认";
    if (!_0x4d3784) {
      return;
    }
    _0x4d3784.innerHTML = "";
    _0x2810bd.forEach(_0x2d554d => {
      const _0x5c3fc7 = document.createElement("option");
      _0x5c3fc7.value = _0x2d554d;
      _0x5c3fc7.textContent = _0x2d554d;
      if (_0x2d554d === _0x48e54e) {
        _0x5c3fc7.selected = true;
      }
      _0x4d3784.appendChild(_0x5c3fc7);
    });
  };
  const _0x275003 = () => {
    const _0x495f47 = _0x5dc7f1();
    const _0x556d77 = _0x495f47.conversationPresets || {};
    const _0x14e8e3 = Object.keys(_0x556d77);
    const _0x111398 = _0x495f47.conversationPresetId;
    _0x436c1e.innerHTML = "";
    _0x14e8e3.forEach(_0x5d4945 => {
      const _0x136750 = document.createElement("option");
      _0x136750.value = _0x5d4945;
      _0x136750.textContent = _0x5d4945;
      if (_0x5d4945 === _0x111398) {
        _0x136750.selected = true;
      }
      _0x436c1e.appendChild(_0x136750);
    });
  };
  const _0x10b118 = async _0x3937db => {
    const _0x5c92f8 = _0x5dc7f1();
    const _0x536537 = _0x5c92f8.conversationPresets[_0x3937db];
    if (!_0x536537) {
      return;
    }
    const _0x3b9d1f = await migratePresetIfNeeded(_0x536537);
    if (_0x3b9d1f) {
      saveSettingsDebounced();
      console.log("[BananaUI] 预设已迁移到新格式");
    }
    _0x219540.value = _0x536537.fixedPrompt || "";
    _0x3a4229.value = _0x536537.postfixPrompt || "";
    for (let _0x27c954 = 0; _0x27c954 < 3; _0x27c954++) {
      const _0xc54a26 = document.getElementById("st-chatu8-banana-user-text-" + (_0x27c954 + 1));
      const _0x4e8557 = document.getElementById("st-chatu8-banana-model-text-" + (_0x27c954 + 1));
      const _0x2664ce = _0x536537.conversation?.[_0x27c954] || {
        user: {
          text: ""
        },
        model: {
          text: ""
        }
      };
      if (_0xc54a26) {
        _0xc54a26.value = _0x2664ce.user?.text || "";
      }
      if (_0x4e8557) {
        _0x4e8557.value = _0x2664ce.model?.text || "";
      }
      const _0xd49cae = await getImageData(_0x2664ce, "user");
      const _0x3af833 = await getImageData(_0x2664ce, "model");
      updateImageUI("user", _0x27c954, _0xd49cae);
      updateImageUI("model", _0x27c954, _0x3af833);
    }
    _0x5c92f8.conversationPresetId = _0x3937db;
  };
  const _0x4090ec = () => {
    if (_0x33a430 && _0x2a5beb) {
      const _0x22e8da = _0x33a430.value;
      const _0x46722f = _0x22e8da.startsWith("imagen");
      _0x2a5beb.style.display = "block";
      const _0x5b2495 = _0x2a5beb.querySelector("h3");
      const _0x526221 = _0x2a5beb.querySelectorAll(".st-chatu8-banana-conversation-group");
      const _0x3c4ec4 = document.querySelector("label[for=\"st-chatu8-banana-conversation-preset-id\"]");
      if (_0x46722f) {
        if (_0x5b2495) {
          _0x5b2495.textContent = "提示词预设 (Imagen)";
        }
        if (_0x3c4ec4) {
          _0x3c4ec4.textContent = "提示词预设";
        }
        _0x526221.forEach(_0x500bfb => _0x500bfb.style.display = "none");
      } else {
        if (_0x5b2495) {
          _0x5b2495.textContent = "多轮对话 (多模态)";
        }
        if (_0x3c4ec4) {
          _0x3c4ec4.textContent = "对话预设";
        }
        _0x526221.forEach(_0x3d7883 => _0x3d7883.style.display = "block");
      }
    }
  };
  _0x436c1e.addEventListener("change", async () => {
    await _0x10b118(_0x436c1e.value);
    toastr.success("已加载预设: \"" + _0x436c1e.value + "\"");
  });
  _0x3ab86d.addEventListener("click", async () => {
    const _0x403a62 = _0x5dc7f1();
    const _0x2d681f = _0x403a62.conversationPresetId;
    const _0x40e9c3 = _0x403a62.conversationPresets[_0x2d681f];
    const _0x25cfd9 = [];
    for (let _0x179ded = 0; _0x179ded < 3; _0x179ded++) {
      const _0x260440 = document.getElementById("st-chatu8-banana-user-image-" + (_0x179ded + 1)).src;
      const _0x4f1af0 = document.getElementById("st-chatu8-banana-model-image-" + (_0x179ded + 1)).src;
      const _0x54557a = _0x40e9c3?.conversation?.[_0x179ded];
      const _0x5220c3 = _0x54557a?.user?.imageId || "";
      const _0x24edad = _0x54557a?.model?.imageId || "";
      const _0x343e28 = await saveImageAndGetId(_0x260440, _0x5220c3);
      const _0x3fa6a1 = await saveImageAndGetId(_0x4f1af0, _0x24edad);
      _0x25cfd9.push({
        user: {
          text: document.getElementById("st-chatu8-banana-user-text-" + (_0x179ded + 1)).value,
          imageId: _0x343e28
        },
        model: {
          text: document.getElementById("st-chatu8-banana-model-text-" + (_0x179ded + 1)).value,
          imageId: _0x3fa6a1
        }
      });
    }
    const _0x63c84b = {
      fixedPrompt: _0x219540.value,
      postfixPrompt: _0x3a4229.value,
      conversation: _0x25cfd9
    };
    _0x403a62.conversationPresets[_0x2d681f] = _0x63c84b;
    saveSettingsDebounced();
    toastr.success("预设 \"" + _0x2d681f + "\" 已保存!");
  });
  _0x2c2eb5.addEventListener("click", async () => {
    const _0x3440ae = await stylInput("请输入新的预设名称:");
    if (!_0x3440ae || _0x3440ae.trim() === "") {
      toastr.info("操作已取消。");
      return;
    }
    const _0x5d831 = _0x5dc7f1();
    if (_0x5d831.conversationPresets[_0x3440ae]) {
      const _0x28cf4b = await stylishConfirm("预设 \"" + _0x3440ae + "\" 已存在。要覆盖它吗?");
      if (!_0x28cf4b) {
        toastr.info("操作已取消。");
        return;
      }
      await deletePresetImages(_0x5d831.conversationPresets[_0x3440ae]);
    }
    const _0x52fb18 = [];
    for (let _0x84aa60 = 0; _0x84aa60 < 3; _0x84aa60++) {
      const _0x2093ba = document.getElementById("st-chatu8-banana-user-image-" + (_0x84aa60 + 1)).src;
      const _0x1b0f4f = document.getElementById("st-chatu8-banana-model-image-" + (_0x84aa60 + 1)).src;
      const _0x868b63 = await saveImageAndGetId(_0x2093ba);
      const _0x5e0622 = await saveImageAndGetId(_0x1b0f4f);
      _0x52fb18.push({
        user: {
          text: document.getElementById("st-chatu8-banana-user-text-" + (_0x84aa60 + 1)).value,
          imageId: _0x868b63
        },
        model: {
          text: document.getElementById("st-chatu8-banana-model-text-" + (_0x84aa60 + 1)).value,
          imageId: _0x5e0622
        }
      });
    }
    const _0x1eac8c = {
      fixedPrompt: _0x219540.value,
      postfixPrompt: _0x3a4229.value,
      conversation: _0x52fb18
    };
    _0x5d831.conversationPresets[_0x3440ae] = _0x1eac8c;
    _0x5d831.conversationPresetId = _0x3440ae;
    _0x275003();
    _0x37ff31();
    _0x1b6d33();
    saveSettingsDebounced();
    toastr.success("新预设 \"" + _0x3440ae + "\" 已创建并加载!");
  });
  _0x3a2eac.addEventListener("click", async () => {
    const _0x369828 = _0x5dc7f1();
    const _0xfaf78d = _0x369828.conversationPresetId;
    if (Object.keys(_0x369828.conversationPresets).length <= 1) {
      toastr.warning("不能删除最后一个预设。");
      return;
    }
    const _0x2b239c = await stylishConfirm("确定要删除预设 \"" + _0xfaf78d + "\" 吗? 此操作不可撤销。");
    if (!_0x2b239c) {
      toastr.info("操作已取消。");
      return;
    }
    await deletePresetImages(_0x369828.conversationPresets[_0xfaf78d]);
    delete _0x369828.conversationPresets[_0xfaf78d];
    const _0x3de244 = Object.keys(_0x369828.conversationPresets)[0];
    _0x369828.conversationPresetId = _0x3de244;
    _0x275003();
    _0x37ff31();
    _0x1b6d33();
    await _0x10b118(_0x3de244);
    saveSettingsDebounced();
    toastr.success("预设 \"" + _0xfaf78d + "\" 已删除。");
  });
  _0x57987e.addEventListener("click", async () => {
    const _0x8fc178 = _0x5dc7f1();
    const _0x30b0e8 = _0x8fc178.conversationPresetId;
    if (!_0x30b0e8) {
      toastr.warning("没有选中的预设可供导出。");
      return;
    }
    const _0x25514b = _0x8fc178.conversationPresets[_0x30b0e8];
    if (!_0x25514b) {
      toastr.error("找不到预设 \"" + _0x30b0e8 + "\" 的数据。");
      return;
    }
    const _0x4da5b7 = {
      fixedPrompt: _0x25514b.fixedPrompt,
      postfixPrompt: _0x25514b.postfixPrompt,
      conversation: []
    };
    const _0x58ae6e = _0x4da5b7;
    for (const _0x2d4000 of _0x25514b.conversation || []) {
      const _0x489d7d = await getImageData(_0x2d4000, "user");
      const _0x364f10 = await getImageData(_0x2d4000, "model");
      const _0x27d2c9 = {
        text: _0x2d4000?.user?.text || "",
        image: _0x489d7d
      };
      const _0xadf7d2 = {
        text: _0x2d4000?.model?.text || "",
        image: _0x364f10
      };
      const _0xc4d706 = {
        user: _0x27d2c9,
        model: _0xadf7d2
      };
      _0x58ae6e.conversation.push(_0xc4d706);
    }
    const _0x107e68 = JSON.stringify(_0x58ae6e, null, 2);
    const _0x502ba1 = new Blob([_0x107e68], {
      type: "application/json"
    });
    const _0x24d9e5 = URL.createObjectURL(_0x502ba1);
    const _0x45d742 = document.createElement("a");
    _0x45d742.href = _0x24d9e5;
    _0x45d742.download = _0x30b0e8 + ".json";
    document.body.appendChild(_0x45d742);
    _0x45d742.click();
    document.body.removeChild(_0x45d742);
    URL.revokeObjectURL(_0x24d9e5);
    toastr.success("预设 \"" + _0x30b0e8 + "\" 已导出。");
  });
  _0xfd4106.addEventListener("click", () => {
    const _0x313b29 = document.createElement("input");
    _0x313b29.type = "file";
    _0x313b29.accept = "application/json,.json";
    _0x313b29.onchange = async _0x28e428 => {
      const _0x3c8133 = _0x28e428.target.files[0];
      if (!_0x3c8133) {
        return;
      }
      const _0x46681f = new FileReader();
      _0x46681f.onload = async _0x32f705 => {
        try {
          const _0x23747f = JSON.parse(_0x32f705.target.result);
          if (typeof _0x23747f.fixedPrompt === "undefined" || typeof _0x23747f.conversation === "undefined") {
            toastr.error("导入失败：文件格式不正确。");
            return;
          }
          let _0x6df98 = _0x3c8133.name.replace(/\.json$/, "");
          const _0x36e42e = _0x5dc7f1();
          if (_0x36e42e.conversationPresets[_0x6df98]) {
            const _0x43a171 = await stylishConfirm("预设 \"" + _0x6df98 + "\" 已存在。要覆盖它吗?");
            if (!_0x43a171) {
              _0x6df98 = await stylInput("请输入新的预设名称:", _0x6df98 + "_imported");
              if (!_0x6df98 || _0x6df98.trim() === "") {
                toastr.info("操作已取消。");
                return;
              }
            } else {
              await deletePresetImages(_0x36e42e.conversationPresets[_0x6df98]);
            }
          }
          const _0x2b097c = {
            fixedPrompt: _0x23747f.fixedPrompt,
            postfixPrompt: _0x23747f.postfixPrompt,
            conversation: []
          };
          const _0x4b4e42 = _0x2b097c;
          for (const _0x3bef3a of _0x23747f.conversation || []) {
            const _0x1eb68c = await saveImageAndGetId(_0x3bef3a?.user?.image || "");
            const _0x4ac06e = await saveImageAndGetId(_0x3bef3a?.model?.image || "");
            const _0x34655e = {
              text: _0x3bef3a?.user?.text || "",
              imageId: _0x1eb68c
            };
            const _0x136911 = {
              text: _0x3bef3a?.model?.text || "",
              imageId: _0x4ac06e
            };
            const _0x357b51 = {
              user: _0x34655e,
              model: _0x136911
            };
            _0x4b4e42.conversation.push(_0x357b51);
          }
          _0x36e42e.conversationPresets[_0x6df98] = _0x4b4e42;
          _0x36e42e.conversationPresetId = _0x6df98;
          _0x275003();
          _0x37ff31();
          _0x1b6d33();
          await _0x10b118(_0x6df98);
          saveSettingsDebounced();
          toastr.success("预设 \"" + _0x6df98 + "\" 已成功导入并加载！");
        } catch (_0x202b1b) {
          toastr.error("导入失败: " + _0x202b1b.message);
          console.error("Error importing preset:", _0x202b1b);
        }
      };
      _0x46681f.readAsText(_0x3c8133);
    };
    _0x313b29.click();
  });
  _0x27d84.addEventListener("input", () => {
    _0x5dc7f1().apiUrl = _0x27d84.value;
    saveSettingsDebounced();
  });
  _0x51af7e.addEventListener("input", () => {
    _0x5dc7f1().apiKey = _0x51af7e.value;
    saveSettingsDebounced();
  });
  _0x33a430.addEventListener("change", () => {
    _0x5dc7f1().model = _0x33a430.value;
    saveSettingsDebounced();
    _0x4090ec();
  });
  if (_0x2022b8) {
    _0x2022b8.addEventListener("change", () => {
      _0x5dc7f1().videoModel = _0x2022b8.value;
      saveSettingsDebounced();
    });
  }
  _0x2b49f5.addEventListener("change", () => {
    _0x5dc7f1().aspectRatio = _0x2b49f5.value;
    saveSettingsDebounced();
  });
  if (_0x1b5616) {
    _0x1b5616.addEventListener("change", () => {
      _0x5dc7f1().editPresetId = _0x1b5616.value;
      saveSettingsDebounced();
      toastr.success("修图预设已设置为: \"" + _0x1b5616.value + "\"");
    });
  }
  if (_0x4d3784) {
    _0x4d3784.addEventListener("change", () => {
      _0x5dc7f1().videoPresetId = _0x4d3784.value;
      saveSettingsDebounced();
      toastr.success("视频预设已设置为: \"" + _0x4d3784.value + "\"");
    });
  }
  const _0x52c5a3 = document.getElementById("st-chatu8-banana-fetch-models");
  if (_0x52c5a3) {
    _0x52c5a3.addEventListener("click", async () => {
      const _0x35598b = _0x5dc7f1();
      const _0x30e4e7 = _0x35598b.apiUrl;
      const _0x25e9bf = _0x35598b.apiKey;
      if (!_0x30e4e7) {
        toastr.warning("请先填写 API 连接地址");
        return;
      }
      try {
        _0x52c5a3.disabled = true;
        _0x52c5a3.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\"></i>";
        let _0x1a8e04 = _0x30e4e7.replace(/\/$/, "");
        let _0x3251f0;
        if (_0x1a8e04.endsWith("/v1") || _0x1a8e04.includes("/v1/")) {
          _0x3251f0 = _0x1a8e04 + "/models";
        } else {
          _0x3251f0 = _0x1a8e04 + "/v1/models";
        }
        const _0x2d4b8f = extension_settings[extensionName].client;
        let _0x8f1b5f;
        if (_0x2d4b8f === "jiuguan") {
          let _0xd719e7 = _0x1a8e04;
          if (!_0xd719e7.endsWith("/v1") && !_0xd719e7.includes("/v1/")) {
            _0xd719e7 = _0xd719e7 + "/v1";
          }
          _0xd719e7 = _0xd719e7.replace(/\/v1\/$/, "/v1");
          _0x8f1b5f = await fetch("/api/backends/chat-completions/status", {
            method: "POST",
            headers: getRequestHeaders(window.token),
            body: JSON.stringify({
              chat_completion_source: "custom",
              custom_url: _0xd719e7,
              custom_include_headers: "Authorization: \"Bearer " + (_0x25e9bf || "") + "\""
            })
          });
          console.log("[BananaUI] 使用酒馆代理获取模型列表, URL:", _0xd719e7);
        } else {
          _0x8f1b5f = await fetch(_0x3251f0, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + (_0x25e9bf || "")
            }
          });
          console.log("[BananaUI] 直接请求获取模型列表");
        }
        if (!_0x8f1b5f.ok) {
          throw new Error("获取模型失败: " + _0x8f1b5f.status);
        }
        const _0x2a1a94 = await _0x8f1b5f.json();
        console.log("[BananaUI] 获取到的模型响应:", _0x2a1a94);
        let _0x342d3a = [];
        if (Array.isArray(_0x2a1a94.data)) {
          _0x342d3a = _0x2a1a94.data;
        } else if (Array.isArray(_0x2a1a94.models)) {
          _0x342d3a = _0x2a1a94.models;
        } else if (Array.isArray(_0x2a1a94)) {
          _0x342d3a = _0x2a1a94;
        }
        _0x342d3a = _0x342d3a.map(_0x3022f1 => {
          if (typeof _0x3022f1 === "string") {
            const _0x33f52a = {
              id: _0x3022f1
            };
            return _0x33f52a;
          }
          return {
            id: _0x3022f1.id || _0x3022f1.name || _0x3022f1.model || String(_0x3022f1)
          };
        }).filter(_0x15f15c => _0x15f15c.id);
        console.log("[BananaUI] 解析后的模型列表:", _0x342d3a);
        if (_0x342d3a.length === 0) {
          toastr.info("没有获取到可用模型");
          return;
        }
        const _0x3ac148 = _0x33a430.value;
        const _0xff639b = _0x2022b8 ? _0x2022b8.value : "";
        _0x342d3a.sort((_0x582fb1, _0x36957c) => _0x582fb1.id.localeCompare(_0x36957c.id));
        _0x33a430.innerHTML = "";
        _0x342d3a.forEach(_0x5a2394 => {
          const _0x2f1842 = document.createElement("option");
          _0x2f1842.value = _0x5a2394.id;
          _0x2f1842.textContent = _0x5a2394.id;
          _0x33a430.appendChild(_0x2f1842);
        });
        if (_0x2022b8) {
          _0x2022b8.innerHTML = "";
          _0x342d3a.forEach(_0x4044e0 => {
            const _0x48c780 = document.createElement("option");
            _0x48c780.value = _0x4044e0.id;
            _0x48c780.textContent = _0x4044e0.id;
            _0x2022b8.appendChild(_0x48c780);
          });
        }
        if (_0x342d3a.some(_0x5af661 => _0x5af661.id === _0x3ac148)) {
          _0x33a430.value = _0x3ac148;
        } else {
          _0x33a430.value = _0x342d3a[0].id;
          _0x5dc7f1().model = _0x342d3a[0].id;
          saveSettingsDebounced();
        }
        if (_0x2022b8) {
          if (_0x342d3a.some(_0x32d710 => _0x32d710.id === _0xff639b)) {
            _0x2022b8.value = _0xff639b;
          } else {
            _0x2022b8.value = _0x342d3a[0].id;
            _0x5dc7f1().videoModel = _0x342d3a[0].id;
            saveSettingsDebounced();
          }
        }
        toastr.success("成功获取 " + _0x342d3a.length + " 个模型");
        _0x4090ec();
      } catch (_0x3d422b) {
        console.error("[BananaUI] 获取模型失败:", _0x3d422b);
        toastr.error("获取模型失败: " + _0x3d422b.message);
      } finally {
        _0x52c5a3.disabled = false;
        _0x52c5a3.innerHTML = "<i class=\"fa-solid fa-rotate\"></i>";
      }
    });
  }
  for (let _0x51d5c4 = 0; _0x51d5c4 < 3; _0x51d5c4++) {
    setupImageUpload("user", _0x51d5c4);
    setupImageUpload("model", _0x51d5c4);
  }
  const _0x469c2f = _0x5dc7f1();
  _0x27d84.value = _0x469c2f.apiUrl || "";
  _0x51af7e.value = _0x469c2f.apiKey || "";
  const _0x1cafa9 = _0x469c2f.model || "gemini-2.5-flash-image";
  const _0x386a47 = Array.from(_0x33a430.options).find(_0x6201e8 => _0x6201e8.value === _0x1cafa9);
  if (!_0x386a47 && _0x1cafa9) {
    const _0x239a82 = document.createElement("option");
    _0x239a82.value = _0x1cafa9;
    _0x239a82.textContent = _0x1cafa9;
    _0x33a430.appendChild(_0x239a82);
  }
  _0x33a430.value = _0x1cafa9;
  _0x2b49f5.value = _0x469c2f.aspectRatio || "1:1";
  const _0x3d1bc5 = _0x469c2f.videoModel || "gemini-2.5-flash-image";
  if (_0x2022b8) {
    const _0x3f23b4 = Array.from(_0x2022b8.options).find(_0x4c0a95 => _0x4c0a95.value === _0x3d1bc5);
    if (!_0x3f23b4 && _0x3d1bc5) {
      const _0x23c6af = document.createElement("option");
      _0x23c6af.value = _0x3d1bc5;
      _0x23c6af.textContent = _0x3d1bc5;
      _0x2022b8.appendChild(_0x23c6af);
    }
    _0x2022b8.value = _0x3d1bc5;
  }
  _0x275003();
  _0x37ff31();
  _0x1b6d33();
  _0x10b118(_0x469c2f.conversationPresetId);
  _0x4090ec();
}