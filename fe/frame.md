# 前端框架

## Vue

Vue是一个MVVM框架，MVVM是Model-View-ViewModel缩写，也就是把MVC中的Controller演变成ViewModel。Model层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据。

### Vue3（与Vue差异部分）

#### 模版语法

添加全局属性(一个用于注册能够被应用内所有组件实例访问到的全局属性的对象): `app.config.globalProperties`

#### 响应式基础

DOM更新时机: 非同步，会在next tick更新周期中缓存状态的修改。

ref(): 函数声明响应式状态， `.value`进行赋值使用，模版中不需要`.value`(会自动解包)。`const count = ref(0)`
shallowRef(): ref的浅层作用形式。
reactive(): **仅限于对象类型（集合类型），替换和解包（非ref）会丢失响应性**, ref是将内部值包装在特殊对象，而reactive将使对象本身具有响应式。`const state = reactive({ count: 0 })`
shallowReactive(): rective()的浅层作用形式。

#### 计算属性

使用计算属性来描述依赖响应式状态的复杂逻辑。
computed()： 函数返回值是一个计算属性ref，返回函数第一个参数的回调函数结果。
计算属性会自动追踪响应式依赖并缓存，如果直接调用一个函数并没有缓存，每次都会重新调用。(`computed(() => Date.now())`，这种情况下计算属性永远不会更新)

```js
const computedXX = computed(() => xx)
```

可写计算属性

```js
const computedXX = computed({
  get() {
    return a.value + ' ' + b.value
  },
  set(newValue) { // 当computedXX = 'xxx'进行运行的时候，setter会被调用而a,b会随之更新。
    [a.value, b.value] = newValue.split(' ')
  }
})
```

#### 列表渲染

可以v-for中解构，可以使用of作为分隔符代替in（更接近js的迭代器语法）

```html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- 有 index 索引时 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

可以遍历对象

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})

<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

#### 表单输入绑定

true-value 和 false-value 是 Vue 特有的 attributes，仅支持和 v-model 配套使用。这里 toggle 属性的值会在选中时被设为 'yes'，取消选择时设为 'no'。

```html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
```

#### 生命周期

![frame-vue-lifecycle](/images/frame-vue-lifecycle.png "frame-vue-lifecycle")

onMounted 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码

```js
onMounted(() => {
  console.log(`the component is now mounted.`)
})
```

#### 侦听器

watch 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组：

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

不可以直接侦听响应式对象的属性值，需要用一个返回该属性的getter函数

```js
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})

// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

深层侦听器

```js
const obj = reactive({ count: 0 })

obj.count++

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})


watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```

即时回调

```js
watch(source, (newValue, oldValue) => {
  // 立即执行，且当 `source` 改变时再次执行
}, { immediate: true })
```

watchEffect，会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })

// 简化上面的代码，自动追踪todoId的依赖
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

侦听器回调中访问Vue更新之后的DOM，需要加`flush: 'post'`

```js
watch(source, callback, { flush: 'post' })
```

```js
watchEffect(source, callback, {flush: 'post'})
// 或者
import { watchPostEffect } from 'vue'
watchPostEffect(source, callback)
```

停止侦听器

```js
const unwatch = watchEffect(() => {})
unwatch()
```

#### 模版引用

需要同名ref

```html
<script setup>
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input"/>
</template>

```

当在 v-for 中使用模板引用时，对应的 ref 中包含的值是一个数组。

```html
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
```

如果组件上使用ref，则引用的值是组件的实例。如果子组件用的是setup，则属性必须通过defineExpose暴露，父组件才能访问。（setup中的东西默认是私有）

#### 组件基础

定义属性

```html
<script setup>
defineProps(['title'])
</script>
```

定义要抛出的事件

```html
<script setup>
defineEmits(['title'])
</script>
```

#### 深入组件

全局注册: 不会被tree-shaking，依赖关系不明确

```html
<script setup>
  import { createApp } from 'vue'
  const app = createApp({})
  app
    .component('ComponentA', ComponentA)
    .compunent('ComponentB', ComponentB)
</script>
```

局部注册：直接引用，仅在当前组件可用

```html
<script setup>
  import ComponentA from './ComponentA.vue'
</script>
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

### Vue3与Vue2源码层面

实现双向绑定 Proxy 与 Object.defineProperty 相比优劣如何?

- `Object.definedProperty`的作用是劫持一个对象的属性，劫持属性的getter和setter方法，在对象的属性发生变化时进行特定的操作。而 Proxy劫持的是整个对象。
- `Proxy`会返回一个代理对象，我们只需要操作新对象即可，而Object.defineProperty只能遍历对象属性直接修改
- `Object.definedProperty`不支持数组，更准确的说是不支持数组的各种API，因为如果仅仅考虑`ary[i] = value` 这种情况，是可以劫持 的，但是这种劫持意义不大。而Proxy可以支持数组的各种API。
- 尽管`Object.defineProperty`有诸多缺陷，但是其兼容性要好于Proxy。

## React
