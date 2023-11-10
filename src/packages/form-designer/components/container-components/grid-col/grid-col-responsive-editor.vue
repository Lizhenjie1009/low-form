<template>
  <n-form-item :label="'designer.setting.responsive'">
    <n-switch v-model="optionModel.responsive"></n-switch>
  </n-form-item>
</template>

<script>
export default {
  name: 'GridColResponsiveEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style lang="less" scoped></style>
