const containerWidgets = import.meta.globEager(
  './container-components/**/*widget.vue'
)
const containerConfigs = import.meta.globEager(
  './container-components/**/config.ts'
)

const filedWidgets = import.meta.globEager('./filed-components/**/*.vue')
const filedConfigs = import.meta.globEager('./filed-components/**/config.ts')

const editorModules = import.meta.globEager('./**/*editor.vue')

class Ms {
  constructor(modules) {
    this.modules = modules
    this.modulesObj = {}
    this.dealModulesObj()
  }

  dealModulesObj() {
    for (const path in this.modules) {
      const cname =
        this.modules[path]?.default.name || this.modules[path]?.default.__name
      this.modulesObj[cname] = this.modules[path]?.default
    }
  }
}

const cw = new Ms(containerWidgets)
export const widgetListModules = cw.modulesObj

const fw = new Ms(filedWidgets)
export const filedListModules = fw.modulesObj
console.log(filedListModules, 'fw')
const e = new Ms(editorModules)
export const editorListModules = e.modulesObj

export const ContainerWidgets = {
  install(app) {
    for (const [key, value] of Object.entries(widgetListModules)) {
      app.component(key, value)
    }
  }
}

// config
export const containers = []
for (const path in containerConfigs) {
  const data = containerConfigs[path].default
  containers.push(...data)
}
export function addContainerWidgetSchema(containerSchema) {
  containers.push(containerSchema)
}

export const basicFields = []
for (const path in filedConfigs) {
  const data = filedConfigs[path].default
  basicFields.push(...data)
}
export function addBasicFieldSchema(fieldSchema) {
  basicFields.push(fieldSchema)
}
