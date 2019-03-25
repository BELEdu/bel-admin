/**
 * 热线登记 - 编辑配置
 * @author hjz
 * @version 2017-06-16
 */
import { createButton } from '@/utils'

export function editInit() {
  return {
    student_name: '',
    gender: null,
    elder_name: '',
    mobile: '',
    school_name: '',
    grade: null,
    apply_course_intention: null,
    invited_teacher_id: null,
    market_staff_name: '',
    visited_at: null,
    return_visited_at: '',
  }
}

// 搜索配置
export function searchConfig() {
  return {
    // 关键字检索范围
    likeKeys: [],
    // 选择关键字
    likeKey: 'student_name',
    query: {
      // 时间段搜索
      'between[visited_at]': [],
      // 特殊字段搜索
      'equal[student_current_status]': null,
      'equal[apply_course_intention]': null,
    },
  }
}

export function colConfig(that) {
  return [
    {
      title: '学员姓名',
      key: 'student_name',
      align: 'center',
    },
    {
      title: '学员性别',
      key: 'gender_name',
      align: 'center',
    },
    {
      title: '家长姓名',
      key: 'elder_name',
      align: 'center',
    },
    {
      title: '手机号码',
      key: 'phone',
      width: 120,
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
      sortable: 'custom',
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
      title: '报班意向',
      key: 'apply_course_intention_name',
      align: 'center',
    },
    {
      title: '签约时间',
      key: 'signed_at',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '来访日期',
      key: 'visited_at',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '回访时间',
      key: 'return_visited_at',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '操作',
      key: '17',
      width: 130,
      align: 'center',
      render: createButton([
        {
          text: '删除',
          type: 'error',
          click: ({ id }) => that.deleteItem(id),
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
