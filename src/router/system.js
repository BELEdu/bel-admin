/**
 * 系统设置路由设置
 * @author lmh
 * @version 2017-06-06
 */

import * as views from '@/views'

export default [
  {
    path: '/system/role',
    name: 'SystemRole',
    component: views.SystemRole,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '角色管理' },
      ],
    },
  },
  {
    path: '/system/role/edit',
    name: 'SystemRoleAdd',
    component: views.SystemRoleEdit,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '角色管理' },
        { name: '添加角色' },
      ],
    },
  },
  {
    path: '/system/role/edit/:id',
    name: 'SystemRoleEdit',
    component: views.SystemRoleEdit,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '角色管理' },
        { name: '编辑角色' },
      ],
    },
  },
  {
    path: '/system/user',
    name: 'SystemUser',
    component: views.SystemUser,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '用户管理' },
      ],
    },
  },
  {
    path: '/system/user/edit',
    name: 'SystemUserAdd',
    component: views.SystemUserEdit,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '用户管理' },
        { name: '添加用户' },
      ],
    },
  },
  {
    path: '/system/user/edit/:id',
    name: 'SystemUserEdit',
    component: views.SystemUserEdit,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '用户管理' },
        { name: '编辑用户' },
      ],
    },
  },
  {
    path: '/system/log',
    name: 'SystemLog',
    component: views.SystemLog,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '日志管理' },
      ],
    },
  },
  {
    path: '/system/department',
    name: 'SystemDepartment',
    component: views.SystemDepartment,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '部门管理' },
      ],
    },
  },
]
