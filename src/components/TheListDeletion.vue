<template>
  <Modal
    :value="control.visible"
    :width="width"
    @on-cancel="closeWarn"
  >
    <!-- title -->
    <p
      class="color-warning text-center"
      slot="header"
    >
      <Icon type="information-circled"></Icon>
      <span>{{ view.title }}</span>
    </p>
    <div>{{ view.message }}</div>
    <!-- 按钮 -->
    <div slot="footer">
      <!--确认删除-->
      <Button
        :loading="control.confirmLoading"
        type="warning"
        size="large"
        long
        @click="deleteItem({
          request: deletionRequest,
          requestError: deletionRequestError,
        })"
      >
        删除
      </Button>
    </div>
  </Modal>
</template>

<script>
/**
 * 列表删除警告组件
 *
 * @author huojinzhao
 */

import { createNamespacedHelpers } from 'vuex'

const {
  mapState,
  mapActions,
  mapMutations,
} = createNamespacedHelpers('utils/listDeletion')

export default {
  name: 'TheListDeletion',

  data: () => ({
    width: 360,
  }),

  computed: {
    ...mapState(['control', 'view']),

    $_uri() {
      return this.$route.meta.uri
    },
  },

  methods: {
    ...mapActions(['deleteItem']),

    ...mapMutations(['closeWarn']),

    deletionRequest(id) {
      return this.$http.delete(`${this.$_uri}/${id}`)
    },

    deletionRequestError(error) {
      this.$Notice.error({
        title: '删除失败',
        desc: error.message,
        duration: 0,
      })
    },
  },
}
</script>
