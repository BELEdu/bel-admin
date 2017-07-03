<template>
  <div class="smartpaper">
    <Form class="app-form-entire" :label-width="130">
      <Form-item label="试卷名称" required>
        <Input placeholder="请输入试卷名称..."></Input>
      </Form-item>
      <Form-item label="选择科目" required>
        <Select placeholder="请选择科目..">
          <Option value="1">高中语文</Option>
          <Option value="2">高中数学</Option>
          <Option value="3">高中英语</Option>
        </Select>
      </Form-item>
      <Form-item label="选择版式">
        <Radio-group v-model="print" type="button" size="large">
          <Radio :label="1">随堂练习(A4/B5竖版)</Radio>
          <Radio :label="2">单元测试(A4/B5竖版)</Radio>
          <Radio :label="3">期中考试(A4/B5竖版)</Radio>
          <Radio :label="4">期末考试(A4/B5竖版)</Radio>
          <Radio :label="5">高考模拟(A4/B5竖版)</Radio>
        </Radio-group>
      </Form-item>
      <dl class="smartpaper__topics-amount">
        <dt>选择题量</dt>
        <dd>
          <Form-item label="单选题：">
            <Input-number></Input-number>
          </Form-item>
          <Form-item label="应用题：">
            <Input-number></Input-number>
          </Form-item>
          <Form-item label="计算题：">
            <Input-number></Input-number>
          </Form-item>
        </dd>
        <dd>
          <Form-item label="简单题：">
            <Input-number></Input-number>
          </Form-item>
          <Form-item label="作图题：">
            <Input-number></Input-number>
          </Form-item>
          <Form-item label="证明题：">
            <Input-number></Input-number>
          </Form-item>
        </dd>
        <dd>
          <Form-item label="填空题：">
            <Input-number></Input-number>
          </Form-item>
          <Form-item label="单选题：">
            <Input-number></Input-number>
          </Form-item>
          <Form-item label="简答题：">
            <Input-number></Input-number>
          </Form-item>
        </dd>
      </dl>
      <Form-item label="选择难度" class="smartpaper__level">
        <Slider :step="1" :max="4" :min="0" show-stops show-tip="never"></Slider>
        <div class="smartpaper__level-text">
          <span>容易（0.86-1.00）</span>
          <span>较易（0.71-0.85）</span>
          <span>中等（0.56-0.70）</span>
          <span>较难（0.41-0.55）</span>
          <span>困难（0.26-0.40）</span>
        </div>
      </Form-item>
      <Form-item label="选择知识点"> 
        <!-- 穿梭框 -->
      </Form-item>
      <Form-item> 
        <Button>取消</Button>
        <Button type="primary">生成</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 备课管理 - 组卷中心 - 智能组卷
 * @author hjz
 * @version 2017-06-28
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {

  data: () => ({
    print: 0,
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.smartpaper {

  &__topics-amount {
    display: flex;
    margin-bottom: 20px;

    &>dt {
      padding-top: 6px;
      padding-right: 2em;
      width: 130px;
      font-size: 14px;
      text-align: right;
    }

    & .ivu-form-item {
      margin-right: 55px;
      margin-bottom: 10px;

      &-label {
        padding-right: 12px !important;
        width: auto !important;
      }

      &-content {
        margin-left: 70px !important;
      }
    }
  }

  &__level {

    &-text {
      display: flex;
      justify-content: space-between;
      // margin: 0 -10px 0 -50px;
      margin-right: -50px;
      margin-left: -50px;

      &>span {
        // margin-right: 83px;
      }
    }
  }
}

// iview样式修复
.smartpaper {

  & .ivu-radio-group-item {
    margin-right: 0 !important;
    padding: 0 17px;
  }

  & .ivu-slider-wrap {
    margin: 16px auto;
    // width: 90%;
  }
}
</style>
