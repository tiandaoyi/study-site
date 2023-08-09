# 前端框架

## Vue

Vue是一个MVVM框架，MVVM是Model-View-ViewModel缩写，也就是把MVC中的Controller演变成ViewModel。Model层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据。

### Vue的响应式原理

![network-osi](/images/frame-vue.png "frame-vue")

Vue.js 的响应式原理是其核心特性之一，它使数据和视图保持同步，即当数据发生变化时，视图会自动更新，而无需手动操作。这种机制是通过 Vue.js 的“响应式系统”来实现的。

响应式系统的核心概念包括数据劫持、依赖追踪和派发更新。

1. 数据劫持：Vue.js 在初始化时会递归地将对象的属性转换为 getter 和 setter，这使得 Vue 能够追踪属性的读取和修改操作。当数据发生变化时，setter 会通知依赖的地方。（通过`Object.defineProperty`或`Proxy`）
2. 依赖追踪(依赖收集)：当视图渲染时，Vue.js 会跟踪模板中使用的数据属性。每个属性都会有一个“依赖收集器”，它会记录当前组件（或模板）正在使用这个属性。这建立了属性和使用它的组件之间的关系。
3. 派发更新：当数据发生变化时，setter 会触发一个通知，通知相关联的组件需要更新。Vue.js 会执行一个“派发更新”的过程，更新所有相关的组件，使视图保持同步。

基本上，这个过程可以描述为：

1. 初始化时，Vue.js 会对数据进行“代理”（Proxy），将对象的属性转换为 getter 和 setter。
2. 当组件渲染时，会建立一个“渲染 watcher”，它会跟踪模板中使用的属性。
3. 当模板中使用的属性被读取时，会触发 getter，将这个属性与当前的渲染 watcher 关联起来。
4. 当属性被修改时，会触发 setter，通知关联的渲染 watcher 需要更新。
5. 更新过程会触发虚拟 DOM 的重新构建和对比，最终更新视图。

```js
class Vue {
  constructor(options) {
    this._data = options.data;
    observe(this._data, options.render)
  }
}

function observe(value, cb) {
  // 将数据data变成可观察(observable)的
  Object.keys(value).forEach((key) => defineReactive(value, key, value[key] , cb))
}

function defineReactive (obj, key, val, cb) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: ()=>{
      /*....依赖收集等....*/
      return val
    },
    set:newVal=> {
      val = newVal;
      cb();/*订阅者收到消息的回调*/
    }
  })
}

let app = new Vue({
  el: '#app',
  data: {
    text: 'text',
    text2: 'text2'
  },
  render(){
    console.log("render");
  }
})
```




### Vue3相比vue2的优点

1. 性能优化：Vue3在性能方面进行了很多优化，包括更好的虚拟DOM渲染性能和更小的包大小
2. Composition API：Vue 3 引入了 Composition API，这是一种新的组织组件逻辑的方式。它使组件逻辑更容易组织、复用和测试。（Vue 2也支持了）
3. Teleport 组件： Vue 3 引入了 Teleport 组件，它允许你将组件的内容渲染到 DOM 中的任意位置，而不必依赖父组件的 DOM 结构。（比如模态框）
4. 全局 API 修改： Vue 3 将一些全局 API 进行了修改，以更好地支持 Tree-Shaking 和模块化。例如，Vue.directive 变成了 app.directive。
5. 多个根元素支持： 在 Vue 2 中，每个组件只能有一个根元素，而在 Vue 3 中，组件可以有多个根元素。
6. 响应式系统优化： Vue 3 对响应式系统进行了优化，提升了响应式数据的更新性能。
7. Fragments： Vue 3 引入了 Fragments，它允许你在不添加额外节点的情况下返回多个节点。
8. 更好的 TypeScript 支持： Vue 3 提供了更好的 TypeScript 支持，包括更准确的类型推断和类型定义。
9. 更强大的插槽： Vue 3 的插槽支持更强大的特性，如动态插槽名称和新的 `<template #xxx>` 语法。（可以单独渲染父组件和子组件）

### Vue3与Vue2源码层面

实现双向绑定 Proxy 与 Object.defineProperty 相比优劣如何?

- `Object.definedProperty`的作用是劫持一个对象的属性，劫持属性的getter和setter方法，在对象的属性发生变化时进行特定的操作。而 Proxy劫持的是整个对象。
- `Proxy`会返回一个代理对象，我们只需要操作新对象即可，而Object.defineProperty只能遍历对象属性直接修改
- `Object.definedProperty`不支持数组，更准确的说是不支持数组的各种API，因为如果仅仅考虑`ary[i] = value` 这种情况，是可以劫持 的，但是这种劫持意义不大。而Proxy可以支持数组的各种API。
- 尽管`Object.defineProperty`有诸多缺陷，但是其兼容性要好于Proxy。

