<template>
  <Cascader
    :data="mapdata" :placeholder="placeholder"
    :value="area" @on-change="changeValue"
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
      // required: true,
    },
    placeholder: {
      type: String,
      default: '请选择地区...',
    },
  },

  data() {
    return {
      mapdata,
    }
  },

  computed: {
    area() {
      let arr = []
      if (this.value && this.value.length) {
        arr = this.value.map(item => item.toString())
      }
      return arr
    },
  },

  methods: {
    changeValue(nv) {
      const value = nv.map(item => parseInt(item, 10))
      this.$emit('input', value)
    },
    decodeArea(data) {
      return data.map(item => item.toString())
    },
  },
}
</script>
