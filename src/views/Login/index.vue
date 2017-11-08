<template>
  <div class="login">
    <div class="login-box">
      <header class="login-box__header">
        <h1>欢迎登陆爱考拉 SaaS 管理系统</h1>
      </header>

      <Form class="login-box__body" :model="form" :rules="rules" :label-width="60" ref="form">
        <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>

        <div class="login-box__body__content clearfix" @keyup.enter="beforeSubmit">
          <img class="login-box__logo" :src="require('@/assets/logo.png')" alt="">

          <div class="login-box__form">
            <Form-item label="用户名" prop="username">
              <Input v-model="form.username"></Input>
            </Form-item>
            <Form-item label="密码" prop="password">
              <Input type="password" v-model="form.password" autocomplete="off"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="beforeSubmit" :loading="formLoading" long>登录</Button>
            </Form-item>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
/**
 * 登陆页
 * @author lmh
 * @version 2017-07-21
 */

import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
import { form } from '@/mixins'

export default {
  name: 'app-login',

  mixins: [form],

  data() {
    return {
      // 表单数据
      form: {
        username: '',
        password: '',
      },

      // 表单验证规则
      rules: {
        username: [
          this.$rules.required('用户名'),
        ],
        password: [
          this.$rules.required('密码'),
        ],
      },
    }
  },

  computed: {
    ...mapState(['token']),
  },

  methods: {
    // 用户登录
    submit() {
      this.$store.dispatch(GLOBAL.LOGIN, this.form)
        .then(() => {
          // 若登录成功，通知父组件连接socket，并转跳到首页
          this.$emit('login')
          this.$router.push('/index')
        })
        .catch(this.errorHandler)
    },
  },

  created() {
    // 进入登录页面时，如果已登录，转跳到首页
    if (this.token) {
      this.$router.push('/index')
    }
  },
}
</script>

<style lang="less">
@import '~vars';

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  width: 500px;
  border: 1px solid @border-color-base;
  box-shadow: 0 0 5px @shadow-color;

  &__header {
    background-color: @primary-color ;
    color: #fff;
    text-align: center;

    & > h1 {
      height: 50px;
      font-size: 16px;
      line-height: 50px;
    }
  }

  &__body {
    padding: 25px 45px;

    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__alert {
    margin-top: -10px;
    margin-bottom: 15px;
  }

  &__logo {
    width: 120px;
    height: 120px;
  }
}

// 兼容ie9
.ie {
  .login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    transform: translateY(-50%);

    &__logo {
      float: left;
    }

    &__form {
      float: right;
    }
  }
}
</style>
