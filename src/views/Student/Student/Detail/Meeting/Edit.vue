<template>
  <div>
    <app-editor-title></app-editor-title>
    <Form
     :label-width="130"
     :model="form"
     :rules="rules"
     ref="form"
     class="app-form-entire"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>

      {{form.meeting_date}}

      <Form-item label="会议时间" prop="meeting_date">
        <Date-picker type="date" placeholder="请选择会议的时间" v-model="form.meeting_date"></Date-picker>
      </Form-item>
      <Form-item label="参会家长">
        <Input placeholder="请输入家长姓名，多人以 “，” 分隔" v-model="form.parent_name"></Input>
      </Form-item>
      <Form-item label="参会员工">
        <Select placeholder="请选择..." v-model="form.meeting_person" multiple filterable>
          <Option value="1">张三</Option>
          <Option value="2">李四</Option>
          <Option value="3">王五</Option>
        </Select>
      </Form-item>
      <Form-item label="会议类型" prop="meeting_type">
        <Select placeholder="请选择..." v-model="form.meeting_type" >
          <Option v-for="type in meetingTypes" :key="type.value" :value="type.value">{{ type.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="学科水平" >
        <Input type="textarea" v-model="form.content_one" :autosize="{minRows: 4,maxRows: 8}" placeholder="学员基本信息及学科水平介绍（咨询师）"></Input>
      </Form-item>
      <Form-item label="沟通交流情况" >
        <Input type="textarea" v-model="form.content_two" :autosize="{minRows: 4,maxRows: 8}" placeholder="沟通交流（学管师）"></Input>
      </Form-item>
      <Form-item label="备课建议" >
        <Input type="textarea" v-model="form.content_three" :autosize="{minRows: 4,maxRows: 8}" placeholder="第一次备课、上课的注意事项及建议"></Input>
      </Form-item>
      <Form-item  >
        <Upload
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </Form-item>
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="primary" @click="submit()" >
          提交
        </Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 交流会 - 编辑
 * @author zml
 * @version 2017-06-14
 */
import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
import format from 'date-fns/format'

export default {
  name: 'app-student-student-detail-meeting-edit',

  data() {
    return {
      form: {
        id: '',
        student_id: '',
        meeting_date: '',
        meeting_type: '',
        parent_name: '',
        content_one: '',
        content_two: '',
        content_three: '',
        content_four: '',
        meeting_person: [],
        meeting_attachment: [],
      },

      rules: {
        meeting_date: [
          // this.$rules.required('会议时间', 'date'),
          { required: true, type: 'date', message: '会议时间必填', trigger: 'change' },
        ],
        meeting_type: [
          { required: true, type: 'number', message: '会议类型必填', trigger: 'change' },
        ],
      },

      formErrors: {}, // 表单提交错误信息
    }
  },

  computed: {
    ...mapState({
      // 获取数据字典
      meetingTypes: state => state.dicts.meeting_type, // 交流会类型
    }),
    // 学员id
    studentId() {
      return this.$router.currentRoute.params.studentId
    },
    // 交流会id
    meetingId() {
      return this.$router.currentRoute.params.meetingId
    },
    // 判断是修改还是新增
    isUpdate() {
      return !!this.$router.currentRoute.params.meetingId
    },
  },

  methods: {
    // 获取各个下拉菜单的数据
    getListData() {
      return this.$http.get('/meeting/create')
        .then((res) => {
          window.console.log(res)
        })
    },

    // 获取当前编辑交流会的数据
    getClassData() {
      return this.$http.get(`/meeting/${this.meetingId}`)
        .then((res) => {
          this.form = {
            ...res,
            meeting_date: new Date(res.meeting_date),
          }
        })
    },

     // 提交表单
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            meeting_date: this.form.meeting_date ? format(this.form.meeting_date, 'YYYY-MM-DD') : '',
            student_id: this.studentId,
          }
          // 提交时如果是修改操作
          if (this.isUpdate) {
            this.$http.patch(`/meeting/${this.meetingId}`, data)
              .then(this.successHandler)
              .catch(this.errorHandler)
          }
          // 提交时如果是添加操作
          if (this.isUpdate === false) {
            this.$http.post('/meeting', data)
              .then(this.successHandler)
              .catch(this.errorHandler)
          }
        }
      })
    },

    successHandler() {
      this.goBack()
    },

    errorHandler({ errors }) {
      if (errors) {
        this.formErrors = errors
      } else {
        this.formErrors = { error: ['服务端错误，请稍后重试'] }
      }
      this.$emit('scrollToTop')
    },

    goBack() {
      this.$router.go(-1)
    },
  },

  created() {
     // 判断是编辑还是新建，以此调用不同的接口
    if (this.isUpdate) {
      this.getClassData().then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    }
    this.$store.commit(GLOBAL.LOADING.HIDE)

    // (this.isUpdate ? this.getClassData : this.getListData)()
    //   .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

}
</script>

<style <style lang="less">

</style>
