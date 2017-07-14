<template>
  <Card :bordered="false" dis-hover>
    <p slot="title"><Icon type="person-stalker"></Icon>家长信息</p>
    <a slot="extra">（<span class="color-error">*</span> 为必填项，签约后只能由管理员修改）</a>

    <Card :bordered="false" dis-hover v-for="(item, index) in parent" :key="index">
      <p slot="title">家长（{{ index + 1 }}）</p>
      <a slot="extra">
        <Button type="warning" icon="close" size="small" @click="$emit('removeParent', index)">删除</Button>
      </a>
      <Row>
        <Col span="11">
          <Form-item label="家长姓名"
            :prop="`parent.${index}.parent_name`"
            :rules="[$rules.required('家长姓名'),$rules.name]"
          >
            <Input placeholder="请输入家长姓名" v-model="item.parent_name"></Input>
          </Form-item>
          <Form-item label="家长性别">
            <Radio-group v-model="item.gender">
              <Radio
                v-for="gender in genders" :key="gender.value" :label="gender.value"
              >{{gender.display_name}}</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="联系方式"
            :prop="`parent.${index}.phone`"
            :rules="[$rules.required('家长联系方式'),$rules.mobile]"
          >
            <Input placeholder="请输入手机号码" v-model="item.phone"></Input>
          </Form-item>
          <Form-item label="身份证号" required
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
            <Input placeholder="请输入亲属关系" v-model="item.relation"></Input>
          </Form-item>
        </Col>

        <Col span="11" offset="1">
          <Form-item label="现住城市">
            <Input placeholder="请选择城市" v-model="item.city"></Input>
          </Form-item>
          <Form-item label="现住城市(测试)">
            <app-map-cascader v-model="item.cityData"></app-map-cascader>
          </Form-item>
          <Form-item label="街道地址">
            <Input placeholder="请输入详细地址" v-model="item.address"></Input>
          </Form-item>
          <Form-item label="家长Email"
            :prop="`parent.${index}.email`"
            :rules="[$rules.email]"
          >
            <Input placeholder="请输入Email地址" v-model="item.email"></Input>
          </Form-item>
          <Form-item label="家庭年总收入"
           :prop="`parent.${index}.total_score`"
           :rules="[$rules.price]"
          >
            <Input placeholder="请输入家庭年总收入" v-model="item.total_score"></Input>
          </Form-item>
          <Form-item label="辅助联系方式">
            <Input placeholder="请输入联系方式" v-model="item.other_phone"></Input>
          </Form-item>
        </Col>
      </Row>
    </Card>

    <Button type="dashed" icon="plus" class="color-primary" size="large" long @click="$emit('addParent')">添加家长</Button>
  </Card>
</template>

<script>
export default {
  props: {
    parent: {
      type: Array,
      required: true,
    },
    genders: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
