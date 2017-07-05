/**
 * 系统设置路由设置
 * @author lmh
 * @version 2017-06-06
 */

import * as views from '@/views'

const SYSTEM_ROLE = { name: '角色管理', link: '/system/role' }
const SYSTEM_USER = { name: '用户管理', link: '/system/user' }
const SYSTEM_PROCESS = { name: '流程管理', link: '/system/process' }

export default [
  // 角色管理
  {
    path: SYSTEM_ROLE.link,
    name: 'SystemRole',
    component: views.SystemRole,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        SYSTEM_ROLE,
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
        SYSTEM_ROLE,
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
        SYSTEM_ROLE,
        { name: '编辑角色' },
      ],
    },
  },
  // 用户管理
  {
    path: SYSTEM_USER.link,
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
        SYSTEM_USER,
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
        SYSTEM_USER,
        { name: '编辑用户' },
      ],
    },
  },
  {
    path: '/system/user/edit/:userId/role/:roleId',
    name: 'SystemUserRole',
    component: views.SystemUserRole,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        SYSTEM_USER,
        { name: '修改用户权限' },
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
  // 部门管理
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
  // 流程管理
  {
    path: SYSTEM_PROCESS.link,
    name: 'SystemProcess',
    component: views.SystemProcess,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        { name: '流程管理' },
      ],
    },
  },
  {
    path: '/system/process/edit',
    name: 'SystemProcessAdd',
    component: views.SystemProcessEdit,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        SYSTEM_PROCESS,
        { name: '添加流程' },
      ],
    },
  },
  {
    path: '/system/process/edit/:id',
    name: 'SystemProcessEdit',
    component: views.SystemProcessEdit,
    meta: {
      breadcrumb: [
        { name: '系统管理' },
        SYSTEM_PROCESS,
        { name: '编辑流程' },
      ],
    },
  },
]
