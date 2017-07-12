
/**
 * 合同编辑页 - 退费表单配置
 * @author hjz
 * @version 2017-07-11
 */

export function refundInit() {
  return {
    info: {
      // 要退费的合同id，不在表单页显示的数据
      belong_contract_id: null,
      flow_id: null,
      template_type: null,
      authority: [
        // 实例结构
        // {
        //   user_id: 22,
        //   role_id: 1,
        // },
      ],
    },
    product: {
      // 退费原因
      note: '',
      // 这里是后端返回的数据，原封返回就好
      list: [],
    },
  }
}

export function unit_encode(data) {
  return data
}

// 表单验证规则
export function formRules(that) {
  return {
    infoRules: {
      flow_id: [
        that.$rules.required('流程名称', 'number', 'change'),
      ],
      template_type: [
        that.$rules.required('模板类型', 'number', 'change'),
      ],
    },
    authorityRules: {
      user_id: [
        that.$rules.required('角色选择', 'number', 'change'),
      ],
    },
    productRules: {
      note: [
        that.$rules.max(255),
      ],
    },
  }
}
