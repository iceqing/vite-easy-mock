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
    // 判断是否是ajax请求 或者文件上传
    const isUpload = req.headers['content-type']?.includes('multipart/form-data')
    if (req.url) {
      const match = pattern.exec(req.url)
      const method = req.method?.toLowerCase()
      // 符合mock路由
      if (match) {
        // 避免中文乱码
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
        const mock = findPath(`${dir}${mockpath}`, options.fileSuffix)
        if (mock) {
          // 删除缓存
          delete require.cache[mock.path]
  
          let data, delayTime = getRandom(minDelayTime, maxDelayTime)
          if(mock.type=='js') {
            let jsRet = await import(mock.path);
            data = await (jsRet.default)(req);
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'})
          } else {
            try {
              data = require(mock.path);
            } catch (error) {
              console.log("error when load file", error);
            }
          }
  
          await delay(delayTime)
          if(mock.type=='json') {
            // 如果是json,默认返回utf-8, 避免中文乱码
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'})
          }
          res.end(JSON.stringify(data))
        } else {
          // 没找到mock数据，继续执行
          next();
        }
      } else {
        next()
      }
    } else {
      next()
    }
  }
}
