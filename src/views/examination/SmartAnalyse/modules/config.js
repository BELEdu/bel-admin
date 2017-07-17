/**
 * 智能分析 - 配置文件
 * @author hjz
 * @version 2017-06-22
 */
// eslint-disable-next-line
import echarts from 'echarts'
import { createButton } from '@/utils'

export function colConfig(that) {
  return [
    {
      title: '学员姓名',
      key: 1,
      align: 'center',
    },
    {
      title: '学科',
      key: 2,
      align: 'center',
    },
    {
      title: '考试次数',
      key: 3,
      align: 'center',
    },
    {
      title: '考题数',
      key: 4,
      align: 'center',
    },
    {
      title: '错题率',
      key: 5,
      align: 'center',
    },
    // 平均分废弃
    {
      title: '平均分',
      key: 6,
      align: 'center',
    },
    {
      title: '操作',
      key: 7,
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
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
  {
    1: '王芳',
    2: '【语文】【数学】【英语】',
    3: 5,
    4: 22,
    5: '50%',
    6: 60,
  },
]

export const errorOption = {
  title: {
    text: '全员易错知识点',
    left: 'left',
  },
  tooltip: {
    triger: 'item',
    formatter: '{a} <br/>{b} : {c}({d}%)',
  },
  series: {
    name: '易错知识点',
    type: 'pie',
    data: [
      { name: '倍数的特征', value: 0.21 },
      { name: '有理数的认知', value: 0.43 },
      { name: '奇数与偶数的初步认识', value: 0.51 },
      { name: '绝对值', value: 0.9 },
      { name: '整数的认识', value: 0.67 },
      { name: '数与式', value: 0.59 },
      { name: '因式分解', value: 0.86 },
      { name: '一元二次方程', value: 0.76 },
      { name: '数与式', value: 0.32 },
    ],
  },
}


// 已废弃，知识点柱状图展示
// export const errorOption = {
//   title: {
//     text: '全体学员易错知识点',
//     left: 'center',
//   },
//   tooltip: {

//   },
//   xAxis: {
//     name: '知识点',
//     nameLocation: 'middle',
//     nameTextStyle: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#00a8ff',
//     },
//     axisLine: {
//       show: true,
//     },
//     axisTick: {
//       show: false,
//     },
//     axisLabel: {
//       inside: true,
//       formatter(value) {
//         return value.split('').join('\n')
//       },
//       textStyle: {
//         // color: '#fff',
//       },
//     },
// eslint-disable-next-line
//     data: ['倍数的特征', '有理数的认知', '奇数与偶数的初步认识', '绝对值', '整数的认识', '数与式', '因式分解', '一元二次方程', '数与式', '二元一次方程', '有理数'],
//     z: 10,
//   },
//   yAxis: {
//     name: '失\n分\n率',
//     nameLocation: 'middle',
//     nameRotate: 0,
//     nameTextStyle: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#00a8ff',
//     },
//     axisLine: {
//       show: true,
//     },
//     axisTick: {
//       show: false,
//     },
//     axisLabel: {
//       show: false,
//       textStyle: {
//         color: '#999',
//       },
//     },
//     splitLine: {
//       show: false,
//     },
//   },
//   series: [
//     {
//       type: 'bar',
//       itemStyle: {
//         normal: {
//           color: new echarts.graphic.LinearGradient(
//             0, 0, 0, 1,
//             [
//               { offset: 0, color: '#83bff6' },
//               { offset: 0.5, color: '#188df0' },
//               { offset: 1, color: '#188df0' },
//             ],
//           ),
//         },
//         emphasis: {
//           color: new echarts.graphic.LinearGradient(
//             0, 0, 0, 1,
//             [
//               { offset: 0, color: '#2378f7' },
//               { offset: 0.7, color: '#2378f7' },
//               { offset: 1, color: '#83bff6' },
//             ],
//           ),
//         },
//       },
//       barCategoryGap: '40%',
//       data: [0.21, 0.43, 0.51, 0.9, 0.67, 0.59, 0.86, 0.76, 0.32, 0.11, 0.3],
//       tooltip: {
//         formatter({ name, data }) {
//           return `${name}: ${data * 100}%`
//         },
//       },
//     },
//   ],
// }

export { errorOption as scoreOption }
