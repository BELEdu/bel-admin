export { default as Login } from './Login'
export { default as Main } from './Main'
export { default as Home } from './Home'
export { default as Curriculum } from './Curriculum'
export { default as Feedback } from './Feedback'
export { default as AccessError } from './AccessError'

// 题库中心
export { default as QuestionKnowledge } from './Question/Knowledge'
export { default as QuestionKnowledgeEdition } from './Question/Knowledge/Edition'
export { default as QuestionChapter } from './Question/Chapter'
export { default as QuestionQuestion } from './Question/Question'
export { default as QuestionQuestionEdit } from './Question/Question/Edit'
export { default as QuestionPaper } from './Question/Paper'
export { default as QuestionPaperDetail } from './Question/Paper/Detail'
export { default as QuestionPaperComposition } from './Question/Paper/Composition'
export { default as QuestionPaperCreation } from './Question/Paper/Creation'

// 算法中心
export { default as AlgorithmKnowledge } from './Algorithm/Knowledge/'
export { default as AlgorithmKnowledgeShow } from './Algorithm/Knowledge/Show'
export { default as AlgorithmKnowledgeDetail } from './Algorithm/Knowledge/Detail'

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
export { default as Promotion } from './Business/Promotion'

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

// 学员课程 - 学员管理
export { default as StudentStudent } from './Student/Student'
export { default as StudentStudentEdit } from './Student/Student/Edit'
export { default as StudentStudentReview } from './Student/Student/Review'
export { default as StudentStudentReviewProduct } from './Student/Student/Review/Product'
// 旧版
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
// 学员课程 - 班级管理
export { default as StudentClasses } from './Student/Classes'
export { default as StudentClassesEdit } from './Student/Classes/Edit'
// 学员课程 - 学习计划
export { default as StudentPlan } from './Student/Plan'
// 学员课程 - 教师课表
export { default as StudentSchedule } from './Student/Schedule/'
export { default as StudentScheduleManage } from './Student/Schedule/Manage'
export { default as StudentScheduleManageWeekly } from './Student/Schedule/ManageWeekly'
export { default as StudentScheduleManageDaily } from './Student/Schedule/ManageDaily'
export { default as StudentMyScheduleManage } from './Student/Schedule/Manage'
export { default as StudentMyScheduleManageWeekly } from './Student/Schedule/ManageWeekly'
export { default as StudentMyScheduleManageDaily } from './Student/Schedule/ManageDaily'

/* 测试管理 */

// 智能测试
export { default as ExaminationSmartExam } from './examination/SmartExam'
export { default as ExaminationSmartExamDetail } from './examination/SmartExam/Detail'
export { default as ExaminationSmartExamDetailCheck } from './examination/SmartExam/Detail/Check'

// abolish 智能分析
export { default as SmartAnalyse } from './examination/SmartAnalyse'
export { default as StudentAnalyse } from './examination/SmartAnalyse/StudentAnalyse'

// 错题管理
export { default as ExaminationWrongQuestion } from './examination/WrongQuestion'
export { default as ExaminationWrongQuestionDetail } from './examination/WrongQuestion/Detail'

/* 备课管理 */

// 教案管理
export { default as PreparePrepareplan } from './Prepare/Prepareplan'
export { default as PreparePrepareplanDetail } from './Prepare/Prepareplan/Detail'

// 试卷中心
export { default as PreparePaper } from './Prepare/Paper'
export { default as PreparePaperSmartpaper } from './Prepare/Paper/Smartpaper'

// abolish 智能组卷
export { default as Smartquestion } from './Prepare/Smartquestion'

// 试题中心
export { default as PrepareQuestion } from './Prepare/Question'
export { default as PreparePaperPreview } from './Prepare/Question/PaperPreview'

// 404页面
export { default as NotFound } from './NotFound'
