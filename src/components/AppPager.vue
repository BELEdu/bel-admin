<template>
  <div class="app-page clearfix" v-if="data.total > data.per_page">
    <div class="app-page__info">
      显示第 <em>{{data.from}}</em> 至 <em>{{data.to}}</em> 项结果，共 <em>{{data.total}}</em> 项
    </div>

    <Page
      :total="data.total"
      :page-size="data.per_page"
      :current="data.current_page"
      :page-size-opts="[10, 20, 30, 40, 50]"
      @on-change="page => $emit('on-change', page)"
      @on-page-size-change="pageSize => $emit('on-page-size-change', pageSize)"
      show-elevator
      show-sizer
    ></Page>
  </div>
</template>

<script>
/**
 * 分页组件
 * @author lmh
 * @param {Object} data - laraval翻页对象
 * @version 2017-06-09 补全逻辑，改进结构和样式
 */

export default {
  props: {
    // data: {
    //   type: Object,
    //   default: () => ({
    //     current_page: 1,
    //     data: [],
    //     from: 1,
    //     last_page: 1,
    //     next_page_url: null,
    //     per_page: 10,
    //     prev_page_url: null,
    //     to: 1,
    //     total: 0,
    //   }),
    // },
    // 测试使用
    data: {
      type: Object,
      default: () => ({
        current_page: 1,
        data: [],
        from: 1,
        last_page: 20,
        next_page_url: null,
        per_page: 10,
        prev_page_url: null,
        to: 10,
        total: 110,
      }),
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.app-page {
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 80px; // 解决分页条数下拉框造成滚动条的问题
  margin-top: 30px;

  &__info {
    margin-left: 90px;
    margin-right: auto;

    & > em {
      color: @primary-color;
      font-style: normal;
    }
  }

  .ivu-page-options-sizer {
    position: absolute;
    left: 0;
  }
}

// 兼容ie9
.ie {
  .app-page {
    &__info {
      float: left;
      line-height: 32px;
    }

    .ivu-page {
      float: right;
    }
  }
}
</style>
