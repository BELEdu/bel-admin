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

    <!--弹框-->
    <department-modal
      :item="currentItem"
      :form="form"
      :modal="modal"
      :isCreate="isCreate"
      @closeModal="closeModal"
    ></department-modal>
  </div>
</template>

<script>
/**
 * 系统设置 - 组织架构
 * @author lmh
 * @version 2017-06-07-07
 */

import { mapState } from 'vuex'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import DepartmentModal from './components/DepartmentModal'

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
          render: (h, params) => h('div', {
            class: 'department-btns',
          }, [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => this.prepareCreate(params.row.id),
              },
            }, params.row.level === 1 ? '新增校区' : '新增子部门'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => this.prepareUpdate(params.row.id),
              },
            }, '更名'),
          ].concat(params.row.id === 1 ? [] : [h('Button', {
            props: {
              type: 'warning',
              size: 'small',
              'v-if': params.row.level !== 1,
            },
            on: {
              click: () => this.prepareRemove(params.row.id),
            },
          }, '删除')])),
        },
      ],

      currentId: null,

      form: {
        display_name: '',
      },

      modal: {
        form: false,
        remove: false,
      },

      isCreate: false,
    }
  },

  computed: {
    ...mapState({
      departments: state => state.system.department.list,
    }),

    currentItem() {
      return this.departments.find(department => department.id === this.currentId) || {}
    },
  },

  methods: {
    // 设置表格每一行的className
    rowClassName(row) {
      return `level-${row.level}`
    },

    openModal(type) {
      this.modal[type] = true
    },

    closeModal(type) {
      this.modal[type] = false
    },

    prepareCreate(id) {
      this.currentId = id
      this.isCreate = true
      this.form.display_name = ''
      this.openModal('form')
    },

    prepareUpdate(id) {
      this.currentId = id
      this.isCreate = false
      // 校区二字是固定后缀，不应该显示在输入框里
      this.form.display_name = this.currentItem.display_name.replace('校区', '')
      this.openModal('form')
    },

    prepareRemove(id) {
      this.currentId = id
      this.openModal('remove')
    },
  },

  components: {
    DepartmentModal,
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

.department-btns {
  button:not(:first-child) {
    margin-left: 0.8em;
  }
}
</style>
