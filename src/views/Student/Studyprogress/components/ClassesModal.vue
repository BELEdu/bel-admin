<template>
  <Modal
   :value="value"
   @input="value => $emit('input', value)"
   width="900"
   class="calsses-modal"
  >
    <h3>
      <b>班级：</b>{{displayName}}
      <b>学员个数：</b>{{studentTotal}}
      <b>班主任：</b>{{classesDirector}}
      <b>当前年级：</b>{{gradeName}}
    </h3>

    <Table class="app-table" size="small" :columns="columns" :data="classesData" border></Table>
  </Modal>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 班级进度列表 - 班级详情弹窗组件
 * @author zml
 * @version 2017-07-01
 */

export default {
  name: 'app-student-studyprogress-classes-modal',

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    classesData: {
      type: Array,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    studentTotal: {
      type: Number,
      required: true,
    },
    gradeName: {
      type: String,
      required: true,
    },
    classesDirector: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      columns: [
        {
          title: '学员姓名',
          key: 'display_name',
          align: 'center',
          render: (h, params) => {
            const { display_name, number } = params.row
            return h('Tooltip', {
              props: {
                content: number,
                placement: 'right',
              },
            }, display_name)
          },
        },
        { title: '当前年级', key: 2, align: 'center' },
        { title: '归属学管师', key: 3, align: 'center' },
        { title: '签约课时', key: 4, align: 'center' },
        { title: '剩余课时', key: 5, align: 'center' },
        {
          title: '课时',
          key: 'class',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { class_now, class_total } = params.row
            const text = `总课时：${class_total}`
             // eslint-disable-next-line
            const percent = class_total === 0 ? 0 : Math.round(class_now / class_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
        {
          title: '学习知识点进度',
          key: 'point',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { point_now, point_total } = params.row
            const text = `总知识点：${point_total}个`
             // eslint-disable-next-line
            const percent = point_total === 0 ? 0 : Math.round(point_now / point_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
      ],

    }
  },

}
</script>

<style lang="less">
  .calsses-modal{
    h3 {
      margin-top: 16px;
      font-weight: normal;
      margin-bottom: 30px;

      &>b {
        margin-left:20px;

        &:first-child{
          margin-left:0;
        }
      }
    }
  }
</style>
