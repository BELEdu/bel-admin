<template>
  <div class="list-coach">
    <template v-if="courseRemain <= 0 || currentItem.type !== 'add'">
      <div class="list-coach__header">
      <span class="list-coach__header-course-remain">
        剩余可用计划课时：{{ courseRemain }}
      </span>
      </div>
      <Button type="text" class="list-coach__add" icon="plus-round" @click="addList"></Button>
      <Form class="list-coach__form" :model="coachList" ref="coachForm">
        <div
          class="list-coach__form-item"
          v-for="(item, index) in coachList.items"
          :key="index"
          :data-index="index + 1"
        >
          <Row :gutter="10">
            <Col :span="5">
            <form-item :prop="'items.' + index + '.course_num'" :rules="coachRules['course_num']">
              <Row>
                <Col :span="16" style="padding: 0 1px;">
                <Select v-model="item.course_num">
                  <Option v-for="(period, key) in courseNum" :key="key" :value="period">{{ period }}</Option>
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
                  format="yyyy-MM-dd HH:mm"
                  placeholder="请选择开始时间"
                  @on-ok="updateList"
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
            <Col :span="1" class="list-coach__close" v-if="list.length > 1">
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
    </template>
    <template v-else>
      <div class="text-center">
        暂无剩余可用计划课时
      </div>
    </template>
  </div>

</template>

<script>
  /**
   * 计划列表-组件
   * @author chenliangshan
   * @version 2017-10-15
   */

  import { mapState } from 'vuex'

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
        if (this.list.length) {
          listCost = this.list.map(item => item.course_num)
            .reduce((preValue, curvalue) => preValue + curvalue)
        }
        return courseTotal - listCost
      },

    },

    watch: {
      list: {
        handler(val) {
          this.coachList.items = [...val]
        },
        deep: true,
      },
    },

    methods: {
      addList() {
        // TODO 当前表单填写完整才能再添加
        if (this.courseRemain) {
          this.$emit('add-list')
        }
      },

      closeList(index) {
        this.$emit('close-list', this.coachList.items.filter((item, key) => index !== key))
      },

      updateList() {

      },

      submit() {
        this.$refs.coachForm.validate((valid) => {
          if (valid) {
            // TODO 提交表单信息
            this.$emit('on-success')
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
    },

  }
</script>

<style lang="less" scoped>
  @import "~vars.less";

  .list-coach {
    position: relative;

    &__header {
      text-align: right;
      padding-bottom: 10px;
    }

    &__add {
      position: absolute;
      right: 0;
      z-index: 10;
    }

    &__close {
      padding: 0 !important;

      .ivu-btn {
        color: @error-color;
        padding: 0 10px;
        margin-left: -10px;
      }
    }

    &__form {
      &-item {
        position: relative;
        padding: 0 40px;

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
