/**
 * 合同管理 - 编辑配置
 * @author hjz
 * @version 2017-06-19
 */

import { createButton } from '@/utils'

// 编辑页 - 表单数据提交后端前的处理函数
export function unit_encode(data) {
  return data
}

// 编辑页 - 添加产品的数据单元
export function productOrigin() {
  return {
    // 产品编号:required|distinct|exists:products,id
    product_id: null,
    // 购买数量:required|integer|min:1
    number: 1,
    // 单品优惠比例:sometimes|numeric|between:0,100
    discount_rate: 0,
  }
}

// 编辑页 - 初始化对象
export function editInit() {
  return {
    // 合同主要信息
    info: {
      // 1.1 合同名称：present|required|max:255
      display_name: '',
      // 1.2 流程类型编号:present|required
      flow_id: 1,
      // 1.3 + 1.4 流程中涉及的审批人员编号，按顺序组成如下字符串:present|required
      auditor_ids: '1,2,3',
    },
    // 学员信息
    student: {
      // 学员编号，如果有则填写，没有则为null:sometimes|exists:student
      id: 1,
      // 2.1 学员姓名:present|required|string|max:255
      display_name: '',
      // 2.2 学员联系方式:sometimes|string|size:11
      phone: '',
      // 2.3 家长姓名:present|required|string|max:255
      parent_name: '',
      // 2.4 家长联系方式:present|required|string|size:11
      parent_phone: '',
      // 2.5 家长身份证号:present|required|string|between:15,18
      parent_identity_card: '',
      // 2.6 亲属关系:sometimes|string|max:32
      relation: '',
      // 2.8 在读学校:sometimes|string|max:128/**/
      school: '',
      // 2.9 学习科目:由于跟学员信息中字段有冲突，暂时不做验证
      subject_type: '学习科目',
      // 2.10 性别：sometimes|integer
      gender: null,
    },
    // 产品信息
    product: {
      // 3.1 折扣:sometimes|numeric
      discount: null,
      // 3.2 辅导地点:sometimes|string|max:255
      location: '',
      // 3.3 审批说明:sometimes|string|max:255
      note: '',
      // 3.0 添加产品列表
      list: [
        {
          // 产品编号:required|distinct|exists:products,id
          product_id: null,
          // 购买数量:required|integer|min:1
          number: 1,
          // 单品优惠比例:sometimes|numeric|between:0,100
          discount_rate: 0,
        },
      ],
    },
  }
}

// 列表页 - 列表头配置
// eslint-disable-next-line
export function colConfig(that) {
  return [
    {
      title: '审批批号',
      key: 'approval_number',
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
