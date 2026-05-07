import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { showSettingsPanel, applyFabSettings, getGlobalVideoPlayer, getGlobalVideoController } from "../ui_common.js";
import { createVideoPlayer, checkWebGLSupport } from "./fabVideoPlayerWebGL.js";
import { initVideoController } from "./fabVideoController.js";
export function initFab() {
  let _0x1a0c70 = document.getElementById("st-chatu8-fab");
  if (!_0x1a0c70) {
    return;
  }
  let _0x4d92df = false;
  let _0x42c4ae = false;
  let _0x48a9c3;
  let _0x363ba9;
  let _0xf16ba = null;
  let _0x30f11c = false;
  let _0x5bb51a = 0;
  let _0x220e74 = 0;
  let _0x19d06b = null;
  let _0xa2b0ea = null;
  const _0x24ed99 = _0x4ed1a0 => {
    const _0x2b69ef = _0x4ed1a0.type === "touchstart" ? _0x4ed1a0.touches[0].clientX : _0x4ed1a0.clientX;
    const _0x558b54 = _0x4ed1a0.type === "touchstart" ? _0x4ed1a0.touches[0].clientY : _0x4ed1a0.clientY;
    const _0xf333e4 = getGlobalVideoPlayer();
    if (_0xf333e4) {
      const _0x47ae42 = _0xf333e4.hitTest(_0x2b69ef, _0x558b54);
      if (!_0x47ae42) {
        return;
      }
    }
    const _0x1aec71 = _0x1a0c70.getBoundingClientRect();
    _0x4d92df = true;
    _0x42c4ae = false;
    _0x30f11c = false;
    _0x1a0c70.style.cursor = "grabbing";
    _0x1a0c70.classList.add("st-chatu8-fab-dragging");
    _0x5bb51a = _0x2b69ef;
    _0x220e74 = _0x558b54;
    _0x48a9c3 = _0x2b69ef - _0x1aec71.left;
    _0x363ba9 = _0x558b54 - _0x1aec71.top;
    _0xf16ba = setTimeout(() => {
      if (!_0x42c4ae) {
        _0x30f11c = true;
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        const _0x25f5a6 = document.getElementById("st-chatu8-ai-trigger");
        if (_0x25f5a6) {
          _0x25f5a6.click();
        } else {
          const _0x12d927 = document.getElementById("st-chatu8-ai-dialog");
          if (_0x12d927 && !_0x12d927.classList.contains("active")) {
            const _0x440d5d = _0x12d927.offsetWidth;
            const _0x25434b = _0x12d927.offsetHeight;
            const _0x5f0305 = window.innerWidth;
            const _0x49923e = window.innerHeight;
            const _0x38ab0d = (_0x5f0305 - _0x440d5d) / 2;
            const _0x25605e = (_0x49923e - _0x25434b) / 2;
            _0x12d927.style.left = Math.max(0, _0x38ab0d) + "px";
            _0x12d927.style.top = Math.max(0, _0x25605e) + "px";
            _0x12d927.classList.add("active");
            setTimeout(() => {
              const _0x157be5 = document.getElementById("st-chatu8-ai-input");
              if (_0x157be5) {
                _0x157be5.focus();
              }
            }, 300);
          }
        }
      }
    }, 500);
    document.addEventListener("mousemove", _0x46f6f2);
    document.addEventListener("touchmove", _0x46f6f2, {
      passive: false
    });
    document.addEventListener("mouseup", _0x2e8483);
    document.addEventListener("touchend", _0x2e8483);
  };
  const _0x46f6f2 = _0x326cee => {
    if (!_0x4d92df) {
      return;
    }
    if (_0x326cee.type === "touchmove") {
      _0x326cee.preventDefault();
    }
    const _0x3f0c90 = _0x326cee.type === "touchmove" ? _0x326cee.touches[0].clientX : _0x326cee.clientX;
    const _0x50ea3a = _0x326cee.type === "touchmove" ? _0x326cee.touches[0].clientY : _0x326cee.clientY;
    if (!_0x42c4ae) {
      const _0x387a45 = Math.sqrt(Math.pow(_0x3f0c90 - _0x5bb51a, 2) + Math.pow(_0x50ea3a - _0x220e74, 2));
      if (_0x387a45 > 5) {
        _0x42c4ae = true;
        if (_0xf16ba) {
          clearTimeout(_0xf16ba);
          _0xf16ba = null;
        }
        const _0x4088cd = getGlobalVideoController();
        if (_0x4088cd) {
          _0x4088cd.onDragStart();
        }
      }
    }
    if (_0x42c4ae) {
      let _0x53c612 = _0x3f0c90 - _0x48a9c3;
      let _0x10e3da = _0x50ea3a - _0x363ba9;
      const _0x4049c9 = _0x1a0c70.offsetWidth;
      const _0x45ebd6 = _0x1a0c70.offsetHeight;
      const _0x414927 = window.innerWidth;
      const _0x4fe362 = window.innerHeight;
      const _0x38ab3a = 20;
      const _0x242edd = _0x414927 - _0x38ab3a;
      const _0x4f70cf = _0x4fe362 - _0x38ab3a;
      const _0x44413f = -(_0x4049c9 - _0x38ab3a);
      const _0x7716d0 = -(_0x45ebd6 - _0x38ab3a);
      if (_0x53c612 < _0x44413f) {
        _0x53c612 = _0x44413f;
      }
      if (_0x10e3da < _0x7716d0) {
        _0x10e3da = _0x7716d0;
      }
      if (_0x53c612 > _0x242edd) {
        _0x53c612 = _0x242edd;
      }
      if (_0x10e3da > _0x4f70cf) {
        _0x10e3da = _0x4f70cf;
      }
      const _0x4595c8 = {
        left: _0x53c612,
        top: _0x10e3da
      };
      _0xa2b0ea = _0x4595c8;
      if (!_0x19d06b) {
        _0x19d06b = requestAnimationFrame(_0x174d01);
      }
    }
  };
  const _0x174d01 = () => {
    if (_0xa2b0ea) {
      _0x1a0c70.style.left = _0xa2b0ea.left + "px";
      _0x1a0c70.style.top = _0xa2b0ea.top + "px";
      _0xa2b0ea = null;
    }
    _0x19d06b = null;
  };
  const _0x2e8483 = () => {
    if (_0xf16ba) {
      clearTimeout(_0xf16ba);
      _0xf16ba = null;
    }
    if (_0x19d06b) {
      cancelAnimationFrame(_0x19d06b);
      _0x19d06b = null;
    }
    if (_0xa2b0ea) {
      _0x1a0c70.style.left = _0xa2b0ea.left + "px";
      _0x1a0c70.style.top = _0xa2b0ea.top + "px";
      _0xa2b0ea = null;
    }
    if (!_0x4d92df) {
      return;
    }
    _0x4d92df = false;
    _0x1a0c70.style.cursor = "grab";
    _0x1a0c70.classList.remove("st-chatu8-fab-dragging");
    const _0x31a9bb = getGlobalVideoController();
    if (_0x31a9bb && _0x42c4ae) {
      _0x31a9bb.onDragEnd();
    }
    if (_0x42c4ae) {
      const _0xdf8355 = extension_settings[extensionName];
      const _0x89148d = window.innerWidth <= 768;
      if (_0x89148d) {
        _0xdf8355.chatu8_fab_position.mobile.top = _0x1a0c70.style.top;
        _0xdf8355.chatu8_fab_position.mobile.left = _0x1a0c70.style.left;
      } else {
        _0xdf8355.chatu8_fab_position.desktop.top = _0x1a0c70.style.top;
        _0xdf8355.chatu8_fab_position.desktop.left = _0x1a0c70.style.left;
      }
      saveSettingsDebounced();
    }
    document.removeEventListener("mousemove", _0x46f6f2);
    document.removeEventListener("touchmove", _0x46f6f2);
    document.removeEventListener("mouseup", _0x2e8483);
    document.removeEventListener("touchend", _0x2e8483);
  };
  _0x1a0c70.addEventListener("mousedown", _0x24ed99);
  _0x1a0c70.addEventListener("touchstart", _0x24ed99, {
    passive: false
  });
  _0x1a0c70.addEventListener("click", _0x2d3b2b => {
    const _0x245c8d = getGlobalVideoPlayer();
    if (_0x245c8d) {
      const _0x14eb34 = _0x2d3b2b.clientX;
      const _0x3e4304 = _0x2d3b2b.clientY;
      const _0x41294b = _0x245c8d.hitTest(_0x14eb34, _0x3e4304);
      if (!_0x41294b) {
        return;
      }
      if (!_0x42c4ae && !_0x30f11c) {
        const _0x5f2d3a = _0x1a0c70.getBoundingClientRect();
        const _0x43fab5 = _0x3e4304 - _0x5f2d3a.top;
        const _0x33535b = _0x5f2d3a.height / 3;
        if (_0x43fab5 <= _0x33535b) {
          if (_0x245c8d.playHeadPatVideo) {
            _0x245c8d.playHeadPatVideo();
            return;
          }
        }
      }
    }
    if (!_0x42c4ae && !_0x30f11c) {
      if (window.showChatuSettingsPanel) {
        window.showChatuSettingsPanel();
      } else {
        showSettingsPanel();
      }
    }
  });
  let _0x39c96a = null;
  let _0x5c237c = 0;
  let _0xb6cd24 = 0;
  _0x1a0c70.addEventListener("mousemove", _0x3abb51 => {
    const _0x26f1eb = getGlobalVideoPlayer();
    if (_0x4d92df || !_0x26f1eb) {
      return;
    }
    _0x5c237c = _0x3abb51.clientX;
    _0xb6cd24 = _0x3abb51.clientY;
    if (!_0x39c96a) {
      _0x39c96a = requestAnimationFrame(() => {
        _0x1a0c70.style.cursor = _0x26f1eb.hitTest(_0x5c237c, _0xb6cd24) ? "grab" : "default";
        _0x39c96a = null;
      });
    }
  });
  applyFabSettings();
  let _0x166e27 = null;
  let _0x32a234 = window.innerWidth <= 768;
  window.addEventListener("resize", () => {
    if (String(extension_settings[extensionName].enable_chatu8_fab) === "true") {
      const _0x2a1e0f = _0x1a0c70.getBoundingClientRect();
      const _0x195a22 = window.innerWidth;
      const _0x1f6684 = window.innerHeight;
      const _0x412be7 = _0x195a22 <= 768;
      let _0x28ab41 = _0x2a1e0f.left;
      let _0x55c8d6 = _0x2a1e0f.top;
      const _0x3b5cdd = 20;
      const _0x12aad6 = _0x195a22 - _0x3b5cdd;
      const _0x120952 = _0x1f6684 - _0x3b5cdd;
      const _0x485df3 = -(_0x2a1e0f.width - _0x3b5cdd);
      const _0x5258cd = -(_0x2a1e0f.height - _0x3b5cdd);
      if (_0x28ab41 > _0x12aad6) {
        _0x28ab41 = _0x12aad6;
      }
      if (_0x55c8d6 > _0x120952) {
        _0x55c8d6 = _0x120952;
      }
      if (_0x28ab41 < _0x485df3) {
        _0x28ab41 = _0x485df3;
      }
      if (_0x55c8d6 < _0x5258cd) {
        _0x55c8d6 = _0x5258cd;
      }
      _0x1a0c70.style.left = _0x28ab41 + "px";
      _0x1a0c70.style.top = _0x55c8d6 + "px";
      if (_0x412be7 !== _0x32a234) {
        _0x32a234 = _0x412be7;
        clearTimeout(_0x166e27);
        _0x166e27 = setTimeout(() => {
          applyFabSettings();
          const _0x73e0ad = document.getElementById("st-chatu8-settings-panel");
          if (_0x73e0ad && _0x73e0ad.classList.contains("active")) {
            const _0x19a784 = extension_settings[extensionName];
            if (typeof _0x19a784.chatu8_fab_size === "object") {
              const _0x28f348 = _0x412be7 ? _0x19a784.chatu8_fab_size.mobile ?? 40 : _0x19a784.chatu8_fab_size.desktop ?? 50;
              const _0x1431f9 = document.getElementById("chatu8_fab_size");
              const _0x43bc15 = document.getElementById("chatu8_fab_size_value");
              if (_0x1431f9) {
                _0x1431f9.value = _0x28f348;
              }
              if (_0x43bc15) {
                _0x43bc15.value = _0x28f348;
              }
              const _0x17e69f = getGlobalVideoPlayer();
              if (_0x17e69f) {
                _0x17e69f.updateSize(_0x28f348);
              }
            }
          }
        }, 300);
      }
    }
  });
  window.cleanupFabVideo = () => {
    const _0x41619b = getGlobalVideoController();
    const _0x243395 = getGlobalVideoPlayer();
    if (_0x41619b) {
      _0x41619b.cleanup();
    }
    if (_0x243395) {
      _0x243395.destroy();
    }
  };
}
export function startFabLoading() {
  const _0x1afac3 = document.getElementById("st-chatu8-fab");
  if (!_0x1afac3) {
    return;
  }
  _0x1afac3.dataset.isLoading = "true";
  const _0x31c7e3 = getGlobalVideoPlayer();
  if (_0x31c7e3 && _0x31c7e3.playThinkingVideo) {
    _0x31c7e3.playThinkingVideo();
  } else {
    _0x1afac3.classList.add("st-chatu8-fab-loading");
  }
}
export function stopFabLoading() {
  const _0x3dcfc7 = document.getElementById("st-chatu8-fab");
  if (!_0x3dcfc7) {
    return;
  }
  _0x3dcfc7.dataset.isLoading = "false";
  const _0xa3ff03 = getGlobalVideoPlayer();
  if (_0xa3ff03 && _0xa3ff03.stopThinkingVideo) {
    _0xa3ff03.stopThinkingVideo();
  } else {
    _0x3dcfc7.classList.remove("st-chatu8-fab-loading");
  }
}