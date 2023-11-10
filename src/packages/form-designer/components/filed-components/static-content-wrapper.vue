<template>
  <div
    class="field-wrapper"
    :class="{ 'design-time-bottom-margin': !!designer }"
    :style="{ display: displayStyle }"
  >
    <div
      v-if="!field?.options.hidden || designState === true"
      class="static-content-item"
      :style="{ display: displayStyle }"
      :class="[selected ? 'selected' : '', customClass]"
      @click.stop="selectField(field)"
    >
      <slot></slot>
    </div>

    <template v-if="!!designer">
      <div v-if="designer.selectedId === field?.id" class="field-action">
        <i
          :title="widgetWrapper.selectParent.name"
          @click.stop="selectParentWidget"
        >
          <nsvg-icon :name="widgetWrapper.selectParent.icon" />
        </i>
        <i
          v-if="!!parentList && parentList.length > 1"
          :title="widgetWrapper.moveUp.name"
          @click.stop="moveUpWidget"
        >
          <nsvg-icon :name="widgetWrapper.moveUp.icon" />
        </i>
        <i
          v-if="!!parentList && parentList.length > 1"
          :title="widgetWrapper.moveDown.name"
          @click.stop="moveDownWidget"
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
        v-if="designer.selectedId === field?.id"
        class="drag-handler background-opacity"
      >
        <i :title="widgetWrapper.moveBar.name">
          <nsvg-icon :name="widgetWrapper.moveBar.icon" />
        </i>
        <i>{{ field?.label }}</i>
        <i v-if="field?.options.hidden === true">
          <svg-icon :name="widgetWrapper.moveBarHideTag.icon" />
        </i>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup name="StaticContentWrapper">
import { widgetWrapper } from '@/config'

const props = defineProps({
  field: Object,
  designer: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,

  designState: {
    type: Boolean,
    default: false
  },

  displayStyle: {
    type: String,
    default: 'block'
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
const selected = computed(() => {
  return !!props.designer && props.field.id === props.designer.selectedId
})
const customClass = computed(() => {
  return !!props.field.options.customClass
    ? props.field.options.customClass.join(' ')
    : ''
})

const selectField = field => {
  if (!!props.designer) {
    props.designer.setSelected(field)
    props.designer.emitEvent('field-selected', props.parentWidget) //发送选中组件的父组件对象
  }
}

const selectParentWidget = () => {
  if (props.parentWidget) {
    props.designer.setSelected(props.parentWidget)
  } else {
    props.designer.clearSelected()
  }
}

const moveUpWidget = () => {
  props.designer.moveUpWidget(props.parentList, props.indexOfParentList)
  props.designer.emitHistoryChange()
}

const moveDownWidget = () => {
  props.designer.moveDownWidget(props.parentList, props.indexOfParentList)
  props.designer.emitHistoryChange()
}

const removeFieldWidget = () => {
  if (!!props.parentList) {
    const fieldRefName = props.designer.selectedWidgetName
    let nextSelected = null
    if (props.parentList.length === 1) {
      if (!!props.parentWidget) {
        nextSelected = props.parentWidget
      }
    } else if (props.parentList.length === 1 + props.indexOfParentList) {
      nextSelected = props.parentList[props.indexOfParentList - 1]
    } else {
      nextSelected = props.parentList[props.indexOfParentList + 1]
    }

    nextTick(() => {
      props.parentList.splice(props.indexOfParentList, 1)
      props.designer.setSelected(nextSelected)

      props.designer.formWidget.deleteWidgetRef(fieldRefName) //删除组件ref！！！
      props.designer.emitHistoryChange()
    })
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
      margin: 0 5px;
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
    margin-left: 0.1em;
    margin-right: 0.1em;
  }
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
</style>
