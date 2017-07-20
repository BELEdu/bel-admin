<template>
  <app-form-modal v-model="visible"
                  :title="param.title"
                  :closable="false"
                  :loading="false"
                  :ok-btn="param.okBtn"
                  :cancel-value="param.cancelValue"
                  :width="param.width"
                  @on-ok="beforeSubmit"
                  @on-cancel="formCancel('form')">
    <div class="appraise-content">
      <Form ref="form" :model="formData">
        <app-form-alert :errors="formErrors" v-if="!isEmpty(formErrors)"></app-form-alert>
        <Form-item prop="comment"
                   :rules="{required: true, message: '评语不能为空', trigger: 'blur'}">
            <Input v-model="formData.comment"
                   type="textarea"
                   :autosize="{minRows: 6,maxRows: 8}"
                   :readonly="!param.okBtn||param.readonly"
                   :placeholder="param.placeholder"></Input>
        </Form-item>
      </Form>
    </div>
  </app-form-modal>
</template>

<script>
  /**
   * 学员|班级-单项评价弹窗
   * @author  chenliangshan
   * @version  2017/07/19
   */

  import { form } from '@/mixins'
  import { isEmpty } from 'lodash'

  export default{
    name: 'appraise-single-modal',
    mixins: [form],
    props: {
      // 弹窗状态
      value: {
        type: Boolean,
        required: true,
      },
      // 弹窗配置参数
      config: {
        type: Object,
        default: {},
      },
      // 所选项数据
      data: {
        type: Object,
        required: true,
        default: {},
      },
      // 当前学员ID
      id: [Number, String],
    },
    data() {
      return {
        visible: this.value,
        // 评价内容数据
        formData: {
          comment: null,
        },
      }
    },
    methods: {
      // 判断对象是否为空
      isEmpty(val) {
        return isEmpty(val)
      },
      // 获取评价内容
      getAppraise() {
        if (this.data.comment_count > 0) {
          // 查看评价
          this.getAppraiseInfo()
        }
      },
      // 查看评价内容
      getAppraiseInfo() {
        this.$http.get(`/curricularecord/show/${this.data.id}`)
          .then((data) => {
            this.formData = { ...this.formData, ...data }
          })
          .catch(() => {
            this.$Notice.error({
              title: '学员评价信息获取失败',
            })
          })
      },
      // 提交编写评价
      submit() {
        const body = {
          student_id: this.data.student_id,
          schedule_id: this.data.schedule_id,
          ...this.formData,
        }
        const self = this
        this.$http.post(`/curricularecord/store/${body.schedule_id}`, body)
          .then(() => {
            this.formLoading = false
            this.$Message.success({
              content: '成功新增评价',
              onClose() {
                self.visible = false
                // 关闭弹窗回调
                self.$emit('on-close')
              },
            })
          })
          .catch(error => this.errorHandler(error))
      },
      // 取消编写评价
      formCancel(name) {
        this.formErrors = {}
        this.$refs[name].resetFields()
      },
    },
    computed: {
      param() {
        return Object.assign({}, {
          width: 500,
          okBtn: true,
          cancelValue: '取消',
          title: '写评价',
          readonly: false,
          placeholder: '请输入评价内容',
        }, this.config)
      },
    },
    watch: {
      value(val) {
        this.visible = val
      },
      visible(val) {
        if (val === false) {
          this.$emit('input', false)
        } else {
          this.getAppraise()
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .appraise-content {
    margin: 0 auto;
    .appraise-li {
      padding: 0 10px;
    }
  }
</style>
