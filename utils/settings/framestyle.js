import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
let currentFrameStyleCSS = "";
export function injectFrameStyleToDocument(_0x206c85) {
  if (!_0x206c85 || !currentFrameStyleCSS) {
    return;
  }
  const _0x47949a = "st-chatu8-image-frame-style";
  let _0x1dc33a = _0x206c85.getElementById(_0x47949a);
  if (!_0x1dc33a) {
    _0x1dc33a = _0x206c85.createElement("style");
    _0x1dc33a.id = _0x47949a;
    const _0x11c8fd = _0x206c85.head || _0x206c85.documentElement;
    if (_0x11c8fd) {
      _0x11c8fd.appendChild(_0x1dc33a);
    } else {
      return;
    }
  }
  if (_0x1dc33a.textContent !== currentFrameStyleCSS) {
    _0x1dc33a.textContent = currentFrameStyleCSS;
  }
}
export function applyImageFrameStyle(_0x359caa, _0x23dd13 = true) {
  const _0x240715 = "st-chatu8-image-frame-style";
  let _0x1e63a5 = document.getElementById(_0x240715);
  if (!_0x1e63a5) {
    _0x1e63a5 = document.createElement("style");
    _0x1e63a5.id = _0x240715;
    document.head.appendChild(_0x1e63a5);
  }
  const _0x8b62aa = extension_settings[extensionName];
  const _0x57745b = _0x8b62aa?.imageAlignment || "center";
  let _0x90f9b4 = "";
  const _0x4033dd = ".st-chatu8-image-container";
  const _0x49a2bf = _0x4033dd + " img, " + _0x4033dd + " video";
  _0x90f9b4 += "\n        " + _0x4033dd + " {\n            display: block;\n            position: relative;\n            line-height: 0;\n            text-align: " + _0x57745b + ";\n            margin: 0.5em 0;\n        }\n        " + _0x4033dd + " img,\n        " + _0x4033dd + " video {\n            display: inline-block;\n            max-width: 100%;\n            height: auto;\n            vertical-align: middle;\n        }\n    ";
  switch (_0x359caa) {
    case "无样式":
    default:
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: none !important;\n                    box-shadow: none !important;\n                    outline: none !important;\n                    border-radius: 0 !important;\n                }\n            ";
      break;
    case "简约白边":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 3px solid rgba(255, 255, 255, 0.9) !important;\n                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;\n                    border-radius: 2px !important;\n                }\n            ";
      if (!_0x23dd13) {
        _0x90f9b4 += "\n                    " + _0x49a2bf + " {\n                        border-color: rgba(30, 30, 30, 0.85) !important;\n                    }\n                ";
      }
      break;
    case "柔和阴影":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: none !important;\n                    box-shadow: \n                        0 4px 12px rgba(0, 0, 0, 0.15),\n                        0 2px 4px rgba(0, 0, 0, 0.1) !important;\n                    border-radius: 4px !important;\n                }\n            ";
      break;
    case "圆角相框":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 2px solid rgba(128, 128, 128, 0.3) !important;\n                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;\n                    border-radius: 12px !important;\n                }\n            ";
      break;
    case "复古画框":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 4px solid #8B7355 !important;\n                    box-shadow: \n                        inset 0 0 0 1px rgba(255, 255, 255, 0.2),\n                        0 4px 12px rgba(0, 0, 0, 0.3),\n                        2px 2px 0 #6B5344,\n                        4px 4px 0 #5A4436 !important;\n                    border-radius: 2px !important;\n                }\n            ";
      break;
    case "科技边框":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 2px solid rgba(0, 255, 255, 0.6) !important;\n                    box-shadow: \n                        0 0 8px rgba(0, 255, 255, 0.3),\n                        0 0 2px rgba(0, 255, 255, 0.5),\n                        inset 0 0 12px rgba(0, 255, 255, 0.05) !important;\n                    border-radius: 4px !important;\n                }\n            ";
      break;
    case "霓虹光晕":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 2px solid rgba(255, 0, 128, 0.7) !important;\n                    box-shadow: \n                        0 0 10px rgba(255, 0, 128, 0.4),\n                        0 0 20px rgba(0, 200, 255, 0.2),\n                        0 0 4px rgba(255, 255, 255, 0.3) !important;\n                    border-radius: 4px !important;\n                }\n            ";
      break;
    case "玻璃质感":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 1px solid rgba(255, 255, 255, 0.25) !important;\n                    box-shadow: \n                        0 8px 32px rgba(0, 0, 0, 0.12),\n                        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;\n                    border-radius: 8px !important;\n                }\n            ";
      if (!_0x23dd13) {
        _0x90f9b4 += "\n                    " + _0x49a2bf + " {\n                        border-color: rgba(0, 0, 0, 0.1) !important;\n                    }\n                ";
      }
      break;
    case "渐变边框":
      _0x90f9b4 += "\n                " + _0x4033dd + " {\n                    padding: 3px !important;\n                    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important;\n                    border-radius: 6px !important;\n                }\n                " + _0x49a2bf + " {\n                    border: none !important;\n                    border-radius: 4px !important;\n                    box-shadow: none !important;\n                }\n            ";
      break;
    case "金色画框":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 4px solid #C9A227 !important;\n                    box-shadow: \n                        inset 0 0 0 1px rgba(255, 215, 0, 0.3),\n                        0 0 0 1px #8B6914,\n                        0 4px 12px rgba(0, 0, 0, 0.25) !important;\n                    border-radius: 2px !important;\n                }\n            ";
      break;
    case "极简线条":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 1px solid rgba(128, 128, 128, 0.4) !important;\n                    box-shadow: none !important;\n                    border-radius: 0 !important;\n                }\n            ";
      break;
    case "浮雕效果":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 3px solid transparent !important;\n                    box-shadow: \n                        3px 3px 6px rgba(0, 0, 0, 0.2),\n                        -2px -2px 4px rgba(255, 255, 255, 0.1),\n                        inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;\n                    border-radius: 4px !important;\n                }\n            ";
      break;
    case "漫画风格":
      _0x90f9b4 += "\n                " + _0x49a2bf + " {\n                    border: 3px solid #1a1a1a !important;\n                    box-shadow: \n                        4px 4px 0 #1a1a1a !important;\n                    border-radius: 2px !important;\n                }\n            ";
      if (!_0x23dd13) {}
      break;
    case "胶片边框":
      _0x90f9b4 += "\n                " + _0x4033dd + " {\n                    padding: 8px 4px !important;\n                    background: #1a1a1a !important;\n                    border-radius: 2px !important;\n                    position: relative !important;\n                }\n                " + _0x4033dd + "::before,\n                " + _0x4033dd + "::after {\n                    content: '';\n                    position: absolute;\n                    top: 0;\n                    bottom: 0;\n                    width: 8px;\n                    background: \n                        repeating-linear-gradient(\n                            to bottom,\n                            transparent 0px,\n                            transparent 4px,\n                            rgba(255, 255, 255, 0.3) 4px,\n                            rgba(255, 255, 255, 0.3) 8px\n                        );\n                }\n                " + _0x4033dd + "::before {\n                    left: -4px;\n                }\n                " + _0x4033dd + "::after {\n                    right: -4px;\n                }\n                " + _0x49a2bf + " {\n                    border: none !important;\n                    box-shadow: none !important;\n                    border-radius: 0 !important;\n                }\n            ";
      break;
  }
  _0x1e63a5.textContent = _0x90f9b4;
  currentFrameStyleCSS = _0x90f9b4;
}