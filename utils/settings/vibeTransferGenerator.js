import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { saveConfigImage, getConfigImage, deleteConfigImage } from "../configDatabase.js";
import { processReferenceImage } from "../utils.js";
const FIXED_ENCODING_KEY = "b36a8472fe418d9f80d6bb1c54e3a6e62c62936aa7bf31dae2bcf7e929f6430f";
async function sha256(_0x54c89a) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    try {
      const _0x2f62ea = new TextEncoder().encode(_0x54c89a);
      const _0x4ac6e6 = await crypto.subtle.digest("SHA-256", _0x2f62ea);
      const _0x1cd013 = Array.from(new Uint8Array(_0x4ac6e6));
      return _0x1cd013.map(_0xf49df1 => _0xf49df1.toString(16).padStart(2, "0")).join("");
    } catch (_0xf154e) {
      console.warn("[Vibe] crypto.subtle 不可用，使用回退方案:", _0xf154e);
    }
  }
  let _0x53c13a = 0;
  for (let _0xf2f213 = 0; _0xf2f213 < _0x54c89a.length; _0xf2f213++) {
    const _0x328f38 = _0x54c89a.charCodeAt(_0xf2f213);
    _0x53c13a = (_0x53c13a << 5) - _0x53c13a + _0x328f38;
    _0x53c13a = _0x53c13a & _0x53c13a;
  }
  const _0x5dd42f = Date.now().toString(16);
  const _0x1cc3c7 = Math.random().toString(16).substring(2);
  const _0x4a25f6 = Math.abs(_0x53c13a).toString(16).padStart(8, "0");
  const _0x451c3b = (_0x5dd42f + _0x1cc3c7 + _0x4a25f6 + _0x54c89a.substring(0, 20)).replace(/[^0-9a-f]/g, "0");
  return _0x451c3b.padEnd(64, "0").substring(0, 64);
}
const blobToBase64 = _0x1a384c => new Promise((_0x409776, _0x3d20f) => {
  const _0x11c0f5 = new FileReader();
  _0x11c0f5.readAsDataURL(_0x1a384c);
  _0x11c0f5.onload = () => _0x409776(_0x11c0f5.result.split(",")[1]);
  _0x11c0f5.onerror = _0x11f9cb => _0x3d20f(_0x11f9cb);
});
function uint8ArrayToBase64(_0x5a9be3) {
  let _0x6ee59f = "";
  const _0x411338 = 8192;
  for (let _0x41bec6 = 0; _0x41bec6 < _0x5a9be3.length; _0x41bec6 += _0x411338) {
    const _0x392283 = _0x5a9be3.subarray(_0x41bec6, _0x41bec6 + _0x411338);
    _0x6ee59f += String.fromCharCode.apply(null, _0x392283);
  }
  return btoa(_0x6ee59f);
}
function base64ToUint8Array(_0x4fb064) {
  const _0x32c246 = atob(_0x4fb064);
  const _0x128297 = new Uint8Array(_0x32c246.length);
  for (let _0x2dd837 = 0; _0x2dd837 < _0x32c246.length; _0x2dd837++) {
    _0x128297[_0x2dd837] = _0x32c246.charCodeAt(_0x2dd837);
  }
  return _0x128297;
}
function jsonToDataUrl(_0xee3694) {
  const _0x5a3cb0 = new TextEncoder();
  const _0x9d807d = _0x5a3cb0.encode(_0xee3694);
  const _0x483714 = uint8ArrayToBase64(_0x9d807d);
  return "data:application/json;base64," + _0x483714;
}
function dataUrlToJson(_0xfe1489) {
  const _0x3f190d = _0xfe1489.split(",")[1];
  const _0x9950ae = base64ToUint8Array(_0x3f190d);
  const _0x10c1f9 = new TextDecoder();
  return _0x10c1f9.decode(_0x9950ae);
}
async function generateThumbnail(_0x577f53, _0x57a2fc = "png") {
  return new Promise((_0x29191f, _0xc0f6f7) => {
    const _0x40cc82 = new Image();
    _0x40cc82.onload = () => {
      const _0x53c90b = 256;
      const _0x5a33c7 = _0x53c90b / Math.max(_0x40cc82.width, _0x40cc82.height);
      const _0x145d9a = Math.floor(_0x40cc82.width * _0x5a33c7);
      const _0x1e0c01 = Math.floor(_0x40cc82.height * _0x5a33c7);
      const _0x14e42d = document.createElement("canvas");
      _0x14e42d.width = _0x145d9a;
      _0x14e42d.height = _0x1e0c01;
      const _0x31279d = _0x14e42d.getContext("2d");
      _0x31279d.drawImage(_0x40cc82, 0, 0, _0x145d9a, _0x1e0c01);
      const _0x3c5ead = _0x14e42d.toDataURL("image/jpeg", 0.8);
      _0x29191f(_0x3c5ead);
    };
    _0x40cc82.onerror = _0xc0f6f7;
    const _0x5e5002 = _0x57a2fc === "jpeg" ? "image/jpeg" : "image/png";
    _0x40cc82.src = _0x577f53.startsWith("data:") ? _0x577f53 : "data:" + _0x5e5002 + ";base64," + _0x577f53;
  });
}
function getModelKey(_0xe4b8a2) {
  if (_0xe4b8a2.includes("4-5-curated")) {
    return "v4-5curated";
  }
  if (_0xe4b8a2.includes("4-5-full")) {
    return "v4-5full";
  }
  if (_0xe4b8a2.includes("4-curated")) {
    return "v4curated";
  }
  if (_0xe4b8a2.includes("4-full")) {
    return "v4full";
  }
  return _0xe4b8a2;
}
async function buildVibeJson(_0x410d33, _0x13adb7, _0x26a7d3, _0xa68cb5, _0x4bf88e, _0x21aefc = "png") {
  const _0x264ab7 = await sha256(_0x410d33);
  const _0x39bf41 = getModelKey(_0x26a7d3);
  const _0x5e2c09 = await generateThumbnail(_0x410d33, _0x21aefc);
  const _0x37369c = {
    information_extracted: _0xa68cb5
  };
  const _0x3bc4be = {
    encoding: _0x13adb7,
    params: _0x37369c
  };
  const _0x5af69c = {
    [FIXED_ENCODING_KEY]: _0x3bc4be
  };
  const _0x3e4f42 = {
    [_0x39bf41]: _0x5af69c
  };
  const _0x1185c4 = {
    model: _0x26a7d3,
    information_extracted: _0xa68cb5,
    strength: _0x4bf88e
  };
  return {
    identifier: "novelai-vibe-transfer",
    version: 1,
    type: "image",
    image: _0x410d33,
    id: _0x264ab7,
    encodings: _0x3e4f42,
    name: _0x264ab7.slice(0, 6) + "-" + _0x264ab7.slice(-6),
    thumbnail: _0x5e2c09,
    createdAt: Date.now(),
    importInfo: _0x1185c4
  };
}
function ensureVibePresets() {
  const _0x17c67c = extension_settings[extensionName];
  if (!_0x17c67c.vibePresets) {
    _0x17c67c.vibePresets = {
      默认: {
        model: "nai-diffusion-4-5-full",
        infoExtract: 1,
        strength: 0.6,
        imageId: null,
        vibeDataId: null
      }
    };
  }
  if (!_0x17c67c.vibePresetId) {
    _0x17c67c.vibePresetId = "默认";
  }
  return _0x17c67c.vibePresets;
}
export function showVibeGeneratorDialog() {
  const _0x300737 = document.getElementById("st-chatu8-settings") || document.body;
  const _0x4824ad = extension_settings[extensionName];
  ensureVibePresets();
  const _0x3a81b5 = document.createElement("div");
  _0x3a81b5.className = "st-chatu8-workflow-viz-backdrop";
  _0x3a81b5.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-vibe-generator-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>Vibe 文件生成器 (.naiv4vibe)</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\" style=\"padding: 2rem;\">\n                <div class=\"st-chatu8-vibe-generator-content\">\n                    <!-- 预设选择器 -->\n                    <div class=\"st-chatu8-field\" style=\"margin-bottom: 1.2rem;\">\n                        <label for=\"vibe-preset-select\">氛围转移预设</label>\n                        <div class=\"st-chatu8-profile-controls\">\n                            <select id=\"vibe-preset-select\" class=\"st-chatu8-select\"></select>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-preset-new\" title=\"新建预设\">\n                                <i class=\"fa-solid fa-plus\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-preset-save\" title=\"保存当前预设\">\n                                <i class=\"fa-solid fa-save\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-preset-export-current\" title=\"导出当前预设\">\n                                <i class=\"fa-solid fa-upload\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-preset-export-all\" title=\"导出全部预设\">\n                                <i class=\"fa-solid fa-file-export\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn\" id=\"vibe-preset-import\" title=\"导入预设\">\n                                <i class=\"fa-solid fa-download\"></i>\n                            </button>\n                            <button class=\"st-chatu8-icon-btn danger\" id=\"vibe-preset-delete\" title=\"删除当前预设\">\n                                <i class=\"fa-solid fa-trash\"></i>\n                            </button>\n                        </div>\n                    </div>\n\n                    <!-- 图片预览 -->\n                    <div class=\"st-chatu8-field-col\" style=\"margin-bottom: 1.2rem;\">\n                        <label>参考图片预览</label>\n                        <div class=\"st-chatu8-image-preview-container\" id=\"vibe-image-preview-container\">\n                            <div class=\"st-chatu8-image-placeholder\">\n                                <i class=\"fa-solid fa-image\"></i>\n                                <span>没有选择图片</span>\n                            </div>\n                            <img id=\"vibe-preview-image\" src=\"\" alt=\"参考图预览\" style=\"display: none;\">\n                        </div>\n                        <div class=\"st-chatu8-image-controls\" style=\"margin-top: 0.5rem;\">\n                            <input type=\"file\" id=\"vibe-image-input\" accept=\"image/png, image/jpeg, image/webp\" style=\"display:none;\">\n                            <input type=\"file\" id=\"vibe-file-input\" accept=\".naiv4vibe\" style=\"display:none;\">\n                            <button type=\"button\" class=\"st-chatu8-btn\" id=\"vibe-select-image-btn\">\n                                <i class=\"fa-solid fa-upload\"></i> 选择图片\n                            </button>\n                            <button type=\"button\" class=\"st-chatu8-btn\" id=\"vibe-upload-file-btn\">\n                                <i class=\"fa-solid fa-file-import\"></i> 上传 Vibe 文件\n                            </button>\n                            <button type=\"button\" class=\"st-chatu8-btn danger\" id=\"vibe-remove-image-btn\" style=\"display: none;\">\n                                <i class=\"fa-solid fa-trash\"></i> 移除图片\n                            </button>\n                        </div>\n                    </div>\n\n                    <div class=\"st-chatu8-field\" style=\"margin-bottom: 1.2rem;\">\n                        <label for=\"vibe-model-select\">模型 (Model)</label>\n                        <select id=\"vibe-model-select\" class=\"st-chatu8-select\">\n                            <option value=\"nai-diffusion-4-5-full\">V4.5 Full</option>\n                            <option value=\"nai-diffusion-4-5-curated\">V4.5 Curated</option>\n                            <option value=\"nai-diffusion-4-full\">V4 Full</option>\n                            <option value=\"nai-diffusion-4-curated\">V4 Curated</option>\n                        </select>\n                    </div>\n                    \n                    <div class=\"st-chatu8-field\" style=\"margin-bottom: 1.5rem;\">\n                        <label for=\"vibe-strength-ref\">默认参考强度: <span id=\"vibe-strength-val\">0.6</span></label>\n                        <div class=\"st-chatu8-range-container\">\n                            <input type=\"range\" id=\"vibe-strength-ref\" class=\"st-chatu8-range-slider\" min=\"0\" max=\"1\" step=\"0.01\" value=\"0.6\">\n                            <input type=\"number\" id=\"vibe-strength-ref-num\" class=\"st-chatu8-range-input\" min=\"0\" max=\"1\" step=\"0.01\" value=\"0.6\">\n                        </div>\n                    </div>\n\n                    <button type=\"button\" class=\"st-chatu8-btn\" id=\"vibe-submit-btn\" style=\"width: 100%; padding: 1rem; font-size: 16px; font-weight: 600;\">\n                        <i class=\"fa-solid fa-wand-magic-sparkles\"></i> 生成并保存到预设\n                    </button>\n                    \n                    <button type=\"button\" class=\"st-chatu8-btn\" id=\"vibe-download-btn\" style=\"width: 100%; padding: 1rem; font-size: 16px; font-weight: 600; margin-top: 0.5rem; background: #000; border: 1px solid #333;\" title=\"请先生成或上传 Vibe 数据\">\n                        <i class=\"fa-solid fa-circle-exclamation\"></i> 请先生成或上传 Vibe 数据\n                    </button>\n                    \n                    <div id=\"vibe-status\" style=\"margin-top: 1.5rem; padding: 1rem; border-radius: 6px; font-size: 0.9rem; display: none; line-height: 1.4;\"></div>\n                </div>\n            </div>\n        </div>\n    ";
  _0x300737.appendChild(_0x3a81b5);
  const _0x3ae1ab = _0x3a81b5.querySelector(".st-chatu8-workflow-viz-close");
  _0x3ae1ab.onclick = () => _0x300737.removeChild(_0x3a81b5);
  _0x3a81b5.onclick = _0x1740ba => {
    if (_0x1740ba.target === _0x3a81b5) {
      _0x300737.removeChild(_0x3a81b5);
    }
  };
  const _0xf54ba6 = document.getElementById("vibe-preset-select");
  const _0x5d3239 = document.getElementById("vibe-model-select");
  const _0x599416 = document.getElementById("vibe-image-input");
  const _0x17b342 = document.getElementById("vibe-preview-image");
  const _0x3a0579 = document.getElementById("vibe-image-preview-container");
  const _0x24c0e7 = document.getElementById("vibe-select-image-btn");
  const _0x39ef47 = document.getElementById("vibe-remove-image-btn");
  const _0x440a22 = document.getElementById("vibe-strength-ref");
  const _0x300704 = document.getElementById("vibe-strength-ref-num");
  const _0x613e18 = document.getElementById("vibe-submit-btn");
  const _0x2a78d2 = document.getElementById("vibe-download-btn");
  const _0x871c2e = document.getElementById("vibe-status");
  const _0x2983ae = document.getElementById("vibe-preset-new");
  const _0x36fd7d = document.getElementById("vibe-preset-save");
  const _0x2a8c33 = document.getElementById("vibe-preset-delete");
  const _0x26b7e4 = document.getElementById("vibe-preset-export-current");
  const _0x23a5c3 = document.getElementById("vibe-preset-export-all");
  const _0x371d31 = document.getElementById("vibe-preset-import");
  const _0x35e590 = document.getElementById("vibe-upload-file-btn");
  const _0x183a9c = document.getElementById("vibe-file-input");
  let _0xff44a0 = null;
  let _0x596445 = null;
  let _0x35b9fa = null;
  function _0x11646d() {
    _0xf54ba6.innerHTML = "";
    const _0x23d6f3 = _0x4824ad.vibePresets;
    const _0x16d9a3 = Object.keys(_0x23d6f3).sort((_0x2dab5e, _0x2158e5) => _0x2dab5e.localeCompare(_0x2158e5, "zh-CN"));
    for (const _0x2a21e7 of _0x16d9a3) {
      const _0x5659ab = new Option(_0x2a21e7, _0x2a21e7);
      _0xf54ba6.add(_0x5659ab);
    }
    _0xf54ba6.value = _0x4824ad.vibePresetId;
  }
  function _0x282cfe() {
    if (_0x35b9fa) {
      _0x2a78d2.disabled = false;
      _0x2a78d2.innerHTML = "<i class=\"fa-solid fa-download\"></i> 下载 Vibe 文件 ✓";
      _0x2a78d2.title = "点击下载已保存的 Vibe 文件";
      _0x2a78d2.style.opacity = "1";
      _0x2a78d2.style.cursor = "pointer";
      _0x2a78d2.style.background = "";
      _0x2a78d2.style.border = "";
    } else {
      _0x2a78d2.disabled = true;
      _0x2a78d2.innerHTML = "<i class=\"fa-solid fa-circle-exclamation\"></i> 请先生成或上传 Vibe 数据";
      _0x2a78d2.title = "请先点击\"生成并保存到预设\"生成 Vibe 数据，或上传现有的 Vibe 文件";
      _0x2a78d2.style.opacity = "1";
      _0x2a78d2.style.cursor = "not-allowed";
      _0x2a78d2.style.background = "#000";
      _0x2a78d2.style.border = "1px solid #333";
    }
  }
  async function _0x3f1ca7() {
    const _0x5a41f6 = _0xf54ba6.value;
    const _0x772b69 = _0x4824ad.vibePresets[_0x5a41f6];
    if (!_0x772b69) {
      return;
    }
    _0x5d3239.value = _0x772b69.model || "nai-diffusion-4-5-full";
    _0x440a22.value = _0x772b69.strength ?? 0.6;
    _0x300704.value = _0x772b69.strength ?? 0.6;
    document.getElementById("vibe-strength-val").textContent = _0x772b69.strength ?? 0.6;
    _0x596445 = _0x772b69.imageId;
    _0x35b9fa = _0x772b69.vibeDataId || null;
    if (_0x596445) {
      try {
        const _0x423e2b = await getConfigImage(_0x596445);
        if (_0x423e2b) {
          _0x17b342.src = _0x423e2b;
          _0x17b342.style.display = "block";
          _0x3a0579.querySelector(".st-chatu8-image-placeholder").style.display = "none";
          _0x39ef47.style.display = "inline-block";
        } else {
          _0x1d77ca();
        }
      } catch (_0x4796f1) {
        console.error("[Vibe] 加载图片预览失败:", _0x4796f1);
        _0x1d77ca();
      }
    } else {
      _0x1d77ca();
    }
    _0x282cfe();
  }
  function _0x1d77ca() {
    _0xff44a0 = null;
    _0x596445 = null;
    _0x35b9fa = null;
    _0x599416.value = "";
    _0x17b342.src = "";
    _0x17b342.style.display = "none";
    _0x3a0579.querySelector(".st-chatu8-image-placeholder").style.display = "flex";
    _0x39ef47.style.display = "none";
  }
  _0x11646d();
  _0x3f1ca7();
  _0x2a78d2.disabled = true;
  _0xf54ba6.onchange = () => {
    _0x4824ad.vibePresetId = _0xf54ba6.value;
    saveSettingsDebounced();
    _0x3f1ca7();
  };
  _0x440a22.oninput = _0x1a6a99 => {
    _0x300704.value = _0x1a6a99.target.value;
    document.getElementById("vibe-strength-val").textContent = _0x1a6a99.target.value;
  };
  _0x300704.oninput = _0x2e0702 => {
    _0x440a22.value = _0x2e0702.target.value;
    document.getElementById("vibe-strength-val").textContent = _0x2e0702.target.value;
  };
  _0x24c0e7.onclick = () => _0x599416.click();
  _0x599416.onchange = _0x6c1a71 => {
    const _0x1f6a93 = _0x6c1a71.target.files[0];
    if (!_0x1f6a93) {
      return;
    }
    _0xff44a0 = _0x1f6a93;
    const _0x257876 = new FileReader();
    _0x257876.onload = _0x12ebb4 => {
      _0x17b342.src = _0x12ebb4.target.result;
      _0x17b342.style.display = "block";
      _0x3a0579.querySelector(".st-chatu8-image-placeholder").style.display = "none";
      _0x39ef47.style.display = "inline-block";
    };
    _0x257876.readAsDataURL(_0x1f6a93);
  };
  _0x39ef47.onclick = async () => {
    if (_0x596445) {
      try {
        await deleteConfigImage(_0x596445);
        const _0x2c53c4 = _0xf54ba6.value;
        _0x4824ad.vibePresets[_0x2c53c4].imageId = null;
        saveSettingsDebounced();
      } catch (_0x2b4c1a) {
        console.error("[Vibe] 删除图片失败:", _0x2b4c1a);
      }
    }
    _0x1d77ca();
  };
  _0x36fd7d.onclick = async () => {
    const _0x2ecf46 = _0xf54ba6.value;
    if (!_0x2ecf46 || _0x2ecf46 === "默认") {
      alert("请先\"新建\"一个新预设，默认预设不可修改。");
      return;
    }
    try {
      if (_0xff44a0) {
        const _0x430a2d = await new Promise((_0x2ce920, _0x2884f8) => {
          const _0x4aa449 = new FileReader();
          _0x4aa449.onload = _0x471f84 => _0x2ce920(_0x471f84.target.result);
          _0x4aa449.onerror = _0x2884f8;
          _0x4aa449.readAsDataURL(_0xff44a0);
        });
        if (_0x596445) {
          await deleteConfigImage(_0x596445);
        }
        const _0x400ead = await saveConfigImage(_0x430a2d, {
          format: _0xff44a0.type.split("/")[1] || "png",
          filename: "vibe_" + _0x2ecf46 + "_preview"
        });
        _0x596445 = _0x400ead;
        _0xff44a0 = null;
      }
      _0x4824ad.vibePresets[_0x2ecf46] = {
        model: _0x5d3239.value,
        infoExtract: 1,
        strength: parseFloat(_0x440a22.value),
        imageId: _0x596445,
        vibeDataId: _0x35b9fa
      };
      saveSettingsDebounced();
      _0x137c82("预设已保存！", "success");
    } catch (_0x1e1837) {
      console.error("[Vibe] 保存预设失败:", _0x1e1837);
      _0x137c82("保存失败: " + _0x1e1837.message, "error");
    }
  };
  _0x2983ae.onclick = async () => {
    const _0x22aa60 = prompt("请输入新预设名称:");
    if (!_0x22aa60) {
      return;
    }
    if (_0x4824ad.vibePresets[_0x22aa60]) {
      alert("该预设名称已存在，请使用其他名称。");
      return;
    }
    try {
      _0x4824ad.vibePresets[_0x22aa60] = {
        model: "nai-diffusion-4-5-full",
        infoExtract: 1,
        strength: 0.6,
        imageId: null,
        vibeDataId: null
      };
      _0x4824ad.vibePresetId = _0x22aa60;
      saveSettingsDebounced();
      _0x11646d();
      _0x3f1ca7();
      _0x137c82("新预设已创建！", "success");
    } catch (_0x4448ac) {
      console.error("[Vibe] 创建预设失败:", _0x4448ac);
      _0x137c82("创建失败: " + _0x4448ac.message, "error");
    }
  };
  _0x2a8c33.onclick = async () => {
    const _0x4e6b1b = _0xf54ba6.value;
    if (_0x4e6b1b === "默认") {
      alert("默认预设不可删除。");
      return;
    }
    if (!confirm("确定要删除预设 \"" + _0x4e6b1b + "\" 吗？此操作不可恢复！")) {
      return;
    }
    try {
      const _0x5b6b9b = _0x4824ad.vibePresets[_0x4e6b1b];
      if (_0x5b6b9b) {
        if (_0x5b6b9b.imageId) {
          await deleteConfigImage(_0x5b6b9b.imageId);
        }
        if (_0x5b6b9b.vibeDataId) {
          await deleteConfigImage(_0x5b6b9b.vibeDataId);
        }
      }
      delete _0x4824ad.vibePresets[_0x4e6b1b];
      _0x4824ad.vibePresetId = "默认";
      saveSettingsDebounced();
      _0x11646d();
      _0x3f1ca7();
      _0x137c82("预设已删除！", "success");
    } catch (_0x440831) {
      console.error("[Vibe] 删除预设失败:", _0x440831);
      _0x137c82("删除失败: " + _0x440831.message, "error");
    }
  };
  _0x26b7e4.onclick = async () => {
    const _0x1f8722 = _0xf54ba6.value;
    const _0x128ff4 = _0x4824ad.vibePresets[_0x1f8722];
    if (!_0x128ff4) {
      alert("没有选中的预设可导出。");
      return;
    }
    try {
      const _0x6bad4 = {
        [_0x1f8722]: _0x128ff4
      };
      const _0x5e69d9 = {
        presets: _0x6bad4,
        images: {},
        vibeData: {}
      };
      const _0x31b893 = _0x5e69d9;
      if (_0x128ff4.imageId) {
        try {
          const _0x88d254 = await getConfigImage(_0x128ff4.imageId);
          if (_0x88d254) {
            _0x31b893.images[_0x128ff4.imageId] = _0x88d254;
          }
        } catch (_0x1a8e1d) {
          console.error("[Vibe] 获取图片失败:", _0x1a8e1d);
        }
      }
      if (_0x128ff4.vibeDataId) {
        try {
          const _0xd0b242 = await getConfigImage(_0x128ff4.vibeDataId);
          if (_0xd0b242) {
            _0x31b893.vibeData[_0x128ff4.vibeDataId] = _0xd0b242;
          }
        } catch (_0x1b4277) {
          console.error("[Vibe] 获取 Vibe 数据失败:", _0x1b4277);
        }
      }
      const _0x235d72 = JSON.stringify(_0x31b893, null, 2);
      const _0x2254ad = new Blob([_0x235d72], {
        type: "application/json"
      });
      const _0x39a9dd = URL.createObjectURL(_0x2254ad);
      const _0x364c58 = document.createElement("a");
      _0x364c58.href = _0x39a9dd;
      _0x364c58.download = "vibe-preset-" + _0x1f8722 + ".json";
      document.body.appendChild(_0x364c58);
      _0x364c58.click();
      document.body.removeChild(_0x364c58);
      URL.revokeObjectURL(_0x39a9dd);
      _0x137c82("预设已导出！", "success");
    } catch (_0x5aaa44) {
      console.error("[Vibe] 导出预设失败:", _0x5aaa44);
      _0x137c82("导出失败: " + _0x5aaa44.message, "error");
    }
  };
  _0x23a5c3.onclick = async () => {
    if (!_0x4824ad.vibePresets || Object.keys(_0x4824ad.vibePresets).length === 0) {
      alert("没有预设可导出。");
      return;
    }
    try {
      const _0x275613 = {
        presets: _0x4824ad.vibePresets,
        images: {},
        vibeData: {}
      };
      const _0x1c77bd = _0x275613;
      const _0x8cd2da = new Set();
      const _0x1602a0 = new Set();
      for (const _0x2f27d5 in _0x4824ad.vibePresets) {
        const _0x54b25c = _0x4824ad.vibePresets[_0x2f27d5];
        if (_0x54b25c.imageId) {
          _0x8cd2da.add(_0x54b25c.imageId);
        }
        if (_0x54b25c.vibeDataId) {
          _0x1602a0.add(_0x54b25c.vibeDataId);
        }
      }
      for (const _0x4c3be4 of _0x8cd2da) {
        try {
          const _0x3e253b = await getConfigImage(_0x4c3be4);
          if (_0x3e253b) {
            _0x1c77bd.images[_0x4c3be4] = _0x3e253b;
          }
        } catch (_0x122e30) {
          console.error("[Vibe] 获取图片 " + _0x4c3be4 + " 失败:", _0x122e30);
        }
      }
      for (const _0x67f923 of _0x1602a0) {
        try {
          const _0x33c0e1 = await getConfigImage(_0x67f923);
          if (_0x33c0e1) {
            _0x1c77bd.vibeData[_0x67f923] = _0x33c0e1;
          }
        } catch (_0x3da4d7) {
          console.error("[Vibe] 获取 Vibe 数据 " + _0x67f923 + " 失败:", _0x3da4d7);
        }
      }
      const _0x418666 = JSON.stringify(_0x1c77bd, null, 2);
      const _0x186b60 = new Blob([_0x418666], {
        type: "application/json"
      });
      const _0x113adb = URL.createObjectURL(_0x186b60);
      const _0x9efee6 = document.createElement("a");
      _0x9efee6.href = _0x113adb;
      _0x9efee6.download = "vibe-presets-all.json";
      document.body.appendChild(_0x9efee6);
      _0x9efee6.click();
      document.body.removeChild(_0x9efee6);
      URL.revokeObjectURL(_0x113adb);
      _0x137c82("已导出 " + Object.keys(_0x4824ad.vibePresets).length + " 个预设！", "success");
    } catch (_0x280995) {
      console.error("[Vibe] 导出全部预设失败:", _0x280995);
      _0x137c82("导出失败: " + _0x280995.message, "error");
    }
  };
  _0x371d31.onclick = () => {
    const _0x1700f8 = document.createElement("input");
    _0x1700f8.type = "file";
    _0x1700f8.accept = ".json";
    _0x1700f8.onchange = async _0x58dceb => {
      const _0x12f983 = _0x58dceb.target.files[0];
      if (!_0x12f983) {
        return;
      }
      const _0x23a124 = new FileReader();
      _0x23a124.onload = async _0x372375 => {
        try {
          const _0x3ea511 = JSON.parse(_0x372375.target.result);
          let _0x1aa3dc = {};
          let _0x1a862b = _0x3ea511.images || {};
          let _0x4d86db = _0x3ea511.vibeData || {};
          if (_0x3ea511.presets) {
            _0x1aa3dc = _0x3ea511.presets;
          } else {
            _0x1aa3dc = _0x3ea511;
          }
          let _0x41d6f1 = 0;
          let _0x179df5 = 0;
          for (const _0x86e591 in _0x1aa3dc) {
            if (_0x4824ad.vibePresets[_0x86e591]) {
              const _0x486c57 = confirm("预设 \"" + _0x86e591 + "\" 已存在，是否覆盖？");
              if (!_0x486c57) {
                _0x179df5++;
                continue;
              }
            }
            const _0x128902 = _0x1aa3dc[_0x86e591];
            if (_0x128902.imageId && _0x1a862b[_0x128902.imageId]) {
              try {
                const _0x4cc910 = await saveConfigImage(_0x1a862b[_0x128902.imageId], {
                  format: "png",
                  filename: "vibe_" + _0x86e591 + "_preview"
                });
                _0x128902.imageId = _0x4cc910;
              } catch (_0x52489d) {
                console.error("[Vibe] 导入图片失败:", _0x52489d);
                _0x128902.imageId = null;
              }
            }
            if (_0x128902.vibeDataId && _0x4d86db[_0x128902.vibeDataId]) {
              try {
                const _0x525f76 = {
                  format: "png",
                  filename: "vibe_" + _0x86e591 + "_data"
                };
                const _0x4767b1 = await saveConfigImage(_0x4d86db[_0x128902.vibeDataId], _0x525f76);
                _0x128902.vibeDataId = _0x4767b1;
              } catch (_0x53defe) {
                console.error("[Vibe] 导入 Vibe 数据失败:", _0x53defe);
                _0x128902.vibeDataId = null;
              }
            }
            _0x4824ad.vibePresets[_0x86e591] = _0x128902;
            _0x41d6f1++;
          }
          saveSettingsDebounced();
          _0x11646d();
          _0x3f1ca7();
          _0x137c82("成功导入 " + _0x41d6f1 + " 个预设" + (_0x179df5 > 0 ? "，跳过 " + _0x179df5 + " 个" : "") + "！", "success");
        } catch (_0x403587) {
          console.error("[Vibe] 导入预设失败:", _0x403587);
          _0x137c82("导入失败: " + _0x403587.message, "error");
        }
      };
      _0x23a124.readAsText(_0x12f983);
    };
    _0x1700f8.click();
  };
  _0x35e590.onclick = () => _0x183a9c.click();
  _0x183a9c.onchange = async _0xf03388 => {
    const _0x58b410 = _0xf03388.target.files[0];
    if (!_0x58b410) {
      return;
    }
    try {
      const _0x3ff6a3 = new FileReader();
      _0x3ff6a3.onload = async _0x5f15db => {
        try {
          const _0x4de1c4 = JSON.parse(_0x5f15db.target.result);
          if (_0x4de1c4.identifier !== "novelai-vibe-transfer") {
            throw new Error("不是有效的 NovelAI Vibe 文件");
          }
          const _0x1bd0c7 = _0x4de1c4.image;
          if (!_0x1bd0c7) {
            throw new Error("Vibe 文件中没有图片数据");
          }
          if (!_0x4de1c4.encodings || Object.keys(_0x4de1c4.encodings).length === 0) {
            throw new Error("Vibe 文件中没有编码数据");
          }
          const _0xa50b0f = _0x4de1c4.importInfo || {};
          const _0x5cc51f = _0xa50b0f.model || "nai-diffusion-4-5-full";
          const _0x30d505 = _0xa50b0f.strength ?? 0.6;
          const _0x2bd7f6 = _0x1bd0c7.startsWith("data:") ? _0x1bd0c7 : "data:image/png;base64," + _0x1bd0c7;
          _0x17b342.src = _0x2bd7f6;
          _0x17b342.style.display = "block";
          _0x3a0579.querySelector(".st-chatu8-image-placeholder").style.display = "none";
          _0x39ef47.style.display = "inline-block";
          const _0x55fa52 = _0x1bd0c7.startsWith("data:") ? _0x1bd0c7.split(",")[1] : _0x1bd0c7;
          const _0x39ba80 = base64ToUint8Array(_0x55fa52);
          _0xff44a0 = new Blob([_0x39ba80], {
            type: "image/png"
          });
          _0xff44a0.name = _0x4de1c4.name || "vibe_image.png";
          _0x5d3239.value = _0x5cc51f;
          _0x440a22.value = _0x30d505;
          _0x300704.value = _0x30d505;
          document.getElementById("vibe-strength-val").textContent = _0x30d505;
          _0x137c82("正在保存 Vibe 数据到预设...", "loading");
          const _0x14d21b = JSON.stringify(_0x4de1c4, null, 4);
          const _0x4a0907 = jsonToDataUrl(_0x14d21b);
          if (_0x35b9fa) {
            await deleteConfigImage(_0x35b9fa);
          }
          const _0x33f764 = _0xf54ba6.value;
          const _0x580c02 = await saveConfigImage(_0x4a0907, {
            format: "png",
            filename: "vibe_" + _0x33f764 + "_uploaded"
          });
          _0x35b9fa = _0x580c02;
          if (_0xff44a0) {
            const _0x2d89d7 = await new Promise((_0x502cef, _0x522c2a) => {
              const _0x257201 = new FileReader();
              _0x257201.onload = _0x12cba7 => _0x502cef(_0x12cba7.target.result);
              _0x257201.onerror = _0x522c2a;
              _0x257201.readAsDataURL(_0xff44a0);
            });
            if (_0x596445) {
              await deleteConfigImage(_0x596445);
            }
            const _0x39274d = await saveConfigImage(_0x2d89d7, {
              format: "png",
              filename: "vibe_" + _0x33f764 + "_preview"
            });
            _0x596445 = _0x39274d;
            _0xff44a0 = null;
          }
          const _0xb419fc = {
            model: _0x5cc51f,
            infoExtract: 1,
            strength: _0x30d505,
            imageId: _0x596445,
            vibeDataId: _0x580c02
          };
          _0x4824ad.vibePresets[_0x33f764] = _0xb419fc;
          saveSettingsDebounced();
          _0x282cfe();
          _0x137c82("✅ Vibe 文件已上传并保存到预设！现在可以点击\"下载 Vibe 文件\"重新导出。", "success");
        } catch (_0x251ec5) {
          console.error("[Vibe] 解析 Vibe 文件失败:", _0x251ec5);
          _0x137c82("解析失败: " + _0x251ec5.message, "error");
        }
      };
      _0x3ff6a3.readAsText(_0x58b410);
    } catch (_0x46d483) {
      console.error("[Vibe] 读取 Vibe 文件失败:", _0x46d483);
      _0x137c82("读取失败: " + _0x46d483.message, "error");
    }
  };
  _0x613e18.onclick = async () => {
    const _0x1760bc = _0x4824ad.novelaiApi;
    if (!_0x1760bc || _0x1760bc === "000000") {
      _0x137c82("请先在 NovelAI 设置中填写 API Key", "error");
      return;
    }
    let _0x2aa6e5 = null;
    if (_0xff44a0) {
      _0x2aa6e5 = _0xff44a0;
    } else if (_0x596445) {
      try {
        const _0x18d610 = await getConfigImage(_0x596445);
        if (_0x18d610) {
          const _0x42d181 = _0x18d610.startsWith("data:") ? _0x18d610.split(",")[1] : _0x18d610;
          const _0x2e2488 = base64ToUint8Array(_0x42d181);
          _0x2aa6e5 = new Blob([_0x2e2488], {
            type: "image/png"
          });
          _0x2aa6e5.name = "vibe_image.png";
        }
      } catch (_0x555e99) {
        console.error("[Vibe] 加载图片失败:", _0x555e99);
      }
    }
    if (!_0x2aa6e5) {
      _0x137c82("请选择参考图片", "error");
      return;
    }
    const _0x9740c7 = _0x5d3239.value;
    const _0x5c8a85 = 1;
    const _0x35c94c = parseFloat(_0x440a22.value);
    try {
      _0x137c82("1/6 正在读取图片...", "loading");
      _0x613e18.disabled = true;
      const _0x3e0555 = await new Promise((_0x54bac3, _0x505044) => {
        const _0x57a5d5 = new FileReader();
        _0x57a5d5.onload = _0x93e55f => _0x54bac3(_0x93e55f.target.result);
        _0x57a5d5.onerror = _0x505044;
        _0x57a5d5.readAsDataURL(_0x2aa6e5);
      });
      _0x137c82("2/6 正在处理图片...", "loading");
      const _0x5642f7 = _0x2aa6e5.size;
      console.log("[Vibe] 原始图片大小: " + (_0x5642f7 / 1024).toFixed(2) + " KB");
      let _0x26e409;
      _0x26e409 = _0x3e0555.split(",")[1];
      console.log("[Vibe] 使用原始图片（未优化）");
      const _0x5f4a6c = _0x26e409;
      _0x137c82("3/6 正在请求 API 编码 Vibe...（需要几秒）", "loading");
      const _0x1e41e5 = {
        image: _0x5f4a6c,
        information_extracted: _0x5c8a85,
        model: _0x9740c7
      };
      const _0x5c9aa4 = _0x1e41e5;
      const _0x2eff37 = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + _0x1760bc
      };
      const _0x4aa746 = await fetch("https://image.novelai.net/ai/encode-vibe", {
        method: "POST",
        headers: _0x2eff37,
        body: JSON.stringify(_0x5c9aa4)
      });
      if (!_0x4aa746.ok) {
        let _0x51f25e;
        try {
          _0x51f25e = await _0x4aa746.text();
          const _0x2cffc3 = JSON.parse(_0x51f25e);
          throw new Error("API 错误 (" + _0x4aa746.status + "): " + (_0x2cffc3.message || _0x51f25e));
        } catch (_0x456a90) {
          if (_0x456a90.message.startsWith("API 错误")) {
            throw _0x456a90;
          }
          throw new Error("HTTP " + _0x4aa746.status + ": " + (_0x51f25e || _0x4aa746.statusText));
        }
      }
      const _0x3babe7 = await _0x4aa746.arrayBuffer();
      const _0x341cca = new Uint8Array(_0x3babe7);
      const _0xb1a7c1 = uint8ArrayToBase64(_0x341cca);
      console.log("[Vibe] encoding 原始字节: " + _0x341cca.length + " bytes, base64 长度: " + _0xb1a7c1.length);
      if (_0x341cca.length < 100) {
        throw new Error("encoding 数据异常 (仅 " + _0x341cca.length + " bytes)，API 可能返回了错误响应");
      }
      _0x137c82("4/6 正在构建 Vibe JSON...", "loading");
      const _0xc40f5b = _0x2aa6e5.type?.split("/")[1] || "png";
      console.log("[Vibe] 使用图片格式: " + _0xc40f5b);
      const _0x161acb = await buildVibeJson(_0x5f4a6c, _0xb1a7c1, _0x9740c7, _0x5c8a85, _0x35c94c, _0xc40f5b);
      _0x137c82("5/6 保存图片到预设...", "loading");
      if (_0xff44a0) {
        const _0x47d5c3 = await new Promise((_0x6670f2, _0x238fba) => {
          const _0x37afb2 = new FileReader();
          _0x37afb2.onload = _0x40e9b5 => _0x6670f2(_0x40e9b5.target.result);
          _0x37afb2.onerror = _0x238fba;
          _0x37afb2.readAsDataURL(_0xff44a0);
        });
        if (_0x596445) {
          await deleteConfigImage(_0x596445);
        }
        const _0x28b0d7 = _0xf54ba6.value;
        const _0x2a2a97 = await saveConfigImage(_0x47d5c3, {
          format: _0xff44a0.type?.split("/")[1] || "png",
          filename: "vibe_" + _0x28b0d7 + "_preview"
        });
        _0x596445 = _0x2a2a97;
        _0xff44a0 = null;
      }
      _0x137c82("6/6 保存 Vibe 数据到预设...", "loading");
      const _0x149a75 = JSON.stringify(_0x161acb, null, 4);
      const _0x596679 = jsonToDataUrl(_0x149a75);
      if (_0x35b9fa) {
        await deleteConfigImage(_0x35b9fa);
      }
      const _0x532785 = _0xf54ba6.value;
      const _0x53ffc9 = {
        format: "png",
        filename: "vibe_" + _0x532785 + "_data"
      };
      const _0x4c6e58 = await saveConfigImage(_0x596679, _0x53ffc9);
      _0x35b9fa = _0x4c6e58;
      const _0xa46698 = {
        model: _0x9740c7,
        infoExtract: 1,
        strength: _0x35c94c,
        imageId: _0x596445,
        vibeDataId: _0x4c6e58
      };
      _0x4824ad.vibePresets[_0x532785] = _0xa46698;
      saveSettingsDebounced();
      _0x282cfe();
      const _0x28ee8c = _0x161acb.name + ".naiv4vibe";
      _0x137c82("✅ 完成！Vibe 数据已自动保存到预设 \"" + _0x532785 + "\"<br>点击\"下载 Vibe 文件\"可导出 " + _0x28ee8c, "success");
    } catch (_0x466e19) {
      console.error("[Vibe] 生成失败:", _0x466e19);
      _0x137c82("失败: " + _0x466e19.message, "error");
    } finally {
      _0x613e18.disabled = false;
    }
  };
  _0x2a78d2.onclick = async () => {
    if (!_0x35b9fa) {
      _0x137c82("没有可下载的 Vibe 数据，请先生成。", "error");
      return;
    }
    try {
      _0x2a78d2.disabled = true;
      _0x137c82("正在准备下载...", "loading");
      const _0x13e7ee = await getConfigImage(_0x35b9fa);
      if (!_0x13e7ee) {
        throw new Error("无法读取 Vibe 数据");
      }
      const _0x144086 = dataUrlToJson(_0x13e7ee);
      const _0x1f5834 = JSON.parse(_0x144086);
      if (_0x1f5834.identifier !== "novelai-vibe-transfer") {
        throw new Error("存储的数据不是有效的 Vibe 格式");
      }
      const _0x4d6c79 = new Blob([_0x144086], {
        type: "application/json"
      });
      const _0x263591 = window.URL.createObjectURL(_0x4d6c79);
      const _0x1b6c9b = (_0x1f5834.name || "vibe") + ".naiv4vibe";
      const _0x4d02c0 = document.createElement("a");
      _0x4d02c0.href = _0x263591;
      _0x4d02c0.download = _0x1b6c9b;
      document.body.appendChild(_0x4d02c0);
      _0x4d02c0.click();
      window.URL.revokeObjectURL(_0x263591);
      document.body.removeChild(_0x4d02c0);
      _0x137c82("文件 " + _0x1b6c9b + " 已下载！可以直接上传到 NovelAI 官网使用。", "success");
    } catch (_0x4a3dcf) {
      console.error("[Vibe] 下载失败:", _0x4a3dcf);
      _0x137c82("下载失败: " + _0x4a3dcf.message, "error");
    } finally {
      _0x2a78d2.disabled = false;
    }
  };
  function _0x137c82(_0x356d65, _0x11364b) {
    _0x871c2e.innerHTML = _0x356d65;
    _0x871c2e.style.display = "block";
    _0x871c2e.className = "";
    _0x871c2e.style.textAlign = "";
    if (_0x11364b === "success") {
      _0x871c2e.style.background = "rgba(27, 94, 32, 0.2)";
      _0x871c2e.style.color = "#81c784";
      _0x871c2e.style.border = "1px solid #2e7d32";
    } else if (_0x11364b === "error") {
      _0x871c2e.style.background = "rgba(183, 28, 28, 0.2)";
      _0x871c2e.style.color = "#ef9a9a";
      _0x871c2e.style.border = "1px solid #c62828";
    } else if (_0x11364b === "loading") {
      _0x871c2e.style.background = "#333";
      _0x871c2e.style.color = "#90caf9";
      _0x871c2e.style.border = "none";
      _0x871c2e.style.textAlign = "center";
    }
  }
}
export function initVibeGenerator(_0x453809) {
  const _0x46555b = _0x453809.find("#novelai-vibe-generator-btn");
  if (_0x46555b.length) {
    _0x46555b.on("click", () => {
      showVibeGeneratorDialog();
    });
  }
}