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
                    <td class="ivu-table-column-left" width="220">
                      <div class="ivu-table-cell">
                        <FormItem
                          :prop="`data.${index}.id`"
                          :rules="$rules.required('知识点', 'number', 'change')"
                        >
                          <Row>
                            <Col span="20">
                              <Select v-model="item.id">
                                <Option v-for="konwledge in tree" :value="konwledge" :key="konwledge">{{ konwledge }}</Option>
                              </Select>
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
                          <InputNumber :min="0" v-model="item.duration" size="small"></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.frequency`">
                          <InputNumber :min="0" v-model="item.frequency" size="small"></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.score`">
                          <InputNumber :min="0" v-model="item.score" size="small"></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.art_duration`">
                          <InputNumber :min="0" v-model="item.art_duration" size="small"></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.art_frequency`">
                          <InputNumber :min="0" v-model="item.art_frequency" size="small"></InputNumber>
                        </FormItem>
                      </div>
                    </td>
                    <td class="ivu-table-column-center" v-if="hasDepartment">
                      <div class="ivu-table-cell">
                        <FormItem :prop="`data.${index}.art_score`">
                          <InputNumber :min="0" v-model="item.art_score" size="small"></InputNumber>
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
            <!-- <div class="ivu-table-tip" v-if="form.data.length === 0">
              <table cellspacing="0" cellpadding="0" border="0">
                <tbody>
                  <tr>
                    <td>
                      <span>暂无知识点</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> -->
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
// import edata from './edata'

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
  },

  data() {
    return {
      loading: {
        modal: false,
        delete: false,
      },

      tree: [34, 35, 36, 37, 43, 44, 45],
    }
  },

  computed: {
    hasDepartment() {
      return this.form.grade_range_subject_id === 5
    },
  },

  methods: {
    closeModal() { // 关闭该模态框
      this.formErrors = {}
      this.$emit('closeEditModal')
    },

    addKnowledge() {
      this.form.data.push({ ...defaultKnowledge })
    },

    removeKnowledge(index) {
      this.form.data.splice(index, 1)
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
