<template>
  <Modal v-model="visible"
         :loading="false"
         :width="800">
    <p slot="header" class="modal-header">
      <span>学员姓名：{{data.model_info.display_name}}</span>
      <span>学管师：{{data.teacher_name}}</span>
    </p>
    <ul class="student-appraise">
      <li v-for="item in appraiseMultData.data">
        <Row>
          <Col span="8">
            <label class="title">上课日期：</label>
            <span>{{item.schedule.date}}</span>
          </Col>
          <Col span="8">
            <label class="title">上课时段：</label>
            <span>{{item.schedule.start_at}}-{{item.schedule.end_at}}</span>
          </Col>
          <Col span="8">
            <label class="title">实际上课课时：</label>
            <span>{{item.schedule.fact_cost}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <label class="title">教师姓名：</label>
            <span>{{item.schedule.teacher_name}}</span>
          </Col>
          <Col span="8">
            <label class="title">上课科目：</label>
            <span>{{getGrade(item.schedule.subject_type)}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Input v-model="item.comment" type="textarea" :autosize="{minRows: 4,maxRows: 6}" readonly></Input>
          </Col>
        </Row>
      </li>
    </ul>
    <div slot="footer">
      <Page :total="appraiseMultData.total" size="small" placement="top" show-total show-elevator show-sizer @on-change="getPageData" @on-page-size-change="getPerPageData"></Page>
    </div>
  </Modal>
</template>

<script>
  /**
   * 学员-所有评价弹窗
   */

  export default{
    name: 'appraise-mult-modal',
    props: {
      // 弹窗状态
      value: {
        type: Boolean,
        default: false,
      },
      // 弹窗配置参数
      config: {
        type: Object,
        default: {},
      },
      // 所选项数据
      data: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        // 评价内容数据
        appraiseMultData: [],
        // 分页数据-默认分页数据
        pagerConfig: {
          page: 1,
          per_page: 10,
        },
        visible: this.value,
      }
    },
    methods: {
      // 获取该学员的所有评价内容
      getAppraise(pageData = this.pagerConfig) {
        this.$http.get(`/curricularecord/show_list/${this.data.id}?page=${pageData.page}&per_page=${pageData.per_page}`)
          .then((data) => {
            this.appraiseMultData = data
          })
      },
      /**
       * 分页事件
       * @param pageId  页码
       */
      getPageData(pageId = 1) {
        this.pagerConfig = Object.assign({}, this.pagerConfig, { page: pageId })
        this.getAppraise(this.pagerConfig)
      },
      /**
       * 每页条数事件
       * @param perPage  每页条数
       */
      getPerPageData(perPage = 1) {
        this.pagerConfig = Object.assign({}, this.pagerConfig, { per_page: perPage })
        this.getAppraise(this.pagerConfig)
      },
      // 获取科目
      getGrade(id) {
        return this.$store.state.dicts.grade.filter(item => item.value === id)[0].display_name
      },
    },
    watch: {
      value(val) {
        this.visible = val
      },
      visible(val) {
        if (val === false) {
          this.$emit('input', false)
        } else {
          this.getAppraise({ page: 1, per_page: 10 })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
  .student-appraise {
    & > li {
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 14px;
      padding: 10px;
      margin-bottom: 10px;
      label,span {
        display: inline-block;
        line-height: 30px;
      }
    }
  }
  .app-page {
    padding-bottom: 0
  }
</style>
