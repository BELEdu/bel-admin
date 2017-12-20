/*
 * 富文本编辑器配置
 * @Author: chenliangshan
 * @Date: 2017-12-05 13:22:03
 * @Last Modified by: chenliangshan
 * @Last Modified time: 2017-12-20 11:11:09
 */

// 试题配置
const paper = {
  toolbar: [
    {
      name: 'base',
      items: ['Undo', 'Redo', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'showborders', 'Superscript', 'base64image', 'SpecialChar', 'Table', 'Wiris'],
    },
  ],
  allowedContent: 'p b i u sup sub table; img[!src,alt,data-mathml]{vertical-align};',
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
      name: 'editing',
      items: ['Find', 'Replace', '-', 'SelectAll'],
    },
    {
      name: 'basicstyles',
      items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'],
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
      items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
    },
    {
      name: 'insert',
      items: ['base64image', 'Table', 'HorizontalRule'],
    },
    {
      name: 'base',
      items: ['SpecialChar', 'Wiris'],
    },
  ],
}

export default {
  paper,
  lesson,
}
