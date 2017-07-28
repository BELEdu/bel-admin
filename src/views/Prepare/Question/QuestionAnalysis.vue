<template>
  <article class="questionanalysis">
    <header>
      <h1>题目详情</h1>
    </header>
    <section>
      <dl>
        <dt>【题目内容】</dt>
        <dd>如图所示。。。。。。</dd>
      </dl>
    </section>
    <section>
      <dl>
        <dt>【知识点】</dt>
        <dd>从自然数到有理数-有理数的分类</dd>
        <dt>【答案】</dt>
        <dd>D</dd>
        <dt>【解析】</dt>
        <dd>{{`由题意可知a <0 < 1 < b，所以a+b>0，b-a>0，所以原式= - a+b+a+b+b =  -a+3b.故选：D`}}</dd>
      </dl>
    </section>
    <footer>
      <span>来源：福建省厦门市2017年模拟考试</span>
      <span>难度系数：0.55-0.41(较难）</span>
      <span>题型：单选题</span>
    </footer>
  </article>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {
  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';

@unit-margin-left: 100px;
@block-padding: 15px;
@block-border-split: 1px solid @border-color-split;
@font-size-content: 14px;

.questionanalysis {
  border: 1px solid @border-color-base;
  border-radius: 4px;
  box-shadow: 0 0 1px 1px @bg-color;
  padding-top: @block-padding;

  & > :not(header) {
    padding-left: @block-padding*2;
    padding-right: @block-padding*2;
  }

  & > header {
    border-bottom: @block-border-split;
    padding-left: @block-padding;
    padding-bottom: @block-padding;
  }

  & > section {
    border-bottom: @block-border-split;
    padding-top: @block-padding;
    padding-bottom: @block-padding;
    font-size: @font-size-content;

    & > dl {
      font-size: @font-size-content;

      & > dt {
        float: left;
        width: @unit-margin-left;
      }

      & > dd {
        margin-left: @unit-margin-left;
      }
    }
  }

  & > footer {
    line-height: @block-padding*3;
    font-size: @font-size-content;
    color: @subsidiary-color;

    & > :not(:first-child) {
      float: right;
    }

    & > :last-child {
      margin-right: 100px;
    }
  }
}
</style>

