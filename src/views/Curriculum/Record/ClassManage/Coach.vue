<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
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

    <Table class="app-table" :columns="coachColumns" :data="coachData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="coachData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--查看-->
    <student-list-modal v-model="coachModal"
                        :okBtn="false"
                        cancel-value="关闭">
      <template slot="header">
        <span>班级：{{currentCoachInfo.display_name}}</span>
        <span>学员个数：{{currentCoachInfo.student_count}}</span>
        <span>班主任：{{currentCoachInfo.head_teacher}}</span>
      </template>
      <Table class="app-table" :columns="currentCoachColumns" :data="currentCoachData.data" border></Table>
    </student-list-modal>
  </div>
</template>
<script>
  /**
   * 上课记录-晚辅导
   * @author  chenliangshan
   * @version    2017/07/13
   */

  import { list } from '@/mixins'
  import StudentListModal from '../../Components/StudentListModal'

  export default{
    name: 'app-coach-record-manage',

    mixins: [list],

    components: { StudentListModal },

    data() {
      return {
        // 搜索字段
        likeKeys: [
          { label: '班级名称', value: 'display_name' },
        ],
        likeKey: 'display_name', // 默认模糊字段
        // 查看弹窗-初始化
        coachModal: false,
        // 晚辅导字段
        coachColumns: [
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
                    self.coachStudentShow(params)
                  },
                },
              }, '查看')
            },
          },
        ],
        // 班级数据
        coachData: {},
        // 当前查看数据
        currentCoachInfo: {},
        currentCoachData: {},
        currentCoachColumns: [
          { title: '序号', type: 'index', align: 'center', width: 50 },
          {
            title: '学员名称',
            align: 'center',
          },
          {
            title: '学员编号',
            align: 'center',
          },
          {
            title: '是否上课',
            align: 'center',
          },
        ],
      }
    },

    methods: {
      // 获取班级上课记录
      getData(qs) {
        return this.$http.get(`/curricularecord/student/index/${this.$route.params.id}${qs}`)
          .then((data) => {
            this.coachData = data
          })
      },
      /**
       * 查看
       * @param params
       */
      coachStudentShow(params) {
        this.currentCoachInfo = params.row
        this.coachModal = true
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
  .modal-default-btn {
    text-align: center;
    > button {
      + button {
        margin-left: 16%;
      }
    }
  }
</style>
