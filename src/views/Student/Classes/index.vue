<template>
  <div class="student-class">

    <Form inline class="app-search-form">
      <!-- 关键字搜索 -->
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
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
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2><Icon type="ios-browsers"/> 班级管理</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/student/classes/edit')" >添加班级（旧）</Button>
        <Button type="primary" @click="openEditModal('add')" >添加班级</Button>
      </Col>
    </Row>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="deleteSubmit(classId)"
      action="删除"
    >
      <div class="text-center">删除该班级（{{classId}}）后将无法再回复，是否继续删除？</div>
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
  students: [], // 老师
  teachers: [], // 学生
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
          render: (h, params) => {
            const { classes_name } = params.row
            return h('Tooltip', {
              class: 'color-primary',
              props: {
                content: '学生1，学生2，学生3',
                placement: 'bottom-start',
              },
            }, classes_name)
          },
        },
        { title: '教材版本', key: 'teach_material_name', align: 'center', width: 100 },
        { title: '排课专员', key: 'customer_relationships_name', align: 'center', width: 110 },
        { title: '教师', key: 'teacher_item', align: 'center' },
        { title: '上课人数', key: 'student_total', align: 'center', width: 100, sortable: 'custom' },
        { title: '剩余可用课时', key: 'course_cost', align: 'center', width: 120, sortable: 'custom' },
        { title: '计划课时', key: 'course_total', align: 'center', width: 100, sortable: 'custom' },
        { title: '创建日期', key: 'created_at', align: 'center', width: 140, sortable: 'custom' },
        { title: '状态', key: 'classes_status_name', align: 'center', width: 100 },
        // {
        //   title: '教师',
        //   key: 'teacher_item',
        //   align: 'center',
        //   render: (h, params) => {
        //     // 解构，const { xx } = obj 相当于 const xx in row { xx } = params.row
        //     const { teacher_item } = params.row
        //     // 相当于cosnt { teacher_id } = item
        //     // const text = teacher_item
        //     //   .map(({ teacher_id }) => `${teacher_id}`)
        //     //   .join('，')
        //     const text = teacher_item
        //       .reduce((result, item) => `${result} ${item.teacher_id}，`, '')
        //       .slice(0, -1)

        //     return h('span', text)
        //   },
        // },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 180,
          render: createButton([
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.id) },
            { text: '编辑', type: 'success', click: row => this.openEditModal('edit', row.id) },
            { text: '查看', type: 'primary', click: row => this.openEditModal('review', row.id) },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/student/classes/edit/${row.id}`) },
          ]),
        },
      ],

      modal: { // 模态框
        delete: false,
      },

      loading: {
        delete: false,
      },

      classId: null, //  班级编号

      productList: [], // 产品数据源
      teacherList: [], // 教师数据源
      courseList: [], // 排课专员数据源

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
          this.editModal.form = { ...defaultClassesForm }
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
    },

    // 打开删除班级模态框
    openDeleteModal(id) {
      this.modal.delete = true
      this.classId = id
    },

    // 删除班级
    deleteSubmit(id) {
      this.classId = id
      this.loading.delete = true
      // 班级id用来请求删除接口
      this.$store.dispatch(STUDENT.CLASSES.DELETE, id)
        .then(() => {
          this.loading.delete = false
          this.modal.delete = false
          this.$Message.warning('删除成功！')
        })
    },

    // 根据接口和loaction.search（query）获取列表数据
    getData(qs) {
      return this.$store.dispatch(STUDENT.CLASSES.INIT, qs)
    },

    // 获取产品数据源
    getProductList() {
      this.$http.get('/contract_step3?sale_status=1')
        .then(({ product_list }) => {
          this.productList = product_list
        })
    },

    // 获取教师数据源
    getTeachertList() {
      this.$http.get('/teacher_list?attr=is_student_teac')
        .then((res) => {
          this.teacherList = res
        })
    },

    // 获取排课专员数据源
    getCourseList() {
      this.$http.get('/teacher_list?attr=is_student_admin')
        .then((res) => {
          this.courseList = res
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
