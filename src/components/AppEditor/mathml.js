/**
 * @param {String} mathml - 一段符合mathml规范的HTML字符串
 */
function mathmlToImage(mathml, fn) {
  window.FMATH.ApplicationConfiguration.setFolderUrlForFonts('fonts')
  window.FMATH.ApplicationConfiguration.setFolderUrlForGlyphs('glyphs')

  const wrapper = document.createElement('div')
  wrapper.innerHTML = mathml
  const mathEl = wrapper.children[0]

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1

  mathEl.parentNode.insertBefore(canvas, mathEl)
  mathEl.parentNode.removeChild(mathEl)

  const formulas = new window.FMATH.MathMLFormula()
  formulas.drawImage(canvas, mathml)
  formulas.scaleFormula(1)

  /* eslint-disable no-underscore-dangle */
  const _mathml = formulas.getMathMLString('ENTITIES', true)
  const latex = formulas.convertMathMLToLatex(_mathml)

  const timer = setInterval(() => {
    if (canvas.width > 1) {
      clearInterval(timer)
      const src = canvas.toDataURL()
      const html = `<img src="${src}" data-latex="${latex}">`
      fn(html)
    }
  }, 50)
}

window.mathmlToImage = mathmlToImage
