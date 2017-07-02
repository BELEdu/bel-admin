<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="startTime">
        <Date-picker type="date" v-model="form.startTime" placeholder="开始时间"></Date-picker>
      </Form-item>
      <Form-item prop="endTime">
        <Date-picker type="date" v-model="form.endTime" placeholder="结束时间"></Date-picker>
      </Form-item>
      <Form-item prop="keyword">
        <Input v-model="form.keyword" placeholder="请输入关键词"></Input>
      </Form-item>
      <Form-item>
        <Select v-model="form.subject">
          <Option value="1">全部</Option>
          <Option value="2">英语</Option>
          <Option value="3">数字</Option>
          <Option value="4">语文</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="form.status">
          <Option value="">全部</Option>
          <Option value="0">待确认</Option>
          <Option value="1">已排定</Option>
          <Option value="2">已上课</Option>
          <Option value="3">已取消</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="end">
      <Col>
      <Button type="primary" @click="$router.push('/curriculum/student/timetable/2')">打印</Button>
      </Col>
    </Row>
    <Table class="app-table" :columns="dailyColumns" :data="dailyData.data" border></Table>
    <app-pager :data="dailyData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--添加课表弹窗-->
    <app-form-modal v-model="courseModal"
                    title="排课情况"
                    :closable="false"
                    :loading="false"
                    :width="800">
      <div class="teacher-modal-content">
        <div class="app-table ivu-table-wrapper">
          <div class="ivu-table ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <colgroup>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col>
                </colgroup>
                <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row">
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>教学对象</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          李佳航
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>上课科目</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          数学
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>上课年级</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          七年级
                        </span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>上课日期</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          2017-06-06
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>上课时段</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          19：00-20：00
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>排课人</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          张旭
                        </span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>上课节数</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          第 1 节
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          <strong>计划课时</strong>
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span>
                          1
                        </span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span></span>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                        <span></span>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="points">
          <h3 class="title">知识点</h3>
        </div>
      </div>
    </app-form-modal>
  </div>
</template>

<script>
  /**
   * 教师排课-日课表
   * @author  chenliangshan
   * @update    2017/07/01
   */

  import { GLOBAL } from '@/store/mutationTypes'
  import { list } from '@/mixins'
  import WeeklyTable from '../../Components/WeeklyTable'

  export default{
    name: 'app-teacher-course-date',
    mixins: [list],
    components: { WeeklyTable },
    data() {
      return {
        // 课表弹窗-初始化
        courseModal: false,
        // 弹窗数据
        formItem: {},
        // 搜索字段
        form: {
//        startTime: '',
//        endTime: '',
//        keyword: '',
//        subject: '',
//        status: '',
        },
        // 日课表字段
        dailyColumns: [
          { title: '教师姓名', key: 'teacher_name', align: 'center' },
          { title: '教学对象',
            align: 'center',
            width: 110,
            render: (h, params) => h('span', {}, `${params.row.model_info.display_name}`) },
          { title: '上课日期', key: 'date', align: 'center', width: 100 },
          { title: '上课时段',
            align: 'center',
            width: 110,
            render: (h, params) => h('span', {}, `${params.row.start_at}-${params.row.end_at}`),
          },
          { title: '计划课时', key: 'course_cost', align: 'center', width: 110 },
          { title: '实际课时', key: 'fact_cost', align: 'center', width: 80 },
          { title: '上课科目', key: 'subject_type', align: 'center', width: 80 },
          { title: '上课年级',
            align: 'center',
            width: 110,
            render: (h, params) => h('app-dicts-filter', { props: { value: params.row.grade, name: 'grade' } }),
          },
          { title: '产品名称', key: 'product_name', align: 'center' },
          { title: '学管师', key: 'belong_customer_relationships', align: 'center' },
          { title: '课时状态',
            align: 'center',
            width: 80,
            render: (h, params) => h('app-dicts-filter', { props: { value: params.row.schedule_status } }),
          },
          {
            title: '操作',
            align: 'center',
            width: 110,
            render: (h, params) => {
              const self = this
              if (params.row) {
                return h('div', [
                  h('Button', {
                    class: 'color-primary',
                    props: {
                      type: 'text',
                      size: 'small',
                    },
                    on: {
                      click() {
                        // 编辑
                        self.formItem = params.row
                        self.courseModal = true
                      },
                    },
                  }, '编辑'),
                  h('Button', {
                    class: 'color-cancel',
                    props: {
                      type: 'text',
                      size: 'small',
                    },
                    on: {
                      click() {
                        // 取消
                        self.cancelCurriculum()
                      },
                    },
                  }, '取消'),
                ])
              }
              return h('div', [
                h('Button', {
                  class: 'table-btn color-primary',
                  props: {
                    icon: 'thumbsup',
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click() {
                      // 回调
                      window.console.log(params)
                    },
                  },
                }),
              ])
            },
          },
        ],
        // 日课表数据
        dailyData: {},
      }
    },
    methods: {
      /**
       * 获取教师日课表数据
       * @param pageData  分页信息
       */
      getData() {
        this.$http.get(`/teachercurricula/${this.$route.params.id}${this.qs}`)
          .then((data) => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
            this.dailyData = data
          })
      },
      // 取消排课
      cancelCurriculum() {
        this.$Modal.confirm({
          title: '提示',
          content: '是否确认取消该排课？',
          onOk: () => {
            this.$Message.info('点击了确定')
          },
          onCancel: () => {
            this.$Message.info('点击了取消')
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .ivu-tabs, .ivu-table {
    overflow: visible;
  }
  .teacher-modal-content {
    padding: 0 20px;
  }
  .points {
    h3 {
      font-size: 14px;
      margin: 0;
      padding: 20px 0;
    }
  }
</style>
