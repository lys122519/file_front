<template>
  <div style="color: #666">
    <div style="margin: 20px 0">
      <div class="pd-10" style="font-size: 20px;color: #3F5EFB;">
        {{ article.name }}
      </div>
      <div style="font-size: 15px;margin-top: 10px">
        <i class="el-icon-user-solid"></i><span>{{ article.username }}</span>

        <i class="el-icon-time" style="margin-left: 10px;"></i><span>{{ article.time }}</span>
      </div>
    </div>

    <div style="margin: 20px 0">
      <mavon-editor
          class="md"
          :value="article.content"
          :subfield="false"
          :defaultOpen="'preview'"
          :toolbarsFlag="false"
          :editable="false"
          :scrollStyle="true"
          :ishljs="true"
      />
    </div>
    <div style="margin: 30px 0">
      <div style="margin: 10px 0">
        <div style="border-bottom: 1px solid orangered;padding: 10px 0;font-size: 20px">评论</div>
        <div style="padding: 10px 0">
          <el-input size="small" type="textarea" v-model="commentForm.content"></el-input>
        </div>
        <div class="pd-10" style="text-align: right">
          <el-button type="primary" @click="save()">评论</el-button>
        </div>
      </div>


      <div>
        <!--评论列表-->
        <div v-for="item in comments" :key="item.id"
             style="border-bottom: 1px solid #ccc;padding: 10px 0;">

          <div style="display: flex">
            <div style="width: 100px;text-align: center">
              <!--头像-->
              <el-image :src="item.avatarUrl" style="width: 50px;height: 50px;border-radius: 50%;">

              </el-image>
            </div>
            <div style="flex: 1;font-size: 16px;padding: 5px 0;line-height: 25px">
              <!--内容-->
              <b>{{ item.nickname }}：</b>
              <span>{{ item.content }}</span>

              <div style="display: flex;line-height: 20px;margin-top: 5px">
                <div style="width: 200px;margin: auto">
                  <i class="el-icon-time"></i>
                  <span style="margin-left:5px">{{ item.time }}</span>
                </div>

                <div style="text-align: right;flex: 1">
                  <el-button style="margin-left: 5px" type="text" @click="handleReply(item.id)">回复</el-button>
                  <el-button type="text" style="color: red" @click="del(item.id)" v-if="user.id===item.userId">删除
                  </el-button>
                </div>

              </div>
            </div>


          </div>


          <!--回复列表-->
          <div v-if="item.children.length" style="padding-left: 200px;">
            <div v-for="subItem in item.children" :key="subItem.id" style="background-color: #f0f0f0;padding: 5px 20px">

              <div>
<!--                <b style="color: #3a8ee6" v-if="subItem.pNickName">@{{ subItem.pNickName }}：</b>-->
                <b style="color: #3a8ee6" >@{{ subItem.pNickName }}：</b>
              </div>

              <div style="font-size: 16px;padding: 5px 0;line-height: 25px">
                <!--内容-->
                <b style="padding-left: 5px">{{ subItem.nickname }}：</b>
                <span>{{ subItem.content }}</span>

                <div style="display: flex;line-height: 20px;margin-top: 5px;padding-left: 5px">
                  <div style="width: 200px;margin: auto">
                    <i class="el-icon-time"></i>
                    <span style="margin-left:5px">{{ subItem.time }}</span>
                  </div>

                  <div style="text-align: right;flex: 1">
                    <el-button style="margin-left: 5px" type="text" @click="handleReply(subItem.id)">回复</el-button>
                    <el-button type="text" style="color: red" @click="del(subItem.id)" v-if="user.id===subItem.userId">
                      删除
                    </el-button>
                  </div>

                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>


    <!--回复弹窗-->
    <el-dialog title="文章信息" :visible.sync="dialogFormVisible" width="50%" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form :model="commentForm" label-width="90px">
        <el-form-item label="回复内容">
          <el-input type="textarea" v-model="commentForm.contentReply" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'Article',
  data() {
    return {
      article: {},

      //评论
      comments: [],
      //当前评论内容
      commentForm: {},
      //文章id
      id: this.$route.query.id,
      dialogFormVisible: false,
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    }
  },
  created() {
    this.load()
    this.loadComment()
  },
  methods: {
    load() {
      //  请求分页查询数据

      this.request.get('/article/' + this.id).then(res => {
        this.article = res.data
      })
    },

    // 删除
    del(id) {

      this.request.delete('/comment/' + id).then(res => {
        // console.log(res)
        if (res.code === '200') {
          this.$message.success('删除成功')
          this.loadComment()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    //评论
    save() {
      if (!this.user.id) {
        this.$message.warning('请登录后操作')
        return
      }


      this.commentForm.articleId = this.id

      //如果回复的是一条评论
      if (this.commentForm.contentReply) {
        this.commentForm.content = this.commentForm.contentReply
      }

      console.log(this.commentForm)
      this.request.post('/comment', this.commentForm).then(res => {
        if (res.code === '200') {
          this.$message.success('评论成功')
          this.loadComment()
          //初始化评论 清空
          this.commentForm = {}
          this.dialogFormVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadComment() {

      this.request.get('/comment/tree/' + this.id).then(res => {
        this.comments = res.data
      })
    },
    //回复评论
    handleReply(pid) {
      this.commentForm = { pid: pid }

      this.dialogFormVisible = true
    }


  }
}
</script>

<style scoped>

</style>