import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { saveConfigImage, getConfigImage, deleteConfigImage } from "../configDatabase.js";
export function ensureCharRefGroups() {
  const _0x4956f8 = extension_settings[extensionName];
  if (!_0x4956f8.charRefGroups || typeof _0x4956f8.charRefGroups !== "object" || Array.isArray(_0x4956f8.charRefGroups)) {
    if (_0x4956f8.charRefGroups) {
      console.error("[CharRef] Corrupted charRefGroups data detected, resetting to default:", _0x4956f8.charRefGroups);
    }
    _0x4956f8.charRefGroups = {
      默认组: {
        references: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };
    console.log("[CharRef] Initialized charRefGroups with default group");
  }
  for (const _0x2da700 in _0x4956f8.charRefGroups) {
    const _0x113357 = _0x4956f8.charRefGroups[_0x2da700];
    if (!_0x113357 || typeof _0x113357 !== "object") {
      console.error("[CharRef] Corrupted group data for:", _0x2da700, "- removing");
      delete _0x4956f8.charRefGroups[_0x2da700];
      continue;
    }
    if (!Array.isArray(_0x113357.references)) {
      console.warn("[CharRef] Group missing references array:", _0x2da700, "- initializing");
      _0x113357.references = [];
    }
    if (typeof _0x113357.createdAt !== "number") {
      _0x113357.createdAt = Date.now();
    }
    if (typeof _0x113357.updatedAt !== "number") {
      _0x113357.updatedAt = Date.now();
    }
  }
  if (Object.keys(_0x4956f8.charRefGroups).length === 0) {
    console.warn("[CharRef] No valid groups found, creating default group");
    _0x4956f8.charRefGroups.默认组 = {
      references: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
  if (!_0x4956f8.charRefGroupId || !_0x4956f8.charRefGroups[_0x4956f8.charRefGroupId]) {
    const _0x56f8a4 = Object.keys(_0x4956f8.charRefGroups)[0];
    _0x4956f8.charRefGroupId = _0x56f8a4 || "默认组";
    console.log("[CharRef] Set charRefGroupId to:", _0x4956f8.charRefGroupId);
  }
  return _0x4956f8.charRefGroups;
}
export function validateReference(_0x9e2f35) {
  const _0x3f076b = [];
  if (!_0x9e2f35.imageId) {
    _0x3f076b.push("缺少图片ID");
  }
  if (!["character", "character_style", "style"].includes(_0x9e2f35.type)) {
    _0x3f076b.push("无效的参考类型");
  }
  if (typeof _0x9e2f35.strength !== "number" || _0x9e2f35.strength < 0) {
    _0x3f076b.push("Strength 值必须大于等于 0");
  }
  if (typeof _0x9e2f35.fidelity !== "number" || _0x9e2f35.fidelity < 0) {
    _0x3f076b.push("Fidelity 值必须大于等于 0");
  }
  return _0x3f076b;
}
export function validateGroup(_0x1ef2f4) {
  const _0x420a54 = [];
  if (!_0x1ef2f4 || typeof _0x1ef2f4 !== "object") {
    _0x420a54.push("组数据无效");
    return _0x420a54;
  }
  if (!Array.isArray(_0x1ef2f4.references)) {
    _0x420a54.push("references 必须是数组");
  } else {
    if (_0x1ef2f4.references.length > 4) {
      _0x420a54.push("每个组最多只能包含 4 个参考图");
    }
    _0x1ef2f4.references.forEach((_0x2afe40, _0x27a469) => {
      const _0x42e1fb = validateReference(_0x2afe40);
      _0x42e1fb.forEach(_0x5f4afb => _0x420a54.push("参考 " + (_0x27a469 + 1) + ": " + _0x5f4afb));
    });
  }
  return _0x420a54;
}
function showCharRefStatus(_0x1ea766, _0x3bb9d6, _0x2dd0ce = "info") {
  _0x1ea766.textContent = _0x3bb9d6;
  _0x1ea766.style.display = "block";
  if (_0x2dd0ce === "success") {
    _0x1ea766.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
    _0x1ea766.style.color = "#4caf50";
    _0x1ea766.style.border = "1px solid rgba(76, 175, 80, 0.3)";
  } else if (_0x2dd0ce === "error") {
    _0x1ea766.style.backgroundColor = "rgba(244, 67, 54, 0.1)";
    _0x1ea766.style.color = "#f44336";
    _0x1ea766.style.border = "1px solid rgba(244, 67, 54, 0.3)";
  } else {
    _0x1ea766.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
    _0x1ea766.style.color = "#2196f3";
    _0x1ea766.style.border = "1px solid rgba(33, 150, 243, 0.3)";
  }
  setTimeout(() => {
    _0x1ea766.style.display = "none";
  }, 5000);
}
export function ensureCharRefPresets() {
  const _0x5a8ea8 = extension_settings[extensionName];
  if (!_0x5a8ea8.charRefPresets || typeof _0x5a8ea8.charRefPresets !== "object" || Array.isArray(_0x5a8ea8.charRefPresets)) {
    if (_0x5a8ea8.charRefPresets) {
      console.error("[CharRef] Corrupted charRefPresets data detected, resetting to default:", _0x5a8ea8.charRefPresets);
    }
    _0x5a8ea8.charRefPresets = {
      默认: {
        imageId: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };
    console.log("[CharRef] Initialized charRefPresets with default preset");
  }
  if (Object.keys(_0x5a8ea8.charRefPresets).length === 0) {
    console.warn("[CharRef] No valid presets found, creating default preset");
    _0x5a8ea8.charRefPresets.默认 = {
      imageId: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
  if (!_0x5a8ea8.charRefPresetId || !_0x5a8ea8.charRefPresets[_0x5a8ea8.charRefPresetId]) {
    const _0x177d6d = Object.keys(_0x5a8ea8.charRefPresets)[0];
    _0x5a8ea8.charRefPresetId = _0x177d6d || "默认";
    console.log("[CharRef] Set charRefPresetId to:", _0x5a8ea8.charRefPresetId);
  }
  return _0x5a8ea8.charRefPresets;
}
export function showCharRefUploadDialog() {
  const _0x2a3b02 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x1bfd4f = extension_settings[extensionName];
  ensureCharRefPresets();
  const _0x559855 = document.createElement("div");
  _0x559855.className = "st-chatu8-workflow-viz-backdrop";
  _0x559855.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-char-ref-upload-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>角色参考图预设</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\" style=\"padding: 2rem;\">\n                <div class=\"st-chatu8-char-ref-upload-content\">\n                    <!-- Preset Selector -->\n                    <div class=\"st-chatu8-field\" style=\"margin-bottom: 1.2rem;\">\n                        <label for=\"char-ref-preset-select\">参考图预设</label>\n                        <div class=\"st-chatu8-profile-controls\">\n                            <select id=\"char-ref-preset-select\" class=\"st-chatu8-select\"></select>\n                            <button class=\"st-chatu8-icon-btn\" id=\"char-ref-preset-new\" title=\"新建预设\">\n                                <i class=\"fa-solid fa-plus\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"char-ref-preset-export-current\" title=\"导出当前预设\">\n                                <i class=\"fa-solid fa-upload\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"char-ref-preset-export-all\" title=\"导出全部预设\">\n                                <i class=\"fa-solid fa-file-export\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"char-ref-preset-import\" title=\"导入预设\">\n                                <i class=\"fa-solid fa-download\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn danger\" id=\"char-ref-preset-delete\" title=\"删除当前预设\">\n                                <i class=\"fa-solid fa-trash\"></i>\n                            </button>\n                        </div>\n                    </div>\n\n                    <!-- Image Preview -->\n                    <div class=\"st-chatu8-field-col\" style=\"margin-bottom: 1.2rem;\">\n                        <label>参考图片预览</label>\n                        <div class=\"st-chatu8-image-preview-container\" id=\"char-ref-upload-preview-container\">\n                            <div class=\"st-chatu8-image-placeholder\">\n                                <i class=\"fa-solid fa-image\"></i>\n                                <span>没有选择图片</span>\n                            </div>\n                            <img id=\"char-ref-upload-preview\" src=\"\" alt=\"参考图预览\" style=\"display: none;\">\n                        </div>\n                        <div class=\"st-chatu8-image-controls\" style=\"margin-top: 0.5rem;\">\n                            <input type=\"file\" id=\"char-ref-upload-input\" accept=\"image/png, image/jpeg, image/webp\" style=\"display:none;\">\n                            <button type=\"button\" class=\"st-chatu8-btn\" id=\"char-ref-select-btn\">\n                                <i class=\"fa-solid fa-upload\"></i> 选择图片\n                            </button>\n                            <button type=\"button\" class=\"st-chatu8-btn danger\" id=\"char-ref-remove-preview-btn\" style=\"display: none;\">\n                                <i class=\"fa-solid fa-trash\"></i> 移除图片\n                            </button>\n                        </div>\n                    </div>\n                    \n                    <div id=\"char-ref-upload-status\" style=\"margin-top: 1.5rem; padding: 1rem; border-radius: 6px; font-size: 0.9rem; display: none; line-height: 1.4;\"></div>\n                </div>\n            </div>\n        </div>\n    ";
  _0x2a3b02.appendChild(_0x559855);
  const _0x4c86a2 = _0x559855.querySelector(".st-chatu8-workflow-viz-close");
  _0x4c86a2.onclick = () => _0x2a3b02.removeChild(_0x559855);
  _0x559855.onclick = _0x5d888f => {
    if (_0x5d888f.target === _0x559855) {
      _0x2a3b02.removeChild(_0x559855);
    }
  };
  const _0x2aa77b = document.getElementById("char-ref-preset-select");
  const _0x5eddca = document.getElementById("char-ref-preset-new");
  const _0x494151 = document.getElementById("char-ref-preset-delete");
  const _0x5d8731 = document.getElementById("char-ref-preset-export-current");
  const _0x21a27c = document.getElementById("char-ref-preset-export-all");
  const _0x3e4c6e = document.getElementById("char-ref-preset-import");
  const _0x146fba = document.getElementById("char-ref-upload-input");
  const _0xa971ad = document.getElementById("char-ref-upload-preview");
  const _0x1cad9f = document.getElementById("char-ref-upload-preview-container");
  const _0x1be93c = document.getElementById("char-ref-select-btn");
  const _0x123c07 = document.getElementById("char-ref-remove-preview-btn");
  const _0x130e37 = document.getElementById("char-ref-upload-status");
  let _0x2cdd82 = null;
  function _0x2d5878() {
    _0x2aa77b.innerHTML = "";
    const _0x1ca9bb = _0x1bfd4f.charRefPresets;
    const _0x24b5b5 = Object.keys(_0x1ca9bb).sort((_0x290725, _0x415e56) => {
      if (_0x290725 === "默认") {
        return -1;
      }
      if (_0x415e56 === "默认") {
        return 1;
      }
      return _0x290725.localeCompare(_0x415e56, "zh-CN");
    });
    for (const _0x350c4e of _0x24b5b5) {
      const _0x520dd4 = new Option(_0x350c4e, _0x350c4e);
      _0x2aa77b.add(_0x520dd4);
    }
    _0x2aa77b.value = _0x1bfd4f.charRefPresetId;
  }
  async function _0x4183e9() {
    const _0x201646 = _0x2aa77b.value;
    const _0x6e55f8 = _0x1bfd4f.charRefPresets[_0x201646];
    if (!_0x6e55f8) {
      return;
    }
    _0x2cdd82 = _0x6e55f8.imageId;
    if (_0x2cdd82) {
      try {
        const _0x212b6a = await getConfigImage(_0x2cdd82);
        if (_0x212b6a) {
          _0xa971ad.src = _0x212b6a;
          _0xa971ad.style.display = "block";
          _0x1cad9f.querySelector(".st-chatu8-image-placeholder").style.display = "none";
          _0x123c07.style.display = "inline-block";
        } else {
          _0x1b0fae();
        }
      } catch (_0x60d353) {
        console.error("[CharRef] 加载图片预览失败:", _0x60d353);
        _0x1b0fae();
      }
    } else {
      _0x1b0fae();
    }
  }
  function _0x1b0fae() {
    _0x2cdd82 = null;
    _0x146fba.value = "";
    _0xa971ad.src = "";
    _0xa971ad.style.display = "none";
    _0x1cad9f.querySelector(".st-chatu8-image-placeholder").style.display = "flex";
    _0x123c07.style.display = "none";
  }
  _0x2d5878();
  _0x4183e9();
  _0x2aa77b.onchange = () => {
    _0x1bfd4f.charRefPresetId = _0x2aa77b.value;
    saveSettingsDebounced();
    _0x4183e9();
  };
  _0x1be93c.onclick = () => _0x146fba.click();
  _0x146fba.onchange = async _0x581430 => {
    const _0x5b390e = _0x581430.target.files[0];
    if (!_0x5b390e) {
      return;
    }
    const _0x162195 = ["image/png", "image/jpeg", "image/webp"];
    if (!_0x162195.includes(_0x5b390e.type)) {
      showCharRefStatus(_0x130e37, "不支持的图片格式。请选择 PNG、JPEG 或 WebP 格式的图片。", "error");
      return;
    }
    try {
      showCharRefStatus(_0x130e37, "正在保存图片...", "info");
      const _0x1da509 = await new Promise((_0x27a704, _0x36aa5c) => {
        const _0x5cab3e = new FileReader();
        _0x5cab3e.onload = _0x129db8 => _0x27a704(_0x129db8.target.result);
        _0x5cab3e.onerror = _0x36aa5c;
        _0x5cab3e.readAsDataURL(_0x5b390e);
      });
      if (_0x2cdd82) {
        try {
          await deleteConfigImage(_0x2cdd82);
        } catch (_0x29d187) {
          console.error("[CharRef] 删除旧图片失败:", _0x29d187);
        }
      }
      const _0x51d5e6 = _0x2aa77b.value;
      const _0x278821 = await saveConfigImage(_0x1da509, {
        format: _0x5b390e.type.split("/")[1] || "png",
        filename: "char_ref_" + _0x51d5e6 + "_" + Date.now()
      });
      _0x2cdd82 = _0x278821;
      _0x1bfd4f.charRefPresets[_0x51d5e6] = {
        imageId: _0x2cdd82,
        createdAt: _0x1bfd4f.charRefPresets[_0x51d5e6]?.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      saveSettingsDebounced();
      _0xa971ad.src = _0x1da509;
      _0xa971ad.style.display = "block";
      _0x1cad9f.querySelector(".st-chatu8-image-placeholder").style.display = "none";
      _0x123c07.style.display = "inline-block";
      showCharRefStatus(_0x130e37, "图片已保存！", "success");
      console.log("[CharRef] Image saved with ID:", _0x278821);
    } catch (_0x413dd7) {
      console.error("[CharRef] 保存图片失败:", _0x413dd7);
      if (_0x413dd7.name === "QuotaExceededError") {
        showCharRefStatus(_0x130e37, "存储空间不足，请删除一些旧图片", "error");
      } else {
        showCharRefStatus(_0x130e37, "保存失败: " + (_0x413dd7.message || "未知错误"), "error");
      }
    }
  };
  _0x123c07.onclick = async () => {
    if (_0x2cdd82) {
      try {
        await deleteConfigImage(_0x2cdd82);
        const _0x17a747 = _0x2aa77b.value;
        _0x1bfd4f.charRefPresets[_0x17a747].imageId = null;
        saveSettingsDebounced();
      } catch (_0x36b374) {
        console.error("[CharRef] 删除图片失败:", _0x36b374);
      }
    }
    _0x1b0fae();
  };
  _0x5eddca.onclick = async () => {
    const _0x2fd17f = prompt("请输入新预设名称:");
    if (!_0x2fd17f) {
      return;
    }
    if (_0x1bfd4f.charRefPresets[_0x2fd17f]) {
      alert("该预设名称已存在，请使用其他名称。");
      return;
    }
    try {
      _0x1bfd4f.charRefPresets[_0x2fd17f] = {
        imageId: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      _0x1bfd4f.charRefPresetId = _0x2fd17f;
      saveSettingsDebounced();
      _0x2d5878();
      _0x4183e9();
      showCharRefStatus(_0x130e37, "新预设已创建！", "success");
    } catch (_0x1d52e2) {
      console.error("[CharRef] 创建预设失败:", _0x1d52e2);
      showCharRefStatus(_0x130e37, "创建失败: " + _0x1d52e2.message, "error");
    }
  };
  _0x494151.onclick = async () => {
    const _0x3d04f5 = _0x2aa77b.value;
    if (_0x3d04f5 === "默认") {
      alert("默认预设不可删除。");
      return;
    }
    if (!confirm("确定要删除预设 \"" + _0x3d04f5 + "\" 吗？此操作不可恢复！")) {
      return;
    }
    try {
      const _0x4b5a38 = _0x1bfd4f.charRefPresets[_0x3d04f5];
      if (_0x4b5a38 && _0x4b5a38.imageId) {
        await deleteConfigImage(_0x4b5a38.imageId);
      }
      delete _0x1bfd4f.charRefPresets[_0x3d04f5];
      _0x1bfd4f.charRefPresetId = "默认";
      saveSettingsDebounced();
      _0x2d5878();
      _0x4183e9();
      showCharRefStatus(_0x130e37, "预设已删除！", "success");
    } catch (_0x1e90d9) {
      console.error("[CharRef] 删除预设失败:", _0x1e90d9);
      showCharRefStatus(_0x130e37, "删除失败: " + _0x1e90d9.message, "error");
    }
  };
  _0x5d8731.onclick = async () => {
    const _0x18a981 = _0x2aa77b.value;
    const _0x555d65 = _0x1bfd4f.charRefPresets[_0x18a981];
    if (!_0x555d65) {
      alert("没有选中的预设可导出。");
      return;
    }
    try {
      const _0x633ae6 = {
        [_0x18a981]: _0x555d65
      };
      const _0x35cfb8 = {
        presets: _0x633ae6,
        images: {}
      };
      const _0x31da89 = _0x35cfb8;
      if (_0x555d65.imageId) {
        try {
          const _0x4fb586 = await getConfigImage(_0x555d65.imageId);
          if (_0x4fb586) {
            _0x31da89.images[_0x555d65.imageId] = _0x4fb586;
          }
        } catch (_0x4f6561) {
          console.error("[CharRef] 获取图片失败:", _0x4f6561);
        }
      }
      const _0x47e7d8 = JSON.stringify(_0x31da89, null, 2);
      const _0xeacdc6 = new Blob([_0x47e7d8], {
        type: "application/json"
      });
      const _0x547edf = URL.createObjectURL(_0xeacdc6);
      const _0x51fbbb = document.createElement("a");
      _0x51fbbb.href = _0x547edf;
      _0x51fbbb.download = "char-ref-preset-" + _0x18a981 + ".json";
      document.body.appendChild(_0x51fbbb);
      _0x51fbbb.click();
      document.body.removeChild(_0x51fbbb);
      URL.revokeObjectURL(_0x547edf);
      showCharRefStatus(_0x130e37, "预设已导出！", "success");
    } catch (_0x30fdf8) {
      console.error("[CharRef] 导出预设失败:", _0x30fdf8);
      showCharRefStatus(_0x130e37, "导出失败: " + _0x30fdf8.message, "error");
    }
  };
  _0x21a27c.onclick = async () => {
    if (!_0x1bfd4f.charRefPresets || Object.keys(_0x1bfd4f.charRefPresets).length === 0) {
      alert("没有预设可导出。");
      return;
    }
    try {
      const _0x48ee04 = {
        presets: _0x1bfd4f.charRefPresets,
        images: {}
      };
      const _0x53822a = _0x48ee04;
      const _0x24d98b = new Set();
      for (const _0x235fbd in _0x1bfd4f.charRefPresets) {
        const _0x16f83e = _0x1bfd4f.charRefPresets[_0x235fbd];
        if (_0x16f83e.imageId) {
          _0x24d98b.add(_0x16f83e.imageId);
        }
      }
      for (const _0x517a15 of _0x24d98b) {
        try {
          const _0xf215ba = await getConfigImage(_0x517a15);
          if (_0xf215ba) {
            _0x53822a.images[_0x517a15] = _0xf215ba;
          }
        } catch (_0x59da5f) {
          console.error("[CharRef] 获取图片 " + _0x517a15 + " 失败:", _0x59da5f);
        }
      }
      const _0x289da0 = JSON.stringify(_0x53822a, null, 2);
      const _0x4f68f5 = new Blob([_0x289da0], {
        type: "application/json"
      });
      const _0x147007 = URL.createObjectURL(_0x4f68f5);
      const _0x35cd21 = document.createElement("a");
      _0x35cd21.href = _0x147007;
      _0x35cd21.download = "char-ref-presets-all.json";
      document.body.appendChild(_0x35cd21);
      _0x35cd21.click();
      document.body.removeChild(_0x35cd21);
      URL.revokeObjectURL(_0x147007);
      showCharRefStatus(_0x130e37, "已导出 " + Object.keys(_0x1bfd4f.charRefPresets).length + " 个预设！", "success");
    } catch (_0xc7e846) {
      console.error("[CharRef] 导出全部预设失败:", _0xc7e846);
      showCharRefStatus(_0x130e37, "导出失败: " + _0xc7e846.message, "error");
    }
  };
  _0x3e4c6e.onclick = () => {
    const _0x4c8a5a = document.createElement("input");
    _0x4c8a5a.type = "file";
    _0x4c8a5a.accept = ".json";
    _0x4c8a5a.onchange = async _0xd04468 => {
      const _0xb98465 = _0xd04468.target.files[0];
      if (!_0xb98465) {
        return;
      }
      const _0xe07203 = new FileReader();
      _0xe07203.onload = async _0x4efc87 => {
        try {
          const _0x533ee8 = JSON.parse(_0x4efc87.target.result);
          let _0x56348d = {};
          let _0x4ee980 = _0x533ee8.images || {};
          if (_0x533ee8.presets) {
            _0x56348d = _0x533ee8.presets;
          } else {
            _0x56348d = _0x533ee8;
          }
          let _0x2a9407 = 0;
          let _0x3a6df4 = 0;
          for (const _0x461b6c in _0x56348d) {
            if (_0x1bfd4f.charRefPresets[_0x461b6c]) {
              const _0x40ebb5 = confirm("预设 \"" + _0x461b6c + "\" 已存在，是否覆盖？");
              if (!_0x40ebb5) {
                _0x3a6df4++;
                continue;
              }
            }
            const _0x2cc6f2 = _0x56348d[_0x461b6c];
            if (_0x2cc6f2.imageId && _0x4ee980[_0x2cc6f2.imageId]) {
              try {
                const _0x2714a9 = await saveConfigImage(_0x4ee980[_0x2cc6f2.imageId], {
                  format: "png",
                  filename: "char_ref_" + _0x461b6c + "_" + Date.now()
                });
                _0x2cc6f2.imageId = _0x2714a9;
              } catch (_0x40509e) {
                console.error("[CharRef] 导入图片失败:", _0x40509e);
                _0x2cc6f2.imageId = null;
              }
            }
            _0x1bfd4f.charRefPresets[_0x461b6c] = _0x2cc6f2;
            _0x2a9407++;
          }
          saveSettingsDebounced();
          _0x2d5878();
          _0x4183e9();
          showCharRefStatus(_0x130e37, "成功导入 " + _0x2a9407 + " 个预设" + (_0x3a6df4 > 0 ? "，跳过 " + _0x3a6df4 + " 个" : "") + "！", "success");
        } catch (_0x39be32) {
          console.error("[CharRef] 导入预设失败:", _0x39be32);
          showCharRefStatus(_0x130e37, "导入失败: " + _0x39be32.message, "error");
        }
      };
      _0xe07203.readAsText(_0xb98465);
    };
    _0x4c8a5a.click();
  };
  console.log("[CharRef] Upload dialog opened");
}
function loadCharRefGroupList(_0x5cda6e) {
  const _0x56bafa = extension_settings[extensionName];
  const _0x588719 = _0x56bafa.charRefGroups || {};
  const _0x48cc0c = _0x56bafa.charRefGroupId || "默认组";
  _0x5cda6e.innerHTML = "";
  const _0x61face = Object.keys(_0x588719).sort((_0x236fdf, _0x2f88d8) => {
    if (_0x236fdf === "默认组") {
      return -1;
    }
    if (_0x2f88d8 === "默认组") {
      return 1;
    }
    return _0x236fdf.localeCompare(_0x2f88d8, "zh-CN");
  });
  _0x61face.forEach(_0x523238 => {
    const _0x1fa707 = document.createElement("option");
    _0x1fa707.value = _0x523238;
    _0x1fa707.textContent = _0x523238;
    if (_0x523238 === _0x48cc0c) {
      _0x1fa707.selected = true;
    }
    _0x5cda6e.appendChild(_0x1fa707);
  });
  console.log("[CharRef] Loaded preset list:", _0x61face.length, "groups");
}
function createNewCharRefGroup(_0x5261f3, _0x524ea3) {
  const _0x3d0cb1 = extension_settings[extensionName];
  const _0x270d5d = _0x3d0cb1.charRefGroups || {};
  const _0x2d468c = prompt("请输入新组名称:");
  if (!_0x2d468c) {
    return;
  }
  const _0x39d4b3 = _0x2d468c.trim();
  if (!_0x39d4b3) {
    showCharRefStatus(_0x524ea3, "组名不能为空", "error");
    return;
  }
  if (_0x270d5d[_0x39d4b3]) {
    showCharRefStatus(_0x524ea3, "组名 \"" + _0x39d4b3 + "\" 已存在", "error");
    return;
  }
  _0x270d5d[_0x39d4b3] = {
    references: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  _0x3d0cb1.charRefGroupId = _0x39d4b3;
  try {
    saveSettingsDebounced();
  } catch (_0xb95095) {
    console.error("[CharRef] Failed to save settings after creating new group:", {
      groupName: _0x39d4b3,
      error: _0xb95095.message,
      errorName: _0xb95095.name,
      timestamp: new Date().toISOString(),
      stack: _0xb95095.stack
    });
    showCharRefStatus(_0x524ea3, "创建成功但保存失败: " + _0xb95095.message, "error");
    return;
  }
  loadCharRefGroupList(_0x5261f3);
  showCharRefStatus(_0x524ea3, "已创建新组 \"" + _0x39d4b3 + "\"", "success");
  console.log("[CharRef] Created new group:", _0x39d4b3);
}
function saveCurrentCharRefGroup(_0x387c05, _0x312552) {
  const _0x39c72e = extension_settings[extensionName];
  const _0x1e78cf = _0x39c72e.charRefGroups || {};
  const _0x417c66 = _0x387c05.value;
  if (!_0x417c66) {
    showCharRefStatus(_0x312552, "未选择组", "error");
    return;
  }
  const _0x302ef1 = _0x1e78cf[_0x417c66];
  if (!_0x302ef1) {
    showCharRefStatus(_0x312552, "当前组不存在", "error");
    return;
  }
  _0x302ef1.updatedAt = Date.now();
  _0x39c72e.charRefGroupId = _0x417c66;
  try {
    saveSettingsDebounced();
  } catch (_0x3586ee) {
    console.error("[CharRef] Failed to save settings after saving group:", {
      groupId: _0x417c66,
      error: _0x3586ee.message,
      errorName: _0x3586ee.name,
      timestamp: new Date().toISOString(),
      stack: _0x3586ee.stack
    });
    showCharRefStatus(_0x312552, "保存失败: " + _0x3586ee.message, "error");
    return;
  }
  showCharRefStatus(_0x312552, "已保存组 \"" + _0x417c66 + "\"", "success");
  console.log("[CharRef] Saved group:", _0x417c66);
}
async function deleteCharRefGroup(_0xb38e9b, _0x2c74bc) {
  const _0x3763c8 = extension_settings[extensionName];
  const _0x377858 = _0x3763c8.charRefGroups || {};
  const _0x39df21 = _0xb38e9b.value;
  if (!_0x39df21) {
    showCharRefStatus(_0x2c74bc, "未选择组", "error");
    return;
  }
  if (_0x39df21 === "默认组" && Object.keys(_0x377858).length === 1) {
    showCharRefStatus(_0x2c74bc, "不能删除唯一的组", "error");
    return;
  }
  const _0x48272d = confirm("确定要删除组 \"" + _0x39df21 + "\" 吗？此操作无法撤销。");
  if (!_0x48272d) {
    return;
  }
  const _0x56c9ea = _0x377858[_0x39df21];
  if (_0x56c9ea && Array.isArray(_0x56c9ea.references)) {
    for (const _0x3e0dec of _0x56c9ea.references) {
      try {
        await deleteConfigImage(_0x3e0dec.imageId);
      } catch (_0x4b3afd) {
        console.error("[CharRef] Failed to delete image:", _0x3e0dec.imageId, _0x4b3afd);
      }
    }
  }
  delete _0x377858[_0x39df21];
  if (_0x377858.默认组) {
    _0x3763c8.charRefGroupId = "默认组";
  } else {
    const _0x518db4 = Object.keys(_0x377858);
    _0x3763c8.charRefGroupId = _0x518db4.length > 0 ? _0x518db4[0] : "默认组";
    if (_0x518db4.length === 0) {
      _0x377858.默认组 = {
        references: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      _0x3763c8.charRefGroupId = "默认组";
    }
  }
  try {
    saveSettingsDebounced();
  } catch (_0x61fe7c) {
    console.error("[CharRef] Failed to save settings after deleting group:", {
      groupId: _0x39df21,
      error: _0x61fe7c.message,
      errorName: _0x61fe7c.name,
      timestamp: new Date().toISOString(),
      stack: _0x61fe7c.stack
    });
    showCharRefStatus(_0x2c74bc, "删除成功但保存失败: " + _0x61fe7c.message, "error");
  }
  loadCharRefGroupList(_0xb38e9b);
  showCharRefStatus(_0x2c74bc, "已删除组 \"" + _0x39df21 + "\"", "success");
  console.log("[CharRef] Deleted group:", _0x39df21);
}
export function showCharRefGroupEditorDialog() {
  const _0x48a594 = document.getElementById("st-chatu8-settings") || document.body;
  const _0xc5602a = extension_settings[extensionName];
  ensureCharRefGroups();
  const _0x2cf3f2 = document.createElement("div");
  _0x2cf3f2.className = "st-chatu8-workflow-viz-backdrop";
  _0x2cf3f2.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-char-ref-group-editor-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>角色组编辑器</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\" style=\"padding: 2rem;\">\n                <div class=\"st-chatu8-char-ref-group-editor-content\">\n                    <!-- Group Preset Selector -->\n                    <div class=\"st-chatu8-field\" style=\"margin-bottom: 1.2rem;\">\n                        <label for=\"char-ref-group-select\">角色组预设</label>\n                        <div class=\"st-chatu8-profile-controls\">\n                            <select id=\"char-ref-group-select\" class=\"st-chatu8-select\"></select>\n                            <button class=\"st-chatu8-icon-btn\" id=\"char-ref-group-new\" title=\"新建组\">\n                                <i class=\"fa-solid fa-plus\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"char-ref-group-save\" title=\"保存当前组\">\n                                <i class=\"fa-solid fa-save\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn danger\" id=\"char-ref-group-delete\" title=\"删除当前组\">\n                                <i class=\"fa-solid fa-trash\"></i>\n                            </button>\n                        </div>\n                    </div>\n\n                    <!-- Add Reference Button -->\n                    <button type=\"button\" class=\"st-chatu8-btn\" id=\"char-ref-group-add-ref\" style=\"width: 100%; padding: 1rem; font-size: 16px; font-weight: 600; margin-bottom: 1.5rem;\">\n                        <i class=\"fa-solid fa-plus\"></i> 添加角色参考 (0/4)\n                    </button>\n\n                    <!-- Reference Slots Container -->\n                    <div id=\"char-ref-slots-container\" class=\"st-chatu8-char-ref-slots\">\n                        <!-- Dynamically rendered slots (0-4) -->\n                    </div>\n\n                    <!-- Status Message Area -->\n                    <div id=\"char-ref-group-status\" style=\"margin-top: 1.5rem; padding: 1rem; border-radius: 6px; font-size: 0.9rem; display: none; line-height: 1.4;\"></div>\n                </div>\n            </div>\n        </div>\n    ";
  _0x48a594.appendChild(_0x2cf3f2);
  const _0x4cdec1 = _0x2cf3f2.querySelector(".st-chatu8-workflow-viz-close");
  _0x4cdec1.onclick = () => _0x48a594.removeChild(_0x2cf3f2);
  _0x2cf3f2.onclick = _0x21fb4e => {
    if (_0x21fb4e.target === _0x2cf3f2) {
      _0x48a594.removeChild(_0x2cf3f2);
    }
  };
  const _0x5018ec = document.getElementById("char-ref-group-select");
  const _0x47c0a3 = document.getElementById("char-ref-group-new");
  const _0x2e78d7 = document.getElementById("char-ref-group-save");
  const _0x5073d9 = document.getElementById("char-ref-group-delete");
  const _0x101598 = document.getElementById("char-ref-group-add-ref");
  const _0x472513 = document.getElementById("char-ref-slots-container");
  const _0x4e00b6 = document.getElementById("char-ref-group-status");
  loadCharRefGroupList(_0x5018ec);
  _0x47c0a3.onclick = () => createNewCharRefGroup(_0x5018ec, _0x4e00b6);
  _0x2e78d7.onclick = () => saveCurrentCharRefGroup(_0x5018ec, _0x4e00b6);
  _0x5073d9.onclick = () => deleteCharRefGroup(_0x5018ec, _0x4e00b6);
  _0x101598.onclick = () => addCharRefToGroup(_0x5018ec, _0x472513, _0x101598, _0x4e00b6);
  renderCharRefSlots(_0x472513, _0x5018ec, _0x101598);
  _0x5018ec.onchange = () => {
    _0xc5602a.charRefGroupId = _0x5018ec.value;
    renderCharRefSlots(_0x472513, _0x5018ec, _0x101598);
  };
  console.log("[CharRef] Group editor dialog opened");
}
async function renderCharRefSlots(_0xd81f06, _0x32948e, _0x344e9d) {
  const _0x36710b = extension_settings[extensionName];
  const _0x1fc05c = _0x36710b.charRefGroups || {};
  const _0x23d9fc = _0x32948e.value;
  const _0x57204e = _0x1fc05c[_0x23d9fc];
  _0xd81f06.innerHTML = "";
  if (!_0x57204e) {
    console.warn("[CharRef] Current group not found:", _0x23d9fc);
    _0xd81f06.innerHTML = "\n            <div style=\"text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.5);\">\n                <i class=\"fa-solid fa-exclamation-circle\" style=\"font-size: 3rem; margin-bottom: 1rem; display: block;\"></i>\n                <p>无法加载组数据</p>\n                <p style=\"font-size: 0.9rem; margin-top: 0.5rem;\">请尝试选择其他组或创建新组</p>\n            </div>\n        ";
    _0x344e9d.disabled = true;
    _0x344e9d.style.opacity = "0.5";
    return;
  }
  if (!Array.isArray(_0x57204e.references)) {
    console.error("[CharRef] Corrupted group data - references is not an array:", _0x23d9fc, _0x57204e);
    _0x57204e.references = [];
    _0x57204e.updatedAt = Date.now();
    saveSettingsDebounced();
    console.log("[CharRef] Fixed corrupted group data");
  }
  const _0x55a3b4 = _0x57204e.references;
  const _0x4285ff = _0x55a3b4.length;
  _0x344e9d.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加角色参考 (" + _0x4285ff + "/4)";
  _0x344e9d.disabled = _0x4285ff >= 4;
  _0x344e9d.style.opacity = _0x4285ff >= 4 ? "0.5" : "1";
  if (_0x4285ff === 0) {
    _0xd81f06.innerHTML = "\n            <div style=\"text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.5);\">\n                <i class=\"fa-solid fa-image\" style=\"font-size: 3rem; margin-bottom: 1rem; display: block;\"></i>\n                <p>此组还没有角色参考</p>\n                <p style=\"font-size: 0.9rem; margin-top: 0.5rem;\">点击上方按钮添加角色参考图</p>\n            </div>\n        ";
    return;
  }
  for (let _0x1abe93 = 0; _0x1abe93 < _0x55a3b4.length; _0x1abe93++) {
    const _0x55c4ea = _0x55a3b4[_0x1abe93];
    const _0x41ea88 = document.createElement("div");
    _0x41ea88.className = "st-chatu8-char-ref-slot";
    _0x41ea88.style.cssText = "border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: rgba(0, 0, 0, 0.2);";
    let _0x2cb218 = "";
    try {
      _0x2cb218 = await getConfigImage(_0x55c4ea.imageId);
    } catch (_0x2abfea) {
      console.error("[CharRef] Failed to load image:", _0x55c4ea.imageId, _0x2abfea);
    }
    _0x41ea88.innerHTML = "\n            <div style=\"display: flex; gap: 1rem; align-items: flex-start;\">\n                <!-- Image Thumbnail -->\n                <div style=\"flex-shrink: 0;\">\n                    <img src=\"" + (_0x2cb218 || "") + "\" alt=\"参考图 " + (_0x1abe93 + 1) + "\" \n                         style=\"width: 120px; height: 120px; object-fit: cover; border-radius: 6px; background: rgba(255, 255, 255, 0.05);\"\n                         onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\">\n                    <div style=\"width: 120px; height: 120px; display: " + (_0x2cb218 ? "none" : "flex") + "; align-items: center; justify-content: center; border-radius: 6px; background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.3);\">\n                        <i class=\"fa-solid fa-image\" style=\"font-size: 2rem;\"></i>\n                    </div>\n                </div>\n\n                <!-- Controls -->\n                <div style=\"flex: 1; display: flex; flex-direction: column; gap: 1rem;\">\n                    <!-- Reference Type -->\n                    <div class=\"st-chatu8-field\">\n                        <label for=\"char-ref-type-" + _0x1abe93 + "\">参考类型</label>\n                        <select id=\"char-ref-type-" + _0x1abe93 + "\" class=\"st-chatu8-select char-ref-type-select\" data-index=\"" + _0x1abe93 + "\">\n                            <option value=\"character\" " + (_0x55c4ea.type === "character" ? "selected" : "") + ">Character</option>\n                            <option value=\"character_style\" " + (_0x55c4ea.type === "character_style" ? "selected" : "") + ">Character & Style</option>\n                            <option value=\"style\" " + (_0x55c4ea.type === "style" ? "selected" : "") + ">Style</option>\n                        </select>\n                    </div>\n\n                    <!-- Strength Slider -->\n                    <div class=\"st-chatu8-field\">\n                        <label for=\"char-ref-strength-" + _0x1abe93 + "\">Strength: <span id=\"char-ref-strength-val-" + _0x1abe93 + "\">" + (_0x55c4ea.strength ?? 0.6) + "</span></label>\n                        <div class=\"st-chatu8-range-container\">\n                            <input type=\"range\" id=\"char-ref-strength-range-" + _0x1abe93 + "\" class=\"st-chatu8-range-slider char-ref-strength-range\" \n                                   data-index=\"" + _0x1abe93 + "\" min=\"0\" max=\"2\" step=\"0.01\" value=\"" + (_0x55c4ea.strength ?? 0.6) + "\">\n                            <input type=\"number\" id=\"char-ref-strength-" + _0x1abe93 + "\" class=\"st-chatu8-range-input char-ref-strength-input\" \n                                   data-index=\"" + _0x1abe93 + "\" min=\"0\" step=\"0.01\" value=\"" + (_0x55c4ea.strength ?? 0.6) + "\">\n                        </div>\n                    </div>\n\n                    <!-- Fidelity Slider -->\n                    <div class=\"st-chatu8-field\">\n                        <label for=\"char-ref-fidelity-" + _0x1abe93 + "\">Fidelity: <span id=\"char-ref-fidelity-val-" + _0x1abe93 + "\">" + (_0x55c4ea.fidelity ?? 0.6) + "</span></label>\n                        <div class=\"st-chatu8-range-container\">\n                            <input type=\"range\" id=\"char-ref-fidelity-range-" + _0x1abe93 + "\" class=\"st-chatu8-range-slider char-ref-fidelity-range\" \n                                   data-index=\"" + _0x1abe93 + "\" min=\"0\" max=\"2\" step=\"0.01\" value=\"" + (_0x55c4ea.fidelity ?? 0.6) + "\">\n                            <input type=\"number\" id=\"char-ref-fidelity-" + _0x1abe93 + "\" class=\"st-chatu8-range-input char-ref-fidelity-input\" \n                                   data-index=\"" + _0x1abe93 + "\" min=\"0\" step=\"0.01\" value=\"" + (_0x55c4ea.fidelity ?? 0.6) + "\">\n                        </div>\n                    </div>\n\n                    <!-- Remove Button -->\n                    <button type=\"button\" class=\"st-chatu8-btn danger char-ref-remove-btn\" data-index=\"" + _0x1abe93 + "\" \n                            style=\"align-self: flex-start;\">\n                        <i class=\"fa-solid fa-trash\"></i> 移除\n                    </button>\n                </div>\n            </div>\n        ";
    _0xd81f06.appendChild(_0x41ea88);
  }
  bindCharRefSlotEvents(_0xd81f06, _0x32948e, _0x344e9d);
  console.log("[CharRef] Rendered", _0x4285ff, "reference slots");
}
async function showCharRefImageLibrary(_0x354223) {
  const _0x567b4e = document.getElementById("st-chatu8-settings") || document.body;
  const _0x2f0887 = extension_settings[extensionName];
  ensureCharRefPresets();
  const _0x111c19 = _0x2f0887.charRefPresets || {};
  let _0x28b13b = 1;
  let _0xd455fe = 12;
  let _0x32b821 = [];
  let _0x2a91c8 = "";
  const _0x509c58 = document.createElement("div");
  _0x509c58.className = "st-chatu8-workflow-viz-backdrop";
  _0x509c58.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-vibe-visual-selector-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>选择角色参考图</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-toolbar\" style=\"justify-content: space-between; align-items: center; gap: 15px; padding: 12px 20px; background: rgba(30, 30, 46, 0.6); border-bottom: 1px solid rgba(255,255,255,0.05);\">\n                <div class=\"st-chatu8-viz-search-container\" style=\"position: relative; flex-grow: 1; max-width: 300px;\">\n                    <i class=\"fa-solid fa-search\" style=\"position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none;\"></i>\n                    <input type=\"text\" class=\"st-chatu8-viz-search-input\" placeholder=\"搜索参考图...\" style=\"width: 100%; padding: 8px 12px 8px 36px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: white; outline: none; transition: all 0.3s;\">\n                </div>\n            </div>\n            <div class=\"st-chatu8-pagination-container\">\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-prev\" title=\"上一页\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-info\">\n                    <span class=\"st-chatu8-pagination-current\">1</span>\n                    <span>/</span>\n                    <span class=\"st-chatu8-pagination-total\">1</span>\n                    <span style=\"margin-left: 8px; color: #666;\">|</span>\n                    <span style=\"margin-left: 8px;\">共 <span class=\"st-chatu8-pagination-count\">0</span> 个</span>\n                </div>\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-next\" title=\"下一页\">\n                    <i class=\"fa-solid fa-chevron-right\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-size-container\">\n                    <span class=\"st-chatu8-pagination-size-label\">每页</span>\n                    <select class=\"st-chatu8-pagination-size\">\n                        <option value=\"8\">8</option>\n                        <option value=\"12\" selected>12</option>\n                        <option value=\"16\">16</option>\n                        <option value=\"24\">24</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\">\n                <div class=\"st-chatu8-vibe-visual-selector-grid\">\n                    <!-- Character reference cards will be inserted here -->\n                </div>\n            </div>\n        </div>\n    ";
  _0x567b4e.appendChild(_0x509c58);
  const _0x3a0cd6 = _0x509c58.querySelector(".st-chatu8-workflow-viz-close");
  _0x3a0cd6.onclick = () => _0x567b4e.removeChild(_0x509c58);
  _0x509c58.onclick = _0x20dba4 => {
    if (_0x20dba4.target === _0x509c58) {
      _0x567b4e.removeChild(_0x509c58);
    }
  };
  const _0x5ea0a6 = _0x509c58.querySelector(".st-chatu8-vibe-visual-selector-grid");
  const _0x3b2bbc = _0x509c58.querySelector(".st-chatu8-viz-search-input");
  const _0x58cca2 = _0x509c58.querySelector(".st-chatu8-pagination-prev");
  const _0x8a1b63 = _0x509c58.querySelector(".st-chatu8-pagination-next");
  const _0x2fb79d = _0x509c58.querySelector(".st-chatu8-pagination-current");
  const _0x2d1b12 = _0x509c58.querySelector(".st-chatu8-pagination-total");
  const _0x3d756d = _0x509c58.querySelector(".st-chatu8-pagination-count");
  const _0x87c029 = _0x509c58.querySelector(".st-chatu8-pagination-size");
  const _0x180bb1 = Object.keys(_0x111c19).filter(_0x431ccf => _0x111c19[_0x431ccf].imageId).sort((_0x2446d3, _0x3e7e6c) => {
    if (_0x2446d3 === "默认") {
      return -1;
    }
    if (_0x3e7e6c === "默认") {
      return 1;
    }
    return _0x2446d3.localeCompare(_0x3e7e6c, "zh-CN");
  });
  function _0x50e9a2() {
    if (_0x2a91c8) {
      _0x32b821 = _0x180bb1.filter(_0x5b5460 => _0x5b5460.toLowerCase().includes(_0x2a91c8));
    } else {
      _0x32b821 = [..._0x180bb1];
    }
  }
  function _0x494df2() {
    const _0x2632ba = Math.ceil(_0x32b821.length / _0xd455fe) || 1;
    _0x2fb79d.textContent = _0x28b13b;
    _0x2d1b12.textContent = _0x2632ba;
    _0x3d756d.textContent = _0x32b821.length;
    _0x58cca2.disabled = _0x28b13b <= 1;
    _0x58cca2.style.opacity = _0x28b13b <= 1 ? "0.5" : "1";
    _0x58cca2.style.cursor = _0x28b13b <= 1 ? "not-allowed" : "pointer";
    _0x8a1b63.disabled = _0x28b13b >= _0x2632ba;
    _0x8a1b63.style.opacity = _0x28b13b >= _0x2632ba ? "0.5" : "1";
    _0x8a1b63.style.cursor = _0x28b13b >= _0x2632ba ? "not-allowed" : "pointer";
  }
  async function _0x2c6f45() {
    _0x5ea0a6.style.opacity = "0";
    _0x5ea0a6.style.transform = "translateY(10px)";
    await new Promise(_0x3fc4b1 => setTimeout(_0x3fc4b1, 150));
    _0x5ea0a6.innerHTML = "";
    if (_0x32b821.length === 0) {
      _0x5ea0a6.innerHTML = "\n                <div style=\"\n                    grid-column: 1 / -1;\n                    text-align: center;\n                    padding: 3rem;\n                    color: rgba(255, 255, 255, 0.5);\n                \">\n                    <i class=\"fa-solid fa-inbox\" style=\"font-size: 3rem; margin-bottom: 1rem; display: block;\"></i>\n                    <p>" + (_0x2a91c8 ? "没有找到匹配的参考图" : "图片库为空") + "</p>\n                    <p style=\"font-size: 0.9rem; margin-top: 0.5rem;\">" + (_0x2a91c8 ? "请尝试其他搜索词" : "请先上传一些角色参考图") + "</p>\n                </div>\n            ";
      _0x494df2();
      _0x5ea0a6.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      _0x5ea0a6.style.opacity = "1";
      _0x5ea0a6.style.transform = "translateY(0)";
      return;
    }
    const _0x4140d5 = (_0x28b13b - 1) * _0xd455fe;
    const _0x55e787 = _0x4140d5 + _0xd455fe;
    const _0x26d06f = _0x32b821.slice(_0x4140d5, _0x55e787);
    for (const _0x415d41 of _0x26d06f) {
      const _0x1e5db3 = _0x111c19[_0x415d41];
      const _0x443c98 = document.createElement("div");
      _0x443c98.className = "st-chatu8-vibe-card";
      const _0x4b4d71 = document.createElement("div");
      _0x4b4d71.className = "st-chatu8-vibe-card-thumbnail";
      try {
        const _0x28e99c = await getConfigImage(_0x1e5db3.imageId);
        if (_0x28e99c) {
          const _0x36c5a9 = document.createElement("img");
          _0x36c5a9.src = _0x28e99c;
          _0x36c5a9.alt = _0x415d41;
          _0x4b4d71.appendChild(_0x36c5a9);
        } else {
          _0x4b4d71.innerHTML = "\n                        <div class=\"st-chatu8-vibe-card-placeholder\">\n                            <i class=\"fa-solid fa-image\"></i>\n                            <div>无图像</div>\n                        </div>\n                    ";
        }
      } catch (_0x347113) {
        _0x4b4d71.innerHTML = "\n                    <div class=\"st-chatu8-vibe-card-error\">\n                        <i class=\"fa-solid fa-exclamation-triangle\"></i>\n                        <div>加载失败</div>\n                    </div>\n                ";
        _0x4b4d71.title = "加载失败: " + _0x347113.message;
        console.error("[CharRef] Failed to load image:", _0x1e5db3.imageId, _0x347113);
      }
      const _0x137af1 = document.createElement("div");
      _0x137af1.className = "st-chatu8-vibe-card-info";
      const _0x357461 = document.createElement("div");
      _0x357461.className = "st-chatu8-vibe-card-name";
      _0x357461.textContent = _0x415d41;
      _0x137af1.appendChild(_0x357461);
      _0x443c98.appendChild(_0x4b4d71);
      _0x443c98.appendChild(_0x137af1);
      _0x443c98.onclick = () => {
        _0x354223(_0x1e5db3.imageId);
        _0x567b4e.removeChild(_0x509c58);
        console.log("[CharRef] Selected image:", _0x415d41, _0x1e5db3.imageId);
      };
      _0x5ea0a6.appendChild(_0x443c98);
    }
    _0x5ea0a6.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    _0x5ea0a6.style.opacity = "1";
    _0x5ea0a6.style.transform = "translateY(0)";
    _0x494df2();
  }
  _0x3b2bbc.addEventListener("input", _0x4d936a => {
    _0x2a91c8 = _0x4d936a.target.value.toLowerCase();
    _0x28b13b = 1;
    _0x50e9a2();
    _0x2c6f45();
  });
  _0x58cca2.onclick = () => {
    if (_0x28b13b > 1) {
      _0x28b13b--;
      _0x2c6f45();
    }
  };
  _0x8a1b63.onclick = () => {
    const _0x45cc01 = Math.ceil(_0x32b821.length / _0xd455fe) || 1;
    if (_0x28b13b < _0x45cc01) {
      _0x28b13b++;
      _0x2c6f45();
    }
  };
  _0x87c029.onchange = _0xf4b46 => {
    _0xd455fe = parseInt(_0xf4b46.target.value);
    _0x28b13b = 1;
    _0x2c6f45();
  };
  _0x50e9a2();
  _0x2c6f45();
}
function addCharRefToGroup(_0x3f6440, _0x5b5a2f, _0x1ade59, _0xe83c17) {
  const _0xef9283 = extension_settings[extensionName];
  const _0x1f23a4 = _0xef9283.charRefGroups || {};
  const _0x564459 = _0x3f6440.value;
  const _0x59ddc8 = _0x1f23a4[_0x564459];
  if (!_0x59ddc8) {
    showCharRefStatus(_0xe83c17, "错误: 未选择组。请先选择或创建一个组。", "error");
    console.error("[CharRef] No group selected when attempting to add reference");
    return;
  }
  const _0x170153 = _0x59ddc8.references || [];
  if (_0x170153.length >= 4) {
    showCharRefStatus(_0xe83c17, "已达到最大数量 (4个)。每个组最多可包含 4 个角色参考。", "error");
    console.warn("[CharRef] Maximum reference limit reached for group:", _0x564459);
    return;
  }
  try {
    showCharRefImageLibrary(_0x274b3d => {
      try {
        if (!_0x274b3d || typeof _0x274b3d !== "string") {
          showCharRefStatus(_0xe83c17, "错误: 无效的图片 ID", "error");
          console.error("[CharRef] Invalid imageId received:", _0x274b3d);
          return;
        }
        const _0x34a6d1 = {
          imageId: _0x274b3d,
          type: "character",
          strength: 0.6,
          fidelity: 0.6
        };
        _0x59ddc8.references.push(_0x34a6d1);
        _0x59ddc8.updatedAt = Date.now();
        try {
          saveSettingsDebounced();
        } catch (_0x2b0b8f) {
          console.error("[CharRef] Failed to save settings after adding reference:", {
            imageId: _0x274b3d.substring(0, 12) + "...",
            error: _0x2b0b8f.message,
            errorName: _0x2b0b8f.name,
            groupId: _0x564459,
            timestamp: new Date().toISOString(),
            stack: _0x2b0b8f.stack
          });
          showCharRefStatus(_0xe83c17, "错误: 保存设置失败 - " + _0x2b0b8f.message, "error");
          return;
        }
        renderCharRefSlots(_0x5b5a2f, _0x3f6440, _0x1ade59);
        showCharRefStatus(_0xe83c17, "角色参考已成功添加到组", "success");
        console.log("[CharRef] Successfully added reference to group:", _0x564459, _0x274b3d);
      } catch (_0x1b66f9) {
        console.error("[CharRef] Error adding reference to group:", {
          error: _0x1b66f9.message,
          errorName: _0x1b66f9.name,
          groupId: _0x564459,
          timestamp: new Date().toISOString(),
          stack: _0x1b66f9.stack
        });
        showCharRefStatus(_0xe83c17, "错误: 添加角色参考失败 - " + _0x1b66f9.message, "error");
      }
    });
  } catch (_0x103bd3) {
    console.error("[CharRef] Error opening image library:", {
      error: _0x103bd3.message,
      errorName: _0x103bd3.name,
      timestamp: new Date().toISOString(),
      stack: _0x103bd3.stack
    });
    showCharRefStatus(_0xe83c17, "错误: 无法打开图片库 - " + _0x103bd3.message, "error");
  }
}
async function removeCharRefFromGroup(_0x4747ad, _0x4211cf, _0x45fa5e, _0x17f3d4, _0x4924d5) {
  const _0x2e5df0 = extension_settings[extensionName];
  const _0x2b92f8 = _0x2e5df0.charRefGroups || {};
  const _0x5da06c = _0x4211cf.value;
  const _0x31c76d = _0x2b92f8[_0x5da06c];
  if (!_0x31c76d || !Array.isArray(_0x31c76d.references)) {
    showCharRefStatus(_0x4924d5, "错误: 组数据无效", "error");
    return;
  }
  if (_0x4747ad < 0 || _0x4747ad >= _0x31c76d.references.length) {
    showCharRefStatus(_0x4924d5, "错误: 无效的索引", "error");
    return;
  }
  const _0x2e434f = confirm("确定要移除这个角色参考吗？");
  if (!_0x2e434f) {
    return;
  }
  const _0x3d1758 = _0x31c76d.references[_0x4747ad];
  _0x31c76d.references.splice(_0x4747ad, 1);
  _0x31c76d.updatedAt = Date.now();
  try {
    saveSettingsDebounced();
  } catch (_0x20678e) {
    console.error("[CharRef] Failed to save settings after removing reference:", _0x20678e);
    showCharRefStatus(_0x4924d5, "错误: 保存设置失败 - " + _0x20678e.message, "error");
    return;
  }
  await renderCharRefSlots(_0x45fa5e, _0x4211cf, _0x17f3d4);
  showCharRefStatus(_0x4924d5, "角色参考已移除", "success");
  console.log("[CharRef] Removed reference at index:", _0x4747ad);
}
function bindCharRefSlotEvents(_0x296b63, _0x9cbaad, _0x21542a) {
  const _0x5a1fbf = extension_settings[extensionName];
  const _0x4eb630 = _0x5a1fbf.charRefGroups || {};
  const _0x34ba31 = _0x9cbaad.value;
  const _0x5bbe0b = _0x4eb630[_0x34ba31];
  const _0x5db8f8 = document.getElementById("char-ref-group-status");
  if (!_0x5bbe0b) {
    return;
  }
  const _0x4344a5 = _0x296b63.querySelectorAll(".char-ref-type-select");
  _0x4344a5.forEach(_0x2c2a6d => {
    _0x2c2a6d.onchange = _0x54b22e => {
      const _0x1a54fc = parseInt(_0x54b22e.target.dataset.index);
      const _0x418cd9 = _0x54b22e.target.value;
      if (_0x5bbe0b.references[_0x1a54fc]) {
        _0x5bbe0b.references[_0x1a54fc].type = _0x418cd9;
        _0x5bbe0b.updatedAt = Date.now();
        try {
          saveSettingsDebounced();
          console.log("[CharRef] Updated reference type:", _0x1a54fc, _0x418cd9);
        } catch (_0x33d14d) {
          console.error("[CharRef] Failed to save after type change:", _0x33d14d);
          showCharRefStatus(_0x5db8f8, "保存失败: " + _0x33d14d.message, "error");
        }
      }
    };
  });
  const _0x412511 = _0x296b63.querySelectorAll(".char-ref-strength-range");
  const _0xadda51 = _0x296b63.querySelectorAll(".char-ref-strength-input");
  _0x412511.forEach(_0x432ffd => {
    _0x432ffd.oninput = _0x262d8a => {
      const _0x2657a8 = parseInt(_0x262d8a.target.dataset.index);
      const _0x619bf0 = parseFloat(_0x262d8a.target.value);
      const _0x2f8d3f = document.getElementById("char-ref-strength-val-" + _0x2657a8);
      if (_0x2f8d3f) {
        _0x2f8d3f.textContent = _0x619bf0.toFixed(2);
      }
      const _0x2542ff = document.getElementById("char-ref-strength-" + _0x2657a8);
      if (_0x2542ff) {
        _0x2542ff.value = _0x619bf0;
      }
      if (_0x5bbe0b.references[_0x2657a8]) {
        _0x5bbe0b.references[_0x2657a8].strength = _0x619bf0;
        _0x5bbe0b.updatedAt = Date.now();
        try {
          saveSettingsDebounced();
        } catch (_0x1441a6) {
          console.error("[CharRef] Failed to save after strength change:", _0x1441a6);
        }
      }
    };
  });
  _0xadda51.forEach(_0x2a642d => {
    _0x2a642d.oninput = _0x44777b => {
      const _0x1c1d8d = parseInt(_0x44777b.target.dataset.index);
      const _0x55b425 = parseFloat(_0x44777b.target.value);
      const _0x194f18 = Math.max(0, _0x55b425);
      const _0x2ea3b5 = document.getElementById("char-ref-strength-val-" + _0x1c1d8d);
      if (_0x2ea3b5) {
        _0x2ea3b5.textContent = _0x194f18.toFixed(2);
      }
      const _0x5ae4b7 = document.getElementById("char-ref-strength-range-" + _0x1c1d8d);
      if (_0x5ae4b7) {
        _0x5ae4b7.value = _0x194f18;
      }
      if (_0x5bbe0b.references[_0x1c1d8d]) {
        _0x5bbe0b.references[_0x1c1d8d].strength = _0x194f18;
        _0x5bbe0b.updatedAt = Date.now();
        try {
          saveSettingsDebounced();
        } catch (_0xf7dd48) {
          console.error("[CharRef] Failed to save after strength change:", _0xf7dd48);
        }
      }
    };
  });
  const _0x138bc0 = _0x296b63.querySelectorAll(".char-ref-fidelity-range");
  const _0x1490f5 = _0x296b63.querySelectorAll(".char-ref-fidelity-input");
  _0x138bc0.forEach(_0x287cbe => {
    _0x287cbe.oninput = _0x3afd33 => {
      const _0x4d70d6 = parseInt(_0x3afd33.target.dataset.index);
      const _0x47be37 = parseFloat(_0x3afd33.target.value);
      const _0x20b09a = document.getElementById("char-ref-fidelity-val-" + _0x4d70d6);
      if (_0x20b09a) {
        _0x20b09a.textContent = _0x47be37.toFixed(2);
      }
      const _0x5792cf = document.getElementById("char-ref-fidelity-" + _0x4d70d6);
      if (_0x5792cf) {
        _0x5792cf.value = _0x47be37;
      }
      if (_0x5bbe0b.references[_0x4d70d6]) {
        _0x5bbe0b.references[_0x4d70d6].fidelity = _0x47be37;
        _0x5bbe0b.updatedAt = Date.now();
        try {
          saveSettingsDebounced();
        } catch (_0x5e64dd) {
          console.error("[CharRef] Failed to save after fidelity change:", _0x5e64dd);
        }
      }
    };
  });
  _0x1490f5.forEach(_0x177e2e => {
    _0x177e2e.oninput = _0x16637e => {
      const _0x3fba20 = parseInt(_0x16637e.target.dataset.index);
      const _0x309b88 = parseFloat(_0x16637e.target.value);
      const _0x40285c = Math.max(0, _0x309b88);
      const _0x526d02 = document.getElementById("char-ref-fidelity-val-" + _0x3fba20);
      if (_0x526d02) {
        _0x526d02.textContent = _0x40285c.toFixed(2);
      }
      const _0x4989a7 = document.getElementById("char-ref-fidelity-range-" + _0x3fba20);
      if (_0x4989a7) {
        _0x4989a7.value = _0x40285c;
      }
      if (_0x5bbe0b.references[_0x3fba20]) {
        _0x5bbe0b.references[_0x3fba20].fidelity = _0x40285c;
        _0x5bbe0b.updatedAt = Date.now();
        try {
          saveSettingsDebounced();
        } catch (_0x34b38b) {
          console.error("[CharRef] Failed to save after fidelity change:", _0x34b38b);
        }
      }
    };
  });
  const _0x25852d = _0x296b63.querySelectorAll(".char-ref-remove-btn");
  _0x25852d.forEach(_0x32b0d0 => {
    _0x32b0d0.onclick = _0x34407e => {
      const _0x53b434 = parseInt(_0x34407e.target.closest(".char-ref-remove-btn").dataset.index);
      removeCharRefFromGroup(_0x53b434, _0x9cbaad, _0x296b63, _0x21542a, _0x5db8f8);
    };
  });
}
export function initCharRefGroupEditor(_0x3109c1) {
  ensureCharRefGroups();
  ensureCharRefPresets();
  const _0x50a171 = _0x3109c1.find("#novelai-char-ref-upload-btn");
  if (_0x50a171.length) {
    _0x50a171.on("click", () => {
      showCharRefUploadDialog();
    });
  }
  const _0x2c2429 = _0x3109c1.find("#novelai-char-ref-group-editor-btn");
  if (_0x2c2429.length) {
    _0x2c2429.on("click", () => {
      showCharRefGroupEditorDialog();
    });
  }
}