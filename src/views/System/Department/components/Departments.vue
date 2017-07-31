<script>
/**
 * 部门管理 - 部门树状表格
 * @author lmh
 * @version 2017-07-13
 */

import { mapState } from 'vuex'

export default {
  name: 'app-system-department-departments',

  render(h) {
    return h('div', { class: 'tree-table' }, [
      h(
        'ul',
        { class: 'tree-table__header' },
        [h('div', '部门'), h('div', '操作')],
      ),
      h(
        'ul',
        { class: 'tree-table__body' },
        this.departments.map(item => this.renderItem(h, item)),
      ),
    ])
  },

  props: {
    prepareCreate: {
      type: Function,
      required: true,
    },
    prepareUpdate: {
      type: Function,
      required: true,
    },
    prepareRemove: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      expand: [1],
    }
  },

  computed: {
    ...mapState({
      departments: state => state.system.department.departments,
    }),
  },

  methods: {
    toggleExpand(id) {
      if (this.expand.includes(id)) {
        this.expand = this.expand.filter(item => item !== id)
      } else {
        this.expand.push(id)
      }
    },

    calcHeight({ id, children }) {
      const loop = items => items.reduce((result, item) => {
        if (item.children && this.expand.includes(item.id)) {
          return result + 1 + loop(item.children)
        }
        return result + 1
      }, 0)

      if (children && this.expand.includes(id)) {
        return `${loop(children) * 48}px`
      }
      return 0
    },

    renderItem(h, item) {
      const { children } = item
      const hasChild = children && children.length
      const height = this.calcHeight(item)

      return h('li', { class: 'tree-table__level' }, [
        h('div', {
          class: 'tree-table__item',
        }, [
          h('div', { class: 'tree-table__name' }, [
            (hasChild && item.p_id !== 0) ? h('Button', {
              props: { type: 'text', icon: height ? 'chevron-up' : 'chevron-down' },
              on: { click: () => this.toggleExpand(item.id) },
            }) : null,
            item.display_name,
          ]),
          h('div', { class: 'tree-table__right', style: { width: '214px' } }, [this.renderButtons(h, item)]),
        ]),
        hasChild ?
          h('ul', {
            class: height ? 'tree-list--visible' : 'tree-list--hidden',
            style: { height, opacity: height ? 1 : 0 },
          }, children.map(child => this.renderItem(h, child))) :
          null,
      ])
    },

    renderButtons(h, item) {
      const isTopLevel = item.p_id === 0

      return [
        h('Button', {
          props: {
            type: 'primary',
            size: 'small',
          },
          on: {
            click: () => this.prepareCreate(item),
          },
        }, isTopLevel ? '新增校区' : '新增子部门'),
        h('Button', {
          props: {
            type: 'primary',
            size: 'small',
          },
          on: {
            click: () => this.prepareUpdate(item),
          },
        }, '更名'),
      ].concat(isTopLevel ? [] : [h('Button', {
        props: {
          type: 'warning',
          size: 'small',
          'v-if': !isTopLevel,
        },
        on: {
          click: () => this.prepareRemove(item),
        },
      }, '删除')])
    },
  },
}
</script>

<style lang="less">
@import "~vars";

@item-height: 48px;
@border: 1px solid @border-color-base;

.tree-table {
  &__header {
    display: flex;
    justify-content: space-between;
    border: 1px solid #ccc;
    border-bottom: 0;
    background-color: #f8f8f9;
    font-weight: bold;

    & > div {
      text-align: center;
      line-height: 40px;

      &:first-child {
        flex: auto;
      }

      &:last-child {
        flex: none;
        width: 214px;
        border-left: @border;
      }
    }
  }

  &__body {
    border: @border;
    border-bottom: 0;
    overflow: hidden;
  }

  &__level {
    padding-left: 1.2em;

    & .tree-table__level {
      padding-left: 2em;
    }

    & > ul {
      // overflow-y: hidden;
      transition: 0.3s;
    }
  }

  &__item {
    position: relative;
    display: flex;
    height: @item-height;
    line-height: @item-height - 1px;

    &::before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: 200%;
      height: 1px;
      background-color: @border-color-base;
    }
  }

  &__name {
    flex: auto;

    & > button {
      padding: 0;
      margin-left: -1.5em;
      margin-right: 5px;
    }
  }

  &__right {
    flex: none;
    border-left: @border;
    text-align: center;

    & > button:not(:first-child) {
      margin-left: 0.8em;
    }
  }
}

.ie .tree-table {
  &__header {
    & > div {
      float: left;

      &:first-child {
        width: calc(~"100% - 214px");
      }
    }

    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }

  &__item {
    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }

  &__name {
    float: left;
  }

  &__right {
    float: right;
  }

  &__level {
    & > ul {
      &.tree-list--visible {
        overflow: visible;
      }

      &.tree-list--hidden {
        overflow: hidden;
      }
    }
  }
}
</style>
