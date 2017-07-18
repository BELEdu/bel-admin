<template>
  <div class="not-found">
    <Button type="primary" @click="reload">刷新</Button>
    <Button type="primary" @click="$router.push('/index')">返回首页</Button>
  </div>
</template>

<script>
export default {
  name: 'app-404',

  methods: {
    reload() {
      window.location.reload()
    },
  },
}
</script>

<style lang="less">
.not-found {
  width: 539px;
  height: 539px;
  padding-top: 420px;
  margin: 100px auto 0;
  background-image: url("./assets/404.png");
  background-repeat: no-repeat;
  text-align: center;

  .ivu-btn {
    width: 80px;

    &:first-child {
      margin-right: 60px;
    }
  }
}
</style>
