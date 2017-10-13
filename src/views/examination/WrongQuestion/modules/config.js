/**
 * 错题管理 - 配置文件
 *
 * @author huojinzhao
 */
import { createButton } from '@/utils'

export function colConfig(that) {
  return [
    {
      title: '学员姓名',
      key: 1,
      align: 'center',
    },
    {
      title: '当前年级',
      key: 2,
      align: 'center',
    },
    {
      title: '学管师',
      key: 3,
      align: 'center',
    },
    {
      title: '测试次数',
      key: 4,
      align: 'center',
    },
    {
      title: '错题数',
      key: 5,
      align: 'center',
    },
    {
      title: '操作',
      key: 6,
      align: 'center',
      render: createButton([
        { text: '查看', type: 'primary', click: that.checkStu },
      ]),
    },
  ]
}

export const buffer = [
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
  {
    1: '王芳',
    2: '初中三年级',
    3: '赖小天',
    4: 10,
    5: 6,
  },
]
