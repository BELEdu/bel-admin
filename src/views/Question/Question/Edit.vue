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
        <Row>
          <Col span="12">
            <Form-item label="学科">
              <Select placeholder="请选择..." v-model="form.grade_range_subject_id" :disabled="isUpdate">
                <Option v-for="item in grade_range_subject" :value="item.id" :key="item.id">{{ item.display_name }}</Option>
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
            <Form-item label="题型">
              <button-radio
                v-if="!isUpdate"
                v-model="form.question_type_id"
                :data="question_type"
                size="small"
              ></button-radio>
              <!-- 如果是编辑状态，则只显示已选项 -->
              <Button v-if="isUpdate" size="small" type="primary">{{questionTypeFormat}}</Button>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="难度">
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
            <Form-item label="类型">
              <button-radio
                v-model="form.paper_type"
                :data="paper_type"
                size="small"
              ></button-radio>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="时间">
              <button-radio
                v-model="form.year"
                :data="year"
                size="small"
              ></button-radio>
            </Form-item>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <Form-item label="关联知识点">
              <Input placeholder="请输入"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="收藏标签">
              <Select placeholder="请选择..." v-model="form.grade_range_subject_id">
                <Option v-for="item in user_label_list" :value="item.id" :key="item.id">{{ item.display_name }}</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>

        <Form-item label="题目">
          <Input v-model="form.content" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="请输入题目..."></Input>
        </Form-item>

        <!-- 选择题 -->
        <Form-item label="选项及答案">
          <ul class="question-edit__answer">
            <li v-for="(item,index) in form.answers" :key="index">
              <Row>
                <Col span="2"><Radio :true-value="1" :false-value="0" v-model="item.is_correct">A</Radio></Col>
                <Col span="22"><Input v-model="item.content"  type="textarea" placeholder="请输入..."></Input></Col>
              </Row>
            </li>
          </ul>

          <Row>
            <Col offset="2" span="22">
              <p class="question-edit__answer__tips">请选中正确答案</p>
            </Col>
          </Row>

          <!-- 操作按钮 -->
          <div class="text-center question-edit__answer__btn">
            <Button type="dashed" icon="minus-round" @click="removeChoice">减少选项</Button>
            <Button type="dashed" icon="plus-round" @click="addChoice">增加选项</Button>
          </div>

        </Form-item>

        <!-- 填空题 -->
        <Form-item label="答案">
          <Row>
            <Col offset="2" span="22">
              <p class="question-edit__answer__tips">请在题目内容操作部分点击 <Icon type="plus-round" class="color-primary"/> 来插入填空</p>
            </Col>
          </Row>
          <ul class="question-edit__answer">
            <li v-for="(item,index) in form.answers" :key="index">
              <Row>
                <Col span="2">{{`填空题 ${index+1}`}}</Col>
                <Col span="22"><Input v-model="item.content" type="textarea" placeholder="请输入..."></Input></Col>
              </Row>
            </li>
          </ul>
        </Form-item>

        <!-- 判断题 -->
        <Form-item label="答案">
          <RadioGroup v-model="form.answers[0].is_correct">
            <Radio :label="1">对</Radio>
            <Radio :label="0">错</Radio>
          </RadioGroup>
        </Form-item>

        <!-- 解答题 -->
        <Form-item label="答案">
          <Input v-model="form.answers[0].content" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="请输入题目..."></Input>
        </Form-item>

        <Form-item label="解析">
          <Input v-model="form.analysis" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="请输入题目..."></Input>
        </Form-item>

        <Form-item v-if="!isUpdate" label="添加后">
          <RadioGroup v-model="afterAdded">
            <Radio label="continue">继续添加</Radio>
            <Radio label="back">返回试题列表</Radio>
          </RadioGroup>
        </Form-item>

        <Form-item>
          <Button @click="goBack()">取消</Button>
          <Button type="primary" @click="beforeSubmit()" :loading="formLoading">
            存为草稿
          </Button>
          <Button type="primary" @click="beforeSubmit()" :loading="formLoading">
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

// import Http from '@/utils/http'
import { GLOBAL } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import ButtonRadio from '../components/ButtonRadio'
import edata from './edata'


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
        from_name: '来自xxx', // 试题来源
        question_status: 2, // 题型类型（如简答题计算题选择题）
        grade_range_subject_id: 3, // 学科
        question_type_id: 1, // 题型id
        question_difficulty: 2, // 题目难度
        paper_type: 1, // 试卷类型
        year: 2017, // 时间
        knowledge_ids: [2, 3], // 关联知识点
        user_label_ids: [1, 2], // 收藏标签
        content: '题目内容哦哦哦哦哦___, 222222___.', // 题目内容
        analysis: '题目解析啊啊啊啊啊', // 题目解析
        answers: [ // 答案
          {
            option: '',
            content: '填空1',
            is_correct: 1,
          },
          {
            option: '',
            content: '填空2',
            is_correct: 0,
          },
          {
            option: '',
            content: '填空3',
            is_correct: 0,
          },
        ],
      },

      rules: {},

      grade_range_subject: [],
      question_type: [],
      question_difficulty: [],
      paper_type: [],
      year: [],
      knowledge_tree: [],
      user_label_list: [],

      afterAdded: 'continue', // 添加后进行的操作 continue-继续 back-返回

    }
  },

  computed: {
    isUpdate() { // 判断是编辑还是新增
      return !!this.$router.currentRoute.params.id
    },
    questionTypeFormat() {
      const { question_type_id } = this.form
      return this.question_type.find(item => item.value === question_type_id).display_name
    },
    questionStatusFormat() {
      const { question_type_id } = this.form
      return this.question_type.find(item => item.value === question_type_id).question_template
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

    removeChoice() {
      if (this.form.answers.length > 2) {
        this.form.answers.pop()
      }
    },

    addChoice() {
      this.form.answers.push({ ...defaultAnswer })
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  beforeRouteEnter(to, from, next) {
    // Http.get('/question/store_before')
    return Promise.resolve(edata)
      .then(({
        grade_range_subject,
        question_type,
        question_difficulty,
        paper_type,
        year,
        knowledge_tree,
        user_label_list,
      }) => {
        next((vm) => {
          /* eslint-disable no-param-reassign */
          vm.grade_range_subject = grade_range_subject
          vm.question_type = question_type
          vm.question_difficulty = question_difficulty
          vm.paper_type = paper_type
          vm.year = year
          vm.knowledge_tree = knowledge_tree
          vm.user_label_list = user_label_list
          /* eslint-enalbe */
        })
      })
  },
}
</script>

<style lang="less">
@import '~vars';
.question-edit {

  &__answer{
    & li:not(:last-child) {
      margin-bottom: 15px;
    }

    &__btn{
      .ivu-btn {
        margin-right: 20px;
        color: @primary-color;
        border-color: @primary-color;
      }
    }

    &__tips{
      padding: 10px 0;
      line-height: 1;
      font-size: 14px;
    }
  }
}
</style>
