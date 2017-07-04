<template>
  <main class="communication">
    <Form class="app-search-form">
      <Form-item label="沟通日期">
        <Date-picker class="communication__form-date" placeholder="开始日期"></Date-picker>
      </Form-item>
      <Form-item label="至">
        <Date-picker class="communication__form-date" placeholder="结束日期"></Date-picker>
      </Form-item>
      <Form-item label="内容查找">
        <Input class="communication__form-keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item label="当前状态">
        <Select placeholder="当前状态选择">
          <Option value="1">未签约</Option>
          <Option value="2">已结课</Option>
          <Option value="3">已休学</Option>
          <Option value="4">已签约</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary">查询搜索</Button>
      </Form-item>
    </Form>
  
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2>沟通记录</h2>
      </Col>
      <Col>
      <Button type="primary" icon="archive">下载导入模板</Button>
      <Button type="primary">导入记录</Button>
      <Button type="primary" @click="toCreate()">添加记录</Button>
      </Col>
    </Row>
  
    <Table v-if="buffer" :columns="colConfig" :data="buffer.data" border></Table>
  
    <app-pager :data="buffer" @on-change="pageTo" @on-page-size-change="pagesizeTo"></app-pager>
  
    <!--删除提醒框-->
    <app-warn-modal v-model="warn.show" :title="warn.title" :loading="warn.loading" @on-ok="doDelete()">
      <p>删除该条记录后将无法再恢复，是否继续删除？</p>
    </app-warn-modal>
  </main>
</template>

<script>
/**
 * 业务管理 - 沟通记录
 * @author hjz
 * @version 2017-06-06
 */
import { mapState } from 'vuex'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig } from './modules/config'


export default {
  name: 'business-communication',

  data() {
    return {
      // 删除对话框数据
      warn: {
        show: false,
        title: '确认删除',
        row: null,
        loading: false,
      },
      colConfig: colConfig(this),
    }
  },

  computed: {
    ...mapState({
      buffer: state => state.business.buffer.communication,
    }),
  },

  methods: {
    pageTo(page) {
      const per_page = this.buffer.per_page
      this.$router.push({ path: this.$route.path, query: { page, per_page } })
    },
    pagesizeTo(per_page) {
      this.$router.push({ path: this.$route.path, query: { page: 1, per_page } })
    },
    toCreate() {
      this.$router.push('/business/communication/edit')
    },
    toUpdate(row) {
      this.$router.push(`/business/communication/edit/${row.id}`)
    },
    // 提醒：预备删除某一列
    toDelete(row) {
      this.warn.show = true
      this.warn.row = row
    },
    // 确认删除
    doDelete() {
      this.warn.loading = true
      this.$store.dispatch(BUSINESS.EDIT.DELETE, this.warn.row.id)
        .then(() => {
          this.warn.loading = false
          this.warn.show = false
        })
    },
  },

  // 根据当前路由进行初始化
  created() {
    this.$store.dispatch(BUSINESS.PAGE.INIT, this.$route)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch(BUSINESS.PAGE.INIT, to)
      .then(() => { this.$store.commit(GLOBAL.LOADING.HIDE); next() })
  },
}
</script>

<style lang="less">
.communication {

  & .ivu-form-item {
    display: inline-block;

    &:first-child {
      margin-right: 7px;
    }
  }

  & .ivu-form-item-label {
    font-size: 14px;
  }

  & .ivu-form-item-content {
    display: inline-block;
  }

  &__form-keyword {
    width: 200px;
  }

  &__form-date {
    width: 150px;
  }
}

.app-search-form {

  &>.ivu-form-item {

    &:last-child {
      float: right;
      margin-right: 0;
    }
  }
}
</style>
