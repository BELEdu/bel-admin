/* eslint-disable */
CKEDITOR.plugins.add('base64', {
  init,
})

function init(editor) {
  if (editor.addFeature) {
    editor.addFeature({
      allowedContent: 'img[alt,id,!src]{width,height};',
    })
  }

  editor.on('paste', onPaste, null, { editor })
  editor.on('contentDom', () => {
    const editorDocument = editor.editable ? editor.editable() : editor.document
    editorDocument.on('paste', onImagePaste, null, { editor })
    editorDocument.on('drop', onDrop, null, { editor })
  })
}

function onDrop(e) {
  const event = e.data.$
  const editor = e.listenerData && e.listenerData.editor

  event.stopPropagation()
  event.preventDefault()

  const items = event.dataTransfer.items
  const file = event.dataTransfer.files[0]
  if (items) {
    for (let i = 0; i < items.length; i += 1) {
      if ((items[i].kind === 'file') && (items[i].type.match('^image/'))) {
        readImageAsBase64(items[i], editor)
      }
    }
  } else if (file) {
    readImageAsBase64({ getAsFile() { return file } }, editor)
  }
}

function onPaste(e) {
  e.cancel()

  const editor = e.editor
  const text = e.data.dataValue

  // 黏贴单张图片的情况不处理
  if (/^<img[^>]+>$/.test(text)) {
    return
  }

  // 获取黏贴内容中的链接图片
  const div = document.createElement('div')
  div.innerHTML = text.replace(/data-cke-saved-src="[^"]+"/g, '')
  const imgs = div.querySelectorAll('img[src*="://"]')

  // 若存在图片，且图片可正常读取，将之替换为base64图片
  // 若图片无法正常读取，在样式上做一个错误标记
  // 所有图片都处理完成后，将修改过后的内容插入编辑器
  if (imgs.length) {
    let count = 0
    function done() {
      count++
      if (count === imgs.length) {
        editor.insertHtml(div.innerHTML)
      }
    }

    imgs.forEach((img) => {
      const tempImg = new Image()
      tempImg.crossOrigin = 'Anonymous'
      tempImg.src = img.src.replace('http:', 'https:')
      tempImg.onload = function onload() {
        const canvas = document.createElement('canvas')
        canvas.width = tempImg.naturalWidth
        canvas.height = tempImg.naturalHeight
        canvas.getContext('2d').drawImage(tempImg, 0, 0)
        img.src = canvas.toDataURL()
        done()
      }

      tempImg.onerror = function onerror() {
        img.style = `border: 5px solid red; ${img.style.cssText}`
        done()
      }
    })
    // 若不存在图片，直接将内容插入编辑器
  } else {
    editor.insertHtml(text)
  }
}

function onImagePaste(e) {
  e.data.preventDefault()
  const event = e.data.$
  const editor = e.listenerData && e.listenerData.editor

  const clipboardData = event.clipboardData
  let found = false
  const imageType = /^image/

  if (!clipboardData) {
    return
  }

  return Array.prototype.forEach.call(clipboardData.types, (type, i) => {
    if (found) {
      return
    }

    if (type.match(imageType) || clipboardData.items[i].type.match(imageType)) {
      readImageAsBase64(clipboardData.items[i], editor)
      return found = true
    }
  })
}

function readImageAsBase64(item, editor) {
  if (!item || typeof item.getAsFile !== 'function') {
    return
  }

  const file = item.getAsFile()
  const reader = new FileReader()

  reader.onload = function (evt) {
    const element = editor.document.createElement('img', {
      attributes: {
        src: evt.target.result,
      },
    })

    // We use a timeout callback to prevent a bug where insertElement inserts at first caret
    // position
    setTimeout(() => {
      editor.insertElement(element)
    }, 10)
  }

  reader.readAsDataURL(file)
}

