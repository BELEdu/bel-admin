/**
 * 算法中心前端路由
 *
 * @author huojinzhao
 */

import * as views from '@/views'

const ALGORITHM_KNOWLEDGE = {
  name: '学员知识点',
  link: '/algorithm/knowledge',
}

export default [
  // 学员知识点
  {
    path: ALGORITHM_KNOWLEDGE.link,
    name: 'AlgorithmKnowledge',
    component: views.AlgorithmKnowledge,
    meta: {
      breadcrumb: [
        { name: '算法中心' },
        ALGORITHM_KNOWLEDGE,
      ],
    },
  },
]
