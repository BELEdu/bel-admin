import { createButton } from '@/utils'

export function colConfig(that) {
  return {
    // 饼图
    pie: [
      {
        title: '薄弱知识点',
        key: 1,
        align: 'center',
      },
      {
        title: '错题次数',
        key: 2,
        align: 'center',
      },
      {
        title: '类型题推荐',
        key: 3,
        align: 'center',
        render: createButton([
          { text: '去看看', type: 'primary', click: that.referTopic },
        ]),
      },
    ],
    // 线图
    line: [
      {
        title: '测试时间',
        key: 1,
        align: 'center',
      },
      {
        title: '评测试卷',
        key: 2,
        align: 'center',
      },
      {
        title: '难度系数',
        key: 3,
        align: 'center',
      },
    ],
  }
}

// 折线图测试数据 - 日期
function setDate() {
  return new Date(
    Number(`14${parseInt(Math.random() * 100000000000, 10)}`),
  ).toJSON().slice(0, 10)
}

// 折线图测试数据
function getLineData() {
  return Array(10).fill(null).map(() => {
    const tmp = setDate()
    return {
      1: tmp,
      2: `${tmp}语文小测`,
      3: +Math.random().toFixed(2),
    }
  })
}

export const buffer = {
  pie: [
    {
      1: '绝对值',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '三角函数',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '立方根',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '二元一次方程',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '导数',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '数列',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '立方体',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '正弦函数',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '余弦函数',
      2: Math.ceil((Math.random() * 20)),
    },
    {
      1: '平行线证明',
      2: Math.ceil((Math.random() * 20)),
    },
  ],
  line: getLineData(),
}

export const pieOption = {
  title: {
    text: '薄弱知识点',
    x: 'left',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    y: 'bottom',
    data: buffer.pie.map(item => item[1]),
  },
  calculable: true,
  series: [
    {
      name: '薄弱知识点',
      type: 'pie',
      radius: [30, 110],
      // center: ['75%', '50%'],
      roseType: 'area',
      data: buffer.pie.map((item) => {
        const { 1: name, 2: value } = item
        return { name, value }
      }),
    },
  ],
}

export const lineOption = {
  title: {
    text: '难度分析',
    x: 'left',
  },
  tooltip: {
    trigger: 'axis',
    show: true,
  },
  xAxis: {
    type: 'category',
    name: '评测试卷',
    nameLocation: 'end',
    data: buffer.line.map(item => item[1]),
    nameTextStyle: {
      fontWeight: 'bolder',
    },
    boundaryGap: false,
    axisTick: {
      interval: 0,
    },
    axisLabel: {
      // interval: 0,
      // rotate: 20,
    },
  },
  yAxis: {
    type: 'value',
    name: '难度系数',
    nameTextStyle: {
      fontWeight: 'bolder',
    },
    min: 0,
    max: 1,
  },
  series: [
    {
      name: '难度分析',
      type: 'line',
      data: buffer.line.map(item => item[3]),
    },
  ],
}
