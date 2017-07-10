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
        <Select v-model="query.equal.subject_type" style="width:8em;" placeholder="请选择科目" >
          <Option value="语文" >语文</Option>
          <Option value="数学" >数学</Option>
          <Option value="英语" >英语</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>历史计划</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="list.data" border ></Table><!--hdata-->

    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--班级详情组件-->
    <history-modal
      v-model="modal.history"
      @closeClassesModal="modal.history = false"
    >
    </history-modal>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 详情主组件- 历史计划子组件
 * @author zml
 * @version 2017-07-04
 */
import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import HistoryModal from '../components/HistoryModal'
// import hdata from '../Data/hdata'

export default {
  name: 'app-student-studyprogress-detail-history',

  mixins: [list],

  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: [Number, String],
      required: true,
    },
    isStudent: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      likeKeys: [
        { label: '科目', value: 'subject_type' },
      ],
      likeKey: 'subject_type',
      query: {
        equal: {
          subject_type: null,
        },
      },

      columns: [
        { title: '科目', key: 'subject_type', align: 'center' },
        { title: '计划开始时间', key: 'created_at', align: 'center' },
        { title: '计划结束时间', key: 'finished_at', align: 'center' },
        { title: '实际上课课时', key: 'course_cost', align: 'center' },
        { title: '知识点总数', key: 'knowledge_total', align: 'center' },
        {
          title: '操作',
          key: 6,
          align: 'center',
          render: createButton([
            { text: '查看', type: 'primary', click: row => this.openHistoryModal(row.model_id) },
          ]),
        },
      ],

      modal: {
        history: false,
      },

      // hdata,
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.studyprogress.list,
    }),
  },

  methods: {
    openHistoryModal(id) {
      this.modal.history = true
      this.$Message.info(`编号${id}`)
    },
    getData(qs) {
      return this.$store.dispatch(
        STUDENT.STUDYPROGRESS[this.isStudent ? 'STUDENT' : 'CLASSES'].HISTORY.INIT, {
          id: this.id,
          query: qs,
        })
        .then(() => {
          this.$router.push(`/student/studyprogress/${this.type}/${this.id}/history${qs}`)
        })
    },
  },

  components: {
    HistoryModal,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    this.$route.meta.breadcrumb[1].link = `/student/studyprogress/${this.type}`
  },
}
</script>

<style lang="less">
@import "~vars.less";
</style>

