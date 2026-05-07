import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced, eventSource } from "../../../../../../script.js";
import { extensionName, eventNames, LLMRequestTypes } from "../config.js";
import { getRequestHeaders } from "../utils.js";
import { formatPromptForDisplay, buildPromptForRequestType, executeTypedLLMRequest, executeDefaultLLMRequest, getLLMRequestController, setLLMRequestController } from "./llmService.js";
let profileSelect;
let apiUrlInput;
let apiKeyInput;
let modelSelect;
let modelInput;
let fetchModelsButton;
let temperatureSlider;
let temperatureValue;
let topPSlider;
let topPValue;
let maxTokensSlider;
let maxTokensValue;
let streamToggle;
let bypassProxyToggle;
let historyDepthSlider;
let historyDepthValue;
let testContextSelect;
let testButton;
let resultTextarea;
let combinedPromptTextarea;
let imageGenApiSelect;
let imageGenContextSelect;
let charDesignApiSelect;
let charDesignContextSelect;
let charDisplayApiSelect;
let charDisplayContextSelect;
let charModifyApiSelect;
let charModifyContextSelect;
let translationApiSelect;
let translationContextSelect;
let tagModifyApiSelect;
let tagModifyContextSelect;
export function updateCombinedPrompt(_0x1ba481, _0x2f2833 = "") {
  if (combinedPromptTextarea) {
    let _0x150e4d = _0x2f2833;
    _0x150e4d += formatPromptForDisplay(_0x1ba481);
    combinedPromptTextarea.val(_0x150e4d);
  }
}
export function getResultTextareaUpdater() {
  return _0x543a9e => {
    if (resultTextarea) {
      resultTextarea.val(_0x543a9e);
    }
  };
}
let presetEntriesContainer;
let entryIdCounter = 0;
let currentEditingEntry = null;
let virtualEntriesData = [];
let virtualScrollEnabled = true;
const VIRTUAL_ITEM_HEIGHT = 78;
const VIRTUAL_BUFFER = 30;
const _0x495c9b = {
  start: -1,
  end: -1
};
let lastRenderedRange = _0x495c9b;
let virtualScrollContainer = null;
let virtualScrollSpacer = null;
function getEntryEditModalHTML() {
  return "\n        <div class=\"st-chatu8-entry-edit-modal-backdrop\" id=\"ch-entry-edit-modal\">\n            <div class=\"st-chatu8-entry-edit-modal\">\n                <div class=\"st-chatu8-entry-edit-modal-header\">\n                    <h4>编辑条目</h4>\n                    <span class=\"st-chatu8-entry-edit-modal-close\">&times;</span>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-body\">\n                    <div class=\"st-chatu8-modal-field\">\n                        <label>条目名称</label>\n                        <input type=\"text\" id=\"ch-modal-entry-name\" class=\"st-chatu8-text-input\" placeholder=\"条目名称\" />\n                    </div>\n                    <div class=\"st-chatu8-modal-field-row\">\n                        <div class=\"st-chatu8-modal-field\">\n                            <label>角色</label>\n                            <select id=\"ch-modal-entry-role\" class=\"st-chatu8-select\">\n                                <option value=\"system\">System</option>\n                                <option value=\"user\">User</option>\n                                <option value=\"assistant\">Assistant</option>\n                            </select>\n                        </div>\n                        <div class=\"st-chatu8-modal-field\">\n                            <label>触发模式</label>\n                            <select id=\"ch-modal-trigger-mode\" class=\"st-chatu8-select\">\n                                <option value=\"always\">常开</option>\n                                <option value=\"trigger\">触发</option>\n                            </select>\n                        </div>\n                        <div class=\"st-chatu8-modal-field st-chatu8-modal-toggle-field\">\n                            <label>启用</label>\n                            <div class=\"st-chatu8-toggle\">\n                                <input id=\"ch-modal-entry-enabled\" type=\"checkbox\" checked />\n                                <span class=\"st-chatu8-slider\"></span>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"st-chatu8-modal-field\" id=\"ch-modal-trigger-words-container\" style=\"display: none;\">\n                        <label>触发词（逗号分隔）</label>\n                        <input type=\"text\" id=\"ch-modal-trigger-words\" class=\"st-chatu8-text-input\" placeholder=\"触发词1, 触发词2\" />\n                    </div>\n                    <div class=\"st-chatu8-modal-field\">\n                        <label>内容</label>\n                        <textarea id=\"ch-modal-entry-content\" class=\"st-chatu8-textarea\" rows=\"10\" placeholder=\"输入内容...\"></textarea>\n                    </div>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-footer\">\n                    <button class=\"st-chatu8-btn st-chatu8-modal-cancel-btn\">取消</button>\n                    <button class=\"st-chatu8-btn st-chatu8-btn-primary st-chatu8-modal-save-btn\">保存</button>\n                </div>\n            </div>\n        </div>\n    ";
}
function showEntryEditModal(_0x2fe038) {
  currentEditingEntry = _0x2fe038;
  let _0x51a92a = $("#ch-entry-edit-modal");
  if (!_0x51a92a.length) {
    $("body").append(getEntryEditModalHTML());
    _0x51a92a = $("#ch-entry-edit-modal");
    _0x51a92a.find(".st-chatu8-entry-edit-modal-close").on("click", closeEntryEditModal);
    _0x51a92a.find(".st-chatu8-modal-cancel-btn").on("click", closeEntryEditModal);
    _0x51a92a.find(".st-chatu8-modal-save-btn").on("click", saveEntryFromModal);
    _0x51a92a.find("#ch-modal-trigger-mode").on("change", function () {
      const _0x303902 = _0x51a92a.find("#ch-modal-trigger-words-container");
      if ($(this).val() === "trigger") {
        _0x303902.show();
      } else {
        _0x303902.hide();
      }
    });
  }
  _0x51a92a.find("#ch-modal-entry-name").val(_0x2fe038.find(".st-chatu8-entry-name").val());
  _0x51a92a.find("#ch-modal-entry-role").val(_0x2fe038.attr("data-role") || "user");
  _0x51a92a.find("#ch-modal-entry-enabled").prop("checked", !_0x2fe038.hasClass("disabled"));
  _0x51a92a.find("#ch-modal-trigger-mode").val(_0x2fe038.attr("data-trigger-mode") || "always").trigger("change");
  _0x51a92a.find("#ch-modal-trigger-words").val(_0x2fe038.attr("data-trigger-words") || "");
  _0x51a92a.find("#ch-modal-entry-content").val(_0x2fe038.find(".st-chatu8-entry-content").val());
  _0x51a92a.fadeIn(200);
}
function closeEntryEditModal() {
  const _0x443acf = $("#ch-entry-edit-modal");
  _0x443acf.fadeOut(200);
  currentEditingEntry = null;
}
function saveEntryFromModal() {
  if (!currentEditingEntry) {
    closeEntryEditModal();
    return;
  }
  const _0x3909ba = $("#ch-entry-edit-modal");
  const _0xe336e0 = currentEditingEntry;
  const _0x400558 = _0x3909ba.find("#ch-modal-entry-name").val();
  const _0x2a8c3c = _0x3909ba.find("#ch-modal-entry-role").val();
  const _0x30f9e4 = _0x3909ba.find("#ch-modal-entry-enabled").is(":checked");
  const _0x2be43c = _0x3909ba.find("#ch-modal-trigger-mode").val();
  const _0x65173c = _0x3909ba.find("#ch-modal-trigger-words").val();
  const _0x4d4516 = _0x3909ba.find("#ch-modal-entry-content").val();
  _0xe336e0.find(".st-chatu8-entry-name").val(_0x400558);
  _0xe336e0.attr("data-role", _0x2a8c3c);
  _0xe336e0.find(".st-chatu8-entry-role-badge").text(getRoleBadgeText(_0x2a8c3c)).attr("data-role", _0x2a8c3c);
  _0xe336e0.attr("data-trigger-mode", _0x2be43c);
  _0xe336e0.attr("data-trigger-words", _0x65173c);
  _0xe336e0.find(".st-chatu8-entry-content").val(_0x4d4516);
  _0xe336e0.find(".st-chatu8-entry-toggle input").prop("checked", _0x30f9e4);
  if (_0x30f9e4) {
    _0xe336e0.removeClass("disabled");
  } else {
    _0xe336e0.addClass("disabled");
  }
  const _0x34e5d3 = _0x4d4516.length > 50 ? _0x4d4516.substring(0, 50) + "..." : _0x4d4516;
  _0xe336e0.find(".st-chatu8-entry-preview").text(_0x34e5d3 || "(空)");
  if (virtualScrollEnabled) {
    const _0x70e110 = parseInt(_0xe336e0.attr("data-entry-index"), 10);
    if (!isNaN(_0x70e110) && virtualEntriesData[_0x70e110]) {
      virtualEntriesData[_0x70e110] = {
        ...virtualEntriesData[_0x70e110],
        name: _0x400558,
        role: _0x2a8c3c,
        enabled: _0x30f9e4,
        triggerMode: _0x2be43c,
        triggerWords: _0x65173c,
        content: _0x4d4516
      };
    }
  }
  const _0x52c8cd = testContextSelect.val();
  if (_0x52c8cd) {
    extension_settings[extensionName].test_context_profiles[_0x52c8cd] = collectTestContextDataFromUI();
    saveSettingsDebounced();
  }
  toastr.success("条目已更新并保存");
  closeEntryEditModal();
}
function getRoleBadgeText(_0x32de70) {
  const _0x281709 = {
    system: "SYS",
    user: "USR",
    assistant: "AI"
  };
  return _0x281709[_0x32de70] || "USR";
}
function generateEntryId() {
  return "entry_" + Date.now() + "_" + ++entryIdCounter;
}
function migrateOldContextData(_0x4b065a) {
  if (_0x4b065a.entries && Array.isArray(_0x4b065a.entries)) {
    return _0x4b065a;
  }
  if (_0x4b065a.history && Array.isArray(_0x4b065a.history)) {
    const _0x4ed39b = [];
    _0x4b065a.history.forEach((_0x296a75, _0x2dfc17) => {
      if (_0x296a75.user && _0x296a75.user.trim()) {
        _0x4ed39b.push({
          id: generateEntryId(),
          name: "用户消息 " + (_0x2dfc17 + 1),
          role: "user",
          content: _0x296a75.user,
          enabled: true,
          triggerMode: "always",
          triggerWords: ""
        });
      }
      if (_0x296a75.assistant && _0x296a75.assistant.trim()) {
        _0x4ed39b.push({
          id: generateEntryId(),
          name: "AI回复 " + (_0x2dfc17 + 1),
          role: "assistant",
          content: _0x296a75.assistant,
          enabled: true,
          triggerMode: "always",
          triggerWords: ""
        });
      }
    });
    if (_0x4ed39b.length === 0) {
      _0x4ed39b.push({
        id: generateEntryId(),
        name: "系统提示",
        role: "system",
        content: "",
        enabled: true,
        triggerMode: "always",
        triggerWords: ""
      });
    }
    const _0x50647d = {
      entries: _0x4ed39b
    };
    return _0x50647d;
  }
  return {
    entries: [{
      id: generateEntryId(),
      name: "系统提示",
      role: "system",
      content: "",
      enabled: true,
      triggerMode: "always",
      triggerWords: ""
    }]
  };
}
function renderPresetEntries(_0x4bc6e3 = []) {
  virtualEntriesData = _0x4bc6e3.map((_0x143176, _0x50ff33) => ({
    ..._0x143176,
    _index: _0x50ff33
  }));
  presetEntriesContainer.empty();
  const _0x555dee = {
    start: -1,
    end: -1
  };
  lastRenderedRange = _0x555dee;
  if (_0x4bc6e3.length === 0) {
    presetEntriesContainer.html("\n            <div class=\"st-chatu8-entries-empty\">\n                <i class=\"fa-solid fa-inbox\"></i>\n                <p>暂无条目，点击上方按钮添加</p>\n            </div>\n        ");
    return;
  }
  if (_0x4bc6e3.length < 50) {
    virtualScrollEnabled = false;
    _0x4bc6e3.forEach((_0x19328e, _0x426ddc) => {
      addPresetEntryDOM(_0x19328e, _0x426ddc);
    });
    return;
  }
  virtualScrollEnabled = true;
  const _0x27458e = _0x4bc6e3.length * VIRTUAL_ITEM_HEIGHT;
  presetEntriesContainer.html("\n        <div class=\"st-chatu8-virtual-spacer\" style=\"height: " + _0x27458e + "px; position: relative;\">\n            <div class=\"st-chatu8-virtual-content\" style=\"position: absolute; left: 0; right: 0; top: 0;\"></div>\n        </div>\n    ");
  virtualScrollSpacer = presetEntriesContainer.find(".st-chatu8-virtual-spacer");
  virtualScrollContainer = presetEntriesContainer.find(".st-chatu8-virtual-content");
  presetEntriesContainer.off("scroll.virtual").on("scroll.virtual", onVirtualScroll);
  updateVirtualScroll();
}
function onVirtualScroll() {
  requestAnimationFrame(updateVirtualScroll);
}
function updateVirtualScroll() {
  if (!virtualScrollEnabled || !virtualScrollContainer || virtualEntriesData.length === 0) {
    return;
  }
  const _0x20ca4e = presetEntriesContainer[0];
  const _0x1b7a69 = _0x20ca4e.scrollTop;
  const _0x143ca4 = _0x20ca4e.clientHeight;
  let _0x31424e = Math.floor(_0x1b7a69 / VIRTUAL_ITEM_HEIGHT) - VIRTUAL_BUFFER;
  let _0x1a4c1b = Math.ceil((_0x1b7a69 + _0x143ca4) / VIRTUAL_ITEM_HEIGHT) + VIRTUAL_BUFFER;
  _0x31424e = Math.max(0, _0x31424e);
  _0x1a4c1b = Math.min(virtualEntriesData.length - 1, _0x1a4c1b);
  if (_0x31424e === lastRenderedRange.start && _0x1a4c1b === lastRenderedRange.end) {
    return;
  }
  const _0x3d9f93 = lastRenderedRange.start;
  const _0x3a98b2 = lastRenderedRange.end;
  const _0x2b13e1 = {
    start: _0x31424e,
    end: _0x1a4c1b
  };
  lastRenderedRange = _0x2b13e1;
  if (_0x3d9f93 === -1 || _0x1a4c1b < _0x3d9f93 || _0x31424e > _0x3a98b2) {
    virtualScrollContainer.empty();
    for (let _0x29bf40 = _0x31424e; _0x29bf40 <= _0x1a4c1b; _0x29bf40++) {
      const _0x2400d2 = virtualEntriesData[_0x29bf40];
      if (_0x2400d2) {
        addPresetEntryDOMToContainerAbsolute(_0x2400d2, _0x29bf40, virtualScrollContainer);
      }
    }
    return;
  }
  if (_0x31424e > _0x3d9f93) {
    virtualScrollContainer.children().each(function () {
      const _0x5e686b = parseInt($(this).attr("data-entry-index"), 10);
      if (_0x5e686b < _0x31424e) {
        $(this).remove();
      }
    });
  }
  if (_0x1a4c1b < _0x3a98b2) {
    virtualScrollContainer.children().each(function () {
      const _0x6e5d33 = parseInt($(this).attr("data-entry-index"), 10);
      if (_0x6e5d33 > _0x1a4c1b) {
        $(this).remove();
      }
    });
  }
  if (_0x31424e < _0x3d9f93) {
    const _0x4deaed = document.createDocumentFragment();
    for (let _0x917e34 = _0x31424e; _0x917e34 < _0x3d9f93 && _0x917e34 <= _0x1a4c1b; _0x917e34++) {
      const _0xeb1235 = virtualEntriesData[_0x917e34];
      if (_0xeb1235) {
        const _0x411c42 = createEntryElementAbsolute(_0xeb1235, _0x917e34);
        _0x4deaed.appendChild(_0x411c42);
      }
    }
    virtualScrollContainer.prepend(_0x4deaed);
  }
  if (_0x1a4c1b > _0x3a98b2) {
    const _0x414348 = document.createDocumentFragment();
    for (let _0x36605e = Math.max(_0x3a98b2 + 1, _0x31424e); _0x36605e <= _0x1a4c1b; _0x36605e++) {
      const _0x521c03 = virtualEntriesData[_0x36605e];
      if (_0x521c03) {
        const _0x559505 = createEntryElementAbsolute(_0x521c03, _0x36605e);
        _0x414348.appendChild(_0x559505);
      }
    }
    virtualScrollContainer.append(_0x414348);
  }
}
function addPresetEntryDOMToContainer(_0x29b85c, _0x33619f, _0x58efd7) {
  const _0x303b06 = _0x29b85c.id || generateEntryId();
  const _0x3b0fb3 = _0x29b85c.name || "条目 " + (_0x33619f + 1);
  const _0x1a1e36 = _0x29b85c.role || "user";
  const _0x53a6d0 = _0x29b85c.content || "";
  const _0x49a896 = _0x29b85c.enabled !== false;
  const _0x5ef876 = _0x29b85c.triggerMode || "always";
  const _0xe687e = _0x29b85c.triggerWords || "";
  const _0x41425f = _0x49a896 ? "" : "disabled";
  const _0x3b6aff = _0x53a6d0.length > 50 ? _0x53a6d0.substring(0, 50) + "..." : _0x53a6d0 || "(空)";
  const _0x39fdc6 = $("\n        <div class=\"st-chatu8-preset-entry st-chatu8-preset-entry-collapsed " + _0x41425f + "\" \n             data-entry-id=\"" + _0x303b06 + "\" \n             data-entry-index=\"" + _0x33619f + "\"\n             data-role=\"" + _0x1a1e36 + "\" \n             data-trigger-mode=\"" + _0x5ef876 + "\"\n             data-trigger-words=\"" + escapeHtml(_0xe687e) + "\"\n             draggable=\"true\"\n             style=\"min-height: " + VIRTUAL_ITEM_HEIGHT + "px; box-sizing: border-box;\">\n            <div class=\"st-chatu8-entry-header\">\n                <span class=\"st-chatu8-entry-drag-handle\" title=\"拖拽排序\">\n                    <i class=\"fa-solid fa-grip-vertical\"></i>\n                </span>\n                <span class=\"st-chatu8-entry-role-badge\" data-role=\"" + _0x1a1e36 + "\">" + getRoleBadgeText(_0x1a1e36) + "</span>\n                <input type=\"text\" class=\"st-chatu8-entry-name\" value=\"" + escapeHtml(_0x3b0fb3) + "\" placeholder=\"条目名称\" readonly />\n                <span class=\"st-chatu8-entry-preview\">" + escapeHtml(_0x3b6aff) + "</span>\n                <div class=\"st-chatu8-entry-actions\">\n                    <div class=\"st-chatu8-entry-toggle\" title=\"启用/禁用\">\n                        <input type=\"checkbox\" " + (_0x49a896 ? "checked" : "") + " />\n                        <span class=\"st-chatu8-slider\"></span>\n                    </div>\n                    <button class=\"st-chatu8-icon-btn st-chatu8-entry-edit\" title=\"编辑\">\n                        <i class=\"fa-solid fa-pen\"></i>\n                    </button>\n                    <button class=\"st-chatu8-icon-btn danger st-chatu8-entry-delete\" title=\"删除条目\">\n                        <i class=\"fa-solid fa-trash\"></i>\n                    </button>\n                </div>\n            </div>\n            <textarea class=\"st-chatu8-entry-content\" style=\"display:none;\">" + escapeHtml(_0x53a6d0) + "</textarea>\n        </div>\n    ");
  _0x58efd7.append(_0x39fdc6);
}
function createEntryElementAbsolute(_0x50ea55, _0x3603fb) {
  const _0xf90ffe = _0x50ea55.id || generateEntryId();
  const _0x2462e8 = _0x50ea55.name || "条目 " + (_0x3603fb + 1);
  const _0x4c1ac1 = _0x50ea55.role || "user";
  const _0x54e51e = _0x50ea55.content || "";
  const _0x321926 = _0x50ea55.enabled !== false;
  const _0x158dad = _0x50ea55.triggerMode || "always";
  const _0x4c3455 = _0x50ea55.triggerWords || "";
  const _0x36d182 = _0x321926 ? "" : "disabled";
  const _0x4f3bc2 = _0x54e51e.length > 50 ? _0x54e51e.substring(0, 50) + "..." : _0x54e51e || "(空)";
  const _0x1c2c29 = _0x3603fb * VIRTUAL_ITEM_HEIGHT;
  const _0x86f76d = document.createElement("div");
  _0x86f76d.className = "st-chatu8-preset-entry st-chatu8-preset-entry-collapsed " + _0x36d182;
  _0x86f76d.setAttribute("data-entry-id", _0xf90ffe);
  _0x86f76d.setAttribute("data-entry-index", String(_0x3603fb));
  _0x86f76d.setAttribute("data-role", _0x4c1ac1);
  _0x86f76d.setAttribute("data-trigger-mode", _0x158dad);
  _0x86f76d.setAttribute("data-trigger-words", _0x4c3455);
  _0x86f76d.setAttribute("draggable", "true");
  _0x86f76d.style.cssText = "position: absolute; left: 0; right: 0; min-height: " + VIRTUAL_ITEM_HEIGHT + "px; transform: translateY(" + _0x1c2c29 + "px); will-change: transform; overflow: visible;";
  _0x86f76d.innerHTML = "\n        <div class=\"st-chatu8-entry-header\">\n            <span class=\"st-chatu8-entry-drag-handle\" title=\"拖拽排序\">\n                <i class=\"fa-solid fa-grip-vertical\"></i>\n            </span>\n            <span class=\"st-chatu8-entry-role-badge\" data-role=\"" + _0x4c1ac1 + "\">" + getRoleBadgeText(_0x4c1ac1) + "</span>\n            <input type=\"text\" class=\"st-chatu8-entry-name\" value=\"" + escapeHtml(_0x2462e8) + "\" placeholder=\"条目名称\" readonly />\n            <span class=\"st-chatu8-entry-preview\">" + escapeHtml(_0x4f3bc2) + "</span>\n            <div class=\"st-chatu8-entry-actions\">\n                <div class=\"st-chatu8-entry-toggle\" title=\"启用/禁用\">\n                    <input type=\"checkbox\" " + (_0x321926 ? "checked" : "") + " />\n                    <span class=\"st-chatu8-slider\"></span>\n                </div>\n                <button class=\"st-chatu8-icon-btn st-chatu8-entry-edit\" title=\"编辑\">\n                    <i class=\"fa-solid fa-pen\"></i>\n                </button>\n                <button class=\"st-chatu8-icon-btn danger st-chatu8-entry-delete\" title=\"删除条目\">\n                    <i class=\"fa-solid fa-trash\"></i>\n                </button>\n            </div>\n        </div>\n        <textarea class=\"st-chatu8-entry-content\" style=\"display:none;\">" + escapeHtml(_0x54e51e) + "</textarea>\n    ";
  return _0x86f76d;
}
function addPresetEntryDOMToContainerAbsolute(_0x27aca7, _0x325c13, _0xca9501) {
  const _0x174682 = createEntryElementAbsolute(_0x27aca7, _0x325c13);
  _0xca9501.append(_0x174682);
}
function addPresetEntryDOM(_0x4e9a1c, _0x24f5e2 = -1) {
  const _0x3f7a5e = _0x4e9a1c.id || generateEntryId();
  const _0x316ad6 = _0x4e9a1c.name || "条目 " + (_0x24f5e2 + 1);
  const _0x412025 = _0x4e9a1c.role || "user";
  const _0x4df22b = _0x4e9a1c.content || "";
  const _0x3f4285 = _0x4e9a1c.enabled !== false;
  const _0x29d690 = _0x4e9a1c.triggerMode || "always";
  const _0x1313f0 = _0x4e9a1c.triggerWords || "";
  const _0x3ef2f8 = _0x3f4285 ? "" : "disabled";
  const _0x590025 = _0x4df22b.length > 50 ? _0x4df22b.substring(0, 50) + "..." : _0x4df22b || "(空)";
  const _0x59e18e = $("\n        <div class=\"st-chatu8-preset-entry st-chatu8-preset-entry-collapsed " + _0x3ef2f8 + "\" \n             data-entry-id=\"" + _0x3f7a5e + "\" \n             data-role=\"" + _0x412025 + "\" \n             data-trigger-mode=\"" + _0x29d690 + "\"\n             data-trigger-words=\"" + escapeHtml(_0x1313f0) + "\"\n             draggable=\"true\">\n            <div class=\"st-chatu8-entry-header\">\n                <span class=\"st-chatu8-entry-drag-handle\" title=\"拖拽排序\">\n                    <i class=\"fa-solid fa-grip-vertical\"></i>\n                </span>\n                <span class=\"st-chatu8-entry-role-badge\" data-role=\"" + _0x412025 + "\">" + getRoleBadgeText(_0x412025) + "</span>\n                <input type=\"text\" class=\"st-chatu8-entry-name\" value=\"" + escapeHtml(_0x316ad6) + "\" placeholder=\"条目名称\" readonly />\n                <span class=\"st-chatu8-entry-preview\">" + escapeHtml(_0x590025) + "</span>\n                <div class=\"st-chatu8-entry-actions\">\n                    <div class=\"st-chatu8-entry-toggle\" title=\"启用/禁用\">\n                        <input type=\"checkbox\" " + (_0x3f4285 ? "checked" : "") + " />\n                        <span class=\"st-chatu8-slider\"></span>\n                    </div>\n                    <button class=\"st-chatu8-icon-btn st-chatu8-entry-edit\" title=\"编辑\">\n                        <i class=\"fa-solid fa-pen\"></i>\n                    </button>\n                    <button class=\"st-chatu8-icon-btn danger st-chatu8-entry-delete\" title=\"删除条目\">\n                        <i class=\"fa-solid fa-trash\"></i>\n                    </button>\n                </div>\n            </div>\n            <!-- 隐藏的数据存储 -->\n            <textarea class=\"st-chatu8-entry-content\" style=\"display:none;\">" + escapeHtml(_0x4df22b) + "</textarea>\n        </div>\n    ");
  presetEntriesContainer.append(_0x59e18e);
}
function escapeHtml(_0x5a87c4) {
  if (!_0x5a87c4) {
    return "";
  }
  const _0x410ee1 = document.createElement("div");
  _0x410ee1.textContent = _0x5a87c4;
  return _0x410ee1.innerHTML;
}
function addNewPresetEntry() {
  presetEntriesContainer.find(".st-chatu8-entries-empty").remove();
  const _0x597a42 = virtualScrollEnabled ? virtualEntriesData.length : presetEntriesContainer.find(".st-chatu8-preset-entry").length;
  const _0x179cac = {
    id: generateEntryId(),
    name: "条目 " + (_0x597a42 + 1),
    role: "user",
    content: "",
    enabled: true,
    triggerMode: "always",
    triggerWords: ""
  };
  if (virtualScrollEnabled) {
    _0x179cac._index = virtualEntriesData.length;
    virtualEntriesData.push(_0x179cac);
    const _0x12db71 = virtualEntriesData.length * VIRTUAL_ITEM_HEIGHT;
    virtualScrollSpacer.css("height", _0x12db71 + "px");
    const _0x9a5c79 = presetEntriesContainer[0];
    _0x9a5c79.scrollTop = _0x9a5c79.scrollHeight;
    const _0x806941 = {
      start: -1,
      end: -1
    };
    lastRenderedRange = _0x806941;
    updateVirtualScroll();
  } else {
    addPresetEntryDOM(_0x179cac);
    const _0x58b64a = presetEntriesContainer[0];
    _0x58b64a.scrollTop = _0x58b64a.scrollHeight;
  }
  toastr.success("已添加新条目");
}
function collectTestContextDataFromUI() {
  if (virtualScrollEnabled && virtualEntriesData.length > 0) {
    return {
      entries: virtualEntriesData.map(_0x947e11 => ({
        id: _0x947e11.id,
        name: _0x947e11.name,
        role: _0x947e11.role,
        content: _0x947e11.content,
        enabled: _0x947e11.enabled,
        triggerMode: _0x947e11.triggerMode,
        triggerWords: _0x947e11.triggerWords
      }))
    };
  }
  const _0x282dc5 = [];
  presetEntriesContainer.find(".st-chatu8-preset-entry").each(function () {
    const _0x59062f = $(this);
    const _0x503b0a = {
      id: _0x59062f.attr("data-entry-id"),
      name: _0x59062f.find(".st-chatu8-entry-name").val() || "",
      role: _0x59062f.attr("data-role") || "user",
      content: _0x59062f.find(".st-chatu8-entry-content").val() || "",
      enabled: _0x59062f.find(".st-chatu8-entry-toggle input").is(":checked"),
      triggerMode: _0x59062f.attr("data-trigger-mode") || "always",
      triggerWords: _0x59062f.attr("data-trigger-words") || ""
    };
    _0x282dc5.push(_0x503b0a);
  });
  const _0x473693 = {
    entries: _0x282dc5
  };
  return _0x473693;
}
let draggedEntry = null;
let dragScrollInterval = null;
const SCROLL_THRESHOLD = 50;
const SCROLL_SPEED = 8;
function bindDragEvents() {
  presetEntriesContainer.on("dragstart", ".st-chatu8-preset-entry", function (_0x1580ba) {
    draggedEntry = this;
    $(this).addClass("dragging");
    _0x1580ba.originalEvent.dataTransfer.effectAllowed = "move";
  });
  presetEntriesContainer.on("dragend", ".st-chatu8-preset-entry", function () {
    $(this).removeClass("dragging");
    presetEntriesContainer.find(".st-chatu8-preset-entry").removeClass("drag-over");
    draggedEntry = null;
    if (dragScrollInterval) {
      clearInterval(dragScrollInterval);
      dragScrollInterval = null;
    }
  });
  presetEntriesContainer.on("dragover", ".st-chatu8-preset-entry", function (_0x82aee6) {
    _0x82aee6.preventDefault();
    _0x82aee6.originalEvent.dataTransfer.dropEffect = "move";
    if (this !== draggedEntry) {
      presetEntriesContainer.find(".st-chatu8-preset-entry").removeClass("drag-over");
      $(this).addClass("drag-over");
    }
  });
  presetEntriesContainer.on("dragover", function (_0x4b9169) {
    _0x4b9169.preventDefault();
    if (!draggedEntry) {
      return;
    }
    const _0x45c720 = presetEntriesContainer[0];
    const _0x92a7e8 = _0x45c720.getBoundingClientRect();
    const _0x10c01d = _0x4b9169.originalEvent.clientY;
    const _0x2f5b1c = _0x10c01d - _0x92a7e8.top;
    const _0x13c8ed = _0x92a7e8.bottom - _0x10c01d;
    if (dragScrollInterval) {
      clearInterval(dragScrollInterval);
      dragScrollInterval = null;
    }
    if (_0x2f5b1c < SCROLL_THRESHOLD && _0x45c720.scrollTop > 0) {
      dragScrollInterval = setInterval(() => {
        _0x45c720.scrollTop -= SCROLL_SPEED;
        if (_0x45c720.scrollTop <= 0) {
          clearInterval(dragScrollInterval);
          dragScrollInterval = null;
        }
      }, 16);
    } else if (_0x13c8ed < SCROLL_THRESHOLD && _0x45c720.scrollTop < _0x45c720.scrollHeight - _0x45c720.clientHeight) {
      dragScrollInterval = setInterval(() => {
        _0x45c720.scrollTop += SCROLL_SPEED;
        if (_0x45c720.scrollTop >= _0x45c720.scrollHeight - _0x45c720.clientHeight) {
          clearInterval(dragScrollInterval);
          dragScrollInterval = null;
        }
      }, 16);
    }
  });
  presetEntriesContainer.on("drop", ".st-chatu8-preset-entry", function (_0x1f7394) {
    _0x1f7394.preventDefault();
    if (dragScrollInterval) {
      clearInterval(dragScrollInterval);
      dragScrollInterval = null;
    }
    if (this !== draggedEntry && draggedEntry) {
      const _0x31649c = $(this);
      const _0x17f446 = $(draggedEntry);
      const _0x2a1358 = this.getBoundingClientRect();
      const _0x593592 = _0x1f7394.originalEvent.clientY;
      const _0x10695a = _0x593592 > _0x2a1358.top + _0x2a1358.height / 2;
      if (virtualScrollEnabled) {
        const _0x3dc599 = parseInt(_0x17f446.attr("data-entry-index"), 10);
        const _0x307926 = parseInt(_0x31649c.attr("data-entry-index"), 10);
        if (!isNaN(_0x3dc599) && !isNaN(_0x307926) && _0x3dc599 !== _0x307926) {
          const [_0x2f11d7] = virtualEntriesData.splice(_0x3dc599, 1);
          let _0x4a4372 = _0x307926;
          if (_0x3dc599 < _0x307926) {
            _0x4a4372 = _0x10695a ? _0x307926 : _0x307926 - 1;
          } else {
            _0x4a4372 = _0x10695a ? _0x307926 + 1 : _0x307926;
          }
          virtualEntriesData.splice(_0x4a4372, 0, _0x2f11d7);
          virtualEntriesData.forEach((_0x558017, _0x385518) => {
            _0x558017._index = _0x385518;
          });
          const _0x527dfa = {
            start: -1,
            end: -1
          };
          lastRenderedRange = _0x527dfa;
          updateVirtualScroll();
        }
      } else if (_0x10695a) {
        _0x31649c.after(_0x17f446);
      } else {
        _0x31649c.before(_0x17f446);
      }
    }
    presetEntriesContainer.find(".st-chatu8-preset-entry").removeClass("drag-over");
  });
  presetEntriesContainer.on("dragleave", function (_0x5d2df0) {
    const _0x3b0b9e = presetEntriesContainer[0].getBoundingClientRect();
    const _0x46e74f = _0x5d2df0.originalEvent.clientX;
    const _0x1eafee = _0x5d2df0.originalEvent.clientY;
    if (_0x46e74f < _0x3b0b9e.left || _0x46e74f > _0x3b0b9e.right || _0x1eafee < _0x3b0b9e.top || _0x1eafee > _0x3b0b9e.bottom) {
      if (dragScrollInterval) {
        clearInterval(dragScrollInterval);
        dragScrollInterval = null;
      }
    }
  });
}
function bindEntryEvents() {
  presetEntriesContainer.on("click", ".st-chatu8-entry-edit", function (_0x1f45c7) {
    _0x1f45c7.stopPropagation();
    const _0x310c50 = $(this).closest(".st-chatu8-preset-entry");
    if (virtualScrollEnabled) {
      const _0x29fad4 = parseInt(_0x310c50.attr("data-entry-index"), 10);
      if (!isNaN(_0x29fad4) && virtualEntriesData[_0x29fad4]) {
        const _0x2d2b4c = virtualEntriesData[_0x29fad4];
        _0x310c50.find(".st-chatu8-entry-content").val(_0x2d2b4c.content || "");
      }
    }
    showEntryEditModal(_0x310c50);
  });
  presetEntriesContainer.on("change", ".st-chatu8-entry-toggle input", function () {
    const _0x5f3fac = $(this).closest(".st-chatu8-preset-entry");
    const _0x53dc11 = $(this).is(":checked");
    if (_0x53dc11) {
      _0x5f3fac.removeClass("disabled");
    } else {
      _0x5f3fac.addClass("disabled");
    }
    if (virtualScrollEnabled) {
      const _0x130cd3 = parseInt(_0x5f3fac.attr("data-entry-index"), 10);
      if (!isNaN(_0x130cd3) && virtualEntriesData[_0x130cd3]) {
        virtualEntriesData[_0x130cd3].enabled = _0x53dc11;
      }
    }
  });
  presetEntriesContainer.on("click", ".st-chatu8-entry-delete", function (_0x30d9dd) {
    _0x30d9dd.stopPropagation();
    const _0x3ed135 = virtualScrollEnabled ? virtualEntriesData.length : presetEntriesContainer.find(".st-chatu8-preset-entry").length;
    if (_0x3ed135 <= 1) {
      toastr.warning("至少需要保留一个条目");
      return;
    }
    const _0x158d47 = $(this).closest(".st-chatu8-preset-entry");
    if (virtualScrollEnabled) {
      const _0x2613a7 = parseInt(_0x158d47.attr("data-entry-index"), 10);
      if (!isNaN(_0x2613a7)) {
        virtualEntriesData.splice(_0x2613a7, 1);
        virtualEntriesData.forEach((_0x34811f, _0x193106) => _0x34811f._index = _0x193106);
        const _0x49b127 = virtualEntriesData.length * VIRTUAL_ITEM_HEIGHT;
        virtualScrollSpacer.css("height", _0x49b127 + "px");
        const _0x524624 = {
          start: -1,
          end: -1
        };
        lastRenderedRange = _0x524624;
        updateVirtualScroll();
      }
    } else {
      _0x158d47.remove();
    }
    toastr.info("已删除条目");
  });
  presetEntriesContainer.on("dblclick", ".st-chatu8-preset-entry", function (_0x5c10a6) {
    if ($(_0x5c10a6.target).closest(".st-chatu8-entry-actions, .st-chatu8-entry-drag-handle").length) {
      return;
    }
    if (virtualScrollEnabled) {
      const _0x34291d = parseInt($(this).attr("data-entry-index"), 10);
      if (!isNaN(_0x34291d) && virtualEntriesData[_0x34291d]) {
        const _0x15d99a = virtualEntriesData[_0x34291d];
        $(this).find(".st-chatu8-entry-content").val(_0x15d99a.content || "");
      }
    }
    showEntryEditModal($(this));
  });
}
export function loadLLMProfiles() {
  const _0x5bcd45 = extension_settings[extensionName].llm_profiles || {};
  const _0x2dbf3c = extension_settings[extensionName].current_llm_profile;
  profileSelect.empty();
  Object.keys(_0x5bcd45).forEach(_0x1c4291 => {
    const _0xc6bc3b = new Option(_0x1c4291, _0x1c4291, _0x1c4291 === _0x2dbf3c, _0x1c4291 === _0x2dbf3c);
    profileSelect.append(_0xc6bc3b);
  });
  if (profileSelect.val()) {
    profileSelect.trigger("change");
  }
}
function loadTestContextProfiles() {
  const _0x2c2147 = extension_settings[extensionName].test_context_profiles || {};
  const _0x36daa1 = extension_settings[extensionName].current_test_context_profile;
  testContextSelect.empty();
  Object.keys(_0x2c2147).forEach(_0x5ce5e2 => {
    const _0x3d51a7 = new Option(_0x5ce5e2, _0x5ce5e2, _0x5ce5e2 === _0x36daa1, _0x5ce5e2 === _0x36daa1);
    testContextSelect.append(_0x3d51a7);
  });
  if (testContextSelect.val()) {
    testContextSelect.trigger("change");
  }
}
function onProfileSelectChange() {
  const _0x449fc0 = $(this).val();
  if (!_0x449fc0) {
    return;
  }
  const _0x2e919d = extension_settings[extensionName].llm_profiles;
  const _0x387775 = _0x2e919d[_0x449fc0];
  if (_0x387775) {
    apiUrlInput.val(_0x387775.api_url || "");
    apiKeyInput.val(_0x387775.api_key || "");
    modelSelect.empty();
    const _0x3481fe = _0x387775.model || "";
    if (_0x3481fe) {
      modelSelect.append(new Option(_0x3481fe, _0x3481fe, true, true));
    }
    modelInput.val(_0x3481fe);
    const _0x3785ff = _0x387775.temperature ?? 0.7;
    temperatureSlider.val(_0x3785ff);
    temperatureValue.val(_0x3785ff);
    const _0x12275c = _0x387775.top_p ?? 1;
    topPSlider.val(_0x12275c);
    topPValue.val(_0x12275c);
    const _0x591b33 = _0x387775.max_tokens ?? 512;
    maxTokensSlider.val(_0x591b33);
    maxTokensValue.val(_0x591b33);
    const _0xdf9345 = _0x387775.stream ?? false;
    streamToggle.prop("checked", _0xdf9345);
    const _0x2dd0d4 = _0x387775.bypass_proxy ?? false;
    bypassProxyToggle.prop("checked", _0x2dd0d4);
    extension_settings[extensionName].current_llm_profile = _0x449fc0;
    saveSettingsDebounced();
  }
}
function onTestContextSelectChange() {
  const _0x50b14a = $(this).val();
  if (!_0x50b14a) {
    return;
  }
  const _0x3433bf = extension_settings[extensionName].test_context_profiles;
  let _0x589fd1 = _0x3433bf[_0x50b14a];
  if (_0x589fd1) {
    const _0x22d174 = migrateOldContextData(_0x589fd1);
    if (_0x22d174 !== _0x589fd1) {
      _0x3433bf[_0x50b14a] = _0x22d174;
      saveSettingsDebounced();
      _0x589fd1 = _0x22d174;
    }
    renderPresetEntries(_0x589fd1.entries || []);
    extension_settings[extensionName].current_test_context_profile = _0x50b14a;
    saveSettingsDebounced();
  }
}
export function collectProfileDataFromUI() {
  return {
    api_url: apiUrlInput.val(),
    api_key: apiKeyInput.val(),
    model: modelInput.val() || modelSelect.val(),
    temperature: parseFloat(temperatureSlider.val()),
    top_p: parseFloat(topPSlider.val()),
    max_tokens: parseInt(maxTokensSlider.val(), 10),
    stream: streamToggle.prop("checked"),
    bypass_proxy: bypassProxyToggle.prop("checked")
  };
}
function onSaveProfileClick() {
  const _0x4470ed = profileSelect.val();
  if (!_0x4470ed) {
    toastr.warning("没有选中的配置。");
    return;
  }
  extension_settings[extensionName].llm_profiles[_0x4470ed] = collectProfileDataFromUI();
  saveSettingsDebounced();
  toastr.success("配置 \"" + _0x4470ed + "\" 已保存。");
}
function onSaveTestContextClick() {
  const _0x1da204 = testContextSelect.val();
  if (!_0x1da204) {
    toastr.warning("没有选中的测试上下文配置。");
    return;
  }
  extension_settings[extensionName].test_context_profiles[_0x1da204] = collectTestContextDataFromUI();
  saveSettingsDebounced();
  toastr.success("测试上下文 \"" + _0x1da204 + "\" 已保存。");
}
function onNewProfileClick() {
  const _0x52aff1 = prompt("请输入新的配置名称：");
  if (!_0x52aff1 || _0x52aff1.trim() === "") {
    toastr.warning("配置名称不能为空。");
    return;
  }
  const _0x2d4642 = extension_settings[extensionName].llm_profiles;
  if (_0x2d4642[_0x52aff1]) {
    toastr.error("配置 \"" + _0x52aff1 + "\" 已存在。");
    return;
  }
  _0x2d4642[_0x52aff1] = {
    api_url: "",
    api_key: "",
    model: "",
    temperature: 1,
    top_p: 1,
    max_tokens: 30000,
    stream: false,
    bypass_proxy: false
  };
  extension_settings[extensionName].current_llm_profile = _0x52aff1;
  saveSettingsDebounced();
  loadLLMProfiles();
  populateRequestTypeSelects();
  toastr.success("配置 \"" + _0x52aff1 + "\" 已创建并选中。");
}
function onNewTestContextClick() {
  const _0x4f9687 = prompt("请输入新的测试上下文名称：");
  if (!_0x4f9687 || _0x4f9687.trim() === "") {
    toastr.warning("测试上下文名称不能为空。");
    return;
  }
  const _0x3650d8 = extension_settings[extensionName].test_context_profiles;
  if (_0x3650d8[_0x4f9687]) {
    toastr.error("测试上下文 \"" + _0x4f9687 + "\" 已存在。");
    return;
  }
  _0x3650d8[_0x4f9687] = {
    history: [{
      user: "",
      assistant: ""
    }]
  };
  extension_settings[extensionName].current_test_context_profile = _0x4f9687;
  saveSettingsDebounced();
  loadTestContextProfiles();
  populateRequestTypeSelects();
  toastr.success("测试上下文 \"" + _0x4f9687 + "\" 已创建并选中。");
}
function onDeleteProfileClick() {
  const _0x2c88f7 = profileSelect.val();
  if (!_0x2c88f7) {
    toastr.warning("没有选中的配置。");
    return;
  }
  if (Object.keys(extension_settings[extensionName].llm_profiles).length <= 1) {
    toastr.error("不能删除最后一个配置。");
    return;
  }
  if (confirm("你确定要删除配置 \"" + _0x2c88f7 + "\" 吗？")) {
    delete extension_settings[extensionName].llm_profiles[_0x2c88f7];
    extension_settings[extensionName].current_llm_profile = Object.keys(extension_settings[extensionName].llm_profiles)[0];
    saveSettingsDebounced();
    loadLLMProfiles();
    populateRequestTypeSelects();
    toastr.success("配置 \"" + _0x2c88f7 + "\" 已删除。");
  }
}
function onRenameLLMProfileClick() {
  const _0x5103c3 = profileSelect.val();
  if (!_0x5103c3) {
    toastr.warning("没有选中的 LLM 配置。");
    return;
  }
  const _0x52fd46 = prompt("请输入新的 LLM 配置名称：", _0x5103c3);
  if (!_0x52fd46 || _0x52fd46.trim() === "") {
    toastr.warning("LLM 配置名称不能为空。");
    return;
  }
  if (_0x52fd46 === _0x5103c3) {
    return;
  }
  const _0x1f4bcb = extension_settings[extensionName].llm_profiles;
  if (_0x1f4bcb[_0x52fd46]) {
    toastr.error("LLM 配置 \"" + _0x52fd46 + "\" 已存在。");
    return;
  }
  _0x1f4bcb[_0x52fd46] = _0x1f4bcb[_0x5103c3];
  delete _0x1f4bcb[_0x5103c3];
  extension_settings[extensionName].current_llm_profile = _0x52fd46;
  const _0x284649 = extension_settings[extensionName].llm_request_type_configs || {};
  for (const _0x55fb17 in _0x284649) {
    if (_0x284649[_0x55fb17].api_profile === _0x5103c3) {
      _0x284649[_0x55fb17].api_profile = _0x52fd46;
    }
  }
  saveSettingsDebounced();
  loadLLMProfiles();
  populateRequestTypeSelects();
  toastr.success("LLM 配置已从 \"" + _0x5103c3 + "\" 重命名为 \"" + _0x52fd46 + "\"。");
}
function onDeleteTestContextClick() {
  const _0x51fd04 = testContextSelect.val();
  if (!_0x51fd04) {
    toastr.warning("没有选中的测试上下文配置。");
    return;
  }
  if (Object.keys(extension_settings[extensionName].test_context_profiles).length <= 1) {
    toastr.error("不能删除最后一个测试上下文配置。");
    return;
  }
  if (confirm("你确定要删除测试上下文 \"" + _0x51fd04 + "\" 吗？")) {
    delete extension_settings[extensionName].test_context_profiles[_0x51fd04];
    extension_settings[extensionName].current_test_context_profile = Object.keys(extension_settings[extensionName].test_context_profiles)[0];
    saveSettingsDebounced();
    loadTestContextProfiles();
    populateRequestTypeSelects();
    toastr.success("测试上下文 \"" + _0x51fd04 + "\" 已删除。");
  }
}
function onRenameTestContextClick() {
  const _0x323fa6 = testContextSelect.val();
  if (!_0x323fa6) {
    toastr.warning("没有选中的测试上下文配置。");
    return;
  }
  const _0x270862 = prompt("请输入新的测试上下文名称：", _0x323fa6);
  if (!_0x270862 || _0x270862.trim() === "") {
    toastr.warning("测试上下文名称不能为空。");
    return;
  }
  if (_0x270862 === _0x323fa6) {
    return;
  }
  const _0xa678f6 = extension_settings[extensionName].test_context_profiles;
  if (_0xa678f6[_0x270862]) {
    toastr.error("测试上下文 \"" + _0x270862 + "\" 已存在。");
    return;
  }
  _0xa678f6[_0x270862] = _0xa678f6[_0x323fa6];
  delete _0xa678f6[_0x323fa6];
  extension_settings[extensionName].current_test_context_profile = _0x270862;
  const _0x1d3ae8 = extension_settings[extensionName].llm_request_type_configs || {};
  for (const _0x441c1c in _0x1d3ae8) {
    if (_0x1d3ae8[_0x441c1c].context_profile === _0x323fa6) {
      _0x1d3ae8[_0x441c1c].context_profile = _0x270862;
    }
  }
  saveSettingsDebounced();
  loadTestContextProfiles();
  populateRequestTypeSelects();
  toastr.success("测试上下文已从 \"" + _0x323fa6 + "\" 重命名为 \"" + _0x270862 + "\"。");
}
function onExportAllTestContextClick() {
  const _0x193c98 = extension_settings[extensionName].test_context_profiles || {};
  const _0x10aa7c = Object.keys(_0x193c98).length;
  if (_0x10aa7c === 0) {
    toastr.warning("没有测试上下文可导出。");
    return;
  }
  const _0x2ee5eb = new Blob([JSON.stringify(_0x193c98, null, 4)], {
    type: "application/json"
  });
  const _0x23e733 = URL.createObjectURL(_0x2ee5eb);
  const _0x2474fa = document.createElement("a");
  _0x2474fa.href = _0x23e733;
  _0x2474fa.download = "st_chatu8_all_test_contexts.json";
  document.body.appendChild(_0x2474fa);
  _0x2474fa.click();
  URL.revokeObjectURL(_0x23e733);
  document.body.removeChild(_0x2474fa);
  toastr.success("成功导出 " + _0x10aa7c + " 个测试上下文配置。");
}
function onExportProfileClick() {
  const _0x4aef56 = profileSelect.val();
  if (!_0x4aef56) {
    toastr.warning("没有选中的配置可导出。");
    return;
  }
  const _0x4187a9 = extension_settings[extensionName].llm_profiles[_0x4aef56];
  const _0x359814 = {
    [_0x4aef56]: _0x4187a9
  };
  const _0x1e527f = _0x359814;
  const _0x3ce14f = new Blob([JSON.stringify(_0x1e527f, null, 4)], {
    type: "application/json"
  });
  const _0x2ce740 = URL.createObjectURL(_0x3ce14f);
  const _0x3ab2ec = document.createElement("a");
  _0x3ab2ec.href = _0x2ce740;
  _0x3ab2ec.download = "st_chatu8_llm_profile_" + _0x4aef56 + ".json";
  document.body.appendChild(_0x3ab2ec);
  _0x3ab2ec.click();
  URL.revokeObjectURL(_0x2ce740);
  document.body.removeChild(_0x3ab2ec);
}
function onExportTestContextClick() {
  const _0x25d351 = testContextSelect.val();
  if (!_0x25d351) {
    toastr.warning("没有选中的测试上下文可导出。");
    return;
  }
  const _0xa2c325 = extension_settings[extensionName].test_context_profiles[_0x25d351];
  const _0x5731a1 = {
    [_0x25d351]: _0xa2c325
  };
  const _0x72c0ae = _0x5731a1;
  const _0x233540 = new Blob([JSON.stringify(_0x72c0ae, null, 4)], {
    type: "application/json"
  });
  const _0x21c4c1 = URL.createObjectURL(_0x233540);
  const _0x72ed0d = document.createElement("a");
  _0x72ed0d.href = _0x21c4c1;
  _0x72ed0d.download = "st_chatu8_test_context_" + _0x25d351 + ".json";
  document.body.appendChild(_0x72ed0d);
  _0x72ed0d.click();
  URL.revokeObjectURL(_0x21c4c1);
  document.body.removeChild(_0x72ed0d);
}
function onImportProfileClick() {
  const _0xe4c937 = document.createElement("input");
  _0xe4c937.type = "file";
  _0xe4c937.accept = ".json";
  _0xe4c937.onchange = _0x3c44b4 => {
    const _0x181e07 = _0x3c44b4.target.files[0];
    if (_0x181e07) {
      const _0xe9b4b9 = new FileReader();
      _0xe9b4b9.onload = _0x44928d => {
        try {
          const _0x410c1c = JSON.parse(_0x44928d.target.result);
          let _0x2b29b8 = 0;
          for (const _0x19d7b8 in _0x410c1c) {
            if (Object.prototype.hasOwnProperty.call(_0x410c1c, _0x19d7b8)) {
              extension_settings[extensionName].llm_profiles[_0x19d7b8] = {
                ...(extension_settings[extensionName].llm_profiles[_0x19d7b8] || {}),
                ..._0x410c1c[_0x19d7b8]
              };
              _0x2b29b8++;
            }
          }
          saveSettingsDebounced();
          loadLLMProfiles();
          populateRequestTypeSelects();
          toastr.success("成功导入 " + _0x2b29b8 + " 个配置。");
        } catch (_0x52543e) {
          toastr.error("导入失败，文件格式无效。");
        }
      };
      _0xe9b4b9.readAsText(_0x181e07);
    }
  };
  _0xe4c937.click();
}
function convertWorldBooksToEntries(_0x6bf38) {
  const _0x253be7 = [];
  _0x6bf38.forEach((_0x2f9cd2, _0x3d2e2d) => {
    const _0x47d61c = _0x2f9cd2.triggerMode === "blue";
    const _0x544c79 = Array.isArray(_0x2f9cd2.keywords) ? _0x2f9cd2.keywords.join(", ") : _0x2f9cd2.keywords || "";
    _0x253be7.push({
      id: _0x2f9cd2.id || generateEntryId(),
      name: _0x2f9cd2.name || "条目 " + (_0x3d2e2d + 1),
      role: _0x2f9cd2.role || "system",
      content: _0x2f9cd2.content || "",
      enabled: _0x2f9cd2.enabled !== false && _0x2f9cd2.active !== false,
      triggerMode: _0x47d61c ? "always" : "trigger",
      triggerWords: _0x544c79
    });
  });
  const _0x2e6c1e = {
    entries: _0x253be7
  };
  return _0x2e6c1e;
}
function detectImportFormat(_0x2b2bd1) {
  if (Array.isArray(_0x2b2bd1) && _0x2b2bd1.length > 0 && _0x2b2bd1[0].worldBooks) {
    return "worldBooksArrayOuter";
  }
  if (_0x2b2bd1.worldBooks && Array.isArray(_0x2b2bd1.worldBooks)) {
    return "worldBooks";
  }
  if (!Array.isArray(_0x2b2bd1)) {
    const _0x1d635e = Object.keys(_0x2b2bd1);
    if (_0x1d635e.length > 0) {
      const _0x1ab7c9 = _0x2b2bd1[_0x1d635e[0]];
      if (_0x1ab7c9 && (_0x1ab7c9.entries || _0x1ab7c9.history)) {
        return "standard";
      }
    }
  }
  return "unknown";
}
function onImportTestContextClick() {
  const _0x3f95be = document.createElement("input");
  _0x3f95be.type = "file";
  _0x3f95be.accept = ".json";
  _0x3f95be.onchange = _0x4c8e62 => {
    const _0x1636a7 = _0x4c8e62.target.files[0];
    if (_0x1636a7) {
      const _0x2e21b8 = new FileReader();
      _0x2e21b8.onload = _0x47dc77 => {
        try {
          const _0x131159 = JSON.parse(_0x47dc77.target.result);
          let _0x17516d = 0;
          let _0x2e1feb = 0;
          const _0x36aafe = detectImportFormat(_0x131159);
          if (_0x36aafe === "worldBooksArrayOuter") {
            _0x131159.forEach(_0x357c52 => {
              const _0x225211 = _0x357c52.name || "导入配置_" + (_0x17516d + 1);
              const _0x2b5d06 = convertWorldBooksToEntries(_0x357c52.worldBooks);
              extension_settings[extensionName].test_context_profiles[_0x225211] = _0x2b5d06;
              _0x17516d++;
              _0x2e1feb += _0x357c52.worldBooks.length;
            });
            toastr.success("成功导入 " + _0x17516d + " 个配置，共 " + _0x2e1feb + " 个条目。");
          } else if (_0x36aafe === "worldBooks") {
            const _0x5d11d3 = _0x131159.name || _0x1636a7.name.replace(".json", "");
            const _0x478936 = convertWorldBooksToEntries(_0x131159.worldBooks);
            extension_settings[extensionName].test_context_profiles[_0x5d11d3] = _0x478936;
            _0x17516d = 1;
            toastr.success("成功导入配置 \"" + _0x5d11d3 + "\"，共 " + _0x131159.worldBooks.length + " 个条目。");
          } else {
            for (const _0x8ae899 in _0x131159) {
              if (Object.prototype.hasOwnProperty.call(_0x131159, _0x8ae899)) {
                extension_settings[extensionName].test_context_profiles[_0x8ae899] = {
                  ...(extension_settings[extensionName].test_context_profiles[_0x8ae899] || {}),
                  ..._0x131159[_0x8ae899]
                };
                _0x17516d++;
              }
            }
            toastr.success("成功导入 " + _0x17516d + " 个测试上下文。");
          }
          saveSettingsDebounced();
          loadTestContextProfiles();
          populateRequestTypeSelects();
        } catch (_0xf9bd60) {
          console.error("导入测试上下文失败:", _0xf9bd60);
          toastr.error("导入失败，文件格式无效。");
        }
      };
      _0x2e21b8.readAsText(_0x1636a7);
    }
  };
  _0x3f95be.click();
}
async function onFetchModelsClick() {
  const _0x3d28f8 = apiUrlInput.val();
  const _0xe3ddb8 = apiKeyInput.val();
  if (!_0x3d28f8 || !_0xe3ddb8) {
    toastr.warning("请输入 API Base URL 和 API Key。");
    return;
  }
  const _0x79b399 = "/api/backends/chat-completions/status";
  const _0x4da656 = _0x3d28f8.replace(/\/$/, "");
  const _0x39a185 = fetchModelsButton.html();
  fetchModelsButton.html("<i class=\"fa-solid fa-spinner fa-spin\"></i> 正在获取...");
  fetchModelsButton.prop("disabled", true);
  try {
    const _0x2bfa01 = await fetch(_0x79b399, {
      method: "POST",
      headers: getRequestHeaders(window.token),
      body: JSON.stringify({
        chat_completion_source: "custom",
        custom_url: _0x4da656,
        custom_include_headers: "Authorization: \"Bearer " + _0xe3ddb8 + "\""
      })
    });
    const _0xa2682d = await _0x2bfa01.json();
    if (_0xa2682d.error) {
      throw new Error(_0xa2682d.error.message || JSON.stringify(_0xa2682d.error));
    }
    if (!_0x2bfa01.ok) {
      throw new Error("获取模型列表失败: " + _0x2bfa01.status + " " + _0x2bfa01.statusText);
    }
    const _0x117544 = _0xa2682d.data || [];
    _0x117544.sort((_0x48f4c0, _0x384eaa) => _0x48f4c0.id.localeCompare(_0x384eaa.id));
    const _0x1416cc = modelSelect.val();
    modelSelect.empty();
    _0x117544.forEach(_0x206e73 => {
      modelSelect.append(new Option(_0x206e73.id, _0x206e73.id));
    });
    if (_0x1416cc && _0x117544.some(_0x3d6585 => _0x3d6585.id === _0x1416cc)) {
      modelSelect.val(_0x1416cc);
      modelInput.val(_0x1416cc);
    } else if (_0x117544.length > 0) {}
    toastr.success("成功获取 " + _0x117544.length + " 个模型。");
  } catch (_0x10f983) {
    toastr.error("获取模型失败: " + _0x10f983.message);
  } finally {
    fetchModelsButton.html(_0x39a185);
    fetchModelsButton.prop("disabled", false);
  }
}
async function onTestLLMClick() {
  let _0x392bfc = getLLMRequestController();
  if (_0x392bfc) {
    _0x392bfc.abort();
    toastr.info("LLM请求已中断，开始新请求。");
  }
  const _0x2b472c = new AbortController();
  setLLMRequestController(_0x2b472c);
  const _0x433b6f = _0x2b472c.signal;
  const _0x233652 = collectProfileDataFromUI();
  const {
    api_url: _0xf32351,
    api_key: _0x222c00,
    model: _0x161c45,
    temperature: _0x5e529a,
    top_p: _0x40ccf6,
    max_tokens: _0x51154c,
    bypass_proxy: _0x525a52
  } = _0x233652;
  if (!_0xf32351 || !_0x222c00 || !_0x161c45) {
    toastr.warning("请完整填写 API URL, API Key, 和模型。");
    return;
  }
  resultTextarea.val("正在请求，请稍候...");
  testButton.prop("disabled", true);
  try {
    const _0x3294e3 = [{
      role: "user",
      content: "Hello"
    }];
    const _0x41f052 = {
      model: _0x161c45,
      messages: _0x3294e3,
      temperature: _0x5e529a,
      top_p: _0x40ccf6,
      max_tokens: _0x51154c,
      stream: false
    };
    const _0x50c81f = _0x41f052;
    let _0x310eea;
    if (_0x525a52) {
      const _0x23fdbe = _0xf32351.replace(/\/$/, "") + "/chat/completions";
      const _0x37ca36 = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + _0x222c00
      };
      _0x310eea = await fetch(_0x23fdbe, {
        method: "POST",
        headers: _0x37ca36,
        body: JSON.stringify(_0x50c81f),
        signal: _0x433b6f
      });
    } else {
      const _0x2b9fcc = "/api/backends/chat-completions/generate";
      let _0x25f0f6 = _0xf32351.replace(/\/$/, "");
      if (!_0x25f0f6.endsWith("/v1") && !_0x25f0f6.includes("/v1/")) {
        _0x25f0f6 = _0x25f0f6 + "/v1";
      }
      _0x25f0f6 = _0x25f0f6.replace(/\/v1\/$/, "/v1");
      const _0x5680e8 = {
        chat_completion_source: "custom",
        custom_url: _0x25f0f6,
        custom_include_headers: "Authorization: \"Bearer " + _0x222c00 + "\"",
        ..._0x50c81f
      };
      _0x310eea = await fetch(_0x2b9fcc, {
        method: "POST",
        headers: getRequestHeaders(window.token),
        body: JSON.stringify(_0x5680e8),
        signal: _0x433b6f
      });
    }
    const _0x2c9063 = await _0x310eea.json();
    if (_0x2c9063.error) {
      throw new Error(_0x2c9063.error.message || JSON.stringify(_0x2c9063.error));
    }
    if (!_0x310eea.ok) {
      throw new Error("请求失败: " + _0x310eea.status + " " + _0x310eea.statusText);
    }
    const _0x10c8b4 = _0x2c9063.choices?.[0]?.message?.content || "未收到有效回复。";
    resultTextarea.val(_0x10c8b4);
    const _0x2456a9 = {
      success: true,
      data: _0x2c9063
    };
    eventSource.emit(eventNames.LLM_TEST_RESULT, _0x2456a9);
  } catch (_0x4eff9c) {
    if (_0x4eff9c.name === "AbortError") {
      resultTextarea.val("请求已中止。");
      return;
    }
    const _0x434de8 = "请求错误: " + _0x4eff9c.message;
    resultTextarea.val(_0x434de8);
    toastr.error(_0x434de8);
    const _0x4eca75 = {
      success: false,
      error: _0x434de8
    };
    eventSource.emit(eventNames.LLM_TEST_RESULT, _0x4eca75);
  } finally {
    testButton.prop("disabled", false);
    setLLMRequestController(null);
  }
}
function buildPrompt() {
  const _0x1327fc = collectTestContextDataFromUI();
  const {
    entries: _0x11dc7e
  } = _0x1327fc;
  const _0x35c0d5 = [];
  if (_0x11dc7e && Array.isArray(_0x11dc7e)) {
    _0x11dc7e.forEach(_0x1283da => {
      if (!_0x1283da.enabled) {
        return;
      }
      if (!_0x1283da.content || _0x1283da.content.trim() === "") {
        return;
      }
      const _0x49308d = {
        role: _0x1283da.role || "user",
        content: _0x1283da.content
      };
      _0x35c0d5.push(_0x49308d);
    });
  }
  return _0x35c0d5;
}
function onGetPromptRequest(_0x2075d0) {
  const {
    id: _0xc6ebd9
  } = _0x2075d0;
  if (!_0xc6ebd9) {
    return;
  }
  console.log("st-chatu8: 收到提示词获取请求 (ID: " + _0xc6ebd9 + ")");
  const _0x274997 = buildPrompt();
  const _0x1bd687 = {
    prompt: _0x274997,
    id: _0xc6ebd9
  };
  eventSource.emit(eventNames.LLM_GET_PROMPT_RESPONSE, _0x1bd687);
}
export function populateRequestTypeSelects() {
  const _0x4e908e = extension_settings[extensionName].llm_profiles || {};
  const _0x340bc9 = extension_settings[extensionName].test_context_profiles || {};
  const _0x4609ea = extension_settings[extensionName].llm_request_type_configs || {};
  const _0x56bcf3 = Object.keys(_0x4e908e);
  const _0x8d322b = Object.keys(_0x340bc9);
  const _0x443e1c = [imageGenApiSelect, charDesignApiSelect, charDisplayApiSelect, charModifyApiSelect, translationApiSelect, tagModifyApiSelect];
  const _0x3ff7df = [imageGenContextSelect, charDesignContextSelect, charDisplayContextSelect, charModifyContextSelect, translationContextSelect, tagModifyContextSelect];
  const _0x5ddbe2 = [LLMRequestTypes.IMAGE_GEN, LLMRequestTypes.CHAR_DESIGN, LLMRequestTypes.CHAR_DISPLAY, LLMRequestTypes.CHAR_MODIFY, LLMRequestTypes.TRANSLATION, LLMRequestTypes.TAG_MODIFY];
  _0x443e1c.forEach((_0xfdbf6b, _0x386ba6) => {
    if (!_0xfdbf6b || !_0xfdbf6b.length) {
      return;
    }
    _0xfdbf6b.empty();
    const _0x27a103 = _0x4609ea[_0x5ddbe2[_0x386ba6]] || {};
    const _0x308784 = _0x27a103.api_profile || "默认";
    _0x56bcf3.forEach(_0x2f5ffd => {
      const _0x37e72e = new Option(_0x2f5ffd, _0x2f5ffd, _0x2f5ffd === _0x308784, _0x2f5ffd === _0x308784);
      _0xfdbf6b.append(_0x37e72e);
    });
  });
  _0x3ff7df.forEach((_0x161d17, _0x31eed5) => {
    if (!_0x161d17 || !_0x161d17.length) {
      return;
    }
    _0x161d17.empty();
    const _0x5cd92e = _0x4609ea[_0x5ddbe2[_0x31eed5]] || {};
    const _0x499e91 = _0x5cd92e.context_profile || "默认";
    _0x8d322b.forEach(_0x45fafd => {
      const _0x599517 = new Option(_0x45fafd, _0x45fafd, _0x45fafd === _0x499e91, _0x45fafd === _0x499e91);
      _0x161d17.append(_0x599517);
    });
  });
}
function bindRequestTypeSelectEvents() {
  if (imageGenApiSelect && imageGenApiSelect.length) {
    imageGenApiSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.IMAGE_GEN, "api_profile", $(this).val());
    });
  }
  if (imageGenContextSelect && imageGenContextSelect.length) {
    imageGenContextSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.IMAGE_GEN, "context_profile", $(this).val());
    });
  }
  if (charDesignApiSelect && charDesignApiSelect.length) {
    charDesignApiSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.CHAR_DESIGN, "api_profile", $(this).val());
    });
  }
  if (charDesignContextSelect && charDesignContextSelect.length) {
    charDesignContextSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.CHAR_DESIGN, "context_profile", $(this).val());
    });
  }
  if (charDisplayApiSelect && charDisplayApiSelect.length) {
    charDisplayApiSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.CHAR_DISPLAY, "api_profile", $(this).val());
    });
  }
  if (charDisplayContextSelect && charDisplayContextSelect.length) {
    charDisplayContextSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.CHAR_DISPLAY, "context_profile", $(this).val());
    });
  }
  if (charModifyApiSelect && charModifyApiSelect.length) {
    charModifyApiSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.CHAR_MODIFY, "api_profile", $(this).val());
    });
  }
  if (charModifyContextSelect && charModifyContextSelect.length) {
    charModifyContextSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.CHAR_MODIFY, "context_profile", $(this).val());
    });
  }
  if (translationApiSelect && translationApiSelect.length) {
    translationApiSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.TRANSLATION, "api_profile", $(this).val());
    });
  }
  if (translationContextSelect && translationContextSelect.length) {
    translationContextSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.TRANSLATION, "context_profile", $(this).val());
    });
  }
  if (tagModifyApiSelect && tagModifyApiSelect.length) {
    tagModifyApiSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.TAG_MODIFY, "api_profile", $(this).val());
    });
  }
  if (tagModifyContextSelect && tagModifyContextSelect.length) {
    tagModifyContextSelect.on("change", function () {
      saveRequestTypeSelection(LLMRequestTypes.TAG_MODIFY, "context_profile", $(this).val());
    });
  }
}
function saveRequestTypeSelection(_0xb693a5, _0x1355f7, _0x12b30b) {
  if (!extension_settings[extensionName].llm_request_type_configs) {
    extension_settings[extensionName].llm_request_type_configs = {};
  }
  if (!extension_settings[extensionName].llm_request_type_configs[_0xb693a5]) {
    extension_settings[extensionName].llm_request_type_configs[_0xb693a5] = {
      api_profile: "默认",
      context_profile: "默认"
    };
  }
  extension_settings[extensionName].llm_request_type_configs[_0xb693a5][_0x1355f7] = _0x12b30b;
  saveSettingsDebounced();
  const _0x4bd097 = {
    image_gen: "正文图片生成",
    char_design: "角色/服装设计",
    char_display: "角色/服装展示",
    char_modify: "角色/服装修改",
    translation: "翻译",
    tag_modify: "Tag修改"
  };
  const _0x579ed1 = {
    api_profile: "API 配置",
    context_profile: "上下文预设"
  };
  console.log("st-chatu8: " + _0x4bd097[_0xb693a5] + " 的 " + _0x579ed1[_0x1355f7] + " 已更改为 \"" + _0x12b30b + "\"");
}
function onImageGenGetPromptRequest(_0x1d84f3) {
  const {
    id: _0x5ceb32
  } = _0x1d84f3;
  if (!_0x5ceb32) {
    return;
  }
  console.log("st-chatu8: 收到正文图片生成提示词获取请求 (ID: " + _0x5ceb32 + ")");
  const _0x430d74 = buildPromptForRequestType(LLMRequestTypes.IMAGE_GEN);
  const _0x2d5a9b = {
    prompt: _0x430d74,
    id: _0x5ceb32
  };
  eventSource.emit(eventNames.LLM_IMAGE_GEN_GET_PROMPT_RESPONSE, _0x2d5a9b);
}
function onCharDesignGetPromptRequest(_0xae8646) {
  const {
    id: _0x32df1b
  } = _0xae8646;
  if (!_0x32df1b) {
    return;
  }
  console.log("st-chatu8: 收到角色/服装设计提示词获取请求 (ID: " + _0x32df1b + ")");
  const _0x49efb9 = buildPromptForRequestType(LLMRequestTypes.CHAR_DESIGN);
  const _0x3ad029 = {
    prompt: _0x49efb9,
    id: _0x32df1b
  };
  eventSource.emit(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE, _0x3ad029);
}
function onCharDisplayGetPromptRequest(_0x331e00) {
  const {
    id: _0x13e2ce
  } = _0x331e00;
  if (!_0x13e2ce) {
    return;
  }
  console.log("st-chatu8: 收到角色/服装展示提示词获取请求 (ID: " + _0x13e2ce + ")");
  const _0x254c89 = buildPromptForRequestType(LLMRequestTypes.CHAR_DISPLAY);
  const _0x2668c7 = {
    prompt: _0x254c89,
    id: _0x13e2ce
  };
  eventSource.emit(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x2668c7);
}
function onCharModifyGetPromptRequest(_0x3b9d46) {
  const {
    id: _0x72e052
  } = _0x3b9d46;
  if (!_0x72e052) {
    return;
  }
  console.log("st-chatu8: 收到角色/服装修改提示词获取请求 (ID: " + _0x72e052 + ")");
  const _0x2cf411 = buildPromptForRequestType(LLMRequestTypes.CHAR_MODIFY);
  const _0x509826 = {
    prompt: _0x2cf411,
    id: _0x72e052
  };
  eventSource.emit(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x509826);
}
function onTranslationGetPromptRequest(_0x46e777) {
  const {
    id: _0x5811c0
  } = _0x46e777;
  if (!_0x5811c0) {
    return;
  }
  console.log("st-chatu8: 收到翻译提示词获取请求 (ID: " + _0x5811c0 + ")");
  const _0x498bac = buildPromptForRequestType(LLMRequestTypes.TRANSLATION);
  const _0x498438 = {
    prompt: _0x498bac,
    id: _0x5811c0
  };
  eventSource.emit(eventNames.LLM_TRANSLATION_GET_PROMPT_RESPONSE, _0x498438);
}
function onTagModifyGetPromptRequest(_0x503129) {
  const {
    id: _0x4cf021
  } = _0x503129;
  if (!_0x4cf021) {
    return;
  }
  console.log("st-chatu8: 收到Tag修改提示词获取请求 (ID: " + _0x4cf021 + ")");
  const _0x47a187 = buildPromptForRequestType(LLMRequestTypes.TAG_MODIFY);
  const _0x172bec = {
    prompt: _0x47a187,
    id: _0x4cf021
  };
  eventSource.emit(eventNames.LLM_TAG_MODIFY_GET_PROMPT_RESPONSE, _0x172bec);
}
async function onExecuteRequest(_0x18f239) {
  const _0x23ef9a = collectProfileDataFromUI();
  await executeDefaultLLMRequest(_0x18f239, _0x23ef9a, getResultTextareaUpdater());
}
async function onImageGenRequest(_0x75d3c6) {
  await executeTypedLLMRequest(_0x75d3c6, LLMRequestTypes.IMAGE_GEN, eventNames.LLM_IMAGE_GEN_RESPONSE, getResultTextareaUpdater());
}
async function onCharDesignRequest(_0x4c7d56) {
  await executeTypedLLMRequest(_0x4c7d56, LLMRequestTypes.CHAR_DESIGN, eventNames.LLM_CHAR_DESIGN_RESPONSE, getResultTextareaUpdater());
}
async function onCharDisplayRequest(_0x5780ca) {
  await executeTypedLLMRequest(_0x5780ca, LLMRequestTypes.CHAR_DISPLAY, eventNames.LLM_CHAR_DISPLAY_RESPONSE, getResultTextareaUpdater());
}
async function onCharModifyRequest(_0x4e3873) {
  await executeTypedLLMRequest(_0x4e3873, LLMRequestTypes.CHAR_MODIFY, eventNames.LLM_CHAR_MODIFY_RESPONSE, getResultTextareaUpdater());
}
async function onTranslationRequest(_0x3e573e) {
  await executeTypedLLMRequest(_0x3e573e, LLMRequestTypes.TRANSLATION, eventNames.LLM_TRANSLATION_RESPONSE, getResultTextareaUpdater());
}
async function onTagModifyRequest(_0xe47fbf) {
  await executeTypedLLMRequest(_0xe47fbf, LLMRequestTypes.TAG_MODIFY, eventNames.LLM_TAG_MODIFY_RESPONSE, getResultTextareaUpdater());
}
export function cacheDOMElements() {
  profileSelect = $("#ch-llm_profile_select");
  apiUrlInput = $("#ch-llm_api_url");
  apiKeyInput = $("#ch-llm_api_key");
  modelSelect = $("#ch-llm_model_select");
  modelInput = $("#ch-llm_model_input");
  fetchModelsButton = $("#ch-llm_fetch_models_button");
  temperatureSlider = $("#ch-llm_temperature");
  temperatureValue = $("#ch-llm_temperature_value");
  topPSlider = $("#ch-llm_top_p");
  topPValue = $("#ch-llm_top_p_value");
  maxTokensSlider = $("#ch-llm_max_tokens");
  maxTokensValue = $("#ch-llm_max_tokens_value");
  testContextSelect = $("#ch-test_context_select");
  presetEntriesContainer = $("#ch-preset-entries-container");
  testButton = $("#ch-llm_test_button");
  resultTextarea = $("#ch-llm_test_result");
  combinedPromptTextarea = $("#ch-llm_combined_prompt");
  streamToggle = $("#ch-llm_stream");
  bypassProxyToggle = $("#ch-llm_bypass_proxy");
  historyDepthSlider = $("#ch-llm_history_depth");
  historyDepthValue = $("#ch-llm_history_depth_value");
  imageGenApiSelect = $("#ch-llm_image_gen_api_select");
  imageGenContextSelect = $("#ch-llm_image_gen_context_select");
  charDesignApiSelect = $("#ch-llm_char_design_api_select");
  charDesignContextSelect = $("#ch-llm_char_design_context_select");
  charDisplayApiSelect = $("#ch-llm_char_display_api_select");
  charDisplayContextSelect = $("#ch-llm_char_display_context_select");
  charModifyApiSelect = $("#ch-llm_char_modify_api_select");
  charModifyContextSelect = $("#ch-llm_char_modify_context_select");
  translationApiSelect = $("#ch-llm_translation_api_select");
  translationContextSelect = $("#ch-llm_translation_context_select");
  tagModifyApiSelect = $("#ch-llm_tag_modify_api_select");
  tagModifyContextSelect = $("#ch-llm_tag_modify_context_select");
}
export function bindUIEvents() {
  $("#ch-new_llm_profile_button").on("click", onNewProfileClick);
  $("#ch-save_llm_profile_button").on("click", onSaveProfileClick);
  $("#ch-rename_llm_profile_button").on("click", onRenameLLMProfileClick);
  $("#ch-delete_llm_profile_button").on("click", onDeleteProfileClick);
  $("#ch-import_llm_profile_button").on("click", onImportProfileClick);
  $("#ch-export_llm_profile_button").on("click", onExportProfileClick);
  profileSelect.on("change", onProfileSelectChange);
  $("#ch-new_test_context_button").on("click", onNewTestContextClick);
  $("#ch-save_test_context_button").on("click", onSaveTestContextClick);
  $("#ch-rename_test_context_button").on("click", onRenameTestContextClick);
  $("#ch-delete_test_context_button").on("click", onDeleteTestContextClick);
  $("#ch-import_test_context_button").on("click", onImportTestContextClick);
  $("#ch-export_test_context_button").on("click", onExportTestContextClick);
  $("#ch-export_all_test_context_button").on("click", onExportAllTestContextClick);
  testContextSelect.on("change", onTestContextSelectChange);
  $("#ch-add_preset_entry_button").on("click", addNewPresetEntry);
  bindDragEvents();
  bindEntryEvents();
  fetchModelsButton.on("click", onFetchModelsClick);
  testButton.on("click", onTestLLMClick);
  let _0x3eaf6a = null;
  function _0x1d9767() {
    if (_0x3eaf6a) {
      clearTimeout(_0x3eaf6a);
    }
    _0x3eaf6a = setTimeout(() => {
      const _0x299f26 = profileSelect.val();
      if (_0x299f26 && extension_settings[extensionName].llm_profiles[_0x299f26]) {
        extension_settings[extensionName].llm_profiles[_0x299f26] = collectProfileDataFromUI();
        saveSettingsDebounced();
        console.log("st-chatu8: 配置已自动保存 \"" + _0x299f26 + "\"");
      }
    }, 800);
  }
  apiUrlInput.on("input", _0x1d9767);
  apiKeyInput.on("input", _0x1d9767);
  modelInput.on("input", _0x1d9767);
  streamToggle.on("change", _0x1d9767);
  bypassProxyToggle.on("change", _0x1d9767);
  modelSelect.on("change", function () {
    const _0x1a5119 = $(this).val();
    if (_0x1a5119) {
      modelInput.val(_0x1a5119);
    }
    _0x1d9767();
  });
  temperatureSlider.on("input", () => {
    temperatureValue.val(temperatureSlider.val());
    _0x1d9767();
  });
  temperatureValue.on("input", () => {
    temperatureSlider.val(temperatureValue.val());
    _0x1d9767();
  });
  topPSlider.on("input", () => {
    topPValue.val(topPSlider.val());
    _0x1d9767();
  });
  topPValue.on("input", () => {
    topPSlider.val(topPValue.val());
    _0x1d9767();
  });
  maxTokensSlider.on("input", () => {
    maxTokensValue.val(maxTokensSlider.val());
    _0x1d9767();
  });
  maxTokensValue.on("input", () => {
    maxTokensSlider.val(maxTokensValue.val());
    _0x1d9767();
  });
  historyDepthSlider.on("input", () => {
    historyDepthValue.val(historyDepthSlider.val());
    extension_settings[extensionName].llm_history_depth = parseInt(historyDepthSlider.val(), 10);
    saveSettingsDebounced();
  });
  historyDepthValue.on("input", () => {
    historyDepthSlider.val(historyDepthValue.val());
    extension_settings[extensionName].llm_history_depth = parseInt(historyDepthValue.val(), 10);
    saveSettingsDebounced();
  });
  populateRequestTypeSelects();
  bindRequestTypeSelectEvents();
  bypassProxyToggle.on("change", function () {
    if ($(this).prop("checked")) {
      toastr.warning("开启此选项后，将直接通过浏览器请求 API，可能存在跨域(CORS)问题。<br><br>此功能仅用于解决酒馆同时请求导致的 bug，请确保你的 API 服务器已配置 CORS 或部署在同域下。", "跨域警告", {
        timeOut: 8000,
        closeButton: true,
        escapeHtml: false
      });
    }
  });
}
export function registerEventListeners() {
  eventSource.on(eventNames.LLM_GET_PROMPT_REQUEST, onGetPromptRequest);
  eventSource.on(eventNames.LLM_EXECUTE_REQUEST, onExecuteRequest);
  eventSource.on(eventNames.LLM_IMAGE_GEN_REQUEST, onImageGenRequest);
  eventSource.on(eventNames.LLM_CHAR_DESIGN_REQUEST, onCharDesignRequest);
  eventSource.on(eventNames.LLM_CHAR_DISPLAY_REQUEST, onCharDisplayRequest);
  eventSource.on(eventNames.LLM_CHAR_MODIFY_REQUEST, onCharModifyRequest);
  eventSource.on(eventNames.LLM_TRANSLATION_REQUEST, onTranslationRequest);
  eventSource.on(eventNames.LLM_TAG_MODIFY_REQUEST, onTagModifyRequest);
  eventSource.on(eventNames.LLM_IMAGE_GEN_GET_PROMPT_REQUEST, onImageGenGetPromptRequest);
  eventSource.on(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_REQUEST, onCharDesignGetPromptRequest);
  eventSource.on(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_REQUEST, onCharDisplayGetPromptRequest);
  eventSource.on(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_REQUEST, onCharModifyGetPromptRequest);
  eventSource.on(eventNames.LLM_TRANSLATION_GET_PROMPT_REQUEST, onTranslationGetPromptRequest);
  eventSource.on(eventNames.LLM_TAG_MODIFY_GET_PROMPT_REQUEST, onTagModifyGetPromptRequest);
}
export function loadInitialData() {
  loadLLMProfiles();
  loadTestContextProfiles();
  const _0xa72ae8 = extension_settings[extensionName].llm_history_depth ?? 0;
  historyDepthSlider.val(_0xa72ae8);
  historyDepthValue.val(_0xa72ae8);
}