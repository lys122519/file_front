import Vue from 'vue'
import Vuex from 'vuex'
import router, { resetRouter } from '@/router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentPathName: ''
  },
  mutations: {
    setPath(state) {
      state.currentPathName = localStorage.getItem('currentPathName')
    },
    logout(state) {
      localStorage.removeItem('user')
      localStorage.removeItem('menus')
      router.push('/login').then(r => {
        //重置路由
        resetRouter()
      })
    }
  }
})

export default store