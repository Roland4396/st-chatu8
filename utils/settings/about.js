const DISCLAIMER_CONTENT = "\n    <div class=\"st-chatu8-settings-section\">\n        <h3>⚖️ 正当使用声明</h3>\n        <div class=\"st-chatu8-disclaimer\">\n            <p><strong>本插件仅供以下用途：</strong></p>\n            <ul>\n                <li>🎨 个人创作与艺术探索</li>\n                <li>📚 学习研究与技术测试</li>\n                <li>🎮 角色扮演与娱乐互动</li>\n            </ul>\n            <p>用户应当遵守所在地区的相关法律法规，合理、合法地使用本插件。</p>\n        </div>\n    </div>\n    <div class=\"st-chatu8-settings-section\">\n        <h3>⚠️ 免责声明</h3>\n        <div class=\"st-chatu8-disclaimer\">\n            <p><strong>关于内容责任：</strong></p>\n            <ul>\n                <li>本插件仅作为图像生成的桥接工具，不直接生成任何图像内容</li>\n                <li>所有生成的图像均由用户选择的第三方AI服务提供</li>\n                <li>用户生成的所有内容由用户自行负责，与插件作者无关</li>\n            </ul>\n            <p><strong>关于使用风险：</strong></p>\n            <ul>\n                <li>用户应确保生成内容符合所在地区法律法规</li>\n                <li>禁止使用本插件生成任何违法违规内容</li>\n                <li>禁止将生成内容用于任何非法用途或未经授权的商业用途</li>\n                <li>因使用本插件产生的任何法律责任或后果，由用户自行承担</li>\n            </ul>\n            <p style=\"color: var(--SmartThemeQuoteColor); font-style: italic; margin-top: 10px;\">\n                使用本插件即表示您已阅读并同意上述声明。\n            </p>\n        </div>\n    </div>\n    <div class=\"st-chatu8-settings-section\">\n        <h3>💰 关于收费</h3>\n        <div class=\"st-chatu8-disclaimer\">\n            <p><strong>本插件完全免费！</strong></p>\n            <ul>\n                <li>🆓 本插件为免费软件，任何人都可以免费使用</li>\n                <li>🚫 如果您是通过付费渠道获得本插件，您已被骗</li>\n                <li>⚠️ 请勿将本插件用于任何形式的倒卖或收费分发</li>\n                <li>💝 如果觉得好用，欢迎通过\"支持作者\"链接自愿打赏</li>\n            </ul>\n        </div>\n    </div>\n";
export function getAboutPageContent() {
  const _0x2fdf4b = "\n<div id=\"ch-tab-about\">\n    <div class=\"st-chatu8-settings-section\">\n        <h3>关于 智绘姬 🖼️</h3>\n        <p>插件作者: 从前跟你一样</p>\n        <div class=\"st-chatu8-about-links\">\n            <a href=\"https://afdian.com/a/cqgnyy\" target=\"_blank\" class=\"st-chatu8-about-link support\">\n                <i class=\"fa-solid fa-heart\"></i>\n                <span>支持作者</span>\n                <span class=\"st-chatu8-cute-emoji\">💖</span>\n            </a>\n            <a href=\"https://gxcgf4l6b2y.feishu.cn/wiki/UXtHw83pmiHnx1k4WpwcIn79nec?from=from_copylink\" target=\"_blank\" class=\"st-chatu8-about-link help\">\n                <i class=\"fa-solid fa-circle-question\"></i>\n                <span>查看帮助</span>\n                <span class=\"st-chatu8-cute-emoji\">❓</span>\n            </a>\n        </div>\n    </div>\n    <div class=\"st-chatu8-settings-section\">\n        <h3>检查更新</h3>\n        <button id=\"ch-check-update\" class=\"st-chatu8-btn\">检查更新</button>\n        <div class=\"st-chatu8-field-col\" style=\"margin-top: 10px;\">\n            <label for=\"ch-update-notes\">更新说明</label>\n            <textarea id=\"ch-update-notes\" class=\"st-chatu8-textarea\" rows=\"5\" readonly></textarea>\n        </div>\n    </div>\n    " + DISCLAIMER_CONTENT + "\n</div>\n";
  return _0x2fdf4b;
}
export function injectProtectedDisclaimer(_0x3d9f0e) {
  if (!_0x3d9f0e) {
    return;
  }
  const _0x44315d = _0x3d9f0e.querySelector("#ch-tab-about");
  if (!_0x44315d) {
    return;
  }
  const _0x964035 = _0x44315d.querySelectorAll(".st-chatu8-disclaimer");
  _0x964035.forEach(_0x5f291b => {
    const _0x36d786 = _0x5f291b.closest(".st-chatu8-settings-section");
    if (_0x36d786) {
      _0x36d786.remove();
    }
  });
  _0x44315d.insertAdjacentHTML("beforeend", DISCLAIMER_CONTENT);
}
export function initAboutProtection(_0x5e7de0) {
  if (!_0x5e7de0) {
    return;
  }
  const _0x27df09 = _0x5e7de0.querySelector("#st-chatu8-tab-about");
  if (!_0x27df09) {
    return;
  }
  injectProtectedDisclaimer(_0x27df09);
  const _0x3e9c54 = new MutationObserver(_0x3efc18 => {
    let _0x1f5d28 = false;
    for (const _0x3881aa of _0x3efc18) {
      if (_0x3881aa.removedNodes.length > 0) {
        for (const _0x5d7c1c of _0x3881aa.removedNodes) {
          if (_0x5d7c1c.nodeType === Node.ELEMENT_NODE) {
            const _0x336187 = _0x5d7c1c;
            if (_0x336187.classList?.contains("st-chatu8-disclaimer") || _0x336187.querySelector?.(".st-chatu8-disclaimer")) {
              _0x1f5d28 = true;
              break;
            }
          }
        }
      }
      if (_0x3881aa.type === "characterData") {
        const _0x45841c = _0x3881aa.target.parentElement;
        if (_0x45841c?.closest(".st-chatu8-disclaimer")) {
          _0x1f5d28 = true;
        }
      }
    }
    if (_0x1f5d28) {
      console.warn("[About] 检测到声明内容被修改，正在恢复...");
      injectProtectedDisclaimer(_0x27df09);
    }
  });
  _0x3e9c54.observe(_0x27df09, {
    childList: true,
    subtree: true,
    characterData: true
  });
}