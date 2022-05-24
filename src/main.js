import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css'
import request from './utils/request.js'
import store from './store/index'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.request = request


//全局注册markdown插件
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)


new Vue({
  router,
  //自己定义的
  store,
  render: h => h(App)
}).$mount('#app')
