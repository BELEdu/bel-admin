<template>
  <div class="v-advance-search">
    <dl
      class="condition"
      v-for="(item, key, index) in data"
    >
      <dt class="condition-title">{{item.label}}</dt>
      <dd class="condition-options">
        <span
          :class="{
            'condition-options__all': true,
            'active': !opts[key],
          }"
          @click="onChooseOption(key)"
        >全部</span>
        <span
          v-for="option in item.data"
          :class="{
            'condition-options__item': true,
            'active': opts[key] === String(option.value),
          }"
          @click="onChooseOption(key, option.value)"
        >
          {{option.display_name}}
        </span>
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

  data: () => ({
    // 条件集合，以及当前选中状态
    opts: {},
  }),

  methods: {
    onChooseOption(key, value) {
      // 重复点击无动作
      if (this.$route.query[key] === value) return
      // 数据初始化
      const query = this.$route.query
      const path = this.$route.path
      // 选择全部则移除条件
      if (!value) {
        // 更新视图选中状态
        this.opts[key] = value
        // 更新路由
        const { [key]: filter, ...rest } = query
        this.$router.push({
          path,
          query: { ...rest },
        })
      // 有效更新条件
      } else {
        // 更新视图选中状态
        this.opts[key] = String(value)
        // 更新路由
        this.$router.push({
          path,
          query: { ...query, ...{ [key]: value } },
        })
      }
    },
  },

  created() {
    Object.keys(this.data).forEach((key) => {
      this.$set(
        this.opts,
        key,
        this.$route.query[key],
      )
    })
    console.log(this.opts)
  },
}
</script>

<style lang="less">
@import '~vars';

@item-height: 26px;

.v-advance-search {
  font-size: 14px;

  & .condition {
    line-height: @item-height;

    &-title {
      float: left;
      margin-right: 10px;
      padding: 0 10px;
      font-weight: bold;
    }

    &-options {
      margin-top: 10px;
      overflow-x: hidden;

      & > span {
        display: inline-block;
        cursor: pointer;

        &:hover {
          color: @info-color;
        }
      }

      &__all {
        padding: 0 10px;
      }

      &__item {
        margin-left: 10px;
        padding: 0 5px;
      }
    }
  }

  & .active {
    background-color: @primary-color;
    color: #fff !important;
  }
}
</style>
