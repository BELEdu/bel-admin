<template>
  <div class="view-coach">
    <Row class="view-coach__header">
      <Col>
        <Button type="warning" icon="power" @click="overPlan">结束计划</Button>
      </Col>
    </Row>
    <ul class="view-coach__list">
      <li
        v-for="(list, index) in progressList"
        :key="list.sort_value"
        :data-index="progressList.length - index"
        :class="{over: list.course_status === 2}"
      >
        <div class="view-coach__list-time">
          {{ list.course_date }}  {{ list.course_start }}-{{ list.course_end }}
        </div>
        <div class="view-coach__list-name">
          {{list.name}}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  /**
   * 学习计划-查看进度
   * @author chenliangshan
   * @version 2017-10-18
   */

  import { mapState } from 'vuex'

  export default {
    name: 'view-coach',

    data() {
      return {
        progressList: [],
      }
    },

    computed: {
      ...mapState({
        currentItemData: state => state.student.plan.currentItem.data,
      }),
    },

    watch: {
      currentItemData: {
        handler() {
          this.getPlanProgress()
        },
        deep: true,
      },
    },

    methods: {
      // 结束计划
      overPlan() {
        this.$Modal.confirm({
          title: '结束计划',
          content: '是否确认结束本计划，确认后将无法再安排计划，是否继续？',
          onOk: () => {
            this.$http.patch(`/plan/end/${this.currentItemData.id}`)
              .then(() => {
                this.$Message.success('成功结束计划')
              })
              .catch(() => {
                this.$Message.error('操作失败')
              })
          },
        })
      },

      // 获取学习进度列表
      getPlanProgress() {
        this.$http.get(`/plan/progress/${this.currentItemData.id}`)
          .then((result) => {
            this.progressList = result.course_progress
          })
      },
    },

    mounted() {
      // 初始化
      this.getPlanProgress()
    },
  }
</script>

<style lang="less" scoped>
  @import "~vars.less";

  .view-coach {
    padding: 0 10px;

    &__header {
      text-align: right;
    }

    &__list {
      padding: 10px 0 0 14px;
      max-height: 500px;
      overflow-y: auto;

      > li {
        position: relative;
        padding-left: 30px;
        font-size: 14px;
        border-left: 1px solid #ccc;

        &:before {
          content: attr(data-index);
          display: block;
          width: 26px;
          height: 26px;
          line-height: 24px;
          margin-right: 8px;
          text-align: center;
          border: 1px solid @disabled-color;
          border-radius: 50%;
          font-size: 14px;
          color: #fff;
          background-color: @disabled-color;
          position: absolute;
          left: -13px;
        }

        &.over {
          border-color: @info-color;

          &:before {
            border-color: @primary-color;
            background-color: @primary-color;
          }
        }
      }

      &-name {
        padding-left: 10px;
        padding-bottom: 14px;
      }
    }
  }
</style>
