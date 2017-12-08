<script>
/**
 * 试卷 - 组卷 - 试题
 *
 * @author  huojinzhao
 */

import { mapState } from 'vuex'
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


  computed: {
    // 标签列表
    ...mapState({
      labelList: state => state.label.list,
    }),

    // hover标签管理按钮展示信息
    labelContent() {
      const label_ids = this.data.user_label_ids
      let text = ''
      this.labelList
        .filter(label => label_ids.includes(label.id))
        .map(label => label.display_name)
        .forEach((label_name, index) => {
          text = `${text}<li>${index + 1}. ${label_name}</li>`
        })
      return text === '' ? '<li style="text-align:center;">暂无收藏任何标签</li>' : text
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

    v_openLabelModal() {
      this.$emit('on-open', this.data)
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

        <Tooltip trigger="hover" transfer="true">
          <ul
            slot="content"
            v-html="labelContent"
            class="paper-composition-question__poptip"
          ></ul>

          <Button
            size="small"
            type="primary"
            @click="v_openLabelModal"
            >
            管理收藏
          </Button>
        </Tooltip>

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

  &__poptip {
    margin: 0;
    padding: 0;
  }
}
</style>
