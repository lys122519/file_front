<template>
  <div>
    <div style="margin: 10px 0">
      <template>
        <el-carousel indicator-position="outside" height="450px" :interval="5000">
          <el-carousel-item v-for="item in imgs" :key="item">
            <!--           <h3>{{ item }}</h3>-->
            <img :src="item" alt="" style="width: 100%;">
          </el-carousel-item>
        </el-carousel>
      </template>
    </div>

    <div style="margin: 10px 0">
      <el-row :gutter="10">

        <el-col :span="6" v-for="item in files" :key="item.id" style="margin-bottom: 10px">
          <div style="border: 1px solid #ccc;width: 100%;height: 100%;min-height: 390px;min-width: 290px;">
            <img :src="item.url" alt="" style="width: 100%;height: 100%">
            <div style="padding: 10px 0;color: #666">
              {{ item.name }}
            </div>
            <div style="text-align: right;padding-right:20px;padding-bottom: 10px">
              <el-button type="primary" size="small">购买</el-button>
            </div>
          </div>
        </el-col>



      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FrontHome',
  data() {
    return {
      imgs: [
        'https://anmei-drive.obs.cn-north-4.myhuaweicloud.com/1001585.jpg',
        'https://anmei-drive.obs.cn-north-4.myhuaweicloud.com/1001498.jpg',
        'https://anmei-drive.obs.cn-north-4.myhuaweicloud.com/1001809.jpg'
      ],
      files: []
    }

  },
  created() {
    this.getAll()
  },
  methods: {
    getAll() {
      this.request.get('/file/front/all').then(res => {
        if (res.code === '200') {

          this.files = res.data.filter(v => v.type === 'png' || v.type === 'jpg' || v.type === 'webp')

        }

      })
    }
  }
}
</script>

<style scoped>

</style>