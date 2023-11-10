<template>
  <td
    class="table-cell"
    :class="[selected ? 'selected' : '', customClass]"
    :style="{
      width: widget.options.cellWidth + '!important' || '',
      height: widget.options.cellHeight + '!important' || '',
      'word-break': !!widget.options.wordBreak ? 'break-all' : 'normal'
    }"
    :colspan="widget.options.colspan || 1"
    :rowspan="widget.options.rowspan || 1"
    @click.stop="selectWidget(widget)"
  >
    <draggable
      :list="widget.widgetList"
      item-key="id"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      :move="checkContainerMove"
      @add="evt => onContainerDragAdd(evt, widget.widgetList)"
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
      v-if="designer.selectedId === widget.id && widget.type === 'table-cell'"
      class="table-cell-action"
    >
      <i
        :title="widgetWrapper.selectParent.name"
        @click.stop="selectParentWidget()"
      >
        <nsvg-icon :name="widgetWrapper.selectParent.icon" />
      </i>
      <n-dropdown
        :options="dropdownOptions"
        trigger="click"
        size="small"
        @select="handleTableCellCommand"
      >
        <i :title="widgetWrapper.cellSetting.name">
          <nsvg-icon :name="widgetWrapper.cellSetting.icon" />
        </i>
      </n-dropdown>
    </div>
    <div
      v-if="
        designer?.selectedId === widget?.id && widget?.type === 'table-cell'
      "
      class="table-cell-handler"
    >
      <i>{{ widget.label }}</i>
    </div>
  </td>
</template>

<script lang="ts" setup name="TableCellWidget">
import { widgetWrapper, setting } from '@/config'
import { useContainerWrapper } from '@/hooks'

const props = defineProps({
  widget: Object,
  parentWidget: Object,
  parentList: Array,

  rowIndex: Number,
  colIndex: Number,
  rowLength: Number,
  colLength: Number,
  colArray: Array,
  rowArray: Array,

  designer: Object
})
const {
  selectWidget,
  checkContainerMove,
  selectParentWidget,
  onContainerDragAdd,
  onContainerDragUpdate,
  selected,
  customClass
} = useContainerWrapper(props)

const mergeLeftColDisabled = computed(() => {
  return (
    props.colIndex <= 0 ||
    props.colArray[props.colIndex - 1].options.rowspan !==
      props.widget.options.rowspan
  )
})
const mergeRightColDisabled = computed(() => {
  let rightColIndex = props.colIndex + props.widget.options.colspan
  return (
    props.colIndex >= props.colLength - 1 ||
    rightColIndex > props.colLength - 1 ||
    props.colArray[rightColIndex].options.rowspan !==
      props.widget.options.rowspan
  )
})
const mergeWholeRowDisabled = computed(() => {
  return (
    props.colLength <= 1 ||
    props.colLength === props.widget.options.colspan ||
    [
      ...new Set(
        props.rowArray[props.rowIndex].cols.map(col => col.options.rowspan)
      )
    ].length > 1
  )
})

const mergeAboveRowDisabled = computed(() => {
  return (
    props.rowIndex <= 0 ||
    props.rowArray[props.rowIndex - 1].cols[props.colIndex].options.colspan !==
      props.widget.options.colspan
  )

  //return props.rowIndex <= 0
  //return (props.rowIndex <= 0) || (props.widget.options.colspan !== props.rowArray) //TODO
})
const mergeBelowRowDisabled = computed(() => {
  let belowRowIndex = props.rowIndex + props.widget.options.rowspan
  return (
    props.rowIndex >= props.rowLength - 1 ||
    belowRowIndex > props.rowLength - 1 ||
    props.rowArray[belowRowIndex].cols[props.colIndex].options.colspan !==
      props.widget.options.colspan
  )
})
const mergeWholeColDisabled = computed(() => {
  return (
    props.rowLength <= 1 ||
    props.rowLength === props.widget.options.rowspan ||
    [
      ...new Set(
        props.rowArray.map(row => row.cols[props.colIndex].options.colspan)
      )
    ].length > 1
  )
})
const undoMergeColDisabled = computed(() => {
  return props.widget.merged || props.widget.options.colspan <= 1
})
const undoMergeRowDisabled = computed(() => {
  return props.widget.merged || props.widget.options.rowspan <= 1
})
const deleteWholeColDisabled = computed(() => {
  return (
    props.colLength === 1 || props.widget.options.colspan === props.colLength
  )
})
const deleteWholeRowDisabled = computed(() => {
  return (
    props.rowLength === 1 || props.widget.options.rowspan === props.rowLength
  )
})

const dropdownOptions = ref([
  {
    label: setting.insertColumnToLeft.name,
    key: 'insertLeftCol'
  },
  {
    label: setting.insertColumnToRight.name,
    key: 'insertRightCol'
  },
  {
    label: setting.insertRowAbove.name,
    key: 'insertAboveRow'
  },
  {
    label: setting.insertRowBelow.name,
    key: 'insertBelowRow'
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: setting.mergeLeftColumn.name,
    key: 'mergeLeftCol',
    disabled: mergeLeftColDisabled
  },
  {
    label: setting.mergeRightColumn.name,
    key: 'mergeRightCol',
    disabled: mergeRightColDisabled
  },
  {
    label: setting.mergeEntireRow.name,
    key: 'mergeWholeRow',
    disabled: mergeWholeRowDisabled
  },
  {
    label: setting.mergeRowAbove.name,
    key: 'mergeAboveRow',
    disabled: mergeAboveRowDisabled
  },
  {
    label: setting.mergeRowBelow.name,
    key: 'mergeBelowRow',
    disabled: mergeBelowRowDisabled
  },
  {
    label: setting.mergeEntireColumn.name,
    key: 'mergeWholeCol',
    disabled: mergeWholeColDisabled
  },
  {
    type: 'divider',
    key: 'd2'
  },
  {
    label: setting.undoMergeRow.name,
    key: 'undoMergeRow',
    disabled: undoMergeRowDisabled
  },
  {
    label: setting.undoMergeCol.name,
    key: 'undoMergeCol',
    disabled: undoMergeColDisabled
  },
  {
    type: 'divider',
    key: 'd3'
  },
  {
    label: setting.deleteEntireCol.name,
    key: 'deleteWholeCol',
    disabled: deleteWholeColDisabled
  },
  {
    label: setting.deleteEntireRow.name,
    key: 'deleteWholeRow',
    disabled: deleteWholeRowDisabled
  }
])

const insertLeftCol = () => {
  props.designer.insertTableCol(
    props.parentWidget,
    props.colIndex,
    props.rowIndex,
    true
  )
}
const insertRightCol = () => {
  props.designer.insertTableCol(
    props.parentWidget,
    props.colIndex,
    props.rowIndex,
    false
  )
}
const insertAboveRow = () => {
  props.designer.insertTableRow(
    props.parentWidget,
    props.rowIndex,
    props.rowIndex,
    props.colIndex,
    true
  )
}
const insertBelowRow = () => {
  props.designer.insertTableRow(
    props.parentWidget,
    props.rowIndex,
    props.rowIndex,
    props.colIndex,
    false
  )
}
const mergeLeftCol = () => {
  props.designer.mergeTableCol(
    props.rowArray,
    props.colArray,
    props.rowIndex,
    props.colIndex,
    true,
    props.widget
  )
}
const mergeRightCol = () => {
  props.designer.mergeTableCol(
    props.rowArray,
    props.colArray,
    props.rowIndex,
    props.colIndex,
    false,
    props.widget
  )
}
const mergeWholeRow = () => {
  props.designer.mergeTableWholeRow(
    props.rowArray,
    props.colArray,
    props.rowIndex,
    props.colIndex
  )
}
const mergeAboveRow = () => {
  props.designer.mergeTableRow(
    props.rowArray,
    props.rowIndex,
    props.colIndex,
    true,
    props.widget
  )
}
const mergeBelowRow = () => {
  props.designer.mergeTableRow(
    props.rowArray,
    props.rowIndex,
    props.colIndex,
    false,
    props.widget
  )
}
const mergeWholeCol = () => {
  props.designer.mergeTableWholeCol(
    props.rowArray,
    props.colArray,
    props.rowIndex,
    props.colIndex
  )
}
const undoMergeCol = () => {
  console.log(
    props.rowIndex,
    props.colIndex,
    props.widget.options.colspan,
    props.widget.options.rowspan
  )
  props.designer.undoMergeTableCol(
    props.rowArray,
    props.rowIndex,
    props.colIndex,
    props.widget.options.colspan,
    props.widget.options.rowspan
  )
}
const undoMergeRow = () => {
  props.designer.undoMergeTableRow(
    props.rowArray,
    props.rowIndex,
    props.colIndex,
    props.widget.options.colspan,
    props.widget.options.rowspan
  )
}
const deleteWholeCol = () => {
  props.designer.deleteTableWholeCol(props.rowArray, props.colIndex)
}
const deleteWholeRow = () => {
  props.designer.deleteTableWholeRow(props.rowArray, props.rowIndex)
}

const handleTableCellCommand = command => {
  if (command === 'insertLeftCol') {
    insertLeftCol()
  } else if (command === 'insertRightCol') {
    insertRightCol()
  } else if (command === 'insertAboveRow') {
    insertAboveRow()
  } else if (command === 'insertBelowRow') {
    insertBelowRow()
  } else if (command === 'mergeLeftCol') {
    mergeLeftCol()
  } else if (command === 'mergeRightCol') {
    mergeRightCol()
  } else if (command === 'mergeWholeCol') {
    mergeWholeCol()
  } else if (command === 'mergeAboveRow') {
    mergeAboveRow()
  } else if (command === 'mergeBelowRow') {
    mergeBelowRow()
  } else if (command === 'mergeWholeRow') {
    mergeWholeRow()
  } else if (command === 'undoMergeCol') {
    undoMergeCol()
  } else if (command === 'undoMergeRow') {
    undoMergeRow()
  } else if (command === 'deleteWholeCol') {
    deleteWholeCol()
  } else if (command === 'deleteWholeRow') {
    deleteWholeRow()
  }
}
</script>

<style lang="less" scoped>
.table-cell {
  //padding: 3px;
  border: 1px dashed #336699;
  display: table-cell;
  position: relative;

  .draggable-div {
    position: relative;
    height: 100%;
  }

  .form-widget-list {
    border: 1px dashed #336699;
    margin: 3px;
    min-height: 28px;
    //height: 100%;
  }

  .table-cell-action {
    position: absolute;
    //bottom: -30px;
    bottom: 0;
    right: -2px;
    height: 28px;
    line-height: 28px;
    background: #ff4400;
    z-index: 999;

    display: flex;
    align-items: center;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .table-cell-handler {
    position: absolute;
    top: -2px;
    //bottom: -24px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -2px;
    height: 22px;
    line-height: 22px;
    background: #ff4400;
    z-index: 9;

    i {
      font-size: 14px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: default; //cursor: move;
    }
  }
}

.table-cell-action,
.table-cell-handler {
  :deep(.svg-icon) {
    margin-left: 0.1em;
    margin-right: 0.1em;
  }
}

.table-cell.selected {
  outline: 2px solid #ff4400 !important;
}
</style>
