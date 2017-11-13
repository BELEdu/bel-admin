<template>
  <div class="list-coach">
    <Row class="list-coach__header">
      <Col :span="8">
        <Button type="dashed" icon="refresh" @click="updateList" :disabled="!coachList.items.length">刷新排序</Button>
      </Col>
      <Col :span="8" class="list-coach__header-add">
        <template v-if="courseRemain <= 0">
          <Poptip trigger="hover" placement="bottom" class="poptip-warning">
            <Button type="dashed" icon="plus-round" :disabled="this.courseRemain <= 0">新增计划</Button>
            <div slot="content"><Icon type="android-alert"></Icon> 无可用计划课时，无法新增计划</div>
          </Poptip>
        </template>
        <Button v-else type="dashed" icon="plus-round" @click="addList">新增计划</Button>
      </Col>
      <Col :span="7" class="list-coach__header-course-remain">
        剩余可用计划课时：{{ courseRemain }}
      </Col>
    </Row>
    <Form class="list-coach__form" :model="coachList" ref="coachForm">
      <div
        class="list-coach__form-item"
        v-for="(item, index) in coachList.items"
        :key="item.random_id || item.id"
        :data-index="coachList.items.length - index"
      >
        <Row :gutter="10">
          <Col :span="4">
          <form-item :prop="'items.' + index + '.course_num'" :rules="coachRules['course_num']">
            <Row>
              <Col :span="16" style="padding: 0 1px;">
              <Select
                v-model="item.course_num"
                transfer
                :placement="selectPlaceType(index)"
                :disabled="!item.random_id && !item.operation.update"
              >
                <Option
                  v-for="(period, key) in courseNum"
                  :key="key"
                  :value="period"
                  :disabled="period !== item.course_num && period > (item.course_num + courseRemain)"
                >{{ period }}</Option>
              </Select>
              </Col>
              <Col :span="8" style="text-align: right;padding: 0 1px;line-height: 30px;">课时</Col>
            </Row>
          </form-item>
          </Col>
          <Col :span="5">
            <form-item :prop="'items.' + index + '.course_date'" :rules="coachRules['course_date']">
              <date-picker
                :value="item.course_date"
                :format="format"
                @on-change="(val) => item.course_date = val"
                @on-clear="() => item.course_date = null"
                :options="dateOptions"
                placeholder="请选择开始日期"
                transfer
                :placement="selectPlaceType(index)"
                :disabled="!item.random_id && !item.operation.update"
              ></date-picker>
            </form-item>
          </Col>
          <Col :span="5">
            <form-item :prop="'items.' + index + '.course_time'" :rules="coachRules['course_time']">
              <TimePicker
                :value="item.course_time"
                type="timerange"
                format="HH:mm"
                @on-change="(val) => item.course_time = val[0] ? val : []"
                @on-clear="() => item.course_time = []"
                placeholder="请选择时间"
                transfer
                :placement="selectPlaceType(index)"
                :disabled="!item.random_id && !item.operation.update"
              ></TimePicker>
            </form-item>
          </Col>
          <Col :span="9">
            <form-item>
              <template v-if="isNightCoach">
                <Select v-model="item.teacher_id" multiple placeholder="请选择教师" transfer :placement="selectPlaceType(index)" :disabled="!item.random_id && !item.operation.update">
                  <Option v-for="(teacher, key) in teacherList" :key="key" :value="teacher.id">{{ teacher.realname }}</Option>
                </Select>
              </template>
              <template v-else>
                <Select v-model="item.teacher_id[0]" placeholder="请选择教师" transfer :placement="selectPlaceType(index)" :disabled="!item.random_id && !item.operation.update">
                  <Option v-for="(teacher, key) in teacherList" :key="key" :value="teacher.id">{{ teacher.realname }}</Option>
                </Select>
              </template>
            </form-item>
          </Col>
          <Col :span="1" class="list-coach__close" v-if="item.random_id || item.operation.destroy">
            <Button type="text" icon="close" @click="closeList(index)"></Button>
          </Col>
        </Row>
        <Row :gutter="10" v-if="!isNightCoach" style="padding-top: 10px">
          <Col :span="23">
          <form-item :prop="'items.' + index + '.chapter'" :rules="coachRules['chapter']">
            <app-tree-select :data="currentChapter" v-model="item.chapter" multiple :disabled="!item.random_id && !item.operation.update"></app-tree-select>
          </form-item>
          </Col>
        </Row>
      </div>
    </Form>
  </div>

</template>

<script>
  /**
   * 计划列表-组件
   * @author chenliangshan
   * @version 2017-10-15
   */

  import { mapState } from 'vuex'
  import { formatDate, parseDate } from '@/utils/date'

  export default {
    name: 'list-coach',

    data() {
      return {
        coachList: {
          items: [],
        },

        coachRules: {
          course_num: [
            { required: true, type: 'number', message: '请选择课时', trigger: 'change' },
          ],

          course_date: [
            { required: true, message: '请选择开始日期', trigger: 'change' },
          ],

          course_time: [
            { required: true, type: 'array', message: '请选择时间', trigger: 'change' },
          ],

          teacher_id: [
            { required: true, type: 'array', message: '请选择教师', trigger: 'change' },
          ],

          chapter: [
            { required: true, type: 'array', message: '请选择章节', trigger: 'change' },
          ],
        },

        format: 'yyyy-MM-dd',

      }
    },

    computed: {
      ...mapState({
        currentItemData: state => state.student.plan.currentItem.Data,
        isNightCoach: state => state.student.plan.currentItem.isNightCoach,
        editList: state => state.student.plan.currentItem.courseList,
        editType: state => state.student.plan.currentItem.type,
        currentChapter: state => state.student.plan.currentItem.chapter,
        courseNum: state => state.student.plan.courseNum,
        currentCourseRemain: state => state.student.plan.currentItem.courseRemain,
        teacherList: state => state.student.plan.currentItem.teacher,
      }),

      courseRemain() {
        let courseRemain = this.currentCourseRemain
        let listCost = 0
        if (this.editList.length && this.editType === 'edit') {
          this.editList.forEach((item) => {
            // 累加已上课的计划课时
            if (item.course_status === 2 || item.course_status === 3) {
              courseRemain += item.course_num
            }
          })
        }
        if (courseRemain > 0 && this.coachList.items.length) {
          listCost = this.coachList.items.map(item => item.course_num)
            .reduce((preValue, curvalue) => preValue + curvalue)
          const num = courseRemain - listCost
          return num > 0 ? num : 0
        }
        return courseRemain
      },

      dateOptions() {
        const self = this
        return {
          disabledDate(date) {
            let status = true
            if (self.editType === 'edit') {
              // 编辑时，不能添加小于最后计划的日期
              status = date.valueOf() < new Date(self.editList[0].course_date).valueOf()
            }

            return date && date.valueOf() < Date.now() - 86400000 && status
          },
        }
      },

    },

    watch: {
      editList: {
        handler() {
          this.getCourseList(this.editList)
        },
        deep: true,
      },
    },

    methods: {
      random() {
        return `${Math.random().toString(36).substring(3, 8)}`
      },

      handleAdd() {
        if (this.courseRemain > 0) {
          this.coachList.items = [{
            random_id: this.random(),
            sort_value: 1, // 课顺序
            course_num: this.courseRemain < 2 ? this.courseRemain : 2, // 课时
            course_date: null, // 课日期
            course_time: [], // 课时间
            course_status: 0, // 默认课时状态
            teacher_id: [], // 教师id
            chapter: [], // 章节数组id
          }, ...this.updateList()]
        }
      },

      addList() {
        if (this.coachList.items.length) {
          this.$refs.coachForm.validate((valid) => {
            if (valid) {
              if (this.courseRemain) {
                this.handleAdd()
                this.$emit('add-list')
              } else {
                this.$Message.warning('无可用课时添加！')
              }
            }
          })
        } else {
          this.handleAdd()
          this.$emit('add-list')
        }
      },

      closeList(index) {
        this.coachList.items = this.coachList.items.filter((item, key) => index !== key)
        this.$emit('close-list', this.coachList.items)
      },

      updateList() {
        if (this.coachList.items.length) {
          const parseTime = date => parseDate(date, this.format).getTime()
          return this.coachList.items.sort((preVal, nextVal) => parseTime(nextVal.course_date)
            - parseTime(preVal.course_date))
        }
        return []
      },

      // 获取计划详情
      getCourseList(editList) {
        if (editList.length) {
          this.coachList.items = editList.map(({ chapter, teacher_id, operation, ...item }) => ({
            ...item,
            chapter: [...chapter],
            teacher_id: [...teacher_id],
            operation: { ...operation },
            course_time: [formatDate(new Date(item.course_start), 'HH:mm'), formatDate(new Date(item.course_end), 'HH:mm')],
          }))
        } else {
          this.coachList.items = []
          this.handleAdd()
        }
      },

      submit() {
        const list = this.coachList.items
        const len = list.length
        if (len) {
          this.$refs.coachForm.validate((valid) => {
            if (valid) {
              const itemList = this.updateList()
              this.$emit('on-success', itemList.map(({ course_date, random_id, course_time, ...arg }, index) => ({
                ...arg,
                course_date: formatDate(new Date(course_date), this.format),
                course_start: course_time[0],
                course_end: course_time[1],
                sort_value: len - index,
              })))
            } else {
              this.$emit('on-error')
            }
          })
        } else {
          this.$Message.error('计划列表不能为空')
          this.$emit('on-error')
        }
      },

      // 计算select位置设置展开方向
      selectPlaceType(index) {
        return this.coachList.items.length - index < 5 && this.coachList.items.length > 10 ? 'top' : 'bottom'
      },

    },

    mounted() {
      this.$on('on-submit', () => {
        this.submit()
      })

      // 重置
      this.$on('on-reset', () => {
        this.coachList.items = []
      })

      this.getCourseList(this.editList)
    },

  }
</script>

<style lang="less" scoped>
  @import "~vars.less";

  .list-coach {
    position: relative;

    &__header {
      padding-bottom: 10px;

      &-course-remain {
        text-align: right;
        line-height: 30px;
      }

      &-add {
        text-align: center;
      }
    }

    &__close {
      padding: 0 !important;

      .ivu-btn {
        color: @error-color;
        padding: 8px 10px;
        margin-left: -10px;
      }
    }

    &__form {
      &-item {
        position: relative;
        padding: 0 0 10px 40px;

        &:before {
          content: attr(data-index);
          display: block;
          width: 26px;
          height: 26px;
          line-height: 24px;
          margin-right: 8px;
          text-align: center;
          border: 1px solid @primary-color;
          border-radius: 50%;
          font-size: 14px;
          color: #fff;
          background-color: @primary-color;
          position: absolute;
          left: 0;
          top: 4px;
        }

        .ivu-form-item {
          margin-bottom: 10px;
        }
      }
    }

  }
</style>
