/**
 * 产品管理 - 编辑配置
 *
 * @author huojinzhao
 */

import { createButton } from '@/utils'

// 搜索配置
export function searchConfig() {
  return {
    // 关键字检索范围
    likeKeys: [],
    // 选择关键字
    likeKey: 'display_name',
    query: {
      'equal[promition_type]': '',
    },
  }
}

export function colConfig(that) {
  return [
    {
      title: '优惠名称',
      key: 'display_name',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '最低总额',
      key: 'enjoy_price',
      align: 'center',
    },
    {
      title: '优惠类型',
      key: 'promotion_type_name',
      align: 'center',
    },
    {
      title: '优惠内容',
      key: 'content',
      align: 'center',
    },
    // 后端数据加工
    {
      title: '有效期',
      key: 'validity_period',
      align: 'center',
    },
    {
      title: '优惠说明',
      key: 'description',
      align: 'center',
    },
    {
      title: '操作',
      key: '10',
      align: 'center',
      render: createButton([
        { text: '删除', type: 'error', click: that.toDelete },
        { text: '编辑', type: 'primary', click: that.toUpdate },
      ]),
    },
  ]
}
