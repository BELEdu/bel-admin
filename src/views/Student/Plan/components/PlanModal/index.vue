<template>
  <Modal
    :value="visible"
    :mask-closable="false"
    @input="(val) => this.$emit('update:visible', val)"
    width="640"
    class-name="plan-modal"
  >
    <Row slot="header" class="plan-modal__header">
      <Col span="6" class="plan-modal__header-left">
        <Button
          v-show="currentCom.backBtn"
          type="text"
          icon="chevron-left"
          size="small"
          @click="prev"
        >返回</Button>&nbsp;
      </Col>
      <Col span="12" class="plan-modal__header-center">{{currentCom.title}}</Col>
      <Col span="6" class="plan-modal__header-right"></Col>

    </Row>

    <div :is="currentCom.view" :key="currentCom.id"></div>

    <div slot="footer" class="plan-modal__footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="next">{{currentCom.btnText}}</Button>
    </div>
  </Modal>
</template>

<script>
  /**
   * 计划弹窗
   * @author chenliangshan
   * @version 2017-10-12
   */

  import { mapState } from 'vuex'
  import AddCoach from './add/Coach'
  import AddCoachNight from './add/CoachNight'
  import AddCoachList from './add/CoachList'
  import EditCoach from './EditCoach'
  import ViewCoach from './ViewCoach'
  import AppraiseCoach from './AppraiseCoach'

  export default {
    name: 'plan-modal',

    components: { AddCoach, AddCoachNight, AddCoachList, ViewCoach, EditCoach, AppraiseCoach },

    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        // 当前流程页Id
        currentComId: -1,

        // 计划组件页面信息
        coachCom: [
          { id: 1, name: 'add-coach-list', title: '添加计划', view: 'add-coach-list', btnName: '添加计划-提交', btnText: '提交', prevStep: 2, backBtn: false },
          { id: 2, name: 'add-coach-night', title: '添加计划', view: 'add-coach-night', btnName: '添加计划-下一步', btnText: '下一步', nextStep: 1 },
          { id: 3, name: 'edit-coach', title: '编辑计划', view: 'edit-coach', btnName: '编辑计划-确定', btnText: '确定' },
          { id: 4, name: 'view-coach', title: '学习进度', view: 'view-coach', btnName: '查看进度-查看评价', btnText: '查看评价', nextStep: 5 },
          { id: 5, name: 'appraise-coach', title: '学员评价', view: 'appraise-coach', btnName: '查看进度-返回进度', btnText: '返回进度', prevStep: 4, backBtn: true },
        ],
      }
    },

    computed: {
      ...mapState({
        item: state => state.student.plan.currentItemData,
        type: state => state.student.plan.currentItemType,
      }),

      currentCom() {
        const planStatus = this.item.plan_status
        // TODO 目前为模拟字段（coachType）
        const coachType = this.item.coach_type || 1 // 2为晚辅导班
        let viewId = 1
        const defAddCoach = { // 默认值
          prevStep: 0,
          backBtn: false,
        }

        if (this.currentComId < 0) {
          // 判断显示相应组件
          switch (planStatus) {
            case 0: {
              // 判断晚辅导班
              viewId = coachType === 2 ? 2 : 1
              break
            }
            case 1: {
              viewId = this.type === 'view' ? 4 : 3
              break
            }
            case 3: {
              viewId = 4
              break
            }
            default: {
              return {}
            }
          }
        } else {
          viewId = this.currentComId
        }

        // 改变返回id
        this.coachCom = this.coachCom.map((item) => {
          let customParam = {}
          if (item.id === viewId) {
            customParam = { ...defAddCoach }
            if (this.item.coach_type === 2) {
              // 晚辅导
              customParam = {
                prevStep: 2,
                backBtn: true,
              }
            }
          }
          return {
            ...item,
            ...customParam,
          }
        })
        return this.coachCom.find(({ id }) => id === viewId)
      },
    },

    methods: {
      cancel() {
        // TODO 重置全部状态
        this.currentComId = -1
        this.$emit('update:visible', false)
      },

      prev() {
        this.currentComId = this.currentCom.prevStep || -1
      },

      next() {
        // TODO 处理当前流程

        // TODO 处理当前流程成功回调
        this.currentComId = this.currentCom.nextStep || this.currentCom.prevStep || this.currentComId
      },
    },
  }
</script>

<style lang="less">
  @import "~vars.less";

  .plan-modal {

    .ivu-modal-close {
      display: none;
    }

    &__header {
      line-height: 1.5;

      &-left {
        color: @primary-color;
        text-align: left;
      }
      &-center {
        font-size: 16px;
        text-align: center;
      }
      &-right {
        text-align: right;
      }
    }

    &__footer {

    }
  }
</style>
