<script>
/**
 * 试卷 - 组卷 - 试题
 *
 * @author  huojinzhao
 */

import Question from './Question'

export default {
  name: 'PaperCompositionQuestion',

  components: {
    Question,
  },

  props: {
    // 试题数据
    data: {
      type: Object,
      required: true,
    },

    // 标志该试题是否被选择
    selected: {
      type: Boolean,
      default: false,
    },

    width: {
      type: Number,
      default: 850,
    },
  },

  computed: {
    // 根据类型显示控制按钮
    controlPanel() {
      let panel = null
      switch (this.$attrs.compositionType) {
        case 'readOnly':
          panel = {
            compose: false,
          }
          break

        default:
          panel = {
            compose: true,
          }
      }

      return panel
    },
  },

  methods: {
    v_removeQuestion() {
      this.$emit('on-remove', this.data)
    },

    v_insertQuestion() {
      this.$emit('on-insert', this.data)
    },

    v_onAnalyse() {
      this.$emit('on-analyse', this.data)
    },
  },
}
</script>

<template>
  <div
    class="paper-composition-question"
  >
    <!-- 题目内容 -->
    <Question
      class="paper-composition-question__content"
      :data="data"
      :width="width"
    />
    <!-- 题目控件 -->
    <div class="paper-composition-question__toolbar">
      <template v-if="controlPanel.compose">
        <Button
          v-if="selected"
          size="small"
          @click="v_removeQuestion"
        >
          移除试卷
        </Button>
        <Button
          v-else
          size="small"
          type="primary"
          @click="v_insertQuestion"
          >
          加入试卷
        </Button>
      </template>
      <Button
        size="small"
        type="primary"
        @click.stop="v_onAnalyse"
        >
        查看解析
      </Button>
      <span>
        难度系数：
        <em>{{data.question_difficulty_name}}</em>
      </span>
      <span>
        题型：{{data.question_type_name}}
      </span>
    </div>
  </div>
</template>

<style lang="less">
@import "./style/paper";

.paper-composition-question {
  margin-top: @layout-gutter;
  border: 1px solid @border-color-base;
  border-radius: @border-radius;

  &__content {
    padding: @layout-padding;
  }

  &__toolbar {
    padding: @layout-padding;
    background-color: @bg-color;

    & > span {
      float: right;
      margin-left: @layout-gutter;
      line-height: 24px;

      & > em {
        color: @error-color;
      }
    }
  }

  & button {
    margin-right: @layout-gutter;
  }
}
</style>
