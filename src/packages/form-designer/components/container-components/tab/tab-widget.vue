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
      class="tab-container"
      :class="{ selected: selected }"
      @click.stop="selectWidget(widget)"
    >
      <n-tabs
        v-model="activeTab"
        :type="widget?.displayType"
        @tab-click="onTabClick"
      >
        <n-tab-pane
          v-for="(tab, index) in widget?.tabs"
          :key="index"
          :tab="tab.options.label"
          :name="tab.options.name"
          @click.stop="selectWidget(widget)"
        >
          <draggable
            :list="tab.widgetList"
            item-key="id"
            v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
            handle=".drag-handler"
            class="min-h-30px"
            :move="checkContainerMove"
            @add="(e: Event) => onContainerDragAdd(e, tab.widgetList)"
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
                    :parent-list="tab.widgetList"
                    :index-of-parent-list="swIdx"
                    :parent-widget="widget"
                  >
                  </component>
                </template>
                <template v-else>
                  <component
                    :is="subWidget.type + '-widget'"
                    :key="subWidget.id"
                    :field="subWidget"
                    :designer="designer"
                    :parent-list="tab.widgetList"
                    :index-of-parent-list="swIdx"
                    :parent-widget="widget"
                    :design-state="true"
                  >
                  </component>
                </template>
              </div>
            </template>
          </draggable>
        </n-tab-pane>
      </n-tabs>
    </div>
  </container-wrapper>
</template>

<script lang="ts" setup name="TabWidget">
import ContainerWrapper from '@/packages/form-designer/components/container-components/container-wrapper.vue'
import { useContainerWrapper } from '@/hooks'
const props = defineProps({
  widget: Object,
  parentWidget: Object,
  parentList: Array,
  indexOfParentList: Number,
  designer: Object
})
const {
  selectWidget,
  onContainerDragAdd,
  checkContainerMove,
  onContainerDragUpdate,
  selected,
  customClass
} = useContainerWrapper(props)

const activeTab = ref('tab1')

const onTabClick = evt => {
  let paneName = evt.paneName
  props?.widget?.tabs.forEach(tp => {
    tp.options.active = tp.options.name === paneName
  })
}
</script>

<style lang="less" scoped>
.tab-container {
  //padding: 5px;
  margin: 2px;

  .form-widget-list {
    min-height: 28px;
  }

  :deep(.el-tabs__content) {
    min-height: 28px;
  }
}

.tab-container.selected {
  outline: 2px solid #ff4400 !important;
}
</style>
