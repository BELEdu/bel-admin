<template>
  <div>
    业务管理
    <app-pager :data="data" @on-change="getResults"></app-pager>
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-business',

  data: () => ({
    data: undefined,
  }),

  methods: {
    getResults(page = 1) {
      return this.$http.get(`/user?page=${page}`)
        .then((data) => {
          this.data = data
        })
    },
  },

  created() {
    this.getResults()
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>

<style>

</style>
