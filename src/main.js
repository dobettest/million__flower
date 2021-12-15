import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.less'
Vue.config.productionTip = false
let el = '#app'
if (process.env.isMiniprogram) {
  el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)
}
const app = new Vue({
  el,
  router,
  store,
  render: h => h(App),
})
export default function createApp() {
  return app
}
