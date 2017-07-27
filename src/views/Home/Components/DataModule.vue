<template>
  <div class="home-data-module">
    <!--本月签约-->
    <template v-if="$attrs.type==='contract'">
      <home-echart :data="contractData"></home-echart>
    </template>
    <!--预警-->
    <template v-if="$attrs.type==='warning'">
      预警
    </template>
    <!--本月签约课时收入-->
    <template v-if="$attrs.type==='income'">
      <home-echart :data="incomeData"></home-echart>
    </template>
    <!--我的审批-->
    <template v-if="$attrs.type==='approval'">
      审批
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
      <home-echart :data="incomeComparedData"></home-echart>
    </template>
    <!--本月各校区签约金额占比-->
    <template v-if="$attrs.type==='amountCompared'">
      <home-echart :data="amountComparedData"></home-echart>
    </template>
    <!--我的测试管理-->
    <template v-if="$attrs.type==='testManager'">我的测试管理</template>
    <!--本月签约排行-->
    <template v-if="$attrs.type==='contractSort'">本月签约排行</template>
    <!--我的学员-->
    <template v-if="$attrs.type==='myStudent'">我的学员</template>
    <!--我的班级-->
    <template v-if="$attrs.type==='myClass'">我的班级</template>
    <!--本月耗课-->
    <template v-if="$attrs.type==='tookPeriod'">
      <home-echart :data="tookPeriodData"></home-echart>
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
  import HomeEchart from './Contract'
  import HomeCalendar from './Calendar'

  export default {
    name: 'data-module',
    components: { HomeEchart, HomeCalendar },
    data() {
      return {
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
        incomeData: {
          title: {
            text: '本月签约课时收入'
          },
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
        amountComparedData: {
          tooltip: {
            trigger: 'axis',
            formatter:"{b} 日 <br/>{a0} : {c0} 元  <br/> {a1} : {c1} 元 <br/> {a2} : {c2} 元 <br/> {a3} : {c3} 个 ",
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data:['一对一耗课金额','小班耗课金额','晚辅导耗课金额','耗课课时数']
          },
          xAxis: [
            {
              type: 'category',
              data:

                ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
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
              name:'一对一耗课金额',
              type:'bar',
              stack:'签约',
              data:[20000, 30000,10000, 20000, 10000,70000,65000,15000,80000,90000,4000,50000,55000,65000,75000,30000,50000,35000,55000,60000,70000,80000]
            },
            {
              name:'小班耗课金额',
              type:'bar',
              stack:'签约',
              data:[30000, 2000, 50000, 30000, 60000,50000,60000,120000,60000,40000,110000,50000,30000,30000,10000,60000,70000,80000,60000,30000,40000,25000]
            },
            {
              name:'晚辅导耗课金额',
              type:'bar',
              stack:'签约',
              data:[2000, 20000, 4000, 2000, 3000,10000,5000,6000,7000,8000,8000,9000,10000,10000,10000,10000,8000,7000,7000,7000,8000,8000]
            },
            {
              name:'耗课课时数',
              type:'line',
              stack: '总量',
              yAxisIndex: 1,
              data:[120, 132, 101, 134, 90, 230, 220,230,200,190,205,180,150,170,180,190,185,200,150,160,177,155]
            }
          ]
        },
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
</style>
