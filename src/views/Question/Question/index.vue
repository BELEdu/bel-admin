<template>
  <div class="question-question">
    <!-- 搜索栏 -->
    <Form inline class="app-search-form">
      <!-- 年段学科 -->
      <Form-item>
        <Select
          v-model="query[`equal[grade_range_subject_id]`]"
          placeholder="选择年段学科"
          style="width:9em;"
        >
          <Option
            v-for="item in grade_range_subject_id"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 教材版本 -->
      <Form-item>
        <Select
          v-model="query[`equal[question_status]`]"
          placeholder="选择试题状态"
          style="width:9em;"
        >
          <Option
            v-for="item in question_status"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 关键字检索 -->
      <Form-item>
        <Input placeholder="搜索关键字" v-model="likeValue">
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width: 7em"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >
              {{ likeKey.label }}
            </Option>
          </Select>
        </Input>
      </Form-item>
      <!-- 搜索 -->
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>试题列表</h2>
      </Col>
      <Col>
        <Button type="primary"  @click="$router.push('/question/question/22')">添加试题</Button>
      </Col>
    </Row>

    <!--试题管理表格-->
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

    <!-- 查看详情弹窗 -->
    <detail-modal
      v-model="modal.detail"
      :question-id="questionId"
      @closeDetailModal="modal.detail = false"
    ></detail-modal>

     <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="deleteQuestion"
      action="删除"
    >
      <div class="text-center">
        删除该编号
        <span class="color-primary">" {{questionNumber}} "</span>
        的试题后将无法再恢复<br>是否继续删除？
      </div>
    </app-warn-modal>

    <!-- 下线模态框 -->
    <app-warn-modal
      v-model="modal.outline"
      title="下线确认"
      :loading="loading.outline"
      @on-ok="outline"
      action="下线"
    >
      <div class="text-center">
        下架后，该试题
        <span class="color-primary">" {{questionNumber}} "</span>
        将变为草稿状态，无法继续使用。若需上架，需要再次经过审核才可上架。
      </div>
    </app-warn-modal>

  </div>
</template>

<script>
/**
 * 题库中心 - 试题
 * @author zml
 * @version 2017-09-14
 */

// import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
// import { Question } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import DetailModal from './components/DetailModal'
import cdata from './cdata'

export default {
  name: 'question-question',

  mixins: [list],

  components: {
    DetailModal,
  },

  data() {
    return {
      likeKeys: [
        { label: '创建人', value: 'user_realname' },
        { label: '题目编号', value: 'number' },
      ],
      likeKey: 'user_realname',
      query: {
        'equal[grade_range_subject_id]': null,
        'equal[question_status]': null,
      },

      grade_range_subject_id: [
        { display_name: '高中数学', value: 1 },
        { display_name: '高中语文', value: 2 },
        { display_name: '高中英语', value: 3 },
        { display_name: '高中物理', value: 4 },
      ],

      question_status: [
        { display_name: '草稿', value: 1 },
        { display_name: '被驳回', value: 2 },
        { display_name: '待审核', value: 3 },
        { display_name: '已发布', value: 4 },
        { display_name: '已下线', value: 5 },
      ],

      columns: [
        { title: '题目编号', key: 'number', align: 'center' },
        { title: '题目内容', key: 'content', align: 'center', width: 400 },
        { title: '题型', key: 'question_type_name', align: 'center' },
        { title: '创建人', key: 'user_realname', align: 'center' },
        { title: '创建时间', key: 'display_name', align: 'center' },
        { title: '状态', key: 'question_status_name', align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 180,
          render: createButton([
            { text: '审核', type: 'warning', click: row => this.openDetailModal(row.id) },
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.id, row.number) },
            { text: '查看', type: 'primary', click: row => this.openDetailModal(row.id) },
            { text: '编辑', type: 'success', click: row => this.$router.push(`/question/question/1/${row.id}`) },
            { text: '下线', click: row => this.openOutlineModal(row.id, row.number) },
          ]),
        },
      ],

      list: cdata,

      // 试题编号（删除和下线弹窗使用）
      questionNumber: null,
      questionId: null,

      modal: {
        delete: false,
        detail: false,
        outline: false,
      },

      loading: {
        delete: false,
        outline: false,
      },
    }
  },

  methods: {
    openDetailModal(id) { // 打开详情弹窗
      this.questionId = id
      this.modal.detail = true
    },

    openDeleteModal(id, number) { // 打开删除弹窗
      this.questionId = id
      this.questionNumber = number
      this.modal.delete = true
    },

    deleteQuestion() { // 删除操作
      this.loading.delete = true
      // 这里写删除逻辑
    },

    openOutlineModal(id, number) { // 打开下线弹窗
      this.questionId = id
      this.questionNumber = number
      this.modal.outline = true
    },

    outline() { // 下线操作、
      this.loading.outline = true
      // 这里写下线逻辑
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
