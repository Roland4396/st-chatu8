import { eventSource } from "../../../../../../script.js";
import { extension_settings } from "../../../../../extensions.js";
import { EventType, extensionName } from "../config.js";
import { addLog, addSmoothShakeEffect, fixMp4Faststart } from "../utils.js";
import { showEditDialog } from "./dialogs.js";
import { isGenerating, startGenerating, stopGenerating } from "../generation_status.js";
import { getItemImg } from "../database.js";
async function _dataUrlToBlob(_0x493a0b) {
  const _0x28107b = _0x493a0b.indexOf(",");
  const _0x477ba6 = _0x493a0b.slice(0, _0x28107b);
  const _0x20fa75 = _0x477ba6.slice(5, _0x477ba6.indexOf(";"));
  const _0x156c11 = _0x493a0b.slice(_0x28107b + 1);
  const _0x21e612 = 524288;
  const _0x348faf = [];
  for (let _0x49a9ae = 0; _0x49a9ae < _0x156c11.length; _0x49a9ae += _0x21e612) {
    const _0x19bb82 = _0x156c11.slice(_0x49a9ae, _0x49a9ae + _0x21e612);
    const _0x3c0a27 = atob(_0x19bb82);
    const _0x47760b = new Uint8Array(_0x3c0a27.length);
    for (let _0x5f4b6e = 0; _0x5f4b6e < _0x3c0a27.length; _0x5f4b6e++) {
      _0x47760b[_0x5f4b6e] = _0x3c0a27.charCodeAt(_0x5f4b6e);
    }
    _0x348faf.push(_0x47760b);
    if (_0x348faf.length % 5 === 0) {
      await new Promise(_0x5cbe33 => setTimeout(_0x5cbe33, 0));
    }
  }
  const _0x5c5f58 = {
    type: _0x20fa75
  };
  return new Blob(_0x348faf, _0x5c5f58);
}
let _showImagePreview = null;
export function setShowImagePreview(_0x4756b6) {
  _showImagePreview = _0x4756b6;
}
export function createAndShowImage(_0x3a9962, _0x5d26c7, _0x44e6b4, _0x41beab, _0x348249, _0x475362 = false, _0xd092bd = "") {
  const _0xac9224 = _0x3a9962.ownerDocument;
  if (!_0xac9224) {
    return;
  }
  const _0x33d610 = _0xac9224.createElement("div");
  _0x33d610.className = "st-chatu8-image-container";
  let _0x773ee2;
  if (_0x475362) {
    _0x773ee2 = _0xac9224.createElement("video");
    _0x773ee2.controls = true;
    _0x773ee2.loop = true;
    _0x773ee2.muted = true;
    _0x773ee2.playsInline = true;
    _0x773ee2.style.maxWidth = "100%";
    _0x773ee2.style.height = "auto";
    _0x773ee2.dataset.isVideo = "true";
    _0x773ee2.autoplay = true;
    if (_0x5d26c7.startsWith("data:")) {
      _dataUrlToBlob(_0x5d26c7).then(_0x86aebe => fixMp4Faststart(_0x86aebe)).then(_0x3e7020 => {
        const _0x39d1ca = URL.createObjectURL(_0x3e7020);
        _0x773ee2.dataset.blobUrl = _0x39d1ca;
        _0x773ee2.src = _0x39d1ca;
      }).catch(_0x14d80f => {
        console.warn("[video] Blob URL 创建失败，回退使用 data URL:", _0x14d80f);
        _0x773ee2.src = _0x5d26c7;
      });
    } else {
      _0x773ee2.src = _0x5d26c7;
    }
    _0x773ee2.onerror = function () {
      const _0x16c3cd = this.error?.code;
      console.error("[iframe] Video onerror: code=" + _0x16c3cd + ", msg=" + this.error?.message);
      if (_0xd092bd && this.src !== _0xd092bd) {
        console.log("[iframe] 尝试使用原始 URL 備用播放:", _0xd092bd);
        this.src = _0xd092bd;
        return;
      }
      const _0x2e464f = _0xac9224.createElement("div");
      _0x2e464f.className = "st-chatu8-video-notice";
      _0x2e464f.style.cssText = "\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                gap: 8px;\n                padding: 10px;\n                background: rgba(0,0,0,0.5);\n                border-radius: 0 0 8px 8px;\n                color: #fff;\n                font-size: 13px;\n                text-align: center;\n            ";
      const _0x21d304 = _0xac9224.createElement("div");
      _0x21d304.textContent = "⚠️ 视频在当前浏览器环境中无法播放，请下载后用视频播放器观看";
      _0x21d304.style.opacity = "0.9";
      const _0x572581 = _0xac9224.createElement("a");
      const _0x3330bd = _0x773ee2.dataset.blobUrl || _0x5d26c7;
      _0x572581.href = _0x3330bd;
      _0x572581.download = "video.mp4";
      _0x572581.textContent = "📥 下载视频";
      _0x572581.style.cssText = "\n                background: rgba(255,255,255,0.25);\n                padding: 7px 18px;\n                border-radius: 4px;\n                color: #fff;\n                text-decoration: none;\n                cursor: pointer;\n                font-size: 14px;\n            ";
      _0x572581.onclick = _0x3e7303 => _0x3e7303.stopPropagation();
      _0x2e464f.appendChild(_0x21d304);
      _0x2e464f.appendChild(_0x572581);
      if (_0x773ee2.parentNode) {
        _0x773ee2.parentNode.appendChild(_0x2e464f);
      }
    };
  } else {
    _0x773ee2 = _0xac9224.createElement("img");
    _0x773ee2.src = _0x5d26c7;
    _0x773ee2.alt = _0x44e6b4;
    _0x773ee2.style.maxWidth = "100%";
    _0x773ee2.style.height = "auto";
  }
  if (_0x348249) {
    _0x41beab.dataset.change = _0x348249 ? _0x348249 : "";
  }
  let _0x51dec4 = null;
  let _0xa834a7 = null;
  let _0x20a285 = false;
  const _0x4ebd35 = 300;
  const _0x155735 = 1200;
  let _0x5c03a7;
  if (_0x475362) {
    const _0x3ce18f = _0xac9224.createElement("div");
    _0x3ce18f.style.cssText = ["position:absolute", "top:0", "left:0", "width:100%", "height:25%", "z-index:1", "cursor:pointer"].join(";");
    _0x33d610.style.position = "relative";
    _0x33d610._pendingOverlay = _0x3ce18f;
    _0x5c03a7 = _0x3ce18f;
  } else {
    _0x5c03a7 = _0x773ee2;
  }
  const _0xb615cb = _0x17468c => {
    if (_0x17468c.type === "mousedown" && _0x17468c.button !== 0) {
      return;
    }
    _0x20a285 = false;
    _0xa834a7 = setTimeout(() => {
      _0xa834a7 = null;
      _0x20a285 = true;
      if (_0x51dec4) {
        clearTimeout(_0x51dec4);
        _0x51dec4 = null;
      }
      if (_0x41beab && extension_settings[extensionName].longPressToEdit == "true") {
        showEditDialog(_0x773ee2, _0x41beab);
      }
    }, _0x155735);
  };
  const _0x5e6926 = _0x10d097 => {
    if (_0xa834a7) {
      clearTimeout(_0xa834a7);
      _0xa834a7 = null;
    }
  };
  const _0x5a3bb3 = _0x1b4d90 => {
    if (_0x20a285) {
      return;
    }
    if (_0x51dec4) {
      clearTimeout(_0x51dec4);
      _0x51dec4 = null;
      if (extension_settings[extensionName].dbclike === "true" && _0x41beab) {
        addSmoothShakeEffect(_0x773ee2);
        triggerGeneration(_0x41beab);
      }
    } else {
      _0x51dec4 = setTimeout(() => {
        _0x51dec4 = null;
        if (_0x41beab && extension_settings[extensionName].clickToPreview === "true") {
          if (_showImagePreview) {
            _showImagePreview(_0x773ee2, _0x41beab);
          }
        }
      }, _0x4ebd35);
    }
  };
  _0x5c03a7.addEventListener("click", _0x5a3bb3);
  _0x5c03a7.addEventListener("mousedown", _0xb615cb);
  _0x5c03a7.addEventListener("mouseup", _0x5e6926);
  _0x5c03a7.addEventListener("mouseleave", _0x5e6926);
  _0x5c03a7.addEventListener("touchstart", _0xb615cb, {
    passive: true
  });
  _0x5c03a7.addEventListener("touchend", _0x5e6926);
  _0x5c03a7.addEventListener("touchcancel", _0x5e6926);
  _0x5c03a7.addEventListener("contextmenu", _0xb75a28 => {
    if (extension_settings[extensionName].longPressToEdit == "true") {
      _0xb75a28.preventDefault();
      _0xb75a28.stopPropagation();
    }
  });
  _0x33d610.appendChild(_0x773ee2);
  if (_0x33d610._pendingOverlay) {
    _0x33d610.appendChild(_0x33d610._pendingOverlay);
    delete _0x33d610._pendingOverlay;
  }
  if (String(extension_settings[extensionName]?.collapseImage) === "true") {
    const _0x115047 = _0xac9224.createElement("div");
    _0x115047.className = "st-chatu8-collapse-wrapper";
    _0x115047.dataset.mediaType = _0x475362 ? "video" : "image";
    _0x115047.dataset.collapsed = "true";
    const _0x2e8b4c = _0xac9224.createElement("div");
    _0x2e8b4c.className = "st-chatu8-collapse-header";
    const _0x4ec623 = _0xac9224.createElement("span");
    _0x4ec623.className = "st-chatu8-collapse-icon";
    _0x4ec623.textContent = "▼";
    const _0x136f94 = _0xac9224.createElement("span");
    _0x136f94.className = "st-chatu8-collapse-title";
    _0x136f94.textContent = _0x475362 ? "📹 点击展开视频" : "📷 点击展开图片";
    const _0x3bb010 = _0xac9224.createElement("span");
    _0x3bb010.className = "st-chatu8-collapse-badge";
    _0x3bb010.textContent = "已折叠";
    _0x2e8b4c.appendChild(_0x4ec623);
    _0x2e8b4c.appendChild(_0x136f94);
    _0x2e8b4c.appendChild(_0x3bb010);
    const _0x372e8d = _0xac9224.createElement("div");
    _0x372e8d.className = "st-chatu8-collapse-content";
    _0x372e8d.appendChild(_0x33d610);
    _0x2e8b4c.addEventListener("click", _0x25a667 => {
      _0x25a667.stopPropagation();
      const _0x50462c = _0x115047.dataset.collapsed === "true";
      if (_0x50462c) {
        _0x115047.dataset.collapsed = "false";
        _0x3bb010.textContent = "已展开";
        _0x136f94.textContent = _0x475362 ? "📹 点击收起视频" : "📷 点击收起图片";
      } else {
        _0x115047.dataset.collapsed = "true";
        _0x3bb010.textContent = "已折叠";
        _0x136f94.textContent = _0x475362 ? "📹 点击展开视频" : "📷 点击展开图片";
      }
    });
    _0x115047.appendChild(_0x2e8b4c);
    _0x115047.appendChild(_0x372e8d);
    _0x3a9962.replaceChildren(_0x115047);
  } else {
    _0x3a9962.replaceChildren(_0x33d610);
  }
}
export const triggerGeneration = _0x5e2b00 => {
  if (_0x5e2b00.hasAttribute("data-loading")) {
    addLog("按钮已在加载中，跳过重复点击: " + _0x5e2b00.dataset.link?.substring(0, 50));
    return;
  }
  const _0x1e11ef = _0x5e2b00.dataset.link;
  const _0x5c80bc = _0x5e2b00.dataset.requestId;
  const _0x16eaee = () => {
    console.log("Triggering generation for button:", _0x5e2b00);
    const _0x3e6d6f = isGenerating(_0x1e11ef);
    if (_0x3e6d6f) {
      addLog("图像生成请求已在进行中，等待响应: " + _0x1e11ef);
      _0x5e2b00.setAttribute("data-loading", "true");
      _0x5e2b00.textContent = "加载中...";
    }
    const _0x185d3f = _0x4e5b6b => {
      if (_0x4e5b6b.id !== _0x5c80bc) {
        return;
      }
      console.log("Image response:", _0x4e5b6b);
      eventSource.removeListener(EventType.GENERATE_IMAGE_RESPONSE, _0x185d3f);
      addLog("图像响应监听器已销毁 (ID: " + _0x5c80bc + ")");
      const {
        success: _0x5d8302,
        imageData: _0x3a386f,
        error: _0x36ce0f,
        prompt: _0x10367f,
        change: _0x3004d3,
        isVideo: _0x3f249f,
        originalUrl: _0x242703
      } = _0x4e5b6b;
      if (_0x10367f) {
        stopGenerating(_0x10367f);
      }
      const _0x1995bf = [document, ...Array.from(document.querySelectorAll("iframe")).map(_0x1170a3 => _0x1170a3.contentDocument).filter(Boolean)];
      _0x1995bf.forEach(_0x345c04 => {
        const _0x157a43 = _0x345c04.querySelectorAll("span[data-request-id=\"" + _0x5c80bc + "\"]");
        const _0x4c2fd1 = _0x345c04.querySelectorAll("button[data-request-id=\"" + _0x5c80bc + "\"]");
        if (_0x157a43.length > 0) {
          if (_0x5d8302) {
            addLog((_0x3f249f ? "视频" : "图像") + "生成成功 (ID: " + _0x5c80bc + "), targeting " + _0x157a43.length + " element(s).");
            _0x157a43.forEach(_0x5dd0dd => {
              const _0x678c24 = _0x5dd0dd.previousElementSibling;
              if (_0x678c24 && _0x678c24.matches("button[data-request-id=\"" + _0x5c80bc + "\"]")) {
                createAndShowImage(_0x5dd0dd, _0x3a386f, "Generated Image", _0x678c24, _0x3004d3, _0x3f249f, _0x242703 || "");
              } else {
                createAndShowImage(_0x5dd0dd, _0x3a386f, "Generated Image", null, _0x3004d3, _0x3f249f, _0x242703 || "");
              }
            });
            _0x4c2fd1.forEach(_0x5e02af => {
              _0x5e02af.removeAttribute("data-loading");
              if (extension_settings[extensionName].dbclike == "true") {
                _0x5e02af.style.setProperty("display", "none", "important");
              } else {
                _0x5e02af.disabled = false;
                _0x5e02af.textContent = "生成图片";
              }
            });
          } else {
            addLog("图像生成失败 (ID: " + _0x5c80bc + "): " + _0x36ce0f);
            toastr.error("生成失败: " + (_0x36ce0f || "未知错误"));
            _0x4c2fd1.forEach(_0x4cebee => {
              _0x4cebee.removeAttribute("data-loading");
              _0x4cebee.disabled = false;
              _0x4cebee.textContent = "生成图片";
            });
          }
        }
      });
    };
    eventSource.on(EventType.GENERATE_IMAGE_RESPONSE, _0x185d3f);
    addLog("图像响应监听器已创建 (ID: " + _0x5c80bc + ")");
    if (!_0x3e6d6f) {
      _0x5e2b00.setAttribute("data-loading", "true");
      _0x5e2b00.textContent = "加载中...";
      startGenerating(_0x1e11ef);
      const _0x310fe1 = _0x5e2b00.dataset.change;
      const _0x36cca9 = _0x5e2b00.dataset.width || null;
      const _0x1ad88f = _0x5e2b00.dataset.height || null;
      const _0x3ec608 = {
        id: _0x5c80bc,
        prompt: _0x1e11ef,
        width: _0x36cca9,
        height: _0x1ad88f
      };
      const _0x88ff34 = _0x3ec608;
      if (_0x310fe1) {
        _0x88ff34.change = _0x310fe1;
        if (_0x310fe1.includes("{修图}")) {
          _0x88ff34.retouchPrompt = _0x5e2b00.dataset.retouchPrompt || "";
          _0x88ff34.retouchImage = _0x5e2b00.dataset.retouchImage || "";
          _0x5e2b00.dataset.change = _0x5e2b00.dataset.change.replaceAll("{修图}", "");
        }
        if (_0x310fe1.includes("{视频}")) {
          _0x88ff34.videoPrompt = _0x5e2b00.dataset.videoPrompt || "";
          _0x88ff34.videoImage = _0x5e2b00.dataset.videoImage || "";
          _0x5e2b00.dataset.change = _0x5e2b00.dataset.change.replaceAll("{视频}", "");
        }
      }
      eventSource.emit(EventType.GENERATE_IMAGE_REQUEST, _0x88ff34);
      addLog("发出图像生成请求 (ID: " + _0x88ff34.id + ")");
    }
  };
  const _0x3ed9ff = [document, ...Array.from(document.querySelectorAll("iframe")).map(_0x241bd2 => _0x241bd2.contentDocument).filter(Boolean)];
  let _0x19e3b6 = false;
  for (const _0x4248ca of _0x3ed9ff) {
    const _0x522ec8 = _0x4248ca.querySelector("span[data-request-id=\"" + _0x5c80bc + "\"]");
    if (_0x522ec8 && _0x522ec8.querySelector("img, video, .st-chatu8-video-fallback")) {
      console.log("Media already exists in DOM. Triggering regeneration.");
      _0x19e3b6 = true;
      break;
    }
  }
  if (_0x19e3b6) {
    _0x16eaee();
  } else {
    getItemImg(_0x1e11ef).then(([_0x1da94a, _0x582b03,, _0x5cb4c5, _0x148835]) => {
      if (_0x1da94a) {
        addLog("Image for \"" + _0x1e11ef + "\" already exists in DB. Skipping generation.");
        for (const _0x5be5d6 of _0x3ed9ff) {
          const _0x487cc4 = _0x5be5d6.querySelectorAll("span[data-request-id=\"" + _0x5c80bc + "\"]");
          for (const _0x294e52 of _0x487cc4) {
            const _0x43283c = _0x294e52.previousElementSibling;
            if (_0x43283c && _0x43283c.matches("button[data-request-id=\"" + _0x5c80bc + "\"]")) {
              createAndShowImage(_0x294e52, _0x1da94a, "Generated Image", _0x43283c, _0x582b03, _0x5cb4c5, _0x148835 || "");
              _0x43283c.removeAttribute("data-loading");
              if (extension_settings[extensionName].dbclike === "true") {
                _0x43283c.style.setProperty("display", "none", "important");
              } else {
                _0x43283c.disabled = false;
                _0x43283c.textContent = "生成图片";
              }
            }
          }
        }
        const _0x2bcebe = {
          id: _0x5c80bc,
          success: true,
          imageData: _0x1da94a,
          prompt: _0x1e11ef,
          change: _0x582b03,
          isVideo: _0x5cb4c5,
          fromCache: true
        };
        eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x2bcebe);
      } else {
        _0x16eaee();
      }
    });
  }
};