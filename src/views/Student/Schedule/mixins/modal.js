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

  methods: {
    handlerModal(row, status = false) {
      if (status) {
        this.isRepeal = true
      } else {
        this.isRepeal = false
      }
      this.dialog.visible = true
      this.isDialogRender = true
      this.$store.commit(STUDENT.SCHEDULE.COURSE_ITEM, row)
    },
  },
}
