<template>
  <Modal
    class="paper-config__container"
    title="试卷设置"
    ok-text="确定"
    cancel-text="取消"
    :value="value"
    :width="600"
    @on-ok="onOk"
    @on-cancel="onCancel"
  >
    <Form class="paper-config" :label-width="80">
      <Form-item label="试卷标题">
        <Radio-group>
          <Radio :label="3">
            <span>显示</span>
          </Radio>
          <Radio :label="1">
            <span>不显示</span>
          </Radio>
        </Radio-group>
        <Input placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="装订线">
        <Radio-group>
          <Radio :label="3">
            <span>显示</span>
          </Radio>
          <Radio :label="1">
            <span>不显示</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="试卷信息栏">
        <Radio-group>
          <Radio :label="3">
            <span>显示</span>
          </Radio>
          <Radio :label="1">
            <span>不显示</span>
          </Radio>
        </Radio-group>
        <Input placeholder="请输入" value="考试范围：XXXXX  考试时间：XXXX 命题人：XXX"></Input>
      </Form-item>
      <Form-item label="考生输入栏">
        <Radio-group>
          <Radio :label="3">
            <span>显示</span>
          </Radio>
          <Radio :label="1">
            <span>不显示</span>
          </Radio>
        </Radio-group>
        <Input placeholder="请输入" value="学校：______ 姓名：______ 班级：______ 考号：______"></Input>
      </Form-item>
      <Form-item label="誊分栏">
        <Radio-group>
          <Radio :label="3">
            <span>显示</span>
          </Radio>
          <Radio :label="1">
            <span>不显示</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="注意事项栏">
        <Radio-group>
          <Radio :label="3">
            <span>显示</span>
          </Radio>
          <Radio :label="1">
            <span>不显示</span>
          </Radio>
        </Radio-group>
        <Input type="textarea" value="注意：本试卷包含Ⅰ、Ⅱ两卷。第Ⅰ卷为选择题，所有答案必须用2B铅笔涂在答题卡中相应的位置。第Ⅱ卷为非选择题，所有答案必须填在答题卷的相应位置。答案写在试卷上均无效，不予记分。" :rows="4"></Input>
      </Form-item>
    </Form>
  </Modal>
</template>

<script>
export default {

  props: {
    value: {
      type: Boolean,
      require: true,
    },
  },

  methods: {
    onOk() {
      this.$emit('input', false)
    },

    onCancel() {
      this.$emit('input', false)
    },
  },
}
</script>

<style lang="less">
@import '~vars';

@gutter-block: 8px;

.paper-config__container {

  // ivu style custom
  .ivu-modal-footer {
    text-align: center;

    >button {
      width: 80px;

      &:first-child {
        margin-right: 10px;
        border: 1px solid @border-color-base;
        color: @subsidiary-color;

        &:hover {
          border-color: @link-color;
          color: @link-color;
        }
      }
    }
  }
}

.paper-config {

   >.ivu-form-item {
    border-bottom: 1px dashed @border-color-split;
    padding-bottom: @gutter-block;
  }

  >.ivu-form-item:last-child {
    margin: 0;
    border: none;
  }

 // ivu style custom
  .ivu-radio-group {
    display: block;
  }

  .ivu-form-item-label {
    font-weight: bold;
  }
}

</style>
