<template>
  <div class="home">
    <div class="home-header home-block">
      <Row>
        <Col>
        <Card>
          <Row type="flex" justify="center" align="middle">
            <Col span="4">
            <div class="home-header__campus">
              <span class="home-header__campus-name">{{homeData.name}}</span>
              [<Dropdown trigger="click" placement="bottom-start" @on-click="switchCampus">
              <span class="home-header__campus-switch">切换</span>
              <Dropdown-menu slot="list">
                <Dropdown-item v-for="(list, index) in homeData.campus_list"
                               :key="list.value"
                               :name="index">
                  {{list.display_name}}
                </Dropdown-item>
              </Dropdown-menu>
            </Dropdown>]
            </div>
            </Col>
            <Col span="12">
            <div class="home-header__table home-header__signed">
              <table class="home-header__table-content">
                <colgroup>
                  <col width="100">
                  <col>
                  <col>
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th></th>
                  <th>本日</th>
                  <th>本月</th>
                  <th>上月</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>签约单数</td>
                  <td><div class="home-header__table-cell-val">1</div></td>
                  <td><div class="home-header__table-cell-val">344</div></td>
                  <td><div class="home-header__table-cell-val">520</div></td>
                </tr>
                <tr>
                  <td>签约金额</td>
                  <td><div class="home-header__table-cell-val">5,873.00元</div></td>
                  <td><div class="home-header__table-cell-val">1,923,882.00元</div></td>
                  <td><div class="home-header__table-cell-val">3,223,768.00元</div></td>
                </tr>
                </tbody>
              </table>
            </div>
            </Col>
            <Col span="8">
            <div class="home-header__table">
              <table class="home-header__table-content">
                <colgroup>
                  <col width="100">
                  <col>
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th></th>
                  <th>本月</th>
                  <th>上月</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>耗课课时数</td>
                  <td><div class="home-header__table-cell-val">1250</div></td>
                  <td><div class="home-header__table-cell-val">2011</div></td>
                </tr>
                <tr>
                  <td>耗课金额</td>
                  <td><div class="home-header__table-cell-val">923,882.00元</div></td>
                  <td><div class="home-header__table-cell-val">2,123,768.00元</div></td>
                </tr>
                </tbody>
              </table>
            </div>
            </Col>
          </Row>
        </Card>
        </Col>
      </Row>
    </div>
    <home-module :data="homeData.module"
                 class-name="home-waterfall"></home-module>
  </div>
</template>

<script>
  /**
   * 首页
   * @author  chenliangshan
   * @version 2017/07/21
   */

  import { GLOBAL } from '@/store/mutationTypes'
  import HomeModule from './Components/HomeModule'

  export default {
    name: 'app-home',
    components: { HomeModule },
    data() {
      return {
        homeData: {
          name: '思明校区',
          campus_list: [
            { value: 1, display_name: '思明校区' },
            { value: 2, display_name: '思明校区2' },
            { value: 3, display_name: '思明校区3' },
          ],
          module: [
            { name: 'contract', title: '本月签约' },
            { name: 'warning', title: '预警' },
            { name: 'income', title: '本月签约课时收入' },
            { name: 'approval', title: '我的审批' },
            { name: 'course', title: '我的排课表', currentMonth: '2017-08' },
            { name: 'incomeCompared', title: '本月签约课时收入占比' },
            { name: 'amountCompared', title: '本月各校区签约金额占比' },
            { name: 'testManager', title: '我的测试管理' },
            { name: 'contractSort', title: '本月签约排行' },
            { name: 'myStudent', title: '我的学员' },
            { name: 'myClass', title: '我的班级' },
            { name: 'tookPeriod', title: '本月耗课' },
            { name: 'tookPeriodSort', title: '本月耗课排行' },
          ],
        },
      }
    },
    created() {
      this.$store.commit(GLOBAL.LOADING.HIDE)
    },
    methods: {
      // 切换校区
      switchCampus(id) {
        // 当前选中校区
        const item = this.homeData.campus_list[id]
        this.homeData.name = item.display_name
      },
    },
  }
</script>

<style lang="less">
  @import "~vars";
  @import "~mixin";

  .home-block {
    padding: 2px;
    .ivu-card {
      background-color: #fff;
    }
  }
  .home-header {
    margin-bottom: 20px;
    .ivu-card-body {
      .clearfix();
    }
    &__campus {
      text-align: center;
      &-name {
        font-size: 26px;
      }
      &-switch {
        color: @primary-color;
        padding: 0 4px;
        cursor: pointer;
      }
      &-list {
        max-height: 200px;
        overflow: hidden;
        li {
          font-size: 16px;
          line-height: 30px;
          border-bottom: 1px solid @border-color-base;
        }
      }
    }
    &__signed {
      border-left: 1px solid @border-color-base;
      border-right: 1px solid @border-color-base;
    }
    &__table {
      padding: 0 10px;
      &-content {
        text-align: center;
        width: 100%;
      }
      &-cell-val {
        color: @primary-color;
      }
    }
  }
  .home-waterfall {
    margin: 0 -10px;
    &-solt {
      .waterfall-block {
        padding: 2px 12px 20px 12px;
      }
      .cal-wrapper {
         background-color: #fff;
      }
      .dates {
        border-top: 1px solid @border-color-base;
        border-left: 1px solid @border-color-base;
        .item {
          height: 56px;
          border-right: 1px solid @border-color-base;
          border-bottom: 1px solid @border-color-base;
        }
      }
    }
  }
</style>
