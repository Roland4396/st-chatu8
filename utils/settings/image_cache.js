import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { getAllImageMetadata, deleteMultipleImages, deleteImagesByUuids, getImageBlobByUUID, getImageThumbnailBlobByUUID, syncServerImagesWithStorage } from "../database.js";
import { stylishConfirm } from "../ui_common.js";
let allCachedImages = [];
let imageCacheCurrentPage = 1;
const imageCacheItemsPerPage = 15;
let selectedImages = new Set();
let imageObserver;
let isMultiSelectMode = false;
function showCacheImagePreview(_0x42215f) {
  const _0x1949af = document;
  let _0x30f51f = allCachedImages.findIndex(_0x251465 => _0x251465.uuid === _0x42215f);
  if (_0x30f51f === -1) {
    _0x30f51f = 0;
  }
  const _0x135a22 = _0x1949af.createElement("div");
  _0x135a22.className = "st-chatu8-preview-backdrop";
  _0x135a22.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        height: 100dvh;\n        background-color: rgba(0, 0, 0, 0.95);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        z-index: 10000;\n    ";
  const _0x101fc3 = _0x1949af.createElement("div");
  _0x101fc3.className = "st-chatu8-preview-dialog";
  _0x101fc3.addEventListener("click", _0x1662bf => _0x1662bf.stopPropagation());
  _0x101fc3.style.cssText = "\n        display: flex;\n        flex-direction: column;\n        width: 100vw;\n        height: 100vh;\n        height: 100dvh;\n        max-width: 100vw;\n        max-height: 100vh;\n        max-height: 100dvh;\n        padding: 5px;\n        box-sizing: border-box;\n        border-radius: 0;\n        background-color: #1a1a2e;\n        overflow: hidden;\n    ";
  const _0x3f17e7 = _0x1949af.createElement("div");
  _0x3f17e7.className = "st-chatu8-preview-close";
  _0x3f17e7.innerHTML = "&times;";
  _0x3f17e7.onclick = () => {
    _0x1949af.removeEventListener("keydown", _0x364a5b);
    if (_0xce0dab && _0xce0dab.src && _0xce0dab.src.startsWith("blob:")) {
      URL.revokeObjectURL(_0xce0dab.src);
    }
    _0x135a22.remove();
  };
  const _0x3fb7f4 = _0x1949af.createElement("div");
  _0x3fb7f4.className = "st-chatu8-preview-image-container";
  _0x3fb7f4.style.cssText = "\n        position: relative;\n        flex: 1;\n        min-height: 0;\n        overflow: hidden;\n    ";
  const _0x23fd3b = "\n        position: absolute;\n        top: 50%;\n        transform: translateY(-50%);\n        width: 36px;\n        height: 36px;\n        background: linear-gradient(135deg, rgba(74, 144, 226, 0.8) 0%, rgba(123, 97, 255, 0.8) 100%);\n        color: white;\n        font-size: 14px;\n        font-weight: bold;\n        border-radius: 50%;\n        border: 1px solid rgba(255, 255, 255, 0.2);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        cursor: pointer;\n        z-index: 10;\n        transition: all 0.3s ease;\n        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n        user-select: none;\n    ";
  const _0x3a1b1f = _0x1949af.createElement("div");
  _0x3a1b1f.className = "st-chatu8-preview-nav prev";
  _0x3a1b1f.innerHTML = "&#10094;";
  _0x3a1b1f.style.cssText = _0x23fd3b + "left: 10px;";
  _0x3a1b1f.title = "上一张 (←)";
  _0x3a1b1f.onmouseenter = () => {
    _0x3a1b1f.style.transform = "translateY(-50%) scale(1.1)";
  };
  _0x3a1b1f.onmouseleave = () => {
    _0x3a1b1f.style.transform = "translateY(-50%)";
  };
  _0x3a1b1f.onclick = () => _0x53a3ac(_0x30f51f - 1);
  const _0x30f387 = _0x1949af.createElement("div");
  _0x30f387.className = "st-chatu8-preview-nav next";
  _0x30f387.innerHTML = "&#10095;";
  _0x30f387.style.cssText = _0x23fd3b + "right: 10px;";
  _0x30f387.title = "下一张 (→)";
  _0x30f387.onmouseenter = () => {
    _0x30f387.style.transform = "translateY(-50%) scale(1.1)";
  };
  _0x30f387.onmouseleave = () => {
    _0x30f387.style.transform = "translateY(-50%)";
  };
  _0x30f387.onclick = () => _0x53a3ac(_0x30f51f + 1);
  const _0x3b05d2 = _0x1949af.createElement("div");
  _0x3b05d2.className = "st-chatu8-preview-large-wrapper";
  _0x3b05d2.style.cssText = "\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        height: 100%;\n        min-height: 200px;\n        overflow: hidden;\n    ";
  let _0xce0dab = null;
  const _0x21cdb4 = _0x1949af.createElement("div");
  _0x21cdb4.className = "st-chatu8-preview-counter";
  _0x21cdb4.style.cssText = "\n        position: absolute;\n        top: 8px;\n        left: 50%;\n        transform: translateX(-50%);\n        background: rgba(0, 0, 0, 0.7);\n        color: #fff;\n        padding: 5px 14px;\n        border-radius: 15px;\n        font-size: 12px;\n        font-weight: 500;\n        z-index: 10;\n        backdrop-filter: blur(10px);\n        border: 1px solid rgba(255, 255, 255, 0.1);\n    ";
  _0x3fb7f4.appendChild(_0x3a1b1f);
  _0x3fb7f4.appendChild(_0x3b05d2);
  _0x3fb7f4.appendChild(_0x30f387);
  _0x3fb7f4.appendChild(_0x21cdb4);
  const _0x5b1dd5 = _0x1949af.createElement("div");
  _0x5b1dd5.className = "st-chatu8-preview-actions";
  _0x5b1dd5.style.cssText = "\n        display: flex;\n        justify-content: center;\n        gap: 10px;\n        padding: 6px 0;\n        flex-shrink: 0;\n    ";
  const _0x1a1e54 = _0x1949af.createElement("button");
  _0x1a1e54.textContent = "下载当前媒体";
  _0x1a1e54.className = "st-chatu8-preview-action-button";
  _0x1a1e54.onclick = async () => {
    const _0x230e37 = _0xce0dab?.dataset.uuid;
    const _0x2d0add = _0xce0dab?.dataset.source;
    const _0x14d4bb = _0xce0dab?.dataset.path;
    const _0x54567a = _0xce0dab?.dataset.isVideo === "true";
    let _0x42ec73;
    if (_0x2d0add === "server" && _0x14d4bb) {
      try {
        const _0x2f93fc = await fetch(_0x14d4bb);
        if (_0x2f93fc.ok) {
          _0x42ec73 = await _0x2f93fc.blob();
        }
      } catch (_0x14c1d0) {
        console.error("Failed to fetch media from server:", _0x14c1d0);
      }
    } else {
      _0x42ec73 = await getImageBlobByUUID(_0x230e37);
    }
    if (_0x42ec73) {
      const _0x534854 = URL.createObjectURL(_0x42ec73);
      const _0x2718d4 = _0x1949af.createElement("a");
      _0x2718d4.href = _0x534854;
      const _0x470b30 = _0x54567a ? "mp4" : "png";
      _0x2718d4.download = _0x230e37 + "." + _0x470b30;
      _0x1949af.body.appendChild(_0x2718d4);
      _0x2718d4.click();
      _0x1949af.body.removeChild(_0x2718d4);
      URL.revokeObjectURL(_0x534854);
    } else {
      alert("无法加载媒体数据进行下载。");
    }
  };
  const _0x2ee53a = _0x1949af.createElement("button");
  _0x2ee53a.textContent = "删除当前媒体";
  _0x2ee53a.className = "st-chatu8-preview-action-button danger";
  _0x5b1dd5.appendChild(_0x1a1e54);
  _0x5b1dd5.appendChild(_0x2ee53a);
  _0x101fc3.appendChild(_0x3f17e7);
  _0x101fc3.appendChild(_0x3fb7f4);
  _0x101fc3.appendChild(_0x5b1dd5);
  _0x135a22.appendChild(_0x101fc3);
  _0x1949af.body.appendChild(_0x135a22);
  function _0x4198eb() {
    _0x3a1b1f.style.visibility = _0x30f51f > 0 ? "visible" : "hidden";
    _0x30f387.style.visibility = _0x30f51f < allCachedImages.length - 1 ? "visible" : "hidden";
    _0x21cdb4.textContent = _0x30f51f + 1 + " / " + allCachedImages.length;
  }
  function _0x53a3ac(_0xc4c6ee) {
    if (_0xc4c6ee < 0 || _0xc4c6ee >= allCachedImages.length) {
      return;
    }
    _0x30f51f = _0xc4c6ee;
    const _0x2bd859 = allCachedImages[_0x30f51f].uuid;
    _0x421117(_0x2bd859);
    _0x4198eb();
  }
  function _0x364a5b(_0x375590) {
    if (_0x375590.key === "ArrowLeft") {
      _0x375590.preventDefault();
      _0x53a3ac(_0x30f51f - 1);
    } else if (_0x375590.key === "ArrowRight") {
      _0x375590.preventDefault();
      _0x53a3ac(_0x30f51f + 1);
    } else if (_0x375590.key === "Escape") {
      _0x3f17e7.onclick();
    }
  }
  _0x1949af.addEventListener("keydown", _0x364a5b);
  _0x2ee53a.onclick = async () => {
    if (!confirm("确定要删除这个媒体吗？")) {
      return;
    }
    const _0x1e1585 = _0xce0dab?.dataset.uuid;
    if (!_0x1e1585) {
      return;
    }
    await deleteImagesByUuids([_0x1e1585]);
    toastr.success("媒体已删除");
    const _0x4d5555 = _0x1949af.querySelector(".st-chatu8-image-cache-item[data-uuid=\"" + _0x1e1585 + "\"]");
    if (_0x4d5555) {
      _0x4d5555.remove();
    }
    const _0x13bc00 = allCachedImages.findIndex(_0x37adf2 => _0x37adf2.uuid === _0x1e1585);
    if (_0x13bc00 > -1) {
      allCachedImages.splice(_0x13bc00, 1);
    }
    if (allCachedImages.length > 0) {
      if (_0x30f51f >= allCachedImages.length) {
        _0x30f51f = allCachedImages.length - 1;
      }
      _0x53a3ac(_0x30f51f);
      updateImageCacheInfo();
    } else {
      _0x1949af.removeEventListener("keydown", _0x364a5b);
      _0x135a22.remove();
      updateImageCacheInfo();
    }
  };
  async function _0x421117(_0x52ae08) {
    try {
      const _0x59a987 = allCachedImages.find(_0x5b7152 => _0x5b7152.uuid === _0x52ae08);
      const _0xdc72ab = _0x59a987?.isVideo || false;
      let _0x333209;
      if (_0x59a987 && _0x59a987.source === "server" && _0x59a987.path) {
        try {
          const _0x5b521f = await fetch(_0x59a987.path);
          if (_0x5b521f.ok) {
            _0x333209 = await _0x5b521f.blob();
          }
        } catch (_0x597169) {
          console.error("Failed to fetch media from server:", _0x597169);
        }
      } else {
        _0x333209 = await getImageBlobByUUID(_0x52ae08);
      }
      if (_0xce0dab) {
        if (_0xce0dab.src && _0xce0dab.src.startsWith("blob:")) {
          URL.revokeObjectURL(_0xce0dab.src);
        }
        _0xce0dab.remove();
      }
      if (_0x333209) {
        const _0x410113 = URL.createObjectURL(_0x333209);
        if (_0xdc72ab) {
          _0xce0dab = _0x1949af.createElement("video");
          _0xce0dab.src = _0x410113;
          _0xce0dab.controls = true;
          _0xce0dab.loop = true;
          _0xce0dab.muted = true;
          _0xce0dab.playsInline = true;
          _0xce0dab.autoplay = true;
          _0xce0dab.style.cssText = "\n                        max-width: 100%;\n                        max-height: 100%;\n                        object-fit: contain;\n                        border-radius: 8px;\n                    ";
          _0xce0dab.onerror = function () {
            console.warn("[image_cache] Video cannot be played");
            const _0x387951 = _0x1949af.createElement("div");
            _0x387951.style.cssText = "\n                            display: flex;\n                            flex-direction: column;\n                            align-items: center;\n                            justify-content: center;\n                            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);\n                            border-radius: 8px;\n                            padding: 40px;\n                            min-height: 200px;\n                            color: #fff;\n                            text-align: center;\n                        ";
            _0x387951.innerHTML = "\n                            <div style=\"font-size: 64px; margin-bottom: 15px;\">🎬</div>\n                            <div style=\"margin-bottom: 15px; opacity: 0.8;\">视频格式不支持浏览器播放</div>\n                            <a href=\"" + _0x410113 + "\" download=\"video.mp4\" \n                               style=\"background: rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 4px; color: #fff; text-decoration: none;\">\n                                📥 下载视频\n                            </a>\n                        ";
            _0x387951.className = "st-chatu8-preview-large-image";
            _0x387951.dataset.uuid = _0x52ae08;
            _0x387951.dataset.isVideo = "true";
            if (_0x59a987) {
              _0x387951.dataset.source = _0x59a987.source;
              if (_0x59a987.path) {
                _0x387951.dataset.path = _0x59a987.path;
              }
            }
            if (_0xce0dab.parentNode) {
              _0xce0dab.parentNode.replaceChild(_0x387951, _0xce0dab);
              _0xce0dab = _0x387951;
            }
          };
        } else {
          _0xce0dab = _0x1949af.createElement("img");
          _0xce0dab.src = _0x410113;
          _0xce0dab.style.cssText = "\n                        max-width: 100%;\n                        max-height: 100%;\n                        object-fit: contain;\n                        border-radius: 8px;\n                    ";
        }
        _0xce0dab.className = "st-chatu8-preview-large-image";
        _0xce0dab.dataset.uuid = _0x52ae08;
        _0xce0dab.dataset.isVideo = _0xdc72ab ? "true" : "false";
        if (_0x59a987) {
          _0xce0dab.dataset.source = _0x59a987.source;
          if (_0x59a987.path) {
            _0xce0dab.dataset.path = _0x59a987.path;
          }
        }
        _0x3b05d2.appendChild(_0xce0dab);
      } else {
        const _0x5f91d5 = _0x1949af.createElement("div");
        _0x5f91d5.textContent = "加载失败";
        _0x5f91d5.dataset.uuid = _0x52ae08;
        _0xce0dab = _0x5f91d5;
        _0x3b05d2.appendChild(_0x5f91d5);
      }
    } catch (_0x34ae32) {
      console.error("[image_cache] loadImage error:", _0x34ae32);
      if (_0xce0dab) {
        if (_0xce0dab.src && _0xce0dab.src.startsWith("blob:")) {
          URL.revokeObjectURL(_0xce0dab.src);
        }
        _0xce0dab.remove();
      }
      const _0x1eb90f = _0x1949af.createElement("div");
      _0x1eb90f.style.cssText = "\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                justify-content: center;\n                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);\n                border-radius: 8px;\n                padding: 40px;\n                min-height: 200px;\n                color: #fff;\n                text-align: center;\n            ";
      _0x1eb90f.innerHTML = "\n                <div style=\"font-size: 64px; margin-bottom: 15px;\">⚠️</div>\n                <div style=\"margin-bottom: 15px; opacity: 0.8;\">媒体数据已损坏，无法加载</div>\n                <div style=\"font-size: 12px; opacity: 0.5;\">可点击下方\"删除当前媒体\"按钮清理此条目</div>\n            ";
      _0x1eb90f.className = "st-chatu8-preview-large-image";
      _0x1eb90f.dataset.uuid = _0x52ae08;
      _0x1eb90f.dataset.isVideo = "false";
      _0xce0dab = _0x1eb90f;
      _0x3b05d2.appendChild(_0x1eb90f);
    }
  }
  _0x421117(_0x42215f);
  _0x4198eb();
}
function displayCachePage(_0x1c2519) {
  const _0x2af3d = document.getElementById("image-cache-grid");
  if (!_0x2af3d) {
    return;
  }
  _0x2af3d.querySelectorAll("img").forEach(_0x48af7b => {
    if (_0x48af7b.src.startsWith("blob:")) {
      URL.revokeObjectURL(_0x48af7b.src);
    }
  });
  _0x2af3d.innerHTML = "";
  const _0x59aa13 = (_0x1c2519 - 1) * imageCacheItemsPerPage;
  const _0x43d1b1 = _0x59aa13 + imageCacheItemsPerPage;
  const _0x123e11 = allCachedImages.slice(_0x59aa13, _0x43d1b1);
  if (imageObserver) {
    imageObserver.disconnect();
  }
  imageObserver = new IntersectionObserver((_0x459b1f, _0x36a2ff) => {
    _0x459b1f.forEach(_0x11cb1c => {
      if (_0x11cb1c.isIntersecting) {
        const _0x26f5fd = _0x11cb1c.target;
        const _0x285e83 = _0x26f5fd.dataset.uuid;
        const _0x51d80c = _0x26f5fd.dataset.thumbnailUuid;
        const _0x54926a = _0x26f5fd.dataset.thumbnailPath;
        const _0x375127 = _0x26f5fd.dataset.source;
        const _0x30d454 = _0x26f5fd.querySelector("img");
        let _0x5647cb;
        if (_0x375127 === "server" && _0x54926a) {
          _0x5647cb = fetch(_0x54926a).then(_0xeeabf8 => _0xeeabf8.ok ? _0xeeabf8.blob() : null).catch(() => null);
        } else if (_0x51d80c) {
          _0x5647cb = getImageThumbnailBlobByUUID(_0x51d80c);
        } else {
          _0x5647cb = getImageBlobByUUID(_0x285e83);
        }
        _0x5647cb.then(_0x1a647b => {
          if (_0x1a647b) {
            _0x30d454.src = URL.createObjectURL(_0x1a647b);
          } else {
            _0x30d454.alt = "加载失败";
          }
        }).catch(() => {
          _0x30d454.alt = "加载失败";
        });
        _0x36a2ff.unobserve(_0x26f5fd);
      }
    });
  }, {
    rootMargin: "200px"
  });
  _0x123e11.forEach(_0x22b41f => {
    const _0x532b28 = document.createElement("div");
    _0x532b28.className = "st-chatu8-image-cache-item";
    _0x532b28.dataset.uuid = _0x22b41f.uuid;
    _0x532b28.dataset.md5 = _0x22b41f.md5;
    _0x532b28.dataset.source = _0x22b41f.source;
    _0x532b28.dataset.isVideo = _0x22b41f.isVideo ? "true" : "false";
    if (_0x22b41f.thumbnail_uuid) {
      _0x532b28.dataset.thumbnailUuid = _0x22b41f.thumbnail_uuid;
    }
    if (_0x22b41f.thumbnail_path) {
      _0x532b28.dataset.thumbnailPath = _0x22b41f.thumbnail_path;
    }
    if (selectedImages.has(_0x22b41f.uuid)) {
      _0x532b28.classList.add("selected");
    }
    const _0x3f693b = document.createElement("img");
    _0x3f693b.dataset.src = "placeholder";
    if (_0x22b41f.isVideo) {
      const _0x3b66ab = document.createElement("div");
      _0x3b66ab.className = "st-chatu8-video-icon";
      _0x3b66ab.innerHTML = "<i class=\"fa-solid fa-video\"></i>";
      _0x3b66ab.style.cssText = "position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 4px 6px; border-radius: 4px; font-size: 12px;";
      _0x532b28.style.position = "relative";
      _0x532b28.appendChild(_0x3b66ab);
    }
    const _0xd461b6 = document.createElement("div");
    _0xd461b6.className = "st-chatu8-image-info";
    _0xd461b6.textContent = new Date(_0x22b41f.timestamp).toLocaleString();
    _0x532b28.appendChild(_0x3f693b);
    _0x532b28.appendChild(_0xd461b6);
    _0x2af3d.appendChild(_0x532b28);
    imageObserver.observe(_0x532b28);
    _0x532b28.addEventListener("click", () => {
      if (isMultiSelectMode) {
        if (selectedImages.has(_0x22b41f.uuid)) {
          selectedImages.delete(_0x22b41f.uuid);
          _0x532b28.classList.remove("selected");
        } else {
          selectedImages.add(_0x22b41f.uuid);
          _0x532b28.classList.add("selected");
        }
        updateImageCacheInfo();
      } else {
        showCacheImagePreview(_0x22b41f.uuid);
      }
    });
  });
  updateImageCachePagination();
}
function updateImageCachePagination() {
  const _0x507472 = document.getElementById("image-cache-pagination");
  const _0x274e0f = document.getElementById("image-cache-jump-container");
  const _0x168aa9 = document.getElementById("image-cache-jump-input");
  if (!_0x507472 || !_0x274e0f || !_0x168aa9) {
    return;
  }
  Array.from(_0x507472.childNodes).forEach(_0xed300b => {
    if (_0xed300b.id !== "image-cache-jump-container") {
      _0x507472.removeChild(_0xed300b);
    }
  });
  const _0x344b32 = Math.ceil(allCachedImages.length / imageCacheItemsPerPage);
  if (_0x344b32 <= 1) {
    _0x274e0f.style.display = "none";
    return;
  }
  _0x274e0f.style.display = "inline-block";
  _0x168aa9.max = _0x344b32;
  _0x168aa9.value = imageCacheCurrentPage;
  const _0x348f34 = document.createElement("button");
  _0x348f34.className = "st-chatu8-btn";
  _0x348f34.innerHTML = "<i class=\"fa-solid fa-arrow-left\"></i>";
  _0x348f34.disabled = imageCacheCurrentPage === 1;
  _0x348f34.addEventListener("click", () => {
    if (imageCacheCurrentPage > 1) {
      imageCacheCurrentPage--;
      displayCachePage(imageCacheCurrentPage);
    }
  });
  const _0x3278b2 = document.createElement("button");
  _0x3278b2.className = "st-chatu8-btn";
  _0x3278b2.innerHTML = "<i class=\"fa-solid fa-arrow-right\"></i>";
  _0x3278b2.disabled = imageCacheCurrentPage === _0x344b32;
  _0x3278b2.addEventListener("click", () => {
    if (imageCacheCurrentPage < _0x344b32) {
      imageCacheCurrentPage++;
      displayCachePage(imageCacheCurrentPage);
    }
  });
  const _0x2ce15a = document.createElement("span");
  _0x2ce15a.textContent = "第 " + imageCacheCurrentPage + " / " + _0x344b32 + " 页";
  _0x2ce15a.style.margin = "0 10px";
  _0x507472.insertBefore(_0x348f34, _0x274e0f);
  _0x507472.insertBefore(_0x2ce15a, _0x274e0f);
  _0x507472.insertBefore(_0x3278b2, _0x274e0f);
}
function updateImageCacheInfo() {
  const _0x11c2bc = document.getElementById("image-cache-info");
  if (!_0x11c2bc) {
    return;
  }
  const _0x115ec2 = allCachedImages.length;
  const _0x599350 = selectedImages.size;
  const _0x373396 = allCachedImages.filter(_0x519d82 => _0x519d82.isVideo).length;
  const _0xfb448b = _0x115ec2 - _0x373396;
  _0x11c2bc.textContent = "总计 " + _0x115ec2 + " 个媒体 (图片: " + _0xfb448b + ", 视频: " + _0x373396 + ") | 选中 " + _0x599350 + " 个";
}
async function loadImageCache() {
  const _0x1d1be2 = document.getElementById("image-cache-grid");
  const _0x160cdf = document.getElementById("image-cache-info");
  if (!_0x1d1be2 || !_0x160cdf) {
    return;
  }
  _0x1d1be2.innerHTML = "正在加载图片...";
  const _0x4ff0b = await getAllImageMetadata();
  allCachedImages = [];
  for (const [_0x48ade9, _0x22365a] of Object.entries(_0x4ff0b)) {
    if (_0x22365a.images && Array.isArray(_0x22365a.images)) {
      _0x22365a.images.forEach(_0x48114d => {
        if (_0x48114d.date) {
          const _0x479faf = {
            uuid: _0x48114d.uuid,
            thumbnail_uuid: _0x48114d.thumbnail_uuid,
            md5: _0x48ade9,
            timestamp: _0x48114d.date,
            source: _0x48114d.source || "db",
            path: _0x48114d.path || null,
            thumbnail_path: _0x48114d.thumbnail_path || null,
            isVideo: _0x48114d.isVideo || false
          };
          const _0x28efb5 = _0x479faf;
          allCachedImages.push(_0x28efb5);
        }
      });
    }
  }
  allCachedImages.sort((_0x2fcde7, _0xe6052f) => _0xe6052f.timestamp - _0x2fcde7.timestamp);
  imageCacheCurrentPage = 1;
  selectedImages.clear();
  if (allCachedImages.length === 0) {
    _0x1d1be2.innerHTML = "没有找到缓存的图片。";
    _0x160cdf.textContent = "总计 0 张图片。";
    updateImageCachePagination();
  } else {
    displayCachePage(imageCacheCurrentPage);
    updateImageCacheInfo();
  }
}
async function clearCache() {
  const _0x1e585c = extension_settings[extensionName];
  stylishConfirm("你确定要清除所有过期的图片缓存吗？ (过期时间: " + _0x1e585c.cache + " 天)").then(async _0x284c5a => {
    if (_0x284c5a) {
      try {
        const _0x53a525 = await getAllImageMetadata();
        if (!_0x53a525 || Object.keys(_0x53a525).length === 0) {
          alert("图片库为空，无需清理。");
          return;
        }
        const _0x260112 = [];
        const _0x38bd0b = new Date().getTime();
        const _0x560910 = Number(_0x1e585c.cache);
        for (const [_0x246e71, _0x513762] of Object.entries(_0x53a525)) {
          if (_0x513762 && _0x513762.images && _0x513762.images.length > 0) {
            const _0x25d63f = Math.max(..._0x513762.images.map(_0x567da2 => _0x567da2.date).filter(Boolean));
            if (_0x25d63f) {
              const _0x416272 = _0x38bd0b - _0x25d63f;
              const _0x53d053 = Math.ceil(_0x416272 / 86400000);
              if (_0x53d053 > _0x560910) {
                _0x260112.push(_0x246e71);
              }
            }
          }
        }
        if (_0x260112.length > 0) {
          await deleteMultipleImages(_0x260112);
          alert("清除了 " + _0x260112.length + " 个过期图片条目。");
          if (_0x1e585c.jiuguanchucun === "true") {
            console.log("[Cache] 正在同步服务器图片...");
            const _0x372ee9 = await syncServerImagesWithStorage();
            if (_0x372ee9.deletedCount > 0) {
              console.log("[Cache] 同步完成，删除了 " + _0x372ee9.deletedCount + " 个不同步的服务器图片");
            }
            if (_0x372ee9.errors.length > 0) {
              console.warn("[Cache] 同步过程中出现错误:", _0x372ee9.errors);
            }
          }
          await loadImageCache();
        } else {
          alert("没有找到过期的图片缓存。");
        }
      } catch (_0x131528) {
        console.error("清除缓存失败:", _0x131528);
        alert("清除缓存时发生错误，请查看控制台。");
      }
    }
  });
}
export function initImageCache(_0x65d1aa) {
  _0x65d1aa.find("a[data-tab=\"image-cache\"]").on("click", loadImageCache);
  _0x65d1aa.find("#Clear-Cache").on("click", clearCache);
  const _0x2fefe6 = document.getElementById("image-cache-jump-input");
  const _0x41ec8b = document.getElementById("image-cache-jump-button");
  if (_0x2fefe6 && _0x41ec8b) {
    const _0x5da0ba = () => {
      const _0x51fa50 = Math.ceil(allCachedImages.length / imageCacheItemsPerPage);
      const _0x177bcf = parseInt(_0x2fefe6.value);
      if (_0x177bcf >= 1 && _0x177bcf <= _0x51fa50 && _0x177bcf !== imageCacheCurrentPage) {
        imageCacheCurrentPage = _0x177bcf;
        displayCachePage(imageCacheCurrentPage);
      }
    };
    _0x41ec8b.addEventListener("click", _0x5da0ba);
    _0x2fefe6.addEventListener("keypress", _0x5a557f => {
      if (_0x5a557f.key === "Enter") {
        _0x5da0ba();
      }
    });
    _0x2fefe6.addEventListener("input", () => {
      const _0x543669 = Math.ceil(allCachedImages.length / imageCacheItemsPerPage);
      const _0x40c765 = parseInt(_0x2fefe6.value);
      if (_0x40c765 < 1) {
        _0x2fefe6.value = 1;
      } else if (_0x40c765 > _0x543669) {
        _0x2fefe6.value = _0x543669;
      }
    });
  }
  $("#image-cache-toggle-multiselect").on("click", function () {
    isMultiSelectMode = !isMultiSelectMode;
    const _0x2b4ae8 = document.getElementById("image-cache-grid");
    const _0x29bb75 = $(this);
    if (isMultiSelectMode) {
      _0x29bb75.text("取消多选");
      _0x29bb75.addClass("active");
      _0x2b4ae8.classList.add("multi-select-mode");
    } else {
      _0x29bb75.text("多选");
      _0x29bb75.removeClass("active");
      _0x2b4ae8.classList.remove("multi-select-mode");
      selectedImages.clear();
      _0x2b4ae8.querySelectorAll(".st-chatu8-image-cache-item.selected").forEach(_0x45446f => _0x45446f.classList.remove("selected"));
      updateImageCacheInfo();
    }
  });
  $("#image-cache-select-all").on("click", () => {
    const _0xb6ee95 = document.getElementById("image-cache-grid");
    _0xb6ee95.querySelectorAll(".st-chatu8-image-cache-item").forEach(_0x13ae28 => {
      selectedImages.add(_0x13ae28.dataset.uuid);
      _0x13ae28.classList.add("selected");
    });
    updateImageCacheInfo();
  });
  $("#image-cache-deselect-all").on("click", () => {
    const _0x2a0450 = document.getElementById("image-cache-grid");
    selectedImages.clear();
    _0x2a0450.querySelectorAll(".st-chatu8-image-cache-item").forEach(_0x24368e => _0x24368e.classList.remove("selected"));
    updateImageCacheInfo();
  });
  $("#image-cache-delete-selected").on("click", async () => {
    if (selectedImages.size === 0) {
      alert("请先选择要删除的图片。");
      return;
    }
    const _0x3f969b = await stylishConfirm("确定要删除选中的 " + selectedImages.size + " 张图片吗？此操作不可撤销。");
    if (_0x3f969b) {
      await deleteImagesByUuids(Array.from(selectedImages));
      alert("选中的图片已删除。");
      loadImageCache();
    }
  });
  $("#image-cache-download-selected").on("click", async () => {
    if (selectedImages.size === 0) {
      alert("请先选择要下载的媒体。");
      return;
    }
    const _0x1ec3b8 = selectedImages.size;
    const _0xc8c503 = 10;
    const _0x4af240 = Array.from(selectedImages);
    const _0x2ffaa9 = new JSZip();
    let _0x4ff0d4 = 0;
    let _0x28cc62 = 0;
    toastr.info("正在准备下载 " + _0x1ec3b8 + " 个媒体文件...");
    for (let _0x254efb = 0; _0x254efb < _0x4af240.length; _0x254efb += _0xc8c503) {
      const _0x2f5db0 = _0x4af240.slice(_0x254efb, _0x254efb + _0xc8c503);
      const _0x601697 = _0x2f5db0.map(async _0x4da7d8 => {
        try {
          const _0x54706e = allCachedImages.find(_0x2841f5 => _0x2841f5.uuid === _0x4da7d8);
          const _0x4a4252 = _0x54706e?.isVideo || false;
          const _0x3b1ea2 = _0x4a4252 ? "mp4" : "png";
          let _0x1c0f2f;
          if (_0x54706e?.source === "server" && _0x54706e?.path) {
            const _0x4e84c4 = await fetch(_0x54706e.path);
            if (_0x4e84c4.ok) {
              _0x1c0f2f = await _0x4e84c4.blob();
            }
          } else {
            _0x1c0f2f = await getImageBlobByUUID(_0x4da7d8);
          }
          if (_0x1c0f2f && _0x1c0f2f.size > 0) {
            _0x2ffaa9.file(_0x4da7d8 + "." + _0x3b1ea2, _0x1c0f2f);
            _0x4ff0d4++;
          } else {
            _0x28cc62++;
            console.warn("无法获取媒体: " + _0x4da7d8);
          }
        } catch (_0x2929a1) {
          _0x28cc62++;
          console.error("下载媒体失败 " + _0x4da7d8 + ":", _0x2929a1);
        }
      });
      await Promise.all(_0x601697);
      const _0x1eceec = Math.min(_0x254efb + _0xc8c503, _0x4af240.length);
      if (_0x1eceec < _0x4af240.length) {
        toastr.info("处理进度: " + _0x1eceec + "/" + _0x1ec3b8, "", {
          timeOut: 1000
        });
      }
    }
    if (_0x4ff0d4 === 0) {
      toastr.error("没有成功获取任何媒体文件，下载已取消。");
      return;
    }
    if (_0x28cc62 > 0) {
      toastr.warning(_0x28cc62 + " 个文件获取失败，将下载 " + _0x4ff0d4 + " 个成功的文件。");
    }
    toastr.info("正在生成压缩包...");
    try {
      const _0x2c4f61 = await _0x2ffaa9.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      });
      if (_0x2c4f61.size === 0) {
        toastr.error("生成的压缩包为空，请重试。");
        return;
      }
      const _0xaca73c = URL.createObjectURL(_0x2c4f61);
      const _0x363b4b = document.createElement("a");
      _0x363b4b.href = _0xaca73c;
      _0x363b4b.download = "st-chatu8-media-" + new Date().toISOString().slice(0, 10) + ".zip";
      document.body.appendChild(_0x363b4b);
      _0x363b4b.click();
      document.body.removeChild(_0x363b4b);
      URL.revokeObjectURL(_0xaca73c);
      toastr.success("成功下载 " + _0x4ff0d4 + " 个媒体文件！");
    } catch (_0x3286ba) {
      console.error("生成压缩包失败:", _0x3286ba);
      toastr.error("生成压缩包失败，可能文件过大。请尝试减少选择的数量。");
    }
  });
}