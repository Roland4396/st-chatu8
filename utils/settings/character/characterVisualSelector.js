import { extension_settings } from "../../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../../script.js";
import { extensionName } from "../../config.js";
import { saveConfigImage, getConfigImage, deleteConfigImage } from "../../configDatabase.js";
import { loadCharacterPresetList, loadCharacterPresetData } from "./characterPreset.js";
import { loadOutfitPresetList, loadOutfitPresetData } from "./outfitPreset.js";
export async function showCharacterVisualSelector(_0xbb037c) {
  const _0x36684e = extension_settings[extensionName];
  await showGenericVisualSelector({
    type: "character",
    title: "选择角色预设",
    presets: _0x36684e.characterPresets || {},
    currentPresetIdKey: "characterPresetId",
    defaultPresetName: "默认角色",
    imageIdField: "photoImageIds",
    settings: _0x36684e,
    onSelect: _0xbb037c,
    onRefresh: () => {
      loadCharacterPresetList();
    },
    loadPresetData: loadCharacterPresetData
  });
}
export async function showOutfitVisualSelector(_0x6b99bd) {
  const _0x5a67fa = extension_settings[extensionName];
  await showGenericVisualSelector({
    type: "outfit",
    title: "选择服装预设",
    presets: _0x5a67fa.outfitPresets || {},
    currentPresetIdKey: "outfitPresetId",
    defaultPresetName: "默认服装",
    imageIdField: "photoImageIds",
    settings: _0x5a67fa,
    onSelect: _0x6b99bd,
    onRefresh: () => {
      loadOutfitPresetList();
    },
    loadPresetData: loadOutfitPresetData
  });
}
async function showGenericVisualSelector(_0x577597) {
  const {
    type: _0x313542,
    title: _0x2bb716,
    presets: _0x22242d,
    currentPresetIdKey: _0x2be7eb,
    defaultPresetName: _0x12bf9e,
    imageIdField: _0x5b585f,
    settings: _0x123373,
    onSelect: _0x4568c6,
    onRefresh: _0x283b23,
    loadPresetData: _0x2564a6
  } = _0x577597;
  const _0x9003cd = document.getElementById("st-chatu8-settings") || document.body;
  const _0xf878b8 = document.createElement("div");
  _0xf878b8.className = "st-chatu8-workflow-viz-backdrop";
  const _0x4388dc = new Set();
  let _0x102a98 = false;
  let _0x15d8f0 = 1;
  let _0x5c66e8 = 12;
  let _0x235017 = [];
  let _0xf0fc2b = "";
  _0xf878b8.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-preset-viz-dialog-wrapper\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>" + _0x2bb716 + "</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-toolbar\" style=\"justify-content: space-between; align-items: center; gap: 15px;\">\n                <div class=\"st-chatu8-viz-search-container\" style=\"position: relative; flex-grow: 1; max-width: 300px;\">\n                    <i class=\"fa-solid fa-search\" style=\"position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none;\"></i>\n                    <input type=\"text\" class=\"st-chatu8-viz-search-input\" placeholder=\"搜索预设...\" style=\"width: 100%; padding: 8px 12px 8px 36px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: white; outline: none; transition: all 0.3s;\">\n                </div>\n                <div style=\"display: flex; gap: 10px;\">\n                    <div class=\"st-chatu8-viz-bulk-delete\" style=\"cursor: pointer; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9em; user-select: none; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all 0.3s;\">\n                        <i class=\"fa-solid fa-trash-can\"></i> <span>批量删除</span>\n                    </div>\n                     <div class=\"st-chatu8-viz-confirm-delete\" style=\"display: none; cursor: pointer; padding: 6px 14px; background: var(--st-chatu8-danger-primary, #d9534f); border-radius: 20px; font-size: 0.9em; user-select: none; white-space: nowrap; align-items: center; gap: 6px; transition: all 0.3s; color: white;\">\n                        <i class=\"fa-solid fa-check\"></i> <span>确认删除 (0)</span>\n                    </div>\n                    <div class=\"st-chatu8-viz-mode-toggle\" style=\"cursor: pointer; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9em; user-select: none; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all 0.3s;\">\n                        <i class=\"fa-solid fa-pen-to-square\"></i> <span>管理</span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"st-chatu8-pagination-container\" style=\"display: flex; justify-content: center; align-items: center; gap: 12px; padding: 12px 20px; background: rgba(30, 30, 46, 0.6); border-bottom: 1px solid rgba(255,255,255,0.05);\">\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-prev\" title=\"上一页\" style=\"padding: 6px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #ccc; cursor: pointer; transition: all 0.2s;\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-info\" style=\"display: flex; align-items: center; gap: 8px; color: #aaa; font-size: 0.9em;\">\n                    <span class=\"st-chatu8-pagination-current\">1</span>\n                    <span>/</span>\n                    <span class=\"st-chatu8-pagination-total\">1</span>\n                    <span style=\"margin-left: 8px; color: #666;\">|</span>\n                    <span style=\"margin-left: 8px;\">共 <span class=\"st-chatu8-pagination-count\">0</span> 个</span>\n                </div>\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-next\" title=\"下一页\" style=\"padding: 6px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #ccc; cursor: pointer; transition: all 0.2s;\">\n                    <i class=\"fa-solid fa-chevron-right\"></i>\n                </button>\n                <div style=\"margin-left: 16px; display: flex; align-items: center; gap: 6px;\">\n                    <span style=\"color: #888; font-size: 0.85em;\">每页</span>\n                    <select class=\"st-chatu8-pagination-size\" style=\"padding: 4px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #ccc; cursor: pointer; font-size: 0.85em;\">\n                        <option value=\"8\">8</option>\n                        <option value=\"12\" selected>12</option>\n                        <option value=\"16\">16</option>\n                        <option value=\"24\">24</option>\n                        <option value=\"48\">48</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\">\n                <div class=\"st-chatu8-workflow-viz-container st-chatu8-preset-viz-container\">\n                    <div class=\"st-chatu8-preset-grid\"></div>\n                </div>\n            </div>\n        </div>\n    ";
  const _0x1038c9 = _0xf878b8.querySelector(".st-chatu8-workflow-viz-close");
  _0x1038c9.onclick = () => _0x9003cd.removeChild(_0xf878b8);
  _0xf878b8.onclick = _0x45297f => {
    if (_0x45297f.target === _0xf878b8) {
      _0x9003cd.removeChild(_0xf878b8);
    }
  };
  const _0x55e97f = _0xf878b8.querySelector(".st-chatu8-viz-search-input");
  _0x55e97f.oninput = _0x45cdf8 => {
    _0xf0fc2b = _0x45cdf8.target.value.toLowerCase();
    _0x15d8f0 = 1;
    _0x33eb5b();
    _0x501da8();
  };
  const _0x487b82 = _0xf878b8.querySelector(".st-chatu8-preset-viz-dialog-wrapper");
  const _0x294e8e = _0xf878b8.querySelector(".st-chatu8-viz-bulk-delete");
  const _0x1b3b38 = _0xf878b8.querySelector(".st-chatu8-viz-confirm-delete");
  const _0x10cbb3 = _0xf878b8.querySelector(".st-chatu8-viz-mode-toggle");
  _0x10cbb3.onclick = () => {
    if (_0x102a98) {
      _0x1b6669();
    }
    _0x487b82.classList.toggle("st-chatu8-mode-manage");
    const _0x2f3eca = _0x487b82.classList.contains("st-chatu8-mode-manage");
    _0x10cbb3.style.background = _0x2f3eca ? "var(--st-chatu8-accent-primary)" : "rgba(255,255,255,0.1)";
    _0x10cbb3.style.color = _0x2f3eca ? "white" : "inherit";
  };
  function _0x1b6669() {
    _0x102a98 = false;
    _0x4388dc.clear();
    _0x487b82.classList.remove("st-chatu8-mode-bulk-delete");
    _0x294e8e.style.background = "rgba(255,255,255,0.1)";
    _0x294e8e.style.color = "inherit";
    _0x294e8e.querySelector("span").textContent = "批量删除";
    _0x1b3b38.style.display = "none";
    const _0x3e2426 = _0xf878b8.querySelectorAll(".st-chatu8-preset-card");
    _0x3e2426.forEach(_0x371100 => _0x371100.classList.remove("selected-for-delete"));
  }
  _0x294e8e.onclick = () => {
    if (_0x487b82.classList.contains("st-chatu8-mode-manage")) {
      _0x487b82.classList.remove("st-chatu8-mode-manage");
      _0x10cbb3.style.background = "rgba(255,255,255,0.1)";
      _0x10cbb3.style.color = "inherit";
    }
    _0x102a98 = !_0x102a98;
    if (_0x102a98) {
      _0x487b82.classList.add("st-chatu8-mode-bulk-delete");
      _0x294e8e.style.background = "var(--st-chatu8-danger-primary, #d9534f)";
      _0x294e8e.style.color = "white";
      _0x294e8e.querySelector("span").textContent = "取消删除";
      _0x1b3b38.style.display = "flex";
      _0xd24ce5();
    } else {
      _0x1b6669();
    }
  };
  function _0xd24ce5() {
    _0x1b3b38.querySelector("span").textContent = "确认删除 (" + _0x4388dc.size + ")";
  }
  _0x1b3b38.onclick = async () => {
    if (_0x4388dc.size === 0) {
      return;
    }
    if (confirm("确定要删除选中的 " + _0x4388dc.size + " 个预设吗？此操作不可恢复！")) {
      let _0x336eec = 0;
      for (const _0xa83d6b of _0x4388dc) {
        if (_0xa83d6b === _0x12bf9e) {
          continue;
        }
        const _0x22d2ae = _0x22242d[_0xa83d6b];
        if (_0x22d2ae) {
          const _0x41b576 = _0x22d2ae[_0x5b585f] || [];
          for (const _0x4dc977 of _0x41b576) {
            try {
              await deleteConfigImage(_0x4dc977);
            } catch (_0x2583f5) {
              console.warn("Failed to delete image " + _0x4dc977 + " for " + _0xa83d6b);
            }
          }
          if (_0x22d2ae.previewImageId) {
            try {
              await deleteConfigImage(_0x22d2ae.previewImageId);
            } catch (_0x459108) {
              console.warn("Failed to delete preview image for " + _0xa83d6b);
            }
          }
        }
        if (_0x22242d[_0xa83d6b]) {
          delete _0x22242d[_0xa83d6b];
          _0x336eec++;
        }
        if (_0x123373[_0x2be7eb] === _0xa83d6b) {
          _0x123373[_0x2be7eb] = _0x12bf9e;
        }
      }
      await saveSettingsDebounced();
      alert("成功删除 " + _0x336eec + " 个预设。");
      _0x1b6669();
      _0x33eb5b();
      const _0x1dc7b9 = Math.ceil(_0x235017.length / _0x5c66e8) || 1;
      if (_0x15d8f0 > _0x1dc7b9) {
        _0x15d8f0 = _0x1dc7b9;
      }
      _0x501da8();
      if (_0x283b23) {
        _0x283b23();
      }
    }
  };
  const _0x5f8068 = _0xf878b8.querySelector(".st-chatu8-preset-grid");
  const _0x45c325 = _0xf878b8.querySelector(".st-chatu8-pagination-prev");
  const _0x1b2ba8 = _0xf878b8.querySelector(".st-chatu8-pagination-next");
  const _0x1f2ee4 = _0xf878b8.querySelector(".st-chatu8-pagination-current");
  const _0xb06d9c = _0xf878b8.querySelector(".st-chatu8-pagination-total");
  const _0x49806e = _0xf878b8.querySelector(".st-chatu8-pagination-count");
  const _0x1bb926 = _0xf878b8.querySelector(".st-chatu8-pagination-size");
  const _0x27ead2 = {
    sensitivity: "base"
  };
  const _0x409b16 = Object.keys(_0x22242d).sort((_0x57a2da, _0x2f046c) => _0x57a2da.localeCompare(_0x2f046c, "zh-CN", _0x27ead2));
  const _0x39dc93 = _0x123373[_0x2be7eb];
  function _0x33eb5b() {
    if (_0xf0fc2b) {
      _0x235017 = _0x409b16.filter(_0x2ca917 => _0x2ca917.toLowerCase().includes(_0xf0fc2b));
    } else {
      _0x235017 = [..._0x409b16];
    }
  }
  function _0x4ca76b() {
    const _0x3118c9 = Math.ceil(_0x235017.length / _0x5c66e8) || 1;
    _0x1f2ee4.textContent = _0x15d8f0;
    _0xb06d9c.textContent = _0x3118c9;
    _0x49806e.textContent = _0x235017.length;
    _0x45c325.disabled = _0x15d8f0 <= 1;
    _0x45c325.style.opacity = _0x15d8f0 <= 1 ? "0.5" : "1";
    _0x45c325.style.cursor = _0x15d8f0 <= 1 ? "not-allowed" : "pointer";
    _0x1b2ba8.disabled = _0x15d8f0 >= _0x3118c9;
    _0x1b2ba8.style.opacity = _0x15d8f0 >= _0x3118c9 ? "0.5" : "1";
    _0x1b2ba8.style.cursor = _0x15d8f0 >= _0x3118c9 ? "not-allowed" : "pointer";
  }
  async function _0x501da8() {
    _0x5f8068.style.opacity = "0";
    _0x5f8068.style.transform = "translateY(10px)";
    await new Promise(_0x138c61 => setTimeout(_0x138c61, 150));
    _0x5f8068.innerHTML = "";
    const _0x1b2891 = (_0x15d8f0 - 1) * _0x5c66e8;
    const _0x4489e4 = _0x1b2891 + _0x5c66e8;
    const _0x43f222 = _0x235017.slice(_0x1b2891, _0x4489e4);
    for (const _0x33b395 of _0x43f222) {
      const _0x42233b = _0x22242d[_0x33b395];
      const _0x2f6842 = await createPresetCard({
        presetName: _0x33b395,
        preset: _0x42233b,
        isSelected: _0x33b395 === _0x39dc93,
        imageIdField: _0x5b585f,
        defaultPresetName: _0x12bf9e,
        presets: _0x22242d,
        settings: _0x123373,
        currentPresetIdKey: _0x2be7eb,
        onCardClick: _0xde746c,
        onRefreshGrid: () => {
          _0x33eb5b();
          _0x501da8();
        },
        onRefresh: _0x283b23,
        loadPresetData: _0x2564a6
      });
      _0x5f8068.appendChild(_0x2f6842);
    }
    _0x4ca76b();
    _0x5f8068.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    _0x5f8068.style.opacity = "1";
    _0x5f8068.style.transform = "translateY(0)";
  }
  async function _0x537ac4() {
    _0x33eb5b();
    await _0x501da8();
  }
  const _0xde746c = (_0x381214, _0x40a901) => {
    if (_0x102a98) {
      if (_0x381214 === _0x12bf9e) {
        toastr.warning("不能删除默认预设");
        return;
      }
      if (_0x4388dc.has(_0x381214)) {
        _0x4388dc.delete(_0x381214);
        _0x40a901.classList.remove("selected-for-delete");
      } else {
        _0x4388dc.add(_0x381214);
        _0x40a901.classList.add("selected-for-delete");
      }
      _0xd24ce5();
    } else {
      _0x123373[_0x2be7eb] = _0x381214;
      saveSettingsDebounced();
      if (_0x2564a6) {
        _0x2564a6(_0x381214);
      }
      if (_0x283b23) {
        _0x283b23();
      }
      if (_0x4568c6) {
        _0x4568c6(_0x381214);
      }
      _0x9003cd.removeChild(_0xf878b8);
    }
  };
  _0x45c325.onclick = () => {
    if (_0x15d8f0 > 1) {
      _0x15d8f0--;
      _0x501da8();
    }
  };
  _0x1b2ba8.onclick = () => {
    const _0x5cd3a6 = Math.ceil(_0x235017.length / _0x5c66e8) || 1;
    if (_0x15d8f0 < _0x5cd3a6) {
      _0x15d8f0++;
      _0x501da8();
    }
  };
  _0x1bb926.onchange = _0x26f75f => {
    _0x5c66e8 = parseInt(_0x26f75f.target.value);
    _0x15d8f0 = 1;
    _0x501da8();
  };
  _0x9003cd.appendChild(_0xf878b8);
  _0x33eb5b();
  await _0x501da8();
}
async function createPresetCard(_0xcb40e8) {
  const {
    presetName: _0x384a82,
    preset: _0x5bf704,
    isSelected: _0x3af61a,
    imageIdField: _0x28b209,
    defaultPresetName: _0x56c12a,
    presets: _0x252b35,
    settings: _0x3f1fa1,
    currentPresetIdKey: _0xdf5a84,
    onCardClick: _0x5593a3,
    onRefreshGrid: _0x574ff9,
    onRefresh: _0x398b50,
    loadPresetData: _0xb6471d
  } = _0xcb40e8;
  const _0x2b5004 = document.createElement("div");
  _0x2b5004.className = "st-chatu8-preset-card" + (_0x3af61a ? " selected" : "");
  const _0x4119be = document.createElement("div");
  _0x4119be.className = "st-chatu8-preset-card-image";
  let _0x3b0836 = null;
  const _0x249d74 = _0x5bf704?.[_0x28b209] || [];
  if (_0x249d74.length > 0) {
    const _0x1c83b7 = _0x249d74[_0x249d74.length - 1];
    try {
      _0x3b0836 = await getConfigImage(_0x1c83b7);
    } catch (_0x50094d) {
      console.warn("加载预设预览图失败:", _0x50094d);
    }
  }
  if (!_0x3b0836 && _0x5bf704?.previewImageId) {
    try {
      _0x3b0836 = await getConfigImage(_0x5bf704.previewImageId);
    } catch (_0x3acdd1) {
      console.warn("加载预设预览图失败:", _0x3acdd1);
    }
  }
  if (_0x3b0836) {
    const _0x4edb25 = document.createElement("img");
    _0x4edb25.src = _0x3b0836;
    _0x4edb25.alt = _0x384a82;
    _0x4119be.appendChild(_0x4edb25);
  } else {
    addPlaceholder(_0x4119be);
  }
  const _0x3d6c77 = document.createElement("div");
  _0x3d6c77.className = "st-chatu8-preset-card-actions";
  const _0x50a1b0 = document.createElement("button");
  _0x50a1b0.className = "st-chatu8-preset-action-btn";
  _0x50a1b0.title = "上传/修改预览图";
  _0x50a1b0.innerHTML = "<i class=\"fa-solid fa-image\"></i>";
  _0x50a1b0.onclick = _0x26cb9a => {
    _0x26cb9a.stopPropagation();
    handleImageUpload(_0x384a82, _0x252b35, _0x28b209, _0x4119be);
  };
  _0x3d6c77.appendChild(_0x50a1b0);
  if (_0x3b0836) {
    const _0x31efd9 = document.createElement("button");
    _0x31efd9.className = "st-chatu8-preset-action-btn danger";
    _0x31efd9.title = "删除预览图";
    _0x31efd9.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";
    _0x31efd9.onclick = async _0xd3933d => {
      _0xd3933d.stopPropagation();
      if (confirm("确定要删除预设 \"" + _0x384a82 + "\" 的预览图吗？")) {
        const _0x48e333 = _0x5bf704?.[_0x28b209] || [];
        for (const _0x49143c of _0x48e333) {
          await deleteConfigImage(_0x49143c);
        }
        if (_0x5bf704?.previewImageId) {
          await deleteConfigImage(_0x5bf704.previewImageId);
          delete _0x5bf704.previewImageId;
        }
        _0x5bf704[_0x28b209] = [];
        saveSettingsDebounced();
        refreshCardImage(_0x4119be, null);
      }
    };
    _0x3d6c77.appendChild(_0x31efd9);
  }
  const _0x5eaf72 = document.createElement("button");
  _0x5eaf72.className = "st-chatu8-preset-action-btn";
  _0x5eaf72.title = "重命名预设";
  _0x5eaf72.innerHTML = "<i class=\"fa-solid fa-pen-nib\"></i>";
  _0x5eaf72.onclick = async _0x52e4fd => {
    _0x52e4fd.stopPropagation();
    if (_0x384a82 === _0x56c12a) {
      alert("默认预设不能重命名");
      return;
    }
    const _0x5024cb = prompt("请输入新的预设名称 (当前: " + _0x384a82 + "):", _0x384a82);
    if (_0x5024cb && _0x5024cb !== _0x384a82) {
      if (_0x252b35[_0x5024cb]) {
        alert("该名称已存在，请使用其他名称。");
        return;
      }
      _0x252b35[_0x5024cb] = _0x252b35[_0x384a82];
      delete _0x252b35[_0x384a82];
      if (_0x3f1fa1[_0xdf5a84] === _0x384a82) {
        _0x3f1fa1[_0xdf5a84] = _0x5024cb;
      }
      if (_0x3f1fa1.characterEnablePresets) {
        for (const _0x4a0606 in _0x3f1fa1.characterEnablePresets) {
          const _0xef8f82 = _0x3f1fa1.characterEnablePresets[_0x4a0606];
          if (_0xef8f82.characters && Array.isArray(_0xef8f82.characters)) {
            const _0x35671b = _0xef8f82.characters.indexOf(_0x384a82);
            if (_0x35671b !== -1) {
              _0xef8f82.characters[_0x35671b] = _0x5024cb;
              console.log("[CharacterVisualSelector] 已更新 characterEnablePresets[" + _0x4a0606 + "] 中的角色 ID: " + _0x384a82 + " -> " + _0x5024cb);
            }
          }
        }
      }
      if (_0x3f1fa1.characterCommonPresets) {
        for (const _0x43458e in _0x3f1fa1.characterCommonPresets) {
          const _0x297e57 = _0x3f1fa1.characterCommonPresets[_0x43458e];
          if (_0x297e57.characters && Array.isArray(_0x297e57.characters)) {
            const _0x559870 = _0x297e57.characters.indexOf(_0x384a82);
            if (_0x559870 !== -1) {
              _0x297e57.characters[_0x559870] = _0x5024cb;
              console.log("[CharacterVisualSelector] 已更新 characterCommonPresets[" + _0x43458e + "] 中的角色 ID: " + _0x384a82 + " -> " + _0x5024cb);
            }
          }
        }
      }
      if (_0x3f1fa1.outfitEnablePresets) {
        for (const _0x50d75e in _0x3f1fa1.outfitEnablePresets) {
          const _0x208381 = _0x3f1fa1.outfitEnablePresets[_0x50d75e];
          if (_0x208381.outfits && Array.isArray(_0x208381.outfits)) {
            const _0x53353c = _0x208381.outfits.indexOf(_0x384a82);
            if (_0x53353c !== -1) {
              _0x208381.outfits[_0x53353c] = _0x5024cb;
              console.log("[CharacterVisualSelector] 已更新 outfitEnablePresets[" + _0x50d75e + "] 中的服装 ID: " + _0x384a82 + " -> " + _0x5024cb);
            }
          }
        }
      }
      if (_0x3f1fa1.characterPresets) {
        for (const _0x152961 in _0x3f1fa1.characterPresets) {
          const _0xd80acb = _0x3f1fa1.characterPresets[_0x152961];
          if (_0xd80acb.outfits && Array.isArray(_0xd80acb.outfits)) {
            const _0xf36e78 = _0xd80acb.outfits.indexOf(_0x384a82);
            if (_0xf36e78 !== -1) {
              _0xd80acb.outfits[_0xf36e78] = _0x5024cb;
              console.log("[CharacterVisualSelector] 已更新 characterPresets[" + _0x152961 + "].outfits 中的服装 ID: " + _0x384a82 + " -> " + _0x5024cb);
            }
          }
        }
      }
      saveSettingsDebounced();
      if (_0x398b50) {
        _0x398b50();
      }
      await _0x574ff9();
    }
  };
  _0x3d6c77.appendChild(_0x5eaf72);
  const _0x1ff369 = document.createElement("button");
  _0x1ff369.className = "st-chatu8-preset-action-btn danger";
  _0x1ff369.title = "删除此预设";
  _0x1ff369.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
  _0x1ff369.onclick = async _0x5a6693 => {
    _0x5a6693.stopPropagation();
    if (_0x384a82 === _0x56c12a) {
      alert("默认预设不能删除");
      return;
    }
    if (confirm("确定要彻底删除预设 \"" + _0x384a82 + "\" 吗？此操作不可恢复！")) {
      const _0x1958ae = _0x5bf704?.[_0x28b209] || [];
      for (const _0x466cca of _0x1958ae) {
        await deleteConfigImage(_0x466cca);
      }
      if (_0x5bf704?.previewImageId) {
        await deleteConfigImage(_0x5bf704.previewImageId);
      }
      delete _0x252b35[_0x384a82];
      const _0x494c71 = _0x3f1fa1[_0xdf5a84] === _0x384a82;
      if (_0x494c71) {
        _0x3f1fa1[_0xdf5a84] = _0x56c12a;
        if (_0xb6471d) {
          _0xb6471d(_0x56c12a);
        }
      }
      saveSettingsDebounced();
      if (_0x398b50) {
        _0x398b50();
      }
      if (_0x494c71) {
        const _0x4852ce = _0x2b5004.closest(".st-chatu8-workflow-viz-backdrop");
        if (_0x4852ce && _0x4852ce.parentNode) {
          _0x4852ce.parentNode.removeChild(_0x4852ce);
        }
      } else {
        await _0x574ff9();
      }
    }
  };
  _0x3d6c77.appendChild(_0x1ff369);
  _0x4119be.appendChild(_0x3d6c77);
  _0x2b5004.appendChild(_0x4119be);
  const _0x41013a = document.createElement("div");
  _0x41013a.className = "st-chatu8-preset-card-name";
  _0x41013a.textContent = _0x384a82;
  _0x2b5004.appendChild(_0x41013a);
  _0x2b5004.onclick = () => _0x5593a3(_0x384a82, _0x2b5004);
  return _0x2b5004;
}
function addPlaceholder(_0x4d543d) {
  const _0x43b8ce = document.createElement("div");
  _0x43b8ce.className = "st-chatu8-preset-card-placeholder";
  _0x43b8ce.innerHTML = "<i class=\"fa-solid fa-image\"></i>";
  _0x4d543d.appendChild(_0x43b8ce);
}
async function refreshCardImage(_0x205700, _0x568893) {
  const _0xbc5eb3 = _0x205700.querySelector(".st-chatu8-preset-card-actions");
  _0x205700.innerHTML = "";
  if (_0x568893) {
    const _0x455588 = document.createElement("img");
    _0x455588.src = _0x568893;
    _0x205700.appendChild(_0x455588);
  } else {
    addPlaceholder(_0x205700);
  }
  if (_0xbc5eb3) {
    _0x205700.appendChild(_0xbc5eb3);
  }
}
function handleImageUpload(_0x4bb0ce, _0xaa62e, _0x3bb566, _0x346f24) {
  const _0x56868f = document.createElement("input");
  _0x56868f.type = "file";
  _0x56868f.accept = "image/*";
  _0x56868f.onchange = async _0x5f1e79 => {
    const _0x121a04 = _0x5f1e79.target.files[0];
    if (!_0x121a04) {
      return;
    }
    try {
      const _0x5ead91 = new FileReader();
      _0x5ead91.onload = async _0x3d67ba => {
        const _0x77efdc = _0x3d67ba.target.result;
        const _0xdcb7b8 = await saveConfigImage(_0x77efdc, {
          format: _0x121a04.type.split("/")[1] || "png",
          filename: "preset_" + _0x4bb0ce + "_preview"
        });
        if (!_0xaa62e[_0x4bb0ce]) {
          _0xaa62e[_0x4bb0ce] = {};
        }
        if (!_0xaa62e[_0x4bb0ce][_0x3bb566]) {
          _0xaa62e[_0x4bb0ce][_0x3bb566] = [];
        }
        _0xaa62e[_0x4bb0ce][_0x3bb566].push(_0xdcb7b8);
        saveSettingsDebounced();
        refreshCardImage(_0x346f24, _0x77efdc);
      };
      _0x5ead91.readAsDataURL(_0x121a04);
    } catch (_0x34a11a) {
      console.error("上传预览图失败:", _0x34a11a);
      alert("上传预览图失败: " + _0x34a11a.message);
    }
  };
  _0x56868f.click();
}