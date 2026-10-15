// 注释不能删除，它是替换符
export const config = /*! __PURE__VAR__ */ { prefix: 'sprite', lazy: true }

type IconLoader = () => Promise<{ default?: string } | string>
type Listener = () => void

const modules: Record<string, IconLoader> = {
  /*@svg-modules@*/
}

const loadedIcons = new Set<string>()
const listeners = new Set<Listener>()

let spriteSymbols: Record<string, string> = {}

export function getSpriteSymbols() {
  return spriteSymbols
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit(next: Record<string, string>) {
  spriteSymbols = next
  listeners.forEach((listener) => listener())
}

export function toSymbolId(name: string): string {
  const safeName = name.replace(/[/\\]/g, '-').replace(/[^\w.-]/g, '_')
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
    console.warn(`[vite-plugin-lazy-svg-sprite] icon not found: "${name}"`)
    return
  }

  loadedIcons.add(name)

  const mod = await entry()
  let raw = (typeof mod === 'string' ? mod : mod.default || '').toString()
  if (!raw) return

  raw = raw.replace(/<svg([^>]*)>/i, (_match, attrs: string) => {
    const newAttrs = attrs.replaceAll(/\s(width|height)="[^"]*"/gi, '')
    return `<svg${newAttrs}>`
  })

  raw = svgFilter(raw)
  emit({
    ...spriteSymbols,
    [name]: `<symbol id="${toSymbolId(name)}">${raw}</symbol>`,
  })
}
