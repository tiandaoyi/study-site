# css

## 概念

### 权重

- style行内样式：1000
- id：100
- 属性选择器/class/伪类：10
- 标签选择器/伪元素：1

### 盒模型

- content-box：默认值，width/height只包含内容，不包含padding/border
- border-box：width/height包含内容、padding、border

### BFC

BFC是Block Formatting Context的缩写，即块格式化上下文。BFC是CSS布局的一个概念，是一个环境，里面的元素不会影响外面的元素。

布局规则：Box是CSS布局的对象和基本单位，页面是由若干个Box组成的。元素的类型和display属性，决定了这个Box的类型。不同类型的Box会参与不同的Formatting Context。

#### 创建BFC的4种方式

1. float属性不为none
2. position为absolute或fixed
3. display为inline-block、table-cell、table-caption、flex、inline-flex
4. overflow不为visible

#### 应用

1. 防止margin重叠
2. 清除浮动
3. 自适应多栏布局
4. 防止文字环绕

### 选择器

css选择器有很多种，但是在实际开发中，我们常用的选择器有以下几种：

1. 标签选择器
2. 类选择器
3. id选择器
4. 通配符选择器
5. 后代选择器
6. 子代选择器
7. 相邻兄弟选择器
8. 属性选择器
9. 伪类选择器
10. 伪元素选择器

#### 伪类选择器和伪元素选择器区别

1. 伪类选择器用一个冒号(:)表示，伪元素选择器用两个冒号(::)表示
2. 伪类选择器一般用于描述元素的一些特殊状态，比如:hover、:active等，而伪元素选择器一般用于创建一些不在文档树中的元素，并为其添加一些样式，比如::before、::after等
3. 伪类选择器一般放在选择器的最后，而伪元素选择器一般放在选择器的最前面
4. 伪类选择器可以和普通选择器连用，而伪元素选择器不能和普通选择器连用

### link style 和 @import 区别

#### 加载顺序的区别

- link 标签是在页面加载的同时加载的
- @import 是在页面加载完毕之后加载的
- 有时浏览器会出现闪屏现象，就是因为@import 导致的

#### 加载内容的区别

- link 可以加载任何文件，@import 只能加载 css 文件
- link 可以通过 rel="alternate stylesheet" 指定候选样式
- link 可以通过 JavaScript 操作 DOM 去改变样式，而@import 不行

### CSS硬件加速

css3 硬件加速又叫GPU加速，是利用GPU进行渲染，减少CPU操作的一种优化方案，可以提升网页的性能。

#### 开启加速的属性有

- transform
- opacity
- filter
- will-change

#### 弊端

- GPU处理过多的内容会导致内存问题
- 不在动画结束的时候关闭硬件加速，会出现字体模糊

## 常用css属性

### flex

CSS Flexbox（布局模块）是 CSS3 中新增的一种布局方式，用于实现弹性盒子（Flex Box）的布局。它可以让开发者更加方便、灵活地控制页面元素的排列和分布等。

#### flex 默认方向

row（竖着）

#### flex:1 默认值

`flex:1` = `flex: 1 1 0%`

- flex-grow: 表示该项目可以根据剩余空间自动伸展
- flex-shrink: 表示该项目在空间不足时可以缩小
- flex-basis: 表示该项目的初始尺寸为 0

### filter

filter 属性是一种用于对元素图像进行处理的 CSS 属性，它可以通过一系列内置或自定义的滤镜函数来实现各种特效。filter 属性可以作用于所有的 HTML 元素，包括图像、视频和文本等。

CSS3 filter 属性支持多个滤镜函数的组合，常见的滤镜函数有：

- blur()：模糊图像；
- brightness()：调整图像亮度；
- contrast()：调整图像对比度；
- grayscale()：将图像转换为灰度图像；
- hue-rotate()：对图像进行色相旋转；
- invert()：将图像反转；
- opacity()：调整元素的不透明度；
- saturate()：调整图像饱和度；
- sepia()：将图像转换为深褐色；
- drop-shadow()：为元素添加阴影效果。

模糊和灰度效果

```css
filter: blur(5px) grayscale(0.5);
```

## CSS动画

### transform

静态属性，直接写在style中，主要用途是来做元素的特殊变形

- translateZ(0) gpu优化，开启硬件加速，优化前端性能
- translate3d(x,y,z) 3d变形，控制元素在页面上的三轴的位置
- scale3d(x,y,z) 3d缩放
- rotate(Xdeg) 旋转

### transition

过渡动画，用于控制元素从一个状态到另一个状态的变化

transition: 属性名 过渡时间 过渡方式 延迟时间

以下是一个使用 transition 属性实现 hover 效果的示例：

```css
button {
  background-color: blue;
  color: white;
  transition: background-color 0.5s ease-out;
}

button:hover {
  background-color: red;
}
```

### animation

transition属性的扩展，包含keyframes

animation: 动画名称 动画时间 动画方式 延迟时间 动画次数 动画方向 动画填充模式 动画播放状态

```css
.box {
  width: 100px;
  height: 100px;
  background-color: blue;
  position: relative;
  animation-name: move;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes move {
  from {
    left: 0;
  }
  to {
    left: calc(100% - 100px);
  }
}
```

## BEM规范

BEM 是块（block）、元素（element）、修饰符（modifier）的缩写，是一种前端 CSS 命名规范。

块和元素使用两个连字符（--）连接，块或元素与修饰符使用一个连字符（-）连接，例如：block-name、block-name--modifier-name、block-name__element-name。

1. 块（block）：独立的、可复用的页面组件，例如：header、container、menu、checkbox、input 等。
2. 元素（element）：块的组成部分，不能够被复用，例如：header 的 title、container 的 item、menu 的 item、checkbox 的 caption、input 的 addon 等。
3. 修饰符（modifier）：块或元素的属性，例如：header 的 theme、container 的 size、menu 的 direction、checkbox 的 checked、input 的 disabled 等。

### 优点

BEM 命名规范具有很强的可读性，可以让开发者快速理解页面结构，从而提高开发效率。

### 缺点

BEM 命名规范会导致 HTML 和 CSS 冗余，增加了代码量，降低了开发效率。

### 适用场景

BEM 命名规范适用于大型项目，特别是多人协作的项目。

## rem

CSS rem（即 root em）是一种相对单位，它以根元素的字体大小为基准进行计算。在 HTML 中，根元素通常指的是 `<html>` 标签，因此如果将根元素的字体大小设置为 16px，则 1rem 等于 16px。

### rem优点

- 在响应式布局中更加灵活：由于 rem 单位是相对于根元素的字体大小计算的，所以可以方便地实现响应式布局。
- 可以避免多层级嵌套时字体大小出现混乱的情况：使用 em 单位进行字体大小设置时，如果多个元素出现了嵌套，会导致字体大小出现累加的情况，而使用 rem 单位可以避免这种情况。

### rem库

px2rem: 将css中px编译伪rem，配合js根据不同的dpr，修改meta的viewport值和html的font-size

## css流行库

### UI框架

- Bootstrap: 一款 UI 框架，它提供了一套完整的样式库，可以通过类名来实现样式的复用。
- normalize.css: 一款 CSS 重置库，它可以帮助我们在不同的浏览器中实现一致的效果。

### 预处理器

- stylus
- less
- sass

#### scss和less的区别

- less使用@, scss使用$
- scss支持查询if else, less不支持
- sass基于ruby，是在服务器端处理的，less需要引入less.js
- less支持js表达式，sass不支持

### Utility-first CSS 框架

通过类名来实现样式的复用，类名的命名规则通常是使用单个字母或单词的缩写，例如：.w-100、.d-flex、.text-center 等。

- atom.css
- Atomic CSS
- Windi CSS
- unocss
- tailwindcss

## 布局

### 水平垂直居中方式

- flex布局
- grid布局
- 绝对定位
- table布局
- transform

### 响应式布局

- 媒体查询
- rem
- vw/vh
- 百分比
- flex
- grid

## css实现主题切换

### 1. link动态改变ref引入的css文件，实现主题切换

```html
<link rel="stylesheet" href="./index.css" id="theme">
```

```js
const theme = document.getElementById('theme');
theme.href = './index2.css';
```

### 2. class类名切换

```css
body {
  background-color: #fff;
}

body.dark {
  background-color: #000;
}
```

```js
const body = document.body;
body.classList.add('dark');
```

### 3. css变量

```css
body {
  --bg-color: #fff;
  background-color: var(--bg-color);
}

body.dark {
  --bg-color: #000;
}
```

```js
const body = document.body;
body.classList.add('dark');
```

### 4. css变量+js

```css
body {
  --bg-color: #fff;
  background-color: var(--bg-color);
}

body.dark {
  --bg-color: #000;
}
```

```js
const body = document.body;
body.style.setProperty('--bg-color', '#000');
```

### 5. scss + function

```scss
@function theme($bg-color) {
  @return (
    body {
      background-color: $bg-color;
    }
  );
}

@include theme(#fff);

body.dark {
  @include theme(#000);
}
```

### 6. filter

```css
body {
  background-color: #fff;
}

body.dark {
  filter: invert(1);
}
```

```js
const body = document.body;
body.classList.add('dark');
```

## 移动端实现1px边框

### 1. border-image

```css
.border {
  border: 1px solid transparent;
  border-image: url('./border.png') 2 2 2 2 repeat;
}
```

### 2. box-shadow

```css
.border {
  box-shadow: inset 0 0 0 1px #000;
}
```

### 3. transform

```css
.border {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #000;
    transform: scale(0.5);
    transform-origin: left top;
  }
}
```
