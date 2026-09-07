<template>
  <div class="select-container">
    <button class="select-button">
      <span>{{ model?.lable || placeHolder }}</span>
      <span>v</span>
    </button>
    <ul>
      <li v-for="option in options" :key="option.value" @click="selectItem(option)">
        {{ option.lable }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string
  lable: string
}

interface Props {
  options: Option[]
  placeHolder: string
}

defineProps<Props>()
const model = defineModel<Option | null>({ default: null })

function selectItem(item: Option) {
  model.value = item
}
</script>
<style lang="scss" scoped></style>
