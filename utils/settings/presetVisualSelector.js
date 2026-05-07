import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { saveConfigImage, getConfigImage, deleteConfigImage } from "../configDatabase.js";
import { getSuffix } from "../ui_common.js";
export async function showPresetVisualSelector(_0x16d115, _0x49f458, _0x11fb17) {
  const _0x4d211 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x24b778 = document.createElement("div");
  _0x24b778.className = "st-chatu8-workflow-viz-backdrop";
  const _0x3703a3 = new Set();
  let _0x46a8b4 = false;
  let _0x41cfc7 = 1;
  let _0x4391d9 = _0x49f458.presetVisualPageSize || 12;
  let _0x44a340 = [];
  let _0x18748a = _0x49f458.presetVisualGridColumns || 6;
  _0x24b778.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-preset-viz-dialog-wrapper\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>选择提示词预设</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-toolbar\" style=\"justify-content: space-between; align-items: center; gap: 15px;\">\n                <div class=\"st-chatu8-viz-search-container\" style=\"position: relative; flex-grow: 1; max-width: 300px;\">\n                    <i class=\"fa-solid fa-search\" style=\"position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none;\"></i>\n                    <input type=\"text\" class=\"st-chatu8-viz-search-input\" placeholder=\"搜索预设...\" style=\"width: 100%; padding: 8px 12px 8px 36px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: white; outline: none; transition: all 0.3s;\">\n                </div>\n                <div style=\"display: flex; gap: 10px;\">\n                    <div class=\"st-chatu8-viz-bulk-delete\" style=\"cursor: pointer; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9em; user-select: none; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all 0.3s;\">\n                        <i class=\"fa-solid fa-trash-can\"></i> <span>批量删除</span>\n                    </div>\n                     <div class=\"st-chatu8-viz-confirm-delete\" style=\"display: none; cursor: pointer; padding: 6px 14px; background: var(--st-chatu8-danger-primary, #d9534f); border-radius: 20px; font-size: 0.9em; user-select: none; white-space: nowrap; align-items: center; gap: 6px; transition: all 0.3s; color: white;\">\n                        <i class=\"fa-solid fa-check\"></i> <span>确认删除 (0)</span>\n                    </div>\n                    <div class=\"st-chatu8-viz-mode-toggle\" style=\"cursor: pointer; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9em; user-select: none; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all 0.3s;\">\n                        <i class=\"fa-solid fa-pen-to-square\"></i> <span>管理</span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"st-chatu8-pagination-container\" style=\"display: flex; justify-content: center; align-items: center; gap: 12px; padding: 12px 20px; background: rgba(30, 30, 46, 0.6); border-bottom: 1px solid rgba(255,255,255,0.05);\">\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-prev\" title=\"上一页\" style=\"padding: 6px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #ccc; cursor: pointer; transition: all 0.2s;\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-info\" style=\"display: flex; align-items: center; gap: 8px; color: #aaa; font-size: 0.9em;\">\n                    <span class=\"st-chatu8-pagination-current\">1</span>\n                    <span>/</span>\n                    <span class=\"st-chatu8-pagination-total\">1</span>\n                    <span style=\"margin-left: 8px; color: #666;\">|</span>\n                    <span style=\"margin-left: 8px;\">共 <span class=\"st-chatu8-pagination-count\">0</span> 个</span>\n                </div>\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-next\" title=\"下一页\" style=\"padding: 6px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #ccc; cursor: pointer; transition: all 0.2s;\">\n                    <i class=\"fa-solid fa-chevron-right\"></i>\n                </button>\n                <div style=\"margin-left: 16px; display: flex; align-items: center; gap: 6px;\">\n                    <span style=\"color: #888; font-size: 0.85em;\">每页</span>\n                    <select class=\"st-chatu8-pagination-size\" style=\"padding: 4px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #ccc; cursor: pointer; font-size: 0.85em;\">\n                        <option value=\"8\" " + (_0x4391d9 === 8 ? "selected" : "") + ">8</option>\n                        <option value=\"12\" " + (_0x4391d9 === 12 ? "selected" : "") + ">12</option>\n                        <option value=\"16\" " + (_0x4391d9 === 16 ? "selected" : "") + ">16</option>\n                        <option value=\"24\" " + (_0x4391d9 === 24 ? "selected" : "") + ">24</option>\n                        <option value=\"48\" " + (_0x4391d9 === 48 ? "selected" : "") + ">48</option>\n                    </select>\n                </div>\n                <div style=\"margin-left: 16px; display: flex; align-items: center; gap: 6px;\">\n                    <span style=\"color: #888; font-size: 0.85em;\">每行</span>\n                    <select class=\"st-chatu8-grid-columns-select\" style=\"padding: 4px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #ccc; cursor: pointer; font-size: 0.85em;\">\n                        <option value=\"4\" " + (_0x18748a === 4 ? "selected" : "") + ">4</option>\n                        <option value=\"6\" " + (_0x18748a === 6 ? "selected" : "") + ">6</option>\n                        <option value=\"8\" " + (_0x18748a === 8 ? "selected" : "") + ">8</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\">\n                <div class=\"st-chatu8-workflow-viz-container st-chatu8-preset-viz-container\">\n                    <div class=\"st-chatu8-preset-grid\"></div>\n                </div>\n            </div>\n        </div>\n    ";
  const _0x2fcec8 = _0x24b778.querySelector(".st-chatu8-workflow-viz-close");
  _0x2fcec8.onclick = () => _0x4d211.removeChild(_0x24b778);
  _0x24b778.onclick = _0x193d30 => {
    if (_0x193d30.target === _0x24b778) {
      _0x4d211.removeChild(_0x24b778);
    }
  };
  const _0x5b928f = _0x24b778.querySelector(".st-chatu8-viz-search-input");
  let _0x340964 = "";
  _0x5b928f.oninput = _0x580ab7 => {
    _0x340964 = _0x580ab7.target.value.toLowerCase();
    _0x41cfc7 = 1;
    _0x15fe38();
    _0x527a16();
  };
  const _0x2bc525 = _0x24b778.querySelector(".st-chatu8-preset-viz-dialog-wrapper");
  const _0x36b3a4 = _0x24b778.querySelector(".st-chatu8-viz-bulk-delete");
  const _0x2fd650 = _0x24b778.querySelector(".st-chatu8-viz-confirm-delete");
  const _0x142418 = _0x24b778.querySelector(".st-chatu8-viz-mode-toggle");
  _0x142418.onclick = () => {
    if (_0x46a8b4) {
      _0x4f42fa();
    }
    _0x2bc525.classList.toggle("st-chatu8-mode-manage");
    const _0x15ea5c = _0x2bc525.classList.contains("st-chatu8-mode-manage");
    _0x142418.style.background = _0x15ea5c ? "var(--st-chatu8-accent-primary)" : "rgba(255,255,255,0.1)";
    _0x142418.style.color = _0x15ea5c ? "white" : "inherit";
  };
  function _0x4f42fa() {
    _0x46a8b4 = false;
    _0x3703a3.clear();
    _0x2bc525.classList.remove("st-chatu8-mode-bulk-delete");
    _0x36b3a4.style.background = "rgba(255,255,255,0.1)";
    _0x36b3a4.style.color = "inherit";
    _0x36b3a4.querySelector("span").textContent = "批量删除";
    _0x2fd650.style.display = "none";
    const _0x522bc8 = _0x24b778.querySelectorAll(".st-chatu8-preset-card");
    _0x522bc8.forEach(_0x34a1a0 => _0x34a1a0.classList.remove("selected-for-delete"));
  }
  _0x36b3a4.onclick = () => {
    if (_0x2bc525.classList.contains("st-chatu8-mode-manage")) {
      _0x2bc525.classList.remove("st-chatu8-mode-manage");
      _0x142418.style.background = "rgba(255,255,255,0.1)";
      _0x142418.style.color = "inherit";
    }
    _0x46a8b4 = !_0x46a8b4;
    if (_0x46a8b4) {
      _0x2bc525.classList.add("st-chatu8-mode-bulk-delete");
      _0x36b3a4.style.background = "var(--st-chatu8-danger-primary, #d9534f)";
      _0x36b3a4.style.color = "white";
      _0x36b3a4.querySelector("span").textContent = "取消删除";
      _0x2fd650.style.display = "flex";
      _0x407ab1();
    } else {
      _0x4f42fa();
    }
  };
  function _0x407ab1() {
    _0x2fd650.querySelector("span").textContent = "确认删除 (" + _0x3703a3.size + ")";
  }
  _0x2fd650.onclick = async () => {
    if (_0x3703a3.size === 0) {
      return;
    }
    if (confirm("确定要删除选中的 " + _0x3703a3.size + " 个预设吗？此操作不可恢复！")) {
      let _0x293b7b = 0;
      for (const _0x368957 of _0x3703a3) {
        const _0x10d27d = _0x49f458.yushe[_0x368957];
        if (_0x10d27d && _0x10d27d.previewImageId) {
          try {
            await deleteConfigImage(_0x10d27d.previewImageId);
          } catch (_0x534dea) {
            console.warn("Failed to delete image for " + _0x368957);
          }
        }
        if (_0x49f458.yushe[_0x368957]) {
          delete _0x49f458.yushe[_0x368957];
          _0x293b7b++;
        }
        const _0x345db2 = getSuffix(_0x16d115);
        const _0x40bfd0 = "yusheid" + (_0x16d115 === "sd" ? "_sd" : _0x345db2);
        if (_0x49f458[_0x40bfd0] === _0x368957) {
          _0x49f458[_0x40bfd0] = "默认";
        }
      }
      await saveSettingsDebounced();
      alert("成功删除 " + _0x293b7b + " 个预设。");
      _0x4f42fa();
      _0x15fe38();
      const _0x3e782f = Math.ceil(_0x44a340.length / _0x4391d9) || 1;
      if (_0x41cfc7 > _0x3e782f) {
        _0x41cfc7 = _0x3e782f;
      }
      _0x527a16();
    }
  };
  _0x4d211.appendChild(_0x24b778);
  const _0x21a76c = _0x24b778.querySelector(".st-chatu8-preset-grid");
  const _0x469a4b = getSuffix(_0x16d115);
  const _0x1a18b9 = "yusheid" + (_0x16d115 === "sd" ? "_sd" : _0x469a4b);
  const _0x1cb384 = _0x49f458[_0x1a18b9];
  const _0x10eae8 = _0x49f458.yushe || {};
  const _0x5bbe36 = Object.keys(_0x10eae8);
  const _0x5f5c66 = _0x24b778.querySelector(".st-chatu8-pagination-prev");
  const _0x56f43f = _0x24b778.querySelector(".st-chatu8-pagination-next");
  const _0xa5415c = _0x24b778.querySelector(".st-chatu8-pagination-current");
  const _0x15b464 = _0x24b778.querySelector(".st-chatu8-pagination-total");
  const _0x280c84 = _0x24b778.querySelector(".st-chatu8-pagination-count");
  const _0x364145 = _0x24b778.querySelector(".st-chatu8-pagination-size");
  const _0x26bc2e = _0x24b778.querySelector(".st-chatu8-grid-columns-select");
  function _0x15fe38() {
    if (_0x340964) {
      _0x44a340 = _0x5bbe36.filter(_0x5eb48c => _0x5eb48c.toLowerCase().includes(_0x340964));
    } else {
      _0x44a340 = [..._0x5bbe36];
    }
  }
  function _0x55af8d() {
    if (window.innerWidth > 1400) {
      _0x21a76c.style.columnCount = _0x18748a;
    } else {
      _0x21a76c.style.columnCount = "";
    }
  }
  function _0x36c484() {
    const _0x50ceb3 = Math.ceil(_0x44a340.length / _0x4391d9) || 1;
    _0xa5415c.textContent = _0x41cfc7;
    _0x15b464.textContent = _0x50ceb3;
    _0x280c84.textContent = _0x44a340.length;
    _0x5f5c66.disabled = _0x41cfc7 <= 1;
    _0x5f5c66.style.opacity = _0x41cfc7 <= 1 ? "0.5" : "1";
    _0x5f5c66.style.cursor = _0x41cfc7 <= 1 ? "not-allowed" : "pointer";
    _0x56f43f.disabled = _0x41cfc7 >= _0x50ceb3;
    _0x56f43f.style.opacity = _0x41cfc7 >= _0x50ceb3 ? "0.5" : "1";
    _0x56f43f.style.cursor = _0x41cfc7 >= _0x50ceb3 ? "not-allowed" : "pointer";
  }
  async function _0x527a16() {
    _0x21a76c.style.opacity = "0";
    _0x21a76c.style.transform = "translateY(10px)";
    await new Promise(_0x53fadf => setTimeout(_0x53fadf, 150));
    _0x21a76c.innerHTML = "";
    const _0x3fd257 = (_0x41cfc7 - 1) * _0x4391d9;
    const _0x258994 = _0x3fd257 + _0x4391d9;
    const _0x24cb40 = _0x44a340.slice(_0x3fd257, _0x258994);
    for (const _0xed5c95 of _0x24cb40) {
      const _0x26551f = _0x10eae8[_0xed5c95];
      const _0x4c5730 = await createPresetCard(_0xed5c95, _0x26551f, _0xed5c95 === _0x1cb384, _0x49f458, _0x16d115, _0x17f9d5);
      _0x21a76c.appendChild(_0x4c5730);
    }
    _0x36c484();
    _0x21a76c.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    _0x21a76c.style.opacity = "1";
    _0x21a76c.style.transform = "translateY(0)";
  }
  const _0x17f9d5 = (_0x519d00, _0x157811) => {
    if (_0x46a8b4) {
      if (_0x3703a3.has(_0x519d00)) {
        _0x3703a3.delete(_0x519d00);
        _0x157811.classList.remove("selected-for-delete");
      } else {
        _0x3703a3.add(_0x519d00);
        _0x157811.classList.add("selected-for-delete");
      }
      _0x407ab1();
    } else {
      _0x11fb17(_0x519d00);
      _0x4d211.removeChild(_0x24b778);
    }
  };
  _0x5f5c66.onclick = () => {
    if (_0x41cfc7 > 1) {
      _0x41cfc7--;
      _0x527a16();
    }
  };
  _0x56f43f.onclick = () => {
    const _0x1807fc = Math.ceil(_0x44a340.length / _0x4391d9) || 1;
    if (_0x41cfc7 < _0x1807fc) {
      _0x41cfc7++;
      _0x527a16();
    }
  };
  _0x364145.onchange = _0x607147 => {
    _0x4391d9 = parseInt(_0x607147.target.value);
    _0x49f458.presetVisualPageSize = _0x4391d9;
    saveSettingsDebounced();
    _0x41cfc7 = 1;
    _0x527a16();
  };
  _0x26bc2e.onchange = _0x42fa9d => {
    _0x18748a = parseInt(_0x42fa9d.target.value);
    _0x49f458.presetVisualGridColumns = _0x18748a;
    saveSettingsDebounced();
    _0x55af8d();
  };
  _0x4d211.appendChild(_0x24b778);
  const _0x15eab5 = () => _0x55af8d();
  window.addEventListener("resize", _0x15eab5);
  const _0x4d8bfa = _0x24b778.remove.bind(_0x24b778);
  _0x24b778.remove = function () {
    window.removeEventListener("resize", _0x15eab5);
    _0x4d8bfa();
  };
  _0x15fe38();
  _0x55af8d();
  _0x527a16();
}
async function createPresetCard(_0x4b9d5a, _0x1ae84e, _0x4bb084, _0x25ab6a, _0x5e7c80, _0x2a2e21) {
  const _0x45d3e5 = document.createElement("div");
  _0x45d3e5.className = "st-chatu8-preset-card" + (_0x4bb084 ? " selected" : "");
  const _0x737586 = document.createElement("div");
  _0x737586.className = "st-chatu8-preset-card-image";
  const _0x19bbb6 = _0x1ae84e.previewImageId;
  if (_0x19bbb6) {
    try {
      const _0x4bccf3 = await getConfigImage(_0x19bbb6);
      if (_0x4bccf3) {
        const _0x9a742a = document.createElement("img");
        _0x9a742a.src = _0x4bccf3;
        _0x9a742a.alt = _0x4b9d5a;
        _0x737586.appendChild(_0x9a742a);
      } else {
        addPlaceholder(_0x737586);
      }
    } catch (_0x219015) {
      console.error("加载预设预览图失败:", _0x219015);
      addPlaceholder(_0x737586);
    }
  } else {
    addPlaceholder(_0x737586);
  }
  const _0x3dda75 = document.createElement("div");
  _0x3dda75.className = "st-chatu8-preset-card-actions";
  const _0x4c2d71 = document.createElement("button");
  _0x4c2d71.className = "st-chatu8-preset-action-btn";
  _0x4c2d71.title = "上传/修改预览图 (Upload Preview)";
  _0x4c2d71.innerHTML = "<i class=\"fa-solid fa-image\"></i>";
  _0x4c2d71.onclick = _0x3d21db => {
    _0x3d21db.stopPropagation();
    handleImageUpload(_0x4b9d5a, _0x25ab6a, _0x737586);
  };
  _0x3dda75.appendChild(_0x4c2d71);
  if (_0x19bbb6) {
    const _0xc3767f = document.createElement("button");
    _0xc3767f.className = "st-chatu8-preset-action-btn danger";
    _0xc3767f.title = "删除预览图 (Delete Preview)";
    _0xc3767f.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";
    _0xc3767f.onclick = async _0x5ac273 => {
      _0x5ac273.stopPropagation();
      if (confirm("确定要删除预设 \"" + _0x4b9d5a + "\" 的预览图吗？")) {
        await deleteConfigImage(_0x19bbb6);
        delete _0x1ae84e.previewImageId;
        saveSettingsDebounced();
        refreshCardImage(_0x737586, null);
      }
    };
    _0x3dda75.appendChild(_0xc3767f);
  }
  const _0x5bd18f = document.createElement("button");
  _0x5bd18f.className = "st-chatu8-preset-action-btn";
  _0x5bd18f.title = "重命名预设 (Rename Preset)";
  _0x5bd18f.innerHTML = "<i class=\"fa-solid fa-pen-nib\"></i>";
  _0x5bd18f.onclick = _0x18f441 => {
    _0x18f441.stopPropagation();
    const _0x57cc47 = prompt("请输入新的预设名称 (Current: " + _0x4b9d5a + "):", _0x4b9d5a);
    if (_0x57cc47 && _0x57cc47 !== _0x4b9d5a) {
      if (_0x25ab6a.yushe[_0x57cc47]) {
        alert("该名称已存在，请使用其他名称。");
        return;
      }
      _0x25ab6a.yushe[_0x57cc47] = _0x25ab6a.yushe[_0x4b9d5a];
      delete _0x25ab6a.yushe[_0x4b9d5a];
      const _0x14fff5 = getSuffix(_0x5e7c80);
      const _0x438a1b = "yusheid" + (_0x5e7c80 === "sd" ? "_sd" : _0x14fff5);
      if (_0x25ab6a[_0x438a1b] === _0x4b9d5a) {
        _0x25ab6a[_0x438a1b] = _0x57cc47;
      }
      saveSettingsDebounced();
      const _0x2444e9 = document.querySelector(".st-chatu8-workflow-viz-backdrop");
      if (_0x2444e9) {
        _0x2444e9.parentNode.removeChild(_0x2444e9);
      }
      showPresetVisualSelector(_0x5e7c80, _0x25ab6a, _0x73ef93 => _0x2a2e21(_0x73ef93, null)).then(() => {});
    }
  };
  _0x3dda75.appendChild(_0x5bd18f);
  const _0x31cc1c = document.createElement("button");
  _0x31cc1c.className = "st-chatu8-preset-action-btn danger";
  _0x31cc1c.title = "删除此预设 (Delete Preset)";
  _0x31cc1c.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
  _0x31cc1c.onclick = _0x28cd8f => {
    _0x28cd8f.stopPropagation();
    if (confirm("确定要彻底删除预设 \"" + _0x4b9d5a + "\" 吗？此操作不可恢复！")) {
      if (_0x1ae84e.previewImageId) {
        deleteConfigImage(_0x1ae84e.previewImageId);
      }
      delete _0x25ab6a.yushe[_0x4b9d5a];
      const _0x1b45cd = getSuffix(_0x5e7c80);
      const _0x4956fd = "yusheid" + (_0x5e7c80 === "sd" ? "_sd" : _0x1b45cd);
      const _0x512aee = _0x25ab6a[_0x4956fd] === _0x4b9d5a;
      if (_0x512aee) {
        _0x25ab6a[_0x4956fd] = "默认";
      }
      saveSettingsDebounced();
      const _0x443af1 = document.querySelector(".st-chatu8-workflow-viz-backdrop");
      if (_0x443af1) {
        _0x443af1.parentNode.removeChild(_0x443af1);
      }
      if (_0x512aee && typeof window.loadSilterTavernChatu8Settings === "function") {
        window.loadSilterTavernChatu8Settings();
      }
    }
  };
  _0x3dda75.appendChild(_0x31cc1c);
  _0x737586.appendChild(_0x3dda75);
  _0x45d3e5.appendChild(_0x737586);
  const _0x1f7e1b = document.createElement("div");
  _0x1f7e1b.className = "st-chatu8-preset-card-name";
  _0x1f7e1b.textContent = _0x4b9d5a;
  _0x45d3e5.appendChild(_0x1f7e1b);
  _0x45d3e5.onclick = () => _0x2a2e21(_0x4b9d5a, _0x45d3e5);
  return _0x45d3e5;
}
function addPlaceholder(_0x44692a) {
  const _0x5e1d99 = document.createElement("div");
  _0x5e1d99.className = "st-chatu8-preset-card-placeholder";
  _0x5e1d99.innerHTML = "<i class=\"fa-solid fa-image\"></i>";
  _0x44692a.appendChild(_0x5e1d99);
}
async function refreshCardImage(_0x143178, _0x4fc930) {
  const _0x3e6a54 = _0x143178.querySelector(".st-chatu8-preset-card-actions");
  _0x143178.innerHTML = "";
  if (_0x4fc930) {
    try {
      const _0x39da52 = await getConfigImage(_0x4fc930);
      if (_0x39da52) {
        const _0x504d9c = document.createElement("img");
        _0x504d9c.src = _0x39da52;
        _0x143178.appendChild(_0x504d9c);
      } else {
        addPlaceholder(_0x143178);
      }
    } catch (_0xe665ee) {
      addPlaceholder(_0x143178);
    }
  } else {
    addPlaceholder(_0x143178);
  }
  if (_0x3e6a54) {
    _0x143178.appendChild(_0x3e6a54);
  }
}
function handleImageUpload(_0x497405, _0x2a5157, _0x145fb4) {
  const _0xe584e1 = document.createElement("input");
  _0xe584e1.type = "file";
  _0xe584e1.accept = "image/*";
  _0xe584e1.onchange = async _0x3e6df2 => {
    const _0x5e2adc = _0x3e6df2.target.files[0];
    if (!_0x5e2adc) {
      return;
    }
    try {
      const _0x2ed581 = new FileReader();
      _0x2ed581.onload = async _0x397b85 => {
        const _0x3b293a = _0x397b85.target.result;
        const _0x38e736 = _0x2a5157.yushe[_0x497405]?.previewImageId;
        if (_0x38e736) {
          try {
            await deleteConfigImage(_0x38e736);
          } catch (_0x386cf1) {
            console.warn("删除旧预览图失败:", _0x386cf1);
          }
        }
        const _0x28b993 = await saveConfigImage(_0x3b293a, {
          format: _0x5e2adc.type.split("/")[1] || "png",
          filename: "preset_" + _0x497405 + "_preview"
        });
        if (!_0x2a5157.yushe[_0x497405]) {
          _0x2a5157.yushe[_0x497405] = {};
        }
        _0x2a5157.yushe[_0x497405].previewImageId = _0x28b993;
        saveSettingsDebounced();
        refreshCardImage(_0x145fb4, _0x28b993);
      };
      _0x2ed581.readAsDataURL(_0x5e2adc);
    } catch (_0xe2e0e5) {
      console.error("上传预览图失败:", _0xe2e0e5);
      alert("上传预览图失败: " + _0xe2e0e5.message);
    }
  };
  _0xe584e1.click();
}
async function deletePresetImage(_0x579a6a, _0x5410d) {
  const _0x3a9573 = _0x5410d.yushe[_0x579a6a]?.previewImageId;
  if (!_0x3a9573) {
    return;
  }
  try {
    await deleteConfigImage(_0x3a9573);
    delete _0x5410d.yushe[_0x579a6a].previewImageId;
    saveSettingsDebounced();
  } catch (_0x49110a) {
    console.error("删除预览图失败:", _0x49110a);
  }
}