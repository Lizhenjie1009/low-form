<template>
  <div class="container-wrapper" :class="[customClass]">
    <slot></slot>

    <div
      v-if="designer?.selectedId === widget?.id && !widget?.internal"
      class="container-action"
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
        v-if="widget?.type === 'table'"
        :title="widgetWrapper.insertRow.name"
        @click.stop="appendTableRow(widget)"
        ><nsvg-icon :name="widgetWrapper.insertRow.icon"
      /></i>
      <i
        v-if="widget?.type === 'table'"
        :title="widgetWrapper.insertCol.name"
        @click.stop="appendTableCol(widget)"
        ><nsvg-icon :name="widgetWrapper.insertCol.icon"
      /></i>
      <i
        v-if="widget?.type === 'grid' || widget?.type === 'table'"
        :title="widgetWrapper.copyComp.name"
        @click.stop="cloneContainer(widget)"
        ><nsvg-icon :name="widgetWrapper.copyComp.icon"
      /></i>
      <i :title="widgetWrapper.deleteComp.name" @click.stop="removeWidget">
        <nsvg-icon :name="widgetWrapper.deleteComp.icon" />
      </i>
    </div>

    <div
      v-if="designer?.selectedId === widget?.id && !widget?.internal"
      class="drag-handler"
    >
      <i :title="widgetWrapper.moveBar.name">
        <nsvg-icon :name="widgetWrapper.moveBar.icon" />
      </i>
      <i>{{ widget?.label }}</i>
      <i v-if="widget?.options.hidden === true">
        <svg-icon :name="widgetWrapper.moveBarHideTag.icon" />
      </i>
    </div>
  </div>
</template>

<script lang="ts" setup name="ContainerWrapper">
import { widgetWrapper } from '@/config'
import { useContainerWrapper } from '@/hooks'

const props = defineProps({
  widget: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,
  designer: Object
})

const {
  selectParentWidget,
  moveUpWidget,
  moveDownWidget,
  appendTableRow,
  appendTableCol,
  cloneContainer,
  removeWidget
} = useContainerWrapper(props)

const customClass = computed(() =>
  !!props?.widget?.options.customClass
    ? props.widget.options.customClass.join(' ')
    : ''
)
</script>

<style lang="less" scoped>
.container-wrapper {
  position: relative;
  margin-bottom: 5px;

  .container-action {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 28px;
    line-height: 28px;
    background: #ff4400;
    z-index: 999;
    padding-top: 5px;
    i {
      font-size: 16px;
      margin: 0 3px;
      color: #fff;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: -2px;
    //bottom: -24px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -2px;
    height: 22px;
    line-height: 22px;
    background: #ff4400;
    z-index: 9;

    i {
      font-size: 16px;
      color: #fff;
      margin: 0 3px;
      cursor: move;
    }
  }
}

.container-action,
.drag-handler {
  :deep(.svg-icon) {
    margin-left: 0.1em;
    margin-right: 0.1em;
  }
}
</style>
