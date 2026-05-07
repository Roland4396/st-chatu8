import { extension_settings } from "../../../../../../extensions.js";
import { extensionName } from "../../config.js";
import { dbs } from "../../database.js";
async function handleAutocomplete(_0x44fc38, _0x293cf5) {
  const _0x5d9945 = _0x44fc38.value;
  const _0x178205 = _0x44fc38.selectionStart;
  const _0x5c1fbe = _0x5d9945.substring(0, _0x178205);
  const _0x576622 = _0x5d9945.substring(_0x178205);
  const _0x1531d7 = Math.max(_0x5c1fbe.lastIndexOf(","), _0x5c1fbe.lastIndexOf("，"));
  const _0x869977 = _0x576622.search(/[,，]/);
  const _0x475d11 = _0x1531d7 + 1;
  const _0x237086 = _0x869977 !== -1 ? _0x178205 + _0x869977 : _0x5d9945.length;
  const _0x447e79 = _0x5d9945.substring(_0x475d11, _0x237086).trim();
  if (_0x447e79.length < 1) {
    _0x293cf5.style.display = "none";
    return;
  }
  try {
    const _0x1ad671 = extension_settings[extensionName];
    const _0x2057b9 = String(_0x1ad671.vocabulary_search_startswith) === "true";
    const _0x49e025 = parseInt(_0x1ad671.vocabulary_search_limit, 10);
    const _0x1a0e03 = _0x1ad671.vocabulary_search_sort;
    const _0x373ff7 = {
      startsWith: _0x2057b9,
      limit: _0x49e025,
      sortBy: _0x1a0e03
    };
    const _0x30918c = await dbs.searchTags(_0x447e79, _0x373ff7);
    _0x293cf5.innerHTML = "";
    if (_0x30918c.length > 0) {
      _0x30918c.forEach(_0x1678ca => {
        const _0x206ed0 = document.createElement("div");
        _0x206ed0.className = "ch-autocomplete-item";
        _0x206ed0.textContent = _0x1678ca.name + " (" + _0x1678ca.translation + ")";
        _0x206ed0.dataset.tagName = _0x1678ca.name;
        _0x206ed0.dataset.tagTranslation = _0x1678ca.translation;
        _0x293cf5.appendChild(_0x206ed0);
      });
      _0x293cf5.style.display = "block";
    } else {
      _0x293cf5.style.display = "none";
    }
  } catch (_0x3f672e) {
    console.error("Tag search failed:", _0x3f672e);
    _0x293cf5.style.display = "none";
  }
}
function handleResultClick(_0x50c441, _0x2efdec, _0x470dba) {
  const _0x2891a9 = _0x50c441.value;
  const _0x810867 = _0x50c441.selectionStart;
  const _0x1643bc = _0x2891a9.substring(0, _0x810867);
  const _0x5d63f2 = _0x2891a9.substring(_0x810867);
  const _0x35f4f3 = Math.max(_0x1643bc.lastIndexOf(","), _0x1643bc.lastIndexOf("，"));
  const _0x2e5591 = _0x5d63f2.search(/[,，]/);
  const _0x553f6 = _0x35f4f3 + 1;
  const _0x563565 = _0x2e5591 !== -1 ? _0x810867 + _0x2e5591 : _0x2891a9.length;
  const _0x265435 = _0x470dba.name + "（" + _0x470dba.translation + "）";
  const _0x58635a = _0x2891a9.substring(0, _0x553f6);
  const _0x334414 = _0x2891a9.substring(_0x563565);
  const _0x4c7222 = _0x2891a9.substring(_0x553f6, _0x553f6 + 1) === " " ? " " : "";
  const _0x49802f = _0x334414.trim();
  const _0x2aa69d = _0x49802f.length > 0 && !_0x49802f.startsWith(",") ? ", " : "";
  const _0x109685 = "" + (_0x58635a.trim() ? _0x58635a : "") + _0x4c7222 + _0x265435 + _0x2aa69d + (_0x334414.trim() ? _0x334414 : "");
  _0x50c441.value = _0x109685.replace(/，/g, ",");
  _0x2efdec.style.display = "none";
  _0x50c441.focus();
  const _0x3a2da0 = (_0x58635a + _0x4c7222 + _0x265435 + _0x2aa69d).length;
  setTimeout(() => _0x50c441.setSelectionRange(_0x3a2da0, _0x3a2da0), 0);
  $(_0x50c441).trigger("input");
}
export function initTagAutocomplete() {
  console.log("[Character] Initializing tag autocomplete...");
  document.addEventListener("click", _0x331407 => {
    if (!_0x331407.target.closest(".st-chatu8-field-col") && !_0x331407.target.closest(".ch-autocomplete-results")) {
      $(".ch-autocomplete-results").hide();
    }
  });
  const _0x464c6b = ["char_photo_prompt", "char_characterTraits", "char_facialFeatures", "char_facialFeaturesBack", "char_upperBodySFW", "char_upperBodySFWBack", "char_fullBodySFW", "char_fullBodySFWBack", "char_upperBodyNSFW", "char_upperBodyNSFWBack", "char_fullBodyNSFW", "char_fullBodyNSFWBack"];
  _0x464c6b.forEach(_0x3eae5e => {
    const _0x4a7c63 = document.getElementById(_0x3eae5e);
    const _0x24b0ee = document.getElementById(_0x3eae5e + "-results");
    console.log("[Character] Field " + _0x3eae5e + ": textarea=" + !!_0x4a7c63 + ", results=" + !!_0x24b0ee);
    if (_0x4a7c63 && _0x24b0ee) {
      $(_0x4a7c63).off("input").on("input", () => handleAutocomplete(_0x4a7c63, _0x24b0ee));
      $(_0x4a7c63).off("click").on("click", _0x536a54 => _0x536a54.stopPropagation());
      $(_0x24b0ee).off("click").on("click", ".ch-autocomplete-item", function (_0x3c336f) {
        _0x3c336f.stopPropagation();
        const _0x51a21a = $(this).data("tagName");
        const _0x5cee13 = $(this).data("tagTranslation");
        if (_0x51a21a && _0x5cee13 !== undefined) {
          const _0xbfa1b = {
            name: _0x51a21a,
            translation: _0x5cee13
          };
          handleResultClick(_0x4a7c63, _0x24b0ee, _0xbfa1b);
        }
      });
      console.log("[Character] Successfully bound autocomplete to " + _0x3eae5e);
    } else {
      console.warn("[Character] Could not find elements for " + _0x3eae5e);
    }
  });
  const _0x2fb505 = ["outfit_upperBody", "outfit_upperBodyBack", "outfit_fullBody", "outfit_fullBodyBack"];
  _0x2fb505.forEach(_0x1e5743 => {
    const _0x34410f = document.getElementById(_0x1e5743);
    const _0x1abb2a = document.getElementById(_0x1e5743 + "-results");
    console.log("[Character] Field " + _0x1e5743 + ": textarea=" + !!_0x34410f + ", results=" + !!_0x1abb2a);
    if (_0x34410f && _0x1abb2a) {
      $(_0x34410f).off("input").on("input", () => handleAutocomplete(_0x34410f, _0x1abb2a));
      $(_0x34410f).off("click").on("click", _0xecdd57 => _0xecdd57.stopPropagation());
      $(_0x1abb2a).off("click").on("click", ".ch-autocomplete-item", function (_0x18c9c5) {
        _0x18c9c5.stopPropagation();
        const _0x477777 = $(this).data("tagName");
        const _0x48e026 = $(this).data("tagTranslation");
        if (_0x477777 && _0x48e026 !== undefined) {
          const _0x252709 = {
            name: _0x477777,
            translation: _0x48e026
          };
          handleResultClick(_0x34410f, _0x1abb2a, _0x252709);
        }
      });
      console.log("[Character] Successfully bound autocomplete to " + _0x1e5743);
    } else {
      console.warn("[Character] Could not find elements for " + _0x1e5743);
    }
  });
  console.log("[Character] Tag autocomplete initialized");
}