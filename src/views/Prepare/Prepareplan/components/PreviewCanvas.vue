<template>
  <div
    class="app-canvas"
    :style="{width: `${width}px`, height: `${height}px`}"
  ></div>
</template>

<script>
/**
 * canvas画布
 * 通过inject拿到paint对象
 */

/* eslint semi: 0 */

// 画布模式
const PEN = 'PEN';
const ERASER = 'ERASER';

// 画布风格高度
const CANVAS_HEIGHT = 4000;

// 画笔颜色
export const BLACK = '#000';
export const RED = '#f00';

export default {
  name: 'AppCanvas',

  props: {
    width: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    // 富文本
    html: {
      type: String,
      default: null,
    },

    fontSize: {
      type: Number,
      default: 16,
    },
  },

  data() {
    return {
      canvas: null,
      pos: null,

      htmlPaddingH: 60 - 7, // 教案内容的左右padding，画布本身左右有7个像素的空白？
      htmlPaddingV: 20, // 教案内容的上下padding

      paint: {
        active: true,
        mode: PEN,
        lineWidth: 2,
        eraserWidth: 50,
        strokeStyle: BLACK,
      },
    };
  },

  watch: {
    width(val) {
      this.resizeCanvas('width', val);
    },

    height(val) {
      this.resizeCanvas('height', val);
    },
  },

  methods: {
    /**
     * 调整画布尺寸
     * 先提取画布内容，再改变画布尺寸，然后重新把内容画回画布上
     */
    resizeCanvas(prop, value) {
      const content = this.canvas.toDataURL();
      let img = new Image();
      img.addEventListener('load', () => {
        this.canvas[prop] = value;
        this.canvas.getContext('2d').drawImage(img, 0, 0);
        img = null;
      });
      img.src = content;
    },

    createCanvas(height, top = 0, isPaint = true) {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = height;
      canvas.style.top = `${top}px`;

      if (isPaint) {
        canvas.style.zIndex = 1;
        this.$el.appendChild(canvas);
        canvas.addEventListener('touchstart', this.onTouchstart);
        canvas.addEventListener('touchmove', this.onTouchmove);
      }

      return canvas;
    },

    /**
     * 初始化画布
     * 教案的富文本单独渲染进一张画布，并存放在主画布的htmlCanvas属性中，需要保存到后台时再合并两种画布
     */
    initCanvas() {
      if (this.html) {
        const drafts = [];

        const count = Math.floor(this.height / CANVAS_HEIGHT);
        const lastHeight = this.height % CANVAS_HEIGHT;

        for (let i = 0; i < count; i += 1) {
          const canvas = this.createCanvas(CANVAS_HEIGHT, CANVAS_HEIGHT * i);
          canvas.style.borderBottom = '1px dashed #ccc';
          drafts.push(canvas);
        }
        const canvas = this.createCanvas(lastHeight, CANVAS_HEIGHT * count);
        drafts.push(canvas);

        this.convertHtmlToSvg(this.html)
          .then((svg) => {
            const htmlCanvas = this.createCanvas(this.height, 0, false);
            const htmlCtx = htmlCanvas.getContext('2d');
            htmlCtx.drawImage(svg, this.htmlPaddingH, this.htmlPaddingV);
            this.$el.appendChild(htmlCanvas);
            drafts.push(htmlCanvas);

            // 把所有画布存在全局，保存草稿时调用
            window.drafts = drafts;
          });
      } else {
        this.canvas = this.createCanvas(this.height);
        this.$emit('init', this.canvas);
      }
    },

    onTouchstart(event) {
      const { paint } = this;

      if (!paint.active) return;

      // 必须阻止touchstart的默认行为，否则touchmove会延迟触发
      event.preventDefault();

      const ctx = event.target.getContext('2d');

      // 设置画笔的基本属性
      ctx.strokeStyle = paint.strokeStyle;
      ctx.lineJoin = 'round';
      if (paint.mode === PEN) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = paint.lineWidth;
      } else if (paint.mode === ERASER) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = paint.eraserWidth;
      }

      const { x, y } = this.getCanvasPosition(event.target);
      this.pos = this.getpos(event);
      const cx = this.pos.x - x;
      const cy = this.pos.y - y;
      ctx.beginPath();
      ctx.arc(cx, cy, this.paint.lineWidth / 2, 0, 2 * Math.PI, true);
      ctx.fill();
    },

    onTouchmove(event) {
      const { paint } = this;

      if (!paint.active) return;

      event.preventDefault();

      const ctx = event.target.getContext('2d');
      const { x, y } = this.getCanvasPosition(event.target);

      ctx.beginPath();
      const startX = this.pos.x - x;
      const startY = this.pos.y - y;
      ctx.moveTo(startX, startY);

      const nextPos = this.getpos(event);
      const endX = nextPos.x - x;
      const endY = nextPos.y - y;
      ctx.lineTo(endX, endY);
      ctx.closePath();
      ctx.stroke();

      this.pos = nextPos;
    },

    /** 获取画布的当前位置信息 */
    getCanvasPosition(canvas) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
      };
    },

    /** 获取当前触摸点坐标 */
    getpos(event) {
      const [touch] = event.touches;
      const { clientX: x, clientY: y } = touch;
      return { x, y };
    },

    /**
     * 把富文本转换为svg图片以便渲染进画布
     * 这里的样式必须和对应元素的样式保持一致
     */
    convertHtmlToSvg(html) {
      const doc = document.implementation.createHTMLDocument('');
      doc.write(html.replace(/(data-latex="[^"]+")|(<img[^>]+file[^>]+>)/g, ''));

      const xml = (new XMLSerializer())
        .serializeToString(doc)
        .slice(15)
        .replace(/<head>.*<\/head>/, `<head>
          <style>
            body {
              font-family: sans-serif !important;
              font-size: ${this.fontSize}px !important;
              line-height: 1.5;
            }
            img {
              zoom: ${this.fontSize / 16};
              mix-blend-mode: multiply;
              vertical-align: middle;
            }
            body * {
              font-family: inherit !important;
              font-size: inherit !important;
              line-height: inherit !important;
            }

            table, td {
              width: auto !important;
            }
          </style>
        </head>`);

      const data = `<svg xmlns="http://www.w3.org/2000/svg">
        <foreignObject width="${this.width - (this.htmlPaddingH * 2)}" height="${this.height - this.htmlPaddingV}">
          ${xml}
        </foreignObject>
      </svg>`;

      return new Promise((resolve) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.src = `data:image/svg+xml;charset=utf-8,${data}`;
      });
    },
  },

  mounted() {
    this.initCanvas();
  },
};
</script>

<style>
.app-canvas {
  position: relative;
}

.app-canvas canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
