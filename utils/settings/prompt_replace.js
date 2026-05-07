import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { getSuffix, stylInput, stylishConfirm } from "../ui_common.js";
export const generationTabs = ["sd", "novelai", "comfyui"];
function syncAllPromptReplaceFields(_0x2a7dbd = false) {
  const _0x533fa8 = extension_settings[extensionName];
  const _0x95a492 = _0x533fa8.prompt_replace_id;
  const _0x41bef3 = _0x533fa8.prompt_replace[_0x95a492] || {};
  generationTabs.forEach(_0x317668 => {
    const _0x27da4a = getSuffix(_0x317668);
    const _0x435c78 = document.getElementById("prompt_replace_id" + _0x27da4a);
    if (_0x435c78) {
      _0x435c78.value = _0x95a492;
    }
    const _0x1b05c4 = document.getElementById("prompt_replace_text" + _0x27da4a);
    const _0x350962 = _0x1b05c4.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
    let _0x53e7cb = _0x1b05c4.value !== (_0x41bef3.text ?? "");
    if (_0x2a7dbd || !_0x53e7cb) {
      _0x1b05c4.value = _0x41bef3.text ?? "";
      if (_0x350962) {
        $(_0x350962).hide();
      }
    }
  });
}
function prompt_replace_change(_0x4de85d) {
  const _0xdd6483 = extension_settings[extensionName];
  const _0x436a3 = getSuffix(_0x4de85d);
  const _0x1b859e = document.getElementById("prompt_replace_id" + _0x436a3);
  const _0x291812 = _0x1b859e.value;
  const _0x19ad84 = _0xdd6483.prompt_replace_id;
  const _0x11e794 = _0xdd6483.prompt_replace[_0x19ad84] || {};
  const _0x36e38b = document.getElementById("prompt_replace_text" + _0x436a3).value;
  const _0x51e149 = _0x36e38b !== (_0x11e794.text ?? "");
  if (_0x51e149) {
    stylishConfirm("您有未保存的替换规则。要放弃这些更改并切换预设吗？").then(_0x33c240 => {
      if (_0x33c240) {
        _0xdd6483.prompt_replace_id = _0x291812;
        saveSettingsDebounced();
        syncAllPromptReplaceFields(true);
      } else {
        _0x1b859e.value = _0x19ad84;
      }
    });
  } else {
    _0xdd6483.prompt_replace_id = _0x291812;
    saveSettingsDebounced();
    syncAllPromptReplaceFields(true);
  }
}
function prompt_replace_save(_0x4f3cb1) {
  const _0x3c0073 = extension_settings[extensionName];
  const _0x51632a = getSuffix(_0x4f3cb1);
  stylInput("请输入新替换规则配置的名称").then(_0x3db48d => {
    if (_0x3db48d && _0x3db48d.trim() !== "") {
      const _0x4aabaf = document.getElementById("prompt_replace_text" + _0x51632a).value;
      const _0x5b0ab4 = {
        text: _0x4aabaf
      };
      _0x3c0073.prompt_replace[_0x3db48d] = _0x5b0ab4;
      _0x3c0073.prompt_replace_id = _0x3db48d;
      saveSettingsDebounced();
      try {
        if (typeof window.loadSilterTavernChatu8Settings === "function") {
          window.loadSilterTavernChatu8Settings();
        }
      } catch (_0x4b2f1e) {
        console.warn("Failed to refresh UI after saving preset:", _0x4b2f1e);
      }
      alert("替换规则 \"" + _0x3db48d + "\" 已保存。");
    }
  });
}
function prompt_replace_update(_0x2e997a) {
  const _0x3c1a0 = extension_settings[extensionName];
  const _0x541059 = getSuffix(_0x2e997a);
  const _0x2781b4 = _0x3c1a0.prompt_replace_id;
  if (!_0x2781b4 || !_0x3c1a0.prompt_replace[_0x2781b4]) {
    alert("没有活动的替换规则可保存。请先“另存为”一个新规则。");
    return;
  }
  stylishConfirm("确定要覆盖当前替换规则 \"" + _0x2781b4 + "\" 吗？").then(_0x4d089f => {
    if (_0x4d089f) {
      const _0x500207 = document.getElementById("prompt_replace_text" + _0x541059).value;
      const _0x68ed8a = {
        text: _0x500207
      };
      _0x3c1a0.prompt_replace[_0x2781b4] = _0x68ed8a;
      saveSettingsDebounced();
      const _0x25c09f = document.getElementById("prompt_replace_text" + _0x541059);
      const _0x5a6274 = _0x25c09f.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
      if (_0x5a6274) {
        $(_0x5a6274).hide();
      }
    }
  });
}
function prompt_replace_delete(_0x12dd43) {
  const _0x4b559e = extension_settings[extensionName];
  const _0x11fc4f = getSuffix(_0x12dd43);
  const _0x39fe74 = document.getElementById("prompt_replace_id" + _0x11fc4f);
  const _0x30af32 = _0x39fe74.value;
  if (_0x30af32 === "默认") {
    alert("默认配置不能删除");
    return;
  }
  stylishConfirm("是否确定删除该替换规则").then(_0x7c1c9b => {
    if (_0x7c1c9b) {
      Reflect.deleteProperty(_0x4b559e.prompt_replace, _0x30af32);
      _0x4b559e.prompt_replace_id = "默认";
      saveSettingsDebounced();
      try {
        if (typeof window.loadSilterTavernChatu8Settings === "function") {
          window.loadSilterTavernChatu8Settings();
        }
      } catch (_0x2ea505) {
        console.warn("Failed to refresh UI after deleting preset:", _0x2ea505);
      }
    }
  });
}
function prompt_replace_export_current() {
  const _0x1538af = extension_settings[extensionName];
  const _0x43eccb = _0x1538af.prompt_replace_id;
  if (!_0x43eccb || !_0x1538af.prompt_replace[_0x43eccb]) {
    alert("没有选中的替换规则可导出。");
    return;
  }
  const _0x14e1bf = {
    [_0x43eccb]: _0x1538af.prompt_replace[_0x43eccb]
  };
  const _0xd7f10e = _0x14e1bf;
  const _0xd552dc = JSON.stringify(_0xd7f10e, null, 2);
  const _0x23c591 = new Blob([_0xd552dc], {
    type: "application/json"
  });
  const _0x55f795 = URL.createObjectURL(_0x23c591);
  const _0x21af29 = document.createElement("a");
  _0x21af29.href = _0x55f795;
  _0x21af29.download = "st-chatu8-prompt-replace-" + _0x43eccb + ".json";
  document.body.appendChild(_0x21af29);
  _0x21af29.click();
  document.body.removeChild(_0x21af29);
  URL.revokeObjectURL(_0x55f795);
}
function prompt_replace_export_all() {
  const _0x3d8cbd = extension_settings[extensionName];
  if (!_0x3d8cbd.prompt_replace || Object.keys(_0x3d8cbd.prompt_replace).length === 0) {
    alert("没有替换规则可导出。");
    return;
  }
  const _0x17db2a = JSON.stringify(_0x3d8cbd.prompt_replace, null, 2);
  const _0xc5467 = new Blob([_0x17db2a], {
    type: "application/json"
  });
  const _0x2ac82a = URL.createObjectURL(_0xc5467);
  const _0x45248a = document.createElement("a");
  _0x45248a.href = _0x2ac82a;
  _0x45248a.download = "st-chatu8-prompt-replace-all.json";
  document.body.appendChild(_0x45248a);
  _0x45248a.click();
  document.body.removeChild(_0x45248a);
  URL.revokeObjectURL(_0x2ac82a);
}
function prompt_replace_import() {
  const _0x5a6ea1 = extension_settings[extensionName];
  const _0x355cbb = document.createElement("input");
  _0x355cbb.type = "file";
  _0x355cbb.accept = ".json";
  _0x355cbb.onchange = _0x243a12 => {
    const _0x30a9c8 = _0x243a12.target.files[0];
    if (!_0x30a9c8) {
      return;
    }
    const _0xf4944d = new FileReader();
    _0xf4944d.onload = _0x982659 => {
      try {
        const _0x166994 = JSON.parse(_0x982659.target.result);
        let _0x30c7e5 = 0;
        for (const _0xed055 in _0x166994) {
          if (_0x166994.hasOwnProperty(_0xed055)) {
            if (!_0x5a6ea1.prompt_replace.hasOwnProperty(_0xed055)) {
              _0x30c7e5++;
            }
            _0x5a6ea1.prompt_replace[_0xed055] = _0x166994[_0xed055];
          }
        }
        saveSettingsDebounced();
        try {
          if (typeof window.loadSilterTavernChatu8Settings === "function") {
            window.loadSilterTavernChatu8Settings();
          }
        } catch (_0x34f87a) {
          console.warn("Failed to refresh UI after importing presets:", _0x34f87a);
        }
        alert("成功导入 " + Object.keys(_0x166994).length + " 个替换规则，其中 " + _0x30c7e5 + " 个是全新的。");
      } catch (_0x98f85b) {
        alert("导入失败，请确保文件是正确的JSON格式。");
        console.error("Error importing prompt replacements:", _0x98f85b);
      }
    };
    _0xf4944d.readAsText(_0x30a9c8);
  };
  _0x355cbb.click();
}
export function initPromptReplaceControls(_0x3ee6b4) {
  generationTabs.forEach(_0x35d7ff => {
    const _0x30b9bf = getSuffix(_0x35d7ff);
    _0x3ee6b4.find("#prompt_replace_id" + _0x30b9bf).on("change", () => prompt_replace_change(_0x35d7ff));
    _0x3ee6b4.find("#prompt_replace_save_style" + _0x30b9bf).on("click", () => prompt_replace_save(_0x35d7ff));
    _0x3ee6b4.find("#prompt_replace_update_style" + _0x30b9bf).on("click", () => prompt_replace_update(_0x35d7ff));
    _0x3ee6b4.find("#prompt_replace_delete_style" + _0x30b9bf).on("click", () => prompt_replace_delete(_0x35d7ff));
    _0x3ee6b4.find("#prompt_replace_export_current" + _0x30b9bf).on("click", prompt_replace_export_current);
    _0x3ee6b4.find("#prompt_replace_export_all" + _0x30b9bf).on("click", prompt_replace_export_all);
    _0x3ee6b4.find("#prompt_replace_import" + _0x30b9bf).on("click", prompt_replace_import);
    $("#prompt_replace_text" + _0x30b9bf).on("input", function () {
      const _0xee8bb2 = extension_settings[extensionName];
      const _0xad4786 = _0xee8bb2.prompt_replace_id;
      const _0x23b534 = _0xee8bb2.prompt_replace[_0xad4786] || {};
      const _0x283d6a = $(this).val() !== (_0x23b534.text ?? "");
      const _0x51bbcc = $(this).closest(".st-chatu8-field-col").find(".st-chatu8-unsaved-warning");
      if (_0x283d6a) {
        $(_0x51bbcc).show();
      } else {
        $(_0x51bbcc).hide();
      }
    });
  });
}