/**
 * 学员管理路由设置
 * @author zml
 * @version 2017-06-08
 */

import * as views from '@/views'

export default [
  {
    path: '/student',
    name: 'Student',
    // 测试:重定向到学员信息
    redirect: '/student/info',
    component: views.Student,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
      ],
    },
  },
  {
    path: '/student/info',
    name: 'StudentInfo',
    component: views.StudentInfo,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学员信息' },
      ],
    },
  },
  {
    path: '/student/info/detail',
    name: 'StudentInfoDetail',
    component: views.StudentInfoDetail,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学员信息' },
        { name: '添加学员' },
      ],
    },
  },
  {
    path: '/student/schedule',
    name: 'StudentSchedule',
    component: views.StudentSchedule,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学习进度' },
      ],
    },
  },
  {
    path: '/student/point',
    name: 'StudentPoint',
    component: views.StudentPoint,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学习知识点' },
      ],
    },
  },
  {
    path: '/student/class',
    name: 'StudentClass',
    component: views.StudentClass,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '班级管理' },
      ],
    },
  },
]
