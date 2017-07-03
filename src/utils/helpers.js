/**
 * 递归转换
 * @author lmh
 */
const map = items => items.map(item => ({
  can_choose: item.can_choose,
  label: item.display_name,
  value: item.can_choose ? item.role_id : item.id,
  children: item.children ? map(item.children) : [],
}))

/**
 * 把后台数据格式转换为兼容cascader组件的格式
 * @author lmh
 * @param {Array} data - 需转换的项目
 */
export const transform = data => map(data)

/**
 * 生成每个最深层级项目的id路径数组，以便传递给cascader组件
 * @author lmh
 * @param {Array} data - 后台数据
 */
export const generatePaths = (data) => {
  const result = []

  const loop = (items, path) => {
    items.forEach((item) => {
      const updatedPath = [...path, item.can_choose ? item.role_id : item.id]
      if (item.children) {
        loop(item.children, updatedPath)
      } else {
        result.push(updatedPath)
      }
    })
  }

  loop(data, [])

  return result || []
}

/**
 * 根据id获得该id所对应的路径数组，见一个方法
 * @author lmh
 * @param {Number} id - 要寻找的id
 * @param {Array} paths - 所有的路径数组
 */
export const getPath = (id, paths) => {
  const result = paths.find(path => path.includes(id))
  const index = result.findIndex(pathId => pathId === id)
  return result.slice(0, index + 1)
}
