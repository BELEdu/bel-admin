<template>
  <Form class="app-form-entire" :model="form" :label-width="140" ref="form">
    <app-form-alert :errors="formErrors"></app-form-alert>

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

    <!--这里后台暂时还没有数据，过后需要补上-->
    <!--<data-auths :data="data_auths" v-model="form.data_auths"></data-auths>-->

    <permissions
      :data="permissions"
      v-model="permission_ids"
      :disabledIds="form.role_permission_ids"
    ></permissions>

    <Form-item>
      <Button type="ghost" size="large" @click="goBack">取消</Button>
      <Button type="primary" size="large" @click="beforeSubmit" :loading="formLoading">提交</Button>
    </Form-item>
  </Form>
</template>

<script>
/**
 * 系统管理 - 用户管理 - 修改用户权限
 * @author lmh
 * @version 2017-06-27
 */

import { GLOBAL } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import DataAuths from '../components/DataAuths'
import Permissions from '../components/Permissions'

export default {
  name: 'app-system-user-role',

  mixins: [form, goBack],

  data() {
    return {
      permissions: [],
      data_auths: [],

      form: {
        is_student_admin: 0,
        is_student_teac: 0,
        role_permission_ids: [], // 该角色固有权限
        user_permission_ids: [], // 该角色自定义权限
      },

      permission_ids: [], // 固有权限与自定义权限的并集
    }
  },

  computed: {
    url() {
      const { userId, roleId } = this.$router.currentRoute.params
      return `/user/${userId}/role/${roleId}`
    },

    user_permission_ids() {
      this.permission_ids
        .filter(id => !this.form.role_permission_ids.includes(id))
    },
  },

  methods: {
    getData() {
      return this.$http.get('/role/create')
        .then(({ permissions, data_auths }) => {
          this.permissions = permissions
          this.data_auths = data_auths
        })
    },

    getRole() {
      return this.$http.get(this.url)
        .then((res) => {
          this.form = res

          const { role_permission_ids, user_permission_ids } = this.form
          this.permission_ids = [...role_permission_ids, ...user_permission_ids]
        })
    },

    submit() {
      this.$http.patch(this.url, {
        ...this.form,
        user_permission_ids: this.user_permission_ids,
      })
        .then(this.successHandler)
        .catch(this.errorHandler)
    },
  },

  components: {
    DataAuths,
    Permissions,
  },

  created() {
    this.getData()
      .then(this.getRole)
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>
