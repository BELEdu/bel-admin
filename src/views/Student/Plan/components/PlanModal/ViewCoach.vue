<template>
  <div class="view-coach">
    <Row
      class="view-coach__header"
      v-if="progressList.end_status && currentItemData.plan_status !== 10"
    >
      <Col>
        <Button type="warning" icon="power" @click="overPlan">结束计划</Button>
      </Col>
    </Row>
    <Timeline>
      <TimelineItem
        v-for="(list, index) in progressList.course_progress"
        :key="list.sort_value"
      >
        <Icon v-if="list.course_status >= 2" type="ios-checkmark" slot="dot"></Icon>
        <Icon v-else type="ios-circle-outline" slot="dot"></Icon>
        <div :class="{over: list.course_status >= 2}">
          <p class="content">{{list.name}}</p>
          <p class="time">{{ list.course_date }}  {{ list.course_start }}-{{ list.course_end }}</p>
        </div>
      </TimelineItem>
    </Timeline>
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
        progressList: {
          course_progress: [],
        },
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
            this.$http.patch(`/plan/end/${this.currentItemData.plan.id}`)
              .then(() => {
                this.$Message.success('成功结束计划')
                this.$emit('on-success', { close: true })
              })
              .catch(() => {
                this.$Message.error('操作失败')
              })
          },
        })
      },

      // 获取学习进度列表
      getPlanProgress() {
        this.$http.get(`/plan/progress/${this.currentItemData.plan.id}`)
          .then((result) => {
            this.progressList = { ...result }
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
      padding-bottom: 10px;
    }

    .content{
      font-size: 14px;
      font-weight: bold;
    }

    .time{
      padding-left: 5px;
    }

    .over {
      .content, .time {
        color: @disabled-color;
      }
    }
  }
</style>
