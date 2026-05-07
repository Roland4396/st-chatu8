import { extension_settings } from "../../../../extensions.js";
import { eventSource } from "../../../../../script.js";
import { extensionName, EventType } from "./config.js";
import { sleep, generateRandomSeed, zhengmian, fumian, getRequestHeaders, prompt_replace, addLog, clearLog, parsePromptStringWithCoordinates, prompt_replace_for_character, stripChineseAnnotations, convertImageToJpeg } from "./utils.js";
import { initializeImageProcessing } from "./iframe.js";
import { processCharacterPrompt } from "./characterprompt.js";
import { setItemImg } from "./database.js";
import { getConfigImage } from "./configDatabase.js";
import { taskQueue, TaskType, TaskStatus } from "./taskQueue.js";
function getDirectHeaders(_0x1adb60 = null, _0x1eb881 = null) {
  const _0x2d6788 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "*/*"
  };
  if (_0x1adb60) {
    _0x2d6788["Content-Type"] = _0x1adb60;
  }
  if (_0x1eb881) {
    _0x2d6788.Authorization = _0x1eb881;
  }
  return _0x2d6788;
}
let currentTaskId = null;
let currentRequestId = null;
let currentPrompt = null;
async function getImageFromTurnData(_0x509ec1) {
  if (!_0x509ec1) {
    return "";
  }
  if (_0x509ec1.imageId && _0x509ec1.imageId.startsWith("cfgimg_")) {
    const _0x15a35f = await getConfigImage(_0x509ec1.imageId);
    return _0x15a35f || "";
  }
  if (_0x509ec1.image && _0x509ec1.image.startsWith("data:image")) {
    return _0x509ec1.image;
  }
  return "";
}
async function generateBananaImage({
  prompt: _0x502a5c,
  width: _0x1462cc,
  height: _0xa86918,
  change: _0x139ab5,
  retouchPrompt: _0x3c4b6c,
  retouchImage: _0x10a7eb,
  videoPrompt: _0x429a7a,
  videoImage: _0x14e57c
}) {
  clearLog();
  const _0x2199d1 = taskQueue.addTask({
    name: (_0x502a5c || "").substring(0, 30) + (_0x502a5c && _0x502a5c.length > 30 ? "..." : ""),
    type: TaskType.BANANA,
    prompt: _0x502a5c
  });
  currentTaskId = _0x2199d1;
  if (_0x139ab5 && _0x139ab5.includes("{视频}")) {
    addLog("[Banana] 视频模式：跳过图片提示词处理，直接构建视频请求");
    const _0x4cfdb0 = extension_settings[extensionName].banana;
    const {
      videoModel: _0x319f02,
      model: _0x1be1d6,
      apiUrl: _0x3e12f6,
      apiKey: _0x1b9349,
      conversationPresets: _0x3f89b8,
      videoPresetId: _0x2126ec,
      aspectRatio: _0x1e2c9e
    } = _0x4cfdb0;
    const _0x1e867b = _0x319f02 || _0x1be1d6;
    addLog("[Banana] 视频模式使用模型: " + _0x1e867b);
    const _0x5dcf57 = _0x2126ec || "默认";
    const _0x3e42a3 = _0x3f89b8[_0x5dcf57] || {
      conversation: [],
      fixedPrompt: ""
    };
    addLog("[Banana] 使用视频预设: \"" + _0x5dcf57 + "\"");
    const _0x30c6da = {
      role: "user",
      content: []
    };
    const _0x298869 = {
      role: "assistant",
      content: []
    };
    const _0x578374 = _0x3e42a3.conversation.map(_0x3ed7ef => [_0x30c6da, _0x298869]).flat();
    let _0x2fcf2c = 0;
    for (const _0x47e64a of _0x3e42a3.conversation) {
      if (_0x47e64a.user?.text) {
        _0x578374[_0x2fcf2c].content.push({
          type: "text",
          text: _0x47e64a.user.text
        });
      }
      const _0x22b3e2 = await getImageFromTurnData(_0x47e64a.user);
      if (_0x22b3e2) {
        _0x578374[_0x2fcf2c].content.push({
          type: "image_url",
          image_url: {
            url: _0x22b3e2
          }
        });
      }
      _0x2fcf2c++;
      if (_0x47e64a.model?.text) {
        _0x578374[_0x2fcf2c].content.push({
          type: "text",
          text: _0x47e64a.model.text
        });
      }
      const _0xc11f98 = await getImageFromTurnData(_0x47e64a.model);
      if (_0xc11f98) {
        _0x578374[_0x2fcf2c].content.push({
          type: "image_url",
          image_url: {
            url: _0xc11f98
          }
        });
      }
      _0x2fcf2c++;
    }
    const _0x4012ad = [];
    const _0x185d50 = _0x429a7a || "";
    const _0x272016 = [_0x3e42a3.fixedPrompt, _0x185d50, _0x3e42a3.postfixPrompt].filter(Boolean).join(", ");
    const _0x51ae4d = {
      type: "text",
      text: _0x272016
    };
    _0x4012ad.push(_0x51ae4d);
    if (_0x14e57c) {
      const _0x5825ea = {
        url: _0x14e57c
      };
      const _0x14ee82 = {
        type: "image_url",
        image_url: _0x5825ea
      };
      _0x4012ad.push(_0x14ee82);
      addLog("[Banana] 视频模式：已添加参考图片");
    }
    const _0x3016a6 = {
      role: "user",
      content: _0x4012ad
    };
    _0x578374.push(_0x3016a6);
    addLog("[Banana] 视频模式：指令 = " + _0x272016);
    const _0x47cc2a = {
      aspectRatio: _0x1e2c9e
    };
    const _0x52feb3 = {
      imageConfig: _0x47cc2a
    };
    const _0x4acf61 = {
      model: _0x1e867b,
      messages: _0x578374.filter(_0xe1c4e5 => _0xe1c4e5.content.length > 0),
      config: _0x52feb3
    };
    addLog("[Banana] 视频模式 payload 包含 " + _0x4acf61.messages.length + " 条消息");
    const _0x21dffd = "/v1/chat/completions";
    let _0x493e6a = _0x3e12f6.replace(/\/$/, "");
    let _0x977dac;
    if (_0x493e6a.endsWith("/v1") || _0x493e6a.includes("/v1/")) {
      _0x977dac = _0x493e6a + _0x21dffd;
    } else {
      _0x977dac = _0x493e6a + "/v1" + _0x21dffd;
    }
    _0x977dac = _0x977dac.replace(/\/v1\/v1\//g, "/v1/");
    const _0x5172a7 = extension_settings[extensionName].client;
    let _0x3da224;
    let _0x348872;
    let _0x2880ae;
    if (_0x5172a7 === "jiuguan") {
      let _0x980468 = _0x493e6a;
      if (!_0x980468.endsWith("/v1") && !_0x980468.includes("/v1/")) {
        _0x980468 = _0x980468 + "/v1";
      }
      _0x980468 = _0x980468.replace(/\/v1\/$/, "/v1");
      _0x3da224 = "/api/backends/chat-completions/generate";
      _0x348872 = getRequestHeaders(window.token);
      const _0x4177f7 = {
        chat_completion_source: "custom",
        custom_url: _0x980468,
        custom_include_headers: "Authorization: \"Bearer " + _0x1b9349 + "\"",
        model: _0x1e867b,
        messages: _0x4acf61.messages,
        stream: false
      };
      _0x2880ae = _0x4177f7;
    } else {
      _0x3da224 = _0x977dac;
      _0x348872 = getDirectHeaders("application/json", "Bearer " + _0x1b9349);
      _0x2880ae = _0x4acf61;
    }
    addLog("[Banana] 视频模式发送请求到: " + _0x3da224);
    addLog("[Banana] 视频 Payload: " + JSON.stringify(_0x2880ae, null, 2));
    try {
      taskQueue.updateStatus(_0x2199d1, "running");
      const _0x5e776e = await fetch(_0x3da224, {
        method: "POST",
        headers: _0x348872,
        body: JSON.stringify(_0x2880ae)
      });
      if (!_0x5e776e.ok) {
        const _0x104a9f = await _0x5e776e.text();
        throw new Error("API request failed with status " + _0x5e776e.status + ": " + _0x104a9f);
      }
      const _0x460072 = await _0x5e776e.json();
      const _0x26324d = _0x460072.choices?.[0]?.message?.content;
      if (typeof _0x26324d === "string") {
        const _0x29c91a = _0x26324d.match(/src="([^"]+\.mp4[^"]*)"/);
        if (_0x29c91a && _0x29c91a[1]) {
          const _0x3efd14 = _0x29c91a[1];
          addLog("[Banana] Video URL extracted: " + _0x3efd14);
          try {
            const _0x3f40d6 = await fetch(_0x3efd14, {
              headers: getDirectHeaders()
            });
            if (!_0x3f40d6.ok) {
              throw new Error("Failed to fetch video: " + _0x3f40d6.status);
            }
            const _0x35460c = await _0x3f40d6.blob();
            const _0x1e9ae9 = await new Promise((_0xed459b, _0x20be40) => {
              const _0x204b6a = new FileReader();
              _0x204b6a.onloadend = () => _0xed459b(_0x204b6a.result);
              _0x204b6a.onerror = _0x20be40;
              _0x204b6a.readAsDataURL(_0x35460c);
            });
            addLog("[Banana] Video downloaded (" + (_0x35460c.size / 1024 / 1024).toFixed(2) + " MB)");
            taskQueue.completeTask(_0x2199d1, true);
            currentTaskId = null;
            const _0x4e14ea = _0x139ab5.replaceAll("{视频}", "");
            return {
              image: _0x1e9ae9,
              change: _0x4e14ea || _0x502a5c,
              isVideo: true,
              format: "video/mp4",
              originalUrl: _0x3efd14
            };
          } catch (_0x40ded7) {
            addLog("[Banana] Failed to download video: " + _0x40ded7.message);
            throw new Error("视频下载失败: " + _0x40ded7.message);
          }
        }
      }
      throw new Error("Video response did not contain a valid MP4 URL");
    } catch (_0x4c4c0d) {
      addLog("[Banana] 视频模式错误: " + _0x4c4c0d.message);
      if (_0x4c4c0d.message === "任务已取消") {} else {
        taskQueue.completeTask(_0x2199d1, false);
      }
      currentTaskId = null;
      throw _0x4c4c0d;
    }
  }
  _0x502a5c = processCharacterPrompt(_0x502a5c);
  _0x502a5c = await stripChineseAnnotations(_0x502a5c);
  let _0x58bb45 = _0x139ab5;
  _0x139ab5 = processCharacterPrompt(_0x139ab5);
  _0x139ab5 = await stripChineseAnnotations(_0x139ab5);
  addLog("开始 Banana生图流程。客户端为" + extension_settings[extensionName].client);
  addLog("请求尺寸: 宽度 - " + (_0x1462cc || "默认") + ", 高度 - " + (_0xa86918 || "默认"));
  _0x502a5c = _0x139ab5 && _0x139ab5.trim() !== "" ? _0x139ab5 : _0x502a5c;
  addLog("用于生成的Tag: " + _0x502a5c);
  let _0x42b8e2 = false;
  if (_0x502a5c.includes("Scene Composition")) {
    _0x42b8e2 = true;
  }
  addLog("是否启用分角色模式 (Divide_roles): " + _0x42b8e2);
  let _0x5b07b5 = {};
  let _0x24aa23 = "";
  let _0x3fbd77 = "";
  if (_0x42b8e2) {
    addLog("分角色模式: 解析带坐标的提示词字符串。");
    _0x5b07b5 = parsePromptStringWithCoordinates(_0x502a5c);
    _0x24aa23 = _0x5b07b5["Scene Composition"];
    for (let _0x470da0 = 1; _0x470da0 <= 4; _0x470da0++) {
      if (_0x5b07b5["Character " + _0x470da0 + " Prompt"]) {
        _0x3fbd77 = _0x3fbd77 + ", " + _0x5b07b5["Character " + _0x470da0 + " Prompt"];
      }
    }
  } else {
    addLog("标准模式: 使用请求中的 prompt。");
    _0x24aa23 = _0x502a5c;
  }
  let {
    modifiedPrompt: _0x4d50c0,
    insertions: _0xf31e42
  } = await prompt_replace(_0x24aa23, _0x3fbd77);
  if (_0x42b8e2) {
    for (let _0x1091f0 = 1; _0x1091f0 <= 4; _0x1091f0++) {
      if (_0x5b07b5["Character " + _0x1091f0 + " Prompt"]) {
        _0x4d50c0 = _0x4d50c0 + " | " + prompt_replace_for_character(_0x5b07b5["Character " + _0x1091f0 + " Prompt"]);
      }
    }
  }
  const _0x115187 = extension_settings[extensionName].banana;
  const {
    model: _0x7a0a3e,
    videoModel: _0x4bd82d,
    apiUrl: _0x2d795e,
    apiKey: _0x21bf44,
    conversationPresets: _0x7d2dc7,
    conversationPresetId: _0xa3895e,
    editPresetId: _0x12b8b9,
    videoPresetId: _0x1a3094,
    aspectRatio: _0x5be3e9
  } = _0x115187;
  addLog("[Banana] Starting image generation with model: " + _0x7a0a3e);
  let _0x456ba0;
  let _0x4b3d79;
  if (_0x7a0a3e.startsWith("imagen")) {
    _0x456ba0 = "/v1beta/models/" + _0x7a0a3e;
    const _0xe328a4 = _0x7d2dc7[_0xa3895e] || {
      fixedPrompt: ""
    };
    const _0x46cb82 = [_0xe328a4.fixedPrompt, _0xf31e42.前置前, _0xf31e42.前置后, _0x4d50c0, _0xf31e42.后置前, _0xf31e42.后置后, _0xe328a4.postfixPrompt, _0xf31e42.最后置].filter(Boolean).join(", ");
    addLog("正面提示词: " + _0x46cb82);
    const _0x57cd5f = {
      prompt: _0x46cb82
    };
    const _0x62e077 = {
      sampleCount: 1,
      aspectRatio: _0x5be3e9
    };
    const _0x43e8f1 = {
      instances: [_0x57cd5f],
      parameters: _0x62e077
    };
    _0x4b3d79 = _0x43e8f1;
    addLog("[Banana] Built Imagen payload with prompt: " + _0x46cb82);
  } else {
    _0x456ba0 = "/v1/chat/completions";
    let _0xae2f2f;
    if (_0x139ab5.includes("{修图}")) {
      addLog("[Banana] 启用了 {修图} 标识。");
      const _0x426063 = _0x12b8b9 || "默认";
      _0xae2f2f = _0x7d2dc7[_0x426063] || {
        conversation: [],
        fixedPrompt: ""
      };
      addLog("[Banana] 使用修图预设: \"" + _0x426063 + "\"");
    } else if (_0x139ab5.includes("{视频}")) {
      addLog("[Banana] 启用了 {视频} 标识。");
      const _0xc5fd6b = _0x1a3094 || "默认";
      _0xae2f2f = _0x7d2dc7[_0xc5fd6b] || {
        conversation: [],
        fixedPrompt: ""
      };
      addLog("[Banana] 使用视频预设: \"" + _0xc5fd6b + "\"");
    } else {
      _0xae2f2f = _0x7d2dc7[_0xa3895e] || {
        conversation: [],
        fixedPrompt: ""
      };
    }
    const _0x4641f2 = [_0xae2f2f.fixedPrompt, _0xf31e42.前置前, _0xf31e42.前置后, _0x4d50c0, _0xf31e42.后置前, _0xf31e42.后置后, _0xae2f2f.postfixPrompt, _0xf31e42.最后置].filter(Boolean).join(", ");
    addLog("正面提示词: " + _0x4641f2);
    const _0x20c955 = {
      role: "user",
      content: []
    };
    const _0x11b498 = {
      role: "assistant",
      content: []
    };
    const _0x4b2156 = _0xae2f2f.conversation.map(_0x3a0273 => [_0x20c955, _0x11b498]).flat();
    let _0x499724 = 0;
    for (const _0x6ee264 of _0xae2f2f.conversation) {
      if (_0x6ee264.user?.text) {
        _0x4b2156[_0x499724].content.push({
          type: "text",
          text: _0x6ee264.user.text
        });
      }
      const _0x2fb8ec = await getImageFromTurnData(_0x6ee264.user);
      if (_0x2fb8ec) {
        _0x4b2156[_0x499724].content.push({
          type: "image_url",
          image_url: {
            url: _0x2fb8ec
          }
        });
      }
      _0x499724++;
      if (_0x6ee264.model?.text) {
        _0x4b2156[_0x499724].content.push({
          type: "text",
          text: _0x6ee264.model.text
        });
      }
      const _0xac0f5b = await getImageFromTurnData(_0x6ee264.model);
      if (_0xac0f5b) {
        _0x4b2156[_0x499724].content.push({
          type: "image_url",
          image_url: {
            url: _0xac0f5b
          }
        });
      }
      _0x499724++;
    }
    if (!_0x139ab5.includes("{修图}") && !_0x139ab5.includes("{视频}")) {
      const _0x1ca41c = extension_settings[extensionName].bananaCharacterPresets || {};
      for (const _0x7f7dfe in _0x1ca41c) {
        const _0x5b16e4 = _0x1ca41c[_0x7f7dfe];
        const _0x303558 = (_0x5b16e4.triggers || "").split("|").filter(_0x49d065 => _0x49d065.trim() !== "");
        for (const _0x408416 of _0x303558) {
          if (_0x4641f2.toLowerCase().includes(_0x408416.toLowerCase())) {
            addLog("[Banana] Found matching trigger \"" + _0x408416 + "\" from preset \"" + _0x7f7dfe + "\".");
            const _0x50c033 = _0x5b16e4.conversation;
            if (_0x50c033) {
              const _0x1cc1bb = [];
              if (_0x50c033.user && _0x50c033.user.text) {
                _0x1cc1bb.push({
                  type: "text",
                  text: _0x50c033.user.text
                });
              }
              const _0x4f5389 = await getImageFromTurnData(_0x50c033.user);
              if (_0x4f5389) {
                _0x1cc1bb.push({
                  type: "image_url",
                  image_url: {
                    url: _0x4f5389
                  }
                });
              }
              if (_0x1cc1bb.length > 0) {
                const _0x2ae931 = {
                  role: "user",
                  content: _0x1cc1bb
                };
                _0x4b2156.push(_0x2ae931);
              }
              const _0x150394 = [];
              if (_0x50c033.model && _0x50c033.model.text) {
                _0x150394.push({
                  type: "text",
                  text: _0x50c033.model.text
                });
              }
              const _0x18c841 = await getImageFromTurnData(_0x50c033.model);
              if (_0x18c841) {
                _0x150394.push({
                  type: "image_url",
                  image_url: {
                    url: _0x18c841
                  }
                });
              }
              if (_0x150394.length > 0) {
                const _0x1d983a = {
                  role: "assistant",
                  content: _0x150394
                };
                _0x4b2156.push(_0x1d983a);
              }
            }
            break;
          }
        }
      }
    }
    if (!_0x139ab5.includes("{修图}") && !_0x139ab5.includes("{视频}")) {
      const _0x56809e = {
        role: "user",
        content: [{
          type: "text",
          text: _0x4641f2
        }]
      };
      _0x4b2156.push(_0x56809e);
    } else if (_0x139ab5.includes("{修图}")) {
      const _0x5afdca = [];
      const _0x317757 = _0x3c4b6c || _0x4641f2;
      const _0x82dc83 = [_0xae2f2f.fixedPrompt, _0x317757, _0xae2f2f.postfixPrompt].filter(Boolean).join(", ");
      const _0x331015 = {
        type: "text",
        text: _0x82dc83
      };
      _0x5afdca.push(_0x331015);
      if (_0x10a7eb) {
        const _0x21bdeb = {
          url: _0x10a7eb
        };
        const _0x3c538a = {
          type: "image_url",
          image_url: _0x21bdeb
        };
        _0x5afdca.push(_0x3c538a);
        addLog("[Banana] 修图模式：已添加待修改的图片");
      }
      const _0x28ca3a = {
        role: "user",
        content: _0x5afdca
      };
      _0x4b2156.push(_0x28ca3a);
      addLog("[Banana] 修图模式：指令 = " + _0x82dc83);
    } else if (_0x139ab5.includes("{视频}")) {
      const _0x5c62f3 = [];
      const _0x3a7aaf = _0x429a7a || _0x4641f2;
      const _0x1f8999 = [_0xae2f2f.fixedPrompt, _0x3a7aaf, _0xae2f2f.postfixPrompt].filter(Boolean).join(", ");
      const _0x528006 = {
        type: "text",
        text: _0x1f8999
      };
      _0x5c62f3.push(_0x528006);
      if (_0x14e57c) {
        const _0x5ebc9f = {
          url: _0x14e57c
        };
        const _0x2f919e = {
          type: "image_url",
          image_url: _0x5ebc9f
        };
        _0x5c62f3.push(_0x2f919e);
        addLog("[Banana] 视频模式：已添加参考图片");
      }
      const _0x53eaf4 = {
        role: "user",
        content: _0x5c62f3
      };
      _0x4b2156.push(_0x53eaf4);
      addLog("[Banana] 视频模式：指令 = " + _0x1f8999);
    }
    const _0x1d71eb = {
      aspectRatio: _0x5be3e9
    };
    const _0x5a96ae = {
      imageConfig: _0x1d71eb
    };
    _0x4b3d79 = {
      model: _0x139ab5.includes("{视频}") ? _0x4bd82d || _0x7a0a3e : _0x7a0a3e,
      messages: _0x4b2156.filter(_0x52de28 => _0x52de28.content.length > 0),
      config: _0x5a96ae
    };
    addLog("[Banana] Built multimodal payload with " + _0x4b3d79.messages.length + " messages.");
  }
  let _0x3b118a = _0x2d795e.replace(/\/$/, "");
  let _0x2bf739;
  if (_0x3b118a.endsWith("/v1") || _0x3b118a.includes("/v1/")) {
    _0x2bf739 = _0x3b118a + _0x456ba0;
  } else {
    _0x2bf739 = _0x3b118a + "/v1" + _0x456ba0;
  }
  _0x2bf739 = _0x2bf739.replace(/\/v1\/v1\//g, "/v1/");
  const _0x5c120e = extension_settings[extensionName].client;
  let _0x478e1f;
  let _0x1cd7ba;
  let _0x36698b;
  if (_0x5c120e === "jiuguan") {
    let _0x5173ee = _0x3b118a;
    if (!_0x5173ee.endsWith("/v1") && !_0x5173ee.includes("/v1/")) {
      _0x5173ee = _0x5173ee + "/v1";
    }
    _0x5173ee = _0x5173ee.replace(/\/v1\/$/, "/v1");
    _0x478e1f = "/api/backends/chat-completions/generate";
    _0x1cd7ba = getRequestHeaders(window.token);
    const _0x4264c1 = _0x139ab5.includes("{视频}") ? _0x4bd82d || _0x7a0a3e : _0x7a0a3e;
    const _0x89866a = {
      chat_completion_source: "custom",
      custom_url: _0x5173ee,
      custom_include_headers: "Authorization: \"Bearer " + _0x21bf44 + "\"",
      model: _0x4264c1,
      messages: _0x4b3d79.messages,
      stream: false
    };
    _0x36698b = _0x89866a;
    if (_0x4264c1.startsWith("imagen")) {
      addLog("[Banana] Imagen 模型不支持酒馆代理，切换为直接请求");
      _0x478e1f = _0x2bf739;
      const _0x1e26e3 = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + _0x21bf44
      };
      _0x1cd7ba = _0x1e26e3;
      _0x36698b = _0x4b3d79;
    }
    addLog("[Banana] 使用酒馆代理模式");
  } else {
    _0x478e1f = _0x2bf739;
    _0x1cd7ba = getDirectHeaders("application/json", "Bearer " + _0x21bf44);
    _0x36698b = _0x4b3d79;
    addLog("[Banana] 使用直接请求模式");
  }
  addLog("[Banana] Sending request to: " + _0x478e1f);
  addLog("[Banana] Payload: " + JSON.stringify(_0x36698b, null, 2));
  try {
    taskQueue.updateStatus(_0x2199d1, "running");
    const _0x30c9f0 = await fetch(_0x478e1f, {
      method: "POST",
      headers: _0x1cd7ba,
      body: JSON.stringify(_0x36698b)
    });
    if (!_0x30c9f0.ok) {
      const _0x4260dc = await _0x30c9f0.text();
      throw new Error("API request failed with status " + _0x30c9f0.status + ": " + _0x4260dc);
    }
    const _0x2cb7ac = await _0x30c9f0.json();
    if (_0x139ab5 && _0x139ab5.includes("{视频}")) {
      const _0x2d8e00 = _0x2cb7ac.choices?.[0]?.message?.content;
      if (typeof _0x2d8e00 === "string") {
        const _0x13261b = _0x2d8e00.match(/src="([^"]+\.mp4[^"]*)"/);
        if (_0x13261b && _0x13261b[1]) {
          const _0x1daf37 = _0x13261b[1];
          addLog("[Banana] Video URL extracted: " + _0x1daf37);
          try {
            const _0x1333d7 = await fetch(_0x1daf37, {
              headers: getDirectHeaders()
            });
            if (!_0x1333d7.ok) {
              throw new Error("Failed to fetch video: " + _0x1333d7.status);
            }
            const _0x3a282c = await _0x1333d7.blob();
            const _0xda21ec = await new Promise((_0x8c9a37, _0x3eb4fb) => {
              const _0x24fce4 = new FileReader();
              _0x24fce4.onloadend = () => _0x8c9a37(_0x24fce4.result);
              _0x24fce4.onerror = _0x3eb4fb;
              _0x24fce4.readAsDataURL(_0x3a282c);
            });
            addLog("[Banana] Video downloaded (" + (_0x3a282c.size / 1024 / 1024).toFixed(2) + " MB)");
            taskQueue.completeTask(_0x2199d1, true);
            currentTaskId = null;
            const _0x6dca7f = {
              image: _0xda21ec,
              change: _0x58bb45 || "",
              isVideo: true,
              format: "video/mp4",
              originalUrl: _0x1daf37
            };
            return _0x6dca7f;
          } catch (_0x2380e8) {
            addLog("[Banana] Failed to download video: " + _0x2380e8.message);
            throw new Error("视频下载失败: " + _0x2380e8.message);
          }
        }
      }
      throw new Error("Video response did not contain a valid MP4 URL");
    }
    let _0x29865d = "";
    const _0x13cbe3 = _0x2cb7ac.choices;
    if (_0x13cbe3 && _0x13cbe3.length > 0) {
      const _0xc7500a = _0x13cbe3[0].message?.content;
      if (Array.isArray(_0xc7500a)) {
        for (const _0x4c6e77 of _0xc7500a) {
          if (_0x4c6e77.type === "image_url" && _0x4c6e77.image_url) {
            _0x29865d = typeof _0x4c6e77.image_url === "string" ? _0x4c6e77.image_url : _0x4c6e77.image_url.url;
            break;
          }
        }
      } else if (typeof _0xc7500a === "string") {
        const _0xf5b4e0 = /!\[.*?\]\(((?:https?:\/\/|data:image\/[^;]+;base64,)[^\s\)]+)\)/;
        const _0xbf726b = _0xc7500a.match(_0xf5b4e0);
        if (_0xbf726b && _0xbf726b[1]) {
          const _0x44c7ff = _0xbf726b[1];
          if (_0x44c7ff.startsWith("data:image/")) {
            addLog("[Banana] Detected Markdown embedded base64 image.");
            _0x29865d = _0x44c7ff;
            addLog("[Banana] Successfully extracted base64 image from Markdown.");
          } else {
            addLog("[Banana] Detected Markdown image URL, extracting...");
            addLog("[Banana] Markdown image URL: " + _0x44c7ff);
            try {
              const _0x5e98a0 = await fetch(_0x44c7ff, {
                headers: getDirectHeaders()
              });
              if (!_0x5e98a0.ok) {
                throw new Error("Failed to fetch image: " + _0x5e98a0.status);
              }
              const _0x5a3f3e = await _0x5e98a0.blob();
              const _0x5de225 = await new Promise((_0x958a5b, _0x12dfea) => {
                const _0x167303 = new FileReader();
                _0x167303.onloadend = () => _0x958a5b(_0x167303.result);
                _0x167303.onerror = _0x12dfea;
                _0x167303.readAsDataURL(_0x5a3f3e);
              });
              _0x29865d = _0x5de225;
              if (String(extension_settings[extensionName].convertToJpegStorage) === "true") {
                _0x29865d = await convertImageToJpeg(_0x29865d);
              }
              addLog("[Banana] Successfully converted Markdown image to base64.");
            } catch (_0x5459b8) {
              addLog("[Banana] Failed to fetch Markdown image: " + _0x5459b8.message);
              _0x29865d = _0x44c7ff;
              addLog("[Banana] Using direct URL as fallback.");
            }
          }
        } else {
          addLog("[Banana] Response contains text only, no image.");
        }
      }
    }
    if (!_0x29865d) {
      throw new Error("API response did not contain image in OpenAI format");
    }
    addLog("[Banana] Image generated successfully.");
    taskQueue.completeTask(_0x2199d1, true);
    currentTaskId = null;
    return {
      image: _0x29865d,
      change: _0x58bb45 || ""
    };
  } catch (_0x523f42) {
    addLog("[Banana] Fetch error: " + _0x523f42.message);
    console.error("[Banana] Fetch error:", _0x523f42);
    if (_0x523f42.message === "任务已取消") {} else {
      taskQueue.completeTask(_0x2199d1, false);
    }
    currentTaskId = null;
    throw _0x523f42;
  }
}
export async function bananaGenerate(_0x40fa69) {
  clearLog();
  let {
    id: _0x5dc0d4,
    prompt: _0x20f944,
    width: _0x2e00ee,
    height: _0x4ceb70,
    change: _0x4f1b03,
    retouchPrompt: _0x2a2406,
    retouchImage: _0x2d2380,
    videoPrompt: _0x54e3a6,
    videoImage: _0x2fc7f2
  } = _0x40fa69;
  currentRequestId = _0x5dc0d4;
  currentPrompt = _0x20f944;
  addLog("[Banana] Received image generation request (ID: " + _0x5dc0d4 + ")");
  let _0x2cc56d = "";
  if (_0x4f1b03) {
    _0x2cc56d = _0x4f1b03.replaceAll("{修图}", "").replaceAll("{视频}", "");
  } else {
    _0x2cc56d = _0x20f944;
  }
  if (_0x4f1b03 && _0x4f1b03.includes("{修图}")) {
    addLog("Banana修图模式启动");
    if (_0x2a2406) {
      addLog("修图指令: " + _0x2a2406);
    }
    if (_0x2d2380) {
      addLog("修图图片: [已提供]");
    }
  }
  if (_0x4f1b03 && _0x4f1b03.includes("{视频}")) {
    addLog("Banana视频模式启动");
    if (_0x54e3a6) {
      addLog("视频指令: " + _0x54e3a6);
    }
    if (_0x2fc7f2) {
      addLog("视频图片: [已提供]");
    }
  }
  try {
    const {
      image: _0x28164a,
      change: _0x44119f,
      isVideo: _0x3d7f92,
      format: _0x2f6cc5,
      originalUrl: _0x138e62
    } = await generateBananaImage({
      prompt: _0x20f944,
      width: _0x2e00ee,
      height: _0x4ceb70,
      change: _0x4f1b03,
      retouchPrompt: _0x2a2406,
      retouchImage: _0x2d2380,
      videoPrompt: _0x54e3a6,
      videoImage: _0x2fc7f2
    });
    if (extension_settings[extensionName].cache != "0") {
      Promise.resolve().then(async () => {
        try {
          await setItemImg(_0x20f944, _0x28164a, {
            change: _0x2cc56d,
            isVideo: _0x3d7f92 || false,
            format: _0x2f6cc5 || "image",
            originalUrl: _0x138e62 || ""
          });
          addLog("图像已存入数据库 for prompt: " + _0x20f944);
        } catch (_0x2668c5) {
          console.error("Banana缓存写入失败:", _0x2668c5);
          addLog("Banana缓存写入失败: " + _0x2668c5.message);
        }
      });
      if (extension_settings[extensionName].banana.cishu) {
        extension_settings[extensionName].banana.cishu = extension_settings[extensionName].banana.cishu + 1;
        addLog("当前生图次数为 for prompt: " + extension_settings[extensionName].banana.cishu);
      } else {
        extension_settings[extensionName].banana.cishu = 1;
        addLog("当前生图次数为 for prompt: " + extension_settings[extensionName].banana.cishu);
      }
    } else {
      addLog("缓存设置为不存入数据库");
    }
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, {
      id: _0x5dc0d4,
      success: true,
      imageData: _0x28164a,
      prompt: _0x20f944,
      change: _0x2cc56d,
      isVideo: _0x3d7f92 || false,
      format: _0x2f6cc5 || "image",
      originalUrl: _0x138e62 || ""
    });
    eventSource.emit("generate-image-response", {
      id: _0x5dc0d4,
      success: true,
      imageData: _0x28164a,
      prompt: _0x20f944,
      change: _0x2cc56d,
      isVideo: _0x3d7f92 || false,
      format: _0x2f6cc5 || "image",
      originalUrl: _0x138e62 || ""
    });
    addLog("[Banana] Emitted success response for ID: " + _0x5dc0d4);
  } catch (_0x5f48de) {
    const _0x2f4e44 = "[Banana] Generation failed for ID " + _0x5dc0d4 + ": " + _0x5f48de.message;
    addLog(_0x2f4e44);
    console.error(_0x2f4e44);
    const _0x5c653f = {
      id: _0x5dc0d4,
      success: false,
      error: _0x5f48de.message,
      prompt: _0x20f944
    };
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, _0x5c653f);
    const _0x21f81a = {
      id: _0x5dc0d4,
      success: false,
      error: _0x5f48de.message,
      prompt: _0x20f944
    };
    eventSource.emit("generate-image-response", _0x21f81a);
    addLog("[Banana] Emitted failure response for ID: " + _0x5dc0d4);
  }
}
function handleCancelBananaTask(_0x4ae641) {
  const {
    taskId: _0x2a3f9f
  } = _0x4ae641;
  addLog("[Banana] 收到取消任务事件 (TaskID: " + _0x2a3f9f + ")");
  if (currentTaskId === _0x2a3f9f && currentRequestId) {
    addLog("[Banana] 取消当前任务，发送失败响应 (ID: " + currentRequestId + ")");
    eventSource.emit(EventType.GENERATE_IMAGE_RESPONSE, {
      id: currentRequestId,
      success: false,
      error: "任务已取消",
      prompt: currentPrompt || ""
    });
    currentTaskId = null;
    currentRequestId = null;
    currentPrompt = null;
  }
}
function initializeBananaListener() {
  eventSource.on(EventType.GENERATE_IMAGE_REQUEST, bananaGenerate);
  eventSource.on("st_chatu8_cancel_banana_task", handleCancelBananaTask);
  addLog("banana 生图事件监听器已初始化。");
}
export async function replaceWithBanana() {
  if (extension_settings[extensionName].mode == "banana") {
    if (!window.initializeBananaListener) {
      window.initializeBananaListener = true;
      initializeBananaListener();
    }
    initializeImageProcessing();
  } else if (window.initializeBananaListener) {
    eventSource.removeListener(EventType.GENERATE_IMAGE_REQUEST, bananaGenerate);
    eventSource.removeListener("st_chatu8_cancel_banana_task", handleCancelBananaTask);
    LEGACY_EVENT_NAMES.forEach(_0x27911f => {
      eventSource.removeListener(_0x27911f, bananaGenerate);
    });
    window.initializeBananaListener = false;
    addLog("[Banana] 生图事件监听器已关闭。");
  }
}