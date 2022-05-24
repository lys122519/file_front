<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5"
                v-model="email"></el-input>
      <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-location" class="ml-5"
                v-model="address"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
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
      <el-upload
          action="http://localhost:9090/user/import"
          :show-file-list="false"
          accept="xlsx"
          :on-success="handleExcelImportSuccess"
          style="display: inline-block">
        <el-button type="primary" class="ml-5" icon="el-icon-bottom">导入</el-button>
      </el-upload>

      <el-button class="ml-5" type="primary" icon="el-icon-top" @click="exportFile">导出</el-button>
    </div>

    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>

      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="140">
      </el-table-column>
      <el-table-column prop="role" label="角色">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.role==='ROLE_ADMIN'" size="medium">管理员</el-tag>
          <el-tag type="warning" v-if="scope.row.role==='ROLE_STUDENT'" size="medium">学生</el-tag>
          <el-tag type="success" v-if="scope.row.role==='ROLE_TEACHER'" size="medium">教师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120">
      </el-table-column>

      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>


      <el-table-column prop="option" label="操作" width="500">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-view" size="small" @click="lookCourse(scope.row.courses)"
                     v-if="scope.row.role==='ROLE_TEACHER'">查看教授课程
          </el-button>
          <el-button type="primary" icon="el-icon-view" size="small" @click="lookStuCourse(scope.row.stuCourses)"
                     v-if="scope.row.role==='ROLE_STUDENT'">查看已选课程
          </el-button>
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>

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

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="90px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色">
          <el-select clearable v-model="form.role" placeholder="请选择" style="width: 80%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag">
            </el-option>
          </el-select>
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
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="课程信息" :visible.sync="dialogCourseVisible" width="30%">
      <el-table :data="courses" border stripe>
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column prop="score" label="学分"></el-table-column>
        <el-table-column prop="times" label="课时"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="学生选课信息" :visible.sync="dialogStuCusVisible" width="30%">
      <el-table :data="stuCourses" border stripe>
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column prop="score" label="学分"></el-table-column>
        <el-table-column prop="times" label="课时"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'User',

  data() {
    return {
      tableData: [],
      username: '',//查询请求参数
      address: '',//查询请求参数
      email: '',//查询请求参数
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dialogFormVisible: false,
      dialogCourseVisible: false,
      //学生选课,
      dialogStuCusVisible: false,
      multipleSelection: [],
      // 批量删除弹出框
      delBatchVisible: false,
      form: {
        username: '',
        nickname: '',
        email: '',
        phone: '',
        address: ''
      },
      //用户身份
      roles: [],
      //任课科目
      courses: [],
      //学生选课科目
      stuCourses: []
    }

  },
  created() {
    this.load()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val

    },
    //上传成功
    handleExcelImportSuccess() {
      this.$message.success('导入成功')
      this.load()
    },
    //导出文件
    exportFile() {
      window.open('http://localhost:9090/user/export')
    },
    // 批量删除
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post('/user/del/batch', ids).then(res => {
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
    // 删除
    handleDel(id) {

      this.request.delete('/user/' + id).then(res => {
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
    //新增或修改
    save() {
      this.request.post('/user', this.form).then(res => {
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
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    //重置搜索条件
    reset() {
      this.username = ''
      this.email = ''
      this.address = ''
      this.load()
    },
    load() {
      //  请求分页查询数据
      this.request.get('/user/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          email: this.email,
          address: this.address
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })


      this.request.get('/role').then(res => {
        this.roles = res.data
      })

    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()

    },
    //教师查看教授课程
    lookCourse(courses) {
      this.courses = courses
      this.dialogCourseVisible = true
    },
    lookStuCourse(stuCourses) {
      this.stuCourses = stuCourses
      this.dialogStuCusVisible = true
    }


  }

}
</script>

<style scoped>

</style>