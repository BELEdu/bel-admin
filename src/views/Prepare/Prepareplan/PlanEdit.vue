<template>
  <div class="planedit">
    <!-- 头部表单 -->
    <Form class="app-form-entire planedit__coures" :label-width="120">
      <Form-item label="上课科目">
        <Select placeholder="请选择科目...">
          <Option value="1">语文</Option>
          <Option value="2">数学</Option>
          <Option value="3">英语</Option>
        </Select>
      </Form-item>
      <Form-item label="教学对象">
        <Select placeholder="请选择对象...">
          <Option value="1">多啦A梦</Option>
          <Option value="2">海绵宝宝</Option>
          <Option value="3">小当家</Option>
        </Select>
      </Form-item>
      <br>
      <Form-item label="上课日期">
        <Date-picker placeholder="请选择日期..."></Date-picker>
      </Form-item>
      <Form-item class="planedit__coures-duration" label="上课课时">
        <Select placeholder="请选择...">
          <Option value="1">第1节</Option>
          <Option value="2">第2节</Option>
          <Option value="3">第3节</Option>
        </Select>
        <span>课时长 2</span>
      </Form-item>
      <Form-item label="上课时段">
        <Time-picker type="timerange" format="HH:mm" placeholder="请选择时段..." :editable="false" confirm></Time-picker>
      </Form-item>
      <Form-item label="课题题目">
        <Input placeholder="请输入课题..."></Input>
      </Form-item>
    </Form>
    <!-- 头部表单 end -->
    <!-- 信息表格 -->
    <dl class="planedit__info">
      <div>
        <dt>上课科目</dt>
        <dd>数学</dd>
        <dt>教师姓名</dt>
        <dd>赵大虎</dd>
        <dt>上课日期</dt>
        <dd class="long">2017-06-06</dd>
        <dt>上课时段</dt>
        <dd class="long">10::00-18:00</dd>
      </div>
      <div>
        <dt>学员姓名</dt>
        <dd>王二丫</dd>
        <dt>所在年级</dt>
        <dd>七年级</dd>
        <dt class="short">性别</dt>
        <dd class="short">男</dd>
        <dt class="short">课时长</dt>
        <dd class="short">2</dd>
        <dt>所在学校</dt>
        <dd class="long">厦门市第一中学</dd>
      </div>
      <div>
        <dt>已授知识</dt>
        <dd>
          <ol>
            <li v-for="(item, index) in list" :key="item">{{`${index+1}. ${item}`}}</li>
          </ol>
        </dd>
      </div>
      <div>
        <dt>欠缺知识</dt>
        <dd>
          <ol>
            <li v-for="(item, index) in list" :key="item">{{`${index+1}. ${item}`}}</li>
          </ol>
        </dd>
      </div>
    </dl>
    <!-- 信息表格 end -->
    <!-- 本次课程内容 -->
    <Form class="app-form-entire planedit__now" :label-width="120">
      <h2>本次上课内容</h2>
      <Form-item label="巩固部分">
        <dl>
          <dt>教学目标</dt>
          <dd>
            <Input type="textarea" :rows="4" placeholder="请输入教学目标..."></Input>
          </dd>
        </dl>
        <dl>
          <dt>教学重点</dt>
          <dd>
            <Tag type="border" closable color="blue" v-for="i in 20" :key="i">标签一</Tag>
            <Button type="primary" size="small">添加重点</Button>
          </dd>
        </dl>
        <dl>
          <dt>教学难点</dt>
          <dd>
            <Tag type="border" closable color="blue" v-for="i in 3" :key="i">标签一</Tag>
            <Button type="primary" size="small">添加重点</Button>
          </dd>
        </dl>
      </Form-item>
      <Form-item label="复习部分">
        <Input placeholder="请输入复习内容..."></Input>
      </Form-item>
      <Form-item label="预习部分">
        <Input placeholder="请输入预习内容..."></Input>
      </Form-item>
    </Form>
    <!-- 本次课程内容 end -->
    <!-- 下次课程计划 -->
    <Form class="app-form-entire planedit__next" :label-width="120">
      <h2>下次教学计划和教学思路</h2>
      <Form-item label="教学内容">
        <Input type="textarea" :rows="7" placeholder="请输入教学计划和教学思路..."></Input>
      </Form-item>
      <Form-item label="选择试卷">
        <Select>
          <Option value="1">厦门一中试卷一</Option>
          <Option value="2">厦门一中试卷二</Option>
          <Option value="3">厦门一中试卷三</Option>
        </Select>
      </Form-item>
    </Form>
    <!-- 下次课程计划 end -->
    <!-- 编辑页行为按钮 -->
    <div class="planedit__action app-form-entire">
      <Button>取消</Button>
      <Button type="primary">提交</Button>
    </div>
    <!-- 编辑页行为按钮 end -->
  </div>
</template>

<script>
/**
 * 备课管理 - 教案管理 - 添加教案/查看教案
 * @author hjz
 * @version 2017-06-28
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data: () => ({
    list: [8, 2, 3, 4, 5, 6, 7],
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
@import '~mixin';

@gutter: 8px;
@bd-radius: 4px;
@rcol-padding: 0 20px;
@border-base: 1px solid @border-color-base;

.planedit__coures {
  display: flex;
  flex-wrap: wrap;

  & .ivu-form-item {
    width: calc(~'100% / 3');

    &:nth-child(2) {
      margin-right: 10px;
    }

    &:last-child {
      width: 100%;
    }
  }

  &-duration {

    & .ivu-form-item-content {
      display: flex;

      &>span {
        display: inline-block;
        white-space: nowrap;
        margin-left: 10px;
        line-height: 34px;
        font-size: 14px;
      }
    }
  }
}

.planedit__info {
  margin-left: 35px;
  margin-bottom: 30px; // 后期改成统一常量
  width: 940px;
  border: @border-base;
  border-radius: @bd-radius;
  font-size: 0px;

  &>div {
    border-bottom: @border-base;

    &:last-of-type {
      border: none;
    }

    &:nth-of-type(3),
    &:nth-of-type(4) {
      display: flex;

      &>dd {
        padding: 15px;
        flex-grow: 1;

        & li {
          display: block;
          padding-bottom: @gutter;
          line-height: 1.2em;
          text-align: left;
          word-wrap: break-word;

          &:last-of-type {
            padding: 0;
          }
        }
      }
    }
  }

  & dt,
  & dd {
    display: inline-block;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
  }

  & dt {
    width: 10%;
    background-color: @bg-color;

    &.short {
      width: 8%;
    }
  }

  & dd {
    width: 10%;

    &.long {
      width: 20%;
    }

    &.short {
      width: 7%;
    }
  }
}

.planedit__now {

  &>h2 {
    margin-left: 35px;
    margin-bottom: 30px;
  }

  & .ivu-form-item:first-of-type {

    &>.ivu-form-item-content {
      border: @border-base;
      border-radius: @bd-radius;
      padding: 15px;
    }
  }

  & .ivu-form-item-content {

    &>dl {
      display: flex;
      margin-bottom: 15px;

      &>dt {
        flex-shrink: 0;
        width: 10%;
        text-align: center;
      }

      &>dd {
        flex-grow: 1;
      }
    }

    &>dl:not(:first-child) {

      & dd {
        border: @border-base;
        border-radius: @bd-radius;
        padding: 10px;
      }
    }
  }
}

.planedit__next {

  &>h2 {
    margin-left: 35px;
    margin-bottom: 30px;
  }
}

.planedit__action {
  margin: 0 0 30px 120px;

  .ivu-btn {
    width: 90px;
    margin-top: 30px;

    &:not(:last-child) {
      margin-right: 2em;
    }
  }
}

.ie {

  .planedit__coures {
    .clearfix();

    & .ivu-form-item {
      float: left;
    }

    &-duration {

      & .ivu-form-item-content {
        .clearfix();

        & .ivu-select {
          float: left;
          width: calc(~'100% - 64px');
        }

        &>span {
          float: left;
        }
      }
    }
  }

  .planedit__info {

    &>div {
      &:nth-of-type(3),
      &:nth-of-type(4) {
        background-color: @bg-color;

        &>dt {
          float: left;
        }

        &>dd {
          display: block;
          width: auto;
          background-color: #fff;
          padding: 15px;
          overflow: hidden;
        }
      }
    }
  }

  .planedit__now {

    & .ivu-form-item-content {

      &>dl {
        
        &>dt {
          float: left;
          width: 10%;
        }

        &>dd {
          overflow: hidden;
        }
      }
    }
  }
}


</style>
