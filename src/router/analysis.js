import * as views from '@/views'

export default [
  {
    path: '/analysis',
    name: 'Analysis',
    component: views.Analysis,
    meta: {
      breadcrumb: [
        { name: '统计管理' },
      ],
    },
  },
  {
    path: '/analysis/signanalysis',
    name: 'AnalysisSign',
    component: views.AnalysisSign,
    meta: {
      breadcrumb: [
        { name: '统计管理' },
        { name: '签约统计' },
      ],
    },
  },
  {
    path: '/analysis/curricula',
    name: 'AnalysisCurricula',
    component: views.AnalysisCurricula,
    meta: {
      breadcrumb: [
        { name: '统计管理' },
        { name: '课时统计' },
      ],
    },
  },
  {
    path: '/analysis/ranksummary',
    name: 'AnalysisRank',
    component: views.AnalysisRank,
    meta: {
      breadcrumb: [
        { name: '统计管理' },
        { name: '排名情况' },
      ],
    },
  },
]
