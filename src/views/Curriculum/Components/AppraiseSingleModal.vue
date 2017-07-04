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
      <Form ref="form" :model="appraiseSingleData">
        <app-form-alert :errors="formErrors"></app-form-alert>
        <template v-if="param.type!='class'">
          <Form-item v-for="(item, index) in appraiseSingleData.items"
                     :key="item"
                     :prop="`items.${index}.comment`"
                     :rules="{required: true, message: '评语不能为空', trigger: 'blur'}">
              <Input v-model="item.comment" type="textarea"
                     :autosize="{minRows: 6,maxRows: 8}"
                     :readonly="!param.okBtn||param.readonly"
                     :placeholder="param.placeholder"></Input>
          </Form-item>
        </template>
        <template v-else>
            <Row>
              <Col span="12" v-for="(item, index) in appraiseSingleData.items"
                   :key="item">
                <Form-item v-bind:class="'appraise-li'"
                           :prop="`items.${index}.comment`"
                           :rules="{required: true, message: '评语不能为空', trigger: 'blur'}">
                  <Row>
                    <Col span="10">
                    <label>学员姓名：</label>
                    <span>{{item.display_name}}</span>
                    </Col>
                    <Col span="10">
                    <label>学员编号：</label>
                    <span>{{item.number}}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Input v-model="item.comment" type="textarea"
                           :autosize="{minRows: 4,maxRows: 4}"
                           :readonly="!param.okBtn||param.readonly"
                           :placeholder="param.placeholder"></Input>
                  </Row>
                </Form-item>
              </Col>
            </Row>
        </template>
      </Form>
    </div>
  </app-form-modal>
</template>

<script>
  /**
   * 学员|班级-单项评价弹窗
   * @author  chenliangshan
   * @update  2017/07/04
   */

  import { form } from '@/mixins'

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
    },
    data() {
      return {
        visible: this.value,
        // 评价内容数据
        appraiseSingleData: {
          items: [],
        },
      }
    },
    methods: {
      // 获取评价内容
      getAppraise() {
        if (this.data.comment_count > 0) {
          // 查看评价
          this.getAppraiseInfo()
        } else {
          // 编写评价
          this.getAppraiseStudentInfo()
        }
      },
      // 获取单项编写评价参数-学员信息
      getAppraiseStudentInfo() {
        this.$http.get(`/curricularecord/create/${this.data.model_id}`)
          .then((data) => {
            this.appraiseSingleData.items = data.map(list => Object.assign({}, list, { comment: '' }))
          })
      },
      // 查看评价内容
      getAppraiseInfo() {
        this.$http.get(`/curricularecord/show/${this.data.model_id}`)
          .then((data) => {
            this.appraiseSingleData.items = data.schedule_comments
          })
      },
      // 提交编写评价
      submit() {
        const body = {
          schedule_id: this.data.id,
          comment: this.appraiseSingleData.items,
        }
        this.$http.post(`/curricularecord/store/${body.schedule_id}`, body)
          .then(() => {
            this.formLoading = false
            this.$Message.success({
              content: '成功新增评价',
              onClose() {
                this.appraiseSingleModal = false
                // 重新获取当前列表数据
                this.$emit('on-submit')
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
          type: 'student',
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
