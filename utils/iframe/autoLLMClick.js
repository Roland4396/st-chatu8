import { eventSource, event_types } from "../../../../../../script.js";
import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
import { getContext } from "../../../../../st-context.js";
import { handlePromptRequest } from "../promptReq.js";
import { debugLog, debugBranch, debugTimer, debugStartSession, debugContent, debugElement, debugMilestone } from "../debugLogger.js";
let autoLLMClickTimer = null;
window.autoLLMClick = false;
let generationStartChatLength = 0;
let generationStartSwipesLength = 0;
function isPluginEnabled() {
  const _0x583497 = extension_settings[extensionName]?.scriptEnabled;
  const _0x11599c = _0x583497 === true || _0x583497 === "true";
  const _0x477fce = {
    scriptEnabled: _0x583497,
    结果: _0x11599c
  };
  debugLog("autoLLMClick.isPluginEnabled", "检查插件是否启用", _0x477fce);
  return _0x11599c;
}
function isAutoLLMEnabled() {
  if (!isPluginEnabled()) {
    debugBranch("autoLLMClick.isAutoLLMEnabled", "插件未启用", true, {
      条件: "isPluginEnabled()"
    });
    return false;
  }
  const _0x2c235a = extension_settings[extensionName]?.autoLLMImageGen;
  const _0x1c790d = _0x2c235a === true || _0x2c235a === "true";
  const _0x592866 = {
    autoLLMImageGen: _0x2c235a,
    结果: _0x1c790d
  };
  debugLog("autoLLMClick.isAutoLLMEnabled", "检查自动LLM生图是否启用", _0x592866);
  return _0x1c790d;
}
async function findElement(_0x84b961) {
  const _0x4f442a = debugTimer("autoLLMClick.findElement", "查找目标元素");
  await new Promise(_0x18c2b5 => setTimeout(_0x18c2b5, 1000));
  const _0x1fe8ad = document.querySelector("div.mes[mesid=\"" + _0x84b961 + "\"] .mes_text");
  if (_0x1fe8ad) {
    console.log("[st-chatu8] Found real mes_text element for messageId:", _0x84b961);
    const _0x243744 = {
      messageId: _0x84b961
    };
    debugBranch("autoLLMClick.findElement", "找到真实DOM元素", true, _0x243744);
    debugElement("autoLLMClick.findElement", "真实mes_text元素", _0x1fe8ad);
    _0x4f442a.end("找到真实元素");
    return _0x1fe8ad;
  }
  console.log("[st-chatu8] Real mes_text not found for messageId:", _0x84b961);
  const _0x5d094d = {
    messageId: _0x84b961
  };
  debugBranch("autoLLMClick.findElement", "未找到DOM元素", false, _0x5d094d);
  _0x4f442a.end("未找到元素");
  return null;
}
function activateAutoLLMClick() {
  debugLog("autoLLMClick.activateAutoLLMClick", "尝试激活自动LLM点击状态");
  if (!isAutoLLMEnabled()) {
    debugBranch("autoLLMClick.activateAutoLLMClick", "自动LLM未启用-跳过激活", true);
    return;
  }
  window.autoLLMClick = true;
  debugLog("autoLLMClick.activateAutoLLMClick", "已设置 window.autoLLMClick = true");
  if (autoLLMClickTimer) {
    clearTimeout(autoLLMClickTimer);
    debugLog("autoLLMClick.activateAutoLLMClick", "清除之前的定时器");
  }
  autoLLMClickTimer = setTimeout(() => {
    window.autoLLMClick = false;
    autoLLMClickTimer = null;
    debugLog("autoLLMClick.activateAutoLLMClick", "5秒超时 - 自动关闭 autoLLMClick");
  }, 8000);
  debugMilestone("autoLLMClick.activateAutoLLMClick", "自动LLM点击状态已激活，5秒后自动关闭");
}
eventSource.on(event_types.GENERATION_STARTED, _0x7cbae5 => {
  console.log("[st-chatu8] GENERATION_STARTED data:", _0x7cbae5);
  debugStartSession("自动LLM图片生成");
  const _0xbebb3 = {
    eventData: _0x7cbae5
  };
  debugLog("autoLLMClick.GENERATION_STARTED", "LLM生成开始事件触发", _0xbebb3);
  const _0x1a4860 = getContext();
  const _0x206c9f = _0x1a4860?.chat;
  if (_0x206c9f && _0x206c9f.length > 0) {
    generationStartChatLength = _0x206c9f.length;
    const _0x32b676 = _0x206c9f[generationStartChatLength - 1];
    generationStartSwipesLength = _0x32b676?.swipes?.length || 0;
    console.log("[st-chatu8] Chat array length:", generationStartChatLength);
    console.log("[st-chatu8] Last message swipes length:", generationStartSwipesLength);
    const _0x726ebf = {
      chatLength: generationStartChatLength,
      swipesLength: generationStartSwipesLength
    };
    debugLog("autoLLMClick.GENERATION_STARTED", "记录生成开始时的状态", _0x726ebf);
  } else {
    generationStartChatLength = 0;
    generationStartSwipesLength = 0;
    console.log("[st-chatu8] Chat array is empty or not available");
    const _0x4797f6 = {
      chatExists: !!_0x206c9f,
      chatLength: _0x206c9f?.length
    };
    debugBranch("autoLLMClick.GENERATION_STARTED", "Chat为空", true, _0x4797f6);
  }
});
eventSource.on(event_types.GENERATION_ENDED, async _0x1b72bb => {
  const _0x24b6a7 = debugTimer("autoLLMClick.GENERATION_ENDED", "处理LLM生成结束事件");
  console.log("[st-chatu8] GENERATION_ENDED data:", _0x1b72bb);
  console.log("[st-chatu8] Start chat length:", generationStartChatLength, "Start swipes length:", generationStartSwipesLength);
  const _0x286a78 = {
    eventData: _0x1b72bb,
    startChatLength: generationStartChatLength,
    startSwipesLength: generationStartSwipesLength
  };
  debugLog("autoLLMClick.GENERATION_ENDED", "LLM生成结束事件触发", _0x286a78);
  const _0x4b2bb3 = getContext();
  const _0x52b129 = _0x4b2bb3?.chat;
  const _0x4f7dda = _0x52b129?.length || 0;
  const _0x461212 = _0x52b129 && _0x52b129.length > 0 ? _0x52b129[_0x52b129.length - 1] : null;
  const _0x98536c = _0x461212?.swipes?.length || 0;
  console.log("[st-chatu8] Current chat length:", _0x4f7dda, "Current swipes length:", _0x98536c);
  const _0x5c1e6b = {
    currentChatLength: _0x4f7dda,
    currentSwipesLength: _0x98536c
  };
  debugLog("autoLLMClick.GENERATION_ENDED", "获取当前状态", _0x5c1e6b);
  const _0x44c30f = _0x4f7dda > generationStartChatLength;
  const _0x350baf = !_0x44c30f && _0x98536c > generationStartSwipesLength;
  console.log("[st-chatu8] Chat increased:", _0x44c30f, "Swipes increased:", _0x350baf);
  debugBranch("autoLLMClick.GENERATION_ENDED", "Chat或Swipes变化检测", _0x44c30f || _0x350baf, {
    isChatIncreased: _0x44c30f,
    isSwipesIncreased: _0x350baf,
    chatDelta: _0x4f7dda - generationStartChatLength,
    swipesDelta: _0x98536c - generationStartSwipesLength
  });
  if (!_0x44c30f && !_0x350baf) {
    console.log("[st-chatu8] No chat or swipes increase detected, skipping");
    debugLog("autoLLMClick.GENERATION_ENDED", "无变化 - 跳过处理", {
      原因: "Chat和Swipes均未增加"
    });
    _0x24b6a7.end("跳过 - 无变化");
    return;
  }
  if (!isAutoLLMEnabled()) {
    console.log("[st-chatu8] autoLLMImageGen is disabled, skipping");
    debugBranch("autoLLMClick.GENERATION_ENDED", "自动LLM生图未启用", true, {
      条件: "isAutoLLMEnabled()"
    });
    _0x24b6a7.end("跳过 - 功能未启用");
    return;
  }
  const _0x2892ac = _0x1b72bb - 1;
  const _0x42c546 = {
    eventData: _0x1b72bb,
    messageId: _0x2892ac
  };
  debugLog("autoLLMClick.GENERATION_ENDED", "计算消息ID", _0x42c546);
  if (_0x2892ac >= 0) {
    const _0x442003 = getContext();
    const _0x509918 = _0x442003?.chat;
    if (_0x509918 && _0x509918[_0x2892ac]) {
      const _0x5ac26d = _0x509918[_0x2892ac].mes;
      console.log("[st-chatu8] Message ID:", _0x2892ac);
      console.log("[st-chatu8] Message content:", _0x5ac26d);
      debugContent("autoLLMClick.GENERATION_ENDED", "消息内容", _0x5ac26d, 300);
      if (!_0x5ac26d || _0x5ac26d.length <= 200) {
        console.log("[st-chatu8] Message content too short (<=200), skipping. Length:", _0x5ac26d?.length || 0);
        const _0x19eb1f = {
          条件: "messageContent.length > 200",
          实际长度: _0x5ac26d?.length || 0,
          要求: "> 200"
        };
        debugBranch("autoLLMClick.GENERATION_ENDED", "消息长度检查", false, _0x19eb1f);
        _0x24b6a7.end("跳过 - 消息过短");
        return;
      }
      const _0x56f557 = {
        消息长度: _0x5ac26d.length
      };
      debugBranch("autoLLMClick.GENERATION_ENDED", "消息长度检查通过", true, _0x56f557);
      if (extension_settings[extensionName]?.insertOriginalText !== "true") {
        extension_settings[extensionName].insertOriginalText = "true";
        console.log("[st-chatu8] Auto-enabled insertOriginalText due to message length > 200");
        debugLog("autoLLMClick.GENERATION_ENDED", "自动启用 insertOriginalText", {
          原因: "消息长度 > 200"
        });
        const _0x5131ab = document.getElementById("insertOriginalText");
        if (_0x5131ab) {
          _0x5131ab.checked = true;
        }
        try {
          const {
            saveSettingsDebounced: _0x449b4a
          } = await import("../../../../../../script.js");
          _0x449b4a();
        } catch (_0x5e82c3) {
          console.warn("[st-chatu8] Failed to save settings:", _0x5e82c3);
        }
      }
      const _0x16bee0 = await findElement(_0x2892ac);
      if (!_0x16bee0) {
        console.log("[st-chatu8] Element not found for messageId:", _0x2892ac, "- skipping");
        const _0x53e7e2 = {
          messageId: _0x2892ac,
          原因: "DOM元素未找到"
        };
        debugBranch("autoLLMClick.GENERATION_ENDED", "元素查找失败", false, _0x53e7e2);
        return;
      }
      console.log("[st-chatu8] Got element for messageId:", _0x2892ac, "isConnected:", _0x16bee0.isConnected);
      debugElement("autoLLMClick.GENERATION_ENDED", "目标元素", _0x16bee0);
      try {
        console.log("[st-chatu8] Triggering handlePromptRequest with gesture1");
        debugMilestone("autoLLMClick.GENERATION_ENDED", "开始触发 handlePromptRequest");
        debugLog("autoLLMClick.GENERATION_ENDED", "调用 handlePromptRequest", {
          gestureId: "gesture1",
          messageId: _0x2892ac,
          elementConnected: _0x16bee0.isConnected
        });
        handlePromptRequest(_0x16bee0, "gesture1");
      } catch (_0x3be16f) {
        console.error("[st-chatu8] handlePromptRequest failed:", _0x3be16f);
        const _0x4381b3 = {
          error: _0x3be16f.message
        };
        debugLog("autoLLMClick.GENERATION_ENDED", "handlePromptRequest 调用失败", _0x4381b3);
      }
    } else {
      console.log("[st-chatu8] No message found for ID:", _0x2892ac);
      debugBranch("autoLLMClick.GENERATION_ENDED", "消息查找", false, {
        messageId: _0x2892ac,
        chatExists: !!_0x509918,
        原因: "消息不存在"
      });
    }
  } else {
    const _0x2ce211 = {
      messageId: _0x2892ac,
      原因: "messageId < 0"
    };
    debugBranch("autoLLMClick.GENERATION_ENDED", "messageId有效性检查", false, _0x2ce211);
  }
  activateAutoLLMClick();
  _0x24b6a7.end("处理完成");
});
eventSource.on("js_generation_ended", async _0x3a3d48 => {
  const _0x40c514 = {
    eventData: _0x3a3d48
  };
  debugLog("autoLLMClick.js_generation_ended", "JS生成结束事件触发", _0x40c514);
  activateAutoLLMClick();
});
export function setAutoLLMClick(_0x2e1292) {
  window.autoLLMClick = _0x2e1292;
}
export function getAutoLLMClick() {
  return window.autoLLMClick;
}
export function initAutoLLMClick() {
  console.log("[st-chatu8] autoLLMClick module initialized");
  debugLog("autoLLMClick.initAutoLLMClick", "autoLLMClick 模块已初始化");
}