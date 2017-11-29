<script>
/**
 * 试卷 - 组卷 - 组题信息面板
 *
 * @author  huojinzhao
 */

export default {
  name: 'PaperCompositionPanel',

  props: {
    // 组卷数据
    data: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    config: {
      title: '预览试卷',
    },
  }),

  methods: {
    v_previewPaper() {
      this.$emit('on-preview')
    },
  },
}
</script>

<!-- 屏幕右下角选中题目提示 -->
<template>
  <ul class="paper-composition-panel">
    <li
      v-for="item in data.question_types"
      :key="item.question_type_id"
    >
      {{item.display_name}}({{item.questions.length}})
    </li>
    <li>
      <Button
        type="primary"
        size="small"
        long
        @click="v_previewPaper()"
      >
        {{config.title}}
      </Button>
    </li>
  </ul>
</template>

<style lang="less">
@import './style/paper';

.paper-composition-panel {
  position: fixed;
  left: 1420px;
  bottom: 95px;
  border: @border-base;
  border-radius: @border-radius;
  padding: 10px 17px;
  background-color: transparent;

  &>li {
    margin-bottom: 4px;
    text-align: center;

    &>button {
      margin-top: 10px;
    }
  }
}
</style>
