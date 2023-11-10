<!--
  因tabs属性并不包含于options属性之中，故只能跟其他options属性之内的属性值合并设置，此处选择与customClass合并！！
-->

<template>
  <div>
    <n-form-item :label="'designer.setting.customClass'">
      <n-select
        v-model="optionModel.customClass"
        multiple
        filterable
        allow-create
        default-first-option
        :options="cssClassList"
      >
        <!-- <n-option
          v-for="(item, idx) in cssClassList"
          :key="idx"
          :label="item"
          :value="item"
        ></n-option> -->
      </n-select>
    </n-form-item>
    <n-form-item :label="'designer.setting.tabPaneSetting'"></n-form-item>
    <n-form-item label-width="0" class="panes-setting">
      <draggable
        tag="ul"
        :list="selectedWidget.tabs"
        item-key="id"
        v-bind="{
          group: 'panesGroup',
          ghostClass: 'ghost',
          handle: '.drag-option'
        }"
      >
        <template #item="{ element: tpItem, index: tpIdx }">
          <li class="col-item">
            <!-- span style="margin-right: 12px">{{tpIdx + 1}}</span -->
            <n-checkbox
              v-model="tpItem.options.active"
              disabled
              style="margin-right: 8px"
              @change="evt => onTabPaneActiveChange(evt, tpItem)"
            >
              {{ 'designer.setting.paneActive' }}
            </n-checkbox>
            <n-input
              v-model="tpItem.options.label"
              link
              type="primary"
              style="width: 155px"
            ></n-input>
            <i class="iconfont icon-drag drag-option"></i>
            <n-button
              circle
              plain
              size="small"
              type="danger"
              icon="n-icon-minus"
              class="col-delete-button"
              @click="deleteTabPane(selectedWidget, tpIdx)"
            ></n-button>
          </li>
        </template>
      </draggable>

      <div>
        <n-button link type="primary" @click="addTabPane(selectedWidget)">
          {{ 'designer.setting.addTabPane' }}
        </n-button>
      </div>
    </n-form-item>
  </div>
</template>

<script>
import { deepClone } from '@/utils/util'

export default {
  name: 'TabCustomClassEditor',
  componentName: 'PropertyEditor',
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  data() {
    return {
      cssClassList: []
    }
  },
  created() {
    this.cssClassList = deepClone(this.designer.getCssClassList())
    //监听表单css代码改动事件并重新加载！
    this.designer.handleEvent('form-css-updated', cssClassList => {
      this.cssClassList = cssClassList
    })
  },
  methods: {
    onTabPaneActiveChange(evt, tpItem) {
      //TODO: !!!
    },

    addTabPane(curTabs) {
      this.designer.addTabPaneOfTabs(curTabs)
      this.designer.emitHistoryChange()
    },

    deleteTabPane(curTabs, tpIdx) {
      if (curTabs.tabs.length === 1) {
        this.$message.info(this.i18nt('designer.hint.lastPaneCannotBeDeleted'))
        return
      }

      this.designer.deleteTabPaneOfTabs(curTabs, tpIdx)
      this.designer.emitHistoryChange()
    }
  }
}
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

.panes-setting {
  ul {
    padding-inline-start: 0;
    padding-left: 0; /* 重置IE11默认样式 */
    margin: 0;
  }

  .drag-option {
    cursor: move;
  }

  li.ghost {
    background: #fff;
    border: 2px dotted #ff4400;
  }
}
</style>
