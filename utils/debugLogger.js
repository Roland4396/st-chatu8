let debugLogEntries = [];
let debugModeEnabled = false;
let globalSessionStartTime = null;
let currentSessionName = "";
export function isDebugEnabled() {
  return debugModeEnabled;
}
export function toggleDebug(_0x5402c5) {
  if (typeof _0x5402c5 === "boolean") {
    debugModeEnabled = _0x5402c5;
  } else {
    debugModeEnabled = !debugModeEnabled;
  }
  if (debugModeEnabled) {
    debugLogEntries.push({
      timestamp: Date.now(),
      type: "system",
      functionName: "debugLogger",
      message: "🔧 调试模式已启用"
    });
  }
  return debugModeEnabled;
}
export function debugStartSession(_0x6dde77) {
  globalSessionStartTime = Date.now();
  currentSessionName = _0x6dde77 || "调试会话";
  if (debugModeEnabled) {
    const _0x1b9313 = {
      timestamp: globalSessionStartTime,
      type: "session_start",
      functionName: "debugLogger",
      message: "🚀 会话开始: " + currentSessionName,
      elapsed: 0
    };
    debugLogEntries.push(_0x1b9313);
  }
}
export function getSessionElapsed() {
  if (!globalSessionStartTime) {
    return 0;
  }
  return Date.now() - globalSessionStartTime;
}
export function debugLog(_0x4dda2e, _0x15fc1b, _0x2c2553) {
  if (!debugModeEnabled) {
    return;
  }
  debugLogEntries.push({
    timestamp: Date.now(),
    type: "log",
    functionName: _0x4dda2e,
    message: _0x15fc1b,
    context: _0x2c2553,
    elapsed: getSessionElapsed()
  });
}
export function debugBranch(_0x186fc9, _0x543751, _0x274c17, _0x2297f4) {
  if (!debugModeEnabled) {
    return;
  }
  const _0x3327a9 = {
    entered: !!_0x274c17
  };
  const _0x4db625 = _0x3327a9;
  if (_0x2297f4) {
    _0x4db625.条件详情 = _0x2297f4;
  }
  debugLogEntries.push({
    timestamp: Date.now(),
    type: "branch",
    functionName: _0x186fc9,
    message: "分支: " + _0x543751,
    context: _0x4db625,
    elapsed: getSessionElapsed()
  });
}
export function debugTimer(_0x36dca2, _0x1a412f) {
  const _0x18407c = Date.now();
  const _0x332fb5 = getSessionElapsed();
  if (debugModeEnabled) {
    const _0x2504de = {
      timestamp: _0x18407c,
      type: "timer_start",
      functionName: _0x36dca2,
      message: _0x1a412f || "⏱️ 开始计时",
      elapsed: _0x332fb5
    };
    debugLogEntries.push(_0x2504de);
  }
  return {
    end(_0x1196a3) {
      const _0x948b07 = Date.now();
      const _0x3c555e = _0x948b07 - _0x18407c;
      const _0x1f33f2 = getSessionElapsed();
      if (debugModeEnabled) {
        debugLogEntries.push({
          timestamp: _0x948b07,
          type: "timer_end",
          functionName: _0x36dca2,
          message: _0x1196a3 || "⏱️ 计时结束",
          duration: _0x3c555e,
          elapsed: _0x1f33f2
        });
      }
      return _0x3c555e;
    }
  };
}
export function getDebugLog() {
  return debugLogEntries;
}
export function getDebugLogCount() {
  return debugLogEntries.length;
}
export function clearDebugLog() {
  debugLogEntries = [];
}
export function exportDebugLog() {
  if (debugLogEntries.length === 0) {
    return "调试日志为空。";
  }
  const _0x2f667e = [];
  const _0x3d066b = new Date();
  const _0x1e2c5b = debugLogEntries[0];
  const _0x13013d = debugLogEntries[debugLogEntries.length - 1];
  const _0x149bdc = _0x13013d.timestamp - _0x1e2c5b.timestamp;
  _0x2f667e.push("========================================");
  _0x2f667e.push("🔧 调试日志导出");
  _0x2f667e.push("生成时间: " + formatTimestamp(_0x3d066b.getTime()));
  _0x2f667e.push("总条数: " + debugLogEntries.length);
  _0x2f667e.push("总耗时: " + _0x149bdc + "ms");
  if (currentSessionName) {
    _0x2f667e.push("会话名称: " + currentSessionName);
  }
  _0x2f667e.push("========================================");
  _0x2f667e.push("");
  const _0xed3ed = _0x4e480e => {
    if (_0x4e480e === undefined || _0x4e480e === null) {
      return "";
    }
    return " [+" + _0x4e480e + "ms]";
  };
  const _0x5b1ba0 = _0x4ac444 => {
    if (!_0x4ac444) {
      return "";
    }
    return JSON.stringify(_0x4ac444, null, 2).split("\n").map((_0x569aa0, _0x57fca1) => _0x57fca1 === 0 ? _0x569aa0 : "    " + _0x569aa0).join("\n");
  };
  for (const _0x436ab9 of debugLogEntries) {
    const _0x49ecf5 = formatTimestamp(_0x436ab9.timestamp);
    const _0x4c7bf9 = _0xed3ed(_0x436ab9.elapsed);
    switch (_0x436ab9.type) {
      case "session_start":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " 🚀 " + _0x436ab9.message);
        _0x2f667e.push("----------------------------------------");
        _0x2f667e.push("");
        break;
      case "log":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " 📝 " + _0x436ab9.functionName);
        _0x2f667e.push("  描述: " + _0x436ab9.message);
        if (_0x436ab9.context) {
          _0x2f667e.push("  上下文: " + _0x5b1ba0(_0x436ab9.context));
        }
        _0x2f667e.push("");
        break;
      case "branch":
        const _0x5c9a61 = _0x436ab9.context?.entered ? "✓" : "✗";
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " ⤷ " + _0x436ab9.message + " " + _0x5c9a61);
        if (_0x436ab9.context?.条件详情) {
          _0x2f667e.push("  条件详情: " + _0x5b1ba0(_0x436ab9.context.条件详情));
        }
        _0x2f667e.push("");
        break;
      case "timer_start":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " ⏱️ " + _0x436ab9.functionName + " 开始");
        if (_0x436ab9.message && _0x436ab9.message !== "⏱️ 开始计时") {
          _0x2f667e.push("  描述: " + _0x436ab9.message);
        }
        _0x2f667e.push("");
        break;
      case "timer_end":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " ⏱️ " + _0x436ab9.functionName + " 结束 (耗时: " + _0x436ab9.duration + "ms)");
        if (_0x436ab9.message && _0x436ab9.message !== "⏱️ 计时结束") {
          _0x2f667e.push("  结果: " + _0x436ab9.message);
        }
        _0x2f667e.push("");
        break;
      case "content":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " " + _0x436ab9.message);
        if (_0x436ab9.context?.内容) {
          _0x2f667e.push("  内容: " + _0x436ab9.context.内容);
        }
        if (_0x436ab9.context?.原始长度) {
          _0x2f667e.push("  长度: " + _0x436ab9.context.原始长度 + " 字符" + (_0x436ab9.context.已截断 ? " (已截断)" : ""));
        }
        _0x2f667e.push("");
        break;
      case "element":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " " + _0x436ab9.message);
        if (_0x436ab9.context) {
          _0x2f667e.push("  元素信息: " + _0x5b1ba0(_0x436ab9.context));
        }
        _0x2f667e.push("");
        break;
      case "milestone":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " " + _0x436ab9.message);
        _0x2f667e.push("");
        break;
      case "error":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " " + _0x436ab9.message);
        if (_0x436ab9.context) {
          _0x2f667e.push("  错误详情: " + _0x5b1ba0(_0x436ab9.context));
        }
        _0x2f667e.push("");
        break;
      case "system":
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " 🔧 " + _0x436ab9.message);
        _0x2f667e.push("");
        break;
      default:
        _0x2f667e.push("[" + _0x49ecf5 + "]" + _0x4c7bf9 + " " + _0x436ab9.functionName + ": " + _0x436ab9.message);
        if (_0x436ab9.context) {
          _0x2f667e.push("  上下文: " + _0x5b1ba0(_0x436ab9.context));
        }
        _0x2f667e.push("");
    }
  }
  _0x2f667e.push("========================================");
  _0x2f667e.push("日志结束 - 总耗时: " + _0x149bdc + "ms");
  _0x2f667e.push("========================================");
  return _0x2f667e.join("\n");
}
function formatTimestamp(_0x3e3a85) {
  const _0x1f10be = new Date(_0x3e3a85);
  const _0x4f6953 = _0x1f10be.getFullYear();
  const _0x312ed3 = String(_0x1f10be.getMonth() + 1).padStart(2, "0");
  const _0x2d61f6 = String(_0x1f10be.getDate()).padStart(2, "0");
  const _0x3f764f = String(_0x1f10be.getHours()).padStart(2, "0");
  const _0x45ff7d = String(_0x1f10be.getMinutes()).padStart(2, "0");
  const _0x2b1cdc = String(_0x1f10be.getSeconds()).padStart(2, "0");
  const _0x1759da = String(_0x1f10be.getMilliseconds()).padStart(3, "0");
  return _0x4f6953 + "-" + _0x312ed3 + "-" + _0x2d61f6 + " " + _0x3f764f + ":" + _0x45ff7d + ":" + _0x2b1cdc + "." + _0x1759da;
}
export function debugError(_0x553895, _0x5e2ab6, _0xbf4bea) {
  if (!debugModeEnabled) {
    return;
  }
  const _0x1f12e0 = _0xbf4bea instanceof Error ? {
    errorName: _0xbf4bea.name,
    errorMessage: _0xbf4bea.message
  } : _0xbf4bea;
  debugLogEntries.push({
    timestamp: Date.now(),
    type: "error",
    functionName: _0x553895,
    message: "❌ " + _0x5e2ab6,
    context: _0x1f12e0,
    elapsed: getSessionElapsed()
  });
}
export function debugMilestone(_0x329785, _0x590fb6) {
  if (!debugModeEnabled) {
    return;
  }
  debugLogEntries.push({
    timestamp: Date.now(),
    type: "milestone",
    functionName: _0x329785,
    message: "🎯 " + _0x590fb6,
    elapsed: getSessionElapsed()
  });
}
export function debugContent(_0x2af926, _0x40586e, _0x3517a, _0x181d9f = 200) {
  if (!debugModeEnabled) {
    return;
  }
  const _0x3fa13d = String(_0x3517a || "");
  const _0x5f42b2 = _0x3fa13d.length > _0x181d9f;
  const _0x3a0958 = _0x5f42b2 ? _0x3fa13d.substring(0, _0x181d9f) + ("... [截断，原长度: " + _0x3fa13d.length + "]") : _0x3fa13d;
  const _0x2c844b = {
    内容: _0x3a0958,
    原始长度: _0x3fa13d.length,
    已截断: _0x5f42b2
  };
  debugLogEntries.push({
    timestamp: Date.now(),
    type: "content",
    functionName: _0x2af926,
    message: "📝 " + _0x40586e,
    context: _0x2c844b,
    elapsed: getSessionElapsed()
  });
}
export function debugElement(_0x18c2ec, _0x1d31db, _0x2eb3c8) {
  if (!debugModeEnabled) {
    return;
  }
  if (!_0x2eb3c8) {
    debugLogEntries.push({
      timestamp: Date.now(),
      type: "element",
      functionName: _0x18c2ec,
      message: "🔲 " + _0x1d31db + ": null/undefined",
      context: {
        元素: null
      },
      elapsed: getSessionElapsed()
    });
    return;
  }
  const _0xc573d6 = {
    标签名: _0x2eb3c8.tagName,
    类名: _0x2eb3c8.className || "(无)",
    ID: _0x2eb3c8.id || "(无)",
    mesId: _0x2eb3c8.getAttribute?.("mesid") || _0x2eb3c8.closest?.(".mes")?.getAttribute?.("mesid") || "(无)",
    文本预览: (_0x2eb3c8.textContent || "").substring(0, 50) + (_0x2eb3c8.textContent?.length > 50 ? "..." : ""),
    文本长度: _0x2eb3c8.textContent?.length || 0,
    是否为mes_text: _0x2eb3c8.classList?.contains?.("mes_text") || false,
    在iframe中: _0x2eb3c8.ownerDocument !== document
  };
  debugLogEntries.push({
    timestamp: Date.now(),
    type: "element",
    functionName: _0x18c2ec,
    message: "🔲 " + _0x1d31db,
    context: _0xc573d6,
    elapsed: getSessionElapsed()
  });
}