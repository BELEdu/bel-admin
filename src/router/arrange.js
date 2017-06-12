/**
 * 排课管理路由配置
 * @author yangjun
 * @version 2017-06-08
 */

import * as views from '@/views'

export default [
  {
    path: '/arrange/teacher',
    name: 'ArrangeTeacher',
    component: views.ArrangeTeacher,
    meta: {
      breadcrumb: [
        { name: '排课管理' },
        { name: '教师排课' },
      ],
    },
  },
  {
    path: '/arrange/teacher/detail/:id',
    name: 'ArrangeTeacherDetail',
    component: views.ArrangeTeacherDetail,
    meta: {
      breadcrumb: [
        { name: '排课管理' },
        { name: '教师排课' },
        { name: '教师排课表' },
      ],
    },
  },
  {
    path: '/arrange/student',
    name: 'ArrangeStudent',
    component: views.ArrangeStudent,
    meta: {
      breadcrumb: [
        { name: '排课管理' },
        { name: '学员排课' },
      ],
    },
  },
  {
    path: '/arrange/student/detail/:id',
    name: 'ArrangeStudentDetail',
    component: views.ArrangeStudentDetail,
    meta: {
      breadcrumb: [
        { name: '排课管理' },
        { name: '学员排课' },
        { name: '学员排课表' },
      ],
    },
  },
]
