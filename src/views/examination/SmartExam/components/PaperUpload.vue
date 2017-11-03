<template>
  <div class="smartexam__upload">

    <!-- 图片展示 -->
    <ul :key="dataList.length">
      <li
        v-for="(image,index) in dataList"
        :key="image.url"
        class="smartexam__upload__item"
      >
        <!-- 遮罩层 -->
        <div class="smartexam__upload__item__mask"></div>
        <!-- 按钮组 -->
        <div class="smartexam__upload__item__btns">
          <ButtonGroup>
            <Button
              type="primary"
              icon="image"
              @click="imgPreview(image.url)"
            ></Button>
            <Button
              type="primary"
              icon="chevron-up"
              v-if="index !== 0"
              @click="imgSort(-1,index)"
            ></Button>
            <Button
              type="primary"
              icon="chevron-down"
              v-if="index !== dataList.length-1"
              @click="imgSort(1,index)"
            ></Button>
            <Button
              type="primary"
              icon="close-round"
              @click="imgRemove(index)"
            ></Button>
          </ButtonGroup>
        </div>
        <!-- 图片 -->
        <img
          :key="image.url"
          :src="`https://oa-statics.caihonggou.com/${image.url}`"
          :alt="image.name"
        >
      </li>
    </ul>

    <!-- 上传控件 -->
    <Upload
      :action="api"
      :headers="headers"
      :name="name"
      multiple
      type="drag"
      :show-upload-list="true"
      :default-file-list="fileList"
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
        <!-- 底部标记 -->
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
      // 上传接口
      api: 'https://oa-api.caihonggou.com/v1/student/upload',
      // 文件大小限制，单位 kb
      maxSize: 4096,
      // 支持的文件类型
      format: ['jpg', 'jpeg', 'png'],
      // 上传的文件字段名
      name: 'head_url',
      // 已上传文件的列表
      fileList: [],
    }
  },

  computed: {
    // 请求头
    headers() {
      return {
        Authorization: `Bearer ${this.$store.state.token}`,
      }
    },
  },

  methods: {
    // 图片上传成功回调
    uploadSuccess(res) {
      this.dataList.push(res)
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
      const formatName = this.format.join('，')
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件 ${file.name} 格式不正确，请上传 ${formatName} 格式的图片。`,
      })
    },

    // 校验文件大小
    handleMaxSize(file) {
      const size = (this.maxSize / 1024).toFixed(0)
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: `文件 ${file.name} 太大，不能超过${size}M。`,
      })
    },

    // 点击预览
    onPreview(file) {
      // 这里需要了解open方法，写得更细致一些,临时链接，后面需要统一
      window.open(`https://oa-statics.caihonggou.com/${file.response.url}`)
    },

    // 滚动到底部
    scrollToDown() {
      this.$refs.listDown.scrollIntoView()
    },

    // 图片预览
    imgPreview(url) {
      window.open(`https://oa-statics.caihonggou.com/${url}`)
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
    padding: 50px 0;

    &__text {
      margin-top: 15px;
    }
  }

  &__item {
    position: relative;
    border: 2px solid  #fff;
    cursor: pointer;

    &:hover {
      border: 2px solid  @primary-color;

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
      background: rgba(0,0,0,.1);
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
