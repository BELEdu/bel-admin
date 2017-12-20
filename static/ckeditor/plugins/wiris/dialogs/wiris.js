/* eslint-disable */
CKEDITOR.dialog.add('wiris', function (editor) {
  var wirisEditor,
    id = 'wiris-' + Math.random().toString(32).slice(2),
    selectedImg = null,
    wirisContent = null;

  /**
   * MathML to svg
   * @param MathMLString {String} 公式字符串
   * @param callback {Function} 回调函数
   */
  function mathMLToSvg(MathMLString, callback) {
    var mathml = document.createElement('div');
    mathml.innerHTML = MathMLString;
    var mathmlStyle = mathml.childNodes[0].getAttribute('style') || '';
    var wrapper = document.createElement('div');
    wrapper.innerHTML = MathMLString;
    const output = {
      svg: ''
    };
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, wrapper], function () {
      var mjOut = wrapper.getElementsByTagName('svg')[0];
      mjOut.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      mjOut.setAttribute('style', 'font-family:"Times New Roman";font-size:inherit;font-style:inherit;' + mathmlStyle);
      output.svg = mjOut.outerHTML;
      const image = new Image();
      image.src = 'data:image/svg+xml;charset=utf8,' + output.svg;
      image.setAttribute('data-mathml', MathMLString);
      image.setAttribute('style', 'vertical-align: middle;');
      image.onload = function () {
        callback(image)
      }
    })
  }

  return {
    title: '公式编辑器',
    contents: [{
      id: 'tab-basic',
      label: 'Basic Settings',
      elements: [{
        type: 'html',
        html: '<div id="' + id + '"></div>',
      }],
    }, ],

    // 初始化wiris公式编辑器
    onLoad: function () {
      wirisEditor = window.com.wiris.jsEditor.JsEditor.newInstance({
        language: 'zh',
        fontSize: '14px',
        fontFamily: 'Times New Roman',
      });
      wirisEditor.insertInto(document.getElementById(id));
      // 阻止公式文本框编辑回车冒泡事件
      document.getElementById(id)
        .addEventListener('keydown', function (e) {
          if (e.keyCode === 13) {
            e.stopPropagation()
          }
        })
    },

    onShow: function () {
      selectedImg = editor.getSelection().getSelectedElement();
      if (selectedImg) {
        wirisContent = selectedImg.getAttribute('data-mathml');
      }
      if (selectedImg && selectedImg.getName() === 'img' && wirisContent) {
        wirisEditor.setMathML(wirisContent);
      } else {
        selectedImg = null;
        wirisContent = null;
      }
    },

    // 点击确认后，从wiris编辑器中取得mathml代码并转换为svg，插入ckeditor编辑器中
    // 完成操作后重置wiris编辑器的编辑内容
    onOk: function () {
      var mathml = wirisEditor.getMathML();
      mathMLToSvg(mathml, function (img) {
        editor.insertHtml(img.outerHTML);
        selectedImg = null;
        wirisContent = null;
        wirisEditor.reset();
      })
    },

    // 点击取消，直接重置wiris编辑器的编辑内容
    onCancel: function () {
      selectedImg = null;
      wirisContent = null;
      wirisEditor.reset();
    }
  };
});
