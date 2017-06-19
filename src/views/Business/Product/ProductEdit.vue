<template>
  <main class="app-form-entire">
    <app-editor-title></app-editor-title>
    <Form :label-width="110">
      <Form-item label="产品名称" required>
        <Input placeholder="请输入流程名称" v-model="fdata.display_name"></Input>
      </Form-item>
      <Form-item label="产品类型" required v-if="product_type.length">
        <Select placeholder="请选择......" v-model="fdata.product_type_id">
          <Option v-for="item in product_type" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item label="产品子类型" required >
        <Select placeholder="请选择......" v-model="fdata.product_subtype_id">
          <Option v-for="item in sub_type" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
        </Select>
      </Form-item>
      <Form-item label="课程时长" required>
        <Input placeholder="请输入课程时长" v-model="fdata.course_duration"></Input>
      </Form-item>
      <Form-item label="产品单价" required>
        <Input placeholder="请输入产品单价" v-model="fdata.price"></Input>
      </Form-item>
      <Form-item label="销售状态" required>
        <Radio-group v-model="fdata.sale_status">
          <Radio v-for="item in sale_status" :label="item.value" :key="item.display_name">
            <span>{{item.display_name}}</span>
          </Radio>
        </Radio-group>
      </Form-item label="销售校区">
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
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { Http } from '@/utils'
import { editInit, encode } from './modules/config'

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
    // "取消"按钮行为的路由对象
    backRoute: null,
    // 最终提交给后端的数据
    fdata: editInit(),
    // 提交按钮状态控制
    loading: false,
    // 字典数据
    product_type: [],
    product_areas: [],
    sale_status: [],
    // 表单验证
    // 其他
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
    sub_type() {
      const id = this.fdata.product_type_id
      const arr = this.product_type
      if (id && arr.length) {
        const product = arr.find(item => item.value === id)
        if (product) return product.children
      }
      return []
    },
  },

  methods: {
    // 提交编辑好的表单数据
    submit() {
      // 开启按钮loadding
      this.loading = true
      // 根据接口文档转化数据
      const fdata = encode(this.fdata)
      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.UPDATE, { id, fdata })
          .then(() => { this.loading = false; this.cancel() })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.cancel() })
      }
    },
    // Form click提交表单事件handler @click.stop="submit"
    handleSubmit(name) {
      // 其他处理...

      // 进行表单提交
      this.$refs[name].validate((valid) => { if (valid) this.submit() })
    },
    cancel() {
      this.$store.commit(BUSINESS.EDIT.INIT, null)
      if (this.backRoute === null || this.backRoute.matched.length === 0) {
        // 根据上次路由提交
        this.$router.push('/business/hotline')
      } else {
        this.$router.push(this.backRoute.fullPath)
      }
    },
  },

  created() {
    Http.get('/dict?keys=product_type,product_areas,sale_status')
      .then((res) => {
        this.product_type = res.product_type
        this.product_areas = res.product_areas
        this.sale_status = res.sale_status
      })

    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => { this.fdata = res; this.$store.commit(GLOBAL.LOADING.HIDE) })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

  beforeRouteEnter(to, from, next) {
    // eslint-disable-next-line
    next((vm) => { vm.backRoute = from })
  },
}
</script>

<style>

</style>
