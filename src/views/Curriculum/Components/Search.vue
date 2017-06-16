<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Row>
          <Col span="11">
            <Date-picker type="date" v-model="form.start" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" v-model="form.end" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>

      <Form-item prop="start">
        <Input v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>

      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>

    </Form>
  </div>
</template>

<script>
/**
 * 排课管理 - 公用组件 - 班级/非班级搜索
 * @author yangjun
 * @version 2017-06-14
 */

export default {
  name: 'app-arrange-components-search',

  data() {
    return {
      form: {
        keyword: '',
      },
    }
  },

}
</script>

<style>

</style>
