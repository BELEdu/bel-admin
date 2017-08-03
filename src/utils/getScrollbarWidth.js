/**
 * 获取当前浏览器滚动条的宽度
 * @author  chenliangshan
 * @version 2017/8/3
 */

const getScrollbarWidth = () => {
  const oP = document.createElement('p')
  const styles = {
    width: '100px',
    height: '100px',
    overflowY: 'scroll',
    position: 'fixed',
    opacity: 0,
  }
  Object.keys(styles)
    .forEach((k) => {
      oP.style[k] = styles[k]
    })
  document.body.appendChild(oP)
  const scrollbarWidth = oP.offsetWidth - oP.clientWidth
  oP.remove()
  return scrollbarWidth
}

export default getScrollbarWidth
