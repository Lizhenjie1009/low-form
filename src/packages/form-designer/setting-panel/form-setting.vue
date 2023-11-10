<template>
  <div>
    <n-form
      :model="formConfig"
      size="small"
      label-position="left"
      label-width="120px"
      class="setting-form"
      @submit.prevent
    >
      <n-collapse v-model="formActiveCollapseNames" class="setting-collapse">
        <n-collapse-item
          name="1"
          :title="i18nt('designer.setting.basicSetting')"
        >
          <n-form-item :label="i18nt('designer.setting.formSize')">
            <n-select v-model="formConfig.size" :options="formSizes">
            </n-select>
          </n-form-item>
          <n-form-item :label="i18nt('designer.setting.labelPosition')">
            <n-radio-group
              v-model="formConfig.labelPosition"
              class="radio-group-custom"
            >
              <n-radio-button label="left">{{
                i18nt('designer.setting.leftPosition')
              }}</n-radio-button>
              <n-radio-button label="top">{{
                i18nt('designer.setting.topPosition')
              }}</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="i18nt('designer.setting.labelAlign')">
            <n-radio-group
              v-model="formConfig.labelAlign"
              class="radio-group-custom"
            >
              <n-radio-button label="label-left-align">{{
                i18nt('designer.setting.leftAlign')
              }}</n-radio-button>
              <n-radio-button label="label-center-align">{{
                i18nt('designer.setting.centerAlign')
              }}</n-radio-button>
              <n-radio-button label="label-right-align">{{
                i18nt('designer.setting.rightAlign')
              }}</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="i18nt('designer.setting.labelWidth')">
            <n-input-number
              v-model="formConfig.labelWidth"
              :min="0"
              style="width: 100%"
            ></n-input-number>
          </n-form-item>
          <n-form-item :label="i18nt('designer.setting.formCss')">
            <n-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormCss"
              >{{ i18nt('designer.setting.addCss') }}</n-button
            >
          </n-form-item>
          <!-- -->
          <n-form-item :label="i18nt('designer.setting.customClass')">
            <n-select
              v-model="formConfig.customClass"
              multiple
              filterable
              allow-create
              default-first-option
              :options="cssClassList"
            >
            </n-select>
          </n-form-item>
          <!-- -->
          <n-form-item :label="i18nt('designer.setting.globalFunctions')">
            <n-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editGlobalFunctions"
              >{{ i18nt('designer.setting.addEventHandler') }}</n-button
            >
          </n-form-item>
          <n-form-item label-width="0">
            <n-divider class="custom-divider">{{
              i18nt('designer.setting.formSFCSetting')
            }}</n-divider>
          </n-form-item>
          <n-form-item :label="i18nt('designer.setting.formModelName')">
            <n-input v-model="formConfig.modelName" type="text"></n-input>
          </n-form-item>
          <n-form-item :label="i18nt('designer.setting.formRefName')">
            <n-input v-model="formConfig.refName" type="text"></n-input>
          </n-form-item>
          <n-form-item :label="i18nt('designer.setting.formRulesName')">
            <n-input v-model="formConfig.rulesName" type="text"></n-input>
          </n-form-item>
        </n-collapse-item>

        <n-collapse-item
          v-if="showEventCollapse()"
          name="2"
          :title="i18nt('designer.setting.eventSetting')"
        >
          <n-form-item label="onFormCreated" label-width="150px">
            <n-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormEventHandler('onFormCreated')"
            >
              {{ i18nt('designer.setting.addEventHandler') }}</n-button
            >
          </n-form-item>
          <n-form-item label="onFormMounted" label-width="150px">
            <n-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormEventHandler('onFormMounted')"
            >
              {{ i18nt('designer.setting.addEventHandler') }}</n-button
            >
          </n-form-item>
          <!-- -->
          <n-form-item label="onFormDataChange" label-width="150px">
            <n-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormEventHandler('onFormDataChange')"
            >
              {{ i18nt('designer.setting.addEventHandler') }}</n-button
            >
          </n-form-item>
          <!-- -->
          <!--
          <el-form-item label="onFormValidate">
            <el-button type="info" icon="el-icon-edit" plain round @click="editFormEventHandler('onFormValidate')">
              {{i18nt('designer.setting.addEventHandler')}}</el-button>
          </el-form-item>
          -->
        </n-collapse-item>
      </n-collapse>
    </n-form>

    <div
      v-if="showFormEventDialogFlag"
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
      class=""
    >
      <el-dialog
        v-model="showFormEventDialogFlag"
        :title="i18nt('designer.setting.editFormEventHandler')"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-alert
          type="info"
          :closable="false"
          :title="'form.' + eventParamsMap[curEventName]"
        ></el-alert>
        <code-editor
          ref="ecEditor"
          v-model="formEventHandlerCode"
          :mode="'javascript'"
          :readonly="false"
        ></code-editor>
        <el-alert type="info" :closable="false" title="}"></el-alert>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showFormEventDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}</el-button
            >
            <el-button type="primary" @click="saveFormEventHandler">
              {{ i18nt('designer.hint.confirm') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showEditFormCssDialogFlag"
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
      class=""
    >
      <el-dialog
        v-model="showEditFormCssDialogFlag"
        :title="i18nt('designer.setting.formCss')"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <code-editor
          v-model="formCssCode"
          :mode="'css'"
          :readonly="false"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showEditFormCssDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}</el-button
            >
            <el-button type="primary" @click="saveFormCss">
              {{ i18nt('designer.hint.confirm') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showEditFunctionsDialogFlag"
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
      class=""
    >
      <el-dialog
        v-model="showEditFunctionsDialogFlag"
        :title="i18nt('designer.setting.globalFunctions')"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <code-editor
          ref="gfEditor"
          v-model="functionsCode"
          :mode="'javascript'"
          :readonly="false"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showEditFunctionsDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}</el-button
            >
            <el-button type="primary" @click="saveGlobalFunctions">
              {{ i18nt('designer.hint.confirm') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import CodeEditor from '@/components/code-editor/index'
import {
  deepClone,
  insertCustomCssToHead,
  insertGlobalFunctionsToHtml
} from '@/utils/util'

export default {
  name: 'FormSetting',
  components: {
    // CodeEditor
  },
  props: {
    designer: Object,
    formConfig: Object
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

      formActiveCollapseNames: ['1', '2'],

      formSizes: [
        { label: 'default', value: '' },
        { label: 'large', value: 'large' },
        //{label: 'medium', value: 'medium'},
        { label: 'small', value: 'small' }
        //{label: 'mini', value: 'mini'},
      ],

      showEditFormCssDialogFlag: false,
      formCssCode: '',
      cssClassList: [],

      showEditFunctionsDialogFlag: false,
      functionsCode: '',

      showFormEventDialogFlag: false,
      formEventHandlerCode: '',
      curEventName: '',

      eventParamsMap: {
        onFormCreated: 'onFormCreated() {',
        onFormMounted: 'onFormMounted() {',
        onFormDataChange:
          'onFormDataChange(fieldName, newValue, oldValue, formModel, subFormName, subFormRowIndex) {'
        //'onFormValidate':     'onFormValidate() {',
      }
    }
  },
  created() {
    //导入表单JSON后需要重新加载自定义CSS样式！！！
    this.designer.handleEvent('form-json-imported', () => {
      this.formCssCode = this.formConfig.cssCode
      insertCustomCssToHead(this.formCssCode)
      this.extractCssClass()
      this.designer.emitEvent('form-css-updated', deepClone(this.cssClassList))
    })
  },
  mounted() {
    /* SettingPanel和FormWidget为兄弟组件, 在FormWidget加载formConfig时，
         此处SettingPanel可能无法获取到formConfig.cssCode, 故加个延时函数！ */
    setTimeout(() => {
      this.formCssCode = this.formConfig.cssCode
      insertCustomCssToHead(this.formCssCode)
      this.extractCssClass()
      this.designer.emitEvent('form-css-updated', deepClone(this.cssClassList))
    }, 1200)
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

    editFormCss() {
      this.formCssCode = this.designer.formConfig.cssCode
      this.showEditFormCssDialogFlag = true
    },

    extractCssClass() {
      let regExp = /\..*{/g
      let result = this.formCssCode.match(regExp)
      let cssNameArray = []

      if (!!result && result.length > 0) {
        result.forEach(rItem => {
          let classArray = rItem.split(',') //切分逗号分割的多个class
          if (classArray.length > 0) {
            classArray.forEach(cItem => {
              let caItem = cItem.trim()
              if (caItem.indexOf('.', 1) !== -1) {
                //查找第二个.位置
                let newClass = caItem.substring(
                  caItem.indexOf('.') + 1,
                  caItem.indexOf('.', 1)
                ) //仅截取第一、二个.号之间的class
                if (!!newClass) {
                  cssNameArray.push(newClass.trim())
                }
              } else if (caItem.indexOf(' ') !== -1) {
                //查找第一个空格位置
                let newClass = caItem.substring(
                  caItem.indexOf('.') + 1,
                  caItem.indexOf(' ')
                ) //仅截取第一、二个.号之间的class
                if (!!newClass) {
                  cssNameArray.push(newClass.trim())
                }
              } else {
                if (caItem.indexOf('{') !== -1) {
                  //查找第一个{位置
                  let newClass = caItem.substring(
                    caItem.indexOf('.') + 1,
                    caItem.indexOf('{')
                  )
                  cssNameArray.push(newClass.trim())
                } else {
                  let newClass = caItem.substring(caItem.indexOf('.') + 1)
                  cssNameArray.push(newClass.trim())
                }
              }
            })
          }
        })
      }

      //this.cssClassList.length = 0
      this.cssClassList.splice(0, this.cssClassList.length) //清除数组必须用splice，length=0不会响应式更新！！
      this.cssClassList = Array.from(new Set(cssNameArray)) //数组去重
    },

    saveFormCss() {
      this.extractCssClass()
      this.designer.formConfig.cssCode = this.formCssCode
      insertCustomCssToHead(this.formCssCode)
      this.showEditFormCssDialogFlag = false

      this.designer.emitEvent('form-css-updated', deepClone(this.cssClassList))
    },

    editGlobalFunctions() {
      this.functionsCode = this.designer.formConfig.functions
      this.showEditFunctionsDialogFlag = true
    },

    saveGlobalFunctions() {
      const codeHints = this.$refs.gfEditor.getEditorAnnotations()
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

      this.designer.formConfig.functions = this.functionsCode
      insertGlobalFunctionsToHtml(this.functionsCode)
      this.showEditFunctionsDialogFlag = false
    },

    editFormEventHandler(eventName) {
      this.curEventName = eventName
      this.formEventHandlerCode = this.formConfig[eventName]
      this.showFormEventDialogFlag = true
    },

    saveFormEventHandler() {
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

      this.formConfig[this.curEventName] = this.formEventHandlerCode
      this.showFormEventDialogFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
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

  .radio-group-custom {
    :deep(.el-radio-button__inner) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }

  .custom-divider.el-divider--horizontal {
    margin: 10px 0;
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

.small-padding-dialog {
  :deep(.el-dialog__body) {
    padding: 6px 15px 12px 15px;
  }
}
</style>
