<template>
  <app-form-modal class="examedit" :title="'添加试卷'" :loading="false" :value="value" :width="450" :assistClass="'color-error'" @input="toggle">
    <Form :label-width="90" class="examedit__info">
      <Form-item label="评测发起人：">
        <span>{{usrname}}</span>
      </Form-item>
      <Form-item label="测试类型：">
        <Select placeholder="请选择类型">
          <Option value="1">单元测试</Option>
          <Option value="2">单元测试</Option>
          <Option value="3">单元测试</Option>
          <Option value="4">单元测试</Option>
        </Select>
      </Form-item>
      <Form-item label="测试科目：">
        <Select placeholder="请选择科目">
          <Option value="1">语文</Option>
          <Option value="2">语文</Option>
          <Option value="3">语文</Option>
          <Option value="4">语文</Option>
        </Select>
      </Form-item>
      <Form-item label="测试时间：">
        <Time-picker placeholder="请选择时间段" format="HH:mm" type="timerange" confirm :editable="false" v-model="timedata" @on-ok="showTime"></Time-picker>
      </Form-item>
      <Form-item label="测试试卷：">
        <Select placeholder="请选择试卷" class="examedit__text-select">
          <Option value="1">厦门附中期末模拟考</Option>
          <Option value="2">厦门附中期末模拟考</Option>
          <Option value="3">厦门附中期末模拟考</Option>
          <Option value="4">厦门附中期末模拟考</Option>
        </Select>
        <Button type="ghost">个性化组卷</Button>
      </Form-item>
    </Form>
  </app-form-modal>
</template>

<script>
/**
 * 智能测试 - 添加测试
 * @author hjz
 * @version 2017-06-22
 * @description 该组件有两个入口 列表页&学员独立页
 * @description 列表页可以从row拿，独立页面呢？
 * @description 独立页也是从全员列表进入，改变路由，然后从路由path/${id}拿
 * @description 最好是在组件中父组件中维护id字段，触发examStudent(id)是改变id字段
 */
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 后期考虑是否有必要放到store中
    id: {
      type: Number,
      // required: true,
    },
  },

  data: () => ({
    // <time-picker> v-model 必须绑定数组数据，否则页面会卡死
    timedata: ['02:02', '03:03'],
    // 全局store中肯定有用户信息，后期再computed中拿
    usrname: '张旭',
  }),

  methods: {
    toggle(value) {
      this.$emit('input', value)
    },
    showTime() {
      window.console.log(this.timedata)
    },
  },
}
</script>

<style lang="less">
@import "~vars";
@import "~mixin";

.examedit {
  .ivu-form-item-content {
    display: flex;
  }
}

.examedit__text-select {
  margin-right: 10px;
}

.examedit__info {
  padding: 0 20px;

  & .ivu-form-item {

    &:nth-of-type(5) {
      margin-bottom: 10px!important;
    }
  }

  & .ivu-date-picker {
    width: 100%;
  }
}

.examedit__composition {
  font-size: 14px;

  &:hover {
    color: @link-color!important;
  }
}

.ie {

  .examedit {
    .ivu-form-item-content {
      .clearfix();
    }
  }

  .examedit__text-select {
    float: left;
    margin-right: 10px;
    width: calc(~'100% - 102px');

    &+button {
      float: left;
    }
  }
}
</style>
