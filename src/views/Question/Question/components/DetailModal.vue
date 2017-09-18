<template>
  <div>
    <!-- 试题详情弹窗 -->
    <Modal
      title="试题详情"
      width="800"
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
        :data="data.info"
        border
      ></Table>

      <!-- 题目显示区域 -->
      <div class="question-detail__content">
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
        <p>测试内容<br>测试内容</p>
      </div>

      <h3 class="question-detail__log">操作历史</h3>

      <!-- 操作历史表格 -->
      <Table
        class="app-table"
        size="small"
        :columns="columns.logs"
        :data="data.logs"
        border
      ></Table>

      <div slot="footer">
        <Button type="ghost" size="large" @click="closeModal()">返回</Button>
        <Button type="primary" size="large">驳回</Button>
        <Button type="primary" size="large">通过并发布</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
/**
 * 查看试题详情
 * @author zml
 * @version 2017-09-13
 */

export default {
  name: 'question-question-detail-modal',

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {

      columns: {
        info: [
          { title: '学科', key: 'grade_range_subject_id', align: 'center' },
          { title: '题型', key: 'question_type_id', align: 'center' },
          { title: '类型', key: 'paper_type_name', align: 'center' },
          { title: '难度', key: 'question_difficulty_name', align: 'center' },
          { title: '时间', key: 'year_name', align: 'center' },
          {
            title: '知识点',
            key: 'knowledge_ids',
            align: 'center',
            width: 250,
            render: (h, params) => {
              const { knowledge_ids } = params.row
              return h('ul', knowledge_ids.map(value => h('li', value)),
              )
            },
          },
        ],
        logs: [
          { title: '操作者', key: 'realname', align: 'center' },
          { title: '操作类型', key: 'question_log_type_name', align: 'center' },
          { title: '操作时间', key: 'created_at', align: 'center' },
          { title: '备注', key: 'remark', align: 'center' },
        ],
      },

      data: {
        info: [
          {
            grade_range_subject_id: 1,
            question_type_id: 2,
            paper_type_name: '历年真题',
            question_difficulty_name: '容易',
            year_name: '2017',
            knowledge_ids: [2, 3, 4],
          },
        ],
        logs: [
          {
            realname: '李小平(模拟数据)',
            question_log_type_name: '保存',
            created_at: '2017-04-20 17:25',
            remark: '备注111',
          },
          {
            realname: '沈腾(模拟数据)',
            question_log_type_name: '提交',
            created_at: '2017-04-21 17:25',
            remark: '备注222',
          },
        ],
      },


    }
  },

  methods: {
    closeModal() { // 关闭该模态框
      this.$emit('closeDetailModal')
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
    margin: 20px 0;
  }

  &__content {
    margin-top: 20px;
    border: 1px solid @border-color-split ;
    max-height: 300px;
    min-height: 150px;
    overflow: auto;
  }
}
</style>
