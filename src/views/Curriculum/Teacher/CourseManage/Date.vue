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
                    :width="800"
                    :cancel-value="courseModalParam.cancelValue"
                    :ok-value="courseModalParam.okValue"
                    :ok-btn="courseModalParam.okBtn"
                    @on-ok="submit">
      <app-form-alert :errors="formErrors"></app-form-alert>
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
                          {{formItem.model_info.display_name}}
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
                          {{formItem.subject_type}}
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
                          <app-dicts-filter :value="formItem.grade" name="grade"></app-dicts-filter>
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
                          {{formItem.date}}
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
                          {{formItem.start_at}}-{{formItem.end_at}}
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
                          {{formItem.course_cost}}
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
            <Row>
              <Col span="20">
              <template v-if="knowledgeModal">
                <!--选择知识点-->
                <app-knowledge-tree
                  :data="baseData" v-model="form.points"
                  @select="data => selectedData = data"
                ></app-knowledge-tree>
              </template>
              <template v-else>
                <!--展示知识点-->
                <Tag type="dot" color="yellow" v-for="(item,index) in knowledgeData" :key="index" :name="index" closable @on-close="removeknowledge">{{item.name}}</Tag>
              </template>
              </Col>
              <Col span="1">&nbsp;</Col>
              <Col span="3">
              <Button type="primary"
                      @click="editKnowledge('save')"
                      v-if="knowledgeModal">确认知识点</Button>
              <Button icon="edit" type="info"
                      @click="editKnowledge" v-else>修改知识点</Button>
              </Col>
            </Row>

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
        courseModalParam: {
          okValue: '确认上课',
          okBtn: true,
          cancelValue: '取消',
        },
        knowledgeModal: false,
        knowledgeData: [{
          id: 1,
          name: '平等分',
        }, {
          id: 2,
          name: '平等分2',
        }],
        formErrors: {},
        // 弹窗数据
        formItem: {
          model_info: {},
          subject_type: null,
          grade: null,
          date: null,
          start_at: null,
          end_at: null,
          course_cost: null,
        },
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
              const status = params.row.schedule_status
              if (status === 0 || status === 1) {
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
                        self.openCourseModal('edit', params.row)
                      },
                    },
                  }, '编辑'),
                  h('Button', {
                    class: 'color-error',
                    props: {
                      type: 'text',
                      size: 'small',
                    },
                    on: {
                      click() {
                        // 取消
                        self.cancelCurriculum(params.row)
                      },
                    },
                  }, '取消'),
                ])
              } else if (status === 3) {
                // 已取消
                return h('div', [
                  h('span', {
                    class: 'color-cancel',
                  }, '已取消'),
                ])
              }
              // 完成上课
              return h('div', [
                h('span', {
                  class: 'color-success ',
                }, '完成上课'),
              ])
            },
          },
        ],
        // 日课表数据
        dailyData: {},
        baseData: [{
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }, {
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }, {
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }, {
          expand: true,
          title: '平行线',
          children: [
            { title: '平行线' },
            { title: '同位角、内错角、同旁内角' },
            { title: '平行线的判定' },
            { title: '平行线的性质' },
            { title: '圆形的平移' },
          ],
        }],
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
      // 打开编辑|添加课表弹窗
      openCourseModal(type, item) {
        this.formErrors = {}
        this.formItem = { ...this.formItem, ...item }
        this.courseModalParam.id = item.id
        this.courseModal = true
      },
      // 取消排课
      cancelCurriculum(item) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否确认取消该排课？',
          onOk: () => {
            this.$http.post(`/teachercurricula/cancel/${item.id}`)
              .then(() => {
                this.$Message.success('该排课成功取消')
              })
          },
          onCancel: () => {
            // this.$Message.info('点击了取消')
          },
        })
      },
      // 删除知识点
      removeknowledge(event, name) {
        this.knowledgeData.splice(name, 1)
      },
      // 编辑知识点
      editKnowledge(type) {
        switch (type) {
          case 'save': {
            this.knowledgeModal = false
            break
          }
          default : {
            this.knowledgeModal = true
            break
          }
        }
      },
      // 确认上课
      submit() {
        this.$http.post(`/teachercurricula/confirm/${this.courseModalParam.id}`)
          .then(() => {
            this.$Message.success({
              content: '该排课成功确定上课',
              onClose() {
                this.getData()
              },
            })
          })
          .catch((errors) => {
            this.errorHandler(errors)
          })
      },
      // 错误信息提示
      errorHandler({ errors, message }) {
        if (errors) {
          this.formErrors = errors
        } else {
          this.formErrors = { error: [message, '服务端错误，请联系网站管理员或稍后重试'] }
        }
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
