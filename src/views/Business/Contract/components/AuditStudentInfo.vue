<template>
   <div
     class="audit-student-info"
   >
     <span>学员姓名：{{data.student_name}}</span>
     <span>学员编号：{{data.student_number}}</span>
     <span>签约校区：{{data.school_name}}</span>
     <Button type="primary" size="small">预览合同</Button>
     <Button type="primary" size="small">下载合同</Button>
   </div>
</template>

<script>
/**
 * 合同审批 - 审批信息 - 学生信息条
 *
 * @author huojinzhao
 */

export default {
  name: 'AuditStudentInfo',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less">
.audit-student-info {

  & > span {
    margin-right: 10px;
  }

  & button {
    float: right;
    margin-left: 10px;
  }
}
</style>
