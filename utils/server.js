const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8008;
app.use(express.json({
  limit: "50mb"
}));
app.use(cors());
const AVAILABLE_MODELS = [{
  id: "gemini-2.5-flash-image",
  object: "model",
  created: 1700000000,
  owned_by: "google"
}, {
  id: "gemini-3-pro-image",
  object: "model",
  created: 1700000000,
  owned_by: "google"
}, {
  id: "imagen-4.0-generate-001",
  object: "model",
  created: 1700000000,
  owned_by: "google"
}, {
  id: "imagen-4.0-ultra-generate-001",
  object: "model",
  created: 1700000000,
  owned_by: "google"
}];
let taskQueue = [];
let pendingJobs = {};
let availableClients = [];
const allClients = new Map();
const apiKeyAuth = (_0x2b27ba, _0x4f12da, _0x86734a) => {
  const _0x32cfb7 = process.env.API_KEY || "123456";
  if (_0x32cfb7) {
    const _0x523671 = _0x2b27ba.headers.authorization;
    if (!_0x523671 || _0x523671 !== "Bearer " + _0x32cfb7) {
      return _0x4f12da.status(401).json({
        error: "Unauthorized: Invalid API Key"
      });
    }
  }
  _0x86734a();
};
function dispatchTasks() {
  while (taskQueue.length > 0 && availableClients.length > 0) {
    const _0x17d009 = taskQueue.shift();
    const _0x33125d = availableClients.shift();
    const _0x254f70 = pendingJobs[_0x17d009.jobId];
    if (!_0x254f70) {
      console.error("[" + new Date().toISOString() + "] Job " + _0x17d009.jobId + " not found in pendingJobs. Skipping.");
      continue;
    }
    _0x254f70.assignedClientId = _0x33125d.clientId;
    console.log("[" + new Date().toISOString() + "] Dispatching job " + _0x17d009.jobId + " to client " + _0x33125d.clientId);
    _0x33125d.json(_0x17d009);
  }
}
app.get("/api/get-task", (_0x1e224a, _0x1ef60f) => {
  const {
    clientId: _0x369a46
  } = _0x1e224a.query;
  if (!_0x369a46) {
    return _0x1ef60f.status(400).json({
      error: "clientId query parameter is required."
    });
  }
  const _0x517e47 = availableClients.findIndex(_0x236a03 => _0x236a03.clientId === _0x369a46);
  if (_0x517e47 !== -1) {
    console.warn("[" + new Date().toISOString() + "] Stale connection for client " + _0x369a46 + " found in available pool. Removing.");
    const _0x3ccd7e = availableClients.splice(_0x517e47, 1)[0];
    _0x3ccd7e.end();
  }
  _0x1ef60f.clientId = _0x369a46;
  allClients.set(_0x369a46, _0x1ef60f);
  availableClients.push(_0x1ef60f);
  console.log("[" + new Date().toISOString() + "] Client " + _0x369a46 + " connected. Pool size: " + availableClients.length);
  _0x1e224a.on("close", () => {
    if (allClients.get(_0x369a46) === _0x1ef60f) {
      allClients.delete(_0x369a46);
      const _0x2c9afe = availableClients.findIndex(_0x43f4cc => _0x43f4cc.clientId === _0x369a46);
      if (_0x2c9afe !== -1) {
        availableClients.splice(_0x2c9afe, 1);
      }
      console.log("[" + new Date().toISOString() + "] Client " + _0x369a46 + " disconnected and removed. Pool size: " + availableClients.length);
    } else {
      console.log("[" + new Date().toISOString() + "] A stale connection for client " + _0x369a46 + " was closed.");
    }
  });
  dispatchTasks();
});
app.post("/api/submit-task", (_0x2f3558, _0x2f1f6f) => {
  const {
    jobId: _0x5aa956,
    result: _0x276859,
    error: _0x1ae7e6
  } = _0x2f3558.body;
  const _0xa03102 = pendingJobs[_0x5aa956];
  if (!_0xa03102) {
    console.error("[" + new Date().toISOString() + "] Received result for unknown job ID: " + _0x5aa956);
    return _0x2f1f6f.status(404).send("Job not found");
  }
  console.log("[" + new Date().toISOString() + "] Received result for job " + _0x5aa956 + ". Success: " + !_0x1ae7e6);
  if (_0x1ae7e6) {
    if (_0x1ae7e6.status === 429) {
      console.warn("[" + new Date().toISOString() + "] Job " + _0x5aa956 + " failed with 429 on client " + _0xa03102.assignedClientId + ". Attempting retry.");
      _0xa03102.triedClients.add(_0xa03102.assignedClientId);
      const _0x5f07ed = Array.from(allClients.keys());
      const _0x39260a = _0x5f07ed.every(_0x3d5580 => _0xa03102.triedClients.has(_0x3d5580));
      if (_0x5f07ed.length > 0 && _0x39260a) {
        console.error("[" + new Date().toISOString() + "] Job " + _0x5aa956 + " has failed on all " + _0x5f07ed.length + " connected clients. Returning 429 to user.");
        _0xa03102.res.status(429).json({
          error: "Too Many Requests: All available clients are rate-limited.",
          jobId: _0x5aa956,
          details: "Failed on clients: " + Array.from(_0xa03102.triedClients).join(", ")
        });
        delete pendingJobs[_0x5aa956];
        return _0x2f1f6f.status(200).send("Acknowledged final rate limit failure.");
      }
      const _0x57bac9 = {
        jobId: _0x5aa956,
        ..._0xa03102.taskData
      };
      taskQueue.unshift(_0x57bac9);
      console.log("[" + new Date().toISOString() + "] Job " + _0x5aa956 + " re-queued for another attempt.");
      dispatchTasks();
      return _0x2f1f6f.status(200).send("Acknowledged, task re-queued.");
    } else {
      console.error("[" + new Date().toISOString() + "] Job " + _0x5aa956 + " failed with a fatal error:", _0x1ae7e6);
      _0xa03102.res.status(_0x1ae7e6.status || 500).json({
        error: _0x1ae7e6.message || "An unexpected error occurred.",
        details: _0x1ae7e6,
        jobId: _0x5aa956
      });
      delete pendingJobs[_0x5aa956];
      return _0x2f1f6f.status(200).send("Acknowledged fatal error.");
    }
  }
  if (_0x276859) {
    const _0x514ef6 = [];
    if (_0x276859.text) {
      const _0x102944 = {
        type: "text",
        text: _0x276859.text
      };
      _0x514ef6.push(_0x102944);
    }
    if (_0x276859.imageUrl) {
      const _0x6c421 = {
        url: _0x276859.imageUrl
      };
      const _0x379b84 = {
        type: "image_url",
        image_url: _0x6c421
      };
      _0x514ef6.push(_0x379b84);
    }
    _0xa03102.res.status(200).json({
      id: _0x5aa956,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: _0xa03102.taskData.model,
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: _0x514ef6
        },
        finish_reason: "stop"
      }],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    });
    delete pendingJobs[_0x5aa956];
  }
  _0x2f1f6f.status(200).send("Task result received");
});
const handleApiRequest = (_0x47c47d, _0x539ad7, _0x31b59b) => {
  const _0x28bac3 = crypto.randomBytes(16).toString("hex");
  console.log("[" + new Date().toISOString() + "] Received new job " + _0x28bac3);
  pendingJobs[_0x28bac3] = {
    req: _0x47c47d,
    res: _0x539ad7,
    taskData: _0x31b59b,
    retries: 0,
    triedClients: new Set()
  };
  const _0x3b269c = {
    jobId: _0x28bac3,
    ..._0x31b59b
  };
  taskQueue.push(_0x3b269c);
  dispatchTasks();
};
app.post("/v1/chat/completions", apiKeyAuth, (_0x341ee9, _0x2715a0) => {
  const {
    model: _0x11f200,
    messages: _0x86959b,
    config: _0xbddd0c
  } = _0x341ee9.body;
  let _0x3f0ce8 = [];
  if (_0x86959b && Array.isArray(_0x86959b)) {
    _0x3f0ce8 = _0x86959b.map(_0x50e1f7 => {
      const _0x2b7f39 = _0x50e1f7.role === "assistant" ? "model" : _0x50e1f7.role;
      let _0x36a71a = [];
      if (Array.isArray(_0x50e1f7.content)) {
        _0x36a71a = _0x50e1f7.content;
      } else if (typeof _0x50e1f7.content === "string") {
        const _0x20694b = {
          type: "text",
          text: _0x50e1f7.content
        };
        _0x36a71a = [_0x20694b];
      }
      const _0x472aef = {
        role: _0x2b7f39,
        parts: _0x36a71a
      };
      return _0x472aef;
    }).filter(_0x5f2490 => _0x5f2490.parts.length > 0);
  }
  const _0x2040f4 = {
    model: _0x11f200,
    history: _0x3f0ce8,
    config: _0xbddd0c
  };
  const _0x35ca14 = _0x2040f4;
  handleApiRequest(_0x341ee9, _0x2715a0, _0x35ca14);
});
const vertexPredictHandler = (_0x57b6c9, _0x170531) => {
  let _0xf1e0d3 = _0x57b6c9.params.model;
  const _0x5af933 = ":predict";
  if (_0xf1e0d3.endsWith(_0x5af933)) {
    _0xf1e0d3 = _0xf1e0d3.slice(0, -_0x5af933.length);
  }
  const {
    instances: _0x3c81e2,
    parameters: _0x225b96
  } = _0x57b6c9.body;
  const _0x20a846 = {
    model: "imagen-4.0-" + _0xf1e0d3,
    instances: _0x3c81e2,
    parameters: _0x225b96,
    isVertex: true
  };
  const _0x2df33d = _0x20a846;
  handleApiRequest(_0x57b6c9, _0x170531, _0x2df33d);
};
app.post("/v1beta/models/imagen-4.0-:model(*)", apiKeyAuth, vertexPredictHandler);
app.get("/v1/models", apiKeyAuth, (_0x23bec9, _0x2a11c1) => {
  const _0x17192b = {
    object: "list",
    data: AVAILABLE_MODELS
  };
  _0x2a11c1.status(200).json(_0x17192b);
});
app.get("/", (_0x62ca6c, _0x2300fd) => {
  _0x2300fd.status(200).json({
    status: "ok",
    message: "Hugging Face WSS Server is running.",
    timestamp: new Date().toISOString()
  });
});
app.listen(PORT, () => {
  console.log("[" + new Date().toISOString() + "] Gemini HTTP Proxy Server listening on port " + PORT);
  console.log("[" + new Date().toISOString() + "] Load balancing and 429-retry mode enabled.");
});