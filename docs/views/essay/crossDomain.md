---
title: 关于跨域问题的记录和理解
date: 2020-01-14
categories:
- essay
tags:
- domain
---

作为一个开始尝试写前端代码的后端程序员，跨域问题就像一块杯底的茶垢，相信我，总有一天你会对他忍无可忍一次刷个干净。那今天就是我的那天。

## 1. 概念扫盲

### 1.1跨域和同源

一个简单的说法：当一个请求url的**协议**、**域名**、**端口**三者之间任意一个与当前页面url不同即为跨域，相同即为同源。

### 1.2 同源策略

同源策略（Same origin policy）是一种约定，它是由[Netscape](https://baike.baidu.com/item/Netscape/2778944)提出的一个著名的**安全策略**。所有支持JavaScript 的浏览器都会使用这个策略。所谓同源是指，域名，协议，端口相同。当浏览器执行一个脚本时会检查这个脚本是属于哪个页面的，即检查是否同源，只有同源的脚本才会被执行。 如果非同源，那么在请求数据时，浏览器会在控制台中报一个异常，提示拒绝访问。

同源策略是**浏览器的行为**，是为了保护本地数据不被JavaScript代码获取回来的数据污染，**因此拦截的是客户端发出的请求回来的数据接收**，即请求发送了，服务器响应了，但是无法被浏览器接收。

### 1.3 CORS

CORS 是一个 W3C 标准，全称是"跨域资源共享"（Cross-origin resource sharing）它允许浏览器向跨域服务器发出 XMLHttpRequest 请求，从而克服了 ajax 只能同源使用的限制。

CORS 需要浏览器和服务器同时支持才可以生效，对于开发者来说，CORS 通信与同源的 ajax 通信没有差别，代码完全一样。**浏览器一旦发现 ajax 请求跨域，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉**。

因此，**实现 CORS 通信的关键是服务器**。只要服务器实现了 CORS 接口，就可以跨域通信。

本篇文章主要是介绍CORS跨域这种方式。

**注：**springMVC中有包含与CORS配置项对应的api，可以通过配置类实现，具体可以参考[SpringBoot自定义Web配置](./SBWebConfig/)

::: tip 提示

今天逛博客看到有说关于CORS机制相当于设置白名单所以存在安全问题，但个人认为既然同源策略是浏览器端的问题那么应该对于服务器来说设置白名单并不属于安全隐患。因为对网络安全方面并不熟悉，之后应该会在此进行补充。这里存一篇看到的文章https://blog.csdn.net/niexinming/article/details/82719092

:::

## 2. 解决跨域问题

### 2.1 CORS配置项解释

```Access-Control-Allow-Origin```
该字段必填。它的值要么是请求时Origin字段的具体值，要么是一个*，表示接受任意域名的请求。

```Access-Control-Allow-Methods```

该字段必填。它的值是逗号分隔的一个具体的字符串或者*，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

```Access-Control-Expose-Headers```
该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。

```Access-Control-Allow-Credentials```
该字段可选。它的值是一个```布尔值``，表示是否允许发送Cookie.默认情况下，不发生Cookie，即：false。对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json，这个值只能设为true。如果服务器不要浏览器发送Cookie，删除该字段即可。

```Access-Control-Max-Age```
该字段可选，用来指定本次预检请求的有效期，单位为秒。在有效期间，不用发出另一条预检请求。