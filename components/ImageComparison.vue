<template>
  <div class="w-full h-full">
    <ImgComparisonSlider class="w-full h-full rounded-xl">
      <!-- eslint-disable -->
      <img
        slot="first"
        :src="beforeImage"
        :alt="beforeAlt"
        class="w-full h-full object-cover"
      />
      <img
        slot="second"
        :src="afterImage"
        :alt="afterAlt"
        class="w-full h-full object-cover"
      />
      <!-- eslint-enable -->
    </ImgComparisonSlider>
  </div>
</template>

<script setup>
import { ImgComparisonSlider } from '@img-comparison-slider/vue'

defineProps({
  beforeImage: {
    type: String,
    required: true
  },
  afterImage: {
    type: String,
    required: true
  },
  beforeAlt: {
    type: String,
    default: 'Before'
  },
  afterAlt: {
    type: String,
    default: 'After'
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
