import { startOfWeek, endOfWeek, addDays } from 'date-fns'

export default {
  data() {
    return {
      baseDate: new Date(),
      query: {
        'between[created_at]': [],
        'equal[subject_id]': '',
        'equal[schedule_status]': '',
      },
    }
  },

  watch: {
    // 根据baseDate计算出一周的首天与末天，并赋值给query
    baseDate(val) {
      this.query['between[created_at]'] = [
        startOfWeek(val, { weekStartsOn: 1 }),
        endOfWeek(val, { weekStartsOn: 1 }),
      ]
    },
  },

  methods: {
    // 查看上一周课表，把baseDate减去7天
    getPrevWeek() {
      this.baseDate = addDays(this.baseDate, -7)
      this.$nextTick(() => this.search())
    },

    // 查看上一周课表，把baseDate加上7天
    getNextWeek() {
      this.baseDate = addDays(this.baseDate, 7)
      this.$nextTick(() => this.search())
    },
  },

  created() {
    const startDate = this.query['between[created_at]'][0]
    if (startDate) {
      this.baseDate = startDate
    }
  },
}
