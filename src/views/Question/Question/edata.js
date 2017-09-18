export default {
  grade_range_subject: [
    {
      id: 1,
      display_name: '初中数学',
    },
    {
      id: 3,
      display_name: '初中物理',
    },
  ],
  question_type: [
    {
      value: 1,
      display_name: '选择题',
      question_template: 1,
    },
    {
      value: 2,
      display_name: '判断题',
      question_template: 2,
    },
    {
      value: 3,
      display_name: '问答题',
      question_template: 3,
    },
    {
      value: 4,
      display_name: '计算题',
      question_template: 1,
    },
    {
      value: 5,
      display_name: '解答题',
      question_template: 1,
    },
    {
      value: 6,
      display_name: '画图题',
      question_template: 2,
    },
    {
      value: 7,
      display_name: '什么题',
      question_template: 2,
    },
  ],
  question_difficulty: [
    {
      value: 1,
      display_name: '容易',
    },
    {
      value: 2,
      display_name: '较易',
    },
    {
      value: 3,
      display_name: '中等',
    },
    {
      value: 4,
      display_name: '较难',
    },
    {
      value: 5,
      display_name: '困难',
    },
  ],
  paper_type: [
    {
      value: 1,
      display_name: '历年真题',
    },
    {
      value: 2,
      display_name: '模拟题',
    },
    {
      value: 1,
      display_name: '历年真题',
    },
    {
      value: 2,
      display_name: '模拟题',
    },
    {
      value: 1,
      display_name: '历年真题',
    },
    {
      value: 2,
      display_name: '模拟题',
    },
    {
      value: 1,
      display_name: '历年真题',
    },
    {
      value: 2,
      display_name: '模拟题',
    },
    {
      value: 1,
      display_name: '历年真题',
    },
    {
      value: 2,
      display_name: '模拟题',
    },
  ],
  year: [
    {
      value: 2017,
      display_name: '2017',
    },
    {
      value: 2016,
      display_name: '2016',
    },
    {
      value: 2014,
      display_name: '2014',
    },
    {
      value: 2015,
      display_name: '2015',
    },
  ],
  knowledge_tree: [
    {
      id: 1,
      p_id: 0,
      display_name: '测试1',
      expanded: false,
      children: [
        {
          id: 2,
          p_id: 1,
          display_name: '测试2',
          leaf: true,
        },
        {
          id: 3,
          p_id: 1,
          display_name: '测试3',
          expanded: false,
          children: [
            {
              id: 5,
              p_id: 3,
              display_name: '测试42',
              leaf: true,
            },
          ],
        },
        {
          id: 4,
          p_id: 1,
          display_name: '测试4',
          leaf: true,
        },
      ],
    },
  ],

  user_label_list: [
    {
      id: 1,
      display_name: '标签1',
    },
    {
      id: 2,
      display_name: '标签2',
    },
  ],
}
