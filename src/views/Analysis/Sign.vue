<template>
  <div class="analysis-data">
    <Tabs class="app-tabs" type="card">
      <Tab-pane label="图形报表" name="graph">
        <div class="graph-container">
          <Table class="app-table" :columns="columns" :data="data" border></Table>

          <chart-card title="课时情况" :chart="chartCapita" @on-change="changeChart">
            <div ref="chart1" style="width: 100%; height: 500px"></div>
          </chart-card>

          <chart-card title="课时情况" :chart="chartMoney" @on-change="changeChart">
            <div ref="chart2" style="width: 100%; height: 500px"></div>
          </chart-card>

          <chart-card title="课时情况" :chart="chartProduct" @on-change="changeChart">
            <div ref="chart3" style="width: 100%; height: 500px"></div>
          </chart-card>
        </div>
      </Tab-pane>

      <Tab-pane label="详细报表" name="detail">
        <div>详细</div>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import echarts from 'echarts'
import { GLOBAL } from '@/store/mutationTypes'
import chart from './mixins/chart'

export default {
  name: 'app-analysis-data',

  mixins: [chart],

  data() {
    return {
      columns: [
        { title: '', key: '1', align: 'center' },
        { title: '新签人数（人）', key: '2', align: 'center' },
        { title: '新签金额（元）', key: '3', align: 'center' },
        { title: '续费人员（人）', key: '4', align: 'center' },
        { title: '续费金额（元）', key: '5', align: 'center' },
        { title: '退费人员（人）', key: '6', align: 'center' },
        { title: '退费金额（元）', key: '7', align: 'center' },
        { title: '试听人员（人）', key: '8', align: 'center' },
        { title: '试听金额（元）', key: '9', align: 'center' },
      ],

      data: [
        {
          1: '昨天',
          2: 5,
          3: 5000,
          4: 1,
          5: 1000,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
        },
      ],

      options: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['退费人员', '续费人员', '新签人员'],
        },
        xAxis: [
          {
            type: 'category',
            data: ['06-04', '06-05', '06-06', '06-07', '06-08', '06-09', '06-10'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '退费人员',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 2.0, 4.9, 7.0, 2.4],
          },
          {
            name: '续费人员',
            type: 'bar',
            data: [2.5, 6.3, 1.3, 2.0, 4.9, 7.0, 2.4],
          },
          {
            name: '新签人员',
            type: 'bar',
            data: [7.0, 9.9, 8.0, 2.0, 4.9, 7.0, 2.4],
          },
        ],
      },

      options3: {
        tooltip: {
          trigger: 'item',
          formatter: ({ data, percent }) => `${data.name}<br>金额: ${data.value}元 (${percent}%)<br>签约单数：${data.count}`,
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['一对一', '晚辅导', '奥数小班', '作文小班', '光鱼大班'],
        },
        series: [
          {
            name: '金额',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '45%'],
            label: {
              normal: { position: 'inner' },
            },
            labelLine: {
              normal: { show: false },
            },
            data: [
              { value: 134, count: 141, name: '一对一' },
              { value: 34, count: 131, name: '晚辅导' },
              { value: 72, count: 11, name: '小班' },
            ],
          },
          {
            name: '金额',
            type: 'pie',
            selectedMode: 'single',
            radius: ['60%', '80%'],
            data: [
              { value: 134, count: 341, name: '一对一' },
              { value: 34, count: 1, name: '晚辅导' },
              { value: 12, count: 41, name: '奥数小班' },
              { value: 20, count: 11, name: '作文小班' },
              { value: 40, count: 14, name: '光鱼大班' },
            ],
          },
        ],
      },

      chartCapita: null,
      chartMoney: null,
      chartProduct: null,
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  mounted() {
    this.chartCapita = echarts.init(this.$refs.chart1)
    this.chartCapita.setOption(this.options)

    this.chartMoney = echarts.init(this.$refs.chart2)
    this.chartMoney.setOption(this.options)

    this.chartProduct = echarts.init(this.$refs.chart3)
    this.chartProduct.setOption(this.options3)
  },
}
</script>

<style lang="less">
// iview tabs布局在ie10下有bug
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .graph-container {
    width: calc(~"100% - 16px");
  }
}
</style>
