<template>
  <div class="question-knowledge-edition">
    <aside>
      <v-side-tree
        :data="treeData"
        @batch-select="onBatchSelect"
      ></v-side-tree>
    </aside>
    <section>
      <div
        class="edition-item"
        v-for="(item, index) in data"
        :key="item.id"
      >
        <h3>
          知识点名称:
          <span>{{item.display_name}}</span>
          <i
            class="ivu-icon ivu-icon-android-delete"
            @click="deleteEdition(item.id, index)"
          ></i>
        </h3>
        <Form :label-width="80" inline>
          <template v-if="subjectId === 5">
            <Form-item
              label="理科频次"
            >
              <InputNumber
                :min="0"
                v-model="item.frequency"
              ></InputNumber>
            </Form-item>
            <Form-item
              label="理科分值"
            >
              <InputNumber
                :min="0"
                v-model="item.score"
              ></InputNumber>
            </Form-item>
            <Form-item
              label="文科频次"
            >
              <InputNumber
                :min="0"
                v-model="item.art_frequency"
              ></InputNumber>
            </Form-item>
            <Form-item
              label="文科分值"
            >
              <InputNumber
                :min="0"
                v-model="item.art_score"
              ></InputNumber>
            </Form-item>
          </template>
          <template v-else>
            <Form-item
              label="考试频次"
            >
              <InputNumber
                :min="0"
                v-model="item.frequency"
              ></InputNumber>
            </Form-item>
            <Form-item
              label="考试分值"
            >
              <InputNumber
                :min="0"
                v-model="item.score"
              ></InputNumber>
            </Form-item>
          </template>
        </Form>
      </div>
    </section>
    <footer v-show="data.length">
      <Button
        type="ghost"
        @click="cancel"
      >取消</Button>
      <Button
        type="primary"
        :loading="confirmLoading"
        @click="confirm"
      >确认</Button>
    </footer>
  </div>
</template>

<script>
/**
 * 题库中心 - 知识点 - 批量编辑
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import vSideTree from '../components/SideTree'

export default {
  name: 'question-knowledge-edition',

  data: () => ({
    // 编辑信息
    data: [],
    // 树结构数据
    treeData: [],
    // 选中的树节点
    treeNodes: [],
    // 批量按钮loading
    batchLoading: false,
    // 提交按钮loading
    confirmLoading: false,
  }),

  components: {
    vSideTree,
  },

  computed: {
    subjectId() {
      return parseInt(this.$route.params.id, 10)
    },
  },

  methods: {
    /* --- Init --- */
    fetchTreeData() {
      this.$http.get(`/knowledge/tree/${this.subjectId}`)
        .then((res) => {
          this.treeData = res
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
    },

    /* --- Control --- */

    cancel() {
      this.$router.push(`/question/knowledge?equal[grade_range_subject_id]=${this.subjectId}`)
    },

    confirm() {
      this.confirmLoading = true
      this.$http.patch(
        `/knowledge/batch/${this.subjectId}`,
        { data: this.data },
      )
        .then(() => {
          this.confirmLoading = false
          this.cancel()
        })
        .catch((error) => {
          this.confirmLoading = false
          this.$Notice.error({
            title: '编辑错误',
            desc: error.message,
            duration: 0,
          })
        })
    },


    /* --- 批量 --- */

    onBatchSelect(ids, nodes) {
      this.treeNodes = nodes
      const editionIds = this.data.map(item => item.id)
      const additions = this.contractIds(ids, editionIds)
      const deletions = this.contractIds(editionIds, ids)
      if (deletions.length) {
        this.deleteEditions(deletions)
      }
      if (additions.length) {
        this.fetchEditions(additions)
      }
    },

    // 获取base中有，opposite中没有的id
    contractIds(base, opposite) {
      return base
        .filter(bid => opposite
          .every(oid => oid !== bid))
    },

    deleteEditions(ids) {
      this.data = this.data
        .filter(item => ids
          .every(id => id !== item.id))
    },

    fetchEditions(ids) {
      this.$store.commit(GLOBAL.LOADING.SHOW)
      const url = `/knowledge/batchinfo/${ids.join()}`
      return this.$http.get(url)
        .then((res) => {
          this.data.push(...res)
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
    },

    /* 单体 */
    deleteEdition(id, index) {
      this.data.splice(index, 1)
      const target = this.treeNodes
        .find(node => node.id === id)
      target.checked = false
    },
  },

  created() {
    this.fetchTreeData()
  },
}
</script>

<style lang="less">
@import '~vars';
@import '../mixins/style';

@content-width: 975px;

.question-knowledge-edition {
  width: @content-width;

  & > aside {
    .sideframe();
  }

  & > section {
    padding-left: 20px;
    overflow-x: hidden;
  }

  & > footer {
    padding-left: 300px;
    text-align: center;

    & > button {
      width: 80px;
    }

    & > button:first-child {
      margin-right: 20px;
    }
  }

  & .edition-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid @border-color-base;
    border-radius: 4px;

    & > h3 {
      margin-bottom: 15px;
      font-size: 18px;

      & > i {
        float: right;
        font-size: 26px;
        color: @warning-color;
        cursor: pointer;

        &:hover {
          color: lighten(@warning-color, 10%);
        }
      }
    }

    & .ivu-input-number {
      width: 200px;
    }
  }
}
</style>
