<template>
  <div class="question-chapter">
    <!-- 搜索栏 -->
    <Form inline class="app-search-form">
      <!-- 年段学科 -->
      <Form-item>
        <Select
          v-model="query[`equal[grade_range_subject_id]`]"
          placeholder="选择年段学科"
          style="width:9em;"
        >
          <Option
            v-for="item in grade_range_subject_id"
            :value="item.id"
            :key="item.id"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 教材版本 -->
      <Form-item>
        <Select
          v-model="query[`equal[teaching_version]`]"
          placeholder="选择教材版本"
          style="width:9em;"
        >
          <Option
            v-for="item in teaching_version"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 关键字检索 -->
      <Form-item>
        <Input placeholder="搜索关键字" v-model="likeValue">
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
      <!-- 搜索 -->
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>章节列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="openChapterModal">编辑章节</Button>
      </Col>
    </Row>

    <!--班级管理表格-->
    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

    <!--分页-->
    <app-pager
      :data="list"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 编辑章节树弹窗 -->
    <Modal
      class="question-knowledge__structure"
      v-model="modal.chapter"
      title="编辑章节"
    >
      <TreeEditor
        keyword="章节"
        :data="chapterTree"
        :default-subject="current_grade_range_subject_id"
        @create="createChapter"
        @delete="deleteChapter"
        @sort="sortChapter"
       >
        <div slot="header">
          以下为当前学科的各个教材版本的章节及其结构，您可增加与删除章节，也可以调整掌控额的排序，排序的调整仅限同父级下的同级排序，所有操作仅在确认后才生效。
        </div>
      </TreeEditor>
      <div slot="footer"></div>
    </Modal>

    <!-- 编辑章节弹窗 -->
    <edit-modal
      v-model="modal.edit"
      :form="form"
      :default-subject="current_grade_range_subject_id"
      :is-edit="isEdit"
      @closeEditModal="modal.edit = false"
      @fetchData="fetchData"
    ></edit-modal>

  </div>
</template>

<script>
/**
 * 题库中心 - 章节
 *  @author zml
 *  @version 2017-09-12
 */

import Http from '@/utils/http'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import { TreeEditor } from '@/views/components'
import EditModal from './components/EditModal'

export default {
  name: 'question-chapter',

  mixins: [list],

  components: {
    EditModal,
    TreeEditor,
  },

  data() {
    return {
      likeKeys: [],
      likeKey: 'chapter_name',
      query: {
        // 'equal[grade_range_subject_id]': null,
        'equal[teaching_version]': null,
      },

      current_grade_range_subject_id: 0, // 默认年级学科id
      grade_range_subject_id: [], // 学科年级数据源
      teaching_version: [], // 教材版本数据源

      columns: [
        {
          title: '章节编号',
          key: 'number',
          align: 'center',
        },
        {
          title: '章节名称',
          key: 'display_name',
          align: 'center',
        },
        { title: '上级',
          key: 'parent_name',
          align: 'center',
        },
        {
          title: '包含知识点',
          key: 'have_knowledge',
          align: 'left',
          render: (h, params) => {
            const { have_knowledge } = params.row
            return h('ul',
              {
                class: 'question-chapter__point',
              }, have_knowledge.map(value => h('li', value)),
            )
          },
        },
        {
          title: '关联知识点',
          key: 'relation_knowledge',
          align: 'left',
          render: (h, params) => {
            const { relation_knowledge } = params.row
            return h('ul',
              {
                class: 'question-chapter__point',
              }, relation_knowledge.map(value => h('li', value)),
            )
          },
        },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 180,
          render: createButton([
            { text: '编辑', type: 'success', click: row => this.openEditModal(row.id, 'edit') },
            { text: '查看', type: 'primary', click: row => this.openEditModal(row.id, 'show') },
          ]),
        },
      ],

      list: {}, // 列表数据

      modal: { // 弹窗控制
        edit: false,
        chapter: false,
      },

      chapterTree: [], // 章节树数据

      // 章节详细数据（编辑时用）
      form: {
        grade_range_subject_id: null,
        data: [],
        analysis: '',
      },

      isEdit: false, // 是否是编辑弹窗
    }
  },

  methods: {
    // 打开编辑章节树弹窗
    openChapterModal() {
      const id = this.$route.query['equal[grade_range_subject_id]'] || this.current_grade_range_subject_id
      this.$http.get(`/chapter/tree/${id}`)
        .then((res) => {
          this.modal.chapter = true
          this.chapterTree = res
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 打开编辑章节 & 查看章节弹窗
    openEditModal(id, type) {
      if (type === 'edit') {
        this.isEdit = true
      } else {
        this.isEdit = false
      }

      this.$http.get(`/chapter/${id}`)
        .then((res) => {
          this.form = res
          this.modal.edit = true
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 获取列表数据
    getData(query, to) {
      const urlArr = to.fullPath.split('/').slice(2)
      const url = `/${urlArr.join('/')}`
      return this.$http.get(url)
        .then((res) => {
          this.list = res
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 添加章节
    createChapter(data, success, fail) {
      this.$http.post('/chapter', data)
        .then((res) => {
          success(res)
          this.fetchData()
        })
        .catch(error => fail(error))
    },

    // 删除章节
    deleteChapter(id, success, fail) {
      this.$http.delete(`/chapter/${id}`)
        .then((res) => {
          success(res)
          this.fetchData()
        })
        .catch(error => fail(error))
    },

    // 排序章节
    sortChapter(data, success, fail) {
      this.$http.patch(`/chapter/sort/${data.id}`, data)
        .then(() => success())
        .catch(error => fail(error))
    },

    // 接口错误处理
    errorNotice(message) {
      this.$Notice.error({
        title: message,
        duration: 0,
      })
    },
  },

  created() {
  },

  beforeRouteEnter(to, from, next) {
    Http.get('/chapter/index_before')
      .then(({
        grade_range_subject_id,
        teaching_version,
        search_fields,
        current_grade_range_subject_id,
      }) => {
        next((vm) => {
          /* eslint-disable no-param-reassign */
          vm.grade_range_subject_id = grade_range_subject_id
          vm.teaching_version = teaching_version
          vm.likeKeys = search_fields
          vm.current_grade_range_subject_id = current_grade_range_subject_id
          // 如果URL中没有年段学科id的话，使用默认年段学科id
          vm.query = {
            'equal[grade_range_subject_id]': current_grade_range_subject_id,
            ...vm.query,
          }
          /* eslint-enalbe */
        })
      })
  },
}
</script>

<style lang="less">
@import '~vars';
.question-chapter {
  &__point {
    list-style-type: disc;
    margin-left: 15px;
  }
}

</style>
