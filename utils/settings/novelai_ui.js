import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
function updateNai3OptionsVisibility() {
  const _0x3845ce = document.getElementById("novelaimode");
  const _0x3f51cc = document.getElementById("st-chatu8-nai3-sm-field");
  const _0x1f9e54 = document.getElementById("st-chatu8-nai3-dyn-field");
  const _0x4afe63 = document.getElementById("st-chatu8-nai3-deceisp-field");
  if (!_0x3845ce || !_0x3f51cc || !_0x1f9e54 || !_0x4afe63) {
    return;
  }
  const _0x15336a = _0x3845ce.value;
  const _0x255c52 = _0x15336a === "nai-diffusion-3";
  _0x3f51cc.style.display = _0x255c52 ? "flex" : "none";
  _0x1f9e54.style.display = _0x255c52 ? "flex" : "none";
  _0x4afe63.style.display = _0x255c52 ? "flex" : "none";
}
function updateNovelaiReferenceSectionsVisibility() {
  const _0x5dfda5 = document.getElementById("novelaimode");
  const _0x49a27f = document.getElementById("nai-vibe-transfer-section");
  const _0x178baf = document.getElementById("nai-char-ref-section");
  if (!_0x5dfda5 || !_0x49a27f || !_0x178baf) {
    return;
  }
  const _0x193893 = _0x5dfda5.value;
  _0x49a27f.style.display = _0x193893 === "nai-diffusion-3" ? "block" : "none";
  const _0x56e01e = _0x193893 === "nai-diffusion-4-5-curated" || _0x193893 === "nai-diffusion-4-5-full";
  _0x178baf.style.display = _0x56e01e ? "block" : "none";
}
function updateNovelaiUcpOptions() {
  const _0xf0801e = extension_settings[extensionName];
  const _0x54bdfa = document.getElementById("novelaimode");
  const _0x4f67eb = document.getElementById("UCP_novelai");
  if (!_0x54bdfa || !_0x4f67eb) {
    return;
  }
  const _0xe58539 = _0x54bdfa.value;
  const _0x5addfd = _0xf0801e.UCP_novelai;
  _0x4f67eb.innerHTML = "";
  const _0x2ffa74 = {
    无: "",
    Heavy: "Heavy",
    Light: "Light"
  };
  if (_0xe58539 === "nai-diffusion-3" || _0xe58539 === "nai-diffusion-4-5-full") {
    _0x2ffa74["Human Focus"] = "Human Focus";
  }
  if (_0xe58539 === "nai-diffusion-4-5-full") {
    _0x2ffa74["Furry Focus"] = "Furry Focus";
  }
  _0x2ffa74.作者预设 = "bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap";
  _0x2ffa74["作者预set 2"] = "negativeXL_D, negativeXL, source_furry, extra limbs, deformations, long fingers, fused fingers, inaccurate_anatomy, bad proportions, poorly drawn hands, bad hands, extra_fingers, extra_hand, extra_arm, distorted fingers, ugly hands, creepy hands, six fingers, malformed fingers, long_fingers, interlocked fingers:1.2, ugly, deformed, uneven, asymmetrical, unnatural, missing fingers, extra digit, fewer digits, opaque eyes, small eyes, ugly eyes, blurred eyes, bad face, (bad anatomy, ugly face:1.2), (worst quality, low quality, not detailed, low resolution:1.2), motion_blur, blur, blur_censor, blurry, simple_background, text, error, cropped, normal quality, jpeg artifacts, watermark, logo, signature, username, artist name";
  for (const [_0x1ed8d7, _0x1c729f] of Object.entries(_0x2ffa74)) {
    const _0x4c5d48 = new Option(_0x1ed8d7, _0x1c729f);
    _0x4f67eb.add(_0x4c5d48);
  }
  _0x4f67eb.value = _0x5addfd;
  if (_0x4f67eb.selectedIndex === -1) {
    _0x4f67eb.value = "Heavy";
    _0xf0801e.UCP_novelai = "Heavy";
    saveSettingsDebounced();
  }
}
function updateNovelaiModelSchedule() {
  const _0x42f51b = extension_settings[extensionName];
  const _0x4c3ecf = document.getElementById("novelaimode");
  const _0xc3e5e9 = document.getElementById("Schedule");
  const _0x453c08 = document.getElementById("novelai_sampler");
  if (!_0x4c3ecf || !_0xc3e5e9 || !_0x453c08) {
    return;
  }
  updateNai3OptionsVisibility();
  updateNovelaiUcpOptions();
  updateNovelaiReferenceSectionsVisibility();
  const _0x1577d0 = _0x4c3ecf.value;
  const _0x202d53 = [..._0xc3e5e9.options].find(_0x57c8b7 => _0x57c8b7.value === "native");
  const _0x4a9792 = [..._0x453c08.options].find(_0x25befa => _0x25befa.value === "ddim_v3");
  if (_0x1577d0 === "nai-diffusion-3") {
    if (_0x4a9792) {
      _0x4a9792.style.display = "";
    }
    if (!_0x202d53) {
      const _0x53242b = new Option("native", "native");
      _0xc3e5e9.insertBefore(_0x53242b, _0xc3e5e9.firstChild);
      if (_0x42f51b.Schedule === "native") {
        _0xc3e5e9.value = "native";
      }
    }
  } else {
    if (_0x4a9792) {
      _0x4a9792.style.display = "none";
      if (_0x453c08.value === "ddim_v3") {
        _0x453c08.value = "k_euler";
        $(_0x453c08).trigger("change");
      }
    }
    if (_0x202d53) {
      if (_0xc3e5e9.value === "native") {
        _0xc3e5e9.value = "karras";
        $(_0xc3e5e9).trigger("change");
      }
      _0x202d53.remove();
    }
  }
}
function updateNovelaiOtherSiteVisibility() {
  const _0x1a6798 = document.getElementById("client");
  const _0x569e26 = document.getElementById("novelaisite");
  const _0x6dab65 = document.getElementById("novelai-other-site-field");
  if (!_0x1a6798 || !_0x569e26 || !_0x6dab65) {
    return;
  }
  const _0x1af354 = _0x1a6798.value !== "jiuguan" && _0x569e26.value !== "官网";
  _0x6dab65.style.display = _0x1af354 ? "flex" : "none";
}
function updateNovelaiScheduleVisibility() {
  const _0x50e7b2 = document.getElementById("novelai_sampler");
  const _0x3c3578 = document.querySelector("#Schedule")?.closest(".st-chatu8-field");
  const _0x1ec3a2 = document.getElementById("Schedule");
  if (!_0x50e7b2 || !_0x3c3578 || !_0x1ec3a2) {
    return;
  }
  const _0xf2d5f1 = _0x50e7b2.value;
  if (_0xf2d5f1 === "ddim_v3") {
    _0x3c3578.style.display = "none";
  } else {
    _0x3c3578.style.display = "flex";
    $(_0x1ec3a2).trigger("change");
  }
}
export function initNovelaiUI(_0x1cbd00) {
  _0x1cbd00.find("#novelai_sampler").on("change", updateNovelaiScheduleVisibility);
  _0x1cbd00.find("#novelaimode").on("change", updateNovelaiModelSchedule);
  _0x1cbd00.find("#client").on("change", updateNovelaiOtherSiteVisibility);
  _0x1cbd00.find("#novelaisite").on("change", updateNovelaiOtherSiteVisibility);
  updateNovelaiScheduleVisibility();
  updateNovelaiModelSchedule();
  updateNovelaiOtherSiteVisibility();
}