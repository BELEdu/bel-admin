<template>
  <div class="weekly-table">
    <div class="weekly-left">
      <div class="info">
        <template v-if="isClass">
          <p>
            <label>班级名称：</label>
            <span>{{currentDate.model.display_name}}</span>
          </p>
        </template>
        <template v-else>
          <p>
            <label>学员姓名：</label>
            <span>{{currentDate.model.display_name}}</span>
          </p>
        </template>

        <p>
          <label>上课年级：</label>
          <span>{{currentDate.current_grade_name}}</span>
        </p>
        <p>
          <label>产品名称：</label>
          <span>{{currentDate.product_name}}</span>
        </p>
        <p>
          <label>教师姓名：</label>
          <span>{{currentDate.teacher_name}}</span>
        </p>
        <p>
          <label>上课科目：</label>
          <span>{{currentDate.subject_item_name}}</span>
        </p>
        <p>
          <label>计划课时：</label>
          <span>{{currentDate.course_cost}}</span>
        </p>
        <p>
          <label>实际课时：</label>
          <span>{{currentDate.fact_cost}}</span>
        </p>
      </div>
      <div class="switch">
        <Row>
          <Col span="8">
          <span class="prev" @click="onPrevWeek">
            <Icon type="chevron-left"></Icon>
          </span>
          </Col>
          <Col span="8">
          <span>周数</span>
          </Col>
          <Col span="8">
            <span class="next" @click="onNextWeek">
              <Icon type="chevron-right"></Icon>
            </span>
          </Col>
        </Row>
      </div>
      <div class="remarks">
        <Row>
          <Col span="12">
          <span class="tag finish">已上课</span>
          </Col>
          <Col span="12">
          <span class="tag verify">已排定</span>
          </Col>
          <Col span="12">
          <span class="tag confirm">待确认</span>
          </Col>
          <Col span="12">
          <span class="tag cancel">已取消</span>
          </Col>
        </Row>
      </div>
    </div>
    <div class="weekly-right">
      <div class="app-table ivu-table-wrapper">
        <div class="ivu-table ivu-table-border">
          <div class="ivu-table-header">
            <ul class="weekly-ul-head clearfix">
              <li></li>
              <li v-for="thead in weeklyData.week">{{thead.date}}</li>
            </ul>
          </div>
          <div class="ivu-table-body" v-if="weeklyData.week">
            <ul class="weekly-ul clearfix">
              <template v-for="(list, key) in weeklyData.week">
                <li class="li-head" v-if="key == 0">
                  <div class="morning" :style="{height: morningHight}" v-if="weeklyData.count.morning>0">
                    <span>上午</span>
                  </div>
                  <div class="afternoon" :style="{height: afternoonHight}" v-if="weeklyData.count.afternoon>0">
                    <span>下午</span>
                  </div>
                  <div class="evening" :style="{height: eveningHight}" v-if="weeklyData.count.evening>0">
                    <span>晚上</span>
                  </div>
                </li>
                <li class="weekly-li">
                  <template v-for="(v, k) in weeklyData.count">
                    <div :class="k" :ref="k">
                      <div class="weekly-cost" v-for="(item,index) in list.course[k]" @click="courseDetails(item)" v-bind:class="[{ 'weekly-active': isActive==item.id }, weakStatus(item)]">
                        <div class="weekly-course">
                          <Row>
                            <Col span="24">
                            {{item.start_at}}-{{item.end_at}}</Col>
                          </Row>
                          <Row>
                            <Col span="12">
                            {{item.subject_item_name}}
                            </Col>
                            <Col span="12">
                            {{item.teacher_name}}</Col>
                          </Row>
                        </div>
                      </div>
                      <template v-if="v-list.course[k].length>0">
                        <div class="weekly-cost" v-for="item in (v-list.course[k].length)">
                          <span class="weekly-icon">+</span>
                        </div>
                      </template>
                    </div>
                  </template>
                </li>
              </template>
            </ul>
          </div>
          <div class="ivu-table-tip" v-show="!weeklyData.week || !weeklyData.week.length">
            <table cellspacing="0" cellpadding="0" border="0">
              <tbody>
              <tr>
                <td><span>暂无筛选结果</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 周课表
   */

  import { isEmpty } from 'lodash'

  export default{
    name: 'weekly-table',
    props: {
      data: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        isActive: '',
        morningHight: '',
        afternoonHight: '',
        eveningHight: '',
        currentDate: {
          model: {},
        },
        weeklyData: this.data,
      }
    },
    computed: {
      isClass() {
        const pathArry = this.$route.path.split('/')
        return pathArry[pathArry.length - 4] === 'teachercurricula' || pathArry[pathArry.length - 4] === 'class'
      },
    },
    methods: {
      courseDetails(item) {
        this.currentDate = item
        this.isActive = item.id
      },
      weakStatus(item) {
        let className
        switch (item.schedule_status) {
          case 0:
            className = 'confirm'
            break
          case 1:
            className = 'verify'
            break
          case 2:
            className = 'finish'
            break
          case 3:
            className = 'cancel'
            break
          default :
            className = ''
            break
        }
        return className
      },
      // 设置默认展示
      getCurrentDate() {
        const count = this.data.count
        this.data.count.morning = count.morning < 2 ? 2 : count.morning
        this.data.count.afternoon = count.afternoon < 2 ? 2 : count.afternoon
        this.data.count.evening = count.evening < 2 ? 2 : count.evening
        const data = this.data.week
          .map(item => item.course)
          .map(item => Object.keys(item).reduce((result, prop) =>
            [...result, ...item[prop]], []))
          .reduce((result, item) => [...result, ...item], [])
        if (data.length) {
          this.currentDate = { ...this.currentDate, ...data[0] }
          this.isActive = data[0].id
        }
      },
      // 设置标签高度
      getRef() {
        this.$nextTick(() => {
          this.morningHight = `${this.$refs.morning[0].offsetHeight}px`
          this.afternoonHight = `${this.$refs.afternoon[0].offsetHeight}px`
          this.eveningHight = `${this.$refs.evening[0].offsetHeight}px`
        })
      },
      // 切换上一周
      onPrevWeek() {
        if (!isEmpty(this.data)) {
          this.$emit('on-prev')
        }
      },
      // 切换下一周
      onNextWeek() {
        if (!isEmpty(this.data)) {
          this.$emit('on-next')
        }
      },
    },
    watch: {
      data: {
        handler(val) {
          this.weeklyData = val
          this.getCurrentDate()
          this.getRef()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less">
  @import "~vars";

  @finish: #66bae5;
  @verify: #e5bb79;
  @confirm: #e47fa9;
  @cancel: #ccc;

  .weekly-table {
    position: relative;
    min-height: 550px;
    padding-left: 260px;
    .weekly-left {
      width: 240px;
      position: absolute;
      left: 0;
      .info {
        padding: 10px 16px;
        border-radius: 5px;
        margin-bottom: 20px;
        border: 1px solid #d7dde4;
        font-size: 14px;
        p {
          position: relative;
          padding-left: 80px;
          label {
            width: 76px;
            position: absolute;
            left: 0;
            line-height: 30px;
            text-align: right;
          }
          span {
            display: inline-block;
            padding-top: 6px;
            line-height: 20px;
          }
        }

      }
      .switch {
        span {
          border: 1px solid #d7dde4;
          border-left: 0;
          display: block;
          line-height: 34px;
          text-align: center;
          font-size: 14px;
          &.prev {
            border-left: 1px solid #d7dde4;
          }
          &.prev, &.next {
            color: @primary-color;
            cursor: pointer;
          }
        }
      }
      .remarks {
        padding: 10px 16px;
        .tag {
          padding: 10px 0 10px 18px;
          display: block;
          position: relative;
          text-align: center;
          &::before {
            content: '';
            width: 20px;
            height: 16px;
            border-radius: 8px;
            position: absolute;
            left: 10px;
          }
          &.finish::before {
            background-color: #66bae5;
          }
          &.verify::before {
            background-color: #e5bb79;
          }
          &.confirm::before {
            background-color: #e47fa9;
          }
          &.cancel::before {
            background-color: #ccc;
          }
        }
      }
    }
    .weekly-right {
      .weekly-ul-head, .weekly-ul {
        li {
          display: inline-block;
          text-align: center;
          width: 13.71%;
          min-height: 40px;
          float: left;
          &:first-child {
            width: 4%;
          }
        }
      }
      .weekly-ul-head {
        border-bottom: 1px solid #d7dde4;
        li {
          font-weight: bold;
          line-height: 40px;
          border-left: 1px solid #d7dde4;
          &:first-child {
            border: 0;
          }
        }
      }
      .weekly-ul {
        li {
          border-left: 1px solid #d7dde4;
          &.li-head {
            border: 0;
            > div {
              border-bottom: 1px solid #d7dde4;
              position: relative;
              span {
                width: 20px;
                display: block;
                line-height: 38px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -38px;
                margin-left: -10px;
              }
            }
          }
          .weekly-cost {
            height: 58px;
            padding: 10px 0;
            border-bottom: 1px solid #d7dde4;
            box-sizing: border-box;
            &.finish {
              background-color: @finish;
            }
            &.verify {
              background-color: @verify;
            }
            &.confirm {
              background-color: @confirm;
            }
            &.cancel {
              background-color: @cancel;
            }
            .weekly-course {
              color: #fff;
            }
          }
        }
      }
      .ivu-table, .ivu-table-body {
        overflow: visible;
      }
      .ivu-table-cell {
        border: 1px solid transparent;
      }
      .weekly-icon {
        color: #ccc;
        line-height: 40px;
        font-size: 20px;
      }
      .weekly-active {
        position: relative;
        .weekly-course {
          width: 110%;
          position: absolute;
          padding: 14px 0;
          top: -6px;
          left: -5%;
          box-shadow: 0px 0 10px 2px rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.8);
          z-index: 10;
        }
        &.finish {
          .weekly-course {
            background-color: @finish;
          }
        }
        &.verify {
          .weekly-course {
            background-color: @verify;
          }
        }
        &.confirm {
          .weekly-course {
            background-color: @confirm;
          }
        }
        &.cancel {
          .weekly-course{
            background-color: @cancel;
          }
        }
      }
    }
  }
</style>
