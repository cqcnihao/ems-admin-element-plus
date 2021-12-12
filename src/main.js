import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'

import '/src/assets/css/common.css'
import 'element-plus/dist/index.css'
import './router/index'

import router from './router/routers'
import store from "./store";

const app = createApp(App)
app.use(router).use(store).use(ElementPlus, {locale})
app.mount('#app')
