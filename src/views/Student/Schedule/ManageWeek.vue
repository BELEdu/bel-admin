<template>
  <div class="manage-week">
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em;">
          <Option v-for="key in likeKeys" :key="key.value" :value="key.value">{{ key.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Date-picker
          v-model="query[`equal[course_date]`]"
        ></Date-picker>
      </Form-item>
      <Form-item>
        <Select v-model="query[`equal[course_status]`]" placeholder="请选择状态" style="width:9em;">
          <Option value="">全部</Option>
          <Option :value="0">未计划</Option>
          <Option :value="1">计划中</Option>
          <Option :value="3">已取消</Option>
          <Option :value="4">已结束</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="ios-browsers"/> 教师课表</h2>
      </Col>
    </Row>
  </div>
</template>

<script>
  /**
   * 教师课表-周课表
   * @author chenliangshan
   * @version 2017-10-19
   */

  import { mapState } from 'vuex'
  import { list } from '@/mixins'
  import { STUDENT } from '@/store/mutationTypes'

  export default {
    name: 'manage-week',

    mixins: [list],

    data() {
      return {
        likeKeys: [
          { label: '班级名称', value: 'classes_name' },
          { label: '排课专员', value: 'customer_relationships_name' },
        ],

        likeKey: 'classes_name',

        query: {
          'equal[course_date]': null,
          'equal[course_status]': null,
        },
      }
    },

    computed: {
      ...mapState({
        weeklyList: state => state.student.schedule.weekList,
      }),
    },

    methods: {
      // 获取班级周课表数据
      getData(qs) {
        return this.$store.dispatch(STUDENT.SCHEDULE.WEEK_LIST, `${this.$route.params.id}${qs}`)
      },
    },
  }
</script>

<style lang="less" scoped>
  .manage-week {

  }
</style>
