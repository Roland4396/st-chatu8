import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { handlePromptRequest } from "../promptReq.js";
import { handleCharacterDesignRequest } from "../characterGen.js";
let gesturePollingTimer = null;
const boundEventHandlers = new Map();
function isMobile() {
  const _0x5d7561 = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const _0x3e0d1b = window.innerWidth < 768;
  return _0x5d7561 && _0x3e0d1b;
}
const BINDIED_ATTR = "data-gesture-bindied";
let isDrawing = false;
let gesturePoints = [];
let gestureStartTime = 0;
let activeDoc = null;
let activeElement = null;
let isPending = false;
let pendingEvent = null;
let startPoint = null;
const MOVE_THRESHOLD = 10;
let longPressTimer = null;
let isLongPress = false;
const LONG_PRESS_THRESHOLD = 250;
const GRID_SIZE = 10;
let isRecording = false;
let recordingResolve = null;
let shouldBlockContextMenu = false;
let gestureCanvas = null;
let gestureCtx = null;
function parseTemplate(_0x265c0b) {
  return _0x265c0b.map(_0x1802b6 => _0x1802b6.split("").map(_0x4a497b => _0x4a497b === "1" ? 1 : 0));
}
function createGestureCanvas(_0x2f6c0d) {
  if (isMobile() && !extension_settings[extensionName].gestureShowTrail) {
    return;
  }
  const _0xc1e2be = _0x2f6c0d.getElementById("gesture-canvas");
  if (_0xc1e2be) {
    _0xc1e2be.remove();
  }
  gestureCanvas = _0x2f6c0d.createElement("canvas");
  gestureCanvas.id = "gesture-canvas";
  gestureCanvas.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        pointer-events: none;\n        z-index: 99999;\n    ";
  const _0x2844e2 = _0x2f6c0d.documentElement.clientWidth || _0x2f6c0d.body.clientWidth || window.innerWidth;
  const _0x24a0af = _0x2f6c0d.documentElement.clientHeight || _0x2f6c0d.body.clientHeight || window.innerHeight;
  gestureCanvas.width = _0x2844e2;
  gestureCanvas.height = _0x24a0af;
  _0x2f6c0d.body.appendChild(gestureCanvas);
  gestureCtx = gestureCanvas.getContext("2d");
}
function removeGestureCanvas() {
  if (isMobile() && !extension_settings[extensionName].gestureShowTrail) {
    return;
  }
  if (gestureCanvas && gestureCanvas.parentNode) {
    gestureCanvas.remove();
  }
  gestureCanvas = null;
  gestureCtx = null;
}
function drawGestureTrail() {
  if (isMobile() && !extension_settings[extensionName].gestureShowTrail) {
    return;
  }
  if (!gestureCtx || gesturePoints.length < 2 || !extension_settings[extensionName].gestureShowTrail) {
    return;
  }
  gestureCtx.clearRect(0, 0, gestureCanvas.width, gestureCanvas.height);
  gestureCtx.beginPath();
  gestureCtx.moveTo(gesturePoints[0].x, gesturePoints[0].y);
  for (let _0x20649b = 1; _0x20649b < gesturePoints.length; _0x20649b++) {
    gestureCtx.lineTo(gesturePoints[_0x20649b].x, gesturePoints[_0x20649b].y);
  }
  const _0x295397 = extension_settings[extensionName].gestureTrailColor ?? "#00ff00";
  gestureCtx.strokeStyle = _0x295397;
  gestureCtx.lineWidth = 4;
  gestureCtx.lineCap = "round";
  gestureCtx.lineJoin = "round";
  gestureCtx.shadowColor = _0x295397;
  gestureCtx.shadowBlur = 10;
  gestureCtx.stroke();
}
function distance(_0x264dd5, _0x4c75f1) {
  return Math.sqrt((_0x4c75f1.x - _0x264dd5.x) ** 2 + (_0x4c75f1.y - _0x264dd5.y) ** 2);
}
function getBoundingBox(_0x5aae64) {
  let _0x5d8821 = Infinity;
  let _0x285729 = Infinity;
  let _0x4725cd = -Infinity;
  let _0x37f493 = -Infinity;
  for (const _0x3c6a30 of _0x5aae64) {
    _0x5d8821 = Math.min(_0x5d8821, _0x3c6a30.x);
    _0x285729 = Math.min(_0x285729, _0x3c6a30.y);
    _0x4725cd = Math.max(_0x4725cd, _0x3c6a30.x);
    _0x37f493 = Math.max(_0x37f493, _0x3c6a30.y);
  }
  return {
    minX: _0x5d8821,
    minY: _0x285729,
    maxX: _0x4725cd,
    maxY: _0x37f493,
    width: _0x4725cd - _0x5d8821,
    height: _0x37f493 - _0x285729
  };
}
function pointsToGrid(_0x3ecded) {
  const _0x1d635d = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  if (_0x3ecded.length < 2) {
    return _0x1d635d;
  }
  const _0x3ca0e4 = getBoundingBox(_0x3ecded);
  if (_0x3ca0e4.width < 5 && _0x3ca0e4.height < 5) {
    const _0x43247f = Math.floor(GRID_SIZE / 2);
    const _0x4572ab = Math.floor(GRID_SIZE / 2);
    _0x1d635d[_0x4572ab][_0x43247f] = 1;
    return _0x1d635d;
  }
  const _0xf1d3b4 = Math.max(_0x3ca0e4.width, _0x3ca0e4.height);
  const _0x25f540 = _0x3ca0e4.minX + _0x3ca0e4.width / 2;
  const _0x12ae4e = _0x3ca0e4.minY + _0x3ca0e4.height / 2;
  const _0x3c0c77 = {
    minX: _0x25f540 - _0xf1d3b4 / 2,
    minY: _0x12ae4e - _0xf1d3b4 / 2,
    size: _0xf1d3b4
  };
  const _0x23892a = _0x3c0c77.size > 0 ? GRID_SIZE / _0x3c0c77.size : 0;
  for (let _0x2c346c = 0; _0x2c346c < _0x3ecded.length; _0x2c346c++) {
    const _0x2844db = _0x3ecded[_0x2c346c];
    const _0x276359 = Math.floor((_0x2844db.x - _0x3c0c77.minX) * _0x23892a);
    const _0x326300 = Math.floor((_0x2844db.y - _0x3c0c77.minY) * _0x23892a);
    const _0x229f26 = Math.min(Math.max(_0x276359, 0), GRID_SIZE - 1);
    const _0x452660 = Math.min(Math.max(_0x326300, 0), GRID_SIZE - 1);
    _0x1d635d[_0x452660][_0x229f26] = 1;
    if (_0x2c346c > 0) {
      const _0x2076e8 = _0x3ecded[_0x2c346c - 1];
      const _0x2975ea = distance(_0x2076e8, _0x2844db);
      const _0x41da62 = Math.max(Math.ceil(_0x2975ea / 3), 1);
      for (let _0x2dbfb4 = 1; _0x2dbfb4 < _0x41da62; _0x2dbfb4++) {
        const _0x1620ca = _0x2dbfb4 / _0x41da62;
        const _0x1a530e = _0x2076e8.x + (_0x2844db.x - _0x2076e8.x) * _0x1620ca;
        const _0xf56370 = _0x2076e8.y + (_0x2844db.y - _0x2076e8.y) * _0x1620ca;
        const _0x2f62e7 = Math.floor((_0x1a530e - _0x3c0c77.minX) * _0x23892a);
        const _0x507580 = Math.floor((_0xf56370 - _0x3c0c77.minY) * _0x23892a);
        const _0x41fbd6 = Math.min(Math.max(_0x2f62e7, 0), GRID_SIZE - 1);
        const _0x24d6bf = Math.min(Math.max(_0x507580, 0), GRID_SIZE - 1);
        _0x1d635d[_0x24d6bf][_0x41fbd6] = 1;
      }
    }
  }
  return _0x1d635d;
}
function dilateGrid(_0x2a327a, _0x132c3d = 1) {
  const _0xe33894 = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  for (let _0x9fab46 = 0; _0x9fab46 < GRID_SIZE; _0x9fab46++) {
    for (let _0x40a475 = 0; _0x40a475 < GRID_SIZE; _0x40a475++) {
      if (_0x2a327a[_0x9fab46][_0x40a475] === 1) {
        for (let _0x1cfdbb = -_0x132c3d; _0x1cfdbb <= _0x132c3d; _0x1cfdbb++) {
          for (let _0x2c87e8 = -_0x132c3d; _0x2c87e8 <= _0x132c3d; _0x2c87e8++) {
            const _0x8f91ee = _0x9fab46 + _0x1cfdbb;
            const _0x385c20 = _0x40a475 + _0x2c87e8;
            if (_0x8f91ee >= 0 && _0x8f91ee < GRID_SIZE && _0x385c20 >= 0 && _0x385c20 < GRID_SIZE) {
              _0xe33894[_0x8f91ee][_0x385c20] = 1;
            }
          }
        }
      }
    }
  }
  return _0xe33894;
}
function calculateSimilarityMetrics(_0xb69038, _0x3a98ad) {
  let _0xbe5159 = 0;
  let _0x2093df = 0;
  let _0x465eec = 0;
  for (let _0x195b65 = 0; _0x195b65 < GRID_SIZE; _0x195b65++) {
    for (let _0x6a588e = 0; _0x6a588e < GRID_SIZE; _0x6a588e++) {
      const _0x166dc4 = _0xb69038[_0x195b65][_0x6a588e];
      const _0x53c502 = _0x3a98ad[_0x195b65][_0x6a588e];
      if (_0x166dc4 === 1) {
        _0x2093df++;
      }
      if (_0x53c502 === 1) {
        _0x465eec++;
      }
      if (_0x166dc4 === 1 && _0x53c502 === 1) {
        _0xbe5159++;
      }
    }
  }
  const _0x36893b = _0x2093df === 0 ? 0 : _0xbe5159 / _0x2093df;
  const _0x3995d9 = _0x465eec === 0 ? 0 : _0xbe5159 / _0x465eec;
  const _0x52a14e = _0x2093df + _0x465eec - _0xbe5159;
  const _0x1a3573 = _0x52a14e === 0 ? 0 : _0xbe5159 / _0x52a14e;
  const _0x4d499c = {
    precision: _0x36893b,
    recall: _0x3995d9,
    jaccard: _0x1a3573
  };
  return _0x4d499c;
}
function getMainDirection(_0xe5bba2) {
  if (_0xe5bba2.length < 2) {
    return null;
  }
  const _0x25cd90 = _0xe5bba2[0];
  const _0x88b9b2 = _0xe5bba2[_0xe5bba2.length - 1];
  return {
    dx: _0x88b9b2.x - _0x25cd90.x,
    dy: _0x88b9b2.y - _0x25cd90.y
  };
}
function matchGesture(_0x20c743) {
  const _0x4ca3b9 = pointsToGrid(_0x20c743);
  const _0x2af268 = dilateGrid(_0x4ca3b9, 1);
  const _0x12fc54 = {
    name: "手势一",
    pattern: extension_settings[extensionName].gesture1
  };
  const _0x14cd9e = {
    name: "手势二",
    pattern: extension_settings[extensionName].gesture2
  };
  const _0x394199 = {
    gesture1: _0x12fc54,
    gesture2: _0x14cd9e
  };
  const _0x3104e1 = _0x394199;
  const _0x2ddc08 = [];
  for (const [_0x34ce7c, _0x2e6017] of Object.entries(_0x3104e1)) {
    if (!_0x2e6017.pattern || !Array.isArray(_0x2e6017.pattern)) {
      continue;
    }
    const _0x24069a = parseTemplate(_0x2e6017.pattern);
    const _0xbd5b0a = dilateGrid(_0x24069a, 1);
    const _0x3176c9 = calculateSimilarityMetrics(_0x2af268, _0xbd5b0a);
    const {
      precision: _0x195f3e,
      recall: _0x115467
    } = _0x3176c9;
    const _0x5d805a = _0x195f3e + _0x115467 === 0 ? 0 : _0x195f3e * _0x115467 * 2 / (_0x195f3e + _0x115467);
    const _0x4131ef = {
      key: _0x34ce7c,
      name: _0x2e6017.name,
      score: _0x5d805a,
      jaccard: _0x3176c9.jaccard,
      precision: _0x195f3e,
      recall: _0x115467
    };
    _0x2ddc08.push(_0x4131ef);
  }
  _0x2ddc08.sort((_0x1ec767, _0x83228b) => _0x83228b.score - _0x1ec767.score);
  const _0x20af86 = _0x2ddc08[0];
  _0x20af86.allResults = _0x2ddc08.slice(0, 5);
  const _0x5c2dd1 = (extension_settings[extensionName].gestureMatchThreshold ?? 60) / 100;
  if (_0x20af86.score < _0x5c2dd1) {
    return {
      key: "unknown",
      name: "未识别",
      score: _0x20af86.score,
      allResults: _0x2ddc08.slice(0, 5)
    };
  }
  return _0x20af86;
}
function gridToString(_0x5c5610) {
  return _0x5c5610.map(_0x1c204d => _0x1c204d.map(_0x1d86bd => _0x1d86bd ? "█" : "·").join("")).join("\n");
}
function getGestureEmoji(_0x21dd95) {
  const _0x838a0b = {
    gesture1: "1️⃣",
    gesture2: "2️⃣",
    unknown: "❓"
  };
  return _0x838a0b[_0x21dd95] || "❓";
}
function showGestureResult(_0x133cb2, _0x1a9404, _0x12b4d8, _0xe51db1) {
  if (isMobile() && !extension_settings[extensionName].gestureShowTrail) {
    return;
  }
  if (!extension_settings[extensionName].gestureShowRecognition) {
    console.log("[手势] 已禁用识别结果展示。");
    return;
  }
  const _0x175e97 = _0x133cb2 || document;
  const _0x10874c = _0x175e97.getElementById("gesture-result");
  if (_0x10874c) {
    _0x10874c.remove();
  }
  const _0x21de8d = _0x175e97.createElement("div");
  _0x21de8d.id = "gesture-result";
  const _0x435adb = _0x1a9404.key !== "unknown";
  const _0x4525ab = Math.round(_0x1a9404.score * 100);
  let _0x233f86 = "50%";
  let _0x3e5ee7 = "translate(-50%, -50%)";
  if (isMobile()) {
    const _0x33aa45 = _0x175e97.querySelector("#top-settings-holder");
    if (_0x33aa45) {
      const _0x97633a = _0x33aa45.getBoundingClientRect();
      _0x233f86 = _0x97633a.bottom + 10 + "px";
      _0x3e5ee7 = "translateX(-50%)";
    }
  }
  _0x21de8d.style.cssText = "\n        position: fixed;\n        top: " + _0x233f86 + ";\n        left: 50%;\n        transform: " + _0x3e5ee7 + ";\n        background: rgba(0, 0, 0, 0.95);\n        color: #fff;\n        padding: 20px;\n        border-radius: 16px;\n        font-size: 14px;\n        z-index: 100000;\n        text-align: center;\n        width: min(90vw, 340px);\n        box-sizing: border-box;\n        box-shadow: 0 8px 32px rgba(0,0,0,0.5);\n        border: 2px solid " + (_0x435adb ? "#00ff00" : "#ff6600") + ";\n        font-family: monospace;\n    ";
  const _0x249466 = _0x1a9404.allResults.map((_0xb00a61, _0x49a7c4) => "<span style=\"color: " + (_0x49a7c4 === 0 ? "#0f0" : "#666") + "\">" + (_0x49a7c4 + 1) + ". " + _0xb00a61.name + " (" + Math.round(_0xb00a61.score * 100) + "%)</span>").join("<br>");
  const _0x2014ca = {
    pattern: extension_settings[extensionName].gesture1
  };
  const _0x599e4c = {
    pattern: extension_settings[extensionName].gesture2
  };
  const _0x2685e7 = {
    gesture1: _0x2014ca,
    gesture2: _0x599e4c
  };
  const _0x211894 = _0x2685e7;
  _0x21de8d.innerHTML = "\n        <div style=\"font-size: 40px; margin-bottom: 10px;\">\n            " + getGestureEmoji(_0x1a9404.key) + "\n        </div>\n        \n        <div style=\"font-size: 22px; font-weight: bold; margin-bottom: 6px; color: " + (_0x435adb ? "#00ff00" : "#ff6600") + ";\">\n            " + _0x1a9404.name + "\n        </div>\n        \n        <div style=\"color: #888; font-size: 13px; margin-bottom: 14px;\">\n            匹配度: " + _0x4525ab + "%\n        </div>\n        \n        <div style=\"display: flex; justify-content: center; gap: 16px; margin-bottom: 14px;\">\n            <div>\n                <div style=\"color: #666; font-size: 10px; margin-bottom: 4px;\">你画的 (正方形化)</div>\n                <div style=\"font-size: 10px; line-height: 1.1; color: #0f0; background: #111; padding: 6px; border-radius: 4px;\">\n                    <pre style=\"margin: 0;\">" + gridToString(_0x12b4d8) + "</pre>\n                </div>\n            </div>\n            " + (_0x435adb && _0x211894[_0x1a9404.key].pattern ? "\n            <div>\n                <div style=\"color: #666; font-size: 10px; margin-bottom: 4px;\">模板</div>\n                <div style=\"font-size: 10px; line-height: 1.1; color: #0ff; background: #111; padding: 6px; border-radius: 4px;\">\n                    <pre style=\"margin: 0;\">" + gridToString(parseTemplate(_0x211894[_0x1a9404.key].pattern)) + "</pre>\n                </div>\n            </div>\n            " : "") + "\n        </div>\n        \n        <div style=\"border-top: 1px solid #333; padding-top: 10px; font-size: 11px; text-align: left;\">\n            <div style=\"color: #888; margin-bottom: 6px;\">候选结果:</div>\n            " + _0x249466 + "\n        </div>\n    ";
  _0x175e97.body.appendChild(_0x21de8d);
  setTimeout(() => {
    _0x21de8d.style.transition = "opacity 0.3s";
    _0x21de8d.style.opacity = "0";
    setTimeout(() => _0x21de8d.remove(), 300);
  }, 3500);
}
function showGestureHint(_0x2c3f20, _0x41cafe = "🎯 绘制手势...") {
  if (isMobile() && !extension_settings[extensionName].gestureShowTrail) {
    return;
  }
  if (!extension_settings[extensionName].gestureShowTrail) {
    return;
  }
  const _0x2a67d8 = _0x2c3f20.getElementById("gesture-hint");
  if (_0x2a67d8) {
    _0x2a67d8.remove();
  }
  const _0x1b17b6 = _0x2c3f20.createElement("div");
  _0x1b17b6.id = "gesture-hint";
  _0x1b17b6.style.cssText = "\n        position: fixed;\n        top: 20px;\n        left: 50%;\n        transform: translateX(-50%);\n        background: rgba(0, 128, 0, 0.9);\n        color: #fff;\n        padding: 10px 20px;\n        border-radius: 8px;\n        font-size: 14px;\n        z-index: 100000;\n        pointer-events: none;\n    ";
  _0x1b17b6.textContent = _0x41cafe;
  _0x2c3f20.body.appendChild(_0x1b17b6);
  if (!isRecording) {
    setTimeout(() => {
      _0x1b17b6.style.transition = "opacity 0.3s";
      _0x1b17b6.style.opacity = "0";
      setTimeout(() => _0x1b17b6.remove(), 300);
    }, 1500);
  }
}
function getEventPoint(_0x28e1ae) {
  if (_0x28e1ae.touches && _0x28e1ae.touches.length > 0) {
    const _0x178681 = {
      x: _0x28e1ae.touches[0].clientX,
      y: _0x28e1ae.touches[0].clientY
    };
    return _0x178681;
  }
  if (_0x28e1ae.changedTouches && _0x28e1ae.changedTouches.length > 0) {
    const _0x13aa5d = {
      x: _0x28e1ae.changedTouches[0].clientX,
      y: _0x28e1ae.changedTouches[0].clientY
    };
    return _0x13aa5d;
  }
  const _0x4f9682 = {
    x: _0x28e1ae.clientX,
    y: _0x28e1ae.clientY
  };
  return _0x4f9682;
}
function handleGestureComplete(_0x520075, _0x1951f0) {
  if (isMobile()) {
    const _0x10c020 = getBoundingBox(gesturePoints);
    const _0x16e365 = getMainDirection(gesturePoints);
    if (Math.abs(_0x16e365.dy) > Math.abs(_0x16e365.dx) * 2.5 && _0x10c020.height > 80) {
      console.log("[手势] 检测为滚动操作，已忽略。");
      return;
    }
  }
  const _0xcbb8f1 = pointsToGrid(gesturePoints);
  const _0x65f3a8 = _0xcbb8f1.map(_0x3aeb51 => _0x3aeb51.join(""));
  if (isRecording && recordingResolve) {
    console.log("[手势] 录制完成");
    isRecording = false;
    recordingResolve(_0x65f3a8);
    recordingResolve = null;
    const _0x460750 = _0x520075.getElementById("gesture-hint");
    if (_0x460750) {
      _0x460750.remove();
    }
    toastr.success("手势已录制！");
    return;
  }
  console.log("[手势] ================ 开始识别 ================");
  console.log("[手势] 采集点数:", gesturePoints.length);
  console.log("[手势] 用户网格 (10x10 正方形化):\n" + gridToString(_0xcbb8f1));
  const _0x3a3a45 = matchGesture(gesturePoints);
  console.log("[手势] 识别结果:", _0x3a3a45.name);
  console.log("[手势] 匹配度:", Math.round(_0x3a3a45.score * 100) + "%");
  console.log("[手势] 前2候选:", _0x3a3a45.allResults.map(_0x182ae3 => _0x182ae3.name + "(" + Math.round(_0x182ae3.score * 100) + "%)").join(", "));
  console.log("[手势] ================================================");
  if (_0x3a3a45.key !== "unknown") {
    if (_0x3a3a45.key === "gesture1") {
      console.log("[手势] 检测到手势一 - 触发图片生成");
      handlePromptRequest(_0x1951f0, _0x3a3a45.key);
    } else if (_0x3a3a45.key === "gesture2") {
      console.log("[手势] 检测到手势二 - 触发角色/服装设计");
      handleCharacterDesignRequest(_0x1951f0);
    }
  }
  const _0x459d41 = new CustomEvent("gesture-complete", {
    detail: {
      gesture: _0x3a3a45.key,
      gestureName: _0x3a3a45.name,
      score: _0x3a3a45.score,
      grid: _0xcbb8f1,
      targetElement: _0x1951f0,
      points: gesturePoints.slice(),
      allResults: _0x3a3a45.allResults
    }
  });
  document.dispatchEvent(_0x459d41);
  showGestureResult(_0x520075, _0x3a3a45, _0xcbb8f1, _0x1951f0);
}
function createGestureHandlers(_0x1558a9, _0x1f32ef = null) {
  function _0x54bbb5(_0x2088ff) {
    if (isRecording) {
      _0x2088ff.preventDefault();
      _0x2088ff.stopPropagation();
    }
    isDrawing = true;
    activeDoc = _0x1558a9;
    activeElement = _0x1f32ef;
    gesturePoints = [getEventPoint(_0x2088ff)];
    gestureStartTime = Date.now();
    createGestureCanvas(_0x1558a9);
    if (isRecording) {
      showGestureHint(_0x1558a9, "录制中... 请在屏幕上绘制手势");
    } else {
      showGestureHint(_0x1558a9);
    }
  }
  function _0x44ca44(_0x2aeef9) {
    if (!isDrawing) {
      return;
    }
    const _0x54857d = getEventPoint(_0x2aeef9);
    const _0x4814ea = gesturePoints[gesturePoints.length - 1];
    if (distance(_0x4814ea, _0x54857d) >= 2) {
      gesturePoints.push(_0x54857d);
      drawGestureTrail();
    }
  }
  function _0x1fed78(_0x2c18f4) {
    if (!isDrawing) {
      return;
    }
    isDrawing = false;
    if (gesturePoints.length < 10) {
      removeGestureCanvas();
      gesturePoints = [];
      return;
    }
    handleGestureComplete(_0x1558a9, activeElement);
    setTimeout(removeGestureCanvas, 500);
    gesturePoints = [];
    activeDoc = null;
    activeElement = null;
  }
  const _0xccaa7b = {
    onGestureStart: _0x54bbb5,
    onGestureMove: _0x44ca44,
    onGestureEnd: _0x1fed78
  };
  return _0xccaa7b;
}
function clearPendingState() {
  isPending = false;
  pendingEvent = null;
  startPoint = null;
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  isLongPress = false;
}
function bindGestureToMesText(_0x317e9e) {
  if (_0x317e9e.hasAttribute(BINDIED_ATTR)) {
    return false;
  }
  _0x317e9e.setAttribute(BINDIED_ATTR, "true");
  return true;
}
function initDocumentGestureEvents(_0x16948d = document) {
  if (_0x16948d._gestureEventsInitialized) {
    return;
  }
  _0x16948d._gestureEventsInitialized = true;
  const _0x28b677 = {
    mousedown: _0x36bbb9 => {
      if (!extension_settings[extensionName].gestureEnabled) {
        return;
      }
      if (isMobile() || !isRecording && _0x36bbb9.button !== 2) {
        return;
      }
      const _0x3a0833 = _0x36bbb9.target.closest(".mes_text[data-gesture-bindied=\"true\"]");
      let _0x2b1809 = _0x3a0833;
      if (!_0x2b1809 && _0x16948d.defaultView.frameElement && _0x16948d.body.hasAttribute(BINDIED_ATTR)) {
        let _0xebf631 = _0x36bbb9.target;
        if (_0xebf631.tagName !== "DIV") {
          _0xebf631 = _0xebf631.closest("div");
        }
        if (_0xebf631) {
          _0x2b1809 = _0xebf631;
        }
      }
      if (!isRecording && !_0x2b1809) {
        return;
      }
      isPending = true;
      startPoint = getEventPoint(_0x36bbb9);
      const _0x1834b5 = {
        target: _0x2b1809 || _0x36bbb9.target,
        originalEvent: _0x36bbb9
      };
      pendingEvent = _0x1834b5;
    },
    mousemove: _0x441b35 => {
      if (isMobile()) {
        return;
      }
      if (isPending && pendingEvent && !isDrawing) {
        const _0x613f70 = getEventPoint(_0x441b35);
        if (distance(startPoint, _0x613f70) >= MOVE_THRESHOLD) {
          isPending = false;
          shouldBlockContextMenu = true;
          const _0x2e71c0 = createGestureHandlers(_0x16948d, pendingEvent.target);
          _0x16948d._currentGestureHandlers = _0x2e71c0;
          _0x2e71c0.onGestureStart(pendingEvent.originalEvent);
          gesturePoints.push(_0x613f70);
          drawGestureTrail();
        }
      }
      if (_0x16948d._currentGestureHandlers && isDrawing) {
        _0x16948d._currentGestureHandlers.onGestureMove(_0x441b35);
      }
    },
    mouseup: _0x4f1c55 => {
      if (isMobile() || !isDrawing && !isPending) {
        return;
      }
      if (!isRecording && _0x4f1c55.button !== 2) {
        return;
      }
      if (isPending && !isDrawing) {
        clearPendingState();
        return;
      }
      if (isDrawing && _0x16948d._currentGestureHandlers) {
        _0x4f1c55.preventDefault();
        _0x4f1c55.stopPropagation();
        _0x4f1c55.stopImmediatePropagation();
        _0x16948d._currentGestureHandlers.onGestureEnd(_0x4f1c55);
        _0x16948d._currentGestureHandlers = null;
        clearPendingState();
        setTimeout(() => {
          shouldBlockContextMenu = false;
        }, 100);
      }
    },
    contextmenu: _0x25b16c => {
      if (isMobile() || shouldBlockContextMenu || isDrawing) {
        _0x25b16c.preventDefault();
        _0x25b16c.stopPropagation();
        _0x25b16c.stopImmediatePropagation();
        return false;
      }
    },
    touchstart: _0x169772 => {
      if (!extension_settings[extensionName].gestureEnabled) {
        return;
      }
      if (!isMobile() || _0x169772.touches.length !== 1) {
        return;
      }
      const _0x38b3fb = _0x169772.target.closest(".mes_text[data-gesture-bindied=\"true\"]");
      let _0xccd2da = _0x38b3fb;
      if (!_0xccd2da && _0x16948d.defaultView.frameElement && _0x16948d.body.hasAttribute(BINDIED_ATTR)) {
        let _0x5404b8 = _0x169772.target;
        if (_0x5404b8.tagName !== "DIV") {
          _0x5404b8 = _0x5404b8.closest("div");
        }
        if (_0x5404b8) {
          _0xccd2da = _0x5404b8;
        }
      }
      if (!isRecording && !_0xccd2da) {
        return;
      }
      isLongPress = false;
      isPending = false;
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      startPoint = getEventPoint(_0x169772);
      const _0x4be35f = {
        target: _0xccd2da || _0x169772.target,
        originalEvent: _0x169772
      };
      pendingEvent = _0x4be35f;
      longPressTimer = setTimeout(() => {
        if (!isDrawing) {
          isLongPress = true;
          pendingEvent = null;
          startPoint = null;
          console.log("[手势] 检测到长按，放行给系统处理复制");
        }
      }, LONG_PRESS_THRESHOLD);
    },
    touchmove: _0x274b3c => {
      if (!isMobile()) {
        return;
      }
      if (isLongPress) {
        return;
      }
      if (!startPoint || !pendingEvent) {
        return;
      }
      if (isDrawing && _0x16948d._currentGestureHandlers) {
        _0x16948d._currentGestureHandlers.onGestureMove(_0x274b3c);
        return;
      }
      const _0x52a746 = getEventPoint(_0x274b3c);
      if (distance(startPoint, _0x52a746) >= MOVE_THRESHOLD) {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
        isPending = false;
        const _0x19accd = createGestureHandlers(_0x16948d, pendingEvent.target);
        _0x16948d._currentGestureHandlers = _0x19accd;
        _0x19accd.onGestureStart(pendingEvent.originalEvent);
        gesturePoints.push(_0x52a746);
        drawGestureTrail();
      }
    },
    touchend: _0x45426f => {
      if (!isMobile()) {
        return;
      }
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (isLongPress) {
        setTimeout(() => {
          isLongPress = false;
          startPoint = null;
          pendingEvent = null;
        }, 1000);
        return;
      }
      if (!isDrawing) {
        startPoint = null;
        pendingEvent = null;
        isPending = false;
        return;
      }
      if (_0x16948d._currentGestureHandlers) {
        _0x16948d._currentGestureHandlers.onGestureEnd(_0x45426f);
        _0x16948d._currentGestureHandlers = null;
      }
      clearPendingState();
    },
    touchcancel: _0x1c6123 => {
      if (!isMobile()) {
        return;
      }
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (isLongPress) {
        setTimeout(() => {
          isLongPress = false;
          startPoint = null;
          pendingEvent = null;
        }, 1000);
        return;
      }
      clearPendingState();
      startPoint = null;
      pendingEvent = null;
      if (_0x16948d._currentGestureHandlers && isDrawing) {
        isDrawing = false;
        removeGestureCanvas();
        _0x16948d._currentGestureHandlers = null;
      }
    }
  };
  boundEventHandlers.set(_0x16948d, _0x28b677);
  _0x16948d.addEventListener("mousedown", _0x28b677.mousedown, true);
  _0x16948d.addEventListener("mousemove", _0x28b677.mousemove, true);
  _0x16948d.addEventListener("mouseup", _0x28b677.mouseup, true);
  _0x16948d.addEventListener("contextmenu", _0x28b677.contextmenu, true);
  _0x16948d.addEventListener("touchstart", _0x28b677.touchstart, {
    passive: true
  });
  _0x16948d.addEventListener("touchmove", _0x28b677.touchmove, {
    passive: true
  });
  _0x16948d.addEventListener("touchend", _0x28b677.touchend, {
    passive: true
  });
  _0x16948d.addEventListener("touchcancel", _0x28b677.touchcancel, {
    passive: true
  });
}
function removeDocumentGestureEvents(_0x3afd8d = document) {
  if (!_0x3afd8d._gestureEventsInitialized) {
    return;
  }
  const _0x47657a = boundEventHandlers.get(_0x3afd8d);
  if (_0x47657a) {
    _0x3afd8d.removeEventListener("mousedown", _0x47657a.mousedown, true);
    _0x3afd8d.removeEventListener("mousemove", _0x47657a.mousemove, true);
    _0x3afd8d.removeEventListener("mouseup", _0x47657a.mouseup, true);
    _0x3afd8d.removeEventListener("contextmenu", _0x47657a.contextmenu, true);
    _0x3afd8d.removeEventListener("touchstart", _0x47657a.touchstart, {
      passive: true
    });
    _0x3afd8d.removeEventListener("touchmove", _0x47657a.touchmove, {
      passive: true
    });
    _0x3afd8d.removeEventListener("touchend", _0x47657a.touchend, {
      passive: true
    });
    _0x3afd8d.removeEventListener("touchcancel", _0x47657a.touchcancel, {
      passive: true
    });
    boundEventHandlers.delete(_0x3afd8d);
  }
  _0x3afd8d._gestureEventsInitialized = false;
}
function scanGestureElements() {
  initDocumentGestureEvents(document);
  const _0x1c7f2e = document.getElementsByClassName("mes_text");
  for (const _0x21b025 of _0x1c7f2e) {
    bindGestureToMesText(_0x21b025);
  }
  const _0x40dd0e = document.querySelectorAll("iframe");
  _0x40dd0e.forEach(_0x405403 => {
    try {
      const _0x2722d3 = _0x405403.contentDocument;
      if (!_0x2722d3 || !_0x2722d3.body) {
        return;
      }
      initDocumentGestureEvents(_0x2722d3);
      if (!_0x2722d3.body.hasAttribute(BINDIED_ATTR)) {
        _0x2722d3.body.setAttribute(BINDIED_ATTR, "true");
      }
      const _0x616f3c = _0x2722d3.getElementsByClassName("mes_text");
      for (const _0x34a7c4 of _0x616f3c) {
        bindGestureToMesText(_0x34a7c4);
      }
    } catch (_0x3d9cdf) {}
  });
}
function initGestureMonitor() {
  console.log("[手势监控] ====== 初始化 (10x10 正方形化网格) ======");
  console.log("[手势监控] 特性: 强制拉伸为正方形 + 膨胀容错 + 动态模板");
  if (gesturePollingTimer) {
    return;
  }
  scanGestureElements();
  gesturePollingTimer = setInterval(scanGestureElements, 3000);
  console.log("[手势监控] ✓ 已启动");
}
function stopGestureMonitor() {
  console.log("[手势监控] ====== 停止监控 ======");
  if (gesturePollingTimer) {
    clearInterval(gesturePollingTimer);
    gesturePollingTimer = null;
  }
  removeDocumentGestureEvents(document);
  const _0x18b004 = document.querySelectorAll("iframe");
  _0x18b004.forEach(_0x27b839 => {
    try {
      const _0x2ff162 = _0x27b839.contentDocument;
      if (_0x2ff162) {
        removeDocumentGestureEvents(_0x2ff162);
      }
    } catch (_0x39bded) {}
  });
  const _0x1ca48c = document.getElementsByClassName("mes_text");
  for (const _0x2d6e5b of _0x1ca48c) {
    _0x2d6e5b.removeAttribute(BINDIED_ATTR);
  }
  console.log("[手势监控] ✓ 已停止");
}
export async function recordGesture() {
  return new Promise(_0x31bb4e => {
    isRecording = true;
    recordingResolve = _0x31bb4e;
    showGestureHint(document, "准备录制... 请按住鼠标/触摸屏幕开始绘制");
  });
}
export { initGestureMonitor, stopGestureMonitor };