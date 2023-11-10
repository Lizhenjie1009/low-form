<template>
  <n-form-item :label="'designer.setting.colPullTitle'">
    <n-input-number
      v-model.number="optionModel.pull"
      :min="0"
      :max="24"
      style="width: 100%"
    ></n-input-number>
  </n-form-item>
</template>

<script>
export default {
  name: 'GridColPullEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
