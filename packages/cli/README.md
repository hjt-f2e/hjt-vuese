##  vue组件文档自动生成

> 基于 [vuese](https://vuese.org/)

> 使用方式同vuese，命令替换为**hjtvuese**，配置文件将会读取 .hjtvueserc 或 hjtvuese.config.js

## 安装

```shell
npm install @hjtvuese/cli -D 或 yarn add @hjtvuese/cli -D
```

## 使用

1. 生成文档

```shell
npx hjtvuese gen
```

或者写入package.json中

```shell
"scripts": {
    "docs": "hjtvuese gen"
}
```

```shell
npm run docs
```

2. 使用配置文件

在根目录创建 .hjtvueserc 或 hjtvuese.config.js

```js
module.exports = {
    title: 'xxx组件文档', // 生成组件文档index的title
    include: ['**/*.vue'], // 包含的文件
    exclude: [], // 排除的文件，node_modules已被默认排除
    outDir: './docs', // 文档的输出目录
}
```

## 为你的组件编写文档

参考 [vuese-为你的组件编写文档](https://vuese.org/zh/cli/#%E4%B8%BA%E4%BD%A0%E7%9A%84%E7%BB%84%E4%BB%B6%E7%BC%96%E5%86%99%E6%96%87%E6%A1%A3)

## 改造添加的功能

### 1.支持自定义编写markdown

可使用 <code>*desc</code> 开头的注释来标记自定义markdown描述，显示在抬头位置。在vuese基础上可以写一些自定义的内容，比如组件的使用例子。

需要将注释的位置放在 <code>import</code> 与 <code>export default {}</code> 之间

```js
import xxx from 'xxx';
/* *desc

## 组件描述

...

*/

// @group xxx
export default {}
```

![使用图例](https://imgcdn.huanjutang.com/file/2021/01/25/222542ef067ea44f9c6c7d5703082255.png)


解析后:

![解析后展示](https://imgcdn.huanjutang.com/file/2021/01/25/fe000454b7bdd40dad4b94f9374dd049.png)

### 2.对生成的md文件添加相对路径标识

解决2个不同位置同名组件覆盖的问题。

生成文件前会先清空存放md文件的文件夹



