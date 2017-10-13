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
          v-model="form.product_id"
          placeholder="请选择产品"
        >
          <Option
            v-for="product in productList"
            :value="product.value"
            :key="product.display_name"
          >{{ product.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item label="教材版本" prop="teach_material">
        <Select
          v-model="form.teach_material"
          placeholder="请选择教材"
        >
          <Option
            v-for="material in teach_material"
            :value="material.value"
            :key="material.display_name"
          >{{ material.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item label="排课专员" prop="customer_relationships_id">
        <Select
          v-model="form.customer_relationships_id"
          placeholder="请选择专员"
        >
          <Option
            v-for="course in courseList"
            :value="course.id"
            :key="course.username"
          >{{ course.username }}</Option>
        </Select>
      </Form-item>

       <Form-item label="选择教师" prop="teachers">
        <Select
          v-model="form.teachers"
          placeholder="请选择教师"
          multiple
        >
          <Option
            v-for="teacher in teacherList"
            :value="teacher.id"
            :key="teacher.username"
          >{{ teacher.username }}</Option>
        </Select>
      </Form-item>

      <Form-item label="选择学员">
        <Select
          v-model="selectedStudentId"
          placeholder="请选择学员"
          label-in-value
          filterable
          @on-change="addStudent"
          :disabled="!showStudentSelect"
        >
          <Option
            v-for="student in studentList"
            :disabled="hasSelected(student.value)"
            :value="student.value"
            :key="student.display_name"
          >{{ student.display_name }}</Option>
        </Select>
      </Form-item>

    </Form>

     <!--学员表格（暂时用测试数据）-->
    <Table
      :columns="columns"
      :data="test"
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
import { mapState } from 'vuex'
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
  },

  data() {
    return {
      studentList: [], // 可添加学生数据源
      selectedStudentId: null, // 选中的学员的id
      showStudentSelect: false,

      columns: [
        { title: '学员姓名（编号）', key: 'display_name', align: 'center' },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => { // 剩余课时小于10的时候变红
            const { status } = params.row
            const name = this.studentStatusName(status)
            return h('span', name)
          },
        },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            { text: '删除', type: 'warning', isShow: ({ row }) => row.status === 0, click: row => this.removeStudent(row.id) },
            { text: '退班', type: 'error', isShow: ({ row }) => row.status === 1, click: row => this.changeStudentStatus(row.id, row.status) },
            { text: '重新进班', type: 'success', isShow: ({ row }) => row.status === 2 || row.status === 3, click: row => this.changeStudentStatus(row.id, row.status) },
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

      // 测试版本，学生列表
      test: [
        {
          display_name: '张三 1001', // 姓名和编号
          id: 11, // id
          status: 1, // 状态
        },
        {
          display_name: '李四 1002',
          id: 12,
          status: 1,
        },
        {
          display_name: '王五 1003',
          id: 13,
          status: 2,
        },
        {
          display_name: '哈哈 1003',
          id: 14,
          status: 3,
        },
      ],
    }
  },

  computed: {
    ...mapState({
      teach_material: state => state.dicts.teach_material, // 教材数据源
    }),

    hasData() { // 是编辑或者查看班级
      return this.isEdit || this.isReview
    },

    productId() {
      return this.form.product_id ? this.form.product_id : null
    },
  },

  watch: {
    productId(val) {
      if (val) {
        this.getStudentList(val)
      }
    },
  },

  methods: {
    // 学员状态模板
    // 暂定 0 正常 1 退班 2 退费
    studentStatusName(status) {
      switch (status) {
        case 1:
          return '正常'
        case 2:
          return '退班'
        case 3:
          return '退费'
        default:
          return '正常'
      }
    },

    // 将已选学生从选项中禁用
    hasSelected(selectedStudentId) {
      return this.test.some(item => item.id === selectedStudentId)
    },

    // 选择学生添加
    addStudent(selectedStudentId) {
      this.form.students.push(selectedStudentId.value)
      // 临时测试
      this.test.push({
        id: selectedStudentId.value,
        display_name: `${selectedStudentId.label} 2017`,
        status: 0,
      })
      // 重置
      this.selectedStudentId = null
    },

    // 删除刚添加的学生
    removeStudent(id) {
      // 临时测试
      this.test = this.test.filter(item => item.id !== id)
      this.form.students = this.this.form.students.filter(item => item.id !== id)
    },

    // 退班，重新进班操作
    changeStudentStatus(id, status) {
      // 如果是正常，则做退班操作；如果是退费或者退班状态，则做重新进班操作
      if (status === 1) {
        this.test.find(item => item.id === id).status = 2
      } else {
        this.test.find(item => item.id === id).status = 1
      }
    },

    // 根据产品和班级筛选出符合条件可以进班的学生
    getStudentList(productId) {
      if (this.hasData) {
        // 这里到时候要加上班级id
        this.$http.get(`/student/student_product/${productId}`)
          .then((res) => {
            this.studentList = res
            if (res.length > 0) {
              this.showStudentSelect = true
            } else {
              this.showStudentSelect = false
            }
          })
      } else {
        this.$http.get(`/student/student_product/${productId}`)
          .then((res) => {
            this.studentList = res
            if (res.length > 0) {
              this.showStudentSelect = true
            } else {
              this.showStudentSelect = false
            }
          })
      }
    },

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

    successHandler() {
      this.closeModal()
      this.$Message.success('提交成功！')
      this.$emit('update')
    },

    closeModal() {
      this.$emit('closeEditModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },
  },
}
</script>

<style>
@import '~vars';
</style>
