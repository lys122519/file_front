<template>
  <div style="padding: 10px">
    <el-card>
      <div v-for="item in videos" :key="item.id"
           style="margin: 10px 0;padding: 10px 0;color: #666;border-bottom:1px dashed #ccc ">
        <span style="font-size: 18px;cursor: pointer" class="itemTitle" @click="detail(item.id)">{{ item.name }}</span>
        <span style="float: right;font-size: 14px;margin-top: 5px">{{ item.size / 1024 |numFilter }}MB</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data() {
    return {
      videos: []
    }
  },
  created() {
    this.request.get('/file/front/all').then(res => {
      if (res.code === '200') {
        this.videos = res.data.filter(v => v.type === 'mp4')
      }
    })

  },
  methods: {
    detail(id) {
      //路由传参
      this.$router.push({ path: '/front/videoDetail', query: { id: id } })
    }
  },
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      // console.log(value)
      return parseFloat(value).toFixed(2)
    }
  }
}
</script>

<style scoped>
.itemTitle:hover {
  color: #3a8ee6
}
</style>