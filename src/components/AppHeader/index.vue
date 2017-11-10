<template>
  <header class="app-header">
    <img class="app-logo" :src="require('@/assets/logo-header.png')" alt="爱考拉教育">
    <!-- <h1 class="app-title">爱考拉教育</h1> -->
    <div class="app-user">
      <span class="app-user__notif">
        <Icon type="android-notifications-none"></Icon>
      </span>
      <Dropdown class="app-user__identity" placement="bottom-end" @on-click="switchRole">
        <a href="javascript:void(0)">
          <!--目前接口未完善，用户角色列表可能未返回，回导致这里出错，因此这里先作一个临时判断-->
          {{ currentRole ? currentRole.display_name : '接口未返回角色（调试用）' }}
          <Icon type="arrow-down-b" v-if="otherRoles.length"></Icon>
        </a>
        <Dropdown-menu slot="list" v-if="otherRoles.length">
          <Dropdown-item v-for="role in otherRoles" :key="role.id" :name="role.id">
            {{ role.display_name }}
          </Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
      <span class="app-user__name">{{ user.realname }}</span>
      <div class="app-user__menu">
        <Dropdown trigger="click" placement="bottom-end" @on-click="handleUserDropDown">
          <a href="javascript:void(0)">
            <img class="app-user__avatar" :src="user.avatar || require('@/assets/default-avatar.png')" :alt="user.realname">
          </a>
          <Dropdown-menu slot="list">
            <Dropdown-item name="editPassword">修改密码</Dropdown-item>
            <Dropdown-item name="userLabel">管理收藏标签</Dropdown-item>
            <Dropdown-item name="logout">退出</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </div>
    </div>

    <!--修改密码弹出框-->
    <app-form-modal v-model="modal" title="修改密码" :loading="formLoading" @on-ok="beforeSubmit" :maskClosable="true">
      <Form class="app-header__edit-password" ref="form" :model="form" :rules="rules" :label-width="90">
        <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>
        <Form-item label="姓名">
          <span class="color-primary">{{ user.realname }}</span>
        </Form-item>
        <Form-item label="用户名">
          <span class="color-primary">{{ user.username }}</span>
        </Form-item>
        <Form-item label="原密码" prop="old_password">
          <Input type="password" v-model="form.old_password" autocomplete="off"></Input>
        </Form-item>
        <Form-item label="新密码" prop="new_password">
          <Input type="password" v-model="form.new_password" autocomplete="off"></Input>
        </Form-item>
        <Form-item label="重复新密码" prop="new_password_again">
          <Input type="password" v-model="form.new_password_again" autocomplete="off"></Input>
        </Form-item>
      </Form>
    </app-form-modal>

    <!--管理收藏标签弹出框-->
    <label-modal
      v-model="labelModal"
      @closeLabelModal="labelModal = false"
    ></label-modal>

  </header>
</template>

<script>
/**
 * 应用头部
 * @author lmh
 * @version 2017-06-21 动态化数据，增加切换角色功能
 */

import { mapState, mapGetters } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
import { form } from '@/mixins'
import LabelModal from './components/LabelModal'

export default {
  name: 'app-header',

  mixins: [form],

  components: {
    LabelModal,
  },

  data() {
    return {
      modal: false,
      labelModal: false,

      form: {
        old_password: '',
        new_password: '',
        new_password_again: '',
      },

      rules: {
        old_password: [
          this.$rules.required('密码'),
          this.$rules.length(6, 32),
        ],
        new_password: [
          this.$rules.required('密码'),
          this.$rules.length(6, 32),
        ],
        new_password_again: [
          this.$rules.required('密码'),
          {
            validator: (rule, value, next) => {
              if (value === this.form.new_password) {
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
    ...mapState(['user']),
    ...mapGetters(['currentRole', 'otherRoles']),
  },

  watch: {
    modal() {
      this.formErrors = {}
      this.$refs.form.resetFields()
    },
  },

  methods: {
    // 切换角色
    switchRole(id) {
      this.$store.dispatch(GLOBAL.SWITCH, id)
        .then(() => {
          this.$router.push('/index')
          this.$Message.success({
            content: '角色已切换',
          })
        })
    },

    // 处理用户头像下拉菜单项的点击事件
    handleUserDropDown(name) {
      if (this[name]) {
        this[name]()
      }
    },

    // 弹出修改密码
    editPassword() {
      this.modal = true
    },

    // 修改密码
    submit() {
      this.$http.patch('/auth/change_password', this.form)
        .then(() => {
          this.modal = false
          this.formLoading = false
          this.$Message.info('操作成功')
        })
        .catch(this.errorHandler)
    },

    // 弹出管理收藏标签
    userLabel() {
      this.labelModal = true
    },

    // 登出
    logout() {
      this.$store.dispatch(GLOBAL.LOGOUT)
        .then(() => {
          this.$router.push('/auth/login')
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
    width: 400px;
    margin: 0 auto;
  }
}

.app-logo {
  // width: 30px;
  height: 20px;
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

