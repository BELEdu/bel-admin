<template>
  <div>
    <h3 class="studyprogress-edit__sub-title">学习计划</h3>
    <transition-group class="studyprogress-lessons" name="lessons" tag="ul">
      <li v-for="lesson, index in lessons" :key="lesson">
        <div>第{{ index + 1 }}节课</div>
        <Form-Item label="计划课时" class="original" :label-width="100">
          <Input class="original" type="text" placeholder="输入课时" v-model="lessons[index].time"></Input>
        </Form-Item>
        <Form-Item label="知识点" class="original studyprogress-lessons__knowledgepoints" :label-width="0">
          <Select class="original" multiple filterable v-model="lessons[index].knowledgepoints">
            <Option
              v-for="option in options"
              :value="option.value"
              :disabled="option.disabled"
            >{{ option.label }}</Option>
          </Select  >
        </Form-Item>
        <div :style="{visibility: lessons.length > 1 ? 'visible' : 'hidden'}" v-show="step !== 3">
          <Button type="text" @click="$emit('removeLesson', index)">删除</Button>
          <Button type="text" icon="arrow-up-c" @click="$emit('sortLesson', index, -1)"></Button>
          <Button type="text" icon="arrow-down-c" @click="$emit('sortLesson', index, 1)"></Button>
        </div>
      </li>
    </transition-group>

    <div class="text-center">
      <Button
        type="dashed" icon="plus" class="color-primary" size="large"
         v-show="step < 3" @click="$emit('addLesson')"
      >增加计划</Button>
    </div>
  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 创建/编辑计划 - 第三部分
 * @author lmh
 * @version 2017-06-29
 */

export default {
  name: 'app-student-studyprogress-edit-three',

  props: {
    step: {
      type: Number,
      required: true,
    },
    lessons: {
      type: Array,
      required: true,
    },
    selectedData: {
      type: Array,
      required: true,
    },
  },

  computed: {
    options() {
      return this.selectedData
        .map(({ title, children }) => ({
          title,
          children: children.map(({ title: value }) => ({
            label: value,
            value,
          })),
        }))
        .reduce((result, item) => [
          ...result,
          { label: item.title, value: '', disabled: true },
          ...item.children,
        ], [])
    },
  },
}
</script>

<style lang="less">
@import "~vars.less";

.studyprogress-lessons {
  margin-bottom: 20px;

  & > li {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    & > * {
      flex: none;
    }
  }

  &__knowledgepoints {
    flex: auto !important;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    & > .ivu-form-item-label {
      flex: none;
    }

    & > .ivu-form-item-content {
      flex: auto;
      margin-left: 0 !important;
    }
  }

  .ivu-form-item-label {
    padding-right: 1em;
  }

  .ivu-form-item {
    margin-bottom: 0;
  }

  .ivu-btn-icon-only {
    font-size: 18px;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
}

.lessons-enter-active,
.lessons-leave-active {
  transition: opacity 0.3s;
}

.lessons-enter,
.lessons-leave-to {
  opacity: 0;
}

.lessons-move {
  transition: transform 0.5s;
}

.ie {
  .studyprogress-lessons {
    & > li {
      & > * {
        display: inline-block;
        vertical-align: middle;
      }
    }

    &__knowledgepoints {
      width: 55%;

      & > * {
        display: inline-block;
        vertical-align: middle;
      }

      .ivu-form-item-content {
        width: calc(~"100% - 120px");
      }
    }
  }
}
</style>

