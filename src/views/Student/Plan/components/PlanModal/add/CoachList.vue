<template>
  <div class="add-coach-list">
    <list-coach
      :list="list"
      :multi-teacher="isNightCoach"
      @on-success="onSubmit"
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
        list: [],
      }
    },

    computed: {
      ...mapState({
        currentItem: state => state.student.plan.currentItem,
        isNightCoach: state => state.student.plan.currentItem.isNightCoach,
      }),
    },

    methods: {
      onSubmit(item) {
        const { classes_id } = this.currentItem.data
        this.$http.post('/plan', { classes_id, course: item })
          .then(() => {
            this.$Message.success('成功添加学习计划！')
            this.$emit('on-success')
          })
      },

    },

    mounted() {
      this.$on('on-submit', (data) => {
        this.broadcast('list-coach', 'on-submit', data)
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
