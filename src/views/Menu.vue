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

    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange"
              row-key="id" default-expand-all>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>

      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="path" label="路径">
      </el-table-column>
      <el-table-column prop="pagePath" label="页面路径">
      </el-table-column>
      <el-table-column prop="icon" label="图标">
        <template v-slot="scope">
          <i :class="scope.row.icon" style="font-size: 25px;text-align: center"></i>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>

      <el-table-column prop="option" label="操作" width="300">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-plus" size="small" v-if="!scope.row.pid && !scope.row.path"
                     @click="handleAdd(scope.row.id)">新增子菜单
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


    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="90px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面路径">
          <el-input v-model="form.pagePath" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <template v-slot="scope">
            <el-select clearable v-model="form.icon" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
                <i :class="item.value"></i>
                {{ item.name }}
              </el-option>
            </el-select>
          </template>
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
  name: 'Menu',
  data() {
    return {
      tableData: [],
      name: '',//查询请求参数

      dialogFormVisible: false,
      multipleSelection: [],
      // 批量删除弹出框
      delBatchVisible: false,
      form: {
        name: '',
        icon: '',
        path: '',
        pagePath: '',
        description: '',

      },
      options: []
    }

  },
  created() {
    this.load()
  },
  methods: {
    //新增子菜单
    addChildren() {

    },


    handleSelectionChange(val) {
      this.multipleSelection = val

    },

    // 批量删除
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post('/menu/del/batch', ids).then(res => {
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

      this.request.delete('/menu/' + id).then(res => {
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

    //获得图标
    getIcons() {
      //请求图标的数据
      this.request.get('/menu/icons').then(res => {
        this.options = res.data
      })
    },
    // 编辑
    handleEdit(row) {
      this.getIcons()

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
      console.log(this.form)
      this.form.pid = ''
      this.request.post('/menu', this.form).then(res => {
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

    handleAdd(pid) {
      this.getIcons()
      this.dialogFormVisible = true
      this.form = {}
      if (pid) {
        this.form.pid = pid
      }
    },
    //重置搜索条件
    reset() {
      this.name = ''
      this.load()
    },
    load() {
      //  请求分页查询数据
      this.request.get('/menu', {
        params: {
          name: this.name
        }
      }).then(res => {

        this.tableData = res.data

      })

    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()

    }
  }

}
</script>

<style lang="less" scoped>


</style>