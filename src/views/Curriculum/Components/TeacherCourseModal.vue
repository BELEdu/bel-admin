<template>
  <app-form-modal v-model="visible"
                  title="排课情况"
                  :closable="false"
                  :loading="false"
                  :width="860"
                  :cancel-value="config.cancelValue"
                  :ok-value="config.okValue"
                  :ok-btn="config.okBtn"
                  @on-ok="submit"
                  @on-cancel="cancel">
    <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>
    <div class="teacher-modal-content">
      <div class="app-table ivu-table-wrapper">
        <div class="ivu-table ivu-table-border">
          <div class="ivu-table-body">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <colgroup>
                <col width="90">
                <col>
                <col width="90">
                <col>
                <col width="90">
                <col>
              </colgroup>
              <tbody class="ivu-table-tbody">
              <tr class="ivu-table-row">
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          <strong>教学对象</strong>
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          {{formItem.instance_name}}
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          <strong>上课科目</strong>
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          {{formItem.subject_item_name}}
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          <strong>排课人</strong>
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          {{formItem.username}}
                        </span>
                  </div>
                </td>
              </tr>
              <tr class="ivu-table-row">
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          <strong>上课日期</strong>
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          {{formItem.date}}
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          <strong>上课时段</strong>
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          {{formItem.start_at}} - {{formItem.end_at}}
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          <strong>上课节数</strong>
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          {{formItem.plan_course_number}}
                        </span>
                  </div>
                </td>
              </tr>
              <tr class="ivu-table-row">
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          <strong>计划课时</strong>
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                        <span>
                          {{formItem.fact_cost}}
                        </span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span></span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span></span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span></span>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span></span>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="points">
        <h3 class="title">知识点</h3>
        <Row>
          <Col span="20">
          <template v-if="knowledgeModal">
            <!--选择知识点-->
            <app-knowledge-tree
              :data="baseData" v-model="formItem.points"
              @select="data => selectedData = data"
            ></app-knowledge-tree>
          </template>
          <template v-else>
            <!--展示知识点-->
            <Tag type="dot" color="yellow" v-for="(item,index) in knowledgeData" :key="index" :name="index" closable @on-close="removeknowledge">{{item.name}}</Tag>
          </template>
          </Col>
          <Col span="1">&nbsp;</Col>
          <Col span="3">
          <Button type="primary"
                  @click="editKnowledge('save')"
                  v-if="knowledgeModal">确认知识点</Button>
          <Button icon="edit" type="info"
                  @click="editKnowledge" v-else>修改知识点</Button>
          </Col>
        </Row>
      </div>
    </div>
  </app-form-modal>
</template>
<script>
  /**
   * 教师课表编辑
   * @author  chenliangshan
   * @version 2017/07/21
   */

  const server_msg = '服务端错误，请联系网站管理员或稍后重试'

  export default {
    name: 'teacher-course-modal',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      config: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        visible: this.value,
        // 查看数据
        formItem: {},
        formErrors: {},
        knowledgeModal: false,
        knowledgeData: [{
          id: 1,
          name: '平等分',
        }, {
          id: 2,
          name: '平等分2',
        }],
        baseData: [{
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }, {
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }, {
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }, {
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }],
      }
    },
    methods: {
      // 查看排课信息
      getCourseInfo() {
        const item = this.config.item
        this.$http.get(`/teachercurricula/show/${item.id}`)
          .then((result) => {
            this.formItem = { ...result, schedule_status: item.schedule_status }
          })
      },
      // 删除知识点
      removeknowledge(event, name) {
        this.knowledgeData.splice(name, 1)
      },
      // 编辑知识点
      editKnowledge(type) {
        switch (type) {
          case 'save': {
            this.knowledgeModal = false
            break
          }
          default : {
            this.knowledgeModal = true
            break
          }
        }
      },
      // 确认上课|完成上课
      submit() {
        const item = this.config.item
        const status = item.schedule_status
        let body = this.knowledgeData
        let postUrl
        let msg
        switch (status) {
          case 0:
            postUrl = '/teachercurricula/confirm/'
            msg = '该排课成功确定上课'
            break
          case 1:
            postUrl = '/teachercurricula/finish/'
            msg = '该排课成功完成上课'
            break
          default :
            body = {}
            msg = '该排课当前状态不可编辑'
            break
        }
        if (status === 0 || status === 1) {
          const self = this
          this.$http.post(`${postUrl}${item.id}`, body)
            .then(() => {
              this.$Message.success({
                content: `${msg}`,
                onClose() {
                  self.commonCallBack()
                  self.$emit('on-submit')
                },
              })
            })
            .catch((errors) => {
              this.errorHandler(errors)
            })
        } else {
          this.$Message.success(`${msg}`)
        }
      },
      cancel() {
        this.commonCallBack()
        this.$emit('on-cancel')
      },
      // 错误信息提示
      errorHandler({ errors, message }) {
        if (errors) {
          this.formErrors = errors
        } else {
          this.formErrors = { error: [message || server_msg] }
        }
      },
      // 公共回调函数
      commonCallBack() {
        this.visible = false
        this.formErrors = {}
      },
    },
    watch: {
      value(val) {
        this.visible = val
        if (val) {
          this.knowledgeModal = false
          this.getCourseInfo()
        }
      },
      visible(val) {
        if (val === false) {
          this.$emit('input', false)
        }
      },
    },
  }
</script>
<style lang="less">
  .teacher-modal-content {
    padding: 0 20px;
  }

  .points {
    h3 {
      font-size: 14px;
      margin: 0;
      padding: 20px 0;
    }
  }
</style>
