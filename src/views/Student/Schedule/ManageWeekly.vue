<template>
  <div class="manage-weekly">
    <App-table-form @on-submit="search">
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
        <Select v-model="query['equal[course_status]']" placeholder="课表状态" style="width:6em;">
          <Option value="">全部</Option>
          <Option v-for="item in scheduleStatus" :key="item.value" :value="item.value">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
    </App-table-form>
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col :span="12">
        <h2><Icon type="ios-calendar"/> {{`${!this.$route.params.id ? '我的课表' : currentTip.realname + '的课表'}`}}</h2>
      </Col>
      <Col :span="12" style="text-align: right">
        待上课总数：{{ courseTip }}
      </Col>
    </Row>
    <!--周课表-->
    <div class="manage-weekly__content">
      <Row>
        <Col :span="2" class="weekly-prev">
          <Button type="dashed" size="small" @click="getPrevWeek">
            <Icon type="chevron-left"></Icon> 上一周
          </Button>
        </Col>
        <Col :span="20">
          <Row>
            <Col :span="3" v-for="(item, index) in currentDaily" :key="item.random_id" class="weekly-item">
              <ul class="weekly-list">
                <li class="weekly-list__header">{{ item.value }}</li>
                <li class="weekly-list__course">
                  <!--时间刻度及刻线-->
                  <div class="weekly-list__course-time">
                    <div class="time-scale" v-if="!index" v-for="(time, key) in timeScale" :key="time" :style="{top: `${key * 60 - 9}px`}">{{ time }}</div>
                    <div class="time-line" v-if="key" v-for="(time, key) in timeScale" :key="time" :style="{top: `${key * 60}px`}"></div>
                  </div>
                  <!--课表模块-->
                  <Tooltip
                    v-for="list in weeklyList[item.value]"
                    :key="list.id"
                    :style="{
                      top: `${courseTop(list.schedule_range)}`,
                    }"
                    :placement="index > 4 ? 'left-start' : parseInt(courseTop(list.schedule_range), 10) >= 360 ? 'top' : 'right-start'"
                    :delay="500"
                  >
                    <!--课表标题-->
                    <div
                      class="weekly-list__course-list"
                      :class="courseStatus(list.course_status)"
                      :style="{
                        height: `${(list.course_fact || list.course_num || 1) * 30}px`,
                      }"
                    >
                      <div class="weekly-list__course-list-content">
                        {{`${list.classes_name}【第${list.sort_value}节课】`}}
                      </div>
                    </div>
                    <!--课表详细内容-->
                    <div slot="content">
                      <p><span class="text-right">上课时间：</span>{{list.schedule_range}}</p>
                      <div v-if="list.chapter_name"><span class="text-right" style="display: inline-block;min-width: 5em">内容：</span><p style="padding-left: 5em;" v-html="list.chapter_name"></p></div>
                      <p><span class="text-right">计划课时：</span>{{list.course_num}}</p>
                      <p v-if="list.course_fact"><span class="text-right">实际课时：</span>{{list.course_fact}}</p>
                      <p><span class="text-right">上课状态：</span>{{list.course_status_name}}</p>
                      <p><span class="text-right">排课专员：</span>{{list.schedule_teacher_name}}</p>
                      <!--操作-->
                      <p>
                        <span class="text-right">操作：</span>
                        <Button size="small" v-if="list.schedule_operation.confirm" type="primary" @click.native="handlerModal(list)">确认排课</Button>
                        <Button size="small" v-else-if="list.schedule_operation.comment" type="primary" @click.native="handlerModal(list)">评价</Button>
                        <Button size="small" v-else-if="list.schedule_operation.showComment" type="primary" @click.native="handlerModal(list)">查看评价</Button>
                        <template v-else-if="list.schedule_operation.finish || list.schedule_operation.cancel">
                          <Button size="small" v-if="list.schedule_operation.finish" type="primary" @click.native="handlerModal(list)">确认上课</Button>
                          <Button size="small" v-if="list.schedule_operation.cancel" type="primary" @click.native="handlerModal(list, true)">撤销</Button>
                        </template>
                        <span v-else>-</span>
                        <Button size="small" v-if="list.schedule_operation.draft" type="primary" @click.native="handlerNotesModal(list)">笔记</Button>
                      </p>
                    </div>
                  </Tooltip>
                </li>
              </ul>
            </Col>
          </Row>
        </Col>
        <Col :span="2" class="weekly-next">
          <Button type="dashed" size="small" @click="getNextWeek">
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

    <!--操作弹窗-->
    <course-modal
      :visible.sync="dialog.visible"
      :is-repeal="isRepeal"
      v-if="isDialogRender"
      @on-update="fetchData"
    ></course-modal>

    <!--查看学员笔记-->
    <notes-modal :visible.sync="dialog.notes"></notes-modal>
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
  import { startOfWeek, endOfWeek, differenceInHours } from 'date-fns'
  import { formatDate, setTime } from '@/utils/date'
  import week from './mixins/week'
  import modal from './mixins/modal'

  export default {
    name: 'manage-weekly',

    mixins: [list, week, modal],

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
        scheduleStatus: state => state.dicts.course_status,
        weeklyList: state => state.student.schedule.weekList,
        courseTip: state => state.student.schedule.tip.ready_courses,
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

        return cId && this.$store.dispatch(STUDENT.SCHEDULE.WEEKLY_LIST, `${cId}${query}`)
          .catch(({ message }) => {
            this.$Notice.error({
              title: message,
            })
          })
      },

      // 当前上课状态
      courseStatus(status) {
        return {
          // 已评价
          end: status === 3,
          // 待确认
          confirm: status === 0,
          // 待上课
          notend: status === 1,
          // 已上课
          finish: status === 2,
        }
      },

      // 课程时间刻度位置
      courseTop(rangTime) {
        // 与最小时间比较08:00
        const dis = differenceInHours(setTime(rangTime.split('-')[0]), setTime('08:00'))
        return `${(dis >= 0 ? dis : 0) * 30}px`
      },
    },
  }
</script>

<style lang="less">
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
      border-width: 1px 1px 1px 0;
      border-style: solid;
      border-color: @border-color-base;

      &:first-child {
        border-left-width: 1px;
      }

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

      &, p {
        margin: 0;
        padding: 0;
      }

      &__header {
        border-left: 1px solid @border-color-base;
        border-bottom: 1px solid @border-color-base;
        margin-left: -1px;
        line-height: 30px;
      }

      &__course {
        height: calc(8 * 60px);
        max-height: calc(8 * 60px);
        position: relative;

        &-time {
          width: 100%;
          position: absolute;
          left: 0;

          .time-line {
            width: 100%;
            border-bottom: 1px solid @border-color-base;
            position: absolute;

            &:last-child {
              border: 0;
            }
          }

          .time-scale {
            position: absolute;
            left: -40px;
          }
        }

        &-list {
          max-height: calc(8 * 60px);
          color: #fff;
          border-radius: 4px 4px 0 0;
          background-color: @cancel-color;
          margin-bottom: 1px;
          border-bottom: 4px solid rgba(0, 0, 0, 0.2);

          &.end {
            background: @cancel-color;
          }

          &.confirm {
            background: @warning-color;
          }

          &.notend {
            background: @primary-color;
          }

          &.finish {
            background: @success-color;
          }

          &-content {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
          }
        }

        .ivu-tooltip {
          width: 100%;
          position: absolute;
          left: 0;

          .ivu-tooltip-rel {
            width: 100%;
          }

          .ivu-tooltip-inner {
            max-width: inherit;
          }
        }
      }
    }
  }
</style>
