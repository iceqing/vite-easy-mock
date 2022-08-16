import { MockConfig } from './config';
import { Connect } from 'vite';
export default function useMiddleWare(opts?: MockConfig): Connect.NextHandleFunction;
