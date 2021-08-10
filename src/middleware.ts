import config, { MockConfig } from './config'
import { findPath, parse, bodyParse, getRandom, delay } from './utils'
import { Connect  } from 'vite'

export default function useMiddleWare(opts: MockConfig = {}): Connect.NextHandleFunction {
  const options = {
    ...config,
    ...opts
  }

  // /^\/api(.+)/
  const pattern = new RegExp(`^${options.pattern}(.+)`)
  const dir = process.cwd() + options.dir
  const minDelayTime = options.delay[0] || 0
  const maxDelayTime = options.delay[1] || 0

  return async  (req, res, next) =>{
    req.setEncoding('utf8')
    // 判断是否是ajax请求 或者文件上传
    const isHttp = req.headers['x-requested-with'] === 'XMLHttpRequest'
    const isUpload = req.headers['content-type']?.includes('multipart/form-data')
    if (req.url && (isHttp || isUpload)) {
      // 避免中文乱码
      res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'})
      const match = pattern.exec(req.url)
      const method = req.method?.toLowerCase()
      console.log(method)
      // 符合mock路由
      if (match) {
        if (method === 'post') {
          // @ts-ignore
          if (req.body === undefined && !isUpload) {
            const body = await bodyParse(req)
            // @ts-ignore
            req.body = body
          }
        }
        
        const [mockpath, query = ''] = match[1].split('?')
        // 挂载path、query参数
        // @ts-ignore
        if (req.path === undefined) {
           // @ts-ignore
          req.path = mockpath
        }
        // @ts-ignore
        if (req.query == undefined && !isUpload) {
          // @ts-ignore
          req.query = parse(query)
        }
       
        // 真实mock文件地址
        const mock = findPath(`${dir}/${mockpath}`)
        if (mock) {
          // 删除缓存
          delete require.cache[mock.url]
  
          let data, delayTime = getRandom(minDelayTime, maxDelayTime)
  
          try {
            data = require(mock.url)
          } catch (error) {}
  
          await delay(delayTime)
          res.end(JSON.stringify(data))
        } else {
          // 没找到mock数据
          next()
        }
      } else {
        next()
      }
    } else {
      next()
    }
  }
}
