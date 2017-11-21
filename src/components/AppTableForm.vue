<template>
  <Form inline class="app-search-form app-search-form-layout" @submit.native.prevent="search">
    <slot></slot>
    <!-- 查询按钮 -->
    <Form-item>
      <Button
        type="primary"
        icon="ios-search"
        @click="search"
      >
        搜索
      </Button>
    </Form-item>
  </Form>
</template>

<script>
  /**
   * 列表查询表单外壳
   * @author chenliangshan
   * @version 2017-11-21
   */

  export default {
    name: 'AppTableForm',

    methods: {
      search() {
        this.$emit('on-submit')
      },
    },
  }
</script>
