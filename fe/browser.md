---
outline: deep
---

# 浏览器

## 浏览器渲染页面的过程

### 网络层

1. 构建请求
2. 查找强缓存(Cache-Control)
3. DNS解析
4. 建立TCP连接（三次握手、校验数据包）
5. 发送HTTP请求（请求头、请求体、请求行）
6. 网络响应

### 解析算法

如果返回的是Content-Type:text/html就开始进入解析工作，其他的可能是下载

1. 构建dom树（从上到下解析HTML文档生成DOM节点树）（标记化）（建树算法）
2. 样式计算（构建CSSOM树；加载解析样式生成CSSOM树）（格式化）（标准化）（计算规则：继承、层叠）
3. 生成布局树（布局layout：根据渲染树将节点树的每一个节点布局在屏幕的正确位置）

### 渲染过程

绘制(painting)：遍历渲染树绘制所有节点，为每一个节点适用对应的样式，这一过程是通过UI后端模块完成。

1. 建图层树
2. 生成绘制列表
3. 生成图块和生成位图
4. 显示器显示内容

浏览器会将各层的信息发送GPU，GPU会将各层合成，最后显示在屏幕上。

最后断开连接：TCP四次挥手

## 回流与重绘

### 回流（reflow）

当我们对DOM的修改引发了DOM几何尺寸的变化（比如修改元素的宽、高或隐藏元素、添加或删除可见的DOM等）时，浏览器需要重新计算元素的几何属性（其他元素的几何属性和位置也会因此受到影响），然后再将计算的结果绘制出来，这个过程就称为回流（reflow）。

### 重绘

当我们对DOM的修改导致了样式的变化、却并未影响其几何属性（比如修改了颜色或背景色）时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式（跳过了上图所示的回流环节），这个过程称为重绘（repaint）。

### 避免方式

回流必将引起重绘，而重绘不一定会引起回流

- 避免频繁使用style，而是采用修改class的方式。
- 使用createDocumentFragment()方法，将需要多次操作的节点先添加到DocumentFragment中，然后再统一添加到document中。
- 对于resize、scroll等事件，我们可以使用防抖（debounce）来进行优化。
- GPU加速（transform、opacity、filter、will-change）
- 分离读写操作（先读后写）
- 缓存需要修改的元素信息（减少DOM查询）
- 使用absolute或fixed定位，它们不在文档流中，因此不会引起回流。
- 使用visibility属性替换display:none，因为它只会引起重绘，不会引起回流。
- 避免使用table布局，可能很小的一个小改动会造成整个table的重新布局。
- 将频繁重绘或者回流的节点设置为图层，图层能够阻止该节点的渲染行为影响别的节点，例如will-change、video、iframe等标签，浏览器会自动将该节点变为图层。

### 常见会导致回流的操作

常见的几何属性有width、height、padding、margin、left、top、border等等。

最容易被忽略的操作：获取一些需要通过即时计算得到的属性值，比如：offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight时，浏览器为了获取这些值，也会进行回流操作。

当我们调用了getComputedStyle()、currentStyle()、getBoundingClientRect()等方法时，也会导致回流。(原理是一样的，都为求一个及时性和准确性)

## 首屏加载优化

真的快：可以客观衡量的指标，像网页访问时间、交互响应时间、页面跳转时间。

觉得快：用户主观感知的性能，通过视觉引导等手段转移用户对等待的关注。

<!-- 
### 关于性能优化

#### 本质：性能优化的最终目的是提升用户体验

真的快：可以客观衡量的指标，像网页访问时间、交互响应时间、页面跳转时间。

觉得快：用户主观感知的性能，通过视觉引导等手段转移用户对等待的关注。

#### 权衡取舍

我们在做性能优化过程中，必须根据最终能给用户体验带来的提升后做出适合当前项目的选择。

### 指标和目标

#### 目标

首先我们需要确定目标，根据场景和项目复杂度不同，制定的目标也不同，比如希望比竞品快20%，或者符合标准的"2-5-10"原则等等

- 正常网速下，2s内加载完成
- 弱网下，30s内加载完成

#### 指标

- FCP（First Contentful Paint）：首次内容绘制，是浏览器将第一个DOM渲染到屏幕的时间点，它标志着页面的可用性，用户可以看到第一批内容。
- Speed Index：速度指数，反映了页面可视化的速度，是页面在加载过程中，每个时间点的视觉完整程度的加权分数。
- TTI（Time to Interactive）：首次可交互时间，是指页面可交互的时间点，即页面加载完成，并且用户可以进行正常的点击、输入等操作。

### 调试工具

- Network：查看网络请求
- k6：压力测试工具
- Lighthouse：性能测试工具
- hiper：性能测试工具 -->

### 体积优化

#### 排查并移除冗余资源

- 移除项目模板冗余依赖
- 将public的静态资源移入assets。静态资源应该放在assets下，public只会单纯的复制到dist，应该放置不经webpack处理的文件，比如不兼容的webpack库，需要指定文件名的文件等。

#### 构建时压缩图片

image-webpack-loader

```shell
npm i image-webpack-loader -D
```

```js
// vue.config.js
chainWebpack: (config) => {
  if (isProd) {
    // 图片压缩处理
    const imgRule = config.module.rule('images')
    imgRule
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true })
      .end()
  }
}
```

#### 使用webp格式图片

- 手动：建议使用官方webP-converter。
- 自动化生成，可以使用image-min-webp或其他webpack插件。

#### 优化svg图标

引入svg-sprite-loader，这是一个webpack插件，可以将多个svg打包成一个svg文件，减少http请求。

```shell
npm i svg-sprite-loader -D
```

```js
// vue.config.js
chainWebpack: (config) => {
  // SVG处理
  config.module
    .rule('svg')
    .exclude.add(resolve('src/icons/svg'))
    .end()
  config.module
    .rule('icons')
    .test(/\.svg$/)
    .include.add(resolve('src/icons/svg'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]'
    })
    .end()
}
```

创建src/icons/svg并将图标放进去，并通过webpack的require.context自动导入

```js
// src/icons/index.js
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// main.js
import '@/icons'
```

创建全局组件ca-svg

```js
// src/icons/index.js
import Vue from 'vue'
import CaSVG from '@/components/ca-svg'
Vue.component('ca-svg', CaSVG)

// src/components/ca-svg.vue
<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners" :style="svgStyle">
    <use :xlink:href="iconName" />
  </svg>
</template>
...
// name属性为必须字段，其他size或color可以自由定制
```

SVG通常会有一些冗余信息导致影响体积，这里我们可以使用svgo-loader来进一步压缩

```shell
npm i svgo-loader -D
```

```js
// vue.config.js
// 接上面svg的配置
...
.end()
.use('svgo-loader')
.loader('svgo-loader')
.end()
```

#### 优化第三方体积(antd和图标)

antd的按需加载：

antd 默认支持基于 ES modules 的 tree shaking，直接引入 `import { Button } from 'antd';` 就会有按需加载的效果。

图标，重定向到本地来控制（2种方法）：

1. 使用webpack-ant-icon-loader，异步加载图标，减少打包体积
2. 使用alias，将@ant-design/icons/lib/dist指向项目中的antd-icon.js，这样就可以在项目中直接引入antd的图标，而不需要额外安装@ant-design/icons

```js
// alias配置
resolve: {
  alias: {
    '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons/antd-icon.js')
  }
}
// src/icons/antd-icon.js
export { default as LoadingOutline } from '@ant-design/icons/lib/outline/LoadingOutline'
```

#### 优化moment/moment-timezone体积

- 不打包moment时区文件

```js
plugins: [
  // Ignore all locale files of moment.js
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
],
```

- 使用dayjs替代moment(注意其他第三方UI库是否使用moment)

#### 优化core-js体积

core-js实际上就是浏览器的polyfill，它会根据你的代码中使用的ES6+特性，自动导入对应的polyfill，但是这样会导致打包体积过大，因为它会导入所有的polyfill，而我们实际上只需要导入项目中使用到的polyfill即可。

##### 调整.browserslistrc

browserslistrc的作用：babel、autoprefixer、postcss、eslint、stylelint等工具都会读取这个配置文件，来确定需要兼容的目标浏览器。

指定项目需要兼容的版本，让babel和auto-prefix少做点兼容性工作，比如移动端不用兼容IE、iOS6.0以下等等

```js
// .browserslistrc
last 2 versions
> 1%
iOS >= 7
Android > 4.1
```

##### 调整useBuiltIns

项目中默认是entry，这样会导入所有的polyfill，我们可以改成usage，这样就只会导入项目中使用到的polyfill。

```js
// babel.config.js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'usage', // entry，usage
        'corejs': 3 // 指定core-js版本，目前babel7默认是core-js@2，babel8默认是core-js@3
      }
    ]
  ],
}
```

##### 按需导入polyfill（推荐）

使用动态polyfill，让服务器根据UA判断是否要返回polyfill。这样可以减少打包体积，同时也可以根据用户的浏览器版本，只返回必要的polyfill。

```js
// main.js
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const polyfillUrl = 'https://polyfill.io/v3/polyfill.min.js?features='
const polyfillFeatures = [
  'Array.prototype.includes',
  'Promise',
  'Object.assign',
  'Object.entries',
  'Object.values',
  'String.prototype.startsWith',
  'String.prototype.endsWith',
  'String.prototype.includes',
  'Symbol',
  'Symbol.asyncIterator',
  'Symbol.iterator',
  'Symbol.toStringTag'
].join('%2C')

const ua = window.navigator.userAgent
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1
if (isIE) {
  const script = document.createElement('script')
  script.src = polyfillUrl + polyfillFeatures
  document.head.appendChild(script)
}
```

### 传输优化

#### 优化分包策略

vue-cli3的默认优化是将所有npm依赖都打进chunk-vendor，但这种做法在依赖多的情况下导致chunk-vendor过大

```js
optimization: isProd ? {
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: Infinity, // 默认为3，调整为允许无限入口资源
    minSize: 20000, // 20K以下的依赖不做拆分
    cacheGroups: {
      vendors: {
        // 拆分依赖，避免单文件过大拖慢页面展示
        // 得益于HTTP2多路复用，不用太担心资源请求太多的问题
        name(module) {
          // 拆包
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
          // 进一步将Ant组件拆分出来,请根据情况来
          // const packageName = module.context.match(/[\\/]node_modules[\\/](?:ant-design-vue[\\/]es[\\/])?(.*?)([\\/]|$)/)[1]
          return `npm.${packageName.replace('@', '')}` // 部分服务器不允许URL带@
        },
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial'
      }
    }
  },
  runtimeChunk: { name: entrypoint => `runtime-${entrypoint.name}` }
} : {}
```

::: tip

vue inspect > output.js --mode production 可以查看最终配置 (结合实际调整)

:::

#### 优化路由懒加载

SPA中一个很重要的提速手段就是路由懒加载，当打开页面时才去加载对应文件，我们利用Vue的异步组件和webpack的代码分割（import()）就可以轻松实现懒加载了。

但当路由过多时，请合理地用webpack的魔法注释对路由进行分组，太多的chunk会影响构建时的速度

```js
const router = [{
  path: 'register',
  name: 'register',
  component: () => import(/* webpackChunkName: "user" */ '@/views/user/register'),
}]

```

#### 开启HTTP2

```sh
// nginx.conf
listen 443 http2;
```

#### GZIP压缩传输

当响应头的 Content-Encoding指定了gzip时，浏览器则会进行对应解压

```sh
#开启和关闭gzip模式
gzip on;
#gizp压缩起点，文件大于1k才进行压缩
gzip_min_length 1k;
# gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间
gzip_comp_level 6;
# 进行压缩的文件类型。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript ;
# nginx对于静态文件的处理模块，开启后会寻找以.gz结尾的文件，直接返回，不会占用cpu进行压缩，如果找不到则不进行压缩
gzip_static on
# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;
# 设置gzip压缩针对的HTTP协议版本
gzip_http_version 1.1;
```

构建时生成gzip文件

```js
// vue.config.js
const CompressionPlugin = require('compression-webpack-plugin')
// gzip压缩处理
chainWebpack: (config) => {
  if(isProd) {
    config.plugin('compression-webpack-plugin')
      .use(new CompressionPlugin({
        test: /\.js$|\.html$|\.css$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
  }
}
```

:::tip

虽然上面配置后Nginx已经会在响应请求时进行压缩并返回Gzip了，但是压缩操作本身是会占用服务器的CPU和时间的，压缩等级越高开销越大，所以我们通常会一并上传gzip文件，让服务器直接返回压缩后文件

插件的默认压缩等级是9，最高级的压缩
图片文件不建议使用gzip压缩，效果较差

:::

#### prefetch、preload

`<link>`标签的rel属性的两个可选值。

- prefetch，预请求，是为了提示浏览器，用户未来的浏览有可能需要加载目标资源，所以浏览器有可能通过事先获取和缓存对应资源，优化用户体验。
- preload，预加载，表示用户十分有可能需要在当前浏览中加载目标资源，所以浏览器必须预先获取和缓存对应资源。

##### 场景

首屏字体、大图加载，CSS中引入字体需要等CSS解析后才会加载，这之前浏览器会使用默认字体，当加载后会替换为自定义字体，导致字体样式闪动，而我们使用preload提前加载字体后这种情况就好很多了，大图也是如此

优惠券的背景图加载，同样CSS中url引用在DOM没挂载之前是不会加载图片的，进入卡包页/收银台时可以提前使用prefetch加载，这样用户在进行优惠券页就可以立马看到加载完成的图片了

:::tip
Vue-Cli3默认会使用preload-webpack-plugin对chunk资源做preload、prefetch处理，入口文件preload，路由chunk则是prefetch。

一般来说不需要做特别处理，如果判断不需要或者需要调整在vue.config.js中配置即可

移动端流量访问慎用
:::

#### 托管至OSS+CDN加速

当应对一些弱网地区时，OSS+CDN无疑是很强力的提速手段

##### OSS，对象存储

海量，安全，低成本，高可靠的云存储服务。可以通过简单的REST接口，在任何时间、任何地点上传和下载数据，也可以使用WEB页面对数据进行管理。

优点：

- 稳定，服务可用性高，多重备份保障数据安全
- 安全，多层次安全防护，防DDoS
- 大规模，高性能，从容应对高并发

其他服务：

- 图片处理，支持压缩、裁剪、水印、格式转换等
- 传输加速，优化传输链路和协议策略实现高速传输

##### CDN，内容分发网络

CDN加速原理是把提供的域名作为源站，将源内容缓存到边缘节点。当客户读取数据时，会从最适合的节点（一般来说就近获取）获取缓存文件，以提升下载速度。

### 感知优化

#### 白屏loading动画

首屏优化，在JS没解析执行前，让用户能看到Loading动画，减轻等待焦虑。通常会在index.html上写简单的CSS动画，直到Vue挂载后替换挂载节点的内容，但这种做法实测也会出现短暂的白屏，建议手动控制CSS动画关闭

#### 首屏骨架加载

首屏优化，APP内常见的加载时各部分灰色色块。针对骨架屏页的自动化生成，业界已有不少解决方案。

#### 渐进加载图片

一般来说，图片加载有两种方式，一种是自上而下扫描，一种则是原图的模糊展示，然后逐渐/加载完清晰。前者在网速差的时候用户体验较差，后者的渐进/交错式加载则能减轻用户的等待焦虑，带来更好的体验

渐进/交错格式图片：浏览器本身支持这种图片的模糊到清晰的扫描加载方式，只需要将处理好资源即可

渐进加载图片：先加载小图，模糊化渲染，图片加载完成后替换为原图，最典型的例子就是Medium，模糊化可以用filter或者canvas处理

加载占位图： 先加载全局通用loading图或者用CSS填充色块，图片加载完成后替换为原图。简单粗暴，在弱网条件下很有用

#### 路由跳转loading动画

弱网优化手段，用了懒加载后用户如果在弱网条件下点击下一个页面在下个页面加载完成前页面内容不可用，用户会理解为卡顿。在VueRouter的路由守卫中处理即可

#### 其他

首屏以外的一些场景优化，更多相关内容比如图片懒加载、组件懒加载等。

## 小程序优化（上面的内容是基础）

### 小程序体积优化

1. 分包加载
2. 部分页面h5化（交互通过jssdk或postMessage）

### 代码层面优化

1. setData合并及降频率
2. 减少节点数量
3. setData之前diff、去掉不必要的事件绑定、去掉节点绑定、适当的组件颗粒度、事件总线代替组件数据绑定（逻辑层处理比线程通信更合理）、wx.onMemoryWarning内存告警（收集并优化）
4. onHide时回收定时器
5. 避免频发事件中的重度内存操作(onPageScroll节流，避免cpu密集操作，尽量使用IntersectionObserver来替代SelectorQuery)
6. 长列表优化

### 首屏体验优化

1. 首屏时长优化：本地缓存，根据用户属性和数据版本号对缓存隔离
2. 数据预拉取：启动小程序时，小程序通过http到第三方获取数据，把响应数据存储在本地客户端
3. 分屏渲染：分屏渲染是指在小程序启动时，将页面分成多个屏，每屏渲染一部分内容，当用户滑动页面时，再渲染下一屏内容
4. 跳转时预拉取：在用户点击跳转前，提前拉取跳转页面的数据，跳转时直接使用（存在全局Promise中）
5. 分包预下载：在进入某个页面时，下载分包数据

### 接口层面优化

1. 非关键渲染数据延迟请求：拆分接口，主体模块一个接口，非主体模块一个接口
2. 接口聚合，请求合并：微信的接口请求，并发是10个，websocket是5个，可以通过接口聚合，减少请求次数

## 图片懒加载优化

### 什么是图片懒加载

图片懒加载是指延迟加载图片，当用户滚动到可视区域时，再去加载图片，这样可以减少页面的http请求，提升页面加载速度，提升用户体验

### 方案1(getBoundingClientRect)

1. 在img标签上添加data-src属性，值为图片的真实地址
2. 监听scroll事件，判断图片是否进入可视区域
3. Element.getBoundingClientRect()判断目标元素与视口的交叉状态

```js
function lazyload() {
  const imgs = document.querySelectorAll('img[data-src]')
  const viewHeight = document.documentElement.clientHeight
  Array.from(imgs).forEach(img => {
    const rect = img.getBoundingClientRect()
    if (rect.bottom >= 0 && rect.top < viewHeight) {
      !function () {
        const img = new Image()
        img.src = img.dataset.src
        img.onload = function () {
          img.src = img.dataset.src
          img.removeAttribute('data-src')
        }
      }()
    }
  })
}
```

### 方案2(IntersectionObserver)

1. 在img标签上添加data-src属性，值为图片的真实地址
2. 使用IntersectionObserver监听img标签，当img标签进入可视区域时，加载图片

```js
function lazyload() {
  const imgs = document.querySelectorAll('img[data-src]')
  const observer = new IntersectionObserver(changes => {
    changes.forEach(change => {
      const img = change.target
      const src = img.dataset.src
       // intersectionRatio为目标元素与视口的交叉比例，isIntersecting为目标元素是否与视口交叉
      if (change.intersectionRatio > 0 || change.isIntersecting) {
        img.src = src
        observer.unobserve(img)
      }
    })
  })
  Array.from(imgs).forEach(img => observer.observe(img))
}
```

### 方案3(img标签loading属性)

[支持度不高，不推荐使用](https://caniuse.com/loading-lazy-attr)

```html
<img src="http://www.xxx.com/target.jpg" decoding="async" loading="lazy" />
```

## 浏览器本地存储

### cookie

1. 本身用于客户端和服务端通信
2. 本身有大小限制，每个域名下最多只能有20个cookie，每个cookie的大小不能超过4KB
3. 本身有安全性问题，cookie中的数据可以通过document.cookie获取，容易被攻击者获取
4. 作用域：cookie的作用域是由cookie的path属性决定的，如果path为/，则在整个域名下都有效，如果path为/foo，则在/foo路径下有效，如果path为/bar，则在/bar路径下有效
5. 失效：cookie的失效时间由expires属性决定，如果没有设置expires属性，则cookie的生命周期为浏览器会话期间，即关闭浏览器后失效，如果设置了expires属性，则cookie的生命周期为expires属性值，即在expires属性值到达后失效，如果设置了max-age属性，则cookie的生命周期为max-age属性值，即在max-age属性值到达后失效

### localStorage

1. 本身用于存储本地数据，不会随着http请求发送到服务端
2. 本身有大小限制，不同浏览器不同，一般为5M
3. 本身有安全性问题，容易被攻击者获取
4. 作用域：localStorage的作用域是整个域名下都有效
5. 失效：localStorage的失效时间由setItem方法的第二个参数决定，如果没有设置第二个参数，则localStorage的生命周期为永久，如果设置了第二个参数，则localStorage的生命周期为第二个参数值，即在第二个参数值到达后失效

### sessionStorage

1. 本身用于存储本地数据，不会随着http请求发送到服务端
2. 本身有大小限制，不同浏览器不同，一般为5M
3. 本身有安全性问题，容易被攻击者获取
4. 作用域：sessionStorage的作用域是整个域名下都有效
5. 失效：sessionStorage的失效时间为会话期间，即关闭浏览器后失效，如果是同一个浏览器的不同标签页，sessionStorage是共享的，如果是不同浏览器的不同标签页，sessionStorage是不共享的

### indexedDB

IndexedDB是一种基于键值对的对象存储数据库。它提供了一个结构化的、事务性的存储机制，用于存储大量的数据，并支持高效的索引查询。IndexedDB是一个异步的API，可以在浏览器中创建和管理数据库，存储和检索数据，并通过索引进行高效的查询。它适用于处理较大数据集和复杂查询的场景，例如离线应用、缓存数据、数据同步等。

1. 本身用于存储本地数据，不会随着http请求发送到服务端
2. 本身没有大小限制
3. 本身有安全性问题，容易被攻击者获取
4. 作用域：indexedDB的作用域是整个域名下都有效
5. 失效：indexedDB的失效时间由开发者决定

```js
// cookie
document.cookie = 'name=张三'
console.log(document.cookie)

// localStorage
localStorage.setItem('name', '张三')
localStorage.getItem('name')
localStorage.removeItem('name')
localStorage.clear()

// sessionStorage
sessionStorage.setItem('name', '张三')
sessionStorage.getItem('name')
sessionStorage.removeItem('name')
sessionStorage.clear()

// indexedDB
const request = indexedDB.open('test', 1)
request.onupgradeneeded = function (event) {
  const db = event.target.result
  const objectStore = db.createObjectStore('person', { keyPath: 'id' })
  objectStore.createIndex('name', 'name', { unique: false })
  objectStore.createIndex('email', 'email', { unique: true })
}
request.onsuccess = function (event) {
  const db = event.target.result
  const transaction = db.transaction(['person'], 'readwrite')
  const objectStore = transaction.objectStore('person')
  const person = {
    id: 1,
    name: '张三',
    email: '
  }
  const request = objectStore.add(person)
  request.onsuccess = function (event) {
    console.log('数据写入成功')
  }
  request.onerror = function (event) {
    console.log('数据写入失败')
  }
}
request.onerror = function (event) {
  console.log('数据库打开失败')
}
```

:::tip
还有一种存储技术是WebSQL，这是一种基于关系型数据库的客户端存储技术。它基于SQL语言和关系型数据库的概念，提供了一种简单的方式来操作和管理本地数据。WebSQL使用SQLite数据库引擎，并提供了一个SQL接口，用于创建、查询、更新和删除数据。它是一个同步的API，可以在浏览器中直接执行SQL语句，对数据进行操作。WebSQL在一些早期的浏览器中得到支持，但目前已被废弃，并不再是Web标准的一部分。
:::

## 浏览器同源策略及跨域方案

### 同源策略

同源策略是浏览器的一种安全策略，它用于限制一个origin的文档或者它加载的脚本如何能与另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。

如何判断两个url是否同源？

1. 协议相同
2. 域名相同
3. 端口相同

同源策略的限制内容包括：

1. Cookie、LocalStorage 和 IndexDB 无法读取
2. DOM 和 Js对象无法获得
3. AJAX 请求不能发送

同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。

### 跨域

跨域是指浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是浏览器对JavaScript施加的安全限制。

1. jsonp：利用script标签没有跨域限制的漏洞实现。缺点只支持GET请求。
2. CORS设置Access-Control-Allow-Origin：指定可访问资源的域名。
3. Websocker请求跨域：是HTML5的一个持久化协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。
4. 代理转发：反向代理（Nginx、Node），正向代理（VPN）。
5. 页面跨域(postMessage、改变iframe的location、window.name、window.open、document.domain)。

## 异常处理

### window.onerror

特点：

- 语法错误，静态资源，接口异常无法捕获
- 只有在返回true的时候，异常才不会向上抛出
- 最好写在所有JS脚本的前面
- 捕获预料之外的错误
- 配合window.addEventListener

```js
window.addEventListener('error', function (error) {
  console.log('捕获到异常', error)
}, true);
```

### try-catch

只能捕获同步异常，不能捕获异步异常。

用来在可预见的代码中捕获异常，而不是用来处理意料之外的异常。

```js
try {
  setTimeout(() => {
    throw new Error('error')
  }, 1000)
} catch (error) {
  console.log('捕获到异常', error)
}
```

### Promise catch

promise中的cache可以捕获异步error，不可漏写

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('error')
  }, 1000)
}).catch(error => {
  console.log('捕获到异常', error)
})
```

全局增加unhandledrejection事件，可以捕获未被catch的异常

```js
window.addEventListener('unhandledrejection', function (error) {
  console.log('捕获到异常', error)
})
```

去掉控制台的异常提示

```js
window.addEventListener('error', function (error) {
  console.log('捕获到异常', error)
  return true
}, true);
```

### iframe异常

```html
<iframe src="http://www.baidu.com" onload="onloadHandler()" onerror="onerrorHandler()"></iframe>
```

```js
window.frames[0].oneerror = function () {
  console.log('捕获到异常')
}
```

### script error异常

如果是跨域问题，可以通过script标签的crossorigin属性来解决。

```html
<script src="http://www.baidu.com" crossorigin></script>
```

动态添加js脚本(服务器端响应头里还需要设置Access-Control-Allow-Origin)

```js
const script = document.createElement('script');
script.crossOrigin = 'anonymous';
script.src = url;
document.body.appendChild(script);
```

改写EventTarget

```js
const originAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
  const wrappedListener = function (...args) {
    try {
      return listener.apply(this, args);
    }
    catch (err) {
      throw err;
    }
  }
  return originAddEventListener.call(this, type, wrappedListener, options);
}
```

### vue 异常

vue.config.errorHandler

```js
Vue.config.errorHandler = (err, vm, info) ={}
```

### react 异常

react 16版本之后增加了componentDidCatch生命周期函数，用来捕获子组件树的异常。

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

## 前端监控

前端监控分三大类：用户行为、性能监控、异常监控。

### 前端监控的方法

手动埋点：百度统计、谷歌统计、友盟统计

可视化埋点：可视化埋点工具，如神策、GrowingIO

无埋点：通过监听用户行为，自动上报数据，如用户点击、页面加载、ajax请求等。

### 崩溃监控（性能监控类）

window对象的load和beforeunload事件实现了网页崩溃的监控。

```js
// 监听页面加载完成事件
window.addEventListener('load', function() {
  // 页面加载完成，执行初始化操作
  console.log('页面加载完成');
  
  // 注册 beforeunload 事件
  window.addEventListener('beforeunload', function(event) {
    // 页面即将卸载，执行清理操作
    console.log('页面即将卸载');
    
    // 判断是否发生网页崩溃
    if (!event.currentTarget.performance.navigationType) {
      // 网页崩溃事件处理逻辑
      console.log('网页崩溃');
    }
    
    // 可以在此处执行一些清理操作，如释放资源、保存数据等
    // ...
  });
});

```

使用Service Worker来实现网页崩溃的监控

有自己独立的工作线程，与网页区分开，网页崩溃后，Service Worker 一般情况下不会崩溃；Service Worker生命周期一般要比网页还要长，可以用来监控网页的状态；网页可以通过navigator.serviceWorker.controller.postMessage API 向掌管自己的SW发送消息。

```js
// sw.js
self.addEventListener('message', function (event) {
  if (event.data === 'crash') {
    fetch('https://httpbin.org/status/500');
  }
});

// index.js
navigator.serviceWorker.controller.postMessage('crash');
```

### 卡顿监控（性能监控类）

performance.now

```js
const t0 = performance.now();
// 执行一些操作
const t1 = performance.now();
console.log(`操作耗时${t1 - t0}毫秒`);
```

通过requestAnimationFrame来实现卡顿监控，我们可以定义一些边界值，比如连续出现3个低于20的 FPS 即可认为网页存在卡顿

```js
let lastTime = performance.now();
function loop() {
  const now = performance.now();
  console.log(`本帧与上一帧的间隔时间为${now - lastTime}毫秒`);
  lastTime = now;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

### 埋点：GIT上报

1. 防止跨域，不受限于协议、域名、端口
2. 防止阻塞页面加载，影响用户体验
3. 通过Image对象上报，不会造成页面跳转
4. 相比较PNG/JPG，GIT请求更小，上报更快(最小的GIF图片只有43个字节)

```js
const report = (data) => {
  const img = new Image();
  img.src = 'http://www.baidu.com/report?' + data;
}
```

#### 埋点上报降低服务器压力

可以设置采集率（随机数或者用户特征）

```js
Reporter.send = function(data) {
  // 只采集 30%
  if(Math.random() < 0.3) {
    send(data)      // 上报错误信息
  }
}
```

### 第三方监控

sentry

### 线上代码排查

source-map

## 前端页面渲染的几种方式

### 客户端渲染CSR(Croswer Side Render)

框架

1. react
2. vue
3. angular

优点

1. 服务器响应速度快
2. 支持页面交互、适用于单页应用

缺点

1. 在js得到渲染之前，页面没有内容，出现页面白屏
2. 页面渲染代码在js中，爬虫不能解读，seo引擎不够友好

### 静态页面生成SSG(Static Site Generation)

优点

1. seo
2. html包括渲染的dom，和首屏加载速度快

缺点

1. 适合静态页面网站，不支持页面交互
2. 构建过程中没有window,document等，存在库的兼容问题

### 服务端渲染SSR(Server Side Render)

优点

1. 服务器响应速度快
2. 支持页面交互、适用于单页应用
3. html包括渲染的dom，和首屏加载速度快
4. 支持seo

缺点

1. 服务器压力大
2. 代码复杂度高
3. 部署成本高，维护成本高
4. 服务器环境中没有window,document等，存在库的兼容问题

框架

1. next.js
2. nuxt.js

:::tip
使用预渲染之前，首先要考虑是否真的需要它，如果初始加载时的额外几百毫秒并不会对应用产生影响，这种情况下去使用预选染将是一个小题大作之举。

首屏加载时间是绝对关键的指标，在这种情况下，如果是静态页面渲染可采用SSG的方式，如果需要页面交互则采取SSR的方式。

静态页面、需要SEO流量的项目、以及用户增长型项目，如：博客、活动页面、app官网等，适用于预渲染的方式。

大部分中后台项目都更加适用于客户端渲染方式。
:::
