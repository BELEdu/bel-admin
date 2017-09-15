<template>
  <div class="structure-editor">
    <slot name="header"></slot>

    <section class="structure-editor__content">
      <Tree
        :data="tree"
        @on-select-change="seleteNode"
      ></Tree>
    </section>

    <footer
      class="structure-editor__control"
    >
      <Button
        type="success"
        :disabled="!selectedNode && !!tree.length"
        :loading="loading"
        @click="activateCreation"
      >
        <Icon type="plus" />
        添加
      </Button>
      <Button
        :disabled="!selectedNode
          || selectedNode === selectedNode.parentNode
            .children[0]"
        type="primary"
        :loading="loading"
        @click="preSort('up')"
      >
        <Icon type="arrow-up-c" />
        上移
      </Button>
      <Button
        :disabled="!selectedNode
          || selectedNode === selectedNode.parentNode
            .children[selectedNode.parentNode.children.length - 1]"
        type="primary"
        :loading="loading"
        @click="preSort('down')"
      >
        <Icon type="arrow-down-c" />
        下移
      </Button>
      <Button
        :disabled="!selectedNode
          || ( selectedNode.children
            && selectedNode.children.length > 0)"
        type="error"
        :loading="loading"
        @click="preDelete"
      >
        <Icon type="android-delete" />
        删除
      </Button>
    </footer>

    <!-- 添加编辑框 -->
    <Modal
      class="structure-editor__creation"
      :title="`添加${keyword}`"
      :width="400"
      v-model="creationModal.active"
      @on-cancel="deactivateCreation"
    >
      <div class="structure-editor__creation-location">
        <span>选择添加位置：</span>
        <Button
          size="small"
          :type="creationInfo.location === 'equative'
            ? 'primary'
            : 'ghost'
          "
          @click="locateCreation('equative')"
          :disabled="!tree.length"
        >同级</Button>
        <Button
          size="small"
          :type="creationInfo.location === 'sub'
            ? 'primary'
            : 'ghost'
          "
          @click="locateCreation('sub')"
        >子级</Button>
      </div>

      <div class="structure-editor__creation-content">
        <p>输入{{keyword}}名称（每行一个）</p>
        <Input
          v-model="creationInfo.text"
          type="textarea"
          :rows="12"
        >
        </Input>
      </div>

      <div class="structure-editor__creation-control" slot="footer">
        <Button
          @click="deactivateCreation"
        >取消</Button>
        <Button
          @click="preCreate"
          :loading="creationModal.confirmLoading"
          type="primary"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'app-tree-structure',

  props: {
    // 操作目标：知识点、章节。。。
    keyword: {
      type: String,
      required: true,
    },
    // 初始数据
    data: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    rootNode: { id: 0 },

    tree: [],

    selectedNode: null,

    creationModal: {
      active: false,
      confirmLoading: false,
      errorReasons: {},
    },

    creationInfo: {
      text: '',
      location: 'sub',
    },

    loading: false,
  }),

  computed: {
    parentNode() {
      if (!this.selectedNode) return null
      if (this.creationInfo.location === 'sub') {
        return this.selectedNode
      }
      return this.selectedNode.parentNode
    },
  },

  watch: {
    data(value) {
      this.tree = this.tree2way([...value])
      this.rootNode.children = this.tree
      const subject_id = this.$route.query['equal[grade_range_subject_id]']
      this.rootNode.subject_id = subject_id || 5
    },

    // 初始空树&删光时候的层级初始
    'tree.length': 'initLocation',
  },

  methods: {
    /* --- Initialization --- */

    seleteNode(nodes) {
      this.selectedNode = nodes[0]
    },

    tree2way(children, parent = this.rootNode) {
      return children.map((item) => {
        const child = { ...item }
        let cNodes = child.children

        if (cNodes && cNodes.length) {
          cNodes = this.tree2way(cNodes, child)
        }

        this.$set(child, 'parentNode', parent)
        this.$set(child, 'children', cNodes)

        return child
      })
    },

    /* --- Assitance --- */

    initLocation(val) {
      if (val) {
        this.creationInfo.location = 'equative'
      } else {
        this.creationInfo.location = 'sub'
      }
    },

    errorRender(error) {
      if (typeof error === 'string') return error
      return Object.keys(error)
        .reduce((acc, key, index, arr) => {
          const message = index === arr.length - 1
            ? error[key][0]
            : `${error[key][0]}\n`
          return acc + message
        }, '')
    },

    activateLoading() {
      this.loading = true
    },

    deactivateLoading() {
      this.loading = false
    },

    /* --- Creation --- */

    activateCreation() {
      this.creationModal.active = true
    },

    deactivateCreation() {
      this.creationModal = {
        active: false,
        confirmLoading: false,
        errorReasons: {},
      }

      this.creationInfo = {
        text: '',
        location: 'equative',
      }
    },

    locateCreation(location) {
      this.creationInfo.location = location
    },

    preCreate() {
      this.creationModal.confirmLoading = true
      // 初始空树，没有parentNode
      const p_id = this.parentNode
        ? this.parentNode.id : 0
      const current_id = this.selectedNode
        ? this.selectedNode.id : 0
      const data = this.creationInfo.text
        .split('\n')
        .map(name => ({ p_id, display_name: name }))

      this.$emit('create',
        {
          grade_range_subject_id: this.rootNode.subject_id,
          current_id,
          location: this.creationInfo.location,
          data,
        },
        // success
        (nodes) => {
          this.creationSucceed(nodes)
          this.deactivateCreation()
          this.$Message.success('创建成功')
        },
        // fail
        (error) => {
          // this.creationModal.confirmLoading = false
          this.deactivateCreation()
          this.$Notice.error({
            title: '创建失败',
            desc: this.errorRender(error.errors),
          })
        },
      )
    },

    creationSucceed(nodes) {
      // 初始空树插入
      const parent = this.parentNode || this.rootNode
      const children = this.tree2way(nodes, parent)
      // 初始空树插入
      if (!this.selectedNode) {
        return this.tree.push(...children)
      }
      // 子级插入
      if (this.creationInfo.location === 'sub') {
        if (!this.selectedNode.children) {
          this.selectedNode.children = []
        }
        return this.selectedNode.children.push(...children)
      }
      // 同级插入
      return this.parentNode.children
        .splice(children[0].sort - 1, 0, ...children)
    },

    /* --- Deletion --- */

    preDelete() {
      this.$Modal.confirm({
        title: '删除知识点',
        content: '删除的知识点无法恢复，确定删除么？',
        okText: '确定',
        cancelText: '取消',
        onOk: this.delete,
        loading: true,
      })
    },

    delete() {
      this.activateLoading()
      const id = this.selectedNode.id
      this.$emit('delete', id,
        // success
        () => {
          this.deletionSucceed()
          this.$Modal.remove()
        },
        // fail
        (error) => {
          this.deactivateLoading()
          this.$Notice.error({
            title: '删除失败',
            desc: error.message,
          })
          this.$Modal.remove()
        },
      )
    },

    deletionSucceed() {
      // 更新视图
      const list = this.selectedNode.parentNode.children
      const index = list.indexOf(this.selectedNode)
      // eslint-disable-next-line
      this.$delete(list, index)
      // 更新状态
      this.deactivateLoading()
      this.selectedNode = null
      this.$Message.success('删除成功')
    },

    /* --- sort --- */

    preSort(type) {
      this.activateLoading()
      this.$emit('sort',
        {
          id: this.selectedNode.id,
          sort: type,
        },
        // success
        () => {
          this.sortSucceed(type)
          this.deactivateLoading()
        },
        // fail
        (error) => {
          const sortType = type === 'up' ? '上移' : '下移'
          this.$Notice.error({
            title: `${sortType}失败`,
            desc: error.message,
          })
          this.deactivateLoading()
        })
    },

    sortSucceed(type) {
      const list = this.parentNode.children
      const index = list.indexOf(this.selectedNode)
      if (type === 'up') {
        this.exchangeNode(list, index, -1)
      } else {
        this.exchangeNode(list, index, 1)
      }
    },

    exchangeNode(list, index, target) {
      list.splice(index, 1, list[index + target])
      list.splice(index + target, 1, this.selectedNode)
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.structure-editor {

  &__control {
    text-align: center;

    button {
      margin: 0 10px;
    }
  }

  &__content {
    margin: 15px 0;
    padding: 0 8px;
    height: 500px;
    border: 1px solid @border-color-base;
    border-radius: 4px;
    overflow: auto;

    & .ivu-tree-title {
      padding: 0 5px 0 0;
    }

    & .ivu-tree ul li {
      margin: 4px 0;
    }
  }

  &__creation {

    &-location {

      & span {
        font-size: 14px;
      }
    }

    &-content {
      margin-top: 15px;

      & p {
        margin-bottom: 5px;
        font-size: 14px;
      }
    }

    &-control {
      text-align: center;
    }

    // 作为自弹窗的修正
    & .ivu-modal-wrap,
    & .ivu-modal-mask, {
      z-index: 1001,
    }
  }
}
</style>
