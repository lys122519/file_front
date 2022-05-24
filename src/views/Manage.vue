<template>
  <el-container style="min-height: 100vh;">

    <el-aside :width="sideWidth+'px'" style="">
      <Aside :is-collapse="isCollapse" ></Aside>
    </el-aside>

    <el-container>
      <!--左侧收缩按钮-->
      <el-header style="">
        <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse" :user="user"></Header>
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
      user: {}
    }
  },
  methods: {


    getUser() {
      let username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : ''
      this.request.get('/user/username/' + username).then(res => {
        //重新赋值user
        this.user = res.data
      })
    },
    collapse() {//点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'


      } else {
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
      }
    }

  }
}
</script>


<style lang="less" scoped>


.el-header {
  //background-color: #B3C0D1;
  //color: #333;
  //line-height: 60px;
  //display: flex;
  border-bottom: 1px solid #ccc
}

.el-aside {
  background-color: rgb(48, 65, 86);
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);

}
</style>


