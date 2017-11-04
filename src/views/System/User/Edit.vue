<template>
  <div>
    <h1 class="app-form-header">
      <Icon type="edit"></Icon>
      {{ this.id ? '编辑用户' : '添加用户' }}
    </h1>

    <Form class="app-form-entire" :model="form" :rules="rules" :label-width="140" ref="form">
      <app-form-alert :errors="formErrors"></app-form-alert>

      <Form-item label="用户名" prop="username">
        <Input placeholder="请输入用户名" v-model="form.username"></Input>
      </Form-item>

      <Form-item label="姓名" prop="realname">
        <Input placeholder="请输入姓名" v-model="form.realname"></Input>
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

      <Form-item label="部门角色" prop="roles">
        <Radio-group v-model="form.default_role_id" style="display: block;">
          <div v-for="(role, index) in form.roles" :key="role.join()" class="multiple-select">
            <Cascader
              placeholder="请选择部门与角色" :data="roles" :value="form.roles[index]"
              @on-change="(value, detail) => selectRole(value, detail, index)"
            ></Cascader>
            <Button class="multiple-select__modify" :class="{hidden: !isRoleInDb(role)}" type="text" @click="editUserRole(role)">修改权限</Button>
            <Radio class="multiple-select__radio" :class="{hidden: !role.length}" :label="role[role.length - 1]">设为默认</Radio>
            <Button :class="{hidden: form.roles.length <= 1}" type="text" @click="removeRole(index)">删除</Button>
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
        <Radio-group v-model="form.status">
          <Radio :label="2">禁用</Radio>
          <Radio :label="1">启用</Radio>
        </Radio-group>
      </Form-item>

      <Form-item>
        <Button type="ghost" size="large" @click="goBack">取消</Button>
        <Button type="primary" size="large" @click="beforeSubmit" :loading="formLoading">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 系统管理 - 用户管理 - 用户详情页（新建/编辑）
 * @author lmh | chenliangshan
 * @version 2017-06-19
 */

import Vue from 'vue'
import { mapState } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import { getPath } from '@/utils/helpers'

export default {
  name: 'app-system-user-detail',

  mixins: [form, goBack],

  data() {
    return {
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
        default_role_id: null,
        password: '',
        repassword: '',
        status: 1,
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
          this.$rules.required('邮箱'),
          this.$rules.email,
        ],
        mobile: [
          this.$rules.mobile,
        ],
        roles: [
          this.$rules.required('部门角色', 'array', 'change'),
          {
            validator: (rule, value, next) => {
              if (value.filter(item => item.length).length) {
                next()
              } else {
                next(new Error('部门角色不能为空'))
              }
            },
          },
        ],
        password: [
          this.$rules.required('密码'),
          this.$rules.length(6, 32),
        ],
        repassword: [
          this.$rules.required('密码'),
          {
            validator: (rule, value, next) => {
              if (value === this.form.password) {
                next()
              } else {
                next(new Error('两次密码不一致'))
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
      roles: state => state.system.data.roles,
      rolePaths: state => state.system.data.rolePaths,
    }),

    id() {
      return this.$route.params.id
    },
  },

  watch: {
    'form.roles': {
      handler(newVal, oldVal) {
        if (this.form.default_role_id) {
          oldVal.forEach((item, index) => {
            if (item.includes(this.form.default_role_id)) {
              this.form.default_role_id = newVal[index][newVal[index].length - 1]
            }
          })
        }
      },
      deep: true,
    },
  },

  methods: {
    // 获取当前用户信息
    getUser() {
      this.$http.get(`/user/${this.id}`)
        .then((res) => {
          this.form = {
            ...res,
            roles: res.roles.map(role => getPath(role.id, this.rolePaths, true)),
          }
          this.rolesInDb = [...this.form.roles]
        })
    },

    isRoleInDb(role) {
      return this.rolesInDb.some(roleInDb => String(roleInDb) === String(role))
    },

    // 添加角色时做的额外处理
    selectRole(value, detail, index) {
      const target = detail[detail.length - 1]

      const canNotChoose = target.can_choose === 0 // 该项是部门而非角色
      const hasSelected = this.form.roles // 该项已被选中过
        .slice(0, -1)
        .some(role => role[role.length - 1] === target.value)

      // 如果该项是部门，或者已被选中过，把该项的值重置为空
      // 相当于撤销此次选择
      if (canNotChoose || hasSelected) {
        Vue.set(this.form.roles, index, [])
      } else {
        /**
         * 此处理是为监听 form.roles 字段值变化
         * 注意：在变异 (不是替换) 对象或数组时，
         * 旧值将与新值相同，
         * 因为它们的引用指向同一个对象/数组。
         * Vue 不会保留变异之前值的副本。
         */
        const roles = this.form.roles.map((item, key) => {
          if (key === index) {
            return value
          }
          return item
        })
        this.form.roles = [...roles]
      }

      if (canNotChoose) {
        this.$Message.error('该部门下暂无角色')
      }
      if (hasSelected) {
        this.$Message.error('请勿重复选择角色')
      }

      // 第一个添加的角色自动设置为默认角色
      if (!this.form.default_role_id) {
        setTimeout(() => {
          this.form = {
            ...this.form,
            default_role_id: target.value,
          }
        })
      }
    },

    // 删除角色
    removeRole(index) {
      const role = this.form.roles[index]
      const roleId = role[role.length - 1]
      this.form.roles.splice(index, 1)

      // 如果被删除的是默认角色，自动把第一个角色设置为默认角色
      if (this.form.default_role_id === roleId) {
        const firstRole = this.form.roles[0]
        this.form = {
          ...this.form,
          default_role_id: firstRole[firstRole.length - 1],
        }
      }
    },

    // 修改某一个已存在于数据库中的角色的权限
    editUserRole(role) {
      const id = role[role.length - 1]
      this.$router.push(`/system/user/edit/${this.id}/role/${id}`)
    },

    submit() {
      const data = {
        ...this.form,
        roles: this.form.roles
          .filter(role => role.length)
          .map(role => role[role.length - 1]),
      }

      const request = this.id ?
        this.$http.patch(`/user/${this.id}`, data) :
        this.$http.post('/user', data)

      request
        .then(this.successHandler)
        .catch(this.errorHandler)
    },
  },

  created() {
    // 编辑已存在用户时，密码非必填，去除相关验证规则
    if (this.id) {
      this.rules.password.shift()
      this.rules.repassword.shift()
    }

    this.$store.dispatch(SYSTEM.DATA.ROLES.INIT)
      .then(() => this.id && this.getUser())
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

