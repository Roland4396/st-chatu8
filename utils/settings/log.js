import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { getLog, clearLog } from "../utils.js";
import { stylishConfirm } from "../ui_common.js";
import { initTaskManager, updateTaskManagerView } from "./taskManager.js";
import { isDebugEnabled, toggleDebug, getDebugLogCount, clearDebugLog, exportDebugLog } from "../debugLogger.js";
import { getAllErrors, getErrorStats, clearErrors, exportErrors } from "../errorCollector.js";
function updateLogView() {
  const _0x4e065f = document.getElementById("ch-log-textarea");
  if (_0x4e065f) {
    _0x4e065f.value = getLog();
    _0x4e065f.scrollTop = 0;
  }
  updateTaskManagerView();
  updateDebugStatus();
}
function handleExportLog() {
  const _0x4eadd8 = getLog();
  if (!_0x4eadd8 || _0x4eadd8.trim() === "") {
    alert("日志为空。");
    return;
  }
  const _0xdc374c = new Blob([_0x4eadd8], {
    type: "text/plain;charset=utf-8"
  });
  const _0x3a8e53 = URL.createObjectURL(_0xdc374c);
  const _0x331054 = document.createElement("a");
  _0x331054.href = _0x3a8e53;
  _0x331054.download = "st-chatu8-log-" + new Date().toISOString().slice(0, 19).replace(/:/g, "-") + ".txt";
  document.body.appendChild(_0x331054);
  _0x331054.click();
  document.body.removeChild(_0x331054);
  URL.revokeObjectURL(_0x3a8e53);
}
function handleClearLog() {
  stylishConfirm("确定要清空所有日志吗？此操作不可撤销。").then(_0x226da1 => {
    if (_0x226da1) {
      clearLog();
      saveSettingsDebounced();
      updateLogView();
      alert("日志已清空。");
    }
  });
}
function updateDebugStatus() {
  const _0x354ac3 = isDebugEnabled();
  const _0x404232 = getDebugLogCount();
  const _0x35ca6e = document.getElementById("ch-debug-mode-toggle");
  const _0x162b08 = document.getElementById("ch-debug-status");
  const _0x9db98f = document.getElementById("ch-download-debug-log");
  const _0x45827f = document.getElementById("ch-clear-debug-log");
  if (_0x35ca6e) {
    _0x35ca6e.checked = _0x354ac3;
  }
  if (_0x162b08) {
    if (_0x354ac3) {
      _0x162b08.textContent = "已启用 (" + _0x404232 + " 条记录)";
      _0x162b08.style.color = "#4CAF50";
    } else {
      _0x162b08.textContent = _0x404232 > 0 ? "已禁用 (" + _0x404232 + " 条记录)" : "已禁用";
      _0x162b08.style.color = "#999";
    }
  }
  if (_0x9db98f) {
    _0x9db98f.disabled = _0x404232 === 0;
  }
  if (_0x45827f) {
    _0x45827f.disabled = _0x404232 === 0;
  }
}
function updateErrorStats() {
  const _0x5ce5fa = getErrorStats();
  const _0x2aa4bd = document.getElementById("ch-error-stats");
  const _0x1a050c = document.getElementById("ch-download-errors");
  const _0x351554 = document.getElementById("ch-clear-errors");
  if (_0x2aa4bd) {
    if (_0x5ce5fa.total === 0) {
      _0x2aa4bd.innerHTML = "<span style=\"color: #4CAF50;\">✓ 暂无错误记录</span>";
    } else {
      let _0x3c7b6e = "<div>总错误数: <strong>" + _0x5ce5fa.total + "</strong></div>";
      _0x3c7b6e += "<div>最近 1 小时: <strong style=\"color: " + (_0x5ce5fa.recentHour > 0 ? "#f44336" : "#4CAF50") + "\">" + _0x5ce5fa.recentHour + "</strong></div>";
      _0x3c7b6e += "<div>最近 24 小时: <strong>" + _0x5ce5fa.recent24h + "</strong></div>";
      if (Object.keys(_0x5ce5fa.byType).length > 0) {
        _0x3c7b6e += "<div style=\"margin-top: 5px;\">按类型分布:</div>";
        _0x3c7b6e += "<div style=\"margin-left: 10px;\">";
        for (const [_0x399e38, _0x28801a] of Object.entries(_0x5ce5fa.byType)) {
          _0x3c7b6e += "<div>• " + _0x399e38 + ": " + _0x28801a + "</div>";
        }
        _0x3c7b6e += "</div>";
      }
      _0x2aa4bd.innerHTML = _0x3c7b6e;
    }
  }
  if (_0x1a050c) {
    _0x1a050c.disabled = _0x5ce5fa.total === 0;
  }
  if (_0x351554) {
    _0x351554.disabled = _0x5ce5fa.total === 0;
  }
}
function handleDebugToggle(_0x125ca9) {
  const _0x191849 = _0x125ca9.target.checked;
  toggleDebug(_0x191849);
  updateDebugStatus();
  if (_0x191849) {
    toastr.info("🔧 调试模式已启用，开始记录详细日志");
  } else {
    toastr.info("调试模式已禁用");
  }
}
function handleDownloadDebugLog() {
  const _0x1071f4 = exportDebugLog();
  if (!_0x1071f4 || _0x1071f4 === "调试日志为空。") {
    alert("调试日志为空。");
    return;
  }
  const _0xd9b01d = new Blob([_0x1071f4], {
    type: "text/plain;charset=utf-8"
  });
  const _0x4c6d1d = URL.createObjectURL(_0xd9b01d);
  const _0x470408 = document.createElement("a");
  _0x470408.href = _0x4c6d1d;
  _0x470408.download = "st-chatu8-debug-" + new Date().toISOString().slice(0, 19).replace(/:/g, "-") + ".txt";
  document.body.appendChild(_0x470408);
  _0x470408.click();
  document.body.removeChild(_0x470408);
  URL.revokeObjectURL(_0x4c6d1d);
  toastr.success("调试日志已下载");
}
function handleClearDebugLog() {
  stylishConfirm("确定要清空调试日志吗？").then(_0x20c3d2 => {
    if (_0x20c3d2) {
      clearDebugLog();
      updateDebugStatus();
      toastr.info("调试日志已清空。");
    }
  });
}
function handleViewErrors() {
  const _0x4946f3 = getAllErrors();
  if (_0x4946f3.length === 0) {
    alert("暂无错误记录。");
    return;
  }
  const _0x14da3d = document.createElement("div");
  _0x14da3d.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;";
  const _0x3d7cba = document.createElement("div");
  _0x3d7cba.style.cssText = "background: white; border-radius: 8px; padding: 20px; max-width: 800px; max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3);";
  let _0xaab35a = "<h3 style=\"margin-top: 0;\">错误详情</h3>";
  _0xaab35a += "<div style=\"font-family: monospace; font-size: 12px; line-height: 1.6;\">";
  const _0x57bc47 = _0x4946f3.slice(-20).reverse();
  for (const _0x19c7c5 of _0x57bc47) {
    const _0x5ec737 = new Date(_0x19c7c5.timestamp).toLocaleString();
    _0xaab35a += "<div style=\"border-bottom: 1px solid #eee; padding: 10px 0;\">";
    _0xaab35a += "<div style=\"color: #f44336; font-weight: bold;\">[" + _0x5ec737 + "] " + _0x19c7c5.type.toUpperCase() + "</div>";
    _0xaab35a += "<div style=\"margin: 5px 0;\"><strong>类型:</strong> " + escapeHtml(_0x19c7c5.message) + "</div>";
    if (_0x19c7c5.context && _0x19c7c5.context.message) {
      _0xaab35a += "<div style=\"margin: 5px 0;\"><strong>内容:</strong> " + escapeHtml(_0x19c7c5.context.message) + "</div>";
    }
    if (_0x19c7c5.context && _0x19c7c5.context.title) {
      _0xaab35a += "<div style=\"margin: 5px 0;\"><strong>标题:</strong> " + escapeHtml(_0x19c7c5.context.title) + "</div>";
    }
    if (_0x19c7c5.errorMessage) {
      _0xaab35a += "<div style=\"margin: 5px 0;\"><strong>详情:</strong> " + escapeHtml(_0x19c7c5.errorMessage) + "</div>";
    }
    if (_0x19c7c5.errorName) {
      _0xaab35a += "<div style=\"margin: 5px 0;\"><strong>错误名:</strong> " + escapeHtml(_0x19c7c5.errorName) + "</div>";
    }
    if (_0x19c7c5.stack) {
      const _0x5419f1 = _0x19c7c5.stack.split("\n").slice(0, 3);
      _0xaab35a += "<div style=\"margin: 5px 0;\"><strong>堆栈:</strong></div>";
      _0xaab35a += "<pre style=\"background: #f5f5f5; padding: 5px; overflow-x: auto; font-size: 11px;\">" + escapeHtml(_0x5419f1.join("\n")) + "</pre>";
    }
    _0xaab35a += "</div>";
  }
  _0xaab35a += "</div>";
  _0xaab35a += "<div style=\"text-align: right; margin-top: 15px;\"><button id=\"close-error-modal\" style=\"padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;\">关闭</button></div>";
  _0x3d7cba.innerHTML = _0xaab35a;
  _0x14da3d.appendChild(_0x3d7cba);
  document.body.appendChild(_0x14da3d);
  document.getElementById("close-error-modal").addEventListener("click", () => {
    document.body.removeChild(_0x14da3d);
  });
  _0x14da3d.addEventListener("click", _0x10e367 => {
    if (_0x10e367.target === _0x14da3d) {
      document.body.removeChild(_0x14da3d);
    }
  });
}
function handleDownloadErrors() {
  const _0x2049ef = exportErrors();
  if (!_0x2049ef || _0x2049ef === "暂无错误记录。") {
    alert("错误日志为空。");
    return;
  }
  const _0x3e9b4c = new Blob([_0x2049ef], {
    type: "text/plain;charset=utf-8"
  });
  const _0x137c31 = URL.createObjectURL(_0x3e9b4c);
  const _0x220b23 = document.createElement("a");
  _0x220b23.href = _0x137c31;
  _0x220b23.download = "st-chatu8-errors-" + new Date().toISOString().slice(0, 19).replace(/:/g, "-") + ".txt";
  document.body.appendChild(_0x220b23);
  _0x220b23.click();
  document.body.removeChild(_0x220b23);
  URL.revokeObjectURL(_0x137c31);
  toastr.success("错误日志已下载");
}
function handleClearErrors() {
  stylishConfirm("确定要清空所有错误记录吗？").then(_0x3fc2f1 => {
    if (_0x3fc2f1) {
      clearErrors();
      updateErrorStats();
      toastr.info("错误记录已清空。");
    }
  });
}
function escapeHtml(_0x521a9d) {
  const _0x21c38d = document.createElement("div");
  _0x21c38d.textContent = _0x521a9d;
  return _0x21c38d.innerHTML;
}
export function initLogSettings(_0x484ced) {
  _0x484ced.find("#ch-export-log").on("click", handleExportLog);
  _0x484ced.find("#ch-clear-log").on("click", handleClearLog);
  _0x484ced.find("#ch-debug-mode-toggle").on("change", handleDebugToggle);
  _0x484ced.find("#ch-download-debug-log").on("click", handleDownloadDebugLog);
  _0x484ced.find("#ch-clear-debug-log").on("click", handleClearDebugLog);
  _0x484ced.find("#ch-view-errors").on("click", handleViewErrors);
  _0x484ced.find("#ch-download-errors").on("click", handleDownloadErrors);
  _0x484ced.find("#ch-clear-errors").on("click", handleClearErrors);
  initTaskManager(_0x484ced);
  updateDebugStatus();
  updateErrorStats();
}
export { updateLogView, updateDebugStatus, updateErrorStats };