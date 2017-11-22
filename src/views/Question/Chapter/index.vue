<template>
  <div class="question-chapter">
    <!-- 搜索栏 -->
    <App-table-form @on-submit="search">
      <!-- 年段学科 -->
      <Form-item>
        <Select
          v-if="currentSubjectId"
          v-model="query[`equal[grade_range_subject_id]`]"
          placeholder="选择年段学科"
          style="width:9em;"
          @on-change="queryReset"
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
          v-model="query[`equal[teach_material]`]"
          placeholder="选择教材版本"
          style="width:9em;"
        >
          <Option
            v-for="version in currentTeachingVersionData"
            :value="version.value"
            :key="version.value"
          >
            {{version.display_name}}
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
    </App-table-form>

    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="bookmark"/> 章节列表</h2>
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
      @on-cancel="fetchData"
    >
      <TreeEditor
        v-if="currentSubjectId"
        keyword="章节"
        :data="chapterTree"
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
      v-if="currentSubjectId"
      v-model="modal.edit"
      :form="form"
      :is-edit="isEdit"
      @closeEditModal="modal.edit = false"
      @addKnowledge="addKnowledge"
      @removeKnowledge="removeKnowledge"
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

// import Http from '@/utils/http'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import { TreeEditor } from '@/views/components'
import EditModal from './components/EditModal'

// 知识点项
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
  name: 'question-chapter',

  mixins: [list],

  components: {
    EditModal,
    TreeEditor,
  },

  data() {
    return {
      likeKeys: [],
      likeKey: '',
      query: {
        'equal[grade_range_subject_id]': null,
        'equal[teach_material]': null,
      },

      grade_range_subject_id: [], // 学科年级数据源
      teaching_version: [], // 教材版本数据源汇总

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

  computed: {
    // 当前年级学科
    currentSubjectId() {
      return this.query['equal[grade_range_subject_id]']
    },

    // 当前年级学科对应的教材版本数据源
    currentTeachingVersionData() {
      return this.teaching_version[this.currentSubjectId]
    },
  },

  methods: {
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

    // 添加知识点
    addKnowledge() {
      this.form.data.push({ ...defaultKnowledge })
    },

    // 移除知识点
    removeKnowledge(index) {
      this.form.data.splice(index, 1)
    },

    // 打开编辑章节树弹窗
    openChapterModal() {
      // 年级学科id和教材id都是优先从路由获取
      const gradeSubjectId = this.$route.query['equal[grade_range_subject_id]']
      const teachMaterialId = this.$route.query['equal[teach_material]']

      this.$http.get(`/chapter/tree/${gradeSubjectId}/${teachMaterialId}`)
        .then((res) => {
          this.modal.chapter = true
          this.chapterTree = res
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 添加章节
    createChapter(data, success, fail) {
      this.$http.post('/chapter', {
        ...data,
        teach_material: this.query['equal[teach_material]'],
      })
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

    // 获取列表数据的公共方法getData
    getData(qs) {
      // 如果this.grade_range_subject_id长度为0，说明为第一次进入页面，这时应请求before接口的数据
      const p = this.grade_range_subject_id.length ? Promise.resolve() : this.getBeforeData()

      // qs为空代表目标路由地址没有携带url参数，这时候应该向路由推送equal[grade_range_subject_id]参数，将之设为默认值
      // 默认值为this.grade_range_subject_id的第一项的id
      if (!qs) {
        return p
          .then(() => {
            // 获取年级学科列表第一项的id
            const firstGradeRangeSubjectId = this.grade_range_subject_id[0].id
            // 获取对应该年级学科的教材版本的第一项的id
            const firstTeachMaterialId = this.teaching_version[firstGradeRangeSubjectId][0].value

            // 重置关键字搜索
            this.queryReset(firstGradeRangeSubjectId)

            // 跳转路由
            this.$router.push(`/question/chapter?equal[grade_range_subject_id]=${firstGradeRangeSubjectId}&equal[teach_material]=${firstTeachMaterialId}`)
          })
      }

      // qs不为空代表目标路由地址有携带url参数，走常规获取列表数据
      return p
        .then(this.getListData(qs))
    },

    // 请求before接口的数据
    getBeforeData() {
      return this.$http.get('/chapter/index_before')
        .then(({
          grade_range_subject_id,
          teaching_version,
          search_fields,
        }) => {
          this.grade_range_subject_id = grade_range_subject_id
          this.teaching_version = teaching_version
          this.likeKeys = search_fields
          this.likeKey = this.likeKeys[0].field_name
        })
    },

    // 重置关键字搜索
    queryReset(subjectId) {
      // 对应该年级学科的教材版本的第一项的教材id
      const firstTeachMaterialId = this.teaching_version[subjectId][0].value

      this.likeKey = this.likeKeys[0].field_name
      this.likeValue = ''
      this.query = {
        'equal[teach_material]': firstTeachMaterialId,
        'equal[grade_range_subject_id]': subjectId,
      }
    },

    // 请求章节列表接口
    getListData(qs) {
      return this.$http.get(`/chapter${qs}`)
        .then((res) => {
          this.list = res
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
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
