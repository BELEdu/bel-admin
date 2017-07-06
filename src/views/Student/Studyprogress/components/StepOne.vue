<template>
  <div>
    <Row class="studyprogress-flex clear" type="flex">
      <Col>
        <Form-item class="original" label="当前年级：" :label-width="90">
          <strong>七年级</strong>
        </Form-item>
      </Col>

      <Col>
        <Form-item class="original" label="上课科目" :label-width="90">
          <Select class="original">
            <Option v-for="subjectType in subjectTypes" :value="subjectType.value" :key="subjectType">{{ subjectType.display_name }}</Option>
          </Select>
        </Form-item>
      </Col>

      <Col>
        <Form-item class="original" label="教材版本" :label-width="90">
          <Select class="original">
            <Option v-for="version in versions" :value="version.value" :key="version.value">{{ version.display_name }}</Option>
          </Select>
        </Form-item>
      </Col>

      <Col>
        <Form-item class="original" label="教师" :label-width="90">
          <Select class="original">
            <Option v-for="subjectType in subjectTypes" :value="subjectType.value" :key="subjectType">{{ subjectType.display_name }}</Option>
          </Select>
        </Form-item>
      </Col>
    </Row>

    <Form-item label="学员个性分析">
      <Input type="textarea" :rows="4" v-model="form.character_analysis"></Input>
    </Form-item>

    <Form-item label="拟采用的方法或措施">
      <Input type="textarea" :rows="4" v-model="form.methods_measures"></Input>
    </Form-item>

    <Form-item label="教学目标">
      <Input type="textarea" :rows="4" v-model="form.methods_measures"></Input>
    </Form-item>
  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 创建/编辑计划 - 第一部分
 * @author lmh
 * @version 2017-06-29
 */

export default {
  name: 'app-student-studyprogress-editplan-one',

  props: {
    subjectTypes: {
      type: Array,
      default: () => [],
    },
    versions: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less">
.studyprogress-flex {
  .ivu-col {
    flex: 1;

    &:first-child {
      flex: none;
      width: 140px;
    }
  }

  .ivu-form-item-label {
    padding-right: 1em;
  }
}

.ie {
  .studyprogress-flex {
    .ivu-col {
      float: left;

      &:not(:first-child) {
        width: calc(~"(100% - 140px) / 3")
      }
    }
  }
}
</style>

