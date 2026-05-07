import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
import { eventSource, event_types } from "../../../../../../script.js";
import { pregenManager } from "../pregen_manager.js";
function parsePrompts(_0x3de660) {
  const _0x5dbf12 = extension_settings[extensionName];
  if (!_0x5dbf12.startTag || !_0x5dbf12.endTag) {
    return [];
  }
  const _0x436f33 = _0x20d429 => {
    return _0x20d429.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  const _0x32a47f = _0x436f33(_0x5dbf12.startTag);
  const _0x18901a = _0x436f33(_0x5dbf12.endTag);
  const _0x396bcf = new RegExp(_0x32a47f + "([\\s\\S]*?)" + _0x18901a, "g");
  const _0x3b37ba = [..._0x3de660.matchAll(_0x396bcf)];
  return _0x3b37ba.map(_0x392de5 => _0x392de5[1].replaceAll("《", "<").replaceAll("》", ">").replaceAll("\n", ""));
}
eventSource.on(event_types.generation_started, () => {
  if (String(extension_settings[extensionName].enablePregen) !== "true") {
    return;
  }
  pregenManager.clear();
});
eventSource.on(event_types.STREAM_TOKEN_RECEIVED, _0x4e9f54 => {
  if (String(extension_settings[extensionName].enablePregen) !== "true" || !_0x4e9f54) {
    return;
  }
  const _0x3e00d7 = parsePrompts(_0x4e9f54);
  if (_0x3e00d7.length > 0) {
    pregenManager.add(_0x3e00d7);
  }
});