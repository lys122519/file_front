<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
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
    </div>

    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>

      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200px">
      </el-table-column>
      <el-table-column prop="flag" label="唯一标识">
      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>

      <el-table-column prop="option" label="操作" align="center">
        <template v-slot="scope">
          <el-button type="info" icon="el-icon-menu" size="small" @click="selectMenu(scope.row)">分配菜单</el-button>

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

    <el-dialog title="菜单分配" :visible.sync="menuDialogVisible" width="30%">
      <el-tree
          :data="menuData"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="props"
          :default-expanded-keys="expends"
          :default-checked-keys="checks"
      >
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i :class="data.icon"></i>
          {{ data.name }}</span>
            </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveRoleMenu()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="90px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识">
          <el-input v-model="form.flag" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
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
  name: 'User',

  data() {
    return {
      tableData: [],
      name: '',//查询请求参数
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dialogFormVisible: false,
      menuDialogVisible: false,
      multipleSelection: [],
      // 批量删除弹出框
      delBatchVisible: false,
      form: {
        name: '',
        description: ''
      },
      menuData: [],
      props: {
        label: 'name'
      },
      roleFlag: '',
      //分配菜单展开项 数组
      expends: [],
      checks: [],
      roleId: 0
    }


  },
  created() {
    this.load()
  },
  methods: {
    //分配菜单
    selectMenu(role) {
      this.menuDialogVisible = true
      this.roleId = role.id
      this.roleFlag = role.flag
      //请求菜单数据
      this.request.get('/menu', {
        // params: {
        //   name: ''
        // }
      }).then(res => {
        this.menuData = res.data
        //后台返回的菜单数据处理成id数组
        this.expends = this.menuData.map(v => v.id)
      })

      //请求当前用户的权限菜单
      this.request.get('/role/roleMenu/' + this.roleId).then(res => {

        this.checks = res.data

        this.request.get('/menu/ids').then(res => {

          const ids = res.data
          ids.forEach(id => {
            if (!this.checks.includes(id)) {
              this.$nextTick(() => {
                this.$refs.tree.setChecked(id, false)
              })

            }
          })
        })
        this.menuDialogVisible = true

      })


    },
    //复选框
    handleSelectionChange(val) {
      this.multipleSelection = val

    },
    // 批量删除
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post('/role/del/batch', ids).then(res => {
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
      this.request.delete('/role/' + id).then(res => {
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
      this.menuDialogVisible = false
      this.$message.info('当前操作取消')
    },
    //新增或修改
    save() {
      this.request.post('/role', this.form).then(res => {
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
      this.name = ''

      this.load()
    },
    load() {
      //  请求分页查询数据
      this.request.get('/role/page', {
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
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()

    },
    saveRoleMenu() {
      this.request.post('/role/roleMenu/' + this.roleId, this.$refs.tree.getCheckedKeys()).then(res => {
        if (res.code === '200') {
          this.$message.success('绑定成功')
          this.menuDialogVisible = false
          //修改管理员角色完成后重新登陆
          if (this.roleFlag === 'ROLE_ADMIN') {
            this.$store.commit('logout')
          }
        } else {
          this.$message.error('绑定失败')
          this.menuDialogVisible = false
        }
      })
    }
  }

}
</script>

<style scoped>

</style>