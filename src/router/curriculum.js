/**
 * 排课管理路由配置
 * @author yangjun
 * @version 2017-06-14
 */

import * as views from '@/views'

export default [
  {
    path: '/curriculum',
    name: 'Curriculum',
    redirect: '/Curriculum/studentcurricula',
    component: views.Curriculum,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
      ],
    },
  },
  {
    path: '/curriculum/teacher',
    name: 'CurriculumTeacher',
    component: views.CurriculumTeacher,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '教师排课' },
      ],
    },
  },
  {
    path: '/curriculum/teacher/edit/:id',
    name: 'CurriculumTeacherEdit',
    component: views.CurriculumTeacherEdit,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '教师排课' },
        { name: '教师排课表' },
      ],
    },
  },
  {
    path: '/Curriculum/studentcurricula',
    name: 'CurriculumStudentCurricula',
    component: views.CurriculumStudentCurricula,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课' },
      ],
    },
  },
  {
    path: '/curriculum/student/edit/:id',
    name: 'CurriculumStudentEdit',
    component: views.CurriculumStudentEdit,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课' },
        { name: '学员排课表' },
      ],
    },
  },
  {
    path: '/curriculum/student/clbumEdit/:id',
    name: 'CurriculumStudentClbumEdit',
    component: views.CurriculumStudentClbumEdit,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课' },
        { name: '班级排课表' },
      ],
    },
  },
  {
    path: '/curriculum/curricularecord',
    name: 'CurriculumRecord',
    component: views.CurriculumRecord,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '上课记录' },
      ],
    },
  },
  {
    path: '/curriculum/record/show/:id',
    name: 'CurriculumRecordShow',
    component: views.CurriculumRecordShow,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '上课记录' },
        { name: '学员' },
      ],
    },
  },
  {
    path: '/curriculum/record/classShow/:id',
    name: 'CurriculumRecordClassShow',
    component: views.CurriculumRecordClassShow,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '上课记录' },
        { name: '班级' },
      ],
    },
  },
  {
    path: '/curriculum/timetable',
    name: 'CurriculumTimeTable',
    component: views.CurriculumTimeTable,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '周课表' },
      ],
    },
  },
]
