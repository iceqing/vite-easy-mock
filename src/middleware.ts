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

  return async  (req:any, res:any, next) =>{
    req.setEncoding('utf8')
    // 判断是否是ajax请求 或者文件上传
    const isHttp = req.headers['x-requested-with'] === 'XMLHttpRequest'
    const isUpload = req.headers['content-type']?.includes('multipart/form-data')
    if (req.url) {
      const match = pattern.exec(req.url)
      const method = req.method?.toLowerCase()
      // 符合mock路由
      if (match) {
        // 避免中文乱码
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'})
        if (method === 'post') {
          if (req.body === undefined && !isUpload) {
            const body = await bodyParse(req)
            req.body = body
          }
        }
        
        const [mockpath, query = ''] = match[0].split('?')
        // 挂载path、query参数
        if (req.path === undefined) {
          req.path = mockpath
        }
        if (req.query == undefined && !isUpload) {
          req.query = parse(query)
        }
       
        // 真实mock文件地址
        const mock = findPath(`${dir}/${mockpath}`, options.fileSuffix)
        if (mock) {
          // 删除缓存
          delete require.cache[mock.path]
  
          let data, delayTime = getRandom(minDelayTime, maxDelayTime)
  
          try {
            data = require(mock.path)
            console.log("data222: ", data)
          } catch (error) {}
  
          await delay(delayTime)
          res.end(JSON.stringify(data))
        } else {
          // 没找到mock数据 返回success：true
          res.end(JSON.stringify({
            success: false,
            desc: '未找到mock路由'
          }))
        }
      } else {
        next()
      }
    } else {
      next()
    }
  }
}
