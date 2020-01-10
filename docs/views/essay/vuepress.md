---
title: 搭建博客时遇到的坑
date: 2020-01-01
sidebar: false
categories: 
- essay
tags: 
- vue
---
## 1. 部署问题

### 如何将源文件保存在github上

将博客部署在github上时，由于需要在```.vuepress/dist```目录下初始化一个git仓库，所以如果托管源代码时再次初始化一个仓库的话，push或者pull的时候很容易出问题 。我的解决办法如下  

1. 解决问题的关键在于将build好的文件夹和源代码文件夹分离，通过修改配置文件 ```config.js```的dest属性，将build好的目录修改至与```package.json```文件的父目录同级的目录，建议取相对路径（当前路径即为```package.json```文件所在目录）

   ``` javascript
   module.exports = {
       dest: '../dist'
   }
   ```

   然后使用 ```npm run docs:build```命令。构建完成后的效果如下：

   ``` 
   .
   ├── blog
   │   ├── docs
   |		├──.vuepress 
   ├── dist
   ```

2. 此时问题就很简单了，只需要在github上新建两个仓库，分别存放着两个仓库的代码

3. 最后是在```package.json```的同级目录下创建批处理文件，结束当天的笔记时跑一下就行，代码也贴上来吧

   ``` shell
   REM 提交源码
   git init
   git add -A
   git commit -m 'update'
   git push -f https://github.com/vergil0210/BlogProject.git master
   
   REM 提交build后的文件夹
   cd ../dist
   git init
   git add -A
   git commit -m 'deploy'
   git push -f https://github.com/vergil0210/blog.git master:gh-pages
   ```
   
   ::: warning 提示
   
   批处理建议使用使用```.bat```的格式，因为之前跑```.sh```时打包一直失败。本人暂时还没有系统学习shell命令，之后可能会对这段内容进行更新
   
   :::


