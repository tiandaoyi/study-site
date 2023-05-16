---
outline: deep
---

# Type/类型

## 基本类型/原始类型

`null,undefined,boolean,string,number,symbol`

## 引用类型

`Object,Array,Function,Data,ExpReg,Error,Math,Date,Set,Map`

## 操作符

### 相等操作符

- 三等两等区别：=== 仅比较不转换， == 先转换再比较（不比较类型）

### typeof

1. 基本类型除了null都会显示正确的值, es6有symbol, es10有bigint
2. 引用类型除了function都会显示object(包括Array,Date,RegExp,Set等)

### instanceof

- 基于原型链的查询，只要处于原型链中，永远为true
- 通俗的讲是判断该对象是谁的实例

### 数值转换

对象转原始类型步骤：调用ToPrimitive, valueOf, toString

## Object/Array

### Object的常用方法

- Object.defineProperty(obj, key, descriptor) 定义属性
- Object.keys(obj) 返回可枚举属性
- Object.assign(target, source) 合并对象/浅拷贝
- Object.create(proto, [propertiesObject]) 创建对象
- Object.is(value1, value2) 判断两个值是否相等
- Object.getPrototypeOf(obj) 获取实例的原型对象
- Object.prototype.hasOwnProperty(key) 判断是否为自身属性
- Object.prototype.isPrototypeOf(obj) 判断是否为原型链上的属性
- Object.prototype.toString.call(obj) 判断对象类型

### Array的常用方法

- Array.isArray(obj) 判断是否为数组
- Array.from(obj) 类数组转数组
- Array.of(1,2,3) 创建数组

## ES6

### 类（继承）

- `class XClass extends YClass`

### 模块化

- 导入 `import X from './x.js'`
- 导出 `export default X`

### 箭头函数

- 写法简洁
- 没有arguments
- 没有原型prototype
- 不能通过new关键字使用(不能作为构造函数)
- 没有自己的this，会从自己的作用域上一层继承this
- call, apply, bind无法改变箭头函数中的this指向
- 不能用做Generator函数，不能使用yield关键字

### Promise

#### 方法

- Promise.all 全部成功才成功
- Promise.allSettled 全部执行完才执行
- Promise.race 竞争，谁完成用谁
- Promise.any 竞争，谁成功用谁

### Set/Map

#### Set

1. 成员不能重复
2. 只有键值没有键名，有点类似数组
3. 可以遍历，方法有`add, delete, has`

#### WeakSet

1. 成员都是对象
2. 成员都是弱引用，随时可以消失，可以用来保存DOM节点，不容易造成内存泄露

#### Map

1. 本质是建值对的集合，类似集合
2. 可以遍历，方法很多，可以跟各种数据格式转换

#### WeakMap

1. 接收对象作为键名(null除外)，不接收其他类型的值作为键名
2. 键名所指向的对象，不计入垃圾回收机制
3. 不能遍历，方法同`get, set, has, delete`

### Symbol

表示独一无二的值，用来定义对象的唯一属性名

- 它的功能类似于一种标识唯一性的ID，每个Symbol值都是唯一的
- Symbol类型的key是不能通过Object.keys()或者for...in来枚举的，但是可以通过`Object.getOwnPropertySymbols()`来获取
- 它未被包含在对象自身的属性名集合(property names)之中
- 我们可以把一些不需要对外操作和访问的属性使用Symbol来定义

### 代理

Proxy 代理是一种在对象和函数调用等操作前进行拦截和自定义行为的机制。它可以对对象的属性访问、修改、删除等操作进行拦截和处理，从而可以实现很多游泳的功能。

#### 属性代理

通过代理可以拦截对象的属性访问，可以实现一些自定义的行为，例如，可以代理实现访问为定义的属性时，返回默认值

```javascript
const obj = { name: 'John', age: 30 }

// 创建一个 Proxy 对象
const proxyObj = new Proxy(obj, {
  // 在 get 方法中，如果属性不存在，则返回默认值
  get(target, prop) {
    return target[prop] || 'default value'
  }
})

console.log(proxyObj.name) // 输出 "John"
console.log(proxyObj.city) // 输出 "default value"

```

#### 函数调用代理

通过代理可以拦截函数调用，并在调用前或调用后进行一些操作，例如，可以用代理实现函数的缓存避免重复计算

```javascript
const calculate = (a,b) => {
  console.log('Calculating...')
  return a + b
}

const proxyCalculate = new Proxy(getTotal, {
  cache: {},
  apply(target, thisArg, args) {
    const key = args.join(',')
    if (this.cache[key]) {
      console.log('Cached result found')
      return this.cache[key]
    } else {
      console.log('Calculating and caching result')
      const result = target.apply(thisArg, args)
      this.cache[key] = result
      return result
    }
  }
})

console.log(proxyCalculate(1, 2)) // 输出 "Calculating... Calculating and caching result 3"
console.log(proxyCalculate(1, 2)) // 输出 "Cached result found 3"
console.log(proxyCalculate(3, 4)) // 输出 "Calculating... Calculating and caching result 7"
console.log(proxyCalculate(3, 4)) // 输出 "Cached result found 7"
```

#### 拦截器代理

通过代理可以拦截对象的操作，例如，可以用代理实现一个只读对象，禁止对对象进行修改

```javascript
// 创建一个普通的对象
const obj = { name: 'John', age: 30 }

// 创建一个代理对象
const readOnlyObj = new Proxy(obj, {
  // 在 set 方法中，禁止修改属性值
  set(target, prop, value) {
    console.warn(`Property ${prop} is read-only`)
    return true
  },

  // 在 deleteProperty 方法中，禁止删除属性
  deleteProperty(target, prop) {
    console.warn(`Property ${prop} can't be deleted`)
    return true
  }
})

console.log(readOnlyObj.name) // 输出 "John"
readOnlyObj.age = 40 // 输出 "Property age is read-only"
console.log(readOnlyObj.age) // 输出 "30"
delete readOnlyObj.name // 输出 "Property name can't be deleted"
console.log(readOnlyObj.name) // 输出 "John"
```
