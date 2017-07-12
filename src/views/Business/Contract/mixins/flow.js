/**
 * 合同审批 - 合同编辑、合同退费 - 流程相关mixin
 * @author hjz
 * @version 2017-07-11
 * @description flow中囊括了流程名称、合同模板、参与角色的信息
 */

import { GLOBAL } from '@/store/mutationTypes'
import { Http } from '@/utils'

export default {

  data: () => ({
    // 流程数据
    flowInfo: null,
  }),

  methods: {
    // 选择流程名称时根据流程id更改url？flow_id=value
    changeFlow(value) {
      this.$router.push({
        path: this.$route.path,
        query: {
          flow_id: value,
        },
      })
    },
    // 请求flowInfo
    reqFlowInfo(route) {
      // 更新flowInfo，主要是合同模板和角色信息
      const baseUrl = '/contract/create'
      const queryFlow = route.query.flow_id
        ? `?flow_id=${route.query.flow_id}`
        : ''

      return Http.get(`${baseUrl}${queryFlow}`)
        .then((res) => {
          this.flowInfo = res
          // this.fdata.info.flow_id = res.flow_id
          this.dealRoleKey()
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
      this.fdata.info.authority = authority
      this.fdata.info.template_type = null
    },
    // v-for Form组（动态的、数据结构相同）验证
    groupValidate(name) {
      let groupValid = true
      this.$refs[name].forEach((item) => {
        item.validate((valid) => {
          if (!valid) groupValid = false
        })
      })
      return groupValid
    },
    // 验证：静态表单中有动态表单
    checkMulForm(container, inners) {
      const innerValid = this.groupValidate(inners)
      this.$refs[container].validate((valid) => {
        if (innerValid && valid) this.step(+1)
      })
    },
  },

  created() {
    // 请求合同流程数据集合
    this.reqFlowInfo(this.$route)
  },

  beforeRouteUpdate(to, from, next) {
    // 选择流程名称后一起url变化，重新请求flowInfo
    this.reqFlowInfo(to)
      .then(() => {
        next()
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
