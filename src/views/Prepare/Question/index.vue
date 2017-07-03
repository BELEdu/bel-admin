<template>
  <div class="question">
    <!-- 上部地区、科目选择框 -->
    <Row class="question-upside">
      <Cascader :data="subject" placeholder="请选择科目..."></Cascader>
      <Select placeholder="请选择地区..." v-model="area">
        <Option value="1">全国</Option>
        <Option value="2">北京</Option>
        <Option value="3">上海</Option>
        <Option value="4">广州</Option>
      </Select>
    </Row>
    <!-- 上部地区、科目选择框 end -->
    <!-- 下部过滤条件、题库列表 -->
    <Row div class="question-below">
      <!-- 左侧知识点列表 -->
      <Col class="question__knowledge" span="5">
      <!-- 知识点选择 -->
      <Tabs value="name1" type="card">
        <Tab-pane label="按知识点" name="name1">
          <!-- 知识点单选 -->
          <div v-show="singleSelect">
            <Button type="primary" long @click="toggleSelect()">切换为多选</Button>
            <Tree :data="treePrivateData"></Tree>
            <!-- 注释：全部&个人知识点，V2.0保留功能-->
            <!--<Tree :data="treeWholeData"></Tree>-->
          </div>
          <!-- 知识点单选 end -->
          <!-- 知识点多选 -->
          <div class="question__knowledge-multiple" v-show="!singleSelect">
            <Row type="flex" justify="space-between">
              <Button type="primary" @click="toggleSelect()" long>切换为单选</Button>
              <Button type="primary" long>确定</Button>
            </Row>
            <Tree :data="treePrivateData" show-checkbox></Tree>
            <!--<Tree :data="treeWholeData" show-checkbox></Tree>-->
          </div>
          <!-- 知识点多选 end -->
        </Tab-pane>
        <!-- 知识点选择 end -->
        <!-- 章节选择 -->
        <Tab-pane label="按章节" name="name2">
          <!-- 教材选择 -->
          <Row type="flex" justify="space-between" style="margin-bottom: 8px;">
            <Select style="width: 49%;" placeholder="请选择年段...">
              <Option value="1">六年级</Option>
              <Option value="2">五年级</Option>
            </Select>
            <Select style="width: 49%;" placeholder="请选择教材...">
              <Option value="1">人教版</Option>
              <Option value="2">北师大新版</Option>
            </Select>
          </Row>
          <!-- 教材选择 end -->
          <!-- 章节单选 -->
          <div v-show="singleSelect">
            <Button type="primary" long @click="toggleSelect()">切换为多选</Button>
            <Tree :data="treePrivateData"></Tree>
          </div>
          <!-- 章节单选 end -->
          <!-- 章节多选 -->
          <div class="question__knowledge-multiple" v-show="!singleSelect">
            <Row type="flex" justify="space-between">
              <Button type="primary" @click="toggleSelect()" long>切换为单选</Button>
              <Button type="primary" long>确定</Button>
            </Row>
            <Tree :data="treePrivateData" show-checkbox></Tree>
          </div>
          <!-- 章节多选 end -->
        </Tab-pane>
        <!-- 章节选择 end -->
      </Tabs>
      </Col>
      <!-- 左侧知识点列表 end -->
      <!-- 右侧题库 -->
      <Col span="19">
      <!-- 高级搜索 -->
      <div class="question__filter">
        <!-- 题型 -->
        <div>
          <h4>题型</h4>
          <span :class="{ selected: filterType.type === -1 }" @click="typeFliter('type',-1)">
            全部
          </span>
          <span v-for="(item, index) in fdata[0]" :key="item" @click="typeFliter('type',index)" :class="{ selected: index === filterType.type }">
            {{item}}
          </span>
        </div>
        <!-- 题型 end -->
        <!-- 难度 -->
        <div>
          <h4>难度</h4>
          <span :class="{ selected: filterType.level === -1 }" @click="typeFliter('level',-1)">
            全部
          </span>
          <span v-for="(item, index) in fdata[1]" :key="item" @click="typeFliter('level',index)" :class="{ selected: index === filterType.level }">
            <span>{{item.name}}</span>
            <br>
            <span>{{item.value}}</span>
          </span>
        </div>
        <!-- 难度 end -->
        <!-- 来源 -->
        <div>
          <h4>来源</h4>
          <span :class="{ selected: filterType.source === -1 }" @click="typeFliter('source',-1)">
            全部
          </span>
          <span v-for="(item, index) in fdata[2]" :key="item" @click="typeFliter('source',index)" :class="{ selected: index === filterType.source }">
            {{item}}
          </span>
        </div>
        <!-- 来源 end -->
      </div>
      <!-- 高级搜索 end -->
      <!-- 帮助条 -->
      <div class="question__help">
        <div>
          <h4>排序</h4>
          <a 
            :class="{ selected: helpType === 1 }"
            @click="helpFliter(1)"
          >
            综合排序
          </a>
          <a 
            :class="{ selected: helpType === 2 }"
            @click="helpFliter(2)"
          >
            难度系数
          </a>
          <a 
            :class="{ selected: helpType === 3 }"
            @click="helpFliter(3)"
          >
            组卷次数
          </a>
        </div>
        <Page class="app-page-small" :total="100"></Page>
      </div>
      <!-- 帮助条 end -->
      <!-- 题库展示 -->
      <ul class="question__topics">
        <!-- 题目循环渲染 -->
        <li class="question__topics-item" v-for="i in 10" :key="i">
          <div style="height: 100px;"></div>
          <div>
            <Button size="small" type="primary">加入试卷</Button>
            <Button size="small" type="primary">查看解析</Button>
            <span>难度系数：
              <span>1.00-0.86</span>
            </span>
            <span>题型：单选题目</span>
          </div>
        </li>
        <!-- 题目循环渲染 end -->
        <app-pager></app-pager>
      </ul>
      <!-- 题库展示 end -->
      </Col>
      <!-- 右侧题库 end -->
    </Row>
    <!-- 下部过滤条件、题库列表 end -->
    <!-- 屏幕右下角选中题目提示 -->
    <ul class="question__cart">
      <li v-for="i in 6" :key="i">选择题(10)</li>
      <li>
        <Button type="primary" size="small" long @click="previewPaper()">试卷预览</Button>
      </li>
    </ul>
    <!-- 屏幕右下角选中题目提示 end -->
  </div>
</template>

<script>
/**
 * 备课管理 - 题库列表
 * @author hjz
 * @version 2017-06-26
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  data: () => ({
    // 切换单选or多选
    singleSelect: true,
    // 高级搜索标签选中
    filterType: {
      type: -1,
      level: -1,
      source: -1,
    },
    helpType: 1,
    // 以下是临时数据...
    area: null,
    subject: [
      {
        value: 1,
        label: '小学',
        children: [
          { label: '语文', value: 11 },
          { label: '数学', value: 12 },
          { label: '英语', value: 13 },
        ],
      },
      {
        value: 2,
        label: '初中',
        children: [
          { label: '语文', value: 21 },
          { label: '数学', value: 22 },
          { label: '英语', value: 23 },
          { label: '物理', value: 24 },
          { label: '化学', value: 25 },
          { label: '生物', value: 26 },
          { label: '地理', value: 27 },
          { label: '历史', value: 28 },
          { label: '政治', value: 29 },
        ],
      },
      {
        value: 3,
        label: '高中',
        children: [
          { label: '语文', value: 31 },
          { label: '数学', value: 32 },
          { label: '英语', value: 33 },
          { label: '物理', value: 31 },
          { label: '化学', value: 32 },
          { label: '生物', value: 33 },
          { label: '地理', value: 31 },
          { label: '历史', value: 32 },
          { label: '政治', value: 33 },
        ],
      },
    ],
    treePrivateData: [
      {
        expand: true,
        title: '平行线',
        children: [
          { title: '平行线定义' },
          { title: '同位角、内错角、同旁内角' },
          { title: '平行线定义的判定' },
          { title: '平行线定义的性质' },
        ],
      },
      {
        expand: true,
        title: '二院一次方程组',
        children: [
          { title: '二院一次方程组定义' },
          { title: '解二院一次方程组' },
          { title: '二院一次方程组的应用' },
          { title: '二院一次方程组的解法（选修）' },
        ],
      },
    ],
    fdata: [
      {
        3: '单选题',
        4: '多选题',
        5: '简单题',
        6: '作图题',
        7: '应用题',
      },
      [
        { name: '困难', value: '（0.26-0.40）' },
        { name: '较难', value: '（0.41-0.55）' },
        { name: '中等', value: '（0.56-0.70）' },
        { name: '较易', value: '（0.71-0.85）' },
        { name: '容易', value: '（0.86-1.00）' },
      ],
      {
        3: '单元测试',
        4: '月考',
        5: '期中考试',
        6: '期末测试',
        7: '模拟考试',
        8: '校联考',
        9: '中考',
        10: '省统考',
      },
    ],
  }),

  methods: {
    // 知识点 多选|单选 切换
    toggleSelect() {
      this.singleSelect = !this.singleSelect
    },
    // 高级搜索标签@click handler
    typeFliter(name, index) {
      this.filterType[name] = index
    },
    helpFliter(index) {
      this.helpType = index
    },
    // 进入预览试卷
    previewPaper() {
      this.$router.push('/prepare/question/paperpreview')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';

@gutter: 8px;
@bd-radius: 4px;
@rcol-padding: 0 20px;
@border-base: 1px solid @border-color-base;
@color-font-select: #fff;

.question {
  width: 1160px;

  &-below {
    margin-top: 10px; // 右侧gutter
    & .ivu-col:last-child {
      padding-left: @gutter;
    }
  }

  &-upside {

    & .ivu-cascader {
      display: inline-block;
      width: 220px;
      margin-right: 27px;
    }

    & .ivu-select {
      width: 220px;
    }
  }
}

// 左侧 - 知识点列表
.question__knowledge {
  border: @border-base;
  border-radius: @bd-radius;

  &-multiple {
    & button {
      width: 49%;
    }
  }
}

// 右侧 - 高级搜索
.question__filter {
  padding: @rcol-padding;
  border-radius: @bd-radius;
  background-color: @bg-color;

  & div {
    display: flex;
    border-bottom: 1px dashed @border-color-split;
    height: 40px;

    &:not(:nth-child(2)) {
      & span {
        line-height: 40px;
      }
    }

    &:last-child {
      border: none;
    }
  }

  & h4 {
    display: inline-block;
    margin-right: 5px;
    width: 29px;
    line-height: 40px;
  }

  &>div>span {
    display: inline-block;
    width: 90px;
    border-left: 1px solid @bg-color;
    text-align: center;
    color: @text-color;
    cursor: pointer;

    &:first-of-type {
      width: 60px;
      line-height: 40px;
    }

    &:hover {
      background-color: @link-color;
      color: @bg-color;
    }

    &.selected {
      background-color: @link-color;
      color: @bg-color;
    }
  }
}

// 右侧 - 帮助条
.question__help {
  display: flex;
  margin-top: @gutter;
  border-radius: @bd-radius;
  padding: @rcol-padding;
  height: 34px;
  background-color: @bg-color;
  align-items: center;
  justify-content: space-between;
  line-height: 34px;

  &>div {
    font-size: 0;

    &>h4 {
      display: inline;
      margin-right: 10px;
      vertical-align: middle;
      font-size: 12px;
      font-weight: bold;
    }

    &>a {
      display: inline-block;
      padding: 0 10px;
      border-left: 1px solid @bg-color;
      vertical-align: middle;
      font-size: 12px;
      color: @text-color;

      &:hover {
        color: @color-font-select;
        background-color: @link-color;
      }

      &.selected {
        background-color: @link-color;
        color: @bg-color;
      }
    }
  }

  & .app-page-small {
    margin: 0;
  }
}

// 右侧 - 题库展示
.question__topics {

  &-item {
    margin-top: @gutter;
    border: @border-base;
    border-radius: @bd-radius;

    &>div:last-of-type {
      padding: @gutter;
      background-color: @bg-color;

      &>span {
        float: right;
        margin-left: @gutter;
        line-height: 24px;

        &>span {
          color: @error-color;
        }
      }
    }

    & button {
      margin-right: @gutter;
    }
  }

  & .app-page {
    margin-top: 20px;
    padding-bottom: 20px;
  }
}

// 屏幕右下角选中题目提示
.question__cart {
  position: fixed;
  left: 1411px;
  bottom: 115px;
  border: @border-base;
  border-radius: @bd-radius;
  padding: 10px 17px;
  background-color: transparent;

  &>li {
    margin-bottom: 4px;
    text-align: center;

    &>button {
      margin-top: 10px;
    }
  }
}

// iview组件修改
.question {

  & .ivu-tabs-bar {
    margin-bottom: 0px;
  }

  & .ivu-tabs-nav {
    width: 100% !important;
  }

  & .ivu-tabs-tab {
    margin: 0 !important;
    width: 50% !important;
    height: 33px !important;
    border: none !important;
    border-radius: 0 !important;
    text-align: center !important;
  }

  & .ivu-tabs-tabpane {
    padding: 8px;
  } // 注释：全部&个人知识点，V2.0保留功能
  // & .ivu-tree{
  //   &>ul>li>span {
  //     font-size: 14px;
  //     font-weight: bolder;
  //     color: @link-color;
  //   }
  //   & .ivu-checkbox-wrapper {
  //     margin: 0
  //   }
  // }
}
</style>
