<template>
  <div class="studyprogress-step-two">
    <div class="studyprogress-step-two__weak">
      <h3 class="studyprogress-edit__sub-title">薄弱知识点</h3>
      <ul>
        <li v-for="item in knowledgepoints" :key="item">{{ item }}</li>
      </ul>
    </div>

    <div class="studyprogress-step-two__tree" v-show="step < 3 || step === 4">
      <h3 class="studyprogress-edit__sub-title">添加知识点</h3>
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 创建/编辑计划 - 第二部分
 * @author lmh
 * @version 2017-06-29
 */

export default {
  name: 'app-student-studyprogress-editplan-two',

  props: {
    step: {
      type: Number,
      required: true,
    },
    knowledgepoints: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="less">
@import "~vars.less";

.studyprogress-step-two {
  @border: 1px dashed @border-color-base;

  &__weak {
    margin-bottom: 40px;
    font-size: 14px;

    & > ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 1em 1em 0;
      border: @border;

      & > li {
        flex: none;
        width: 19%;
        padding: 0.2em 0;
        border: 1px solid @success-color;
        margin-bottom: 1em;
        text-align: center;
      }
    }
  }

  .tree-header {
    margin-bottom: 1em;
  }

  h4.tree-header {
    line-height: 32px;
  }
}

.ie {
  .studyprogress-step-two {
    &__weak {
      & > ul {
        overflow: hidden;

        & > li {
          float: left;

          &:not(:nth-child(5n + 1)) {
            margin-left: 1%;
          }
        }
      }
    }
  }
}
</style>

