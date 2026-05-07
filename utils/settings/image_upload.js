import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { processUploadedImage, processUploadedImageToBlob, addLog } from "../utils.js";
import { dbs } from "../database.js";
const NAI_VIBE_CACHE_KEY = "cache_novelai_vibe_transfer_image";
const NAI_CHAR_REF_CACHE_KEY = "cache_novelai_char_ref_image";
const COMFYUI_REF_CACHE_KEY = "cache_comfyui_ref_image";
let nai3VibeTransferImageMimeType = "image/png";
let nai3CharRefImageMimeType = "image/png";
let comfyuiImageObjectURL = null;
function updateNovelaiImagePreview(_0x2891b8) {
  const _0x368927 = document.getElementById("previewImage_novelai");
  const _0x5bb919 = document.querySelector("#novelai-image-preview-container .st-chatu8-image-placeholder");
  const _0x1b9300 = document.getElementById("novelai-remove-image-btn");
  if (_0x2891b8 && _0x2891b8.startsWith("data:image")) {
    _0x368927.src = _0x2891b8;
    _0x368927.style.display = "block";
    _0x5bb919.style.display = "none";
    _0x1b9300.style.display = "inline-flex";
    const _0x14c5ef = _0x2891b8.split(",");
    const _0x3dbac0 = _0x14c5ef[0].split(":")[1].split(";")[0];
    nai3VibeTransferImageMimeType = _0x3dbac0;
    window.nai3VibeTransferImage = _0x14c5ef[1];
    const _0x5c07ed = {
      id: NAI_VIBE_CACHE_KEY,
      data: _0x2891b8
    };
    dbs.storeReadWrite(_0x5c07ed);
  } else {
    _0x368927.src = "";
    _0x368927.style.display = "none";
    _0x5bb919.style.display = "flex";
    _0x1b9300.style.display = "none";
    window.nai3VibeTransferImage = null;
  }
}
function removeNovelaiImage() {
  updateNovelaiImagePreview(null);
  dbs.storeDelete(NAI_VIBE_CACHE_KEY);
}
async function handleNovelaiImageUpload(_0xa9f856) {
  const _0x59c11a = _0xa9f856.target.files[0];
  if (!_0x59c11a) {
    return;
  }
  try {
    const _0x1ce590 = await processUploadedImage(_0x59c11a, true);
    updateNovelaiImagePreview(_0x1ce590);
  } catch (_0x4819e2) {
    console.error("Error processing NovelAI image:", _0x4819e2);
    alert("图片处理失败: " + _0x4819e2.message);
  }
}
function updateNovelaiCharRefImagePreview(_0x18b4e4) {
  const _0x341df1 = document.getElementById("previewImage_nai_char_ref");
  const _0x2dfc66 = document.querySelector("#novelai-char-ref-image-preview-container .st-chatu8-image-placeholder");
  const _0x4a4d50 = document.getElementById("novelai-remove-char-ref-image-btn");
  if (!_0x341df1 || !_0x2dfc66 || !_0x4a4d50) {
    console.log("[CharRef] Old character reference UI elements not found - using new system");
    return;
  }
  if (_0x18b4e4 && _0x18b4e4.startsWith("data:image")) {
    _0x341df1.src = _0x18b4e4;
    _0x341df1.style.display = "block";
    _0x2dfc66.style.display = "none";
    _0x4a4d50.style.display = "inline-flex";
    const _0x2e7701 = _0x18b4e4.split(",");
    const _0x3142c7 = _0x2e7701[0].split(":")[1].split(";")[0];
    nai3CharRefImageMimeType = _0x3142c7;
    window.nai3CharRefImage = _0x2e7701[1];
    const _0x321dd7 = {
      id: NAI_CHAR_REF_CACHE_KEY,
      data: _0x18b4e4
    };
    dbs.storeReadWrite(_0x321dd7);
  } else {
    _0x341df1.src = "";
    _0x341df1.style.display = "none";
    _0x2dfc66.style.display = "flex";
    _0x4a4d50.style.display = "none";
    window.nai3CharRefImage = null;
  }
}
function removeNovelaiCharRefImage() {
  updateNovelaiCharRefImagePreview(null);
  dbs.storeDelete(NAI_CHAR_REF_CACHE_KEY);
}
async function handleNovelaiCharRefImageUpload(_0x493700) {
  const _0x8a6767 = _0x493700.target.files[0];
  if (!_0x8a6767) {
    return;
  }
  try {
    const _0x4170e6 = await processUploadedImage(_0x8a6767);
    updateNovelaiCharRefImagePreview(_0x4170e6);
  } catch (_0x39ca3a) {
    console.error("Error processing NovelAI char ref image:", _0x39ca3a);
    alert("图片处理失败: " + _0x39ca3a.message);
  }
}
function updateComfyUIImagePreview(_0x5178f7) {
  const _0x8973d6 = document.getElementById("previewImage2");
  const _0x1d7728 = document.querySelector("#comfyui-image-preview-container .st-chatu8-image-placeholder");
  const _0x35a20b = document.getElementById("comfyui-remove-image-btn");
  if (_0x8973d6.src && _0x8973d6.src.startsWith("blob:") && _0x8973d6.src !== _0x5178f7) {
    URL.revokeObjectURL(_0x8973d6.src);
  }
  if (_0x5178f7) {
    _0x8973d6.src = _0x5178f7;
    _0x8973d6.style.display = "block";
    _0x1d7728.style.display = "none";
    _0x35a20b.style.display = "inline-flex";
  } else {
    _0x8973d6.src = "";
    _0x8973d6.style.display = "none";
    _0x1d7728.style.display = "flex";
    _0x35a20b.style.display = "none";
    window.comfyuicankaotupian = null;
    comfyuiImageObjectURL = null;
  }
}
function removeComfyUIImage() {
  updateComfyUIImagePreview(null);
  dbs.storeDelete(COMFYUI_REF_CACHE_KEY);
}
async function handleImageUpload2(_0x489290) {
  const _0x25c744 = extension_settings[extensionName];
  const _0xb9a74d = _0x489290.target.files[0];
  if (!_0xb9a74d) {
    return;
  }
  try {
    const _0x3c14a5 = await processUploadedImageToBlob(_0xb9a74d);
    const _0x15228e = URL.createObjectURL(_0x3c14a5);
    comfyuiImageObjectURL = _0x15228e;
    updateComfyUIImagePreview(_0x15228e);
    const _0x135bcf = new FormData();
    _0x135bcf.append("image", _0x3c14a5, _0xb9a74d.name);
    let _0x20dc68 = _0x25c744.comfyuiUrl.trim();
    if (!_0x20dc68) {
      alert("请先设置ComfyUI API地址。");
      removeComfyUIImage();
      return;
    }
    const _0xcea0f9 = {
      method: "POST",
      body: _0x135bcf
    };
    const _0x5c1aee = await fetch(_0x20dc68 + "/upload/image", _0xcea0f9);
    if (_0x5c1aee.ok) {
      const _0x105670 = await _0x5c1aee.json();
      window.comfyuicankaotupian = _0x105670.name;
      addLog("图片上传成功, 服务器返回数据: " + JSON.stringify(_0x105670));
      console.log("上传成功, 服务器返回数据:", _0x105670);
      const _0x569e3f = new FileReader();
      _0x569e3f.onloadend = () => {
        const _0x1d9215 = _0x569e3f.result;
        const _0x1c3679 = {
          data: _0x1d9215,
          serverFileName: _0x105670.name
        };
        const _0xd6311b = _0x1c3679;
        const _0x30e83d = {
          id: COMFYUI_REF_CACHE_KEY,
          data: _0xd6311b
        };
        dbs.storeReadWrite(_0x30e83d);
      };
      _0x569e3f.readAsDataURL(_0x3c14a5);
    } else {
      const _0x530e2d = await _0x5c1aee.text();
      alert("上传失败: " + _0x530e2d);
      addLog("图片上传失败, 错误详情: " + _0x530e2d);
      console.error("错误详情:", _0x530e2d);
      removeComfyUIImage();
    }
  } catch (_0x33081a) {
    alert("图片处理或上传时出错: " + _0x33081a.message);
    console.error("图片处理或上传时出错:", _0x33081a);
    addLog("图片上传失败, 错误详情: " + JSON.stringify(_0x33081a));
    removeComfyUIImage();
  }
}
async function loadCachedImages() {
  await dbs.openDB();
  try {
    const _0x3f76cc = await dbs.storeReadOnly(NAI_VIBE_CACHE_KEY);
    if (_0x3f76cc && _0x3f76cc.data) {
      updateNovelaiImagePreview(_0x3f76cc.data);
    }
  } catch (_0x131e8f) {
    console.error("Error loading cached NovelAI Vibe image:", _0x131e8f);
  }
  try {
    const _0x472308 = await dbs.storeReadOnly(NAI_CHAR_REF_CACHE_KEY);
    if (_0x472308 && _0x472308.data) {
      updateNovelaiCharRefImagePreview(_0x472308.data);
    }
  } catch (_0x2f09f7) {
    console.error("Error loading cached NovelAI Char Ref image:", _0x2f09f7);
  }
  try {
    const _0x2f4259 = await dbs.storeReadOnly(COMFYUI_REF_CACHE_KEY);
    if (_0x2f4259 && _0x2f4259.data && _0x2f4259.data.data && _0x2f4259.data.serverFileName) {
      const _0x1dfbfc = _0x2f4259.data;
      const _0x358ef4 = await fetch(_0x1dfbfc.data);
      const _0x21bab5 = await _0x358ef4.blob();
      const _0x134820 = URL.createObjectURL(_0x21bab5);
      updateComfyUIImagePreview(_0x134820);
      comfyuiImageObjectURL = _0x134820;
      window.comfyuicankaotupian = _0x1dfbfc.serverFileName;
      addLog("从缓存加载ComfyUI图片: " + _0x1dfbfc.serverFileName);
      console.log("Loaded ComfyUI image from cache: " + _0x1dfbfc.serverFileName);
    } else if (_0x2f4259 && typeof _0x2f4259.data === "string") {
      const _0x435824 = await fetch(_0x2f4259.data);
      const _0x3ba26e = await _0x435824.blob();
      const _0x1a8bf6 = URL.createObjectURL(_0x3ba26e);
      updateComfyUIImagePreview(_0x1a8bf6);
      comfyuiImageObjectURL = _0x1a8bf6;
      console.warn("Loaded ComfyUI image from old cache format. Please re-upload to update cache to the new format.");
    }
  } catch (_0x4dcebf) {
    console.error("Error loading cached ComfyUI image:", _0x4dcebf);
  }
}
export function initImageUpload(_0x1b6f52) {
  loadCachedImages();
  _0x1b6f52.find("#novelai-select-image-btn").on("click", () => {
    document.getElementById("imageInput_novelai").click();
  });
  _0x1b6f52.find("#imageInput_novelai").on("change", handleNovelaiImageUpload);
  _0x1b6f52.find("#novelai-remove-image-btn").on("click", () => {
    removeNovelaiImage();
  });
  _0x1b6f52.find("#novelai-select-char-ref-image-btn").on("click", () => {
    document.getElementById("imageInput_nai_char_ref").click();
  });
  _0x1b6f52.find("#imageInput_nai_char_ref").on("change", handleNovelaiCharRefImageUpload);
  _0x1b6f52.find("#novelai-remove-char-ref-image-btn").on("click", () => {
    removeNovelaiCharRefImage();
  });
  _0x1b6f52.find("#comfyui-select-image-btn").on("click", () => {
    document.getElementById("imageInput2").click();
  });
  _0x1b6f52.find("#imageInput2").on("change", handleImageUpload2);
  _0x1b6f52.find("#comfyui-remove-image-btn").on("click", () => {
    removeComfyUIImage();
  });
}
export { updateNovelaiImagePreview, updateNovelaiCharRefImagePreview, updateComfyUIImagePreview, nai3VibeTransferImageMimeType, nai3CharRefImageMimeType, comfyuiImageObjectURL };