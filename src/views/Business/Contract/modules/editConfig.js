/**
 * 合同编辑页 - 表单配置
 * @author hjz
 * @version 2017-06-20
 */

// 学生表单渲染数据
export function studentFormRender() {
  return {
    studentFormRender: [
      { label: '学员姓名', pholder: '请输入姓名', prop: 'display_name' },
      { label: '学员手机号码', pholder: '请输入手机号码', prop: 'phone' },
      { label: '家长姓名', pholder: '请输入姓名', prop: 'parent_name' },
      { label: '家长手机号码', pholder: '请输入手机号码', prop: 'parent_phone' },
      { label: '家长身份证号', pholder: '请输入身份证号', prop: 'parent_identity_card' },
      { label: '亲属关系', pholder: '请输入亲属关系', prop: 'relation' },
      null,
      { label: '当前年级', pholder: '请选择当前年级', prop: 'grade' },
      // 废除
      // { label: '学习科目', pholder: '请输入学科名称', prop: 'subject_type' },
      null,
      null,
    ],
  }
}

// 编辑页 - 表单数据提交后端前的处理函数
export function unit_encode(data) {
  return data
}

// 编辑页 - 添加产品的数据单元
export function productOrigin() {
  return {
    // 产品编号:required|distinct|exists:products,id
    product_id: null,
    // 购买数量:required|integer|min:1
    number: 1,
    // 单品优惠比例:sometimes|numeric|between:0,100
    discount_rate: 0,
    // !! 单品总额，后端无用数据，作为前端展示
    // 更新合同时候会返回这个字段
    money: 0,
  }
}

// 编辑页 - 初始化对象
export function editInit() {
  return {
    // 合同主要信息
    info: {
      // 1.1 合同名称：present|required|max:255
      display_name: '',
      // 1.2 流程类型编号:present|required
      flow_id: null,
      // 1.3 模板名称
      template_type: null,
      // 1.3 + 1.4 流程中涉及的审批人员编号，按顺序组成如下字符串:present|required
      authority: [
        // {
        //   // 审批人id:present|required|exists:users,id|distinct
        //   user_id: 22,
        // },
      ],
    },
    // 学员信息
    student: {
      // 学员编号，如果有则填写，没有则为null:sometimes|exists:student
      id: 1,
      // 2.1 学员姓名:present|required|string|max:255
      display_name: '',
      // 2.2 学员联系方式:sometimes|string|size:11
      phone: '',
      // 2.3 家长姓名:present|required|string|max:255
      parent_name: '',
      // 2.4 家长联系方式:present|required|string|size:11
      parent_phone: '',
      // 2.5 家长身份证号:present|required|string|between:15,18
      parent_identity_card: '',
      // 2.6 亲属关系:sometimes|string|max:32
      relation: '',
      // 2.7 省事区三级联动
      areas_code: [],
      // 2.7 自定义地址
      location: '',
      // 2.8 在读学校:sometimes|string|max:128/**/
      school: '',
      // 废除 2.9 学习科目:由于跟学员信息中字段有冲突，暂时不做验证
      // subject_type: '学习科目',
      // 2.10 性别：sometimes|integer
      gender: 3,
    },
    // 产品信息
    product: {
      // 废除 3.1 折扣:sometimes|numeric
      // discount: null,
      // 3.2 辅导地点:sometimes|string|max:255
      location: '',
      // 3.3 审批说明:sometimes|string|max:255
      note: '',
      // 3.0 添加产品列表
      list: [
        {
          // 产品编号:required|distinct|exists:products,id
          product_id: null,
          // 购买数量:required|integer|min:1
          number: 1,
          // 单品优惠比例:sometimes|numeric|between:0,100
          discount_rate: 0,
          // productOrigin中有说明
          money: 0,
        },
      ],
    },
  }
}

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
        that.$rules.required('流程名称', 'number', 'change'),
      ],
      template_type: [
        that.$rules.required('模板类型', 'number', 'change'),
      ],
    },
    authorityRules: {
      user_id: [
        that.$rules.required('角色选择', 'number', 'change'),
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
