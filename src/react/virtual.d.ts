declare module 'virtual:svgs/react' {
  import type { ReactNode } from 'react'
  const Svgs: () => ReactNode
  export default Svgs
}

declare module 'virtual:svg-icon/react' {
  import type { ReactNode, SVGProps } from 'react'
  export interface SvgIconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
    name: string
    color?: string
    lazy?: boolean
    title?: string
  }
  const SvgIcon: (props: SvgIconProps) => ReactNode
  export default SvgIcon
}
