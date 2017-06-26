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

    <Form-item label="数据权限">
      <Checkbox-group class="permi-group data-permi" v-model="form.data_auths">
        <Checkbox v-for="item in data_auths" :key="item.id" :label="item.id">
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
      <Checkbox-group class="permi-group permission-table" v-model="form.permissions">
        <dl v-for="permission in permissions" :key="permission.id">
          <dt>
            <Checkbox :label="permission.id">
              <span>{{ permission.display_name }}</span>
            </Checkbox>
          </dt>
          <div class="permission-table__items">
            <dd v-for="item in permission.children" :key="item.id">
              <dl>
                <dt>
                  <Checkbox :label="item.id">
                    <span>{{ item.display_name }}</span>
                  </Checkbox>
                </dt>
                <div class="permission-table__sub-items">
                  <dd v-for="subItem in item.children" :key="subItem.id">
                    <Checkbox :label="subItem.id">
                      <span>{{ subItem.display_name }}</span>
                    </Checkbox>
                  </dd>
                </div>
              </dl>
            </dd>
          </div>
        </dl>
      </Checkbox-group>
    </Form-item>

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
 * @description 后台返回的数据与前台所需数据格式不符，需要协商解决
 * @version 2017-06-22
 */

import { GLOBAL } from '@/store/mutationTypes'
import { transform, generatePaths, getPath } from '../utils'

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

<style lang="less">
@import '~vars';

.permi-group {
  border: 1px solid @border-color-base;

  .ivu-checkbox-group-item {
    margin: 0;
    line-height: normal;
  }
}

.data-permi {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 0;

  .ivu-checkbox-group-item {
    flex-basis: 25%;
    padding: 5px 15px;
  }
}

.permission-table {
  @padding: 5px 15px;
  @border: 1px solid @border-color-base;

  dl {
    display: flex;

    &:not(:last-child) {
      border-bottom: @border;
    }

    & > dt {
      flex: none;
      align-self: center;
      padding: @padding;
    }
  }

  &__items {
    flex: auto;
    border-left: @border;

    & > dd {
      flex: none;

      &:not(:last-child) {
        dl {
          border-bottom: @border;
        }
      }

      dt {
        width: 9em;
      }
    }
  }

  &__sub-items {
    display: flex;
    flex-wrap: wrap;
    padding: @padding;
    border-left: @border;

    & > dd {
      margin-right: 10px;
    }
  }
}

// 兼容ie
.ie {
  .permission-table {
    dl {
      overflow: hidden;

      & > dt {
        display: inline-block;
        width: 8em;
        vertical-align: middle;
        margin-right: -4px;
        text-align: center;
      }
    }

    &__items {
      display: inline-block;
      width: calc(~"100% - 8em");
      vertical-align: middle;
      margin-right: -4px;
    }

    &__sub-items {
      display: inline-block;
      width: calc(~"100% - 9em");
      vertical-align: middle;
      margin-right: -4px;

      & > dd {
        float: left;
      }
    }
  }
}
</style>
