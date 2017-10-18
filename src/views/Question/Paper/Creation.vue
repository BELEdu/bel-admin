<template>
  <div class="question-paper-creation">
    <!-- 来源 -->
    <Form
      class="creation-source"
      :label-width="80"
      ref="places"
      :model="paper.places | translateToObject"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item
        v-for="(place, index) in paper.places"
        :key="index"
        :prop="`${index}`"
        label="来源"
        :rules="[{ required: true, validator: validatePlace(index) }]"
      >
        <Cascader
          :data="mapData"
          v-model="paper.places[index]"
          :clearable="false"
          @input="() => autoName(index === 0)"
        ></Cascader>
        <Icon
          v-show="index"
          type="android-delete"
          @click.native="deletePlace(index)"
        ></Icon>
      </Form-item>
    </Form>
    <!-- 添加来源 -->
    <div class="creation-source__add">
      <Button
        type="dashed"
        @click="addPlace"
      >+增加来源</Button>
    </div>

    <!-- 编辑信息 -->
    <Form
      class="creation-info"
      :label-width="80"
      :model="paper"
      :rules="paperRules"
      ref="paperConfig"
    >
      <!-- 时间 -->
      <Form-item
        class="creation-info__time"
        :label="year.label"
        prop="year"
      >
        <AppButtonRadio
          v-model="paper.year"
          :data="year.data"
          size="small"
          @change="autoName"
        />
      </Form-item>
      <!-- 科目 -->
      <Form-item
        :label="subjects.label"
        prop="subject_type"
      >
        <AppButtonRadio
          v-model="paper.subject_type"
          :data="subjects.data"
          size="small"
          @change="autoName"
        />
      </Form-item>
      <!-- 年级 -->
      <Form-item
        :label="grade.label"
        prop="grade"
      >
        <AppButtonRadio
          v-model="paper.grade"
          :data="grade.data"
          size="small"
          @change="autoName"
        />
      </Form-item>
      <!-- 试卷类型 -->
      <Form-item
        :label="paper_type.label"
        prop="paper_type"
      >
        <AppButtonRadio
          v-model="paper.paper_type"
          :data="paper_type.data"
          size="small"
          @change="autoName"
        />
      </Form-item>
      <Form-item
        class="creation-info__title"
        label="试卷标题"
        prop="display_name"
      >
        <Input
          v-model="paper.display_name"
        ></Input>
      </Form-item>
    </Form>

    <!-- 试卷正文 -->
    <section
      class="ivu-form creation-content"
    >
      <aside
        class="ivu-form-item-label"
      >
        试卷内容
      </aside>
      <article>
        <div
          class="section"
          v-for="(section, sindex) in paper.question_types"
          v-if="section.questions.length"
          :key="section.question_type_id"
        >
          <!-- 题型标题 -->
          <h2>
            {{sectionsView[sindex].vindex}}、
            {{section.display_name}}
            （
              共{{section.questions.length}}小题，
              总计{{sectionsView[sindex].score}}分
             ）
          </h2>
          <!-- 题目列表 -->
          <ul class="topic">
            <li
              class="topic-item"
              v-for="(topic, tindex) in section.questions"
              :key="topic.question_id"
            >
              <!-- 题目内容 -->
              <question
                :index="tindex + 1"
                :data="topic"
                :width="850"
              ></question>
              <!-- 操作条 -->
              <div class="topic-item__control">
                <span>分值</span>
                <InputNumber
                  size="small"
                  :min="0"
                  v-model="topic.score"
                  @on-change="initSectionsView(paper.question_types)"
                ></InputNumber>
                <Button
                  size="small"
                  @click="activateAnalysis(topic)"
                >查看解析</Button>
                <Button
                  size="small"
                  @click="() => {
                    updateTopic(tindex, sindex, topic.question_type_id)
                  }"
                >换题</Button>
                <Button
                  size="small"
                  @click="deleteTopic(section.questions, tindex, sindex)"
                >删除</Button>
                <Button
                  size="small"
                  :disabled="tindex === 0"
                  @click="sortTopic(section.questions, topic, tindex, 'up')"
                >上移</Button>
                <Button
                  size="small"
                  :disabled="tindex === section.questions.length - 1"
                  @click="sortTopic(section.questions, topic, tindex, 'down')"
                >下移</Button>
              </div>
            </li>
           </ul>
         </div>
      </article>
    </section>

    <footer>
      <Button
        type="ghost"
        @click="onCancel"
      >取消</Button>
      <Button
        type="ghost"
        @click="() => backToCompose()"
      >返回组卷</Button>
      <Button
        :loading="confirmLoading"
        type="primary"
        @click="prePaperCreation"
      >保存</Button>
    </footer>

    <QuestionAnalysisDialog
      :visible.sync="analysisModal.active"
      :data="analysisModal.data"
    />
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 生成试卷
 *
 * @author huojinzhao
 */

import mapData from '@/assets/china.json'
import { form } from '@/mixins'
import { GLOBAL, QUESTION } from '@/store/mutationTypes'
import { Question, QuestionAnalysisDialog } from '@/views/components'
import paperBiz from './mixins/paper'

export default {
  name: 'question-paper-creation',

  mixins: [paperBiz, form],

  components: {
    Question,
    QuestionAnalysisDialog,
  },

  data: () => ({
    // 模拟来源数据
    mapData,

    // 题型试题渲染数据 { 总分, 索引 }
    sectionsView: [],

    analysisModal: {
      active: false,
      data: {},
    },

    /* buttonRadio数据 */

    year: { label: '', data: [] },

    grade: { label: '', data: [] },

    subjects: { label: '', data: [] },

    paper_type: { label: '', data: [] },

    // 表单验证
    paperRules: {
      year: [
        { required: true, message: '必须选择时间' },
      ],
      subject_type: [
        { required: true, message: '必须选择分科信息' },
      ],
      grade: [
        { required: true, message: '必须选择年级信息' },
      ],
      paper_type: [
        { required: true, message: '必须选择类型信息' },
      ],
      display_name: [
        { required: true, message: '必须填写试卷标题' },
      ],
    },

    confirmLoading: false,
  }),

  watch: {
    'paper.question_types': 'initSectionsView',
  },

  filters: {
    translateToObject(value) {
      return { ...value }
    },
  },

  methods: {
    /* --- initialization --- */

    getPrecondition(subjectId) {
      /* eslint-disable prefer-template */
      const url = '/paper/store_before'
        + (subjectId ? `?grade_range_subject_id=${subjectId}` : '')
      /* eslint-enable */

      return this.$http.get(url)
        .then(({
          // 高级搜索
          year,
          grade,
          subject_type,
          paper_type,
        }) => {
          this.year = year
          this.grade = grade
          this.paper_type = paper_type
          this.subjects = subject_type
        })
    },

    initSectionsView(question_types) {
      if (question_types.length) {
        question_types.reduce((
          acc,
          section,
          sindex,
        ) => {
          this.figureSectionsView(sindex, acc)
          if (section.questions.length) {
            return acc + 1
          }
          return acc
        }, 1)
      }
    },

    initEdition(from) {
      const id = this.$route.params.id
      if (id
          && from.name
          && from.meta.source !== 'paperCompose'
      ) {
        this.$http.get(`/paper/${id}`)
          .then((res) => {
            // eslint-disable-next-line
            this.paper = { ...res }
            this.$store.commit(GLOBAL.LOADING.HIDE)
          })
      } else {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      }
    },

    /* --- Assistance --- */

    /**
     * 计算某题型的总分和在视图中的位置
     *
     * @param {number}  sindex - 题型在paper.question_types数据中的索引
     * @param {number}  vindex - 题型在视图中的索引
     */
    figureSectionsView(sindex, vindex) {
      const score = this.paper.question_types[sindex].questions
        .reduce((acc, question) => acc + question.score, 0)
      this.$set(this.sectionsView, sindex, { score, vindex })
    },

    validatePlace(index) {
      return (rule, value, callback) => {
        if (!this.paper.places[index].length) {
          return callback(new Error('来源信息不能为空'))
        }
        return callback()
      }
    },

    getDisplayName(value, list, prefix = '', suffix = '') {
      if (!value) return ''
      const target = list.find(item => item.value === value)
      return `${prefix}${target.display_name}${suffix}`
    },

    /**
     * 通过places[0]，兑换cascader数据的displayname
     *
     * @param {Array} place - cascader绑定的值
     */
    getPlaceName(index = 0, source = this.mapData) {
      const place = source
        .find(item => item.value === this.paper.places[0][index])
      if (place.children) {
        return `${place.label}${this.getPlaceName(index + 1, place.children)}`
      }
      return place.label
    },

    /* --- Control --- */

    onCancel() {
      this.$router.push(`/question/paper?${this.currentSubject}`)
    },

    addPlace() {
      this.$refs.places.validate((valid) => {
        if (valid) this.paper.places.push([])
      })
    },

    deletePlace(index) {
      this.paper.places.splice(index, 1)
    },

    backToCompose(question_type) {
      const host = '/question/paper/composition'
      const id = this.$route.params.id
      const questionType = question_type
        ? `&equal[question_type_id]=${question_type}`
        : ''
      if (id) {
        return this.$router
          .push(`${host}/${id}?${this.currentSubject}${questionType}`)
      }
      return this.$router
        .push(`${host}?${this.currentSubject}${questionType}`)
    },

    /* --- Bussiness --- */

    /* auto name */

    autoName(switcher = true) {
      if (!switcher) return
      const paper = this.paper
      const display = this.getDisplayName
      const placeName = this.paper.places[0].length
        ? this.getPlaceName()
        : ''
      paper.display_name = `${display(paper.year, this.year.data, '', '年')}`
        + ` ${placeName}`
        + ` ${display(paper.grade, this.grade.data)}`
        + ` ${display(paper.paper_type, this.paper_type.data)}`
        + `${display(paper.subject_type, this.subjects.data, '(', ')')}`
    },

    /* sort */

    sortTopic(list, tnode, tindex, sortType) {
      if (sortType === 'up') {
        this.exchangeNode(list, tnode, tindex, -1)
      } else {
        this.exchangeNode(list, tnode, tindex, 1)
      }
    },

    exchangeNode(list, node, index, target) {
      list.splice(index, 1, list[index + target])
      list.splice(index + target, 1, node)
    },

    /* deletion */

    deleteTopic(list, tindex) {
      list.splice(tindex, 1)
      this.initSectionsView(this.paper.question_types)
    },

    /* update topic */

    updateTopic(tindex, sindex, questionType) {
      const { PAPER } = QUESTION
      this.$store.commit(PAPER.CONFIRM_TEMPORY, { tindex, sindex })
      this.backToCompose(questionType)
    },

    /* check analysis */

    activateAnalysis(topic) {
      this.analysisModal.active = true
      this.analysisModal.data = topic
    },

    /* paper creation */

    prePaperCreation() {
      let trigger = true
      this.$refs.places.validate((valid) => { trigger = trigger && valid })
      this.$refs.paperConfig.validate((valid) => { trigger = trigger && valid })
      if (trigger) {
        this.createPaper()
          .then(() => this.onCancel())
          .catch(this.errorHandler)
          .then(() => { this.confrimLoading = false })
      }
    },

    createPaper() {
      const id = this.$route.params.id
      if (id) {
        return this.$http.patch(`/paper/${id}`, this.paper)
      }
      this.paper.grade_range_subject_id = this.currentSubjectId
      return this.$http.post('/paper', this.paper)
    },
  },
}
</script>

<style lang="less">
@import '~vars';
@import './mixins/paper.less';

@layout-width:    975px;
@layout-padding:  10px;
@layout-gutter:   10px;

.button-dashed-color(@text, @bd: transparent) {
  border-color: @bd;
  color: @text;
  cursor: pointer;

  &:hover {
    border-color: lighten(@bd, 8%);
    color: lighten(@text, 8%);
  }

  &:active {
    border-color: darken(@bd, 8%);
    color: darken(@text, 8%);
  }
}

.question-paper-creation {
  width: @layout-width;

  & .ivu-form-item-label {
    font-size: 14px;
  }

  & .ivu-form-item-error-tip {
    padding: 0 6px;
  }

  & .creation {

    &-source {

      & .ivu-cascader {
        display: inline-block;
        margin-left: 8px;
        width: 500px;
      }

      & .ivu-icon-android-delete {
        .button-dashed-color(@warning-color);

        display: inline-block;
        margin-left: 15px;
        vertical-align: middle;
        font-size: 18px;
      }

      &__add {
        margin: 20px 0 10px 0;
        padding-left: 350px;

        & > button {
          .button-dashed-color(@info-color, @info-color);

          padding: 5px 30px;
        }
      }
    }

    &-info {

      &__time {

        & .ivu-select {
          display: inline-block;
          width: 200px;
        }
      }

      &__title {

        & .ivu-input-wrapper {
          margin-left: 8px;
          width: 500px;
        }
      }
    }

    &-content {

      & > aside {
        width: 80px;
      }

      & > article {
        overflow: hidden;
      }

      & .section {
        .section()
      }

      & .topic {
        .topic()
      }
    }
  }

  & footer {
    margin-top: 20px;
    text-align: center;

    & > button {
      margin: 0 15px;
    }
  }
}
</style>
