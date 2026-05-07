import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { getSuffix, stylInput, stylishConfirm } from "../ui_common.js";
import { parsePromptStringWithCoordinates } from "../utils.js";
import { dbs } from "../database.js";
import { callTranslation, parseTranslationResult, tagsToJsonString } from "../ai.js";
import { showPresetVisualSelector } from "./presetVisualSelector.js";
import { getConfigImage, saveConfigImage } from "../configDatabase.js";
export const generationTabs = ["sd", "novelai", "comfyui"];
function stripChineseAnnotations(_0x1adefb) {
  if (!_0x1adefb) {
    return "";
  }
  return _0x1adefb.replace(/（[^）]*）/g, "");
}
async function translateAndAnnotateField(_0x6bd7c3, _0x278287) {
  const _0x5cbaa5 = document.getElementById(_0x6bd7c3 + _0x278287);
  if (!_0x5cbaa5) {
    return;
  }
  const _0x462f7b = document.getElementById("translate_" + _0x6bd7c3 + _0x278287);
  try {
    if (_0x462f7b) {
      _0x462f7b.disabled = true;
      const _0x3fc964 = _0x462f7b.querySelector("i");
      if (_0x3fc964) {
        _0x3fc964.classList.remove("fa-language");
        _0x3fc964.classList.add("fa-spinner", "fa-spin");
      }
    }
    const _0x5e38e5 = _0x5cbaa5.value || "";
    const _0x19d732 = stripChineseAnnotations(_0x5e38e5).replace(/，/g, ",").replace(/[\r\n]+/g, ",");
    const _0xf4c11c = _0x3ce80d => {
      const _0x3bb42f = [];
      let _0x9d89db = "";
      let _0x4b217a = false;
      for (let _0x105d1b = 0; _0x105d1b < _0x3ce80d.length; _0x105d1b++) {
        const _0x6b8e0a = _0x3ce80d[_0x105d1b];
        if (_0x6b8e0a === "$") {
          _0x4b217a = !_0x4b217a;
          _0x9d89db += _0x6b8e0a;
        } else if ((_0x6b8e0a === "," || _0x6b8e0a === "，") && !_0x4b217a) {
          const _0x4f40c0 = _0x9d89db.trim();
          if (_0x4f40c0) {
            _0x3bb42f.push(_0x4f40c0);
          }
          _0x9d89db = "";
        } else {
          _0x9d89db += _0x6b8e0a;
        }
      }
      if (_0x9d89db.trim()) {
        _0x3bb42f.push(_0x9d89db.trim());
      }
      return _0x3bb42f;
    };
    const _0x87551d = _0xa89f73 => {
      return _0xa89f73.startsWith("$") && _0xa89f73.endsWith("$");
    };
    const _0x4438b7 = _0x2302c5 => {
      return _0x2302c5.replace(/^[\{\[\(\<]+|[\}\]\)\>]+$/g, "").replace(/^\{+|\}+$/g, "").replace(/:[\d.]+$/, "").trim();
    };
    let _0x295b0c = [];
    if (_0x19d732.includes("Scene Composition")) {
      const _0x2018cf = parsePromptStringWithCoordinates(_0x19d732);
      const _0x4e414b = ["Scene Composition", "Character 1 Prompt", "Character 1 UC", "Character 2 Prompt", "Character 2 UC", "Character 3 Prompt", "Character 3 UC", "Character 4 Prompt", "Character 4 UC"];
      _0x4e414b.forEach(_0x5d71e2 => {
        const _0x5d60cb = _0x2018cf?.[_0x5d71e2];
        if (typeof _0x5d60cb === "string" && _0x5d60cb.trim()) {
          _0xf4c11c(_0x5d60cb).forEach(_0x584e95 => {
            if (_0x584e95 && !_0x87551d(_0x584e95)) {
              _0x295b0c.push(_0x584e95);
            }
          });
        }
      });
    } else {
      _0x295b0c = _0xf4c11c(_0x19d732).filter(_0x548e1c => !_0x87551d(_0x548e1c));
    }
    _0x295b0c = Array.from(new Set(_0x295b0c));
    if (_0x295b0c.length === 0) {
      toastr.info("没有可翻译的标签。");
      return;
    }
    const _0x97c266 = [];
    for (const _0x454400 of _0x295b0c) {
      const _0x300552 = _0x4438b7(_0x454400);
      if (_0x300552) {
        _0x97c266.push(_0x300552);
      }
    }
    const _0x2849bf = tagsToJsonString(Array.from(new Set(_0x97c266)));
    const _0x594816 = await callTranslation(_0x2849bf);
    const _0x4ab959 = parseTranslationResult(_0x594816);
    const _0x27ebf6 = _0xf4c11c(_0x19d732);
    const _0x36e015 = _0x27ebf6.map(_0x5f2413 => {
      if (_0x5f2413.startsWith("$") && _0x5f2413.endsWith("$")) {
        return _0x5f2413;
      }
      const _0x47b374 = _0x4438b7(_0x5f2413);
      if (_0x4ab959[_0x47b374]) {
        return _0x5f2413 + "（" + _0x4ab959[_0x47b374] + "）";
      }
      if (_0x4ab959[_0x5f2413]) {
        return _0x5f2413 + "（" + _0x4ab959[_0x5f2413] + "）";
      }
      return _0x5f2413;
    });
    let _0x275493 = _0x36e015.join(", ");
    const _0x524761 = ["Scene Composition:", "Character 1 Prompt:", "Character 1 UC:", "Character 1 coordinates:", "Character 2 Prompt:", "Character 2 UC:", "Character 2 coordinates:", "Character 3 Prompt:", "Character 3 UC:", "Character 3 coordinates:", "Character 4 Prompt:", "Character 4 UC:", "Character 4 coordinates:"];
    const _0x1a8ac5 = _0x524761.some(_0x2a4247 => _0x275493.includes(_0x2a4247));
    if (_0x1a8ac5) {
      for (const _0x4c512d of _0x524761) {
        _0x275493 = _0x275493.replace(new RegExp("(?<!^)\\s*" + _0x4c512d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "\n\n" + _0x4c512d);
      }
      _0x275493 = _0x275493.replace(/^\s+/, "").replace(/\n{3,}/g, "\n\n");
    }
    _0x5cbaa5.value = _0x275493;
    $(_0x5cbaa5).trigger("input");
    toastr.success("翻译完成");
  } catch (_0x96113c) {
    console.error("Tag translation failed:", _0x96113c);
    alert("翻译失败：" + (_0x96113c.message || _0x96113c));
  } finally {
    if (_0x462f7b) {
      _0x462f7b.disabled = false;
      const _0x18911d = _0x462f7b.querySelector("i");
      if (_0x18911d) {
        _0x18911d.classList.remove("fa-spinner", "fa-spin");
        _0x18911d.classList.add("fa-language");
      }
    }
  }
}
async function handleAutocomplete(_0x566b25, _0xadcdb0) {
  const _0x517c0e = _0x566b25.value;
  const _0x2d2b89 = _0x566b25.selectionStart;
  const _0x403636 = _0x517c0e.substring(0, _0x2d2b89);
  const _0x3783e3 = _0x517c0e.substring(_0x2d2b89);
  const _0x5c055c = Math.max(_0x403636.lastIndexOf(","), _0x403636.lastIndexOf("，"));
  const _0x14b9cb = _0x3783e3.search(/[,，]/);
  const _0x578ab4 = _0x5c055c + 1;
  const _0x3304c6 = _0x14b9cb !== -1 ? _0x2d2b89 + _0x14b9cb : _0x517c0e.length;
  const _0xad3bfb = _0x517c0e.substring(_0x578ab4, _0x3304c6).trim();
  if (_0xad3bfb.length < 1) {
    _0xadcdb0.style.display = "none";
    return;
  }
  try {
    const _0x528705 = extension_settings[extensionName];
    const _0x174cd9 = String(_0x528705.vocabulary_search_startswith) === "true";
    const _0x1f95d6 = parseInt(_0x528705.vocabulary_search_limit, 10);
    const _0x3fbec9 = _0x528705.vocabulary_search_sort;
    const _0x1280da = {
      startsWith: _0x174cd9,
      limit: _0x1f95d6,
      sortBy: _0x3fbec9
    };
    const _0x36da41 = await dbs.searchTags(_0xad3bfb, _0x1280da);
    _0xadcdb0.innerHTML = "";
    if (_0x36da41.length > 0) {
      _0x36da41.forEach(_0x467e13 => {
        const _0x5740a7 = document.createElement("div");
        _0x5740a7.className = "ch-autocomplete-item";
        _0x5740a7.textContent = _0x467e13.name + " (" + _0x467e13.translation + ")";
        _0x5740a7.addEventListener("click", () => handleResultClick(_0x566b25, _0xadcdb0, _0x467e13));
        _0xadcdb0.appendChild(_0x5740a7);
      });
      _0xadcdb0.style.display = "block";
    } else {
      _0xadcdb0.style.display = "none";
    }
  } catch (_0x33289d) {
    console.error("Tag search failed:", _0x33289d);
    _0xadcdb0.style.display = "none";
  }
}
function handleResultClick(_0x5597bf, _0x125b9c, _0x4e3aa5) {
  const _0x454b8b = _0x5597bf.value;
  const _0x16d3a1 = _0x5597bf.selectionStart;
  const _0x3f7850 = _0x454b8b.substring(0, _0x16d3a1);
  const _0xde3967 = _0x454b8b.substring(_0x16d3a1);
  const _0x5ac911 = Math.max(_0x3f7850.lastIndexOf(","), _0x3f7850.lastIndexOf("，"));
  const _0x4368a9 = _0xde3967.search(/[,，]/);
  const _0x5919a9 = _0x5ac911 + 1;
  const _0x22ee94 = _0x4368a9 !== -1 ? _0x16d3a1 + _0x4368a9 : _0x454b8b.length;
  const _0x2695d1 = _0x4e3aa5.name + "（" + _0x4e3aa5.translation + "）";
  const _0x37938a = _0x454b8b.substring(0, _0x5919a9);
  const _0x1c8bbc = _0x454b8b.substring(_0x22ee94);
  const _0x5290a6 = _0x454b8b.substring(_0x5919a9, _0x5919a9 + 1) === " " ? " " : "";
  const _0x251f05 = _0x1c8bbc.trim();
  const _0x20ae55 = _0x251f05.length > 0 && !_0x251f05.startsWith(",") ? ", " : "";
  const _0x417f1b = "" + (_0x37938a.trim() ? _0x37938a : "") + _0x5290a6 + _0x2695d1 + _0x20ae55 + (_0x1c8bbc.trim() ? _0x1c8bbc : "");
  _0x5597bf.value = _0x417f1b.replace(/，/g, ",");
  _0x125b9c.style.display = "none";
  _0x5597bf.focus();
  const _0xb8948c = (_0x37938a + _0x5290a6 + _0x2695d1 + _0x20ae55).length;
  setTimeout(() => _0x5597bf.setSelectionRange(_0xb8948c, _0xb8948c), 0);
}
export function initPromptSettings(_0x46bf75, _0x30a630) {
  document.addEventListener("click", _0x1db1f3 => {
    if (!_0x1db1f3.target.closest(".st-chatu8-field-col")) {
      $(".ch-autocomplete-results").hide();
    }
  });
  generationTabs.forEach(_0x3c781a => {
    const _0x12005a = getSuffix(_0x3c781a);
    _0x46bf75.find("#yusheid" + _0x12005a).on("change", () => st_chatu8_tishici_change(_0x3c781a, _0x30a630));
    _0x46bf75.find("#st_chatu8_tishici_save_style" + _0x12005a).on("click", () => st_chatu8_tishici_save(_0x3c781a, _0x30a630));
    _0x46bf75.find("#st_chatu8_tishici_update_style" + _0x12005a).on("click", () => st_chatu8_tishici_update(_0x3c781a, _0x30a630));
    _0x46bf75.find("#st_chatu8_tishici_delete_style" + _0x12005a).on("click", () => st_chatu8_tishici_delete(_0x3c781a, _0x30a630));
    _0x46bf75.find("#st_chatu8_tishici_export_current" + _0x12005a).on("click", () => st_chatu8_tishici_export_current(_0x30a630));
    _0x46bf75.find("#st_chatu8_tishici_export_all" + _0x12005a).on("click", () => st_chatu8_tishici_export_all(_0x30a630));
    _0x46bf75.find("#st_chatu8_tishici_import" + _0x12005a).on("click", () => st_chatu8_tishici_import(_0x30a630));
    _0x46bf75.find("#st_chatu8_tishici_visual_select" + _0x12005a).on("click", () => {
      showPresetVisualSelector(_0x3c781a, _0x30a630, _0x49d5b6 => {
        const _0x5bcb7d = document.getElementById("yusheid" + _0x12005a);
        if (_0x5bcb7d) {
          _0x5bcb7d.value = _0x49d5b6;
          $(_0x5bcb7d).trigger("change");
        }
      });
    });
    const _0x40c362 = ["#fixedPrompt" + _0x12005a, "#fixedPrompt_end" + _0x12005a, "#negativePrompt" + _0x12005a];
    _0x40c362.forEach(_0x245039 => {
      const _0x5d36e5 = $(_0x245039)[0];
      const _0x339e02 = $(_0x245039 + "-results")[0];
      if (_0x5d36e5 && _0x339e02) {
        $(_0x5d36e5).on("input", () => handleAutocomplete(_0x5d36e5, _0x339e02));
        $(_0x5d36e5).on("click", _0x2f8f65 => _0x2f8f65.stopPropagation());
      }
    });
    $("#fixedPrompt" + _0x12005a + ", #fixedPrompt_end" + _0x12005a + ", #negativePrompt" + _0x12005a).on("input", function () {
      const _0x34c0de = "yusheid" + (_0x3c781a === "sd" ? "_sd" : _0x12005a);
      const _0x2fb38e = _0x30a630[_0x34c0de];
      const _0x4e3e73 = _0x30a630.yushe[_0x2fb38e] || {};
      const _0x1070b2 = $(this).attr("id").replace(_0x12005a, "");
      const _0x134ea4 = $(this).val() !== (_0x4e3e73[_0x1070b2] ?? "");
      const _0x1ef397 = $(this).closest(".st-chatu8-field-col").find(".st-chatu8-unsaved-warning");
      if (_0x134ea4) {
        $(_0x1ef397).show();
      } else {
        $(_0x1ef397).hide();
      }
    });
    _0x46bf75.find("#translate_fixedPrompt" + _0x12005a).on("click", () => translateAndAnnotateField("fixedPrompt", _0x12005a));
    _0x46bf75.find("#translate_fixedPrompt_end" + _0x12005a).on("click", () => translateAndAnnotateField("fixedPrompt_end", _0x12005a));
  });
}
function st_chatu8_tishici_change(_0x5eb850, _0x25d071) {
  const _0x50c743 = getSuffix(_0x5eb850);
  const _0x11adc6 = document.getElementById("yusheid" + _0x50c743);
  const _0x1faea6 = _0x11adc6.value;
  const _0x2e8922 = "yusheid" + (_0x5eb850 === "sd" ? "_sd" : _0x50c743);
  const _0x3e3fe2 = _0x25d071[_0x2e8922];
  if (_0x1faea6 === _0x3e3fe2) {
    return;
  }
  const _0x3c25e8 = _0x25d071.yushe[_0x3e3fe2] || {};
  const _0x30e3fa = document.getElementById("fixedPrompt" + _0x50c743).value;
  const _0x4905fe = document.getElementById("fixedPrompt_end" + _0x50c743).value;
  const _0x396d35 = document.getElementById("negativePrompt" + _0x50c743).value;
  const _0x37ea3b = _0x30e3fa !== (_0x3c25e8.fixedPrompt ?? "") || _0x4905fe !== (_0x3c25e8.fixedPrompt_end ?? "") || _0x396d35 !== (_0x3c25e8.negativePrompt ?? "");
  const _0x4e6193 = () => {
    _0x25d071[_0x2e8922] = _0x1faea6;
    saveSettingsDebounced();
    const _0x503fa1 = _0x25d071.yushe[_0x1faea6] || {};
    document.getElementById("fixedPrompt" + _0x50c743).value = _0x503fa1.fixedPrompt ?? "";
    document.getElementById("fixedPrompt_end" + _0x50c743).value = _0x503fa1.fixedPrompt_end ?? "";
    document.getElementById("negativePrompt" + _0x50c743).value = _0x503fa1.negativePrompt ?? "";
    const _0x1fe85a = ["fixedPrompt", "fixedPrompt_end", "negativePrompt"];
    _0x1fe85a.forEach(_0x850e07 => {
      const _0x55dbb1 = document.getElementById(_0x850e07 + _0x50c743);
      const _0x17191f = _0x55dbb1.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
      if (_0x17191f) {
        $(_0x17191f).hide();
      }
    });
  };
  if (_0x37ea3b) {
    stylishConfirm("您有未保存的更改。要放弃这些更改并切换预设吗？").then(_0xe59ebc => {
      if (_0xe59ebc) {
        _0x4e6193();
      } else {
        _0x11adc6.value = _0x3e3fe2;
      }
    });
  } else {
    _0x4e6193();
  }
}
function st_chatu8_tishici_save(_0x35ddd4, _0x400e72) {
  const _0x53fdb6 = getSuffix(_0x35ddd4);
  stylInput("请输入新配置的名称").then(_0xb5d2e => {
    if (_0xb5d2e && _0xb5d2e.trim() !== "") {
      const _0x592ee2 = document.getElementById("fixedPrompt" + _0x53fdb6).value;
      const _0x3754de = document.getElementById("fixedPrompt_end" + _0x53fdb6).value;
      const _0x45bd09 = document.getElementById("negativePrompt" + _0x53fdb6).value;
      const _0x32d12d = "yusheid" + (_0x35ddd4 === "sd" ? "_sd" : _0x53fdb6);
      _0x400e72.yushe[_0xb5d2e] = {
        ...(_0x400e72.yushe[_0xb5d2e] || {}),
        fixedPrompt: _0x592ee2,
        fixedPrompt_end: _0x3754de,
        negativePrompt: _0x45bd09
      };
      _0x400e72[_0x32d12d] = _0xb5d2e;
      saveSettingsDebounced();
      window.loadSilterTavernChatu8Settings();
      alert("预设 \"" + _0xb5d2e + "\" 已保存。");
    }
  });
}
function st_chatu8_tishici_update(_0x162873, _0x377868) {
  const _0x23b684 = getSuffix(_0x162873);
  const _0xb7b8a6 = "yusheid" + (_0x162873 === "sd" ? "_sd" : _0x23b684);
  const _0x49793d = _0x377868[_0xb7b8a6];
  if (!_0x49793d || !_0x377868.yushe[_0x49793d]) {
    alert("没有活动的预设可保存。请先“另存为”一个新预设。");
    return;
  }
  stylishConfirm("确定要覆盖当前预设 \"" + _0x49793d + "\" 吗？").then(_0x209ad8 => {
    if (_0x209ad8) {
      const _0x260ef3 = document.getElementById("fixedPrompt" + _0x23b684).value;
      const _0xc13ce1 = document.getElementById("fixedPrompt_end" + _0x23b684).value;
      const _0x530b39 = document.getElementById("negativePrompt" + _0x23b684).value;
      _0x377868.yushe[_0x49793d] = {
        ..._0x377868.yushe[_0x49793d],
        fixedPrompt: _0x260ef3,
        fixedPrompt_end: _0xc13ce1,
        negativePrompt: _0x530b39
      };
      saveSettingsDebounced();
      const _0x3b399f = ["fixedPrompt", "fixedPrompt_end", "negativePrompt"];
      _0x3b399f.forEach(_0x2aa153 => {
        const _0x47fdf3 = document.getElementById(_0x2aa153 + _0x23b684);
        const _0x3da6b0 = _0x47fdf3.closest(".st-chatu8-field-col").querySelector(".st-chatu8-unsaved-warning");
        if (_0x3da6b0) {
          $(_0x3da6b0).hide();
        }
      });
    }
  });
}
function st_chatu8_tishici_delete(_0x577b7b, _0x562a67) {
  const _0x479092 = getSuffix(_0x577b7b);
  const _0x5c3038 = document.getElementById("yusheid" + _0x479092);
  const _0x482fa6 = _0x5c3038.value;
  const _0xc44ea1 = "yusheid" + (_0x577b7b === "sd" ? "_sd" : _0x479092);
  if (_0x482fa6 === "默认") {
    alert("默认配置不能删除");
    return;
  }
  const _0x25846f = [];
  const _0x362521 = {
    sd: {
      key: "yusheid_sd",
      name: "SD"
    },
    novelai: {
      key: "yusheid_novelai",
      name: "NovelAI"
    },
    comfyui: {
      key: "yusheid_comfyui",
      name: "ComfyUI"
    }
  };
  for (const _0x39f787 in _0x362521) {
    if (_0x39f787 === _0x577b7b) {
      continue;
    }
    const _0x2bf3fd = _0x362521[_0x39f787];
    if (_0x562a67[_0x2bf3fd.key] === _0x482fa6) {
      _0x25846f.push(_0x2bf3fd.name);
    }
  }
  if (_0x25846f.length > 0) {
    alert("无法删除预设 \"" + _0x482fa6 + "\"，因为它正在被以下模式使用：" + _0x25846f.join("、 ") + "。\n请先在这些模式中切换到其他预设。");
    return;
  }
  stylishConfirm("是否确定删除").then(_0xa9e046 => {
    if (_0xa9e046) {
      Reflect.deleteProperty(_0x562a67.yushe, _0x482fa6);
      _0x562a67[_0xc44ea1] = "默认";
      saveSettingsDebounced();
      window.loadSilterTavernChatu8Settings();
    }
  });
}
async function st_chatu8_tishici_export_current(_0x48e697) {
  const _0x970fe3 = document.querySelector(".st-chatu8-tab-content.active").id.replace("ch-tab-", "");
  const _0x4d58eb = getSuffix(_0x970fe3);
  let _0x35528a = "";
  if (_0x4d58eb.includes("sd")) {
    _0x35528a = "yusheid_sd";
  }
  if (_0x4d58eb.includes("novelai")) {
    _0x35528a = "yusheid_novelai";
  }
  if (_0x4d58eb.includes("comfyui")) {
    _0x35528a = "yusheid_comfyui";
  }
  const _0x5322cc = _0x48e697[_0x35528a];
  if (!_0x5322cc || !_0x48e697.yushe[_0x5322cc]) {
    alert("没有选中的预设可导出。");
    return;
  }
  const _0x512963 = _0x48e697.yushe[_0x5322cc];
  const _0xc0be50 = {
    [_0x5322cc]: _0x512963
  };
  const _0x30b5db = {
    presets: _0xc0be50,
    images: {}
  };
  const _0xad9ea3 = _0x30b5db;
  if (_0x512963.previewImageId) {
    try {
      const _0x3346db = await getConfigImage(_0x512963.previewImageId);
      if (_0x3346db) {
        _0xad9ea3.images[_0x512963.previewImageId] = _0x3346db;
      }
    } catch (_0x2c970c) {
      console.error("[Prompt] 获取图片 " + _0x512963.previewImageId + " 失败:", _0x2c970c);
    }
  }
  const _0x56351d = JSON.stringify(_0xad9ea3, null, 2);
  const _0x596f61 = new Blob([_0x56351d], {
    type: "application/json"
  });
  const _0x2be164 = URL.createObjectURL(_0x596f61);
  const _0x45741b = document.createElement("a");
  _0x45741b.href = _0x2be164;
  _0x45741b.download = "st-chatu8-prompt-preset-" + _0x5322cc + ".json";
  document.body.appendChild(_0x45741b);
  _0x45741b.click();
  document.body.removeChild(_0x45741b);
  URL.revokeObjectURL(_0x2be164);
}
async function st_chatu8_tishici_export_all(_0x459888) {
  if (!_0x459888.yushe || Object.keys(_0x459888.yushe).length === 0) {
    alert("没有预设可导出。");
    return;
  }
  const _0x3b4303 = {
    presets: _0x459888.yushe,
    images: {}
  };
  const _0x19547e = _0x3b4303;
  const _0x16b05c = new Set();
  for (const _0x23f87d in _0x459888.yushe) {
    const _0x3cdbc8 = _0x459888.yushe[_0x23f87d];
    if (_0x3cdbc8.previewImageId) {
      _0x16b05c.add(_0x3cdbc8.previewImageId);
    }
  }
  if (_0x16b05c.size > 0) {
    for (const _0xcff14e of _0x16b05c) {
      try {
        const _0x34cfa6 = await getConfigImage(_0xcff14e);
        if (_0x34cfa6) {
          _0x19547e.images[_0xcff14e] = _0x34cfa6;
        }
      } catch (_0x4b76bb) {
        console.error("[Prompt] 获取图片 " + _0xcff14e + " 失败:", _0x4b76bb);
      }
    }
    console.log("[Prompt] 导出 " + Object.keys(_0x19547e.images).length + " 张图片");
  }
  const _0x4fa35d = JSON.stringify(_0x19547e, null, 2);
  const _0x4544b5 = new Blob([_0x4fa35d], {
    type: "application/json"
  });
  const _0x3cd9ee = URL.createObjectURL(_0x4544b5);
  const _0x384020 = document.createElement("a");
  _0x384020.href = _0x3cd9ee;
  _0x384020.download = "st-chatu8-prompt-presets-all.json";
  document.body.appendChild(_0x384020);
  _0x384020.click();
  document.body.removeChild(_0x384020);
  URL.revokeObjectURL(_0x3cd9ee);
}
function st_chatu8_tishici_import(_0x426c3b) {
  const _0x4a6625 = document.createElement("input");
  _0x4a6625.type = "file";
  _0x4a6625.accept = ".json";
  _0x4a6625.onchange = async _0x2b8f3a => {
    const _0x1e75b8 = _0x2b8f3a.target.files[0];
    if (!_0x1e75b8) {
      return;
    }
    const _0x2171fb = new FileReader();
    _0x2171fb.onload = async _0x521f9b => {
      try {
        const _0x5b12a0 = JSON.parse(_0x521f9b.target.result);
        let _0x5cdab7 = {};
        let _0x307a35 = _0x5b12a0.images || {};
        if (_0x5b12a0.presets) {
          _0x5cdab7 = _0x5b12a0.presets;
        } else {
          _0x5cdab7 = _0x5b12a0;
        }
        let _0x1b17e4 = 0;
        const _0x22bb5a = {};
        if (Object.keys(_0x307a35).length > 0) {
          console.log("[Prompt] 正在导入 " + Object.keys(_0x307a35).length + " 张图片...");
          for (const _0x52daed in _0x307a35) {
            try {
              const _0x5c33f8 = _0x307a35[_0x52daed];
              const _0x3be264 = await saveConfigImage(_0x5c33f8);
              _0x22bb5a[_0x52daed] = _0x3be264;
              _0x1b17e4++;
            } catch (_0x13e555) {
              console.error("[Prompt] 导入图片 " + _0x52daed + " 失败:", _0x13e555);
            }
          }
          console.log("[Prompt] 成功导入 " + _0x1b17e4 + " 张图片");
          for (const _0x4f7e16 in _0x5cdab7) {
            const _0x5e6e02 = _0x5cdab7[_0x4f7e16];
            if (_0x5e6e02.previewImageId && _0x22bb5a[_0x5e6e02.previewImageId]) {
              _0x5e6e02.previewImageId = _0x22bb5a[_0x5e6e02.previewImageId];
            }
          }
        }
        let _0x4c09e0 = 0;
        for (const _0x3c7007 in _0x5cdab7) {
          if (_0x5cdab7.hasOwnProperty(_0x3c7007)) {
            if (!_0x426c3b.yushe.hasOwnProperty(_0x3c7007)) {
              _0x4c09e0++;
            }
            _0x426c3b.yushe[_0x3c7007] = _0x5cdab7[_0x3c7007];
          }
        }
        saveSettingsDebounced();
        window.loadSilterTavernChatu8Settings();
        let _0x22afaf = "成功导入 " + Object.keys(_0x5cdab7).length + " 个预设，其中 " + _0x4c09e0 + " 个是全新的。";
        if (_0x1b17e4 > 0) {
          _0x22afaf += "\n同时导入 " + _0x1b17e4 + " 张图片。";
        }
        alert(_0x22afaf);
      } catch (_0x1449d3) {
        alert("导入失败，请确保文件是正确的JSON格式。");
        console.error("Error importing presets:", _0x1449d3);
      }
    };
    _0x2171fb.readAsText(_0x1e75b8);
  };
  _0x4a6625.click();
}