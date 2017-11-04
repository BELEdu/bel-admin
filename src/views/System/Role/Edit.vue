<template>
  <div>
    <h1 class="app-form-header">
      <Icon type="edit"></Icon>
      {{ this.id ? '编辑角色' : '添加角色' }}
    </h1>

    <Form class="app-form-entire" :model="form" :rules="rules" :label-width="140" ref="form">
      <app-form-alert :errors="formErrors"></app-form-alert>

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
        <Radio-group v-model="form.is_student_admin">
          <Radio :label="0">关闭</Radio>
          <Radio :label="1">开启</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="学员授课">
        <Radio-group v-model="form.is_student_teac">
          <Radio :label="0">关闭</Radio>
          <Radio :label="1">开启</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="学员咨询">
        <Radio-group v-model="form.is_student_advisory">
          <Radio :label="0">关闭</Radio>
          <Radio :label="1">开启</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="排课专员">
        <Radio-group v-model="form.is_student_schedule">
          <Radio :label="0">关闭</Radio>
          <Radio :label="1">开启</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="设备管理">
        <Radio-group v-model="form.is_equipment_admin">
          <Radio :label="0">关闭</Radio>
          <Radio :label="1">开启</Radio>
        </Radio-group>
      </Form-item>

      <data-auths :data="data_auths" v-model="form.data_auths"></data-auths>

      <permissions :data="permissions" v-model="form.permissions"></permissions>

      <Form-item>
        <Button type="ghost" size="large" @click="goBack">取消</Button>
        <Button type="primary" size="large" @click="beforeSubmit" :loading="formLoading">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 系统管理 - 角色管理 - 创建/编辑角色
 * @author lmh
 * @version 2017-06-27
 */

import { mapState } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import { getPath } from '@/utils/helpers'
import DataAuths from '../components/DataAuths'
import Permissions from '../components/Permissions'

export default {
  name: 'app-system-role-edit',

  mixins: [form, goBack],

  data() {
    return {
      form: {
        display_name: '',
        description: '',
        department_id: [], // 这里数据类型有疑问
        is_student_admin: 0,
        is_student_teac: 0,
        is_student_advisory: 0,
        is_student_schedule: 0,
        is_equipment_admin: 0,
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
    ...mapState({
      departments: state => state.system.data.departments,
      data_auths: state => state.system.data.data_auths,
      permissions: state => state.system.data.permissions,
      departmentPaths: state => state.system.data.departmentPaths,
    }),

    id() {
      return this.$route.params.id
    },
  },

  methods: {
    // 获取当前编辑项的数据
    getDetail() {
      return this.$http.get(`/role/${this.id}`)
        .then((res) => {
          this.form = {
            ...res,
            department_id: getPath(res.department_id, this.departmentPaths),
          }
        })
    },

    submit() {
      const data = {
        ...this.form,
        department_id: this.form.department_id[this.form.department_id.length - 1],
      }

      const request = this.id ?
        this.$http.patch(`/role/${this.id}`, data) :
        this.$http.post('/role', data)

      request
        .then(this.successHandler)
        .catch(this.errorHandler)
    },
  },

  components: {
    DataAuths,
    Permissions,
  },

  created() {
    this.$store.dispatch(SYSTEM.DATA.PERMIS.INIT)
      .then(() => this.id && this.getDetail())
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>
