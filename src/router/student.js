/**
 * 学员课程路由设置
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-15
 */

import * as views from '@/views'

const STUDENT = { name: '学员课程' }
const STUDENT_STUDENT = { name: '学员管理', link: '/student/student' }
const STUDENT_CLASSES = { name: '班级管理', link: '/student/classes' }
const STUDENT_PLAN = { routeName: 'StudentPlan', name: '学习计划', link: '/student/plan' }
const STUDENT_SCHEDULE = { routeName: 'StudentSchedule', name: '教师课表', link: '/student/schedule' }
const STUDENT_SCHEDULE_MANAGE = {
  routeName: 'StudentScheduleManage',
  name: '排课管理',
  link: '/student/schedule/manage/:id',
  tabName: [
    { name: '周课表', value: 'week' },
    { name: '日课表', value: 'day' },
  ],
}
const STUDENT_SCHEDULE_MANAGE_WEEK = { routeName: 'StudentScheduleManageWeek', name: '周课表', link: '/student/schedule/manage/week/:id' }
const STUDENT_SCHEDULE_MANAGE_DAY = { routeName: 'StudentScheduleManageDay', name: '周课表', link: '/student/schedule/manage/day/:id' }

export default [

  // 学员课程 - 学员管理
  {
    path: STUDENT_STUDENT.link,
    name: 'StudentStudent',
    component: views.StudentStudent,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
      ],
    },
  },
  {
    path: '/student/student/add',
    name: 'StudentStudentAdd',
    component: views.StudentStudentEdit,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
        { name: '添加学员' },
      ],
    },
  },
  // 旧版添加学员（到时候要删除）
  {
    path: '/student/student/edit',
    name: 'StudentStudentAddOld',
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
    path: '/student/student/:id/edit',
    name: 'StudentStudentEdit',
    component: views.StudentStudentEdit,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
        { name: '编辑学员' },
      ],
    },
  },
  {
    path: '/student/student/:id',
    name: 'StudentStudentReview',
    redirect: '/student/student/:id/info',
    component: views.StudentStudentReview,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_STUDENT,
        { name: '学员详情' },
      ],
    },
    children: [
      {
        path: '/student/student/:id/info',
        name: 'StudentStudentReviewInfo',
        component: views.StudentStudentEdit,
        meta: {
          breadcrumb: [
            STUDENT,
            STUDENT_STUDENT,
            { name: '基本信息' },
          ],
        },
      },
      {
        path: '/student/student/:id/product',
        name: 'StudentStudentReviewProduct',
        component: views.StudentStudentReviewProduct,
        meta: {
          breadcrumb: [
            STUDENT,
            STUDENT_STUDENT,
            { name: '签约产品' },
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
      {
        path: '/student/student/:studentId/editold',
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
      {
        path: '/student/student/:studentId/Warning',
        name: 'StudentStudentDetailWarning',
        component: views.StudentStudentDetailWarning,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            STUDENT_STUDENT,
            { name: '预警信息' },
          ],
        },
      },
    ],
  },

  // 学员进度
  {
    path: '/student/studyprogress',
    name: 'StudentStudyprogress',
    redirect: '/student/studyprogress/student',
    component: views.StudentStudyprogress,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学习进度' },
      ],
    },
    children: [
      {
        path: '/student/studyprogress/student',
        name: 'StudentStudyprogressStudent',
        component: views.StudentStudyprogressStudent,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学习进度' },
          ],
        },
      },
      {
        path: '/student/studyprogress/classes',
        name: 'StudentStudyprogressClasses',
        component: views.StudentStudyprogressClasses,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学习进度' },
          ],
        },
      },
    ],
  },
  {
    path: '/student/studyprogress/:type/:id/add',
    name: 'StudentStudyprogressAdd',
    component: views.StudentStudyprogressAdd,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学习进度' },
        { name: '添加计划' },
      ],
    },
  },
  {
    path: '/student/studyprogress/:type/:id',
    name: 'StudentStudyprogressDetail',
    redirect: '/student/studyprogress/:type/:id/progress',
    component: views.StudentStudyprogressDetail,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学习进度' },
        { name: '进度详情(主组件)' },
      ],
    },
    children: [
      {
        path: '/student/studyprogress/:type/:id/progress',
        name: 'StudentStudyprogressDetailProgress',
        component: views.StudentStudyprogressDetailProgress,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学习进度' },
            { name: '学习进度' },
          ],
        },
      },
      {
        path: '/student/studyprogress/:type/:id/plan',
        name: 'StudentStudyprogressDetailPlan',
        component: views.StudentStudyprogressDetailPlan,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学习进度' },
            { name: '学习计划' },
          ],
        },
      },
      {
        path: '/student/studyprogress/:type/:id/history',
        name: 'StudentStudyprogressDetailHistory',
        component: views.StudentStudyprogressDetailHistory,
        meta: {
          breadcrumb: [
            { name: '学员管理' },
            { name: '学习进度' },
            { name: '历史计划' },
          ],
        },
      },
    ],
  },

  // 学员知识点
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
    path: '/student/knowledgepoint/:id',
    name: 'StudentKnowledgepointDetail',
    component: views.StudentKnowledgepointDetail,
    meta: {
      breadcrumb: [
        { name: '学员管理' },
        { name: '学员知识点', link: '/student/knowledgepoint' },
        { name: '学员知识点详情' },
      ],
    },
  },

  // 班级管理
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
    redirect: STUDENT_SCHEDULE_MANAGE_WEEK.link,
    meta: {
      breadcrumb: [
        STUDENT,
        STUDENT_SCHEDULE,
        STUDENT_SCHEDULE_MANAGE,
      ],
    },
    children: [
      {
        path: STUDENT_SCHEDULE_MANAGE_WEEK.link,
        name: STUDENT_SCHEDULE_MANAGE_WEEK.routeName,
        component: views[STUDENT_SCHEDULE_MANAGE_WEEK.routeName],
        meta: {
          tabName: STUDENT_SCHEDULE_MANAGE.tabName,
          breadcrumb: [
            STUDENT,
            STUDENT_SCHEDULE,
            STUDENT_SCHEDULE_MANAGE_WEEK,
          ],
        },
      },
      {
        path: STUDENT_SCHEDULE_MANAGE_DAY.link,
        name: STUDENT_SCHEDULE_MANAGE_DAY.routeName,
        component: views[STUDENT_SCHEDULE_MANAGE_DAY.routeName],
        meta: {
          tabName: STUDENT_SCHEDULE_MANAGE.tabName,
          breadcrumb: [
            STUDENT,
            STUDENT_SCHEDULE,
            STUDENT_SCHEDULE_MANAGE_DAY,
          ],
        },
      },
    ],
  },

]
