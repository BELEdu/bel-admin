/**
 * 业务管理路由配置
 * @author hjz
 * @version 2017-06-06
 * @description 没有business路由组件，只用子路径下的四个路由组件
 */

import * as views from '@/views'

const BUSINESS_HOTLINE = {
  name: '热线登记',
  link: '/business/hotline',
}

const BUSINESS_COMMUNICATION = {
  name: '沟通记录',
  link: '/business/communication',
}

const BUSINESS_PRODUCT = {
  name: '产品管理',
  link: '/business/product',
}

const BUSINESS_CONTRACT = {
  name: '签约审批',
  link: '/business/contract',
}

const BUSINESS_PROMOTION = {
  name: '优惠活动',
  link: '/business/promotion',
}

export default [
  /* 热线登记 */

  // 列表页
  {
    path: '/business/hotline',
    name: 'BussinessHotline',
    component: views.Hotline,
    meta: {
      uri: '/hotline',
      breadcrumb: [
        { name: '业务管理' },
        { name: '热线登记' },
      ],
    },
  },
  // 新建热线
  {
    path: '/business/hotline/edit',
    name: 'BussinessHotlineCreate',
    component: views.HotlineEdit,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_HOTLINE,
        { name: '新建热线' },
      ],
    },
  },
  // 更新热线
  {
    path: '/business/hotline/edit/:id',
    name: 'BussinessHotlineUpdate',
    component: views.HotlineEdit,
    meta: {
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_HOTLINE,
        { name: '编辑热线' },
      ],
    },
  },

  // 沟通记录
  {
    path: 'business/communication',
    name: 'BussinessCommunication',
    component: views.Communication,
    meta: {
      uri: 'communication',
      breadcrumb: [
        { name: '业务管理' },
        { name: '沟通记录' },
      ],
    },
  },
  // 沟通记录 创建记录
  {
    path: 'business/communication/edit',
    name: 'BussinenssCommunicationCreate',
    component: views.CommunicationEdit,
    meta: {
      uri: 'communication',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_COMMUNICATION,
        { name: '新建记录' },
      ],
    },
  },
  // 沟通记录 更新记录
  {
    path: 'business/communication/edit/:id',
    name: 'BussinenssCommunicationUpdate',
    component: views.CommunicationEdit,
    meta: {
      uri: 'communication',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_COMMUNICATION,
        { name: '编辑记录' },
      ],
    },
  },

  /* --- 签约审批 --- */

  // 列表页
  {
    path: 'business/contract',
    name: 'BussinessContract',
    component: views.Contract,
    meta: {
      uri: 'contract',
      breadcrumb: [
        { name: '业务管理' },
        { name: '合同审批' },
      ],
    },
  },
  // 创建普通合同
  {
    path: 'business/contract/edit',
    name: 'BussinessContractCreate',
    component: views.ContractEdit,
    meta: {
      uri: 'contract',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '新建审批' },
      ],
    },
  },
  // 更新合同（普通）
  {
    path: 'business/contract/edit/:id',
    name: 'BussinessContractUpdate',
    component: views.ContractEdit,
    meta: {
      uri: 'contract/edit',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '审批详情' },
      ],
    },
  },
  // 更新合同（退费）
  {
    path: 'business/contract/refund/edit/:id',
    name: 'BussinessContractRefundUpdate',
    component: views.ContractRefund,
    meta: {
      uri: 'contract/refund/edit',
      action: 'update',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '更新审批' },
      ],
    },
  },
  // 创建退费合同
  {
    path: 'business/contract/refund/:id',
    name: 'BussinessContractRefundCreate',
    component: views.ContractRefund,
    meta: {
      uri: 'contract/refund',
      action: 'create',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '退费审批' },
      ],
    },
  },
  // 查看（退费）
  {
    path: 'business/contract/refund/info/:id',
    name: 'BussinessContractRefundInfo',
    component: views.ContractAudit,
    meta: {
      operationType: 'info',
      contractType: 'refund',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '审批详情' },
      ],
    },
  },
  // 审批 （退费）
  {
    path: 'business/contract/refund/audit/:id',
    name: 'BussinessContractRefundAudit',
    component: views.ContractAudit,
    meta: {
      operationType: 'audit',
      contractType: 'refund',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '审批详情' },
      ],
    },
  },
  // 查看（普通）
  {
    path: 'business/contract/info/:id',
    name: 'BussinessContractInfo',
    component: views.ContractAudit,
    meta: {
      operationType: 'info',
      contractType: 'contract',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '审批详情' },
      ],
    },
  },
  // 审批 （普通）
  {
    path: 'business/contract/audit/:id',
    name: 'BussinessContractAudit',
    component: views.ContractAudit,
    meta: {
      operationType: 'audit',
      contractType: 'contract',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_CONTRACT,
        { name: '审批详情' },
      ],
    },
  },

  /* --- 产品管理 --- */

  // 产品管理
  {
    path: 'business/product',
    name: 'BussinessProduct',
    component: views.Product,
    meta: {
      uri: 'product',
      breadcrumb: [
        { name: '业务管理' },
        { name: '产品管理' },
      ],
    },
  },
  // 产品管理 新建产品
  {
    path: 'business/Product/edit',
    name: 'BussinessProductCreate',
    component: views.ProductEdit,
    meta: {
      uri: 'product',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_PRODUCT,
        { name: '新建产品' },
      ],
    },
  },
  // 产品管理 更新产品
  {
    path: 'business/Product/edit/:id',
    name: 'BussinessProductUpdate',
    component: views.ProductEdit,
    meta: {
      uri: 'product',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_PRODUCT,
        { name: '编辑产品' },
      ],
    },
  },

  // 优惠活动
  {
    path: BUSINESS_PROMOTION.link,
    name: 'BussinessProductPromotion',
    component: views.Promotion,
    meta: {
      uri: 'product',
      breadcrumb: [
        { name: '业务管理' },
        BUSINESS_PROMOTION,
      ],
    },
  },
]
