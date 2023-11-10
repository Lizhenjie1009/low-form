import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/styles/index.less'
import 'virtual:windi.css'
import 'virtual:svg-icons-register'
import Draggable from 'vuedraggable'
import { registerIcon } from '@/icons'
import { ContainerWidgets } from '@/packages'
const app = createApp(App)
registerIcon(app)
app.component('Draggable', Draggable)
app.use(ContainerWidgets)
app.use(store)
app.use(router)
app.mount('#app')
