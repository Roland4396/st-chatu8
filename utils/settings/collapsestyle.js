import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
let currentCollapseStyleCSS = "";
export function injectCollapseStyleToDocument(_0x1dad86) {
  if (!_0x1dad86 || !currentCollapseStyleCSS) {
    return;
  }
  const _0xc6c811 = "st-chatu8-collapse-style";
  let _0x23d38f = _0x1dad86.getElementById(_0xc6c811);
  if (!_0x23d38f) {
    _0x23d38f = _0x1dad86.createElement("style");
    _0x23d38f.id = _0xc6c811;
    const _0x16c748 = _0x1dad86.head || _0x1dad86.documentElement;
    if (_0x16c748) {
      _0x16c748.appendChild(_0x23d38f);
    } else {
      return;
    }
  }
  if (_0x23d38f.textContent !== currentCollapseStyleCSS) {
    _0x23d38f.textContent = currentCollapseStyleCSS;
  }
}
export function applyCollapseStyle(_0x4faed1, _0x2eb1ef = true) {
  const _0x21ce76 = "st-chatu8-collapse-style";
  let _0xbcc1c3 = document.getElementById(_0x21ce76);
  if (!_0xbcc1c3) {
    _0xbcc1c3 = document.createElement("style");
    _0xbcc1c3.id = _0x21ce76;
    document.head.appendChild(_0xbcc1c3);
  }
  const _0x4cf8cd = generateCollapseStyleCSS(_0x4faed1, _0x2eb1ef);
  _0xbcc1c3.textContent = _0x4cf8cd;
  currentCollapseStyleCSS = _0x4cf8cd;
}
function generateCollapseStyleCSS(_0x5856e6, _0x114173) {
  const _0x5daaca = ".st-chatu8-collapse-wrapper";
  const _0xb5cd9d = ".st-chatu8-collapse-header";
  const _0x2b999a = ".st-chatu8-collapse-icon";
  const _0x100274 = ".st-chatu8-collapse-title";
  const _0x5c531f = ".st-chatu8-collapse-badge";
  const _0x58358b = ".st-chatu8-collapse-content";
  let _0x25a6bc = "\n        " + _0x5daaca + " {\n            margin: 8px 0;\n            border-radius: 8px;\n            overflow: hidden;\n            transition: all 0.3s ease;\n            border: none;\n        }\n        " + _0xb5cd9d + " {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            padding: 10px 14px;\n            cursor: pointer;\n            user-select: none;\n            transition: all 0.2s ease;\n            font-size: 14px;\n        }\n        " + _0x2b999a + " {\n            font-size: 16px;\n            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            width: 20px;\n            height: 20px;\n            line-height: 1;\n            text-indent: 1px;\n        }\n        " + _0x5daaca + "[data-collapsed=\"true\"] " + _0x2b999a + " {\n            transform: rotate(-90deg);\n        }\n        " + _0x5daaca + "[data-collapsed=\"false\"] " + _0x2b999a + " {\n            transform: rotate(0deg);\n        }\n        " + _0x100274 + " {\n            flex: 1;\n            font-weight: 500;\n            letter-spacing: 0.3px;\n        }\n        " + _0x5c531f + " {\n            font-size: 11px;\n            padding: 2px 8px;\n            border-radius: 10px;\n            text-transform: uppercase;\n            letter-spacing: 0.5px;\n        }\n        " + _0x58358b + " {\n            overflow: hidden;\n            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), \n                        opacity 0.3s ease,\n                        padding 0.3s ease;\n            display: flex;\n            justify-content: center;\n            align-items: flex-start;\n        }\n        " + _0x58358b + " .st-chatu8-image-container {\n            margin: 0;\n        }\n        " + _0x58358b + " .st-chatu8-image-container img,\n        " + _0x58358b + " .st-chatu8-image-container video {\n            display: block;\n            max-width: 100%;\n            height: auto;\n        }\n        " + _0x5daaca + "[data-collapsed=\"true\"] " + _0x58358b + " {\n            max-height: 0;\n            opacity: 0;\n            padding: 0;\n        }\n        " + _0x5daaca + "[data-collapsed=\"false\"] " + _0x58358b + " {\n            max-height: 2000px;\n            opacity: 1;\n        }\n    ";
  _0x25a6bc += getThemeSpecificCSS(_0x5856e6, _0x114173, _0x5daaca, _0xb5cd9d, _0x2b999a, _0x100274, _0x5c531f, _0x58358b);
  return _0x25a6bc;
}
function getThemeSpecificCSS(_0x25c17e, _0x5e7756, _0x2b5511, _0x12ca98, _0xa9b6e5, _0x420c96, _0x18dc8a, _0x51b3cd) {
  switch (_0x25c17e) {
    case "默认":
    default:
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                }\n                " + _0x12ca98 + " {\n                    background: linear-gradient(135deg, rgba(74, 144, 226, 0.15) 0%, rgba(74, 144, 226, 0.08) 100%);\n                    color: #a8c8f0;\n                }\n                " + _0x12ca98 + ":hover {\n                    background: linear-gradient(135deg, rgba(74, 144, 226, 0.25) 0%, rgba(74, 144, 226, 0.15) 100%);\n                    color: #c0dcff;\n                }\n                " + _0x2b5511 + "[data-collapsed=\"true\"] " + _0x18dc8a + " {\n                    background: rgba(255, 193, 7, 0.2);\n                    color: #ffc107;\n                }\n                " + _0x2b5511 + "[data-collapsed=\"false\"] " + _0x18dc8a + " {\n                    background: rgba(74, 144, 226, 0.2);\n                    color: #8ab4f8;\n                }\n            ";
    case "极简线条":
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                    border-radius: 4px;\n                }\n                " + _0x12ca98 + " {\n                    background: transparent;\n                    color: " + (_0x5e7756 ? "#e0e0e0" : "#333") + ";\n                    border-bottom: 1px solid " + (_0x5e7756 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") + ";\n                }\n                " + _0x12ca98 + ":hover {\n                    background: " + (_0x5e7756 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") + ";\n                }\n                " + _0x18dc8a + " {\n                    background: " + (_0x5e7756 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") + ";\n                    color: " + (_0x5e7756 ? "#aaa" : "#666") + ";\n                }\n            ";
    case "科技霓虹":
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                }\n                " + _0x12ca98 + " {\n                    background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 200, 255, 0.05) 100%);\n                    color: #0ff;\n                }\n                " + _0x12ca98 + ":hover {\n                    background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 200, 255, 0.1) 100%);\n                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);\n                }\n                " + _0xa9b6e5 + " { color: #0ff; }\n                " + _0x18dc8a + " {\n                    background: rgba(0, 255, 255, 0.15);\n                    color: #0ff;\n                    border: 1px solid rgba(0, 255, 255, 0.3);\n                }\n            ";
    case "玻璃质感":
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                    backdrop-filter: blur(10px);\n                    -webkit-backdrop-filter: blur(10px);\n                }\n                " + _0x12ca98 + " {\n                    background: " + (_0x5e7756 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)") + ";\n                    color: " + (_0x5e7756 ? "#e8e8e8" : "#333") + ";\n                }\n                " + _0x12ca98 + ":hover {\n                    background: " + (_0x5e7756 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)") + ";\n                }\n                " + _0x18dc8a + " {\n                    background: " + (_0x5e7756 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)") + ";\n                    color: " + (_0x5e7756 ? "#ccc" : "#555") + ";\n                }\n            ";
    case "暖色温馨":
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                }\n                " + _0x12ca98 + " {\n                    background: linear-gradient(135deg, rgba(255, 160, 64, 0.15) 0%, rgba(255, 180, 80, 0.1) 100%);\n                    color: #ffb347;\n                }\n                " + _0x12ca98 + ":hover {\n                    background: linear-gradient(135deg, rgba(255, 160, 64, 0.25) 0%, rgba(255, 180, 80, 0.18) 100%);\n                    color: #ffc96b;\n                }\n                " + _0x18dc8a + " {\n                    background: rgba(255, 160, 64, 0.2);\n                    color: #ffb347;\n                }\n            ";
    case "森林绿意":
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                }\n                " + _0x12ca98 + " {\n                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(102, 187, 106, 0.1) 100%);\n                    color: #81c784;\n                }\n                " + _0x12ca98 + ":hover {\n                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(102, 187, 106, 0.18) 100%);\n                    color: #a5d6a7;\n                }\n                " + _0x18dc8a + " {\n                    background: rgba(76, 175, 80, 0.2);\n                    color: #81c784;\n                }\n            ";
    case "少女粉彩":
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                }\n                " + _0x12ca98 + " {\n                    background: linear-gradient(135deg, rgba(233, 30, 99, 0.12) 0%, rgba(156, 39, 176, 0.08) 100%);\n                    color: #f48fb1;\n                }\n                " + _0x12ca98 + ":hover {\n                    background: linear-gradient(135deg, rgba(233, 30, 99, 0.2) 0%, rgba(156, 39, 176, 0.15) 100%);\n                    color: #f8bbd9;\n                }\n                " + _0x18dc8a + " {\n                    background: rgba(233, 30, 99, 0.15);\n                    color: #f48fb1;\n                }\n            ";
    case "星空紫":
      return "\n                " + _0x2b5511 + " {\n                    background: transparent;\n                }\n                " + _0x12ca98 + " {\n                    background: linear-gradient(135deg, rgba(103, 58, 183, 0.18) 0%, rgba(63, 81, 181, 0.12) 100%);\n                    color: #b39ddb;\n                }\n                " + _0x12ca98 + ":hover {\n                    background: linear-gradient(135deg, rgba(103, 58, 183, 0.28) 0%, rgba(63, 81, 181, 0.2) 100%);\n                    color: #d1c4e9;\n                }\n                " + _0x18dc8a + " {\n                    background: rgba(103, 58, 183, 0.2);\n                    color: #b39ddb;\n                }\n            ";
  }
}