import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName, defaultSettings } from "../config.js";
import { stylishConfirm } from "../ui_common.js";
const NOVELAI_PROFILE_KEYS = ["novelaiApi", "novelaisite", "novelaiOtherSite", "enableCloudQueue", "cloudQueueUrl", "cloudQueueGreeting", "showQueueGreeting", "novelaimode", "novelai_sampler", "Schedule", "nai3Scale", "cfg_rescale", "AI_use_coords", "sm", "dyn", "nai3Variety", "nai3Deceisp", "enableVibeGroupTransfer", "normalizeRefStrength", "novelai_width", "novelai_height", "novelai_steps", "novelai_seed"];
const COMFYUI_PROFILE_KEYS = ["workerid", "worker", "editWorkerid", "editWorker", "comfyuiUrl", "MODEL_NAME", "comfyuisamplerName", "comfyui_vae", "comfyui_scheduler", "comfyuiCLIPName", "comfyui_width", "comfyui_height", "comfyui_steps", "comfyui_seed", "cfg_comfyui"];
function getSettings() {
  return extension_settings[extensionName];
}
export function refreshNovelaiProfileSelect() {
  const _0x27acaf = getSettings();
  const _0x172009 = document.getElementById("novelai_profile_id");
  if (!_0x172009) {
    return;
  }
  if (!_0x27acaf.novelai_profiles) {
    _0x27acaf.novelai_profiles = JSON.parse(JSON.stringify(defaultSettings.novelai_profiles));
  }
  if (!_0x27acaf.novelai_profile_id) {
    _0x27acaf.novelai_profile_id = "默认";
  }
  for (const _0x3da680 in _0x27acaf.novelai_profiles) {
    const _0x446dde = _0x27acaf.novelai_profiles[_0x3da680];
    if (_0x446dde.enableVibeGroupTransfer === undefined) {
      _0x446dde.enableVibeGroupTransfer = "false";
    }
    if (_0x446dde.normalizeRefStrength === undefined) {
      _0x446dde.normalizeRefStrength = "false";
    }
  }
  _0x172009.innerHTML = "";
  const _0x4aa6a8 = Object.keys(_0x27acaf.novelai_profiles).sort((_0x15380f, _0x598420) => _0x15380f.localeCompare(_0x598420, "zh-CN"));
  for (const _0x427f3b of _0x4aa6a8) {
    const _0x374773 = new Option(_0x427f3b, _0x427f3b);
    _0x374773.title = _0x427f3b;
    _0x172009.add(_0x374773);
  }
  _0x172009.value = _0x27acaf.novelai_profile_id;
}
export function refreshComfyuiProfileSelect() {
  const _0x2bd814 = getSettings();
  const _0x1117ff = document.getElementById("comfyui_profile_id");
  if (!_0x1117ff) {
    return;
  }
  if (!_0x2bd814.comfyui_profiles) {
    _0x2bd814.comfyui_profiles = JSON.parse(JSON.stringify(defaultSettings.comfyui_profiles));
  }
  if (!_0x2bd814.comfyui_profile_id) {
    _0x2bd814.comfyui_profile_id = "默认";
  }
  _0x1117ff.innerHTML = "";
  const _0x3332a6 = Object.keys(_0x2bd814.comfyui_profiles).sort((_0x426dd8, _0x3b2cc3) => _0x426dd8.localeCompare(_0x3b2cc3, "zh-CN"));
  for (const _0x7017db of _0x3332a6) {
    const _0x2e8296 = new Option(_0x7017db, _0x7017db);
    _0x2e8296.title = _0x7017db;
    _0x1117ff.add(_0x2e8296);
  }
  _0x1117ff.value = _0x2bd814.comfyui_profile_id;
}
function collectNovelaiProfile() {
  const _0x3fea1e = getSettings();
  const _0x4c325d = {};
  for (const _0x23346b of NOVELAI_PROFILE_KEYS) {
    _0x4c325d[_0x23346b] = _0x3fea1e[_0x23346b];
  }
  return _0x4c325d;
}
function collectComfyuiProfile() {
  const _0x5468ad = getSettings();
  const _0x12d5ff = {};
  for (const _0x463c8e of COMFYUI_PROFILE_KEYS) {
    _0x12d5ff[_0x463c8e] = _0x5468ad[_0x463c8e];
  }
  return _0x12d5ff;
}
function applyNovelaiProfile(_0x2c7f53) {
  const _0x2a34b8 = getSettings();
  if (_0x2c7f53.enableVibeGroupTransfer === undefined) {
    _0x2c7f53.enableVibeGroupTransfer = "false";
  }
  if (_0x2c7f53.normalizeRefStrength === undefined) {
    _0x2c7f53.normalizeRefStrength = "false";
  }
  for (const _0x1b230b of NOVELAI_PROFILE_KEYS) {
    if (_0x2c7f53[_0x1b230b] !== undefined) {
      _0x2a34b8[_0x1b230b] = _0x2c7f53[_0x1b230b];
      const _0x4c1e82 = document.getElementById(_0x1b230b);
      if (_0x4c1e82) {
        if (_0x4c1e82.type === "checkbox") {
          _0x4c1e82.checked = String(_0x2c7f53[_0x1b230b]) === "true";
        } else {
          _0x4c1e82.value = _0x2c7f53[_0x1b230b];
        }
      }
    }
  }
  syncSliders();
}
function applyComfyuiProfile(_0x3c7720) {
  const _0x3c91e9 = getSettings();
  for (const _0x261ae8 of COMFYUI_PROFILE_KEYS) {
    if (_0x3c7720[_0x261ae8] !== undefined) {
      _0x3c91e9[_0x261ae8] = _0x3c7720[_0x261ae8];
      const _0x4a0b9e = document.getElementById(_0x261ae8);
      if (_0x4a0b9e) {
        if (_0x4a0b9e.type === "checkbox") {
          _0x4a0b9e.checked = String(_0x3c7720[_0x261ae8]) === "true";
        } else {
          _0x4a0b9e.value = _0x3c7720[_0x261ae8];
        }
      }
    }
  }
  const _0x45245e = document.getElementById("workerid");
  if (_0x45245e && _0x3c7720.workerid) {
    _0x45245e.value = _0x3c7720.workerid;
  }
  const _0x220ff0 = document.getElementById("worker");
  if (_0x220ff0 && _0x3c7720.worker) {
    _0x220ff0.value = typeof _0x3c7720.worker === "string" ? _0x3c7720.worker : JSON.stringify(_0x3c7720.worker, null, 2);
  }
  const _0x11ef1a = document.getElementById("editWorkerid");
  if (_0x11ef1a && _0x3c7720.editWorkerid) {
    _0x11ef1a.value = _0x3c7720.editWorkerid;
  }
  const _0x5c9662 = document.getElementById("editWorker");
  if (_0x5c9662) {
    if (_0x3c7720.editWorker) {
      _0x5c9662.value = typeof _0x3c7720.editWorker === "string" ? _0x3c7720.editWorker : JSON.stringify(_0x3c7720.editWorker, null, 2);
    } else if (_0x3c7720.editWorkerid && _0x3c91e9.workers[_0x3c7720.editWorkerid]) {
      _0x5c9662.value = _0x3c91e9.workers[_0x3c7720.editWorkerid];
    }
  }
}
function syncSliders() {
  const _0x257002 = [["InformationExtracted", "InformationExtracted_range"], ["ReferenceStrength", "ReferenceStrength_range"]];
  for (const [_0x10afbd, _0x1f2b85] of _0x257002) {
    const _0x598d92 = document.getElementById(_0x10afbd);
    const _0x1c57e3 = document.getElementById(_0x1f2b85);
    if (_0x598d92 && _0x1c57e3) {
      _0x1c57e3.value = _0x598d92.value;
    }
  }
}
export function initProfileControls(_0x214294) {
  const _0x440dd2 = getSettings();
  if (!_0x440dd2.novelai_profiles) {
    _0x440dd2.novelai_profiles = JSON.parse(JSON.stringify(defaultSettings.novelai_profiles));
  }
  if (!_0x440dd2.comfyui_profiles) {
    _0x440dd2.comfyui_profiles = JSON.parse(JSON.stringify(defaultSettings.comfyui_profiles));
  }
  _0x214294.find("#novelai_profile_load").on("click", function () {
    const _0x21a6ab = document.getElementById("novelai_profile_id");
    if (!_0x21a6ab) {
      return;
    }
    const _0x419733 = _0x21a6ab.value;
    const _0x3a6736 = _0x440dd2.novelai_profiles[_0x419733];
    if (_0x3a6736) {
      applyNovelaiProfile(_0x3a6736);
      _0x440dd2.novelai_profile_id = _0x419733;
      saveSettingsDebounced();
      toastr.success("已加载配置: " + _0x419733);
    }
  });
  _0x214294.find("#novelai_profile_new").on("click", async function () {
    const _0x2bc912 = prompt("请输入新配置名称:");
    if (!_0x2bc912 || _0x2bc912.trim() === "") {
      return;
    }
    const _0x2c7026 = _0x2bc912.trim();
    if (_0x440dd2.novelai_profiles[_0x2c7026]) {
      const _0x8b69aa = await stylishConfirm("确认覆盖", "配置 \"" + _0x2c7026 + "\" 已存在，是否覆盖？");
      if (!_0x8b69aa) {
        return;
      }
    }
    _0x440dd2.novelai_profiles[_0x2c7026] = collectNovelaiProfile();
    _0x440dd2.novelai_profile_id = _0x2c7026;
    refreshNovelaiProfileSelect();
    saveSettingsDebounced();
    toastr.success("已创建配置: " + _0x2c7026);
  });
  _0x214294.find("#novelai_profile_delete").on("click", async function () {
    const _0x483d43 = document.getElementById("novelai_profile_id");
    if (!_0x483d43) {
      return;
    }
    const _0x2e48fa = _0x483d43.value;
    if (_0x2e48fa === "默认") {
      toastr.warning("不能删除默认配置");
      return;
    }
    const _0x1fff99 = await stylishConfirm("确认删除", "确定要删除配置 \"" + _0x2e48fa + "\" 吗？");
    if (!_0x1fff99) {
      return;
    }
    delete _0x440dd2.novelai_profiles[_0x2e48fa];
    _0x440dd2.novelai_profile_id = "默认";
    refreshNovelaiProfileSelect();
    saveSettingsDebounced();
    toastr.success("已删除配置: " + _0x2e48fa);
  });
  _0x214294.find("#novelai_profile_id").on("change", function () {
    const _0x6ffe10 = this.value;
    const _0x13d19b = _0x440dd2.novelai_profiles[_0x6ffe10];
    if (_0x13d19b) {
      applyNovelaiProfile(_0x13d19b);
      _0x440dd2.novelai_profile_id = _0x6ffe10;
      saveSettingsDebounced();
    }
  });
  _0x214294.find("#comfyui_profile_load").on("click", function () {
    const _0x3df05f = document.getElementById("comfyui_profile_id");
    if (!_0x3df05f) {
      return;
    }
    const _0x52d77b = _0x3df05f.value;
    const _0x33d56e = _0x440dd2.comfyui_profiles[_0x52d77b];
    if (_0x33d56e) {
      applyComfyuiProfile(_0x33d56e);
      _0x440dd2.comfyui_profile_id = _0x52d77b;
      saveSettingsDebounced();
      toastr.success("已加载配置: " + _0x52d77b);
    }
  });
  _0x214294.find("#comfyui_profile_new").on("click", async function () {
    const _0x1ca777 = prompt("请输入新配置名称:");
    if (!_0x1ca777 || _0x1ca777.trim() === "") {
      return;
    }
    const _0x5be700 = _0x1ca777.trim();
    if (_0x440dd2.comfyui_profiles[_0x5be700]) {
      const _0x403168 = await stylishConfirm("确认覆盖", "配置 \"" + _0x5be700 + "\" 已存在，是否覆盖？");
      if (!_0x403168) {
        return;
      }
    }
    _0x440dd2.comfyui_profiles[_0x5be700] = collectComfyuiProfile();
    _0x440dd2.comfyui_profile_id = _0x5be700;
    refreshComfyuiProfileSelect();
    saveSettingsDebounced();
    toastr.success("已创建配置: " + _0x5be700);
  });
  _0x214294.find("#comfyui_profile_delete").on("click", async function () {
    const _0x204e57 = document.getElementById("comfyui_profile_id");
    if (!_0x204e57) {
      return;
    }
    const _0x595724 = _0x204e57.value;
    if (_0x595724 === "默认") {
      toastr.warning("不能删除默认配置");
      return;
    }
    const _0x389cda = await stylishConfirm("确认删除", "确定要删除配置 \"" + _0x595724 + "\" 吗？");
    if (!_0x389cda) {
      return;
    }
    delete _0x440dd2.comfyui_profiles[_0x595724];
    _0x440dd2.comfyui_profile_id = "默认";
    refreshComfyuiProfileSelect();
    saveSettingsDebounced();
    toastr.success("已删除配置: " + _0x595724);
  });
  _0x214294.find("#comfyui_profile_id").on("change", function () {
    const _0x495ffb = this.value;
    const _0x19af74 = _0x440dd2.comfyui_profiles[_0x495ffb];
    if (_0x19af74) {
      applyComfyuiProfile(_0x19af74);
      _0x440dd2.comfyui_profile_id = _0x495ffb;
      saveSettingsDebounced();
    }
  });
  refreshNovelaiProfileSelect();
  refreshComfyuiProfileSelect();
}