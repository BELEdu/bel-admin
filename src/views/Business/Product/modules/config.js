/**
 * 产品管理 - 编辑配置
 * @author hjz
 * @version 2017-06-19
 */

import { createButton } from '@/utils'

export function unit_encode(data) {
  const ectype = { ...data }

  if (parseInt(ectype.course_duration, 10)) {
    ectype.course_duration = parseFloat(ectype.course_duration, 10)
  }

  // if (parseInt(ectype.course_total, 10)) {
  //   ectype.course_total = parseFloat(ectype.course_total, 10)
  // }

  if (parseFloat(ectype.price)) {
    ectype.price = parseFloat(ectype.price)
  }

  return ectype
}

export function unit_decode(res) {
  const data = res

  data.course_duration = data.course_duration.toString()
  // data.course_total = data.course_total.toString()

  return data
}

export function editInit() {
  return {
    // 产品名称: "required|min:2|max:20"
    display_name: '',
    // 产品分类 "required|numeric",
    product_type_id: null,
    // 产品子分类
    product_subtype_id: null,
    // 学科
    subject_item: null,
    // 课程时长
    course_duration: null,
    // 课程总数: "numeric", 2017.07.21废弃
    // course_total: null,
    // "numeric",
    price: null,
    // 销售状态: "字典表: sale_status",
    sale_status: null,
    // 销售校区: "numeric",
    product_areas: [],
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
      between: {
        created_at: [],
      },
      // 特殊字段搜索
      equal: {
        subject_id: null,
      },
    },
  }
}

// eslint-disable-next-line
export function colConfig(that) {
  return [
    {
      title: '产品编号',
      key: 'product_number',
      align: 'center',
      width: 150,
      sortable: 'custom',
    },
    {
      title: '产品名称',
      key: 'display_name',
      align: 'center',
      width: 200,
    },
    {
      title: '产品类型',
      key: 'product_type_name',
      align: 'center',
      width: 250,
    },
    {
      title: '产品子分类',
      key: 'product_subtype_name',
      align: 'center',
    },
    {
      title: '学科',
      key: 'subject_item_name',
      align: 'center',
    },
    // 17.07.19废弃，换成课程总数
    // {
    //   title: '每课时长（分钟）',
    //   key: 'course_duration',
    //   align: 'center',
    //   width: 150,
    //   sortable: 'custom',
    // },
    // 再次废弃
    // {
    //   title: '课时数量（个）',
    //   key: 'course_total',
    //   align: 'center',
    //   width: 150,
    //   sortable: 'custom',
    // },
    {
      title: '产品总价（元）',
      key: 'price',
      align: 'center',
      width: 140,
      sortable: 'custom',
    },
    {
      title: '创建人',
      key: 'username',
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'created_at',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '销售状态',
      key: 'sale_status_name',
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
