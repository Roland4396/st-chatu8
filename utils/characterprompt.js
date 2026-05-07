import { extension_settings } from "../../../../extensions.js";
import { extensionName } from "./config.js";
import { parsePromptStringWithCoordinates } from "./utils.js";
function normalizeName(_0x3a81fa) {
  return _0x3a81fa.toLowerCase().replace(/-/g, " ").replace(/[''`´]/g, "'").replace(/\s+/g, " ").trim();
}
function calculateMatchScore(_0x21ae47, _0x5e7e92) {
  if (!_0x21ae47 || !_0x5e7e92 || typeof _0x21ae47 !== "string" || typeof _0x5e7e92 !== "string") {
    return 0;
  }
  if (_0x21ae47 === _0x5e7e92) {
    return 1000 + _0x5e7e92.length;
  }
  if (_0x21ae47.includes(_0x5e7e92)) {
    return 100 + _0x5e7e92.length;
  }
  if (_0x5e7e92.includes(_0x21ae47)) {
    return 50 + _0x21ae47.length;
  }
  return 0;
}
function collectCharacterCandidates(_0x29a79f, _0x1c9ead, _0x4d8a34) {
  const _0x2e73c3 = [];
  for (const _0x350599 of _0x4d8a34) {
    const _0x1032c0 = _0x1c9ead[_0x350599];
    if (!_0x1032c0) {
      continue;
    }
    if (_0x1032c0.nameEN) {
      const _0x3d62a5 = _0x1032c0.nameEN.split("|");
      for (const _0x1e2d7e of _0x3d62a5) {
        const _0x1f0053 = _0x1e2d7e.trim();
        if (!_0x1f0053) {
          continue;
        }
        const _0xe12e31 = normalizeName(_0x1f0053);
        const _0x276265 = calculateMatchScore(_0x29a79f, _0xe12e31);
        if (_0x276265 > 0) {
          const _0x31b682 = {
            preset: _0x1032c0,
            score: _0x276265,
            matchedName: _0x1f0053
          };
          _0x2e73c3.push(_0x31b682);
        }
      }
    }
    if (_0x1032c0.nameCN) {
      const _0x5c3e4b = _0x1032c0.nameCN.split("|");
      for (const _0x2c4be4 of _0x5c3e4b) {
        const _0x5f1e38 = _0x2c4be4.trim();
        if (!_0x5f1e38) {
          continue;
        }
        const _0x488794 = normalizeName(_0x5f1e38);
        const _0x75aee9 = calculateMatchScore(_0x29a79f, _0x488794);
        if (_0x75aee9 > 0) {
          const _0xad558 = {
            preset: _0x1032c0,
            score: _0x75aee9,
            matchedName: _0x5f1e38
          };
          _0x2e73c3.push(_0xad558);
        }
      }
    }
  }
  return _0x2e73c3;
}
function collectOutfitCandidates(_0xfd8e80, _0x2a9fd1, _0x3905ee) {
  const _0x3a6e3e = [];
  for (const _0x491361 of _0x3905ee) {
    const _0x1ec564 = _0x2a9fd1[_0x491361];
    if (!_0x1ec564) {
      continue;
    }
    if (_0x1ec564.nameEN) {
      const _0x55ef1 = _0x1ec564.nameEN.split("|");
      for (const _0x1b0551 of _0x55ef1) {
        const _0x521673 = _0x1b0551.trim();
        if (!_0x521673) {
          continue;
        }
        const _0x40bc03 = normalizeName(_0x521673);
        const _0x247785 = calculateMatchScore(_0xfd8e80, _0x40bc03);
        if (_0x247785 > 0) {
          const _0xd65a4c = {
            preset: _0x1ec564,
            score: _0x247785,
            matchedName: _0x521673
          };
          _0x3a6e3e.push(_0xd65a4c);
        }
      }
    }
    if (_0x1ec564.nameCN) {
      const _0x425a30 = _0x1ec564.nameCN.split("|");
      for (const _0x1ab3c9 of _0x425a30) {
        const _0x39a9a3 = _0x1ab3c9.trim();
        if (!_0x39a9a3) {
          continue;
        }
        const _0xbd2b48 = normalizeName(_0x39a9a3);
        const _0x1a078f = calculateMatchScore(_0xfd8e80, _0xbd2b48);
        if (_0x1a078f > 0) {
          const _0x4fe04c = {
            preset: _0x1ec564,
            score: _0x1a078f,
            matchedName: _0x39a9a3
          };
          _0x3a6e3e.push(_0x4fe04c);
        }
      }
    }
  }
  return _0x3a6e3e;
}
function findBestCharacterMatch(_0x2ec09d, _0x48a852, _0x14425b, _0x286454) {
  if (!_0x2ec09d || typeof _0x2ec09d !== "string") {
    return null;
  }
  let _0x18eede = collectCharacterCandidates(_0x2ec09d, _0x48a852, _0x14425b);
  if (_0x18eede.length > 0) {
    const _0x11721b = _0x18eede.reduce((_0x196ed5, _0x4fdf4e) => _0x4fdf4e.score > _0x196ed5.score ? _0x4fdf4e : _0x196ed5);
    console.log("[CharacterPrompt] Best character match from enabled characters:", _0x11721b.matchedName, "with score:", _0x11721b.score);
    return _0x11721b.preset;
  }
  _0x18eede = collectCharacterCandidates(_0x2ec09d, _0x48a852, _0x286454);
  if (_0x18eede.length > 0) {
    const _0x21807f = _0x18eede.reduce((_0x355948, _0x414478) => _0x414478.score > _0x355948.score ? _0x414478 : _0x355948);
    console.log("[CharacterPrompt] Best character match from common characters:", _0x21807f.matchedName, "with score:", _0x21807f.score);
    return _0x21807f.preset;
  }
  const _0x38e1eb = Object.keys(_0x48a852);
  _0x18eede = collectCharacterCandidates(_0x2ec09d, _0x48a852, _0x38e1eb);
  if (_0x18eede.length > 0) {
    const _0x1b354e = _0x18eede.reduce((_0x202c31, _0x5cb30d) => _0x5cb30d.score > _0x202c31.score ? _0x5cb30d : _0x202c31);
    console.log("[CharacterPrompt] Best character match from all presets (fallback):", _0x1b354e.matchedName, "with score:", _0x1b354e.score);
    return _0x1b354e.preset;
  }
  return null;
}
function findBestOutfitMatch(_0x554fd2, _0x56feea, _0x519bde, _0x487757) {
  if (!_0x554fd2 || typeof _0x554fd2 !== "string") {
    return null;
  }
  let _0x76f886 = collectOutfitCandidates(_0x554fd2, _0x56feea, _0x519bde);
  if (_0x76f886.length > 0) {
    const _0x14216a = _0x76f886.reduce((_0x53e7ec, _0x11c0e7) => _0x11c0e7.score > _0x53e7ec.score ? _0x11c0e7 : _0x53e7ec);
    console.log("[CharacterPrompt] Best outfit match from enabled outfits:", _0x14216a.matchedName, "with score:", _0x14216a.score);
    return _0x14216a.preset;
  }
  _0x76f886 = collectOutfitCandidates(_0x554fd2, _0x56feea, _0x487757);
  if (_0x76f886.length > 0) {
    const _0x5d335f = _0x76f886.reduce((_0x85646f, _0x2c8d62) => _0x2c8d62.score > _0x85646f.score ? _0x2c8d62 : _0x85646f);
    console.log("[CharacterPrompt] Best outfit match from all presets (fallback):", _0x5d335f.matchedName, "with score:", _0x5d335f.score);
    return _0x5d335f.preset;
  }
  return null;
}
export function processCharacterPrompt(_0x388236) {
  if (!_0x388236 || typeof _0x388236 !== "string") {
    return _0x388236;
  }
  window.collectedCharacterNegatives = "";
  if (_0x388236.includes("Scene Composition")) {
    console.log("[CharacterPrompt] 检测到分角色模式");
    return processMultiCharacterPrompt(_0x388236);
  }
  console.log("[CharacterPrompt] 使用非分角色模式");
  const _0x3fd94b = extension_settings[extensionName];
  console.log("[CharacterPrompt] Processing prompt:", _0x388236);
  const _0x39b29e = _0x3fd94b.characterPresets || {};
  const _0xa7b52a = _0x3fd94b.outfitPresets || {};
  const _0x582492 = _0x3fd94b.characterEnablePresetId;
  const _0x1dc40b = _0x3fd94b.characterCommonPresetId;
  const _0x4e2a22 = _0x3fd94b.outfitEnablePresetId;
  const _0x3c7817 = _0x582492 && _0x3fd94b.characterEnablePresets?.[_0x582492]?.characters || [];
  const _0x325bc0 = _0x1dc40b && _0x3fd94b.characterCommonPresets?.[_0x1dc40b]?.characters || [];
  const _0x369dea = _0x4e2a22 && _0x3fd94b.outfitEnablePresets?.[_0x4e2a22]?.outfits || [];
  const _0x110d5e = _0x3c7817.flatMap(_0x33c7cd => _0x39b29e[_0x33c7cd]?.outfits || []);
  const _0x6094e7 = [...new Set([..._0x369dea, ..._0x110d5e])];
  const _0xbe9ce0 = new Map();
  for (const _0x1a7c6a of _0x6094e7) {
    const _0xa3622a = _0xa7b52a[_0x1a7c6a];
    if (_0xa3622a) {
      if (_0xa3622a.nameEN) {
        const _0x357e23 = _0xa3622a.nameEN.split("|");
        for (const _0x28a90d of _0x357e23) {
          const _0x52aae1 = _0x28a90d.trim();
          if (_0x52aae1) {
            _0xbe9ce0.set(_0x52aae1, _0xa3622a);
          }
        }
      }
      if (_0xa3622a.nameCN) {
        const _0x231830 = _0xa3622a.nameCN.split("|");
        for (const _0x308378 of _0x231830) {
          const _0x25f56a = _0x308378.trim();
          if (_0x25f56a) {
            _0xbe9ce0.set(_0x25f56a, _0xa3622a);
          }
        }
      }
    }
  }
  let _0x5eb194 = null;
  let _0x3dbd11 = false;
  const _0x3e90ee = _0x1bdef3 => {
    try {
      if (_0x1bdef3.startsWith("{") && _0x1bdef3.endsWith("}")) {
        const _0x53abe5 = JSON.parse(_0x1bdef3);
        if (_0x53abe5.name) {
          return {
            isJson: true,
            hasAngle: "angle" in _0x53abe5,
            name: _0x53abe5.name,
            angle: _0x53abe5.angle || "",
            upperBody: _0x53abe5.upperBody || "hidden",
            lowerBody: _0x53abe5.lowerBody || "hidden"
          };
        }
      }
    } catch (_0xc36f30) {}
    return {
      isJson: false
    };
  };
  const _0x4fa40d = _0x388236.replace(/\$([^$]+)\$/g, (_0x45e3a8, _0x13053d) => {
    const _0x8aa9e7 = _0x13053d.trim();
    const _0x388be3 = _0x3e90ee(_0x8aa9e7);
    if (_0x388be3.isJson) {
      const _0x532520 = normalizeName(_0x388be3.name);
      const _0x4e5152 = _0x388be3.angle;
      const _0x506fd1 = _0x4e5152.toLowerCase().includes("from behind");
      _0x5eb194 = _0x4e5152;
      _0x3dbd11 = _0x506fd1;
      const _0x16c371 = _0x388be3.upperBody.toLowerCase();
      const _0x35dd46 = _0x388be3.lowerBody.toLowerCase();
      if (_0x388be3.hasAngle) {
        const _0x309376 = findBestCharacterMatch(_0x532520, _0x39b29e, _0x3c7817, _0x325bc0);
        if (_0x309376) {
          let _0x1ca478 = "";
          if (_0x309376.characterTraits) {
            _0x1ca478 = _0x309376.characterTraits;
          }
          if (_0x16c371 !== "hidden") {
            const _0x59b492 = _0x506fd1 ? _0x309376.facialFeaturesBack || "" : _0x309376.facialFeatures || "";
            if (_0x59b492) {
              _0x1ca478 += (_0x1ca478 ? ", " : "") + _0x59b492;
            }
            if (_0x16c371 === "sfw") {
              const _0x3866ba = _0x506fd1 ? _0x309376.upperBodySFWBack : _0x309376.upperBodySFW;
              if (_0x3866ba) {
                _0x1ca478 += (_0x1ca478 ? ", " : "") + _0x3866ba;
              }
            } else if (_0x16c371 === "nsfw") {
              const _0x2d73a0 = _0x506fd1 ? _0x309376.upperBodyNSFWBack : _0x309376.upperBodyNSFW;
              if (_0x2d73a0) {
                _0x1ca478 += (_0x1ca478 ? ", " : "") + _0x2d73a0;
              }
            }
          }
          if (_0x35dd46 !== "hidden") {
            if (_0x35dd46 === "sfw") {
              const _0x4e9e93 = _0x506fd1 ? _0x309376.fullBodySFWBack : _0x309376.fullBodySFW;
              if (_0x4e9e93) {
                _0x1ca478 += (_0x1ca478 ? ", " : "") + _0x4e9e93;
              }
            } else if (_0x35dd46 === "nsfw") {
              const _0x121ac8 = _0x506fd1 ? _0x309376.fullBodyNSFWBack : _0x309376.fullBodyNSFW;
              if (_0x121ac8) {
                _0x1ca478 += (_0x1ca478 ? ", " : "") + _0x121ac8;
              }
            }
          }
          if (_0x309376.negative) {
            collectNegativeToGlobal(_0x309376.negative);
          }
          console.log("[CharacterPrompt] JSON Character replacement result:", _0x1ca478);
          return _0x1ca478;
        }
        return _0x45e3a8;
      } else {
        const _0x14e0b8 = normalizeName(_0x388be3.name);
        const _0x3ac099 = Object.keys(_0xa7b52a);
        const _0x36b27c = findBestOutfitMatch(_0x14e0b8, _0xa7b52a, _0x6094e7, _0x3ac099);
        if (_0x36b27c) {
          let _0x29636f = "";
          if (_0x16c371 === "visible") {
            const _0x5804f0 = _0x3dbd11 ? _0x36b27c.upperBodyBack : _0x36b27c.upperBody;
            if (_0x5804f0) {
              _0x29636f = _0x5804f0;
            }
          }
          if (_0x35dd46 === "visible") {
            const _0x480f28 = _0x3dbd11 ? _0x36b27c.fullBodyBack : _0x36b27c.fullBody;
            if (_0x480f28) {
              _0x29636f += (_0x29636f ? ", " : "") + _0x480f28;
            }
          }
          console.log("[CharacterPrompt] JSON Outfit replacement result:", _0x29636f);
          return _0x29636f;
        }
        return _0x45e3a8;
      }
    }
    const _0x2d1b13 = [{
      pattern: "-sfw-upperbody-sfw-lowerbody",
      upper: "sfw",
      lower: "sfw"
    }, {
      pattern: "-sfw-upperbody-nsfw-lowerbody",
      upper: "sfw",
      lower: "nsfw"
    }, {
      pattern: "-nsfw-upperbody-sfw-lowerbody",
      upper: "nsfw",
      lower: "sfw"
    }, {
      pattern: "-nsfw-upperbody-nsfw-lowerbody",
      upper: "nsfw",
      lower: "nsfw"
    }, {
      pattern: "-sfw-upperbody-sfw-fullbody",
      upper: "sfw",
      lower: "sfw"
    }, {
      pattern: "-sfw-upperbody-nsfw-fullbody",
      upper: "sfw",
      lower: "nsfw"
    }, {
      pattern: "-nsfw-upperbody-sfw-fullbody",
      upper: "nsfw",
      lower: "sfw"
    }, {
      pattern: "-nsfw-upperbody-nsfw-fullbody",
      upper: "nsfw",
      lower: "nsfw"
    }, {
      pattern: "-sfw-upperbody",
      upper: "sfw",
      lower: null
    }, {
      pattern: "-nsfw-upperbody",
      upper: "nsfw",
      lower: null
    }, {
      pattern: "-sfw-lowerbody",
      upper: null,
      lower: "sfw"
    }, {
      pattern: "-nsfw-lowerbody",
      upper: null,
      lower: "nsfw"
    }];
    for (const _0x206e30 of _0x2d1b13) {
      if (_0x8aa9e7.toLowerCase().endsWith(_0x206e30.pattern)) {
        const _0x7ded09 = _0x8aa9e7.slice(0, -_0x206e30.pattern.length).trim();
        const _0xcc610 = normalizeName(_0x7ded09);
        const _0x273105 = _0x7ded09;
        const _0x37dac4 = _0x273105.toLowerCase().includes("from behind");
        _0x5eb194 = _0x273105;
        _0x3dbd11 = _0x37dac4;
        const _0x4adeea = findBestCharacterMatch(_0xcc610, _0x39b29e, _0x3c7817, _0x325bc0);
        if (_0x4adeea) {
          let _0x4a79a1 = "";
          if (_0x4adeea.characterTraits) {
            _0x4a79a1 = _0x4adeea.characterTraits;
          }
          if (_0x206e30.upper) {
            const _0xfd74b = _0x37dac4 ? _0x4adeea.facialFeaturesBack || "" : _0x4adeea.facialFeatures || "";
            if (_0xfd74b) {
              _0x4a79a1 += (_0x4a79a1 ? ", " : "") + _0xfd74b;
            }
          }
          if (_0x206e30.upper === "sfw") {
            const _0x264501 = _0x37dac4 ? _0x4adeea.upperBodySFWBack : _0x4adeea.upperBodySFW;
            if (_0x264501) {
              _0x4a79a1 += (_0x4a79a1 ? ", " : "") + _0x264501;
            }
          } else if (_0x206e30.upper === "nsfw") {
            const _0xfa6821 = _0x37dac4 ? _0x4adeea.upperBodyNSFWBack : _0x4adeea.upperBodyNSFW;
            if (_0xfa6821) {
              _0x4a79a1 += (_0x4a79a1 ? ", " : "") + _0xfa6821;
            }
          }
          if (_0x206e30.lower === "sfw") {
            const _0x49415f = _0x37dac4 ? _0x4adeea.fullBodySFWBack : _0x4adeea.fullBodySFW;
            if (_0x49415f) {
              _0x4a79a1 += (_0x4a79a1 ? ", " : "") + _0x49415f;
            }
          } else if (_0x206e30.lower === "nsfw") {
            const _0x58fe67 = _0x37dac4 ? _0x4adeea.fullBodyNSFWBack : _0x4adeea.fullBodyNSFW;
            if (_0x58fe67) {
              _0x4a79a1 += (_0x4a79a1 ? ", " : "") + _0x58fe67;
            }
          }
          if (_0x4adeea.negative) {
            collectNegativeToGlobal(_0x4adeea.negative);
          }
          console.log("[CharacterPrompt] Character replacement result:", _0x4a79a1);
          return _0x4a79a1;
        }
        return _0x45e3a8;
      }
    }
    const _0x468d33 = [{
      pattern: "-upperbody-lowerbody",
      hasUpper: true,
      hasLower: true
    }, {
      pattern: "-upperbody",
      hasUpper: true,
      hasLower: false
    }, {
      pattern: "-lowerbody",
      hasUpper: false,
      hasLower: true
    }];
    for (const _0x30cc78 of _0x468d33) {
      if (_0x8aa9e7.toLowerCase().endsWith(_0x30cc78.pattern)) {
        const _0x32b7bd = _0x8aa9e7.slice(0, -_0x30cc78.pattern.length).trim();
        const _0x1982cb = normalizeName(_0x32b7bd);
        const _0x1c13f0 = Object.keys(_0xa7b52a);
        const _0x56b80e = findBestOutfitMatch(_0x1982cb, _0xa7b52a, _0x6094e7, _0x1c13f0);
        if (_0x56b80e) {
          let _0x7fa423 = "";
          if (_0x30cc78.hasUpper) {
            const _0x10f967 = _0x3dbd11 ? _0x56b80e.upperBodyBack : _0x56b80e.upperBody;
            if (_0x10f967) {
              _0x7fa423 = _0x10f967;
            }
          }
          if (_0x30cc78.hasLower) {
            const _0x3979ac = _0x3dbd11 ? _0x56b80e.fullBodyBack : _0x56b80e.fullBody;
            if (_0x3979ac) {
              _0x7fa423 += (_0x7fa423 ? ", " : "") + _0x3979ac;
            }
          }
          console.log("[CharacterPrompt] Outfit replacement result:", _0x7fa423);
          return _0x7fa423;
        }
        return _0x45e3a8;
      }
    }
    return _0x45e3a8;
  });
  return _0x4fa40d.replace(/, \s*,/g, ",").replace(/,+/g, ",").replace(/^, |, $/g, "").trim();
}
export function processCharacterPrompts(_0x27fb9d) {
  if (!Array.isArray(_0x27fb9d)) {
    return _0x27fb9d;
  }
  return _0x27fb9d.map(_0x2c82a1 => processCharacterPrompt(_0x2c82a1));
}
function collectNegativeToGlobal(_0x1deb24) {
  if (!_0x1deb24 || typeof _0x1deb24 !== "string") {
    return;
  }
  const _0x5639f5 = _0x1deb24.trim();
  if (!_0x5639f5) {
    return;
  }
  if (window.collectedCharacterNegatives) {
    window.collectedCharacterNegatives += ", " + _0x5639f5;
  } else {
    window.collectedCharacterNegatives = _0x5639f5;
  }
  console.log("[CharacterPrompt] 收集负面提示词到全局:", _0x5639f5);
}
function processMultiCharacterPrompt(_0x38ea3d) {
  try {
    const _0x2a7bbe = parsePromptStringWithCoordinates(_0x38ea3d);
    console.log("[CharacterPrompt] 解析后的 prompt_data:", _0x2a7bbe);
    const _0x445d96 = extension_settings[extensionName];
    const _0xf0b18c = _0x445d96.characterPresets || {};
    const _0x32b031 = _0x445d96.outfitPresets || {};
    const _0x372f8c = _0x445d96.characterEnablePresetId;
    const _0x102d19 = _0x445d96.characterCommonPresetId;
    const _0xebd8e = _0x445d96.outfitEnablePresetId;
    const _0x32f2d4 = _0x372f8c && _0x445d96.characterEnablePresets?.[_0x372f8c]?.characters || [];
    const _0x10a2d6 = _0x102d19 && _0x445d96.characterCommonPresets?.[_0x102d19]?.characters || [];
    const _0x5bfde4 = _0xebd8e && _0x445d96.outfitEnablePresets?.[_0xebd8e]?.outfits || [];
    const _0x563eb8 = _0x32f2d4.flatMap(_0x55fb5e => _0xf0b18c[_0x55fb5e]?.outfits || []);
    const _0x163e20 = [...new Set([..._0x5bfde4, ..._0x563eb8])];
    for (let _0x3db755 = 1; _0x3db755 <= 4; _0x3db755++) {
      const _0xd9f2f6 = "Character " + _0x3db755 + " Prompt";
      const _0x29779a = "Character " + _0x3db755 + " UC";
      if (_0x2a7bbe[_0xd9f2f6]) {
        console.log("[CharacterPrompt] 处理 " + _0xd9f2f6 + ":", _0x2a7bbe[_0xd9f2f6]);
        const _0x3fe4f5 = [];
        let _0x20ae8a = false;
        const _0x201ce9 = _0x2a7bbe[_0xd9f2f6].replace(/\$([^$]+)\$/g, (_0x57e9fc, _0x563e17) => {
          const _0x3a02f9 = _0x563e17.trim();
          const _0x3d4513 = _0x4c76f5 => {
            try {
              if (_0x4c76f5.startsWith("{") && _0x4c76f5.endsWith("}")) {
                const _0x2c744f = JSON.parse(_0x4c76f5);
                if (_0x2c744f.name) {
                  return {
                    isJson: true,
                    hasAngle: "angle" in _0x2c744f,
                    name: _0x2c744f.name,
                    angle: _0x2c744f.angle || "",
                    upperBody: _0x2c744f.upperBody || "hidden",
                    lowerBody: _0x2c744f.lowerBody || "hidden"
                  };
                }
              }
            } catch (_0x51471b) {}
            return {
              isJson: false
            };
          };
          const _0x1b4383 = _0x3d4513(_0x3a02f9);
          if (_0x1b4383.isJson && _0x1b4383.hasAngle) {
            const _0x42adee = normalizeName(_0x1b4383.name);
            const _0x461d25 = _0x1b4383.angle.toLowerCase().includes("from behind");
            _0x20ae8a = _0x461d25;
            const _0x387a7c = findBestCharacterMatch(_0x42adee, _0xf0b18c, _0x32f2d4, _0x10a2d6);
            if (_0x387a7c) {
              if (_0x387a7c.negative) {
                _0x3fe4f5.push(_0x387a7c.negative.trim());
                console.log("[CharacterPrompt] 收集负面提示词:", _0x387a7c.negative.trim());
              }
              let _0x5b63f7 = "";
              if (_0x387a7c.characterTraits) {
                _0x5b63f7 = _0x387a7c.characterTraits;
              }
              const _0x1a8136 = _0x1b4383.upperBody.toLowerCase();
              const _0x361545 = _0x1b4383.lowerBody.toLowerCase();
              if (_0x1a8136 !== "hidden") {
                const _0x27f907 = _0x461d25 ? _0x387a7c.facialFeaturesBack || "" : _0x387a7c.facialFeatures || "";
                if (_0x27f907) {
                  _0x5b63f7 += (_0x5b63f7 ? ", " : "") + _0x27f907;
                }
                if (_0x1a8136 === "sfw") {
                  const _0x51c083 = _0x461d25 ? _0x387a7c.upperBodySFWBack : _0x387a7c.upperBodySFW;
                  if (_0x51c083) {
                    _0x5b63f7 += (_0x5b63f7 ? ", " : "") + _0x51c083;
                  }
                } else if (_0x1a8136 === "nsfw") {
                  const _0x226240 = _0x461d25 ? _0x387a7c.upperBodyNSFWBack : _0x387a7c.upperBodyNSFW;
                  if (_0x226240) {
                    _0x5b63f7 += (_0x5b63f7 ? ", " : "") + _0x226240;
                  }
                }
              }
              if (_0x361545 !== "hidden") {
                if (_0x361545 === "sfw") {
                  const _0x37c023 = _0x461d25 ? _0x387a7c.fullBodySFWBack : _0x387a7c.fullBodySFW;
                  if (_0x37c023) {
                    _0x5b63f7 += (_0x5b63f7 ? ", " : "") + _0x37c023;
                  }
                } else if (_0x361545 === "nsfw") {
                  const _0x3e72fa = _0x461d25 ? _0x387a7c.fullBodyNSFWBack : _0x387a7c.fullBodyNSFW;
                  if (_0x3e72fa) {
                    _0x5b63f7 += (_0x5b63f7 ? ", " : "") + _0x3e72fa;
                  }
                }
              }
              return _0x5b63f7;
            }
          } else if (_0x1b4383.isJson && !_0x1b4383.hasAngle) {
            const _0x40cdd4 = normalizeName(_0x1b4383.name);
            const _0x33a7e0 = Object.keys(_0x32b031);
            const _0x48a32e = findBestOutfitMatch(_0x40cdd4, _0x32b031, _0x163e20, _0x33a7e0);
            if (_0x48a32e) {
              let _0x3a7cce = "";
              const _0x58f9d9 = _0x1b4383.upperBody.toLowerCase();
              const _0x1bfd0a = _0x1b4383.lowerBody.toLowerCase();
              if (_0x58f9d9 === "visible") {
                const _0x8b547 = _0x20ae8a ? _0x48a32e.upperBodyBack : _0x48a32e.upperBody;
                if (_0x8b547) {
                  _0x3a7cce = _0x8b547;
                }
              }
              if (_0x1bfd0a === "visible") {
                const _0x336780 = _0x20ae8a ? _0x48a32e.fullBodyBack : _0x48a32e.fullBody;
                if (_0x336780) {
                  _0x3a7cce += (_0x3a7cce ? ", " : "") + _0x336780;
                }
              }
              console.log("[CharacterPrompt] JSON Outfit replacement result (multi-char mode):", _0x3a7cce);
              return _0x3a7cce;
            }
            return _0x57e9fc;
          } else {
            const _0x4ba5e4 = [{
              pattern: "-sfw-upperbody-sfw-lowerbody",
              upper: "sfw",
              lower: "sfw"
            }, {
              pattern: "-sfw-upperbody-nsfw-lowerbody",
              upper: "sfw",
              lower: "nsfw"
            }, {
              pattern: "-nsfw-upperbody-sfw-lowerbody",
              upper: "nsfw",
              lower: "sfw"
            }, {
              pattern: "-nsfw-upperbody-nsfw-lowerbody",
              upper: "nsfw",
              lower: "nsfw"
            }, {
              pattern: "-sfw-upperbody-sfw-fullbody",
              upper: "sfw",
              lower: "sfw"
            }, {
              pattern: "-sfw-upperbody-nsfw-fullbody",
              upper: "sfw",
              lower: "nsfw"
            }, {
              pattern: "-nsfw-upperbody-sfw-fullbody",
              upper: "nsfw",
              lower: "sfw"
            }, {
              pattern: "-nsfw-upperbody-nsfw-fullbody",
              upper: "nsfw",
              lower: "nsfw"
            }, {
              pattern: "-sfw-upperbody",
              upper: "sfw",
              lower: null
            }, {
              pattern: "-nsfw-upperbody",
              upper: "nsfw",
              lower: null
            }, {
              pattern: "-sfw-lowerbody",
              upper: null,
              lower: "sfw"
            }, {
              pattern: "-nsfw-lowerbody",
              upper: null,
              lower: "nsfw"
            }];
            for (const _0x5bb3e1 of _0x4ba5e4) {
              if (_0x3a02f9.toLowerCase().endsWith(_0x5bb3e1.pattern)) {
                const _0x3958e6 = _0x3a02f9.slice(0, -_0x5bb3e1.pattern.length).trim();
                const _0x37cd33 = normalizeName(_0x3958e6);
                const _0x12f03d = _0x3958e6.toLowerCase().includes("from behind");
                _0x20ae8a = _0x12f03d;
                const _0xcb786c = findBestCharacterMatch(_0x37cd33, _0xf0b18c, _0x32f2d4, _0x10a2d6);
                if (_0xcb786c) {
                  if (_0xcb786c.negative) {
                    _0x3fe4f5.push(_0xcb786c.negative.trim());
                    console.log("[CharacterPrompt] 收集负面提示词:", _0xcb786c.negative.trim());
                  }
                  let _0x172feb = "";
                  if (_0xcb786c.characterTraits) {
                    _0x172feb = _0xcb786c.characterTraits;
                  }
                  if (_0x5bb3e1.upper) {
                    const _0x34e239 = _0x12f03d ? _0xcb786c.facialFeaturesBack || "" : _0xcb786c.facialFeatures || "";
                    if (_0x34e239) {
                      _0x172feb += (_0x172feb ? ", " : "") + _0x34e239;
                    }
                  }
                  if (_0x5bb3e1.upper === "sfw") {
                    const _0x251459 = _0x12f03d ? _0xcb786c.upperBodySFWBack : _0xcb786c.upperBodySFW;
                    if (_0x251459) {
                      _0x172feb += (_0x172feb ? ", " : "") + _0x251459;
                    }
                  } else if (_0x5bb3e1.upper === "nsfw") {
                    const _0x3c3676 = _0x12f03d ? _0xcb786c.upperBodyNSFWBack : _0xcb786c.upperBodyNSFW;
                    if (_0x3c3676) {
                      _0x172feb += (_0x172feb ? ", " : "") + _0x3c3676;
                    }
                  }
                  if (_0x5bb3e1.lower === "sfw") {
                    const _0xe4bd28 = _0x12f03d ? _0xcb786c.fullBodySFWBack : _0xcb786c.fullBodySFW;
                    if (_0xe4bd28) {
                      _0x172feb += (_0x172feb ? ", " : "") + _0xe4bd28;
                    }
                  } else if (_0x5bb3e1.lower === "nsfw") {
                    const _0x46ea1c = _0x12f03d ? _0xcb786c.fullBodyNSFWBack : _0xcb786c.fullBodyNSFW;
                    if (_0x46ea1c) {
                      _0x172feb += (_0x172feb ? ", " : "") + _0x46ea1c;
                    }
                  }
                  return _0x172feb;
                }
                return _0x57e9fc;
              }
            }
            const _0x31fe3a = [{
              pattern: "-upperbody-lowerbody",
              hasUpper: true,
              hasLower: true
            }, {
              pattern: "-upperbody",
              hasUpper: true,
              hasLower: false
            }, {
              pattern: "-lowerbody",
              hasUpper: false,
              hasLower: true
            }];
            for (const _0x26dae9 of _0x31fe3a) {
              if (_0x3a02f9.toLowerCase().endsWith(_0x26dae9.pattern)) {
                const _0x32bd6a = _0x3a02f9.slice(0, -_0x26dae9.pattern.length).trim();
                const _0x25676a = normalizeName(_0x32bd6a);
                const _0xf0e7de = Object.keys(_0x32b031);
                const _0x40942c = findBestOutfitMatch(_0x25676a, _0x32b031, _0x163e20, _0xf0e7de);
                if (_0x40942c) {
                  let _0x1a9b39 = "";
                  if (_0x26dae9.hasUpper) {
                    const _0x584940 = _0x20ae8a ? _0x40942c.upperBodyBack : _0x40942c.upperBody;
                    if (_0x584940) {
                      _0x1a9b39 = _0x584940;
                    }
                  }
                  if (_0x26dae9.hasLower) {
                    const _0x3c2e9a = _0x20ae8a ? _0x40942c.fullBodyBack : _0x40942c.fullBody;
                    if (_0x3c2e9a) {
                      _0x1a9b39 += (_0x1a9b39 ? ", " : "") + _0x3c2e9a;
                    }
                  }
                  return _0x1a9b39;
                }
                return _0x57e9fc;
              }
            }
          }
          return _0x57e9fc;
        });
        _0x2a7bbe[_0xd9f2f6] = _0x201ce9;
        if (_0x3fe4f5.length > 0) {
          const _0x40a62d = _0x3fe4f5.join(", ");
          if (_0x2a7bbe[_0x29779a]) {
            _0x2a7bbe[_0x29779a] += ", " + _0x40a62d;
          } else {
            _0x2a7bbe[_0x29779a] = _0x40a62d;
          }
          console.log("[CharacterPrompt] 添加负面到 " + _0x29779a + ":", _0x40a62d);
        }
      }
    }
    return reconstructPromptString(_0x2a7bbe);
  } catch (_0x55ac9e) {
    console.error("[CharacterPrompt] 分角色模式处理失败:", _0x55ac9e);
    console.log("[CharacterPrompt] 降级到非分角色模式");
    return processCharacterPrompt(_0x38ea3d.replace("Scene Composition", "SceneComposition"));
  }
}
function reconstructPromptString(_0x555f17) {
  if (!_0x555f17 || typeof _0x555f17 !== "object") {
    console.error("[CharacterPrompt] prompt_data 无效");
    return "";
  }
  let _0x131a30 = "";
  if (_0x555f17["Scene Composition"]) {
    _0x131a30 += "Scene Composition: " + _0x555f17["Scene Composition"] + ";";
  }
  for (let _0x4441a3 = 1; _0x4441a3 <= 4; _0x4441a3++) {
    const _0x12cf3e = "Character " + _0x4441a3 + " Prompt";
    const _0x472882 = "Character " + _0x4441a3 + " UC";
    const _0x4c168b = "Character " + _0x4441a3 + " centers";
    if (_0x555f17[_0x12cf3e]) {
      _0x131a30 += " " + _0x12cf3e + ": " + _0x555f17[_0x12cf3e];
      if (_0x555f17[_0x4c168b]) {
        _0x131a30 += " | centers: " + _0x555f17[_0x4c168b];
      }
      _0x131a30 += ";";
    }
    if (_0x555f17[_0x472882]) {
      _0x131a30 += " " + _0x472882 + ": " + _0x555f17[_0x472882] + ";";
    }
  }
  const _0x32491e = _0x131a30.trim();
  console.log("[CharacterPrompt] 重组后的 prompt:", _0x32491e);
  return _0x32491e;
}