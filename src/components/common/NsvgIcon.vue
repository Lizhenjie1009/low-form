<template>
  <n-icon v-bind="props.options">
    <component :is="vicons[props.name]"></component>
  </n-icon>
</template>

<script lang="ts" setup>
import { vicons } from '@/icons'

const props = defineProps({
  options: Object,
  name: String
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.svg-icon:hover {
  fill: var(--primary-color-hover);
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
