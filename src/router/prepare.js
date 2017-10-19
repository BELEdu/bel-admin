/**
 * 备课管理路由配置
 *
 * @author huojinzhao
 */

import * as views from '@/views'

const PREPARE_PAPER = {
  name: '试卷中心',
  link: '/prepare/papercenter',
}

export default [
  /* 教案管理 */

  {
    path: '/prepare/prepareplan',
    name: 'PreparePrepareplan',
    component: views.PreparePrepareplan,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '教案管理' },
      ],
    },
  },
  {
    path: '/prepare/prepareplan/:id',
    name: 'PreparePrepareplanDetail',
    component: views.PreparePrepareplanDetail,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '教案管理', link: '/prepare/prepareplan' },
        { name: '教师教案' },
      ],
    },
  },

  /* 试卷中心 */

  // 列表页
  {
    path: '/prepare/papercenter',
    name: 'PreparePaper',
    component: views.PreparePaper,
    meta: {
      uri: '/paper_center',
      breadcrumb: [
        { name: '备课管理' },
        PREPARE_PAPER,
      ],
    },
  },

  // 智能组卷
  {
    path: '/prepare/papercenter/smartpaper',
    name: 'PreparePaperSmartpaper',
    component: views.PreparePaperSmartpaper,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        PREPARE_PAPER,
        { name: '智能组卷' },
      ],
    },
  },

  // 编辑试卷
  {
    path: '/prepare/papercenter/edit/:id',
    name: 'PreparePaperEdition',
    // 使用个性题库组件
    component: views.PreparePaper,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        PREPARE_PAPER,
        { name: '编辑试卷' },
      ],
    },
  },

  // 查看试卷
  {
    path: '/prepare/papercenter/check/:id',
    name: 'PreparePaperDetail',
    // 调用题库中心的组件
    component: views.QuestionPaperDetail,
    meta: {
      uri: '/paper_center',
      breadcrumb: [
        { name: '备课管理' },
        PREPARE_PAPER,
        { name: '编辑试卷' },
      ],
    },
  },

  /* 智能组卷 */

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

  /* 试题中心 */

  // 试题组卷
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

  // 题库列表 试卷预览
  {
    path: '/prepare/question/paperpreview',
    name: 'PrepareQuestionPaperpreview',
    component: views.PaperPreview,
    meta: {
      breadcrumb: [
        { name: '备课管理' },
        { name: '题库列表' },
        { name: '试卷预览' },
      ],
    },
  },
]
