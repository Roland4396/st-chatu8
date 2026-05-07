import { extension_settings } from "../../../../../extensions.js";
import { eventSource } from "../../../../../../script.js";
import { extensionName, eventNames, LLMRequestTypes } from "../config.js";
import { getRequestHeaders, clearLog, addLog } from "../utils.js";
import { startFabLoading, stopFabLoading } from "./fab.js";
import { checkTriggerWords, mergeAdjacentMessages } from "../promptProcessor.js";
import { processRollPlaceholders } from "./rollProcessor.js";
import { taskQueue, TaskType, TaskStatus } from "../taskQueue.js";
let typedLLMRequestController = null;
const defaultLLMChannelControllers = new Map();
const llmTaskControllers = new Map();
eventSource.on("st_chatu8_cancel_llm_task", ({
  taskId: _0x4d78ac
}) => {
  const _0x4b2a7a = llmTaskControllers.get(_0x4d78ac);
  if (_0x4b2a7a) {
    _0x4b2a7a.abort();
    llmTaskControllers.delete(_0x4d78ac);
    console.log("[LLM] 任务已取消: " + _0x4d78ac);
  }
});
export function getLLMRequestController() {
  if (typedLLMRequestController) {
    return typedLLMRequestController;
  }
  for (const _0x4b642b of defaultLLMChannelControllers.values()) {
    if (_0x4b642b) {
      return _0x4b642b;
    }
  }
  return null;
}
export function setLLMRequestController(_0x2cdbb5) {
  typedLLMRequestController = _0x2cdbb5;
}
export function isLLMRequestActive() {
  return !!typedLLMRequestController || !!(defaultLLMChannelControllers.size > 0);
}
export function abortLLMRequest() {
  let _0x5accfb = false;
  if (typedLLMRequestController) {
    typedLLMRequestController.abort();
    _0x5accfb = true;
  }
  for (const [_0x2bc258, _0x86b4db] of defaultLLMChannelControllers) {
    _0x86b4db.abort();
    _0x5accfb = true;
  }
  defaultLLMChannelControllers.clear();
  if (_0x5accfb) {
    toastr.info("LLM 请求已中止。");
  }
}
export function abortLLMChannelRequest(_0x30c46e) {
  const _0x3eaf33 = defaultLLMChannelControllers.get(_0x30c46e);
  if (_0x3eaf33) {
    _0x3eaf33.abort();
    defaultLLMChannelControllers.delete(_0x30c46e);
    return true;
  }
  return false;
}
export function formatPromptForDisplay(_0x1d2b23) {
  if (typeof _0x1d2b23 === "string") {
    return _0x1d2b23;
  }
  if (Array.isArray(_0x1d2b23)) {
    const _0x14e0c2 = [];
    _0x1d2b23.forEach((_0x2b2c19, _0x24a71b) => {
      const _0x398eb3 = _0x2b2c19.role || "unknown";
      const _0x3a42ab = getRoleLabel(_0x398eb3);
      _0x14e0c2.push("" + "═".repeat(50));
      _0x14e0c2.push("【" + _0x3a42ab + "】");
      _0x14e0c2.push("" + "─".repeat(50));
      const _0x1d6b27 = _0x2b2c19.content;
      if (typeof _0x1d6b27 === "string") {
        _0x14e0c2.push(_0x1d6b27);
      } else if (Array.isArray(_0x1d6b27)) {
        _0x1d6b27.forEach(_0x5e7895 => {
          if (_0x5e7895.type === "text") {
            _0x14e0c2.push(_0x5e7895.text || "");
          } else if (_0x5e7895.type === "image_url") {
            const _0x479a0f = _0x5e7895.image_url?.url || "";
            if (_0x479a0f.startsWith("data:")) {
              const _0x258125 = _0x479a0f.match(/^data:([^;]+);/);
              const _0x4d2ec4 = _0x258125 ? _0x258125[1] : "unknown";
              const _0x49d4d4 = _0x479a0f.split(",")[1] || "";
              const _0x23cb36 = Math.round(_0x49d4d4.length * 3 / 4 / 1024);
              _0x14e0c2.push("📷 [用户上传的图片: " + _0x4d2ec4 + ", 约 " + _0x23cb36 + "KB]");
            } else {
              _0x14e0c2.push("📷 [图片链接: " + _0x479a0f + "]");
            }
          }
        });
      }
      _0x14e0c2.push("");
    });
    return _0x14e0c2.join("\n");
  }
  if (typeof _0x1d2b23 === "object" && _0x1d2b23 !== null) {
    return JSON.stringify(_0x1d2b23, null, 2);
  }
  return String(_0x1d2b23);
}
export function getRoleLabel(_0x2d053b) {
  const _0x5788e0 = {
    system: "系统提示词",
    user: "用户",
    assistant: "AI助手",
    function: "函数调用",
    tool: "工具"
  };
  return _0x5788e0[_0x2d053b] || _0x2d053b;
}
export function getCurrentLLMProfile() {
  const _0x291546 = extension_settings[extensionName].llm_profiles || {};
  const _0x4d1d93 = extension_settings[extensionName].current_llm_profile;
  return _0x291546[_0x4d1d93] || _0x291546[Object.keys(_0x291546)[0]] || {};
}
export function getCurrentTestContext() {
  const _0x5408d5 = extension_settings[extensionName].test_context_profiles || {};
  const _0x2a743a = extension_settings[extensionName].current_test_context_profile;
  return _0x5408d5[_0x2a743a] || _0x5408d5[Object.keys(_0x5408d5)[0]] || {};
}
export function getEffectiveConfigForRequestType(_0x1e1229) {
  const _0x261ec7 = extension_settings[extensionName].llm_request_type_configs || {};
  const _0x3d207f = _0x261ec7[_0x1e1229] || {
    api_profile: "默认",
    context_profile: "默认"
  };
  const _0x34c98d = extension_settings[extensionName].llm_profiles || {};
  const _0x43b83d = extension_settings[extensionName].test_context_profiles || {};
  const _0xe36240 = _0x3d207f.api_profile || "默认";
  const _0x5b589a = _0x34c98d[_0xe36240] || _0x34c98d[Object.keys(_0x34c98d)[0]] || {};
  const _0xb2e3d2 = _0x3d207f.context_profile || "默认";
  const _0xc01d04 = _0x43b83d[_0xb2e3d2] || _0x43b83d[Object.keys(_0x43b83d)[0]] || {};
  const _0x3b3505 = {
    api_url: _0x5b589a.api_url || "",
    api_key: _0x5b589a.api_key || "",
    model: _0x5b589a.model || "",
    temperature: _0x5b589a.temperature ?? 0.7,
    top_p: _0x5b589a.top_p ?? 1,
    max_tokens: _0x5b589a.max_tokens ?? 512,
    stream: _0x5b589a.stream ?? false,
    bypass_proxy: _0x5b589a.bypass_proxy ?? false,
    context: _0xc01d04
  };
  return _0x3b3505;
}
export function buildPromptForRequestType(_0x45b4bb, _0x1a4d0a = "") {
  const _0x2eae61 = extension_settings[extensionName].llm_request_type_configs || {};
  const _0xd82eba = _0x2eae61[_0x45b4bb] || {
    context_profile: "默认"
  };
  const _0x5b3721 = _0xd82eba.context_profile || "默认";
  const _0x4865a2 = extension_settings[extensionName].test_context_profiles || {};
  const _0xd32db3 = _0x4865a2[_0x5b3721] || _0x4865a2[Object.keys(_0x4865a2)[0]] || {};
  const _0x427371 = [];
  if (_0xd32db3.entries && Array.isArray(_0xd32db3.entries)) {
    _0xd32db3.entries.forEach(_0x4669b4 => {
      if (!_0x4669b4.enabled) {
        return;
      }
      if (!_0x4669b4.content || _0x4669b4.content.trim() === "") {
        return;
      }
      if (_0x4669b4.triggerMode === "trigger") {
        if (!_0x1a4d0a || !checkTriggerWords(_0x4669b4.triggerWords, _0x1a4d0a)) {
          return;
        }
      }
      const _0x527716 = {
        role: _0x4669b4.role || "user",
        content: _0x4669b4.content
      };
      _0x427371.push(_0x527716);
    });
  } else if (_0xd32db3.history && Array.isArray(_0xd32db3.history)) {
    _0xd32db3.history.forEach(_0x2dec37 => {
      if (_0x2dec37.user && _0x2dec37.user.trim() !== "") {
        const _0x15c19a = {
          role: "user",
          content: _0x2dec37.user
        };
        _0x427371.push(_0x15c19a);
      }
      if (_0x2dec37.assistant && _0x2dec37.assistant.trim() !== "") {
        const _0x11ac96 = {
          role: "assistant",
          content: _0x2dec37.assistant
        };
        _0x427371.push(_0x11ac96);
      }
    });
  }
  const _0x56d6bf = mergeAdjacentMessages(_0x427371);
  const _0x57aef4 = processRollPlaceholders(_0x56d6bf);
  return _0x57aef4;
}
const REQUEST_TYPE_NAMES = {
  image_gen: "正文图片生成",
  char_design: "角色/服装设计",
  char_display: "角色/服装展示",
  char_modify: "角色/服装修改",
  translation: "翻译",
  tag_modify: "Tag修改"
};
export async function executeTypedLLMRequest(_0x13823f, _0xf8175e, _0x38d7c5, _0x9eb0c3 = null) {
  const {
    prompt: _0x374389,
    id: _0x57d7da
  } = _0x13823f;
  if (!_0x57d7da || !_0x374389) {
    return;
  }
  if (typedLLMRequestController) {
    typedLLMRequestController.abort();
    toastr.info("LLM请求已中断，开始新请求。");
  }
  typedLLMRequestController = new AbortController();
  const _0x15ee15 = typedLLMRequestController.signal;
  const _0x6e370f = typedLLMRequestController;
  const _0x430226 = REQUEST_TYPE_NAMES[_0xf8175e] || _0xf8175e;
  const _0x33405c = {
    name: "LLM: " + _0x430226,
    type: TaskType.LLM,
    prompt: _0x57d7da
  };
  const _0x11f764 = taskQueue.addTask(_0x33405c);
  llmTaskControllers.set(_0x11f764, typedLLMRequestController);
  taskQueue.updateStatus(_0x11f764, TaskStatus.RUNNING);
  startFabLoading();
  let _0x281495 = false;
  const _0x33b631 = String(_0x57d7da).startsWith("ai-assistant-") || String(_0x57d7da).length === 13;
  if (!_0x33b631) {
    clearLog();
    addLog("===== LLM 请求开始 (" + _0x430226 + ") =====");
    addLog("请求 ID: " + _0x57d7da);
    addLog("发送的 Prompt:");
    addLog(formatPromptForDisplay(_0x374389));
  }
  const _0x2c07ee = getEffectiveConfigForRequestType(_0xf8175e);
  const {
    api_url: _0x55df0d,
    api_key: _0x1cc6e9,
    model: _0x3a50be,
    temperature: _0x376245,
    top_p: _0x72e499,
    max_tokens: _0x51b3a0,
    stream: _0x5c8834,
    bypass_proxy: _0x28af37
  } = _0x2c07ee;
  if (!_0x55df0d || !_0x1cc6e9 || !_0x3a50be) {
    const _0x1da9e7 = _0x430226 + ": API URL, API Key, 或 Model 未配置。";
    toastr.error(_0x1da9e7);
    const _0x1f6eda = {
      success: false,
      result: _0x1da9e7,
      id: _0x57d7da
    };
    eventSource.emit(_0x38d7c5, _0x1f6eda);
    return;
  }
  const _0x47510b = _0x55df0d.replace(/\/$/, "");
  let _0xb74f47;
  let _0x4bc00b;
  let _0x511a01;
  if (_0x28af37) {
    _0xb74f47 = _0x47510b + "/chat/completions";
    const _0x3ac06e = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + _0x1cc6e9
    };
    _0x4bc00b = _0x3ac06e;
    const _0x4577cf = {
      model: _0x3a50be,
      messages: _0x374389,
      temperature: _0x376245,
      top_p: _0x72e499,
      max_tokens: _0x51b3a0,
      stream: _0x5c8834
    };
    _0x511a01 = _0x4577cf;
  } else {
    let _0x1dfd14 = _0x47510b;
    if (!_0x1dfd14.endsWith("/v1") && !_0x1dfd14.includes("/v1/")) {
      _0x1dfd14 = _0x1dfd14 + "/v1";
    }
    _0x1dfd14 = _0x1dfd14.replace(/\/v1\/$/, "/v1");
    _0xb74f47 = "/api/backends/chat-completions/generate";
    _0x4bc00b = getRequestHeaders(window.token);
    const _0x946501 = {
      chat_completion_source: "custom",
      custom_url: _0x1dfd14,
      custom_include_headers: "Authorization: \"Bearer " + _0x1cc6e9 + "\"",
      model: _0x3a50be,
      messages: _0x374389,
      temperature: _0x376245,
      top_p: _0x72e499,
      max_tokens: _0x51b3a0,
      stream: _0x5c8834
    };
    _0x511a01 = _0x946501;
  }
  if (_0x9eb0c3) {
    _0x9eb0c3("正在处理 " + _0x430226 + " 请求，请稍候...");
  }
  try {
    const _0x3f5bd0 = await fetch(_0xb74f47, {
      method: "POST",
      headers: _0x4bc00b,
      body: JSON.stringify(_0x511a01),
      signal: _0x15ee15
    });
    if (!_0x3f5bd0.ok) {
      try {
        const _0x739c80 = await _0x3f5bd0.json();
        if (_0x739c80.error) {
          let _0x4fce66;
          if (typeof _0x739c80.error === "object" && _0x739c80.error.message) {
            _0x4fce66 = "" + _0x739c80.error.message;
            const _0x59ddad = [];
            if (_0x739c80.error.type) {
              _0x59ddad.push("类型: " + _0x739c80.error.type);
            }
            if (_0x739c80.error.code) {
              _0x59ddad.push("代码: " + _0x739c80.error.code);
            }
            if (_0x59ddad.length > 0) {
              _0x4fce66 += " (" + _0x59ddad.join(", ") + ")";
            }
          } else {
            _0x4fce66 = "" + JSON.stringify(_0x739c80.error);
          }
          throw new Error(_0x4fce66);
        }
      } catch (_0xacbda3) {
        if (_0xacbda3.message.includes("类型:") || _0xacbda3.message.includes("代码:")) {
          throw _0xacbda3;
        }
      }
      throw new Error("请求失败: " + _0x3f5bd0.status + " " + _0x3f5bd0.statusText);
    }
    let _0x5bf42d = "";
    if (_0x5c8834) {
      const _0x5ea77e = _0x3f5bd0.body.getReader();
      const _0x152d3c = new TextDecoder("utf-8");
      let _0x545be7 = "";
      while (true) {
        const {
          done: _0x3fb7b1,
          value: _0x16bd58
        } = await _0x5ea77e.read();
        if (_0x3fb7b1) {
          break;
        }
        _0x545be7 += _0x152d3c.decode(_0x16bd58, {
          stream: true
        });
        const _0x852406 = _0x545be7.split("\n");
        _0x545be7 = _0x852406.pop() || "";
        for (const _0x596846 of _0x852406) {
          const _0x15183a = _0x596846.trim();
          if (!_0x15183a || _0x15183a === "data: [DONE]") {
            continue;
          }
          if (_0x15183a.startsWith("data: ")) {
            try {
              const _0x12ee07 = _0x15183a.slice(6);
              const _0x3b1371 = JSON.parse(_0x12ee07);
              const _0x4c7f78 = _0x3b1371.choices?.[0]?.delta?.content;
              if (_0x4c7f78) {
                _0x5bf42d += _0x4c7f78;
                if (_0x9eb0c3) {
                  _0x9eb0c3(_0x5bf42d);
                }
              }
            } catch (_0x494911) {
              console.warn("流式解析警告:", _0x494911.message);
            }
          }
        }
      }
      if (_0x545be7.trim() && _0x545be7.trim() !== "data: [DONE]" && _0x545be7.trim().startsWith("data: ")) {
        try {
          const _0xf1777a = _0x545be7.trim().slice(6);
          const _0x4a1f84 = JSON.parse(_0xf1777a);
          const _0x43d0f9 = _0x4a1f84.choices?.[0]?.delta?.content;
          if (_0x43d0f9) {
            _0x5bf42d += _0x43d0f9;
            if (_0x9eb0c3) {
              _0x9eb0c3(_0x5bf42d);
            }
          }
        } catch (_0x35586c) {
          console.warn("流式解析警告 (最后buffer):", _0x35586c.message);
        }
      }
      if (!_0x5bf42d) {
        _0x5bf42d = "未收到有效回复。";
        toastr.warning(_0x430226 + ": LLM 请求返回为空，可能是请求被截断、max_tokens 设置过小、或 API 连接问题。");
      }
    } else {
      const _0x34b077 = await _0x3f5bd0.json();
      if (_0x34b077.error) {
        let _0x227089;
        if (typeof _0x34b077.error === "object" && _0x34b077.error.message) {
          _0x227089 = "" + _0x34b077.error.message;
          const _0x145a89 = [];
          if (_0x34b077.error.type) {
            _0x145a89.push("类型: " + _0x34b077.error.type);
          }
          if (_0x34b077.error.code) {
            _0x145a89.push("代码: " + _0x34b077.error.code);
          }
          if (_0x145a89.length > 0) {
            _0x227089 += " (" + _0x145a89.join(", ") + ")";
          }
        } else {
          _0x227089 = "" + JSON.stringify(_0x34b077.error);
        }
        throw new Error(_0x227089);
      }
      _0x5bf42d = _0x34b077.choices?.[0]?.message?.content || "";
      if (!_0x5bf42d) {
        _0x5bf42d = "未收到有效回复。";
        toastr.warning(_0x430226 + ": LLM 请求返回为空，可能是请求被截断、max_tokens 设置过小、或 API 连接问题。");
      }
      if (_0x9eb0c3) {
        _0x9eb0c3(_0x5bf42d);
      }
    }
    if (!_0x33b631) {
      addLog("\n----- LLM 回复 -----");
      addLog(_0x5bf42d);
      addLog("===== LLM 请求完成 =====");
    }
    taskQueue.completeTask(_0x11f764, true);
    llmTaskControllers.delete(_0x11f764);
    const _0x13898f = {
      success: true,
      result: _0x5bf42d,
      id: _0x57d7da,
      testMode: false
    };
    eventSource.emit(_0x38d7c5, _0x13898f);
  } catch (_0x40ef3f) {
    if (_0x40ef3f.name === "AbortError") {
      _0x281495 = true;
      taskQueue.updateStatus(_0x11f764, TaskStatus.CANCELLED);
      llmTaskControllers.delete(_0x11f764);
      const _0x1ed8e7 = {
        success: false,
        result: null,
        id: _0x57d7da,
        error: {
          name: "AbortError",
          message: "Request aborted"
        }
      };
      eventSource.emit(_0x38d7c5, _0x1ed8e7);
      return;
    }
    console.error(_0x430226 + " Error:", _0x40ef3f);
    const _0x3e3148 = "请求错误: " + _0x40ef3f.message;
    if (_0x9eb0c3) {
      _0x9eb0c3(_0x3e3148);
    }
    toastr.error(_0x40ef3f.message);
    taskQueue.completeTask(_0x11f764, false);
    llmTaskControllers.delete(_0x11f764);
    const _0x1de19f = {
      success: false,
      result: _0x3e3148,
      id: _0x57d7da
    };
    eventSource.emit(_0x38d7c5, _0x1de19f);
  } finally {
    if (typedLLMRequestController === _0x6e370f) {
      typedLLMRequestController = null;
    }
    if (!_0x281495 || typedLLMRequestController === null) {
      stopFabLoading();
    }
  }
}
export async function executeDefaultLLMRequest(_0x4de1f6, _0x50a74d, _0x2e0af5 = null, _0x32b586 = "default") {
  const {
    prompt: _0x109ef6,
    id: _0x3bfe1e
  } = _0x4de1f6;
  if (!_0x3bfe1e || !_0x109ef6) {
    return;
  }
  const _0x4cad86 = defaultLLMChannelControllers.get(_0x32b586);
  if (_0x4cad86) {
    _0x4cad86.abort();
    toastr.info("LLM请求已中断，开始新请求。");
  }
  const _0x2da4ce = new AbortController();
  defaultLLMChannelControllers.set(_0x32b586, _0x2da4ce);
  const _0x42bcf7 = _0x2da4ce.signal;
  const _0x317f3f = _0x2da4ce;
  const _0x334ce9 = {
    name: "LLM: 外部请求",
    type: TaskType.LLM,
    prompt: _0x3bfe1e
  };
  const _0x2a43a5 = taskQueue.addTask(_0x334ce9);
  llmTaskControllers.set(_0x2a43a5, _0x2da4ce);
  taskQueue.updateStatus(_0x2a43a5, TaskStatus.RUNNING);
  startFabLoading();
  let _0x3b3e08 = false;
  const _0x48c003 = String(_0x3bfe1e).startsWith("ai-assistant-") || String(_0x3bfe1e).length === 13;
  if (!_0x48c003) {
    clearLog();
    addLog("===== LLM 默认请求开始 =====");
    addLog("请求 ID: " + _0x3bfe1e);
    addLog("发送的 Prompt:");
    addLog(formatPromptForDisplay(_0x109ef6));
  }
  const {
    api_url: _0x5ecebe,
    api_key: _0xea46c9,
    model: _0x3265f3,
    temperature: _0x4ae891,
    top_p: _0x45b779,
    max_tokens: _0x571cea,
    stream: _0x49b4b7,
    bypass_proxy: _0x182fe0
  } = _0x50a74d;
  if (!_0x5ecebe || !_0xea46c9 || !_0x3265f3) {
    const _0x4f98c8 = "API URL, API Key, 或 Model 未配置。";
    toastr.error(_0x4f98c8);
    const _0x4ddb0f = {
      success: false,
      result: _0x4f98c8,
      id: _0x3bfe1e
    };
    eventSource.emit(eventNames.LLM_EXECUTE_RESPONSE, _0x4ddb0f);
    return;
  }
  const _0x3ac918 = _0x5ecebe.replace(/\/$/, "");
  let _0x4affb1;
  let _0x3d4a50;
  let _0x338080;
  if (_0x182fe0) {
    _0x4affb1 = _0x3ac918 + "/chat/completions";
    const _0x4a7e37 = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + _0xea46c9
    };
    _0x3d4a50 = _0x4a7e37;
    const _0x26b84f = {
      model: _0x3265f3,
      messages: _0x109ef6,
      temperature: _0x4ae891,
      top_p: _0x45b779,
      max_tokens: _0x571cea,
      stream: _0x49b4b7 ?? false
    };
    _0x338080 = _0x26b84f;
  } else {
    let _0x51f82a = _0x3ac918;
    if (!_0x51f82a.endsWith("/v1") && !_0x51f82a.includes("/v1/")) {
      _0x51f82a = _0x51f82a + "/v1";
    }
    _0x51f82a = _0x51f82a.replace(/\/v1\/$/, "/v1");
    _0x4affb1 = "/api/backends/chat-completions/generate";
    _0x3d4a50 = getRequestHeaders(window.token);
    const _0x52869a = {
      chat_completion_source: "custom",
      custom_url: _0x51f82a,
      custom_include_headers: "Authorization: \"Bearer " + _0xea46c9 + "\"",
      model: _0x3265f3,
      messages: _0x109ef6,
      temperature: _0x4ae891,
      top_p: _0x45b779,
      max_tokens: _0x571cea,
      stream: false
    };
    _0x338080 = _0x52869a;
  }
  if (_0x2e0af5) {
    _0x2e0af5("正在处理外部请求，请稍候...");
  }
  try {
    const _0x5a802a = await fetch(_0x4affb1, {
      method: "POST",
      headers: _0x3d4a50,
      body: JSON.stringify(_0x338080),
      signal: _0x42bcf7
    });
    const _0x262108 = await _0x5a802a.json();
    if (_0x262108.error) {
      let _0x461da6;
      if (typeof _0x262108.error === "object" && _0x262108.error.message) {
        _0x461da6 = "" + _0x262108.error.message;
        const _0x323b67 = [];
        if (_0x262108.error.type) {
          _0x323b67.push("类型: " + _0x262108.error.type);
        }
        if (_0x262108.error.code) {
          _0x323b67.push("代码: " + _0x262108.error.code);
        }
        if (_0x323b67.length > 0) {
          _0x461da6 += " (" + _0x323b67.join(", ") + ")";
        }
      } else {
        _0x461da6 = "" + JSON.stringify(_0x262108.error);
      }
      throw new Error(_0x461da6);
    }
    if (!_0x5a802a.ok) {
      throw new Error("请求失败: " + _0x5a802a.status + " " + _0x5a802a.statusText);
    }
    const _0x169508 = _0x262108.choices?.[0]?.message?.content || "";
    if (!_0x169508) {
      toastr.warning("LLM 请求返回为空，可能是请求被截断、max_tokens 设置过小、或 API 连接问题。");
    }
    if (_0x2e0af5) {
      _0x2e0af5(_0x169508);
    }
    if (!_0x48c003) {
      addLog("\n----- LLM 回复 -----");
      addLog(_0x169508);
      addLog("===== LLM 请求完成 =====");
    }
    taskQueue.completeTask(_0x2a43a5, true);
    llmTaskControllers.delete(_0x2a43a5);
    const _0x330972 = {
      success: true,
      result: _0x169508,
      id: _0x3bfe1e
    };
    eventSource.emit(eventNames.LLM_EXECUTE_RESPONSE, _0x330972);
  } catch (_0x325eaa) {
    if (_0x325eaa.name === "AbortError") {
      _0x3b3e08 = true;
      console.log("LLM execute request aborted.");
      taskQueue.updateStatus(_0x2a43a5, TaskStatus.CANCELLED);
      llmTaskControllers.delete(_0x2a43a5);
      const _0x151468 = {
        success: false,
        result: null,
        id: _0x3bfe1e,
        error: {
          name: "AbortError",
          message: "Request aborted"
        }
      };
      eventSource.emit(eventNames.LLM_EXECUTE_RESPONSE, _0x151468);
      return;
    }
    console.error("LLM Execute Error:", _0x325eaa);
    const _0x2021d0 = "请求错误: " + _0x325eaa.message;
    if (_0x2e0af5) {
      _0x2e0af5(_0x2021d0);
    }
    toastr.error(_0x325eaa.message);
    taskQueue.completeTask(_0x2a43a5, false);
    llmTaskControllers.delete(_0x2a43a5);
    const _0x4e1007 = {
      success: false,
      result: _0x2021d0,
      id: _0x3bfe1e
    };
    eventSource.emit(eventNames.LLM_EXECUTE_RESPONSE, _0x4e1007);
  } finally {
    if (defaultLLMChannelControllers.get(_0x32b586) === _0x317f3f) {
      defaultLLMChannelControllers.delete(_0x32b586);
    }
    if (!_0x3b3e08 || !defaultLLMChannelControllers.has(_0x32b586)) {
      stopFabLoading();
    }
  }
}
export function createGetPromptHandler(_0x560d62, _0x51d488) {
  return function (_0x165aad) {
    const {
      id: _0x39ded4
    } = _0x165aad;
    if (!_0x39ded4) {
      return;
    }
    const _0x1719b8 = REQUEST_TYPE_NAMES[_0x560d62] || _0x560d62;
    console.log("st-chatu8: 收到" + _0x1719b8 + "提示词获取请求 (ID: " + _0x39ded4 + ")");
    const _0x441178 = buildPromptForRequestType(_0x560d62);
    const _0x32826b = {
      prompt: _0x441178,
      id: _0x39ded4
    };
    eventSource.emit(_0x51d488, _0x32826b);
  };
}
export function createExecuteHandler(_0x4dfe2e, _0x4f2bbc, _0x458e1c = null) {
  return async function (_0x366681) {
    const _0x2e2331 = _0x458e1c ? _0x458e1c() : null;
    await executeTypedLLMRequest(_0x366681, _0x4dfe2e, _0x4f2bbc, _0x2e2331);
  };
}