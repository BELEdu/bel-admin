<template>
  <div
    class="login"
    :style="{backgroundImage:`url(${require('@/assets/bg-login-lg.jpg')})`}"
  >
    <div class="login-box clearfix">

      <!-- 左侧背景 -->
      <div
        class="login-box__left"
        :style="{backgroundImage:`url(${require('@/assets/bg-login-sm.png')})`}"
      >
        <img
          class="login-box__logo"
          :src="require('@/assets/logo-login.png')"
          alt="logo"
        >
      </div>

      <!-- 右侧表单 -->
      <Form
        class="login-box__body"
        :model="form"
        :rules="rules"
        :label-width="60"
        ref="form"
      >
        <!-- 标题 -->
        <h1 class="login-box__body__title">欢迎登录爱考拉SAAS管理系统</h1>

        <!-- 错误提示 -->
        <app-form-alert
          :errors="formErrors"
          :fullWidth="true"
        ></app-form-alert>

        <div class="login-box__body__content clearfix" @keyup.enter="beforeSubmit">

          <div class="login-box__form">
            <Form-item
              label="用户名"
              prop="username"
            >
              <Input
                v-model="form.username"
                placeholder="请输入用户名"
              ></Input>
            </Form-item>

            <Form-item
              label="密码"
              prop="password"
            >
              <Input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                autocomplete="off"
              ></Input>
            </Form-item>

            <Button
              class="login-box__form__button"
              type="primary"
              @click="beforeSubmit"
              :loading="formLoading"
              size="large"
              long
            >登录</Button>

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
import { form, menu } from '@/mixins'

export default {
  name: 'app-login',

  mixins: [form, menu],

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
        .then(({ permissions }) => {
          // 若登录成功，通知父组件连接socket，并转跳到首页
          this.$emit('login')
          this.defaultRouterPath(permissions)
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

@login-radius: 8px;
@login-width: 1000px;
@login-height: 580px;
@input-height: 34px;
@form-width:280px;

.cover-img() {
  background-color : @disabled-color;
  background-repeat:no-repeat;
  background-position:center;
  background-size: cover;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .cover-img()
}

.login-box {
  width: @login-width;
  height: @login-height;
  border-radius: @login-radius;
  box-shadow: 0 0 30px @shadow-color;
  overflow: hidden;
  background-color : #fff;

  &__left {
    position: relative;
    float: left;
    width: @login-width*0.6;
    height: 100%;

    .cover-img()
  }

  &__body {
    float: left;
    width: @login-width*0.4;
    height: 100%;

    &__title {
      width: 100%;
      font-size: 22px;
      font-weight: normal;
      text-align: center;
      color: #333;
      margin-top: 145px;
      margin-bottom: 40px;
    }

    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .app-form-alert {
      margin:0 60px;
    }
  }

  &__form {
    width: @form-width;

    &__button {
      margin-top: 40px;
    }

    .ivu-form-item:last-child {
      margin-bottom: 0;
    }

    .ivu-form-item-label {
      padding: 0 15px 0 0;
      overflow: hidden;
      text-align: justify;
      height: @input-height;
      line-height: @input-height;
      font-size: 14px;

      &::before {
        display: none;
      }

      &::after {
        content:'';
        display: inline-block;
        width: 100%;
      }
    }

    .ivu-input{
      height: @input-height;
      font-size: 14px;
    }
  }

  &__logo {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -75px;
    margin-top: -80px;
    width: 150px;
    height: 160px;
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
