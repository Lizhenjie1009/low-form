<template>
  <n-form-item :label="'designer.setting.wordBreak'">
    <n-switch v-model="optionModel.wordBreak"></n-switch>
  </n-form-item>
</template>

<script>
export default {
  name: 'TableCellWordBreakEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
