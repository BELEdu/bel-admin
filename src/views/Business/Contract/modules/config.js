/**
 * 合同管理 - 编辑配置
 *
 * @author huojinzhao
 */

import { createButton } from '@/utils'

export const renderSeriesName = key => (h, { row }) => h(
  'div',
  {
    style: {
      'text-align': 'left',
    },
    domProps: {
      innerHTML: row[key],
    },
  },
)

// 搜索配置
export const searchConfig = () => ({
  // 关键字检索范围
  likeKeys: [
    { label: '学员名字', value: 'student_name' },
    { label: '审批编号', value: 'contract_number' },
    { label: '合同名称', value: 'display_name' },
    { label: '申请人', value: 'username' },
  ],

  // 选择关键字
  likeKey: 'student_name',

  query: {
    'between[apply_date]': [],
  },
})

// 列表页 - 列表头配置
export const colConfig = that => [
  {
    title: '审批批号',
    key: 'contract_number',
    align: 'center',
    sortable: 'custom',
  },
  {
    title: '学员姓名',
    key: 'student_name',
    align: 'center',
  },
  {
    title: '流程名称',
    key: 'flow_name',
    align: 'center',
  },
  {
    title: '产品名称',
    key: 'product_name',
    align: 'center',
    render: renderSeriesName('product_name'),
  },
  {
    title: '总课时',
    key: 'course_total',
    align: 'center',
    sortable: 'custom',
  },
  {
    title: '审批总额（元）',
    key: 'money',
    align: 'center',
    width: 115,
    sortable: 'custom',
  },
  {
    title: '申请人',
    key: 'username',
    align: 'center',
  },
  {
    title: '申请时间',
    key: 'apply_date',
    align: 'center',
    width: 110,
    sortable: 'custom',
  },
  {
    title: '审批进度',
    key: 'apply_status_name',
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
        type: 'info',
        click: that.toCheck,
      },
      {
        text: '审批',
        type: 'warning',
        click: that.toApprove,
        isShow: params => params.row.operation.approval,
      },
      {
        text: '重新提交',
        type: 'warning',
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
        click: ({ id }) => that.deleteItem(id),
        isShow: params => params.row.operation.cancel,
      },
    ]),
  },
]
