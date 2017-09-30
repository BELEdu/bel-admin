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
          @on-change="changeSubject"
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
            v-for="item in question_type_id"
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
        <Button type="primary"  @click="$router.push(`/question/question/${query[`equal[grade_range_subject_id]`]}`)">添加试题</Button>
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
import Http from '@/utils/http'
import { list } from '@/mixins'
// import { Question } from '@/store/mutationTypes'
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
        // 'equal[grade_range_subject_id]': null,
        'equal[question_status]': null,
        'equal[question_type_id]': null,
      },

      grade_range_subject_id: [], // 年段及学科数据源
      question_status: [], // 试题状态数据源
      question_type_id: [], // 试题类型数据源

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
              isShow: ({ row }) => row.question_status === 1 || row.question_status === 3,
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
              isShow: ({ row }) => row.question_status === 1 || row.question_status === 3,
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

  methods: {
    openDetailModal(id) { // 打开详情弹窗
      this.$http.get(`/question/${id}`)
        .then((res) => {
          this.questionDetail = res
          this.modal.detail = true
        })
    },

    openDeleteModal(id, number) { // 打开删除弹窗
      this.questionId = id
      this.questionNumber = number
      this.modal.delete = true
    },

    deleteQuestion() { // 删除操作
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

    openOutlineModal(id, number) { // 打开下线弹窗
      this.questionId = id
      this.questionNumber = number
      this.modal.outline = true
    },

    outline() { // 下线操作
      this.loading.outline = true
      this.$http.patch(`/question/set_offline/${this.questionId}`)
        .then(() => {
          this.$Message.warning('下线')
          this.loading.outline = false
          this.modal.outline = false
          this.fetchData()
        })
        .catch(({ message }) => {
          this.modal.outline = false
          this.$Message.error(message)
        })
    },

    getData(query, to) { // 获取列表数据
      const urlArr = to.fullPath.split('/').slice(2)
      const url = `/${urlArr.join('/')}`
      return this.$http.get(url)
        .then((res) => { this.list = res })
    },

    /**
     * 切换科目时重新请求before接口
     * 重置试题基本信息
     * 重置query
     */
    changeSubject(subjectId) {
      this.query['equal[question_type_id]'] = ''
      this.query['equal[question_status]'] = ''
      this.likeKeys = []

      if (subjectId !== this.grade_range_subject_id) {
        this.$http.get(`/question/index_before/?grade_range_subject_id=${subjectId}`)
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
      }
    },
  },

  created() {

  },

  beforeRouteEnter(to, from, next) {
    Http.get('/question/index_before')
      .then(({
        grade_range_subject_id,
        question_status,
        search_fields,
        question_type_id,
        current_grade_range_subject_id,
      }) => {
        next((vm) => {
          /* eslint-disable no-param-reassign */
          vm.grade_range_subject_id = grade_range_subject_id
          vm.question_status = question_status
          vm.likeKeys = search_fields
          vm.question_type_id = question_type_id
          vm.query = {
            'equal[grade_range_subject_id]': current_grade_range_subject_id,
            ...vm.query,
          }
          /* eslint-enalbe */
        })
      })
  },
}
</script>

<style lang="less">
@import '~vars';
.question-question {
  &__content {
    max-height: 36px;
    overflow: hidden;
  }
}
</style>
