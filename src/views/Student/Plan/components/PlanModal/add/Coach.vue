<template>
  <div class="plan-modal__add-coach">
    <app-knowledge-tree
    :data="baseData" v-model="formItem.points"
    max-height="480px"
    @select="data => selectedData = data"></app-knowledge-tree>
  </div>
</template>

<script>
  /**
   * 学习计划-添加知识点
   */

  import AppKnowledgeTree from '@/components/AppKnowledgeTree'

  export default {
    name: 'add-coach',

    components: { AppKnowledgeTree },

    data() {
      return {
        render: false,

        formItem: {
          points: [],
        },

        baseData: [],
      }
    },

    created() {
      this.$http.get('/knowledge/tree/1')
        .then((res) => {
          this.baseData = res
        })
    },
  }
</script>

<style lang="less">
  .plan-modal {
    &.add-coach {

    }
  }
</style>
