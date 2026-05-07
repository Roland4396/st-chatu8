import { json, json2, json3, jsonvae, jsonweilinvae, jsonweldf, editwk } from "./settings/workers.js";
import { themePresets } from "./settings/themePresets.js";
export const extensionName = "st-chatu8";
export const extensionFolderPath = "scripts/extensions/third-party/" + extensionName;
export const EventType = {
  GENERATE_IMAGE_REQUEST: "generate-image-request",
  GENERATE_IMAGE_RESPONSE: "generate-image-response"
};
export const eventNames = {
  REGEX_TEST_MESSAGE: "regex-st-chatu8-test-message",
  REGEX_RESULT_MESSAGE: "regex-st-chatu8-result-message",
  LLM_TEST_RESULT: "ch-llm-test-result",
  LLM_GET_PROMPT_REQUEST: "ch-llm-get-prompt-request",
  LLM_GET_PROMPT_RESPONSE: "ch-llm-get-prompt-response",
  LLM_EXECUTE_REQUEST: "ch-llm-execute-request",
  LLM_EXECUTE_RESPONSE: "ch-llm-execute-response",
  LLM_IMAGE_GEN_REQUEST: "ch-llm-image-gen-request",
  LLM_IMAGE_GEN_RESPONSE: "ch-llm-image-gen-response",
  LLM_IMAGE_GEN_GET_PROMPT_REQUEST: "ch-llm-image-gen-get-prompt-request",
  LLM_IMAGE_GEN_GET_PROMPT_RESPONSE: "ch-llm-image-gen-get-prompt-response",
  LLM_CHAR_DESIGN_REQUEST: "ch-llm-char-design-request",
  LLM_CHAR_DESIGN_RESPONSE: "ch-llm-char-design-response",
  LLM_CHAR_DESIGN_GET_PROMPT_REQUEST: "ch-llm-char-design-get-prompt-request",
  LLM_CHAR_DESIGN_GET_PROMPT_RESPONSE: "ch-llm-char-design-get-prompt-response",
  LLM_CHAR_DISPLAY_REQUEST: "ch-llm-char-display-request",
  LLM_CHAR_DISPLAY_RESPONSE: "ch-llm-char-display-response",
  LLM_CHAR_DISPLAY_GET_PROMPT_REQUEST: "ch-llm-char-display-get-prompt-request",
  LLM_CHAR_DISPLAY_GET_PROMPT_RESPONSE: "ch-llm-char-display-get-prompt-response",
  LLM_CHAR_MODIFY_REQUEST: "ch-llm-char-modify-request",
  LLM_CHAR_MODIFY_RESPONSE: "ch-llm-char-modify-response",
  LLM_CHAR_MODIFY_GET_PROMPT_REQUEST: "ch-llm-char-modify-get-prompt-request",
  LLM_CHAR_MODIFY_GET_PROMPT_RESPONSE: "ch-llm-char-modify-get-prompt-response",
  LLM_TRANSLATION_REQUEST: "ch-llm-translation-request",
  LLM_TRANSLATION_RESPONSE: "ch-llm-translation-response",
  LLM_TRANSLATION_GET_PROMPT_REQUEST: "ch-llm-translation-get-prompt-request",
  LLM_TRANSLATION_GET_PROMPT_RESPONSE: "ch-llm-translation-get-prompt-response",
  LLM_TAG_MODIFY_REQUEST: "ch-llm-tag-modify-request",
  LLM_TAG_MODIFY_RESPONSE: "ch-llm-tag-modify-response",
  LLM_TAG_MODIFY_GET_PROMPT_REQUEST: "ch-llm-tag-modify-get-prompt-request",
  LLM_TAG_MODIFY_GET_PROMPT_RESPONSE: "ch-llm-tag-modify-get-prompt-response"
};
export const LLMRequestTypes = {
  IMAGE_GEN: "image_gen",
  CHAR_DESIGN: "char_design",
  CHAR_DISPLAY: "char_display",
  CHAR_MODIFY: "char_modify",
  TRANSLATION: "translation",
  TAG_MODIFY: "tag_modify"
};
export const defaultThemes = themePresets;
const _0x3cb441 = {
  默认: json,
  "默认-独立VAE": jsonvae,
  默认人物一致: json2,
  面部细化: json3,
  新版默认: jsonweldf,
  "新weilin-vae": jsonweilinvae,
  图像编辑: editwk
};
const _0x37f6dc = {
  idle: extensionFolderPath + "/html/settings/idle.chatu8",
  dragging: extensionFolderPath + "/html/settings/dragging.chatu8"
};
const _0x309a74 = {
  theme_id: "默认-夜间",
  themes: defaultThemes,
  generate_btn_style: "默认",
  image_frame_style: "无样式",
  collapse_style: "默认",
  scriptEnabled: false,
  characterAI: {
    model: "mistral",
    temperature: 0.8,
    systemPrompt: "",
    lastPrompt: ""
  },
  outfitAI: {
    model: "mistral",
    temperature: 0.8,
    systemPrompt: "",
    lastPrompt: ""
  },
  newlineFixEnabled: "true",
  yushe: {
    默认: {
      fixedPrompt: "",
      fixedPrompt_end: "",
      negativePrompt: ""
    },
    小马模型默认: {
      fixedPrompt: "score_9,score_8_up,score_7_up,anime",
      fixedPrompt_end: "",
      negativePrompt: "score_4,score_3,score_2,score_1,score_5"
    }
  },
  yusheid_sd: "默认",
  yusheid_novelai: "默认",
  yusheid_comfyui: "默认",
  prompt_replace: {
    默认: {
      text: "触发词1=前置前|插入词1\n触发词2=前置后|插入词2\n触发词3=替换|替换词3\n触发词4=替换|\n触发词5=替换分角色|替换词5\n触发词6=后置前|插入词6\n触发词7=后置后|插入词7\n触发词8=最后置|插入词8"
    }
  },
  prompt_replace_id: "默认",
  vibePresets: {
    默认: {
      model: "nai-diffusion-4-5-curated",
      infoExtract: 1,
      strength: 0.6,
      imageId: null,
      vibeDataId: null
    }
  },
  vibePresetId: "默认",
  regex_profiles: {
    默认: {
      beforeAfterRegex: "",
      textRegex: ""
    }
  },
  current_regex_profile: "默认",
  regexTestMode: false,
  mode: "comfyui",
  client: "browser",
  cache: "1",
  sdUrl: "http://localhost:7860",
  st_chatu8_sd_auth: "",
  comfyuiUrl: "http://localhost:8188",
  novelaiApi: "000000",
  novelaiApi_id: "000000",
  startTag: "image###",
  endTag: "###",
  nai3Scale: "10",
  sdCfgScale: "7",
  sm: "true",
  dyn: "true",
  cfg_rescale: "0.18",
  AQT_sd: "best quality, amazing quality, very aesthetic, absurdres",
  UCP_sd: "bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap",
  AQT_novelai: "best quality, amazing quality, very aesthetic, absurdres",
  UCP_novelai: "Heavy",
  addFurryDataset: "false",
  AQT_comfyui: "best quality, amazing quality, very aesthetic, absurdres",
  UCP_comfyui: "bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap",
  sd_csteps: "28",
  sd_cwidth: "1024",
  sd_cheight: "1024",
  sd_cseed: "-1",
  novelai_steps: "28",
  novelai_width: "1024",
  novelai_height: "1024",
  novelai_seed: "0",
  comfyui_steps: "28",
  comfyui_width: "1024",
  comfyui_height: "1024",
  comfyui_seed: "0",
  inpaint_denoise: "0.75",
  inpaint_brush_size: 30,
  inpaint_positive_prompt: "",
  inpaint_negative_prompt: "",
  cfg_comfyui: "6",
  sd_cchatu_8_model: "连接后选择",
  sd_cchatu_8_vae: "Automatic",
  sd_cchatu_8_scheduler: "连接后选择",
  sd_cchatu_8_upscaler: "Latent",
  sd_cupscale_factor: "1",
  sd_chires_fix: "false",
  sd_chires_steps: "0",
  sd_cdenoising_strength: "0.7",
  sd_cclip_skip: "2",
  sd_cadetailer: "false",
  restoreFaces: "false",
  sd_cchatu_8_samplerName: "DPM++ 2M",
  comfyuisamplerName: "连接后选择",
  comfyuiCLIPName: "连接后选择",
  comfyui_scheduler: "连接后选择",
  comfyui_vae: "连接后选择",
  novelai_sampler: "k_euler",
  zidongdianji: "false",
  zidongdianji2: "false",
  longPressToEdit: "false",
  clickToPreview: "true",
  nai3VibeTransfer: "false",
  enableVibeGroupTransfer: "false",
  normalizeRefStrength: "false",
  nai3CharRef: "false",
  nai3StylePerception: "false",
  InformationExtracted: "0.3",
  ReferenceStrength: "0.6",
  nai3Deceisp: "true",
  nai3Variety: "true",
  Schedule: "karras",
  MODEL_NAME: "连接后选择",
  c_fenwei: "0.8",
  c_xijie: "0.8",
  c_idquanzhong: "1.10",
  c_quanzhong: "0.8",
  ipa: "STANDARD (medium strength)",
  dbclike: "false",
  collapseImage: "false",
  workers: _0x3cb441,
  workerid: "新版默认",
  worker: jsonweldf,
  editWorkerid: "图像编辑",
  editWorker: editwk,
  novelaimode: "nai-diffusion-4-5-full",
  novelaisite: "官网",
  novelaiOtherSite: "http://localhost:9696/get-new-token",
  enableCloudQueue: "false",
  cloudQueueUrl: "https://st-chatu-novelai-queue.hf.space",
  cloudQueueGreeting: "努力生成中~",
  showQueueGreeting: "true",
  displayMode: "默认",
  heavyFrontendMode: "false",
  insertOriginalText: "false",
  enablePregen: "false",
  autoLLMImageGen: "false",
  imageAlignment: "center",
  imageGenInterval: 100,
  ai_temperature: 1,
  ai_top_p: 1,
  ai_presence_penalty: 0,
  ai_frequency_penalty: 0,
  ai_stream: "false",
  ai_private: "true",
  ai_token: "",
  ai_test_system: "You are a helpful assistant.",
  ai_test_user: "What is the capital of France?",
  ai_test_output: "",
  chatu8_ai_assistant: {
    api_url: "",
    api_key: "",
    model: "mistral",
    bypass_proxy: false,
    stream: true,
    system_prompt: "你是智绘姬，一个可爱、聪明的AI助手，请用中文简短地回答用户的问题。"
  },
  chatu8_code: "",
  llm_history_depth: 2,
  llm_profiles: {
    默认: {
      api_url: "",
      api_key: "",
      model: "",
      temperature: 1,
      top_p: 1,
      max_tokens: 30000,
      stream: false,
      bypass_proxy: false
    }
  },
  current_llm_profile: "默认",
  llm_request_type_configs: {
    image_gen: {
      api_profile: "默认",
      context_profile: "默认"
    },
    char_design: {
      api_profile: "默认",
      context_profile: "默认"
    },
    char_display: {
      api_profile: "默认",
      context_profile: "默认"
    },
    char_modify: {
      api_profile: "默认",
      context_profile: "默认"
    },
    translation: {
      api_profile: "默认",
      context_profile: "默认"
    },
    tag_modify: {
      api_profile: "默认",
      context_profile: "默认"
    }
  },
  test_context_profiles: {
    默认: {
      entries: [{
        id: "entry_1",
        name: "系统提示",
        role: "system",
        content: "",
        enabled: true,
        triggerMode: "always",
        triggerWords: ""
      }]
    }
  },
  current_test_context_profile: "默认",
  translation_model: "mistral",
  translation_system_prompt: "你是标签翻译助手。将输入的英文标签翻译成中文。\n\n输出格式：JSON对象 {\"英文\":\"中文\", ...}\n\n规则：\n1. 保持输入顺序\n2. 只输出JSON，不加任何解释\n3. 确保JSON格式正确\n\n示例：\n输入：1girl, long hair, blue eyes\n输出：{\"1girl\":\"一个女孩\",\"long hair\":\"长发\",\"blue eyes\":\"蓝色眼睛\"}",
  AI_use_coords: "true",
  fabThemes: {
    自定义: {
      bgColor: "#ADD8E6",
      iconColor: "#FFFFFF",
      opacity: 1
    },
    天空蓝: {
      bgColor: "#87CEEB",
      iconColor: "#FFFFFF",
      opacity: 0.9
    },
    薄荷绿: {
      bgColor: "#98FB98",
      iconColor: "#2F4F4F",
      opacity: 0.85
    },
    樱花粉: {
      bgColor: "#FFB7C5",
      iconColor: "#FFFFFF",
      opacity: 0.9
    },
    暗夜紫: {
      bgColor: "#6A5ACD",
      iconColor: "#FFFFFF",
      opacity: 0.85
    },
    琥珀橙: {
      bgColor: "#FFBF00",
      iconColor: "#4A3728",
      opacity: 0.9
    },
    深邃黑: {
      bgColor: "#2C3E50",
      iconColor: "#ECF0F1",
      opacity: 0.9
    },
    玻璃态: {
      bgColor: "#FFFFFF",
      iconColor: "#333333",
      opacity: 0.5
    },
    荧光绿: {
      bgColor: "#39FF14",
      iconColor: "#000000",
      opacity: 0.8
    },
    玫瑰金: {
      bgColor: "#B76E79",
      iconColor: "#FFFFFF",
      opacity: 0.9
    }
  },
  chatu8_fab_theme: "自定义",
  enable_chatu8_fab: true,
  enable_chatu8_fab_video: false,
  chatu8_fab_bg_color: "#ADD8E6",
  chatu8_fab_icon_color: "#FFFFFF",
  chatu8_fab_opacity: 1,
  chatu8_fab_size: {
    desktop: 50,
    mobile: 40
  },
  chatu8_fab_position: {
    desktop: {
      top: "65vh",
      left: "20px"
    },
    mobile: {
      top: "80vh",
      left: "10px"
    }
  },
  chatu8_fab_video_paths: _0x37f6dc,
  lastTab: "main",
  comfyuiCache: {
    models: [],
    samplers: [],
    vaes: [],
    schedulers: [],
    loras: [],
    CLIPs: [],
    objectInfo: {}
  },
  sdCache: {
    models: [],
    samplers: [],
    vaes: [],
    schedulers: [],
    upscalers: [],
    loras: []
  },
  worldBookEnabled: "false",
  worldBookList: {
    默认添加末尾: {
      content: ""
    }
  },
  worldBookList_id: "默认添加末尾",
  vocabulary_search_startswith: "false",
  vocabulary_search_limit: 100,
  vocabulary_search_sort: "hot_desc",
  jiuguanchucun: "false",
  convertToJpegStorage: "false",
  jiuguanStorage: {},
  banana: {
    apiKey: "123456",
    apiUrl: "http://localhost:8008",
    model: "gemini-2.5-flash-image",
    videoModel: "gemini-2.5-flash-image",
    aspectRatio: "1:1",
    conversationPresetId: "默认",
    editPresetId: "默认",
    videoPresetId: "默认",
    conversationPresets: {
      默认: {
        fixedPrompt: "",
        postfixPrompt: "",
        conversation: [{
          user: {
            text: "",
            image: ""
          },
          model: {
            text: "",
            image: ""
          }
        }, {
          user: {
            text: "",
            image: ""
          },
          model: {
            text: "",
            image: ""
          }
        }, {
          user: {
            text: "",
            image: ""
          },
          model: {
            text: "",
            image: ""
          }
        }]
      }
    }
  },
  bananaCharacterPresets: {
    默认: {
      triggers: "触发词1|触发词2",
      conversation: {
        user: {
          text: "",
          image: ""
        },
        model: {
          text: "",
          image: ""
        }
      }
    }
  },
  bananaCharacterPresetId: "默认",
  gestureEnabled: false,
  clickTriggerEnabled: false,
  gesture1: ["1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1111111111", "1111111111", "0000000000"],
  gesture2: ["0000000000", "1111111111", "1111111111", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000"],
  gestureShowRecognition: true,
  gestureShowTrail: true,
  gestureTrailColor: "#00ff00",
  gestureMatchThreshold: 60,
  defaultCharDemand: "",
  defaultImageDemand: "",
  novelai_profiles: {
    默认: {
      novelaiApi: "000000",
      novelaisite: "官网",
      novelaiOtherSite: "",
      enableCloudQueue: "false",
      cloudQueueUrl: "",
      cloudQueueGreeting: "",
      showQueueGreeting: "true",
      novelaimode: "nai-diffusion-4-5-full",
      novelai_sampler: "k_euler",
      Schedule: "karras",
      nai3Scale: "10",
      cfg_rescale: "0.18",
      AI_use_coords: "true",
      sm: "true",
      dyn: "true",
      nai3Variety: "true",
      nai3Deceisp: "true",
      enableVibeGroupTransfer: "false",
      normalizeRefStrength: "false",
      novelai_width: "1024",
      novelai_height: "1024",
      novelai_steps: "28",
      novelai_seed: "0"
    }
  },
  novelai_profile_id: "默认",
  comfyui_profiles: {
    默认: {
      workerid: "新版默认",
      worker: "",
      editWorkerid: "新版默认",
      editWorker: "",
      comfyuiUrl: "http://localhost:8188",
      MODEL_NAME: "连接后选择",
      comfyuisamplerName: "连接后选择",
      comfyui_vae: "连接后选择",
      comfyui_scheduler: "连接后选择",
      comfyuiCLIPName: "连接后选择",
      comfyui_width: "1024",
      comfyui_height: "1024",
      comfyui_steps: "28",
      comfyui_seed: "0",
      cfg_comfyui: "6"
    }
  },
  comfyui_profile_id: "默认"
};
export const defaultSettings = _0x309a74;
export const aiModels = [{
  name: "deepseek",
  description: "DeepSeek V3.1 (Google Vertex AI)",
  tier: "seed",
  community: false,
  aliases: ["deepseek-v3", "deepseek-v3.1", "deepseek-ai/deepseek-v3.1-maas"],
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "deepseek-reasoning",
  description: "DeepSeek R1 0528",
  maxInputChars: 5000,
  reasoning: true,
  tier: "seed",
  community: false,
  aliases: ["deepseek-r1-0528", "us.deepseek.r1-v1:0"],
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: false,
  vision: false,
  audio: false
}, {
  name: "gemini",
  description: "Gemini 2.5 Flash Lite (Vertex AI)",
  tier: "seed",
  community: false,
  aliases: ["gemini-2.5-flash-lite"],
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  vision: true,
  audio: false
}, {
  name: "gemini-search",
  description: "Gemini 2.5 Flash with Google Search (Google Vertex AI)",
  tier: "seed",
  community: false,
  aliases: ["searchgpt", "geminisearch"],
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  vision: true,
  audio: false
}, {
  name: "mistral",
  description: "Mistral Small 3.1 24B",
  tier: "anonymous",
  community: false,
  aliases: ["mistral-small-3.1-24b-instruct", "mistral-small-3.1-24b-instruct-2503"],
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "nova-fast",
  description: "Amazon Nova Micro",
  community: false,
  tier: "anonymous",
  aliases: ["nova-micro-v1"],
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "openai",
  description: "OpenAI GPT-5 Mini",
  tier: "anonymous",
  community: false,
  aliases: ["gpt-5-mini"],
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  maxInputChars: 7000,
  vision: true,
  audio: false
}, {
  name: "openai-audio",
  description: "OpenAI GPT-4o Mini Audio Preview",
  maxInputChars: 10000,
  voices: ["alloy", "echo", "fable", "onyx", "nova", "shimmer", "coral", "verse", "ballad", "ash", "sage", "amuch", "dan"],
  tier: "seed",
  community: false,
  aliases: ["gpt-4o-mini-audio-preview"],
  input_modalities: ["text", "image", "audio"],
  output_modalities: ["audio", "text"],
  tools: true,
  vision: true,
  audio: true
}, {
  name: "openai-fast",
  description: "OpenAI GPT-5 Nano",
  tier: "anonymous",
  community: false,
  aliases: ["gpt-5-nano"],
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  maxInputChars: 5000,
  vision: true,
  audio: false
}, {
  name: "openai-large",
  description: "OpenAI GPT-5 Chat",
  maxInputChars: 10000,
  tier: "seed",
  community: false,
  aliases: ["gpt-5-chat"],
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  vision: true,
  audio: false
}, {
  name: "openai-reasoning",
  description: "OpenAI o4-mini (Azure Myceli)",
  tier: "seed",
  community: false,
  aliases: ["o4-mini"],
  reasoning: true,
  supportsSystemMessages: false,
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  vision: true,
  audio: false
}, {
  name: "qwen-coder",
  description: "Qwen 2.5 Coder 32B",
  tier: "anonymous",
  community: false,
  aliases: ["qwen2.5-coder-32b-instruct"],
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "roblox-rp",
  description: "Llama 3.1 8B Instruct (Cross-Region)",
  tier: "seed",
  community: false,
  aliases: ["llama-roblox", "llama-fast-roblox"],
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "bidara",
  description: "BIDARA (Biomimetic Designer and Research Assistant by NASA)",
  tier: "anonymous",
  community: true,
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  vision: true,
  audio: false
}, {
  name: "chickytutor",
  description: "ChickyTutor AI Language Tutor - (chickytutor.com)",
  tier: "anonymous",
  community: true,
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "evil",
  description: "Evil",
  uncensored: true,
  tier: "seed",
  community: true,
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  vision: true,
  audio: false
}, {
  name: "midijourney",
  description: "MIDIjourney",
  tier: "anonymous",
  community: true,
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "rtist",
  description: "Rtist",
  tier: "seed",
  community: true,
  input_modalities: ["text"],
  output_modalities: ["text"],
  tools: true,
  vision: false,
  audio: false
}, {
  name: "unity",
  description: "Unity Unrestricted Agent",
  uncensored: true,
  tier: "seed",
  community: true,
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  tools: true,
  vision: true,
  audio: false
}];