<template>
  <div>
    <label>
      <input
        type="file"
        accept="image/*"
        @change="getPreview"
      >
    </label>

    <!-- cropper -->
    <div v-if="preview">
      <img
        id="image"
        :src="preview"
        @load="crop"
      >
      <Button @click="upload">确定</Button>
    </div>
  </div>
</div>

</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

export default {
  name: 'crop-upload',

  data() {
    return {
      preview: null,
      limitedSize: 5 * 1024 * 1024,
      cropDetail: null,
      api: process.env.NODE_ENV === 'production' ?
        `https://${window.location.hostname.replace(/([^.]+)\./, '$1-api.')}`
        : 'https://oa-api.caihonggou.com',
      error: null,
      loading: false,
    }
  },

  methods: {
    getPreview({ target: { files } }) {
      // this.file是用户选择的文件，这个file对象上有个type属性可以用来判断用户选择的文件的类型
      this.file = files[0]

      // 可以直接在input元素上指定accept属性
      // if (/image\/(png|jpg|jpeg)/.test(file.type)) {
      //
      // }

      // file.size


      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.preview = reader.result
        // 这里拿到用户选择的文件的本地缩略图
        // 弹框
      })
      reader.readAsDataURL(this.file)
    },

    crop({ target }) {
      this.cropper = new Cropper(target, {
        aspectRatio: 1 / 1,
        // 这个回调可能用不到
        crop(e) {
          this.cropDetail = e.detail
        },
      })
    },

    upload() {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData()
        // const file = new File([blob], this.file.name, {
        //   type: this.file.type,
        //   lastModified: new Date(),
        // })

        formData.append('head_url', blob)

        // 这里写loading
        this.loading = true

        fetch(`${this.api}/v1/student/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
          body: formData,
        })
          .then()
          .catch()
          .then(() => {
            this.loading = false
          })
      }, this.file.type)
    },
  },
}
</script>

<style>
img {
  max-width: 100%; /* This rule is very important, please do not ignore this! */
}
</style>
