<template>
  <div class="zip-upload">

    <!-- 上传控件 -->
    <Upload
      ref="upload"
      :action="action"
      :headers="headers"
      :name="name"
      :multiple="multiple"
      type="drag"
      :show-upload-list="true"
      :format="format"
      :max-size="maxSize"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
    >
      <div class="zip-upload__btn">
        <!-- 图标 -->
        <Icon
          class="color-primary"
          type="archive"
          size="40"
        ></Icon>
        <!-- 文字说明 -->
        <div class="zip-upload__btn__text">
          <p>
            <span class="color-primary">点击</span>
            或将PPT生成的压缩包
            <span class="color-primary">拖拽</span>
            到这里上传，请注意文件结构！
          </p>
          <p>
            文件格式：<span class="color-error">{{formatText}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            大小限制：<span class="color-error">{{maxSizeText}}</span>
          </p>
        </div>
      </div>
    </Upload>

  </div>
</template>

<script>
export default {
  name: 'paper-upload',

  data() {
    return {
      // 根据开发环境和线上环境
      // 生成请求接口的左边部分
      apiHead: process.env.NODE_ENV === 'production' ?
        `https://${window.location.hostname.replace(/([^.]+)\./, '$1-api.')}`
        : 'https://oa-api.caihonggou.com',

      // 请求接口的右边部分
      api: '/upload/ppt',

      // 文件大小限制，单位 kb
      maxSize: 204800,

      // 支持的文件类型
      format: ['zip'],

      // 是否支持文件批量上传
      multiple: false,

      // 上传的文件字段名
      name: 'ppt',

      // 上传成功提示信息
      successText: 'PPT上传成功！',
    }
  },

  computed: {
    // 拼接成真正的完整接口地址
    action() {
      return `${this.apiHead}/v1${this.api}`
    },

    // 请求头
    headers() {
      return {
        Authorization: `Bearer ${this.$store.state.token}`,
      }
    },

    // 上传文件限制大小转换为M
    maxSizeText() {
      return `${(this.maxSize / 1024).toFixed(0)}M`
    },

    // 将文件类型数组转换为文本
    formatText() {
      return this.format.join('，')
    },
  },

  methods: {
    // 上传成功回调
    uploadSuccess(response) {
      this.$Message.success(this.successText)
      this.$emit('on-success', response)
    },

    // 上传失败回调
    uploadError() {
      this.$Notice.warning({
        title: '上传失败',
        desc: '服务器上传发生错误或文件错误，请重新上传',
      })
    },

    // 校验文件格式
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件 ${file.name} 格式不正确，请上传 ${this.formatText} 格式的文件。`,
      })
    },

    // 校验文件大小
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: `文件 ${file.name} 太大，不能超过${this.maxSizeText}。`,
      })
    },
  },

}
</script>

<style lang="less">
@import "~vars";

.zip-upload{

  &__btn {
    padding: 20px 0;

    &__text {
      margin-top: 10px;
    }

    p {
      margin: 0;
    }
  }
}
</style>
