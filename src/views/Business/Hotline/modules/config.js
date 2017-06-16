/**
 * 热线登记 - 编辑配置
 * @author hjz
 * @version 2017-06-16
 */
import { createButton } from '@/utils'

export function editInit() {
  return {
    visited_at: null,
    elder_name: '',
    student_name: '',
    mobile: '',
    province_id: 0,
    city_id: 0,
    district_id: 0,
    grade: 0,
    invited_teacher_id: '',
    market_staff_name: '',
    school_name: '',
    return_visited_at: null,
  }
}

// 返还给服务器的数据处理
export function encode(data) {
  // eslint-disable-next-line
  let ectype = { ...data }
  // visited_at 处理首次时间
  if (typeof ectype.visited_at === 'object' && ectype.visited_at !== null) {
    ectype.visited_at = ectype.visited_at.toJSON().slice(0, 10)
  }
  if (ectype.visited_at === '' || ectype.visited_at === '0000-00-00') {
    ectype.visited_at = null
  }
  // return_visited_at 处理回访时间
  if (typeof ectype.return_visited_at === 'object' && ectype.return_visited_at !== null) {
    ectype.return_visited_at = ectype.return_visited_at.toJSON().slice(0, 10)
  }
  if (ectype.return_visited_at === '' || ectype.return_visited_at === '0000-00-00') {
    ectype.return_visited_at = null
  }
  // 地址map编码

  return ectype
}

export function colConfig(that) {
  return [
    {
      title: '来访日期',
      key: 'visited_at',
      align: 'center',
      width: 95,
      fixed: 'left',
    },
    {
      title: '家长姓名',
      key: 'elder_name',
      align: 'center',
      width: 90,
      fixed: 'left',
    },
    {
      title: '学员姓名',
      key: 'student_name',
      align: 'center',
      width: 90,
      fixed: 'left',
    },
    {
      title: '学校',
      key: 'school_name',
      align: 'center',
      width: 120,
    },
    {
      title: '年级',
      key: 'grade_name',
      align: 'center',
      width: 80,
    },
    {
      title: '联系方式',
      key: 'mobile',
      align: 'center',
      width: 120,
    },
    {
      title: '邀约咨询师',
      key: '7',
      align: 'invited_teacher_name',
      width: 100,
    },
    {
      title: '签约咨询师',
      key: '8',
      align: 'center',
      width: 100,
    },
    {
      title: '途径',
      key: '9',
      align: 'center',
      width: 80,
    },
    {
      title: '市场专员',
      key: 'market_staff_name',
      align: 'center',
      width: 90,
    },
    {
      title: '是否签约',
      key: '11',
      align: 'center',
      width: 90,
    },
    {
      title: '签约日期',
      key: '12',
      align: 'center',
      width: 95,
    },
    {
      title: '合同金额',
      key: '13',
      align: 'center',
      width: 90,
    },
    {
      title: '实收金额',
      key: '14',
      align: 'center',
      width: 100,
    },
    {
      title: '是否全款',
      key: '15',
      align: 'center',
      width: 90,
    },
    {
      title: '二次上门日期',
      key: 'return_visited_at',
      align: 'center',
      width: 120,
    },
    {
      title: '操作',
      key: '17',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: createButton([
        { text: '删除', type: 'error', click: that.toDelete },
        { text: '修改', type: 'primary', click: that.toUpdate },
      ]),
    },
  ]
}
