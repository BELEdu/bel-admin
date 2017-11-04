<template>
  <Form class="app-form-entire" :model="form" :label-width="140" ref="form">
    <app-form-alert :errors="formErrors"></app-form-alert>

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
import Permissions from '../components/Permissions'

export default {
  name: 'app-system-user-role',

  mixins: [form, goBack],

  data() {
    return {
      form: {
        permission_ids: [],
      },
    }
  },

  computed: {
    ...mapState({
      permissions: state => state.system.data.permissions,
    }),

    url() {
      const { userId, roleId } = this.$route.params
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
