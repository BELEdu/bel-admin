/**
 * 学员管理路由设置
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-15
 */

import * as views from '@/views'

const STUDENT_STUDENT = { name: '学员信息', link: '/student/student' }
const STUDENT_CLASSES = { name: '班级管理', link: '/student/classes' }

export default [
  {
    path: '/student',
    name: 'Student',
    // 测试:重定向到学员信息
    redirect: STUDENT_STUDENT.link,
    component: views.Student,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
      ],
    },
  },
  {
    path: STUDENT_STUDENT.link,
    name: 'StudentStudent',
    component: views.StudentStudent,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        STUDENT_STUDENT,
      ],
    },
  },
  {
    path: '/student/student/edit',
    name: 'StudentStudentAdd',
    component: views.StudentStudentDetailEdit,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        STUDENT_STUDENT,
        { name: '添加学员' },
      ],
    },
  },
  {
    path: '/student/student/:studentId',
    name: 'StudentStudentDetail',
    redirect: '/student/student/detail/edit',
    component: views.StudentStudentDetail,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        STUDENT_STUDENT,
        { name: '学员详情' },
      ],
    },
    children: [
      {
        path: '/student/student/:studentId/edit',
        name: 'StudentStudentDetailEdit',
        component: views.StudentStudentDetailEdit,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            STUDENT_STUDENT,
            { name: '学员详情' },
          ],
        },
      },
      // 交流会
      {
        path: '/student/student/:studentId/Meeting',
        name: 'StudentStudentDetailMeeting',
        component: views.StudentStudentDetailMeeting,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            STUDENT_STUDENT,
            { name: '学员详情' },
          ],
        },
      },
      {
        path: '/student/student/:studentId/Meeting/edit',
        name: 'StudentStudentDetailMeetingAdd',
        component: views.StudentStudentDetailMeetingEdit,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            STUDENT_STUDENT,
            { name: '学员详情' },
          ],
        },
      },
      {
        path: '/student/student/:studentId/Meeting/edit/:meetingId',
        name: 'StudentStudentDetailMeetingEdit',
        component: views.StudentStudentDetailMeetingEdit,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            STUDENT_STUDENT,
            { name: '学员详情' },
          ],
        },
      },
      {
        path: '/student/student/:studentId/Warning',
        name: 'StudentStudentDetailWarning',
        component: views.StudentStudentDetailWarning,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            STUDENT_STUDENT,
            { name: '学员详情' },
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
    path: STUDENT_CLASSES.link,
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
        STUDENT_CLASSES,
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
        STUDENT_CLASSES,
        { name: '编辑班级' },
      ],
    },
  },
]
