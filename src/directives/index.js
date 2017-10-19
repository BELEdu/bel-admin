import clickoutside from './clickoutside'

const dirDog = {
  clickoutside,
}

const install = (Vue) => {
  Object.keys(dirDog).forEach((key) => {
    // 注册全局指令
    Vue.directive(key, dirDog[key])
  })
}

export default { ...dirDog, install }
