<template>
  <div>
    <app-editor-title></app-editor-title>
    <Form :label-width="130" :model="form" :rules="rules" ref="form" class="app-form-entire">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="会议时间" prop="meeting_date">
        <app-date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择会议的时间" v-model="form.meeting_date"></app-date-picker>
      </Form-item>
      <Form-item label="参会家长">
        <Input placeholder="请输入家长姓名，多人以 “，” 分隔" v-model="form.parent_name"></Input>
      </Form-item>
      <Form-item label="参会员工">
        <Select placeholder="请选择..." v-model="form.meeting_persons" multiple filterable>
          <Option v-for="item in meeting_persons_data" :value="item.id" :key="item.id">{{ item.username }}</Option>
        </Select>
      </Form-item>
      <Form-item label="会议类型" prop="meeting_type">
        <Select placeholder="请选择..." v-model="form.meeting_type">
          <Option v-for="type in meetingTypes" :key="type.value" :value="type.value">{{ type.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item label="家长满意度">
        <Radio-group v-model="form.satisfaction">
          <Radio v-for="item in satisfaction" :label="item.value" :key="item.value">{{ item.display_name }}</Radio>
        </Radio-group>
      </Form-item>

      <Form-item v-if="form.meeting_type === 1" :label="form.meeting_content[0].content_tag" :prop="`meeting_content[0].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[0].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="学员基本信息及学科水平介绍（咨询师）"></Input>
      </Form-item>

      <Form-item v-if="form.meeting_type === 2 || form.meeting_type === 3" :label="form.meeting_content[3].content_tag" :prop="`meeting_content[3].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[3].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="近期学员学情小结（进步、不足）"></Input>
      </Form-item>

      <Form-item v-if="form.meeting_type === 1 || form.meeting_type === 2" :label="form.meeting_content[1].content_tag" :prop="`meeting_content[1].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[1].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="沟通交流（学管师）"></Input>
      </Form-item>

      <Form-item v-if="form.meeting_type === 1" :label="form.meeting_content[2].content_tag" :prop="`meeting_content[2].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[2].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="第一次备课上课的注意事项及建议"></Input>
      </Form-item>

      <Form-item v-if="form.meeting_type === 2" :label="form.meeting_content[4].content_tag" :prop="`meeting_content[4].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[4].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="本次会议解决的主要问题"></Input>
      </Form-item>

      <Form-item v-if="form.meeting_type === 3" :label="form.meeting_content[5].content_tag" :prop="`meeting_content[5].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[5].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="需要提升的地方"></Input>
      </Form-item>

      <Form-item v-if="form.meeting_type === 3" :label="form.meeting_content[6].content_tag" :prop="`meeting_content[6].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[6].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="家长意见与要求"></Input>
      </Form-item>

      <Form-item v-if="form.meeting_type === 3" :label="form.meeting_content[7].content_tag" :prop="`meeting_content[7].content`" :rules="[$rules.max(500)]">
        <Input type="textarea" v-model="form.meeting_content[7].content" :autosize="{minRows: 4,maxRows: 8}" placeholder="本次会议结果"></Input>
      </Form-item>

      <Form-item label="文件大小建议">
        <span class="upload-text">上传文件应不大于10M，格式要求为 jpg、jpeg、bmp、png、zip、doc、pdf、rar、docx、xls、xlsx、txt</span>
      </Form-item>

      <!-- 上传附件组件 -->
      <Form-item>
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
            content: '',
            content_tag: '学科水平',

          },
          {
            content: '',
            content_tag: '沟通交流情况',
          },
          {
            content: '',
            content_tag: '备课建议',
          },
          {
            content: '',
            content_tag: '近期学情',
          },
          {
            content: '',
            content_tag: '解决的问题',
          },
          {
            content: '',
            content_tag: '需要提升的地方',
          },
          {
            content: '',
            content_tag: '家长意见与要求',
          },
          {
            content: '',
            content_tag: '本次会议结果',
          },
        ],
        meeting_persons: [],
        meeting_attachment: [],
        satisfaction: null,

        datetimetest: '',
        daterangetest: [],
      },

      meeting_persons_data: [],

      rules: {
        meeting_date: [
          this.$rules.date('会议时间不能为空'),
        ],
        meeting_type: [
          this.$rules.required('会议类型', 'number', 'change'),
        ],
      },

    }
  },

  computed: {
    ...mapState({
      meetingTypes: state => state.dicts.meeting_type, // 交流会类型
      satisfaction: state => state.dicts.satisfaction, // 满意度类型
    }),

    // type() {
    //   sdfsaadsadf
    // },

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
    files() { // 转换文件格式
      return this.form.meeting_attachment
        .map(({ name, url }) => ({
          name,
          url,
        }))
    },
  },

  methods: {
    getClassData() { // 获取交流会详情（编辑）
      return this.$http.get(`/meeting/${this.meetingId}`)
        .then((res) => {
          this.form = res
        })
    },

    getMettingPersonData() { // 获取与会人员数据
      this.$http.get('/teacher_list')
        .then((res) => {
          this.meeting_persons_data = res
        })
    },

    uploadSuccess(res) { // 图片上传成功回调函数
      this.form = {
        ...this.form,
        meeting_attachment: [
          ...this.form.meeting_attachment,
          res,
        ],
      }
    },

    uploadError() { // 图片上传失败回调函数
      // 这里可以的话，应该进一步细腻化，按实际的错误显示错误消息
      this.$Message.error('上传失败,请注意附件大小和格式')
    },

    uploadRemove(targetFile) { // 从已上传的图片列表中删除一张图片
      this.form = {
        ...this.form,
        meeting_attachment: this.form.meeting_attachment
          .filter(file => file.url !== targetFile.url),
      }
    },

    submit() { // 提交表单
      const data = {
        ...this.form,
        student_id: this.studentId,
      }

      if (this.isUpdate) { // 编辑
        this.$http.patch(`/meeting/${this.meetingId}`, data)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }

      if (this.isUpdate === false) { // 新增
        this.$http.post('/meeting', data)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },
  },

  created() {
    this.getMettingPersonData() // 获取与会人员数据

    if (this.isUpdate) { // 获取交流会详情数据
      this.getClassData().then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    } else {
      this.$store.commit(GLOBAL.LOADING.HIDE)
    }

    this.$route.meta.breadcrumb[2].link = `/student/student/${this.studentId}/meeting`// 面包屑重定位
  },

}
</script>

<style lang="less">
@import '~vars';
.upload-text {
  color: @subsidiary-color;
  font-size: 14px;
}
</style>
