<template>
  <div class="wrapper">
    <div style="margin: 200px auto;background-color: #fff;width: 400px;height: 400px;padding: 20px;border-radius: 10px">
      <div style="margin: 20px 0;text-align: center;font-size: 24px">
        <b>登 录</b>
      </div>
      <el-form :rules="rules" :model="user" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user"
                    placeholder="请输入用户名"
                    v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock"
                    placeholder="请输入密码"
                    show-password v-model="user.password"></el-input>
        </el-form-item>

        <div style="margin: 10px 0;text-align: right">
          <el-button size="medium" type="warning" autocomplete="off" @click="$router.push('/register')">注 册</el-button>
          <el-button size="medium" type="primary" autocomplete="off" @click="login">登 录</el-button>

        </div>
      </el-form>

    </div>


  </div>

</template>

<script>
import { setRouters } from '@/router'

export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: '',
        password: ''

      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {

          this.request.post('/user/login', this.user).then(res => {
            if (res.code === '200') {//表单校验合法
              //用户信息存储到浏览器
              localStorage.setItem('user', JSON.stringify(res.data))
              //存储用户权限菜单信息
              localStorage.setItem('menus', JSON.stringify(res.data.menus))

              //动态设置当前用户的路由
              setRouters()
              this.$router.push('/')
              this.$message.success('登录成功')

              //只有学生跳转到前台
              if (res.data.role === 'ROLE_STUDENT') {
                this.$router.push('/front/home')
              } else {
                this.$router.push('/')
              }


            } else {
              // console.log(res)
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EF8);
  overflow: hidden;
}
</style>