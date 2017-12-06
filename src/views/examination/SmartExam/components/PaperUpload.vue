<template>
  <div class="smartexam__upload">

    <!-- 图片展示 -->
    <div :key="dataList.length">
      <div
        v-for="(image,index) in dataList"
        :key="image.url"
        class="smartexam__upload__item"
      >
        <!-- 遮罩层 -->
        <div class="smartexam__upload__item__mask"></div>

        <!-- 按钮组 -->
        <div class="smartexam__upload__item__btns">
          <ButtonGroup>
            <!-- 查看原图 -->
            <Button
              type="primary"
              icon="image"
              @click="imgPreview(image.image_url)"
            ></Button>

            <!-- 上移 -->
            <Button
              type="primary"
              icon="chevron-up"
              v-if="index !== 0"
              @click="imgSort(-1,index)"
            ></Button>

            <!-- 下移 -->
            <Button
              type="primary"
              icon="chevron-down"
              v-if="index !== dataList.length-1"
              @click="imgSort(1,index)"
            ></Button>

            <!-- 删除 -->
            <Button
              type="primary"
              icon="close-round"
              @click="imgRemove(index)"
            ></Button>
          </ButtonGroup>
        </div>

        <!-- 图片 -->
        <img
          :key="image.image_url"
          :src="image.image_url"
          :alt="image.image_name"
        >

      </div>
    </div>

    <!-- 上传控件 -->
    <Upload
      ref="upload"
      :action="action"
      :headers="headers"
      :name="name"
      multiple
      type="drag"
      :show-upload-list="true"
      :format="format"
      :max-size="maxSize"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-preview="onPreview"
    >
      <!-- 上传区域 -->
      <div class="smartexam__upload__btn">
        <!-- 图标 -->
        <Icon
          class="color-primary"
          type="images"
          size="52"
        ></Icon>
        <!-- 文字说明 -->
        <p class="smartexam__upload__btn__text">
          <span class="color-primary">点击</span>
          或将照片
          <span class="color-primary">拖拽</span>
          到这里上传学员答卷情况
        </p>
        <p>
          文件格式：<span class="color-error">{{formatText}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          大小限制：<span class="color-error">{{maxSizeText}}</span>
        </p>
        <!-- 底部锚点 -->
        <div ref="listDown"></div>
      </div>
    </Upload>

  </div>
</template>

<script>
export default {

  props: {
    dataList: {
      type: Array,
      default: () => [],
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
      api: '/test/upload',

      // 文件大小限制，单位 kb
      maxSize: 5120,

      // 支持的文件类型
      format: ['jpg', 'jpeg', 'png'],

      // 上传的文件字段名
      name: 'paper',

      // 上传成功提示信息
      successText: '图片上传成功！',
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

  // mounted() {
  //   this.uploadList = this.$refs.upload.fileList
  // },

  methods: {
    // 图片上传成功回调
    uploadSuccess(response) {
      this.$Message.success(this.successText)
      this.$emit('on-success', response)
      this.scrollToDown()
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
        desc: `文件 ${file.name} 太大，不能超过${this.sizeName}M。`,
      })
    },

    // 点击预览
    onPreview(file) {
      window.open(`${file.response.url}`)
    },

    // 滚动到底部
    scrollToDown() {
      this.$refs.listDown.scrollIntoView()
    },

    // 图片预览
    imgPreview(imgUrl) {
      window.open(`${imgUrl}`)
    },

    // 图片排序
    imgSort(traget, index) {
      const list = this.dataList
      const node = list.splice(index, 1, list[index + traget])[0]
      list.splice(index + traget, 1, node)
    },

    // 删除图片
    imgRemove(index) {
      this.dataList.splice(index, 1)
    },
  },

}
</script>

<style lang="less">
@import "~vars";

.smartexam__upload{
  &__btn {
    padding: 40px 0;

    &__text {
      margin-top: 15px;
    }
  }

  &__item {
    position: relative;
    border: 1px solid  #fff;
    line-height: 1;
    cursor: pointer;
    margin-bottom: 10px;

    &:hover {
      border: 1px solid  @primary-color;

      .smartexam__upload__item__mask,
      .smartexam__upload__item__btns {
        display: block;
      }
    }

    img {
      width: 100%;
      line-height: 1;
    }

    &__mask {
      position: absolute;
      display: none;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.15);
    }

    &__btns{
      position: absolute;
      display: none;
      top: 5px;
      right: 5px;
    }
  }
}
</style>
