import { taskQueue, TaskStatus, TaskType } from "../taskQueue.js";
import { eventSource } from "../../../../../../script.js";
import { extension_settings } from "../../../../../extensions.js";
import { extensionName } from "../config.js";
const _0xfb1ae = {
  [TaskStatus.QUEUED]: "⏳",
  [TaskStatus.RUNNING]: "🔄",
  [TaskStatus.COMPLETED]: "✅",
  [TaskStatus.CANCELLED]: "❌",
  [TaskStatus.FAILED]: "⚠️"
};
const statusIcons = _0xfb1ae;
const _0x1ab0bc = {
  [TaskStatus.QUEUED]: "排队中",
  [TaskStatus.RUNNING]: "运行中",
  [TaskStatus.COMPLETED]: "已完成",
  [TaskStatus.CANCELLED]: "已取消",
  [TaskStatus.FAILED]: "失败"
};
const statusTexts = _0x1ab0bc;
const _0x5c3806 = {
  [TaskType.BUTTON]: "按钮",
  [TaskType.COMFYUI]: "ComfyUI",
  [TaskType.NOVELAI]: "NovelAI",
  [TaskType.AUTO_CLICK]: "自动点击",
  [TaskType.LLM]: "LLM",
  [TaskType.BANANA]: "Banana"
};
const typeTexts = _0x5c3806;
function renderTaskList(_0x370fcf) {
  const _0x4c2ec0 = document.getElementById("ch-task-list");
  if (!_0x4c2ec0) {
    return;
  }
  if (_0x370fcf.length === 0) {
    _0x4c2ec0.innerHTML = "<div class=\"st-chatu8-task-empty\">暂无任务</div>";
    return;
  }
  const _0x46c203 = _0x370fcf.map(_0x5808fe => {
    const _0x22ccda = statusIcons[_0x5808fe.status] || "❓";
    const _0x3b0c2e = statusTexts[_0x5808fe.status] || _0x5808fe.status;
    const _0x1f5e58 = typeTexts[_0x5808fe.type] || _0x5808fe.type;
    const _0x4a12b4 = _0x5808fe.status === TaskStatus.QUEUED || _0x5808fe.status === TaskStatus.RUNNING;
    return "\n            <div class=\"st-chatu8-task-item\" data-task-id=\"" + _0x5808fe.id + "\">\n                <span class=\"task-icon\">" + _0x22ccda + "</span>\n                <span class=\"task-info\">\n                    <span class=\"task-name\" title=\"" + (_0x5808fe.prompt || _0x5808fe.name) + "\">" + _0x5808fe.name + "</span>\n                    <span class=\"task-meta\">" + _0x1f5e58 + " · " + _0x3b0c2e + "</span>\n                </span>\n                " + (_0x4a12b4 ? "<button class=\"task-cancel-btn\" data-task-id=\"" + _0x5808fe.id + "\" title=\"取消任务\">❌</button>" : "") + "\n            </div>\n        ";
  }).join("");
  _0x4c2ec0.innerHTML = _0x46c203;
  _0x4c2ec0.querySelectorAll(".task-cancel-btn").forEach(_0x15fa9b => {
    _0x15fa9b.addEventListener("click", _0xa1b995 => {
      _0xa1b995.stopPropagation();
      const _0x539a7b = _0x15fa9b.getAttribute("data-task-id");
      handleCancelTask(_0x539a7b);
    });
  });
}
function handleCancelTask(_0x586e8f) {
  const _0x5e8127 = taskQueue.tasks.get(_0x586e8f);
  if (!_0x5e8127) {
    return;
  }
  const _0x424719 = taskQueue.cancelTask(_0x586e8f);
  if (_0x424719) {
    if (_0x5e8127.type === TaskType.AUTO_CLICK) {
      window.zidongdianji = false;
      console.log("[TaskManager] 已停止自动点击任务");
    } else if (_0x5e8127.type === TaskType.LLM) {
      const _0x436814 = {
        taskId: _0x586e8f
      };
      eventSource.emit("st_chatu8_cancel_llm_task", _0x436814);
      console.log("[TaskManager] 已触发 LLM 取消事件");
    } else if (_0x5e8127.type === TaskType.NOVELAI) {
      const _0xaef9ae = {
        taskId: _0x586e8f
      };
      eventSource.emit("st_chatu8_cancel_novelai_task", _0xaef9ae);
      console.log("[TaskManager] 已触发 NovelAI 取消事件");
    } else if (_0x5e8127.type === TaskType.BANANA) {
      const _0x5bc1d3 = {
        taskId: _0x586e8f
      };
      eventSource.emit("st_chatu8_cancel_banana_task", _0x5bc1d3);
      console.log("[TaskManager] 已触发 Banana 取消事件");
    } else if (extension_settings[extensionName]?.client === "jiuguan") {
      eventSource.emit("sd_stop_generation");
      console.log("[TaskManager] 已通知酒馆取消任务");
    } else {
      const _0x357928 = {
        taskId: _0x586e8f
      };
      eventSource.emit("st_chatu8_cancel_task", _0x357928);
      console.log("[TaskManager] 已触发直连取消事件");
    }
  }
  toastr.info("任务已取消");
}
function handleCancelAll() {
  const _0x2cfc53 = Array.from(taskQueue.tasks.values()).filter(_0x29f3be => _0x29f3be.status === TaskStatus.RUNNING);
  taskQueue.cancelAllQueued();
  for (const _0x53bdaf of _0x2cfc53) {
    handleCancelTask(_0x53bdaf.id);
  }
  toastr.info("已取消所有任务");
}
function handleClearCompleted() {
  taskQueue.clearCompleted();
  toastr.info("已清空已完成任务");
}
function updateStats(_0x33c884) {
  const _0x27edda = document.getElementById("ch-task-stats");
  if (!_0x27edda) {
    return;
  }
  const _0x3e7c3d = _0x33c884.filter(_0x5d36f9 => _0x5d36f9.status === TaskStatus.RUNNING).length;
  const _0xb58d84 = _0x33c884.filter(_0x39d882 => _0x39d882.status === TaskStatus.QUEUED).length;
  if (_0x3e7c3d > 0 || _0xb58d84 > 0) {
    _0x27edda.textContent = "运行中: " + _0x3e7c3d + " | 排队中: " + _0xb58d84;
    _0x27edda.style.display = "block";
  } else {
    _0x27edda.style.display = "none";
  }
}
export function initTaskManager(_0x250800) {
  taskQueue.subscribe(_0x29af95 => {
    renderTaskList(_0x29af95);
    updateStats(_0x29af95);
  });
  _0x250800.find("#ch-cancel-all-tasks").on("click", handleCancelAll);
  _0x250800.find("#ch-clear-completed").on("click", handleClearCompleted);
  console.log("[TaskManager] 初始化完成");
}
export function updateTaskManagerView() {
  const _0x460858 = taskQueue.getAllTasks();
  renderTaskList(_0x460858);
  updateStats(_0x460858);
}