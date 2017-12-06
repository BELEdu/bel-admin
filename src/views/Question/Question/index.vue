<template>
  <div class="question-question">
    <!-- 搜索栏 -->
    <App-table-form @on-submit="search">
      <!-- 年段学科 -->
      <Form-item>
        <Select
          v-model="query[`equal[grade_range_subject_id]`]"
          placeholder="选择年段学科"
          style="width:9em;"
          @on-change="queryReset"
        >
          <Option
            v-for="item in grade_range_subject_id"
            :value="item.id"
            :key="item.id"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 试题类型 -->
      <Form-item>
        <Select
          v-model="query[`equal[question_type_id]`]"
          placeholder="选择试题类型"
          style="width:9em;"
        >
          <Option
            v-for="item in currentQuestionTypes"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 试题状态 -->
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
              :key="likeKey.field_name"
              :value="likeKey.field_name"
            >
              {{ likeKey.display_name }}
            </Option>
          </Select>
        </Input>
      </Form-item>
    </App-table-form>

    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="ios-flask"/> 试题列表</h2>
      </Col>
      <Col>
        <Button type="primary"  @click="addQuestion">添加试题</Button>
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
      v-if="questionDetail"
      :question-detail="questionDetail"
      @closeDetailModal="modal.detail = false"
      @fetchData="fetchData"
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
        下架后，该编号
        <span class="color-primary">" {{questionNumber}} "</span>
        的试题将变为草稿状态，无法继续使用。若需上架，需要再次经过审核才可上架。
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

import { list } from '@/mixins'
import { createButton } from '@/utils'
import DetailModal from './components/DetailModal'

export default {
  name: 'question-question',

  mixins: [list],

  components: {
    DetailModal,
  },

  data() {
    return {
      likeKeys: [], // 关键字搜索取before接口
      likeKey: 'user_realname',
      query: {
        'equal[grade_range_subject_id]': null,
        'equal[question_status]': null,
        'equal[question_type_id]': null,
      },

      grade_range_subject_id: [], // 年段及学科数据源
      question_status: [], // 试题状态数据源
      question_type_id: [], // 试题类型数据源汇总

      list: {}, // 列表数据

      columns: [
        {
          title: '题目编号',
          key: 'number',
          align: 'center',
        },
        {
          title: '题目内容',
          key: 'content',
          align: 'left',
          width: 400,
          render: (h, params) => {
            const { content } = params.row
            return h('div',
              {
                class: 'question-question__content',
                domProps: {
                  innerHTML: content,
                },
              },
            )
          },
        },
        {
          title: '题型',
          key: 'question_type_name',
          align: 'center',
        },
        {
          title: '创建人',
          key: 'user_realname',
          align: 'center',
        },
        {
          title: '创建时间',
          key: 'created_at',
          align: 'center' },
        {
          title: '状态',
          key: 'question_status_name',
          align: 'center',
        },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 180,
          render: createButton([
            {
              text: '审核',
              type: 'warning',
              isShow: ({ row }) => row.question_status === 2,
              click: row => this.openDetailModal(row.id),
            },
            {
              text: '删除',
              type: 'error',
              isShow: ({ row }) =>
                row.question_status === 1 || row.question_status === 3 || row.question_status === 5,
              click: row => this.openDeleteModal(row.id, row.number),
            },
            {
              text: '查看',
              type: 'primary',
              isShow: ({ row }) =>
                row.question_status !== 2,
              click: row => this.openDetailModal(row.id),
            },
            {
              text: '编辑',
              type: 'success',
              isShow: ({ row }) =>
                row.question_status === 1 || row.question_status === 3 || row.question_status === 5,
              click: row => this.$router.push(`/question/question/${row.grade_range_subject_id}/${row.id}`),
            },
            {
              text: '下线',
              isShow: ({ row }) => row.question_status === 4,
              click: row => this.openOutlineModal(row.id, row.number),
            },
          ]),
        },
      ],

      questionNumber: null, // 试题编号
      questionId: null, // 试题id
      questionDetail: null, // 题目查询

      modal: { // 弹窗控制
        delete: false,
        detail: false,
        outline: false,
      },

      loading: { // loading控制
        delete: false,
        outline: false,
      },
    }
  },

  computed: {
    // 当前年级学科对应的教材版本
    currentQuestionTypes() {
      return this.question_type_id[this.query['equal[grade_range_subject_id]']]
    },
  },

  methods: {
    // 添加试题
    addQuestion() {
      this.$router.push(`/question/question/${this.query['equal[grade_range_subject_id]']}`)
    },

    // 打开详情弹窗
    openDetailModal(id) {
      this.$http.get(`/question/${id}`)
        .then((res) => {
          this.questionDetail = res
          this.modal.detail = true
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 打开删除弹窗
    openDeleteModal(id, number) {
      this.questionId = id
      this.questionNumber = number
      this.modal.delete = true
    },

    // 删除操作
    deleteQuestion() {
      this.loading.delete = true
      this.$http.delete(`/question/${this.questionId}`)
        .then(() => {
          this.list.data = this.list.data
            .filter(item => item.id !== this.questionId)
          this.$Message.warning('删除成功')
          this.loading.delete = false
          this.modal.delete = false
        })
        .catch(({ message }) => {
          this.modal.delete = false
          this.$Message.error(message)
        })
    },

    // 打开下线弹窗
    openOutlineModal(id, number) {
      this.questionId = id
      this.questionNumber = number
      this.modal.outline = true
    },

    // 下线操作
    outline() {
      this.loading.outline = true
      this.$http.patch(`/question/set_offline/${this.questionId}`)
        .then(() => {
          this.$Message.warning('下线')
          this.loading.outline = false
          this.modal.outline = false
          this.fetchData()
        })
        .catch(({ message }) => {
          this.loading.outline = false
          this.modal.outline = false
          this.$Message.error(message)
        })
    },

    // 获取列表数据的公共方法getData
    getData(qs) {
      // 如果this.grade_range_subject_id长度为0，说明为第一次进入页面，这时应请求before接口的数据
      const p = this.grade_range_subject_id.length ? Promise.resolve() : this.getBeforeData()

      // qs为空代表目标路由地址没有携带url参数，这时候应该向路由推送equal[grade_range_subject_id]参数，将之设为默认值
      // 默认值为this。grade_range_subject_id的第一项的id
      if (!qs) {
        return p
          .then(() => {
            // 获取年级学科列表第一项的id
            const firstGradeRangeSubjectId = this.grade_range_subject_id[0].id

            // 重置关键字搜索
            this.queryReset(firstGradeRangeSubjectId)

            // 跳转路由
            this.$router.push(`/question/question?equal[grade_range_subject_id]=${firstGradeRangeSubjectId}`)
          })
      }

      // qs不为空代表目标路由地址有携带url参数，走常规获取列表数据
      return p
        .then(this.getListData(qs))
    },

    // 请求before接口的数据
    getBeforeData() {
      return this.$http.get('/question/index_before')
        .then(({
          grade_range_subject_id,
          question_status,
          search_fields,
          question_type_id,
        }) => {
          this.grade_range_subject_id = grade_range_subject_id
          this.question_status = question_status
          this.likeKeys = search_fields
          this.question_type_id = question_type_id
        })
    },

    // 请求试题列表接口
    getListData(qs) {
      return this.$http.get(`/question${qs}`)
        .then((res) => {
          this.list = res
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 重置关键字搜索
    queryReset(subjectId) {
      this.likeKey = 'user_realname'
      this.likeValue = ''
      this.query = {
        'equal[question_status]': null,
        'equal[question_type_id]': null,
        'equal[grade_range_subject_id]': subjectId,
      }
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
@import '~vars';
.question-question {
  &__content {
    max-height: 50px;
    overflow: hidden;
  }
}
</style>
