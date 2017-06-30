/**
 * 公共验证规则
 * @author lmh
 * @version 2017-06-23
 */

const rules = {
  /**
   * 必填验证
   * @param {String} field - 必填项的label名，如“姓名”
   * @param {String} type - 数据类型，默认为string
   */
  required: (field, type = 'string', trigger = 'blur') => ({
    type,
    required: true,
    message: `${field}必填`,
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

  // 手机号码验证
  mobile: {
    pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/,
    message: '手机号码格式不正确',
    trigger: 'blur',
  },

  // 邮箱验证
  email: {
    type: 'email',
    message: '邮箱地址格式不正确',
    trigger: 'blur',
  },
}

export default class Rules {
  static install(Vue) {
    // eslint-disable-next-line
    Vue.prototype.$rules = rules
  }
}
