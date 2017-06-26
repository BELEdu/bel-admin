<template>
  <div class="studentwrong" style="width: 1000px;">
    <Row>
      <!-- 科目列表 -->
      <Col span="5">
      <dl class="studentwrong__course-list">
        <dt>科目列表</dt>
        <dd v-for="(grade, key) in courseList" :key="grade">
          <h4>{{key}}</h4>
          <ul>
            <li v-for="course in grade" :key="course">
              <a>{{course}}</a>
            </li>
          </ul>
        </dd>
      </dl>
      </Col>
      <!-- 科目列表 end -->
      <Col span="19">
      <!-- 帮助栏 -->
      <ul class="studentwrong__help">
        <li>
          <Input placeholder="请输入关键字"></Input>
          <Button type="primary">
            <span>查询搜索</span>
          </Button>
        </li>
        <li>
          <span>学员姓名：王芳</span>
          <span>学员编号：xxxxxxx</span>
        </li>
      </ul>
      <!-- 帮助栏 end -->
      <!-- 知识点帮助栏 -->
      <Row type="flex" class="studentwrong__list-help">
        <Col span="10">
        <h3>知识点列表：</h3>
        <a>全部知识点</a>
        </Col>
        <Col>
        <Page class="app-page-small" :total="100"></Page>
        </Col>
      </Row>
      <!-- 知识点帮助栏 end -->
      <!-- 知识点 -->     
      <table class="studentwrong__knowledge">
        <tr v-for="index in Math.ceil(knowledge.length / 5)" :key="index">
          <td v-for="i in knowledge.length" :key="i" v-if="i - 1 >= (index-1) * 5 && i - 1 < index * 5">
            <a>{{knowledge[i - 1]}}</a>
          </td>
        </tr>
      </table>
      <!-- 知识点 end -->
      </Col>
    </Row>
    <!-- 错题分析 -->
    <h2 class="studentwrong__analyse-title">错题分析</h2>    
    <Table class="studentwrong__analyse"
    :data="data1" :columns="col1" :border="true" size="small"
    >
    </Table>
    <Page class="app-page-small" :total="100"></Page>    
    <!-- 错题分析 end -->
    <!-- 进阶学习 -->
    <h2 class="studentwrong__extensions-title">进阶学习</h2>    
    <Table class="studentwrong__extensions"
    :data="data1" :columns="col1" :border="true" size="small">
    </Table>
    <Page class="app-page-small" :total="100"></Page>  
    <!-- 进阶学习 end -->
  </div>
</template>

<script>
/**
 * 测试管理 - 错题管理 - 错题库
 * @author hjz
 * @version 2017-06-25
 * @description
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  data: () => ({
    courseList: {
      小学: ['语文', '数学', '英语', '政治', '地理', '化学', '物理'],
      初中: ['语文', '数学', '英语', '政治', '地理', '化学', '物理'],
      高中: ['语文', '数学', '英语', '政治', '地理', '化学', '物理'],
    },
    knowledge: ['从自然数到有理数', '有理数', '绝对值', '有理数的大小比较', '数与式之间的联系', '平行线与曲线之间的关系', '平行线与曲线之间的关系', '数与式之间的联系', '有理数的大小比较', '绝对值', '有理数', '从自然数到有理数', '从自然数到有理数', '有理数', '绝对值', '有理数的大小比较', '数与式之间的联系', '平行线与曲线之间的关系', '平行线与曲线之间的关系', '数与式之间的联系', '有理数的大小比较', '绝对值', '有理数', '从自然数到有理数', '从自然数到有理数', '有理数', '绝对值', '有理数的大小比较', '数与式之间的联系', '平行线与曲线之间的关系', '平行线与曲线之间的关系', '数与式之间的联系', '有理数的大小比较', '绝对值', '有理数', '从自然数到有理数'],
    col1: [
      { key: 1, title: '题目内容', align: 'center' },
      { key: 2, title: '知识点', align: 'center' },
      {
        key: 3,
        title: '操作',
        align: 'center',
        width: 100,
        render: h => h(
          'Button',
          {
            props: {
              type: 'text',
            },
            class: 'color-info',
          },
          '查看',
        ),
      },
    ],
    data1: [
      {
        1: '如图所示，a、b是有理数，则式子a+a+a+b化简的结果为（ ）.',
        2: '从自然数到有理数-有理数的分类',
      },
      {
        1: '如图所示，a、b是有理数，则式子a+a+a+b化简的结果为（ ）.',
        2: '从自然数到有理数-有理数的分类',
      },
      {
        1: '如图所示，a、b是有理数，则式子a+a+a+b化简的结果为（ ）.',
        2: '从自然数到有理数-有理数的分类',
      },
    ],
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import "~vars";
.studentwrong {

  &__course-list {
    border-radius: 5px;
    background-color: @bg-color;
    font-size: 14px;

    &>dt {
      height: 35px;
      border-bottom: 1px solid @border-color-split;
      line-height: 35px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }

    &>dd {
      padding-left: 10px;

      &>h4 {
        padding-top: 3px;
      }

      &>ul {
        padding: 0 5px 0 30px;
        border-bottom: 1px solid @border-color-split;
        &>li {
          display: inline-block;
          margin-right: 10px;
        }
      }
    }
  }

  &__help {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2px;
    padding-left: 10px;
    border-bottom: 1px solid @border-color-split;

    &>li {
      display: inline-block;
      font-size: 16px;
      font-weight: bold;

      &+li {
        line-height: 30px;

        &>span {
          margin-right: 10px;
        }
      }
    }

    & .ivu-input-wrapper {
      width: 300px;
    }
  }

  &__list-help {
    padding: 10px 0 0 10px;
    justify-content: space-between;
    align-items: center;

    & h3 {
      display: inline-block;
    }

    & .ivu-page {
      margin: 0;
    }
  }

  &__knowledge {
    margin-left: 10px;
    margin-top: 5px;
    width: 100%;
    // background-color: @bg-color;
  }

  &__analyse,
  &__extensions {

    &-title {
      margin: 10px 0;
    }
  }
}
</style>
