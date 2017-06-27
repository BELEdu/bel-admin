<template>
  <Form class="app-form-entire" :model="form" :rules="rules" :label-width="140" ref="form">
    <Form-item label="角色名称" prop="display_name">
      <Input placeholder="请输入角色名称" v-model="form.display_name"></Input>
    </Form-item>
    <Form-item label="角色描述" prop="description">
      <Input type="textarea" placeholder="角色相关描述" v-model="form.description"></Input>
    </Form-item>
    <Form-item label="所属部门" prop="department_id">
      <Cascader :data="departments" placeholder="请选择所属部门" v-model="form.department_id" change-on-select></Cascader>
    </Form-item>

    <Form-item label="学员管理">
      <i-switch size="large" v-model="form.is_student_admin">
        <span slot="open">开启</span>
        <span slot="close">关闭</span>
      </i-switch>
    </Form-item>
    <Form-item label="学员授课">
      <i-switch size="large" v-model="form.is_student_teac">
        <span slot="open">开启</span>
        <span slot="close">关闭</span>
      </i-switch>
    </Form-item>

    <data-auths :data="data_auths" v-model="form.data_auths"></data-auths>

    <permissions :data="permissions" v-model="form.permissions"></permissions>

    <Form-item>
      <Button type="ghost" size="large" @click="goBack">取消</Button>
      <Button type="primary" size="large" @click="submit">提交</Button>
    </Form-item>
  </Form>
</template>

<script>
/**
 * 系统管理 - 角色管理 - 创建/编辑角色
 * @author lmh
 * @version 2017-06-27
 */

import { GLOBAL } from '@/store/mutationTypes'
import { transform, generatePaths, getPath } from '../utils'
import DataAuths from '../components/DataAuths'
import Permissions from '../components/Permissions'

export default {
  name: 'app-system-role-edit',

  data() {
    return {
      departments: [],
      departmentPaths: [],
      permissions: [],
      data_auths: [],

      form: {
        display_name: '',
        description: '',
        department_id: [], // 这里数据类型有疑问
        is_student_admin: false,
        is_student_teac: false,
        menus: [],
        permissions: [],
        data_auths: [],
      },

      rules: {
        display_name: [
          this.$rules.required('角色名称'),
          this.$rules.length(2, 12),
        ],
        description: [
          this.$rules.max(100),
        ],
        department_id: [
          this.$rules.required('所属部门', 'array'),
        ],
      },
    }
  },

  computed: {
    id() {
      return this.$router.currentRoute.params.id
    },
  },

  methods: {
    // 获取某些表单组件所需数据项，如下拉框的数据
    getData() {
      return this.$http.get('/role/create')
        .then(({ departments, permissions, data_auths }) => {
          this.departments = transform(departments)
          this.departmentPaths = generatePaths(departments)
          this.permissions = permissions
          this.data_auths = data_auths
        })
    },

    // 获取当前编辑项的数据
    getDetail(id) {
      return this.$http.get(`/role/${id}`)
        .then((res) => {
          this.form = {
            ...res,
            department_id: getPath(res.department_id, this.departmentPaths),
            is_student_admin: !!res.is_student_admin,
            is_student_teac: !!res.is_student_teac,
          }
        })
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            is_student_admin: +this.form.is_student_admin,
            is_student_teac: +this.form.is_student_teac,
            department_id: this.form.department_id[this.form.department_id.length - 1],
          }
          const request = this.id ?
            this.$http.patch(`/role/${this.id}`, data) :
            this.$http.post('/role', data)

          request
            .then(() => this.goBack())
        }
      })
    },

    goBack() {
      this.$router.go(-1)
    },
  },

  components: {
    DataAuths,
    Permissions,
  },

  created() {
    this.getData()
      .then(() => {
        if (this.id) {
          return this.getDetail(this.id)
        }
        return Promise.resolve()
      })
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>
