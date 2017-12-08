<template>
  <Modal
    class="question-label"
    :value="visible"
    @input="toggleModal"
    width="500"
    title="题目标签管理"
  >
    <p class="question-label__text">
      题目编号：<span class="color-primary">{{number}}</span>
    </p>
    <Table
      size="small"
      :columns="columns"
      :data="labelList"
      border
      class="app-table point-table"
    ></Table>

  </Modal>
</template>

<script>
import { mapState } from 'vuex'
import { createButton } from '@/utils'

export default {
  name: 'label-modal',

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Number,
    },
    number: {
      type: String,
    },
    // 这个其实是label_ids
    value: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      columns: [
        { title: '我的标签', key: 'display_name' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 120,
          render: createButton([
            {
              text: '添加收藏',
              type: 'success',
              isShow: ({ row }) => !(this.isAdded(row.id)),
              click: row => this.collectToggle(row.id, true),
            },
            {
              text: '移除收藏',
              type: 'warning',
              isShow: ({ row }) => this.isAdded(row.id),
              click: row => this.collectToggle(row.id, false),
            },
          ]),
        },
      ],

      needUpdateData: false, // 是否需要更新

      currentLabelIds: [], // 修改后的标签数组
    }
  },

  computed: {
    ...mapState({
      labelList: state => state.label.list,
    }),

    // 标签id组成的列表
    labelListIds() {
      return this.labelList.map(label => label.id)
    },
  },

  watch: {
    visible(val) {
      // 如果关闭弹窗的之前有成功操作过接口，则重新请求列表数据
      if (!val) {
        if (this.needUpdateData) {
          this.$emit('updateData', this.id, this.currentLabelIds)
        }
      } else {
        this.currentLabelIds = []
        this.needUpdateData = false
      }
    },
  },

  methods: {
    // 打开/关闭弹窗
    toggleModal(value) {
      this.$emit('update:visible', value)
    },

    // 该标签是否被收藏
    isAdded(label_id) {
      return this.value.includes(label_id)
    },

    // 添加/移除收藏标签
    collectToggle(label_id, isAdd) {
      // 根据操作取不同接口
      const api = isAdd ? '/user_label_add_question' : '/user_label_remove_question'
      // 根据操作来改变label_id数组
      this.currentLabelIds = isAdd ? [...this.value, label_id] :
        this.value.filter(item => item !== label_id)

      // 请求接口
      this.$http.post(api, {
        user_label_id: label_id,
        question_id: this.id,
      })
        .then(() => {
          this.$Message.success('操作成功')
          this.needUpdateData = true
          this.$emit('input', this.currentLabelIds)
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },
  },

}
</script>

<style lang="less">
@import '~vars';

.question-label {
  &__text {
    margin-top: 0;
  }
}
</style>
