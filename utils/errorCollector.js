import { extensionName } from "./config.js";
let errorEntries = [];
const MAX_ERROR_ENTRIES = 500;
export function collectError(_0x3cb4cc, _0x484986, _0x2f6215) {
  const _0x4fde02 = {
    timestamp: Date.now(),
    type: _0x3cb4cc || "unknown",
    message: _0x484986 || "未知错误"
  };
  if (_0x2f6215 instanceof Error) {
    _0x4fde02.stack = _0x2f6215.stack;
    _0x4fde02.errorName = _0x2f6215.name;
    _0x4fde02.errorMessage = _0x2f6215.message;
  } else if (_0x2f6215 && typeof _0x2f6215 === "object") {
    _0x4fde02.context = _0x2f6215;
  }
  errorEntries.push(_0x4fde02);
  if (errorEntries.length > MAX_ERROR_ENTRIES) {
    errorEntries.shift();
  }
  console.error("[" + extensionName + "] " + _0x3cb4cc + ": " + _0x484986, _0x2f6215);
}
export function wrapWithErrorHandler(_0x12b6f3, _0x59ef26) {
  return async function (..._0x26e65e) {
    try {
      return await _0x12b6f3.apply(this, _0x26e65e);
    } catch (_0x2e5bd8) {
      collectError("runtime", "函数 " + _0x59ef26 + " 执行失败", _0x2e5bd8);
      throw _0x2e5bd8;
    }
  };
}
let globalErrorHandlerInstalled = false;
export function installGlobalErrorHandler() {
  if (globalErrorHandlerInstalled) {
    return;
  }
  window.addEventListener("unhandledrejection", _0x367a64 => {
    try {
      collectError("unhandled_promise", "未处理的 Promise 拒绝", _0x367a64.reason);
    } catch (_0x20b052) {}
  });
  const _0x2e5800 = window.onerror;
  window.onerror = function (_0x2fc2a3, _0x55ff8f, _0x4374ca, _0x3c2bc0, _0x3501ba) {
    try {
      const _0x419e0e = {
        source: _0x55ff8f,
        lineno: _0x4374ca,
        colno: _0x3c2bc0,
        error: _0x3501ba
      };
      collectError("global", "全局错误: " + _0x2fc2a3, _0x419e0e);
    } catch (_0x7bc786) {}
    if (_0x2e5800) {
      return _0x2e5800.apply(this, arguments);
    }
    return false;
  };
  const _0x473e5c = window.alert;
  window.alert = function (_0x467ed7) {
    try {
      const _0x186068 = String(_0x467ed7 || "");
      const _0xa3954d = /失败|错误|Error|Failed|异常|Exception|无法|不能|问题/i.test(_0x186068);
      if (_0xa3954d) {
        const _0x413948 = {
          message: _0x186068
        };
        collectError("alert", "Alert 错误提示", _0x413948);
      }
    } catch (_0x50ffac) {}
    return _0x473e5c.call(window, _0x467ed7);
  };
  if (window.toastr && typeof window.toastr.error === "function") {
    const _0x5e7520 = window.toastr.error;
    window.toastr.error = function (_0x57fad9, _0x288f98, _0x4cb36c) {
      try {
        collectError("toastr", _0x288f98 || "Toastr 错误", {
          message: String(_0x57fad9 || ""),
          title: String(_0x288f98 || "")
        });
      } catch (_0x123f4a) {}
      return _0x5e7520.call(window.toastr, _0x57fad9, _0x288f98, _0x4cb36c);
    };
  }
  globalErrorHandlerInstalled = true;
  console.log("[" + extensionName + "] 全局错误处理器已安装");
}
export function getAllErrors() {
  return [...errorEntries];
}
export function getRecentErrors(_0x3c3d70 = 10) {
  return errorEntries.slice(-_0x3c3d70);
}
export function getErrorsByType(_0x122aaa) {
  return errorEntries.filter(_0x269d34 => _0x269d34.type === _0x122aaa);
}
export function getErrorStats() {
  const _0x3b02d8 = {
    total: errorEntries.length,
    byType: {},
    recent24h: 0,
    recentHour: 0
  };
  const _0x4ee103 = _0x3b02d8;
  const _0x159ce0 = Date.now();
  const _0x5b0451 = 3600000;
  const _0x23d0f9 = _0x5b0451 * 24;
  for (const _0x2e9023 of errorEntries) {
    _0x4ee103.byType[_0x2e9023.type] = (_0x4ee103.byType[_0x2e9023.type] || 0) + 1;
    const _0x4ad436 = _0x159ce0 - _0x2e9023.timestamp;
    if (_0x4ad436 < _0x5b0451) {
      _0x4ee103.recentHour++;
    }
    if (_0x4ad436 < _0x23d0f9) {
      _0x4ee103.recent24h++;
    }
  }
  return _0x4ee103;
}
export function clearErrors() {
  errorEntries = [];
  console.log("[" + extensionName + "] 错误记录已清空");
}
export function exportErrors() {
  if (errorEntries.length === 0) {
    return "暂无错误记录。";
  }
  const _0x27a5e4 = [];
  const _0x56dc1d = new Date();
  _0x27a5e4.push("========================================");
  _0x27a5e4.push("🚨 错误日志导出");
  _0x27a5e4.push("生成时间: " + formatTimestamp(_0x56dc1d.getTime()));
  _0x27a5e4.push("总错误数: " + errorEntries.length);
  _0x27a5e4.push("========================================");
  _0x27a5e4.push("");
  const _0x4f73f8 = getErrorStats();
  _0x27a5e4.push("【错误统计】");
  _0x27a5e4.push("最近 1 小时: " + _0x4f73f8.recentHour + " 个错误");
  _0x27a5e4.push("最近 24 小时: " + _0x4f73f8.recent24h + " 个错误");
  _0x27a5e4.push("按类型分布:");
  for (const [_0x1290bb, _0x4a06d2] of Object.entries(_0x4f73f8.byType)) {
    _0x27a5e4.push("  - " + _0x1290bb + ": " + _0x4a06d2);
  }
  _0x27a5e4.push("");
  _0x27a5e4.push("========================================");
  _0x27a5e4.push("");
  for (const _0x57716f of errorEntries) {
    const _0x3e889a = formatTimestamp(_0x57716f.timestamp);
    _0x27a5e4.push("[" + _0x3e889a + "] ❌ " + _0x57716f.type.toUpperCase());
    _0x27a5e4.push("  消息: " + _0x57716f.message);
    if (_0x57716f.errorName) {
      _0x27a5e4.push("  错误名: " + _0x57716f.errorName);
    }
    if (_0x57716f.errorMessage) {
      _0x27a5e4.push("  错误详情: " + _0x57716f.errorMessage);
    }
    if (_0x57716f.stack) {
      _0x27a5e4.push("  堆栈:");
      const _0x4cd0a6 = _0x57716f.stack.split("\n").slice(0, 5);
      _0x4cd0a6.forEach(_0x2e8814 => _0x27a5e4.push("    " + _0x2e8814));
    }
    if (_0x57716f.context) {
      _0x27a5e4.push("  上下文: " + JSON.stringify(_0x57716f.context, null, 2));
    }
    _0x27a5e4.push("");
  }
  _0x27a5e4.push("========================================");
  _0x27a5e4.push("错误日志结束 - 共 " + errorEntries.length + " 条记录");
  _0x27a5e4.push("========================================");
  return _0x27a5e4.join("\n");
}
function formatTimestamp(_0x5d38a3) {
  const _0x3d48ba = new Date(_0x5d38a3);
  const _0xbaae60 = _0x3d48ba.getFullYear();
  const _0x23e399 = String(_0x3d48ba.getMonth() + 1).padStart(2, "0");
  const _0x2b5caa = String(_0x3d48ba.getDate()).padStart(2, "0");
  const _0x29ae56 = String(_0x3d48ba.getHours()).padStart(2, "0");
  const _0x335729 = String(_0x3d48ba.getMinutes()).padStart(2, "0");
  const _0x5a907f = String(_0x3d48ba.getSeconds()).padStart(2, "0");
  return _0xbaae60 + "-" + _0x23e399 + "-" + _0x2b5caa + " " + _0x29ae56 + ":" + _0x335729 + ":" + _0x5a907f;
}
export function collectApiError(_0x37c4eb, _0x2ee4b8) {
  collectError("api", "API 调用失败: " + _0x37c4eb, _0x2ee4b8);
}
export function collectValidationError(_0x59bfd8, _0x5b1045) {
  const _0x140b0c = {
    reason: _0x5b1045
  };
  collectError("validation", "验证失败: " + _0x59bfd8, _0x140b0c);
}
export function collectConfigError(_0xa3e8fd, _0x47adbc) {
  const _0xff9641 = {
    reason: _0x47adbc
  };
  collectError("config", "配置错误: " + _0xa3e8fd, _0xff9641);
}