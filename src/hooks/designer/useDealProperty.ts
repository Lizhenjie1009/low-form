export default function useDealProperty(options) {
  const hasConfig = configName => {
    if (!options.designer || !options.designer.selectedWidget) {
      return false
    }

    return options.designer.hasConfig(options.selectedWidget, configName)
  }

  const emitDefaultValueChange = () => {
    if (!!options.designer) {
      if (!!options.designer.formWidget) {
        const fieldWidget = options.designer.formWidget.getWidgetRef(
          options.designer.selectedWidget.options.name
        )
        if (!!fieldWidget && !!fieldWidget.refreshDefaultValue) {
          fieldWidget.refreshDefaultValue()
        }
      }
    }
  }

  const inputNumberHandler = value => {
    value = value.replace(/[^0-9]/gi, '')
  }

  const onRemoteChange = val => {
    if (!!val) {
      options.optionModel.filterable = true
      options.optionModel.allowCreate = false
    }
  }

  const onMultipleSelected = val => {
    if (val) {
      options.optionModel.defaultValue = [] //清空原默认值!!
    } else {
      if (
        !!options.optionModel.defaultValue &&
        options.optionModel.defaultValue.length > 0
      ) {
        options.optionModel.defaultValue = options.optionModel.defaultValue[0]
      } else {
        options.optionModel.defaultValue = ''
      }
    }
  }

  return {
    hasConfig,
    emitDefaultValueChange,
    inputNumberHandler,
    onRemoteChange,
    onMultipleSelected
  }
}
