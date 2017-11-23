/**
 * 周、日课表弹窗操作
 * @author chenliangshan
 * @version 2017-10-26
 */

import { STUDENT } from '@/store/mutationTypes'

const courseModal = () => import('../modal')
const notesModal = () => import('../modal/notes')

export default {

  components: {
    courseModal,
    notesModal,
  },

  data() {
    return {
      dialog: {
        visible: false,
        notes: false,
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

    // 查看课堂笔记
    handlerNotesModal(row) {
      this.dialog.notes = true
      this.$store.commit(STUDENT.SCHEDULE.COURSE_ITEM, row)
    },
  },
}
