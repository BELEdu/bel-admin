<template>
  <div class="add-coach-night">
    <Row class="add-coach-night__header">
      <Col style="text-align: right">
        剩余可用计划课时：{{ courseRemain }}
      </Col>
    </Row>
    <Alert type="warning" show-icon v-if="courseRemain <= 0">无可用计划课时，无法编辑添加计划</Alert>
    <Form class="add-coach-night__form" ref="coachNight" :model="form" :rules="formRules" :label-width="100">
      <form-item prop="date_range" label="起止日期：">
        <date-picker
          type="daterange"
          :value="form.date_range"
          @on-change="(val) => form.date_range = val[0] ? val : []"
          :disabled="courseRemain <= 0"
          :options="dateOptions"
          placeholder="请选择起止日期"
        ></date-picker>
      </form-item>
      <form-item prop="course_time" label="上课时段：">
        <time-picker
          type="timerange"
          v-model="form.course_time"
          @on-clear="() => form.course_time = []"
          format="HH:mm"
          :disabled="courseRemain <= 0"
          placeholder="请选择上课时段"
        ></time-picker>
      </form-item>
      <form-item prop="course_num" label="每节课时：">
        <Select v-model="form.course_num" placeholder="请选择每节课时" style="width: 60px" :disabled="courseRemain <= 0">
          <Option v-for="period in courseNum" :key="period" :value="period" :disabled="period > courseRemain">{{ period }}</Option>
        </Select>
      </form-item>
      <form-item prop="teacher_id" label="授课教师：">
        <Select v-model="form.teacher_id" multiple placeholder="请选择授课教师" :disabled="courseRemain <= 0">
          <Option v-for="(item, index) in teacherList" :key="index" :value="item.id">{{ item.realname }}</Option>
        </Select>
      </form-item>
      <form-item label="排除日期：">
        <CheckboxGroup v-model="form.excludeWeek" :disabled="courseRemain <= 0">
          <Checkbox :label="1" :disabled="courseRemain <= 0">每周一</Checkbox>
          <Checkbox :label="2" :disabled="courseRemain <= 0">每周二</Checkbox>
          <Checkbox :label="3" :disabled="courseRemain <= 0">每周三</Checkbox>
          <Checkbox :label="4" :disabled="courseRemain <= 0">每周四</Checkbox>
          <Checkbox :label="5" :disabled="courseRemain <= 0">每周五</Checkbox>
          <Checkbox :label="6" :disabled="courseRemain <= 0">每周六</Checkbox>
          <Checkbox :label="0" :disabled="courseRemain <= 0">每周日</Checkbox>
        </CheckboxGroup>
        <Form ref="addDateForm" :model="addForm" class="add-date-form" inline>
          <form-item
            class="add-date-form__item"
            v-for="(item, index) in addForm.excludeDate"
            :key="item.random_id"
            :prop="'excludeDate.' + index + '.value'"
            :rules="{required: true, type: 'array', message: '请选择起止日期'}"
          >
            <date-picker
              type="daterange"
              :value="item.value"
              :options="addOptions"
              @on-change="(val) => item.value = val[0] ? val : []"
              placeholder="请选择起止日期"
            ></date-picker>
            <Button class="add-date-form__item-close" type="text" icon="close" @click="closeAddForm(item)"></Button>
          </form-item>
        </Form>

        <Button type="dashed" icon="plus-round" @click="handlerAddDate" :disabled="this.courseRemain <= 0">添加日期</Button>
      </form-item>
    </Form>
  </div>
</template>

<script>
  /**
   * 学习计划-添加计划（晚辅导）
   * @author chenliangshan
   * @version 2017-10-17
   */

  import { mapState } from 'vuex'
  import { STUDENT } from '@/store/mutationTypes'
  import { formatDate, parseDate } from '@/utils/date'
  import { broadcast } from '@/mixins'
  import addDays from 'date-fns/add_days'
  import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
  import getDay from 'date-fns/get_day'

  export default {
    name: 'add-coach-night',

    mixins: [broadcast],

    data() {
      return {
        format: 'yyyy-MM-dd',

        form: {
          date_range: [],
          course_time: [],
          course_num: 2,
          teacher_id: [],
          excludeWeek: [],
        },

        addForm: {
          excludeDate: [],
        },

        formRules: {
          date_range: [
            { required: true, type: 'array', message: '请选择起止日期' },
          ],

          course_time: [
            { required: true, type: 'array', message: '请选择上课时段' },
          ],

          course_num: [
            { required: true, type: 'number', message: '请选择每节课时' },
          ],

          teacher_id: [
            { required: true, type: 'array', message: '请选择授课教师' },
          ],
        },

        // 过滤起止日期限制大于等于今天
        dateOptions: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000
          },
        },

        // 过滤起止日期范围
        addOptions: {
          disabledDate: (date) => {
            const [startDate = new Date(), endDate = new Date()] = this.form.date_range
            return (date && date.valueOf() < Date.now() - 86400000) ||
              differenceInCalendarDays(date, startDate) < 0 ||
              differenceInCalendarDays(date, endDate) > 0 ||
              this.isDay(date)
          },
        },
      }
    },

    computed: {
      ...mapState({
        currentItemData: state => state.student.plan.currentItem.data,
        teacherList: state => state.student.plan.currentItem.teacher,
        courseNum: state => state.student.plan.courseNum,
        courseRemain: state => state.student.plan.currentItem.courseRemain,
      }),

      dateRangeNum() {
        const [startDate = new Date(), endDate = new Date()] = this.form.date_range
        return this.getRangeNum(startDate, endDate)
      },

      addFormDateRange() {
        // eslint-disable-next-line
        let date = []
        if (this.addForm.excludeDate.length) {
          this.addForm.excludeDate.forEach(({ value }) => {
            if (value[0]) {
              const num = this.getRangeNum(value[0], value[1])
              const arr = Array(num).fill(null)
              date.push(value[0])
              arr.forEach((val, key) =>
                date.push(formatDate(addDays(new Date(value[0]), key + 1), this.format)))
            }
          })
          return Array.from(new Set([...date]))
        }
        return date
      },

      formDateRange() {
        const [startDate] = this.form.date_range
        // eslint-disable-next-line
        let date = []
        if (startDate) {
          const num = Array(this.dateRangeNum).fill(null)
          num.forEach((val, key) => {
            const day = addDays(new Date(startDate), key + 1)
            if (!this.isDay(day)) {
              date.push(formatDate(day, 'yyyy-MM-dd'))
            }
          })
          date = !this.isDay(startDate) ? [startDate, ...date] : [...date]
          return date.filter(item => !this.addFormDateRange.includes(item))
            .sort((preVal, nextVal) => this.parseTime(preVal) - this.parseTime(nextVal))
        }
        return date
      },
    },

    methods: {
      // 转换时间戳
      parseTime(date) {
        return parseDate(date, this.format).getTime()
      },

      // 获取天数
      getRangeNum(start, end) {
        return differenceInCalendarDays(end, start)
      },

      isDay(date) {
        return this.form.excludeWeek.includes(getDay(new Date(date)))
      },

      random() {
        return `${Math.random().toString(36).substring(3, 8)}`
      },

      closeAddForm(item) {
        this.addForm.excludeDate = this.addForm.excludeDate
          .filter(({ random_id }) => item.random_id !== random_id)
      },

      onSubmit() {
        this.$refs.coachNight.validate((valid) => {
          if (valid) {
            if (this.courseRemain <= 0) {
              this.$Message.warning('无可用课时无法添加计划')
              this.$emit('on-error')
            } else {
              const { course_num, teacher_id, course_time } = this.form
              const formLen = this.formDateRange.length
              let coachListNum = Math.floor(this.courseRemain / course_num)
              coachListNum = coachListNum > formLen ? formLen : coachListNum
              const mod = this.courseRemain % course_num
              const coachNumArr = Array(coachListNum).fill(course_num)
              const coachArr = mod > 0 ? [...coachNumArr, mod] : [...coachNumArr]
              const itemDate = coachArr.map((val, key) => ({
                random_id: this.random(),
                sort_value: key + 1,
                course_num: val,
                course_date: this.formDateRange[key],
                course_start: course_time[0],
                course_end: course_time[1],
                course_status: 0,
                chapter: [],
                course_time: [
                  formatDate(course_time[0], 'HH:mm'),
                  formatDate(course_time[1], 'HH:mm')],
                teacher_id,
              })).sort((preVal, nextVal) =>
                this.parseTime(nextVal.course_date) - this.parseTime(preVal.course_date))

              this.$store.commit(STUDENT.PLAN.CURRENT_ITEM_COURSELIST, itemDate)
              this.$emit('on-success')
            }
          } else {
            this.$emit('on-error')
          }
        })
      },

      // 添加日期
      addDate() {
        this.addForm.excludeDate = [
          ...this.addForm.excludeDate,
          {
            random_id: this.random(),
            value: [],
          },
        ]
      },

      // 操作添加日期
      handlerAddDate() {
        if (this.addForm.excludeDate.length) {
          this.$refs.addDateForm.validate((valid) => {
            if (valid) {
              this.addDate()
            }
          })
        } else {
          this.addDate()
        }
      },
    },

    mounted() {
      // 下一步
      this.$on('on-submit', (data) => {
        this.onSubmit()

        this.broadcast('list-coach', 'on-submit', data)
      })

      this.$on('on-reset', (data) => {
        this.$refs.coachNight.resetFields()
        this.addForm.excludeDate = []
        this.$refs.addDateForm.resetFields()

        this.broadcast('list-coach', 'on-reset', data)
      })
    },
  }
</script>

<style lang="less" scoped>
  @import "~vars.less";

  .add-coach-night {
    &__header {
      padding-bottom: 10px;
    }
  }

  .add-date-form {
    padding-bottom: 10px;

    &__item {
      padding-bottom: 10px;

      &-close {
        color: @error-color;
        padding: 0 8px;
      }
    }
  }
</style>
