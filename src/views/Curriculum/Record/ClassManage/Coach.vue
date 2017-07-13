<template>
  <div>
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
      <h2><Icon type="document-text" /> 晚辅导列表</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="classColumns" :data="classData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="classData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--查看-->
    <Modal v-model="coashModal"
           @on-close="updateData"></Modal>
  </div>
</template>
<script>
  /**
   * 上课记录-晚辅导
   * @author  chenliangshan
   * @version    2017/07/13
   */

  import { list } from '@/mixins'

  export default{
    name: 'app-coach-record-manage',
    mixins: [list],
    data() {
      return {
        // 搜索字段
        likeKeys: [
          { label: '班级名称', value: 'display_name' },
        ],
        likeKey: 'display_name',  // 默认模糊字段
        // 弹窗-初始化
        coashModal: false,
        singleModal: {
          defConf: {
            okBtn: true,
            cancelValue: '取消',
            title: '写评价',
            type: 'class',
            width: 800,
          },
          config: {},
        },
        // 晚辅导字段
        classColumns: [
          { title: '班级名称',
            align: 'center',
            render: (h, params) => h('span', {}, params.row.model_info.display_name) },
          { title: '学员人数（个）',
            align: 'center',
            width: 130,
            key: 'number',
            sortable: 'custom',
            render: (h, params) => h('span', {}, params.row.model_info.number) },
          { title: '上课日期', key: 'date', align: 'center' },
          { title: '上课时段',
            align: 'center',
            render: (h, params) => h('span', {}, `${params.row.start_at}-${params.row.end_at}`),
          },
          { title: '实际课时', key: 'fact_cost', align: 'center', width: 80 },
          {
            title: '是否全部上课',
            align: 'center',
            width: 100,
            render: (h, params) => h('span', {}, `${params.is_attend}`),
          },
          {
            title: '操作',
            align: 'center',
            width: 110,
            render: (h, params) => {
              const self = this
              return h('Button', {
                class: 'color-primary',
                props: {
                  type: 'text',
                  size: 'small',
                },
                on: {
                  click() {
                    // 查看
                    self.coashStudentShow(params)
                  },
                },
              }, '查看')
            },
          },
        ],
        // 班级数据
        classData: {},
        // 当前评价信息
        currentAppraiseInfo: {},
        // 分页数据-默认分页数据
        pagerConfig: {
          page: 1,
          per_page: 10,
        },
      }
    },
    methods: {
      // 获取班级上课记录
      getData(qs) {
        return this.$http.get(`/curricularecord/student/index/${this.$route.params.id}${qs}`)
          .then((data) => {
            this.classData = data
          })
      },
      // 获取查看所有评价
      getAppraiseInfo() {
        this.multModalData = this.classData.data[0]
        this.appraiseShow = true
      },
      /**
       * 查看
       * @param params
       */
      coashStudentShow(params) {
        this.currentAppraiseInfo = params.row
        this.coashModal = true
      },
    },
  }
</script>

<style lang="less" scoped>
  .app-search-form {
    margin-bottom: 20px;
  }
  .student-modal-content {
    padding: 0 20px;
    margin: 0 auto;
  }
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
</style>
