<template>
  <div class="list-coach">
    <Row class="list-coach__header">
      <Col :span="8" class="list-coach__header-course-remain">
        剩余可用计划课时：{{ courseRemain }}
      </Col>
      <Col :span="8" class="list-coach__header-add">
        <Button type="dashed" icon="plus-round" @click="addList" :disabled="!this.courseRemain">新增计划</Button>
      </Col>
    </Row>
    <Form class="list-coach__form" :model="coachList" ref="coachForm">
      <div
        class="list-coach__form-item"
        v-for="(item, index) in coachList.items"
        :key="item.random_id"
        :data-index="coachList.items.length - index"
      >
        <Row :gutter="10">
          <Col :span="5">
          <form-item :prop="'items.' + index + '.course_num'" :rules="coachRules['course_num']">
            <Row>
              <Col :span="16" style="padding: 0 1px;">
              <Select v-model="item.course_num">
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
          <Col :span="8">
            <form-item :prop="'items.' + index + '.course_date'" :rules="coachRules['course_date']">
              <app-date-picker
                v-model="item.course_date"
                type="datetime"
                :format="format"
                placeholder="请选择开始时间"
              ></app-date-picker>
            </form-item>
          </Col>
          <Col :span="10">
            <form-item :prop="'items.' + index + '.teacher_id'" :rules="coachRules['teacher_id']">
              <template v-if="multiTeacher">
                <Select v-model="item.teacher_id" multiple placeholder="请选择教师">
                  <Option v-for="(teacher, key) in teacherList" :key="key" :value="teacher.id">{{ teacher.username }}</Option>
                </Select>
              </template>
              <template v-else>
                <Select v-model="item.teacher_id[0]" placeholder="请选择教师">
                  <Option v-for="(teacher, key) in teacherList" :key="key" :value="teacher.id">{{ teacher.username }}</Option>
                </Select>
              </template>
            </form-item>
          </Col>
          <Col :span="1" class="list-coach__close" v-if="coachList.items.length > 1">
            <Button type="text" icon="close" @click="closeList(index)"></Button>
          </Col>
        </Row>
        <Row :gutter="10" v-if="!isNightCoach" style="padding-top: 10px">
          <Col :span="23">
          <form-item :prop="'items.' + index + '.course_chapter'" :rules="coachRules['course_chapter']">
            <app-tree-select :data="currentChapter" v-model="item.course_chapter" multiple></app-tree-select>
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
  import { parseDate } from '@/utils/date'

  export default {
    name: 'list-coach',

    props: {
      list: {
        type: Array,
        default: [],
      },

      multiTeacher: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        courseNum: 8,

        coachList: {
          items: [],
        },

        coachRules: {
          course_num: [
            { required: true, type: 'number', message: '请选择课时', trigger: 'change' },
          ],

          course_date: [
            { required: true, message: '请选择开始时间', trigger: 'change' },
          ],

          teacher_id: [
            { required: true, type: 'array', message: '请选择教师', trigger: 'change' },
          ],

          course_chapter: [
            { required: true, type: 'array', message: '请选择章节', trigger: 'change' },
          ],
        },

        format: 'yyyy-MM-dd HH:mm',
      }
    },

    computed: {
      ...mapState({
        currentItem: state => state.student.plan.currentItem,
        isNightCoach: state => state.student.plan.currentItem.isNightCoach,
        currentChapter: state => state.student.plan.currentChapter,
      }),

      teacherList() {
        return this.currentItem.teacher
      },

      courseRemain() {
        const courseTotal = this.currentItem.data.course_total
        let listCost = 0
        if (this.coachList.items.length) {
          listCost = this.coachList.items.map(item => item.course_num)
            .reduce((preValue, curvalue) => preValue + curvalue)
        }
        return courseTotal - listCost
      },

    },

    watch: {
      list: {
        handler(val) {
          this.coachList.items = [this.coachList.items, ...val]
        },
        deep: true,
      },
    },

    methods: {
      random() {
        return `${Math.random().toString(36).substring(3, 8)}`
      },

      handleAdd() {
        this.coachList.items = [{
          random_id: this.random(),
          sort_value: 1, // 课顺序
          course_num: this.courseRemain < 2 ? this.courseRemain : 2, // 课时
          course_date: '', // 课日期
          teacher_id: [], // 教师id
          course_chapter: [], // 章节数组id
        }, ...this.updateList()]
      },

      addList() {
        // TODO 当前表单填写完整才能再添加
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

      submit() {
        this.$refs.coachForm.validate((valid) => {
          if (valid) {
            const len = this.updateList().length
            this.$emit('on-success', this.updateList().map(({ random_id, ...arg }, index) => ({
              ...arg,
              sort_value: len - index,
            })))
          }
        })
      },

    },

    mounted() {
      this.$on('on-submit', () => {
        this.submit()
      })

      this.$on('on-reset-form', () => {
        this.$refs.coachForm.resetFields()
      })

      this.handleAdd()
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
        text-align: left;
        line-height: 30px;
      }

      &-add {
        text-align: center;

        .ivu-btn {
          width: 80%;
        }
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
