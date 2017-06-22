/**
 * 智能测试 - 配置文件
 * @author hjz
 * @version 2017-06-22
 */
import { createButton } from '@/utils'

// 当前状态 - 根据状态调整原点颜色
const suitColor = (status) => {
  let className = ''
  switch (status) {
    // 未签约
    case 1:
      className = 'bg-warning'
      break
    // 上课
    case 2:
      className = 'bg-primary'
      break
    // 结课
    case 3:
      className = 'bg-info'
      break
    // 停课
    case 4:
      className = 'bg-error'
      break
    // 休学
    case 5:
      className = 'bg-error'
      break
    // 默认
    default:
      className = ''
  }
  return className
}

// 当前状态 - 根据数据生成render元素
const currentColor = (h, params) => h(
  'Button',
  {
    props: { type: 'ghost', size: 'small' },
  },
  [
    h(
      'span',
      {
        class: suitColor(params.row[2].status),
        style: {
          display: 'inline-block',
          'margin-right': '3px',
          height: '12px',
          width: '12px',
          'border-radius': '50%',
          'vertical-align': '-1px',
        },
      },
    ),
    `${params.row[2].text}`,
  ],
)

export function colConfig(that) {
  return [
    {
      title: '测试对象',
      key: 1,
      align: 'center',
    },
    {
      title: '当前状态',
      key: 2,
      align: 'center',
      render: currentColor,
    },
    {
      title: '产品名称',
      key: 3,
      align: 'center',
    },
    {
      title: '已上课时',
      key: 4,
      align: 'center',
    },
    {
      title: '测试次数',
      key: 5,
      align: 'center',
    },
    {
      title: '操作',
      key: 6,
      align: 'center',
      render: createButton([
        { text: '查看', type: 'primary', click: that.checkStu },
        { text: '立即测试', type: 'primary', click: that.examineStu },
      ]),
    },
  ]
}

export const buffer = [
  {
    1: '王芳',
    2: { text: '未签约', status: 1 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '上课', status: 2 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '结课', status: 3 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '停课', status: 4 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '休学', status: 5 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '未签约', status: 1 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '上课', status: 2 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '结课', status: 3 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '停课', status: 4 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
  {
    1: '王芳',
    2: { text: '休学', status: 5 },
    3: '个性化一对一教学，晚间辅导',
    4: 30,
    5: 10,
  },
]
