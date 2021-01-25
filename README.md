##  vue组件文档自动生成

> 基于 [vuese](https://vuese.org/)

> 使用方式同vuese，命令替换为**hjtvuese**，配置文件将会读取 .hjtvueserc 或 hjtvuese.config.js

## 安装

```shell
npm install @hjtvuese/cli -D 或 yarn add @hjtvuese/cli -D
```

## 使用

生成文档

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

## 为你的组件编写文档

参考 [vuese-为你的组件编写文档](https://vuese.org/zh/cli/#%E4%B8%BA%E4%BD%A0%E7%9A%84%E7%BB%84%E4%BB%B6%E7%BC%96%E5%86%99%E6%96%87%E6%A1%A3)

## 改造添加的功能

可使用 *desc 开头的注释来标记自定义markdown描述，显示在抬头位置。在vuese基础上可以写一些自定义的内容，比如组件的使用例子。

![](https://imgcdn.huanjutang.com/file/2021/01/25/222542ef067ea44f9c6c7d5703082255.png)

解析后:

![](https://imgcdn.huanjutang.com/file/2021/01/25/fe000454b7bdd40dad4b94f9374dd049.png)

