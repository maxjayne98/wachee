<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    itemWidth: number
    gap?: number
    overscan?: number
  }>(),
  {
    gap: 16,
    overscan: 2,
  }
)

const container = ref<HTMLElement>()
const scrollLeft = ref(0)
const containerWidth = ref(0)

const stride = computed(() => props.itemWidth + props.gap)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollLeft.value / stride.value) - props.overscan)
)

const visibleCount = computed(
  () => Math.ceil(containerWidth.value / stride.value) + props.overscan * 2
)

const endIndex = computed(() => Math.min(props.items.length, startIndex.value + visibleCount.value))

const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value))

const totalWidth = computed(() => {
  if (!props.items.length) return 0

  return props.items.length * props.itemWidth + (props.items.length - 1) * props.gap
})

const offsetLeft = computed(() => startIndex.value * stride.value)

function handleScroll() {
  if (!container.value) return

  scrollLeft.value = container.value.scrollLeft
}

function scrollNext() {
  container.value?.scrollBy({
    left: stride.value,
    behavior: 'smooth',
  })
}

function scrollPrevious() {
  container.value?.scrollBy({
    left: -stride.value,
    behavior: 'smooth',
  })
}

let resizeObserver: ResizeObserver

onMounted(() => {
  if (!container.value) return

  resizeObserver = new ResizeObserver(([entry]) => {
    containerWidth.value = entry.contentRect.width
  })

  resizeObserver.observe(container.value)

  containerWidth.value = container.value.clientWidth
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

defineExpose({
  scrollNext,
  scrollPrevious,
})
</script>

<template>
  <div ref="container" class="w-full overflow-x-auto scroll-smooth" @scroll.passive="handleScroll">
    <div
      class="relative h-full"
      :style="{
        width: `${totalWidth}px`,
      }"
    >
      <div
        class="absolute top-0 flex"
        :style="{
          left: `${offsetLeft}px`,
          gap: `${gap}px`,
        }"
      >
        <div
          v-for="(item, localIndex) in visibleItems"
          :key="startIndex + localIndex"
          class="shrink-0"
          :style="{
            width: `${itemWidth}px`,
          }"
        >
          <slot :item="item" :index="startIndex + localIndex" />
        </div>
      </div>
    </div>
  </div>
</template>
