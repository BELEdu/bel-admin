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

    <Form-item label="学员咨询">
      <Radio-group v-model="form.is_student_advisory">
        <Radio :label="0">关闭</Radio>
        <Radio :label="1">开启</Radio>
      </Radio-group>
    </Form-item>

    <!--这里后台暂时还没有数据，过后需要补上-->
    <data-auths :data="data_auths" v-model="form.data_auth_ids"></data-auths>

    <permissions
      :data="permissions"
      v-model="form.permission_ids"
    ></permissions>

    <Form-item>
      <Button type="ghost" size="large" @click="goBack">取消</Button>
      <Button type="primary" size="large" @click="submit" :loading="formLoading">提交</Button>
    </Form-item>
  </Form>
</template>

<script>
/**
 * 系统管理 - 用户管理 - 修改用户权限
 * @author lmh
 * @version 2017-06-27
 */

import { mapState } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import DataAuths from '../components/DataAuths'
import Permissions from '../components/Permissions'

export default {
  name: 'app-system-user-role',

  mixins: [form, goBack],

  data() {
    return {
      form: {
        is_student_admin: 0,
        is_student_teac: 0,
        is_student_advisory: 0,
        data_auth_ids: [],
        permission_ids: [],
      },
    }
  },

  computed: {
    ...mapState({
      data_auths: state => state.system.data.data_auths,
      permissions: state => state.system.data.permissions,
    }),

    url() {
      const { userId, roleId } = this.$router.currentRoute.params
      return `/user/${userId}/role/${roleId}`
    },
  },

  methods: {
    getRole() {
      return this.$http.get(this.url)
        .then((res) => {
          this.form = res
        })
    },

    submit() {
      this.$http.patch(this.url, this.form)
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
      .then(this.getRole)
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>
