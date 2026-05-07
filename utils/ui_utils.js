import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { saveSettingsDebounced } from "../../../../../script.js";
const generationTabs = ["sd", "novelai", "comfyui"];
import { storeDelete, storeReadOnly } from "./database.js";
function checkSendBuClass() {
  const _0x9188fe = document.getElementById("send_but");
  const _0x4864f9 = document.getElementById("mes_stop");
  const _0x478efb = !_0x9188fe || getComputedStyle(_0x9188fe).display === "none";
  const _0x1a9853 = _0x4864f9 && getComputedStyle(_0x4864f9).display !== "none";
  return _0x478efb || _0x1a9853;
}
export function isThemeDark(_0x1533c0) {
  const _0x338f30 = _0x1533c0["--st-chatu8-bg-primary"] || "#ffffff";
  const _0x4795ba = _0x338f30.substring(1);
  const _0x1eb0b2 = parseInt(_0x4795ba, 16);
  const _0x831931 = _0x1eb0b2 >> 16 & 255;
  const _0xe665bf = _0x1eb0b2 >> 8 & 255;
  const _0x3e4d1b = _0x1eb0b2 >> 0 & 255;
  const _0x400a54 = _0x831931 * 0.2126 + _0xe665bf * 0.7152 + _0x3e4d1b * 0.0722;
  return _0x400a54 < 128;
}
export function tishici_change(_0xf3c642) {
  const _0x4c711d = extension_settings[extensionName];
  const _0x4598c8 = getSuffix(_0xf3c642);
  const _0x34bf3e = document.getElementById("yusheid" + _0x4598c8);
  const _0xac671b = _0x34bf3e.value;
  const _0x368ee9 = "yusheid" + (_0xf3c642 === "sd" ? "_sd" : _0x4598c8);
  const _0x5ab86f = _0x4c711d[_0x368ee9];
  if (_0xac671b === _0x5ab86f) {
    return;
  }
  const _0x3eba29 = _0x4c711d.yushe[_0x5ab86f] || {};
  const _0x52c60f = document.getElementById("fixedPrompt" + _0x4598c8).value;
  const _0x2b6d2c = document.getElementById("fixedPrompt_end" + _0x4598c8).value;
  const _0xc72ff6 = document.getElementById("negativePrompt" + _0x4598c8).value;
  const _0x630a79 = _0x52c60f !== (_0x3eba29.fixedPrompt ?? "") || _0x2b6d2c !== (_0x3eba29.fixedPrompt_end ?? "") || _0xc72ff6 !== (_0x3eba29.negativePrompt ?? "");
  const _0x5b895c = () => {
    _0x4c711d[_0x368ee9] = _0xac671b;
    saveSettingsDebounced();
    const _0x4d6299 = _0x4c711d.yushe[_0xac671b] || {};
    document.getElementById("fixedPrompt" + _0x4598c8).value = _0x4d6299.fixedPrompt ?? "";
    document.getElementById("fixedPrompt_end" + _0x4598c8).value = _0x4d6299.fixedPrompt_end ?? "";
    document.getElementById("negativePrompt" + _0x4598c8).value = _0x4d6299.negativePrompt ?? "";
    const _0xd081ba = ["fixedPrompt", "fixedPrompt_end", "negativePrompt"];
    _0xd081ba.forEach(_0x4c142e => {
      const _0x170ca6 = document.getElementById(_0x4c142e + _0x4598c8);
      const _0x44da6d = _0x170ca6.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
      if (_0x44da6d) {
        $(_0x44da6d).hide();
      }
    });
  };
  if (_0x630a79) {
    stylishConfirm("您有未保存的更改。要放弃这些更改并切换预设吗？").then(_0x374df0 => {
      if (_0x374df0) {
        _0x5b895c();
      } else {
        _0x34bf3e.value = _0x5ab86f;
      }
    });
  } else {
    _0x5b895c();
  }
}
export function syncAllPromptReplaceFields(_0x2ad59f = false) {
  const _0x35aa0f = extension_settings[extensionName];
  const _0x5b40ab = _0x35aa0f.prompt_replace_id;
  const _0x8c33d8 = _0x35aa0f.prompt_replace[_0x5b40ab] || {};
  generationTabs.forEach(_0x2057b4 => {
    const _0xbcfe66 = getSuffix(_0x2057b4);
    const _0x378357 = document.getElementById("prompt_replace_id" + _0xbcfe66);
    if (_0x378357) {
      _0x378357.value = _0x5b40ab;
    }
    const _0xa4f703 = document.getElementById("prompt_replace_text" + _0xbcfe66);
    const _0x1f044e = _0xa4f703.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
    let _0x28da99 = _0xa4f703.value !== (_0x8c33d8.text ?? "");
    if (_0x2ad59f || !_0x28da99) {
      _0xa4f703.value = _0x8c33d8.text ?? "";
      if (_0x1f044e) {
        $(_0x1f044e).hide();
      }
    }
  });
}
export function applyFabSettings() {
  const _0x67b24f = extension_settings[extensionName];
  const _0x3d0e63 = $("#st-chatu8-fab");
  if (!_0x3d0e63.length) {
    return;
  }
  if (_0x67b24f.enable_chatu8_fab) {
    _0x3d0e63.show();
    _0x3d0e63.css("background-color", _0x67b24f.chatu8_fab_bg_color || "#ADD8E6");
    _0x3d0e63.find("i").css("color", _0x67b24f.chatu8_fab_icon_color || "#FFFFFF");
    _0x3d0e63.css("opacity", _0x67b24f.chatu8_fab_opacity ?? 1);
    const _0x5cce38 = _0x67b24f.chatu8_fab_size ?? 50;
    _0x3d0e63.css("width", _0x5cce38 + "px");
    _0x3d0e63.css("height", _0x5cce38 + "px");
    _0x3d0e63.find("i").css("font-size", Math.round(_0x5cce38 * 0.48) + "px");
    const _0x359494 = window.innerWidth <= 768;
    const _0x2b8568 = _0x359494 ? _0x67b24f.chatu8_fab_position.mobile || defaultSettings.chatu8_fab_position.mobile : _0x67b24f.chatu8_fab_position.desktop || defaultSettings.chatu8_fab_position.desktop;
    _0x3d0e63.css("top", _0x2b8568.top);
    _0x3d0e63.css("left", _0x2b8568.left);
  } else {
    _0x3d0e63.hide();
  }
}
export function tishici_export_current() {
  const _0x28f97c = extension_settings[extensionName];
  const _0x35f105 = document.querySelector(".st-chatu8-tab-content.active").id.replace("ch-tab-", "");
  const _0x59ded2 = getSuffix(_0x35f105);
  const _0x582f6a = "yusheid" + (_0x35f105 === "sd" ? "_sd" : _0x59ded2);
  const _0x175ca8 = _0x28f97c[_0x582f6a];
  if (!_0x175ca8 || !_0x28f97c.yushe[_0x175ca8]) {
    alert("没有选中的预设可导出。");
    return;
  }
  const _0x5adebb = {
    [_0x175ca8]: _0x28f97c.yushe[_0x175ca8]
  };
  const _0x579c03 = _0x5adebb;
  const _0x3f6e31 = JSON.stringify(_0x579c03, null, 2);
  const _0x2b5e67 = new Blob([_0x3f6e31], {
    type: "application/json"
  });
  const _0x3c9366 = URL.createObjectURL(_0x2b5e67);
  const _0x53352e = document.createElement("a");
  _0x53352e.href = _0x3c9366;
  _0x53352e.download = "st-chatu8-prompt-preset-" + _0x175ca8 + ".json";
  document.body.appendChild(_0x53352e);
  _0x53352e.click();
  document.body.removeChild(_0x53352e);
  URL.revokeObjectURL(_0x3c9366);
}
export function tishici_update(_0x5a2a9b) {
  const _0xc4273b = extension_settings[extensionName];
  const _0x18ba41 = getSuffix(_0x5a2a9b);
  const _0x251b2d = "yusheid" + (_0x5a2a9b === "sd" ? "_sd" : _0x18ba41);
  const _0x26077b = _0xc4273b[_0x251b2d];
  if (!_0x26077b || !_0xc4273b.yushe[_0x26077b]) {
    alert("没有活动的预设可保存。请先“另存为”一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前预设 \"" + _0x26077b + "\" 吗？").then(_0x34cd85 => {
    if (_0x34cd85) {
      const _0x394437 = document.getElementById("fixedPrompt" + _0x18ba41).value;
      const _0x3a3b8e = document.getElementById("fixedPrompt_end" + _0x18ba41).value;
      const _0x27e4ef = document.getElementById("negativePrompt" + _0x18ba41).value;
      const _0x35961f = {
        fixedPrompt: _0x394437,
        fixedPrompt_end: _0x3a3b8e,
        negativePrompt: _0x27e4ef
      };
      _0xc4273b.yushe[_0x26077b] = _0x35961f;
      saveSettingsDebounced();
      const _0xb8e50b = ["fixedPrompt", "fixedPrompt_end", "negativePrompt"];
      _0xb8e50b.forEach(_0x115865 => {
        const _0x301856 = document.getElementById(_0x115865 + _0x18ba41);
        const _0x2a105a = _0x301856.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
        if (_0x2a105a) {
          $(_0x2a105a).hide();
        }
      });
    }
  });
}
export function showSettingsPanel() {
  const _0x5745c0 = extension_settings[extensionName];
  const _0x14f818 = $("#ch-settings-modal");
  if (!_0x14f818.length) {
    console.error("Settings panel not found!");
    return;
  }
  const _0x58f6e9 = _0x5745c0.lastTab || "main";
  const _0x1f8f58 = _0x14f818.find(".st-chatu8-nav-link[data-tab=\"" + _0x58f6e9 + "\"]");
  if (_0x1f8f58.length) {
    _0x1f8f58.click();
  } else {
    _0x14f818.find(".st-chatu8-nav-link[data-tab=\"main\"]").click();
  }
  const _0x6b3a4b = _0x14f818.find(".st-chatu8-modal-content");
  if (window.innerWidth <= 768) {
    const _0x4d0eaa = $("#ai-config-button").outerHeight(true) || 0;
    _0x14f818.css({
      "align-items": "start"
    });
    const _0x2b3bb8 = {
      "margin-top": _0x4d0eaa + "px",
      height: "calc(90vh - " + _0x4d0eaa + "px)"
    };
    _0x6b3a4b.css(_0x2b3bb8);
  } else {
    _0x14f818.css({
      "align-items": ""
    });
    _0x6b3a4b.css({
      "margin-top": "",
      height: ""
    });
  }
  _0x14f818.css("display", "grid");
  _0x14f818.find(".st-chatu8-modal-content").focus();
}
export function theme_export(_0x38fd02 = false) {
  const _0xf383d3 = extension_settings[extensionName];
  const _0x54e469 = _0xf383d3.theme_id;
  if (!_0x38fd02 && !_0xf383d3.themes[_0x54e469]) {
    alert("没有选中的主题可导出。");
    return;
  }
  const _0x22bdf8 = _0x38fd02 ? _0xf383d3.themes : {
    [_0x54e469]: _0xf383d3.themes[_0x54e469]
  };
  const _0x285f51 = JSON.stringify(_0x22bdf8, null, 2);
  const _0x26e096 = new Blob([_0x285f51], {
    type: "application/json"
  });
  const _0x2e85a7 = URL.createObjectURL(_0x26e096);
  const _0x565b8b = document.createElement("a");
  _0x565b8b.href = _0x2e85a7;
  _0x565b8b.download = "st-chatu8-theme" + (_0x38fd02 ? "s-all" : "-" + _0x54e469) + ".json";
  document.body.appendChild(_0x565b8b);
  _0x565b8b.click();
  document.body.removeChild(_0x565b8b);
  URL.revokeObjectURL(_0x2e85a7);
}
export function hideSettingsPanel() {
  const _0x273c09 = $("#ch-settings-modal");
  _0x273c09.hide();
  _0x273c09.css({
    "align-items": "",
    "padding-top": ""
  });
  _0x273c09.find(".st-chatu8-modal-content").css({
    "margin-top": "",
    height: ""
  });
}
export function prompt_replace_change(_0x23aecf) {
  const _0x52a1a8 = extension_settings[extensionName];
  const _0x58b50f = getSuffix(_0x23aecf);
  const _0x1ac28f = document.getElementById("prompt_replace_id" + _0x58b50f);
  const _0x45715d = _0x1ac28f.value;
  const _0x150639 = _0x52a1a8.prompt_replace_id;
  const _0x41f968 = _0x52a1a8.prompt_replace[_0x150639] || {};
  const _0x4c9e36 = document.getElementById("prompt_replace_text" + _0x58b50f).value;
  const _0x4a0140 = _0x4c9e36 !== (_0x41f968.text ?? "");
  if (_0x4a0140) {
    stylishConfirm("您有未保存的替换规则。要放弃这些更改并切换预设吗？").then(_0x2060a4 => {
      if (_0x2060a4) {
        _0x52a1a8.prompt_replace_id = _0x45715d;
        saveSettingsDebounced();
        syncAllPromptReplaceFields(true);
      } else {
        _0x1ac28f.value = _0x150639;
      }
    });
  } else {
    _0x52a1a8.prompt_replace_id = _0x45715d;
    saveSettingsDebounced();
    syncAllPromptReplaceFields(true);
  }
}
export async function clearCache() {
  await stylishConfirm("是否清空图片缓存").then(async _0x32b57f => {
    if (_0x32b57f) {
      let _0x4ebb96 = (await storeReadOnly("tupianshuju")) || {};
      if (_0x4ebb96) {
        for (let _0x127f60 of Object.keys(_0x4ebb96)) {
          await storeDelete(_0x127f60);
        }
        await storeDelete("tupianshuju");
      }
      alert("已清除图片缓存");
    }
  });
}
export function tishici_export_all() {
  const _0x170493 = extension_settings[extensionName];
  if (!_0x170493.yushe || Object.keys(_0x170493.yushe).length === 0) {
    alert("没有预设可导出。");
    return;
  }
  const _0x80d2c5 = JSON.stringify(_0x170493.yushe, null, 2);
  const _0x9c59ed = new Blob([_0x80d2c5], {
    type: "application/json"
  });
  const _0x2b7828 = URL.createObjectURL(_0x9c59ed);
  const _0x2b2a32 = document.createElement("a");
  _0x2b2a32.href = _0x2b7828;
  _0x2b2a32.download = "st-chatu8-prompt-presets-all.json";
  document.body.appendChild(_0x2b2a32);
  _0x2b2a32.click();
  document.body.removeChild(_0x2b2a32);
  URL.revokeObjectURL(_0x2b7828);
}
export function applyTheme(_0x3db5bb) {
  if (!_0x3db5bb) {
    console.error("Theme object is invalid.");
    return;
  }
  const _0x5fde44 = document.querySelector("#st-chatu8-settings");
  if (!_0x5fde44) {
    return;
  }
  for (const [_0x233d0c, _0x181740] of Object.entries(_0x3db5bb)) {
    _0x5fde44.style.setProperty(_0x233d0c, _0x181740);
  }
  const _0x644138 = document.querySelector("#ch-toggle-theme i");
  const _0x46aee4 = isThemeDark(_0x3db5bb);
  if (_0x46aee4) {
    _0x644138.classList.remove("fa-moon");
    _0x644138.classList.add("fa-sun");
  } else {
    _0x644138.classList.remove("fa-sun");
    _0x644138.classList.add("fa-moon");
  }
}
export const colorVarMap = {
  "--st-chatu8-bg-primary": "主背景色",
  "--st-chatu8-bg-secondary": "次背景色",
  "--st-chatu8-bg-tertiary": "三级背景色",
  "--st-chatu8-text-primary": "主文本颜色",
  "--st-chatu8-text-secondary": "次文本颜色",
  "--st-chatu8-accent-primary": "主强调色",
  "--st-chatu8-accent-secondary": "次强调色",
  "--st-chatu8-danger-primary": "危险/删除按钮色",
  "--st-chatu8-danger-secondary": "危险/删除按钮悬停色",
  "--st-chatu8-danger-text": "危险/删除按钮文本色",
  "--st-chatu8-border-color": "边框颜色",
  "--st-chatu8-dropdown-bg": "下拉框背景色",
  "--st-chatu8-dropdown-text": "下拉列表文本颜色",
  "--st-chatu8-dropdown-list-bg": "下拉选项背景色",
  "--st-chatu8-text-highlight": "高亮文本颜色"
};
function isElementHidden(_0xe1df15) {
  const _0x1c41d3 = document.getElementById(_0xe1df15);
  if (!_0x1c41d3) {
    return false;
  }
  if (_0x1c41d3.style.display === "none") {
    return true;
  }
  const _0x118599 = window.getComputedStyle(_0x1c41d3);
  return _0x118599.display === "none";
}
function stylInput(_0x2f582c) {
  return new Promise(_0x1fe756 => {
    const _0x3365c2 = document.getElementById("st-chatu8-settings") || document.body;
    const _0x2c8c2a = document.createElement("div");
    _0x2c8c2a.className = "st-chatu8-confirm-backdrop";
    const _0x36cef5 = document.createElement("div");
    _0x36cef5.className = "st-chatu8-confirm-box";
    const _0x238d12 = document.createElement("p");
    _0x238d12.textContent = _0x2f582c;
    _0x238d12.className = "st-chatu8-confirm-message";
    _0x36cef5.appendChild(_0x238d12);
    const _0x392b35 = document.createElement("input");
    _0x392b35.className = "st-chatu8-text-input";
    _0x36cef5.appendChild(_0x392b35);
    const _0x3440bb = document.createElement("div");
    _0x3440bb.className = "st-chatu8-confirm-buttons";
    _0x36cef5.appendChild(_0x3440bb);
    const _0x551ef2 = document.createElement("button");
    _0x551ef2.textContent = "取消";
    _0x551ef2.className = "st-chatu8-btn";
    _0x3440bb.appendChild(_0x551ef2);
    const _0x14295b = document.createElement("button");
    _0x14295b.textContent = "确定";
    _0x14295b.className = "st-chatu8-btn";
    _0x3440bb.appendChild(_0x14295b);
    _0x2c8c2a.appendChild(_0x36cef5);
    _0x3365c2.appendChild(_0x2c8c2a);
    const _0x1a5a0a = _0x53e1ed => {
      _0x3365c2.removeChild(_0x2c8c2a);
      _0x1fe756(_0x53e1ed);
    };
    _0x551ef2.addEventListener("click", () => _0x1a5a0a(false));
    _0x14295b.addEventListener("click", () => _0x1a5a0a(_0x392b35.value));
    _0x392b35.focus();
  });
}
function stylishConfirm(_0x3f445c) {
  return new Promise(_0x3c5c9d => {
    const _0x115fde = document.getElementById("st-chatu8-settings") || document.body;
    const _0x5a4d7e = document.createElement("div");
    _0x5a4d7e.className = "st-chatu8-confirm-backdrop";
    const _0x4c4bfe = document.createElement("div");
    _0x4c4bfe.className = "st-chatu8-confirm-box";
    const _0x807674 = document.createElement("p");
    _0x807674.textContent = _0x3f445c;
    _0x807674.className = "st-chatu8-confirm-message";
    _0x4c4bfe.appendChild(_0x807674);
    const _0x46bc55 = document.createElement("div");
    _0x46bc55.className = "st-chatu8-confirm-buttons";
    _0x4c4bfe.appendChild(_0x46bc55);
    const _0x1f57a7 = document.createElement("button");
    _0x1f57a7.textContent = "取消";
    _0x1f57a7.className = "st-chatu8-btn";
    _0x46bc55.appendChild(_0x1f57a7);
    const _0x25ac36 = document.createElement("button");
    _0x25ac36.textContent = "确定";
    _0x25ac36.className = "st-chatu8-btn";
    _0x46bc55.appendChild(_0x25ac36);
    _0x5a4d7e.appendChild(_0x4c4bfe);
    _0x115fde.appendChild(_0x5a4d7e);
    const _0x192842 = _0x4b335a => {
      _0x115fde.removeChild(_0x5a4d7e);
      _0x3c5c9d(_0x4b335a);
    };
    _0x1f57a7.addEventListener("click", () => _0x192842(false));
    _0x25ac36.addEventListener("click", () => _0x192842(true));
    _0x25ac36.focus();
  });
}
function isValidUrl(_0x37cba8) {
  if (!_0x37cba8 || _0x37cba8.trim() === "") {
    return true;
  }
  const _0x5869dd = /^(https?:\/\/)?(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)*$/;
  return _0x5869dd.test(_0x37cba8);
}
function validateUrlInput(_0x109d06) {
  if (!_0x109d06) {
    return;
  }
  const _0x478e60 = _0x109d06.closest(".st-chatu8-input-group");
  if (!_0x478e60) {
    return;
  }
  const _0x1bcbeb = isValidUrl(_0x109d06.value);
  _0x478e60.classList.toggle("invalid", !_0x1bcbeb);
}
function getSuffix(_0x754dfa) {
  if (_0x754dfa === "sd") {
    return "";
  }
  return "_" + _0x754dfa;
}
function size_change(_0x17b0ca) {
  if (_0x17b0ca == "sd") {
    _0x17b0ca = "sd_c";
  } else {
    _0x17b0ca = _0x17b0ca + "_";
  }
  console.log(_0x17b0ca);
  const _0x2f4f6e = document.getElementById(_0x17b0ca + "width");
  const _0x3b9f53 = document.getElementById(_0x17b0ca + "height");
  const _0x66c809 = document.getElementById(_0x17b0ca + "size");
  if (_0x2f4f6e && _0x3b9f53 && _0x66c809) {
    const [_0x12738e, _0x417f0d] = _0x66c809.value.split("x");
    _0x2f4f6e.value = _0x12738e;
    _0x3b9f53.value = _0x417f0d;
    $(_0x2f4f6e).trigger("input");
    $(_0x3b9f53).trigger("input");
  }
}
export { checkSendBuClass, isElementHidden, stylInput, stylishConfirm, isValidUrl, validateUrlInput, getSuffix, size_change };