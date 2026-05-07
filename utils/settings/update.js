import { extensionFolderPath } from "../config.js";
async function checkForUpdates() {
  try {
    const _0x1b0672 = await fetch(extensionFolderPath + "/manifest.json?t=" + new Date().getTime(), {
      cache: "no-cache"
    });
    if (_0x1b0672.ok) {
      const _0x58b05c = await _0x1b0672.json();
      const _0x222247 = _0x58b05c.version;
      window.chatu8LocalVersion = _0x222247;
    } else {
      console.error("Failed to fetch local manifest for version check.");
    }
  } catch (_0x26786f) {
    console.error("Error fetching local manifest:", _0x26786f);
  }
  const _0x17e668 = document.getElementById("ch-update-notes");
  console.log("Checking for updates...", _0x17e668);
  try {
    const _0x4d2e3a = "https://raw.githubusercontent.com/damoshen123/st-chatu8/master/manifest.json?t=" + new Date().getTime();
    const _0x187d20 = await fetch(_0x4d2e3a, {
      cache: "no-cache"
    });
    if (!_0x187d20.ok) {
      console.error("Failed to fetch remote manifest for update check.");
      if (_0x17e668) {
        _0x17e668.value = "无法获取最新更新，尝试点击更新按钮，检查更新。";
      }
      window.chatu8UpdateAvailable = false;
      return;
    }
    const _0x4b6818 = await _0x187d20.json();
    const _0x4485ff = _0x4b6818.version;
    window.chatu8RemoteVersion = _0x4485ff;
    if (_0x17e668 && _0x4b6818.updata) {
      _0x17e668.value = _0x4b6818.updata;
    }
    if (window.chatu8LocalVersion) {
      if (_0x4485ff.localeCompare(window.chatu8LocalVersion, undefined, {
        numeric: true,
        sensitivity: "base"
      }) > 0) {
        console.log("New version available: " + _0x4485ff + " (current: " + window.chatu8LocalVersion + ")");
        window.chatu8UpdateAvailable = true;
      } else {
        console.log("Extension is up to date.");
        window.chatu8UpdateAvailable = false;
      }
    } else {
      window.chatu8UpdateAvailable = false;
    }
  } catch (_0x30d901) {
    console.error("Error checking for updates:", _0x30d901);
    if (_0x17e668) {
      _0x17e668.value = "无法获取最新更新，尝试点击更新按钮，检查更新。";
    }
    window.chatu8UpdateAvailable = false;
  }
}
function updateVersionInfo() {
  const _0x44a08c = document.getElementById("ch-version-display");
  if (_0x44a08c && window.chatu8LocalVersion) {
    _0x44a08c.textContent = "v" + window.chatu8LocalVersion;
  }
  const _0x5b6bc0 = document.getElementById("ch-update-indicator");
  const _0x38f38d = document.getElementById("ch-title-update-notification");
  if (window.chatu8UpdateAvailable) {
    if (_0x5b6bc0) {
      _0x5b6bc0.style.display = "inline";
    }
    if (_0x38f38d) {
      _0x38f38d.style.display = "inline";
    }
  }
}
export async function initUpdateCheck(_0xe87581, _0x486506) {
  _0xe87581.find("#ch-check-update").on("click", _0x486506);
  await checkForUpdates();
  updateVersionInfo();
}