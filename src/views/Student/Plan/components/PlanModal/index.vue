<template>
  <Modal
    :value="visible"
    :mask-closable="false"
    @input="(val) => this.$emit('update:visible', val)"
    width="660"
    class-name="plan-modal"
  >
    <Row slot="header" class="plan-modal__header">
      <Col span="12" :offset="6" class="plan-modal__header-center">{{currentCom.title}}</Col>
      <Col span="6" class="plan-modal__header-right"></Col>

    </Row>

    <div
      class="plan-modal__body"
      :is="currentCom.view"
      :key="currentCom.id"
      @on-success="onSuccess"
      @on-error="onError"
    ></div>

    <div slot="footer" class="plan-modal__footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="prev" v-if="currentCom.backBtn">返回</Button>
      <Button type="primary" @click="next" :loading="loading" v-if="currentCom.btnText">{{currentCom.btnText}}</Button>
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
  import { broadcast } from '@/mixins'
  import { STUDENT } from '@/store/mutationTypes'
  import AddCoach from './add/Coach'
  import AddCoachNight from './add/CoachNight'
  import AddCoachList from './add/CoachList'
  import EditCoachList from './EditCoach'
  import ViewCoach from './ViewCoach'
  import AppraiseCoach from './AppraiseCoach'

  export default {
    name: 'plan-modal',

    mixins: [broadcast],

    components: { AddCoach, AddCoachNight, AddCoachList, ViewCoach, EditCoachList, AppraiseCoach },

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
          // add-coach-list
          { id: 1, name: 'add-coach-list', title: '添加计划', view: 'add-coach-list', btnName: '添加计划-提交', btnText: '提交', prevStep: 2, backBtn: false },
          { id: 2, name: 'add-coach-night', title: '添加计划', view: 'add-coach-night', btnName: '添加计划-下一步', btnText: '下一步', nextStep: 1 },
          { id: 3, name: 'edit-coach-list', title: '编辑计划', view: 'edit-coach-list', btnName: '编辑计划-确定', btnText: '确定' },
          { id: 4, name: 'view-coach', title: '学习进度', view: 'view-coach', btnName: '查看进度-查看评价', btnText: '查看评价', nextStep: 5 },
          { id: 5, name: 'appraise-coach', title: '学员评价', view: 'appraise-coach', btnName: '查看进度-返回进度', btnText: '', prevStep: 4, backBtn: true },
        ],

        loading: false,
      }
    },

    computed: {
      ...mapState({
        item: state => state.student.plan.currentItem,
        itemData: state => state.student.plan.currentItem.data,
        isNightCoach: state => state.student.plan.currentItem.isNightCoach,
      }),

      currentCom() {
        const planStatus = this.itemData.plan_status
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
              viewId = this.isNightCoach ? 2 : 1
              break
            }
            case 1: {
              viewId = this.item.type === 'view' ? 4 : 3
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
            if (item.id === 1) {
              customParam = { ...defAddCoach }
            }
            if (this.isNightCoach && this.item.type === 'add' && viewId === 1) {
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
        this.currentComId = -1
        this.$emit('update:visible', false)
        this.broadcast(this.currentCom.view, 'on-reset', this.currentCom)
        this.$store.commit(STUDENT.PLAN.CURRENT_ITEM_COURSELIST, [])
        this.loading = false
      },

      onError() {
        this.loading = false
      },

      prev() {
        this.currentComId = this.currentCom.prevStep || -1
      },

      next() {
        this.loading = true
        if (this.item.type === 'view') {
          this.onSuccess()
        } else {
          this.broadcast(this.currentCom.view, 'on-submit', this.currentCom)
        }
      },

      onSuccess(param = { close: false }) {
        this.loading = false
        if (param.close) {
          this.$emit('on-success')
          this.$emit('update:visible', false)
        } else if (this.currentCom.nextStep || this.currentCom.prevStep) {
          this.currentComId = this.currentCom.nextStep || this.currentCom.prevStep
        }
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

    &__body {
      min-height: 460px;
    }

    &__footer {

    }
  }
</style>
