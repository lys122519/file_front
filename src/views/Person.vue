<template>
  <el-card style="width: 500px;padding: 10px; border: 1px solid #ccc">
    <el-upload
        class="avatar-uploader"
        action="http://localhost:9090/file/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >

      <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar" alt="">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>


    <el-form :model="form" label-width="90px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input type="textarea" v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>

    </el-form>

    <div style="text-align: center">
      <el-button type="primary" @click="save()">确 定</el-button>
    </div>

  </el-card>

</template>

<script>
export default {
  name: 'Person',
  data() {
    return {
      form: {
        username: '',
        nickname: '',
        email: '',
        phone: '',
        address: ''
      },
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      const username = this.user.username
      if (!username) {
        this.$message.error('当前无法获取用户数据！')
        return
      }

      this.getUser().then(res => {
        // console.log(res)
        this.form = res
      })
    },
    //根据用户名获取用户信息
    async getUser() {
      return (await this.request.get('/user/username/' + this.user.username)).data
    },
    //新增
    save() {
      this.request.post('/user', this.form).then(res => {
        if (res.code === '200') {
          this.$message.success('保存成功')
          //触发父级更新方法，自定义
          this.$emit('refreshUser')

          //重新加载数据
          this.getUser().then(res => {
            res.token = JSON.parse(localStorage.getItem('user')).token
            localStorage.setItem('user', JSON.stringify(res))
          })

        } else {
          this.$message.error('保存失败')
        }
      }).finally(() => {


      })
    },
    //上传头像
    handleAvatarSuccess(val) {
      this.form.avatarUrl = val
    },
    //头像预处理
    beforeAvatarUpload(avatar) {
      //文件类型
      const isJPEG = avatar.type === 'image/jpeg'
      const isJPG = avatar.type === 'image/jpg'
      const isPNG = avatar.type === 'image/png'
      //文件大小
      const isLt2M = avatar.size / 1024 / 1024 < 2

      if (!isJPG || !isJPEG || !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader {
  text-align: center;
  padding-bottom: 10px;

  .el-upload {

    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}


.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {

  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}

.avatar {
  border-radius: 10px;
  width: 138px;
  height: 138px;
  display: block;
}
</style>