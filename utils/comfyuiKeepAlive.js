import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { getRequestHeaders } from "./utils.js";
let keepAliveTimer = null;
const KEEP_ALIVE_INTERVAL = 30000;
const PING_TIMEOUT = 5000;
let consecutiveErrors = 0;
let keepAliveSuspended = false;
function shouldKeepAlive() {
  const _0xe85b93 = extension_settings[extensionName];
  if (!_0xe85b93) {
    return false;
  }
  const _0xfbf909 = _0xe85b93.scriptEnabled === true || _0xe85b93.scriptEnabled === "true";
  const _0x5bce07 = _0xe85b93.mode === "comfyui";
  return _0xfbf909 && _0x5bce07 && !keepAliveSuspended;
}
function pingViaSillyTavern() {
  const _0x1795a1 = extension_settings[extensionName]?.comfyuiUrl?.trim();
  if (!_0x1795a1) {
    return;
  }
  const _0x5ba535 = new AbortController();
  const _0x553eda = setTimeout(() => _0x5ba535.abort(), PING_TIMEOUT);
  const _0xa13aa2 = {
    url: _0x1795a1
  };
  fetch("/api/sd/comfy/ping", {
    method: "POST",
    headers: getRequestHeaders(window.token),
    body: JSON.stringify(_0xa13aa2),
    signal: _0x5ba535.signal
  }).then(_0x4f335c => {
    if (!_0x4f335c.ok) {
      throw new Error("[ComfyUI KeepAlive] HTTP error! status: " + _0x4f335c.status);
    }
    consecutiveErrors = 0;
  }).catch(_0x799be7 => {
    console.warn("[ComfyUI KeepAlive] Ping 请求失败:", _0x799be7);
    consecutiveErrors++;
    checkErrorCountAndSuspend();
  }).finally(() => {
    clearTimeout(_0x553eda);
  });
}
function pingDirect() {
  const _0x2dc24e = extension_settings[extensionName]?.comfyuiUrl?.trim();
  if (!_0x2dc24e) {
    return;
  }
  const _0x14e3bd = new AbortController();
  const _0x5a191c = setTimeout(() => _0x14e3bd.abort(), PING_TIMEOUT);
  fetch(_0x2dc24e + "/system_stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    signal: _0x14e3bd.signal
  }).then(_0x4e3a57 => {
    if (!_0x4e3a57.ok) {
      throw new Error("[ComfyUI KeepAlive] HTTP error! status: " + _0x4e3a57.status);
    }
    consecutiveErrors = 0;
  }).catch(_0x307845 => {
    console.warn("[ComfyUI KeepAlive] Direct Ping 请求失败:", _0x307845);
    consecutiveErrors++;
    checkErrorCountAndSuspend();
  }).finally(() => {
    clearTimeout(_0x5a191c);
  });
}
function checkErrorCountAndSuspend() {
  if (consecutiveErrors >= 2) {
    console.log("[ComfyUI KeepAlive] 连续 2 次请求失败，已自动暂停保活检测。如需恢复检测，请修改地址或重新点击测试。");
    keepAliveSuspended = true;
    stopKeepAlive();
  }
}
function doPing() {
  if (!shouldKeepAlive()) {
    return;
  }
  const _0x1afbea = extension_settings[extensionName]?.client;
  if (_0x1afbea === "jiuguan") {
    pingViaSillyTavern();
  } else {
    pingDirect();
  }
}
export function startKeepAlive() {
  stopKeepAlive();
  if (!shouldKeepAlive()) {
    console.log("[ComfyUI KeepAlive] 条件不满足或已暂停，不启动保活");
    return;
  }
  console.log("[ComfyUI KeepAlive] 启动保活定时器，间隔:", KEEP_ALIVE_INTERVAL, "ms");
  doPing();
  keepAliveTimer = setInterval(doPing, KEEP_ALIVE_INTERVAL);
}
export function stopKeepAlive() {
  if (keepAliveTimer) {
    console.log("[ComfyUI KeepAlive] 停止保活定时器");
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}
export function updateKeepAliveStatus() {
  if (shouldKeepAlive()) {
    if (!keepAliveTimer) {
      startKeepAlive();
    }
  } else {
    stopKeepAlive();
  }
}
export function initializeKeepAlive() {
  console.log("[ComfyUI KeepAlive] 初始化保活模块");
  updateKeepAliveStatus();
}
export function resetKeepAliveState() {
  console.log("[ComfyUI KeepAlive] 状态已重置，重新开始保活检测");
  consecutiveErrors = 0;
  keepAliveSuspended = false;
  updateKeepAliveStatus();
}