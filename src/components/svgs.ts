import { defineComponent, h, onBeforeUnmount, ref } from 'vue'
import { getSpriteSymbols, subscribe } from 'virtual:svgs-sprite'

// 注释不能删除，它是替换符
/*! __SPRITE__PATH__ */

export default defineComponent({
  name: 'SvgSprite',
  setup() {
    const symbols = ref(getSpriteSymbols())
    const stop = subscribe(() => {
      symbols.value = getSpriteSymbols()
    })
    onBeforeUnmount(stop)

    return () =>
      h(
        'svg',
        {
          'aria-hidden': 'true',
          style: {
            position: 'absolute',
            width: '0',
            height: '0',
            overflow: 'hidden',
          },
        },
        Object.entries(symbols.value).map(([id, raw]) =>
          h('g', { innerHTML: raw, key: id }),
        ),
      )
  },
})
