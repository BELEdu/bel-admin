<template>
  <div>
    <ul class="analysis-rank__list">
      <li class="analysis-rank__item">
        <rank-card title="本月教师课时消耗排名" icon="ios-bell">
          <Table stripe :columns="columns1" :data="data1"></Table>
        </rank-card>
      </li>
      <li class="analysis-rank__item">
        <rank-card title="本月本校区新签排名" icon="android-checkbox">
          <Table stripe :columns="columns1" :data="data1"></Table>
        </rank-card>
      </li>
      <li class="analysis-rank__item">
        <rank-card title="本月分公司新签排名" icon="android-checkbox-outline">
          <Table stripe :columns="columns1" :data="data1"></Table>
        </rank-card>
      </li>
    </ul>
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'
import RankCard from './components/RankCard'

export default {
  name: 'app-analysis-rank',

  data: () => ({
    columns1: [
      { title: '排名名词', type: 'index', align: 'center' },
      { title: '教师姓名', key: 2, align: 'center' },
      { title: '课时消耗量', key: 3, align: 'center' },
    ],
    data1: [
      {
        2: '王小明',
        3: 18,
      },
      {
        2: '张小刚',
        3: 25,
      },
      {
        2: '李小红',
        3: 30,
      },
      {
        2: '周小伟',
        3: 26,
      },
    ],
  }),

  components: {
    rankCard: RankCard,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.analysis-rank {
  &__list {
    display: flex;
    justify-content: space-between;
  }

  &__item {
    flex-basis: 32%;
  }
}
</style>
