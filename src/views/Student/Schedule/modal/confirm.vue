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
    <Row v-if="currentCourseItem.course_status === 1">
      <Col :span="10">
        <Form-item prop="course_chapter" label="实际课时：">
          <Select v-model="formData.course_fact">
            <Option v-for="item in 16" :key="item" :disabled="item > formData.course_num" :value="item">{{ item }}</Option>
          </Select>
        </Form-item>
      </Col>
    </Row>
    <Row v-if="currentCourseItem.course_status === 1">
      <Col>
        <Form-item label="学员考勤：" prop="attendance">
          <Row v-for="list in formData.attendance" :key="list.student_id">
            <Col :span="6">
            <Checkbox
              :true-value="1"
              :false-value="0"
              v-model="list.is_attend"
              @on-change="(val) => list.is_valid = val || 1"
            >{{list.display_name}}</Checkbox>
            </Col>
            <Col :span="6" :offset="2" v-if="!list.is_attend">
            <Checkbox :true-value="1" :false-value="0" v-model="list.is_valid">算课时</Checkbox>
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
  import { STUDENT } from '@/store/mutationTypes'

  export default {
    name: 'confirm-modal',

    data() {
      return {
        formData: {
          classes_name: '',
          sort_value: 0,
          schedule_date: '',
          schedule_range: '',
          course_num: 0,
          schedule_teacher_name: '',
          course_chapter: [],
          attendance: [],
        },

        formRules: {
          course_chapter: [
            { required: true, type: 'array', message: '上课内容不能为空' },
          ],
          course_num: [
            { required: true, type: 'number', message: '实际课时不能为空' },
          ],
          attendance: [
            { required: true, type: 'array', message: '学员考勤不能为空' },
            {
              type: 'array',
              validator: (rule, value, callback) => {
                if (value.filter(({ is_attend }) => is_attend === 1).length) {
                  callback([])
                } else {
                  callback(['学员考勤不能为空'])
                }
              },
            },
          ],
        },
      }
    },

    computed: {
      ...mapState({
        currentCourseItem: state => state.student.schedule.currentCourseItem,
        currentChapter: state => state.student.schedule.currentChapter,
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
              ...this.formData,
              ...result,
              course_fact: result.course_num,
              course_chapter: course_chapter.map(({ id }) => id),
            }
            if (result.student && result.student.length) {
              this.formData.attendance = result.student.map(item => ({
                student_id: item.id,
                is_attend: 1,
                is_valid: 1,
                display_name: item.display_name,
              }))
            }
            this.$store.dispatch(STUDENT.SCHEDULE.COURSE_ITEM_CHAPTER, this.currentCourseItem)
              .then(() => {
                this.$emit('update:loading', false)
              })
          })
          .catch((errors) => {
            this.$emit('on-error', errors)
          })
      },

      // 提交课表信息
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const { course_chapter, student, ...arg } = this.formData
            this.$http.post(`${this.url}${this.currentCourseItem.id}`, {
              ...arg,
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

      getDisPlayName(id) {
        return this.formData.student.find(({ student_id }) => student_id === id).display_name
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
