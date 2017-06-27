/**
 * 备课管理路由配置
 * @author hjz
 * @version 2017-06-26
 */

import * as views from '@/views'

export default [
  {
    path: '/prepare/prepareplan',
    name: 'PreparePrepareplan',
    component: views.Prepareplan,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '教案管理' },
      ],
    },
  },
  {
    path: '/prepare/smartpaper',
    name: 'PrepareSmartpaper',
    component: views.Smartpaper,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '智能组卷' },
      ],
    },
  },
  {
    path: '/prepare/smartpaper/:id',
    name: 'PrepareSmartpaperInfo',
    component: views.SmartpaperInfo,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '智能组卷' },
        { name: '学员试卷列表' },
      ],
    },
  },
  {
    path: '/prepare/smartquestion',
    name: 'PrepareSmartquestion',
    component: views.Smartquestion,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '个性题库' },
      ],
    },
  },
  {
    path: '/prepare/question',
    name: 'PrepareQuestion',
    component: views.Question,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '题库列表' },
      ],
    },
  },
]
