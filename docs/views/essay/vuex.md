---
title: vuex学习随笔
date: 2020-02-11
categories: 
- essay
tags: 
- vue
---

##  概念介绍

uex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 [devtools extension](https://github.com/vuejs/vue-devtools)，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

::: tip 

详细了解请访问[vuex中文官方文档](https://vuex.vuejs.org/zh/)

:::

## 使用简介

1. 在src目录下创建store文件夹并创建index.js文件

2. 编辑index.js文件

	``` javascript
	import Vue from 'vue'
	import Vuex from 'vuex'
	
	Vue.use(Vuex);
	const store = new Vuex.Store({
	    state: {},     //保存全局参数
	    getters: {},   //用于对state数据进行处理和包装
	    mutations: {}, //用于修改state中的值
	    actions: {},   //用于存放业务逻辑
	});
	export default store
	```

	

3. 在main.js中导入store： ```import store from "@/store"```

4. 在<script>语法块中引用或修改state

	``` javascript
	<script>
	import { mapState } from 'vuex';
	export default {
	  data () {
	    return {
	    }
	  },
	  methods: {
	    //通过methods将计算属性进行封装（当然也可以直接使用计算属性）
	    checkToLogin(){
	      console.log(this.isLogin);
	      this.$store.commit('checkToLogin');
	      this.$router.push('/regLogin');
	    },
	    checkToRegister(){
	      console.log(this.isLogin);
	      this.$store.commit('checkToRegister');
	      this.$router.push('/regLogin/register');
	    },
	  },
	  computed: {
	    //通过三点运算符（ES6语法）获取state中的值，之后可以直接将 regLogin 当作计算器属性使用
	    ...mapState(['regLogin']),
	    //获取子属性
	    isLogin: function () {
	      return this.regLogin.isLogin;
	    }
	  }
	}
	</script>
	```

	当然，vuex也内置了mutations的三点运算符写法

	``` javascript
	import { mapMutations } from 'vuex'
	...
	...
	methods : {
	    ...mapMutations(["checkToLogin","checkToRegister"]),
	    check1() {
	        this.checkToLogin();		//等价于this.$store.commit('checkToLogin');
	    }
	}
	```

	