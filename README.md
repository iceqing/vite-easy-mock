# vite-plugin-easy-mock

## Install

```bash
yarn add vite-plugin-easy-mock --dev
# or
npm i vite-plugin-easy-mock --save-dev
```

## Usage

vite.config.js

```js
import { defineConfig } from 'vite'
import viteMock from 'vite-plugin-easy-mock'

export default defineConfig({
  plugins: [
    viteMock()
  ]
})
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
module.export = () => {
  return {
    success: true,
    desc: null,
    data: []
  }
}
```
