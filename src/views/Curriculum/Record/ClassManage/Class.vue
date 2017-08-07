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
      <h2><Icon type="document-text" /> 班级列表</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="classColumns" :data="classData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="classData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--编写评价弹窗-->
    <appraise-single-modal :show.sync="appraiseSingleShow"
                           :config="singleModal.config"
                           :data="currentAppraiseInfo"
                           @on-close="updateData"></appraise-single-modal>
    <!--查看评价弹窗-->
    <appraise-mult-modal :show.sync="appraiseShow"
                         :config="multModalConfig"
                         :header="modalHeader"
                         :id="multModalData.student_id"></appraise-mult-modal>
  </div>
</template>
<script>
  /**
   * 上课记录-班级-学员列表
   * @author  chenliangshan
   * @version    2017/07/13
   */

  import { list } from '@/mixins'
  import AppraiseSingleModal from '../../Components/AppraiseSingleModal'
  import AppraiseMultModal from '../../Components/AppraiseMultModal'

  export default{
    name: 'app-student-record-manage',
    mixins: [list],
    components: { AppraiseSingleModal, AppraiseMultModal },
    data() {
      return {
        // 搜索字段
        likeKeys: [
          { label: '学员姓名', value: 'display_name' },
          { label: '学员编号', value: 'number' },
          { label: '产品名称', value: 'product_name' },
        ],
        likeKey: 'display_name', // 默认模糊字段
        // 弹窗-初始化
        appraiseSingleShow: false,
        appraiseShow: false,
        singleModal: {
          defConf: {
            okBtn: true,
            cancelValue: '取消',
          },
          config: {},
        },
        multModalConfig: {},
        multModalData: {
          schedule_id: parseInt(this.$route.params.id, 10),
          student_id: null,
        },
        // 查看所有评价
        appraiseData: {},
        // 编写|查看单项评价
        appraiseSingleData: [],
        // 班级字段
        classColumns: [
          { title: '学员姓名', key: 'display_name', align: 'center', width: 160 },
          { title: '学员编号', align: 'center', width: 160, key: 'number', sortable: 'custom' },
          { title: '产品名称', key: 'product_name', align: 'center' },
          { title: '签约课时', key: 'course_total', align: 'center', width: 80 },
          { title: '剩余课时', key: 'course_remain', align: 'center', width: 80 },
          {
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              const self = this
              let txt = '未评价'
              let className = 'primary'
              if (params.row.comment_tag) {
                txt = '已评价'
                className = 'success'
              }
              return h('div', [
                h('Button', {
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
                }, txt),
                h('Button', {
                  class: 'color-primary',
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click() {
                      // 查看全部评价
                      self.getAppraiseInfo(params)
                    },
                  },
                }, '查看全部评价'),
              ])
            },
          },
        ],
        // 班级数据
        classData: {},
        // 当前评价信息
        currentAppraiseInfo: {
          schedule_id: parseInt(this.$route.params.id, 10),
          student_id: null,
        },
        modalHeader: [],
      }
    },
    methods: {
      // 获取班级上课记录
      getData(qs) {
        return this.$http.get(`/curricularecord/schedule/${this.multModalData.schedule_id}/comment${qs}`)
          .then((data) => {
            this.classData = data
          })
      },
      // 获取查看所有评价
      getAppraiseInfo(params) {
        this.multModalData = {
          ...this.multModalData,
          ...params.row,
          student_id: params.row.id,
        }
        this.modalHeader = [
          { label: '学员姓名', value: this.multModalData.display_name },
        ]
        this.multModalConfig.getInfoUrl = `/curricularecord/history/${this.multModalData.student_id}/class/${this.$route.params.classId}`
        this.appraiseShow = true
      },
      /**
       * 编写|查看评价
       * @param params
       */
      appraiseWrite(params) {
        this.currentAppraiseInfo = {
          ...this.currentAppraiseInfo,
          ...params.row,
          student_id: params.row.id,
        }
        const currentStudent = params.row.display_name
        let config = {
          title: '写评价',
        }
        if (params.row.comment_tag) {
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
