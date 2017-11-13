<template>
  <Row class="comment-modal">
    <Col :span="4">
    <ul class="comment-modal__name">
      <li
        v-for="item in commentList"
        :key="item.student_id"
        @click="switchComment(item)"
        class="ellipsis"
        :class="{active: item.student_id === currentStudent.student_id}"
      >{{ item.student_name }} <Icon v-if="item.student_id === currentStudent.student_id" type="arrow-right-b"></Icon></li>
    </ul>
    </Col>
    <Col :span="20">
    <ul class="comment-modal__commit">
      <template v-if="currentItem.course_status === 3">
        <li
          v-for="(list, index) in studentCommented"
          :key="list.student_id"
        >
          <div class="comment-modal__commit-content">
            <Input
              type="textarea"
              v-model="list.comment"
              :disabled="true"
              :autosize="{minRows: 4,maxRows: 6}"
            />
          </div>
          <div class="comment-modal__commit-time">
            {{list.comment_date}}
          </div>
        </li>
      </template>
      <template v-else>
        <li v-for="list in studentComment" :key="list.student_id" v-if="list.student_id === currentStudent.student_id">
          <Input
            type="textarea"
            v-model="list.comment"
            placeholder="请填写评价"
            :autosize="{minRows: 8,maxRows: 8}"
          />
        </li>
      </template>
    </ul>
    <div class="text-center" v-if="loadingMore && currentItem.course_status === 3">
      <Button type="dashed" @click="getStudentCommented" icon="ios-printer-outline">查看更多</Button>
    </div>

    </Col>
  </Row>
</template>

<script>
  /**
   * 学员评论
   * @author chenliangshan
   * @version 2017-10-26
   */

  import { mapState } from 'vuex'

  export default {
    name: 'comment-modal',

    data() {
      return {
        commentList: [],
        studentComment: [],
        studentCommented: [],
        currentStudent: {},
        loadingMore: true,
      }
    },

    computed: {
      ...mapState({
        currentItem: state => state.student.schedule.currentCourseItem,
      }),

      commentUrl() {
        if (this.currentItem.course_status === 2) {
          // 评价
          return '/schedule/comment/'
        }
        // 查看评价
        return '/schedule/commented/'
      },
    },

    watch: {
      currentItem: {
        handler() {
          this.getComment()
        },
        deep: true,
      },
    },

    methods: {
      // 获取评价列表
      getComment() {
        this.$http.get(`${this.commentUrl}${this.currentItem.id}`)
          .then((result) => {
            if (this.currentItem.course_status === 2) {
              this.commentList = result.map(({ id, display_name }) => ({
                student_id: id,
                student_name: display_name,
              }))
              this.studentComment = result.map(({ id }) => ({
                student_id: id,
                comment: '',
              }))
            } else {
              this.commentList = [...result]
            }
            this.$emit('update:loading', false)
            this.switchComment(this.commentList[0])
          })
          .catch((errors) => {
            this.$emit('on-error', errors)
          })
      },

      // 获取学员历史评价
      getStudentCommented() {
        this.$http.get(`/schedule/commented/${this.currentItem.id}/${this.currentStudent.student_id}`)
          .then((result) => {
            this.studentCommented = [...result]
            this.loadingMore = false
          })
          .catch((errors) => {
            this.$emit('on-error', errors)
          })
      },

      // 切换学员
      switchComment(item) {
        this.currentStudent = { ...item }
        if (this.currentItem.course_status === 3) {
          const { student_id, student_name, ...comment } = item
          this.studentCommented = [comment]
          this.loadingMore = true
        }
      },

      // 提交评价
      submit() {
        // TODO 校验是否完整填写评价
        const { id } = this.currentItem
        this.$http.post(`/schedule/comment/${id}`, {
          plan_course_id: id,
          comments: [...this.studentComment],
        })
          .then(() => {
            this.$emit('on-success')
          })
          .catch((errors) => {
            this.$emit('on-error', errors)
          })
      },
    },

    mounted() {
      this.getComment()
    },

    created() {
      this.$on('on-submit', () => {
        this.submit()
      })
    },
  }
</script>

<style lang="less" scoped>
  @import "~vars.less";

  .comment-modal {
    min-height: 188px;
    margin: 10px;
    font-size: 14px;
    position: relative;

    &:before {
      content: ' ';
      display: block;
      width: 0;
      height: 100%;
      border-right: 1px solid @border-color-base;
      position: absolute;
      left: 100px;
      top: 0;
    }

    &__name {
      text-align: right;
      max-height: 608px;
      overflow-y: auto;

      > li {
        padding: 8px 20px 8px 0;
        border-top: 1px solid @border-color-base;
        cursor: pointer;

        &:first-child {
          border-top-width: 0;
        }
        &.active {
          color: @primary-color;
        }
      }
    }

    &__commit {
      padding-left: 20px;
      max-height: 608px;
      overflow-y: auto;

      > li {
        border-top: 1px dashed @border-color-base;
        padding-bottom: 10px;
        position: relative;

        &:first-child {
          border-top-width: 0;
        }

        &:before {
          content: '';
          width: 4px;
          height: 18px;
          display: block;
          background-color: @success-color;
          position: absolute;
          left: -10px;
          top: 2px;
        }
      }

      &-content {
        line-height: 22px;
        font-size: 14px;
        padding-bottom: 10px;
      }

      &-time {
        font-size: 12px;
        color: @subsidiary-color;
        text-align: right;
      }
    }
  }
</style>
