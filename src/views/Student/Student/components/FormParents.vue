<template>
  <Card
    class="student-student-edit__parent"
    :bordered="false"
    dis-hover
  >
    <p slot="title">
      <Icon type="person-stalker"></Icon>
      家长信息
    </p>

    <Card
      :bordered="false"
      dis-hover
      v-for="(item, index) in parent"
      :key="index"
    >
      <p slot="title">
        家长（{{ index + 1 }}）
      </p>

      <a slot="extra">
        <Button
          v-if="!isReview"
          class="student-student-edit__delete"
          type="warning"
          icon="close"
          size="small"
          @click="$emit('removeParent', index)"
        >删除</Button>
      </a>

      <Row>
        <Col span="11" offset="1">

          <Form-item label="家长姓名"
            :prop="`parent.${index}.parent_name`"
            :rules="[$rules.required('家长姓名'),$rules.name]"
          >
            <Input placeholder="请输入家长姓名" v-model="item.parent_name"></Input>
          </Form-item>

          <Form-item label="家长性别">
            <Radio-group v-model="item.gender">
              <Radio
                v-for="gender in genders"
                :key="gender.value"
                :label="gender.value"
              >{{gender.display_name}}</Radio>
            </Radio-group>
          </Form-item>

          <Form-item label="家长手机号码"
            :prop="`parent.${index}.phone`"
            :rules="[$rules.mobile]"
          >
            <Input placeholder="请输入手机号码" v-model="item.phone"></Input>
          </Form-item>

        </Col>

        <Col span="11" offset="1">

          <Form-item label="家长身份证号"
            :prop="`parent.${index}.identity_card`"
            :rules="[$rules.idcard]"
          >
            <Input placeholder="请输入身份证号" v-model="item.identity_card"></Input>
          </Form-item>

          <Form-item label="是否监护人">
            <Radio-group v-model="item.is_guardian">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </Radio-group>
          </Form-item>

          <Form-item label="亲属关系">
            <Select placeholder="请选择..." v-model="item.relation">
              <Option
                v-for="item in relation"
                :key="item.value"
                :value="item.value"
              >{{ item.display_name }}</Option>
            </Select>
          </Form-item>

        </Col>

      </Row>
    </Card>

    <Button
      v-if="!isReview"
      type="dashed"
      icon="plus"
      class="color-primary"
      size="large"
      long
      @click="$emit('addParent')"
    >添加家长</Button>
  </Card>
</template>

<script>
export default {
  props: {
    parent: {
      type: Array,
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
    relation: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="less">
.student-student-edit {
  &__parent {
    .ivu-card-head {
      padding-right:0;
    }
    .ivu-card-body .ivu-card-body{
      padding: 16px 0;
    }
  }
}
</style>
