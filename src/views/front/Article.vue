<template>
  <div style="color: #666">
    <div style="margin: 10px 0">
      <el-input style="width: 300px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"
      ></el-input>

      <el-button style="margin-left: 5px" type="primary" @click="load" size="small">搜索</el-button>
      <el-button type="warning" @click="reset" size="small">重置</el-button>
    </div>
    <!--    <div style="margin: 10px 0">-->

    <!--      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" v-if="user.role==='ROLE_ADMIN'">新增</el-button>-->
    <!--      <el-popconfirm-->
    <!--          class="ml-5"-->
    <!--          confirm-button-text='确定'-->
    <!--          cancel-button-text='我再想想'-->
    <!--          icon="el-icon-info"-->
    <!--          icon-color="red"-->
    <!--          title="您确定删除吗？"-->
    <!--          :hide-icon="true"-->
    <!--          @confirm="delBatch"-->
    <!--      >-->

    <!--        <el-button type="danger" icon="el-icon-remove-outline" slot="reference" v-if="user.role==='ROLE_ADMIN'">批量删除-->
    <!--        </el-button>-->
    <!--      </el-popconfirm>-->
    <!--    </div>-->

    <div style="margin: 10px 0">
      <div style="padding: 10px 0; border-bottom: 1px dashed #ccc" v-for="item in tableData" :key="item.id">
        <div class="pd-10" style="font-size: 20px;color: #3F5EFB;cursor: pointer"
             @click="$router.push('/front/articleDetail?id='+item.id)">
          {{ item.name }}
        </div>
        <div style="font-size: 15px;margin-top: 10px">
          <i class="el-icon-user-solid"></i><span>{{ item.username }}</span>

          <i class="el-icon-time" style="margin-left: 10px;"></i><span>{{ item.time }}</span>
        </div>

      </div>
    </div>

    <div class="block">
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          style="text-align: center;margin-top: 5px"
      >
      </el-pagination>
    </div>


  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'Article',
  data() {
    return {
      dialogFormVisible: false,
      menuDialogVisible: false,
      //md
      dialogMdVisible: false,
      tableData: [],
      multipleSelection: [],
      //查询条件
      name: '',
      //分页
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {
        name: ''
      },

      content: '',
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      //  请求分页查询数据
      this.request.get('/article/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })

    },

    handleAdd() {

      this.dialogFormVisible = true
      this.form = {}
    },
    //新增或修改
    save() {
      // this.form.state = 0
      this.request.post('/article', this.form).then(res => {
        if (res.code === '200') {
          this.$message.success('保存成功')
          this.dialogFormVisible = false

        } else {
          this.$message.error('保存失败')
          this.dialogFormVisible = false

        }
      }).finally(() => {
        //重新加载数据
        this.load()
      })
    },

    //课程是否启用
    changeEnable(row) {
      this.request.post('/article/update', row).then(res => {
        if (res.code === '200') {
          this.$message.success('操作成功')
        }
        this.load()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post('/article/del/batch', ids).then(res => {
        if (res.data) {
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      }).finally(() => {
        //重新加载数据
        this.load()
      })
    },
    // 删除
    handleDel(id) {

      this.request.delete('/article/' + id).then(res => {
        // console.log(res)
        if (res.code === '200') {
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      }).finally(() => {
        //重新加载数据
        this.load()
      })
    },

    // 编辑
    handleEdit(row) {

      this.form = row
      this.dialogFormVisible = true
    },
    //取消
    cancel() {
      this.dialogFormVisible = false
      this.$message.info('当前操作取消')
    },
    //重置搜索条件
    reset() {
      this.name = ''
      this.load()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()

    },
    //md上传图片
    imgAdd(pos, $file) {
      let $vm = this.$refs.md
      //先将图片上传至服务器
      const formData = new FormData()
      formData.append('file', $file)
      axios({
        url: 'http://localhost:9090/file/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        //使用服务器返回的图片地址替换原图片地址
        $vm.$img2Url(pos, res.data)
      })
    },
    //查看文章内容
    viewContent(content) {
      this.content = content
      this.dialogMdVisible = true
    }


  }
}
</script>

<style scoped>

</style>