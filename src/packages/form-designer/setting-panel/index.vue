<template>
  <div class="panel-container">
    <n-tabs v-model="activeTab" style="height: 100%; overflow: hidden">
      <n-tab-pane :label="i18nt('designer.hint.widgetSetting')" name="1">
        <n-scrollbar
          class="setting-scrollbar"
          :style="{ height: scrollerHeight }"
        >
          <template
            v-if="
              !!designer.selectedWidget && !designer.selectedWidget.category
            "
          >
            <n-form
              :model="optionModel"
              size="small"
              label-position="left"
              label-width="120px"
              class="setting-form"
              @submit.prevent
            >
              <n-collapse
                v-model="widgetActiveCollapseNames"
                class="setting-collapse"
              >
                <n-collapse-item
                  v-if="showCollapse(commonProps)"
                  name="1"
                  :title="i18nt('designer.setting.commonSetting')"
                >
                  <template v-for="(editorName, propName) in commonProps">
                    <component
                      :is="getPropEditor(propName, editorName)"
                      v-if="hasPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                    >
                    </component>
                  </template>
                </n-collapse-item>

                <!-- <n-collapse-item
                  v-if="showCollapse(advProps)"
                  name="2"
                  :title="i18nt('designer.setting.advancedSetting')"
                >
                  <template v-for="(editorName, propName) in advProps">
                    <component
                      :is="getPropEditor(propName, editorName)"
                      v-if="hasPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                    >
                    </component>
                  </template>
                </n-collapse-item>

                <n-collapse-item
                  v-if="showEventCollapse() && showCollapse(eventProps)"
                  name="3"
                  :title="i18nt('designer.setting.eventSetting')"
                >
                  <template v-for="(editorName, propName) in eventProps">
                    <component
                      :is="getPropEditor(propName, editorName)"
                      v-if="hasPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                    >
                    </component>
                  </template>
                </n-collapse-item> -->
              </n-collapse>
            </n-form>
          </template>

          <template
            v-if="
              !!designer.selectedWidget && !!designer.selectedWidget.category
            "
          >
            <el-form
              :model="optionModel"
              size="small"
              label-position="left"
              label-width="120px"
              class="setting-form"
              @submit.prevent
            >
              <el-collapse
                v-model="widgetActiveCollapseNames"
                class="setting-collapse"
              >
                <el-collapse-item
                  v-if="showCollapse(commonProps)"
                  name="1"
                  :title="i18nt('designer.setting.commonSetting')"
                >
                  <template v-for="(editorName, propName) in commonProps">
                    <component
                      :is="getPropEditor(propName, editorName)"
                      v-if="hasPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                    >
                    </component>
                  </template>
                </el-collapse-item>

                <!-- <el-collapse-item
                  v-if="showCollapse(advProps)"
                  name="2"
                  :title="i18nt('designer.setting.advancedSetting')"
                >
                  <template v-for="(editorName, propName) in advProps">
                    <component
                      :is="getPropEditor(propName, editorName)"
                      v-if="hasPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                    >
                    </component>
                  </template>
                </el-collapse-item>

                <el-collapse-item
                  v-if="showEventCollapse() && showCollapse(eventProps)"
                  name="3"
                  :title="i18nt('designer.setting.eventSetting')"
                >
                  <template v-for="(editorName, propName) in eventProps">
                    <component
                      :is="getPropEditor(propName, editorName)"
                      v-if="hasPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                    >
                    </component>
                  </template>
                </el-collapse-item> -->
              </el-collapse>
            </el-form>
          </template>
        </n-scrollbar>
      </n-tab-pane>

      <!-- <n-tab-pane
        v-if="!!designer"
        :label="i18nt('designer.hint.formSetting')"
        name="2"
      >
        <n-scrollbar
          class="setting-scrollbar"
          :style="{ height: scrollerHeight }"
        >
          <form-setting
            :designer="designer"
            :form-config="formConfig"
          ></form-setting>
        </n-scrollbar>
      </n-tab-pane> -->
    </n-tabs>

    <div
      v-if="showWidgetEventDialogFlag"
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
      class=""
    >
      <el-dialog
        v-model="showWidgetEventDialogFlag"
        :title="i18nt('designer.setting.editWidgetEventHandler')"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-alert type="info" :closable="false" :title="eventHeader">
        </el-alert>
        code-editor
        <!-- <code-editor
          ref="ecEditor"
          v-model="eventHandlerCode"
          :mode="'javascript'"
          :readonly="false"
        >
        </code-editor> -->
        <el-alert type="info" :closable="false" title="}"></el-alert>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showWidgetEventDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}
            </el-button>
            <el-button type="primary" @click="saveEventHandler">
              {{ i18nt('designer.hint.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import CodeEditor from '@/components/code-editor/index'
import { editorListModules } from '@/packages/form-designer/components'
import FormSetting from './form-setting.vue'
import WidgetProperties from './propertyRegister'
import { addWindowResizeHandler } from '@/utils/util'
import { propertyRegistered } from '@/packages/form-designer/setting-panel/propertyRegister'

const { COMMON_PROPERTIES, ADVANCED_PROPERTIES, EVENT_PROPERTIES } =
  WidgetProperties

export default {
  name: 'SettingPanel',
  componentName: 'SettingPanel',
  components: {
    FormSetting,
    ...editorListModules
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    formConfig: Object,
    globalDsv: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
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

      scrollerHeight: 0,

      activeTab: '2',
      widgetActiveCollapseNames: ['1', '3'], //['1', '2', '3'],
      formActiveCollapseNames: ['1', '2'],

      commonProps: COMMON_PROPERTIES,
      advProps: ADVANCED_PROPERTIES,
      eventProps: EVENT_PROPERTIES,

      showWidgetEventDialogFlag: false,
      eventHandlerCode: '',
      curEventName: '',
      eventHeader: '',

      subFormChildWidgetFlag: false
    }
  },
  computed: {
    optionModel: {
      get() {
        return this.selectedWidget.options
      },

      set(newValue) {
        console.log(newValue, 'newValue')
        this.selectedWidget.options = newValue
      }
    }
  },
  watch: {
    'designer.selectedWidget': {
      handler(val) {
        if (!!val) {
          this.activeTab = '1'
        }
      }
    },

    'selectedWidget.options': {
      //组件属性变动后，立即保存表单JSON！！
      deep: true,
      handler() {
        this.designer.saveCurrentHistoryStep()
      }
    },

    formConfig: {
      deep: true,
      handler() {
        this.designer.saveCurrentHistoryStep()
      }
    }
  },
  created() {
    // this.on$('editEventHandler', eventParams => {
    //   //debugger
    //   this.editEventHandler(eventParams[0], eventParams[1])
    // })

    this.designer.handleEvent('form-css-updated', cssClassList => {
      this.designer.setCssClassList(cssClassList)
    })
  },
  mounted() {
    if (!this.designer.selectedWidget) {
      this.activeTab = '2'
    } else {
      this.activeTab = '1'
    }

    this.scrollerHeight = window.innerHeight - 56 - 48 + 'px'
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        this.scrollerHeight = window.innerHeight - 56 - 48 + 'px'
        //console.log(this.scrollerHeight)
      })
    })
  },
  methods: {
    i18nt(str) {
      return str
    },
    showEventCollapse() {
      if (this.designerConfig['eventCollapse'] === undefined) {
        return true
      }

      return !!this.designerConfig['eventCollapse']
    },

    hasPropEditor(propName, editorName) {
      if (!editorName) {
        return false
      }

      /* alert组件注册了两个type属性编辑器，跳过第一个type属性编辑器，只显示第二个alert-type属性编辑器！！ */
      if (propName.indexOf('-') <= -1) {
        let uniquePropName = this.selectedWidget.type + '-' + propName
        if (propertyRegistered(uniquePropName)) {
          return false
        }
      }

      let originalPropName = propName.replace(
        this.selectedWidget.type + '-',
        ''
      ) //去掉组件名称前缀-，如果有的话！！

      return this.designer.hasConfig(this.selectedWidget, originalPropName)
    },

    getPropEditor(propName, editorName) {
      let originalPropName = propName.replace(
        this.selectedWidget.type + '-',
        ''
      ) //去掉组件名称前缀-，如果有的话！！
      let ownPropEditorName =
        `${this.selectedWidget.type}-${originalPropName}-editor`
          .replace(/-(\w)/g, ($1, s1) => s1.toUpperCase())
          .replace(/\w/, $1 => $1.toUpperCase())

      if (!!this.$options.components[ownPropEditorName]) {
        //局部注册的属性编辑器组件
        return ownPropEditorName
      }

      // console.log(
      //   propName,
      //   editorName,
      //   ownPropEditorName,
      //   this.$options,
      //   this.$options.components[ownPropEditorName],
      //   this.$root.$.appContext.components
      // )

      //return !!this.$root.$options.components[ownPropEditorName] ? ownPropEditorName : editorName  //Vue2全局注册的属性编辑器组件
      return !!this.$root.$.appContext.components[ownPropEditorName]
        ? ownPropEditorName
        : editorName //Vue3全局注册的属性编辑器组件
    },

    showCollapse(propsObj) {
      let result = false
      for (let propName in propsObj) {
        if (!propsObj.hasOwnProperty(propName)) {
          continue
        }

        if (this.hasPropEditor(propName, propsObj[propName])) {
          result = true
          break
        }
      }

      return result
    },

    editEventHandler(eventName, eventParams) {
      //debugger

      this.curEventName = eventName
      this.eventHeader = `${
        this.optionModel.name
      }.${eventName}(${eventParams.join(', ')}) {`
      this.eventHandlerCode = this.selectedWidget.options[eventName] || ''

      // 设置字段校验函数示例代码
      if (eventName === 'onValidate' && !this.optionModel['onValidate']) {
        this.eventHandlerCode =
          "  /* sample code */\n  /*\n  if ((value > 100) || (value < 0)) {\n    callback(new Error('error message'))  //fail\n  } else {\n    callback();  //pass\n  }\n  */"
      }

      this.showWidgetEventDialogFlag = true
    },

    saveEventHandler() {
      const codeHints = this.$refs.ecEditor.getEditorAnnotations()
      let syntaxErrorFlag = false
      if (!!codeHints && codeHints.length > 0) {
        codeHints.forEach(chItem => {
          if (chItem.type === 'error') {
            syntaxErrorFlag = true
          }
        })

        if (syntaxErrorFlag) {
          this.$message.error(this.i18nt('designer.setting.syntaxCheckWarning'))
          return
        }
      }

      this.selectedWidget.options[this.curEventName] = this.eventHandlerCode
      this.showWidgetEventDialogFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
.panel-container {
  padding: 0 8px;
}

.setting-scrollbar {
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden; /* IE浏览器隐藏水平滚动条箭头！！ */
  }
}

.setting-collapse {
  :deep(.el-collapse-item__content) {
    padding-bottom: 6px;
  }

  :deep(.el-collapse-item__header) {
    font-style: italic;
    font-weight: bold;
  }
}

.setting-form {
  :deep(.el-form-item__label) {
    font-size: 13px;
    //text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 10px;
  }
}

/* 隐藏Chrome浏览器中el-input数字输入框右侧的上下调整小箭头 */
:deep(.hide-spin-button) input::-webkit-outer-spin-button,
:deep(.hide-spin-button) input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

/* 隐藏Firefox浏览器中el-input数字输入框右侧的上下调整小箭头 */
:deep(.hide-spin-button) input[type='number'] {
  -moz-appearance: textfield;
}

:deep(.custom-divider.el-divider--horizontal) {
  margin: 10px 0;
}

:deep(.custom-divider-margin-top.el-divider--horizontal) {
  margin: 20px 0;
}

.small-padding-dialog {
  :deep(.el-dialog__body) {
    padding: 6px 15px 12px 15px;
  }
}
</style>
