<template>
  <div
    class="field-wrapper"
    :class="{ 'design-time-bottom-margin': !!designer }"
  >
    <n-form-item
      v-if="
        !!field.formItemFlag && (!field.options.hidden || designState === true)
      "
      :label="label"
      :label-width="labelWidth + 'px'"
      :title="field.options.labelTooltip"
      :rule="rules"
      :rule-path="getPropName()"
      :class="[
        selected ? 'selected' : '',
        labelAlign,
        customClass,
        field.options.required ? 'required' : ''
      ]"
      @click.stop="selectField(field)"
    >
      <template #label>
        <span v-if="!!field.options.labelIconClass" class="custom-label">
          <template v-if="field.options.labelIconPosition === 'front'">
            <template v-if="!!field.options.labelTooltip">
              <n-tooltip trigger="hover" effect="light">
                <template #trigger>
                  <svg-icon :icon-class="field.options.labelIconClass" />
                </template>
                {{ field.options.labelTooltip }}
              </n-tooltip>
              {{ label }}
            </template>
            <template v-else>
              <svg-icon :icon-class="field.options.labelIconClass" />
              {{ label }}
            </template>
          </template>
          <template v-else-if="field.options.labelIconPosition === 'rear'">
            <template v-if="!!field.options.labelTooltip">
              {{ label }}
              <n-tooltip trigger="hover" effect="light">
                <template #trigger>
                  <svg-icon :icon-class="field.options.labelIconClass" />
                </template>
                {{ field.options.labelTooltip }}
              </n-tooltip>
            </template>
            <template v-else>
              {{ label }}
              <svg-icon :icon-class="field.options.labelIconClass" />
            </template>
          </template>
        </span>
        <span v-else>
          {{ label }}
        </span>
      </template>
      <slot></slot>
    </n-form-item>

    <template v-if="!!designer">
      <div v-if="designer.selectedId === field.id" class="field-action">
        <i
          :title="widgetWrapper.selectParent.name"
          @click.stop="selectParentWidget(field)"
        >
          <nsvg-icon :name="widgetWrapper.selectParent.icon" />
        </i>
        <i
          v-if="!!parentList && parentList.length > 1"
          :title="widgetWrapper.moveUp.name"
          @click.stop="moveUpWidget(field)"
        >
          <nsvg-icon :name="widgetWrapper.moveUp.icon" />
        </i>
        <i
          v-if="!!parentList && parentList.length > 1"
          :title="widgetWrapper.moveDown.name"
          @click.stop="moveDownWidget(field)"
        >
          <nsvg-icon :name="widgetWrapper.moveDown.icon" />
        </i>
        <i
          :title="widgetWrapper.deleteComp.name"
          @click.stop="removeFieldWidget"
        >
          <nsvg-icon :name="widgetWrapper.deleteComp.icon" />
        </i>
      </div>

      <div
        v-if="designer.selectedId === field.id"
        class="drag-handler background-opacity"
      >
        <i :title="widgetWrapper.moveBar.name">
          <nsvg-icon :name="widgetWrapper.moveBar.icon" />
        </i>
        <i>
          {{ field.label }}
        </i>
        <i v-if="field.options.hidden === true">
          <svg-icon :name="widgetWrapper.moveBarHideTag.icon" />
        </i>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup name="FormItemWrapper">
import { widgetWrapper } from '@/config'
import { useFiledsWrapper } from '@/hooks'

var props = defineProps({
  field: Object,
  designer: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,
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
  },
  rules: Array
})

const {
  selectField,
  selectParentWidget,
  moveUpWidget,
  moveDownWidget,
  removeFieldWidget,
  selected,
  customClass
} = useFiledsWrapper(props)

const formConfig = computed(() => {
  return props.designer.formConfig
})

const label = computed(() => {
  if (!!props.field.options.labelHidden) {
    return ''
  }

  return props.field.options.label
})

const labelWidth = computed(() => {
  if (!!props.field.options.labelHidden) {
    return 0
  }

  if (!!props.field.options.labelWidth) {
    return props.field.options.labelWidth
  }

  if (!!props.designer) {
    return props.designer.formConfig.labelWidth
  } else {
    return formConfig.value.labelWidth
  }
})

const labelAlign = computed(() => {
  if (!!props.field.options.labelAlign) {
    return props.field.options.labelAlign
  }

  if (!!props.designer) {
    return props.designer.formConfig.labelAlign || 'label-left-align'
  } else {
    return formConfig.value.labelAlign || 'label-left-align'
  }
})

const subFormName = computed(() => {
  return !!props.parentWidget ? props.parentWidget.options.name : ''
})

const subFormItemFlag = computed(() => {
  return !!props.parentWidget ? props.parentWidget.type === 'sub-form' : false
})

const getPropName = () => {
  if (subFormItemFlag.value && !props.designState) {
    return (
      subFormName.value +
      '.' +
      props.subFormRowIndex +
      '.' +
      props.field.options.name +
      ''
    )
  } else {
    return props.field.options.name
  }
}
</script>

<style lang="less" scoped>
// @import '../../../../styles/global.scss';

.design-time-bottom-margin {
  margin-bottom: 5px;
}

.field-wrapper {
  position: relative;

  .field-action {
    position: absolute;
    //bottom: -24px;
    bottom: 0;
    right: -2px;
    height: 22px;
    line-height: 22px;
    background: #ff4400;
    z-index: 9;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 3px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: 0;
    //bottom: -22px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -1px;
    height: 20px;
    line-height: 20px;
    //background: #ff4400;
    z-index: 9;

    i {
      font-size: 12px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: move;
    }

    &:hover {
      //opacity: 1;
      background: #ff4400;
    }
  }
}

.field-action,
.drag-handler {
  :deep(.svg-icon) {
    margin-left: 0;
    margin-right: 0;
  }
}

.n-form-item {
  //margin-bottom: 0 !important;
  //margin-bottom: 6px;

  //margin-top: 2px;
  position: relative;

  :deep(.el-form-item__label) {
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :deep(.el-form-item__content) {
    //position: unset;  /* TODO: 忘了这个样式设置是为了解决什么问题？？ */
  }

  span.custom-label i {
    margin: 0 3px;
  }

  /* 隐藏Chrome浏览器中el-input数字输入框右侧的上下调整小箭头 */
  :deep(.hide-spin-button) input::-webkit-outer-spin-button,
  :deep(.hide-spin-button) input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /* 隐藏Firefox浏览器中el-input数字输入框右侧的上下调整小箭头 */
  :deep(.hide-spin-button) input[type='number'] {
    -moz-appearance: textfield;
  }
}

.required :deep(.el-form-item__label)::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.static-content-item {
  min-height: 20px;
  display: flex; /* 垂直居中 */
  align-items: center; /* 垂直居中 */

  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}

.el-form-item.selected,
.static-content-item.selected {
  outline: 2px solid #ff4400;
}

:deep(.label-left-align) .el-form-item__label {
  text-align: left;
  justify-content: flex-start !important;
}

:deep(.label-center-align) .el-form-item__label {
  text-align: center;
  justify-content: center !important;
}

:deep(.label-right-align) .el-form-item__label {
  text-align: right;
  justify-content: flex-end !important;
}
</style>
