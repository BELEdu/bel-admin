<template>
  <div class="question-knowledge">
    <!-- 顶部搜索栏 -->
    <Form class="app-search-form app-search-form-layout">
      <!-- 年段+学科 -->
      <Form-item>
        <Select
          v-model="query['equal[subject_id]']"
          placeholder="年段学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subjects"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 重要性 -->
      <Form-item>
        <Select
          v-model="query['equal[important]']"
          placeholder="选择重要性"
          style="width: 150px;"
        >
          <Option
            v-for="item in importances"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
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
              :key="likeKey.value"
              :value="likeKey.value"
            >
              {{ likeKey.label }}
            </Option>
          </Select>
        </Input>
      </Form-item>
      <!-- 查询按钮 -->
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">
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
      :data="list"
      @on-sort-change="sort"
    ></Table>

    <!-- 底部分页 -->
    <!-- <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager> -->

    <!-- 知识点编辑弹窗 -->

    <Modal
      class="question-knowledge__edition"
      title="编辑知识点"
      v-model="knowledgeEditionModal.active"
    >
      <h3>知识点：集合的概念</h3>
      <Form :label-width="80" inline>
        <Form-item
          label="理科频次"
        >
          <InputNumber></InputNumber>
        </Form-item>
        <Form-item
          label="理科分值"
        >
          <InputNumber></InputNumber>
        </Form-item>
        <Form-item
          label="文科频次"
        >
          <InputNumber></InputNumber>
        </Form-item>
        <Form-item
          label="文科分值"
        >
          <InputNumber></InputNumber>
        </Form-item>
        <Form-item
          label="考试频次"
        >
          <InputNumber></InputNumber>
        </Form-item>
        <Form-item
          label="考试分值"
        >
          <InputNumber></InputNumber>
        </Form-item>
      </Form>
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

import { GLOBAL } from '@/store/mutationTypes'
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

      likeKeys: [
        { value: 'point', label: '知识点' },
        { value: 'up', label: '上级' },
      ],
      likeKey: 'point',

      query: {
        'equal[subject_id]': 1,
        'equal[important]': 4,
      },

      subjects: [
        { display_name: '高中数学', value: 1 },
        { display_name: '高中语文', value: 2 },
        { display_name: '高中英语', value: 3 },
        { display_name: '高中物理', value: 4 },
      ],

      importances: [
        { display_name: '1', value: 1 },
        { display_name: '2', value: 2 },
        { display_name: '3', value: 3 },
        { display_name: '全部重要性', value: 4 },
      ],

      /* --- 中部辅助 --- */

      /* --- 下部列表 --- */

      colConfig: [
        {
          title: '编号',
          key: 1,
          align: 'center',
        },
        {
          title: '知识点',
          key: 2,
          align: 'center',
        },
        {
          title: '上级',
          key: 3,
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '排序',
          key: 4,
          align: 'center',
        },
        {
          title: '文科重要性',
          key: 5,
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '理科重要性',
          key: 6,
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

      list: Array(10).fill({
        1: '1019194413',
        2: '集合的概念',
        3: '集合/集合的概念',
        4: 1,
        5: 2,
        6: 3,
      }),

      knowledgeEditionModal: {
        active: false,
        confirmLoading: false,
        errorReasons: {},
      },

      structureEditionModal: {
        active: false,
      },
    }
  },

  methods: {
    /* 编辑知识点 */

    activateKnowledgeEdition() {
      this.knowledgeEditionModal.active = true
    },

    deactivateKnowledgeEdition() {
      this.knowledgeEditionModal = {
        active: false,
        confirmLoading: false,
        errorReasons: {},
      }
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

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
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
