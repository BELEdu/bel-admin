/**
 * 周、日课表弹窗操作
 * @author chenliangshan
 * @version 2017-10-26
 */

import { STUDENT } from '@/store/mutationTypes'

const courseModal = () => import('../modal')

export default {

  components: {
    courseModal,
  },

  data() {
    return {
      dialog: {
        visible: false,
      },

      isDialogRender: false,

      isRepeal: false,
    }
  },

  watch: {
    dialog: {
      handler(val) {
        if (!val.visible) {
          setTimeout(() => {
            this.isRepeal = null
          }, 300)
        }
      },
      deep: true,
    },
  },

  methods: {
    handlerModal(row, status = false) {
      this.isRepeal = status
      this.dialog.visible = true
      this.isDialogRender = true
      this.$store.commit(STUDENT.SCHEDULE.COURSE_ITEM, row)
    },
  },
}
