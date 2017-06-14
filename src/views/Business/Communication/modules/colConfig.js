import { createButton } from '@/utils'

export default function (that) {
  return [
    {
      title: '首次沟通时间',
      key: 'first_communication_at',
      align: 'center',
      width: 110,
    },
    {
      title: '最新回访时间',
      key: 'return_visited_at',
      align: 'center',
      width: 110,
    },
    {
      title: '联系方式',
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
      key: 'gender',
      align: 'center',
    },
    {
      title: '在读学校',
      key: 'school_name',
      align: 'center',
    },
    {
      title: '当前年级',
      key: 'grade',
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
      width: 60,
    },
    {
      title: '签约状态',
      key: 'status',
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
      key: '12',
      align: 'center',
      width: 300,
    },
    {
      title: '操作',
      key: '13',
      align: 'center',
      render: createButton([
        {
          icon: 'trash-a',
          type: 'error',
          click: that.toDelete,
        },
        {
          icon: 'edit',
          type: 'primary',
          click: that.toUpdate,
        },
      ]),
    },
  ]
}
