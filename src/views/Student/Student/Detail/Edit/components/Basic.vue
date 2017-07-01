<template>
  <Card :bordered="false" dis-hover>
    <p slot="title">
      <Icon type="person-add"></Icon> 学员的基本信息</p>
    <a slot="extra">（
      <span class="color-error">*</span> 为必填项，签约后只能由管理员修改）</a>
    <Row>
      <Col span="11">
        <Form-item label="学员姓名" prop="display_name">
          <Input placeholder="请输入学员姓名" v-model="form.display_name"></Input>
        </Form-item>
        <Form-item label="学员编号" v-if="isUpdate">
          <Input v-model="form.number" disabled></Input>
        </Form-item>
        <Form-item label="学员性别">
          <Radio-group v-model="form.gender">
            <Radio v-for="gender in genders" :key="gender.value" :label="gender.value">{{gender.display_name}}</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="联系方式" prop="phone">
          <Input placeholder="请输入手机号码" v-model="form.phone"></Input>
        </Form-item>
        <Form-item label="出生日期">
          <Date-picker placeholder="请选择日期" v-model="form.sublist.birth_at"></Date-picker>
        </Form-item>
        <Form-item label="身份证号" prop="identity_card">
          <Input placeholder="请输入身份证号" v-model="form.identity_card"></Input>
        </Form-item>
        <Form-item label="入学年级">
          <Select placeholder="请选择..." v-model="form.join_grade">
            <Option v-for="grade in grades" :key="grade.value" :value="grade.value">{{ grade.display_name }}</Option>
          </Select>
        </Form-item>
        <Form-item label="当前年级">
          <Select placeholder="请选择..." v-model="form.current_grade">
            <Option v-for="grade in grades" :key="grade.value" :value="grade.value">{{ grade.display_name }}</Option>
          </Select>
        </Form-item>
        <Form-item label="在读学校">
          <Input placeholder="请输入在读学校" v-model="form.school_name"></Input>
        </Form-item>
        <Form-item label="文理科">
          <Radio-group v-model="form.subject_type">
            <Radio v-for="type in subjectTypes" :key="type.value" :label="type.value">{{type.display_name}}</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="是否复读">
          <Radio-group v-model="form.is_repeat">
            <Radio :label="0">否</Radio>
            <Radio :label="1">是</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="初始建档人" v-if="isUpdate">
          <Input v-model="form.user_id" disabled></Input>
        </Form-item>
      </Col>

      <Col span="11" offset="1">
        <Form-item label="归属咨询师">
          <Select placeholder="请选择..." v-model="form.belong_counselor">
            <Option :value="1">张三</Option>
            <Option :value="2">李四</Option>
            <Option :value="3">王五</Option>
          </Select>
        </Form-item>
        <Form-item label="归属学管师">
          <Select placeholder="请选择..." v-model="form.belong_customer_relationships">
            <Option :value="1">张三</Option>
            <Option :value="2">李四</Option>
            <Option :value="3">王五</Option>
          </Select>
        </Form-item>
        <Form-item label="归属教师">
          <Select placeholder="请选择..." v-model="form.sublist.belong_teacher">
            <Option :value="1">张三</Option>
            <Option :value="2">李四</Option>
            <Option :value="3">王五</Option>
          </Select>
        </Form-item>
        <Form-item label="转介绍员工">
          <Select placeholder="请选择..." v-model="form.sublist.turn_recommend_staff">
            <Option :value="1">张三</Option>
            <Option :value="2">李四</Option>
            <Option :value="3">王五</Option>
          </Select>
        </Form-item>
        <Form-item label="转介绍学员">
          <Select placeholder="请选择..." v-model="form.sublist.turn_recommend_student">
            <Option :value="1">张三</Option>
            <Option :value="2">李四</Option>
            <Option :value="3">王五</Option>
          </Select>
        </Form-item>
        <Form-item label="VIP">
          <Radio-group v-model="form.is_vip">
            <Radio :label="0">否</Radio>
            <Radio :label="1">是</Radio>
          </Radio-group>
          </Select>
        </Form-item>
        <Form-item label="客户资源所在地">
          <Input v-model="form.sublist.customer_resource" placeholder="请输入所在地"></Input>
        </Form-item>
        <Form-item label="信息来源">
          <Input placeholder="请输入信息来源" v-model="form.sublist.information_source"></Input>
        </Form-item>
        <Form-item label="沟通类型">
          <Select placeholder="请选择..." v-model="form.sublist.communication_type">
            <Option v-for="item in communicationTypes" :key="item.value" :value="item.value">{{ item.display_name }}</Option>
          </Select>
        </Form-item>
        <Form-item label="当前状态">
          <Select placeholder="请选择..." v-model="form.student_current_status">
            <Option v-for="status in studentCurrentStatus" :key="status.value" :value="status.value">{{ status.display_name }}</Option>
          </Select>
        </Form-item>
        <Form-item label="初始签约人" v-if="isUpdate">
          <Input v-model="form.original_contractor_id" disabled></Input>
        </Form-item>
      </Col>
    </Row>
  </Card>
</template>

<script>
export default {
  props: {
    isUpdate: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    genders: {
      type: Array,
      default: () => [],
    },
    grades: {
      type: Array,
      default: () => [],
    },
    communicationTypes: {
      type: Array,
      default: () => [],
    },
    studentCurrentStatus: {
      type: Array,
      default: () => [],
    },
    subjectTypes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
