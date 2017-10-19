<template>
  <Row class="appraise-coach">
    <Col :span="4">
      <ul class="appraise-coach__name">
        <li
          v-for="item in commentList"
          :key="item.id"
          @click="select(item)"
          :class="{active: item.id === currentStudentId}"
        >{{ item.display_name }}</li>
      </ul>
    </Col>
    <Col :span="20">
      <ul class="appraise-coach__commit">
        <li
          v-for="(list, index) in currentStudentComment.comment"
          :key="`${currentStudentComment.id}${index}`"
        >
          <div class="appraise-coach__commit-content">
            {{list.comment}}
          </div>
          <div class="appraise-coach__commit-time">
            {{list.comment_date}}
          </div>
        </li>
      </ul>
    </Col>
  </Row>
</template>

<script>
  /**
   * 学习计划-学员评价
   * @author chenliangshan
   * @version 2017-10-19
   */

  import { mapState } from 'vuex'

  export default {
    name: 'appraise-coach',

    data() {
      return {
        commentList: [],
        currentStudentId: null,
      }
    },

    computed: {
      ...mapState({
        itemData: state => state.student.plan.currentItem.data,
      }),

      currentStudentComment() {
        return this.commentList.length ?
          this.commentList.find(({ id }) =>
            this.currentStudentId === id) : { comment: [] }
      },
    },

    methods: {
      getComment() {
        this.$http.get(`/plan/${this.itemData.id}/comment`)
          .then((res) => {
            this.commentList = [...res]
            this.select(res[0])
          })
      },

      // 选择查看学员评价
      select({ id }) {
        this.currentStudentId = id
      },
    },

    mounted() {
      this.getComment()
    },
  }
</script>

<style lang="less" scoped>
  @import "~vars.less";

  .appraise-coach {
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
        border-bottom: 1px solid @border-color-base;
        cursor: pointer;

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
        border-bottom: 1px dashed @border-color-base;
        padding-bottom: 10px;
        position: relative;

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
