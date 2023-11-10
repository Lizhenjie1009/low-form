<template>
  <div>
    <n-form-item label-width="0">
      <n-divider class="custom-divider">{{
        'designer.setting.columnSetting'
      }}</n-divider>
    </n-form-item>
    <n-form-item :label="'designer.setting.gutter'">
      <n-input-number
        v-model:value="optionModel.gutter"
        style="width: 100%"
      ></n-input-number>
    </n-form-item>
    <n-form-item :label="'designer.setting.colsOfGrid'"></n-form-item>
    <n-form-item label-width="0">
      <li
        v-for="(colItem, colIdx) in selectedWidget.cols"
        :key="colIdx"
        class="col-item"
      >
        <span class="col-span-title"
          >{{ 'designer.setting.colSpanTitle' }}{{ colIdx + 1 }}</span
        >
        <n-input-number
          v-model:value="colItem.options.span"
          :min="1"
          :max="24"
          class="cell-span-input"
          @update:value="
            (newValue, oldValue) =>
              spanChanged(selectedWidget, colItem, colIdx, newValue, oldValue)
          "
        ></n-input-number>
        <n-button
          circle
          plain
          size="small"
          type="error"
          icon="el-icon-minus"
          class="col-delete-button"
          @click="deleteCol(selectedWidget, colIdx)"
        ></n-button>
      </li>
      <div>
        <n-button link type="primary" @click="addNewCol(selectedWidget)">{{
          'designer.setting.addColumn'
        }}</n-button>
      </div>
    </n-form-item>
  </div>
</template>

<script lang="ts" setup name="GutterEditor">
const props = defineProps({
  designer: Object,
  selectedWidget: Object,
  optionModel: Object
})
const spanChanged = curGrid => {
  let spanSum = 0
  curGrid.cols.forEach(colItem => {
    spanSum += colItem.options.span
  })
  if (spanSum > 24) {
    //this.$message.info('列栅格之和超出24')
    console.log('列栅格之和超出24')
    //TODO: 语言字符串资源化
  }

  props.designer.saveCurrentHistoryStep()
}

const deleteCol = (curGrid, colIdx) => {
  props.designer.deleteColOfGrid(curGrid, colIdx)
  props.designer.emitHistoryChange()
}

const addNewCol = curGrid => {
  props.designer.addNewColOfGrid(curGrid)
  props.designer.emitHistoryChange()
}

watch(
  () => props.optionModel,
  v => console.log(v, 'w')
)
</script>

<style lang="less" scoped>
li.col-item {
  list-style: none;

  span.col-span-title {
    display: inline-block;
    font-size: 13px;
    width: 120px;
  }

  .col-delete-button {
    margin-left: 6px;
  }
}
</style>
