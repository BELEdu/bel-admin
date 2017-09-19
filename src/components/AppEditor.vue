<template>
  <div :class="className">
    <div id="editor"></div>
  </div>
</template>

<script>
import 'ckeditor'

export default {
  props: {
    className: {
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
      // 指定wiris编辑器的资源请求地址（图标、字体等等）
      window.com.wiris.js.defaultBasePath = '/assets/1.0.0/lib/editor/editor/resources'

      const CKEDITOR = window.CKEDITOR

      CKEDITOR.config.height = this.height
      CKEDITOR.config.width = this.width

      function isWysiwygareaAvailable() {
      // eslint-disable-next-line
      if (CKEDITOR.revision === ('%RE' + 'V%')) {
          return true
        }
        return !!CKEDITOR.plugins.get('wysiwygarea')
      }

      const wysiwygareaAvailable = isWysiwygareaAvailable()
      const isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode')


      const editorElement = CKEDITOR.document.getById('editor')
      if (isBBCodeBuiltIn) {
        editorElement.setHtml(
          'Hello world!\n\n' +
        'I\'m an instance of [url=http://ckeditor.com]CKEditor[/url].',
        )
      }

      if (wysiwygareaAvailable) {
        CKEDITOR.replace('editor')
      } else {
        editorElement.setAttribute('contenteditable', 'true')
        CKEDITOR.inline('editor')
      }
    },
  },

  mounted() {
    // 动态插入script标签，避免一进入应用就要请求编辑器相关的大量资源
    Promise.all([
      this.loadScript('/assets/1.0.0/lib/editor/editor.js'),
      this.loadScript('/assets/1.0.0/lib/fmath/fonts/fmathFormulaFonts.js'),
      this.loadScript('/assets/1.0.0/lib/fmath/fmathFormulaC.js'),
      this.loadScript('/assets/1.0.0/lib/fmath/mathml.js'),
    ])
      .then(this.init)
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
