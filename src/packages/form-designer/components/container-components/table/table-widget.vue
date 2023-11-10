<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <div
      :key="widget?.id"
      class="table-container"
      :class="[selected ? 'selected' : '', customClass]"
      @click.stop="selectWidget(widget)"
    >
      <table class="table-layout">
        <tbody>
          <tr v-for="(row, rowIdx) in widget?.rows" :key="row.id">
            <template v-for="(colWidget, colIdx) in row.cols">
              <table-cell-widget
                v-if="!colWidget.merged"
                :key="colWidget.id"
                :widget="colWidget"
                :designer="designer"
                :parent-list="widget?.cols"
                :row-index="rowIdx"
                :row-length="widget?.rows.length"
                :col-index="colIdx"
                :col-length="row.cols.length"
                :col-array="row.cols"
                :row-array="widget?.rows"
                :parent-widget="widget"
              ></table-cell-widget>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </container-wrapper>
</template>

<script lang="ts" setup name="TableWidget">
import ContainerWrapper from '@/packages/form-designer/components/container-components/container-wrapper.vue'
import TableCellWidget from '@/packages/form-designer/components/container-components/table-cell/table-cell-widget.vue'
import { useContainerWrapper } from '@/hooks'

const props = defineProps({
  widget: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,
  designer: Object
})
const { selectWidget, selected, customClass } = useContainerWrapper(props)
</script>

<style lang="less" scoped>
div.table-container {
  padding: 5px;
  border: 1px dashed #336699;
  box-sizing: border-box;

  table.table-layout {
    width: 100%;
    text-align: center;
    //border: 1px solid #c8ebfb;
    border-collapse: collapse;
    table-layout: fixed;

    :deep(td) {
      height: 48px;
      border: 1px dashed #336699;
      padding: 3px;
      display: table-cell;
    }

    .form-widget-list {
      border: 1px dashed #336699;
      min-height: 36px;
    }
  }
}

.table-container.selected {
  outline: 2px solid #ff4400 !important;
}
</style>
