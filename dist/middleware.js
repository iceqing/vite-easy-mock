"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const utils_1 = require("./utils");
function useMiddleWare(opts = {}) {
    const options = {
        ...config_1.default,
        ...opts
    };
    // /^\/api(.+)/
    const pattern = new RegExp(`^${options.pattern}(.+)`);
    const dir = process.cwd() + options.dir;
    const minDelayTime = options.delay[0] || 0;
    const maxDelayTime = options.delay[1] || 0;
    return async (req, res, next) => {
        req.setEncoding('utf8');
        // 判断是否是ajax请求 或者文件上传
        const isHttp = req.headers['x-requested-with'] === 'XMLHttpRequest';
        const isUpload = req.headers['content-type']?.includes('multipart/form-data');
        if (req.url) {
            const match = pattern.exec(req.url);
            const method = req.method?.toLowerCase();
            // 符合mock路由
            if (match) {
                // 避免中文乱码
                res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
                if (method === 'post') {
                    if (req.body === undefined && !isUpload) {
                        const body = await utils_1.bodyParse(req);
                        req.body = body;
                    }
                }
                const [mockpath, query = ''] = match[0].split('?');
                // 挂载path、query参数
                if (req.path === undefined) {
                    req.path = mockpath;
                }
                if (req.query == undefined && !isUpload) {
                    req.query = utils_1.parse(query);
                }
                // 真实mock文件地址
                const mock = utils_1.findPath(`${dir}/${mockpath}`, options.fileSuffix);
                if (mock) {
                    // 删除缓存
                    delete require.cache[mock.path];
                    let data, delayTime = utils_1.getRandom(minDelayTime, maxDelayTime);
                    try {
                        data = require(mock.path);
                        console.log("data222: ", data);
                    }
                    catch (error) { }
                    await utils_1.delay(delayTime);
                    res.end(JSON.stringify(data));
                }
                else {
                    // 没找到mock数据 返回success：true
                    res.end(JSON.stringify({
                        success: false,
                        desc: '未找到mock路由'
                    }));
                }
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    };
}
exports.default = useMiddleWare;
