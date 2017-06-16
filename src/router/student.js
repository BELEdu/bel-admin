/**
 * 学员管理路由设置
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-15
 */

import * as views from '@/views'

export default [
  {
    path: '/student',
    name: 'Student',
    // 测试:重定向到学员信息
    redirect: '/student/student',
    component: views.Student,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
      ],
    },
  },
  {
    path: '/student/student',
    name: 'StudentStudent',
    component: views.StudentStudent,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学员信息' },
      ],
    },
  },
  {
    path: '/student/student/edit',
    name: 'StudentStudentEdit',
    component: views.StudentStudentEdit,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学员信息' },
        { name: '添加学员' },
      ],
    },
  },
  {
    path: '/student/student/detail',
    name: 'StudentStudentDetail',
    redirect: '/student/student/detail/edit',
    component: views.StudentStudentDetail,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学员信息' },
        { name: '学员详情' },
      ],
    },
    children: [
      {
        path: '/student/student/detail/edit',
        name: 'StudentStudentDetailEdit',
        component: views.StudentStudentDetailEdit,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学员信息' },
            { name: '学员详情' },
            { name: '基础信息' },
          ],
        },
      },
      // 交流会
      {
        path: '/student/student/detail/Meeting',
        name: 'StudentStudentDetailMeeting',
        component: views.StudentStudentDetailMeeting,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学员信息' },
            { name: '学员详情' },
            { name: '交流会' },
          ],
        },
      },
      {
        path: '/student/student/detail/Meeting/edit',
        name: 'StudentStudentDetailMeetingAdd',
        component: views.StudentStudentDetailMeetingEdit,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学员信息' },
            { name: '学员详情' },
            { name: '交流会' },
            { name: '添加交流会' },
          ],
        },
      },
      {
        path: '/student/student/detail/Meeting/edit/:id',
        name: 'StudentStudentDetailMeetingEdit',
        component: views.StudentStudentDetailMeetingEdit,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学员信息' },
            { name: '学员详情' },
            { name: '交流会' },
            { name: '编辑交流会' },
          ],
        },
      },
      {
        path: '/student/student/detail/Warning',
        name: 'StudentStudentDetailWarning',
        component: views.StudentStudentDetailWarning,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学员信息' },
            { name: '学员详情' },
            { name: '预警信息' },
          ],
        },
      },
    ],
  },
  {
    path: '/student/studyprogress',
    name: 'StudentStudyprogress',
    component: views.StudentStudyprogress,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学习进度' },
      ],
    },
  },
  {
    path: '/student/knowledgepoint',
    name: 'StudentKnowledgepoint',
    component: views.StudentKnowledgepoint,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学员知识点' },
      ],
    },
  },
  {
    path: '/student/classes',
    name: 'StudentClasses',
    component: views.StudentClasses,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '班级管理' },
      ],
    },
  },
  {
    path: '/student/classes/edit',
    name: 'StudentClassesAdd',
    component: views.StudentClassesEdit,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '班级管理' },
        { name: '添加班级' },
      ],
    },
  },
  {
    path: '/student/classes/edit/:id',
    name: 'StudentClassesEdit',
    component: views.StudentClassesEdit,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '班级管理' },
        { name: '编辑班级' },
      ],
    },
  },
]
