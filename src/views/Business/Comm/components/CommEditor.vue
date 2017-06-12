<template>
  <main class="commeditor app-form-entire">
    <app-editor-title></app-editor-title>
    <Form label-width="100">
      <Form-item label="学员姓名" required>
        <Input placeholder="请输入学生姓名"></Input>
      </Form-item>
      <Form-item label="手机号码" required>
        <Input placeholder="请输入手机号码"></Input>
      </Form-item>
      <Form-item label="学员性别">
        <Radio-group v-model="gender">
          <Radio label="male">
            <span>男</span>
          </Radio>
          <Radio label="female">
            <span>女</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="在读学校">
        <Input placeholder="请输入学校名称"></Input>
      </Form-item>
      <Form-item label="年段排名">
        <Input placeholder="请输入年段排名"></Input>
      </Form-item>
      <Form-item label="是否偏科">
        <Radio-group v-model="sideBranche">
          <Radio label="true">
            <span>是</span>
          </Radio>
          <Radio label="false">
            <span>否</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="回访时间">
        <Date-picker placeholder="年 / 月 / 日"></Date-picker>
      </Form-item>
      <Form-item label="沟通类型">
        <Select>
          <Option value="5">甲类</Option>
          <Option value="6">乙类</Option>
          <Option value="7">丙类</Option>
          <Option value="8">丁类</Option>
        </Select>
      </Form-item>
      <Form-item label="沟通时间">
        <Date-picker placeholder="年 / 月 / 日"></Date-picker>
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
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'comm-editor',

  data: () => ({
    gender: undefined,
    sideBranche: undefined,
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
