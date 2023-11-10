<template>
  <div class="form-widget-container">
    <n-form
      class="wh-full widget-form"
      :label-placement="labelPosition"
      :class="[customClass, layoutType + '-layout']"
      :size="size"
    >
      <template v-if="designer.widgetList.length === 0">
        <div class="no-widget-hint">
          请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处.
        </div>
      </template>

      <div class="form-widget-list wh-full">
        <draggable
          :list="designer.widgetList"
          item-key="id"
          v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 300 }"
          handle=".drag-handler"
          class="h-full"
          :move="checkMove"
          @end="onDragEnd"
          @add="onDragAdd"
          @update="onDragUpdate"
        >
          <template #item="{ element: widget, index }">
            <div class="transition-group-el">
              <template v-if="'container' === widget.category">
                <component
                  :is="getWidgetName(widget)"
                  :key="widget.id"
                  :widget="widget"
                  :designer="designer"
                  :parent-list="designer.widgetList"
                  :index-of-parent-list="index"
                  :parent-widget="null"
                ></component>
              </template>
              <template v-else>
                <component
                  :is="getWidgetName(widget)"
                  :key="widget.id"
                  :field="widget"
                  :designer="designer"
                  :parent-list="designer.widgetList"
                  :index-of-parent-list="index"
                  :parent-widget="null"
                  :design-state="true"
                ></component>
              </template>
            </div>
          </template>
        </draggable>
      </div>
    </n-form>
  </div>
</template>
<script>
import { filedListModules } from '@/packages/form-designer/components'
// const app = createApp({})

// // app.component({ ...filedListModules })
// Object.keys(filedListModules).forEach(key =>
//   console.log(app.component(key), key)
// )
// console.log(getCurrentInstance(), '/////////', app, filedListModules)
export default {
  name: 'VFormWidget',
  componentName: 'VFormWidget',
  components: {
    ...filedListModules
  },
  provide() {
    return {
      refList: this.widgetRefList,
      getFormConfig: () =>
        this.formConfig /* 解决provide传递formConfig属性的响应式更新问题！！ */,
      getGlobalDsv: () => this.globalDsv, // 全局数据源变量
      globalOptionData: this.optionData,
      getOptionData: () => this.optionData,
      globalModel: {
        formModel: this.formModel
      }
    }
  },
  props: {
    designer: Object,
    formConfig: Object,
    optionData: {
      //prop传入的选项数据
      type: Object,
      default: () => ({})
    },
    globalDsv: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formModel: {},
      widgetRefList: {},
      designerConfig: {
        languageMenu: true, //是否显示语言切换菜单
        externalLink: true, //是否显示GitHub、文档等外部链接
        formTemplates: true, //是否显示表单模板
        eventCollapse: true, //是否显示组件事件属性折叠面板
        widgetNameReadonly: false, //禁止修改组件名称

        clearDesignerButton: true, //是否显示清空设计器按钮
        previewFormButton: true, //是否显示预览表单按钮
        importJsonButton: true, //是否显示导入JSON按钮
        exportJsonButton: true, //是否显示导出JSON器按钮
        exportCodeButton: true, //是否显示导出代码按钮
        generateSFCButton: true, //是否显示生成SFC按钮

        toolbarMaxWidth: 450, //设计器工具按钮栏最大宽度（单位像素）
        toolbarMinWidth: 300, //设计器工具按钮栏最小宽度（单位像素）

        presetCssCode: '', //设计器预设CSS样式代码

        resetFormJson: false //是否在设计器初始化时将表单内容重置为空
      }
    }
  },
  computed: {
    labelPosition() {
      if (
        !!this.designer.formConfig &&
        !!this.designer.formConfig.labelPosition
      ) {
        return this.designer.formConfig.labelPosition
      }

      return 'left'
    },

    size() {
      if (!!this.designer.formConfig && !!this.designer.formConfig.size) {
        return this.designer.formConfig.size
      }
      return 'medium'
    },

    customClass() {
      return this.designer.formConfig.customClass || ''
    },

    layoutType() {
      return this.designer.getLayoutType()
    }
  },
  watch: {
    'designer.widgetList': {
      deep: true,
      handler(val) {
        //
      }
    },

    'designer.formConfig': {
      deep: true,
      handler(val) {
        //
      }
    }
  },
  created() {
    console.log(this.designer.widgetList, 111, this)

    this.designer.initDesigner(!!this.designerConfig.resetFormJson)
    this.designer.loadPresetCssCode(this.designerConfig.presetCssCode)
  },
  mounted() {
    this.disableFirefoxDefaultDrop() /* 禁用Firefox默认拖拽搜索功能!! */
    this.designer.registerFormWidget(this)
  },
  methods: {
    getWidgetName(widget) {
      return widget.type + '-widget'
    },

    disableFirefoxDefaultDrop() {
      let isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') !== -1
      if (isFirefox) {
        document.body.ondrop = function (event) {
          event.stopPropagation()
          event.preventDefault()
        }
      }
    },

    onDragEnd(evt) {
      //console.log('drag end000', evt)
    },

    onDragAdd(evt) {
      const newIndex = evt.newIndex
      if (!!this.designer.widgetList[newIndex]) {
        this.designer.setSelected(this.designer.widgetList[newIndex])
      }

      this.designer.emitHistoryChange()
    },

    onDragUpdate() {
      /* 在VueDraggable内拖拽组件发生位置变化时会触发update，未发生组件位置变化不会触发！！ */
      this.designer.emitHistoryChange()
    },

    checkMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },

    getFormData() {
      return this.formModel
    },

    getWidgetRef(widgetName, showError = false) {
      let foundRef = this.widgetRefList[widgetName]
      if (!foundRef && !!showError) {
        this.$message.error(
          this.i18nt('designer.hint.refNotFound') + widgetName
        )
      }
      return foundRef
    },

    getSelectedWidgetRef() {
      let wName = this.designer.selectedWidgetName
      return this.getWidgetRef(wName)
    },

    clearWidgetRefList() {
      Object.keys(this.widgetRefList).forEach(key => {
        delete this.widgetRefList[key]
      })
    },

    deleteWidgetRef(widgetRefName) {
      delete this.widgetRefList[widgetRefName]
    }
  }
}
</script>

<style lang="less" scoped>
.container-scroll-bar {
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
}

.form-widget-container {
  padding: 10px;
  background: #fff;

  overflow-x: hidden;
  overflow-y: auto;

  .el-form.full-height-width {
    height: 100%;
    padding: 3px;
    background: #ffffff;

    .no-widget-hint {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 18px;
      color: #999999;
    }

    .form-widget-list {
      min-height: calc(100vh - 56px - 68px);
      padding: 3px;
    }
  }

  .el-form.PC-layout {
    //
  }

  .el-form.Pad-layout {
    margin: 0 auto;
    max-width: 960px;
    border-radius: 15px;
    box-shadow: 0 0 1px 10px #495060;
  }

  .el-form.H5-layout {
    margin: 0 auto;
    width: 420px;
    border-radius: 15px;
    //border-width: 10px;
    box-shadow: 0 0 1px 10px #495060;
  }

  .el-form.widget-form :deep(.el-row) {
    padding: 2px;
    border: 1px dashed rgba(170, 170, 170, 0.75);
  }
}

.grid-cell {
  min-height: 30px;
  border-right: 1px dotted #cccccc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
