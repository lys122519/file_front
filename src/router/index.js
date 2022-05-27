import Vue from 'vue'
import VueRouter from 'vue-router'
import Manage from '@/views/Manage'
import store from '../store/index'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/login', name: '登录', meta: {}, component: () => import('../views/Login.vue')
  },
  {
    path: '/register', name: '注册', meta: {}, component: () => import('../views/Register.vue')
  },
  {
    path: '/404', name: 'NotFound', meta: {}, component: () => import('../views/404.vue')
  },
  {
    path: '/front', name: 'Front', meta: {}, component: () => import('../views/front/Front'),
    children: [
      {
        path: 'home', name: 'FrontHome', meta: {}, component: () => import('../views/front/Home')
      },
      {
        path: 'video', name: 'Video', meta: {}, component: () => import('../views/front/Video')
      },
      {
        path: 'videoDetail', name: 'VideoDetail', meta: {}, component: () => import('../views/front/VideoDetail')
      },
      {
        path: 'article', name: 'FrontArticle', meta: {}, component: () => import('../views/front/Article')
      },
      {
        path: 'articleDetail', name: 'ArticleDetail', meta: {}, component: () => import('../views/front/ArticleDetail')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}

//刷新页面会重置路由
export const setRouters = () => {
  const storeMenus = localStorage.getItem('menus')
  if (storeMenus) {

    //获取当前路由对象名称数组
    const currentRoutes = router.getRoutes().map(v => v.name)
    if (!currentRoutes.includes('Manage')) {
      //拼动态路由
      const manageRoute = {
        path: '/', name: 'Manage', component: () => import('../views/Manage.vue'), redirect: '/home', children: [
          //写固定路由
          { path: 'person', name: '个人信息', component: () => import('../views/Person.vue') },
          { path: 'password', name: '修改密码', component: () => import('../views/Password.vue') }
        ]
      }
      const menus = JSON.parse(storeMenus)
      menus.forEach(item => {
        if (item.path) { //当前仅当path不为空的时候设置路由
          let itemMenu = {
            path: item.path.replace('/', ''),
            name: item.name,
            meta: {},
            component: () => import('../views/' + item.pagePath + '.vue')
          }
          manageRoute.children.push(itemMenu)
        } else if (item.children.length) {
          item.children.forEach(item => {
            if (item.path) {
              let itemMenu = {
                path: item.path.replace('/', ''),
                name: item.name,
                meta: {},
                component: () => import('../views/' + item.pagePath + '.vue')
              }
              manageRoute.children.push(itemMenu)
            }

          })
        }

      })
      //动态添加到现在的路由对象中
      router.addRoute(manageRoute)
    }

  }
}
setRouters()


//路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem('currentPathName', to.name)
  store.commit('setPath')

  const storeMenus = localStorage.getItem('menus')
  //未找到路由
  if (to.matched.length === 0) {
    if (storeMenus) {
      next('/404')
    } else {
      //无缓存则代表未登录 跳回登录页
      next('/login')
    }
  }

  next()
})

export default router
