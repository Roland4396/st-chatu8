import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced, eventSource } from "../../../../../../script.js";
import { extensionName, eventNames } from "../config.js";
import { recordGesture, initGestureMonitor, stopGestureMonitor } from "./Drawing.js";
import { initClickTriggerMonitor, stopClickTriggerMonitor } from "./ClickTrigger.js";
import { addLog, clearLog } from "../utils.js";
import { debugLog, debugBranch, debugTimer, debugContent } from "../debugLogger.js";
const REGEX_TIMEOUT_MS = 1000;
let sharedRegexWorker = null;
let sharedRegexWorkerUrl = null;
let regexRequestIdCounter = 0;
const pendingRegexRequests = new Map();
const REGEX_WORKER_CODE = "\n    self.onmessage = function(e) {\n        const { requestId, operation, text, pattern, flags, replacement } = e.data;\n        // 发送 ready 信号，通知主线程开始计时\n        self.postMessage({ requestId, ready: true });\n        try {\n            const regex = new RegExp(pattern, flags);\n            let result;\n            switch(operation) {\n                case 'test':\n                    result = regex.test(text);\n                    break;\n                case 'match':\n                    // 保留 index 和 input 属性，避免序列化丢失\n                    const m = text.match(regex);\n                    if (m) {\n                        result = {\n                            matches: Array.from(m),\n                            index: m.index,\n                            input: m.input\n                        };\n                    } else {\n                        result = null;\n                    }\n                    break;\n                case 'replace':\n                    result = text.replace(regex, replacement);\n                    break;\n                case 'matchAll':\n                    result = [...text.matchAll(regex)].map(m => ({\n                        match: m[0],\n                        index: m.index,\n                        groups: m.groups || null\n                    }));\n                    break;\n                default:\n                    throw new Error('Unknown operation: ' + operation);\n            }\n            self.postMessage({ requestId, success: true, result });\n        } catch (err) {\n            self.postMessage({ requestId, success: false, error: err.message });\n        }\n    };\n";
function getSharedRegexWorker() {
  if (!sharedRegexWorker) {
    const _0x3a1b93 = new Blob([REGEX_WORKER_CODE], {
      type: "application/javascript"
    });
    sharedRegexWorkerUrl = URL.createObjectURL(_0x3a1b93);
    sharedRegexWorker = new Worker(sharedRegexWorkerUrl);
    sharedRegexWorker.onmessage = _0x2f5979 => {
      const {
        requestId: _0x28e47c,
        ready: _0x562b56,
        success: _0x1fc4e5,
        result: _0x460e82,
        error: _0x42e651
      } = _0x2f5979.data;
      const _0x57f7b7 = pendingRegexRequests.get(_0x28e47c);
      if (!_0x57f7b7) {
        return;
      }
      if (_0x562b56) {
        const _0xff2ee7 = setTimeout(() => {
          const _0x1561bf = pendingRegexRequests.get(_0x28e47c);
          if (_0x1561bf) {
            pendingRegexRequests.delete(_0x28e47c);
            const _0x113303 = {
              success: false,
              error: "正则执行超时 (>" + REGEX_TIMEOUT_MS + "ms)",
              timeout: true
            };
            _0x1561bf.resolve(_0x113303);
          }
          destroySharedRegexWorker();
        }, REGEX_TIMEOUT_MS);
        _0x57f7b7.timeoutId = _0xff2ee7;
        return;
      }
      if (_0x57f7b7.timeoutId) {
        clearTimeout(_0x57f7b7.timeoutId);
      }
      pendingRegexRequests.delete(_0x28e47c);
      const _0x5d6407 = {
        success: _0x1fc4e5,
        result: _0x460e82,
        error: _0x42e651
      };
      _0x57f7b7.resolve(_0x5d6407);
    };
    sharedRegexWorker.onerror = _0x38b2b8 => {
      for (const [_0x10e7d1, _0x5b2641] of pendingRegexRequests) {
        if (_0x5b2641.timeoutId) {
          clearTimeout(_0x5b2641.timeoutId);
        }
        const _0x3ff091 = {
          success: false,
          error: _0x38b2b8.message || "Worker error"
        };
        _0x5b2641.resolve(_0x3ff091);
      }
      pendingRegexRequests.clear();
      destroySharedRegexWorker();
    };
  }
  return sharedRegexWorker;
}
function destroySharedRegexWorker() {
  if (sharedRegexWorker) {
    sharedRegexWorker.terminate();
    sharedRegexWorker = null;
  }
  if (sharedRegexWorkerUrl) {
    URL.revokeObjectURL(sharedRegexWorkerUrl);
    sharedRegexWorkerUrl = null;
  }
}
function executeRegexWithTimeout(_0x13b436, _0x5d6b97, _0x860883, _0x316142, _0x11a25e = "") {
  return new Promise(_0xd9f39b => {
    const _0x3bff86 = ++regexRequestIdCounter;
    const _0x4ca33a = getSharedRegexWorker();
    const _0x1cd09a = {
      resolve: _0xd9f39b,
      timeoutId: null
    };
    pendingRegexRequests.set(_0x3bff86, _0x1cd09a);
    const _0x2733a7 = {
      requestId: _0x3bff86,
      operation: _0x13b436,
      text: _0x5d6b97,
      pattern: _0x860883,
      flags: _0x316142,
      replacement: _0x11a25e
    };
    _0x4ca33a.postMessage(_0x2733a7);
  });
}
function executeRegexWithWarning(_0x34f121, _0x561076 = "未知正则") {
  const _0xd7db37 = performance.now();
  try {
    const _0xfe78b2 = _0x34f121();
    const _0x33131c = performance.now() - _0xd7db37;
    if (_0x33131c > REGEX_TIMEOUT_MS) {
      console.warn("[st-chatu8] 正则执行时间过长 (" + _0x33131c.toFixed(2) + "ms): " + _0x561076);
      debugLog("regex.timeout", "正则执行慢: " + _0x561076, {
        耗时: _0x33131c.toFixed(2) + "ms"
      });
    }
    return _0xfe78b2;
  } catch (_0x381816) {
    throw _0x381816;
  }
}
let profileSelect;
let beforeAfterEditor;
let textEditor;
let originalText;
let resultText;
let regexTestModeSwitch;
let gestureEnabledSwitch;
let clickTriggerEnabledSwitch;
let gestureShowRecognitionSwitch;
let gestureShowTrailSwitch;
let gestureTrailColorPicker;
let gestureMatchThresholdSlider;
let gestureMatchThresholdValue;
let imageGenDemandEnabledSwitch;
let defaultCharDemandTextarea;
let defaultImageDemandTextarea;
let regexEntriesContainer;
let regexEntryIdCounter = 0;
let currentEditingRegexEntry = null;
const DEFAULT_REGEX_ENTRY = {
  id: "",
  scriptName: "新建正则",
  disabled: false,
  runOnEdit: true,
  findRegex: "",
  replaceString: "",
  trimStrings: [],
  placement: [2],
  substituteRegex: 0,
  minDepth: null,
  maxDepth: null,
  markdownOnly: true,
  promptOnly: false
};
function generateRegexEntryId() {
  return "regex_entry_" + Date.now() + "_" + ++regexEntryIdCounter;
}
function createNewRegexEntry() {
  return {
    ...DEFAULT_REGEX_ENTRY,
    id: generateRegexEntryId()
  };
}
function parseSTRegexFormat(_0xf563e5) {
  if (!_0xf563e5 || typeof _0xf563e5 !== "object") {
    return null;
  }
  if (typeof _0xf563e5.findRegex !== "string") {
    return null;
  }
  return {
    id: _0xf563e5.id || generateRegexEntryId(),
    scriptName: _0xf563e5.scriptName || "导入的正则",
    disabled: _0xf563e5.disabled === true,
    runOnEdit: _0xf563e5.runOnEdit !== false,
    findRegex: _0xf563e5.findRegex || "",
    replaceString: _0xf563e5.replaceString || "",
    trimStrings: Array.isArray(_0xf563e5.trimStrings) ? _0xf563e5.trimStrings : [],
    placement: Array.isArray(_0xf563e5.placement) ? _0xf563e5.placement : [2],
    substituteRegex: typeof _0xf563e5.substituteRegex === "number" ? _0xf563e5.substituteRegex : 0,
    minDepth: _0xf563e5.minDepth ?? null,
    maxDepth: _0xf563e5.maxDepth ?? null,
    markdownOnly: _0xf563e5.markdownOnly !== false,
    promptOnly: _0xf563e5.promptOnly === true
  };
}
function exportToSTRegexFormat(_0x1d3e48) {
  return {
    id: _0x1d3e48.id || generateRegexEntryId(),
    scriptName: _0x1d3e48.scriptName || "未命名正则",
    disabled: _0x1d3e48.disabled === true,
    runOnEdit: _0x1d3e48.runOnEdit !== false,
    findRegex: _0x1d3e48.findRegex || "",
    replaceString: _0x1d3e48.replaceString || "",
    trimStrings: Array.isArray(_0x1d3e48.trimStrings) ? _0x1d3e48.trimStrings : [],
    placement: Array.isArray(_0x1d3e48.placement) ? _0x1d3e48.placement : [2],
    substituteRegex: typeof _0x1d3e48.substituteRegex === "number" ? _0x1d3e48.substituteRegex : 0,
    minDepth: _0x1d3e48.minDepth ?? null,
    maxDepth: _0x1d3e48.maxDepth ?? null,
    markdownOnly: _0x1d3e48.markdownOnly !== false,
    promptOnly: _0x1d3e48.promptOnly === true
  };
}
function validateRegexEntry(_0x272218) {
  if (!_0x272218 || typeof _0x272218 !== "object") {
    return false;
  }
  if (typeof _0x272218.findRegex !== "string") {
    return false;
  }
  if (typeof _0x272218.scriptName !== "string") {
    return false;
  }
  return true;
}
function getRegexEntryEditModalHTML() {
  return "\n        <div class=\"st-chatu8-entry-edit-modal-backdrop\" id=\"ch-regex-entry-edit-modal\">\n            <div class=\"st-chatu8-entry-edit-modal\">\n                <div class=\"st-chatu8-entry-edit-modal-header\">\n                    <h4>编辑正则条目</h4>\n                    <span class=\"st-chatu8-entry-edit-modal-close\">&times;</span>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-body\">\n                    <div class=\"st-chatu8-modal-field\">\n                        <label>脚本名称</label>\n                        <input type=\"text\" id=\"ch-regex-modal-script-name\" class=\"st-chatu8-text-input\" placeholder=\"脚本名称\" />\n                    </div>\n                    <div class=\"st-chatu8-modal-field st-chatu8-modal-toggle-field\">\n                        <label>启用</label>\n                        <div class=\"st-chatu8-toggle\">\n                            <input id=\"ch-regex-modal-enabled\" type=\"checkbox\" checked />\n                            <span class=\"st-chatu8-slider\"></span>\n                        </div>\n                    </div>\n                    <div class=\"st-chatu8-modal-field\">\n                        <label>查找正则 (findRegex)</label>\n                        <textarea id=\"ch-regex-modal-find-regex\" class=\"st-chatu8-textarea\" rows=\"4\" placeholder=\"输入正则表达式...\"></textarea>\n                    </div>\n                    <div class=\"st-chatu8-modal-field\">\n                        <label>替换字符串 (replaceString)</label>\n                        <textarea id=\"ch-regex-modal-replace-string\" class=\"st-chatu8-textarea\" rows=\"4\" placeholder=\"输入替换字符串...\"></textarea>\n                    </div>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-footer\">\n                    <button class=\"st-chatu8-btn st-chatu8-modal-cancel-btn\">取消</button>\n                    <button class=\"st-chatu8-btn st-chatu8-btn-primary st-chatu8-modal-save-btn\">保存</button>\n                </div>\n            </div>\n        </div>\n    ";
}
function escapeHtmlForRegex(_0x3bd482) {
  if (!_0x3bd482) {
    return "";
  }
  const _0x1d6902 = document.createElement("div");
  _0x1d6902.textContent = _0x3bd482;
  return _0x1d6902.innerHTML.replace(/"/g, "&quot;");
}
function renderRegexEntries(_0x28c735 = []) {
  const _0x3059a4 = regexEntriesContainer && $.contains(document, regexEntriesContainer[0]);
  if (!_0x3059a4) {
    regexEntriesContainer = $("#ch-regex-entries-container");
    console.log("[st-chatu8] renderRegexEntries: 刷新容器引用");
  }
  if (!regexEntriesContainer || regexEntriesContainer.length === 0) {
    console.warn("[st-chatu8] renderRegexEntries: 容器不存在，无法渲染");
    return;
  }
  regexEntriesContainer.empty();
  if (_0x28c735.length === 0) {
    regexEntriesContainer.html("\n            <div class=\"st-chatu8-entries-empty\">\n                <i class=\"fa-solid fa-inbox\"></i>\n                <p>暂无正则条目，点击上方按钮添加</p>\n            </div>\n        ");
    return;
  }
  _0x28c735.forEach((_0x4f9e2c, _0x3b127e) => {
    addRegexEntryDOM(_0x4f9e2c, _0x3b127e);
  });
  console.log("[st-chatu8] 渲染正则条目:", {
    容器ID: regexEntriesContainer.attr("id"),
    条目数: _0x28c735.length,
    条目名称: _0x28c735.map(_0xc191be => _0xc191be.scriptName || "(无名称)")
  });
}
function addRegexEntryDOM(_0x21847f, _0x4e9d74 = -1) {
  const _0x1c5be1 = regexEntriesContainer && $.contains(document, regexEntriesContainer[0]);
  if (!_0x1c5be1) {
    regexEntriesContainer = $("#ch-regex-entries-container");
    console.log("[st-chatu8] addRegexEntryDOM: 刷新容器引用");
  }
  if (!regexEntriesContainer || regexEntriesContainer.length === 0) {
    console.warn("[st-chatu8] addRegexEntryDOM: 容器不存在，无法添加条目");
    return false;
  }
  const _0x362370 = _0x21847f.id || generateRegexEntryId();
  const _0x2c525c = _0x21847f.scriptName || "正则 " + (_0x4e9d74 + 1);
  const _0x245d21 = _0x21847f.findRegex || "";
  const _0x3227bc = _0x21847f.replaceString || "";
  const _0x5341ae = _0x21847f.disabled === true;
  const _0x3460d6 = _0x5341ae ? "disabled" : "";
  const _0x5bc642 = _0x245d21.length > 40 ? _0x245d21.substring(0, 40) + "..." : _0x245d21 || "(空)";
  const _0x3fb4ea = _0x3227bc.length > 100;
  const _0x4889e0 = _0x3fb4ea ? "<span class=\"st-chatu8-entry-warning\" title=\"替换字符串超过100字符 (" + _0x3227bc.length + "字符)\"><i class=\"fa-solid fa-triangle-exclamation\"></i></span>" : "";
  const _0x42dc2a = detectDangerousRegex(_0x245d21);
  const _0xd8bfed = generateDangerousRegexWarningHTML(_0x42dc2a.warnings);
  const _0x40ee6e = $("\n        <div class=\"st-chatu8-preset-entry st-chatu8-preset-entry-collapsed " + _0x3460d6 + "\" \n             data-entry-id=\"" + _0x362370 + "\" \n             data-find-regex=\"" + escapeHtmlForRegex(_0x245d21) + "\"\n             data-replace-string=\"" + escapeHtmlForRegex(_0x3227bc) + "\"\n             draggable=\"true\">\n            <div class=\"st-chatu8-entry-header\">\n                <span class=\"st-chatu8-entry-drag-handle\" title=\"拖拽排序\">\n                    <i class=\"fa-solid fa-grip-vertical\"></i>\n                </span>\n                <span class=\"st-chatu8-entry-role-badge\" data-role=\"regex\">REG</span>\n                <input type=\"text\" class=\"st-chatu8-entry-name\" value=\"" + escapeHtmlForRegex(_0x2c525c) + "\" placeholder=\"脚本名称\" readonly />\n                " + _0xd8bfed + "\n                " + _0x4889e0 + "\n                <span class=\"st-chatu8-entry-preview\">" + escapeHtmlForRegex(_0x5bc642) + "</span>\n                <div class=\"st-chatu8-entry-actions\">\n                    <div class=\"st-chatu8-entry-toggle\" title=\"启用/禁用\">\n                        <input type=\"checkbox\" " + (!_0x5341ae ? "checked" : "") + " />\n                        <span class=\"st-chatu8-slider\"></span>\n                    </div>\n                    <button class=\"st-chatu8-icon-btn st-chatu8-entry-edit\" title=\"编辑\">\n                        <i class=\"fa-solid fa-pen\"></i>\n                    </button>\n                    <button class=\"st-chatu8-icon-btn st-chatu8-entry-export\" title=\"导出\">\n                        <i class=\"fa-solid fa-file-export\"></i>\n                    </button>\n                    <button class=\"st-chatu8-icon-btn danger st-chatu8-entry-delete\" title=\"删除条目\">\n                        <i class=\"fa-solid fa-trash\"></i>\n                    </button>\n                </div>\n            </div>\n        </div>\n    ");
  _0x40ee6e.data("entryData", _0x21847f);
  regexEntriesContainer.append(_0x40ee6e);
}
function showRegexEntryEditModal(_0x25cafb) {
  currentEditingRegexEntry = _0x25cafb;
  let _0x5b7db5 = $("#ch-regex-entry-edit-modal");
  if (!_0x5b7db5.length) {
    $("body").append(getRegexEntryEditModalHTML());
    _0x5b7db5 = $("#ch-regex-entry-edit-modal");
    _0x5b7db5.find(".st-chatu8-entry-edit-modal-close").on("click", closeRegexEntryEditModal);
    _0x5b7db5.find(".st-chatu8-modal-cancel-btn").on("click", closeRegexEntryEditModal);
    _0x5b7db5.find(".st-chatu8-modal-save-btn").on("click", saveRegexEntryFromModal);
  }
  const _0x498274 = _0x25cafb.data("entryData") || {};
  _0x5b7db5.find("#ch-regex-modal-script-name").val(_0x498274.scriptName || _0x25cafb.find(".st-chatu8-entry-name").val());
  _0x5b7db5.find("#ch-regex-modal-enabled").prop("checked", !_0x25cafb.hasClass("disabled"));
  _0x5b7db5.find("#ch-regex-modal-find-regex").val(_0x498274.findRegex || "");
  _0x5b7db5.find("#ch-regex-modal-replace-string").val(_0x498274.replaceString || "");
  _0x5b7db5.fadeIn(200);
}
function closeRegexEntryEditModal() {
  const _0x32b791 = $("#ch-regex-entry-edit-modal");
  _0x32b791.fadeOut(200);
  currentEditingRegexEntry = null;
}
function saveRegexEntryFromModal() {
  if (!currentEditingRegexEntry) {
    closeRegexEntryEditModal();
    return;
  }
  const _0x5bb5ff = $("#ch-regex-entry-edit-modal");
  const _0x181437 = currentEditingRegexEntry;
  const _0x46a50c = _0x5bb5ff.find("#ch-regex-modal-script-name").val() || "未命名正则";
  const _0x1e8dee = _0x5bb5ff.find("#ch-regex-modal-enabled").is(":checked");
  const _0x59ce44 = _0x5bb5ff.find("#ch-regex-modal-find-regex").val() || "";
  const _0x1b6896 = _0x5bb5ff.find("#ch-regex-modal-replace-string").val() || "";
  const _0x56bd86 = _0x181437.data("entryData") || {};
  _0x56bd86.scriptName = _0x46a50c;
  _0x56bd86.disabled = !_0x1e8dee;
  _0x56bd86.findRegex = _0x59ce44;
  _0x56bd86.replaceString = _0x1b6896;
  _0x181437.find(".st-chatu8-entry-name").val(_0x46a50c);
  _0x181437.attr("data-find-regex", _0x59ce44);
  _0x181437.attr("data-replace-string", _0x1b6896);
  _0x181437.find(".st-chatu8-entry-toggle input").prop("checked", _0x1e8dee);
  if (_0x1e8dee) {
    _0x181437.removeClass("disabled");
  } else {
    _0x181437.addClass("disabled");
  }
  const _0x9d1ba5 = _0x59ce44.length > 40 ? _0x59ce44.substring(0, 40) + "..." : _0x59ce44 || "(空)";
  _0x181437.find(".st-chatu8-entry-preview").text(_0x9d1ba5);
  const _0x41bd49 = _0x1b6896.length > 100;
  _0x181437.find(".st-chatu8-entry-warning").remove();
  _0x181437.find(".st-chatu8-entry-danger-warning").remove();
  const _0x156e2d = detectDangerousRegex(_0x59ce44);
  if (_0x156e2d.isDangerous) {
    const _0x4a223f = generateDangerousRegexWarningHTML(_0x156e2d.warnings);
    _0x181437.find(".st-chatu8-entry-name").after(_0x4a223f);
  }
  if (_0x41bd49) {
    const _0x411144 = "<span class=\"st-chatu8-entry-warning\" title=\"替换字符串超过100字符 (" + _0x1b6896.length + "字符)\"><i class=\"fa-solid fa-triangle-exclamation\"></i></span>";
    const _0x41b455 = _0x181437.find(".st-chatu8-entry-danger-warning");
    if (_0x41b455.length) {
      _0x41b455.after(_0x411144);
    } else {
      _0x181437.find(".st-chatu8-entry-name").after(_0x411144);
    }
  }
  _0x181437.data("entryData", _0x56bd86);
  if (_0x156e2d.isDangerous) {
    const _0x52a95b = _0x156e2d.warnings.map(_0x1e310e => "<b>" + _0x1e310e.name + "</b>: " + _0x1e310e.description).join("<br>");
    toastr.error(_0x52a95b, "⚠️ 危险正则警告 - 可能导致浏览器卡顿", {
      timeOut: 10000,
      extendedTimeOut: 5000,
      escapeHtml: false,
      closeButton: true
    });
    toastr.info("正则条目已保存，但请注意性能风险");
  } else {
    toastr.success("正则条目已更新");
  }
  closeRegexEntryEditModal();
  saveRegexEntriesToProfile();
}
function addNewRegexEntry() {
  const _0x2c37cb = regexEntriesContainer && $.contains(document, regexEntriesContainer[0]);
  if (!_0x2c37cb) {
    regexEntriesContainer = $("#ch-regex-entries-container");
  }
  if (regexEntriesContainer && regexEntriesContainer.length > 0) {
    regexEntriesContainer.find(".st-chatu8-entries-empty").remove();
  }
  const _0x45f8bb = createNewRegexEntry();
  addRegexEntryDOM(_0x45f8bb);
  if (regexEntriesContainer && regexEntriesContainer[0]) {
    const _0x9650ae = regexEntriesContainer[0];
    _0x9650ae.scrollTop = _0x9650ae.scrollHeight;
  }
  const _0x366042 = regexEntriesContainer.find(".st-chatu8-preset-entry").last();
  showRegexEntryEditModal(_0x366042);
}
function deleteRegexEntry(_0x891405) {
  _0x891405.remove();
  toastr.info("已删除正则条目");
  const _0x495018 = regexEntriesContainer && $.contains(document, regexEntriesContainer[0]);
  if (!_0x495018) {
    regexEntriesContainer = $("#ch-regex-entries-container");
  }
  if (!regexEntriesContainer || regexEntriesContainer.length === 0) {
    return;
  }
  const _0x573657 = regexEntriesContainer.find(".st-chatu8-preset-entry");
  if (_0x573657.length === 0) {
    regexEntriesContainer.html("\n            <div class=\"st-chatu8-entries-empty\">\n                <i class=\"fa-solid fa-inbox\"></i>\n                <p>暂无正则条目，点击上方按钮添加</p>\n            </div>\n        ");
  }
  saveRegexEntriesToProfile();
}
function toggleRegexEntry(_0x589c1c, _0x246d69) {
  const _0x17a620 = _0x589c1c.data("entryData") || {};
  _0x17a620.disabled = !_0x246d69;
  _0x589c1c.data("entryData", _0x17a620);
  if (_0x246d69) {
    _0x589c1c.removeClass("disabled");
  } else {
    _0x589c1c.addClass("disabled");
  }
  saveRegexEntriesToProfile();
}
function exportRegexEntry(_0x37b5e4) {
  const _0x57cfe5 = _0x37b5e4.data("entryData");
  if (!_0x57cfe5) {
    toastr.warning("无法导出：条目数据不存在");
    return;
  }
  const _0x460214 = exportToSTRegexFormat(_0x57cfe5);
  const _0x271a00 = _0x57cfe5.scriptName || "未命名正则";
  const _0xa9d17a = _0x271a00.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_");
  const _0x4e65e4 = new Blob([JSON.stringify(_0x460214, null, 4)], {
    type: "application/json"
  });
  const _0x7ee4b6 = URL.createObjectURL(_0x4e65e4);
  const _0x113329 = document.createElement("a");
  _0x113329.href = _0x7ee4b6;
  _0x113329.download = "st_regex_" + _0xa9d17a + ".json";
  document.body.appendChild(_0x113329);
  _0x113329.click();
  document.body.removeChild(_0x113329);
  URL.revokeObjectURL(_0x7ee4b6);
  toastr.success("已导出正则条目: " + _0x271a00);
}
function importRegexEntries() {
  const _0x1f8e95 = document.createElement("input");
  _0x1f8e95.type = "file";
  _0x1f8e95.accept = ".json";
  _0x1f8e95.multiple = true;
  _0x1f8e95.onchange = async _0x4beb27 => {
    const _0x1a173c = _0x4beb27.target.files;
    if (!_0x1a173c || _0x1a173c.length === 0) {
      return;
    }
    let _0x93410e = 0;
    const _0x5d62a3 = [];
    for (const _0x218451 of _0x1a173c) {
      const _0x2ec5d9 = new Promise(_0x52fb66 => {
        const _0x177b49 = new FileReader();
        _0x177b49.onload = _0x22e8cc => {
          try {
            const _0x18fb11 = JSON.parse(_0x22e8cc.target.result);
            const _0x2bb170 = parseSTRegexFormat(_0x18fb11);
            if (_0x2bb170 && validateRegexEntry(_0x2bb170)) {
              regexEntriesContainer.find(".st-chatu8-entries-empty").remove();
              addRegexEntryDOM(_0x2bb170);
              _0x93410e++;
            }
          } catch (_0xd6c207) {
            console.warn("解析文件 " + _0x218451.name + " 失败:", _0xd6c207);
          }
          _0x52fb66();
        };
        _0x177b49.onerror = () => _0x52fb66();
        _0x177b49.readAsText(_0x218451);
      });
      _0x5d62a3.push(_0x2ec5d9);
    }
    await Promise.all(_0x5d62a3);
    if (_0x93410e > 0) {
      saveRegexEntriesToProfile();
      toastr.success("成功导入 " + _0x93410e + " 个正则条目");
    } else {
      toastr.warning("没有有效的正则条目可导入");
    }
  };
  _0x1f8e95.click();
}
async function importRegexEntriesFromEngine() {
  let _0x20ba59;
  try {
    _0x20ba59 = await import("../../../../../extensions/regex/engine.js");
  } catch (_0x99e0db) {
    console.error("无法加载正则引擎模块:", _0x99e0db);
    toastr.error("无法加载ST正则引擎模块，请确保正则扩展已启用");
    return;
  }
  try {
    if (typeof _0x20ba59.getScriptsByType !== "function") {
      toastr.error("ST正则引擎版本过旧，缺少 getScriptsByType 函数。\n请更新 SillyTavern 到最新版本。");
      console.warn("regexEngine 对象缺少 getScriptsByType 函数。可用的导出:", Object.keys(_0x20ba59));
      return;
    }
    if (!_0x20ba59.SCRIPT_TYPES) {
      toastr.error("ST正则引擎版本过旧，缺少 SCRIPT_TYPES 常量。\n请更新 SillyTavern 到最新版本。");
      console.warn("regexEngine 对象缺少 SCRIPT_TYPES 常量。可用的导出:", Object.keys(_0x20ba59));
      return;
    }
    const _0x5d416d = _0x20ba59.getScriptsByType(_0x20ba59.SCRIPT_TYPES.GLOBAL) || [];
    const _0x103460 = _0x20ba59.getScriptsByType(_0x20ba59.SCRIPT_TYPES.SCOPED) || [];
    const _0x5a5876 = _0x20ba59.getScriptsByType(_0x20ba59.SCRIPT_TYPES.PRESET) || [];
    const _0x5d6bae = _0x2e0f3d => _0x2e0f3d.filter(_0x1d79d1 => {
      if (_0x1d79d1.disabled) {
        return false;
      }
      if (!_0x1d79d1.findRegex) {
        return false;
      }
      const _0x4a5b53 = _0x1d79d1.minDepth === 0 || _0x1d79d1.minDepth === null || _0x1d79d1.minDepth === undefined;
      const _0x51a6aa = _0x1d79d1.markdownOnly === true;
      const _0x59df5f = Array.isArray(_0x1d79d1.placement) && _0x1d79d1.placement.includes(2);
      return _0x4a5b53 && _0x51a6aa && _0x59df5f;
    });
    const _0xa45e23 = {
      global: _0x5d6bae(_0x5d416d),
      scoped: _0x5d6bae(_0x103460),
      preset: _0x5d6bae(_0x5a5876)
    };
    const _0x93a83e = _0xa45e23.global.length + _0xa45e23.scoped.length + _0xa45e23.preset.length;
    if (_0x93a83e === 0) {
      toastr.warning("没有符合条件的正则脚本可导入。\n条件: 未禁用, minDepth=0或null, markdownOnly=true, placement包含2");
      return;
    }
    const _0x2ea185 = await showRegexEntrySelectionDialog(_0xa45e23);
    if (_0x2ea185.length > 0) {
      regexEntriesContainer.find(".st-chatu8-entries-empty").remove();
      _0x2ea185.forEach(_0x40b779 => {
        const _0x54abdd = parseSTRegexFormat(_0x40b779);
        if (_0x54abdd) {
          addRegexEntryDOM(_0x54abdd);
        }
      });
      saveRegexEntriesToProfile();
      toastr.success("成功导入 " + _0x2ea185.length + " 个正则条目");
    } else {
      toastr.info("未选择任何正则脚本");
    }
  } catch (_0x28bedf) {
    console.error("加载正则引擎模块失败:", _0x28bedf);
    toastr.error("加载ST正则引擎模块失败，请确保正则扩展已启用");
  }
}
function getRegexEntryImportModalHTML(_0x50e30d) {
  return "\n        <div class=\"st-chatu8-entry-edit-modal-backdrop\" id=\"ch-regex-entry-import-modal\">\n            <div class=\"st-chatu8-entry-edit-modal\">\n                <div class=\"st-chatu8-entry-edit-modal-header\">\n                    <h4>选择要导入的正则条目</h4>\n                    <span class=\"st-chatu8-entry-edit-modal-close\">&times;</span>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-body\">\n                    <div class=\"st-chatu8-modal-field st-chatu8-import-toolbar\">\n                        <button type=\"button\" class=\"st-chatu8-btn\" id=\"st-regex-entry-select-all\">\n                            <i class=\"fa-solid fa-check-double\"></i> 全选\n                        </button>\n                        <button type=\"button\" class=\"st-chatu8-btn\" id=\"st-regex-entry-deselect-all\">\n                            <i class=\"fa-solid fa-xmark\"></i> 取消全选\n                        </button>\n                    </div>\n                    <div class=\"st-chatu8-modal-field st-chatu8-import-list\">\n                        " + _0x50e30d + "\n                    </div>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-footer\">\n                    <button class=\"st-chatu8-btn st-chatu8-modal-cancel-btn\">取消</button>\n                    <button class=\"st-chatu8-btn st-chatu8-btn-primary st-chatu8-modal-save-btn\">\n                        <i class=\"fa-solid fa-file-import\"></i> 导入选中\n                    </button>\n                </div>\n            </div>\n        </div>\n    ";
}
function showRegexEntrySelectionDialog(_0xc6c344) {
  return new Promise(_0x299a29 => {
    const _0x2b6304 = {
      global: "全局正则",
      scoped: "角色正则",
      preset: "预设正则"
    };
    let _0xef35d4 = "";
    for (const [_0x162e30, _0x9299e7] of Object.entries(_0xc6c344)) {
      if (_0x9299e7.length === 0) {
        continue;
      }
      _0xef35d4 += "\n                <div class=\"st-chatu8-import-type-group\">\n                    <h5 class=\"st-chatu8-import-type-header\">" + (_0x2b6304[_0x162e30] || _0x162e30) + " <span class=\"st-chatu8-import-count\">(" + _0x9299e7.length + ")</span></h5>\n            ";
      _0x9299e7.forEach((_0x357d88, _0x400269) => {
        const _0x30f0af = "st-regex-entry-" + _0x162e30 + "-" + _0x400269;
        const _0x141eed = _0x357d88.scriptName || "未命名正则 " + (_0x400269 + 1);
        _0xef35d4 += "\n                    <div class=\"st-chatu8-import-item\">\n                        <label class=\"st-chatu8-import-label\">\n                            <input type=\"checkbox\" class=\"st-chatu8-import-checkbox\" id=\"" + _0x30f0af + "\" \n                                   data-type=\"" + _0x162e30 + "\" data-index=\"" + _0x400269 + "\" checked>\n                            <span class=\"st-chatu8-import-name\">" + escapeHtmlForRegex(_0x141eed) + "</span>\n                        </label>\n                    </div>\n                ";
      });
      _0xef35d4 += "</div>";
    }
    $("#ch-regex-entry-import-modal").remove();
    $("body").append(getRegexEntryImportModalHTML(_0xef35d4));
    const _0x3abd67 = $("#ch-regex-entry-import-modal");
    _0x3abd67.find("#st-regex-entry-select-all").on("click", () => {
      _0x3abd67.find(".st-chatu8-import-checkbox").prop("checked", true);
    });
    _0x3abd67.find("#st-regex-entry-deselect-all").on("click", () => {
      _0x3abd67.find(".st-chatu8-import-checkbox").prop("checked", false);
    });
    _0x3abd67.find(".st-chatu8-modal-save-btn").on("click", () => {
      const _0x45f71b = [];
      _0x3abd67.find(".st-chatu8-import-checkbox:checked").each(function () {
        const _0x31e082 = $(this).data("type");
        const _0x50b5d4 = $(this).data("index");
        const _0x9f514 = _0xc6c344[_0x31e082][_0x50b5d4];
        if (_0x9f514) {
          _0x45f71b.push(_0x9f514);
        }
      });
      _0x3abd67.fadeOut(200, () => _0x3abd67.remove());
      _0x299a29(_0x45f71b);
    });
    _0x3abd67.find(".st-chatu8-modal-cancel-btn, .st-chatu8-entry-edit-modal-close").on("click", () => {
      _0x3abd67.fadeOut(200, () => _0x3abd67.remove());
      _0x299a29([]);
    });
    _0x3abd67.on("click", _0x5c2d3e => {
      if ($(_0x5c2d3e.target).hasClass("st-chatu8-entry-edit-modal-backdrop")) {
        _0x3abd67.fadeOut(200, () => _0x3abd67.remove());
        _0x299a29([]);
      }
    });
    _0x3abd67.fadeIn(200);
  });
}
function collectRegexEntriesFromUI() {
  const _0x2f31ec = [];
  const _0xca2e09 = regexEntriesContainer && $.contains(document, regexEntriesContainer[0]);
  const _0x4e8ce3 = $("#ch-regex-entries-container");
  const _0x350b0c = _0x4e8ce3.find(".st-chatu8-preset-entry").length;
  console.log("[st-chatu8] collectRegexEntriesFromUI 调试:", {
    缓存容器存在: !!regexEntriesContainer,
    缓存容器在文档中: _0xca2e09,
    新选择器找到的容器: _0x4e8ce3.length > 0,
    新选择器找到的条目数: _0x350b0c,
    缓存容器找到的条目数: regexEntriesContainer ? regexEntriesContainer.find(".st-chatu8-preset-entry").length : 0
  });
  const _0x246f0f = _0xca2e09 ? regexEntriesContainer : _0x4e8ce3;
  if (!_0x246f0f || _0x246f0f.length === 0) {
    console.warn("[st-chatu8] 正则条目容器不存在！");
    return _0x2f31ec;
  }
  _0x246f0f.find(".st-chatu8-preset-entry").each(function () {
    const _0x3fadcc = $(this);
    const _0x5c5911 = _0x3fadcc.data("entryData");
    if (_0x5c5911) {
      _0x2f31ec.push(_0x5c5911);
    }
  });
  return _0x2f31ec;
}
function saveRegexEntriesToProfile() {
  const _0x41f07a = profileSelect.val();
  if (!_0x41f07a) {
    return;
  }
  const _0x54d509 = extension_settings[extensionName].regex_profiles;
  if (!_0x54d509[_0x41f07a]) {
    _0x54d509[_0x41f07a] = {};
  }
  _0x54d509[_0x41f07a].regexEntries = collectRegexEntriesFromUI();
  saveSettingsDebounced();
}
function loadRegexEntriesFromProfile() {
  const _0x1e1006 = profileSelect.val();
  if (!_0x1e1006) {
    return;
  }
  const _0x51ce5b = extension_settings[extensionName].regex_profiles;
  const _0x4d77c0 = _0x51ce5b[_0x1e1006];
  const _0x3d2194 = {
    配置名称: _0x1e1006,
    配置是否存在: !!_0x4d77c0,
    条目数量: _0x4d77c0?.regexEntries?.length || 0
  };
  console.log("[st-chatu8] 加载正则配置:", _0x3d2194);
  if (_0x4d77c0 && Array.isArray(_0x4d77c0.regexEntries)) {
    renderRegexEntries(_0x4d77c0.regexEntries);
  } else {
    renderRegexEntries([]);
  }
}
function bindRegexEntryDragEvents() {
  if (!regexEntriesContainer) {
    return;
  }
  let _0x43a07c = null;
  let _0x24b8ad = null;
  const _0x158666 = 8;
  const _0x5d05a6 = 50;
  function _0x4a50be() {
    if (_0x24b8ad) {
      clearInterval(_0x24b8ad);
      _0x24b8ad = null;
    }
  }
  function _0xcd0d92(_0x486fd0) {
    const _0x1d6865 = regexEntriesContainer[0];
    if (!_0x1d6865) {
      return;
    }
    const _0x5da20a = _0x1d6865.getBoundingClientRect();
    const _0xc352be = _0x5da20a.top;
    const _0x15dd5c = _0x5da20a.bottom;
    _0x4a50be();
    if (_0x486fd0 < _0xc352be + _0x5d05a6 && _0x486fd0 >= _0xc352be) {
      _0x24b8ad = setInterval(() => {
        _0x1d6865.scrollTop -= _0x158666;
      }, 16);
    } else if (_0x486fd0 > _0x15dd5c - _0x5d05a6 && _0x486fd0 <= _0x15dd5c) {
      _0x24b8ad = setInterval(() => {
        _0x1d6865.scrollTop += _0x158666;
      }, 16);
    }
  }
  regexEntriesContainer.on("dragstart", ".st-chatu8-preset-entry", function (_0x2081ec) {
    _0x43a07c = this;
    $(this).addClass("dragging");
    _0x2081ec.originalEvent.dataTransfer.effectAllowed = "move";
  });
  regexEntriesContainer.on("dragend", ".st-chatu8-preset-entry", function () {
    $(this).removeClass("dragging");
    regexEntriesContainer.find(".st-chatu8-preset-entry").removeClass("drag-over");
    _0x43a07c = null;
    _0x4a50be();
  });
  regexEntriesContainer.on("dragover", ".st-chatu8-preset-entry", function (_0x5a4856) {
    _0x5a4856.preventDefault();
    _0x5a4856.originalEvent.dataTransfer.dropEffect = "move";
    if (this !== _0x43a07c) {
      regexEntriesContainer.find(".st-chatu8-preset-entry").removeClass("drag-over");
      $(this).addClass("drag-over");
    }
    _0xcd0d92(_0x5a4856.originalEvent.clientY);
  });
  regexEntriesContainer.on("dragover", function (_0x5ca7aa) {
    if (_0x43a07c) {
      _0x5ca7aa.preventDefault();
      _0xcd0d92(_0x5ca7aa.originalEvent.clientY);
    }
  });
  regexEntriesContainer.on("drop", ".st-chatu8-preset-entry", function (_0x278d0a) {
    _0x278d0a.preventDefault();
    _0x4a50be();
    if (this !== _0x43a07c && _0x43a07c) {
      const _0x2c9c48 = $(this);
      const _0x543a4e = $(_0x43a07c);
      const _0x57fd83 = this.getBoundingClientRect();
      const _0x27d67f = _0x278d0a.originalEvent.clientY;
      const _0x56dbad = _0x27d67f > _0x57fd83.top + _0x57fd83.height / 2;
      if (_0x56dbad) {
        _0x2c9c48.after(_0x543a4e);
      } else {
        _0x2c9c48.before(_0x543a4e);
      }
      saveRegexEntriesToProfile();
    }
    regexEntriesContainer.find(".st-chatu8-preset-entry").removeClass("drag-over");
  });
  regexEntriesContainer.on("dragleave", function (_0x2039d8) {
    const _0x57473e = this.getBoundingClientRect();
    const _0x3c0d75 = _0x2039d8.originalEvent.clientX;
    const _0x2cdf6e = _0x2039d8.originalEvent.clientY;
    if (_0x3c0d75 < _0x57473e.left || _0x3c0d75 > _0x57473e.right || _0x2cdf6e < _0x57473e.top || _0x2cdf6e > _0x57473e.bottom) {
      _0x4a50be();
    }
  });
}
function bindRegexEntryEvents() {
  if (!regexEntriesContainer) {
    return;
  }
  regexEntriesContainer.on("click", ".st-chatu8-entry-edit", function (_0x3efe61) {
    _0x3efe61.stopPropagation();
    const _0x4177a2 = $(this).closest(".st-chatu8-preset-entry");
    showRegexEntryEditModal(_0x4177a2);
  });
  regexEntriesContainer.on("change", ".st-chatu8-entry-toggle input", function () {
    const _0x5b00bc = $(this).closest(".st-chatu8-preset-entry");
    toggleRegexEntry(_0x5b00bc, $(this).is(":checked"));
  });
  regexEntriesContainer.on("click", ".st-chatu8-entry-export", function (_0x2bae95) {
    _0x2bae95.stopPropagation();
    const _0xae95fa = $(this).closest(".st-chatu8-preset-entry");
    exportRegexEntry(_0xae95fa);
  });
  regexEntriesContainer.on("click", ".st-chatu8-entry-delete", function (_0x1ba636) {
    _0x1ba636.stopPropagation();
    const _0xb80efa = $(this).closest(".st-chatu8-preset-entry");
    deleteRegexEntry(_0xb80efa);
  });
  regexEntriesContainer.on("dblclick", ".st-chatu8-preset-entry", function (_0x232d7b) {
    if ($(_0x232d7b.target).closest(".st-chatu8-entry-actions, .st-chatu8-entry-drag-handle").length) {
      return;
    }
    showRegexEntryEditModal($(this));
  });
  regexEntriesContainer.on("click", ".st-chatu8-entry-danger-warning", function (_0x31f6b7) {
    _0x31f6b7.stopPropagation();
    const _0x2bf4a3 = $(this).attr("title");
    if (_0x2bf4a3) {
      toastr.error(_0x2bf4a3.replace(/\n/g, "<br>"), "⚠️ 危险正则警告", {
        timeOut: 8000,
        extendedTimeOut: 3000,
        escapeHtml: false
      });
    }
  });
  regexEntriesContainer.on("click", ".st-chatu8-entry-warning", function (_0x1dcb7f) {
    _0x1dcb7f.stopPropagation();
    const _0x38961c = $(this).attr("title");
    if (_0x38961c) {
      toastr.warning(_0x38961c, "替换字符串警告");
    }
  });
}
export function loadRegexProfiles() {
  const _0x2eaea4 = extension_settings[extensionName].regex_profiles || {};
  const _0x5d7ae4 = extension_settings[extensionName].current_regex_profile;
  profileSelect.empty();
  Object.keys(_0x2eaea4).forEach(_0x29f756 => {
    const _0x53576d = new Option(_0x29f756, _0x29f756, _0x29f756 === _0x5d7ae4, _0x29f756 === _0x5d7ae4);
    profileSelect.append(_0x53576d);
  });
  if (profileSelect.val()) {
    profileSelect.trigger("change");
  }
}
function onProfileSelectChange() {
  const _0x2a0999 = $(this).val();
  if (!_0x2a0999) {
    return;
  }
  const _0x3fc21c = extension_settings[extensionName].regex_profiles;
  const _0x50f77b = _0x3fc21c[_0x2a0999];
  if (_0x50f77b) {
    beforeAfterEditor.val(_0x50f77b.beforeAfterRegex || "");
    textEditor.val(_0x50f77b.textRegex || "");
    extension_settings[extensionName].current_regex_profile = _0x2a0999;
    saveSettingsDebounced();
    loadRegexEntriesFromProfile();
  }
}
function onSaveProfileClick() {
  const _0x25f3d2 = profileSelect.val();
  if (!_0x25f3d2) {
    toastr.warning("没有选中的配置。");
    return;
  }
  const _0x21bdc4 = extension_settings[extensionName].regex_profiles;
  const _0x49f549 = _0x21bdc4[_0x25f3d2]?.regexEntries || [];
  _0x21bdc4[_0x25f3d2] = {
    beforeAfterRegex: beforeAfterEditor.val(),
    textRegex: textEditor.val(),
    regexEntries: _0x49f549
  };
  saveSettingsDebounced();
  toastr.success("配置 \"" + _0x25f3d2 + "\" 已保存。");
}
function onSaveAsProfileClick() {
  const _0x419352 = prompt("请输入新的配置名称：");
  if (!_0x419352 || _0x419352.trim() === "") {
    toastr.warning("配置名称不能为空。");
    return;
  }
  const _0x597c21 = extension_settings[extensionName].regex_profiles;
  if (_0x597c21[_0x419352]) {
    toastr.error("配置 \"" + _0x419352 + "\" 已存在。");
    return;
  }
  _0x597c21[_0x419352] = {
    beforeAfterRegex: "",
    textRegex: "",
    regexEntries: []
  };
  extension_settings[extensionName].current_regex_profile = _0x419352;
  saveSettingsDebounced();
  loadRegexProfiles();
  toastr.success("配置 \"" + _0x419352 + "\" 已创建并选中。");
}
function onDeleteProfileClick() {
  const _0x32de64 = profileSelect.val();
  if (!_0x32de64) {
    toastr.warning("没有选中的配置。");
    return;
  }
  if (Object.keys(extension_settings[extensionName].regex_profiles).length <= 1) {
    toastr.error("不能删除最后一个配置。");
    return;
  }
  if (confirm("你确定要删除配置 \"" + _0x32de64 + "\" 吗？")) {
    delete extension_settings[extensionName].regex_profiles[_0x32de64];
    extension_settings[extensionName].current_regex_profile = Object.keys(extension_settings[extensionName].regex_profiles)[0];
    saveSettingsDebounced();
    loadRegexProfiles();
    toastr.success("配置 \"" + _0x32de64 + "\" 已删除。");
  }
}
function onExportProfileClick() {
  const _0x20f0d = profileSelect.val();
  if (!_0x20f0d) {
    toastr.warning("没有选中的配置可导出。");
    return;
  }
  const _0x509284 = extension_settings[extensionName].regex_profiles[_0x20f0d];
  const _0x55476a = {
    [_0x20f0d]: _0x509284
  };
  const _0x1e2d80 = _0x55476a;
  const _0x241c72 = new Blob([JSON.stringify(_0x1e2d80, null, 4)], {
    type: "application/json"
  });
  const _0x2b7392 = URL.createObjectURL(_0x241c72);
  const _0x36f1af = document.createElement("a");
  _0x36f1af.href = _0x2b7392;
  _0x36f1af.download = "st_is_regex_profile_" + _0x20f0d + ".json";
  document.body.appendChild(_0x36f1af);
  _0x36f1af.click();
  document.body.removeChild(_0x36f1af);
  URL.revokeObjectURL(_0x2b7392);
}
function onImportProfileClick() {
  const _0x1af6fc = document.createElement("input");
  _0x1af6fc.type = "file";
  _0x1af6fc.accept = ".json";
  _0x1af6fc.onchange = _0x932fe2 => {
    const _0x3a66e1 = _0x932fe2.target.files[0];
    if (_0x3a66e1) {
      const _0x3982c7 = new FileReader();
      _0x3982c7.onload = _0x4872d6 => {
        try {
          const _0x1be72f = JSON.parse(_0x4872d6.target.result);
          let _0x44cd40 = 0;
          for (const _0x344ca2 in _0x1be72f) {
            if (Object.prototype.hasOwnProperty.call(_0x1be72f, _0x344ca2)) {
              extension_settings[extensionName].regex_profiles[_0x344ca2] = _0x1be72f[_0x344ca2];
              _0x44cd40++;
            }
          }
          saveSettingsDebounced();
          loadRegexProfiles();
          toastr.success("成功导入 " + _0x44cd40 + " 个配置。");
        } catch (_0x1171e0) {
          toastr.error("导入失败，文件格式无效。");
        }
      };
      _0x3982c7.readAsText(_0x3a66e1);
    }
  };
  _0x1af6fc.click();
}
function onImportSTRegexClick() {
  const _0xd47f25 = document.createElement("input");
  _0xd47f25.type = "file";
  _0xd47f25.accept = ".json";
  _0xd47f25.multiple = true;
  _0xd47f25.onchange = async _0x5823fa => {
    const _0x2bacd7 = _0x5823fa.target.files;
    if (!_0x2bacd7 || _0x2bacd7.length === 0) {
      return;
    }
    const _0x207e2e = [];
    const _0x39a6b2 = [];
    for (const _0x213e04 of _0x2bacd7) {
      const _0x1b66e5 = new Promise(_0x46184a => {
        const _0xd74e4 = new FileReader();
        _0xd74e4.onload = _0x256f70 => {
          try {
            const _0x2438d1 = JSON.parse(_0x256f70.target.result);
            const _0x1b00a4 = _0x2438d1.minDepth === 0 || _0x2438d1.minDepth === null;
            const _0x280aa4 = _0x2438d1.markdownOnly === true;
            const _0x17c416 = Array.isArray(_0x2438d1.placement) && _0x2438d1.placement.includes(2);
            if (_0x1b00a4 && _0x280aa4 && _0x17c416) {
              if (_0x2438d1.findRegex) {
                _0x207e2e.push(_0x2438d1.findRegex);
              }
            }
          } catch (_0x580c4c) {
            console.warn("解析文件 " + _0x213e04.name + " 失败:", _0x580c4c);
          }
          _0x46184a();
        };
        _0xd74e4.onerror = () => _0x46184a();
        _0xd74e4.readAsText(_0x213e04);
      });
      _0x39a6b2.push(_0x1b66e5);
    }
    await Promise.all(_0x39a6b2);
    if (_0x207e2e.length > 0) {
      const _0x49e0e3 = textEditor.val().trim();
      const _0x4581a0 = _0x49e0e3 ? _0x49e0e3 + "\n" + _0x207e2e.join("\n") : _0x207e2e.join("\n");
      textEditor.val(_0x4581a0);
      toastr.success("成功导入 " + _0x207e2e.length + " 条正则表达式。");
    } else {
      toastr.warning("没有符合条件的正则表达式可导入。\n条件: minDepth=0或null, markdownOnly=true, placement包含2");
    }
  };
  _0xd47f25.click();
}
function isScriptEligibleForImport(_0x360e76) {
  const _0x1e2ff6 = _0x360e76.minDepth === 0 || _0x360e76.minDepth === null || _0x360e76.minDepth === undefined;
  const _0xdc79cc = _0x360e76.markdownOnly === true;
  const _0x1943af = Array.isArray(_0x360e76.placement) && _0x360e76.placement.includes(2);
  return _0x1e2ff6 && _0xdc79cc && _0x1943af;
}
function getRegexSelectionModalHTML(_0x1cf49b) {
  return "\n        <div class=\"st-chatu8-entry-edit-modal-backdrop\" id=\"ch-regex-selection-modal\">\n            <div class=\"st-chatu8-entry-edit-modal\">\n                <div class=\"st-chatu8-entry-edit-modal-header\">\n                    <h4>选择要导入的正则表达式</h4>\n                    <span class=\"st-chatu8-entry-edit-modal-close\">&times;</span>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-body\">\n                    <div class=\"st-chatu8-modal-field st-chatu8-import-toolbar\">\n                        <button type=\"button\" class=\"st-chatu8-btn\" id=\"st-regex-select-all\">\n                            <i class=\"fa-solid fa-check-double\"></i> 全选\n                        </button>\n                        <button type=\"button\" class=\"st-chatu8-btn\" id=\"st-regex-deselect-all\">\n                            <i class=\"fa-solid fa-xmark\"></i> 取消全选\n                        </button>\n                    </div>\n                    <div class=\"st-chatu8-modal-field st-chatu8-import-list\">\n                        " + _0x1cf49b + "\n                    </div>\n                </div>\n                <div class=\"st-chatu8-entry-edit-modal-footer\">\n                    <button class=\"st-chatu8-btn st-chatu8-modal-cancel-btn\">取消</button>\n                    <button class=\"st-chatu8-btn st-chatu8-btn-primary st-chatu8-modal-save-btn\">\n                        <i class=\"fa-solid fa-file-import\"></i> 导入选中\n                    </button>\n                </div>\n            </div>\n        </div>\n    ";
}
function showRegexSelectionDialog(_0x1e8219) {
  return new Promise(_0x317dda => {
    const _0x5df7a8 = {
      global: "全局正则",
      scoped: "角色正则",
      preset: "预设正则"
    };
    let _0x240173 = "";
    for (const [_0x98a1db, _0x6d9f78] of Object.entries(_0x1e8219)) {
      if (_0x6d9f78.length === 0) {
        continue;
      }
      _0x240173 += "\n                <div class=\"st-chatu8-import-type-group\">\n                    <h5 class=\"st-chatu8-import-type-header\">" + (_0x5df7a8[_0x98a1db] || _0x98a1db) + " <span class=\"st-chatu8-import-count\">(" + _0x6d9f78.length + ")</span></h5>\n            ";
      _0x6d9f78.forEach((_0x4d0f86, _0x2dc92b) => {
        const _0x2dccee = "st-regex-" + _0x98a1db + "-" + _0x2dc92b;
        const _0x521bf9 = _0x4d0f86.scriptName || "未命名正则 " + (_0x2dc92b + 1);
        _0x240173 += "\n                    <div class=\"st-chatu8-import-item\">\n                        <label class=\"st-chatu8-import-label\">\n                            <input type=\"checkbox\" class=\"st-chatu8-import-checkbox\" id=\"" + _0x2dccee + "\" \n                                   data-type=\"" + _0x98a1db + "\" data-index=\"" + _0x2dc92b + "\" checked>\n                            <span class=\"st-chatu8-import-name\">" + escapeHtmlForRegex(_0x521bf9) + "</span>\n                        </label>\n                    </div>\n                ";
      });
      _0x240173 += "</div>";
    }
    $("#ch-regex-selection-modal").remove();
    $("body").append(getRegexSelectionModalHTML(_0x240173));
    const _0x5c3d85 = $("#ch-regex-selection-modal");
    _0x5c3d85.find("#st-regex-select-all").on("click", () => {
      _0x5c3d85.find(".st-chatu8-import-checkbox").prop("checked", true);
    });
    _0x5c3d85.find("#st-regex-deselect-all").on("click", () => {
      _0x5c3d85.find(".st-chatu8-import-checkbox").prop("checked", false);
    });
    _0x5c3d85.find(".st-chatu8-modal-save-btn").on("click", () => {
      const _0x17197f = [];
      _0x5c3d85.find(".st-chatu8-import-checkbox:checked").each(function () {
        const _0x373abf = $(this).data("type");
        const _0xe7500d = $(this).data("index");
        const _0x208f5a = _0x1e8219[_0x373abf][_0xe7500d];
        if (_0x208f5a && _0x208f5a.findRegex) {
          _0x17197f.push(_0x208f5a.findRegex);
        }
      });
      _0x5c3d85.fadeOut(200, () => _0x5c3d85.remove());
      _0x317dda(_0x17197f);
    });
    _0x5c3d85.find(".st-chatu8-modal-cancel-btn, .st-chatu8-entry-edit-modal-close").on("click", () => {
      _0x5c3d85.fadeOut(200, () => _0x5c3d85.remove());
      _0x317dda([]);
    });
    _0x5c3d85.on("click", _0x39cffd => {
      if ($(_0x39cffd.target).hasClass("st-chatu8-entry-edit-modal-backdrop")) {
        _0x5c3d85.fadeOut(200, () => _0x5c3d85.remove());
        _0x317dda([]);
      }
    });
    _0x5c3d85.fadeIn(200);
  });
}
async function onImportSTRegexEngineClick() {
  try {
    const _0x1bda45 = await import("../../../../../extensions/regex/engine.js");
    const _0xd2f38a = _0x1bda45.getScriptsByType(_0x1bda45.SCRIPT_TYPES.GLOBAL) || [];
    const _0x26a471 = _0x1bda45.getScriptsByType(_0x1bda45.SCRIPT_TYPES.SCOPED) || [];
    const _0x5d9f5f = _0x1bda45.getScriptsByType(_0x1bda45.SCRIPT_TYPES.PRESET) || [];
    const _0x31483a = _0x5aaaa2 => _0x5aaaa2.filter(_0x252980 => !_0x252980.disabled && isScriptEligibleForImport(_0x252980) && _0x252980.findRegex);
    const _0x35399a = {
      global: _0x31483a(_0xd2f38a),
      scoped: _0x31483a(_0x26a471),
      preset: _0x31483a(_0x5d9f5f)
    };
    const _0x3baf33 = _0x35399a.global.length + _0x35399a.scoped.length + _0x35399a.preset.length;
    if (_0x3baf33 === 0) {
      toastr.warning("没有符合条件的正则表达式可导入。\n条件: 未禁用, minDepth=0或null, markdownOnly=true, placement包含2");
      return;
    }
    const _0x129b25 = await showRegexSelectionDialog(_0x35399a);
    if (_0x129b25.length > 0) {
      const _0x30a6b1 = textEditor.val().trim();
      const _0x37166c = _0x30a6b1 ? _0x30a6b1 + "\n" + _0x129b25.join("\n") : _0x129b25.join("\n");
      textEditor.val(_0x37166c);
      toastr.success("成功从ST正则引擎导入 " + _0x129b25.length + " 条正则表达式。");
    } else {
      toastr.info("未选择任何正则表达式。");
    }
  } catch (_0x44e329) {
    console.error("加载正则引擎模块失败:", _0x44e329);
    toastr.error("加载ST正则引擎模块失败，请确保正则扩展已启用。");
  }
}
const DANGEROUS_REGEX_PATTERNS = [{
  pattern: /\([^)]*[+*][^)]*\)[+*]/,
  name: "嵌套量词",
  description: "如 (a+)+, (.+)+ 会导致指数级回溯"
}, {
  pattern: /\.\*\.\*|\.\+\.\+|\.\*\?\.\+|\.\+\?\.\*/,
  name: "连续通配符",
  description: "如 .*.*, .+.+ 会导致大量回溯"
}, {
  pattern: /\.\+[^?].*\.\+|\.\*[^?].*\.\*/,
  name: "多重贪婪匹配",
  description: "多个贪婪匹配可能导致性能问题"
}, {
  pattern: /\(\s*\)[+*]/,
  name: "空匹配循环",
  description: "空括号加量词会导致无限循环"
}, {
  pattern: /\(\([^)]*[+*][^)]*\)[+*]\)/,
  name: "深层嵌套量词",
  description: "多层嵌套量词风险极高"
}, {
  pattern: /\([^)]*\|[^)]*[+*][^)]*\)[+*]|\([^)]*[+*][^)]*\|[^)]*\)[+*]/,
  name: "交替量词组合",
  description: "如 (a|b+)+ 可能导致回溯"
}];
function detectDangerousRegex(_0x5a4125) {
  if (!_0x5a4125 || typeof _0x5a4125 !== "string") {
    return {
      isDangerous: false,
      warnings: []
    };
  }
  const _0x5b9f9d = [];
  for (const _0x19845d of DANGEROUS_REGEX_PATTERNS) {
    if (_0x19845d.pattern.test(_0x5a4125)) {
      const _0x59c8bb = {
        name: _0x19845d.name,
        description: _0x19845d.description
      };
      _0x5b9f9d.push(_0x59c8bb);
    }
  }
  if (_0x5a4125.length > 500) {
    const _0x2506c3 = {
      name: "过长正则",
      description: "正则长度 " + _0x5a4125.length + " 字符，可能影响性能"
    };
    _0x5b9f9d.push(_0x2506c3);
  }
  const _0x17df1b = (_0x5a4125.match(/[+*?]|\{\d+,?\d*\}/g) || []).length;
  if (_0x17df1b > 10) {
    const _0xdc2495 = {
      name: "过多量词",
      description: "包含 " + _0x17df1b + " 个量词，可能影响性能"
    };
    _0x5b9f9d.push(_0xdc2495);
  }
  return {
    isDangerous: _0x5b9f9d.length > 0,
    warnings: _0x5b9f9d
  };
}
function generateDangerousRegexWarningHTML(_0x5f112a) {
  if (!_0x5f112a || _0x5f112a.length === 0) {
    return "";
  }
  const _0x2a5746 = _0x5f112a.map(_0x16bd93 => _0x16bd93.name + ": " + _0x16bd93.description).join("\n");
  return "<span class=\"st-chatu8-entry-danger-warning\" title=\"" + _0x2a5746 + "\"><i class=\"fa-solid fa-skull-crossbones\"></i></span>";
}
function escapeRegex(_0x26b24f) {
  return _0x26b24f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function isRegexLiteral(_0x42a936) {
  const _0x51f071 = /^\/(.+)\/([gimsuy]*)$/;
  return _0x51f071.test(_0x42a936);
}
function parseRegexLiteral(_0x11f497) {
  const _0x528c4a = /^\/(.+)\/([gimsuy]*)$/;
  const _0x5ce2f2 = _0x11f497.match(_0x528c4a);
  if (_0x5ce2f2) {
    try {
      const _0x5addbf = _0x5ce2f2[1];
      let _0x5e58d8 = _0x5ce2f2[2];
      if (!_0x5e58d8.includes("g")) {
        _0x5e58d8 += "g";
      }
      return new RegExp(_0x5addbf, _0x5e58d8);
    } catch (_0x434035) {
      console.error("Invalid regex pattern: " + _0x11f497, _0x434035);
      return null;
    }
  }
  return null;
}
function mergeRanges(_0x1cf725) {
  if (_0x1cf725.length < 2) {
    return _0x1cf725;
  }
  _0x1cf725.sort((_0x249c20, _0x49725c) => _0x249c20.start - _0x49725c.start);
  const _0x4e89b8 = [_0x1cf725[0]];
  for (let _0x1cfe6f = 1; _0x1cfe6f < _0x1cf725.length; _0x1cfe6f++) {
    const _0x3405f0 = _0x4e89b8[_0x4e89b8.length - 1];
    const _0x3df72b = _0x1cf725[_0x1cfe6f];
    if (_0x3df72b.start <= _0x3405f0.end) {
      _0x3405f0.end = Math.max(_0x3405f0.end, _0x3df72b.end);
    } else {
      _0x4e89b8.push(_0x3df72b);
    }
  }
  return _0x4e89b8;
}
async function onTestRegexClick(_0xb6854) {
  const _0x5f54ce = debugTimer("regex.onTestRegexClick", "正则处理流程");
  const _0x4c8df7 = originalText.val();
  const _0x456464 = beforeAfterEditor.val().trim();
  const _0x38aed7 = textEditor.val();
  let _0x3fe6f8 = [];
  debugLog("regex.onTestRegexClick", "开始正则处理", {
    请求ID: _0xb6854 || "(手动测试)",
    原文长度: _0x4c8df7?.length || 0
  });
  debugContent("regex.onTestRegexClick", "原始文本", _0x4c8df7, 300);
  try {
    let _0x20c41a = _0x4c8df7 || "";
    let _0x39ff16 = 0;
    const _0x1f29be = collectRegexEntriesFromUI();
    const _0x1cdc66 = profileSelect ? profileSelect.val() : "(未知)";
    debugLog("regex.onTestRegexClick", "正则条目列表", {
      当前配置: _0x1cdc66,
      总条目数: _0x1f29be.length,
      启用条目数: _0x1f29be.filter(_0x3a11a1 => !_0x3a11a1.disabled).length,
      条目名称列表: _0x1f29be.map((_0x119f87, _0x1604c4) => _0x1604c4 + 1 + ". " + (_0x119f87.scriptName || "(无名称)") + (_0x119f87.disabled ? " [禁用]" : "")).join("\n")
    });
    for (let _0x3c5065 = 0; _0x3c5065 < _0x1f29be.length; _0x3c5065++) {
      const _0x5c837a = _0x1f29be[_0x3c5065];
      if (_0x5c837a.disabled) {
        debugBranch("onTestRegexClick", "条目 " + (_0x3c5065 + 1) + " \"" + _0x5c837a.scriptName + "\" 已禁用", true, {
          索引: _0x3c5065,
          名称: _0x5c837a.scriptName
        });
        continue;
      }
      if (!_0x5c837a.findRegex) {
        debugBranch("onTestRegexClick", "条目 " + (_0x3c5065 + 1) + " \"" + _0x5c837a.scriptName + "\" 无findRegex", true);
        continue;
      }
      const _0x290114 = detectDangerousRegex(_0x5c837a.findRegex);
      const _0x3c7e7f = _0x290114.warnings.some(_0x1a2798 => _0x1a2798.name === "嵌套量词" || _0x1a2798.name === "深层嵌套量词" || _0x1a2798.name === "空匹配循环");
      if (_0x3c7e7f) {
        const _0x11a6e7 = _0x290114.warnings.map(_0x1ba80a => _0x1ba80a.name).join(", ");
        debugLog("regex.onTestRegexClick", "⚠️ 跳过危险正则: " + _0x5c837a.scriptName, {
          危险类型: _0x11a6e7,
          正则: _0x5c837a.findRegex.substring(0, 50)
        });
        console.warn("[st-chatu8] 跳过危险正则 \"" + _0x5c837a.scriptName + "\": " + _0x11a6e7);
        toastr.warning("跳过危险正则 \"" + _0x5c837a.scriptName + "\"<br>原因: " + _0x11a6e7, "正则安全检查", {
          timeOut: 5000,
          escapeHtml: false
        });
        continue;
      }
      const _0x97e299 = _0x20c41a.length;
      try {
        const _0x3c9e3f = _0x5c837a.findRegex.trim();
        let _0x900191;
        let _0x33d445;
        if (isRegexLiteral(_0x3c9e3f)) {
          const _0x3b2632 = /^\/(.+)\/([gimsuy]*)$/;
          const _0x33984c = _0x3c9e3f.match(_0x3b2632);
          if (!_0x33984c) {
            const _0x4dc258 = {
              findRegex: _0x3c9e3f
            };
            debugLog("regex.onTestRegexClick", "条目 \"" + _0x5c837a.scriptName + "\" 正则解析失败", _0x4dc258);
            console.warn("正则条目 \"" + _0x5c837a.scriptName + "\" 的 findRegex 解析失败: " + _0x3c9e3f);
            continue;
          }
          _0x900191 = _0x33984c[1];
          _0x33d445 = _0x33984c[2] || "";
          if (!_0x33d445.includes("g")) {
            _0x33d445 += "g";
          }
        } else {
          _0x900191 = _0x3c9e3f;
          _0x33d445 = "g";
        }
        const _0x3786d1 = _0x5c837a.replaceString || "";
        const _0x5aad90 = await executeRegexWithTimeout("match", _0x20c41a, _0x900191, _0x33d445);
        if (!_0x5aad90.success) {
          if (_0x5aad90.timeout) {
            debugLog("regex.onTestRegexClick", "⏱️ 正则超时: " + _0x5c837a.scriptName, {
              正则: _0x3c9e3f.substring(0, 50)
            });
            console.warn("[st-chatu8] 正则条目 \"" + _0x5c837a.scriptName + "\" 匹配超时");
            toastr.warning("正则条目 \"" + _0x5c837a.scriptName + "\" 执行超时 (>1000ms)，已跳过", "正则超时", {
              timeOut: 5000
            });
          } else {
            console.warn("正则条目 \"" + _0x5c837a.scriptName + "\" 匹配失败:", _0x5aad90.error);
          }
          continue;
        }
        const _0x155ecb = _0x5aad90.result?.matches?.length || 0;
        const _0x1ba53d = await executeRegexWithTimeout("replace", _0x20c41a, _0x900191, _0x33d445, _0x3786d1);
        if (!_0x1ba53d.success) {
          if (_0x1ba53d.timeout) {
            debugLog("regex.onTestRegexClick", "⏱️ 正则替换超时: " + _0x5c837a.scriptName, {
              正则: _0x3c9e3f.substring(0, 50)
            });
            console.warn("[st-chatu8] 正则条目 \"" + _0x5c837a.scriptName + "\" 替换超时");
            toastr.warning("正则条目 \"" + _0x5c837a.scriptName + "\" 替换超时 (>1000ms)，已跳过", "正则超时", {
              timeOut: 5000
            });
          } else {
            console.warn("正则条目 \"" + _0x5c837a.scriptName + "\" 替换失败:", _0x1ba53d.error);
          }
          continue;
        }
        if (_0x1ba53d.result == null) {
          console.warn("正则条目 \"" + _0x5c837a.scriptName + "\" 替换结果为空");
          continue;
        }
        _0x20c41a = _0x1ba53d.result;
        const _0x510c95 = _0x20c41a.length;
        const _0x449d93 = _0x510c95 - _0x97e299;
        if (_0x155ecb > 0 || _0x449d93 !== 0) {
          debugLog("regex.onTestRegexClick", "正则条目处理: " + _0x5c837a.scriptName, {
            索引: _0x3c5065 + 1,
            名称: _0x5c837a.scriptName,
            正则: _0x3c9e3f.substring(0, 50) + (_0x3c9e3f.length > 50 ? "..." : ""),
            替换为: _0x3786d1.substring(0, 30) + (_0x3786d1.length > 30 ? "..." : ""),
            匹配数: _0x155ecb,
            长度变化: _0x449d93,
            处理前长度: _0x97e299,
            处理后长度: _0x510c95
          });
        }
      } catch (_0x1138f1) {
        const _0x3d1a9d = {
          错误: _0x1138f1.message
        };
        debugLog("regex.onTestRegexClick", "条目 \"" + _0x5c837a.scriptName + "\" 执行失败", _0x3d1a9d);
        console.warn("正则条目 \"" + _0x5c837a.scriptName + "\" 执行失败:", _0x1138f1);
      }
    }
    debugLog("regex.onTestRegexClick", "前后正则处理开始", {
      输入值: _0x456464,
      输入长度: _0x456464.length,
      包含分隔符: _0x456464.includes("|")
    });
    if (_0x456464.includes("|")) {
      const _0xf71322 = _0x456464.split("|");
      debugLog("regex.onTestRegexClick", "前后正则分割结果", {
        分割数量: _0xf71322.length,
        前边界: _0xf71322[0] || "(空)",
        后边界: _0xf71322[1] || "(空)",
        完整分割: _0xf71322
      });
      if (_0xf71322.length === 2) {
        const _0x7c4ce8 = _0xf71322[0] === "^" ? "^" : escapeRegex(_0xf71322[0]);
        const _0x162aa9 = _0xf71322[1] === "$" ? "$" : escapeRegex(_0xf71322[1]);
        const _0x12896d = _0x7c4ce8 + "([\\s\\S]*?)" + _0x162aa9;
        const _0x1e0354 = _0xf71322[0] === "^" ? true : _0x20c41a.includes(_0xf71322[0]);
        const _0x77595f = _0xf71322[1] === "$" ? true : _0x20c41a.includes(_0xf71322[1]);
        debugLog("regex.onTestRegexClick", "🔍 前后正则匹配前检查", {
          待处理文本长度: _0x20c41a.length,
          文本预览前200字符: _0x20c41a.substring(0, 200),
          文本预览后200字符: _0x20c41a.substring(Math.max(0, _0x20c41a.length - 200)),
          前边界原值: _0xf71322[0],
          后边界原值: _0xf71322[1],
          文本包含前边界: _0x1e0354,
          文本包含后边界: _0x77595f
        });
        console.log("[st-chatu8] 前后正则匹配前文本预览:", _0x20c41a.substring(0, 300));
        const _0xd4bcc3 = {
          前边界转义: _0x7c4ce8,
          后边界转义: _0x162aa9,
          完整模式: _0x12896d,
          待匹配文本长度: _0x20c41a.length
        };
        debugLog("regex.onTestRegexClick", "前后正则模式生成", _0xd4bcc3);
        const _0x10d876 = await executeRegexWithTimeout("match", _0x20c41a, _0x12896d, "i");
        debugLog("regex.onTestRegexClick", "前后正则匹配结果", {
          成功: _0x10d876.success,
          超时: _0x10d876.timeout || false,
          错误: _0x10d876.error || null,
          有结果: !!_0x10d876.result,
          结果类型: _0x10d876.result ? typeof _0x10d876.result : "undefined",
          匹配数组长度: _0x10d876.result?.matches ? _0x10d876.result.matches.length : 0,
          匹配数组内容: _0x10d876.result?.matches ? JSON.stringify(_0x10d876.result.matches) : "N/A",
          matches0类型: _0x10d876.result?.matches ? typeof _0x10d876.result.matches[0] : "N/A",
          matches1类型: _0x10d876.result?.matches ? typeof _0x10d876.result.matches[1] : "N/A",
          matches1值: _0x10d876.result?.matches?.[1] !== undefined ? String(_0x10d876.result.matches[1]).substring(0, 50) : "undefined"
        });
        console.log("[st-chatu8] 完整 matchResult:", JSON.stringify(_0x10d876, null, 2));
        if (_0x10d876.success && _0x10d876.result && _0x10d876.result.matches && typeof _0x10d876.result.matches[1] === "string") {
          const _0x3b8221 = _0x10d876.result;
          const _0x4a35ad = _0x3b8221.matches[1];
          const _0x2f8834 = _0x3b8221.index + _0x3b8221.matches[0].indexOf(_0x4a35ad);
          const _0x4b6f46 = _0x2f8834 + _0x4a35ad.length;
          const _0x2f3d88 = {
            匹配开始位置: _0x3b8221.index,
            提取内容长度: _0x4a35ad.length,
            内容开始: _0x2f8834,
            内容结束: _0x4b6f46,
            原文长度: _0x20c41a.length
          };
          debugLog("regex.onTestRegexClick", "前后正则匹配成功", _0x2f3d88);
          debugContent("regex.onTestRegexClick", "前后正则提取内容", _0x4a35ad, 200);
          if (_0x2f8834 > 0) {
            const _0x3e5566 = {
              start: 0,
              end: _0x2f8834
            };
            _0x3fe6f8.push(_0x3e5566);
          }
          if (_0x4b6f46 < _0x20c41a.length) {
            const _0x2667c0 = {
              start: _0x4b6f46,
              end: _0x20c41a.length
            };
            _0x3fe6f8.push(_0x2667c0);
          }
          _0x20c41a = _0x4a35ad;
          _0x39ff16 = _0x2f8834;
        } else if (_0x10d876.timeout) {
          console.warn("[st-chatu8] 前后正则匹配超时");
          toastr.warning("前后正则匹配超时 (>1000ms)，已跳过", "正则超时", {
            timeOut: 5000
          });
        } else {
          debugLog("regex.onTestRegexClick", "⚠️ 前后正则未能匹配", {
            原因: !_0x10d876.success ? "执行失败" : !_0x10d876.result ? "结果为空" : !_0x10d876.result.matches ? "无匹配数组" : typeof _0x10d876.result.matches[1] !== "string" ? "捕获组不是字符串" : "未知",
            错误信息: _0x10d876.error || null,
            正则模式: _0x12896d,
            文本预览: _0x20c41a.substring(0, 100) + (_0x20c41a.length > 100 ? "..." : "")
          });
          console.warn("[st-chatu8] 前后正则未能匹配文本。模式:", _0x12896d);
        }
      } else {
        debugLog("regex.onTestRegexClick", "⚠️ 前后正则格式错误", {
          原因: "分割后部分数量为 " + _0xf71322.length + "，期望为 2",
          提示: "格式应为: 前边界|后边界"
        });
        console.warn("[st-chatu8] 前后正则格式错误: 期望 1 个分隔符 |，实际分割为", _0xf71322.length, "部分");
      }
    } else if (_0x456464.trim()) {
      const _0x4fcd36 = {
        输入: _0x456464,
        提示: "格式应为: 前边界|后边界，使用 | 作为分隔符"
      };
      debugLog("regex.onTestRegexClick", "⚠️ 前后正则缺少分隔符", _0x4fcd36);
      console.warn("[st-chatu8] 前后正则缺少分隔符 |，格式应为: 前边界|后边界");
    } else {
      debugBranch("onTestRegexClick", "前后正则为空，跳过", true);
    }
    const _0xd89399 = extension_settings[extensionName];
    const _0x1e7c03 = _0xd89399?.startTag || "image###";
    const _0x948613 = _0xd89399?.endTag || "###";
    const _0x1c5e10 = _0x1e7c03.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const _0x5888f7 = _0x948613.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const _0x433661 = [{
      pattern: /<image>[\s\S]*?<\/image>/g,
      desc: "过滤 <image> 标签"
    }, {
      pattern: new RegExp(_0x1c5e10 + "[\\s\\S]*?" + _0x5888f7, "g"),
      desc: "过滤 " + _0x1e7c03 + " 标记"
    }];
    if (_0x1e7c03 !== "image###") {
      _0x433661.push({
        pattern: /image###[\s\S]*?###/g,
        desc: "过滤旧的 image### 标记"
      });
    }
    for (const _0x382316 of _0x433661) {
      _0x20c41a = executeRegexWithWarning(() => _0x20c41a.replace(_0x382316.pattern, ""), _0x382316.desc);
    }
    let _0x4ba2c0 = [];
    if (_0x38aed7.trim()) {
      const _0x323a7e = _0x38aed7.split("\n");
      for (const _0x1fdb49 of _0x323a7e) {
        const _0x326f8a = _0x1fdb49.trim();
        if (!_0x326f8a) {
          continue;
        }
        let _0xa0a5e1;
        let _0x1725a6;
        if (isRegexLiteral(_0x326f8a)) {
          const _0x5e0594 = /^\/(.+)\/([gimsuy]*)$/;
          const _0x1a8aea = _0x326f8a.match(_0x5e0594);
          if (!_0x1a8aea) {
            console.warn("Failed to parse regex literal: " + _0x326f8a);
            continue;
          }
          _0xa0a5e1 = _0x1a8aea[1];
          _0x1725a6 = _0x1a8aea[2] || "";
          if (!_0x1725a6.includes("g")) {
            _0x1725a6 += "g";
          }
        } else if (_0x326f8a.includes("|")) {
          const _0x5e77de = _0x326f8a.split("|");
          if (_0x5e77de.length === 2) {
            const _0x4c8529 = _0x5e77de[0] === "^" ? "^" : escapeRegex(_0x5e77de[0]);
            const _0x4289c4 = _0x5e77de[1] === "$" ? "$" : escapeRegex(_0x5e77de[1]);
            _0xa0a5e1 = _0x4c8529 + "[\\s\\S]*?" + _0x4289c4;
            _0x1725a6 = "g";
          } else {
            continue;
          }
        } else {
          _0xa0a5e1 = escapeRegex(_0x326f8a);
          _0x1725a6 = "g";
        }
        const _0x3ac3d8 = await executeRegexWithTimeout("matchAll", _0x20c41a, _0xa0a5e1, _0x1725a6);
        if (_0x3ac3d8.success && _0x3ac3d8.result) {
          for (const _0x1862d0 of _0x3ac3d8.result) {
            if (_0x1862d0 && _0x1862d0.match != null) {
              _0x4ba2c0.push({
                start: _0x1862d0.index,
                end: _0x1862d0.index + _0x1862d0.match.length
              });
            }
          }
        } else if (_0x3ac3d8.timeout) {
          console.warn("[st-chatu8] 文字正则匹配超时: " + _0x326f8a.substring(0, 30));
          toastr.warning("文字正则匹配超时 (>1000ms)，已跳过: " + _0x326f8a.substring(0, 30) + "...", "正则超时", {
            timeOut: 5000
          });
        }
      }
    }
    const _0x1abe6b = mergeRanges(_0x4ba2c0);
    let _0x30c302 = "";
    let _0x2de5a3 = 0;
    _0x1abe6b.forEach(_0x2e6378 => {
      _0x30c302 += _0x20c41a.substring(_0x2de5a3, _0x2e6378.start);
      _0x2de5a3 = _0x2e6378.end;
    });
    _0x30c302 += _0x20c41a.substring(_0x2de5a3);
    const _0x2a5b34 = _0x1abe6b.map(_0x2ac4f5 => ({
      start: _0x2ac4f5.start + _0x39ff16,
      end: _0x2ac4f5.end + _0x39ff16
    }));
    _0x3fe6f8.push(..._0x2a5b34);
    const _0x36284e = mergeRanges(_0x3fe6f8);
    _0x30c302 = _0x30c302.trim();
    resultText.val(_0x30c302);
    const _0x8ea1ec = {
      原始长度: _0x4c8df7?.length || 0,
      最终长度: _0x30c302?.length || 0,
      长度变化: (_0x30c302?.length || 0) - (_0x4c8df7?.length || 0),
      移除范围数: _0x36284e.length
    };
    debugLog("regex.onTestRegexClick", "正则处理完成", _0x8ea1ec);
    debugContent("regex.onTestRegexClick", "处理后文本", _0x30c302, 300);
    addLog("[Regex 处理后文本]\n" + _0x30c302);
    const _0xe77a70 = !!_0xb6854;
    const _0x319bd7 = extension_settings[extensionName].regexTestMode;
    if (_0xe77a70 || !_0x319bd7) {
      const _0x15f86e = {
        是自动调用: _0xe77a70,
        测试模式: _0x319bd7
      };
      debugBranch("onTestRegexClick", "发送正则处理结果", true, _0x15f86e);
      const _0xc6b54c = {
        message: _0x30c302,
        removedRanges: _0x36284e,
        id: _0xb6854
      };
      eventSource.emit(eventNames.REGEX_RESULT_MESSAGE, _0xc6b54c);
    }
    _0x5f54ce.end("处理完成 - 原文" + (_0x4c8df7?.length || 0) + "字 → 最终" + (_0x30c302?.length || 0) + "字");
  } catch (_0x66bb75) {
    const _0x4b01e8 = {
      错误: _0x66bb75.message
    };
    debugLog("regex.onTestRegexClick", "正则处理失败", _0x4b01e8);
    _0x5f54ce.end("处理失败: " + _0x66bb75.message);
    toastr.error("正则表达式错误: " + _0x66bb75.message);
    resultText.val("错误: " + _0x66bb75.message);
  }
}
function onRegexTestModeChange() {
  extension_settings[extensionName].regexTestMode = $(this).is(":checked");
  saveSettingsDebounced();
}
function onGestureEnabledChange() {
  const _0x6bb5a5 = $(this).is(":checked");
  extension_settings[extensionName].gestureEnabled = _0x6bb5a5;
  saveSettingsDebounced();
  if (_0x6bb5a5) {
    initGestureMonitor();
  } else {
    stopGestureMonitor();
  }
}
function onClickTriggerEnabledChange() {
  const _0x592314 = $(this).is(":checked");
  extension_settings[extensionName].clickTriggerEnabled = _0x592314;
  saveSettingsDebounced();
  if (_0x592314) {
    initClickTriggerMonitor();
  } else {
    stopClickTriggerMonitor();
  }
}
function onGestureShowRecognitionChange() {
  extension_settings[extensionName].gestureShowRecognition = $(this).is(":checked");
  saveSettingsDebounced();
}
function onGestureShowTrailChange() {
  extension_settings[extensionName].gestureShowTrail = $(this).is(":checked");
  saveSettingsDebounced();
}
function onGestureTrailColorChange() {
  extension_settings[extensionName].gestureTrailColor = $(this).val();
  saveSettingsDebounced();
}
function onImageGenDemandEnabledChange() {
  extension_settings[extensionName].imageGenDemandEnabled = $(this).is(":checked");
  saveSettingsDebounced();
}
function onGestureMatchThresholdChange() {
  const _0x2f605 = $(this).val();
  gestureMatchThresholdValue.text(_0x2f605 + "%");
  extension_settings[extensionName].gestureMatchThreshold = parseInt(_0x2f605, 10);
  saveSettingsDebounced();
}
function onDefaultCharDemandChange() {
  extension_settings[extensionName].defaultCharDemand = $(this).val();
  saveSettingsDebounced();
}
function onDefaultImageDemandChange() {
  extension_settings[extensionName].defaultImageDemand = $(this).val();
  saveSettingsDebounced();
}
export function initRegexSettings() {
  profileSelect = $("#ch-regex-profile-select");
  beforeAfterEditor = $("#ch-regex-before-after-editor");
  textEditor = $("#ch-regex-text-editor");
  originalText = $("#ch-regex-test-original-text");
  resultText = $("#ch-regex-test-result-text");
  regexTestModeSwitch = $("#ch-regex-test-mode");
  gestureEnabledSwitch = $("#ch-gesture-enabled");
  clickTriggerEnabledSwitch = $("#ch-click-trigger-enabled");
  gestureShowRecognitionSwitch = $("#ch-gesture-show-recognition");
  gestureShowTrailSwitch = $("#ch-gesture-show-trail");
  gestureTrailColorPicker = $("#ch-gesture-trail-color");
  gestureMatchThresholdSlider = $("#ch-gesture-match-threshold");
  gestureMatchThresholdValue = $("#ch-gesture-match-threshold-value");
  imageGenDemandEnabledSwitch = $("#ch-image-gen-demand-enabled");
  defaultCharDemandTextarea = $("#ch-default-char-demand");
  defaultImageDemandTextarea = $("#ch-default-image-demand");
  regexTestModeSwitch.prop("checked", extension_settings[extensionName].regexTestMode ?? false);
  gestureEnabledSwitch.prop("checked", extension_settings[extensionName].gestureEnabled ?? false);
  clickTriggerEnabledSwitch.prop("checked", extension_settings[extensionName].clickTriggerEnabled ?? false);
  gestureShowRecognitionSwitch.prop("checked", extension_settings[extensionName].gestureShowRecognition ?? true);
  gestureShowTrailSwitch.prop("checked", extension_settings[extensionName].gestureShowTrail ?? true);
  gestureTrailColorPicker.val(extension_settings[extensionName].gestureTrailColor ?? "#00ff00");
  const _0x5b77c5 = extension_settings[extensionName].gestureMatchThreshold ?? 60;
  gestureMatchThresholdSlider.val(_0x5b77c5);
  gestureMatchThresholdValue.text(_0x5b77c5 + "%");
  imageGenDemandEnabledSwitch.prop("checked", extension_settings[extensionName].imageGenDemandEnabled ?? false);
  defaultCharDemandTextarea.val(extension_settings[extensionName].defaultCharDemand ?? "");
  defaultImageDemandTextarea.val(extension_settings[extensionName].defaultImageDemand ?? "");
  $("#ch-new-regex-profile-button").on("click", onSaveAsProfileClick);
  $("#ch-save-regex-profile-button").on("click", onSaveProfileClick);
  $("#ch-save-as-regex-profile-button").on("click", onSaveAsProfileClick);
  $("#ch-delete-regex-profile-button").on("click", onDeleteProfileClick);
  $("#ch-import-regex-profile-button").on("click", onImportProfileClick);
  $("#ch-export-regex-profile-button").on("click", onExportProfileClick);
  $("#ch-test-regex-button").on("click", () => onTestRegexClick());
  profileSelect.on("change", onProfileSelectChange);
  regexTestModeSwitch.on("change", onRegexTestModeChange);
  gestureEnabledSwitch.on("change", onGestureEnabledChange);
  clickTriggerEnabledSwitch.on("change", onClickTriggerEnabledChange);
  gestureShowRecognitionSwitch.on("change", onGestureShowRecognitionChange);
  gestureShowTrailSwitch.on("change", onGestureShowTrailChange);
  gestureTrailColorPicker.on("input", onGestureTrailColorChange);
  gestureMatchThresholdSlider.on("input", onGestureMatchThresholdChange);
  imageGenDemandEnabledSwitch.on("change", onImageGenDemandEnabledChange);
  defaultCharDemandTextarea.on("input", onDefaultCharDemandChange);
  defaultImageDemandTextarea.on("input", onDefaultImageDemandChange);
  $("#ch-gesture-1-button").on("click", () => onRecordGestureClick("gesture1"));
  $("#ch-gesture-2-button").on("click", () => onRecordGestureClick("gesture2"));
  eventSource.on(eventNames.REGEX_TEST_MESSAGE, _0x5c759f => {
    const {
      message: _0x59a582,
      id: _0x4c4837
    } = _0x5c759f;
    if (originalText && _0x59a582) {
      clearLog();
      addLog("[Regex 原始文本]\n" + _0x59a582);
      originalText.val(_0x59a582);
      onTestRegexClick(_0x4c4837);
    }
  });
  regexEntriesContainer = $("#ch-regex-entries-container");
  $("#ch-add-regex-entry-button").on("click", addNewRegexEntry);
  $("#ch-import-regex-entry-button").on("click", importRegexEntries);
  $("#ch-import-regex-entry-engine-button").on("click", importRegexEntriesFromEngine);
  bindRegexEntryDragEvents();
  bindRegexEntryEvents();
  loadRegexProfiles();
}
async function onRecordGestureClick(_0x12cf8f) {
  try {
    const _0x4a49fd = await recordGesture();
    if (_0x4a49fd) {
      extension_settings[extensionName][_0x12cf8f] = _0x4a49fd;
      saveSettingsDebounced();
      toastr.success("手势 \"" + (_0x12cf8f === "gesture1" ? "一" : "二") + "\" 已更新。");
    }
  } catch (_0x20ca1c) {
    toastr.error("录制手势失败。");
    console.error("Gesture recording failed:", _0x20ca1c);
  }
}
function getRegexTestStatus() {
  const _0x321b63 = extension_settings[extensionName].regexTestMode ?? false;
  const _0x28634e = profileSelect ? profileSelect.val() : "";
  const _0x388c19 = originalText ? originalText.val() : "";
  const _0x1e67bb = resultText ? resultText.val() : "";
  const _0x596091 = beforeAfterEditor ? beforeAfterEditor.val() : "";
  const _0x4f8027 = textEditor ? textEditor.val() : "";
  const _0x48e2ca = collectRegexEntriesFromUI();
  const _0x106907 = _0x48e2ca.map((_0x22118f, _0x192c7e) => ({
    index: _0x192c7e + 1,
    name: _0x22118f.scriptName || "(无名称)",
    disabled: !!_0x22118f.disabled,
    findRegex: (_0x22118f.findRegex || "").substring(0, 60),
    replaceString: (_0x22118f.replaceString || "").substring(0, 60)
  }));
  const _0x5c65df = extension_settings[extensionName].gestureEnabled ?? false;
  const _0x1de7fb = extension_settings[extensionName].clickTriggerEnabled ?? false;
  return {
    testMode: _0x321b63,
    currentProfile: _0x28634e,
    originalText: _0x388c19 ? _0x388c19.substring(0, 30000) : "(空)",
    resultText: _0x1e67bb ? _0x1e67bb.substring(0, 30000) : "(空)",
    beforeAfterRegex: _0x596091 || "(空)",
    textRegex: _0x4f8027 || "(空)",
    regexEntries: _0x106907,
    entryCount: _0x48e2ca.length,
    gestureEnabled: _0x5c65df,
    clickTriggerEnabled: _0x1de7fb
  };
}
function setRegexOriginalText(_0xcc8190) {
  if (!originalText || originalText.length === 0) {
    return "❌ 原文框不存在，请先切换到正则页面。";
  }
  originalText.val(_0xcc8190 || "");
  return "✅ 已设置原文 (" + (_0xcc8190 || "").length + " 字符)";
}
function setRegexEditors(_0x178c7f, _0x35cafa) {
  const _0x1ff6ca = [];
  if (_0x178c7f !== undefined && _0x178c7f !== null) {
    if (!beforeAfterEditor || beforeAfterEditor.length === 0) {
      _0x1ff6ca.push("❌ 前后正则编辑器不存在");
    } else {
      beforeAfterEditor.val(_0x178c7f);
      _0x1ff6ca.push("✅ 前后正则已设置");
    }
  }
  if (_0x35cafa !== undefined && _0x35cafa !== null) {
    if (!textEditor || textEditor.length === 0) {
      _0x1ff6ca.push("❌ 文字正则编辑器不存在");
    } else {
      textEditor.val(_0x35cafa);
      _0x1ff6ca.push("✅ 文字正则已设置");
    }
  }
  return _0x1ff6ca.join("\n");
}
function createRegexEntryByAI(_0x328e91) {
  if (!_0x328e91 || !_0x328e91.findRegex) {
    return "❌ 必须提供 findRegex 字段。";
  }
  const _0x3453b6 = regexEntriesContainer && $.contains(document, regexEntriesContainer[0]);
  if (!_0x3453b6) {
    regexEntriesContainer = $("#ch-regex-entries-container");
  }
  if (!regexEntriesContainer || regexEntriesContainer.length === 0) {
    return "❌ 正则条目容器不存在，请先切换到正则页面。";
  }
  regexEntriesContainer.find(".st-chatu8-entries-empty").remove();
  const _0x25052f = {
    ...DEFAULT_REGEX_ENTRY,
    id: generateRegexEntryId(),
    scriptName: _0x328e91.scriptName || "AI创建的正则",
    findRegex: _0x328e91.findRegex,
    replaceString: _0x328e91.replaceString || "",
    disabled: _0x328e91.disabled === true
  };
  addRegexEntryDOM(_0x25052f);
  saveRegexEntriesToProfile();
  return "✅ 已创建正则条目: \"" + _0x25052f.scriptName + "\"\n   查找: " + _0x25052f.findRegex.substring(0, 80) + "\n   替换: " + (_0x25052f.replaceString || "(空)").substring(0, 80);
}
async function triggerRegexTest() {
  try {
    await onTestRegexClick();
    await new Promise(_0x260c1b => setTimeout(_0x260c1b, 300));
    const _0x3feead = resultText ? resultText.val() : "";
    return "✅ 正则测试完成。\n结果文本:\n" + (_0x3feead ? _0x3feead.substring(0, 30000) : "(空)");
  } catch (_0x5b3ac4) {
    return "❌ 正则测试失败: " + _0x5b3ac4.message;
  }
}
function setRegexTestMode(_0x3c3e37) {
  if (!regexTestModeSwitch || regexTestModeSwitch.length === 0) {
    return "❌ 测试模式开关不存在，请先切换到正则页面。";
  }
  regexTestModeSwitch.prop("checked", !!_0x3c3e37).trigger("change");
  return "✅ 正则测试模式已" + (_0x3c3e37 ? "开启" : "关闭");
}
function getRegexResultText() {
  const _0x1a775f = resultText ? resultText.val() : "";
  return _0x1a775f || "(空)";
}
function setGestureEnabled(_0x54e739) {
  if (!gestureEnabledSwitch || gestureEnabledSwitch.length === 0) {
    return "❌ 手势功能开关不存在，请先切换到正则页面。";
  }
  gestureEnabledSwitch.prop("checked", !!_0x54e739).trigger("change");
  return "✅ 手势功能已" + (_0x54e739 ? "开启" : "关闭");
}
function setClickTriggerEnabled(_0xbe8219) {
  if (!clickTriggerEnabledSwitch || clickTriggerEnabledSwitch.length === 0) {
    return "❌ 点击触发开关不存在，请先切换到正则页面。";
  }
  clickTriggerEnabledSwitch.prop("checked", !!_0xbe8219).trigger("change");
  return "✅ 点击触发已" + (_0xbe8219 ? "开启" : "关闭");
}
function clearAllRegexEntries() {
  const _0x466975 = regexEntriesContainer && $.contains(document, regexEntriesContainer[0]);
  if (!_0x466975) {
    regexEntriesContainer = $("#ch-regex-entries-container");
  }
  if (!regexEntriesContainer || regexEntriesContainer.length === 0) {
    return "❌ 正则条目容器不存在，请先切换到正则页面。";
  }
  const _0x1af239 = regexEntriesContainer.find(".st-chatu8-preset-entry").length;
  regexEntriesContainer.empty();
  regexEntriesContainer.html("\n        <div class=\"st-chatu8-entries-empty\">\n            <i class=\"fa-solid fa-inbox\"></i>\n            <p>暂无正则条目，点击上方按钮添加</p>\n        </div>\n    ");
  saveRegexEntriesToProfile();
  return "✅ 已清除全部 " + _0x1af239 + " 个正则条目";
}
const _0x171f90 = {
  getStatus: getRegexTestStatus,
  setOriginalText: setRegexOriginalText,
  setEditors: setRegexEditors,
  createEntry: createRegexEntryByAI,
  triggerTest: triggerRegexTest,
  setTestMode: setRegexTestMode,
  getResultText: getRegexResultText,
  setGestureEnabled: setGestureEnabled,
  setClickTriggerEnabled: setClickTriggerEnabled,
  clearAllEntries: clearAllRegexEntries
};
window.regexAIBridge = _0x171f90;