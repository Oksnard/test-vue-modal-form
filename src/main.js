import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'
import './style.css'
import App from './App.vue'


const routes = [
  { path: '/', component: App }
]
const router = createRouter({ history: createWebHistory(), routes })

const vfm = createVfm()

createApp(App)
  .use(vfm)
  .use(router)
  .mount('#app')
