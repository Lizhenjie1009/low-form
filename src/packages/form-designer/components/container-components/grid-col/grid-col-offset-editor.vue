<template>
  <n-form-item :label="'designer.setting.colOffsetTitle'">
    <n-input-number
      v-model.number="optionModel.offset"
      :min="0"
      :max="24"
      style="width: 100%"
    ></n-input-number>
  </n-form-item>
</template>

<script lang="ts" setup name="GridColOffsetEditor">
const props = defineProps({
  designer: Object,
  selectedWidget: Object,
  optionModel: Object
})
</script>

<style scoped></style>
