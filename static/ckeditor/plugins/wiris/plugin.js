/* eslint-disable */
CKEDITOR.plugins.add('wiris', {
  icons: 'wiris',
  requires: 'dialog',
  init: function (editor) {
    CKEDITOR.dialog.add('wiris', this.path + 'dialogs/wiris.js');
    editor.addCommand('abbr', new CKEDITOR.dialogCommand('wiris'));
    editor.ui.addButton('Wiris', {
      label: '插入公式',
      command: 'abbr',
      toolbar: 'insert'
    });
  }
});
