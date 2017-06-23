export { default as Login } from './Login'
export { default as Main } from './Main'
export { default as Home } from './Home'
export { default as Curriculum } from './Curriculum'
export { default as Prepare } from './Prepare'
export { default as Feedback } from './Feedback'
export { default as AccessError } from './AccessError'

// 业务管理
export { default as Hotline } from './Business/Hotline'
export { default as HotlineEdit } from './Business/Hotline/HotlineEdit'
export { default as Communication } from './Business/Communication'
export { default as CommunicationEdit } from './Business/Communication/CommunicationEdit'
export { default as Contract } from './Business/Contract'
export { default as ContractEdit } from './Business/Contract/ContractEdit'
export { default as ContractAudit } from './Business/Contract/ContractAudit'
export { default as Product } from './Business/Product'
export { default as ProductEdit } from './Business/Product/ProductEdit'

// 排课管理
export { default as CurriculumTeacher } from './Curriculum/Teacher'
export { default as CurriculumTeacherEdit } from './Curriculum/Teacher/Edit'
export { default as CurriculumStudentCurricula } from './Curriculum/Student'
export { default as CurriculumStudentEdit } from './Curriculum/Student/CourseManage/Student'
export { default as CurriculumStudentClbumEdit } from './Curriculum/Student/CourseManage/Clbum'
export { default as CurriculumRecord } from './Curriculum/Record'
export { default as CurriculumRecordShow } from './Curriculum/Record/ClassManage/Student'
export { default as CurriculumRecordClassShow } from './Curriculum/Record/ClassManage/Class'
export { default as CurriculumTimeTable } from './Curriculum/TimeTable/'

// 统计管理
export { default as Analysis } from './Analysis'
export { default as AnalysisData } from './Analysis/Data'
export { default as AnalysisLesson } from './Analysis/Lesson'
export { default as AnalysisRank } from './Analysis/Rank'

// 系统管理
export { default as SystemRole } from './System/Role'
export { default as SystemRoleEdit } from './System/Role/Edit'
export { default as SystemUser } from './System/User'
export { default as SystemUserEdit } from './System/User/Edit'
export { default as SystemLog } from './System/Log'
export { default as SystemDepartment } from './System/Department'

// 学员管理
export { default as Student } from './Student'
export { default as StudentStudent } from './Student/Student'
export { default as StudentStudentEdit } from './Student/Student/Edit'
export { default as StudentStudentDetail } from './Student/Student/Detail'
export { default as StudentStudentDetailEdit } from './Student/Student/Detail/Edit'
export { default as StudentStudentDetailMeeting } from './Student/Student/Detail/Meeting'
export { default as StudentStudentDetailMeetingEdit } from './Student/Student/Detail/Meeting/Edit'
export { default as StudentStudentDetailWarning } from './Student/Student/Detail/Warning'
export { default as StudentStudyprogress } from './Student/Studyprogress'
export { default as StudentKnowledgepoint } from './Student/Knowledgepoint'
export { default as StudentClasses } from './Student/Classes'
export { default as StudentClassesEdit } from './Student/Classes/Edit'

// 测试管理
export { default as SmartExam } from './examination/SmartExam'
export { default as StudentExam } from './examination/SmartExam/StudentExam'
export { default as SmartAnalyse } from './examination/SmartAnalyse'
export { default as StudentAnalyse } from './examination/SmartAnalyse/StudentAnalyse'
export { default as WrongQuestion } from './examination/WrongQuestion'
