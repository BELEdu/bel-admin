<template>
  <Cascader
    :data="mapData" :placeholder="placeholder"
    :value="area" @on-change="changeValue"
    :change-on-select="changeOnSelect"
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
    changeOnSelect: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 3,
    },
  },

  data() {
    return {
      mapData: [],
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

  watch: {
    level() {
      this.setMapData()
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

    // 过滤层级
    filterData(child, level = 1, data = []) {
      // eslint-disable-next-line
      let pushData = data
      child.forEach(({ children = [], ...item }, key) => {
        if (level <= this.level) {
          let currentData = {}
          if (level === 1) {
            pushData.push({ children: [], ...item })
            currentData = pushData[key]
          } else {
            pushData.children.push({ children: [], ...item })
            currentData = pushData.children[key]
          }
          if (children.length) {
            this.filterData(children, level + 1, currentData)
          }
        }
      })
      this.mapData = [...pushData]
    },

    // 设置地区数据
    setMapData() {
      if (this.level === 3) {
        this.mapData = [...mapdata]
      } else {
        this.filterData(mapdata)
      }
    },
  },

  mounted() {
    this.setMapData()
  },
}
</script>
