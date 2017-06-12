<template>
  <Card class="rank-card">
    <p slot="title">
      <Icon :type="icon"></Icon>
      <span>{{ title }}</span>
    </p>
    <slot></slot>
  </Card>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="less">

</style>

<style lang="less">
.rank-card {
  .ivu-card-body {
    padding: 0;

    .ivu-table-wrapper {
      border: 0;
    }
  }
}
</style>

