<template>
  <div>
    <n-form-item :label="setting.gridColHeight.name">
      <n-input-number
        v-model:value="optionModel.colHeight"
        class="hide-spin-button"
        :min="0"
      />
    </n-form-item>
  </div>
</template>

<script setup lang="ts" name="ColHeightEditor">
import { setting } from '@/config'
const props = defineProps({
  designer: Object,
  selectedWidget: Object,
  optionModel: Object
})
</script>

<style scoped></style>
