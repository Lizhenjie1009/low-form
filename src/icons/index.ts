import type { App, Component } from 'vue'

const viconsMoudle: Record<string, { default: string }> = import.meta.glob(
  './vicons/*.ts',
  {
    eager: true
  }
)

export const vicons: { [key in string]: Component } = {}
export function registerIcon(app: App) {
  for (const path in viconsMoudle) {
    const md: { [key in string]: Component } = viconsMoudle[path].default
    Object.assign(vicons, md)
    for (const v of Object.values(md)) {
      app.component(v.name as string, v)
    }
  }
}
