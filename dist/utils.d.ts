import { Connect } from 'vite';
/**
 * 找到真实的文件类型和路径
 * @param dir - 不带后缀的文件路径
 * @param fileSuffix - url是否包含文件后缀()
 */
export declare function findPath(dir: string, fileSuffix: boolean): {
    url: string;
    path: string;
    type: string;
} | undefined;
/**
 *
 * @param query - 请求参数，类似：a=1&b=2
 */
export declare function parse(query: string): {
    [index: string]: unknown;
};
/**
 * 解析post请求参数
 * @param req - 请求对象
 */
export declare function bodyParse(req: Connect.IncomingMessage): Promise<unknown>;
/**
 * 随机生成最大最小之间的值
 * @param min - 最小值
 * @param max - 最大值
 */
export declare function getRandom(min: number, max: number): number;
/**
 * 延迟时间
 * @param time - 延迟时间
 */
export declare function delay(time: number): Promise<unknown>;
