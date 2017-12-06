/*
 * 富文本编辑器配置
 * @Author: chenliangshan
 * @Date: 2017-12-05 13:22:03
 * @Last Modified by: chenliangshan
 * @Last Modified time: 2017-12-05 20:19:58
 */

// 试题配置
const paper = {
  toolbar: [
    {
      name: 'base',
      items: ['Undo', 'Redo', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'showborders', 'Superscript', 'base64image', 'SpecialChar', 'Table', 'Wiris'],
    },
  ],
  allowedContent: 'p b i; u sup sub table img[!src,alt];',
}

// 其他配置
const lesson = {
  toolbar: [
    {
      name: 'document',
      items: ['Preview', 'Print'],
    },
    {
      name: 'clipboard',
      items: ['Undo', 'Redo'],
    },
    {
      name: 'basicstyles',
      items: ['Bold', 'Italic', 'Underline', 'Strike'],
    },
    {
      name: 'colors',
      items: ['TextColor'],
    },
    {
      name: 'align',
      items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
    },
    {
      name: 'styles',
      items: ['Styles', 'Format', 'Font', 'FontSize'],
    },
    {
      name: 'paragraph',
      items: ['Outdent', 'Indent'],
    },
    {
      name: 'insert',
      items: ['base64image', 'Table'],
    },
    {
      name: 'base',
      items: ['Subscript', 'Superscript', 'SpecialChar', 'Wiris'],
    },
  ],
}

export default {
  paper,
  lesson,
}
