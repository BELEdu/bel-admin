<template>
  <Tabs class="studentanalyse app-tabs" value="name1" type="card">
    <Tab-pane label="英语" name="name1">
      <!-- 薄弱知识点 -->
      <Row :gutter="16" class="studentanalyse__row">
        <Col span="12">
        <card>
          <div style="height: 467px;" ref="weakness"></div>
        </card>
        </Col>
        <Col span="12">
        <card class="studentanalyse__table">
          <Table :data="buffer.pie" :columns="colConfig.pie" size="small"></Table>
          <Page class="studentanalyse__pager" :total="100"></Page>
        </card>
        </Col>
      </Row>
      <!-- 薄弱知识点 end -->
      <!-- 掌握知识点 -->
      <Row :gutter="16" class="studentanalyse__row">
        <Col span="12">
        <card>
          <div style="height: 467px;" ref="grasp"></div>
        </card>
        </Col>
        <Col span="12">
        <card class="studentanalyse__table">
          <Table :data="buffer.pie" :columns="colConfig.pie" size="small"></Table>
          <Page class="studentanalyse__pager" :total="100"></Page>
        </card>
        </Col>
      </Row>
      <!-- 掌握知识点 end -->
      <!-- 难度分析 -->
      <Row :gutter="16" class="studentanalyse__row">
        <Col span="12">
        <card>
          <div style="height: 467px;" ref="difficulty"></div>
        </card>
        </Col>
        <Col span="12">
        <card class="studentanalyse__table">
          <Table :data="buffer.line" :columns="colConfig.line" size="small"></Table>
          <Page class="studentanalyse__pager" :total="100"></Page>
        </card>
        </Col>
      </Row>
      <!-- 难度分析 end -->
      <!-- 历史成绩 -->
      <Row :gutter="16" class="studentanalyse__row">
        <Col span="12">
        <card>
          <div style="height: 467px;" ref="history"></div>
        </card>
        </Col>
        <Col span="12">
        <card class="studentanalyse__table">
          <Table :data="buffer.line" :columns="colConfig.line" size="small"></Table>
          <Page class="studentanalyse__pager" :total="100"></Page>
        </card>
        </Col>
      </Row>
      <!-- 历史成绩 end -->
    </Tab-pane>
    <Tab-pane label="数学" name="name2">内容二</Tab-pane>
    <Tab-pane label="语文" name="name3">内容三</Tab-pane>
  </Tabs>
</template>

<script>
/**
 * 测试管理 - 智能分析 - 分析详情
 * @author hjz
 * @version 2017-06-23
 */
import echarts from 'echarts'
import { GLOBAL } from '@/store/mutationTypes'
import { colConfig, buffer, pieOption, lineOption } from './modules/detailConfig'

export default {

  data() {
    return {
      buffer,
      colConfig: colConfig(this),
    }
  },

  methods: {
    referTopic(...args) {
      window.console.log('去看看')
      window.console.log(args)
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  mounted() {
    const weaknessChart = echarts.init(this.$refs.weakness)
    weaknessChart.setOption(pieOption)

    const graspChart = echarts.init(this.$refs.grasp)
    graspChart.setOption(pieOption)

    const difficultyChart = echarts.init(this.$refs.difficulty)
    difficultyChart.setOption(lineOption)

    const historyChart = echarts.init(this.$refs.history)
    historyChart.setOption(lineOption)

    function refresh() {
      weaknessChart.resize({
        width: 'auto',
      })
      graspChart.resize({
        width: 'auto',
      })
      difficultyChart.resize({
        width: 'auto',
      })
      historyChart.resize({
        width: 'auto',
      })
    }
    window.onresize = refresh
  },
}
</script>

<style lang="less">
.studentanalyse__row {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.studentanalyse__table {

  & .ivu-card-body {
    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }
}

.studentanalyse__pager {
  float: right;
  margin-top: 10px;

  &>li {
    height: 24px;
    width: 24px;
    min-width: 24px;
    line-height: 24px;
    text-align: center;

    &>a {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
