<script setup lang="ts">
import Header from './components/Header.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Header />
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition>
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </main>
</template>
