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
    <Row v-for="(item, index) in items" :key="index">
      <Col :span="12">
      {{ item.display_name }}
      </Col>
      <Col :span="6">
      <a :href="item.url" target="_blank">查看笔记</a>
      </Col>
      <Col :span="6">
      <a :href="`${item.url}?attname=${item.display_name}.${item.url.split('.')[item.url.split('.').length - 1]}`">下载笔记</a>
      </Col>
    </Row>
  </app-form-modal>
</template>

<script>
  /**
   * 学员笔记
   * @author chenliangshan
   * @version 2017-11-23
   */

  import { mapState } from 'vuex'

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
        if (this.currentCourseItem.id) {
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
