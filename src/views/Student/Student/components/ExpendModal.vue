<template>
   <Modal
    title="课时消耗详情"
    width="600"
    :value="value"
    @input="value => $emit('input', value)"
    :maskClosable="true"
    class="expend-modal"
  >
    <p class="expend-modal__title">
      产品名称：
      <span class="color-primary">{{name}}</span>
    </p>

    <Table
      :columns="columns"
      size="small"
      :data="data"
      border
    ></Table>

    <div slot="footer">
      <Button type="ghost" size="large" @click="closeModal()">返回</Button>
    </div>
  </Modal>

</template>

<script>
/**
 * 消耗日志弹窗
 * @author zml
 * @version 2017-10-11
 */

export default {
  name: 'student-expend-modal',

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    data: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      columns: [
        { title: '上课时间', key: 'mark_date', align: 'center' },
        { title: '消耗课时数', key: 'used', align: 'center' },
        { title: '剩余课时', key: 'remain', align: 'center' },
      ],
    }
  },

  methods: {
    closeModal() {
      this.$emit('closeExpendModal')
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.expend-modal{
 &__title{
   margin-bottom: 15px;
 }
}
</style>
