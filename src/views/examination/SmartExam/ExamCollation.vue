<template>
  <div class="examcollation">
    <!-- 学员试卷信息：姓名、得分等 -->
    <dl class="examcollation__info">
      <dt>学员姓名：</dt>
      <dd>王芳</dd>
      <dt>测试时间：</dt>
      <dd>2017-06-06  09：00-11：00</dd>
      <dt>试卷总分：</dt>
      <dd>150</dd>
      <dt>学生得分：</dt>
      <dd>60</dd>
      <dt>试卷名称：</dt>
      <dd>数学试卷120分（单选题10+填空题6+解答题8）随机0001</dd>
    </dl>
    <!-- end 学员试卷信息：姓名、得分等 -->
    <!-- 批卷列表 -->
    <Table :data="fdata" :columns="fcol" border></Table>
    <!-- end 批卷列表 -->    
  </div>
</template>

<script>
/**
 * 测试管理 - 批阅试卷
 * @author hjz
 * @version 2017-07-05
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data() {
    return {
      fcol: [
        { key: 1, title: '题序', align: 'center' },
        { key: 2, title: '题型', align: 'center' },
        { key: 3, title: '题目内容', align: 'center' },
        { key: 4, title: '知识点', align: 'center' },
        {
          key: 5,
          title: '知识点',
          align: 'center',
          render: h => h(
            'div',
            [
              // 得分
              h(
                'h1',
                {
                  style: {
                    'text-align': 'right',
                  },
                },
              ),
              // 知识点列表
              h(
                'dl',
              ),
              // 批改
              h(
                'dl',
                [
                  // 文字
                  h(
                    'dt',
                    '批改',
                  ),
                  // 按钮
                  h(
                    'dd',
                    [
                      //
                    ],
                  ),
                ],
              ),
            ],
          ),
        },
      ],
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import "~vars";
@import "~mixin";

.examcollation {
  width: @content-max-width;

  &__info {
    .clearfix();
    margin-bottom: 30px;
    border-top: 1px solid @border-color-base;
    font-size: 14px;

    &>dt {
      float: left;
      background-color: @bg-color;
      padding: 10px 10px;
      border-bottom: 1px dashed @border-color-split;
      width: 15%;
      text-align: right;

      &:last-of-type {
        border-bottom: 1px solid @border-color-base;
      }
    }

    &>dd {
      float: left;
      padding: 10px 10px;
      border-bottom: 1px dashed @border-color-split;      
      width: 35%;

      &:last-of-type {
        width: 85%;
        border-bottom: 1px solid @border-color-base;
      }
    }
  }
}

</style>
