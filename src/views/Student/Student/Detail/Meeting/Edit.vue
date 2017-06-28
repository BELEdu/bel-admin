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
        <Select placeholder="请选择..." v-model="form.meeting_persons" multiple filterable>
          <Option v-for="item in meeting_persons_data" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="会议类型" prop="meeting_type">
        <Select placeholder="请选择..." v-model="form.meeting_type" >
          <Option v-for="type in meetingTypes" :key="type.value" :value="type.value">{{ type.display_name }}</Option>
        </Select>
      </Form-item>

      <div v-if="form.meeting_type === 1">
        <Form-item label="学科水平" >
          <Input type="textarea" v-model="form.meeting_content[0].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="学员基本信息及学科水平介绍（咨询师）"></Input>
        </Form-item>
        <Form-item label="沟通交流情况" >
          <Input type="textarea" v-model="form.meeting_content[1].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="沟通交流（学管师）"></Input>
        </Form-item>
        <Form-item label="备课建议" >
          <Input type="textarea" v-model="form.meeting_content[2].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="第一次备课、上课的注意事项及建议"></Input>
        </Form-item>
      </div>

      <div v-if="form.meeting_type === 3">
        <Form-item label="近期学情" >
          <Input type="textarea" v-model="form.meeting_content[3].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="近期学情反馈"></Input>
        </Form-item>
        <Form-item label="需要提升的地方" >
          <Input type="textarea" v-model="form.meeting_content[4].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="需要提升的地方"></Input>
        </Form-item>
        <Form-item label="家长意见与要求" >
          <Input type="textarea" v-model="form.meeting_content[5].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="家长意见与要求"></Input>
        </Form-item>
        <Form-item label="本次会议结果" >
          <Input type="textarea" v-model="form.meeting_content[6].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="本次会议结果"></Input>
        </Form-item>
      </div>

      <Form-item  >
        <app-uploader
          action="/meeting/upload"
          name="meeting_file"
          @on-success="uploadSuccess"
          @on-error="uploadError"
          @on-remove="uploadRemove"
          :files="files"
        ></app-uploader>
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
        meeting_type: null,
        parent_name: '',
        meeting_content: [
          {
            content_tag: '学科水平',
            content: '',
          },
          {
            content_tag: '沟通交流情况',
            content: '',
          },
          {
            content_tag: '备课建议',
            content: '',
          },
          {
            content_tag: '近期学情',
            content: '',
          },
          {
            content_tag: '需要提升的地方',
            content: '',
          },
          {
            content_tag: '家长意见与要求',
            content: '',
          },
          {
            content_tag: '本次会议结果',
            content: '',
          },
        ],
        meeting_persons: [],
        meeting_attachment: [],
      },

      meeting_persons_data: [],

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
    files() {
      return this.form.meeting_attachment
        .map(({ name, url }) => ({
          name,
          url,
        }))
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
          const {
            meeting_persons_data,
            ...form
          } = res

          this.form = {
            ...form,
            meeting_date: new Date(res.meeting_date),
          }
          this.meeting_persons_data = meeting_persons_data
        })
    },

    // 图片上传成功
    uploadSuccess(res) {
      this.form = {
        ...this.form,
        meeting_attachment: [
          ...this.form.meeting_attachment,
          res,
        ],
      }
    },

    // 图片上传失败
    uploadError() {
      // 这里可以的话，应该进一步细腻化，按实际的错误显示错误消息
      this.$Message.error('图片上传失败')
    },

    // 从已上传的图片列表中删除一张图片
    uploadRemove(targetFile) {
      this.form = {
        ...this.form,
        meeting_attachment: this.form.meeting_attachment
          .filter(file => file.url !== targetFile.url),
      }
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
