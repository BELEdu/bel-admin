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

const ALGORITHM_KNOWLEDGE_INFO = {
  name: '学员知识点详情',
  link: '/algorithm/knowledge/info',
}

export default [
  /* --- 学员知识点 --- */

  // 学员知识点详情
  {
    path: ALGORITHM_KNOWLEDGE_INFO.link,
    name: 'AlgorithmKnowledgeInfo',
    component: views.AlgorithmKnowledgeInfo,
    meta: {
      breadcrumb: [
        { name: '算法中心' },
        ALGORITHM_KNOWLEDGE_INFO,
      ],
    },
  },

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
