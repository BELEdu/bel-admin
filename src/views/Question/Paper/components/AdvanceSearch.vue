<template>
  <div class="v-advance-search">
    <dl
      class="condition"
    >
      <dt class="title">{{label}}</dt>
      <dd class="options">
        <Button
          class="options__all"
          size="small"
          :type="
            !$route.query[tag] ? 'primary' : 'text'
          "
          :disabled="$route.query[tag] && readonly"
          @click="onChooseOption(tag)"
        >全部</Button>
        <Button
          v-for="option in data"
          class="options__item"
          :type="
            $route.query[tag] === String(option.value)
              ? 'primary'
              : 'text'
          "
          :disabled="
            readonly
            && $route.query[tag] !== String(option.value)
          "
          :key="option.value"
          @click="onChooseOption(tag, String(option.value))"
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
    // 中文标识
    label: {
      type: String,
      required: true,
    },
    // queryKey
    tag: {
      type: String,
      required: true,
    },
    // 高级搜索条件数据
    data: {
      type: Array,
      required: true,
    },
    // 是否禁止变更
    readonly: {
      type: Boolean,
      default: false,
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
