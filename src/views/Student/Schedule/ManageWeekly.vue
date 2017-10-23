<template>
  <div class="manage-weekly">
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em;">
          <Option v-for="key in likeKeys" :key="key.value" :value="key.value">{{ key.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Date-picker
          v-model="baseDate"
          placeholder="请选择日期"
        ></Date-picker>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[course_status]']">
          <Option value="">全部</Option>
          <Option value="0">待确认</Option>
          <Option value="1">待上课</Option>
          <Option value="2">已上课</Option>
          <Option value="3">已评价</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col :span="12">
        <h2><Icon type="ios-browsers"/> 教师课表</h2>
      </Col>
      <Col :span="12" style="text-align: right">
        待上课总数：{{ courseTip }}
      </Col>
    </Row>
    <div class="manage-weekly__content">
      <Row>
        <Col :span="2" class="weekly-prev">
          <Button type="dashed" size="small">
            <Icon type="chevron-left"></Icon> 上一周
          </Button>
        </Col>
        <Col :span="20">
          <Row>
            <Col :span="3" v-for="(item, index) in currentDaily" :key="item.random_id" class="weekly-item">
              <ul class="weekly-list">
                <li class="weekly-list__header">{{ item.value }}</li>
                <li class="weekly-list__course">
                  <div class="weekly-list__course-time" v-if="!index">
                    <div class="time-scale" v-for="(time, key) in timeScale" :key="time" :style="{top: `${key * 60 - 9}px`}">{{ time }}</div>
                  </div>
                  <!--TODO 判断时间定位时间刻度-->
                </li>
              </ul>
            </Col>
          </Row>
        </Col>
        <Col :span="2" class="weekly-next">
          <Button type="dashed" size="small">
            下一周 <Icon type="chevron-right"></Icon>
          </Button>
        </Col>
      </Row>
      <div class="manage-weekly__remark">
        <span class="end">已评价</span>
        <span class="confirm">待确认</span>
        <span class="notend">待上课</span>
        <span class="finish">已上课</span>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 教师课表-周课表
   * @author chenliangshan
   * @version 2017-10-19
   */

  import { mapState } from 'vuex'
  import { STUDENT } from '@/store/mutationTypes'
  import { list } from '@/mixins'
  import { startOfWeek, endOfWeek } from 'date-fns'
  import { formatDate } from '@/utils/date'
  import week from './mixins/week'

  export default {
    name: 'manage-weekly',

    mixins: [list, week],

    data() {
      return {
        likeKeys: [
          { label: '班级名称', value: 'classes_name' },
          { label: '排课专员', value: 'schedule_teacher_name' },
        ],

        likeKey: 'classes_name',

        query: {
          'equal[course_status]': null,
        },

        timeScale: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
      }
    },

    computed: {
      ...mapState({
        weeklyList: state => state.student.schedule.weekList,
        courseTip: state => state.student.schedule.tip,
        userId: state => state.user.id,
      }),
    },

    watch: {
      userId() {
        if (!this.$route.params.id) {
          this.getData(this.parse(this.$route.query), this.$route)
        }
      },
    },

    methods: {
      // 获取班级周课表数据
      getData(qs, to) {
        // 默认请求当天所属一周开始结束日期
        const query = to.query['between[course_date]'] ? qs : this.parse({ ...to.query,
          'between[course_date]': [
            formatDate(startOfWeek(new Date(), { weekStartsOn: 1 })),
            formatDate(endOfWeek(new Date(), { weekStartsOn: 1 })),
          ] })
        const cId = to.params.id || this.userId
        if (cId) {
          return this.$store.dispatch(STUDENT.SCHEDULE.WEEKLY_LIST, `${cId}${query}`)
        }
        return false
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "~vars.less";

  .manage-weekly {

    &__content {
      border: 1px solid @border-color-base;
      padding: 20px 0;

      &-header {
        padding: 0 0 10px 0;
      }
    }

    &__remark {
      padding-top: 20px;
      text-align: center;
      > span {
        display: inline-block;
        padding: 0 20px 0 30px;
        position: relative;

        &:before {
          content: '';
          display: block;
          width: 20px;
          height: 20px;
          position: absolute;
          left: 0;
        }

        &.end:before {
          background: @cancel-color;
        }

        &.confirm:before {
          background: @warning-color;
        }

        &.notend:before {
          background: @primary-color;
        }

        &.finish:before {
          background: @success-color;
        }
      }
    }

    .weekly-item {
      border-width: 1px 0 1px 1px;
      border-style: solid;
      border-color: @border-color-base;

      &:last-child {
        border-right-width: 1px;
      }

      &.ivu-col-span-3 {
        width: 14.28%;
      }
    }

    .weekly-prev, .weekly-next {
      text-align: center;
    }

    .weekly-list {
      text-align: center;

      &__header {
        border-left: 1px solid @border-color-base;
        border-bottom: 1px solid @border-color-base;
        margin-left: -1px;
        line-height: 30px;
      }

      &__course {
        height: calc(8 * 60px);
        position: relative;

        &-time {
          position: absolute;
          left: -40px;

          .time-scale {
            position: absolute;
            left: 0;
          }
        }
      }
    }
  }
</style>
