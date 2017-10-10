<template>
  <Card :bordered="false" dis-hover>

    <p slot="title">
      <Icon type="person-add"></Icon>
      基本信息
    </p>

    <a slot="extra" v-if="isUpdate && !isReview">
      学员编号：{{form.number}}
    </a>

    <Row>
      <Col span="23" offset="1">
        <Form-item label="学员头像" >
          学员头像
        </Form-item>
      </Col>
    </Row>

    <Row>
      <Col span="11" offset="1">

        <Form-item label="学员姓名" prop="display_name">
          <Input placeholder="请输入学员姓名" v-model="form.display_name"></Input>
        </Form-item>

        <Form-item label="学员性别">
          <Radio-group v-model="form.gender">
            <Radio
              v-for="gender in genders"
              :key="gender.value"
              :label="gender.value"
            >{{gender.display_name}}</Radio>
          </Radio-group>
        </Form-item>

        <Form-item label="学员手机号码" prop="phone">
          <Input placeholder="请输入手机号码" v-model="form.phone"></Input>
        </Form-item>

        <Form-item label="学员身份证号" prop="identity_card">
          <Input placeholder="请输入身份证号" v-model="form.identity_card"></Input>
        </Form-item>

        <Form-item label="出生日期">
          <app-date-picker placeholder="请选择日期" v-model="form.birth_at"></app-date-picker>
        </Form-item>

        <Form-item label="当前状态" v-if="isReview">
          <Select placeholder="请选择..." v-model="form.student_current_status">
            <Option
              v-for="status in studentCurrentStatus"
              :key="status.value"
              :value="status.value"
            >{{ status.display_name }}</Option>
          </Select>
        </Form-item>

      </Col>

      <Col span="11" offset="1">

        <Form-item label="家庭地址">
          <app-map-cascader v-model="form.areas_code"></app-map-cascader>
        </Form-item>

        <Form-item>
          <Input placeholder="请输入街道地址" v-model="form.address"></Input>
        </Form-item>

        <Form-item label="在读学校">
          <Select placeholder="请选择..." v-model="form.current_school">
            <Option
              v-for="school in currentSchoolList"
              :key="school.id"
              :value="school.id"
            >{{ school.display_name }}</Option>
          </Select>
        </Form-item>

        <Form-item label="当前年级">
          <Select placeholder="请选择..." v-model="form.current_grade">
            <Option
              v-for="grade in grades"
              :key="grade.value"
              :value="grade.value"
            >{{ grade.display_name }}</Option>
          </Select>
        </Form-item>

         <Form-item label="家庭经济状况">
          <Radio-group v-model="form.family_income_type">
            <Radio
              v-for="item in familyIncomeType"
              :key="item.value"
              :label="item.value"
            >{{item.display_name}}</Radio>
          </Radio-group>
        </Form-item>

        <Form-item label="建档人" v-if="isReview">
          <Input v-model="form.user_id" readonly></Input>
        </Form-item>

        <Form-item label="所有签约校区" v-if="isReview">
          <Input v-model="form.department_name" readonly></Input>
        </Form-item>

      </Col>
    </Row>
  </Card>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      required: true,
    },
    isUpdate: {
      type: Boolean,
      required: true,
    },
    isReview: {
      type: Boolean,
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
    currentSchoolList: {
      type: Array,
      default: () => [],
    },
    studentCurrentStatus: {
      type: Array,
      default: () => [],
    },
    familyIncomeType: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
