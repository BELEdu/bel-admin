/**
 * 合同管理 - 编辑配置
 * @author hjz
 * @version 2017-06-19
 */

import { createButton } from '@/utils'

// 搜索配置
export function searchConfig() {
  return {
    // 关键字检索范围
    likeKeys: [
      { label: '学员名字', value: 'student_name' },
      { label: '审批编号', value: 'approval_number' },
      { label: '合同名称', value: 'display_name' },
      { label: '申请人', value: 'username' },
    ],
    // 选择关键字
    likeKey: 'student_name',
    query: {
      // 时间段搜索
      'between[apply_time]': [],
      // 特殊字段搜索
      // equal: {
      //   subject_id: null,
      // },
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
      width: 120,
      sortable: 'custom',
    },
    {
      title: '合同名称',
      key: 'display_name',
      align: 'center',
      width: 200,
    },
    {
      title: '流程名称',
      key: 'flow_name',
      align: 'center',
      width: 250,
    },
    {
      title: '产品名称',
      key: 'product_name',
      align: 'center',
    },
    {
      title: '总课时',
      key: 'course_total',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '合同总金额',
      key: 'money',
      align: 'center',
      width: 115,
      sortable: 'custom',
    },
    {
      title: '学员名字',
      key: 'student_name',
      align: 'center',
    },
    {
      title: '申请人',
      key: 'username',
      align: 'center',
    },
    {
      title: '申请时间',
      key: 'apply_time',
      align: 'center',
      width: 110,
      sortable: 'custom',
    },
    {
      title: '最后审批时间',
      key: 'audit_time',
      align: 'center',
      width: 130,
      sortable: 'custom',
    },
    {
      title: '审批进度',
      key: 'audit_process',
      align: 'center',
    },
    {
      title: '操作',
      key: '11',
      align: 'center',
      width: 240,
      render: createButton([
        {
          text: '查看',
          type: 'primary',
          click: that.toCheck,
        },
        {
          text: '重新提交',
          type: 'primary',
          click: that.toRecheck,
          isShow: params => params.row.operation.update,
        },
        {
          text: '退费',
          type: 'error',
          click: that.toRefund,
          isShow: params => params.row.operation.refund,
        },
        {
          text: '取消',
          type: 'error',
          click: that.toCancel,
          isShow: params => params.row.operation.cancel,
        },
      ]),
    },
  ]
}
