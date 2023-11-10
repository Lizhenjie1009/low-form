<template>
  <form-item-wrapper
    :designer="designer"
    :field="field"
    :rules="rules"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <!-- :size="widgetSize" -->
    <n-input
      ref="fieldEditor"
      v-model="fieldModel"
      :disabled="field.options.disabled"
      :readonly="field.options.readonly"
      class="hide-spin-button"
      :type="inputType"
      :show-password="field.options.showPassword"
      :placeholder="field.options.placeholder"
      :clearable="field.options.clearable"
      :minlength="field.options.minLength"
      :maxlength="field.options.maxLength"
      :show-word-limit="field.options.showWordLimit"
      :prefix-icon="field.options.prefixIcon"
      :suffix-icon="field.options.suffixIcon"
      @focus="handleFocusCustomEvent"
      @blur="handleBlurCustomEvent"
      @input="v => handleInputCustomEvent(v, $parent)"
      @change="v => handleChangeEvent(v, $parent)"
    >
      <template v-if="field.options.appendButton" #append>
        <el-button
          :disabled="
            field.options.disabled || field.options.appendButtonDisabled
          "
          @click="emitAppendButtonClick"
          ><svg-icon :icon-class="field.options.buttonIcon"
        /></el-button>
      </template>
    </n-input>
  </form-item-wrapper>
</template>

<script lang="ts" setup name="InputWidget" componentName="FieldWidget">
import FormItemWrapper from '../../form-item-wrapper.vue'
import { useFiledsConfig } from '@/hooks'
const props = defineProps({
  field: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,
  designer: Object,

  designState: {
    type: Boolean,
    default: false
  },

  subFormRowIndex: {
    /* 子表单组件行索引，从0开始计数 */ type: Number,
    default: -1
  },
  subFormColIndex: {
    /* 子表单组件列索引，从0开始计数 */ type: Number,
    default: -1
  },
  subFormRowId: {
    /* 子表单组件行Id，唯一id且不可变 */ type: String,
    default: ''
  }
})

const oldFieldValue = ref(null) //field组件change之前的值
const fieldModel = ref(null)
const rules = ref([])
const {
  widgetSize,
  inputType,
  initFieldModel,
  registerToRefList,
  initEventHandler,
  buildFieldRules,
  handleOnCreated,
  handleOnMounted,
  unregisterFromRefList,
  handleChangeEvent,
  handleFocusCustomEvent,
  handleBlurCustomEvent,
  handleInputCustomEvent
} = useFiledsConfig(props, { oldFieldValue, fieldModel, rules })

initFieldModel()
registerToRefList()
initEventHandler()
buildFieldRules()
handleOnCreated()

onBeforeMount(() => {
  unregisterFromRefList()
})
onMounted(() => {
  handleOnMounted()
})
</script>

<style lang="less" scoped>
// @import '../../../../styles/global.scss'; /* form-item-wrapper已引入，还需要重复引入吗？ */
</style>
