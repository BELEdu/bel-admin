<template>
  <div class="hotline">
    <Form class="app-search-form">
      <Form-item label="来访日期">
        <Date-picker class="hotline__form-date" placeholder="开始日期"></Date-picker>
      </Form-item>
      <Form-item label="至">
        <Date-picker class="hotline__form-date" placeholder="结束日期"></Date-picker>
      </Form-item>
      <Form-item label="内容查找">
        <Input class="hotline__form-keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Checkbox></Checkbox>
        <span style="font-size: 14px;">不显示停售</span>
      </Form-item>
      <Form-item style="float: right; margin: 0;">
        <Button type="primary">查询搜索</Button>
      </Form-item>
    </Form>
  
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">产品管理</h2>
      </Col>
      <Col>
      <Button type="primary" @click="toCreate()">添加产品</Button>
      </Col>
    </Row>
  
    <Table size="small" :columns="fcol" :data="fdata" stripe></Table>
  
    <app-pager></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 产品管理
 * @author hjz
 * @version 2017-06-06
 */
import { createButton } from '@/utils'
import { GLOBAL } from '@/store/mutationTypes'
import fdata from './fdata'

export default {
  name: 'business-hotline',

  data() {
    return {
      fcol: [
        { title: '产品编号', key: '1', align: 'center' },
        { title: '产品名称', key: '2', align: 'center', width: 200 },
        { title: '产品类型', key: '3', align: 'center', width: 250 },
        { title: '产品子分类', key: '4', align: 'center' },
        { title: '课程时长（分中）', key: '5', align: 'center' },
        { title: '产品单价（元）', key: '6', align: 'center' },
        { title: '创建人', key: '7', align: 'center' },
        { title: '创建时间', key: '8', align: 'center' },
        { title: '销售状态', key: '9', align: 'center' },
        {
          title: '操作',
          key: '10',
          align: 'center',
          render: createButton([
            { icon: 'trash-a', type: 'error' },
            { icon: 'edit', type: 'primary', click: this.toupdate },
          ]),
        },
      ],
      fdata,
    }
  },

  methods: {
    toCreate() {
      this.$router.push('/business/productedit')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.hotline {

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
</style>
