<template>
  <div class="question-edit">
    <app-editor-title></app-editor-title>
      <Form
        :label-width="140"
        class="app-form-entire"
        :model="form"
        :rules="rules"
        ref="form"
      >
        <app-form-alert :errors="formErrors"></app-form-alert>
        <Row>
          <Col span="12">
            <Form-item label="学科" required>
              <Select
                placeholder="请选择..."
                v-model="form.grade_range_subject_id"
                @on-change="changeSubject"
                :disabled="isUpdate"
              >
                <Option
                  v-for="item in subjects"
                  :value="item.id"
                  :key="item.id"
                >{{ item.display_name }}</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="试题来源">
              <Input placeholder="请输入" v-model="form.from_name"></Input>
            </Form-item>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <Form-item label="题型" prop="question_type_id">
              <button-radio
                v-if="!isUpdate"
                v-model="form.question_type_id"
                :data="questionTypes"
                size="small"
                @change="changeQuestionType"
              ></button-radio>
              <!-- 如果是编辑状态，则只显示已选项 -->
              <Button v-if="isUpdate" size="small" type="primary">{{questionTypeFormat}}</Button>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="难度" required>
              <Slider
                v-model="form.question_difficulty"
                :tip-format="tipFormat"
                :step="1"
                :min="1"
                :max="5"
                show-tip = "always"
                show-stops
              ></Slider>
            </Form-item>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <Form-item label="类型" prop="paper_type">
              <button-radio
                v-model="form.paper_type"
                :data="paperTypes"
                size="small"
              ></button-radio>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="时间" prop="year">
              <button-radio
                v-model="form.year"
                :data="years"
                size="small"
              ></button-radio>
            </Form-item>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <Form-item label="关联知识点" prop="knowledge_ids">
              <app-tree-select
                v-model="form.knowledge_ids"
                :data="knowledge_tree"
                multiple
              ></app-tree-select>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="收藏标签">
              <Select placeholder="请选择..." multiple v-model="form.user_label_ids">
                <Option v-for="item in user_label_list" :value="item.id" :key="item.id">{{ item.display_name }}</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>

        <Form-item label="题目" prop="content">
          <app-editor v-if="!isLoading" v-model="form.content"></app-editor>
        </Form-item>

        <!-- 选择题 -->
        <div class="question-edit__answer" v-if="questionTemplateFormat === 1">
          <Form-item label="选项及答案" class="question-edit__answer__choice" required  prop="answers">
            <p class="question-edit__answer__tips">请选中
              <span class="color-primary">正确答案</span>
            </p>
          </Form-item>
          <Form-item
            v-for="(item,index) in form.answers"
            :key="index"
            :prop="`answers.${index}.content`"
            :rules="[$rules.required('选项内容')]"
          >
            <Row>
              <Col span="2">
                <Checkbox
                  :true-value="1"
                  :false-value="0"
                  v-model="item.is_correct"
                >{{index | alphabetize}}</Checkbox>
              </Col>
              <Col span="22">
                <app-editor
                  :height="80"
                  v-if="!isLoading"
                  v-model="item.content"
                ></app-editor>
              </Col>
            </Row>
          </Form-item>
          <Form-item>
            <div class="text-center question-edit__answer__btn">
              <Button type="dashed" icon="minus-round" @click="removeChoice">减少选项</Button>
              <Button type="dashed" icon="plus-round" @click="addChoice">增加选项</Button>
            </div>
          </Form-item>
        </div>


        <!-- 判断题 -->
        <Form-item
          label="答案"
          v-if="questionTemplateFormat === 2"
          required
        >
          <RadioGroup v-model="form.answers[0].is_correct">
            <Radio :label="1">对</Radio>
            <Radio :label="0">错</Radio>
          </RadioGroup>
        </Form-item>


        <!-- 填空题 -->
        <div class="question-edit__answer"  v-if="questionTemplateFormat === 3">
          <Form-item label="答案" required>
             <p class="question-edit__answer__tips">请在题目内容操作部分点击 <Icon type="plus-round" class="color-primary"/> 来插入填空</p>
          </Form-item>
          <Form-item
            v-for="(item,index) in form.answers"
            :key="index"
          >
            <Row>
              <Col span="2">填空题 <span class="color-primary">{{index+1}}</span></Col>
              <Col span="22">
                <app-editor
                  :height="80"
                  v-if="!isLoading"
                  v-model="item.content"
                ></app-editor>
              </Col>
            </Row>
          </Form-item>
        </div>

        <!-- 解答题 -->
        <Form-item
          label="答案"
          v-if="questionTemplateFormat === 4"
          prop="answers.0.content"
          :rules="[$rules.required('答案')]"
        >
          <app-editor v-if="!isLoading" v-model="form.answers[0].content" ></app-editor>
        </Form-item>

        <Form-item label="解析">
          <app-editor v-if="!isLoading" v-model="form.analysis" ></app-editor>
        </Form-item>

        <Form-item v-if="!isUpdate" label="添加后">
          <RadioGroup v-model="afterAdded">
            <Radio label="continue">继续添加</Radio>
            <Radio label="back">返回试题列表</Radio>
          </RadioGroup>
        </Form-item>

        <Form-item>
          <Button @click="goBack()">取消</Button>
          <Button type="primary" @click="choseStatus(1)" :loading="formLoading">
            存为草稿
          </Button>
          <Button type="primary" @click="choseStatus(2)" :loading="formLoading">
            提交审核
          </Button>
        </Form-item>

      </Form>
  </div>
</template>

<script>
/**
 * 题库中心 - 试题 -编辑试题
 * @author zml
 * @version 2017-09-14
 */

import { mapState } from 'vuex'
import Http from '@/utils/http'
import { GLOBAL } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import ButtonRadio from '../components/ButtonRadio'


// eslint-disable-next-line
const defaultAnswer = {
  option: '', // 选项
  content: '', // 内容
  is_correct: 0,
}

export default {
  name: 'question-question-edit',

  mixins: [form, goBack],

  components: {
    ButtonRadio,
  },

  data() {
    return {
      form: {
        grade_range_subject_id: null, // 年级学科id
        from_name: '', // 试题来源
        question_status: null, //
        question_type_id: null, // 题型id
        question_difficulty: 1, // 题目难度
        paper_type: null, // 试卷类型
        year: null, // 时间
        knowledge_ids: [], // 关联知识点
        user_label_ids: [], // 收藏标签
        content: '', // 题目内容
        analysis: '', // 题目解析
        answers: [{ ...defaultAnswer }], // 答案
      },

      rules: {
        question_type_id: [
          this.$rules.required('题型', 'number', 'change'),
        ],
        paper_type: [
          this.$rules.required('类型', 'number', 'change'),
        ],
        year: [
          this.$rules.required('时间', 'number', 'change'),
        ],
        knowledge_ids: [
          this.$rules.required('关联知识点', 'array', 'change'),
        ],
        content: [
          this.$rules.required('题目'),
        ],
        answers: [
          { validator: this.isSelected, trigger: 'change' },
        ],
      },

      subjects: [], // 年级学科数据源
      questionTypes: [], // 题型数据源
      difficulty: [], // 难度数据源
      paperTypes: [], // 考试类型数据源
      years: [], // 时间数据源
      knowledge_tree: [], // 知识点数据源

      test: [
        {
          id: 1,
          display_name: '知识点1',
        },
        {
          id: 2,
          display_name: '知识点2',
        },
        {
          id: 3,
          display_name: '知识点3',
        },
      ],

      afterAdded: 'back', // 添加后进行的操作 continue-继续 back-返回

    }
  },

  filters: {
    alphabetize(charCode) {
      const charCodeOfA = 'A'.charCodeAt(0)
      return String.fromCharCode(charCode + charCodeOfA)
    },
  },

  computed: {
    ...mapState({
      user_label_list: state => state.label.list, // 用户收藏标签数据源
      isLoading: state => state.loading,
    }),
    id() { // 获取用户id
      return this.$router.currentRoute.params.id
    },
    isUpdate() { // 判断是编辑还是新增
      return !!this.$router.currentRoute.params.id
    },
    questionTypeFormat() { // 题型名称格式化
      const { question_type_id } = this.form
      return question_type_id != null ?
        this.questionTypes.find(item => item.value === question_type_id).display_name : null
    },
    questionTemplateFormat() { // 题型模板
      const { question_type_id } = this.form
      return question_type_id != null ?
        this.questionTypes.find(item => item.value === question_type_id).question_template : null
    },
  },

  methods: {
    tipFormat(val) {
      let tip
      switch (val) {
        case 1:
          tip = '容易'
          break
        case 2:
          tip = '较易'
          break
        case 3:
          tip = '中等'
          break
        case 4:
          tip = '较难'
          break
        case 5:
          tip = '困难'
          break
        default:
          break
      }
      return tip
    },

    isSelected(rule, value, callback) { // 验证如果是选择题的话必须选一个选项
      if (this.questionTemplateFormat === 1) {
        if (value.some(item => item.is_correct === 1)) {
          callback()
        }

        callback(new Error('请至少选择一个选项'))
      }
      callback()
    },

    removeChoice() { // 移除选择题选项
      if (this.form.answers.length > 2) {
        this.form.answers.pop()
      }
    },

    addChoice() { // 添加选择题选项
      if (this.form.answers.length < 26) {
        this.form.answers.push({ ...defaultAnswer })
      }
    },

    handleReset() { // 重置选项
      this.form.question_type_id = null
      this.form.paper_type = null
      this.form.knowledge_ids.length = 0
    },

    getQuestionData() { // 获取题目详情
      return this.$http.get(`/question/${this.id}`)
        .then((res) => {
          this.form = res
        })
    },

    changeSubject(subjectId) { // 切换科目
      this.handleReset()
      this.$http.get(`/question/store_before?grade_range_subject_id=${subjectId}`)
        .then(({
          grade_range_subject_id,
          question_type,
          question_difficulty,
          paper_type,
          year,
          knowledge_tree,
        }) => {
          this.subjects = grade_range_subject_id
          this.questionTypes = question_type
          this.difficulty = question_difficulty
          this.paperTypes = paper_type
          this.years = year
          this.knowledge_tree = knowledge_tree
        })
    },

    changeQuestionType() { // 切换题型重置答案
      if (this.questionTemplateFormat === 1) {
        this.form.answers = [
          { ...defaultAnswer },
          { ...defaultAnswer },
          { ...defaultAnswer },
          { ...defaultAnswer },
        ]
      } else if (this.questionTemplateFormat === 3) {
        this.form.answers = [
          { ...defaultAnswer },
          { ...defaultAnswer },
          { ...defaultAnswer },
        ]
      } else {
        this.form.answers = [{ ...defaultAnswer }]
      }
    },

    choseStatus(status) { // 存为草稿||提交审核
      this.form.question_status = +status
      this.beforeSubmit()
    },

    submit() { // 提交表单
      const data = this.form
      ;(
        this.isUpdate ?
          this.$http.patch(`/question/${this.id}`, data) :
          this.$http.post('/question', data)
      )
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    successHandler() {
      this.formLoading = false
      if (this.afterAdded === 'back') {
        this.goBack(true)
      } else {
        location.reload()
      }
    },
  },

  created() {
    if (this.isUpdate) {
      this.getQuestionData().then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    } else {
      this.$store.commit(GLOBAL.LOADING.HIDE)
    }
  },

  beforeRouteEnter(to, from, next) {
    const subjectId = +to.params.subject
    Http.get(`/question/store_before?grade_range_subject_id=${subjectId}`)
      .then(({
        grade_range_subject_id,
        question_type,
        question_difficulty,
        paper_type,
        year,
        knowledge_tree,
      }) => {
        next((vm) => {
          /* eslint-disable no-param-reassign */
          vm.subjects = grade_range_subject_id
          vm.questionTypes = question_type
          vm.difficulty = question_difficulty
          vm.paperTypes = paper_type
          vm.years = year
          vm.knowledge_tree = knowledge_tree
          vm.form.grade_range_subject_id = subjectId
          /* eslint-enalbe */
        })
      })
  },
}
</script>

<style lang="less">
@import '~vars';

.question-edit {

  &__answer {

    .ivu-checkbox-inner {
      margin-right: 15px;
    }

    .ivu-form-item-error-tip {
      left: 70px;
    }

    &__choice {
      .ivu-form-item-error-tip {
        left: 0;
      }
    }

    &__btn {
      .ivu-btn {
        margin-right: 20px;
        color: @primary-color;
        border-color: @primary-color;
      }
    }

    &__tips {
      padding: 10px 0;
      line-height: 1;
      font-size: 14px;
    }
  }
}

</style>
