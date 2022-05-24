<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>

      <el-button style="margin-left: 5px" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">

      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" v-if="user.role==='ROLE_ADMIN'">新增</el-button>
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

        <el-button type="danger" icon="el-icon-remove-outline" slot="reference" v-if="user.role==='ROLE_ADMIN'">批量删除
        </el-button>
      </el-popconfirm>
    </div>


    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>

      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="课程名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="score" label="课程学分">
      </el-table-column>
      <el-table-column prop="times" label="课时">
      </el-table-column>
      <el-table-column prop="teacher" label="授课教师">
      </el-table-column>

      <el-table-column prop="enable" label="启用">
        <template v-slot="scope">
          <el-switch v-model="scope.row.state"
                     @change="changeEnable(scope.row)"
                     active-color="#13ce66" inactive-color="#ccc"></el-switch>
        </template>

      </el-table-column>

      <el-table-column prop="option" label="操作" width="300">
        <template v-slot="scope">
          <el-button type="primary" @click="selectCourse(scope.row.id)" size="small">选课</el-button>
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)"
                     v-if="user.role==='ROLE_ADMIN'">编辑
          </el-button>
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
            <el-button type="danger" icon="el-icon-remove-outline" size="small" slot="reference"
                       v-if="user.role==='ROLE_ADMIN'">删除
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

    <el-dialog title="课程信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="90px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="form.score" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="课时">
          <el-input v-model="form.times" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="授课教师">
          <el-select clearable v-model="form.teacherId" autocomplete="off" placeholder="请选择">
            <el-option v-for="item in teachers" :key="item.id" :label="item.nickname" :value="item.id"></el-option>

          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>


  </div>

</template>

<script>
export default {
  name: 'Course',
  data() {
    return {
      dialogFormVisible: false,
      menuDialogVisible: false,
      tableData: [],
      multipleSelection: [],
      //查询条件
      name: '',
      //分页
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {
        name: '',
        score: '',
        times: '',
        teacherId: ''

      },
      teachers: [],
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      //  请求分页查询数据
      this.request.get('/course/page', {
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
    // 请求身份为教师信息
    getTeacher() {
      this.request.get('/user/role/' + 'ROLE_TEACHER').then(res => {
        this.teachers = res.data

      })
    },
    handleAdd() {
      this.getTeacher()
      this.dialogFormVisible = true
      this.form = {}
    },
    //新增或修改
    save() {
      // this.form.state = 0
      this.request.post('/course', this.form).then(res => {
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
      this.request.post('/course/update', row).then(res => {
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
      this.request.post('/course/del/batch', ids).then(res => {
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

      this.request.delete('/course/' + id).then(res => {
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
      this.getTeacher()
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
    //选课
    selectCourse(courseId) {
      console.log(this.user.id)
      this.request.post('/course/studentCourse/' + this.user.id + '/' + courseId).then(res => {
        if (res.code === '200') {
          this.$message.success('选课成功')
        } else {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        //重新加载数据
        this.load()

      })

    }


  }
}
</script>

<style scoped>

</style>