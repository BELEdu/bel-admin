<template>
  <div>
    <!--条件查询模块-->
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em">
          <Option v-for="likeKey in likeKeys"
                  :key="likeKey.value"
                  :value="likeKey.value">{{ likeKey.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="document-text" /> 班级列表</h2>
      </Col>
    </Row>
    <Table class="app-table" :columns="clbumColumns" :data="clbumData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="clbumData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
    <class-student-modal v-model="classModal" :id="currentClbum.class_id"></class-student-modal>
  </div>
</template>

<script>
/**
 * 课程管理 - 班级上课记录
 * @author chenliangshan
 * @version 2017/07/20
 */

import { createButton } from '@/utils'
import { list } from '@/mixins'
import ClassStudentModal from '../../Components/ClassStudentModal'

export default {
  name: 'app-class-record',
  mixins: [list],
  components: { ClassStudentModal },
  data() {
    return {
      // 搜索字段
      likeKeys: [
        { label: '班级名称', value: 'display_name' },
      ],
      likeKey: 'display_name', // 默认模糊字段
      // 班级字段
      clbumColumns: [
        { title: '班级名称',
          align: 'center',
          render: createButton([
            {
              type: 'primary',
              click: (params) => {
                // 查看班级人员信息
                this.classShow(params)
              },
              key: 'class_name',
            },
          ]) },
        { title: '上课日期', key: 'date', align: 'center', sortable: 'custom' },
        { title: '实际课时', key: 'fact_cost', align: 'center', sortable: 'custom' },
        { title: '上课科目', key: 'subject_item_name', align: 'center' },
        { title: '上课年级', key: 'current_grade_name', align: 'center' },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            {
              type: 'primary',
              click: (params) => {
                this.$router.push(`${this.$route.path}/list/${params.id}`)
              },
              text: '查看',
            },
          ]),
        },
      ],
      // 班级数据
      clbumData: {},
      // 班级弹窗-初始化状态
      classModal: false,
      // 当前查看的班级
      currentClbum: {},
    }
  },
  methods: {
    /**
     * 查看班级信息
     * @param row  [object]   当前班级信息
     */
    classShow(row) {
      this.currentClbum = { ...row, class_id: this.$route.params.id }
      this.classModal = true
    },
    // 获取班级数据
    getData(qs) {
      return this.$http.get(`/curricularecord/class/index/${this.$route.params.id}${qs}`)
        .then((data) => {
          this.clbumData = data
        })
    },
  },
}
</script>

<style lang="less">
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
</style>
