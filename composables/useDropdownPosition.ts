import { ref, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface DropdownPositionOptions {
  panelHeight?: number | Ref<number> | any
  panelWidth?: number | Ref<number> | any
  margin?: number
}

export function useDropdownPosition(
  triggerRef: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  options: DropdownPositionOptions = {}
) {
  const isFlippedTop = ref(false)
  const isAlignedRight = ref(false)

  const defaultHeight = options.panelHeight ?? 300
  const defaultWidth = options.panelWidth ?? 250
  const margin = options.margin ?? 12

  const updatePosition = () => {
    if (typeof window === 'undefined' || !triggerRef.value || !isOpen.value) return
    const rect = triggerRef.value.getBoundingClientRect()
    const height = typeof defaultHeight === 'number' ? defaultHeight : defaultHeight.value
    const width = typeof defaultWidth === 'number' ? defaultWidth : defaultWidth.value

    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const spaceRight = window.innerWidth - rect.left

    // Flip to top if space below is insufficient and space above has more room or fits
    if (spaceBelow < height + margin && (spaceAbove > spaceBelow || spaceAbove >= height)) {
      isFlippedTop.value = true
    } else {
      isFlippedTop.value = false
    }

    // Align right if space on right is too tight and there is room on the left
    if (spaceRight < width + margin && rect.right >= width) {
      isAlignedRight.value = true
    } else {
      isAlignedRight.value = false
    }
  }

  const handleScrollResize = () => {
    if (isOpen.value) {
      updatePosition()
    }
  }

  watch(isOpen, (val) => {
    if (val) {
      updatePosition()
      window.addEventListener('scroll', handleScrollResize, true)
      window.addEventListener('resize', handleScrollResize, true)
    } else {
      window.removeEventListener('scroll', handleScrollResize, true)
      window.removeEventListener('resize', handleScrollResize, true)
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

  return {
    isFlippedTop,
    isAlignedRight,
    updatePosition
  }
}

export default useDropdownPosition

