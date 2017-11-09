<template>
  <main class="commeditor" v-if="preConfig">
    <app-editor-title></app-editor-title>
    <Form
      class="app-form-entire"
      :label-width="110"
      :rules="formRules"
      :model="fdata"
      ref="form"
     >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="学员姓名" prop="student_name">
        <Input
          placeholder="请输入学生姓名"
          v-model="fdata.student_name"
        ></Input>
      </Form-item>
      <Form-item label="学生手机号" prop="mobile">
        <Input
          placeholder="请输入手机号码"
          v-model="fdata.mobile"
        ></Input>
      </Form-item>
      <Form-item label="学员性别">
        <Radio-group v-model="fdata.gender">
          <Radio
            v-for="item in preConfig.gender"
            :key="item.value"
            :label="item.value"
          >
            <span>{{item.display_name}}</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="在读学校" prop="school_name">
        <Input
          placeholder="请输入学校名称"
          v-model="fdata.school_name"
        ></Input>
      </Form-item>
      <Form-item label="年段排名" prop="rank">
        <InputNumber
          placeholder="请输入年段排名"
          v-model="fdata.rank"
        ></InputNumber>
      </Form-item>
      <Form-item label="当前年级">
        <Select
          placeholder="请选择......"
          v-model="fdata.grade"
        >
          <Option
            v-for="item in preConfig.grade"
            :value="item.value"
            :key="item.display_name"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <Form-item label="偏科情况">
        <Input
          placeholder="请输入偏科成绩，如：数学89，多个科目以“,”分开，没有则写“无”"
          v-model="fdata.tend_subject_description"
        ></Input>
      </Form-item>
      <Form-item label="沟通类型">
        <Select
          placeholder="请选择......"
          v-model="fdata.communication_type"
        >
          <Option
            v-for="item in preConfig.communication_type"
            :value="item.value"
            :key="item.display_name"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
    </Form>
    <!-- log表单 -->
    <Form
      class="app-form-entire"
      :label-width="110"
      :rules="formRules"
      ref="comm_log"
      :model="comm_log"
    >
      <!-- log编辑 -->
      <Form-item
        label="沟通时间"
        prop="communication_at"
      >
        <Date-picker
          placeholder="年 / 月 / 日"
          :editable="false"
          :options="dateOptions"
          v-model="comm_log.communication_at"
        ></Date-picker>
      </Form-item>
      <Form-item
        label="沟通情况"
        prop="content"
      >
        <Input
          type="textarea"
          placeholder="请输入......"
          :rows="4"
          v-model="comm_log.content"
        ></Input>
      </Form-item>
      <!-- 添加log -->
      <Form-item class="commeditor--plus-container">
        <Button
          type="dashed"
          icon="plus"
          @click.stop="
            addLogClick = true;
            addLog('comm_log');
          "
        >增加沟通记录</Button>
      </Form-item>
      <!-- logs展示 -->
      <Row
        class="commeditor--contents"
        v-for="(item, index) in fdata.communication_logs" v-if="fdata.communication_logs.length"
        :key="item.communication_at"
      >
        <Col
          span="3"
          class="commeditor--contents-date"
        >
          {{item.communication_at}}
        </Col>
        <Col span="20">
          {{item.content}}
        </Col>
        <Col span="1" style="padding-left: 5px;">
          <!-- 删除log-->
          <Button
            class="commeditor--contents-delete"
            size="small"
            type="text"
            @click.stop="deleteLog(item.communication_id, item.id, index)"
          >
            删除
          </Button>
        </Col>
      </Row>
      <!-- logs展示 end -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button
          type="primary"
          :loading="loading"
          @click="handleSubmit('form')"
        >提交</Button>
      </Form-item>
    </Form>
    <!-- log表单 end -->
  </main>
</template>

<script>
/**
 * 沟通记录 - 记录编辑
 *
 * @author huojinzhao
 */

import { goBack, form } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
import { editInit, encode } from './modules/config'

export default {
  name: 'CommunicationEdit',

  mixins: [goBack, form],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: editInit(),

      // log 单独编辑表单数据
      comm_log: {
        communication_at: '',
        content: '',
      },

      // "提交"按钮状态控制
      loading: false,

      // "增加沟通记录"按钮验证标志
      addLogClick: false,

      // 字典数据
      communication_type: null,

      // 表单验证规则
      formRules: {
        student_name: [
          this.$rules.required('学生姓名'),
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        mobile: [
          this.$rules.required('手机号码'),
          this.$rules.mobile,
        ],
        school_name: [
          this.$rules.length(2, 20),
          this.$rules.name,
        ],
        rank: [
          {
            min: 1,
            type: 'number',
            message: '排名应为大于1的有效数字',
            trigger: 'change',
          },
        ],
        communication_at: [
          { validator: this.validateLogAt },
        ],
        content: [
          { validator: this.validateLogContent },
        ],
      },

      preConfig: null,

      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        },
      },
    }
  },

  methods: {
    /* --- initialization --- */

    getPreconfig() {
      this.$http.get('/communication/store_before')
        .then((res) => { this.preConfig = { ...res } })
    },

    fetchUpdationInfo(id) {
      if (!id) return Promise.resolve()

      return this.$http.get(`/communication/${id}`)
        .then((res) => { this.fdata = res })
        .catch(() => {})
    },

    /* --- assistance --- */

    // 表单项validator
    validateLogAt(rule, value, callback) {
      // 点击"新增沟通记录"按钮情况下，有空字段验证
      if (this.addLogClick && value === '') {
        callback('请选择日期')
      // 点击"提交"按钮情况下，有空字段验证
      } else if (this.comm_log.content.length > 0 && value === '') {
        callback('请选择日期')
      // 验证成功
      } else {
        callback()
      }
      this.addLogClick = false
    },

    validateLogContent(rule, value, callback) {
      const at = this.comm_log.communication_at
      // 点击"新增沟通记录"按钮情况下有空字段的验证
      if (this.addLogClick && value === '') {
        callback('请填写沟通内容')
      // 点击"提交"按钮情况下有空字段的验证
      } else if (typeof at === 'object' && value === '') {
        callback('请填写沟通内容')
      // 日志内容合法性认证
      } else if (value.length === 1 || value.length > 200) {
        callback('长度在2到200个文字之间')
      // 验证成功
      } else {
        callback()
      }
      // 重置点击"新增沟通记录"按钮的状态
      this.addLogClick = false
    },

    /* --- business --- */

    // 删除log项
    deleteLog(communication_id, id, index) {
      if (id && communication_id) {
        const uri = `/communication/${communication_id}/log/${id}`
        this.$http.delete(uri)
      }
      this.fdata.communication_logs.splice(index, 1)
    },

    // 新增log项
    addLog(name) {
      let result = false

      // log验证成功后
      this.$refs[name].validate((valid) => {
        if (valid) {
          const communication_at = this.comm_log
            .communication_at
            .toJSON().slice(0, 10)

          const comm_log = {
            communication_at,
            content: this.comm_log.content,
          }

          if (this.$route.params.id) {
            const uri = `/communication/${this.$route.params.id}/log`
            this.$http.post(uri, comm_log)
          }

          this.fdata.communication_logs.push(comm_log)
          this.$refs[name].resetFields()
        }

        result = valid
      })

      // 返回log验证结果
      return result
    },

    // 编辑提交表单数据
    submit() {
      this.loading = true

      const id = this.$route.params.id

      const fdata = this.fdata
      const method = id ? 'patch' : 'post'
      const uri = id ? `/communication/${id}` : '/communication'

      return this.$http[method](uri, encode(fdata))
    },

    // 验证和处理没有用"增加沟通记录"的comm_log表单
    handleLog() {
      let valid = true
      const communication_at = this.comm_log.communication_at
      const content = this.comm_log.content

      if (communication_at !== '' || content !== '') {
        valid = this.addLog('comm_log')
      }

      return valid
    },

    // Form click提交表单事件handler
    handleSubmit(name) {
      const logValid = this.handleLog()

      // 进行表单提交
      this.$refs[name]
        .validate((valid) => {
          if (valid && logValid) {
            this.submit()
              .then(() => this.goBack())
              .catch(this.errorHandler)
              .then(() => { this.loading = false })
          }
        })
    },
  },

  created() {
    this.getPreconfig()
    // 编辑页面初始化以及loading页面关闭

    this.fetchUpdationInfo(this.$route.params.id)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import '~vars';

.commeditor--plus-container {
  text-align: center;
}

.commeditor--contents {
  margin-bottom: 15px;
  font-size: 14px;

  &-date {
    padding-left: 15px;
  }

  &-delete {
    color: @error-color;
  }
}

// iview样式重写
.commeditor {

  & .ivu-input-number {
    width: 100%;
  }

  & .ivu-date-picker {
    display: block;
  }
}
</style>
