<template>
  <Modal
    :value="value"
    @input="value => $emit('input', value)"
    :title="title"
    @on-cancel="closeModal"
  >
    <!-- 表单 -->
    <Form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="80"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>

      <Form-item label="产品名称" prop="product_id">
        <Select
          v-if="!hasData"
          v-model="form.product_id"
          placeholder="请选择产品"
        >
          <Option
            v-for="product in productList"
            :value="product.value"
            :key="product.display_name"
          >{{ product.display_name }}</Option>
        </Select>

        <span v-else class="color-primary">{{form.product_name}}</span>
      </Form-item>

      <Form-item label="教材版本" prop="teach_material">
        <Select
          v-if="!hasData"
          v-model="form.teach_material"
          placeholder="请选择教材版本"
        >
          <Option
            v-for="material in currentTeachMaterialList"
            :value="material.value"
            :key="material.display_name"
          >{{ material.display_name }}</Option>
        </Select>
        <span v-else class="color-primary">{{form.teach_material_name}}</span>
      </Form-item>

      <Form-item label="排课专员" prop="customer_relationships_id">
        <Select
          v-if="!isReview"
          v-model="form.customer_relationships_id"
          placeholder="请选择排课专员"
        >
          <Option
            v-for="course in courseList"
            :value="course.id"
            :key="course.id"
          >{{ course.realname }}</Option>
        </Select>
        <span v-else class="color-primary">{{currentCourseName}}</span>
      </Form-item>

       <Form-item label="教师" prop="teachers">
        <Select
          v-if="!isReview"
          v-model="form.teachers"
          placeholder="请选择教师"
          multiple
        >
          <Option
            v-for="teacher in teacherList"
            :value="teacher.id"
            :key="teacher.id"
          >{{ teacher.realname }}</Option>
        </Select>
        <span v-else class="color-primary">{{currentTeacherNames}}</span>
      </Form-item>

      <Form-item label="选择学员" v-if="!isReview">
        <Select
          :key="studentList.length"
          placeholder="请选择学员"
          filterable
          @on-change="addStudent"
          :disabled="studentList.length === 0"
        >
          <Option
            v-for="student in studentList"
            :value="student.id"
            :key="student.id"
          >
            {{ student.display_name }}
            <span class="right">{{ student.number }}</span>
          </Option>
        </Select>
      </Form-item>

    </Form>

     <!--学员表格（暂时用测试数据）-->
    <Table
      :columns="columns"
      :data="form.students"
      size="small"
      border
    ></Table>

    <!-- 自定义底部 -->
    <div slot="footer">
      <Button
        v-if="!isReview"
        type="ghost"
        size="large"
        @click="closeModal"
      >取消</Button>

      <Button
        v-if="!isReview"
        type="primary"
        size="large"
        :loading="formLoading"
        @click="beforeSubmit"
      >提交</Button>
    </div>

  </Modal>
</template>
<script>
/**
 * 班级管理 - 添加 & 编辑学员
 * @author zml
 * @version 2017-10-12
 */

import { form } from '@/mixins'
import { createButton } from '@/utils'

export default {
  name: 'app-student-classes-edit-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    classId: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    isReview: {
      type: Boolean,
      required: true,
    },
    courseList: {
      type: Array,
      required: true,
    },
    teacherList: {
      type: Array,
      required: true,
    },
    productList: {
      type: Array,
      required: true,
    },
    teachMaterialList: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      studentList: [], // 可添加学生数据源

      columns: [
        { title: '学员姓名', key: 'display_name', align: 'center' },
        { title: '编号', key: 'number', align: 'center' },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            { text: '退班', isShow: () => !this.isReview, type: 'warning', click: row => this.removeStudent(row.id) },
          ]),
        },
      ],

      rules: {
        product_id: [
          this.$rules.required('产品名称', 'number', 'blur'),
        ],
        teach_material: [
          this.$rules.required('教材版本', 'number', 'blur'),
        ],
        customer_relationships_id: [
          this.$rules.required('排课专员', 'number', 'blur'),
        ],
        teachers: [
          this.$rules.required('教师', 'array', 'blur'),
        ],
      },

    }
  },

  computed: {
    // 是编辑或者查看班级
    hasData() {
      return this.isEdit || this.isReview
    },

    // 已选中的产品id
    currentProductId() {
      return this.form.product_id || null
    },

    // 已选中的产品的班级学科id
    currentProductSubject() {
      if (this.currentProductId) {
        return this.productList
          .find(item => item.id === this.currentProductId).grade_range_subject_id
      }
      return null
    },

    // 已选中的产品对应的班级学科的教材版本
    currentTeachMaterialList() {
      if (this.currentProductSubject) {
        return this.teachMaterialList[this.currentProductSubject]
      }
      return []
    },

    // 已选中的排课专员的姓名
    currentCourseName() {
      const couresId = this.form.customer_relationships_id
      if (couresId) {
        return this.courseList
          .find(course => course.id === couresId).realname
      }
      return ''
    },

    // 已选中的教师的姓名组合
    currentTeacherNames() {
      const teacherArray = this.form.teachers
      if (teacherArray.length > 0) {
        return this.teacherList
          .filter(teacher => teacherArray.includes(teacher.id))
          .map(teacher => teacher.realname)
          .join('，')
      }
      return ''
    },
  },

  watch: {
    // 已选中的产品id
    currentProductId(val) {
      if (val) {
        this.getStudentList(val)
      }
    },
  },

  methods: {
    // 选择学生添加
    addStudent(id) {
      if (id) {
        const currentItem = this.studentList.find(item => item.id === id)
        this.form.students.push(currentItem)
        this.studentList = this.studentList.filter(item => item.id !== id)
      }
    },

    // 退班（删除学生）操作
    removeStudent(id) {
      const currentItem = this.form.students.find(item => item.id === id)
      this.form.students = this.form.students.filter(item => item.id !== id)
      this.studentList.push(currentItem)
    },

    // 根据产品和班级筛选出符合条件可以进班的学生
    getStudentList(currentProductId) {
      this.$http.get(`/student/student_product/${currentProductId}`)
        .then((res) => {
          this.studentList = res
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 提交表单
    submit() {
      // 先判断是新增还是修改，调用不同接口
      if (this.isEdit) {
        this.$http.patch(`/classes/${this.classId}`, this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      } else {
        this.$http.post('/classes', this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },

    // 提交成功回调
    successHandler() {
      this.closeModal()
      this.$Message.success('提交成功！')
      this.$emit('update')
    },

    // 关闭窗口
    closeModal() {
      this.$emit('closeEditModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },

    // 接口错误处理
    errorNotice(message) {
      this.$Notice.error({
        title: message,
        duration: 0,
      })
    },
  },
}
</script>

<style>
@import '~vars';
</style>
