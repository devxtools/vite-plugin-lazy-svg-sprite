import {
  onBeforeUnmount,
  defineComponent,
  h,
  mergeProps,
  nextTick,
  onMounted,
  ref,
  watch,
  type Ref,
} from 'vue'
import { loadIcon, config, toSymbolId } from 'virtual:svgs-sprite'

export default defineComponent({
  name: 'SvgIcon',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    color: { type: String, default: 'currentColor' },
    lazy: { type: Boolean, default: undefined },
    title: { type: String, default: '' },
  },
  setup(props, { attrs }) {
    const elRef: Ref<SVGSVGElement | null> = ref(null)
    const isVisible = ref(false)
    let observer: IntersectionObserver | null = null

    const shouldLazy = () => props.lazy ?? config.lazy ?? true

    const requestLoad = (name: string) => {
      if (!name) return
      loadIcon(name)
    }

    const disconnectObserver = () => {
      observer?.disconnect()
      observer = null
    }

    const startObserver = async () => {
      await nextTick()
      disconnectObserver()

      if (!shouldLazy()) {
        isVisible.value = true
        requestLoad(props.name)
        return
      }

      observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          isVisible.value = true
          requestLoad(props.name)
          disconnectObserver()
        }
      })

      if (elRef.value) observer.observe(elRef.value)
    }

    onMounted(() => {
      void startObserver()
    })

    watch(
      () => props.name,
      (name) => {
        if (isVisible.value || !shouldLazy()) {
          requestLoad(name)
        }
      },
    )

    watch(
      () => props.lazy,
      () => {
        void startObserver()
      },
    )

    onBeforeUnmount(() => {
      disconnectObserver()
    })

    return () => {
      const labelled = Boolean(props.title)
      const style: Record<string, string> = {
        display: 'inline-block',
        verticalAlign: 'middle',
      }

      if (props.color !== 'currentColor') {
        style.color = props.color
      }

      return h(
        'svg',
        mergeProps(attrs, {
          ref: elRef,
          'aria-hidden': labelled ? undefined : 'true',
          'aria-label': labelled ? props.title : undefined,
          role: labelled ? 'img' : undefined,
          style,
        }),
        h('use', {
          href: `#${toSymbolId(props.name)}`,
          xlinkHref: `#${toSymbolId(props.name)}`,
        }),
      )
    }
  },
})
