/**
 * 排课管理路由配置
 * @author yangjun
 * @version 2017-06-14
 */

import * as views from '@/views'

const CURRICULUM_STUDENT_PATH = '/curriculum/studentcurricula'
const CURRICULUM_STUDENT_LIST_PATH = '/curriculum/studentcurricula/student'
const CURRICULUM_TEACHER_PATH = '/curriculum/teachercurricula'
const CURRICULUM_RECORD_PATH = '/curriculum/curricularecord'
// 学员排课||教师排课
const COURSE_MANAGE = [{
  name: '课表',
  value: 'date',
}, {
  name: '周课表',
  value: 'week',
}]
// 上课记录
const RECORD_TAB = [{
  name: '学员',
  value: 'student',
}, {
  name: '班级',
  value: 'class',
}, {
  name: '晚辅导',
  value: 'coach',
}]
const STUDENT_TAB = [{
  name: '学员',
  value: 'student',
}, {
  name: '班级',
  value: 'class',
}, {
  name: '晚辅导',
  value: 'coach',
}]

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
    path: '/curriculum/teachercurricula/course/:id',
    name: 'CurriculumTeacherCourse',
    component: views.CurriculumTeacherCourse,
    redirect: '/curriculum/teachercurricula/course/date/:id',
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '教师排课', link: CURRICULUM_TEACHER_PATH },
        { name: '教师排课表' },
      ],
    },
    children: [{
      path: '/curriculum/teachercurricula/course/date/:id',
      name: 'CurriculumTeacherCourseDate',
      component: views.CurriculumTeacherCourseDate,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '教师排课', link: CURRICULUM_TEACHER_PATH },
          { name: '教师课表' },
        ],
      },
    }, {
      path: '/curriculum/teachercurricula/course/week/:id',
      name: 'CurriculumTeacherCourseWeek',
      component: views.CurriculumTeacherCourseWeek,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '教师排课', link: CURRICULUM_TEACHER_PATH },
          { name: '教师周课表' },
        ],
      },
    }],
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
        tabName: STUDENT_TAB,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '学员列表' },
        ],
      },
    },
    {
      path: '/curriculum/studentcurricula/class',
      name: 'CurriculumStudentClassList',
      component: views.CurriculumStudentClassList,
      meta: {
        tabName: STUDENT_TAB,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '班级列表' },
        ],
      },
    },
    {
      path: '/curriculum/studentcurricula/coach',
      name: 'CurriculumStudentCoachList',
      component: views.CurriculumStudentCoachList,
      meta: {
        tabName: STUDENT_TAB,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '辅导班列表' },
        ],
      },
    }],
  },
  {
    path: '/curriculum/studentcurricula/student/course/:id',
    name: 'CurriculumStudentCourse',
    component: views.CurriculumStudentCourse,
    redirect: '/curriculum/studentcurricula/student/course/date/:id',
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
        { name: '学员排课表' },
      ],
    },
    children: [{
      path: '/curriculum/studentcurricula/student/course/date/:id',
      name: 'CurriculumStudentCourseDate',
      component: views.CurriculumStudentCourseDate,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '学员课表' },
        ],
      },
    }, {
      path: '/curriculum/studentcurricula/student/course/week/:id',
      name: 'CurriculumStudentCourseWeek',
      component: views.CurriculumStudentCourseWeek,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '学员周课表' },
        ],
      },
    }],
  },
  {
    path: '/curriculum/studentcurricula/class/course/:id',
    name: 'CurriculumClassCourse',
    component: views.CurriculumStudentCourse,
    redirect: '/curriculum/studentcurricula/class/course/date/:id',
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
        { name: '班级排课表' },
      ],
    },
    children: [{
      path: '/curriculum/studentcurricula/class/course/date/:id',
      name: 'CurriculumClassCourseDate',
      component: views.CurriculumClassCourseDate,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '班级课表' },
        ],
      },
    }, {
      path: '/curriculum/studentcurricula/class/course/week/:id',
      name: 'CurriculumClassCourseWeek',
      component: views.CurriculumClassCourseWeek,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '班级周课表' },
        ],
      },
    }],
  },
  {
    path: '/curriculum/studentcurricula/coach/course/:id',
    name: 'CurriculumCoachCourse',
    component: views.CurriculumStudentCourse,
    redirect: '/curriculum/studentcurricula/coach/course/date/:id',
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
        { name: '晚辅导排课表' },
      ],
    },
    children: [{
      path: '/curriculum/studentcurricula/coach/course/date/:id',
      name: 'CurriculumCoachCourseDate',
      component: views.CurriculumCoachCourseDate,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '晚辅导课表' },
        ],
      },
    }, {
      path: '/curriculum/studentcurricula/coach/course/week/:id',
      name: 'CurriculumCoachCourseWeek',
      component: views.CurriculumCoachCourseWeek,
      meta: {
        tabName: COURSE_MANAGE,
        breadcrumb: [
          { name: '课程管理' },
          { name: '学员排课', link: CURRICULUM_STUDENT_PATH },
          { name: '晚辅导周课表' },
        ],
      },
    }],
  },
  {
    path: CURRICULUM_RECORD_PATH,
    name: 'CurriculumRecord',
    component: views.CurriculumRecord,
    redirect: '/curriculum/curricularecord/student',
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '上课记录' },
      ],
    },
    children: [{
      path: '/curriculum/curricularecord/student',
      name: 'CurriculumRecordStudent',
      component: views.CurriculumRecordStudent,
      meta: {
        tabName: RECORD_TAB,
        breadcrumb: [
          { name: '课程管理' },
          { name: '上课记录', link: CURRICULUM_RECORD_PATH },
          { name: '学员记录' },
        ],
      },
    }, {
      path: '/curriculum/curricularecord/class',
      name: 'CurriculumRecordClass',
      component: views.CurriculumRecordClass,
      meta: {
        tabName: RECORD_TAB,
        breadcrumb: [
          { name: '课程管理' },
          { name: '上课记录', link: CURRICULUM_RECORD_PATH },
          { name: '班级记录' },
        ],
      },
    }, {
      path: '/curriculum/curricularecord/coach',
      name: 'CurriculumRecordCoach',
      component: views.CurriculumRecordCoach,
      meta: {
        tabName: RECORD_TAB,
        breadcrumb: [
          { name: '课程管理' },
          { name: '上课记录', link: CURRICULUM_RECORD_PATH },
          { name: '晚辅导记录' },
        ],
      },
    }],
  },
  {
    path: '/curriculum/curricularecord/student/show/:id',
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
    path: '/curriculum/curricularecord/class/:id',
    name: 'CurriculumRecordClassList',
    component: views.CurriculumRecordClassList,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '上课记录', link: CURRICULUM_RECORD_PATH },
        { name: '班级' },
      ],
    },
  },
  {
    path: '/curriculum/curricularecord/class/:classId/list/:id',
    name: 'CurriculumRecordClassShow',
    component: views.CurriculumRecordClassShow,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '上课记录', link: CURRICULUM_RECORD_PATH },
        { name: '班级' },
        { name: '学员列表' },
      ],
    },
  },
  {
    path: '/curriculum/curricularecord/coach/show/:id',
    name: 'CurriculumRecordCoachShow',
    component: views.CurriculumRecordCoachShow,
    meta: {
      breadcrumb: [
        { name: '课程管理' },
        { name: '上课记录', link: CURRICULUM_RECORD_PATH },
        { name: '晚辅导' },
      ],
    },
  },
]
