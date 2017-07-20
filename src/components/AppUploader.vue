<template>
  <Upload
    :action="`https://oa-api.caihonggou.com/v1${action}`"
    :headers="headers"
    :name="name"
    type="select"
    :on-success="onSuccess"
    :on-error="onError"
    :max-size="maxSize"
    :default-file-list="files"
    :on-preview="onPreview"
    :on-remove="onRemove"
  >
    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
  </Upload>
</template>

<script>
/**
 * 公共图片上传组件
 * @author luminghuai || zhoumenglin
 * @param {String} action - 上传接口
 * @param {String} name - 图片字段名
 */

export default {
  props: {
    action: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    files: {
      type: Array,
      required: true,
    },
    maxSize: {
      type: Number,
      default: null, // ?
    },
  },

  computed: {
    headers() {
      return {
        Authorization: `Bearer ${this.$store.state.token}`,
      }
    },
  },

  methods: {
    onSuccess(...args) {
      this.$emit('on-success', ...args)
    },

    onError(...args) {
      this.$emit('on-error', ...args)
    },

    onPreview(file) {
      // 这里需要了解open方法，写得更细致一些,临时链接，后面需要统一
      window.open(`https://oa-statics.caihonggou.com${file.url}`)
    },

    onRemove(...args) {
      this.$emit('on-remove', ...args)
    },
  },
}
</script>

