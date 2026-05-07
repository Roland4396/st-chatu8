import { sleep, generateRandomSeed, zhengmian, fumian, prompt_replace, prompt_replace_for_character, parsePromptStringWithCoordinates, getRequestHeaders, calculateSkipCfgAboveSigma, processReferenceImage, addLog, clearLog, stripChineseAnnotations, convertImageToJpeg, deduplicateTags } from "./utils.js";
import { extension_settings } from "../../../../extensions.js";
import { extensionName, EventType } from "./config.js";
import { setItemImg } from "./database.js";
import { saveChatDebounced, saveSettingsDebounced, eventSource } from "../../../../../script.js";
import { initializeImageProcessing } from "./iframe.js";
import { processCharacterPrompt } from "./characterprompt.js";
import { bananaGenerate } from "./banana.js";
import { taskQueue, TaskType } from "./taskQueue.js";
import { waitForTurn, completeQueue, leaveQueue, getUserId, hashKey } from "./queueService.js";
import { getConfigImage } from "./configDatabase.js";
function getDirectHeaders(_0x217782 = null, _0x5e8f05 = null) {
  const _0x405a63 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "*/*"
  };
  if (_0x217782) {
    _0x405a63["Content-Type"] = _0x217782;
  }
  if (_0x5e8f05) {
    _0x405a63.Authorization = _0x5e8f05;
  }
  return _0x405a63;
}
let currentTaskId = null;
let currentAbortController = null;
let currentCloudQueueInfo = null;
function cleanNovelAIPayload(_0x1ff51e, _0x35605b) {
  const _0x460805 = _0x35605b === "nai-diffusion-3";
  const _0xe780f1 = _0x35605b.includes("nai-diffusion-4");
  const _0x22a7a1 = {
    ..._0x1ff51e
  };
  const _0x3a58fe = _0x22a7a1;
  if (_0x460805) {
    delete _0x3a58fe.reference_image_multiple_cached;
    delete _0x3a58fe.director_reference_images_cached;
    delete _0x3a58fe.director_reference_descriptions;
    delete _0x3a58fe.director_reference_information_extracted;
    delete _0x3a58fe.director_reference_strength_values;
    delete _0x3a58fe.director_reference_secondary_strength_values;
    addLog("[PayloadClean] 已移除 NAI4/4.5 数组（使用 NAI3 模型）");
  } else if (_0xe780f1) {
    delete _0x3a58fe.reference_image_multiple;
    delete _0x3a58fe.reference_information_extracted_multiple;
    addLog("[PayloadClean] 已移除 NAI3 数组（使用 NAI4/4.5 模型）");
  }
  return _0x3a58fe;
}
function validateNovelAIPayload(_0x2ab2f0, _0x4b5736) {
  const _0x371838 = ["width", "height", "scale", "sampler", "steps", "seed"];
  for (const _0x3b972c of _0x371838) {
    if (_0x2ab2f0[_0x3b972c] === undefined || _0x2ab2f0[_0x3b972c] === null) {
      throw new Error("缺少必需字段: " + _0x3b972c);
    }
  }
  if (_0x4b5736 === "nai-diffusion-3") {
    const _0x5e4fad = _0x2ab2f0.reference_image_multiple?.length || 0;
    const _0x9c21c4 = _0x2ab2f0.reference_information_extracted_multiple?.length || 0;
    const _0x338067 = _0x2ab2f0.reference_strength_multiple?.length || 0;
    if (_0x5e4fad > 0 || _0x9c21c4 > 0 || _0x338067 > 0) {
      if (_0x5e4fad !== _0x9c21c4 || _0x5e4fad !== _0x338067) {
        const _0x4298fa = "NAI3 参考数组长度不匹配: " + ("reference_image_multiple=" + _0x5e4fad + ", ") + ("reference_information_extracted_multiple=" + _0x9c21c4 + ", ") + ("reference_strength_multiple=" + _0x338067);
        addLog("[验证错误] " + _0x4298fa);
        throw new Error(_0x4298fa);
      }
      addLog("[验证] NAI3 参考数组长度一致: " + _0x5e4fad + " 个参考");
    }
  }
  if (_0x4b5736.includes("nai-diffusion-4")) {
    const _0x479e31 = _0x2ab2f0.reference_image_multiple_cached?.length || 0;
    const _0x4f98c6 = _0x2ab2f0.reference_strength_multiple?.length || 0;
    if (_0x479e31 > 0 && _0x479e31 !== _0x4f98c6) {
      const _0x41b5aa = "NAI4/4.5 Vibe Transfer 数组长度不匹配: " + ("reference_image_multiple_cached=" + _0x479e31 + ", ") + ("reference_strength_multiple=" + _0x4f98c6);
      addLog("[验证错误] " + _0x41b5aa);
      throw new Error(_0x41b5aa);
    }
    if (_0x479e31 > 0) {
      addLog("[验证] NAI4/4.5 Vibe Transfer 数组长度一致: " + _0x479e31 + " 个 Vibe");
    }
  }
  if (_0x4b5736.includes("4-5")) {
    const _0x400d90 = _0x2ab2f0.director_reference_images_cached?.length || 0;
    const _0x54d8e9 = _0x2ab2f0.director_reference_descriptions?.length || 0;
    const _0x2cd84a = _0x2ab2f0.director_reference_information_extracted?.length || 0;
    const _0x3292e1 = _0x2ab2f0.director_reference_strength_values?.length || 0;
    const _0x2148c3 = _0x2ab2f0.director_reference_secondary_strength_values?.length || 0;
    if (_0x400d90 > 0) {
      if (_0x400d90 !== _0x54d8e9 || _0x400d90 !== _0x2cd84a || _0x400d90 !== _0x3292e1 || _0x400d90 !== _0x2148c3) {
        const _0x458615 = "角色参考数组长度不匹配: " + ("images=" + _0x400d90 + ", descriptions=" + _0x54d8e9 + ", ") + ("info=" + _0x2cd84a + ", strength=" + _0x3292e1 + ", secondary=" + _0x2148c3);
        addLog("[验证错误] " + _0x458615);
        throw new Error(_0x458615);
      }
      addLog("[验证] 角色参考数组长度一致: " + _0x400d90 + " 个参考");
    }
  }
  addLog("[验证] Payload 验证通过");
}
async function applySingleVibeTransfer(_0x67506e) {
  if (!window.nai3VibeTransferImage || window.nai3VibeTransferImage === "") {
    addLog("[SingleVibe] 未设置 Vibe Transfer 图像，跳过");
    return;
  }
  try {
    addLog("[SingleVibe] 处理 NAI3 单个 Vibe Transfer");
    const _0x4f167a = await processReferenceImage(window.nai3VibeTransferImage);
    const _0x5e3c10 = Number(extension_settings[extensionName].InformationExtracted);
    const _0x3ab15f = Number(extension_settings[extensionName].ReferenceStrength);
    if (isNaN(_0x5e3c10) || _0x5e3c10 < 0 || _0x5e3c10 > 1) {
      throw new Error("InformationExtracted 值无效: " + _0x5e3c10 + "。必须在 0 到 1 之间。");
    }
    if (isNaN(_0x3ab15f) || _0x3ab15f < 0 || _0x3ab15f > 1) {
      throw new Error("ReferenceStrength 值无效: " + _0x3ab15f + "。必须在 0 到 1 之间。");
    }
    _0x67506e.reference_image_multiple.push(_0x4f167a);
    _0x67506e.reference_information_extracted_multiple.push(_0x5e3c10);
    _0x67506e.reference_strength_multiple.push(_0x3ab15f);
    addLog("[SingleVibe] 已添加 Vibe Transfer: info=" + _0x5e3c10 + ", strength=" + _0x3ab15f);
    addLog("[SingleVibe] 数组长度: images=" + _0x67506e.reference_image_multiple.length + ", " + ("info=" + _0x67506e.reference_information_extracted_multiple.length + ", ") + ("strength=" + _0x67506e.reference_strength_multiple.length));
  } catch (_0x419952) {
    addLog("[SingleVibe] 错误: " + _0x419952.message);
    throw _0x419952;
  }
}
function getEncodingKeyForModel(_0x12e35a) {
  if (_0x12e35a.includes("4-5-curated")) {
    return "v4-5curated";
  }
  if (_0x12e35a.includes("4-5-full")) {
    return "v4-5full";
  }
  if (_0x12e35a.includes("4-curated")) {
    return "v4curated";
  }
  if (_0x12e35a.includes("4-full")) {
    return "v4full";
  }
  if (_0x12e35a.includes("diffusion-3")) {
    return "v3";
  }
  console.warn("[VibeGroup] Unknown model:", _0x12e35a, "- defaulting to v4-5curated");
  return "v4-5curated";
}
function generateRandomUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (_0xafc8ac) {
    const _0xf688f6 = Math.random() * 16 | 0;
    const _0x52a29b = _0xafc8ac === "x" ? _0xf688f6 : _0xf688f6 & 3 | 8;
    return _0x52a29b.toString(16);
  });
}
async function applyVibeGroupTransfer(_0x59d9a8) {
  const _0x36b681 = extension_settings[extensionName];
  const _0x1bef1d = _0x36b681.vibeGroups || {};
  const _0x4726c1 = _0x36b681.vibeGroupId;
  if (!_0x1bef1d || Object.keys(_0x1bef1d).length === 0) {
    const _0x17b84d = "警告: 未找到 Vibe 组。请先创建至少一个 Vibe 组。";
    console.warn("[VibeGroup] No Vibe groups exist");
    addLog("[VibeGroup] " + _0x17b84d);
    toastr.warning(_0x17b84d, "Vibe 组氛围转移");
    return;
  }
  if (!_0x4726c1 || !_0x1bef1d[_0x4726c1]) {
    const _0x2a7b9c = "警告: 未选择有效的 Vibe 组。请在 Vibe 组编辑器中选择一个组。";
    console.warn("[VibeGroup] No valid Vibe group selected for transfer");
    addLog("[VibeGroup] " + _0x2a7b9c);
    toastr.warning(_0x2a7b9c, "Vibe 组氛围转移");
    return;
  }
  const _0x3eeb3f = _0x1bef1d[_0x4726c1];
  const _0xe44763 = _0x3eeb3f.vibes || [];
  if (_0xe44763.length === 0) {
    const _0x232bc5 = "错误: 选中的 Vibe 组为空。请添加至少一个 Vibe 到组中。";
    console.warn("[VibeGroup] Selected Vibe group is empty");
    addLog("[VibeGroup] " + _0x232bc5);
    toastr.error(_0x232bc5, "Vibe 组氛围转移");
    return;
  }
  console.log("[VibeGroup] Applying Vibe group transfer: " + (_0x3eeb3f.name || _0x4726c1) + " (" + _0xe44763.length + " Vibes)");
  addLog("[VibeGroup] 应用 Vibe 组氛围转移: " + (_0x3eeb3f.name || _0x4726c1) + " (" + _0xe44763.length + " 个 Vibe)");
  let _0x534cef = 0;
  let _0x5c88d2 = 0;
  const _0x4412cb = [];
  for (const _0x3658c6 of _0xe44763) {
    try {
      const _0x10b3c2 = await getConfigImage(_0x3658c6.vibeDataId);
      if (!_0x10b3c2) {
        _0x5c88d2++;
        console.warn("[VibeGroup] Vibe data not found:", _0x3658c6.vibeDataId);
        addLog("[VibeGroup] 警告: 未找到 Vibe 数据: " + _0x3658c6.vibeDataId.substring(0, 12) + "...");
        continue;
      }
      const _0x285bb2 = _0x10b3c2.split(",")[1];
      if (!_0x285bb2) {
        _0x5c88d2++;
        console.error("[VibeGroup] Invalid Vibe data format (missing base64 data):", _0x3658c6.vibeDataId);
        addLog("[VibeGroup] 错误: Vibe 数据格式无效: " + _0x3658c6.vibeDataId.substring(0, 12) + "...");
        continue;
      }
      const _0x2da22e = atob(_0x285bb2);
      const _0x3d734b = JSON.parse(_0x2da22e);
      const _0x46aeab = _0x36b681.novelaimode;
      const _0x1b29cb = getEncodingKeyForModel(_0x46aeab);
      console.log("[VibeGroup] Model mapping:", {
        originalModel: _0x46aeab,
        encodingKey: _0x1b29cb,
        availableEncodings: Object.keys(_0x3d734b.encodings || {})
      });
      const _0xb00b1e = _0x3d734b.encodings?.[_0x1b29cb];
      if (!_0xb00b1e) {
        _0x5c88d2++;
        console.warn("[VibeGroup] No encoding found for model:", _0x46aeab, "encodingKey:", _0x1b29cb, "in Vibe:", _0x3658c6.vibeDataId);
        console.warn("[VibeGroup] Available encodings:", Object.keys(_0x3d734b.encodings || {}));
        addLog("[VibeGroup] 警告: 未找到模型 " + _0x46aeab + " (" + _0x1b29cb + ") 的编码");
        continue;
      }
      const _0x14cc34 = Object.keys(_0xb00b1e);
      if (_0x14cc34.length === 0) {
        _0x5c88d2++;
        console.warn("[VibeGroup] No encoding keys found for model:", _0x46aeab, "in Vibe:", _0x3658c6.vibeDataId);
        addLog("[VibeGroup] 警告: 未找到模型 " + _0x46aeab + " 的编码键");
        continue;
      }
      const _0x1da4c6 = _0x14cc34[0];
      const _0x3bbd45 = _0xb00b1e[_0x1da4c6];
      if (!_0x3bbd45 || !_0x3bbd45.encoding) {
        _0x5c88d2++;
        console.warn("[VibeGroup] Invalid encoding structure for model:", _0x46aeab, "in Vibe:", _0x3658c6.vibeDataId);
        addLog("[VibeGroup] 警告: 编码结构无效");
        continue;
      }
      const _0x597512 = _0x3bbd45.encoding;
      const _0xf1996b = typeof _0x597512 === "string" ? _0x597512 : _0x597512.data || _0x597512;
      const _0x3be086 = _0x3bbd45.params?.information_extracted || 1;
      const _0x19fc18 = {
        data: _0xf1996b,
        infoExtracted: _0x3be086,
        strength: _0x3658c6.strength
      };
      _0x4412cb.push(_0x19fc18);
      _0x534cef++;
      console.log("[VibeGroup] Collected Vibe data:", {
        vibeDataId: _0x3658c6.vibeDataId.substring(0, 12) + "...",
        strength: _0x3658c6.strength,
        infoExtracted: _0x3be086
      });
      addLog("[VibeGroup] 已收集 Vibe: 强度=" + _0x3658c6.strength + ", 信息提取=" + _0x3be086);
    } catch (_0x188bc7) {
      _0x5c88d2++;
      const _0x2fcb1b = {
        vibeDataId: _0x3658c6.vibeDataId,
        error: _0x188bc7.message,
        errorName: _0x188bc7.name,
        stack: _0x188bc7.stack
      };
      console.error("[VibeGroup] Error processing Vibe:", _0x2fcb1b);
      addLog("[VibeGroup] 错误: 处理 Vibe 失败: " + _0x188bc7.message);
    }
  }
  if (_0x4412cb.length === 0) {
    console.warn("[VibeGroup] No vibes were successfully processed");
    addLog("[VibeGroup] 警告: 没有成功处理任何 Vibe");
    if (_0x5c88d2 > 0) {
      toastr.error("所有 Vibe 处理失败，将不使用氛围转移", "Vibe 组氛围转移");
    }
    return;
  }
  const _0x2b2950 = _0x4412cb.reduce((_0x361631, _0x47be54) => _0x361631 + _0x47be54.strength, 0);
  const _0x438402 = extension_settings[extensionName].normalizeRefStrength === "true";
  const _0x43aa60 = ["nai-diffusion-4-5-full", "nai-diffusion-4-5-curated"].includes(extension_settings[extensionName].novelaimode);
  let _0xfdb624;
  if (_0x438402 && _0x43aa60) {
    _0xfdb624 = _0x4412cb.map(_0x4f4cf3 => _0x4f4cf3.strength);
    console.log("[VibeGroup] NAI 4.5 自动归一化已启用，跳过手动调整 (总和: " + _0x2b2950.toFixed(3) + ")");
    addLog("[VibeGroup] NAI 4.5 自动归一化已启用，跳过手动调整 (总和: " + _0x2b2950.toFixed(3) + ")");
  } else if (_0x2b2950 > 1) {
    _0xfdb624 = _0x4412cb.map(_0x1b6ce1 => _0x1b6ce1.strength / _0x2b2950);
    console.log("[VibeGroup] 强度值已归一化 (总和超过 1.0: " + _0x2b2950.toFixed(3) + ")");
    addLog("[VibeGroup] 强度值已归一化 (总和超过 1.0: " + _0x2b2950.toFixed(3) + ")");
    _0xfdb624.forEach((_0x46128d, _0x4aae14) => {
      console.log("[VibeGroup]   Vibe " + _0x4aae14 + ": " + _0x4412cb[_0x4aae14].strength.toFixed(2) + " → " + _0x46128d.toFixed(3));
    });
  } else {
    _0xfdb624 = _0x4412cb.map(_0x4c6b31 => _0x4c6b31.strength);
    console.log("[VibeGroup] 使用原始强度值 (总和: " + _0x2b2950.toFixed(3) + ")");
    addLog("[VibeGroup] 使用原始强度值 (总和: " + _0x2b2950.toFixed(3) + ")");
  }
  for (let _0x3734cf = 0; _0x3734cf < _0x4412cb.length; _0x3734cf++) {
    const _0x509423 = _0x4412cb[_0x3734cf];
    const _0x5e6b03 = generateRandomUUID();
    const _0x1c2559 = {
      cache_secret_key: _0x5e6b03,
      data: _0x509423.data
    };
    _0x59d9a8.reference_image_multiple_cached.push(_0x1c2559);
    _0x59d9a8.reference_strength_multiple.push(_0xfdb624[_0x3734cf]);
  }
  console.log("[VibeGroup] Transfer complete: " + _0x534cef + " succeeded, " + _0x5c88d2 + " failed");
  addLog("[VibeGroup] 氛围转移完成: " + _0x534cef + " 个成功, " + _0x5c88d2 + " 个失败");
  console.log("[VibeGroup] Added " + _0x4412cb.length + " vibes to request parameters");
  addLog("[VibeGroup] 已添加 " + _0x4412cb.length + " 个 Vibe 到请求参数");
  if (_0x5c88d2 > 0 && _0x534cef > 0) {
    toastr.warning("部分 Vibe 处理失败 (" + _0x5c88d2 + "/" + _0xe44763.length + ")，但生成将继续进行", "Vibe 组氛围转移");
  }
}
async function applyCharacterReferenceGroup(_0x517bdd) {
  const _0x51d0b4 = extension_settings[extensionName];
  const _0x2064a3 = _0x51d0b4.charRefGroups || {};
  const _0x16596e = _0x51d0b4.charRefGroupId;
  if (!_0x2064a3 || Object.keys(_0x2064a3).length === 0) {
    const _0x401b5e = "警告: 未找到角色参考组。请先创建至少一个角色参考组。";
    console.warn("[CharRef] No character reference groups exist");
    addLog("[CharRef] " + _0x401b5e);
    toastr.warning(_0x401b5e, "角色参考");
    return;
  }
  if (!_0x16596e || !_0x2064a3[_0x16596e]) {
    const _0x5a4afa = "警告: 未选择有效的角色参考组。请在角色组编辑器中选择一个组。";
    console.warn("[CharRef] No valid character reference group selected");
    addLog("[CharRef] " + _0x5a4afa);
    toastr.warning(_0x5a4afa, "角色参考");
    return;
  }
  const _0x15d775 = _0x2064a3[_0x16596e];
  const _0x29f578 = _0x15d775.references || [];
  if (_0x29f578.length === 0) {
    const _0x51fd7f = "错误: 选中的角色参考组为空。请添加至少一个角色参考到组中。";
    console.warn("[CharRef] Selected character reference group is empty");
    addLog("[CharRef] " + _0x51fd7f);
    toastr.error(_0x51fd7f, "角色参考");
    return;
  }
  console.log("[CharRef] Applying character reference group: " + (_0x15d775.name || _0x16596e) + " (" + _0x29f578.length + " references)");
  addLog("[CharRef] 应用角色参考组: " + (_0x15d775.name || _0x16596e) + " (" + _0x29f578.length + " 个参考)");
  let _0x49d1bc = 0;
  let _0x16ced0 = 0;
  _0x517bdd.director_reference_images_cached = [];
  _0x517bdd.director_reference_descriptions = [];
  _0x517bdd.director_reference_information_extracted = [];
  _0x517bdd.director_reference_strength_values = [];
  _0x517bdd.director_reference_secondary_strength_values = [];
  for (const _0x35150d of _0x29f578) {
    try {
      const _0x500c2d = await getConfigImage(_0x35150d.imageId);
      if (!_0x500c2d) {
        _0x16ced0++;
        console.warn("[CharRef] Reference image not found:", _0x35150d.imageId);
        addLog("[CharRef] 警告: 未找到角色参考图像: " + _0x35150d.imageId.substring(0, 12) + "...");
        continue;
      }
      const _0x5441bf = await processReferenceImage(_0x500c2d);
      const _0x208abc = generateRandomUUID();
      const _0x2f22df = {
        cache_secret_key: _0x208abc,
        data: _0x5441bf
      };
      _0x517bdd.director_reference_images_cached.push(_0x2f22df);
      let _0x514b0f = "character";
      if (_0x35150d.type === "character_style") {
        _0x514b0f = "character&style";
      } else if (_0x35150d.type === "style") {
        _0x514b0f = "style";
      }
      const _0x43f773 = {
        base_caption: _0x514b0f,
        char_captions: []
      };
      const _0x49f074 = {
        caption: _0x43f773,
        legacy_uc: false
      };
      _0x517bdd.director_reference_descriptions.push(_0x49f074);
      _0x517bdd.director_reference_information_extracted.push(1);
      _0x517bdd.director_reference_strength_values.push(_0x35150d.strength);
      _0x517bdd.director_reference_secondary_strength_values.push(1 - _0x35150d.strength);
      _0x49d1bc++;
      console.log("[CharRef] Added reference:", {
        imageId: _0x35150d.imageId.substring(0, 12) + "...",
        type: _0x35150d.type,
        strength: _0x35150d.strength,
        secondaryStrength: (1 - _0x35150d.strength).toFixed(3),
        fidelity: _0x35150d.fidelity,
        information_extracted: 1
      });
      addLog("[CharRef] 已添加参考: 类型=" + _0x35150d.type + ", 强度=" + _0x35150d.strength + ", 次要强度=" + (1 - _0x35150d.strength).toFixed(3) + ", 保真度=" + _0x35150d.fidelity + ", information_extracted=1.0");
    } catch (_0x1cc0b7) {
      _0x16ced0++;
      const _0x5998d5 = {
        imageId: _0x35150d.imageId,
        error: _0x1cc0b7.message,
        errorName: _0x1cc0b7.name,
        stack: _0x1cc0b7.stack
      };
      console.error("[CharRef] Error processing reference:", _0x5998d5);
      addLog("[CharRef] 错误: 处理角色参考失败: " + _0x1cc0b7.message);
    }
  }
  console.log("[CharRef] Application complete: " + _0x49d1bc + " succeeded, " + _0x16ced0 + " failed");
  addLog("[CharRef] 角色参考应用完成: " + _0x49d1bc + " 个成功, " + _0x16ced0 + " 个失败");
  if (_0x16ced0 > 0 && _0x49d1bc > 0) {
    toastr.warning("部分角色参考处理失败 (" + _0x16ced0 + "/" + _0x29f578.length + ")，但生成将继续进行", "角色参考");
  }
  if (_0x49d1bc === 0) {
    toastr.error("所有角色参考处理失败，将不使用角色参考", "角色参考");
  }
}
function decryptNovelAI(_0x3c896e) {
  if (!_0x3c896e || typeof _0x3c896e !== "string" || !_0x3c896e.includes(":")) {
    return _0x3c896e;
  }
  try {
    const _0xa748c5 = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
    const _0x4d424c = CryptoJS.enc.Hex.parse(_0xa748c5);
    const _0x2f4f63 = _0x3c896e.split(":");
    if (_0x2f4f63.length !== 2) {
      return _0x3c896e;
    }
    const _0x52f301 = CryptoJS.enc.Hex.parse(_0x2f4f63[0]);
    const _0x53fe15 = _0x2f4f63[1];
    const _0x4524e9 = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(_0x53fe15)
    });
    const _0x3c1f08 = CryptoJS.AES.decrypt(_0x4524e9, _0x4d424c, {
      iv: _0x52f301,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const _0x381181 = _0x3c1f08.toString(CryptoJS.enc.Utf8);
    if (_0x381181) {
      return _0x381181;
    } else {
      console.error("NovelAI credential decryption failed. The key might be wrong or the data corrupted. Using raw value.");
      return _0x3c896e;
    }
  } catch (_0x134a47) {
    console.error("An error occurred during decryption:", _0x134a47);
    return _0x3c896e;
  }
}
function unzipFile(_0xa39604) {
  addLog("开始解压 ZIP 文件...");
  return new Promise((_0x473e9c, _0x28fcea) => {
    JSZip.loadAsync(_0xa39604).then(function (_0x3fc4f2) {
      addLog("ZIP 文件加载成功");
      _0x3fc4f2.forEach(function (_0xc102bb, _0x2b1b70) {
        addLog("在 ZIP 中找到文件: " + _0x2b1b70.name);
        _0x2b1b70.async("base64").then(function (_0x358230) {
          addLog("文件 " + _0x2b1b70.name + " 解压为 Base64，大小: " + _0x358230.length);
          _0x473e9c(_0x358230);
        }).catch(_0xc0271f => {
          addLog("解压文件 " + _0x2b1b70.name + " 失败: " + _0xc0271f.message);
          _0x28fcea(_0xc0271f);
        });
      });
    }).catch(_0x45ebe8 => {
      addLog("加载 ZIP 文件失败: " + _0x45ebe8.message);
      _0x28fcea(_0x45ebe8);
    });
  });
}
function _parseMsgpackMessage(_0x396b1f) {
  try {
    const _0x4d326e = MessagePack.decode(_0x396b1f);
    if (_0x4d326e && _0x4d326e.event_type) {
      addLog("解析 Msgpack 消息成功: 事件类型 - " + _0x4d326e.event_type);
      const _0x146b51 = {
        eventType: _0x4d326e.event_type,
        imageData: _0x4d326e.image
      };
      return _0x146b51;
    }
  } catch (_0x37c8e1) {
    addLog("解析 Msgpack 消息失败: " + _0x37c8e1.message);
    console.error("解析Msgpack消息失败:", _0x37c8e1);
  }
  return null;
}
function _parseMsgpackEvents(_0x2c3b51) {
  addLog("开始解析 Msgpack 事件流...");
  let _0x2d75fc = 0;
  const _0x1a4875 = [];
  while (_0x2d75fc < _0x2c3b51.length) {
    try {
      const _0x531933 = _0x2c3b51.slice(_0x2d75fc, _0x2d75fc + 4);
      const _0x339ba9 = new DataView(_0x531933.buffer).getUint32(0);
      const _0x3c4940 = _0x2d75fc + 4;
      const _0x513c90 = _0x3c4940 + _0x339ba9;
      addLog("发现 Msgpack 消息: 长度 " + _0x339ba9 + ", 范围 " + _0x3c4940 + "-" + _0x513c90);
      const _0x5d1417 = _0x2c3b51.slice(_0x3c4940, _0x513c90);
      const _0x2a2545 = _parseMsgpackMessage(_0x5d1417);
      if (_0x2a2545) {
        _0x1a4875.push(_0x2a2545);
      }
      _0x2d75fc = _0x513c90;
    } catch (_0x2e3c56) {
      addLog("解析 Msgpack 事件失败: " + _0x2e3c56.message);
      console.error("解析Msgpack事件失败:", _0x2e3c56);
      _0x2d75fc++;
    }
  }
  addLog("Msgpack 事件流解析完成，共找到 " + _0x1a4875.length + " 个事件。");
  return _0x1a4875;
}
function uint8ArrayToBase64(_0x59a6cb) {
  let _0x38f07d = "";
  const _0x5ca9ab = _0x59a6cb.byteLength;
  for (let _0x4ece9e = 0; _0x4ece9e < _0x5ca9ab; _0x4ece9e++) {
    _0x38f07d += String.fromCharCode(_0x59a6cb[_0x4ece9e]);
  }
  return btoa(_0x38f07d);
}
async function generateNovelAIImage({
  prompt: _0x46a2c1,
  width: _0x304155,
  height: _0x210209,
  change: _0x309f28
}) {
  clearLog();
  const _0x1bd25c = taskQueue.addTask({
    name: (_0x46a2c1 || "").substring(0, 30) + (_0x46a2c1 && _0x46a2c1.length > 30 ? "..." : ""),
    type: TaskType.NOVELAI,
    prompt: _0x46a2c1
  });
  currentTaskId = _0x1bd25c;
  currentAbortController = new AbortController();
  addLog("开始 NovelAI 生图流程...客户端为" + extension_settings[extensionName].client);
  addLog("请求尺寸: 宽度 - " + (_0x304155 || "默认") + ", 高度 - " + (_0x210209 || "默认"));
  console.log("正在处理中文注释...", _0x46a2c1);
  let _0x38e949 = _0x309f28;
  _0x46a2c1 = processCharacterPrompt(_0x46a2c1);
  _0x309f28 = processCharacterPrompt(_0x309f28);
  _0x46a2c1 = await stripChineseAnnotations(_0x46a2c1);
  _0x309f28 = await stripChineseAnnotations(_0x309f28);
  console.log("正在处理中文注释完成...", _0x46a2c1);
  if (extension_settings[extensionName].novelaiApi == "000000") {
    addLog("请填写 NovelAI API Key");
    toastr.error("请填写 NovelAI API Key");
    taskQueue.completeTask(_0x1bd25c, false);
    currentTaskId = null;
    throw new Error("请填写 NovelAI API Key");
  }
  const _0x2aa199 = _0x309f28 && _0x309f28.trim() !== "" ? _0x309f28 : _0x46a2c1;
  addLog("用于生成的Tag: " + _0x2aa199);
  let _0x43905b = false;
  if (_0x2aa199.includes("Scene Composition") && (extension_settings[extensionName].novelaimode == "nai-diffusion-4-curated-preview" || extension_settings[extensionName].novelaimode == "nai-diffusion-4-full" || extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-full" || extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-curated")) {
    _0x43905b = true;
  }
  addLog("是否启用分角色模式 (Divide_roles): " + _0x43905b);
  let _0x590936 = extension_settings[extensionName].novelaiApi;
  let _0x49ffd9 = "";
  if (extension_settings[extensionName].AQT_novelai != "" && extension_settings[extensionName].novelaimode == "nai-diffusion-4-curated-preview") {
    _0x49ffd9 = "rating:general, best quality, very aesthetic, absurdres";
  } else if (extension_settings[extensionName].AQT_novelai != "" && extension_settings[extensionName].novelaimode == "nai-diffusion-4-full") {
    _0x49ffd9 = "no text, best quality, very aesthetic, absurdres";
  } else if (extension_settings[extensionName].AQT_novelai != "" && extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-full") {
    _0x49ffd9 = "very aesthetic, masterpiece, no text";
  } else if (extension_settings[extensionName].AQT_novelai != "" && extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-curated") {
    _0x49ffd9 = "very aesthetic, masterpiece, no text, -0.8::feet::, rating:general";
  } else if (extension_settings[extensionName].AQT_novelai != "" && extension_settings[extensionName].novelaimode == "nai-diffusion-3") {
    _0x49ffd9 = "best quality, amazing quality, very aesthetic, absurdres";
  }
  addLog("AQT (质量标签) 设置: " + (_0x49ffd9 || "无"));
  let _0x315c40 = "";
  let _0x58c310 = {};
  let _0x532cc8 = "";
  let _0x30aa3b = "";
  if (_0x43905b) {
    addLog("分角色模式: 解析带坐标的提示词字符串。");
    _0x58c310 = parsePromptStringWithCoordinates(_0x2aa199);
    _0x532cc8 = _0x58c310["Scene Composition"];
    for (let _0x47c5c2 = 1; _0x47c5c2 <= 4; _0x47c5c2++) {
      if (_0x58c310["Character " + _0x47c5c2 + " Prompt"]) {
        _0x30aa3b = _0x30aa3b + ", " + _0x58c310["Character " + _0x47c5c2 + " Prompt"];
      }
    }
  } else {
    addLog("标准模式: 使用请求中的 prompt。");
    _0x532cc8 = deduplicateTags(_0x2aa199);
  }
  let {
    modifiedPrompt: _0x579f43,
    insertions: _0x4de6f2
  } = await prompt_replace(_0x532cc8, _0x30aa3b);
  if (_0x43905b && extension_settings[extensionName].client == "jiuguan") {
    for (let _0x533b34 = 1; _0x533b34 <= 4; _0x533b34++) {
      if (_0x58c310["Character " + _0x533b34 + " Prompt"]) {
        _0x579f43 = _0x579f43 + " | " + prompt_replace_for_character(_0x58c310["Character " + _0x533b34 + " Prompt"]);
      }
    }
  }
  _0x315c40 = await zhengmian(extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_novelai].fixedPrompt, _0x579f43, extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_novelai].fixedPrompt_end, _0x49ffd9, _0x4de6f2);
  if (extension_settings[extensionName].addFurryDataset == "true") {
    _0x315c40 = "fur dataset, " + _0x315c40;
    addLog("添加了 'fur dataset' 到提示词。");
  }
  let _0x901a9f = "";
  addLog("正在根据模型 (" + extension_settings[extensionName].novelaimode + ") 和 UCP 预设 (" + extension_settings[extensionName].UCP_novelai + ") 选择负面提示词...");
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-3" && extension_settings[extensionName].UCP_novelai == "Heavy") {
    _0x901a9f = "lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-3" && extension_settings[extensionName].UCP_novelai == "Light") {
    _0x901a9f = "lowres, jpeg artifacts, worst quality, watermark, blurry, very displeasing";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-3" && extension_settings[extensionName].UCP_novelai == "Human Focus") {
    _0x901a9f = "lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract], bad anatomy, bad hands, @_@, mismatched pupils, heart-shaped pupils, glowing eyes";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-full" && extension_settings[extensionName].UCP_novelai == "Human Focus") {}
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-full" && extension_settings[extensionName].UCP_novelai == "Heavy") {
    _0x901a9f = "blurry, lowres, error, film grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, multiple views, logo, too many watermarks, white blank page, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-full" && extension_settings[extensionName].UCP_novelai == "Light") {
    _0x901a9f = "blurry, lowres, error, worst quality, bad quality, jpeg artifacts, very displeasing, white blank page, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-curated-preview" && extension_settings[extensionName].UCP_novelai == "Human Focus") {}
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-curated-preview" && extension_settings[extensionName].UCP_novelai == "Heavy") {
    _0x901a9f = "blurry, lowres, error, film grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, logo, dated, signature, multiple views, gigantic breasts, white blank page, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-curated-preview" && extension_settings[extensionName].UCP_novelai == "Light") {
    _0x901a9f = "blurry, lowres, error, worst quality, bad quality, jpeg artifacts, very displeasing, logo, dated, signature, white blank page, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-curated" && extension_settings[extensionName].UCP_novelai == "Human Focus") {
    _0x901a9f = "blurry, lowres, upscaled, artistic error, film grain, scan artifacts, bad anatomy, bad hands, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, halftone, multiple views, logo, too many watermarks, @_@, mismatched pupils, glowing eyes, negative space, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-curated" && extension_settings[extensionName].UCP_novelai == "Heavy") {
    _0x901a9f = "blurry, lowres, upscaled, artistic error, film grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, halftone, multiple views, logo, too many watermarks, negative space, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-curated" && extension_settings[extensionName].UCP_novelai == "Light") {
    _0x901a9f = "blurry, lowres, upscaled, artistic error, film grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, halftone, multiple views, logo, too many watermarks, negative space, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-full" && extension_settings[extensionName].UCP_novelai == "Human Focus") {
    _0x901a9f = "lowres, artistic error, film grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, dithering, halftone, screentone, multiple views, logo, too many watermarks, negative space, blank page, @_@, mismatched pupils, glowing eyes, bad anatomy";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-full" && extension_settings[extensionName].UCP_novelai == "Heavy") {
    _0x901a9f = "lowres, artistic error, film grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, dithering, halftone, screentone, multiple views, logo, too many watermarks, negative space, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-full" && extension_settings[extensionName].UCP_novelai == "Light") {
    _0x901a9f = "lowres, artistic error, scan artifacts, worst quality, bad quality, jpeg artifacts, multiple views, very displeasing, too many watermarks, negative space, blank page";
  }
  if (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-full" && extension_settings[extensionName].UCP_novelai == "Furry Focus") {
    _0x901a9f = "{worst quality}, distracting watermark, unfinished, bad quality, {widescreen}, upscale, {sequence}, {{grandfathered content}}, blurred foreground, chromatic aberration, sketch, everyone, [sketch background], simple, [flat colors], ych (character), outline, multiple scenes, [[horror (theme)]], comic";
  }
  let _0x5e3aac = await fumian(extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_novelai].negativePrompt, _0x901a9f);
  if (!_0x43905b && window.collectedCharacterNegatives) {
    const _0x303984 = window.collectedCharacterNegatives.trim();
    if (_0x303984) {
      _0x5e3aac = _0x5e3aac ? _0x5e3aac + ", " + _0x303984 : _0x303984;
      addLog("[角色负面] 添加角色负面提示词: " + _0x303984);
      console.log("[NovelAI] 合并角色负面提示词:", _0x303984);
    }
  }
  let _0xd52d83 = extension_settings[extensionName].AI_use_coords == "false";
  let _0x46e038 = {
    params_version: 3,
    width: Number(_0x304155 ? _0x304155 : extension_settings[extensionName].novelai_width),
    height: Number(_0x210209 ? _0x210209 : extension_settings[extensionName].novelai_height),
    scale: Number(extension_settings[extensionName].nai3Scale),
    sampler: extension_settings[extensionName].novelai_sampler,
    steps: Number(extension_settings[extensionName].novelai_steps),
    n_samples: 1,
    ucPreset: 3,
    qualityToggle: true,
    sm: extension_settings[extensionName].sm === "false" ? false : true,
    sm_dyn: extension_settings[extensionName].dyn === "false" || extension_settings[extensionName].sm === "false" ? false : true,
    dynamic_thresholding: extension_settings[extensionName].nai3Deceisp === "false" ? false : true,
    controlnet_strength: 1,
    legacy: false,
    legacy_uc: false,
    add_original_image: true,
    cfg_rescale: Number(extension_settings[extensionName].cfg_rescale),
    noise_schedule: extension_settings[extensionName].Schedule,
    skip_cfg_above_sigma: extension_settings[extensionName].nai3Variety === "false" ? null : 19,
    legacy_v3_extend: false,
    stream: "msgpack",
    seed: extension_settings[extensionName].novelai_seed === "0" || extension_settings[extensionName].novelai_seed === "" || extension_settings[extensionName].novelai_seed === "-1" ? generateRandomSeed() : Number(extension_settings[extensionName].novelai_seed),
    negative_prompt: _0x5e3aac,
    reference_image_multiple: [],
    reference_information_extracted_multiple: [],
    reference_strength_multiple: [],
    reference_image_multiple_cached: [],
    normalize_reference_strength_multiple: extension_settings[extensionName].normalizeRefStrength === "true",
    use_coords: _0xd52d83
  };
  if (extension_settings[extensionName].novelaimode !== "nai-diffusion-3") {
    if (_0x43905b) {
      for (let _0x963a93 = 1; _0x963a93 <= 4; _0x963a93++) {
        _0x58c310["Character " + _0x963a93 + " Prompt"] &&= await prompt_replace_for_character(_0x58c310["Character " + _0x963a93 + " Prompt"]);
      }
      let _0x41dd8c = [];
      for (let _0x3dd0c9 = 1; _0x3dd0c9 <= 4; _0x3dd0c9++) {
        if (_0x58c310["Character " + _0x3dd0c9 + " Prompt"]) {
          _0x41dd8c[_0x3dd0c9 - 1] = {
            enabled: true,
            prompt: _0x58c310["Character " + _0x3dd0c9 + " Prompt"],
            center: _0x58c310["Character " + _0x3dd0c9 + " coordinates"],
            uc: _0x58c310["Character " + _0x3dd0c9 + " UC"] ? _0x58c310["Character " + _0x3dd0c9 + " UC"] : "one arms,lowres, aliasing, jaggy lines,bad hands,one legs"
          };
        }
      }
      const _0x42478e = {
        base_caption: _0x5e3aac,
        char_captions: []
      };
      const _0x41d2be = {
        caption: _0x42478e,
        legacy_uc: false
      };
      let _0x39508f = _0x41d2be;
      for (let _0x4ca083 = 1; _0x4ca083 <= 4; _0x4ca083++) {
        if (_0x58c310["Character " + _0x4ca083 + " Prompt"]) {
          const _0x39b250 = {
            char_caption: _0x58c310["Character " + _0x4ca083 + " UC"] ? _0x58c310["Character " + _0x4ca083 + " UC"] : "one arms,lowres, aliasing, jaggy lines,bad hands,one legs",
            centers: [_0x58c310["Character " + _0x4ca083 + " coordinates"]]
          };
          _0x39508f.caption.char_captions.push(_0x39b250);
        }
      }
      const _0x4d158d = {
        base_caption: _0x315c40,
        char_captions: []
      };
      const _0x7cff80 = {
        caption: _0x4d158d,
        use_coords: _0xd52d83,
        use_order: true
      };
      let _0x582296 = _0x7cff80;
      for (let _0x412137 = 1; _0x412137 <= 4; _0x412137++) {
        if (_0x58c310["Character " + _0x412137 + " Prompt"]) {
          const _0xcc3656 = {
            char_caption: _0x58c310["Character " + _0x412137 + " Prompt"],
            centers: [_0x58c310["Character " + _0x412137 + " coordinates"]]
          };
          _0x582296.caption.char_captions.push(_0xcc3656);
        }
      }
      _0x46e038 = {
        ..._0x46e038,
        characterPrompts: _0x41dd8c,
        v4_prompt: _0x582296,
        v4_negative_prompt: _0x39508f,
        add_original_image: true,
        skip_cfg_above_sigma: extension_settings[extensionName].nai3Variety === "false" ? null : 19.343056794463642
      };
      if (extension_settings[extensionName].nai3Variety != "false" && extension_settings[extensionName].novelaimode == "nai-diffusion-4-full") {
        _0x46e038.skip_cfg_above_sigma = 19;
      }
      if (extension_settings[extensionName].nai3Variety != "false" && (extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-curated" || extension_settings[extensionName].novelaimode == "nai-diffusion-4-5-full")) {
        _0x46e038.skip_cfg_above_sigma = 59.04722600415217;
      }
      _0x46e038 = {
        autoSmea: false,
        normalize_reference_strength_multiple: extension_settings[extensionName].normalizeRefStrength === "true",
        inpaintImg2ImgStrength: 1,
        params_version: 3,
        width: Number(_0x304155 ? _0x304155 : extension_settings[extensionName].novelai_width),
        height: Number(_0x210209 ? _0x210209 : extension_settings[extensionName].novelai_height),
        scale: Number(extension_settings[extensionName].nai3Scale),
        sampler: extension_settings[extensionName].novelai_sampler,
        steps: Number(extension_settings[extensionName].novelai_steps),
        n_samples: 1,
        ucPreset: 3,
        qualityToggle: true,
        dynamic_thresholding: false,
        controlnet_strength: 1,
        legacy: false,
        legacy_uc: false,
        add_original_image: true,
        cfg_rescale: Number(extension_settings[extensionName].cfg_rescale),
        noise_schedule: extension_settings[extensionName].Schedule,
        skip_cfg_above_sigma: extension_settings[extensionName].nai3Variety === "false" ? null : 19.343056794463642,
        legacy_v3_extend: false,
        seed: extension_settings[extensionName].novelai_seed === "0" || extension_settings[extensionName].novelai_seed === "" || extension_settings[extensionName].novelai_seed === "-1" ? generateRandomSeed() : Number(extension_settings[extensionName].novelai_seed),
        negative_prompt: _0x5e3aac,
        reference_image_multiple: [],
        reference_information_extracted_multiple: [],
        reference_strength_multiple: [],
        reference_image_multiple_cached: [],
        use_coords: _0xd52d83,
        stream: "msgpack",
        characterPrompts: _0x41dd8c,
        v4_prompt: _0x582296,
        v4_negative_prompt: _0x39508f
      };
    } else {
      const _0x27f2ab = {
        base_caption: _0x315c40,
        char_captions: []
      };
      _0x46e038 = {
        autoSmea: false,
        normalize_reference_strength_multiple: extension_settings[extensionName].normalizeRefStrength === "true",
        inpaintImg2ImgStrength: 1,
        params_version: 3,
        width: Number(_0x304155 ? _0x304155 : extension_settings[extensionName].novelai_width),
        height: Number(_0x210209 ? _0x210209 : extension_settings[extensionName].novelai_height),
        scale: Number(extension_settings[extensionName].nai3Scale),
        sampler: extension_settings[extensionName].novelai_sampler,
        steps: Number(extension_settings[extensionName].novelai_steps),
        n_samples: 1,
        ucPreset: 3,
        qualityToggle: false,
        dynamic_thresholding: false,
        controlnet_strength: 1,
        legacy: false,
        legacy_uc: false,
        add_original_image: true,
        cfg_rescale: Number(extension_settings[extensionName].cfg_rescale),
        noise_schedule: extension_settings[extensionName].Schedule,
        skip_cfg_above_sigma: extension_settings[extensionName].nai3Variety === "false" ? null : 19.343056794463642,
        legacy_v3_extend: false,
        seed: extension_settings[extensionName].novelai_seed === "0" || extension_settings[extensionName].novelai_seed === "" || extension_settings[extensionName].novelai_seed === "-1" ? generateRandomSeed() : Number(extension_settings[extensionName].novelai_seed),
        negative_prompt: _0x5e3aac,
        reference_image_multiple: [],
        reference_information_extracted_multiple: [],
        reference_strength_multiple: [],
        reference_image_multiple_cached: [],
        use_coords: _0xd52d83,
        characterPrompts: [],
        stream: "msgpack",
        v4_prompt: {
          caption: _0x27f2ab,
          use_coords: _0xd52d83,
          use_order: true
        },
        v4_negative_prompt: {
          caption: {
            base_caption: _0x5e3aac,
            char_captions: []
          },
          legacy_uc: false
        }
      };
    }
  }
  if (extension_settings[extensionName].novelai_sampler == "k_euler_ancestral") {
    _0x46e038.deliberate_euler_ancestral_bug = false;
    _0x46e038.prefer_brownian = true;
  }
  if (extension_settings[extensionName].nai3Variety != "false") {
    _0x46e038.skip_cfg_above_sigma = calculateSkipCfgAboveSigma(_0x46e038.width, _0x46e038.height, extension_settings[extensionName].novelaimode);
  }
  const _0x953a0b = extension_settings[extensionName].novelaimode === "nai-diffusion-3";
  const _0x555467 = ["nai-diffusion-4-5-full", "nai-diffusion-4-5-curated"].includes(extension_settings[extensionName].novelaimode);
  const _0x49ad82 = ["nai-diffusion-4-full", "nai-diffusion-4-curated-preview", "nai-diffusion-4-5-full", "nai-diffusion-4-5-curated"].includes(extension_settings[extensionName].novelaimode);
  const _0x51af7e = extension_settings[extensionName].client !== "jiuguan";
  if (extension_settings[extensionName].nai3CharRef === "true" && _0x555467 && _0x51af7e) {
    try {
      await applyCharacterReferenceGroup(_0x46e038);
    } catch (_0x4f0c4a) {
      console.error("[CharRef] Unexpected error in Character Reference:", _0x4f0c4a);
      addLog("[CharRef] 错误: 角色参考应用失败: " + _0x4f0c4a.message);
      toastr.error("角色参考应用失败，将继续进行图像生成", "角色参考");
    }
  } else if (extension_settings[extensionName].nai3CharRef === "true") {
    if (!_0x555467) {
      addLog("[CharRef] 跳过: 当前模型不支持角色参考 (仅支持 NAI4.5)");
      console.warn("[CharRef] Skipped: Current model does not support Character Reference (NAI4.5 only)");
    }
    if (!_0x51af7e) {
      addLog("[CharRef] 跳过: 酒馆端不支持角色参考");
      console.warn("[CharRef] Skipped: Tavern client does not support Character Reference");
    }
  } else if (extension_settings[extensionName].enableVibeGroupTransfer === "true" && _0x49ad82 && _0x51af7e) {
    try {
      await applyVibeGroupTransfer(_0x46e038);
    } catch (_0x4000c8) {
      console.error("[VibeGroup] Unexpected error in Vibe Group Transfer:", _0x4000c8);
      addLog("[VibeGroup] 错误: Vibe 组氛围转移失败: " + _0x4000c8.message);
      toastr.error("Vibe 组氛围转移失败，将继续进行图像生成", "Vibe 组氛围转移");
    }
  } else if (extension_settings[extensionName].enableVibeGroupTransfer === "true") {
    if (!_0x49ad82) {
      addLog("[VibeGroup] 跳过: 当前模型不支持 Vibe 组氛围转移 (仅支持 NAI4/4.5)");
      console.warn("[VibeGroup] Skipped: Current model does not support Vibe Group Transfer (NAI4/4.5 only)");
    }
    if (!_0x51af7e) {
      addLog("[VibeGroup] 跳过: 酒馆端不支持 Vibe 组氛围转移");
      console.warn("[VibeGroup] Skipped: Tavern client does not support Vibe Group Transfer");
    }
  } else if (extension_settings[extensionName].nai3VibeTransfer === "true" && _0x953a0b) {
    try {
      await applySingleVibeTransfer(_0x46e038);
    } catch (_0x448b1a) {
      console.error("[SingleVibe] Unexpected error in Single Vibe Transfer:", _0x448b1a);
      addLog("[SingleVibe] 错误: 单个 Vibe 转移失败: " + _0x448b1a.message);
      toastr.error("Vibe 转移失败，将继续进行图像生成", "Vibe 转移");
    }
  } else if (extension_settings[extensionName].nai3VibeTransfer === "true") {
    if (!_0x953a0b) {
      addLog("[SingleVibe] 跳过: 当前模型不支持单个 Vibe 转移 (仅支持 NAI3)");
      console.warn("[SingleVibe] Skipped: Current model does not support Single Vibe Transfer (NAI3 only)");
    }
  }
  addLog("[Payload] 开始清理和验证 payload...");
  _0x46e038 = cleanNovelAIPayload(_0x46e038, extension_settings[extensionName].novelaimode);
  try {
    validateNovelAIPayload(_0x46e038, extension_settings[extensionName].novelaimode);
  } catch (_0x2d4640) {
    addLog("[验证失败] " + _0x2d4640.message);
    toastr.error("Payload 验证失败: " + _0x2d4640.message, "NovelAI 生成错误");
    taskQueue.completeTask(_0x1bd25c, false);
    currentTaskId = null;
    throw _0x2d4640;
  }
  const _0x4ff9a9 = _0x46e038;
  const _0xb64b6d = JSON.parse(JSON.stringify(_0x4ff9a9));
  if (_0xb64b6d.reference_image_multiple && _0xb64b6d.reference_image_multiple.length > 0) {
    _0xb64b6d.reference_image_multiple = ["...image data truncated..."];
  }
  if (_0xb64b6d.reference_image_multiple_cached && _0xb64b6d.reference_image_multiple_cached.length > 0) {
    _0xb64b6d.reference_image_multiple_cached = _0xb64b6d.reference_image_multiple_cached.map((_0x1acfcd, _0x320563) => ({
      cache_secret_key: _0x1acfcd.cache_secret_key,
      data: "...vibe data truncated (" + (_0x1acfcd.data?.length || 0) + " chars)..."
    }));
  }
  if (_0xb64b6d.director_reference_images && _0xb64b6d.director_reference_images.length > 0) {
    _0xb64b6d.director_reference_images = ["...image data truncated..."];
  }
  if (_0xb64b6d.director_reference_images_cached && _0xb64b6d.director_reference_images_cached.length > 0) {
    _0xb64b6d.director_reference_images_cached = _0xb64b6d.director_reference_images_cached.map((_0x125783, _0x512cfc) => ({
      cache_secret_key: _0x125783.cache_secret_key,
      data: "...char ref data truncated (" + (_0x125783.data?.length || 0) + " chars)..."
    }));
  }
  if (extension_settings[extensionName].client != "jiuguan") {
    addLog("最终生图参数 (payload): " + JSON.stringify(_0xb64b6d, null, 2));
  }
  let _0x2664c8 = new URL("https://image.novelai.net/ai/generate-image");
  if (extension_settings[extensionName].novelaisite != "官网") {
    if (extension_settings[extensionName].client == "jiuguan") {
      taskQueue.completeTask(_0x1bd25c, false);
      currentTaskId = null;
      throw new Error("酒馆端不支持自定义站点！");
    }
    let _0x108570 = extension_settings[extensionName].novelaiOtherSite;
    _0x2664c8 = _0x108570.includes("generate-image") ? new URL(_0x108570) : new URL(_0x108570 + "/ai/generate-image");
  }
  try {
    let _0xfad59b = "";
    if (extension_settings[extensionName].client == "jiuguan") {
      while (!window.xiancheng) {
        if (!taskQueue.isTaskInQueue(_0x1bd25c)) {
          addLog("任务已被用户取消");
          throw new Error("任务已取消");
        }
        await sleep(1000);
      }
      window.xiancheng = false;
      if (extension_settings[extensionName].enableCloudQueue === "true") {
        const _0x2c0bb5 = await hashKey(_0x590936);
        const _0x58d801 = getUserId();
        try {
          addLog("[云端队列] 开始等待...");
          const _0x4113e3 = await waitForTurn(_0x2c0bb5, _0x58d801, _0x1bd25c, taskQueue);
          const _0xdb144e = {
            keyHash: _0x2c0bb5,
            userId: _0x58d801,
            taskId: _0x1bd25c,
            lockToken: _0x4113e3.lockToken
          };
          currentCloudQueueInfo = _0xdb144e;
          addLog("[云端队列] 已获得锁，等待1秒后开始生成");
          await sleep(1000);
        } catch (_0xa5f8f7) {
          currentCloudQueueInfo = null;
          throw _0xa5f8f7;
        }
      }
      taskQueue.updateStatus(_0x1bd25c, "running");
      const _0x873a91 = await fetch("/api/secrets/read", {
        method: "POST",
        headers: getRequestHeaders(window.token),
        body: JSON.stringify({})
      });
      if (_0x873a91.ok) {
        if (extension_settings[extensionName].novelaiApi_id != "") {
          const _0x17af2f = await fetch("/api/secrets/delete", {
            method: "POST",
            headers: getRequestHeaders(window.token),
            body: JSON.stringify({
              id: extension_settings[extensionName].novelaiApi_id,
              key: "api_key_novel"
            })
          });
        }
        let _0x306ac7 = "";
        const _0xe62aed = await fetch("/api/secrets/write", {
          method: "POST",
          headers: getRequestHeaders(window.token),
          body: JSON.stringify({
            key: "api_key_novel",
            value: extension_settings[extensionName].novelaiApi,
            label: "插件设置的api_key_novel"
          })
        });
        if (!_0xe62aed.ok) {
          const _0x20bc8e = await _0xe62aed.text();
          throw new Error("Failed to write secret: " + _0x20bc8e);
        }
        const _0x472936 = await _0xe62aed.text();
        try {
          const _0x5c0966 = JSON.parse(_0x472936);
          if (_0x5c0966 && _0x5c0966.id) {
            extension_settings[extensionName].novelaiApi_id = _0x5c0966.id;
            saveSettingsDebounced();
            await fetch("/api/secrets/rotate", {
              method: "POST",
              headers: getRequestHeaders(window.token),
              body: JSON.stringify({
                id: _0x5c0966.id,
                key: "api_key_novel"
              })
            });
          }
        } catch (_0x1134f0) {
          addLog("Could not parse JSON from /api/secrets/write. Response was: \"" + _0x472936 + "\". Continuing without rotating key.");
          console.warn("Could not parse JSON from /api/secrets/write. Response was: \"" + _0x472936 + "\". Continuing without rotating key.");
        }
      }
      const _0x1740eb = {
        prompt: _0x315c40,
        model: extension_settings[extensionName].novelaimode,
        sampler: _0x46e038.sampler,
        scheduler: _0x46e038.noise_schedule,
        steps: _0x46e038.steps,
        scale: _0x46e038.scale,
        width: _0x46e038.width,
        height: _0x46e038.height,
        negative_prompt: _0x46e038.negative_prompt,
        decrisper: _0x46e038.dynamic_thresholding,
        variety_boost: _0x46e038.skip_cfg_above_sigma,
        sm: _0x46e038.sm,
        sm_dyn: _0x46e038.sm_dyn,
        seed: _0x46e038.seed
      };
      const _0x31b1b3 = _0x1740eb;
      addLog("最终生图参数 (payload): " + JSON.stringify(_0x31b1b3, null, 2));
      const _0x978e9 = await fetch("/api/novelai/generate-image", {
        method: "POST",
        headers: getRequestHeaders(window.token),
        body: JSON.stringify(_0x31b1b3),
        signal: currentAbortController?.signal
      });
      if (currentCloudQueueInfo) {
        await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
        currentCloudQueueInfo = null;
      }
      setTimeout(() => {
        console.log("xiancheng 为true");
        window.xiancheng = true;
      }, extension_settings[extensionName].imageGenInterval);
      ;
      if (!_0x978e9.ok) {
        const _0x49e663 = await _0x978e9.text();
        throw new Error("生成图片失败，详情查看酒馆控制台: " + _0x49e663);
      }
      let _0x9836a7 = await _0x978e9.text();
      try {
        const _0x2eec1e = JSON.parse(_0x9836a7);
        _0xfad59b = _0x2eec1e.images[0];
      } catch (_0x40f639) {
        addLog("JSON 解析失败，尝试作为原始 Base64 数据处理。");
        _0xfad59b = _0x9836a7;
      }
    } else {
      let _0x3283fa = "";
      let _0x39dfb2 = "Bearer " + _0x590936;
      let _0x3e92a3 = "";
      const _0x1d3bd6 = {
        input: _0x315c40,
        model: extension_settings[extensionName].novelaimode,
        action: "generate",
        parameters: _0x4ff9a9,
        use_new_shared_trial: true
      };
      _0x3283fa = _0x1d3bd6;
      if (_0x3e92a3) {
        const _0x15045f = {
          input: _0x315c40,
          model: extension_settings[extensionName].novelaimode,
          action: "generate",
          parameters: _0x4ff9a9,
          recaptcha_token: _0x3e92a3.token,
          use_new_shared_trial: true
        };
        _0x3283fa = _0x15045f;
        _0x39dfb2 = "Bearer " + _0x3e92a3.token;
      }
      console.log("data11:", _0x3283fa);
      let _0x1b5047 = true;
      while (!window.xiancheng) {
        if (!taskQueue.isTaskInQueue(_0x1bd25c)) {
          addLog("任务已被用户取消");
          throw new Error("任务已取消");
        }
        await sleep(1000);
      }
      ;
      window.xiancheng = false;
      if (extension_settings[extensionName].enableCloudQueue === "true") {
        const _0x593f8d = await hashKey(_0x590936);
        const _0x1a9a6a = getUserId();
        try {
          addLog("[云端队列] 开始等待...");
          const _0x394f2a = await waitForTurn(_0x593f8d, _0x1a9a6a, _0x1bd25c, taskQueue);
          const _0x3c7c30 = {
            keyHash: _0x593f8d,
            userId: _0x1a9a6a,
            taskId: _0x1bd25c,
            lockToken: _0x394f2a.lockToken
          };
          currentCloudQueueInfo = _0x3c7c30;
          addLog("[云端队列] 已获得锁，等待1秒后开始生成");
          await sleep(1000);
        } catch (_0x5126e9) {
          currentCloudQueueInfo = null;
          throw _0x5126e9;
        }
      }
      taskQueue.updateStatus(_0x1bd25c, "running");
      let _0x5973c8;
      try {
        _0x5973c8 = await fetch(_0x2664c8, {
          method: "POST",
          headers: getDirectHeaders("application/json", _0x39dfb2),
          body: JSON.stringify(_0x3283fa),
          signal: currentAbortController?.signal
        });
      } catch (_0x274c24) {
        addLog("请求遇到网络错误: " + _0x274c24.message + "。将在1秒后重试...");
        await sleep(1000);
        try {
          _0x5973c8 = await fetch(_0x2664c8, {
            method: "POST",
            headers: getDirectHeaders("application/json", _0x39dfb2),
            body: JSON.stringify(_0x3283fa),
            signal: currentAbortController?.signal
          });
        } catch (_0x373001) {
          if (currentCloudQueueInfo) {
            await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
            currentCloudQueueInfo = null;
          }
          setTimeout(() => {
            console.log("xiancheng 为true");
            window.xiancheng = true;
          }, extension_settings[extensionName].imageGenInterval);
          ;
          addLog("重试失败: " + _0x373001.message);
          throw _0x373001;
        }
      }
      if (currentCloudQueueInfo) {
        await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
        currentCloudQueueInfo = null;
      }
      setTimeout(() => {
        console.log("xiancheng 为true");
        window.xiancheng = true;
      }, extension_settings[extensionName].imageGenInterval);
      ;
      if (!_0x5973c8.ok) {
        const _0x4d0c98 = await _0x5973c8.text();
        let _0x1fc3fc = "请求失败, 状态码: " + _0x5973c8.status + ", 错误信息: " + _0x4d0c98;
        switch (_0x5973c8.status) {
          case 400:
            try {
              const _0x391c0b = JSON.parse(_0x4d0c98);
              if (_0x391c0b.message) {
                _0x1fc3fc = "请求验证失败: " + _0x391c0b.message;
                addLog("[API 错误] 400 验证错误: " + _0x391c0b.message);
              }
            } catch (_0x20cf35) {
              _0x1fc3fc = "请求验证失败: " + _0x4d0c98;
              addLog("[API 错误] 400 验证错误: " + _0x4d0c98);
            }
            break;
          case 401:
            _0x1fc3fc = "API Key 错误或无效，请检查 API Key。";
            addLog("[API 错误] 401 认证失败");
            break;
          case 402:
            _0x1fc3fc = "需要有效订阅才能访问此端点。";
            addLog("[API 错误] 402 需要订阅");
            break;
          default:
            addLog("[API 错误] " + _0x5973c8.status + ": " + _0x4d0c98);
        }
        throw new Error(_0x1fc3fc);
      }
      const _0x828e8c = await _0x5973c8.arrayBuffer();
      _0xfad59b = await unzipFile(_0x828e8c);
    }
    if (!_0xfad59b) {
      throw new Error("未能从API响应中提取图像数据。");
    }
    let _0x38792e = "data:image/png;base64," + _0xfad59b;
    addLog("图像已成功获取并格式化为 data URL。");
    taskQueue.completeTask(_0x1bd25c, true);
    currentTaskId = null;
    currentAbortController = null;
    if (currentCloudQueueInfo) {
      await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
      currentCloudQueueInfo = null;
    }
    if (String(extension_settings[extensionName].convertToJpegStorage) === "true") {
      _0x38792e = await convertImageToJpeg(_0x38792e);
    }
    return {
      image: _0x38792e,
      change: _0x38e949 || ""
    };
  } catch (_0x168d0b) {
    if (currentCloudQueueInfo) {
      if (_0x4a41e6) {
        await leaveQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
      } else {
        await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
      }
      currentCloudQueueInfo = null;
    }
    setTimeout(() => {
      console.log("xiancheng 为true");
      window.xiancheng = true;
    }, extension_settings[extensionName].imageGenInterval);
    ;
    const _0x4a41e6 = _0x168d0b.name === "AbortError" || _0x168d0b.message === "任务已取消";
    if (_0x4a41e6) {
      addLog("NovelAI 请求已被用户取消");
    } else {
      taskQueue.completeTask(_0x1bd25c, false);
    }
    currentTaskId = null;
    currentAbortController = null;
    throw _0x168d0b;
  }
}
async function generateNovelAIInpaint({
  prompt: _0x44f098,
  width: _0x380778,
  height: _0x53ecfb,
  change: _0x362803
}) {
  clearLog();
  addLog("[NovelAI Inpaint] 开始局部重绘流程...");
  if (!window.novelaiInpaintImage) {
    const _0x91753e = "缺少原始图像数据，请重新打开重绘对话框";
    addLog("[NovelAI Inpaint] 错误: " + _0x91753e);
    throw new Error(_0x91753e);
  }
  if (!window.novelaiInpaintMask) {
    const _0x15800e = "缺少遮罩数据，请重新打开重绘对话框";
    addLog("[NovelAI Inpaint] 错误: " + _0x15800e);
    throw new Error(_0x15800e);
  }
  if (!window.novelaiInpaintPrompt) {
    const _0x58e25c = "缺少提示词，请在重绘对话框中输入提示词";
    addLog("[NovelAI Inpaint] 错误: " + _0x58e25c);
    throw new Error(_0x58e25c);
  }
  const _0x841119 = taskQueue.addTask({
    name: "局部重绘: " + (window.novelaiInpaintPrompt || "").substring(0, 20) + "...",
    type: TaskType.NOVELAI,
    prompt: window.novelaiInpaintPrompt
  });
  currentTaskId = _0x841119;
  currentAbortController = new AbortController();
  try {
    const _0x1d95cc = window.novelaiInpaintImage.split(",")[1];
    const _0x82396 = window.novelaiInpaintMask.split(",")[1];
    const _0x262253 = window.novelaiInpaintPrompt;
    const _0x1a28bc = window.novelaiInpaintNegativePrompt || "blurry, lowres, bad quality";
    const _0xae597 = window.novelaiInpaintStrength || 0.54;
    addLog("[NovelAI Inpaint] 提示词: " + _0x262253);
    addLog("[NovelAI Inpaint] 负面提示词: " + _0x1a28bc);
    addLog("[NovelAI Inpaint] 强度: " + _0xae597);
    const _0x54fc79 = extension_settings[extensionName].novelaiApi;
    if (!_0x54fc79 || _0x54fc79 === "000000") {
      throw new Error("请填写 NovelAI API Key");
    }
    const _0x2f1532 = Number(window.novelaiInpaintWidth) || Number(_0x380778) || Number(extension_settings[extensionName].novelai_width) || 1024;
    const _0x74a11f = Number(window.novelaiInpaintHeight) || Number(_0x53ecfb) || Number(extension_settings[extensionName].novelai_height) || 1024;
    addLog("[NovelAI Inpaint] 图像尺寸: " + _0x2f1532 + "x" + _0x74a11f);
    const _0x1d2038 = extension_settings[extensionName].novelai_seed === "0" || extension_settings[extensionName].novelai_seed === "" || extension_settings[extensionName].novelai_seed === "-1" ? generateRandomSeed() : Number(extension_settings[extensionName].novelai_seed);
    const _0x47a334 = {
      strength: _0xae597,
      color_correct: true
    };
    const _0x7c0c6e = {
      base_caption: _0x1a28bc,
      char_captions: []
    };
    const _0xb7e7c1 = {
      caption: _0x7c0c6e,
      use_coords: false,
      use_order: true
    };
    const _0x257d22 = {
      action: "infill",
      input: _0x262253,
      model: "nai-diffusion-4-5-curated-inpainting",
      parameters: {
        width: _0x2f1532,
        height: _0x74a11f,
        scale: Number(extension_settings[extensionName].nai3Scale) || 5,
        sampler: extension_settings[extensionName].novelai_sampler || "k_euler_ancestral",
        steps: Number(extension_settings[extensionName].novelai_steps) || 28,
        seed: _0x1d2038,
        n_samples: 1,
        image: _0x1d95cc,
        mask: _0x82396,
        params_version: 3,
        prefer_brownian: true,
        autoSmea: false,
        strength: 0.7,
        noise: 0,
        extra_noise_seed: _0x1d2038,
        add_original_image: false,
        cfg_rescale: 0,
        controlnet_strength: 1,
        deliberate_euler_ancestral_bug: false,
        dynamic_thresholding: false,
        legacy: false,
        legacy_uc: false,
        legacy_v3_extend: false,
        normalize_reference_strength_multiple: extension_settings[extensionName].normalizeRefStrength === "true",
        noise_schedule: extension_settings[extensionName].Schedule || "karras",
        qualityToggle: true,
        skip_cfg_above_sigma: 19,
        ucPreset: 0,
        use_coords: false,
        image_format: "png",
        img2img: _0x47a334,
        inpaintImg2ImgStrength: _0xae597,
        v4_prompt: {
          caption: {
            base_caption: _0x262253,
            char_captions: []
          },
          use_coords: false,
          use_order: true
        },
        v4_negative_prompt: _0xb7e7c1
      }
    };
    addLog("[NovelAI Inpaint] 请求参数已构建完成");
    while (!window.xiancheng) {
      if (!taskQueue.isTaskInQueue(_0x841119)) {
        addLog("[NovelAI Inpaint] 任务已被用户取消");
        throw new Error("任务已取消");
      }
      await sleep(1000);
    }
    window.xiancheng = false;
    if (extension_settings[extensionName].enableCloudQueue === "true") {
      const _0x5c6d6e = await hashKey(_0x54fc79);
      const _0x298ba7 = getUserId();
      try {
        addLog("[NovelAI Inpaint] [云端队列] 开始等待...");
        const _0x14bec8 = await waitForTurn(_0x5c6d6e, _0x298ba7, _0x841119, taskQueue);
        const _0x15eb89 = {
          keyHash: _0x5c6d6e,
          userId: _0x298ba7,
          taskId: _0x841119,
          lockToken: _0x14bec8.lockToken
        };
        currentCloudQueueInfo = _0x15eb89;
        addLog("[NovelAI Inpaint] [云端队列] 已获得锁，等待1秒后开始生成");
        await sleep(1000);
      } catch (_0x58c1d4) {
        currentCloudQueueInfo = null;
        throw _0x58c1d4;
      }
    }
    taskQueue.updateStatus(_0x841119, "running");
    const _0x31b972 = new URL("https://image.novelai.net/ai/generate-image");
    const _0x15573d = "Bearer " + _0x54fc79;
    addLog("[NovelAI Inpaint] 正在发送请求到 NovelAI API...");
    let _0x578f4f;
    try {
      _0x578f4f = await fetch(_0x31b972, {
        method: "POST",
        headers: getDirectHeaders("application/json", _0x15573d),
        body: JSON.stringify(_0x257d22),
        signal: currentAbortController?.signal
      });
    } catch (_0x38f7ce) {
      addLog("[NovelAI Inpaint] 请求遇到网络错误: " + _0x38f7ce.message + "。将在1秒后重试...");
      await sleep(1000);
      try {
        _0x578f4f = await fetch(_0x31b972, {
          method: "POST",
          headers: getDirectHeaders("application/json", _0x15573d),
          body: JSON.stringify(_0x257d22),
          signal: currentAbortController?.signal
        });
      } catch (_0x1a203f) {
        if (currentCloudQueueInfo) {
          await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
          currentCloudQueueInfo = null;
        }
        setTimeout(() => {
          window.xiancheng = true;
        }, extension_settings[extensionName].imageGenInterval);
        addLog("[NovelAI Inpaint] 重试失败: " + _0x1a203f.message);
        throw _0x1a203f;
      }
    }
    if (currentCloudQueueInfo) {
      await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
      currentCloudQueueInfo = null;
    }
    setTimeout(() => {
      window.xiancheng = true;
    }, extension_settings[extensionName].imageGenInterval);
    if (!_0x578f4f.ok) {
      const _0x288724 = await _0x578f4f.text();
      let _0x13b460 = "请求失败, 状态码: " + _0x578f4f.status + ", 错误信息: " + _0x288724;
      switch (_0x578f4f.status) {
        case 401:
          _0x13b460 = "API Key 错误或无效，请检查 API Key。";
          break;
        case 402:
          _0x13b460 = "需要有效订阅才能访问此端点。";
          break;
      }
      throw new Error(_0x13b460);
    }
    addLog("[NovelAI Inpaint] 正在解压返回的 ZIP 文件...");
    const _0x147e5e = await _0x578f4f.arrayBuffer();
    const _0x3632c2 = await unzipFile(_0x147e5e);
    if (!_0x3632c2) {
      throw new Error("未能从API响应中提取图像数据");
    }
    let _0x33beaa = "data:image/png;base64," + _0x3632c2;
    addLog("[NovelAI Inpaint] 图像已成功获取并格式化为 data URL");
    delete window.novelaiInpaintImage;
    delete window.novelaiInpaintMask;
    delete window.novelaiInpaintPrompt;
    delete window.novelaiInpaintNegativePrompt;
    delete window.novelaiInpaintStrength;
    delete window.novelaiInpaintWidth;
    delete window.novelaiInpaintHeight;
    addLog("[NovelAI Inpaint] 已清理重绘参数");
    taskQueue.completeTask(_0x841119, true);
    currentTaskId = null;
    currentAbortController = null;
    if (String(extension_settings[extensionName].convertToJpegStorage) === "true") {
      _0x33beaa = await convertImageToJpeg(_0x33beaa);
    }
    addLog("[NovelAI Inpaint] 局部重绘完成！");
    return {
      image: _0x33beaa,
      change: _0x362803 || ""
    };
  } catch (_0x3208aa) {
    if (currentCloudQueueInfo) {
      const _0x2c81a5 = _0x3208aa.name === "AbortError" || _0x3208aa.message === "任务已取消";
      if (_0x2c81a5) {
        await leaveQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
      } else {
        await completeQueue(currentCloudQueueInfo.keyHash, currentCloudQueueInfo.userId, currentCloudQueueInfo.taskId, currentCloudQueueInfo.lockToken);
      }
      currentCloudQueueInfo = null;
    }
    setTimeout(() => {
      window.xiancheng = true;
    }, extension_settings[extensionName].imageGenInterval);
    const _0x50c027 = _0x3208aa.name === "AbortError" || _0x3208aa.message === "任务已取消";
    if (_0x50c027) {
      addLog("[NovelAI Inpaint] 请求已被用户取消");
    } else {
      taskQueue.completeTask(_0x841119, false);
    }
    currentTaskId = null;
    currentAbortController = null;
    delete window.novelaiInpaintImage;
    delete window.novelaiInpaintMask;
    delete window.novelaiInpaintPrompt;
    delete window.novelaiInpaintNegativePrompt;
    delete window.novelaiInpaintStrength;
    delete window.novelaiInpaintWidth;
    delete window.novelaiInpaintHeight;
    throw _0x3208aa;
  }
}
async function novelaigenerate(_0x4ad3c4) {
  const {
    id: _0x1d92fe,
    prompt: _0x47c9fd,
    width: _0xc0f3c1,
    height: _0x197e1b,
    change: _0x38de04
  } = _0x4ad3c4;
  addLog("收到生图请求 (ID: " + _0x1d92fe + ") - Prompt: " + _0x47c9fd + (_0x38de04 ? " - Change: " + _0x38de04 : ""));
  if (_0x38de04 && _0x38de04.includes("{修图}")) {
    bananaGenerate(_0x4ad3c4);
    return;
  }
  if (_0x38de04 && _0x38de04.includes("{视频}")) {
    bananaGenerate(_0x4ad3c4);
    return;
  }
  if (_0x38de04 && _0x38de04.includes("{NovelAI局部重绘}")) {
    try {
      const {
        image: _0x208d11,
        change: _0x3fe4f6
      } = await generateNovelAIInpaint({
        prompt: _0x47c9fd,
        width: _0xc0f3c1,
        height: _0x197e1b,
        change: _0x38de04
      });
      const _0x143430 = _0x3fe4f6.replaceAll("{NovelAI局部重绘}", "");
      try {
        if (extension_settings[extensionName].cache != "0") {
          const _0x4efb60 = {
            change: _0x143430
          };
          await setItemImg(_0x47c9fd, _0x208d11, _0x4efb60);
          addLog("图像已存入数据库 for prompt: " + _0x47c9fd);
        } else {
          addLog("缓存设置为不存入数据库");
        }
      } catch (_0x167948) {
        const _0xec1a18 = "无法将图像存入缓存数据库 (ID: " + _0x1d92fe + "): " + _0x167948.message;
        addLog("警告: " + _0xec1a18);
        console.warn("Could not save image to DB cache:", _0x167948);
      }
      const _0x6ae2d3 = {
        id: _0x1d92fe,
        success: true,
        imageData: _0x208d11,
        prompt: _0x47c9fd,
        change: _0x143430
      };
      eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x6ae2d3);
      addLog("发送生图成功响应 (ID: " + _0x1d92fe + ")");
    } catch (_0x5b7c88) {
      const _0x319de5 = _0x5b7c88.name === "AbortError" || _0x5b7c88.message === "任务已取消";
      if (_0x319de5) {
        addLog("任务已取消 (ID: " + _0x1d92fe + ")");
        const _0x4466e5 = {
          id: _0x1d92fe,
          success: false,
          cancelled: true,
          error: "任务已取消",
          prompt: _0x47c9fd
        };
        eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x4466e5);
      } else {
        const _0x5e0187 = "生图流程捕获到异常 (ID: " + _0x1d92fe + "): " + _0x5b7c88.message;
        addLog("错误: " + _0x5e0187);
        console.error("Error generating image:", _0x5b7c88);
        const _0x3ff0e8 = {
          id: _0x1d92fe,
          success: false,
          error: _0x5b7c88.message,
          prompt: _0x47c9fd
        };
        eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x3ff0e8);
        addLog("发送生图失败响应 (ID: " + _0x1d92fe + ")");
      }
    }
    return;
  }
  try {
    const {
      image: _0xbdbb64,
      change: _0x471085
    } = await generateNovelAIImage({
      prompt: _0x47c9fd,
      width: _0xc0f3c1,
      height: _0x197e1b,
      change: _0x38de04
    });
    try {
      if (extension_settings[extensionName].cache != "0") {
        const _0x41ed3f = {
          change: _0x471085
        };
        Promise.resolve().then(async () => {
          try {
            await setItemImg(_0x47c9fd, _0xbdbb64, _0x41ed3f);
            addLog("图像已存入数据库 for prompt: " + _0x47c9fd);
          } catch (_0x35d377) {
            console.error("NovelAI缓存写入失败:", _0x35d377);
            addLog("NovelAI缓存写入失败: " + _0x35d377.message);
          }
        });
      } else {
        addLog("缓存设置为不存入数据库");
      }
    } catch (_0xeb6ce9) {
      const _0x32babe = "无法将图像存入缓存数据库 (ID: " + _0x1d92fe + "): " + _0xeb6ce9.message;
      addLog("警告: " + _0x32babe);
      console.warn("Could not save image to DB cache:", _0xeb6ce9);
    }
    const _0x43405f = {
      id: _0x1d92fe,
      success: true,
      imageData: _0xbdbb64,
      prompt: _0x47c9fd,
      change: _0x471085
    };
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x43405f);
    addLog("发送生图成功响应 (ID: " + _0x1d92fe + ")");
  } catch (_0x5d60fe) {
    const _0x16e181 = _0x5d60fe.name === "AbortError" || _0x5d60fe.message === "任务已取消";
    if (_0x16e181) {
      addLog("任务已取消 (ID: " + _0x1d92fe + ")");
      const _0x1e224e = {
        id: _0x1d92fe,
        success: false,
        cancelled: true,
        error: "任务已取消",
        prompt: _0x47c9fd
      };
      eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x1e224e);
    } else {
      const _0x246669 = "生图流程捕获到异常 (ID: " + _0x1d92fe + "): " + _0x5d60fe.message;
      addLog("错误: " + _0x246669);
      console.error("Error generating image:", _0x5d60fe);
      const _0x340a87 = {
        id: _0x1d92fe,
        success: false,
        error: _0x5d60fe.message,
        prompt: _0x47c9fd
      };
      eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x340a87);
      addLog("发送生图失败响应 (ID: " + _0x1d92fe + ")");
    }
  }
}
function initializeNovelAIListener() {
  eventSource.on(EventType.GENERATE_IMAGE_REQUEST, novelaigenerate);
  eventSource.on("st_chatu8_cancel_novelai_task", ({
    taskId: _0x5942ce
  }) => {
    if (currentTaskId === _0x5942ce && currentAbortController) {
      addLog("收到取消请求，正在中断 NovelAI 任务: " + _0x5942ce);
      currentAbortController.abort();
      currentAbortController = null;
      currentTaskId = null;
    }
  });
  addLog("NovelAI 生图事件监听器已初始化。");
}
export async function replaceWithnovelai() {
  if (extension_settings[extensionName].mode == "novelai") {
    if (!window.initializeNovelAIListener) {
      window.initializeNovelAIListener = true;
      initializeNovelAIListener();
    }
    initializeImageProcessing();
  } else if (window.initializeNovelAIListener) {
    eventSource.removeListener(EventType.GENERATE_IMAGE_REQUEST, novelaigenerate);
    window.initializeNovelAIListener = false;
    addLog("NovelAI 生图事件监听器已关闭。");
  }
}