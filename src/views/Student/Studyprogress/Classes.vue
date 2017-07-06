<template>
  <div>

    <Form inline class="app-search-form">
      <Form-item>
        <Input type="text" v-model="formSearch.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>学习进度</h2>
      </Col>
    </Row>

     <Table class="app-table" :columns="columns" :data="list.data" border ></Table><!--sdata-->

    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--班级详情组件-->
    <classes-modal
      v-model="modal.classes"
      @closeClassesModal="modal.classes = false"
      :classesData="classesData"
      :displayName="display_name"
      :studentTotal="student_total"
      :gradeName="grade_name"
      :classesDirector="classes_director"
    >
    </classes-modal>
  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 班级进度列表
 * @author zml
 * @version 2017-07-01
 */
import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
// import cdata from './Data/cdata'
import csdata from './Data/csdata'
import ClassesModal from './components/ClassesModal'

export default {
  name: 'app-student-studyprogress-classes',

  mixins: [list],

  data() {
    return {
       // 搜索栏配置
      formSearch: {
        keyword: '',
      },

      modal: {
        classes: false,
      },

       // 表格配置
      columns: [
        {
          title: '班级',
          key: 'display_name',
          align: 'center',
          render: createButton([
            {
              type: 'primary',
              click: row => this.openClassesModal(
                row.id,
                row.display_name,
                row.student_total,
                row.grade_name,
                row.classes_director,
              ),
              key: 'display_name',
            },
          ]),
        },
        { title: '学员人数（个）', key: 'student_total', align: 'center' },
        { title: '当前年级', key: 'grade_name', align: 'center' },
        { title: '班主任', key: 'classes_director', align: 'center' },
        {
          title: '课时',
          key: 'class',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { class_now, class_total } = params.row
            const text = `总课时：${class_total}`
             // eslint-disable-next-line
            const percent = class_total === 0 ? 0 : Math.round(class_now / class_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
        {
          title: '学习知识点进度',
          key: 'point',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { point_now, point_total } = params.row
            const text = `总知识点：${point_total}个`
             // eslint-disable-next-line
            const percent = point_total === 0 ? 0 : Math.round(point_now / point_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 300,
          render: createButton([
            { text: '学习进度', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/progress`) },
            { text: '编辑计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/plan`) },
            { text: '添加计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/add`) },
            { text: '历史计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/history`) },
          ]),
        },
      ],

      // cdata,

      query: {}, // 分页配置

      classesData: csdata, // 班级详情假数据
      display_name: '', // 班级名
      student_total: 0, // 学员个数
      grade_name: '', // 当前年级
      classes_director: '', // 班主任
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.studyprogress.list,
    }),
  },

  methods: {
    openClassesModal(id, display_name, student_total, grade_name, classes_director) {
      // 这里到时候获取接口数据传入组件
      this.modal.classes = true
      this.display_name = display_name
      this.student_total = student_total
      this.grade_name = grade_name
      this.classes_director = classes_director
    },

    getData(qs) {
      this.$store.dispatch(STUDENT.STUDYPROGRESS.CLASSES.INIT, qs)
        .then(() => {
          this.$router.push(`/student/studyprogress/classes${qs}`)
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
    },
  },

  components: {
    ClassesModal,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
