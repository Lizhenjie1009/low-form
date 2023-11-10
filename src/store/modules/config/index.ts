import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
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
    },
    widgetRefList: {},
    globalDsv: {},
    optionData: {},
    globalModel: {
      formModel: {}
    }
  }),
  getters: {
    refList(state) {
      return state.widgetRefList
    },
    getGlobalDsv(state) {
      return state.globalDsv
    },
    getGlobalOptionData(state) {
      return state.optionData
    },
    getWidgetRef(widgetName, showError = false) {
      const foundRef = this.widgetRefList[widgetName]
      if (!foundRef && !!showError) {
        // this.$message.error(
        //   this.i18nt('designer.hint.refNotFound') + widgetName
        // )
      }
      return foundRef
    }
  },
  actions: {
    clearWidgetRefList() {
      Object.keys(this.widgetRefList).forEach(key => {
        delete this.widgetRefList[key]
      })
    },
    deleteWidgetRef(widgetRefName) {
      delete this.widgetRefList[widgetRefName]
    }
  }
})
