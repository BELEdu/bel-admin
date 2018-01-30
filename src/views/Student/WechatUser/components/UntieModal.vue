<template>
  <Modal
    :value="visible"
    @input="toggleModal"
    title="学员解绑"
    width="416"
  >
    <Tag
      v-for="(student,index) in studentData"
      :key="index"
      type="dot"
      closable
      @on-close="unbind(index,student.display_name,student.id,student.pivot.wechat_user_id)"
    >{{student.display_name}}</Tag>
  </Modal>
</template>

<script>
/**
 * 解绑学员弹窗
 * @author zml
 * @version 2017-01-30
 */

export default {
  name: 'untie-modal',

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    students: {
      type: Array,
    },
  },

  data() {
    return {
      studentData: [],
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.studentData = this.students
      }
    },
  },

  methods: {
    // 监听弹窗的显示/隐藏
    toggleModal(val) {
      this.$emit('update:visible', val)
    },

    // 解绑学员
    unbind(index, name, studentId, userId) {
      this.$Modal.confirm({
        title: '确认解绑',
        content: `学员姓名：<span class="color-primary">${name}</span> ，解绑不可逆，操作需谨慎`,
        onOk: () => {
          this.$http.post(`/wechatuser/unbind/${userId}`, {
            student_id: studentId,
          })
            .then(() => {
              this.studentData.splice(index, 1)
              this.$emit('update')
            })
            .catch(({ message }) => {
              this.$Message.error(message)
            })
        },
      })
    },
  },

}
</script>

<style>

</style>
