import { sleep, zhengmian, fumian, deepMerge, getSDMode, setSDMode, addLog, getRequestHeaders, clearLog, prompt_replace, getsdAuth, parsePromptStringWithCoordinates, prompt_replace_for_character, stripChineseAnnotations, convertImageToJpeg, deduplicateTags } from "./utils.js";
import { setItemImg } from "./database.js";
import { extension_settings } from "../../../../extensions.js";
import { extensionName, EventType } from "./config.js";
import { saveSettingsDebounced, eventSource } from "../../../../../script.js";
import { initializeImageProcessing } from "./iframe.js";
import { processCharacterPrompt } from "./characterprompt.js";
import { bananaGenerate } from "./banana.js";
import { taskQueue, TaskType } from "./taskQueue.js";
function getDirectHeaders(_0x28672d = null, _0x52a34f = null) {
  const _0x6d7357 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    Pragma: "no-cache"
  };
  if (_0x28672d) {
    _0x6d7357["Content-Type"] = _0x28672d;
  }
  if (_0x52a34f) {
    _0x6d7357.Authorization = _0x52a34f;
  }
  return _0x6d7357;
}
let currentTaskId = null;
async function generateSDImage({
  prompt: _0x177ec4,
  width: _0x10e46b,
  height: _0x1b94ec,
  change: _0x22029c
}) {
  clearLog();
  const _0xd93f05 = taskQueue.addTask({
    name: (_0x177ec4 || "").substring(0, 30) + (_0x177ec4 && _0x177ec4.length > 30 ? "..." : ""),
    type: TaskType.SD,
    prompt: _0x177ec4
  });
  currentTaskId = _0xd93f05;
  let _0x40662a = _0x22029c;
  _0x177ec4 = processCharacterPrompt(_0x177ec4);
  _0x22029c = processCharacterPrompt(_0x22029c);
  _0x177ec4 = await stripChineseAnnotations(_0x177ec4);
  _0x22029c = await stripChineseAnnotations(_0x22029c);
  const _0x3eed5f = extension_settings[extensionName].sdUrl.trim();
  const _0x228f20 = extension_settings[extensionName];
  addLog("正在通过sdwebui生成图片...客户端为" + _0x228f20.client + ",模型为" + _0x228f20.sd_cchatu_8_model);
  const _0x4a26ac = _0x22029c && _0x22029c.trim() !== "" ? _0x22029c : _0x177ec4;
  addLog("用于生成的Tag: " + _0x4a26ac);
  let _0x23b912 = false;
  if (_0x4a26ac.includes("Scene Composition")) {
    _0x23b912 = true;
  }
  addLog("是否启用分角色模式 (Divide_roles): " + _0x23b912);
  let _0x29f15b = {};
  let _0x4df77f = "";
  let _0x16447c = "";
  if (_0x23b912) {
    addLog("分角色模式: 解析带坐标的提示词字符串。");
    _0x29f15b = parsePromptStringWithCoordinates(_0x4a26ac);
    _0x4df77f = _0x29f15b["Scene Composition"];
    for (let _0x748063 = 1; _0x748063 <= 4; _0x748063++) {
      if (_0x29f15b["Character " + _0x748063 + " Prompt"]) {
        _0x16447c = _0x16447c + ", " + _0x29f15b["Character " + _0x748063 + " Prompt"];
      }
    }
  } else {
    addLog("标准模式: 使用请求中的 prompt。");
    _0x4df77f = deduplicateTags(_0x4a26ac);
  }
  let {
    modifiedPrompt: _0x30c862,
    insertions: _0x427b9a
  } = await prompt_replace(_0x4df77f, _0x16447c);
  if (_0x23b912) {
    for (let _0x27c851 = 1; _0x27c851 <= 4; _0x27c851++) {
      if (_0x29f15b["Character " + _0x27c851 + " Prompt"]) {
        _0x30c862 = _0x30c862 + ", " + prompt_replace_for_character(_0x29f15b["Character " + _0x27c851 + " Prompt"]);
      }
    }
  }
  let _0x19c47f = await zhengmian(extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_sd].fixedPrompt, _0x30c862, extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_sd].fixedPrompt_end, extension_settings[extensionName].AQT_sd, _0x427b9a);
  let _0x3b362d = await fumian(extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_sd].negativePrompt, extension_settings[extensionName].UCP_sd);
  if (!_0x23b912 && window.collectedCharacterNegatives) {
    const _0x3456b6 = window.collectedCharacterNegatives.trim();
    if (_0x3456b6) {
      _0x3b362d = _0x3b362d ? _0x3b362d + ", " + _0x3456b6 : _0x3456b6;
      addLog("[角色负面] 添加角色负面提示词: " + _0x3456b6);
      console.log("[SD] 合并角色负面提示词:", _0x3456b6);
    }
  }
  addLog("负面为: " + _0x3b362d);
  extension_settings.sd.auto_url = _0x3eed5f;
  await saveSettingsDebounced();
  try {
    if (_0x228f20.client === "jiuguan") {
      const _0x2cd45a = {
        auth: _0x228f20.st_chatu8_sd_auth ? _0x228f20.st_chatu8_sd_auth : "",
        url: _0x3eed5f
      };
      const _0x5393bf = await fetch("/api/sd/get-model", {
        method: "POST",
        body: JSON.stringify(_0x2cd45a),
        headers: getRequestHeaders(window.token)
      });
      if (!_0x5393bf.ok) {
        addLog("获取模型失败: " + _0x5393bf.status + " " + _0x5393bf.statusText);
        throw new Error("获取模型失败: " + _0x5393bf.status + " " + _0x5393bf.statusText);
      }
      let _0x208612 = await _0x5393bf.text();
      console.log("cmodel22222222", _0x208612);
      console.log("extension_settingss.sd_cchatu_8_model", _0x228f20.sd_cchatu_8_model);
      if (_0x208612 != _0x228f20.sd_cchatu_8_model) {
        addLog("正在设置模型为" + _0x228f20.sd_cchatu_8_model + "...");
        toastr.info("正在设置模型...为" + _0x228f20.sd_cchatu_8_model);
        const _0x4d3357 = {
          auth: _0x228f20.st_chatu8_sd_auth ? _0x228f20.st_chatu8_sd_auth : "",
          url: _0x3eed5f,
          model: _0x228f20.sd_cchatu_8_model
        };
        const _0x53e936 = await fetch("/api/sd/set-model", {
          method: "POST",
          body: JSON.stringify(_0x4d3357),
          headers: getRequestHeaders(window.token)
        });
        if (!_0x53e936.ok) {
          addLog("切换模型失败: " + _0x53e936.status + " " + _0x53e936.statusText);
          throw new Error("切换模型失败: " + _0x53e936.status + " " + _0x53e936.statusText);
        }
        toastr.info("设置模型...为" + _0x228f20.sd_cchatu_8_model + "成功");
      }
    } else {
      let _0x1a495b = await getSDMode(_0x3eed5f);
      if (_0x1a495b != _0x228f20.sd_cchatu_8_model) {
        addLog("正在切换模型为" + _0x228f20.sd_cchatu_8_model + "...");
        await setSDMode(_0x3eed5f, _0x228f20.sd_cchatu_8_model);
      }
    }
  } catch (_0x17f64b) {
    addLog("获取或者切换模型失败: " + _0x17f64b.message + "。请检查sdwebui是否正常启动，并检查模型是否正确。");
    taskQueue.completeTask(_0xd93f05, false);
    currentTaskId = null;
    throw new Error("获取或者切换模型失败，请检查sdwebui是否正常启动，并检查模型是否正确。");
  }
  let _0x5048e4 = -1;
  const _0x1854f3 = _0x228f20.sd_cseed;
  if (_0x1854f3 !== "" && _0x1854f3 !== null && !isNaN(Number(_0x1854f3)) && Number(_0x1854f3) >= 0) {
    _0x5048e4 = Number(_0x1854f3);
  }
  let _0x540bd0 = {
    prompt: _0x19c47f,
    negative_prompt: _0x3b362d,
    sampler_name: _0x228f20.sd_cchatu_8_samplerName,
    scheduler: _0x228f20.sd_cchatu_8_scheduler,
    steps: _0x228f20.sd_csteps,
    cfg_scale: _0x228f20.sdCfgScale,
    width: _0x10e46b ? _0x10e46b : _0x228f20.sd_cwidth,
    height: _0x1b94ec ? _0x1b94ec : _0x228f20.sd_cheight,
    restore_faces: _0x228f20.restoreFaces == "true",
    enable_hr: _0x228f20.sd_chires_fix == "true",
    hr_upscaler: _0x228f20.sd_cchatu_8_upscaler,
    hr_scale: _0x228f20.sd_cupscale_factor,
    hr_additional_modules: [],
    denoising_strength: _0x228f20.sd_cdenoising_strength,
    hr_second_pass_steps: _0x228f20.sd_chires_steps,
    seed: _0x5048e4,
    override_settings: {
      CLIP_stop_at_last_layers: Number(_0x228f20.sd_cclip_skip),
      sd_vae: _0x228f20.sd_cchatu_8_vae
    },
    override_settings_restore_afterwards: true,
    save_images: true,
    send_images: true,
    do_not_save_grid: false,
    do_not_save_samples: false
  };
  addLog("restore_faces 脸部修复 为" + _0x540bd0.restore_faces);
  addLog("enable_hr 高清修复 为" + _0x540bd0.enable_hr);
  if (_0x228f20.sd_cadetailer == "true") {
    addLog("adetailer_face 为开启");
    _0x540bd0 = deepMerge(_0x540bd0, {
      alwayson_scripts: {
        ADetailer: {
          args: [true, true, {
            ad_model: "face_yolov8n.pt"
          }]
        }
      }
    });
  }
  const _0x2c3e61 = "\n---\n### 生图参数报告\n- **正面提示 (Prompt):** " + _0x19c47f + "\n- **负面提示 (Negative Prompt):** " + _0x3b362d + "\n- **采样方法 (Sampler):** " + _0x540bd0.sampler_name + "\n- **步数 (Steps):** " + _0x540bd0.steps + "\n- **CFG Scale:** " + _0x540bd0.cfg_scale + "\n- **尺寸 (Size):** " + _0x540bd0.width + "x" + _0x540bd0.height + "\n- **种子 (Seed):** " + (_0x540bd0.seed === -1 ? "随机(-1)" : _0x540bd0.seed) + "\n- **模型 (Model):** " + _0x228f20.sd_cchatu_8_model + "\n- **VAE:** " + _0x540bd0.override_settings.sd_vae + "\n- **Clip Skip:** " + _0x540bd0.override_settings.CLIP_stop_at_last_layers + "\n- **高清修复 (Hires Fix):** " + _0x540bd0.enable_hr + "\n- **放大倍率 (Upscale Factor):** " + _0x540bd0.hr_scale + "\n- **重绘幅度 (Denoising Strength):** " + _0x540bd0.denoising_strength + "\n- **脸部修复 (Restore Faces):** " + _0x540bd0.restore_faces + "\n- **ADetailer:** " + (_0x228f20.sd_cadetailer == "true") + "\n---\n    ";
  addLog(_0x2c3e61);
  addLog("sdwebui生图参数为" + JSON.stringify(_0x540bd0));
  console.log("payload", _0x540bd0);
  while (!window.xiancheng) {
    await sleep(1000);
  }
  ;
  try {
    window.xiancheng = false;
    taskQueue.updateStatus(_0xd93f05, "running");
    if (_0x228f20.client === "jiuguan") {
      if (!taskQueue.isTaskInQueue(_0xd93f05)) {
        addLog("任务已被用户取消。");
        eventSource.emit("sd_stop_generation");
        throw new Error("任务已取消");
      }
      _0x540bd0.url = _0x3eed5f;
      console.log("payst_chatu8_sd_authload", _0x228f20.st_chatu8_sd_auth);
      _0x540bd0.auth = _0x228f20.st_chatu8_sd_auth ? _0x228f20.st_chatu8_sd_auth : "";
      const _0x439b07 = await fetch("/api/sd/generate", {
        method: "POST",
        headers: getRequestHeaders(window.token),
        body: JSON.stringify(_0x540bd0)
      });
      if (!_0x439b07.ok) {
        const _0x4892c3 = await _0x439b07.text();
        addLog("酒馆 返回错误。状态码: " + _0x439b07.status + "。响应内容: " + _0x4892c3);
        console.log("响应内容:", _0x4892c3);
        throw new Error("请求失败,状态码: " + _0x439b07.status + ", 详情: " + _0x4892c3);
      }
      const _0x45e4ec = await _0x439b07.text();
      let _0x4920b5 = "";
      try {
        const _0x1c66d0 = JSON.parse(_0x45e4ec);
        _0x4920b5 = _0x1c66d0.images[0];
      } catch (_0x395d94) {
        addLog("JSON 解析失败，尝试作为原始 Base64 数据处理。");
        _0x4920b5 = _0x45e4ec;
      }
      const _0x4cc7ff = "data:image/png;base64," + _0x4920b5;
      addLog("图像已成功获取并格式化为 data URL。");
      setTimeout(() => {
        console.log("xiancheng 为true");
        window.xiancheng = true;
      }, extension_settings[extensionName].imageGenInterval);
      ;
      taskQueue.completeTask(_0xd93f05, true);
      currentTaskId = null;
      if (String(extension_settings[extensionName].convertToJpegStorage) === "true") {
        _0x4cc7ff = await convertImageToJpeg(_0x4cc7ff);
      }
      return {
        image: _0x4cc7ff,
        change: _0x22029c || ""
      };
    } else {
      if (!taskQueue.isTaskInQueue(_0xd93f05)) {
        addLog("任务已被用户取消。");
        throw new Error("任务已取消");
      }
      const _0x5cea16 = new URL(_0x3eed5f + "/sdapi/v1/txt2img");
      window.xiancheng = false;
      const _0x9ccd5e = await fetch(_0x5cea16, {
        method: "POST",
        body: JSON.stringify(_0x540bd0),
        headers: getDirectHeaders("application/json", getsdAuth())
      });
      setTimeout(() => {
        console.log("xiancheng 为true");
        window.xiancheng = true;
      }, extension_settings[extensionName].imageGenInterval);
      ;
      if (!_0x9ccd5e.ok) {
        const _0x34b97e = await _0x9ccd5e.text();
        addLog("SD API 返回错误。状态码: " + _0x9ccd5e.status + "。响应内容: " + _0x34b97e);
        console.log("响应内容:", _0x34b97e);
        throw new Error("请求失败,状态码: " + _0x9ccd5e.status + ", 详情: " + _0x34b97e);
      }
      const _0x31d1cc = await _0x9ccd5e.json();
      if (!_0x31d1cc.images || _0x31d1cc.images.length === 0) {
        throw new Error("API响应中未找到图像数据。");
      }
      const _0x3da077 = _0x31d1cc.images[0];
      const _0x151064 = "data:image/png;base64," + _0x3da077;
      addLog("图像已成功获取并格式化为 data URL。");
      taskQueue.completeTask(_0xd93f05, true);
      currentTaskId = null;
      if (String(extension_settings[extensionName].convertToJpegStorage) === "true") {
        _0x151064 = await convertImageToJpeg(_0x151064);
      }
      return {
        image: _0x151064,
        change: _0x40662a || ""
      };
    }
  } catch (_0x115dab) {
    window.xiancheng = true;
    if (_0x115dab.message === "任务已取消") {} else {
      taskQueue.completeTask(_0xd93f05, false);
    }
    currentTaskId = null;
    addLog("sd请求生图错误: " + _0x115dab.message);
    console.error("Error generating image:", _0x115dab);
    throw _0x115dab;
  }
}
async function sdGenerate(_0x50d701) {
  const {
    id: _0xf4b1fc,
    prompt: _0x2ace83,
    width: _0x52983e,
    height: _0x248327,
    change: _0x1ca8c3
  } = _0x50d701;
  addLog("收到SD生图请求 (ID: " + _0xf4b1fc + ") - Prompt: " + _0x2ace83 + (_0x1ca8c3 ? " - Change: " + _0x1ca8c3 : ""));
  if (_0x1ca8c3 && _0x1ca8c3.includes("{修图}")) {
    bananaGenerate(_0x50d701);
    return;
  }
  if (_0x1ca8c3 && _0x1ca8c3.includes("{视频}")) {
    bananaGenerate(_0x50d701);
    return;
  }
  try {
    const {
      image: _0x63728c,
      change: _0x1fdabc
    } = await generateSDImage({
      prompt: _0x2ace83,
      width: _0x52983e,
      height: _0x248327,
      change: _0x1ca8c3
    });
    if (extension_settings[extensionName].cache != "0") {
      const _0x40d195 = {
        change: _0x1fdabc
      };
      Promise.resolve().then(async () => {
        try {
          await setItemImg(_0x2ace83, _0x63728c, _0x40d195);
          addLog("图像已存入数据库 for prompt: " + _0x2ace83);
        } catch (_0x54c64d) {
          console.error("SD缓存写入失败:", _0x54c64d);
          addLog("SD缓存写入失败: " + _0x54c64d.message);
        }
      });
    } else {
      addLog("缓存设置为不存入数据库");
    }
    const _0x12cedb = {
      id: _0xf4b1fc,
      success: true,
      imageData: _0x63728c,
      prompt: _0x2ace83,
      change: _0x1fdabc
    };
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x12cedb);
    addLog("发送SD生图成功响应 (ID: " + _0xf4b1fc + ")");
  } catch (_0x1269be) {
    const _0x339b44 = "SD生图流程捕获到异常 (ID: " + _0xf4b1fc + "): " + _0x1269be.message;
    addLog("错误: " + _0x339b44);
    console.error("Error generating SD image:", _0x1269be);
    const _0x5a351b = {
      id: _0xf4b1fc,
      success: false,
      error: _0x1269be.message,
      prompt: _0x2ace83
    };
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x5a351b);
    addLog("发送SD生图失败响应 (ID: " + _0xf4b1fc + ")");
  }
}
function initializeSDListener() {
  eventSource.on(EventType.GENERATE_IMAGE_REQUEST, sdGenerate);
  addLog("SD 生图事件监听器已初始化。");
}
export async function replaceWithSd() {
  if (extension_settings[extensionName].mode == "sd") {
    if (!window.initializeSDListener) {
      window.initializeSDListener = true;
      initializeSDListener();
    }
    initializeImageProcessing();
  } else if (window.initializeSDListener) {
    eventSource.removeListener(EventType.GENERATE_IMAGE_REQUEST, sdGenerate);
    window.initializeSDListener = false;
    addLog("SD 生图事件监听器已关闭。");
  }
}