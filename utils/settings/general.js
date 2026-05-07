import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { defaultSettings, extensionName } from "../config.js";
import { stylishConfirm } from "../ui_common.js";
import { initJiuguanStorage } from "../database.js";
function onRestoreDefaultSettingsClick() {
  stylishConfirm("你确定要恢复默认设置吗？提示词预设和工作流会消失哦！请提前备份！").then(_0x49037a => {
    if (_0x49037a) {
      stylishConfirm("你真的确定吗？").then(async _0x1aeb26 => {
        if (_0x1aeb26) {
          const _0x86fd50 = JSON.parse(JSON.stringify(defaultSettings));
          const _0x5651d3 = extension_settings[extensionName];
          Object.keys(_0x5651d3).forEach(_0x29d61b => {
            delete _0x5651d3[_0x29d61b];
          });
          Object.assign(_0x5651d3, _0x86fd50);
          saveSettingsDebounced();
          try {
            await initJiuguanStorage();
            console.log("[Settings] 已从隐写图片重新加载图片缓存");
          } catch (_0x2005eb) {
            console.error("[Settings] 重新加载图片缓存失败:", _0x2005eb);
          }
          window.loadSilterTavernChatu8Settings();
          alert("已恢复默认设置。");
        }
      });
    }
  });
}
function onExportSettingsClick() {
  const _0x418c01 = JSON.stringify(extension_settings[extensionName], null, 4);
  const _0x468037 = new Blob([_0x418c01], {
    type: "application/json"
  });
  const _0xf4aa4f = URL.createObjectURL(_0x468037);
  const _0x189421 = document.createElement("a");
  _0x189421.href = _0xf4aa4f;
  _0x189421.download = extensionName + "_settings.json";
  document.body.appendChild(_0x189421);
  _0x189421.click();
  document.body.removeChild(_0x189421);
  URL.revokeObjectURL(_0xf4aa4f);
  alert("设置已导出。");
}
function onImportSettingsClick() {
  const _0x3fc4f4 = document.createElement("input");
  _0x3fc4f4.type = "file";
  _0x3fc4f4.accept = ".json";
  _0x3fc4f4.onchange = _0x18c6ac => {
    const _0x580e1d = _0x18c6ac.target.files[0];
    if (_0x580e1d) {
      const _0x43ee5b = new FileReader();
      _0x43ee5b.onload = async _0x13e753 => {
        try {
          const _0x44ae3f = JSON.parse(_0x13e753.target.result);
          Object.assign(extension_settings[extensionName], _0x44ae3f);
          saveSettingsDebounced();
          try {
            await initJiuguanStorage();
            console.log("[Settings] 已从隐写图片重新加载图片缓存");
          } catch (_0x66ddec) {
            console.error("[Settings] 重新加载图片缓存失败:", _0x66ddec);
          }
          window.loadSilterTavernChatu8Settings();
          alert("设置已导入。");
        } catch (_0x442278) {
          alert("导入设置失败，文件格式无效。");
        }
      };
      _0x43ee5b.readAsText(_0x580e1d);
    }
  };
  _0x3fc4f4.click();
}
export function initGeneralSettings(_0x22410c) {
  _0x22410c.find("#ch-restore-settings").on("click", onRestoreDefaultSettingsClick);
  _0x22410c.find("#ch-export-settings").on("click", onExportSettingsClick);
  _0x22410c.find("#ch-import-settings").on("click", onImportSettingsClick);
}