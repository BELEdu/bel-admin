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
          <Option value="1">全部</Option>
          <Option value="2">待确认</Option>
          <Option value="3">已排定</Option>
          <Option value="4">已取消</Option>
          <Option value="5">已上课</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="end">
      <Col>
      <Button type="primary" @click="addCourseModal" v-if="currentTab.id == '1'">添加课表</Button>
      <Button type="primary" @click="$router.push('/curriculum/student/timetable/2')">打印</Button>
      </Col>
    </Row>

    <Tabs type="card" :animated="false" @on-click="tabSwitch">
      <Tab-pane label="日课表" name="1">
        <Table class="app-table" :columns="dailyColumns" :data="dailyData.data" border></Table>
        <app-pager :data="dailyData" @on-change="getPageData" @on-page-size-change="getPerPageData"></app-pager>
      </Tab-pane>
      <Tab-pane label="周课表" name="2">
        <Weekly-table :data="weeklyData"></Weekly-table>
      </Tab-pane>
    </Tabs>

    <!--添加课表弹窗-->
    <app-form-modal v-model="courseModal"
                    title="学员排课"
                    :closable="false"
                    :loading="false"
                    :width="500">
      <div class="student-modal-content">
        <Form :model="formItem" :label-width="80">
          <Form-item label="教师名称：">
            <Select v-model="formItem.teacher_name" placeholder="请选择">
              <Option value="1">张三</Option>
              <Option value="2">李四</Option>
            </Select>
          </Form-item>
          <Form-item label="上课科目：">
            <Select v-model="formItem.subjects_class" placeholder="请选择">
              <Option value="1">语文</Option>

              <Option value="2">数学</Option>
            </Select>
          </Form-item>
          <Form-item label="上课年级：">
            <Select v-model="formItem.grade_class" placeholder="请选择">
              <Option value="1">七年级</Option>
              <Option value="2">八年级</Option>
            </Select>
          </Form-item>
          <Form-item label="产品名称：">
            <Select v-model="formItem.product_name" placeholder="请选择">
              <Option value="1">奥数提高</Option>
              <Option value="2">冲刺</Option>
            </Select>
          </Form-item>
          <Form-item label="选择课时：">
            <Select v-model="formItem.plan_class" placeholder="请选择">
              <Option value="1">第1节</Option>
              <Option value="2">第2节</Option>
            </Select>
          </Form-item>
          <Form-item label="上课日期：">
            <Date-picker type="date" placeholder="选择日期" v-model="formItem.class_date"></Date-picker>
          </Form-item>
          <Form-item label="上课时段：">
            <Time-picker confirm type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px" v-model="formItem.class_time"></Time-picker>
          </Form-item>
          <Form-item label="学馆师：">{{formItem.customer_teacher}}</Form-item>
        </Form>
      </div>
    </app-form-modal>
  </div>
</template>

<script>
  /**
   * 学员排课表
   * @author  chenliangshan
   * @update    2017/06/18
   */

  import { GLOBAL } from '@/store/mutationTypes'
  import AppFormModal from '@/components/AppFormModal'
  import WeeklyTable from '../../Components/WeeklyTable'

  export default{
    name: 'app-student-course-manage',
    components: { AppFormModal, WeeklyTable },
    data() {
      return {
        // 课表弹窗-初始化
        courseModal: false,
        // 弹窗数据
        formItem: {},
        // 当前标签
        currentTab: {
          id: '1',
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
          { title: '班级名称', key: 'class_name', align: 'center' },
          { title: '学员人数（个）', key: 'student_count', align: 'center', width: 80 },
          { title: '教师姓名', key: 'teacher_name', align: 'center', width: 100 },
          { title: '上课日期', key: 'class_date', align: 'center', width: 80 },
          { title: '上课时段', key: 'class_time', align: 'center', width: 110 },
          { title: '计划课时', key: 'plan_class', align: 'center', width: 80 },
          { title: '实际课时', key: 'actual_class', align: 'center', width: 80 },
          { title: '上课科目', key: 'subjects_class', align: 'center' },
          { title: '上课年级', key: 'grade_class', align: 'center' },
          { title: '产品名称', key: 'product_name', align: 'center' },
          { title: '知识点', key: 'language_points', align: 'center' },
          { title: '课时状态',
            key: 'status_class',
            align: 'center',
            width: 80,
            render: (h, params) => {
              let name
              let styleName
              switch (params.row.status_class) {
                case '1':
                  name = '已上课'
                  styleName = '66bae5'
                  break
                case '2':
                  name = '已排定'
                  styleName = 'e5bb79'
                  break
                case '3':
                  name = '待确认'
                  styleName = 'e47fa9'
                  break
                default :
                  name = '已取消'
                  styleName = 'cccccc'
                  break
              }
              return h('span', {
                style: `color:#${styleName}`,
              }, name)
            },
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
        // 周课表字段
        weeklyColums: [],
        // 周课表数据
        weeklyData: {},
        // 分页数据
        pager: {
          // 默认分页数据
          defaultPage: {
            page: 1,
            per_page: 10,
          },
          // (日课表)分页数据
          daily: {},
          // (周课表)分页数据
          weekly: {},
        },
      }
    },
    mounted() {
      this.tabSwitch()
    },
    methods: {
      /**
       * 标签切换事件
       * @param id  [string]  1-> 日课表 2-> 周课表
       * @returns {*}
       */
      tabSwitch(id = '1') {
        this.currentTab.id = id
        this.$store.commit(GLOBAL.LOADING.SHOW)
        // id为标签
        if (id === '2') {
          return this.getWeeklyData()
        }
        return this.getDailyData()
      },
      /**
       * 获取班级日课表数据
       * @param pageData  分页信息
       */
      getDailyData(pageData = this.pager.defaultPage) {
        this.$http.get(`/curriculum/student/clbumDailyProgramData.json?page=${pageData.page}&per_page=${pageData.per_page}`)
          .then((data) => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
            this.dailyData = data
          })
      },
      /**
       * 获取班级周课表数据
       * @param pageData  分页信息
       */
      getWeeklyData(pageData = this.pager.defaultPage) {
        this.$http.get(`/curriculum/student/weeklyProgramData.json?page=${pageData.page}&per_page=${pageData.per_page}`)
          .then((data) => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
            this.weeklyData = data
          })
      },
      /**
       * 日课表分页事件
       * @param pageId  页码
       */
      getPageData(pageId = 1) {
        const pageInfo = Object.assign({}, this.pager.defaultPage, { page: pageId })
        this.getDailyData(pageInfo)
      },
      /**
       * 日课表每页条数事件
       * @param perPage  每页条数
       */
      getPerPageData(perPage = 1) {
        const pageInfo = Object.assign({}, this.pager.defaultPage, { per_page: perPage })
        this.getDailyData(pageInfo)
      },
      // 添加课表
      addCourseModal() {
        this.formItem = {}
        this.courseModal = true
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
  .student-modal-content {
    width: 300px;
    margin: 0 auto;
  }
</style>
