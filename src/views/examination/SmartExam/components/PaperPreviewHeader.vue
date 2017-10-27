<template>
  <div class="paper-preview-header">
    <header>
      <h2>这里是试卷名称</h2>
      <!-- <span>年级: </span>
      <span>| 类型: </span>
      <span>| 区域: </span>
      <span>| 年份: </span> -->
      <span>题数: {{paperTotalCount}} 题</span>
      <span>| 总分: {{paperTotalScore}} 分</span>
    </header>
  </div>
</template>

<script>

export default {
  props: {
    // 试卷数据
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    // 试卷总分
    paperTotalScore() {
      return this.data.question_types
        .map(question_type => question_type.total_score)
        .reduce((total, score) => total + score, 0)
    },

    // 试卷总题数
    paperTotalCount() {
      return this.data.question_types
        .map(question_type => question_type.question_count)
        .reduce((total, count) => total + count, 0)
    },
  },
}
</script>

<style lang="less">
@import "~vars";
@import '../mixins/paper.less';

.paper-preview-header {
  width: calc(@layout-width - 90px);

  & > header {
    margin-bottom: 20px;

    & > h2 {
      margin-bottom: 5px;
    }

    & > span {
      font-size: 14px;
    }
  }
}
</style>
