/**
 * 公共验证规则
 * @author lmh
 * @version 2017-06-23
 */
import validatorDate from './validator/date'

const rules = {
  /**
   * 必填验证
   * @param {String} field - 必填项的label名，如“姓名”
   * @param {String} type - 数据类型，默认为string
   */
  required: (field, type = 'string', trigger = 'blur') => ({
    type,
    required: true,
    message: `${field}不能为空`,
    trigger,
  }),

  /**
   * 长度验证
   * @param {Number} min - 最小长度
   * @param {Number} max - 最大长度
   */
  length: (min, max) => ({
    min,
    max,
    message: `字符长度应在${min}到${max}之间`,
    trigger: 'blur',
  }),

  min: min => ({
    min,
    message: `至少输入${min}个以上字符`,
    trigger: 'blur',
  }),

  max: max => ({
    max,
    message: `只能输入最多${max}个字符`,
    trigger: 'blur',
  }),

  // 数字验证
  number: {
    pattern: /^[0-9]*$/,
    message: '请输入数字',
    trigger: 'blur',
  },

  // 价格验证(小数点后最多两位，不能以01开头，小数点后必须要有数字)
  price: {
    pattern: /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/,
    message: '请输入正确的价格',
    trigger: 'blur',
  },

  // 手机号码验证
  mobile: {
    pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/,
    message: '手机号码格式不正确',
    trigger: 'blur',
  },

  // 身份证验证
  idcard: {
    pattern: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
    message: '身份证格式不正确',
    trigger: 'blur',
  },

  // 邮箱验证
  email: {
    type: 'email',
    message: '邮箱地址格式不正确',
    trigger: 'blur',
  },

  // 汉字验证
  chinese: {
    pattern: /^[\u4e00-\u9fa5]{0,}$/,
    message: '请输入汉字',
    trigger: 'blur',
  },

  // 姓名验证（中文包含少数民族如：买买提·陈奕迅·阿凡提，英文名支持由空格和·分隔开）
  name: {
    pattern: /^([\u4e00-\u9fa5]+|[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*|([a-zA-Z]+\s?)+|[a-zA-Z]+(·[a-zA-Z]+)*)$/,
    message: '姓名格式不正确',
    trigger: 'blur',
  },

  date: (field, params, validator = validatorDate) => ({
    required: true,
    type: 'date',
    message: `${field}`,
    trigger: 'change',
    ...params,
    validator,
  }),
}

export default class Rules {
  static install(Vue) {
    // eslint-disable-next-line
    Vue.prototype.$rules = rules
  }
}
