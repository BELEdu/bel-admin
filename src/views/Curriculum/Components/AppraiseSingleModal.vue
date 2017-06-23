<template>
  <app-form-modal v-model="visible"
                  :title="param.title"
                  :closable="false"
                  :loading="false"
                  :ok-btn="param.okBtn"
                  :cancel-value="param.cancelValue"
                  :width="param.width" @on-ok="appraiseSingleSub">
    <div class="appraise-content">
      <Form :model="appraiseSingleData">
        <template v-if="param.type!='class'">
          <Form-item v-for="item in appraiseSingleData">
              <Input v-model="item.comment" type="textarea"
                     :autosize="{minRows: 6,maxRows: 8}"
                     :readonly="!param.okBtn||param.readonly"
                     :placeholder="param.placeholder"></Input>

          </Form-item>
        </template>
        <template v-else>
            <Row>
              <Col span="12" v-for="item in appraiseSingleData">
                <Form-item v-bind:class="'appraise-li'">
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
   */
  import AppFormModal from '@/components/AppFormModal'

  export default{
    name: 'appraise-single-modal',
    components: { AppFormModal },
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
        appraiseSingleData: [],
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
            this.appraiseSingleData = data.map(list => Object.assign({}, list, { comment: '' }))
          })
      },
      // 查看评价内容
      getAppraiseInfo() {
        this.$http.get(`/curricularecord/show/${this.data.model_id}`)
          .then((data) => {
            this.appraiseSingleData = data.schedule_comments
          })
      },
      // 提交编写评价
      appraiseSingleSub() {
        const body = {
          schedule_id: this.data.id,
          comment: this.appraiseSingleData,
        }
        this.$http.post(`/curricularecord/store/${body.schedule_id}`, body)
          .then(() => {
            this.$Message.success({ content: '成功新增评价' })
            this.appraiseSingleModal = false
          })
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
