import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { defaultSettings, extensionName, extensionFolderPath, defaultThemes, aiModels } from "./config.js";
import { storeDelete, storeReadOnly, getAllImageMetadata, getAllImages, deleteMultipleImages, getImageByUUID, deleteImagesByUuids, getImageBlobByUUID, getImageThumbnailBlobByUUID, migrateDatabase, generateMissingThumbnails, syncServerImagesWithStorage, initJiuguanStorage } from "./database.js";
import { getSuffix, size_change, hideSettingsPanel, applyFabSettings, updateFabSize, isValidUrl, validateUrlInput, stylishConfirm, showToast } from "./ui_common.js";
import { removeTrailingSlash, getRequestHeaders, getLog, clearLog, addLog, processUploadedImage, processUploadedImageToBlob, getsdAuth } from "./utils.js";
import { editwk } from "./settings/workers.js";
import { initPromptReplaceControls } from "./settings/prompt_replace.js";
import { initLogSettings, updateLogView, updateErrorStats } from "./settings/log.js";
import { initWorldBookControls, refreshWorldBookSettings, setupWorldBookEventListener } from "./settings/worldbook.js";
import { initUpdateCheck } from "./settings/update.js";
import { showSettingsPanel } from "./ui_common.js";
import { initWorkerControls, eidtwork } from "./settings/worker.js";
import { initThemeSettings, applyTheme, applyImageFrameStyle, isThemeDark } from "./settings/theme.js";
import { initPromptSettings } from "./settings/prompt.js";
import { initImageUpload, updateNovelaiImagePreview, updateNovelaiCharRefImagePreview, updateComfyUIImagePreview, nai3VibeTransferImageMimeType, nai3CharRefImageMimeType, comfyuiImageObjectURL } from "./settings/image_upload.js";
import { initApiConnectionTests } from "./settings/api_connections.js";
import { initLoraControls } from "./settings/lora.js";
import { initGeneralSettings } from "./settings/general.js";
import { initFab } from "./settings/fab.js";
import { initImageCache } from "./settings/image_cache.js";
import { initNovelaiUI } from "./settings/novelai_ui.js";
import { initVibeGenerator } from "./settings/vibeTransferGenerator.js";
import { initVibeGroupEditor } from "./settings/vibeGroupEditor.js";
import { initCharRefGroupEditor } from "./settings/charRefGroupEditor.js";
import { init as _0x5be385 } from "./settings/vocabulary.js";
import { initCharacterSettings, refreshCharacterSettings } from "./settings/character/index.js";
import { initBananaUI } from "./settings/bananaui.js";
import { initRegexSettings } from "./settings/regex.js";
import { initLLMSettings } from "./settings/llm.js";
import { initSendData } from "./settings/send_data.js";
import { getAboutPageContent, initAboutProtection } from "./settings/about.js";
import { initProfileControls, refreshNovelaiProfileSelect, refreshComfyuiProfileSelect } from "./settings/profile.js";
import { initAiAssistant } from "./aiAssistant.js";
import { playOpeningVideo } from "./settings/openingVideo.js";
import { replaceWithSd } from "./sd.js";
import { replaceWithnovelai } from "./novelai.js";
import { replaceWithcomfyui } from "./comfyui.js";
import { replaceWithBanana } from "./banana.js";
import { initGestureMonitor } from "./settings/Drawing.js";
import { initClickTriggerMonitor } from "./settings/ClickTrigger.js";
import { initAutoLLMClick } from "./iframe/autoLLMClick.js";
import { initializeKeepAlive, updateKeepAliveStatus } from "./comfyuiKeepAlive.js";
let settings;
let currentPreviewTheme = {};
const generationTabs = ["sd", "novelai", "comfyui"];
const tabIds = ["main", "sd", "novelai", "comfyui", "banana", "llm", "vocabulary", "character", "theme", "fab", "image-cache", "regex", "send_data", "about", "log"];
async function loadAllTabsContent(_0x19f0e8) {
  if (!_0x19f0e8) {
    console.error("Chatu8 UI Error: Tab content container not found.");
    return false;
  }
  try {
    const _0x230db0 = tabIds.map(_0x812d96 => {
      if (_0x812d96 === "about") {
        const _0x57f6d2 = getAboutPageContent();
        const _0x45b621 = ["<div class=\"st-chatu8-settings-section\">\n        <h3>关于 智绘姬 🖼️</h3>\n        <p>插件作者: 从前跟你一样</p>\n        <div class=\"st-chatu8-about-links\">\n            <a href=\"https://afdian.com/a/cqgnyy\" target=\"_blank\" class=\"st-chatu8-about-link support\">\n                <i class=\"fa-solid fa-heart\"></i>\n                <span>支持作者</span>\n                <span class=\"st-chatu8-cute-emoji\">💖</span>\n            </a>\n            <a href=\"https://gxcgf4l6b2y.feishu.cn/wiki/UXtHw83pmiHnx1k4WpwcIn79nec?from=from_copylink\" target=\"_blank\" class=\"st-chatu8-about-link help\">\n                <i class=\"fa-solid fa-circle-question\"></i>\n                <span>查看帮助</span>\n                <span class=\"st-chatu8-cute-emoji\">❓</span>\n            </a>\n        </div>\n    </div>", "免责声明", "本插件仅作为图像生成的桥接工具", "用户生成的所有内容由用户自行负责", "禁止使用本插件生成任何违法违规内容", "因使用本插件产生的任何法律责任或后果", "本插件完全免费", "本插件为免费软件", "如果您是通过付费渠道获得本插件，您已被骗"];
        const _0x2beee2 = _0x45b621.filter(_0x41ff4e => !_0x57f6d2.includes(_0x41ff4e));
        if (_0x2beee2.length > 0) {
          console.error("[Chatu8] 关键声明内容缺失，插件无法加载");
          alert("⚠️ 文生图插件检测到关键文件被篡改，无法加载。\n\n请重新安装原版插件。");
          throw new Error("声明内容校验失败");
        }
        return Promise.resolve(_0x57f6d2);
      }
      return fetch(extensionFolderPath + "/html/settings/" + _0x812d96 + ".html").then(_0x2d86f0 => {
        if (!_0x2d86f0.ok) {
          throw new Error("Failed to fetch " + _0x812d96 + ".html");
        }
        return _0x2d86f0.text();
      });
    });
    const _0x5e90e5 = await Promise.all(_0x230db0);
    const _0x48d4e6 = _0x5e90e5.map((_0x558f76, _0x237d0c) => {
      const _0x3f7135 = tabIds[_0x237d0c];
      return "<div id=\"st-chatu8-tab-" + _0x3f7135 + "\" class=\"st-chatu8-tab-content\" data-tab-id=\"" + _0x3f7135 + "\">" + _0x558f76 + "</div>";
    }).join("");
    _0x19f0e8.innerHTML = _0x48d4e6;
    return true;
  } catch (_0x5ce0b3) {
    console.error("Chatu8 UI Error: Could not load all tab contents.", _0x5ce0b3);
    _0x19f0e8.innerHTML = "<p class=\"error\" style=\"color:red; text-align:center; margin-top: 20px;\">错误：无法加载设置页面。请检查浏览器控制台获取详细信息。</p>";
    return false;
  }
}
function updateGenerationModeHandlers() {
  replaceWithSd();
  replaceWithnovelai();
  replaceWithcomfyui();
  replaceWithBanana();
  addLog("[UI] Generation mode handlers updated for mode: " + extension_settings[extensionName].mode);
}
export async function initUI({
  check_update: _0x2aa56a
}) {
  const _0x1044b6 = document.getElementById("st-chatu8-settings");
  if (_0x1044b6) {
    _0x1044b6.remove();
  }
  settings = extension_settings[extensionName];
  try {
    await initJiuguanStorage();
  } catch (_0x534162) {
    console.error("[UI] 初始化 jiuguanStorage 失败:", _0x534162);
  }
  const _0xb9fb5d = document.createElement("link");
  _0xb9fb5d.rel = "stylesheet";
  _0xb9fb5d.type = "text/css";
  _0xb9fb5d.href = extensionFolderPath + "/style.css";
  document.head.appendChild(_0xb9fb5d);
  try {
    const _0x45016a = await fetch(extensionFolderPath + "/settings.html");
    if (!_0x45016a.ok) {
      throw new Error("Failed to fetch settings.html");
    }
    const _0x581a39 = await _0x45016a.text();
    document.body.insertAdjacentHTML("beforeend", _0x581a39);
  } catch (_0x267ae4) {
    console.error("Chatu8 UI Error: Could not load main settings panel.", _0x267ae4);
    return;
  }
  const _0x333458 = document.querySelector("#ch-settings-modal .st-chatu8-content");
  if (!(await loadAllTabsContent(_0x333458))) {
    return;
  }
  function _0x3300a3() {
    settings = extension_settings[extensionName];
    if (settings.nai3CharRef === "true" && settings.enableVibeGroupTransfer === "true") {
      settings.enableVibeGroupTransfer = "false";
      addLog("[CharRef] Conflict resolved on load: Character Reference takes priority over Vibe Transfer");
      console.warn("[CharRef] Conflict detected: Both Character Reference and Vibe Transfer were enabled. Disabling Vibe Transfer (Character Reference takes priority).");
      toastr.warning("检测到冲突：角色参考优先，Vibe Transfer 已禁用", "功能冲突");
      saveSettingsDebounced();
    }
    if (!settings.themes) {
      settings.themes = JSON.parse(JSON.stringify(defaultThemes));
    }
    if (!settings.theme_id || !settings.themes[settings.theme_id]) {
      settings.theme_id = "默认-白天";
    }
    applyTheme(settings.themes[settings.theme_id]);
    const _0x4db793 = ["scriptEnabled", "newlineFixEnabled", "mode", "client", "displayMode", "heavyFrontendMode", "insertOriginalText", "dbclike", "collapseImage", "zidongdianji", "zidongdianji2", "longPressToEdit", "clickToPreview", "startTag", "endTag", "cache", "sdUrl", "st_chatu8_sd_auth", "comfyuiUrl", "novelaiApi", "novelaisite", "novelaiOtherSite", "enableCloudQueue", "cloudQueueUrl", "cloudQueueGreeting", "showQueueGreeting", "novelaimode", "novelai_sampler", "Schedule", "nai3Scale", "cfg_rescale", "AI_use_coords", "sm", "dyn", "nai3Variety", "nai3Deceisp", "sd_cwidth", "sd_cheight", "sd_csteps", "sd_cseed", "sdCfgScale", "restoreFaces", "novelai_width", "novelai_height", "novelai_steps", "novelai_seed", "nai3VibeTransfer", "enableVibeGroupTransfer", "normalizeRefStrength", "InformationExtracted", "ReferenceStrength", "nai3CharRef", "nai3StylePerception", "comfyui_width", "comfyui_height", "comfyui_steps", "comfyui_seed", "cfg_comfyui", "worker", "ipa", "c_fenwei", "c_xijie", "c_quanzhong", "c_idquanzhong", "AQT_sd", "UCP_sd", "AQT_novelai", "UCP_novelai", "AQT_comfyui", "UCP_comfyui", "addFurryDataset", "sd_cupscale_factor", "sd_chires_fix", "sd_chires_steps", "sd_cdenoising_strength", "sd_cclip_skip", "sd_cadetailer", "worldBookEnabled", "ai_temperature", "ai_top_p", "ai_presence_penalty", "ai_frequency_penalty", "ai_stream", "ai_private", "ai_token", "vocabulary_search_startswith", "vocabulary_search_limit", "vocabulary_search_sort", "enablePregen", "autoLLMImageGen", "imageAlignment", "imageGenInterval", "translation_system_prompt", "ai_test_system", "ai_test_user", "ai_test_output", "jiuguanchucun", "convertToJpegStorage"];
    _0x4db793.forEach(_0x31734e => {
      const _0x4f0fdd = document.getElementById(_0x31734e);
      if (_0x4f0fdd) {
        if (_0x4f0fdd.type === "checkbox") {
          _0x4f0fdd.checked = String(settings[_0x31734e]) === "true";
        } else {
          _0x4f0fdd.value = settings[_0x31734e];
        }
      }
    });
    const _0x2d47b6 = document.getElementById("enable_chatu8_fab_video");
    if (_0x2d47b6) {
      const _0x53bb08 = settings.enable_chatu8_fab_video === true || settings.enable_chatu8_fab_video === "true";
      _0x2d47b6.checked = _0x53bb08;
      const _0x594a79 = document.getElementById("fab-traditional-settings");
      if (_0x594a79) {
        _0x594a79.style.display = _0x53bb08 ? "none" : "";
      }
    }
    const _0x4eb813 = document.getElementById("InformationExtracted");
    const _0x504b7e = document.getElementById("InformationExtracted_range");
    if (_0x4eb813 && _0x504b7e) {
      _0x504b7e.value = _0x4eb813.value;
    }
    const _0x1133bb = document.getElementById("ReferenceStrength");
    const _0x1c66f1 = document.getElementById("ReferenceStrength_range");
    if (_0x1133bb && _0x1c66f1) {
      _0x1c66f1.value = _0x1133bb.value;
    }
    if (window.nai3VibeTransferImage) {
      updateNovelaiImagePreview("data:" + nai3VibeTransferImageMimeType + ";base64," + window.nai3VibeTransferImage);
    } else {
      updateNovelaiImagePreview(null);
    }
    if (window.nai3CharRefImage) {
      updateNovelaiCharRefImagePreview("data:" + nai3CharRefImageMimeType + ";base64," + window.nai3CharRefImage);
    } else {
      updateNovelaiCharRefImagePreview(null);
    }
    updateComfyUIImagePreview(comfyuiImageObjectURL);
    validateUrlInput(document.getElementById("sdUrl"));
    validateUrlInput(document.getElementById("comfyuiUrl"));
    const _0xd8237a = settings.sdCache;
    const _0x31c37e = _0xd8237a && _0xd8237a.models && _0xd8237a.models.length > 0;
    const _0x5a729e = [{
      id: "sd_cchatu_8_model",
      cacheKey: "models",
      settingKey: "sd_cchatu_8_model",
      nameField: "model_name"
    }, {
      id: "sd_cchatu_8_vae",
      cacheKey: "vaes",
      settingKey: "sd_cchatu_8_vae",
      nameField: "model_name"
    }, {
      id: "sd_cchatu_8_samplerName",
      cacheKey: "samplers",
      settingKey: "sd_cchatu_8_samplerName",
      nameField: "name"
    }, {
      id: "sd_cchatu_8_scheduler",
      cacheKey: "schedulers",
      settingKey: "sd_cchatu_8_scheduler",
      nameField: "name"
    }, {
      id: "sd_cchatu_8_upscaler",
      cacheKey: "upscalers",
      settingKey: "sd_cchatu_8_upscaler",
      nameField: "name"
    }, {
      id: "sd_cchatu_8_lora",
      cacheKey: "loras",
      settingKey: "sd_cchatu_8_lora",
      nameField: "name"
    }];
    if (_0x31c37e) {
      _0x5a729e.forEach(({
        id: _0x37f003,
        cacheKey: _0x458173,
        settingKey: _0x4a022f,
        nameField: _0x52cb99
      }) => {
        const _0x4c6f20 = document.getElementById(_0x37f003);
        if (_0x4c6f20) {
          _0x4c6f20.innerHTML = "";
          _0x4c6f20.disabled = false;
          if (_0x37f003 === "sd_cchatu_8_vae") {
            _0x4c6f20.add(new Option("NONE", "NONE"));
          }
          if (_0xd8237a[_0x458173]) {
            _0xd8237a[_0x458173].forEach(_0x42fc70 => {
              const _0x4685e8 = _0x42fc70;
              const _0x43adaf = new Option(_0x4685e8, _0x4685e8);
              _0x43adaf.title = _0x4685e8;
              _0x4c6f20.add(_0x43adaf);
            });
          }
          _0x4c6f20.value = settings[_0x4a022f];
          if (_0x4c6f20.selectedIndex === -1 && _0x4c6f20.options.length > 0) {
            _0x4c6f20.selectedIndex = 0;
            settings[_0x4a022f] = _0x4c6f20.value;
          }
        }
      });
    } else {
      _0x5a729e.forEach(({
        id: _0x536af9,
        settingKey: _0x19b1dc
      }) => {
        const _0x4bbc0a = document.getElementById(_0x536af9);
        if (_0x4bbc0a) {
          _0x4bbc0a.innerHTML = "<option value=\"" + settings[_0x19b1dc] + "\">" + settings[_0x19b1dc] + "</option>";
          _0x4bbc0a.disabled = true;
        }
      });
    }
    const _0x444564 = settings.comfyuiCache;
    const _0x336bdf = _0x444564 && _0x444564.models && _0x444564.models.length > 0;
    const _0x3087cc = document.getElementById("MODEL_NAME");
    const _0x5b9716 = document.getElementById("comfyui_vae");
    const _0x273d70 = document.getElementById("comfyui_scheduler");
    const _0x1f84e0 = document.getElementById("comfyuisamplerName");
    const _0x58a33a = document.getElementById("ComfyuiLORA");
    const _0x35e25d = document.getElementById("comfyuiCLIPName");
    if (_0x336bdf) {
      [_0x3087cc, _0x5b9716, _0x273d70, _0x1f84e0, _0x58a33a, _0x35e25d].forEach(_0x4f19d3 => {
        if (_0x4f19d3) {
          _0x4f19d3.innerHTML = "";
          _0x4f19d3.disabled = false;
        }
      });
      _0x444564.models.forEach(_0x442a0d => {
        const _0x334b06 = _0x442a0d.text || _0x442a0d.value;
        const _0x3231a7 = new Option(_0x334b06, _0x442a0d.value.replaceAll("\\", "\\\\"));
        _0x3231a7.title = _0x3231a7.text;
        if (_0x3087cc) {
          _0x3087cc.add(_0x3231a7);
        }
      });
      _0x444564.vaes.forEach(_0x2f465d => {
        const _0x4064e0 = typeof _0x2f465d === "object" ? _0x2f465d.value : _0x2f465d;
        const _0x13d55d = new Option(_0x4064e0, _0x4064e0);
        _0x13d55d.title = _0x4064e0;
        if (_0x5b9716) {
          _0x5b9716.add(_0x13d55d);
        }
      });
      _0x444564.schedulers.forEach(_0x3d2ca0 => {
        const _0x557736 = new Option(_0x3d2ca0, _0x3d2ca0);
        _0x557736.title = _0x3d2ca0;
        if (_0x273d70) {
          _0x273d70.add(_0x557736);
        }
      });
      _0x444564.samplers.forEach(_0x43a503 => {
        const _0xc9e515 = new Option(_0x43a503, _0x43a503);
        _0xc9e515.title = _0x43a503;
        if (_0x1f84e0) {
          _0x1f84e0.add(_0xc9e515);
        }
      });
      if (_0x444564.CLIPs) {
        _0x444564.CLIPs.forEach(_0xe92d12 => {
          const _0x379c55 = new Option(_0xe92d12, _0xe92d12);
          _0x379c55.title = _0xe92d12;
          if (_0x35e25d) {
            _0x35e25d.add(_0x379c55);
          }
        });
      }
      if (_0x58a33a && _0x444564.loras && _0x444564.loras.length > 0) {
        _0x444564.loras.forEach(_0x399aba => {
          const _0x1befd5 = new Option(_0x399aba.replace(".safetensors", ""), _0x399aba.replace(".safetensors", ""));
          _0x1befd5.title = _0x399aba;
          _0x58a33a.add(_0x1befd5);
        });
      } else if (_0x58a33a) {
        _0x58a33a.innerHTML = "<option>无</option>";
        _0x58a33a.disabled = true;
      }
      if (_0x3087cc) {
        _0x3087cc.value = settings.MODEL_NAME;
        if (_0x3087cc.selectedIndex === -1 && _0x3087cc.options.length > 0) {
          _0x3087cc.selectedIndex = 0;
          settings.MODEL_NAME = _0x3087cc.value;
        }
      }
      if (_0x5b9716) {
        _0x5b9716.value = settings.comfyui_vae;
        if (_0x5b9716.selectedIndex === -1 && _0x5b9716.options.length > 0) {
          _0x5b9716.selectedIndex = 0;
          settings.comfyui_vae = _0x5b9716.value;
        }
      }
      if (_0x273d70) {
        _0x273d70.value = settings.comfyui_scheduler;
        if (_0x273d70.selectedIndex === -1 && _0x273d70.options.length > 0) {
          _0x273d70.selectedIndex = 0;
          settings.comfyui_scheduler = _0x273d70.value;
        }
      }
      if (_0x1f84e0) {
        _0x1f84e0.value = settings.comfyuisamplerName;
        if (_0x1f84e0.selectedIndex === -1 && _0x1f84e0.options.length > 0) {
          _0x1f84e0.selectedIndex = 0;
          settings.comfyuisamplerName = _0x1f84e0.value;
        }
      }
      if (_0x35e25d) {
        _0x35e25d.value = settings.comfyuiCLIPName;
        if (_0x35e25d.selectedIndex === -1 && _0x35e25d.options.length > 0) {
          _0x35e25d.selectedIndex = 0;
          settings.comfyuiCLIPName = _0x35e25d.value;
        }
      }
    } else {
      const _0x3a3fa9 = {
        el: _0x3087cc,
        setting: "MODEL_NAME"
      };
      const _0x12f3c9 = {
        el: _0x5b9716,
        setting: "comfyui_vae"
      };
      const _0x1d89f9 = {
        el: _0x273d70,
        setting: "comfyui_scheduler"
      };
      const _0x17fa83 = {
        el: _0x1f84e0,
        setting: "comfyuisamplerName"
      };
      const _0x2bfed0 = {
        el: _0x35e25d,
        setting: "comfyuiCLIPName"
      };
      const _0x5bf202 = [_0x3a3fa9, _0x12f3c9, _0x1d89f9, _0x17fa83, _0x2bfed0];
      _0x5bf202.forEach(({
        el: _0x4c9e25,
        setting: _0x768e6e
      }) => {
        if (_0x4c9e25) {
          _0x4c9e25.innerHTML = "";
          const _0x4acdb4 = new Option(settings[_0x768e6e] || "未连接", settings[_0x768e6e]);
          _0x4acdb4.title = settings[_0x768e6e];
          _0x4c9e25.add(_0x4acdb4);
          _0x4c9e25.value = settings[_0x768e6e];
          _0x4c9e25.disabled = true;
        }
      });
      if (_0x58a33a) {
        _0x58a33a.innerHTML = "<option>未连接</option>";
        _0x58a33a.disabled = true;
      }
    }
    generationTabs.forEach(_0x1135a9 => {
      const _0x1e327c = getSuffix(_0x1135a9);
      const _0x111c89 = document.getElementById("yusheid" + _0x1e327c);
      const _0x466385 = "yusheid" + (_0x1135a9 === "sd" ? "_sd" : _0x1e327c);
      if (_0x111c89) {
        _0x111c89.innerHTML = "";
        const _0x1362b8 = Object.keys(settings.yushe).sort((_0x21bb70, _0x2d2d52) => _0x21bb70.localeCompare(_0x2d2d52, "zh-CN"));
        for (const _0x24a9be of _0x1362b8) {
          const _0x5fcf0a = new Option(_0x24a9be, _0x24a9be);
          _0x5fcf0a.title = _0x24a9be;
          _0x111c89.add(_0x5fcf0a);
        }
        _0x111c89.value = settings[_0x466385];
      }
      const _0x100338 = settings[_0x466385] || "默认";
      const _0x3fffdf = settings.yushe[_0x100338] || {};
      const _0x2472be = ["fixedPrompt", "fixedPrompt_end", "negativePrompt"];
      _0x2472be.forEach(_0x23854c => {
        const _0x25f445 = document.getElementById(_0x23854c + _0x1e327c);
        if (_0x25f445) {
          _0x25f445.value = _0x3fffdf[_0x23854c] ?? "";
          const _0x1407a9 = _0x25f445.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
          if (_0x1407a9) {
            $(_0x1407a9).hide();
          }
        }
      });
    });
    if (!settings.prompt_replace) {
      settings.prompt_replace = {
        默认: {
          text: ""
        }
      };
    }
    if (!settings.prompt_replace_id) {
      settings.prompt_replace_id = "默认";
    }
    generationTabs.forEach(_0x57a352 => {
      const _0x278dbd = getSuffix(_0x57a352);
      const _0x4e72ce = document.getElementById("prompt_replace_id" + _0x278dbd);
      if (_0x4e72ce) {
        _0x4e72ce.innerHTML = "";
        for (const _0x1edbcf in settings.prompt_replace) {
          const _0x3358be = new Option(_0x1edbcf, _0x1edbcf);
          _0x3358be.title = _0x1edbcf;
          _0x4e72ce.add(_0x3358be);
        }
        _0x4e72ce.value = settings.prompt_replace_id;
      }
      const _0x1bd46f = settings.prompt_replace[settings.prompt_replace_id] || {};
      const _0x163ac9 = document.getElementById("prompt_replace_text" + _0x278dbd);
      if (_0x163ac9) {
        _0x163ac9.value = _0x1bd46f.text ?? "";
        const _0x343bb4 = _0x163ac9.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
        if (_0x343bb4) {
          $(_0x343bb4).hide();
        }
      }
    });
    if (!settings.workers) {
      settings.workers = {};
    }
    if (!settings.workers.图像编辑) {
      settings.workers.图像编辑 = editwk;
      console.log("[Chatu8] 已自动添加 \"图像编辑\" 工作流预设");
      saveSettingsDebounced();
    }
    if (!settings.editWorkerid) {
      settings.editWorkerid = "图像编辑";
      saveSettingsDebounced();
    }
    if (!settings.editWorker && settings.workers[settings.editWorkerid]) {
      settings.editWorker = settings.workers[settings.editWorkerid];
      saveSettingsDebounced();
    }
    if (!settings.worldBookList) {
      settings.worldBookList = {
        默认: {
          content: ""
        }
      };
    }
    if (!settings.worldBookList_id) {
      settings.worldBookList_id = "默认";
    }
    const _0x40ddfa = document.getElementById("worldBookList_id");
    if (_0x40ddfa) {
      _0x40ddfa.innerHTML = "";
      for (const _0x34028d in settings.worldBookList) {
        const _0x50bc56 = new Option(_0x34028d, _0x34028d);
        _0x50bc56.title = _0x34028d;
        _0x40ddfa.add(_0x50bc56);
      }
      _0x40ddfa.value = settings.worldBookList_id;
    }
    const _0x39d1a7 = settings.worldBookList[settings.worldBookList_id] || {};
    const _0x31c18b = document.getElementById("worldbook_content");
    if (_0x31c18b) {
      _0x31c18b.value = _0x39d1a7.content ?? "";
      const _0xa74881 = _0x31c18b.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
      if (_0xa74881) {
        $(_0xa74881).hide();
      }
    }
    const _0x3e3874 = document.getElementById("workerid");
    if (_0x3e3874) {
      _0x3e3874.innerHTML = "";
      for (const _0x57858a in settings.workers) {
        const _0x31469d = new Option(_0x57858a, _0x57858a);
        _0x31469d.title = _0x57858a;
        _0x3e3874.add(_0x31469d);
      }
      _0x3e3874.value = settings.workerid;
    }
    const _0xe219c5 = document.getElementById("editWorkerid");
    if (_0xe219c5) {
      _0xe219c5.innerHTML = "";
      for (const _0x180e9e in settings.workers) {
        const _0x124334 = new Option(_0x180e9e, _0x180e9e);
        _0x124334.title = _0x180e9e;
        _0xe219c5.add(_0x124334);
      }
      _0xe219c5.value = settings.editWorkerid;
    }
    const _0x2b9a69 = document.getElementById("editWorker");
    if (_0x2b9a69) {
      _0x2b9a69.value = settings.editWorker || settings.workers[settings.editWorkerid] || "";
    }
    if (!settings.chatu8_fab_position) {
      settings.chatu8_fab_position = {
        desktop: {
          top: settings.chatu8_fab_top || "65vh",
          left: settings.chatu8_fab_left || "20px"
        },
        mobile: {
          top: "80vh",
          left: "10px"
        }
      };
      delete settings.chatu8_fab_top;
      delete settings.chatu8_fab_left;
    }
    if (!settings.chatu8_fab_position.desktop) {
      settings.chatu8_fab_position.desktop = {
        top: "65vh",
        left: "20px"
      };
    }
    if (!settings.chatu8_fab_position.mobile) {
      settings.chatu8_fab_position.mobile = {
        top: "80vh",
        left: "10px"
      };
    }
    $("#enable_chatu8_fab").prop("checked", String(settings.enable_chatu8_fab) === "true");
    if (!settings.fabThemes) {
      settings.fabThemes = JSON.parse(JSON.stringify(defaultSettings.fabThemes));
    }
    if (!settings.chatu8_fab_theme) {
      settings.chatu8_fab_theme = "自定义";
    }
    const _0xafd1a = $("#chatu8_fab_theme");
    if (_0xafd1a.length) {
      _0xafd1a.empty();
      for (const _0x1e6237 in settings.fabThemes) {
        const _0x3212a4 = new Option(_0x1e6237, _0x1e6237);
        _0x3212a4.title = _0x1e6237;
        _0xafd1a.append(_0x3212a4);
      }
      _0xafd1a.val(settings.chatu8_fab_theme);
    }
    $("#chatu8_fab_bg_color").val(settings.chatu8_fab_bg_color || "#ADD8E6");
    $("#chatu8_fab_icon_color").val(settings.chatu8_fab_icon_color || "#FFFFFF");
    $("#chatu8_fab_opacity").val(settings.chatu8_fab_opacity ?? 1);
    $("#chatu8_fab_opacity_value").val(settings.chatu8_fab_opacity ?? 1);
    if (typeof settings.chatu8_fab_size === "number" || typeof settings.chatu8_fab_size === "string") {
      const _0x18cb3b = typeof settings.chatu8_fab_size === "string" ? parseInt(settings.chatu8_fab_size, 10) : settings.chatu8_fab_size;
      const _0x45f896 = {
        desktop: _0x18cb3b,
        mobile: _0x18cb3b
      };
      settings.chatu8_fab_size = _0x45f896;
    }
    const _0x17002b = window.innerWidth <= 768;
    const _0x234daa = _0x17002b ? settings.chatu8_fab_size?.mobile ?? 40 : settings.chatu8_fab_size?.desktop ?? 50;
    $("#chatu8_fab_size").val(_0x234daa);
    $("#chatu8_fab_size_value").val(_0x234daa);
    if (!settings.chatu8_fab_video_paths) {
      settings.chatu8_fab_video_paths = JSON.parse(JSON.stringify(defaultSettings.chatu8_fab_video_paths));
    }
    applyFabSettings();
    const _0x3151e4 = $(".st-chatu8-nav-link.active").data("tab");
    if (_0x3151e4 === "character") {
      const _0x1981ab = $("#st-chatu8-tab-character");
      if (_0x1981ab.length) {
        refreshCharacterSettings(_0x1981ab);
      }
    }
  }
  _0x3300a3();
  updateGenerationModeHandlers();
  initFab();
  const _0x2dbc2a = $("#ch-settings-modal");
  initUpdateCheck(_0x2dbc2a, _0x2aa56a);
  setTimeout(() => generateMissingThumbnails(), 5000);
  const _0x2173f6 = showSettingsPanel;
  const _0x54db86 = function () {
    playOpeningVideo();
    setTimeout(() => {
      _0x2173f6();
    }, 100);
  };
  window.showChatuSettingsPanel = _0x54db86;
  window.loadSilterTavernChatu8Settings = _0x3300a3;
  window.refreshNovelaiProfileSelect = refreshNovelaiProfileSelect;
  window.refreshComfyuiProfileSelect = refreshComfyuiProfileSelect;
  initNovelaiUI(_0x2dbc2a);
  initVibeGenerator(_0x2dbc2a);
  initVibeGroupEditor(_0x2dbc2a);
  initCharRefGroupEditor(_0x2dbc2a);
  _0x2dbc2a.find("#ch-settings-modal-close").on("click", hideSettingsPanel);
  if (extension_settings[extensionName].gestureEnabled == true || extension_settings[extensionName].gestureEnabled === "true") {
    initGestureMonitor();
  }
  initAutoLLMClick();
  initializeKeepAlive();
  initGeneralSettings(_0x2dbc2a);
  initLogSettings(_0x2dbc2a);
  initThemeSettings(_0x2dbc2a, settings, currentPreviewTheme);
  initPromptSettings(_0x2dbc2a, settings);
  _0x2dbc2a.on("click", ".st-chatu8-toggle", function () {
    const _0x43a2b8 = $(this).find("input[type=\"checkbox\"]");
    if (_0x43a2b8.length) {
      _0x43a2b8.prop("checked", !_0x43a2b8.prop("checked")).trigger("change");
    }
  });
  _0x2dbc2a.find(".st-chatu8-nav-link").on("click", function (_0x4191f6) {
    _0x4191f6.preventDefault();
    const _0x5b151a = $(this).data("tab");
    if ($(this).hasClass("active")) {
      return;
    }
    _0x3300a3();
    _0x2dbc2a.find(".st-chatu8-nav-link").removeClass("active");
    $(this).addClass("active");
    const _0x4e87ec = _0x2dbc2a.find(".st-chatu8-content > .st-chatu8-tab-content");
    _0x4e87ec.removeClass("active");
    const _0x2d5432 = _0x2dbc2a.find("#st-chatu8-tab-" + _0x5b151a);
    if (_0x2d5432.length) {
      _0x2d5432.addClass("active");
      if (_0x5b151a === "log") {
        updateLogView();
        updateErrorStats();
      } else if (_0x5b151a === "character") {
        refreshCharacterSettings(_0x2d5432);
      }
    }
    if (settings.lastTab !== _0x5b151a) {
      settings.lastTab = _0x5b151a;
      saveSettingsDebounced();
    }
  });
  const _0x24c22f = settings.lastTab || "main";
  const _0x32ab77 = _0x2dbc2a.find(".st-chatu8-nav-link[data-tab=\"" + _0x24c22f + "\"]");
  if (_0x32ab77.length && !_0x32ab77.hasClass("active")) {
    _0x2dbc2a.find(".st-chatu8-nav-link").removeClass("active");
    _0x32ab77.addClass("active");
    _0x2dbc2a.find(".st-chatu8-content > .st-chatu8-tab-content").removeClass("active");
    const _0x4a446a = _0x2dbc2a.find("#st-chatu8-tab-" + _0x24c22f);
    _0x4a446a.addClass("active");
    if (_0x24c22f === "log") {
      updateLogView();
      updateErrorStats();
    }
  } else if (_0x2dbc2a.find(".st-chatu8-nav-link.active").length === 0) {
    const _0x94160b = _0x2dbc2a.find(".st-chatu8-nav-link").first();
    _0x94160b.addClass("active");
    const _0x4f4ed3 = _0x94160b.data("tab");
    _0x2dbc2a.find("#st-chatu8-tab-" + _0x4f4ed3).addClass("active");
  }
  initPromptReplaceControls(_0x2dbc2a);
  setupWorldBookEventListener();
  initCharacterSettings(_0x2dbc2a);
  initWorkerControls(_0x2dbc2a);
  initProfileControls(_0x2dbc2a);
  initApiConnectionTests(_0x2dbc2a);
  initLoraControls(_0x2dbc2a);
  _0x2dbc2a.find("#eidtwork").on("click", eidtwork);
  initImageUpload(_0x2dbc2a);
  initImageCache(_0x2dbc2a);
  _0x5be385(_0x2dbc2a);
  initBananaUI(_0x2dbc2a);
  initRegexSettings(_0x2dbc2a);
  initLLMSettings(_0x2dbc2a);
  initSendData(_0x2dbc2a);
  initAboutProtection(_0x2dbc2a[0]);
  initAiAssistant(_0x2dbc2a);
  _0x2dbc2a.find("#migrate-database-btn").on("click", migrateDatabase);
  _0x2dbc2a.find("#sync-server-images-btn").on("click", async function () {
    const _0x30e1fb = $(this);
    const _0x5629bf = _0x30e1fb.text();
    const _0x568924 = $("\n            <div class=\"st-chatu8-progress-modal\" style=\"\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                background: rgba(0, 0, 0, 0.7);\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                z-index: 10001;\n            \">\n                <div class=\"st-chatu8-progress-container\" style=\"\n                    background: white;\n                    border-radius: 8px;\n                    padding: 24px;\n                    min-width: 400px;\n                    max-width: 500px;\n                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n                \">\n                    <h3 style=\"margin: 0 0 16px 0; color: #333;\">同步服务器图片</h3>\n                    <div class=\"st-chatu8-progress-bar\" style=\"\n                        width: 100%;\n                        height: 24px;\n                        background: #f0f0f0;\n                        border-radius: 12px;\n                        overflow: hidden;\n                        margin-bottom: 12px;\n                    \">\n                        <div class=\"st-chatu8-progress-fill\" style=\"\n                            height: 100%;\n                            background: linear-gradient(90deg, #4CAF50, #45a049);\n                            width: 0%;\n                            transition: width 0.3s ease;\n                            border-radius: 12px;\n                        \"></div>\n                    </div>\n                    <div class=\"st-chatu8-progress-text\" style=\"\n                        text-align: center;\n                        color: #666;\n                        font-size: 14px;\n                        min-height: 20px;\n                    \">准备开始...</div>\n                    <div class=\"st-chatu8-progress-percentage\" style=\"\n                        text-align: center;\n                        color: #333;\n                        font-weight: bold;\n                        margin-top: 8px;\n                    \">0%</div>\n                </div>\n            </div>\n        ");
    $("body").append(_0x568924);
    _0x30e1fb.prop("disabled", true).text("同步中...");
    try {
      const _0x3c69f4 = await syncServerImagesWithStorage("chatu8", (_0x21b142, _0x34da42, _0x474a80) => {
        const _0x1e1905 = Math.floor(_0x21b142 / _0x34da42 * 100);
        _0x568924.find(".st-chatu8-progress-fill").css("width", _0x1e1905 + "%");
        _0x568924.find(".st-chatu8-progress-text").text(_0x474a80);
        _0x568924.find(".st-chatu8-progress-percentage").text(_0x1e1905 + "%");
      });
      _0x568924.remove();
      if (_0x3c69f4.deletedCount > 0 || _0x3c69f4.errors.length > 0) {
        const _0x51e555 = "同步完成！\n删除了 " + _0x3c69f4.deletedCount + " 个不同步的图片" + (_0x3c69f4.errors.length > 0 ? "\n失败 " + _0x3c69f4.errors.length + " 个" : "");
        alert(_0x51e555);
      } else {
        alert("同步完成！所有图片都已同步，无需删除。");
      }
    } catch (_0x1766ab) {
      console.error("[Sync] 同步失败:", _0x1766ab);
      _0x568924.remove();
      alert("同步失败: " + _0x1766ab.message);
    } finally {
      _0x30e1fb.prop("disabled", false).text(_0x5629bf);
    }
  });
  _0x2dbc2a.find("#sd_csize").on("change", () => size_change("sd"));
  _0x2dbc2a.find("#novelai_size").on("change", () => size_change("novelai"));
  _0x2dbc2a.find("#comfyui_size").on("change", () => size_change("comfyui"));
  const _0x420734 = Object.keys(defaultSettings);
  const _0x31a7e2 = ["yushe", "yusheid", "fixedPrompt", "fixedPrompt_end", "negativePrompt", "workers", "workerid", "worker", "themes", "theme_id", "prompt_replace", "prompt_replace_id", "prompt_replace_text", "UCP", "AQT", "nai3CharRef", "worldBookList", "worldBookList_id", "worldbook_content", "insertOriginalText", "convertToJpegStorage"];
  $("#InformationExtracted, #InformationExtracted_range").on("input", _0x53a8f8 => {
    const _0x3e1daa = $(_0x53a8f8.target).val();
    $("#InformationExtracted").val(_0x3e1daa);
    $("#InformationExtracted_range").val(_0x3e1daa);
    settings.InformationExtracted = _0x3e1daa;
    saveSettingsDebounced();
  });
  $("#ReferenceStrength, #ReferenceStrength_range").on("input", _0x512bf0 => {
    const _0x303de6 = $(_0x512bf0.target).val();
    $("#ReferenceStrength").val(_0x303de6);
    $("#ReferenceStrength_range").val(_0x303de6);
    settings.ReferenceStrength = _0x303de6;
    saveSettingsDebounced();
  });
  const _0x41ce7d = "st-chatu8-不发送image标签";
  const _0x393263 = {
    scriptName: _0x41ce7d,
    findRegex: "/<image>[\\s\\S]*?<\\/image>/g",
    replaceString: "",
    trimStrings: [],
    placement: [1, 2],
    disabled: false,
    markdownOnly: false,
    promptOnly: true,
    runOnEdit: true,
    substituteRegex: 0,
    minDepth: null,
    maxDepth: null
  };
  const _0x22c47b = _0x393263;
  const _0x2a28e9 = "st-chatu8-隐藏imgthink";
  const _0x47183c = {
    scriptName: _0x2a28e9,
    findRegex: "/<imgthink>[\\s\\S]*?<\\/imgthink>/g",
    replaceString: "",
    trimStrings: [],
    placement: [2],
    disabled: false,
    markdownOnly: true,
    promptOnly: true,
    runOnEdit: true,
    substituteRegex: 0,
    minDepth: null,
    maxDepth: null
  };
  const _0x5b4abf = _0x47183c;
  async function _0x56e718(_0x313bc7) {
    if (!_0x313bc7) {
      return;
    }
    try {
      const _0x2a0443 = await import("../../../regex/engine.js");
      if (!_0x2a0443.getScriptsByType || !_0x2a0443.SCRIPT_TYPES) {
        console.warn("[Chatu8] ST 正则引擎版本过旧，无法自动管理正则脚本");
        return;
      }
      const _0x15a67d = _0x2a0443.getScriptsByType(_0x2a0443.SCRIPT_TYPES.GLOBAL) || [];
      const _0x504b62 = _0x15a67d.find(_0x50b850 => _0x50b850.scriptName === _0x41ce7d);
      const _0x1fac52 = _0x15a67d.find(_0xc6a4a9 => _0xc6a4a9.scriptName === _0x2a28e9);
      let _0x4b2a29 = false;
      const _0xf6d85f = [];
      if (!_0x504b62) {
        const _0x556500 = {
          ..._0x22c47b,
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2)
        };
        _0x15a67d.push(_0x556500);
        _0x4b2a29 = true;
        _0xf6d85f.push(_0x41ce7d);
        console.log("[Chatu8] 已创建全局正则脚本:", _0x41ce7d);
      }
      if (!_0x1fac52) {
        const _0x5614ec = {
          ..._0x5b4abf,
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2)
        };
        _0x15a67d.push(_0x5614ec);
        _0x4b2a29 = true;
        _0xf6d85f.push(_0x2a28e9);
        console.log("[Chatu8] 已创建全局正则脚本:", _0x2a28e9);
      }
      if (_0x4b2a29) {
        await _0x2a0443.saveScriptsByType(_0x15a67d, _0x2a0443.SCRIPT_TYPES.GLOBAL);
        const {
          saveSettingsDebounced: _0x39e7ea
        } = await import("../../../../../../script.js");
        _0x39e7ea();
        toastr.success("已创建全局正则：" + _0xf6d85f.join("、") + "（刷新页面或重新打开正则面板可见）");
      } else {
        toastr.info("全局正则已存在");
      }
    } catch (_0x363932) {
      console.error("[Chatu8] 创建 ST 正则脚本失败:", _0x363932);
    }
  }
  _0x2dbc2a.find("#insertOriginalText").on("change", async function () {
    const _0x844ac1 = $(this).prop("checked");
    settings.insertOriginalText = _0x844ac1.toString();
    saveSettingsDebounced();
    await _0x56e718(_0x844ac1);
  });
  _0x2dbc2a.find("#convertToJpegStorage").on("change", function () {
    const _0x1c7c90 = $(this).prop("checked");
    settings.convertToJpegStorage = _0x1c7c90.toString();
    saveSettingsDebounced();
    if (_0x1c7c90) {
      toastr.info("新图片将以JPEG格式储存，可节省约70%空间", "JPEG储存已启用");
      addLog("[缓存] JPEG储存已启用，质量: 0.78");
    } else {
      addLog("[缓存] JPEG储存已关闭");
    }
  });
  _0x2dbc2a.find("#autoLLMImageGen").on("change", async function () {
    const _0xaed789 = $(this).prop("checked");
    settings.autoLLMImageGen = _0xaed789.toString();
    saveSettingsDebounced();
    if (_0xaed789) {
      const _0x4f7292 = [];
      const _0x4f2dd9 = _0x2dbc2a.find("#insertOriginalText");
      if (_0x4f2dd9.length && !_0x4f2dd9.prop("checked")) {
        _0x4f2dd9.prop("checked", true);
        settings.insertOriginalText = "true";
        saveSettingsDebounced();
        await _0x56e718(true);
        _0x4f7292.push("已开启\"插入原文(非同层)\"");
      }
      if (extension_settings[extensionName]?.imageGenDemandEnabled) {
        extension_settings[extensionName].imageGenDemandEnabled = false;
        const _0x2228a9 = $("#ch-image-gen-demand-enabled");
        if (_0x2228a9.length) {
          _0x2228a9.prop("checked", false);
        }
        saveSettingsDebounced();
        _0x4f7292.push("已关闭\"生图需求弹窗\"");
      }
      if (_0x4f7292.length > 0) {
        toastr.info(_0x4f7292.join("，"), "自动LLM请求生图已启用");
      }
    }
  });
  $("#enable_chatu8_fab").on("change", _0xd9c95a => {
    settings.enable_chatu8_fab = $(_0xd9c95a.target).prop("checked").toString();
    saveSettingsDebounced();
    applyFabSettings();
  });
  $("#enable_chatu8_fab_video").on("change", _0x25dc2a => {
    settings.enable_chatu8_fab_video = $(_0x25dc2a.target).prop("checked");
    saveSettingsDebounced();
    _0x11c9f5();
    applyFabSettings();
  });
  function _0x11c9f5() {
    const _0xb67ddb = settings.enable_chatu8_fab_video === true;
    const _0x294df8 = $("#fab-traditional-settings");
    if (_0xb67ddb) {
      _0x294df8.hide();
    } else {
      _0x294df8.show();
    }
  }
  $("#chatu8_fab_theme").on("change", _0x4f2aab => {
    const _0x27f860 = $(_0x4f2aab.target).val();
    settings.chatu8_fab_theme = _0x27f860;
    if (_0x27f860 !== "自定义" && settings.fabThemes && settings.fabThemes[_0x27f860]) {
      const _0xcec882 = settings.fabThemes[_0x27f860];
      settings.chatu8_fab_bg_color = _0xcec882.bgColor;
      settings.chatu8_fab_icon_color = _0xcec882.iconColor;
      settings.chatu8_fab_opacity = _0xcec882.opacity;
      $("#chatu8_fab_bg_color").val(_0xcec882.bgColor);
      $("#chatu8_fab_icon_color").val(_0xcec882.iconColor);
      $("#chatu8_fab_opacity").val(_0xcec882.opacity);
      $("#chatu8_fab_opacity_value").val(_0xcec882.opacity);
    }
    saveSettingsDebounced();
    applyFabSettings();
  });
  $("#chatu8_fab_bg_color").on("change", _0x4efc6e => {
    settings.chatu8_fab_bg_color = $(_0x4efc6e.target).val();
    if (settings.chatu8_fab_theme !== "自定义") {
      settings.chatu8_fab_theme = "自定义";
      if (settings.fabThemes && settings.fabThemes.自定义) {
        settings.fabThemes.自定义.bgColor = settings.chatu8_fab_bg_color;
      }
      $("#chatu8_fab_theme").val("自定义");
    }
    saveSettingsDebounced();
    applyFabSettings();
  });
  $("#chatu8_fab_icon_color").on("change", _0x2d7d2a => {
    settings.chatu8_fab_icon_color = $(_0x2d7d2a.target).val();
    if (settings.chatu8_fab_theme !== "自定义") {
      settings.chatu8_fab_theme = "自定义";
      if (settings.fabThemes && settings.fabThemes.自定义) {
        settings.fabThemes.自定义.iconColor = settings.chatu8_fab_icon_color;
      }
      $("#chatu8_fab_theme").val("自定义");
    }
    saveSettingsDebounced();
    applyFabSettings();
  });
  $("#chatu8_fab_opacity, #chatu8_fab_opacity_value").on("input", _0x582f5f => {
    const _0x56910c = parseFloat($(_0x582f5f.target).val());
    $("#chatu8_fab_opacity").val(_0x56910c);
    $("#chatu8_fab_opacity_value").val(_0x56910c);
    settings.chatu8_fab_opacity = _0x56910c;
    if (settings.chatu8_fab_theme !== "自定义") {
      settings.chatu8_fab_theme = "自定义";
      if (settings.fabThemes && settings.fabThemes.自定义) {
        settings.fabThemes.自定义.opacity = _0x56910c;
      }
      $("#chatu8_fab_theme").val("自定义");
    }
    saveSettingsDebounced();
    applyFabSettings();
  });
  function _0x4ddd7f() {
    const _0x51f3be = document.getElementById("st-chatu8-fab");
    if (!_0x51f3be) {
      return;
    }
    const _0x1f50bc = _0x51f3be.offsetWidth;
    const _0x886f38 = _0x51f3be.offsetHeight;
    const _0x18b646 = window.innerWidth;
    const _0x26d7a5 = window.innerHeight;
    const _0x194c69 = (_0x18b646 - _0x1f50bc) / 2;
    const _0x2acab6 = (_0x26d7a5 - _0x886f38) / 2;
    _0x51f3be.style.left = _0x194c69 + "px";
    _0x51f3be.style.top = _0x2acab6 + "px";
    const _0x2c80c7 = window.innerWidth <= 768;
    if (_0x2c80c7) {
      settings.chatu8_fab_position.mobile.top = _0x51f3be.style.top;
      settings.chatu8_fab_position.mobile.left = _0x51f3be.style.left;
    } else {
      settings.chatu8_fab_position.desktop.top = _0x51f3be.style.top;
      settings.chatu8_fab_position.desktop.left = _0x51f3be.style.left;
    }
    saveSettingsDebounced();
  }
  $("#chatu8_fab_size, #chatu8_fab_size_value").on("input", _0x59bd0e => {
    const _0x554aaf = parseInt($(_0x59bd0e.target).val(), 10);
    $("#chatu8_fab_size").val(_0x554aaf);
    $("#chatu8_fab_size_value").val(_0x554aaf);
    if (typeof settings.chatu8_fab_size === "number" || typeof settings.chatu8_fab_size === "string") {
      const _0x4a2137 = typeof settings.chatu8_fab_size === "string" ? parseInt(settings.chatu8_fab_size, 10) : settings.chatu8_fab_size;
      const _0x2af9fd = {
        desktop: _0x4a2137,
        mobile: _0x4a2137
      };
      settings.chatu8_fab_size = _0x2af9fd;
    }
    const _0x2214ae = window.innerWidth <= 768;
    if (_0x2214ae) {
      settings.chatu8_fab_size.mobile = _0x554aaf;
    } else {
      settings.chatu8_fab_size.desktop = _0x554aaf;
    }
    saveSettingsDebounced();
    updateFabSize(_0x554aaf);
    setTimeout(() => {
      _0x4ddd7f();
    }, 50);
  });
  $("#chatu8_fab_reset_position").on("click", () => {
    _0x4ddd7f();
    showToast("智绘姬位置已重置到屏幕中央", "success");
  });
  _0x420734.forEach(_0x16d143 => {
    if (_0x31a7e2.includes(_0x16d143)) {
      return;
    }
    const _0x3e1439 = generationTabs.reduce((_0x22215c, _0x16892f) => {
      const _0x371c2e = getSuffix(_0x16892f);
      if (document.getElementById(_0x16d143 + _0x371c2e)) {
        _0x22215c.push("#" + _0x16d143 + _0x371c2e);
      }
      return _0x22215c;
    }, ["#" + _0x16d143]).join(", ");
    const _0x4d3a5e = $(_0x3e1439);
    if (_0x4d3a5e.length) {
      const _0x4a624c = _0x4d3a5e.prop("type");
      const _0x34cf1c = _0x4a624c === "text" || _0x4a624c === "number" || _0x4d3a5e.is("textarea") ? "input" : "change";
      _0x4d3a5e.on(_0x34cf1c, function () {
        let _0x25d0a7;
        if (_0x4a624c === "checkbox") {
          _0x25d0a7 = $(this).prop("checked").toString();
        } else {
          _0x25d0a7 = $(this).val();
        }
        if (_0x16d143 === "sdUrl" || _0x16d143 === "comfyuiUrl") {
          _0x25d0a7 = removeTrailingSlash(_0x25d0a7);
          validateUrlInput(this);
        }
        const _0x47d091 = _0x16d143;
        settings[_0x47d091] = _0x25d0a7;
        saveSettingsDebounced();
        if (_0x47d091 === "mode") {
          updateGenerationModeHandlers();
          updateKeepAliveStatus();
        }
        if (_0x47d091 === "imageAlignment") {
          const _0x1f2083 = settings.themes?.[settings.theme_id] || {};
          applyImageFrameStyle(settings.image_frame_style || "无样式", isThemeDark(_0x1f2083));
        }
        if (_0x4d3a5e.length > 1) {
          _0x4d3a5e.not(this).val(_0x25d0a7);
        }
      });
    }
  });
  _0x2dbc2a.find("#nai3CharRef").on("change", function () {
    const _0x3b178b = $(this);
    if (_0x3b178b.prop("checked")) {
      stylishConfirm("不建议使用，每多一张参考图片就多收费5点，每次生图收费一次！").then(_0x3bab8b => {
        if (_0x3bab8b) {
          settings.nai3CharRef = "true";
          if (settings.enableVibeGroupTransfer === "true") {
            settings.enableVibeGroupTransfer = "false";
            const _0xe7ba44 = _0x2dbc2a.find("#enableVibeGroupTransfer");
            if (_0xe7ba44.length) {
              _0xe7ba44.prop("checked", false);
            }
            toastr.info("Vibe Transfer 已自动关闭，因为角色参考已启用", "角色参考");
            addLog("[CharRef] Vibe Transfer disabled due to Character Reference activation");
          }
          saveSettingsDebounced();
        } else {
          _0x3b178b.prop("checked", false);
        }
      });
    } else {
      settings.nai3CharRef = "false";
      saveSettingsDebounced();
    }
  });
  _0x2dbc2a.find("#enableVibeGroupTransfer").on("change", function () {
    const _0x4400c1 = $(this).prop("checked");
    settings.enableVibeGroupTransfer = _0x4400c1 ? "true" : "false";
    if (_0x4400c1 && settings.nai3VibeTransfer === "true") {
      settings.nai3VibeTransfer = "false";
      const _0x1c4824 = _0x2dbc2a.find("#nai3VibeTransfer");
      if (_0x1c4824.length) {
        _0x1c4824.prop("checked", false);
      }
      console.log("[VibeGroup] Disabled single Vibe transfer (mutual exclusivity)");
    }
    if (_0x4400c1 && settings.nai3CharRef === "true") {
      settings.nai3CharRef = "false";
      const _0x4b9146 = _0x2dbc2a.find("#nai3CharRef");
      if (_0x4b9146.length) {
        _0x4b9146.prop("checked", false);
      }
      toastr.info("角色参考已自动关闭，因为 Vibe Transfer 已启用", "Vibe Transfer");
      addLog("[VibeTransfer] Character Reference disabled due to Vibe Transfer activation");
    }
    saveSettingsDebounced();
    console.log("[VibeGroup] Vibe group transfer:", settings.enableVibeGroupTransfer);
  });
  _0x2dbc2a.find("#nai3VibeTransfer").on("change", function () {
    const _0x4a0d59 = $(this).prop("checked");
    settings.nai3VibeTransfer = _0x4a0d59 ? "true" : "false";
    if (_0x4a0d59 && settings.enableVibeGroupTransfer === "true") {
      settings.enableVibeGroupTransfer = "false";
      const _0x41ac5e = _0x2dbc2a.find("#enableVibeGroupTransfer");
      if (_0x41ac5e.length) {
        _0x41ac5e.prop("checked", false);
      }
      console.log("[VibeGroup] Disabled Vibe group transfer (mutual exclusivity)");
    }
    saveSettingsDebounced();
    console.log("[NovelAI] Single Vibe transfer:", settings.nai3VibeTransfer);
  });
}