export default {
  hotline: {
    visited_at: '',
    elder_name: '',
    student_name: '',
    mobile: '',
    province_id: 0,
    city_id: 0,
    district_id: 0,
    grade: 0,
    invited_teacher_id: '',
    market_staff_name: '',
    school_name: '',
    return_visited_at: '',
  },
  communication: {
    // required|min:2|max:10
    student_name: '',
    // required|digits:11
    mobile: '',
    // 字典： gender
    gender: undefined,
    // min:2|max:20
    school_name: '',
    // min:2|max:10
    rank: '',
    // 字典： grade
    grade: 1,
    // 是否偏科， 字典： is
    is_tend_subject: undefined,
    // 回访时间 ： date_format:Y-m-d
    return_visited_at: '',
    // 字典： communication_type
    communication_type: undefined,
    // 沟通时间： date_format:Y-m-d
    communication_at: '',
    // 沟通情况： min:2|max:400
    content: '',
  },
}
