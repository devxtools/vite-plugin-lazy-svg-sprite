
# vite-plugin-lazy-svg-sprite 

## ✨ **这是一个动态按需加载、可配置懒加载的 SVG 插件，同时支持 Vue 3 与 React**

> 注意：本库 **仅支持 ES 模块 (ESM)**，不支持 CommonJS (`require`)。
  

---

## ✨ 特性

- ⚡ **按需加载**：没用到的 SVG 不会进包。用到的每个文件是独立 chunk，同名图标只请求一次。
- 💤 **可懒加载**：默认等图标进入视口后再请求，首屏以外的图标不占初始请求。组件上的 `:lazy="false"` 可以让单个图标马上加载。
- 🪶 **DOM 更轻**：路径只在 sprite 里存一份，页面上是很小的 `<svg><use>`，同一图标多处共用。
- 🎨 **单色可染色**：图标里只有一种 `fill` / `stroke` 时会改成 `currentColor`，用 `color` 或 CSS `color` 就能改色。多种颜色的图标保持原样。
- 🖥 **服务端渲染更轻**：图标在客户端挂载或进入视口后才拉取，服务端 HTML 里不会塞进整份图标库。
- 🔥 **开发时改文件即生效**：监听 SVG 目录的新增、改名、修改，保存后整页刷新。子目录按路径引用，例如 `About/score.svg` 对应 `name="About/score"`。

---

## 📦 安装

```bash
pnpm add -D vite-plugin-lazy-svg-sprite
# 或
npm i -D vite-plugin-lazy-svg-sprite
```

## 🛠 本地开发

```bash
pnpm install
pnpm dev
```

启动后会同时运行：
- 插件源码 watch 构建（`unbuild --watch`）
- 示例项目开发服务器（`http://localhost:5173`）

修改 `example/assets/svg/` 下的 SVG 文件保存后，页面会自动刷新。

## ⚙️ 在 vite.config.ts 中配置

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import svgSpritePlugin from 'vite-plugin-lazy-svg-sprite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue(),
    svgSpritePlugin({
      dir: path.resolve(__dirname, "assets", "svg")
    })
  ]
})
```

## svgSpritePlugin 配置

| 选项                | 类型                        | 默认值               | 说明                              |
| ----------------- | ------------------------- | ----------------- | ------------------------------- |
| `dir`             | `string`                  | `src/assets/svg`  | SVG 目录路径                        |
| `prefix`          | `string`                  | `sprite`          | symbol id 前缀                      |
| `lazy`            | `boolean`                 | `true`            | 是否默认懒加载。Vue 用 `:lazy` 覆盖，React 用 `lazy` 覆盖 |


## Vue

### 在 app.vue 中挂上 sprite

```vue
<script setup lang="ts">
// 引入插件提供的虚拟模块svg集
import Svgs from 'virtual:svgs'
</script>
<template>
    <div>
        <main></main>
        <Svgs />
    </div>
</template>
```


### 在页面中使用

```vue
<script setup lang="ts">
// 引入插件提供的虚拟模块
import SvgIcon from 'virtual:svg-icon'

//例如： /assets/svg/score.svg
//例如： /assets/svg/About/score.svg
</script>
<template>
    <page>
        <SvgIcon style="color: blue" name="score" />
        <SvgIcon name="About/score" />
        <SvgIcon name="menu" title="菜单" />
        <SvgIcon name="add" :lazy="false" />
    </page>
</template>
```

## React

`react` 是可选依赖。使用 React 组件时安装 `react@18` 或 `react@19`。插件配置与 Vue 相同，虚拟模块换成 React 版本。

类型写在 `env.d.ts`。这行必须放在脚本式声明文件里，不要和 `import` / `export` 写在一起：

```ts
/// <reference types="vite-plugin-lazy-svg-sprite/react" />
```

Vue 项目对应的是 `vite-plugin-lazy-svg-sprite/vue`。

```jsx
import Svgs from 'virtual:svgs/react'
import SvgIcon from 'virtual:svg-icon/react'

export default function App() {
  return (
    <div>
      <SvgIcon style={{ color: 'blue' }} name="score" />
      <SvgIcon name="About/score" />
      <SvgIcon name="menu" title="菜单" />
      <SvgIcon name="add" lazy={false} />
      <Svgs />
    </div>
  )
}
```

本地示例：

```bash
pnpm example:react
```

## License

[MIT](./LICENSE)

Copyright (c) 2024 ASH
