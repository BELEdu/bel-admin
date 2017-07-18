<template>
  <div class="analysis-data">
    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <Card class="analysis-data__card">
      <p slot="title">人员动态</p>
      <Tabs value="7" style="display: flex; justify-content: center;" @on-click="click">
        <Tab-pane label="最近7天" name="7"></Tab-pane>
        <Tab-pane label="最近15天" name="15"></Tab-pane>
        <Tab-pane label="最近30天" name="30"></Tab-pane>
      </Tabs>
      <div ref="chart1" style="width: 100%; height: 500px"></div>
    </Card>

    <Card class="analysis-data__card">
      <p slot="title">金额动态</p>
      <Tabs value="7" style="display: flex; justify-content: center;" @on-click="click">
        <Tab-pane label="最近7天" name="7"></Tab-pane>
        <Tab-pane label="最近15天" name="15"></Tab-pane>
        <Tab-pane label="最近30天" name="30"></Tab-pane>
      </Tabs>
      <div ref="chart2" style="width: 100%; height: 500px"></div>
    </Card>

    <Card class="analysis-data__card">
      <p slot="title">产品类型</p>
      <Tabs value="7" style="display: flex; justify-content: center;" @on-click="click">
        <Tab-pane label="最近7天" name="7"></Tab-pane>
        <Tab-pane label="最近15天" name="15"></Tab-pane>
        <Tab-pane label="最近30天" name="30"></Tab-pane>
      </Tabs>
      <div ref="chart3" style="width: 100%; height: 500px"></div>
    </Card>
  </div>
</template>

<script>
import echarts from 'echarts'
import addDays from 'date-fns/add_days'
import eachDay from 'date-fns/each_day'
import format from 'date-fns/format'

export default {
  name: 'app-analysis-graph',

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

      charts: [],
    }
  },

  methods: {
    click(range) {
      const today = new Date()
      const days = eachDay({
        start: today,
        end: addDays(today, range - 1),
      }).map(date => format(date, 'MM-DD'))

      this.charts[0].setOption({
        xAxis: {
          type: 'category',
          data: days,
        },
      })
    },
  },

  mounted() {
    this.charts[0] = echarts.init(this.$refs.chart1)
    this.charts[0].setOption(this.options)

    this.charts[1] = echarts.init(this.$refs.chart2)
    this.charts[1].setOption(this.options)

    this.charts[2] = echarts.init(this.$refs.chart3)
    this.charts[2].setOption(this.options3)
  },
}
</script>

<style lang="less">
.analysis-data__card {
  margin-top: 40px;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
