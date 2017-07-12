/**
 * 合同编辑页 - 表单配置
 * @author hjz
 * @version 2017-06-20
 */

// 学生表单渲染数据
export const studentFormRender = [
  { label: '学员姓名', pholder: '请输入姓名', prop: 'display_name' },
  { label: '学员手机号码', pholder: '请输入手机号码', prop: 'phone' },
  { label: '家长姓名', pholder: '请输入姓名', prop: 'parent_name' },
  { label: '家长手机号码', pholder: '请输入手机号码', prop: 'parent_phone' },
  { label: '家长身份证号', pholder: '请输入身份证号', prop: 'parent_identity_card' },
  { label: '亲属关系', pholder: '请输入亲属关系', prop: 'relation' },
  null,
  { label: '在读学校', pholder: '请输入学校名称', prop: 'school' },
  // 废除
  // { label: '学习科目', pholder: '请输入学科名称', prop: 'subject_type' },
  null,
]

// 表单验证规则
export function formRules(that) {
  return {
    infoRules: {
      display_name: [
        that.$rules.required('合同名称'),
        that.$rules.max(255),
        that.$rules.name,
      ],
      flow_id: [
        that.$rules.required('流程名称', 'string', 'change'),
      ],
      template_type: [
        that.$rules.required('模板类型', 'string', 'change'),
      ],
    },
    studentRules: {
      display_name: [
        that.$rules.required('学生姓名'),
        that.$rules.max(255),
        that.$rules.name,
      ],
      phone: [
        that.$rules.mobile,
      ],
      parent_name: [
        that.$rules.required('合同名称'),
        that.$rules.max(255),
        that.$rules.name,
      ],
      parent_phone: [
        that.$rules.required('家长联系方式'),
        that.$rules.mobile,
      ],
      parent_identity_card: [
        that.$rules.required('家长身份证件号码'),
        that.$rules.idcard,
      ],
      relation: [
        that.$rules.max(32),
        that.$rules.chinese,
      ],
      school: [
        that.$rules.max(128),
        that.$rules.name,
      ],
    },
    productRules: {
      product_id: [
        that.$rules.required('产品类型', 'number', 'change'),
      ],
      location: [
        that.$rules.max(255),
      ],
      note: [
        that.$rules.max(255),
      ],
    },
  }
}
