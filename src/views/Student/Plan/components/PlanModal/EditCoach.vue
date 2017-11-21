<template>
  <div class="edit-coach-list">
    <list-coach
      @on-success="onSubmit"
      @on-error="(errors) => this.$emit('on-error', errors || {})"
    ></list-coach>
  </div>
</template>

<script>
  /**
   * 学习计划-编辑计划
   * @author chenliangshan
   * @version 2017-10-18
   */

  import { mapState } from 'vuex'
  import { emitter } from '@/mixins'
  import ListCoach from './ListCoach'

  export default {
    name: 'edit-coach-list',

    mixins: [emitter],

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
        const { plan: { id } } = this.currentItem.data
        this.$http.patch(`/plan/${id}`, { course: item })
          .then(() => {
            this.$Message.success('成功修改学习计划！')
            this.$emit('on-success', { close: true })
          })
          .catch((errors) => {
            this.$emit('on-error', errors)
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

</style>
