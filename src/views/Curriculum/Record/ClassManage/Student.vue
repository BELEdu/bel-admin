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

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="end">
      <Col>
      <Button type="primary" @click="getAppraiseInfo" v-if="studentData.data">查看评价</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="studentColumns" :data="studentData.data" border></Table>
    <app-pager :data="studentData" @on-change="getPageData" @on-page-size-change="getPerPageData"></app-pager>

    <!--编写评价弹窗-->
    <appraise-single-modal v-model="appraiseSingleModal"
                           :config="singleModal.config"
                           :data="currentAppraiseInfo"></appraise-single-modal>

    <!--查看评价弹窗-->
    <appraise-mult-modal v-model="appraiseShow"
                         :config="multModalConfig"
                         :data="multModalData"></appraise-mult-modal>
  </div>
</template>
<script>
/**
 * 上课记录-学员
 * @author  chenliangshan
 * @update    2017/06/22
 */

import { GLOBAL } from '@/store/mutationTypes'
import AppraiseSingleModal from '../../Components/AppraiseSingleModal'
import AppraiseMultModal from '../../Components/AppraiseMultModal'

export default{
  name: 'app-student-record-manage',
  components: { AppraiseMultModal, AppraiseSingleModal },
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
      // 学员字段
      studentColumns: [
        { title: '学员姓名',
          align: 'center',
          width: 120,
          render: (h, params) => h('span', {}, params.row.model_info.display_name) },
        { title: '学员编号',
          align: 'center',
          render: (h, params) => h('span', {}, `${params.row.model_info.number}`) },
        { title: '教师姓名', key: 'teacher_name', align: 'center', width: 120 },
        { title: '上课日期', key: 'date', align: 'center', width: 90 },
        { title: '上课时段',
          align: 'center',
          width: 110,
          render: (h, params) => h('span', {}, `${params.row.start_at}-${params.row.end_at}`),
        },
        { title: '实际课时', key: 'fact_cost', align: 'center', width: 80 },
        { title: '上课年级',
          align: 'center',
          render: (h, params) => h('app-dicts-filter', { props: { value: params.row.grade, name: 'grade' } }) },
        { title: '产品名称', key: 'product_name', align: 'center' },
        { title: '学管师', key: 'belong_customer_relationships', align: 'center' },
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
      // 学员数据
      studentData: {},
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
    this.getStudentData()
  },
  methods: {
    /**
     * 获取学员上课记录
     * @param pageData  分页信息
     */
    getStudentData(pageData = this.pagerConfig) {
      this.$store.commit(GLOBAL.LOADING.SHOW)
      this.$http.get(`/curricularecord/student/index/${this.$route.params.id}?page=${pageData.page}&per_page=${pageData.per_page}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
          this.studentData = data
        })
    },
    /**
     * 学员上课记录分页事件
     * @param pageId  页码
     */
    getPageData(pageId = 1) {
      this.pagerConfig = Object.assign({}, this.pagerConfig, { page: pageId })
      this.getStudentData(this.pagerConfig)
    },
    /**
     * 学员上课记录每页条数事件
     * @param perPage  每页条数
     */
    getPerPageData(perPage = 1) {
      this.pagerConfig = Object.assign({}, this.pagerConfig, { per_page: perPage })
      this.getStudentData(this.pagerConfig)
    },
    // 获取查看所有评价
    getAppraiseInfo() {
      this.multModalData = this.studentData.data[0]
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
