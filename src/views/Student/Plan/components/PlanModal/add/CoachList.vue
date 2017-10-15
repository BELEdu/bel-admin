<template>
  <div class="add-coach-list">
    <list-coach
      :list="list"
      :multi-teacher="isNightCoach"
      @add-list="addItem"
      @close-list="closeItem"
      @on-success="() => this.$emit('on-success')"
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
      init() {
        this.addItem()
      },

      addItem() {
        this.list = [{
          sort_value: 1, // 课顺序
          course_num: 2, // 课时
          course_date: null, // 课日期
          teacher_id: [], // 教师id
          course_chapter: [], // 章节数组id
        }, ...this.list]
      },

      closeItem(item) {
        this.list = item
      },
    },

    mounted() {
      this.init()

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
