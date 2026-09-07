<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import TextInput from '@/components/TextInput.vue'

const searchQuery = ref<string>('')

function onSubmit() {
  alert(searchQuery.value)
}
</script>

<template>
  <header class="app-header">
    <img src="@/assets/wachee.png" alt="Wachee" class="app-header-logo" />
    <form @submit.prevent="onSubmit">
      <TextInput v-model="searchQuery" type="text" placeholder="Search" class="app-header-search" />
      <Button type="submit" class="app-header-search-button">Search</Button>
    </form>
  </header>
</template>
<style lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.25rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header-logo {
  height: 80px;
}
</style>
