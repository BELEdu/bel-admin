<template>
  <div>

    <Tabs class="app-tabs" type="card" @on-click="tabSelect">
      <Tab-pane label="暂时没有该学员的知识点详情" v-if="editInfo.length===0"></Tab-pane>
      <Tab-pane v-for="item in editInfo" :key="item.id" :label="`${item.subject_type_name}`"></Tab-pane>
      <div slot="extra">
        <Tag type="dot" color="blue"><b>学员姓名</b>： {{display_name}} </Tag>
        <Tag type="dot" color="yellow"><b>学员编号</b>： {{number}} </Tag>
      </div>
    </Tabs>

    <!-- 饼图 -->
    <Row>
      <Col span="12">
        <app-echarts :set-option="weekKnowledgeData" height="500px"></app-echarts>
      </Col>
      <Col span="12">
        <app-echarts :set-option="strongKnowledgeData" height="500px"></app-echarts>
      </Col>
    </Row>

    <!-- 表格组件 -->
    <Table size="small" class="app-table point-table" :columns="columns" :data="data" border></Table>

  </div>
</template>
<script>
/**
 * 学员管理 - 学员知识点 - 学员知识点详情
 * @author zml
 * @version 2017-07-27
*/
import { GLOBAL } from '@/store/mutationTypes'

export default {

  name: 'app-student-knowledgepoint-detail',

  data() {
    return {
      tabActive: '',
      display_name: '',
      number: '',
      editInfo: [],
      planIndex: 0,

      data: [], // 表格数据

      // 表格配置
      columns: [
        { title: '知识点', key: 'knowledge_id', align: 'center' },
        {
          title: '教授情况',
          key: 'teach_status_name',
          align: 'center',
          render: (h, params) => {
            const { teach_status } = params.row
            return h('Icon', {
              class: teach_status === 0 ? 'color-primary' : 'color-error',
              props: {
                type: teach_status === 0 ? 'checkmark' : 'close',
              },
            })
          },
        },
        { title: '原来掌握情况', key: 'old_status_name', align: 'center' },
        { title: '最新掌握情况', key: 'new_status_name', align: 'center' },
        { title: '测试情况', key: 'test_number', align: 'center' },
      ],

      // echarts图表配置
      weekKnowledgeData: {
        title: {
          text: '综合薄弱知识点TOP5',
          subtext: '数据支撑',
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}：{c}（{d}%）',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['奥数的认识', '绝对值', '公约数与倍数', '整数的认识', '倍数的特征'],
        },
        series: {
          name: '错题数',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 20, name: '奥数的认识' },
            { value: 15, name: '绝对值' },
            { value: 30, name: '公约数与倍数' },
            { value: 18, name: '整数的认识' },
            { value: 33, name: '倍数的特征' },
          ],
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },

      // echarts图表配置
      strongKnowledgeData: {
        title: {
          text: '综合最强知识点TOP5',
          subtext: '数据支撑',
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}：{c}（{d}%）',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['奥数的认识', '绝对值', '公约数与倍数', '整数的认识', '倍数的特征'],
        },
        series: {
          name: '正确数',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 10, name: '奥数的认识' },
            { value: 25, name: '绝对值' },
            { value: 13, name: '公约数与倍数' },
            { value: 28, name: '整数的认识' },
            { value: 33, name: '倍数的特征' },
          ],
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    }
  },

  computed: {
    id() {
      return +this.$router.currentRoute.params.id
    },
    planId() {
      if (this.editInfo.length) {
        return this.editInfo[this.planIndex].id
      }
      return null
    },
  },

  watch: {
    planId() {
      this.getProgressData()
    },
  },

  methods: {
    tabSelect(index) {
      this.planIndex = index
    },

    getStudentInfo() {
      return this.$http.get(`/studentplan/infolist/${this.id}`)
        .then((res) => {
          this.display_name = res.info.display_name
          this.number = res.info.number
          this.editInfo = res.info.edit_info
        })
    },

    getProgressData() {
      if (this.planId) {
        const api = `/studentprogress/infoknowledge/${this.planId}`
        return this.$http.get(api)
          .then((res) => {
            this.data = res.plan_knowledge_pivot
          })
      }
      return false
    },
  },

  created() {
    this.getStudentInfo()
      .then(this.getProgressData)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

}
</script>

<style lang="less">
@import "~vars.less";
</style>
