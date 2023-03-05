<template>
  <div id="radar" ref="radar" class="radar-echart" />
</template>
<script>
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])

export default {
// 页面渲染完毕
  mounted() {
    var chartDom = document.querySelector('#radar') // 此处还是选择id,否则会出错
    var myChart = echarts.init(chartDom)
    var option

    option = {
      title: {
        text: ''
      },
      legend: {
        data: ['张三', '李四']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: '张三 vs 李四',
          type: 'radar',
          data: [
            {
              value: [40, 70, 100, 80, 100, 60],
              name: '张三'
            },
            {
              value: [85, 90, 80, 50, 50, 70],
              name: '李四'
            }
          ]
        }
      ]
    }
    option && myChart.setOption(option)
    // 在mounted中绑定resize
    window.addEventListener('resize', function() {
      myChart.resize()
    })
  },
  beforeDestroy() {
    // 在beforeDestroy中解绑
    window.removeEventListener('resize')
  }
}
</script>
<style scoped>
.radar-echart {
	display: flex;
	justify-content: center;
  width: 100%;
  height: 400px;

}
</style>
