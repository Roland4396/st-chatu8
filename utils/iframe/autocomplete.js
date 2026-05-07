import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
import { dbs } from "../database.js";
export async function handleAutocomplete(_0x1ecef3, _0x566c50) {
  const _0x2c0b39 = _0x1ecef3.value;
  const _0x2c140a = _0x1ecef3.selectionStart;
  const _0x3eba8d = _0x2c0b39.substring(0, _0x2c140a);
  const _0x55fec2 = _0x2c0b39.substring(_0x2c140a);
  const _0x1512ed = _0x3eba8d.lastIndexOf(",");
  const _0xb5e667 = _0x55fec2.indexOf(",");
  const _0x4155fc = _0x1512ed + 1;
  const _0x2f8fa6 = _0xb5e667 !== -1 ? _0x2c140a + _0xb5e667 : _0x2c0b39.length;
  const _0x1ee333 = _0x2c0b39.substring(_0x4155fc, _0x2f8fa6).trim();
  if (_0x1ee333.length < 1) {
    _0x566c50.style.display = "none";
    return;
  }
  try {
    if (!extension_settings || !extension_settings[extensionName]) {
      console.warn("extension_settings not available.");
      return;
    }
    const _0x5e790f = extension_settings[extensionName];
    const _0x475540 = String(_0x5e790f.vocabulary_search_startswith) === "true";
    const _0x41211e = parseInt(_0x5e790f.vocabulary_search_limit, 10);
    const _0x2cf54e = _0x5e790f.vocabulary_search_sort;
    const _0x5e7a74 = dbs;
    const _0x5574d7 = {
      startsWith: _0x475540,
      limit: _0x41211e,
      sortBy: _0x2cf54e
    };
    const _0x35c297 = await _0x5e7a74.searchTags(_0x1ee333, _0x5574d7);
    _0x566c50.innerHTML = "";
    if (_0x35c297.length > 0) {
      _0x35c297.forEach(_0x5f3fba => {
        const _0x5d0567 = document.createElement("div");
        _0x5d0567.className = "ch-autocomplete-item";
        _0x5d0567.textContent = _0x5f3fba.name + " (" + _0x5f3fba.translation + ")";
        _0x5d0567.addEventListener("mousedown", _0x636b40 => {
          _0x636b40.preventDefault();
          handleResultClick(_0x1ecef3, _0x566c50, _0x5f3fba.name + "（" + _0x5f3fba.translation + "）", _0x4155fc, _0x2f8fa6);
        });
        _0x566c50.appendChild(_0x5d0567);
      });
      _0x566c50.style.display = "block";
    } else {
      _0x566c50.style.display = "none";
    }
  } catch (_0x1aa40f) {
    console.error("Tag search failed:", _0x1aa40f);
    _0x566c50.style.display = "none";
  }
}
export function handleResultClick(_0x29a749, _0x5e412f, _0x12fec0, _0x45b493, _0x47e6fc) {
  const _0x44edb4 = _0x29a749.value;
  const _0x3c042f = _0x44edb4.substring(0, _0x45b493);
  const _0x2dd820 = _0x44edb4.substring(_0x47e6fc);
  const _0x51ad5e = _0x44edb4.substring(_0x45b493, _0x45b493 + 1) === " " ? " " : "";
  const _0x29fc7f = _0x2dd820.trim();
  const _0x4c53c0 = _0x29fc7f.length > 0 && !_0x29fc7f.startsWith(",") ? ", " : "";
  const _0x2f4450 = "" + (_0x3c042f.trim() ? _0x3c042f : "") + _0x51ad5e + _0x12fec0 + _0x4c53c0 + (_0x2dd820.trim() ? _0x2dd820 : "");
  _0x29a749.value = _0x2f4450;
  _0x5e412f.style.display = "none";
  if (typeof _0x5e412f.restoreDialogSize === "function") {
    _0x5e412f.restoreDialogSize();
  }
  _0x29a749.focus();
  const _0x20ce25 = (_0x3c042f + _0x51ad5e + _0x12fec0 + _0x4c53c0).length;
  setTimeout(() => _0x29a749.setSelectionRange(_0x20ce25, _0x20ce25), 0);
}