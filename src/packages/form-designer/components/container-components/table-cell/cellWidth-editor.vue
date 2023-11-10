<template>
  <n-form-item :label="'designer.setting.cellWidth'">
    <n-input v-model="optionModel.cellWidth" type="text"></n-input>
  </n-form-item>
</template>

<script>
export default {
  name: 'CellWidthEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
