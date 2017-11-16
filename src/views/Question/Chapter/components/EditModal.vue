<template>
  <div>
    <Modal
      :value="value"
      @input="value => $emit('input', value)"
      :title="title"
      @on-cancel="closeModal()"
      :maskClosable="true"
      :width='850'
      class="chapter-edit"
    >
      <!-- 表单 -->
      <Form ref="form" :model="form">

        <!-- 提交报错 -->
        <app-form-alert :errors="formErrors"></app-form-alert>

        <!-- 标题 -->
        <h3 class="chapter-edit__title color-primary">章节：{{form.display_name}}</h3>

        <!-- 表格 -->
        <div class="app-table point-table ivu-table-wrapper">
          <!-- <div class="ivu-table ivu-table-small ivu-table-border"> -->
          <div class="ivu-table ivu-table-small">
            <div class="ivu-table-header">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <thead>
                  <tr>
                    <th class="ivu-table-column-left" width="260">
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
                    <td class="ivu-table-column-left" width="260">
                      <div class="ivu-table-cell">
                        <FormItem
                          :prop="`data.${index}.id`"
                          :rules="$rules.required('知识点', 'number', 'change')"
                        >
                          <Row>
                            <Col span="20">
                              <app-tree-select
                                :key="item.id"
                                v-if="isEdit"
                                v-model="item.id"
                                :data="knowledgeTree"
                                @change="(value) => changeKnowledge(value, index)"
                              ></app-tree-select>

                              <span v-else>{{item.display_name}}</span>

                            </Col>
                            <Col span="4">
                              <Button
                                v-if="isEdit"
                                type="text"
                                icon="close"
                                size="small"
                                @click="removeKnowledge(index)"
                              ></Button>
                            </Col>
                          </Row>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem
                          v-if="isEdit"
                          :prop="`data.${index}.duration`"
                        >
                          <InputNumber
                            v-model="item.duration"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                        <span v-else>{{item.duration}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem
                          v-if="isEdit"
                          :prop="`data.${index}.frequency`"
                        >
                          <InputNumber
                            v-model="item.frequency"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                        <span v-else>{{item.frequency}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem
                          v-if="isEdit"
                          :prop="`data.${index}.score`"
                        >
                          <InputNumber
                            v-model="item.score"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                        <span v-else>{{item.score}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem
                          v-if="isEdit"
                          :prop="`data.${index}.art_duration`"
                        >
                          <InputNumber
                            v-model="item.art_duration"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                        <span v-else>{{item.art_duration}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem
                          v-if="isEdit"
                          :prop="`data.${index}.art_frequency`"
                        >
                          <InputNumber
                            v-model="item.art_frequency"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                        <span v-else>{{item.art_frequency}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem
                          v-if="isEdit"
                          :prop="`data.${index}.art_score`"
                        >
                          <InputNumber
                            v-model="item.art_score"
                            :min="0"
                            :disabled="item.chapter_knowledge_type === 0"
                          ></InputNumber>
                        </FormItem>
                        <span v-else>{{item.art_score}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" width="80">
                      <div class="ivu-table-cell">
                        <Checkbox
                          v-if="isEdit"
                          :disabled="!isEdit"
                          :true-value="1"
                          :false-value="0"
                          v-model="item.chapter_knowledge_type"
                        ></Checkbox>
                        <span v-else>
                          <Icon v-if="item.chapter_knowledge_type === 1" class="color-success" type="checkmark" />
                          <Icon v-if="item.chapter_knowledge_type === 0" class="color-error" type="close-round" />
                        </span>
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
          <Button
            v-if="isEdit"
            type="dashed"
            icon="plus-round"
            @click="addKnowledge"
          >点击添加知识点</Button>
        </div>

      </Form>
      <!-- 表单END -->

      <!-- 章节解析 -->
      <div v-if="value">
        <h3 class="chapter-edit__title color-primary">章节解析</h3>
        <app-editor
          :height="250"
          v-model="form.analysis"
        ></app-editor>
      </div>

      <!-- 自定义底部 -->
      <div slot="footer">
        <Button
          type="ghost"
          size="large"
          @click="closeModal"
        >取消</Button>

        <Button
          v-if="isEdit"
          type="primary"
          size="large"
          :loading="formLoading"
          @click="confirm"
        >确认</Button>
      </div>

    </Modal>

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
    isEdit: {
      type: Boolean,
      required: true,
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
    // 弹窗标题
    title() {
      return this.isEdit ? '编辑章节' : '查看章节'
    },

    // 是否有文理分科（这里暂时只处理了高中数学）
    hasDepartment() {
      return this.form.grade_range_subject_id === 5
    },

    // 年级学科
    subjectId() {
      return +this.$route.query['equal[grade_range_subject_id]']
    },
  },

  watch: {
    // 每当父组件的年级学科改变时，预请求知识点树数据
    subjectId(val) {
      this.getKnowledgeTree(val)
    },
  },

  methods: {
    // 获取知识点树
    getKnowledgeTree(id) {
      this.$http.get(`/knowledge/tree/${id}`)
        .then((res) => {
          this.knowledgeTree = res
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 关闭该模态框
    closeModal() {
      this.formErrors = {}
      this.$emit('closeEditModal')
    },

    // 添加知识点
    addKnowledge() {
      this.form.data.push({ ...defaultKnowledge })
    },

    // 移除知识点
    removeKnowledge(index) {
      this.form.data.splice(index, 1)
    },

    // 更改&选择知识点时获取该知识点详情
    changeKnowledge(value, index) {
      const { data } = this.form
      if (value) {
        this.$http.get(`/knowledge/${value}`)
          // .then(({
          //   duration,
          //   frequency,
          //   score,
          //   art_duration,
          //   art_frequency,
          //   art_score,
          // }) => {
          //   data[index].duration = duration
          //   data[index].frequency = frequency
          //   data[index].score = score
          //   data[index].art_duration = art_duration
          //   data[index].art_frequency = art_frequency
          //   data[index].art_score = art_score
          // })
          .then((res) => {
            data[index] = {
              ...res,
              chapter_knowledge_type: 0,
            }
          })
          .catch(({ message }) => {
            this.$Message.error(message)
          })
      }
    },

    // 提交前判断
    confirm() {
      if (this.form.data.length > 0) {
        this.beforeSubmit()
      } else {
        this.submit()
      }
    },

    // 提交
    submit() {
      this.$http.patch(`/chapter/${this.form.id}`, this.form)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 成功回调
    successHandler() {
      this.$Message.success('提交成功！')
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
