import { extension_settings } from "../../../../../../extensions.js";
import { extensionName } from "../../config.js";
const SEARCH_CONFIG = {
  presets: [{
    selectId: "character_preset_id",
    searchId: "character_preset_search",
    placeholder: "搜索角色预设...",
    dataSource: "characterPresets",
    hasNames: true,
    defaultOption: "-- 无 --"
  }, {
    selectId: "outfit_preset_id",
    searchId: "outfit_preset_search",
    placeholder: "搜索服装预设...",
    dataSource: "outfitPresets",
    hasNames: true,
    defaultOption: "-- 无 --"
  }, {
    selectId: "character_enable_preset_id",
    searchId: "character_enable_preset_search",
    placeholder: "搜索角色启用预设...",
    dataSource: "characterEnablePresets",
    hasNames: false,
    defaultOption: "-- 无 --"
  }, {
    selectId: "outfit_enable_preset_id",
    searchId: "outfit_enable_preset_search",
    placeholder: "搜索服装启用预设...",
    dataSource: "outfitEnablePresets",
    hasNames: false,
    defaultOption: "-- 无 --"
  }, {
    selectId: "character_common_preset_id",
    searchId: "character_common_preset_search",
    placeholder: "搜索通用角色预设...",
    dataSource: "characterCommonPresets",
    hasNames: false,
    defaultOption: "-- 无 --"
  }, {
    selectId: "banana_char_preset_id",
    searchId: "banana_char_preset_search",
    placeholder: "搜索Banana角色预设...",
    dataSource: "bananaCharacterPresets",
    hasNames: false,
    defaultOption: "-- 无 --"
  }],
  selectors: [{
    selectId: "char_outfit_selector",
    searchId: "char_outfit_selector_search",
    placeholder: "搜索服装...",
    dataSource: "outfitPresets",
    hasNames: true,
    defaultOption: "-- 选择服装 --"
  }, {
    selectId: "character_enable_selector",
    searchId: "character_enable_selector_search",
    placeholder: "搜索角色...",
    dataSource: "characterPresets",
    hasNames: true,
    defaultOption: "-- 选择角色 --"
  }, {
    selectId: "outfit_enable_selector",
    searchId: "outfit_enable_selector_search",
    placeholder: "搜索服装...",
    dataSource: "outfitPresets",
    hasNames: true,
    defaultOption: "-- 选择服装 --"
  }, {
    selectId: "character_common_selector",
    searchId: "character_common_selector_search",
    placeholder: "搜索角色...",
    dataSource: "characterPresets",
    hasNames: true,
    defaultOption: "-- 选择角色 --"
  }]
};
function createSearchInput(_0x31544a, _0xae19d1) {
  let _0x28e93b = document.getElementById(_0xae19d1.searchId);
  if (_0x28e93b) {
    return _0x28e93b;
  }
  _0x28e93b = document.createElement("input");
  _0x28e93b.type = "text";
  _0x28e93b.id = _0xae19d1.searchId;
  _0x28e93b.className = "st-chatu8-text-input st-chatu8-select-search";
  _0x28e93b.placeholder = _0xae19d1.placeholder;
  const _0x29485b = _0x31544a.parentElement;
  if (!_0x29485b) {
    return _0x28e93b;
  }
  if (_0x29485b.classList.contains("st-chatu8-profile-controls")) {
    const _0x52a67e = _0x29485b.parentElement;
    if (_0x52a67e) {
      _0x52a67e.insertBefore(_0x28e93b, _0x29485b);
    }
  } else {
    const _0x58ac4a = _0x29485b.parentElement;
    if (_0x58ac4a) {
      _0x58ac4a.insertBefore(_0x28e93b, _0x29485b);
    }
  }
  return _0x28e93b;
}
function matchesSearch(_0x45dd0a, _0x349b2f, _0x3db67f, _0x4a87b3) {
  const _0x25b043 = _0x3db67f.toLowerCase();
  if (_0x45dd0a.toLowerCase().includes(_0x25b043)) {
    return true;
  }
  if (_0x4a87b3 && _0x349b2f) {
    if (_0x349b2f.nameCN && _0x349b2f.nameCN.toLowerCase().includes(_0x25b043)) {
      return true;
    }
    if (_0x349b2f.nameEN && _0x349b2f.nameEN.toLowerCase().includes(_0x25b043)) {
      return true;
    }
  }
  return false;
}
function filterSelectOptions(_0x35030b, _0x5c3a6c, _0x14230c) {
  const _0x84b571 = extension_settings[extensionName];
  const _0x403f6d = _0x84b571[_0x5c3a6c.dataSource] || {};
  const _0x3d53b = _0x35030b.value;
  _0x35030b.innerHTML = "";
  if (_0x5c3a6c.defaultOption) {
    const _0x1fa7b9 = document.createElement("option");
    _0x1fa7b9.value = "";
    _0x1fa7b9.textContent = _0x5c3a6c.defaultOption;
    _0x35030b.add(_0x1fa7b9);
  }
  const _0x5a36e6 = [];
  for (const _0x4d4063 in _0x403f6d) {
    const _0x2f00b6 = _0x403f6d[_0x4d4063];
    if (!_0x14230c || matchesSearch(_0x4d4063, _0x2f00b6, _0x14230c, _0x5c3a6c.hasNames)) {
      const _0x55e4b3 = document.createElement("option");
      _0x55e4b3.value = _0x4d4063;
      if (_0x5c3a6c.hasNames && _0x2f00b6 && (_0x2f00b6.nameCN || _0x2f00b6.nameEN)) {
        const _0x830dd7 = [_0x4d4063];
        if (_0x2f00b6.nameCN || _0x2f00b6.nameEN) {
          const _0x5e030d = [_0x2f00b6.nameCN, _0x2f00b6.nameEN].filter(Boolean).join(" / ");
          _0x830dd7.push("(" + _0x5e030d + ")");
        }
        _0x55e4b3.textContent = _0x830dd7.join(" ");
      } else {
        _0x55e4b3.textContent = _0x4d4063;
      }
      _0x35030b.add(_0x55e4b3);
      _0x5a36e6.push(_0x4d4063);
    }
  }
  if (_0x14230c && _0x5c3a6c.defaultOption) {
    _0x35030b.value = "";
  } else if (_0x3d53b && _0x5a36e6.includes(_0x3d53b)) {
    _0x35030b.value = _0x3d53b;
  } else if (_0x14230c && _0x5a36e6.length === 1) {
    _0x35030b.value = _0x5a36e6[0];
  } else if (_0x35030b.options.length > 0) {
    _0x35030b.selectedIndex = 0;
  }
}
function initSelectSearch(_0x13da1f) {
  const _0x69fcc1 = document.getElementById(_0x13da1f.selectId);
  if (!_0x69fcc1) {
    return;
  }
  const _0x2f2a9d = createSearchInput(_0x69fcc1, _0x13da1f);
  _0x2f2a9d.addEventListener("input", _0x491dc1 => {
    const _0xe10baf = _0x491dc1.target.value.trim();
    filterSelectOptions(_0x69fcc1, _0x13da1f, _0xe10baf);
  });
  setTimeout(() => {
    filterSelectOptions(_0x69fcc1, _0x13da1f, "");
  }, 500);
}
export function initAllSelectSearch(_0x4073f0) {
  SEARCH_CONFIG.presets.forEach(_0x1cb9de => {
    initSelectSearch(_0x1cb9de);
  });
  SEARCH_CONFIG.selectors.forEach(_0x34e8f5 => {
    initSelectSearch(_0x34e8f5);
  });
}
export function refreshSelectSearch(_0x56e428) {
  const _0x4043ac = [...SEARCH_CONFIG.presets, ...SEARCH_CONFIG.selectors];
  const _0x4d0c53 = _0x4043ac.find(_0x6d8964 => _0x6d8964.selectId === _0x56e428);
  if (!_0x4d0c53) {
    return;
  }
  const _0x530d5e = document.getElementById(_0x4d0c53.searchId);
  const _0x5104ca = document.getElementById(_0x4d0c53.selectId);
  if (!_0x5104ca) {
    return;
  }
  const _0x555b5b = _0x530d5e ? _0x530d5e.value.trim() : "";
  filterSelectOptions(_0x5104ca, _0x4d0c53, _0x555b5b);
}
export function clearSelectSearch(_0x223bc3) {
  const _0x4c6696 = [...SEARCH_CONFIG.presets, ...SEARCH_CONFIG.selectors];
  const _0x1f656c = _0x4c6696.find(_0x5242bf => _0x5242bf.selectId === _0x223bc3);
  if (!_0x1f656c) {
    return;
  }
  const _0x453284 = document.getElementById(_0x1f656c.searchId);
  if (_0x453284) {
    _0x453284.value = "";
  }
  refreshSelectSearch(_0x223bc3);
}
export function refreshAllSelectSearch() {
  const _0x11075d = [...SEARCH_CONFIG.presets, ...SEARCH_CONFIG.selectors];
  _0x11075d.forEach(_0x48e7c7 => {
    const _0xf0f458 = document.getElementById(_0x48e7c7.searchId);
    const _0x454b9f = document.getElementById(_0x48e7c7.selectId);
    if (!_0x454b9f) {
      return;
    }
    const _0x42a08f = _0xf0f458 ? _0xf0f458.value.trim() : "";
    filterSelectOptions(_0x454b9f, _0x48e7c7, _0x42a08f);
  });
}