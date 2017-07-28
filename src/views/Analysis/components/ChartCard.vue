<template>
  <Card class="analysis-chart-card">
    <p slot="title">{{ title }}</p>
    <Tabs value="7" class="analysis-chart-tabs" @on-click="handleClick">
      <Tab-pane label="最近7天" name="7"></Tab-pane>
      <Tab-pane label="最近15天" name="15"></Tab-pane>
      <Tab-pane label="最近30天" name="30"></Tab-pane>
    </Tabs>
    <slot></slot>
  </Card>
</template>

<script>
export default {
  name: 'chart-card',

  props: {
    title: {
      type: String,
      required: true,
    },
    chart: {
      type: Object,
    },
  },

  methods: {
    handleClick(range) {
      this.$emit('on-change', range, this.chart)
    },
  },
}
</script>

<style lang="less">
.analysis-chart-card {
  margin-top: 40px;
}

.analysis-chart-tabs {
  text-align: center;

  .ivu-tabs-bar {
    display: inline-block;
  }
}
</style>
