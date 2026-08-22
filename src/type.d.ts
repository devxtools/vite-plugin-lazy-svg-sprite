import type { DefineComponent } from 'vue'

declare module 'virtual:svgs' {
  const Svgs: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default Svgs
}

declare module 'virtual:svg-icon' {
  const SvgIcon: DefineComponent<{
    name: string
    color?: string
    lazy?: boolean
    title?: string
  }>
  export default SvgIcon
}
