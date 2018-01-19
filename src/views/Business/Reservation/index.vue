<template>
  <div class="reservation">

    <!-- 搜索栏 -->
    <App-table-form @on-submit="search">

      <!-- 关键字检索 -->
      <Form-item>
        <Input placeholder="搜索关键字" v-model="likeValue">
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width: 7em"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.field_name"
              :value="likeKey.field_name"
            >
              {{ likeKey.display_name }}
            </Option>
          </Select>
        </Input>
      </Form-item>

      <!-- 预约时间 -->
      <Form-item>
        <app-date-picker
          v-model="query['between[date]']"
          format="yyyy-MM-dd"
          type="datetimerange"
          placeholder="请选择预约时间"
        ></app-date-picker>
      </Form-item>

      <!-- 预约年段 -->
      <Form-item>
        <Select
          v-model="query[`equal[grade]`]"
          clearable
          placeholder="选择预约年级"
          style="width:9em;"
        >
          <Option
            v-for="grade in grades"
            :value="grade.value"
            :key="grade.value"
          >
            {{grade.display_name}}
          </Option>
        </Select>
      </Form-item>

      <!-- 预约学科 -->
      <Form-item>
        <Select
          v-model="query[`equal[subject]`]"
          clearable
          placeholder="选择预约学科"
          style="width:9em;"
        >
          <Option
            v-for="subject in subjects"
            :value="subject.value"
            :key="subject.value"
          >
            {{subject.display_name}}
          </Option>
        </Select>
      </Form-item>

      <!-- 预约类型 -->
      <Form-item>
        <Select
          v-model="query[`equal[reservation_type]`]"
          clearable
          placeholder="选择预约类型"
          style="width:9em;"
        >
          <Option
            v-for="item in reservationType"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>

      <!-- 预约状态 -->
      <Form-item>
        <Select
          v-model="query[`equal[reservation_state]`]"
          clearable
          placeholder="选择预约状态"
          style="width:9em;"
        >
          <Option
            v-for="item in reservationState"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>

    </App-table-form>

    <!-- 标题 -->
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="ios-lightbulb"/> 预约记录</h2>
      </Col>
    </Row>

    <!--列表-->
    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

    <!--分页-->
    <app-pager
      :data="list"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 反馈弹窗 -->
    <EditModal
      :visible.sync="editModal.visible"
      :data="editModal.data"
      :operation-data="reservationOperation"
       @update="fetchData"
    ></EditModal>

  </div>
</template>

<script>
/**
 * 业务管理 - 预约记录
 * @author zhoumenglin
 * @version 2018-01-18
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { BUSINESS } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import EditModal from './components/EditModal'

export default {
  name: 'business-reservation',

  mixins: [list],

  components: {
    EditModal,
  },

  data() {
    return {
      likeKeys: [], // 关键字搜索取before接口
      likeKey: '',
      query: {
        'equal[grade]': null,
        'equal[subject]': null,
        'equal[reservation_type]': null,
        'equal[reservation_state]': null,
        'between[date]': [],
      },

      columns: [
        {
          title: '学员姓名',
          key: 'student_name',
          align: 'center',
        },
        {
          title: '手机号码',
          key: 'phone',
          align: 'center',
        },
        {
          title: '预约年级',
          key: 'grade_name',
          align: 'center',
        },
        {
          title: '预约学科',
          key: 'user_label_ids',
          align: 'center',
          render: (h, { row }) => h('span',
            row.subjects
              .map(subject => subject.subject_name)
              .join('，'),
          ),
        },
        {
          title: '预约类型',
          key: 'reservation_type_name',
          align: 'center',
        },
        {
          title: '预约时间',
          key: 'date',
          align: 'center',
        },
        {
          title: '反馈',
          key: 'reservation_state_name',
          align: 'center',
        },
        {
          title: '反馈内容',
          key: 'subjects',
          align: 'center',
          render: (h, params) => {
            const { operation_content } = params.row
            return h('div',
              {
                domProps: {
                  innerHTML: operation_content
                    .map(content => `<div>${content}</div>`)
                    .join(''),
                },
              },
            )
          },
        },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 180,
          render: createButton([
            {
              text: '反馈',
              type: 'primary',
              click: row => this.openEditModal(row),
            },
          ]),
        },
      ],

      reservationType: [], // 预约类型
      reservationState: [], // 预约状态
      reservationOperation: [], // 反馈类型（编辑弹窗用）

      grades: [], // 年级
      subjects: [], // 学科

      editModal: {
        visible: false, // 弹窗控制
        data: {},
      },

    }
  },

  computed: {
    ...mapState({
      list: state => state.business.reservation.list,
    }),
  },

  methods: {
    getBeforeData() {
      this.$http.get('/reservation/index_before')
        .then(({
          reservation_operation,
          reservation_state,
          reservation_type,
          search_fields,
          grade,
          subject,
        }) => {
          this.reservationOperation = reservation_operation
          this.reservationState = reservation_state
          this.reservationType = reservation_type
          this.likeKeys = search_fields
          this.likeKey = search_fields[0].field_name
          this.grades = grade
          this.subjects = subject
        })
    },

    getData(qs) {
      return this.$store.dispatch(BUSINESS.RESERVATION.INIT, qs)
    },

    // 打开编辑弹窗
    openEditModal(row) {
      this.editModal.data = { ...row }
      this.editModal.visible = true
    },
  },

  created() {
    this.getBeforeData()
  },

}
</script>

<style>

</style>
