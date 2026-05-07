import { getElContext, processWorldBooksWithTrigger, LLM_TAG_MODIFY } from "./promptReq.js";
import { generateCharacterListText, generateCommonCharacterListText, generateOutfitEnableListText } from "./settings/worldbook.js";
import { getContext } from "../../../../st-context.js";
import { updateCombinedPrompt } from "./settings/llm.js";
import { buildPromptForRequestType } from "./settings/llmService.js";
import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { isMobileDevice, removeThinkingTags } from "./utils.js";
import { mergeAdjacentMessages, replaceAllPlaceholders, replacePlaceholder as _0x5208e7 } from "./promptProcessor.js";
function readFileAsBase64(_0x2f5913) {
  return new Promise((_0x22e90f, _0xd86724) => {
    const _0x2f8d97 = new FileReader();
    _0x2f8d97.onload = () => _0x22e90f(_0x2f8d97.result);
    _0x2f8d97.onerror = _0xd86724;
    _0x2f8d97.readAsDataURL(_0x2f5913);
  });
}
function showTagModifyDemandPopup() {
  return new Promise(_0x53e15d => {
    const _0x4dd329 = isMobileDevice();
    const _0x517494 = [];
    let _0x4b775a = 10;
    let _0x57934f = window.innerHeight - 10;
    if (_0x4dd329) {
      const _0x403430 = document.querySelector("#top-settings-holder");
      if (_0x403430) {
        const _0x3ce6b5 = _0x403430.getBoundingClientRect();
        _0x4b775a = _0x3ce6b5.bottom + 10;
      }
      const _0x240966 = document.querySelector("#send_form");
      if (_0x240966) {
        const _0x28b2f8 = _0x240966.getBoundingClientRect();
        _0x57934f = _0x28b2f8.top - 10;
      }
    }
    const _0x35215c = _0x57934f - _0x4b775a;
    const _0x286332 = document.createElement("div");
    _0x286332.id = "tag-modify-overlay";
    _0x286332.className = "st-chatu8-popup-overlay";
    const _0x5e1809 = document.createElement("div");
    _0x5e1809.className = "st-chatu8-popup-bubble";
    if (_0x4dd329) {
      _0x5e1809.classList.add("mobile");
      _0x5e1809.style.top = _0x4b775a + "px";
      _0x5e1809.style.maxHeight = _0x35215c + "px";
    }
    const _0x1d45e3 = document.createElement("div");
    _0x1d45e3.textContent = "🏷️ 修改 Tag";
    _0x1d45e3.className = "st-chatu8-popup-title";
    const _0x45cf24 = document.createElement("div");
    _0x45cf24.textContent = "请描述您希望如何修改当前的图片标签";
    _0x45cf24.className = "st-chatu8-popup-hint";
    const _0x16393d = document.createElement("textarea");
    _0x16393d.placeholder = "例如：把背景改成夜晚、给人物添加翅膀、增加更多细节...";
    _0x16393d.className = "st-chatu8-popup-textarea";
    const _0x19743d = document.createElement("div");
    _0x19743d.className = "st-chatu8-popup-upload-section";
    const _0x145687 = document.createElement("div");
    _0x145687.className = "st-chatu8-popup-upload-header";
    const _0x6b8465 = document.createElement("span");
    _0x6b8465.textContent = "📎 参考图片（可选）";
    _0x6b8465.className = "st-chatu8-popup-upload-label";
    const _0x38f3d2 = document.createElement("input");
    _0x38f3d2.type = "file";
    _0x38f3d2.accept = "image/*";
    _0x38f3d2.multiple = true;
    _0x38f3d2.style.display = "none";
    const _0x380d85 = document.createElement("button");
    _0x380d85.type = "button";
    _0x380d85.innerHTML = "<i class=\"fa-solid fa-plus\"></i> 添加图片";
    _0x380d85.className = "st-chatu8-popup-upload-btn";
    _0x380d85.addEventListener("click", () => _0x38f3d2.click());
    _0x145687.appendChild(_0x6b8465);
    _0x145687.appendChild(_0x380d85);
    const _0x2cde42 = document.createElement("div");
    _0x2cde42.className = "st-chatu8-popup-preview-container";
    const _0x481801 = document.createElement("div");
    _0x481801.textContent = "点击上方按钮添加参考图片";
    _0x481801.className = "st-chatu8-popup-empty-hint";
    _0x2cde42.appendChild(_0x481801);
    function _0x3c511b() {
      _0x2cde42.innerHTML = "";
      if (_0x517494.length === 0) {
        const _0x249eac = document.createElement("div");
        _0x249eac.textContent = "点击上方按钮添加参考图片";
        _0x249eac.className = "st-chatu8-popup-empty-hint";
        _0x2cde42.appendChild(_0x249eac);
        return;
      }
      _0x517494.forEach((_0xca27e4, _0x4bc2c7) => {
        const _0x3d9ea6 = document.createElement("div");
        _0x3d9ea6.className = "st-chatu8-popup-img-item";
        const _0x102422 = document.createElement("div");
        _0x102422.className = "st-chatu8-popup-img-wrapper";
        const _0x281b35 = document.createElement("img");
        _0x281b35.src = _0xca27e4.base64;
        const _0x4177e4 = document.createElement("button");
        _0x4177e4.type = "button";
        _0x4177e4.innerHTML = "×";
        _0x4177e4.className = "st-chatu8-popup-img-delete";
        _0x4177e4.addEventListener("click", _0xa2dd0 => {
          _0xa2dd0.stopPropagation();
          _0x517494.splice(_0x4bc2c7, 1);
          _0x3c511b();
        });
        _0x102422.appendChild(_0x281b35);
        _0x102422.appendChild(_0x4177e4);
        const _0x336b9c = document.createElement("input");
        _0x336b9c.type = "text";
        _0x336b9c.placeholder = "图" + (_0x4bc2c7 + 1);
        _0x336b9c.value = _0xca27e4.name || "";
        _0x336b9c.className = "st-chatu8-popup-img-name";
        _0x336b9c.addEventListener("input", _0x5b9ac3 => {
          _0x517494[_0x4bc2c7].name = _0x5b9ac3.target.value;
        });
        _0x3d9ea6.appendChild(_0x102422);
        _0x3d9ea6.appendChild(_0x336b9c);
        _0x2cde42.appendChild(_0x3d9ea6);
      });
      const _0x2eacac = document.createElement("div");
      _0x2eacac.textContent = "已添加 " + _0x517494.length + " 张图片";
      _0x2eacac.className = "st-chatu8-popup-img-count";
      _0x2cde42.appendChild(_0x2eacac);
    }
    _0x38f3d2.addEventListener("change", async _0x23d9ad => {
      const _0x3bacd1 = _0x23d9ad.target.files;
      if (!_0x3bacd1 || _0x3bacd1.length === 0) {
        return;
      }
      for (const _0x3543ab of _0x3bacd1) {
        if (!_0x3543ab.type.startsWith("image/")) {
          continue;
        }
        try {
          const _0x52c471 = await readFileAsBase64(_0x3543ab);
          const _0x4edc22 = {
            base64: _0x52c471,
            name: ""
          };
          _0x517494.push(_0x4edc22);
        } catch (_0x50a0d9) {
          console.error("[showTagModifyDemandPopup] Failed to read image:", _0x50a0d9);
        }
      }
      _0x3c511b();
      _0x38f3d2.value = "";
    });
    _0x19743d.appendChild(_0x145687);
    _0x19743d.appendChild(_0x38f3d2);
    _0x19743d.appendChild(_0x2cde42);
    const _0xb1b903 = document.createElement("div");
    _0xb1b903.className = "st-chatu8-popup-buttons";
    const _0xa71ea7 = document.createElement("button");
    _0xa71ea7.textContent = "取消";
    _0xa71ea7.className = "st-chatu8-popup-btn-cancel";
    const _0x5679d6 = document.createElement("button");
    _0x5679d6.textContent = "确定修改";
    _0x5679d6.className = "st-chatu8-popup-btn-confirm";
    const _0x36b515 = _0x31c8eb => {
      _0x286332.classList.add("closing");
      setTimeout(() => {
        _0x286332.remove();
        _0x53e15d(_0x31c8eb);
      }, 150);
    };
    _0xa71ea7.addEventListener("click", () => _0x36b515(null));
    _0x5679d6.addEventListener("click", () => _0x36b515({
      text: _0x16393d.value.trim() || "",
      images: [..._0x517494]
    }));
    const _0xa3b37f = _0x36a8d3 => {
      if (_0x36a8d3.key === "Escape") {
        _0x36b515(null);
        document.removeEventListener("keydown", _0xa3b37f);
      } else if (_0x36a8d3.key === "Enter" && _0x36a8d3.ctrlKey) {
        _0x36b515({
          text: _0x16393d.value.trim() || "",
          images: [..._0x517494]
        });
        document.removeEventListener("keydown", _0xa3b37f);
      }
    };
    document.addEventListener("keydown", _0xa3b37f);
    _0xb1b903.appendChild(_0xa71ea7);
    _0xb1b903.appendChild(_0x5679d6);
    _0x5e1809.appendChild(_0x1d45e3);
    _0x5e1809.appendChild(_0x45cf24);
    _0x5e1809.appendChild(_0x16393d);
    _0x5e1809.appendChild(_0x19743d);
    _0x5e1809.appendChild(_0xb1b903);
    _0x286332.appendChild(_0x5e1809);
    document.body.appendChild(_0x286332);
    setTimeout(() => _0x16393d.focus(), 100);
  });
}
function parseImageTagFromResponse(_0x195deb) {
  if (!_0x195deb || typeof _0x195deb !== "string") {
    return null;
  }
  let _0x93e6ac = _0x195deb.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const _0x1cfded = /<image>([\s\S]*?)<\/image>/i;
  const _0x15c72c = _0x93e6ac.match(_0x1cfded);
  if (_0x15c72c && _0x15c72c[1]) {
    _0x93e6ac = _0x15c72c[1];
  }
  const _0x35d499 = extension_settings[extensionName];
  const _0x3392f5 = _0x35d499?.startTag || "image###";
  const _0x2a3f37 = _0x35d499?.endTag || "###";
  const _0x45d53a = _0x3392f5.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const _0x541a2c = _0x2a3f37.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const _0x1a0240 = new RegExp("(?:" + _0x45d53a + "|image\\s*###)\\s*([\\s\\S]*?)\\s*(?:" + _0x541a2c + "|###)", "i");
  const _0x774a09 = _0x93e6ac.match(_0x1a0240);
  if (_0x774a09 && _0x774a09[1]) {
    const _0x5c98f6 = _0x774a09[1].trim();
    return _0x5c98f6;
  }
  const _0x32b933 = /image\s*#{2,}\s*([\s\S]*?)\s*#{2,}/i;
  const _0x4a44f4 = _0x93e6ac.match(_0x32b933);
  if (_0x4a44f4 && _0x4a44f4[1]) {
    const _0x56a62d = _0x4a44f4[1].trim();
    return _0x56a62d;
  }
  console.warn("[parseImageTagFromResponse] No match found in text:", _0x93e6ac.substring(0, 300));
  return null;
}
function replacePlaceholder(_0x4f6245, _0x50eabf, _0x342d0c) {
  if (typeof _0x4f6245 === "string") {
    return _0x4f6245.replaceAll(_0x50eabf, _0x342d0c || "");
  }
  if (Array.isArray(_0x4f6245)) {
    return _0x4f6245.map(_0x31ba92 => replacePlaceholder(_0x31ba92, _0x50eabf, _0x342d0c));
  }
  if (_0x4f6245 && typeof _0x4f6245 === "object") {
    const _0x53571f = {};
    for (const _0x5d4ea9 in _0x4f6245) {
      _0x53571f[_0x5d4ea9] = replacePlaceholder(_0x4f6245[_0x5d4ea9], _0x50eabf, _0x342d0c);
    }
    return _0x53571f;
  }
  return _0x4f6245;
}
function attachImagesToMessage(_0x11545f, _0x334205, _0x14df75, _0x309a3 = "参考图片") {
  if (!_0x14df75 || _0x14df75.length === 0 || _0x334205 < 0 || _0x334205 >= _0x11545f.length) {
    return _0x11545f;
  }
  const _0x4fc937 = [..._0x11545f];
  const _0x687e = _0x4fc937[_0x334205];
  const _0x2e7672 = [];
  if (typeof _0x687e.content === "string") {
    const _0xd3af22 = {
      type: "text",
      text: _0x687e.content
    };
    _0x2e7672.push(_0xd3af22);
  } else if (Array.isArray(_0x687e.content)) {
    _0x2e7672.push(..._0x687e.content);
  }
  if (_0x14df75.length > 0) {
    const _0x2c82dd = {
      type: "text",
      text: "\n[以下是用户上传的" + _0x14df75.length + "张" + _0x309a3 + "]"
    };
    _0x2e7672.push(_0x2c82dd);
  }
  _0x14df75.forEach((_0x47d7c0, _0x20bc8c) => {
    const _0x3edaab = typeof _0x47d7c0 === "string" ? _0x47d7c0 : _0x47d7c0.base64;
    const _0x373539 = typeof _0x47d7c0 === "object" && _0x47d7c0.name ? _0x47d7c0.name : "" + _0x309a3 + (_0x20bc8c + 1);
    const _0x1540da = {
      type: "text",
      text: "[" + _0x373539 + "]"
    };
    _0x2e7672.push(_0x1540da);
    let _0x5a274b = _0x3edaab;
    if (!_0x3edaab.startsWith("data:")) {
      _0x5a274b = "data:image/png;base64," + _0x3edaab;
    }
    const _0x3b29f5 = {
      type: "image_url",
      image_url: {}
    };
    _0x3b29f5.image_url.url = _0x5a274b;
    _0x3b29f5.image_url.detail = "auto";
    _0x2e7672.push(_0x3b29f5);
  });
  const _0x339338 = {
    ..._0x687e
  };
  _0x339338.content = _0x2e7672;
  _0x4fc937[_0x334205] = _0x339338;
  return _0x4fc937;
}
function findMessageIndexWithPlaceholder(_0x14c932, _0x22a482) {
  for (let _0x139f71 = 0; _0x139f71 < _0x14c932.length; _0x139f71++) {
    const _0x15175c = _0x14c932[_0x139f71];
    if (typeof _0x15175c.content === "string" && _0x15175c.content.includes(_0x22a482)) {
      return _0x139f71;
    } else if (Array.isArray(_0x15175c.content)) {
      for (const _0x380fb5 of _0x15175c.content) {
        if (_0x380fb5.type === "text" && _0x380fb5.text.includes(_0x22a482)) {
          return _0x139f71;
        }
      }
    }
  }
  return -1;
}
export async function handleTagModifyRequest(_0x2f1a0c, _0x468868, _0x7880d9) {
  const _0x591a49 = await showTagModifyDemandPopup();
  if (_0x591a49 === null) {
    toastr.info("已取消修改");
    return;
  }
  const _0xf64a5 = _0x591a49.text || "";
  const _0x29ee53 = _0x591a49.images || [];
  if (!_0xf64a5) {
    toastr.warning("请输入修改需求");
    return;
  }
  toastr.info("正在处理修改请求...");
  try {
    let _0x56089a = [];
    let _0x1503b5 = "";
    if (_0x2f1a0c) {
      _0x56089a = (await getElContext(_0x2f1a0c)) || [];
      _0x1503b5 = _0x56089a[_0x56089a.length - 1] || "";
    }
    const _0x135a3e = _0xf64a5 ? [..._0x56089a, _0xf64a5, _0x468868] : [..._0x56089a, _0x468868];
    const _0x1b0154 = await processWorldBooksWithTrigger(_0x135a3e);
    const _0x2be749 = getContext();
    const _0x5c9676 = [];
    if (_0xf64a5) {
      _0x5c9676.push(_0xf64a5);
    }
    if (_0x1503b5) {
      _0x5c9676.push(_0x1503b5);
    }
    if (_0x468868) {
      _0x5c9676.push(_0x468868);
    }
    const _0x1d681c = _0x5c9676.join("\n");
    const _0xf3e869 = [];
    if (_0xf64a5) {
      _0xf3e869.push(_0xf64a5);
    }
    if (_0x56089a && _0x56089a.length > 0) {
      _0xf3e869.push(_0x56089a.join("\n"));
    }
    if (_0x1b0154) {
      _0xf3e869.push(_0x1b0154);
    }
    if (_0x468868) {
      _0xf3e869.push(_0x468868);
    }
    const _0x5e34d1 = _0xf3e869.join("\n");
    let _0x9b65d0 = buildPromptForRequestType("tag_modify", _0x1d681c);
    const _0x1aac9b = generateCharacterListText(_0x5e34d1);
    const _0xe72562 = generateOutfitEnableListText();
    const _0x357189 = generateCommonCharacterListText();
    const _0x556e9e = _0x2be749.chatMetadata?.variables || {};
    _0x9b65d0 = mergeAdjacentMessages(_0x9b65d0);
    const _0x26c36f = findMessageIndexWithPlaceholder(_0x9b65d0, "{{用户需求}}");
    const _0x246af1 = {
      context: _0x56089a.join("\n"),
      body: _0x1503b5,
      worldBookContent: _0x1b0154,
      variables: _0x556e9e,
      userDemand: _0xf64a5,
      characterListText: _0x1aac9b,
      outfitEnableListText: _0xe72562,
      commonCharacterListText: _0x357189
    };
    const {
      messages: _0x49ec6a
    } = replaceAllPlaceholders(_0x9b65d0, _0x246af1);
    _0x9b65d0 = _0x49ec6a;
    _0x9b65d0 = _0x5208e7(_0x9b65d0, "{{当前tag}}", _0x468868);
    if (_0x29ee53.length > 0 && _0x26c36f !== -1) {
      _0x9b65d0 = attachImagesToMessage(_0x9b65d0, _0x26c36f, _0x29ee53, "参考图片");
    }
    const _0x1171b5 = "[Tag修改] 用户需求: " + _0xf64a5 + (_0x29ee53.length > 0 ? "\n已附加 " + _0x29ee53.length + " 张参考图片" : "");
    updateCombinedPrompt(_0x9b65d0, _0x1171b5);
    const _0x5ab0c5 = await LLM_TAG_MODIFY(_0x9b65d0, {
      timeoutMs: 300000
    });
    const _0x4fc9c7 = _0x5ab0c5?.result || _0x5ab0c5;
    const _0x448d32 = removeThinkingTags(_0x4fc9c7);
    const _0x50b53b = parseImageTagFromResponse(_0x448d32);
    if (_0x50b53b) {
      _0x7880d9.value = _0x50b53b;
      toastr.success("Tag 修改成功！");
    } else {
      toastr.warning("未能从响应中解析出有效的 tag");
      console.warn("[tagModify] Could not parse tag from response:", _0x5ab0c5);
    }
  } catch (_0x24f6f8) {
    console.error("[tagModify] Error:", _0x24f6f8);
    toastr.error("修改失败: " + _0x24f6f8.message);
  }
}