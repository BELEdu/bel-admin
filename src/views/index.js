export { default as Login } from './Login'
export { default as Main } from './Main'
export { default as Home } from './Home'
export { default as Feedback } from './Feedback'
export { default as AccessError } from './AccessError'

/* 题库中心 */

// 知识点
export { default as QuestionKnowledge } from './Question/Knowledge'
export { default as QuestionKnowledgeEdition } from './Question/Knowledge/Edition'

// 章节
export { default as QuestionChapter } from './Question/Chapter'

// 试题
export { default as QuestionQuestion } from './Question/Question'
export { default as QuestionQuestionEdit } from './Question/Question/Edit'

// 试卷
export { default as QuestionPaper } from './Question/Paper'
export { default as QuestionPaperDetail } from './Question/Paper/Detail'
export { default as QuestionPaperReport } from './Question/Paper/Report'


/* 算法中心 */

// 学员知识点
export { default as AlgorithmKnowledge } from './Algorithm/Knowledge/'
export { default as AlgorithmKnowledgeShow } from './Algorithm/Knowledge/Show'
export { default as AlgorithmKnowledgeDetail } from './Algorithm/Knowledge/Detail'


/* 业务管理 */

// 热线管理
export { default as Hotline } from './Business/Hotline'
export { default as HotlineEdit } from './Business/Hotline/HotlineEdit'

// 沟通记录
export { default as Communication } from './Business/Communication'
export { default as CommunicationEdit } from './Business/Communication/CommunicationEdit'

// 合同审批
export { default as Contract } from './Business/Contract'
export { default as ContractEdit } from './Business/Contract/ContractEdit'
export { default as ContractAudit } from './Business/Contract/ContractAudit'
export { default as ContractRefund } from './Business/Contract/ContractRefund'

// 产品管理
export { default as Product } from './Business/Product'
export { default as ProductEdit } from './Business/Product/ProductEdit'

// 优惠活动
export { default as Promotion } from './Business/Promotion'

/* 统计管理 */

// 签约统计
export { default as AnalysisSign } from './Analysis/Sign'

// 课时统计
export { default as AnalysisCurricula } from './Analysis/Curricula'

// 排名情况
export { default as AnalysisRank } from './Analysis/Rank'


/* 系统管理 */

// 角色管理
export { default as SystemRole } from './System/Role'
export { default as SystemRoleEdit } from './System/Role/Edit'

// 用户管理
export { default as SystemUser } from './System/User'
export { default as SystemUserEdit } from './System/User/Edit'
export { default as SystemUserRole } from './System/User/Role'

// 日志管理
export { default as SystemLog } from './System/Log'

// 部门管理
export { default as SystemDepartment } from './System/Department'

// 流程管理
export { default as SystemProcess } from './System/Process'
export { default as SystemProcessEdit } from './System/Process/Edit'


/* 学员课程 */

// 学员管理
export { default as StudentStudent } from './Student/Student'
export { default as StudentStudentEdit } from './Student/Student/Edit'
export { default as StudentStudentReview } from './Student/Student/Review'
export { default as StudentStudentReviewProduct } from './Student/Student/Review/Product'

// 班级管理
export { default as StudentClasses } from './Student/Classes'

// 学习计划
export { default as StudentPlan } from './Student/Plan'

// 教师课表
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
export { default as ExaminationSmartExamCheck } from './examination/SmartExam/Check'
export { default as ExaminationSmartExamPreview } from './examination/SmartExam/Preview'

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
export { default as PreparePrepareplanQuestion } from './Prepare/Prepareplan/Question'
export { default as PreparePrepareplanPreview } from './Prepare/Prepareplan/Preview'

// 试卷中心
export { default as PreparePaper } from './Prepare/Paper'
export { default as PreparePaperSmartpaper } from './Prepare/Paper/Smartpaper'

// abolish 智能组卷
export { default as Smartquestion } from './Prepare/Smartquestion'

// 试题中心
export { default as PrepareQuestion } from './Prepare/Question'
export { default as PreparePaperPreview } from './Prepare/Question/PaperPreview'


/* 业务配置 */

// 学校管理
export { default as SettingSchool } from './Setting/School'

// 教室管理
export { default as SettingClassroom } from './Setting/Classroom'

// 设备管理
export { default as SettingEquipment } from './Setting/Classroom/Equipment'


/* 404页面 */
export { default as NotFound } from './NotFound'
