export const defaultCharacterSettings = {
  characterPresets: {
    默认角色: {
      nameCN: "",
      nameEN: "",
      characterTraits: "",
      facialFeatures: "",
      facialFeaturesBack: "",
      upperBodySFW: "",
      upperBodySFWBack: "",
      fullBodySFW: "",
      fullBodySFWBack: "",
      upperBodyNSFW: "",
      upperBodyNSFWBack: "",
      fullBodyNSFW: "",
      fullBodyNSFWBack: "",
      outfits: [],
      photoImageIds: [],
      selectedPhotoIndex: 0,
      photoPrompt: "",
      sendPhoto: false,
      generationContext: "",
      generationWorldBook: "",
      generationVariables: {}
    }
  },
  characterPresetId: "默认角色",
  outfitPresets: {
    默认服装: {
      nameCN: "",
      nameEN: "",
      owner: "",
      upperBody: "",
      upperBodyBack: "",
      fullBody: "",
      fullBodyBack: "",
      photoImageIds: [],
      selectedPhotoIndex: 0,
      photoPrompt: "",
      sendPhoto: false
    }
  },
  outfitPresetId: "默认服装",
  characterEnablePresets: {
    默认启用列表: {
      characters: []
    }
  },
  characterEnablePresetId: "默认启用列表",
  outfitEnablePresets: {
    默认服装列表: {
      outfits: []
    }
  },
  outfitEnablePresetId: "默认服装列表",
  characterCommonPresets: {
    默认通用角色列表: {
      characters: []
    }
  },
  characterCommonPresetId: "默认通用角色列表",
  characterAI: {
    model: "mistral",
    temperature: 0.8,
    systemPrompt: "你是一个专业的角色设计助手。根据用户的描述，生成详细的角色特征描述。请按照以下格式输出：\n\n基础信息：\n头部特征：\n身体特征：\n特殊特征：\n其他特征：\n\n每个部分都要详细描述。",
    lastPrompt: ""
  },
  outfitAI: {
    model: "mistral",
    temperature: 0.8,
    systemPrompt: "你是一个专业的服装设计助手。根据用户的描述，生成详细的服装配饰描述。请按照以下格式输出：\n\n头颈部装饰：\n躯干服装：\n下身服装：\n手脚配饰：\n其他配饰：\n\n每个部分都要详细描述。",
    lastPrompt: ""
  }
};
export const fieldLabels = {};
export const outfitSections = [];