/**
 * 合同审批 - 审批流程配置
 * @author hjz
 * @version 2017-06-20
 */

export function list_decode(res) {
  return res
}

// eslint-disable-next-line
export const colConfig = {
  contractCol: [
    { title: '审批编号', key: 'approval_number', align: 'center' },
    // 废弃
    // { title: '合同编号', key: 'contract_number', align: 'center' },
    { title: '合同名称', key: 'display_name', align: 'center' },
    { title: '产品名称', key: 'product_name', align: 'center' },
    { title: '总课时', key: 'course_total', align: 'center' },
    { title: '总金额', key: 'money', align: 'center' },
    // 废弃
    // { title: '优惠金额', key: 'discount', align: 'center' },
    { title: '审批说明', key: 'note', align: 'center' },
  ],
  productCol: [
    { title: '产品编号', key: 'product_number', align: 'center' },
    { title: '产品名称', key: 'product_name', align: 'center' },
    { title: '产品分类', key: 'product_type_name', align: 'center' },
    { title: '产品子分类', key: 'product_subtype_name', align: 'center' },
    { title: '课时长（分钟）', key: 'course_duration', align: 'center', width: 120 },
    { title: '产品单价', key: 'price', align: 'center' },
    { title: '购买数量', key: 'number', align: 'center' },
    { title: '优惠比例', key: 'discount_rate', align: 'center' },
    { title: '产品总金额', key: 'money', align: 'center' },
  ],
  hisCol: [
    { title: '审批人', key: 'username', align: 'center' },
    { title: '审批人岗位', key: 'role_name', align: 'center' },
    { title: '审批结果', key: 'apply_status_name', align: 'center' },
    { title: '审批意见', key: 'comment', align: 'center' },
    { title: '审批时间', key: 'apply_time', align: 'center' },
  ],
}
