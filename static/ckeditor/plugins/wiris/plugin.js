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
      toolbar: 'insert',
    });

    if(editor.addMenuItem) {
      editor.addMenuGroup("wirisGroup");
      editor.addMenuItem("wirisItem", {
        label: '编辑公式',
        icon: this.path+"icons/wiris.png",
        command: 'abbr',
        group: 'wirisGroup',
      });
    }
    if(editor.contextMenu) {
      editor.contextMenu.addListener(function(element, selection) {
        if(element && element.getName() === "img" && element.getAttribute('data-mathml')) {
          editor.getSelection().selectElement(element);
          // 右键菜单新增公式编辑功能
          return { wirisItem: CKEDITOR.TRISTATE_ON };
        }
        return null;
      });
    }
  }
});
