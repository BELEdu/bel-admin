/**
 * 业务管理路由配置
 * @author hjz
 * @version 2017-06-06
 * @description 没有business路由组件，只用子路径下的四个路由组件
 */

import * as views from '@/views'
import { BUSINESS } from '@/store/mutationTypes'
import store from '@/store'

export default [
  {
    path: '/business/hotline',
    name: 'BussinessHotline',
    component: views.Hotline,
    meta: {
      uri: 'hotline',
      breadcrumb: [
        { name: '业务管理' },
        { name: '热线登记' },
      ],
    },
  },
  {
    path: '/business/hotline/edit',
    name: 'hotlineCreator',
    component: views.HotlineEditor,
    meta: {
      uri: 'hotline',
      breadcrumb: [
        { name: '业务管理' },
        { name: '热线登记' },
        { name: '添加热线' },
      ],
    },
  },
  {
    path: '/business/hotline/edit/:id',
    name: 'hotlineUpdator',
    component: views.HotlineEditor,
    meta: {
      uri: 'hotline',
      breadcrumb: [
        { name: '业务管理' },
        { name: '热线登记' },
        { name: '编辑热线' },
      ],
    },
  },
  {
    path: 'business/comm',
    name: 'BussinessComm',
    component: views.Comm,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '沟通记录' },
      ],
    },
    // beforeEnter(to, from, next) {
    //   store.commit(BUSINESS.ROUTE, 'comm')
    //   next()
    // },
  },
  {
    path: 'business/commedit',
    name: 'commCreator',
    component: views.CommEditor,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '沟通记录' },
        { name: '添加记录' },
      ],
    },
    // beforeEnter(to, from, next) {
    //   store.commit(BUSINESS.ROUTE, 'comm')
    //   next()
    // },
  },
  {
    path: 'business/commedit/:id',
    name: 'commUpdator',
    component: views.CommEditor,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '沟通记录' },
        { name: '编辑记录' },
      ],
    },
    // beforeEnter(to, from, next) {
    //   store.commit(BUSINESS.ROUTE, 'comm')
    //   next()
    // },
  },
  {
    path: 'business/contract',
    name: 'BussinessContract',
    component: views.Contract,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '合同审批' },
      ],
    },
    beforeEnter(to, from, next) {
      store.commit(BUSINESS.ROUTE, 'contract')
      next()
    },
  },
  {
    path: 'business/contractedit',
    name: 'ContractEditor',
    component: views.ContractEditor,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '合同审批' },
        { name: '添加审批' },
      ],
    },
    beforeEnter(to, from, next) {
      store.commit(BUSINESS.ROUTE, 'contract')
      next()
    },
  },
  {
    path: 'business/contractedit/:id',
    name: 'ContractFlow',
    component: views.ContractFlow,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '合同审批' },
        { name: '审批详情' },
      ],
    },
    beforeEnter(to, from, next) {
      store.commit(BUSINESS.ROUTE, 'contract')
      next()
    },
  },
  {
    path: 'business/product',
    name: 'BussinessProduct',
    component: views.Product,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '产品管理' },
      ],
    },
    beforeEnter(to, from, next) {
      store.commit(BUSINESS.ROUTE, 'product')
      next()
    },
  },
  {
    path: 'business/ProductEdit',
    name: 'prductCreator',
    component: views.ProductEditor,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        { name: '产品管理' },
        { name: '添加产品' },
      ],
    },
    beforeEnter(to, from, next) {
      store.commit(BUSINESS.ROUTE, 'product')
      next()
    },
  },
  {
    path: 'business/ProductEdit/:id',
    name: 'productUpdator',
    component: views.ProductEditor,
    meta: {
      title: '编辑产品',
      breadcrumb: [
        { name: '业务管理' },
        { name: '产品管理' },
        { name: '编辑产品' },
      ],
    },
    beforeEnter(to, from, next) {
      store.commit(BUSINESS.ROUTE, 'product')
      next()
    },
  },
]
