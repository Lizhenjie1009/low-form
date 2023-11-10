<template>
  <n-form-item :label="'designer.setting.hidden'">
    <n-switch v-model="optionModel.hidden"></n-switch>
  </n-form-item>
</template>

<script>
export default {
  name: 'HiddenEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
