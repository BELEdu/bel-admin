<template>
  <div class="condition-radio-group">
    <span class="condition-radio-group__title">{{label}}</span>
    <div class="condition-radio-group__options">
      <Button
        class="condition-radio-group__options--all"
        size="small"
        :type="
          !$route.query[tag] ? 'primary' : 'text'
        "
        :disabled="$route.query[tag] && readonly"
        @click="onChooseOption(tag)"
      >
        全部
      </Button>
      <Button
        v-for="option in data"
        class="condition-radio-group__options-item"
        :key="option.value"
        :type="
          $route.query[tag] === String(option.value)
            ? 'primary'
            : 'text'
        "
        :disabled="
          readonly
          && $route.query[tag] !== String(option.value)
        "
        @click="onChooseOption(tag, String(option.value))"
      >
        {{option.display_name}}
      </Button>
    </div>
  </div>
</template>

<script>
/**
 * 公共组件 - button式radio组件
 *
 * @author huojinzhao
 */

export default {
  name: 'ConditionRadio',

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
@import './style/conditionRadio';

.condition-radio-group {
  .condition-radio-group();
}
</style>
