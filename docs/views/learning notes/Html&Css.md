---
title: HTML和CSS
date: 2020-01-03
categories: 
- learning notes
tags:
- 前端
---
::: tip
应公司要求，开始了前端白痴的html+css+js+vue+elementUI的集成学习。   
此篇blog由前端小白的血泪铸成
:::
<!-- more -->
## 解决页面有没滚动条

给页面的父div设置一个固定的高度并设置overflow为auto

```css
.pageCss {
    height: 1000px;
    overflow: auto;
}
```

## 颜色渐变

CSS3 定义了两种类型的渐变（gradients）：

- 线性渐变（Linear Gradients）- 向下/向上/向左/向右/对角方向
- 径向渐变（Radial Gradients）- 由它们的中心定义

语法

```background: linear-gradient(direction, color-stop1, color-stop2, ...);```
线性渐变 - 从上到下（默认情况下）
示例代码如下：
设置背景色从上面**红色**到下面**蓝色**的渐变：

``` css
.box{
  background: -webkit-linear-gradient(red, blue); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(red, blue); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(red, blue); /* Firefox 3.6 - 15 */
  background: linear-gradient(red, blue); /* 标准的语法 */
}
```

### 线性渐变 

#### 从左到右

下面的实例演示了从左边开始的线性渐变。起点是**红色**，慢慢过渡到**蓝色**：

```css
.box {
  background: -webkit-linear-gradient(left, red , blue); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, red, blue); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, red, blue); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, red , blue); /* 标准的语法 */
}
```

#### 对角

你可以通过指定水平和垂直的起始位置来制作一个对角渐变。

下面的实例演示了从左上角开始（到右下角）的线性渐变。起点是黑色，慢慢过渡到白色：

```css
.box {
    background: -webkit-linear-gradient(left top, #000 , #fff); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(bottom right, #000, #fff); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(bottom right, #000, #fff); /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom right, #000 , #fff); /* 标准的语法 */
}。
```