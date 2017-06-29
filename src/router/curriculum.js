/**
 * 排课管理路由配置
 * @author yangjun
 * @version 2017-06-14
 */

import * as views from '@/views'

const CURRICULUM_STUDENT_PATH = '/Curriculum/studentcurricula'
const CURRICULUM_STUDENT_LIST_PATH = '/Curriculum/studentcurricula/list'
const CURRICULUM_TEACHER_PATH = '/curriculum/teachercurricula'
const CURRICULUM_RECORD_PATH = '/curriculum/curricularecord'

export default [
  {
    path: '/curriculum',
    name: 'Curriculum',
    redirect: CURRICULUM_STUDENT_LIST_PATH,
    component: views.Curriculum,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
      ],
    },
  },
  {
    path: CURRICULUM_TEACHER_PATH,
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
    path: '/curriculum/teachercurricula/edit/:id',
    name: 'CurriculumTeacherEdit',
    component: views.CurriculumTeacherEdit,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '教师排课', link: CURRICULUM_TEACHER_PATH },
        { name: '教师排课表' },
      ],
    },
  },
  {
    path: CURRICULUM_STUDENT_PATH,
    name: 'CurriculumStudentCurricula',
    component: views.CurriculumStudentCurricula,
    redirect: CURRICULUM_STUDENT_LIST_PATH,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课' },
      ],
    },
    children: [{
      path: CURRICULUM_STUDENT_LIST_PATH,
      name: 'CurriculumStudentList',
      component: views.CurriculumStudentList,
      meta: {
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '学员列表' },
        ],
      },
    },
    {
      path: '/Curriculum/studentcurricula/class',
      name: 'CurriculumStudentClassList',
      component: views.CurriculumStudentClassList,
      meta: {
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '班级列表' },
        ],
      },
    }],
  },
  {
    path: '/curriculum/student/course/:id',
    name: 'CurriculumStudentCourse',
    component: views.CurriculumStudentCourse,
    redirect: '/curriculum/student/course/date/:id',
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
        { name: '学员排课表' },
      ],
    },
    children: [{
      path: '/curriculum/student/course/date/:id',
      name: 'CurriculumStudentCourseDate',
      component: views.CurriculumStudentCourseDate,
      meta: {
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '学员日课表' },
        ],
      },
    }, {
      path: '/curriculum/student/course/week/:id',
      name: 'CurriculumStudentCourseWeek',
      component: views.CurriculumStudentCourseWeek,
      meta: {
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '学员周课表' },
        ],
      },
    }],
  },
  {
    path: '/curriculum/class/course/:id',
    name: 'CurriculumStudentCourse',
    component: views.CurriculumStudentCourse,
    redirect: '/curriculum/class/course/date/:id',
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
        { name: '班级排课表' },
      ],
    },
    children: [{
      path: '/curriculum/class/course/date/:id',
      name: 'CurriculumClassCourseDate',
      component: views.CurriculumClassCourseDate,
      meta: {
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '班级日课表' },
        ],
      },
    }, {
      path: '/curriculum/class/course/week/:id',
      name: 'CurriculumClassCourseWeek',
      component: views.CurriculumClassCourseWeek,
      meta: {
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '班级周课表' },
        ],
      },
    }],
  },
  {
    path: CURRICULUM_RECORD_PATH,
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
        { name: '上课记录', link: CURRICULUM_RECORD_PATH },
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
        { name: '上课记录', link: CURRICULUM_RECORD_PATH },
        { name: '班级' },
      ],
    },
  },
]
