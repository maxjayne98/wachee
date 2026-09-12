<template>
  <section
    tabindex="-1"
    class="grid scroll-mt-28 gap-8 focus:outline-none lg:grid-cols-3 lg:gap-12">
    <div class="lg:col-span-2">
      <h2 class="mb-4! text-2xl! font-bold text-white!">The story</h2>
      <p class="max-w-3xl text-base leading-8 whitespace-pre-line text-slate-300">
        {{ story || 'No synopsis is available for this show yet.' }}
      </p>
    </div>
    <aside class="self-start rounded-2xl border border-white/10 bg-slate-900 p-6">
      <h2 class="mb-4! text-lg! font-semibold text-white!">Show details</h2>
      <dl class="divide-y divide-slate-700/50">
        <div
          v-for="[label, value] in details"
          :key="label"
          class="flex justify-between gap-4 py-3 text-sm">
          <dt class="text-slate-400">{{ label }}</dt>
          <dd class="m-0 text-right text-slate-200">{{ value }}</dd>
        </div>
      </dl>
    </aside>
  </section>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { Show } from '@/types'
import { plainText } from '@/utils'

const story = computed(() => plainText(props.show.summary))
const details = computed(() => [
  ['Status', props.show.status || 'Unknown'],
  ['Language', props.show.language || 'Unknown'],
  [
    'Runtime',
    props.show.runtime || props.show.averageRuntime
      ? `${props.show.runtime || props.show.averageRuntime} min`
      : 'Unknown',
  ],
  ['Network', props.show.network?.name || props.show.webChannel?.name || 'Unknown'],
])

interface Props {
  show: Show
}
const props = defineProps<Props>()
</script>
