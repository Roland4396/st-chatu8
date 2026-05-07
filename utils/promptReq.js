import { getContext } from "../../../../st-context.js";
import { extensionName } from "../utils/config.js";
import { extension_settings } from "../../../../extensions.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { generateCharacterListText, generateCommonCharacterListText, generateOutfitEnableListText, getEnabledCharacterImages, getEnabledOutfitImages, getCommonCharacterImages } from "./settings/worldbook.js";
import { isMobileDevice, removeThinkingTags } from "./utils.js";
export { generateRequestId, LLM_GET_PROMPT, LLM_IMAGE_GEN_GET_PROMPT, LLM_CHAR_DESIGN_GET_PROMPT, LLM_CHAR_DISPLAY_GET_PROMPT, LLM_CHAR_MODIFY_GET_PROMPT, LLM_TAG_MODIFY_GET_PROMPT, LLM_EXECUTE, LLM_IMAGE_GEN, LLM_CHAR_DESIGN, LLM_CHAR_DISPLAY, LLM_CHAR_MODIFY, LLM_TAG_MODIFY } from "./llmRequest.js";
export { processWorldBooksWithTrigger } from "./worldbookProcessor.js";
export { setcharData, getcharData, getElContext, getrWorlds, getcharWorld, getglobalSelectWorld, getWorldEntries } from "./chatDataUtils.js";
export { parseImagesFromPrompt, insertImagesIntoElement, fuzzyMatchLine, calculateLineSimilarity, calculateNgramSimilarity, generateElKey, saveImageGroup, generateStableId, findTagInImageGroups } from "./imageInserter.js";
import { LLM_IMAGE_GEN_GET_PROMPT, LLM_IMAGE_GEN } from "./llmRequest.js";
import { processWorldBooksWithTrigger } from "./worldbookProcessor.js";
import { getElContext } from "./chatDataUtils.js";
import { parseImagesFromPrompt, insertImagesIntoElement } from "./imageInserter.js";
import { getProcessedPrompt, replaceAllPlaceholders, mergeAdjacentMessages } from "./promptProcessor.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { debugLog, debugBranch, debugTimer, debugMilestone, debugError } from "./debugLogger.js";
function showUserDemandPopup() {
  return new Promise(_0x2dd281 => {
    const _0x748ab5 = isMobileDevice();
    const _0x2aabff = [];
    let _0x55a416 = 10;
    let _0x3bfb48 = "none";
    if (_0x748ab5) {
      const _0x4931dd = document.querySelector("#top-settings-holder");
      if (_0x4931dd) {
        const _0x284f93 = _0x4931dd.getBoundingClientRect();
        _0x55a416 = Math.max(10, Math.min(_0x284f93.bottom + 10, window.innerHeight * 0.5));
      }
      const _0x16917a = Math.max(200, window.innerHeight - _0x55a416 - 20);
      _0x3bfb48 = _0x16917a + "px";
    }
    const _0x5fce7a = document.createElement("div");
    _0x5fce7a.id = "user-demand-overlay";
    _0x5fce7a.className = "st-chatu8-popup-overlay";
    const _0x32e612 = document.createElement("div");
    _0x32e612.className = "st-chatu8-popup-bubble";
    if (_0x748ab5) {
      _0x32e612.classList.add("mobile");
      _0x32e612.style.top = _0x55a416 + "px";
      _0x32e612.style.maxHeight = _0x3bfb48;
    }
    const _0x41fdab = document.createElement("div");
    _0x41fdab.textContent = "🖼️ 输入生图需求";
    _0x41fdab.className = "st-chatu8-popup-title";
    const _0x27d285 = document.createElement("div");
    _0x27d285.textContent = "请描述您希望生成的图片的具体需求（可选）";
    _0x27d285.className = "st-chatu8-popup-hint";
    const _0x7ab31e = document.createElement("textarea");
    _0x7ab31e.placeholder = "例如：重点描绘场景氛围，光线柔和...";
    _0x7ab31e.className = "st-chatu8-popup-textarea";
    const _0x597f3b = document.createElement("div");
    _0x597f3b.className = "st-chatu8-popup-upload-section";
    const _0x205f73 = document.createElement("div");
    _0x205f73.className = "st-chatu8-popup-upload-header";
    const _0x2ffaa2 = document.createElement("span");
    _0x2ffaa2.textContent = "📎 参考图片（可选）";
    _0x2ffaa2.className = "st-chatu8-popup-upload-label";
    const _0x267b07 = document.createElement("input");
    _0x267b07.type = "file";
    _0x267b07.accept = "image/*";
    _0x267b07.multiple = true;
    _0x267b07.style.display = "none";
    const _0x476248 = document.createElement("button");
    _0x476248.type = "button";
    _0x476248.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加图片";
    _0x476248.className = "st-chatu8-popup-upload-btn";
    _0x476248.addEventListener("click", () => _0x267b07.click());
    _0x205f73.appendChild(_0x2ffaa2);
    _0x205f73.appendChild(_0x476248);
    const _0x5bb0d6 = document.createElement("div");
    _0x5bb0d6.className = "st-chatu8-popup-preview-container";
    const _0xb78a3b = document.createElement("div");
    _0xb78a3b.textContent = "点击上方按钮添加参考图片";
    _0xb78a3b.className = "st-chatu8-popup-empty-hint";
    _0x5bb0d6.appendChild(_0xb78a3b);
    function _0x46716c() {
      _0x5bb0d6.innerHTML = "";
      if (_0x2aabff.length === 0) {
        const _0x46427b = document.createElement("div");
        _0x46427b.textContent = "点击上方按钮添加参考图片";
        _0x46427b.className = "st-chatu8-popup-empty-hint";
        _0x5bb0d6.appendChild(_0x46427b);
        return;
      }
      _0x2aabff.forEach((_0x1e06e2, _0x4280cd) => {
        const _0x4d511 = document.createElement("div");
        _0x4d511.className = "st-chatu8-popup-img-item";
        const _0x455a83 = document.createElement("div");
        _0x455a83.className = "st-chatu8-popup-img-wrapper";
        const _0x1f07d0 = document.createElement("img");
        _0x1f07d0.src = _0x1e06e2.base64;
        const _0x523ffc = document.createElement("button");
        _0x523ffc.type = "button";
        _0x523ffc.innerHTML = "×";
        _0x523ffc.className = "st-chatu8-popup-img-delete";
        _0x523ffc.addEventListener("click", _0x5de292 => {
          _0x5de292.stopPropagation();
          _0x2aabff.splice(_0x4280cd, 1);
          _0x46716c();
        });
        _0x455a83.appendChild(_0x1f07d0);
        _0x455a83.appendChild(_0x523ffc);
        const _0x3358c0 = document.createElement("input");
        _0x3358c0.type = "text";
        _0x3358c0.placeholder = "图" + (_0x4280cd + 1);
        _0x3358c0.value = _0x1e06e2.name || "";
        _0x3358c0.className = "st-chatu8-popup-img-name";
        _0x3358c0.addEventListener("input", _0xa7619f => {
          _0x2aabff[_0x4280cd].name = _0xa7619f.target.value;
        });
        _0x4d511.appendChild(_0x455a83);
        _0x4d511.appendChild(_0x3358c0);
        _0x5bb0d6.appendChild(_0x4d511);
      });
      const _0x356455 = document.createElement("div");
      _0x356455.textContent = "已添加 " + _0x2aabff.length + " 张图片";
      _0x356455.className = "st-chatu8-popup-img-count";
      _0x5bb0d6.appendChild(_0x356455);
    }
    _0x267b07.addEventListener("change", async _0x368ac9 => {
      const _0x554a10 = _0x368ac9.target.files;
      if (!_0x554a10 || _0x554a10.length === 0) {
        return;
      }
      for (const _0x5b106c of _0x554a10) {
        if (!_0x5b106c.type.startsWith("image/")) {
          continue;
        }
        try {
          const _0xfa5bfb = await _0x5327e8(_0x5b106c);
          const _0x32e897 = {
            base64: _0xfa5bfb,
            name: ""
          };
          _0x2aabff.push(_0x32e897);
        } catch (_0x2f4790) {
          console.error("[showUserDemandPopup] Failed to read image:", _0x2f4790);
        }
      }
      _0x46716c();
      _0x267b07.value = "";
    });
    function _0x5327e8(_0x48fe9d) {
      return new Promise((_0x1c71cf, _0x52691a) => {
        const _0x586382 = new FileReader();
        _0x586382.onload = () => _0x1c71cf(_0x586382.result);
        _0x586382.onerror = _0x52691a;
        _0x586382.readAsDataURL(_0x48fe9d);
      });
    }
    _0x597f3b.appendChild(_0x205f73);
    _0x597f3b.appendChild(_0x267b07);
    _0x597f3b.appendChild(_0x5bb0d6);
    const _0x4724d0 = document.createElement("div");
    _0x4724d0.className = "st-chatu8-popup-buttons";
    const _0x50b210 = document.createElement("button");
    _0x50b210.textContent = "取消";
    _0x50b210.className = "st-chatu8-popup-btn-cancel";
    const _0x2015b7 = document.createElement("button");
    _0x2015b7.textContent = "确定生成";
    _0x2015b7.className = "st-chatu8-popup-btn-confirm";
    const _0x36a13f = _0x3bb33a => {
      _0x5fce7a.classList.add("closing");
      setTimeout(() => {
        _0x5fce7a.remove();
        _0x2dd281(_0x3bb33a);
      }, 150);
    };
    _0x50b210.addEventListener("click", () => _0x36a13f(null));
    _0x2015b7.addEventListener("click", () => _0x36a13f({
      text: _0x7ab31e.value.trim() || "",
      images: [..._0x2aabff]
    }));
    const _0x3b15a2 = _0x3a1c6b => {
      if (_0x3a1c6b.key === "Escape") {
        _0x36a13f(null);
        document.removeEventListener("keydown", _0x3b15a2);
      } else if (_0x3a1c6b.key === "Enter" && _0x3a1c6b.ctrlKey) {
        _0x36a13f({
          text: _0x7ab31e.value.trim() || "",
          images: [..._0x2aabff]
        });
        document.removeEventListener("keydown", _0x3b15a2);
      }
    };
    document.addEventListener("keydown", _0x3b15a2);
    _0x4724d0.appendChild(_0x50b210);
    _0x4724d0.appendChild(_0x2015b7);
    _0x32e612.appendChild(_0x41fdab);
    _0x32e612.appendChild(_0x27d285);
    _0x32e612.appendChild(_0x7ab31e);
    _0x32e612.appendChild(_0x597f3b);
    _0x32e612.appendChild(_0x4724d0);
    _0x5fce7a.appendChild(_0x32e612);
    document.body.appendChild(_0x5fce7a);
    setTimeout(() => _0x7ab31e.focus(), 100);
  });
}
export async function handlePromptRequest(_0x5e3937, _0x11846c) {
  const _0x2a1f53 = debugTimer("promptReq.handlePromptRequest", "正文图片生成核心流程");
  debugMilestone("handlePromptRequest", "开始处理图片生成请求");
  debugLog("promptReq.handlePromptRequest", "请求初始化", {
    gestureId: _0x11846c,
    目标元素: _0x5e3937?.className || _0x5e3937?.tagName,
    功能说明: "处理手势识别后的图片生成请求"
  });
  const _0x2b8ef2 = extension_settings[extensionName]?.imageGenDemandEnabled ?? false;
  let _0x5616ef = "";
  let _0x1ef2cc = [];
  if (_0x2b8ef2) {
    debugBranch("handlePromptRequest", "显示用户需求弹窗", true);
    debugLog("handlePromptRequest", "用户需求弹窗已启用，等待用户输入");
    const _0x145b91 = debugTimer("showUserDemandPopup", "用户需求输入弹窗");
    const _0x320bdb = await showUserDemandPopup();
    _0x145b91.end("用户已响应");
    if (_0x320bdb === null) {
      debugBranch("handlePromptRequest", "用户取消请求", true);
      debugLog("handlePromptRequest", "用户取消了生图请求");
      toastr.info("已取消生图请求");
      _0x2a1f53.end("用户取消");
      return;
    }
    _0x5616ef = _0x320bdb.text || extension_settings[extensionName]?.defaultImageDemand || "";
    _0x1ef2cc = _0x320bdb.images || [];
    const _0x3b2cc5 = {
      需求文本长度: _0x5616ef.length,
      上传图片数量: _0x1ef2cc.length
    };
    debugLog("handlePromptRequest", "用户需求已获取", _0x3b2cc5);
  } else {
    debugBranch("handlePromptRequest", "跳过用户需求弹窗", true);
    _0x5616ef = extension_settings[extensionName]?.defaultImageDemand || "";
  }
  toastr.info("正在处理正文生图请求...");
  let _0x422171 = getContext();
  const _0x10adf0 = (extension_settings[extensionName]?.llm_history_depth ?? 2) + 1;
  const _0x548a1b = {
    历史层数: _0x10adf0
  };
  debugLog("handlePromptRequest", "获取上下文", _0x548a1b);
  const _0x48ab19 = debugTimer("getElContext", "获取元素上下文消息");
  const _0x5c0f99 = await getElContext(_0x5e3937, _0x10adf0);
  _0x48ab19.end("获取到 " + (_0x5c0f99?.length || 0) + " 条上下文");
  const _0x439c7c = _0x5c0f99[_0x5c0f99.length - 1];
  let _0x18e725 = "";
  if (_0x5c0f99) {
    const _0x2a598c = _0x5616ef ? [..._0x5c0f99, _0x5616ef] : _0x5c0f99;
    const _0x3a6fb9 = {
      触发文本条数: _0x2a598c.length
    };
    debugLog("handlePromptRequest", "处理世界书触发", _0x3a6fb9);
    const _0x2c10cf = debugTimer("processWorldBooksWithTrigger", "世界书触发处理");
    _0x18e725 = await processWorldBooksWithTrigger(_0x2a598c);
    _0x2c10cf.end("触发内容长度: " + (_0x18e725?.length || 0));
    if (_0x18e725) {
      debugLog("handlePromptRequest", "世界书触发内容已获取", {
        内容预览: _0x18e725.substring(0, 100) + "..."
      });
    }
  }
  let _0x1a2585 = _0x422171.chatMetadata.variables || {};
  const _0x24ad7b = _0x5c0f99 && _0x5c0f99.length > 1 ? _0x5c0f99.slice(0, -1) : [];
  const _0x56760e = [];
  if (_0x5616ef) {
    _0x56760e.push(_0x5616ef);
  }
  if (_0x439c7c) {
    _0x56760e.push(_0x439c7c);
  }
  const _0x1ae485 = _0x56760e.join("\n");
  const _0x6b9fa5 = [];
  if (_0x5616ef) {
    _0x6b9fa5.push(_0x5616ef);
  }
  if (_0x5c0f99 && _0x5c0f99.length > 0) {
    _0x6b9fa5.push(_0x5c0f99.join("\n"));
  }
  if (_0x18e725) {
    _0x6b9fa5.push(_0x18e725);
  }
  const _0x2f1065 = _0x6b9fa5.join("\n");
  debugLog("handlePromptRequest", "构建 Prompt", {
    请求类型: "image_gen",
    条目触发文本长度: _0x1ae485.length
  });
  const _0x6c23be = debugTimer("buildPromptForRequestType", "构建请求类型 Prompt");
  let _0x5191ab = buildPromptForRequestType("image_gen", _0x1ae485);
  _0x6c23be.end("消息数量: " + (_0x5191ab?.length || 0));
  const _0x3880a1 = generateCharacterListText(_0x2f1065);
  const _0x31c3e7 = generateOutfitEnableListText();
  const _0x349b12 = generateCommonCharacterListText();
  const _0x448a8b = {
    角色列表长度: _0x3880a1?.length || 0,
    服装列表长度: _0x31c3e7?.length || 0,
    通用角色列表长度: _0x349b12?.length || 0
  };
  debugLog("handlePromptRequest", "生成角色/服装列表", _0x448a8b);
  const _0x1289d3 = ["{{上下文}}", "{{世界书触发}}", "{{getvar::name}}", "{{正文}}", "{{角色启用列表}}", "{{通用角色启用列表}}", "{{通用服装启用列表}}", "{{用户需求}}"];
  debugLog("handlePromptRequest", "合并相邻消息");
  _0x5191ab = mergeAdjacentMessages(_0x5191ab);
  const _0x459921 = {
    context: _0x24ad7b.join("\n"),
    body: _0x439c7c,
    worldBookContent: _0x18e725,
    variables: _0x1a2585,
    userDemand: _0x5616ef,
    characterListText: _0x3880a1,
    outfitEnableListText: _0x31c3e7,
    commonCharacterListText: _0x349b12
  };
  debugLog("handlePromptRequest", "替换占位符");
  const _0xe3662e = debugTimer("replaceAllPlaceholders", "占位符替换处理");
  const {
    messages: _0x3579fb,
    replacedVariables: _0x4140ac
  } = replaceAllPlaceholders(_0x5191ab, _0x459921);
  _0x5191ab = _0x3579fb;
  _0xe3662e.end("替换了 " + _0x4140ac.size + " 个变量");
  function _0x4e31d8(_0x20d389, _0x556325, _0x32963f, _0x805075 = "参考图片") {
    if (!_0x32963f || _0x32963f.length === 0 || _0x556325 < 0 || _0x556325 >= _0x20d389.length) {
      return _0x20d389;
    }
    const _0x136340 = [..._0x20d389];
    const _0x5a0484 = _0x136340[_0x556325];
    const _0x508e90 = [];
    if (typeof _0x5a0484.content === "string") {
      const _0x4db756 = {
        type: "text",
        text: _0x5a0484.content
      };
      _0x508e90.push(_0x4db756);
    } else if (Array.isArray(_0x5a0484.content)) {
      _0x508e90.push(..._0x5a0484.content);
    }
    if (_0x32963f.length > 0) {
      const _0x3d9655 = {
        type: "text",
        text: "\n[以下是用户上传的" + _0x32963f.length + "张" + _0x805075 + "]"
      };
      _0x508e90.push(_0x3d9655);
    }
    _0x32963f.forEach((_0x410e2b, _0x11f564) => {
      const _0x9b0876 = typeof _0x410e2b === "string" ? _0x410e2b : _0x410e2b.base64;
      const _0x148e63 = typeof _0x410e2b === "object" && _0x410e2b.name ? _0x410e2b.name : "" + _0x805075 + (_0x11f564 + 1);
      const _0x3b06f0 = {
        type: "text",
        text: "[" + _0x148e63 + "]"
      };
      _0x508e90.push(_0x3b06f0);
      let _0x91ff0d = _0x9b0876;
      if (!_0x9b0876.startsWith("data:")) {
        _0x91ff0d = "data:image/png;base64," + _0x9b0876;
      }
      const _0x69a53c = {
        type: "image_url",
        image_url: {}
      };
      _0x69a53c.image_url.url = _0x91ff0d;
      _0x69a53c.image_url.detail = "auto";
      _0x508e90.push(_0x69a53c);
    });
    const _0x30c2e3 = {
      ..._0x5a0484
    };
    _0x30c2e3.content = _0x508e90;
    _0x136340[_0x556325] = _0x30c2e3;
    return _0x136340;
  }
  function _0x51312c(_0x512e5c) {
    for (let _0x4920e8 = _0x512e5c.length - 1; _0x4920e8 >= 0; _0x4920e8--) {
      if (_0x512e5c[_0x4920e8].role === "user") {
        return _0x4920e8;
      }
    }
    return -1;
  }
  const _0x28128f = _0x51312c(_0x5191ab);
  if (_0x1ef2cc.length > 0 && _0x28128f >= 0) {
    const _0x393d1e = {
      数量: _0x1ef2cc.length,
      目标消息索引: _0x28128f
    };
    debugLog("handlePromptRequest", "附加用户上传图片", _0x393d1e);
    _0x5191ab = _0x4e31d8(_0x5191ab, _0x28128f, _0x1ef2cc, "参考图片");
  }
  try {
    debugLog("handlePromptRequest", "收集角色/服装图片");
    const _0x364aea = await getEnabledCharacterImages(_0x2f1065);
    const _0x429b54 = await getEnabledOutfitImages();
    const _0xc8c277 = await getCommonCharacterImages();
    const _0x49667f = [..._0x364aea, ..._0x429b54, ..._0xc8c277];
    const _0x1013b4 = {
      角色图片数: _0x364aea.length,
      服装图片数: _0x429b54.length,
      通用角色图片数: _0xc8c277.length,
      总计: _0x49667f.length
    };
    debugLog("handlePromptRequest", "角色/服装图片收集完成", _0x1013b4);
    if (_0x49667f.length > 0 && _0x28128f >= 0) {
      _0x5191ab = _0x4e31d8(_0x5191ab, _0x28128f, _0x49667f, "角色服装参考图片");
    }
  } catch (_0x27a51a) {
    debugError("handlePromptRequest", "收集角色/服装图片失败", _0x27a51a);
    console.error("[promptReq] 收集角色/服装图片失败:", _0x27a51a);
  }
  let _0x54fdce = "";
  if (_0x4140ac.size > 0) {
    _0x54fdce = "诊断：检测到以下变量被使用：" + [..._0x4140ac].join("、") + "\n";
  } else {
    _0x54fdce = "诊断：没有检测到变量被使用。\n";
  }
  const _0x4b9ff6 = _0x1289d3.filter(_0x57b559 => !_0x4140ac.has(_0x57b559) && !_0x57b559.includes("::"));
  if (_0x4b9ff6.length > 0) {
    _0x54fdce += "未使用的变量：" + _0x4b9ff6.join("、") + "\n\n";
  } else {
    _0x54fdce += "所有基础变量都已使用。\n\n";
  }
  updateCombinedPrompt(_0x5191ab, _0x54fdce);
  const _0x31b77b = extension_settings[extensionName]?.regexTestMode ?? false;
  if (_0x31b77b) {
    debugBranch("handlePromptRequest", "正则测试模式 - 停止LLM请求", true);
    toastr.info("🧪 正则测试模式已启用：已停止 LLM 请求，仅展示最终 Prompt");
    _0x2a1f53.end("正则测试模式 - 未发起LLM请求");
    return;
  }
  debugMilestone("handlePromptRequest", "开始 LLM 请求");
  debugLog("handlePromptRequest", "发起 LLM 图片生成请求", {
    消息数量: _0x5191ab?.length || 0,
    超时设置: "300000ms"
  });
  const _0x452b3f = debugTimer("LLM_IMAGE_GEN", "LLM 图片生成请求");
  const _0x4002fc = await LLM_IMAGE_GEN(_0x5191ab, {
    timeoutMs: 300000
  });
  _0x452b3f.end("响应长度: " + (_0x4002fc?.result?.length || 0));
  if (_0x4002fc.testMode) {
    debugBranch("handlePromptRequest", "LLM返回测试模式", true);
    _0x2a1f53.end("LLM 测试模式返回");
    return;
  }
  const _0x427095 = _0x4002fc.result;
  const _0x3893d3 = removeThinkingTags(_0x427095);
  debugLog("handlePromptRequest", "解析图片标签");
  const _0x435305 = debugTimer("parseImagesFromPrompt", "解析图片标签");
  const _0x31ba03 = parseImagesFromPrompt(_0x3893d3);
  _0x435305.end("解析到 " + _0x31ba03.length + " 个图片标签");
  debugLog("handlePromptRequest", "图片标签解析完成", {
    数量: _0x31ba03.length,
    标签预览: _0x31ba03.slice(0, 3).map(_0x47867e => _0x47867e.tag || _0x47867e.prompt?.substring(0, 30) || "unknown")
  });
  if (_0x31ba03.length > 0 && _0x5e3937) {
    debugLog("handlePromptRequest", "插入图片标签到 DOM");
    const _0x49947f = debugTimer("insertImagesIntoElement", "插入图片标签");
    await insertImagesIntoElement(_0x5e3937, _0x31ba03);
    _0x49947f.end("插入完成");
    const _0x38f178 = extension_settings[extensionName]?.zidongdianji === "true";
    if (_0x38f178) {
      const {
        taskQueue: _0x4623d6,
        TaskType: _0x162e93,
        TaskStatus: _0x1a947d
      } = await import("./taskQueue.js");
      const {
        eventSource: _0x3224f0
      } = await import("../../../../../script.js");
      const _0x277e90 = {
        name: "自动批量生图 (" + _0x31ba03.length + " 张)",
        type: _0x162e93.AUTO_CLICK,
        prompt: "共 " + _0x31ba03.length + " 个图片标签待处理"
      };
      const _0x51ced9 = _0x4623d6.addTask(_0x277e90);
      _0x4623d6.updateStatus(_0x51ced9, _0x1a947d.RUNNING);
      window.zidongdianji = true;
      window.autoClickTaskId = _0x51ced9;
      const _0x51f014 = _0x1dc429 => {
        if (_0x1dc429.taskId === _0x51ced9) {
          _0x4623d6.completeTask(_0x51ced9, _0x1dc429.success !== false);
          _0x3224f0.removeListener("st_chatu8_auto_click_complete", _0x51f014);
          window.autoClickTaskId = null;
          if (extension_settings[extensionName]?.zidongdianji2 !== "true") {
            setTimeout(() => {
              window.zidongdianji = false;
            }, 5000);
          }
        }
      };
      _0x3224f0.on("st_chatu8_auto_click_complete", _0x51f014);
      setTimeout(() => {
        if (!_0x4623d6.isTaskInQueue(_0x51ced9)) {
          console.log("[promptReq] 自动点击任务已被取消");
          window.zidongdianji = false;
          window.autoClickTaskId = null;
          _0x3224f0.removeListener("st_chatu8_auto_click_complete", _0x51f014);
          return;
        }
        import("./iframe/index.js").then(({
          processAllImagePlaceholders: _0x400599
        }) => {
          if (!_0x4623d6.isTaskInQueue(_0x51ced9)) {
            console.log("[promptReq] 自动点击任务已被取消");
            window.zidongdianji = false;
            window.autoClickTaskId = null;
            _0x3224f0.removeListener("st_chatu8_auto_click_complete", _0x51f014);
            return;
          }
          _0x400599();
        }).catch(_0x425c4f => {
          debugError("handlePromptRequest", "加载 iframe 模块失败", _0x425c4f);
          console.error("[promptReq] 加载 iframe 模块失败:", _0x425c4f);
          _0x4623d6.completeTask(_0x51ced9, false);
          window.autoClickTaskId = null;
          _0x3224f0.removeListener("st_chatu8_auto_click_complete", _0x51f014);
        });
      }, 100);
    }
  }
  debugMilestone("handlePromptRequest", "图片生成流程完成");
  _0x2a1f53.end("全流程完成");
}