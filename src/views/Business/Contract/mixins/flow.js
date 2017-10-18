/**
 * 合同审批 - 合同编辑、合同退费 - 流程相关mixin
 *
 * @author huojinzhao
 * @description flow中囊括了流程名称、合同模板、参与角色的信息
 */

import { Http } from '@/utils'

export default {

  data: () => ({
    // 流程数据
    flowInfo: null,
    // 是否重构fdata的authority，用于重新提交时前置禁用
    isDealAuthority: true,
  }),

  methods: {
    // flow_id改变时，通过select触发
    changeFlow(value) {
      this.reqFlowInfo(value)
    },

    // 请求flowInfo
    reqFlowInfo(flow_id) {
      // 更新flowInfo，主要是合同模板和角色信息
      const baseUrl = '/contract/create'
      const queryFlow = flow_id ? `?flow_id=${flow_id}` : ''

      return Http.get(`${baseUrl}${queryFlow}`)
        .then((res) => {
          // this.flowInfo = this.decodeFlowList(res)
          this.flowInfo = res
          if (this.isDealAuthority) this.dealRoleKey()
          this.isDealAuthority = true
        })
    },

    // 使用请求回来的flowInfo重构表单角色数组结构
    dealRoleKey() {
      const info = this.flowInfo
      const authority = []
      info.role_list.forEach((item) => {
        authority.push({ role_id: item.id, user_id: null })
      })
      // fdata.info重构
      this.fdata.authority = authority
      this.fdata.template_type = null
    },

    // 流程步骤表单验证
    checkFlowForm(
      callback = () => Promise.resolve(),
    ) {
      this.$refs.flowForm
        .validate((valid) => {
          if (valid) {
            callback().then(() => this.step(+1))
          }
        })
    },
  },

  beforeRouteEnter(to, from, next) {
    Http.get('/contract/create')
      .then(res => next((vm) => {
        // eslint-disable-next-line
        vm.flowInfo = res
      }))
  },
}
