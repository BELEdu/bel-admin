<template>
  <div class="home-data-module">
    <!--本月签约-->
    <template v-if="$attrs.type==='contract'">
      <app-echarts :set-option="contractData"></app-echarts>
    </template>
    <!--预警-->
    <template v-if="$attrs.type==='warning'">
      <Table height="113"
             size="small"
             stripe
             :columns="warning.columns"
             :data="warning.data"></Table>
    </template>
    <!--本月签约课时收入-->
    <template v-if="$attrs.type==='income'">
      <app-echarts :set-option="incomeData"></app-echarts>
    </template>
    <!--我的审批-->
    <template v-if="$attrs.type==='approval'">
      <Table height="273"
             size="small"
             stripe
             :columns="approval.columns"
             :data="approval.data"></Table>
    </template>
    <!--我的排课表-->
    <template v-if="$attrs.type==='course'">
      <home-calendar @day-changed="calendarDay" :date="$attrs.data.currentMonth">
        <template scope="date">
          <span class="calendar-event-icon" v-for="(list, index) in courseConvert(date)"
                v-if="list.item.length"
                    :key="index">
            <Tooltip placement="top">
                <Icon type="person" v-if="list.type === 1"></Icon>
                <Icon type="person-stalker" v-if="list.type === 2"></Icon>
                <template slot="content">
                  <div v-for="item in list.item">{{item.start_at}}-{{item.end_at}} {{item.display_name}}</div>
                </template>
            </Tooltip>
          </span>
        </template>
      </home-calendar>
    </template>
    <!--本月签约课时收入占比-->
    <template v-if="$attrs.type==='incomeCompared'">
      <app-echarts :set-option="incomeComparedData"></app-echarts>
    </template>
    <!--本月各校区签约金额占比-->
    <template v-if="$attrs.type==='amountCompared'">
      <app-echarts :set-option="amountComparedData"></app-echarts>
    </template>
    <!--我的测试管理-->
    <template v-if="$attrs.type==='testManager'">
      <Table height="233"
             size="small"
             stripe
             :columns="testManager.columns"
             :data="testManager.data"></Table>
    </template>
    <!--本月签约排行-->
    <template v-if="$attrs.type==='contractSort'">本月签约排行</template>
    <!--我的学员-->
    <template v-if="$attrs.type==='myStudent'">
      <Table height="293"
             size="small"
             stripe
             :columns="student.columns"
             :data="student.data"></Table>
    </template>
    <!--我的班级-->
    <template v-if="$attrs.type==='myClass'">我的班级</template>
    <!--本月耗课-->
    <template v-if="$attrs.type==='tookPeriod'">
      <app-echarts :set-option="tookPeriodData"></app-echarts>
    </template>
    <!--本月耗课排行-->
    <template v-if="$attrs.type==='tookPeriodSort'"></template>
  </div>
</template>
<script>
  /**
   * 首页模块
   * @author  chenliangshan
   * @version 2017/07/24
   */

  /*eslint-disable*/

  import { isEmpty } from 'lodash'
  import HomeCalendar from './Calendar'
  import { createButton } from '@/utils'

  export default {
    name: 'data-module',
    components: { HomeCalendar },
    data() {
      return {
        // 我的教师课表
        courseData: [
          {
            type: 1,
            date: '2017-07-08',
            start_at: '09:50',
            end_at: '10:50',
            display_name: 'test1',
          }, {
            type: 1,
            date: '2017-08-14',
            start_at: '13:50',
            end_at: '14:50',
            display_name: 'test15',
          }, {
            type: 1,
            date: '2017-08-14',
            start_at: '19:50',
            end_at: '20:50',
            display_name: 'test12',
          }, {
            type: 2,
            date: '2017-08-24',
            start_at: '09:50',
            end_at: '10:50',
            display_name: 'test13',
          }, {
            type: 1,
            date: '2017-09-14',
            start_at: '09:50',
            end_at: '10:50',
            display_name: 'test14',
          }],
        // 本月签约
        contractData: {
          tooltip: {
            trigger: 'axis',
            formatter:"{b} 日 <br/>{a0} : {c0} 元  <br/> {a1} : {c1} 元 <br/> {a2} : {c2} 元 <br/> {a3} : {c3} 人 ",
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          legend: {
            data:['新签','续费','试听','人数'],
          },
          xAxis: [
            {
              type: 'category',
              data:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
              axisPointer: {
                type: 'shadow',
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额',
              min: 0,
              max: 500000,
              interval: 50000,
              axisLabel: {
                formatter: '{value} 元',
              },
            },
            {
              type: 'value',
              name: '人数',
              min: 0,
              max: 50,
              interval: 5,
              axisLabel: {
                formatter: '{value} 人',
              },
            },
          ],
          series: [
            {
              name:'新签',
              type:'bar',
              stack:'签约',
              data:[20000, 30000,50000, 20000, 10000,50000,10000,30000,80000,80000,40000,10000,30000,0,50000,90000,150000,130000,170000,100000,120000,80000],
            },
            {
              name:'续费',
              type:'bar',
              stack:'签约',
              data:[30000, 2000, 50000, 30000, 60000,20000,80000,60000,30000,10000,0,30000,20000,10000,35000,60000,20000,15000,10000,30000,50000,20000],
            },
            {
              name:'试听',
              type: 'bar',
              stack: '签约',
              data: [2000, 20000, 4000, 2000, 3000,0,1000,3000,500,0,0,0,500,2000,0,0,0,3000,0,500,1000,3000],
            },
            {
              name: '人数',
              type: 'line',
              yAxisIndex: 1,
              data: [8, 22, 11, 5, 14, 11, 17, 15, 20, 13, 10, 5, 9, 3, 18, 19, 20, 23, 24, 22, 27, 23],
            },
          ],
        },
        // 本月签约课时收入
        incomeData: {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data:['小班课时收入','一对一课时收入','本月晚辅导收入']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'小班课时收入',
              type:'line',
              stack: '总量',
              areaStyle: {normal: {}},
              data:[120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,200,301,20,15,28,77,88]
            },
            {
              name:'一对一课时收入',
              type:'line',
              stack: '总量',
              areaStyle: {normal: {}},
              data:[220, 182, 191, 234, 290, 330, 310,120, 132, 101, 134, 90, 230, 210,22,54,33,300,210,220,20]
            },
            {
              name:'本月晚辅导收入',
              type:'line',
              stack: '总量',
              areaStyle: {normal: {}},
              data:[150, 232, 201, 154, 190, 330, 410,21,22,23,55,220,100,120,150,22,300,20,57,11,80]
            },


          ]
        },
        // 本月签约课时收入占比
        incomeComparedData: {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data:['一对一','晚辅导','奥数小班','作文小班','新初一衔接班','新高一衔接班','提前招小班','自主招生小班','学考小班','选考小班']
          },
          series: [
            {
              name:'课时收入',
              type:'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {value:1735, name:'一对一', selected:true},
                {value:579, name:'晚辅导'},
                {value:348, name:'小班'}
              ]
            },
            {
              name:'课时收入',
              type:'pie',
              radius: ['40%', '55%'],

              data:[
                {value:1735, name:'一对一'},
                {value:579, name:'晚辅导'},
                {value:148, name:'奥数小班'},
                {value:40, name:'作文小班'},
                {value:20, name:'新初一衔接班'},
                {value:40, name:'新高一衔接班'},
                {value:50, name:'提前招小班'},
                {value:50, name:'自主招生小班'},
                {value:0, name:'学考小班'},
                {value:0, name:'选考小班'},
              ]
            }
          ]
        },
        // 本月各校区签约金额占比
        amountComparedData: {
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} 元 ({d}%)"
          },
          legend: {
            x : 'center',
            y : 'bottom',
            data:['思明校区','杏林校区','湖里校区','翔安校区','集美校区','同安校区','漳州校区','泉州校区']
          },
          calculable : true,
          series : [

            {
              name:'签约金额',
              type:'pie',
              radius : [30, 110],
              center : ['50%', '50%'],
              roseType : 'area',
              data:[
                {value:57889, name:'思明校区'},
                {value:5000, name:'杏林校区'},
                {value:15000, name:'湖里校区'},
                {value:55056, name:'翔安校区'},
                {value:100506, name:'集美校区'},
                {value:55889, name:'同安校区'},
                {value:23000, name:'漳州校区'},
                {value:14449, name:'泉州校区'}
              ]
            }
          ]
        },
        // 本月耗课
        tookPeriodData: {
          tooltip: {
            trigger: 'axis',
            formatter: "{b} 日 <br/>{a0} : {c0} 元  <br/> {a1} : {c1} 元 <br/> {a2} : {c2} 元 <br/> {a3} : {c3} 个 ",
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: ['一对一耗课金额', '小班耗课金额', '晚辅导耗课金额', '耗课课时数']
          },
          xAxis: [
            {
              type: 'category',
              data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额',
              min: 0,
              max: 300000,
              interval: 50000,
              axisLabel: {
                formatter: '{value} 元'
              }
            },
            {
              type: 'value',
              name: '课时',
              min: 0,
              max: 300,
              interval: 50,
              axisLabel: {
                formatter: '{value} 个'
              }
            }
          ],
          series: [
            {
              name: '一对一耗课金额',
              type: 'bar',
              stack: '签约',
              data: [20000, 30000, 10000, 20000, 10000, 70000, 65000, 15000, 80000, 90000, 4000, 50000, 55000, 65000, 75000, 30000, 50000, 35000, 55000, 60000, 70000, 80000]
            },
            {
              name: '小班耗课金额',
              type: 'bar',
              stack: '签约',
              data: [30000, 2000, 50000, 30000, 60000, 50000, 60000, 120000, 60000, 40000, 110000, 50000, 30000, 30000, 10000, 60000, 70000, 80000, 60000, 30000, 40000, 25000]
            },
            {
              name: '晚辅导耗课金额',
              type: 'bar',
              stack: '签约',
              data: [2000, 20000, 4000, 2000, 3000, 10000, 5000, 6000, 7000, 8000, 8000, 9000, 10000, 10000, 10000, 10000, 8000, 7000, 7000, 7000, 8000, 8000]
            },
            {
              name: '耗课课时数',
              type: 'line',
              stack: '总量',
              yAxisIndex: 1,
              data: [120, 132, 101, 134, 90, 230, 220, 230, 200, 190, 205, 180, 150, 170, 180, 190, 185, 200, 150, 160, 177, 155]
            }
          ]
        },
        // 预警
        warning: {
          columns: [
            { title: '学员姓名', align: 'center', key: 'student_name' },
            { title: '预警类型', align: 'center', key: 'warning_type' },
            { title: '预警日期', align: 'center', key: 'created_at' },
            { title: '预警原因', align: 'center', key: 'warning_reason' },
            { title: '状态', align: 'center', key: 'warning_status_name' },
            { title: '处理',
              align: 'center',
              render: createButton([
                {
                  type: 'primary',
                  click: (params) => {
                    this.$router.push(`/student/student/${params.student_id}/warning`)
                  },
                  text: '详情',
                },
              ]),
            },
          ],
          data: [
            {
              created_at: null,
              id: 1,
              student_id: 35,
              student_name: 'test',
              user_id: 36,
              user_name: "多角色用户",
              warning_reason: "faf",
              warning_status: 0,
              warning_status_name: "预警中",
              warning_type: 1,
              warning_type_name: "退费"
            }, {
              created_at: null,
              id: 1,
              student_id: 35,
              student_name: 'test',
              user_id: 36,
              user_name: "多角色用户",
              warning_reason: "faf",
              warning_status: 0,
              warning_status_name: "预警中",
              warning_type: 1,
              warning_type_name: "退费"
            }, {
              created_at: null,
              id: 1,
              student_id: 35,
              student_name: 'test',
              user_id: 36,
              user_name: "多角色用户",
              warning_reason: "faf",
              warning_status: 0,
              warning_status_name: "预警中",
              warning_type: 1,
              warning_type_name: "退费"
            },
          ]
        },
        // 我的审批
        approval: {
          columns: [
            { title: '', align: 'center', key: 'product_name' },
            { title: '学员姓名', align: 'center', key: 'student_name' },
            { title: '合同总金额', align: 'center', key: 'money' },
            { title: '总课时', align: 'center', key: 'course_total' },
            { title: '申请人', align: 'center', key: 'username' },
            { title: '',
              align: 'center',
              render: createButton([
                {
                  type: 'primary',
                  click: (params) => {
                    this.$router.push(`/business/contract/audit/${params.id}`)
                  },
                  text: '查看',
                },
              ]),
            },
          ],
          data: [
            {
              apply_time: "2017-07-27 05:58",
              approval_number: "AP0000000035",
              audit_process: "光鱼校区咨询部主任待审批",
              audit_time: "",
              course_total: 5,
              display_name: "发的",
              flow_name: "新签合同审批",
              id: 35,
              money: "5700.00",
              operation: {update: false, cancel: false, refund: false, approval: false},
              product_name: "沙发上",
              refund_tag: false,
              student_name: "三大法师",
              username: "咨询师一",
            },{
              apply_time: "2017-07-27 05:58",
              approval_number: "AP0000000035",
              audit_process: "光鱼校区咨询部主任待审批",
              audit_time: "",
              course_total: 5,
              display_name: "发的",
              flow_name: "新签合同审批",
              id: 35,
              money: "5700.00",
              operation: {update: false, cancel: false, refund: false, approval: false},
              product_name: "沙发上",
              refund_tag: false,
              student_name: "三大法师",
              username: "咨询师一",
            },{
              apply_time: "2017-07-27 05:58",
              approval_number: "AP0000000035",
              audit_process: "光鱼校区咨询部主任待审批",
              audit_time: "",
              course_total: 5,
              display_name: "发的",
              flow_name: "新签合同审批",
              id: 35,
              money: "5700.00",
              operation: {update: false, cancel: false, refund: false, approval: false},
              product_name: "沙发上",
              refund_tag: false,
              student_name: "三大法师",
              username: "咨询师一",
            },{
              apply_time: "2017-07-27 05:58",
              approval_number: "AP0000000035",
              audit_process: "光鱼校区咨询部主任待审批",
              audit_time: "",
              course_total: 5,
              display_name: "发的",
              flow_name: "新签合同审批",
              id: 35,
              money: "5700.00",
              operation: {update: false, cancel: false, refund: false, approval: false},
              product_name: "沙发上",
              refund_tag: false,
              student_name: "三大法师",
              username: "咨询师一",
            },{
              apply_time: "2017-07-27 05:58",
              approval_number: "AP0000000035",
              audit_process: "光鱼校区咨询部主任待审批",
              audit_time: "",
              course_total: 5,
              display_name: "发的",
              flow_name: "新签合同审批",
              id: 35,
              money: "5700.00",
              operation: {update: false, cancel: false, refund: false, approval: false},
              product_name: "沙发上",
              refund_tag: false,
              student_name: "三大法师",
              username: "咨询师一",
            },{
              apply_time: "2017-07-27 05:58",
              approval_number: "AP0000000035",
              audit_process: "光鱼校区咨询部主任待审批",
              audit_time: "",
              course_total: 5,
              display_name: "发的",
              flow_name: "新签合同审批",
              id: 35,
              money: "5700.00",
              operation: {update: false, cancel: false, refund: false, approval: false},
              product_name: "沙发上",
              refund_tag: false,
              student_name: "三大法师",
              username: "咨询师一",
            },{
              apply_time: "2017-07-27 05:58",
              approval_number: "AP0000000035",
              audit_process: "光鱼校区咨询部主任待审批",
              audit_time: "",
              course_total: 5,
              display_name: "发的",
              flow_name: "新签合同审批",
              id: 35,
              money: "5700.00",
              operation: {update: false, cancel: false, refund: false, approval: false},
              product_name: "沙发上",
              refund_tag: false,
              student_name: "三大法师",
              username: "咨询师一",
            },
          ],
        },
        // 我的审批
        testManager: {
          columns: [
            { title: '测试对象', align: 'center', key: 'student_name' },
            { title: '测试类型', align: 'center', key: 'test_type' },
            { title: '测评试卷', align: 'center', key: 'test_title' },
            { title: '测评时间', align: 'center', key: 'date' },
            { title: '',
              align: 'center',
              render: createButton([
                {
                  type: 'primary',
                  click: (params) => {
                    this.$router.push(`/examination/smartexam/${params.id}`)
                  },
                  text: '查看',
                },
              ]),
            },
          ],
          data: [
            {
              id: 1,
              student_id: 10,
              student_name: '王芳',
              test_type: '语文小册',
              test_title: '2017年6月15日语文',
              date: '2017-06-06',
            },{
              id: 1,
              student_id: 10,
              student_name: '王芳',
              test_type: '语文小册',
              test_title: '2017年6月15日语文',
              date: '2017-06-06',
            },{
              id: 1,
              student_id: 10,
              student_name: '王芳',
              test_type: '语文小册',
              test_title: '2017年6月15日语文',
              date: '2017-06-06',
            },{
              id: 1,
              student_id: 10,
              student_name: '王芳',
              test_type: '语文小册',
              test_title: '2017年6月15日语文',
              date: '2017-06-06',
            },{
              id: 1,
              student_id: 10,
              student_name: '王芳',
              test_type: '语文小册',
              test_title: '2017年6月15日语文',
              date: '2017-06-06',
            },{
              id: 1,
              student_id: 10,
              student_name: '王芳',
              test_type: '语文小册',
              test_title: '2017年6月15日语文',
              date: '2017-06-06',
            },
          ],
        },
        // 我的学员
        student: {
          columns: [
            { title: '学员姓名', align: 'center', key: 'student_name' },
            { title: '剩余课时',
              align: 'center',
              render: (h, params) => {
                const remain = params.row.course_remain
                return h('span', [
                  h('span', {
                    // 课时小于10显示预警样式
                    class: remain < 10 ? 'warning-color' : '',
                  }, remain),
                  h('span', ` / ${params.row.course_total}`)
                ])
              }
            },
            { title: '学习进度',
              align: 'center',
              render: (h, params) => {
                const done = (params.row.course_total - params.row.course_remain) / params.row.course_total * 100
                return h('i-circle', {
                  props: {
                    size: 48,
                    percent: done,
                  },
                }, `${done.toFixed(2)}%`)
              },
            },
            { title: '',
              align: 'center',
              render: createButton([
                {
                  type: 'primary',
                  click: (params) => {
                    this.$router.push(`/student/studyprogress/student/${params.id}/progress`)
                  },
                  text: '查看',
                },
              ]),
            },
          ],
          data: [
            {
              id: 4,
              student_name: '李园园',
              course_remain: 1,
              course_total: 6,
            },{
              id: 4,
              student_name: '李一',
              course_remain: 3,
              course_total: 10,
            },{
              id: 4,
              student_name: '李三',
              course_remain: 10,
              course_total: 18,
            },
          ],
        },
      }
    },
    methods: {
      calendarDay(date) {
        window.console.log(date)
      },
      courseConvert(date) {
        const course = this.courseData
        const find = course.filter(item => item.date === date.showEvents.date)
        if (!isEmpty(find)) {
          const arr = [
            { type: 1, item: [] },
            { type: 2, item: [] },
          ]
          find.forEach((val) => {
            arr[val.type - 1].item.push(val)
          })
          return arr
        }
        return []
      },
    },
  }
</script>
<style lang="less">
  @import "~vars";
  .home-data-module {
    .sub-module {
      width: 100%;
      height: 100%;
    }
  }
  .calendar-event-icon {
    margin-right: 2px;
    .ivu-icon {
      padding: 4px;
    }
  }
  .warning-color {
    color: @error-color
  }
</style>
