import { regexModule } from "./regexModule.js";
import { mainSettingsModule } from "./mainSettingsModule.js";
import { comfyuiWorkflowModule } from "./comfyuiWorkflowModule.js";
import { sdSettingsModule } from "./sdSettingsModule.js";
import { novelaiSettingsModule } from "./novelaiSettingsModule.js";
import { comfyuiSettingsModule } from "./comfyuiSettingsModule.js";
import { bananaSettingsModule } from "./bananaSettingsModule.js";
import { llmSettingsModule } from "./llmSettingsModule.js";
import { vocabularySettingsModule } from "./vocabularySettingsModule.js";
import { charRefSettingsModule } from "./charRefSettingsModule.js";
import { themeSettingsModule } from "./themeSettingsModule.js";
import { fabSettingsModule } from "./fabSettingsModule.js";
import { imageCacheSettingsModule } from "./imageCacheSettingsModule.js";
import { settingsPageModule } from "./settingsPageModule.js";
import { aboutSettingsModule } from "./aboutSettingsModule.js";
import { logSettingsModule } from "./logSettingsModule.js";
import { troubleshootingModule } from "./troubleshootingModule.js";
import { diagnosticsModule } from "./diagnosticsModule.js";
import { installationGuideModule } from "./installationGuideModule.js";
import { promptReplacementModule } from "./promptReplacementModule.js";
import { sendDataSettingsModule } from "./sendDataSettingsModule.js";
const _0x8780c3 = {
  regex: regexModule,
  main_settings: mainSettingsModule,
  comfyui_workflow: comfyuiWorkflowModule,
  sd_settings: sdSettingsModule,
  novelai_settings: novelaiSettingsModule,
  comfyui_settings: comfyuiSettingsModule,
  banana_settings: bananaSettingsModule,
  llm_settings: llmSettingsModule,
  vocabulary_settings: vocabularySettingsModule,
  char_ref_settings: charRefSettingsModule,
  theme_settings: themeSettingsModule,
  fab_settings: fabSettingsModule,
  image_cache_settings: imageCacheSettingsModule,
  settings_page: settingsPageModule,
  about_settings: aboutSettingsModule,
  log_settings: logSettingsModule,
  troubleshooting: troubleshootingModule,
  diagnostics: diagnosticsModule,
  installation_guide: installationGuideModule,
  prompt_replacement: promptReplacementModule,
  send_data_settings: sendDataSettingsModule
};
export const promptModules = _0x8780c3;
export function getModuleSummaries() {
  const _0xa42d6d = ["【可加载的知识模块】（使用 load_module 按需获取详细信息）"];
  for (const [_0x3f8a0d, _0x4cbc46] of Object.entries(promptModules)) {
    _0xa42d6d.push("- " + _0x3f8a0d + ": " + _0x4cbc46.name + " — " + _0x4cbc46.summary);
  }
  _0xa42d6d.push("");
  _0xa42d6d.push("当你需要操作某个模块的功能时，请先加载对应模块获取详细命令和知识：");
  _0xa42d6d.push("<SystemQuery>{\"type\": \"load_module\", \"module\": \"模块名\"}</SystemQuery>");
  return _0xa42d6d.join("\n");
}
export function getModulePrompt(_0x154ee7) {
  const _0x402a9b = promptModules[_0x154ee7];
  if (!_0x402a9b) {
    return null;
  }
  const _0x82ea04 = [];
  _0x82ea04.push("===== " + _0x402a9b.name + " 模块详细知识 =====");
  _0x82ea04.push("");
  if (_0x402a9b.commands) {
    _0x82ea04.push(_0x402a9b.commands);
    _0x82ea04.push("");
  }
  if (_0x402a9b.knowledge) {
    _0x82ea04.push(_0x402a9b.knowledge);
    _0x82ea04.push("");
  }
  if (_0x402a9b.workflow) {
    _0x82ea04.push(_0x402a9b.workflow);
    _0x82ea04.push("");
  }
  if (_0x402a9b.errorGuide) {
    _0x82ea04.push(_0x402a9b.errorGuide);
    _0x82ea04.push("");
  }
  _0x82ea04.push("===== " + _0x402a9b.name + " 模块结束 =====");
  return _0x82ea04.join("\n");
}
export function getAvailableModuleKeys() {
  return Object.keys(promptModules);
}