import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { setItemImg, getItemImg } from "./database.js";
import { saveSettingsDebounced, eventSource } from "../../../../../script.js";
import { EventType } from "./config.js";
const REFERENCE_PIXEL_COUNT = 1011712;
const SIGMA_MAGIC_NUMBER = 19;
const SIGMA_MAGIC_NUMBER_V4_5 = 58;
export function isValidUrl(_0x331105) {
  if (!_0x331105 || _0x331105.trim() === "") {
    return true;
  }
  const _0x54911a = /^(https?:\/\/)?(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)*$/;
  return _0x54911a.test(_0x331105);
}
export function checkSendBuClass() {
  const _0x1b6ef7 = document.getElementById("send_but");
  const _0x28fb47 = document.getElementById("mes_stop");
  const _0x1151c1 = !_0x1b6ef7 || getComputedStyle(_0x1b6ef7).display === "none";
  const _0xdda3f4 = _0x28fb47 && getComputedStyle(_0x28fb47).display !== "none";
  return _0x1151c1 || _0xdda3f4;
}
function stringToBase64(_0x44d834) {
  const _0x1c8e82 = new TextEncoder().encode(_0x44d834);
  const _0x5220b3 = Array.from(_0x1c8e82, _0x1be8d0 => String.fromCodePoint(_0x1be8d0)).join("");
  return btoa(_0x5220b3);
}
export function getsdAuth() {
  return "Basic " + stringToBase64(extension_settings[extensionName].st_chatu8_sd_auth);
}
export async function getSDMode(_0x10d283) {
  try {
    const _0x5094e8 = new URL(_0x10d283);
    _0x5094e8.pathname = "/sdapi/v1/options";
    const _0x506e4b = await fetch(_0x5094e8, {
      method: "GET",
      headers: {
        Authorization: getsdAuth()
      }
    });
    if (!_0x506e4b.ok) {
      const _0x57a3e5 = await _0x506e4b.text();
      throw new Error("获取 SD 选项失败，状态码: " + _0x506e4b.status + ", 响应: " + _0x57a3e5);
    }
    const _0x42aedd = await _0x506e4b.json();
    const _0x6e257 = _0x42aedd.sd_model_checkpoint;
    addLog("当前 SD 模型: " + _0x6e257);
    return _0x6e257;
  } catch (_0x3daba6) {
    addLog("获取 SD 模型失败: " + _0x3daba6.message);
    throw _0x3daba6;
  }
}
;
export async function setSDMode(_0x5e8e4f, _0x13fb1d) {
  try {
    async function _0x4d66e3(_0x4cf548) {
      const _0x363df7 = new URL(_0x4cf548);
      _0x363df7.pathname = "/sdapi/v1/progress";
      const _0x40f9f1 = await fetch(_0x363df7, {
        method: "GET",
        headers: {
          Authorization: getsdAuth()
        }
      });
      return await _0x40f9f1.json();
    }
    toastr.info("正在切换模型...为" + _0x13fb1d);
    addLog("开始切换 SD 模型为: " + _0x13fb1d);
    const _0x275c98 = new URL(_0x5e8e4f);
    _0x275c98.pathname = "/sdapi/v1/options";
    const _0x17d524 = {
      sd_model_checkpoint: _0x13fb1d
    };
    const _0x3dd6a5 = _0x17d524;
    const _0x3faf68 = await fetch(_0x275c98, {
      method: "POST",
      body: JSON.stringify(_0x3dd6a5),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!_0x3faf68.ok) {
      const _0x593477 = await _0x3faf68.text();
      addLog("切换 SD 模型 API 请求失败。状态码: " + _0x3faf68.status + ", 响应: " + _0x593477);
      throw new Error("SD WebUI returned an error. Status: " + _0x3faf68.status);
    }
    const _0x45fbf5 = 10;
    const _0x4218d6 = 2000;
    for (let _0x63be0a = 0; _0x63be0a < _0x45fbf5; _0x63be0a++) {
      const _0x838818 = await _0x4d66e3(_0x5e8e4f);
      const _0x194d02 = _0x838818.progress;
      const _0x4c21cf = _0x838818.state.job_count;
      if (_0x194d02 === 0 && _0x4c21cf === 0) {
        break;
      }
      console.info("Waiting for SD WebUI to finish model loading... Progress: " + _0x194d02 + "; Job count: " + _0x4c21cf);
      await delay(_0x4218d6);
    }
    toastr.info("切换模型成功...为" + _0x13fb1d);
    addLog("SD model switched to: " + _0x13fb1d);
  } catch (_0x41449d) {
    addLog("切换 SD 模型失败: " + _0x41449d.message);
    toastr.error("切换模型失败: " + _0x41449d.message);
    throw _0x41449d;
  }
}
;
export function delay(_0xbb445f) {
  return new Promise(_0x521339 => setTimeout(_0x521339, _0xbb445f));
}
function isObject(_0x3c56c3) {
  return _0x3c56c3 && typeof _0x3c56c3 === "object" && !Array.isArray(_0x3c56c3);
}
export function deepMerge(_0x56e12b, _0x259bde) {
  let _0x121b02 = Object.assign({}, _0x56e12b);
  if (isObject(_0x56e12b) && isObject(_0x259bde)) {
    Object.keys(_0x259bde).forEach(_0x4b02be => {
      if (isObject(_0x259bde[_0x4b02be])) {
        if (!(_0x4b02be in _0x56e12b)) {
          Object.assign(_0x121b02, {
            [_0x4b02be]: _0x259bde[_0x4b02be]
          });
        } else {
          _0x121b02[_0x4b02be] = deepMerge(_0x56e12b[_0x4b02be], _0x259bde[_0x4b02be]);
        }
      } else {
        const _0x1d6b79 = {
          [_0x4b02be]: _0x259bde[_0x4b02be]
        };
        Object.assign(_0x121b02, _0x1d6b79);
      }
    });
  }
  return _0x121b02;
}
export async function processReferenceImage(_0x505696) {
  addLog("开始处理参考图...");
  return new Promise((_0x4853c7, _0x5b3b39) => {
    const _0xbe56e = new Image();
    _0xbe56e.onload = function () {
      const _0x26772c = _0xbe56e.width;
      const _0x905b6b = _0xbe56e.height;
      const _0x229227 = _0x26772c / _0x905b6b;
      addLog("参考图原始尺寸: " + _0x26772c + "x" + _0x905b6b + ", 宽高比: " + _0x229227.toFixed(2));
      const _0x393b10 = [{
        width: 1024,
        height: 1536,
        ratio: 1024 / 1536
      }, {
        width: 1472,
        height: 1472,
        ratio: 1
      }, {
        width: 1536,
        height: 1024,
        ratio: 1536 / 1024
      }];
      let _0x1d3a78 = _0x393b10[0];
      let _0x2184cf = Math.abs(_0x229227 - _0x393b10[0].ratio);
      for (let _0x1d9413 = 1; _0x1d9413 < _0x393b10.length; _0x1d9413++) {
        const _0xb81ce8 = Math.abs(_0x229227 - _0x393b10[_0x1d9413].ratio);
        if (_0xb81ce8 < _0x2184cf) {
          _0x2184cf = _0xb81ce8;
          _0x1d3a78 = _0x393b10[_0x1d9413];
        }
      }
      const _0x13a052 = document.createElement("canvas");
      _0x13a052.width = _0x1d3a78.width;
      _0x13a052.height = _0x1d3a78.height;
      const _0x152de1 = _0x13a052.getContext("2d");
      _0x152de1.imageSmoothingEnabled = true;
      _0x152de1.imageSmoothingQuality = "high";
      _0x152de1.drawImage(_0xbe56e, 0, 0, _0x1d3a78.width, _0x1d3a78.height);
      addLog("正在缩放参考图...");
      let _0x3be6f5;
      if (isMobileDevice()) {
        _0x3be6f5 = _0x13a052.toDataURL("image/jpeg", 0.3).replace(/^data:image\/jpeg;base64,/, "");
      } else {
        _0x3be6f5 = _0x13a052.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
      }
      _0x4853c7(_0x3be6f5);
    };
    _0xbe56e.onerror = _0x36c220 => {
      const _0x269980 = _0x36c220 instanceof Error ? _0x36c220.message : "未知错误";
      addLog("参考图加载失败: " + _0x269980);
      _0x5b3b39(new Error("图片加载失败"));
    };
    let _0x1f5d8e = _0x505696;
    if (_0x505696 && !_0x505696.startsWith("data:image")) {
      addLog("输入为原始base64，正在添加Data URL前缀...");
      _0x1f5d8e = "data:image/png;base64," + _0x505696;
    }
    _0xbe56e.src = _0x1f5d8e;
  });
}
export function calculateSkipCfgAboveSigma(_0x2e87b0, _0x3e2f76, _0x38e6fe) {
  addLog("计算 skip_cfg_above_sigma... 宽度: " + _0x2e87b0 + ", 高度: " + _0x3e2f76 + ", 模型: " + _0x38e6fe);
  const _0x106632 = _0x38e6fe?.includes("nai-diffusion-4-5") ? SIGMA_MAGIC_NUMBER_V4_5 : SIGMA_MAGIC_NUMBER;
  addLog("使用的 magicConstant: " + _0x106632);
  const _0x7b9037 = _0x2e87b0 * _0x3e2f76;
  const _0x3bb796 = _0x7b9037 / REFERENCE_PIXEL_COUNT;
  addLog("像素: " + _0x7b9037 + ", 比例: " + _0x3bb796.toFixed(4));
  const _0xc1412e = Math.pow(_0x3bb796, 0.5) * _0x106632;
  addLog("计算结果 skip_cfg_above_sigma: " + _0xc1412e);
  return _0xc1412e;
}
export function deduplicateTags(_0x53d432) {
  if (!_0x53d432 || typeof _0x53d432 !== "string") {
    return "";
  }
  const _0x354d61 = _0x53d432.split(",").map(_0x3fe4ce => _0x3fe4ce.trim()).filter(_0x4cfa96 => _0x4cfa96.length > 0);
  if (_0x354d61.length === 0) {
    return "";
  }
  const _0x1ba424 = new Map();
  for (const _0x19368a of _0x354d61) {
    const _0x5b4821 = _0x19368a.toLowerCase();
    if (!_0x1ba424.has(_0x5b4821)) {
      _0x1ba424.set(_0x5b4821, _0x19368a);
    }
  }
  const _0x589cc3 = Array.from(_0x1ba424.values()).join(", ");
  if (_0x354d61.length !== _0x1ba424.size) {
    addLog("[去重] " + _0x354d61.length + " 个标签 → " + _0x1ba424.size + " 个标签 (移除 " + (_0x354d61.length - _0x1ba424.size) + " 个重复)");
  }
  return _0x589cc3;
}
export function parsePromptStringWithCoordinates(_0xbc5e82) {
  addLog("解析场景构图字符串: " + _0xbc5e82);
  const _0xffb9ef = {
    "Scene Composition": "",
    "Character 1 Prompt": "",
    "Character 1 UC": "",
    "Character 2 Prompt": "",
    "Character 2 UC": "",
    "Character 3 Prompt": "",
    "Character 3 UC": "",
    "Character 4 Prompt": "",
    "Character 4 UC": "",
    "Character 1 centers": "",
    "Character 2 centers": "",
    "Character 3 centers": "",
    "Character 4 centers": "",
    "Character 1 coordinates": {},
    "Character 2 coordinates": {},
    "Character 3 coordinates": {},
    "Character 4 coordinates": {}
  };
  const _0x34d38b = _0xbc5e82.match(/Scene Composition:([^;]+);/);
  if (_0x34d38b) {
    _0xffb9ef["Scene Composition"] = deduplicateTags(_0x34d38b[1].trim());
  }
  for (let _0x2473d6 = 1; _0x2473d6 <= 4; _0x2473d6++) {
    const _0x1540ef = _0xbc5e82.match(new RegExp("Character " + _0x2473d6 + " Prompt:(.*?)(?:\\s*\\|\\s*centers:([^;\\s]+))?\\s*;"));
    if (_0x1540ef) {
      _0xffb9ef["Character " + _0x2473d6 + " Prompt"] = deduplicateTags(_0x1540ef[1].trim());
      if (_0x1540ef[2]) {
        _0xffb9ef["Character " + _0x2473d6 + " centers"] = _0x1540ef[2].trim();
        _0xffb9ef["Character " + _0x2473d6 + " coordinates"] = centersToCoordinates(_0x1540ef[2].trim());
      } else {
        _0xffb9ef["Character " + _0x2473d6 + " coordinates"] = {};
      }
    }
    const _0x30e3b4 = _0xbc5e82.match(new RegExp("Character " + _0x2473d6 + " UC:([^;]+);"));
    if (_0x30e3b4) {
      _0xffb9ef["Character " + _0x2473d6 + " UC"] = _0x30e3b4[1].trim();
    }
  }
  addLog("解析结果: " + JSON.stringify(_0xffb9ef, null, 2));
  return _0xffb9ef;
}
export function stylInput(_0x2c3235) {
  return new Promise(_0x55fc78 => {
    const _0x4e2ac7 = document.createElement("div");
    _0x4e2ac7.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;";
    document.body.appendChild(_0x4e2ac7);
    const _0x2f8efd = document.createElement("div");
    _0x2f8efd.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); z-index: 10000;";
    document.body.appendChild(_0x2f8efd);
    const _0x208566 = document.createElement("p");
    _0x208566.textContent = _0x2c3235;
    _0x208566.style.cssText = "margin-bottom: 20px; color: #333;";
    _0x2f8efd.appendChild(_0x208566);
    const _0x2d044b = document.createElement("input");
    _0x2d044b.style.cssText = "margin-bottom: 20px; color: #333; width: 100%; padding: 5px;";
    _0x2f8efd.appendChild(_0x2d044b);
    const _0x40f28a = document.createElement("div");
    _0x40f28a.style.textAlign = "right";
    _0x2f8efd.appendChild(_0x40f28a);
    const _0x46d61a = document.createElement("button");
    _0x46d61a.textContent = "取消";
    _0x46d61a.style.cssText = "margin-right: 10px; padding: 10px 20px; background-color: #6c757d; color: #fff; border: none; border-radius: 5px; cursor: pointer;";
    _0x40f28a.appendChild(_0x46d61a);
    const _0x2114de = document.createElement("button");
    _0x2114de.textContent = "确定";
    _0x2114de.style.cssText = "padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;";
    _0x40f28a.appendChild(_0x2114de);
    _0x46d61a.addEventListener("click", () => {
      document.body.removeChild(_0x4e2ac7);
      document.body.removeChild(_0x2f8efd);
      _0x55fc78(false);
    });
    _0x2114de.addEventListener("click", () => {
      document.body.removeChild(_0x4e2ac7);
      document.body.removeChild(_0x2f8efd);
      _0x55fc78(_0x2d044b.value);
    });
  });
}
function centersToCoordinates(_0x495866) {
  if (!_0x495866) {
    return {};
  }
  const _0x2bcc53 = _0x495866.match(/([a-e])([1-5])/i);
  if (!_0x2bcc53) {
    return {};
  }
  const _0x4ddbff = _0x2bcc53[1].toLowerCase();
  const _0x14bcf7 = parseInt(_0x2bcc53[2]);
  const _0x79239c = {
    a: 0.1,
    b: 0.3,
    c: 0.5,
    d: 0.7,
    e: 0.9
  };
  const _0x1d7bea = {
    "1": 0.1,
    "2": 0.3,
    "3": 0.5,
    "4": 0.7,
    "5": 0.9
  };
  const _0x3fb3c8 = {
    x: _0x79239c[_0x4ddbff] || 0.5,
    y: _0x1d7bea[_0x14bcf7] || 0.5
  };
  return _0x3fb3c8;
}
export async function convertImageToBase64(_0x4f7b89, _0x545bc6) {
  const _0x2c028f = new FileReader();
  _0x2c028f.onload = function (_0x510aa6) {
    const _0x48caa7 = _0x510aa6.target.result;
    setItemImg(_0x4f7b89, _0x48caa7);
  };
  _0x2c028f.readAsDataURL(_0x545bc6);
}
export function stylishConfirm(_0x2d1f7f) {
  return new Promise(_0x527a1a => {
    const _0x5c9f05 = document.createElement("div");
    _0x5c9f05.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;";
    document.body.appendChild(_0x5c9f05);
    const _0x27ff44 = document.createElement("div");
    _0x27ff44.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); z-index: 10000;";
    document.body.appendChild(_0x27ff44);
    const _0x4f25e3 = document.createElement("p");
    _0x4f25e3.textContent = _0x2d1f7f;
    _0x4f25e3.style.cssText = "margin-bottom: 20px; color: #333;";
    _0x27ff44.appendChild(_0x4f25e3);
    const _0x1678e0 = document.createElement("div");
    _0x1678e0.style.textAlign = "right";
    _0x27ff44.appendChild(_0x1678e0);
    const _0x35bcec = document.createElement("button");
    _0x35bcec.textContent = "取消";
    _0x35bcec.style.cssText = "margin-right: 10px; padding: 10px 20px; background-color: #6c757d; color: #fff; border: none; border-radius: 5px; cursor: pointer;";
    _0x1678e0.appendChild(_0x35bcec);
    const _0xe99473 = document.createElement("button");
    _0xe99473.textContent = "确定";
    _0xe99473.style.cssText = "padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;";
    _0x1678e0.appendChild(_0xe99473);
    _0x35bcec.addEventListener("click", () => {
      document.body.removeChild(_0x5c9f05);
      document.body.removeChild(_0x27ff44);
      _0x527a1a(false);
    });
    _0xe99473.addEventListener("click", () => {
      document.body.removeChild(_0x5c9f05);
      document.body.removeChild(_0x27ff44);
      _0x527a1a(true);
    });
  });
}
export function removeTrailingSlash(_0x53c733) {
  if (_0x53c733.endsWith("/")) {
    return _0x53c733.slice(0, -1);
  } else {
    return _0x53c733;
  }
}
export function escapeRegExp(_0x4a2a96) {
  return _0x4a2a96.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export function sleep(_0x3d10f) {
  return new Promise(_0x11ad3 => setTimeout(_0x11ad3, _0x3d10f));
}
export function waitForLock() {
  return new Promise(_0x6c3794 => {
    const _0x26377e = () => {
      if (window.xiancheng) {
        window.removeEventListener("xianchengReleased", _0x26377e);
        _0x6c3794();
      }
    };
    if (window.xiancheng) {
      _0x6c3794();
      return;
    }
    window.addEventListener("xianchengReleased", _0x26377e);
  });
}
export function releaseLock() {
  window.xiancheng = true;
  window.dispatchEvent(new Event("xianchengReleased"));
}
export function acquireLock() {
  window.xiancheng = false;
}
export function addSmoothShakeEffect(_0x44fd17) {
  if (getComputedStyle(_0x44fd17).position === "static") {
    _0x44fd17.style.position = "relative";
  }
  const _0x4b2ffa = Date.now();
  const _0x1c7249 = 300;
  const _0xf24477 = 3;
  function _0x48a109() {
    const _0x11044e = Date.now() - _0x4b2ffa;
    if (_0x11044e < _0x1c7249) {
      const _0x29fddd = _0xf24477 * Math.sin(_0x11044e / _0x1c7249 * Math.PI * 10);
      _0x44fd17.style.left = _0x29fddd + "px";
      requestAnimationFrame(_0x48a109);
    } else {
      _0x44fd17.style.left = "0px";
    }
  }
  requestAnimationFrame(_0x48a109);
}
export function generateRandomSeed() {
  return Math.floor(Math.random() * 10000000000);
}
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
export async function zhengmian(_0x3d22cb, _0x53b719, _0x53969f, _0x454e8d, _0x5abfeb) {
  _0x3d22cb = await stripChineseAnnotations(_0x3d22cb);
  _0x53b719 = await stripChineseAnnotations(_0x53b719);
  _0x53969f = await stripChineseAnnotations(_0x53969f);
  _0x454e8d = await stripChineseAnnotations(_0x454e8d);
  addLog("组合正面提示词 (复杂规则):");
  addLog("  - 前置前: " + _0x5abfeb.前置前);
  addLog("  - 固定提示词 (前): " + _0x3d22cb);
  addLog("  - 前置后: " + _0x5abfeb.前置后);
  addLog("  - 主要提示词: " + _0x53b719);
  addLog("  - 后置前: " + _0x5abfeb.后置前);
  addLog("  - 固定提示词 (后): " + _0x53969f);
  addLog("  - 后置后: " + _0x5abfeb.后置后);
  addLog("  - 质量标签 (AQT): " + _0x454e8d);
  addLog("  - 最后置: " + _0x5abfeb.最后置);
  const _0x232018 = [_0x5abfeb.前置前, _0x3d22cb, _0x5abfeb.前置后, _0x53b719, _0x5abfeb.后置前, _0x53969f, _0x5abfeb.后置后, _0x454e8d, _0x5abfeb.最后置];
  const _0x432e05 = _0x232018.filter(_0x5b8bb5 => _0x5b8bb5 && _0x5b8bb5.trim()).join(", ");
  addLog("组合后的正面提示词: " + _0x432e05);
  return _0x432e05;
}
export async function fumian(_0x2bf0c4, _0x2bb669) {
  _0x2bf0c4 = await stripChineseAnnotations(_0x2bf0c4);
  addLog("组合负面提示词:");
  addLog("  - 固定负面提示词: " + _0x2bf0c4);
  addLog("  - UCP 负面提示词: " + _0x2bb669);
  let _0x46e645;
  if (_0x2bf0c4 === "") {
    _0x46e645 = _0x2bb669;
  } else if (_0x2bb669 === "") {
    _0x46e645 = _0x2bf0c4;
  } else {
    _0x46e645 = _0x2bb669 + ", " + _0x2bf0c4;
  }
  addLog("组合后的负面提示词: " + _0x46e645);
  return _0x46e645;
}
export async function prompt_replace(_0x225b27, _0x342f88 = "") {
  const _0x3227c9 = extension_settings[extensionName].prompt_replace_id;
  const _0x2a416a = extension_settings[extensionName].prompt_replace;
  const _0x3736da = _0x2a416a?.[_0x3227c9]?.text ?? "";
  addLog("原始 Prompt (用于替换): " + _0x225b27);
  if (_0x3736da.trim() === "") {
    addLog("无有效替换规则，返回原始 Prompt。");
    const _0x1a77e3 = {
      modifiedPrompt: _0x225b27,
      insertions: {
        前置前: "",
        前置后: "",
        后置前: "",
        后置后: "",
        最后置: ""
      }
    };
    return _0x1a77e3;
  }
  addLog("使用的替换规则内容:\n" + _0x3736da);
  const _0x1000c9 = {
    前置前: [],
    前置后: [],
    后置前: [],
    后置后: [],
    最后置: []
  };
  let _0x161b83 = _0x225b27;
  let _0x1ae3af = _0x225b27 + _0x342f88;
  const _0x5e5fa8 = _0x3736da.split("\n");
  for (const _0x91e88f of _0x5e5fa8) {
    if (_0x91e88f.trim() === "") {
      continue;
    }
    const _0x579ddf = _0x91e88f.split("=");
    if (_0x579ddf.length < 2) {
      continue;
    }
    const _0x26e187 = _0x579ddf[0].trim();
    if (!_0x26e187) {
      continue;
    }
    const _0x220058 = _0x579ddf.slice(1).join("=");
    if (!_0x220058.includes("|")) {
      continue;
    }
    const _0x4447c5 = _0x220058.indexOf("|");
    const _0xf7ad3b = _0x220058.substring(0, _0x4447c5).trim();
    const _0x5a05a3 = _0x220058.substring(_0x4447c5 + 1).trim();
    if (_0x1ae3af.toLowerCase().includes(_0x26e187.toLowerCase())) {
      if (_0xf7ad3b === "替换") {
        addLog("Prompt 替换: \"" + _0x26e187 + "\" -> \"" + _0x5a05a3 + "\"");
        const _0x2bb0d9 = new RegExp(_0x26e187.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        _0x161b83 = _0x161b83.replace(_0x2bb0d9, _0x5a05a3);
      } else if (_0x1000c9.hasOwnProperty(_0xf7ad3b)) {
        addLog("发现插入: 类型=\"" + _0xf7ad3b + "\", 触发词=\"" + _0x26e187 + "\", 内容=\"" + _0x5a05a3 + "\"");
        _0x1000c9[_0xf7ad3b].push(_0x5a05a3);
      }
    }
  }
  const _0x121022 = {};
  for (const _0x2788cf in _0x1000c9) {
    _0x121022[_0x2788cf] = _0x1000c9[_0x2788cf].join(", ");
  }
  addLog("替换/删除后的 Prompt: " + _0x161b83);
  addLog("解析出的插入内容: " + JSON.stringify(_0x121022));
  const _0x4a587d = {
    modifiedPrompt: _0x161b83,
    insertions: _0x121022
  };
  return _0x4a587d;
}
export function prompt_replace_for_character(_0x1e6f51) {
  const _0x43d99b = extension_settings[extensionName].prompt_replace_id;
  const _0x1e2d09 = extension_settings[extensionName].prompt_replace;
  const _0x5ca1be = _0x1e2d09?.[_0x43d99b]?.text ?? "";
  addLog("原始角色 Prompt (用于分角色替换): " + _0x1e6f51);
  if (_0x5ca1be.trim() === "" || !_0x1e6f51) {
    addLog("无有效替换规则或空Prompt，返回原始Prompt。");
    return _0x1e6f51;
  }
  addLog("使用的替换规则内容 (分角色):\n" + _0x5ca1be);
  let _0x39910f = _0x1e6f51;
  const _0x2ae01a = _0x5ca1be.split("\n");
  for (const _0x105928 of _0x2ae01a) {
    if (_0x105928.trim() === "") {
      continue;
    }
    const _0x29ab72 = _0x105928.split("=");
    if (_0x29ab72.length < 2) {
      continue;
    }
    const _0x6da40e = _0x29ab72[0].trim();
    if (!_0x6da40e) {
      continue;
    }
    const _0x707e5b = _0x29ab72.slice(1).join("=");
    if (!_0x707e5b.includes("|")) {
      continue;
    }
    const _0x8a63b1 = _0x707e5b.indexOf("|");
    const _0x52996c = _0x707e5b.substring(0, _0x8a63b1).trim();
    const _0x375b4d = _0x707e5b.substring(_0x8a63b1 + 1);
    if ((_0x52996c === "替换分角色" || _0x52996c === "替换") && _0x39910f.toLowerCase().includes(_0x6da40e.toLowerCase())) {
      addLog("分角色 Prompt 替换: \"" + _0x6da40e + "\" -> \"" + _0x375b4d + "\"");
      const _0x5b4372 = new RegExp(_0x6da40e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      _0x39910f = _0x39910f.replace(_0x5b4372, _0x375b4d);
    }
  }
  addLog("分角色替换后的 Prompt: " + _0x39910f);
  return _0x39910f;
}
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export function extractPrompt(_0x1a128c, _0x42e9e1, _0x314862) {
  return _0x1a128c;
}
export function request(_0x44417d) {
  const {
    method: _0x4fd277,
    url: _0x33fb79,
    headers: _0x4e06f4,
    data: _0x5e4fae,
    responseType: _0x32c0ea
  } = _0x44417d;
  const _0x386958 = {
    method: _0x4fd277 || "GET",
    headers: _0x4e06f4,
    body: _0x5e4fae
  };
  const _0x5041e2 = _0x386958;
  return fetch(_0x33fb79, _0x5041e2).then(async _0x58c72d => {
    let _0xf83312;
    switch (_0x32c0ea) {
      case "json":
        _0xf83312 = await _0x58c72d.json();
        break;
      case "arraybuffer":
        _0xf83312 = await _0x58c72d.arrayBuffer();
        break;
      case "blob":
        _0xf83312 = await _0x58c72d.blob();
        break;
      default:
        _0xf83312 = await _0x58c72d.text();
    }
    return {
      status: _0x58c72d.status,
      statusText: _0x58c72d.statusText,
      response: _0xf83312,
      responseText: typeof _0xf83312 === "string" ? _0xf83312 : JSON.stringify(_0xf83312)
    };
  });
}
export function getRequestHeaders(_0x4ea8ad) {
  const _0x1ef48d = {
    "Content-Type": "application/json",
    "X-CSRF-Token": _0x4ea8ad
  };
  return _0x1ef48d;
}
export function addLog(_0x4f0622) {
  if (!extension_settings[extensionName].log) {
    extension_settings[extensionName].log = "";
  }
  const _0x15ad04 = new Date().toLocaleString();
  const _0x5cc117 = "[" + _0x15ad04 + "] " + _0x4f0622 + "\n";
  extension_settings[extensionName].log += _0x5cc117;
  const _0x15af0f = document.getElementById("ch-log-textarea");
  if (_0x15af0f) {
    _0x15af0f.value = getLog();
    _0x15af0f.scrollTop = _0x15af0f.scrollHeight;
  }
}
export function clearLog() {
  extension_settings[extensionName].log = "";
}
export function getLog() {
  return extension_settings[extensionName].log || "";
}
export async function processUploadedImage(_0x5a995f, _0x1694ed = false) {
  return new Promise((_0xc3ee2c, _0x20a8a6) => {
    const _0x5dbabc = new FileReader();
    _0x5dbabc.onload = _0x20a4f6 => {
      if (isMobileDevice() && !_0x1694ed) {
        const _0x48bf19 = new Image();
        _0x48bf19.onload = () => {
          const _0x5b19c5 = document.createElement("canvas");
          _0x5b19c5.width = _0x48bf19.width;
          _0x5b19c5.height = _0x48bf19.height;
          const _0xc78f1e = _0x5b19c5.getContext("2d");
          _0xc78f1e.drawImage(_0x48bf19, 0, 0);
          const _0xbdbbb0 = _0x5b19c5.toDataURL("image/jpeg", 0.3);
          addLog("图片已在移动端压缩 (JPEG 质量 0.3).");
          _0xc3ee2c(_0xbdbbb0);
        };
        _0x48bf19.onerror = _0x577ccf => _0x20a8a6(new Error("图片加载失败."));
        _0x48bf19.src = _0x20a4f6.target.result;
      } else {
        addLog("桌面端图片已加载.");
        _0xc3ee2c(_0x20a4f6.target.result);
      }
    };
    _0x5dbabc.onerror = _0x9c6a9 => _0x20a8a6(new Error("文件读取失败."));
    _0x5dbabc.readAsDataURL(_0x5a995f);
  });
}
export async function processUploadedImageToBlob(_0x46f30d) {
  if (isMobileDevice()) {
    return new Promise((_0x43bbe8, _0x5566ef) => {
      const _0x56915a = new FileReader();
      _0x56915a.onload = _0x2d9e84 => {
        const _0x53aa84 = new Image();
        _0x53aa84.onload = () => {
          const _0x1e221c = document.createElement("canvas");
          _0x1e221c.width = _0x53aa84.width;
          _0x1e221c.height = _0x53aa84.height;
          const _0x1a100b = _0x1e221c.getContext("2d");
          _0x1a100b.drawImage(_0x53aa84, 0, 0);
          _0x1e221c.toBlob(_0x53a2e4 => {
            if (_0x53a2e4) {
              addLog("图片已在移动端压缩 (JPEG 质量 0.5). 原始大小: " + _0x46f30d.size + " bytes, 压缩后大小: " + _0x53a2e4.size + " bytes");
              _0x43bbe8(_0x53a2e4);
            } else {
              _0x5566ef(new Error("Canvas to Blob 转换失败."));
            }
          }, "image/jpeg", 0.5);
        };
        _0x53aa84.onerror = _0x2cf42a => _0x5566ef(new Error("图片加载失败."));
        _0x53aa84.src = _0x2d9e84.target.result;
      };
      _0x56915a.onerror = _0x4d387c => _0x5566ef(new Error("文件读取失败."));
      _0x56915a.readAsDataURL(_0x46f30d);
    });
  } else {
    addLog("桌面端图片已加载. 大小: " + _0x46f30d.size + " bytes");
    return Promise.resolve(_0x46f30d);
  }
}
export function removeThinkingTags(_0x2cbb72) {
  if (!_0x2cbb72 || typeof _0x2cbb72 !== "string") {
    return _0x2cbb72 || "";
  }
  return _0x2cbb72.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
}
export function stripChineseAnnotations(_0x1329b3) {
  if (!_0x1329b3) {
    return "";
  }
  let _0x4c955a = _0x1329b3;
  let _0x4bea23;
  do {
    _0x4bea23 = _0x4c955a;
    _0x4c955a = _0x4c955a.replace(/（[^（）]*）/g, "");
  } while (_0x4c955a !== _0x4bea23);
  return _0x4c955a;
}
function blobToDataURL(_0x5001fd) {
  return new Promise((_0x51db75, _0x5be879) => {
    const _0x3c249a = new FileReader();
    _0x3c249a.onload = () => _0x51db75(_0x3c249a.result);
    _0x3c249a.onerror = _0x5be879;
    _0x3c249a.readAsDataURL(_0x5001fd);
  });
}
export async function convertImageToJpeg(_0x25ed5e) {
  const _0x26abd3 = await loadImage(_0x25ed5e);
  const _0x5c6236 = new OffscreenCanvas(_0x26abd3.width, _0x26abd3.height);
  const _0x4a22a3 = _0x5c6236.getContext("2d");
  _0x4a22a3.drawImage(_0x26abd3, 0, 0);
  const _0x291388 = await _0x5c6236.convertToBlob({
    type: "image/jpeg",
    quality: 0.98
  });
  return blobToDataURL(_0x291388);
}
function loadImage(_0x4ae439) {
  return new Promise((_0x35349e, _0x27989a) => {
    const _0x9a092f = new Image();
    _0x9a092f.onload = () => _0x35349e(_0x9a092f);
    _0x9a092f.onerror = () => _0x27989a(new Error("图片加载失败"));
    if (_0x4ae439 instanceof File) {
      _0x9a092f.src = URL.createObjectURL(_0x4ae439);
    } else if (typeof _0x4ae439 === "string") {
      _0x9a092f.src = _0x4ae439;
    }
  });
}
function _addToStcoOffsets(_0x1ca5b6, _0x499d83, _0x205b45, _0x48dc7c) {
  const _0x1f82c5 = new DataView(_0x1ca5b6.buffer, _0x1ca5b6.byteOffset, _0x1ca5b6.byteLength);
  let _0x5bbbb5 = _0x499d83;
  while (_0x5bbbb5 + 8 <= _0x205b45) {
    const _0x7fc4a3 = _0x1f82c5.getUint32(_0x5bbbb5);
    if (_0x7fc4a3 < 8 || _0x5bbbb5 + _0x7fc4a3 > _0x205b45) {
      break;
    }
    const _0x2b276f = String.fromCharCode(_0x1ca5b6[_0x5bbbb5 + 4], _0x1ca5b6[_0x5bbbb5 + 5], _0x1ca5b6[_0x5bbbb5 + 6], _0x1ca5b6[_0x5bbbb5 + 7]);
    if (_0x2b276f === "stco") {
      const _0x2e2afa = _0x1f82c5.getUint32(_0x5bbbb5 + 12);
      for (let _0x193cb2 = 0; _0x193cb2 < _0x2e2afa; _0x193cb2++) {
        const _0x19d280 = _0x5bbbb5 + 16 + _0x193cb2 * 4;
        _0x1f82c5.setUint32(_0x19d280, _0x1f82c5.getUint32(_0x19d280) + _0x48dc7c);
      }
    } else if (_0x2b276f === "co64") {
      const _0x14272f = _0x1f82c5.getUint32(_0x5bbbb5 + 12);
      for (let _0x1eb6af = 0; _0x1eb6af < _0x14272f; _0x1eb6af++) {
        const _0x56d08c = _0x5bbbb5 + 16 + _0x1eb6af * 8;
        const _0x2bb81f = _0x1f82c5.getUint32(_0x56d08c);
        const _0x342571 = _0x1f82c5.getUint32(_0x56d08c + 4);
        const _0x2c609e = BigInt(_0x2bb81f) << 0x20n | BigInt(_0x342571 >>> 0);
        const _0x374ae1 = _0x2c609e + BigInt(_0x48dc7c);
        _0x1f82c5.setUint32(_0x56d08c, Number(_0x374ae1 >> 0x20n));
        _0x1f82c5.setUint32(_0x56d08c + 4, Number(_0x374ae1 & 0xffffffffn));
      }
    } else if (["trak", "mdia", "minf", "stbl", "edts", "dinf", "udta"].includes(_0x2b276f)) {
      _addToStcoOffsets(_0x1ca5b6, _0x5bbbb5 + 8, _0x5bbbb5 + _0x7fc4a3, _0x48dc7c);
    }
    _0x5bbbb5 += _0x7fc4a3;
  }
}
export async function fixMp4Faststart(_0x29c489) {
  try {
    const _0x138797 = await _0x29c489.arrayBuffer();
    const _0x4e54de = new Uint8Array(_0x138797);
    const _0x2626ff = new DataView(_0x138797);
    const _0x544974 = [];
    let _0x43b349 = 0;
    while (_0x43b349 + 8 <= _0x4e54de.length) {
      let _0x1fd8a3 = _0x2626ff.getUint32(_0x43b349);
      const _0x685217 = String.fromCharCode(_0x4e54de[_0x43b349 + 4], _0x4e54de[_0x43b349 + 5], _0x4e54de[_0x43b349 + 6], _0x4e54de[_0x43b349 + 7]);
      if (_0x1fd8a3 === 0) {
        _0x1fd8a3 = _0x4e54de.length - _0x43b349;
      }
      if (_0x1fd8a3 < 8) {
        break;
      }
      _0x544974.push({
        type: _0x685217,
        size: _0x1fd8a3,
        data: _0x4e54de.slice(_0x43b349, _0x43b349 + _0x1fd8a3)
      });
      _0x43b349 += _0x1fd8a3;
    }
    const _0x2ca981 = _0x544974.findIndex(_0x570624 => _0x570624.type === "moov");
    const _0x404f81 = _0x544974.findIndex(_0x286220 => _0x286220.type === "mdat");
    if (_0x2ca981 === -1 || _0x404f81 === -1 || _0x2ca981 < _0x404f81) {
      return _0x29c489;
    }
    console.log("[mp4fix] moov 在 mdat 之后，执行 faststart 修复...");
    const _0x633cc5 = _0x544974[_0x2ca981];
    const _0x1d5132 = _0x633cc5.size;
    const _0x300b33 = _0x633cc5.data.slice();
    _addToStcoOffsets(_0x300b33, 8, _0x1d5132, _0x1d5132);
    const _0x77195b = [];
    for (let _0x250838 = 0; _0x250838 < _0x544974.length; _0x250838++) {
      if (_0x250838 === _0x2ca981) {
        continue;
      }
      if (_0x250838 === _0x404f81) {
        _0x77195b.push(_0x300b33);
      }
      _0x77195b.push(_0x544974[_0x250838].data);
    }
    console.log("[mp4fix] faststart 修复完成，moov 已移至文件头部");
    return new Blob(_0x77195b, {
      type: "video/mp4"
    });
  } catch (_0x3a23f1) {
    console.warn("[mp4fix] faststart 修复失败，使用原始 Blob:", _0x3a23f1);
    return _0x29c489;
  }
}