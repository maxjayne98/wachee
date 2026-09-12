<template>
  <section tabindex="-1" class="mt-12 scroll-mt-28 focus:outline-none">
    <div class="mb-5 flex items-center justify-between gap-4">
      <h2 class="m-0! text-2xl! font-bold text-white!">Meet the cast</h2>
      <button
        v-if="cast.length > 8"
        :aria-expanded="expandedCast"
        aria-controls="cast-list"
        class="min-h-10 rounded-lg px-2 text-sm! text-slate-300 hover:text-sky-200"
        @click="expandedCast = !expandedCast">
        {{ expandedCast ? 'Show less ↑' : `View all (${cast.length}) →` }}
      </button>
    </div>
    <p v-if="!cast.length" class="text-sm text-slate-400">No cast information is available yet.</p>
    <div
      v-else
      id="cast-list"
      class="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 lg:gap-4">
      <article
        v-for="member in visibleCast"
        :key="`${member.person.id}-${member.character?.id}`"
        class="group relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300/40 sm:rounded-xl motion-reduce:transition-none">
        <DetailImage
          :src="member.person.image?.medium || member.person.image?.original"
          :alt="member.person.name"
          class="aspect-3/4 w-full bg-slate-800"
          image-class="object-cover object-top transition duration-300 group-hover:scale-105 motion-reduce:transform-none" />
        <div class="flex flex-1 flex-col p-1.5 text-left sm:p-2.5">
          <h3
            class="m-0! truncate text-[11px]! font-semibold text-slate-100 sm:text-xs! lg:text-sm!"
            :title="member.person.name">
            {{ member.person.name }}
          </h3>
          <p
            class="mt-0.5! truncate text-[10px]! text-slate-400 sm:text-[11px]!"
            :title="member.self ? 'Self' : member.character?.name || 'Cast member'">
            {{ member.self ? 'Self' : member.character?.name || 'Cast member'
            }}{{ member.voice ? ' (voice)' : '' }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CastMember } from '@/types'
import DetailImage from '@/components/base/DetailImage.vue'

const props = defineProps<{ cast: CastMember[] }>()

const expandedCast = ref(false)
const visibleCast = computed(() => (expandedCast.value ? props.cast : props.cast.slice(0, 8)))
</script>
