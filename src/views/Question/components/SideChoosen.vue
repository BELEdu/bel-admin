<template>
  <div class="v-side-tree">
    <!-- 唯一多选模式 -->
    <div v-if="type === 'multiple'">
      <Button
        type="primary" long
      >批量选择</Button>
    </div>

    <!-- 多选单选混合模式 -->
    <div v-else>
      <!-- 知识点多选 -->
      <div
        class="multiple"
        v-if="multiple"
      >
        <Button
          type="primary"
          @click="toggleSelectType()"
        >切换为单选</Button>
        <Button type="primary">确定</Button>
      </div>

      <!-- 知识点单选 -->
      <Button
        v-else
        type="primary" long
        @click="toggleSelectType()"
      >切换为多选</Button>
    </div>

    <!-- 树形结构 -->
    <Tree
      :show-checkbox="multiple"
      :data="treeData"
    ></Tree>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => 'all',
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

    multiple: true,
  }),

  methods: {
    toggleSelectType() {
      this.multiple = !this.multiple
    },
  },
}
</script>

<style lang="less">
.v-side-tree {

  & .multiple {

    button {
      width: 115px;

      &:first-child {
        margin-right: 20px;
      }
    }
  }
}
</style>
