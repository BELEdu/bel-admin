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
    path: '/prepare/papercenter',
    name: 'PreparePaperCenter',
    component: views.Papercenter,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '组卷中心' },
      ],
    },
  },
  // 自定义路由，后期根据后端接口修改
  {
    path: '/prepare/papercenter/smartpaper',
    name: 'PrepareSmartpaper',
    component: views.Smartpaper,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '组卷中心' },
        { name: '学员智能组卷' },
      ],
    },
  },
  {
    path: '/prepare/papercenter/:id',
    name: 'PreparePaperInfo',
    component: views.Paperinfo,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '组卷中心' },
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
