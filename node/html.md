# HTML

## HTML5新标签

### 标签语义化优点

1. 结构清晰，方便阅读，利于开发和维护
2. 方便搜索引擎seo，利于爬虫抓取，提高网站权重
3. 方便其他设备解析，如盲人阅读器，移动设备

### 1. 结构标签

header, nav, footer, article, section, aside, dialog

### 2. 多媒体标签

video, audio, source(媒介元素), embed(嵌入插件), track(字幕)

### 3. web应用标签

menu, menuitem, progress(进度条), meter(度量衡), details(详情), summary(摘要)

### 4. 表单标签

canlendar, date, time, email, url, search, datalist(选项列表), keygen(秘钥对生成器), output(输出)

## script标签

### 属性有哪些

- async：异步加载，加载完就执行，不保证顺序
- defer：异步加载，等待页面渲染完再执行，保证顺序
- type：脚本语言类型
- src：脚本地址
- charset：脚本编码
- crossorigin：跨域设置
- integrity：校验脚本完整性

### defer和async的区别

defer和async都是异步加载，且只适用与外部脚本文件，并且告诉浏览器立即下载文件。defer规范是按照他们出现的顺序延迟执行，async不一定，第二个文件可能比第一个文件优先执行。
在使用上还有一些差异，async标志的脚本文件一旦加载完成就会立即执行，defer会在DOMContentLoaded事件之前执行

![script](/images/script.png "script")

## 标准方面

### 盒模型

标准模式总宽度:width+margin+padding+border，css属性为`box-sizing:content-box`

怪异模式总宽度:width+margin（width已经包含了padding和border），css属性为`box-sizing:border-box`

标准模式下如果定义的DOCTYPE缺失，IE8及以下会使用怪异模式，IE9及以上会使用标准模式

## Web Component

Web Component是一种基于Web技术的组件化开发方案，可以将网页分解成多个独立，可重用的模块，每个模块有自己的HTML、CSS、JS，可以实现跨平台，跨框架，跨语言的组件化开发。

### 技术组成

1. Custom Elements: 自定义元素，允许开发者创建自己的HTML标签，并定义标签的行为和样式。
2. Shadow DOM: 影子DOM，提供了一种隔离的DOM环境，可以将一个隐藏的DOM树附加到一个元素上，用于封装样式和脚本，使其与文档的其余部分隔离。
3. HTML Templates: HTML模板，用于声明性的创建可复用的结构化DOM片段，可以在运行时实例化为DocumentFragment节点。

### 优点

1. 可复用性：每个Web Component可以独立开发和测试，组件可以在不同的项目中复用，也可以在不同的框架中复用。
2. 可扩展性：Web Component可以继承和扩展其他Web Component，可以通过继承扩展其他组件的功能，也可以通过扩展添加新的功能。
3. 可封装性：Web Component的组件内部可以实现良好的封装性，可以隐藏内部的实现细节，并提供更高层次的抽象接口。

### 缺点

1. 兼容性：Web Component是HTML5的新特性，目前只有Chrome和Firefox支持，IE和Safari不支持。
2. 性能：Web Component的性能比较差，因为它的所有功能都是通过JavaScript实现的，而且浏览器还没有对其进行优化。

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

### MessageChannel

MessageChannel是HTML5的新特性，用于在不同的上下文环境之间传递数据，可以用于解决跨域通信的问题。

MessageChannel 是一种双向的通信机制，可以让两个窗口（或文档、Worker 等）之间互相发送消息，并且每个端点都可以同时接收和发送消息。使用 MessageChannel 可以实现高效的多路复用和低延迟的和异步通信。比较常见的应用场景是在 Web Worker 中使用 MessageChannel 进行线程间通信。

```js
// 创建消息通道
var channel = new MessageChannel();
var port1 = channel.port1;
var port2 = channel.port2;

// 向另一个窗口发送消息
port1.postMessage('Hello, world!');

// 监听消息事件
port2.onmessage = function(event) {
  console.log(event.data); // 'Hello, world!'
};
```

### postMessage

postMessage 是一种单向的通信机制，它可以让一个窗口向另一个窗口发送跨域消息。使用 postMessage 可以实现简单的跨域通信和消息传递。比较常见的应用场景是在不同域名的页面之间进行通信。

需要注意的是，使用 postMessage 进行跨域通信时需要注意安全问题，并且在发送和接收消息时要进行充分的验证和过滤，以避免信息泄露和恶意攻击。

```js
// 发送消息给另一个窗口
window.parent.postMessage('Hello, world!', 'https://example.com');

// 监听消息事件
window.addEventListener('message', function(event) {
  if (event.origin === 'https://example.com') {
    console.log(event.data); // 'Hello, world!'
  }
});
```
