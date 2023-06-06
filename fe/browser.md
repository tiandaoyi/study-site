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