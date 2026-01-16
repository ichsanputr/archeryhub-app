<template>
    <div class="image-zoomer-container" :style="containerStyle">
        <picture>
            <img :src="src" :alt="alt" :class="imgClass" class="zoomable-image" @click="toggleZoom"
                @mousemove="handleMouseMove" @mouseleave="handleMouseLeave" :style="imageStyle" />
        </picture>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        default: ''
    },
    imgClass: {
        type: String,
        default: ''
    },
    zoomLevel: {
        type: Number,
        default: 2
    },
    containerStyle: {
        type: Object,
        default: () => ({})
    }
})

const transformOrigin = ref('center center')
const isZoomed = ref(false)

const imageStyle = computed(() => {
    return {
        transform: isZoomed.value ? `scale(${props.zoomLevel})` : 'scale(1)',
        transformOrigin: transformOrigin.value,
        transition: 'transform 0.3s ease',
        cursor: isZoomed.value ? 'zoom-out' : 'zoom-in'
    }
})

const toggleZoom = () => {
    isZoomed.value = !isZoomed.value
}

const handleMouseMove = (event) => {
    if (!isZoomed.value) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    transformOrigin.value = `${x}% ${y}%`
}

const handleMouseLeave = () => {
    if (isZoomed.value) {
        transformOrigin.value = 'center center'
    }
}
</script>

<style scoped>
.image-zoomer-container {
    overflow: hidden;
    display: inline-block;
    position: relative;
}

.zoomable-image {
    display: block;
    max-width: 100%;
    height: auto;
    cursor: zoom-in;
}

.zoomable-image:hover {
    cursor: zoom-in;
}
</style>
