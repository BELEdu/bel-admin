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

const ALGORITHM_KNOWLEDGE_SHOW = {
  name: '学员知识点详情',
  link: '/algorithm/knowledge/show/:id',
}

const ALGORITHM_KNOWLEDGE_DETAIL = {
  name: '学员知识点明细',
  link: '/algorithm/knowledge/detail/:id',
}

export default [
  /* --- 学员知识点 --- */

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

  // 学员知识点统计
  {
    path: ALGORITHM_KNOWLEDGE_SHOW.link,
    name: 'AlgorithmKnowledgeShow',
    component: views.AlgorithmKnowledgeShow,
    meta: {
      breadcrumb: [
        { name: '算法中心' },
        ALGORITHM_KNOWLEDGE_SHOW,
      ],
    },
  },

  // 学员知识点明细
  {
    path: ALGORITHM_KNOWLEDGE_DETAIL.link,
    name: 'AlgorithmKnowledgeDetail',
    component: views.AlgorithmKnowledgeDetail,
    meta: {
      breadcrumb: [
        { name: '算法中心' },
        ALGORITHM_KNOWLEDGE_DETAIL,
      ],
    },
  },
]
