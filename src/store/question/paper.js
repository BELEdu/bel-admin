/**
 * 题库中心 - 试卷
 *
 * @author huojinzhao
 */

import { QUESTION } from '../mutationTypes'

const { PAPER } = QUESTION

export default {
  state: {
    // 换题缓存
    tempory: {
      active: false,
      tindex: null,
      sindex: null,
    },

    paper: {
      grade: null,
      subject_type: null,
      paper_type: null,
      year: null,
      display_name: '',
      question_types: [],
      grade_range_subject_id: null,
      campuses: [[]],
      exam_time: 0,
    },
  },

  mutations: {
    [PAPER.COMPOSE](state, paper) {
      state.paper = paper
    },

    [PAPER.RECORD](state) {
      localStorage.setItem(
        'CHG_PAPER_CATCH',
        JSON.stringify(state.paper),
      )
      localStorage.setItem(
        'CHG_QUESTION_TEMPORY',
        JSON.stringify(state.tempory),
      )
    },

    [PAPER.RELOAD](state) {
      const paper = localStorage.getItem('CHG_PAPER_CATCH')
      state.paper = { ...state.paper, ...JSON.parse(paper) }
      const tempory = localStorage.getItem('CHG_QUESTION_TEMPORY')
      state.tempory = { ...state.tempory, ...JSON.parse(tempory) }
    },

    [PAPER.CONFIRM_TEMPORY](state, tempory) {
      state.tempory = { active: true, ...tempory }
    },

    [PAPER.CANCEL_TEMPORY](state) {
      state.tempory.active = false
    },
  },
}
