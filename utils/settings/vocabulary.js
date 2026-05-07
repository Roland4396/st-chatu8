import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName, extensionFolderPath } from "../config.js";
import { dbs } from "../database.js";
import { showToast } from "../ui_common.js";
let VOCABULARY_FILE_LIST;
let VOCABULARY_INSTALL_ALL_BTN;
let VOCABULARY_UNINSTALL_ALL_BTN;
let VOCABULARY_SEARCH_INPUT;
let VOCABULARY_SEARCH_BTN;
let VOCABULARY_SEARCH_RESULTS;
let VOCABULARY_TREE_CONTAINER;
let VOCABULARY_SEARCH_STARTSWITH;
let VOCABULARY_SEARCH_LIMIT;
let VOCABULARY_SEARCH_SORT;
let VOCABULARY_SELECTED_TAGS;
let VOCABULARY_TAG_BACKSPACE;
let VOCABULARY_TAG_CLEAR;
let VOCABULARY_TAG_COPY;
let VOCABULARY_MANUAL_TAG_ORIGINAL_INPUT;
let VOCABULARY_MANUAL_TAG_TRANSLATION_INPUT;
let VOCABULARY_MANUAL_TAG_ADD_BTN;
let VOCABULARY_MANUAL_TAGS_LIST;
let VOCABULARY_MANUAL_TAGS_REFRESH_BTN;
let cachedTagTreeData = null;
const TAG_DATA_PATH = extensionFolderPath + "/tagData/";
const encryptionKey = "a-very-secret-key-that-is-not-so-secret";
async function buildTagTree() {
  try {
    const _0x31b33c = await dbs.getInstalledVocabularies();
    const _0x473683 = _0x31b33c.some(_0x48534e => _0x48534e.fileName === "tags.json");
    if (!_0x473683) {
      cachedTagTreeData = null;
      VOCABULARY_TREE_CONTAINER.innerHTML = "<p>请先从上方列表中安装 <code>tags.json</code> 以启用标签浏览器。</p>";
      return;
    }
    let _0xce8ac7;
    if (cachedTagTreeData) {
      _0xce8ac7 = cachedTagTreeData;
    } else {
      _0xce8ac7 = await dbs.getTagsTreeData();
      if (!_0xce8ac7 || !_0xce8ac7.tag_groups) {
        throw new Error("无法从数据库加载结构化标签数据。");
      }
      cachedTagTreeData = _0xce8ac7;
    }
    const {
      tag_groups: _0x42056,
      tag_tags: _0x1ee4b0
    } = _0xce8ac7;
    const _0x4a6956 = _0x1ee4b0.reduce((_0x3616a3, _0x2b0f2e) => {
      if (!_0x3616a3[_0x2b0f2e.subgroup_id]) {
        _0x3616a3[_0x2b0f2e.subgroup_id] = [];
      }
      _0x3616a3[_0x2b0f2e.subgroup_id].push(_0x2b0f2e);
      return _0x3616a3;
    }, {});
    const _0x9fcb3d = document.createElement("ul");
    _0x9fcb3d.className = "st-chatu8-tree";
    _0x42056.forEach(_0xd2bb63 => {
      const _0x4c649e = document.createElement("li");
      _0x4c649e.className = "st-chatu8-tree-item";
      const _0x12152a = document.createElement("span");
      _0x12152a.className = "st-chatu8-tree-toggle";
      _0x12152a.textContent = "▶ ";
      const _0x255de2 = document.createElement("span");
      _0x255de2.textContent = _0xd2bb63.name;
      _0x255de2.className = "st-chatu8-tree-group";
      const _0x5b491c = document.createElement("div");
      _0x5b491c.className = "st-chatu8-tree-content";
      _0x5b491c.appendChild(_0x12152a);
      _0x5b491c.appendChild(_0x255de2);
      _0x4c649e.appendChild(_0x5b491c);
      const _0xa7c4b = document.createElement("ul");
      _0xa7c4b.className = "st-chatu8-tree-sublist";
      _0xa7c4b.style.display = "none";
      if (_0xd2bb63.subgroups && _0xd2bb63.subgroups.length > 0) {
        _0xd2bb63.subgroups.forEach(_0x342080 => {
          const _0x588820 = document.createElement("li");
          _0x588820.className = "st-chatu8-tree-item";
          const _0x221d0f = document.createElement("span");
          _0x221d0f.className = "st-chatu8-tree-toggle";
          _0x221d0f.textContent = "▶ ";
          const _0x59b357 = document.createElement("span");
          _0x59b357.textContent = _0x342080.name;
          _0x59b357.className = "st-chatu8-tree-subgroup";
          const _0x1dfed4 = document.createElement("div");
          _0x1dfed4.className = "st-chatu8-tree-content";
          _0x1dfed4.appendChild(_0x221d0f);
          _0x1dfed4.appendChild(_0x59b357);
          _0x588820.appendChild(_0x1dfed4);
          const _0x1ca54d = document.createElement("ul");
          _0x1ca54d.className = "st-chatu8-tree-taglist";
          _0x1ca54d.style.display = "none";
          const _0x10c920 = _0x4a6956[_0x342080.id_index] || [];
          _0x10c920.forEach(_0x3ff3b7 => {
            const _0x5458a0 = document.createElement("li");
            _0x5458a0.className = "st-chatu8-tree-tag";
            _0x5458a0.textContent = _0x3ff3b7.text + " (" + _0x3ff3b7.desc + ")";
            _0x5458a0.onclick = () => {
              const _0x5ce0fc = VOCABULARY_SELECTED_TAGS.value.trim();
              const _0x37ed4c = _0x3ff3b7.text + "(" + _0x3ff3b7.desc + ")";
              if (_0x5ce0fc) {
                VOCABULARY_SELECTED_TAGS.value = _0x5ce0fc + ", " + _0x37ed4c;
              } else {
                VOCABULARY_SELECTED_TAGS.value = _0x37ed4c;
              }
            };
            _0x1ca54d.appendChild(_0x5458a0);
          });
          if (_0x10c920.length > 0) {
            _0x588820.appendChild(_0x1ca54d);
            _0x1dfed4.onclick = () => {
              const _0x2aa8b4 = _0x1ca54d.style.display === "block";
              _0x1ca54d.style.display = _0x2aa8b4 ? "none" : "block";
              _0x221d0f.textContent = _0x2aa8b4 ? "▶ " : "▼ ";
            };
          } else {
            _0x221d0f.style.visibility = "hidden";
          }
          _0xa7c4b.appendChild(_0x588820);
        });
      }
      _0x4c649e.appendChild(_0xa7c4b);
      _0x5b491c.onclick = () => {
        const _0x14d4b7 = _0xa7c4b.style.display === "block";
        _0xa7c4b.style.display = _0x14d4b7 ? "none" : "block";
        _0x12152a.textContent = _0x14d4b7 ? "▶ " : "▼ ";
      };
      _0x9fcb3d.appendChild(_0x4c649e);
    });
    VOCABULARY_TREE_CONTAINER.innerHTML = "";
    VOCABULARY_TREE_CONTAINER.appendChild(_0x9fcb3d);
  } catch (_0x5ae840) {
    console.error("Error building tag tree:", _0x5ae840);
    VOCABULARY_TREE_CONTAINER.textContent = "加载标签浏览器失败。";
    showToast("加载标签浏览器失败", "error");
  }
}
async function fetchTagDataFiles() {
  try {
    const _0xb0a6b1 = ["danbooru_001.json", "danbooru_002.json", "danbooru_003.json", "danbooru_004.json", "danbooru_005.json", "danbooru_006.json", "danbooru_007.json", "danbooru_008.json", "danbooru_009.json", "danbooru_010.json", "danbooru_011.json", "danbooru_012.json", "danbooru_013.json", "danbooru_014.json", "danbooru_015.json", "danbooru_016.json", "danbooru_017.json", "danbooru_018.json", "danbooru_019.json", "danbooru_020.json", "danbooru_021.json", "danbooru_022.json", "danbooru_023.json", "danbooru_024.json", "danbooru_025.json", "tags.json", "tag_NSFW001.json"];
    return _0xb0a6b1.map(_0x10d73a => ({
      name: _0x10d73a
    }));
  } catch (_0x456089) {
    console.error("Error fetching tag data files:", _0x456089);
    showToast("无法加载词库文件列表", "error");
    return [];
  }
}
async function renderVocabularyList() {
  const [_0x41004e, _0x5e01d8] = await Promise.all([fetchTagDataFiles(), dbs.getInstalledVocabularies()]);
  const _0xdd14fe = new Set(_0x5e01d8.map(_0x3ce7c3 => _0x3ce7c3.fileName));
  VOCABULARY_FILE_LIST.innerHTML = "";
  if (_0x41004e.length === 0) {
    VOCABULARY_FILE_LIST.textContent = "没有可用的词库文件。";
    return;
  }
  const _0x3376b6 = document.createElement("ul");
  _0x3376b6.className = "st-chatu8-vocabulary-ul";
  _0x41004e.forEach(_0x590dbe => {
    const _0x3ba0cc = document.createElement("li");
    _0x3ba0cc.className = "st-chatu8-vocabulary-item";
    const _0x1b87f8 = document.createElement("span");
    _0x1b87f8.textContent = _0x590dbe.name;
    _0x3ba0cc.appendChild(_0x1b87f8);
    const _0x1396fc = document.createElement("div");
    _0x1396fc.className = "st-chatu8-vocabulary-actions";
    if (_0xdd14fe.has(_0x590dbe.name)) {
      const _0x303f4d = _0x5e01d8.find(_0x41ccda => _0x41ccda.fileName === _0x590dbe.name)?.tagCount || 0;
      const _0x5e7a39 = document.createElement("span");
      _0x5e7a39.textContent = "已安装 (" + _0x303f4d + " tags)";
      _0x5e7a39.className = "st-chatu8-installed-label";
      _0x1396fc.appendChild(_0x5e7a39);
      const _0x440c3e = document.createElement("button");
      _0x440c3e.textContent = "卸载";
      _0x440c3e.className = "st-chatu8-btn danger small";
      _0x440c3e.onclick = () => uninstallVocabulary(_0x590dbe.name);
      _0x1396fc.appendChild(_0x440c3e);
    } else {
      const _0xc2d43e = document.createElement("button");
      _0xc2d43e.textContent = "安装";
      _0xc2d43e.className = "st-chatu8-btn small";
      _0xc2d43e.onclick = () => installVocabulary(_0x590dbe.name);
      _0x1396fc.appendChild(_0xc2d43e);
    }
    _0x3ba0cc.appendChild(_0x1396fc);
    _0x3376b6.appendChild(_0x3ba0cc);
  });
  VOCABULARY_FILE_LIST.appendChild(_0x3376b6);
}
async function installVocabulary(_0x36edd7) {
  if (!_0x36edd7) {
    showToast("无效的文件名", "warning");
    return;
  }
  try {
    showToast("正在安装 " + _0x36edd7 + "...", "info");
    const _0xf64174 = await fetch("" + TAG_DATA_PATH + _0x36edd7);
    if (!_0xf64174.ok) {
      throw new Error("HTTP error! status: " + _0xf64174.status);
    }
    const _0x324710 = await _0xf64174.text();
    const _0x560bc4 = CryptoJS.AES.decrypt(_0x324710, encryptionKey);
    const _0x134158 = _0x560bc4.toString(CryptoJS.enc.Utf8);
    if (!_0x134158) {
      throw new Error("解密失败，内容为空。可能是密钥不匹配或文件已损坏。");
    }
    const _0x27942a = JSON.parse(_0x134158);
    await dbs.installVocabulary(_0x36edd7, _0x27942a);
    const _0x25bda2 = await dbs.getInstalledVocabularies();
    const _0x552a18 = _0x25bda2.find(_0x2fe942 => _0x2fe942.fileName === _0x36edd7);
    const _0x4011e6 = _0x552a18 ? _0x552a18.tagCount : 0;
    showToast(_0x36edd7 + " 安装成功，包含 " + _0x4011e6 + " 个标签", "success");
    await renderVocabularyList();
    if (_0x36edd7 === "tags.json") {
      cachedTagTreeData = null;
      await buildTagTree();
    }
  } catch (_0x4b76e1) {
    console.error("Error installing vocabulary " + _0x36edd7 + ":", _0x4b76e1);
    showToast("安装失败: " + _0x4b76e1.message, "error");
  }
}
async function uninstallVocabulary(_0x2382de) {
  if (!_0x2382de) {
    showToast("无效的文件名", "warning");
    return;
  }
  try {
    await dbs.uninstallVocabulary(_0x2382de);
    showToast(_0x2382de + " 卸载成功", "success");
    await renderVocabularyList();
    if (_0x2382de === "tags.json") {
      await buildTagTree();
    }
  } catch (_0x46f82f) {
    console.error("Error uninstalling vocabulary " + _0x2382de + ":", _0x46f82f);
    showToast("卸载失败: " + _0x46f82f.message, "error");
  }
}
async function installAllVocabularies() {
  showToast("开始批量安装所有未安装的词库...", "info");
  const [_0x58c7b6, _0xbfc12c] = await Promise.all([fetchTagDataFiles(), dbs.getInstalledVocabularies()]);
  const _0xcab83c = new Set(_0xbfc12c.map(_0x11f2be => _0x11f2be.fileName));
  const _0x172780 = _0x58c7b6.filter(_0x26511b => !_0xcab83c.has(_0x26511b.name));
  if (_0x172780.length === 0) {
    showToast("所有词库均已安装。", "success");
    return;
  }
  for (const _0xb8d899 of _0x172780) {
    await installVocabulary(_0xb8d899.name);
  }
  showToast("批量安装完成！", "success");
}
async function uninstallAllVocabularies() {
  showToast("开始批量卸载所有已安装的词库...", "info");
  const _0x16c6f2 = await dbs.getInstalledVocabularies();
  if (_0x16c6f2.length === 0) {
    showToast("没有已安装的词库。", "success");
    return;
  }
  for (const _0x491c52 of _0x16c6f2) {
    await uninstallVocabulary(_0x491c52.fileName);
  }
  showToast("批量卸载完成！", "success");
}
async function searchTags() {
  const _0x5c9e31 = VOCABULARY_SEARCH_INPUT.value.trim();
  if (!_0x5c9e31) {
    VOCABULARY_SEARCH_RESULTS.innerHTML = "";
    return;
  }
  const _0x5ddaaf = VOCABULARY_SEARCH_STARTSWITH.checked;
  const _0x38ed68 = parseInt(VOCABULARY_SEARCH_LIMIT.value, 10);
  const _0x55721d = VOCABULARY_SEARCH_SORT.value;
  try {
    const _0x1ea37b = {
      startsWith: _0x5ddaaf,
      limit: _0x38ed68,
      sortBy: _0x55721d
    };
    const _0xf87c94 = await dbs.searchTags(_0x5c9e31, _0x1ea37b);
    VOCABULARY_SEARCH_RESULTS.innerHTML = "";
    if (_0xf87c94.length === 0) {
      VOCABULARY_SEARCH_RESULTS.textContent = "未找到匹配的标签。";
    } else {
      _0xf87c94.forEach(_0x21c3ae => {
        const _0x4d10ee = document.createElement("div");
        const _0x11ddd9 = typeof _0x21c3ae === "object" ? _0x21c3ae.name + " (" + (_0x21c3ae.translation || "无翻译") + ")" : _0x21c3ae;
        _0x4d10ee.textContent = _0x11ddd9;
        _0x4d10ee.className = "st-chatu8-search-result-item";
        _0x4d10ee.onclick = () => {
          navigator.clipboard.writeText(_0x21c3ae.name).then(() => {
            showToast("已复制: " + _0x21c3ae.name, "success");
          });
        };
        VOCABULARY_SEARCH_RESULTS.appendChild(_0x4d10ee);
      });
    }
  } catch (_0x5dadaf) {
    console.error("Error searching tags:", _0x5dadaf);
    showToast("搜索失败", "error");
  }
}
function handleTagBackspace() {
  const _0x483cbb = VOCABULARY_SELECTED_TAGS.value;
  let _0x308078 = _0x483cbb.split(",").map(_0x2292b0 => _0x2292b0.trim()).filter(_0x545384 => _0x545384);
  _0x308078.pop();
  VOCABULARY_SELECTED_TAGS.value = _0x308078.join(", ");
}
function handleTagClear() {
  VOCABULARY_SELECTED_TAGS.value = "";
}
function copyToClipboard(_0x24f2d2) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(_0x24f2d2).then(() => {
      showToast("已复制: \"" + _0x24f2d2 + "\"", "success");
    }).catch(_0xcd0a50 => {
      console.error("使用 Clipboard API 复制失败: ", _0xcd0a50);
      fallbackCopyTextToClipboard(_0x24f2d2);
    });
  } else {
    fallbackCopyTextToClipboard(_0x24f2d2);
  }
}
function fallbackCopyTextToClipboard(_0xafb2b0) {
  const _0x252b67 = document.createElement("textarea");
  _0x252b67.value = _0xafb2b0;
  _0x252b67.style.position = "fixed";
  _0x252b67.style.top = "0";
  _0x252b67.style.left = "0";
  _0x252b67.style.width = "2em";
  _0x252b67.style.height = "2em";
  _0x252b67.style.padding = "0";
  _0x252b67.style.border = "none";
  _0x252b67.style.outline = "none";
  _0x252b67.style.boxShadow = "none";
  _0x252b67.style.background = "transparent";
  document.body.appendChild(_0x252b67);
  _0x252b67.focus();
  _0x252b67.select();
  try {
    const _0x403d2d = document.execCommand("copy");
    if (_0x403d2d) {
      showToast("已复制: \"" + _0xafb2b0 + "\"", "success");
    } else {
      showToast("复制失败，浏览器不支持此操作", "error");
    }
  } catch (_0x32abe4) {
    console.error("后备复制方法失败: ", _0x32abe4);
    showToast("复制失败，发生未知错误", "error");
  }
  document.body.removeChild(_0x252b67);
}
function handleTagCopy() {
  const _0x1824b5 = VOCABULARY_SELECTED_TAGS.value.trim();
  if (!_0x1824b5) {
    showToast("输入框内没有标签可以复制", "info");
    return;
  }
  const _0x3c09a6 = _0x1824b5.replace(/\(/g, "（").replace(/\)/g, "）");
  if (!_0x3c09a6) {
    showToast("没有可以复制的标签", "info");
    return;
  }
  copyToClipboard(_0x3c09a6);
}
async function renderManualTags() {
  try {
    const _0x844802 = await dbs.getManualTags();
    VOCABULARY_MANUAL_TAGS_LIST.innerHTML = "";
    if (_0x844802.length === 0) {
      VOCABULARY_MANUAL_TAGS_LIST.textContent = "没有手动添加的标签。";
      return;
    }
    const _0x319308 = document.createElement("ul");
    _0x319308.className = "st-chatu8-vocabulary-ul";
    _0x844802.forEach(_0x1c5b03 => {
      const _0x1ec884 = document.createElement("li");
      _0x1ec884.className = "st-chatu8-vocabulary-item";
      const _0x3dd707 = document.createElement("span");
      _0x3dd707.textContent = _0x1c5b03.name + " -> " + (_0x1c5b03.translation || "(无翻译)");
      _0x1ec884.appendChild(_0x3dd707);
      const _0x1eb0b6 = document.createElement("div");
      _0x1eb0b6.className = "st-chatu8-vocabulary-actions";
      const _0x5eb85c = document.createElement("button");
      _0x5eb85c.textContent = "删除";
      _0x5eb85c.className = "st-chatu8-btn danger small";
      _0x5eb85c.onclick = async () => {
        if (confirm("确定要删除标签 \"" + _0x1c5b03.name + "\" 吗？")) {
          try {
            await dbs.deleteTagByName(_0x1c5b03.name);
            showToast("标签 \"" + _0x1c5b03.name + "\" 已删除", "success");
            await renderManualTags();
          } catch (_0x2a2e40) {
            console.error("Error deleting tag:", _0x2a2e40);
            showToast("删除失败: " + _0x2a2e40.message, "error");
          }
        }
      };
      _0x1eb0b6.appendChild(_0x5eb85c);
      _0x1ec884.appendChild(_0x1eb0b6);
      _0x319308.appendChild(_0x1ec884);
    });
    VOCABULARY_MANUAL_TAGS_LIST.appendChild(_0x319308);
  } catch (_0x56367e) {
    console.error("Error rendering manual tags:", _0x56367e);
    VOCABULARY_MANUAL_TAGS_LIST.textContent = "加载手动标签列表失败。";
    showToast("加载手动标签列表失败", "error");
  }
}
async function handleManualTagAdd() {
  const _0x38641b = VOCABULARY_MANUAL_TAG_ORIGINAL_INPUT.value.trim();
  const _0x19fc52 = VOCABULARY_MANUAL_TAG_TRANSLATION_INPUT.value.trim();
  if (!_0x38641b) {
    showToast("标签原文不能为空", "info");
    return;
  }
  try {
    const _0x19cb5c = await dbs.searchTags(_0x38641b, {
      startsWith: false,
      limit: 1
    });
    if (_0x19cb5c.some(_0x15549b => _0x15549b.name.toLowerCase() === _0x38641b.toLowerCase())) {
      showToast("标签 \"" + _0x38641b + "\" 已存在", "warning");
      return;
    }
    const _0x36013f = {
      name: _0x38641b,
      translation: _0x19fc52,
      hot: 0,
      fileName: "manual"
    };
    await dbs.addTag(_0x36013f);
    VOCABULARY_MANUAL_TAG_ORIGINAL_INPUT.value = "";
    VOCABULARY_MANUAL_TAG_TRANSLATION_INPUT.value = "";
    showToast("成功添加标签: " + _0x38641b, "success");
    await renderManualTags();
  } catch (_0x51c86e) {
    console.error("Error adding manual tag:", _0x51c86e);
    showToast("添加失败: " + _0x51c86e.message, "error");
  }
}
export function init() {
  VOCABULARY_FILE_LIST = document.getElementById("vocabulary-file-list");
  VOCABULARY_INSTALL_ALL_BTN = document.getElementById("vocabulary-install-all-btn");
  VOCABULARY_UNINSTALL_ALL_BTN = document.getElementById("vocabulary-uninstall-all-btn");
  VOCABULARY_SEARCH_INPUT = document.getElementById("vocabulary-search-input");
  VOCABULARY_SEARCH_BTN = document.getElementById("vocabulary-search-btn");
  VOCABULARY_SEARCH_RESULTS = document.getElementById("vocabulary-search-results");
  VOCABULARY_TREE_CONTAINER = document.getElementById("vocabulary-tree-container");
  VOCABULARY_SEARCH_STARTSWITH = document.getElementById("vocabulary_search_startswith");
  VOCABULARY_SEARCH_LIMIT = document.getElementById("vocabulary_search_limit");
  VOCABULARY_SEARCH_SORT = document.getElementById("vocabulary_search_sort");
  VOCABULARY_SELECTED_TAGS = document.getElementById("vocabulary-selected-tags");
  VOCABULARY_TAG_BACKSPACE = document.getElementById("vocabulary-tag-backspace");
  VOCABULARY_TAG_CLEAR = document.getElementById("vocabulary-tag-clear");
  VOCABULARY_TAG_COPY = document.getElementById("vocabulary-tag-copy");
  VOCABULARY_MANUAL_TAG_ORIGINAL_INPUT = document.getElementById("vocabulary-manual-tag-original-input");
  VOCABULARY_MANUAL_TAG_TRANSLATION_INPUT = document.getElementById("vocabulary-manual-tag-translation-input");
  VOCABULARY_MANUAL_TAG_ADD_BTN = document.getElementById("vocabulary-manual-tag-add-btn");
  VOCABULARY_MANUAL_TAGS_LIST = document.getElementById("vocabulary-manual-tags-list");
  VOCABULARY_MANUAL_TAGS_REFRESH_BTN = document.getElementById("vocabulary-manual-tags-refresh-btn");
  VOCABULARY_INSTALL_ALL_BTN.addEventListener("click", installAllVocabularies);
  VOCABULARY_UNINSTALL_ALL_BTN.addEventListener("click", uninstallAllVocabularies);
  VOCABULARY_SEARCH_BTN.addEventListener("click", searchTags);
  VOCABULARY_SEARCH_INPUT.addEventListener("keypress", _0x5d24f6 => {
    if (_0x5d24f6.key === "Enter") {
      searchTags();
    }
  });
  VOCABULARY_TAG_BACKSPACE.addEventListener("click", handleTagBackspace);
  VOCABULARY_TAG_CLEAR.addEventListener("click", handleTagClear);
  VOCABULARY_TAG_COPY.addEventListener("click", handleTagCopy);
  VOCABULARY_MANUAL_TAG_ADD_BTN.addEventListener("click", handleManualTagAdd);
  VOCABULARY_MANUAL_TAGS_REFRESH_BTN.addEventListener("click", renderManualTags);
  const _0x29d600 = _0xf16b48 => {
    if (_0xf16b48.key === "Enter") {
      handleManualTagAdd();
    }
  };
  VOCABULARY_MANUAL_TAG_ORIGINAL_INPUT.addEventListener("keypress", _0x29d600);
  VOCABULARY_MANUAL_TAG_TRANSLATION_INPUT.addEventListener("keypress", _0x29d600);
  renderVocabularyList();
  buildTagTree();
  renderManualTags();
}