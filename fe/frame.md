# 前端框架

## Vue

Vue是一个MVVM框架，MVVM是Model-View-ViewModel缩写，也就是把MVC中的Controller演变成ViewModel。Model层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据。

### Vue3

#### 模版语法

添加全局属性(一个用于注册能够被应用内所有组件实例访问到的全局属性的对象): `app.config.globalProperties`

#### 响应式基础

DOM更新时机: 非同步，会在next tick更新周期中缓存状态的修改。

ref(): 函数声明响应式状态， `.value`进行赋值使用，模版中不需要`.value`(会自动解包)。`const count = ref(0)`

shallowRef(): ref的浅层作用形式。

reactive(): **仅限于对象类型（集合类型），替换和解包（非ref）会丢失响应性**, ref是将内部值包装在特殊对象，而reactive将使对象本身具有响应式。`const state = reactive({ count: 0 })`

shallowReactive(): rective()的浅层作用形式。

::: tip
ref和reactive简单的实现

```js
// 用于创建一个包装过的响应式对象。
function ref(val) {
  // ref 返回一个包含 value 属性的对象
  return {
    value: val
  };
}

// 用于创建一个基于 Proxy 的响应式对象。
function reactive(obj) {
  // 使用 Proxy 对象包裹目标对象
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 读取属性时返回响应式对象
      const value = Reflect.get(target, key, receiver);
      if (typeof value === 'object' && value !== null) {
        return reactive(value);
      }
      return value;
    },
    set(target, key, value, receiver) {
      // 设置属性时触发更新
      const result = Reflect.set(target, key, value, receiver);
      // 触发更新逻辑，比如通知界面重新渲染
      console.log('更新了：', key, value);
      return result;
    }
  });
}

// 示例
const nameRef = ref('zhangsan');
console.log(nameRef.value); // 输出: zhangsan

const user = reactive({
  name: 'lisi',
  age: 25
});

console.log(user.name); // 输出: lisi

user.age = 26; // 输出: 更新了： age 26

```

:::

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

一次性侦听器（3.4+）

```js
watch(source, (newValue, oldValue) => {
  // 仅执行一次
}, { once: true })

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

默认情况下，侦听器回调会在父组件更新 (如有) 之后、所属组件的 DOM 更新之前被调用。

如果想在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM，需要加`flush: 'post'`

```js
watch(source, callback, { flush: 'post' })
```

```js
watchEffect(source, callback, {flush: 'post'})
// 或者
import { watchPostEffect } from 'vue'
watchPostEffect(source, callback)
```

同步侦听器，能在vue进行任何更新之前触发

```js
watch(source, callback, {flush: sync})
```

```js
watchEffect(source, callback, {flush: sync})
watchSyncEffect(source, callback)
```

停止侦听器(只有异步回调时才需要)

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

#### 组件

定义属性

```html
<script setup>
defineProps(['title'])

defineProps({
  title: String,
})

</script>

// ts中可用使用类型标注
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

定义要抛出的事件

```html
<script setup>
defineEmits(['title'])
defineEmits({
  title: 
})

// 会返回一个函数给我们使用
const emit = defineEmits(['title', 'submit'])
emit('submit')

// ts中使用类型标注声明事件
const tsEmit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 事件校验
const validEmit = defineEmits({
  submit(payload) {
    // 通过返回值为 `true` 还是为 `false` 来判断
    // 验证是否通过
  }
})
</script>
```

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

`v-model`在组件上的使用默认使用的是`modelValue`为prop，`update:modelValue`为对应的事件，我们可以指定参数来更改名字

```html
<MyComponent v-model:title="bookTitle" />
```

通过指定参数与事件名的技巧，我们可以在单个实例上绑定多个`v-model`

```html
<MyComponent v-model:title="bookTitle" v-model:name="bookName"/>
```

```html
<script setup>
  defineProps({
    title: String,
    name: String
  })
  definedEmits(['update:title', 'update:name'])
</script>
<template>
  <template>
  <input
    type="text"
    :value="name"
    @input="$emit('update:name', $event.target.value)"
  />
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

defineModel(3.4+)

defineModel() 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用（替代了原来的props和emit）：

```js
const model = defineModel()
```

- 它的 .value 和父组件的 v-model 的值同步；
- 当它被子组件变更了，会触发父组件绑定的值一起更新。

```js
// 使 v-model 必填
const model = defineModel({ required: true })

// 提供一个默认值
const model = defineModel({ default: 0 })
```

#### 透传Attributes

在父组件中，给子组件的属性或者事件，如果没有声明props或者emits，则会透传到子组件的根元素上。

禁用透传（3.3+）

```js
defineOptions({
  inheritAttrs: false
})
```

可以在模板表达式中，直接使用$attrs，$attrs包含了声明props和emits之外的其他attribute（class、style、v-on等。）

- 和 props 有所不同，透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 foo-bar 这样的一个 attribute 需要通过 $attrs['foo-bar'] 来访问。

- 像 @click 这样的一个 v-on 事件监听器将在此对象下被暴露为一个函数 $attrs.onClick。

如果是多根节点，将不会透传，只能使用v-bind="$attrs"给某个节点

js中访问attr

```js
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

#### 依赖注入 Provide/Inject

```js
import { ref, provide } from 'vue'
const count = ref(0)
provide('key', count)
```

应用层提供依赖

```js
import { createApp } from 'vue'
const app = createApp({})
app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

注入

```js
import { inject } from 'vue'
const count = inject('key') // const.value -> 0
```

inject第二个参数是默认值，第三个参数是是否工厂函数，可以使用工厂函数来初始化，避免产生副作用或者额外的计算

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

如果想修改建议在provide的时候传一个方法

```js
provide('message', { message, updateMessage })
```

如果想确保不能被修改，可以加只读

```js
const message = ref('hello')
provide('message', readonly(message))
```

大型应用时，建议使用Symbol作为key

```js
const mySymbol = Symbol()
provide(mySymbol, {/* 数据 */})
```

### 异步组件

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`
```

ES模块导入也支持

```js
import { defineAsyncComponent } from 'vue'

const APage = defineAsyncComponent(() => {
  return import('./a.vue')
})
```

#### 组合式函数

```js
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

```js
// a.js
import { ref, onMounted, onUnmounted } from 'vue'
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return {x, y}
}
// b.vue
<script setup>
import { useMouse } from 'a.js'
const {x, y} = useMouse()
</script>
<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

toValue() 是一个在 3.3 版本中新增的 API。它的设计目的是将 ref 或 getter 规范化为值。如果参数是 ref，它会返回 ref 的值；如果参数是函数，它会调用函数并返回其返回值。否则，它会原样返回参数。它的工作方式类似于 unref()，但对函数有特殊处理。

#### TS扩展全局属性

```js
import axios from 'axios'
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

#### Suspense

`<Suspense> `是一个内置组件，用来在组件树中协调对异步依赖的处理。它让我们可以在组件树上层等待下层的多个嵌套异步依赖项解析完成，并可以在等待时渲染一个加载状态。

#### vue3性能优化

> https://cn.vuejs.org/guide/best-practices/performance.html

页面加载优化

1. 选用正确的架构
2. 包体积与 Tree-shaking 优化
3. 代码分割

更新优化

1. 更新稳定（props、v-once、v-memo）
2. 计算属性稳定性

通用优化

1. 大型虚拟列表（vue-virtual-scroller、vue-virtual-scroll-grid、vueuc/VVirtualList）
2. 减少大型不可变数据的响应性开销
3. 避免不必要的组件抽象

### Vue3优点总结

1. 性能优化：Vue3在性能方面进行了很多优化，包括更好的虚拟DOM渲染性能和更小的包大小
2. Composition API：Vue 3 引入了 Composition API，这是一种新的组织组件逻辑的方式。它使组件逻辑更容易组织、复用和测试。（Vue 2也支持了）
3. Teleport 组件： Vue 3 引入了 Teleport 组件，它允许你将组件的内容渲染到 DOM 中的任意位置，而不必依赖父组件的 DOM 结构。（比如模态框）
4. 全局 API 修改： Vue 3 将一些全局 API 进行了修改，以更好地支持 Tree-Shaking 和模块化。例如，Vue.directive 变成了 app.directive。
5. 多个根元素支持： 在 Vue 2 中，每个组件只能有一个根元素，而在 Vue 3 中，组件可以有多个根元素。
6. 响应式系统优化： Vue 3 对响应式系统进行了优化，提升了响应式数据的更新性能。
7. Fragments： Vue 3 引入了 Fragments，它允许你在不添加额外节点的情况下返回多个节点。
8. 更好的 TypeScript 支持： Vue 3 提供了更好的 TypeScript 支持，包括更准确的类型推断和类型定义。
9. 更强大的插槽： Vue 3 的插槽支持更强大的特性，如动态插槽名称和新的 `<template #xxx>` 语法。（可以单独渲染父组件和子组件）

### Vue的原理

#### 响应式原理

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

#### Vue3与Vue2源码层面分析

##### 实现双向绑定 Proxy 与 Object.defineProperty 相比优劣如何?

- `Object.definedProperty`的作用是劫持一个对象的属性，劫持属性的getter和setter方法，在对象的属性发生变化时进行特定的操作。而 Proxy劫持的是整个对象。
- `Proxy`会返回一个代理对象，我们只需要操作新对象即可，而Object.defineProperty只能遍历对象属性直接修改
- `Object.definedProperty`不支持数组，更准确的说是不支持数组的各种API，因为如果仅仅考虑`ary[i] = value` 这种情况，是可以劫持 的，但是这种劫持意义不大。而Proxy可以支持数组的各种API。
- 尽管`Object.defineProperty`有诸多缺陷，但是其兼容性要好于Proxy。

## React

### 描述UI

React组件

1. `export default function 组件名() {}` 组件名首字母大写
2. 组件中返回标签，标签看起来像是html，实际上是Javascript，这是JSX语法。
3. return的内容不在一行，需要放在一对括号中。
4. 组件在页面的顶层定义，不要嵌套

props展开语法

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

接收子组件 使用children

```js
function Avatar({children}) {
  return (
    <div>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <Avatar>
      这里可以是任何内容/组件
    </Avatar>
  )
}
```

JSX规则

- 只能返回一个根元素
- 标签必须闭合
- 驼峰语法给大部分属性命名（class是保留字，所以用className）

渲染列表时，为每个列表项展示多个节点（因为空节点没办法绑定key）,一个合适的 key 可以帮助 React 推断发生了什么，从而得以正确地更新 DOM 树。

```js
import { Fragment } from 'react';
const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

### 交互

父子组件传参

```js
function Button({ onClick, children}) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

function App() {
  function handlePlayClick() {
    alert(`正在播放！`);
  }
  return (
    <Button onClick={handlePlayClick}>
      <span>这是个按钮</span>
    </Button>
  )
}
```

结合useState

```js
import * as React from 'react'
function Button({ onClick, children}) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}


export default function Toolbar() {
  let [count, setCount ] = React.useState(0)
  function handlePlayClick() {
    alert(`播放次数+1！`);
    setCount(count + 1)
  }
  return (
    <Button onClick={handlePlayClick}>
      <span>播放次数： {count}</span>
    </Button>
  )
}
```

在 React 中所有事件都会传播，除了 onScroll，它仅适用于你附加到的 JSX 标签。（向上冒泡/传播）

事件后增加Capture，可以捕获所有子元素上的所有事件，即使他们禁止冒泡，如onClickCapture

```js
function Button({onClick, children}) {
  return (
    <button onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}>{children}</button>
  )
}
  
export default function App() {
  function onHandleClick() {
    alert('上层事件')
  }
  return (
    <div onClick={onHandleClick}>
      <Button onClick={() => alert('底层事件')}>这是一个按钮</Button>
    </div>
  )
}
```

阻止默认行为，比如onForm后刷新页面

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('提交表单！');
    }}>
      <input />
      <button>发送</button>
    </form>
  );
}
```

#### 更新函数

n => n + 1 被称为 更新函数。当你将它传递给一个 state 设置函数时：

- React 会将此函数加入队列，以便在事件处理函数中的所有其他代码运行后进行处理。
- 在下一次渲染期间，React 会遍历队列并给你更新之后的最终 state。

```js
// 原来的setNumber多次，每次state的值没有变化，结果是一样的，如果使用更新函数，可以在下一次渲染期间，遍历队列更新
const [number, setNumber] = useState(0)
// old
setNumber(n + 1)
setNumber(n + 1)
// new
setNumber(n => n + 1)
setNumber(n => n + 1)
```

#### state的状态队列原理

```js
function getFinalState(baseState, queue) {
  let finalState = baseState;
  // 如果是直接改的值，则会覆盖
  // 如果是队列，则会以之前的值基础上进行处理
  for (let item of queue) {
    if (typeof item === 'function') {
      finalState = item(finalState)
    } else {
      finalState = item
    }
  }
  return finalState;
}

getFinalState(0, [5, (n) => n + 1, 42]) // 42
```

#### 多层嵌套使用Immer

```js
import { useImmer } from 'use-immer';

function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }
}
```

#### 状态管理



## Angular
