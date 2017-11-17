<template>
  <div class="examination-wrongquestion-detail">
    <PrepareQuestion
      ref="composition"
      compositionType="readOnly"
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
        </template>>

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
          compositionType="readOnly"
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
    </PrepareQuestion>
  </div>
</template>

<script>
import PrepareQuestion from '@/views/Prepare/Question'
import {
  PaperCompositionQuestion,
} from '@/views/components'

export default {
  name: 'ExaminationWrongQuestionDetail',

  components: {
    PrepareQuestion,
    PaperCompositionQuestion,
  },

  beforeRouteUpdate(to, from, next) {
    this.$refs.composition.fetchData(to)
    next()
  },

  mounted() {
    this.$refs.composition.fetchData(this.$route)
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
