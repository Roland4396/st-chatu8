import { addLog, getRequestHeaders } from "./utils.js";
import { executeDefaultLLMRequest, abortLLMChannelRequest } from "./settings/llm.js";
import { extensionName } from "./config.js";
import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { systemPrompts, defaultSystemPromptKey } from "./aiPrompts.js";
import { getModuleSummaries } from "./aiPromptModules.js";
import { saveAiChatHistory, getAiChatHistory, clearAiChatHistory } from "./configDatabase.js";
import { getSettingsContextPrompt, parseAndApplySettings, parseQuerySettings, hasSystemCommand } from "./aiSettingsBridge.js";
import { parseThinkingContent, extractStreamingThinking } from "./aiThinkingParser.js";
let markedLoaded = false;
let markedLoadPromise = null;
function loadMarked() {
  if (markedLoaded) {
    return Promise.resolve();
  }
  if (markedLoadPromise) {
    return markedLoadPromise;
  }
  markedLoadPromise = new Promise((_0x364d35, _0x87977d) => {
    if (window.marked) {
      markedLoaded = true;
      _0x364d35();
      return;
    }
    const _0x551732 = document.createElement("script");
    _0x551732.src = "https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js";
    _0x551732.onload = () => {
      markedLoaded = true;
      if (window.marked) {
        window.marked.setOptions({
          breaks: true,
          gfm: true
        });
      }
      _0x364d35();
    };
    _0x551732.onerror = () => {
      console.warn("[AI Assistant] 加载 marked.js 失败，将使用纯文本显示");
      _0x87977d();
    };
    document.head.appendChild(_0x551732);
  });
  return markedLoadPromise;
}
let chatSessions = {
  activeChatId: null,
  chats: {}
};
let initialized = false;
let isAiGenerating = false;
let refreshSettingsPanelFn = null;
const pendingImageGenerations = new Map();
function createThrottle(_0x2d2642, _0x2a8c8a) {
  let _0x3e5d30 = 0;
  let _0x3abe36 = null;
  let _0x143bd9 = null;
  function _0x3fbc2b(..._0x29cb4c) {
    _0x143bd9 = _0x29cb4c;
    const _0x94c1e5 = Date.now();
    const _0x5b34ed = _0x2a8c8a - (_0x94c1e5 - _0x3e5d30);
    if (_0x5b34ed <= 0) {
      if (_0x3abe36) {
        clearTimeout(_0x3abe36);
        _0x3abe36 = null;
      }
      _0x3e5d30 = _0x94c1e5;
      _0x2d2642.apply(this, _0x29cb4c);
    } else if (!_0x3abe36) {
      _0x3abe36 = setTimeout(() => {
        _0x3e5d30 = Date.now();
        _0x3abe36 = null;
        _0x2d2642.apply(this, _0x143bd9);
      }, _0x5b34ed);
    }
  }
  _0x3fbc2b.cancel = () => {
    if (_0x3abe36) {
      clearTimeout(_0x3abe36);
      _0x3abe36 = null;
    }
  };
  _0x3fbc2b.flush = () => {
    if (_0x3abe36) {
      clearTimeout(_0x3abe36);
      _0x3abe36 = null;
      _0x3e5d30 = Date.now();
      if (_0x143bd9) {
        _0x2d2642.apply(null, _0x143bd9);
      }
    }
  };
  return _0x3fbc2b;
}
function createDebounce(_0x4f1f7, _0x4ac99c) {
  let _0x56d2d6 = null;
  function _0x3fa803(..._0x4bd696) {
    if (_0x56d2d6) {
      clearTimeout(_0x56d2d6);
    }
    _0x56d2d6 = setTimeout(() => {
      _0x56d2d6 = null;
      _0x4f1f7.apply(this, _0x4bd696);
    }, _0x4ac99c);
  }
  _0x3fa803.cancel = () => {
    if (_0x56d2d6) {
      clearTimeout(_0x56d2d6);
      _0x56d2d6 = null;
    }
  };
  _0x3fa803.flush = () => {
    if (_0x56d2d6) {
      clearTimeout(_0x56d2d6);
      _0x56d2d6 = null;
      _0x4f1f7.apply(null);
    }
  };
  return _0x3fa803;
}
export function refreshAiAssistantSettings() {
  if (refreshSettingsPanelFn) {
    refreshSettingsPanelFn();
  }
}
export function initAiAssistant(_0x1995b5) {
  loadMarked().catch(() => {
    console.warn("[AI Assistant] Markdown 渲染不可用，将使用纯文本模式");
  });
  window.addEventListener("ai-show-generated-image", _0x3aaac6 => {
    console.log("[AI Assistant] 收到显示图片事件:", _0x3aaac6.detail);
    const {
      imageUrl: _0x6da35b,
      prompt: _0x2e230c
    } = _0x3aaac6.detail;
    if (!_0x6da35b) {
      console.warn("[AI Assistant] 图片URL为空");
      return;
    }
    const _0x33ff93 = $("#st-chatu8-ai-dialog");
    const _0x4ac419 = _0x33ff93.find("#st-chatu8-ai-chat-body");
    const _0x2cc9e4 = "<img src=\"/scripts/extensions/third-party/st-chatu8/html/settings/智绘姬头像.png\" alt=\"智绘姬\" style=\"width: 100%; height: 100%; object-fit: cover; border-radius: 50%; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;\">";
    const _0x3f615d = "\n            <div class=\"st-chatu8-ai-msg system-msg\">\n                <div class=\"msg-avatar\">" + _0x2cc9e4 + "</div>\n                <div class=\"msg-content\">\n                    <div class=\"st-chatu8-ai-generated-image\" style=\"margin-top: 10px;\">\n                        <img src=\"" + _0x6da35b + "\" alt=\"AI生成的图片\" style=\"max-width: 100%; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1);\" />\n                        <div style=\"margin-top: 5px; font-size: 12px; color: #666;\">提示词: " + _0x305c36(_0x2e230c) + "</div>\n                    </div>\n                </div>\n            </div>\n        ";
    const _0x48a9b7 = $(_0x3f615d);
    _0x48a9b7.find("img").on("click", function () {
      _0xa09a36(_0x6da35b);
    });
    _0x4ac419.append(_0x48a9b7);
    _0x4ac419.scrollTop(_0x4ac419[0].scrollHeight);
    console.log("[AI Assistant] 已添加图片消息到聊天");
    if (chatSessions.activeChatId && chatSessions.chats[chatSessions.activeChatId]) {
      const _0x5849e2 = chatSessions.chats[chatSessions.activeChatId];
      const _0x38d780 = {
        url: _0x6da35b
      };
      const _0x52a5e2 = {
        role: "assistant",
        content: [{
          type: "text",
          text: "[图片生成]\n提示词: " + _0x2e230c
        }, {
          type: "image_url",
          image_url: _0x38d780
        }]
      };
      const _0x391897 = _0x52a5e2;
      _0x5849e2.messages.push(_0x391897);
      _0x5849e2.updatedAt = Date.now();
      saveAiChatHistory(chatSessions).then(() => {
        console.log("[AI Assistant] 图片消息已保存到历史记录（多模态格式）");
      }).catch(_0x55c04d => {
        console.error("[AI Assistant] 保存图片消息失败:", _0x55c04d);
      });
    }
  });
  const _0x4a854b = $("#st-chatu8-ai-trigger");
  const _0x3bf979 = $("#st-chatu8-ai-dialog");
  const _0x1df48e = _0x3bf979.find("#st-chatu8-ai-close");
  const _0xdc2ea6 = _0x3bf979.find("#st-chatu8-ai-send");
  const _0x4ebd42 = _0x3bf979.find("#st-chatu8-ai-input");
  const _0x42f082 = _0x3bf979.find("#st-chatu8-ai-chat-body");
  const _0x484ebb = _0x3bf979.find(".st-chatu8-ai-dialog-header");
  const _0x266c32 = _0x3bf979.find("#st-chatu8-ai-image-btn");
  const _0x10799c = _0x3bf979.find("#st-chatu8-ai-image-input");
  const _0x7751e5 = _0x3bf979.find("#st-chatu8-ai-image-preview");
  function _0x42e9ff() {
    if (isAiGenerating) {
      _0xdc2ea6.html("<i class=\"fa-solid fa-stop\"></i>");
      _0xdc2ea6.addClass("generating");
      _0xdc2ea6.attr("title", "停止生成");
    } else {
      _0xdc2ea6.html("<i class=\"fa-solid fa-paper-plane\"></i>");
      _0xdc2ea6.removeClass("generating");
      _0xdc2ea6.attr("title", "发送");
    }
  }
  const _0x16f08a = _0x3bf979.find("#st-chatu8-ai-settings-btn");
  const _0x2aa582 = _0x3bf979.find("#st-chatu8-ai-settings-panel");
  const _0x3e9af6 = _0x3bf979.find("#st-chatu8-ai-settings-close");
  const _0x49a232 = _0x3bf979.find("#st-chatu8-ai-save-settings");
  const _0x4f7cf4 = _0x3bf979.find("#chatu8-ai-api-url");
  const _0x1ec3ea = _0x3bf979.find("#chatu8-ai-api-key");
  const _0x28166e = _0x3bf979.find("#chatu8-ai-model");
  const _0x246061 = _0x3bf979.find("#chatu8-ai-model-select");
  const _0x3bc7c0 = _0x3bf979.find("#chatu8-ai-system-prompt");
  const _0x5dd524 = _0x3bf979.find("#chatu8-ai-fetch-models");
  const _0x1d5424 = _0x3bf979.find("#chatu8-ai-bypass-proxy");
  const _0x5ae511 = _0x3bf979.find("#chatu8-ai-stream");
  const _0x4a2126 = _0x3bf979.find("#chatu8-ai-max-tokens");
  const _0x8ca30 = _0x3bf979.find("#chatu8-ai-temperature");
  const _0x3f2bad = _0x3bf979.find("#chatu8-ai-top-p");
  const _0x1f34c8 = _0x3bf979.find("#chatu8-ai-auto-execute");
  const _0x6f724b = _0x3bf979.find("#st-chatu8-ai-new-chat");
  const _0x1a3f4b = _0x3bf979.find("#st-chatu8-ai-history-btn");
  const _0x39816a = _0x3bf979.find("#st-chatu8-ai-history-panel");
  const _0x35b389 = _0x3bf979.find("#st-chatu8-ai-history-close");
  const _0x1e2843 = _0x3bf979.find("#st-chatu8-ai-history-list");
  const _0x3fdc0c = _0x3bf979.find("#st-chatu8-ai-export-chat");
  const _0x36d653 = _0x3bf979.find("#st-chatu8-ai-select-all");
  const _0x2cbfcb = _0x3bf979.find("#st-chatu8-ai-deselect-all");
  _0x3bc7c0.empty();
  Object.entries(systemPrompts).forEach(([_0xef045b, _0x2224af]) => {
    _0x3bc7c0.append(new Option(_0x2224af.name, _0xef045b));
  });
  function _0x37606a(_0x46d0f7, _0x345e55, _0x197fa3) {
    let _0x5d3fd6 = false;
    let _0x24eec3;
    let _0x50a5c9;
    let _0x3e5bb4;
    let _0x30c243;
    let _0x192f71 = false;
    let _0x392531 = false;
    function _0x4c7e1e(_0x511794, _0x19bd61, _0x1d83e1) {
      if (_0x197fa3 && $(_0x1d83e1).closest(_0x197fa3).length > 0) {
        return false;
      }
      _0x5d3fd6 = true;
      _0x192f71 = false;
      _0x24eec3 = _0x511794;
      _0x50a5c9 = _0x19bd61;
      if (!_0x392531) {
        const _0x18c601 = _0x46d0f7[0].getBoundingClientRect();
        _0x3e5bb4 = _0x18c601.left;
        _0x30c243 = _0x18c601.top;
        _0x392531 = true;
      } else {
        const _0x4df63e = window.getComputedStyle(_0x46d0f7[0]);
        _0x3e5bb4 = parseFloat(_0x4df63e.left) || 0;
        _0x30c243 = parseFloat(_0x4df63e.top) || 0;
      }
      _0x46d0f7.css("transition", "none");
      return true;
    }
    function _0x2be6f3(_0x277b0c, _0x311a2b) {
      if (!_0x5d3fd6) {
        return;
      }
      _0x192f71 = true;
      let _0x4bacb6 = _0x3e5bb4 + (_0x277b0c - _0x24eec3);
      let _0x299ef9 = _0x30c243 + (_0x311a2b - _0x50a5c9);
      const _0x1305ce = _0x46d0f7.outerWidth();
      const _0x961876 = _0x46d0f7.outerHeight();
      _0x4bacb6 = Math.max(0, Math.min(_0x4bacb6, window.innerWidth - _0x1305ce));
      _0x299ef9 = Math.max(0, Math.min(_0x299ef9, window.innerHeight - _0x961876));
      _0x46d0f7.css({
        left: _0x4bacb6 + "px",
        top: _0x299ef9 + "px",
        right: "auto",
        bottom: "auto"
      });
    }
    function _0x4e3141() {
      if (_0x5d3fd6) {
        _0x5d3fd6 = false;
        setTimeout(() => _0x192f71 = false, 50);
        _0x46d0f7.css("transition", "");
      }
    }
    _0x345e55.off("mousedown.aiDrag").on("mousedown.aiDrag", function (_0x45c190) {
      _0x4c7e1e(_0x45c190.clientX, _0x45c190.clientY, _0x45c190.target);
    });
    $(document).off("mousemove.aiDrag").on("mousemove.aiDrag", function (_0x3201e6) {
      _0x2be6f3(_0x3201e6.clientX, _0x3201e6.clientY);
    });
    $(document).off("mouseup.aiDrag").on("mouseup.aiDrag", function () {
      _0x4e3141();
    });
    _0x345e55.off("touchstart.aiDrag").on("touchstart.aiDrag", function (_0x22be53) {
      const _0x252f28 = _0x22be53.originalEvent.touches[0];
      if (_0x4c7e1e(_0x252f28.clientX, _0x252f28.clientY, _0x22be53.target)) {
        _0x22be53.preventDefault();
      }
    });
    $(document).off("touchmove.aiDrag").on("touchmove.aiDrag", function (_0x3dbe46) {
      if (_0x5d3fd6) {
        const _0x40a2f9 = _0x3dbe46.originalEvent.touches[0];
        _0x2be6f3(_0x40a2f9.clientX, _0x40a2f9.clientY);
        _0x3dbe46.preventDefault();
      }
    });
    $(document).off("touchend.aiDrag touchcancel.aiDrag").on("touchend.aiDrag touchcancel.aiDrag", function () {
      _0x4e3141();
    });
    return () => _0x192f71;
  }
  function _0x4f64d6(_0x1f4b2f) {
    const _0x56c4d2 = $("<div class=\"st-chatu8-ai-resize-handle\"><i class=\"fa-solid fa-grip-lines\"></i></div>");
    _0x1f4b2f.append(_0x56c4d2);
    let _0x3ce8b8 = false;
    let _0x3fd56c;
    let _0x8b8012;
    let _0x569fd4;
    let _0x2c7eb2;
    function _0x4ffcb8(_0x1a8837, _0xdbda18) {
      _0x3ce8b8 = true;
      _0x3fd56c = _0x1a8837;
      _0x8b8012 = _0xdbda18;
      _0x569fd4 = _0x1f4b2f.outerWidth();
      _0x2c7eb2 = _0x1f4b2f.outerHeight();
      _0x1f4b2f.css("transition", "none");
      $("body").css("user-select", "none");
    }
    function _0x351190(_0x4ccce4, _0x4c4078) {
      if (!_0x3ce8b8) {
        return;
      }
      const _0x20136f = _0x4ccce4 - _0x3fd56c;
      const _0x34aaed = _0x4c4078 - _0x8b8012;
      let _0x22eacc = _0x569fd4 + _0x20136f;
      let _0x54455a = _0x2c7eb2 + _0x34aaed;
      const _0x5dbf59 = 300;
      const _0x303bd0 = 400;
      _0x22eacc = Math.max(_0x5dbf59, _0x22eacc);
      _0x54455a = Math.max(_0x303bd0, _0x54455a);
      const _0x1792b7 = window.innerWidth - 50;
      const _0x34e1ff = window.innerHeight - 50;
      _0x22eacc = Math.min(_0x1792b7, _0x22eacc);
      _0x54455a = Math.min(_0x34e1ff, _0x54455a);
      _0x1f4b2f.css({
        width: _0x22eacc + "px",
        height: _0x54455a + "px"
      });
    }
    function _0x25abd9() {
      if (_0x3ce8b8) {
        _0x3ce8b8 = false;
        _0x1f4b2f.css("transition", "");
        $("body").css("user-select", "");
      }
    }
    _0x56c4d2.off("mousedown.aiResize").on("mousedown.aiResize", function (_0x2c484) {
      _0x2c484.preventDefault();
      _0x2c484.stopPropagation();
      _0x4ffcb8(_0x2c484.clientX, _0x2c484.clientY);
    });
    $(document).off("mousemove.aiResize").on("mousemove.aiResize", function (_0x20fd27) {
      _0x351190(_0x20fd27.clientX, _0x20fd27.clientY);
    });
    $(document).off("mouseup.aiResize").on("mouseup.aiResize", function () {
      _0x25abd9();
    });
    _0x56c4d2.off("touchstart.aiResize").on("touchstart.aiResize", function (_0x3849bb) {
      _0x3849bb.preventDefault();
      _0x3849bb.stopPropagation();
      const _0x5c210 = _0x3849bb.originalEvent.touches[0];
      _0x4ffcb8(_0x5c210.clientX, _0x5c210.clientY);
    });
    $(document).off("touchmove.aiResize").on("touchmove.aiResize", function (_0x2a82ef) {
      if (_0x3ce8b8) {
        const _0x4a6499 = _0x2a82ef.originalEvent.touches[0];
        _0x351190(_0x4a6499.clientX, _0x4a6499.clientY);
        _0x2a82ef.preventDefault();
      }
    });
    $(document).off("touchend.aiResize touchcancel.aiResize").on("touchend.aiResize touchcancel.aiResize", function () {
      _0x25abd9();
    });
  }
  _0x37606a(_0x3bf979, _0x484ebb, "#st-chatu8-ai-close, #st-chatu8-ai-settings-btn, #st-chatu8-ai-new-chat, #st-chatu8-ai-history-btn");
  _0x4f64d6(_0x3bf979);
  function _0x1bb020() {
    const _0x56beb5 = extension_settings[extensionName]?.chatu8_ai_assistant || {};
    _0x4f7cf4.val(_0x56beb5.api_url || "");
    _0x1ec3ea.val(_0x56beb5.api_key || "");
    _0x28166e.val(_0x56beb5.model || "mistral");
    _0x3bc7c0.val(_0x56beb5.system_prompt_key || defaultSystemPromptKey);
    _0x1d5424.prop("checked", !!_0x56beb5.bypass_proxy);
    _0x5ae511.prop("checked", false);
    _0x1f34c8.prop("checked", !!_0x56beb5.auto_execute_commands);
    _0x4a2126.val(_0x56beb5.max_tokens ?? 40000);
    _0x8ca30.val(_0x56beb5.temperature ?? 0.8);
    _0x3f2bad.val(_0x56beb5.top_p ?? 1);
  }
  refreshSettingsPanelFn = _0x1bb020;
  function _0x2176a9() {
    const _0x304a1d = extension_settings[extensionName]?.chatu8_ai_assistant || {};
    if (!_0x304a1d.api_key) {
      _0x2aa582.addClass("active");
      toastr?.info("初次使用请先配置好 API 和 模型信息哦~");
    }
    _0x1bb020();
  }
  function _0x4451d9() {
    return "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
  }
  function _0x1df114(_0x1dd233) {
    const _0x1c72af = new Date(_0x1dd233);
    return _0x1c72af.getMonth() + 1 + "-" + _0x1c72af.getDate() + " " + _0x1c72af.getHours().toString().padStart(2, "0") + ":" + _0x1c72af.getMinutes().toString().padStart(2, "0");
  }
  async function _0x42095d() {
    if (!chatSessions.activeChatId && Object.keys(chatSessions.chats).length === 0) {
      return;
    }
    if (chatSessions.activeChatId && chatSessions.chats[chatSessions.activeChatId]) {
      chatSessions.chats[chatSessions.activeChatId].updatedAt = Date.now();
    }
    await saveAiChatHistory(chatSessions);
  }
  function _0x5cb9b3() {
    const _0x503f6e = _0x4451d9();
    chatSessions.activeChatId = _0x503f6e;
    chatSessions.chats[_0x503f6e] = {
      id: _0x503f6e,
      title: "新对话",
      updatedAt: Date.now(),
      messages: []
    };
    _0x42f082.empty();
    _0xce10b4("system", "你好呀！我是智绘姬 AI 助手，让我们开始新的对话吧！");
    _0x42095d();
  }
  function _0x3c1212(_0x5f42a7) {
    if (!chatSessions.chats[_0x5f42a7]) {
      return;
    }
    chatSessions.activeChatId = _0x5f42a7;
    _0x42f082.empty();
    const _0x295269 = chatSessions.chats[_0x5f42a7].messages;
    if (_0x295269.length === 0) {
      _0xce10b4("system", "你好呀！我是智绘姬 AI 助手，让我们开始新的对话吧！");
    } else {
      const _0x344a14 = document.createDocumentFragment();
      const _0x353cb6 = document.createElement("div");
      _0x295269.forEach((_0x5a9f71, _0x532dcc) => {
        let _0x54fe07 = "";
        let _0x4761c6 = null;
        if (Array.isArray(_0x5a9f71.content)) {
          const _0x4feee5 = _0x5a9f71.content.find(_0x302062 => _0x302062.type === "text");
          _0x54fe07 = _0x4feee5?.text || "";
          const _0x3274d2 = _0x5a9f71.content.filter(_0x33c19e => _0x33c19e.type === "image_url");
          if (_0x3274d2.length > 0) {
            _0x4761c6 = _0x3274d2.map(_0x1d6e55 => ({
              data: _0x1d6e55.image_url?.url || _0x1d6e55.image_url,
              name: "生成的图片"
            }));
          }
        } else {
          _0x54fe07 = _0x5a9f71.content;
          _0x4761c6 = _0x5a9f71.images || null;
        }
        _0xce10b4(_0x5a9f71.role, _0x54fe07, _0x4761c6, _0x532dcc);
      });
      _0x42f082.scrollTop(_0x42f082[0].scrollHeight);
    }
    _0x39816a.removeClass("active");
    _0x42095d();
  }
  async function _0xf1a260() {
    if (initialized) {
      return;
    }
    initialized = true;
    try {
      const _0x308788 = await getAiChatHistory();
      if (Array.isArray(_0x308788)) {
        if (_0x308788.length > 0) {
          const _0x407a9c = _0x4451d9();
          chatSessions = {
            activeChatId: _0x407a9c,
            chats: {
              [_0x407a9c]: {
                id: _0x407a9c,
                title: _0x308788[0].content.substring(0, 15) + "...",
                updatedAt: Date.now(),
                messages: _0x308788
              }
            }
          };
        } else {
          chatSessions = {
            activeChatId: null,
            chats: {}
          };
        }
      } else if (_0x308788 && _0x308788.chats) {
        chatSessions = _0x308788;
      } else {
        chatSessions = {
          activeChatId: null,
          chats: {}
        };
      }
    } catch (_0x5a1324) {
      console.error("[AI Assistant] 加载聊天记录失败", _0x5a1324);
      chatSessions = {
        activeChatId: null,
        chats: {}
      };
    }
    if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
      _0x5cb9b3();
    } else {
      _0x3c1212(chatSessions.activeChatId);
    }
  }
  $(document).on("click", "#st-chatu8-ai-trigger", async function (_0x23739a) {
    const _0x1d20c8 = _0x3bf979.hasClass("active");
    _0x3bf979.toggleClass("active");
    if (_0x3bf979.hasClass("active") && !_0x1d20c8) {
      addLog("[UI] 唤醒智绘姬AI助手");
      const _0x4f54f4 = _0x3bf979.outerWidth();
      const _0x89245f = _0x3bf979.outerHeight();
      const _0x35d4db = window.innerWidth;
      const _0x355337 = window.innerHeight;
      const _0x2ec7a8 = (_0x35d4db - _0x4f54f4) / 2;
      const _0x498719 = (_0x355337 - _0x89245f) / 2;
      _0x3bf979.css({
        left: Math.max(0, _0x2ec7a8) + "px",
        top: Math.max(0, _0x498719) + "px"
      });
      _0x2176a9();
      await _0xf1a260();
      setTimeout(() => _0x4ebd42.focus(), 300);
    }
  });
  _0x6f724b.on("click", async function () {
    if (confirm("确定要保留当前聊天，开启新对话吗？")) {
      _0x5cb9b3();
      toastr?.success("已开启新对话。");
    }
  });
  function _0x57a864() {
    _0x1e2843.empty();
    const _0x174a75 = Object.values(chatSessions.chats).sort((_0x34f95e, _0x44d625) => _0x44d625.updatedAt - _0x34f95e.updatedAt);
    if (_0x174a75.length === 0) {
      _0x1e2843.append("<div style=\"text-align: center; color: var(--st-chatu8-text-secondary); margin-top: 20px;\">暂无聊天记录</div>");
      return;
    }
    _0x174a75.forEach(_0x5f3e65 => {
      const _0x38b4f2 = _0x5f3e65.id === chatSessions.activeChatId ? "active-chat" : "";
      const _0x16a77e = "\n                <div class=\"st-chatu8-ai-history-item " + _0x38b4f2 + "\" data-id=\"" + _0x5f3e65.id + "\">\n                    <div class=\"st-chatu8-ai-history-content\">\n                        <input type=\"checkbox\" class=\"st-chatu8-ai-history-checkbox\" data-id=\"" + _0x5f3e65.id + "\">\n                        <div class=\"st-chatu8-ai-history-info\">\n                            <span class=\"st-chatu8-ai-history-title\">" + _0x305c36(_0x5f3e65.title) + "</span>\n                            <span class=\"st-chatu8-ai-history-time\">" + _0x1df114(_0x5f3e65.updatedAt) + "</span>\n                        </div>\n                    </div>\n                    <i class=\"fa-solid fa-trash-can st-chatu8-ai-history-delete\" data-id=\"" + _0x5f3e65.id + "\" title=\"删除此对话\"></i>\n                </div>\n            ";
      const _0x5d6cc3 = $(_0x16a77e);
      _0x5d6cc3.find(".st-chatu8-ai-history-info").on("click", function (_0x349294) {
        _0x349294.stopPropagation();
        _0x3c1212(_0x5f3e65.id);
      });
      _0x5d6cc3.find(".st-chatu8-ai-history-checkbox").on("click", function (_0x53aa74) {
        _0x53aa74.stopPropagation();
        const _0x2c4338 = $(this);
        const _0x2508ea = _0x2c4338.closest(".st-chatu8-ai-history-item");
        if (_0x2c4338.is(":checked")) {
          _0x2508ea.addClass("selected");
        } else {
          _0x2508ea.removeClass("selected");
        }
      });
      _0x5d6cc3.find(".st-chatu8-ai-history-delete").on("click", async function (_0x763ad1) {
        _0x763ad1.stopPropagation();
        if (confirm("确定要永久删除这条聊天记录吗？")) {
          delete chatSessions.chats[_0x5f3e65.id];
          if (chatSessions.activeChatId === _0x5f3e65.id) {
            chatSessions.activeChatId = null;
            _0x5cb9b3();
          }
          await saveAiChatHistory(chatSessions);
          _0x57a864();
        }
      });
      _0x1e2843.append(_0x5d6cc3);
    });
  }
  _0x1a3f4b.on("click", function () {
    _0x2aa582.removeClass("active");
    _0x57a864();
    _0x39816a.addClass("active");
  });
  _0x35b389.on("click", function () {
    _0x39816a.removeClass("active");
  });
  _0x36d653.on("click", function () {
    _0x1e2843.find(".st-chatu8-ai-history-checkbox").prop("checked", true).trigger("change");
    _0x1e2843.find(".st-chatu8-ai-history-item").addClass("selected");
  });
  _0x2cbfcb.on("click", function () {
    _0x1e2843.find(".st-chatu8-ai-history-checkbox").prop("checked", false).trigger("change");
    _0x1e2843.find(".st-chatu8-ai-history-item").removeClass("selected");
  });
  _0x3fdc0c.on("click", function () {
    try {
      const _0x3300cd = _0x1e2843.find(".st-chatu8-ai-history-checkbox:checked");
      if (_0x3300cd.length === 0) {
        toastr?.warning("请先选择要导出的聊天记录！");
        return;
      }
      const _0x1a6430 = {};
      _0x3300cd.each(function () {
        const _0x41dfdb = $(this).data("id");
        if (chatSessions.chats[_0x41dfdb]) {
          _0x1a6430[_0x41dfdb] = chatSessions.chats[_0x41dfdb];
        }
      });
      const _0x3d4997 = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        exportCount: Object.keys(_0x1a6430).length,
        chats: _0x1a6430
      };
      const _0x393491 = JSON.stringify(_0x3d4997, null, 2);
      const _0x5bc6dc = new Blob([_0x393491], {
        type: "application/json"
      });
      const _0x513790 = URL.createObjectURL(_0x5bc6dc);
      const _0x2b2648 = document.createElement("a");
      _0x2b2648.href = _0x513790;
      const _0x36ccc9 = new Date();
      const _0x175971 = "" + _0x36ccc9.getFullYear() + (_0x36ccc9.getMonth() + 1).toString().padStart(2, "0") + _0x36ccc9.getDate().toString().padStart(2, "0");
      const _0x16d0f1 = "" + _0x36ccc9.getHours().toString().padStart(2, "0") + _0x36ccc9.getMinutes().toString().padStart(2, "0") + _0x36ccc9.getSeconds().toString().padStart(2, "0");
      _0x2b2648.download = "智绘姬聊天记录_" + _0x175971 + "_" + _0x16d0f1 + ".json";
      document.body.appendChild(_0x2b2648);
      _0x2b2648.click();
      document.body.removeChild(_0x2b2648);
      URL.revokeObjectURL(_0x513790);
      toastr?.success("已导出 " + Object.keys(_0x1a6430).length + " 条聊天记录！");
    } catch (_0x2d9a56) {
      console.error("[AI Assistant] 导出聊天记录失败:", _0x2d9a56);
      toastr?.error("导出失败: " + _0x2d9a56.message);
    }
  });
  _0x1df48e.on("click", function () {
    _0x3bf979.removeClass("active");
  });
  _0x246061.on("change", function () {
    const _0x5505d9 = $(this).val();
    if (_0x5505d9) {
      _0x28166e.val(_0x5505d9);
      _0x28166e.trigger("input");
    }
  });
  _0x5dd524.on("click", async function () {
    const _0x260f8e = _0x4f7cf4.val().trim();
    const _0x32cc14 = _0x1ec3ea.val().trim();
    const _0x3c8bb6 = _0x1d5424.is(":checked");
    if (!_0x260f8e || !_0x32cc14) {
      toastr?.warning("请先配置 API 地址和 API Key。");
      return;
    }
    const _0x2cd61a = _0x5dd524.html();
    _0x5dd524.html("<i class=\"fa-solid fa-spinner fa-spin\"></i>");
    _0x5dd524.prop("disabled", true);
    try {
      let _0x426c5a;
      let _0x32e590;
      if (_0x3c8bb6) {
        const _0x488f99 = _0x260f8e.replace(/\/$/, "") + "/v1/models";
        _0x426c5a = await fetch(_0x488f99, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + _0x32cc14,
            "Content-Type": "application/json"
          }
        });
        if (!_0x426c5a.ok) {
          throw new Error("获取模型列表失败: " + _0x426c5a.status + " " + _0x426c5a.statusText);
        }
        _0x32e590 = await _0x426c5a.json();
      } else {
        const _0x4a66c1 = "/api/backends/chat-completions/status";
        const _0x5d9814 = _0x260f8e.replace(/\/$/, "");
        _0x426c5a = await fetch(_0x4a66c1, {
          method: "POST",
          headers: getRequestHeaders(window.token),
          body: JSON.stringify({
            chat_completion_source: "custom",
            custom_url: _0x5d9814,
            custom_include_headers: "Authorization: \"Bearer " + _0x32cc14 + "\""
          })
        });
        _0x32e590 = await _0x426c5a.json();
        if (_0x32e590.error) {
          throw new Error(_0x32e590.error.message || JSON.stringify(_0x32e590.error));
        }
        if (!_0x426c5a.ok) {
          throw new Error("获取模型列表失败: " + _0x426c5a.status + " " + _0x426c5a.statusText);
        }
      }
      const _0x2ff4b6 = _0x32e590.data || [];
      _0x2ff4b6.sort((_0x4e22fb, _0x1462eb) => _0x4e22fb.id.localeCompare(_0x1462eb.id));
      _0x246061.empty();
      _0x246061.append("<option value=\"\">(请先获取并选择模型)</option>");
      _0x2ff4b6.forEach(_0x35493d => {
        _0x246061.append(new Option(_0x35493d.id, _0x35493d.id));
      });
      toastr?.success("成功获取 " + _0x2ff4b6.length + " 个模型。");
    } catch (_0x22999a) {
      toastr?.error("获取模型失败: " + _0x22999a.message);
    } finally {
      _0x5dd524.html(_0x2cd61a);
      _0x5dd524.prop("disabled", false);
    }
  });
  _0x16f08a.on("click", function () {
    _0x39816a.removeClass("active");
    _0x2176a9();
    _0x2aa582.addClass("active");
  });
  _0x3e9af6.on("click", function () {
    _0x2aa582.removeClass("active");
  });
  function _0x28ccfb() {
    if (!extension_settings[extensionName].chatu8_ai_assistant) {
      extension_settings[extensionName].chatu8_ai_assistant = {};
    }
    const _0x2c5d6a = extension_settings[extensionName].chatu8_ai_assistant;
    _0x2c5d6a.api_url = _0x4f7cf4.val().trim();
    _0x2c5d6a.api_key = _0x1ec3ea.val().trim();
    _0x2c5d6a.model = _0x28166e.val().trim();
    _0x2c5d6a.system_prompt_key = _0x3bc7c0.val();
    if (_0x2c5d6a.system_prompt !== undefined) {
      delete _0x2c5d6a.system_prompt;
    }
    _0x2c5d6a.bypass_proxy = _0x1d5424.is(":checked");
    _0x2c5d6a.stream = false;
    _0x2c5d6a.auto_execute_commands = _0x1f34c8.is(":checked");
    const _0x31f123 = parseInt(_0x4a2126.val());
    _0x2c5d6a.max_tokens = !isNaN(_0x31f123) ? _0x31f123 : 40000;
    const _0x41fa65 = parseFloat(_0x8ca30.val());
    _0x2c5d6a.temperature = !isNaN(_0x41fa65) ? _0x41fa65 : 0.8;
    const _0x21d315 = parseFloat(_0x3f2bad.val());
    _0x2c5d6a.top_p = !isNaN(_0x21d315) ? _0x21d315 : 1;
    saveSettingsDebounced();
  }
  _0x4f7cf4.on("input", _0x28ccfb);
  _0x1ec3ea.on("input", _0x28ccfb);
  _0x28166e.on("input", _0x28ccfb);
  _0x3bc7c0.on("change", _0x28ccfb);
  _0x1d5424.on("change", _0x28ccfb);
  _0x1f34c8.on("change", _0x28ccfb);
  _0x4a2126.on("input", _0x28ccfb);
  _0x8ca30.on("input", _0x28ccfb);
  _0x3f2bad.on("input", _0x28ccfb);
  _0x49a232.on("click", function () {
    _0x28ccfb();
    _0x2aa582.removeClass("active");
  });
  async function _0xf4d490(_0x503c68) {
    const _0x3e7ed3 = _0x503c68.includes("\"type\": \"generate_image\"") || _0x503c68.includes("\"type\":\"generate_image\"");
    if (_0x3e7ed3 && _0x1526e1) {
      const _0x33c402 = "\n                <div class=\"st-chatu8-ai-image-generating\" style=\"margin-top: 10px; padding: 10px; background: rgba(100, 150, 255, 0.1); border-left: 3px solid #6496ff; border-radius: 4px;\">\n                    <i class=\"fa-solid fa-spinner fa-spin\"></i> 正在生成图片，请稍候...\n                </div>\n            ";
      _0x1526e1.append(_0x33c402);
      _0x42f082.scrollTop(_0x42f082[0].scrollHeight);
      console.log("[AI Assistant] 已显示生图进度提示");
    }
    try {
      const _0x5b2b3c = await parseQuerySettings(_0x503c68);
      return _0x5b2b3c;
    } finally {
      if (_0x3e7ed3 && _0x1526e1) {
        _0x1526e1.find(".st-chatu8-ai-image-generating").remove();
        console.log("[AI Assistant] 已移除生图进度提示");
      }
    }
  }
  function _0x3253ad(_0x5304a0, _0x546a42) {
    const _0x4008e9 = _0x546a42.match(/生图请求已提交，ID: (ai_gen_\d+_\d+)/);
    if (_0x4008e9 && _0x4008e9[1]) {
      const _0x2adfb0 = _0x4008e9[1];
      pendingImageGenerations.set(_0x2adfb0, _0x5304a0);
      const _0x3ee597 = "\n                <div class=\"st-chatu8-ai-image-loading\" data-gen-id=\"" + _0x2adfb0 + "\" style=\"margin-top: 10px; text-align: center; color: var(--st-chatu8-text-secondary);\">\n                    <i class=\"fa-solid fa-spinner fa-spin\"></i> 正在生成图片...\n                </div>\n            ";
      _0x5304a0.append(_0x3ee597);
    }
  }
  let _0x12aab0 = null;
  let _0x1526e1 = null;
  let _0x45edf0 = false;
  function _0xf0798() {
    if (_0x45edf0) {
      return;
    }
    _0x45edf0 = true;
    requestAnimationFrame(() => {
      _0x45edf0 = false;
      if (_0x42f082 && _0x42f082[0]) {
        _0x42f082[0].scrollTop = _0x42f082[0].scrollHeight;
      }
    });
  }
  function _0x12d1ea() {
    let _0xb4ba9f = "";
    let _0x4a1f76 = false;
    let _0x5cc22b = 0;
    let _0x34d6a2 = null;
    const _0xae22fa = 120;
    function _0x270ec9() {
      if (!_0x1526e1) {
        return;
      }
      let _0x36e4a0 = "";
      const _0x33e478 = parseThinkingContent(_0xb4ba9f);
      if (_0x33e478.hasThinking && !_0x4a1f76) {
        _0x33e478.thinkingBlocks.forEach(_0x335265 => {
          _0x36e4a0 += _0x39a917(_0x335265.content);
        });
        _0x4a1f76 = true;
      }
      let _0x3690e6 = _0x33e478.cleanedText;
      const _0x3330c5 = _0x3690e6.match(/<SystemQuery>([\s\S]*?)<\/SystemQuery>/gi);
      const _0x426e27 = _0x3690e6.match(/<UpdateSettings>([\s\S]*?)<\/UpdateSettings>/gi);
      if (_0x3330c5 || _0x426e27) {
        _0x36e4a0 += "<i><span style=\"color:var(--st-chatu8-text-secondary);\">智绘姬调用了内部工具...</span></i>\n";
        let _0x511aaa = "";
        if (_0x3330c5) {
          _0x511aaa += _0x3330c5.join("\n");
        }
        if (_0x426e27) {
          _0x511aaa += _0x426e27.join("\n");
        }
        _0x36e4a0 += "\n                    <details class=\"st-chatu8-ai-query-details\">\n                        <summary class=\"st-chatu8-ai-query-summary\"><i class=\"fa-solid fa-microchip\" style=\"margin-right:5px\"></i> 执行内部命令</summary>\n                        <pre class=\"st-chatu8-ai-query-content\">" + _0x305c36(_0x511aaa) + "</pre>\n                    </details>\n                ";
        let _0x57f261 = _0x3690e6.replace(/<SystemQuery>[\s\S]*?<\/SystemQuery>/gi, "").replace(/<UpdateSettings>[\s\S]*?<\/UpdateSettings>/gi, "").trim();
        if (_0x57f261) {
          _0x36e4a0 += "<br>" + _0x305c36(_0x57f261).replace(/\n/g, "<br>");
        }
      } else if (_0x3690e6.trim()) {
        _0x36e4a0 += _0x305c36(_0x3690e6).replace(/\n/g, "<br>");
      }
      _0x1526e1.html(_0x36e4a0);
      _0xf0798();
    }
    function _0x431c9f(_0x30eda3) {
      _0xb4ba9f = _0x30eda3;
      const _0x16e018 = Date.now();
      if (_0x16e018 - _0x5cc22b >= _0xae22fa) {
        _0x5cc22b = _0x16e018;
        if (_0x34d6a2) {
          clearTimeout(_0x34d6a2);
          _0x34d6a2 = null;
        }
        _0x270ec9();
      } else if (!_0x34d6a2) {
        _0x34d6a2 = setTimeout(() => {
          _0x34d6a2 = null;
          _0x5cc22b = Date.now();
          _0x270ec9();
        }, _0xae22fa - (_0x16e018 - _0x5cc22b));
      }
    }
    function _0x48ee7b() {
      if (_0x34d6a2) {
        clearTimeout(_0x34d6a2);
        _0x34d6a2 = null;
      }
      if (!_0x1526e1 || !_0xb4ba9f) {
        return;
      }
      let _0x76c5d9 = "";
      const _0x13692f = parseThinkingContent(_0xb4ba9f);
      if (_0x13692f.hasThinking) {
        _0x13692f.thinkingBlocks.forEach(_0x366db6 => {
          _0x76c5d9 += _0x39a917(_0x366db6.content);
        });
      }
      let _0x4004fe = _0x13692f.cleanedText;
      const _0x1d3844 = _0x4004fe.match(/<SystemQuery>([\s\S]*?)<\/SystemQuery>/gi);
      const _0x1cb512 = _0x4004fe.match(/<UpdateSettings>([\s\S]*?)<\/UpdateSettings>/gi);
      if (_0x1d3844 || _0x1cb512) {
        _0x76c5d9 += "<i><span style=\"color:var(--st-chatu8-text-secondary);\">智绘姬调用了内部工具...</span></i>\n";
        let _0x261f16 = "";
        if (_0x1d3844) {
          _0x261f16 += _0x1d3844.join("\n");
        }
        if (_0x1cb512) {
          _0x261f16 += _0x1cb512.join("\n");
        }
        _0x76c5d9 += "\n                    <details class=\"st-chatu8-ai-query-details\">\n                        <summary class=\"st-chatu8-ai-query-summary\"><i class=\"fa-solid fa-microchip\" style=\"margin-right:5px\"></i> 执行内部命令</summary>\n                        <pre class=\"st-chatu8-ai-query-content\">" + _0x305c36(_0x261f16) + "</pre>\n                    </details>\n                ";
        let _0x356a52 = _0x4004fe.replace(/<SystemQuery>[\s\S]*?<\/SystemQuery>/gi, "").replace(/<UpdateSettings>[\s\S]*?<\/UpdateSettings>/gi, "").trim();
        if (_0x356a52) {
          _0x76c5d9 += "<br>" + _0x4373b0(_0x356a52);
        }
      } else if (_0x4004fe.trim()) {
        _0x76c5d9 += _0x4373b0(_0x4004fe);
      }
      _0x1526e1.html(_0x76c5d9);
      _0xf0798();
    }
    function _0x4bc067() {
      return _0xb4ba9f;
    }
    const _0x2947f8 = {
      callback: _0x431c9f,
      flush: _0x48ee7b,
      getReply: _0x4bc067
    };
    return _0x2947f8;
  }
  let _0x993641 = [];
  _0x266c32.on("click", function () {
    _0x10799c.click();
  });
  _0x10799c.on("change", function (_0x12c1c5) {
    const _0x21bf7 = Array.from(_0x12c1c5.target.files);
    if (_0x21bf7.length === 0) {
      return;
    }
    _0x21bf7.forEach(_0x2b05a8 => {
      if (!_0x2b05a8.type.startsWith("image/")) {
        toastr?.warning("文件 " + _0x2b05a8.name + " 不是图片格式");
        return;
      }
      const _0x47d94d = new FileReader();
      _0x47d94d.onload = function (_0x3b3f51) {
        const _0xbefefc = {
          name: _0x2b05a8.name,
          type: _0x2b05a8.type,
          data: _0x3b3f51.target.result
        };
        const _0x89286d = _0xbefefc;
        _0x993641.push(_0x89286d);
        _0x5c163a();
      };
      _0x47d94d.readAsDataURL(_0x2b05a8);
    });
    _0x10799c.val("");
  });
  _0x4ebd42.on("paste", function (_0x38760b) {
    const _0x28945e = _0x38760b.originalEvent.clipboardData || window.clipboardData;
    if (!_0x28945e) {
      return;
    }
    const _0x186dcd = _0x28945e.items;
    if (!_0x186dcd) {
      return;
    }
    let _0x245808 = false;
    for (let _0x834dfb = 0; _0x834dfb < _0x186dcd.length; _0x834dfb++) {
      const _0x170137 = _0x186dcd[_0x834dfb];
      if (_0x170137.type.startsWith("image/")) {
        _0x245808 = true;
        _0x38760b.preventDefault();
        const _0x1906f9 = _0x170137.getAsFile();
        if (!_0x1906f9) {
          continue;
        }
        const _0x566878 = new FileReader();
        _0x566878.onload = function (_0xb51e78) {
          const _0x20e49a = {
            name: "粘贴图片_" + Date.now() + "." + (_0x1906f9.type.split("/")[1] || "png"),
            type: _0x1906f9.type,
            data: _0xb51e78.target.result
          };
          _0x993641.push(_0x20e49a);
          _0x5c163a();
          toastr?.success("图片已添加");
        };
        _0x566878.readAsDataURL(_0x1906f9);
      }
    }
  });
  function _0x5c163a() {
    _0x7751e5.empty();
    if (_0x993641.length === 0) {
      _0x7751e5.hide();
      return;
    }
    _0x7751e5.show();
    _0x993641.forEach((_0x217a3b, _0xdaeaf) => {
      const _0x208862 = $("\n                <div class=\"st-chatu8-ai-image-preview-item\">\n                    <img src=\"" + _0x217a3b.data + "\" alt=\"" + _0x305c36(_0x217a3b.name) + "\" />\n                    <button class=\"st-chatu8-ai-image-remove\" data-index=\"" + _0xdaeaf + "\" title=\"移除图片\">\n                        <i class=\"fa-solid fa-times\"></i>\n                    </button>\n                </div>\n            ");
      _0x208862.find(".st-chatu8-ai-image-remove").on("click", function () {
        const _0x348cef = parseInt($(this).data("index"));
        _0x993641.splice(_0x348cef, 1);
        _0x5c163a();
      });
      _0x7751e5.append(_0x208862);
    });
  }
  function _0x17ab48() {
    _0x993641 = [];
    _0x5c163a();
  }
  let _0x594e18 = null;
  function _0x319b18() {
    const _0x21072e = extension_settings[extensionName]?.chatu8_ai_assistant || {};
    return _0x21072e.auto_execute_commands === true;
  }
  function _0x268afb(_0x5d27a7, _0x3d336b) {
    return {
      messageElement: _0x5d27a7,
      commandContent: _0x3d336b,
      buttonElement: null,
      timestamp: Date.now()
    };
  }
  function _0x203f52() {
    if (_0x594e18 && _0x594e18.buttonElement) {
      _0x594e18.buttonElement.fadeOut(200, function () {
        $(this).remove();
      });
    }
    _0x594e18 = null;
  }
  function _0x4caa31(_0x3ce3da) {
    const _0x255f89 = $("\n            <div class=\"st-chatu8-ai-execute-command-btn\">\n                <button class=\"st-chatu8-ai-btn st-chatu8-ai-execute-btn\">\n                    <i class=\"fa-solid fa-play\"></i> 执行命令\n                </button>\n                <span class=\"st-chatu8-ai-execute-hint\">\n                    或发送新消息取消\n                </span>\n            </div>\n        ");
    _0x3ce3da.after(_0x255f89);
    _0x42f082.scrollTop(_0x42f082[0].scrollHeight);
    return _0x255f89;
  }
  async function _0x13fe65(_0x30cc78) {
    const {
      commandContent: _0x1723bd,
      buttonElement: _0x4de774
    } = _0x30cc78;
    if (!_0x4de774) {
      return;
    }
    const _0x579809 = _0x4de774.find("button");
    _0x579809.prop("disabled", true).removeClass("success error").addClass("loading").html("<i class=\"fa-solid fa-spinner fa-spin\"></i> 执行中...");
    try {
      parseAndApplySettings(_0x1723bd);
      const _0x2d4939 = await _0xf4d490(_0x1723bd);
      _0x579809.removeClass("loading").addClass("success").html("<i class=\"fa-solid fa-check\"></i> 已执行");
      if (_0x2d4939 !== null) {
        if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
          toastr?.error("当前没有活动的对话会话");
          return;
        }
        const _0x3b28d2 = chatSessions.chats[chatSessions.activeChatId];
        const _0x13cfb7 = {
          role: "user",
          content: _0x2d4939
        };
        _0x3b28d2.messages.push(_0x13cfb7);
        _0xce10b4("user", _0x2d4939);
        _0x12aab0 = null;
        _0x1526e1 = null;
        _0x48cc8a();
        if (_0x1526e1) {
          _0x1526e1.html("<i><span style=\"color:var(--st-chatu8-text-secondary);\">已获取最新系统参数，思考中...</span></i>");
        }
        await _0x41e51b();
      }
      setTimeout(() => {
        _0x4de774.fadeOut(300, () => _0x4de774.remove());
      }, 2000);
    } catch (_0x5cf0f6) {
      console.error("[AI Command Execution] 命令执行失败:", _0x5cf0f6);
      _0x579809.removeClass("loading").addClass("error").prop("disabled", false).html("<i class=\"fa-solid fa-times\"></i> 执行失败");
      toastr?.error("命令执行失败: " + _0x5cf0f6.message);
    } finally {
      _0x203f52();
    }
  }
  function _0x48cc8a() {
    const _0x283ff6 = "<img src=\"/scripts/extensions/third-party/st-chatu8/html/settings/智绘姬头像.png\" alt=\"智绘姬\" style=\"width: 100%; height: 100%; object-fit: cover; border-radius: 50%; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;\">";
    const _0x18fc05 = "\n            <div class=\"st-chatu8-ai-msg system-msg\">\n                <div class=\"msg-avatar\">" + _0x283ff6 + "</div>\n                <div class=\"msg-content\"></div>\n            </div>\n        ";
    const _0x50b2c7 = $(_0x18fc05);
    _0x42f082.append(_0x50b2c7);
    _0x42f082.scrollTop(_0x42f082[0].scrollHeight);
    _0x12aab0 = _0x50b2c7;
    _0x1526e1 = _0x50b2c7.find(".msg-content");
  }
  function _0x22e7ec(_0x1a1656) {
    if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
      return;
    }
    const _0x54c444 = chatSessions.chats[chatSessions.activeChatId];
    const _0xa94d1b = _0x54c444.messages[_0x1a1656];
    if (!_0xa94d1b || _0xa94d1b.role !== "user") {
      return;
    }
    let _0x48b321 = "";
    if (Array.isArray(_0xa94d1b.content)) {
      const _0x3005c6 = _0xa94d1b.content.find(_0x58aa60 => _0x58aa60.type === "text");
      _0x48b321 = _0x3005c6 ? _0x3005c6.text : "";
    } else {
      _0x48b321 = _0xa94d1b.content;
    }
    _0x4ebd42.val(_0x48b321);
    _0x59c39b();
    if (_0xa94d1b.images && _0xa94d1b.images.length > 0) {
      _0x993641 = [..._0xa94d1b.images];
      _0x5c163a();
    }
    _0x42f082.find(".st-chatu8-ai-msg").removeClass("editing");
    _0x42f082.find(".st-chatu8-ai-msg[data-msg-index=\"" + _0x1a1656 + "\"]").addClass("editing");
    _0x4ebd42.focus();
    toastr?.info("消息已加载到输入框，修改后发送将替换原消息并重新生成后续对话");
    _0x4ebd42.data("editing-index", _0x1a1656);
  }
  async function _0x344875(_0x341b77) {
    if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
      return;
    }
    const _0x4df630 = chatSessions.chats[chatSessions.activeChatId];
    if (_0x341b77 >= _0x4df630.messages.length) {
      return;
    }
    const _0x5f5009 = "确定要从第 " + (_0x341b77 + 1) + " 条消息继续吗？这将删除该消息之后的所有对话。";
    if (!confirm(_0x5f5009)) {
      return;
    }
    _0x4df630.messages = _0x4df630.messages.slice(0, _0x341b77 + 1);
    _0x4df630.updatedAt = Date.now();
    await saveAiChatHistory(chatSessions);
    _0x3c1212(chatSessions.activeChatId);
    toastr?.success("已从此处继续对话，可以输入新消息了");
  }
  async function _0x340611(_0x417252) {
    if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
      return;
    }
    const _0x542dfe = chatSessions.chats[chatSessions.activeChatId];
    const _0x80d2cf = _0x542dfe.messages[_0x417252];
    if (!_0x80d2cf || _0x80d2cf.role !== "assistant" && _0x80d2cf.role !== "system") {
      return;
    }
    if (!confirm("确定要重新生成这条回复吗？")) {
      return;
    }
    _0x542dfe.messages = _0x542dfe.messages.slice(0, _0x417252);
    _0x542dfe.updatedAt = Date.now();
    await saveAiChatHistory(chatSessions);
    _0x3c1212(chatSessions.activeChatId);
    toastr?.info("正在重新生成回复...");
    await _0x41e51b();
  }
  async function _0x41e51b() {
    if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
      return;
    }
    const _0xfab59a = chatSessions.chats[chatSessions.activeChatId];
    const _0x332cc9 = extension_settings[extensionName]?.chatu8_ai_assistant || {};
    const _0x5cf5d2 = _0x332cc9.api_key;
    if (!_0x5cf5d2) {
      toastr?.error("未配置智绘姬 API Key，请点击齿轮图标设置。");
      return;
    }
    let _0x31b633 = 0;
    const _0x1e28b0 = 10;
    _0x48cc8a();
    const _0x113803 = "ai-assistant-" + Date.now().toString();
    const _0x2e727c = {
      api_url: _0x332cc9.api_url,
      api_key: _0x332cc9.api_key,
      model: _0x332cc9.model,
      bypass_proxy: _0x332cc9.bypass_proxy,
      stream: _0x332cc9.stream,
      temperature: typeof _0x332cc9.temperature === "number" ? _0x332cc9.temperature : 0.8,
      top_p: typeof _0x332cc9.top_p === "number" ? _0x332cc9.top_p : 1,
      max_tokens: typeof _0x332cc9.max_tokens === "number" ? _0x332cc9.max_tokens : 40000
    };
    const _0x2c622b = async () => {
      const _0x87c32 = _0x332cc9.system_prompt_key || defaultSystemPromptKey;
      let _0x122ebf = systemPrompts[_0x87c32]?.prompt || systemPrompts[defaultSystemPromptKey].prompt;
      if (_0x122ebf.includes("{modules}")) {
        const _0x162ea7 = getModuleSummaries();
        _0x122ebf = _0x122ebf.replace("{modules}", "\n" + _0x162ea7 + "\n");
      }
      if (_0x122ebf.includes("{settings}")) {
        const _0x117cb7 = getSettingsContextPrompt();
        _0x122ebf = _0x122ebf.replace("{settings}", "\n" + _0x117cb7 + "\n");
      }
      if (_0x122ebf.includes("{chatu8_code}")) {
        const _0x6bde43 = extension_settings[extensionName];
        const _0x17a0ed = _0x6bde43?.chatu8_code || "未分配";
        _0x122ebf = _0x122ebf.replace(/{chatu8_code}/g, _0x17a0ed);
      }
      const _0x3cce91 = _0xfab59a.messages.map(_0x3985a7 => {
        const _0x1013e4 = _0x3985a7.role === "assistant" || _0x3985a7.role === "system" ? "assistant" : _0x3985a7.role;
        if (Array.isArray(_0x3985a7.content)) {
          const _0x1c3fa4 = {
            role: _0x1013e4,
            content: _0x3985a7.content
          };
          return _0x1c3fa4;
        }
        const _0x5ebc9b = {
          role: _0x1013e4,
          content: _0x3985a7.content
        };
        return _0x5ebc9b;
      });
      const _0x20f76d = {
        role: "system",
        content: _0x122ebf
      };
      const _0x23b5b2 = [_0x20f76d, ..._0x3cce91, {
        role: "system",
        content: "提示:智绘姬，你使用中文为主要语言，你可以操作和修改插件内的任意内容，只是还没读取到相关模块！比如和comfyui相关则必须载入comfyui设置模块！最优先的应该是载入相关提示词模块！而不是急着回答相关疑问和回答我不行。上面是对话历史，智绘姬，你必须使用<think>标签进行思考，判断用户的行为需求，加载相应模块进行回复和操作，你的知识在提示词模块当中。结束思考必须使用</think>来结束思考！继续之前的对话吧！"
      }, {
        role: "assistant",
        content: "<think>\n"
      }];
      const _0x531abf = _0x12d1ea();
      const _0x5d55ec = {
        prompt: _0x23b5b2,
        id: _0x113803
      };
      await executeDefaultLLMRequest(_0x5d55ec, _0x2e727c, _0x531abf.callback, "assistant");
      _0x531abf.flush();
      const _0x586b10 = _0x531abf.getReply();
      console.log("[DEBUG] accumulatedReply length:", _0x586b10.length, "hasCommand:", hasSystemCommand(_0x586b10), "first 200 chars:", _0x586b10.substring(0, 200));
      if (_0x586b10) {
        const _0x36a5ba = hasSystemCommand(_0x586b10);
        const _0x2b238f = _0x319b18();
        if (_0x36a5ba && !_0x2b238f) {
          const _0x3f18d5 = {
            role: "assistant",
            content: _0x586b10
          };
          _0xfab59a.messages.push(_0x3f18d5);
          _0xfab59a.updatedAt = Date.now();
          await saveAiChatHistory(chatSessions);
          _0x594e18 = _0x268afb(_0x12aab0, _0x586b10);
          const _0x510485 = _0x4caa31(_0x12aab0);
          _0x594e18.buttonElement = _0x510485;
          _0x510485.find("button").on("click", async function () {
            await _0x13fe65(_0x594e18);
          });
          _0x12aab0 = null;
          _0x1526e1 = null;
          return;
        }
        parseAndApplySettings(_0x586b10);
        const _0x2c9129 = await _0xf4d490(_0x586b10);
        if (_0x2c9129 !== null) {
          _0x31b633++;
          if (_0x31b633 <= _0x1e28b0) {
            const _0x4d5559 = {
              role: "assistant",
              content: _0x586b10
            };
            _0xfab59a.messages.push(_0x4d5559);
            const _0xf04f5e = {
              role: "user",
              content: _0x2c9129
            };
            _0xfab59a.messages.push(_0xf04f5e);
            _0xce10b4("user", _0x2c9129);
            _0x12aab0 = null;
            _0x1526e1 = null;
            _0x48cc8a();
            if (_0x1526e1) {
              _0x1526e1.html("<i><span style=\"color:var(--st-chatu8-text-secondary);\">已获取最新系统参数，思考中...</span></i>");
            }
            await _0x2c622b();
            return;
          } else if (_0x1526e1) {
            _0x1526e1.html(_0x305c36(_0x586b10 + "\n\n(抱歉，调用系统工具次数已达上限，请换个提问方式)").replace(/\n/g, "<br>"));
          }
        }
        const _0x2821c2 = {
          role: "assistant",
          content: _0x586b10
        };
        _0xfab59a.messages.push(_0x2821c2);
        _0xfab59a.updatedAt = Date.now();
        await saveAiChatHistory(chatSessions);
      }
    };
    try {
      isAiGenerating = true;
      _0x42e9ff();
      await _0x2c622b();
    } catch (_0x220d32) {
      if (_0x1526e1) {
        _0x1526e1.html("<span style=\"color:red\">请求出错: " + _0x305c36(_0x220d32.message) + "</span>");
      }
    } finally {
      _0x12aab0 = null;
      _0x1526e1 = null;
      isAiGenerating = false;
      _0x42e9ff();
    }
  }
  async function _0x2520ad() {
    _0x203f52();
    const _0x68e5f7 = _0x4ebd42.val().trim();
    if (!_0x68e5f7 && _0x993641.length === 0) {
      return;
    }
    const _0x482dcc = _0x4ebd42.data("editing-index");
    const _0x48eaf6 = _0x482dcc !== undefined && _0x482dcc !== null;
    if (_0x48eaf6) {
      _0x4ebd42.removeData("editing-index");
      _0x42f082.find(".st-chatu8-ai-msg").removeClass("editing");
      await _0x4f9c4a(_0x482dcc, _0x68e5f7);
      return;
    }
    const _0x1e7789 = extension_settings[extensionName]?.chatu8_ai_assistant || {};
    const _0x12702b = _0x1e7789.api_key;
    if (!_0x12702b) {
      toastr?.error("未配置智绘姬 API Key，请点击齿轮图标设置。");
      return;
    }
    if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
      _0x5cb9b3();
    }
    const _0x3b2028 = chatSessions.chats[chatSessions.activeChatId];
    let _0x4b36de;
    if (_0x993641.length > 0) {
      _0x4b36de = [{
        type: "text",
        text: _0x68e5f7 || "请分析这些图片"
      }];
      _0x993641.forEach(_0x52297d => {
        const _0x309184 = {
          url: _0x52297d.data
        };
        const _0xdb7e73 = {
          type: "image_url",
          image_url: _0x309184
        };
        _0x4b36de.push(_0xdb7e73);
      });
    } else {
      _0x4b36de = _0x68e5f7;
    }
    if (_0x3b2028.messages.length === 0) {
      const _0x479165 = _0x68e5f7 || "图片对话";
      _0x3b2028.title = _0x479165.substring(0, 15) + (_0x479165.length > 15 ? "..." : "");
    }
    const _0x42adc7 = {
      role: "user",
      content: _0x4b36de,
      images: _0x993641.length > 0 ? [..._0x993641] : undefined
    };
    _0x3b2028.messages.push(_0x42adc7);
    const _0x1ac475 = _0x3b2028.messages.length - 1;
    _0xce10b4("user", _0x68e5f7, _0x993641.length > 0 ? [..._0x993641] : null, _0x1ac475);
    _0x4ebd42.val("");
    _0x59c39b();
    _0x3b2028.updatedAt = Date.now();
    await saveAiChatHistory(chatSessions);
    _0x17ab48();
    let _0x4dd73e = 0;
    const _0x591f36 = 10;
    _0x48cc8a();
    const _0x56ef37 = "ai-assistant-" + Date.now().toString();
    const _0x29c38d = {
      api_url: _0x1e7789.api_url,
      api_key: _0x1e7789.api_key,
      model: _0x1e7789.model,
      bypass_proxy: _0x1e7789.bypass_proxy,
      stream: _0x1e7789.stream,
      temperature: typeof _0x1e7789.temperature === "number" ? _0x1e7789.temperature : 0.8,
      top_p: typeof _0x1e7789.top_p === "number" ? _0x1e7789.top_p : 1,
      max_tokens: typeof _0x1e7789.max_tokens === "number" ? _0x1e7789.max_tokens : 40000
    };
    const _0xb6dc25 = async () => {
      const _0x35cb66 = _0x1e7789.system_prompt_key || defaultSystemPromptKey;
      let _0x4b5f67 = systemPrompts[_0x35cb66]?.prompt || systemPrompts[defaultSystemPromptKey].prompt;
      if (_0x4b5f67.includes("{modules}")) {
        const _0x15fc75 = getModuleSummaries();
        _0x4b5f67 = _0x4b5f67.replace("{modules}", "\n" + _0x15fc75 + "\n");
      }
      if (_0x4b5f67.includes("{settings}")) {
        const _0x4fad6c = getSettingsContextPrompt();
        _0x4b5f67 = _0x4b5f67.replace("{settings}", "\n" + _0x4fad6c + "\n");
      }
      if (_0x4b5f67.includes("{chatu8_code}")) {
        const _0xdc39cf = extension_settings[extensionName];
        const _0x3ae851 = _0xdc39cf?.chatu8_code || "未分配";
        _0x4b5f67 = _0x4b5f67.replace(/{chatu8_code}/g, _0x3ae851);
      }
      const _0xc95fb5 = _0x3b2028.messages.map(_0x89726f => {
        const _0x30e59c = _0x89726f.role === "assistant" || _0x89726f.role === "system" ? "assistant" : _0x89726f.role;
        if (Array.isArray(_0x89726f.content)) {
          const _0x2faf07 = {
            role: _0x30e59c,
            content: _0x89726f.content
          };
          return _0x2faf07;
        }
        const _0x1e43e8 = {
          role: _0x30e59c,
          content: _0x89726f.content
        };
        return _0x1e43e8;
      });
      const _0x59284a = {
        role: "system",
        content: _0x4b5f67
      };
      const _0x17d6b8 = [_0x59284a, ..._0xc95fb5, {
        role: "system",
        content: "提示:智绘姬，你使用中文为主要语言，你可以操作和修改插件内的任意内容，只是还没读取到相关模块！比如和comfyui相关则必须载入comfyui设置模块！最优先的应该是载入相关提示词模块！而不是急着回答相关疑问和回答我不行。上面是对话历史，智绘姬，你必须使用<think>标签进行思考，判断用户的行为需求，加载相应模块进行回复和操作，你的知识在提示词模块当中。结束思考必须使用</think>来结束思考！继续之前的对话吧！"
      }, {
        role: "assistant",
        content: "<think>\n"
      }];
      const _0x354436 = _0x12d1ea();
      const _0x32ea9c = {
        prompt: _0x17d6b8,
        id: _0x56ef37
      };
      await executeDefaultLLMRequest(_0x32ea9c, _0x29c38d, _0x354436.callback, "assistant");
      _0x354436.flush();
      const _0x1316fe = _0x354436.getReply();
      console.log("[DEBUG] accumulatedReply length:", _0x1316fe.length, "hasCommand:", hasSystemCommand(_0x1316fe), "first 200 chars:", _0x1316fe.substring(0, 200));
      if (_0x1316fe) {
        const _0x257609 = hasSystemCommand(_0x1316fe);
        const _0x3f77a6 = _0x319b18();
        if (_0x257609 && !_0x3f77a6) {
          const _0x18034a = {
            role: "assistant",
            content: _0x1316fe
          };
          _0x3b2028.messages.push(_0x18034a);
          _0x3b2028.updatedAt = Date.now();
          await saveAiChatHistory(chatSessions);
          _0x594e18 = _0x268afb(_0x12aab0, _0x1316fe);
          const _0x213195 = _0x4caa31(_0x12aab0);
          _0x594e18.buttonElement = _0x213195;
          _0x213195.find("button").on("click", async function () {
            await _0x13fe65(_0x594e18);
          });
          _0x12aab0 = null;
          _0x1526e1 = null;
          return;
        }
        parseAndApplySettings(_0x1316fe);
        const _0x1fa19e = await _0xf4d490(_0x1316fe);
        if (_0x1fa19e !== null) {
          _0x4dd73e++;
          if (_0x4dd73e <= _0x591f36) {
            const _0x4a0557 = {
              role: "assistant",
              content: _0x1316fe
            };
            _0x3b2028.messages.push(_0x4a0557);
            const _0x235281 = {
              role: "user",
              content: _0x1fa19e
            };
            _0x3b2028.messages.push(_0x235281);
            _0xce10b4("user", _0x1fa19e);
            _0x12aab0 = null;
            _0x1526e1 = null;
            _0x48cc8a();
            if (_0x1526e1) {
              _0x1526e1.html("<i><span style=\"color:var(--st-chatu8-text-secondary);\">已获取最新系统参数，思考中...</span></i>");
            }
            console.log("[AI Assistant] 发生内部系统调用, 重定向二次查询...", _0x1fa19e);
            await _0xb6dc25();
            return;
          } else {
            _0x1316fe += "\n\n(抱歉，调用系统工具次数已达上限，请换个提问方式)";
            _0x1526e1.html(_0x305c36(_0x1316fe).replace(/\\n/g, "<br>"));
          }
        }
        const _0x4b58c0 = {
          role: "assistant",
          content: _0x1316fe
        };
        _0x3b2028.messages.push(_0x4b58c0);
        _0x3b2028.updatedAt = Date.now();
        await saveAiChatHistory(chatSessions);
        if (_0x12aab0) {
          _0x3253ad(_0x12aab0, _0x1316fe);
        }
      }
    };
    try {
      isAiGenerating = true;
      _0x42e9ff();
      await _0xb6dc25();
    } catch (_0x45a1e6) {
      _0x1526e1.html("<span style=\"color:red\">请求出错: " + _0x305c36(_0x45a1e6.message) + "</span>");
    } finally {
      _0x12aab0 = null;
      _0x1526e1 = null;
      isAiGenerating = false;
      _0x42e9ff();
    }
  }
  _0x4ebd42.on("keydown", function (_0x1903cd) {
    if (_0x1903cd.key === "Enter" && !_0x1903cd.shiftKey) {
      _0x1903cd.preventDefault();
      _0x2520ad();
    }
  });
  _0x4ebd42.on("input", _0x59c39b);
  function _0x59c39b() {
    _0x4ebd42[0].style.height = "auto";
    const _0x2270e5 = Math.min(_0x4ebd42[0].scrollHeight, 100);
    _0x4ebd42[0].style.height = _0x2270e5 + "px";
  }
  _0xdc2ea6.on("click", function () {
    if (isAiGenerating) {
      abortLLMChannelRequest("assistant");
    } else {
      _0x2520ad();
    }
  });
  function _0xce10b4(_0x533d39, _0x523e92, _0x1fe463 = null, _0x21c30a = null) {
    const _0x4171db = _0x533d39 === "system" || _0x533d39 === "assistant" ? "<img src=\"/scripts/extensions/third-party/st-chatu8/html/settings/智绘姬头像.png\" alt=\"智绘姬\" style=\"width: 100%; height: 100%; object-fit: cover; border-radius: 50%; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;\">" : "<i class=\"fa-solid fa-user\"></i>";
    const _0x3fa57a = _0x533d39 === "system" || _0x533d39 === "assistant" ? "system-msg" : "user-msg";
    let _0x4ecccc = "";
    if (_0x1fe463 && _0x1fe463.length > 0) {
      _0x4ecccc += "<div class=\"st-chatu8-ai-message-images\">";
      _0x1fe463.forEach(_0x574982 => {
        _0x4ecccc += "<img src=\"" + _0x574982.data + "\" alt=\"" + _0x305c36(_0x574982.name) + "\" class=\"st-chatu8-ai-message-image\" style=\"cursor: zoom-in;\" data-fullscreen-url=\"" + _0x574982.data + "\" />";
      });
      _0x4ecccc += "</div>";
    }
    if (_0x533d39 === "assistant" && typeof _0x523e92 === "string") {
      const _0x4c9a9f = parseThinkingContent(_0x523e92);
      if (_0x4c9a9f.hasThinking) {
        _0x4c9a9f.thinkingBlocks.forEach(_0x38be20 => {
          _0x4ecccc += _0x39a917(_0x38be20.content);
        });
        _0x523e92 = _0x4c9a9f.cleanedText;
      }
    }
    if (_0x533d39 === "user" && typeof _0x523e92 === "string" && (_0x523e92.includes("【系统自动回复检索】") || _0x523e92.includes("【系统自动回复"))) {
      const _0x4dcc5d = "🔧 内部工具查询与执行结果 (点击展开)";
      _0x4ecccc += "\n                <details class=\"st-chatu8-ai-query-details\">\n                    <summary class=\"st-chatu8-ai-query-summary\"><i class=\"fa-solid fa-code\" style=\"margin-right: 5px;\"></i> " + _0x4dcc5d + "</summary>\n                    <pre class=\"st-chatu8-ai-query-content\">" + _0x305c36(_0x523e92) + "</pre>\n                </details>\n            ";
    } else if (_0x533d39 === "assistant" && typeof _0x523e92 === "string") {
      const _0x4048ca = _0x523e92.match(/<SystemQuery>([\s\S]*?)<\/SystemQuery>/gi);
      const _0x24e7e0 = _0x523e92.match(/<UpdateSettings>([\s\S]*?)<\/UpdateSettings>/gi);
      if (_0x4048ca || _0x24e7e0) {
        let _0x1a9878 = "<i><span style=\"color:var(--st-chatu8-text-secondary);\">智绘姬调用了内部工具...</span></i>\n";
        let _0x1c8c15 = "";
        if (_0x4048ca) {
          _0x1c8c15 += _0x4048ca.join("\n");
        }
        if (_0x24e7e0) {
          _0x1c8c15 += _0x24e7e0.join("\n");
        }
        _0x1a9878 += "\n                    <details class=\"st-chatu8-ai-query-details\">\n                        <summary class=\"st-chatu8-ai-query-summary\"><i class=\"fa-solid fa-microchip\" style=\"margin-right:5px\"></i> 执行内部命令</summary>\n                        <pre class=\"st-chatu8-ai-query-content\">" + _0x305c36(_0x1c8c15) + "</pre>\n                    </details>\n                ";
        let _0x5a31d = _0x523e92.replace(/<SystemQuery>[\s\S]*?<\/SystemQuery>/gi, "").replace(/<UpdateSettings>[\s\S]*?<\/UpdateSettings>/gi, "").trim();
        if (_0x5a31d) {
          _0x1a9878 = _0x4373b0(_0x5a31d) + "<br><br>" + _0x1a9878;
        }
        _0x4ecccc += _0x1a9878;
      } else {
        _0x4ecccc += _0x4373b0(_0x523e92);
      }
    } else {
      _0x4ecccc += _0x305c36(_0x523e92).replace(/\n/g, "<br>");
    }
    let _0x22d731 = "";
    if (_0x533d39 === "user" && _0x21c30a !== null) {
      _0x22d731 = "\n                <div class=\"st-chatu8-ai-msg-actions\">\n                    <button class=\"st-chatu8-ai-msg-edit\" data-index=\"" + _0x21c30a + "\" title=\"编辑此消息\">\n                        <i class=\"fa-solid fa-pen\"></i>\n                    </button>\n                    <button class=\"st-chatu8-ai-msg-continue\" data-index=\"" + _0x21c30a + "\" title=\"从此处继续对话\">\n                        <i class=\"fa-solid fa-play\"></i>\n                    </button>\n                </div>\n            ";
    } else if ((_0x533d39 === "assistant" || _0x533d39 === "system") && _0x21c30a !== null) {
      _0x22d731 = "\n                <div class=\"st-chatu8-ai-msg-actions\">\n                    <button class=\"st-chatu8-ai-msg-regenerate\" data-index=\"" + _0x21c30a + "\" title=\"重新生成此回复\">\n                        <i class=\"fa-solid fa-rotate-right\"></i>\n                    </button>\n                </div>\n            ";
    }
    const _0x41000f = "\n            <div class=\"st-chatu8-ai-msg " + _0x3fa57a + "\" data-msg-index=\"" + (_0x21c30a !== null ? _0x21c30a : "") + "\">\n                <div class=\"msg-avatar\">" + _0x4171db + "</div>\n                <div class=\"msg-content\">" + _0x4ecccc + "</div>\n                " + _0x22d731 + "\n            </div>\n        ";
    const _0x4b34bd = $(_0x41000f);
    _0x42f082.append(_0x4b34bd);
    _0x4b34bd.find(".st-chatu8-ai-message-image").on("click", function () {
      const _0x37625c = $(this).attr("data-fullscreen-url") || $(this).attr("src");
      _0xa09a36(_0x37625c);
    });
    if (_0x533d39 === "user" && _0x21c30a !== null) {
      _0x4b34bd.find(".st-chatu8-ai-msg-edit").on("click", function () {
        _0x22e7ec(_0x21c30a);
      });
      _0x4b34bd.find(".st-chatu8-ai-msg-continue").on("click", function () {
        _0x344875(_0x21c30a);
      });
    } else if ((_0x533d39 === "assistant" || _0x533d39 === "system") && _0x21c30a !== null) {
      _0x4b34bd.find(".st-chatu8-ai-msg-regenerate").on("click", function () {
        _0x340611(_0x21c30a);
      });
    }
    _0x42f082.scrollTop(_0x42f082[0].scrollHeight);
  }
  function _0xa09a36(_0x3fb3ad) {
    const _0x259269 = $("\n            <div class=\"st-chatu8-ai-image-fullscreen-overlay\" style=\"\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100vw;\n                height: 100vh;\n                background: rgba(0, 0, 0, 0.95);\n                z-index: 99999;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                cursor: zoom-out;\n                animation: fadeIn 0.2s ease;\n            \">\n                <img src=\"" + _0x3fb3ad + "\" style=\"\n                    max-width: 95vw;\n                    max-height: 95vh;\n                    object-fit: contain;\n                    border-radius: 8px;\n                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n                    animation: zoomIn 0.3s ease;\n                \" />\n                <div style=\"\n                    position: absolute;\n                    top: 20px;\n                    right: 20px;\n                    color: white;\n                    font-size: 32px;\n                    cursor: pointer;\n                    background: rgba(0, 0, 0, 0.5);\n                    width: 48px;\n                    height: 48px;\n                    border-radius: 50%;\n                    display: flex;\n                    align-items: center;\n                    justify-content: center;\n                    transition: background 0.2s;\n                \" class=\"st-chatu8-ai-fullscreen-close\">\n                    <i class=\"fa-solid fa-times\"></i>\n                </div>\n            </div>\n        ");
    if (!$("#st-chatu8-ai-fullscreen-styles").length) {
      $("head").append("\n                <style id=\"st-chatu8-ai-fullscreen-styles\">\n                    @keyframes fadeIn {\n                        from { opacity: 0; }\n                        to { opacity: 1; }\n                    }\n                    @keyframes zoomIn {\n                        from { transform: scale(0.8); opacity: 0; }\n                        to { transform: scale(1); opacity: 1; }\n                    }\n                    .st-chatu8-ai-fullscreen-close:hover {\n                        background: rgba(255, 255, 255, 0.2) !important;\n                    }\n                </style>\n            ");
    }
    _0x259269.on("click", function (_0x14bc25) {
      if (_0x14bc25.target === this || $(_0x14bc25.target).closest(".st-chatu8-ai-fullscreen-close").length) {
        _0x259269.fadeOut(200, () => _0x259269.remove());
      }
    });
    $(document).on("keydown.fullscreen", function (_0x4d4159) {
      if (_0x4d4159.key === "Escape") {
        _0x259269.fadeOut(200, () => _0x259269.remove());
        $(document).off("keydown.fullscreen");
      }
    });
    $("body").append(_0x259269);
  }
  function _0x305c36(_0x3e0449) {
    if (!_0x3e0449) {
      return "";
    }
    return String(_0x3e0449).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function _0xb42ae6(_0x42c0d5) {
    if (!_0x42c0d5) {
      return "";
    }
    return _0x305c36(_0x42c0d5).replace(/\n/g, "<br>");
  }
  function _0x4373b0(_0x338fc5) {
    if (!_0x338fc5) {
      return "";
    }
    if (markedLoaded && window.marked) {
      try {
        const _0x45b15e = window.marked.parse(_0x338fc5);
        const _0xda54ee = document.createElement("div");
        _0xda54ee.innerHTML = _0x45b15e;
        const _0x3b4039 = _0xda54ee.querySelectorAll("a");
        _0x3b4039.forEach(_0x18c0d8 => {
          _0x18c0d8.setAttribute("target", "_blank");
          _0x18c0d8.setAttribute("rel", "noopener noreferrer");
        });
        return _0xda54ee.innerHTML;
      } catch (_0x9789bf) {
        console.warn("[AI Assistant] Markdown 解析失败，使用纯文本显示", _0x9789bf);
        return _0x305c36(_0x338fc5).replace(/\n/g, "<br>");
      }
    }
    return _0x305c36(_0x338fc5).replace(/\n/g, "<br>");
  }
  function _0x39a917(_0x7f1115) {
    const _0x3b1435 = _0x305c36(_0x7f1115);
    return "\n            <details class=\"st-chatu8-ai-thinking-panel\">\n                <summary class=\"st-chatu8-ai-thinking-summary\">\n                    <span class=\"thinking-icon\">💭</span>\n                    <span class=\"thinking-label\">智绘姬的思考过程</span>\n                    <span class=\"thinking-toggle\">▼</span>\n                </summary>\n                <div class=\"st-chatu8-ai-thinking-content\">\n                    " + _0x3b1435 + "\n                </div>\n            </details>\n        ";
  }
  async function _0x4f9c4a(_0x1e0481, _0x5196e9) {
    if (!chatSessions.activeChatId || !chatSessions.chats[chatSessions.activeChatId]) {
      return;
    }
    const _0x17e092 = chatSessions.chats[chatSessions.activeChatId];
    const _0x4bdbf5 = extension_settings[extensionName]?.chatu8_ai_assistant || {};
    let _0xf0440d;
    if (_0x993641.length > 0) {
      _0xf0440d = [{
        type: "text",
        text: _0x5196e9 || "请分析这些图片"
      }];
      _0x993641.forEach(_0xb97911 => {
        const _0x5c9b65 = {
          url: _0xb97911.data
        };
        const _0x34e097 = {
          type: "image_url",
          image_url: _0x5c9b65
        };
        _0xf0440d.push(_0x34e097);
      });
    } else {
      _0xf0440d = _0x5196e9;
    }
    const _0x1edcd3 = {
      role: "user",
      content: _0xf0440d,
      images: _0x993641.length > 0 ? [..._0x993641] : undefined
    };
    _0x17e092.messages[_0x1e0481] = _0x1edcd3;
    _0x17e092.messages = _0x17e092.messages.slice(0, _0x1e0481 + 1);
    _0x17e092.updatedAt = Date.now();
    await saveAiChatHistory(chatSessions);
    _0x3c1212(chatSessions.activeChatId);
    _0x4ebd42.val("");
    _0x59c39b();
    _0x17ab48();
    _0x48cc8a();
    const _0x2a051b = "ai-assistant-" + Date.now().toString();
    const _0x47add1 = {
      api_url: _0x4bdbf5.api_url,
      api_key: _0x4bdbf5.api_key,
      model: _0x4bdbf5.model,
      bypass_proxy: _0x4bdbf5.bypass_proxy,
      stream: _0x4bdbf5.stream,
      temperature: typeof _0x4bdbf5.temperature === "number" ? _0x4bdbf5.temperature : 0.8,
      top_p: typeof _0x4bdbf5.top_p === "number" ? _0x4bdbf5.top_p : 1,
      max_tokens: typeof _0x4bdbf5.max_tokens === "number" ? _0x4bdbf5.max_tokens : 40000
    };
    let _0x5adcc4 = 0;
    const _0x592ded = 10;
    const _0x4412f4 = async () => {
      const _0x347fcc = _0x4bdbf5.system_prompt_key || defaultSystemPromptKey;
      let _0xadfcd2 = systemPrompts[_0x347fcc]?.prompt || systemPrompts[defaultSystemPromptKey].prompt;
      if (_0xadfcd2.includes("{modules}")) {
        const _0x3f21d8 = getModuleSummaries();
        _0xadfcd2 = _0xadfcd2.replace("{modules}", "\n" + _0x3f21d8 + "\n");
      }
      if (_0xadfcd2.includes("{settings}")) {
        const _0xc8ea29 = getSettingsContextPrompt();
        _0xadfcd2 = _0xadfcd2.replace("{settings}", "\n" + _0xc8ea29 + "\n");
      }
      if (_0xadfcd2.includes("{chatu8_code}")) {
        const _0x680108 = extension_settings[extensionName];
        const _0x4fe632 = _0x680108?.chatu8_code || "未分配";
        _0xadfcd2 = _0xadfcd2.replace(/{chatu8_code}/g, _0x4fe632);
      }
      const _0x3cb093 = _0x17e092.messages.map(_0x164aeb => {
        const _0x5c007d = _0x164aeb.role === "assistant" || _0x164aeb.role === "system" ? "assistant" : _0x164aeb.role;
        if (Array.isArray(_0x164aeb.content)) {
          const _0x4cab46 = {
            role: _0x5c007d,
            content: _0x164aeb.content
          };
          return _0x4cab46;
        }
        const _0x131560 = {
          role: _0x5c007d,
          content: _0x164aeb.content
        };
        return _0x131560;
      });
      const _0x428f8f = {
        role: "system",
        content: _0xadfcd2
      };
      const _0x4ed43d = [_0x428f8f, ..._0x3cb093, {
        role: "system",
        content: "智绘姬，你使用中文为主要语言，你可以操作和修改插件内的任意内容，只是还没读取到相关模块！比如和comfyui相关则必须载入comfyui设置模块！最优先的应该是载入相关提示词模块！而不是急着回答相关疑问和回答我不行。上面是对话历史，智绘姬，你必须使用<think>标签进行思考，判断用户的行为需求，加载相应模块进行回复和操作，你的知识在提示词模块当中。结束思考必须使用</think>来结束思考！"
      }, {
        role: "assistant",
        content: "<think>\n"
      }];
      const _0xa5d984 = _0x12d1ea();
      const _0x4c3a19 = {
        prompt: _0x4ed43d,
        id: _0x2a051b
      };
      await executeDefaultLLMRequest(_0x4c3a19, _0x47add1, _0xa5d984.callback, "assistant");
      _0xa5d984.flush();
      const _0x22c380 = _0xa5d984.getReply();
      console.log("[DEBUG] accumulatedReply length:", _0x22c380.length, "hasCommand:", hasSystemCommand(_0x22c380), "first 200 chars:", _0x22c380.substring(0, 200));
      if (_0x22c380) {
        const _0xd7473d = hasSystemCommand(_0x22c380);
        const _0x92df7d = _0x319b18();
        if (_0xd7473d && !_0x92df7d) {
          const _0x4df882 = {
            role: "assistant",
            content: _0x22c380
          };
          _0x17e092.messages.push(_0x4df882);
          _0x17e092.updatedAt = Date.now();
          await saveAiChatHistory(chatSessions);
          _0x594e18 = _0x268afb(_0x12aab0, _0x22c380);
          const _0xd9e815 = _0x4caa31(_0x12aab0);
          _0x594e18.buttonElement = _0xd9e815;
          _0xd9e815.find("button").on("click", async function () {
            await _0x13fe65(_0x594e18);
          });
          _0x12aab0 = null;
          _0x1526e1 = null;
          return;
        }
        parseAndApplySettings(_0x22c380);
        const _0x41b38e = await _0xf4d490(_0x22c380);
        if (_0x41b38e !== null) {
          _0x5adcc4++;
          if (_0x5adcc4 <= _0x592ded) {
            const _0x40c7cb = {
              role: "assistant",
              content: _0x22c380
            };
            _0x17e092.messages.push(_0x40c7cb);
            const _0x2269c5 = {
              role: "user",
              content: _0x41b38e
            };
            _0x17e092.messages.push(_0x2269c5);
            _0xce10b4("user", _0x41b38e);
            _0x12aab0 = null;
            _0x1526e1 = null;
            _0x48cc8a();
            if (_0x1526e1) {
              _0x1526e1.html("<i><span style=\"color:var(--st-chatu8-text-secondary);\">已获取最新系统参数，思考中...</span></i>");
            }
            await _0x4412f4();
            return;
          } else {
            _0x22c380 += "\n\n(抱歉，调用系统工具次数已达上限，请换个提问方式)";
            _0x1526e1.html(_0x305c36(_0x22c380).replace(/\\n/g, "<br>"));
          }
        }
        const _0x3b2f6d = {
          role: "assistant",
          content: _0x22c380
        };
        _0x17e092.messages.push(_0x3b2f6d);
        _0x17e092.updatedAt = Date.now();
        await saveAiChatHistory(chatSessions);
      }
    };
    try {
      isAiGenerating = true;
      _0x42e9ff();
      await _0x4412f4();
    } catch (_0x320510) {
      if (_0x1526e1) {
        _0x1526e1.html("<span style=\"color:red\">请求出错: " + _0x305c36(_0x320510.message) + "</span>");
      }
    } finally {
      _0x12aab0 = null;
      _0x1526e1 = null;
      isAiGenerating = false;
      _0x42e9ff();
    }
  }
  function _0x315948(_0x892255) {
    return "\n            <div class=\"st-chatu8-ai-thinking-indicator\">\n                <span class=\"thinking-icon\">💭</span>\n                <span class=\"thinking-label\">思考中</span>\n                <span class=\"thinking-dots\">\n                    <span class=\"dot\"></span>\n                    <span class=\"dot\"></span>\n                    <span class=\"dot\"></span>\n                </span>\n            </div>\n        ";
  }
}