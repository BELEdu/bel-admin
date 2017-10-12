
/**
 * 合同编辑页 - 退费合同表单配置
 *
 * @author huojinzhao
 */

import { formRules as editRules } from './editConfig'

export const refundInit = () => ({
  // flowForm
  // 要退费的合同id，不在表单页显示的数据
  belong_contract_id: null,
  flow_id: null,
  template_type: null,
  authority: [],

  // refundForm
  student_name: '',
  student_number: null,
  money: null,
  contract_product: [],
  refund: null,
  note: '',
})

// 表单验证规则
export const formRules = (that) => {
  const {
    flow_id,
    template_type,
    authorityRules,
  } = editRules(that)

  return {
    flow_id,
    template_type,
    authorityRules,
    note: [
      that.$rules.max(255),
    ],
  }
}
