import { useDesignerStore } from '@/store'

export default function useContainerWrapper(options) {
  const designer = useDesignerStore()

  const appendTableRow = widget => {
    designer.appendTableRow(widget)
  }
  const appendTableCol = widget => {
    designer.appendTableCol(widget)
  }
  const onContainerDragAdd = (evt, subList) => {
    const newIndex = evt.newIndex
    if (!!subList[newIndex]) {
      designer.setSelected(subList[newIndex])
    }

    designer.emitHistoryChange()
  }
  const onContainerDragUpdate = () => {
    designer.emitHistoryChange()
  }
  const checkContainerMove = evt => {
    return designer.checkWidgetMove(evt)
  }
  const selectWidget = widget => {
    designer.setSelected(widget)
  }
  const selectParentWidget = () => {
    if (options.parentWidget) {
      designer.setSelected(options.parentWidget)
    } else {
      designer.clearSelected()
    }
  }
  const moveUpWidget = () => {
    designer.moveUpWidget(options.parentList, options.indexOfParentList)
    designer.emitHistoryChange()
  }
  const moveDownWidget = () => {
    designer.moveDownWidget(options.parentList, options.indexOfParentList)
    designer.emitHistoryChange()
  }
  const cloneContainer = widget => {
    if (!!options.parentList) {
      const newCon = designer.cloneContainer(widget)
      options.parentList.splice(options.indexOfParentList + 1, 0, newCon)
      designer.setSelected(newCon)

      designer.emitHistoryChange()
    }
  }
  const removeWidget = () => {
    if (!!options.parentList) {
      const widgetRefName = designer.selectedWidgetName
      let nextSelected = null
      if (options.parentList.length === 1) {
        if (!!options.parentWidget) {
          nextSelected = options.parentWidget
        }
      } else if (options.parentList.length === 1 + options.indexOfParentList) {
        nextSelected = options.parentList[options.indexOfParentList - 1]
      } else {
        nextSelected = options.parentList[options.indexOfParentList + 1]
      }

      nextTick(() => {
        options.parentList.splice(options.indexOfParentList, 1)
        designer.setSelected(nextSelected)

        designer.formWidget.deleteWidgetRef(widgetRefName) //删除组件ref！！！
        designer.emitHistoryChange()
      })
    }
  }
  const setWidgetOption = (optionName, optionValue) => {
    //通用组件选项修改API
    if (options.widget.options.hasOwnProperty(optionName)) {
      options.widget.options[optionName] = optionValue
    }
  }
  const selected = computed(
    () => options.widget.id === options.designer.selectedId
  )
  const customClass = computed(() => options.widget.options.customClass || '')

  return {
    appendTableRow,
    appendTableCol,
    onContainerDragAdd,
    onContainerDragUpdate,
    checkContainerMove,
    selectWidget,
    selectParentWidget,
    moveUpWidget,
    moveDownWidget,
    cloneContainer,
    removeWidget,
    setWidgetOption,
    selected,
    customClass
  }
}
