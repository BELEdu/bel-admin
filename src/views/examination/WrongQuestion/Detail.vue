<template>
  <div class="examination-wrongquestion-detail">
    <ThePaper
      ref="composition"
      :question-config="{
        select: false,
      }"
    >
      <!-- 上部 学生信息条 -->
      <template
        slot="header"
        slot-scope="props"
      >
        <h2
          v-if="props.data.student_name"
          class="examination-wrongquestion-detail__student"
        >
          <span>学员姓名：{{props.data.student_name}}</span>
          <span>学员编号：{{props.data.student_number}}</span>
        </h2>
        </template>

      <!-- 底部 进阶学习 -->
      <template
        slot="improvement"
        slot-scope="props"
      >
        <h1
          class="examination-wrongquestion-detail__title"
        >
          进阶学习
        </h1>
        <!--
          等进阶学习的接口出来后，去掉slot
          直接在这个组件里拿数据，控制分页数量为5
        -->
        <PaperCompositionQuestion
          v-for="question in props.data"
          :key="question.number"
          :data="question"
          v-update:config="{ select: false }"
        />

        <div
          style="
            padding-top: 10px;
            text-align: right;
          "
        >
          <Button
            type="text"
            @click="$router.push('/prepare/question')"
          >
            查看更多 》》
          </Button>
        </div>
      </template>
    </ThePaper>
  </div>
</template>

<script>
import {
  PaperCompositionQuestion,
  ThePaper,
} from '@/views/components'

export default {
  name: 'ExaminationWrongQuestionDetail',

  components: {
    PaperCompositionQuestion,
    ThePaper,
  },

  directives: {
    update: {
      bind(el, { value, arg }, vnode) {
        if (value) {
          // eslint-disable-next-line
          vnode.componentInstance[arg] = {
            ...vnode.componentInstance[arg],
            ...value,
          }
        }
      },
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.$refs.composition.m_fetchData(to)
    next()
  },

  mounted() {
    this.$refs.composition.m_fetchData(this.$route)
  },
}
</script>

<style lang="less">
@import '~vars';

.examination-wrongquestion-detail {
  width: 1160px;

  &__student {
    border-bottom: 1px solid @border-color-base;
    text-align: right;

    & span {
      margin-left: 10px;
    }
  }

  &__title {
    margin-top: 20px;
    border-bottom: 1px solid @border-color-base;
  }
}
</style>
