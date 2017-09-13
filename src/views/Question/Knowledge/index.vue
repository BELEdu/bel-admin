<template>
  <div class="question-knowledge">
    <!-- 顶部搜索栏 -->
    <Form class="app-search-form app-search-form-layout">
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
      <!-- 查询按钮 -->
      <Form-item>
        <Button
          type="primary" icon="ios-search"
          @click="search"
        >
          搜索
        </Button>
      </Form-item>
    </Form>

    <!-- 中部辅助栏 -->
    <div class="app-content-topbar">
      <h2>知识点列表</h2>
      <Button
        @click="toBulkEdit"
        type="primary"
      >
        批量编辑知识点
      </Button>
      <Button
        type='primary'
        @click="activateStructureEdition"
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
      v-model="structureEditionModal.active"
      title="编辑知识点"
    >
      <v-tree-structure
        keyword="知识点"
       >
      </v-tree-structure>
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
import vTreeStructure from '../components/TreeStructure'

export default {
  name: 'question-knowledge',

  mixins: [list],

  components: {
    vTreeStructure,
  },

  data() {
    return {
      /* --- 顶部搜索 --- */

      likeKeys: [],
      likeKey: 'knowledge_name',

      query: {
        'equal[grade_range_subject_id]': 5,
        'equal[knowledge_importance]': '',
      },

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

      structureEditionModal: {
        active: false,
      },
    }
  },

  computed: {
    isNotBranch() {
      const subject = this.$route.query['equal[grade_range_subject_id]']
      return subject && subject !== '5'
    },

    colConfig() {
      if (this.isNotBranch) {
        return this.tableConfig
      }
      const temp = [...this.tableConfig]
      temp.splice(4, 1,
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
      return temp
    },
  },

  methods: {
    /* 获取列表数据 */
    getData(query, to) {
      const urlArr = to.fullPath.split('/').slice(2)
      const url = `/${urlArr.join('/')}`
      return this.$http.get(url)
        .then((res) => { this.buffer = res })
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

    activateStructureEdition() {
      this.structureEditionModal.active = true
    },

    /* 去批量编辑知识点 */

    toBulkEdit() {
      this.$router.push('/question/knowledge/edition')
    },
  },

  beforeRouteEnter(to, from, next) {
    Http.get('/knowledge/index_before')
      .then(({
        search_fields,
        knowledge_importance,
        grade_range_subject_id,
      }) => {
        next((vm) => {
          /* eslint-disable no-param-reassign */
          vm.subjects = grade_range_subject_id
          vm.likeKeys = search_fields
          vm.importances = knowledge_importance
          /* eslint-enalbe */
        })
      })
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
