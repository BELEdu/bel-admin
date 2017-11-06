<template>
  <div class="student-class">

    <Form inline class="app-search-form">
      <!-- 关键字搜索 -->
      <Form-item>
        <Input
          v-model="likeValue"
          placeholder="请输入关键字"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width:6em;"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>

      <!-- 班级状态 -->
      <Form-item>
        <Select
          v-model="query[`equal[classes_status]`]"
          placeholder="请选择状态"
          style="width:9em;"
        >
          <Option
            v-for="status in classes_status"
            :value="status.value"
            :key="status.display_name"
          >{{ status.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 操作 -->
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="ios-browsers"/> 班级管理</h2>
      </Col>
      <Col>
        <Button type="primary" @click="openEditModal('add')" >添加班级</Button>
      </Col>
    </Row>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="deleteSubmit"
      action="删除"
    >
      <div class="text-center">
        删除该班级
        <br><span class="color-primary">{{classesName}}</span><br>
        后将无法再回复，是否继续删除？
      </div>
    </app-warn-modal>

    <!-- 取消模态框 -->
    <app-warn-modal
      v-model="modal.cancel"
      title="取消确认"
      :loading="loading.cancel"
      @on-ok="cancelSubmit"
      action="确认取消"
    >
      <div class="text-center">
        取消该班级
        <br><span class="color-primary">{{classesName}}</span><br>
        后，班级状态将变为已取消，无法再修改，是否继续？
      </div>
    </app-warn-modal>

    <!--班级管理表格-->
    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

    <!--分页-->
    <app-pager
      :data="list"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 添加 & 编辑 & 查看 班级弹窗 -->
    <edit-modal
      v-model="editModal.active"
      :title="editModal.title"
      :classId="classId"
      :form="editModal.form"
      :isEdit="editModal.isEdit"
      :isReview="editModal.isReview"
      :productList="productList"
      :teacherList="teacherList"
      :teachMaterialList="teachMaterialList"
      :courseList="courseList"
      @closeEditModal="editModal.active = false"
      @update="fetchData"
    ></edit-modal>

  </div>
</template>

<script>
/**
 * 学员管理 - 班级管理
 * @author zml
 * @version 2017-07-20
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import EditModal from './components/EditModal'

const defaultClassesForm = {
  product_id: null, // 产品id
  teach_material: null, // 教材版本
  customer_relationships_id: null, // 学管师id
  students: [], // 学生
  teachers: [], // 老师
}

export default {
  name: 'app-student-classes',

  mixins: [list],

  components: {
    EditModal,
  },

  data() {
    return {
      likeKeys: [
        { label: '班级名称', value: 'classes_name' },
        { label: '排课专员', value: 'customer_relationships_name' },
        { label: '教师', value: 'teacher_item' },
      ],
      likeKey: 'classes_name',
      query: {
        'equal[classes_status]': null,
      },

      columns: [
        {
          title: '班级名称',
          key: 'classes_name',
          align: 'center',
          width: 320,
          render: (h, params) => {
            const { classes_name, student_name } = params.row
            return h('Poptip', {
              class: 'color-primary',
              props: {
                trigger: 'hover',
                content: student_name === '' ? '暂无学员' : student_name,
                placement: 'right',
              },
            }, classes_name)
          },
        },
        { title: '教材版本', key: 'teach_material_name', align: 'center' },
        { title: '排课专员', key: 'customer_relationships_name', align: 'center' },
        { title: '教师', key: 'teacher_item', align: 'center' },
        { title: '上课人数', key: 'student_total', align: 'center', sortable: 'custom' },
        // { title: '计划课时', key: 'teach_material', align: 'center' },
        { title: '创建日期', key: 'created_at', align: 'center', sortable: 'custom' },
        { title: '状态', key: 'classes_status_name', align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          render: createButton([
            {
              text: '编辑',
              type: 'success',
              isShow: ({ row }) => row.operation.update,
              click: row => this.openEditModal('edit', row.id),
            },
            {
              text: '查看',
              type: 'primary',
              isShow: ({ row }) => row.operation.show,
              click: row => this.openEditModal('review', row.id),
            },
            {
              text: '取消',
              type: 'warning',
              isShow: ({ row }) => row.operation.cancel,
              click: row => this.openCancelModal(row.id, row.classes_name),
            },
            {
              text: '删除',
              type: 'error',
              isShow: ({ row }) => row.operation.destroy,
              click: row => this.openDeleteModal(row.id, row.classes_name),
            },
          ]),
        },
      ],

      modal: { // 模态框
        delete: false,
        cancel: false,
      },

      loading: {
        delete: false,
        cancel: false,
      },

      classId: null, // 班级编号
      classesName: '', // 班级名称

      productList: [], // 产品数据源
      teacherList: [], // 教师数据源
      courseList: [], // 排课专员数据源
      teachMaterialList: {}, // 教材版本数据源

      editModal: {
        active: false, // 模态框控制
        title: '', // 标题
        form: { // 班级表单数据
          ...defaultClassesForm,
        },
        isEdit: false, // 是否是编辑班级
        isReview: false, // 是否是查看班级
      },
    }
  },

  computed: {
    ...mapState({
      list: state => state.student.classes.list,
      classes_status: state => state.dicts.classes_status,
    }),
  },

  methods: {
    // 打开添加 & 编辑班级弹窗
    openEditModal(type, id) {
      if (id) {
        this.classId = id
      }
      this.editModal.isEdit = false
      this.editModal.isReview = false

      switch (type) {
        case 'edit':
          this.editModal.title = '编辑班级'
          this.editModal.isEdit = true
          this.getClasseData(id)
          break
        case 'review':
          this.editModal.title = '查看班级'
          this.editModal.isReview = true
          this.getClasseData(id)
          break
        default:
          this.editModal.active = true
          this.editModal.title = '添加班级'
          this.editModal.form = {
            ...defaultClassesForm,
            students: [],
            teachers: [],
          }
          break
      }
    },

    // 获取班级详情通用方法
    getClasseData(classId) {
      return this.$http.get(`/classes/${classId}`)
        .then((res) => {
          this.editModal.form = { ...res }
          this.editModal.active = true
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 打开删除班级模态框
    openDeleteModal(id, name) {
      this.modal.delete = true
      this.classId = id
      this.classesName = name
    },

    // 删除班级
    deleteSubmit() {
      this.loading.delete = true
      // 班级id用来请求删除接口
      this.$store.dispatch(STUDENT.CLASSES.DELETE, this.classId)
        .then(() => {
          this.loading.delete = false
          this.modal.delete = false
          this.$Message.warning('删除成功！')
        })
        .catch(({ message }) => {
          this.loading.delete = false
          this.$Message.warning(message)
        })
    },

    // 打开取消班级模态框
    openCancelModal(id, name) {
      this.modal.cancel = true
      this.classId = id
      this.classesName = name
    },

    // 取消班级
    cancelSubmit() {
      this.loading.cancel = true
      // 班级id用来请求删除接口
      this.$http.post(`/classes/cancel/${this.classId}`)
        .then(() => {
          this.loading.cancel = false
          this.modal.cancel = false
          this.$Message.warning('取消成功！')
          this.fetchData()
        })
        .catch(({ message }) => {
          this.loading.cancel = false
          this.$Message.warning(message)
        })
    },

    // 根据接口和loaction.search（query）获取列表数据
    getData(qs) {
      return this.$store.dispatch(STUDENT.CLASSES.INIT, qs)
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 获取产品数据源
    getProductList() {
      this.$http.get('/contract_step3?sale_status=1')
        .then(({ product_list, teach_material_list }) => {
          this.productList = product_list
          this.teachMaterialList = teach_material_list
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 获取教师数据源
    getTeachertList() {
      this.$http.get('/teacher_list?attr=is_student_teac')
        .then((res) => {
          this.teacherList = res
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 获取排课专员数据源（先取学管师）
    getCourseList() {
      this.$http.get('/teacher_list?attr=is_student_admin')
        .then((res) => {
          this.courseList = res
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 接口错误处理
    errorNotice(message) {
      this.$Notice.error({
        title: message,
        duration: 0,
      })
    },
  },

  created() {
    this.getProductList()
    this.getTeachertList()
    this.getCourseList()
  },
}
</script>

<style lang="less" scoped>
@import '~vars';
</style>
