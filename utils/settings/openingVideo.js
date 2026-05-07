import { extensionFolderPath } from "../config.js";
import { addLog } from "../utils.js";
import { extension_settings } from "../../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../../script.js";
import { extensionName } from "../config.js";
let hasPlayedOnce = false;
let videoContainer = null;
function generateRandomCode() {
  const _0x17d355 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let _0x497928 = "";
  for (let _0x2b0b01 = 0; _0x2b0b01 < 4; _0x2b0b01++) {
    _0x497928 += _0x17d355.charAt(Math.floor(Math.random() * _0x17d355.length));
  }
  return _0x497928;
}
function showCodeGenerationAnimation() {
  const _0x2f335c = videoContainer;
  if (!_0x2f335c) {
    return;
  }
  const _0x27d3cb = window.innerWidth <= 768;
  const _0x520751 = document.createElement("div");
  _0x520751.style.cssText = "\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        background: linear-gradient(135deg, rgba(135, 206, 235, 0.85) 0%, rgba(176, 224, 230, 0.85) 50%, rgba(224, 246, 255, 0.85) 100%);\n        z-index: 100002;\n        animation: fadeIn 0.5s ease-in;\n        padding: 20px;\n        box-sizing: border-box;\n    ";
  const _0x2f106f = document.createElement("div");
  _0x2f106f.textContent = "🎨 初次见面，让我们建立连接吧 ✨";
  _0x2f106f.style.cssText = "\n        font-size: " + (_0x27d3cb ? "18px" : "24px") + ";\n        font-weight: bold;\n        color: #2C5F8D;\n        margin-bottom: " + (_0x27d3cb ? "10px" : "15px") + ";\n        text-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);\n        font-family: \"Microsoft YaHei\", \"PingFang SC\", sans-serif;\n        animation: pulse 1.5s ease-in-out infinite;\n        text-align: center;\n    ";
  const _0x435032 = document.createElement("div");
  _0x435032.textContent = "每个构筑师都有专属的智绘姬编号哦~";
  _0x435032.style.cssText = "\n        font-size: " + (_0x27d3cb ? "14px" : "16px") + ";\n        color: #4A90C8;\n        margin-bottom: " + (_0x27d3cb ? "20px" : "30px") + ";\n        font-family: \"Microsoft YaHei\", \"PingFang SC\", sans-serif;\n        text-align: center;\n    ";
  const _0x51ce83 = document.createElement("div");
  _0x51ce83.style.cssText = "\n        font-size: " + (_0x27d3cb ? "48px" : "72px") + ";\n        font-weight: bold;\n        color: #4A90E2;\n        letter-spacing: " + (_0x27d3cb ? "10px" : "15px") + ";\n        text-shadow: 0 0 20px rgba(74, 144, 226, 0.6),\n                     0 0 40px rgba(74, 144, 226, 0.3),\n                     0 4px 8px rgba(255, 255, 255, 0.8);\n        font-family: \"Courier New\", monospace;\n        margin-bottom: " + (_0x27d3cb ? "30px" : "40px") + ";\n        min-width: " + (_0x27d3cb ? "200px" : "300px") + ";\n        text-align: center;\n        animation: glow 1s ease-in-out infinite alternate;\n    ";
  _0x51ce83.textContent = "????";
  const _0x32cdbb = document.createElement("button");
  _0x32cdbb.innerHTML = "<i class=\"fa-solid fa-wand-magic-sparkles\"></i> 生成专属智绘姬编号";
  _0x32cdbb.style.cssText = "\n        padding: " + (_0x27d3cb ? "12px 30px" : "15px 40px") + ";\n        font-size: " + (_0x27d3cb ? "16px" : "20px") + ";\n        font-weight: bold;\n        color: white;\n        background: linear-gradient(45deg, #5DADE2, #3498DB);\n        border: none;\n        border-radius: 50px;\n        cursor: pointer;\n        box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);\n        transition: all 0.3s ease;\n        font-family: \"Microsoft YaHei\", \"PingFang SC\", sans-serif;\n        animation: bounce 2s ease-in-out infinite;\n        text-align: center;\n    ";
  _0x32cdbb.onmouseover = () => {
    _0x32cdbb.style.transform = "scale(1.1)";
    _0x32cdbb.style.boxShadow = "0 12px 30px rgba(52, 152, 219, 0.6)";
  };
  _0x32cdbb.onmouseout = () => {
    _0x32cdbb.style.transform = "scale(1)";
    _0x32cdbb.style.boxShadow = "0 8px 20px rgba(52, 152, 219, 0.4)";
  };
  _0x32cdbb.onclick = () => {
    _0x32cdbb.disabled = true;
    _0x32cdbb.style.opacity = "0.5";
    _0x32cdbb.style.cursor = "not-allowed";
    let _0x46e830 = 0;
    const _0xb155ae = 20;
    const _0x527430 = setInterval(() => {
      _0x51ce83.textContent = generateRandomCode();
      _0x46e830++;
      if (_0x46e830 >= _0xb155ae) {
        clearInterval(_0x527430);
        const _0x53f505 = generateRandomCode();
        _0x51ce83.textContent = _0x53f505;
        const _0x416058 = extension_settings[extensionName];
        if (_0x416058) {
          _0x416058.chatu8_code = _0x53f505;
          saveSettingsDebounced();
          addLog("[OpeningVideo] 智绘姬编号已保存: " + _0x53f505);
        }
        _0x51ce83.style.animation = "flash 0.5s ease-in-out 3";
        addLog("[OpeningVideo] 生成智绘姬编号: " + _0x53f505);
        setTimeout(() => {
          const _0x4fa9d0 = document.createElement("div");
          _0x4fa9d0.innerHTML = "\n                        <div style=\"font-size: " + (_0x27d3cb ? "18px" : "24px") + "; color: #2C5F8D; margin-top: 20px; animation: fadeIn 0.5s ease-in; text-align: center; font-weight: bold;\">\n                            ✨ 你的专属智绘姬编号是：<span style=\"color: #4A90E2; font-weight: bold; text-shadow: 0 2px 8px rgba(74, 144, 226, 0.4);\">" + _0x53f505 + "</span>\n                        </div>\n                        <div style=\"font-size: " + (_0x27d3cb ? "14px" : "16px") + "; color: #5DADE2; margin-top: 15px; text-align: center; line-height: 1.6;\">\n                            从现在开始，我会陪伴你使用这个插件！<br>\n                            有任何疑问都可以问我哦~ 💖\n                        </div>\n                    ";
          _0x520751.appendChild(_0x4fa9d0);
          setTimeout(() => {
            const _0x5e436f = document.createElement("button");
            _0x5e436f.innerHTML = "<i class=\"fa-solid fa-comments\"></i> 开始与智绘姬对话";
            _0x5e436f.style.cssText = "\n                            margin-top: 30px;\n                            padding: " + (_0x27d3cb ? "12px 35px" : "15px 45px") + ";\n                            font-size: " + (_0x27d3cb ? "16px" : "20px") + ";\n                            font-weight: bold;\n                            color: white;\n                            background: linear-gradient(45deg, #5DADE2, #3498DB);\n                            border: 2px solid rgba(255, 255, 255, 0.5);\n                            border-radius: 50px;\n                            cursor: pointer;\n                            box-shadow: 0 8px 25px rgba(52, 152, 219, 0.5);\n                            transition: all 0.3s ease;\n                            font-family: \"Microsoft YaHei\", \"PingFang SC\", sans-serif;\n                            animation: fadeIn 0.5s ease-in, glow 2s ease-in-out infinite alternate;\n                        ";
            _0x5e436f.onmouseover = () => {
              _0x5e436f.style.transform = "scale(1.05) translateY(-2px)";
              _0x5e436f.style.boxShadow = "0 12px 35px rgba(52, 152, 219, 0.7)";
            };
            _0x5e436f.onmouseout = () => {
              _0x5e436f.style.transform = "scale(1) translateY(0)";
              _0x5e436f.style.boxShadow = "0 8px 25px rgba(52, 152, 219, 0.5)";
            };
            _0x5e436f.onclick = () => {
              _0x5e436f.style.transform = "scale(0.95)";
              _0x5e436f.disabled = true;
              _0x5e436f.style.opacity = "0.5";
              _0x4fa9d0.style.animation = "fadeOut 0.5s ease-out";
              _0x5e436f.style.animation = "fadeOut 0.5s ease-out";
              setTimeout(() => {
                _0x4fa9d0.remove();
                _0x5e436f.remove();
                const _0x5e2ef0 = document.createElement("div");
                _0x5e2ef0.innerHTML = "\n                                    <div style=\"font-size: " + (_0x27d3cb ? "20px" : "28px") + "; color: #2C5F8D; margin-bottom: 20px; animation: fadeIn 0.8s ease-in; text-align: center; font-weight: bold;\">\n                                        你好，构筑师！👋\n                                    </div>\n                                    <div style=\"font-size: " + (_0x27d3cb ? "16px" : "20px") + "; color: #4A90E2; margin-bottom: 15px; animation: fadeIn 1s ease-in; text-align: center; line-height: 1.8;\">\n                                        我是编号 <span style=\"color: #3498DB; font-weight: bold; letter-spacing: 2px;\">" + _0x53f505 + "</span> 的智绘姬<br>\n                                        很高兴认识你！✨\n                                    </div>\n                                    <div style=\"font-size: " + (_0x27d3cb ? "14px" : "16px") + "; color: #5DADE2; margin-top: 20px; animation: fadeIn 1.2s ease-in; text-align: center; line-height: 1.8;\">\n                                        以后你可以通过以下方式召唤我：<br>\n                                        📍 点击设置界面左上角的头像<br>\n                                        📍 长按悬浮球（智绘姬图标）<br><br>\n                                        现在，让我们先配置一下我的 API 吧~ 💖\n                                    </div>\n                                ";
                _0x520751.appendChild(_0x5e2ef0);
                setTimeout(() => {
                  const _0xc43669 = document.createElement("button");
                  _0xc43669.innerHTML = "<i class=\"fa-solid fa-gear\"></i> 开始设置 API";
                  _0xc43669.style.cssText = "\n                                        margin-top: 30px;\n                                        padding: " + (_0x27d3cb ? "12px 35px" : "15px 45px") + ";\n                                        font-size: " + (_0x27d3cb ? "16px" : "20px") + ";\n                                        font-weight: bold;\n                                        color: white;\n                                        background: linear-gradient(45deg, #5DADE2, #3498DB);\n                                        border: 2px solid rgba(255, 255, 255, 0.5);\n                                        border-radius: 50px;\n                                        cursor: pointer;\n                                        box-shadow: 0 8px 25px rgba(52, 152, 219, 0.5);\n                                        transition: all 0.3s ease;\n                                        font-family: \"Microsoft YaHei\", \"PingFang SC\", sans-serif;\n                                        animation: fadeIn 0.5s ease-in, glow 2s ease-in-out infinite alternate;\n                                    ";
                  _0xc43669.onmouseover = () => {
                    _0xc43669.style.transform = "scale(1.05) translateY(-2px)";
                    _0xc43669.style.boxShadow = "0 12px 35px rgba(52, 152, 219, 0.7)";
                  };
                  _0xc43669.onmouseout = () => {
                    _0xc43669.style.transform = "scale(1) translateY(0)";
                    _0xc43669.style.boxShadow = "0 8px 25px rgba(52, 152, 219, 0.5)";
                  };
                  _0xc43669.onclick = () => {
                    _0xc43669.style.transform = "scale(0.95)";
                    setTimeout(() => {
                      _0x520751.style.animation = "fadeOut 0.8s ease-out";
                      setTimeout(() => {
                        _0x520751.remove();
                        closeVideo();
                        setTimeout(() => {
                          const _0x37fb4a = document.getElementById("st-chatu8-ai-dialog");
                          if (_0x37fb4a && !_0x37fb4a.classList.contains("active")) {
                            const _0x34aaae = _0x37fb4a.offsetWidth;
                            const _0x4d31a3 = _0x37fb4a.offsetHeight;
                            const _0x431983 = window.innerWidth;
                            const _0x4476f8 = window.innerHeight;
                            const _0x62b875 = (_0x431983 - _0x34aaae) / 2;
                            const _0x486549 = (_0x4476f8 - _0x4d31a3) / 2;
                            _0x37fb4a.style.left = Math.max(0, _0x62b875) + "px";
                            _0x37fb4a.style.top = Math.max(0, _0x486549) + "px";
                            _0x37fb4a.classList.add("active");
                            const _0x53c928 = document.getElementById("st-chatu8-ai-settings-panel");
                            if (_0x53c928) {
                              _0x53c928.classList.add("active");
                              addLog("[OpeningVideo] 已打开智绘姬AI助手API设置面板");
                            }
                          }
                        }, 300);
                      }, 800);
                    }, 200);
                  };
                  _0x520751.appendChild(_0xc43669);
                }, 3000);
              }, 500);
            };
            _0x520751.appendChild(_0x5e436f);
          }, 800);
        }, 500);
      }
    }, 100);
  };
  _0x520751.appendChild(_0x2f106f);
  _0x520751.appendChild(_0x435032);
  _0x520751.appendChild(_0x51ce83);
  _0x520751.appendChild(_0x32cdbb);
  _0x2f335c.appendChild(_0x520751);
}
function createVideoContainer() {
  if (videoContainer) {
    return videoContainer;
  }
  videoContainer = document.createElement("div");
  videoContainer.id = "st-chatu8-opening-video-container";
  videoContainer.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100vw;\n        height: 100vh;\n        background: rgba(0, 0, 0, 0.95);\n        z-index: 99999;\n        display: none;\n        justify-content: center;\n        align-items: center;\n    ";
  const _0xec80a8 = document.createElement("style");
  _0xec80a8.textContent = "\n        @keyframes fadeIn {\n            from { opacity: 0; }\n            to { opacity: 1; }\n        }\n        @keyframes fadeOut {\n            from { opacity: 1; }\n            to { opacity: 0; }\n        }\n        @keyframes pulse {\n            0%, 100% { transform: scale(1); }\n            50% { transform: scale(1.05); }\n        }\n        @keyframes glow {\n            from { text-shadow: 0 0 15px rgba(74, 144, 226, 0.4), 0 0 30px rgba(74, 144, 226, 0.2); }\n            to { text-shadow: 0 0 20px rgba(74, 144, 226, 0.6), 0 0 40px rgba(74, 144, 226, 0.3); }\n        }\n        @keyframes bounce {\n            0%, 100% { transform: translateY(0); }\n            50% { transform: translateY(-10px); }\n        }\n        @keyframes flash {\n            0%, 100% { opacity: 1; transform: scale(1); }\n            50% { opacity: 0.5; transform: scale(1.2); }\n        }\n    ";
  document.head.appendChild(_0xec80a8);
  const _0x3263ae = document.createElement("video");
  _0x3263ae.id = "st-chatu8-opening-video";
  _0x3263ae.style.cssText = "\n        max-width: 100%;\n        max-height: 100%;\n        object-fit: contain;\n    ";
  _0x3263ae.autoplay = true;
  _0x3263ae.playsInline = true;
  const _0x4381dd = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  _0x3263ae.muted = _0x4381dd;
  let _0x1b7714 = null;
  if (_0x4381dd) {
    _0x1b7714 = document.createElement("button");
    _0x1b7714.innerHTML = "<i class=\"fa-solid fa-volume-xmark\"></i>";
    _0x1b7714.style.cssText = "\n            position: absolute;\n            top: 20px;\n            left: 20px;\n            padding: 10px 15px;\n            background: rgba(255, 255, 255, 0.2);\n            color: white;\n            border: 1px solid rgba(255, 255, 255, 0.5);\n            border-radius: 5px;\n            cursor: pointer;\n            font-size: 18px;\n            transition: background 0.3s;\n            z-index: 100000;\n        ";
    _0x1b7714.onclick = () => {
      _0x3263ae.muted = !_0x3263ae.muted;
      _0x1b7714.innerHTML = _0x3263ae.muted ? "<i class=\"fa-solid fa-volume-xmark\"></i>" : "<i class=\"fa-solid fa-volume-high\"></i>";
    };
  }
  const _0x302300 = extensionFolderPath + "/html/settings/enter.chatu8";
  fetch(_0x302300).then(_0x3141c2 => {
    if (!_0x3141c2.ok) {
      throw new Error("enter.chatu8 load failed");
    }
    return _0x3141c2.blob();
  }).then(_0x13cfe1 => {
    if (_0x13cfe1.type !== "video/mp4") {
      _0x3263ae.src = URL.createObjectURL(new Blob([_0x13cfe1], {
        type: "video/mp4"
      }));
    } else {
      _0x3263ae.src = URL.createObjectURL(_0x13cfe1);
    }
  }).catch(_0x1a0e92 => {
    console.warn("[OpeningVideo] 新版视频格式加载失败或未更新，尝试回退:", _0x1a0e92);
    const _0x568041 = ["mp4", "webm", "ogg"];
    for (const _0x488db1 of _0x568041) {
      const _0x3618ba = document.createElement("source");
      const _0xd7ea4c = encodeURIComponent("登场") + "." + _0x488db1;
      _0x3618ba.src = extensionFolderPath + "/html/settings/" + _0xd7ea4c;
      _0x3618ba.type = "video/" + _0x488db1;
      _0x3263ae.appendChild(_0x3618ba);
    }
  });
  const _0x559cbe = document.createElement("button");
  _0x559cbe.textContent = "跳过 (ESC)";
  _0x559cbe.style.cssText = "\n        position: absolute;\n        top: 20px;\n        right: 20px;\n        padding: 10px 20px;\n        background: rgba(255, 255, 255, 0.2);\n        color: white;\n        border: 1px solid rgba(255, 255, 255, 0.5);\n        border-radius: 5px;\n        cursor: pointer;\n        font-size: 14px;\n        transition: background 0.3s;\n        z-index: 100000;\n    ";
  _0x559cbe.onmouseover = () => {
    _0x559cbe.style.background = "rgba(255, 255, 255, 0.4)";
  };
  _0x559cbe.onmouseout = () => {
    _0x559cbe.style.background = "rgba(255, 255, 255, 0.2)";
  };
  videoContainer.appendChild(_0x3263ae);
  if (_0x1b7714) {
    videoContainer.appendChild(_0x1b7714);
  }
  videoContainer.appendChild(_0x559cbe);
  document.body.appendChild(videoContainer);
  _0x3263ae.addEventListener("ended", () => {
    _0x559cbe.style.display = "none";
    if (_0x1b7714) {
      _0x1b7714.style.display = "none";
    }
    showCodeGenerationAnimation();
  });
  _0x559cbe.addEventListener("click", _0x15e198 => {
    _0x15e198.stopPropagation();
    _0x3263ae.pause();
    _0x3263ae.currentTime = _0x3263ae.duration;
    _0x559cbe.style.display = "none";
    if (_0x1b7714) {
      _0x1b7714.style.display = "none";
    }
    showCodeGenerationAnimation();
  });
  const _0x141fe9 = _0x4bf878 => {
    if (_0x4bf878.key === "Escape" && videoContainer.style.display === "flex") {
      _0x3263ae.pause();
      _0x3263ae.currentTime = _0x3263ae.duration;
      _0x559cbe.style.display = "none";
      if (_0x1b7714) {
        _0x1b7714.style.display = "none";
      }
      showCodeGenerationAnimation();
    }
  };
  document.addEventListener("keydown", _0x141fe9);
  videoContainer.addEventListener("click", _0x348365 => {
    if (_0x348365.target === videoContainer) {
      _0x3263ae.pause();
      _0x3263ae.currentTime = _0x3263ae.duration;
      _0x559cbe.style.display = "none";
      if (_0x1b7714) {
        _0x1b7714.style.display = "none";
      }
      showCodeGenerationAnimation();
    }
  });
  return videoContainer;
}
export function playOpeningVideo() {
  const _0x3e9361 = extension_settings[extensionName];
  if (_0x3e9361 && _0x3e9361.chatu8_code) {
    addLog("[OpeningVideo] 已有智绘姬编号 " + _0x3e9361.chatu8_code + "，跳过开场视频");
    return;
  }
  if (hasPlayedOnce) {
    addLog("[OpeningVideo] 本次会话已播放过开场视频，跳过");
    return;
  }
  try {
    const _0x565574 = createVideoContainer();
    const _0xe222fa = _0x565574.querySelector("video");
    if (!_0xe222fa) {
      console.error("[OpeningVideo] 视频元素未找到");
      return;
    }
    _0x565574.style.display = "flex";
    const _0x42c870 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const _0x252a11 = () => {
      _0xe222fa.removeEventListener("canplay", _0x252a11);
      const _0x47fc78 = _0xe222fa.play();
      if (_0x47fc78 !== undefined) {
        _0x47fc78.then(() => {
          addLog("[OpeningVideo] 开场视频播放成功");
          hasPlayedOnce = true;
          if (_0x42c870 && _0xe222fa.muted) {
            const _0x21e8f1 = document.createElement("div");
            _0x21e8f1.textContent = "点击左上角图标开启声音";
            _0x21e8f1.style.cssText = "\n                                position: absolute;\n                                bottom: 80px;\n                                left: 50%;\n                                transform: translateX(-50%);\n                                padding: 10px 20px;\n                                background: rgba(0, 0, 0, 0.7);\n                                color: white;\n                                border-radius: 5px;\n                                font-size: 14px;\n                                z-index: 100001;\n                                animation: fadeOut 3s forwards;\n                            ";
            _0x565574.appendChild(_0x21e8f1);
            setTimeout(() => _0x21e8f1.remove(), 3000);
          }
        }).catch(_0x2a3b47 => {
          console.error("[OpeningVideo] 视频播放失败:", _0x2a3b47);
          addLog("[OpeningVideo] 视频播放失败: " + _0x2a3b47.message);
          if (_0x42c870) {
            const _0x542539 = document.createElement("button");
            _0x542539.innerHTML = "<i class=\"fa-solid fa-play\"></i> 点击播放";
            _0x542539.style.cssText = "\n                                position: absolute;\n                                top: 50%;\n                                left: 50%;\n                                transform: translate(-50%, -50%);\n                                padding: 15px 30px;\n                                background: rgba(255, 255, 255, 0.9);\n                                color: #333;\n                                border: none;\n                                border-radius: 8px;\n                                cursor: pointer;\n                                font-size: 18px;\n                                font-weight: bold;\n                                z-index: 100001;\n                            ";
            _0x542539.onclick = () => {
              _0xe222fa.play().then(() => {
                _0x542539.remove();
                hasPlayedOnce = true;
              }).catch(_0x5aa9f4 => {
                console.error("[OpeningVideo] 手动播放也失败:", _0x5aa9f4);
                closeVideo();
              });
            };
            _0x565574.appendChild(_0x542539);
          } else {
            closeVideo();
          }
        });
      }
    };
    const _0x25d3fb = _0x3cc414 => {
      const _0xfbf3ca = _0xe222fa.querySelectorAll("source");
      const _0x5a70cf = Array.from(_0xfbf3ca).every(_0x48b8ac => {
        return _0x48b8ac.error !== null;
      });
      if (_0x5a70cf) {
        console.warn("[OpeningVideo] 所有视频格式都加载失败，视频文件可能不存在");
        addLog("[OpeningVideo] 视频文件未找到，已跳过播放");
        closeVideo();
        _0xe222fa.removeEventListener("error", _0x25d3fb);
      }
    };
    _0xe222fa.addEventListener("canplay", _0x252a11);
    _0xe222fa.addEventListener("error", _0x25d3fb);
    setTimeout(() => {
      if (_0x565574.style.display === "flex" && _0xe222fa.paused && !_0x565574.querySelector("button[onclick]")) {
        addLog("[OpeningVideo] 视频加载超时，已跳过");
        closeVideo();
      }
    }, 3000);
  } catch (_0xdc008b) {
    console.error("[OpeningVideo] 播放开场视频时出错:", _0xdc008b);
    closeVideo();
  }
}
function closeVideo() {
  if (!videoContainer) {
    return;
  }
  videoContainer.style.animation = "fadeOut 0.5s ease-out";
  setTimeout(() => {
    videoContainer.style.display = "none";
    videoContainer.style.animation = "";
  }, 500);
  addLog("[OpeningVideo] 开场视频已关闭");
}
export function resetOpeningVideoState() {
  hasPlayedOnce = false;
  addLog("[OpeningVideo] 播放状态已重置");
}