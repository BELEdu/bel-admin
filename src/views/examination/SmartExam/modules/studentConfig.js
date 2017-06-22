/**
 * 测试管理 - 智能测试 - 学员测试配置文件
 * @author hjz
 * @version 2017-06-22
 */
// import { createButton } from '@/utils'

// 列表 - 操作 - 按钮action
const stageOperate = status => () => {
  window.console.log(status.code)
}

// 列表 - 操作 - 按钮render
const stageOperateBtn = (h, params) => h(
  'Button',
  {
    props: { type: 'text', size: 'small' },
    on: { click: stageOperate(params.row.status) },
    class: 'color-primary',
  },
  params.row.status.text,
)

// eslint-disable-next-line
export function colConfig(that) {
  return [
    {
      title: '测试对象',
      key: 1,
      align: 'center',
    },
    {
      title: '测试类型',
      key: 2,
      align: 'center',
    },
    {
      title: '测试科目',
      key: 3,
      align: 'center',
    },
    {
      title: '测试时间',
      key: 4,
      align: 'center',
    },
    {
      title: '评测试卷',
      key: 5,
      align: 'center',
    },
    {
      title: '创建人',
      key: 6,
      align: 'center',
    },
    {
      title: '分数',
      key: 7,
      align: 'center',
    },
    {
      title: '操作',
      key: 8,
      align: 'center',
      render: stageOperateBtn,
    },
  ]
}

export const buffer = [
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '阅卷', code: 2 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '分析', code: 3 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
  {
    1: '王芳',
    2: '知识点测试',
    3: '语文',
    4: '2017-06-06',
    5: '2017年6月15日语文小册',
    6: '赖小天',
    7: '60',
    status: { text: '测试中', code: 1 },
  },
]
