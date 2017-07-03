<template>
  <div class="paperpreview">
    <!-- 边栏配置 -->
    <aside>
      <!-- 试卷结构选择 -->
      <Select v-model="paperStructure">
        <Option :value="1">默认结构</Option>
        <Option :value="2">标准结构</Option>
        <Option :value="3">结构结构</Option>
        <Option :value="4">作业结构</Option>
      </Select>
      <!-- end 试卷结构选择 -->
      <!-- 试卷结构自定义选择 -->
      <ul>
        <li v-for="item in paperUnit" :key="item">
          <Checkbox label="twitter" @click="two()"></Checkbox>
          <i class="ivu-icon ivu-icon-edit" @click="one()"></i>
          <span>{{item}}</span>
        </li>
      </ul>
      <!-- end 试卷结构自定义选择 -->      
    </aside>
    <!-- end 边栏配置 -->
    <!-- 试卷部分 -->
    <main>
      <!-- 装订线 -->
      <aside></aside>
      <!-- end 装订线 -->
      <!-- 试卷内容主题 -->
      <article class="paperpreview__content">
        <!-- 试卷头部 -->
        <!-- 注释部分暂时不加 -->
        <header>
          <!--<p>绝密*启用前</p>-->
          <h1>主标题</h1>
          <!--<h2>副标题</h2>-->
          <p>考试范围：xxx；考试时间：100分钟；命题人：xxx</p>
          <p>班级：___________考号：___________</p>
          <Table class="paperpreview__content-point" :columns="fconfig" :data="fdata" size="small" border>
          </Table>
          <p>
            注意事项：本卷包含Ⅰ. Ⅱ两卷，第一卷为选择题，所有答案必须用2B铅笔涂在答题卡中相应的位置。第Ⅱ圈为非选择题，所有答案必须填在答案卷的相应位置。答案写在试卷上均无效，不予计分。
          </p>
        </header>
        <!-- end 试卷头部 -->
        <!-- 题型部分 -->
        <section v-for="index in 3" :key="index">
          <div
              class="paperpreview__section"
              :class="{ 'paperpreview__section--selected': sectionSelected[index-1] }"
          >
            <!-- 题型标题 -->
            <h3 
                class="paperpreview__section-title"
                @mouseenter="titleEnter(index - 1)"
                @mouseleave="titleLeave(index - 1)"
            >
              <dl>
                <dt>得分</dt>
                <dd></dd>
              </dl>
              <span>一、 选择题 （ 本大题共2小题，共6.0分）</span>
              <!-- 标题控制条 -->
              <div class="paperpreview__section-control">
                <span>分值</span>
                <InputNumber size="small"></InputNumber>
                <Button size="small">查看解析</Button>
                <Button size="small">换题</Button>
                <Button size="small">删除</Button>
                <Button size="small">上移</Button>
                <Button size="small">下移</Button>
              </div>
              <!-- end 标题控制条 -->              
            </h3>
            <!-- end 题型标题 -->
            <!-- 题目列表 -->
            <ul class="paperpreview__topics">
              <li v-for="i in 5" :key="i" class="paperpreview__topic">
                1. 一副含30°和45°角的三角板ABC和DEF叠合在一起，边BC与EF重合，BC=EF=12cm（如图1），点G为边BC（EF）的中点，边FD与AB相交于点H，此时线段BH的长是 ______ ．现将三角板DEF绕点G按顺时针方向旋转（如图2），在∠CGF从0°到60°的变化过程中，点H相应移动的路径长共为 ______ ．（结果保留根号）
                <div class="paperpreview__topic-control">
                  <span>分值</span>
                  <InputNumber size="small"></InputNumber>
                  <Button size="small">查看解析</Button>
                  <Button size="small">换题</Button>
                  <Button size="small">删除</Button>
                  <Button size="small">上移</Button>
                  <Button size="small">下移</Button>
                </div>
              </li>
            </ul>
            <!-- end 题目列表 -->
          </div>
        </section>
        <!-- end 题型部分 -->
      </article>
      <!-- end 试卷内容主题 -->
    </main>
    <!-- end 试卷部分 -->
  </div>
</template>

<script>
/**
 * 题库列表 - 试卷预览
 * @author hjz
 * @version 2017-06-30
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data: () => ({
    paperStructure: 1,
    paperUnit: [
      '试卷标题',
      // '副标题',
      '装订线',
      // '保密标记',
      // '试卷信息',
      '试卷信息栏',
      '考生输入栏',
      '誊分栏',
      '注意事项栏',
    ],
    fconfig: [
      { key: 1, title: '题号', align: 'center', width: 60 },
      { key: 2, title: '一', align: 'center', width: 60 },
      { key: 3, title: '二', align: 'center', width: 60 },
      { key: 4, title: '三', align: 'center', width: 60 },
      { key: 5, title: '四', align: 'center', width: 60 },
      { key: 6, title: '总分', align: 'center', width: 60 },
    ],
    fdata: [
      {
        1: '得分',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      },
    ],
    // section-title hover时候section显示边框
    sectionSelected: [false, false, false],
  }),

  methods: {
    one() {
      window.console.log('one')
    },
    two() {
      window.console.log('two')
    },
    titleEnter(index) {
      this.$set(this.sectionSelected, index, true)
    },
    titleLeave(index) {
      this.$set(this.sectionSelected, index, false)
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';

@gutter-block: 8px;
@gutter-unit: 6px;
@padding: 10px;
@bd-radius: 4px;
@bd-base: 1px solid @border-color-base;
@bd-primary: 1px solid @primary-color;
@color-font-select: #fff;
@small-font: 12px;
@mid-font: 14px;
@large-font: 16px;

// 试卷section、topic hover mixin
.hoverbar() {
  position: absolute;
  right: 0;
  top: 0;
  display: none;
  border-bottom: @bd-primary;
  border-left: @bd-primary;
  border-radius: @bd-radius;
  background-color: @color-font-select;
  padding: @gutter-unit/2;

  & .ivu-input-number {
    margin-right: 10px;
    border-color: @primary-color;
    width: 60px;
  }

  & button {
    border-color: @primary-color;
    background-color: @color-font-select;
    color: @primary-color;

    &:hover {
      border-color: @primary-color;
      background-color: @primary-color;
      color: @color-font-select;
    }
  }

  &>span {
    margin: 0 @gutter-unit/2;
    vertical-align: middle;
    color: @primary-color;
  }
}

.paperpreview {
  display: flex;
  width: 1160px;
  align-items: flex-start; 
  
  // 边栏配置
  &>aside {
    margin-right: @gutter-block;
    border-radius: @bd-radius;
    border: @bd-base;
    padding: @padding;
    width: 200px;
    font-size: @mid-font;
    flex-shrink: 0; 
    
    // 试卷结构自定义选择
    &>ul {
      margin-top: 10px;

      &>li {
        padding-top: @gutter-unit;

        &>span {
          vertical-align: middle;
        }
      }
    }
  } 
  
  // 试卷部分
  &>main {
    position: relative;
    border: @bd-base;
    border-radius: @bd-radius;
    padding: @padding;
    min-height: 603px;
    flex-grow: 1; 
    
    // 装订线
    &>aside {
      position: absolute;
      top: 15px;
      width: 100px;
      height: 573px;
      background: url('./assets/g_paper_header.gif') no-repeat;
      cursor: pointer;

      &:hover {
        background-position-x: -100px;
      }
    }
  }
}

// 试卷内容
.paperpreview__content {
  margin-left: 100px;
  padding-left: @padding; 
  
  // 试卷头部
  &>header {
    padding-top: 10px;
    text-align: center;

    &>p {
      font-size: @mid-font;
      margin-top: @gutter-unit;
      margin-bottom: @gutter-unit;

      // 保密标记左对齐
      // &:first-of-type {
      //   text-align: left;
      // }

      &:last-of-type {
        padding: 10px 30px;
        text-align: left;
        font-weight: bold;
      }
    }

    & .ivu-table-small th,
    & .ivu-table-small td,
    {
      height: 25px !important;
    }

    & .ivu-table-cell {
      padding: 0 !important;
    }
  }

  &-point {
    margin-top: 5px;
    display: inline-block;
  }
}

// 题型样式
.paperpreview__section {

  border: 1px solid transparent;

  &--selected {
    border: @bd-primary;
    border-radius: @bd-radius;
  }

  // 题型标题样式
  &-title {
    position: relative;
    display: flex;
    padding: @padding; 
    cursor: pointer;  

    & span {
      display: inline-block;
      align-self: center;
    }

    & dl {
      display: flex;
      margin-right: 10px;
      border: @bd-base;
      border-radius: @bd-radius;
      // width: 70px;
    }

    & dt {
      text-align: center;
      border-right: @bd-base;
      font-size: @mid-font;
    }

    & dt,
    & dd {
      display: inline-block;
      width: 50px;
      height: 30px;
      line-height: 30px;
    }

    &:hover {
      border-radius: @bd-radius;
      background-color: @primary-color;
      color: @color-font-select;

      & .paperpreview__section-control {
        display: block;
      }
    }
  }

  // 标题悬浮控制条
  &-control {
    .hoverbar();
    font-size: 12px;
    font-weight: normal;
  }
}

// 题目列表
.paperpreview__topics {
  // 
}

// 题目
.paperpreview__topic {
  position: relative;
  margin-bottom: @gutter-block;
  border: 1px solid transparent;
  border-radius: @bd-radius;
  padding: @padding;
  cursor: pointer;

  &:hover {
    border: @bd-primary;

    &>.paperpreview__topic-control {
      display: block;
    }
  }

  &-control {
    .hoverbar()
  }
}


// ivu样式修复
.paperpreview {

  & .ivu-icon {
    margin-right: 2px;
    vertical-align: middle;
    cursor: pointer;

    &:hover {
      color: @link-color;
    }
  }

  & .ivu-checkbox-wrapper {
    margin-right: 2px !important;
  }

  .ivu-card-head {
    border: none;
  }
}
</style>
