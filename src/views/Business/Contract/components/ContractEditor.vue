<template>
  <main class="app-form-entire contract-stage">
    <app-editor-title></app-editor-title>
    <Steps :current="current" class="contract-stage-step steps-fix">
      <Step title="选择流程" content="这里是该步骤的描述信息"></Step>
      <Step title="输入学员信息" content="这里是该步骤的描述信息"></Step>
      <Step title="选择产品" content="这里是该步骤的描述信息"></Step>
      <Step title="提交审批" content="这里是该步骤的描述信息"></Step>
    </Steps>
  
    <Form :label-width="130" v-show="current === 0">
      <Form-item label="合同名称" required>
        <Input placeholder="请输入合同名称"></Input>
      </Form-item>
      <Form-item label="审批流程" required>
        <Select>
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
        </Select>
      </Form-item>
      <Form-item label="咨询主任" required>
        <Select>
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
        </Select>
      </Form-item>
      <Form-item label="校长" required>
        <Select>
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
        </Select>
      </Form-item>
    </Form>
  
    <Form :label-width="130" v-show="current === 1">
      <template v-for="(item, index) in f2">
        <Form-item label="学生性别" v-model="formdata.gender" v-if="index === 9">
          <Radio-group>
            <Radio label="female">
              <span>男</span>
            </Radio>
            <Radio label="male">
              <span>女</span>
            </Radio>
          </Radio-group>
        </Form-item>
  
        <Row v-else-if="index === 6" type="flex">
          <Col span="9">
          <Form-item label="填写地址">
            <Cascader :data="casdata" placeholder="请选择地址"></Cascader>
          </Form-item>
          </Col>
          <Col span="15">
          <Form-item>
            <Input placeholder="请输入街道地址"></Input>
          </Form-item>
          </Col>
        </Row>
  
        <Form-item :label="item.label" v-else>
          <Input :placeholder="item.pholder"></Input>
        </Form-item>
      </template>
    </Form>
  
    <Form :label-width="130" v-show="current === 2">
      <Form class="contract-stage3-form" :label-width="95" inline>
        <template v-for="(item, index) in f3Products">
          <Form-item class="contract-stage3-form__select" label="选择产品" required>
            <Select v-model="item.type">
              <Option value="1">甲</Option>
              <Option value="2">乙</Option>
              <Option value="3">丙</Option>
            </Select>
          </Form-item>
          <Form-item label="购买数量">
            <Input-number v-model="item.amount"></Input-number>
          </Form-item>
          <Form-item label="优惠比例">
            <Input-number v-model="item.discount" :min="0" :max="10"></Input-number>
          </Form-item>
          <Form-item class="contract-stage3-form__delete">
            <Button size="small" type="error" @click.stop="deletef3Product(index)">删除</Button>
          </Form-item>
        </template>
        <Row type="flex" justify="center" class="contract-stage3-form__create">
          <Col span="4">
          <Button type="dashed" long icon="plus-round" size="small" @click.stop="createf3Product">新增产品</Button>
          </Col>
        </Row>
      </Form>
      <Form-item label="优惠金额">
        <Input placeholder="请输入优惠率"></Input>
      </Form-item>
      <Form-item label="辅导地点">
        <Input placeholder="请输入辅导地点"></Input>
      </Form-item>
      <Form-item label="审批说明">
        <Input type="textarea" :rows="6"></Input>
      </Form-item>
    </Form>
  
    <!--按钮组-->
    <Form :label-width="100">
      <Form-item>
        <Button>取消</Button>
        <Button type="ghost" @click="step(-1)">上一步</Button>
        <Button type="primary" @click="step(+1)">下一步</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 合同审批 - 添加审批
 * @author hjz
 * @version 2017-06-08
 */
import { GLOBAL } from '@/store/mutationTypes'
// 测试数据
import casdata from '@/views/Business/casdata'

export default {
  name: 'ContractEditor',

  data: () => ({
    current: 0,
    formdata: {
      gender: undefined,
    },
    f2: [
      { label: '学员姓名', pholder: '请输入姓名', required: true },
      { label: '学员手机号码', pholder: '请输入手机号码', required: true },
      { label: '家长姓名', pholder: '请输入姓名', required: true },
      { label: '家长手机号码', pholder: '请输入手机号码', required: true },
      { label: '家长身份证号码', pholder: '请输入身份证号', required: false },
      { label: '亲属关系', pholder: '请输入亲属关系', required: false },
      null,
      { label: '在读学校', pholder: '请输入学校名称', required: false },
      { label: '学习科目', pholder: '请输入学校名称', required: false },
      null,
    ],
    casdata,
    f3Products: [
      { type: '', amount: 0, discount: 10 },
    ],
  }),

  methods: {
    createf3Product() {
      this.f3Products.push({ type: '', amount: 0, discount: 10 })
    },
    deletef3Product(index) {
      this.f3Products.splice(index, 1)
    },
    step(value) {
      if (this.current > 3 || this.current < 0) return
      this.current = this.current + value
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.contract-stage-step {
  margin-bottom: 30px;
  padding-left: 50px;
}

.contract-stage3-form {
  margin-left: 35px !important;
  margin-bottom: 30px !important;

  &__delete {
    &.ivu-form-item {
      margin: 0 !important;
    }

    & .ivu-form-item-content {
      margin-left: 17px !important;
    }
  }
  &__select {
    & .ivu-form-item-content {
      width: 398px !important;
    }
  }
}
</style>
