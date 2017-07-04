<template>
  <main class="commeditor app-form-entire" v-if="fdata">
    <app-editor-title></app-editor-title>
    <Form :label-width="110" :rules="formRules" ref="form" :model="fdata">
      <Form-item label="学员姓名" required prop="student_name">
        <Input placeholder="请输入学生姓名" v-model="fdata.student_name"></Input>
      </Form-item>
      <Form-item label="联系方式" required prop="mobile">
        <Input placeholder="请输入手机号码" v-model="fdata.mobile"></Input>
      </Form-item>
      <Form-item label="学员性别">
        <Radio-group v-model="fdata.gender">
          <Radio :label="1">
            <span>男</span>
          </Radio>
          <Radio :label="2">
            <span>女</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="在读学校" prop="school_name">
        <Input placeholder="请输入学校名称" v-model="fdata.school_name"></Input>
      </Form-item>
      <Form-item label="年段排名" prop="rank">
        <Input placeholder="请输入年段排名" v-model="fdata.rank"></Input>
      </Form-item>
      <Form-item label="当前年级">
        <Select placeholder="请选择......" v-model="fdata.grade">
          <Option v-if="grade" v-for="item in grade" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item label="是否偏科">
        <Radio-group v-model="fdata.is_tend_subject">
          <Radio :label="1">
            <span>是</span>
          </Radio>
          <Radio :label="0">
            <span>否</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="回访时间" prop="return_visited_at">
        <Date-picker placeholder="年 / 月 / 日" :editable="false" v-model="fdata.return_visited_at"></Date-picker>
      </Form-item>
      <Form-item label="沟通类型">
        <Select placeholder="请选择......" v-if="communication_type" v-model="fdata.communication_type">
          <Option v-for="item in communication_type" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
    </Form>
    <!-- log表单 -->
    <Form :label-width="110" :rules="formRules" ref="comm_log" :model="comm_log">
      <!-- log编辑 -->
      <Form-item label="沟通时间" prop="communication_at">
        <Date-picker placeholder="年 / 月 / 日" :editable="false" v-model="comm_log.communication_at"></Date-picker>
      </Form-item>
      <Form-item label="沟通情况" prop="content">
        <Input type="textarea" placeholder="请输入......" :rows="4" v-model="comm_log.content"></Input>
      </Form-item>
      <!-- log编辑 end-->
      <!-- 添加log -->
      <Form-item class="commeditor--plus-container">
        <Button type="dashed" icon="plus" @click.stop="addLogClick = true; addLog('comm_log')">增加沟通记录</Button>
      </Form-item>
      <!-- 添加log end -->
      <!-- logs展示 -->
      <Row class="commeditor--contents" style="font-size: 14px;" v-for="(item, index) in fdata.communication_logs" v-if="fdata.communication_logs.length" :key="item.communication_at">
        <Col span="3" class="commeditor--contents-date">{{item.communication_at}}</Col>
        <Col span="20">{{item.content}}</Col>
        <Col span="1" style="padding-left: 5px;">
        <!-- 删除log-->
        <Button class="commeditor--contents-delete" size="small" type="text" @click.stop="deleteLog(item.communication_id, item.id, index)">删除</Button>
        <!-- 删除log end-->
        </Col>
      </Row>
      <!-- logs展示 end -->
      <Form-item>
        <Button @click="cancel()">取消</Button>
        <Button type="primary" :loading="loading" @click="handleSubmit('form')">提交</Button>
      </Form-item>
    </Form>
    <!-- log表单 end -->
  </main>
</template>

<script>
/**
 * 沟通记录 - 记录编辑
 * @author hjz
 * @version 2017-06-07
 */
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { Http } from '@/utils'
import { editInit, encode } from './modules/config'

export default {
  name: 'CommunicationEdit',

  data() {
    return {
      // "取消"按钮行为的路由对象
      backRoute: null,
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
      grade: null,
      // 表单验证规则
      formRules: {
        student_name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { type: 'string', min: 2, max: 10, message: '长度应该在2到10之间', trigger: 'blur' },
          { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { type: 'string', pattern: /^1/, min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
        ],
        school_name: [
          { type: 'string', min: 2, max: 20, message: '长度应该在2到20之间' },
          { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
        ],
        rank: [
          { type: 'string', pattern: /^[1-9][0-9]*$/, message: '排名应为大于1的有效数字', trigger: 'blur' },
          { type: 'string', min: 1, max: 10, message: '长度在十位以内', trigger: 'blur' },
        ],
        communication_at: [
          { validator: this.validateLogAt },
          // { type: 'date', }
        ],
        content: [
          { validator: this.validateLogContent },
        ],
      },
    }
  },

  methods: {
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
    // 删除log项
    deleteLog(communication_id, id, index) {
      if (id && communication_id) {
        Http.delete(`/communication/${communication_id}/log/${id}`)
      }
      this.fdata.communication_logs.splice(index, 1)
    },
    // 新增log项
    addLog(name) {
      let result = false
      // log验证成功后
      this.$refs[name].validate((valid) => {
        if (valid) {
          const communication_at = this.comm_log.communication_at.toJSON().slice(0, 10)
          const comm_log = {
            communication_at,
            content: this.comm_log.content,
          }
          if (this.$route.params.id) Http.post(`/communication/${this.$route.params.id}/log`, comm_log)
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
      // 开启按钮loadding
      this.loading = true
      // 根据接口文档转化数据
      const fdata = encode(this.fdata)
      // 判断新增还是修改
      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.UPDATE, { id, fdata })
          .then(() => { this.loading = false; this.cancel() })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.cancel() })
      }
    },
    // Form click提交表单事件handler
    handleSubmit(name) {
      // 验证和处理没有用"增加沟通记录"的comm_log表单
      const communication_at = this.comm_log.communication_at
      const content = this.comm_log.content
      let logValid = true
      if (communication_at !== '' || content !== '') {
        logValid = this.addLog('comm_log')
      }
      // 进行表单提交
      this.$refs[name].validate((valid) => { if (valid && logValid) this.submit() })
    },
    // 取消表单编辑
    cancel() {
      if (this.backRoute === null || this.backRoute.matched.length === 0) {
        this.$router.push('/business/communication')
      } else {
        this.$router.push(this.backRoute.fullPath)
      }
    },
  },

  created() {
    // 获取字典数据
    Http.get('/dict?keys=communication_type,grade')
      .then((res) => {
        this.communication_type = res.communication_type
        this.grade = res.grade
      })

    // 编辑页面初始化以及loading页面关闭
    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => { this.fdata = res; this.$store.commit(GLOBAL.LOADING.HIDE) })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

  beforeRouteEnter(to, from, next) {
    // eslint-disable-next-line
    next((vm) => { vm.backRoute = from })
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

  & .ivu-date-picker {
    display: block;
  }
}
</style>
