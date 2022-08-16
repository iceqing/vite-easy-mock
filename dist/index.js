"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMiddleWare = void 0;
const middleware_1 = __importDefault(require("./middleware"));
function MockPlugin(opts = {}) {
    return {
        name: 'vite-easy-mock',
        configureServer(server) {
            server.middlewares.use(middleware_1.default(opts));
        }
    };
}
exports.default = MockPlugin;
var middleware_2 = require("./middleware");
Object.defineProperty(exports, "useMiddleWare", { enumerable: true, get: function () { return __importDefault(middleware_2).default; } });
