<template>
  <div class="avatar-upload">

    <!-- 上传组件 -->
    <Upload
      ref="upload"
      :action="action"
      :headers="headers"
      :name="name"
      :max-size="maxSize"
      :format="format"
      :show-upload-list="showUploadList"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-preview="onPreview"
    >
      <!-- 提示tooltip -->
      <Tooltip placement="right">
        <!-- 头像展示 -->
        <div
          class="avatar-upload__image"
          :style="{backgroundImage:`url(${imgUrl})`}"
        >
          <Icon
            v-if="imgUrl=== ''"
            type="person-add"
            size="70"
          />

          <!-- 进度条 -->
          <div class="avatar-upload__progress" v-if="uploadCurrentItem">
            <Progress
              v-if="uploadCurrentItem.showProgress"
              :percent="uploadCurrentItem.percentage"
              hide-info
            ></Progress>
          </div>
        </div>

        <!-- 提示信息 -->
        <div slot="content">
          <h3>点击上传用户头像</h3>
          <p>文件格式：{{formatText}}</p>
          <p>大小限制：{{maxSizeText}}</p>
        </div>
      </Tooltip>

    </Upload>

  </div>
</template>

<script>
/**
  * 学员头像上传组件
  * @author zml
  * @version 2017-11-07
  * @param {String} imgUrl - 头像链接
  * @param {String} imgName - 头像名
  * @param {successCallback} on-success 上传成功回调函数
  */

export default {
  name: 'app-avarar-upload',

  props: {
    imgUrl: {
      type: String,
      required: true,
    },
    imgName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // 根据开发环境和线上环境
      // 生成请求接口的左边部分
      apiHead: process.env.NODE_ENV === 'production' ?
        `https://${window.location.hostname.replace(/([^.]+)\./, '$1-api.')}`
        : 'https://oa-api.caihonggou.com',

      // 请求接口的右边部分
      api: 'student/upload',

      // 文件大小限制，单位 kb
      maxSize: 2048,

      // 支持的文件类型
      format: ['jpg', 'jpeg', 'png'],

      // 上传的文件字段名
      name: 'head_url',

      // 上传成功提示信息
      successText: '头像上传成功！',

      // 是否展示上传列表
      showUploadList: false,

      // 上传列表
      uploadList: null,
    }
  },

  computed: {
    // 拼接成真正的完整接口地址
    action() {
      return `${this.apiHead}/v1/${this.api}`
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

    // 当前上传的图片项
    uploadCurrentItem() {
      const list = this.uploadList
      if (list) {
        return list[list.length - 1]
      }
      return null
    },
  },

  mounted() {
    this.uploadList = this.$refs.upload.fileList
  },

  methods: {
    // 图片上传成功回调
    uploadSuccess({ url, name }) {
      this.$Message.success(this.successText)
      this.$emit('on-success', url, name)
      // this.imgUrl = url
      // this.imgName = name
    },

    // 图片上传失败回调
    uploadError() {
      this.$Notice.warning({
        title: '上传失败',
        desc: '服务器上传发生错误',
      })
    },

    // 校验文件格式
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件 ${file.name} 格式不正确，请上传 ${this.formatText} 格式的图片。`,
      })
    },

    // 校验文件大小
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: `文件 ${file.name} 太大，不能超过${this.maxSizeText}。`,
      })
    },

    // 点击预览
    onPreview(file) {
      window.open(`${file.response.url}`)
    },
  },

}
</script>

<style lang="less">
@import '~vars';

@image-width: 120px;

.avatar-upload {

  &__image {
    position: relative;
    text-align: center;
    width: @image-width;
    height: @image-width;
    line-height: @image-width;
    border-radius: 4px;
    border:1px solid @border-color-base;
    cursor: pointer;
    background-color : @disabled-color;
    background-repeat:no-repeat;
    background-position:center;
    background-size: cover;

    .ivu-icon{
      line-height: @image-width;
      color: #fff;
    }
  }

  &__progress {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

}
</style>
