<template>
  <app-form-modal
    title="课堂笔记"
    :value="visible"
    @input="val => this.$emit('update:visible', val)"
    :loading="false"
    cancel-value="关闭"
    :ok-btn="false"
    class="notes-modal"
  >
    <Table class="app-table" :columns="viewColumns" :data="items" border></Table>
  </app-form-modal>
</template>

<script>
  /**
   * 学员笔记
   * @author chenliangshan
   * @version 2017-11-23
   */

  import { mapState } from 'vuex'
  import { createButton } from '@/utils'

  export default {
    name: 'notes-modal',

    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        items: [],

        viewColumns: [
          { title: '姓名', key: 'display_name', align: 'center' },
          { title: '添加时间', key: 'created_at', align: 'center' },
          {
            title: '操作',
            align: 'center',
            render: createButton([
              { text: '查看笔记',
                type: 'primary',
                click: (row) => {
                  window.open(row.url, '_blank')
                },
              },
              { text: '下载笔记',
                type: 'primary',
                click: (row) => {
                  const link = document.createElement('a')
                  link.href = `${row.url}?attname=${row.display_name}.${row.url.split('.')[row.url.split('.').length - 1]}`
                  document.body.appendChild(link)
                  link.click()
                  link.remove()
                },
              },
            ]),
          },
        ],
      }
    },

    computed: {
      ...mapState({
        currentCourseItem: state => state.student.schedule.currentCourseItem,
      }),
    },

    watch: {
      currentCourseItem: {
        handler() {
          this.init()
        },
        deep: true,
      },
    },

    methods: {
      init() {
        if (this.visible && this.currentCourseItem.id) {
          this.$http.get(`/schedule/draft/${this.currentCourseItem.id}`)
            .then((res) => {
              this.items = res
            })
        }
      },
    },

    mounted() {
      this.init()
    },
  }
</script>
