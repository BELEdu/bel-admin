<template>
  <div>
    <h1 class="app-form-header">
      <Icon type="edit"></Icon>
      添加用户
    </h1>

    <Form class="app-form-entire" :model="form" :rules="rules" :label-width="140" ref="form">
      <Form-item label="用户名" prop="username">
        <Input placeholder="请输入用户名" v-model="form.username"></Input>
      </Form-item>
      <Form-item label="姓名" prop="realname">
        <Input placeholder="请输入姓名" v-model="form.realname"></Input>
      </Form-item>
      <Form-item label="员工编号">
        <Input placeholder="请输入员工编号"></Input>
      </Form-item>
      <Form-item label="邮箱账号" prop="email">
        <Input placeholder="请输入邮箱账号" v-model="form.email"></Input>
      </Form-item>
      <Form-item label="手机号码" prop="mobile">
        <Input placeholder="请输入手机号码" v-model="form.mobile"></Input>
      </Form-item>
      <Form-item label="性别" prop="gender">
        <Radio-group v-model="form.gender">
          <Radio v-for="gender in genders" :key="gender.value" :label="gender.value">{{ gender.display_name }}</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="岗位性质" prop="users_job_type">
        <Radio-group v-model="form.users_job_type">
          <Radio v-for="jobType in jobTypes" :key="jobType.value" :label="jobType.value">{{ jobType.display_name }}</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="部门角色">
        <Radio-group v-model="form.default_role_id" style="display: block;">
          <div v-for="role,index in form.roles" class="user-edit-role">
            <Cascader placeholder="请选择部门与角色" :data="cascaderDepartments"></Cascader>
            <Radio class="user-edit-role__radio" :label="index">设为默认</Radio>
            <div class="user-edit-role__btn">
              <Button type="text" v-show="form.roles.length > 1" @click="form.roles.pop()">删除</Button>
            </div>
          </div>
        </Radio-group>
        <Button type="dashed" icon="plus" class="color-primary" size="large" @click="form.roles.push([])">
          增加部门角色
        </Button>
      </Form-item>
      <Form-item label="密码" prop="password">
        <Input type="password" placeholder="请输入密码" v-model="form.password"></Input>
      </Form-item>
      <Form-item label="重复密码" prop="repassword">
        <Input type="password" placeholder="请输入密码" v-model="form.repassword"></Input>
      </Form-item>
      <Form-item label="状态">
        <i-switch size="large" v-model="form.status">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </i-switch>
      </Form-item>

      <Form-item>
        <Button type="ghost" size="large">取消</Button>
        <Button type="primary" size="large" @click="submit">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 系统管理 - 用户管理 - 用户详情页（新建/编辑）
 * @author lmh
 * @version 2017-06-19
 */

import { mapState, mapGetters } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'

export default {
  name: 'app-system-user-detail',

  data() {
    return {
      form: {
        username: '',
        realname: '',
        email: '',
        mobile: '',
        gender: 1,
        users_job_type: '',
        roles: [[]],
        default_role_id: 1,
        password: '',
        repassword: '',
        status: true,
        avatar: '',
      },

      rules: {
        username: [
          this.$rules.required('用户名'),
          this.$rules.length(5, 32),
        ],
        realname: [
          this.$rules.required('姓名'),
          this.$rules.length(2, 24),
        ],
        email: [
          this.$rules.email,
        ],
        mobile: [
          this.$rules.mobile,
        ],
        password: [
          this.$rules.required('密码'),
          this.$rules.length(6, 32),
        ],
        repassword: [
          this.$rules.required('密码'),
          {
            validator: (rule, value, callback) => {
              if (value === this.form.password) {
                callback()
              } else {
                callback(new Error('两次密码不一致'))
              }
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },

  computed: {
    ...mapState({
      genders: state => state.dicts.gender,
      jobTypes: state => state.dicts.users_job_type,
    }),
    ...mapGetters(['cascaderDepartments']),

    id() {
      return this.$router.currentRoute.params.id
    },
  },

  methods: {
    getUser() {
      this.$http.get(`/user/${this.id}`)
        .then((res) => {
          this.form = {
            ...res,
            status: !!res.status,
          }
        })
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$http.post('/user', this.form)
        }
      })
    },
  },

  created() {
    this.$store.dispatch(SYSTEM.DEPARTMENT.INIT)
      .then(() => {
        if (this.id) this.getUser()
      })
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>

<style lang="less">
.user-edit-role {
  display: flex;
  margin-bottom: 20px;

  .ivu-cascader {
    flex: 1;
  }

  &__radio {
    flex: 0;
    margin: 0 20px;
  }

  &__btn {
    flex: none;
    width: 56px;
  }
}
</style>
