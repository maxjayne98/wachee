<template>
  <a
    v-for="section in sections"
    :key="section.label"
    :href="section.href"
    :aria-current="activeSection === section.label ? 'location' : undefined"
    class="border-b-2 px-2 py-4 text-sm font-medium capitalize transition-colors"
    :class="
      activeSection === section.label
        ? 'border-sky-400 text-sky-100'
        : 'border-transparent text-slate-400 hover:text-white'
    "
    @click.prevent="goToSection(section)"
    >{{ section.label }}</a
  >
</template>
<script lang="ts" setup>
type Section = { label: string; href: string }

interface Props {
  sections: Array<Section>
}

defineProps<Props>()
const activeSection = defineModel()

function goToSection(section: Section) {
  activeSection.value = section.label
  const target = document.getElementById(section.href)
  console.log(target, section.href)
  target?.focus({ preventScroll: true })
  target?.scrollIntoView({
    block: 'start',
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}
</script>
