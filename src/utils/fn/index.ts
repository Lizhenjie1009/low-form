export const generateId = function () {
  return Math.floor(
    Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000
  )
}

export const deepClone = function (origin) {
  if (origin === undefined) {
    return undefined
  }
  return JSON.parse(JSON.stringify(origin))
}

export const overwriteObj = function (obj1, obj2) {
  /* 浅拷贝对象属性，obj2覆盖obj1 */
  Object.keys(obj2).forEach(prop => {
    obj1[prop] = obj2[prop]
  })
}

// 表单设计器默认配置
export function getDefaultFormConfig() {
  return {
    modelName: 'formData',
    refName: 'vForm',
    rulesName: 'rules',
    labelWidth: 80,
    labelPosition: 'left',
    size: '',
    labelAlign: 'label-left-align',
    cssCode: '',
    customClass: [],
    functions: '', //全局函数
    layoutType: 'PC',
    jsonVersion: 3,

    onFormCreated: '',
    onFormMounted: '',
    onFormDataChange: ''
  }
}

export const addWindowResizeHandler = function (handler) {
  const oldHandler = window.onresize
  if (typeof window.onresize != 'function') {
    window.onresize = handler
  } else {
    window.onresize = function () {
      oldHandler()
      handler()
    }
  }
}
