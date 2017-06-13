# caihonggou

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 备忘事项
* 静态资源版本号变更时，请对`/config/index.js`中的`assetsSubDirectory`字段做相应的修改

## 约定

### 一般

* 建议各位将npm升级到@5.0.0以上，这个版本有一些重要的改进（具体的改进内容可自行网上搜索查阅）

* 请用jsdoc为文件做最基本的注释，示例：

```js
  /**
  * Vue Ajax请求插件
  * @author lmh
  * @description 基于fetch封装
  * @version 2017-06-02 （必要时此处注明修改人并阐述主要修改内容）
  */
```

* 请一贯、正确地使用两个空格进行缩进，请不要乱缩进也不要不缩进
* 请谨慎地编写、修改全局性质的东西；若你不确定，请不要做全局性操作、请与其他人员商量

### CSS

* 在本项目中，请使用less来书写样式

#### 代码风格
* 定义颜色值时，请尽可能使用`src/styles/vars.less`中预定好的变量
  要使用变量，你需要在你的CSS代码前写上`@import '~vars';`
* 请保持每个选择器自占一行
* 请在选择器和花括号之间保留*有且只有*一个空格
* 请保持每条声明自占一行，请在每条声明后写上分号
* 请在每条声明的冒号后保留*有且只有*一个空格
* 请在每个声明块之前保留*有且只有*一个空行，包括嵌套的声明块
* 请不要省略小数点前的0，如`0.5`，不要写成`.5`
* 值包含逗号时，请在每个逗号后保留*有且只有*一个空格
* 值为0时，请省略单位
* 在合理的情况下，请尽可能使用单一的`class`作为选择器

#### 命名规则
* 多个单词请使用横杠`-`隔开
* 全局性的`class`统一以`app-`前缀开头
* 鼓励使用BEM命名规则，但不强制
* 若你的命名规则比较简单、零散，请使用vue单文件格式所提供的`scoped`选项

示例：
```less
.app-user {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__identity {
    padding: 6px 10px;
    border-radius: 3px;
    margin-right: 1.5em;
    background-color: @bg-color-dark;

    & a {
      color: inherit;
      transition-duration: 0.5s;

      &:hover {
        color: @disable-color;
      }
    }
  }

  &__name {
    margin-right: 1em;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
}
```

#### 兼容问题
* 请熟悉IE9及以上浏览器的兼容性，善用IE9所支持的语法，如`vw`、`vh`、`calc`等
* 鼓励使用flex进行布局，对于ie9，可单独做兼容

### JS

* 项目中已对`Promise`、`String#includes`、`Array#find`、`Array#findIndex`、`Array#includes`、`Set`等新的类或静态方法做了兼容，请善用
* 使用`fetch`做ajax请求，项目中已对`fetch`进行了一层简单的抽象并挂载在`Vue.prototype`上，在Vue组件中可通过`this.$http.get`和`this.$http.post`调用
* 请勿在全局关闭eslint规则，大多数情况下，遵守这些规则能使你写出更易读与易于维护的代码

### Vue

* 一般组件放置在components文件夹中，路由组件放置在views文件夹中
* 路由组件太过复杂而需要拆分时，拆分出来的组件若与应用内的其它部分无关，应放置在路由组件自身目录下的components文件夹中
* 请给每一个组件设置`name`属性，属性名应使用*kebab-case*风格，两至三个单词最佳；全局性质的组件可使用`app-`前缀命名
* 组件接受`props`时，鼓励用对象的形式为`props`做类型检测、设置是否必传及默认值等
* 请按照`name`、`props`、`data`、`computed`、`watch`、`methods`、生命周期方法这样的顺序定义组件（具体的顺序可进一步商榷，但务必遵守）
* `store`中有一个`loading`状态用来指示页面上是否有数据请求正在进行，进入每个路由页时，这个状态都会被自动设置为`true`，请在接口请求成功或失败后使用`this.$store.commit(GLOBAL.LOADING.HIDE)`将之改为false；若该页面不需要进行数据请求，请直接在`created`中执行前述语句
* 一般来说，数据类型的状态都应放置在全局`store`之中；视图状态可放置在组件自身的`data`中

### Git

基本流程：
1. 切换到个人开发分支上进行代码开发
2. 在开发分支上合理地分批提交代码
3. 阶段性功能完成后，切换回主分支，查看主分支上的代码是否有更新
4. 若主分支代码有更新，使用最新的主分支代码为个人开发分支变基（`rebase`），并处理可能存在的冲突
6. 进行必要的测试，确定此时的代码没有重大的错误
5. 合并（`merge`）个人开发分支上的代码到主分支，并推送到远端

* 请勿直接在master分支上进行开发
* 建议以每个人的姓名拼音作为各自的开发分支的名称
* 提交代码时，请仔细填写提交信息，提交信息应当简练、明确
  当提交信息较冗长时，可将信息分行，第一行写明标题或提要
* 建议以小的功能为单位进行代码提交，保证提交历史清晰、代码变更易于分析与追踪

### 协作

以上所有约定，若有不同意见均可提出商榷
约定是为了能更好地维护代码和协同工作
