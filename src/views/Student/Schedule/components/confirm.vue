<template>
  <Form ref="form" :model="formData" :rules="formRules" class="course-confirm">
    <Row>
      <Col :span="4">
        班级名称：
      </Col>
      <Col :span="20">
        {{ formData.classes_name }}
      </Col>
    </Row>
    <Row>
      <Col :span="4">
        课序：
      </Col>
      <Col :span="8">
        第{{ formData.sort_value }}节课
      </Col>
      <Col :span="4">
        上课时间：
      </Col>
      <Col :span="4">
        {{ formData.schedule_date }} {{ formData.schedule_range }}
      </Col>
    </Row>
    <Row>
      <Col :span="4">
        计划课时：
      </Col>
      <Col :span="8">
        {{ formData.course_num }}
      </Col>
      <Col :span="4">
        学管师：
      </Col>
      <Col :span="4">
        {{ formData.schedule_teacher_name }}
      </Col>
    </Row>
    <Row>
      <Col :span="4">
        内容：
      </Col>
      <Col :span="20">
        <Form-item prop="course_chapter">
          <app-tree-select :data="currentChapter" multiple v-model="formData.course_chapter"></app-tree-select>
        </Form-item>
      </Col>
    </Row>
    <Row>
      <Col :span="4">
        实际上课课时：
      </Col>
      <Col :span="20">
        <Select>
          <Option v-for="item in 8" :key="item">{{ item }}</Option>
        </Select>
      </Col>
    </Row>
    <Row>
      <Col :span="4">
        学员考勤：
      </Col>
      <Col :span="20">
        <Row>
          <Col :span="4">
            <Checkbox :true-value="1" :false-value="0">学员</Checkbox>
          </Col>
          <Col :span="6" :offset="2">
            <Checkbox :true-value="1" :false-value="0">算课时</Checkbox>
          </Col>
        </Row>
      </Col>
    </Row>
  </Form>
</template>

<script>
  /**
   * 确认排课 | 确认上课
   * @author chenliangshan
   * @version 2017-10-23
   */

  export default {
    name: 'course-confirm',

    props: {
      statusType: {
        type: Number,
        required: true,
      },
    },

    data() {
      return {
        formData: {},

        currentChapter: [],
      }
    },

    methods: {

    },
  }
</script>

<style lang="less" scoped>
  .course-confirm {

  }
</style>
