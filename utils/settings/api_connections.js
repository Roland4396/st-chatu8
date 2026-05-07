import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
import { removeTrailingSlash, getRequestHeaders, getsdAuth, addLog } from "../utils.js";
import { isValidUrl, showToast } from "../ui_common.js";
import { resetKeepAliveState } from "../comfyuiKeepAlive.js";
function populateSelect(_0x27e092, _0x4c8b21, _0x3546d2) {
  if (!_0x27e092) {
    return;
  }
  const _0x3510c6 = _0x27e092.value;
  _0x27e092.innerHTML = "";
  _0x4c8b21.forEach(_0x8ef091 => {
    const _0x16eb57 = new Option(_0x8ef091.text, _0x8ef091.value);
    _0x16eb57.title = _0x8ef091.text;
    _0x27e092.add(_0x16eb57);
  });
  if (_0x4c8b21.some(_0xf19149 => _0xf19149.value === _0x3510c6)) {
    _0x27e092.value = _0x3510c6;
  } else if (_0x3546d2 && _0x4c8b21.some(_0x59a6fe => _0x59a6fe.value === _0x3546d2)) {
    _0x27e092.value = _0x3546d2;
  } else if (_0x27e092.options.length > 0) {
    _0x27e092.selectedIndex = 0;
  }
}
async function testComfyui() {
  const _0x334e53 = extension_settings[extensionName];
  let _0x5e9df7 = document.getElementById("comfyuiUrl");
  let _0x8a2c82 = removeTrailingSlash(_0x5e9df7.value);
  let _0xcefd57 = _0x8a2c82 + "/object_info";
  if (!_0x334e53.comfyuiCache) {
    _0x334e53.comfyuiCache = {};
  }
  try {
    if (_0x334e53.client === "jiuguan") {
      const _0x2a5144 = {
        url: _0x8a2c82
      };
      const _0x330aa7 = await fetch("/api/sd/comfy/models", {
        method: "POST",
        body: JSON.stringify(_0x2a5144),
        headers: getRequestHeaders(window.token)
      });
      if (!_0x330aa7.ok) {
        const _0x33737a = await _0x330aa7.text();
        alert("返回错误可能是你输入网址有误" + _0x33737a);
        addLog("\"测试链接失败网址:" + _0x8a2c82 + " 错误详情:\"" + JSON.stringify(_0x33737a) + ",请求失败,状态码: " + _0x330aa7.status);
        throw new Error("请求失败,状态码: " + _0x330aa7.status);
      }
      const _0x2beb1f = {
        url: _0x8a2c82
      };
      const _0x48dfe9 = await fetch("/api/sd/comfy/samplers", {
        method: "POST",
        body: JSON.stringify(_0x2beb1f),
        headers: getRequestHeaders(window.token)
      });
      const _0x440c63 = {
        url: _0x8a2c82
      };
      const _0x17d7bd = await fetch("/api/sd/comfy/vaes", {
        method: "POST",
        body: JSON.stringify(_0x440c63),
        headers: getRequestHeaders(window.token)
      });
      const _0x5b210b = {
        url: _0x8a2c82
      };
      const _0x2c18a1 = await fetch("/api/sd/comfy/schedulers", {
        method: "POST",
        body: JSON.stringify(_0x5b210b),
        headers: getRequestHeaders(window.token)
      });
      if (!_0x48dfe9.ok || !_0x17d7bd.ok || !_0x2c18a1.ok) {
        throw new Error("One or more API calls failed");
      }
      alert("连接成功");
      const _0x353164 = await _0x330aa7.json();
      const _0xb849c7 = await _0x48dfe9.json();
      const _0xef66bc = await _0x17d7bd.json();
      const _0x2a67f0 = await _0x2c18a1.json();
      _0x334e53.comfyuiCache.models = _0x353164;
      _0x334e53.comfyuiCache.samplers = _0xb849c7;
      _0x334e53.comfyuiCache.vaes = _0xef66bc;
      _0x334e53.comfyuiCache.schedulers = _0x2a67f0;
      _0x334e53.comfyuiCache.loras = [];
      saveSettingsDebounced();
    } else {
      const _0x1262cc = await fetch(_0xcefd57);
      if (_0x1262cc.ok) {
        alert("连接成功");
        const _0xfc0cce = await _0x1262cc.json();
        const _0x99444b = _0xfc0cce.LoraLoader.input.required.lora_name[0];
        const _0x1e6019 = _0xfc0cce.CheckpointLoaderSimple.input.required.ckpt_name[0].map(_0x59f61d => ({
          value: _0x59f61d,
          text: _0x59f61d
        })) || [];
        const _0x4e7aa1 = _0xfc0cce.UNETLoader.input.required.unet_name[0].map(_0x190196 => ({
          value: _0x190196,
          text: "UNet: " + _0x190196
        })) || [];
        const _0x5a41ab = _0xfc0cce.UnetLoaderGGUF?.input.required.unet_name[0].map(_0x4a3ac0 => ({
          value: _0x4a3ac0,
          text: "GGUF: " + _0x4a3ac0
        })) || [];
        const _0x4773c5 = [..._0x1e6019, ..._0x4e7aa1, ..._0x5a41ab];
        const _0x3b3308 = _0xfc0cce.KSampler.input.required.sampler_name[0];
        const _0x57e297 = _0xfc0cce.KSampler.input.required.scheduler[0];
        const _0x1271d6 = _0xfc0cce.VAELoader.input.required.vae_name[0];
        const _0x521688 = _0xfc0cce.CLIPLoader.input.required.clip_name[0];
        const _0x2fcb89 = _0xfc0cce.CLIPLoaderGGUF?.input?.required?.clip_name?.[0]?.map(_0x5cc057 => "GGUF: " + _0x5cc057) || [];
        const _0x18cf23 = [..._0x521688, ..._0x2fcb89];
        _0x334e53.comfyuiCache.loras = _0x99444b;
        _0x334e53.comfyuiCache.models = _0x4773c5;
        _0x334e53.comfyuiCache.samplers = _0x3b3308;
        _0x334e53.comfyuiCache.schedulers = _0x57e297;
        _0x334e53.comfyuiCache.vaes = _0x1271d6;
        _0x334e53.comfyuiCache.CLIPs = _0x18cf23;
        _0x334e53.comfyuiCache.objectInfo = _0xfc0cce;
        saveSettingsDebounced();
      } else {
        alert("连接失败，请检查地址是否正确");
      }
    }
    window.loadSilterTavernChatu8Settings();
    resetKeepAliveState();
  } catch (_0x10c2a1) {
    alert("请求错误，请检查地址是否正确或网络连接");
    addLog("\"cpmfyui测试链接失败网址:" + _0xcefd57 + " ,请求错误，请检查地址是否正确或网络连接\"");
    console.error("连接测试失败:", _0x10c2a1);
  }
}
async function testSd() {
  const _0x21ba84 = extension_settings[extensionName];
  const _0x25e6d9 = document.getElementById("sdUrl");
  const _0x3d8330 = removeTrailingSlash(_0x25e6d9.value);
  if (!isValidUrl(_0x3d8330)) {
    alert("请输入有效的 Stable Diffusion API 地址。");
    return;
  }
  if (!_0x21ba84.sdCache) {
    _0x21ba84.sdCache = {};
  }
  if (_0x21ba84.client == "jiuguan") {
    const _0x3a8a07 = {
      samplers: "/api/sd/samplers",
      models: "/api/sd/models",
      vaes: "/api/sd/vaes",
      schedulers: "/api/sd/schedulers",
      upscalers: "/api/sd/upscalers"
    };
    try {
      const _0x311927 = {
        url: _0x3d8330,
        auth: _0x21ba84.st_chatu8_sd_auth || ""
      };
      const _0x349113 = await Promise.all(Object.values(_0x3a8a07).map(_0x3da6d4 => fetch(_0x3da6d4, {
        method: "POST",
        body: JSON.stringify(_0x311927),
        headers: getRequestHeaders(window.token)
      })));
      for (const _0x3d0a6a of _0x349113) {
        if (!_0x3d0a6a.ok) {
          throw new Error("API 请求失败: " + _0x3d0a6a.status + " " + _0x3d0a6a.statusText + " for " + _0x3d0a6a.url);
        }
      }
      const [_0x2fbafa, _0xc888bc, _0x5b6e5c, _0x533f79, _0x8af658] = await Promise.all(_0x349113.map(_0x5ab234 => _0x5ab234.json()));
      _0x21ba84.sdCache.samplers = _0x2fbafa;
      _0x21ba84.sdCache.models = _0xc888bc.map(_0x21707b => _0x21707b.value);
      _0x21ba84.sdCache.vaes = _0x5b6e5c;
      _0x21ba84.sdCache.schedulers = _0x533f79;
      _0x21ba84.sdCache.upscalers = _0x8af658;
      _0x21ba84.sdCache.loras = [];
      saveSettingsDebounced();
      alert("连接成功");
      addLog("sd测试链接成功网址:" + _0x3d8330);
    } catch (_0x47fad4) {
      alert("sd测试链接失败请检查网址或者网络连接" + _0x47fad4);
      addLog("sd测试链接失败网址:" + _0x3d8330 + " 错误详情:\"" + JSON.stringify(_0x47fad4));
    }
  } else {
    const _0x57bf76 = {
      samplers: "/sdapi/v1/samplers",
      models: "/sdapi/v1/sd-models",
      vaes: "/sdapi/v1/sd-vae",
      schedulers: "/sdapi/v1/schedulers",
      upscalers: "/sdapi/v1/upscalers",
      latentUpscalers: "/sdapi/v1/latent-upscale-modes",
      loras: "/sdapi/v1/loras"
    };
    try {
      const _0x32da69 = await Promise.allSettled(Object.values(_0x57bf76).map(_0x171814 => fetch(_0x3d8330 + _0x171814, {
        headers: {
          Authorization: getsdAuth()
        }
      })));
      const _0x324cde = _0x32da69.map(_0x5a305b => _0x5a305b.status === "fulfilled" && _0x5a305b.value.ok ? _0x5a305b.value : null);
      if (_0x324cde.every(_0x1ee724 => _0x1ee724 === null)) {
        const _0x110a26 = _0x32da69.find(_0x38c748 => _0x38c748.status === "rejected")?.reason?.message || _0x32da69.find(_0x265d3e => _0x265d3e.status === "fulfilled" && !_0x265d3e.value.ok)?.value?.statusText || "未知错误";
        throw new Error("所有API请求均失败. 第一个错误: " + _0x110a26);
      }
      const _0x481aab = _0x324cde.map(_0xcfd72e => _0xcfd72e ? _0xcfd72e.json() : Promise.resolve(null));
      const [_0x532567, _0x4d6597, _0x34ca15, _0x108d7b, _0x56c3b4, _0x31dd25, _0x490321] = await Promise.all(_0x481aab);
      let _0x48f8db = _0x56c3b4 ? _0x56c3b4.map(_0x2ed247 => _0x2ed247.name) : [];
      let _0x47dd29 = _0x31dd25 ? _0x31dd25.map(_0xf21f2e => _0xf21f2e.name) : [];
      _0x48f8db.splice(1, 0, ..._0x47dd29);
      _0x21ba84.sdCache.samplers = _0x532567 ? _0x532567.map(_0x5a7308 => _0x5a7308.name) : [];
      _0x21ba84.sdCache.models = _0x4d6597 ? _0x4d6597.map(_0x169d25 => _0x169d25.title) : [];
      _0x21ba84.sdCache.vaes = _0x34ca15 ? _0x34ca15.map(_0x434b94 => _0x434b94.model_name) : [];
      _0x21ba84.sdCache.schedulers = _0x108d7b ? _0x108d7b.map(_0x10a7dc => _0x10a7dc.name) : [];
      _0x21ba84.sdCache.upscalers = _0x48f8db;
      _0x21ba84.sdCache.loras = _0x490321 ? _0x490321.map(_0x1f7df5 => _0x1f7df5.name) : [];
      saveSettingsDebounced();
      alert("连接成功");
    } catch (_0x539e7d) {
      alert("SD连接测试失败，请检查API地址和网络连接。\n错误: " + _0x539e7d.message);
      addLog("\"测试SD链接失败网址:" + _0x3d8330 + " 错误详情:\"" + JSON.stringify(_0x539e7d));
    }
  }
  window.loadSilterTavernChatu8Settings();
}
export function initApiConnectionTests(_0x3c1595) {
  _0x3c1595.find("#testSd").on("click", testSd);
  _0x3c1595.find("#testComfyui").on("click", testComfyui);
  const _0x75991b = _0x3c1595.find("#comfyuiUrl");
  if (_0x75991b.length) {
    _0x75991b.on("change", function () {
      resetKeepAliveState();
    });
  }
}