/**
 * 业务配置
 * @author chenliangshan
 * @version 2017-10-26
 */

import * as views from '@/views'

export default [
  {
    path: '/setting/school',
    name: 'SettingSchool',
    component: views.SettingSchool,
    meta: {
      breadcrumb: [
        { name: '业务配置' },
        { name: '学校管理', link: '/setting/school' },
      ],
    },
  },
]
