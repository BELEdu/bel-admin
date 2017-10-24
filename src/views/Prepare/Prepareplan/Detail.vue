<template>
  <div>

    <!-- 搜索 -->
    <Form inline class="app-search-form">
      <!-- 关键字 -->
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
          v-model="query[`equal[course_status]`]"
          placeholder="请选择状态"
          style="width:9em;"
        >
          <Option
            v-for="status in course_status"
            :value="status.value"
            :key="status.display_name"
          >{{ status.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 标题 -->
    <Row class="app-content-header">
      <h2 icon="">【张老师】教案管理</h2>
    </Row>
.
    <!--教师教案表格-->
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

    <!-- 添加 & 编辑 & 查看 教案弹窗 -->
    <edit-modal
      v-model="editModal.active"
      :name="editModal.name"
      :form="editModal.form"
      :isCreate="editModal.isCreate"
      :isEdit="editModal.isEdit"
      :isShow="editModal.isShow"
      @closeEditModal="editModal.active = false"
      @update="fetchData"
    ></edit-modal>

  </div>
</template>

<script>
/**
 * 备课管理 - 教案管理 - 教师教案列表
 * @author zhoumenglin
 * @version 2017-10-17
 */

import { mapState } from 'vuex'
import { PREPARE } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import EditModal from './components/EditModal'

const defaultPlanForm = {
  plan_course_id: null,
  content: '', // 教案富文本
  question_id: [], // 课堂练习 习题id
}

export default {
  name: 'app-prepare-prepareplan-detail',

  mixins: [list],

  components: {
    EditModal,
  },

  data() {
    return {
      likeKeys: [
        { label: '班级名称', value: 'classes_name' },
        { label: '上课内容', value: 'display_name' },
      ],
      likeKey: 'classes_name',
      query: {
        'equal[course_status]': '',
      },

      columns: [
        { title: '班级名称', key: 'classes_name', align: 'center' },
        { title: '课序', key: 'sort_value', align: 'center', sortable: 'custom' },
        { title: '上课内容', key: 'chapter_name', align: 'center' },
        { title: '课堂题量', key: 'question_count', align: 'center', sortable: 'custom' },
        { title: '状态', key: 'course_status_name', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: 180,
          render: createButton([
            { text: '添加', type: 'warning', click: row => this.openEditModal('create', row.id) },
            { text: '编辑', type: 'success', click: row => this.openEditModal('edit', row.id) },
            { text: '查看', type: 'primary', click: row => this.openEditModal('show', row.id) },
          ]),
        },
      ],

      // 编辑教案弹窗
      editModal: {
        active: false, // 模态框控制
        name: '',
        form: { // 教案表单数据
          ...defaultPlanForm,
        },
        isCreate: false, // 是否是查看班级
        isEdit: false, // 是否是编辑班级
        isShow: false, // 是否是查看班级
      },

    }
  },

  computed: {
    ...mapState({
      list: state => state.prepare.prepareplan.plans,
      course_status: state => state.dicts.course_status,
    }),

    // 教师id
    teacherId() {
      return +this.$router.currentRoute.params.id
    },
  },

  methods: {
    // 打开编辑教案弹窗
    openEditModal(type, id) {
      // 先重置
      this.editModal.isCreate = false
      this.editModal.isEdit = false
      this.editModal.isReview = false

      this.getPlanData(id, type)

      switch (type) {
        case 'create':
          this.editModal.isCreate = true
          break
        case 'edit':
          this.editModal.isEdit = true
          break
        case 'show':
          this.editModal.isShow = true
          break
        default:
          break
      }
    },

    // 获取教案数据
    getPlanData(id, type) {
      // 这里到时候调用教案详情接口
      this.editModal.name = '初一数学加强尖子一对一班 000001  第二节课'

      // this.editModal.active = true
      // console.log(type)

      this.$http.get(`/scheme/${id}/${type}`)
        .then((res) => {
          this.editModal.form = {
            ...defaultPlanForm,
            ...res,
          }
          this.editModal.active = true
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 获取列表数据
    getData(qs) {
      return this.$store.dispatch(PREPARE.PREPAREPLAN.DETAIL.INIT, {
        id: this.teacherId,
        query: qs,
      })
    },
  },

  created() {

  },
}
</script>

<style lang="less">

</style>
