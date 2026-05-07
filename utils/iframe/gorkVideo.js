import { createUnifiedDialog, createUnifiedInput, createButtonContainer } from "./dialogs.js";
let _triggerGeneration = null;
export function setGorkTriggerGeneration(_0x2af262) {
  _triggerGeneration = _0x2af262;
}
function isMobileDeviceDialog() {
  return window.top.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
export function showGorkVideoDialog(_0x4cb1ec, _0x22e68c) {
  const _0x28ea4c = _0x4cb1ec.src;
  const _0x4fbf16 = isMobileDeviceDialog();
  const {
    backdrop: _0x285973,
    dialog: _0x30e648,
    closeDialog: _0x1f6d79
  } = createUnifiedDialog({
    title: "🎬 Gork 生成视频",
    isMobile: _0x4fbf16
  });
  const _0x142270 = document.createElement("img");
  _0x142270.src = _0x28ea4c;
  _0x142270.style.display = "block";
  _0x142270.style.maxWidth = "100%";
  _0x142270.style.maxHeight = "30vh";
  _0x142270.style.objectFit = "contain";
  _0x142270.style.margin = "0 auto 15px auto";
  _0x142270.style.borderRadius = "8px";
  const _0x179552 = {
    placeholder: "输入视频生成指令，例如：\"让人物挥手微笑\"",
    value: _0x22e68c.dataset.videoPrompt || "",
    rows: 2
  };
  const _0xfd4ec2 = createUnifiedInput(_0x179552);
  const _0x546ae7 = () => {
    const _0x491fc0 = _0xfd4ec2.value.trim();
    if (!_0x491fc0) {
      toastr.warning("请输入视频生成指令。");
      return;
    }
    _0x22e68c.dataset.videoPrompt = _0x491fc0;
    _0x22e68c.dataset.videoImage = _0x28ea4c;
    if (!_0x22e68c.dataset.change) {
      _0x22e68c.dataset.change = _0x22e68c.dataset.link;
    }
    _0x22e68c.dataset.change = _0x22e68c.dataset.change + "{视频}";
    toastr.info("正在准备生成视频...");
    if (_triggerGeneration) {
      _triggerGeneration(_0x22e68c);
    }
    _0x1f6d79();
  };
  const _0x285034 = {
    text: "发送",
    className: "send",
    onClick: _0x546ae7
  };
  const _0x3d698b = createButtonContainer([_0x285034, {
    text: "取消",
    className: "cancel",
    onClick: _0x1f6d79
  }]);
  _0x30e648.appendChild(_0x142270);
  _0x30e648.appendChild(_0xfd4ec2);
  _0x30e648.appendChild(_0x3d698b);
  _0xfd4ec2.focus();
}