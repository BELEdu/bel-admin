/**
 * 日期时间校验
 * @author  chenliangshan
 * @time    2017/7/6
 */
/*eslint-disable*/
import rules from 'async-validator/lib/rule/';
import { isEmptyValue, format } from 'async-validator/lib/util';
import { toDate, setTime } from '../date'

function date(rule, value, callback, source, options) {
  // console.log('integer rule called %j', rule);
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (value) {
    value = Object.prototype.toString.call(value) !== '[object Date]' ? toDate(value) || setTime(value) : value
    if (rule.min) rule.min = toDate(rule.min).getTime()
    if (rule.max) rule.max = toDate(rule.max).getTime()
  }
  // console.log('validate on %s value', value);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    if (rule.refs) {
      // min_val
      if (rule.min_ref) {
        let timeVal = rule.refs[rule.min_ref].value
        // min_reauired
        if (!timeVal || rule.min_required) {
          rules.required(rule, timeVal, source, errors, options);
          return callback(errors);
        }
        rule.min = setTime(timeVal).getTime()
        // !is_equal
        if (rule.is_equal === false && rule.min === value.getTime()) {
          errors.push(format(options.messages['number'].min, rule.fullField, rule.min));
          return callback(errors);
        }
      }
    }
    rules.required(rule, value, source, errors, options);
    if (!isEmptyValue(value)) {
      rules.type(rule, value, source, errors, options);
      if (value) {
        rules.range(rule, value.getTime(), source, errors, options);
      }
    }
  }
  callback(errors);
}

export default date;
