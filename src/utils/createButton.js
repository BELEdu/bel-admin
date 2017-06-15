/**
 * 表格按钮公共渲染方法
 * @author lmh
 * @name createButton
 * @function
 * @description iview表格组件中的按钮需要手动写render函数，此方法用来简化这一步骤，减少工作量并保证一致性
 * @param {Object[]} btns - 描述按钮的对象数组
 * @param {String} btns[].text - 按钮文字
 * @param {String} [btns[].type] - 按钮类型，用来控制颜色
 * @param {clickCallback} [btns[].click] - 绑定按钮点击事件的方法
 * @returns {render} Vue组件的render方法
 * @version 2017-06-08 给click回调函数传递当前行的数据
 */

const createButton = btns => (h, params) => (
  h(
    'div',
    btns.map(btn => h('Button', {
      class: `color-${btn.type}`,
      props: {
        type: 'text',
        size: 'small',
      },
      on: {
        ...(btn.click ? {
          // 传递进来的click回调在执行时会自动获得当前行的数据
          // 这个数据是在这里传递的
          click: () => btn.click(params.row),
        } : {}),
      },
    }, btn.text)),
  )
)

export default createButton
