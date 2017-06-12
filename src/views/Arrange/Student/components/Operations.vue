<template>
  <div class="arrange-operation">
    <div class="arrange-operation__btns">
      <Button v-if="item.status.indexOf(0) >= 0" type="primary" size="small" @click="openModal('affirm')">确认排课</Button>
      <Button v-if="item.status.indexOf(1) >= 0" type="primary" size="small" @click="openModal('cancel')">取消排课</Button>
      <Button v-if="item.status.indexOf(2) >= 0" type="primary" size="small" @click="openModal('edit')">调整课表</Button>
      <Button v-if="item.status.indexOf(3) >= 0" type="warning" size="small" @click="openModal('delete')">删除课表</Button>
      <Button v-if="item.status.indexOf(4) >= 0" type="primary" size="small" @click="openModal('class')">确认上课</Button>
    </div>

    <!--排课对话框-->
    <app-form-modal v-model="modal.edit" title="调整排课"  @on-ok="ok" :loading="formLoading" width=400>
      <Form :model="form" :rules="rules" :label-width="70" ref="form">
        <Form-item label="校区">
          <Input placeholder="请输入校区" v-model="form.school"></Input>
        </Form-item>
        <Form-item label="排课类型">
          <Select placeholder="请选择......">
            <Option value="1">一对一</Option>
            <Option value="2">小班</Option>
          </Select>
        </Form-item>
        <Form-item label="上课老师">
          <Select placeholder="请选择......">
            <Option value="1">一</Option>
            <Option value="2">小</Option>
          </Select>
        </Form-item>
        <Form-item label="上课日期">
          <Date-picker placeholder="年 / 月 / 日"></Date-picker>
        </Form-item>
        <Form-item label="上课时段">
          <Row>
            <Col span="11">
              <Time-picker type="time" placeholder="选择时间"></Time-picker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Time-picker type="time" placeholder="选择时间"></Time-picker>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="课时">
          <Input placeholder="请输入课时" v-model="form.hour"></Input>
        </Form-item>
      </Form>
    </app-form-modal>

  </div>
</template>

<script>
/**
 * 排课管理 - 学员排课 - 条目操作
 * @author yangjun
 * @version 2017-06-09
 */

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    // 表单数据
    form: {
      school: '',
      type: '',
      student: '',
      grade: '',
      subject: '',
      data: '',
      time: '',
      hour: '',
      teacher: '',
      status: '',
      duration: '',
    },

    rules: {
      student: [
        { required: true, message: '名称不能为空', trigger: 'blur' },
        { min: 2, message: '最少2个字符', trigger: 'blur' },
        { max: 16, message: '最多16字符', trigger: 'blur' },
      ],
    },

    formLoading: false,

    modal: {
      form: false,
      remove: false,
      affirm: false,
      cancel: false,
      edit: false,
      delete: false,
      class: false,
    },

    isCreate: false,

  }),

  methods: {
    openModal(type) {
      this.modal[type] = true
    },

    closeModal(type) {
      this.modal[type] = false
    },

    // 新增=>create 调整=>update
    ok() {
      if (this.isCreate) {
        this.create()
      } else {
        this.update()
      }
    },

    // 新增
    create() {
      this.formLoading = true
    },

    // 编辑
    update() {
      this.formLoading = true
    },

  },

  created() {
    // window.console.log(this.item)
  },

}
</script>

<style lang="less">
.arrange-operation {
  &__btns {
    button:not(:first-child) {
      margin-left: 0.8em;
    }
  }
}
</style>
