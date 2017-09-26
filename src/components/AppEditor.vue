<template>
  <div :id="id"></div>
</template>

<script>
window.CKEDITOR_BASEPATH = '/assets/1.0.0/lib/ckeditor/'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    width: {
      type: [Number, String],
      default: 'auto',
    },
    height: {
      type: Number,
      default: 250,
    },
  },

  data() {
    return {
      id: `editor-${Math.random().toString(32).slice(2)}`,
      editor: null,
    }
  },

  methods: {
    loadScript(src) {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.addEventListener('load', () => {
          resolve()
        })
        document.body.appendChild(script)
      })
    },

    init() {
      const CKEDITOR = window.CKEDITOR

      // 自定义工具栏
      CKEDITOR.config.toolbar = [
        {
          name: 'base',
          items: ['Undo', 'Redo', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'showborders', 'Superscript', 'base64image', 'SpecialChar', 'Table', 'Wiris'],
        },
      ]

      CKEDITOR.config.extraPlugins = 'wiris,base64pasteanddrag,base64image'

      // CKEDITOR.config.height = this.height
      // CKEDITOR.config.width = this.width
      // 上面两行代码是全局性设置，这里需要在初始化编辑器时单独把config传入，以便每个实例实现不同的尺寸
      const config = {
        width: `${this.width}px`,
        height: `${this.height}px`,
      }

      function isWysiwygareaAvailable() {
      // eslint-disable-next-line
      if (CKEDITOR.revision === ('%RE' + 'V%')) {
          return true
        }
        return !!CKEDITOR.plugins.get('wysiwygarea')
      }

      const wysiwygareaAvailable = isWysiwygareaAvailable()
      const editorElement = CKEDITOR.document.getById(this.id)

      if (wysiwygareaAvailable) {
        this.editor = CKEDITOR.replace(this.id, config)
      } else {
        editorElement.setAttribute('contenteditable', 'true')
        this.editor = CKEDITOR.inline(this.id, config)
      }

      // 设置编辑器的初始内容
      this.editor.setData(this.value)
      // 监听编辑器的内容变化，并派发input事件使得调用此组件的地方可以直接使用v-model绑定值
      this.editor.on('change', (event) => {
        this.$emit('input', event.editor.getData())
      })

      // 派发编辑器的实例本身，以应对更灵活的使用情况
      this.$emit('init', this.editor)

      // FMATH在第一次转Canvas操作时特别慢（可能是其内部需要预先处理某些事务）
      // 这里在实例化编辑器以后，先做了一次无用的转换来绕过这个问题，以便用户实际操作时能马上快速响应
      // window.mathmlToImage('<math><mn>2</mn></math>', () => {})
      // 以上代码应该转移到ckeditor plugins中的相关文件里
    },
  },

  /**
   * 初始化编辑器
   * 初始化时所需的依赖，在这里通过动态插入script标签来载入，以避免一进入应用就要请求编辑器相关的大量资源
   * 依赖仅需载入一次，载入依赖前，需先判断是否已载入过，如果已载入直接执行初始化代码
   * `window.com`是wiris编辑器挂载的一个全局变量，这里通过这个变量来判断是否已载入过依赖
   */
  mounted() {
    if (window.com) {
      this.init()
    } else {
      Promise.all([
        this.loadScript('/assets/1.0.0/lib/ckeditor/ckeditor.js'),
        this.loadScript('/assets/1.0.0/lib/wiris/editor.js'),
        this.loadScript('/assets/1.0.0/lib/fmath/fonts/fmathFormulaFonts.js'),
        this.loadScript('/assets/1.0.0/lib/fmath/fmathFormulaC.js'),
      ])
        .then(() => {
          // 指定wiris编辑器的资源请求地址（图标、字体等等）
          window.com.wiris.js.defaultBasePath = '/assets/1.0.0/lib/wiris/editor/resources'
        })
        .then(this.init)
    }
  },
}
</script>

<style lang="postcss">
.wiris-wrapper {
  display: none;
  position: fixed;
  top: 200px;
  left: 50%;
  margin-left: -300px;
  width: 600px;
  padding: 10px;
  border: 1px solid #ccc;
  background: #fff;
}

/* wiris在此应用里有一些怪异的行为，暂未查清，但可使用简单的CSS来绕过 */
.wrs_formulaDisplay {
  height: 150px !important;
}

.wrs_tickContainer {
  display: none;
}
</style>
