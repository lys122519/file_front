<template>
  <div class="wrapper">
    <div
        style="height: 60px;line-height: 40px;font-size: 20px;padding-left: 50px;color: white;background-color: rgba(0,0,0,0.2)">
      管理系统
    </div>
    <div style="margin: 100px auto;background-color: white;width: 500px;border-radius: 10px;overflow: hidden">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="用户名登录" name="first">

          <div
              style="margin: 20px auto;background-color: #fff;width: 350px;height: 220px;padding: 20px;border-radius: 10px">
            <!--            <div style="margin: 20px 0;text-align: center;font-size: 24px">-->
            <!--              <b>登 录</b>-->
            <!--            </div>-->
            <el-form :rules="rulesNamePass" :model="user" ref="userForm">
              <el-form-item prop="username">
                <el-input prefix-icon="el-icon-user"
                          placeholder="请输入用户名"
                          v-model="user.username"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input prefix-icon="el-icon-lock"
                          placeholder="请输入密码"
                          show-password v-model="user.password"></el-input>
              </el-form-item>

              <el-form-item style="margin: 10px 0;text-align: right">
                <el-button size="medium" type="warning" autocomplete="off" @click="$router.push('/register')">注 册
                </el-button>
                <el-button size="medium" type="primary" autocomplete="off" @click="loginByAccount">登 录</el-button>
              </el-form-item>

              <el-form-item style="margin: 10px 0;text-align: right">
                <el-button size="medium" type="text" autocomplete="off" @click="handlePass">找回密码</el-button>
              </el-form-item>
            </el-form>

          </div>

        </el-tab-pane>
        <el-tab-pane label="邮箱登录" name="second">
          <div
              style="margin: 20px auto;background-color: #fff;width: 350px;height: 220px;padding: 20px;border-radius: 10px">
            <!--            <div style="margin: 20px 0;text-align: center;font-size: 24px">-->
            <!--              <b>登 录</b>-->
            <!--            </div>-->
            <el-form :model="user" ref="userEmailForm" :rules="rulesEmailPass">
              <el-form-item prop="email">
                <el-input prefix-icon="el-icon-message"
                          placeholder="请输入邮箱"
                          v-model="user.email"></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input prefix-icon="el-icon-lock"
                          placeholder="请输入验证码"
                          style="width: 192px"
                          v-model="user.code"></el-input>
                <el-button type="primary" class="ml-5" @click="sendEmailCode(1)">获取验证码</el-button>
              </el-form-item>

              <el-form-item style="margin: 10px 0;text-align: right">
                <el-button size="medium" type="warning" autocomplete="off" @click="$router.push('/register')">注 册
                </el-button>
                <el-button size="medium" type="primary" autocomplete="off" @click="loginByEmail">登 录</el-button>
              </el-form-item>

              <el-form-item style="margin: 10px 0;text-align: right">
                <el-button size="medium" type="text" autocomplete="off" @click="handlePass">找回密码</el-button>
              </el-form-item>
            </el-form>

          </div>

        </el-tab-pane>
      </el-tabs>

      <el-dialog title="找回密码" :visible.sync="dialogFormVisible" width="30%">
        <el-form label-width="100px" ref="forgetPass" :model="pass" :rules="forgetPass">

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="pass.email" prefix-icon="el-icon-message" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">

            <el-input v-model="pass.code" style="width: 200px" autocomplete="off"></el-input>
            <el-button type="primary" class="ml-5" @click="sendEmailCode(2)">获取验证码</el-button>

          </el-form-item>
          <el-form-item label="密码" prop="newPassword">
            <el-input v-model="pass.newPassword" prefix-icon="el-icon-lock" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="pass.confirmPassword" prefix-icon="el-icon-lock" autocomplete="off"
                      show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveByEmail()">确 定</el-button>
        </div>
      </el-dialog>


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
      //找回密码
      pass: {},
      dialogFormVisible: false,
      //默认用户名密码登录
      activeName: 'first',
      rulesNamePass: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]

      },
      rulesEmailPass: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      forgetPass: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入验证码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度不少于3位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度不少于3位', trigger: 'blur' }
        ]
      }


    }
  },
  methods: {
    loginByAccount() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {

          this.request.post('/user/loginAccount', this.user).then(res => {
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
    },
    //通过邮箱登录
    loginByEmail() {
      this.$refs['userEmailForm'].validate((valid) => {
        if (valid) {

          this.request.post('/user/loginEmail', this.user).then(res => {
            console.log(res)
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
    },
    //获取验证码
    sendEmailCode(type) {
      let email
      //1 登录 2 找回密码
      if (type === 1) {
        email = this.user.email
      } else if (type === 2) {
        email = this.pass.email
      }

      if (!email) {
        this.$message.warning('请输入邮箱')
        return
      }
      //正则验证邮箱
      if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)) {
        this.$message.warning('请输入正确邮箱')
        return
      }

      //发送请求
      this.request.post('/user/email/' + email + '/' + type).then(res => {
        console.log(res)
        if (res.code === '200') {
          this.$message.success('发送成功')
        } else {
          this.$message.error(res.msg)
        }
      })

    },
    handlePass() {
      this.pass = {}
      this.dialogFormVisible = true
    },
    //修改密码
    saveByEmail() {

      this.$refs['forgetPass'].validate((valid) => {

        if (valid) {  //合法

          if (this.pass.newPassword !== this.pass.confirmPassword) {
            this.$message.error('2次输入的新密码不相同')
            return false
          }

          this.request.post('/user/forget', this.pass).then(res => {
            if (res.code === '200') {
              this.$message.success('修改成功')
              this.dialogFormVisible = false

            } else {
              this.$message.error(res.msg)
            }
          })
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