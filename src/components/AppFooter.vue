<template>
  <footer class="app-footer">
    <div class="app-footer__content">
      <a href="#">BEL EDU</a>
      <span>COPYRIGHT © 2013-2019 </span>
    </div>
  </footer>
</template>

<script>
/**
 * 应用底部
 * @author zml
 * @version 2017-06-09 lmh 优化并迁移布局性样式移至layout.less
 */

export default {}
</script>

<style lang="less">
// lmh 注：
// 布局性样式已移至layout.less，除ie9下有限制外，此组件在其它浏览器下高度是自适应内容的
// 如果此处内容高度产生变化，务必同步更新layout.less中@footer-height变量以保证在ie9下有正常的样式
@import "~vars";

.app-footer {
  background-color:@border-color-split;

  &__content {
    text-align: center;
    line-height: 50px;
    color: @subsidiary-color;
    font-size: 12px;

    // 这里样式有问题，和全局不一致
    & a {
      color: inherit;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
