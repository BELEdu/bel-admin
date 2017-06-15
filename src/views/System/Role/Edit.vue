<template>
  <Form class="app-form-entire" :model="form" :rules="rules" :label-width="140" ref="form">
    <Form-item label="角色名称" prop="display_name">
      <Input placeholder="请输入角色名称" v-model="form.display_name"></Input>
    </Form-item>
    <Form-item label="角色描述" prop="description">
      <Input type="textarea" placeholder="角色相关描述" v-model="form.description"></Input>
    </Form-item>
    <Form-item label="所属部门" prop="department_id">
      <Cascader :data="data" placeholder="请选择所属部门" v-model="form.department_id"></Cascader>
    </Form-item>
    <Form-item label="角色特性">
      <Checkbox v-model="form.is_student_admin">学员管理</Checkbox>
      <Checkbox v-model="form.is_student_teac">学员授课</Checkbox>
    </Form-item>

    <Form-item label="视图权限">
      <Checkbox-group class="permi-group view-permi" v-model="form.menus">
        <dl v-for="menu in permis.menus" :key="menu.id">
          <dt>
            <Checkbox :label="menu.id" @change.native="menusCheckAll($event, menu.id)">
              <span>{{ menu.display_name }}</span>
            </Checkbox>
          </dt>
          <dd v-for="submenu in menu.children" :key="submenu.id">
            <Checkbox :label="submenu.id" @change.native="menuisCheckAll($event, menu.id)">
              <span>{{ submenu.display_name }}</span>
            </Checkbox>
          </dd>
        </dl>
      </Checkbox-group>
    </Form-item>

    <Form-item label="数据权限">
      <Checkbox-group class="permi-group data-permi" v-model="form.data_auths">
        <Checkbox v-for="item in permis.data_auths" :key="item.id" :label="item.id">
          <span>{{ item.display_name }}</span>
        </Checkbox>
      </Checkbox-group>
    </Form-item>

    <Form-item label="操作权限">
      <!--<div class="operation-permi-title">
        <div>
          <Checkbox @change.native="permissionsToggleAll">
            <span class="operation-permi-title__label">模块</span>
          </Checkbox>
        </div>
        <div>权限</div>
      </div>-->
      <Checkbox-group class="permi-group operation-permi" v-model="form.permissions">
        <dl v-for="item in permis.permissions" :key="item.id">
          <dt>
            <Checkbox :label="item.id" @change.native="permissionsCheckAll($event, item.id)">
              <span>{{ item.display_name }}</span>
            </Checkbox>
          </dt>
          <div>
            <dd v-for="subitem in item.children" :key="subitem.id">
              <Checkbox :label="subitem.id" @change.native="permissionsIsCheckAll($event, item.id)">
                <span>{{ subitem.display_name }}</span>
              </Checkbox>
            </dd>
          </div>
        </dl>
      </Checkbox-group>
    </Form-item>

    <Form-item>
      <Button type="ghost" size="large">取消</Button>
      <Button type="primary" size="large" @click="submit">提交</Button>
    </Form-item>
  </Form>
</template>

<script>
/**
 * 系统管理 - 角色管理 - 创建/编辑角色
 * @author lmh
 * @description 后台返回的数据与前台所需数据格式不符，需要协商解决
 * @version 2017-06-15
 */

import { mapState } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'

export default {
  name: 'app-system-role-edit',

  data() {
    return {
      id: null, // 被编辑条目的id，若id为null，则为新建

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
          { required: true, message: '角色名称必填', trigger: 'blur' },
          { min: 2, max: 12, message: '字符长度应在2到12之间', trigger: 'blur' },
        ],
        description: [
          { max: 100, message: '描述必须在100个字符之内', trigger: 'blur' },
        ],
        department_id: [
          { required: true, message: '所属部门必填', trigger: 'blur' },
        ],
      },

      data: [{
        value: 'beijing',
        label: '北京',
        children: [
          {
            value: 'gugong',
            label: '故宫',
          },
          {
            value: 'tiantan',
            label: '天坛',
          },
          {
            value: 'wangfujing',
            label: '王府井',
          },
        ],
      }],
    }
  },

  computed: {
    ...mapState({
      permis: state => state.system.role.permis,
    }),
  },

  methods: {
    /**
     * 获取所有子级权限的id
     * @description 获取某个类别权限的父级权限下的所有子级权限的id
     * @param {Stirng} type - 权限类别，如'menus'
     * @param {Number} id - 父级权限的id
     * @return {Array}
     */
    getSubids(type, id) {
      return this.permis[type]
        .find(item => item.id === id)
        .children
        .map(subitem => subitem.id)
    },

    // 选中菜单权限的某个父级权限时，如果还没有任何子权限被选中，那么选中父级权限时会同时选中所有子级权限
    menusCheckAll({ target }, pid) {
      if (pid !== 1 && target.checked) {
        const ids = this.getSubids('menus', pid)
        const isUncheckAll = ids
          .every(id => !this.form.menus.includes(id))
        if (isUncheckAll) {
          this.form.menus.push(...ids)
        }
      }
    },

    // 更改菜单权限的某个子级权限时，如果该权限所属的父级权限下的所有子级权限都未勾选，那么取消父级权限的勾选
    menuisCheckAll({ target }, pid) {
      if (!target.checked) {
        const isUncheckAll = this.getSubids('menus', pid)
          .every(id => !this.form.menus.includes(id))
        if (isUncheckAll) {
          this.form.menus = this.form.menus.filter(id => id !== pid)
        }
      }
    },

    // 更改操作权限的某个父级权限时，若父级权限被选中，所有子级权限也被选中，反之亦然
    permissionsCheckAll({ target }, pid) {
      const ids = this.getSubids('permissions', pid)

      if (target.checked) {
        const uncheckedIds = ids
          .filter(id => !this.form.permissions.includes(id))
        this.form.permissions.push(...uncheckedIds)
      } else {
        this.form.permissions = this.form.permissions
          .filter(id => !ids.includes(id))
      }
    },

    // 更改操作权限的某个子级权限时，若该权限的父级权限下有任意权限未勾选，取消父级权限勾选，反之勾选父级权限
    permissionsIsCheckAll({ target }, pid) {
      if (target.checked) {
        const isCheckAll = this.getSubids('permissions', pid)
          .every(id => this.form.permissions.includes(id))
        if (isCheckAll) {
          this.form.permissions.push(pid)
        }
      } else {
        this.form.permissions = this.form.permissions
          .filter(id => id !== pid)
      }
    },

    // 获取当前编辑项的数据
    getDetail(id) {
      return this.$http.get(`/role/${id}`)
        .then((res) => {
          this.form = {
            ...res,
            is_student_admin: !!res.is_student_admin,
            is_student_teac: !!res.is_student_teac,
          }
        })
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const request = this.id ?
            this.$http.patch(`/role/${this.id}`, this.form) :
            this.$http.post('/role', this.form)

          request
            // eslint-disable-next-line
            .catch(console.log)
        }
      })
    },
  },

  created() {
    this.id = this.$router.currentRoute.params.id

    this.$store.dispatch(SYSTEM.ROLE.PERMIS.INIT)
      .then(() => {
        if (this.id) return this.getDetail(this.id)
        return Promise.resolve()
      })
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>

<style lang="less">
@import '~vars';

.permi-group {
  border: 1px solid @border-color-base;

  .ivu-checkbox-group-item {
    margin: 0;
    line-height: normal;
  }
}

.view-permi {
  display: flex;
  text-align: center;

  & > dl {
    flex: calc(100% / 8);

    &:not(:last-child) {
      border-right: 1px solid @border-color-base;
    }

    & > dt {
      border-bottom: 1px solid @border-color-base;
    }
  }
}

.data-permi {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 0;

  .ivu-checkbox-group-item {
    flex-basis: 25%;
    padding: 5px 10px;
  }
}

.operation-permi-title {
  display: flex;

  & .ivu-checkbox-wrapper {
    margin: 0;
  }

  &__label {
    display: inline-block;
    width: 4em;
  }

  & > div {
    padding: 0 15px;
    border-width: 1px 1px 0 0;
    border-style: solid;
    border-color: @border-color-base;

    &:first-child {
      border-width: 1px 1px 0 1px;
    }

    &:last-child {
      flex: auto;
      text-align: center;
    }
  }
}

.operation-permi {
  & > dl {
    display: flex;
    flex-wrap: wrap;

    &:not(:last-child) {
      border-bottom: 1px solid @border-color-base;
    }

    & > dt {
      align-self: center;
      padding: 0 15px;
    }

    & > div {
      flex: auto;
      display: flex;
      border-left: 1px solid @border-color-base;

      & > dd {
        flex-basis: 25%;
        padding: 5px 10px;
      }
    }
  }
}

// 兼容ie

</style>
