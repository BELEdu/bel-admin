<template>
  <Modal v-model="visible"
         :width="width"
         :closable="false"
         :mask-closable="false">
    <p slot="header" class="modal-header">
      <slot name="header"></slot>
    </p>
    <slot></slot>
    <div slot="footer">
      <div class="default-btn">
        <Button type="ghost" size="large" @click="cancel" v-if="cancelBtn">{{cancelValue}}</Button>
        <Button type="primary" size="large" :loading="loading" @click="ok" v-if="okBtn">{{okValue}}</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
  /**
   * 学员列表信息弹窗
   * @author  chenliangshan
   * @version 2017/07/13
   */
  export default {
    name: 'student-list-modal',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      width: {
        type: Number,
        default: 800,
      },
      okBtn: {
        type: Boolean,
        default: true,
      },
      okValue: {
        type: String,
        default: '确认',
      },
      cancelBtn: {
        type: Boolean,
        default: true,
      },
      cancelValue: {
        type: String,
        default: '取消',
      },
      loading: {
        type: Boolean,
        required: false,
      },
    },
    data() {
      return {
        visible: this.value,
      }
    },
    watch: {
      value(val) {
        this.visible = val
      },
      visible(val) {
        if (val === false) {
          this.$emit('input', val)
        }
      },
    },
    methods: {
      ok() {
        this.$emit('on-ok')
      },

      cancel() {
        this.$emit('input', false)
        this.$emit('on-cancel')
      },
    },
  }
</script>

<style lang="less" scoped>
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
  .default-btn {
    &, + .assist-btn {
      text-align: center;
    }
    > button {
      + button {
        margin-left: 16%;
      }
    }
  }
</style>
