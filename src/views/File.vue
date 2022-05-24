<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-upload
          action="http://localhost:9090/file/upload"
          :show-file-list="false"
          accept="xlsx"
          :on-success="handlerFileUploadSuccess"
          style="display: inline-block">
        <el-button type="primary" icon="el-icon-top">上传</el-button>
      </el-upload>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="您确定删除吗？"
          :hide-icon="true"
          @confirm="delBatch"
      >
        <el-button type="danger" icon="el-icon-remove-outline" slot="reference">批量删除</el-button>
      </el-popconfirm>


    </div>


    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange" >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>

      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="文件名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="type" label="文件类型">
      </el-table-column>
      <el-table-column prop="size" label="文件大小(kb)">
      </el-table-column>
      <el-table-column label="下载">
        <template v-slot="scope">
          <el-button type="primary" size="small" @click="downloadFile(scope.row.url)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="启用">
        <template v-slot="scope">
          <el-switch v-model="scope.row.enable"
                     @change="changeEnable(scope.row)"
                     active-color="#13ce66" inactive-color="#ccc"></el-switch>
        </template>

      </el-table-column>

      <el-table-column prop="option" label="操作">
        <template v-slot="scope">
<!--          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>-->

          <el-popconfirm
              class="ml-5"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              :hide-icon="true"
              @confirm="handleDel(scope.row.id)"
          >
            <el-button type="danger" icon="el-icon-remove-outline" size="small" slot="reference">删除
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="text-align: center;margin-top: 5px"
      >
      </el-pagination>
    </div>
  </div>

</template>

<script>
export default {
  name: 'File',
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      //查询条件
      name: '',
      //分页
      total: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      //  请求分页查询数据
      this.request.get('/file/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })

    },
    //下载文件
    downloadFile(url) {
      window.open(url)
    },
    //文件是否启用
    changeEnable(row) {
      this.request.post('/file/update', row).then(res => {
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
      this.request.post('/file/del/batch', ids).then(res => {
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

      this.request.delete('/file/' + id).then(res => {
        console.log(res)
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
      console.log("111")
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
    handlerFileUploadSuccess() {

      this.load()
      this.$message.success('上传成功')
    },



  }
}
</script>

<style scoped>

</style>