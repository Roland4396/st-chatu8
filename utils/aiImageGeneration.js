import { EventType } from "./config.js";
import { eventSource } from "../../../../../script.js";
const imageGenerationQueue = new Map();
let imageGenerationIdCounter = 0;
export async function requestImageGeneration(_0x54c8a7, _0x237fc4 = "", _0x1d37fa = {}) {
  const _0x1fe94a = {
    prompt: _0x54c8a7,
    negative_prompt: _0x237fc4,
    options: _0x1d37fa
  };
  console.log("[AI Image Generation] 收到生图请求:", _0x1fe94a);
  const _0x4c85a1 = "ai_gen_" + ++imageGenerationIdCounter + "_" + Date.now();
  imageGenerationQueue.set(_0x4c85a1, {
    id: _0x4c85a1,
    prompt: _0x54c8a7,
    negative_prompt: _0x237fc4,
    options: _0x1d37fa,
    status: "pending",
    timestamp: Date.now(),
    imageUrl: null,
    error: null
  });
  const _0x1d3ff2 = new Promise((_0x4f065f, _0x45cfe0) => {
    const _0x2d7a9b = setTimeout(() => {
      eventSource.removeListener(EventType.GENERATE_IMAGE_RESPONSE, _0x3fc6da);
      imageGenerationQueue.delete(_0x4c85a1);
      _0x45cfe0(new Error("生图请求超时（5分钟）"));
    }, 300000);
    const _0x3fc6da = _0x18ede6 => {
      if (_0x18ede6.id !== _0x4c85a1) {
        return;
      }
      console.log("[AI Image Generation] 收到响应:", _0x18ede6);
      clearTimeout(_0x2d7a9b);
      eventSource.removeListener(EventType.GENERATE_IMAGE_RESPONSE, _0x3fc6da);
      const _0x51be5e = imageGenerationQueue.get(_0x4c85a1);
      if (!_0x51be5e) {
        console.warn("[AI Image Generation] 未找到生图记录:", _0x4c85a1);
        _0x45cfe0(new Error("未找到生图记录"));
        return;
      }
      if (_0x18ede6.success) {
        _0x51be5e.status = "completed";
        _0x51be5e.imageUrl = _0x18ede6.imageData || _0x18ede6.imageUrl;
        console.log("[AI Image Generation] 生图成功，imageUrl长度:", _0x51be5e.imageUrl?.length);
        const _0x7934f8 = {
          generationId: _0x4c85a1,
          imageUrl: _0x51be5e.imageUrl,
          prompt: _0x54c8a7
        };
        _0x4f065f(_0x7934f8);
      } else {
        _0x51be5e.status = "failed";
        _0x51be5e.error = _0x18ede6.error || "生成失败";
        console.log("[AI Image Generation] 生图失败:", _0x51be5e.error);
        _0x45cfe0(new Error("生图失败: " + _0x51be5e.error));
      }
    };
    eventSource.on(EventType.GENERATE_IMAGE_RESPONSE, _0x3fc6da);
    console.log("[AI Image Generation] 已注册响应监听器:", _0x4c85a1);
  });
  const _0x1c5918 = {
    id: _0x4c85a1,
    prompt: _0x54c8a7,
    width: _0x1d37fa.width || null,
    height: _0x1d37fa.height || null
  };
  const _0x40779e = _0x1c5918;
  if (_0x237fc4) {
    _0x40779e.change = _0x54c8a7 + "###" + _0x237fc4;
  }
  console.log("[AI Image Generation] 发送生图请求:", _0x40779e);
  eventSource.emit(EventType.GENERATE_IMAGE_REQUEST, _0x40779e);
  try {
    const _0x24769c = await _0x1d3ff2;
    return _0x24769c;
  } catch (_0x15435a) {
    imageGenerationQueue.delete(_0x4c85a1);
    throw _0x15435a;
  }
}
export function getImageGenerationStatus(_0x14f720) {
  const _0x369367 = imageGenerationQueue.get(_0x14f720);
  if (!_0x369367) {
    return "未找到生图请求: " + _0x14f720;
  }
  let _0x5c6abe = "生图ID: " + _0x14f720 + "\n";
  _0x5c6abe += "状态: " + _0x369367.status + "\n";
  _0x5c6abe += "提示词: " + _0x369367.prompt + "\n";
  if (_0x369367.status === "completed" && _0x369367.imageUrl) {
    _0x5c6abe += "图片URL: " + _0x369367.imageUrl + "\n";
  } else if (_0x369367.status === "failed" && _0x369367.error) {
    _0x5c6abe += "错误: " + _0x369367.error + "\n";
  }
  return _0x5c6abe;
}