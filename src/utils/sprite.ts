import { ref } from 'vue'

// 注释不能删除，它是替换符
export const config = /*! __PURE__VAR__ */ { prefix: 'sprite', lazy: true }

const modules: Record<string, unknown> = {
  /*@svg-modules@*/
}

const loadedIcons = new Set<string>()
export const spriteSymbols = ref<Record<string, string>>({})

export function toSymbolId(name: string): string {
  const safeName = name
    .replace(/[/\\]/g, '-')
    .replace(/[^\w.-]/g, '_')
  return `${config.prefix}-${safeName}`
}

function svgFilter(raw: string): string {
  const colorMatches = [...raw.matchAll(/(?:fill|stroke)=(['"])(.*?)\1/gi)]
  const colors = new Set<string>()

  for (const match of colorMatches) {
    const color = match[2].toLowerCase()
    if (color !== 'none' && color !== 'currentcolor') {
      colors.add(color)
    }
  }

  if (colors.size <= 1) {
    raw = raw
      .replace(/fill=(['"])(?!(currentColor|none))[^'"]*\1/gi, 'fill="currentColor"')
      .replace(/stroke=(['"])(?!(currentColor|none))[^'"]*\1/gi, 'stroke="currentColor"')
  }

  return raw
}

export async function loadIcon(name: string) {
  if (!name) return
  if (loadedIcons.has(name)) return

  const entry = modules[name]
  if (!entry) {
    console.warn(`[vite-plugin-vue-svg-sprite] icon not found: "${name}"`)
    return
  }

  loadedIcons.add(name)

  const loader = entry as () => Promise<{ default: string }>
  const mod = await loader()
  let raw = (mod.default || mod).toString()
  if (!raw) return

  raw = raw.replace(/<svg([^>]*)>/i, (_match, attrs: string) => {
    const newAttrs = attrs.replaceAll(/\s(width|height)="[^"]*"/gi, '')
    return `<svg${newAttrs}>`
  })

  raw = svgFilter(raw)
  spriteSymbols.value = {
    ...spriteSymbols.value,
    [name]: `<symbol id="${toSymbolId(name)}">${raw}</symbol>`,
  }
}
