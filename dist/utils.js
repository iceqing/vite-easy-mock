"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.getRandom = exports.bodyParse = exports.parse = exports.findPath = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * 找到真实的文件类型和路径
 * @param dir - 不带后缀的文件路径
 * @param fileSuffix - url是否包含文件后缀()
 */
function findPath(dir, fileSuffix) {
    let url = dir;
    let path = dir + '.js';
    url = fileSuffix ? path : url;
    if (fs_1.default.existsSync(path)) {
        return {
            url,
            path,
            type: 'js'
        };
    }
    path = dir + '.json';
    url = fileSuffix ? path : url;
    if (fs_1.default.existsSync(path)) {
        return {
            url,
            path,
            type: 'json'
        };
    }
    path = dir + '/index.js';
    url = fileSuffix ? path : url;
    if (fs_1.default.existsSync(path)) {
        return {
            url,
            path,
            type: 'js'
        };
    }
    path = dir + '/index.json';
    url = fileSuffix ? path : url;
    if (fs_1.default.existsSync(path)) {
        return {
            url,
            path,
            type: 'json'
        };
    }
    return undefined;
}
exports.findPath = findPath;
/**
 *
 * @param query - 请求参数，类似：a=1&b=2
 */
function parse(query) {
    let result = {};
    query.split('&').reduce((res, item) => {
        const [key, value] = item.split('=');
        res[key] = decodeURIComponent(value);
        return res;
    }, result);
    return result;
}
exports.parse = parse;
/**
 * 解析post请求参数
 * @param req - 请求对象
 */
function bodyParse(req) {
    return new Promise(resolve => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let response;
            try {
                response = JSON.parse(data);
            }
            catch (error) {
                response = parse(data);
            }
            resolve(response);
        });
    });
}
exports.bodyParse = bodyParse;
/**
 * 随机生成最大最小之间的值
 * @param min - 最小值
 * @param max - 最大值
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRandom = getRandom;
/**
 * 延迟时间
 * @param time - 延迟时间
 */
function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
exports.delay = delay;
