<template>
  <div class="system-department">
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2>
        <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="14" height="14"><path d="M320 0h384v256H320zm560 448H544v-64h-64v64H96v192h64V512h320v128h64V512h320v128h64V448h-48zM0 768h256v256H0zm384 0h256v256H384zm384 0h256v256H768z"/></svg>
        组织架构
      </h2>
      </Col>
    </Row>

    <departments :prepareCreate="prepareCreate" :prepareUpdate="prepareUpdate" :prepareRemove="prepareRemove"></departments>

    <create-modal v-model="modal.create" :item="currentItem" :isCreate="isCreate"></create-modal>
    <remove-modal v-model="modal.remove" :item="currentItem"></remove-modal>
  </div>
</template>

<script>
/**
 * 系统设置 - 组织架构
 * @author lmh
 * @version 2017-06-07-13 重写表格，实现折叠功能，并优化整体代码
 */

import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import Departments from './components/Departments'
import CreateModal from './components/CreateModal'
import RemoveModal from './components/RemoveModal'

export default {
  name: 'app-system-department',

  data() {
    return {
      currentItem: {},

      modal: {
        create: false,
        remove: false,
      },

      isCreate: false,
    }
  },

  methods: {
    prepareCreate(item) {
      this.currentItem = item
      this.isCreate = true
      this.modal.create = true
    },

    prepareUpdate(item) {
      this.currentItem = item
      this.isCreate = false
      this.modal.create = true
    },

    prepareRemove(item) {
      this.currentItem = item
      this.isCreate = false
      this.modal.remove = true
    },
  },

  components: {
    Departments,
    CreateModal,
    RemoveModal,
  },

  created() {
    this.$store.dispatch(SYSTEM.DEPARTMENT.INIT)
      .catch(() => {
        this.$Notice.error({ title: '无法访问数据，请稍后再试', duration: 0 })
      })
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>
