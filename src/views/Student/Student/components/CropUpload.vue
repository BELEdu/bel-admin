<template>
  <div class="crop-upload">

    <!-- 提示tooltip -->
    <Tooltip placement="right">

      <!-- Label点击区域 -->
      <label>
        <!-- 头像展示 -->
        <div
          class="crop-upload__image"
          :style="{backgroundImage:`url(${imgUrl})`}"
        >
          <!-- 缺省图标 -->
          <Icon
            class="crop-upload__image__icon"
            v-if="imgUrl=== '' && !loading"
            type="person-add"
            size="70"
          />

          <!-- 上传loading -->
          <Spin size="large" fix v-if="loading"></Spin>

        </div>

        <!-- 隐藏的 file-input -->
        <input
          hidden
          type="file"
          :accept="accept"
          @change="getPreview"
        >
      </label>

      <!-- 提示信息 -->
      <div slot="content">
        <h3>点击上传用户头像</h3>
        <p>文件格式：{{acceptText}}</p>
        <p>大小限制：{{limitedSize}}M</p>
      </div>

    </Tooltip>
    <!-- 提示tooltip - END -->

    <!-- 裁剪弹窗 -->
    <Modal
      v-model="modal"
      title="头像裁剪"
      :loading="loading"
      @on-ok="upload"
      @on-cancel="modal=false"
    >
      <div
        v-if="preview && modal"
        class="crop-upload__preview"
      >
        <img
          id="image"
          :src="preview"
          @load="crop"
        />
      </div>
    </Modal>


  </div>
</div>

</template>

<script>
/**
  * 学员头像上传组件
  * @author zml
  * @version 2017-11-14
  * @param {String} imgUrl - 头像链接
  * @param {String} imgName - 头像名
  * @param {successCallback} on-success 上传成功回调函数
  */

import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

export default {
  name: 'crop-upload',

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
      // cropper的图片预览
      preview: null,
      cropDetail: null,

      // 用户选择文件时默认展示格式，写在input-file上
      accept: 'image/*',

      // 格式名称
      acceptText: 'jpg，jpeg，png',

      // 上传大小限制，单位（M）
      limitedSize: 2,

      // 裁剪弹窗控制
      modal: false,

      // 根据开发环境和线上环境，生成请求接口的左边部分
      apiHead: process.env.NODE_ENV === 'production' ?
        `https://${window.location.hostname.replace(/([^.]+)\./, '$1-api.')}`
        : 'https://oa-api.caihonggou.com',

      // 请求接口的右边部分
      api: 'student/upload',

      // 接口上传名
      postName: 'head_url',

      error: null,

      loading: false,

      // 上传成功提示信息
      successText: '头像上传成功！',
    }
  },

  computed: {
    // 请求头
    headers() {
      return {
        Authorization: `Bearer ${this.$store.state.token}`, // 用户token
      }
    },

    // 完整接口
    action() {
      return `${this.apiHead}/v1/${this.api}`
    },
  },

  methods: {

    // 获取用户上传缩略图
    getPreview({ target: { files } }) {
      /**
       * this.file是用户选择的文件
       * type属性代表文件类型，例如 image/jpeg （大类型/小类型）
       * size属性代表文件大小，单位 k（字节）
       * 这两个条件要在进入裁剪步骤前判断
       */
      this.file = files[0]
      const isMatch = /image\/(png|jpg|jpeg)/.test(this.file.type)
      const isLimited = this.file.size < this.limitedSize * 1024 * 1024

      // 裁剪前的校验
      if (!isMatch) {
        this.handleFormatError(this.file)
      } else if (!isLimited) {
        this.handleMaxSize(this.file)
      } else {
        // 这里拿到用户选择的文件的本地缩略图，并将它转换成base64，在回调中打开裁剪弹窗
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          this.preview = reader.result
          this.modal = true
        })
        reader.readAsDataURL(this.file)
      }
    },

    // 配置crop参数
    crop({ target }) {
      this.cropper = new Cropper(target, {

        // 将拖拽区域限制为不超过画布的大小
        viewMode: 1,

        // 拖拽模式
        dragMode: 'move',

        // 设置截图拖拽区域比例
        aspectRatio: 1 / 1,

        // 这个回调可能用不到
        crop(e) {
          this.cropDetail = e.detail
        },
      })
    },

    // 上传裁剪后的图片
    upload() {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // 新建formData
        const formData = new FormData()

        // 配置图片裁剪后丢失的：类型，时间，名称
        const file = new File([blob], this.file.name, {
          type: this.file.type,
          lastModified: new Date(),
        })

        // 将图片加入到上传阵列中
        formData.append(this.postName, file)

        // 图片上传loading
        this.loading = true

        fetch(this.action, {
          method: 'POST',
          headers: this.headers,
          body: formData,
        })
          // eslint-disable-next-line
          .then((res) => {
            // 处理接口返回信息
            if (res.ok) {
              return res.json()
            }
            return res.json()
              .then((e) => {
                throw e
              })
          })
          .then(({ url, name }) => {
            this.$Message.success(this.successText)
            this.$emit('on-success', url, name)
            this.modal = false
          })
          .catch(({ message }) => {
            this.handleError(message)
          })
          .then(() => {
            this.loading = false
          })
      }, this.file.type)
    },

    // 校验文件格式提示框
    handleFormatError(currentFile) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件 ${currentFile.name} 格式不正确，请上传 ${this.acceptText} 格式的图片。`,
      })
    },

    // 校验文件大小提示框
    handleMaxSize(currentFile) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: `文件 ${currentFile.name} 太大，不能超过 ${this.limitedSize}M。`,
      })
    },

    // 上传错误
    handleError(message) {
      this.$Notice.warning({
        title: '上传错误',
        desc: `${message}`,
      })
    },

  },
}
</script>

<style lang="less">
@import '~vars';

@image-width: 120px;

.crop-upload {

  &__image {
    position: relative;
    text-align: center;
    width: @image-width;
    height: @image-width;
    border-radius: 4px;
    border:1px solid @border-color-base;
    cursor: pointer;
    background-color : @disabled-color;
    background-repeat:no-repeat;
    background-position:center;
    background-size: cover;

    &__icon{
      line-height: @image-width;
      color: #fff;
    }
  }

  &__preview {
    height: 300px;
    img {
      max-width: 100%;
    }
  }

}


</style>
