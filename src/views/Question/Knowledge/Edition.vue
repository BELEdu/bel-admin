<template>
  <div class="question-knowledge-edition">
    <aside>
      <TreeSide
        :data="treeData"
        type="multiple"
        @batch-select="onBatchSelect"
      />
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
              label="文科频次"
            >
              <InputNumber
                :min="0"
                v-model="item.art_frequency"
              ></InputNumber>
            </Form-item>
            <Form-item
              label="理科频次"
            >
              <InputNumber
                :min="0"
                v-model="item.frequency"
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
            <Form-item
              label="理科分值"
            >
              <InputNumber
                :min="0"
                v-model="item.score"
              ></InputNumber>
            </Form-item>
            <Form-item
              label="文科重要性"
            >
              <InputNumber
                v-model="item.art_knowledge_importance"
                :min="0"
                :max="100"
              ></InputNumber>
            </Form-item>
            <Form-item
              label="理科重要性"
            >
              <InputNumber
                v-model="item.knowledge_importance"
                :min="0"
                :max="100"
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
            <Form-item
              label="重要性"
            >
              <InputNumber
                v-model="item.knowledge_importance"
                :min="0"
                :max="100"
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
import TreeSide from '@/views/components/TreeSide'

export default {
  name: 'question-knowledge-edition',

  data: () => ({
    // 编辑信息
    data: [],
    // 树结构数据
    treeData: [],
    // 选中的树叶子节点
    leafNodes: [],
    // 批量按钮loading
    batchLoading: false,
    // 提交按钮loading
    confirmLoading: false,
  }),

  components: {
    TreeSide,
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
      const destination = `/question/knowledge?equal[grade_range_subject_id]=${this.subjectId}`
      this.$router.push(destination)
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
      this.leafNodes = nodes
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

      const target = this.leafNodes
        .find(node => node.id === id)

      const queue = this.getDeletionQueue(target)

      /* eslint-disable no-param-reassign */
      queue.forEach((item) => {
        item.checked = false
        item.indeterminate = this.setIndeterminate(item)
      })
      /* eslint-enable */

      target.checked = false
    },

    getDeletionQueue(node, queue = []) {
      if (node.parent && node.parent.id) {
        queue.unshift(node.parent)
        this.getDeletionQueue(node.parent, queue)
      }

      return queue
    },

    setIndeterminate(target) {
      return target.children
        .filter(item => item.checked)
        .length > 1
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
