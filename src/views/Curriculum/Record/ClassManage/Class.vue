<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="keyword">
        <Input v-model="form.keyword" placeholder="请输入关键词"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Table class="app-table" :columns="classColumns" :data="classData.data" border></Table>
    <app-pager :data="classData" @on-change="getPageData" @on-page-size-change="getPerPageData"></app-pager>

    <!--编写评价弹窗-->
    <appraise-single-modal v-model="appraiseSingleModal"
                           :config="singleModal.config"
                           :data="currentAppraiseInfo"></appraise-single-modal>
  </div>
</template>
<script>
  /**
   * 上课记录-班级
   * @author  chenliangshan
   * @update    2017/06/23
   */

  import { GLOBAL } from '@/store/mutationTypes'
  import AppraiseSingleModal from '../../Components/AppraiseSingleModal'

  export default{
    name: 'app-student-record-manage',
    components: { AppraiseSingleModal },
    data() {
      return {
        // 弹窗-初始化
        appraiseSingleModal: false,
        appraiseShow: false,
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
        multModalConfig: {},
        multModalData: {},
        // 查看所有评价
        appraiseData: {},
        // 编写|查看单项评价
        appraiseSingleData: [],
        // 搜索字段
        form: {
//        startTime: '',
//        endTime: '',
//        keyword: '',
//        subject: '',
//        status: '',
        },
        // 班级字段
        classColumns: [
          { title: '班级名称',
            align: 'center',
            width: 120,
            render: (h, params) => h('span', {}, params.row.model_info.display_name) },
          { title: '班级人数（个）',
            align: 'center',
            width: 120,
            render: (h, params) => h('span', {}, params.row.model_info.student_total) },
          { title: '教师姓名', key: 'teacher_name', align: 'center', width: 100 },
          { title: '上课日期', key: 'date', align: 'center', width: 80 },
          { title: '上课时段',
            align: 'center',
            width: 110,
            render: (h, params) => h('span', {}, `${params.row.start_at}-${params.row.end_at}`),
          },
          { title: '计划课时', key: 'course_cost', align: 'center', width: 80 },
          { title: '实际课时', key: 'fact_cost', align: 'center', width: 80 },
          {
            title: '上课科目',
            align: 'center',
            width: 110,
            render: (h, params) => {
              const grade = this.$store.state.dicts.grade
              const name = grade.filter(item => item.value === params.row.subject_type)
              return h('span', {}, `${name[0].display_name}`)
            },
          },
          {
            title: '上课年级',
            align: 'center',
            width: 110,
            render: (h, params) => {
              const grade = this.$store.state.dicts.grade
              const name = grade.filter(item => item.value === params.row.grade)
              return h('span', {}, `${name[0].display_name}`)
            },
          },
          { title: '产品名称', key: 'product_name', align: 'center' },
          {
            title: '操作',
            align: 'center',
            width: 110,
            render: (h, params) => {
              const self = this
              let txt = '写评价'
              let className = 'primary'
              if (params.row.comment_count > 0) {
                txt = '已评价'
                className = 'success'
              }
              return h('Button', {
                class: `color-${className}`,
                props: {
                  type: 'text',
                  size: 'small',
                },
                on: {
                  click() {
                    // 写评价
                    self.appraiseWrite(params)
                  },
                },
              }, txt)
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
    mounted() {
      this.getClassData()
    },
    methods: {
      /**
       * 获取班级上课记录
       * @param pageData  分页信息
       */
      getClassData(pageData = this.pagerConfig) {
        this.$store.commit(GLOBAL.LOADING.SHOW)
        this.$http.get(`/curricularecord/student/index/${this.$route.params.id}?page=${pageData.page}&per_page=${pageData.per_page}`)
          .then((data) => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
            this.classData = data
          })
      },
      /**
       * 班级上课记录分页事件
       * @param pageId  页码
       */
      getPageData(pageId = 1) {
        this.pagerConfig = Object.assign({}, this.pagerConfig, { page: pageId })
        this.getClassData(this.pagerConfig)
      },
      /**
       * 班级上课记录每页条数事件
       * @param perPage  每页条数
       */
      getPerPageData(perPage = 1) {
        this.pagerConfig = Object.assign({}, this.pagerConfig, { per_page: perPage })
        this.getClassData(this.pagerConfig)
      },
      // 获取查看所有评价
      getAppraiseInfo() {
        this.multModalData = this.classData.data[0]
        this.appraiseShow = true
      },
      /**
       * 编写|查看评价
       * @param params
       */
      appraiseWrite(params) {
        this.currentAppraiseInfo = params.row
        let config = {}
        if (params.row.comment_count > 0) {
          config = {
            okBtn: false,
            cancelValue: '关闭',
            title: '查看评价',
          }
        }
        this.singleModal.config = Object.assign({}, this.singleModal.defConf, config)
        this.appraiseSingleModal = true
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
