import { getContext } from "../../../../st-context.js";
import { saveChatConditional, eventSource } from "../../../../../script.js";
import { world_names, world_info } from "../../../../world-info.js";
import { eventNames } from "./config.js";
import { getCleanLogicalText } from "./imageInserter.js";
export async function setcharData(_0x4e8a60, _0x2d91fd) {
  let _0x361ceb = getContext();
  _0x361ceb.chatMetadata["st-chatu8"] = _0x361ceb.chatMetadata["st-chatu8"] || {};
  _0x361ceb.chatMetadata["st-chatu8"].data = _0x361ceb.chatMetadata["st-chatu8"].data || {};
  _0x361ceb.chatMetadata["st-chatu8"].data[_0x4e8a60] = _0x2d91fd;
  saveChatConditional();
}
export async function getcharData(_0x4578eb) {
  let _0x5f54df = getContext();
  _0x5f54df.chatMetadata["st-chatu8"] = _0x5f54df.chatMetadata["st-chatu8"] || {};
  _0x5f54df.chatMetadata["st-chatu8"].data = _0x5f54df.chatMetadata["st-chatu8"].data || {};
  return _0x5f54df.chatMetadata["st-chatu8"].data[_0x4578eb] || {};
}
export async function getElContext(_0xbbaf4c, _0x2aac6f = 3) {
  if (_0xbbaf4c) {
    if (_0xbbaf4c.classList.contains("mes_text")) {
      var _0x26a009 = _0xbbaf4c.parentElement.parentElement;
      var _0x4c45d6 = _0x26a009.getAttribute("mesid");
      if (!_0x4c45d6) {
        console.log("[chatDataUtils] mesid attribute not found.");
        return;
      }
      var _0x20064f = parseInt(_0x4c45d6, 10);
      console.log("[chatDataUtils] chatId:", _0x20064f);
      const _0x57a1a8 = [];
      if (_0x20064f >= 2) {
        let _0x36ccf0 = _0x20064f - (_0x2aac6f - 1) * 2;
        if (_0x36ccf0 < 0) {
          _0x36ccf0 = _0x20064f % 2;
        }
        let _0x420de5 = 0;
        let _0xae690d = _0x36ccf0;
        while (_0xae690d <= _0x20064f && _0x420de5 < _0x2aac6f) {
          const _0x13f20d = getContext().chat[_0xae690d];
          const _0x21a7e2 = _0x13f20d.mes || "";
          _0x57a1a8.push(_0x21a7e2);
          _0xae690d += 2;
          _0x420de5++;
        }
      } else {
        const _0x39c9fb = getContext().chat[_0x20064f];
        console.log("[chatDataUtils] Retrieved chatMessage:", _0x39c9fb);
        const _0x41605e = _0x39c9fb.mes || "";
        _0x57a1a8.push(_0x41605e);
      }
      console.log("[chatDataUtils] Retrieved texts:", _0x57a1a8);
      const _0x2dc36d = _0x57a1a8.map((_0x3da9, _0x36f230) => {
        return new Promise(_0x4de076 => {
          const _0xf68801 = "chatDataUtils-" + Date.now() + "-" + _0x36f230;
          const _0xf0a9ce = setTimeout(() => {
            eventSource.removeListener(eventNames.REGEX_RESULT_MESSAGE, _0x4d7b67);
            console.warn("[chatDataUtils] Regex processing timed out, using original text");
            _0x4de076(_0x3da9);
          }, 5000);
          const _0x4d7b67 = _0x12eb79 => {
            if (_0x12eb79.id === _0xf68801) {
              clearTimeout(_0xf0a9ce);
              eventSource.removeListener(eventNames.REGEX_RESULT_MESSAGE, _0x4d7b67);
              _0x4de076(_0x12eb79.message);
            }
          };
          eventSource.on(eventNames.REGEX_RESULT_MESSAGE, _0x4d7b67);
          const _0x2579e4 = {
            message: _0x3da9,
            id: _0xf68801
          };
          eventSource.emit(eventNames.REGEX_TEST_MESSAGE, _0x2579e4);
        });
      });
      const _0x41a6a0 = await Promise.all(_0x2dc36d);
      console.log("[chatDataUtils] Processed retexts:", _0x41a6a0);
      return _0x41a6a0;
    } else {
      console.log("[chatDataUtils] 该元素不包含 mes_text 类，尝试查找外部 mes_text");
      let _0x46a3aa = null;
      let _0x2cf0f7 = null;
      if (_0xbbaf4c?.ownerDocument !== document) {
        const _0x3da425 = document.querySelectorAll("iframe");
        for (const _0x57951f of _0x3da425) {
          try {
            if (_0x57951f.contentDocument === _0xbbaf4c.ownerDocument || _0x57951f.contentWindow?.document === _0xbbaf4c.ownerDocument) {
              _0x46a3aa = _0x57951f.closest(".mes_text");
              break;
            }
          } catch (_0xfa5e09) {}
        }
      }
      if (!_0x46a3aa && _0xbbaf4c?.closest) {
        _0x46a3aa = _0xbbaf4c.closest(".mes_text");
      }
      if (_0x46a3aa) {
        const _0x50e87e = _0x46a3aa.parentElement?.parentElement;
        const _0x27e227 = _0x50e87e?.getAttribute("mesid");
        if (_0x27e227) {
          const _0x24b277 = parseInt(_0x27e227, 10);
          const _0x1bc9af = getContext().chat[_0x24b277];
          const _0x286768 = _0x1bc9af?.mes || "";
          const _0x13bf0e = {
            mesId: _0x24b277,
            chatTextLength: _0x286768.length
          };
          console.log("[chatDataUtils] 外部 mes_text 检测结果:", _0x13bf0e);
          if (_0x286768.length > 100 && _0x24b277 !== 0) {
            console.log("[chatDataUtils] chat 文本长度 > 100 且 mesId !== 0，使用 mes_text 逻辑获取历史上下文");
            const _0x32eee0 = [];
            if (_0x24b277 >= 2) {
              let _0x56b094 = _0x24b277 - (_0x2aac6f - 1) * 2;
              if (_0x56b094 < 0) {
                _0x56b094 = _0x24b277 % 2;
              }
              let _0x50f3e2 = 0;
              let _0x11376a = _0x56b094;
              while (_0x11376a <= _0x24b277 && _0x50f3e2 < _0x2aac6f) {
                const _0x159052 = getContext().chat[_0x11376a];
                const _0x458f03 = _0x159052?.mes || "";
                _0x32eee0.push(_0x458f03);
                _0x11376a += 2;
                _0x50f3e2++;
              }
            } else {
              _0x32eee0.push(_0x286768);
            }
            console.log("[chatDataUtils] 获取到历史上下文:", _0x32eee0.length, "条");
            const _0x2d0291 = _0x32eee0.map((_0x592975, _0x3f6f39) => {
              return new Promise(_0xfab321 => {
                const _0x369801 = "chatDataUtils-" + Date.now() + "-" + _0x3f6f39;
                const _0x5c1a4a = setTimeout(() => {
                  eventSource.removeListener(eventNames.REGEX_RESULT_MESSAGE, _0xe4d7b8);
                  console.warn("[chatDataUtils] Regex processing timed out, using original text");
                  _0xfab321(_0x592975);
                }, 5000);
                const _0xe4d7b8 = _0x3500b3 => {
                  if (_0x3500b3.id === _0x369801) {
                    clearTimeout(_0x5c1a4a);
                    eventSource.removeListener(eventNames.REGEX_RESULT_MESSAGE, _0xe4d7b8);
                    _0xfab321(_0x3500b3.message);
                  }
                };
                eventSource.on(eventNames.REGEX_RESULT_MESSAGE, _0xe4d7b8);
                const _0x3ecdee = {
                  message: _0x592975,
                  id: _0x369801
                };
                eventSource.emit(eventNames.REGEX_TEST_MESSAGE, _0x3ecdee);
              });
            });
            const _0x10e791 = await Promise.all(_0x2d0291);
            console.log("[chatDataUtils] 处理后的历史上下文:", _0x10e791);
            return _0x10e791;
          } else {
            console.log("[chatDataUtils] chat 文本长度 <= 100，从 DOM 元素获取文本");
            _0x2cf0f7 = getCleanLogicalText(_0xbbaf4c);
          }
        } else {
          console.log("[chatDataUtils] 未找到 mesid 属性，从 DOM 元素获取文本");
          _0x2cf0f7 = getCleanLogicalText(_0xbbaf4c);
        }
      } else {
        console.log("[chatDataUtils] 未找到外部 mes_text，从 DOM 元素获取文本");
        _0x2cf0f7 = getCleanLogicalText(_0xbbaf4c);
      }
      const _0x547233 = "chatDataUtils-" + Date.now();
      const _0x43f472 = await new Promise(_0x33181d => {
        const _0x1a5c61 = setTimeout(() => {
          eventSource.removeListener(eventNames.REGEX_RESULT_MESSAGE, _0x2666c4);
          console.warn("[chatDataUtils] Regex processing timed out, using original text");
          _0x33181d(_0x2cf0f7);
        }, 5000);
        const _0x2666c4 = _0xf8b5a => {
          if (_0xf8b5a.id === _0x547233) {
            clearTimeout(_0x1a5c61);
            eventSource.removeListener(eventNames.REGEX_RESULT_MESSAGE, _0x2666c4);
            _0x33181d(_0xf8b5a.message);
          }
        };
        eventSource.on(eventNames.REGEX_RESULT_MESSAGE, _0x2666c4);
        const _0x10103a = {
          message: _0x2cf0f7,
          id: _0x547233
        };
        eventSource.emit(eventNames.REGEX_TEST_MESSAGE, _0x10103a);
      });
      return [_0x43f472];
    }
  } else {
    console.log("[chatDataUtils] No element provided.");
  }
}
export async function getrWorlds() {
  let _0x22af64 = world_names;
  let _0x2c2ef7 = await getcharWorld();
  console.log("charworldName", _0x2c2ef7);
  _0x22af64 = unshiftSpecificValue(_0x22af64, _0x2c2ef7);
  return _0x22af64;
  console.log("[chatDataUtils] Updated world_names:", _0x22af64);
}
function unshiftSpecificValue(_0x15c09f, _0x2a1ec6) {
  const _0x45d2ee = [];
  const _0x5c5bd5 = [];
  for (let _0x42d7eb = 0; _0x42d7eb < _0x15c09f.length; _0x42d7eb++) {
    if (_0x15c09f[_0x42d7eb] == _0x2a1ec6) {
      _0x45d2ee.push(_0x15c09f[_0x42d7eb]);
    } else {
      _0x5c5bd5.push(_0x15c09f[_0x42d7eb]);
    }
  }
  _0x5c5bd5.sort((_0x11c39a, _0x3d1afc) => _0x11c39a.localeCompare(_0x3d1afc, "zh-CN"));
  return _0x45d2ee.concat(_0x5c5bd5);
}
export async function getcharWorld() {
  let _0x59210c = getContext().characters[getContext().characterId]?.data?.extensions?.world;
  console.log("char_world_name", _0x59210c);
  return _0x59210c;
}
export async function getglobalSelectWorld() {
  const _0x458abf = world_info.globalSelect;
  return _0x458abf;
}
export async function getWorldEntries(_0x11d49e) {
  if (_0x11d49e) {
    try {
      let _0x509b0b = await getContext().loadWorldInfo(_0x11d49e);
      if (_0x509b0b && _0x509b0b.entries) {
        console.log("char_WorldInfo", _0x509b0b);
        return _0x509b0b.entries;
      }
    } catch (_0x220d40) {
      console.error(_0x220d40);
    }
  } else {
    return;
  }
}
export function getglobalvar(_0x1f5c0d) {
  const _0x1f32cf = getContext();
  const _0xb1de3e = _0x1f32cf.extensionSettings?.variables || {};
  return _0xb1de3e[_0x1f5c0d];
}
export function setglobalvar(_0x5d3163, _0x5609f1) {
  const _0x588585 = getContext();
  if (!_0x588585.extensionSettings) {
    _0x588585.extensionSettings = {};
  }
  if (!_0x588585.extensionSettings.variables) {
    _0x588585.extensionSettings.variables = {};
  }
  _0x588585.extensionSettings.variables[_0x5d3163] = _0x5609f1;
}