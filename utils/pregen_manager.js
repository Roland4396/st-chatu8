import { extension_settings } from "../../../../extensions.js";
import { extensionName, EventType } from "./config.js";
import { eventSource } from "../../../../../script.js";
import { addLog } from "./utils.js";
import { isGenerating, startGenerating, stopGenerating } from "./generation_status.js";
function generateStableId(_0x13450e) {
  let _0x35e7aa = 0;
  for (let _0x84ae13 = 0; _0x84ae13 < _0x13450e.length; _0x84ae13++) {
    const _0x2619cb = _0x13450e.charCodeAt(_0x84ae13);
    _0x35e7aa = (_0x35e7aa << 5) - _0x35e7aa + _0x2619cb;
    _0x35e7aa |= 0;
  }
  return "chatu8-id-" + Math.abs(_0x35e7aa).toString(36);
}
const pregenQueue = new Map();
let isProcessing = false;
const TaskStatus = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled"
};
async function triggerButtonForTask(_0x6d217c) {
  const {
    prompt: _0x489e5f
  } = _0x6d217c;
  return new Promise((_0x1f0320, _0x553800) => {
    if (isGenerating(_0x489e5f)) {
      addLog("[Pregen] Image generation is already in progress, skipping: " + _0x489e5f);
      _0x6d217c.status = TaskStatus.COMPLETED;
      return _0x1f0320();
    }
    const _0xca8ff0 = generateStableId(_0x489e5f);
    startGenerating(_0x489e5f);
    const _0xf79d49 = _0x25dfb2 => {
      if (_0x25dfb2.id !== _0xca8ff0) {
        return;
      }
      eventSource.removeListener(EventType.GENERATE_IMAGE_RESPONSE, _0xf79d49);
      addLog("[Pregen] Response listener removed for ID: " + _0xca8ff0);
      const {
        success: _0xb79a7b,
        error: _0x36ed3d,
        prompt: _0x38859b
      } = _0x25dfb2;
      if (_0x38859b) {
        stopGenerating(_0x38859b);
      }
      if (_0xb79a7b) {
        addLog("[Pregen] Image generated successfully for: " + _0x38859b);
        _0x6d217c.status = TaskStatus.COMPLETED;
        _0x1f0320();
      } else {
        addLog("[Pregen] Image generation failed for: " + _0x38859b + ". Error: " + _0x36ed3d);
        _0x6d217c.status = TaskStatus.FAILED;
        _0x553800(new Error(_0x36ed3d || "Unknown generation error"));
      }
    };
    eventSource.on(EventType.GENERATE_IMAGE_RESPONSE, _0xf79d49);
    addLog("[Pregen] Response listener created for ID: " + _0xca8ff0);
    const _0x5be9d5 = {
      id: _0xca8ff0,
      prompt: _0x489e5f
    };
    const _0x574339 = _0x5be9d5;
    eventSource.emit(EventType.GENERATE_IMAGE_REQUEST, _0x574339);
    addLog("[Pregen] Emitted image generation request for ID: " + _0xca8ff0);
  });
}
async function processQueue() {
  if (isProcessing) {
    return;
  }
  const _0x31e274 = Array.from(pregenQueue.values()).find(_0x4c199c => _0x4c199c.status === TaskStatus.QUEUED);
  if (!_0x31e274) {
    isProcessing = false;
    return;
  }
  isProcessing = true;
  _0x31e274.status = TaskStatus.PROCESSING;
  addLog("[Pregen] 开始处理任务: " + _0x31e274.prompt);
  try {
    await triggerButtonForTask(_0x31e274);
  } catch (_0x4304df) {
    console.error("[Pregen] 处理任务失败 " + _0x31e274.prompt + ":", _0x4304df);
    _0x31e274.status = TaskStatus.FAILED;
  } finally {
    isProcessing = false;
    setTimeout(processQueue, 100);
  }
}
function add(_0x1c448c) {
  if (!Array.isArray(_0x1c448c)) {
    return;
  }
  let _0x114938 = false;
  _0x1c448c.forEach(_0x21dad0 => {
    if (!pregenQueue.has(_0x21dad0)) {
      pregenQueue.set(_0x21dad0, {
        prompt: _0x21dad0,
        status: TaskStatus.QUEUED
      });
      _0x114938 = true;
      addLog("[Pregen] 添加到队列: " + _0x21dad0);
    }
  });
  if (_0x114938) {
    processQueue();
  }
}
function clear() {
  pregenQueue.clear();
  isProcessing = false;
  addLog("[Pregen] 队列已清空。");
}
const _0x96fee7 = {
  add: add,
  clear: clear
};
export const pregenManager = _0x96fee7;