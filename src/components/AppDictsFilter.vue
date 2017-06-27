<template>
  <span v-bind:class="className">{{displayName}}</span>
</template>

<script>
  /**
   * 过滤字典
   */
  export default{
    name: 'app-dicts-filter',
    props: {
      // 字段value
      value: {
        type: Number,
        required: true,
      },
      // 字典所属字段
      name: {
        type: String,
        default: 'schedule_status', // 默认-课时状态字典
      },
    },
    data() {
      return {
        displayName: '',
        className: '',
      }
    },
    mounted() {
      this.dictsFilter(this.value)
    },
    update() {
      this.dictsFilter(this.value)
    },
    methods: {
      dictsFilter(status = this.value) {
        this.displayName =
          this.dicts[this.name] &&
          this.dicts[this.name].filter(item => item.value === status)[0].display_name
        switch (this.name) {
          // 课时状态
          case 'schedule_status':
            this.className = this.scheduleStyle(status)
            break
          default :
            break
        }
      },
      scheduleStyle(status) {
        let styleName
        const defStyle = 'schedule'
        switch (status) {
          case 0:
            // 待确认
            styleName = 'combo'
            break
          case 1:
            // 已排定
            styleName = 'verify'
            break
          case 2:
            // 已上课
            styleName = 'finish'
            break
          default :
            // 已取消
            styleName = 'cancel'
            break
        }
        return `${defStyle}-${styleName}`
      },
    },
    computed: {
      dicts() {
        return this.$store.state.dicts
      },
    },
    watch: {
      value(val) {
        this.dictsFilter(val)
      },
      dicts() {
        this.dictsFilter()
      },
    },
  }
</script>

<style lang="less">
  .schedule {
    &-combo {
      color: #e47fa9;
    }
    &-verify {
      color: #e5bb79;
    }
    &-finish {
      color: #66bae5;
    }
    &-cancel {
      color: #cccccc;
    }
  }
</style>
