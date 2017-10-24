<template>
  <Form ref="form" :model="formData" :rules="formRules" class="course-confirm" :label-width="100">
    <Form-item class="course-info-item" label="班级名称：">
      {{ formData.classes_name }}
    </Form-item>
    <Row class="course-info-item">
      <Col :span="8">
        <Form-item label="课序：">
          第{{ formData.sort_value }}节课
        </Form-item>
      </Col>
      <Col :span="16">
        <Form-item label="上课时间：">
          {{`${formData.schedule_date} &nbsp; ${formData.schedule_range}`}}
        </Form-item>
      </Col>
    </Row>
    <Row class="course-info-item">
      <Col :span="8">
        <Form-item label="计划课时：">
          {{ formData.course_num }}
        </Form-item>
      </Col>
      <Col :span="16">
        <Form-item label="学管师：">
          {{ formData.schedule_teacher_name }}
        </Form-item>
      </Col>
    </Row>
    <Row>
      <Col>
        <Form-item prop="course_chapter" label="内容：">
          <app-tree-select :data="currentChapter" multiple v-model="formData.course_chapter"></app-tree-select>
        </Form-item>
      </Col>
    </Row>
    <Row v-if="formData.course_status === 1">
      <Col :span="10">
        <Form-item prop="course_chapter" label="实际上课课时：">
          <Select v-model="formData.course_fact">
            <Option v-for="item in 16" :key="item" :disabled="item > formData.course_num" :value="item">{{ item }}</Option>
          </Select>
        </Form-item>
      </Col>
    </Row>
    <Row v-if="formData.course_status === 1">
      <Col>
        <Form-item label="学员考勤：">
          <Row>
            <Col :span="4">
            <Checkbox :true-value="1" :false-value="0">学员</Checkbox>
            </Col>
            <Col :span="6" :offset="2">
            <Checkbox :true-value="1" :false-value="0">算课时</Checkbox>
            </Col>
          </Row>
        </Form-item>
      </Col>
    </Row>
  </Form>
</template>

<script>
  /**
   * 确认排课 | 确认上课
   * @author chenliangshan
   * @version 2017-10-23
   */

  import { mapState } from 'vuex'

  export default {
    name: 'confirm-modal',

    data() {
      return {
        formData: {
          course_chapter: [],
          course_num: 0,
        },

        formRules: {
          course_chapter: [
            { required: true, type: 'array', message: '上课内容不能为空' },
          ],
          course_num: [
            { required: true, type: 'number', message: '实际课时不能为空' },
          ],

        },

        currentChapter: [],
      }
    },

    computed: {
      ...mapState({
        currentCourseItem: state => state.student.schedule.currentCourseItem,
      }),

      url() {
        if (this.currentCourseItem.course_status === 1) {
          return '/schedule/finish/'
        }
        return '/schedule/confirm/'
      },
    },

    watch: {
      currentCourseItem: {
        handler() {
          this.init()
        },
        deep: true,
      },
    },

    methods: {
      init() {
        // 获取课表信息
        this.$http.get(`${this.url}${this.currentCourseItem.id}`)
          .then(({ course_chapter, ...result }) => {
            this.formData = {
              ...result,
              course_chapter: course_chapter.map(({ id }) => id),
            }
          })
      },

      // 提交课表信息
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const { course_chapter } = this.formData
            this.$http.post(`${this.url}${this.currentCourseItem.id}`, {
              ...this.formData,
              course_chapter: course_chapter.map(id => ({
                id,
              })),
            })
              .then(() => {
                this.$emit('on-success')
              })
              .catch((errors) => {
                this.$emit('on-error', errors)
              })
          } else {
            this.$emit('on-reset')
          }
        })
      },
    },

    mounted() {
      this.init()
    },

    created() {
      this.$on('on-submit', () => {
        this.submit()
      })
    },
  }
</script>

<style lang="less" scoped>
  .course-confirm {

  }

  .course-info-item {
    &, .ivu-form-item {
      margin-bottom: 0;
    }
  }
</style>
