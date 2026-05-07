import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { addLog } from "./utils.js";
const POLL_INTERVAL = 1000;
const MAX_POLL_RETRIES = 3;
export function getUserId() {
  let _0x8c635a = localStorage.getItem("chatu8_uid");
  if (!_0x8c635a) {
    _0x8c635a = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2);
    localStorage.setItem("chatu8_uid", _0x8c635a);
  }
  return _0x8c635a;
}
export async function hashKey(_0x4701f3) {
  if (crypto && crypto.subtle && typeof crypto.subtle.digest === "function") {
    const _0x21282f = new TextEncoder();
    const _0x4bf2dc = _0x21282f.encode(_0x4701f3);
    const _0x51414e = await crypto.subtle.digest("SHA-256", _0x4bf2dc);
    const _0x3f7944 = Array.from(new Uint8Array(_0x51414e));
    return _0x3f7944.map(_0x19471d => _0x19471d.toString(16).padStart(2, "0")).join("");
  } else if (typeof CryptoJS !== "undefined" && CryptoJS.SHA256) {
    const _0x2ab074 = CryptoJS.SHA256(_0x4701f3);
    return _0x2ab074.toString(CryptoJS.enc.Hex);
  } else {
    console.warn("[queueService] crypto.subtle 和 CryptoJS 都不可用，使用简单 hash");
    let _0x116e2a = 0;
    for (let _0x91b996 = 0; _0x91b996 < _0x4701f3.length; _0x91b996++) {
      const _0x27a1e6 = _0x4701f3.charCodeAt(_0x91b996);
      _0x116e2a = (_0x116e2a << 5) - _0x116e2a + _0x27a1e6;
      _0x116e2a = _0x116e2a & _0x116e2a;
    }
    return Math.abs(_0x116e2a).toString(16).padStart(8, "0");
  }
}
function getQueueBaseUrl() {
  return extension_settings[extensionName].cloudQueueUrl || "";
}
export async function joinQueue(_0x15cd77, _0xc1ff1d, _0x5123d1) {
  const _0x1de62c = getQueueBaseUrl();
  if (!_0x1de62c) {
    throw new Error("云端队列服务地址未配置");
  }
  addLog("[队列] 正在加入队列... (taskId: " + _0x5123d1.substring(0, 8) + "...)");
  const _0x422604 = (extension_settings[extensionName].cloudQueueGreeting || "").substring(0, 15);
  const _0x3f1e1f = await fetch(_0x1de62c + "/join-queue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      key_hash: _0x15cd77,
      user_id: _0xc1ff1d,
      task_id: _0x5123d1,
      greeting: _0x422604 || null
    })
  });
  if (!_0x3f1e1f.ok) {
    const _0x181657 = await _0x3f1e1f.text();
    throw new Error("加入队列失败: " + _0x3f1e1f.status + " - " + _0x181657);
  }
  const _0x503d96 = await _0x3f1e1f.json();
  addLog("[队列] 已加入队列，位置: " + (_0x503d96.position + 1) + "/" + (_0x503d96.queue_size || "?"));
  return _0x503d96;
}
export async function checkMyTurn(_0x45ab6c, _0xa1333a, _0x290865) {
  const _0x14a7f3 = getQueueBaseUrl();
  if (!_0x14a7f3) {
    throw new Error("云端队列服务地址未配置");
  }
  const _0xe33f59 = await fetch(_0x14a7f3 + "/my-turn?key_hash=" + encodeURIComponent(_0x45ab6c) + "&user_id=" + encodeURIComponent(_0xa1333a) + "&task_id=" + encodeURIComponent(_0x290865));
  if (!_0xe33f59.ok) {
    const _0x1cae4a = await _0xe33f59.text();
    throw new Error("检查队列状态失败: " + _0xe33f59.status + " - " + _0x1cae4a);
  }
  return await _0xe33f59.json();
}
export async function completeQueue(_0x31ea8c, _0x1a4541, _0x45eb05, _0x16bddd) {
  const _0x3eb32a = getQueueBaseUrl();
  if (!_0x3eb32a) {
    return;
  }
  addLog("[队列] 正在释放锁...");
  try {
    const _0x379e59 = {
      key_hash: _0x31ea8c,
      user_id: _0x1a4541,
      task_id: _0x45eb05,
      lock_token: _0x16bddd
    };
    const _0x504c1b = await fetch(_0x3eb32a + "/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(_0x379e59)
    });
    if (_0x504c1b.ok) {
      addLog("[队列] 锁已释放");
    } else {
      const _0x655a20 = await _0x504c1b.text();
      addLog("[队列] 释放锁失败: " + _0x655a20);
    }
  } catch (_0xbd0dd0) {
    addLog("[队列] 释放锁时出错: " + _0xbd0dd0.message);
  }
}
export async function leaveQueue(_0x510ac2, _0x51eb2d, _0x59eb51, _0x51c685 = null) {
  const _0xbbf28c = getQueueBaseUrl();
  if (!_0xbbf28c) {
    return;
  }
  addLog("[队列] 正在退出队列...");
  try {
    const _0x704161 = {
      key_hash: _0x510ac2,
      user_id: _0x51eb2d,
      task_id: _0x59eb51,
      lock_token: _0x51c685
    };
    const _0x132c6b = await fetch(_0xbbf28c + "/leave-queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(_0x704161)
    });
    if (_0x132c6b.ok) {
      addLog("[队列] 已退出队列");
    } else {
      const _0x552a92 = await _0x132c6b.text();
      addLog("[队列] 退出队列失败: " + _0x552a92);
    }
  } catch (_0x1302e6) {
    addLog("[队列] 退出队列时出错: " + _0x1302e6.message);
  }
}
export async function waitForTurn(_0x1c240c, _0x578058, _0x506580, _0x590ed6) {
  const _0x5486d6 = await joinQueue(_0x1c240c, _0x578058, _0x506580);
  if (_0x5486d6.position === 0 && _0x5486d6.lock_token) {
    addLog("[队列] 直接获得锁，无需等待");
    toastr.success("获得锁，开始生成", "队列");
    const _0x574564 = {
      lockToken: _0x5486d6.lock_token
    };
    return _0x574564;
  }
  toastr.info("排队中: 第 " + (_0x5486d6.position + 1) + "/" + (_0x5486d6.queue_size || "?") + " 位", "队列", {
    timeOut: 5000
  });
  let _0x50dede = 0;
  let _0x23d27d = false;
  let _0x173f2e = _0x5486d6.position;
  while (true) {
    if (_0x590ed6 && !_0x590ed6.isTaskInQueue(_0x506580)) {
      addLog("[队列] 任务已被取消，退出队列");
      await leaveQueue(_0x1c240c, _0x578058, _0x506580, null);
      throw new Error("任务已取消");
    }
    await sleep(POLL_INTERVAL);
    try {
      const _0x31ad48 = await checkMyTurn(_0x1c240c, _0x578058, _0x506580);
      _0x50dede = 0;
      if (_0x31ad48.is_my_turn && _0x31ad48.lock_token) {
        addLog("[队列] 轮到我了，开始生成");
        toastr.success("轮到你了，开始生成！", "队列");
        const _0x28d838 = {
          lockToken: _0x31ad48.lock_token
        };
        return _0x28d838;
      }
      let _0xba0f08 = "[队列] 等待中... 位置: " + (_0x31ad48.position + 1) + "/" + (_0x31ad48.queue_size || "?");
      if (_0x31ad48.position !== _0x173f2e) {
        toastr.info("排队中: 第 " + (_0x31ad48.position + 1) + "/" + (_0x31ad48.queue_size || "?") + " 位", "队列", {
          timeOut: 3000
        });
        _0x173f2e = _0x31ad48.position;
      }
      if (!_0x23d27d && _0x31ad48.current_greeting && extension_settings[extensionName].showQueueGreeting === "true") {
        _0xba0f08 += " | 前方用户: \"" + _0x31ad48.current_greeting + "\"";
        toastr.info("前方用户: \"" + _0x31ad48.current_greeting + "\"", "队列", {
          timeOut: 5000
        });
        _0x23d27d = true;
      }
      addLog(_0xba0f08);
    } catch (_0x4befd0) {
      _0x50dede++;
      addLog("[队列] 轮询失败 (" + _0x50dede + "/" + MAX_POLL_RETRIES + "): " + _0x4befd0.message);
      if (_0x50dede >= MAX_POLL_RETRIES) {
        toastr.error("队列服务不可用: " + _0x4befd0.message, "队列");
        throw new Error("队列服务不可用: " + _0x4befd0.message);
      }
    }
  }
}
function sleep(_0x5a0e48) {
  return new Promise(_0x6792a5 => setTimeout(_0x6792a5, _0x5a0e48));
}