---
outline: deep
---

# Typescript

什么是 TypeScript？

- TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目。
- TypeScript 是一门静态类型、弱类型的语言。
- TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性。
- TypeScript 可以编译为 JavaScript，然后运行在浏览器、Node.js 等任何能运行 JavaScript 的环境中。
- TypeScript 拥有很多编译选项，类型检查的严格程度由你决定。
- TypeScript 可以和 JavaScript 共存，这意味着 JavaScript 项目能够渐进式的迁移到 TypeScript。
- TypeScript 增强了编辑器（IDE）的功能，提供了代码补全、接口提示、跳转到定义、代码重构等能力。
- TypeScript 拥有活跃的社区，大多数常用的第三方库都提供了类型声明。
- TypeScript 与标准同步发展，符合最新的 ECMAScript 标准（stage 3）。

## 基础

### 原始数据类型

1. 布尔
2. 数值
3. 字符串
4. 空值(void)：可以用void表示没有任何返回值的函数。声明变量，只能将它赋值为 undefined 和 null。`let unusable: void = undefined;`
5. Null和Undefined

### 任意值

- 任意值（Any）用来表示允许赋值为任意类型。
- 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型

### 类型推论

如果没有明确的指定类型，那么Typescript会依照类型推论的规则推断出一个类型

```typescript
let name = 'seven'
name = 7
// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查。

### 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。

```typescript
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

```typescript
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错

// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```

### 对象的类型 -- 接口

使用接口（Interfaces）来定义对象的类型。

```typescript
interface Person {
  readonly id: number; // 只读属性，创建对象时，需要赋值，后续不可更改
  name: string;
  age?: number; // 可选属性
  [propName: string]: any; // 任意属性
}

let tom: Person = {
  id: 89757,
  name: 'Tom',
  gender: 'male'
};
```

### 数组的类型

- 「类型 + 方括号」表示法: `const arr: number[] = [1,2,3]`
- 「数组泛型」表示法: `const arr: Array<number> = [1,2,3]`
- 「接口数组」表示法(不推荐):

```typescript
interface NumberArray {
  [index: number]: number;
}
const arr: NumberArray = [1,2,3]
```

- any在数组中的应用`const arr: any[] = ['1', 1, true]`

### 函数的类型

```typescript
// 函数声明
function sum (x: number, y: number): number {
  return x + y
}

// 函数表达式
const sum = function (x: number, y: number): number {
  return x + y
}

// 手动给sum添加类型
const sum: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y
}

// 接口定义函数的形状
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(source: string, subString: string) {
  return source.search(subString) !== -1;
}
```

可选参数必须在必填参数后面

```typescript
function buildName(firstName: string, lastName?: string) {
  return lastName ? firstName + lastName : firstName
}
```

默认参数值：TypeScript会将添加了默认值的参数识别为可选参数(不受「可选参数必须接在必需参数后面」的限制)

```typescript
function buildName(firstName: string, lastName: string = 'world') {
  return lastName ? firstName + lastName : firstName
}
```

剩余参数: 我们可以用数组的类型来定义，并且rest只能是最后一个参数

```typscript
function push(array: any[], ...items: any[]) {
  items.forEach(function(item) {
    array.push(item);
  });
}
```

重载

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}
```

### 类型断言

语法: `值 as 类型`或`<类型>值`

```typescript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function isFish(animal: Cat | Fish) {
  // 只有Fish才有swim方法，所以在这里使用类型断言
  if (typeof (animal as Fish).swim === 'function') {
    return true;
  }
  return false;
}
```

父类可以断言子类：将一个父类断言为更加具体的子类

```typescript
class ApiError extends Error {
  code: number = 0;
}
class HttpError extends Error {
  statusCode: number = 200;
}

function isApiError(error: Error) {
  // 也可以用instanceof， 如error instanceof ApiError
  if (typeof (error as ApiError).code === 'number') {
    return true;
  }
  return false;
}
```

将一个变量断言为any是解决类型问题的最后一个手段，如果不是非常确定，不要使用as any。

既然子类拥有父类的属性和方法，那么被断言为父类，获取父类的属性、调用父类的方法，就不会有任何问题，故「子类可以被断言为父类」

```typescript
interface Animal {
  name: string;
}

interface Cat extends Animal {
  run(): void;
}

function testAnimal(animal: Animal): Cat | null {
  if (animal instanceof Cat) {
    return animal;
  }
  return null;
}

function testCat(cat: Cat) {
  return (cat as Animal);
}
```

除非万不得已，不要使用双重断言，可能会导致运行时错误。

```typescript
interface Cat {
  run(): void;
}
interface Fish {
  swim(): void;
}

function testCat(cat: Cat) {
  return (cat as any as Fish);
}
```

类型声明比类型断言更加严格，优先使用类型声明

```typescript
interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}
const animal: Animal = {
  name: 'tom'
};

const tom = getCacheData('tom') as Cat; // animal 断言为 Cat，只需要满足 Animal 兼容 Cat 或 Cat 兼容 Animal 即可
// 等价于
const tom: Cat = getCacheData('tom'); // animal 赋值给 tom，需要满足 Cat 兼容 Animal 才行
```

通过给函数增加泛型，可以更加规范的对返回值进行约束。

```typescript
function getCacheData<T>(key: string): T {
  return (window as any).cache[key];
}

interface Cat {
  name: string;
  run(): void;
}

const tom = getCacheData<Cat>('tom');
tom.run();
```

### 声明文件

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

#### 声明语法

- `declare var` 声明全局变量
- `declare function` 声明全局方法
- `declare class` 声明全局类
- `declare enum` 声明全局枚举类型
- `declare namespace` 声明（含有子属性的）全局对象
- `interface 和 type` 声明全局类型
- `export` 导出变量
- `export namespace` 导出（含有子属性的）对象
- `export default` ES6 默认导出
- `export =` commonjs 导出模块
- `export as namespace` UMD 库声明全局变量
- `declare global` 扩展全局变量
- `declare module` 扩展模块
- `/// <reference />` 三斜线指令

#### 声明语句

使用declare定义全局变量jquery的类型。（仅用于编译时的检查，在编译结果中会被删除。）

```typescript
// 函数声明
declare const jQuery: (selector: string) => any; 
// 函数表达式
declare function jQuery(selector: string): any;
```

#### 什么是声明文件

通常我们会把声明语句放到一个单独的文件（jQuery.d.ts）中(`// src/jQuery.d.ts`)

也有第三方声明文件(`npm install @types/jquery --save-dev`)，可以在`https://microsoft.github.io/TypeSearch/`中查询

#### 书写声明文件

class语句只能定义类型，不能用来定义具体的实现

```typescript
// src/Animal.d.ts

declare class Animal {
  name: string;
  constructor(name: string);
  sayHi(): string;
}
```

防止命名冲突

```typescript
// src/jQuery.d.ts
declare namespace jQuery {
  interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any;
  }
  function ajax(url: string, settings?: AjaxSettings): void;
}

// src/index.ts
let settings: jQuery.AjaxSettings = {
  method: 'POST',
  data: {
    name: 'foo'
  }
};
jQuery.ajax('/api/post_something', settings);
```

声明合并

```typescript
// src/jQuery.d.ts
declare function jQuery(selector: string): any;
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
}
```

扩展全局变量

```typescript
// 给string扩展属性或方法。
interface String {
  prependHello(): string;
}
'foo'.prependHello();
```

三斜线指令

1. 需要引入另外一个库的类型，会使用到
2. types 用于声明对另一个库的依赖，而 path 用于声明对另一个文件的依赖。

```typescript
// types/jquery-plugin/index.d.ts
/// <reference types="jquery" />
/// <reference path="legacy.d.ts" />
declare function foo(options: JQuery.AjaxSettings): string;
```

自动生成声明文件

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "lib",
    "declaration": true,
  }
}
```

### 类型别名

类型别名用来给一个类型起个新名字。

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n;
  } else {
    return n();
  }
}
```

### 元组(Tuple)

元组（Tuple）合并了不同类型的对象。

越界会报错

```typescript
let tom: [string, number];
tom = ['Tom', 25];
tom.push('male');
tom.push(true);
// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

### 枚举(Enum)

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

```typescript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true

// 有点像
const days = {
  0: 'Sum',
  1: 'Mon',
  Sum: 0,
  Mon: 1
  // ...
}
```

也可以手动赋值，如果与原来的默认值重复，会被覆盖

```typescript
enum Days {
  Sun = 100, Mon = 10, Tue = 5, Wed, Thu, Fri, Sat
};

// 编译结果
var Days;
(function (Days) {
  Days[Days["Sun"] = 100] = "Sun";
  Days[Days["Mon"] = 10] = "Mon";
  Days[Days["Tue"] = 5] = "Tue";
  Days[Days["Wed"] = 6] = "Wed";
  Days[Days["Thu"] = 7] = "Thu";
  Days[Days["Fri"] = 8] = "Fri";
  Days[Days["Sat"] = 9] = "Sat";
})(Days || (Days = {}));
```

枚举项可以不是数字，需要加断言（定义非数字的值难以维护，不推荐）

```typescript
enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};
```

可以小数或者负数，步长仍为1

```typescript
enum Days {Sun = -3, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Mon"] === -2); // true
```

计算所得项后面不可有手动赋值的

```typescript
enum Color {Red = "red".length, Green, Blue};

// index.ts(1,33): error TS1061: Enum member must have initializer.
```

#### 常数枚举

使用 const enum 可以在编译时进行优化，减少生成的 JavaScript 代码量，并且无法在运行时访问枚举成员的名称（不能包含计算成员，如`Red = "red".length`）；

```typescript
const enum Directions {
  Up,
  Down,
  Left,
  Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
// 编译结果
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

而使用普通的 enum 则会在编译后生成一个实际存在的对象，允许在运行时通过枚举成员的名称进行访问。

```typescript
enum Directions {
  Up,
  Down,
  Left,
  Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];

// 编译结果
var Directions;
(function (Directions) {
  Directions[Directions["Up"] = 0] = "Up";
  Directions[Directions["Down"] = 1] = "Down";
  Directions[Directions["Left"] = 2] = "Left";
  Directions[Directions["Right"] = 3] = "Right";
})(Directions || (Directions = {}));

var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

### Typescript中类的用法

三种访问修饰符

- public，公有（默认）。
- private，不能载声明它的类的外部访问。
- protected，与private类似，区别是子类中可以访问。

修饰符和readonly，还可以在构造函数参数中，等同于类中定义该属性同时赋值。

```typescript
class Animal {
  // public name: string;
  public constructor (public readonly name) {
    // this.name = name
  }
}
```

抽象类（abstract）

用于定义抽象类和其中的抽象方法，抽象类不允许被实例化，抽象方法必须被子类实现。

```typescript
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  // 抽象方法
  public abstract sayHi();
}

let a = new Animal('Jack');

// index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
```

```typescript
class Cat extends Animal {
  public sayHi() {
    console.log('hi,', this.name)
  }
} 
const cat = new Cat('Tom') // hi, Tom
```

### 类与接口（implements）

把多个类的特性提取出来，这个特性就是接口。

```typescript
interface Alarm {
  alert(): void;
}

interface Light {
  lightOn(): void;
  lightOff(): void;
}

class Door {}

// 防盗门是门的子类，实现了报警器（Alarm）接口，使用报警方法。
class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log('SecurityDoor alert')
  }
}

// 汽车实现了报警器，车灯接口。
class Car implements Alarm, Light {
  alert() {
    console.log('Car alert');
  }
  lightOn() {
    console.log('Car light on');
  }
  lightOff() {
    console.log('Car light off');
  }
}
```

接口可以继承接口，也可以继承类（Typescript）。

### 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```typescript
// 预期传入的value类型和是返回的类型列表形式
function createArray<T>(length: number, value: T): Array<T> {
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

// 也可以不指定string，会类型推断。
createArray<string>(3, 'x') // ['x','x','x']

// 多个类型参数

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

泛型约束

在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法。
我们可以对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量。这就是泛型约束。

```typescript
interface Lengthwise {
  length: number;
}

// 如果T没有继承LengthWidth，则使用arg.length会报错。
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

泛型接口

```typescript
interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>;
}
let createArray: CreateArrayFunc
```

进一步可以把泛型参数提前到接口名上，注意，此时在使用泛型接口的时候，需要定义泛型的类型。

```typescript
interface CreateArrayFunc<T> {
  (length: number, value: T): Array<T>;
}
let createArray: CreateArrayFunc<any>;
```

泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

泛型参数的默认类型(2.3版本以后)

```typescript
function createArray<T = string>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
```

### 声明合并

重载定义多个函数类型

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}
```

接口合并，类型不一致会报错

```typescript
interface Alarm {
  price: number;
}
interface Alarm {
  weight: number;
}
// 相当于
interface Alarm {
  price: number;
  weight: number;
}
```

类的合并与接口的合并规则一致。

