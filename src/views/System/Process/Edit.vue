<template>
    <div>
    <h1 class="app-form-header">
      <Icon type="edit"></Icon>
      {{ this.id ? '编辑流程' : '添加流程' }}
    </h1>

    <Form class="app-form-entire" :model="form" :rules="rules" :label-width="100" ref="form">
      <app-form-alert :errors="formErrors"></app-form-alert>

      <Form-item label="流程名称" prop="display_name">
        <Input placeholder="请输入流程名称" v-model="form.display_name"></Input>
      </Form-item>

      <Form-item label="流程类型" prop="flow_type_id">
        <Select v-model="form.flow_type_id">
          <Option v-for="type in types" :key="type.id" :value="type.id">{{ type.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item label="所属部门" prop="department_id">
        <Select v-model="form.department_id">
          <Option v-for="department in departments" :key="department.id" :value="department.id">{{ department.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item label="申请角色" prop="apply_role_id">
        <Cascader placeholder="请选择申请角色" :data="roles" v-model="form.apply_role_id"></Cascader>
      </Form-item>

      <Form-item label="审批角色" prop="approval_role_ids">
        <div v-for="(role, index) in form.approval_role_ids" :key="role.value" class="multiple-select">
          <Cascader
            placeholder="请选择审批角色" :data="roles" v-model="form.approval_role_ids[index]"
            @on-change="(value, detail) => selectRole(value, detail, index)"
          ></Cascader>
          <Button :class="{hidden: form.approval_role_ids.length <= 1}" type="text" @click="removeRole(index)">删除</Button>
        </div>
      </Form-item>
      <Form-item>
        <Button type="dashed" icon="plus" class="color-primary" size="large" @click="form.approval_role_ids.push([])">
          增加部门角色
        </Button>
      </Form-item>

      <Form-item>
        <Button type="ghost" size="large" @click="goBack">取消</Button>
        <Button type="primary" size="large" @click="beforeSubmit" :loading="formLoading">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 流程管理 - 添加/编辑流程
 * @author lmh
 * @version 2017-07-05
 */

import Vue from 'vue'
import { mapState } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import { getPath } from '@/utils/helpers'

export default {
  name: 'app-system-process-edit',

  mixins: [form, goBack],

  data() {
    return {
      form: {
        display_name: '',
        flow_type_id: null,
        department_id: null,
        apply_role_id: [],
        approval_role_ids: [[]],
        description: '',
      },

      rules: {
        display_name: [
          this.$rules.required('流程名称'),
          this.$rules.length(2, 20),
        ],
        flow_type_id: [
          this.$rules.required('流程类型', 'number', 'change'),
        ],
        department_id: [
          this.$rules.required('所属部门', 'number', 'change'),
        ],
        apply_role_id: [
          this.$rules.required('申请角色', 'array', 'change'),
        ],
        approval_role_ids: [
          this.$rules.required('审批角色', 'array', 'change'),
          {
            validator(rule, value, next) {
              const hasEmpty = value.some(item => item.length === 0)
              if (hasEmpty) {
                next(new Error('审批角色不能有空项'))
              } else {
                next()
              }
            },
          },
        ],
      },
    }
  },

  computed: {
    ...mapState({
      types: state => state.system.data.process.types,
      departments: state => state.system.data.process.departments,
      roles: state => state.system.data.roles,
      rolePaths: state => state.system.data.rolePaths,
    }),

    id() {
      return this.$route.params.id
    },
  },

  methods: {
    getProcess() {
      this.$http.get(`/process/${this.id}`)
        .then((res) => {
          this.form = {
            ...res,
            apply_role_id: getPath(res.apply_role_id, this.rolePaths),
            approval_role_ids: res.approval_role_ids.map(id => getPath(id, this.rolePaths)),
          }
        })
    },

    // 与添加用户时的部门角色字段相似,可查看那边的注释
    selectRole(value, detail, index) {
      const target = detail[detail.length - 1]

      const canNotChoose = target.can_choose === 0
      const hasSelected = this.form.approval_role_ids
        .slice(0, -1)
        .some(role => role[role.length - 1] === target.value)

      if (canNotChoose || hasSelected) {
        Vue.set(this.form.approval_role_ids, index, [])
      }

      if (canNotChoose) {
        this.$Message.error('该部门下暂无角色')
      }
      if (hasSelected) {
        this.$Message.error('请勿重复选择角色')
      }
    },

    removeRole(index) {
      this.form.approval_role_ids.splice(index, 1)
    },

    submit() {
      const { apply_role_id, approval_role_ids } = this.form
      const data = {
        ...this.form,
        apply_role_id: apply_role_id.slice(-1)[0],
        approval_role_ids: approval_role_ids
          .map(item => item.slice(-1)[0]),
      }

      const request = this.id ?
        this.$http.patch(`/process/${this.id}`, data) :
        this.$http.post('/process', data)

      request
        .then(this.successHandler)
        .catch(this.errorHandler)
    },
  },

  created() {
    this.$store.dispatch(SYSTEM.DATA.PROCESS.INIT)
      .then(() => this.$store.dispatch(SYSTEM.DATA.ROLES.INIT))
      .then(() => this.id && this.getProcess())
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>
