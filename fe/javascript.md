---
outline: deep
---

# javascript

## Type/类型

### 基本类型/原始类型

`null,undefined,boolean,string,number,symbol`

### 引用类型

`Object,Array,Function,Data,ExpReg,Error,Math,Date,Set,Map`

### 操作符

#### 相等操作符

- 三等两等区别：=== 仅比较不转换， == 先转换再比较（不比较类型）

#### typeof

1. 基本类型除了null都会显示正确的值, es6有symbol, es10有bigint
2. 引用类型除了function都会显示object(包括Array,Date,RegExp,Set等)

#### instanceof

- 基于原型链的查询，只要处于原型链中，永远为true
- 通俗的讲是判断该对象是谁的实例

#### 数值转换

##### 对象转原始类型步骤

调用ToPrimitive, valueOf, toString

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

Proxy 代理是一种在对象和函数调用等操作前进行拦截和自定义行为的机制。它可以对对象的属性访问、修改、删除等操作进行拦截和处理，从而可以实现很多有用的功能。

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

## 闭包

闭包是指有权访问另外一个函数作用域中的变量的函数，当函数可以记住并访问所在的词法作用域时，就产生了闭包

```javascript
function f2() {
  var a = 1
  return function f3() {
    a ++;
    return a
  }
}
f2()()
```

### 表现形式

1. 返回一个函数
2. 作为函数参数传递
3. 在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。
4. IIFE(立即执行函数表达式)创建闭包, 保存了全局作用域window和当前函数的作用域，因此可以全局的变量。

### 用途

1. 能够访问函数定义时所在的词法作用域
2. 私有化变量
3. 模拟块级作用域
4. 创建模块

### 缺点

会导致函数的变量一直保存在内存中，过多的闭包可能会导致内存泄漏

## 作用域/作用域链

### 作用域链

访问一个变量，解释器首先在作用域中查找标识符，如果当前作用域没有找到，就会一层一层向父级寻找，直到找到变量的标识符或者不在父作用域中，这样由多个执行上下文的变量对象组成的链表就叫做作用域链

### 作用域

作用域也叫执行上下文，分为全局、函数、快级上下文(ES6)，代码执行流每进入一个新的上下文，都会创建一个作用域，用于搜索变量和函数，变量执行上下文用于确定什么时候释放内存。

作用域最大的用处是隔离变量，不同作用域下同名变量不会有冲突。

## this

this对象是执行上下文中的一个属性，它指向最后一次调用这个方法的对象，在全局函数中，this等于window，而当函数被作为某个对象调用时，this等于那个对象。

### 显式绑定

- bind
- apply
- call

### 隐式绑定

- 全局绑定，默认指向window，严格模式下指向undefined
- 直接调用函数，this指向调用的上下文
- 对象方法调用，this指向调用的对象
- 构造函数调用，this指向实例对象

### 绑定优先级

构造函数 > 显示绑定 > 对象方法调用 > 直接调用

## 执行上下文

执行上下文（Execution Context）是 JavaScript 中一个抽象的概念，用于描述 JavaScript 代码被解析和执行时的环境。

### 生命周期

1. 创建阶段：生成变量对象、建立作用域链、确定this的指向
2. 执行阶段：变量赋值、函数引用、执行其他代码

### 执行栈（先进后出）

1. js引擎第一次遇到js脚本，创建全局上下文并压入当前栈
2. 每当遇到函数调用，为该函数创建一个新的执行上下文并压入栈的顶部
3. 当函数执行结束，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文
4. 所以代码执行完毕，js引擎从当前栈中移除全局执行上下文

## 原型/原型链

![yuanxing](/images/yuanxing.png "yuanxing")

### 原型链

当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，也就是原型链的概念。

原型链的尽头一般来说都是Object.prototype，所以这就是我们新建的对象为什么能够使用toString()等方法的原因。

### 特点

javascript对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变。

### 判断是否为原型属性

- 对象的hasOwnProperty()来检查对象自身中是否含有该属性
- 使用in检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回true
- 所以我们经常用in循环，再结合hasOwnProperty()来判断是否为原型属性

### 原型对象与构造函数关系

- 每定义一个函数数据类型，都会天生自带一个prototype属性，这个属性指向函数的原型对象
- 当函数通过new调用，这个函数就成为了构造函数，返回一个全新的实例对象，这个实例对象有一个__proto__属性，指向构造函数的原型对象

### 三个概念

#### __proto__(Object.getPrototypeOf())

仅对象(f1,o1,Function.prototype, Object.prototype, Foo.prototype)才有这个属性，指向创建该对象的构造函数的原型

```javascript
// 例子
var o1 = {}
o1.__proto__ === Object.prototype // true
Object.getPrototypeOf(o1) === Object.prototype // true
```

#### prototype

仅函数(Foo, Object, Function)有这个属性，该属性指向原型

#### constructor

属性返回Object的构造函数(用于创建实例对象的函数)

## OOP

### 类

#### 类声明

`newClass class {}`

#### 类表达式

`var newClass = class {}`

#### 与ES5中使用构造函数和原型来实现面向对象编程的区别

1. 声明方式：ES6 中使用 class 关键字来声明类，而 ES5 中使用函数来模拟类。
2. 继承方式：ES6 中使用 extends 和 super 来实现继承，而 ES5 则需要通过 Object.create() 或者手动将一个对象指定为另一个对象的原型来实现。
3. 类方法：ES6 中可以直接在类中定义方法，而 ES5 中方法需要定义在原型上。
4. 构造函数：ES6 中可以在类中定义构造函数，而不需要像 ES5 中那样手动设置实例属性。
5. 访问控制：ES6 中没有提供访问控制关键字（如 public、private 等），但是可以通过 Symbol 来实现一定程度上的私有属性。
6. 静态方法：ES6 中可以使用 static 关键字来定义静态方法，而 ES5 中无法直接定义静态方法，需要将其定义在构造函数上或者手动将其添加到构造函数的 prototype 上。
7. 限制性：ES6 中的 class 语法虽然提供了方便的方法定义和继承语法，但是不能像传统的基于原型的继承一样灵活和自由，不能动态修改类定义、方法或属性，也不能动态地修改继承关系等。

### 继承

#### ES5如何实现继承

```javascript
// 寄生组合继承(call, Object.create, prototype.constructor)
function Animal(name) {
  this.name = name
}
Animal.prototype.say = function() {
  console.log('say')
}
function Dog(name) {
  Animal.call(this, name)
}
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog
Dog.prototype.bark = function() {
  console.log('bark')
}
```

## 设计模式

设计模式是从许多优秀的软件系统中，总结出的成功的、能够实现可维护性、复用的设计方案，使用这些方案将可以让我们避免做一些重复性的工作。

### 1. 单例模式

```javascript
console.log(1)
```

#### 案例： 弹窗

### 2. 策略模式

```javascript
console.log(1)
```

### 案例： 表单验证
