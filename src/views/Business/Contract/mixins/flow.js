/**
 * 合同审批 - 合同编辑、合同退费 - 流程相关mixin
 *
 * @author huojinzhao
 * @description flow中囊括了流程名称、合同模板、参与角色的信息
 */

import { Http } from '@/utils'
import { GLOBAL } from '@/store/mutationTypes'

export default {

  data: () => ({
    // 流程数据
    flowInfo: null,
    // 是否重构fdata的authority
    // 在修改和合同时在拉取合同信息完成后前置禁用
    isDealAuthority: true,
  }),

  methods: {
    // flow_id改变时，通过select触发
    changeFlow(value) {
      this.reqFlowInfo(value)
    },

    // 请求flowInfo
    reqFlowInfo(flow_id) {
      this.$store.commit(GLOBAL.LOADING.SHOW)

      // 更新flowInfo，主要是合同模板和角色信息
      const baseUrl = '/contract/create'
      const queryFlow = flow_id ? `?flow_id=${flow_id}` : ''

      return Http.get(`${baseUrl}${queryFlow}`)
        .then((res) => {
          this.flowInfo = res
          if (this.isDealAuthority) this.dealRoleKey()

          // 编辑合同第一次是关闭状态，禁用流程数据重置
          // 第一次请求后取消禁用，重新选择流程可以重置流程数据
          this.isDealAuthority = true

          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
        .catch((error) => {
          this.$Notice.error({
            title: '请求审批角色信息出错',
            desc: error.message,
            duration: 0,
          })
        })
    },

    // 使用请求回来的flowInfo重构表单角色数组结构
    dealRoleKey() {
      const authority = []

      this.flowInfo.role_list.forEach((item) => {
        authority.push({ role_id: item.id, user_id: null })
      })

      // fdata审批流程相关数据初始化
      this.fdata.authority = authority
      this.fdata.template_type = null
    },

    // 流程步骤表单验证
    checkFlowForm(
      callback = () => Promise.resolve(),
    ) {
      this.$refs.flowForm.validate((valid) => {
        if (valid) {
          callback().then(() => this.step(+1))
        }
      })
    },
  },

  // 不用create，保证修改合同情况第一次禁用重置流程数据
  beforeRouteEnter(to, from, next) {
    Http.get('/contract/create')
      .then(res => next((vm) => {
        // eslint-disable-next-line
        vm.flowInfo = res
      }))
  },
}
