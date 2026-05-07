import { eventSource } from "../../../../../script.js";
import { eventNames } from "./config.js";
import { debugLog, debugBranch, debugTimer } from "./debugLogger.js";
export function generateRequestId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export function LLM_GET_PROMPT() {
  return new Promise((_0x1a5fdd, _0x1d74da) => {
    const _0x2af722 = generateRequestId();
    console.log("插图吧：请求获取 LLM 提示词 (ID: " + _0x2af722 + ")");
    const _0x4d6ead = _0x178589 => {
      if (_0x178589.id !== _0x2af722) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_GET_PROMPT_RESPONSE, _0x4d6ead);
      const {
        prompt: _0x312d21
      } = _0x178589;
      console.log("插图吧：已获取 LLM 提示词 (ID: " + _0x2af722 + "):", _0x312d21);
      _0x1a5fdd(_0x312d21);
    };
    eventSource.on(eventNames.LLM_GET_PROMPT_RESPONSE, _0x4d6ead);
    const _0x5daccb = {
      id: _0x2af722
    };
    eventSource.emit(eventNames.LLM_GET_PROMPT_REQUEST, _0x5daccb);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_GET_PROMPT_RESPONSE, _0x4d6ead);
      _0x1d74da(new Error("获取 prompt 超时"));
    }, 10000);
  });
}
export function LLM_IMAGE_GEN_GET_PROMPT() {
  return new Promise((_0x1d8180, _0x1dddc4) => {
    const _0x2d232d = generateRequestId();
    console.log("插图吧：请求获取正文图片生成提示词 (ID: " + _0x2d232d + ")");
    const _0xbac615 = _0x1b00d7 => {
      if (_0x1b00d7.id !== _0x2d232d) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_IMAGE_GEN_GET_PROMPT_RESPONSE, _0xbac615);
      const {
        prompt: _0x55ab4a
      } = _0x1b00d7;
      console.log("插图吧：已获取正文图片生成提示词 (ID: " + _0x2d232d + "):", _0x55ab4a);
      _0x1d8180(_0x55ab4a);
    };
    eventSource.on(eventNames.LLM_IMAGE_GEN_GET_PROMPT_RESPONSE, _0xbac615);
    const _0x4dc416 = {
      id: _0x2d232d
    };
    eventSource.emit(eventNames.LLM_IMAGE_GEN_GET_PROMPT_REQUEST, _0x4dc416);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_IMAGE_GEN_GET_PROMPT_RESPONSE, _0xbac615);
      _0x1dddc4(new Error("获取正文图片生成提示词超时"));
    }, 10000);
  });
}
export function LLM_CHAR_DESIGN_GET_PROMPT() {
  return new Promise((_0x5cc2ac, _0x554e1e) => {
    const _0x2a2b76 = generateRequestId();
    console.log("插图吧：请求获取角色/服装设计提示词 (ID: " + _0x2a2b76 + ")");
    const _0x29f2d3 = _0x37ec08 => {
      if (_0x37ec08.id !== _0x2a2b76) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE, _0x29f2d3);
      const {
        prompt: _0x2828f1
      } = _0x37ec08;
      console.log("插图吧：已获取角色/服装设计提示词 (ID: " + _0x2a2b76 + "):", _0x2828f1);
      _0x5cc2ac(_0x2828f1);
    };
    eventSource.on(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE, _0x29f2d3);
    const _0x1823b3 = {
      id: _0x2a2b76
    };
    eventSource.emit(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_REQUEST, _0x1823b3);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE, _0x29f2d3);
      _0x554e1e(new Error("获取角色/服装设计提示词超时"));
    }, 10000);
  });
}
export function LLM_CHAR_DISPLAY_GET_PROMPT() {
  return new Promise((_0x1c7a25, _0x171da3) => {
    const _0x169655 = generateRequestId();
    console.log("插图吧：请求获取角色/服装展示提示词 (ID: " + _0x169655 + ")");
    const _0x1841c3 = _0x295c7d => {
      if (_0x295c7d.id !== _0x169655) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x1841c3);
      const {
        prompt: _0x3cd803
      } = _0x295c7d;
      console.log("插图吧：已获取角色/服装展示提示词 (ID: " + _0x169655 + "):", _0x3cd803);
      _0x1c7a25(_0x3cd803);
    };
    eventSource.on(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x1841c3);
    const _0x5955cc = {
      id: _0x169655
    };
    eventSource.emit(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_REQUEST, _0x5955cc);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE, _0x1841c3);
      _0x171da3(new Error("获取角色/服装展示提示词超时"));
    }, 10000);
  });
}
export function LLM_CHAR_MODIFY_GET_PROMPT() {
  return new Promise((_0x4d5ea2, _0x2f50ad) => {
    const _0x21dd32 = generateRequestId();
    console.log("插图吧：请求获取角色/服装修改提示词 (ID: " + _0x21dd32 + ")");
    const _0x5d66b8 = _0x106a46 => {
      if (_0x106a46.id !== _0x21dd32) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x5d66b8);
      const {
        prompt: _0x283b10
      } = _0x106a46;
      console.log("插图吧：已获取角色/服装修改提示词 (ID: " + _0x21dd32 + "):", _0x283b10);
      _0x4d5ea2(_0x283b10);
    };
    eventSource.on(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x5d66b8);
    const _0xf2748a = {
      id: _0x21dd32
    };
    eventSource.emit(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_REQUEST, _0xf2748a);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE, _0x5d66b8);
      _0x2f50ad(new Error("获取角色/服装修改提示词超时"));
    }, 10000);
  });
}
export function LLM_TAG_MODIFY_GET_PROMPT() {
  return new Promise((_0x402573, _0x3b0553) => {
    const _0x1816aa = generateRequestId();
    console.log("插图吧：请求获取Tag修改提示词 (ID: " + _0x1816aa + ")");
    const _0x162a54 = _0x4c16e6 => {
      if (_0x4c16e6.id !== _0x1816aa) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_TAG_MODIFY_GET_PROMPT_RESPONSE, _0x162a54);
      const {
        prompt: _0x262f4e
      } = _0x4c16e6;
      console.log("插图吧：已获取Tag修改提示词 (ID: " + _0x1816aa + "):", _0x262f4e);
      _0x402573(_0x262f4e);
    };
    eventSource.on(eventNames.LLM_TAG_MODIFY_GET_PROMPT_RESPONSE, _0x162a54);
    const _0x2ed919 = {
      id: _0x1816aa
    };
    eventSource.emit(eventNames.LLM_TAG_MODIFY_GET_PROMPT_REQUEST, _0x2ed919);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_TAG_MODIFY_GET_PROMPT_RESPONSE, _0x162a54);
      _0x3b0553(new Error("获取Tag修改提示词超时"));
    }, 10000);
  });
}
export function LLM_EXECUTE(_0x39de53, {
  timeoutMs = 180000
} = {}) {
  return new Promise((_0x15f17d, _0x3ac50e) => {
    const _0x2bc929 = generateRequestId();
    console.log("声临其境：请求执行 LLM (ID: " + _0x2bc929 + ")");
    let _0x19ad58 = null;
    const _0x19699d = () => {
      eventSource.removeListener(eventNames.LLM_EXECUTE_RESPONSE, _0x2e7784);
      if (_0x19ad58) {
        clearTimeout(_0x19ad58);
      }
    };
    const _0x2e7784 = _0x502118 => {
      if (_0x502118.id !== _0x2bc929) {
        return;
      }
      _0x19699d();
      console.log("声临其境：已收到 LLM 执行结果 (ID: " + _0x2bc929 + "):", _0x502118);
      if (_0x502118.success) {
        _0x15f17d(_0x502118.result);
      } else if (_0x502118.error && _0x502118.error.name === "AbortError") {
        const _0x32afa8 = new Error(_0x502118.error.message);
        _0x32afa8.name = "AbortError";
        _0x3ac50e(_0x32afa8);
      } else {
        _0x3ac50e(new Error(_0x502118.result));
      }
    };
    eventSource.on(eventNames.LLM_EXECUTE_RESPONSE, _0x2e7784);
    const _0xab49a8 = {
      prompt: _0x39de53,
      id: _0x2bc929
    };
    eventSource.emit(eventNames.LLM_EXECUTE_REQUEST, _0xab49a8);
    _0x19ad58 = setTimeout(() => {
      _0x19699d();
      _0x3ac50e(new Error("LLM 执行超时（" + timeoutMs + "ms）"));
    }, timeoutMs);
  });
}
export function LLM_IMAGE_GEN(_0x4fe3b3, {
  timeoutMs = 180000
} = {}) {
  return new Promise((_0x13768c, _0x162206) => {
    const _0x4e25db = generateRequestId();
    const _0x5d796d = debugTimer("llmRequest.LLM_IMAGE_GEN", "正文图片生成 LLM 请求");
    const _0x110be4 = {
      请求ID: _0x4e25db,
      超时设置: timeoutMs + "ms",
      消息数量: _0x4fe3b3?.length || 0,
      功能说明: "通过事件系统发送LLM图片生成请求"
    };
    debugLog("llmRequest.LLM_IMAGE_GEN", "LLM请求开始", _0x110be4);
    console.log("插图吧：请求正文图片生成 LLM (ID: " + _0x4e25db + ")");
    let _0x1c94bd = null;
    const _0x262a8b = () => {
      eventSource.removeListener(eventNames.LLM_IMAGE_GEN_RESPONSE, _0x424d53);
      if (_0x1c94bd) {
        clearTimeout(_0x1c94bd);
      }
    };
    const _0x424d53 = _0x39fd50 => {
      if (_0x39fd50.id !== _0x4e25db) {
        return;
      }
      _0x262a8b();
      const _0xe7fd9b = {
        请求ID: _0x4e25db,
        成功: _0x39fd50.success,
        测试模式: _0x39fd50.testMode || false,
        结果长度: _0x39fd50.result?.length || 0
      };
      debugLog("llmRequest.LLM_IMAGE_GEN", "LLM响应收到", _0xe7fd9b);
      console.log("插图吧：已收到正文图片生成 LLM 执行结果 (ID: " + _0x4e25db + "):", _0x39fd50);
      if (_0x39fd50.success) {
        debugBranch("LLM_IMAGE_GEN", "成功分支", true);
        if (_0x39fd50.testMode) {
          debugBranch("LLM_IMAGE_GEN", "测试模式响应", true);
          _0x5d796d.end("测试模式成功");
          const _0x57602e = {
            result: _0x39fd50.result,
            testMode: true
          };
          _0x13768c(_0x57602e);
        } else {
          _0x5d796d.end("成功 - 结果长度: " + (_0x39fd50.result?.length || 0));
          const _0x558e1a = {
            result: _0x39fd50.result,
            testMode: false
          };
          _0x13768c(_0x558e1a);
        }
      } else {
        debugBranch("LLM_IMAGE_GEN", "失败分支", true);
        debugLog("llmRequest.LLM_IMAGE_GEN", "LLM请求失败", {
          错误类型: _0x39fd50.error?.name || "Unknown",
          错误消息: _0x39fd50.error?.message || _0x39fd50.result
        });
        _0x5d796d.end("失败");
        if (_0x39fd50.error && _0x39fd50.error.name === "AbortError") {
          debugBranch("LLM_IMAGE_GEN", "请求被中止", true);
          const _0x4c8f25 = new Error(_0x39fd50.error.message);
          _0x4c8f25.name = "AbortError";
          _0x162206(_0x4c8f25);
        } else {
          _0x162206(new Error(_0x39fd50.result));
        }
      }
    };
    eventSource.on(eventNames.LLM_IMAGE_GEN_RESPONSE, _0x424d53);
    const _0xc53eaa = {
      prompt: _0x4fe3b3,
      id: _0x4e25db
    };
    eventSource.emit(eventNames.LLM_IMAGE_GEN_REQUEST, _0xc53eaa);
    const _0x37455e = {
      事件名: eventNames.LLM_IMAGE_GEN_REQUEST
    };
    debugLog("llmRequest.LLM_IMAGE_GEN", "已发送请求事件，等待响应", _0x37455e);
    _0x1c94bd = setTimeout(() => {
      _0x262a8b();
      debugBranch("LLM_IMAGE_GEN", "超时", true);
      const _0x464da9 = {
        超时时间: timeoutMs + "ms"
      };
      debugLog("llmRequest.LLM_IMAGE_GEN", "LLM请求超时", _0x464da9);
      _0x5d796d.end("超时");
      _0x162206(new Error("正文图片生成 LLM 执行超时（" + timeoutMs + "ms）"));
    }, timeoutMs);
  });
}
export function LLM_CHAR_DESIGN(_0x27b927, {
  timeoutMs = 180000
} = {}) {
  return new Promise((_0x58cb84, _0xeb4bd5) => {
    const _0x2b6683 = generateRequestId();
    console.log("插图吧：请求角色/服装设计 LLM (ID: " + _0x2b6683 + ")");
    let _0x1d0447 = null;
    const _0x49b4f8 = () => {
      eventSource.removeListener(eventNames.LLM_CHAR_DESIGN_RESPONSE, _0x5d74cb);
      if (_0x1d0447) {
        clearTimeout(_0x1d0447);
      }
    };
    const _0x5d74cb = _0x391677 => {
      if (_0x391677.id !== _0x2b6683) {
        return;
      }
      _0x49b4f8();
      console.log("插图吧：已收到角色/服装设计 LLM 执行结果 (ID: " + _0x2b6683 + "):", _0x391677);
      if (_0x391677.success) {
        if (_0x391677.testMode) {
          const _0xf09385 = {
            result: _0x391677.result,
            testMode: true
          };
          _0x58cb84(_0xf09385);
        } else {
          const _0x36a02d = {
            result: _0x391677.result,
            testMode: false
          };
          _0x58cb84(_0x36a02d);
        }
      } else if (_0x391677.error && _0x391677.error.name === "AbortError") {
        const _0x58409f = new Error(_0x391677.error.message);
        _0x58409f.name = "AbortError";
        _0xeb4bd5(_0x58409f);
      } else {
        _0xeb4bd5(new Error(_0x391677.result));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_DESIGN_RESPONSE, _0x5d74cb);
    const _0x2093c5 = {
      prompt: _0x27b927,
      id: _0x2b6683
    };
    eventSource.emit(eventNames.LLM_CHAR_DESIGN_REQUEST, _0x2093c5);
    _0x1d0447 = setTimeout(() => {
      _0x49b4f8();
      _0xeb4bd5(new Error("角色/服装设计 LLM 执行超时（" + timeoutMs + "ms）"));
    }, timeoutMs);
  });
}
export function LLM_CHAR_DISPLAY(_0x2dee86, {
  timeoutMs = 180000
} = {}) {
  return new Promise((_0x135476, _0x42b579) => {
    const _0x582ed7 = generateRequestId();
    console.log("插图吧：请求角色/服装展示 LLM (ID: " + _0x582ed7 + ")");
    let _0x2fbbf9 = null;
    const _0x2ec6ce = () => {
      eventSource.removeListener(eventNames.LLM_CHAR_DISPLAY_RESPONSE, _0x23b681);
      if (_0x2fbbf9) {
        clearTimeout(_0x2fbbf9);
      }
    };
    const _0x23b681 = _0xad3c1c => {
      if (_0xad3c1c.id !== _0x582ed7) {
        return;
      }
      _0x2ec6ce();
      console.log("插图吧：已收到角色/服装展示 LLM 执行结果 (ID: " + _0x582ed7 + "):", _0xad3c1c);
      if (_0xad3c1c.success) {
        if (_0xad3c1c.testMode) {
          const _0x1d2fe8 = {
            result: _0xad3c1c.result,
            testMode: true
          };
          _0x135476(_0x1d2fe8);
        } else {
          const _0x52f39e = {
            result: _0xad3c1c.result,
            testMode: false
          };
          _0x135476(_0x52f39e);
        }
      } else if (_0xad3c1c.error && _0xad3c1c.error.name === "AbortError") {
        const _0x229653 = new Error(_0xad3c1c.error.message);
        _0x229653.name = "AbortError";
        _0x42b579(_0x229653);
      } else {
        _0x42b579(new Error(_0xad3c1c.result));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_DISPLAY_RESPONSE, _0x23b681);
    const _0x687a29 = {
      prompt: _0x2dee86,
      id: _0x582ed7
    };
    eventSource.emit(eventNames.LLM_CHAR_DISPLAY_REQUEST, _0x687a29);
    _0x2fbbf9 = setTimeout(() => {
      _0x2ec6ce();
      _0x42b579(new Error("角色/服装展示 LLM 执行超时（" + timeoutMs + "ms）"));
    }, timeoutMs);
  });
}
export function LLM_CHAR_MODIFY(_0x4ce629, {
  timeoutMs = 180000
} = {}) {
  return new Promise((_0x1d57ae, _0x210d88) => {
    const _0x84ec4c = generateRequestId();
    console.log("插图吧：请求角色/服装修改 LLM (ID: " + _0x84ec4c + ")");
    let _0x32b6bc = null;
    const _0x2e624c = () => {
      eventSource.removeListener(eventNames.LLM_CHAR_MODIFY_RESPONSE, _0xd9bcc7);
      if (_0x32b6bc) {
        clearTimeout(_0x32b6bc);
      }
    };
    const _0xd9bcc7 = _0x3d4381 => {
      if (_0x3d4381.id !== _0x84ec4c) {
        return;
      }
      _0x2e624c();
      console.log("插图吧：已收到角色/服装修改 LLM 执行结果 (ID: " + _0x84ec4c + "):", _0x3d4381);
      if (_0x3d4381.success) {
        if (_0x3d4381.testMode) {
          const _0x5d8019 = {
            result: _0x3d4381.result,
            testMode: true
          };
          _0x1d57ae(_0x5d8019);
        } else {
          const _0x1e642d = {
            result: _0x3d4381.result,
            testMode: false
          };
          _0x1d57ae(_0x1e642d);
        }
      } else if (_0x3d4381.error && _0x3d4381.error.name === "AbortError") {
        const _0x42de35 = new Error(_0x3d4381.error.message);
        _0x42de35.name = "AbortError";
        _0x210d88(_0x42de35);
      } else {
        _0x210d88(new Error(_0x3d4381.result));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_MODIFY_RESPONSE, _0xd9bcc7);
    const _0x440f1a = {
      prompt: _0x4ce629,
      id: _0x84ec4c
    };
    eventSource.emit(eventNames.LLM_CHAR_MODIFY_REQUEST, _0x440f1a);
    _0x32b6bc = setTimeout(() => {
      _0x2e624c();
      _0x210d88(new Error("角色/服装修改 LLM 执行超时（" + timeoutMs + "ms）"));
    }, timeoutMs);
  });
}
export function LLM_TAG_MODIFY(_0x4dac2d, {
  timeoutMs = 180000
} = {}) {
  return new Promise((_0x5e9787, _0x5e90c1) => {
    const _0x36c3d3 = generateRequestId();
    console.log("插图吧：请求Tag修改 LLM (ID: " + _0x36c3d3 + ")");
    let _0x2147b5 = null;
    const _0x58f90a = () => {
      eventSource.removeListener(eventNames.LLM_TAG_MODIFY_RESPONSE, _0x13abf5);
      if (_0x2147b5) {
        clearTimeout(_0x2147b5);
      }
    };
    const _0x13abf5 = _0x4edddd => {
      if (_0x4edddd.id !== _0x36c3d3) {
        return;
      }
      _0x58f90a();
      console.log("插图吧：已收到Tag修改 LLM 执行结果 (ID: " + _0x36c3d3 + "):", _0x4edddd);
      if (_0x4edddd.success) {
        if (_0x4edddd.testMode) {
          const _0x3ae39d = {
            result: _0x4edddd.result,
            testMode: true
          };
          _0x5e9787(_0x3ae39d);
        } else {
          const _0x466669 = {
            result: _0x4edddd.result,
            testMode: false
          };
          _0x5e9787(_0x466669);
        }
      } else if (_0x4edddd.error && _0x4edddd.error.name === "AbortError") {
        const _0x327dd8 = new Error(_0x4edddd.error.message);
        _0x327dd8.name = "AbortError";
        _0x5e90c1(_0x327dd8);
      } else {
        _0x5e90c1(new Error(_0x4edddd.result));
      }
    };
    eventSource.on(eventNames.LLM_TAG_MODIFY_RESPONSE, _0x13abf5);
    const _0x464366 = {
      prompt: _0x4dac2d,
      id: _0x36c3d3
    };
    eventSource.emit(eventNames.LLM_TAG_MODIFY_REQUEST, _0x464366);
    _0x2147b5 = setTimeout(() => {
      _0x58f90a();
      _0x5e90c1(new Error("Tag修改 LLM 执行超时（" + timeoutMs + "ms）"));
    }, timeoutMs);
  });
}