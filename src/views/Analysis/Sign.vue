<template>
  <div class="analysis-data">
    <Tabs class="app-tabs" type="card">
      <Tab-pane label="图形报表" name="graph">
        <graph></graph>
      </Tab-pane>
      <Tab-pane label="详细报表" name="detail">
        <detail></detail>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'
import Graph from './components/Graph'
import Detail from './components/Detail'

export default {
  name: 'app-analysis-data',

  components: {
    Graph,
    Detail,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>
