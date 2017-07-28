<template>
  <div>
    <div class="analysis-header clearfix">
      <h2>区域选择</h2>
      <Select>
        <Option v-for="item in area" :value="item.id" :key="item.id">{{ item.display_name }}</Option>
      </Select>
    </div>
    <Table :columns="columns" :data="data" size="small"></Table>

    <chart-card title="课时情况" :chart="chart" @on-change="changeChart">
      <div ref="chart" style="width: 100%; height: 500px"></div>
    </chart-card>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>课时列表</h2>
      </Col>
    </Row>
    <Tabs type="card" class="analysis-curricula-tabs">
      <Tab-pane label="总课时"></Tab-pane>
      <Tab-pane label="一对一课时"></Tab-pane>
      <Tab-pane label="小班课时"></Tab-pane>
      <Tab-pane label="晚辅导课时"></Tab-pane>
    </Tabs>
    <Table :columns="columns2" :data="data2"></Table>

    <app-pager @on-change="goTo"></app-pager>
  </div>
</template>

<script>
import echarts from 'echarts'
import { GLOBAL } from '@/store/mutationTypes'
import { list } from '@/mixins'
import chart from './mixins/chart'

export default {
  name: 'app-analysis-lesson',

  mixins: [list, chart],

  data() {
    return {
      area: [],
      columns: [
        { title: '', key: 1, align: 'center' },
        { title: '授课总课时', key: 1, align: 'center' },
        { title: '一对一', key: 2, align: 'center' },
        { title: '小班', key: 3, align: 'center' },
        { title: '晚辅导', key: 4, align: 'center' },
      ],
      data: [
        { 1: '50', 2: '30', 3: '10', 4: '10' },
        { 1: '50', 2: '30', 3: '10', 4: '10' },
        { 1: '50', 2: '30', 3: '10', 4: '10' },
        { 1: '50', 2: '30', 3: '10', 4: '10' },
      ],
      chart: null,

      columns2: [
        { title: '产品名称', key: 0, align: 'center' },
        { title: '产品类型', key: 1, align: 'center' },
        { title: '产品子类型', key: 2, align: 'center' },
        { title: '学科', key: 3, align: 'center' },
        { title: '授课课时', key: 4, align: 'center' },
        { title: '占比', key: 5, align: 'center' },
        { title: '排名', key: 6, align: 'center' },
      ],

      data2: [
        {
          0: '个性化一对一教育',
          1: '一对一',
          2: '个性化一对一教育',
          3: '数学',
          4: '20',
          5: '5%',
          6: '2',
        },
        {
          0: '个性化一对一教育',
          1: '一对一',
          2: '个性化一对一教育',
          3: '数学',
          4: '20',
          5: '5%',
          6: '2',
        },
        {
          0: '个性化一对一教育',
          1: '一对一',
          2: '个性化一对一教育',
          3: '数学',
          4: '20',
          5: '5%',
          6: '2',
        },
      ],
    }
  },

  created() {
    this.$http.get('/school_list')
      .then((res) => {
        this.area = res
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },

  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['一对一', '小班', '晚辅导'],
      },
      xAxis: {
        type: 'category',
        data: ['06-04', '06-05', '06-06', '06-07', '06-08', '06-09', '06-10'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '一对一',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideTop',
            },
          },
          data: [320, 302, 301, 334, 390, 330, 320],
        },
        {
          name: '小班',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideTop',
            },
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '晚辅导',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideTop',
            },
          },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ],
    })
  },
}
</script>

<style lang="less">
.analysis-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 18px;
  }

  .ivu-select {
    width: 200px;
    margin-left: 20px;
  }
}

.analysis-curricula-tabs {
  .ivu-tabs-bar {
    margin-bottom: 0;
    border-bottom: 0;
  }
}

.ie {
  .analysis-header {
    h2 {
      float: left;
    }

    .ivu-select {
      float: left;
    }
  }
}
</style>
