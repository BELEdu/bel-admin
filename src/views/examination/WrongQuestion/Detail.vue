<template>
  <PrepareQuestion
    class="examination-wrongquestion-detail"
    ref="composition"
    compositionType="readOnly"
  >
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
}
</script>

<style lang="less">
@import '~vars';

.examination-wrongquestion-detail {

  &__title {
    margin-top: 20px;
    border-bottom: 1px solid @border-color-base;
  }
}
</style>
