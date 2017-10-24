<template>
  <div class="clearfix">

    <!-- 阅卷区域 -->
    <div class="smartexam-check__aside left">
      <!-- 学员列表 -->
      <Card dis-hover>
        <p slot="title">学员列表</p>
        <Row :gutter="15">
          <Col
            span="12"
            v-for="(item,index) in students2"
            :key="index"
            class="smartexam-check__aside__btn"
          >
            <Button
              :type="buttonFormat(item.test_status,item.id)"
              long
              class="text-right"
              :disabled="item.test_status === 1"
              @click="changeTest(item.id)"
            >
              <span class="left">{{item.student.display_name}}</span>
              <!-- 未选择设备显示未考试 -->
              <span v-if="item.test_status === 1">(未考)</span>
              <!-- 待阅卷和已阅卷显示得分 -->
              <span v-if="item.test_status === 2 || item.test_status === 3">{{item.total_score}}分</span>
              <!-- 已阅卷显示打钩 -->
              <!-- <Icon v-if="item.test_status === 3" type="checkmark-round" /> -->
            </Button>
          </Col>
        </Row>
      </Card>

      <br>

      <!-- 试题 -->
      <Card dis-hover>
        <p slot="title">试题（{{currentStudentName}}）</p>
      </Card>

    </div>

    <!-- 试卷区域 -->
    <div class="smartexam-check__sidebar">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
/**
 * 测试管理 - 智能测试 - 阅卷主组件
 * @author zhoumenglin
 * @version 2017-10-23
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  props: {
    testid: {
      type: Number,
      required: true,
    },
    students: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      data: {},

      currentTestId: null,

      students2: [
        {
          id: 101,
          total_score: 0,
          test_status: 1,
          student: {
            display_name: '未考试',
          },
        },
        {
          id: 102,
          total_score: 10,
          test_status: 2,
          student: {
            display_name: '待阅卷',
          },
        },
        {
          id: 103,
          total_score: 79,
          test_status: 3,
          student: {
            display_name: '已阅卷',
          },
        },
        {
          id: 104,
          total_score: 0,
          test_status: 4,
          student: {
            display_name: '参加未提交',
          },
        },
        {
          id: 105,
          total_score: 20,
          test_status: 2,
          student: {
            display_name: '待阅卷',
          },
        },
      ],
    }
  },

  computed: {

    currentStudentName() {
      if (this.currentTestId) {
        return this.students2.find(item => item.id === this.currentTestId).student.display_name
      }
      return ''
    },

  },

  methods: {
    // 学员测试状态 1：待测试（未考试，未选择设备） 2：待阅卷 3：已阅卷 4：待提交
    buttonFormat(test_status, test_id) {
      if (this.currentTestId === test_id) {
        return 'primary'
      }
      switch (test_status) {
        case 1:
          return 'ghost'
        case 2:
          return 'ghost'
        case 3:
          return 'success'
        case 4:
          return 'dashed'
        default:
          return 'error'
      }
    },

    // 切换学员测试
    changeTest(test_id) {
      this.currentTestId = test_id
    },
  },


  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

}
</script>

<style lang="less">
.smartexam-check {
  &__aside {
    width: 320px;
    padding-right: 20px;

    &__btn{
      margin-bottom: 15px;
    }
  }

  &__sidebar{
    overflow: hidden;
  }
}
</style>
