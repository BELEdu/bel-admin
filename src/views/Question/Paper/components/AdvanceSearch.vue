<template>
  <div class="v-advance-search">
    <dl
      class="condition"
      v-for="(item, key, index) in data"
    >
      <dt class="title">{{item.label}}</dt>
      <dd class="options">
        <Button
          class="options__all"
          size="small"
          :type="
            !$route.query[key] ? 'primary' : 'text'
          "
          @click="onChooseOption(key)"
        >全部</Button>
        <Button
          v-for="option in item.data"
          class="options__item"
          :type="
            $route.query[key] === String(option.value)
              ? 'primary'
              : 'text'
          "
          :key="option.value"
          @click="onChooseOption(key, String(option.value))"
        >
          {{option.display_name}}
        </Button>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'v-advance-search',

  props: {
    // 高级搜索条件数据
    data: {
      type: Object,
      required: true,
    },
  },

  methods: {
    onChooseOption(key, value) {
      // 重复点击无动作
      if (this.$route.query[key] === value) return
      // 数据初始化
      const query = this.$route.query
      const path = this.$route.path
      // 选择全部则移除条件
      if (!value) {
        // 更新路由
        const { [key]: filter, ...rest } = query
        this.$router.push({
          path,
          query: { ...rest },
        })
      // 有效更新条件
      } else {
        // 更新路由
        this.$router.push({
          path,
          query: { ...query, ...{ [key]: value } },
        })
      }
    },
  },
}
</script>

<style lang="less">
@import '~vars';
@import '../mixins/paper.less';

.v-advance-search {
  font-size: 14px;

  & .condition {
    .condition();
  }
}
</style>
