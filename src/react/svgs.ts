import { createElement, useSyncExternalStore } from 'react'
import { getSpriteSymbols, subscribe } from 'virtual:svgs-sprite'

export default function SvgSprite() {
  const symbols = useSyncExternalStore(subscribe, getSpriteSymbols, getSpriteSymbols)

  return createElement(
    'svg',
    {
      'aria-hidden': true,
      style: {
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
      },
    },
    Object.entries(symbols).map(([id, raw]) =>
      createElement('g', {
        key: id,
        dangerouslySetInnerHTML: { __html: raw },
      }),
    ),
  )
}
