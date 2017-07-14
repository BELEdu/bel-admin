<template>
  <Cascader
    :data="mapdata" :placeholder="placeholder"
    :value="[]" @input="_changeValue"
   ></Cascader>
</template>

<script>
/**
 * 省市区三级联动组件
 * @author hjz
 * @version 2017-07-10
 */
import mapdata from '../assets/china.json'

export default {
  name: 'AppMapCascader',

  props: {
    value: {
      type: Array,
      require: true,
    },
    placeholder: {
      type: String,
      default: '请选择地区...',
    },
  },

  data() {
    return {
      mapdata,
      area: this.value.map(item => item.toString()),
    }
  },

  // computed: {
  //   area() {
  //     return this.value.map(item => item.toString())
  //   },
  // },

  methods: {
    _changeValue(nv) {
      const value = nv.map(item => parseInt(item, 10))
      this.$emit('input', value)
    },
    decodeArea(data) {
      return data.map(item => item.toString())
    },
  },
}
</script>
