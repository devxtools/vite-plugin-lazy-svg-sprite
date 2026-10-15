declare module 'virtual:svgs' {
  import type { DefineComponent } from 'vue'
  const Svgs: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default Svgs
}

declare module 'virtual:svg-icon' {
  import type { DefineComponent } from 'vue'
  const SvgIcon: DefineComponent<{
    name: string
    color?: string
    lazy?: boolean
    title?: string
  }>
  export default SvgIcon
}
