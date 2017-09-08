export { default as Login } from './Login'
export { default as Main } from './Main'
export { default as Home } from './Home'
export { default as Curriculum } from './Curriculum'
export { default as Feedback } from './Feedback'
export { default as AccessError } from './AccessError'

// 题库中心
export { default as QuestionKnowledge } from './Question/Knowledge'
export { default as QuestionChapter } from './Question/Chapter'
export { default as QuestionQuestion } from './Question/Question'
export { default as QuestionPaper } from './Question/Paper'

// 算法中心
export { default as AlgorithmKnowledge } from './Algorithm/Knowledge/'

// 业务管理
export { default as Hotline } from './Business/Hotline'
export { default as HotlineEdit } from './Business/Hotline/HotlineEdit'
export { default as Communication } from './Business/Communication'
export { default as CommunicationEdit } from './Business/Communication/CommunicationEdit'
export { default as Contract } from './Business/Contract'
export { default as ContractEdit } from './Business/Contract/ContractEdit'
export { default as ContractAudit } from './Business/Contract/ContractAudit'
export { default as ContractRefund } from './Business/Contract/ContractRefund'
export { default as Product } from './Business/Product'
export { default as ProductEdit } from './Business/Product/ProductEdit'

// 排课管理
export { default as CurriculumTeacher } from './Curriculum/Teacher/'
export { default as CurriculumTeacherCourse } from './Curriculum/TabManage/'
export { default as CurriculumTeacherCourseDate } from './Curriculum/Teacher/CourseManage/Date'
export { default as CurriculumTeacherCourseWeek } from './Curriculum/Teacher/CourseManage/Week'
export { default as CurriculumStudentCurricula } from './Curriculum/TabManage/'
export { default as CurriculumStudentList } from './Curriculum/Student/List/Student'
export { default as CurriculumStudentClassList } from './Curriculum/Student/List/Class'
export { default as CurriculumStudentCoachList } from './Curriculum/Student/List/Coach'
export { default as CurriculumStudentCourse } from './Curriculum/TabManage/'
export { default as CurriculumStudentCourseDate } from './Curriculum/Student/CourseManage/StudentDate'
export { default as CurriculumStudentCourseWeek } from './Curriculum/Student/CourseManage/StudentWeek'
export { default as CurriculumClassCourseDate } from './Curriculum/Student/CourseManage/ClassDate'
export { default as CurriculumClassCourseWeek } from './Curriculum/Student/CourseManage/ClassWeek'
export { default as CurriculumCoachCourseDate } from './Curriculum/Student/CourseManage/CoachDate'
export { default as CurriculumCoachCourseWeek } from './Curriculum/Student/CourseManage/CoachWeek'
export { default as CurriculumRecord } from './Curriculum/TabManage/'
export { default as CurriculumRecordStudent } from './Curriculum/Record/List/Student'
export { default as CurriculumRecordClass } from './Curriculum/Record/List/Class'
export { default as CurriculumRecordClassList } from './Curriculum/Record/List/ClassList'
export { default as CurriculumRecordCoach } from './Curriculum/Record/List/Coach'
export { default as CurriculumRecordShow } from './Curriculum/Record/ClassManage/Student'
export { default as CurriculumRecordClassShow } from './Curriculum/Record/ClassManage/Class'
export { default as CurriculumRecordCoachShow } from './Curriculum/Record/ClassManage/Coach'

// 统计管理
export { default as AnalysisSign } from './Analysis/Sign'
export { default as AnalysisCurricula } from './Analysis/Curricula'
export { default as AnalysisRank } from './Analysis/Rank'

// 系统管理
export { default as SystemRole } from './System/Role'
export { default as SystemRoleEdit } from './System/Role/Edit'
export { default as SystemUser } from './System/User'
export { default as SystemUserEdit } from './System/User/Edit'
export { default as SystemUserRole } from './System/User/Role'
export { default as SystemLog } from './System/Log'
export { default as SystemDepartment } from './System/Department'
export { default as SystemProcess } from './System/Process'
export { default as SystemProcessEdit } from './System/Process/Edit'

// 学员管理
export { default as StudentStudent } from './Student/Student'
export { default as StudentStudentDetail } from './Student/Student/Detail'
export { default as StudentStudentDetailEdit } from './Student/Student/Detail/Edit'
export { default as StudentStudentDetailMeeting } from './Student/Student/Detail/Meeting'
export { default as StudentStudentDetailMeetingEdit } from './Student/Student/Detail/Meeting/Edit'
export { default as StudentStudentDetailWarning } from './Student/Student/Detail/Warning'

export { default as StudentStudyprogress } from './Student/Studyprogress'
export { default as StudentStudyprogressStudent } from './Student/Studyprogress/Student'
export { default as StudentStudyprogressClasses } from './Student/Studyprogress/Classes'
export { default as StudentStudyprogressAdd } from './Student/Studyprogress/Add'
export { default as StudentStudyprogressDetail } from './Student/Studyprogress/Detail'
export { default as StudentStudyprogressDetailProgress } from './Student/Studyprogress/Detail/Progress'
export { default as StudentStudyprogressDetailPlan } from './Student/Studyprogress/Detail/Plan'
export { default as StudentStudyprogressDetailHistory } from './Student/Studyprogress/Detail/History'

export { default as StudentKnowledgepoint } from './Student/Knowledgepoint'
export { default as StudentKnowledgepointDetail } from './Student/Knowledgepoint/Detail'

export { default as StudentClasses } from './Student/Classes'
export { default as StudentClassesEdit } from './Student/Classes/Edit'

// 测试管理
export { default as SmartExam } from './examination/SmartExam'
export { default as StudentExam } from './examination/SmartExam/StudentExam'
export { default as ExamCollation } from './examination/SmartExam/ExamCollation'
export { default as SmartAnalyse } from './examination/SmartAnalyse'
export { default as StudentAnalyse } from './examination/SmartAnalyse/StudentAnalyse'
export { default as WrongQuestion } from './examination/WrongQuestion'
export { default as StudentWrong } from './examination/WrongQuestion/StudentWrong'

// 备课管理
export { default as Prepareplan } from './Prepare/Prepareplan'
export { default as StuPreList } from './Prepare/Prepareplan/StuPreList'
export { default as StuPlanList } from './Prepare/Prepareplan/StuPlanList'
export { default as PlanEdit } from './Prepare/Prepareplan/PlanEdit'
export { default as Papercenter } from './Prepare/Papercenter'
export { default as Smartpaper } from './Prepare/Papercenter/Smartpaper'
export { default as Smartquestion } from './Prepare/Smartquestion'
export { default as Question } from './Prepare/Question'
export { default as PaperPreview } from './Prepare/Question/PaperPreview'
export { default as QuestionAnalysis } from './Prepare/Question/QuestionAnalysis'

// 404页面
export { default as NotFound } from './NotFound'
