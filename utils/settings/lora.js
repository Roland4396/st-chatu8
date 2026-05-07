import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { getSuffix } from "../ui_common.js";
import { extensionName } from "../config.js";
function ComfyuiaddLORA() {
  const _0x98bc7 = $(".st-chatu8-tab-content.active");
  const _0x1602e0 = _0x98bc7.find("#fixedPrompt_comfyui");
  const _0x2d0cd4 = document.getElementById("ComfyuiLORA");
  if (!_0x2d0cd4.value || _0x2d0cd4.value.trim() === "" || _0x2d0cd4.disabled) {
    if (extension_settings[extensionName].client == "jiuguan") {
      alert("抱歉酒馆客户端无法支持lora获取,请参考文档尝试使用浏览器客户端");
    } else {
      alert("请先连接ComfyUI获取lora");
    }
    return;
  }
  const _0x490fe4 = _0x1602e0.val();
  const _0x4f4967 = _0x490fe4.trim() === "" ? "" : ", ";
  _0x1602e0.val(_0x490fe4 + _0x4f4967 + ("<lora:" + _0x2d0cd4.value + ":1>"));
  _0x1602e0.trigger("input");
}
function sd_add_lora() {
  const _0x34dfeb = $(".st-chatu8-tab-content.active");
  const _0x44ae10 = _0x34dfeb.find("#fixedPrompt");
  const _0x358b23 = document.getElementById("sd_cchatu_8_lora");
  if (!_0x358b23.value || _0x358b23.value.trim() === "" || _0x358b23.disabled) {
    if (extension_settings[extensionName].client == "jiuguan") {
      alert("抱歉酒馆客户端无法支持lora获取,请参考文档尝试使用浏览器客户端");
    } else {
      alert("请先连接SD获取lora");
    }
    return;
  }
  const _0x466d99 = _0x44ae10.val();
  const _0x282ee2 = _0x466d99.trim() === "" ? "" : ", ";
  _0x44ae10.val(_0x466d99 + _0x282ee2 + ("<lora:" + _0x358b23.value + ":1>"));
  _0x44ae10.trigger("input");
}
export function initLoraControls(_0x28f1a7) {
  _0x28f1a7.find("#ComfyuiaddLORA").on("click", ComfyuiaddLORA);
  _0x28f1a7.find("#sd_add_lora").on("click", sd_add_lora);
}