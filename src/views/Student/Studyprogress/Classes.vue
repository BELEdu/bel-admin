<template>
  <div>

    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:7em;">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>学习进度</h2>
      </Col>
    </Row>

     <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--班级详情组件-->
    <classes-modal
      v-model="modal.classes"
      @closeClassesModal="modal.classes = false"
      :classesData="classesData"
      :displayName="display_name"
      :studentTotal="student_total"
      :classesDirectorName="classes_director_name"
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
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
// import cdata from './Data/cdata'
// import csdata from './Data/csdata'
import ClassesModal from './components/ClassesModal'

export default {
  name: 'app-student-studyprogress-classes',

  mixins: [list],

  data() {
    return {

      likeKeys: [
        { label: '班级名称', value: 'display_name' },
        { label: '产品名称', value: '' },
        { label: '产品类型', value: '' },
        { label: '班主任', value: 'classes_director_name' },
      ],
      likeKey: 'display_name',
      query: {},

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
                row.classes_director_name,
              ),
              key: 'display_name',
            },
          ]),
        },
        { title: '学员人数（个）', key: 'student_total', align: 'center', sortable: 'custom' },
        { title: '产品名称', key: 'product_name', align: 'center' },
        { title: '产品类型', key: 'product_type_id_name', align: 'center' },
        { title: '班主任', key: 'classes_director_name', align: 'center' },
        {
          title: '计划课时',
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
            { text: '学习进度', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/progress`), isShow: ({ row }) => row.is_history },
            { text: '编辑计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/plan`), isShow: ({ row }) => row.is_history },
            { text: '添加计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/add`) },
            { text: '历史计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/classes/${row.id}/history`), isShow: ({ row }) => row.is_history },
          ]),
        },
      ],

      modal: {
        classes: false,
      },

      // cdata,

      classesData: [], // 班级详情假数据
      display_name: '', // 班级名
      student_total: 0, // 学员个数
      classes_director_name: '', // 班主任
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.studyprogress.list,
    }),
  },

  methods: {
    openClassesModal(id, display_name, student_total, classes_director_name) {
      // 这里到时候通过传入的id获取班级学员接口数据传入组件
      this.modal.classes = true
      this.display_name = display_name
      this.student_total = student_total
      this.classes_director_name = classes_director_name
      this.$http.get(`/studentprogress/classes/${id}`)
        .then((res) => {
          this.classesData = res.data
        })
    },

    getData(qs) {
      return this.$store.dispatch(STUDENT.STUDYPROGRESS.CLASSES.INIT, qs)
    },
  },

  components: {
    ClassesModal,
  },

}
</script>

<style lang="less">
@import '~vars';
</style>
