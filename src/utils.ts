import fs from 'fs'
import { Connect } from 'vite'

/**
 * 找到真实的文件类型和路径
 * @param dir - 不带后缀的文件路径
 * @param fileSuffix - url是否包含文件后缀()
 */
export function findPath(dir: string, fileSuffix: boolean) {
  let url = dir;
  let path = dir + '.js';

  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      type: 'js'
    }
  }

  path = dir + '.json'
  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      type: 'json'
    }
  }

  path = dir + '/index.js'
  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      type: 'js'
    }
  }

  path = dir + '/index.json'
  url = fileSuffix ? path : url;
  if (fs.existsSync(path)) {
    return {
      url,
      type: 'json'
    }
  }

  return undefined
}

/**
 * 
 * @param query - 请求参数，类似：a=1&b=2
 */
export function parse(query: string) {
  let result: { [index: string]: unknown } = {}
  query.split('&').reduce((res, item) => {
    const [key, value] = item.split('=')
    res[key] = decodeURIComponent(value)
    return res
  }, result)
  return result
}

/**
 * 解析post请求参数
 * @param req - 请求对象
 */
export function bodyParse(req: Connect.IncomingMessage) {
  return new Promise(resolve => {
    let data = ''
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      let response
      try {
        response = JSON.parse(data)
      } catch (error) {
        response = parse(data)
      }
      resolve(response)
    })
  })
}

/**
 * 随机生成最大最小之间的值
 * @param min - 最小值
 * @param max - 最大值
 */
export function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 延迟时间
 * @param time - 延迟时间
 */
export function delay(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
