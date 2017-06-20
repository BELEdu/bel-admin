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
  { label: '学习科目', pholder: '请输入学科名称', prop: 'subject_type' },
  null,
]

// 表单验证规则
export const formRules = {
  flowRules: {
    display_name: [
      { required: true, message: '请填写合同名称', trigger: 'blur' },
      { type: 'string', max: 255, message: '名称在255个字符以内', trigger: 'blur' },
      { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
    ],
  },
  studentRules: {
    display_name: [
      { required: true, message: '请填写学生名称', trigger: 'blur' },
      { type: 'string', max: 255, message: '名称在255个字符以内', trigger: 'blur' },
      { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
    ],
    phone: [
      { type: 'string', pattern: /^1\d+$/, min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    parent_name: [
      { required: true, message: '请填写家长名称', trigger: 'blur' },
      { type: 'string', max: 255, message: '名称在255个字符以内', trigger: 'blur' },
      { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
    ],
    parent_phone: [
      { required: true, message: '请输入联系方式', trigger: 'blur' },
      { type: 'string', pattern: /^1\d+$/, min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    parent_identity_card: [
      { required: true, message: '请填写身份证件号码', trigger: 'blur' },
      { type: 'string', min: 15, max: 18, message: '正确长度在15到18位之间' },
      { type: 'string', pattern: /^[A-Za-z\d]*$/, message: '证件号码只能包含数字或字母' },
    ],
    relation: [
      { type: 'string', max: 32, message: '正确长度在32个字符以内' },
      { type: 'string', pattern: /^[\u4e00-\u9fa5]*$/, message: '仅允许中文', trigger: 'blur' },
    ],
    school: [
      { type: 'string', max: 128, message: '正确长度在128个字符以内' },
      { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5\d]*$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
    ],
  },
  productRules: {
    product_id: [
      { required: true, message: '请选择产品' },
    ],
    discount: [
      { pattern: /^[1-9][0-9]*$/, message: '请输入正确的金额' },
    ],
    location: [
      { type: 'string', max: 255, message: '请输入255个字符以内', trigger: 'blur' },
    ],
    note: [
      { type: 'string', max: 255, message: '请输入255个字符以内', trigger: 'blur' },
    ],
  },
}
