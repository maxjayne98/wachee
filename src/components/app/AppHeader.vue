<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import TextInput from '@/components/base/TextInput.vue'
import Magnifier from '@/components/base/icons/Magnifier.vue'

const route = useRoute()
const isScrolled = ref(false)

function updateScrollState() {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', updateScrollState))

const searchQuery = ref<string>(getQuery())
const router = useRouter()

function getQuery() {
  return Array.isArray(route.query.q) ? (route.query.q[0] ?? '') : (route.query.q ?? '')
}

watch(
  () => route.query.q,
  () => {
    searchQuery.value = getQuery()
  }
)

function onSubmit() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 isolate border-b transition-colors duration-300 motion-reduce:transition-none"
    :class="isScrolled ? 'border-sky-200/30' : 'border-transparent'">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-black/90 to-transparent transition-opacity duration-500 motion-reduce:transition-none"
      :class="isScrolled ? 'opacity-0' : 'opacity-100'" />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-linear-to-br from-sky-400/15 via-blue-950/35 to-sky-900/15 shadow-xl shadow-sky-950/15 backdrop-blur-2xl backdrop-saturate-150 transition-opacity duration-500 motion-reduce:transition-none"
      :class="isScrolled ? 'opacity-100' : 'opacity-0'">
      <span class="absolute inset-0 bg-linear-to-b from-white/15 via-white/0 to-sky-300/10" />
      <span
        class="absolute -top-20 left-1/4 h-28 w-96 -rotate-12 rounded-full bg-sky-200/10 blur-2xl" />
      <span class="absolute -bottom-24 right-1/4 h-28 w-80 rounded-full bg-blue-400/15 blur-2xl" />
    </div>

    <div class="page-container flex h-20 items-center justify-between gap-6 sm:gap-12">
      <router-link
        :to="{ path: '/' }"
        aria-label="Wachee home"
        class="shrink-0 rounded-xl bg-transparent! transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-purple-300 focus-visible:outline-offset-2">
        <img src="@/assets/wachee.png" alt="Wachee" class="app-header-logo h-12 w-auto sm:h-16" />
      </router-link>

      <form
        role="search"
        class="group flex min-w-0 w-full max-w-md items-center rounded-full bg-linear-to-r bg-violet-300 p-px shadow-lg transition-shadow focus-within:shadow-purple-500/20"
        @submit.prevent="onSubmit">
        <div class="flex w-full min-w-0 items-center gap-2 rounded-full bg-black/95 pl-5 sm:pl-6">
          <TextInput
            id="searchQuery"
            v-model="searchQuery"
            type="input"
            placeholder="Find your favorite…"
            class="min-w-0 w-full border-0 bg-transparent py-2 text-sm! text-slate-100 outline-none sm:text-base!"
            required
            aria-label="Search shows" />
          <button
            id="search-submit"
            aria-label="Search"
            type="submit"
            class="flex sm:w-18 sm:h-10 w-10 h-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-purple-300/25 bg-linear-to-br bg-violet-300 text-white shadow-md shadow-purple-500/20 transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-purple-200 focus-visible:outline-offset-2 motion-reduce:transition-none">
            <Magnifier aria-hidden="true" class="size-5 stroke-white" />
          </button>
        </div>
      </form>
    </div>
  </header>
</template>
