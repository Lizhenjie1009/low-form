<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <n-row
      :key="widget?.id"
      :gutter="widget?.options.gutter"
      class="grid-container"
      :class="[selected ? 'selected' : '', customClass]"
      @click.stop="selectWidget(widget)"
    >
      <template v-for="(colWidget, colIdx) in widget?.cols" :key="colWidget.id">
        <grid-col-widget
          :widget="colWidget"
          :designer="designer"
          :parent-list="widget?.cols"
          :index-of-parent-list="colIdx"
          :parent-widget="widget"
          :col-height="widget?.options.colHeight"
        ></grid-col-widget>
      </template>
    </n-row>
  </container-wrapper>
</template>

<script lang="ts" setup name="grid-widget" namea="aa">
import ContainerWrapper from '@/packages/form-designer/components/container-components/container-wrapper.vue'
import GridColWidget from '@/packages/form-designer/components/container-components/grid-col/grid-col-widget.vue'
import { useContainerWrapper } from '@/hooks'

const props = defineProps({
  widget: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,
  designer: Object
})
const { selectWidget, selected, customClass } = useContainerWrapper(props)
console.log(getCurrentInstance(), '1111111111')
defineExpose({
  selectWidget,
  selected,
  customClass
})
</script>

<style lang="less" scoped>
::v-deep(.n-row).grid-container {
  min-height: 50px;
  //line-height: 48px;
  padding: 3px 0;
  outline: 1px dashed #336699 !important;

  .form-widget-list {
    min-height: 28px;
  }
}

.grid-container.selected,
.grid-cell.selected {
  outline: 2px solid #ff4400 !important;
}
</style>
