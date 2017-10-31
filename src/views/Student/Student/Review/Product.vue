<template>
  <div class="student-product">

    <!-- 关键字搜索 -->
    <Form inline class="app-search-form">
      <Form-item>
        <Input
          v-model="likeValue"
          placeholder="请输入关键字"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width:7em;"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>

      <!-- 签约日期 -->
      <Form-item>
        <Date-picker
          v-model="query['between[contract_date]']"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="请选择签约日期"
        ></Date-picker>
      </Form-item>

      <!-- 搜索按钮 -->
      <Form-item>
        <Button
          type="primary"
          icon="ios-search"
          @click="search"
        >搜索</Button>
      </Form-item>
    </Form>

    <!-- 信息 -->
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2>签约产品</h2>
      </Col>
    </Row>

    <!-- 签约产品表格 -->
    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

    <!-- 分页 -->
    <app-pager
      :data="list"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 消耗日志弹窗 -->
    <expend-modal
      v-model="modal.expend"
      :data="data"
      :name="name"
      @closeExpendModal="modal.expend = false"
    ></expend-modal>

  </div>
</template>

<script>

import { mapState } from 'vuex'
import { STUDENT } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import ExpendModal from '../components/ExpendModal'

export default {
  name: 'app-student-student-product',

  mixins: [list],

  components: {
    ExpendModal,
  },

  data() {
    return {
      likeKeys: [
        { label: '产品名称', value: 'product_name' },
        { label: '产品编号', value: 'product_number' },
        { label: '审批编号', value: 'contract_number' },
      ],
      likeKey: 'product_name',
      query: {
        'between[contract_date]': [],
      },

      columns: [
        { title: '审批编号', key: 'contract_number', align: 'center', width: 120 },
        { title: '产品编号', key: 'product_number', align: 'center', width: 120 },
        { title: '产品名称', key: 'product_name', align: 'center', width: 280 },
        { title: '课时', key: 'total', align: 'center', width: 80 },
        { title: '剩余课时', key: 'remain', align: 'center', width: 80 },
        {
          title: '耗课单价',
          key: 'salary',
          align: 'center',
          render: (h, params) => { // 剩余课时小于10的时候变红
            const { salary } = params.row
            return h('span', `￥${salary}`)
          },
        },
        { title: '签约校区', key: 'school_name', align: 'center' },
        { title: '签约人', key: 'username', align: 'center' },
        { title: '签约日期', key: 'contract_date', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: 100,
          render: createButton([
            { text: '课时消耗', type: 'primary', click: row => this.openExpendModal(row.id, row.product_name) },
          ]),
        },
      ],

      modal: { // 模态框状态
        expend: false,
      },

      data: [], // 消耗日志数据（弹窗用）
      name: '', // 产品名称（弹窗用）
    }
  },

  computed: {
    ...mapState({
      list: state => state.student.student.product_list,
    }),

    id() {
      return +this.$router.currentRoute.params.id
    },
  },

  methods: {
    getData(qs) { // 获取列表数据
      return this.$store.dispatch(STUDENT.STUDENT.PRODUCT.INIT, {
        id: this.id,
        query: qs,
      })
    },

    openExpendModal(id, name) { // 打开消耗日志弹窗
      this.$http.get(`/student/stock_mark/${id}`)
      // this.$http.get('/student/stock_mark/5')
        .then((res) => {
          this.data = res
          this.name = name
          this.modal.expend = true
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },
  },

  created() {

  },

}
</script>

<style>

</style>
