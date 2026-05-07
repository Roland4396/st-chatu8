import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { getLog } from "./utils.js";
export const ConfigDescriptions = {
  theme_id: "当前使用的主题预设ID（例如：'默认-夜间'）",
  generate_btn_style: "生成图片的按钮样式",
  image_frame_style: "发送到聊天框里的图片边框样式",
  collapse_style: "配置面板的折叠样式",
  displayMode: "展示模式，决定图片在聊天框中的显示效果",
  imageAlignment: "聊天框内的图片对齐方式 ('left', 'center', 'right')",
  collapseImage: "是否默认折叠大图片 (布尔字符串 'true'/'false')",
  mode: "当前选择的图像生成后端，可选值为：'comfyui', 'novelai', 'sd', 'banana'",
  client: "客户端环境标识，常规为 'browser','jiuguan'决定了从哪里发起生图请求，如果从浏览器发情请求可能会碰到跨域问题",
  scriptEnabled: "主插件功能是否已开启 (布尔值)",
  sdUrl: "Stable Diffusion WebUI (A1111) 的 API 地址",
  comfyuiUrl: "ComfyUI 的 API 服务地址",
  novelaiApi: "[敏感信息，不应返回/修改] NovelAI 的访问凭证 (API Key)",
  novelaiApi_id: "当前选择的 NovelAI 凭据别名，用于多账号管理",
  startTag: "图片触发时的起始标识符，如 'image###'",
  endTag: "图片触发时的结束标识符，如 '###'",
  insertOriginalText: "是否在生成的图片后保留插入原始内容 (布尔字符串)",
  enablePregen: "是否启用智能预生成机制以加快响应，在ai流式返回的途中捕获生图关键词立即预生成图片，加快生图进度，仅支持酒馆全局世界书的模式 (布尔字符串)",
  sd_csteps: "Stable Diffusion (SD) 生成步数",
  sd_cwidth: "Stable Diffusion (SD) 生成宽度",
  sd_cheight: "Stable Diffusion (SD) 生成高度",
  sd_cseed: "Stable Diffusion (SD) 随机种子（-1代表随机）",
  novelai_steps: "NovelAI (NAI) 生成步数",
  novelai_width: "NovelAI (NAI) 生成宽度",
  novelai_height: "NovelAI (NAI) 生成高度",
  novelai_seed: "NovelAI (NAI) 随机种子（0代表随机）",
  comfyui_steps: "ComfyUI 生成步数",
  comfyui_width: "ComfyUI 生成宽度",
  comfyui_height: "ComfyUI 生成高度",
  comfyui_seed: "ComfyUI 随机种子（0代表随机）",
  sdCfgScale: "SD 提示词引导比例 (CFG Scale)",
  cfg_comfyui: "ComfyUI 提示词引导比例 (CFG Scale)",
  nai3Scale: "NAI 提示词引导比例 (Scale)",
  cfg_rescale: "NAI 高级参数：CFG Rescale 比例",
  sm: "NAI 高级参数：使用 Smea 采样 (布尔字符串 'true'/'false')",
  dyn: "NAI 高级参数：使用 Smea DYN (动态) 采样 (布尔字符串 'true'/'false')",
  Schedule: "NAI 调度器类型，如 'karras'",
  yusheid_sd: "当前选定的 SD 提示词预设配置名",
  yusheid_novelai: "当前选定的 NAI 提示词预设配置名",
  yusheid_comfyui: "当前选定的 ComfyUI 提示词预设配置名",
  AQT_sd: "SD 默认质量正面提示词 (加在所有生图提示词开头)",
  UCP_sd: "SD 默认质量负面提示词",
  AQT_novelai: "NAI 默认质量正面提示词",
  UCP_novelai: "NAI 默认质量负面提示词",
  AQT_comfyui: "ComfyUI 默认质量正面提示词",
  UCP_comfyui: "ComfyUI 默认质量负面提示词",
  workerid: "使用的 ComfyUI 工作流预设 ID",
  editWorkerid: "使用的 ComfyUI 局部重绘/编辑工作流预设 ID",
  MODEL_NAME: "ComfyUI 选定的 Checkpoint 大模型名称",
  comfyuisamplerName: "ComfyUI 选定的采样器名称",
  comfyui_scheduler: "ComfyUI 选定的调度器名称",
  comfyui_vae: "ComfyUI 选定的 VAE 模型名称",
  sd_cchatu_8_model: "SD 选定的 Checkpoint 大模型名称",
  sd_cchatu_8_samplerName: "SD 选定的采样器名称",
  sd_cchatu_8_vae: "SD 选定的 VAE 模型名称（'Automatic' 表示自动选择）",
  sd_cchatu_8_scheduler: "SD 选定的调度器名称",
  sd_cchatu_8_upscaler: "SD 选定的放大算法（如 'Latent'）",
  sd_cupscale_factor: "SD 放大倍率（'1' 表示不放大）",
  sd_chires_fix: "SD 是否启用高清修复 Hires Fix (布尔字符串 'true'/'false')",
  sd_chires_steps: "SD 高清修复的额外步数（'0' 使用默认）",
  sd_cdenoising_strength: "SD 高清修复/图生图的去噪强度 (0-1)",
  sd_cclip_skip: "SD CLIP Skip 层数（常用 '1' 或 '2'）",
  sd_cadetailer: "SD 是否启用 ADetailer 面部细节修复 (布尔字符串 'true'/'false')",
  restoreFaces: "SD 是否启用内置面部修复 Restore Faces (布尔字符串 'true'/'false')",
  st_chatu8_sd_auth: "SD WebUI 的认证信息（用户名:密码格式，用于需要身份验证的情况）",
  novelaimode: "NAI 生图模型版本，如 'nai-diffusion-4-5-full'",
  novelai_sampler: "NAI 选定的采样器，如 'k_euler'",
  nai3VibeTransfer: "NAI 是否开启 Vibe Transfer 风格转换 (布尔字符串 'true'/'false')",
  InformationExtracted: "NAI Vibe 提取信息比例 (0-1)",
  ReferenceStrength: "NAI Vibe 参考强度 (0-1)",
  nai3Variety: "NAI 高级参数：多样性提升 Variety (布尔字符串 'true'/'false')",
  nai3Deceisp: "NAI 高级参数：细节提升 Deceisp (布尔字符串 'true'/'false')",
  enableVibeGroupTransfer: "NAI 是否启用 Vibe 组合转换（多个 Vibe 同时生效）(布尔字符串 'true'/'false')",
  normalizeRefStrength: "NAI 是否归一化 Vibe 参考强度 (布尔字符串 'true'/'false')",
  nai3CharRef: "NAI 是否启用角色参考功能 (布尔字符串 'true'/'false')",
  nai3StylePerception: "NAI 是否启用风格感知功能 (布尔字符串 'true'/'false')",
  AI_use_coords: "NAI 是否使用ai自动坐标区域来控制生成内容的位置 true代表使用ai而不是设置的坐标 (布尔字符串 'true'/'false')",
  novelaisite: "NAI 站点选择：'官网' 使用官方服务器，其他值使用第三方站点",
  novelaiOtherSite: "NAI 第三方站点地址（仅当 novelaisite 不为'官网'时有效）",
  enableCloudQueue: "是否启用云队列模式（排队生图）,当所有拥有相同key的用户请求请求会在云端进行排队，避免拥堵长生novelai的429报错(布尔字符串 'true'/'false')",
  cloudQueueUrl: "云队列服务的 URL 地址",
  cloudQueueGreeting: "云队列等待中的提示文字",
  showQueueGreeting: "是否显示云队列等待提示 (布尔字符串 'true'/'false')",
  addFurryDataset: "NAI 是否添加 Furry 数据集支持 (布尔字符串 'true'/'false')",
  prompt_replace_id: "当前选用的文本替换规则预设 ID",
  current_regex_profile: "当前选用的正则表达式预设 ID",
  inpaint_denoise: "ComfyUI 局部重绘的重绘幅度 (Denoise)",
  inpaint_brush_size: "局部重绘的笔刷像素大小",
  inpaint_positive_prompt: "ComfyUI 局部重绘的正面提示词（描述想要重绘成什么）",
  inpaint_negative_prompt: "ComfyUI 局部重绘的负面提示词（描述不想要的内容）",
  c_fenwei: "ComfyUI IP-Adapter 氛围权重 (0-2)，控制参考图的氛围影响程度",
  c_xijie: "ComfyUI IP-Adapter 细节权重 (0-2)，控制参考图的细节还原程度",
  c_idquanzhong: "ComfyUI IP-Adapter ID权重 (0-2)，控制人物身份一致性的强度",
  c_quanzhong: "ComfyUI IP-Adapter 一般权重 (0-2)，控制整体参考强度",
  ipa: "ComfyUI IP-Adapter 模式，如 'STANDARD (medium strength)'",
  comfyuiCLIPName: "ComfyUI 选定的 CLIP 模型名称",
  autoLLMImageGen: "是否自动请求 LLM 来解析提示词并生图，当正文生成完毕，插件会自动调用llm来生成绘图提示词，仅支持非同层的角色卡游玩。同层 ：所以信息显示在一个酒馆楼层，又角色卡作者管理所有消息。 (布尔字符串 'true'/'false')",
  ai_temperature: "LLM 随机性参数 Temperature (0-2)",
  current_llm_profile: "当前使用的 LLM 接口及参数配置文件名",
  translation_model: "Tag 翻译选择的 LLM 模型名",
  ai_private: "是否将 LLM 提示词标记为 Private (布尔字符串 'true'/'false')",
  ai_top_p: "LLM Top P 采样参数 (0-1)，控制候选词的概率范围",
  ai_presence_penalty: "LLM 存在惩罚 (0-2)，降低已出现过词汇的概率",
  ai_frequency_penalty: "LLM 频率惩罚 (0-2)，降低高频词汇的重复概率",
  ai_stream: "LLM 是否启用流式输出 (布尔字符串 'true'/'false')",
  ai_token: "[敏感信息] LLM 的 API Token / 密钥",
  ai_test_system: "LLM 测试用的系统消息内容",
  ai_test_user: "LLM 测试用的用户消息内容",
  ai_test_output: "LLM 上一次测试的输出结果",
  llm_history_depth: "LLM 发送历史对话的层数（0表示不发送历史，数字越大上下文越多但 Token 消耗越大）",
  translation_system_prompt: "Tag 翻译功能使用的系统提示词模板",
  llm_request_type_configs: "四种 LLM 请求类型的配置集合（image_gen/char_design/char_display/char_modify/translation/tag_modify），每种可分配不同的 API 配置预设和上下文预设",
  test_context_profiles: "LLM 测试上下文预设集合，每个预设包含多个消息条目（角色、内容、触发模式等）",
  current_test_context_profile: "当前选用的 LLM 测试上下文预设名称",
  chatu8_ai_assistant: "智绘姬 AI 助手专属配置对象，包含 api_url(API地址)、api_key(密钥)、model(模型)、bypass_proxy(是否绕过代理)、stream(是否流式)、system_prompt(系统提示词)",
  gestureEnabled: "是否开启手势操作功能 (布尔值)",
  clickToPreview: "是否允许点击图片进入放大预览 (布尔字符串 'true'/'false')",
  longPressToEdit: "是否开启长按图片进行编辑 (布尔字符串 'true'/'false')",
  enable_chatu8_fab: "是否开启悬浮球操作 (布尔值)",
  clickTriggerEnabled: "是否开启点击触发功能，电脑双击正文，或者手机三击正文，捕获文字进行生图（点击屏幕区域触发操作）(布尔值)",
  gestureShowRecognition: "是否显示手势识别提示信息 (布尔值)",
  gestureShowTrail: "是否显示手势轨迹线 (布尔值)",
  gestureTrailColor: "手势轨迹线的颜色（CSS颜色值，如 '#00ff00'）",
  gestureMatchThreshold: "手势匹配阈值 (0-100)，越低越容易匹配",
  gesture1: "手势模板1的网格数据（10x10 二值矩阵）",
  gesture2: "手势模板2的网格数据（10x10 二值矩阵）",
  zidongdianji: "自动点击生图功能开关 (布尔字符串 'true'/'false')",
  zidongdianji2: "自动点击生图功能2开关 (布尔字符串 'true'/'false')",
  dbclike: "开启后当用户生成图片之后会隐藏生成图片的点击按钮，用双击图片重新生图的方式取代 (布尔字符串 'true'/'false')",
  newlineFixEnabled: "是否启用换行符修复功能 (布尔字符串 'true'/'false')",
  cache: "缓存模式设置（'1' 启用缓存）",
  jiuguanchucun: "是否使用酒馆存储来保存图片 (布尔字符串 'true'/'false')",
  convertToJpegStorage: "是否将图片转换为 JPEG 格式存储以减小体积 (布尔字符串 'true'/'false')",
  jiuguanStorage: "酒馆存储的数据对象",
  imageGenInterval: "连续生图的间隔时间（毫秒），防止请求过快，默认 100",
  defaultCharDemand: "默认的角色需求描述文本，仅在用户未输入任何内容时生效",
  defaultImageDemand: "默认的图片需求描述文本，仅在用户未输入任何内容时生效",
  workers: "ComfyUI 工作流预设集合，包含用户定义的所有工作流配置",
  yushe: "提示词预设集合，包含正面/负面提示词等配置模板",
  themes: "UI 主题预设集合",
  fabThemes: "悬浮球主题预设集合",
  comfyuiCache: "ComfyUI 配置缓存（模型/采样器/节点定义等），连接测试时自动获取",
  sdCache: "Stable Diffusion 配置缓存（模型/采样器等），连接测试时自动获取",
  prompt_replace: "文本替换规则集合",
  regex_profiles: "正则表达式替换规则集合",
  llm_profiles: "LLM 接口配置集合，包含多个 API 端点/密钥配置",
  banana: "Banana/grok 图像生成的完整配置对象，包含 apiKey、apiUrl、model、videoModel、aspectRatio、对话预设等",
  bananaCharacterPresets: "Banana 角色预设集合，每个预设包含触发词和参考对话",
  bananaCharacterPresetId: "当前选用的 Banana 角色预设 ID",
  novelai_profiles: "NovelAI 配置档案集合，每个档案包含完整的 NAI 参数（API Key、模型、采样器、Vibe等）",
  novelai_profile_id: "当前选用的 NovelAI 配置档案 ID",
  comfyui_profiles: "ComfyUI 配置档案集合，每个档案包含完整的 ComfyUI 参数（地址、模型、采样器、工作流等）",
  comfyui_profile_id: "当前选用的 ComfyUI 配置档案 ID",
  vibePresets: "Vibe Transfer 预设集合，每个预设包含模型、信息提取率、强度、参考图等",
  vibePresetId: "当前选用的 Vibe Transfer 预设 ID",
  chatu8_fab_theme: "悬浮球当前使用的主题名称",
  chatu8_fab_bg_color: "悬浮球背景颜色（CSS颜色值）",
  chatu8_fab_icon_color: "悬浮球图标颜色（CSS颜色值）",
  chatu8_fab_opacity: "悬浮球不透明度 (0-1)",
  chatu8_fab_size: "悬浮球大小配置对象，包含 desktop（桌面端像素）和 mobile（移动端像素）",
  chatu8_fab_position: "悬浮球位置配置对象，包含桌面端和移动端的 top/left 坐标",
  vocabulary_search_startswith: "词库搜索是否使用前缀匹配模式 (布尔字符串 'true'/'false')",
  vocabulary_search_limit: "词库搜索最大返回结果数量",
  vocabulary_search_sort: "词库搜索排序方式（如 'hot_desc' 按热度降序）",
  worldBookList: "世界设定书条目集合",
  worldBookList_id: "当前选用的世界设定书条目 ID",
  regexTestMode: "正则测试模式是否开启 (布尔值)",
  characterAI: "角色 AI 配置对象，包含 model(模型)、temperature(温度)、systemPrompt(系统提示词)、lastPrompt(上次提示词)",
  outfitAI: "服装 AI 配置对象，包含 model(模型)、temperature(温度)、systemPrompt(系统提示词)、lastPrompt(上次提示词)",
  lastTab: "记住上次打开的设置标签页名称"
};
function optimizeCacheForAI(_0x353b79, _0x5ec960) {
  if (!_0x353b79 || typeof _0x353b79 !== "object") {
    return _0x353b79;
  }
  const _0x4386fc = {};
  for (const [_0x1dc2c1, _0x4bdfb8] of Object.entries(_0x353b79)) {
    if (Array.isArray(_0x4bdfb8)) {
      if (_0x4bdfb8.length === 0) {
        _0x4386fc[_0x1dc2c1] = "[空数组]";
      } else if (_0x4bdfb8.length <= 5) {
        _0x4386fc[_0x1dc2c1] = _0x4bdfb8;
      } else {
        const _0x2c471d = _0x4bdfb8.slice(0, 3);
        _0x4386fc[_0x1dc2c1] = "[" + _0x4bdfb8.length + "项] 预览: " + JSON.stringify(_0x2c471d) + "... (使用 browse 查看完整列表)";
      }
    } else if (_0x1dc2c1 === "objectInfo" && typeof _0x4bdfb8 === "object") {
      const _0xf198db = Object.keys(_0x4bdfb8);
      if (_0xf198db.length === 0) {
        _0x4386fc[_0x1dc2c1] = "[空对象]";
      } else {
        _0x4386fc[_0x1dc2c1] = "[" + _0xf198db.length + "个节点类型] 使用 browse comfyuiCache.objectInfo 查看节点列表，或 read comfyuiCache.objectInfo.节点名 查看具体节点定义";
      }
    } else if (typeof _0x4bdfb8 === "object" && _0x4bdfb8 !== null) {
      const _0x13dea8 = Object.keys(_0x4bdfb8).length;
      _0x4386fc[_0x1dc2c1] = _0x13dea8 === 0 ? "[空对象]" : "[" + _0x13dea8 + "个子键] 使用 browse 查看详情";
    } else {
      _0x4386fc[_0x1dc2c1] = _0x4bdfb8;
    }
  }
  return _0x4386fc;
}
export function getExposedSettings() {
  const _0x5162c5 = extension_settings[extensionName];
  if (!_0x5162c5) {
    return {};
  }
  const _0x151277 = JSON.parse(JSON.stringify(_0x5162c5));
  delete _0x151277.themes;
  delete _0x151277.fabThemes;
  _0x151277.comfyuiCache &&= optimizeCacheForAI(_0x151277.comfyuiCache, "ComfyUI");
  _0x151277.sdCache &&= optimizeCacheForAI(_0x151277.sdCache, "SD");
  return _0x151277;
}
export function updateSettingSafely(_0x34b0fb) {
  if (!_0x34b0fb || typeof _0x34b0fb !== "object") {
    return false;
  }
  const _0x11ae09 = extension_settings[extensionName];
  if (!_0x11ae09) {
    return false;
  }
  let _0x40668d = false;
  for (const [_0x1b9aee, _0x3a6e58] of Object.entries(_0x34b0fb)) {
    if (Object.prototype.hasOwnProperty.call(_0x11ae09, _0x1b9aee)) {
      _0x11ae09[_0x1b9aee] = _0x3a6e58;
      _0x40668d = true;
      console.log("[AI Config Helper] 已将配置 [" + _0x1b9aee + "] 修改为:", _0x3a6e58);
    } else {
      console.warn("[AI Config Helper] 警告：AI 尝试修改未知或不存在的字段 [" + _0x1b9aee + "]，已忽略。");
    }
  }
  if (_0x40668d) {
    saveSettingsDebounced();
    const _0x35b967 = {
      changed: _0x34b0fb
    };
    const _0x44efdf = {
      detail: _0x35b967
    };
    document.dispatchEvent(new CustomEvent("st-chatu8-config-updated", _0x44efdf));
    refreshAffectedUI(_0x34b0fb);
    return true;
  }
  return false;
}
function refreshAffectedUI(_0x3a33f3) {
  try {
    const _0x254835 = extension_settings[extensionName];
    if (_0x3a33f3.workers || _0x3a33f3.workerid || _0x3a33f3.editWorkerid) {
      refreshWorkflowSelectors(_0x254835);
    }
    if (_0x3a33f3.yushe || _0x3a33f3.yusheid_sd || _0x3a33f3.yusheid_novelai || _0x3a33f3.yusheid_comfyui) {
      refreshPromptPresetSelectors(_0x254835);
    }
    if (_0x3a33f3.prompt_replace || _0x3a33f3.prompt_replace_id) {
      refreshPromptReplaceSelectors(_0x254835);
    }
    if (_0x3a33f3.regex_profiles || _0x3a33f3.current_regex_profile) {
      refreshRegexProfileSelector(_0x254835);
    }
    if (_0x3a33f3.themes || _0x3a33f3.theme_id) {
      refreshThemeSelector(_0x254835);
    }
    if (_0x3a33f3.worldBookList || _0x3a33f3.worldBookList_id) {
      refreshWorldBookSelector(_0x254835);
    }
    if (_0x3a33f3.vibePresets || _0x3a33f3.vibePresetId) {
      refreshVibePresetSelector(_0x254835);
    }
    if (_0x3a33f3.bananaCharacterPresets || _0x3a33f3.bananaCharacterPresetId) {
      refreshBananaCharacterPresetSelector(_0x254835);
    }
    if (_0x3a33f3.novelai_profiles || _0x3a33f3.novelai_profile_id) {
      refreshNovelaiProfileSelector(_0x254835);
    }
    if (_0x3a33f3.comfyui_profiles || _0x3a33f3.comfyui_profile_id) {
      refreshComfyuiProfileSelector(_0x254835);
    }
    if (_0x3a33f3.llm_profiles || _0x3a33f3.current_llm_profile) {
      refreshLlmProfileSelector(_0x254835);
      refreshRequestTypeApiSelects(_0x254835);
    }
    if (_0x3a33f3.test_context_profiles || _0x3a33f3.current_test_context_profile) {
      refreshTestContextSelector(_0x254835);
      refreshRequestTypeContextSelects(_0x254835);
    }
    if (_0x3a33f3.llm_request_type_configs) {
      refreshRequestTypeApiSelects(_0x254835);
      refreshRequestTypeContextSelects(_0x254835);
    }
    if (_0x3a33f3.translation_model) {
      refreshTranslationModelSelector(_0x254835);
    }
    if (_0x3a33f3.sdCache) {
      refreshSdCacheSelectors(_0x254835);
    }
    if (_0x3a33f3.comfyuiCache) {
      refreshComfyuiCacheSelectors(_0x254835);
    }
    if (_0x3a33f3.characterPresets || _0x3a33f3.character_preset_id) {
      refreshCharacterPresetSelectors(_0x254835);
    }
    if (_0x3a33f3.outfitPresets || _0x3a33f3.outfit_preset_id) {
      refreshOutfitPresetSelectors(_0x254835);
    }
    if (_0x3a33f3.characterEnablePresets || _0x3a33f3.character_enable_preset_id) {
      refreshCharacterEnablePresetSelector(_0x254835);
    }
    if (_0x3a33f3.outfitEnablePresets || _0x3a33f3.outfit_enable_preset_id) {
      refreshOutfitEnablePresetSelector(_0x254835);
    }
    if (_0x3a33f3.characterCommonPresets || _0x3a33f3.character_common_preset_id) {
      refreshCharacterCommonPresetSelector(_0x254835);
    }
    if (_0x3a33f3.banana?.conversationPresets || _0x3a33f3.banana?.conversationPresetId) {
      refreshBananaConversationPresetSelector(_0x254835);
    }
    if (_0x3a33f3.fabThemes || _0x3a33f3.chatu8_fab_theme) {
      refreshFabThemeSelector(_0x254835);
    }
    refreshInputFields(_0x3a33f3, _0x254835);
    console.log("[AI Config Helper] UI 已智能刷新");
  } catch (_0x359185) {
    console.error("[AI Config Helper] UI 刷新失败:", _0x359185);
  }
}
function refreshRequestTypeApiSelects(_0x998215) {
  if (!_0x998215.llm_profiles) {
    return;
  }
  const _0x9fa53d = ["image_gen", "char_design", "char_display", "char_modify", "translation", "tag_modify"];
  const _0x297c77 = Object.keys(_0x998215.llm_profiles);
  _0x9fa53d.forEach(_0x3f72c7 => {
    const _0x45a096 = "ch-llm_" + _0x3f72c7 + "_api_select";
    const _0x5b4e54 = document.getElementById(_0x45a096);
    if (!_0x5b4e54) {
      return;
    }
    const _0x4aac45 = _0x5b4e54.value;
    _0x5b4e54.innerHTML = "";
    _0x297c77.forEach(_0x3038e6 => {
      const _0x20a391 = new Option(_0x3038e6, _0x3038e6);
      _0x20a391.title = _0x3038e6;
      _0x5b4e54.add(_0x20a391);
    });
    const _0x27ba17 = _0x998215.llm_request_type_configs?.[_0x3f72c7]?.api_profile;
    if (_0x27ba17 && _0x297c77.includes(_0x27ba17)) {
      _0x5b4e54.value = _0x27ba17;
    } else if (_0x297c77.includes(_0x4aac45)) {
      _0x5b4e54.value = _0x4aac45;
    } else if (_0x297c77.length > 0) {
      _0x5b4e54.value = _0x297c77[0];
    }
  });
  console.log("[AI Config Helper] 请求类型 API 配置下拉框已刷新");
}
function refreshRequestTypeContextSelects(_0x983534) {
  if (!_0x983534.test_context_profiles) {
    return;
  }
  const _0x2370cf = ["image_gen", "char_design", "char_display", "char_modify", "translation", "tag_modify"];
  const _0x443d80 = Object.keys(_0x983534.test_context_profiles);
  _0x2370cf.forEach(_0xb18380 => {
    const _0x5e1029 = "ch-llm_" + _0xb18380 + "_context_select";
    const _0x4c5167 = document.getElementById(_0x5e1029);
    if (!_0x4c5167) {
      return;
    }
    const _0x400ff0 = _0x4c5167.value;
    _0x4c5167.innerHTML = "";
    _0x443d80.forEach(_0x10b319 => {
      const _0x30c49d = new Option(_0x10b319, _0x10b319);
      _0x30c49d.title = _0x10b319;
      _0x4c5167.add(_0x30c49d);
    });
    const _0x4046aa = _0x983534.llm_request_type_configs?.[_0xb18380]?.context_preset;
    if (_0x4046aa && _0x443d80.includes(_0x4046aa)) {
      _0x4c5167.value = _0x4046aa;
    } else if (_0x443d80.includes(_0x400ff0)) {
      _0x4c5167.value = _0x400ff0;
    } else if (_0x443d80.length > 0) {
      _0x4c5167.value = _0x443d80[0];
    }
  });
  console.log("[AI Config Helper] 请求类型上下文预设下拉框已刷新");
}
function refreshWorkflowSelectors(_0x711dad) {
  const _0x29b51c = document.getElementById("workerid");
  if (_0x29b51c && _0x711dad.workers) {
    const _0x314336 = _0x29b51c.value;
    _0x29b51c.innerHTML = "";
    for (const _0x35e9f1 in _0x711dad.workers) {
      const _0x40e48c = new Option(_0x35e9f1, _0x35e9f1);
      _0x40e48c.title = _0x35e9f1;
      _0x29b51c.add(_0x40e48c);
    }
    if (_0x711dad.workers[_0x314336]) {
      _0x29b51c.value = _0x314336;
    } else if (_0x711dad.workerid && _0x711dad.workers[_0x711dad.workerid]) {
      _0x29b51c.value = _0x711dad.workerid;
    }
    const _0x29f0 = document.getElementById("worker");
    if (_0x29f0) {
      const _0x2c3d51 = _0x29b51c.value;
      if (_0x2c3d51 && _0x711dad.workers[_0x2c3d51]) {
        _0x29f0.value = _0x711dad.workers[_0x2c3d51];
      }
    }
  }
  const _0x39f226 = document.getElementById("editWorkerid");
  if (_0x39f226 && _0x711dad.workers) {
    const _0x46629d = _0x39f226.value;
    _0x39f226.innerHTML = "";
    for (const _0x4a84fa in _0x711dad.workers) {
      const _0x42f5ce = new Option(_0x4a84fa, _0x4a84fa);
      _0x42f5ce.title = _0x4a84fa;
      _0x39f226.add(_0x42f5ce);
    }
    if (_0x711dad.workers[_0x46629d]) {
      _0x39f226.value = _0x46629d;
    } else if (_0x711dad.editWorkerid && _0x711dad.workers[_0x711dad.editWorkerid]) {
      _0x39f226.value = _0x711dad.editWorkerid;
    }
    const _0x4e255c = document.getElementById("editWorker");
    if (_0x4e255c) {
      const _0x1f79cf = _0x39f226.value;
      if (_0x1f79cf && _0x711dad.workers[_0x1f79cf]) {
        _0x4e255c.value = _0x711dad.workers[_0x1f79cf];
      }
    }
  }
  console.log("[AI Config Helper] 工作流选择器和JSON输入框已刷新");
}
function refreshPromptPresetSelectors(_0x570a7a) {
  if (!_0x570a7a.yushe) {
    return;
  }
  const _0x204112 = [{
    id: "yusheid",
    key: "yusheid_sd"
  }, {
    id: "yusheid_novelai",
    key: "yusheid_novelai"
  }, {
    id: "yusheid_comfyui",
    key: "yusheid_comfyui"
  }];
  _0x204112.forEach(({
    id: _0x56ed20,
    key: _0x5c00ca
  }) => {
    const _0x188032 = document.getElementById(_0x56ed20);
    if (!_0x188032) {
      return;
    }
    const _0x49ed08 = _0x188032.value;
    _0x188032.innerHTML = "";
    for (const _0x4016f4 in _0x570a7a.yushe) {
      const _0x40ed04 = new Option(_0x4016f4, _0x4016f4);
      _0x40ed04.title = _0x4016f4;
      _0x188032.add(_0x40ed04);
    }
    const _0x4bc6f0 = _0x570a7a[_0x5c00ca];
    if (_0x4bc6f0 && _0x570a7a.yushe[_0x4bc6f0]) {
      _0x188032.value = _0x4bc6f0;
    } else if (_0x570a7a.yushe[_0x49ed08]) {
      _0x188032.value = _0x49ed08;
    }
  });
  console.log("[AI Config Helper] 提示词预设选择器已刷新");
}
function refreshPromptReplaceSelectors(_0x6293c1) {
  if (!_0x6293c1.prompt_replace) {
    return;
  }
  const _0x380c3a = [{
    id: "prompt_replace_id",
    key: "prompt_replace_id"
  }, {
    id: "prompt_replace_id_novelai",
    key: "prompt_replace_id"
  }, {
    id: "prompt_replace_id_comfyui",
    key: "prompt_replace_id"
  }];
  _0x380c3a.forEach(({
    id: _0xf63402,
    key: _0xdb1075
  }) => {
    const _0x32c461 = document.getElementById(_0xf63402);
    if (!_0x32c461) {
      return;
    }
    const _0x3ea3b9 = _0x32c461.value;
    _0x32c461.innerHTML = "";
    for (const _0x5aae57 in _0x6293c1.prompt_replace) {
      const _0x5aa2cf = new Option(_0x5aae57, _0x5aae57);
      _0x5aa2cf.title = _0x5aae57;
      _0x32c461.add(_0x5aa2cf);
    }
    const _0x548d5c = _0x6293c1[_0xdb1075];
    if (_0x548d5c && _0x6293c1.prompt_replace[_0x548d5c]) {
      _0x32c461.value = _0x548d5c;
    } else if (_0x6293c1.prompt_replace[_0x3ea3b9]) {
      _0x32c461.value = _0x3ea3b9;
    }
  });
  console.log("[AI Config Helper] 提示词替换选择器已刷新");
}
function refreshRegexProfileSelector(_0x578468) {
  if (!_0x578468.regex_profiles) {
    return;
  }
  const _0x15eabc = document.getElementById("ch-regex-profile-select");
  if (!_0x15eabc) {
    return;
  }
  const _0x15b87b = _0x15eabc.value;
  _0x15eabc.innerHTML = "";
  for (const _0x17f112 in _0x578468.regex_profiles) {
    const _0x34bdee = new Option(_0x17f112, _0x17f112);
    _0x34bdee.title = _0x17f112;
    _0x15eabc.add(_0x34bdee);
  }
  if (_0x578468.regex_profiles[_0x15b87b]) {
    _0x15eabc.value = _0x15b87b;
  } else if (_0x578468.current_regex_profile && _0x578468.regex_profiles[_0x578468.current_regex_profile]) {
    _0x15eabc.value = _0x578468.current_regex_profile;
  }
  console.log("[AI Config Helper] 正则配置选择器已刷新");
}
function refreshThemeSelector(_0x1495fd) {
  if (!_0x1495fd.themes) {
    return;
  }
  const _0x5e0524 = document.getElementById("theme_id");
  if (!_0x5e0524) {
    return;
  }
  const _0x70ceba = _0x5e0524.value;
  _0x5e0524.innerHTML = "";
  for (const _0x49ae1f in _0x1495fd.themes) {
    const _0x317c67 = new Option(_0x49ae1f, _0x49ae1f);
    _0x317c67.title = _0x49ae1f;
    _0x5e0524.add(_0x317c67);
  }
  if (_0x1495fd.themes[_0x70ceba]) {
    _0x5e0524.value = _0x70ceba;
  } else if (_0x1495fd.theme_id && _0x1495fd.themes[_0x1495fd.theme_id]) {
    _0x5e0524.value = _0x1495fd.theme_id;
  }
  console.log("[AI Config Helper] 主题选择器已刷新");
}
function refreshWorldBookSelector(_0x5c8756) {
  if (!_0x5c8756.worldBookList) {
    return;
  }
  const _0x3db979 = document.getElementById("worldBookList_id");
  if (!_0x3db979) {
    return;
  }
  const _0x47c7bc = _0x3db979.value;
  _0x3db979.innerHTML = "";
  for (const _0x330e5f in _0x5c8756.worldBookList) {
    const _0xc39157 = new Option(_0x330e5f, _0x330e5f);
    _0xc39157.title = _0x330e5f;
    _0x3db979.add(_0xc39157);
  }
  if (_0x5c8756.worldBookList[_0x47c7bc]) {
    _0x3db979.value = _0x47c7bc;
  } else if (_0x5c8756.worldBookList_id && _0x5c8756.worldBookList[_0x5c8756.worldBookList_id]) {
    _0x3db979.value = _0x5c8756.worldBookList_id;
  }
  console.log("[AI Config Helper] 世界书选择器已刷新");
}
function refreshVibePresetSelector(_0x36946a) {
  if (!_0x36946a.vibePresets) {
    return;
  }
  const _0x3882c3 = document.getElementById("vibePresetId");
  if (!_0x3882c3) {
    return;
  }
  const _0x135d54 = _0x3882c3.value;
  _0x3882c3.innerHTML = "";
  for (const _0x27efe4 in _0x36946a.vibePresets) {
    const _0xf9bbc5 = new Option(_0x27efe4, _0x27efe4);
    _0xf9bbc5.title = _0x27efe4;
    _0x3882c3.add(_0xf9bbc5);
  }
  if (_0x36946a.vibePresets[_0x135d54]) {
    _0x3882c3.value = _0x135d54;
  } else if (_0x36946a.vibePresetId && _0x36946a.vibePresets[_0x36946a.vibePresetId]) {
    _0x3882c3.value = _0x36946a.vibePresetId;
  }
  console.log("[AI Config Helper] Vibe 预设选择器已刷新");
}
function refreshBananaCharacterPresetSelector(_0x565042) {
  if (!_0x565042.bananaCharacterPresets) {
    return;
  }
  const _0x36c7dc = document.getElementById("bananaCharacterPresetId");
  if (!_0x36c7dc) {
    return;
  }
  const _0x3140e1 = _0x36c7dc.value;
  _0x36c7dc.innerHTML = "";
  for (const _0x46d7de in _0x565042.bananaCharacterPresets) {
    const _0x2be77c = new Option(_0x46d7de, _0x46d7de);
    _0x2be77c.title = _0x46d7de;
    _0x36c7dc.add(_0x2be77c);
  }
  if (_0x565042.bananaCharacterPresets[_0x3140e1]) {
    _0x36c7dc.value = _0x3140e1;
  } else if (_0x565042.bananaCharacterPresetId && _0x565042.bananaCharacterPresets[_0x565042.bananaCharacterPresetId]) {
    _0x36c7dc.value = _0x565042.bananaCharacterPresetId;
  }
  console.log("[AI Config Helper] Banana 角色预设选择器已刷新");
}
function refreshNovelaiProfileSelector(_0x52deba) {
  if (!_0x52deba.novelai_profiles) {
    return;
  }
  const _0x170e1b = document.getElementById("novelai_profile_id");
  if (!_0x170e1b) {
    return;
  }
  const _0x43fa6e = _0x170e1b.value;
  _0x170e1b.innerHTML = "";
  for (const _0x391e8e in _0x52deba.novelai_profiles) {
    const _0x66fc95 = new Option(_0x391e8e, _0x391e8e);
    _0x66fc95.title = _0x391e8e;
    _0x170e1b.add(_0x66fc95);
  }
  if (_0x52deba.novelai_profiles[_0x43fa6e]) {
    _0x170e1b.value = _0x43fa6e;
  } else if (_0x52deba.novelai_profile_id && _0x52deba.novelai_profiles[_0x52deba.novelai_profile_id]) {
    _0x170e1b.value = _0x52deba.novelai_profile_id;
  }
  console.log("[AI Config Helper] NovelAI 配置档案选择器已刷新");
}
function refreshComfyuiProfileSelector(_0x153af7) {
  if (!_0x153af7.comfyui_profiles) {
    return;
  }
  const _0x583253 = document.getElementById("comfyui_profile_id");
  if (!_0x583253) {
    return;
  }
  const _0x3e815d = _0x583253.value;
  _0x583253.innerHTML = "";
  for (const _0x1dbd85 in _0x153af7.comfyui_profiles) {
    const _0x84f4ac = new Option(_0x1dbd85, _0x1dbd85);
    _0x84f4ac.title = _0x1dbd85;
    _0x583253.add(_0x84f4ac);
  }
  if (_0x153af7.comfyui_profiles[_0x3e815d]) {
    _0x583253.value = _0x3e815d;
  } else if (_0x153af7.comfyui_profile_id && _0x153af7.comfyui_profiles[_0x153af7.comfyui_profile_id]) {
    _0x583253.value = _0x153af7.comfyui_profile_id;
  }
  console.log("[AI Config Helper] ComfyUI 配置档案选择器已刷新");
}
function refreshLlmProfileSelector(_0x40f1d4) {
  if (!_0x40f1d4.llm_profiles) {
    return;
  }
  const _0x37776a = document.getElementById("ch-llm_profile_select");
  if (!_0x37776a) {
    return;
  }
  const _0x5d828e = _0x37776a.value;
  _0x37776a.innerHTML = "";
  for (const _0x297bcd in _0x40f1d4.llm_profiles) {
    const _0x1cec21 = new Option(_0x297bcd, _0x297bcd);
    _0x1cec21.title = _0x297bcd;
    _0x37776a.add(_0x1cec21);
  }
  if (_0x40f1d4.llm_profiles[_0x5d828e]) {
    _0x37776a.value = _0x5d828e;
  } else if (_0x40f1d4.current_llm_profile && _0x40f1d4.llm_profiles[_0x40f1d4.current_llm_profile]) {
    _0x37776a.value = _0x40f1d4.current_llm_profile;
  }
  console.log("[AI Config Helper] LLM 配置档案选择器已刷新");
}
function refreshTestContextSelector(_0x17b8e7) {
  if (!_0x17b8e7.test_context_profiles) {
    return;
  }
  const _0x33cc31 = document.getElementById("ch-test_context_select");
  if (!_0x33cc31) {
    return;
  }
  const _0x2e0878 = _0x33cc31.value;
  _0x33cc31.innerHTML = "";
  for (const _0xe119db in _0x17b8e7.test_context_profiles) {
    const _0x544d55 = new Option(_0xe119db, _0xe119db);
    _0x544d55.title = _0xe119db;
    _0x33cc31.add(_0x544d55);
  }
  if (_0x17b8e7.test_context_profiles[_0x2e0878]) {
    _0x33cc31.value = _0x2e0878;
  } else if (_0x17b8e7.current_test_context_profile && _0x17b8e7.test_context_profiles[_0x17b8e7.current_test_context_profile]) {
    _0x33cc31.value = _0x17b8e7.current_test_context_profile;
  }
  console.log("[AI Config Helper] 上下文预设选择器已刷新");
}
function refreshTranslationModelSelector(_0x286db5) {
  if (!_0x286db5.llm_profiles) {
    return;
  }
  const _0x5baa41 = document.getElementById("translation_model");
  if (!_0x5baa41) {
    return;
  }
  const _0x57b818 = _0x5baa41.value;
  _0x5baa41.innerHTML = "";
  for (const _0x28097d in _0x286db5.llm_profiles) {
    const _0x5c29de = new Option(_0x28097d, _0x28097d);
    _0x5c29de.title = _0x28097d;
    _0x5baa41.add(_0x5c29de);
  }
  if (_0x286db5.llm_profiles[_0x57b818]) {
    _0x5baa41.value = _0x57b818;
  } else if (_0x286db5.translation_model && _0x286db5.llm_profiles[_0x286db5.translation_model]) {
    _0x5baa41.value = _0x286db5.translation_model;
  }
  console.log("[AI Config Helper] 翻译模型选择器已刷新");
}
function refreshSdCacheSelectors(_0x334d92) {
  if (!_0x334d92.sdCache) {
    return;
  }
  const _0x1a489a = _0x334d92.sdCache;
  if (_0x1a489a.models) {
    const _0x4277e3 = document.getElementById("sd_cchatu_8_model");
    if (_0x4277e3) {
      const _0x541118 = _0x4277e3.value;
      _0x4277e3.innerHTML = "";
      _0x1a489a.models.forEach(_0x7ea249 => _0x4277e3.add(new Option(_0x7ea249, _0x7ea249)));
      if (_0x1a489a.models.includes(_0x541118)) {
        _0x4277e3.value = _0x541118;
      } else if (_0x334d92.sd_cchatu_8_model && _0x1a489a.models.includes(_0x334d92.sd_cchatu_8_model)) {
        _0x4277e3.value = _0x334d92.sd_cchatu_8_model;
      }
    }
  }
  if (_0x1a489a.vaes) {
    const _0x3e2420 = document.getElementById("sd_cchatu_8_vae");
    if (_0x3e2420) {
      const _0x1adba6 = _0x3e2420.value;
      _0x3e2420.innerHTML = "";
      _0x1a489a.vaes.forEach(_0x2cc710 => _0x3e2420.add(new Option(_0x2cc710, _0x2cc710)));
      if (_0x1a489a.vaes.includes(_0x1adba6)) {
        _0x3e2420.value = _0x1adba6;
      } else if (_0x334d92.sd_cchatu_8_vae && _0x1a489a.vaes.includes(_0x334d92.sd_cchatu_8_vae)) {
        _0x3e2420.value = _0x334d92.sd_cchatu_8_vae;
      }
    }
  }
  if (_0x1a489a.samplers) {
    const _0x441ebe = document.getElementById("sd_cchatu_8_samplerName");
    if (_0x441ebe) {
      const _0x477820 = _0x441ebe.value;
      _0x441ebe.innerHTML = "";
      _0x1a489a.samplers.forEach(_0x15ce8a => _0x441ebe.add(new Option(_0x15ce8a, _0x15ce8a)));
      if (_0x1a489a.samplers.includes(_0x477820)) {
        _0x441ebe.value = _0x477820;
      } else if (_0x334d92.sd_cchatu_8_samplerName && _0x1a489a.samplers.includes(_0x334d92.sd_cchatu_8_samplerName)) {
        _0x441ebe.value = _0x334d92.sd_cchatu_8_samplerName;
      }
    }
  }
  if (_0x1a489a.schedulers) {
    const _0x538325 = document.getElementById("sd_cchatu_8_scheduler");
    if (_0x538325) {
      const _0x52b5cf = _0x538325.value;
      _0x538325.innerHTML = "";
      _0x1a489a.schedulers.forEach(_0x8193b7 => _0x538325.add(new Option(_0x8193b7, _0x8193b7)));
      if (_0x1a489a.schedulers.includes(_0x52b5cf)) {
        _0x538325.value = _0x52b5cf;
      } else if (_0x334d92.sd_cchatu_8_scheduler && _0x1a489a.schedulers.includes(_0x334d92.sd_cchatu_8_scheduler)) {
        _0x538325.value = _0x334d92.sd_cchatu_8_scheduler;
      }
    }
  }
  if (_0x1a489a.upscalers) {
    const _0x445bc0 = document.getElementById("sd_cchatu_8_upscaler");
    if (_0x445bc0) {
      const _0x6ee41d = _0x445bc0.value;
      _0x445bc0.innerHTML = "";
      _0x1a489a.upscalers.forEach(_0x18e7eb => _0x445bc0.add(new Option(_0x18e7eb, _0x18e7eb)));
      if (_0x1a489a.upscalers.includes(_0x6ee41d)) {
        _0x445bc0.value = _0x6ee41d;
      } else if (_0x334d92.sd_cchatu_8_upscaler && _0x1a489a.upscalers.includes(_0x334d92.sd_cchatu_8_upscaler)) {
        _0x445bc0.value = _0x334d92.sd_cchatu_8_upscaler;
      }
    }
  }
  if (_0x1a489a.loras) {
    const _0x4d0312 = document.getElementById("sd_cchatu_8_lora");
    if (_0x4d0312) {
      const _0x294201 = _0x4d0312.value;
      _0x4d0312.innerHTML = "";
      _0x1a489a.loras.forEach(_0x3b5222 => _0x4d0312.add(new Option(_0x3b5222, _0x3b5222)));
      if (_0x1a489a.loras.includes(_0x294201)) {
        _0x4d0312.value = _0x294201;
      }
    }
  }
  console.log("[AI Config Helper] SD 缓存选择器已刷新");
}
function refreshComfyuiCacheSelectors(_0x1bae73) {
  if (!_0x1bae73.comfyuiCache) {
    return;
  }
  const _0xf397e6 = _0x1bae73.comfyuiCache;
  if (_0xf397e6.models) {
    const _0x2081c0 = document.getElementById("MODEL_NAME");
    if (_0x2081c0) {
      const _0x89008a = _0x2081c0.value;
      _0x2081c0.innerHTML = "";
      _0xf397e6.models.forEach(_0x3215b4 => _0x2081c0.add(new Option(_0x3215b4, _0x3215b4)));
      if (_0xf397e6.models.includes(_0x89008a)) {
        _0x2081c0.value = _0x89008a;
      } else if (_0x1bae73.MODEL_NAME && _0xf397e6.models.includes(_0x1bae73.MODEL_NAME)) {
        _0x2081c0.value = _0x1bae73.MODEL_NAME;
      }
    }
  }
  if (_0xf397e6.samplers) {
    const _0x4afda1 = document.getElementById("comfyuisamplerName");
    if (_0x4afda1) {
      const _0x1b36a8 = _0x4afda1.value;
      _0x4afda1.innerHTML = "";
      _0xf397e6.samplers.forEach(_0x8aebae => _0x4afda1.add(new Option(_0x8aebae, _0x8aebae)));
      if (_0xf397e6.samplers.includes(_0x1b36a8)) {
        _0x4afda1.value = _0x1b36a8;
      } else if (_0x1bae73.comfyuisamplerName && _0xf397e6.samplers.includes(_0x1bae73.comfyuisamplerName)) {
        _0x4afda1.value = _0x1bae73.comfyuisamplerName;
      }
    }
  }
  if (_0xf397e6.vaes) {
    const _0x960ca3 = document.getElementById("comfyui_vae");
    if (_0x960ca3) {
      const _0x5a0565 = _0x960ca3.value;
      _0x960ca3.innerHTML = "";
      _0xf397e6.vaes.forEach(_0x1ed3fc => _0x960ca3.add(new Option(_0x1ed3fc, _0x1ed3fc)));
      if (_0xf397e6.vaes.includes(_0x5a0565)) {
        _0x960ca3.value = _0x5a0565;
      } else if (_0x1bae73.comfyui_vae && _0xf397e6.vaes.includes(_0x1bae73.comfyui_vae)) {
        _0x960ca3.value = _0x1bae73.comfyui_vae;
      }
    }
  }
  if (_0xf397e6.schedulers) {
    const _0xe6184a = document.getElementById("comfyui_scheduler");
    if (_0xe6184a) {
      const _0x3829b2 = _0xe6184a.value;
      _0xe6184a.innerHTML = "";
      _0xf397e6.schedulers.forEach(_0x54dba1 => _0xe6184a.add(new Option(_0x54dba1, _0x54dba1)));
      if (_0xf397e6.schedulers.includes(_0x3829b2)) {
        _0xe6184a.value = _0x3829b2;
      } else if (_0x1bae73.comfyui_scheduler && _0xf397e6.schedulers.includes(_0x1bae73.comfyui_scheduler)) {
        _0xe6184a.value = _0x1bae73.comfyui_scheduler;
      }
    }
  }
  if (_0xf397e6.clips) {
    const _0x49297f = document.getElementById("comfyuiCLIPName");
    if (_0x49297f) {
      const _0x4dbdcc = _0x49297f.value;
      _0x49297f.innerHTML = "";
      _0xf397e6.clips.forEach(_0x5f09a6 => _0x49297f.add(new Option(_0x5f09a6, _0x5f09a6)));
      if (_0xf397e6.clips.includes(_0x4dbdcc)) {
        _0x49297f.value = _0x4dbdcc;
      } else if (_0x1bae73.comfyuiCLIPName && _0xf397e6.clips.includes(_0x1bae73.comfyuiCLIPName)) {
        _0x49297f.value = _0x1bae73.comfyuiCLIPName;
      }
    }
  }
  if (_0xf397e6.loras) {
    const _0x3e2046 = document.getElementById("ComfyuiLORA");
    if (_0x3e2046) {
      const _0x57fe61 = _0x3e2046.value;
      _0x3e2046.innerHTML = "";
      _0xf397e6.loras.forEach(_0x5d7ddf => _0x3e2046.add(new Option(_0x5d7ddf, _0x5d7ddf)));
      if (_0xf397e6.loras.includes(_0x57fe61)) {
        _0x3e2046.value = _0x57fe61;
      }
    }
  }
  console.log("[AI Config Helper] ComfyUI 缓存选择器已刷新");
}
function refreshCharacterPresetSelectors(_0x2a0278) {
  if (!_0x2a0278.characterPresets) {
    return;
  }
  const _0x3f29c3 = document.getElementById("character_preset_id");
  if (_0x3f29c3) {
    const _0x15196e = _0x3f29c3.value;
    _0x3f29c3.innerHTML = "";
    for (const _0x5dabba in _0x2a0278.characterPresets) {
      _0x3f29c3.add(new Option(_0x5dabba, _0x5dabba));
    }
    if (_0x2a0278.characterPresets[_0x15196e]) {
      _0x3f29c3.value = _0x15196e;
    } else if (_0x2a0278.character_preset_id && _0x2a0278.characterPresets[_0x2a0278.character_preset_id]) {
      _0x3f29c3.value = _0x2a0278.character_preset_id;
    }
  }
  console.log("[AI Config Helper] 角色预设选择器已刷新");
}
function refreshOutfitPresetSelectors(_0x18ebd9) {
  if (!_0x18ebd9.outfitPresets) {
    return;
  }
  const _0x5a9b64 = document.getElementById("outfit_preset_id");
  if (_0x5a9b64) {
    const _0x4bf748 = _0x5a9b64.value;
    _0x5a9b64.innerHTML = "";
    for (const _0x46c5d7 in _0x18ebd9.outfitPresets) {
      _0x5a9b64.add(new Option(_0x46c5d7, _0x46c5d7));
    }
    if (_0x18ebd9.outfitPresets[_0x4bf748]) {
      _0x5a9b64.value = _0x4bf748;
    } else if (_0x18ebd9.outfit_preset_id && _0x18ebd9.outfitPresets[_0x18ebd9.outfit_preset_id]) {
      _0x5a9b64.value = _0x18ebd9.outfit_preset_id;
    }
  }
  console.log("[AI Config Helper] 服装预设选择器已刷新");
}
function refreshCharacterEnablePresetSelector(_0x30649f) {
  if (!_0x30649f.characterEnablePresets) {
    return;
  }
  const _0x35531c = document.getElementById("character_enable_preset_id");
  if (_0x35531c) {
    const _0x32389f = _0x35531c.value;
    _0x35531c.innerHTML = "";
    for (const _0x26ea4f in _0x30649f.characterEnablePresets) {
      _0x35531c.add(new Option(_0x26ea4f, _0x26ea4f));
    }
    if (_0x30649f.characterEnablePresets[_0x32389f]) {
      _0x35531c.value = _0x32389f;
    } else if (_0x30649f.character_enable_preset_id && _0x30649f.characterEnablePresets[_0x30649f.character_enable_preset_id]) {
      _0x35531c.value = _0x30649f.character_enable_preset_id;
    }
  }
  console.log("[AI Config Helper] 角色启用预设选择器已刷新");
}
function refreshOutfitEnablePresetSelector(_0xc9c9f9) {
  if (!_0xc9c9f9.outfitEnablePresets) {
    return;
  }
  const _0x547ad5 = document.getElementById("outfit_enable_preset_id");
  if (_0x547ad5) {
    const _0x5ff7f3 = _0x547ad5.value;
    _0x547ad5.innerHTML = "";
    for (const _0x34bb0e in _0xc9c9f9.outfitEnablePresets) {
      _0x547ad5.add(new Option(_0x34bb0e, _0x34bb0e));
    }
    if (_0xc9c9f9.outfitEnablePresets[_0x5ff7f3]) {
      _0x547ad5.value = _0x5ff7f3;
    } else if (_0xc9c9f9.outfit_enable_preset_id && _0xc9c9f9.outfitEnablePresets[_0xc9c9f9.outfit_enable_preset_id]) {
      _0x547ad5.value = _0xc9c9f9.outfit_enable_preset_id;
    }
  }
  console.log("[AI Config Helper] 服装启用预设选择器已刷新");
}
function refreshCharacterCommonPresetSelector(_0x5ea758) {
  if (!_0x5ea758.characterCommonPresets) {
    return;
  }
  const _0xec221f = document.getElementById("character_common_preset_id");
  if (_0xec221f) {
    const _0x50d81e = _0xec221f.value;
    _0xec221f.innerHTML = "";
    for (const _0x2c1984 in _0x5ea758.characterCommonPresets) {
      _0xec221f.add(new Option(_0x2c1984, _0x2c1984));
    }
    if (_0x5ea758.characterCommonPresets[_0x50d81e]) {
      _0xec221f.value = _0x50d81e;
    } else if (_0x5ea758.character_common_preset_id && _0x5ea758.characterCommonPresets[_0x5ea758.character_common_preset_id]) {
      _0xec221f.value = _0x5ea758.character_common_preset_id;
    }
  }
  console.log("[AI Config Helper] 通用角色预设选择器已刷新");
}
function refreshBananaConversationPresetSelector(_0x47911f) {
  if (!_0x47911f.banana?.conversationPresets) {
    return;
  }
  const _0x4fcb50 = document.getElementById("st-chatu8-banana-conversation-preset-id");
  if (_0x4fcb50) {
    const _0x1a99c4 = _0x4fcb50.value;
    _0x4fcb50.innerHTML = "";
    for (const _0x4fc7ee in _0x47911f.banana.conversationPresets) {
      _0x4fcb50.add(new Option(_0x4fc7ee, _0x4fc7ee));
    }
    if (_0x47911f.banana.conversationPresets[_0x1a99c4]) {
      _0x4fcb50.value = _0x1a99c4;
    } else if (_0x47911f.banana.conversationPresetId && _0x47911f.banana.conversationPresets[_0x47911f.banana.conversationPresetId]) {
      _0x4fcb50.value = _0x47911f.banana.conversationPresetId;
    }
  }
  console.log("[AI Config Helper] Banana 对话预设选择器已刷新");
}
function refreshFabThemeSelector(_0x497e3c) {
  if (!_0x497e3c.fabThemes) {
    return;
  }
  const _0x1a3b04 = document.getElementById("chatu8_fab_theme");
  if (_0x1a3b04) {
    const _0x1695c = _0x1a3b04.value;
    _0x1a3b04.innerHTML = "";
    for (const _0x50b1ef in _0x497e3c.fabThemes) {
      _0x1a3b04.add(new Option(_0x50b1ef, _0x50b1ef));
    }
    if (_0x497e3c.fabThemes[_0x1695c]) {
      _0x1a3b04.value = _0x1695c;
    } else if (_0x497e3c.chatu8_fab_theme && _0x497e3c.fabThemes[_0x497e3c.chatu8_fab_theme]) {
      _0x1a3b04.value = _0x497e3c.chatu8_fab_theme;
    }
  }
  console.log("[AI Config Helper] 悬浮球主题选择器已刷新");
}
function refreshInputFields(_0xfd9cf4, _0x1a41cc) {
  const _0x37a887 = {
    startTag: "startTag",
    endTag: "endTag",
    imageGenInterval: "imageGenInterval",
    sdUrl: "sdUrl",
    st_chatu8_sd_auth: "st_chatu8_sd_auth",
    AQT_sd: "fixedPrompt",
    fixedPrompt_end_sd: "fixedPrompt_end",
    UCP_sd: "negativePrompt",
    sd_cwidth: "sd_cwidth",
    sd_cheight: "sd_cheight",
    sd_csteps: "sd_csteps",
    sd_cseed: "sd_cseed",
    sdCfgScale: "sdCfgScale",
    sd_cclip_skip: "sd_cclip_skip",
    sd_chires_steps: "sd_chires_steps",
    sd_cupscale_factor: "sd_cupscale_factor",
    sd_cdenoising_strength: "sd_cdenoising_strength",
    novelaiApi: "novelaiApi",
    novelaiOtherSite: "novelaiOtherSite",
    cloudQueueUrl: "cloudQueueUrl",
    cloudQueueGreeting: "cloudQueueGreeting",
    AQT_novelai: "fixedPrompt_novelai",
    fixedPrompt_end_novelai: "fixedPrompt_end_novelai",
    UCP_novelai: "negativePrompt_novelai",
    nai3Scale: "nai3Scale",
    cfg_rescale: "cfg_rescale",
    novelai_width: "novelai_width",
    novelai_height: "novelai_height",
    novelai_steps: "novelai_steps",
    novelai_seed: "novelai_seed",
    InformationExtracted: "InformationExtracted",
    ReferenceStrength: "ReferenceStrength",
    comfyuiUrl: "comfyuiUrl",
    AQT_comfyui: "fixedPrompt_comfyui",
    fixedPrompt_end_comfyui: "fixedPrompt_end_comfyui",
    UCP_comfyui: "negativePrompt_comfyui",
    comfyui_width: "comfyui_width",
    comfyui_height: "comfyui_height",
    comfyui_steps: "comfyui_steps",
    comfyui_seed: "comfyui_seed",
    cfg_comfyui: "cfg_comfyui",
    c_fenwei: "c_fenwei",
    c_xijie: "c_xijie",
    c_quanzhong: "c_quanzhong",
    c_idquanzhong: "c_idquanzhong",
    inpaint_denoise: "inpaint_denoise",
    inpaint_positive_prompt: "inpaint_positive_prompt",
    inpaint_negative_prompt: "inpaint_negative_prompt",
    "banana.apiUrl": "st-chatu8-banana-api-url",
    "banana.apiKey": "st-chatu8-banana-api-key",
    translation_system_prompt: "translation_system_prompt",
    ai_temperature: "ch-llm_temperature_value",
    ai_top_p: "ch-llm_top_p_value",
    llm_history_depth: "ch-llm_history_depth_value",
    worldbook_content: "worldbook_content",
    defaultCharDemand: "ch-default-char-demand",
    defaultImageDemand: "ch-default-image-demand",
    vocabulary_search_limit: "vocabulary_search_limit",
    chatu8_fab_opacity: "chatu8_fab_opacity_value",
    chatu8_fab_size: "chatu8_fab_size_value",
    char_nameCN: "char_nameCN",
    char_nameEN: "char_nameEN",
    outfit_nameCN: "outfit_nameCN",
    outfit_nameEN: "outfit_nameEN"
  };
  const _0x1ccbe4 = {
    api_url: "ch-llm_api_url",
    api_key: "ch-llm_api_key",
    model: "ch-llm_model_input",
    temperature: "ch-llm_temperature_value",
    top_p: "ch-llm_top_p_value",
    max_tokens: "ch-llm_max_tokens_value"
  };
  let _0x219b91 = 0;
  for (const [_0x3ecb53, _0x47f6e9] of Object.entries(_0xfd9cf4)) {
    if (_0x37a887[_0x3ecb53]) {
      const _0x50a70c = _0x37a887[_0x3ecb53];
      const _0x2d9dd1 = document.getElementById(_0x50a70c);
      if (_0x2d9dd1) {
        if (document.activeElement !== _0x2d9dd1) {
          if (_0x2d9dd1.tagName === "TEXTAREA" || _0x2d9dd1.tagName === "INPUT") {
            _0x2d9dd1.value = _0x47f6e9 ?? "";
            _0x219b91++;
          }
        }
      }
    }
    if (_0x3ecb53 === "llm_profiles" && _0x1a41cc.current_llm_profile) {
      const _0x5ba26f = _0x1a41cc.llm_profiles[_0x1a41cc.current_llm_profile];
      if (_0x5ba26f) {
        for (const [_0x819558, _0x4fd933] of Object.entries(_0x1ccbe4)) {
          const _0x39dadf = document.getElementById(_0x4fd933);
          if (_0x39dadf && document.activeElement !== _0x39dadf) {
            const _0x12a25b = _0x5ba26f[_0x819558];
            if (_0x12a25b !== undefined) {
              _0x39dadf.value = _0x12a25b ?? "";
              _0x219b91++;
            }
          }
        }
      }
    }
    if (_0x3ecb53 === "banana" && typeof _0x47f6e9 === "object") {
      if (_0x47f6e9.apiUrl !== undefined) {
        const _0x1c254c = document.getElementById("st-chatu8-banana-api-url");
        if (_0x1c254c && document.activeElement !== _0x1c254c) {
          _0x1c254c.value = _0x47f6e9.apiUrl ?? "";
          _0x219b91++;
        }
      }
      if (_0x47f6e9.apiKey !== undefined) {
        const _0x35487b = document.getElementById("st-chatu8-banana-api-key");
        if (_0x35487b && document.activeElement !== _0x35487b) {
          _0x35487b.value = _0x47f6e9.apiKey ?? "";
          _0x219b91++;
        }
      }
    }
    if (_0x3ecb53 === "worldBookList" && _0x1a41cc.worldBookList_id) {
      const _0x17b8dc = _0x1a41cc.worldBookList[_0x1a41cc.worldBookList_id];
      if (_0x17b8dc !== undefined) {
        const _0x310971 = document.getElementById("worldbook_content");
        if (_0x310971 && document.activeElement !== _0x310971) {
          _0x310971.value = _0x17b8dc ?? "";
          _0x219b91++;
        }
      }
    }
    if (_0x3ecb53 === "prompt_replace" && _0x1a41cc.prompt_replace_id) {
      const _0xb86e8e = _0x1a41cc.prompt_replace[_0x1a41cc.prompt_replace_id];
      if (_0xb86e8e !== undefined) {
        const _0x43a3c3 = document.getElementById("prompt_replace_text");
        if (_0x43a3c3 && document.activeElement !== _0x43a3c3) {
          _0x43a3c3.value = _0xb86e8e ?? "";
          _0x219b91++;
        }
        const _0x2b35eb = document.getElementById("prompt_replace_text_novelai");
        if (_0x2b35eb && document.activeElement !== _0x2b35eb) {
          _0x2b35eb.value = _0xb86e8e ?? "";
          _0x219b91++;
        }
        const _0x168f52 = document.getElementById("prompt_replace_text_comfyui");
        if (_0x168f52 && document.activeElement !== _0x168f52) {
          _0x168f52.value = _0xb86e8e ?? "";
          _0x219b91++;
        }
      }
    }
    syncRangeInputs(_0x3ecb53, _0x47f6e9);
  }
  if (_0x219b91 > 0) {
    console.log("[AI Config Helper] 已刷新 " + _0x219b91 + " 个输入框");
  }
}
function syncRangeInputs(_0x5ab6d6, _0x383790) {
  const _0x4a23fe = {
    ai_temperature: {
      slider: "ch-llm_temperature",
      input: "ch-llm_temperature_value"
    },
    ai_top_p: {
      slider: "ch-llm_top_p",
      input: "ch-llm_top_p_value"
    },
    llm_history_depth: {
      slider: "ch-llm_history_depth",
      input: "ch-llm_history_depth_value"
    },
    InformationExtracted: {
      slider: "InformationExtracted_range",
      input: "InformationExtracted"
    },
    ReferenceStrength: {
      slider: "ReferenceStrength_range",
      input: "ReferenceStrength"
    },
    chatu8_fab_opacity: {
      slider: "chatu8_fab_opacity",
      input: "chatu8_fab_opacity_value"
    },
    chatu8_fab_size: {
      slider: "chatu8_fab_size",
      input: "chatu8_fab_size_value"
    }
  };
  if (_0x4a23fe[_0x5ab6d6]) {
    const {
      slider: _0x1ca4ea,
      input: _0xc89c87
    } = _0x4a23fe[_0x5ab6d6];
    const _0x19e29b = document.getElementById(_0x1ca4ea);
    const _0xefb681 = document.getElementById(_0xc89c87);
    if (_0x19e29b && document.activeElement !== _0x19e29b) {
      _0x19e29b.value = _0x383790 ?? "";
    }
    if (_0xefb681 && document.activeElement !== _0xefb681) {
      _0xefb681.value = _0x383790 ?? "";
    }
  }
  if (_0x5ab6d6 === "llm_profiles") {
    const _0x122259 = document.getElementById("ch-llm_max_tokens");
    const _0x2305d4 = document.getElementById("ch-llm_max_tokens_value");
    if (_0x122259 && _0x2305d4) {
      const _0xa757f = extension_settings[extensionName];
      const _0x31fdf5 = _0xa757f.llm_profiles?.[_0xa757f.current_llm_profile];
      if (_0x31fdf5?.max_tokens !== undefined) {
        if (document.activeElement !== _0x122259) {
          _0x122259.value = _0x31fdf5.max_tokens;
        }
        if (document.activeElement !== _0x2305d4) {
          _0x2305d4.value = _0x31fdf5.max_tokens;
        }
      }
    }
  }
}
export function getAiDiagnosticPackage(_0x52ac98 = 150) {
  const _0x5dd6b0 = getExposedSettings();
  let _0x1ff048 = "";
  try {
    _0x1ff048 = getLog() || "";
  } catch (_0x3f9d40) {
    _0x1ff048 = "无法获取日志: " + _0x3f9d40.message;
  }
  const _0x54e670 = _0x1ff048.split("\n");
  const _0x5e73d7 = _0x54e670.slice(Math.max(_0x54e670.length - _0x52ac98, 0)).join("\n");
  const _0x3866eb = "========== AI 诊断包裹 ==========\n请基于以下状态来进行诊断、逻辑排错或建议修改参数。\n\n【当前插件设置数据 (Settings/Config)】\n" + JSON.stringify(_0x5dd6b0, null, 2) + "\n\n【近期运行日志流 (Recent Logs)】\n" + _0x5e73d7 + "\n=================================";
  return _0x3866eb;
}
export function getDetailedConfigKeys() {
  const _0x5223a3 = extension_settings[extensionName];
  if (!_0x5223a3) {
    return [];
  }
  return Object.keys(_0x5223a3);
}
export function getSpecificConfigData(_0x1e893f) {
  const _0x15b71c = extension_settings[extensionName];
  if (!_0x15b71c || !(_0x1e893f in _0x15b71c)) {
    return "[获取失败] 所有的设置中不存在键名为: " + _0x1e893f + " 的数据。";
  }
  const _0x42e45b = _0x15b71c[_0x1e893f];
  if (typeof _0x42e45b === "object" && _0x42e45b !== null) {
    try {
      return JSON.stringify(_0x42e45b);
    } catch (_0x28e9b1) {
      return "[获取失败] 该数据无法转换为 JSON: " + _0x28e9b1.message;
    }
  }
  return String(_0x42e45b);
}
function resolveConfigPath(_0x372d08) {
  const _0xf9fc8 = extension_settings[extensionName];
  if (!_0xf9fc8) {
    return {
      target: null,
      error: "[错误] 插件配置尚未初始化。"
    };
  }
  if (!_0x372d08 || _0x372d08 === "") {
    const _0x3e12ab = {
      target: _0xf9fc8,
      error: null
    };
    return _0x3e12ab;
  }
  if (_0x372d08.startsWith("llm.")) {
    const _0x24a897 = _0xf9fc8.current_llm_profile || "默认";
    const _0x24a0b0 = _0x372d08.substring(4);
    if (_0x24a0b0 === "current_profile") {
      _0x372d08 = "current_llm_profile";
    } else if (_0x24a0b0.startsWith("request_types.")) {
      _0x372d08 = _0x24a0b0.replace("request_types.", "llm_request_type_configs.");
    } else {
      _0x372d08 = "llm_profiles." + _0x24a897 + "." + _0x24a0b0;
    }
  }
  const _0xe32548 = _0x372d08.split(".");
  let _0x10572c = _0xf9fc8;
  for (let _0x48ef23 = 0; _0x48ef23 < _0xe32548.length; _0x48ef23++) {
    const _0x28cd73 = _0xe32548[_0x48ef23];
    if (_0x10572c === null || _0x10572c === undefined || typeof _0x10572c !== "object") {
      return {
        target: null,
        error: "[错误] 路径 \"" + _0xe32548.slice(0, _0x48ef23).join(".") + "\" 不是对象，无法继续访问 \"" + _0x28cd73 + "\"。"
      };
    }
    if (!(_0x28cd73 in _0x10572c)) {
      return {
        target: null,
        error: "[错误] 在路径 \"" + (_0xe32548.slice(0, _0x48ef23).join(".") || "根") + "\" 下不存在键 \"" + _0x28cd73 + "\"。"
      };
    }
    _0x10572c = _0x10572c[_0x28cd73];
  }
  const _0x539fab = {
    target: _0x10572c,
    error: null
  };
  return _0x539fab;
}
function getValueSizeDesc(_0x5d85f8) {
  if (_0x5d85f8 === null || _0x5d85f8 === undefined) {
    return "空";
  }
  if (Array.isArray(_0x5d85f8)) {
    return _0x5d85f8.length + "项";
  }
  if (typeof _0x5d85f8 === "object") {
    return Object.keys(_0x5d85f8).length + "个子键";
  }
  const _0x51d38 = String(_0x5d85f8);
  return _0x51d38.length + "字符";
}
export function browseConfigPath(_0x5b1b28) {
  const _0x3594e7 = _0x5b1b28;
  const {
    target: _0x2d28c6,
    error: _0x2e7964
  } = resolveConfigPath(_0x5b1b28);
  if (_0x2e7964) {
    return _0x2e7964;
  }
  if (_0x2d28c6 === null || _0x2d28c6 === undefined || typeof _0x2d28c6 !== "object") {
    const _0x5cec6c = _0x2d28c6 === null ? "null" : typeof _0x2d28c6;
    const _0x3c4907 = String(_0x2d28c6);
    if (_0x3c4907.length > 2000) {
      return "路径 \"" + _0x3594e7 + "\" 是一个 " + _0x5cec6c + " 类型的叶子值 (" + _0x3c4907.length + "字符)，内容过长已截断。前 2000 字符预览:\n" + _0x3c4907.substring(0, 2000) + "\n... [已截断，请使用 read 指令查看完整内容]";
    }
    return "路径 \"" + _0x3594e7 + "\" 是一个 " + _0x5cec6c + " 类型的叶子值: " + _0x3c4907;
  }
  const _0x29fe8f = _0x3594e7 || "(根目录)";
  const _0x1db405 = Array.isArray(_0x2d28c6) ? _0x2d28c6.map((_0x1fc2fd, _0x18a612) => String(_0x18a612)) : Object.keys(_0x2d28c6);
  if (_0x1db405.length === 0) {
    return "路径 \"" + _0x29fe8f + "\" 是一个空的 " + (Array.isArray(_0x2d28c6) ? "数组" : "对象") + "。";
  }
  let _0xc8b363 = "📂 路径: " + _0x29fe8f + "  |  类型: " + (Array.isArray(_0x2d28c6) ? "数组" : "对象") + "  |  共 " + _0x1db405.length + " 项\n";
  _0xc8b363 += "─".repeat(50) + "\n";
  for (const _0x2dd05c of _0x1db405) {
    const _0xa5a55f = _0x2d28c6[_0x2dd05c];
    const _0x59c873 = _0xa5a55f === null ? "null" : Array.isArray(_0xa5a55f) ? "array" : typeof _0xa5a55f;
    const _0xc1526a = getValueSizeDesc(_0xa5a55f);
    const _0x191d02 = _0x3594e7 ? _0x3594e7 + "." + _0x2dd05c : _0x2dd05c;
    const _0x411694 = ConfigDescriptions[_0x2dd05c] || ConfigDescriptions[_0x191d02] || "";
    let _0x47547b = "";
    if (_0x59c873 === "string" || _0x59c873 === "number" || _0x59c873 === "boolean") {
      const _0x852e7b = String(_0xa5a55f);
      _0x47547b = _0x852e7b.length > 80 ? " = \"" + _0x852e7b.substring(0, 80) + "...\"" : " = \"" + _0x852e7b + "\"";
    }
    const _0x2b6c2f = _0x411694 ? "  // " + _0x411694 : "";
    _0xc8b363 += "  " + _0x2dd05c + "  [" + _0x59c873 + ", " + _0xc1526a + "]" + _0x47547b + _0x2b6c2f + "\n";
  }
  return _0xc8b363;
}
export function readConfigPath(_0x51d1dd) {
  if (!_0x51d1dd) {
    return "[错误] read 操作需要指定路径，不能为空。";
  }
  const _0x445443 = _0x51d1dd;
  const {
    target: _0x1fd2f7,
    error: _0x125ce8
  } = resolveConfigPath(_0x51d1dd);
  if (_0x125ce8) {
    return _0x125ce8;
  }
  if (_0x1fd2f7 === null || _0x1fd2f7 === undefined) {
    return "路径 \"" + _0x445443 + "\" 的值为: " + String(_0x1fd2f7);
  }
  if (typeof _0x1fd2f7 === "object") {
    try {
      const _0x2bfd62 = JSON.stringify(_0x1fd2f7, null, 2);
      if (_0x2bfd62.length > 30000) {
        return "路径 \"" + _0x445443 + "\" 的内容过大 (" + _0x2bfd62.length + "字符)，建议使用 browse 逐层查看。以下是前 15000 字符预览:\n" + _0x2bfd62.substring(0, 15000) + "\n... [已截断]";
      }
      return "路径 \"" + _0x445443 + "\" 的完整内容:\n" + _0x2bfd62;
    } catch (_0x3ea2cb) {
      return "[错误] 无法序列化: " + _0x3ea2cb.message;
    }
  }
  return "路径 \"" + _0x445443 + "\" 的值为: " + String(_0x1fd2f7);
}
export function writeConfigPath(_0x33bf89, _0x980a89) {
  if (!_0x33bf89) {
    return "[错误] write 操作需要指定路径。";
  }
  const _0x38a219 = extension_settings[extensionName];
  if (!_0x38a219) {
    return "[错误] 插件配置尚未初始化。";
  }
  const _0x8f99b0 = _0x33bf89.split(".");
  const _0xc8da35 = _0x8f99b0.pop();
  const _0x389d6a = _0x8f99b0.join(".");
  const {
    target: _0x2c66b7,
    error: _0x54c64e
  } = resolveConfigPath(_0x389d6a);
  if (_0x54c64e) {
    return _0x54c64e;
  }
  if (_0x2c66b7 === null || _0x2c66b7 === undefined || typeof _0x2c66b7 !== "object") {
    return "[错误] 父路径 \"" + (_0x389d6a || "根") + "\" 不是对象，无法写入键 \"" + _0xc8da35 + "\"。";
  }
  const _0xa3f2e3 = !(_0xc8da35 in _0x2c66b7);
  if (_0xa3f2e3 && !_0x389d6a) {
    return "❌ 写入失败：顶层配置项 \"" + _0xc8da35 + "\" 不存在。\n请勿猜测属性名！请先使用 browse 查看实际存在的配置项：\n<SystemQuery>{\"type\": \"browse\", \"path\": \"\"}</SystemQuery>";
  }
  if (_0xa3f2e3 && _0x389d6a) {
    const _0x52de5c = new Set(["llm_profiles", "test_context_profiles", "workers", "yushe", "prompt_replace", "vibePresets", "regex_profiles", "themes", "fabThemes", "worldBookList", "bananaCharacterPresets", "novelai_profiles", "comfyui_profiles", "jiuguanStorage", "banana.conversationPresets"]);
    let _0x5b5f1f = _0x389d6a;
    if (_0x389d6a.startsWith("llm.")) {
      const _0x35e5fe = _0x389d6a.substring(4);
      if (_0x35e5fe.startsWith("request_types.")) {
        _0x5b5f1f = _0x35e5fe.replace("request_types.", "llm_request_type_configs.");
      }
    }
    if (!_0x52de5c.has(_0x5b5f1f) && !_0x52de5c.has(_0x389d6a)) {
      const _0x1e7d36 = Object.keys(_0x2c66b7).join(", ");
      return "❌ 写入失败：路径 \"" + _0x33bf89 + "\" 中属性 \"" + _0xc8da35 + "\" 不存在。\n该对象已有的属性: [" + _0x1e7d36 + "]\n请检查属性名是否正确！不要猜测属性名，请先使用 browse 查看：\n<SystemQuery>{\"type\": \"browse\", \"path\": \"" + _0x389d6a + "\"}</SystemQuery>";
    }
  }
  const _0x515b68 = _0xa3f2e3 ? undefined : _0x2c66b7[_0xc8da35];
  _0x2c66b7[_0xc8da35] = _0x980a89;
  saveSettingsDebounced();
  const _0x4d7f1d = {
    [_0x33bf89]: _0x980a89
  };
  const _0x1d7287 = {
    changed: _0x4d7f1d
  };
  const _0x557721 = {
    detail: _0x1d7287
  };
  document.dispatchEvent(new CustomEvent("st-chatu8-config-updated", _0x557721));
  if (typeof window.loadSilterTavernChatu8Settings === "function") {
    try {
      window.loadSilterTavernChatu8Settings();
    } catch (_0x337c57) {
      console.warn("[AI Config Helper] 刷新设置页面失败:", _0x337c57);
    }
  }
  const _0x584d1e = _0x33bf89.startsWith("llm.") || _0x33bf89.startsWith("llm_profiles.") || _0x33bf89 === "current_llm_profile" || _0x33bf89.startsWith("request_types.") || _0x33bf89.startsWith("llm_request_type_configs.");
  if (_0x584d1e) {
    try {
      import("./settings/llm.js").then(_0x200927 => {
        if (_0x200927.loadLLMProfiles) {
          _0x200927.loadLLMProfiles();
          console.log("[AI Config Helper] 已刷新 LLM 配置显示");
        }
        if ((_0x33bf89.startsWith("request_types.") || _0x33bf89.startsWith("llm_request_type_configs.")) && _0x200927.populateRequestTypeSelects) {
          _0x200927.populateRequestTypeSelects();
          console.log("[AI Config Helper] 已刷新请求类型配置显示");
        }
      }).catch(_0x23175c => {
        console.warn("[AI Config Helper] 无法加载 LLM 模块刷新配置:", _0x23175c);
      });
    } catch (_0x1ac057) {
      console.warn("[AI Config Helper] 刷新 LLM 配置时出错:", _0x1ac057);
    }
  }
  if (_0x33bf89 === "generate_btn_style" || _0x33bf89 === "image_frame_style" || _0x33bf89 === "collapse_style") {
    try {
      import("./settings/theme.js").then(_0x54e9d9 => {
        const _0x8b5f88 = _0x38a219.themes?.[_0x38a219.theme_id] || {};
        const _0x338090 = _0x54e9d9.isThemeDark ? _0x54e9d9.isThemeDark(_0x8b5f88) : true;
        if (_0x33bf89 === "generate_btn_style" && _0x54e9d9.applyGenerateButtonStyle) {
          _0x54e9d9.applyGenerateButtonStyle(_0x980a89, _0x338090);
          console.log("[AI Config Helper] 已自动应用生成按钮样式:", _0x980a89);
        } else if (_0x33bf89 === "image_frame_style" && _0x54e9d9.applyImageFrameStyle) {
          _0x54e9d9.applyImageFrameStyle(_0x980a89, _0x338090);
          console.log("[AI Config Helper] 已自动应用图片边框样式:", _0x980a89);
        } else if (_0x33bf89 === "collapse_style" && _0x54e9d9.applyCollapseStyle) {
          _0x54e9d9.applyCollapseStyle(_0x980a89, _0x338090);
          console.log("[AI Config Helper] 已自动应用折叠样式:", _0x980a89);
        }
        const _0x4af54c = _0x33bf89 === "generate_btn_style" ? "theme_generate_btn_style" : _0x33bf89 === "image_frame_style" ? "theme_image_frame_style" : "theme_collapse_style";
        const _0x2c165b = document.getElementById(_0x4af54c);
        if (_0x2c165b) {
          _0x2c165b.value = _0x980a89;
          console.log("[AI Config Helper] 已更新下拉框显示:", _0x4af54c, "=", _0x980a89);
        }
      }).catch(_0x4086ac => {
        console.warn("[AI Config Helper] 无法加载主题模块应用样式:", _0x4086ac);
      });
    } catch (_0x43c0ff) {
      console.warn("[AI Config Helper] 应用样式时出错:", _0x43c0ff);
    }
  }
  const _0x5e5a9e = _0xa3f2e3 ? "(不存在)" : typeof _0x515b68 === "object" ? JSON.stringify(_0x515b68).substring(0, 100) : String(_0x515b68);
  const _0x4962ae = typeof _0x980a89 === "object" ? JSON.stringify(_0x980a89).substring(0, 100) : String(_0x980a89);
  const _0x251959 = _0xa3f2e3 ? "创建" : "修改";
  console.log("[AI Config Helper] 路径 [" + _0x33bf89 + "] 已" + _0x251959 + ": " + _0x5e5a9e + " → " + _0x4962ae);
  return "✅ 已成功" + _0x251959 + ": \"" + _0x33bf89 + "\"\n   旧值: " + _0x5e5a9e + "\n   新值: " + _0x4962ae;
}
export const UIActionRegistry = {
  switch_tab_main: {
    selector: ".st-chatu8-nav-link[data-tab=\"main\"]",
    desc: "切换到「主要设置」页 — 后端模式选择、开关、标记、缓存管理"
  },
  switch_tab_sd: {
    selector: ".st-chatu8-nav-link[data-tab=\"sd\"]",
    desc: "切换到「SD」设置页 — Stable Diffusion WebUI 的提示词、API地址、模型、生成参数"
  },
  switch_tab_novelai: {
    selector: ".st-chatu8-nav-link[data-tab=\"novelai\"]",
    desc: "切换到「NovelAI」设置页 — NAI API Key、模型、采样器、Vibe参考图等"
  },
  switch_tab_comfyui: {
    selector: ".st-chatu8-nav-link[data-tab=\"comfyui\"]",
    desc: "切换到「ComfyUI」设置页 — ComfyUI API地址、工作流、模型、采样器、生成参数"
  },
  switch_tab_banana: {
    selector: ".st-chatu8-nav-link[data-tab=\"banana\"]",
    desc: "切换到「Banana/grok」设置页 — Banana API配置、模型、多轮对话预设"
  },
  switch_tab_llm: {
    selector: ".st-chatu8-nav-link[data-tab=\"llm\"]",
    desc: "切换到「LLM」设置页 — 大语言模型API配置、上下文预设、请求类型分配"
  },
  switch_tab_vocabulary: {
    selector: ".st-chatu8-nav-link[data-tab=\"vocabulary\"]",
    desc: "切换到「词库」设置页 — 自动完成词库搜索设置"
  },
  switch_tab_character: {
    selector: ".st-chatu8-nav-link[data-tab=\"character\"]",
    desc: "切换到「角色管理」设置页 — 角色设计和服装管理"
  },
  switch_tab_theme: {
    selector: ".st-chatu8-nav-link[data-tab=\"theme\"]",
    desc: "切换到「主题设置」页 — UI外观主题切换"
  },
  switch_tab_fab: {
    selector: ".st-chatu8-nav-link[data-tab=\"fab\"]",
    desc: "切换到「悬浮球」设置页 — 快捷操作浮动按钮的外观和行为"
  },
  switch_tab_image_cache: {
    selector: ".st-chatu8-nav-link[data-tab=\"image-cache\"]",
    desc: "切换到「图片缓存」设置页 — 图片缓存查看和管理"
  },
  switch_tab_regex: {
    selector: ".st-chatu8-nav-link[data-tab=\"regex\"]",
    desc: "切换到「正则」设置页 — 正则表达式替换规则管理"
  },
  switch_tab_about: {
    selector: ".st-chatu8-nav-link[data-tab=\"about\"]",
    desc: "切换到「关于」页 — 版本信息、更新检查"
  },
  switch_tab_log: {
    selector: ".st-chatu8-nav-link[data-tab=\"log\"]",
    desc: "切换到「日志」页 — 运行日志查看"
  },
  switch_tab_send_data: {
    selector: ".st-chatu8-nav-link[data-tab=\"send_data\"]",
    desc: "切换到「发送数据」页 — 查看最近发送的请求数据"
  },
  connect_sd: {
    selector: "#testSd",
    desc: "连接 SD WebUI 并刷新模型/采样器数据（需先切到SD页面）"
  },
  connect_comfyui: {
    selector: "#testComfyui",
    desc: "连接 ComfyUI 并刷新模型/采样器数据（需先切到ComfyUI页面）"
  },
  llm_fetch_models: {
    selector: "#ch-llm_fetch_models_button",
    desc: "连接 LLM API 并获取可用模型列表（需先切到LLM页面）"
  },
  ai_fetch_models: {
    selector: "#chatu8-ai-fetch-models",
    desc: "获取智绘姬 AI 助手可用模型列表"
  },
  banana_fetch_models: {
    selector: "#st-chatu8-banana-fetch-models",
    desc: "获取 Banana 可用图像模型列表（需先切到Banana页面）"
  },
  llm_save_profile: {
    selector: "#ch-save_llm_profile_button",
    desc: "保存当前 LLM 配置预设"
  },
  ai_save_settings: {
    selector: "#st-chatu8-ai-save-settings",
    desc: "保存智绘姬 AI 助手配置"
  },
  ai_test_connection: {
    selector: "#ai-test-connection",
    desc: "测试 AI 核心设置页面的 API 连接"
  },
  llm_test_request: {
    selector: "#ch-llm_test_button",
    desc: "发送 LLM 测试请求"
  },
  clear_image_cache: {
    selector: "#Clear-Cache",
    desc: "清除图片缓存（需先切到主要设置页面,并选择缓存清除范围）"
  },
  sync_server_images: {
    selector: "#sync-server-images-btn",
    desc: "同步服务器图片到本地缓存"
  },
  migrate_database: {
    selector: "#migrate-database-btn",
    desc: "执行数据库迁移"
  },
  regex_test_run: {
    selector: "#ch-test-regex-button",
    desc: "执行正则测试 —— 应用当前配置的正则并测试（需先切到正则页面）"
  },
  regex_add_entry: {
    selector: "#ch-add-regex-entry-button",
    desc: "新建一个正则条目（需先切到正则页面）"
  },
  regex_save_profile: {
    selector: "#ch-save-regex-profile-button",
    desc: "保存当前正则配置（需先切到正则页面）"
  },
  export_log: {
    selector: "#ch-export-log",
    desc: "导出运行日志到文件（需先切到日志页面）"
  },
  clear_log: {
    selector: "#ch-clear-log",
    desc: "清空所有运行日志（需先切到日志页面）"
  },
  download_debug_log: {
    selector: "#ch-download-debug-log",
    desc: "下载调试日志到文件（需先切到日志页面）"
  },
  clear_debug_log: {
    selector: "#ch-clear-debug-log",
    desc: "清空调试日志（需先切到日志页面）"
  },
  export_settings: {
    selector: "#ch-export-settings",
    desc: "导出当前所有插件设置到文件"
  },
  import_settings: {
    selector: "#ch-import-settings",
    desc: "从文件导入插件设置"
  },
  restore_settings: {
    selector: "#ch-restore-settings",
    desc: "重置所有插件设置为默认值（⚠️慎用）"
  }
};
export function executeUIAction(_0x5bdb) {
  if (!_0x5bdb) {
    return "❌ 未指定操作名称。";
  }
  const _0x4833b4 = UIActionRegistry[_0x5bdb];
  if (!_0x4833b4) {
    const _0x4ced93 = Object.keys(UIActionRegistry).join(", ");
    return "❌ 未知操作: \"" + _0x5bdb + "\"。可用: " + _0x4ced93;
  }
  try {
    const _0x1f4b0e = $(_0x4833b4.selector);
    if (!_0x1f4b0e.length) {
      return "❌ 未找到元素 (" + _0x4833b4.desc + ")，请先切换到对应标签页。";
    }
    _0x1f4b0e.click();
    console.log("[AI Config] UI操作: " + _0x5bdb + " → " + _0x4833b4.desc);
    return "✅ 已执行: " + _0x4833b4.desc;
  } catch (_0x3aa636) {
    return "❌ 执行失败: " + _0x3aa636.message;
  }
}
export function getCurrentUIContext() {
  const _0x15dc74 = {
    main: "主要设置",
    sd: "SD",
    novelai: "NovelAI",
    comfyui: "ComfyUI",
    banana: "Banana/grok",
    llm: "LLM设置",
    vocabulary: "词库",
    character: "角色管理",
    theme: "主题设置",
    fab: "悬浮球",
    "image-cache": "图片缓存",
    regex: "正则",
    about: "关于",
    log: "日志",
    send_data: "发送数据"
  };
  const _0x412138 = $(".st-chatu8-nav-link.active").data("tab") || "未知";
  const _0x22c0e7 = _0x15dc74[_0x412138] || _0x412138;
  const _0x22e4be = $("#ch-settings-modal").is(":visible");
  let _0x477d91 = "当前标签页: " + _0x22c0e7 + " (" + _0x412138 + ")";
  _0x477d91 += "\n设置面板: " + (_0x22e4be ? "已打开" : "未打开");
  const _0x549d6b = Object.entries(UIActionRegistry).map(([_0x482cd5, _0x38e51e]) => "  - " + _0x482cd5 + ": " + _0x38e51e.desc).join("\n");
  _0x477d91 += "\n\n可用的按钮操作:\n" + _0x549d6b;
  return _0x477d91;
}
export const ConfigOptions = {
  mode: {
    desc: "图像生成后端",
    options: ["comfyui", "novelai", "sd", "banana"]
  },
  novelaimode: {
    desc: "NovelAI 模型版本",
    options: ["nai-diffusion-4-5-full", "nai-diffusion-4-5-curated", "nai-diffusion-3", "nai-diffusion-furry-3"]
  },
  novelai_sampler: {
    desc: "NovelAI 采样器",
    options: ["k_euler", "k_euler_ancestral", "k_dpmpp_2s_ancestral", "k_dpmpp_2m", "k_dpmpp_sde", "ddim_v3"]
  },
  Schedule: {
    desc: "NovelAI 调度器",
    options: ["native", "karras", "exponential", "polyexponential"]
  },
  imageAlignment: {
    desc: "图片对齐方式",
    options: ["left", "center", "right"]
  },
  displayMode: {
    desc: "图片显示模式",
    options: ["默认", "大图", "缩略图"]
  }
};
export function checkRequiredConfigs() {
  const _0x49e4c4 = extension_settings[extensionName];
  if (!_0x49e4c4) {
    return "❌ 插件配置尚未初始化。";
  }
  const _0x3c98fc = [];
  const _0x3710f9 = _0x49e4c4.mode || "comfyui";
  _0x3c98fc.push({
    name: "生图后端 (mode)",
    ok: ["comfyui", "novelai", "sd", "banana"].includes(_0x3710f9),
    value: _0x3710f9
  });
  _0x3c98fc.push({
    name: "插件已启用 (scriptEnabled)",
    ok: _0x49e4c4.scriptEnabled === true || _0x49e4c4.scriptEnabled === "true",
    value: String(_0x49e4c4.scriptEnabled)
  });
  if (_0x3710f9 === "comfyui") {
    _0x3c98fc.push({
      name: "ComfyUI 地址",
      ok: !!_0x49e4c4.comfyuiUrl && _0x49e4c4.comfyuiUrl !== "",
      value: _0x49e4c4.comfyuiUrl || "(未填)"
    });
  } else if (_0x3710f9 === "sd") {
    _0x3c98fc.push({
      name: "SD WebUI 地址",
      ok: !!_0x49e4c4.sdUrl && _0x49e4c4.sdUrl !== "",
      value: _0x49e4c4.sdUrl || "(未填)"
    });
  } else if (_0x3710f9 === "novelai") {
    _0x3c98fc.push({
      name: "NovelAI API Key",
      ok: !!_0x49e4c4.novelaiApi && _0x49e4c4.novelaiApi !== "000000",
      value: _0x49e4c4.novelaiApi ? "(已配置)" : "(未填)"
    });
  } else if (_0x3710f9 === "banana") {
    const _0x77ef67 = _0x49e4c4.banana || {};
    const _0x2d4c51 = {
      name: "Banana API 地址",
      ok: !!_0x77ef67.apiUrl,
      value: _0x77ef67.apiUrl || "(未填)"
    };
    _0x3c98fc.push(_0x2d4c51);
    _0x3c98fc.push({
      name: "Banana API Key",
      ok: !!_0x77ef67.apiKey && _0x77ef67.apiKey !== "123456",
      value: _0x77ef67.apiKey ? "(已配置)" : "(未填)"
    });
  }
  const _0x3b75d5 = _0x49e4c4.llm_profiles?.[_0x49e4c4.current_llm_profile || "默认"];
  if (_0x3b75d5) {
    const _0x1e6e9e = {
      name: "LLM API 地址",
      ok: !!_0x3b75d5.api_url,
      value: _0x3b75d5.api_url || "(未填)"
    };
    _0x3c98fc.push(_0x1e6e9e);
    const _0x2b6d31 = {
      name: "LLM API Key",
      ok: !!_0x3b75d5.api_key,
      value: _0x3b75d5.api_key ? "(已配置)" : "(未填)"
    };
    _0x3c98fc.push(_0x2b6d31);
    const _0x1eb817 = {
      name: "LLM 模型",
      ok: !!_0x3b75d5.model,
      value: _0x3b75d5.model || "(未选择)"
    };
    _0x3c98fc.push(_0x1eb817);
  }
  let _0x48002c = "📋 必要配置检查报告:\n";
  for (const _0x3c55a3 of _0x3c98fc) {
    const _0x1ebdc9 = _0x3c55a3.ok ? "✅" : "❌";
    _0x48002c += _0x1ebdc9 + " " + _0x3c55a3.name + ": " + _0x3c55a3.value + "\n";
  }
  const _0x15c0b7 = _0x3c98fc.every(_0x37ac4a => _0x37ac4a.ok);
  if (_0x15c0b7) {
    _0x48002c += "\n🎉 所有必要配置已完成！";
  } else {
    const _0x43ae86 = _0x3c98fc.filter(_0x3cb72d => !_0x3cb72d.ok).map(_0x421953 => _0x421953.name).join(", ");
    _0x48002c += "\n⚠️ 仍需配置: " + _0x43ae86;
  }
  return _0x48002c;
}
export const ProjectDescription = "\n【项目名称】st-chatu8 (智绘姬)\n【项目类型】SillyTavern (酒馆) 第三方扩展插件\n【核心功能】在 SillyTavern 聊天过程中自动/手动生成图片（AI绘图）\n\n【支持的图像生成后端 (mode)】\n1. ComfyUI — 本地部署的节点式AI绘图工具，支持自定义工作流，功能最强大\n   - 需要配置: comfyuiUrl（ComfyUI服务地址，默认 http://localhost:8188）\n   - 需要连接后选择: 模型(MODEL_NAME)、采样器、VAE、调度器\n   - 需要配置工作流预设(workerid)\n2. NovelAI (NAI) — 在线AI绘图服务，需要付费API Key\n   - 需要配置: novelaiApi（API Key）\n   - 可选模型: nai-diffusion-4-5-full / nai-diffusion-4-5-curated 等\n3. Stable Diffusion WebUI (SD/A1111) — 本地部署的SD界面\n   - 需要配置: sdUrl（SD WebUI地址，默认 http://localhost:7860）\n   - 需要连接后选择: 模型、采样器\n4. Banana/grok — 基于 Gemini 等模型的图像生成\n   - 需要配置: banana.apiUrl, banana.apiKey, banana.model\n\n【LLM (大语言模型) 功能】\n- 用于将聊天文本自动翻译成绘图提示词(prompt)\n- 支持多个 LLM 配置预设(llm_profiles)，可以配置不同的API端点\n- 每个配置包含: api_url, api_key, model, temperature, top_p, max_tokens 等\n- 支持多种请求类型: 正文图片生成、角色设计、服装展示、翻译、Tag修改\n\n【设置面板标签页 → 关键控件映射】\n- 主要设置(main): scriptEnabled(开关), mode(后端选择), startTag/endTag(触发标记), imageAlignment(图片对齐), autoLLMImageGen(自动LLM生图), enablePregen(流式预生成)\n- SD(sd): sdUrl(API地址), testSd按钮(连接), sd_cchatu_8_model(模型), sd_cchatu_8_samplerName(采样器), sd_cwidth/cheight/csteps/cseed(尺寸步数种子), sdCfgScale(CFG)\n- NovelAI(novelai): novelaiApi(API Key), novelaimode(模型版本), novelai_sampler(采样器), Schedule(噪点表), nai3Scale(引导比例), novelai_width/height/steps/seed, nai3VibeTransfer(Vibe参考)\n- ComfyUI(comfyui): comfyuiUrl(API地址), testComfyui按钮(连接), MODEL_NAME(模型), comfyuisamplerName(采样器), comfyui_vae(VAE), workerid(工作流预设), comfyui_width/height/steps/seed, cfg_comfyui(CFG)\n- Banana(banana): banana.apiUrl(API地址), banana.apiKey(密钥), banana.model(模型)\n- LLM(llm): llm_profiles(配置预设集合), current_llm_profile(当前预设), 每个预设含api_url/api_key/model/temperature/top_p/max_tokens\n\n【新手配置引导流程（按优先级）】\n1. 先在「主要设置」将 scriptEnabled 开启，选择 mode（后端）\n2. 切到对应后端页面(SD/NovelAI/ComfyUI/Banana)，填写 API 地址或密钥\n3. 点击连接按钮获取模型列表，选择模型和采样器\n4. 切到「LLM」页面配置大语言模型（用于翻译提示词），填写 api_url、api_key、model\n5. 保存配置，测试生图\n\n【关键配置路径示例】\n- mode: 当前后端模式\n- scriptEnabled: 插件是否启用\n- comfyuiUrl / sdUrl: 后端地址\n- llm_profiles.默认.api_url: LLM API地址\n- llm_profiles.默认.api_key: LLM API密钥\n- llm_profiles.默认.model: LLM 模型名称\n- workers: ComfyUI工作流预设集合\n- yushe: 提示词预设集合\n".trim();
export function getRegexStatus() {
  if (!window.regexAIBridge) {
    return "❌ 正则模块尚未加载，请先切换到正则页面。";
  }
  try {
    const _0x2c0b3f = window.regexAIBridge.getStatus();
    let _0x5294e5 = "📋 正则测试区域状态:\n";
    _0x5294e5 += "- 测试模式: " + (_0x2c0b3f.testMode ? "✅ 已开启" : "❌ 未开启") + "\n";
    _0x5294e5 += "- 当前配置: " + (_0x2c0b3f.currentProfile || "(无)") + "\n";
    _0x5294e5 += "- 手势功能: " + (_0x2c0b3f.gestureEnabled ? "✅ 已开启" : "❌ 未开启") + "\n";
    _0x5294e5 += "- 点击触发: " + (_0x2c0b3f.clickTriggerEnabled ? "✅ 已开启" : "❌ 未开启") + "\n";
    _0x5294e5 += "- 前后正则: " + _0x2c0b3f.beforeAfterRegex + "\n";
    _0x5294e5 += "- 文字正则: " + _0x2c0b3f.textRegex + "\n";
    _0x5294e5 += "- 原文: " + _0x2c0b3f.originalText + "\n";
    _0x5294e5 += "- 正则后文本: " + _0x2c0b3f.resultText + "\n";
    _0x5294e5 += "- 正则条目 (" + _0x2c0b3f.entryCount + "个):\n";
    if (_0x2c0b3f.regexEntries.length > 0) {
      _0x2c0b3f.regexEntries.forEach(_0x3d4aa4 => {
        const _0x4acf3f = _0x3d4aa4.disabled ? "[禁用]" : "[启用]";
        _0x5294e5 += "  " + _0x3d4aa4.index + ". " + _0x4acf3f + " " + _0x3d4aa4.name + " | 查找: " + _0x3d4aa4.findRegex + " | 替换: " + _0x3d4aa4.replaceString + "\n";
      });
    } else {
      _0x5294e5 += "  (暂无条目)\n";
    }
    return _0x5294e5;
  } catch (_0x4db8d9) {
    return "❌ 获取正则状态失败: " + _0x4db8d9.message;
  }
}
export function setRegexOriginalText(_0x58d41e) {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.setOriginalText(_0x58d41e);
}
export function setRegexEditors(_0x3d5c9c, _0x5a3940) {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.setEditors(_0x3d5c9c, _0x5a3940);
}
export function createRegexEntry(_0x53e575) {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.createEntry(_0x53e575);
}
export async function triggerRegexTest() {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return await window.regexAIBridge.triggerTest();
}
export function setRegexTestMode(_0x58f7be) {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.setTestMode(_0x58f7be);
}
export function getRegexResultText() {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.getResultText();
}
export function setGestureEnabled(_0x482df8) {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.setGestureEnabled(_0x482df8);
}
export function setClickTriggerEnabled(_0x1c6764) {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.setClickTriggerEnabled(_0x1c6764);
}
export function clearAllRegexEntries() {
  if (!window.regexAIBridge) {
    return "❌ 正则模块未加载。";
  }
  return window.regexAIBridge.clearAllEntries();
}
export function getWorkflowList() {
  const _0x5afe6f = extension_settings[extensionName];
  if (!_0x5afe6f || !_0x5afe6f.workers) {
    return "❌ 未找到工作流数据。";
  }
  const _0x24992d = Object.keys(_0x5afe6f.workers);
  const _0x4be4c3 = _0x5afe6f.workerid || "(未选择)";
  let _0x39780c = "📂 工作流预设列表 (共 " + _0x24992d.length + " 个)：\n";
  _0x39780c += "当前使用: " + _0x4be4c3 + "\n";
  _0x39780c += "─".repeat(40) + "\n";
  for (const _0x5ea856 of _0x24992d) {
    const _0x54d18d = _0x5ea856 === _0x4be4c3 ? " ← 当前" : "";
    const _0x2f9208 = _0x5afe6f.workers[_0x5ea856] || "";
    const _0x27b41f = _0x2f9208.length;
    _0x39780c += "  - " + _0x5ea856 + " (" + _0x27b41f + "字符)" + _0x54d18d + "\n";
  }
  return _0x39780c;
}
export function readWorkflow(_0x1b056a) {
  const _0x2655b8 = extension_settings[extensionName];
  if (!_0x2655b8 || !_0x2655b8.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0x1b056a) {
    return "❌ 请指定工作流名称。";
  }
  if (!(_0x1b056a in _0x2655b8.workers)) {
    const _0x52cd55 = Object.keys(_0x2655b8.workers).join(", ");
    return "❌ 工作流 \"" + _0x1b056a + "\" 不存在。可用: " + _0x52cd55;
  }
  const _0x28ceac = _0x2655b8.workers[_0x1b056a];
  if (!_0x28ceac) {
    return "工作流 \"" + _0x1b056a + "\" 内容为空。";
  }
  return "📄 工作流 \"" + _0x1b056a + "\" 的完整内容 (" + _0x28ceac.length + "字符)：\n" + _0x28ceac;
}
export function scanWorkflowVariables(_0x15e0c4) {
  const _0x20ee1a = extension_settings[extensionName];
  if (!_0x20ee1a || !_0x20ee1a.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0x15e0c4) {
    return "❌ 请指定工作流名称。";
  }
  if (!(_0x15e0c4 in _0x20ee1a.workers)) {
    const _0x208d42 = Object.keys(_0x20ee1a.workers).join(", ");
    return "❌ 工作流 \"" + _0x15e0c4 + "\" 不存在。可用: " + _0x208d42;
  }
  const _0x6f1e6a = _0x20ee1a.workers[_0x15e0c4];
  if (!_0x6f1e6a) {
    return "工作流 \"" + _0x15e0c4 + "\" 内容为空，无变量。";
  }
  const _0xf37f6c = /"%([^%"]+)%"/g;
  const _0x4bb619 = new Map();
  let _0x4da110;
  while ((_0x4da110 = _0xf37f6c.exec(_0x6f1e6a)) !== null) {
    const _0x5ab866 = _0x4da110[1];
    if (!_0x4bb619.has(_0x5ab866)) {
      _0x4bb619.set(_0x5ab866, 0);
    }
    _0x4bb619.set(_0x5ab866, _0x4bb619.get(_0x5ab866) + 1);
  }
  if (_0x4bb619.size === 0) {
    return "工作流 \"" + _0x15e0c4 + "\" 中未发现 %xxx% 格式的变量占位符。";
  }
  const _0x668152 = {
    seed: "随机种子 (数值)",
    steps: "采样步数 (数值)",
    cfg_scale: "CFG引导比例 (数值)",
    width: "图片宽度 (数值)",
    height: "图片高度 (数值)",
    prompt: "正面提示词 (字符串)",
    negative_prompt: "负面提示词 (字符串)",
    sampler_name: "采样器 (字符串)",
    MODEL_NAME: "模型名称 (字符串)",
    c_quanzhong: "权重 (数值)",
    c_idquanzhong: "ID权重 (数值)",
    c_xijie: "细节 (数值)",
    c_fenwei: "氛围 (数值)",
    comfyuicankaotupian: "参考图片 (字符串)",
    ipa: "IP-Adapter (字符串)",
    scheduler: "调度器 (字符串)",
    vae: "VAE模型 (字符串)",
    clip: "CLIP模型 (字符串)",
    inpaint_image: "重绘原图 (字符串)",
    inpaint_mask: "重绘蒙版 (字符串)",
    inpaint_denoise: "重绘幅度 (数值)",
    inpaint_positive: "重绘正面词 (字符串)",
    inpaint_negative: "重绘负面词 (字符串)"
  };
  let _0x33fbc2 = "🔍 工作流 \"" + _0x15e0c4 + "\" 中的变量占位符 (共 " + _0x4bb619.size + " 种)：\n";
  _0x33fbc2 += "─".repeat(50) + "\n";
  for (const [_0x5b3908, _0x4431d6] of _0x4bb619) {
    const _0x3fb156 = _0x668152[_0x5b3908] || "(自定义变量)";
    _0x33fbc2 += "  %" + _0x5b3908 + "% — " + _0x3fb156 + "  (出现 " + _0x4431d6 + " 次)\n";
  }
  return _0x33fbc2;
}
export function replaceWorkflowVariable(_0xd5887, _0x5db60c, _0x57ad5a) {
  const _0x53ae8f = extension_settings[extensionName];
  if (!_0x53ae8f || !_0x53ae8f.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0xd5887) {
    return "❌ 请指定工作流名称。";
  }
  if (!_0x5db60c) {
    return "❌ 请指定变量名。";
  }
  if (!(_0xd5887 in _0x53ae8f.workers)) {
    return "❌ 工作流 \"" + _0xd5887 + "\" 不存在。";
  }
  let _0x42f197 = _0x53ae8f.workers[_0xd5887];
  if (!_0x42f197) {
    return "❌ 工作流 \"" + _0xd5887 + "\" 内容为空。";
  }
  const _0x44ba94 = _0x5db60c.replace(/%/g, "");
  const _0x278f48 = "\"%" + _0x44ba94 + "%\"";
  if (!_0x42f197.includes(_0x278f48)) {
    return "❌ 工作流 \"" + _0xd5887 + "\" 中未找到变量 " + _0x278f48 + "。请先用 workflow_variables 确认。";
  }
  let _0x207917;
  if (typeof _0x57ad5a === "number" || !isNaN(Number(_0x57ad5a))) {
    _0x207917 = String(Number(_0x57ad5a));
  } else {
    _0x207917 = "\"" + String(_0x57ad5a).replace(/"/g, "\\\"") + "\"";
  }
  const _0x354896 = (_0x42f197.match(new RegExp(_0x278f48.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  _0x42f197 = _0x42f197.replaceAll(_0x278f48, _0x207917);
  _0x53ae8f.workers[_0xd5887] = _0x42f197;
  if (_0x53ae8f.workerid === _0xd5887) {
    _0x53ae8f.worker = _0x42f197;
  }
  saveSettingsDebounced();
  return "✅ 已在工作流 \"" + _0xd5887 + "\" 中替换 " + _0x278f48 + " → " + _0x207917 + " (" + _0x354896 + " 处)";
}
export function saveWorkflow(_0xdba169, _0x3e9c4d) {
  const _0x11ce78 = extension_settings[extensionName];
  if (!_0x11ce78) {
    return "❌ 插件配置尚未初始化。";
  }
  if (!_0xdba169) {
    return "❌ 请指定工作流名称。";
  }
  if (!_0x3e9c4d) {
    return "❌ 请提供工作流内容。";
  }
  try {
    JSON.parse(_0x3e9c4d);
  } catch (_0x1e2178) {
    return "❌ 工作流内容不是合法的 JSON: " + _0x1e2178.message;
  }
  if (!_0x11ce78.workers) {
    _0x11ce78.workers = {};
  }
  const _0x415b9e = !(_0xdba169 in _0x11ce78.workers);
  _0x11ce78.workers[_0xdba169] = _0x3e9c4d;
  if (_0x11ce78.workerid === _0xdba169) {
    _0x11ce78.worker = _0x3e9c4d;
  }
  saveSettingsDebounced();
  refreshWorkflowSelectors(_0x11ce78);
  return "✅ 工作流 \"" + _0xdba169 + "\" 已" + (_0x415b9e ? "创建" : "保存") + " (" + _0x3e9c4d.length + "字符)";
}
export function listWorkflowNodes(_0x49c9fc) {
  const _0x584687 = extension_settings[extensionName];
  if (!_0x584687 || !_0x584687.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0x49c9fc) {
    return "❌ 请指定工作流名称。";
  }
  if (!(_0x49c9fc in _0x584687.workers)) {
    const _0x1cf80c = Object.keys(_0x584687.workers).join(", ");
    return "❌ 工作流 \"" + _0x49c9fc + "\" 不存在。可用: " + _0x1cf80c;
  }
  const _0x58c655 = _0x584687.workers[_0x49c9fc];
  if (!_0x58c655) {
    return "工作流 \"" + _0x49c9fc + "\" 内容为空。";
  }
  let _0x3dd87a;
  try {
    _0x3dd87a = JSON.parse(_0x58c655);
  } catch (_0xcd0d82) {
    return "❌ 工作流 \"" + _0x49c9fc + "\" JSON 解析失败: " + _0xcd0d82.message;
  }
  if (!_0x3dd87a || typeof _0x3dd87a !== "object") {
    return "❌ 工作流 \"" + _0x49c9fc + "\" 格式不正确。";
  }
  const _0x2117bc = Object.keys(_0x3dd87a).sort((_0x1cee0d, _0x3ebeeb) => Number(_0x1cee0d) - Number(_0x3ebeeb));
  if (_0x2117bc.length === 0) {
    return "工作流 \"" + _0x49c9fc + "\" 中没有节点。";
  }
  let _0x55bd4e = "📋 工作流 \"" + _0x49c9fc + "\" 的节点列表 (共 " + _0x2117bc.length + " 个节点)：\n";
  _0x55bd4e += "─".repeat(60) + "\n";
  for (const _0x35a0ad of _0x2117bc) {
    const _0x38486b = _0x3dd87a[_0x35a0ad];
    const _0x191d67 = _0x38486b.class_type || "(未知类型)";
    const _0x450a32 = _0x38486b._meta?.title || _0x191d67;
    _0x55bd4e += "  [" + _0x35a0ad + "] " + _0x450a32 + " (" + _0x191d67 + ")\n";
  }
  return _0x55bd4e;
}
export function readWorkflowNode(_0x56ea8f, _0x4a4b63) {
  const _0x8a74da = extension_settings[extensionName];
  if (!_0x8a74da || !_0x8a74da.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0x56ea8f) {
    return "❌ 请指定工作流名称。";
  }
  if (!_0x4a4b63) {
    return "❌ 请指定节点ID。";
  }
  if (!(_0x56ea8f in _0x8a74da.workers)) {
    return "❌ 工作流 \"" + _0x56ea8f + "\" 不存在。";
  }
  const _0x5b1fcf = _0x8a74da.workers[_0x56ea8f];
  if (!_0x5b1fcf) {
    return "❌ 工作流 \"" + _0x56ea8f + "\" 内容为空。";
  }
  let _0x22a920;
  try {
    _0x22a920 = JSON.parse(_0x5b1fcf);
  } catch (_0xa486c5) {
    return "❌ 工作流 \"" + _0x56ea8f + "\" JSON 解析失败: " + _0xa486c5.message;
  }
  if (!(_0x4a4b63 in _0x22a920)) {
    const _0x51186f = Object.keys(_0x22a920).sort((_0x4fa0fd, _0x1b7c7d) => Number(_0x4fa0fd) - Number(_0x1b7c7d)).join(", ");
    return "❌ 节点 \"" + _0x4a4b63 + "\" 不存在。可用节点: " + _0x51186f;
  }
  const _0x370885 = _0x22a920[_0x4a4b63];
  const _0x26b663 = _0x370885._meta?.title || _0x370885.class_type || "(未命名)";
  let _0x4ad317 = "🔍 节点 [" + _0x4a4b63 + "] " + _0x26b663 + " 的详细信息：\n";
  _0x4ad317 += "─".repeat(60) + "\n";
  _0x4ad317 += JSON.stringify(_0x370885, null, 2);
  return _0x4ad317;
}
export function updateWorkflowNodeInput(_0x14a752, _0x34b415, _0x5156f0, _0x2b478) {
  const _0x3ac507 = extension_settings[extensionName];
  if (!_0x3ac507 || !_0x3ac507.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0x14a752) {
    return "❌ 请指定工作流名称。";
  }
  if (!_0x34b415) {
    return "❌ 请指定节点ID。";
  }
  if (!_0x5156f0) {
    return "❌ 请指定输入参数键名。";
  }
  if (!(_0x14a752 in _0x3ac507.workers)) {
    return "❌ 工作流 \"" + _0x14a752 + "\" 不存在。";
  }
  const _0x12ae38 = _0x3ac507.workers[_0x14a752];
  if (!_0x12ae38) {
    return "❌ 工作流 \"" + _0x14a752 + "\" 内容为空。";
  }
  let _0x1a42b7;
  try {
    _0x1a42b7 = JSON.parse(_0x12ae38);
  } catch (_0x1ae912) {
    return "❌ 工作流 \"" + _0x14a752 + "\" JSON 解析失败: " + _0x1ae912.message;
  }
  if (!(_0x34b415 in _0x1a42b7)) {
    return "❌ 节点 \"" + _0x34b415 + "\" 不存在。";
  }
  const _0x226808 = _0x1a42b7[_0x34b415];
  if (!_0x226808.inputs) {
    _0x226808.inputs = {};
  }
  const _0x55c195 = Object.keys(_0x226808.inputs);
  const _0x100c70 = _0x226808.inputs[_0x5156f0];
  _0x226808.inputs[_0x5156f0] = _0x2b478;
  const _0x27aec2 = Object.keys(_0x226808.inputs);
  const _0x431fac = _0x55c195.filter(_0x1eb989 => !_0x27aec2.includes(_0x1eb989));
  const _0x2670a8 = JSON.stringify(_0x1a42b7);
  _0x3ac507.workers[_0x14a752] = _0x2670a8;
  if (_0x3ac507.workerid === _0x14a752) {
    _0x3ac507.worker = _0x2670a8;
  }
  saveSettingsDebounced();
  const _0x56e12b = _0x226808._meta?.title || _0x226808.class_type || "(未命名)";
  let _0x3e31c2 = "✅ 已修改节点 [" + _0x34b415 + "] " + _0x56e12b + " 的参数：\n  " + _0x5156f0 + ": " + JSON.stringify(_0x100c70) + " → " + JSON.stringify(_0x2b478);
  if (_0x431fac.length > 0) {
    _0x3e31c2 += "\n⚠️ 警告：以下字段在修改过程中丢失: " + _0x431fac.join(", ");
  }
  _0x3e31c2 += "\n📋 节点当前字段: " + _0x27aec2.join(", ");
  return _0x3e31c2;
}
export function batchUpdateWorkflowNodes(_0x24f568, _0x42073c) {
  const _0x18a199 = extension_settings[extensionName];
  if (!_0x18a199 || !_0x18a199.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0x24f568) {
    return "❌ 请指定工作流名称。";
  }
  if (!Array.isArray(_0x42073c) || _0x42073c.length === 0) {
    return "❌ 请提供有效的更新列表（数组格式）。";
  }
  if (!(_0x24f568 in _0x18a199.workers)) {
    return "❌ 工作流 \"" + _0x24f568 + "\" 不存在。";
  }
  const _0x1add1d = _0x18a199.workers[_0x24f568];
  if (!_0x1add1d) {
    return "❌ 工作流 \"" + _0x24f568 + "\" 内容为空。";
  }
  let _0x4e463f;
  try {
    _0x4e463f = JSON.parse(_0x1add1d);
  } catch (_0x5d82d1) {
    return "❌ 工作流 \"" + _0x24f568 + "\" JSON 解析失败: " + _0x5d82d1.message;
  }
  const _0x4cbea6 = [];
  let _0xd352f1 = 0;
  const _0x538e87 = [];
  for (const _0x358904 of _0x42073c) {
    const {
      nodeId: _0x38fa31,
      inputKey: _0x20a4e5,
      value: _0x303cfd
    } = _0x358904;
    if (!_0x38fa31 || !_0x20a4e5) {
      _0x4cbea6.push("⚠️ 跳过无效更新: " + JSON.stringify(_0x358904));
      continue;
    }
    if (!(_0x38fa31 in _0x4e463f)) {
      _0x4cbea6.push("❌ 节点 \"" + _0x38fa31 + "\" 不存在");
      continue;
    }
    const _0x255252 = _0x4e463f[_0x38fa31];
    if (!_0x255252.inputs) {
      _0x255252.inputs = {};
    }
    const _0x311d27 = Object.keys(_0x255252.inputs);
    const _0x566030 = _0x255252.inputs[_0x20a4e5];
    _0x255252.inputs[_0x20a4e5] = _0x303cfd;
    const _0x36fb30 = Object.keys(_0x255252.inputs);
    const _0x5c0ff3 = _0x311d27.filter(_0x7c7f4a => !_0x36fb30.includes(_0x7c7f4a));
    if (_0x5c0ff3.length > 0) {
      _0x538e87.push("⚠️ 节点 [" + _0x38fa31 + "] 丢失字段: " + _0x5c0ff3.join(", "));
    }
    const _0x560c25 = _0x255252._meta?.title || _0x255252.class_type || "(未命名)";
    _0x4cbea6.push("✅ [" + _0x38fa31 + "] " + _0x560c25 + "." + _0x20a4e5 + ": " + JSON.stringify(_0x566030) + " → " + JSON.stringify(_0x303cfd));
    _0xd352f1++;
  }
  const _0x202066 = JSON.stringify(_0x4e463f);
  _0x18a199.workers[_0x24f568] = _0x202066;
  if (_0x18a199.workerid === _0x24f568) {
    _0x18a199.worker = _0x202066;
  }
  saveSettingsDebounced();
  let _0x17407a = "📝 批量修改工作流 \"" + _0x24f568 + "\" (成功 " + _0xd352f1 + "/" + _0x42073c.length + ")：\n";
  _0x17407a += "─".repeat(60) + "\n";
  _0x17407a += _0x4cbea6.join("\n");
  if (_0x538e87.length > 0) {
    _0x17407a += "\n\n" + _0x538e87.join("\n");
  }
  return _0x17407a;
}
export function deleteWorkflowNode(_0xf554a1, _0x3c3824) {
  const _0x214008 = extension_settings[extensionName];
  if (!_0x214008 || !_0x214008.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0xf554a1) {
    return "❌ 请指定工作流名称。";
  }
  if (!_0x3c3824) {
    return "❌ 请指定节点ID。";
  }
  if (!(_0xf554a1 in _0x214008.workers)) {
    return "❌ 工作流 \"" + _0xf554a1 + "\" 不存在。";
  }
  const _0x307f4d = _0x214008.workers[_0xf554a1];
  if (!_0x307f4d) {
    return "❌ 工作流 \"" + _0xf554a1 + "\" 内容为空。";
  }
  let _0x2c8c0a;
  try {
    _0x2c8c0a = JSON.parse(_0x307f4d);
  } catch (_0x5ab7b6) {
    return "❌ 工作流 \"" + _0xf554a1 + "\" JSON 解析失败: " + _0x5ab7b6.message;
  }
  if (!(_0x3c3824 in _0x2c8c0a)) {
    return "❌ 节点 \"" + _0x3c3824 + "\" 不存在。";
  }
  const _0x41401d = _0x2c8c0a[_0x3c3824];
  const _0x1c85d9 = _0x41401d._meta?.title || _0x41401d.class_type || "(未命名)";
  delete _0x2c8c0a[_0x3c3824];
  const _0x547533 = JSON.stringify(_0x2c8c0a);
  _0x214008.workers[_0xf554a1] = _0x547533;
  if (_0x214008.workerid === _0xf554a1) {
    _0x214008.worker = _0x547533;
  }
  saveSettingsDebounced();
  return "✅ 已删除节点 [" + _0x3c3824 + "] " + _0x1c85d9;
}
export function addWorkflowNode(_0x27c688, _0x5b24ee, _0x6676f7) {
  const _0x231eea = extension_settings[extensionName];
  if (!_0x231eea || !_0x231eea.workers) {
    return "❌ 未找到工作流数据。";
  }
  if (!_0x27c688) {
    return "❌ 请指定工作流名称。";
  }
  if (!_0x5b24ee) {
    return "❌ 请指定节点ID。";
  }
  if (!_0x6676f7 || typeof _0x6676f7 !== "object") {
    return "❌ 请提供有效的节点数据（对象格式）。";
  }
  if (!(_0x27c688 in _0x231eea.workers)) {
    return "❌ 工作流 \"" + _0x27c688 + "\" 不存在。";
  }
  const _0x3fead6 = _0x231eea.workers[_0x27c688];
  if (!_0x3fead6) {
    return "❌ 工作流 \"" + _0x27c688 + "\" 内容为空。";
  }
  let _0x209e19;
  try {
    _0x209e19 = JSON.parse(_0x3fead6);
  } catch (_0x19ea00) {
    return "❌ 工作流 \"" + _0x27c688 + "\" JSON 解析失败: " + _0x19ea00.message;
  }
  if (_0x5b24ee in _0x209e19) {
    return "❌ 节点 \"" + _0x5b24ee + "\" 已存在，请使用其他ID或先删除现有节点。";
  }
  _0x209e19[_0x5b24ee] = _0x6676f7;
  const _0x1fc6d4 = JSON.stringify(_0x209e19);
  _0x231eea.workers[_0x27c688] = _0x1fc6d4;
  if (_0x231eea.workerid === _0x27c688) {
    _0x231eea.worker = _0x1fc6d4;
  }
  saveSettingsDebounced();
  const _0x3e2d8f = _0x6676f7._meta?.title || _0x6676f7.class_type || "(未命名)";
  return "✅ 已添加节点 [" + _0x5b24ee + "] " + _0x3e2d8f;
}