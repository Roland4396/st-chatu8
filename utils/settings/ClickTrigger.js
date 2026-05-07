import { getContext } from "../../../../../st-context.js";
import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
import { handlePromptRequest } from "../promptReq.js";
import { handleCharacterDesignRequest } from "../characterGen.js";
import { deleteImagesForElement, lockAllTagsForElement, unlockAllTagsForElement } from "../imageInserter.js";
import { debugLog, debugBranch, debugTimer, debugStartSession, debugContent, debugElement } from "../debugLogger.js";
let clickPollingTimer = null;
let boundElements = new WeakSet();
let currentOverlay = null;
let currentBubble = null;
function isMobile() {
  const _0x6bf812 = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const _0x38e77d = window.innerWidth < 768;
  return _0x6bf812 && _0x38e77d;
}
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
function getEventPoint(_0x15b8b3, _0x3ec263 = document) {
  let _0x84a457;
  let _0x4913ef;
  if (_0x15b8b3.touches && _0x15b8b3.touches.length > 0) {
    _0x84a457 = _0x15b8b3.touches[0].clientX;
    _0x4913ef = _0x15b8b3.touches[0].clientY;
  } else if (_0x15b8b3.changedTouches && _0x15b8b3.changedTouches.length > 0) {
    _0x84a457 = _0x15b8b3.changedTouches[0].clientX;
    _0x4913ef = _0x15b8b3.changedTouches[0].clientY;
  } else {
    _0x84a457 = _0x15b8b3.clientX;
    _0x4913ef = _0x15b8b3.clientY;
  }
  if (_0x3ec263.defaultView && _0x3ec263.defaultView.frameElement) {
    const _0x8e3b1f = _0x3ec263.defaultView.frameElement;
    const _0x675e30 = _0x8e3b1f.getBoundingClientRect();
    _0x84a457 += _0x675e30.left;
    _0x4913ef += _0x675e30.top;
    console.log("[点击触发] iframe 坐标转换:", {
      原始X: _0x84a457 - _0x675e30.left,
      原始Y: _0x4913ef - _0x675e30.top,
      iframe偏移: {
        left: _0x675e30.left,
        top: _0x675e30.top
      },
      转换后X: _0x84a457,
      转换后Y: _0x4913ef
    });
  }
  const _0x509bfb = {
    x: _0x84a457,
    y: _0x4913ef
  };
  return _0x509bfb;
}
function closeActionBubble() {
  if (currentOverlay) {
    currentOverlay.classList.add("closing");
    if (currentBubble) {
      currentBubble.style.opacity = "0";
      currentBubble.style.transform = "scale(0.85)";
    }
    setTimeout(() => {
      if (currentOverlay && currentOverlay.parentNode) {
        currentOverlay.remove();
      }
      if (currentBubble && currentBubble.parentNode) {
        currentBubble.remove();
      }
      currentOverlay = null;
      currentBubble = null;
    }, 150);
  }
}
function showClickActionBubble(_0x48c09e, _0xf67aac) {
  closeActionBubble();
  const _0xe9f2fa = document.createElement("div");
  _0xe9f2fa.className = "st-chatu8-click-trigger-overlay";
  currentOverlay = _0xe9f2fa;
  const _0x5b50cf = document.createElement("div");
  _0x5b50cf.className = "st-chatu8-click-trigger-bubble";
  currentBubble = _0x5b50cf;
  const _0x36e384 = document.createElement("div");
  _0x36e384.className = "st-chatu8-click-trigger-title";
  _0x36e384.textContent = "选择操作";
  _0x5b50cf.appendChild(_0x36e384);
  const _0xdd7c97 = [{
    text: "图片生成",
    icon: "fa-solid fa-image",
    description: "生成当前场景相关的图片",
    action: () => {
      console.log("[点击触发] 触发图片生成");
      handlePromptRequest(_0xf67aac, "gesture1");
    }
  }, {
    text: "角色/服装设计",
    icon: "fa-solid fa-user-pen",
    description: "生成角色或服装设计",
    action: () => {
      console.log("[点击触发] 触发角色/服装设计");
      handleCharacterDesignRequest(_0xf67aac);
    }
  }, {
    text: "删除非锁定图片",
    icon: "fa-solid fa-trash",
    description: "删除当前元素的图片",
    action: async () => {
      console.log("[点击触发] 触发删除图片");
      const _0x3447ca = await deleteImagesForElement(_0xf67aac);
      if (_0x3447ca?.lockedCount > 0) {
        toastr.info("已跳过 " + _0x3447ca.lockedCount + " 个锁定的图片");
      }
    }
  }, {
    text: "锁定所有Tag",
    icon: "fa-solid fa-lock",
    description: "锁定当前元素的所有图片标签",
    action: async () => {
      console.log("[点击触发] 触发锁定所有Tag");
      const _0x1b6a96 = await lockAllTagsForElement(_0xf67aac);
      if (_0x1b6a96.success) {
        toastr.success(_0x1b6a96.message);
      } else {
        toastr.warning(_0x1b6a96.message);
      }
    }
  }, {
    text: "解锁所有Tag",
    icon: "fa-solid fa-unlock",
    description: "解锁当前元素的所有图片标签",
    action: async () => {
      console.log("[点击触发] 触发解锁所有Tag");
      const _0x22b1e7 = await unlockAllTagsForElement(_0xf67aac);
      if (_0x22b1e7.success) {
        toastr.success(_0x22b1e7.message);
      } else {
        toastr.warning(_0x22b1e7.message);
      }
    }
  }, {
    text: "取消",
    icon: "fa-solid fa-xmark",
    isCancel: true,
    action: () => {
      console.log("[点击触发] 用户取消");
    }
  }];
  _0xdd7c97.forEach(_0x39465c => {
    const _0x2d97d2 = document.createElement("button");
    _0x2d97d2.className = "st-chatu8-click-trigger-button";
    if (_0x39465c.isCancel) {
      _0x2d97d2.classList.add("cancel");
    }
    _0x2d97d2.innerHTML = "<i class=\"" + _0x39465c.icon + "\"></i><span>" + _0x39465c.text + "</span>";
    _0x2d97d2.onclick = () => {
      debugLog("ClickTrigger.buttonClick", "用户选择操作: " + _0x39465c.text, {
        操作: _0x39465c.text,
        功能说明: _0x39465c.description || "无描述"
      });
      closeActionBubble();
      _0x39465c.action();
      if (window.getSelection) {
        const _0x5014e8 = window.getSelection();
        if (_0x5014e8.rangeCount > 0) {
          _0x5014e8.removeAllRanges();
        }
      }
    };
    _0x5b50cf.appendChild(_0x2d97d2);
  });
  _0xe9f2fa.appendChild(_0x5b50cf);
  document.body.appendChild(_0xe9f2fa);
  _0x5b50cf.style.position = "absolute";
  _0x5b50cf.style.margin = "0";
  _0x5b50cf.style.transform = "none";
  _0x5b50cf.style.left = "-9999px";
  _0x5b50cf.style.top = "-9999px";
  _0x5b50cf.style.visibility = "hidden";
  requestAnimationFrame(() => {
    const _0x1afd47 = _0x5b50cf.getBoundingClientRect();
    const _0xe6da73 = window.innerWidth;
    const _0x3d29aa = window.innerHeight;
    const _0x533df3 = 10;
    let _0x359167 = _0x48c09e.x;
    let _0x40a370 = _0x48c09e.y;
    const _0xc7012d = {
      targetX: _0x359167,
      targetY: _0x40a370,
      viewportWidth: _0xe6da73,
      viewportHeight: _0x3d29aa,
      bubbleWidth: _0x1afd47.width,
      bubbleHeight: _0x1afd47.height
    };
    console.log("[点击触发] 定位信息(Overlay内部):", _0xc7012d);
    const _0x5b2d6d = Number.isFinite(_0x359167) && Number.isFinite(_0x40a370) && _0x359167 >= 0 && _0x359167 <= _0xe6da73 && _0x40a370 >= 0 && _0x40a370 <= _0x3d29aa;
    let _0x5b306f;
    let _0x1a34ef;
    if (_0x5b2d6d) {
      _0x5b306f = _0x359167 + 5;
      _0x1a34ef = _0x40a370 + 5;
      if (_0x5b306f + _0x1afd47.width > _0xe6da73 - _0x533df3) {
        _0x5b306f = _0x359167 - _0x1afd47.width - 5;
      }
      if (_0x1a34ef + _0x1afd47.height > _0x3d29aa - _0x533df3) {
        _0x1a34ef = _0x40a370 - _0x1afd47.height - 5;
      }
      if (_0x5b306f < _0x533df3) {
        _0x5b306f = _0x533df3;
      }
      if (_0x1a34ef < _0x533df3) {
        _0x1a34ef = _0x533df3;
      }
    } else {
      const _0x140ea3 = {
        targetX: _0x359167,
        targetY: _0x40a370
      };
      console.warn("[点击触发] 坐标异常，使用居中定位", _0x140ea3);
      _0x5b306f = (_0xe6da73 - _0x1afd47.width) / 2;
      _0x1a34ef = (_0x3d29aa - _0x1afd47.height) / 2;
    }
    const _0x3b5c8d = {
      newLeft: _0x5b306f,
      newTop: _0x1a34ef
    };
    console.log("[点击触发] 最终定位(Overlay内部):", _0x3b5c8d);
    _0x5b50cf.style.left = _0x5b306f + "px";
    _0x5b50cf.style.top = _0x1a34ef + "px";
    _0x5b50cf.style.visibility = "visible";
  });
  const _0x34497c = _0x23ac09 => {
    if (_0x23ac09.key === "Escape") {
      closeActionBubble();
      document.removeEventListener("keydown", _0x34497c);
    }
  };
  document.addEventListener("keydown", _0x34497c);
}
function handleDoubleClick(_0x2bbefd, _0x2b8e87, _0x4bd939) {
  debugStartSession("点击触发图片生成");
  const _0x26f72e = debugTimer("ClickTrigger.handleDoubleClick", "处理双击事件 - 显示操作选择弹窗");
  debugLog("ClickTrigger.handleDoubleClick", "双击事件触发", {
    坐标: _0x4bd939,
    事件类型: _0x2bbefd.type,
    功能说明: "检测双击事件，验证条件后显示操作选择弹窗"
  });
  debugElement("ClickTrigger.handleDoubleClick", "触发元素", _0x2b8e87);
  debugElement("ClickTrigger.handleDoubleClick", "实际点击元素", _0x2bbefd.target);
  if (currentOverlay) {
    debugBranch("handleDoubleClick", "弹窗已存在 - 忽略事件", true, {
      条件: "currentOverlay 是否存在",
      值: !!currentOverlay
    });
    console.log("[点击触发] 弹窗已显示，忽略双击");
    _0x26f72e.end("已忽略 - 弹窗已存在");
    return;
  }
  const _0x318a31 = extension_settings[extensionName]?.clickTriggerEnabled;
  if (!_0x318a31) {
    const _0x236e33 = {
      条件: "clickTriggerEnabled",
      设置值: _0x318a31,
      插件名: extensionName
    };
    debugBranch("handleDoubleClick", "点击触发功能未启用", true, _0x236e33);
    console.log("[点击触发] 功能未启用");
    _0x26f72e.end("已忽略 - 功能未启用");
    return;
  }
  const _0x2778df = {
    条件: "clickTriggerEnabled",
    设置值: _0x318a31
  };
  debugBranch("handleDoubleClick", "点击触发功能已启用", true, _0x2778df);
  const _0x264a10 = new Set(["IMG", "BUTTON", "SELECT", "INPUT", "TEXTAREA", "A", "VIDEO", "AUDIO", "CANVAS", "SVG"]);
  const _0x1e82fd = _0x2bbefd.target.tagName?.toUpperCase();
  if (_0x264a10.has(_0x1e82fd)) {
    debugBranch("handleDoubleClick", "排除元素类型: " + _0x1e82fd, true, {
      条件: "点击元素是否在排除列表中",
      排除列表: Array.from(_0x264a10),
      实际元素: _0x1e82fd
    });
    console.log("[点击触发] 点击的是 " + _0x1e82fd + " 元素，忽略");
    _0x26f72e.end("已忽略 - 排除的元素类型: " + _0x1e82fd);
    return;
  }
  const _0xa425cc = _0x2b8e87?.textContent || "";
  debugContent("ClickTrigger.handleDoubleClick", "元素文本预览", _0xa425cc, 150);
  debugLog("ClickTrigger.handleDoubleClick", "条件验证通过，显示操作弹窗");
  console.log("[点击触发] 双击触发成功");
  showClickActionBubble(_0x4bd939, _0x2b8e87);
  _0x26f72e.end("弹窗已显示");
}
function bindClickTrigger(_0x4c2bf7, _0x3677ad = document) {
  if (boundElements.has(_0x4c2bf7)) {
    return;
  }
  boundElements.add(_0x4c2bf7);
  function _0x4e67d0(_0x343a77) {
    let _0x1837f6 = _0x343a77.target.closest(".mes_text");
    if (!_0x1837f6 && _0x3677ad.defaultView?.frameElement) {
      let _0x5357ee = _0x343a77.target;
      if (_0x5357ee.tagName !== "DIV") {
        _0x5357ee = _0x5357ee.closest("div");
      }
      if (_0x5357ee) {
        _0x1837f6 = _0x5357ee;
      }
    }
    return _0x1837f6 || _0x4c2bf7;
  }
  _0x4c2bf7.addEventListener("dblclick", _0x56dff9 => {
    if (isMobile() || isIOS()) {
      console.log("[点击触发] 移动端忽略 dblclick，使用触摸三连击");
      return;
    }
    const _0x5361bc = getEventPoint(_0x56dff9, _0x3677ad);
    const _0x1a806e = _0x4e67d0(_0x56dff9);
    console.log("[点击触发] 桌面端双击, target:", _0x1a806e.tagName, _0x1a806e.className);
    const _0x1153cb = getContext();
    console.log("[点击触发] context:", _0x1153cb);
    handleDoubleClick(_0x56dff9, _0x1a806e, _0x5361bc);
  }, true);
  let _0x4fd103 = 0;
  let _0x18d20e = {
    x: 0,
    y: 0
  };
  let _0x30425c = 0;
  let _0x4c7c3f = {
    x: 0,
    y: 0
  };
  const _0x80be15 = isIOS() ? 400 : 350;
  const _0x5514ac = 30;
  const _0x1e3634 = 15;
  const _0x122da1 = new Set(["IMG", "BUTTON", "SELECT", "INPUT", "TEXTAREA", "A", "VIDEO", "AUDIO", "CANVAS", "SVG"]);
  _0x4c2bf7.addEventListener("touchstart", _0x5b0796 => {
    if (_0x5b0796.touches.length === 1) {
      const _0x1d1b8f = {
        x: _0x5b0796.touches[0].clientX,
        y: _0x5b0796.touches[0].clientY
      };
      _0x4c7c3f = _0x1d1b8f;
    }
  }, {
    capture: true,
    passive: true
  });
  _0x4c2bf7.addEventListener("touchend", _0x2a9a06 => {
    if (_0x2a9a06.changedTouches.length !== 1) {
      return;
    }
    if (_0x122da1.has(_0x2a9a06.target.tagName?.toUpperCase())) {
      console.log("[点击触发] 触摸的是 " + _0x2a9a06.target.tagName?.toUpperCase() + " 元素，跳过 ClickTrigger 处理");
      return;
    }
    const _0x4d89f5 = _0x2a9a06.changedTouches[0].clientX;
    const _0x256872 = _0x2a9a06.changedTouches[0].clientY;
    const _0x2fc6ff = Math.sqrt(Math.pow(_0x4d89f5 - _0x4c7c3f.x, 2) + Math.pow(_0x256872 - _0x4c7c3f.y, 2));
    if (_0x2fc6ff > _0x1e3634) {
      console.log("[点击触发] 检测到滑动 (距离: " + _0x2fc6ff.toFixed(1) + "px)，忽略");
      _0x30425c = 0;
      _0x4fd103 = 0;
      return;
    }
    const _0x235e2e = Date.now();
    const _0x564c72 = getEventPoint(_0x2a9a06, _0x3677ad);
    const _0x4208d4 = _0x235e2e - _0x4fd103;
    const _0x4f91fe = Math.sqrt(Math.pow(_0x564c72.x - _0x18d20e.x, 2) + Math.pow(_0x564c72.y - _0x18d20e.y, 2));
    if (_0x4208d4 < _0x80be15 && _0x4208d4 > 0 && _0x4f91fe < _0x5514ac) {
      _0x30425c++;
      console.log("[点击触发] 移动端连击计数: " + _0x30425c);
      if (_0x30425c >= 3) {
        _0x2a9a06.preventDefault();
        const _0x52cfe7 = _0x4e67d0(_0x2a9a06);
        console.log("[点击触发] 移动端触摸三连击, target:", _0x52cfe7.tagName, _0x52cfe7.className);
        handleDoubleClick(_0x2a9a06, _0x52cfe7, _0x564c72);
        _0x30425c = 0;
        _0x4fd103 = 0;
        _0x18d20e = {
          x: 0,
          y: 0
        };
      } else {
        _0x4fd103 = _0x235e2e;
        _0x18d20e = _0x564c72;
      }
    } else {
      _0x30425c = 1;
      _0x4fd103 = _0x235e2e;
      _0x18d20e = _0x564c72;
    }
  }, {
    capture: true,
    passive: false
  });
  console.log("[点击触发] ✓ 已绑定:", _0x4c2bf7.className || _0x4c2bf7.tagName);
}
function scanClickTriggerElements() {
  const _0x3d6528 = document.getElementsByClassName("mes_text");
  let _0x4f1e86 = 0;
  let _0x37c72d = 0;
  for (const _0x91303b of _0x3d6528) {
    if (!boundElements.has(_0x91303b)) {
      bindClickTrigger(_0x91303b, document);
      _0x4f1e86++;
    } else {
      _0x37c72d++;
    }
  }
  const _0x229f05 = document.querySelectorAll("iframe");
  _0x229f05.forEach(_0x592bf5 => {
    try {
      const _0x336d9f = _0x592bf5.contentDocument;
      if (!_0x336d9f || !_0x336d9f.body) {
        return;
      }
      if (!boundElements.has(_0x336d9f.body)) {
        bindClickTrigger(_0x336d9f.body, _0x336d9f);
        _0x4f1e86++;
      }
      const _0x5c6213 = _0x336d9f.getElementsByClassName("mes_text");
      for (const _0x1e4384 of _0x5c6213) {
        if (!boundElements.has(_0x1e4384)) {
          bindClickTrigger(_0x1e4384, _0x336d9f);
          _0x4f1e86++;
        }
      }
    } catch (_0x42e19a) {}
  });
  if (_0x4f1e86 > 0) {}
}
function initClickTriggerMonitor() {
  console.log("[点击触发] ====== 初始化点击触发监控 ======");
  if (clickPollingTimer) {
    console.log("[点击触发] 已在运行");
    return;
  }
  clickPollingTimer = setInterval(() => {
    try {
      scanClickTriggerElements();
    } catch (_0x4db2d9) {
      console.error("[点击触发] 扫描出错:", _0x4db2d9);
    }
  }, 3000);
  try {
    scanClickTriggerElements();
  } catch (_0x1291ec) {
    console.error("[点击触发] 初始扫描出错:", _0x1291ec);
  }
  console.log("[点击触发] ✓ 已启动");
}
function stopClickTriggerMonitor() {
  console.log("[点击触发] ====== 停止监控 ======");
  if (clickPollingTimer) {
    clearInterval(clickPollingTimer);
    clickPollingTimer = null;
  }
  boundElements = new WeakSet();
  closeActionBubble();
  console.log("[点击触发] ✓ 已停止");
}
function startClickTriggerMonitor() {
  const _0x1e3393 = () => {
    setTimeout(() => {
      console.log("[点击触发] 延迟启动...");
      initClickTriggerMonitor();
    }, 3000);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x1e3393);
  } else {
    _0x1e3393();
  }
}
startClickTriggerMonitor();
export { initClickTriggerMonitor, stopClickTriggerMonitor, scanClickTriggerElements };