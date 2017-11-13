<template>
  <div
    :is="parentCom"
    v-show="visible"
    action="撤销"
    :value="visible"
    @input="inputModel"
    :title="currentCom.title"
    :loading="formLoading"
    :width="width"
    :ok-value="currentCom.okValue"
    :cancel-value="currentCom.cancelValue || '取消'"
    :ok-btn="currentCom.okBtn"
    @on-ok="onOk"
    @on-cancel="onCancel"
  >
    <Form>
      <app-form-alert :errors="formErrors"></app-form-alert>
    </Form>
    <template v-if="isRepeal != null && !isRepeal">
      <div
        :is="currentCom.view"
        :loading.sync="dataLoading"
        @on-success="onSuccess"
        @on-error="onError"
        @on-reset="onReset"
      >
      </div>
      <Spin size="large" fix v-if="dataLoading">加载中...</Spin>
    </template>

    <div v-else class="text-center">撤销后，课表将回到待确认状态，是否继续？</div>
  </div>
</template>

<script>
  /**
   * 课表弹窗操作组件
   * @author chenliangshan
   * @version 2017-10-24
   */

  import { mapState } from 'vuex'
  import { emitter, form } from '@/mixins'
  import confirmModal from './confirm'
  import commentModal from './comment'

  export default {
    name: 'schedule-modal',

    mixins: [emitter, form],

    components: {
      confirmModal,
      commentModal,
    },

    props: {
      visible: {
        type: Boolean,
        default: false,
      },

      isRepeal: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        comInfo: [
          { course_status: 0, title: '确认排课', name: 'confirm-modal', view: 'confirm-modal', okValue: '确认排课', okBtn: true },
          { course_status: 1, title: '确认上课', name: 'confirm-modal', view: 'confirm-modal', okValue: '确认上课', okBtn: true },
          { course_status: 2, title: '课堂评价', name: 'comment-modal', view: 'comment-modal', okValue: '完成评价', okBtn: true },
          { course_status: 3, title: '课堂评价', name: 'comment-modal', view: 'comment-modal', okBtn: false, cancelValue: '关闭' },
        ],

        parentCom: '',

        width: 0,

        dataLoading: true,
      }
    },

    computed: {
      ...mapState({
        currentCourseItem: state => state.student.schedule.currentCourseItem,
      }),

      currentCom() {
        const data = this.comInfo.find(({ course_status }) =>
          course_status === this.currentCourseItem.course_status)
        this.dataLoading = true
        return data
      },
    },

    watch: {
      isRepeal(val) {
        this.switchCom(val)
      },
    },

    methods: {
      onOk() {
        this.formLoading = true
        if (this.isRepeal) {
          // 撤销操作
          this.$http.post(`/schedule/cancel/${this.currentCourseItem.id}`)
            .then(() => {
              this.onSuccess()
            })
            .catch(() => {
              this.$Message.error({
                content: '撤销失败',
                onClose: () => {
                  this.$emit('on-error')
                  this.$emit('update:visible', false)
                },
              })
            })
        } else {
          this.broadcast(this.currentCom.name, 'on-submit')
        }
      },

      onCancel() {
        this.onReset()
      },

      onReset() {
        this.formLoading = false
        this.formErrors = {}
        setTimeout(() => {
          this.dataLoading = true
        }, 300)
      },

      onError(errors) {
        this.formLoading = false
        this.dataLoading = false
        this.errorHandler(errors)
      },

      onSuccess(param = {}) {
        this.$Message.success({
          content: param.message || '操作成功',
          onClose: () => {
            this.onReset()
            // 更新列表
            this.$emit('on-update')
            this.$emit('update:visible', false)
          },
        })
      },

      inputModel(val) {
        if (!val) {
          this.onReset()
        }
        this.$emit('update:visible', val)
      },

      switchCom(val) {
        if (val) {
          this.width = 400
          this.parentCom = 'app-warn-modal'
        } else {
          this.width = 640
          this.parentCom = 'app-form-modal'
        }
      },
    },

    created() {
      this.switchCom(this.isRepeal)
    },
  }

</script>

<style lang="less" scoped>
  .ivu-spin {
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>
