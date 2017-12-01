<template>
  <div class="algorithm-knowledge-info">
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
        type="warning"
        @click="toggleList('show')"
      >显示统计列表</Button>
    </div>

    <!-- 明细列表 -->

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
  </div>
</template>

<script>
/**
 * 算法中心 - 学员知识详情
 *
 * @author
 */

import list from '@/mixins/list'
import aisle from './mixins/aisle'

export default {
  name: '',

  mixins: [list, aisle],

  data() {
    return {
      /* --- 列表 --- */
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
          sortable: 'custom',
        },
        {
          title: '题目编号',
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
          sortable: 'custom',
        },
        {
          title: '测试编号',
          key: 'test_id',
          align: 'center',
          sortable: 'custom',
        },
      ],

      buffer: {},
    }
  },
}
</script>

<style lang="less">
.algorithm-knowledge-info {

  &__info {

    & .info__title {
      margin-bottom: 15px;
      font-weight: normal;
    }
  }
}
</style>
