import { type Plugin, type ViteDevServer } from 'vite'
import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { fileURLToPath } from 'url'

const green = '\x1b[32m'

const __filename = fileURLToPath(import.meta.url)
const __es_dirname = path.dirname(__filename)

const sprite = fs.readFileSync(path.resolve(__es_dirname, 'utils/sprite.mjs'), 'utf-8')
const svgs = fs.readFileSync(path.resolve(__es_dirname, 'components/svgs.mjs'), 'utf-8')
const icon = fs.readFileSync(path.resolve(__es_dirname, 'components/icon.mjs'), 'utf-8')
const reactSvgs = fs.readFileSync(path.resolve(__es_dirname, 'react/svgs.mjs'), 'utf-8')
const reactIcon = fs.readFileSync(path.resolve(__es_dirname, 'react/icon.mjs'), 'utf-8')

export type SvgSpritePluginOptions = {
  /** SVG 目录路径 */
  dir?: string
  /** symbol id 前缀 */
  prefix?: string
  /** 是否默认懒加载 */
  lazy?: boolean
}

const moduleIds = {
  sprite: 'virtual:svgs-sprite',
  svgs: 'virtual:svgs',
  icon: 'virtual:svg-icon',
  svgsReact: 'virtual:svgs/react',
  iconReact: 'virtual:svg-icon/react',
}

function replacePath(code: string) {
  return code
    .split('@/utils/sprite')
    .join(path.resolve(__es_dirname, 'utils/sprite').replace(/\\/g, '/'))
}

function getFiles(dir: string) {
  const svgDir = path.resolve(dir)

  if (!fs.existsSync(svgDir)) {
    console.warn(`[vite-plugin-lazy-svg-sprite] SVG directory not found: ${svgDir}`)
    return []
  }

  const files = fg.sync('**/*.svg', { cwd: svgDir }).sort()
  return files.map((file) => {
    const abs = path.join(svgDir, file).replace(/\\/g, '/')
    const name = file.replace(/\.svg$/i, '')
    return `'${name}': () => import('${abs}?raw')`
  })
}

export default function svgSpritePlugin(options: SvgSpritePluginOptions = {}): Plugin {
  const spriteResolvedModuleId = '\0' + moduleIds.sprite
  const svgsResolvedModuleId = '\0' + moduleIds.svgs
  const iconResolvedModuleId = '\0' + moduleIds.icon
  const reactSvgsResolvedModuleId = '\0' + moduleIds.svgsReact
  const reactIconResolvedModuleId = '\0' + moduleIds.iconReact

  const resolvedOptions = {
    dir: path.resolve(process.cwd(), 'src/assets/svg'),
    lazy: true,
    prefix: 'sprite',
    ...options,
  }

  const modulesRegex = /\/\*@svg-modules@\*\//g
  const configRegex = /\/\*! __PURE__VAR__ \*\//g
  const pluginConfig = JSON.stringify({
    prefix: resolvedOptions.prefix,
    lazy: resolvedOptions.lazy,
  })

  return {
    name: 'vite-plugin-lazy-svg-sprite',
    configureServer(server: ViteDevServer) {
      const svgDir = path.resolve(resolvedOptions.dir)
      server.watcher.add(svgDir)
      server.watcher.on('all', (event: string, file: string) => {
        if (!file.endsWith('.svg')) return

        const resolved = path.resolve(file)
        if (!resolved.startsWith(svgDir)) return

        const displayPath = path.relative(process.cwd(), resolved)
        console.log(`↻ ${green}${event} ${displayPath}`)

        const mods = [
          server.moduleGraph.getModuleById(spriteResolvedModuleId),
          server.moduleGraph.getModuleById(svgsResolvedModuleId),
          server.moduleGraph.getModuleById(iconResolvedModuleId),
          server.moduleGraph.getModuleById(reactSvgsResolvedModuleId),
          server.moduleGraph.getModuleById(reactIconResolvedModuleId),
        ]
        mods.forEach((mod) => mod && server.moduleGraph.invalidateModule(mod))
        server.ws.send({ type: 'full-reload', path: '*' })
      })
    },
    resolveId(id) {
      if (id === moduleIds.sprite) return spriteResolvedModuleId
      if (id === moduleIds.svgs) return svgsResolvedModuleId
      if (id === moduleIds.icon) return iconResolvedModuleId
      if (id === moduleIds.svgsReact) return reactSvgsResolvedModuleId
      if (id === moduleIds.iconReact) return reactIconResolvedModuleId
    },
    load(id) {
      if (id === spriteResolvedModuleId) {
        const svgModules = getFiles(resolvedOptions.dir)
        const code = sprite.replace(configRegex, `${pluginConfig}||`)
        return code.replace(modulesRegex, svgModules.join(','))
      }
      if (id === svgsResolvedModuleId) {
        return replacePath(svgs)
      }
      if (id === iconResolvedModuleId) {
        return replacePath(icon)
      }
      if (id === reactSvgsResolvedModuleId) {
        return replacePath(reactSvgs)
      }
      if (id === reactIconResolvedModuleId) {
        return replacePath(reactIcon)
      }
    },
  }
}
