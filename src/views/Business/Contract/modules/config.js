/**
 * 合同管理 - 编辑配置
 * @author hjz
 * @version 2017-06-19
 */

import { createButton } from '@/utils'

// 编辑字段初始化
export function editInit() {
  return {
    // 合同主要信息
    info: {
      // 合同名称：present|required|max:255
      display_name: '合同名称',
      // 流程类型编号:present|required
      flow_id: 1,
      // 流程中涉及的审批人员编号，按顺序组成如下字符串:present|required
      auditor_ids: '1,2,3',
      // 折扣:sometimes|numeric
      discount: 2,
      // 辅导地点:sometimes|string|max:255
      location: '辅导地点',
      // 审批说明:sometimes|string|max:255
      note: '审批说明',
    },
    // 学员信息
    student: {
      // 学员编号，如果有则填写，没有则为null:sometimes|exists:student
      id: 1,
      // 学员姓名:present|required|string|max:255
      display_name: '学员姓名',
      // 学员联系方式:sometimes|string|size:11
      phone: '18955555555',
      // 家长姓名:present|required|string|max:255
      parent_name: '家长姓名',
      // 家长联系方式:present|required|string|size:11
      parent_phone: '18966666666',
      // 家长身份证号:present|required|string|between:15,18
      parent_identity_card: '350425111111111111',
      // 亲属关系:sometimes|string|max:32
      relation: '父子',
      // 在读学校:sometimes|string|max:128
      school: '在读学校',
      // 学习科目:由于跟学员信息中字段有冲突，暂时不做验证
      subject_type: '学习科目',
      // 性别：sometimes|integer
      gender: 1,
    },
    // 产品信息
    product: [
      {
        // 产品编号:required|distinct|exists:products,id
        product_id: 1,
        // 购买数量:required|integer|min:1
        number: 1,
        // 单品优惠比例:sometimes|numeric|between:0,100
        discount_rate: 10,
      },
      {
        product_id: 2,
        number: 1,
        discount_rate: 10,
      },
    ],
  }
}
// eslint-disable-next-line
export function colConfig(that) {
  return [
    {
      title: '审批批号',
      key: 'approval',
      align: 'center',
    },
    {
      title: '合同名称',
      key: 'display_name',
      align: 'center',
      width: 200,
    },
    {
      title: '合同类型',
      key: 'contract_type',
      align: 'center',
      width: 250,
    },
    {
      title: '产品名称',
      key: 'product_name',
      align: 'center',
    },
    {
      title: '合同总金额',
      key: 'money',
      align: 'center',
    },
    {
      title: '学员',
      key: '6',
      align: 'center',
    },
    {
      title: '申请人',
      key: '7',
      align: 'center',
    },
    {
      title: '申请时间',
      key: 'apply_time',
      align: 'center',
    },
    {
      title: '最后审批时间',
      key: 'audit_time',
      align: 'center',
    },
    {
      title: '审批进度',
      key: '10',
      align: 'audit_progress',
    },
    {
      title: '操作',
      key: '11',
      align: 'center',
      render: createButton([
        {
          text: '查看',
          type: 'primary',
          click: that.toCheck,
        },
      ]),
    },
  ]
}
