<template>
  <el-container style="min-height: 100vh;">

    <el-aside :width="sideWidth+'px'" style="box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" style="padding-bottom: 20px"></Aside>
    </el-aside>

    <el-container>
      <!--左侧收缩按钮-->
      <el-header style="border-bottom: 1px solid #ccc">
        <Header :collapseBtnClass="collapseBtnClass" @asideCollapse="collapse" :user="user"></Header>
      </el-header>


      <el-main>
        <!--表示当前页面的子路由会在router-view展示-->
        <router-view @refreshUser="getUser"></router-view>

      </el-main>


    </el-container>
  </el-container>


</template>

<script>
import Aside from '@/components/Aside'
import Header from '@/components/Header'

export default {
  name: 'HomeView',
  components: {
    Aside, Header
  },
  created() {
    this.getUser()
  },
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      //左侧展示状态
      isCollapse: false,
      //左侧菜单栏宽度
      sideWidth: 200,
      logoTextShow: true,
      user: {}
    }
  },
  methods: {


    getUser() {
      let username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : ''
      // 从后台获取User数据
      this.request.get('/user/username/' + username).then(res => {
        //重新赋值user
        this.user = res.data
      })
    },
    //点击收缩按钮触发
    collapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        // 收缩
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {
        // 展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    }

  }
}
</script>


<style lang="less" scoped>


//.el-aside {
//  background-color: rgb(48, 65, 86);
//  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
//
//}
</style>


