import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { extensionName, defaultSettings } from "./config.js";
import { createVideoPlayer, checkWebGLSupport } from "./settings/fabVideoPlayerWebGL.js";
import { initVideoController } from "./settings/fabVideoController.js";
let globalVideoPlayer = null;
let globalVideoController = null;
export function getGlobalVideoPlayer() {
  return globalVideoPlayer;
}
export function getGlobalVideoController() {
  return globalVideoController;
}
export function getSuffix(_0x464b76) {
  if (_0x464b76 === "sd") {
    return "";
  }
  return "_" + _0x464b76;
}
export function isValidUrl(_0x2d4906) {
  if (!_0x2d4906 || _0x2d4906.trim() === "") {
    return true;
  }
  const _0xcc968c = /^(https?:\/\/)?(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)*$/;
  return _0xcc968c.test(_0x2d4906);
}
export function validateUrlInput(_0x1cc5d5) {
  if (!_0x1cc5d5) {
    return;
  }
  const _0x11bbbd = _0x1cc5d5.closest(".st-chatu8-input-group");
  if (!_0x11bbbd) {
    return;
  }
  const _0x13ef98 = isValidUrl(_0x1cc5d5.value);
  _0x11bbbd.classList.toggle("invalid", !_0x13ef98);
}
export function size_change(_0x246c47) {
  if (_0x246c47 == "sd") {
    _0x246c47 = "sd_c";
  } else {
    _0x246c47 = _0x246c47 + "_";
  }
  const _0x469d1 = document.getElementById(_0x246c47 + "width");
  const _0x29efdd = document.getElementById(_0x246c47 + "height");
  const _0x4eb91c = document.getElementById(_0x246c47 + "size");
  if (_0x469d1 && _0x29efdd && _0x4eb91c) {
    const [_0x5f170c, _0x178876] = _0x4eb91c.value.split("x");
    _0x469d1.value = _0x5f170c;
    _0x29efdd.value = _0x178876;
    $(_0x469d1).trigger("input");
    $(_0x29efdd).trigger("input");
  }
}
export function stylInput(_0x2f9718, _0x185159 = "") {
  return new Promise(_0x3a5c86 => {
    const _0x500359 = document.getElementById("st-chatu8-settings") || document.body;
    const _0x180874 = document.createElement("div");
    _0x180874.className = "st-chatu8-confirm-backdrop";
    const _0x4faf2b = document.createElement("div");
    _0x4faf2b.className = "st-chatu8-confirm-box";
    const _0x481dab = document.createElement("p");
    _0x481dab.textContent = _0x2f9718;
    _0x481dab.className = "st-chatu8-confirm-message";
    _0x4faf2b.appendChild(_0x481dab);
    const _0xa1fddc = document.createElement("input");
    _0xa1fddc.className = "st-chatu8-text-input";
    _0xa1fddc.value = _0x185159;
    _0x4faf2b.appendChild(_0xa1fddc);
    const _0x53047d = document.createElement("div");
    _0x53047d.className = "st-chatu8-confirm-buttons";
    _0x4faf2b.appendChild(_0x53047d);
    const _0x493fc1 = document.createElement("button");
    _0x493fc1.textContent = "取消";
    _0x493fc1.className = "st-chatu8-btn";
    _0x53047d.appendChild(_0x493fc1);
    const _0x5ed80f = document.createElement("button");
    _0x5ed80f.textContent = "确定";
    _0x5ed80f.className = "st-chatu8-btn";
    _0x53047d.appendChild(_0x5ed80f);
    _0x180874.appendChild(_0x4faf2b);
    _0x500359.appendChild(_0x180874);
    const _0x59f0ef = _0x1fefc9 => {
      _0x500359.removeChild(_0x180874);
      _0x3a5c86(_0x1fefc9);
    };
    _0x493fc1.addEventListener("click", () => _0x59f0ef(false));
    _0x5ed80f.addEventListener("click", () => _0x59f0ef(_0xa1fddc.value));
    _0xa1fddc.focus();
  });
}
export function stylishConfirm(_0x3c8af0) {
  return new Promise(_0x3c92c8 => {
    const _0x16fa5f = document.getElementById("st-chatu8-settings") || document.body;
    const _0x24710d = document.createElement("div");
    _0x24710d.className = "st-chatu8-confirm-backdrop";
    _0x24710d.style.zIndex = "99999";
    const _0x4e2120 = document.createElement("div");
    _0x4e2120.className = "st-chatu8-confirm-box";
    const _0x4d2fdd = document.createElement("p");
    _0x4d2fdd.textContent = _0x3c8af0;
    _0x4d2fdd.className = "st-chatu8-confirm-message";
    _0x4e2120.appendChild(_0x4d2fdd);
    const _0x5c7552 = document.createElement("div");
    _0x5c7552.className = "st-chatu8-confirm-buttons";
    _0x4e2120.appendChild(_0x5c7552);
    const _0x2bc815 = document.createElement("button");
    _0x2bc815.textContent = "取消";
    _0x2bc815.className = "st-chatu8-btn";
    _0x5c7552.appendChild(_0x2bc815);
    const _0x121868 = document.createElement("button");
    _0x121868.textContent = "确定";
    _0x121868.className = "st-chatu8-btn";
    _0x5c7552.appendChild(_0x121868);
    _0x24710d.appendChild(_0x4e2120);
    _0x16fa5f.appendChild(_0x24710d);
    const _0xc8a06a = _0x2e4078 => {
      _0x16fa5f.removeChild(_0x24710d);
      _0x3c92c8(_0x2e4078);
    };
    _0x2bc815.addEventListener("click", () => _0xc8a06a(false));
    _0x121868.addEventListener("click", () => _0xc8a06a(true));
    _0x121868.focus();
  });
}
export function showSettingsPanel() {
  const _0x404936 = extension_settings[extensionName];
  const _0x940ead = $("#ch-settings-modal");
  if (!_0x940ead.length) {
    console.error("Settings panel not found!");
    return;
  }
  const _0x11e9a3 = _0x404936.lastTab || "main";
  const _0x163494 = _0x940ead.find(".st-chatu8-nav-link[data-tab=\"" + _0x11e9a3 + "\"]");
  if (_0x163494.length) {
    _0x163494.click();
  } else {
    _0x940ead.find(".st-chatu8-nav-link[data-tab=\"main\"]").click();
  }
  const _0x421529 = _0x940ead.find(".st-chatu8-modal-content");
  if (window.innerWidth <= 768) {
    const _0x5207c2 = $("#ai-config-button").outerHeight(true) || 0;
    _0x940ead.css({
      "align-items": "start"
    });
    const _0x5bce82 = document.getElementById("leftSendForm");
    const _0x17c485 = _0x5bce82 ? _0x5bce82.getBoundingClientRect().top : window.innerHeight;
    const _0x436825 = _0x17c485 - _0x5207c2 - 15;
    const _0x48dac0 = {
      "margin-top": _0x5207c2 + "px",
      height: _0x436825 + "px"
    };
    _0x421529.css(_0x48dac0);
  } else {
    _0x940ead.css({
      "align-items": ""
    });
    _0x421529.css({
      "margin-top": "",
      height: ""
    });
  }
  _0x940ead.css("display", "grid");
  _0x940ead.find(".st-chatu8-modal-content").focus();
}
export function hideSettingsPanel() {
  const _0x46b7d5 = $("#ch-settings-modal");
  _0x46b7d5.hide();
  _0x46b7d5.css({
    "align-items": "",
    "padding-top": ""
  });
  _0x46b7d5.find(".st-chatu8-modal-content").css({
    "margin-top": "",
    height: ""
  });
}
export function showToast(_0x229963, _0x23c909 = "info", _0x9831ff = 3000) {
  if (typeof toastr === "undefined") {
    console.warn("toastr is not defined, fallback to console.log");
    console.log("[" + _0x23c909 + "] " + _0x229963);
    return;
  }
  toastr.options = {
    ...toastr.options,
    timeOut: _0x9831ff,
    progressBar: true,
    preventDuplicates: true,
    newestOnTop: true
  };
  if (toastr[_0x23c909]) {
    toastr[_0x23c909](_0x229963);
  } else {
    toastr.info(_0x229963);
  }
}
export function applyFabSettings() {
  const _0x1761c8 = extension_settings[extensionName];
  const _0x288663 = $("#st-chatu8-fab");
  if (!_0x288663.length) {
    console.error("FAB element not found in DOM");
    return;
  }
  console.log("=== applyFabSettings called ===");
  console.log("enable_chatu8_fab:", _0x1761c8.enable_chatu8_fab, "Type:", typeof _0x1761c8.enable_chatu8_fab);
  console.log("enable_chatu8_fab_video:", _0x1761c8.enable_chatu8_fab_video, "Type:", typeof _0x1761c8.enable_chatu8_fab_video);
  console.log("chatu8_fab_video_paths:", _0x1761c8.chatu8_fab_video_paths);
  if (String(_0x1761c8.enable_chatu8_fab) === "true") {
    _0x288663.show();
    const _0x5a44c0 = _0x1761c8.enable_chatu8_fab_video === true || _0x1761c8.enable_chatu8_fab_video === "true";
    if (_0x5a44c0) {
      _0x288663.addClass("st-chatu8-fab-video-mode");
      _0x288663.css("background-color", "transparent");
      _0x288663.css("opacity", 1);
      _0x288663.find("i").css("display", "none");
      if (!globalVideoPlayer) {
        console.log("Creating video player...");
        console.log("WebGL support:", checkWebGLSupport());
        const _0x377e81 = _0x288663[0].querySelector("#st-chatu8-fab-video-canvas");
        if (_0x377e81) {
          _0x377e81.parentNode.removeChild(_0x377e81);
          console.log("[st-chatu8] Cleaned up stale canvas element");
        }
        if (_0x1761c8.chatu8_fab_video_paths) {
          let _0xb794cd = false;
          if (_0x1761c8.chatu8_fab_video_paths.idle && _0x1761c8.chatu8_fab_video_paths.idle.endsWith(".webm")) {
            _0x1761c8.chatu8_fab_video_paths.idle = _0x1761c8.chatu8_fab_video_paths.idle.replace(".webm", ".mp4");
            _0xb794cd = true;
            console.log("Migrated idle video path to .mp4");
          }
          if (_0x1761c8.chatu8_fab_video_paths.dragging && _0x1761c8.chatu8_fab_video_paths.dragging.endsWith(".webm")) {
            _0x1761c8.chatu8_fab_video_paths.dragging = _0x1761c8.chatu8_fab_video_paths.dragging.replace(".webm", ".mp4");
            _0xb794cd = true;
            console.log("Migrated dragging video path to .mp4");
          }
          const _0x2f852e = defaultSettings.chatu8_fab_video_paths;
          if (!_0x1761c8.chatu8_fab_video_paths.idle || _0x1761c8.chatu8_fab_video_paths.idle.trim() === "") {
            _0x1761c8.chatu8_fab_video_paths.idle = _0x2f852e.idle;
            _0xb794cd = true;
            console.log("Reset idle video path to default");
          }
          if (!_0x1761c8.chatu8_fab_video_paths.dragging || _0x1761c8.chatu8_fab_video_paths.dragging.trim() === "") {
            _0x1761c8.chatu8_fab_video_paths.dragging = _0x2f852e.dragging;
            _0xb794cd = true;
            console.log("Reset dragging video path to default");
          }
          if (_0xb794cd) {
            saveSettingsDebounced();
            console.log("Settings saved after migration");
          }
        } else {
          _0x1761c8.chatu8_fab_video_paths = JSON.parse(JSON.stringify(defaultSettings.chatu8_fab_video_paths));
          saveSettingsDebounced();
          console.log("Initialized video paths with default values");
        }
        console.log("Video paths:", _0x1761c8.chatu8_fab_video_paths);
        if (!checkWebGLSupport()) {
          console.error("WebGL not supported by browser");
          showToast("浏览器不支持 WebGL", "error");
          return;
        }
        if (!_0x1761c8.chatu8_fab_video_paths || !_0x1761c8.chatu8_fab_video_paths.idle || !_0x1761c8.chatu8_fab_video_paths.dragging) {
          console.error("Video paths not configured");
          showToast("视频路径未配置", "error");
          return;
        }
        try {
          globalVideoPlayer = createVideoPlayer(_0x288663[0], {
            idleVideoSrc: _0x1761c8.chatu8_fab_video_paths.idle,
            draggingVideoSrc: _0x1761c8.chatu8_fab_video_paths.dragging,
            onError: (_0x38ae4b, _0x5b2a78) => {
              console.error("Video load error (" + _0x38ae4b + "):", _0x5b2a78);
              const _0x54e03a = defaultSettings.chatu8_fab_video_paths;
              let _0x1ed15d = false;
              if (_0x38ae4b === "idle" && _0x1761c8.chatu8_fab_video_paths.idle !== _0x54e03a.idle) {
                console.log("Attempting to use default idle video path");
                _0x1761c8.chatu8_fab_video_paths.idle = _0x54e03a.idle;
                _0x1ed15d = true;
              }
              if (_0x38ae4b === "dragging" && _0x1761c8.chatu8_fab_video_paths.dragging !== _0x54e03a.dragging) {
                console.log("Attempting to use default dragging video path");
                _0x1761c8.chatu8_fab_video_paths.dragging = _0x54e03a.dragging;
                _0x1ed15d = true;
              }
              if (_0x1ed15d) {
                saveSettingsDebounced();
                showToast("视频路径已重置为默认值，请刷新页面", "warning");
              }
            }
          });
          globalVideoController = initVideoController(globalVideoPlayer, {
            isLoadingFn: () => {
              const _0x4e21e7 = document.getElementById("st-chatu8-fab");
              return _0x4e21e7 && _0x4e21e7.dataset.isLoading === "true";
            }
          });
          console.log("Video player created successfully");
        } catch (_0x2a188c) {
          console.error("Failed to create video player:", _0x2a188c);
          showToast("视频播放器创建失败: " + _0x2a188c.message, "error");
        }
      } else {
        console.log("Video player already exists, skipping creation");
      }
    } else {
      _0x288663.removeClass("st-chatu8-fab-video-mode");
      _0x288663.css("background-color", _0x1761c8.chatu8_fab_bg_color || "#ADD8E6");
      _0x288663.find("i").css("color", _0x1761c8.chatu8_fab_icon_color || "#FFFFFF");
      _0x288663.find("i").css("display", "");
      _0x288663.css("opacity", _0x1761c8.chatu8_fab_opacity ?? 1);
      if (globalVideoPlayer) {
        globalVideoPlayer.destroy();
        globalVideoPlayer = null;
      }
      if (globalVideoController) {
        globalVideoController.cleanup();
        globalVideoController = null;
      }
    }
    const _0x14f822 = window.innerWidth <= 768;
    const _0x52f65f = _0x14f822 ? _0x1761c8.chatu8_fab_size?.mobile ?? _0x1761c8.chatu8_fab_size ?? 40 : _0x1761c8.chatu8_fab_size?.desktop ?? _0x1761c8.chatu8_fab_size ?? 50;
    _0x288663.css("width", _0x52f65f + "px");
    _0x288663.css("height", _0x52f65f + "px");
    if (_0x5a44c0) {
      if (globalVideoPlayer) {
        globalVideoPlayer.updateSize(_0x52f65f);
      }
      _0x288663.find("i").hide();
    } else {
      _0x288663.find("i").css("font-size", Math.round(_0x52f65f * 0.48) + "px");
      _0x288663.find("i").show();
    }
    const _0x3641cf = _0x14f822 ? _0x1761c8.chatu8_fab_position.mobile || defaultSettings.chatu8_fab_position.mobile : _0x1761c8.chatu8_fab_position.desktop || defaultSettings.chatu8_fab_position.desktop;
    _0x288663.css("top", _0x3641cf.top);
    _0x288663.css("left", _0x3641cf.left);
  } else {
    _0x288663.hide();
    if (globalVideoPlayer) {
      globalVideoPlayer.pause();
    }
  }
}
export function updateFabSize(_0x4e80fd) {
  console.log("[updateFabSize] Called with size:", _0x4e80fd);
  const _0x1f33d4 = extension_settings[extensionName];
  const _0x2809f1 = $("#st-chatu8-fab");
  if (!_0x2809f1.length) {
    console.error("[updateFabSize] FAB element not found!");
    return;
  }
  const _0x4aa300 = _0x1f33d4.enable_chatu8_fab_video === true || _0x1f33d4.enable_chatu8_fab_video === "true";
  console.log("[updateFabSize] Video mode enabled:", _0x4aa300);
  console.log("[updateFabSize] Global video player exists:", !!globalVideoPlayer);
  const _0x2d41ac = _0x2809f1[0].style.transition;
  _0x2809f1[0].style.transition = "none";
  _0x2809f1.css("width", _0x4e80fd + "px");
  _0x2809f1.css("height", _0x4e80fd + "px");
  _0x2809f1[0].offsetWidth;
  console.log("[updateFabSize] FAB container size set to:", _0x2809f1[0].offsetWidth, "x", _0x2809f1[0].offsetHeight);
  if (_0x4aa300) {
    if (globalVideoPlayer) {
      console.log("[updateFabSize] Calling videoPlayer.updateSize...");
      globalVideoPlayer.updateSize(_0x4e80fd);
    } else {
      console.warn("[updateFabSize] Video player not initialized!");
    }
    _0x2809f1.find("i").hide();
  } else {
    const _0x29e39a = Math.round(_0x4e80fd * 0.48);
    console.log("[updateFabSize] Icon mode, setting icon size to:", _0x29e39a);
    _0x2809f1.find("i").css("font-size", _0x29e39a + "px");
    _0x2809f1.find("i").show();
  }
  requestAnimationFrame(() => {
    _0x2809f1[0].style.transition = _0x2d41ac;
  });
  console.log("[updateFabSize] Completed");
}