/**
 * 日期时间格式转换
 * @author  chenliangshan
 * @time    2017/7/3
 */
/*eslint-disable*/

import dateUtil from './date';

export const toDate = function(date) {
  date = new Date(date);
  if (isNaN(date.getTime())) return null;
  return date;
};

export const formatDate = function(date, format) {
  date = toDate(date);
  if (!date) return '';
  return dateUtil.format(date, format || 'yyyy-MM-dd');
};

export const parseDate = function(string, format) {
  return dateUtil.parse(string, format || 'yyyy-MM-dd');
};

export const getDayCountOfMonth = function(year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }

  if (month === 1) {
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  }

  return 31;
};

export const getFirstDayOfMonth = function(date) {
  const temp = new Date(date.getTime());
  temp.setDate(1);
  return temp.getDay();
};

export const prevMonth = function(src) {
  const year = src.getFullYear();
  const month = src.getMonth();
  const date = src.getDate();

  const newYear = month === 0 ? year - 1 : year;
  const newMonth = month === 0 ? 11 : month - 1;

  const newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
  if (newMonthDayCount < date) {
    src.setDate(newMonthDayCount);
  }

  src.setMonth(newMonth);
  src.setFullYear(newYear);

  return new Date(src.getTime());
};

export const nextMonth = function(src) {
  const year = src.getFullYear();
  const month = src.getMonth();
  const date = src.getDate();

  const newYear = month === 11 ? year + 1 : year;
  const newMonth = month === 11 ? 0 : month + 1;

  const newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
  if (newMonthDayCount < date) {
    src.setDate(newMonthDayCount);
  }

  src.setMonth(newMonth);
  src.setFullYear(newYear);

  return new Date(src.getTime());
};

export const initTimeDate = function () {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};

export const setTime = (value, type = ':') => {
  if (typeof value === 'string') {
    const date = new Date()
    const dateTime = value.split(type)
    // 设置时间
    date.setHours(dateTime[0])
    date.setMinutes(dateTime[1])
    if (dateTime.length >= 3) {
      date.setSeconds(dateTime[2])
    } else {
      date.setSeconds(0)
    }
    date.setUTCMilliseconds(0)
    return date
  }
  return value
};

export const getDateRange = (value = initTimeDate(), format) => {
  let src = value
  if (typeof value === 'string') {
    src = new Date(value)
  }
  const day = src.getDay()
  const date = src.getDate()
  return [formatDate(src.setDate(date - day), format), formatDate(src.setDate(date + (6 - day)), format)]
};

export const prevWeek = (value = initTimeDate(), format) => {
  let src = value
  if (typeof value === 'string') {
    src = new Date(value)
  }
  src.setDate(src.getDate() - 7)
  return getDateRange(src, format)
};

export const nextWeek = (value = initTimeDate(), format) => {
  let src = value
  if (typeof value === 'string') {
    src = new Date(value)
  }
  src.setDate(src.getDate() + 7)
  return getDateRange(src, format)
};
