import { createButton } from '@/utils'

export function encode() {
  //
}

export function editInit() {
  return {
    // 产品名称
    display_name: '',
    // 课程时长
    course_duration: 40,
    // 课程总数
    // course_total: 5,
    // 产品价格
    price: '500.00',
    sale_status: 1,
    user_id: 22,
    company_id: 1,
    status: 1,
    // 创建时间
    created_at: '2017-06-17 06:33:43',
    username: 'admin',
    sale_status_name: '在售',
    // 产品类型
    product_type_name: '一对一',
    // 产品子类型
    product_subtype_name: null,
  }
}

// 调整后端数据为需求格式
export function decode(buffer) {
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

// eslint-disable-next-line
export function colConfig(that) {
  return [
    {
      title: '产品编号',
      key: 'product_number',
      align: 'center',
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
      title: '课程时长（分中）',
      key: 'course_duration',
      align: 'center',
    },
    {
      title: '产品单价（元）',
      key: 'price',
      align: 'center',
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
        { text: '删除', type: 'error', click: that.toCreate },
        { text: '编辑', type: 'primary', click: that.toUpdate },
      ]),
    },
  ]
}
