/**
 * 沟通记录 - 编辑配置
 * @author hjz
 * @version 2017-06-16
 */
import { createButton } from '@/utils'

// 编辑字段初始化
export function editInit() {
  return {
    // required|min:2|max:10
    student_name: '',
    // required|digits:11
    mobile: '',
    // 字典： gender
    gender: null,
    // min:2|max:20
    school_name: '',
    // min:2|max:10
    rank: '',
    // 字典： grade
    grade: null,
    // 是否偏科， 字典： is
    is_tend_subject: null,
    // 回访时间 ： date_format:Y-m-d
    return_visited_at: null,
    communication_type: null,
    // 沟通时间： date_format:Y-m-d
    communication_at: '',
    // 沟通情况： min:2|max:200
    communication_logs: [],
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

// 搜索配置
export function searchConfig() {
  return {
    // 关键字检索范围
    likeKeys: [
      { label: '学员姓名', value: 'student_name' },
      { label: '手机号码', value: 'mobile' },
      { label: '在读学校', value: 'school_name' },
    ],
    // 选择关键字
    likeKey: 'student_name',
    query: {
      // 时间段搜索
      between: {
        first_communication_at: [],
      },
      // 特殊字段搜索
      equal: {
        // 当前状态
        student_current_status: null,
        // 类型
        communication_type: null,
      },
    },
  }
}

// 列表头配置
export function colConfig(that) {
  return [
    {
      title: '首次沟通时间',
      key: 'first_communication_at',
      align: 'center',
      width: 110,
    },
    {
      title: '回访时间',
      key: 'return_visited_at',
      align: 'center',
      width: 110,
    },
    {
      title: '手机号码',
      key: 'mobile',
      align: 'center',
      width: 115,
    },
    {
      title: '学员姓名',
      key: 'student_name',
      align: 'center',
    },
    {
      title: '性别',
      key: 'gender_name',
      align: 'center',
    },
    {
      title: '在读学校',
      key: 'school_name',
      align: 'center',
    },
    {
      title: '当前年级',
      key: 'grade_name',
      align: 'center',
    },
    {
      title: '年段排名',
      key: 'rank',
      align: 'center',
    },
    {
      title: '偏科',
      key: 'is_tend_subject_name',
      align: 'center',
      width: 70,
    },
    {
      title: '当前状态',
      key: 'signed_status_name',
      align: 'center',
      width: 90,
    },
    {
      title: '类型',
      key: 'communication_type_name',
      align: 'center',
    },
    {
      title: '最新沟通情况',
      key: 'last_content',
      align: 'center',
      width: 300,
    },
    {
      title: '操作',
      key: '13',
      width: 130,
      align: 'center',
      render: createButton([
        {
          text: '删除',
          type: 'error',
          click: that.toDelete,
        },
        {
          text: '修改',
          type: 'primary',
          click: that.toUpdate,
        },
      ]),
    },
  ]
}
