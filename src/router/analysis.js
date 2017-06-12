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
    path: '/analysis/data',
    name: 'AnalysisData',
    component: views.AnalysisData,
    meta: {
      breadcrumb: [
        { name: '统计管理' },
        { name: '数据统计' },
      ],
    },
  },
  {
    path: '/analysis/lesson',
    name: 'AnalysisLesson',
    component: views.AnalysisLesson,
    meta: {
      breadcrumb: [
        { name: '统计管理' },
        { name: '课时统计' },
      ],
    },
  },
  {
    path: '/analysis/rank',
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
