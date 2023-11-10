<template>
  <n-form-item :label="'designer.setting.cellHeight'">
    <n-input v-model="optionModel.cellHeight" type="text"></n-input>
  </n-form-item>
</template>

<script>
export default {
  name: 'CellHeightEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
