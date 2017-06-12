<template>
  <main class="app-form-entire">
    <app-editor-title></app-editor-title>
    <Form label-width="100">
      <Form-item label="产品名称" required>
        <Input placeholder="请输入流程名称"></Input>
      </Form-item>
      <Form-item label="产品类型" required>
        <Select placeholder="请选择......">
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
          <Option value="4">丁</Option>
        </Select>
      </Form-item>
      <Form-item label="课程时长" required>
        <Input placeholder="请输入课程时长"></Input>
      </Form-item>
      <Form-item label="销售状态" required>
        <Radio-group v-model="sale">
          <Radio label="true">
            <span>在售</span>
          </Radio>
          <Radio label="false">
            <span>停售</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Table :columns="tcol" :data="data" border></Table>
      <Form-item>
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 产品管理 - 产品编辑
 * @author hjz
 * @version 2017-06-07
 */
import { GLOBAL } from '@/store/mutationTypes'

const cbdata = new Array(16).fill({ title: '厦门莲坂' }, 1, 4).fill({ title: '厦门集美区集美学区' }, 5, 11).fill({ title: '海沧校区' }, 12)

const createCheckbox = (data, h) =>
  h(
    'Form-item',
    { style: 'display: inline-block; margin: 3px 12px;' },
    [h('Checkbox'), h('span', data.title)],
  )

const createCheckboxes = list => h =>
  h(
    'Form',
    { style: 'text-align: left;' },
    list.map(item => createCheckbox(item, h)),
  )

export default {

  data: () => ({
    sale: undefined,
    tcol: [
      { title: ' ', key: '1', align: 'center', width: 112, render: createCheckboxes([{ title: '全部' }]) },
      { title: '选择校区', key: '2', align: 'center', render: createCheckboxes(cbdata) },
    ],
    data: [
      { 1: 'a', 2: 'b' },
    ],
  }),

  computed: {
    pagetitle() {
      const title = this.$route.name === 'BussinessProductCreator'
        ? '添加产品' : '编辑产品'
      return title
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
