<template>
  <div class="weekly-table">
    <div class="weekly-left">
      <div class="info">
        <p>
          <label>学员姓名：</label>
          <span>李佳航</span>
        </p>
        <p>
          <label>上课年级：</label>
          <span>初中三年级</span>
        </p>
        <p>
          <label>产品名称：</label>
          <span>个性化一对一</span>
        </p>
        <p>
          <label>教师姓名：</label>
          <span>张旭</span>
        </p>
        <p>
          <label>上课科目：</label>
          <span>数学</span>
        </p>
        <p>
          <label>计划课时：</label>
          <span>2</span>
        </p>
        <p>
          <label>实际课时：</label>
          <span>1</span>
        </p>
      </div>
      <div class="switch">
        <Row>
          <Col span="8">
          <span class="prev">
                  <Icon type="chevron-left"></Icon>
                </span>
          </Col>
          <Col span="8">
          <span>周数</span>
          </Col>
          <Col span="8">
          <span class="next">
                  <Icon type="chevron-right"></Icon>
                </span>
          </Col>
        </Row>
      </div>
      <div class="remarks">
        <Row>
          <Col span="12">
          <span class="tag finish">已上课</span>
          </Col>
          <Col span="12">
          <span class="tag verify">已排定</span>
          </Col>
          <Col span="12">
          <span class="tag confirm">待确认</span>
          </Col>
          <Col span="12">
          <span class="tag cancel">已取消</span>
          </Col>
        </Row>
      </div>
    </div>
    <div class="weekly-right">
      <div class="app-table ivu-table-wrapper">
        <div class="ivu-table ivu-table-border">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <colgroup>
                <col width="50">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
              </colgroup>
              <thead>
              <tr>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>6月</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>5日 （星期一）</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>6日 （星期二）</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>7日 （星期三）</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>8日 （星期四）</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>9日 （星期五）</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>10日 （星期六）</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span>11日 （星期日）</span>
                  </div>
                </th>
              </tr>
              </thead>
            </table>
          </div>
          <div class="ivu-table-body" v-show="weeklyData.length">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <colgroup>
                <col width="50">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
                <col width="14%">
              </colgroup>
              <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row" v-for="(list,index) in weeklyData">
                  <template v-for="(item,key) in list">
                    <template v-if="index%4==0&&key==0">
                      <td class="ivu-table-column-center" rowspan="4">
                        <div class="ivu-table-cell">
                      <span>
                        <template v-if="!index">
                          上午
                        </template>
                        <template v-if="index == 4">
                          下午
                        </template>
                        <template v-if="index == 8">
                          晚上
                        </template>
                      </span>
                        </div>
                      </td>
                    </template>
                    <td class="ivu-table-column-center" @click="courseDetails(item,index,key)" v-bind:class="[{ 'weekly-active': isActive==item.id }, {'weekly-course': item.subjects_class}, weakStatus(item)]">
                      <div class="ivu-table-cell">
                        <span>
                          <template v-if="item.subjects_class">
                            <Row>
                            <Col span="24">{{item.class_time}}</Col>
                          </Row>
                          <Row>
                            <Col span="12">{{item.subjects_class}}</Col>
                            <Col span="12">{{item.student_name}}</Col>
                          </Row>
                          </template>
                          <template v-else>
                            <Icon type="plus-round" v-bind:class="'weekly-icon'"></Icon>
                          </template>
                        </span>
                      </div>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ivu-table-tip" v-show="!weeklyData.length">
            <table cellspacing="0" cellpadding="0" border="0">
              <tbody>
              <tr>
                <td><span>暂无筛选结果</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default{
    name: 'weekly-table',
    props: {
      data: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        weeklyData: {},
        isActive: '',
      }
    },
    methods: {
      courseDetails(item) {
        this.isActive = item.id
        window.console.log(item)
      },
      weakStatus(item) {
        let className
        switch (item.status_class) {
          case '1':
            className = 'finish'
            break
          case '2':
            className = 'verify'
            break
          case '3':
            className = 'confirm'
            break
          case '4':
            className = 'cancel'
            break
          default :
            className = ''
            break
        }
        return className
      },
    },
    watch: {
      data(val) {
        const arr = new Array(10).fill([])
        this.weeklyData = arr.map((v, k) => val.data.map(({ weekly_data }) => weekly_data[k]))
      },
    },
  }
</script>

<style lang="less">
  @import "~vars";
  @finish       : #66bae5;
  @verify       : #e5bb79;
  @confirm      : #e47fa9;
  @cancel       : #ccc;

  .weekly-table {
    position: relative;
    min-height: 550px;
    padding-left: 260px;
    .weekly-left {
      width: 240px;
      position: absolute;
      left: 0;
      .info {
        padding: 10px 16px;
        border-radius: 5px;
        margin-bottom: 20px;
        border: 1px solid #d7dde4;
        font-size: 14px;
        p {
          position: relative;
          padding-left: 80px;
          label {
            width: 76px;
            position: absolute;
            left:0;
            line-height: 30px;
            text-align: right;
          }
          span {
            display: inline-block;
            padding-top: 4px;
            line-height: 20px;
          }
        }

      }
      .switch {
        span {
          border: 1px solid #d7dde4;
          border-left: 0;
          display: block;
          line-height: 34px;
          text-align: center;
          font-size: 14px;
          &.prev {
            border-left: 1px solid #d7dde4;
          }
          &.prev,&.next {
            color: @primary-color;
            cursor: pointer;
          }
        }
      }
      .remarks {
        padding: 10px 16px;
        .tag {
          padding: 10px 0 10px 18px;
          display: block;
          position: relative;
          text-align: center;
          &::before {
            content: '';
            width: 20px;
            height: 16px;
            border-radius: 8px;
            position: absolute;
            left: 10px;
          }
          &.finish::before {
            background-color: #66bae5;
          }
          &.verify::before {
            background-color: #e5bb79;
          }
          &.confirm::before {
            background-color: #e47fa9;
          }
          &.cancel::before {
            background-color: #ccc;
          }
        }
      }
    }
    .weekly-right {
      .ivu-table,.ivu-table-body {
        overflow: visible;
      }
      .ivu-table-cell {
        border: 1px solid transparent;
      }
      .weekly-icon {
        color: #ccc
      }
      .weekly-course {
        color: #fff;
        &.finish {
          background-color: @finish;
        }
        &.verify {
          background-color: @verify;
        }
        &.confirm {
          background-color: @confirm;
        }
        &.cancel {
          background-color: @cancel;
        }
      }
      .weekly-active {
        position: relative;
        .ivu-table-cell {
          width: 110%;
          position: absolute;
          padding: 14px 0;
          top: -6px;
          left: -5%;
          box-shadow: 0px 0 10px 2px rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.8);
          z-index: 10;
        }
        &.finish {
          .ivu-table-cell {
            background-color: @finish;
          }
        }
        &.verify {
          .ivu-table-cell {
            background-color: @verify;
          }
        }
        &.confirm {
          .ivu-table-cell {
            background-color: @confirm;
          }
        }
        &.cancel {
          .ivu-table-cell {
            background-color: @cancel;
          }
        }
      }
    }
  }
</style>
