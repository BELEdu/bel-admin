<template>
  <div>
    <h3 class="studyprogress-edit__sub-title">课时情况</h3>
    <transition-group class="studyprogress-lessons" name="lessons" tag="ul">
      <li v-for="item, index in course" :key="item">
        <div>第 <span class="color-primary">{{ index + 1 }}</span> 节课</div>
        <Form-Item label="计划课时：" class="original" :label-width="140">
          <Input-number
           class="original"
           placeholder="输入课时"
           v-model="course[index].course_num"
           :min="1"
           @on-change="value => numInit(index, value)"
          ></Input-number>
        </Form-Item>
        <Form-Item label="知识点：" class="original studyprogress-lessons__knowledgepoints" :label-width="0">
          <Select
           multiple
           filterable
           v-model="course[index].course_knowledge"
           class="original"
           placeholder="请选择知识点"
          >
            <Option
              v-for="option in options"
              :key="option"
              :value="option.value"
              :disabled="option.disabled"
            >{{ option.label }}</Option>
          </Select  >
        </Form-Item>
        <!--假设已经排课的属性叫a 在此div上添加 v-if="!item.a"-->
        <div :style="{visibility: course.length > 1 ? 'visible' : 'hidden'}" v-show="step !== 3">
          <Button type="text" class="color-error" icon="close-circled" @click="$emit('removeLesson', index)"></Button>
          <Button type="text" class="color-primary" icon="arrow-up-c" @click="$emit('sortLesson', index, -1)"></Button>
          <Button type="text" class="color-warning" icon="arrow-down-c" @click="$emit('sortLesson', index, 1)"></Button>
        </div>
      </li>
    </transition-group>

    <div class="text-center">
      <Button
        type="dashed"
        icon="plus"
        class="color-primary"
        size="large"
        v-show="step < 4 || step === 4" @click="$emit('addLesson')"
      >增加课程</Button>
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
  name: 'app-student-studyprogress-editplan-three',

  props: {
    step: {
      type: Number,
      required: true,
    },
    course: {
      type: Array,
      required: true,
    },
    selectedData: {
      type: Array,
      required: true,
    },
  },

  computed: {
    // options() {
    //   return this.selectedData
    //     .map(({ title, children }) => ({
    //       title,
    //       children: children.map(({ title: value }) => ({
    //         label: value,
    //         value,
    //       })),
    //     }))
    //     .reduce((result, item) => [
    //       ...result,
    //       { label: item.title, value: '', disabled: true },
    //       ...item.children,
    //     ], [])
    // },
    options() {
      return [
        {
          label: '二元一次方程',
          value: 111,
        },
        {
          label: '数与式',
          value: 112,
        },
        {
          label: '有理数',
          value: 113,
        },
        {
          label: '非负数的性质：绝对值',
          value: 114,
        },
        {
          label: '无理数',
          value: 115,
        },

      ]
    },
  },

  methods: {
    numInit(index, value) { // 将手动输入的小数转换为整数
      this.course[index].course_num = parseInt(value, 10)
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

