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
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="android-list"/>【{{currentName}}】教案管理</h2>
      </Col>
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
  id: null, // 教案id
  content: '', // 教案富文本
  questions: [], // 课堂练习 习题id
  attachments: [ // ppt网址
    // {
    //   display_name: '',
    //   url: '',
    // },
  ],
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
        { label: '上课内容', value: 'chapter_name' },
      ],
      likeKey: 'classes_name',
      query: {
        'equal[course_status]': '',
      },

      columns: [
        { title: '班级名称', key: 'classes_name', align: 'center' },
        { title: '课序', key: 'sort_value', align: 'center' },
        {
          title: '上课内容',
          key: 'chapter_name',
          align: 'center',
          render: (h, params) => h('p', {
            domProps: {
              innerHTML: params.row.chapter_name,
            },
          }),
        },
        { title: '课堂题量', key: 'practice_immediately', align: 'center' },
        { title: '状态', key: 'course_status_name', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: 180,
          render: createButton([
            { text: '添加', type: 'warning', isShow: ({ row }) => row.scheme_operation.create, click: row => this.openEditModal('create', row.id) },
            { text: '编辑', type: 'success', isShow: ({ row }) => row.scheme_operation.edit, click: row => this.openEditModal('edit', row.id) },
            { text: '查看', type: 'primary', isShow: ({ row }) => row.scheme_operation.show, click: row => this.openEditModal('show', row.id) },
          ]),
        },
      ],

      // 编辑教案弹窗
      editModal: {
        active: false, // 模态框控制
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
      userId: state => state.user.id,
      username: state => state.user.realname,
      teachername: state => state.prepare.prepareplan.teachername,
    }),

    // url最后一个字段
    urllastWord() {
      const pathArry = this.$route.path.split('/')
      return pathArry[pathArry.length - 1]
    },

    // 教师id
    teacherId() {
      // 如果进入的入口是“我的教案”则返回当前用的id
      if (this.urllastWord === 'myprepareplan') {
        return this.userId
      }
      return +this.$router.currentRoute.params.id
    },

    // 当前教案教师姓名
    currentName() {
      if (this.urllastWord === 'myprepareplan') {
        return this.username
      }
      return this.teachername
    },
  },


  watch: {
    teacherId() {
      this.fetchData()
    },
  },

  methods: {
    // 打开编辑教案弹窗
    openEditModal(type, id) {
      // 先重置
      this.editModal.isCreate = false
      this.editModal.isEdit = false
      this.editModal.isShow = false

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

      this.getPlanData(id, type)
    },

    // 获取教案数据
    getPlanData(id, type) {
      this.$http.get(`/scheme/${id}/${type}`)
        .then((res) => {
          // 如果是新建教案，要拼接章节解析给content
          this.editModal.form = {
            ...defaultPlanForm,
            content: this.editModal.isCreate ? res.course_chapter
              .map(item => item.analysis)
              .filter(item => item !== '')
              .join('') : '',
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

  },
}
</script>

<style lang="less">

</style>
