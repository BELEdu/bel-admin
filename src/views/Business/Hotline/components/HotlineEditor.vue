<template>
  <main class="hotlineeditor app-form-entire">
    <app-editor-title></app-editor-title>
    <Form :label-width="130">
      <Form-item label="来访时间" required>
        <Date-picker placeholder="年 / 月 / 日"></Date-picker>
      </Form-item>
      <Form-item label="家长姓名" required>
        <Input placeholder="请输入家长姓名"></Input>
      </Form-item>
      <Form-item label="学员姓名">
        <Input placeholder="请输入学员姓名"></Input>
      </Form-item>
      <Form-item label="家长手机号码" required>
        <Input placeholder="请输入家长手机号码"></Input>
      </Form-item>
      <Form-item label="选择地区">
        <Cascader :data="casdata" trigger="hover"></Cascader>
      </Form-item>
      <Form-item label="市场专员">
        <Select placeholder="请选择......">
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
          <Option value="4">丁</Option>
        </Select>
      </Form-item>
      <Form-item label="邀约咨询师">
        <Select placeholder="请选择......">
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
          <Option value="4">丁</Option>
        </Select>
      </Form-item>
      <Form-item label="市场专员">
        <Input placeholder="请输入市场专员"></Input>
      </Form-item>
      <Form-item label="在读学校">
        <Input placeholder="请输入在读学校名称"></Input>
      </Form-item>
      <Form-item label="二次上门日期">
        <Date-picker placeholder="年 / 月 / 日"></Date-picker>
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

import casdata from '@/views/Business/casdata'
import { GLOBAL, BIZ } from '@/store/mutationTypes'
import { mapState } from 'vuex'

export default {
  name: 'hotline-editor',

  data: () => ({
    // @param {type: Object} data 添加/修改的数据对象
    casdata,
    loading: false,
  }),

  methods: {
    submit() {
      const data = this.data
      this.loading = true
      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BIZ.UPDATE, { id, data })
          .then(() => { this.loading = false; this.cancel() })
      } else {
        this.$store.dispatch(BIZ.CREATE, data)
          .then(() => { this.loading = false; this.cancel() })
      }
    },
    cancel() {
      this.$router.push('/business/hotline')
    },
  },

  computed: {
    ...mapState({
      unit: state => state.biz.unit,
    }),
  },

  watch: {
    unit(nv) {
      if (nv) this.data = nv
    },
  },

  created() {
    // this.$store.dispatch(BIZ.EDIT, this.this.$route.params.id)
    //   .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
