import { getItemImg, updateImageIndex, deleteImage, getItemBlob, dbs } from "../database.js";
import { showEditDialog } from "./dialogs.js";
import { createAndShowImage, triggerGeneration } from "./generation.js";
import { fixMp4Faststart } from "../utils.js";
async function applyVideoSrc(_0x12d149, _0x503edb, _0x40de8b = "") {
  if (_0x12d149.src && _0x12d149.src.startsWith("blob:")) {
    URL.revokeObjectURL(_0x12d149.src);
  }
  try {
    const _0x3d26e5 = _0x503edb.indexOf(",");
    const _0x479c89 = _0x503edb.slice(5, _0x503edb.indexOf(";"));
    const _0x11fa1a = _0x503edb.slice(_0x3d26e5 + 1);
    const _0xf5bd54 = 524288;
    const _0x2a2e8c = [];
    for (let _0x52d72c = 0; _0x52d72c < _0x11fa1a.length; _0x52d72c += _0xf5bd54) {
      const _0x38a10e = _0x11fa1a.slice(_0x52d72c, _0x52d72c + _0xf5bd54);
      const _0x10ce73 = atob(_0x38a10e);
      const _0x18cb09 = new Uint8Array(_0x10ce73.length);
      for (let _0x35ae0b = 0; _0x35ae0b < _0x10ce73.length; _0x35ae0b++) {
        _0x18cb09[_0x35ae0b] = _0x10ce73.charCodeAt(_0x35ae0b);
      }
      _0x2a2e8c.push(_0x18cb09);
      if (_0x2a2e8c.length % 5 === 0) {
        await new Promise(_0x4bff06 => setTimeout(_0x4bff06, 0));
      }
    }
    const _0x1525a0 = {
      type: _0x479c89
    };
    const _0x453975 = new Blob(_0x2a2e8c, _0x1525a0);
    const _0x53d99f = await fixMp4Faststart(_0x453975);
    const _0x68e81f = URL.createObjectURL(_0x53d99f);
    _0x12d149.dataset.blobUrl = _0x68e81f;
    _0x12d149.src = _0x68e81f;
    if (_0x40de8b) {
      const _0x337a78 = function () {
        _0x12d149.removeEventListener("error", _0x337a78);
        if (_0x40de8b && _0x12d149.src !== _0x40de8b) {
          console.log("[imagePreview] BlobURL 失败，回退到原始 URL:", _0x40de8b);
          _0x12d149.src = _0x40de8b;
        }
      };
      _0x12d149.addEventListener("error", _0x337a78);
    }
  } catch (_0x38a104) {
    console.warn("[imagePreview] applyVideoSrc 失败，回退:", _0x38a104);
    _0x12d149.src = _0x40de8b || _0x503edb;
  }
}
export async function downloadBlob(_0x512ab2, _0x1639f7) {
  const _0x2fffa3 = window.top.document;
  const _0x45c2a9 = window.top.URL;
  if (!_0x45c2a9) {
    console.error("window.top.URL is not available.");
    toastr.error("浏览器不支持下载功能。");
    return;
  }
  const _0x49c395 = _0x45c2a9.createObjectURL(_0x512ab2);
  const _0x5d61ac = _0x2fffa3.createElement("a");
  _0x5d61ac.href = _0x49c395;
  _0x5d61ac.download = _0x1639f7;
  _0x5d61ac.style.display = "none";
  _0x2fffa3.body.appendChild(_0x5d61ac);
  _0x5d61ac.click();
  _0x2fffa3.body.removeChild(_0x5d61ac);
  setTimeout(() => {
    _0x45c2a9.revokeObjectURL(_0x49c395);
  }, 150);
}
export function showImagePreview(_0x16911b, _0x9da886) {
  const _0x4eae2d = window.top.document;
  const _0x1671dd = _0x9da886.dataset.link;
  const _0x30e2b0 = _0x4eae2d.createElement("div");
  _0x30e2b0.className = "st-chatu8-preview-backdrop";
  _0x30e2b0.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        height: 100dvh;\n        background-color: rgba(0, 0, 0, 0.95);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        z-index: 10000;\n    ";
  const _0x110a0a = _0x4eae2d.createElement("div");
  _0x110a0a.className = "st-chatu8-preview-dialog";
  _0x110a0a.addEventListener("click", _0x2dd556 => _0x2dd556.stopPropagation());
  _0x110a0a.style.cssText = "\n        display: flex;\n        flex-direction: column;\n        width: 100vw;\n        height: 100vh;\n        height: 100dvh;\n        max-width: 100vw;\n        max-height: 100vh;\n        max-height: 100dvh;\n        padding: 5px;\n        box-sizing: border-box;\n        border-radius: 0;\n        background-color: #1a1a2e;\n        overflow: hidden;\n    ";
  const _0x4a1c2f = _0x4eae2d.createElement("div");
  _0x4a1c2f.className = "st-chatu8-preview-close";
  _0x4a1c2f.innerHTML = "&times;";
  _0x4a1c2f.onclick = () => {
    const _0x14f13b = _0x110a0a.querySelector(".st-chatu8-preview-large-image");
    if (!_0x14f13b) {
      _0x30e2b0.remove();
      return;
    }
    const _0x54ce7b = parseInt(_0x14f13b.dataset.index, 10);
    updateImageIndex(_0x1671dd, _0x54ce7b);
    const _0x2804d2 = _0x309395[_0x54ce7b]?.isVideo || false;
    const _0x5d4438 = _0x16911b.tagName === "VIDEO";
    getItemImg(_0x1671dd, _0x54ce7b).then(([_0x4dcedf, _0x2f93e4,, _0x410bf5, _0x2c0660]) => {
      if (!_0x4dcedf) {
        return;
      }
      if (_0x2804d2 !== _0x5d4438) {
        const _0x39fb98 = _0x16911b.closest(".st-chatu8-collapse-wrapper");
        const _0x57c565 = _0x16911b.closest(".st-chatu8-image-container");
        const _0x4d80f7 = _0x39fb98 ? _0x39fb98.parentElement : _0x57c565?.parentElement;
        if (_0x4d80f7) {
          createAndShowImage(_0x4d80f7, _0x4dcedf, "Generated Image", _0x9da886, _0x2f93e4, _0x410bf5, _0x2c0660 || "");
        }
      } else if (_0x16911b.tagName === "VIDEO" && _0x4dcedf.startsWith("data:")) {
        applyVideoSrc(_0x16911b, _0x4dcedf, _0x2c0660 || "");
      } else {
        _0x16911b.src = _0x4dcedf;
      }
    });
    _0x110a0a.querySelectorAll("img").forEach(_0x5f0fb6 => {
      if (_0x5f0fb6.src && _0x5f0fb6.src.startsWith("blob:")) {
        window.top.URL.revokeObjectURL(_0x5f0fb6.src);
      }
    });
    _0x110a0a.querySelectorAll("video").forEach(_0x3c2462 => {
      if (_0x3c2462.src && _0x3c2462.src.startsWith("blob:")) {
        window.top.URL.revokeObjectURL(_0x3c2462.src);
      }
    });
    _0x30e2b0.remove();
  };
  const _0x3faf26 = _0x4eae2d.createElement("div");
  _0x3faf26.className = "st-chatu8-preview-image-container";
  _0x3faf26.style.cssText = "\n        position: relative;\n        flex: 1;\n        min-height: 0;\n        overflow: hidden;\n    ";
  let _0x3fc45a = null;
  const _0x2015bf = _0x4eae2d.createElement("div");
  _0x2015bf.className = "st-chatu8-preview-large-wrapper";
  _0x2015bf.style.cssText = "\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        height: 100%;\n        min-height: 200px;\n        overflow: hidden;\n    ";
  _0x3faf26.appendChild(_0x2015bf);
  const _0x201833 = _0x4eae2d.createElement("div");
  _0x201833.className = "st-chatu8-preview-counter";
  _0x201833.style.cssText = "\n        position: absolute;\n        top: 8px;\n        left: 50%;\n        transform: translateX(-50%);\n        background: rgba(0, 0, 0, 0.7);\n        color: #fff;\n        padding: 5px 14px;\n        border-radius: 15px;\n        font-size: 12px;\n        font-weight: 500;\n        z-index: 10;\n        backdrop-filter: blur(10px);\n        border: 1px solid rgba(255, 255, 255, 0.1);\n    ";
  _0x201833.textContent = "0 / 0";
  _0x3faf26.appendChild(_0x201833);
  const _0xdb4b73 = "\n        position: absolute;\n        top: 50%;\n        transform: translateY(-50%);\n        width: 36px;\n        height: 36px;\n        background: linear-gradient(135deg, rgba(74, 144, 226, 0.8) 0%, rgba(123, 97, 255, 0.8) 100%);\n        color: white;\n        font-size: 14px;\n        font-weight: bold;\n        border-radius: 50%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        cursor: pointer;\n        z-index: 10;\n        transition: all 0.3s ease;\n        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n        border: 1px solid rgba(255, 255, 255, 0.2);\n        user-select: none;\n    ";
  const _0x1c0681 = _0x4eae2d.createElement("div");
  _0x1c0681.className = "st-chatu8-preview-nav prev";
  _0x1c0681.innerHTML = "&#10094;";
  _0x1c0681.style.cssText = _0xdb4b73 + "left: 10px;";
  _0x1c0681.onmouseenter = () => {
    _0x1c0681.style.transform = "translateY(-50%) scale(1.1)";
  };
  _0x1c0681.onmouseleave = () => {
    _0x1c0681.style.transform = "translateY(-50%)";
  };
  _0x1c0681.onclick = () => {
    _0x2e3d69((_0x40bbfb - 1 + _0xf61644.length) % _0xf61644.length);
  };
  const _0x532329 = _0x4eae2d.createElement("div");
  _0x532329.className = "st-chatu8-preview-nav next";
  _0x532329.innerHTML = "&#10095;";
  _0x532329.style.cssText = _0xdb4b73 + "right: 10px;";
  _0x532329.onmouseenter = () => {
    _0x532329.style.transform = "translateY(-50%) scale(1.1)";
  };
  _0x532329.onmouseleave = () => {
    _0x532329.style.transform = "translateY(-50%)";
  };
  _0x532329.onclick = () => {
    _0x2e3d69((_0x40bbfb + 1) % _0xf61644.length);
  };
  _0x3faf26.appendChild(_0x1c0681);
  _0x3faf26.appendChild(_0x532329);
  const _0x2a0291 = _0x4eae2d.createElement("div");
  _0x2a0291.className = "st-chatu8-preview-thumbnail-container";
  const _0x3f7480 = _0x4eae2d.createElement("div");
  _0x3f7480.className = "st-chatu8-preview-actions";
  _0x3f7480.style.cssText = "\n        display: flex;\n        justify-content: center;\n        gap: 10px;\n        padding: 6px 0;\n        flex-shrink: 0;\n    ";
  const _0x2a26ab = _0x4eae2d.createElement("button");
  _0x2a26ab.textContent = "下载当前媒体";
  _0x2a26ab.className = "st-chatu8-preview-action-button";
  _0x2a26ab.onclick = async () => {
    try {
      toastr.info("正在准备下载...");
      const _0x37670b = await getItemBlob(_0x1671dd, _0x40bbfb);
      if (_0x37670b) {
        const _0x487b7f = _0x309395[_0x40bbfb];
        const _0xfb4133 = _0x487b7f && _0x487b7f.isVideo ? "mp4" : "png";
        const _0x544c61 = _0x1671dd.replace(/[^a-z0-9]/gi, "_").substring(0, 50) + "-" + _0x40bbfb + "." + _0xfb4133;
        await downloadBlob(_0x37670b, _0x544c61);
      } else {
        toastr.error("无法加载图片数据进行下载。");
        console.error("Failed to get image blob for download.");
      }
    } catch (_0x1066b7) {
      toastr.error("下载过程中发生错误。");
      console.error("Error during download:", _0x1066b7);
    }
  };
  const _0x370fdc = _0x4eae2d.createElement("button");
  _0x370fdc.textContent = "删除当前图片";
  _0x370fdc.className = "st-chatu8-preview-action-button danger";
  _0x3f7480.appendChild(_0x2a26ab);
  _0x3f7480.appendChild(_0x370fdc);
  _0x110a0a.appendChild(_0x4a1c2f);
  _0x110a0a.appendChild(_0x3faf26);
  _0x110a0a.appendChild(_0x3f7480);
  _0x30e2b0.appendChild(_0x110a0a);
  _0x4eae2d.body.appendChild(_0x30e2b0);
  let _0xf61644 = [];
  let _0x309395 = [];
  let _0x40bbfb = 0;
  _0x370fdc.onclick = async () => {
    if (!window.top.confirm("确定要删除这张图片吗？")) {
      return;
    }
    const _0x2be753 = _0x1671dd;
    const _0x3c829c = _0x40bbfb;
    await deleteImage(_0x2be753, _0x3c829c);
    toastr.success("图片已删除");
    const _0x3a8502 = CryptoJS.MD5(_0x2be753).toString();
    const _0x1beaf5 = await dbs.getMergedAndSortedImages(_0x3a8502);
    if (_0x1beaf5.images.length === 0) {
      const _0x13567e = _0x16911b.closest(".st-chatu8-collapse-wrapper");
      const _0x226014 = _0x16911b.closest(".st-chatu8-image-container");
      if (_0x13567e) {
        _0x13567e.remove();
      } else if (_0x226014) {
        _0x226014.remove();
      }
      if (_0x9da886) {
        _0x9da886.style.display = "inline-block";
        _0x9da886.textContent = "生成图片";
        _0x9da886.disabled = false;
      }
      _0x30e2b0.remove();
      return;
    }
    _0x309395 = _0x1beaf5.images.map(_0x3267d9 => ({
      isVideo: _0x3267d9.isVideo || false
    }));
    const _0x30f23f = _0x1beaf5.images.map(async _0x516c20 => {
      const _0x2ec0be = _0x516c20.isVideo || false;
      if (_0x516c20.source === "server" && _0x516c20.path) {
        try {
          const _0x49af6d = await fetch(_0x516c20.path);
          if (_0x49af6d.ok) {
            return await _0x49af6d.blob();
          }
        } catch (_0x1c8ae6) {
          console.error("Failed to fetch media blob:", _0x1c8ae6);
        }
      } else if (_0x516c20.source === "db" && _0x516c20.uuid) {
        const _0x562062 = await dbs.storeReadOnly(_0x516c20.uuid);
        if (_0x562062 && _0x562062.data) {
          const _0xaad86a = _0x2ec0be ? "video/mp4" : "image/png";
          const _0x36020b = {
            type: _0xaad86a
          };
          return new Blob([_0x562062.data], _0x36020b);
        }
      }
      return null;
    });
    const _0x6098ee = await Promise.all(_0x30f23f);
    const _0x10d2d2 = [];
    _0xf61644 = _0x6098ee.filter((_0x10e752, _0x414526) => {
      if (_0x10e752 !== null) {
        _0x10d2d2.push(_0x414526);
        return true;
      }
      return false;
    });
    _0x309395 = _0x10d2d2.map(_0x224b44 => _0x309395[_0x224b44]);
    _0x2a0291.querySelectorAll("img").forEach(_0x5a8d9e => {
      if (_0x5a8d9e.src && _0x5a8d9e.src.startsWith("blob:")) {
        window.top.URL.revokeObjectURL(_0x5a8d9e.src);
      }
    });
    _0x2a0291.innerHTML = "";
    const _0xa84ddf = _0x10d2d2.map(_0xb841b7 => _0x1beaf5.images[_0xb841b7]);
    const _0x367c23 = _0xa84ddf.map(async (_0x457b96, _0x1fe0b9) => {
      const _0x4de2e6 = _0x457b96.isVideo || false;
      if (_0x4de2e6) {
        if (_0x457b96.source === "server" && _0x457b96.thumbnail_path) {
          try {
            const _0x20fe22 = await fetch(_0x457b96.thumbnail_path);
            if (_0x20fe22.ok) {
              return await _0x20fe22.blob();
            }
          } catch (_0x2bee24) {
            console.warn("[iframe] Failed to fetch video thumbnail from server:", _0x2bee24);
          }
        }
        if (_0x457b96.thumbnail_uuid) {
          const _0x45f1f9 = await dbs.getImageThumbnailBlobByUUID(_0x457b96.thumbnail_uuid);
          if (_0x45f1f9) {
            return _0x45f1f9;
          }
        }
        return null;
      }
      return _0xf61644[_0x1fe0b9];
    });
    const _0x105091 = await Promise.all(_0x367c23);
    _0x105091.forEach((_0x491985, _0x123eaa) => {
      const _0x4af64d = _0x4eae2d.createElement("img");
      if (_0x491985) {
        _0x4af64d.src = window.top.URL.createObjectURL(_0x491985);
      } else {
        _0x4af64d.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiMxYTFhMmUiLz48cG9seWdvbiBwb2ludHM9IjUwLDQwIDUwLDg4IDkwLDY0IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNSkiLz48dGV4dCB4PSI2NCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC41KSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VklERU88L3RleHQ+PC9zdmc+";
        _0x4af64d.alt = "Video";
      }
      _0x4af64d.className = "st-chatu8-preview-thumbnail";
      _0x4af64d.dataset.index = String(_0x123eaa);
      _0x4af64d.onclick = () => _0x2e3d69(_0x123eaa);
      _0x2a0291.appendChild(_0x4af64d);
    });
    if (_0xf61644.length > 0) {
      let _0x31d385 = _0x40bbfb;
      if (_0x31d385 >= _0xf61644.length) {
        _0x31d385 = _0xf61644.length - 1;
      }
      _0x2e3d69(_0x31d385);
      const [_0x268968, _0x1d4605,, _0x5bbb32, _0x5da364] = await getItemImg(_0x2be753, _0x31d385);
      if (_0x268968) {
        const _0x5ce6d7 = _0x5bbb32 || false;
        const _0x553636 = _0x16911b.tagName === "VIDEO";
        if (_0x5ce6d7 !== _0x553636) {
          const _0x167f5e = _0x16911b.closest(".st-chatu8-collapse-wrapper");
          const _0x512ae4 = _0x16911b.closest(".st-chatu8-image-container");
          const _0x314bca = _0x167f5e ? _0x167f5e.parentElement : _0x512ae4?.parentElement;
          if (_0x314bca) {
            createAndShowImage(_0x314bca, _0x268968, "Generated Image", _0x9da886, _0x1d4605, _0x5ce6d7, _0x5da364 || "");
          }
        } else if (_0x16911b.tagName === "VIDEO" && _0x268968.startsWith("data:")) {
          applyVideoSrc(_0x16911b, _0x268968, _0x5da364 || "");
        } else {
          _0x16911b.src = _0x268968;
        }
      }
    }
  };
  async function _0x2e3d69(_0x117412) {
    if (_0x117412 >= 0 && _0x117412 < _0xf61644.length) {
      _0x40bbfb = _0x117412;
      _0x201833.textContent = _0x40bbfb + 1 + " / " + _0xf61644.length;
      const _0x5afff6 = _0xf61644.length > 1;
      _0x1c0681.style.display = _0x5afff6 ? "flex" : "none";
      _0x532329.style.display = _0x5afff6 ? "flex" : "none";
      if (_0x3fc45a) {
        if (_0x3fc45a.src && _0x3fc45a.src.startsWith("blob:")) {
          window.top.URL.revokeObjectURL(_0x3fc45a.src);
        }
        _0x3fc45a.remove();
      }
      const _0x247cd5 = _0xf61644[_0x117412];
      const _0x47aafc = _0x309395[_0x117412];
      const _0x24a669 = _0x47aafc && _0x47aafc.isVideo;
      if (_0x247cd5) {
        const _0xa06159 = window.top.URL.createObjectURL(_0x247cd5);
        if (_0x24a669) {
          _0x3fc45a = _0x4eae2d.createElement("video");
          _0x3fc45a.src = _0xa06159;
          _0x3fc45a.controls = true;
          _0x3fc45a.loop = true;
          _0x3fc45a.muted = true;
          _0x3fc45a.playsInline = true;
          _0x3fc45a.autoplay = true;
          _0x3fc45a.className = "st-chatu8-preview-large-image";
          _0x3fc45a.style.cssText = "\n                        max-width: 100%;\n                        max-height: 100%;\n                        object-fit: contain;\n                        border-radius: 8px;\n                    ";
          _0x3fc45a.onerror = function () {
            console.warn("[iframe] Preview video cannot be played");
            const _0x49179c = _0x4eae2d.createElement("div");
            _0x49179c.style.cssText = "\n                            display: flex;\n                            flex-direction: column;\n                            align-items: center;\n                            justify-content: center;\n                            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);\n                            border-radius: 8px;\n                            padding: 40px;\n                            min-height: 200px;\n                            color: #fff;\n                            text-align: center;\n                        ";
            _0x49179c.innerHTML = "\n                            <div style=\"font-size: 64px; margin-bottom: 15px;\">🎬</div>\n                            <div style=\"margin-bottom: 15px; opacity: 0.8;\">视频格式不支持浏览器播放</div>\n                            <a href=\"" + _0xa06159 + "\" download=\"video.mp4\" \n                               style=\"background: rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 4px; color: #fff; text-decoration: none;\"\n                               onclick=\"event.stopPropagation()\">\n                                📥 下载视频\n                            </a>\n                        ";
            _0x49179c.className = "st-chatu8-preview-large-image";
            _0x49179c.dataset.index = String(_0x117412);
            if (_0x3fc45a.parentNode) {
              _0x3fc45a.parentNode.replaceChild(_0x49179c, _0x3fc45a);
              _0x3fc45a = _0x49179c;
            }
          };
        } else {
          _0x3fc45a = _0x4eae2d.createElement("img");
          _0x3fc45a.src = _0xa06159;
          _0x3fc45a.className = "st-chatu8-preview-large-image";
          _0x3fc45a.style.cssText = "\n                        max-width: 100%;\n                        max-height: 100%;\n                        object-fit: contain;\n                        border-radius: 8px;\n                    ";
        }
        _0x3fc45a.dataset.index = String(_0x117412);
        _0x2015bf.appendChild(_0x3fc45a);
      } else {
        console.error("Could not find media blob in array for index " + _0x117412);
      }
      const _0x2ab0e5 = _0x2a0291.querySelectorAll(".st-chatu8-preview-thumbnail");
      _0x2ab0e5.forEach((_0x55a766, _0x1a9025) => {
        if (_0x1a9025 === _0x117412) {
          _0x55a766.classList.add("active");
        } else {
          _0x55a766.classList.remove("active");
        }
      });
      if (_0x2ab0e5[_0x117412]) {
        _0x2ab0e5[_0x117412].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }
  (async () => {
    const _0x5dae9e = CryptoJS.MD5(_0x1671dd).toString();
    const _0x5f1ca8 = await dbs.getMergedAndSortedImages(_0x5dae9e);
    if (_0x5f1ca8.images.length === 0) {
      return;
    }
    _0x309395 = _0x5f1ca8.images.map(_0x1c023e => ({
      isVideo: _0x1c023e.isVideo || false
    }));
    const _0x112e8e = _0x5f1ca8.images.map(async _0x58c237 => {
      const _0x51bf51 = _0x58c237.isVideo || false;
      if (_0x58c237.source === "server" && _0x58c237.path) {
        try {
          const _0x399628 = await fetch(_0x58c237.path);
          if (_0x399628.ok) {
            return await _0x399628.blob();
          }
        } catch (_0x551705) {
          console.error("Failed to fetch media blob:", _0x551705);
        }
      } else if (_0x58c237.source === "db" && _0x58c237.uuid) {
        const _0x595b62 = await dbs.storeReadOnly(_0x58c237.uuid);
        if (_0x595b62 && _0x595b62.data) {
          const _0xf90a01 = _0x51bf51 ? "video/mp4" : "image/png";
          const _0x16b902 = {
            type: _0xf90a01
          };
          return new Blob([_0x595b62.data], _0x16b902);
        }
      }
      return null;
    });
    const _0x14a888 = await Promise.all(_0x112e8e);
    const _0x3bd669 = [];
    _0xf61644 = _0x14a888.filter((_0x2dd2da, _0xfda836) => {
      if (_0x2dd2da !== null) {
        _0x3bd669.push(_0xfda836);
        return true;
      }
      return false;
    });
    _0x309395 = _0x3bd669.map(_0x3b2e80 => _0x309395[_0x3b2e80]);
    if (_0xf61644.length > 0) {
      const _0x5e0b1c = _0x3bd669.map(_0x4fe8ac => _0x5f1ca8.images[_0x4fe8ac]);
      const _0x51e996 = _0x5e0b1c.map(async (_0x48587e, _0x15989d) => {
        const _0x287051 = _0x48587e.isVideo || false;
        if (_0x287051) {
          if (_0x48587e.source === "server" && _0x48587e.thumbnail_path) {
            try {
              const _0x1c56ac = await fetch(_0x48587e.thumbnail_path);
              if (_0x1c56ac.ok) {
                return await _0x1c56ac.blob();
              }
            } catch (_0x3fef84) {
              console.warn("[iframe] Failed to fetch video thumbnail from server:", _0x3fef84);
            }
          }
          if (_0x48587e.thumbnail_uuid) {
            const _0x87a2e9 = await dbs.getImageThumbnailBlobByUUID(_0x48587e.thumbnail_uuid);
            if (_0x87a2e9) {
              return _0x87a2e9;
            }
          }
          console.warn("[iframe] No thumbnail available for video, index:", _0x15989d);
          return null;
        }
        return _0xf61644[_0x15989d];
      });
      const _0x2e02d0 = await Promise.all(_0x51e996);
      _0x2e02d0.forEach((_0x2e15e4, _0x57cb87) => {
        const _0x43c7d5 = _0x4eae2d.createElement("img");
        if (_0x2e15e4) {
          _0x43c7d5.src = window.top.URL.createObjectURL(_0x2e15e4);
        } else {
          _0x43c7d5.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiMxYTFhMmUiLz48cG9seWdvbiBwb2ludHM9IjUwLDQwIDUwLDg4IDkwLDY0IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNSkiLz48dGV4dCB4PSI2NCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC41KSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VklERU88L3RleHQ+PC9zdmc+";
          _0x43c7d5.alt = "Video";
        }
        _0x43c7d5.className = "st-chatu8-preview-thumbnail";
        _0x43c7d5.dataset.index = String(_0x57cb87);
        _0x43c7d5.onclick = () => _0x2e3d69(_0x57cb87);
        _0x2a0291.appendChild(_0x43c7d5);
      });
      _0x2e3d69(_0x5f1ca8.currentIndex);
    }
  })();
}