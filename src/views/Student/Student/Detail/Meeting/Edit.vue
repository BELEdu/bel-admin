<template>
  <div>
    <app-editor-title></app-editor-title>
    <Form :label-width="130" class="app-form-entire">
      <Form-item label="会议时间" required>
        <Date-picker type="date" placeholder="请选择会议的时间"></Date-picker>
      </Form-item>
      <Form-item label="家长">
        <Input placeholder="请输入家长姓名"></Input>
      </Form-item>
      <Form-item label="与会人员">
        <Input placeholder="请输入与会人员"></Input>
      </Form-item>
      <Form-item label="会议类型" required>
        <Select placeholder="请选择会议类型...">
          <Option value="1">课前交流会</Option>
          <Option value="2">学情分析会</Option>
          <Option value="3">家长座谈会</Option>
        </Select>
      </Form-item>
      <Form-item label="学科水平" >
        <Input type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="学员基本信息及学科水平介绍（咨询师）"></Input>
      </Form-item>
      <Form-item label="沟通交流情况" >
        <Input type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="沟通交流（学管师）"></Input>
      </Form-item>
      <Form-item label="备课建议" >
        <Input type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="第一次备课、上课的注意事项及建议"></Input>
      </Form-item>
      <Form-item  >
        <Upload
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </Form-item>
      <Form-item>
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 交流会 - 编辑
 * @author zml
 * @version 2017-06-14
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-student-detail-meeting-edit',

  data() {
    return {

    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

}
</script>

<style <style lang="less">

</style>
