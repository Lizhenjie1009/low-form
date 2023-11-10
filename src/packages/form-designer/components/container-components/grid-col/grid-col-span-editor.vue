<template>
  <div>
    <n-form-item
      v-if="!optionModel.responsive"
      :label="'designer.setting.colSpanTitle'"
    >
      <n-input-number
        v-model.number="optionModel.span"
        :min="1"
        :max="24"
        style="width: 100%"
      ></n-input-number>
    </n-form-item>
    <n-form-item
      v-if="!!optionModel.responsive && formConfig.layoutType === 'PC'"
      :label="'designer.setting.colSpanTitle' + '(PC)'"
    >
      <n-input-number
        v-model.number="optionModel.md"
        :min="1"
        :max="24"
        style="width: 100%"
      ></n-input-number>
    </n-form-item>
    <n-form-item
      v-if="!!optionModel.responsive && formConfig.layoutType === 'Pad'"
      :label="'designer.setting.colSpanTitle' + '(Pad)'"
    >
      <n-input-number
        v-model.number="optionModel.sm"
        :min="1"
        :max="24"
        style="width: 100%"
      ></n-input-number>
    </n-form-item>
    <n-form-item
      v-if="!!optionModel.responsive && formConfig.layoutType === 'H5'"
      :label="'designer.setting.colSpanTitle' + '(H5)'"
    >
      <n-input-number
        v-model.number="optionModel.xs"
        :min="1"
        :max="24"
        style="width: 100%"
      ></n-input-number>
    </n-form-item>
  </div>
</template>

<script>
export default {
  name: 'GridColSpanEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  computed: {
    formConfig() {
      return this.designer.formConfig
    }
  }
}
</script>

<style scoped></style>
