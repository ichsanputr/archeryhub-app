import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue'

export interface DropdownPositionOptions {
  panelHeight?: number | Ref<number>
  panelWidth?: number | Ref<number>
  margin?: number
  matchWidth?: boolean
  minHeight?: number
  zIndex?: number
}

export function useDropdownPosition(
  triggerRef: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  options: DropdownPositionOptions = {}
) {
  const isFlippedTop = ref(false)
  const isAlignedRight = ref(false)

  const defaultHeight = options.panelHeight ?? 300
  const defaultWidth = options.panelWidth ?? 280
  const margin = options.margin ?? 6
  const minHeight = options.minHeight ?? 100
  const matchWidth = options.matchWidth ?? false
  const zIndex = options.zIndex ?? 999999

  const coords = ref({
    top: '0px',
    bottom: 'auto',
    left: '0px',
    right: 'auto',
    width: 'auto',
    maxHeight: '300px'
  })

  const updatePosition = () => {
    if (typeof window === 'undefined' || !triggerRef.value || !isOpen.value) return
    const rect = triggerRef.value.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return

    const desiredHeight = typeof defaultHeight === 'number' ? defaultHeight : defaultHeight?.value ?? 300
    const desiredWidth = typeof defaultWidth === 'number' ? defaultWidth : defaultWidth?.value ?? 280

    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const spaceRight = window.innerWidth - rect.left

    // Vertical flip
    if (spaceBelow < 220 && (spaceAbove > spaceBelow || spaceAbove >= desiredHeight)) {
      isFlippedTop.value = true
      const maxH = Math.max(minHeight, Math.min(desiredHeight, spaceAbove - margin - 10))
      coords.value.top = 'auto'
      coords.value.bottom = `${window.innerHeight - rect.top + margin}px`
      coords.value.maxHeight = `${maxH}px`
    } else {
      isFlippedTop.value = false
      const maxH = Math.max(minHeight, Math.min(desiredHeight, spaceBelow - margin - 10))
      coords.value.top = `${rect.bottom + margin}px`
      coords.value.bottom = 'auto'
      coords.value.maxHeight = `${maxH}px`
    }

    // Horizontal alignment and width
    if (matchWidth) {
      coords.value.left = `${rect.left}px`
      coords.value.right = 'auto'
      coords.value.width = `${rect.width}px`
    } else {
      if (spaceRight < desiredWidth + margin && rect.right >= desiredWidth) {
        isAlignedRight.value = true
        coords.value.right = `${window.innerWidth - rect.right}px`
        coords.value.left = 'auto'
        coords.value.width = `${desiredWidth}px`
      } else {
        isAlignedRight.value = false
        coords.value.left = `${rect.left}px`
        coords.value.right = 'auto'
        coords.value.width = `${desiredWidth}px`
      }
    }
  }

  const handleScrollResize = () => {
    if (isOpen.value) {
      updatePosition()
    }
  }

  watch(isOpen, (val) => {
    if (val) {
      nextTick(() => {
        updatePosition()
      })
      if (typeof window !== 'undefined') {
        window.addEventListener('scroll', handleScrollResize, true)
        window.addEventListener('resize', handleScrollResize, true)
      }
    } else {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScrollResize, true)
        window.removeEventListener('resize', handleScrollResize, true)
      }
    }
  })

  onMounted(() => {
    if (isOpen.value) {
      updatePosition()
      window.addEventListener('scroll', handleScrollResize, true)
      window.addEventListener('resize', handleScrollResize, true)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScrollResize, true)
      window.removeEventListener('resize', handleScrollResize, true)
    }
  })

  const dropdownStyle = computed(() => ({
    position: 'fixed' as const,
    top: coords.value.top,
    bottom: coords.value.bottom,
    left: coords.value.left,
    right: coords.value.right,
    width: coords.value.width,
    maxHeight: coords.value.maxHeight,
    zIndex
  }))

  return {
    isFlippedTop,
    isAlignedRight,
    dropdownCoords: coords,
    dropdownStyle,
    updatePosition
  }
}

export default useDropdownPosition
