import { deepClone } from '@/utils/util'
import FormValidators from '@/utils/validators'
import { useConfigStore } from '@/store'
import useEmitter from './useEmitter'
export default function useFiledsConfig(options: any, data: any) {
  const { on$, emit$, dispatch } = useEmitter()
  const config = useConfigStore()
  console.log(config.globalModel, options)

  const formConfig = computed(() => {
    return options.designer.formConfig
  })
  const widgetSize = computed(() => {
    return options.field.options.size || 'default'
  })
  const subFormName = computed(() => {
    return !!options.parentWidget ? options.parentWidget.options.name : ''
  })
  const subFormItemFlag = computed(() => {
    return !!options.parentWidget
      ? options.parentWidget.type === 'sub-form'
      : false
  })
  const inputType = computed(() => {
    if (options.field.options.type === 'number') {
      return 'text' //当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！
    }

    return options.field.options.type
  })

  const formModel = config.globalModel.formModel

  //--------------------- 组件内部方法 begin ------------------//
  const getPropName = () => {
    if (subFormItemFlag.value && !options.designState) {
      return (
        subFormName.value +
        '.' +
        options.subFormRowIndex +
        '.' +
        options.field.options.name +
        ''
      )
    } else {
      return options.field.options.name
    }
  }

  const handleOnChangeForSubForm = (val, oldVal, subFormData, rowId) => {
    //子表单自定义onChange事件
    if (!!options.field.options.onChange) {
      const changeFn = new Function(
        'value',
        'oldValue',
        'subFormData',
        'rowId',
        options.field.options.onChange
      )
      changeFn.call(this, val, oldVal, subFormData, rowId)
    }
  }

  const initFileList = () => {
    //初始化上传组件的已上传文件列表
    if (
      (options.field.type !== 'picture-upload' &&
        options.field.type !== 'file-upload') ||
      options.designState === true
    ) {
      return
    }

    if (!!data.fieldModel.value) {
      if (Array.isArray(data.fieldModel.value)) {
        this.fileList = deepClone(data.fieldModel.value)
      } else {
        this.fileList.splice(0, 0, deepClone(data.fieldModel.value))
      }
    }
  }

  const initFieldModel = () => {
    if (!options.field.formItemFlag) {
      return
    }

    if (!!subFormItemFlag.value && !options.designState) {
      //SubForm子表单组件需要特殊处理！！
      const subFormData = formModel[subFormName.value]
      if (
        (subFormData === undefined ||
          subFormData[options.subFormRowIndex] === undefined ||
          subFormData[options.subFormRowIndex][options.field.options.name] ===
            undefined) &&
        options.field.options.defaultValue !== undefined
      ) {
        data.fieldModel.value = options.field.options.defaultValue
        subFormData[options.subFormRowIndex][options.field.options.name] =
          options.field.options.defaultValue
      } else if (
        subFormData[options.subFormRowIndex][options.field.options.name] ===
        undefined
      ) {
        data.fieldModel.value = null
        subFormData[options.subFormRowIndex][options.field.options.name] = null
      } else {
        data.fieldModel.value =
          subFormData[options.subFormRowIndex][options.field.options.name]
      }

      /* 主动触发子表单内field-widget的onChange事件！！ */
      setTimeout(() => {
        //延时触发onChange事件, 便于更新计算字段！！
        handleOnChangeForSubForm(
          data.fieldModel.value,
          data.oldFieldValue.value,
          subFormData,
          options.subFormRowId
        )
      }, 800)
      data.oldFieldValue.value = deepClone(data.fieldModel.value)

      initFileList() //处理图片上传、文件上传字段

      return
    }

    if (
      formModel[options.field.options.name] === undefined &&
      options.field.options.defaultValue !== undefined
    ) {
      data.fieldModel.value = options.field.options.defaultValue
    } else if (formModel[options.field.options.name] === undefined) {
      //如果formModel为空对象，则初始化字段值为null!!
      formModel[options.field.options.name] = null
    } else {
      data.fieldModel.value = formModel[options.field.options.name]
    }
    data.oldFieldValue.value = deepClone(data.fieldModel.value)
    initFileList() //处理图片上传、文件上传字段
  }

  const registerToRefList = oldRefName => {
    if (config.refList !== null && !!options.field.options.name) {
      if (subFormItemFlag.value && !options.designState) {
        //处理子表单元素（且非设计状态）
        if (!!oldRefName) {
          delete config.refList[oldRefName + '@row' + options.subFormRowId]
        }
        config.refList[
          options.field.options.name + '@row' + options.subFormRowId
        ] = this
      } else {
        if (!!oldRefName) {
          delete config.refList[oldRefName]
        }
        config.refList[options.field.options.name] = this
      }
    }
  }

  const syncUpdateFormModel = value => {
    if (!!options.designState) {
      return
    }

    if (!!subFormItemFlag.value) {
      const subFormData = formModel[subFormName.value] || [{}]
      const subFormDataRow = subFormData[options.subFormRowIndex]
      if (!!subFormDataRow) {
        // 重置表单后subFormDataRow为undefined，应跳过！！
        subFormDataRow[options.field.options.name] = value
      }
    } else {
      formModel[options.field.options.name] = value
    }
  }

  const emitFieldDataChange = ($parent, newValue, oldValue) => {
    emit$('field-value-changed', [newValue, oldValue])

    /* 必须用dispatch向指定父组件派发消息！！ */
    dispatch($parent, 'VFormRender', 'fieldChange', [
      options.field.options.name,
      newValue,
      oldValue,
      subFormName.value,
      options.subFormRowIndex
    ])
  }

  /*
  注意：VFormRender的setFormData方法不会触发子表单内field-widget的setValue方法，
  因为setFormData方法调用后，子表单内所有field-widget组件已被清空，接收不到setFormData事件！！
* */
  const setValue = ($parent, newValue) => {
    /* if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
    this.fileList = newValue
  } else */ if (!!options.field.formItemFlag) {
      const oldValue = deepClone(data.fieldModel.value)
      data.fieldModel.value = newValue
      initFileList()

      syncUpdateFormModel(newValue)
      emitFieldDataChange($parent, newValue, oldValue)
    }
  }

  const handleOnChange = (val, oldVal) => {
    //自定义onChange事件
    if (!!options.field.options.onChange) {
      const changeFn = new Function(
        'value',
        'oldValue',
        options.field.options.onChange
      )
      changeFn.call(this, val, oldVal)
    }
  }

  /**
   * 加载选项，并清空字段值
   * @param options
   */
  const loadOptions = options => {
    options.field.options.optionItems = deepClone(options)
    //this.clearSelectedOptions()  //清空已选选项
  }

  /**
   * 重新加载选项，不清空字段值
   * @param options
   */
  const reloadOptions = options => {
    options.field.options.optionItems = deepClone(options)
  }

  const initOptionItems = keepSelected => {
    if (options.designState) {
      return
    }

    if (
      options.field.type === 'radio' ||
      options.field.type === 'checkbox' ||
      options.field.type === 'select' ||
      options.field.type === 'cascader'
    ) {
      /* 异步更新option-data之后globalOptionData不能获取到最新值，改用provide的getOptionData()方法 */
      const newOptionItems = config.getGlobalOptionData
      if (
        !!newOptionItems &&
        newOptionItems.hasOwnProperty(options.field.options.name)
      ) {
        if (!!keepSelected) {
          reloadOptions(newOptionItems[options.field.options.name])
        } else {
          loadOptions(newOptionItems[options.field.options.name])
        }
      }
    }
  }

  const initEventHandler = $parent => {
    on$('setFormData', newFormData => {
      console.log(
        'formModel of globalModel----------',
        config.globalModel.formModel
      )
      if (!subFormItemFlag.value) {
        setValue($parent, newFormData[options.field.options.name])
      }
    })

    on$('field-value-changed', values => {
      if (!!subFormItemFlag.value) {
        const subFormData = formModel[subFormName.value]
        handleOnChangeForSubForm(
          values[0],
          values[1],
          subFormData,
          options.subFormRowId
        )
      } else {
        handleOnChange(values[0], values[1])
      }
    })

    on$('reloadOptionItems', widgetNames => {
      if (
        widgetNames.length === 0 ||
        widgetNames.indexOf(options.field.options.name) > -1
      ) {
        initOptionItems(true)
      }
    })
  }

  const buildFieldRules = () => {
    if (!options.field.formItemFlag && options.field.options.hidden) {
      return
    }

    data.rules || data.rules.splice(0, data.rules.length) //清空已有
    if (!!options.field.options.required) {
      data.rules.push({
        required: true,
        //trigger: ['blur', 'change'],
        trigger: [
          'blur'
        ] /* 去掉change事件触发校验，change事件触发时formModel数据尚未更新，导致radio/checkbox必填校验出错！！ */,
        message:
          options.field.options.requiredHint ||
          this.i18nt('render.hint.fieldRequired')
      })
    }

    if (!!options.field.options.validation) {
      const vldName = options.field.options.validation
      if (!!FormValidators[vldName]) {
        data.rules.push({
          validator: FormValidators[vldName],
          trigger: ['blur', 'change'],
          label: options.field.options.label,
          errorMsg: options.field.options.validationHint
        })
      } else {
        data.rules.push({
          validator: FormValidators['regExp'],
          trigger: ['blur', 'change'],
          regExp: vldName,
          label: options.field.options.label,
          errorMsg: options.field.options.validationHint
        })
      }
    }

    if (!!options.field.options.onValidate) {
      const customFn = (rule, value, callback) => {
        const tmpFunc = new Function(
          'rule',
          'value',
          'callback',
          options.field.options.onValidate
        )
        return tmpFunc.call(this, rule, value, callback)
      }
      data.rules.push({
        validator: customFn,
        trigger: ['blur', 'change'],
        label: options.field.options.label
      })
    }
  }

  const handleOnCreated = () => {
    if (!!options.field.options.onCreated) {
      const customFunc = new Function(options.field.options.onCreated)
      customFunc.call(this)
    }
  }

  const handleOnMounted = () => {
    if (!!options.field.options.onMounted) {
      const mountFunc = new Function(options.field.options.onMounted)
      mountFunc.call(this)
    }
  }

  const unregisterFromRefList = () => {
    //销毁组件时注销组件ref
    if (config.refList !== null && !!options.field.options.name) {
      const oldRefName = options.field.options.name
      if (subFormItemFlag.value && !options.designState) {
        //处理子表单元素（且非设计状态）
        delete config.refList[oldRefName + '@row' + options.subFormRowId]
      } else {
        delete config.refList[oldRefName]
      }
    }
  }

  const handleChangeEvent = (value, $parent) => {
    syncUpdateFormModel(value)
    emitFieldDataChange($parent, value, data.oldFieldValue.value)

    //number组件一般不会触发focus事件，故此处需要手工赋值oldFieldValue！！
    data.oldFieldValue.value =
      deepClone(value) /* oldFieldValue需要在initFieldModel()方法中赋初值!! */

    /* 主动触发表单的单个字段校验，用于清除字段可能存在的校验错误提示 */
    dispatch($parent, 'VFormRender', 'fieldValidation', [getPropName()])
  }

  const handleFocusCustomEvent = event => {
    data.oldFieldValue.value = deepClone(data.fieldModel.value) //保存修改change之前的值

    if (!!options.field.options.onFocus) {
      const customFn = new Function('event', options.field.options.onFocus)
      customFn.call(this, event)
    }
  }

  const handleBlurCustomEvent = event => {
    if (!!options.field.options.onBlur) {
      const customFn = new Function('event', options.field.options.onBlur)
      customFn.call(this, event)
    }
  }

  const handleInputCustomEvent = (value, $parent) => {
    syncUpdateFormModel(value)

    /* 主动触发表单的单个字段校验，用于清除字段可能存在的校验错误提示 */
    dispatch($parent, 'VFormRender', 'fieldValidation', [getPropName()])

    if (!!options.field.options.onInput) {
      const customFn = new Function('value', options.field.options.onInput)
      customFn.call(this, value)
    }
  }

  return {
    formConfig,
    widgetSize,
    subFormName,
    subFormItemFlag,
    inputType,
    formModel,
    getPropName,
    initFieldModel,
    registerToRefList,
    initEventHandler,
    buildFieldRules,
    handleOnCreated,
    handleOnMounted,
    unregisterFromRefList,
    handleChangeEvent,
    handleFocusCustomEvent,
    handleBlurCustomEvent,
    handleInputCustomEvent
  }
}
