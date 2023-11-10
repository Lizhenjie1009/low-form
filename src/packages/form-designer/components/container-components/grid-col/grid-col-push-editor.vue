<template>
  <n-form-item :label="'designer.setting.colPushTitle'">
    <n-input-number
      v-model.number="optionModel.push"
      :min="0"
      :max="24"
      style="width: 100%"
    ></n-input-number>
  </n-form-item>
</template>

<script>
export default {
  name: 'GridColPushEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
