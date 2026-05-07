import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { saveConfigImage, getConfigImage, deleteConfigImage } from "../configDatabase.js";
export function ensureVibeGroupPresets() {
  const _0x1a8b6e = extension_settings[extensionName];
  if (!_0x1a8b6e.vibeGroups || typeof _0x1a8b6e.vibeGroups !== "object" || Array.isArray(_0x1a8b6e.vibeGroups)) {
    if (_0x1a8b6e.vibeGroups) {
      console.error("[VibeGroup] Corrupted vibeGroups data detected, resetting to default:", _0x1a8b6e.vibeGroups);
    }
    _0x1a8b6e.vibeGroups = {
      默认组: {
        vibes: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };
    console.log("[VibeGroup] Initialized vibeGroups with default group");
  }
  for (const _0x396967 in _0x1a8b6e.vibeGroups) {
    const _0x5a35dd = _0x1a8b6e.vibeGroups[_0x396967];
    if (!_0x5a35dd || typeof _0x5a35dd !== "object") {
      console.error("[VibeGroup] Corrupted group data for:", _0x396967, "- removing");
      delete _0x1a8b6e.vibeGroups[_0x396967];
      continue;
    }
    if (!Array.isArray(_0x5a35dd.vibes)) {
      console.warn("[VibeGroup] Group missing vibes array:", _0x396967, "- initializing");
      _0x5a35dd.vibes = [];
    }
    if (typeof _0x5a35dd.createdAt !== "number") {
      _0x5a35dd.createdAt = Date.now();
    }
    if (typeof _0x5a35dd.updatedAt !== "number") {
      _0x5a35dd.updatedAt = Date.now();
    }
  }
  if (Object.keys(_0x1a8b6e.vibeGroups).length === 0) {
    console.warn("[VibeGroup] No valid groups found, creating default group");
    _0x1a8b6e.vibeGroups.默认组 = {
      vibes: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
  if (!_0x1a8b6e.vibeGroupId || !_0x1a8b6e.vibeGroups[_0x1a8b6e.vibeGroupId]) {
    const _0x5f4b61 = Object.keys(_0x1a8b6e.vibeGroups)[0];
    _0x1a8b6e.vibeGroupId = _0x5f4b61 || "默认组";
    console.log("[VibeGroup] Set vibeGroupId to:", _0x1a8b6e.vibeGroupId);
  }
  return _0x1a8b6e.vibeGroups;
}
export function showVibeGroupEditorDialog() {
  const _0x4f0bbd = document.getElementById("st-chatu8-settings") || document.body;
  const _0x1212d9 = extension_settings[extensionName];
  ensureVibeGroupPresets();
  const _0x5c0cc4 = document.createElement("div");
  _0x5c0cc4.className = "st-chatu8-workflow-viz-backdrop";
  _0x5c0cc4.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-vibe-group-editor-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>Vibe 组编辑器</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\" style=\"padding: 2rem;\">\n                <div class=\"st-chatu8-vibe-group-editor-content\">\n                    <!-- Group Preset Selector -->\n                    <div class=\"st-chatu8-field\" style=\"margin-bottom: 1.2rem;\">\n                        <label for=\"vibe-group-select\">Vibe 组预设</label>\n                        <div class=\"st-chatu8-profile-controls\">\n                            <select id=\"vibe-group-select\" class=\"st-chatu8-select\"></select>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-group-visual-select\" title=\"可视化选择\">\n                                <i class=\"fa-solid fa-grip\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-group-new\" title=\"新建组\">\n                                <i class=\"fa-solid fa-plus\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-group-save\" title=\"保存当前组\">\n                                <i class=\"fa-solid fa-save\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-group-export-current\" title=\"导出当前组\">\n                                <i class=\"fa-solid fa-upload\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-group-export-all\" title=\"导出全部组\">\n                                <i class=\"fa-solid fa-file-export\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-group-import\" title=\"导入组\">\n                                <i class=\"fa-solid fa-download\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn danger\" id=\"vibe-group-delete\" title=\"删除当前组\">\n                                <i class=\"fa-solid fa-trash\"></i>\n                            </button>\n                        </div>\n                    </div>\n\n                    <!-- Add Vibe Button -->\n                    <button type=\"button\" class=\"st-chatu8-btn\" id=\"vibe-group-add-vibe\" style=\"width: 100%; padding: 1rem; font-size: 16px; font-weight: 600; margin-bottom: 1.5rem;\">\n                        <i class=\"fa-solid fa-plus\"></i> 添加 Vibe (0/4)\n                    </button>\n\n                    <!-- Vibe Slots Container -->\n                    <div id=\"vibe-slots-container\" class=\"st-chatu8-vibe-slots\">\n                        <!-- Dynamically rendered slots (0-4) -->\n                    </div>\n\n                    <!-- Status Message Area -->\n                    <div id=\"vibe-group-status\" style=\"margin-top: 1.5rem; padding: 1rem; border-radius: 6px; font-size: 0.9rem; display: none; line-height: 1.4;\"></div>\n                </div>\n            </div>\n        </div>\n    ";
  _0x4f0bbd.appendChild(_0x5c0cc4);
  const _0x3240db = _0x5c0cc4.querySelector(".st-chatu8-workflow-viz-close");
  _0x3240db.onclick = () => _0x4f0bbd.removeChild(_0x5c0cc4);
  _0x5c0cc4.onclick = _0x20dbc3 => {
    if (_0x20dbc3.target === _0x5c0cc4) {
      _0x4f0bbd.removeChild(_0x5c0cc4);
    }
  };
  const _0x567389 = document.getElementById("vibe-group-select");
  const _0x53fc77 = document.getElementById("vibe-group-visual-select");
  const _0xfd4fbe = document.getElementById("vibe-group-new");
  const _0x44d5fe = document.getElementById("vibe-group-save");
  const _0x2ef8c0 = document.getElementById("vibe-group-delete");
  const _0x4764bb = document.getElementById("vibe-group-export-current");
  const _0xa32edc = document.getElementById("vibe-group-export-all");
  const _0x1ab68f = document.getElementById("vibe-group-import");
  const _0x3b43d1 = document.getElementById("vibe-group-add-vibe");
  const _0x1440aa = document.getElementById("vibe-slots-container");
  const _0x1020e9 = document.getElementById("vibe-group-status");
  loadGroupPresetList(_0x567389);
  _0x53fc77.onclick = () => {
    showVibeGroupVisualSelector(_0x44e783 => {
      _0x1212d9.vibeGroupId = _0x44e783;
      _0x567389.value = _0x44e783;
      renderVibeSlots(_0x1440aa, _0x567389, _0x3b43d1);
      try {
        saveSettingsDebounced();
        console.log("[VibeGroup] Selected preset from visual selector:", _0x44e783);
      } catch (_0x38c356) {
        console.error("[VibeGroup] Failed to save settings after preset selection:", {
          error: _0x38c356.message,
          errorName: _0x38c356.name,
          presetName: _0x44e783,
          timestamp: new Date().toISOString(),
          stack: _0x38c356.stack
        });
        alert("保存设置失败: " + _0x38c356.message);
      }
    });
  };
  _0xfd4fbe.onclick = () => createNewGroup(_0x567389, _0x1020e9, _0x1440aa, _0x3b43d1);
  _0x44d5fe.onclick = () => saveCurrentGroup(_0x567389, _0x1020e9);
  _0x2ef8c0.onclick = () => deleteCurrentGroup(_0x567389, _0x1020e9);
  _0x3b43d1.onclick = () => {
    const _0xe1b738 = extension_settings[extensionName];
    const _0x4cf1f7 = _0xe1b738.vibeGroups || {};
    const _0x419327 = _0x567389.value;
    const _0x3b5de2 = _0x4cf1f7[_0x419327];
    if (!_0x3b5de2) {
      showStatus(_0x1020e9, "错误: 未选择组。请先选择或创建一个组。", "error");
      console.error("[VibeGroup] No group selected when attempting to add Vibe");
      return;
    }
    const _0x504f55 = _0x3b5de2.vibes || [];
    if (_0x504f55.length >= 4) {
      showStatus(_0x1020e9, "已达到最大数量 (4个)。每个组最多可包含 4 个 Vibe。", "error");
      console.warn("[VibeGroup] Maximum Vibe limit reached for group:", _0x419327);
      return;
    }
    try {
      showVibeVisualSelector(_0x1ca863 => {
        try {
          if (!_0x1ca863 || typeof _0x1ca863 !== "string") {
            showStatus(_0x1020e9, "错误: 无效的 Vibe 数据 ID", "error");
            console.error("[VibeGroup] Invalid vibeDataId received:", _0x1ca863);
            return;
          }
          const _0x21768c = {
            vibeDataId: _0x1ca863,
            strength: 0.6
          };
          _0x3b5de2.vibes.push(_0x21768c);
          _0x3b5de2.updatedAt = Date.now();
          try {
            saveSettingsDebounced();
          } catch (_0x40634d) {
            console.error("[VibeGroup] Failed to save settings after adding Vibe:", {
              vibeDataId: _0x1ca863.substring(0, 12) + "...",
              error: _0x40634d.message,
              errorName: _0x40634d.name,
              groupId: _0x419327,
              timestamp: new Date().toISOString(),
              stack: _0x40634d.stack
            });
            showStatus(_0x1020e9, "错误: 保存设置失败 - " + _0x40634d.message, "error");
            return;
          }
          renderVibeSlots(_0x1440aa, _0x567389, _0x3b43d1);
          showStatus(_0x1020e9, "Vibe 已成功添加到组", "success");
          console.log("[VibeGroup] Successfully added Vibe to group:", _0x419327, _0x1ca863);
        } catch (_0x330fb2) {
          console.error("[VibeGroup] Error adding Vibe to group:", {
            error: _0x330fb2.message,
            errorName: _0x330fb2.name,
            groupId: _0x419327,
            timestamp: new Date().toISOString(),
            stack: _0x330fb2.stack
          });
          showStatus(_0x1020e9, "错误: 添加 Vibe 失败 - " + _0x330fb2.message, "error");
        }
      });
    } catch (_0x2b39c8) {
      console.error("[VibeGroup] Error opening visual selector:", {
        error: _0x2b39c8.message,
        errorName: _0x2b39c8.name,
        timestamp: new Date().toISOString(),
        stack: _0x2b39c8.stack
      });
      showStatus(_0x1020e9, "错误: 无法打开 Vibe 选择器 - " + _0x2b39c8.message, "error");
    }
  };
  _0x4764bb.onclick = async () => {
    const _0x5cf9b6 = _0x567389.value;
    if (!_0x5cf9b6) {
      showStatus(_0x1020e9, "错误: 未选择组。请先选择要导出的组。", "error");
      console.error("[VibeGroup] No group selected for export");
      return;
    }
    try {
      showStatus(_0x1020e9, "正在导出...", "info");
      await exportVibeGroup(_0x5cf9b6);
      showStatus(_0x1020e9, "已成功导出组 \"" + _0x5cf9b6 + "\"", "success");
      console.log("[VibeGroup] Successfully exported group:", _0x5cf9b6);
    } catch (_0x20287e) {
      const _0x4671d9 = _0x20287e.message || "未知错误";
      console.error("[VibeGroup] Export failed:", {
        groupId: _0x5cf9b6,
        error: _0x20287e.message,
        errorName: _0x20287e.name,
        timestamp: new Date().toISOString(),
        stack: _0x20287e.stack
      });
      showStatus(_0x1020e9, "导出失败: " + _0x4671d9 + "。请检查控制台以获取详细信息。", "error");
    }
  };
  _0xa32edc.onclick = async () => {
    const _0xed927c = extension_settings[extensionName];
    const _0x59ee16 = _0xed927c.vibeGroups || {};
    const _0x29b778 = Object.keys(_0x59ee16).length;
    if (_0x29b778 === 0) {
      showStatus(_0x1020e9, "错误: 没有可导出的组。请先创建至少一个组。", "error");
      console.warn("[VibeGroup] No groups available for export");
      return;
    }
    try {
      showStatus(_0x1020e9, "正在导出 " + _0x29b778 + " 个组...", "info");
      await exportAllVibeGroups();
      showStatus(_0x1020e9, "已成功导出全部 " + _0x29b778 + " 个组", "success");
      console.log("[VibeGroup] Successfully exported all groups:", _0x29b778);
    } catch (_0x2e61b8) {
      const _0x4a1237 = _0x2e61b8.message || "未知错误";
      console.error("[VibeGroup] Export all failed:", {
        groupCount: _0x29b778,
        error: _0x2e61b8.message,
        errorName: _0x2e61b8.name,
        timestamp: new Date().toISOString(),
        stack: _0x2e61b8.stack
      });
      showStatus(_0x1020e9, "导出失败: " + _0x4a1237 + "。请检查控制台以获取详细信息。", "error");
    }
  };
  _0x1ab68f.onclick = () => {
    const _0x3c8dd3 = document.createElement("input");
    _0x3c8dd3.type = "file";
    _0x3c8dd3.accept = ".json";
    _0x3c8dd3.style.display = "none";
    _0x3c8dd3.onchange = async _0x3a2c6a => {
      const _0x3133dd = _0x3a2c6a.target.files[0];
      if (!_0x3133dd) {
        return;
      }
      try {
        showStatus(_0x1020e9, "正在导入...", "info");
        const _0x1b6c77 = await readFileAsText(_0x3133dd);
        const _0x4fde09 = await importVibeGroup(_0x1b6c77);
        if (_0x4fde09.success) {
          let _0x225011 = "成功导入 " + _0x4fde09.groupsImported + " 个组、" + _0x4fde09.vibesImported + " 个 Vibe、" + _0x4fde09.presetsImported + " 个预设";
          if (_0x4fde09.warnings.length > 0) {
            _0x225011 += "\n\n警告 (" + _0x4fde09.warnings.length + " 个):\n";
            const _0x157141 = _0x4fde09.warnings.slice(0, 3);
            _0x225011 += _0x157141.map(_0x4221a6 => "• " + _0x4221a6).join("\n");
            if (_0x4fde09.warnings.length > 3) {
              _0x225011 += "\n• ... 还有 " + (_0x4fde09.warnings.length - 3) + " 个警告";
            }
            _0x225011 += "\n\n请查看控制台以获取完整的警告列表。";
            console.warn("[VibeGroup] Import warnings:", _0x4fde09.warnings);
          }
          showStatus(_0x1020e9, _0x225011, _0x4fde09.warnings.length > 0 ? "info" : "success");
          loadGroupPresetList(_0x567389);
          renderVibeSlots(_0x1440aa, _0x567389, _0x3b43d1);
        } else {
          let _0x2a0042 = "导入失败";
          if (_0x4fde09.errors.length > 0) {
            _0x2a0042 += ":\n\n";
            _0x2a0042 += _0x4fde09.errors.map(_0x29506c => "• " + _0x29506c).join("\n");
            _0x2a0042 += "\n\n请检查文件格式是否正确。";
          }
          showStatus(_0x1020e9, _0x2a0042, "error");
          console.error("[VibeGroup] Import errors:", _0x4fde09.errors);
        }
      } catch (_0x388971) {
        console.error("[VibeGroup] Import error:", {
          error: _0x388971.message,
          errorName: _0x388971.name,
          fileSize: _0x3133dd.size,
          fileName: _0x3133dd.name,
          timestamp: new Date().toISOString(),
          stack: _0x388971.stack
        });
        const _0x5532f8 = "导入失败: " + (_0x388971.message || "未知错误") + "。\n\n可能的原因:\n• 文件格式不正确\n• 文件已损坏\n• 浏览器存储空间不足\n\n请检查控制台以获取详细信息。";
        showStatus(_0x1020e9, _0x5532f8, "error");
      } finally {
        document.body.removeChild(_0x3c8dd3);
      }
    };
    document.body.appendChild(_0x3c8dd3);
    _0x3c8dd3.click();
  };
  renderVibeSlots(_0x1440aa, _0x567389, _0x3b43d1);
  _0x567389.onchange = () => {
    _0x1212d9.vibeGroupId = _0x567389.value;
    renderVibeSlots(_0x1440aa, _0x567389, _0x3b43d1);
  };
  console.log("[VibeGroup] Dialog opened");
}
function loadGroupPresetList(_0x39f5ab) {
  const _0x51cc44 = extension_settings[extensionName];
  const _0x5e9104 = _0x51cc44.vibeGroups || {};
  const _0x13a0d5 = _0x51cc44.vibeGroupId || "默认组";
  _0x39f5ab.innerHTML = "";
  const _0x3ba457 = Object.keys(_0x5e9104).sort((_0x5e3856, _0x14cc08) => {
    if (_0x5e3856 === "默认组") {
      return -1;
    }
    if (_0x14cc08 === "默认组") {
      return 1;
    }
    return _0x5e3856.localeCompare(_0x14cc08, "zh-CN");
  });
  _0x3ba457.forEach(_0x14f3e4 => {
    const _0x41f4d9 = document.createElement("option");
    _0x41f4d9.value = _0x14f3e4;
    _0x41f4d9.textContent = _0x14f3e4;
    if (_0x14f3e4 === _0x13a0d5) {
      _0x41f4d9.selected = true;
    }
    _0x39f5ab.appendChild(_0x41f4d9);
  });
  console.log("[VibeGroup] Loaded preset list:", _0x3ba457.length, "groups");
}
function createNewGroup(_0xf5b238, _0x528295, _0xf61d7, _0x54c633) {
  const _0x5d84a9 = extension_settings[extensionName];
  const _0x38d213 = _0x5d84a9.vibeGroups || {};
  const _0x446ec4 = prompt("请输入新组名称:");
  if (!_0x446ec4) {
    return;
  }
  const _0x337957 = _0x446ec4.trim();
  if (!_0x337957) {
    showStatus(_0x528295, "组名不能为空", "error");
    return;
  }
  if (_0x38d213[_0x337957]) {
    showStatus(_0x528295, "组名 \"" + _0x337957 + "\" 已存在", "error");
    return;
  }
  _0x38d213[_0x337957] = {
    vibes: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  _0x5d84a9.vibeGroupId = _0x337957;
  try {
    saveSettingsDebounced();
  } catch (_0x97a463) {
    console.error("[VibeGroup] Failed to save settings after creating new group:", {
      groupName: _0x337957,
      error: _0x97a463.message,
      errorName: _0x97a463.name,
      timestamp: new Date().toISOString(),
      stack: _0x97a463.stack
    });
    showStatus(_0x528295, "创建成功但保存失败: " + _0x97a463.message, "error");
    return;
  }
  loadGroupPresetList(_0xf5b238);
  renderVibeSlots(_0xf61d7, _0xf5b238, _0x54c633);
  showStatus(_0x528295, "已创建新组 \"" + _0x337957 + "\"", "success");
  console.log("[VibeGroup] Created new group:", _0x337957);
}
function saveCurrentGroup(_0x25c23d, _0xf45be7) {
  const _0x47cc63 = extension_settings[extensionName];
  const _0x2735b0 = _0x47cc63.vibeGroups || {};
  const _0x52a47b = _0x25c23d.value;
  if (!_0x52a47b) {
    showStatus(_0xf45be7, "未选择组", "error");
    return;
  }
  const _0x21209f = _0x2735b0[_0x52a47b];
  if (!_0x21209f) {
    showStatus(_0xf45be7, "当前组不存在", "error");
    return;
  }
  _0x21209f.updatedAt = Date.now();
  _0x47cc63.vibeGroupId = _0x52a47b;
  try {
    saveSettingsDebounced();
  } catch (_0x18675f) {
    console.error("[VibeGroup] Failed to save settings after saving group:", {
      groupId: _0x52a47b,
      error: _0x18675f.message,
      errorName: _0x18675f.name,
      timestamp: new Date().toISOString(),
      stack: _0x18675f.stack
    });
    showStatus(_0xf45be7, "保存失败: " + _0x18675f.message, "error");
    return;
  }
  showStatus(_0xf45be7, "已保存组 \"" + _0x52a47b + "\"", "success");
  console.log("[VibeGroup] Saved group:", _0x52a47b);
}
function deleteCurrentGroup(_0x23a145, _0x499fcf) {
  const _0x593838 = extension_settings[extensionName];
  const _0xd40d5f = _0x593838.vibeGroups || {};
  const _0x2835ff = _0x23a145.value;
  if (!_0x2835ff) {
    showStatus(_0x499fcf, "未选择组", "error");
    return;
  }
  if (_0x2835ff === "默认组" && Object.keys(_0xd40d5f).length === 1) {
    showStatus(_0x499fcf, "不能删除唯一的组", "error");
    return;
  }
  const _0x5f1f42 = confirm("确定要删除组 \"" + _0x2835ff + "\" 吗？此操作无法撤销。");
  if (!_0x5f1f42) {
    return;
  }
  delete _0xd40d5f[_0x2835ff];
  if (_0xd40d5f.默认组) {
    _0x593838.vibeGroupId = "默认组";
  } else {
    const _0x7b9017 = Object.keys(_0xd40d5f);
    _0x593838.vibeGroupId = _0x7b9017.length > 0 ? _0x7b9017[0] : "默认组";
    if (_0x7b9017.length === 0) {
      _0xd40d5f.默认组 = {
        vibes: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      _0x593838.vibeGroupId = "默认组";
    }
  }
  try {
    saveSettingsDebounced();
  } catch (_0x4e433d) {
    console.error("[VibeGroup] Failed to save settings after deleting group:", {
      groupId: _0x2835ff,
      error: _0x4e433d.message,
      errorName: _0x4e433d.name,
      timestamp: new Date().toISOString(),
      stack: _0x4e433d.stack
    });
    showStatus(_0x499fcf, "删除成功但保存失败: " + _0x4e433d.message, "error");
  }
  loadGroupPresetList(_0x23a145);
  const _0x2ec85b = document.getElementById("vibe-group-slots");
  const _0xc69d6f = document.getElementById("vibe-group-add-vibe");
  if (_0x2ec85b && _0xc69d6f) {
    renderVibeSlots(_0x2ec85b, _0x23a145, _0xc69d6f);
  }
  showStatus(_0x499fcf, "已删除组 \"" + _0x2835ff + "\"", "success");
  console.log("[VibeGroup] Deleted group:", _0x2835ff);
}
function showStatus(_0x61f2aa, _0x3d7d86, _0x56327f = "info") {
  _0x61f2aa.textContent = _0x3d7d86;
  _0x61f2aa.style.display = "block";
  if (_0x56327f === "success") {
    _0x61f2aa.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
    _0x61f2aa.style.color = "#4caf50";
    _0x61f2aa.style.border = "1px solid rgba(76, 175, 80, 0.3)";
  } else if (_0x56327f === "error") {
    _0x61f2aa.style.backgroundColor = "rgba(244, 67, 54, 0.1)";
    _0x61f2aa.style.color = "#f44336";
    _0x61f2aa.style.border = "1px solid rgba(244, 67, 54, 0.3)";
  } else {
    _0x61f2aa.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
    _0x61f2aa.style.color = "#2196f3";
    _0x61f2aa.style.border = "1px solid rgba(33, 150, 243, 0.3)";
  }
  setTimeout(() => {
    _0x61f2aa.style.display = "none";
  }, 5000);
}
async function renderVibeSlots(_0x565d3b, _0x3a51e8, _0x28d3ac) {
  const _0x50e6dd = extension_settings[extensionName];
  const _0x137e3b = _0x50e6dd.vibeGroups || {};
  const _0x523ea8 = _0x3a51e8.value;
  const _0x2ab850 = _0x137e3b[_0x523ea8];
  _0x565d3b.innerHTML = "";
  if (!_0x2ab850) {
    console.warn("[VibeGroup] Current group not found:", _0x523ea8);
    _0x565d3b.innerHTML = "\n            <div style=\"text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.5);\">\n                <i class=\"fa-solid fa-exclamation-circle\" style=\"font-size: 3rem; margin-bottom: 1rem; display: block;\"></i>\n                <p>无法加载组数据</p>\n                <p style=\"font-size: 0.9rem; margin-top: 0.5rem;\">请尝试选择其他组或创建新组</p>\n            </div>\n        ";
    _0x28d3ac.disabled = true;
    _0x28d3ac.style.opacity = "0.5";
    return;
  }
  if (!Array.isArray(_0x2ab850.vibes)) {
    console.error("[VibeGroup] Corrupted group data - vibes is not an array:", _0x523ea8, _0x2ab850);
    _0x2ab850.vibes = [];
    _0x2ab850.updatedAt = Date.now();
    saveSettingsDebounced();
    console.log("[VibeGroup] Fixed corrupted group data by initializing empty vibes array");
  }
  const _0x2fc103 = _0x2ab850.vibes;
  const _0x5532ab = [];
  for (let _0x460a98 = 0; _0x460a98 < _0x2fc103.length; _0x460a98++) {
    const _0xf1d7b3 = _0x2fc103[_0x460a98];
    if (!_0xf1d7b3 || typeof _0xf1d7b3 !== "object") {
      console.warn("[VibeGroup] Invalid Vibe reference at index", _0x460a98, "- skipping:", _0xf1d7b3);
      continue;
    }
    if (!_0xf1d7b3.vibeDataId || typeof _0xf1d7b3.vibeDataId !== "string") {
      console.warn("[VibeGroup] Missing vibeDataId at index", _0x460a98, "- skipping:", _0xf1d7b3);
      continue;
    }
    if (typeof _0xf1d7b3.strength !== "number") {
      console.warn("[VibeGroup] Invalid strength at index", _0x460a98, "- using default:", _0xf1d7b3);
      _0xf1d7b3.strength = 0.6;
    }
    _0x5532ab.push(_0xf1d7b3);
  }
  if (_0x5532ab.length !== _0x2fc103.length) {
    console.log("[VibeGroup] Cleaned up corrupted Vibe references:", _0x2fc103.length, "->", _0x5532ab.length);
    _0x2ab850.vibes = _0x5532ab;
    _0x2ab850.updatedAt = Date.now();
    saveSettingsDebounced();
  }
  const _0x30eb79 = _0x5532ab.length;
  _0x28d3ac.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加 Vibe (" + _0x30eb79 + "/4)";
  if (_0x30eb79 >= 4) {
    _0x28d3ac.disabled = true;
    _0x28d3ac.style.opacity = "0.5";
    _0x28d3ac.style.cursor = "not-allowed";
  } else {
    _0x28d3ac.disabled = false;
    _0x28d3ac.style.opacity = "1";
    _0x28d3ac.style.cursor = "pointer";
  }
  for (let _0x2da04b = 0; _0x2da04b < _0x5532ab.length; _0x2da04b++) {
    const _0x3b23fa = _0x5532ab[_0x2da04b];
    await updateVibeSlot(_0x565d3b, _0x2da04b, _0x3b23fa, _0x3a51e8, _0x28d3ac);
  }
  console.log("[VibeGroup] Rendered", _0x5532ab.length, "Vibe slots");
}
function parseVibeDataFromDataUrl(_0x543301) {
  try {
    if (_0x543301 && typeof _0x543301 === "object" && !Array.isArray(_0x543301)) {
      return _0x543301;
    }
    if (typeof _0x543301 !== "string") {
      console.warn("[VibeGroup] parseVibeDataFromDataUrl: Invalid input type:", typeof _0x543301);
      return null;
    }
    if (!_0x543301.startsWith("data:")) {
      console.warn("[VibeGroup] parseVibeDataFromDataUrl: Input is not a data URL, length:", _0x543301.length);
      return null;
    }
    const _0x5a5498 = _0x543301.indexOf(",");
    if (_0x5a5498 === -1) {
      console.error("[VibeGroup] parseVibeDataFromDataUrl: Missing comma in data URL, length:", _0x543301.length);
      return null;
    }
    const _0x47da85 = _0x543301.substring(_0x5a5498 + 1);
    if (!_0x47da85) {
      console.error("[VibeGroup] parseVibeDataFromDataUrl: Empty base64 data after comma");
      return null;
    }
    let _0xac5cce;
    try {
      _0xac5cce = atob(_0x47da85);
    } catch (_0x1add10) {
      console.error("[VibeGroup] parseVibeDataFromDataUrl: Base64 decode failed:", {
        error: _0x1add10.message,
        dataUrlPrefix: _0x543301.substring(0, 100),
        base64Length: _0x47da85.length
      });
      return null;
    }
    let _0x563486;
    try {
      _0x563486 = JSON.parse(_0xac5cce);
    } catch (_0x4a3ff9) {
      console.error("[VibeGroup] parseVibeDataFromDataUrl: JSON parse failed:", {
        error: _0x4a3ff9.message,
        jsonPrefix: _0xac5cce.substring(0, 100),
        jsonLength: _0xac5cce.length
      });
      return null;
    }
    return _0x563486;
  } catch (_0x5b5b34) {
    console.error("[VibeGroup] parseVibeDataFromDataUrl: Unexpected error:", {
      error: _0x5b5b34.message,
      errorName: _0x5b5b34.name,
      stack: _0x5b5b34.stack,
      timestamp: new Date().toISOString()
    });
    return null;
  }
}
async function updateVibeSlot(_0x1e617b, _0x304c1c, _0x1e50d9, _0x5e42ff, _0x2b3ced) {
  const {
    vibeDataId: _0x4d40a4,
    strength: _0x55f927
  } = _0x1e50d9;
  const _0x5e0886 = document.createElement("div");
  _0x5e0886.className = "st-chatu8-vibe-slot";
  _0x5e0886.dataset.slotIndex = _0x304c1c;
  _0x5e0886.style.cssText = "\n        border: 1px solid rgba(255, 255, 255, 0.1);\n        border-radius: 8px;\n        padding: 1rem;\n        margin-bottom: 1rem;\n        background: rgba(0, 0, 0, 0.2);\n    ";
  const _0x9dfd43 = document.createElement("div");
  _0x9dfd43.className = "st-chatu8-vibe-slot-header";
  _0x9dfd43.style.cssText = "\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 0.8rem;\n    ";
  const _0x5be5f3 = document.createElement("span");
  _0x5be5f3.className = "st-chatu8-vibe-slot-title";
  _0x5be5f3.textContent = "Vibe " + (_0x304c1c + 1);
  _0x5be5f3.style.cssText = "\n        font-weight: 600;\n        font-size: 1rem;\n    ";
  const _0x5f0e64 = document.createElement("button");
  _0x5f0e64.className = "st-chatu8-icon-btn danger st-chatu8-vibe-slot-remove";
  _0x5f0e64.innerHTML = "<i class=\"fa-solid fa-times\"></i>";
  _0x5f0e64.title = "移除此 Vibe";
  _0x5f0e64.onclick = () => removeVibeFromSlot(_0x304c1c, _0x1e617b, _0x5e42ff, _0x2b3ced);
  _0x9dfd43.appendChild(_0x5be5f3);
  _0x9dfd43.appendChild(_0x5f0e64);
  const _0x2b5e82 = document.createElement("div");
  _0x2b5e82.className = "st-chatu8-vibe-slot-preview";
  _0x2b5e82.style.cssText = "\n        width: 100%;\n        height: 200px;\n        border-radius: 6px;\n        overflow: hidden;\n        background: rgba(0, 0, 0, 0.3);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        margin-bottom: 1rem;\n    ";
  try {
    const _0x446748 = await getConfigImage(_0x4d40a4);
    if (!_0x446748) {
      _0x2b5e82.innerHTML = "\n                <div style=\"text-align: center; color: rgba(255, 255, 255, 0.5);\">\n                    <i class=\"fa-solid fa-exclamation-circle\" style=\"font-size: 3rem; opacity: 0.3; display: block; margin-bottom: 0.5rem;\"></i>\n                    <div style=\"font-size: 0.85rem;\">Vibe 数据未找到</div>\n                    <div style=\"font-size: 0.75rem; margin-top: 0.3rem; opacity: 0.7;\">ID: " + _0x4d40a4.substring(0, 12) + "...</div>\n                </div>\n            ";
      console.warn("[VibeGroup] Vibe data not found in database:", _0x4d40a4);
      return;
    }
    const _0x4125a1 = parseVibeDataFromDataUrl(_0x446748);
    if (!_0x4125a1) {
      _0x2b5e82.innerHTML = "\n                <div style=\"text-align: center; color: #ff9800;\">\n                    <i class=\"fa-solid fa-exclamation-triangle\" style=\"font-size: 3rem; opacity: 0.5; display: block; margin-bottom: 0.5rem;\"></i>\n                    <div style=\"font-size: 0.85rem; font-weight: 600;\">解析失败</div>\n                    <div style=\"font-size: 0.75rem; margin-top: 0.3rem; opacity: 0.7;\">ID: " + _0x4d40a4.substring(0, 12) + "...</div>\n                </div>\n            ";
      _0x2b5e82.title = "数据格式无效";
      console.error("[VibeGroup] Failed to parse Vibe data:", {
        vibeDataId: _0x4d40a4.substring(0, 12) + "...",
        slotIndex: _0x304c1c,
        timestamp: new Date().toISOString()
      });
      return;
    }
    if (_0x4125a1.thumbnail) {
      const _0x366a06 = document.createElement("img");
      _0x366a06.src = _0x4125a1.thumbnail;
      _0x366a06.alt = "Vibe preview";
      _0x366a06.style.cssText = "\n                max-width: 100%;\n                max-height: 100%;\n                object-fit: contain;\n            ";
      _0x2b5e82.appendChild(_0x366a06);
    } else {
      _0x2b5e82.innerHTML = "\n                <div style=\"text-align: center; color: rgba(255, 255, 255, 0.5);\">\n                    <i class=\"fa-solid fa-image\" style=\"font-size: 3rem; opacity: 0.3; display: block; margin-bottom: 0.5rem;\"></i>\n                    <div style=\"font-size: 0.85rem;\">无缩略图</div>\n                </div>\n            ";
      console.warn("[VibeGroup] No thumbnail field in Vibe data:", {
        vibeDataId: _0x4d40a4.substring(0, 12) + "...",
        timestamp: new Date().toISOString()
      });
    }
  } catch (_0x451067) {
    let _0x396f46 = "Vibe 数据加载失败";
    let _0x38e15f = _0x451067.name || "Error";
    if (_0x451067.name === "QuotaExceededError" || _0x451067.message.includes("quota")) {
      _0x396f46 = "存储空间已满";
      _0x38e15f = "QuotaExceededError";
    } else if (_0x451067.name === "NotFoundError") {
      _0x396f46 = "Vibe 数据未找到";
      _0x38e15f = "NotFoundError";
    } else if (_0x451067.name === "InvalidStateError") {
      _0x396f46 = "数据库状态无效";
      _0x38e15f = "InvalidStateError";
    }
    _0x2b5e82.innerHTML = "\n            <div style=\"text-align: center; color: #f44336;\">\n                <i class=\"fa-solid fa-exclamation-triangle\" style=\"font-size: 3rem; opacity: 0.5; display: block; margin-bottom: 0.5rem;\"></i>\n                <div style=\"font-size: 0.85rem; font-weight: 600;\">" + _0x396f46 + "</div>\n                <div style=\"font-size: 0.75rem; margin-top: 0.3rem; opacity: 0.7;\">" + _0x38e15f + "</div>\n                <div style=\"font-size: 0.75rem; margin-top: 0.3rem; opacity: 0.7;\">ID: " + _0x4d40a4.substring(0, 12) + "...</div>\n            </div>\n        ";
    _0x2b5e82.title = "加载失败: " + _0x451067.message;
    console.error("[VibeGroup] Failed to load Vibe data from database:", {
      vibeDataId: _0x4d40a4.substring(0, 12) + "...",
      error: _0x451067.message,
      errorName: _0x451067.name,
      slotIndex: _0x304c1c,
      timestamp: new Date().toISOString(),
      stack: _0x451067.stack
    });
  }
  const _0x920c21 = document.createElement("div");
  _0x920c21.className = "st-chatu8-field";
  _0x920c21.style.marginBottom = "0";
  const _0x2148ae = document.createElement("label");
  _0x2148ae.innerHTML = "Reference Strength: <span class=\"strength-value\">" + _0x55f927.toFixed(2) + "</span>";
  const _0xec01c4 = document.createElement("div");
  _0xec01c4.className = "st-chatu8-range-container";
  _0xec01c4.style.cssText = "\n        display: flex;\n        gap: 0.5rem;\n        align-items: center;\n        margin-top: 0.5rem;\n    ";
  const _0x37ef25 = document.createElement("input");
  _0x37ef25.type = "range";
  _0x37ef25.className = "st-chatu8-range-slider vibe-strength-range";
  _0x37ef25.min = "0";
  _0x37ef25.max = "1";
  _0x37ef25.step = "0.01";
  _0x37ef25.value = _0x55f927.toString();
  _0x37ef25.style.flex = "1";
  const _0x594fe4 = document.createElement("input");
  _0x594fe4.type = "number";
  _0x594fe4.className = "st-chatu8-range-input vibe-strength-num";
  _0x594fe4.min = "0";
  _0x594fe4.max = "1";
  _0x594fe4.step = "0.01";
  _0x594fe4.value = _0x55f927.toString();
  _0x594fe4.style.width = "80px";
  setupStrengthSliderSync(_0x37ef25, _0x594fe4, _0x2148ae, _0x304c1c, _0x5e42ff);
  _0xec01c4.appendChild(_0x37ef25);
  _0xec01c4.appendChild(_0x594fe4);
  _0x920c21.appendChild(_0x2148ae);
  _0x920c21.appendChild(_0xec01c4);
  _0x5e0886.appendChild(_0x9dfd43);
  _0x5e0886.appendChild(_0x2b5e82);
  _0x5e0886.appendChild(_0x920c21);
  _0x1e617b.appendChild(_0x5e0886);
}
function setupStrengthSliderSync(_0x26ff30, _0x8d5a38, _0x57f575, _0x1f68ca, _0x1db9f8) {
  const _0x258bd5 = extension_settings[extensionName];
  const _0x407ea0 = _0xbfe751 => {
    let _0x570fe7 = Math.max(0, Math.min(1, parseFloat(_0xbfe751) || 0));
    _0x26ff30.value = _0x570fe7.toString();
    _0x8d5a38.value = _0x570fe7.toString();
    const _0x4d5f73 = _0x57f575.querySelector(".strength-value");
    if (_0x4d5f73) {
      _0x4d5f73.textContent = _0x570fe7.toFixed(2);
    }
    const _0x326366 = _0x258bd5.vibeGroups || {};
    const _0x3137fd = _0x1db9f8.value;
    const _0x51dd30 = _0x326366[_0x3137fd];
    if (_0x51dd30 && _0x51dd30.vibes[_0x1f68ca]) {
      _0x51dd30.vibes[_0x1f68ca].strength = _0x570fe7;
      _0x51dd30.updatedAt = Date.now();
      try {
        saveSettingsDebounced();
      } catch (_0x2f47e5) {
        console.error("[VibeGroup] Failed to save settings after strength update:", {
          slotIndex: _0x1f68ca,
          strength: _0x570fe7,
          error: _0x2f47e5.message,
          errorName: _0x2f47e5.name,
          timestamp: new Date().toISOString()
        });
      }
    }
  };
  _0x26ff30.oninput = () => {
    _0x407ea0(_0x26ff30.value);
  };
  _0x8d5a38.oninput = () => {
    _0x407ea0(_0x8d5a38.value);
  };
  _0x8d5a38.onblur = () => {
    _0x407ea0(_0x8d5a38.value);
  };
}
function removeVibeFromSlot(_0x194f28, _0x5a5ea7, _0x34857f, _0x353997) {
  const _0x99c6f1 = extension_settings[extensionName];
  const _0x4d904e = _0x99c6f1.vibeGroups || {};
  const _0xee33e7 = _0x34857f.value;
  const _0x275294 = _0x4d904e[_0xee33e7];
  if (!_0x275294) {
    console.warn("[VibeGroup] Current group not found:", _0xee33e7);
    return;
  }
  _0x275294.vibes.splice(_0x194f28, 1);
  _0x275294.updatedAt = Date.now();
  try {
    saveSettingsDebounced();
  } catch (_0x23126b) {
    console.error("[VibeGroup] Failed to save settings after removing Vibe:", {
      slotIndex: _0x194f28,
      groupId: _0xee33e7,
      error: _0x23126b.message,
      errorName: _0x23126b.name,
      timestamp: new Date().toISOString(),
      stack: _0x23126b.stack
    });
  }
  renderVibeSlots(_0x5a5ea7, _0x34857f, _0x353997);
  console.log("[VibeGroup] Removed Vibe from slot", _0x194f28);
}
async function showVibeVisualSelector(_0x4a6d74) {
  const _0x137743 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x5da205 = extension_settings[extensionName];
  const _0x1bacdf = _0x5da205.vibePresets || {};
  let _0xc4be79 = 1;
  let _0x110f2d = 12;
  let _0x4b5c79 = [];
  let _0x152444 = "";
  const _0x538037 = document.createElement("div");
  _0x538037.className = "st-chatu8-workflow-viz-backdrop";
  _0x538037.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-vibe-visual-selector-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>选择 Vibe 预设</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-toolbar\" style=\"justify-content: space-between; align-items: center; gap: 15px; padding: 12px 20px; background: rgba(30, 30, 46, 0.6); border-bottom: 1px solid rgba(255,255,255,0.05);\">\n                <div class=\"st-chatu8-viz-search-container\" style=\"position: relative; flex-grow: 1; max-width: 300px;\">\n                    <i class=\"fa-solid fa-search\" style=\"position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none;\"></i>\n                    <input type=\"text\" class=\"st-chatu8-viz-search-input\" placeholder=\"搜索 Vibe...\" style=\"width: 100%; padding: 8px 12px 8px 36px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: white; outline: none; transition: all 0.3s;\">\n                </div>\n            </div>\n            <div class=\"st-chatu8-pagination-container\">\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-prev\" title=\"上一页\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-info\">\n                    <span class=\"st-chatu8-pagination-current\">1</span>\n                    <span>/</span>\n                    <span class=\"st-chatu8-pagination-total\">1</span>\n                    <span style=\"margin-left: 8px; color: #666;\">|</span>\n                    <span style=\"margin-left: 8px;\">共 <span class=\"st-chatu8-pagination-count\">0</span> 个</span>\n                </div>\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-next\" title=\"下一页\">\n                    <i class=\"fa-solid fa-chevron-right\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-size-container\">\n                    <span class=\"st-chatu8-pagination-size-label\">每页</span>\n                    <select class=\"st-chatu8-pagination-size\">\n                        <option value=\"8\">8</option>\n                        <option value=\"12\" selected>12</option>\n                        <option value=\"16\">16</option>\n                        <option value=\"24\">24</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\">\n                <div class=\"st-chatu8-vibe-visual-selector-grid\">\n                    <!-- Vibe cards will be inserted here -->\n                </div>\n            </div>\n        </div>\n    ";
  _0x137743.appendChild(_0x538037);
  const _0x3dad8f = _0x538037.querySelector(".st-chatu8-workflow-viz-close");
  _0x3dad8f.onclick = () => _0x137743.removeChild(_0x538037);
  _0x538037.onclick = _0x5d957b => {
    if (_0x5d957b.target === _0x538037) {
      _0x137743.removeChild(_0x538037);
    }
  };
  const _0x433c1f = _0x538037.querySelector(".st-chatu8-vibe-visual-selector-grid");
  const _0x524bc3 = _0x538037.querySelector(".st-chatu8-viz-search-input");
  const _0x578c38 = _0x538037.querySelector(".st-chatu8-pagination-prev");
  const _0x51ca08 = _0x538037.querySelector(".st-chatu8-pagination-next");
  const _0x75ad6f = _0x538037.querySelector(".st-chatu8-pagination-current");
  const _0x3ac0a6 = _0x538037.querySelector(".st-chatu8-pagination-total");
  const _0xb440ed = _0x538037.querySelector(".st-chatu8-pagination-count");
  const _0x5ef9eb = _0x538037.querySelector(".st-chatu8-pagination-size");
  const _0x55c2d4 = Object.keys(_0x1bacdf).filter(_0x24b92a => _0x1bacdf[_0x24b92a].vibeDataId).sort((_0x548fd3, _0x3d9e55) => {
    if (_0x548fd3 === "默认") {
      return -1;
    }
    if (_0x3d9e55 === "默认") {
      return 1;
    }
    return _0x548fd3.localeCompare(_0x3d9e55, "zh-CN");
  });
  function _0x39f8eb() {
    if (_0x152444) {
      _0x4b5c79 = _0x55c2d4.filter(_0x1dc7cd => _0x1dc7cd.toLowerCase().includes(_0x152444));
    } else {
      _0x4b5c79 = [..._0x55c2d4];
    }
  }
  function _0x51153b() {
    const _0x5819ed = Math.ceil(_0x4b5c79.length / _0x110f2d) || 1;
    _0x75ad6f.textContent = _0xc4be79;
    _0x3ac0a6.textContent = _0x5819ed;
    _0xb440ed.textContent = _0x4b5c79.length;
    _0x578c38.disabled = _0xc4be79 <= 1;
    _0x578c38.style.opacity = _0xc4be79 <= 1 ? "0.5" : "1";
    _0x578c38.style.cursor = _0xc4be79 <= 1 ? "not-allowed" : "pointer";
    _0x51ca08.disabled = _0xc4be79 >= _0x5819ed;
    _0x51ca08.style.opacity = _0xc4be79 >= _0x5819ed ? "0.5" : "1";
    _0x51ca08.style.cursor = _0xc4be79 >= _0x5819ed ? "not-allowed" : "pointer";
  }
  async function _0x576468() {
    _0x433c1f.style.opacity = "0";
    _0x433c1f.style.transform = "translateY(10px)";
    await new Promise(_0x42863b => setTimeout(_0x42863b, 150));
    _0x433c1f.innerHTML = "";
    if (_0x4b5c79.length === 0) {
      _0x433c1f.innerHTML = "\n                <div style=\"\n                    grid-column: 1 / -1;\n                    text-align: center;\n                    padding: 3rem;\n                    color: rgba(255, 255, 255, 0.5);\n                \">\n                    <i class=\"fa-solid fa-inbox\" style=\"font-size: 3rem; margin-bottom: 1rem; display: block;\"></i>\n                    <p>" + (_0x152444 ? "没有找到匹配的 Vibe 预设" : "没有可用的 Vibe 预设") + "</p>\n                    <p style=\"font-size: 0.9rem; margin-top: 0.5rem;\">" + (_0x152444 ? "请尝试其他搜索词" : "请先在 Vibe 生成器中创建 Vibe 预设") + "</p>\n                </div>\n            ";
      _0x51153b();
      _0x433c1f.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      _0x433c1f.style.opacity = "1";
      _0x433c1f.style.transform = "translateY(0)";
      return;
    }
    const _0x5734df = (_0xc4be79 - 1) * _0x110f2d;
    const _0x1e29cb = _0x5734df + _0x110f2d;
    const _0x32f33d = _0x4b5c79.slice(_0x5734df, _0x1e29cb);
    for (const _0x232845 of _0x32f33d) {
      const _0x1e8cca = _0x1bacdf[_0x232845];
      const _0x1f1eac = document.createElement("div");
      _0x1f1eac.className = "st-chatu8-vibe-card";
      const _0x4d59b3 = document.createElement("div");
      _0x4d59b3.className = "st-chatu8-vibe-card-thumbnail";
      try {
        const _0x15c654 = await getConfigImage(_0x1e8cca.vibeDataId);
        if (_0x15c654 && _0x15c654.thumbnail) {
          const _0x2ead9c = document.createElement("img");
          _0x2ead9c.src = _0x15c654.thumbnail;
          _0x2ead9c.alt = _0x232845;
          _0x4d59b3.appendChild(_0x2ead9c);
        } else if (_0x1e8cca.imageId) {
          const _0x2ed4ad = await getConfigImage(_0x1e8cca.imageId);
          if (_0x2ed4ad) {
            const _0x368b7e = document.createElement("img");
            _0x368b7e.src = _0x2ed4ad;
            _0x368b7e.alt = _0x232845;
            _0x4d59b3.appendChild(_0x368b7e);
          } else {
            _0x4d59b3.innerHTML = "\n                            <div class=\"st-chatu8-vibe-card-placeholder\">\n                                <i class=\"fa-solid fa-image\"></i>\n                                <div>无图像</div>\n                            </div>\n                        ";
          }
        } else {
          _0x4d59b3.innerHTML = "\n                        <div class=\"st-chatu8-vibe-card-placeholder\">\n                            <i class=\"fa-solid fa-image\"></i>\n                            <div>无图像</div>\n                        </div>\n                    ";
        }
      } catch (_0x45b9c1) {
        _0x4d59b3.innerHTML = "\n                    <div class=\"st-chatu8-vibe-card-error\">\n                        <i class=\"fa-solid fa-exclamation-triangle\"></i>\n                        <div>加载失败</div>\n                    </div>\n                ";
        _0x4d59b3.title = "加载失败: " + _0x45b9c1.message;
        let _0x9217af = _0x45b9c1.name || "Error";
        if (_0x45b9c1.name === "QuotaExceededError" || _0x45b9c1.message.includes("quota")) {
          _0x9217af = "QuotaExceededError";
        } else if (_0x45b9c1.name === "NotFoundError") {
          _0x9217af = "NotFoundError";
        } else if (_0x45b9c1.name === "InvalidStateError") {
          _0x9217af = "InvalidStateError";
        }
        console.error("[VibeGroup] Failed to load Vibe thumbnail:", {
          vibeDataId: _0x1e8cca.vibeDataId.substring(0, 12) + "...",
          presetName: _0x232845,
          error: _0x45b9c1.message,
          errorName: _0x9217af,
          timestamp: new Date().toISOString(),
          stack: _0x45b9c1.stack
        });
      }
      const _0x5a28c6 = document.createElement("div");
      _0x5a28c6.className = "st-chatu8-vibe-card-info";
      const _0x368dfe = document.createElement("div");
      _0x368dfe.className = "st-chatu8-vibe-card-name";
      _0x368dfe.textContent = _0x232845;
      const _0x4b885d = document.createElement("div");
      _0x4b885d.className = "st-chatu8-vibe-card-model";
      const _0x458321 = _0x1e8cca.model || "Unknown";
      const _0x498d81 = _0x458321.replace("nai-diffusion-", "V").replace("-", " ");
      _0x4b885d.textContent = _0x498d81;
      _0x5a28c6.appendChild(_0x368dfe);
      _0x5a28c6.appendChild(_0x4b885d);
      _0x1f1eac.appendChild(_0x4d59b3);
      _0x1f1eac.appendChild(_0x5a28c6);
      _0x1f1eac.onclick = () => {
        _0x4a6d74(_0x1e8cca.vibeDataId);
        _0x137743.removeChild(_0x538037);
        console.log("[VibeGroup] Selected Vibe:", _0x232845, _0x1e8cca.vibeDataId);
      };
      _0x433c1f.appendChild(_0x1f1eac);
    }
    _0x51153b();
    _0x433c1f.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    _0x433c1f.style.opacity = "1";
    _0x433c1f.style.transform = "translateY(0)";
  }
  _0x524bc3.oninput = _0x2435f8 => {
    _0x152444 = _0x2435f8.target.value.toLowerCase();
    _0xc4be79 = 1;
    _0x39f8eb();
    _0x576468();
  };
  _0x578c38.onclick = () => {
    if (_0xc4be79 > 1) {
      _0xc4be79--;
      _0x576468();
    }
  };
  _0x51ca08.onclick = () => {
    const _0x20cafe = Math.ceil(_0x4b5c79.length / _0x110f2d) || 1;
    if (_0xc4be79 < _0x20cafe) {
      _0xc4be79++;
      _0x576468();
    }
  };
  _0x5ef9eb.onchange = _0x2e4ab5 => {
    _0x110f2d = parseInt(_0x2e4ab5.target.value);
    _0xc4be79 = 1;
    _0x576468();
  };
  _0x39f8eb();
  _0x576468();
  console.log("[VibeGroup] Visual selector opened with", _0x55c2d4.length, "presets");
}
async function exportVibeGroup(_0x2bfcc9) {
  const _0x3d4881 = extension_settings[extensionName];
  const _0x49792f = _0x3d4881.vibeGroups || {};
  const _0x54864a = _0x49792f[_0x2bfcc9];
  if (!_0x54864a) {
    throw new Error("Group \"" + _0x2bfcc9 + "\" not found");
  }
  const _0x2a6161 = _0x54864a.vibes.map(_0x3c2b8d => _0x3c2b8d.vibeDataId);
  const _0x33c0a5 = new Set(_0x2a6161);
  const _0x15b145 = {};
  for (const _0x5a0d34 of _0x2a6161) {
    try {
      const _0x4fa291 = await getConfigImage(_0x5a0d34);
      if (_0x4fa291) {
        const _0x261e5a = parseVibeDataFromDataUrl(_0x4fa291);
        if (_0x261e5a) {
          _0x15b145[_0x5a0d34] = _0x261e5a;
        } else {
          console.warn("[VibeGroup] Failed to parse Vibe data for export:", _0x5a0d34);
        }
      } else {
        console.warn("[VibeGroup] Vibe data not found for ID:", _0x5a0d34);
      }
    } catch (_0x3d5dc1) {
      let _0x446e62 = _0x3d5dc1.name || "Error";
      if (_0x3d5dc1.name === "QuotaExceededError" || _0x3d5dc1.message.includes("quota")) {
        _0x446e62 = "QuotaExceededError";
      } else if (_0x3d5dc1.name === "NotFoundError") {
        _0x446e62 = "NotFoundError";
      } else if (_0x3d5dc1.name === "InvalidStateError") {
        _0x446e62 = "InvalidStateError";
      }
      console.error("[VibeGroup] Failed to load Vibe data for export:", {
        vibeDataId: _0x5a0d34.substring(0, 12) + "...",
        error: _0x3d5dc1.message,
        errorName: _0x446e62,
        timestamp: new Date().toISOString(),
        stack: _0x3d5dc1.stack
      });
    }
  }
  const _0x20f4fc = {};
  const _0x2e362c = _0x3d4881.vibePresets || {};
  for (const _0x2b84ab in _0x2e362c) {
    const _0x11c1d4 = _0x2e362c[_0x2b84ab];
    if (_0x11c1d4.vibeDataId && _0x33c0a5.has(_0x11c1d4.vibeDataId)) {
      const _0x169383 = {
        ..._0x11c1d4
      };
      _0x20f4fc[_0x2b84ab] = _0x169383;
    }
  }
  const _0x492968 = {};
  for (const _0x129973 in _0x20f4fc) {
    const _0x247ae8 = _0x20f4fc[_0x129973];
    if (_0x247ae8.imageId) {
      try {
        const _0x5242cd = await getConfigImage(_0x247ae8.imageId);
        if (_0x5242cd) {
          _0x492968[_0x247ae8.imageId] = _0x5242cd;
        }
      } catch (_0xbca2b4) {
        console.warn("[VibeGroup] Failed to load preset image for export:", _0x247ae8.imageId, _0xbca2b4.message);
      }
    }
  }
  const _0x111efe = {
    vibes: _0x54864a.vibes,
    createdAt: _0x54864a.createdAt,
    updatedAt: _0x54864a.updatedAt
  };
  const _0x35810d = {
    [_0x2bfcc9]: _0x111efe
  };
  const _0x557554 = {
    groups: _0x35810d,
    vibeData: _0x15b145,
    vibePresets: _0x20f4fc,
    presetImages: _0x492968
  };
  const _0x42e830 = _0x557554;
  const _0x371791 = JSON.stringify(_0x42e830, null, 2);
  const _0x16f671 = new Blob([_0x371791], {
    type: "application/json"
  });
  const _0x263c1a = URL.createObjectURL(_0x16f671);
  const _0x3719b3 = document.createElement("a");
  _0x3719b3.href = _0x263c1a;
  _0x3719b3.download = "vibe-group-" + _0x2bfcc9 + "-" + Date.now() + ".json";
  document.body.appendChild(_0x3719b3);
  _0x3719b3.click();
  document.body.removeChild(_0x3719b3);
  URL.revokeObjectURL(_0x263c1a);
  console.log("[VibeGroup] Exported group:", _0x2bfcc9, "with", _0x2a6161.length, "Vibes,", Object.keys(_0x20f4fc).length, "presets");
}
async function exportAllVibeGroups() {
  const _0xf8f424 = extension_settings[extensionName];
  const _0x1dfe54 = _0xf8f424.vibeGroups || {};
  const _0x3c6035 = new Set();
  for (const _0x2f11ec in _0x1dfe54) {
    const _0x12b0fe = _0x1dfe54[_0x2f11ec];
    if (_0x12b0fe.vibes) {
      _0x12b0fe.vibes.forEach(_0x1c1e29 => _0x3c6035.add(_0x1c1e29.vibeDataId));
    }
  }
  const _0x52a340 = {};
  for (const _0xe88fc2 of _0x3c6035) {
    try {
      const _0x4b93e6 = await getConfigImage(_0xe88fc2);
      if (_0x4b93e6) {
        const _0x3bffa3 = parseVibeDataFromDataUrl(_0x4b93e6);
        if (_0x3bffa3) {
          _0x52a340[_0xe88fc2] = _0x3bffa3;
        } else {
          console.warn("[VibeGroup] Failed to parse Vibe data for export all:", _0xe88fc2);
        }
      } else {
        console.warn("[VibeGroup] Vibe data not found for ID:", _0xe88fc2);
      }
    } catch (_0x5f0f71) {
      let _0x373239 = _0x5f0f71.name || "Error";
      if (_0x5f0f71.name === "QuotaExceededError" || _0x5f0f71.message.includes("quota")) {
        _0x373239 = "QuotaExceededError";
      } else if (_0x5f0f71.name === "NotFoundError") {
        _0x373239 = "NotFoundError";
      } else if (_0x5f0f71.name === "InvalidStateError") {
        _0x373239 = "InvalidStateError";
      }
      console.error("[VibeGroup] Failed to load Vibe data for export all:", {
        vibeDataId: _0xe88fc2.substring(0, 12) + "...",
        error: _0x5f0f71.message,
        errorName: _0x373239,
        timestamp: new Date().toISOString(),
        stack: _0x5f0f71.stack
      });
    }
  }
  const _0x180b58 = {};
  const _0x348af0 = _0xf8f424.vibePresets || {};
  for (const _0x4e3067 in _0x348af0) {
    const _0x405d87 = _0x348af0[_0x4e3067];
    if (_0x405d87.vibeDataId && _0x3c6035.has(_0x405d87.vibeDataId)) {
      const _0x23ea74 = {
        ..._0x405d87
      };
      _0x180b58[_0x4e3067] = _0x23ea74;
    }
  }
  const _0x557fc8 = {};
  for (const _0x3aeb64 in _0x180b58) {
    const _0x2d0b98 = _0x180b58[_0x3aeb64];
    if (_0x2d0b98.imageId) {
      try {
        const _0x47609b = await getConfigImage(_0x2d0b98.imageId);
        if (_0x47609b) {
          _0x557fc8[_0x2d0b98.imageId] = _0x47609b;
        }
      } catch (_0x5193c8) {
        console.warn("[VibeGroup] Failed to load preset image for export all:", _0x2d0b98.imageId, _0x5193c8.message);
      }
    }
  }
  const _0x520c2e = {
    groups: _0x1dfe54,
    vibeData: _0x52a340,
    vibePresets: _0x180b58,
    presetImages: _0x557fc8
  };
  const _0x4d0f5f = _0x520c2e;
  const _0x35c568 = JSON.stringify(_0x4d0f5f, null, 2);
  const _0x22c361 = new Blob([_0x35c568], {
    type: "application/json"
  });
  const _0x27888b = URL.createObjectURL(_0x22c361);
  const _0x3e8b8e = document.createElement("a");
  _0x3e8b8e.href = _0x27888b;
  _0x3e8b8e.download = "vibe-groups-all-" + Date.now() + ".json";
  document.body.appendChild(_0x3e8b8e);
  _0x3e8b8e.click();
  document.body.removeChild(_0x3e8b8e);
  URL.revokeObjectURL(_0x27888b);
  console.log("[VibeGroup] Exported all groups:", Object.keys(_0x1dfe54).length, "groups with", _0x3c6035.size, "unique Vibes,", Object.keys(_0x180b58).length, "presets");
}
function readFileAsText(_0x160ccc) {
  return new Promise((_0x1c2d59, _0x593dce) => {
    const _0x2cf1b6 = new FileReader();
    _0x2cf1b6.onload = _0x1ef488 => _0x1c2d59(_0x1ef488.target.result);
    _0x2cf1b6.onerror = _0x403c51 => _0x593dce(new Error("文件读取失败"));
    _0x2cf1b6.readAsText(_0x160ccc);
  });
}
async function importVibeGroup(_0x24f1b6) {
  const _0x462edf = {
    success: false,
    groupsImported: 0,
    vibesImported: 0,
    presetsImported: 0,
    errors: [],
    warnings: []
  };
  try {
    let _0x327eb4;
    try {
      _0x327eb4 = JSON.parse(_0x24f1b6);
    } catch (_0x28d7c5) {
      _0x462edf.errors.push("文件格式错误: 无效的 JSON 格式");
      console.error("[VibeGroup] JSON parse error:", {
        error: _0x28d7c5.message,
        errorName: _0x28d7c5.name,
        position: _0x28d7c5.message.match(/position (\d+)/)?.[1] || "unknown",
        fileSize: _0x24f1b6.length,
        timestamp: new Date().toISOString()
      });
      console.error("[VibeGroup] First 200 characters of file:", _0x24f1b6.substring(0, 200));
      return _0x462edf;
    }
    if (!_0x327eb4 || typeof _0x327eb4 !== "object") {
      _0x462edf.errors.push("文件格式错误: 根对象无效");
      return _0x462edf;
    }
    if (!_0x327eb4.groups || typeof _0x327eb4.groups !== "object") {
      _0x462edf.errors.push("文件格式错误: 缺少 groups 字段");
      return _0x462edf;
    }
    if (!_0x327eb4.vibeData || typeof _0x327eb4.vibeData !== "object") {
      _0x462edf.errors.push("文件格式错误: 缺少 vibeData 字段");
      return _0x462edf;
    }
    const _0x2eecf6 = extension_settings[extensionName];
    const _0x4c814c = _0x2eecf6.vibeGroups || {};
    const _0x4c2f35 = new Set();
    const _0x25cddd = Object.keys(_0x327eb4.vibeData);
    for (const _0x41dbe0 of _0x25cddd) {
      const _0x465ce1 = _0x327eb4.vibeData[_0x41dbe0];
      if (!validateVibeData(_0x465ce1)) {
        _0x462edf.warnings.push("跳过无效的 Vibe 数据: " + _0x41dbe0);
        console.warn("[VibeGroup] Invalid Vibe data structure:", _0x41dbe0, _0x465ce1);
        continue;
      }
      try {
        const _0x2c9c76 = await saveVibeDataWithDuplicatePrevention(_0x465ce1);
        if (_0x2c9c76 !== _0x41dbe0) {
          console.log("[VibeGroup] Remapping Vibe ID:", _0x41dbe0, "->", _0x2c9c76);
          for (const _0x10dcc8 in _0x327eb4.groups) {
            const _0x5a888e = _0x327eb4.groups[_0x10dcc8];
            if (_0x5a888e.vibes && Array.isArray(_0x5a888e.vibes)) {
              _0x5a888e.vibes.forEach(_0xacdccb => {
                if (_0xacdccb.vibeDataId === _0x41dbe0) {
                  _0xacdccb.vibeDataId = _0x2c9c76;
                }
              });
            }
          }
          if (_0x327eb4.vibePresets && typeof _0x327eb4.vibePresets === "object") {
            for (const _0x3820d8 in _0x327eb4.vibePresets) {
              const _0x58cc0d = _0x327eb4.vibePresets[_0x3820d8];
              if (_0x58cc0d.vibeDataId === _0x41dbe0) {
                _0x58cc0d.vibeDataId = _0x2c9c76;
              }
            }
          }
        }
        _0x462edf.vibesImported++;
        _0x4c2f35.add(_0x2c9c76);
        console.log("[VibeGroup] Imported Vibe data:", _0x2c9c76);
      } catch (_0x55f207) {
        _0x462edf.warnings.push("保存 Vibe 数据失败: " + _0x41dbe0);
        let _0x52db4e = _0x55f207.name || "Error";
        if (_0x55f207.name === "QuotaExceededError" || _0x55f207.message.includes("quota")) {
          _0x52db4e = "QuotaExceededError";
        } else if (_0x55f207.name === "NotFoundError") {
          _0x52db4e = "NotFoundError";
        } else if (_0x55f207.name === "InvalidStateError") {
          _0x52db4e = "InvalidStateError";
        }
        console.error("[VibeGroup] Failed to save Vibe data:", {
          vibeDataId: _0x41dbe0.substring(0, 12) + "...",
          error: _0x55f207.message,
          errorName: _0x52db4e,
          timestamp: new Date().toISOString(),
          stack: _0x55f207.stack
        });
      }
    }
    const _0x3d4216 = Object.keys(_0x327eb4.groups);
    for (const _0x18b7c0 of _0x3d4216) {
      const _0x500584 = _0x327eb4.groups[_0x18b7c0];
      if (!_0x500584 || typeof _0x500584 !== "object") {
        _0x462edf.warnings.push("跳过无效的组: " + _0x18b7c0);
        console.warn("[VibeGroup] Invalid group data:", _0x18b7c0, _0x500584);
        continue;
      }
      if (!Array.isArray(_0x500584.vibes)) {
        _0x462edf.warnings.push("跳过无效的组 (vibes 不是数组): " + _0x18b7c0);
        console.warn("[VibeGroup] Group vibes is not an array:", _0x18b7c0, _0x500584);
        continue;
      }
      let _0x2c2493 = _0x18b7c0;
      let _0x29d540 = 1;
      while (_0x4c814c[_0x2c2493]) {
        _0x2c2493 = _0x18b7c0 + " (" + _0x29d540 + ")";
        _0x29d540++;
      }
      if (_0x2c2493 !== _0x18b7c0) {
        _0x462edf.warnings.push("组名冲突: \"" + _0x18b7c0 + "\" 已重命名为 \"" + _0x2c2493 + "\"");
        console.log("[VibeGroup] Group name conflict, renamed:", _0x18b7c0, "->", _0x2c2493);
      }
      const _0x49a81d = [];
      for (const _0x4fe2b6 of _0x500584.vibes) {
        if (!_0x4fe2b6 || typeof _0x4fe2b6 !== "object" || !_0x4fe2b6.vibeDataId) {
          _0x462edf.warnings.push("跳过无效的 Vibe 引用 (组: " + _0x2c2493 + ")");
          continue;
        }
        if (!_0x4c2f35.has(_0x4fe2b6.vibeDataId)) {
          _0x462edf.warnings.push("跳过缺失的 Vibe: " + _0x4fe2b6.vibeDataId + " (组: " + _0x2c2493 + ")");
          console.warn("[VibeGroup] Vibe data not successfully imported:", _0x4fe2b6.vibeDataId);
          continue;
        }
        let _0x55b044 = parseFloat(_0x4fe2b6.strength);
        if (isNaN(_0x55b044) || _0x55b044 < 0 || _0x55b044 > 1) {
          _0x55b044 = 0.6;
          _0x462edf.warnings.push("Vibe 强度值无效，已重置为默认值 (组: " + _0x2c2493 + ")");
        }
        const _0x5ab048 = {
          vibeDataId: _0x4fe2b6.vibeDataId,
          strength: _0x55b044
        };
        _0x49a81d.push(_0x5ab048);
      }
      _0x4c814c[_0x2c2493] = {
        vibes: _0x49a81d,
        createdAt: _0x500584.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      _0x462edf.groupsImported++;
      console.log("[VibeGroup] Imported group:", _0x2c2493, "with", _0x49a81d.length, "Vibes");
    }
    if (_0x327eb4.vibePresets && typeof _0x327eb4.vibePresets === "object") {
      const _0x1a44eb = {};
      if (_0x327eb4.presetImages && typeof _0x327eb4.presetImages === "object") {
        for (const _0x19a087 in _0x327eb4.presetImages) {
          try {
            const _0x26fa74 = _0x327eb4.presetImages[_0x19a087];
            if (_0x26fa74 && typeof _0x26fa74 === "string") {
              const _0x2bba3a = await saveConfigImage(_0x26fa74);
              _0x1a44eb[_0x19a087] = _0x2bba3a;
              console.log("[VibeGroup] Imported preset image:", _0x19a087, "->", _0x2bba3a);
            }
          } catch (_0x5c2dbc) {
            console.warn("[VibeGroup] Failed to import preset image:", _0x19a087, _0x5c2dbc.message);
          }
        }
      }
      const _0x125d73 = _0x2eecf6.vibePresets || {};
      const _0x261add = Object.keys(_0x327eb4.vibePresets);
      for (const _0x251a76 of _0x261add) {
        const _0x45b3db = _0x327eb4.vibePresets[_0x251a76];
        if (!_0x45b3db || typeof _0x45b3db !== "object") {
          _0x462edf.warnings.push("跳过无效的预设: " + _0x251a76);
          console.warn("[VibeGroup] Invalid preset data:", _0x251a76, _0x45b3db);
          continue;
        }
        let _0x169940 = _0x251a76;
        let _0x2c7f21 = 1;
        while (_0x125d73[_0x169940]) {
          _0x169940 = _0x251a76 + " (" + _0x2c7f21 + ")";
          _0x2c7f21++;
        }
        if (_0x169940 !== _0x251a76) {
          _0x462edf.warnings.push("预设名冲突: \"" + _0x251a76 + "\" 已重命名为 \"" + _0x169940 + "\"");
          console.log("[VibeGroup] Preset name conflict, renamed:", _0x251a76, "->", _0x169940);
        }
        const _0x675f11 = _0x45b3db.imageId ? _0x1a44eb[_0x45b3db.imageId] || _0x45b3db.imageId : null;
        _0x125d73[_0x169940] = {
          model: _0x45b3db.model || "nai-diffusion-4-5-curated",
          infoExtract: typeof _0x45b3db.infoExtract === "number" ? _0x45b3db.infoExtract : 1,
          strength: typeof _0x45b3db.strength === "number" ? _0x45b3db.strength : 0.6,
          imageId: _0x675f11,
          vibeDataId: _0x45b3db.vibeDataId || null
        };
        _0x462edf.presetsImported++;
        console.log("[VibeGroup] Imported preset:", _0x169940);
      }
      _0x2eecf6.vibePresets = _0x125d73;
    }
    saveSettingsDebounced();
    _0x462edf.success = true;
    return _0x462edf;
  } catch (_0x9ee2d4) {
    _0x462edf.errors.push("导入失败: " + _0x9ee2d4.message);
    console.error("[VibeGroup] Import error:", {
      error: _0x9ee2d4.message,
      errorName: _0x9ee2d4.name,
      timestamp: new Date().toISOString(),
      stack: _0x9ee2d4.stack
    });
    return _0x462edf;
  }
}
function validateVibeData(_0xb931a4) {
  if (!_0xb931a4 || typeof _0xb931a4 !== "object") {
    return false;
  }
  if (_0xb931a4.identifier !== "novelai-vibe-transfer") {
    return false;
  }
  if (_0xb931a4.version !== 1) {
    return false;
  }
  if (!_0xb931a4.image || typeof _0xb931a4.image !== "string") {
    return false;
  }
  if (!_0xb931a4.encodings || typeof _0xb931a4.encodings !== "object") {
    return false;
  }
  if (!_0xb931a4.id || typeof _0xb931a4.id !== "string") {
    console.warn("[VibeGroup] Vibe data missing id field");
  }
  return true;
}
function validateVibeGroupStorage(_0x11b510, _0x1c11e9) {
  if (!_0x11b510 || typeof _0x11b510 !== "object") {
    console.warn("[VibeGroup] Invalid group structure:", _0x1c11e9);
    return false;
  }
  if (!Array.isArray(_0x11b510.vibes)) {
    console.warn("[VibeGroup] Group vibes is not an array:", _0x1c11e9);
    return false;
  }
  let _0x157d7e = true;
  for (let _0x37237c = 0; _0x37237c < _0x11b510.vibes.length; _0x37237c++) {
    const _0x3f19ca = _0x11b510.vibes[_0x37237c];
    if (!_0x3f19ca || typeof _0x3f19ca !== "object") {
      console.warn("[VibeGroup] Invalid Vibe reference at index " + _0x37237c + " in group \"" + _0x1c11e9 + "\"");
      _0x157d7e = false;
      continue;
    }
    if (!_0x3f19ca.vibeDataId || typeof _0x3f19ca.vibeDataId !== "string") {
      console.warn("[VibeGroup] Missing or invalid vibeDataId at index " + _0x37237c + " in group \"" + _0x1c11e9 + "\"");
      _0x157d7e = false;
    }
    if (typeof _0x3f19ca.strength !== "number") {
      console.warn("[VibeGroup] Missing or invalid strength at index " + _0x37237c + " in group \"" + _0x1c11e9 + "\"");
      _0x157d7e = false;
    }
    const _0x14e063 = ["vibeDataId", "strength"];
    const _0x8c430f = Object.keys(_0x3f19ca);
    const _0x49c89c = _0x8c430f.filter(_0x49f57a => !_0x14e063.includes(_0x49f57a));
    if (_0x49c89c.length > 0) {
      console.warn("[VibeGroup] Group \"" + _0x1c11e9 + "\" contains extra fields in Vibe reference at index " + _0x37237c + ":", _0x49c89c);
      console.warn("[VibeGroup] Groups should only store vibeDataId and strength, not full Vibe data");
      _0x157d7e = false;
    }
    if (typeof _0x3f19ca.strength === "number" && (_0x3f19ca.strength < 0 || _0x3f19ca.strength > 1)) {
      console.warn("[VibeGroup] Strength value out of range [0, 1] at index " + _0x37237c + " in group \"" + _0x1c11e9 + "\": " + _0x3f19ca.strength);
      _0x157d7e = false;
    }
  }
  return _0x157d7e;
}
export function validateAllVibeGroups() {
  const _0x5e3abc = extension_settings[extensionName];
  const _0x4b1dba = _0x5e3abc.vibeGroups || {};
  const _0x4bd53d = {
    totalGroups: 0,
    validGroups: 0,
    invalidGroups: 0,
    issues: []
  };
  const _0x4741bb = Object.keys(_0x4b1dba);
  _0x4bd53d.totalGroups = _0x4741bb.length;
  for (const _0x44bd58 of _0x4741bb) {
    const _0x5c8aad = _0x4b1dba[_0x44bd58];
    const _0x211f4e = validateVibeGroupStorage(_0x5c8aad, _0x44bd58);
    if (_0x211f4e) {
      _0x4bd53d.validGroups++;
    } else {
      _0x4bd53d.invalidGroups++;
      _0x4bd53d.issues.push(_0x44bd58);
    }
  }
  console.log("[VibeGroup] Validation complete:", _0x4bd53d);
  return _0x4bd53d;
}
const vibeDataCache = new Map();
export async function resolveVibeData(_0x110aa6, _0x469d9c = true) {
  if (!_0x110aa6 || typeof _0x110aa6 !== "string") {
    console.warn("[VibeGroup] Invalid vibeDataId provided to resolveVibeData:", _0x110aa6);
    return null;
  }
  if (_0x469d9c && vibeDataCache.has(_0x110aa6)) {
    console.log("[VibeGroup] Resolved Vibe data from cache:", _0x110aa6);
    return vibeDataCache.get(_0x110aa6);
  }
  try {
    const _0x4a8082 = await getConfigImage(_0x110aa6);
    if (!_0x4a8082) {
      console.warn("[VibeGroup] Vibe data not found in configDatabase:", _0x110aa6);
      return null;
    }
    if (!validateVibeData(_0x4a8082)) {
      console.warn("[VibeGroup] Loaded Vibe data is invalid:", _0x110aa6);
      return null;
    }
    vibeDataCache.set(_0x110aa6, _0x4a8082);
    console.log("[VibeGroup] Resolved and cached Vibe data:", _0x110aa6);
    return _0x4a8082;
  } catch (_0x221c30) {
    console.error("[VibeGroup] ConfigDatabase access error while loading Vibe data:", {
      vibeDataId: _0x110aa6,
      error: _0x221c30.message,
      stack: _0x221c30.stack,
      timestamp: new Date().toISOString()
    });
    if (_0x221c30.name === "QuotaExceededError" || _0x221c30.message.includes("quota")) {
      console.error("[VibeGroup] Storage quota exceeded. Consider deleting unused Vibes or clearing cache.");
    } else if (_0x221c30.name === "NotFoundError") {
      console.error("[VibeGroup] Vibe data not found in database:", _0x110aa6);
    } else if (_0x221c30.name === "InvalidStateError") {
      console.error("[VibeGroup] Database is in an invalid state. Try refreshing the page.");
    }
    return null;
  }
}
export async function resolveMultipleVibeData(_0x2a99cc, _0x24fab4 = true) {
  const _0x2652e2 = {};
  const _0xb8263d = _0x2a99cc.map(async _0x5df4ef => {
    const _0x27e6d5 = await resolveVibeData(_0x5df4ef, _0x24fab4);
    _0x2652e2[_0x5df4ef] = _0x27e6d5;
  });
  await Promise.all(_0xb8263d);
  return _0x2652e2;
}
export function clearVibeDataCache(_0x1a7bc0) {
  if (_0x1a7bc0) {
    vibeDataCache.delete(_0x1a7bc0);
    console.log("[VibeGroup] Cleared cache for Vibe:", _0x1a7bc0);
  } else {
    vibeDataCache.clear();
    console.log("[VibeGroup] Cleared all Vibe data cache");
  }
}
export function getVibeDataCacheStats() {
  return {
    size: vibeDataCache.size,
    keys: Array.from(vibeDataCache.keys())
  };
}
export async function findExistingVibeData(_0x5aacfd) {
  if (!_0x5aacfd || typeof _0x5aacfd !== "object") {
    return null;
  }
  const _0x2c73ed = extension_settings[extensionName];
  const _0x510742 = _0x2c73ed.vibeGroups || {};
  const _0x4414de = _0x2c73ed.vibePresets || {};
  const _0x59ddd5 = new Set();
  for (const _0x8e9820 in _0x510742) {
    const _0x3ce9fc = _0x510742[_0x8e9820];
    if (_0x3ce9fc.vibes && Array.isArray(_0x3ce9fc.vibes)) {
      _0x3ce9fc.vibes.forEach(_0x2a5779 => {
        if (_0x2a5779.vibeDataId) {
          _0x59ddd5.add(_0x2a5779.vibeDataId);
        }
      });
    }
  }
  for (const _0x4525c6 in _0x4414de) {
    const _0x1d45ff = _0x4414de[_0x4525c6];
    if (_0x1d45ff.vibeDataId) {
      _0x59ddd5.add(_0x1d45ff.vibeDataId);
    }
  }
  for (const _0x3f45ad of _0x59ddd5) {
    try {
      const _0x467ae3 = await resolveVibeData(_0x3f45ad, true);
      if (_0x467ae3 && areVibesEqual(_0x5aacfd, _0x467ae3)) {
        console.log("[VibeGroup] Found existing Vibe data:", _0x3f45ad);
        return _0x3f45ad;
      }
    } catch (_0xd3ee0f) {
      console.warn("[VibeGroup] Error checking Vibe:", {
        vibeDataId: _0x3f45ad.substring(0, 12) + "...",
        error: _0xd3ee0f.message,
        errorName: _0xd3ee0f.name,
        timestamp: new Date().toISOString()
      });
    }
  }
  return null;
}
function areVibesEqual(_0x145fa4, _0x5c2359) {
  if (!_0x145fa4 || !_0x5c2359) {
    return false;
  }
  if (_0x145fa4.image !== _0x5c2359.image) {
    return false;
  }
  if (!_0x145fa4.encodings || !_0x5c2359.encodings) {
    return false;
  }
  const _0x176a55 = Object.keys(_0x145fa4.encodings).sort();
  const _0x1f0b57 = Object.keys(_0x5c2359.encodings).sort();
  if (_0x176a55.length !== _0x1f0b57.length) {
    return false;
  }
  for (let _0x246de9 = 0; _0x246de9 < _0x176a55.length; _0x246de9++) {
    if (_0x176a55[_0x246de9] !== _0x1f0b57[_0x246de9]) {
      return false;
    }
    const _0x5ad4dc = JSON.stringify(_0x145fa4.encodings[_0x176a55[_0x246de9]]);
    const _0x420231 = JSON.stringify(_0x5c2359.encodings[_0x1f0b57[_0x246de9]]);
    if (_0x5ad4dc !== _0x420231) {
      return false;
    }
  }
  return true;
}
export async function saveVibeDataWithDuplicatePrevention(_0x5edd4f) {
  if (!_0x5edd4f || typeof _0x5edd4f !== "object") {
    const _0x334eee = new Error("Invalid Vibe data provided");
    console.error("[VibeGroup] Validation error:", {
      error: _0x334eee.message,
      vibeData: _0x5edd4f,
      timestamp: new Date().toISOString()
    });
    throw _0x334eee;
  }
  try {
    const _0x419f22 = await findExistingVibeData(_0x5edd4f);
    if (_0x419f22) {
      console.log("[VibeGroup] Reusing existing Vibe ID:", _0x419f22);
      return _0x419f22;
    }
    const _0x3702a4 = "data:application/json;base64," + btoa(JSON.stringify(_0x5edd4f));
    const _0x2d1c22 = await saveConfigImage(_0x3702a4, {
      format: "png",
      filename: "vibe_group_" + Date.now()
    });
    console.log("[VibeGroup] Saved new Vibe data:", _0x2d1c22);
    vibeDataCache.set(_0x2d1c22, _0x5edd4f);
    return _0x2d1c22;
  } catch (_0x5849fb) {
    console.error("[VibeGroup] ConfigDatabase save error:", {
      error: _0x5849fb.message,
      errorName: _0x5849fb.name,
      stack: _0x5849fb.stack,
      vibeDataSize: JSON.stringify(_0x5edd4f).length,
      timestamp: new Date().toISOString()
    });
    if (_0x5849fb.name === "QuotaExceededError" || _0x5849fb.message.includes("quota")) {
      console.error("[VibeGroup] Storage quota exceeded error. Database is full.");
      console.error("[VibeGroup] Suggested actions:");
      console.error("[VibeGroup]   1. Delete unused Vibe presets");
      console.error("[VibeGroup]   2. Clear browser cache");
      console.error("[VibeGroup]   3. Export important data before clearing");
      throw new Error("存储空间已满。请删除未使用的 Vibe 或清除缓存。");
    } else if (_0x5849fb.name === "InvalidStateError") {
      console.error("[VibeGroup] Database is in an invalid state");
      throw new Error("数据库状态无效。请刷新页面后重试。");
    } else if (_0x5849fb.name === "DataError") {
      console.error("[VibeGroup] Data format error");
      throw new Error("数据格式错误。请检查 Vibe 数据是否有效。");
    }
    throw _0x5849fb;
  }
}
export function getVibeReferenceCount(_0x4d0c24) {
  const _0xec639b = extension_settings[extensionName];
  const _0x4e6dbd = _0xec639b.vibeGroups || {};
  const _0xe9a1b7 = _0xec639b.vibePresets || {};
  let _0x296bc3 = 0;
  let _0x4b5a7b = 0;
  const _0x1e960c = [];
  const _0x3cdfae = [];
  for (const _0x24d792 in _0x4e6dbd) {
    const _0x5b07cf = _0x4e6dbd[_0x24d792];
    if (_0x5b07cf.vibes && Array.isArray(_0x5b07cf.vibes)) {
      const _0xea68a7 = _0x5b07cf.vibes.some(_0x33cd28 => _0x33cd28.vibeDataId === _0x4d0c24);
      if (_0xea68a7) {
        _0x296bc3++;
        _0x1e960c.push(_0x24d792);
      }
    }
  }
  for (const _0x18d21a in _0xe9a1b7) {
    const _0x241cae = _0xe9a1b7[_0x18d21a];
    if (_0x241cae.vibeDataId === _0x4d0c24) {
      _0x4b5a7b++;
      _0x3cdfae.push(_0x18d21a);
    }
  }
  return {
    total: _0x296bc3 + _0x4b5a7b,
    groupReferences: _0x296bc3,
    presetReferences: _0x4b5a7b,
    referencingGroups: _0x1e960c,
    referencingPresets: _0x3cdfae
  };
}
export async function showVibeGroupVisualSelector(_0xd11aad) {
  const _0x2b2df7 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x48bb80 = extension_settings[extensionName];
  ensureVibeGroupPresets();
  let _0x508c93 = 1;
  let _0x3e690b = 12;
  let _0x3b444d = [];
  let _0x1a897c = "";
  let _0x1f9359 = false;
  let _0x201400 = new Set();
  const _0x5948f9 = document.createElement("div");
  _0x5948f9.className = "st-chatu8-workflow-viz-backdrop st-chatu8-preset-viz-dialog-wrapper";
  _0x5948f9.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-vibe-group-visual-selector-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>选择 Vibe 组预设</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-toolbar\" style=\"justify-content: space-between; align-items: center; gap: 15px; padding: 12px 20px; background: rgba(30, 30, 46, 0.6); border-bottom: 1px solid rgba(255,255,255,0.05);\">\n                <div class=\"st-chatu8-viz-search-container\" style=\"position: relative; flex-grow: 1; max-width: 300px;\">\n                    <i class=\"fa-solid fa-search\" style=\"position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none;\"></i>\n                    <input type=\"text\" class=\"st-chatu8-viz-search-input\" placeholder=\"搜索 Vibe 组...\" style=\"width: 100%; padding: 8px 12px 8px 36px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: white; outline: none; transition: all 0.3s;\">\n                </div>\n                <div class=\"st-chatu8-viz-mode-controls\" style=\"display: flex; gap: 8px;\">\n                    <button class=\"st-chatu8-btn st-chatu8-btn-secondary st-chatu8-mode-toggle-manage\" title=\"管理模式\">\n                        <i class=\"fa-solid fa-cog\"></i> 管理\n                    </button>\n                    <button class=\"st-chatu8-btn st-chatu8-btn-danger st-chatu8-mode-toggle-bulk-delete\" title=\"批量删除模式\">\n                        <i class=\"fa-solid fa-trash\"></i> 批量删除\n                    </button>\n                </div>\n            </div>\n            <div class=\"st-chatu8-pagination-container\">\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-prev\" title=\"上一页\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-info\">\n                    <span class=\"st-chatu8-pagination-current\">1</span>\n                    <span>/</span>\n                    <span class=\"st-chatu8-pagination-total\">1</span>\n                    <span style=\"margin-left: 8px; color: #666;\">|</span>\n                    <span style=\"margin-left: 8px;\">共 <span class=\"st-chatu8-pagination-count\">0</span> 个</span>\n                </div>\n                <button class=\"st-chatu8-pagination-btn st-chatu8-pagination-next\" title=\"下一页\">\n                    <i class=\"fa-solid fa-chevron-right\"></i>\n                </button>\n                <div class=\"st-chatu8-pagination-size-container\">\n                    <span class=\"st-chatu8-pagination-size-label\">每页</span>\n                    <select class=\"st-chatu8-pagination-size\">\n                        <option value=\"8\">8</option>\n                        <option value=\"12\" selected>12</option>\n                        <option value=\"16\">16</option>\n                        <option value=\"24\">24</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\">\n                <div class=\"st-chatu8-preset-grid\">\n                    <!-- Vibe group preset cards will be inserted here -->\n                </div>\n            </div>\n        </div>\n    ";
  _0x2b2df7.appendChild(_0x5948f9);
  const _0x308d43 = _0x5948f9.querySelector(".st-chatu8-workflow-viz-close");
  _0x308d43.onclick = () => _0x2b2df7.removeChild(_0x5948f9);
  _0x5948f9.onclick = _0x4382a9 => {
    if (_0x4382a9.target === _0x5948f9) {
      _0x2b2df7.removeChild(_0x5948f9);
    }
  };
  function _0x3df728() {
    const _0x3a3898 = _0x48bb80.vibeGroups || {};
    let _0x202c92 = Object.keys(_0x3a3898);
    if (_0x1a897c && _0x1a897c.trim() !== "") {
      const _0x30ac5f = _0x1a897c.toLowerCase();
      _0x202c92 = _0x202c92.filter(_0x561674 => _0x561674.toLowerCase().includes(_0x30ac5f));
    }
    _0x202c92.sort((_0x5374d0, _0x2b048d) => {
      if (_0x5374d0 === "默认组") {
        return -1;
      }
      if (_0x2b048d === "默认组") {
        return 1;
      }
      return _0x5374d0.localeCompare(_0x2b048d, "zh-CN");
    });
    _0x3b444d = _0x202c92;
    console.log("[VibeGroupVisualSelector] Filtered presets:", _0x3b444d.length, "of", Object.keys(_0x3a3898).length);
  }
  function _0x452f1c() {
    const _0x48f30d = _0x5948f9.querySelector(".st-chatu8-pagination-current");
    const _0x4378be = _0x5948f9.querySelector(".st-chatu8-pagination-total");
    const _0x49ea16 = _0x5948f9.querySelector(".st-chatu8-pagination-count");
    const _0x459232 = _0x5948f9.querySelector(".st-chatu8-pagination-prev");
    const _0x40fd56 = _0x5948f9.querySelector(".st-chatu8-pagination-next");
    const _0x1bbcec = Math.max(1, Math.ceil(_0x3b444d.length / _0x3e690b));
    if (_0x508c93 > _0x1bbcec) {
      _0x508c93 = _0x1bbcec;
    }
    if (_0x508c93 < 1) {
      _0x508c93 = 1;
    }
    _0x48f30d.textContent = _0x508c93;
    _0x4378be.textContent = _0x1bbcec;
    _0x49ea16.textContent = _0x3b444d.length;
    if (_0x508c93 <= 1) {
      _0x459232.disabled = true;
      _0x459232.style.opacity = "0.5";
      _0x459232.style.cursor = "not-allowed";
    } else {
      _0x459232.disabled = false;
      _0x459232.style.opacity = "1";
      _0x459232.style.cursor = "pointer";
    }
    if (_0x508c93 >= _0x1bbcec) {
      _0x40fd56.disabled = true;
      _0x40fd56.style.opacity = "0.5";
      _0x40fd56.style.cursor = "not-allowed";
    } else {
      _0x40fd56.disabled = false;
      _0x40fd56.style.opacity = "1";
      _0x40fd56.style.cursor = "pointer";
    }
    const _0x200a61 = {
      currentPage: _0x508c93,
      totalPages: _0x1bbcec,
      totalPresets: _0x3b444d.length,
      pageSize: _0x3e690b
    };
    console.log("[VibeGroupVisualSelector] Pagination updated:", _0x200a61);
  }
  const _0x4190a9 = _0x5948f9.querySelector(".st-chatu8-pagination-prev");
  const _0x23282e = _0x5948f9.querySelector(".st-chatu8-pagination-next");
  const _0x5d1ba4 = _0x5948f9.querySelector(".st-chatu8-pagination-size");
  async function _0x277386(_0x1b51d9) {
    const {
      presetName: _0x4d6b76,
      preset: _0x3b0df0,
      isSelected: _0x471e25,
      onCardClick: _0x16b53b,
      onRefreshGrid: _0x52364e
    } = _0x1b51d9;
    const _0x23fb33 = document.createElement("div");
    _0x23fb33.className = "st-chatu8-preset-card";
    _0x23fb33.dataset.presetName = _0x4d6b76;
    if (_0x471e25) {
      _0x23fb33.classList.add("selected");
    }
    const _0xf42913 = document.createElement("div");
    _0xf42913.className = "st-chatu8-preset-card-image";
    if (_0x3b0df0.coverImageId) {
      try {
        const _0x4f7537 = await getConfigImage(_0x3b0df0.coverImageId);
        if (_0x4f7537) {
          const _0x5416a2 = document.createElement("img");
          _0x5416a2.src = _0x4f7537;
          _0x5416a2.alt = _0x4d6b76;
          _0x5416a2.style.cssText = "\n                        width: 100%;\n                        height: 100%;\n                        object-fit: cover;\n                    ";
          _0xf42913.appendChild(_0x5416a2);
        } else {
          _0xf42913.innerHTML = "\n                        <div class=\"st-chatu8-preset-card-placeholder\">\n                            <i class=\"fa-solid fa-image\"></i>\n                            <div>图像未找到</div>\n                        </div>\n                    ";
          console.warn("[VibeGroupVisualSelector] Cover image not found in database:", _0x3b0df0.coverImageId);
        }
      } catch (_0x12762f) {
        let _0x4b978b = "加载失败";
        if (_0x12762f.name === "QuotaExceededError" || _0x12762f.message.includes("quota")) {
          _0x4b978b = "存储已满";
        } else if (_0x12762f.name === "NotFoundError") {
          _0x4b978b = "图像未找到";
        } else if (_0x12762f.name === "InvalidStateError") {
          _0x4b978b = "数据库错误";
        }
        _0xf42913.innerHTML = "\n                    <div class=\"st-chatu8-preset-card-error\">\n                        <i class=\"fa-solid fa-exclamation-triangle\"></i>\n                        <div>" + _0x4b978b + "</div>\n                    </div>\n                ";
        _0xf42913.title = "加载失败: " + _0x12762f.message;
        console.error("[VibeGroupVisualSelector] Failed to load cover image:", _0x3b0df0.coverImageId, {
          error: _0x12762f.message,
          errorName: _0x12762f.name,
          presetName: _0x4d6b76,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      _0xf42913.innerHTML = "\n                <div class=\"st-chatu8-preset-card-placeholder\">\n                    <i class=\"fa-solid fa-image\"></i>\n                    <div>无图像</div>\n                </div>\n            ";
    }
    const _0x195cb4 = document.createElement("div");
    _0x195cb4.className = "st-chatu8-preset-card-name";
    _0x195cb4.textContent = _0x4d6b76;
    _0x195cb4.title = _0x4d6b76;
    _0x23fb33.appendChild(_0xf42913);
    _0x23fb33.appendChild(_0x195cb4);
    _0x23fb33.onclick = () => {
      if (_0x16b53b) {
        _0x16b53b(_0x4d6b76, _0x23fb33);
      }
    };
    return _0x23fb33;
  }
  function _0x529cb3(_0x547de2, _0x2f46cc, _0x5b090e, _0x2e4fa0) {
    const _0x5560bf = document.createElement("div");
    _0x5560bf.className = "st-chatu8-preset-card-actions";
    const _0x280ab4 = document.createElement("button");
    _0x280ab4.className = "st-chatu8-preset-action-btn st-chatu8-preset-action-upload";
    _0x280ab4.innerHTML = "<i class=\"fa-solid fa-camera\"></i>";
    _0x280ab4.title = "上传封面图";
    _0x280ab4.onclick = _0x581958 => {
      _0x581958.stopPropagation();
      _0x6dd0b6(_0x547de2, _0x5b090e, _0x2e4fa0);
    };
    const _0x463014 = document.createElement("button");
    _0x463014.className = "st-chatu8-preset-action-btn st-chatu8-preset-action-delete-image";
    _0x463014.innerHTML = "<i class=\"fa-solid fa-image-slash\"></i>";
    _0x463014.title = "删除封面图";
    _0x463014.onclick = _0x27b807 => {
      _0x27b807.stopPropagation();
      _0x452d30(_0x547de2, _0x5b090e);
    };
    if (!_0x2f46cc.coverImageId) {
      _0x463014.style.display = "none";
    }
    const _0x24b67f = document.createElement("button");
    _0x24b67f.className = "st-chatu8-preset-action-btn st-chatu8-preset-action-rename";
    _0x24b67f.innerHTML = "<i class=\"fa-solid fa-pen\"></i>";
    _0x24b67f.title = "重命名";
    _0x24b67f.onclick = _0x80e8df => {
      _0x80e8df.stopPropagation();
      _0x3e5b65(_0x547de2, _0x2e4fa0);
    };
    const _0x20da84 = document.createElement("button");
    _0x20da84.className = "st-chatu8-preset-action-btn st-chatu8-preset-action-delete";
    _0x20da84.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
    _0x20da84.title = "删除预设";
    _0x20da84.onclick = _0x20d4b8 => {
      _0x20d4b8.stopPropagation();
      _0x41cf2f(_0x547de2, _0x2e4fa0);
    };
    _0x5560bf.appendChild(_0x280ab4);
    _0x5560bf.appendChild(_0x463014);
    _0x5560bf.appendChild(_0x24b67f);
    _0x5560bf.appendChild(_0x20da84);
    return _0x5560bf;
  }
  async function _0x6dd0b6(_0xf70d85, _0x3e27e6, _0x417763) {
    console.log("[VibeGroupVisualSelector] Cover image upload clicked for:", _0xf70d85);
    const _0x739138 = document.createElement("input");
    _0x739138.type = "file";
    _0x739138.accept = "image/*";
    _0x739138.style.display = "none";
    _0x739138.onchange = async _0x239d02 => {
      const _0x6c1d51 = _0x239d02.target.files[0];
      if (!_0x6c1d51) {
        return;
      }
      try {
        const _0xe3f8c5 = await new Promise((_0x3612ce, _0x36d0c9) => {
          const _0x3c50f8 = new FileReader();
          _0x3c50f8.onload = _0x245750 => _0x3612ce(_0x245750.target.result);
          _0x3c50f8.onerror = () => _0x36d0c9(new Error("文件读取失败"));
          _0x3c50f8.readAsDataURL(_0x6c1d51);
        });
        const _0xc188fa = _0x48bb80.vibeGroups || {};
        const _0x25c02d = _0xc188fa[_0xf70d85];
        if (!_0x25c02d) {
          console.error("[VibeGroupVisualSelector] Preset not found:", _0xf70d85);
          alert("错误: 预设不存在");
          return;
        }
        if (_0x25c02d.coverImageId) {
          try {
            await deleteConfigImage(_0x25c02d.coverImageId);
            console.log("[VibeGroupVisualSelector] Deleted old cover image:", _0x25c02d.coverImageId);
          } catch (_0x4f7c49) {
            console.warn("[VibeGroupVisualSelector] Failed to delete old cover image:", _0x4f7c49);
          }
        }
        const _0x204375 = _0x6c1d51.type.split("/")[1] || "png";
        const _0x2f90a7 = await saveConfigImage(_0xe3f8c5, {
          format: _0x204375,
          filename: "vibe_group_cover_" + _0xf70d85 + "_" + Date.now()
        });
        console.log("[VibeGroupVisualSelector] Saved new cover image:", _0x2f90a7);
        _0x25c02d.coverImageId = _0x2f90a7;
        _0x25c02d.updatedAt = Date.now();
        try {
          saveSettingsDebounced();
        } catch (_0x2961ea) {
          console.error("[VibeGroupVisualSelector] Failed to save settings after cover image upload:", _0x2961ea);
          alert("图片已上传但保存设置失败: " + _0x2961ea.message);
          return;
        }
        await _0x55f711(_0x3e27e6, _0xe3f8c5);
        console.log("[VibeGroupVisualSelector] Cover image uploaded successfully for:", _0xf70d85);
      } catch (_0x42bf20) {
        console.error("[VibeGroupVisualSelector] Failed to upload cover image:", _0x42bf20);
        if (_0x42bf20.name === "QuotaExceededError" || _0x42bf20.message.includes("quota")) {
          alert("存储空间已满。请删除未使用的图片或清除缓存。");
        } else {
          alert("上传失败: " + _0x42bf20.message);
        }
      } finally {
        document.body.removeChild(_0x739138);
      }
    };
    document.body.appendChild(_0x739138);
    _0x739138.click();
  }
  async function _0x452d30(_0x1789f6, _0x599710) {
    console.log("[VibeGroupVisualSelector] Delete cover image clicked for:", _0x1789f6);
    const _0x259ad7 = confirm("确定要删除 \"" + _0x1789f6 + "\" 的封面图吗？");
    if (!_0x259ad7) {
      return;
    }
    try {
      const _0x469254 = _0x48bb80.vibeGroups || {};
      const _0x346ea3 = _0x469254[_0x1789f6];
      if (!_0x346ea3) {
        console.error("[VibeGroupVisualSelector] Preset not found:", _0x1789f6);
        alert("错误: 预设不存在");
        return;
      }
      if (!_0x346ea3.coverImageId) {
        console.warn("[VibeGroupVisualSelector] No cover image to delete for:", _0x1789f6);
        alert("该预设没有封面图");
        return;
      }
      try {
        await deleteConfigImage(_0x346ea3.coverImageId);
        console.log("[VibeGroupVisualSelector] Deleted cover image from database:", _0x346ea3.coverImageId);
      } catch (_0x264e66) {
        console.error("[VibeGroupVisualSelector] Failed to delete image from database:", _0x264e66);
      }
      delete _0x346ea3.coverImageId;
      _0x346ea3.updatedAt = Date.now();
      try {
        saveSettingsDebounced();
      } catch (_0x1c8881) {
        console.error("[VibeGroupVisualSelector] Failed to save settings after deleting cover image:", _0x1c8881);
        alert("图片已删除但保存设置失败: " + _0x1c8881.message);
        return;
      }
      await _0x55f711(_0x599710, null);
      console.log("[VibeGroupVisualSelector] Cover image deleted successfully for:", _0x1789f6);
    } catch (_0x3582e4) {
      console.error("[VibeGroupVisualSelector] Failed to delete cover image:", _0x3582e4);
      alert("删除失败: " + _0x3582e4.message);
    }
  }
  async function _0x3e5b65(_0x440ebe, _0x4b595f) {
    const _0x27127b = _0x48bb80.vibeGroups || {};
    const _0x1787c0 = prompt("请输入新的组名称:", _0x440ebe);
    if (_0x1787c0 === null) {
      return;
    }
    const _0x417e6c = _0x1787c0.trim();
    if (!_0x417e6c) {
      alert("组名不能为空");
      console.warn("[VibeGroupVisualSelector] Rename failed: empty name");
      return;
    }
    if (_0x417e6c === _0x440ebe) {
      console.log("[VibeGroupVisualSelector] Rename cancelled: name unchanged");
      return;
    }
    if (_0x27127b[_0x417e6c]) {
      alert("组名 \"" + _0x417e6c + "\" 已存在");
      console.warn("[VibeGroupVisualSelector] Rename failed: name already exists:", _0x417e6c);
      return;
    }
    const _0x3d0266 = _0x27127b[_0x440ebe];
    _0x27127b[_0x417e6c] = _0x3d0266;
    delete _0x27127b[_0x440ebe];
    _0x3d0266.updatedAt = Date.now();
    if (_0x48bb80.vibeGroupId === _0x440ebe) {
      _0x48bb80.vibeGroupId = _0x417e6c;
      console.log("[VibeGroupVisualSelector] Updated vibeGroupId to:", _0x417e6c);
    }
    try {
      saveSettingsDebounced();
    } catch (_0x276033) {
      console.error("[VibeGroupVisualSelector] Failed to save settings after renaming preset:", _0x276033);
      alert("重命名成功但保存设置失败: " + _0x276033.message);
    }
    console.log("[VibeGroupVisualSelector] Renamed preset:", _0x440ebe, "->", _0x417e6c);
    if (_0x4b595f) {
      _0x4b595f();
    }
  }
  async function _0x41cf2f(_0x5cab7e, _0x2fc813) {
    const _0x2f3e93 = _0x48bb80.vibeGroups || {};
    const _0x5f14eb = _0x2f3e93[_0x5cab7e];
    if (!_0x5f14eb) {
      console.error("[VibeGroupVisualSelector] Preset not found:", _0x5cab7e);
      alert("错误: 预设 \"" + _0x5cab7e + "\" 不存在");
      return;
    }
    const _0xe4595f = Object.keys(_0x2f3e93).length;
    if (_0x5cab7e === "默认组" && _0xe4595f === 1) {
      alert("不能删除唯一的组");
      console.warn("[VibeGroupVisualSelector] Cannot delete the only group");
      return;
    }
    const _0x32d828 = confirm("确定要删除组 \"" + _0x5cab7e + "\" 吗？此操作无法撤销。");
    if (!_0x32d828) {
      console.log("[VibeGroupVisualSelector] Deletion cancelled by user");
      return;
    }
    try {
      if (_0x5f14eb.coverImageId) {
        try {
          await deleteConfigImage(_0x5f14eb.coverImageId);
          console.log("[VibeGroupVisualSelector] Deleted cover image:", _0x5f14eb.coverImageId);
        } catch (_0x2de446) {
          console.warn("[VibeGroupVisualSelector] Failed to delete cover image:", _0x5f14eb.coverImageId, _0x2de446);
        }
      }
      delete _0x2f3e93[_0x5cab7e];
      console.log("[VibeGroupVisualSelector] Deleted preset:", _0x5cab7e);
      if (_0x48bb80.vibeGroupId === _0x5cab7e) {
        if (_0x2f3e93.默认组) {
          _0x48bb80.vibeGroupId = "默认组";
        } else {
          const _0xd3bda7 = Object.keys(_0x2f3e93);
          if (_0xd3bda7.length > 0) {
            _0x48bb80.vibeGroupId = _0xd3bda7[0];
          } else {
            _0x2f3e93.默认组 = {
              vibes: [],
              createdAt: Date.now(),
              updatedAt: Date.now()
            };
            _0x48bb80.vibeGroupId = "默认组";
            console.log("[VibeGroupVisualSelector] Created default group after deleting last group");
          }
        }
        console.log("[VibeGroupVisualSelector] Switched to group:", _0x48bb80.vibeGroupId);
      }
      try {
        saveSettingsDebounced();
      } catch (_0x3aa1e1) {
        console.error("[VibeGroupVisualSelector] Failed to save settings after deleting preset:", _0x3aa1e1);
        alert("删除成功但保存设置失败: " + _0x3aa1e1.message);
      }
      if (Object.keys(_0x2f3e93).length === 0) {
        console.log("[VibeGroupVisualSelector] No groups remaining, closing dialog");
        _0x2b2df7.removeChild(_0x5948f9);
      } else {
        _0x2fc813();
      }
      console.log("[VibeGroupVisualSelector] Successfully deleted preset:", _0x5cab7e);
    } catch (_0xcf0065) {
      console.error("[VibeGroupVisualSelector] Error deleting preset:", _0xcf0065);
      alert("删除失败: " + _0xcf0065.message);
    }
  }
  async function _0x55f711(_0x238152, _0x23cf41) {
    const _0x2ffb03 = _0x238152.querySelector(".st-chatu8-preset-card-actions");
    _0x238152.innerHTML = "";
    if (_0x23cf41) {
      const _0x25d46c = document.createElement("img");
      _0x25d46c.src = _0x23cf41;
      _0x25d46c.alt = "Cover image";
      _0x25d46c.style.cssText = "\n                width: 100%;\n                height: 100%;\n                object-fit: cover;\n            ";
      _0x238152.appendChild(_0x25d46c);
    } else {
      _0x238152.innerHTML = "\n                <div class=\"st-chatu8-preset-card-placeholder\">\n                    <i class=\"fa-solid fa-image\"></i>\n                    <div>无图像</div>\n                </div>\n            ";
    }
    if (_0x2ffb03) {
      _0x238152.appendChild(_0x2ffb03);
    }
    console.log("[VibeGroupVisualSelector] Card image refreshed");
  }
  async function _0x4d632e() {
    const _0xa3c9d = _0x5948f9.querySelector(".st-chatu8-preset-grid");
    const _0x18d136 = _0x48bb80.vibeGroups || {};
    const _0x51607c = _0x48bb80.vibeGroupId;
    _0xa3c9d.style.opacity = "0";
    _0xa3c9d.style.transform = "translateY(10px)";
    _0xa3c9d.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    await new Promise(_0x3371a1 => setTimeout(_0x3371a1, 150));
    _0xa3c9d.innerHTML = "";
    if (_0x3b444d.length === 0) {
      _0xa3c9d.innerHTML = "\n                <div style=\"\n                    grid-column: 1 / -1;\n                    text-align: center;\n                    padding: 3rem;\n                    color: rgba(255, 255, 255, 0.5);\n                \">\n                    <i class=\"fa-solid fa-inbox\" style=\"font-size: 3rem; margin-bottom: 1rem; display: block;\"></i>\n                    <p>" + (_0x1a897c ? "没有找到匹配的 Vibe 组预设" : "没有可用的 Vibe 组预设") + "</p>\n                    <p style=\"font-size: 0.9rem; margin-top: 0.5rem;\">" + (_0x1a897c ? "请尝试其他搜索词" : "请先创建 Vibe 组预设") + "</p>\n                </div>\n            ";
      _0xa3c9d.style.opacity = "1";
      _0xa3c9d.style.transform = "translateY(0)";
      console.log("[VibeGroupVisualSelector] Displayed empty state");
      return;
    }
    const _0x3871a1 = (_0x508c93 - 1) * _0x3e690b;
    const _0x5bb0c7 = Math.min(_0x3871a1 + _0x3e690b, _0x3b444d.length);
    console.log("[VibeGroupVisualSelector] Rendering page", _0x508c93, "presets", _0x3871a1, "to", _0x5bb0c7 - 1);
    const _0x2bae97 = _0x3b444d.slice(_0x3871a1, _0x5bb0c7);
    for (const _0x1dd3ea of _0x2bae97) {
      const _0x8193de = _0x18d136[_0x1dd3ea];
      const _0x332d1d = _0x1dd3ea === _0x51607c;
      const _0x41a0c8 = await _0x277386({
        presetName: _0x1dd3ea,
        preset: _0x8193de,
        isSelected: _0x332d1d,
        onCardClick: (_0x4c080d, _0x318f6d) => {
          const _0x2a7453 = _0x5948f9.classList.contains("st-chatu8-mode-manage");
          if (_0x1f9359) {
            if (_0x201400.has(_0x4c080d)) {
              _0x201400.delete(_0x4c080d);
              _0x318f6d.classList.remove("bulk-selected");
              console.log("[VibeGroupVisualSelector] Deselected for bulk delete:", _0x4c080d);
            } else {
              _0x201400.add(_0x4c080d);
              _0x318f6d.classList.add("bulk-selected");
              console.log("[VibeGroupVisualSelector] Selected for bulk delete:", _0x4c080d);
            }
            const _0x2ac288 = _0x5948f9.querySelector(".st-chatu8-mode-toggle-bulk-delete");
            if (_0x2ac288 && _0x201400.size > 0) {
              _0x2ac288.innerHTML = "<i class=\"fa-solid fa-trash\"></i> 确认删除 (" + _0x201400.size + ")";
            } else if (_0x2ac288) {
              _0x2ac288.innerHTML = "<i class=\"fa-solid fa-trash\"></i> 批量删除";
            }
          } else if (_0x2a7453) {
            console.log("[VibeGroupVisualSelector] Card clicked in management mode - no action");
          } else {
            console.log("[VibeGroupVisualSelector] Card clicked in normal mode:", _0x4c080d);
            _0x48bb80.vibeGroupId = _0x4c080d;
            try {
              saveSettingsDebounced();
            } catch (_0xf70a88) {
              console.error("[VibeGroupVisualSelector] Failed to save settings after preset selection:", _0xf70a88);
              alert("选择成功但保存设置失败: " + _0xf70a88.message);
            }
            if (_0xd11aad) {
              _0xd11aad(_0x4c080d);
            }
            _0x2b2df7.removeChild(_0x5948f9);
            console.log("[VibeGroupVisualSelector] Preset selected and dialog closed:", _0x4c080d);
          }
        },
        onRefreshGrid: () => {
          _0x4d632e();
        }
      });
      const _0x3d5361 = _0x5948f9.classList.contains("st-chatu8-mode-manage");
      if (_0x3d5361) {
        const _0x82dcb7 = _0x41a0c8.querySelector(".st-chatu8-preset-card-image");
        const _0x154b90 = _0x529cb3(_0x1dd3ea, _0x8193de, _0x82dcb7, () => {
          _0x3df728();
          _0x452f1c();
          _0x4d632e();
        });
        _0x82dcb7.appendChild(_0x154b90);
      }
      _0xa3c9d.appendChild(_0x41a0c8);
    }
    _0xa3c9d.style.opacity = "1";
    _0xa3c9d.style.transform = "translateY(0)";
    console.log("[VibeGroupVisualSelector] Rendered", _0x2bae97.length, "cards");
  }
  _0x4190a9.onclick = () => {
    if (_0x508c93 > 1) {
      _0x508c93--;
      _0x452f1c();
      _0x4d632e();
      console.log("[VibeGroupVisualSelector] Navigate to previous page:", _0x508c93);
    }
  };
  _0x23282e.onclick = () => {
    const _0x207a43 = Math.max(1, Math.ceil(_0x3b444d.length / _0x3e690b));
    if (_0x508c93 < _0x207a43) {
      _0x508c93++;
      _0x452f1c();
      _0x4d632e();
      console.log("[VibeGroupVisualSelector] Navigate to next page:", _0x508c93);
    }
  };
  _0x5d1ba4.onchange = _0x46bf9d => {
    _0x3e690b = parseInt(_0x46bf9d.target.value, 10);
    _0x508c93 = 1;
    _0x452f1c();
    _0x4d632e();
    console.log("[VibeGroupVisualSelector] Page size changed to:", _0x3e690b);
  };
  _0x3df728();
  _0x452f1c();
  _0x4d632e();
  const _0x1806de = _0x5948f9.querySelector(".st-chatu8-viz-search-input");
  _0x1806de.oninput = _0x351eca => {
    _0x1a897c = _0x351eca.target.value.trim();
    _0x508c93 = 1;
    _0x3df728();
    _0x452f1c();
    _0x4d632e();
    console.log("[VibeGroupVisualSelector] Search query changed:", _0x1a897c);
  };
  const _0x5f37e6 = _0x5948f9.querySelector(".st-chatu8-mode-toggle-manage");
  let _0x177661 = false;
  _0x5f37e6.onclick = () => {
    _0x177661 = !_0x177661;
    if (_0x177661) {
      _0x5948f9.classList.add("st-chatu8-mode-manage");
      _0x5f37e6.classList.add("active");
      _0x5f37e6.style.backgroundColor = "rgba(33, 150, 243, 0.2)";
      _0x5f37e6.style.borderColor = "#2196f3";
      console.log("[VibeGroupVisualSelector] Entered management mode");
    } else {
      _0x5948f9.classList.remove("st-chatu8-mode-manage");
      _0x5f37e6.classList.remove("active");
      _0x5f37e6.style.backgroundColor = "";
      _0x5f37e6.style.borderColor = "";
      console.log("[VibeGroupVisualSelector] Exited management mode");
    }
    if (_0x1f9359) {
      _0x1f9359 = false;
      _0x5948f9.classList.remove("st-chatu8-mode-bulk-delete");
      _0x201400.clear();
      const _0x10b13f = _0x5948f9.querySelector(".st-chatu8-mode-toggle-bulk-delete");
      if (_0x10b13f) {
        _0x10b13f.classList.remove("active");
        _0x10b13f.style.backgroundColor = "";
        _0x10b13f.style.borderColor = "";
        _0x10b13f.innerHTML = "<i class=\"fa-solid fa-trash\"></i> 批量删除";
      }
      console.log("[VibeGroupVisualSelector] Exited bulk delete mode (switched to management mode)");
    }
    _0x4d632e();
  };
  const _0x47722f = _0x5948f9.querySelector(".st-chatu8-mode-toggle-bulk-delete");
  _0x47722f.onclick = () => {
    if (_0x1f9359 && _0x201400.size > 0) {
      handleBulkDelete(_0x201400, () => {
        _0x3df728();
        _0x452f1c();
        _0x4d632e();
      });
    } else {
      _0x1f9359 = !_0x1f9359;
      if (_0x1f9359) {
        _0x5948f9.classList.add("st-chatu8-mode-bulk-delete");
        _0x47722f.classList.add("active");
        _0x47722f.style.backgroundColor = "rgba(244, 67, 54, 0.2)";
        _0x47722f.style.borderColor = "#f44336";
        _0x201400.clear();
        console.log("[VibeGroupVisualSelector] Entered bulk delete mode");
      } else {
        _0x5948f9.classList.remove("st-chatu8-mode-bulk-delete");
        _0x47722f.classList.remove("active");
        _0x47722f.style.backgroundColor = "";
        _0x47722f.style.borderColor = "";
        _0x47722f.innerHTML = "<i class=\"fa-solid fa-trash\"></i> 批量删除";
        _0x201400.clear();
        console.log("[VibeGroupVisualSelector] Exited bulk delete mode");
      }
      if (_0x177661) {
        _0x177661 = false;
        _0x5948f9.classList.remove("st-chatu8-mode-manage");
        _0x5f37e6.classList.remove("active");
        _0x5f37e6.style.backgroundColor = "";
        _0x5f37e6.style.borderColor = "";
        console.log("[VibeGroupVisualSelector] Exited management mode (switched to bulk delete mode)");
      }
      _0x4d632e();
    }
  };
  console.log("[VibeGroupVisualSelector] Dialog opened");
}
async function handleBulkDelete(_0x19abd8, _0x47ab74) {
  const _0x1ca1de = extension_settings[extensionName];
  const _0x39bab4 = _0x1ca1de.vibeGroups || {};
  const _0x167f5b = _0x1ca1de.vibeGroupId;
  const _0xb73296 = confirm("确定要删除选中的 " + _0x19abd8.size + " 个 Vibe 组预设吗？此操作无法撤销。");
  if (!_0xb73296) {
    console.log("[VibeGroupVisualSelector] Bulk delete cancelled by user");
    return;
  }
  console.log("[VibeGroupVisualSelector] Starting bulk delete of", _0x19abd8.size, "presets");
  let _0x506bac = 0;
  let _0x31238d = 0;
  const _0x588bb5 = [];
  for (const _0x349f6c of _0x19abd8) {
    try {
      const _0x301a6c = _0x39bab4[_0x349f6c];
      if (_0x301a6c && _0x301a6c.coverImageId) {
        try {
          await deleteConfigImage(_0x301a6c.coverImageId);
          console.log("[VibeGroupVisualSelector] Deleted cover image for preset:", _0x349f6c);
        } catch (_0x157478) {
          console.warn("[VibeGroupVisualSelector] Failed to delete cover image for preset:", _0x349f6c, _0x157478);
        }
      }
      delete _0x39bab4[_0x349f6c];
      _0x506bac++;
      console.log("[VibeGroupVisualSelector] Deleted preset:", _0x349f6c);
    } catch (_0x3a295a) {
      _0x31238d++;
      const _0x43f300 = {
        presetName: _0x349f6c,
        error: _0x3a295a.message
      };
      _0x588bb5.push(_0x43f300);
      console.error("[VibeGroupVisualSelector] Failed to delete preset:", _0x349f6c, _0x3a295a);
    }
  }
  if (_0x19abd8.has(_0x167f5b)) {
    if (_0x39bab4.默认组) {
      _0x1ca1de.vibeGroupId = "默认组";
    } else {
      const _0x4b7628 = Object.keys(_0x39bab4);
      if (_0x4b7628.length > 0) {
        _0x1ca1de.vibeGroupId = _0x4b7628[0];
      } else {
        _0x39bab4.默认组 = {
          vibes: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        _0x1ca1de.vibeGroupId = "默认组";
      }
    }
    console.log("[VibeGroupVisualSelector] Current group was deleted, switched to:", _0x1ca1de.vibeGroupId);
  }
  try {
    saveSettingsDebounced();
  } catch (_0x2546dc) {
    console.error("[VibeGroupVisualSelector] Failed to save settings after bulk delete:", _0x2546dc);
    alert("批量删除完成但保存设置失败: " + _0x2546dc.message + "\n\n成功删除: " + _0x506bac + " 个\n失败: " + _0x31238d + " 个");
  }
  if (_0x31238d > 0) {
    alert("批量删除完成。\n成功删除: " + _0x506bac + " 个\n失败: " + _0x31238d + " 个\n\n请查看控制台以获取详细错误信息。");
    console.error("[VibeGroupVisualSelector] Bulk delete errors:", _0x588bb5);
  } else {
    console.log("[VibeGroupVisualSelector] Bulk delete completed successfully:", _0x506bac, "presets deleted");
  }
  if (_0x47ab74) {
    _0x47ab74();
  }
  console.log("[VibeGroupVisualSelector] Bulk delete operation completed");
}
export function initVibeGroupEditor(_0x1badc2) {
  ensureVibeGroupPresets();
  validateAllVibeGroups();
  const _0xc3999b = _0x1badc2.find("#novelai-vibe-group-editor-btn");
  if (_0xc3999b.length) {
    _0xc3999b.on("click", () => {
      showVibeGroupEditorDialog();
    });
  }
}