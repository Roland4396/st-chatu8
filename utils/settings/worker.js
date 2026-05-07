import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { stylInput, stylishConfirm } from "../ui_common.js";
function eidtJSON(_0x3cf5ea) {
  for (let _0x5a771e in _0x3cf5ea) {
    if (_0x3cf5ea.hasOwnProperty(_0x5a771e)) {
      if (typeof _0x3cf5ea[_0x5a771e] === "object" && _0x3cf5ea[_0x5a771e] !== null) {
        eidtJSON(_0x3cf5ea[_0x5a771e]);
      } else {
        if (_0x5a771e.includes("seed")) {
          _0x3cf5ea[_0x5a771e] = "%seed%";
        }
        if (_0x5a771e == "steps") {
          _0x3cf5ea[_0x5a771e] = "%steps%";
        }
        if (_0x5a771e == "cfg") {
          _0x3cf5ea[_0x5a771e] = "%cfg_scale%";
        }
        if (_0x5a771e == "sampler_name") {
          _0x3cf5ea[_0x5a771e] = "%sampler_name%";
        }
        if (_0x5a771e == "width") {
          _0x3cf5ea[_0x5a771e] = "%width%";
        }
        if (_0x5a771e == "height") {
          _0x3cf5ea[_0x5a771e] = "%height%";
        }
        if (_0x5a771e == "ckpt_name") {
          _0x3cf5ea[_0x5a771e] = "%MODEL_NAME%";
        }
        if (_0x5a771e == "positive") {
          _0x3cf5ea[_0x5a771e] = "%prompt%";
        }
        if (_0x5a771e == "negative") {
          _0x3cf5ea[_0x5a771e] = "%negative_prompt%";
        }
        if (_0x5a771e == "text" && _0x3cf5ea[_0x5a771e] == "正面") {
          _0x3cf5ea[_0x5a771e] = "%prompt%";
        }
        if (_0x5a771e == "text" && _0x3cf5ea[_0x5a771e] == "负面") {
          _0x3cf5ea[_0x5a771e] = "%negative_prompt%";
        }
      }
    }
  }
  return _0x3cf5ea;
}
export function eidtwork() {
  alert("请在导出时设置为正面提示词“正面”，负面设置为”负面”，情况复杂，不保证可用性。会简易的替换：模型名称、提示词、步数、cfg、采样器、宽度、高度、seed。");
  let _0x18bcd9 = document.getElementById("worker");
  try {
    let _0x1f53dc = JSON.parse(_0x18bcd9.value.trim());
    _0x1f53dc = eidtJSON(_0x1f53dc);
    _0x18bcd9.value = JSON.stringify(_0x1f53dc, null, 2);
  } catch (_0x48337d) {
    alert("请输入正确的json" + _0x48337d);
  }
}
const PLACEHOLDER_MAP = [{
  placeholder: "%seed%",
  label: "种子 (seed)",
  matchKeys: ["seed"],
  type: "number"
}, {
  placeholder: "%steps%",
  label: "步数 (steps)",
  matchKeys: ["steps"],
  type: "number"
}, {
  placeholder: "%cfg_scale%",
  label: "CFG (cfg)",
  matchKeys: ["cfg", "cfg_scale"],
  type: "number"
}, {
  placeholder: "%sampler_name%",
  label: "采样器 (sampler)",
  matchKeys: ["sampler_name", "sampler"],
  type: "string"
}, {
  placeholder: "%scheduler%",
  label: "调度器 (scheduler)",
  matchKeys: ["scheduler"],
  type: "string"
}, {
  placeholder: "%width%",
  label: "宽度 (width)",
  matchKeys: ["width"],
  type: "number"
}, {
  placeholder: "%height%",
  label: "高度 (height)",
  matchKeys: ["height"],
  type: "number"
}, {
  placeholder: "%prompt%",
  label: "正面提示词 (prompt)",
  matchKeys: ["positive", "text"],
  type: "string"
}, {
  placeholder: "%negative_prompt%",
  label: "负面提示词 (negative)",
  matchKeys: ["negative"],
  type: "string"
}, {
  placeholder: "%MODEL_NAME%",
  label: "模型 (ckpt_name)",
  matchKeys: ["ckpt_name"],
  type: "string"
}, {
  placeholder: "%vae%",
  label: "VAE",
  matchKeys: ["vae_name", "vae"],
  type: "string"
}, {
  placeholder: "%clip%",
  label: "CLIP",
  matchKeys: ["clip_name"],
  type: "string"
}, {
  placeholder: "%c_quanzhong%",
  label: "IPA权重",
  matchKeys: ["c_quanzhong"],
  type: "number"
}, {
  placeholder: "%c_idquanzhong%",
  label: "FaceID权重",
  matchKeys: ["c_idquanzhong"],
  type: "number"
}, {
  placeholder: "%c_xijie%",
  label: "细节强度",
  matchKeys: ["c_xijie"],
  type: "number"
}, {
  placeholder: "%c_fenwei%",
  label: "氛围强度",
  matchKeys: ["c_fenwei"],
  type: "number"
}, {
  placeholder: "%comfyuicankaotupian%",
  label: "参考图",
  matchKeys: ["comfyuicankaotupian", "image"],
  type: "string"
}, {
  placeholder: "%ipa%",
  label: "IPA类型",
  matchKeys: ["ipa"],
  type: "string"
}, {
  placeholder: "%inpaint_image%",
  label: "重绘原图",
  matchKeys: ["inpaint_image"],
  type: "string"
}, {
  placeholder: "%inpaint_mask%",
  label: "重绘遮罩",
  matchKeys: ["inpaint_mask"],
  type: "string"
}, {
  placeholder: "%inpaint_denoise%",
  label: "重绘强度",
  matchKeys: ["inpaint_denoise", "denoise"],
  type: "number"
}, {
  placeholder: "%inpaint_positive%",
  label: "重绘正面提示词",
  matchKeys: ["inpaint_positive"],
  type: "string"
}, {
  placeholder: "%inpaint_negative%",
  label: "重绘负面提示词",
  matchKeys: ["inpaint_negative"],
  type: "string"
}];
function checkNodeSkippable(_0x4ec1b0, _0x435f4b, _0x5b758b, _0x2a2cc8 = {}) {
  const _0xbbfb83 = _0x5b758b.filter(_0x30bedc => _0x30bedc.to === _0x4ec1b0);
  const _0x54b5a2 = _0xbbfb83.filter(_0x312787 => {
    const _0x3873e3 = _0x435f4b[_0x312787.from];
    return _0x3873e3 && !_0x3873e3._skip;
  });
  const _0x1aa8ee = _0x5b758b.filter(_0x954c6e => _0x954c6e.from === _0x4ec1b0);
  const _0x2385d1 = _0x1aa8ee.filter(_0x5bb054 => {
    const _0x8460b5 = _0x435f4b[_0x5bb054.to];
    return _0x8460b5 && !_0x8460b5._skip;
  });
  if (_0x54b5a2.length <= 1) {
    return {
      canSkip: true,
      supportsTypeMatch: false
    };
  }
  const _0x4bf5e7 = _0x435f4b[_0x4ec1b0];
  const _0x4205d2 = _0x2a2cc8 && Object.keys(_0x2a2cc8).length > 0 && _0x4bf5e7 && _0x2a2cc8[_0x4bf5e7.class_type];
  if (_0x4205d2) {
    const _0x12e808 = new Set();
    for (const _0x2f8270 of _0x54b5a2) {
      const _0x597b1f = _0x435f4b[_0x2f8270.from];
      if (_0x597b1f) {
        const _0x261fa1 = _0x2a2cc8[_0x597b1f.class_type];
        if (_0x261fa1 && _0x261fa1.output && _0x261fa1.output[_0x2f8270.fromOutput]) {
          _0x12e808.add(_0x261fa1.output[_0x2f8270.fromOutput]);
        }
      }
    }
    if (_0x12e808.size === _0x54b5a2.length) {
      const _0x258e85 = {
        canSkip: true,
        supportsTypeMatch: true,
        reason: "支持类型匹配：" + _0x54b5a2.length + " 个不同类型的输入"
      };
      return _0x258e85;
    }
  }
  const _0x2de583 = {
    canSkip: false,
    reason: "该节点有 " + _0x54b5a2.length + " 个有效输入连接，无法确定应该传递哪个输入" + (_0x4205d2 ? "（存在相同类型）" : "（无类型信息）")
  };
  return _0x2de583;
}
export function processSkippedNodes(_0x1ee8e8, _0x294eec = {}) {
  const _0x4d0f7f = JSON.parse(JSON.stringify(_0x1ee8e8));
  const _0x2f148c = Object.keys(_0x4d0f7f).filter(_0x1e8e43 => _0x4d0f7f[_0x1e8e43]._skip);
  if (_0x2f148c.length === 0) {
    for (const _0x46cf96 of Object.keys(_0x4d0f7f)) {
      delete _0x4d0f7f[_0x46cf96]._skip;
    }
    return _0x4d0f7f;
  }
  const _0x563f64 = (_0x505328, _0x4a1b44) => {
    const _0x4af672 = _0x4d0f7f[_0x505328];
    if (!_0x4af672) {
      return null;
    }
    const _0x20df5d = _0x294eec[_0x4af672.class_type];
    if (_0x20df5d && _0x20df5d.output && _0x20df5d.output[_0x4a1b44]) {
      return _0x20df5d.output[_0x4a1b44];
    }
    return null;
  };
  const _0x4ac4ce = (_0x49940c, _0x11f288) => {
    const _0x3bb261 = _0x4d0f7f[_0x49940c];
    if (!_0x3bb261) {
      return null;
    }
    const _0x4e43f7 = _0x294eec[_0x3bb261.class_type];
    if (!_0x4e43f7) {
      return null;
    }
    const _0x5af97c = {
      ..._0x4e43f7.input?.required,
      ..._0x4e43f7.input?.optional
    };
    const _0x41ea83 = _0x5af97c;
    const _0x552489 = _0x41ea83[_0x11f288];
    if (Array.isArray(_0x552489) && _0x552489[0]) {
      if (typeof _0x552489[0] === "string") {
        return _0x552489[0];
      } else {
        return null;
      }
    }
    return null;
  };
  const _0x189451 = {};
  for (const _0x1333e5 of _0x2f148c) {
    const _0x24f4ed = _0x4d0f7f[_0x1333e5];
    _0x189451[_0x1333e5] = {};
    for (const [_0x51d102, _0x1bd805] of Object.entries(_0x24f4ed.inputs || {})) {
      if (Array.isArray(_0x1bd805) && _0x1bd805.length === 2 && typeof _0x1bd805[0] === "string") {
        let _0x170da3 = _0x1bd805[0];
        let _0x86fecc = _0x1bd805[1];
        const _0x114e50 = new Set();
        while (_0x2f148c.includes(_0x170da3) && !_0x114e50.has(_0x170da3)) {
          _0x114e50.add(_0x170da3);
          const _0x30e19b = _0x4d0f7f[_0x170da3];
          let _0x21eab8 = false;
          for (const [_0x56173c, _0x4c9bfb] of Object.entries(_0x30e19b.inputs || {})) {
            if (Array.isArray(_0x4c9bfb) && _0x4c9bfb.length === 2 && typeof _0x4c9bfb[0] === "string") {
              _0x170da3 = _0x4c9bfb[0];
              _0x86fecc = _0x4c9bfb[1];
              _0x21eab8 = true;
              break;
            }
          }
          if (!_0x21eab8) {
            break;
          }
        }
        if (!_0x2f148c.includes(_0x170da3)) {
          const _0x2953ff = _0x563f64(_0x170da3, _0x86fecc);
          const _0x10d3d2 = {
            from: _0x170da3,
            fromOutput: _0x86fecc,
            outputType: _0x2953ff
          };
          _0x189451[_0x1333e5][_0x51d102] = _0x10d3d2;
        }
      }
    }
  }
  for (const _0x4c836f of Object.keys(_0x4d0f7f)) {
    if (_0x2f148c.includes(_0x4c836f)) {
      continue;
    }
    const _0x45438a = _0x4d0f7f[_0x4c836f];
    for (const [_0x40348d, _0x4bb6e3] of Object.entries(_0x45438a.inputs || {})) {
      if (Array.isArray(_0x4bb6e3) && _0x4bb6e3.length === 2 && typeof _0x4bb6e3[0] === "string") {
        let _0x2f5674 = _0x4bb6e3[0];
        const _0x4f4362 = _0x4bb6e3[1];
        if (_0x2f148c.includes(_0x2f5674)) {
          const _0x291e7b = _0x189451[_0x2f5674];
          if (_0x291e7b && Object.keys(_0x291e7b).length > 0) {
            const _0x2e85b5 = _0x4ac4ce(_0x4c836f, _0x40348d);
            let _0x3397ad = null;
            for (const [_0x7657f7, _0x16053d] of Object.entries(_0x291e7b)) {
              if (_0x2e85b5 && _0x16053d.outputType && _0x16053d.outputType === _0x2e85b5) {
                _0x3397ad = _0x16053d;
                break;
              }
            }
            if (!_0x3397ad) {
              const _0x3ff768 = Object.values(_0x291e7b)[0];
              if (_0x3ff768) {
                _0x3397ad = _0x3ff768;
              }
            }
            if (_0x3397ad) {
              _0x45438a.inputs[_0x40348d] = [_0x3397ad.from, _0x3397ad.fromOutput];
            }
          }
        }
      }
    }
  }
  for (const _0x50e115 of _0x2f148c) {
    delete _0x4d0f7f[_0x50e115];
  }
  for (const _0x40b3b4 of Object.keys(_0x4d0f7f)) {
    delete _0x4d0f7f[_0x40b3b4]._skip;
  }
  return _0x4d0f7f;
}
function getRecommendedPlaceholder(_0x2de40d) {
  const _0x238a16 = _0x2de40d.toLowerCase();
  for (const _0x59076f of PLACEHOLDER_MAP) {
    for (const _0x8e1e88 of _0x59076f.matchKeys) {
      if (_0x238a16 === _0x8e1e88.toLowerCase() || _0x238a16.includes(_0x8e1e88.toLowerCase())) {
        return _0x59076f.placeholder;
      }
    }
  }
  return null;
}
function wrapWithPlaceholderButton(_0x3a73d5, _0x9abe1d, _0x3901bb, _0x31b557 = "") {
  const _0x3118cf = document.createElement("div");
  _0x3118cf.className = "st-chatu8-workflow-viz-input-wrapper";
  _0x3118cf.appendChild(_0x3a73d5);
  const _0x39410f = document.createElement("button");
  _0x39410f.type = "button";
  _0x39410f.className = "st-chatu8-placeholder-btn";
  _0x39410f.innerHTML = "<i class=\"fa-solid fa-code\"></i>";
  _0x39410f.title = "替换为占位符";
  const _0x22b39c = getRecommendedPlaceholder(_0x9abe1d);
  _0x39410f.onclick = _0x387ba3 => {
    _0x387ba3.stopPropagation();
    showPlaceholderMenu(_0x387ba3.target.closest("button"), _0x3a73d5, _0x9abe1d, _0x22b39c, _0x3901bb, _0x31b557);
  };
  _0x3118cf.appendChild(_0x39410f);
  return _0x3118cf;
}
function showPlaceholderMenu(_0x21877f, _0x289aa4, _0x20f74e, _0x3402f7, _0x4e1410, _0x56fe61 = "") {
  const _0x205cf3 = document.querySelector(".st-chatu8-placeholder-menu");
  if (_0x205cf3) {
    _0x205cf3.remove();
  }
  const _0x14834b = document.createElement("div");
  _0x14834b.className = "st-chatu8-placeholder-menu";
  PLACEHOLDER_MAP.forEach(_0x4ebe2e => {
    const _0x2e2c7b = document.createElement("div");
    _0x2e2c7b.className = "st-chatu8-placeholder-menu-item";
    if (_0x4ebe2e.placeholder === _0x3402f7) {
      _0x2e2c7b.classList.add("recommended");
    }
    _0x2e2c7b.innerHTML = "\n            <span class=\"placeholder-code\">" + _0x4ebe2e.placeholder + "</span>\n            <span class=\"placeholder-label\">" + _0x4ebe2e.label + "</span>\n        ";
    _0x2e2c7b.onclick = () => {
      const _0xce5e65 = _0x289aa4.closest(".st-chatu8-workflow-viz-input-wrapper");
      if (_0x289aa4.tagName === "SELECT" || _0x289aa4.tagName === "INPUT" && _0x289aa4.type === "number") {
        const _0x2ada12 = document.createElement("input");
        _0x2ada12.type = "text";
        _0x2ada12.value = _0x4ebe2e.placeholder;
        _0x2ada12.className = _0x289aa4.className;
        _0x2ada12.onchange = () => _0x4e1410(_0x2ada12.value);
        if (_0xce5e65) {
          _0xce5e65.replaceChild(_0x2ada12, _0x289aa4);
          _0x289aa4 = _0x2ada12;
        } else {
          _0x289aa4.parentNode.replaceChild(_0x2ada12, _0x289aa4);
        }
      } else if (_0x289aa4.tagName === "INPUT" || _0x289aa4.tagName === "TEXTAREA") {
        _0x289aa4.value = _0x4ebe2e.placeholder;
      }
      _0x4e1410(_0x4ebe2e.placeholder);
      _0x14834b.remove();
    };
    _0x14834b.appendChild(_0x2e2c7b);
  });
  const _0x36370c = document.createElement("div");
  _0x36370c.className = "st-chatu8-placeholder-menu-item st-chatu8-placeholder-clear";
  _0x36370c.innerHTML = "\n        <span class=\"placeholder-code\" style=\"color: #e74c3c;\">🗑️ 清除占位符</span>\n        <span class=\"placeholder-label\">恢复为默认值" + (_0x56fe61 ? ": " + _0x56fe61 : "") + "</span>\n    ";
  _0x36370c.onclick = () => {
    if (_0x289aa4.tagName === "INPUT" || _0x289aa4.tagName === "TEXTAREA") {
      _0x289aa4.value = _0x56fe61;
      _0x4e1410(_0x56fe61);
    }
    _0x14834b.remove();
  };
  _0x14834b.appendChild(_0x36370c);
  const _0x100e5d = _0x21877f.getBoundingClientRect();
  const _0x4217af = 220;
  const _0x178bbf = 350;
  let _0x188bc1 = _0x100e5d.left;
  let _0x39c544 = _0x100e5d.bottom + 5;
  if (_0x188bc1 + _0x4217af > window.innerWidth) {
    _0x188bc1 = window.innerWidth - _0x4217af - 10;
  }
  if (_0x188bc1 < 10) {
    _0x188bc1 = 10;
  }
  if (_0x39c544 + _0x178bbf > window.innerHeight) {
    _0x39c544 = _0x100e5d.top - _0x178bbf - 5;
    if (_0x39c544 < 10) {
      _0x39c544 = 10;
    }
  }
  _0x14834b.style.position = "fixed";
  _0x14834b.style.top = _0x39c544 + "px";
  _0x14834b.style.left = _0x188bc1 + "px";
  _0x14834b.style.maxWidth = window.innerWidth - 20 + "px";
  document.body.appendChild(_0x14834b);
  const _0x440765 = _0x591d05 => {
    if (!_0x14834b.contains(_0x591d05.target) && _0x591d05.target !== _0x21877f) {
      _0x14834b.remove();
      document.removeEventListener("click", _0x440765);
    }
  };
  setTimeout(() => document.addEventListener("click", _0x440765), 0);
}
function worker_change() {
  const _0x41acaf = extension_settings[extensionName];
  const _0x2d05a7 = document.getElementById("worker");
  const _0x581cc7 = document.getElementById("workerid");
  _0x41acaf.workerid = _0x581cc7.value;
  _0x41acaf.worker = _0x41acaf.workers[_0x41acaf.workerid];
  saveSettingsDebounced();
  _0x2d05a7.value = _0x41acaf.workers[_0x41acaf.workerid];
  $(_0x2d05a7).trigger("input");
}
function worker_save() {
  const _0x43fce5 = extension_settings[extensionName];
  stylInput("请输入配置名称").then(_0x5aa883 => {
    if (_0x5aa883) {
      const _0x38f3b0 = document.getElementById("worker");
      const _0x4d0791 = document.getElementById("workerid");
      let _0x120773 = new Option(_0x5aa883, _0x5aa883);
      _0x120773.title = _0x5aa883;
      if (!_0x43fce5.workers.hasOwnProperty(_0x5aa883)) {
        _0x4d0791.add(_0x120773);
      }
      _0x4d0791.value = _0x5aa883;
      _0x43fce5.workerid = _0x5aa883;
      _0x43fce5.workers[_0x5aa883] = _0x38f3b0.value;
      _0x43fce5.worker = _0x38f3b0.value;
      saveSettingsDebounced();
    }
  });
}
function worker_delete() {
  const _0x228098 = extension_settings[extensionName];
  stylishConfirm("是否确定删除").then(_0x1569c0 => {
    if (_0x1569c0) {
      const _0x237930 = document.getElementById("worker");
      const _0x188a1c = document.getElementById("workerid");
      const _0x31bb97 = _0x188a1c.value;
      if (_0x31bb97 === "默认" || _0x31bb97 === "默认人物一致" || _0x31bb97 === "面部细化") {
        alert("默认配置不能删除");
        return;
      }
      Reflect.deleteProperty(_0x228098.workers, _0x31bb97);
      _0x188a1c.remove(_0x188a1c.selectedIndex);
      _0x188a1c.value = "默认";
      _0x228098.workerid = "默认";
      _0x228098.worker = _0x228098.workers[_0x228098.workerid];
      _0x237930.value = _0x228098.workers[_0x228098.workerid];
      saveSettingsDebounced();
    }
  });
}
function worker_update() {
  const _0xec068b = extension_settings[extensionName];
  const _0x20eda0 = _0xec068b.workerid;
  if (!_0x20eda0 || !_0xec068b.workers[_0x20eda0]) {
    alert("没有活动的工作流可保存。请先“另存为”一个新工作流。");
    return;
  }
  if (["默认", "默认人物一致", "面部细化"].includes(_0x20eda0)) {
    alert("默认工作流 \"" + _0x20eda0 + "\" 不能被修改。请使用“另存为”创建一个副本。");
    return;
  }
  stylishConfirm("确定要覆盖当前工作流 \"" + _0x20eda0 + "\" 吗？").then(_0x179ed9 => {
    if (_0x179ed9) {
      const _0x3a1be1 = document.getElementById("worker").value;
      _0xec068b.workers[_0x20eda0] = _0x3a1be1;
      if (_0xec068b.workerid === _0x20eda0) {
        _0xec068b.worker = _0x3a1be1;
      }
      saveSettingsDebounced();
    }
  });
}
function worker_export_current() {
  const _0x4dca54 = extension_settings[extensionName];
  const _0x42e1ab = _0x4dca54.workerid;
  if (!_0x42e1ab || !_0x4dca54.workers[_0x42e1ab]) {
    alert("没有选中的工作流可导出。");
    return;
  }
  const _0x5dea2c = {
    [_0x42e1ab]: _0x4dca54.workers[_0x42e1ab]
  };
  const _0x29999e = _0x5dea2c;
  const _0x1b9932 = JSON.stringify(_0x29999e, null, 2);
  const _0x3fa46a = new Blob([_0x1b9932], {
    type: "application/json"
  });
  const _0xc4242c = URL.createObjectURL(_0x3fa46a);
  const _0x51d1b1 = document.createElement("a");
  _0x51d1b1.href = _0xc4242c;
  _0x51d1b1.download = "st-chatu8-workflow-" + _0x42e1ab + ".json";
  document.body.appendChild(_0x51d1b1);
  _0x51d1b1.click();
  document.body.removeChild(_0x51d1b1);
  URL.revokeObjectURL(_0xc4242c);
}
function worker_export_all() {
  const _0x392e36 = extension_settings[extensionName];
  if (!_0x392e36.workers || Object.keys(_0x392e36.workers).length === 0) {
    alert("没有工作流可导出。");
    return;
  }
  const _0x15df6f = JSON.stringify(_0x392e36.workers, null, 2);
  const _0x176049 = new Blob([_0x15df6f], {
    type: "application/json"
  });
  const _0x20e275 = URL.createObjectURL(_0x176049);
  const _0x2ad06d = document.createElement("a");
  _0x2ad06d.href = _0x20e275;
  _0x2ad06d.download = "st-chatu8-workflows-all.json";
  document.body.appendChild(_0x2ad06d);
  _0x2ad06d.click();
  document.body.removeChild(_0x2ad06d);
  URL.revokeObjectURL(_0x20e275);
}
function isComfyUIFullWorkflow(_0x28e79a) {
  if (typeof _0x28e79a !== "object" || _0x28e79a === null || Array.isArray(_0x28e79a)) {
    return false;
  }
  if (_0x28e79a.hasOwnProperty("nodes") && Array.isArray(_0x28e79a.nodes)) {
    if (_0x28e79a.nodes.length > 0 && _0x28e79a.nodes.some(_0x13b485 => _0x13b485 && _0x13b485.type)) {
      return true;
    }
  }
  return false;
}
function isRawComfyUIWorkflow(_0x3df231) {
  if (typeof _0x3df231 !== "object" || _0x3df231 === null || Array.isArray(_0x3df231)) {
    return false;
  }
  const _0x389277 = Object.keys(_0x3df231);
  if (_0x389277.length === 0) {
    return false;
  }
  let _0x3bbcc2 = false;
  for (const _0x500177 of _0x389277) {
    const _0x3266b5 = _0x3df231[_0x500177];
    if (typeof _0x3266b5 === "object" && _0x3266b5 !== null && !Array.isArray(_0x3266b5)) {
      if (_0x3266b5.hasOwnProperty("class_type")) {
        _0x3bbcc2 = true;
      }
    } else if (typeof _0x3266b5 === "string") {
      return false;
    }
  }
  return _0x3bbcc2;
}
async function worker_import() {
  const _0x2e8017 = extension_settings[extensionName];
  const _0x1164ce = document.createElement("input");
  _0x1164ce.type = "file";
  _0x1164ce.accept = ".json";
  _0x1164ce.onchange = async _0xf173e => {
    const _0x29bb72 = _0xf173e.target.files[0];
    if (!_0x29bb72) {
      return;
    }
    const _0x10162e = new FileReader();
    _0x10162e.onload = async _0x8117b1 => {
      try {
        const _0x591654 = JSON.parse(_0x8117b1.target.result);
        if (isComfyUIFullWorkflow(_0x591654)) {
          alert("检测到ComfyUI完整工作流格式（包含UI信息）。\n\n请在ComfyUI中打开此工作流，然后导出为API格式后再导入。\n\n");
          return;
        }
        if (isRawComfyUIWorkflow(_0x591654)) {
          const _0x36e698 = _0x29bb72.name.replace(/\.json$/i, "") || "导入的工作流";
          const _0x400f53 = await stylInput("检测到原始ComfyUI API工作流，请为其命名：", _0x36e698);
          if (_0x400f53 && _0x400f53.trim()) {
            const _0x34b341 = _0x400f53.trim();
            const _0x393664 = JSON.stringify(_0x591654, null, 2);
            const _0x385303 = !_0x2e8017.workers.hasOwnProperty(_0x34b341);
            _0x2e8017.workers[_0x34b341] = _0x393664;
            const _0x2859fb = document.getElementById("workerid");
            if (_0x2859fb && _0x385303) {
              const _0x7f4dfd = new Option(_0x34b341, _0x34b341);
              _0x7f4dfd.title = _0x34b341;
              _0x2859fb.add(_0x7f4dfd);
            }
            _0x2859fb.value = _0x34b341;
            _0x2e8017.workerid = _0x34b341;
            _0x2e8017.worker = _0x393664;
            const _0x50e999 = document.getElementById("editWorkerid");
            if (_0x50e999 && _0x385303) {
              const _0x247265 = new Option(_0x34b341, _0x34b341);
              _0x247265.title = _0x34b341;
              _0x50e999.add(_0x247265);
            }
            const _0x27c892 = document.getElementById("worker");
            if (_0x27c892) {
              _0x27c892.value = _0x393664;
            }
            saveSettingsDebounced();
            alert("成功导入原始ComfyUI工作流，已保存为: \"" + _0x34b341 + "\"");
          } else {
            alert("导入已取消。");
          }
        } else {
          let _0x1369aa = 0;
          const _0x2a59f1 = document.getElementById("workerid");
          const _0x3ff533 = document.getElementById("editWorkerid");
          for (const _0x15621d in _0x591654) {
            if (_0x591654.hasOwnProperty(_0x15621d)) {
              const _0xabce24 = typeof _0x591654[_0x15621d] === "string" ? _0x591654[_0x15621d] : JSON.stringify(_0x591654[_0x15621d], null, 2);
              const _0x4ad30f = !_0x2e8017.workers.hasOwnProperty(_0x15621d);
              if (_0x4ad30f) {
                _0x1369aa++;
                if (_0x2a59f1) {
                  const _0x2d6a89 = new Option(_0x15621d, _0x15621d);
                  _0x2d6a89.title = _0x15621d;
                  _0x2a59f1.add(_0x2d6a89);
                }
                if (_0x3ff533) {
                  const _0x2dfc4b = new Option(_0x15621d, _0x15621d);
                  _0x2dfc4b.title = _0x15621d;
                  _0x3ff533.add(_0x2dfc4b);
                }
              }
              _0x2e8017.workers[_0x15621d] = _0xabce24;
            }
          }
          saveSettingsDebounced();
          alert("成功导入 " + Object.keys(_0x591654).length + " 个工作流，其中 " + _0x1369aa + " 个是全新的。");
        }
      } catch (_0x953336) {
        alert("导入失败，请确保文件是正确的JSON格式。");
        console.error("Error importing workflows:", _0x953336);
      }
    };
    _0x10162e.readAsText(_0x29bb72);
  };
  _0x1164ce.click();
}
function renderNodeProperties(_0x156a62, _0x2a17a3, _0x48be2f, _0x8ee017, _0x37e175, _0x28bcf7, _0x5f1d09) {
  const _0x2789e6 = _0x8ee017[_0x2a17a3.classType] || {};
  const _0x4e5492 = _0x2789e6.input || {};
  const _0x3afee3 = _0x4e5492.required || {};
  const _0x25f264 = _0x4e5492.optional || {};
  const _0x4c4524 = _0x2a17a3.meta.title || _0x2a17a3.classType;
  const _0x46b92b = checkNodeSkippable(_0x2a17a3.id, _0x48be2f, _0x37e175, _0x8ee017);
  const _0x2b852a = _0x48be2f[_0x2a17a3.id]._skip === true;
  _0x156a62.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-properties-header\">\n            <h4>" + _0x4c4524 + "</h4>\n            <span class=\"node-id\">#" + _0x2a17a3.id + " · " + _0x2a17a3.classType + "</span>\n        </div>\n        <div class=\"st-chatu8-workflow-viz-skip-section\" id=\"viz-skip-section\"></div>\n        <div class=\"st-chatu8-workflow-viz-properties-content\" id=\"viz-properties-inputs\"></div>\n    ";
  const _0x2f5fd8 = _0x156a62.querySelector("#viz-skip-section");
  const _0x1a2f78 = document.createElement("div");
  _0x1a2f78.className = "st-chatu8-workflow-viz-skip-group";
  const _0x4fb5d2 = document.createElement("label");
  _0x4fb5d2.className = "st-chatu8-workflow-viz-skip-label";
  const _0x1d66be = document.createElement("input");
  _0x1d66be.type = "checkbox";
  _0x1d66be.checked = _0x2b852a;
  _0x1d66be.disabled = !_0x46b92b.canSkip && !_0x2b852a;
  const _0x488d9f = document.createElement("span");
  _0x488d9f.textContent = "跳过此节点";
  _0x4fb5d2.appendChild(_0x1d66be);
  _0x4fb5d2.appendChild(_0x488d9f);
  _0x1a2f78.appendChild(_0x4fb5d2);
  const _0x498828 = document.createElement("div");
  _0x498828.className = "st-chatu8-workflow-viz-skip-status";
  if (!_0x46b92b.canSkip && !_0x2b852a) {
    _0x498828.className += " not-skippable";
    _0x498828.innerHTML = "<i class=\"fa-solid fa-triangle-exclamation\"></i> " + _0x46b92b.reason;
  } else if (_0x2b852a) {
    _0x498828.className += " skipped";
    const _0x34948b = _0x46b92b.supportsTypeMatch ? "（类型匹配）" : "";
    _0x498828.innerHTML = "<i class=\"fa-solid fa-forward\"></i> 节点将被跳过，执行时将重映射连接" + _0x34948b;
  } else if (_0x46b92b.supportsTypeMatch) {
    _0x498828.className += " can-skip type-match";
    _0x498828.innerHTML = "<i class=\"fa-solid fa-check-double\"></i> " + _0x46b92b.reason;
  } else {
    _0x498828.className += " can-skip";
    _0x498828.innerHTML = "<i class=\"fa-solid fa-check\"></i> 可以跳过";
  }
  _0x1a2f78.appendChild(_0x498828);
  _0x2f5fd8.appendChild(_0x1a2f78);
  _0x1d66be.onchange = () => {
    _0x48be2f[_0x2a17a3.id]._skip = _0x1d66be.checked;
    if (_0x5f1d09) {
      _0x5f1d09(_0x2a17a3.id, _0x1d66be.checked);
    }
    if (_0x28bcf7) {
      _0x28bcf7();
    }
    renderNodeProperties(_0x156a62, _0x2a17a3, _0x48be2f, _0x8ee017, _0x37e175, _0x28bcf7, _0x5f1d09);
  };
  const _0x424dc4 = _0x156a62.querySelector("#viz-properties-inputs");
  const _0x19cf5c = {
    ..._0x3afee3,
    ..._0x25f264
  };
  const _0x2ed09c = _0x19cf5c;
  for (const [_0x301ef5, _0x55bf4f] of Object.entries(_0x2ed09c)) {
    const _0xad051f = _0x2a17a3.inputs[_0x301ef5];
    const _0x16f300 = Array.isArray(_0xad051f) && _0xad051f.length === 2 && typeof _0xad051f[0] === "string";
    const _0x4b084e = document.createElement("div");
    _0x4b084e.className = "st-chatu8-workflow-viz-property-group";
    const _0x572709 = document.createElement("label");
    _0x572709.textContent = _0x301ef5;
    if (_0x16f300) {
      const _0x5ecfd4 = document.createElement("span");
      _0x5ecfd4.className = "connection-badge";
      _0x5ecfd4.textContent = "连接";
      _0x572709.appendChild(_0x5ecfd4);
    }
    _0x4b084e.appendChild(_0x572709);
    if (_0x16f300) {
      const _0x1c6935 = document.createElement("div");
      _0x1c6935.className = "connection-display";
      _0x1c6935.textContent = "← 节点 #" + _0xad051f[0] + " 输出 " + _0xad051f[1];
      _0x4b084e.appendChild(_0x1c6935);
    } else {
      const _0x1ed3d4 = createInputControl(_0x301ef5, _0x55bf4f, _0xad051f, _0x1c2f93 => {
        _0x48be2f[_0x2a17a3.id].inputs[_0x301ef5] = _0x1c2f93;
        _0x2a17a3.inputs[_0x301ef5] = _0x1c2f93;
        if (_0x28bcf7) {
          _0x28bcf7();
        }
      });
      _0x4b084e.appendChild(_0x1ed3d4);
    }
    _0x424dc4.appendChild(_0x4b084e);
  }
  if (Object.keys(_0x2ed09c).length === 0 && Object.keys(_0x2a17a3.inputs).length > 0) {
    for (const [_0x473b0c, _0x235298] of Object.entries(_0x2a17a3.inputs)) {
      const _0x4207aa = Array.isArray(_0x235298) && _0x235298.length === 2 && typeof _0x235298[0] === "string";
      const _0x228a84 = document.createElement("div");
      _0x228a84.className = "st-chatu8-workflow-viz-property-group";
      const _0x2badd9 = document.createElement("label");
      _0x2badd9.textContent = _0x473b0c;
      if (_0x4207aa) {
        const _0xb0c85f = document.createElement("span");
        _0xb0c85f.className = "connection-badge";
        _0xb0c85f.textContent = "连接";
        _0x2badd9.appendChild(_0xb0c85f);
      }
      _0x228a84.appendChild(_0x2badd9);
      if (_0x4207aa) {
        const _0x3e14fa = document.createElement("div");
        _0x3e14fa.className = "connection-display";
        _0x3e14fa.textContent = "← 节点 #" + _0x235298[0] + " 输出 " + _0x235298[1];
        _0x228a84.appendChild(_0x3e14fa);
      } else {
        const _0x2d82bd = createInputControlByValue(_0x473b0c, _0x235298, _0x8e0a40 => {
          _0x48be2f[_0x2a17a3.id].inputs[_0x473b0c] = _0x8e0a40;
          _0x2a17a3.inputs[_0x473b0c] = _0x8e0a40;
          if (_0x28bcf7) {
            _0x28bcf7();
          }
        });
        _0x228a84.appendChild(_0x2d82bd);
      }
      _0x424dc4.appendChild(_0x228a84);
    }
  }
}
function isPlaceholderValue(_0x2d654e) {
  if (typeof _0x2d654e !== "string") {
    return false;
  }
  return _0x2d654e.startsWith("%") && _0x2d654e.endsWith("%");
}
function createInputControl(_0x20be49, _0x2352fc, _0x1c5aeb, _0x149754) {
  const _0x15bd10 = Array.isArray(_0x2352fc) ? _0x2352fc[0] : _0x2352fc;
  const _0x1a6f99 = Array.isArray(_0x2352fc) && _0x2352fc[1] ? _0x2352fc[1] : {};
  if (isPlaceholderValue(_0x1c5aeb)) {
    const _0xe4885f = document.createElement("input");
    _0xe4885f.type = "text";
    _0xe4885f.value = _0x1c5aeb;
    _0xe4885f.onchange = () => _0x149754(_0xe4885f.value);
    return wrapWithPlaceholderButton(_0xe4885f, _0x20be49, _0x149754);
  }
  if (Array.isArray(_0x15bd10)) {
    const _0x2844d6 = document.createElement("select");
    let _0x3bfc75 = false;
    _0x15bd10.forEach(_0x1c3a93 => {
      const _0x195da5 = document.createElement("option");
      _0x195da5.value = _0x1c3a93;
      _0x195da5.textContent = _0x1c3a93;
      if (_0x1c3a93 === _0x1c5aeb) {
        _0x195da5.selected = true;
        _0x3bfc75 = true;
      }
      _0x2844d6.appendChild(_0x195da5);
    });
    if (!_0x3bfc75 && _0x15bd10.length > 0) {
      _0x2844d6.value = _0x15bd10[0];
      setTimeout(() => _0x149754(_0x15bd10[0]), 0);
    }
    _0x2844d6.onchange = () => _0x149754(_0x2844d6.value);
    const _0x18f9ac = _0x15bd10.length > 0 ? _0x15bd10[0] : "";
    return wrapWithPlaceholderButton(_0x2844d6, _0x20be49, _0x149754, _0x18f9ac);
  }
  switch (_0x15bd10) {
    case "INT":
      const _0x4e0fbe = document.createElement("input");
      _0x4e0fbe.type = "number";
      _0x4e0fbe.step = "1";
      _0x4e0fbe.value = _0x1c5aeb ?? _0x1a6f99.default ?? 0;
      if (_0x1a6f99.min !== undefined) {
        _0x4e0fbe.min = _0x1a6f99.min;
      }
      if (_0x1a6f99.max !== undefined) {
        _0x4e0fbe.max = _0x1a6f99.max;
      }
      _0x4e0fbe.onchange = () => _0x149754(parseInt(_0x4e0fbe.value, 10));
      return wrapWithPlaceholderButton(_0x4e0fbe, _0x20be49, _0x149754);
    case "FLOAT":
      const _0xf00a2b = document.createElement("input");
      _0xf00a2b.type = "number";
      _0xf00a2b.step = _0x1a6f99.step || "0.01";
      _0xf00a2b.value = _0x1c5aeb ?? _0x1a6f99.default ?? 0;
      if (_0x1a6f99.min !== undefined) {
        _0xf00a2b.min = _0x1a6f99.min;
      }
      if (_0x1a6f99.max !== undefined) {
        _0xf00a2b.max = _0x1a6f99.max;
      }
      _0xf00a2b.onchange = () => _0x149754(parseFloat(_0xf00a2b.value));
      return wrapWithPlaceholderButton(_0xf00a2b, _0x20be49, _0x149754);
    case "BOOLEAN":
      const _0x2f35cb = document.createElement("div");
      _0x2f35cb.className = "checkbox-wrapper";
      const _0x19fdb9 = document.createElement("input");
      _0x19fdb9.type = "checkbox";
      _0x19fdb9.checked = _0x1c5aeb ?? _0x1a6f99.default ?? false;
      _0x19fdb9.onchange = () => _0x149754(_0x19fdb9.checked);
      _0x2f35cb.appendChild(_0x19fdb9);
      const _0x5940b6 = document.createElement("span");
      _0x5940b6.textContent = _0x19fdb9.checked ? "是" : "否";
      _0x19fdb9.onchange = () => {
        _0x149754(_0x19fdb9.checked);
        _0x5940b6.textContent = _0x19fdb9.checked ? "是" : "否";
      };
      _0x2f35cb.appendChild(_0x5940b6);
      return _0x2f35cb;
    case "STRING":
      if (_0x1a6f99.multiline) {
        const _0x23931d = document.createElement("textarea");
        _0x23931d.value = _0x1c5aeb ?? _0x1a6f99.default ?? "";
        _0x23931d.onchange = () => _0x149754(_0x23931d.value);
        return wrapWithPlaceholderButton(_0x23931d, _0x20be49, _0x149754);
      } else {
        const _0x38f4c0 = document.createElement("input");
        _0x38f4c0.type = "text";
        _0x38f4c0.value = _0x1c5aeb ?? _0x1a6f99.default ?? "";
        _0x38f4c0.onchange = () => _0x149754(_0x38f4c0.value);
        return wrapWithPlaceholderButton(_0x38f4c0, _0x20be49, _0x149754);
      }
    default:
      return createInputControlByValue(_0x20be49, _0x1c5aeb, _0x149754);
  }
}
function createInputControlByValue(_0x1c913c, _0x44d53f, _0xa86bc2) {
  if (typeof _0x44d53f === "boolean") {
    const _0x346daa = document.createElement("div");
    _0x346daa.className = "checkbox-wrapper";
    const _0x3f501a = document.createElement("input");
    _0x3f501a.type = "checkbox";
    _0x3f501a.checked = _0x44d53f;
    const _0x263f78 = document.createElement("span");
    _0x263f78.textContent = _0x3f501a.checked ? "是" : "否";
    _0x3f501a.onchange = () => {
      _0xa86bc2(_0x3f501a.checked);
      _0x263f78.textContent = _0x3f501a.checked ? "是" : "否";
    };
    _0x346daa.appendChild(_0x3f501a);
    _0x346daa.appendChild(_0x263f78);
    return _0x346daa;
  } else if (typeof _0x44d53f === "number") {
    const _0x1470cb = document.createElement("input");
    _0x1470cb.type = "number";
    _0x1470cb.step = Number.isInteger(_0x44d53f) ? "1" : "0.01";
    _0x1470cb.value = _0x44d53f;
    _0x1470cb.onchange = () => _0xa86bc2(Number.isInteger(_0x44d53f) ? parseInt(_0x1470cb.value, 10) : parseFloat(_0x1470cb.value));
    return wrapWithPlaceholderButton(_0x1470cb, _0x1c913c, _0xa86bc2);
  } else {
    const _0x3e62f3 = String(_0x44d53f ?? "");
    if (_0x3e62f3.length > 50 || _0x3e62f3.includes("\n")) {
      const _0x337228 = document.createElement("textarea");
      _0x337228.value = _0x3e62f3;
      _0x337228.onchange = () => _0xa86bc2(_0x337228.value);
      return wrapWithPlaceholderButton(_0x337228, _0x1c913c, _0xa86bc2);
    } else {
      const _0x561958 = document.createElement("input");
      _0x561958.type = "text";
      _0x561958.value = _0x3e62f3;
      _0x561958.onchange = () => _0xa86bc2(_0x561958.value);
      return wrapWithPlaceholderButton(_0x561958, _0x1c913c, _0xa86bc2);
    }
  }
}
export function visualizeWorkflow() {
  const _0x2abdf1 = document.getElementById("worker");
  if (!_0x2abdf1 || !_0x2abdf1.value.trim()) {
    alert("没有工作流可以可视化。请先输入或选择一个工作流。");
    return;
  }
  let _0x4b849d;
  try {
    _0x4b849d = JSON.parse(_0x2abdf1.value.trim());
  } catch (_0x3fb2eb) {
    alert("工作流 JSON 格式不正确: " + _0x3fb2eb.message);
    return;
  }
  const _0x1ff664 = document.createElement("div");
  _0x1ff664.className = "st-chatu8-workflow-viz-backdrop";
  _0x1ff664.innerHTML = "\n        <div class=\"st-chatu8-workflow-viz-dialog\">\n            <div class=\"st-chatu8-workflow-viz-header\">\n                <h3>工作流可视化</h3>\n                <span class=\"st-chatu8-workflow-viz-close\">&times;</span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-toolbar\">\n                <button class=\"st-chatu8-btn\" id=\"viz-zoom-in\"><i class=\"fa-solid fa-magnifying-glass-plus\"></i></button>\n                <button class=\"st-chatu8-btn\" id=\"viz-zoom-out\"><i class=\"fa-solid fa-magnifying-glass-minus\"></i></button>\n                <button class=\"st-chatu8-btn\" id=\"viz-zoom-reset\"><i class=\"fa-solid fa-expand\"></i> 重置</button>\n                <button class=\"st-chatu8-btn\" id=\"viz-save-workflow\"><i class=\"fa-solid fa-save\"></i> 保存修改</button>\n                <span class=\"st-chatu8-workflow-viz-stats\"></span>\n            </div>\n            <div class=\"st-chatu8-workflow-viz-body\">\n                <div class=\"st-chatu8-workflow-viz-container\">\n                    <div class=\"st-chatu8-workflow-viz-svg-wrapper\">\n                        <svg class=\"st-chatu8-workflow-viz-svg\"></svg>\n                    </div>\n                </div>\n                <div class=\"st-chatu8-workflow-viz-properties\" id=\"viz-properties-panel\">\n                    <div class=\"st-chatu8-workflow-viz-properties-placeholder\">\n                        <i class=\"fa-solid fa-mouse-pointer\"></i>\n                        <p>点击节点查看属性</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ";
  document.body.appendChild(_0x1ff664);
  const _0x77abef = _0x1ff664.querySelector(".st-chatu8-workflow-viz-close");
  const _0x3ec99e = _0x1ff664.querySelector(".st-chatu8-workflow-viz-container");
  const _0x18914c = _0x1ff664.querySelector(".st-chatu8-workflow-viz-svg-wrapper");
  const _0x8903cf = _0x1ff664.querySelector(".st-chatu8-workflow-viz-svg");
  const _0x44cd00 = _0x1ff664.querySelector(".st-chatu8-workflow-viz-stats");
  const _0x35568d = _0x1ff664.querySelector("#viz-properties-panel");
  const _0x31f33c = extension_settings[extensionName];
  const _0x3a04d1 = _0x31f33c?.comfyuiCache?.objectInfo || {};
  let _0x4716d2 = null;
  let _0x551513 = false;
  _0x77abef.onclick = () => _0x1ff664.remove();
  const _0x2fe545 = window.innerWidth <= 768;
  const _0x34ab2d = () => {
    if (!_0x2fe545) {
      return;
    }
    const _0x2a4dda = _0x35568d.querySelector(".st-chatu8-workflow-viz-properties-close-mobile");
    if (_0x2a4dda) {
      _0x2a4dda.remove();
    }
    const _0x5ca936 = document.createElement("span");
    _0x5ca936.className = "st-chatu8-workflow-viz-properties-close-mobile";
    _0x5ca936.innerHTML = "&times;";
    _0x5ca936.onclick = _0x5edcca => {
      _0x5edcca.stopPropagation();
      _0x35568d.classList.remove("visible");
    };
    _0x35568d.insertBefore(_0x5ca936, _0x35568d.firstChild);
  };
  const _0x4af702 = (_0x970233 = null) => {
    if (!_0x2fe545) {
      return;
    }
    if (_0x970233 !== null) {
      _0x35568d.classList.toggle("visible", _0x970233);
    } else {
      _0x35568d.classList.toggle("visible");
    }
  };
  const _0x3f42ce = [];
  const _0x2668ca = {};
  const _0x1d32d8 = [];
  for (const _0x5e505b in _0x4b849d) {
    if (_0x4b849d.hasOwnProperty(_0x5e505b)) {
      const _0x34febf = _0x4b849d[_0x5e505b];
      const _0x273ed1 = {
        id: _0x5e505b,
        classType: _0x34febf.class_type || "未知",
        inputs: _0x34febf.inputs || {},
        meta: _0x34febf._meta || {}
      };
      const _0x400360 = _0x273ed1;
      _0x3f42ce.push(_0x400360);
      _0x2668ca[_0x5e505b] = _0x400360;
    }
  }
  for (const _0x3e7448 of _0x3f42ce) {
    for (const _0x2d8f6b in _0x3e7448.inputs) {
      const _0x3573e7 = _0x3e7448.inputs[_0x2d8f6b];
      if (Array.isArray(_0x3573e7) && _0x3573e7.length === 2 && typeof _0x3573e7[0] === "string") {
        const _0x2b4b56 = {
          from: _0x3573e7[0],
          fromOutput: _0x3573e7[1],
          to: _0x3e7448.id,
          toInput: _0x2d8f6b
        };
        _0x1d32d8.push(_0x2b4b56);
      }
    }
  }
  _0x44cd00.textContent = "节点: " + _0x3f42ce.length + " | 连接: " + _0x1d32d8.length;
  const _0x55d5cd = 180;
  const _0x21cebb = 60;
  const _0x5d095d = 80;
  const _0x523ab2 = 30;
  const _0x2fcb6b = {};
  const _0x58eb9a = {};
  _0x3f42ce.forEach(_0x573862 => {
    _0x2fcb6b[_0x573862.id] = 0;
  });
  _0x1d32d8.forEach(_0x5ed18c => {
    if (_0x2fcb6b[_0x5ed18c.to] !== undefined) {
      _0x2fcb6b[_0x5ed18c.to]++;
    }
  });
  let _0x59a97a = _0x3f42ce.filter(_0x2a479d => _0x2fcb6b[_0x2a479d.id] === 0).map(_0x59295a => _0x59295a.id);
  let _0x47553d = 0;
  const _0x28fbce = new Set();
  while (_0x59a97a.length > 0) {
    const _0x56867b = [];
    for (const _0xdf17c6 of _0x59a97a) {
      if (_0x28fbce.has(_0xdf17c6)) {
        continue;
      }
      _0x28fbce.add(_0xdf17c6);
      _0x58eb9a[_0xdf17c6] = _0x47553d;
      _0x1d32d8.filter(_0xb400d0 => _0xb400d0.from === _0xdf17c6).forEach(_0xc1709e => {
        if (!_0x28fbce.has(_0xc1709e.to)) {
          _0x56867b.push(_0xc1709e.to);
        }
      });
    }
    _0x59a97a = _0x56867b;
    _0x47553d++;
  }
  _0x3f42ce.forEach(_0x59040f => {
    if (_0x58eb9a[_0x59040f.id] === undefined) {
      _0x58eb9a[_0x59040f.id] = _0x47553d;
    }
  });
  const _0x4936bb = {};
  _0x3f42ce.forEach(_0x2af0b2 => {
    const _0x486e42 = _0x58eb9a[_0x2af0b2.id];
    if (!_0x4936bb[_0x486e42]) {
      _0x4936bb[_0x486e42] = [];
    }
    _0x4936bb[_0x486e42].push(_0x2af0b2);
  });
  const _0x5eada0 = {};
  let _0x26eef2 = 0;
  let _0x501776 = 0;
  Object.keys(_0x4936bb).sort((_0x4f59de, _0x18d413) => _0x4f59de - _0x18d413).forEach(_0x528ede => {
    const _0x505114 = _0x4936bb[_0x528ede];
    const _0x359e03 = parseInt(_0x528ede) * (_0x55d5cd + _0x5d095d) + 50;
    _0x505114.forEach((_0x2b608f, _0x32b646) => {
      const _0x23416f = _0x32b646 * (_0x21cebb + _0x523ab2) + 50;
      const _0x10d3e7 = {
        x: _0x359e03,
        y: _0x23416f
      };
      _0x5eada0[_0x2b608f.id] = _0x10d3e7;
      _0x26eef2 = Math.max(_0x26eef2, _0x359e03 + _0x55d5cd);
      _0x501776 = Math.max(_0x501776, _0x23416f + _0x21cebb);
    });
  });
  const _0x3f52d6 = _0x26eef2 + 100;
  const _0x5bb9e1 = _0x501776 + 100;
  _0x8903cf.setAttribute("width", _0x3f52d6);
  _0x8903cf.setAttribute("height", _0x5bb9e1);
  _0x8903cf.setAttribute("viewBox", "0 0 " + _0x3f52d6 + " " + _0x5bb9e1);
  const _0x40553c = {};
  const _0x1254b0 = ["#4a90e2", "#50c878", "#f5a623", "#d0021b", "#9b59b6", "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#1abc9c"];
  let _0x4808ec = 0;
  const _0x4947a5 = _0x365610 => {
    if (!_0x40553c[_0x365610]) {
      _0x40553c[_0x365610] = _0x1254b0[_0x4808ec % _0x1254b0.length];
      _0x4808ec++;
    }
    return _0x40553c[_0x365610];
  };
  const _0x5d37be = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  _0x5d37be.innerHTML = "\n        <marker id=\"arrowhead\" markerWidth=\"10\" markerHeight=\"7\" refX=\"10\" refY=\"3.5\" orient=\"auto\">\n            <polygon points=\"0 0, 10 3.5, 0 7\" fill=\"#888\" />\n        </marker>\n    ";
  _0x8903cf.appendChild(_0x5d37be);
  _0x1d32d8.forEach(_0x4e478e => {
    const _0x34d7a5 = _0x5eada0[_0x4e478e.from];
    const _0x1f201f = _0x5eada0[_0x4e478e.to];
    if (!_0x34d7a5 || !_0x1f201f) {
      return;
    }
    const _0x1bf368 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const _0x4fec3d = _0x34d7a5.x + _0x55d5cd;
    const _0x242063 = _0x34d7a5.y + _0x21cebb / 2;
    const _0x4c12ce = _0x1f201f.x;
    const _0x598ff5 = _0x1f201f.y + _0x21cebb / 2;
    const _0xfb8cff = Math.abs(_0x4c12ce - _0x4fec3d) / 2;
    _0x1bf368.setAttribute("d", "M " + _0x4fec3d + " " + _0x242063 + " C " + (_0x4fec3d + _0xfb8cff) + " " + _0x242063 + ", " + (_0x4c12ce - _0xfb8cff) + " " + _0x598ff5 + ", " + _0x4c12ce + " " + _0x598ff5);
    _0x1bf368.setAttribute("stroke", "#666");
    _0x1bf368.setAttribute("stroke-width", "2");
    _0x1bf368.setAttribute("fill", "none");
    _0x1bf368.setAttribute("marker-end", "url(#arrowhead)");
    _0x1bf368.classList.add("st-chatu8-workflow-viz-connection");
    _0x8903cf.appendChild(_0x1bf368);
  });
  _0x3f42ce.forEach(_0x447c87 => {
    const _0x4d2ead = _0x5eada0[_0x447c87.id];
    if (!_0x4d2ead) {
      return;
    }
    const _0x12630f = document.createElementNS("http://www.w3.org/2000/svg", "g");
    _0x12630f.classList.add("st-chatu8-workflow-viz-node");
    _0x12630f.setAttribute("transform", "translate(" + _0x4d2ead.x + ", " + _0x4d2ead.y + ")");
    const _0x4c9708 = _0x4b849d[_0x447c87.id]._skip === true;
    if (_0x4c9708) {
      _0x12630f.classList.add("skipped");
    }
    const _0xc81cc2 = _0x4947a5(_0x447c87.classType);
    const _0x3886f5 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    _0x3886f5.setAttribute("width", _0x55d5cd);
    _0x3886f5.setAttribute("height", _0x21cebb);
    _0x3886f5.setAttribute("rx", "8");
    _0x3886f5.setAttribute("fill", _0x4c9708 ? "#1a1a2e" : "#2a2a3e");
    _0x3886f5.setAttribute("stroke", _0xc81cc2);
    _0x3886f5.setAttribute("stroke-width", "2");
    _0x3886f5.setAttribute("stroke-dasharray", _0x4c9708 ? "5,5" : "none");
    _0x12630f.appendChild(_0x3886f5);
    const _0x23e3aa = document.createElementNS("http://www.w3.org/2000/svg", "text");
    _0x23e3aa.setAttribute("x", "10");
    _0x23e3aa.setAttribute("y", "18");
    _0x23e3aa.setAttribute("fill", "#aaa");
    _0x23e3aa.setAttribute("font-size", "11");
    _0x23e3aa.textContent = "#" + _0x447c87.id;
    _0x12630f.appendChild(_0x23e3aa);
    const _0x1d7a63 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    _0x1d7a63.setAttribute("x", "10");
    _0x1d7a63.setAttribute("y", "38");
    _0x1d7a63.setAttribute("fill", _0xc81cc2);
    _0x1d7a63.setAttribute("font-size", "13");
    _0x1d7a63.setAttribute("font-weight", "bold");
    const _0x417fab = _0x447c87.meta.title || _0x447c87.classType;
    _0x1d7a63.textContent = _0x417fab.length > 20 ? _0x417fab.substring(0, 18) + "..." : _0x417fab;
    _0x12630f.appendChild(_0x1d7a63);
    const _0x39e63a = Object.keys(_0x447c87.inputs).length;
    const _0x3b7705 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    _0x3b7705.setAttribute("x", "10");
    _0x3b7705.setAttribute("y", "54");
    _0x3b7705.setAttribute("fill", "#777");
    _0x3b7705.setAttribute("font-size", "10");
    _0x3b7705.textContent = "输入: " + _0x39e63a;
    _0x12630f.appendChild(_0x3b7705);
    const _0x5dfcb1 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    const _0x525b9c = Object.entries(_0x447c87.inputs).map(([_0x3c76a5, _0x2950e1]) => "  " + _0x3c76a5 + ": " + (Array.isArray(_0x2950e1) ? "[" + _0x2950e1[0] + ":" + _0x2950e1[1] + "]" : JSON.stringify(_0x2950e1).substring(0, 30))).join("\n");
    _0x5dfcb1.textContent = "节点 #" + _0x447c87.id + "\n类型: " + _0x447c87.classType + "\n标题: " + (_0x447c87.meta.title || "无") + "\n\n输入:\n" + (_0x525b9c || "  无");
    _0x12630f.appendChild(_0x5dfcb1);
    _0x12630f.setAttribute("data-node-id", _0x447c87.id);
    _0x12630f.onclick = _0x3433b4 => {
      _0x3433b4.stopPropagation();
      _0x8903cf.querySelectorAll(".st-chatu8-workflow-viz-node.selected").forEach(_0x37b4ac => {
        _0x37b4ac.classList.remove("selected");
      });
      _0x12630f.classList.add("selected");
      _0x4716d2 = _0x447c87.id;
      renderNodeProperties(_0x35568d, _0x447c87, _0x4b849d, _0x3a04d1, _0x1d32d8, () => {
        _0x551513 = true;
      }, (_0x181008, _0x3e0d32) => {
        const _0x50e421 = _0x8903cf.querySelector("[data-node-id=\"" + _0x181008 + "\"]");
        if (_0x50e421) {
          if (_0x3e0d32) {
            _0x50e421.classList.add("skipped");
            const _0x406c3d = _0x50e421.querySelector("rect");
            if (_0x406c3d) {
              _0x406c3d.setAttribute("fill", "#1a1a2e");
              _0x406c3d.setAttribute("stroke-dasharray", "5,5");
            }
          } else {
            _0x50e421.classList.remove("skipped");
            const _0x93143 = _0x50e421.querySelector("rect");
            if (_0x93143) {
              _0x93143.setAttribute("fill", "#2a2a3e");
              _0x93143.setAttribute("stroke-dasharray", "none");
            }
          }
        }
        _0x551513 = true;
      });
      _0x34ab2d();
      _0x4af702(true);
    };
    _0x8903cf.appendChild(_0x12630f);
  });
  let _0x2c79b6 = 1;
  const _0x49fc58 = _0x3f52d6;
  const _0x490c17 = _0x5bb9e1;
  const _0x264df1 = () => {
    _0x8903cf.style.transform = "scale(" + _0x2c79b6 + ")";
    _0x8903cf.style.transformOrigin = "top left";
    _0x18914c.style.width = _0x49fc58 * _0x2c79b6 + "px";
    _0x18914c.style.height = _0x490c17 * _0x2c79b6 + "px";
  };
  _0x18914c.style.width = _0x49fc58 + "px";
  _0x18914c.style.height = _0x490c17 + "px";
  _0x1ff664.querySelector("#viz-zoom-in").onclick = () => {
    _0x2c79b6 = Math.min(_0x2c79b6 + 0.2, 3);
    _0x264df1();
  };
  _0x1ff664.querySelector("#viz-zoom-out").onclick = () => {
    _0x2c79b6 = Math.max(_0x2c79b6 - 0.2, 0.3);
    _0x264df1();
  };
  _0x1ff664.querySelector("#viz-zoom-reset").onclick = () => {
    _0x2c79b6 = 1;
    _0x264df1();
    _0x3ec99e.scrollTop = 0;
    _0x3ec99e.scrollLeft = 0;
  };
  let _0x4c6316 = false;
  let _0x2388dc = 0;
  let _0x4875d0 = 0;
  let _0x483c18 = 0;
  let _0x4a58b8 = 0;
  _0x3ec99e.addEventListener("mousedown", _0x11329d => {
    const _0x47eb8a = _0x11329d.target.closest(".st-chatu8-workflow-viz-node");
    if (!_0x47eb8a) {
      _0x4c6316 = true;
      _0x2388dc = _0x11329d.clientX;
      _0x4875d0 = _0x11329d.clientY;
      _0x483c18 = _0x3ec99e.scrollLeft;
      _0x4a58b8 = _0x3ec99e.scrollTop;
      _0x3ec99e.style.cursor = "grabbing";
      _0x11329d.preventDefault();
    }
  });
  _0x3ec99e.addEventListener("mousemove", _0x436f66 => {
    if (!_0x4c6316) {
      return;
    }
    const _0xbceb9e = _0x436f66.clientX - _0x2388dc;
    const _0x1eda33 = _0x436f66.clientY - _0x4875d0;
    _0x3ec99e.scrollLeft = _0x483c18 - _0xbceb9e;
    _0x3ec99e.scrollTop = _0x4a58b8 - _0x1eda33;
  });
  _0x3ec99e.addEventListener("mouseup", () => {
    if (_0x4c6316) {
      _0x4c6316 = false;
      _0x3ec99e.style.cursor = "grab";
    }
  });
  _0x3ec99e.addEventListener("mouseleave", () => {
    if (_0x4c6316) {
      _0x4c6316 = false;
      _0x3ec99e.style.cursor = "grab";
    }
  });
  let _0x4cc8c4 = 0;
  let _0x1821d3 = 0;
  let _0x4365d4 = 0;
  let _0x5b5cb0 = 0;
  _0x3ec99e.addEventListener("touchstart", _0x21412f => {
    if (_0x21412f.touches.length === 1) {
      const _0x4f3e8c = _0x21412f.touches[0];
      _0x4cc8c4 = _0x4f3e8c.clientX;
      _0x1821d3 = _0x4f3e8c.clientY;
      _0x4365d4 = _0x3ec99e.scrollLeft;
      _0x5b5cb0 = _0x3ec99e.scrollTop;
    }
  }, {
    passive: true
  });
  _0x3ec99e.addEventListener("touchmove", _0x38a5d3 => {
    if (_0x38a5d3.touches.length === 1) {
      const _0x1e26a5 = _0x38a5d3.touches[0];
      const _0x174b45 = _0x1e26a5.clientX - _0x4cc8c4;
      const _0xb49d84 = _0x1e26a5.clientY - _0x1821d3;
      _0x3ec99e.scrollLeft = _0x4365d4 - _0x174b45;
      _0x3ec99e.scrollTop = _0x5b5cb0 - _0xb49d84;
    }
  }, {
    passive: true
  });
  _0x1ff664.querySelector("#viz-save-workflow").onclick = async () => {
    try {
      const _0x4e1328 = Object.values(_0x4b849d).filter(_0xb0dc32 => _0xb0dc32._skip).length;
      const _0x3c4e6c = JSON.stringify(_0x4b849d, null, 2);
      _0x2abdf1.value = _0x3c4e6c;
      $(_0x2abdf1).trigger("input");
      const _0xbdcfc2 = _0x31f33c.workerid;
      if (!_0xbdcfc2 || ["默认", "默认人物一致", "面部细化"].includes(_0xbdcfc2)) {
        const _0x1a77b0 = await stylInput("默认工作流不能被修改，请输入新的配置名称：");
        if (_0x1a77b0 && _0x1a77b0.trim()) {
          const _0x2fa09f = _0x1a77b0.trim();
          const _0x43dbe9 = document.getElementById("workerid");
          if (!_0x31f33c.workers.hasOwnProperty(_0x2fa09f)) {
            const _0x343ff7 = new Option(_0x2fa09f, _0x2fa09f);
            _0x343ff7.title = _0x2fa09f;
            _0x43dbe9.add(_0x343ff7);
          }
          _0x43dbe9.value = _0x2fa09f;
          _0x31f33c.workerid = _0x2fa09f;
          _0x31f33c.workers[_0x2fa09f] = _0x3c4e6c;
          _0x31f33c.worker = _0x3c4e6c;
          saveSettingsDebounced();
          _0x551513 = false;
          if (_0x4e1328 > 0) {
            toastr.success("工作流已保存为 \"" + _0x2fa09f + "\"（含 " + _0x4e1328 + " 个跳过节点，执行时生效）");
          } else {
            toastr.success("工作流已保存为 \"" + _0x2fa09f + "\"");
          }
        }
      } else {
        _0x31f33c.workers[_0xbdcfc2] = _0x3c4e6c;
        _0x31f33c.worker = _0x3c4e6c;
        saveSettingsDebounced();
        _0x551513 = false;
        if (_0x4e1328 > 0) {
          toastr.success("工作流 \"" + _0xbdcfc2 + "\" 已保存（含 " + _0x4e1328 + " 个跳过节点，执行时生效）");
        } else {
          toastr.success("工作流 \"" + _0xbdcfc2 + "\" 已保存");
        }
      }
    } catch (_0x10d26b) {
      alert("保存失败: " + _0x10d26b.message);
    }
  };
}
function editWorker_change() {
  const _0x3779c2 = extension_settings[extensionName];
  const _0x2efad0 = document.getElementById("editWorker");
  const _0x12ed29 = document.getElementById("editWorkerid");
  _0x3779c2.editWorkerid = _0x12ed29.value;
  _0x3779c2.editWorker = _0x3779c2.workers[_0x3779c2.editWorkerid];
  saveSettingsDebounced();
  _0x2efad0.value = _0x3779c2.workers[_0x3779c2.editWorkerid];
  $(_0x2efad0).trigger("input");
}
function editWorker_save() {
  const _0x3408fa = extension_settings[extensionName];
  stylInput("请输入配置名称").then(_0x107aa1 => {
    if (_0x107aa1) {
      const _0x50b6ad = document.getElementById("editWorker");
      const _0x2b5c7f = document.getElementById("editWorkerid");
      const _0x1f086f = document.getElementById("workerid");
      let _0x5eb2e7 = new Option(_0x107aa1, _0x107aa1);
      _0x5eb2e7.title = _0x107aa1;
      if (!_0x3408fa.workers.hasOwnProperty(_0x107aa1)) {
        _0x2b5c7f.add(_0x5eb2e7);
        if (_0x1f086f) {
          let _0x11e2ba = new Option(_0x107aa1, _0x107aa1);
          _0x11e2ba.title = _0x107aa1;
          _0x1f086f.add(_0x11e2ba);
        }
      }
      _0x2b5c7f.value = _0x107aa1;
      _0x3408fa.editWorkerid = _0x107aa1;
      _0x3408fa.workers[_0x107aa1] = _0x50b6ad.value;
      _0x3408fa.editWorker = _0x50b6ad.value;
      saveSettingsDebounced();
    }
  });
}
function editWorker_delete() {
  const _0x3bca72 = extension_settings[extensionName];
  stylishConfirm("是否确定删除").then(_0x120e04 => {
    if (_0x120e04) {
      const _0x1b72a9 = document.getElementById("editWorker");
      const _0x17136b = document.getElementById("editWorkerid");
      const _0xb506d0 = document.getElementById("workerid");
      const _0x5a223e = _0x17136b.value;
      if (_0x5a223e === "默认" || _0x5a223e === "默认人物一致" || _0x5a223e === "面部细化" || _0x5a223e === "新版默认" || _0x5a223e === "默认-独立VAE" || _0x5a223e === "新weilin-vae") {
        alert("默认配置不能删除");
        return;
      }
      if (_0x3bca72.workerid === _0x5a223e) {
        if (!confirm("主工作流也在使用 \"" + _0x5a223e + "\"，删除后将重置为默认工作流。是否继续？")) {
          return;
        }
        _0x3bca72.workerid = "新版默认";
        _0x3bca72.worker = _0x3bca72.workers.新版默认;
        if (_0xb506d0) {
          _0xb506d0.value = "新版默认";
          const _0xcb4e07 = document.getElementById("worker");
          if (_0xcb4e07) {
            _0xcb4e07.value = _0x3bca72.workers.新版默认;
          }
        }
      }
      Reflect.deleteProperty(_0x3bca72.workers, _0x5a223e);
      _0x17136b.remove(_0x17136b.selectedIndex);
      if (_0xb506d0) {
        for (let _0x45c455 = 0; _0x45c455 < _0xb506d0.options.length; _0x45c455++) {
          if (_0xb506d0.options[_0x45c455].value === _0x5a223e) {
            _0xb506d0.remove(_0x45c455);
            break;
          }
        }
      }
      _0x17136b.value = "新版默认";
      _0x3bca72.editWorkerid = "新版默认";
      _0x3bca72.editWorker = _0x3bca72.workers[_0x3bca72.editWorkerid];
      _0x1b72a9.value = _0x3bca72.workers[_0x3bca72.editWorkerid];
      saveSettingsDebounced();
    }
  });
}
function editWorker_update() {
  const _0x40d3bb = extension_settings[extensionName];
  const _0x11398e = _0x40d3bb.editWorkerid;
  if (!_0x11398e || !_0x40d3bb.workers[_0x11398e]) {
    alert("没有活动的工作流可保存。请先\"另存为\"一个新工作流。");
    return;
  }
  if (["默认", "默认人物一致", "面部细化", "新版默认", "默认-独立VAE", "新weilin-vae"].includes(_0x11398e)) {
    alert("默认工作流 \"" + _0x11398e + "\" 不能被修改。请使用\"另存为\"创建一个副本。");
    return;
  }
  stylishConfirm("确定要覆盖当前工作流 \"" + _0x11398e + "\" 吗？").then(_0x8e408e => {
    if (_0x8e408e) {
      const _0x1214cc = document.getElementById("editWorker").value;
      _0x40d3bb.workers[_0x11398e] = _0x1214cc;
      if (_0x40d3bb.editWorkerid === _0x11398e) {
        _0x40d3bb.editWorker = _0x1214cc;
      }
      if (_0x40d3bb.workerid === _0x11398e) {
        _0x40d3bb.worker = _0x1214cc;
        const _0x505990 = document.getElementById("worker");
        if (_0x505990) {
          _0x505990.value = _0x1214cc;
        }
      }
      saveSettingsDebounced();
    }
  });
}
function editWorker_export_current() {
  const _0x56c168 = extension_settings[extensionName];
  const _0x49b2c9 = _0x56c168.editWorkerid;
  if (!_0x49b2c9 || !_0x56c168.workers[_0x49b2c9]) {
    alert("没有选中的工作流可导出。");
    return;
  }
  const _0x57aaa1 = {
    [_0x49b2c9]: _0x56c168.workers[_0x49b2c9]
  };
  const _0xcbe91 = _0x57aaa1;
  const _0xe205e1 = JSON.stringify(_0xcbe91, null, 2);
  const _0x1e3405 = new Blob([_0xe205e1], {
    type: "application/json"
  });
  const _0x25956e = URL.createObjectURL(_0x1e3405);
  const _0x23bdad = document.createElement("a");
  _0x23bdad.href = _0x25956e;
  _0x23bdad.download = "st-chatu8-edit-workflow-" + _0x49b2c9 + ".json";
  document.body.appendChild(_0x23bdad);
  _0x23bdad.click();
  document.body.removeChild(_0x23bdad);
  URL.revokeObjectURL(_0x25956e);
}
function editWorker_export_all() {
  worker_export_all();
}
async function editWorker_import() {
  const _0xb57a0c = extension_settings[extensionName];
  const _0x34afa4 = document.createElement("input");
  _0x34afa4.type = "file";
  _0x34afa4.accept = ".json";
  _0x34afa4.onchange = async _0x2bf186 => {
    const _0x1b7c19 = _0x2bf186.target.files[0];
    if (!_0x1b7c19) {
      return;
    }
    const _0x2eba09 = new FileReader();
    _0x2eba09.onload = async _0x4ca9ca => {
      try {
        const _0x498ae0 = JSON.parse(_0x4ca9ca.target.result);
        if (isComfyUIFullWorkflow(_0x498ae0)) {
          alert("检测到ComfyUI完整工作流格式（包含UI信息）。\n\n请在ComfyUI中打开此工作流，然后使用 \"Save (API Format)\" 导出为API格式后再导入。\n\n提示：在ComfyUI界面中右键点击空白处，选择 \"Save (API Format)\" 即可导出API格式的工作流。");
          return;
        }
        if (isRawComfyUIWorkflow(_0x498ae0)) {
          const _0x5bf0b4 = _0x1b7c19.name.replace(/\.json$/i, "") || "导入的修图工作流";
          const _0x13ed05 = await stylInput("检测到原始ComfyUI API工作流，请为其命名：", _0x5bf0b4);
          if (_0x13ed05 && _0x13ed05.trim()) {
            const _0x16a4c5 = _0x13ed05.trim();
            const _0x4f2034 = JSON.stringify(_0x498ae0, null, 2);
            const _0x1fd9cd = !_0xb57a0c.workers.hasOwnProperty(_0x16a4c5);
            _0xb57a0c.workers[_0x16a4c5] = _0x4f2034;
            const _0x960311 = document.getElementById("editWorkerid");
            const _0x2f85b7 = document.getElementById("workerid");
            if (_0x960311 && _0x1fd9cd) {
              const _0x27bf56 = new Option(_0x16a4c5, _0x16a4c5);
              _0x27bf56.title = _0x16a4c5;
              _0x960311.add(_0x27bf56);
              if (_0x2f85b7) {
                const _0x5c3b97 = new Option(_0x16a4c5, _0x16a4c5);
                _0x5c3b97.title = _0x16a4c5;
                _0x2f85b7.add(_0x5c3b97);
              }
            }
            _0x960311.value = _0x16a4c5;
            _0xb57a0c.editWorkerid = _0x16a4c5;
            _0xb57a0c.editWorker = _0x4f2034;
            const _0x14f294 = document.getElementById("editWorker");
            if (_0x14f294) {
              _0x14f294.value = _0x4f2034;
            }
            saveSettingsDebounced();
            alert("成功导入原始ComfyUI工作流，已保存为: \"" + _0x16a4c5 + "\"");
          } else {
            alert("导入已取消。");
          }
        } else {
          let _0x11230a = 0;
          const _0x9e9ca3 = document.getElementById("editWorkerid");
          const _0x3b43de = document.getElementById("workerid");
          for (const _0xd628d2 in _0x498ae0) {
            if (_0x498ae0.hasOwnProperty(_0xd628d2)) {
              const _0x467a52 = typeof _0x498ae0[_0xd628d2] === "string" ? _0x498ae0[_0xd628d2] : JSON.stringify(_0x498ae0[_0xd628d2], null, 2);
              const _0x276c9c = !_0xb57a0c.workers.hasOwnProperty(_0xd628d2);
              if (_0x276c9c) {
                _0x11230a++;
                if (_0x9e9ca3) {
                  const _0xecb7b7 = new Option(_0xd628d2, _0xd628d2);
                  _0xecb7b7.title = _0xd628d2;
                  _0x9e9ca3.add(_0xecb7b7);
                }
                if (_0x3b43de) {
                  const _0x1deaac = new Option(_0xd628d2, _0xd628d2);
                  _0x1deaac.title = _0xd628d2;
                  _0x3b43de.add(_0x1deaac);
                }
              }
              _0xb57a0c.workers[_0xd628d2] = _0x467a52;
            }
          }
          saveSettingsDebounced();
          alert("成功导入 " + Object.keys(_0x498ae0).length + " 个工作流，其中 " + _0x11230a + " 个是全新的。");
        }
      } catch (_0x5d0918) {
        alert("导入失败，请确保文件是正确的JSON格式。");
        console.error("Error importing workflows:", _0x5d0918);
      }
    };
    _0x2eba09.readAsText(_0x1b7c19);
  };
  _0x34afa4.click();
}
export function initWorkerControls(_0x220fb9) {
  _0x220fb9.find("#eidtwork").on("click", eidtwork);
  _0x220fb9.find("#visualize_workflow").on("click", visualizeWorkflow);
  _0x220fb9.find("#workerid").on("change", worker_change);
  _0x220fb9.find("#worker_update_style").on("click", worker_update);
  _0x220fb9.find("#worker_save_style").on("click", worker_save);
  _0x220fb9.find("#worker_delete_style").on("click", worker_delete);
  _0x220fb9.find("#worker_export_current").on("click", worker_export_current);
  _0x220fb9.find("#worker_export_all").on("click", worker_export_all);
  _0x220fb9.find("#worker_import").on("click", worker_import);
  _0x220fb9.find("#editWorkerid").on("change", editWorker_change);
  _0x220fb9.find("#edit_worker_save_style").on("click", editWorker_save);
  _0x220fb9.find("#edit_worker_delete_style").on("click", editWorker_delete);
  _0x220fb9.find("#edit_worker_update_style").on("click", editWorker_update);
  _0x220fb9.find("#edit_worker_export_current").on("click", editWorker_export_current);
  _0x220fb9.find("#edit_worker_export_all").on("click", editWorker_export_all);
  _0x220fb9.find("#edit_worker_import").on("click", editWorker_import);
  _0x220fb9.find("#eidtEditWork").on("click", () => {
    const _0x4d3757 = document.getElementById("editWorker");
    try {
      let _0x1591a1 = JSON.parse(_0x4d3757.value.trim());
      _0x1591a1 = eidtJSON(_0x1591a1);
      _0x4d3757.value = JSON.stringify(_0x1591a1, null, 2);
    } catch (_0x13a702) {
      alert("请输入正确的json: " + _0x13a702);
    }
  });
  _0x220fb9.find("#visualize_edit_workflow").on("click", () => {
    const _0x3ef8e0 = extension_settings[extensionName];
    const _0x277cb8 = _0x3ef8e0.worker;
    const _0xb96891 = _0x3ef8e0.workerid;
    _0x3ef8e0.worker = _0x3ef8e0.editWorker;
    _0x3ef8e0.workerid = _0x3ef8e0.editWorkerid;
    visualizeWorkflow();
    setTimeout(() => {
      _0x3ef8e0.worker = _0x277cb8;
      _0x3ef8e0.workerid = _0xb96891;
    }, 100);
  });
}