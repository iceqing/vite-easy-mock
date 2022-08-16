var __defProp = Object.defineProperty;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __assign = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/config.ts
var config = {
  dir: "/mock",
  pattern: "/",
  fileSuffix: false,
  delay: [0, 100]
};
var config_default = config;

// src/utils.ts
import fs from "fs";
function findPath(dir, fileSuffix) {
  let url = dir;
  let path = dir + ".js";
  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      path,
      type: "js"
    };
  }
  path = dir + ".json";
  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      path,
      type: "json"
    };
  }
  path = dir + "/index.js";
  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      path,
      type: "js"
    };
  }
  path = dir + "/index.json";
  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      path,
      type: "json"
    };
  }
  return void 0;
}
function parse(query) {
  let result = {};
  query.split("&").reduce((res, item) => {
    const [key, value] = item.split("=");
    res[key] = decodeURIComponent(value);
    return res;
  }, result);
  return result;
}
function bodyParse(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let response;
      try {
        response = JSON.parse(data);
      } catch (error) {
        response = parse(data);
      }
      resolve(response);
    });
  });
}
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// src/middleware.ts
function useMiddleWare(opts = {}) {
  const options = __assign(__assign({}, config_default), opts);
  const pattern = new RegExp(`^${options.pattern}(.+)`);
  const dir = process.cwd() + options.dir;
  const minDelayTime = options.delay[0] || 0;
  const maxDelayTime = options.delay[1] || 0;
  return async (req, res, next) => {
    var _a, _b;
    req.setEncoding("utf8");
    const isHttp = req.headers["x-requested-with"] === "XMLHttpRequest";
    const isUpload = (_a = req.headers["content-type"]) == null ? void 0 : _a.includes("multipart/form-data");
    if (req.url) {
      const match = pattern.exec(req.url);
      const method = (_b = req.method) == null ? void 0 : _b.toLowerCase();
      if (match) {
        res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
        if (method === "post") {
          if (req.body === void 0 && !isUpload) {
            const body = await bodyParse(req);
            req.body = body;
          }
        }
        const [mockpath, query = ""] = match[0].split("?");
        if (req.path === void 0) {
          req.path = mockpath;
        }
        if (req.query == void 0 && !isUpload) {
          req.query = parse(query);
        }
        const mock = findPath(`${dir}/${mockpath}`, options.fileSuffix);
        if (mock) {
          delete require.cache[mock.path];
          let data, delayTime = getRandom(minDelayTime, maxDelayTime);
          try {
            data = require(mock.path);
            console.log("data222: ", data);
          } catch (error) {
          }
          await delay(delayTime);
          res.end(JSON.stringify(data));
        } else {
          res.end(JSON.stringify({
            success: false,
            desc: "\u672A\u627E\u5230mock\u8DEF\u7531"
          }));
        }
      } else {
        next();
      }
    } else {
      next();
    }
  };
}

// src/index.ts
function MockPlugin(opts = {}) {
  return {
    name: "vite-easy-mock",
    configureServer(server) {
      server.middlewares.use(useMiddleWare(opts));
    }
  };
}
var src_default = MockPlugin;
export {
  src_default as default,
  useMiddleWare
};
