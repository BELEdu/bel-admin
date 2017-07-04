<template>
  <div class="smartanalyse">
    <!-- 上部 知识点分析报表 -->
    <Row class="smartanalyse__point-analyse" type="flex" :gutter="10">
      <!-- 科目列表 -->
      <Col span="4">
        <dl class="smartanalyse__course-list">
          <dt>科目列表</dt>
          <dd v-for="(grade, key) in courseList" :key="grade">
            <h4>{{key}}</h4>
            <ul>
              <li v-for="course in grade" :key="course">
                <a>{{course}}</a>
              </li>
            </ul>
          </dd>
        </dl>
      </Col>
      <!-- 全体学生易错知识点 -->
      <Col span="10">
        <div class="smartanalyse__echart-container" ref="error"></div>
      </Col>
      <!-- end 全体学生易错知识点 -->
      <!-- 全体学生得分知识点 -->
      <Col span="10">
        <div class="smartanalyse__echart-container" ref="score"></div>
      </Col>
      <!-- end 全体学生得分知识点 -->
    </Row>
    <!-- end 上部 知识点分析报表 -->
    <!-- 上部 搜索栏 -->
    <Form class="app-search-form">
      <form-item>
        <Input placeholder="请输入关键字"></Input>
      </form-item>
      <form-item>
        <Button type="primary">查询搜索</Button>
      </form-item>
    </Form>
    <!-- end 上部 搜索栏 -->
    <!-- 中部 列表title栏 -->
    <Row class="app-content-header">
      <h2 icon="">智能分析</h2>
    </Row>
    <!-- end 中部 列表title栏 -->
    <!-- 下部 列表展示-->
    <Table :data="buffer" :columns="colConfig"></Table>
    <!-- end 下部 列表展示 -->
    <!-- 底部 分页 -->
    <app-pager></app-pager>
    <!-- end 底部 分页 -->
  </div>
</template>

<script>
/**
 * 测试管理 - 智能分析
 * @author hjz
 * @version 2017-06-22
 * @description
 */
import echarts from 'echarts'
import { GLOBAL } from '@/store/mutationTypes'
// eslint-disable-next-line
import { colConfig, buffer, errorOption, scoreOption } from './modules/config'

export default {
  data() {
    return {
      // 知识点分析报表>课程列表
      courseList: {
        小学: ['语文', '数学', '英语', '政治', '地理', '化学', '物理'],
        初中: ['语文', '数学', '英语', '政治', '地理', '化学', '物理'],
        高中: ['语文', '数学', '英语', '政治', '地理', '化学', '物理'],
      },
      // 全员列表数据
      buffer,
      // 全员列表配置
      colConfig: colConfig(this),
    }
  },

  methods: {
    checkStu() {
      this.$router.push('/examination/smartanalyse/1')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  mounted() {
    const errorChart = echarts.init(this.$refs.error)
    errorChart.setOption(errorOption)

    const scoreChart = echarts.init(this.$refs.score)
    scoreChart.setOption(scoreOption)
  },
}
</script>

<style lang="less">
@import "~vars";
@import "~mixin";

@gutter-block: 8px;
@bd-radius: 4px;
@bd-base: 1px solid @border-color-base;

.smartanalyse {

  &__point-analyse {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px dashed @border-color-base;
  }

  &__course-list {
    border-radius: 5px;
    background-color: @bg-color;
    font-size: 14px;

    &>dt {
      padding: 10px;
      border-bottom: 1px solid @border-color-split;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }

    &>dd {
      padding: 10px 10px 0 10px;

      &>h4 {
        padding-top: 3px;
      }

      &>ul {
        padding: 0 5px 8px 30px;
        border-bottom: 1px solid @border-color-split;

        &>li {
          display: inline-block;
          margin-right: 10px;
        }
      }

      &:last-child {

        &>ul {
          border-bottom: 1px solid transparent;
        }
      }
    }
  }

  &__echart-container {
    padding: @gutter-block;
    height: 300px;
    border: @bd-base;
    border-radius: @bd-radius;
  }

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}

.ie {

  & .smartanalyse {

    &__point-analyse {
      .clearfix();

      & .ivu-col {
        float: left;
      }
    }

    &__course-list > dd {
      padding: 8px 10px 0 10px;
    }
  }
}
</style>
