<template>
  <div class="question-knowledge-edition">
    <aside>
      <v-side-choosen></v-side-choosen>
    </aside>
    <section>
      <div class="edition-item" v-for="i in 10" :key="i">
        <h3>
          知识点名称:
          <span>平行线</span>
          <i class="ivu-icon ivu-icon-android-delete"></i>
        </h3>
        <Form :label-width="80" inline>
          <Form-item
            label="理科频次"
          >
            <InputNumber></InputNumber>
          </Form-item>
          <Form-item
            label="理科分值"
          >
            <InputNumber></InputNumber>
          </Form-item>
          <Form-item
            label="文科频次"
          >
            <InputNumber></InputNumber>
          </Form-item>
          <Form-item
            label="文科分值"
          >
            <InputNumber></InputNumber>
          </Form-item>
          <!-- <Form-item
            label="考试频次"
          >
            <InputNumber></InputNumber>
          </Form-item>
          <Form-item
            label="考试分值"
          >
            <InputNumber></InputNumber>
          </Form-item> -->
        </Form>
      </div>
    </section>
    <footer>
      <Button
        type="ghost"
        @click="cancel"
      >取消</Button>
      <Button
        type="primary"
        @click="confirm"
      >确认</Button>
    </footer>
  </div>
</template>

<script>
/**
 * 题库中心 - 知识点 - 批量编辑
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import vSideChoosen from '../components/SideChoosen'

export default {
  name: 'question-knowledge-edition',

  components: {
    vSideChoosen,
  },

  methods: {
    cancel() {
      this.$router.push('/question/knowledge')
    },

    confirm() {
      //
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';

@content-width: 975px;

.question-knowledge-edition {
  width: @content-width;

  & > aside {
    float: left;
    width: 280px;
    height: 600px;
    padding: 10px;
    border: 1px solid @border-color-base;
    border-radius: 4px;
  }

  & > section {
    padding-left: 20px;
    overflow-x: hidden;
  }

  & > footer {
    padding-left: 300px;
    text-align: center;

    & > button {
      width: 80px;
    }

    & > button:first-child {
      margin-right: 20px;
    }
  }

  & .edition-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid @border-color-base;
    border-radius: 4px;

    & > h3 {
      margin-bottom: 15px;
      font-size: 18px;

      & > i {
        float: right;
        font-size: 26px;
        color: @warning-color;
        cursor: pointer;

        &:hover {
          color: lighten(@warning-color, 10%);
        }
      }
    }

    & .ivu-input-number {
      width: 200px;
    }
  }
}
</style>
