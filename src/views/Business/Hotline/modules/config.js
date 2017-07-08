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
    province_code: 0,
    city_code: 0,
    district_code: 0,
    grade: null,
    invited_teacher_id: '',
    market_staff_name: '',
    school_name: '',
    return_visited_at: null,
  }
}

// 返还给服务器的数据处理
export function encode(data) {
  /* 之前没用app-date-pick自行处理数据，此处先留着 */

  // // eslint-disable-next-line
  // let ectype = { ...data }
  // // visited_at 处理首次时间
  // if (typeof ectype.visited_at === 'object' && ectype.visited_at !== null) {
  //   ectype.visited_at = ectype.visited_at.toJSON().slice(0, 10)
  // }
  // if (ectype.visited_at === '' || ectype.visited_at === '0000-00-00') {
  //   ectype.visited_at = null
  // }
  // // return_visited_at 处理回访时间
  // if (typeof ectype.return_visited_at === 'object' && ectype.return_visited_at !== null) {
  //   ectype.return_visited_at = ectype.return_visited_at.toJSON().slice(0, 10)
  // }
  // if (ectype.return_visited_at === '' || ectype.return_visited_at === '0000-00-00') {
  //   ectype.return_visited_at = null
  // }
  // // 地址map编码

  // return ectype

  return data
}

// 搜索配置
export function searchConfig() {
  return {
    // 关键字检索范围
    likeKeys: [
      { label: '学员姓名', value: 'student_name' },
      { label: '家长姓名', value: 'elder_name' },
      { label: '手机号码', value: 'mobile' },
      { label: '邀约咨询师', value: 'invited_teacher_name' },
      { label: '签约咨询师', value: 'signed_teacher_name' },
      { label: '市场专员', value: 'market_staff_name' },
    ],
    // 选择关键字
    likeKey: 'student_name',
    query: {
      // 时间段搜索
      between: {
        visited_at: [],
      },
      // 特殊字段搜索
      equal: {
        student_current_status: null,
      },
    },
  }
}

export function colConfig(that) {
  return [
    {
      title: '来访日期',
      key: 'visited_at',
      align: 'center',
    },
    {
      title: '家长姓名',
      key: 'elder_name',
      align: 'center',
    },
    {
      title: '学员姓名',
      key: 'student_name',
      align: 'center',
    },
    {
      title: '在读学校',
      key: 'school_name',
      align: 'center',
    },
    {
      title: '所在地区',
      key: 'area',
      align: 'center',
    },
    {
      title: '当前年级',
      key: 'grade_name',
      align: 'center',
    },
    {
      title: '手机号码',
      key: 'mobile',
      width: 120,
      align: 'center',
    },
    {
      title: '邀约咨询师',
      key: 'invited_teacher_name',
      align: 'center',
    },
    {
      title: '签约咨询师',
      key: 'signed_teacher_name',
      align: 'center',
    },
    {
      title: '市场专员',
      key: 'market_staff_name',
      align: 'center',
    },
    {
      title: '当前状态',
      key: 'signed_status_name',
      align: 'center',
    },
    {
      title: '签约时间',
      key: 'signed_at',
      align: 'center',
    },
    {
      title: '合同金额',
      key: 'contract_total',
      align: 'center',
    },
    {
      title: '回访时间',
      key: 'return_visited_at',
      align: 'center',
    },
    {
      title: '操作',
      key: '17',
      width: 130,
      align: 'center',
      render: createButton([
        { text: '删除', type: 'error', click: that.toDelete },
        { text: '修改', type: 'primary', click: that.toUpdate },
      ]),
    },
  ]
}
