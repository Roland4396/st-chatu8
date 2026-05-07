import { extension_settings, extensionTypes } from "../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types, reloadCurrentChat, saveChatConditional, chat, messageFormatting, saveChat } from "../../../../script.js";
import { defaultSettings, extensionName, extensionFolderPath } from "./utils/config.js";
import { replaceWithSd } from "./utils/sd.js";
import { replaceWithnovelai } from "./utils/novelai.js";
import { initUI } from "./utils/ui.js";
import { replaceWithBanana } from "./utils/banana.js";
import { checkSendBuClass } from "./utils/utils.js";
import { replaceWithcomfyui } from "./utils/comfyui.js";
import { initializeNewlineFixer } from "./utils/newline_fix.js";
import "./utils/settings/stream_generate.js";
import { installGlobalErrorHandler } from "./utils/errorCollector.js";
let token;
try {
  const tokenResponse = await fetch("/csrf-token");
  const data = await tokenResponse.json();
  token = data.token;
  window.token = token;
} catch (_0x2cae46) {
  console.error("Initialization failed", _0x2cae46);
  throw new Error("Initialization failed");
}
function loadJSZip() {
  return new Promise((_0x53362c, _0x47244a) => {
    const _0x21ee25 = document.createElement("script");
    _0x21ee25.src = extensionFolderPath + "/jszip.min.js";
    _0x21ee25.onload = () => _0x53362c();
    _0x21ee25.onerror = _0x312283 => _0x47244a(_0x312283);
    document.head.appendChild(_0x21ee25);
  });
}
function loadcrypto() {
  return new Promise((_0x44e16d, _0x5d52c1) => {
    const _0x8dc5b2 = document.createElement("script");
    _0x8dc5b2.src = extensionFolderPath + "/crypto-js.min.js";
    _0x8dc5b2.onload = () => _0x44e16d();
    _0x8dc5b2.onerror = _0x2ffa00 => _0x5d52c1(_0x2ffa00);
    document.head.appendChild(_0x8dc5b2);
  });
}
function loadmsgpack() {
  return new Promise((_0x325cd2, _0x52e2d7) => {
    const _0x163c78 = document.createElement("script");
    _0x163c78.src = extensionFolderPath + "/msgpack.min.js";
    _0x163c78.onload = () => _0x325cd2();
    _0x163c78.onerror = _0x1b8279 => _0x52e2d7(_0x1b8279);
    document.head.appendChild(_0x163c78);
  });
}
function getRequestHeaders(_0x20e0aa) {
  const _0x1b1b1a = {
    "X-CSRF-Token": _0x20e0aa,
    "Content-Type": "application/json"
  };
  return _0x1b1b1a;
}
function getExtensionType(_0x5e14d7) {
  const _0x4b0192 = Object.keys(extensionTypes).find(_0x249c16 => _0x249c16 === _0x5e14d7 || _0x249c16.startsWith("third-party") && _0x249c16.endsWith(_0x5e14d7));
  if (_0x4b0192) {
    return extensionTypes[_0x4b0192];
  } else {
    return "local";
  }
}
async function update_extension(_0x4e7f6d, _0x3d070b) {
  const _0x15638f = {
    extensionName: _0x4e7f6d,
    global: _0x3d070b
  };
  const _0x279461 = await fetch("/api/extensions/update", {
    method: "POST",
    headers: getRequestHeaders(token),
    body: JSON.stringify(_0x15638f)
  });
  return _0x279461;
}
async function check_update() {
  const _0x1b6743 = getExtensionType(extensionName) === "global" ? true : false;
  const _0x2ece99 = () => {
    toastr.success("成功更新插件");
    console.log("成功更新插件");
    setTimeout(() => location.reload(), 4000);
  };
  const _0x2df46b = await update_extension(extensionName, _0x1b6743);
  if (_0x2df46b.ok) {
    if ((await _0x2df46b.json()).isUpToDate) {
      toastr.success("插件是最新版本");
      console.log("插件是最新版本");
    } else {
      _0x2ece99();
    }
    return true;
  }
}
async function chenk() {
  if (extension_settings[extensionName].scriptEnabled != true && extension_settings[extensionName].scriptEnabled != "true" || checkSendBuClass()) {
    return;
  }
  replaceWithcomfyui();
  replaceWithBanana();
  replaceWithBanana();
  replaceWithnovelai();
  replaceWithSd();
}
await loadJSZip().then(() => {
  console.log("Initializing..JSZip.");
});
await loadcrypto().then(() => {
  console.log("Initializing..CryptoJS.");
});
await loadmsgpack().then(() => {
  console.log("Initializing..msgpack.");
});
let ster = "";
window.imagesid = "";
window.xiancheng = true;
let settings;
async function checkForUpdates() {
  try {
    const _0x40767e = await fetch(extensionFolderPath + "/manifest.json?t=" + new Date().getTime(), {
      cache: "no-cache"
    });
    if (_0x40767e.ok) {
      const _0x20f8f8 = await _0x40767e.json();
      const _0x4b9ff6 = _0x20f8f8.version;
      window.chatu8LocalVersion = _0x4b9ff6;
    } else {
      console.error("Failed to fetch local manifest for version check.");
    }
  } catch (_0x2c7b82) {
    console.error("Error fetching local manifest:", _0x2c7b82);
  }
  const _0xe6f49c = document.getElementById("ch-update-notes");
  console.log("Checking for updates...111111111111111111111111111111111111111", _0xe6f49c);
  try {
    const _0x185221 = "https://raw.githubusercontent.com/damoshen123/st-chatu8/master/manifest.json?t=" + new Date().getTime();
    const _0x3c44de = await fetch(_0x185221, {
      cache: "no-cache"
    });
    if (!_0x3c44de.ok) {
      console.error("Failed to fetch remote manifest for update check.");
      if (_0xe6f49c) {
        _0xe6f49c.value = "无法获取最新更新，尝试点击更新按钮，检查更新。";
      }
      window.chatu8UpdateAvailable = false;
      return;
    }
    const _0x245068 = await _0x3c44de.json();
    const _0x4c75f6 = _0x245068.version;
    window.chatu8RemoteVersion = _0x4c75f6;
    if (_0xe6f49c && _0x245068.updata) {
      _0xe6f49c.value = _0x245068.updata;
    }
    if (window.chatu8LocalVersion) {
      if (_0x4c75f6.localeCompare(window.chatu8LocalVersion, undefined, {
        numeric: true,
        sensitivity: "base"
      }) > 0) {
        console.log("New version available: " + _0x4c75f6 + " (current: " + window.chatu8LocalVersion + ")");
        window.chatu8UpdateAvailable = true;
      } else {
        console.log("Extension is up to date.");
        window.chatu8UpdateAvailable = false;
      }
    } else {
      window.chatu8UpdateAvailable = false;
    }
  } catch (_0x9ad875) {
    console.error("Error checking for updates:", _0x9ad875);
    if (_0xe6f49c) {
      _0xe6f49c.value = "无法获取最新更新，尝试点击更新按钮，检查更新。";
    }
    window.chatu8UpdateAvailable = false;
  }
}
main();
function loadCSS(_0x33b487) {
  const _0x72454b = document.createElement("link");
  _0x72454b.rel = "stylesheet";
  _0x72454b.href = extensionFolderPath + "/" + _0x33b487 + "?t=" + new Date().getTime();
  document.head.appendChild(_0x72454b);
}
async function main() {
  const _0x45f331 = ["styles/main.css", "styles/about.css", "styles/forms.css", "styles/cache.css", "styles/image_cache.css", "styles/modals.css", "styles/fab.css", "styles/responsive.css", "styles/click-trigger.css", "styles/ai-assistant.css"];
  _0x45f331.forEach(loadCSS);
  console.log("Initializing chatu extension.");
  const _0x5e120c = {
    ...JSON.parse(JSON.stringify(defaultSettings)),
    ...extension_settings[extensionName]
  };
  if (_0x5e120c.chatu8_fab_video_paths) {
    let _0xad4dbf = false;
    if (_0x5e120c.chatu8_fab_video_paths.idle && _0x5e120c.chatu8_fab_video_paths.idle.includes(".mp4")) {
      _0x5e120c.chatu8_fab_video_paths.idle = _0x5e120c.chatu8_fab_video_paths.idle.replace("静息画面.mp4", "idle.chatu8").replace(/\.mp4$/, ".chatu8");
      _0xad4dbf = true;
    }
    if (_0x5e120c.chatu8_fab_video_paths.dragging && _0x5e120c.chatu8_fab_video_paths.dragging.includes(".mp4")) {
      _0x5e120c.chatu8_fab_video_paths.dragging = _0x5e120c.chatu8_fab_video_paths.dragging.replace("拖动.mp4", "dragging.chatu8").replace(/\.mp4$/, ".chatu8");
      _0xad4dbf = true;
    }
    if (_0xad4dbf) {
      console.log("[st-chatu8] 自动迁移旧版视频配置路径 -> .chatu8");
    }
  }
  extension_settings[extensionName] = _0x5e120c;
  console.log("Initializing chatu extension.", extension_settings[extensionName]);
  installGlobalErrorHandler();
  const _0x298d04 = {
    check_update: check_update
  };
  await initUI(_0x298d04);
  initializeNewlineFixer();
  setTimeout(addNewElement, 2000);
  await chenk();
  await checkForUpdates();
}
function addNewElement() {
  const _0x2f7edf = document.querySelector("#option_toggle_AN");
  if (_0x2f7edf) {
    if (!document.getElementById("option_toggle_AN88")) {
      const _0x315f57 = document.createElement("a");
      _0x315f57.id = "option_toggle_AN88";
      const _0x9cbcae = document.createElement("i");
      _0x9cbcae.className = "fa-lg fa-solid fa-note-sticky";
      _0x315f57.appendChild(_0x9cbcae);
      const _0x14ef17 = document.createElement("span");
      _0x14ef17.setAttribute("data-i18n", "打开设置");
      _0x14ef17.textContent = "打开文生图设置";
      _0x315f57.appendChild(_0x14ef17);
      _0x2f7edf.parentNode.insertBefore(_0x315f57, _0x2f7edf.nextSibling);
      console.log("chatu settings button added.");
      document.getElementById("option_toggle_AN88").addEventListener("click", window.showChatuSettingsPanel);
    }
  }
}
