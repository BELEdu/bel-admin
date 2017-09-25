<template>
  <div>

    <app-form-modal
      :value="value"
      @input="value => $emit('input', value)"
      title="编辑章节"
      :loading="formLoading"
      @on-ok="beforeSubmit()"
      @on-cancle="closeModal()"
      :maskClosable="true"
      :width='800'
      class="chapter-edit"
    >
      <!-- 表单 -->
      <Form ref="form" :model="form">

        <!-- 提交报错 -->
        <app-form-alert :errors="formErrors"></app-form-alert>

        <!-- 标题 -->
        <h3 class="chapter-edit__title">章节：{{form.display_name}}</h3>

        <!-- 表格 -->
        <div class="app-table point-table ivu-table-wrapper">
          <!-- <div class="ivu-table ivu-table-small ivu-table-border"> -->
          <div class="ivu-table ivu-table-small">
            <div class="ivu-table-header">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <thead>
                  <tr>
                    <th class="ivu-table-column-left" width="220">
                      <div class="ivu-table-cell">
                        <span>知识点</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{ hasDepartment?'理科时长':'时长' }}</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{ hasDepartment?'理科频次':'频次' }}</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{ hasDepartment?'理科分值':'分值' }}</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <span>文科时长</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <span>文科频次</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <span>文科分值</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center" width="80">
                      <div class="ivu-table-cell">
                        <span>属于本节</span>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <tbody class="ivu-table-tbody">
                  <tr class="ivu-table-row"
                    v-for="(item,index) in form.data" :key="index"
                  >
                    <td class="ivu-table-column-left" width="280">
                      <div class="ivu-table-cell">
                        <FormItem
                          :prop="`data.${index}.id`"
                          :rules="$rules.required('知识点', 'number', 'change')"
                        >
                          <Row>
                            <Col span="20">
                              <app-tree-select
                                v-model="item.id"
                                :data="JSON.parse(JSON.stringify(knowledgeTree))"
                                @change="(value) => changeKnowledge(value, index)"
                              ></app-tree-select>
                            </Col>
                            <Col span="4">
                              <Button type="text" icon="close" size="small" @click="removeKnowledge(index)"></Button>
                            </Col>
                          </Row>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.duration`">
                          <InputNumber
                            v-model="item.duration"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.frequency`">
                          <InputNumber
                            v-model="item.frequency"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.score`">
                          <InputNumber
                            v-model="item.score"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.art_duration`">
                          <InputNumber
                            v-model="item.art_duration"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.art_frequency`">
                          <InputNumber
                            v-model="item.art_frequency"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.art_score`">
                          <InputNumber
                            v-model="item.art_score"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" width="80">
                      <div class="ivu-table-cell">
                        <Checkbox
                          :true-value="1"
                          :false-value="0"
                          v-model="item.chapter_knowledge_type"
                        ></Checkbox>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 缺省信息 -->
            <div class="ivu-table-tip" v-if="form.data.length === 0">
              <table cellspacing="0" cellpadding="0" border="0">
                <tbody>
                  <tr>
                    <td>
                      <span>暂无知识点</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 添加按钮 -->
        <div class="chapter-edit__add">
          <Button type="dashed" icon="plus-round" @click="addKnowledge">点击添加知识点</Button>
        </div>

        <!-- 解析 -->
        <!-- <FormItem label="解析：">
          <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入章节解析..."></Input>
        </FormItem> -->

      </Form>
      <!-- 表单END -->

    </app-form-modal>

  </div>
</template>

<script>
/**
 * 编辑章节
 * @author zml
 * @version 2017-09-13
 */

import { form } from '@/mixins'

const defaultKnowledge = {
  id: null,
  duration: 0, // 理科时长
  frequency: 0, // 理科频次
  score: 0, // 理科分值
  art_duration: 0, // 文科频次时长
  art_frequency: 0, // 文科频次
  art_score: 0, // 文科频次
  chapter_knowledge_type: 0, // 是否属于本节
}

export default {
  name: 'question-chapter-edit-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    form: {
      type: Object,
      required: true,
    },
    defaultSubject: {
      type: Number,
    },
  },

  data() {
    return {
      loading: {
        modal: false,
      },
      knowledgeTree: [], // 知识点树
    }
  },

  computed: {
    hasDepartment() {
      return this.form.grade_range_subject_id === 5
    },

    subjectId() {
      return +this.$route.query['equal[grade_range_subject_id]'] || this.defaultSubject
    },
  },

  watch: {
    subjectId(val) { // 每当父组件的年级学科改变时，预请求知识点树数据
      this.getKnowledgeTree(val)
    },
  },

  methods: {
    getKnowledgeTree(id) { // 获取知识点树
      this.$http.get(`/knowledge/tree/${id}`)
        .then((res) => {
          this.knowledgeTree = res
        })
    },

    closeModal() { // 关闭该模态框
      this.formErrors = {}
      this.$emit('closeEditModal')
    },

    addKnowledge() { // 添加知识点
      this.form.data.push({ ...defaultKnowledge })
    },

    removeKnowledge(index) { // 移除知识点
      this.form.data.splice(index, 1)
    },

    changeKnowledge(value, index) { // 更改&选择知识点时获取该知识点详情
      const { data } = this.form
      if (data.filter(item => item.id === value).length > 1) {
        this.$Message.error('该知识点已添加过')
        // this.removeKnowledge(index)
      } else if (value) {
        this.$http.get(`/knowledge/${value}`)
          .then(({
            duration,
            frequency,
            score,
            art_duration,
            art_frequency,
            art_score,
          }) => {
            data[index].duration = duration
            data[index].frequency = frequency
            data[index].score = score
            data[index].art_duration = art_duration
            data[index].art_frequency = art_frequency
            data[index].art_score = art_score
          })
      }
    },

    submit() {
      this.$http.patch(`/chapter/${this.form.id}`, this.form)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    successHandler() {
      this.formLoading = false
      this.closeModal()
      this.$emit('fetchData')
    },

  },

  created() {
    this.getKnowledgeTree(this.subjectId)
  },
}
</script>

<style lang="less">
@import '~vars';
.chapter-edit {
  &__title {
    margin-bottom: 15px;
    font-weight: normal;
  }

  &__add {
    margin-top: 30px;
    text-align: center;

    & .ivu-btn-dashed {
      color: @primary-color;
      border-color: @primary-color;
    }
  }


  .ivu-table-body,
  .ivu-table,
  .app-table td .ivu-table-cell {
    overflow: visible;
  }

  .app-table td .ivu-table-cell {
    padding: 5px 8px;
  }

  .ivu-form-item {
    margin-bottom: 0;
  }

  .ivu-input-number {
    width: 100%;
  }

  .ivu-form-item-error-tip {
    position: relative;
  }
}
</style>
