import { eventSource } from "../../../../../script.js";
import { eventNames, extensionName } from "./config.js";
import { extension_settings } from "../../../../extensions.js";
import { getContext } from "../../../../st-context.js";
import { getElContext, processWorldBooksWithTrigger } from "./promptReq.js";
import { extractCharacterAndOutfitTags, handleExtractedData } from "./newline_fix.js";
import { generateCharacterListText, generateOutfitEnableListText, generateCommonCharacterListText, getEnabledCharacterImages, getEnabledOutfitImages, getCommonCharacterImages } from "./settings/worldbook.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { isMobileDevice, removeThinkingTags } from "./utils.js";
import { mergeAdjacentMessages, replaceAllPlaceholders } from "./promptProcessor.js";
function showUserDemandPopup() {
  return new Promise(_0x1d7086 => {
    const _0x4c7dbd = isMobileDevice();
    const _0x16c832 = [];
    let _0x394937 = 10;
    let _0x399152 = window.innerHeight - 10;
    if (_0x4c7dbd) {
      const _0x28bf5f = document.querySelector("#top-settings-holder");
      if (_0x28bf5f) {
        const _0xeceaea = _0x28bf5f.getBoundingClientRect();
        _0x394937 = Math.max(10, Math.min(_0xeceaea.bottom + 10, window.innerHeight * 0.5));
      }
      const _0x2ec52b = document.querySelector("#send_form");
      if (_0x2ec52b) {
        const _0x1c2eaf = _0x2ec52b.getBoundingClientRect();
        _0x399152 = Math.max(_0x394937 + 200, Math.min(_0x1c2eaf.top - 10, window.innerHeight - 10));
      }
    }
    const _0x26549c = Math.max(200, _0x399152 - _0x394937);
    const _0x19ef06 = document.createElement("div");
    _0x19ef06.id = "user-demand-overlay";
    _0x19ef06.className = "st-chatu8-popup-overlay";
    const _0x3e7a34 = document.createElement("div");
    _0x3e7a34.className = "st-chatu8-popup-bubble";
    if (_0x4c7dbd) {
      _0x3e7a34.classList.add("mobile");
      _0x3e7a34.style.top = _0x394937 + "px";
      _0x3e7a34.style.maxHeight = _0x26549c + "px";
    }
    const _0x1a79d6 = document.createElement("div");
    _0x1a79d6.textContent = "🎨 输入生成需求";
    _0x1a79d6.className = "st-chatu8-popup-title";
    const _0x56e419 = document.createElement("div");
    _0x56e419.textContent = "请描述您希望生成的角色或服装的具体需求";
    _0x56e419.className = "st-chatu8-popup-hint";
    const _0x4f08c3 = document.createElement("textarea");
    _0x4f08c3.placeholder = "例如：生成一个穿着古风汉服的少女角色，温柔可爱...";
    _0x4f08c3.className = "st-chatu8-popup-textarea";
    const _0x49cb26 = document.createElement("div");
    _0x49cb26.className = "st-chatu8-popup-upload-section";
    const _0x6e9409 = document.createElement("div");
    _0x6e9409.className = "st-chatu8-popup-upload-header";
    const _0x61196e = document.createElement("span");
    _0x61196e.textContent = "📎 参考图片（可选）";
    _0x61196e.className = "st-chatu8-popup-upload-label";
    const _0x33f80d = document.createElement("input");
    _0x33f80d.type = "file";
    _0x33f80d.accept = "image/*";
    _0x33f80d.multiple = true;
    _0x33f80d.style.display = "none";
    const _0x543be8 = document.createElement("button");
    _0x543be8.type = "button";
    _0x543be8.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加图片";
    _0x543be8.className = "st-chatu8-popup-upload-btn";
    _0x543be8.addEventListener("click", () => _0x33f80d.click());
    _0x6e9409.appendChild(_0x61196e);
    _0x6e9409.appendChild(_0x543be8);
    const _0x21f7b7 = document.createElement("div");
    _0x21f7b7.className = "st-chatu8-popup-preview-container";
    const _0x32836f = document.createElement("div");
    _0x32836f.textContent = "点击上方按钮添加参考图片";
    _0x32836f.className = "st-chatu8-popup-empty-hint";
    _0x21f7b7.appendChild(_0x32836f);
    function _0x5b5762() {
      _0x21f7b7.innerHTML = "";
      if (_0x16c832.length === 0) {
        const _0x3c77a8 = document.createElement("div");
        _0x3c77a8.textContent = "点击上方按钮添加参考图片";
        _0x3c77a8.className = "st-chatu8-popup-empty-hint";
        _0x21f7b7.appendChild(_0x3c77a8);
        return;
      }
      _0x16c832.forEach((_0x3697ea, _0x2d04e8) => {
        const _0x5a3ddc = document.createElement("div");
        _0x5a3ddc.className = "st-chatu8-popup-img-item";
        const _0x27d845 = document.createElement("div");
        _0x27d845.className = "st-chatu8-popup-img-wrapper";
        const _0x46e847 = document.createElement("img");
        _0x46e847.src = _0x3697ea.base64;
        const _0x150bc0 = document.createElement("button");
        _0x150bc0.type = "button";
        _0x150bc0.innerHTML = "×";
        _0x150bc0.className = "st-chatu8-popup-img-delete";
        _0x150bc0.addEventListener("click", _0x451ce1 => {
          _0x451ce1.stopPropagation();
          _0x16c832.splice(_0x2d04e8, 1);
          _0x5b5762();
        });
        _0x27d845.appendChild(_0x46e847);
        _0x27d845.appendChild(_0x150bc0);
        const _0x58abee = document.createElement("input");
        _0x58abee.type = "text";
        _0x58abee.placeholder = "图" + (_0x2d04e8 + 1);
        _0x58abee.value = _0x3697ea.name || "";
        _0x58abee.className = "st-chatu8-popup-img-name";
        _0x58abee.addEventListener("input", _0x297f3f => {
          _0x16c832[_0x2d04e8].name = _0x297f3f.target.value;
        });
        _0x5a3ddc.appendChild(_0x27d845);
        _0x5a3ddc.appendChild(_0x58abee);
        _0x21f7b7.appendChild(_0x5a3ddc);
      });
      const _0x184a7c = document.createElement("div");
      _0x184a7c.textContent = "已添加 " + _0x16c832.length + " 张图片";
      _0x184a7c.className = "st-chatu8-popup-img-count";
      _0x21f7b7.appendChild(_0x184a7c);
    }
    _0x33f80d.addEventListener("change", async _0x2003bc => {
      const _0x20a37e = _0x2003bc.target.files;
      if (!_0x20a37e || _0x20a37e.length === 0) {
        return;
      }
      for (const _0x490d8f of _0x20a37e) {
        if (!_0x490d8f.type.startsWith("image/")) {
          continue;
        }
        try {
          const _0x4783c2 = await _0x103930(_0x490d8f);
          const _0x18444f = {
            base64: _0x4783c2,
            name: ""
          };
          _0x16c832.push(_0x18444f);
        } catch (_0x1cebff) {
          console.error("[showUserDemandPopup] Failed to read image:", _0x1cebff);
        }
      }
      _0x5b5762();
      _0x33f80d.value = "";
    });
    function _0x103930(_0x91ae05) {
      return new Promise((_0x457206, _0x5bae02) => {
        const _0x343c94 = new FileReader();
        _0x343c94.onload = () => _0x457206(_0x343c94.result);
        _0x343c94.onerror = _0x5bae02;
        _0x343c94.readAsDataURL(_0x91ae05);
      });
    }
    _0x49cb26.appendChild(_0x6e9409);
    _0x49cb26.appendChild(_0x33f80d);
    _0x49cb26.appendChild(_0x21f7b7);
    const _0x377e9c = document.createElement("div");
    _0x377e9c.className = "st-chatu8-popup-buttons";
    const _0x49243e = document.createElement("button");
    _0x49243e.textContent = "取消";
    _0x49243e.className = "st-chatu8-popup-btn-cancel";
    const _0x140822 = document.createElement("button");
    _0x140822.textContent = "确定生成";
    _0x140822.className = "st-chatu8-popup-btn-confirm";
    const _0x1819b2 = _0x2d11f6 => {
      _0x19ef06.classList.add("closing");
      setTimeout(() => {
        _0x19ef06.remove();
        _0x1d7086(_0x2d11f6);
      }, 150);
    };
    _0x49243e.addEventListener("click", () => _0x1819b2(null));
    _0x140822.addEventListener("click", () => _0x1819b2({
      text: _0x4f08c3.value.trim() || null,
      images: [..._0x16c832]
    }));
    const _0x499af1 = _0x52e881 => {
      if (_0x52e881.key === "Escape") {
        _0x1819b2(null);
        document.removeEventListener("keydown", _0x499af1);
      } else if (_0x52e881.key === "Enter" && _0x52e881.ctrlKey) {
        _0x1819b2({
          text: _0x4f08c3.value.trim() || null,
          images: [..._0x16c832]
        });
        document.removeEventListener("keydown", _0x499af1);
      }
    };
    document.addEventListener("keydown", _0x499af1);
    _0x377e9c.appendChild(_0x49243e);
    _0x377e9c.appendChild(_0x140822);
    _0x3e7a34.appendChild(_0x1a79d6);
    _0x3e7a34.appendChild(_0x56e419);
    _0x3e7a34.appendChild(_0x4f08c3);
    _0x3e7a34.appendChild(_0x49cb26);
    _0x3e7a34.appendChild(_0x377e9c);
    _0x19ef06.appendChild(_0x3e7a34);
    document.body.appendChild(_0x19ef06);
    setTimeout(() => _0x4f08c3.focus(), 100);
  });
}
function replacePlaceholder(_0x4658c2, _0xdcf98c, _0x105664, _0x453bae) {
  if (typeof _0x4658c2 === "string") {
    if (_0x105664 && _0x4658c2.includes(_0xdcf98c)) {
      if (_0x453bae) {
        _0x453bae.add(_0xdcf98c);
      }
    }
    return _0x4658c2.replaceAll(_0xdcf98c, _0x105664);
  }
  if (Array.isArray(_0x4658c2)) {
    return _0x4658c2.map(_0x228ff2 => replacePlaceholder(_0x228ff2, _0xdcf98c, _0x105664, _0x453bae));
  }
  if (_0x4658c2 && typeof _0x4658c2 === "object") {
    const _0x38aafb = {};
    for (const _0x4e96e9 in _0x4658c2) {
      _0x38aafb[_0x4e96e9] = replacePlaceholder(_0x4658c2[_0x4e96e9], _0xdcf98c, _0x105664, _0x453bae);
    }
    return _0x38aafb;
  }
  return _0x4658c2;
}
function attachImagesToMessage(_0x1e8a1c, _0x181858, _0x1e3d20, _0x3d2f3a = "参考图片") {
  if (!_0x1e3d20 || _0x1e3d20.length === 0 || _0x181858 < 0 || _0x181858 >= _0x1e8a1c.length) {
    return _0x1e8a1c;
  }
  const _0x17f454 = [..._0x1e8a1c];
  const _0x21d5b0 = _0x17f454[_0x181858];
  const _0x45e43f = [];
  if (typeof _0x21d5b0.content === "string") {
    const _0x4775b7 = {
      type: "text",
      text: _0x21d5b0.content
    };
    _0x45e43f.push(_0x4775b7);
  } else if (Array.isArray(_0x21d5b0.content)) {
    _0x45e43f.push(..._0x21d5b0.content);
  }
  if (_0x1e3d20.length > 0) {
    const _0x46cd62 = {
      type: "text",
      text: "\n[以下是用户上传的" + _0x1e3d20.length + "张" + _0x3d2f3a + "]"
    };
    _0x45e43f.push(_0x46cd62);
  }
  _0x1e3d20.forEach((_0x10c7ba, _0x531f53) => {
    const _0x1f61f8 = typeof _0x10c7ba === "string" ? _0x10c7ba : _0x10c7ba.base64;
    const _0x978499 = typeof _0x10c7ba === "object" && _0x10c7ba.name ? _0x10c7ba.name : "" + _0x3d2f3a + (_0x531f53 + 1);
    const _0x89174d = {
      type: "text",
      text: "[" + _0x978499 + "]"
    };
    _0x45e43f.push(_0x89174d);
    let _0x578a22 = _0x1f61f8;
    if (!_0x1f61f8.startsWith("data:")) {
      _0x578a22 = "data:image/png;base64," + _0x1f61f8;
    }
    const _0x3d6e19 = {
      type: "image_url",
      image_url: {}
    };
    _0x3d6e19.image_url.url = _0x578a22;
    _0x3d6e19.image_url.detail = "auto";
    _0x45e43f.push(_0x3d6e19);
  });
  const _0x40c19f = {
    ..._0x21d5b0
  };
  _0x40c19f.content = _0x45e43f;
  _0x17f454[_0x181858] = _0x40c19f;
  return _0x17f454;
}
function findMessageIndexWithPlaceholder(_0x223099, _0x792555) {
  for (let _0x58d477 = 0; _0x58d477 < _0x223099.length; _0x58d477++) {
    const _0x376cb8 = _0x223099[_0x58d477];
    if (typeof _0x376cb8.content === "string" && _0x376cb8.content.includes(_0x792555)) {
      return _0x58d477;
    } else if (Array.isArray(_0x376cb8.content)) {
      for (const _0x5b7950 of _0x376cb8.content) {
        if (_0x5b7950.type === "text" && _0x5b7950.text.includes(_0x792555)) {
          return _0x58d477;
        }
      }
    }
  }
  return -1;
}
function generateRequestId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export function LLM_CHAR_DESIGN_GET_PROMPT() {
  return new Promise((_0x3e5292, _0x340680) => {
    const _0x356b1e = generateRequestId();
    console.log("[characterGen] Requesting char design prompt (ID: " + _0x356b1e + ")");
    const _0x585642 = _0x406f7b => {
      if (_0x406f7b.id !== _0x356b1e) {
        return;
      }
      eventSource.removeListener(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE, _0x585642);
      _0x3e5292(_0x406f7b.prompt);
    };
    eventSource.on(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE, _0x585642);
    const _0x544e47 = {
      id: _0x356b1e
    };
    eventSource.emit(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_REQUEST, _0x544e47);
    setTimeout(() => {
      eventSource.removeListener(eventNames.LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE, _0x585642);
      _0x340680(new Error("获取角色设计提示词超时"));
    }, 10000);
  });
}
export function LLM_CHAR_DESIGN(_0x2bf74d, _0xc19f29 = {}) {
  return new Promise((_0x424e52, _0x9383d8) => {
    const _0x186857 = generateRequestId();
    const _0x2a1523 = _0xc19f29.timeoutMs || 60000;
    let _0x5d74c1 = null;
    console.log("[characterGen] Executing char design LLM request (ID: " + _0x186857 + ")");
    const _0xfad36a = () => {
      eventSource.removeListener(eventNames.LLM_CHAR_DESIGN_RESPONSE, _0x1a7a39);
      if (_0x5d74c1) {
        clearTimeout(_0x5d74c1);
        _0x5d74c1 = null;
      }
    };
    const _0x1a7a39 = _0x1f1007 => {
      if (_0x1f1007.id !== _0x186857) {
        return;
      }
      _0xfad36a();
      if (_0x1f1007.success) {
        if (_0x1f1007.testMode) {
          const _0x2018aa = {
            result: _0x1f1007.result,
            testMode: true
          };
          _0x424e52(_0x2018aa);
        } else {
          const _0xd0c3fc = {
            result: _0x1f1007.result,
            testMode: false
          };
          _0x424e52(_0xd0c3fc);
        }
      } else {
        _0x9383d8(new Error(_0x1f1007.result || "LLM 请求失败"));
      }
    };
    eventSource.on(eventNames.LLM_CHAR_DESIGN_RESPONSE, _0x1a7a39);
    const _0x2b815c = {
      prompt: _0x2bf74d,
      id: _0x186857
    };
    eventSource.emit(eventNames.LLM_CHAR_DESIGN_REQUEST, _0x2b815c);
    _0x5d74c1 = setTimeout(() => {
      _0xfad36a();
      _0x9383d8(new Error("角色设计 LLM 请求超时"));
    }, _0x2a1523);
  });
}
export async function handleCharacterDesignRequest(_0x27dfe5) {
  console.log("[characterGen] Starting character design request...");
  try {
    const _0x3f2222 = await showUserDemandPopup();
    if (_0x3f2222 === null) {
      console.log("[characterGen] User cancelled the request");
      toastr.info("已取消角色生成");
      return;
    }
    let _0x379131 = _0x3f2222.text || extension_settings[extensionName]?.defaultCharDemand || "";
    const _0x495f50 = _0x3f2222.images || [];
    console.log("[characterGen] User demand:", _0x379131);
    console.log("[characterGen] User uploaded images count:", _0x495f50.length);
    toastr.info("[characterGen] 正在处理角色/服装设计请求...");
    const _0x3e345e = getContext();
    const _0x2ec173 = (extension_settings[extensionName]?.llm_history_depth ?? 2) + 1;
    const _0x4dc26c = await getElContext(_0x27dfe5, _0x2ec173);
    if (!_0x4dc26c || _0x4dc26c.length === 0) {
      toastr.warning("未能获取上下文内容");
      return;
    }
    console.log("[characterGen] Context elements:", _0x4dc26c);
    const _0x3a4d48 = _0x4dc26c[_0x4dc26c.length - 1];
    let _0x40e983 = "";
    if (_0x4dc26c) {
      const _0x2907e9 = _0x379131 ? [..._0x4dc26c, _0x379131] : _0x4dc26c;
      _0x40e983 = await processWorldBooksWithTrigger(_0x2907e9);
      console.log("[characterGen] Triggered world book content:", _0x40e983);
    }
    const _0x3b55c8 = _0x4dc26c && _0x4dc26c.length > 1 ? _0x4dc26c.slice(0, -1) : [];
    const _0x5b9356 = [];
    if (_0x379131) {
      _0x5b9356.push(_0x379131);
    }
    if (_0x3a4d48) {
      _0x5b9356.push(_0x3a4d48);
    }
    const _0x53f216 = _0x5b9356.join("\n");
    const _0x532f90 = [];
    if (_0x379131) {
      _0x532f90.push(_0x379131);
    }
    if (_0x4dc26c && _0x4dc26c.length > 0) {
      _0x532f90.push(_0x4dc26c.join("\n"));
    }
    if (_0x40e983) {
      _0x532f90.push(_0x40e983);
    }
    const _0x1d099f = _0x532f90.join("\n");
    console.log("[characterGen] Character trigger text:", _0x1d099f);
    let _0x4e5a2b = buildPromptForRequestType("char_design", _0x53f216);
    const _0xc9a760 = generateCharacterListText(_0x1d099f);
    const _0x226af5 = generateOutfitEnableListText();
    const _0xc76a24 = generateCommonCharacterListText();
    console.log("[characterGen] Character list text (triggered):", _0xc9a760);
    const _0x4c280f = _0x3e345e.chatMetadata?.variables || {};
    _0x4e5a2b = mergeAdjacentMessages(_0x4e5a2b);
    console.log("[characterGen] 合并相邻消息后:", _0x4e5a2b);
    const _0x13ea3e = {
      context: _0x3b55c8.join("\n"),
      body: _0x3a4d48,
      worldBookContent: _0x40e983,
      variables: _0x4c280f,
      userDemand: _0x379131 || "",
      characterListText: _0xc9a760,
      outfitEnableListText: _0x226af5,
      commonCharacterListText: _0xc76a24
    };
    const {
      messages: _0x246e77,
      replacedVariables: _0x1eee1a
    } = replaceAllPlaceholders(_0x4e5a2b, _0x13ea3e);
    _0x4e5a2b = _0x246e77;
    function _0x341c7f(_0x278cca) {
      for (let _0x45bc4d = _0x278cca.length - 1; _0x45bc4d >= 0; _0x45bc4d--) {
        if (_0x278cca[_0x45bc4d].role === "user") {
          return _0x45bc4d;
        }
      }
      return -1;
    }
    const _0x15c19a = _0x341c7f(_0x4e5a2b);
    console.log("[characterGen] 找到用户消息索引用于附加图片:", _0x15c19a);
    if (_0x495f50.length > 0 && _0x15c19a >= 0) {
      _0x4e5a2b = attachImagesToMessage(_0x4e5a2b, _0x15c19a, _0x495f50, "参考图片");
      console.log("[characterGen] 已将", _0x495f50.length, "张图片附加到消息索引", _0x15c19a);
    }
    try {
      const _0x12217b = await getEnabledCharacterImages(_0x1d099f);
      const _0x2751cf = await getEnabledOutfitImages();
      const _0x19104f = await getCommonCharacterImages();
      const _0x390ff8 = [..._0x12217b, ..._0x2751cf, ..._0x19104f];
      if (_0x390ff8.length > 0 && _0x15c19a >= 0) {
        _0x4e5a2b = attachImagesToMessage(_0x4e5a2b, _0x15c19a, _0x390ff8, "角色服装参考图片");
        console.log("[characterGen] 已将", _0x390ff8.length, "张角色/服装图片附加到消息索引", _0x15c19a);
      }
    } catch (_0x4e9ed5) {
      console.error("[characterGen] 收集角色/服装图片失败:", _0x4e9ed5);
    }
    console.log("[characterGen] Final prompt:", _0x4e5a2b);
    let _0x397328 = "";
    if (_0x1eee1a.size > 0) {
      _0x397328 = "诊断：检测到以下变量被使用：" + [..._0x1eee1a].join("、") + "\n";
    }
    updateCombinedPrompt(_0x4e5a2b, _0x397328);
    const _0xc61585 = extension_settings[extensionName]?.regexTestMode ?? false;
    if (_0xc61585) {
      toastr.info("🧪 正则测试模式已启用：已停止角色设计 LLM 请求，仅展示最终 Prompt");
      console.log("[characterGen] 正则测试模式 - LLM 请求已跳过");
      return;
    }
    const _0x2416a0 = await LLM_CHAR_DESIGN(_0x4e5a2b, {
      timeoutMs: 300000
    });
    console.log("[characterGen] LLM response:", _0x2416a0);
    if (_0x2416a0.testMode) {
      console.log("[characterGen] 测试模式 - 后续操作已跳过");
      return;
    }
    const _0x2fd25d = _0x2416a0.result;
    if (!_0x2fd25d) {
      toastr.error("LLM 返回结果为空");
      return;
    }
    const _0x1c2629 = removeThinkingTags(_0x2fd25d);
    const _0x36457a = extractCharacterAndOutfitTags(_0x1c2629);
    if (_0x36457a.characters.length === 0 && _0x36457a.outfits.length === 0) {
      toastr.warning("未在 LLM 输出中检测到角色或服装标签");
      console.log("[characterGen] No character/outfit tags found in output");
      console.log("[characterGen] Raw LLM output for debugging:", _0x2fd25d);
      return;
    }
    console.log("[characterGen] Extracted data:", _0x36457a);
    const _0x1cc493 = {};
    for (const _0x509e64 of _0x1eee1a) {
      const _0x41b7eb = _0x509e64.match(/^\{\{getvar::([^}]+)\}\}$/);
      if (_0x41b7eb) {
        const _0x16a054 = _0x41b7eb[1];
        _0x1cc493[_0x16a054] = _0x4c280f[_0x16a054] || "";
      }
    }
    const _0x162156 = {
      generationContext: _0x4dc26c.join("\n"),
      generationWorldBook: _0x40e983,
      generationVariables: _0x1cc493
    };
    await handleExtractedData(_0x36457a, _0x162156);
    toastr.success("角色/服装设计处理完成！");
  } catch (_0x3067ce) {
    console.error("[characterGen] Error:", _0x3067ce);
    toastr.error("角色设计请求失败: " + _0x3067ce.message);
  }
}