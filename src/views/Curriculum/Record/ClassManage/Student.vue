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
      <h2><Icon type="document-text" /> 学员列表</h2>
      </Col>
      <Col>
      <Button type="primary" @click="getAppraiseInfo" v-if="studentData.data">查看评价</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="studentColumns" :data="studentData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="studentData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--编写评价弹窗-->
    <appraise-single-modal :show.sync="appraiseSingleShow"
                           :config="singleModal.config"
                           :data="currentAppraiseInfo"
                           @on-close="updateData"></appraise-single-modal>

    <!--查看评价弹窗-->
    <appraise-mult-modal :show.sync="appraiseShow"
                         :config="multModalConfig"
                         :header="modalHeader"
                         :id="this.multModalData.student_id"
                         :data="multModalData"></appraise-mult-modal>
  </div>
</template>
<script>
/**
 * 上课记录-学员
 * @author    chenliangshan
 * @version   2017/07/20
 */

import { list } from '@/mixins'
import AppraiseSingleModal from '../../Components/AppraiseSingleModal'
import AppraiseMultModal from '../../Components/AppraiseMultModal'

export default{
  name: 'app-student-record-manage',
  mixins: [list],
  components: { AppraiseMultModal, AppraiseSingleModal },
  data() {
    return {
      // 搜索字段
      likeKeys: [
        { label: '学员姓名', value: 'display_name' },
        { label: '学员编号', value: 'number' },
        { label: '教师姓名', value: 'teacher_name' },
        { label: '上课科目', value: 'subject_item_name' },
        { label: '学管师', value: 'counsellor_name' },
      ],
      likeKey: 'display_name', // 默认模糊字段
      // 弹窗-初始化
      appraiseSingleShow: false,
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
      multModalData: {
        student_id: parseInt(this.$route.params.id, 10),
        schedule_id: null,
      },
      // 查看所有评价
      appraiseData: {},
      // 编写|查看单项评价
      appraiseSingleData: [],
      // 学员字段
      studentColumns: [
        { title: '学员姓名', key: 'student_name', align: 'center' },
        { title: '学员编号', key: 'student_number', align: 'center', sortable: 'custom' },
        { title: '教师姓名', key: 'teacher_name', align: 'center', width: 120 },
        { title: '上课日期', key: 'date', align: 'center', width: 90 },
        { title: '上课时段',
          align: 'center',
          width: 110,
          render: (h, params) => h('span', {}, `${params.row.start_at} - ${params.row.end_at}`),
        },
        { title: '实际课时', key: 'fact_cost', align: 'center', width: 80 },
        { title: '上课年级', key: 'current_grade_name', align: 'center' },
        { title: '产品名称', key: 'product_name', align: 'center' },
        { title: '学管师', key: 'counsellor_name', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: 110,
          render: (h, params) => {
            const self = this
            let txt = '写评价'
            let className = 'primary'
            if (params.row.comment_tag) {
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
      currentAppraiseInfo: {
        student_id: parseInt(this.$route.params.id, 10),
        schedule_id: null,
      },
      // 分页数据-默认分页数据
      pagerConfig: {
        page: 1,
        per_page: 10,
      },
      modalHeader: [],
    }
  },
  methods: {
    // 获取学员上课记录
    getData(qs) {
      return this.$http.get(`/curricularecord/student/index/${this.$route.params.id}${qs}`)
        .then((data) => {
          this.studentData = data
        })
    },
    // 获取查看所有评价
    getAppraiseInfo() {
      if (this.studentData.data) {
        this.multModalData = {
          ...this.multModalData,
          ...this.studentData.data[0],
          schedule_id: this.studentData.data[0].id,
        }
        this.modalHeader = [
          { label: '学员姓名', value: this.multModalData.student_name },
          { label: '学管师', value: this.multModalData.counsellor_name },
        ]
        this.multModalConfig.getInfoUrl = `/curricularecord/history/${this.multModalData.student_id}/class`
        this.appraiseShow = true
      } else {
        this.$Modal.warning({ content: '暂无上课记录' })
      }
    },
    /**
     * 编写|查看评价
     * @param params
     */
    appraiseWrite(params) {
      this.currentAppraiseInfo = {
        ...this.currentAppraiseInfo,
        ...params.row,
        schedule_id: params.row.id,
      }
      const currentStudent = params.row.student_name
      let config = {
        title: '写评价',
      }
      if (params.row.comment_count > 0) {
        config = {
          okBtn: false,
          cancelValue: '关闭',
          title: '查看评价',
        }
      }
      config.title = `${config.title} (学员姓名：${currentStudent})`
      this.singleModal.config = Object.assign({}, this.singleModal.defConf, config)
      this.appraiseSingleShow = true
    },
  },
}
</script>
