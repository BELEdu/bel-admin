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
      type: [Number, String],
      default: 790,
    },
  },

  data: () => ({
    config: {
      select: true,
      carrier: '试卷',
    },
  }),

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
    <div class="paper-composition-question__content">
      <Question
        :data="data"
        :width="width"
      />
    </div>

    <!-- 题目控件 -->
    <div class="paper-composition-question__toolbar">
      <template v-if="config.select">
        <Button
          v-if="selected"
          size="small"
          @click="v_removeQuestion"
        >
          移出{{config.carrier}}
        </Button>
        <Button
          v-else
          size="small"
          type="primary"
          @click="v_insertQuestion"
          >
          加入{{config.carrier}}
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
