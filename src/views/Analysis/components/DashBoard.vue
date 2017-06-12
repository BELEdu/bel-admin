<template>
  <Card class="data-dashboard">
    <p slot="title">
      <Icon class="data-dashboard__icon" :type="icon"></Icon>
      <span class="data-dashboard__title">{{ title }}</span>
    </p>
    <ul class="data-dashboard__list">
      <li v-for="item in data" class="data-dashboard__item" :style="itemStyle">
        <div>{{ item.label }}</div>
        <div>{{ item.value }}</div>
      </li>
    </ul>
  </Card>
</template>

<script>
/**
 * 数据统计面板
 * @author lmh
 * @param {String} [icon] - 标题图标名称
 * @param {String} title - 标题文字
 * @param {Object[]} data - 展示数据
 * @param {String} data[].label - 标签
 * @param {String} data[].value - 值
 * @version 2017-06-07
 */

export default {
  props: {
    icon: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },

  computed: {
    itemStyle() {
      return {
        'flex-basis': `calc(100% / ${this.data.length}`,
      }
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.data-dashboard {
  margin-bottom: 30px;

  .ivu-card-body {
    padding: 0;
  }

  &__icon,
  &__title {
    vertical-align: middle;
  }

  &__icon {
    font-size: 22px;
    margin-right: 8px;
  }

  &__title {
    font-size: 18px;
  }

  &__list {
    display: flex;
    height: 120px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    &:not(:last-child) {
      border-right: 1px solid @border-color-base;
    }

    & > div:last-child {
      margin-top: 0.8em;
      font-size: 24px;
    }
  }
}
</style>
