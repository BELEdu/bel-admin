<template>
  <main class="commeditor app-form-entire" v-if="fdata">
    <app-editor-title></app-editor-title>
    <Form :label-width="100">
      <Form-item label="学员姓名" required>
        <Input placeholder="请输入学生姓名" v-model="fdata.student_name"></Input>
      </Form-item>
      <Form-item label="手机号码" required>
        <Input placeholder="请输入手机号码" v-model="fdata.mobile"></Input>
      </Form-item>
      <Form-item label="学员性别">
        <Radio-group v-model="fdata.gender">
          <Radio label="1">
            <span>男</span>
          </Radio>
          <Radio label="2">
            <span>女</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="在读学校">
        <Input placeholder="请输入学校名称" v-model="fdata.school_name"></Input>
      </Form-item>
      <Form-item label="年段排名">
        <Input placeholder="请输入年段排名" v-model="fdata.rank"></Input>
      </Form-item>
      <Form-item label="是否偏科">
        <Radio-group v-model="fdata.is_tend_subject">
          <Radio label="1">
            <span>是</span>
          </Radio>
          <Radio label="0">
            <span>否</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="回访时间">
        <Date-picker placeholder="年 / 月 / 日" :editable="false" v-model="fdata.return_visited_at"></Date-picker>
      </Form-item>
      <Form-item label="沟通类型">
        <Select placeholder="请选择......" v-if="communication_type" v-model="fdata.communication_type">
          <Option v-for="item in communication_type" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item label="沟通时间">
        <Date-picker placeholder="年 / 月 / 日" :editable="false" v-model="fdata.communication_at"></Date-picker>
      </Form-item>
      <Form-item label="沟通情况">
        <Input type="textarea" placeholder="请输入......" :rows="6"></Input>
      </Form-item>
      <Form-item>
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 沟通记录 - 记录编辑
 * @author hjz
 * @version 2017-06-07
 */
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { Http } from '@/utils'

export default {
  name: 'CommunicationEdit',

  data: () => ({
    // "取消"按钮行为的路由对象
    backRoute: null,
    // 最终提交给后端的数据
    fdata: null,
    // 提交按钮状态控制
    loading: false,
    // 字典数据
    gender: null,
    communication_type: null,
  }),

  // computed: {
  //   // 绑定到表单的对象
  //   unit: {
  //     get() {
  //       this.fdata = this.$store.state.business.unit
  //       return this.fdata
  //     },
  //     set(value) {
  //       this.fdata = value
  //     },
  //   },
  // },

  computed: {
    unit() {
      return this.$store.state.business.unit
    },
  },

  watch: {
    unit: {
      deep: true,
      handler(nv) { if (nv) this.fdata = { ...nv } },
    },
  },

  created() {
    Http.get('/dict?keys=communication_type')
      .then((res) => { this.communication_type = res.communication_type })
    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route.params.id)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

  beforeRouteEnter(to, from, next) {
    // eslint-disable-next-line
    next((vm) => { vm.backRoute = from })
  },

}
</script>

<style lang="less">

</style>
