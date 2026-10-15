import {
  createElement,
  forwardRef,
  useEffect,
  useRef,
  type CSSProperties,
  type ForwardedRef,
  type SVGProps,
} from 'react'
import { config, loadIcon, toSymbolId } from 'virtual:svgs-sprite'

export type SvgIconProps = Omit<SVGProps<SVGSVGElement>, 'color' | 'ref'> & {
  name: string
  color?: string
  lazy?: boolean
  title?: string
}

function assignRef(ref: ForwardedRef<SVGSVGElement>, node: SVGSVGElement | null) {
  if (typeof ref === 'function') ref(node)
  else if (ref) ref.current = node
}

const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(function SvgIcon(props, forwardedRef) {
  const { name, color = 'currentColor', lazy, title = '', style, ...attrs } = props
  const elRef = useRef<SVGSVGElement | null>(null)

  const setRef = (node: SVGSVGElement | null) => {
    elRef.current = node
    assignRef(forwardedRef, node)
  }

  useEffect(() => {
    const shouldLazy = lazy ?? config.lazy ?? true
    if (!name) return
    if (!shouldLazy) {
      void loadIcon(name)
      return
    }

    const el = elRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void loadIcon(name)
        observer.disconnect()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [name, lazy])

  const labelled = Boolean(title)
  const mergedStyle: CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    ...style,
  }

  if (color !== 'currentColor') {
    mergedStyle.color = color
  }

  return createElement(
    'svg',
    {
      ...attrs,
      ref: setRef,
      'aria-hidden': labelled ? undefined : true,
      'aria-label': labelled ? title : undefined,
      role: labelled ? 'img' : undefined,
      style: mergedStyle,
    },
    createElement('use', {
      href: `#${toSymbolId(name)}`,
      xlinkHref: `#${toSymbolId(name)}`,
    }),
  )
})

export default SvgIcon
