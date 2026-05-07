import { eventSource } from "../../../../../script.js";
export const TaskStatus = {
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
};
export const TaskType = {
  BUTTON: "button",
  COMFYUI: "comfyui",
  NOVELAI: "novelai",
  AUTO_CLICK: "auto_click",
  SD: "sd",
  LLM: "llm",
  BANANA: "banana"
};
class TaskQueue {
  constructor() {
    this.tasks = new Map();
    this.listeners = [];
    this.maxHistory = 50;
  }
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  addTask(_0x121fbe) {
    const _0x3f64d9 = this.generateId();
    const _0x4860f4 = {
      id: _0x3f64d9,
      name: _0x121fbe.name || "未命名任务",
      type: _0x121fbe.type || TaskType.BUTTON,
      prompt: _0x121fbe.prompt || "",
      buttonElement: _0x121fbe.buttonElement || null,
      status: TaskStatus.QUEUED,
      createdAt: Date.now(),
      startedAt: null,
      completedAt: null
    };
    this.tasks.set(_0x3f64d9, _0x4860f4);
    this.notify();
    console.log("[TaskQueue] 任务已添加: " + _0x3f64d9 + " - " + _0x4860f4.name);
    return _0x3f64d9;
  }
  updateStatus(_0x3c9e41, _0x2aa1f6) {
    const _0x107ce4 = this.tasks.get(_0x3c9e41);
    if (_0x107ce4) {
      _0x107ce4.status = _0x2aa1f6;
      if (_0x2aa1f6 === TaskStatus.RUNNING) {
        _0x107ce4.startedAt = Date.now();
      }
      if (_0x2aa1f6 === TaskStatus.COMPLETED || _0x2aa1f6 === TaskStatus.FAILED || _0x2aa1f6 === TaskStatus.CANCELLED) {
        _0x107ce4.completedAt = Date.now();
      }
      this.notify();
      console.log("[TaskQueue] 任务状态更新: " + _0x3c9e41 + " -> " + _0x2aa1f6);
    }
  }
  isTaskInQueue(_0x40ce25) {
    const _0x5afbff = this.tasks.get(_0x40ce25);
    return _0x5afbff && (_0x5afbff.status === TaskStatus.QUEUED || _0x5afbff.status === TaskStatus.RUNNING);
  }
  cancelTask(_0xfac49c) {
    const _0x22d3d2 = this.tasks.get(_0xfac49c);
    if (!_0x22d3d2) {
      return false;
    }
    const _0x3d936b = _0x22d3d2.status === TaskStatus.RUNNING;
    _0x22d3d2.status = TaskStatus.CANCELLED;
    _0x22d3d2.completedAt = Date.now();
    this.notify();
    console.log("[TaskQueue] 任务已取消: " + _0xfac49c);
    const _0x3e14c2 = {
      taskId: _0xfac49c
    };
    eventSource.emit("st_chatu8_task_cancelled", _0x3e14c2);
    return _0x3d936b;
  }
  completeTask(_0x22e2ad, _0x54f938 = true) {
    this.updateStatus(_0x22e2ad, _0x54f938 ? TaskStatus.COMPLETED : TaskStatus.FAILED);
    this.cleanupHistory();
  }
  getAllTasks() {
    return Array.from(this.tasks.values()).sort((_0x308b04, _0x56e093) => _0x56e093.createdAt - _0x308b04.createdAt).slice(0, this.maxHistory);
  }
  getRunningCount() {
    return Array.from(this.tasks.values()).filter(_0x253528 => _0x253528.status === TaskStatus.RUNNING).length;
  }
  getQueuedCount() {
    return Array.from(this.tasks.values()).filter(_0x94f1c => _0x94f1c.status === TaskStatus.QUEUED).length;
  }
  cancelAllQueued() {
    for (const [_0x41c863, _0x4cc822] of this.tasks) {
      if (_0x4cc822.status === TaskStatus.QUEUED) {
        this.cancelTask(_0x41c863);
      }
    }
  }
  clearCompleted() {
    for (const [_0x4d917d, _0x4f5b96] of this.tasks) {
      if (_0x4f5b96.status === TaskStatus.COMPLETED || _0x4f5b96.status === TaskStatus.FAILED || _0x4f5b96.status === TaskStatus.CANCELLED) {
        this.tasks.delete(_0x4d917d);
      }
    }
    this.notify();
  }
  cleanupHistory() {
    const _0x4a9e5f = this.getAllTasks();
    if (_0x4a9e5f.length > this.maxHistory) {
      const _0x101b2a = _0x4a9e5f.slice(this.maxHistory);
      for (const _0x3b4ef1 of _0x101b2a) {
        if (_0x3b4ef1.status !== TaskStatus.QUEUED && _0x3b4ef1.status !== TaskStatus.RUNNING) {
          this.tasks.delete(_0x3b4ef1.id);
        }
      }
    }
  }
  notify() {
    const _0x5c1fa8 = this.getAllTasks();
    this.listeners.forEach(_0x1fd8df => {
      try {
        _0x1fd8df(_0x5c1fa8);
      } catch (_0x116741) {
        console.error("[TaskQueue] 监听器执行错误:", _0x116741);
      }
    });
  }
  subscribe(_0x384355) {
    this.listeners.push(_0x384355);
    _0x384355(this.getAllTasks());
    return () => {
      this.listeners = this.listeners.filter(_0xdb35fe => _0xdb35fe !== _0x384355);
    };
  }
}
export const taskQueue = new TaskQueue();