<template>
  <div class="algorithm-knowledge-show">
    <Form class="app-search-form app-search-form-layout">
      <!-- 关键字检索 -->
      <Form-item>
        <Input
          placeholder="搜索关键字"
          v-model="likeValue"
          style="width: calc(7em + 200px);"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width: 7em"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.field_name"
              :value="likeKey.field_name"
            >
              {{ likeKey.display_name }}
            </Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button
          type="primary"
          icon="ios-search"
          @click="search"
        >
          搜索
        </Button>
      </Form-item>
    </Form>

    <div class="app-content-topbar">
      <h2>知识点详情列表</h2>
      <span>学员：{{buffer.student_name}}</span>
      <span>薄弱知识点：{{buffer.count_weak_knowledge}}个</span>
      <span>总知识点： {{buffer.count_knowledge}}个</span>
      <Button
        type="primary"
        @click="toggleList('detail')"
      >显示明细列表</Button>
    </div>

    <!-- 统计列表 -->
    <Table border
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"
    ></Table>

    <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 查看知识点明细 -->
    <Modal
      class="algorithm-knowledge-show__info"
      v-model="infoModal.active"
      title="知识点详情"
    >
      <h4
        class="info__title"
      >知识点：{{infosLabel}}</h4>
      <Table border
        :columns="infoColConfig"
        :data="infos.data"
      ></Table>
    </Modal>
  </div>
</template>

<script>
/**
 * 算法中心 - 学员知识点 - 知识点详情
 *
 * @author huojinzhao
 */

import list from '@/mixins/list'
import { createButton } from '@/utils'
import aisle from './mixins/aisle'

export default {
  name: '',

  mixins: [list, aisle],

  data() {
    return {
      /* 统计列表 */

      colConfig: [
        {
          title: '知识点编号',
          key: 'knowledge_number',
          align: 'center',
        },
        {
          title: '知识点名称',
          key: 'knowledge_name',
          align: 'center',
        },
        {
          title: '测试频次',
          key: 'amount',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '错误频次',
          key: 'wrong_count',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '是否薄弱',
          key: 'is_weak',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '操作',
          key: 6,
          align: 'center',
          render: createButton([{
            text: '查看',
            type: 'primary',
            click: this.toCheckInfo,
          }]),
        },
      ],

      buffer: {},

      /* 某知识点详情列表 */

      infoModal: {
        active: false,
      },

      infoColConfig: [
        {
          title: '题目ID',
          key: 'question_id',
          align: 'center',
        },
        {
          title: '是否正确',
          key: 'right_wrong_name',
          align: 'center',
        },
        {
          title: '测试时间',
          key: 'created_at',
          align: 'center',
        },
        {
          title: '测试ID',
          key: 'test_id',
          align: 'center',
        },
      ],

      infos: {},

      infosLabel: '',
    }
  },

  methods: {
    toCheckInfo({
      knowledge_id,
      knowledge_name,
    }) {
      const { id, typeID } = this.$route.params
      const url = '/algorithm/knowledge/detail/'
        + `${id}/${typeID}/${knowledge_id}`

      this.$http.get(url)
        .then((res) => {
          res.data.forEach((item) => {
            // eslint-disable-next-line
            item.created_at = item.created_at.slice(0, 10)
          })
          this.infosLabel = knowledge_name
          this.infos = res
          this.infoModal.active = true
        })
    },
  },
}
</script>

<style lang="less">
.algorithm-knowledge-show {

  &__info {

    & .info__title {
      margin-bottom: 15px;
      font-size: 14px;
      font-weight: normal;
    }

    & .ivu-modal-body {
      max-height: 500px;
      overflow: auto;
    }
  }
}
</style>
