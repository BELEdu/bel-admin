<template>
  <div class="question-paper-composition">
    <!-- 顶部 -->
    <Form class="app-search-form app-search-form-layout">
      <!-- 年段+学科 -->
      <Form-item>
        <Select
          v-model="query['equal[subject_id]']"
          placeholder="年段学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subjects"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 搜索按钮 -->
      <Form-item>
        <Button
          type="primary" icon="ios-search"
          @click="search"
        >
          搜索
        </Button>
      </Form-item>
      <!-- 后退按钮 -->
      <Form-item>
        <Button
          type="primary" icon="arrow-return-left"
          @click="goBack"
        >
          返回
        </Button>
      </Form-item>
    </Form>

    <!-- 下部 -->
    <div class="content">
      <!-- 下左：树形搜索 -->
      <aside>
        <v-side-choosen></v-side-choosen>
      </aside>
      <!-- 下右：主体 -->
      <section>
        <!-- 上部：高级搜索 -->
        <v-advance-search
          :data="advanceConditions"
        ></v-advance-search>
        <!-- 中部：帮助条 -->
        <div class="content__help">
          <Button type="text">本页全部加入</Button>
          <span>总共<em>100000</em>题</span>
          <Page class="app-page-small" :total="100"></Page>
        </div>
        <!-- 下部：题目列表 -->
        <div
          class="content__topic"
          v-for="i in 10" :key="i"
        >
          <!-- 题目内容 -->
          <div style="height: 100px;"></div>
          <!-- 题目控件 -->
          <div class="content__topic-bar">
            <Button size="small" type="primary">加入试卷</Button>
            <Button
              size="small"
              type="primary"
              @click="toAnalysis">
              查看解析
            </Button>
            <Button size="small" type="primary">收藏题目</Button>
            <Button size="small" type="primary">换题</Button>
            <span>难度系数：
              <span>1.00-0.86</span>
            </span>
            <span>题型：单选题目</span>
          </div>
        </div>
      </section>
    </div>

    <!-- 屏幕右下角选中题目提示 -->
    <ul class="question-paper-composition__cart">
      <li v-for="i in 6" :key="i">选择题(10)</li>
      <li>
        <Button type="primary" size="small" long @click="previewPaper()">试卷预览</Button>
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 组卷中心
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import { list } from '@/mixins'
import vAdvanceSearch from './components/AdvanceSearch'
import vSideChoosen from '../components/SideChoosen'

export default {
  name: 'question-paper-composition',

  mixins: [list],

  components: {
    vAdvanceSearch,
    vSideChoosen,
  },

  data: () => ({
    // 年段选择栏数据
    query: {
      'equal[subject_id]': 1,
    },

    // 高级搜索数据
    advanceConditions: {
      grade_range_subject: {
        label: '题型',
        data: [
          {
            value: 1,
            display_name: '单选题',
          },
          {
            value: 2,
            display_name: '多选题',
          },
          {
            value: 3,
            display_name: '简答题',
          },
          {
            value: 4,
            display_name: '作图题',
          },
          {
            value: 5,
            display_name: '应用题',
          },
        ],
      },
      type: {
        label: '类型',
        data: [
          {
            value: 1,
            display_name: '历年真题',
          },
          {
            value: 2,
            display_name: '模拟题',
          },
          {
            value: 3,
            display_name: '入学测试',
          },
          {
            value: 4,
            display_name: '期末考试',
          },
          {
            value: 5,
            display_name: '期中考试',
          },
          {
            value: 6,
            display_name: '月考试卷',
          },
        ],
      },
      difficulty: {
        label: '难度',
        data: [
          {
            value: 1,
            display_name: '困难（0.26-0.40）',
          },
          {
            value: 2,
            display_name: '较难（0.26-0.40）',
          },
          {
            value: 3,
            display_name: '中等（0.26-0.40）',
          },
          {
            value: 4,
            display_name: '较易（0.26-0.40）',
          },
          {
            value: 5,
            display_name: '容易（0.26-0.40）',
          },
        ],
      },
    },
  }),

  methods: {
    goBack() {
      this.$router.push('/question/paper')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  beforeRouteUpdate(to, from, next) {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    next()
  },
}
</script>

<style lang="less">
@import '~vars';
@layout-width:    1160px;
@layout-padding:  10px;
@layout-gutter:   10px;
@border-radius:  4px;

.question-paper-composition {
  width: @layout-width;

  & .content {

    & > aside {
      float: left;
      margin-top: @layout-padding;
      padding: @layout-padding;
      height: 600px;
      width: 280px;
      border: 1px solid @border-color-base;
      border-radius: @border-radius;
    }

    & > section {
      padding-left: 20px;
      overflow: hidden;
    }

    &__help {
      margin-top: @layout-gutter;
      padding: @layout-padding;
      border-radius: @border-radius;
      background: @bg-color;

      & > button {
        margin-right: @layout-gutter;
        padding: 0;
        color: @info-color;

        &:hover {
          color: lighten(@info-color, 10%);
        }
      }

      & > span {

        & > em {
          color: @error-color;
        }
      }

      .app-page-small {
        float: right;
        margin-top: 0;
      }
    }

    &__topic {
      margin-top: @layout-gutter;
      border: 1px solid @border-color-base;
      border-radius: @border-radius;

      &-bar {
        padding: @layout-padding;
        background-color: @bg-color;

        &>span {
          float: right;
          margin-left: @layout-gutter;
          line-height: 24px;

          &>span {
            color: @error-color;
          }
        }
      }

      & button {
        margin-right: @layout-gutter;
      }
    }
  }

  &__cart {
    position: fixed;
    left: 1420px;
    bottom: 95px;
    border: 1px solid @border-color-base;
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
}
</style>
