/**
 * 合同管理 - 编辑配置
 * @author hjz
 * @version 2017-06-19
 */

import { createButton } from '@/utils'

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
