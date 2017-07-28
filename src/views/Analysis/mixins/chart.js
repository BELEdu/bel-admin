import addDays from 'date-fns/add_days'
import eachDay from 'date-fns/each_day'
import format from 'date-fns/format'
import ChartCard from '../components/ChartCard'

export default {
  methods: {
    changeChart(range, chart) {
      const today = new Date()
      const days = eachDay(today, addDays(today, range - 1))
        .map(date => format(date, 'MM-DD'))
      chart.setOption({
        xAxis: {
          type: 'category',
          data: days,
        },
      })
    },
  },

  components: {
    ChartCard,
  },
}
