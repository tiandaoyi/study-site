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

一个类只能构造出唯一实例

案例： 弹窗

```javascript
class Single {
  constructor(name) {
    this.name = name
  }

  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Single(name)
    }
    return this.instance
  }
}

const s1 = Single.getInstance('name1')
const s2 = Single.getInstance('name2')
console.log(s1 === s2) // true
```

### 2. 策略模式

根据不同参数命中不同的策略

案例：表单验证

### 3. 代理模式

代理对象和本体对象具有一致的接口

案例：图片预加载

### 4. 装饰者模式

在不改变对象自身的基础上，动态的给某个对象添加一些额外的职责

案例：在函数执行前后添加新的方法

### 5. 组合模式

组合模式（Composite Pattern）是一种结构型设计模式，它允许将对象组合成树形结构来表现“整体/部分”层次关系。组合模式使得客户端代码可以统一对待单个对象和对象组合，并且不需要知道对象组合的内部结构。

组合模式由以下两个角色组成：

1. Component（组件）：定义表示对象的通用接口，可以定义默认行为或属性，也可以定义管理子对象的方法。在组合中，所有对象都必须实现该接口。
2. Composite（复合对象）：表示对象组合，可以包含其他对象和复合对象，实现了 Component 接口中管理子对象的方法。

案例：DOM树、菜单导航、文件夹和文件系统、图形图像、数据结构（分类目录、评论回复）

```javascript
class Component {
  constructor(name) {
    this.name = name;
  }

  add(component) {}
  remove(component) {}
  display(depth) {
    console.log(Array(depth).join('-') + this.name);
  }
}

class Leaf extends Component {}

class Composite extends Component {
  constructor(name) {
    super(name);
    this.children = [];
  }

  add(component) {
    this.children.push(component);
  }

  remove(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  display(depth) {
    console.log(Array(depth).join('-') + this.name);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].display(depth + 2);
    }
  }
}

// 根节点
const root = new Composite('root');
root.add(new Leaf('leaf A'));
root.add(new Leaf('leaf B'));

// 分支节点
const comp = new Composite('composite X');
comp.add(new Leaf('leaf XA'));
comp.add(new Leaf('leaf XB'));

// 分支节点放到根节点上
root.add(comp);
root.add(new Leaf('leaf C'));

const leaf = new Leaf('leaf D');
root.add(leaf);
root.remove(leaf);

root.display(1);
```

### 6. 工厂模式

工厂模式是用来创建对象的一种最常用的设计模式。不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，这个函数就可以被视为一个工厂。

```javascript
function createPerson(name) {
  const o = new Object()
  o.name = name
  o.sayName = function() {
    console.log(this.name)
  }
  return o
}
```

### 7. 访问者模式

在不改变该对象的前提下访问其结构中的元素的新方法

案例：babel插件、组件库、编辑器

```javascript
class Visitor {
  visitConcreteElementA(element) {}
  visitConcreteElementB(element) {}
}

class Element {
  accept(visitor) {}
}

class ConcreteElementA extends Element {
  accept(visitor) {
    visitor.visitConcreteElementA(this);
  }

  operationA() {}
}

class ConcreteElementB extends Element {
  accept(visitor) {
    visitor.visitConcreteElementB(this);
  }

  operationB() {}
}

class ConcreteVisitor1 extends Visitor {
  visitConcreteElementA(element) {
    console.log('ConcreteVisitor1 visited ConcreteElementA');
  }

  visitConcreteElementB(element) {
    console.log('ConcreteVisitor1 visited ConcreteElementB');
  }
}

class ConcreteVisitor2 extends Visitor {
  visitConcreteElementA(element) {
    console.log('ConcreteVisitor2 visited ConcreteElementA');
  }

  visitConcreteElementB(element) {
    console.log('ConcreteVisitor2 visited ConcreteElementB');
  }
}

const elements = [new ConcreteElementA(), new ConcreteElementB()];
const visitors = [new ConcreteVisitor1(), new ConcreteVisitor2()];

for (let i = 0; i < elements.length; i++) {
  for (let j = 0; j < visitors.length; j++) {
    elements[i].accept(visitors[j]);
  }
}
```

上面的实例中，通过accept方法，可以将访问者对象传递给元素，并调用访问者方法来处理当前元素。

### 8. 发布订阅模式

订阅者订阅相关主题，发布者通过发布主题事件通知订阅该主题的对象。发布订阅模式中可以基于不同的主题去执行不同的自定义事件。

案例：EventBus, vue的$on、$emit

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event, listener) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(listener);
      if (index !== -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => {
        listener(...args);
      });
    }
  }
}

const emitter = new EventEmitter();

const listener1 = (arg1, arg2) => {
  console.log('listener1:', arg1, arg2);
};

const listener2 = (arg1, arg2) => {
  console.log('listener2:', arg1, arg2);
};

emitter.on('event', listener1);
emitter.on('event', listener2);

emitter.emit('event', 'hello', 'world'); // 输出：listener1: hello world，listener2: hello world

emitter.off('event', listener1);

emitter.emit('event', 'foo', 'bar'); // 输出：listener2: foo bar
```

### 9. 观察者模式

一个对象有一系列依赖于它的观察者(watcher)，当对象发生变化时，会通知观察者进行更新

案例：vue的双向绑定, redux的subscribe, nodejs的events

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(message) {
    this.observers.forEach((observer) => {
      observer.update(message);
    });
  }
}

class Observer {
  update(message) {
    console.log('Received message:', message);
  }
}

const subject = new Subject();

const observer1 = new Observer();
const observer2 = new Observer();

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notify('Hello world!'); // 输出：Received message: Hello world!

subject.removeObserver(observer1);

subject.notify('Goodbye world!'); // 输出：Received message: Goodbye world!
```

### 观察者模式与订阅模式的区别

1. 订阅发布模式中，发布者（主题）并不知道订阅者（观察者）的存在，而只有在事件发生时才向所有订阅者发布消息。而在观察者模式中，观察者需要注册到主题对象中，以便主题对象能够通知观察者。

2. 在订阅发布模式中，中间件通常充当了发布者和订阅者之间的桥梁，负责将事件广播给所有订阅者。而在观察者模式中，主题对象直接通知观察者，并不需要中间件的帮助。

3. 观察者模式采用了“拉”模型，即观察者从主题对象中获取数据；而订阅发布模式采用了“推”模型，即发布者将数据推送给订阅者。

### 其他设计模式

1. 外观模式(Facade Pattern)
2. 迭代器模式(Iterator Pattern)
3. 中介者模式(Mediator Pattern)

### js的编程范式

#### 构造函数模式

构造函数模式使用构造函数来创建对象，可以通过向构造函数中传递参数来对对象进行初始化。在构造函数内部，可以使用 this 关键字来代表当前对象。每次使用 new 关键字调用构造函数时，都会创建一个新的对象。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person1 = new Person('Alice', 25);
console.log(person1); // 输出：Person { name: 'Alice', age: 25 }
```

#### 原型模式

原型模式则是通过为构造函数添加原型属性和方法来创建对象。在 JavaScript 中，每个对象都有一个隐藏的 [[Prototype]] 属性，它指向该对象的原型。当我们访问某个对象的属性或方法时，如果该对象本身不存在该属性或方法，则会去它的原型对象中查找相应的属性或方法。

```javascript
function Person() {}

Person.prototype.name = 'Alice';
Person.prototype.age = 25;

const person1 = new Person();
console.log(person1.name); // 输出：'Alice'
console.log(person1.age); // 输出：25
```

## Web Worker

Web Worker 是 HTML5 提供的一项 JavaScript 多线程技术，它允许我们通过 JavaScript 创建多个线程，每个线程可以执行不同的任务，从而提高程序的运行效率。

### Web Worker应用

- 大量计算：Web Worker 可以用于执行大量计算密集型任务，例如数学计算、图像处理等。通过将这些任务放到后台线程中执行，可以避免阻塞主线程，提高页面的响应速度和性能。
- 数据处理：Web Worker 可以用于处理大量数据，例如数组操作、排序、搜索等。通过在后台线程中执行这些操作，可以减少对主线程的影响，使页面更加流畅。
- 消息传递：Web Worker 可以用于与主线程进行通信，例如向主线程发送消息或接收主线程发送的消息。这样可以实现异步加载数据、动态更新页面等功能。
- 实时应用：Web Worker 可以用于实时应用，例如游戏、聊天室等。通过在后台线程中执行逻辑，可以提高页面的响应速度和性能，并且可以让用户感受到更加流畅的交互。

### 使用

worker-loader

```javascript
npm install worker-loader
import Worker from "worker-loader!./worker";
const worker = new Worker();
worker.postMessage({ a: 1 });
worker.onmessage = function (event) {};
worker.addEventListener("message", function (event) {});
```

原生

```javascript
const worker = new WebWork('worker.js')
worker.addEventListener('message', () = ())
worker.postMessage('xx')
// worker.js
self.addEventListener('message', () => ())
self.postMessage('hello');
importScripts('xx.js') //可以加载js文件使用全局变量
```

## Service Worker

Service Worker 是一种浏览器 API，它允许我们在浏览器中运行一个独立的 JavaScript 线程，用于处理网络请求、缓存数据、离线化等任务。Service Worker 可以在网络正常时向服务器请求数据，并将响应结果缓存到本地，以便在离线或者网络不稳定时使用。

### Service Worker应用

1. 离线 Web 应用：Service Worker 可以帮助我们创建离线 Web 应用，即使在没有网络连接的情况下也可以继续使用应用程序。
2. 网络性能优化：Service Worker 可以将一些静态资源（例如 CSS、JS 文件）缓存到本地，并在后续访问时直接从本地缓存读取，从而提高页面加载速度和用户体验。
3. 推送通知：Service Worker 可以向用户发送推送通知，即使用户不打开应用程序也可以看到新的消息。
4. 后台同步：Service Worker 可以在后台执行定期同步操作，例如将用户数据上传到服务器。

离线缓存示例

```javascript
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('Service Worker 注册成功：', registration.scope);
    }, function(err) {
      console.log('Service Worker 注册失败：', err);
    });
  });
}

// 编写 Service Worker 脚本
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/image.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var responseToCache = response.clone();
        caches.open('v1').then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
```

## 异步

### 异步编程的方式

1. await/async
2. setTimeout/setInterval
3. promise
4. 事件监听
5. 发布订阅/观察者模式
6. 回调函数

### 宏任务与微任务

在任务队列中，微任务优先于宏任务被执行。

#### 宏任务

- setTimeout/setInterval (延迟队列)
- setImmediate() (延迟队列、Node.js特有)
- requestAnimationFrame() (浏览器特有)
- I/O操作
- UI渲染

#### 微任务

- Promise.then(), catch(), finally()
- Object.observe() / Proxy
- MutationObserver (DOM变化观察者)
- process.nextTick() (Node.js特有)

### eventloop

事件循环（Event Loop）是JavaScript中处理异步操作的机制，它使得JavaScript可以在没有阻塞的情况下执行长时间的操作。事件循环通过维护一个任务队列（task queue），并不断地从中取出任务进行执行来实现异步操作。

事件循环由以下几个部分组成：

1. 调用栈(Call Stack)：存储当前正在执行的代码。
2. 任务队列(Task Queue)：存储已经完成的异步任务和需要执行的回调函数。
3. 微任务队列(MicroTask Queue)：与任务队列类似，但是主要用于处理Promise等异步任务产生的微任务。
4. Event Loop：监控调用栈和任务队列，执行任务队列中的任务，并将微任务添加到微任务队列中。

当JavaScript引擎遇到异步操作时，例如setTimeout，它会将这个任务添加到任务队列中，然后立即返回并继续执行其他同步代码。一旦调用栈为空，事件循环就会检查任务队列，如果队列中有任务，它会将任务取出并放入调用栈中执行。如果任务队列中同时存在多个任务，它们会按照添加顺序依次执行。当所有任务执行完毕后，事件循环就会开始处理微任务队列中的任务，直到微任务队列为空为止。这个过程会不断重复，直到程序停止运行。

需要注意的是，事件循环中有两种不同类型的任务：宏任务(macrotasks)和微任务(microtasks)。在任务队列中添加的setTimeout、setInterval 等异步操作就属于宏任务，Promise.then() 等异步操作产生的回调函数则属于微任务。当一个宏任务执行完成后，事件循环会立即检查微任务队列中是否有任务，如果有则优先处理微任务队列中的任务，这就是为什么微任务比宏任务更快响应的原因。

## 事件

### 事件委托

把事件集中委托到上级或者父级触发

### 事件冒泡

在一个对象上触发某类事件，如果此对象绑定了事件，就会触发事件，如果没有，就会向这个对象的父级对象传播，最终父级对象触发了事件。

event.stopPropagation或者event.cancelBubble = true可以阻止事件冒泡。

## 沙箱(Sandbox)

让程序跑在一个隔离的环境下，不对外界的其他程序造成影响

### 场景

1. 执行JSONP请求时，为了防止JSONP请求中的回调函数污染全局环境，我们可以将回调函数放在一个沙箱中执行。
2. Vue模版表达式的计算运行在一个沙盒之中，在模版字符串中的表达式只能获取部分全局对象。

### 实现

proxy
  
```javascript
function createSandbox() {
  var sandbox = new Proxy({}, {
    set: function(target, key, value) {
      console.log('set', key, value);
      return true;
    },
    get: function(target, key) {
      console.log('get', key);
      if (key === 'console') {
        return console;   // 允许访问 console 对象
      } else {
        return undefined; // 禁止访问其他对象或变量
      }
    },
    has: function(target, key) {
      console.log('has', key);
      return false;       // 禁止查询对象属性
    }
  });
  
  sandbox.eval('console.log("Hello, world!")'); // 允许执行 eval 函数
  
  return sandbox;
}
```

iframe

```javascript
function createSandbox() {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  var win = iframe.contentWindow;
  var doc = iframe.contentDocument || win.document;
  
  // 向 iframe 中注入一些必要的 API 或对象
  win.console = console;

  // 向 iframe 中插入所需的 HTML、CSS 和 JS 代码
  doc.write('<html><head><title></title></head><body></body></html>');
  doc.close();
  
  // 在 iframe 中执行 JS 代码时使用严格模式，并禁止访问父页面的全局变量和函数
  var sandbox = win.eval.bind(win);
  sandbox('"use strict";' +
    'var global = this;' +          // 禁止访问父页面的全局变量和函数
    'console.log("Hello, world!");'
  );
  
  // 清理环境
  iframe.parentNode.removeChild(iframe);
}
```
