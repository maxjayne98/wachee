<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    overscan?: number
  }>(),
  {
    overscan: 2,
  }
)

const container = ref<HTMLElement>()
const itemProbe = ref<HTMLElement>()
const itemWidth = ref(0)
const gap = ref(0)
const scrollLeft = ref(0)
const containerWidth = ref(0)

const itemSize = computed(() => Math.max(1, itemWidth.value + gap.value))

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollLeft.value / itemSize.value) - props.overscan)
)

const visibleCount = computed(
  () => Math.ceil(containerWidth.value / itemSize.value) + props.overscan * 2
)

const endIndex = computed(() => Math.min(props.items.length, startIndex.value + visibleCount.value))

const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value))

const totalWidth = computed(() => {
  if (!props.items.length) return 0

  return props.items.length * itemWidth.value + (props.items.length - 1) * gap.value
})

const offsetLeft = computed(() => startIndex.value * itemSize.value)

function handleScroll() {
  if (!container.value) return

  scrollLeft.value = container.value.scrollLeft
}

function scrollNext() {
  container.value?.scrollBy({
    left: itemSize.value,
    behavior: 'smooth',
  })
}

function scrollPrevious() {
  container.value?.scrollBy({
    left: -itemSize.value,
    behavior: 'smooth',
  })
}

let resizeObserver: ResizeObserver

onMounted(() => {
  if (!container.value) return

  const measure = () => {
    if (!container.value || !itemProbe.value) return
    containerWidth.value = container.value.clientWidth
    itemWidth.value = itemProbe.value.getBoundingClientRect().width
    gap.value = parseFloat(getComputedStyle(container.value).columnGap) || 0
  }
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(container.value)
  if (itemProbe.value) resizeObserver.observe(itemProbe.value)
  measure()
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
  <div
    ref="container"
    class="relative w-full min-w-0 gap-4 overflow-x-auto scroll-smooth"
    @scroll.passive="handleScroll">
    <div
      ref="itemProbe"
      aria-hidden="true"
      class="invisible pointer-events-none absolute h-0 w-60" />
    <div
      class="relative h-full"
      :style="{
        width: `${totalWidth}px`,
      }">
      <div
        class="absolute top-0 flex"
        :style="{
          left: `${offsetLeft}px`,
          gap: `${gap}px`,
        }">
        <div
          v-for="(item, localIndex) in visibleItems"
          :key="startIndex + localIndex"
          class="shrink-0"
          :style="{
            width: `${itemWidth}px`,
          }">
          <slot :item="item" :index="startIndex + localIndex" />
        </div>
      </div>
    </div>
  </div>
</template>
