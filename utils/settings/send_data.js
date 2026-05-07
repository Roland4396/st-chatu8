import { getrWorlds, getWorldEntries, getcharWorld } from "../promptReq.js";
import { eventSource, event_types, saveSettingsDebounced } from "../../../../../../script.js";
import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
let worldList = [];
let worldEntrySelections = {};
let worldBookSelections = {};
let activeWorld = null;
let currentCharWorldName = null;
function getWorldBookConfig() {
  const _0x50d8b3 = extension_settings[extensionName];
  if (!_0x50d8b3.worldBookConfig) {
    _0x50d8b3.worldBookConfig = {
      worldBookSelections: {},
      worldEntrySelections: {}
    };
  }
  return _0x50d8b3.worldBookConfig;
}
function saveWorldBookConfig() {
  const _0x4adb81 = getWorldBookConfig();
  const _0x199167 = {
    ...worldEntrySelections
  };
  _0x4adb81.worldEntrySelections = _0x199167;
  const _0x532fd0 = {};
  for (const _0x6f766e in worldBookSelections) {
    if (_0x6f766e !== currentCharWorldName) {
      _0x532fd0[_0x6f766e] = worldBookSelections[_0x6f766e];
    }
  }
  _0x4adb81.worldBookSelections = _0x532fd0;
  saveSettingsDebounced();
}
function isNewEntry(_0x11d3e5, _0x128939) {
  const _0x3f2e63 = worldEntrySelections[_0x11d3e5];
  if (!_0x3f2e63) {
    return true;
  }
  return _0x3f2e63[_0x128939] === undefined;
}
export function initSendData(_0x492bcc) {
  const _0x68aa2f = _0x492bcc.find("#ch-send-data-world-list");
  const _0x3b5987 = _0x492bcc.find("#ch-send-data-entry-list");
  const _0x331b3e = _0x492bcc.find("#ch-send-data-world-search");
  const _0x2a3c9a = _0x492bcc.find("#ch-send-data-entry-search");
  async function _0x307de6() {
    worldList = await getrWorlds();
    currentCharWorldName = await getcharWorld();
    const _0x560c1b = getWorldBookConfig();
    console.log("[send_data] 当前角色世界书:", currentCharWorldName);
    console.log("[send_data] 插件配置:", _0x560c1b);
    const _0x55dccb = {
      ...(_0x560c1b.worldEntrySelections || {})
    };
    worldEntrySelections = _0x55dccb;
    const _0x32558b = {
      ...(_0x560c1b.worldBookSelections || {})
    };
    worldBookSelections = _0x32558b;
    if (currentCharWorldName) {
      const _0xc8ce01 = worldEntrySelections[currentCharWorldName] && Object.keys(worldEntrySelections[currentCharWorldName]).length > 0;
      if (!_0xc8ce01) {
        console.log("[send_data] 当前角色世界书无条目记录，初始化默认设置");
        worldBookSelections[currentCharWorldName] = true;
        const _0x578efb = await getWorldEntries(currentCharWorldName);
        if (_0x578efb) {
          worldEntrySelections[currentCharWorldName] = {};
          const _0x260479 = Array.isArray(_0x578efb) ? _0x578efb : Object.values(_0x578efb);
          _0x260479.forEach(_0x5cd225 => {
            const _0x348128 = _0x5cd225.uid;
            if (_0x348128 !== undefined && _0x348128 !== null) {
              worldEntrySelections[currentCharWorldName][_0x348128] = false;
            }
          });
        }
        saveWorldBookConfig();
      } else {
        console.log("[send_data] 当前角色世界书有条目记录，默认开启");
        worldBookSelections[currentCharWorldName] = true;
      }
    }
    if (!activeWorld && worldList.length > 0) {
      activeWorld = worldList[0];
    }
    _0x5300d6();
    _0x334740();
  }
  function _0x5300d6() {
    _0x68aa2f.empty();
    const _0x42dbac = document.createDocumentFragment();
    const _0x4b9b60 = _0x331b3e.val().toLowerCase();
    worldList.filter(_0x20a072 => _0x20a072.toLowerCase().includes(_0x4b9b60)).forEach(_0x21c2f4 => {
      const _0xb504c8 = $("<div></div>").addClass("st-chatu8-list-item").data("worldName", _0x21c2f4);
      const _0x4c95de = $("<span></span>").addClass("st-chatu8-world-checkbox").css({
        position: "relative",
        marginRight: "10px",
        display: "inline-block",
        width: "16px",
        height: "16px"
      });
      const _0x5ca3d6 = $("<span></span>").text(_0x21c2f4);
      if (_0x21c2f4 === currentCharWorldName) {
        _0x5ca3d6.append($("<span></span>").text(" (角色)").css({
          color: "#4CAF50",
          fontSize: "0.85em"
        }));
      }
      if (worldBookSelections[_0x21c2f4]) {
        _0xb504c8.addClass("world-selected");
      }
      if (_0x21c2f4 === activeWorld) {
        _0xb504c8.addClass("active");
      }
      _0xb504c8.append(_0x4c95de).append(_0x5ca3d6);
      _0x42dbac.appendChild(_0xb504c8[0]);
    });
    _0x68aa2f.append(_0x42dbac);
  }
  async function _0x334740() {
    _0x3b5987.empty();
    if (!activeWorld) {
      _0x3b5987.html("<div style=\"padding:10px; color:#888;\">请先在左侧选择一个世界书。</div>");
      _0x492bcc.find("#ch-send-data-new-entry-buttons").hide();
      return;
    }
    const _0x1132df = _0x2a3c9a.val().toLowerCase();
    const _0x5e0bdb = await getWorldEntries(activeWorld);
    _0x3b5987.empty();
    const _0x1d187f = document.createDocumentFragment();
    let _0x4cf5fc = false;
    if (_0x5e0bdb) {
      const _0x5dc811 = worldEntrySelections[activeWorld] || {};
      const _0x556b49 = Array.isArray(_0x5e0bdb) ? _0x5e0bdb : Object.values(_0x5e0bdb);
      const _0x51d5f3 = _0x556b49.filter(_0x1d875c => {
        const _0x3b641e = _0x1d875c.key || _0x1d875c.uid || "";
        const _0x1e7df0 = _0x1d875c.comment || "";
        return String(_0x3b641e).toLowerCase().includes(_0x1132df) || String(_0x1e7df0).toLowerCase().includes(_0x1132df);
      });
      if (_0x51d5f3.length === 0) {
        _0x3b5987.html("<div style=\"padding:10px; color:#888;\">没有找到匹配的条目。</div>");
        _0x492bcc.find("#ch-send-data-new-entry-buttons").hide();
        return;
      }
      _0x51d5f3.forEach(_0xf18c12 => {
        const _0x68a700 = _0xf18c12.uid;
        const _0x2e096f = _0xf18c12.comment || "条目 " + _0x68a700;
        const _0x39ee3d = $("<div></div>").addClass("st-chatu8-list-item").data("entryKey", _0x68a700).data("entryContent", _0xf18c12.content || "");
        const _0x279cd0 = isNewEntry(activeWorld, _0x68a700);
        if (_0x279cd0) {
          _0x39ee3d.addClass("new-entry");
          _0x4cf5fc = true;
        }
        const _0x11acfb = $("<span></span>").addClass("st-chatu8-entry-text").text(_0x2e096f);
        if (_0x279cd0) {
          const _0x5eb0f6 = $("<span></span>").addClass("st-chatu8-new-badge").text("新");
          _0x11acfb.append(_0x5eb0f6);
        }
        const _0x36cefc = $("<i></i>").addClass("fa fa-eye st-chatu8-entry-view-icon").attr("title", "查看内容").on("click", function (_0x4cf1d0) {
          _0x4cf1d0.stopPropagation();
          _0x56c196(_0x2e096f, _0xf18c12.content || "");
        });
        _0x39ee3d.append(_0x11acfb).append(_0x36cefc);
        const _0x43ba0a = _0x5dc811[_0x68a700];
        if (_0x43ba0a === "force") {
          _0x39ee3d.addClass("selected force-enabled");
        } else if (_0x43ba0a === true) {
          _0x39ee3d.addClass("selected");
        }
        _0x1d187f.appendChild(_0x39ee3d[0]);
      });
    } else {
      _0x3b5987.html("<div style=\"padding:10px; color:#888;\">这个世界书是空的。</div>");
    }
    _0x3b5987.append(_0x1d187f);
    const _0xeaf650 = _0x492bcc.find("#ch-send-data-new-entry-buttons");
    if (_0x4cf5fc) {
      _0xeaf650.show();
    } else {
      _0xeaf650.hide();
    }
  }
  function _0x5131ad(_0xc13fd1) {
    const _0x311acd = $(_0xc13fd1.target).closest(".st-chatu8-list-item");
    if (!_0x311acd.length) {
      return;
    }
    const _0x3d822c = _0x311acd.data("worldName");
    if (!_0x3d822c) {
      return;
    }
    const _0x587190 = $(_0xc13fd1.target).closest(".st-chatu8-world-checkbox");
    if (_0x587190.length) {
      worldBookSelections[_0x3d822c] = !worldBookSelections[_0x3d822c];
      saveWorldBookConfig();
      _0x5300d6();
    } else if (_0x3d822c !== activeWorld) {
      activeWorld = _0x3d822c;
      _0x5300d6();
      _0x334740();
    }
  }
  let _0x49768b = null;
  let _0x4f3529 = false;
  const _0x23eb42 = 500;
  function _0x4acdbf(_0x361c90) {
    const _0x338854 = $(_0x361c90.target).closest(".st-chatu8-list-item");
    if (!_0x338854.length || !activeWorld) {
      return;
    }
    if ($(_0x361c90.target).closest(".st-chatu8-entry-view-icon").length) {
      return;
    }
    _0x4f3529 = false;
    _0x49768b = setTimeout(() => {
      _0x4f3529 = true;
      _0x4433ca(_0x338854);
    }, _0x23eb42);
  }
  function _0x14b83b(_0x4addbf) {
    if (_0x49768b) {
      clearTimeout(_0x49768b);
      _0x49768b = null;
    }
  }
  function _0x4d6f35(_0x1c5594) {
    const _0x4dd763 = $(_0x1c5594.target).closest(".st-chatu8-list-item");
    if (!_0x4dd763.length || !activeWorld) {
      return;
    }
    if ($(_0x1c5594.target).closest(".st-chatu8-entry-view-icon").length) {
      return;
    }
    const _0xe62d41 = _0x4dd763.data("entryKey");
    if (_0xe62d41 === undefined || _0xe62d41 === null) {
      return;
    }
    if (_0x1c5594.type === "contextmenu") {
      _0x1c5594.preventDefault();
      _0x4433ca(_0x4dd763);
      return;
    }
    if (_0x4f3529) {
      _0x4f3529 = false;
      return;
    }
    if (!worldEntrySelections[activeWorld]) {
      worldEntrySelections[activeWorld] = {};
    }
    const _0x3f0d5b = worldEntrySelections[activeWorld][_0xe62d41];
    if (_0x3f0d5b === true || _0x3f0d5b === "force" || _0x3f0d5b === undefined) {
      worldEntrySelections[activeWorld][_0xe62d41] = false;
    } else {
      worldEntrySelections[activeWorld][_0xe62d41] = true;
    }
    saveWorldBookConfig();
    _0x334740();
    _0x5300d6();
  }
  function _0x4433ca(_0x864c2d) {
    const _0x44ee19 = _0x864c2d.data("entryKey");
    if (_0x44ee19 === undefined || _0x44ee19 === null) {
      return;
    }
    if (!worldEntrySelections[activeWorld]) {
      worldEntrySelections[activeWorld] = {};
    }
    const _0x2bdb23 = worldEntrySelections[activeWorld][_0x44ee19];
    if (_0x2bdb23 === "force") {
      worldEntrySelections[activeWorld][_0x44ee19] = true;
      toastr.info("已取消强制启用");
    } else {
      worldEntrySelections[activeWorld][_0x44ee19] = "force";
      toastr.success("已设为强制启用");
    }
    saveWorldBookConfig();
    _0x334740();
    _0x5300d6();
  }
  async function _0x28a5ca() {
    if (!activeWorld) {
      return;
    }
    const _0x459217 = await getWorldEntries(activeWorld);
    if (!_0x459217) {
      return;
    }
    if (!worldEntrySelections[activeWorld]) {
      worldEntrySelections[activeWorld] = {};
    }
    const _0x34f4fe = _0x2a3c9a.val().toLowerCase();
    const _0x160b96 = Array.isArray(_0x459217) ? _0x459217 : Object.values(_0x459217);
    const _0x59fda9 = _0x160b96.filter(_0x2b46dc => {
      const _0x431980 = _0x2b46dc.key || _0x2b46dc.uid || "";
      const _0x534c60 = _0x2b46dc.comment || "";
      return String(_0x431980).toLowerCase().includes(_0x34f4fe) || String(_0x534c60).toLowerCase().includes(_0x34f4fe);
    });
    _0x59fda9.forEach(_0x2567a0 => {
      const _0x312b72 = _0x2567a0.uid;
      if (_0x312b72 !== undefined && _0x312b72 !== null) {
        worldEntrySelections[activeWorld][_0x312b72] = true;
      }
    });
    saveWorldBookConfig();
    _0x5300d6();
    _0x334740();
  }
  async function _0x132936() {
    if (!activeWorld) {
      return;
    }
    const _0x229db8 = await getWorldEntries(activeWorld);
    if (!_0x229db8) {
      return;
    }
    if (!worldEntrySelections[activeWorld]) {
      worldEntrySelections[activeWorld] = {};
    }
    const _0x4fd9ce = _0x2a3c9a.val().toLowerCase();
    const _0x12692b = Array.isArray(_0x229db8) ? _0x229db8 : Object.values(_0x229db8);
    const _0x43e003 = _0x12692b.filter(_0x1d638a => {
      const _0x1658c1 = _0x1d638a.key || _0x1d638a.uid || "";
      const _0x35733e = _0x1d638a.comment || "";
      return String(_0x1658c1).toLowerCase().includes(_0x4fd9ce) || String(_0x35733e).toLowerCase().includes(_0x4fd9ce);
    });
    _0x43e003.forEach(_0x73fd5 => {
      const _0x1a8bac = _0x73fd5.uid;
      if (_0x1a8bac !== undefined && _0x1a8bac !== null) {
        worldEntrySelections[activeWorld][_0x1a8bac] = false;
      }
    });
    saveWorldBookConfig();
    _0x5300d6();
    _0x334740();
  }
  async function _0x3bf061() {
    if (!activeWorld) {
      return;
    }
    try {
      const _0x423a5e = await getWorldEntries(activeWorld);
      if (!_0x423a5e) {
        return;
      }
      if (!worldEntrySelections[activeWorld]) {
        worldEntrySelections[activeWorld] = {};
      }
      const _0x2f405a = Array.isArray(_0x423a5e) ? _0x423a5e : Object.values(_0x423a5e);
      let _0x2ac39f = 0;
      _0x2f405a.forEach(_0x286458 => {
        const _0x3c121f = _0x286458.uid;
        if (_0x3c121f !== undefined && _0x3c121f !== null && isNewEntry(activeWorld, _0x3c121f)) {
          worldEntrySelections[activeWorld][_0x3c121f] = true;
          _0x2ac39f++;
        }
      });
      if (_0x2ac39f > 0) {
        saveWorldBookConfig();
        _0x5300d6();
        _0x334740();
        toastr.success("已启用 " + _0x2ac39f + " 个新条目");
      } else {
        toastr.info("没有新条目");
      }
    } catch (_0x1c69e1) {
      console.error("[send_data] 批量启用新条目失败:", _0x1c69e1);
      toastr.error("操作失败: " + _0x1c69e1.message);
    }
  }
  async function _0x4afeb5() {
    if (!activeWorld) {
      return;
    }
    try {
      const _0x433025 = await getWorldEntries(activeWorld);
      if (!_0x433025) {
        return;
      }
      if (!worldEntrySelections[activeWorld]) {
        worldEntrySelections[activeWorld] = {};
      }
      const _0x28acae = Array.isArray(_0x433025) ? _0x433025 : Object.values(_0x433025);
      let _0x3d9773 = 0;
      _0x28acae.forEach(_0x43a8e7 => {
        const _0x24c4e2 = _0x43a8e7.uid;
        if (_0x24c4e2 !== undefined && _0x24c4e2 !== null && isNewEntry(activeWorld, _0x24c4e2)) {
          worldEntrySelections[activeWorld][_0x24c4e2] = false;
          _0x3d9773++;
        }
      });
      if (_0x3d9773 > 0) {
        saveWorldBookConfig();
        _0x5300d6();
        _0x334740();
        toastr.success("已禁用 " + _0x3d9773 + " 个新条目");
      } else {
        toastr.info("没有新条目");
      }
    } catch (_0x42426a) {
      console.error("[send_data] 批量禁用新条目失败:", _0x42426a);
      toastr.error("操作失败: " + _0x42426a.message);
    }
  }
  function _0x56c196(_0x516852, _0x1dd0b5) {
    document.querySelector(".st-chatu8-entry-content-backdrop")?.remove();
    const _0x2f4bc9 = document.createElement("div");
    _0x2f4bc9.className = "st-chatu8-workflow-viz-backdrop st-chatu8-entry-content-backdrop";
    _0x2f4bc9.innerHTML = "\n            <div class=\"st-chatu8-workflow-viz-dialog st-chatu8-entry-content-dialog\">\n                <div class=\"st-chatu8-workflow-viz-header\">\n                    <h3>" + $("<div>").text(_0x516852).html() + "</h3>\n                    <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n                </div>\n                <div class=\"st-chatu8-entry-content-body\">\n                    <pre class=\"st-chatu8-entry-content-text\">" + $("<div>").text(_0x1dd0b5 || "(无内容)").html() + "</pre>\n                </div>\n            </div>\n        ";
    document.body.appendChild(_0x2f4bc9);
    const _0xc6fe5 = _0x2f4bc9.querySelector(".st-chatu8-workflow-viz-close");
    _0xc6fe5.onclick = () => _0x2f4bc9.remove();
    _0x2f4bc9.onclick = _0x22bba3 => {
      if (_0x22bba3.target === _0x2f4bc9) {
        _0x2f4bc9.remove();
      }
    };
    const _0x2c698b = _0x42519e => {
      if (_0x42519e.key === "Escape") {
        _0x2f4bc9.remove();
        document.removeEventListener("keydown", _0x2c698b);
      }
    };
    document.addEventListener("keydown", _0x2c698b);
  }
  _0x68aa2f.off("click").on("click", _0x5131ad);
  _0x3b5987.off("click contextmenu mousedown mouseup mouseleave touchstart touchend touchcancel").on("click", _0x4d6f35).on("contextmenu", _0x4d6f35).on("mousedown touchstart", _0x4acdbf).on("mouseup mouseleave touchend touchcancel", _0x14b83b);
  _0x331b3e.off("input").on("input", _0x5300d6);
  _0x2a3c9a.off("input").on("input", _0x334740);
  async function _0x14c41b() {
    const _0xc06b0c = _0x492bcc.find("#ch-send-data-refresh-worlds");
    const _0x35b1b1 = _0xc06b0c.html();
    _0xc06b0c.prop("disabled", true).html("<i class=\"fa fa-spinner fa-spin\"></i> 刷新中...");
    try {
      await _0x307de6();
      toastr.success("世界书已刷新");
    } catch (_0x2e306f) {
      console.error("[send_data] 刷新世界书失败:", _0x2e306f);
      toastr.error("刷新世界书失败: " + _0x2e306f.message);
    } finally {
      _0xc06b0c.prop("disabled", false).html(_0x35b1b1);
    }
  }
  _0x492bcc.find("#ch-send-data-select-all").off("click").on("click", _0x28a5ca);
  _0x492bcc.find("#ch-send-data-deselect-all").off("click").on("click", _0x132936);
  _0x492bcc.find("#ch-send-data-enable-new-entries").off("click").on("click", _0x3bf061);
  _0x492bcc.find("#ch-send-data-disable-new-entries").off("click").on("click", _0x4afeb5);
  _0x492bcc.find("#ch-send-data-refresh-worlds").off("click").on("click", _0x14c41b);
  eventSource.on(event_types.GENERATION_STARTED, _0x307de6);
}