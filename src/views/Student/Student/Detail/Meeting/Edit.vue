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

      <Form-item label="会议时间" prop="meeting_date">
        <Date-picker type="date" placeholder="请选择会议的时间" v-model="form.meeting_date"></Date-picker>
      </Form-item>
      <Form-item label="参会家长" prop="parent_name">
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

      <!--课前交流会文本框组-->
      <Form-item
        v-if="form.meeting_type === 1"
        v-for="(item, index) in form.meeting_content.slice(0,3)"
        :key="index"
        :label="item.content_tag"
        :prop="`meeting_content.${index}.content`"
        :rules="[$rules.max(500)]"
      >
        <Input type="textarea" v-model="item.content" :autosize="{minRows: 4,maxRows: 8}" :placeholder="`请填写${item.content_tag}（最多500个字符）`"></Input>
      </Form-item>

      <!--家长座谈会文本框组-->
      <Form-item
        v-if="form.meeting_type === 3"
        v-for="(item, index) in form.meeting_content.slice(3,7)"
        :key="index"
        :label="item.content_tag"
        :prop="`meeting_content.${index+3}.content`"
        :rules="[$rules.max(500)]"
      >
        <Input type="textarea" v-model="item.content" :autosize="{minRows: 4,maxRows: 8}" :placeholder="`请填写${item.content_tag}（最多500个字符）`"></Input>
      </Form-item>

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
        <Button type="primary" @click="beforeSubmit()" :loading="formLoading">
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
import { form, goBack } from '@/mixins'
import format from 'date-fns/format'

export default {
  name: 'app-student-student-detail-meeting-edit',

  mixins: [form, goBack],

  data() {
    return {
      form: {
        id: '',
        student_id: '',
        meeting_date: null,
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
          this.$rules.required('会议时间', 'date'),
        ],
        meeting_type: [
          this.$rules.required('会议类型', 'number'),
        ],
        parent_name: [
          this.$rules.name,
        ],
      },
    }
  },

  computed: {
    ...mapState({
      meetingTypes: state => state.dicts.meeting_type, // 交流会类型
    }),
    studentId() { // 学员id
      return this.$router.currentRoute.params.studentId
    },
    meetingId() { // 交流会id
      return this.$router.currentRoute.params.meetingId
    },
    backRoute() { // 返回上一层路由自定义
      return `/student/student/${this.studentId}/meeting`
    },
    isUpdate() { // 判断是修改还是新增
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
    // 获取交流会数据源（添加）
    getListData() {
      return this.$http.get('/meeting/create')
        .then((res) => {
          this.meeting_persons_data = res.meeting_persons_data
        })
    },

    // 获取交流会详情（编辑）
    getClassData() {
      return this.$http.get(`/meeting/${this.meetingId}`)
        .then((res) => {
          const {
            meeting_persons_data,
            ...others
          } = res

          this.form = {
            ...others,
            meeting_date: res.meeting_date ? new Date(res.meeting_date) : null,
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
      this.$Message.error('上传失败,请注意附件大小和格式')
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
      const data = {
        ...this.form,
        meeting_date: this.form.meeting_date ? format(this.form.meeting_date, 'YYYY-MM-DD') : null,
        student_id: this.studentId,
      }
      // 提交修改
      if (this.isUpdate) {
        this.$http.patch(`/meeting/${this.meetingId}`, data)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
      // 提交添加
      if (this.isUpdate === false) {
        this.$http.post('/meeting', data)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },
  },

  created() {
     // 判断是编辑还是添加，以此调用不同的接口
    (this.isUpdate ? this.getClassData : this.getListData)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))

    this.$route.meta.breadcrumb[2].link = `/student/student/${this.studentId}/meeting`
  },

}
</script>

<style <style lang="less">

</style>
