<template>
  <div class="hotline">
    <Form class="app-search-form">
      <Form-item label="沟通日期">
        <Date-picker class="hotline__form-date" placeholder="开始日期"></Date-picker>
      </Form-item>
      <Form-item label="至">
        <Date-picker class="hotline__form-date" placeholder="结束日期"></Date-picker>
      </Form-item>
      <Form-item label="内容查找">
        <Input class="hotline__form-keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item label="当前状态">
        <Select placeholder="当前状态选择">
          <Option value="1">未签约</Option>
          <Option value="2">已结课</Option>
          <Option value="3">已休学</Option>
          <Option value="3">已签约</Option>
        </Select>
      </Form-item>
      <Form-item style="float: right; margin: 0;">
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
      <Button type="primary" @click="tocreate()">添加记录</Button>
      </Col>
    </Row>
  
    <Table size="small" :columns="fcol" :data="fdata" stripe></Table>
  
    <app-pager></app-pager>
    <!---->
    <!--<comm-editor></comm-editor>-->
  </div>
</template>

<script>
/**
 * 业务管理 - 沟通记录
 * @author hjz
 * @version 2017-06-06
 */
import { createButton } from '@/utils'
import { GLOBAL } from '@/store/mutationTypes'
import fdata from './fdata'

export default {
  name: 'biz-hotline',

  data() {
    return {
      fcol: [
        { title: '首次沟通时间', key: '1', align: 'center', width: 110 },
        { title: '最新回访时间', key: '2', align: 'center', width: 110 },
        { title: '联系方式', key: '3', align: 'center', width: 115 },
        { title: '学员姓名', key: '4', align: 'center' },
        { title: '性别', key: '5', align: 'center' },
        { title: '在读学校', key: '6', align: 'center' },
        { title: '当前年级', key: '7', align: 'center' },
        { title: '年段排名', key: '8', align: 'center' },
        { title: '偏科', key: '9', align: 'center', width: 60 },
        { title: '签约状态', key: '10', align: 'center', width: 90 },
        { title: '类型', key: '11', align: 'center' },
        { title: '最新沟通情况', key: '12', align: 'center', width: 300 },
        {
          title: '操作',
          key: '13',
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
    tocreate() {
      this.$router.push('/business/commedit')
    },
    toupdate() {
      this.$router.push('/business/commedit/1234')
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
