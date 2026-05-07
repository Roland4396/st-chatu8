import { extension_settings } from "../../../../../../extensions.js";
import { extensionName } from "../../config.js";
import { defaultCharacterSettings } from "../../character_config.js";
import { setupCharacterControls, loadCharacterPresetList, loadCharacterPreset } from "./characterPreset.js";
import { setupOutfitControls, loadOutfitPresetList, loadOutfitPreset } from "./outfitPreset.js";
import { setupCharacterEnableControls, loadCharacterEnablePresetList, loadCharacterEnablePreset, loadCharacterSelector } from "./characterEnable.js";
import { setupOutfitEnableControls, loadOutfitEnablePresetList, loadOutfitEnablePreset, loadOutfitEnableSelector } from "./outfitEnable.js";
import { setupCharacterCommonControls, loadCharacterCommonPresetList, loadCharacterCommonPreset, loadCharacterCommonSelector } from "./characterCommon.js";
import { setupBananaCharacterControls, loadBananaCharacterPresetList, loadBananaCharacterPreset } from "./bananaCharacter.js";
import { initTagAutocomplete } from "./tagAutocomplete.js";
import { initAllSelectSearch, refreshAllSelectSearch } from "./selectSearch.js";
let isCharacterInitialized = false;
export function initCharacterSettings(_0xc195c1) {
  console.log("[Character] Initializing character settings...");
  ensureCharacterSettings();
  if (!isCharacterInitialized) {
    setupSubNavigation(_0xc195c1);
    setupCharacterControls(_0xc195c1);
    setupOutfitControls(_0xc195c1);
    setupCharacterEnableControls(_0xc195c1);
    setupOutfitEnableControls(_0xc195c1);
    setupCharacterCommonControls(_0xc195c1);
    setupBananaCharacterControls(_0xc195c1);
    initTagAutocomplete();
    initAllSelectSearch(_0xc195c1);
    isCharacterInitialized = true;
  }
  console.log("[Character] Character settings initialized");
}
export function refreshCharacterSettings(_0x571151) {
  console.log("[Character] Refreshing character settings...");
  ensureCharacterSettings();
  loadCharacterPresetList();
  loadCharacterPreset();
  loadOutfitPresetList();
  loadOutfitPreset();
  loadCharacterEnablePresetList();
  loadCharacterEnablePreset();
  loadCharacterSelector();
  loadOutfitEnablePresetList();
  loadOutfitEnablePreset();
  loadOutfitEnableSelector();
  loadCharacterCommonPresetList();
  loadCharacterCommonPreset();
  loadCharacterCommonSelector();
  loadBananaCharacterPresetList();
  loadBananaCharacterPreset();
  refreshAllSelectSearch();
  resetSubNavigation(_0x571151);
  console.log("[Character] Character settings refreshed");
}
function ensureCharacterSettings() {
  const _0x150b60 = extension_settings[extensionName];
  if (!_0x150b60.characterPresets) {
    _0x150b60.characterPresets = JSON.parse(JSON.stringify(defaultCharacterSettings.characterPresets));
  }
  if (!_0x150b60.characterPresetId) {
    _0x150b60.characterPresetId = defaultCharacterSettings.characterPresetId;
  }
  if (!_0x150b60.outfitPresets) {
    _0x150b60.outfitPresets = JSON.parse(JSON.stringify(defaultCharacterSettings.outfitPresets));
  }
  if (!_0x150b60.outfitPresetId) {
    _0x150b60.outfitPresetId = defaultCharacterSettings.outfitPresetId;
  }
  if (!_0x150b60.characterAI) {
    _0x150b60.characterAI = JSON.parse(JSON.stringify(defaultCharacterSettings.characterAI));
  }
  if (!_0x150b60.outfitAI) {
    _0x150b60.outfitAI = JSON.parse(JSON.stringify(defaultCharacterSettings.outfitAI));
  }
  if (!_0x150b60.characterEnablePresets) {
    _0x150b60.characterEnablePresets = JSON.parse(JSON.stringify(defaultCharacterSettings.characterEnablePresets));
  }
  if (!_0x150b60.characterEnablePresetId) {
    _0x150b60.characterEnablePresetId = defaultCharacterSettings.characterEnablePresetId;
  }
  if (!_0x150b60.outfitEnablePresets) {
    _0x150b60.outfitEnablePresets = JSON.parse(JSON.stringify(defaultCharacterSettings.outfitEnablePresets));
  }
  if (!_0x150b60.outfitEnablePresetId) {
    _0x150b60.outfitEnablePresetId = defaultCharacterSettings.outfitEnablePresetId;
  }
  if (!_0x150b60.characterCommonPresets) {
    _0x150b60.characterCommonPresets = JSON.parse(JSON.stringify(defaultCharacterSettings.characterCommonPresets));
  }
  if (!_0x150b60.characterCommonPresetId) {
    _0x150b60.characterCommonPresetId = defaultCharacterSettings.characterCommonPresetId;
  }
  if (!_0x150b60.bananaCharacterPresets) {
    _0x150b60.bananaCharacterPresets = {
      默认: {
        triggers: "触发词1|触发词2",
        conversation: {
          user: {
            text: "",
            image: ""
          },
          model: {
            text: "",
            image: ""
          }
        }
      }
    };
  }
  if (!_0x150b60.bananaCharacterPresetId) {
    _0x150b60.bananaCharacterPresetId = "默认";
  }
}
function setupSubNavigation(_0x44a249) {
  _0x44a249.find(".st-chatu8-sub-nav-link").off("click").on("click", function (_0xf2eab1) {
    _0xf2eab1.preventDefault();
    const _0x39dced = $(this).data("sub-tab");
    _0x44a249.find(".st-chatu8-sub-nav-link").removeClass("active");
    $(this).addClass("active");
    _0x44a249.find(".st-chatu8-sub-tab-content").css("display", "none");
    _0x44a249.find("#" + _0x39dced).css("display", "block");
  });
  const _0x3cd800 = _0x44a249.find(".st-chatu8-sub-nav-link");
  const _0x248fd3 = _0x3cd800.first();
  if (_0x248fd3.length > 0) {
    _0x3cd800.removeClass("active");
    _0x248fd3.addClass("active");
    const _0x5c840a = _0x248fd3.data("sub-tab");
    _0x44a249.find(".st-chatu8-sub-tab-content").css("display", "none");
    _0x44a249.find("#" + _0x5c840a).css("display", "block");
  }
}
function resetSubNavigation(_0x447f4f) {
  const _0xfcc892 = _0x447f4f.find(".st-chatu8-sub-nav-link");
  const _0xf4d466 = _0xfcc892.first();
  if (_0xf4d466.length > 0) {
    _0xfcc892.removeClass("active");
    _0xf4d466.addClass("active");
    const _0x5aed15 = _0xf4d466.data("sub-tab");
    _0x447f4f.find(".st-chatu8-sub-tab-content").css("display", "none");
    _0x447f4f.find("#" + _0x5aed15).css("display", "block");
  }
}
export * from "./crypto.js";
export { loadCharacterPresetList, loadCharacterPreset, loadOutfitPresetList, loadOutfitPreset, loadCharacterEnablePresetList, loadCharacterEnablePreset, loadCharacterSelector, loadOutfitEnablePresetList, loadOutfitEnablePreset, loadOutfitEnableSelector, loadCharacterCommonPresetList, loadCharacterCommonPreset, loadCharacterCommonSelector, loadBananaCharacterPresetList, loadBananaCharacterPreset };