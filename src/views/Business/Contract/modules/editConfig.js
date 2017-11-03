/**
 * 合同编辑页 - 表单配置
 *
 * @author huojinzhao
 */

// 学生表单渲染数据
export const studentFormRender = () => [
  {
    label: '学员姓名',
    type: 'input',
    placeholder: '请输入姓名',
    prop: 'student_name',
  },
  {
    label: '学员性别',
    type: 'radio',
    dictName: 'gender',
    placeholder: '',
    prop: 'gender',
  },
  {
    label: '学员身份证号',
    type: 'input',
    placeholder: '请输入身份证号',
    prop: 'identity_card',
  },
  {
    label: '学员手机号码',
    type: 'input',
    placeholder: '请输入手机号码',
    prop: 'phone',
  },
  {
    label: '家长姓名',
    type: 'input',
    placeholder: '请输入姓名',
    prop: 'parent_name',
  },
  {
    label: '家长手机号码',
    type: 'input',
    placeholder: '请输入手机号码',
    prop: 'parent_phone',
  },
  {
    label: '家长身份证号',
    type: 'input',
    placeholder: '请输入身份证号',
    prop: 'parent_identity_card',
  },
  {
    label: '亲属关系',
    type: 'select',
    dictName: 'relation',
    placeholder: '请选择...',
    prop: 'relation',
  },
  {
    // 复合项，自定义
    label: '家庭住址',
    type: 'custom_address',
  },
  {
    label: '在读学校',
    type: 'select',
    dictName: 'school_list',
    placeholder: '请选择...',
    prop: 'school',
  },
  {
    label: '当前年级',
    type: 'select',
    dictName: 'grade',
    placeholder: '请选择...',
    prop: 'current_grade',
  },
]

// 编辑页 - 表单数据提交后端前的处理函数
export const unit_encode = (fdata) => {
  const contract_promotion = fdata.contract_promotion
    .filter(promotion => promotion.id > -1)
  return { ...fdata, ...{ contract_promotion } }
}

// 编辑页 - 添加产品的数据单元
export const productOrigin = () => ({
  product_id: null,
  number: 1,
  money: 0,
})

// 编辑页 - 添加优惠活动的数据单元
export const promotionOrigin = () => ({
  // 无优惠活动时的默认值
  promotion_id: -1,
})

// 编辑页 - 初始化对象
export const editInit = () => ({
  /* 第一步数据 */

  student_number: '',

  flow_id: null,

  authority: [],

  /* 第二步数据 */

  student_id: null,

  student_name: '',

  gender: null,

  identity_card: '',

  phone: '',

  parent_name: '',

  parent_phone: '',

  parent_identity_card: '',

  relation: null,

  areas_code: [],

  location: '',

  school: null,

  current_grade: null,

  /* 第三步数据 */

  note: '',

  contract_product: [
    {
      product_id: null,

      number: 1,

      money: 0,
    },
  ],

  // 产品净总金额
  original_money: 0,

  // 优惠后的实际总金额
  money: 0,

  contract_promotion: [
    {
      promotion_id: -1,
    },
  ],
})

// 表单验证规则
export const formRules = that => ({
  /* --- 第一步校验 --- */

  student_number: [
    that.$rules.required('学员编号'),
  ],

  flow_id: [
    that.$rules.required('流程名称', 'number', 'change'),
  ],

  template_type: [
    that.$rules.required('模板类型', 'number', 'change'),
  ],

  // 验证user_id
  authorityRules: [
    that.$rules.required('角色选择', 'number', 'change'),
  ],

  /* --- 第二步校验 --- */

  student_name: [
    that.$rules.required('学生姓名'),
    that.$rules.max(255),
    that.$rules.name,
  ],

  gender: [
    that.$rules.required('学员性别', 'number', 'change'),
  ],

  identity_card: [
    that.$rules.required('学生身份证件号码'),
    that.$rules.idcard,
  ],

  phone: [
    that.$rules.required('学员手机号码'),
    that.$rules.mobile,
  ],

  parent_name: [
    that.$rules.required('家长姓名'),
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
    that.$rules.required('在读学校', 'number', 'change'),
  ],

  areas_code: [
    { validator: that.validateAreas, trigger: 'change' },
  ],

  location: [
    { validator: that.validateLocation, trigger: 'change' },
  ],

  school: [
    that.$rules.required('在读学校', 'number', 'change'),
  ],

  current_grade: [
    that.$rules.required('当前年级', 'number', 'change'),
  ],

  /* --- 第三步校验 --- */
  contract_product: [
    that.$rules.required('产品', 'number', 'change'),
  ],
})
