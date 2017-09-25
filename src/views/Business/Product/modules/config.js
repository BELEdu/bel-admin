/**
 * 产品管理 - 编辑配置
 * @author hjz
 * @version 2017-06-19
 */

import { createButton } from '@/utils'

export function unit_encode(data) {
  return { ...data }
}

export function unit_decode(res) {
  return { ...res }
}

export function editInit() {
  return {
    // 产品名称: "required|min:2|max:20"
    display_name: '',
    // 产品类型: "required|numeric"
    product_type: null,
    // 学习目标: "required|numeric"
    study_target: null,
    // 年级: "required|numeric"
    grade: null,
    // 学科: "required|numeric"
    grade_range_subject_id: null,
    // 班级容量: "required|numeric"
    class_capacity: null,
    // 运营类型: "numeric"
    sale_type: null,
    // 每课时单价："required|numeric"
    price: 0,
    // 销售状态: "numeric"
    sale_status: null,
    // 销售校区: "Array<numeric>"
    area_ids: [],
  }
}

// 调整后端数据为需求格式
export function list_decode(buffer) {
  const ectype = { ...buffer }
  // 处理数据
  if (Array.isArray(buffer.data)) {
    ectype.data = ectype.data.map((item) => {
      const unit = { ...item }
      if (unit.created_at) {
        unit.created_at = unit.created_at.slice(0, 10)
      }
      return unit
    })
  }

  return ectype
}

// 搜索配置
export function searchConfig() {
  return {
    // 关键字检索范围
    likeKeys: [
      { label: '产品编号', value: 'product_number' },
      { label: '创建人', value: 'username' },
    ],
    // 选择关键字
    likeKey: 'product_number',
    query: {
      // 时间段搜索
      'between[created_at]': [],
      // 特殊字段搜索
      'equal[subject_id]': null,
    },
  }
}

// eslint-disable-next-line
export function colConfig(that) {
  return [
    {
      title: '产品编号',
      key: 'number',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '产品名称',
      key: 'display_name',
      align: 'center',
    },
    {
      title: '学科',
      key: 'grade_range_subject_name',
      align: 'center',
    },
    {
      title: '运营类型',
      key: 'sale_type_name',
      align: 'center',
    },
    {
      title: '课时单价(元)',
      key: 'price',
      align: 'center',
    },
    {
      title: '销售状态',
      key: 'sale_status_name',
      align: 'center',
    },
    {
      title: '创建人',
      key: 'realname',
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
