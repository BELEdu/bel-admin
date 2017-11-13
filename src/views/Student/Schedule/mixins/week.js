import { mapState } from 'vuex'
import { startOfWeek, endOfWeek, addDays, isEqual } from 'date-fns'
import { formatDate } from '@/utils/date'

export default {
  data() {
    return {
      startDate: '',
      baseDate: new Date(),
      query: {
        'between[course_date]': [],
      },
    }
  },

  computed: {
    ...mapState({
      currentTip: state => state.student.schedule.tip,
    }),

    currentDaily() {
      /* eslint-disable */
      let arr = Array(6).fill(null)
      let day = [{
        value: `${this.startDate} (${this.getDay(this.startDate)})`,
        isDay: isEqual(formatDate(this.baseDate || new Date()), this.startDate),
        random_id: this.random(),
      }]
      arr.forEach((val, key) => {
        const daily = formatDate(addDays(new Date(this.startDate), key + 1))
        day.push({
          value: `${daily} (${this.getDay(daily)})`,
          isDay: isEqual(formatDate(this.baseDate || new Date()), daily),
          random_id: this.random(),
        })
      })
      return day
    }
  },

  watch: {
    // 根据baseDate计算出一周的首天与末天，并赋值给query
    baseDate(val) {
      const date = val || new Date()
      this.query['between[course_date]'] = [
        formatDate(startOfWeek(date, { weekStartsOn: 1 })),
        endOfWeek(date, { weekStartsOn: 1 }),
      ]
    },
  },

  methods: {
    random() {
      return `${Math.random().toString(36).substring(3, 8)}`
    },

    // 查看上一周课表，把baseDate减去7天
    getPrevWeek() {
      this.baseDate = addDays(this.baseDate || this.startDate, -7)
      this.$nextTick(() => this.search())
    },

    // 查看上一周课表，把baseDate加上7天
    getNextWeek() {
      this.baseDate = addDays(this.baseDate || this.startDate, 7)
      this.$nextTick(() => this.search())
    },

    // 获取星期
    getDay(date) {
      const num = new Date(date).getDay()
      const day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      return day[num]
    },

    // 更新参数值
    updateConfVal(to) {
      const courseDate = to.query['between[course_date]']
      const startDate = courseDate ? courseDate[0] : new Date()
      this.startDate = formatDate(startOfWeek(startDate, { weekStartsOn: 1 }))
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.updateConfVal(to)
      vm.baseDate = vm.startDate
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.updateConfVal(to)
    next()
  },
}
