<script setup lang="ts">
import Header from './components/Header.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Header />
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="duration-200 ease-out"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </main>
</template>
