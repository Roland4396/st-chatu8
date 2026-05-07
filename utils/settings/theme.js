import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { defaultThemes, extensionName } from "../config.js";
import { stylInput, stylishConfirm } from "../ui_common.js";
import { applyGenerateButtonStyle, injectButtonStyleToDocument } from "./buttonstyle.js";
import { applyImageFrameStyle, injectFrameStyleToDocument } from "./framestyle.js";
import { applyCollapseStyle, injectCollapseStyleToDocument } from "./collapsestyle.js";
let settings;
let currentPreviewTheme = {};
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
  "--st-chatu8-text-highlight": "高亮文本颜色",
  "--st-chatu8-input-bg": "输入框背景色",
  "--st-chatu8-input-text": "输入框文本颜色",
  "--st-chatu8-input-border": "输入框边框颜色"
};
export function isThemeDark(_0x2a4cb7) {
  const _0x2a7ad3 = _0x2a4cb7["--st-chatu8-bg-primary"] || "#ffffff";
  const _0x207ccb = _0x2a7ad3.substring(1);
  const _0x3def84 = parseInt(_0x207ccb, 16);
  const _0x14eae6 = _0x3def84 >> 16 & 255;
  const _0x126595 = _0x3def84 >> 8 & 255;
  const _0x1c7da1 = _0x3def84 >> 0 & 255;
  const _0x2ba01a = _0x14eae6 * 0.2126 + _0x126595 * 0.7152 + _0x1c7da1 * 0.0722;
  return _0x2ba01a < 128;
}
export function applyTheme(_0x11ddfd) {
  if (!_0x11ddfd) {
    console.error("Theme object is invalid.");
    return;
  }
  const _0x90020f = {
    "--st-chatu8-input-bg": _0x11ddfd["--st-chatu8-bg-secondary"] || "#ffffff",
    "--st-chatu8-input-text": _0x11ddfd["--st-chatu8-text-primary"] || "#000000",
    "--st-chatu8-input-border": _0x11ddfd["--st-chatu8-border-color"] || "#cccccc"
  };
  const _0x27b0e9 = _0x90020f;
  const _0x59210c = {
    ..._0x27b0e9,
    ..._0x11ddfd
  };
  const _0x3bef5d = _0x59210c;
  const _0x30021f = document.querySelector("#st-chatu8-settings");
  if (_0x30021f) {
    for (const [_0x1f6293, _0x5e499e] of Object.entries(_0x3bef5d)) {
      _0x30021f.style.setProperty(_0x1f6293, _0x5e499e);
    }
  }
  const _0x45b738 = window.top.document.documentElement;
  if (_0x45b738) {
    for (const [_0x57d3d5, _0x35c639] of Object.entries(_0x3bef5d)) {
      _0x45b738.style.setProperty(_0x57d3d5, _0x35c639);
    }
  }
  const _0x289c4 = document.querySelector("#ch-toggle-theme i");
  if (_0x289c4) {
    const _0x1cc566 = isThemeDark(_0x3bef5d);
    if (_0x1cc566) {
      _0x289c4.classList.remove("fa-moon");
      _0x289c4.classList.add("fa-sun");
    } else {
      _0x289c4.classList.remove("fa-sun");
      _0x289c4.classList.add("fa-moon");
    }
  }
}
function populateThemeColorPickers(_0x184589) {
  const _0x38360a = document.getElementById("theme-color-pickers");
  if (!_0x38360a) {
    return;
  }
  _0x38360a.innerHTML = "";
  const _0x25aa1f = currentPreviewTheme;
  if (!_0x25aa1f) {
    return;
  }
  for (const _0x56d4b3 in colorVarMap) {
    if (Object.hasOwnProperty.call(_0x25aa1f, _0x56d4b3)) {
      const _0x144ac6 = colorVarMap[_0x56d4b3];
      const _0x5338a7 = _0x25aa1f[_0x56d4b3];
      const _0x448144 = document.createElement("div");
      _0x448144.className = "st-chatu8-field";
      const _0x36af8d = document.createElement("label");
      _0x36af8d.textContent = _0x144ac6;
      _0x36af8d.htmlFor = "theme-color-" + _0x56d4b3;
      const _0xd7ab2b = document.createElement("input");
      _0xd7ab2b.type = "color";
      _0xd7ab2b.id = "theme-color-" + _0x56d4b3;
      _0xd7ab2b.className = "st-chatu8-color-picker";
      _0xd7ab2b.value = _0x5338a7;
      _0xd7ab2b.dataset.var = _0x56d4b3;
      _0xd7ab2b.addEventListener("input", _0x369ff0 => {
        const _0x56f53f = _0x369ff0.target.value;
        const _0x219a60 = _0x369ff0.target.dataset.var;
        currentPreviewTheme[_0x219a60] = _0x56f53f;
        applyTheme(currentPreviewTheme);
      });
      _0x448144.appendChild(_0x36af8d);
      _0x448144.appendChild(_0xd7ab2b);
      _0x38360a.appendChild(_0x448144);
    }
  }
}
function loadThemeSettings() {
  const _0x2764de = document.getElementById("theme_id");
  if (!_0x2764de) {
    return;
  }
  const _0xb78b8f = settings.theme_id;
  _0x2764de.innerHTML = "";
  for (const _0x1baad0 in settings.themes) {
    const _0x431a71 = new Option(_0x1baad0, _0x1baad0);
    _0x431a71.title = _0x1baad0;
    _0x2764de.add(_0x431a71);
  }
  _0x2764de.value = _0xb78b8f;
  const _0x5872e5 = document.getElementById("theme_generate_btn_style");
  if (_0x5872e5) {
    _0x5872e5.value = settings.generate_btn_style || "默认";
  }
  const _0x21280e = document.getElementById("theme_image_frame_style");
  if (_0x21280e) {
    _0x21280e.value = settings.image_frame_style || "无样式";
  }
  const _0x125f2b = document.getElementById("theme_collapse_style");
  if (_0x125f2b) {
    _0x125f2b.value = settings.collapse_style || "默认";
  }
  currentPreviewTheme = JSON.parse(JSON.stringify(settings.themes[_0xb78b8f]));
  populateThemeColorPickers(_0xb78b8f);
  applyGenerateButtonStyle(settings.generate_btn_style, isThemeDark(currentPreviewTheme));
  applyImageFrameStyle(settings.image_frame_style || "无样式", isThemeDark(currentPreviewTheme));
  applyCollapseStyle(settings.collapse_style || "默认", isThemeDark(currentPreviewTheme));
}
function theme_change() {
  const _0x3269b1 = document.getElementById("theme_id");
  const _0x3d8e52 = _0x3269b1.value;
  settings.theme_id = _0x3d8e52;
  currentPreviewTheme = JSON.parse(JSON.stringify(settings.themes[_0x3d8e52]));
  applyTheme(currentPreviewTheme);
  populateThemeColorPickers(_0x3d8e52);
  saveSettingsDebounced();
}
function btn_style_change() {
  const _0xb1d8af = document.getElementById("theme_generate_btn_style");
  const _0x1446fc = _0xb1d8af.value;
  settings.generate_btn_style = _0x1446fc;
  applyGenerateButtonStyle(_0x1446fc, isThemeDark(currentPreviewTheme));
  saveSettingsDebounced();
}
function frame_style_change() {
  const _0x20c2fc = document.getElementById("theme_image_frame_style");
  const _0x37ba67 = _0x20c2fc.value;
  settings.image_frame_style = _0x37ba67;
  applyImageFrameStyle(_0x37ba67, isThemeDark(currentPreviewTheme));
  saveSettingsDebounced();
}
function collapse_style_change() {
  const _0x48ac0c = document.getElementById("theme_collapse_style");
  const _0x8813c6 = _0x48ac0c.value;
  settings.collapse_style = _0x8813c6;
  applyCollapseStyle(_0x8813c6, isThemeDark(currentPreviewTheme));
  saveSettingsDebounced();
}
function theme_save() {
  const _0x4d1a97 = settings.theme_id;
  if (defaultThemes.hasOwnProperty(_0x4d1a97)) {
    stylInput("正在编辑默认主题。请输入新主题的名称以保存：").then(_0x4a1e02 => {
      if (_0x4a1e02 && _0x4a1e02.trim() !== "") {
        settings.themes[_0x4a1e02] = JSON.parse(JSON.stringify(currentPreviewTheme));
        settings.theme_id = _0x4a1e02;
        saveSettingsDebounced();
        loadThemeSettings();
        applyTheme(currentPreviewTheme);
      }
    });
  } else {
    stylishConfirm("确定要覆盖当前主题 \"" + _0x4d1a97 + "\" 吗？").then(_0x5f3d44 => {
      if (_0x5f3d44) {
        settings.themes[_0x4d1a97] = JSON.parse(JSON.stringify(currentPreviewTheme));
        saveSettingsDebounced();
        alert("主题 \"" + _0x4d1a97 + "\" 已保存。");
      }
    });
  }
}
function theme_delete() {
  const _0x2aa36d = document.getElementById("theme_id");
  const _0xf3a7fd = _0x2aa36d.value;
  if (defaultThemes.hasOwnProperty(_0xf3a7fd)) {
    alert("不能删除默认主题。");
    return;
  }
  stylishConfirm("确定要删除主题 \"" + _0xf3a7fd + "\" 吗?").then(_0x508586 => {
    if (_0x508586) {
      delete settings.themes[_0xf3a7fd];
      settings.theme_id = "默认-白天";
      saveSettingsDebounced();
      applyTheme(settings.themes[settings.theme_id]);
      loadThemeSettings();
    }
  });
}
function theme_import() {
  const _0x387b57 = document.createElement("input");
  _0x387b57.type = "file";
  _0x387b57.accept = ".json";
  _0x387b57.onchange = _0x3cfdd4 => {
    const _0x2f7817 = _0x3cfdd4.target.files[0];
    if (!_0x2f7817) {
      return;
    }
    const _0x20f82f = new FileReader();
    _0x20f82f.onload = _0x35d28 => {
      try {
        const _0x5cfaeb = JSON.parse(_0x35d28.target.result);
        let _0x4a62c8 = 0;
        for (const _0x2c35a2 in _0x5cfaeb) {
          if (_0x5cfaeb.hasOwnProperty(_0x2c35a2)) {
            if (!settings.themes.hasOwnProperty(_0x2c35a2)) {
              _0x4a62c8++;
            }
            settings.themes[_0x2c35a2] = _0x5cfaeb[_0x2c35a2];
          }
        }
        saveSettingsDebounced();
        loadThemeSettings();
        alert("成功导入 " + Object.keys(_0x5cfaeb).length + " 个主题，其中 " + _0x4a62c8 + " 个是全新的。");
      } catch (_0x339f2c) {
        alert("导入失败，请确保文件是正确的JSON格式。");
        console.error("Error importing themes:", _0x339f2c);
      }
    };
    _0x20f82f.readAsText(_0x2f7817);
  };
  _0x387b57.click();
}
function theme_export(_0x874169 = false) {
  const _0x3e51d3 = settings.theme_id;
  if (!_0x874169 && !settings.themes[_0x3e51d3]) {
    alert("没有选中的主题可导出。");
    return;
  }
  const _0x1ffa18 = _0x874169 ? settings.themes : {
    [_0x3e51d3]: settings.themes[_0x3e51d3]
  };
  const _0x86b10c = JSON.stringify(_0x1ffa18, null, 2);
  const _0x5c3d12 = new Blob([_0x86b10c], {
    type: "application/json"
  });
  const _0x99c417 = URL.createObjectURL(_0x5c3d12);
  const _0x2806c5 = document.createElement("a");
  _0x2806c5.href = _0x99c417;
  _0x2806c5.download = "st-chatu8-theme" + (_0x874169 ? "s-all" : "-" + _0x3e51d3) + ".json";
  document.body.appendChild(_0x2806c5);
  _0x2806c5.click();
  document.body.removeChild(_0x2806c5);
  URL.revokeObjectURL(_0x99c417);
}
function toggleTheme() {
  const _0x90790e = Object.keys(settings.themes);
  const _0xf6bd49 = _0x90790e.indexOf(settings.theme_id);
  const _0x349f1b = (_0xf6bd49 + 1) % _0x90790e.length;
  const _0x3c969e = _0x90790e[_0x349f1b];
  settings.theme_id = _0x3c969e;
  applyTheme(settings.themes[_0x3c969e]);
  loadThemeSettings();
  saveSettingsDebounced();
}
export function initThemeSettings(_0x1b9ca4) {
  settings = extension_settings[extensionName];
  for (const _0x53de2e in defaultThemes) {
    if (!settings.themes.hasOwnProperty(_0x53de2e)) {
      settings.themes[_0x53de2e] = JSON.parse(JSON.stringify(defaultThemes[_0x53de2e]));
    }
  }
  loadThemeSettings();
  _0x1b9ca4.find("#ch-toggle-theme").on("click", toggleTheme);
  _0x1b9ca4.find("#theme_id").on("change", theme_change);
  _0x1b9ca4.find("#theme_generate_btn_style").on("change", btn_style_change);
  _0x1b9ca4.find("#theme_image_frame_style").on("change", frame_style_change);
  _0x1b9ca4.find("#theme_collapse_style").on("change", collapse_style_change);
  _0x1b9ca4.find("#theme_save_style").on("click", theme_save);
  _0x1b9ca4.find("#theme_delete_style").on("click", theme_delete);
  _0x1b9ca4.find("#theme_export_current").on("click", () => theme_export(false));
  _0x1b9ca4.find("#theme_export_all").on("click", () => theme_export(true));
  _0x1b9ca4.find("#theme_import").on("click", theme_import);
}
export { loadThemeSettings };
export { applyGenerateButtonStyle };
export { injectButtonStyleToDocument };
export { applyImageFrameStyle };
export { injectFrameStyleToDocument };
export { applyCollapseStyle };
export { injectCollapseStyleToDocument };