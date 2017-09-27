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
    rank: null,
    // 字典： grade
    grade: null,
    // 偏科情况
    tend_subject_description: '',
    // 沟通类型
    communication_type: null,
    // 沟通时间： date_format:Y-m-d
    communication_at: '',
    // 沟通情况： min:2|max:200
    communication_logs: [],
  }
}

// 返还给服务器的数据处理
export function encode(data) {
  const ectype = { ...data }

  // visited_at 处理首次时间
  if (typeof ectype.visited_at === 'object'
    && ectype.visited_at !== null
  ) {
    ectype.visited_at = ectype.visited_at.toJSON().slice(0, 10)
  }
  if (ectype.visited_at === ''
    || ectype.visited_at === '0000-00-00'
  ) {
    ectype.visited_at = null
  }

  return ectype
}

// 搜索配置
export function searchConfig() {
  return {
    // 关键字检索范围
    likeKeys: [],
    // 选择关键字
    likeKey: 'student_name',
    query: {
      'equal[student_current_status]': null,
      'equal[communication_type]': null,
    },
  }
}

// 沟通情况render
const buildLogs = (h, { row }) => h('div',
  {
    style: {
      'text-align': 'left',
    },
  },
  row.communication_logs.map(log => h('div',
    {
      style: {
        margin: '3px 0',
      },
    },
    [
      h('span',
        {
          style: {
            'font-weight': 'bold',
            'margin-right': '5px',
          },
        },
        log.communication_at,
      ),
      h('span', null, log.content),
    ],
  )),
)

// 列表头配置
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
      title: '学员手机号码',
      key: 'mobile',
      align: 'center',
      width: 115,
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
      title: '年段排名',
      key: 'rank',
      align: 'center',
      sortable: 'custom',
    },
    {
      title: '偏科情况',
      key: 'tend_subject_description',
      align: 'center',
    },
    {
      title: '当前状态',
      key: 'signed_status_name',
      align: 'center',
      width: 90,
    },
    {
      title: '沟通类型',
      key: 'communication_type_name',
      align: 'center',
    },
    {
      title: '沟通情况',
      key: 'logs',
      width: 400,
      align: 'center',
      render: buildLogs,
    },
    {
      title: '操作',
      key: '13',
      width: 180,
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
        {
          text: '记录',
          type: 'success',
          click: that.showRecord,
        },
      ]),
    },
  ]
}
