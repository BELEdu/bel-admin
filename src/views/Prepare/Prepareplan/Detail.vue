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
          v-model="query[`equal[plan_status]`]"
          placeholder="请选择状态"
          style="width:9em;"
        >
          <Option
            v-for="status in plan_status"
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
      :title="editModal.title"
      :name="editModal.name"
      :form="editModal.form"
      :isEdit="editModal.isEdit"
      :isReview="editModal.isReview"
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
import { GLOBAL } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import EditModal from './components/EditModal'

const defaultPlanForm = {
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
        { label: '班级名称', value: 'display_name' },
        { label: '上课内容', value: 'display_name' },
      ],
      likeKey: 'display_name',

      columns: [
        { title: '班级名称', key: 'display_name', align: 'center' },
        { title: '课序', key: 'class_order', align: 'center', sortable: 'custom' },
        { title: '上课内容', key: 'class_content', align: 'center' },
        { title: '课堂题量', key: 'question_count', align: 'center', sortable: 'custom' },
        { title: '课后题量', key: 'homework_count', align: 'center', sortable: 'custom' },
        { title: '状态', key: 'status_name', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: 180,
          render: createButton([
            { text: '添加', type: 'warning', click: row => this.openEditModal('add', row.id) },
            { text: '编辑', type: 'success', click: row => this.openEditModal('edit', row.id) },
            { text: '查看', type: 'primary', click: row => this.openEditModal('review', row.id) },
          ]),
        },
      ],

      // 列表假数据
      list: {
        data: Array(10).fill(null).map(() => ({
          id: 10010,
          display_name: '初一数学加强尖子一对一班 000001',
          class_order: 10,
          class_content: '第一节 金属的化学性质（纳的性质；铝的性质；铁的性质）',
          question_count: 3,
          homework_count: 10,
          status_name: '待上课',
        })),
      },

      // 上课状态
      plan_status: [
        {
          display_name: '待上课',
          value: 1,
        },
        {
          display_name: '已上课',
          value: 2,
        },
        {
          display_name: '已评价',
          value: 3,
        },
      ],

      // 编辑教案弹窗
      editModal: {
        active: false, // 模态框控制
        title: '', // 标题
        name: '',
        form: { // 教案表单数据
          ...defaultPlanForm,
        },
        isEdit: false, // 是否是编辑班级
        isReview: false, // 是否是查看班级
      },

    }
  },

  computed: {
    ...mapState({
      classes_status: state => state.dicts.classes_status,
    }),
  },

  methods: {
    // 打开编辑教案弹窗
    openEditModal(type, id) {
      // 先重置
      this.editModal.isEdit = false
      this.editModal.isReview = false

      switch (type) {
        case 'edit':
          this.editModal.title = '编辑教案'
          this.editModal.isEdit = true
          this.getPlanData(id)
          break
        case 'review':
          this.editModal.title = '查看教案'
          this.editModal.isReview = true
          this.getPlanData(id)
          break
        default:
          this.editModal.title = '添加教案'
          this.editModal.active = true
          this.editModal.form = { ...defaultPlanForm }
          break
      }
    },

    // 获取教案数据
    getPlanData() {
      // 这里到时候调用教案详情接口
      this.editModal.name = '初一数学加强尖子一对一班 000001  第二节课'

      this.editModal.active = true
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
