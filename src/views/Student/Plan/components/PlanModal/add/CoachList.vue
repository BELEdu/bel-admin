<template>
  <div class="add-coach-list">
    <list-coach
      @on-success="onSubmit"
      @on-error="() => this.$emit('on-error')"
    ></list-coach>
  </div>
</template>

<script>
  /**
   * 添加计划列表
   * @author chenliangshan
   * @version 2017-10-15
   */

  import { mapState } from 'vuex'
  import { broadcast } from '@/mixins'
  import ListCoach from '../ListCoach'

  export default {
    name: 'add-coach-list',

    mixins: [broadcast],

    components: {
      ListCoach,
    },

    data() {
      return {

      }
    },

    computed: {
      ...mapState({
        currentItem: state => state.student.plan.currentItem,
      }),
    },

    methods: {
      onSubmit(item) {
        const { id } = this.currentItem.data
        this.$http.post(`/plan/${id}`, { classes_id: id, course: item })
          .then(() => {
            this.$Message.success('成功添加学习计划！')
            this.$emit('on-success', { close: true })
          })
          .catch(() => {
            this.$emit('on-error')
          })
      },

    },

    mounted() {
      this.$on('on-submit', (data) => {
        this.broadcast('list-coach', 'on-submit', data)
      })
      this.$on('on-reset', (data) => {
        this.broadcast('list-coach', 'on-reset', data)
      })
    },
  }
</script>

<style lang="less" scoped>
  .add-coach-list {
    &__header {
      text-align: right;
      padding-bottom: 10px;

      &-course-remain {

      }
    }
  }
</style>
