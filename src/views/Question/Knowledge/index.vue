<template>
  <div class="question-knowledge">
    <!-- 顶部搜索栏 -->
    <App-table-form @on-submit="search">
      <!-- 年段+学科 -->
      <Form-item>
        <Select
          v-model="query['equal[grade_range_subject_id]']"
          placeholder="年段学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subjects"
            :value="item.id"
            :key="item.id"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 重要性 -->
      <Form-item>
        <Select
          v-model="query['equal[knowledge_importance]']"
          placeholder="全部重要性"
          style="width: 150px;"
        >
          <Option
            v-for="item in importances"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
          <Option :value="''">全部重要性</Option>
        </Select>
      </Form-item>
      <!-- 关键字检索 -->
      <Form-item>
        <Input
          placeholder="搜索关键字"
          v-model="likeValue"
          style="width: calc(7em + 200px);"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width: 7em"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.field_name"
              :value="likeKey.field_name"
            >
              {{ likeKey.display_name }}
            </Option>
          </Select>
        </Input>
      </Form-item>
    </App-table-form>

    <!-- 中部辅助栏 -->
    <div class="app-content-topbar">
      <h2><Icon type="grid"/> 知识点列表</h2>
      <Button
        type="primary"
        @click="toBatchEdit"
      >
        批量编辑知识点
      </Button>
      <Button
        type='primary'
        :loading="structureLoading"
        @click="activateStructure"
      >
        编辑知识点结构
      </Button>
    </div>

    <!-- 下方知识点列表 -->
    <Table
      border
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"
    ></Table>

    <!-- 底部分页 -->
    <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 知识点编辑弹窗 -->

    <Modal
      class="question-knowledge__edition"
      title="编辑知识点"
      v-model="knowledgeEditionModal.active"
    >
      <!-- title -->
      <h3>知识点：{{editionInfo.display_name}}</h3>
      <!-- content -->
      <Form v-if="isNotBranch"
        :label-width="80" inline
      >
        <Form-item
          label="考试频次"
        >
          <InputNumber
            v-model="editionInfo.frequency"
          ></InputNumber>
        </Form-item>
        <Form-item
          label="考试分值"
        >
          <InputNumber
            v-model="editionInfo.score"
            :min="0"
            :max="100"
          ></InputNumber>
        </Form-item>
      </Form>
      <Form v-else
        :label-width="80" inline
      >
        <Form-item
          label="理科频次"
        >
          <InputNumber
            v-model="editionInfo.frequency"
          ></InputNumber>
        </Form-item>
        <Form-item
          label="理科分值"
        >
          <InputNumber
            v-model="editionInfo.score"
            :min="0"
            :max="100"
          ></InputNumber>
        </Form-item>
        <Form-item
          label="文科频次"
        >
          <InputNumber
            v-model="editionInfo.art_frequency"
          ></InputNumber>
        </Form-item>
        <Form-item
          label="文科分值"
        >
          <InputNumber
            v-model="editionInfo.art_score"
            :min="0"
            :max="100"
          ></InputNumber>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="deactivateKnowledgeEdition"
        >取消</Button>
        <Button
          type="primary"
          :loading="knowledgeEditionModal.confirmLoading"
          @click="editKnowledge"
        >确定</Button>
      </div>
    </Modal>

    <Modal
      class="question-knowledge__structure"
      v-model="structureModal.active"
      title="编辑知识点"
      @on-cancel="fetchData"
    >
      <TreeEditor
        keyword="知识点"
        :data="structureModal.data"
        @create="createNode"
        @delete="deleteNode"
        @sort="sortNode"
       >
        <div slot="header">
          以下为当前学科的所有知识点及其结构，您可增加与删除知识点，也可以调整知识点的排序，排序的调整仅限同父级下的同级排序。
        </div>
      </TreeEditor>
    </Modal>
  </div>
</template>

<script>
/**
 * 题库中心 - 知识点
 *
 * @author huojinzhao
 */

import Http from '@/utils/http'
import { createButton } from '@/utils'
import list from '@/mixins/list'
import { TreeEditor } from '@/views/components'

export default {
  name: 'QuestionKnowledge',

  mixins: [list],

  components: {
    TreeEditor,
  },

  data() {
    return {
      /* --- 顶部搜索 --- */

      likeKey: 'display_name',

      query: {
        'equal[grade_range_subject_id]': 0,
        'equal[knowledge_importance]': '',
      },

      likeKeys: [],

      subjects: [],

      importances: [],

      /* --- 中部辅助 --- */

      /* --- 下部列表 --- */

      tableConfig: [
        {
          title: '编号',
          key: 'number',
          align: 'center',
        },
        {
          title: '知识点',
          key: 'display_name',
          align: 'center',
        },
        {
          title: '上级',
          key: 'parent_name',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '排序',
          key: 'sort',
          align: 'center',
        },
        {
          title: '重要性',
          key: 'knowledge_importance',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '操作',
          key: 7,
          align: 'center',
          render: createButton([{
            text: '编辑',
            type: 'primary',
            click: this.activateKnowledgeEdition,
          }]),
        },
      ],

      buffer: {},

      knowledgeEditionModal: {
        active: false,
        confirmLoading: false,
        errorReasons: {},
      },

      editionInfo: {},

      structureModal: {
        active: false,
        data: [],
      },

      structureLoading: false,
    }
  },

  computed: {
    isNotBranch() {
      const subject = this.$route.query['equal[grade_range_subject_id]']
      return subject !== 5
    },

    colConfig() {
      const config = [...this.tableConfig]

      if (!this.isNotBranch) {
        config.splice(4, 1,
          {
            title: '文科重要性',
            key: 'knowledge_importance',
            align: 'center',
            sortable: 'custom',
          },
          {
            title: '理科重要性',
            key: 'art_knowledge_importance',
            align: 'center',
            sortable: 'custom',
          },
        )
      }

      return config
    },
  },

  methods: {
    /* 获取列表数据 */

    fetchBefore() {
      return Http.get('/knowledge/index_before')
        .then(({
          grade_range_subject_id,
          search_fields,
          knowledge_importance,
        }) => {
          this.subjects = grade_range_subject_id
          this.likeKeys = search_fields
          this.importances = knowledge_importance
        })
    },

    getData(query) {
      if (query) return this.m_getData(query)

      const asyncFlow = this.subjects.length
        ? Promise.resolve()
        : this.fetchBefore()

      return asyncFlow
        .then(() => {
          this.m_resetSearchField()
          const queryUri = `equal[grade_range_subject_id]=${this.subjects[0].id}`
          const path = `/question/knowledge?${queryUri}`
          this.$router.push(path)
        })
    },

    m_getData(query) {
      const url = `/knowledge${query}`
      return this.$http.get(url)
        .then((res) => { this.buffer = res })
    },

    m_resetSearchField() {
      this.likeKey = 'display_name'
      this.likeValue = ''

      this.query = {
        'equal[grade_range_subject_id]': this.subjects[0].id,
        'equal[knowledge_importance]': '',
      }
    },

    /* 编辑知识点 */

    activateKnowledgeEdition(row) {
      this.$http.get(`/knowledge/${row.id}`)
        .then((res) => {
          this.editionInfo = res
          this.knowledgeEditionModal.active = true
        })
    },

    deactivateKnowledgeEdition() {
      this.knowledgeEditionModal = {
        active: false,
        confirmLoading: false,
        errorReasons: {},
      }
    },

    editKnowledge() {
      this.knowledgeEditionModal.confirmLoading = true
      this.$http.patch(
        `/knowledge/${this.editionInfo.id}`,
        this.editionInfo,
      )
        .then(() => {
          this.fetchData()
          this.deactivateKnowledgeEdition()
        })
    },

    /* 编辑知识点结构 */

    activateStructure() {
      this.structureLoading = true

      const host = '/knowledge/tree'
      const id = this.$route.query['equal[grade_range_subject_id]']

      this.$http.get(`${host}/${id}`)
        .then((res) => {
          this.structureModal.data = res
          this.structureModal.active = true
          this.structureLoading = false
        })
    },

    createNode(data, success, fail) {
      this.$http.post('/knowledge', data)
        .then(res => success(res))
        .catch(error => fail(error))
    },

    deleteNode(id, success, fail) {
      this.$http.delete(`/knowledge/${id}`)
        .then(() => success())
        .catch(error => fail(error))
    },

    sortNode(data, success, fail) {
      this.$http.patch(`/knowledge/sort/${data.id}`, data)
        .then(() => success())
        .catch(error => fail(error))
    },

    /* 去批量编辑知识点 */

    toBatchEdit() {
      const id = this.$route.query['equal[grade_range_subject_id]']
        ? this.$route.query['equal[grade_range_subject_id]']
        : this.subjects.default
      this.$router.push(`/question/knowledge/edition/${id}`)
    },
  },
}
</script>

<style lang="less">
.question-knowledge__edition {

  h3 {
    margin-bottom: 15px;
  }

  .ivu-input-number {
    width: 140px !important;
  }
}

.question-knowledge__structure {

  .ivu-modal-footer {
    display: none;
  }
}
</style>
