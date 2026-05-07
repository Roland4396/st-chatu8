import { getExposedSettings, updateSettingSafely, ConfigDescriptions, getDetailedConfigKeys, getSpecificConfigData, browseConfigPath, readConfigPath, writeConfigPath, executeUIAction, getCurrentUIContext, checkRequiredConfigs, ConfigOptions, ProjectDescription, getRegexStatus, setRegexOriginalText, setRegexEditors, createRegexEntry, triggerRegexTest, setRegexTestMode, getRegexResultText, setGestureEnabled, setClickTriggerEnabled, clearAllRegexEntries, getWorkflowList, readWorkflow, scanWorkflowVariables, replaceWorkflowVariable, saveWorkflow, listWorkflowNodes, readWorkflowNode, updateWorkflowNodeInput, batchUpdateWorkflowNodes, deleteWorkflowNode, addWorkflowNode } from "./aiConfigHelper.js";
import { getModulePrompt, getAvailableModuleKeys } from "./aiPromptModules.js";
import { toggleDebug, getDebugLog, exportDebugLog } from "./debugLogger.js";
import { getRecentErrors, getErrorStats, exportErrors } from "./errorCollector.js";
import { getLog } from "./utils.js";
import { refreshAiAssistantSettings } from "./aiAssistant.js";
import { requestImageGeneration, getImageGenerationStatus } from "./aiImageGeneration.js";
export function getSettingsContextPrompt() {
  const _0xae1b34 = getExposedSettings();
  const _0x21f8f5 = ["mode", "scriptEnabled", "sdUrl", "comfyuiUrl", "current_llm_profile", "workerid", "novelaimode"];
  let _0x3277d4 = "【当前插件关键配置摘要】\n";
  for (const _0x3d25db of _0x21f8f5) {
    if (!(_0x3d25db in _0xae1b34)) {
      continue;
    }
    const _0x587656 = _0xae1b34[_0x3d25db];
    if (typeof _0x587656 === "object" || typeof _0x587656 === "function") {
      continue;
    }
    const _0x92030d = ConfigDescriptions[_0x3d25db] || "";
    const _0x24a707 = _0x92030d ? " (" + _0x92030d + ")" : "";
    _0x3277d4 += "- " + _0x3d25db + ": " + String(_0x587656) + _0x24a707 + "\n";
  }
  const _0x4a8c75 = _0xae1b34.mode || "comfyui";
  if (_0x4a8c75 === "novelai") {
    _0x3277d4 += "- novelaiApi: " + (_0xae1b34.novelaiApi ? "(已配置)" : "(未填)") + "\n";
  } else if (_0x4a8c75 === "banana") {
    const _0x103d3e = _0xae1b34.banana || {};
    _0x3277d4 += "- banana.apiUrl: " + (_0x103d3e.apiUrl || "(未填)") + "\n";
    _0x3277d4 += "- banana.apiKey: " + (_0x103d3e.apiKey ? "(已配置)" : "(未填)") + "\n";
    _0x3277d4 += "- banana.model: " + (_0x103d3e.model || "(未选择)") + "\n";
  }
  const _0xfd29c5 = _0xae1b34.current_llm_profile || "默认";
  const _0x2c6429 = _0xae1b34.llm_profiles?.[_0xfd29c5];
  if (_0x2c6429) {
    _0x3277d4 += "\n【当前LLM预设: " + _0xfd29c5 + "】\n";
    _0x3277d4 += "- api_url: " + (_0x2c6429.api_url || "(未填)") + "\n";
    _0x3277d4 += "- api_key: " + (_0x2c6429.api_key ? "(已配置)" : "(未填)") + "\n";
    _0x3277d4 += "- model: " + (_0x2c6429.model || "(未选择)") + "\n";
  }
  _0x3277d4 += "\n" + checkRequiredConfigs() + "\n";
  try {
    const _0x34f5aa = getCurrentUIContext();
    _0x3277d4 += "\n【当前UI状态】\n" + _0x34f5aa + "\n";
  } catch (_0x5859e1) {}
  _0x3277d4 += "\n提示：以上仅为关键摘要。你可以使用 browse/read/write 指令逐层浏览和修改配置，使用 ui_action 操作按钮，使用 check_config 检查配置状态。\n";
  return _0x3277d4;
}
export function removeThinkBlocks(_0x50ef37) {
  if (!_0x50ef37) {
    return "";
  }
  let _0x511355 = _0x50ef37.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^[\s\S]*?<\/think>/i, "").replace(/<think>[\s\S]*$/gi, "").trim();
  return _0x511355;
}
export function hasSystemCommand(_0x259a63) {
  if (!_0x259a63) {
    return false;
  }
  let _0x37d3be = removeThinkBlocks(_0x259a63);
  const _0x3d6ba4 = _0x37d3be.match(/<SystemQuery>([\s\S]*?)<\/SystemQuery>/gi);
  const _0x29d148 = _0x37d3be.match(/<UpdateSettings>([\s\S]*?)<\/UpdateSettings>/gi);
  return !!_0x3d6ba4 || !!_0x29d148;
}
export function parseAndApplySettings(_0xdf8ae4) {
  if (!_0xdf8ae4) {
    return;
  }
  let _0x5ab85c = removeThinkBlocks(_0xdf8ae4);
  const _0x321cc3 = /<UpdateSettings>([\s\S]*?)<\/UpdateSettings>/gi;
  let _0x2362ce;
  while ((_0x2362ce = _0x321cc3.exec(_0x5ab85c)) !== null) {
    let _0x3fa622 = _0x2362ce[1].trim();
    try {
      const _0x1b329f = JSON.parse(_0x3fa622);
      if ("debugMode" in _0x1b329f) {
        const _0x2daf9e = _0x1b329f.debugMode;
        toggleDebug(_0x2daf9e);
        delete _0x1b329f.debugMode;
        if (typeof toastr !== "undefined") {
          toastr.success(_0x2daf9e ? "调试模式已开启" : "调试模式已关闭");
        }
      }
      if (Object.keys(_0x1b329f).length > 0) {
        const _0x108e11 = updateSettingSafely(_0x1b329f);
        if (_0x108e11) {
          if (typeof toastr !== "undefined") {
            toastr.success("智绘姬已帮你自动更新了设置项！");
          }
          try {
            refreshAiAssistantSettings();
          } catch (_0x46bbe8) {
            console.debug("[AI Settings Bridge] AI 助手设置面板刷新跳过（可能未初始化）");
          }
        }
      }
    } catch (_0x5a0445) {
      console.error("[AI Settings Bridge] AI 尝解析/修改配置 JSON 时发生错误：", _0x5a0445, "原始内容:", _0x3fa622);
    }
  }
}
export async function parseQuerySettings(_0x4f1b25) {
  if (!_0x4f1b25) {
    return null;
  }
  console.log("[AI Settings Bridge] parseQuerySettings called, reply length:", _0x4f1b25.length);
  let _0x27bbf9 = removeThinkBlocks(_0x4f1b25);
  console.log("[AI Settings Bridge] cleanedReply length:", _0x27bbf9.length);
  const _0x17e2a5 = /<SystemQuery>([\s\S]*?)<\/SystemQuery>/gi;
  const _0x28a800 = [..._0x27bbf9.matchAll(_0x17e2a5)];
  if (_0x28a800.length === 0) {
    return null;
  }
  console.log("[AI Settings Bridge] 检测到", _0x28a800.length, "个 SystemQuery 指令");
  const _0x3d4570 = [];
  for (const _0x54e062 of _0x28a800) {
    let _0x1e49df = _0x54e062[1].trim();
    console.log("[AI Settings Bridge] 解析 SystemQuery:", _0x1e49df.substring(0, 200));
    try {
      const _0x3f3827 = JSON.parse(_0x1e49df);
      console.log("[AI Settings Bridge] JSON 解析成功:", _0x3f3827.type);
      const _0x2cfed1 = await executeSingleQuery(_0x3f3827);
      _0x3d4570.push(_0x2cfed1);
    } catch (_0x11c679) {
      console.error("[AI Settings Bridge] SystemQuery JSON 解析失败:", _0x11c679.message);
      console.error("[AI Settings Bridge] 原始内容:", _0x1e49df);
      _0x3d4570.push("【系统自动回复检索】 查询指令传入了无效 JSON 格式，请检查。原始内容: " + _0x1e49df.substring(0, 100));
    }
  }
  return _0x3d4570.join("\n───────────────\n");
}
async function executeSingleQuery(_0x3f9ece) {
  if (_0x3f9ece.type === "browse") {
    const _0x5dbdc2 = browseConfigPath(_0x3f9ece.path || "");
    return "【系统自动回复 - 配置浏览】\n" + _0x5dbdc2;
  }
  if (_0x3f9ece.type === "read" && _0x3f9ece.path) {
    const _0x2671a2 = readConfigPath(_0x3f9ece.path);
    return "【系统自动回复 - 配置读取】\n" + _0x2671a2;
  }
  if (_0x3f9ece.type === "write" && _0x3f9ece.path) {
    const _0x4f5f07 = writeConfigPath(_0x3f9ece.path, _0x3f9ece.value);
    return "【系统自动回复 - 配置修改】\n" + _0x4f5f07;
  }
  if (_0x3f9ece.type === "ui_action" && _0x3f9ece.action) {
    const _0x5e3775 = executeUIAction(_0x3f9ece.action);
    return "【系统自动回复 - UI操作】\n" + _0x5e3775;
  }
  if (_0x3f9ece.type === "ui_context") {
    const _0x1d597b = getCurrentUIContext();
    return "【系统自动回复 - 当前界面】\n" + _0x1d597b;
  }
  if (_0x3f9ece.type === "check_config") {
    const _0x1659bf = checkRequiredConfigs();
    return "【系统自动回复 - 配置检查】\n" + _0x1659bf;
  }
  if (_0x3f9ece.type === "load_module" && _0x3f9ece.module) {
    const _0x3810a3 = getModulePrompt(_0x3f9ece.module);
    if (_0x3810a3) {
      return "【系统自动回复 - 加载模块: " + _0x3f9ece.module + "】\n" + _0x3810a3;
    } else {
      const _0x2cd6d4 = getAvailableModuleKeys().join(", ");
      return "【系统自动回复 - 模块不存在】 未找到模块 \"" + _0x3f9ece.module + "\"。当前可用模块: " + _0x2cd6d4;
    }
  }
  if (_0x3f9ece.type === "regex_status") {
    const _0x38428d = getRegexStatus();
    return "【系统自动回复 - 正则状态】\n" + _0x38428d;
  }
  if (_0x3f9ece.type === "regex_set_original" && _0x3f9ece.text !== undefined) {
    const _0x2733df = setRegexOriginalText(_0x3f9ece.text);
    return "【系统自动回复 - 设置原文】\n" + _0x2733df;
  }
  if (_0x3f9ece.type === "regex_set_editors") {
    const _0x328f0f = setRegexEditors(_0x3f9ece.beforeAfter, _0x3f9ece.textRegex);
    return "【系统自动回复 - 设置正则编辑器】\n" + _0x328f0f;
  }
  if (_0x3f9ece.type === "regex_create_entry" && _0x3f9ece.data) {
    const _0x4af9ff = createRegexEntry(_0x3f9ece.data);
    return "【系统自动回复 - 创建正则条目】\n" + _0x4af9ff;
  }
  if (_0x3f9ece.type === "regex_test") {
    const _0x177dd3 = await triggerRegexTest();
    return "【系统自动回复 - 正则测试】\n" + _0x177dd3;
  }
  if (_0x3f9ece.type === "regex_test_mode") {
    const _0x50822d = setRegexTestMode(_0x3f9ece.enabled !== false);
    return "【系统自动回复 - 测试模式】\n" + _0x50822d;
  }
  if (_0x3f9ece.type === "regex_result") {
    const _0x228def = getRegexResultText();
    return "【系统自动回复 - 正则结果】\n" + _0x228def;
  }
  if (_0x3f9ece.type === "gesture_enabled") {
    const _0x54ae69 = setGestureEnabled(_0x3f9ece.enabled !== false);
    return "【系统自动回复 - 手势功能】\n" + _0x54ae69;
  }
  if (_0x3f9ece.type === "click_trigger_enabled") {
    const _0x42841f = setClickTriggerEnabled(_0x3f9ece.enabled !== false);
    return "【系统自动回复 - 点击触发】\n" + _0x42841f;
  }
  if (_0x3f9ece.type === "regex_clear_entries") {
    const _0x21eb48 = clearAllRegexEntries();
    return "【系统自动回复 - 清除正则条目】\n" + _0x21eb48;
  }
  if (_0x3f9ece.type === "workflow_list") {
    const _0x585df7 = getWorkflowList();
    return "【系统自动回复 - 工作流列表】\n" + _0x585df7;
  }
  if (_0x3f9ece.type === "workflow_read" && _0x3f9ece.name) {
    const _0x4cb812 = readWorkflow(_0x3f9ece.name);
    return "【系统自动回复 - 读取工作流】\n" + _0x4cb812;
  }
  if (_0x3f9ece.type === "workflow_variables" && _0x3f9ece.name) {
    const _0x1a79d0 = scanWorkflowVariables(_0x3f9ece.name);
    return "【系统自动回复 - 工作流变量】\n" + _0x1a79d0;
  }
  if (_0x3f9ece.type === "workflow_replace_var" && _0x3f9ece.name && _0x3f9ece.variable) {
    const _0x48ecac = replaceWorkflowVariable(_0x3f9ece.name, _0x3f9ece.variable, _0x3f9ece.value);
    return "【系统自动回复 - 替换工作流变量】\n" + _0x48ecac;
  }
  if (_0x3f9ece.type === "workflow_save" && _0x3f9ece.name && _0x3f9ece.content) {
    const _0xe421f0 = saveWorkflow(_0x3f9ece.name, _0x3f9ece.content);
    return "【系统自动回复 - 保存工作流】\n" + _0xe421f0;
  }
  if (_0x3f9ece.type === "generate_image" && _0x3f9ece.prompt) {
    try {
      console.log("[AI Settings Bridge] 开始生图请求...");
      const _0x45bc6d = await requestImageGeneration(_0x3f9ece.prompt, _0x3f9ece.negative_prompt, _0x3f9ece.options);
      const _0x3bc315 = {
        imageUrlLength: _0x45bc6d.imageUrl?.length
      };
      console.log("[AI Settings Bridge] 生图完成，准备显示图片:", _0x3bc315);
      const _0x3fee1b = {
        imageUrl: _0x45bc6d.imageUrl,
        prompt: _0x3f9ece.prompt
      };
      const _0x3d37fc = {
        detail: _0x3fee1b
      };
      const _0x342a11 = new CustomEvent("ai-show-generated-image", _0x3d37fc);
      window.dispatchEvent(_0x342a11);
      console.log("[AI Settings Bridge] 已触发显示图片事件");
      return "【系统自动回复 - 生图完成】\n✅ 图片生成成功！提示词: " + _0x3f9ece.prompt;
    } catch (_0x59f0a4) {
      console.error("[AI Settings Bridge] 生图失败:", _0x59f0a4);
      return "【系统自动回复 - 生图失败】\n❌ " + _0x59f0a4.message;
    }
  }
  if (_0x3f9ece.type === "image_status" && _0x3f9ece.generationId) {
    const _0x1ea7fb = getImageGenerationStatus(_0x3f9ece.generationId);
    return "【系统自动回复 - 生图状态】\n" + _0x1ea7fb;
  }
  if (_0x3f9ece.type === "workflow_list_nodes" && _0x3f9ece.name) {
    const _0x46346e = listWorkflowNodes(_0x3f9ece.name);
    return "【系统自动回复 - 工作流节点列表】\n" + _0x46346e;
  }
  if (_0x3f9ece.type === "workflow_read_node" && _0x3f9ece.name && _0x3f9ece.nodeId) {
    const _0x8ac73 = readWorkflowNode(_0x3f9ece.name, _0x3f9ece.nodeId);
    return "【系统自动回复 - 读取节点】\n" + _0x8ac73;
  }
  if (_0x3f9ece.type === "workflow_update_node" && _0x3f9ece.name && _0x3f9ece.nodeId && _0x3f9ece.inputKey) {
    const _0x5d0e1e = updateWorkflowNodeInput(_0x3f9ece.name, _0x3f9ece.nodeId, _0x3f9ece.inputKey, _0x3f9ece.value);
    return "【系统自动回复 - 修改节点参数】\n" + _0x5d0e1e;
  }
  if (_0x3f9ece.type === "workflow_batch_update" && _0x3f9ece.name && _0x3f9ece.updates) {
    const _0x2481d8 = batchUpdateWorkflowNodes(_0x3f9ece.name, _0x3f9ece.updates);
    return "【系统自动回复 - 批量修改节点】\n" + _0x2481d8;
  }
  if (_0x3f9ece.type === "workflow_delete_node" && _0x3f9ece.name && _0x3f9ece.nodeId) {
    const _0x4825cd = deleteWorkflowNode(_0x3f9ece.name, _0x3f9ece.nodeId);
    return "【系统自动回复 - 删除节点】\n" + _0x4825cd;
  }
  if (_0x3f9ece.type === "workflow_add_node" && _0x3f9ece.name && _0x3f9ece.nodeId && _0x3f9ece.nodeData) {
    const _0xba73ca = addWorkflowNode(_0x3f9ece.name, _0x3f9ece.nodeId, _0x3f9ece.nodeData);
    return "【系统自动回复 - 添加节点】\n" + _0xba73ca;
  }
  if (_0x3f9ece.type === "get_logs") {
    const _0x77e684 = _0x3f9ece.lines || 50;
    const _0x1909d6 = getLog();
    if (!_0x1909d6 || _0x1909d6.trim() === "") {
      return "【系统自动回复 - 运行日志】\n暂无日志记录。";
    }
    const _0x503c29 = _0x1909d6.split("\n").filter(_0x1cd1fd => _0x1cd1fd.trim());
    const _0x472146 = _0x503c29.slice(-_0x77e684);
    const _0x21fb9f = _0x472146.join("\n");
    return "【系统自动回复 - 运行日志】（最近 " + _0x472146.length + " 行）\n" + _0x21fb9f;
  }
  if (_0x3f9ece.type === "get_errors") {
    const _0x311509 = _0x3f9ece.count || 10;
    const _0x4ab50d = getRecentErrors(_0x311509);
    if (_0x4ab50d.length === 0) {
      return "【系统自动回复 - 错误记录】\n暂无错误记录。";
    }
    let _0x2c8abd = "【系统自动回复 - 错误记录】（最近 " + _0x4ab50d.length + " 条）\n\n";
    for (const _0x1f28f1 of _0x4ab50d) {
      const _0x291f01 = new Date(_0x1f28f1.timestamp).toLocaleString();
      _0x2c8abd += "[" + _0x291f01 + "] " + _0x1f28f1.type.toUpperCase() + "\n";
      _0x2c8abd += "  类型: " + _0x1f28f1.message + "\n";
      if (_0x1f28f1.context && _0x1f28f1.context.message) {
        _0x2c8abd += "  内容: " + _0x1f28f1.context.message + "\n";
      }
      if (_0x1f28f1.errorMessage) {
        _0x2c8abd += "  详情: " + _0x1f28f1.errorMessage + "\n";
      }
      if (_0x1f28f1.errorName) {
        _0x2c8abd += "  错误名: " + _0x1f28f1.errorName + "\n";
      }
      if (_0x1f28f1.stack) {
        const _0x15c3f7 = _0x1f28f1.stack.split("\n").slice(0, 3);
        _0x2c8abd += "  堆栈: " + _0x15c3f7.join(" | ") + "\n";
      }
      _0x2c8abd += "\n";
    }
    return _0x2c8abd;
  }
  if (_0x3f9ece.type === "get_error_stats") {
    const _0x5b681d = getErrorStats();
    let _0x1965b2 = "【系统自动回复 - 错误统计】\n\n";
    _0x1965b2 += "总错误数: " + _0x5b681d.total + "\n";
    _0x1965b2 += "最近 1 小时: " + _0x5b681d.recentHour + " 个错误\n";
    _0x1965b2 += "最近 24 小时: " + _0x5b681d.recent24h + " 个错误\n\n";
    if (Object.keys(_0x5b681d.byType).length > 0) {
      _0x1965b2 += "按类型分布:\n";
      for (const [_0x339b2f, _0x292031] of Object.entries(_0x5b681d.byType)) {
        _0x1965b2 += "  - " + _0x339b2f + ": " + _0x292031 + "\n";
      }
    }
    return _0x1965b2;
  }
  if (_0x3f9ece.type === "get_debug_log") {
    const _0x266836 = _0x3f9ece.lines || 30;
    const _0x26f097 = getDebugLog();
    if (_0x26f097.length === 0) {
      return "【系统自动回复 - 调试日志】\n调试日志为空。可能调试模式未启用。";
    }
    const _0x37107c = _0x26f097.slice(-_0x266836);
    let _0xb0d945 = "【系统自动回复 - 调试日志】（最近 " + _0x37107c.length + " 条）\n\n";
    for (const _0x31a6fc of _0x37107c) {
      const _0x2cc6b5 = new Date(_0x31a6fc.timestamp).toLocaleString();
      const _0x299397 = _0x31a6fc.elapsed !== undefined ? " [+" + _0x31a6fc.elapsed + "ms]" : "";
      _0xb0d945 += "[" + _0x2cc6b5 + "]" + _0x299397 + " " + _0x31a6fc.type + " - " + _0x31a6fc.functionName + "\n";
      _0xb0d945 += "  " + _0x31a6fc.message + "\n";
      if (_0x31a6fc.duration !== undefined) {
        _0xb0d945 += "  耗时: " + _0x31a6fc.duration + "ms\n";
      }
      _0xb0d945 += "\n";
    }
    return _0xb0d945;
  }
  if (_0x3f9ece.type === "get_system_status") {
    const _0x20c69c = getLog();
    const _0x16386c = _0x20c69c ? _0x20c69c.split("\n").filter(_0x3584f1 => _0x3584f1.trim()).length : 0;
    const _0x470929 = getErrorStats();
    const _0x2d334c = getDebugLog();
    let _0x31bf5a = "【系统自动回复 - 系统状态】\n\n";
    _0x31bf5a += "运行日志: " + _0x16386c + " 行\n";
    _0x31bf5a += "错误记录: " + _0x470929.total + " 条（最近1小时: " + _0x470929.recentHour + "）\n";
    _0x31bf5a += "调试日志: " + _0x2d334c.length + " 条\n";
    _0x31bf5a += "调试模式: " + (_0x2d334c.length > 0 ? "已启用" : "未启用") + "\n";
    return _0x31bf5a;
  }
  if (_0x3f9ece.type === "keys_list") {
    const _0x1fa207 = getDetailedConfigKeys();
    return "【系统自动回复检索】\n数据库内存在以下数据名列表可以继续深入查询：\n" + JSON.stringify(_0x1fa207);
  }
  if (_0x3f9ece.type === "query_key" && _0x3f9ece.key) {
    const _0x2875d8 = getSpecificConfigData(_0x3f9ece.key);
    return "【系统自动回复检索】\n针对数据项 \"" + _0x3f9ece.key + "\" 的内容如下：\n" + _0x2875d8;
  }
  return "【系统自动回复检索】 未知的查询类型: " + (_0x3f9ece.type || "空");
}