/**
 * 学员课程路由设置
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-15
 */

import * as views from '@/views'

/* 学员课程 */
const STUDENT = {
  name: '学员课程',
}

/* 学员管理 */
const STUDENT_STUDENT = {
  routeName: 'StudentStudent',
  name: '学员管理',
  link: '/student/student',
}
const STUDENT_STUDENT_ADD = {
  routeName: 'StudentStudentAdd',
  name: '添加学员',
  link: '/student/student/add',
}
const STUDENT_STUDENT_EDIT = {
  routeName: 'StudentStudentEdit',
  name: '编辑学员',
  link: '/student/student/:id/edit',
}
const STUDENT_STUDENT_REVIEW = {
  routeName: 'StudentStudentReview',
  name: '学员详情',
  link: '/student/student/:id',
}
const STUDENT_STUDENT_REVIEW_INFO = {
  routeName: 'StudentStudentReviewInfo',
  name: '基本信息',
  link: '/student/student/:id/info',
}
const STUDENT_STUDENT_REVIEW_PRODECT = {
  routeName: 'StudentStudentReviewProduct',
  name: '签约产品',
  link: '/student/student/:id/product',
}

/* 班级管理 */
const STUDENT_CLASSES = {
  routeName: 'StudentClasses',
  name: '班级管理',
  link: '/student/classes',
}

const STUDENT_PLAN = { routeName: 'StudentPlan', name: '学习计划', link: '/student/plan' }
const STUDENT_SCHEDULE = { routeName: 'StudentSchedule', name: '教师课表', link: '/student/schedule' }
const STUDENT_MY_SCHEDULE = { routeName: 'StudentSchedule', name: '我的课表', link: '/student/myschedule/' }
const STUDENT_SCHEDULE_MANAGE = {
  routeName: 'StudentScheduleManage',
  name: '排课管理',
  link: '/student/schedule/manage/:id',
  tabName: [
    { name: '周课表', value: 'weekly' },
    { name: '日课表', value: 'daily' },
  ],
}
const STUDENT_SCHEDULE_MANAGE_WEEKLY = { routeName: 'StudentScheduleManageWeekly', name: '周课表', link: '/student/schedule/manage/weekly/:id' }
const STUDENT_SCHEDULE_MANAGE_DAILY = { routeName: 'StudentScheduleManageDaily', name: '日课表', link: '/student/schedule/manage/daily/:id' }
const STUDENT_MY_SCHEDULE_MANAGE = {
  routeName: 'StudentMyScheduleManage',
  name: '管理课表',
  link: '/student/myschedule',
  tabName: [
    { name: '周课表', value: 'weekly' },
    { name: '日课表', value: 'daily' },
  ],
}
const STUDENT_MY_SCHEDULE_MANAGE_WEEKLY = { routeName: 'StudentMyScheduleManageWeekly', name: '周课表', link: '/student/myschedule/manage/weekly' }
const STUDENT_MY_SCHEDULE_MANAGE_DAILY = { routeName: 'StudentMyScheduleManageDaily', name: '日课表', link: '/student/myschedule/manage/daily' }

export default [

  /* 学员管理 */

  // 学员列表
  {
    path: STUDENT_STUDENT.link,
    name: STUDENT_STUDENT.routeName,
    component: views.StudentStudent,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
      ],
    },
  },

  // 添加学员
  {
    path: STUDENT_STUDENT_ADD.link,
    name: STUDENT_STUDENT_ADD.routeName,
    component: views.StudentStudentEdit,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
        STUDENT_STUDENT_ADD,
      ],
    },
  },

  // 编辑学员
  {
    path: STUDENT_STUDENT_EDIT.link,
    name: STUDENT_STUDENT_EDIT.routeName,
    component: views.StudentStudentEdit,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
        STUDENT_STUDENT_EDIT,
      ],
    },
  },

  // 学员详情
  {
    path: STUDENT_STUDENT_REVIEW.link,
    name: STUDENT_STUDENT_REVIEW.routeName,
    redirect: STUDENT_STUDENT_REVIEW_INFO.link,
    component: views.StudentStudentReview,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
        STUDENT_STUDENT_REVIEW,
      ],
    },
    children: [

      // 基础信息
      {
        path: STUDENT_STUDENT_REVIEW_INFO.link,
        name: STUDENT_STUDENT_REVIEW_INFO.routeName,
        component: views.StudentStudentEdit,
        meta: {
          breadcrumb: [
            STUDENT,
            STUDENT_STUDENT,
            STUDENT_STUDENT_REVIEW_INFO,
          ],
        },
      },

      // 签约产品列表
      {
        path: STUDENT_STUDENT_REVIEW_PRODECT.link,
        name: STUDENT_STUDENT_REVIEW_PRODECT.routeName,
        component: views.StudentStudentReviewProduct,
        meta: {
          breadcrumb: [
            STUDENT,
            STUDENT_STUDENT,
            STUDENT_STUDENT_REVIEW_PRODECT,
          ],
        },
      },
    ],
  },

  // 旧版
  {
    path: '/student/student/:studentId',
    name: 'StudentStudentDetail',
    redirect: '/student/student/detail/editold',
    component: views.StudentStudentDetail,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        STUDENT_STUDENT,
        { name: '学员详情' },
      ],
    },
    children: [
      // 交流会
      {
        path: '/student/student/:studentId/Meeting',
        name: 'StudentStudentDetailMeeting',
        component: views.StudentStudentDetailMeeting,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            STUDENT_STUDENT,
            { name: '交流会' },
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
            { name: '交流会' },
            { name: '添加交流会' },
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
            { name: '交流会' },
            { name: '编辑交流会' },
          ],
        },
      },
    ],
  },

  /* 班级管理 */

  // 班级列表
  {
    path: STUDENT_CLASSES.link,
    name: STUDENT_CLASSES.routeName,
    component: views.StudentClasses,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_CLASSES,
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

  // 学习计划
  {
    path: STUDENT_PLAN.link,
    name: STUDENT_PLAN.routeName,
    component: views[STUDENT_PLAN.routeName],
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_PLAN,
      ],
    },
  },
  // 教师课表
  {
    path: STUDENT_SCHEDULE.link,
    name: STUDENT_SCHEDULE.routeName,
    component: views[STUDENT_SCHEDULE.routeName],
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_SCHEDULE,
      ],
    },
  },
  // 排课管理
  {
    path: STUDENT_SCHEDULE_MANAGE.link,
    name: STUDENT_SCHEDULE_MANAGE.routeName,
    component: views[STUDENT_SCHEDULE_MANAGE.routeName],
    redirect: STUDENT_SCHEDULE_MANAGE_WEEKLY.link,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_SCHEDULE,
        STUDENT_SCHEDULE_MANAGE,
      ],
    },
    children: [
      {
        path: STUDENT_SCHEDULE_MANAGE_WEEKLY.link,
        name: STUDENT_SCHEDULE_MANAGE_WEEKLY.routeName,
        component: views[STUDENT_SCHEDULE_MANAGE_WEEKLY.routeName],
        meta: {
          tabName: STUDENT_SCHEDULE_MANAGE.tabName,
          breadcrumb: [
            STUDENT,
            STUDENT_SCHEDULE,
            STUDENT_SCHEDULE_MANAGE_WEEKLY,
          ],
        },
      },
      {
        path: STUDENT_SCHEDULE_MANAGE_DAILY.link,
        name: STUDENT_SCHEDULE_MANAGE_DAILY.routeName,
        component: views[STUDENT_SCHEDULE_MANAGE_DAILY.routeName],
        meta: {
          tabName: STUDENT_SCHEDULE_MANAGE.tabName,
          breadcrumb: [
            STUDENT,
            STUDENT_SCHEDULE,
            STUDENT_SCHEDULE_MANAGE_DAILY,
          ],
        },
      },
    ],
  },

  // 我的课表
  {
    path: STUDENT_MY_SCHEDULE_MANAGE.link,
    name: STUDENT_MY_SCHEDULE_MANAGE.routeName,
    component: views[STUDENT_MY_SCHEDULE_MANAGE.routeName],
    redirect: STUDENT_MY_SCHEDULE_MANAGE_WEEKLY.link,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_MY_SCHEDULE,
        STUDENT_MY_SCHEDULE_MANAGE,
      ],
    },
    children: [
      {
        path: STUDENT_MY_SCHEDULE_MANAGE_WEEKLY.link,
        name: STUDENT_MY_SCHEDULE_MANAGE_WEEKLY.routeName,
        component: views[STUDENT_MY_SCHEDULE_MANAGE_WEEKLY.routeName],
        meta: {
          tabName: STUDENT_MY_SCHEDULE_MANAGE.tabName,
          breadcrumb: [
            STUDENT,
            STUDENT_MY_SCHEDULE,
            STUDENT_MY_SCHEDULE_MANAGE_WEEKLY,
          ],
        },
      },
      {
        path: STUDENT_MY_SCHEDULE_MANAGE_DAILY.link,
        name: STUDENT_MY_SCHEDULE_MANAGE_DAILY.routeName,
        component: views[STUDENT_MY_SCHEDULE_MANAGE_DAILY.routeName],
        meta: {
          tabName: STUDENT_MY_SCHEDULE_MANAGE.tabName,
          breadcrumb: [
            STUDENT,
            STUDENT_MY_SCHEDULE,
            STUDENT_MY_SCHEDULE_MANAGE_DAILY,
          ],
        },
      },
    ],
  },
]
