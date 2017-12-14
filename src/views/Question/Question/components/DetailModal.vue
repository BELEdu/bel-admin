<template>
  <div>
    <!-- 试题详情弹窗 -->
    <Modal
      :title="`试题详情（${questionDetail.number}）`"
      width="850"
      :value="value"
      @input="value => $emit('input', value)"
      :maskClosable="true"
      class="question-detail"
    >
      <!-- 题目信息表格 -->
      <Table
        class="app-table"
        size="small"
        :columns="columns.info"
        :data="[questionDetail]"
        border
      ></Table>

      <!-- 题目显示区域 -->
      <div class="question-detail__content">
        <question-analysis
          :data="questionDetail"
        ></question-analysis>
      </div>

      <h3 class="question-detail__log">操作历史</h3>

      <!-- 操作历史表格 -->
      <Table
        class="app-table"
        size="small"
        :columns="columns.logs"
        :data="questionDetail.logs"
        border
      ></Table>

      <div slot="footer">
        <Button type="ghost" size="large" @click="closeModal()">返回</Button>
        <Button type="primary" v-if="isWait" size="large" @click="modal = true" :loading="loading">驳回</Button>
        <Button type="primary" v-if="isWait" size="large" @click="submit(4)" :loading="loading">通过并发布</Button>
      </div>
    </Modal>

    <!-- 驳回弹窗 -->
    <Modal
      v-model="modal"
      width="360"
      :loading="loading"
      @on-ok="submit(3)"
      @on-cancel="closeRejectModal"
    >
      <p slot="header" class="text-center color-warning question-detail__header">
        <Icon type="information-circled"></Icon>
        <span>驳回确认</span>
      </p>

      <Form :model="form" ref="from" :label-width="40">
        <FormItem>
          <CheckboxGroup v-model="rejectArray">
            <Checkbox v-for="item in rejectTexts" :key="item" :label="item"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="备注">
          <Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" v-model="form.remark"></Input>
        </FormItem>
      </Form>

    </Modal>

  </div>
</template>

<script>
/**
 * 查看试题详情
 * @author zml
 * @version 2017-09-13
 */

import { QuestionAnalysis } from '@/views/components'

export default {
  name: 'question-question-detail-modal',

  components: {
    QuestionAnalysis,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    questionDetail: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      form: {
        question_status: null,
        remark: '',
      },

      rejectArray: [],

      rejectTexts: ['属性有误', '题目有误', '答案有误', '解析有误', '试题有误'],

      modal: false,

      loading: false,

      columns: {
        info: [
          { title: '学科', key: 'grade_range_subject_name', align: 'center', width: 100 },
          { title: '题型', key: 'question_type_name', align: 'center', width: 100 },
          { title: '类型', key: 'paper_type_name', align: 'center', width: 100 },
          { title: '难度', key: 'question_difficulty_name', align: 'center', width: 80 },
          { title: '时间', key: 'year_name', align: 'center', width: 80 },
          { title: '知识点', key: 'knowledge_str', align: 'center' },
        ],
        logs: [
          { title: '操作者', key: 'realname', align: 'center' },
          { title: '操作类型', key: 'question_log_type_name', align: 'center' },
          { title: '操作时间', key: 'created_at', align: 'center' },
          { title: '备注', key: 'remark', align: 'center' },
        ],
      },

    }
  },

  computed: {
    dataInfo() {
      return this.questionDetail
    },
    isWait() {
      return this.questionDetail.question_status === 2
    },
  },

  methods: {
    closeModal() { // 关闭该模态框
      this.$emit('closeDetailModal')
    },

    closeRejectModal() {
      this.form.remark = ''
      this.modal = false
      this.loading = false
    },

    submit(status) {
      this.loading = true
      this.form.question_status = status
      this.form.remark = this.rejectArray.join('; ') + this.form.remark
      this.$http.patch(`/question/check_status/${this.questionDetail.id}`, {
        ...this.form,
      })
        .then(() => {
          this.$Message.success('提交成功')
          this.closeRejectModal()
          this.$emit('fetchData')
          this.$emit('closeDetailModal')
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
        .then(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="less">
@import '~vars';
.question-detail {
  .ivu-table-small td {
    height: 35px;
  }

  .app-table th .ivu-table-cell,
  .app-table td .ivu-table-cell {
    padding: 4px 12px;
  }

  &__log {
    margin: 10px 0;
  }

  &__header {
    margin:0;
  }

  &__content {
    background-color: @bg-color;
    border: 1px solid @border-color-split ;
    border-top: 0px;
    padding: 10px;

    &>div {
      margin: auto;
    }
  }
}
</style>
