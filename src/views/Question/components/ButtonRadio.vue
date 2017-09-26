<template>
  <div class="app-button-radio">
    <Button
      v-for="item in data" :key="item.value"
      :size="size"
      :type="item.value === value ? 'primary' : 'text'"
      :disabled="item.value !== value && readonly"
      @click="choose(item)"
    >
      {{item.display_name}}
    </Button>
  </div>
</template>

<script>
/**
 * 公共组件 - 按钮式单选组件
 *
 * @author huojinzhao
 */

export default {
  name: 'app-button-radio',

  props: {
    value: {},
    data: {
      type: Array,
      required: true,
    },
    size: {
      type: String,
      default: () => 'default',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    choose(item) {
      if (item.value === this.value) return
      this.$emit('input', item.value)
      this.$emit('change', item)
    },
  },
}
</script>

<style lang="less">
.app-button-radio {

  & > button {

    &:not(:last-child) {
      margin-right: 5px;
    }
  }
}
</style>
