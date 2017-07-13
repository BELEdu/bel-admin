<template>
  <main class="app-form-entire contract-detail">
    <app-editor-title></app-editor-title>

    <Card :bordered="false" dis-hover>
      <h4 slot="title">审批进度</h4>
      <Steps class="steps-fix" :current="0">
        <Step title="" content="咨询师张飞"></Step>
        <Step title="" content="咨询主任关羽"></Step>
        <Step title="" content="校长刘备"></Step>
        <Step title="" content="结束"></Step>
      </Steps>
    </Card>

    <Card class="contract-detail__info" :bordered="false" dis-hover>
      <h4 slot="title">审批内容</h4>
      <Row type="flex" justify="space-between">
        <Col class="contract-detail__info-student">
        <span>校区：厦门思明校区</span>
        <span>学员：李四</span>
        <span>学员编号：1025422545</span>
        <span>预览合同</span>
        </Col>
        <Col>
        <Button type="primary" size="small">下载合同</Button>
        <Button type="primary" size="small">预览合同</Button>
        </Col>
      </Row>
      <Table :columns="contractCol" :data="[detail]"></Table>
      <Table :columns="productCol" :data="detail.product_detail"></Table>
    </Card>

    <Card class="contract-detail__opinion" :bordered="false" dis-hover>
      <h4 slot="title">审批意见</h4>
      <Form :model="comment" ref="comment" :rules="commentRule">
        <Form-item prop="text">
          <Input type="textarea" :rows="5" v-model="comment.text"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="submit('comment',3)" :loading="loading[1]">同意</Button>
          <Button type="success">保存</Button>
          <Button type="error" @click="submit('comment',1)" :loading="loading[3]">驳回</Button>
        </Form-item>
      </Form>
    </Card>

    <Card :bordered="false" dis-hover>
      <h4 slot="title">审批历史</h4>
      <Table :columns="hisCol" :data="detail.approval"></Table>
    </Card>
  </main>
</template>

<script>
/**
 * 合同审批 - 审批流程
 * @author hjz
 * @version 2017-06-08
 */
import { Http } from '@/utils'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig, list_decode } from './modules/auditConfig'

export default {
  name: 'ContractAudit',

  data: () => ({
    // "取消"按钮行为的路由对象
    backRoute: null,
    // 列表配置
    ...colConfig,
    // 合同详情页数据
    detail: {},
    // 提交按钮状态控制
    loading: [true, false, true, false],
    // 单独请求的数据...
    // 表单验证
    commentRule: {
      text: [
        { required: true, message: '请填写审批意见', trigger: 'blur' },
      ],
    },
    // 评论数据
    comment: { text: '' },
  }),

  methods: {
    submit(name, apply_status) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$set(this.loading, apply_status, true)
          const id = this.$route.params.id
          const comment = this.comment.text
          Http.post(`/contract/approval/${id}`, { comment, apply_status })
            .then(() => this.$set(this.loading, apply_status, false))
        }
      })
    },
    cancel() {
      if (this.backRoute === null || this.backRoute.matched.length === 0) {
        // 根据上级路由路径
        this.$router.push('/business/hotline')
      } else {
        this.$router.push(this.backRoute.fullPath)
      }
    },
  },

  created() {
    // Http.get('/dict?keys=gender')
    //   .then((res) => {
    //     this.gender = res.gender
    //   })

    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => { this.detail = list_decode(res); this.$store.commit(GLOBAL.LOADING.HIDE) })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

  beforeRouteEnter(to, from, next) {
    // eslint-disable-next-line
    next((vm) => { vm.backRoute = from })
  },
}
</script>

<style lang="less">
.contract-detail {

  &__info {
    margin-top: 20px !important;

    &-student {
      & span {
        margin-right: 10px;
      }
    }

    & .ivu-table-wrapper {
      margin-top: 20px !important;
    }
  }

  &__opinion {
    margin-top: 20px !important;

    & button {
      margin-top: 0 !important;
    }
  }
}
</style>
