<script setup lang="ts">
import AppHeader from '@/components/app/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <AppHeader />
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="duration-200 ease-out"
        leave-to-class="opacity-0"
        mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </main>
  <footer class="p-4 border-t border-white/10 text-xs text-slate-500">
    <p>Powered by Trakt.TV and TMDB</p>
  </footer>
</template>
