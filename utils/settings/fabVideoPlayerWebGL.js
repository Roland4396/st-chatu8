async function loadVideoAsBlobUrl(_0x3565e9) {
  try {
    const _0x126824 = await fetch(_0x3565e9);
    if (!_0x126824.ok) {
      throw new Error("HTTP error! status: " + _0x126824.status);
    }
    const _0xdb6e67 = await _0x126824.blob();
    if (_0xdb6e67.type !== "video/mp4") {
      return URL.createObjectURL(new Blob([_0xdb6e67], {
        type: "video/mp4"
      }));
    }
    return URL.createObjectURL(_0xdb6e67);
  } catch (_0x53583f) {
    console.warn("[st-chatu8] 无法加载 " + _0x3565e9 + "，尝试回退...", _0x53583f);
    let _0x4ceecb = _0x3565e9;
    if (_0x3565e9.includes("idle.chatu8")) {
      _0x4ceecb = _0x3565e9.replace("idle.chatu8", "静息画面.mp4");
    } else if (_0x3565e9.includes("dragging.chatu8")) {
      _0x4ceecb = _0x3565e9.replace("dragging.chatu8", "拖动.mp4");
    } else if (_0x3565e9.includes("headpat.chatu8")) {
      _0x4ceecb = _0x3565e9.replace("headpat.chatu8", "摸头.mp4");
    } else if (_0x3565e9.includes("thinking.chatu8")) {
      _0x4ceecb = _0x3565e9.replace("thinking.chatu8", "思考.mp4");
    } else if (_0x3565e9.includes(".chatu8")) {
      _0x4ceecb = _0x3565e9.replace(".chatu8", ".mp4");
    }
    if (_0x4ceecb !== _0x3565e9) {
      try {
        const _0x56dfc1 = await fetch(_0x4ceecb);
        if (!_0x56dfc1.ok) {
          throw new Error("HTTP error! status: " + _0x56dfc1.status);
        }
        const _0x17537d = await _0x56dfc1.blob();
        return URL.createObjectURL(new Blob([_0x17537d], {
          type: "video/mp4"
        }));
      } catch (_0x589f6a) {
        console.error("[st-chatu8] 回退加载也失败: " + _0x4ceecb, _0x589f6a);
        throw _0x589f6a;
      }
    }
    throw _0x53583f;
  }
}
function createHiddenVideo(_0x48ceec, _0x3e5d98) {
  const _0x2c3fa7 = document.getElementById(_0x3e5d98);
  if (_0x2c3fa7) {
    _0x2c3fa7.pause();
    if (_0x2c3fa7.src && _0x2c3fa7.src.startsWith("blob:")) {
      URL.revokeObjectURL(_0x2c3fa7.src);
    }
    _0x2c3fa7.src = "";
    _0x2c3fa7.removeAttribute("src");
    _0x2c3fa7.parentNode?.removeChild(_0x2c3fa7);
    console.log("[st-chatu8] Cleaned up stale video element: " + _0x3e5d98);
  }
  const _0x41cb79 = document.createElement("video");
  _0x41cb79.id = _0x3e5d98;
  _0x41cb79.style.display = "none";
  _0x41cb79.loop = false;
  _0x41cb79.muted = true;
  _0x41cb79.autoplay = false;
  _0x41cb79.playsInline = true;
  _0x41cb79.preload = "auto";
  _0x41cb79.dataset.originalSrc = _0x48ceec;
  const _0x4f0e11 = _0x48ceec.split("/");
  const _0x5b0558 = _0x4f0e11.map((_0x5bda23, _0x35d325) => {
    if (_0x35d325 === _0x4f0e11.length - 1) {
      return encodeURIComponent(_0x5bda23);
    }
    return _0x5bda23;
  }).join("/");
  loadVideoAsBlobUrl(_0x5b0558).then(_0xf5dd75 => {
    _0x41cb79.src = _0xf5dd75;
  }).catch(_0x3377cf => {
    console.error("[st-chatu8] Failed to load video as Blob: " + _0x48ceec, _0x3377cf);
    _0x41cb79.dispatchEvent(new Event("error"));
  });
  document.body.appendChild(_0x41cb79);
  return _0x41cb79;
}
function createShader(_0x249306, _0x24a6ae, _0x58a9a3) {
  const _0x262cdd = _0x249306.createShader(_0x24a6ae);
  _0x249306.shaderSource(_0x262cdd, _0x58a9a3);
  _0x249306.compileShader(_0x262cdd);
  if (!_0x249306.getShaderParameter(_0x262cdd, _0x249306.COMPILE_STATUS)) {
    console.error("Shader compilation error:", _0x249306.getShaderInfoLog(_0x262cdd));
    _0x249306.deleteShader(_0x262cdd);
    return null;
  }
  return _0x262cdd;
}
function createProgram(_0x3017aa, _0x45907f, _0x1130df) {
  const _0x1a5d03 = createShader(_0x3017aa, _0x3017aa.VERTEX_SHADER, _0x45907f);
  const _0x42c200 = createShader(_0x3017aa, _0x3017aa.FRAGMENT_SHADER, _0x1130df);
  if (!_0x1a5d03 || !_0x42c200) {
    return null;
  }
  const _0x36eba = _0x3017aa.createProgram();
  _0x3017aa.attachShader(_0x36eba, _0x1a5d03);
  _0x3017aa.attachShader(_0x36eba, _0x42c200);
  _0x3017aa.linkProgram(_0x36eba);
  if (!_0x3017aa.getProgramParameter(_0x36eba, _0x3017aa.LINK_STATUS)) {
    console.error("Program linking error:", _0x3017aa.getProgramInfoLog(_0x36eba));
    _0x3017aa.deleteProgram(_0x36eba);
    return null;
  }
  return _0x36eba;
}
function initWebGL(_0x3e6275) {
  const _0x962519 = _0x3e6275.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true
  });
  if (!_0x962519) {
    console.error("WebGL not supported");
    return null;
  }
  const _0x245c29 = "\n        attribute vec2 a_position;\n        attribute vec2 a_texCoord;\n        varying vec2 v_texCoord;\n        \n        void main() {\n            gl_Position = vec4(a_position, 0.0, 1.0);\n            v_texCoord = a_texCoord;\n        }\n    ";
  const _0x42fe25 = "\n        precision mediump float;\n        uniform sampler2D u_frame;\n        varying vec2 v_texCoord;\n        \n        void main() {\n            // 上半部分（0.0 - 0.5）为颜色\n            vec2 colorCoord = vec2(v_texCoord.x, v_texCoord.y * 0.5);\n            // 下半部分（0.5 - 1.0）为 alpha\n            vec2 alphaCoord = vec2(v_texCoord.x, 0.5 + v_texCoord.y * 0.5);\n            \n            vec4 color = texture2D(u_frame, colorCoord);\n            float alpha = texture2D(u_frame, alphaCoord).r;\n            \n            gl_FragColor = vec4(color.rgb, alpha);\n        }\n    ";
  const _0x2b8e94 = createProgram(_0x962519, _0x245c29, _0x42fe25);
  if (!_0x2b8e94) {
    return null;
  }
  _0x962519.useProgram(_0x2b8e94);
  const _0x9c79dd = _0x962519.createBuffer();
  _0x962519.bindBuffer(_0x962519.ARRAY_BUFFER, _0x9c79dd);
  _0x962519.bufferData(_0x962519.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0]), _0x962519.STATIC_DRAW);
  const _0xfde12 = _0x962519.getAttribLocation(_0x2b8e94, "a_position");
  _0x962519.enableVertexAttribArray(_0xfde12);
  _0x962519.vertexAttribPointer(_0xfde12, 2, _0x962519.FLOAT, false, 16, 0);
  const _0x4b8a7d = _0x962519.getAttribLocation(_0x2b8e94, "a_texCoord");
  _0x962519.enableVertexAttribArray(_0x4b8a7d);
  _0x962519.vertexAttribPointer(_0x4b8a7d, 2, _0x962519.FLOAT, false, 16, 8);
  const _0xfa5ae6 = _0x962519.createTexture();
  _0x962519.bindTexture(_0x962519.TEXTURE_2D, _0xfa5ae6);
  _0x962519.texParameteri(_0x962519.TEXTURE_2D, _0x962519.TEXTURE_WRAP_S, _0x962519.CLAMP_TO_EDGE);
  _0x962519.texParameteri(_0x962519.TEXTURE_2D, _0x962519.TEXTURE_WRAP_T, _0x962519.CLAMP_TO_EDGE);
  _0x962519.texParameteri(_0x962519.TEXTURE_2D, _0x962519.TEXTURE_MIN_FILTER, _0x962519.LINEAR);
  _0x962519.texParameteri(_0x962519.TEXTURE_2D, _0x962519.TEXTURE_MAG_FILTER, _0x962519.LINEAR);
  _0x962519.enable(_0x962519.BLEND);
  _0x962519.blendFunc(_0x962519.SRC_ALPHA, _0x962519.ONE_MINUS_SRC_ALPHA);
  const _0x51b0b6 = {
    gl: _0x962519,
    program: _0x2b8e94,
    texture: _0xfa5ae6
  };
  return _0x51b0b6;
}
export function createVideoPlayer(_0x42169e, _0x2a6317) {
  const {
    idleVideoSrc: _0x456bbd,
    draggingVideoSrc: _0xfe5cd9,
    onError: _0x17e693
  } = _0x2a6317;
  const _0x4d23af = createHiddenVideo(_0x456bbd, "st-chatu8-fab-video-idle");
  const _0x5da64a = createHiddenVideo(_0xfe5cd9, "st-chatu8-fab-video-dragging");
  const _0x286722 = createHiddenVideo(_0x456bbd, "st-chatu8-fab-video-idle-clone");
  const _0x49a8c6 = createHiddenVideo(_0xfe5cd9, "st-chatu8-fab-video-dragging-clone");
  const _0x5e4608 = _0x456bbd.replace(/[^/]+\.(mp4|chatu8)$/, "headpat.chatu8");
  const _0x52091d = _0x456bbd.replace(/[^/]+\.(mp4|chatu8)$/, "thinking.chatu8");
  const _0x17ab36 = document.createElement("canvas");
  _0x17ab36.id = "st-chatu8-fab-video-canvas";
  _0x17ab36.className = "st-chatu8-fab-video";
  _0x17ab36.style.width = "100%";
  _0x17ab36.style.height = "100%";
  _0x17ab36.style.position = "absolute";
  _0x17ab36.style.top = "0";
  _0x17ab36.style.left = "0";
  _0x17ab36.style.pointerEvents = "none";
  _0x17ab36.style.display = "block";
  _0x17ab36.style.zIndex = "2";
  const _0x537a29 = initWebGL(_0x17ab36);
  if (!_0x537a29) {
    console.error("Failed to initialize WebGL");
    fallbackToTraditionalMode(_0x42169e);
    return null;
  }
  const {
    gl: _0x28874e,
    program: _0x1d79c2,
    texture: _0x2c7c8d
  } = _0x537a29;
  const _0x2d1260 = {
    currentVideo: "idle",
    isPlaying: false,
    isLoaded: false,
    hasError: false,
    container: _0x42169e,
    idleVideo: _0x4d23af,
    draggingVideo: _0x5da64a,
    idleVideoClone: _0x286722,
    draggingVideoClone: _0x49a8c6,
    headPatVideo: null,
    thinkingVideo: null,
    headPatVideoSrc: _0x5e4608,
    thinkingVideoSrc: _0x52091d,
    headPatVideoLoading: false,
    thinkingVideoLoading: false,
    activeVideo: _0x4d23af,
    canvasElement: _0x17ab36,
    gl: _0x28874e,
    program: _0x1d79c2,
    texture: _0x2c7c8d,
    rafId: null,
    loadedCount: 0,
    alphaCache: null,
    alphaCacheDirty: true,
    lastAlphaCacheTime: 0,
    lastVideoTime: -1,
    isPlayingHeadPat: false,
    isPlayingThinking: false
  };
  const _0xa1887f = _0x2d1260;
  const _0x1da7c5 = _0x215b2e => {
    _0xa1887f.loadedCount++;
    const _0x576b6b = 4;
    if (_0xa1887f.loadedCount >= _0x576b6b && !_0xa1887f.isLoaded) {
      _0xa1887f.isLoaded = true;
      _0xa1887f.hasError = false;
      updateCanvasSize(_0xa1887f);
      const _0x5bae1f = _0x42169e.querySelector("i");
      if (_0x5bae1f) {
        _0x5bae1f.style.display = "none";
      }
      _0xa1887f.isPlaying = true;
      const _0x532773 = _0x4d23af.play();
      if (_0x532773 !== undefined) {
        _0x532773.catch(_0x21db56 => {
          if (_0x21db56.name !== "AbortError") {
            console.error("Failed to play idle video:", _0x21db56);
            _0xa1887f.isPlaying = false;
          }
        });
      }
      startRenderLoop(_0xa1887f);
      preloadVideoToFirstFrame(_0x286722);
      preloadVideoToFirstFrame(_0x5da64a);
      preloadVideoToFirstFrame(_0x49a8c6);
    }
  };
  const _0x506378 = _0x3461a9 => {
    const _0x3d0d40 = _0x3461a9.dataset.originalSrc || _0x3461a9.src;
    if (!_0x3d0d40 || _0x3d0d40 === window.location.href) {
      return;
    }
    console.error("Failed to load video:", _0x3d0d40);
    _0xa1887f.hasError = true;
    _0xa1887f.isLoaded = false;
    if (_0x17e693 && typeof _0x17e693 === "function") {
      const _0x6f8e10 = _0x3d0d40.includes(_0x456bbd) ? "idle" : "dragging";
      _0x17e693(_0x6f8e10, _0x3d0d40);
    }
    fallbackToTraditionalMode(_0x42169e);
  };
  [_0x4d23af, _0x5da64a, _0x286722, _0x49a8c6].forEach(_0x36ea99 => {
    _0x36ea99.addEventListener("loadeddata", () => _0x1da7c5(_0x36ea99));
    _0x36ea99.addEventListener("error", () => _0x506378(_0x36ea99));
  });
  setupEndedHandler(_0x4d23af, _0x286722, _0xa1887f);
  setupEndedHandler(_0x286722, _0x4d23af, _0xa1887f);
  setupEndedHandler(_0x5da64a, _0x49a8c6, _0xa1887f);
  setupEndedHandler(_0x49a8c6, _0x5da64a, _0xa1887f);
  _0x42169e.appendChild(_0x17ab36);
  _0x4d23af.load();
  _0x5da64a.load();
  _0x286722.load();
  _0x49a8c6.load();
  return {
    switchToIdleVideo: () => switchToIdleVideo(_0xa1887f),
    switchToDraggingVideo: () => switchToDraggingVideo(_0xa1887f),
    playHeadPatVideo: () => playHeadPatVideo(_0xa1887f),
    playThinkingVideo: () => playThinkingVideo(_0xa1887f),
    stopThinkingVideo: () => stopThinkingVideo(_0xa1887f),
    pause: () => pause(_0xa1887f),
    resume: () => resume(_0xa1887f),
    destroy: () => destroy(_0xa1887f),
    updateSize: _0x5833c6 => updateSize(_0xa1887f, _0x5833c6),
    hitTest: (_0x1ad538, _0x45778d) => hitTest(_0xa1887f, _0x1ad538, _0x45778d),
    getState: () => _0xa1887f
  };
}
function updateCanvasSize(_0x1f7eaa) {
  const _0x5186b9 = _0x1f7eaa.container;
  const _0x5a7025 = _0x1f7eaa.canvasElement;
  const _0x5590f5 = _0x1f7eaa.activeVideo;
  _0x5186b9.offsetWidth;
  const _0x5cc4d8 = _0x5186b9.offsetWidth;
  const _0x24aa3d = _0x5186b9.offsetHeight;
  if (_0x5cc4d8 === 0 || _0x24aa3d === 0) {
    return false;
  }
  const _0x28ab1f = _0x5590f5.videoWidth || 1;
  const _0x42a06e = (_0x5590f5.videoHeight || 1) / 2;
  const _0x52b512 = _0x28ab1f / _0x42a06e;
  const _0x52ef5c = _0x5cc4d8 / _0x24aa3d;
  let _0x1a4c8b;
  let _0x2a8ef0;
  if (_0x52b512 > _0x52ef5c) {
    _0x1a4c8b = _0x5cc4d8;
    _0x2a8ef0 = _0x5cc4d8 / _0x52b512;
  } else {
    _0x2a8ef0 = _0x24aa3d;
    _0x1a4c8b = _0x24aa3d * _0x52b512;
  }
  _0x5a7025.style.width = _0x1a4c8b + "px";
  _0x5a7025.style.height = _0x2a8ef0 + "px";
  _0x5a7025.width = _0x28ab1f;
  _0x5a7025.height = _0x42a06e;
  _0x1f7eaa.gl.viewport(0, 0, _0x5a7025.width, _0x5a7025.height);
  return true;
}
function stopRenderLoop(_0x271b61) {
  if (_0x271b61.rafId) {
    cancelAnimationFrame(_0x271b61.rafId);
    _0x271b61.rafId = null;
  }
  _0x271b61.renderGeneration = (_0x271b61.renderGeneration || 0) + 1;
}
function startRenderLoop(_0xad9b79) {
  stopRenderLoop(_0xad9b79);
  if (_0xad9b79.activeVideo && typeof _0xad9b79.activeVideo.requestVideoFrameCallback === "function") {
    startVideoFrameLoop(_0xad9b79);
  } else {
    startRafLoop(_0xad9b79);
  }
}
function startVideoFrameLoop(_0x38c653) {
  if (_0x38c653.hasError || !_0x38c653.isPlaying) {
    return;
  }
  const _0x324a65 = _0x38c653.renderGeneration || 0;
  const _0x52ac89 = (_0x58e68b, _0x3d265b) => {
    if (_0x38c653.renderGeneration !== _0x324a65) {
      return;
    }
    if (_0x38c653.hasError || !_0x38c653.isPlaying) {
      return;
    }
    renderFrame(_0x38c653);
    if (_0x38c653.activeVideo && !_0x38c653.activeVideo.paused && typeof _0x38c653.activeVideo.requestVideoFrameCallback === "function") {
      _0x38c653.activeVideo.requestVideoFrameCallback(_0x52ac89);
    }
  };
  if (_0x38c653.activeVideo && !_0x38c653.activeVideo.paused) {
    _0x38c653.activeVideo.requestVideoFrameCallback(_0x52ac89);
  }
}
function startRafLoop(_0x47ee1e) {
  const _0x12ff8b = () => {
    if (_0x47ee1e.hasError || !_0x47ee1e.isPlaying) {
      return;
    }
    renderFrame(_0x47ee1e);
    _0x47ee1e.rafId = requestAnimationFrame(_0x12ff8b);
  };
  _0x12ff8b();
}
function renderFrame(_0x28b6b5) {
  const {
    gl: _0x9b090,
    texture: _0x44696c,
    activeVideo: _0x1c188f
  } = _0x28b6b5;
  if (_0x1c188f.readyState < 2) {
    return;
  }
  const _0x5db0cb = _0x1c188f.currentTime;
  if (_0x5db0cb === _0x28b6b5.lastVideoTime) {
    return;
  }
  _0x28b6b5.lastVideoTime = _0x5db0cb;
  _0x28b6b5.alphaCacheDirty = true;
  _0x9b090.bindTexture(_0x9b090.TEXTURE_2D, _0x44696c);
  _0x9b090.texImage2D(_0x9b090.TEXTURE_2D, 0, _0x9b090.RGBA, _0x9b090.RGBA, _0x9b090.UNSIGNED_BYTE, _0x1c188f);
  _0x9b090.clearColor(0, 0, 0, 0);
  _0x9b090.clear(_0x9b090.COLOR_BUFFER_BIT);
  _0x9b090.drawArrays(_0x9b090.TRIANGLE_STRIP, 0, 4);
}
function updateAlphaCache(_0x3338ce) {
  const {
    gl: _0x493d4e,
    canvasElement: _0xc0ca62
  } = _0x3338ce;
  const _0x45af74 = _0xc0ca62.width;
  const _0xd4665a = _0xc0ca62.height;
  try {
    const _0x4f5632 = new Uint8Array(_0x45af74 * _0xd4665a * 4);
    _0x493d4e.readPixels(0, 0, _0x45af74, _0xd4665a, _0x493d4e.RGBA, _0x493d4e.UNSIGNED_BYTE, _0x4f5632);
    const _0x35f54a = {
      pixels: _0x4f5632,
      width: _0x45af74,
      height: _0xd4665a
    };
    _0x3338ce.alphaCache = _0x35f54a;
  } catch (_0x10e5cd) {
    console.warn("Failed to update alpha cache:", _0x10e5cd);
  }
}
function preloadVideoToFirstFrame(_0xb27653) {
  _0xb27653.currentTime = 0;
  _0xb27653.pause();
}
function ensureVideoLoaded(_0x3f5190, _0x5652f4, _0xdd0468, _0x1aadfc) {
  return new Promise((_0x1f5b6b, _0x21fc95) => {
    if (_0x3f5190[_0x5652f4] && _0x3f5190[_0x5652f4].readyState >= 2) {
      _0x1f5b6b(_0x3f5190[_0x5652f4]);
      return;
    }
    const _0x5618ff = _0x5652f4 + "Loading";
    if (_0x3f5190[_0x5618ff] && _0x3f5190[_0x5652f4]) {
      const _0x4eefe2 = () => {
        _0x3f5190[_0x5652f4].removeEventListener("loadeddata", _0x4eefe2);
        _0x3f5190[_0x5652f4].removeEventListener("error", _0x2be0f9);
        _0x1f5b6b(_0x3f5190[_0x5652f4]);
      };
      const _0x2be0f9 = () => {
        _0x3f5190[_0x5652f4].removeEventListener("loadeddata", _0x4eefe2);
        _0x3f5190[_0x5652f4].removeEventListener("error", _0x2be0f9);
        _0x21fc95(new Error("可选视频 " + _0x1aadfc + " 加载失败"));
      };
      _0x3f5190[_0x5652f4].addEventListener("loadeddata", _0x4eefe2);
      _0x3f5190[_0x5652f4].addEventListener("error", _0x2be0f9);
      return;
    }
    _0x3f5190[_0x5618ff] = true;
    const _0x350fda = createHiddenVideo(_0x3f5190[_0xdd0468], _0x1aadfc);
    _0x3f5190[_0x5652f4] = _0x350fda;
    _0x350fda.addEventListener("loadeddata", () => {
      _0x3f5190[_0x5618ff] = false;
      _0x1f5b6b(_0x350fda);
    });
    _0x350fda.addEventListener("error", () => {
      _0x3f5190[_0x5618ff] = false;
      console.warn("[st-chatu8] 可选视频 " + _0x1aadfc + " 加载失败，功能不可用");
      _0x21fc95(new Error("可选视频 " + _0x1aadfc + " 加载失败"));
    });
    _0x350fda.load();
  });
}
function setupHeadPatEndedHandler(_0x236c52) {
  if (!_0x236c52.headPatVideo) {
    return;
  }
  _0x236c52.headPatVideo.addEventListener("ended", () => {
    if (_0x236c52.isPlayingHeadPat) {
      _0x236c52.isPlayingHeadPat = false;
      const _0x1b1485 = document.getElementById("st-chatu8-fab");
      const _0x5c7967 = _0x1b1485 && _0x1b1485.dataset.isLoading === "true";
      if (_0x5c7967 && _0x236c52.thinkingVideo && _0x236c52.thinkingVideo.readyState >= 2) {
        _0x236c52.currentVideo = "thinking";
        _0x236c52.isPlayingThinking = true;
        _0x236c52.alphaCacheDirty = true;
        _0x236c52.lastVideoTime = -1;
        _0x236c52.activeVideo = _0x236c52.thinkingVideo;
        _0x236c52.thinkingVideo.currentTime = 0;
        _0x236c52.thinkingVideo.play().catch(_0x2d140a => {
          console.error("Failed to play thinking video after head pat:", _0x2d140a);
          _0x236c52.isPlayingThinking = false;
          switchToIdleVideo(_0x236c52);
        });
        startRenderLoop(_0x236c52);
      } else {
        switchToIdleVideo(_0x236c52);
      }
    }
  });
}
function setupThinkingEndedHandler(_0x58566e) {
  if (!_0x58566e.thinkingVideo) {
    return;
  }
  _0x58566e.thinkingVideo.addEventListener("ended", () => {
    if (_0x58566e.isPlayingThinking) {
      _0x58566e.thinkingVideo.currentTime = 0;
      const _0x3b9661 = _0x58566e.thinkingVideo.play();
      if (_0x3b9661 !== undefined) {
        _0x3b9661.catch(_0x2aeb07 => {
          if (_0x2aeb07.name !== "AbortError") {
            console.error("Failed to loop thinking video:", _0x2aeb07);
          }
        });
      }
    }
  });
}
function pauseAllVideos(_0x5cb19c) {
  const _0x24cb2d = [_0x5cb19c.idleVideo, _0x5cb19c.idleVideoClone, _0x5cb19c.draggingVideo, _0x5cb19c.draggingVideoClone, _0x5cb19c.thinkingVideo, _0x5cb19c.headPatVideo];
  _0x24cb2d.forEach(_0x5d1217 => {
    if (_0x5d1217 && !_0x5d1217.paused) {
      _0x5d1217.pause();
    }
  });
}
function setupEndedHandler(_0x137973, _0x3d8cd1, _0x14ed4f) {
  _0x137973.addEventListener("ended", () => {
    const _0x3150ed = _0x14ed4f.activeVideo;
    _0x14ed4f.activeVideo = _0x3d8cd1;
    _0x14ed4f.alphaCacheDirty = true;
    _0x14ed4f.lastVideoTime = -1;
    _0x3d8cd1.currentTime = 0;
    const _0x41d0b6 = _0x3d8cd1.play();
    if (_0x41d0b6 !== undefined) {
      _0x41d0b6.then(() => {
        startRenderLoop(_0x14ed4f);
        setTimeout(() => {
          preloadVideoToFirstFrame(_0x137973);
        }, 100);
      }).catch(_0x235988 => {
        if (_0x235988.name !== "AbortError") {
          console.error("Failed to play clone video:", _0x235988);
        }
      });
    }
  });
}
function hitTest(_0x3728da, _0x29650a, _0x2ec6bf) {
  if (_0x3728da.hasError || !_0x3728da.isLoaded) {
    return true;
  }
  const _0x51f036 = performance.now();
  if (!_0x3728da.alphaCache || _0x3728da.alphaCacheDirty || _0x51f036 - _0x3728da.lastAlphaCacheTime > 200) {
    updateAlphaCache(_0x3728da);
    _0x3728da.alphaCacheDirty = false;
    _0x3728da.lastAlphaCacheTime = _0x51f036;
  }
  if (!_0x3728da.alphaCache) {
    return true;
  }
  const {
    canvasElement: _0x33c367,
    alphaCache: _0x34b84d
  } = _0x3728da;
  const _0x5540d7 = _0x33c367.getBoundingClientRect();
  const _0x5ea64f = _0x29650a - _0x5540d7.left;
  const _0x405f20 = _0x2ec6bf - _0x5540d7.top;
  const _0x1d31db = Math.floor(_0x5ea64f / _0x5540d7.width * _0x34b84d.width);
  const _0x474f82 = Math.floor(_0x405f20 / _0x5540d7.height * _0x34b84d.height);
  if (_0x1d31db < 0 || _0x474f82 < 0 || _0x1d31db >= _0x34b84d.width || _0x474f82 >= _0x34b84d.height) {
    return false;
  }
  const _0x1cda9a = (_0x474f82 * _0x34b84d.width + _0x1d31db) * 4 + 3;
  const _0xa52dfd = _0x34b84d.pixels[_0x1cda9a];
  return _0xa52dfd > 15;
}
function switchToIdleVideo(_0x2e07e0) {
  if (_0x2e07e0.hasError || _0x2e07e0.currentVideo === "idle") {
    return;
  }
  _0x2e07e0.currentVideo = "idle";
  pauseAllVideos(_0x2e07e0);
  _0x2e07e0.isPlayingThinking = false;
  _0x2e07e0.isPlayingHeadPat = false;
  _0x2e07e0.alphaCacheDirty = true;
  _0x2e07e0.lastVideoTime = -1;
  _0x2e07e0.idleVideo.currentTime = 0;
  const _0x346b52 = _0x2e07e0.idleVideo.play();
  if (_0x346b52 !== undefined) {
    _0x346b52.catch(_0x5ee291 => {
      if (_0x5ee291.name !== "AbortError") {
        console.error("Failed to play idle video:", _0x5ee291);
      }
    });
  }
  _0x2e07e0.activeVideo = _0x2e07e0.idleVideo;
  preloadVideoToFirstFrame(_0x2e07e0.idleVideoClone);
  startRenderLoop(_0x2e07e0);
}
function switchToDraggingVideo(_0x10883b) {
  if (_0x10883b.hasError || _0x10883b.currentVideo === "dragging") {
    return;
  }
  _0x10883b.currentVideo = "dragging";
  pauseAllVideos(_0x10883b);
  _0x10883b.alphaCacheDirty = true;
  _0x10883b.lastVideoTime = -1;
  _0x10883b.draggingVideo.currentTime = 0;
  const _0x555499 = _0x10883b.draggingVideo.play();
  if (_0x555499 !== undefined) {
    _0x555499.catch(_0x1969f1 => {
      if (_0x1969f1.name !== "AbortError") {
        console.error("Failed to play dragging video:", _0x1969f1);
      }
    });
  }
  _0x10883b.activeVideo = _0x10883b.draggingVideo;
  preloadVideoToFirstFrame(_0x10883b.draggingVideoClone);
  startRenderLoop(_0x10883b);
}
async function playHeadPatVideo(_0x3566f2) {
  if (_0x3566f2.hasError || _0x3566f2.isPlayingHeadPat) {
    return;
  }
  try {
    const _0x1763dc = await ensureVideoLoaded(_0x3566f2, "headPatVideo", "headPatVideoSrc", "st-chatu8-fab-video-headpat");
    if (!_0x1763dc._endedHandlerRegistered) {
      setupHeadPatEndedHandler(_0x3566f2);
      _0x1763dc._endedHandlerRegistered = true;
    }
  } catch (_0x409694) {
    console.warn("摸头视频不可用");
    return;
  }
  if (!_0x3566f2.headPatVideo || _0x3566f2.headPatVideo.readyState < 2) {
    console.warn("Head pat video not ready");
    return;
  }
  _0x3566f2.isPlayingHeadPat = true;
  _0x3566f2.currentVideo = "headpat";
  pauseAllVideos(_0x3566f2);
  _0x3566f2.alphaCacheDirty = true;
  _0x3566f2.lastVideoTime = -1;
  _0x3566f2.headPatVideo.currentTime = 0;
  const _0x56073a = _0x3566f2.headPatVideo.play();
  if (_0x56073a !== undefined) {
    _0x56073a.catch(_0x2e891e => {
      if (_0x2e891e.name === "AbortError") {
        return;
      }
      console.error("Failed to play head pat video:", _0x2e891e);
      _0x3566f2.isPlayingHeadPat = false;
      switchToIdleVideo(_0x3566f2);
    });
  }
  _0x3566f2.activeVideo = _0x3566f2.headPatVideo;
  startRenderLoop(_0x3566f2);
}
async function playThinkingVideo(_0x405d4b) {
  if (_0x405d4b.hasError) {
    return;
  }
  try {
    const _0xa303a = await ensureVideoLoaded(_0x405d4b, "thinkingVideo", "thinkingVideoSrc", "st-chatu8-fab-video-thinking");
    if (!_0xa303a._endedHandlerRegistered) {
      setupThinkingEndedHandler(_0x405d4b);
      _0xa303a._endedHandlerRegistered = true;
    }
  } catch (_0x565e35) {
    console.warn("思考视频不可用，使用传统加载动画");
    const _0x427e59 = document.getElementById("st-chatu8-fab");
    if (_0x427e59) {
      _0x427e59.classList.add("st-chatu8-fab-loading");
    }
    return;
  }
  if (!_0x405d4b.thinkingVideo || _0x405d4b.thinkingVideo.readyState < 2) {
    console.warn("Thinking video not ready");
    return;
  }
  if (_0x405d4b.isPlayingThinking && _0x405d4b.currentVideo === "thinking") {
    if (_0x405d4b.thinkingVideo.paused) {
      const _0x128b6d = _0x405d4b.thinkingVideo.play();
      if (_0x128b6d !== undefined) {
        _0x128b6d.catch(_0x4038e0 => {
          if (_0x4038e0.name !== "AbortError") {
            console.error("Failed to resume thinking video:", _0x4038e0);
          }
        });
      }
    }
    return;
  }
  _0x405d4b.isPlayingThinking = true;
  _0x405d4b.currentVideo = "thinking";
  pauseAllVideos(_0x405d4b);
  _0x405d4b.alphaCacheDirty = true;
  _0x405d4b.lastVideoTime = -1;
  _0x405d4b.isPlayingHeadPat = false;
  _0x405d4b.thinkingVideo.currentTime = 0;
  const _0x4c2acc = _0x405d4b.thinkingVideo.play();
  if (_0x4c2acc !== undefined) {
    _0x4c2acc.catch(_0x174c6b => {
      if (_0x174c6b.name === "AbortError") {
        return;
      }
      console.error("Failed to play thinking video:", _0x174c6b);
      _0x405d4b.isPlayingThinking = false;
      switchToIdleVideo(_0x405d4b);
    });
  }
  _0x405d4b.activeVideo = _0x405d4b.thinkingVideo;
  startRenderLoop(_0x405d4b);
}
function stopThinkingVideo(_0x4f379a) {
  if (!_0x4f379a.isPlayingThinking) {
    return;
  }
  _0x4f379a.isPlayingThinking = false;
  if (_0x4f379a.thinkingVideo) {
    _0x4f379a.thinkingVideo.pause();
  }
  const _0x3b3ac5 = document.getElementById("st-chatu8-fab");
  if (_0x3b3ac5) {
    _0x3b3ac5.classList.remove("st-chatu8-fab-loading");
  }
  switchToIdleVideo(_0x4f379a);
}
function pause(_0x3ba53d) {
  if (_0x3ba53d.hasError) {
    return;
  }
  _0x3ba53d.activeVideo.pause();
  _0x3ba53d.isPlaying = false;
  stopRenderLoop(_0x3ba53d);
}
function resume(_0x10da9a) {
  if (_0x10da9a.hasError) {
    return;
  }
  const _0x5eb99c = _0x10da9a.activeVideo.play();
  if (_0x5eb99c !== undefined) {
    _0x5eb99c.then(() => {
      _0x10da9a.isPlaying = true;
      startRenderLoop(_0x10da9a);
    }).catch(_0x5aa574 => {
      if (_0x5aa574.name !== "AbortError") {
        console.error("Failed to resume video:", _0x5aa574);
      }
    });
  }
}
function destroy(_0x1e4590) {
  stopRenderLoop(_0x1e4590);
  _0x1e4590.isPlaying = false;
  _0x1e4590.isLoaded = false;
  _0x1e4590.isPlayingHeadPat = false;
  _0x1e4590.isPlayingThinking = false;
  [_0x1e4590.idleVideo, _0x1e4590.draggingVideo, _0x1e4590.idleVideoClone, _0x1e4590.draggingVideoClone, _0x1e4590.headPatVideo, _0x1e4590.thinkingVideo].forEach(_0x543d8c => {
    if (_0x543d8c) {
      _0x543d8c.pause();
      if (_0x543d8c.src && _0x543d8c.src.startsWith("blob:")) {
        URL.revokeObjectURL(_0x543d8c.src);
      }
      _0x543d8c.src = "";
      _0x543d8c.removeAttribute("src");
      _0x543d8c.load();
      if (_0x543d8c.parentNode) {
        _0x543d8c.parentNode.removeChild(_0x543d8c);
      }
    }
  });
  if (_0x1e4590.canvasElement && _0x1e4590.canvasElement.parentNode) {
    _0x1e4590.canvasElement.parentNode.removeChild(_0x1e4590.canvasElement);
  }
  if (_0x1e4590.gl) {
    const _0x530193 = _0x1e4590.gl.getExtension("WEBGL_lose_context");
    if (_0x530193) {
      _0x530193.loseContext();
    }
  }
  _0x1e4590.alphaCache = null;
  const _0xaac890 = _0x1e4590.container.querySelector("i");
  if (_0xaac890) {
    _0xaac890.style.display = "";
  }
}
function updateSize(_0x1a7cd4, _0x589abe) {
  const _0x1381f8 = _0x1a7cd4.container;
  if (_0x589abe) {
    _0x1381f8.style.width = _0x589abe + "px";
    _0x1381f8.style.height = _0x589abe + "px";
  }
  _0x1381f8.offsetWidth;
  const _0x19ba1b = updateCanvasSize(_0x1a7cd4);
  if (_0x19ba1b && _0x1a7cd4.isLoaded && _0x1a7cd4.activeVideo && _0x1a7cd4.activeVideo.readyState >= 2) {
    renderFrame(_0x1a7cd4);
    updateAlphaCache(_0x1a7cd4);
    _0x1a7cd4.alphaCacheDirty = false;
    _0x1a7cd4.lastAlphaCacheTime = performance.now();
  }
}
function fallbackToTraditionalMode(_0x2961c0) {
  console.warn("Falling back to traditional icon mode");
  const _0x565651 = _0x2961c0.querySelector("canvas");
  if (_0x565651) {
    _0x565651.style.display = "none";
  }
  const _0x1f233e = _0x2961c0.querySelector("i");
  if (_0x1f233e) {
    _0x1f233e.style.display = "";
  }
}
export function checkWebGLSupport() {
  try {
    const _0x7bc9f7 = document.createElement("canvas");
    return !!_0x7bc9f7.getContext("webgl") || !!_0x7bc9f7.getContext("experimental-webgl");
  } catch (_0x4c4a76) {
    return false;
  }
}