<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card style="color: #409EFF">
          <div><i class="el-icon-user-solid"/> 用户总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">

            100
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #F56C6C">
          <div><i class="el-icon-money"/>销售总量</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">120,000</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #409EFF">
          <div><i class="el-icon-bank-card"/> 收益总额</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">￥ 300,000</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #67C23A">
          <div><i class="el-icon-files"/>资源总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">100</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px;height: 450px"></div>
      </el-col>
      <el-col :span="12">
        <div id="pie" style="width: 600px;height: 400px"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Home',
  data() {
    return{

    }
  },
  //页面元素渲染之后触发
  mounted() {

    var option = {
      title: {
        text: '各季度会员数量统计',
        subtext: '趋势图',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ['第一季度', '第二季度', '第三季度', '第四季度']
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '2020-2021',
          data: [],
          type: 'line'
        },
        {
          name: '2020-2021',
          data: [],
          type: 'bar'
        },
        {
          name: '2021-2022',
          data: [],
          type: 'line'
        },
        {
          name: '2021-2022',
          data: [],
          type: 'bar'
        }
      ]
    }

    // 饼图
    var pieOption = {
      title: {
        text: '各季度会员数量统计',
        subtext: '比例图',
        left: 'center'

      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '2020-2021',
          type: 'pie',
          radius: '60%',
          //左右比例
          center: ['25%', '70%'],
          label: {  //饼图文字标签
            normal: {
              show: true,
              position: 'inner', //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 16, //字体大小
                color: '#fff'
              },
              formatter: '{d}%'
            }
          },
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: '2021-2022',
          type: 'pie',
          radius: '60%',
          center: ['75%', '70%'],
          label: {  //饼图文字标签
            normal: {
              show: true,
              position: 'inner', //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 16, //字体大小
                color: '#fff'
              },
              formatter: '{d}%'
            }
          },
          data: [
            { name: '第一季度', value: 5 },
            { name: '第二季度', value: 6 },
            { name: '第三季度', value: 7 },
            { name: '第四季度', value: 8 }],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    var chartDom = document.getElementById('main')
    var myChart = echarts.init(chartDom)

    var pieDom = document.getElementById('pie')
    var pieChart = echarts.init(pieDom)

    this.request.get('/echarts/members').then(res => {
      console.log(res.data)
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data
      option.series[1].data = res.data
      option.series[2].data = [1, 2, 8, 4]
      option.series[3].data = [1, 2, 8, 4]
      //数据准备完之后set
      option && myChart.setOption(option)


      pieOption.series[0].data = [
        { name: '第一季度', value: res.data[0] },
        { name: '第二季度', value: res.data[1] },
        { name: '第三季度', value: res.data[2] },
        { name: '第四季度', value: res.data[3] }
      ]
      pieOption && pieChart.setOption(pieOption)
    })


  }
}
</script>

<style scoped>

</style>