import { MockConfig } from './config';
import { Plugin } from 'vite';
declare function MockPlugin(opts?: MockConfig): Plugin;
export default MockPlugin;
export { default as useMiddleWare } from './middleware';
export { MockConfig } from './config';
