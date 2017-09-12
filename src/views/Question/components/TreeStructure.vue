<template>
  <div class="structure-editor">
    <header class="structure-editor__header">
      以下为当前学科的所有知识点及其结构，您可增加与删除知识点，也可以调整知识点的排序，排序的调整仅限同父级下的同级排序。
    </header>

    <section class="structure-editor__content">
      <Tree
        :data="treeData"
        @on-select-change="seleteNode"
      ></Tree>
    </section>

    <footer
      class="structure-editor__control"
    >
      <Button
        type="success"
        :disabled="!seletedNode"
        @click="activateCreation"
      >
        <Icon type="plus" />
        添加
      </Button>
      <Button
        :disabled="!seletedNode
          || seletedNode.sort === 1"
        type="primary"
      >
        <Icon type="arrow-up-c" />
        上移
      </Button>
      <Button
        :disabled="!seletedNode
          || seletedNode.sort === seletedNode.parentNode.children.length"
        type="primary"
      >
        <Icon type="arrow-down-c" />
        下移
      </Button>
      <Button
        :disabled="!seletedNode
          || ( seletedNode.children
            && seletedNode.children.length > 0)"
        type="error"
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
        <Button>取消</Button>
        <Button
          @click="preCreate"
          :loading="creationModal.comfirmLoading"
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
  },

  data: () => ({
    treeData: [
      {
        id: 1,
        title: '高中',
        children: [
          {
            id: 11,
            title: '高一',
            children: [
              {
                id: 111,
                title: '高一数学',
              },
              {
                id: 112,
                title: '高一英语',
              },
              {
                id: 113,
                title: '高一数学',
              },
              {
                id: 114,
                title: '高一英语',
              },
            ],
          },
          {
            id: 12,
            title: '高二',
            children: [
              {
                id: 121,
                title: '高二物理',
              },
              {
                id: 122,
                title: '高二生物',
              },
            ],
          },
        ],
      },
    ],

    seletedNode: null,

    creationModal: {
      active: false,
      confirmLoading: false,
      errorReasons: {},
    },

    creationInfo: {
      text: '',
      location: 'equative',
    },
  }),

  computed: {
    parentNode() {
      if (!this.seletedNode) return null
      const { location } = this.creation
      if (location === 'sub') {
        return this.seletedNode.parentNode
      }
      return this.seletedNode
    },
  },

  methods: {
    /* --- Initialization --- */

    seleteNode(nodes) {
      this.seletedNode = nodes[0]
    },

    bidirectionalTree(children, parent = { id: 0, children }) {
      children.forEach((childNode, sort) => {
        /* eslint-disable no-param-reassign */
        childNode.parentNode = parent
        childNode.sort = sort + 1
        /* eslint-enable */
        if (childNode.children
          && childNode.children.length
        ) {
          this.bidirectionalTree(childNode.children, childNode)
        }
      })
    },

    /* --- Creation --- */

    activateCreation() {
      this.creationModal.active = true
    },

    deactivateCreation() {
      this.creationModal.active = false
      this.creationModal.confirmLoading = false
      this.creationInfo = {
        text: '',
        location: 'equative',
        parentNode: null,
      }
    },

    locateCreation(location) {
      this.creationInfo.location = location
    },

    preCreate() {
      const data = this.creationInfo.text.split('\n')
      this.$emit('create', [...data],
        // success
        (nodes) => {
          this.creationSucceed(nodes)
          this.deactivateCreation()
          this.$Message.success('创建成功')
        },
        // error
        () => {
          this.deactivateCreation()
          this.$Message.success('创建失败')
        },
      )
    },

    // eslint-disable-next-line
    creationSucceed(nodes) {
      const type = this.creationInfo.location
      if (type === 'equative') {
        // 插入后位置
      }
      if (type === 'sub') {
        // 插入children末尾
      }
    },

    /* --- Deletion --- */
    preDelete() {
      const id = this.seletedNode.id
      this.$emit('delete', id,
        // success
        () => {
          // 移除节点
          this.deletionSucceed(id)
        },
        // error
        () => {
          // 显示删除失败
        },
      )
    },

    // eslint-disable-next-line
    deletionSucceed(id) {
      // 删除对应节点
    },

    /* --- sort --- */
  },

  created() {
    this.$http.get('/knowledge/tree/1')
      .then((res) => {
        this.treeData = res
        this.bidirectionalTree(this.treeData)
      })
    // 初始默认为根节点
    // this.seletedNode = {
    // id: 0,
    // children: this.treeData,
    // }
  },
}
</script>

<style lang="less">
@import '~vars';

.structure-editor {

  &__header {
    margin-bottom: 10px;
  }

  &__control {
    text-align: center;

    button {
      margin: 0 10px;
    }
  }

  &__content {
    margin-bottom: 15px;
    padding: 0 8px;
    height: 500px;
    border: 1px solid @border-color-base;
    border-radius: 4px;
    overflow: auto;
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
  }
}
</style>
