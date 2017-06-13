<template>
  <main class="hotlineeditor app-form-entire" v-if="fdata">
    <app-editor-title></app-editor-title>
    <Form :label-width="130">
      <Form-item label="来访时间" required>
        <Date-picker placeholder="年 - 月 - 日" v-model="fdata.visited_at" formate="yyyy-MM-dd" type="date"></Date-picker>
      </Form-item>
      <Form-item label="家长姓名" required>
        <Input placeholder="请输入家长姓名" v-model="fdata.elder_name"></Input>
      </Form-item>
      <Form-item label="学员姓名">
        <Input placeholder="请输入学员姓名" v-model="fdata.student_name"></Input>
      </Form-item>
      <Form-item label="家长手机号码" required>
        <Input placeholder="请输入家长手机号码" v-model="fdata.mobile"></Input>
      </Form-item>
      <Form-item label="选择地区">
        <!--地区接口还未确定 -->
        <Cascader :data="map" trigger="hover"></Cascader>
      </Form-item>
      <Form-item label="当前年级">
        <Select placeholder="请选择......" v-model="fdata.grade">
          <Option v-if="grade" v-for="item in grade" :value="item.value">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item label="邀约咨询师">
        <Select placeholder="请选择......" v-model="fdata.invited_teacher_id">
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
          <Option value="4">丁</Option>
        </Select>
      </Form-item>
      <Form-item label="市场专员">
        <Input placeholder="请输入市场专员" v-model="fdata.market_staff_name"></Input>
      </Form-item>
      <Form-item label="在读学校">
        <Input placeholder="请输入在读学校名称" v-model="fdata.school_name"></Input>
      </Form-item>
      <Form-item label="二次上门日期">
        <Date-picker placeholder="年 / 月 / 日" v-model="fdata.return_visited_at"></Date-picker>
      </Form-item>
      <Form-item>
        <Button @click.stop="cancel">取消</Button>
        <Button type="primary" @click.stop="submit" :loading="loading">提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 热线登记 - 热线编辑
 * @author hjz
 * @version 2017-06-06
 */

/**
 * @todo 根据后端口完成组件
 * 1. 根据api字段，绑定数据data
 * 2. 获取store的值进行渲染（添加/修改）
 * 3. 将提交后的数据传入store，成功后跳回index组件
 */

import map from '@/views/Business/casdata'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { mapState } from 'vuex'
import { Http } from '@/utils'

export default {
  name: 'hotline-editor',

  data: () => ({
    // 添加/修改的数据对象
    fdata: null,
    // 提交按钮状态控制
    loading: false,
    // 表单预置数据
    map,
    grade: null,
  }),

  methods: {
    submit() {
      const fdata = this.fdata
      this.loading = true
      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.UPDATE, { id, fdata })
          .then(() => { this.loading = false; this.cancel() })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.cancel() })
      }
    },
    cancel() {
      this.$router.push('/business/hotline')
    },
  },

  computed: {
    ...mapState({
      unit: state => state.business.unit,
    }),
  },

  watch: {
    unit: {
      deep: true,
      handler(nv) {
        if (nv) this.fdata = nv
      },
    },
  },

  created() {
    // 请求表单字典数据
    Http.get('/dict?keys=grade&')
      .then((res) => { this.grade = res.grade })
    // 初始化表单
    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route.params.id)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">

</style>
