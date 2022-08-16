import { MockConfig } from './config'
import { Plugin } from 'vite'
import useMiddleWare from './middleware'

function MockPlugin(opts: MockConfig = {}): Plugin {
  return {
    name: 'vite-easy-mock',
    configureServer(server) {
      server.middlewares.use(useMiddleWare(opts))
    }
  }
}

export default MockPlugin

export { default as useMiddleWare } from './middleware'

export { MockConfig } from './config'