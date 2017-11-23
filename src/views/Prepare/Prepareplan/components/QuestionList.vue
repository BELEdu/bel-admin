<template>
  <div class="question-list" :style="{ width: width + 'px' }">

    <ul>
      <li
        v-for="(item,index) in data"
        :key="item.id"
      >
        <!-- 题文 -->
        <question
          :index="index+1"
          :data="item"
          :width="width-40"
        ></question>

        <!-- 操作 -->
        <ButtonGroup size="small" class="question-list__actions">
          <Button
            type="primary"
            @click="openAnalysisDialog(index)"
          >查看解析</Button>

          <Button
            type="warning"
            v-if="index !== 0"
            @click="sortQuestion(index,-1)"
          >上移</Button>

          <Button
            type="warning"
            v-if="index !== (data.length-1)"
            @click="sortQuestion(index,1)"
          >下移</Button>

          <Button
            type="error"
            @click="removeQuestion(index)"
          >删除</Button>

        </ButtonGroup>

      </li>
    </ul>

    <!-- 试题解析弹窗 -->
    <question-analysis-dialog
      :visible.sync="modalActive"
      :data="currentQuestion"
    >
      <span></span>
    </question-analysis-dialog>

  </div>
</template>

<script>
/**
 * 试题展示列表，可排序编辑删除
 * @author zml
 * @version 2017-11-23
 */
import { Question, QuestionAnalysisDialog } from '@/views/components'

export default {
  name: 'question-list',

  components: {
    Question,
    QuestionAnalysisDialog,
  },

  props: {
    data: {
      type: Array,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 500,
    },
  },

  data() {
    return {
      // 当前选择的题目
      currentQuestion: {},

      // 解析弹窗控制
      modalActive: false,
    }
  },

  methods: {
    // 打开查看解析弹窗
    openAnalysisDialog(index) {
      this.modalActive = true
      this.currentQuestion = this.data[index]
    },

    // 删除试题
    removeQuestion(index) {
      this.data.splice(index, 1)
    },

    // 排序试题
    sortQuestion(index, target) {
      const list = this.data
      const node = list.splice(index, 1, list[index + target])[0]
      this.data.splice(index + target, 1, node)
    },
  },

}
</script>

<style lang="less">
@import '~vars';

@question-radius:4px;

.question-radius(){
  border-radius: @question-radius;
}

.question-list {
  margin:auto;

  &>ul {
    position: relative;
    padding: 10px;
    background-color: @bg-color;
    .question-radius();

    &>li {
      position: relative;
      margin-bottom: 10px;
      padding: 9px;
      background-color: #fff;
      border:1px solid transparent;
      .question-radius();
      cursor: pointer;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        border: 1px solid @primary-color;

        .question-list__actions{
          display: inline-block;
        }
      }

    }
  }

  &__actions {
    position: absolute;
    right: 2px;
    top: 2px;
    display:none;
  }
}

</style>
