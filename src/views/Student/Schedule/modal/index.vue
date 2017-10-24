<template>
  <div
    :is="parentCom"
    :value="visible"
    @input="inputModel"
    :title="currentCom.title"
    :loading="formLoading"
    :width="width"
    @on-ok="onOk"
    @on-cancel="onCancel"
  >
    <div
      :is="currentCom.view"
      v-if="!isRepeal"
      @on-success="onSuccess"
      @on-error="onError"
      @on-reset="onReset"
    ></div>
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

  const confirmModal = () => import('./confirm')

  export default {
    name: 'schedule-modal',

    mixins: [emitter, form],

    components: {
      confirmModal,
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
          { course_status: 0, title: '确认排课', name: 'confirm-modal', view: 'confirm-modal', okValue: '确认排课', okBtn: true, cancelBtn: true },
          { course_status: 1, title: '确认上课', name: 'confirm-modal', view: 'confirm-modal', okValue: '确认上课', okBtn: true, cancelBtn: true },
          { course_status: 2, title: '课堂评价', name: 'comment-modal', view: 'comment-modal', okValue: '完成评价', okBtn: true, cancelBtn: true },
          { course_status: 3, title: '课堂评价', name: 'comment-modal', view: 'comment-modal', cancelBtn: true, cancelValue: '关闭' },
        ],

        parentCom: '',

        width: 0,
      }
    },

    computed: {
      ...mapState({
        currentCourseItem: state => state.student.schedule.currentCourseItem,
      }),

      currentCom() {
        return this.comInfo.find(({ course_status }) =>
          course_status === this.currentCourseItem.course_status)
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
      },

      onError(errors) {
        this.errorHandler(errors)
        this.onReset()
      },

      onSuccess() {
        this.onReset()
        this.$Message.success({
          content: '操作成功',
          onClose: () => {
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

</style>
