<template>
  <Modal
   :value="value"
   @input="value => $emit('input', value)"
   width="900"
   title="查看计划"
  >
    <edit-plan :initialStep="4"></edit-plan>
  </Modal>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 历史计划 - 查看计划弹窗
 * @author zml
 * @version 2017-07-04
 */

import EditPlan from './EditPlan'

export default {
  name: 'app-student-studyprogress-detail-history-modal',

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    EditPlan,
  },

}
</script>

<style lang="less">
</style>
