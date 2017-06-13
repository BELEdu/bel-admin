/**
 * 排课管理路由配置
 * @author yangjun
 * @version 2017-06-14
 */

import * as views from '@/views'

export default [
  {
    path: '/arrange',
    name: 'Arrange',
    redirect: '/arrange/student',
    component: views.Arrange,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
      ],
    },
  },
  {
    path: '/arrange/teacher',
    name: 'ArrangeTeacher',
    component: views.ArrangeTeacher,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '教师排课' },
      ],
    },
  },
  {
    path: '/arrange/teacher/edit/:id',
    name: 'ArrangeTeacherEdit',
    component: views.ArrangeTeacherEdit,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
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
        { name: '课程管理' },
        { name: '学员排课' },
      ],
    },
  },
  {
    path: '/arrange/student/edit/:id',
    name: 'ArrangeStudentEdit',
    component: views.ArrangeStudentEdit,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课' },
        { name: '学员排课表' },
      ],
    },
  },
  {
    path: '/arrange/record/class',
    name: 'ArrangeRecordClass',
    component: views.ArrangeRecordClass,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '班级排课' },
      ],
    },
  },
  {
    path: '/arrange/record/personal',
    name: 'ArrangeRecordPersonal',
    component: views.ArrangeRecordPersonal,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '非班级排课' },
      ],
    },
  },
  {
    path: '/arrange/timetable',
    name: 'ArrangeTimeTable',
    component: views.ArrangeTimeTable,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '周课表' },
      ],
    },
  },
]
