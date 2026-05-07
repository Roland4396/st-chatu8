import { setcharData, getcharData } from "./chatDataUtils.js";
import { getContext } from "../../../../st-context.js";
import { saveChatConditional, chat, messageFormatting, eventSource, event_types } from "../../../../../script.js";
import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { debugLog, debugBranch, debugTimer, debugContent, debugElement } from "./debugLogger.js";
function getImageTags() {
  const _0x38e4ca = extension_settings[extensionName];
  const _0x5a1ca4 = _0x38e4ca?.startTag || "image###";
  const _0x2d64da = _0x38e4ca?.endTag || "###";
  const _0x5de939 = {
    startTag: _0x5a1ca4,
    endTag: _0x2d64da
  };
  return _0x5de939;
}
export function fuzzyMatchLine(_0x1017c4, _0x190144, _0x35f76d = 0.5) {
  const _0x1ee911 = _0x1017c4.split("\n");
  const _0x336174 = _0x190144.trim();
  if (!_0x336174) {
    return null;
  }
  let _0xa61aa = null;
  let _0x57e39f = 0;
  let _0x532aed = 0;
  const _0x272b34 = [];
  for (let _0x2b00dd = 0; _0x2b00dd < _0x1ee911.length; _0x2b00dd++) {
    const _0x17e27c = _0x1ee911[_0x2b00dd];
    const _0x912c56 = _0x532aed + _0x17e27c.length;
    const _0x4533b1 = calculateLineSimilarity(_0x17e27c, _0x336174);
    if (_0x4533b1 > 0) {
      _0x272b34.push({
        lineIndex: _0x2b00dd,
        score: _0x4533b1,
        preview: _0x17e27c.substring(0, 50) + (_0x17e27c.length > 50 ? "..." : "")
      });
      _0x272b34.sort((_0x5db8a5, _0x1a15df) => _0x1a15df.score - _0x5db8a5.score);
      if (_0x272b34.length > 5) {
        _0x272b34.pop();
      }
    }
    if (_0x4533b1 > _0x57e39f) {
      _0x57e39f = _0x4533b1;
      const _0x3293da = {
        lineIndex: _0x2b00dd,
        endIndex: _0x912c56,
        similarity: _0x4533b1,
        matchedLine: _0x17e27c
      };
      _0xa61aa = _0x3293da;
    }
    _0x532aed = _0x912c56 + 1;
  }
  if (_0x272b34.length > 0) {
    console.log("[fuzzyMatchLine] Target:", _0x336174.substring(0, 40) + (_0x336174.length > 40 ? "..." : ""));
    console.log("[fuzzyMatchLine] Top 5 candidates:");
    _0x272b34.forEach((_0x4d5396, _0x52fcf0) => {
      const _0x14852a = _0xa61aa && _0x4d5396.lineIndex === _0xa61aa.lineIndex;
      console.log("  " + (_0x52fcf0 + 1) + ". [Line " + _0x4d5396.lineIndex + "] Score: " + (_0x4d5396.score * 100).toFixed(1) + "% " + (_0x14852a ? "✓ SELECTED" : ""));
      console.log("     \"" + _0x4d5396.preview + "\"");
    });
  }
  if (_0xa61aa && _0xa61aa.similarity >= _0x35f76d) {
    return _0xa61aa;
  }
  if (_0xa61aa) {
    console.warn("[fuzzyMatchLine] Best match score " + (_0xa61aa.similarity * 100).toFixed(1) + "% below threshold " + (_0x35f76d * 100).toFixed(1) + "%");
  }
  return null;
}
export function calculateLineSimilarity(_0x2edb3e, _0x32ebcb) {
  const _0xa3a744 = _0x2edb3e.trim().toLowerCase();
  const _0x44efe8 = _0x32ebcb.trim().toLowerCase();
  if (!_0xa3a744 || !_0x44efe8) {
    return 0;
  }
  if (_0xa3a744.includes(_0x44efe8)) {
    const _0x4607c9 = _0x44efe8.length / _0xa3a744.length;
    return 0.9 + _0x4607c9 * 0.1;
  }
  if (_0x44efe8.includes(_0xa3a744) && _0xa3a744.length > 10) {
    return 0.95;
  }
  const _0x52c436 = calculateCharOverlapWithFrequency(_0xa3a744, _0x44efe8);
  const _0x4cd3fd = calculateNgramSimilarity(_0xa3a744, _0x44efe8, 3);
  return _0x52c436 * 0.5 + _0x4cd3fd * 0.5;
}
function calculateCharOverlapWithFrequency(_0x4bf25f, _0x15d399) {
  const _0x1aa5d0 = _0x4bf25f.split("").filter(_0x564f98 => _0x564f98.trim());
  const _0x3391be = _0x15d399.split("").filter(_0x4e31de => _0x4e31de.trim());
  if (_0x3391be.length === 0) {
    return 0;
  }
  const _0x91b45f = {};
  for (const _0x5f8782 of _0x1aa5d0) {
    _0x91b45f[_0x5f8782] = (_0x91b45f[_0x5f8782] || 0) + 1;
  }
  let _0xc91972 = 0;
  for (const _0xfe5c7d of _0x3391be) {
    if (_0x91b45f[_0xfe5c7d] > 0) {
      _0xc91972++;
      _0x91b45f[_0xfe5c7d]--;
    }
  }
  return _0xc91972 / _0x3391be.length;
}
export function calculateNgramSimilarity(_0x183123, _0x1d6319, _0x262e04 = 3) {
  const _0x4a7b9a = Math.min(_0x183123.length, _0x1d6319.length);
  const _0x1999f5 = Math.max(1, Math.min(_0x262e04, _0x4a7b9a));
  const _0x1231e2 = _0x3cbf74 => {
    const _0xb4701b = new Set();
    for (let _0x2cf7b1 = 0; _0x2cf7b1 <= _0x3cbf74.length - _0x1999f5; _0x2cf7b1++) {
      _0xb4701b.add(_0x3cbf74.substring(_0x2cf7b1, _0x2cf7b1 + _0x1999f5));
    }
    return _0xb4701b;
  };
  const _0x429390 = _0x1231e2(_0x183123);
  const _0x1ed84e = _0x1231e2(_0x1d6319);
  if (_0x429390.size === 0 || _0x1ed84e.size === 0) {
    return 0;
  }
  let _0xe7486d = 0;
  for (const _0x5d5498 of _0x429390) {
    if (_0x1ed84e.has(_0x5d5498)) {
      _0xe7486d++;
    }
  }
  const _0x1ca9d1 = _0x429390.size + _0x1ed84e.size - _0xe7486d;
  return _0xe7486d / _0x1ca9d1;
}
export function parseImagesFromPrompt(_0x248023) {
  const _0x5616ec = debugTimer("imageInserter.parseImagesFromPrompt", "解析 LLM 输出中的图片标签");
  const _0x449e5b = [];
  if (!_0x248023 || typeof _0x248023 !== "string") {
    const _0x13cae0 = {
      输入类型: typeof _0x248023,
      是否为空: !_0x248023
    };
    debugBranch("parseImagesFromPrompt", "输入无效 - 跳过", true, _0x13cae0);
    _0x5616ec.end("输入无效");
    return _0x449e5b;
  }
  const _0x414fae = {
    文本长度: _0x248023.length
  };
  debugLog("imageInserter.parseImagesFromPrompt", "开始解析", _0x414fae);
  debugContent("parseImagesFromPrompt", "LLM 原始输出", _0x248023, 500);
  console.log("[parseImagesFromPrompt] 开始解析，文本长度:", _0x248023.length);
  let _0x492375 = _0x248023;
  const _0x389cfe = /<images>([\s\S]*?)<\/images>/g;
  const _0x577e32 = [..._0x248023.matchAll(_0x389cfe)];
  if (_0x577e32.length > 0) {
    _0x492375 = _0x577e32.map(_0x18563e => _0x18563e[1]).join("\n");
    const _0x14c6dd = {
      容器数量: _0x577e32.length,
      合并后长度: _0x492375.length
    };
    debugBranch("parseImagesFromPrompt", "找到 <images> 容器", true, _0x14c6dd);
    console.log("[parseImagesFromPrompt] 找到", _0x577e32.length, "个 <images> 容器，已合并所有内容（总长度:", _0x492375.length, "）");
  } else {
    debugBranch("parseImagesFromPrompt", "未找到 <images> 容器 - 使用完整文本", true);
    console.log("[parseImagesFromPrompt] 未找到 <images> 容器，使用完整文本");
  }
  const _0x421b61 = /<image>([\s\S]*?)<\/image>/g;
  const _0x35e0dd = [];
  let _0x39d9b0;
  while ((_0x39d9b0 = _0x421b61.exec(_0x492375)) !== null) {
    const _0xd5ccf3 = {
      fullMatch: _0x39d9b0[0],
      content: _0x39d9b0[1],
      startIndex: _0x39d9b0.index
    };
    _0x35e0dd.push(_0xd5ccf3);
  }
  const _0x301909 = {
    块数量: _0x35e0dd.length
  };
  debugLog("imageInserter.parseImagesFromPrompt", "找到 <image> 块", _0x301909);
  console.log("[parseImagesFromPrompt] 找到", _0x35e0dd.length, "个 <image> 块");
  for (let _0x241d85 = 0; _0x241d85 < _0x35e0dd.length; _0x241d85++) {
    const _0x5c4160 = _0x35e0dd[_0x241d85];
    const _0x34dd88 = _0x5c4160.content;
    console.log("[parseImagesFromPrompt] 解析第 " + (_0x241d85 + 1) + " 个 <image> 块，内容长度: " + _0x34dd88.length);
    let _0x4b5f91 = "";
    const _0x2d0202 = /<imgthink>([\s\S]*?)<\/imgthink>/;
    const _0x23fa68 = _0x34dd88.match(_0x2d0202);
    if (_0x23fa68) {
      const _0x537708 = _0x23fa68[1];
      const _0x37fc4c = _0x537708.match(/regex:(.*?)(?:\n|$)/);
      if (_0x37fc4c) {
        _0x4b5f91 = _0x37fc4c[1].trim();
      }
    }
    if (!_0x4b5f91) {
      const _0x3b4ed0 = _0x34dd88.match(/regex:(.*?)(?:\n|$)/);
      if (_0x3b4ed0) {
        _0x4b5f91 = _0x3b4ed0[1].trim();
      }
    }
    const {
      startTag: _0x5dd77b,
      endTag: _0x475633
    } = getImageTags();
    let _0x44c6c5 = "";
    const _0x5010ff = _0x5dd77b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const _0x4b9ef8 = _0x475633.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const _0x160f99 = new RegExp(_0x5010ff + "([\\s\\S]*?)" + _0x4b9ef8);
    const _0x2b91ef = _0x34dd88.match(_0x160f99);
    if (_0x2b91ef) {
      _0x44c6c5 = _0x2b91ef[1].trim();
      console.log("[parseImagesFromPrompt] 块 " + (_0x241d85 + 1) + ": 找到 tag，长度 " + _0x44c6c5.length);
    } else {
      console.log("[parseImagesFromPrompt] 块 " + (_0x241d85 + 1) + ": 未找到 " + _0x5dd77b + "..." + _0x475633 + " 标签");
    }
    console.log("[parseImagesFromPrompt] 块 " + (_0x241d85 + 1) + " 结果: regex=\"" + _0x4b5f91.substring(0, 30) + "...\", tag=\"" + _0x44c6c5.substring(0, 50) + "...\"");
    debugLog("imageInserter.parseImagesFromPrompt", "块 " + (_0x241d85 + 1) + " 解析结果", {
      索引: _0x241d85 + 1,
      有regex: !!_0x4b5f91,
      regex预览: _0x4b5f91 ? _0x4b5f91.substring(0, 40) : "(无)",
      有tag: !!_0x44c6c5,
      tag长度: _0x44c6c5.length
    });
    if (_0x4b5f91 && _0x44c6c5) {
      const _0x5da274 = {
        regex: _0x4b5f91,
        tag: _0x44c6c5
      };
      _0x449e5b.push(_0x5da274);
      debugBranch("parseImagesFromPrompt", "块 " + (_0x241d85 + 1) + " 有效 - 已添加", true);
    } else {
      debugBranch("parseImagesFromPrompt", "块 " + (_0x241d85 + 1) + " 无效 - 跳过", true, {
        原因: !_0x4b5f91 ? "缺少regex" : "缺少tag"
      });
    }
  }
  console.log("[parseImagesFromPrompt] 解析完成，共", _0x449e5b.length, "个有效图片");
  const {
    endTag: _0x466efb
  } = getImageTags();
  for (const _0x47d583 of _0x449e5b) {
    if (_0x47d583.tag) {
      _0x47d583.tag = _0x47d583.tag.replaceAll("\n" + _0x466efb, _0x466efb);
    }
  }
  const _0x1c6a52 = {
    总块数: _0x35e0dd.length,
    有效图片数: _0x449e5b.length
  };
  debugLog("imageInserter.parseImagesFromPrompt", "解析完成", _0x1c6a52);
  _0x5616ec.end("解析到 " + _0x449e5b.length + " 个有效图片");
  const {
    startTag: _0x5d61cd
  } = getImageTags();
  if (_0x35e0dd.length > 0 && _0x449e5b.length === 0) {
    toastr.warning("LLM 输出解析失败：检测到 <image> 标签但未能解析出有效数据。请检查 LLM 输出格式是否包含 regex: 和 " + _0x5d61cd + "..." + _0x466efb + " 标签。");
  }
  return _0x449e5b;
}
export async function insertImagesIntoElement(_0x2c06b5, _0x15331) {
  const _0xb48934 = debugTimer("imageInserter.insertImagesIntoElement", "将图片标签插入到 DOM");
  if (!_0x2c06b5 || !_0x15331 || _0x15331.length === 0) {
    const _0x4b6cea = {
      有rootElement: !!_0x2c06b5,
      有images: !!_0x15331,
      images数量: _0x15331?.length || 0
    };
    debugBranch("insertImagesIntoElement", "输入无效 - 跳过", true, _0x4b6cea);
    _0xb48934.end("输入无效");
    return;
  }
  const _0x55ccc2 = {
    待插入数量: _0x15331.length
  };
  debugLog("imageInserter.insertImagesIntoElement", "开始插入图片标签", _0x55ccc2);
  debugElement("insertImagesIntoElement", "目标根元素", _0x2c06b5);
  const _0x5b6595 = _0x2c06b5.ownerDocument || document;
  const _0x28aec0 = _0x2c06b5.querySelectorAll(".image-tag-button, .st-chatu8-image-button");
  _0x28aec0.forEach(_0x1365ef => _0x1365ef.remove());
  const _0x18ce66 = _0x2c06b5.querySelectorAll(".st-chatu8-image-span");
  _0x18ce66.forEach(_0xb94a4c => _0xb94a4c.remove());
  const _0x3d96c6 = _0x2c06b5.querySelectorAll(".st-chatu8-image-container");
  _0x3d96c6.forEach(_0x183e78 => _0x183e78.remove());
  const _0x5571ed = _0x2c06b5.querySelectorAll(".st-chatu8-collapse-wrapper");
  _0x5571ed.forEach(_0x4afc92 => _0x4afc92.remove());
  debugLog("imageInserter.insertImagesIntoElement", "清理旧元素完成", {
    清理按钮数: _0x28aec0.length,
    清理容器数: _0x3d96c6.length + _0x18ce66.length + _0x5571ed.length
  });
  console.log("[insertImagesIntoElement] Cleaned up existing image elements");
  const _0x1fd886 = String(extension_settings[extensionName]?.insertOriginalText) === "true";
  if (_0x1fd886) {
    const _0x1b2ad = findMesTextFromElement(_0x2c06b5);
    if (_0x1b2ad) {
      const _0x47f47d = _0x1b2ad.closest(".mes");
      const _0x4bc676 = parseInt(_0x47f47d?.getAttribute("mesid"), 10);
      if (!isNaN(_0x4bc676) && chat[_0x4bc676] && chat[_0x4bc676].mes && chat[_0x4bc676].mes.length >= 100) {
        console.log("[insertImagesIntoElement] insertOriginalText 快速路径 - 直接用原文匹配");
        const _0x5680df = {
          mesId: _0x4bc676,
          mes长度: chat[_0x4bc676].mes.length
        };
        debugLog("imageInserter.insertImagesIntoElement", "insertOriginalText 快速路径", _0x5680df);
        await saveImageGroup(_0x15331, "", _0x2c06b5);
        _0xb48934.end("insertOriginalText 快速路径完成");
        return;
      } else {
        console.log("[insertImagesIntoElement] insertOriginalText 条件不满足，退回 DOM 逻辑");
      }
    }
  }
  const _0x17eb90 = [];
  let _0x299caf = "";
  const _0x58fd7a = _0x5b6595.createTreeWalker(_0x2c06b5, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: function (_0x4d4ae1) {
      const _0x35281e = _0x4d4ae1.parentElement?.tagName;
      if (_0x4d4ae1.nodeType === Node.ELEMENT_NODE && _0x4d4ae1.tagName !== "BR") {
        return NodeFilter.FILTER_SKIP;
      }
      if (_0x35281e === "SCRIPT" || _0x35281e === "STYLE" || _0x35281e === "BUTTON" || _0x4d4ae1.parentElement?.classList.contains("image-tag-button") || _0x4d4ae1.parentElement?.classList.contains("st-chatu8-image-span")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let _0x452ba7;
  while (_0x452ba7 = _0x58fd7a.nextNode()) {
    const _0x2a015b = _0x299caf.length;
    let _0x37469e = "";
    if (_0x452ba7.nodeType === Node.TEXT_NODE) {
      _0x37469e = _0x452ba7.textContent;
    } else if (_0x452ba7.tagName === "BR") {
      _0x37469e = "\n";
    }
    _0x299caf += _0x37469e;
    const _0x4e7282 = {
      node: _0x452ba7,
      start: _0x2a015b,
      end: _0x299caf.length
    };
    _0x17eb90.push(_0x4e7282);
  }
  if (_0x299caf.length === 0) {
    return;
  }
  const _0x51c879 = generateElKey(_0x299caf);
  if (_0x51c879) {
    try {
      const _0x490eff = (await getcharData("image_groups")) || {};
      const _0x120aa4 = _0x490eff[_0x51c879] || [];
      const _0x4a640e = _0x120aa4.filter(_0x2361bd => _0x2361bd.locked === true);
      if (_0x4a640e.length > 0) {
        console.log("[insertImagesIntoElement] Found", _0x4a640e.length, "locked images in image_groups, merging...");
        const _0x55ba89 = new Set(_0x15331.map(_0x574c5f => _0x574c5f.tag?.trim()));
        const _0x242aea = _0x4a640e.filter(_0x471b50 => !_0x55ba89.has(_0x471b50.tag?.trim()));
        _0x15331 = [..._0x242aea, ..._0x15331];
        console.log("[insertImagesIntoElement] After merging locked images:", _0x15331.length, "total");
      }
    } catch (_0x19aaa8) {
      console.warn("[insertImagesIntoElement] Error getting locked images from image_groups:", _0x19aaa8);
    }
  }
  const _0xe34043 = [];
  for (const _0xa280a9 of _0x15331) {
    if (!_0xa280a9.regex || !_0xa280a9.tag) {
      debugBranch("insertImagesIntoElement", "跳过无效 image (缺少regex或tag)", true);
      continue;
    }
    const _0x3bb654 = fuzzyMatchLine(_0x299caf, _0xa280a9.regex, 0.5);
    if (_0x3bb654) {
      const _0x56bfa8 = {
        endIndex: _0x3bb654.endIndex,
        tag: _0xa280a9.tag,
        matchText: _0x3bb654.matchedLine,
        similarity: _0x3bb654.similarity,
        aiRegex: _0xa280a9.regex
      };
      _0xe34043.push(_0x56bfa8);
      debugLog("imageInserter.insertImagesIntoElement", "模糊匹配成功", {
        相似度: (_0x3bb654.similarity * 100).toFixed(1) + "%",
        AI_regex: _0xa280a9.regex.substring(0, 40),
        匹配行: _0x3bb654.matchedLine.substring(0, 40),
        位置: _0x3bb654.endIndex
      });
      console.log("[insertImagesIntoElement] Fuzzy matched with " + (_0x3bb654.similarity * 100).toFixed(1) + "% similarity");
      console.log("  AI regex: \"" + _0xa280a9.regex + "\"");
      console.log("  Matched line: \"" + _0x3bb654.matchedLine + "\"");
    } else {
      const _0x501751 = {
        AI_regex: _0xa280a9.regex
      };
      debugBranch("insertImagesIntoElement", "模糊匹配失败", true, _0x501751);
      console.warn("[insertImagesIntoElement] No fuzzy match found for:", _0xa280a9.regex);
      console.group("[insertImagesIntoElement] 模糊匹配调试信息");
      console.log("目标 regex:", _0xa280a9.regex);
      console.log("logicalText 总长度:", _0x299caf.length);
      console.log("logicalText 完整内容:", _0x299caf);
      const _0x45d65c = _0x299caf.split("\n");
      console.log("分割后行数:", _0x45d65c.length);
      console.log("每行内容:");
      _0x45d65c.forEach((_0x4156cc, _0x2f472e) => {
        const _0x559082 = _0x4156cc.includes(_0xa280a9.regex) || _0xa280a9.regex.includes(_0x4156cc);
        console.log("  [" + _0x2f472e + "]" + (_0x559082 ? " ★" : "") + ": \"" + _0x4156cc + "\"");
      });
      console.groupEnd();
    }
  }
  if (_0xe34043.length === 0) {
    debugBranch("insertImagesIntoElement", "没有任何匹配 - 结束", true);
    _0xb48934.end("没有匹配");
    console.log("[insertImagesIntoElement] No matches found for any image regex");
    toastr.warning("图片标签全部无法插入：所有 regex 都未能在原文中找到匹配位置。请检查 LLM 生成的定位文本是否存在于当前消息中。");
    return;
  }
  const _0x3fe2dc = new Set();
  const _0x3c8cd1 = new Set();
  const _0x408152 = [];
  for (const _0x30d385 of _0xe34043) {
    const _0x4fe722 = _0x30d385.aiRegex?.trim().toLowerCase();
    const _0x26860a = _0x30d385.tag?.trim().toLowerCase();
    if (_0x4fe722 && _0x3fe2dc.has(_0x4fe722) || _0x26860a && _0x3c8cd1.has(_0x26860a)) {
      console.log("[insertImagesIntoElement] Skipping duplicate - regex: \"" + _0x30d385.aiRegex + "\", tag: \"" + _0x30d385.tag + "\"");
      continue;
    }
    if (_0x4fe722) {
      _0x3fe2dc.add(_0x4fe722);
    }
    if (_0x26860a) {
      _0x3c8cd1.add(_0x26860a);
    }
    _0x408152.push(_0x30d385);
  }
  const _0x53cbbf = {
    去重前: _0xe34043.length,
    去重后: _0x408152.length
  };
  debugLog("imageInserter.insertImagesIntoElement", "去重完成", _0x53cbbf);
  console.log("[insertImagesIntoElement] After deduplication: " + _0x408152.length + " unique matches (from " + _0xe34043.length + ")");
  _0xe34043.length = 0;
  _0xe34043.push(..._0x408152);
  const _0x4434eb = _0xe34043.map(_0x1dfd5e => {
    const _0x37933f = 40;
    const _0x1d67b4 = _0x1dfd5e.matchText.length > _0x37933f ? _0x1dfd5e.matchText.slice(-_0x37933f) : _0x1dfd5e.matchText;
    const _0x75ace7 = {
      endIndex: _0x1dfd5e.endIndex,
      regex: _0x1d67b4,
      tag: _0x1dfd5e.tag
    };
    return _0x75ace7;
  });
  _0xe34043.sort((_0x64740b, _0x4c3ca1) => _0x4c3ca1.endIndex - _0x64740b.endIndex);
  console.log("[insertImagesIntoElement] Found matches:", _0xe34043);
  let _0x174692 = 0;
  let _0x1bd1d8 = 0;
  for (const _0x366b5f of _0xe34043) {
    let _0x12051b = null;
    for (const _0x2566cb of _0x17eb90) {
      if (_0x366b5f.endIndex > _0x2566cb.start && _0x366b5f.endIndex <= _0x2566cb.end) {
        _0x12051b = _0x2566cb;
        break;
      }
    }
    if (!_0x12051b) {
      for (const _0x175b21 of _0x17eb90) {
        if (_0x366b5f.endIndex === _0x175b21.end) {
          _0x12051b = _0x175b21;
          break;
        }
      }
    }
    if (!_0x12051b) {
      const _0x181821 = {
        endIndex: _0x366b5f.endIndex
      };
      debugBranch("insertImagesIntoElement", "找不到目标节点 - 跳过", true, _0x181821);
      _0x1bd1d8++;
      console.warn("[insertImagesIntoElement] Could not find target node for match:", _0x366b5f);
      continue;
    }
    const _0x184273 = _0x366b5f.tag;
    const {
      startTag: _0x1421e5,
      endTag: _0x2f56bf
    } = getImageTags();
    const _0x3581a9 = "" + _0x1421e5 + _0x184273 + _0x2f56bf;
    if (_0x299caf.includes(_0x3581a9)) {
      debugBranch("insertImagesIntoElement", "标签已存在 - 跳过", true, {
        tag预览: _0x184273.substring(0, 30)
      });
      _0x1bd1d8++;
      console.log("[insertImagesIntoElement] Tag already exists in text:", _0x184273);
      continue;
    }
    const _0x2d9d25 = _0x5b6595.createRange();
    try {
      const _0x17abe7 = _0x12051b.node;
      const _0x1fa153 = _0x366b5f.endIndex - _0x12051b.start;
      if (_0x17abe7.nodeType === Node.TEXT_NODE) {
        _0x2d9d25.setStart(_0x17abe7, _0x1fa153);
        _0x2d9d25.setEnd(_0x17abe7, _0x1fa153);
      } else {
        _0x2d9d25.setStartAfter(_0x17abe7);
        _0x2d9d25.setEndAfter(_0x17abe7);
      }
    } catch (_0x5daf8d) {
      const _0x2743f3 = {
        错误: _0x5daf8d.message
      };
      debugLog("imageInserter.insertImagesIntoElement", "Range 设置失败", _0x2743f3);
      _0x1bd1d8++;
      console.error("[insertImagesIntoElement] Error setting range:", _0x5daf8d, _0x366b5f);
      continue;
    }
    const _0x193665 = _0x5b6595.createTextNode(_0x3581a9);
    _0x2d9d25.insertNode(_0x193665);
    _0x174692++;
    debugLog("imageInserter.insertImagesIntoElement", "插入标签成功", {
      tag预览: _0x184273.substring(0, 40),
      位置: _0x366b5f.endIndex
    });
    console.log("[insertImagesIntoElement] Inserted image tag for:", _0x184273);
  }
  const _0x332283 = {
    成功插入: _0x174692,
    跳过: _0x1bd1d8,
    总计: _0xe34043.length
  };
  debugLog("imageInserter.insertImagesIntoElement", "插入完成", _0x332283);
  await saveImageGroup(_0x4434eb, _0x299caf, _0x2c06b5);
  _0xb48934.end("插入 " + _0x174692 + " 个标签");
  console.log("[insertImagesIntoElement] Saved image group with", _0x4434eb.length, "images");
}
export function generateElKey(_0x148c44) {
  if (!_0x148c44 || _0x148c44.length === 0) {
    return "";
  }
  const _0x52a1b0 = _0x148c44.length;
  const _0x3d2104 = 20;
  const _0x4ef013 = Math.max(0, Math.floor(_0x52a1b0 / 2) - Math.floor(_0x3d2104 / 2));
  return _0x148c44.substring(_0x4ef013, _0x4ef013 + _0x3d2104);
}
export function getCleanLogicalText(_0x11a393) {
  if (!_0x11a393) {
    return "";
  }
  const _0x9b6f1e = _0x11a393.cloneNode(true);
  const _0xc5e6af = [".st-chatu8-image-button", ".image-tag-button", ".st-chatu8-image-span", ".st-chatu8-image-container", ".st-chatu8-collapse-wrapper"];
  for (const _0x154f8d of _0xc5e6af) {
    const _0x116708 = _0x9b6f1e.querySelectorAll(_0x154f8d);
    _0x116708.forEach(_0x18b0f9 => _0x18b0f9.remove());
  }
  return _0x9b6f1e.textContent || "";
}
export async function findTagInImageGroups(_0x1eaab2) {
  if (!_0x1eaab2) {
    return null;
  }
  const _0x4efec1 = (await getcharData("image_groups")) || {};
  for (const [_0x2035dd, _0x2d8588] of Object.entries(_0x4efec1)) {
    if (!Array.isArray(_0x2d8588)) {
      continue;
    }
    for (let _0x5bb112 = 0; _0x5bb112 < _0x2d8588.length; _0x5bb112++) {
      if (_0x2d8588[_0x5bb112].tag === _0x1eaab2) {
        const _0x2dd4af = {
          elKey: _0x2035dd,
          images: _0x2d8588,
          index: _0x5bb112
        };
        return _0x2dd4af;
      }
    }
  }
  return null;
}
function findMesTextFromElement(_0x1897f1) {
  if (_0x1897f1 && _0x1897f1.classList && _0x1897f1.classList.contains("mes_text")) {
    return _0x1897f1;
  }
  const _0x5c07d4 = _0x1897f1?.ownerDocument;
  if (_0x5c07d4 && _0x5c07d4 !== document) {
    for (const _0x2f3d56 of document.querySelectorAll("iframe")) {
      if (_0x2f3d56.contentDocument === _0x5c07d4) {
        return _0x2f3d56.closest(".mes_text");
      }
    }
  }
  return _0x1897f1?.closest?.(".mes_text");
}
function insertAt(_0x5b7df3, _0x11cc93, _0x523bb0) {
  return _0x5b7df3.slice(0, _0x11cc93) + _0x523bb0 + _0x5b7df3.slice(_0x11cc93);
}
async function renderMessage(_0x52f0f5) {
  console.log("[imageInserter] Rendering message:", _0x52f0f5);
  const _0x20762f = document.querySelector("div.mes[mesid=\"" + _0x52f0f5 + "\"]");
  if (!_0x20762f) {
    return;
  }
  const _0x27b11e = chat[_0x52f0f5];
  if (!_0x27b11e) {
    return;
  }
  if (_0x27b11e.swipes) {
    const _0xb4600d = _0x20762f.querySelector(".swipes-counter");
    if (_0xb4600d) {
      _0xb4600d.textContent = _0x27b11e.swipe_id + 1 + "​/​" + _0x27b11e.swipes.length;
    }
  }
  const _0xb4ea43 = _0x20762f.querySelector(".mes_text");
  if (_0xb4ea43) {
    _0xb4ea43.innerHTML = messageFormatting(_0x27b11e.mes, _0x27b11e.name, _0x27b11e.is_system, _0x27b11e.is_user, _0x52f0f5);
  }
  await eventSource.emit(_0x27b11e.is_user ? event_types.USER_MESSAGE_RENDERED : event_types.CHARACTER_MESSAGE_RENDERED, _0x52f0f5);
}
export async function saveImageGroup(_0x3d17c1, _0x3478cf, _0x13ea3c) {
  const _0x264855 = debugTimer("imageInserter.saveImageGroup", "保存图片组位置信息");
  if (!_0x3d17c1 || _0x3d17c1.length === 0) {
    debugBranch("saveImageGroup", "无图片 - 跳过保存", true);
    _0x264855.end("无图片");
    return;
  }
  const _0x2836c1 = {
    图片数量: _0x3d17c1.length
  };
  debugLog("imageInserter.saveImageGroup", "开始保存", _0x2836c1);
  debugElement("saveImageGroup", "目标元素", _0x13ea3c);
  console.group("[imageInserter] saveImageGroup - el 详细信息");
  console.log("el 对象:", _0x13ea3c);
  console.log("el.tagName:", _0x13ea3c?.tagName);
  console.log("el.className:", _0x13ea3c?.className);
  console.log("el.id:", _0x13ea3c?.id);
  console.log("el 是否在 document 中:", _0x13ea3c?.isConnected);
  console.log("el.ownerDocument:", _0x13ea3c?.ownerDocument === document ? "主文档" : "iframe 文档");
  const _0x5a9131 = [];
  let _0x393b08 = _0x13ea3c?.parentElement;
  for (let _0x37dad0 = 0; _0x37dad0 < 5 && _0x393b08; _0x37dad0++) {
    _0x5a9131.push("" + _0x393b08.tagName + (_0x393b08.id ? "#" + _0x393b08.id : "") + (_0x393b08.className ? "." + _0x393b08.className.split(" ")[0] : ""));
    _0x393b08 = _0x393b08.parentElement;
  }
  console.log("父元素链:", _0x5a9131.join(" → "));
  const _0x75166a = _0x13ea3c?.textContent?.length || 0;
  const _0x230675 = Math.floor(_0x75166a / 2);
  const _0x4c607d = Math.max(0, _0x230675 - 10);
  const _0x3fc3c4 = _0x13ea3c?.textContent?.substring(_0x4c607d, _0x4c607d + 20) || "";
  console.log("textContent 长度:", _0x75166a);
  console.log("textContent 中间 20 字特征:", JSON.stringify(_0x3fc3c4));
  if (_0x13ea3c?.ownerDocument !== document) {
    const _0x355e39 = _0x13ea3c?.ownerDocument;
    console.log("iframe document.URL:", _0x355e39?.URL);
    console.log("iframe body 子 div 数量:", _0x355e39?.body?.querySelectorAll(":scope > div").length);
  }
  console.log("是 mes_text:", _0x13ea3c?.classList?.contains("mes_text"));
  console.log("data-mesid:", _0x13ea3c?.getAttribute?.("data-mesid"));
  console.groupEnd();
  const _0x1416a2 = String(extension_settings[extensionName]?.insertOriginalText) === "true";
  const _0x3626f7 = {
    insertOriginalText设置: extension_settings[extensionName]?.insertOriginalText,
    是否启用: _0x1416a2
  };
  debugLog("imageInserter.saveImageGroup", "检查储存模式", _0x3626f7);
  if (_0x1416a2) {
    debugBranch("saveImageGroup", "insertOriginalText 模式已启用", true);
    const _0x22c22b = findMesTextFromElement(_0x13ea3c);
    if (_0x22c22b) {
      const _0x20f587 = _0x22c22b.closest(".mes");
      const _0x325078 = parseInt(_0x20f587?.getAttribute("mesid"), 10);
      debugLog("imageInserter.saveImageGroup", "insertOriginalText 定位结果", {
        找到mes_text: true,
        mesId: _0x325078,
        mesId有效: !isNaN(_0x325078)
      });
      if (!isNaN(_0x325078) && chat[_0x325078]) {
        let _0x4c80bd = chat[_0x325078].mes;
        if (_0x4c80bd && _0x4c80bd.length >= 100) {
          debugBranch("saveImageGroup", "insertOriginalText 模式执行", true, {
            mesId: _0x325078,
            mes长度: _0x4c80bd.length,
            储存位置: "chat[mesId].mes"
          });
          console.log("[imageInserter] insertOriginalText mode - mesId:", _0x325078, "mes.length:", _0x4c80bd.length);
          const _0x51eede = new Set(chat[_0x325078].extra?.lockedTags || []);
          console.log("[imageInserter] Locked tags:", Array.from(_0x51eede));
          const {
            startTag: _0x4314ae,
            endTag: _0x5ba14a
          } = getImageTags();
          const _0x3e18c6 = _0x4314ae.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const _0x4a9e95 = _0x5ba14a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          if (_0x51eede.size === 0) {
            _0x4c80bd = _0x4c80bd.replace(new RegExp("<image>" + _0x3e18c6 + "[\\s\\S]*?" + _0x4a9e95 + "<\\/image>", "g"), "");
            _0x4c80bd = _0x4c80bd.replace(new RegExp(_0x3e18c6 + "[\\s\\S]*?" + _0x4a9e95, "g"), "");
          } else {
            _0x4c80bd = _0x4c80bd.replace(new RegExp("<image>" + _0x3e18c6 + "([\\s\\S]*?)" + _0x4a9e95 + "<\\/image>", "g"), (_0x3187fe, _0x24d5b4) => {
              if (_0x51eede.has(_0x24d5b4.trim())) {
                return _0x3187fe;
              }
              return "";
            });
            _0x4c80bd = _0x4c80bd.replace(new RegExp(_0x3e18c6 + "([\\s\\S]*?)" + _0x4a9e95, "g"), (_0x513a18, _0x492207) => {
              if (_0x51eede.has(_0x492207.trim())) {
                return _0x513a18;
              }
              return "";
            });
          }
          _0x4c80bd = _0x4c80bd.replaceAll("\n" + _0x5ba14a, _0x5ba14a);
          _0x4c80bd = _0x4c80bd.replace(/\n{3,}/g, "\n\n");
          let _0xa88a5b = 0;
          for (const _0x9b9047 of _0x3d17c1) {
            if (_0x51eede.has(_0x9b9047.tag.trim())) {
              console.log("[imageInserter] Skipping locked tag:", _0x9b9047.tag.substring(0, 30));
              continue;
            }
            const _0x1e10e7 = fuzzyMatchLine(_0x4c80bd, _0x9b9047.regex, 0.5);
            if (_0x1e10e7) {
              const _0x25be0c = "\n\n<image>" + _0x4314ae + _0x9b9047.tag + _0x5ba14a + "</image>";
              _0x4c80bd = insertAt(_0x4c80bd, _0x1e10e7.endIndex, _0x25be0c);
              _0xa88a5b++;
              console.log("[imageInserter] Inserted tag at position", _0x1e10e7.endIndex, "for regex:", _0x9b9047.regex.substring(0, 30));
            } else {
              console.warn("[imageInserter] No match found for regex:", _0x9b9047.regex.substring(0, 50));
            }
          }
          chat[_0x325078].mes = _0x4c80bd;
          await saveChatConditional();
          await renderMessage(_0x325078);
          const _0x5e5710 = {
            mesId: _0x325078,
            插入数量: _0xa88a5b,
            储存位置: "chat[mesId].mes"
          };
          debugLog("imageInserter.saveImageGroup", "insertOriginalText 保存完成", _0x5e5710);
          _0x264855.end("insertOriginalText 模式 - 插入 " + _0xa88a5b + " 个标签");
          console.log("[imageInserter] Saved to chat[" + _0x325078 + "].mes (insertOriginalText mode)");
          return;
        } else {
          const _0x2b9b5f = {
            mes长度: _0x4c80bd?.length || 0,
            阈值: 100
          };
          debugBranch("saveImageGroup", "mes 长度不足 - 退回原有逻辑", true, _0x2b9b5f);
          console.log("[imageInserter] mes.length < 100, falling back to original storage");
        }
      } else {
        const _0x218e59 = {
          mesId: _0x325078,
          chat存在: !!chat[_0x325078]
        };
        debugBranch("saveImageGroup", "mesId 无效或 chat 不存在", true, _0x218e59);
      }
    } else {
      debugBranch("saveImageGroup", "未找到 mes_text 元素", true);
    }
  } else {
    debugBranch("saveImageGroup", "insertOriginalText 模式未启用", true);
  }
  const _0x1fe5e2 = _0x13ea3c && _0x13ea3c.classList && _0x13ea3c.classList.contains("mes_text");
  const _0x3271c6 = {
    是mes_text: _0x1fe5e2
  };
  debugLog("imageInserter.saveImageGroup", "进入原有保存逻辑", _0x3271c6);
  if (_0x1fe5e2) {
    debugBranch("saveImageGroup", "保存到 chat[id].extra.images", true);
    const _0x439477 = _0x13ea3c.parentElement?.parentElement;
    const _0x5b8fc6 = _0x439477?.getAttribute("mesid");
    if (!_0x5b8fc6) {
      debugBranch("saveImageGroup", "mesid 未找到 - 退回 metadata", true);
      console.warn("[imageInserter] mes_text element but mesid not found, falling back to chatMetadata");
      await saveToMetadata(_0x3d17c1, _0x3478cf);
      _0x264855.end("保存到 metadata (mesid未找到)");
      return;
    }
    const _0x5c928e = parseInt(_0x5b8fc6, 10);
    const _0x2e22c6 = getContext();
    if (!_0x2e22c6.chat || !_0x2e22c6.chat[_0x5c928e]) {
      const _0x52a763 = {
        id: _0x5c928e
      };
      debugBranch("saveImageGroup", "chat 消息不存在 - 退回 metadata", true, _0x52a763);
      console.warn("[imageInserter] chat message not found for id:", _0x5c928e, ", falling back to chatMetadata");
      await saveToMetadata(_0x3d17c1, _0x3478cf);
      _0x264855.end("保存到 metadata (chat不存在)");
      return;
    }
    if (!_0x2e22c6.chat[_0x5c928e].extra) {
      _0x2e22c6.chat[_0x5c928e].extra = {};
    }
    if (!_0x2e22c6.chat[_0x5c928e].extra.images) {
      _0x2e22c6.chat[_0x5c928e].extra.images = {};
    }
    const _0x257596 = _0x2e22c6.chat[_0x5c928e].swipe_id ?? 0;
    const _0x324771 = _0x2e22c6.chat[_0x5c928e].extra.images[_0x257596] || [];
    const _0x47aecc = _0x324771.filter(_0x1d16a8 => _0x1d16a8.locked === true);
    const _0x45e5a3 = new Set(_0x47aecc.map(_0x2724da => _0x2724da.tag));
    const _0x2a5a5f = _0x3d17c1.filter(_0xaa0bf1 => !_0x45e5a3.has(_0xaa0bf1.tag));
    const _0x431355 = [..._0x47aecc, ..._0x2a5a5f];
    const _0x2f5f07 = !!_0x2e22c6.chat[_0x5c928e].extra.images[_0x257596];
    _0x2e22c6.chat[_0x5c928e].extra.images[_0x257596] = _0x431355;
    saveChatConditional();
    const _0x1d82b4 = {
      mesId: _0x5c928e,
      swipeId: _0x257596,
      保存数量: _0x431355.length,
      锁定数量: _0x47aecc.length,
      新增数量: _0x2a5a5f.length,
      是否覆盖: _0x2f5f07,
      储存位置: "chat[" + _0x5c928e + "].extra.images[" + _0x257596 + "]"
    };
    debugLog("imageInserter.saveImageGroup", "保存到 extra.images 完成", _0x1d82b4);
    _0x264855.end("extra.images - " + _0x431355.length + " 个");
    console.log("[imageInserter] Saved to chat[" + _0x5c928e + "].extra.images[" + _0x257596 + "]:", _0x431355, _0x2f5f07 ? "(overridden)" : "(new)", _0x47aecc.length > 0 ? "(preserved " + _0x47aecc.length + " locked)" : "");
    if (_0x2e22c6.chat[_0x5c928e].mes && _0x2e22c6.chat[_0x5c928e].mes.length > 100 && _0x47aecc.length > 0) {
      console.log("[imageInserter] Forcing re-render to display locked tags in mes");
      await renderMessage(_0x5c928e);
    }
  } else {
    debugBranch("saveImageGroup", "保存到 chatMetadata (非 mes_text)", true);
    await saveToMetadata(_0x3d17c1, _0x3478cf);
    _0x264855.end("保存到 metadata");
  }
}
async function saveToMetadata(_0x4401a2, _0x207d7e) {
  const _0x36fa5e = (await getcharData("image_groups")) || {};
  const _0x470e0b = generateElKey(_0x207d7e);
  if (!_0x470e0b) {
    console.warn("[imageInserter] Cannot generate elKey, logicalText too short");
    toastr.warning("图片组无法存储：文本内容过短，无法生成唯一标识。");
    return;
  }
  const _0x4ac09e = _0x36fa5e[_0x470e0b] || [];
  const _0x183f3b = _0x4ac09e.filter(_0x3fcba8 => _0x3fcba8.locked === true);
  const _0x204f6a = new Set(_0x183f3b.map(_0x44c72c => _0x44c72c.tag));
  const _0x396f39 = _0x4401a2.filter(_0x45baa4 => !_0x204f6a.has(_0x45baa4.tag));
  const _0x11269b = [..._0x183f3b, ..._0x396f39];
  const _0x1ec75d = !!_0x36fa5e[_0x470e0b];
  _0x36fa5e[_0x470e0b] = _0x11269b;
  await setcharData("image_groups", _0x36fa5e);
  console.log("[imageInserter] Saved to chatMetadata:", _0x470e0b, _0x11269b, _0x1ec75d ? "(overridden)" : "(new)", _0x183f3b.length > 0 ? "(preserved " + _0x183f3b.length + " locked)" : "");
}
export function generateStableId(_0x43e615) {
  let _0x453358 = 0;
  for (let _0x2a0b5a = 0; _0x2a0b5a < _0x43e615.length; _0x2a0b5a++) {
    const _0x59d49a = _0x43e615.charCodeAt(_0x2a0b5a);
    _0x453358 = (_0x453358 << 5) - _0x453358 + _0x59d49a;
    _0x453358 |= 0;
  }
  return "chatu8-id-" + Math.abs(_0x453358).toString(36);
}
export async function deleteImagesForElement(_0x547725) {
  if (!_0x547725) {
    console.warn("[imageInserter] deleteImagesForElement: el is null");
    return;
  }
  console.log("[imageInserter] deleteImagesForElement called for:", _0x547725.tagName, _0x547725.className);
  const _0x1b95f2 = _0x547725.ownerDocument !== document;
  const _0x249e6d = findMesTextFromElement(_0x547725);
  let _0x3cd16f = _0x547725;
  if (_0x249e6d && !_0x1b95f2) {
    _0x3cd16f = _0x249e6d;
  }
  const _0x42ec29 = [".image-tag-button", ".st-chatu8-image-button", ".st-chatu8-image-span", ".st-chatu8-image-container", ".st-chatu8-collapse-wrapper"];
  let _0x37cf87 = 0;
  let _0x5529ec = 0;
  let _0x9192b9 = new Set();
  if (_0x249e6d) {
    const _0x447f32 = _0x249e6d.closest(".mes");
    const _0x5ddb0d = parseInt(_0x447f32?.getAttribute("mesid"), 10);
    const _0x848248 = getContext();
    if (!isNaN(_0x5ddb0d) && _0x848248.chat[_0x5ddb0d]) {
      if (_0x848248.chat[_0x5ddb0d].extra?.images) {
        const _0x5d7f99 = _0x848248.chat[_0x5ddb0d].swipe_id ?? 0;
        const _0x5127b0 = _0x848248.chat[_0x5ddb0d].extra.images[_0x5d7f99] || [];
        _0x5127b0.filter(_0x14455f => _0x14455f.locked === true).forEach(_0xa342c1 => {
          _0x9192b9.add(_0xa342c1.tag);
        });
      }
      const _0x69b968 = _0x848248.chat[_0x5ddb0d].extra?.lockedTags || [];
      _0x69b968.forEach(_0x3a62d8 => _0x9192b9.add(_0x3a62d8));
      if (_0x848248.chat[_0x5ddb0d].mes) {
        const {
          startTag: _0x33b52b,
          endTag: _0xc0e0e8
        } = getImageTags();
        const _0xdb7d7 = _0x33b52b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const _0x1162dd = _0xc0e0e8.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const _0x126ad6 = new RegExp(_0xdb7d7 + "([\\s\\S]*?)" + _0x1162dd, "g");
        let _0x8d70d4;
        while ((_0x8d70d4 = _0x126ad6.exec(_0x848248.chat[_0x5ddb0d].mes)) !== null) {
          const _0x4076cb = _0x8d70d4[1].trim();
          if (_0x69b968.includes(_0x4076cb)) {
            _0x9192b9.add(_0x4076cb);
            console.log("[imageInserter] Found locked tag in mes:", _0x4076cb.substring(0, 30));
          }
        }
      }
      console.log("[imageInserter] Total locked tags:", _0x9192b9.size, "from extra.lockedTags:", _0x69b968.length);
    }
  }
  _0x5529ec = _0x9192b9.size;
  console.log("[imageInserter] Locked tags for deletion check:", Array.from(_0x9192b9));
  const _0x4fa950 = _0xafb690 => {
    const _0x1b3ee8 = _0x2f0044 => {
      if (!_0x2f0044) {
        return false;
      }
      const _0x202632 = _0x2f0044.trim();
      if (_0x9192b9.has(_0x202632)) {
        return true;
      }
      for (const _0x2e8232 of _0x9192b9) {
        if (_0x2e8232.trim() === _0x202632 || _0x202632.includes(_0x2e8232.trim()) || _0x2e8232.trim().includes(_0x202632)) {
          return true;
        }
      }
      return false;
    };
    const _0x320b2b = _0xafb690.dataset?.link || _0xafb690.getAttribute?.("data-link");
    if (_0x1b3ee8(_0x320b2b)) {
      console.log("[imageInserter] Element locked (self):", _0x320b2b?.substring(0, 30));
      return true;
    }
    const _0x39c2b9 = _0xafb690.closest?.(".st-chatu8-image-button, .image-tag-button");
    if (_0x39c2b9 && _0x39c2b9 !== _0xafb690) {
      const _0x238c6f = _0x39c2b9.dataset?.link || _0x39c2b9.getAttribute?.("data-link");
      if (_0x1b3ee8(_0x238c6f)) {
        console.log("[imageInserter] Element locked via parent:", _0x238c6f?.substring(0, 30));
        return true;
      }
    }
    const _0x4a6721 = _0xafb690.parentElement;
    if (_0x4a6721) {
      const _0x2dbf10 = _0x4a6721.querySelectorAll(".st-chatu8-image-button, .image-tag-button");
      for (const _0x4b7524 of _0x2dbf10) {
        const _0x14ead8 = _0x4b7524.dataset?.link || _0x4b7524.getAttribute?.("data-link");
        if (_0x1b3ee8(_0x14ead8)) {
          console.log("[imageInserter] Element locked via sibling:", _0x14ead8?.substring(0, 30));
          return true;
        }
      }
    }
    const _0x504de1 = _0xafb690.previousElementSibling;
    if (_0x504de1?.classList?.contains("st-chatu8-image-button") || _0x504de1?.classList?.contains("image-tag-button")) {
      const _0x2f2ba4 = _0x504de1.dataset?.link || _0x504de1.getAttribute?.("data-link");
      if (_0x1b3ee8(_0x2f2ba4)) {
        console.log("[imageInserter] Element locked via prev sibling:", _0x2f2ba4?.substring(0, 30));
        return true;
      }
    }
    return false;
  };
  const _0x11eb12 = new Set();
  const _0x159a61 = _0x30ff2b => {
    const _0x3d8950 = _0x30ff2b.dataset?.link || _0x30ff2b.getAttribute?.("data-link");
    if (_0x3d8950 && !_0x4fa950(_0x30ff2b)) {
      _0x11eb12.add(_0x3d8950.trim());
    }
  };
  try {
    const _0x1832e9 = _0x3cd16f.querySelectorAll(".st-chatu8-image-button, .image-tag-button");
    _0x1832e9.forEach(_0x39fe95 => _0x159a61(_0x39fe95));
    console.log("[imageInserter] Tags to delete from storage:", Array.from(_0x11eb12));
  } catch (_0x56f278) {
    console.warn("[imageInserter] Error collecting tags:", _0x56f278);
  }
  const _0x53baf8 = generateElKey(getCleanLogicalText(_0x547725));
  console.log("[imageInserter] Pre-computed elKey for image_groups:", _0x53baf8);
  try {
    const _0x2f6ad4 = _0x3cd16f.querySelectorAll(".st-chatu8-collapse-wrapper");
    _0x2f6ad4.forEach(_0x597553 => {
      const _0x65872a = _0x597553.querySelectorAll(".st-chatu8-image-button, .image-tag-button");
      const _0xfcc62f = Array.from(_0x65872a).some(_0x33145e => _0x4fa950(_0x33145e));
      if (_0xfcc62f) {
        console.log("[imageInserter] Collapse wrapper has locked buttons, keeping wrapper");
        _0x65872a.forEach(_0x54bff0 => {
          if (!_0x4fa950(_0x54bff0)) {
            _0x54bff0.remove();
            _0x37cf87++;
            console.log("[imageInserter] Removed unlocked button inside wrapper");
          }
        });
      } else if (_0x65872a.length === 0) {
        _0x597553.remove();
        _0x37cf87++;
        console.log("[imageInserter] Removed empty collapse wrapper");
      } else {
        _0x597553.remove();
        _0x37cf87++;
        console.log("[imageInserter] Removed collapse wrapper (no locked buttons)");
      }
    });
  } catch (_0x167d1d) {
    console.warn("[imageInserter] Error removing collapse wrappers:", _0x167d1d);
  }
  for (const _0x1d67f9 of _0x42ec29) {
    if (_0x1d67f9 === ".st-chatu8-collapse-wrapper") {
      continue;
    }
    try {
      const _0x2c24bf = _0x3cd16f.querySelectorAll(_0x1d67f9);
      _0x2c24bf.forEach(_0x1b54d7 => {
        if (_0x4fa950(_0x1b54d7)) {
          console.log("[imageInserter] Skipped locked element:", _0x1d67f9);
          return;
        }
        const _0x341f32 = _0x1b54d7.querySelectorAll?.(".st-chatu8-image-button, .image-tag-button");
        if (_0x341f32 && _0x341f32.length > 0) {
          const _0x258ac6 = Array.from(_0x341f32).some(_0x63091a => _0x4fa950(_0x63091a));
          if (_0x258ac6) {
            console.log("[imageInserter] Skipped container with locked buttons inside:", _0x1d67f9);
            return;
          }
        }
        _0x1b54d7.remove();
        _0x37cf87++;
      });
    } catch (_0x206195) {
      console.warn("[imageInserter] Error removing elements with selector:", _0x1d67f9, _0x206195);
    }
  }
  console.log("[imageInserter] Removed", _0x37cf87, "image-related DOM elements, skipped", _0x5529ec, "locked");
  if (_0x249e6d) {
    const _0x1a71ac = _0x249e6d.closest(".mes");
    const _0x2fae82 = parseInt(_0x1a71ac?.getAttribute("mesid"), 10);
    const _0x5d360c = getContext();
    if (!isNaN(_0x2fae82) && _0x5d360c.chat[_0x2fae82]) {
      if (_0x5d360c.chat[_0x2fae82].extra?.images) {
        const _0x3ce0cc = _0x5d360c.chat[_0x2fae82].swipe_id ?? 0;
        const _0x4317d2 = _0x5d360c.chat[_0x2fae82].extra.images[_0x3ce0cc] || [];
        const _0x29c9a2 = _0x4317d2.filter(_0x5a3014 => _0x5a3014.locked === true);
        _0x5529ec = _0x29c9a2.length;
        if (_0x29c9a2.length > 0) {
          _0x5d360c.chat[_0x2fae82].extra.images[_0x3ce0cc] = _0x29c9a2;
          console.log("[imageInserter] Preserved", _0x5529ec, "locked images, deleted others");
        } else {
          delete _0x5d360c.chat[_0x2fae82].extra.images[_0x3ce0cc];
          console.log("[imageInserter] Deleted chat[" + _0x2fae82 + "].extra.images[" + _0x3ce0cc + "]");
        }
      }
      console.log("[imageInserter] Deleting from image_groups BEFORE renderMessage...");
      const _0x1715a6 = _0x53baf8;
      if (_0x1715a6 && _0x11eb12.size > 0) {
        const _0x19158d = (await getcharData("image_groups")) || {};
        if (_0x19158d[_0x1715a6]) {
          const _0x412083 = _0x19158d[_0x1715a6] || [];
          const _0x3de1a8 = _0x412083.filter(_0x3f2189 => {
            if (_0x3f2189.locked === true) {
              return true;
            }
            if (!_0x11eb12.has(_0x3f2189.tag?.trim())) {
              return true;
            }
            console.log("[imageInserter] Deleting tag from image_groups:", _0x3f2189.tag?.substring(0, 30));
            return false;
          });
          const _0x25b9fd = _0x412083.length - _0x3de1a8.length;
          if (_0x25b9fd > 0) {
            if (_0x3de1a8.length > 0) {
              _0x19158d[_0x1715a6] = _0x3de1a8;
              await setcharData("image_groups", _0x19158d);
              console.log("[imageInserter] image_groups: deleted", _0x25b9fd, ", remaining", _0x3de1a8.length);
            } else {
              delete _0x19158d[_0x1715a6];
              await setcharData("image_groups", _0x19158d);
              console.log("[imageInserter] image_groups: deleted all, removed key:", _0x1715a6);
            }
          } else {
            console.log("[imageInserter] image_groups: no matching tags to delete");
          }
        } else {
          console.log("[imageInserter] image_groups: no data found for key:", _0x1715a6);
        }
      }
      const {
        startTag: _0x3e85d5,
        endTag: _0x4d8cf7
      } = getImageTags();
      const _0x544c47 = _0x3e85d5.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const _0xb6d2c4 = _0x4d8cf7.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (_0x5d360c.chat[_0x2fae82].mes && _0x9192b9.size === 0) {
        const _0x3736e9 = _0x5d360c.chat[_0x2fae82].mes.length;
        _0x5d360c.chat[_0x2fae82].mes = _0x5d360c.chat[_0x2fae82].mes.replace(new RegExp("<image>" + _0x544c47 + "[\\s\\S]*?" + _0xb6d2c4 + "<\\/image>", "g"), "");
        _0x5d360c.chat[_0x2fae82].mes = _0x5d360c.chat[_0x2fae82].mes.replace(new RegExp(_0x544c47 + "[\\s\\S]*?" + _0xb6d2c4, "g"), "");
        _0x5d360c.chat[_0x2fae82].mes = _0x5d360c.chat[_0x2fae82].mes.replace(/\n{3,}/g, "\n\n");
        const _0x2536f6 = _0x5d360c.chat[_0x2fae82].mes.length;
        console.log("[imageInserter] Cleaned mes content, removed", _0x3736e9 - _0x2536f6, "chars");
        if (_0x3736e9 !== _0x2536f6) {
          await renderMessage(_0x2fae82);
        }
      } else if (_0x5d360c.chat[_0x2fae82].mes && _0x9192b9.size > 0) {
        let _0x2dbbee = _0x5d360c.chat[_0x2fae82].mes;
        const _0x306765 = _0x2dbbee.length;
        _0x2dbbee = _0x2dbbee.replace(new RegExp("<image>" + _0x544c47 + "([\\s\\S]*?)" + _0xb6d2c4 + "<\\/image>", "g"), (_0x338879, _0x37885b) => {
          if (_0x9192b9.has(_0x37885b.trim())) {
            return _0x338879;
          }
          return "";
        });
        _0x2dbbee = _0x2dbbee.replace(new RegExp(_0x544c47 + "([\\s\\S]*?)" + _0xb6d2c4, "g"), (_0x2be32b, _0x4a2423) => {
          if (_0x9192b9.has(_0x4a2423.trim())) {
            return _0x2be32b;
          }
          return "";
        });
        _0x2dbbee = _0x2dbbee.replace(/\n{3,}/g, "\n\n");
        _0x5d360c.chat[_0x2fae82].mes = _0x2dbbee;
        const _0x33a38d = _0x2dbbee.length;
        console.log("[imageInserter] Cleaned mes content (preserved locked), removed", _0x306765 - _0x33a38d, "chars");
        if (_0x2dbbee.length > 100 && _0x9192b9.size > 0) {
          console.log("[imageInserter] Forcing re-render to restore locked elements");
          await renderMessage(_0x2fae82);
        } else if (_0x306765 !== _0x33a38d) {
          await renderMessage(_0x2fae82);
        }
      }
      await saveChatConditional();
      console.log("[imageInserter] Saved chat after deletion");
    }
  }
  if (!_0x249e6d && _0x53baf8) {
    console.log("[imageInserter] Non-mesText scenario: deleting from image_groups...");
    const _0x3abed1 = (await getcharData("image_groups")) || {};
    if (_0x3abed1[_0x53baf8]) {
      const _0x5bf4cf = _0x3abed1[_0x53baf8] || [];
      let _0x318474;
      if (_0x11eb12.size > 0) {
        _0x318474 = _0x5bf4cf.filter(_0x1b3bd7 => {
          if (_0x1b3bd7.locked === true) {
            return true;
          }
          if (!_0x11eb12.has(_0x1b3bd7.tag?.trim())) {
            return true;
          }
          console.log("[imageInserter] Deleting tag from image_groups:", _0x1b3bd7.tag?.substring(0, 30));
          return false;
        });
      } else {
        console.log("[imageInserter] Fallback mode: deleting all unlocked images from image_groups");
        _0x318474 = _0x5bf4cf.filter(_0x221c70 => {
          if (_0x221c70.locked === true) {
            console.log("[imageInserter] Keeping locked image:", _0x221c70.tag?.substring(0, 30));
            return true;
          }
          console.log("[imageInserter] Deleting unlocked image from image_groups:", _0x221c70.tag?.substring(0, 30));
          return false;
        });
      }
      const _0x33af99 = _0x5bf4cf.length - _0x318474.length;
      if (_0x33af99 > 0) {
        if (_0x318474.length > 0) {
          _0x3abed1[_0x53baf8] = _0x318474;
          await setcharData("image_groups", _0x3abed1);
          console.log("[imageInserter] image_groups: deleted", _0x33af99, ", remaining", _0x318474.length);
        } else {
          delete _0x3abed1[_0x53baf8];
          await setcharData("image_groups", _0x3abed1);
          console.log("[imageInserter] image_groups: deleted all, removed key:", _0x53baf8);
        }
      } else {
        console.log("[imageInserter] image_groups: no images to delete (all locked or empty)");
      }
    } else {
      console.log("[imageInserter] image_groups: no data found for key:", _0x53baf8);
    }
  }
  console.log("[imageInserter] deleteImagesForElement completed, locked count:", _0x5529ec);
  const _0x32319b = {
    lockedCount: _0x5529ec
  };
  return _0x32319b;
}
export async function lockTagForElement(_0x491b6d, _0x20138d) {
  if (!_0x491b6d || !_0x20138d) {
    return {
      success: false,
      message: "参数无效"
    };
  }
  const _0x3afcd2 = findMesTextFromElement(_0x491b6d);
  if (_0x3afcd2) {
    const _0x1be469 = _0x3afcd2.closest(".mes");
    const _0x29b79f = parseInt(_0x1be469?.getAttribute("mesid"), 10);
    const _0x3508ab = getContext();
    if (!isNaN(_0x29b79f) && _0x3508ab.chat[_0x29b79f]) {
      if (!_0x3508ab.chat[_0x29b79f].extra) {
        _0x3508ab.chat[_0x29b79f].extra = {};
      }
      if (_0x3508ab.chat[_0x29b79f].extra.images) {
        const _0x27fc98 = _0x3508ab.chat[_0x29b79f].swipe_id ?? 0;
        const _0x4dbc24 = _0x3508ab.chat[_0x29b79f].extra.images[_0x27fc98] || [];
        let _0x5d6e15 = false;
        for (const _0x211472 of _0x4dbc24) {
          if (_0x211472.tag === _0x20138d) {
            _0x211472.locked = true;
            _0x5d6e15 = true;
          }
        }
        if (_0x5d6e15) {
          await saveChatConditional();
          console.log("[imageInserter] Locked tag in extra.images:", _0x20138d);
          return {
            success: true,
            message: "Tag 已锁定"
          };
        }
      }
      const _0x4a6408 = _0x3508ab.chat[_0x29b79f].mes || "";
      const {
        startTag: _0x57f84b,
        endTag: _0xb8dd16
      } = getImageTags();
      if (_0x4a6408.includes("" + _0x57f84b + _0x20138d + _0xb8dd16) || _0x4a6408.includes(_0x20138d)) {
        if (!_0x3508ab.chat[_0x29b79f].extra.lockedTags) {
          _0x3508ab.chat[_0x29b79f].extra.lockedTags = [];
        }
        if (!_0x3508ab.chat[_0x29b79f].extra.lockedTags.includes(_0x20138d)) {
          _0x3508ab.chat[_0x29b79f].extra.lockedTags.push(_0x20138d);
        }
        await saveChatConditional();
        console.log("[imageInserter] Locked tag in extra.lockedTags:", _0x20138d);
        return {
          success: true,
          message: "Tag 已锁定"
        };
      }
      const _0x267fc1 = await findTagInImageGroups(_0x20138d);
      if (_0x267fc1) {
        const _0x11f2d0 = (await getcharData("image_groups")) || {};
        const _0x1dde8e = _0x11f2d0[_0x267fc1.elKey];
        if (_0x1dde8e && _0x1dde8e[_0x267fc1.index]) {
          _0x1dde8e[_0x267fc1.index].locked = true;
          await setcharData("image_groups", _0x11f2d0);
          console.log("[imageInserter] Locked tag in image_groups (fallback from mesText):", _0x20138d);
          return {
            success: true,
            message: "Tag 已锁定"
          };
        }
      }
      return {
        success: false,
        message: "未找到匹配的 tag"
      };
    }
  } else {
    const _0x17e6f3 = getCleanLogicalText(_0x491b6d);
    const _0x102d76 = generateElKey(_0x17e6f3);
    if (_0x102d76) {
      const _0x3a30d2 = (await getcharData("image_groups")) || {};
      const _0x3873ff = _0x3a30d2[_0x102d76] || [];
      let _0x1925e8 = false;
      for (const _0x387058 of _0x3873ff) {
        if (_0x387058.tag === _0x20138d) {
          _0x387058.locked = true;
          _0x1925e8 = true;
        }
      }
      if (_0x1925e8) {
        _0x3a30d2[_0x102d76] = _0x3873ff;
        await setcharData("image_groups", _0x3a30d2);
        console.log("[imageInserter] Locked tag in metadata:", _0x20138d);
        return {
          success: true,
          message: "Tag 已锁定"
        };
      }
    }
    const _0x2a6413 = await findTagInImageGroups(_0x20138d);
    if (_0x2a6413) {
      const _0xecbcbf = (await getcharData("image_groups")) || {};
      const _0xc3086d = _0xecbcbf[_0x2a6413.elKey];
      if (_0xc3086d && _0xc3086d[_0x2a6413.index]) {
        _0xc3086d[_0x2a6413.index].locked = true;
        await setcharData("image_groups", _0xecbcbf);
        console.log("[imageInserter] Locked tag in metadata (global search):", _0x20138d);
        return {
          success: true,
          message: "Tag 已锁定"
        };
      }
    }
  }
  return {
    success: false,
    message: "未找到匹配的 tag"
  };
}
export async function unlockTagForElement(_0x4919bd, _0x1dc105) {
  if (!_0x4919bd || !_0x1dc105) {
    return {
      success: false,
      message: "参数无效"
    };
  }
  const _0x222b47 = findMesTextFromElement(_0x4919bd);
  if (_0x222b47) {
    const _0x5816f2 = _0x222b47.closest(".mes");
    const _0x5de0e6 = parseInt(_0x5816f2?.getAttribute("mesid"), 10);
    const _0xbe88fd = getContext();
    if (!isNaN(_0x5de0e6) && _0xbe88fd.chat[_0x5de0e6]) {
      if (_0xbe88fd.chat[_0x5de0e6].extra?.images) {
        const _0x72f1c4 = _0xbe88fd.chat[_0x5de0e6].swipe_id ?? 0;
        const _0x412f73 = _0xbe88fd.chat[_0x5de0e6].extra.images[_0x72f1c4] || [];
        let _0x55ae37 = false;
        for (const _0x3c373b of _0x412f73) {
          if (_0x3c373b.tag === _0x1dc105) {
            _0x3c373b.locked = false;
            _0x55ae37 = true;
          }
        }
        if (_0x55ae37) {
          await saveChatConditional();
          console.log("[imageInserter] Unlocked tag in extra.images:", _0x1dc105);
          return {
            success: true,
            message: "Tag 已解锁"
          };
        }
      }
      if (_0xbe88fd.chat[_0x5de0e6].extra?.lockedTags) {
        const _0x30e40f = _0xbe88fd.chat[_0x5de0e6].extra.lockedTags.indexOf(_0x1dc105);
        if (_0x30e40f !== -1) {
          _0xbe88fd.chat[_0x5de0e6].extra.lockedTags.splice(_0x30e40f, 1);
          await saveChatConditional();
          console.log("[imageInserter] Unlocked tag from extra.lockedTags:", _0x1dc105);
          return {
            success: true,
            message: "Tag 已解锁"
          };
        }
      }
      const _0x1fbc91 = await findTagInImageGroups(_0x1dc105);
      if (_0x1fbc91) {
        const _0x176900 = (await getcharData("image_groups")) || {};
        const _0x1beedd = _0x176900[_0x1fbc91.elKey];
        if (_0x1beedd && _0x1beedd[_0x1fbc91.index]) {
          _0x1beedd[_0x1fbc91.index].locked = false;
          await setcharData("image_groups", _0x176900);
          console.log("[imageInserter] Unlocked tag in image_groups (fallback from mesText):", _0x1dc105);
          return {
            success: true,
            message: "Tag 已解锁"
          };
        }
      }
      return {
        success: false,
        message: "未找到匹配的 tag"
      };
    }
  } else {
    const _0x49e3cf = getCleanLogicalText(_0x4919bd);
    const _0xb1aee0 = generateElKey(_0x49e3cf);
    if (_0xb1aee0) {
      const _0x534514 = (await getcharData("image_groups")) || {};
      const _0x2c25fd = _0x534514[_0xb1aee0] || [];
      let _0x25084a = false;
      for (const _0x79e09d of _0x2c25fd) {
        if (_0x79e09d.tag === _0x1dc105) {
          _0x79e09d.locked = false;
          _0x25084a = true;
        }
      }
      if (_0x25084a) {
        _0x534514[_0xb1aee0] = _0x2c25fd;
        await setcharData("image_groups", _0x534514);
        console.log("[imageInserter] Unlocked tag in metadata:", _0x1dc105);
        return {
          success: true,
          message: "Tag 已解锁"
        };
      }
    }
    const _0x1cdb88 = await findTagInImageGroups(_0x1dc105);
    if (_0x1cdb88) {
      const _0x2d7df3 = (await getcharData("image_groups")) || {};
      const _0x28c45d = _0x2d7df3[_0x1cdb88.elKey];
      if (_0x28c45d && _0x28c45d[_0x1cdb88.index]) {
        _0x28c45d[_0x1cdb88.index].locked = false;
        await setcharData("image_groups", _0x2d7df3);
        console.log("[imageInserter] Unlocked tag in metadata (global search):", _0x1dc105);
        return {
          success: true,
          message: "Tag 已解锁"
        };
      }
    }
  }
  return {
    success: false,
    message: "未找到匹配的 tag"
  };
}
export async function isTagLocked(_0x111e91, _0x4666f0) {
  if (!_0x111e91 || !_0x4666f0) {
    return false;
  }
  const _0x3fa8fc = findMesTextFromElement(_0x111e91);
  if (_0x3fa8fc) {
    const _0x34df0d = _0x3fa8fc.closest(".mes");
    const _0xdb2cc3 = parseInt(_0x34df0d?.getAttribute("mesid"), 10);
    const _0x5ace0e = getContext();
    if (!isNaN(_0xdb2cc3) && _0x5ace0e.chat[_0xdb2cc3]) {
      if (_0x5ace0e.chat[_0xdb2cc3].extra?.images) {
        const _0x2ccbae = _0x5ace0e.chat[_0xdb2cc3].swipe_id ?? 0;
        const _0x9b129e = _0x5ace0e.chat[_0xdb2cc3].extra.images[_0x2ccbae] || [];
        for (const _0x3e96d3 of _0x9b129e) {
          if (_0x3e96d3.tag === _0x4666f0) {
            return _0x3e96d3.locked === true;
          }
        }
      }
      if (_0x5ace0e.chat[_0xdb2cc3].extra?.lockedTags) {
        if (_0x5ace0e.chat[_0xdb2cc3].extra.lockedTags.includes(_0x4666f0)) {
          return true;
        }
      }
      const _0x8a7e54 = await findTagInImageGroups(_0x4666f0);
      if (_0x8a7e54) {
        return _0x8a7e54.images[_0x8a7e54.index]?.locked === true;
      }
    }
  } else {
    const _0x472ea0 = getCleanLogicalText(_0x111e91);
    const _0x58003d = generateElKey(_0x472ea0);
    if (_0x58003d) {
      const _0x3c902 = (await getcharData("image_groups")) || {};
      const _0xdc22f5 = _0x3c902[_0x58003d] || [];
      for (const _0x4f6222 of _0xdc22f5) {
        if (_0x4f6222.tag === _0x4666f0) {
          return _0x4f6222.locked === true;
        }
      }
    }
    const _0x120b92 = await findTagInImageGroups(_0x4666f0);
    if (_0x120b92) {
      return _0x120b92.images[_0x120b92.index]?.locked === true;
    }
  }
  return false;
}
export async function lockAllTagsForElement(_0x320d50) {
  if (!_0x320d50) {
    return {
      success: false,
      message: "参数无效",
      count: 0
    };
  }
  const _0x2835f3 = findMesTextFromElement(_0x320d50);
  let _0x10af18 = 0;
  if (_0x2835f3) {
    const _0x2ea567 = _0x2835f3.closest(".mes");
    const _0x26fa79 = parseInt(_0x2ea567?.getAttribute("mesid"), 10);
    const _0x4b0c1a = getContext();
    if (!isNaN(_0x26fa79) && _0x4b0c1a.chat[_0x26fa79]) {
      if (!_0x4b0c1a.chat[_0x26fa79].extra) {
        _0x4b0c1a.chat[_0x26fa79].extra = {};
      }
      if (_0x4b0c1a.chat[_0x26fa79].extra.images) {
        const _0xc12fa1 = _0x4b0c1a.chat[_0x26fa79].swipe_id ?? 0;
        const _0x24a554 = _0x4b0c1a.chat[_0x26fa79].extra.images[_0xc12fa1] || [];
        for (const _0x422fa4 of _0x24a554) {
          if (!_0x422fa4.locked) {
            _0x422fa4.locked = true;
            _0x10af18++;
          }
        }
      }
      if (_0x4b0c1a.chat[_0x26fa79].mes && _0x4b0c1a.chat[_0x26fa79].mes.length > 100) {
        const {
          startTag: _0x3656ba,
          endTag: _0x4f0e57
        } = getImageTags();
        const _0x5d5d76 = _0x3656ba.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const _0x1f6489 = _0x4f0e57.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const _0x4dbf6d = new RegExp(_0x5d5d76 + "([\\s\\S]*?)" + _0x1f6489, "g");
        let _0x3e1415;
        const _0x49cc2b = [];
        while ((_0x3e1415 = _0x4dbf6d.exec(_0x4b0c1a.chat[_0x26fa79].mes)) !== null) {
          _0x49cc2b.push(_0x3e1415[1].trim());
        }
        if (_0x49cc2b.length > 0) {
          if (!_0x4b0c1a.chat[_0x26fa79].extra.lockedTags) {
            _0x4b0c1a.chat[_0x26fa79].extra.lockedTags = [];
          }
          for (const _0x3f1a9c of _0x49cc2b) {
            if (!_0x4b0c1a.chat[_0x26fa79].extra.lockedTags.includes(_0x3f1a9c)) {
              _0x4b0c1a.chat[_0x26fa79].extra.lockedTags.push(_0x3f1a9c);
              _0x10af18++;
            }
          }
        }
      }
      const _0x13ec5c = getCleanLogicalText(_0x320d50);
      const _0x147f59 = generateElKey(_0x13ec5c);
      if (_0x147f59) {
        const _0x1aa144 = (await getcharData("image_groups")) || {};
        const _0x38562c = _0x1aa144[_0x147f59] || [];
        for (const _0xcf8269 of _0x38562c) {
          if (!_0xcf8269.locked) {
            _0xcf8269.locked = true;
            _0x10af18++;
          }
        }
        if (_0x38562c.length > 0) {
          _0x1aa144[_0x147f59] = _0x38562c;
          await setcharData("image_groups", _0x1aa144);
          console.log("[imageInserter] Also locked tags in image_groups, elKey:", _0x147f59);
        }
      }
      if (_0x10af18 > 0) {
        await saveChatConditional();
        console.log("[imageInserter] Locked all tags for element, count:", _0x10af18);
        const _0x41f2d3 = {
          success: true,
          message: "已锁定 " + _0x10af18 + " 个 Tag",
          count: _0x10af18
        };
        return _0x41f2d3;
      }
      return {
        success: false,
        message: "没有找到可锁定的 Tag",
        count: 0
      };
    }
  } else {
    const _0x51d5ae = getCleanLogicalText(_0x320d50);
    const _0x49ccdc = generateElKey(_0x51d5ae);
    if (_0x49ccdc) {
      const _0x5df782 = (await getcharData("image_groups")) || {};
      const _0x4ac129 = _0x5df782[_0x49ccdc] || [];
      for (const _0x37043b of _0x4ac129) {
        if (!_0x37043b.locked) {
          _0x37043b.locked = true;
          _0x10af18++;
        }
      }
      if (_0x10af18 > 0) {
        _0x5df782[_0x49ccdc] = _0x4ac129;
        await setcharData("image_groups", _0x5df782);
        console.log("[imageInserter] Locked all tags in metadata, count:", _0x10af18);
        const _0x549190 = {
          success: true,
          message: "已锁定 " + _0x10af18 + " 个 Tag",
          count: _0x10af18
        };
        return _0x549190;
      }
    }
  }
  return {
    success: false,
    message: "没有找到可锁定的 Tag",
    count: 0
  };
}
export async function unlockAllTagsForElement(_0x4289c3) {
  if (!_0x4289c3) {
    return {
      success: false,
      message: "参数无效",
      count: 0
    };
  }
  const _0x46201e = findMesTextFromElement(_0x4289c3);
  let _0x2195d5 = 0;
  if (_0x46201e) {
    const _0x22f53d = _0x46201e.closest(".mes");
    const _0x10e68c = parseInt(_0x22f53d?.getAttribute("mesid"), 10);
    const _0x17fd20 = getContext();
    if (!isNaN(_0x10e68c) && _0x17fd20.chat[_0x10e68c]) {
      if (_0x17fd20.chat[_0x10e68c].extra?.images) {
        const _0x4efcc0 = _0x17fd20.chat[_0x10e68c].swipe_id ?? 0;
        const _0x4c8387 = _0x17fd20.chat[_0x10e68c].extra.images[_0x4efcc0] || [];
        for (const _0x229009 of _0x4c8387) {
          if (_0x229009.locked) {
            _0x229009.locked = false;
            _0x2195d5++;
          }
        }
      }
      if (_0x17fd20.chat[_0x10e68c].extra?.lockedTags && _0x17fd20.chat[_0x10e68c].extra.lockedTags.length > 0) {
        _0x2195d5 += _0x17fd20.chat[_0x10e68c].extra.lockedTags.length;
        _0x17fd20.chat[_0x10e68c].extra.lockedTags = [];
      }
      const _0x5734cd = getCleanLogicalText(_0x4289c3);
      const _0x327783 = generateElKey(_0x5734cd);
      if (_0x327783) {
        const _0x2bda6e = (await getcharData("image_groups")) || {};
        const _0x498c12 = _0x2bda6e[_0x327783] || [];
        for (const _0x4faccc of _0x498c12) {
          if (_0x4faccc.locked) {
            _0x4faccc.locked = false;
            _0x2195d5++;
          }
        }
        if (_0x498c12.length > 0) {
          _0x2bda6e[_0x327783] = _0x498c12;
          await setcharData("image_groups", _0x2bda6e);
          console.log("[imageInserter] Also unlocked tags in image_groups, elKey:", _0x327783);
        }
      }
      if (_0x2195d5 > 0) {
        await saveChatConditional();
        console.log("[imageInserter] Unlocked all tags for element, count:", _0x2195d5);
        const _0x18dfd5 = {
          success: true,
          message: "已解锁 " + _0x2195d5 + " 个 Tag",
          count: _0x2195d5
        };
        return _0x18dfd5;
      }
      return {
        success: false,
        message: "没有找到已锁定的 Tag",
        count: 0
      };
    }
  } else {
    const _0x3826e6 = getCleanLogicalText(_0x4289c3);
    const _0x3579c0 = generateElKey(_0x3826e6);
    if (_0x3579c0) {
      const _0x112c17 = (await getcharData("image_groups")) || {};
      const _0xc5f1f0 = _0x112c17[_0x3579c0] || [];
      for (const _0x4c47cf of _0xc5f1f0) {
        if (_0x4c47cf.locked) {
          _0x4c47cf.locked = false;
          _0x2195d5++;
        }
      }
      if (_0x2195d5 > 0) {
        _0x112c17[_0x3579c0] = _0xc5f1f0;
        await setcharData("image_groups", _0x112c17);
        console.log("[imageInserter] Unlocked all tags in metadata, count:", _0x2195d5);
        const _0x5a4afb = {
          success: true,
          message: "已解锁 " + _0x2195d5 + " 个 Tag",
          count: _0x2195d5
        };
        return _0x5a4afb;
      }
    }
  }
  return {
    success: false,
    message: "没有找到已锁定的 Tag",
    count: 0
  };
}
export async function deleteTagForElement(_0x58b772, _0xd8fd4c) {
  if (!_0x58b772 || !_0xd8fd4c) {
    return {
      success: false,
      message: "参数无效"
    };
  }
  const _0xc06396 = _0xd8fd4c.trim();
  let _0xa9b8c3 = false;
  const _0x466d7a = findMesTextFromElement(_0x58b772);
  if (_0x466d7a) {
    const _0x4c7702 = _0x466d7a.closest(".mes");
    const _0x76ddf = parseInt(_0x4c7702?.getAttribute("mesid"), 10);
    const _0x308a32 = getContext();
    if (!isNaN(_0x76ddf) && _0x308a32.chat[_0x76ddf]) {
      if (_0x308a32.chat[_0x76ddf].extra?.images) {
        const _0x261ce3 = _0x308a32.chat[_0x76ddf].swipe_id ?? 0;
        const _0xe24b9f = _0x308a32.chat[_0x76ddf].extra.images[_0x261ce3] || [];
        const _0x22f2c9 = _0xe24b9f.length;
        _0x308a32.chat[_0x76ddf].extra.images[_0x261ce3] = _0xe24b9f.filter(_0x132640 => _0x132640.tag?.trim() !== _0xc06396);
        if (_0x308a32.chat[_0x76ddf].extra.images[_0x261ce3].length < _0x22f2c9) {
          _0xa9b8c3 = true;
          console.log("[imageInserter] Deleted tag from extra.images");
        }
      }
      if (_0x308a32.chat[_0x76ddf].extra?.lockedTags) {
        const _0x215200 = _0x308a32.chat[_0x76ddf].extra.lockedTags.length;
        _0x308a32.chat[_0x76ddf].extra.lockedTags = _0x308a32.chat[_0x76ddf].extra.lockedTags.filter(_0x147d0a => _0x147d0a.trim() !== _0xc06396);
        if (_0x308a32.chat[_0x76ddf].extra.lockedTags.length < _0x215200) {
          _0xa9b8c3 = true;
          console.log("[imageInserter] Deleted tag from extra.lockedTags");
        }
      }
      if (_0x308a32.chat[_0x76ddf].mes) {
        const {
          startTag: _0x56667e,
          endTag: _0x3d3b4f
        } = getImageTags();
        const _0x1d371e = escapeRegExp(_0x56667e);
        const _0x464d13 = escapeRegExp(_0x3d3b4f);
        const _0x52f7c3 = new RegExp("\\n*<image>" + _0x1d371e + escapeRegExp(_0xc06396) + _0x464d13 + "<\\/image>", "g");
        const _0x485fdb = new RegExp("\\n*" + _0x1d371e + escapeRegExp(_0xc06396) + _0x464d13, "g");
        const _0x5002f2 = _0x308a32.chat[_0x76ddf].mes;
        let _0xe3f888 = _0x5002f2.replace(_0x52f7c3, "");
        _0xe3f888 = _0xe3f888.replace(_0x485fdb, "");
        if (_0xe3f888 !== _0x5002f2) {
          _0x308a32.chat[_0x76ddf].mes = _0xe3f888;
          _0xa9b8c3 = true;
          console.log("[imageInserter] Deleted tag from mes content");
        }
      }
      if (_0xa9b8c3) {
        await saveChatConditional();
        await renderMessage(_0x76ddf);
      }
      if (!_0xa9b8c3) {
        const _0x328d0e = await findTagInImageGroups(_0xc06396);
        if (_0x328d0e) {
          const _0x2420c3 = (await getcharData("image_groups")) || {};
          const _0x55cda8 = _0x2420c3[_0x328d0e.elKey];
          if (_0x55cda8 && _0x55cda8[_0x328d0e.index]) {
            _0x55cda8.splice(_0x328d0e.index, 1);
            if (_0x55cda8.length > 0) {
              _0x2420c3[_0x328d0e.elKey] = _0x55cda8;
            } else {
              delete _0x2420c3[_0x328d0e.elKey];
            }
            await setcharData("image_groups", _0x2420c3);
            _0xa9b8c3 = true;
            console.log("[imageInserter] Deleted tag from image_groups (fallback from mesText):", _0xc06396.substring(0, 30));
          }
        }
      }
      if (!_0xa9b8c3) {
        return {
          success: false,
          message: "未找到匹配的 tag"
        };
      }
    }
  }
  const _0x2f1c30 = getCleanLogicalText(_0x58b772);
  const _0x5a0736 = generateElKey(_0x2f1c30);
  if (_0x5a0736) {
    const _0x2399df = (await getcharData("image_groups")) || {};
    const _0x432e41 = _0x2399df[_0x5a0736] || [];
    const _0x353a39 = _0x432e41.length;
    const _0x137750 = _0x432e41.filter(_0xdbe679 => _0xdbe679.tag?.trim() !== _0xc06396);
    if (_0x137750.length < _0x353a39) {
      _0x2399df[_0x5a0736] = _0x137750;
      await setcharData("image_groups", _0x2399df);
      _0xa9b8c3 = true;
      console.log("[imageInserter] Deleted tag from image_groups");
    }
  }
  if (!_0xa9b8c3) {
    const _0xc10216 = await findTagInImageGroups(_0xc06396);
    if (_0xc10216) {
      const _0x4824b2 = (await getcharData("image_groups")) || {};
      const _0x443bac = _0x4824b2[_0xc10216.elKey];
      if (_0x443bac && _0x443bac[_0xc10216.index]) {
        _0x443bac.splice(_0xc10216.index, 1);
        if (_0x443bac.length > 0) {
          _0x4824b2[_0xc10216.elKey] = _0x443bac;
        } else {
          delete _0x4824b2[_0xc10216.elKey];
        }
        await setcharData("image_groups", _0x4824b2);
        _0xa9b8c3 = true;
        console.log("[imageInserter] Deleted tag from image_groups (global search fallback):", _0xc06396.substring(0, 30));
      }
    }
  }
  if (_0xa9b8c3) {
    return {
      success: true,
      message: "Tag 已删除"
    };
  }
  return {
    success: false,
    message: "未找到该 Tag"
  };
}
function escapeRegExp(_0x54a5bf) {
  return _0x54a5bf.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}