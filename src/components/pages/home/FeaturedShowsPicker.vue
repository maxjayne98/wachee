<template>
  <div class="mt-auto min-w-0">
    <div class="mb-3 flex items-center justify-between gap-4">
      <div>
        <h2
          class="m-0! mt-2.25! flex flex-wrap items-center gap-5 text-2xl text-white! max-md:gap-2.5 max-md:text-2xl!">
          Top picks for you
          <span class="text-base tracking-widest text-slate-400">
            {{ String(activeIndex + 1).padStart(2, '0') }} /
            {{ String(shows.length).padStart(2, '0') }}
          </span>
        </h2>
      </div>
      <div v-if="shows.length > 1" class="flex gap-2 max-md:gap-1.25">
        <button
          class="flex h-10 w-14 cursor-pointer items-center justify-center rounded-full glass-surface text-white hover:bg-white/15 max-md:w-12"
          aria-label="Previous pick"
          @click="select(activeIndex - 1)">
          <ArrowLeft class="size-7" />
        </button>

        <button
          class="flex h-10 w-14 cursor-pointer items-center justify-center rounded-full glass-surface text-white hover:bg-white/15 max-md:w-12"
          aria-label="Next pick"
          @click="select(activeIndex + 1)">
          <ArrowRight class="size-7" />
        </button>
      </div>
    </div>
    <div ref="picks" class="flex gap-3 overflow-x-auto px-0.75 pt-0.75 pb-3">
      <button
        v-for="(show, index) in shows"
        :key="show.id"
        class="relative h-24 basis-41 shrink-0 cursor-pointer overflow-hidden rounded-2xl border text-left text-white hover:border-violet-200 max-md:basis-35 after:absolute after:inset-0 after:bg-linear-to-t after:from-slate-950/95 after:to-slate-950/20 after:content-['']"
        :class="
          index === activeIndex
            ? 'border-transparent gradient-border shadow-md shadow-purple-500/30'
            : 'border-white/15 bg-slate-900'
        "
        :aria-pressed="index === activeIndex"
        :aria-label="`Show ${show.name}`"
        @click="select(index)">
        <DetailImage
          v-if="hasImage(show)"
          class="h-full from-slate-800 to-slate-950"
          :image-class="`size-full object-cover object-[center_25%] ${index === activeIndex ? 'opacity-100' : 'opacity-60'}`"
          :src="imageFor(show)"
          :alt="show.name"
          loading="lazy"
          @error="failedImages.add(imageFor(show))" />
        <span class="absolute top-2.5 left-3 z-1 text-sm">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <span class="absolute right-2.5 bottom-3.75 left-3 z-1 truncate text-base font-bold">
          {{ show.name }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Show } from '@/types'

import DetailImage from '@/components/base/DetailImage.vue'
import ArrowLeft from '@/components/base/icons/ArrowLeft.vue'
import ArrowRight from '@/components/base/icons/ArrowRight.vue'

const props = defineProps<{ shows: Show[] }>()

const activeIndex = defineModel<number>({ required: true })
const picks = ref<HTMLElement | null>(null)
const failedImages = ref(new Set<string>())

const imageFor = (show: Show) => show.image?.original || show.image?.medium || ''
const hasImage = (show: Show) => imageFor(show) && !failedImages.value.has(imageFor(show))

function select(index: number) {
  if (!props.shows.length) return
  activeIndex.value = (index + props.shows.length) % props.shows.length
}

watch(
  activeIndex,
  () => {
    const container = picks.value
    const selected = container?.children[activeIndex.value] as HTMLElement | undefined
    if (!container || !selected) return
    const left = selected.offsetLeft - container.offsetLeft
    if (
      left < container.scrollLeft ||
      left + selected.offsetWidth > container.scrollLeft + container.clientWidth
    ) {
      container.scrollTo({
        left: Math.max(0, left - container.clientWidth / 2 + selected.offsetWidth / 2),
        behavior: 'instant',
      })
    }
  },
  { flush: 'post' }
)
</script>
