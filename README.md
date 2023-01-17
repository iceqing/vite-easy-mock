# vite-easy-mock


> 本仓库参考[vite-plugin-easy-mock](https://github.com/leitingting08/vite-plugin-easy-mock), 对部分功能做了修复增强, 比如`fileSuffix`参数支持，找不到路由时默认跳过等。

## Install

```bash
yarn add vite-easy-mock --dev
# or
npm i vite-easy-mock --save-dev
```

## Usage

vite.config.js

```js
import { defineConfig } from 'vite'
import viteMock from 'vite-easy-mock'

export default defineConfig({
  plugins: [
    viteMock()
  ]
})
```

vue.config.js 中使用

```js
const { useMiddleWare } = require('vite-easy-mock')

module.exports = {
  devServer: {
    before (app) {
      // 使用mock中间件
      app.use(useMiddleWare())
    }
  },
}
```

根目录下新建 `mock` 文件夹，新建文件夹和 json 或者 js 文件

文件夹和文件名配合就能 mock 本地 `/user/getAuthList` 接口，json 和 js 写法如下：

`mock/user/getAuthList.json`

```json
{
  "success": true,
  "desc": null,
  "data": []
}
```

`mock/user/getAuthList.js`

```js
module.export = (req) => {
  // 打印所有的query参数
  console.log("req.query", req.query);
  return {
    success: true,
    desc: null,
    data: []
  }
}
```

