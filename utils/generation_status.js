const currentlyGenerating = new Set();
export function isGenerating(_0x401821) {
  return currentlyGenerating.has(_0x401821);
}
export function startGenerating(_0x1ae81e) {
  currentlyGenerating.add(_0x1ae81e);
}
export function stopGenerating(_0x399d8f) {
  currentlyGenerating.delete(_0x399d8f);
}