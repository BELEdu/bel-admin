<template>
  <div class="question-paper-creation">
    <!-- 来源 -->
    <Form
      class="creation-source"
      :label-width="80"
    >
      <Form-item
        label="来源"
      >
        <Select>
          <Option value="1"></Option>
        </Select>
        <Select>
          <Option value="1"></Option>
        </Select>
        <Select v-model="schoolList" multiple>
          <Option
            v-for="school in schoolsData"
            :value="school.value"
            :label="school.label"
            :key="school.value"
          ></Option>
        </Select>
        <Icon type="android-delete"></Icon>
      </Form-item>
    </Form>
    <!-- 添加来源 -->
    <div class="creation-source__add">
      <Button
        type="dashed"
      >+增加来源</Button>
    </div>

    <!-- 编辑信息 -->
    <Form
      class="creation-info"
      :label-width="80"
    >
      <Form-item
        class="creation-info__time"
        label="时间"
      >
        <Select>
          <Option value="1"></Option>
        </Select>
      </Form-item>
      <Form-item
        :label="subject.label"
      >
        <v-button-radio
          v-model="info.subject"
          :data="subject.data"
          size="small"
        ></v-button-radio>
      </Form-item>
      <Form-item
        :label="grade.label"
      >
        <v-button-radio
          v-model="info.grade"
          :data="grade.data"
          size="small"
        ></v-button-radio>
      </Form-item>
      <Form-item
        :label="type.label"
      >
        <v-button-radio
          v-model="info.type"
          :data="type.data"
          size="small"
        ></v-button-radio>
      </Form-item>
      <Form-item
        class="creation-info__title"
        label="试卷标题"
      >
        <Input
          v-model="info.title"
        ></Input>
      </Form-item>
    </Form>

    <!-- 试卷正文 -->
    <section
      class="ivu-form creation-content"
    >
      <aside
        class="ivu-form-item-label"
      >
        试卷内容
      </aside>
      <article>
        <div
          v-for="i in 3" :key="i"
          class="section"
        >
          <!-- 题型标题 -->
          <h2>一、 选择题 （ 本大题共2小题，共6.0分）</h2>
            <!-- 题目列表 -->
          <ul class="topic">
            <li v-for="i in 5" :key="i" class="topic-item">
              1. 一副含30°和45°角的三角板ABC和DEF叠合在一起，边BC与EF重合，BC=EF=12cm（如图1），点G为边BC（EF）的中点，边FD与AB相交于点H，此时线段BH的长是 ______ ．现将三角板DEF绕点G按顺时针方向旋转（如图2），在∠CGF从0°到60°的变化过程中，点H相应移动的路径长共为 ______ ．（结果保留根号）
              <div class="topic-item__control">
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
         </div>
      </article>
    </section>
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 生成试卷
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import vButtonRadio from '../components/ButtonRadio'

export default {
  name: 'question-paper-creation',

  components: {
    vButtonRadio,
  },

  data: () => ({
    info: {
      grade: 1,
      subject: 1,
      type: 1,
      title: '',
    },

    schoolsData: [
      {
        value: 'beijing',
        label: '北京市',
      },
      {
        value: 'shanghai',
        label: '上海市',
      },
      {
        value: 'shenzhen',
        label: '深圳市',
      },
      {
        value: 'hangzhou',
        label: '杭州市',
      },
      {
        value: 'nanjing',
        label: '南京市',
      },
      {
        value: 'chongqing',
        label: '重庆市',
      },
    ],
    schoolList: [],

    grade: {
      label: '年级',
      data: [
        {
          display_name: '高一',
          value: 1,
        },
        {
          display_name: '高二',
          value: 2,
        },
        {
          display_name: '高三',
          value: 3,
        },
      ],
    },

    subject: {
      label: '文理科',
      data: [
        {
          display_name: '理科',
          value: 1,
        },
        {
          display_name: '文科',
          value: 2,
        },
        {
          display_name: '不分科',
          value: 3,
        },
      ],
    },

    type: {
      label: '类型',
      data: [
        {
          display_name: '历年真题',
          value: 1,
        },
        {
          display_name: '模拟题',
          value: 2,
        },
        {
          display_name: '入学测试',
          value: 3,
        },
        {
          display_name: '期末考试',
          value: 4,
        },
        {
          display_name: '其中考试',
          value: 5,
        },
        {
          display_name: '月考测试',
          value: 6,
        },
      ],
    },
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
@import './mixins/paper.less';

@layout-width:    975px;
@layout-padding:  10px;
@layout-gutter:   10px;

.button-dashed-color(@text, @bd: transparent) {
  border-color: @bd;
  color: @text;
  cursor: pointer;

  &:hover {
    border-color: lighten(@bd, 8%);
    color: lighten(@text, 8%);
  }
  &:active {
    border-color: darken(@bd, 8%);
    color: darken(@text, 8%);
  }
}

.question-paper-creation {
  width: @layout-width;

  & .ivu-form-item {
    margin-bottom: 20px;
  }

  & .ivu-form-item-label {
    font-size: 14px;
  }

  & .creation {

    &-source {

      & .ivu-select {
        width: 150px;

        &:last-of-type {
          width: 400px;
        }
      }

      & .ivu-icon-android-delete {
        .button-dashed-color(@warning-color);

        display: inline-block;
        margin-left: 15px;
        vertical-align: middle;
        font-size: 18px;
      }

      &__add {
        padding-left: 350px;

        & > button {
          .button-dashed-color(@info-color, @info-color);

          padding: 5px 30px;
        }
      }
    }

    &-info {

      &__time {

        & .ivu-select {
          display: inline-block;
          width: 200px;
        }
      }

      &__title {

        & .ivu-input-wrapper {
          width: 500px;
        }
      }
    }

    &-content {

      & > aside {
        width: 80px;
      }

      & > article {
        overflow: hidden;
      }

      & .section {
        .section()
      }

      & .topic {
        .topic()
      }
    }
  }
}
</style>
