<template>
  <Form-item label="数据权限">
    <Checkbox-group class="data-permi" :value="value" @input="updateValue">
      <Checkbox v-for="item in data" :key="item.id" :label="item.id">
        <span>{{ item.display_name }}</span>
      </Checkbox>
    </Checkbox-group>
  </Form-item>
</template>

<script>
/**
 * 数据权限表单组件
 * @author lmn
 * @param {Array} data - 数据权限数组
 * @version 2017-06-27
 */

export default {
  props: {
    data: {
      type: Array,
      requierd: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.data-permi {
  border: 1px solid @border-color-base;

  .ivu-checkbox-group-item {
    margin: 0;
    line-height: normal;
  }

  display: flex;
  flex-wrap: wrap;
  padding: 5px 0;

  .ivu-checkbox-group-item {
    flex-basis: 25%;
    padding: 5px 15px;
  }
}
</style>
