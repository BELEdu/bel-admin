<template>
  <div>
    <app-editor-title></app-editor-title>
    <Form :label-width="130" class="app-form-entire">
      <Row>
        <!-- 学员基本信息 -->
        <Col span="24" >
          <Card :bordered="false" dis-hover>
            <p slot="title"><Icon type="person-add"></Icon> 学员的基本信息</p>
            <a slot="extra" >（<span class="color-error">*</span> 为必填项，签约后只能由管理员修改）</a>
            <Row>
              <Col span="11">
                <Form-item label="学员姓名" required>
                  <Input placeholder="请输入学员姓名" v-model="formStudent.name"></Input>
                </Form-item>
                <Form-item label="学员编号">
                  <Input v-model="formStudent.id" disabled></Input>
                </Form-item>
                <Form-item label="学员性别">
                  <Radio-group v-model="formStudent.sex">
                    <Radio label="male">男</Radio>
                    <Radio label="female">女</Radio>
                  </Radio-group>
                </Form-item>
                <Form-item label="联系方式">
                  <Input placeholder="请输入手机号码" v-model="formStudent.tel"></Input>
                </Form-item>
                <Form-item label="出生日期">
                  <Date-picker placeholder="请选择日期" v-model="formStudent.date"></Date-picker>
                </Form-item>
                <Form-item label="身份证号">
                  <Input placeholder="请输入身份证号" v-model="formStudent.card"></Input>
                </Form-item>
                <Form-item label="入学年级">
                  <Select placeholder="请选择..." v-model="formStudent.join">
                      <Option value="1">小学一年级</Option>
                      <Option value="2">小学二年级</Option>
                      <Option value="3">小学三年级</Option>
                  </Select>
                </Form-item>
                <Form-item label="当前年级">
                  <Select placeholder="请选择..." v-model="formStudent.grade">
                      <Option value="1">小学一年级</Option>
                      <Option value="2">小学二年级</Option>
                      <Option value="3">小学三年级</Option>
                  </Select>
                </Form-item>
                <Form-item label="在读学校">
                  <Input placeholder="请输入在读学校" v-model="formStudent.school"></Input>
                </Form-item>
                <Form-item label="文理科">
                  <Radio-group v-model="formStudent.subject">
                    <Radio label="li">理科</Radio>
                    <Radio label="wen">文科</Radio>
                    <Radio label="no">不分科</Radio>
                  </Radio-group>
                </Form-item>
                <Form-item label="是否复读">
                  <Radio-group v-model="formStudent.fudu">
                    <Radio label="yes">是</Radio>
                    <Radio label="no">否</Radio>
                  </Radio-group>
                </Form-item>
                <Form-item label="初始建档人">
                  <Select placeholder="请选择..." v-model="formStudent.create" disabled>
                    <Option value="1">张三</Option>
                    <Option value="2">李四</Option>
                    <Option value="3">王五</Option>
                  </Select>
                </Form-item>
              </Col>
              <Col span="11" offset="1">
                <Form-item label="归属咨询师">
                  <Select placeholder="请选择..." v-model="formStudent.teacher1">
                      <Option value="1">张三</Option>
                      <Option value="2">李四</Option>
                      <Option value="3">王五</Option>
                  </Select>
                </Form-item>
                <Form-item label="归属学管师">
                  <Select placeholder="请选择..." v-model="formStudent.teacher2">
                    <Option value="1">张三</Option>
                    <Option value="2">李四</Option>
                    <Option value="3">王五</Option>
                  </Select>
                </Form-item>
                <Form-item label="归属教师">
                  <Select placeholder="请选择..." v-model="formStudent.teacher3">
                    <Option value="1">张三</Option>
                    <Option value="2">李四</Option>
                    <Option value="3">王五</Option>
                  </Select>
                </Form-item>
                <Form-item label="转介绍员工">
                  <Select placeholder="请选择..." v-model="formStudent.staff">
                    <Option value="1">张三</Option>
                    <Option value="2">李四</Option>
                    <Option value="3">王五</Option>
                  </Select>
                </Form-item>
                <Form-item label="转介绍学员">
                  <Select placeholder="请选择..." v-model="formStudent.student">
                    <Option value="1">张三</Option>
                    <Option value="2">李四</Option>
                    <Option value="3">王五</Option>
                  </Select>
                </Form-item>
                <Form-item label="VIP">
                  <Select placeholder="请选择..." v-model="formStudent.vip">
                    <Option value="1">非VIP</Option>
                    <Option value="2">VIP</Option>
                  </Select>
                </Form-item>
                <Form-item label="客户资源所在地">
                  <Input placeholder="请输入所在地" v-model="formStudent.address"></Input>
                </Form-item>
                <Form-item label="信息来源">
                  <Input placeholder="请输入信息来源" v-model="formStudent.come"></Input>
                </Form-item>
                <Form-item label="沟通类型" >
                  <Select placeholder="请选择..." v-model="formStudent.type">
                    <Option value="1">上门</Option>
                    <Option value="2">转介绍</Option>
                    <Option value="3">直访</Option>
                    <Option value="4">热线</Option>
                  </Select>
                </Form-item>
                <Form-item label="当前状态">
                  <Select placeholder="请选择..." v-model="formStudent.status">
                    <Option value="1">未签约</Option>
                    <Option value="2">上课</Option>
                    <Option value="3">停课</Option>
                    <Option value="4">休学</Option>
                    <Option value="5">结课</Option>
                  </Select>
                </Form-item>
                <Form-item label="初始签约人">
                  <Select placeholder="请选择..." v-model="formStudent.sign" disabled>
                    <Option value="1">张三</Option>
                    <Option value="2">李四</Option>
                    <Option value="3">王五</Option>
                  </Select>
                </Form-item>
              </Col>
            </Row>
          </Card>
        </Col>

        <!-- 家长信息 -->
        <Col span="24" >
          <Card :bordered="false" dis-hover>
            <p slot="title"><Icon type="person-stalker"></Icon> 家长信息</p>
            <a slot="extra" >（<span class="color-error">*</span> 为必填项，签约后只能由管理员修改）</a>

            <!-- 家长信息区域 -->
            <Row v-for="(item,index) in dataList" :key="item">
              <Card :bordered="false" dis-hover>
                <p slot="title">家长（{{index+1}}）</p>
                <a slot="extra" >
                  <Button type="warning" icon="close" size="small" @click="handleRemove(index)">删除</Button>
                </a>
                <Row>
                  <Col span="11">
                    <Form-item label="家长姓名" required>
                      <Input placeholder="请输入家长姓名"></Input>
                    </Form-item>
                    <Form-item label="家长性别">
                      <Radio-group >
                        <Radio>男</Radio>
                        <Radio>女</Radio>
                      </Radio-group>
                    </Form-item>
                    <Form-item label="联系方式" required>
                      <Input placeholder="请输入手机号码"></Input>
                    </Form-item>
                    <Form-item label="身份证号" required>
                      <Input placeholder="请输入身份证号"></Input>
                    </Form-item>
                    <Form-item label="是否监护人">
                      <Radio-group >
                        <Radio>是</Radio>
                        <Radio>否</Radio>
                      </Radio-group>
                    </Form-item>
                    <Form-item label="亲属关系">
                      <Input placeholder="请输入亲属关系"></Input>
                    </Form-item>
                  </Col>
                  <Col span="11" offset="1">
                    <Form-item label="现住城市">
                      <Input placeholder="请选择城市"></Input>
                    </Form-item>
                    <Form-item label="街道地址">
                      <Input placeholder="请输入详细地址"></Input>
                    </Form-item>
                    <Form-item label="家长Email">
                      <Input placeholder="请输入Email地址"></Input>
                    </Form-item>
                    <Form-item label="家庭年总收入">
                      <Input placeholder="请输入家庭年总收入"></Input>
                    </Form-item>
                    <Form-item label="辅助联系方式">
                      <Input placeholder="请输入联系方式"></Input>
                    </Form-item>
                  </Col>
                </Row>
              </Card>
            </Row>

          </Card>
        </Col>

        <!-- 添加家长按钮 -->
        <Button type="dashed" icon="plus" class="color-primary" size="large" long @click="handleAdd()">添加家长</Button>

        <!-- 表单提交按钮 -->
        <Form-item>
          <Button>取消</Button>
          <Button type="primary">提交</Button>
        </Form-item>

      </Row>
    </Form>
  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 -基础信息
 * @author zml
 * @version 2017-06-15
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-student-detail-edit',

  data() {
    return {
      // dataList: [0, 1],
      dataList: [0],
      formStudent: {
        name: '小明',
        id: '10086',
        sex: 'male',
        tel: '13003987000',
        date: '1998-09-30',
        school: '厦门蔡塘中学',
        card: '350206199401020000',
        join: '3',
        grade: '2',
        subject: 'wen',
        fudu: 'yes',
        teacher1: '1',
        teacher2: '2',
        teacher3: '3',
        staff: '1',
        student: '2',
        vip: '2',
        address: '厦门-软件园二期',
        come: '网络-并行站五',
        type: '2',
        status: '2',
        create: '3',
        sign: '2',
      },
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  methods: {
    handleAdd() {
      this.dataList.push(2)
    },
    handleRemove(index) {
      this.dataList.splice(index, 1)
    },
  },
}
</script>

<style lang="less">

@import '~vars';

</style>
