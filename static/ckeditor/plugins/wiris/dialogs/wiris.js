/* eslint-disable */
CKEDITOR.dialog.add('wiris', function (editor) {
    var wirisEditor;

    /**
     * 将mathml代码转换为base64编码的图片
     * @param {string} mathml
     * @param {function} fn
     */
    function mathmlToBase64(mathml, fn) {
      FMATH.ApplicationConfiguration.setFolderUrlForFonts('/assets/1.0.0/lib/fmath/fonts');
      FMATH.ApplicationConfiguration.setFolderUrlForGlyphs('/assets/1.0.0/lib/fmath/glyphs');

      var wrapper = document.createElement('div');
      wrapper.innerHTML = mathml;
      var mathEl = wrapper.children[0];

      var canvas = document.createElement('canvas');
      canvas.width  = 1;
      canvas.height = 1;

      mathEl.parentNode.insertBefore(canvas, mathEl);
      mathEl.parentNode.removeChild(mathEl);

      var formulas = new FMATH.MathMLFormula();
      // 修改默认大小
      formulas.style.setMathsize(14)
      formulas.drawImage(canvas, mathml);
      formulas.scaleFormula(1)

      var _mathml  = formulas.getMathMLString("ENTITIES", true);
      var latex = formulas.convertMathMLToLatex(_mathml)

      var timer = setInterval(() => {
        if (canvas.width > 1) {
          clearInterval(timer);
          var src = canvas.toDataURL();
          var html = '<img src="' + src  + '" data-latex="' + latex + '">'
          fn(html);
        }
      }, 50)
    }

    var id = 'wiris-' + Math.random().toString(32).slice(2);

    return {
      title: '公式编辑器',
      contents: [
        {
          id: 'tab-basic',
          label: 'Basic Settings',
          elements: [
            {
              type: 'html',
              html: '<div id="' + id + '"></div>'
            },
          ]
        },
      ],

      // 初始化wiris公式编辑器
      onLoad: function() {
        wirisEditor = window.com.wiris.jsEditor.JsEditor.newInstance({
            language: 'zh',
            fontSize: '14px',
            fontFamily: 'Times New Roman',
        });
        wirisEditor.insertInto(document.getElementById(id));
      },

      // 点击确认后，从wiris编辑器中取得mathml代码并转换为base64编码图片，插入ckeditor编辑器中
      // 完成操作后重置wiris编辑器的编辑内容
      onOk: function() {
        var mathml = wirisEditor.getMathML();
        mathmlToBase64(mathml, function (html) {
          editor.insertHtml(html);
          wirisEditor.reset();
        })
      },

      // 点击取消，直接重置wiris编辑器的编辑内容
      onCancel: function() {
        wirisEditor.reset();
      }
    };
  });
