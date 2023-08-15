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




