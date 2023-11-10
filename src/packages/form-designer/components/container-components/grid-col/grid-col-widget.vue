<template>
  <n-col
    v-if="widget?.type === 'grid-col'"
    v-bind="layoutProps"
    :key="widget?.id"
    class="grid-cell"
    :class="[selected ? 'selected' : '', customClass]"
    :style="colHeightStyle"
    @click.stop="selectWidget(widget)"
  >
    <button @click="a($parent)">bttnn</button>

    <draggable
      :list="widget.widgetList"
      item-key="id"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      class="min-h-48px"
      :move="checkContainerMove"
      @add="(e: Event) => onContainerDragAdd(e, widget?.widgetList)"
      @update="onContainerDragUpdate"
    >
      <template #item="{ element: subWidget, index: swIdx }">
        <div class="form-widget-list">
          <template v-if="'container' === subWidget.category">
            <component
              :is="subWidget.type + '-widget'"
              :key="subWidget.id"
              :widget="subWidget"
              :designer="designer"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
            ></component>
          </template>
          <template v-else>
            <component
              :is="subWidget.type + '-widget'"
              :key="subWidget.id"
              :field="subWidget"
              :designer="designer"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
              :design-state="true"
            ></component>
          </template>
        </div>
      </template>
    </draggable>

    <div
      v-if="designer?.selectedId === widget.id && widget.type === 'grid-col'"
      class="grid-col-action"
    >
      <i
        :title="widgetWrapper.selectParent.name"
        @click.stop="selectParentWidget()"
      >
        <nsvg-icon :name="widgetWrapper.selectParent.icon" />
      </i>
      <i
        v-if="!!parentList && parentList.length > 1"
        :title="widgetWrapper.moveUp.name"
        @click.stop="moveUpWidget()"
      >
        <nsvg-icon :name="widgetWrapper.moveUp.icon" />
      </i>
      <i
        v-if="!!parentList && parentList.length > 1"
        :title="widgetWrapper.moveDown.name"
        @click.stop="moveDownWidget()"
      >
        <nsvg-icon :name="widgetWrapper.moveDown.icon" />
      </i>
      <i
        :title="widgetWrapper.copyComp.name"
        @click.stop="cloneGridCol(widget)"
      >
        <nsvg-icon :name="widgetWrapper.copyComp.icon" />
      </i>
      <i :title="widgetWrapper.deleteComp.name" @click.stop="removeWidget">
        <nsvg-icon :name="widgetWrapper.deleteComp.icon" />
      </i>
    </div>

    <div
      v-if="designer?.selectedId === widget.id && widget.type === 'grid-col'"
      class="grid-col-handler"
    >
      <i>{{ widget.label }}</i>
    </div>
  </n-col>
</template>

<script lang="ts" setup name="GridColWidget">
import { widgetWrapper } from '@/config'
import { useContainerWrapper } from '@/hooks'

const props = defineProps({
  widget: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,
  designer: Object,
  colHeight: {
    type: String,
    default: null
  }
})
const a = a => console.log(a.$parent.$parent.$options, 1)

// const  refList = {},
const layoutProps = ref({
  span: props.widget.options.span || 12,
  offset: props.widget.options.offset || 0,
  push: props.widget.options.push || 0,
  pull: props.widget.options.pull || 0
})

const colHeightStyle = computed(() =>
  !!props.colHeight ? { height: props.colHeight + 'px' } : {}
)

watch(
  () => props.designer.formConfig.layoutType,
  val => {
    if (!!props.widget.options.responsive) {
      if (val === 'H5') {
        layoutProps.value.span = props.widget.options.xs || 12
      } else if (val === 'Pad') {
        layoutProps.value.span = props.widget.options.sm || 12
      } else {
        layoutProps.value.span = props.widget.options.md || 12
      }
    } else {
      layoutProps.value.span = props.widget.options.span || 12
    }
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.responsive,
  val => {
    let lyType = props.designer.formConfig.layoutType
    if (!!val) {
      if (lyType === 'H5') {
        layoutProps.value.span = props.widget.options.xs || 12
      } else if (lyType === 'Pad') {
        layoutProps.value.span = props.widget.options.sm || 12
      } else {
        layoutProps.value.span = props.widget.options.md || 12
      }
    } else {
      layoutProps.value.span = props.widget.options.span || 12
    }
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.span,
  val => {
    console.log(val, 1111111)
    layoutProps.value.span = val
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.md,
  val => {
    layoutProps.value.span = val
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.sm,
  val => {
    layoutProps.value.span = val
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.xs,
  val => {
    layoutProps.value.span = val
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.offset,
  val => {
    layoutProps.value.offset = val
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.push,
  val => {
    layoutProps.value.push = val
  },
  {
    deep: true
  }
)

watch(
  () => props.widget.options.pull,
  val => {
    layoutProps.value.pull = val
  },
  {
    deep: true
  }
)

const initLayoutProps = () => {
  if (!!props.widget.options.responsive) {
    let lyType = props.designer.formConfig.layoutType
    if (lyType === 'H5') {
      layoutProps.value.span = props.widget.options.xs || 12
    } else if (lyType === 'Pad') {
      layoutProps.value.span = props.widget.options.sm || 12
    } else {
      layoutProps.value.span = props.widget.options.md || 12
    }
  } else {
    layoutProps.value.span = props.widget.options.span
  }
}
initLayoutProps()

const {
  selectWidget,
  checkContainerMove,
  selectParentWidget,
  onContainerDragAdd,
  onContainerDragUpdate,
  selected,
  customClass
} = useContainerWrapper(props)

const moveUpWidget = () => {
  props.designer.moveUpWidget(props.parentList, props.indexOfParentList)
}

const moveDownWidget = () => {
  props.designer.moveDownWidget(props.parentList, props.indexOfParentList)
}

const cloneGridCol = widget => {
  props.designer.cloneGridCol(widget, props.parentWidget)
}

const removeWidget = () => {
  if (!!props.parentList) {
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
      props.designer.emitHistoryChange()
    })
  }
}
</script>

<style lang="less" scoped>
.grid-cell {
  min-height: 48px !important;
  //margin: 6px 0;  /* 设置了margin，栅格列的offset、push、pull会失效！！ */
  padding: 3px !important;
  outline: 1px dashed #336699 !important;
  position: relative;

  .form-widget-list {
    min-height: 48px;
  }

  .grid-col-action {
    position: absolute;
    bottom: 0;
    right: -2px;
    height: 28px;
    line-height: 28px;
    background: #ff4400;
    z-index: 999;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .grid-col-handler {
    position: absolute;
    top: -2px;
    left: -2px;
    height: 22px;
    line-height: 22px;
    background: #ff4400;
    z-index: 9;
  }
}

.grid-col-action,
.grid-col-handler {
  :deep(.svg-icon) {
    margin-left: 0.1em;
    margin-right: 0.1em;
  }
}
</style>
