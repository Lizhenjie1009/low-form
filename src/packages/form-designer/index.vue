<template>
  <div class="flex">
    <widget-panel class="w-260px" :designer="designer" />
    <v-form-widget
      ref="formRef"
      class="w-1000px"
      :designer="designer"
      :form-config="designer.formConfig"
    >
    </v-form-widget>

    <!-- <setting-panel
      :designer="designer"
      :selected-widget="designer.selectedWidget"
      :form-config="designer.formConfig"
      :global-dsv="globalDsv"
      @edit-event-handler="testEEH"
    /> -->
  </div>
</template>

<script lang="ts" setup>
import VFormWidget from './form-widget-panel/index.vue'
import WidgetPanel from './widget-panel/index.vue'
import SettingPanel from './setting-panel/index.vue'

import { useDesignerStore } from '@/store'
const designer = useDesignerStore()
</script>

<style lang="less" scoped>
.el-container.main-container {
  background: #fff;

  :deep(aside) {
    /* 防止aside样式被外部样式覆盖！！ */
    margin: 0;
    padding: 0;
    background: inherit;
  }
}

.el-container.full-height {
  height: 100%;
  overflow-y: hidden;
}

.el-container.center-layout-container {
  min-width: 680px;
  border-left: 2px dotted #ebeef5;
  border-right: 2px dotted #ebeef5;
}

.el-header.main-header {
  border-bottom: 2px dotted #ebeef5;
  height: 48px !important;
  line-height: 48px !important;
  min-width: 800px;
}

div.main-title {
  font-size: 18px;
  color: #242424;
  display: flex;
  align-items: center;
  justify-items: center;

  img {
    cursor: pointer;
    width: 36px;
    height: 36px;
  }

  span.bold {
    font-size: 20px;
    font-weight: bold;
    margin: 0 6px 0 6px;
  }

  span.version-span {
    font-size: 14px;
    color: #101f1c;
    margin-left: 6px;
  }
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

.el-dropdown-link {
  margin-right: 12px;
  cursor: pointer;
}

div.external-link {
  display: flex;
  align-items: center;

  a {
    font-size: 13px;
    text-decoration: none;
    margin-right: 10px;
    color: #606266;
  }
}

.el-header.toolbar-header {
  font-size: 14px;
  border-bottom: 1px dotted #cccccc;
  height: 42px !important;
  //line-height: 42px !important;
}

.el-aside.side-panel {
  width: 260px !important;
  overflow-y: hidden;
}

.el-main.form-widget-main {
  padding: 0;

  position: relative;
  overflow-x: hidden;
}

.container-scroll-bar {
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
}
</style>
