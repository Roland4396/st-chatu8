import { sleep, generateRandomSeed, zhengmian, fumian, getRequestHeaders, prompt_replace, addLog, clearLog, parsePromptStringWithCoordinates, prompt_replace_for_character, stripChineseAnnotations, convertImageToJpeg, deduplicateTags } from "./utils.js";
import { extension_settings } from "../../../../extensions.js";
import { extensionName, EventType } from "./config.js";
import { setItemImg } from "./database.js";
import { saveChatDebounced, saveSettingsDebounced, eventSource } from "../../../../../script.js";
import { initializeImageProcessing } from "./iframe.js";
import { taskQueue, TaskType } from "./taskQueue.js";
import { processCharacterPrompt } from "./characterprompt.js";
import { bananaGenerate } from "./banana.js";
import { processSkippedNodes } from "./settings/worker.js";
function getComfyUIHeaders(_0x167178 = null) {
  const _0x4521da = {};
  if (_0x167178) {
    _0x4521da["Content-Type"] = _0x167178;
  }
  return _0x4521da;
}
async function replacepro(_0x174e95, _0x98e136) {
  console.log("payload222", _0x174e95);
  _0x98e136 = _0x98e136.replaceAll("\"%seed%\"", Number(_0x174e95.seed));
  _0x98e136 = _0x98e136.replaceAll("\"%steps%\"", Number(_0x174e95.steps));
  _0x98e136 = _0x98e136.replaceAll("\"%cfg_scale%\"", Number(_0x174e95.cfg_scale));
  _0x98e136 = _0x98e136.replaceAll("\"%sampler_name%\"", "" + ("\"" + _0x174e95.sampler_name + "\""));
  _0x98e136 = _0x98e136.replaceAll("\"%width%\"", Number(_0x174e95.width));
  _0x98e136 = _0x98e136.replaceAll("\"%height%\"", Number(_0x174e95.height));
  _0x98e136 = _0x98e136.replaceAll("\"%negative_prompt%\"", "" + ("\"" + _0x174e95.negative_prompt + "\""));
  _0x98e136 = _0x98e136.replaceAll("\"%prompt%\"", "" + ("\"" + _0x174e95.prompt.replaceAll("\"", "\\\"") + "\""));
  _0x98e136 = _0x98e136.replaceAll("\"%MODEL_NAME%\"", "\"" + _0x174e95.MODEL_NAME + "\"");
  _0x98e136 = _0x98e136.replaceAll("\"%c_quanzhong%\"", Number(_0x174e95.c_quanzhong));
  _0x98e136 = _0x98e136.replaceAll("\"%c_idquanzhong%\"", Number(_0x174e95.c_idquanzhong));
  _0x98e136 = _0x98e136.replaceAll("\"%c_xijie%\"", Number(_0x174e95.c_xijie));
  _0x98e136 = _0x98e136.replaceAll("\"%c_fenwei%\"", Number(_0x174e95.c_fenwei));
  _0x98e136 = _0x98e136.replaceAll("\"%comfyuicankaotupian%\"", "" + ("\"" + _0x174e95.comfyuicankaotupian + "\""));
  _0x98e136 = _0x98e136.replaceAll("\"%ipa%\"", "" + ("\"" + _0x174e95.ipa + "\""));
  _0x98e136 = _0x98e136.replaceAll("\"%scheduler%\"", "" + ("\"" + _0x174e95.scheduler + "\""));
  _0x98e136 = _0x98e136.replaceAll("\"%vae%\"", "" + ("\"" + _0x174e95.vae + "\""));
  _0x98e136 = _0x98e136.replaceAll("\"%clip%\"", "" + ("\"" + _0x174e95.clip + "\""));
  console.log(_0x98e136);
  if (_0x174e95.inpaint_image) {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_image%\"", "\"" + _0x174e95.inpaint_image + "\"");
  } else {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_image%\"", "\"\"");
  }
  if (_0x174e95.inpaint_mask) {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_mask%\"", "\"" + _0x174e95.inpaint_mask + "\"");
  } else {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_mask%\"", "\"\"");
  }
  _0x98e136 = _0x98e136.replaceAll("\"%inpaint_denoise%\"", Number(_0x174e95.inpaint_denoise || 0.75));
  if (_0x174e95.inpaint_positive) {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_positive%\"", "\"" + _0x174e95.inpaint_positive.replaceAll("\"", "\\\"") + "\"");
  } else {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_positive%\"", "\"\"");
  }
  if (_0x174e95.inpaint_negative) {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_negative%\"", "\"" + _0x174e95.inpaint_negative.replaceAll("\"", "\\\"") + "\"");
  } else {
    _0x98e136 = _0x98e136.replaceAll("\"%inpaint_negative%\"", "\"\"");
  }
  return _0x98e136;
}
let currentTaskId = null;
export async function generateComfyUIImage({
  prompt: _0xa7ced5,
  width: _0x3d3fa5,
  height: _0x3a8c12,
  change: _0x376bda
}) {
  clearLog();
  const _0x1c46ff = taskQueue.addTask({
    name: (_0xa7ced5 || "").substring(0, 30) + (_0xa7ced5 && _0xa7ced5.length > 30 ? "..." : ""),
    type: TaskType.COMFYUI,
    prompt: _0xa7ced5
  });
  currentTaskId = _0x1c46ff;
  console.log("link", _0xa7ced5);
  _0xa7ced5 = processCharacterPrompt(_0xa7ced5);
  _0xa7ced5 = await stripChineseAnnotations(_0xa7ced5);
  let _0x34713a = "";
  if (_0x376bda) {
    _0x34713a = _0x376bda.replaceAll("{局部重绘}", "");
  } else {
    _0x34713a = _0xa7ced5;
  }
  _0x376bda = processCharacterPrompt(_0x376bda);
  _0x376bda = await stripChineseAnnotations(_0x376bda);
  addLog("开始 ComfyUI 生图流程。客户端为" + extension_settings[extensionName].client);
  addLog("请求工作流id - " + extension_settings[extensionName].workerid);
  addLog("请求尺寸: 宽度 - " + (_0x3d3fa5 || "默认") + ", 高度 - " + (_0x3a8c12 || "默认"));
  if (extension_settings[extensionName].MODEL_NAME.trim() === "连接后选择") {
    addLog("请填写ComfyUI模型。");
    toastr.error("请填写ComfyUI模型。");
    taskQueue.completeTask(_0x1c46ff, false);
    currentTaskId = null;
    return;
  }
  const _0x550a49 = extension_settings[extensionName].comfyuiUrl.trim();
  const _0x39840f = _0x376bda && _0x376bda.trim() !== "" ? _0x376bda : _0xa7ced5;
  addLog("用于生成的Tag: " + _0x39840f);
  let _0x1a73b6 = false;
  if (_0x39840f.includes("Scene Composition")) {
    _0x1a73b6 = true;
  }
  addLog("是否启用分角色模式 (Divide_roles): " + _0x1a73b6);
  let _0x12e138 = {};
  let _0x21500d = "";
  let _0x29d513 = "";
  if (_0x1a73b6) {
    addLog("分角色模式: 解析带坐标的提示词字符串。");
    _0x12e138 = parsePromptStringWithCoordinates(_0x39840f);
    _0x21500d = _0x12e138["Scene Composition"];
    for (let _0x85aafc = 1; _0x85aafc <= 4; _0x85aafc++) {
      if (_0x12e138["Character " + _0x85aafc + " Prompt"]) {
        _0x29d513 = _0x29d513 + ", " + _0x12e138["Character " + _0x85aafc + " Prompt"];
      }
    }
  } else {
    addLog("标准模式: 使用请求中的 prompt。");
    _0x21500d = deduplicateTags(_0x39840f);
  }
  let {
    modifiedPrompt: _0x46ec13,
    insertions: _0x4d93ef
  } = await prompt_replace(_0x21500d, _0x29d513);
  if (_0x1a73b6) {
    for (let _0x1a64ec = 1; _0x1a64ec <= 4; _0x1a64ec++) {
      if (_0x12e138["Character " + _0x1a64ec + " Prompt"]) {
        _0x46ec13 = _0x46ec13 + " | " + prompt_replace_for_character(_0x12e138["Character " + _0x1a64ec + " Prompt"]);
      }
    }
  }
  let _0x45a7eb = await zhengmian(extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_comfyui].fixedPrompt, _0x46ec13, extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_comfyui].fixedPrompt_end, extension_settings[extensionName].AQT_comfyui, _0x4d93ef);
  _0x45a7eb = _0x2fde38(_0x45a7eb);
  function _0x2fde38(_0x21f537, _0x10388d = false) {
    const _0x4ea79a = /<lora:([^:]+)(?:\.safetensors)?:([^>]+)(?::1)?>/g;
    return _0x21f537.replace(_0x4ea79a, (_0x3441f9, _0x222f6e, _0xe409e0) => {
      if (_0xe409e0.includes(":")) {
        return "<lora:" + _0x222f6e + ":" + _0xe409e0 + ">";
      }
      if (_0x10388d) {
        return "<lora:" + _0x222f6e + ":" + _0xe409e0 + ":1>";
      }
      return "<lora:" + _0x222f6e + ":" + _0xe409e0 + ">";
    });
  }
  if (extension_settings[extensionName].worker.includes("WeiLin")) {
    _0x45a7eb = _0x2fde38(_0x45a7eb, true);
    _0x45a7eb = _0x45a7eb.replace(/<lora:([^:>]+)(\.safetensors)?:([^>]+)>/g, (_0x1bf8f7, _0x5631d0, _0x458da2, _0x4d3e05) => {
      if (!_0x45a7eb.includes(".safetensors")) {
        return "<lora:" + _0x5631d0 + ".safetensors:" + _0x4d3e05 + ">";
      }
      return _0x1bf8f7;
    });
  }
  if (extension_settings[extensionName].worker.includes("WeiLinPromptUI")) {
    _0x45a7eb = _0x2fde38(_0x45a7eb, true);
    _0x45a7eb = _0x45a7eb.replaceAll("<lora:", "<wlr:");
    _0x45a7eb = _0x45a7eb.replaceAll(".safetensors", "");
  }
  console.log("prompt", _0x45a7eb);
  addLog("正面提示词: " + _0x45a7eb);
  let _0x26d9fa = await fumian(extension_settings[extensionName].yushe[extension_settings[extensionName].yusheid_comfyui].negativePrompt, extension_settings[extensionName].UCP_comfyui);
  if (!_0x1a73b6 && window.collectedCharacterNegatives) {
    const _0x14cdec = window.collectedCharacterNegatives.trim();
    if (_0x14cdec) {
      _0x26d9fa = _0x26d9fa ? _0x26d9fa + ", " + _0x14cdec : _0x14cdec;
      addLog("[角色负面] 添加角色负面提示词: " + _0x14cdec);
      console.log("[ComfyUI] 合并角色负面提示词:", _0x14cdec);
    }
  }
  if (extension_settings[extensionName].worker.includes("WeiLinPromptUI")) {
    _0x26d9fa = _0x2fde38(_0x26d9fa, true);
    _0x26d9fa = _0x26d9fa.replaceAll("<lora:", "<wlr:");
  } else {
    _0x26d9fa = _0x2fde38(_0x26d9fa);
  }
  addLog("负面提示词: " + _0x26d9fa);
  _0x45a7eb = _0x45a7eb.replaceAll("\n", ",").replace(/,{2,}/g, ",").replaceAll("\\\\", "\\").replaceAll("\\", "\\\\");
  _0x26d9fa = _0x26d9fa.replaceAll("\n", ",").replace(/,{2,}/g, ",").replaceAll("\\\\", "\\").replaceAll("\\", "\\\\");
  let _0x282034 = {
    prompt: _0x45a7eb,
    negative_prompt: _0x26d9fa,
    steps: extension_settings[extensionName].comfyui_steps,
    sampler_name: extension_settings[extensionName].comfyuisamplerName,
    width: _0x3d3fa5 ? _0x3d3fa5 : extension_settings[extensionName].comfyui_width,
    height: _0x3a8c12 ? _0x3a8c12 : extension_settings[extensionName].comfyui_height,
    cfg_scale: extension_settings[extensionName].cfg_comfyui,
    seed: extension_settings[extensionName].comfyui_seed === 0 || extension_settings[extensionName].comfyui_seed === "0" || extension_settings[extensionName].comfyui_seed === "" || extension_settings[extensionName].comfyui_seed === -1 || extension_settings[extensionName].comfyui_seed === "-1" ? generateRandomSeed() : extension_settings[extensionName].comfyui_seed,
    MODEL_NAME: extension_settings[extensionName].MODEL_NAME,
    c_quanzhong: extension_settings[extensionName].c_quanzhong,
    c_idquanzhong: extension_settings[extensionName].c_idquanzhong,
    c_xijie: extension_settings[extensionName].c_xijie,
    c_fenwei: extension_settings[extensionName].c_fenwei,
    comfyuicankaotupian: window.comfyuicankaotupian,
    ipa: extension_settings[extensionName].ipa,
    scheduler: extension_settings[extensionName].comfyui_scheduler,
    vae: extension_settings[extensionName].comfyui_vae,
    clip: extension_settings[extensionName].comfyuiCLIPName,
    inpaint_image: window.comfyuiInpaintImage || null,
    inpaint_mask: window.comfyuiInpaintMask || null,
    inpaint_denoise: extension_settings[extensionName].inpaint_denoise || "0.75",
    inpaint_positive: window.comfyuiInpaintPositivePrompt || "",
    inpaint_negative: window.comfyuiInpaintNegativePrompt || ""
  };
  const _0x98a9b1 = "\n--- 生图参数报告 ---\n正面提示词: " + _0x282034.prompt + "\n负面提示词: " + _0x282034.negative_prompt + "\n模型: " + _0x282034.MODEL_NAME + "\n采样器: " + _0x282034.sampler_name + "\n步数: " + _0x282034.steps + "\nCFG Scale: " + _0x282034.cfg_scale + "\n种子: " + _0x282034.seed + "\n尺寸: " + _0x282034.width + "x" + _0x282034.height + "\nVAE: " + _0x282034.vae + "\nScheduler: " + _0x282034.scheduler + "\n--------------------\n";
  addLog(_0x98a9b1);
  const _0x3ecc3e = "533ef3a3-39c0-4e39-9ced-37d290f371f8";
  let _0x587beb = extension_settings[extensionName].worker;
  if (_0x376bda.includes("{局部重绘}")) {
    _0x587beb = extension_settings[extensionName].editWorker;
  }
  try {
    const _0x4f05be = JSON.parse(_0x587beb);
    const _0x448b40 = Object.values(_0x4f05be).filter(_0x18d5f8 => _0x18d5f8 && _0x18d5f8._skip).length;
    if (_0x448b40 > 0) {
      addLog("检测到 " + _0x448b40 + " 个跳过的节点，正在处理连接重映射...");
      const _0x5add11 = extension_settings[extensionName]?.comfyuiCache?.objectInfo || {};
      const _0x25140c = processSkippedNodes(_0x4f05be, _0x5add11);
      _0x587beb = JSON.stringify(_0x25140c);
      addLog("跳过节点处理完成，已重映射连接" + (Object.keys(_0x5add11).length > 0 ? "（含类型匹配）" : ""));
    }
  } catch (_0x171cc4) {
    addLog("工作流解析失败，跳过节点处理: " + _0x171cc4.message);
  }
  _0x282034 = await replacepro(_0x282034, _0x587beb);
  _0x282034 = "{\"client_id\":\"" + _0x3ecc3e + "\", \"prompt\":" + _0x282034 + "}";
  addLog("发送到 ComfyUI 的最终 payload: " + _0x282034);
  while (!window.xiancheng) {
    await sleep(1000);
  }
  try {
    window.xiancheng = false;
    taskQueue.updateStatus(_0x1c46ff, "running");
    let _0x255076;
    if (extension_settings[extensionName].client === "jiuguan") {
      const _0x67caac = {
        url: _0x550a49,
        prompt: _0x282034
      };
      const _0x450078 = await fetch("/api/sd/comfy/generate", {
        method: "POST",
        body: JSON.stringify(_0x67caac),
        headers: getRequestHeaders(window.token)
      });
      if (!_0x450078.ok) {
        const _0x33c162 = await _0x450078.text();
        addLog("API 请求失败 (jiuguan client): " + _0x33c162);
        taskQueue.completeTask(_0x1c46ff, false);
        throw new Error("请求失败,状态码: " + _0x450078.status + ", 详情: " + _0x33c162);
      }
      const _0x394411 = await _0x450078.text();
      let _0x502667;
      let _0x2f34d4;
      try {
        const _0xeffa7a = JSON.parse(_0x394411);
        _0x502667 = _0xeffa7a.format;
        _0x2f34d4 = _0xeffa7a.data;
      } catch (_0x4013ba) {
        addLog("JSON 解析失败，尝试作为原始 Base64 数据处理。");
        _0x502667 = "png";
        _0x2f34d4 = _0x394411;
      }
      if (!_0x2f34d4) {
        addLog("API 响应中没有图片数据 (jiuguan client)。");
        taskQueue.completeTask(_0x1c46ff, false);
        throw new Error("Endpoint did not return image data.");
      }
      const _0x169bd3 = ["mp4", "webm", "gif", "avi", "mov"];
      const _0x3943a5 = _0x169bd3.some(_0x39311c => _0x502667 && _0x502667.toLowerCase().includes(_0x39311c));
      const _0x345908 = _0x3943a5 ? "视频" : "图片";
      addLog(_0x345908 + "生成成功 (jiuguan client)。");
      const _0x1eadc8 = _0x3943a5 ? "video" : "image";
      let _0x10a358 = _0x502667;
      if (_0x3943a5) {
        if (_0x502667.includes("mp4") || _0x502667.includes("h264")) {
          _0x10a358 = "mp4";
        } else if (_0x502667.includes("webm")) {
          _0x10a358 = "webm";
        } else if (_0x502667.includes("gif")) {
          _0x10a358 = "gif";
        }
      }
      _0x255076 = "data:" + _0x1eadc8 + "/" + _0x10a358 + ";base64," + _0x2f34d4;
      setTimeout(() => {
        console.log("xiancheng 为true");
        window.xiancheng = true;
      }, extension_settings[extensionName].imageGenInterval);
      ;
      taskQueue.completeTask(_0x1c46ff, true);
      currentTaskId = null;
      console.log("format", _0x502667, "isVideo", _0x3943a5);
      if (String(extension_settings[extensionName].convertToJpegStorage) === "true" && !_0x3943a5) {
        _0x255076 = await convertImageToJpeg(_0x255076);
      }
      let _0x2336c4 = _0x502667;
      if (_0x3943a5) {
        _0x2336c4 = "video/" + _0x10a358;
      }
      const _0x1225f7 = {
        image: _0x255076,
        change: _0x34713a || "",
        isVideo: _0x3943a5,
        format: _0x2336c4
      };
      return _0x1225f7;
    } else {
      const _0x3e8280 = new URL(_0x550a49 + "/prompt");
      const _0x689476 = await fetch(_0x3e8280, {
        method: "POST",
        body: _0x282034,
        headers: getComfyUIHeaders("application/json")
      });
      if (!_0x689476.ok) {
        const _0x4d12b2 = await _0x689476.text();
        addLog("API 请求失败 (direct comfyui): " + _0x4d12b2);
        throw new Error("请求失败,状态码: " + _0x689476.status + ", 详情: " + _0x4d12b2);
      }
      const _0x1d0370 = await _0x689476.json();
      let _0x14c826 = _0x1d0370.prompt_id;
      let _0x13455d = 0;
      while (true) {
        try {
          if (!taskQueue.isTaskInQueue(_0x1c46ff)) {
            addLog("任务已被用户取消，正在中断 ComfyUI...");
            try {
              await fetch(_0x550a49 + "/api/interrupt", {
                method: "POST",
                headers: getComfyUIHeaders()
              });
            } catch (_0xd70700) {
              console.warn("[ComfyUI] 中断请求失败:", _0xd70700);
            }
            throw new Error("任务已取消");
          }
          const _0x471e3d = await fetch(_0x550a49 + "/history/" + _0x14c826, {
            headers: getComfyUIHeaders()
          });
          if (!_0x471e3d.ok) {
            addLog("轮询历史记录时出错: " + _0x471e3d.status);
            throw new Error("History request failed: " + _0x471e3d.status);
          }
          let _0x15695d = await _0x471e3d.json();
          console.log("response2", _0x15695d);
          if (_0x15695d.hasOwnProperty(_0x14c826)) {
            const _0x1af64f = _0x15695d[_0x14c826];
            if (_0x1af64f.status && _0x1af64f.status.status_str === "error") {
              const _0x50a7aa = _0x1af64f.status;
              addLog("❌ ComfyUI 执行失败 - 状态: " + _0x50a7aa.status_str);
              if (_0x50a7aa.messages && _0x50a7aa.messages.length > 0) {
                _0x50a7aa.messages.forEach((_0x10b13d, _0x1d3b34) => {
                  addLog("消息 " + (_0x1d3b34 + 1) + ": " + JSON.stringify(_0x10b13d));
                });
              }
              let _0x183d6a = "ComfyUI 执行错误";
              if (_0x50a7aa.exception_message) {
                _0x183d6a = _0x50a7aa.exception_message;
                addLog("异常信息: " + _0x50a7aa.exception_message);
              }
              if (_0x50a7aa.exception_type) {
                addLog("异常类型: " + _0x50a7aa.exception_type);
              }
              throw new Error(_0x183d6a);
            }
          }
          if (_0x15695d.hasOwnProperty(_0x14c826)) {
            function _0xed2f7(_0x2821cf) {
              for (const _0x5433f0 in _0x2821cf) {
                const _0x27e473 = _0x2821cf[_0x5433f0];
                if (_0x27e473.images && _0x27e473.images.length > 0) {
                  const _0x242a0e = _0x27e473.images.find(_0x3fcaeb => _0x3fcaeb.type === "output");
                  if (_0x242a0e) {
                    const _0x33ed37 = {
                      filename: _0x242a0e.filename,
                      subfolder: _0x242a0e.subfolder || "",
                      isVideo: false,
                      format: "image"
                    };
                    return _0x33ed37;
                  }
                  continue;
                }
                if (_0x27e473.gifs && _0x27e473.gifs.length > 0) {
                  const _0x2d5866 = _0x27e473.gifs[0];
                  const _0x42487b = _0x2d5866.format && _0x2d5866.format.startsWith("video/");
                  const _0x544703 = {
                    filename: _0x2d5866.filename,
                    subfolder: _0x2d5866.subfolder || "",
                    isVideo: _0x42487b,
                    format: _0x2d5866.format || "image/gif"
                  };
                  return _0x544703;
                }
              }
              return null;
            }
            let _0x2d825f = _0xed2f7(_0x15695d[_0x14c826].outputs);
            if (!_0x2d825f) {
              throw new Error("未能从API响应中找到文件名。");
            }
            window._lastMediaInfo = _0x2d825f;
            const _0x337dc0 = _0x2d825f.isVideo ? "视频" : "图片";
            addLog(_0x337dc0 + "生成成功 (direct comfyui)。");
            let _0x33393d = _0x550a49 + "/view?filename=" + _0x2d825f.filename + "&subfolder=" + encodeURIComponent(_0x2d825f.subfolder) + "&type=output";
            const _0x2dd855 = await fetch(_0x33393d, {
              headers: getComfyUIHeaders()
            });
            if (!_0x2dd855.ok) {
              throw new Error("获取图片失败,状态码: " + _0x2dd855.status);
            }
            let _0x4c01b3 = await _0x2dd855.blob();
            if (_0x2d825f.isVideo) {
              let _0x54aed4 = "video/mp4";
              if (_0x2d825f.format) {
                if (_0x2d825f.format.includes("webm")) {
                  _0x54aed4 = "video/webm";
                } else if (_0x2d825f.format.includes("mp4") || _0x2d825f.format.includes("h264")) {
                  _0x54aed4 = "video/mp4";
                }
              }
              const _0x4e99d5 = await _0x4c01b3.arrayBuffer();
              const _0x37ae93 = {
                type: _0x54aed4
              };
              _0x4c01b3 = new Blob([_0x4e99d5], _0x37ae93);
              console.log("[ComfyUI] 视频 MIME 类型修正: " + _0x2d825f.format + " -> " + _0x54aed4);
              window._lastMediaInfo.format = _0x54aed4;
            }
            _0x255076 = await new Promise((_0x1449a9, _0x4f1a6f) => {
              const _0x43ea7f = new FileReader();
              _0x43ea7f.onloadend = () => _0x1449a9(_0x43ea7f.result);
              _0x43ea7f.onerror = _0x4f1a6f;
              _0x43ea7f.readAsDataURL(_0x4c01b3);
            });
            if (String(extension_settings[extensionName].convertToJpegStorage) === "true") {
              if (!_0x2d825f.isVideo) {
                _0x255076 = await convertImageToJpeg(_0x255076);
              }
            }
            break;
          }
          await sleep(1000);
          _0x13455d++;
          if (_0x13455d > 1000) {
            addLog("轮询超时（1000次），服务器可能已断开连接。");
            throw new Error("ComfyUI 服务器超时。");
          }
        } catch (_0x320eb3) {
          addLog("轮询时发生异常: " + _0x320eb3);
          throw _0x320eb3;
        }
      }
      setTimeout(() => {
        console.log("xiancheng 为true");
        window.xiancheng = true;
      }, extension_settings[extensionName].imageGenInterval);
      ;
      if (!_0x255076) {
        throw new Error("未能生成图片 URL。");
      }
      const _0x2a110d = window._lastMediaInfo?.isVideo || false;
      const _0x31cf29 = window._lastMediaInfo?.format || "image";
      addLog("媒体 (" + (_0x2a110d ? "视频" : "图片") + ") 已成功获取并格式化为 data URL。");
      taskQueue.completeTask(_0x1c46ff, true);
      currentTaskId = null;
      return {
        image: _0x255076,
        change: _0x34713a || "",
        isVideo: _0x2a110d,
        format: _0x31cf29
      };
    }
  } catch (_0xd74525) {
    window.xiancheng = true;
    if (_0xd74525.message === "任务已取消") {} else {
      taskQueue.completeTask(_0x1c46ff, false);
    }
    currentTaskId = null;
    addLog("图片生成过程中发生错误: " + _0xd74525.message);
    console.error("Error generating image:", _0xd74525);
    throw _0xd74525;
  }
}
async function comfyuigenerate(_0x435325) {
  let {
    id: _0x23dfa6,
    prompt: _0x32ff5a,
    width: _0x4b1d5c,
    height: _0x4c534c,
    change: _0x53fb7b
  } = _0x435325;
  addLog("收到生图请求 (ID: " + _0x23dfa6 + ") - Prompt: " + _0x32ff5a + (_0x53fb7b ? " - Change: " + _0x53fb7b : ""));
  if (_0x53fb7b && _0x53fb7b.includes("{修图}")) {
    bananaGenerate(_0x435325);
    return;
  }
  if (_0x53fb7b && _0x53fb7b.includes("{视频}")) {
    bananaGenerate(_0x435325);
    return;
  }
  try {
    const {
      image: _0x47ba07,
      change: _0x537168,
      isVideo: _0x1902ed,
      format: _0x472173
    } = await generateComfyUIImage({
      prompt: _0x32ff5a,
      width: _0x4b1d5c,
      height: _0x4c534c,
      change: _0x53fb7b
    });
    if (extension_settings[extensionName].cache != "0") {
      const _0x1ff322 = {
        change: _0x537168,
        isVideo: _0x1902ed,
        format: _0x472173
      };
      Promise.resolve().then(async () => {
        try {
          await setItemImg(_0x32ff5a, _0x47ba07, _0x1ff322);
          addLog((_0x1902ed ? "视频" : "图像") + "已存入数据库 for prompt: " + _0x32ff5a);
        } catch (_0x2b8c6d) {
          console.error("ComfyUI缓存写入失败:", _0x2b8c6d);
          addLog("ComfyUI缓存写入失败: " + _0x2b8c6d.message);
        }
      });
    } else {
      addLog("缓存设置为不存入数据库");
    }
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, {
      id: _0x23dfa6,
      success: true,
      imageData: _0x47ba07,
      prompt: _0x32ff5a,
      change: _0x537168,
      isVideo: _0x1902ed || false,
      format: _0x472173 || "image"
    });
    eventSource.emit("generate-image-response", {
      id: _0x23dfa6,
      success: true,
      imageData: _0x47ba07,
      prompt: _0x32ff5a,
      change: _0x537168,
      isVideo: _0x1902ed || false,
      format: _0x472173 || "image"
    });
    addLog("发送" + (_0x1902ed ? "视频" : "图片") + "生成成功响应 (ID: " + _0x23dfa6 + ")");
  } catch (_0x367951) {
    const _0xf17567 = "生图流程捕获到异常 (ID: " + _0x23dfa6 + "): " + _0x367951.message;
    addLog("错误: " + _0xf17567);
    console.error("Error generating image:", _0x367951);
    const _0x338cf8 = {
      id: _0x23dfa6,
      success: false,
      error: _0x367951.message,
      prompt: _0x32ff5a
    };
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x338cf8);
    const _0x17864a = {
      id: _0x23dfa6,
      success: false,
      error: _0x367951.message,
      prompt: _0x32ff5a
    };
    eventSource.emit("generate-image-response", _0x17864a);
    addLog("发送生图失败响应 (ID: " + _0x23dfa6 + ")");
  }
}
function initializeComfyuiListener() {
  eventSource.on(EventType.GENERATE_IMAGE_REQUEST, comfyuigenerate);
  addLog("comfyui 生图事件监听器已初始化（含旧版兼容）。");
}
export async function replaceWithcomfyui() {
  if (extension_settings[extensionName].mode == "comfyui") {
    if (!window.initializeComfyuiListener) {
      window.initializeComfyuiListener = true;
      initializeComfyuiListener();
    }
    initializeImageProcessing();
  } else if (window.initializeComfyuiListener) {
    eventSource.removeListener(EventType.GENERATE_IMAGE_REQUEST, comfyuigenerate);
    window.initializeComfyuiListener = false;
    addLog("comfyui 生图事件监听器已关闭。");
  }
}