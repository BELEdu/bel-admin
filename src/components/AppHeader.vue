<template>
  <header class="app-header">
    <img class="app-logo" :src="require('@/assets/logo.png')" alt="厦门大学教学系统">
    <h1 class="app-title">某某机构教学系统</h1>
    <div class="app-user">
      <span class="app-user__notif">
        <Icon type="android-notifications-none"></Icon>
      </span>
      <Dropdown class="app-user__identity" placement="bottom-end">
        <a href="javascript:void(0)">分公司管理员<Icon type="arrow-down-b"></Icon></a>
        <Dropdown-menu slot="list">
          <Dropdown-item>厦门分公司/分公司管理员</Dropdown-item>
          <Dropdown-item>厦门分公司/思明校区/校区管理员</Dropdown-item>
          <Dropdown-item>厦门分公司/杏林校区/校区管理员</Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
      <span class="app-user__name">李小平</span>
      <div class="app-user__menu">
        <Dropdown trigger="click" placement="bottom-end" @on-click="handleUserDropDown">
          <a href="javascript:void(0)">
            <img class="app-user__avatar" :src="require('@/assets/default-avatar.png')" alt="李小平">
          </a>
          <Dropdown-menu slot="list">
            <Dropdown-item name="editPassword">修改密码</Dropdown-item>
            <Dropdown-item name="logout">退出</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </div>
    </div>

    <!--修改密码弹出框-->
    <app-form-modal v-model="modal" title="修改密码" :loading="formLoading">
      <Form class="app-header__edit-password" :model="form" :label-width="80">
        <Form-item label="用户名">
          <span>李小平</span>
        </Form-item>
        <Form-item label="原密码">
          <Input type="password" v-model="form.p1"></Input>
        </Form-item>
        <Form-item label="新密码">
          <Input type="password" v-model="form.p2"></Input>
        </Form-item>
        <Form-item label="重复新密码">
          <Input type="password" v-model="form.p3"></Input>
        </Form-item>
      </Form>
    </app-form-modal>
  </header>
</template>

<script>
/**
 * 应用头部
 * @author lmh
 * @version 2017-06-09 增加修改密码弹出框
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-header',

  data: () => ({
    modal: false,
    form: {
      p1: '',
      p2: '',
      p3: '',
    },
    formLoading: false,
  }),

  methods: {
    // 处理用户头像下拉菜单项的点击事件
    handleUserDropDown(name) {
      if (this[name]) {
        this[name]()
      }
    },

    // 修改密码
    editPassword() {
      this.modal = true
    },

    // 登出
    logout() {
      this.$store.dispatch(GLOBAL.LOGOUT)
        .then(() => {
          this.$router.push('/login')
        })
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.app-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: #fff;

  &__edit-password {
    width: 350px;
    margin: 0 auto;
  }
}

.app-logo {
  width: 25px;
  height: 25px;
  margin-right: 15px;
}

.app-title {
  font-size: 20px;
  font-weight: normal;
}

.app-user {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__notif {
    & > .ivu-icon {
      font-size: 20px;
    }
  }

  &__identity {
    padding: 0 15px;
    border-width: 0 1px;
    border-style: solid;
    border-color: @border-color-base;
    margin: 0 15px;

    & a {
      color: inherit;
      transition-duration: 0.5s;

      & > .ivu-icon {
        margin-left: 8px;
      }
    }
  }

  &__name {
    margin-right: 1em;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  // Dropdown组件的原生行为问题太多
  // 用自定义样式覆盖原生对齐方式
  .ivu-dropdown {
    position: relative;
  }

  .ivu-select-dropdown {
    left: initial !important;
    right: 0 !important;
    top: 100% !important;
  }
}

// 兼容ie9
.ie {
  .app-logo,
  .app-title {
    float: left;
  }

  .app-logo {
    margin-top: 17.5px;
  }

  .app-title {
    line-height: 60px;
  }

  .app-user,
  .app-user__menu {
    float: right;
  }

  .app-user__notif {
    transform: translateY(3px);
  }

  .app-user__name {
    line-height: 60px;
  }

  .app-user__menu {
    margin-top: 12px;
  }

}
</style>

