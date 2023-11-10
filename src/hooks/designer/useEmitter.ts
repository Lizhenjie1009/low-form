import { useConfigStore } from '@/store'

export default function useEmitter(widgetRefList?: any) {
  const config = useConfigStore()

  const vfEvents = ref({})

  const emit$ = (eventName, data) => {
    if (vfEvents.value[eventName]) {
      vfEvents.value[eventName].forEach(fn => {
        fn(data)
      })
    }
  }

  const on$ = (eventName, fn) => {
    vfEvents.value[eventName] = vfEvents.value[eventName] || []
    vfEvents.value[eventName].push(fn)
  }

  const off$ = (eventName, fn) => {
    if (vfEvents.value[eventName]) {
      if (fn === undefined || fn === null) {
        vfEvents.value[eventName].length = 0
        return
      }

      for (let i = 0; i < vfEvents.value[eventName].length; i++) {
        if (vfEvents.value[eventName][i] === fn) {
          vfEvents.value[eventName].splice(i, 1)
          break
        }
      }
    }
  }

  function dispatch($parent, componentName, eventName, params) {
    let parent = $parent
    let name = parent.$options.componentName
    console.log($parent, parent, parent.$parent)
    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent

      if (parent) {
        name = parent.$options.componentName
      }
    }
    console.log(parent, name, params)

    if (parent) {
      if (!!parent.emit$) {
        parent.emit$.call(parent, eventName, params)

        if (componentName === 'VFormRender') {
          parent.$emit(eventName, ...params) //执行原生$emit，以便可以用@进行声明式事件处理！！
        }
      }
    }
  }

  function broadcast(componentName, eventName, params) {
    /* Vue3移除了$children属性，_broadcast方法已不能使用！！ */
    //_broadcast.call(this, componentName, eventName, params);

    if (!!widgetRefList) {
      //FormRender只需遍历自身的widgetRefList属性
      Object.keys(widgetRefList).forEach(refName => {
        const cmpName = widgetRefList[refName].$options.componentName
        if (cmpName === componentName) {
          const foundRef = widgetRefList[refName]
          foundRef.emit$.call(foundRef, eventName, params)
        }
      })
    }

    if (!!config.refList) {
      //其他组件遍历inject的refList属性
      Object.keys(config.refList).forEach(refName => {
        const cmpName = config.refList[refName].$options.componentName
        if (cmpName === componentName) {
          const foundRef = config.refList[refName]
          foundRef.emit$.call(foundRef, eventName, params)
        }
      })
    }
  }
  return {
    emit$,
    on$,
    off$,
    dispatch,
    broadcast
  }
}
