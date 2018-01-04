<template>
  <div class="draw"></div>
</template>

<script>
export default {
  name: 'PreviewCanvas',

  props: {
    width: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    html: String,

    drawArea: String,

    zoom: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      canvas: null,
      drawing: false,
      canvasPos: {},
      pos: {},
    }
  },

  watch: {
    width(val) {
      this.resizeCanvas('width', val)
    },

    height(val) {
      this.resizeCanvas('height', val)
    },
  },

  methods: {
    init() {
      // 教案
      if (this.html) {
        const img = this.convertHtmlToImage(this.html)
        this.$el.appendChild(img)
      }

      const CANVAS_HEIGHT = 4000
      const count = Math.floor(this.height / CANVAS_HEIGHT)
      const lastHeight = this.height % CANVAS_HEIGHT

      for (let i = 0; i < count; i += 1) {
        const canvas = this.addLayer(CANVAS_HEIGHT, CANVAS_HEIGHT * i)
        canvas.style.borderBottom = '1px dashed #ccc'
      }

      const canvas = this.addLayer(lastHeight, CANVAS_HEIGHT * count)
      this.canvas = canvas

      // 作图区
      if (this.drawArea) {
        const img = this.convertHtmlToImage(this.drawArea)
        canvas.getContext('2d').drawImage(img, 80, 150)
      }

      this.$emit('init', canvas)
    },

    addLayer(height, top = 0) {
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = height
      canvas.style.top = `${top}px`
      this.$el.appendChild(canvas)
      return canvas
    },

    onPointerdown(event) {
      event.preventDefault()
      this.drawing = true
      const { mode, lineWidth, eraserWidth } = this.draw

      const ctx = event.target.getContext('2d')
      ctx.strokeStyle = this.strokeStyle
      ctx.lineJoin = 'round'
      if (mode === 'pen') {
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineWidth = lineWidth
      } else if (mode === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineWidth = eraserWidth
      }

      this.pos = this.getPoint(event)

      this.setCanvasPosition(event.target)
      const { x, y } = this.canvasPos
      const cx = this.pos.x - x
      const cy = this.pos.y - y

      ctx.beginPath()
      ctx.arc(cx, cy, lineWidth / 2, 0, 2 * Math.PI, true)
      ctx.fill()
    },

    onPointermove(event) {
      event.preventDefault()
      if (!this.drawing) return

      const { x, y } = this.canvasPos
      const ctx = event.target.getContext('2d')

      ctx.beginPath()
      const startX = this.pos.x - x
      const startY = this.pos.y - y
      ctx.moveTo(startX, startY)

      const nextPos = this.getPoint(event)

      const endX = nextPos.x - x
      const endY = nextPos.y - y
      ctx.lineTo(endX, endY)
      ctx.closePath()
      ctx.stroke()

      this.pos = nextPos
    },

    onPointerup() {
      this.drawing = false
    },

    /** 获取画布的当前位置信息 */
    setCanvasPosition(canvas) {
      const rect = canvas.getBoundingClientRect()
      this.canvasPos = {
        x: rect.left,
        y: rect.top,
      }
    },

    /** 获取当前触摸点坐标 */
    getpos(event) {
      const [touch] = event.touches
      const { clientX: x, clientY: y } = touch
      return { x, y }
    },

    convertHtmlToImage(html) {
      const doc = document.implementation.createHTMLDocument('')
      // 过滤掉html中的data-*类型属性，这类属性有较大可能含有阻碍画布正确渲染的数据，同时过滤掉不合法的图片
      doc.write(html.replace(/(data-[^"]+="[^"]+")|(<img[^>]+border: 5px solid red[^>]+>)/g, ''))
      const xml = (new XMLSerializer()).serializeToString(doc).slice(15)

      const data = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}">
          <foreignObject width="100%" height="100%">
            <style>
            body {
              margin: 0;
              padding: 20px 60px;
            }
            * {
              font-family: sans-serif !important;
              font-size: ${this.zoom ? 28 : 16}px !important;
            }
            p {
              line-height: ${this.zoom ? 32 : 24}px;
            }
            img {
              vertical-align: middle;
              ${this.zoom ? 'zoom: calc(28 / 16);' : ''}
            }
            table, td {
              width: auto !important;
            }
            </style>
            ${xml}
          </foreignObject>
        </svg>
      `

      const img = new Image()
      img.src = `data:image/svg+xml;charset=utf-8,${data}`
      return img
    },

    /**
     * 调整画布尺寸
     * 克隆一个画布，改变原画布尺寸，再把克隆出来的画布画回原画布上
     */
    resizeCanvas(prop, value) {
      const img = new Image()
      img.src = this.canvas.toDataURL()
      this.canvas[prop] = value
      this.$nextTick(() => {
        this.canvas.getContext('2d').drawImage(img, 0, 0)
      })
    },

    getPoint(event) {
      const source = event.touches ? event.touches[0] : event
      const { clientX: x, clientY: y } = source
      return { x, y }
    },

  },

  mounted() {
    this.init()
  },
}
</script>

<style>
.draw {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.draw canvas {
  position: absolute;
}

.draw > img {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
