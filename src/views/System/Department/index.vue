<template>
  <div class="system-department">
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2>
        <svg class="svg-icon" viewBox="0 0 1024 1024" width="14px" height="14px" style="transform:translateY(-2px);">
          <path d="M320 0h384v256H320zM880 448H544V384h-64v64h-384v192h64V512h320v128h64V512h320v128h64V448h-48zM0 768h256v256H0zM384 768h256v256H384zM768 768h256v256h-256z"></path>
        </svg>
        组织架构
      </h2>
      </Col>
    </Row>
    <Table class="app-table app-table--department" :columns="columns" :data="departments" :row-class-name="rowClassName" border></Table>
  </div>
</template>

<script>
/**
 * 系统设置 - 组织架构
 * @author lmh
 * @version 2017-06-05
 */

import { mapGetters } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import Operations from './components/Operations'

export default {
  name: 'app-system-organization',

  data() {
    return {
      columns: [
        { title: '部门', key: 'display_name', align: 'left' },
        {
          title: '操作',
          width: 215,
          align: 'center',
          render: (h, params) => h(Operations, {
            props: {
              item: params.row,
            },
          }),
        },
      ],
    }
  },

  computed: {
    ...mapGetters(['departments']),
  },

  methods: {
    // 设置表格每一行的className
    rowClassName(row) {
      return `level-${row.level}`
    },
  },

  components: {
    operations: Operations,
  },

  created() {
    this.$store.dispatch(SYSTEM.DEPARTMENT.INIT)
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>

<style lang="less">
// 层级缩进
.level-padding(@n, @i: 1) when (@i =< @n) {
  .level-@{i} {
    td:first-child {
      padding-left: ((@i - 1) * 2em);
    }
  }
  .level-padding(@n, (@i + 1));
}

.level-padding(10);
</style>
