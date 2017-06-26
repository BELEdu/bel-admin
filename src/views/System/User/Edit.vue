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
            <Cascader
              placeholder="请选择部门与角色" :data="roles" v-model="form.roles[index]"
              @on-change="(value, detail) => selectRole(value, detail, index)"
            ></Cascader>
            <Button class="user-edit-role__modify" :class="{hidden: !isRoleInDb(role)}" type="text">修改权限</Button>
            <Radio class="user-edit-role__radio" :class="{hidden: !role.length}" :label="role[role.length - 1]">设为默认</Radio>
            <Button :class="{hidden: form.roles.length <= 1}" type="text" @click="form.roles.pop()">删除</Button>
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
        <Button type="ghost" size="large" @click="goBack">取消</Button>
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

import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
import { transform, generatePaths, getPath } from '../utils'

export default {
  name: 'app-system-user-detail',

  data() {
    return {
      roles: [],
      rolePaths: [],

      // 后台返回的该用户已有的角色，只有这些角色可以被修改权限
      rolesInDb: [],

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

    id() {
      return this.$router.currentRoute.params.id
    },
  },

  methods: {
    // 获取部门角色列表
    getData() {
      return this.$http.get('/department_role')
        .then((res) => {
          this.roles = transform(res)
          this.rolePaths = generatePaths(res)
        })
    },

    // 获取当前用户信息
    getUser() {
      this.$http.get(`/user/${this.id}`)
        .then((res) => {
          this.form = {
            ...res,
            roles: res.roles.map(role => getPath(role.id, this.rolePaths)),
            status: !!res.status,
          }
          this.rolesInDb = [...this.form.roles]
        })
    },

    isRoleInDb(role) {
      return this.rolesInDb.some(roleInDb => String(roleInDb) === String(role))
    },

    selectRole(value, detail, index) {
      const target = detail[detail.length - 1]

      const canNotChoose = target.can_choose === 0 // 该项是部门而非角色
      const hasSelected = this.form.roles // 该项已被选中过
        .slice(0, -1)
        .some(role => role[role.length - 1] === target.value)

      if (canNotChoose || hasSelected) {
        this.form = {
          ...this.form,
          roles: [
            ...this.form.roles.slice(0, index),
            [],
            ...this.form.roles.slice(index + 1),
          ],
        }
      }

      if (canNotChoose) {
        this.$Message.error('该部门下暂无角色')
      }
      if (hasSelected) {
        this.$Message.error('请勿重复选择角色')
      }
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            status: +this.form.status,
          }
          const request = this.id ? () => {} : this.$http.post('/user', data)

          request
            .then(() => this.goBack())
        }
      })
    },

    goBack() {
      this.$router.go(-1)
    },
  },

  created() {
    this.getData()
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
  align-items: center;
  margin-bottom: 20px;

  .ivu-cascader {
    flex: 1;
  }

  &__radio.ivu-radio-wrapper {
    flex: 0;
    margin: 0 10px 0 25px;
    font-size: 12px !important;
  }

  &__btn {
    flex: none;
    width: 56px;
  }

  &__modify {
    position: relative;
    margin-left: -90px;
  }

  .hidden {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
