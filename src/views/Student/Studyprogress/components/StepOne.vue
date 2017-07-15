<template>
  <div>
    <Row class="studyprogress-flex clear" type="flex">

      <Col>
        <Form-item class="original" label="上课科目" :label-width="120" prop="subject_type">
          <Select class="original" v-model="form.subject_type" :disabled="!isAdd">
            <Option v-for="subjectType in subjectTypes" :value="subjectType.value" :key="subjectType.value">{{ subjectType.display_name }}</Option>
          </Select>
        </Form-item>
      </Col>

      <Col>
        <Form-item class="original" label="教材版本" :label-width="90" prop="teaching_version">
          <Select class="original" v-model="form.teaching_version" :disabled="!isAdd">
            <Option v-for="version in versions" :value="version.value" :key="version.value">{{ version.display_name }}</Option>
          </Select>
        </Form-item>
      </Col>

      <Col>
        <Form-item class="original" label="教师" :label-width="90" prop="teacher_id">
          <Select class="original" v-model="form.teacher_id" :disabled="!isAdd">
            <Option v-for="teacher in teachers" :value="teacher.id" :key="teacher.id">{{ teacher.username }}</Option>
          </Select>
        </Form-item>
      </Col>
    </Row>

    <Form-item :label="analysisLabel">
      <Input type="textarea" :rows="4" v-model="form.character_analysis" placeholder="请输入学员分析"></Input>
    </Form-item>

    <Form-item label="方法或措施">
      <Input type="textarea" :rows="4" v-model="form.methods_measures" placeholder="请输入拟采用的的方法或措施"></Input>
    </Form-item>

    <Form-item label="教学目标">
      <Input type="textarea" :rows="4" v-model="form.teaching_objectives" placeholder="请输入教学目标"></Input>
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
    teachers: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      required: true,
    },
    isStudent: {
      type: Boolean,
      required: true,
    },
    isAdd: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    analysisLabel() {
      return this.isStudent ? '学员个性分析' : '班级学员分析'
    },
  },
}
</script>

<style lang="less">
.studyprogress-flex {
  .ivu-col {
    flex: 1;

    // &:first-child {
    //   flex: none;
    //   width: 140px;
    // }
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

