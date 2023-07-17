---
outline: deep
---

# node

## node基础

### 适用场景

node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效，适合运用在高并发，I/O 密集、少量业务逻辑的场景。

### 单线程架构模型

nodejs 其实并不是真正的单线程架构，因为 nodejs 还有I/O线程存在（网络I/O、磁盘I/O），这些I/O线程是由更底层的 libuv 处理，这部分线程对于开发者来说是透明的。 JavaScript 代码永远运行在V8上，是单线程的。

#### 优势

1. 单线程就一个进程在玩，省去了进程切换的开销
2. 还有线程同步的问题，线程冲突的问题的也不需要担心

#### 劣势

1. 劣势也很明显，现在起步都是 4 核，单线程没法充分利用 cpu 的资源
2. 单线程，一旦崩溃，应用就挂掉了，大家调试脚本也知道一旦执行过程报错了，本次调试就直接结束了
3. 因为只能利用一个 cpu ，一旦 cpu 被某个计算一直占用， cpu 得不到释放，后续的请求就会一直被挂起，直接无响应了

当然这些劣势都已经有成熟的解决方案了，使用 PM2 管理进程，或者上 K8S 也可以。

### 事件循环机制

![node-eventloop](/images/node-eventloop.png "node-eventloop")

1. Timers: 定时器 Interval Timoout 回调事件，将依次执行定时器回调函数
2. Pending: 一些系统级回调将会在此阶段执行
3. Idle,prepare: 此阶段"仅供内部使用"
4. Poll: IO回调函数，这个阶段较为重要也复杂些，
5. Check: 执行 setImmediate() 的回调
6. Close: 执行 socket 的 close 事件回调

与浏览器区别：多了process.nextTick（这个事件的优先级要高于其他微队列的事件）

### 创建线程进程

#### 开启多个子进程

单线程的一个缺点是不能充分利用多核，所以官方推出了 cluster 模块， cluster 模块可以创建共享服务器端口的子进程

```js
const cluster = require('cluster');
for (let i = 0; i < numCPUs; i++) {
  cluster.fork(); // 生成新的工作进程，可以使用 IPC 和父进程通信
}
```

本质还是通过 child_process.fork() 专门用于衍生新的 Node.js 进程,衍生的 Node.js 子进程独立于父进程，但两者之间建立的 IPC 通信通道除外， 每个进程都有自己的内存，带有自己的 V8 实例。

#### 在一个进程前提下开启多个线程

- 在 nodejs 10.0 及以上的版本，新增了 worker_threads 模块，可开启多个线程

```js
const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
const worker = new Worker(__filename, {
  workerData: script
});
```

- 线程间如何传输数据: `parentPort postMessage on` 发送监听消息
- 共享内存： `SharedArrayBuffer` 通过这个共享内存

#### 使用场景

- 常见的一个场景，在服务中若需要执行 shell 命令，那么就需要开启一个进程

```js
var exec = require('child_process').exec;
exec('ls', function(error, stdout, stderr){
  if (error) {
    console.error('error: ' + error);
    return;
  }
  console.log('stdout: ' + stdout);
});
```

- 对于服务中涉及大量计算的，可以开启一个工作线程，由这个线程去执行，执行完毕再把结果通知给服务线程。

### stream

流在 nodejs 用的很广泛，但对于大部分开发者来说，更多的是使用流，比如说 HTTP 中的 request respond ，标准输入输出，文件读取（createReadStream）， gulp 构建工具等等。

流，可以理解成是一个管道，比如读取一个文件，常用的方法是从硬盘读取到内存中，在从内存中读取，这种方式对于小文件没问题，但若是大文件，效率就非常低，还有可能内存不足，采用流的方式，就好像给大文件插上一根吸管，持续的一点点读取文件的内容，管道的另一端收到数据，就可以进行处理。

```js
const fs = require('fs');
// 直接读取文件
fs.open('./xxx.js', 'r', (err, data) => {
  if (err) {
    console.log(err)
  }
  console.log(data)
})
// 流的方式读取、写入
let readStream = fs.createReadStream('./a.js');
let writeStream = fs.createWriteStream('./b.js')
readStream.pipe(writeStream).on('data', (chunk) => { // 可读流被可写流消费
  console.log(chunk)
  writeStream.write(chunk);
}).on('finish', () => console.log('finish'))
```

四种基本的流类型：

1. Writable - 可写入数据的流（例如 fs.createWriteStream()）。
2. Readable - 可读取数据的流（例如 fs.createReadStream()）。
3. Duplex - 可读又可写的流（例如 net.Socket）。
4. Transform - 在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）。

## v8

### js内存机制，数据是如何存储的

- 基本类型存储在栈，引用类型存储在堆
- 赋值：基本类型直接替换，引用类型赋值内存地址

### v8引擎如何进行垃圾内存的回收

#### 新生代（临时）32MB或者16MB

- FROM -> TO，检查FROM，如果可以用直接放在TO中，然后调换位置。
- Scavenge算法，解决内存碎片问题，大大方便了后续连续空间的分配。局限性：内存只能使用新生代的一半，但是时间上非常优秀。
- 调整新生代部分的内存，单位是KB，`node --max-new-space-size=2048 xx.js`

#### 老生代（常驻）

新生代内存多次回收，仍然存在，就放到老生代中（1. 经历过一次Scavenge回收 2. To闲置的空间占用超过25%）

调整老生代部分的内存，单位是MB，`node --max-old-space-size=2048 xx.js`

增量标记：增量标记的方案，即将一口气完成的标记任务分为很多小的部分完成，每做完一个小的部分就"歇"一下，就js应用逻辑执行一会儿，然后再执行下面的部分，如果循环，直到标记阶段完成才进入内存碎片的整理上面来。其实这个过程跟React Fiber的思路有点像。

##### 内存回收

内存回收过程

1. 标记 - 清除（遍历标记、非引用去除标记、再加标记就是待去除的）
2. 整理内存（清除后，把存活的对象往一起靠）

内存管理

1. 数据不再需要设置成null
2. 隐藏类和删除操作（避免动态添加或删除）
3. 避免内存泄漏（setInterval引用外部，闭包引用outer函数）
4. 静态分配（new Array(100)，容易过早优化）与对象池（按需分配，不存在时创建新的，存在时复用）

引用计数方式（不推荐）

内存回收总结

1. 离开作用域的值会被自动标记为可回收，然后在垃圾回收期间被删除
2. 主流是标记清理，先给当前不使用的加上标记，再回来回收他们的内存
3. 引用计数需要记录被使用了多少次，js引擎不使用这种算法但是老版本ie仍然受影响，原因是js会访问非原生js对象，如DOM
4. 引用计数再在代码中存在循环引用时会出现问题
5. 解除变量的引用不仅可以消除循环引用，对垃圾回收也有帮助

### v8执行js过程

词法分析 ---> AST ---> 字节码 ---(v8解释器)--> 机器码

#### 根据词法和语法分析，生成AST（抽象语法树）

1. 词法分析即分词，它的工作就是将一行行的代码分解成一个个token
2. 接下来语法分析阶段，将生成的这些token数据，根据一定的语法规则转换为AST

#### 通过v8的解释器来生成字节码

字节码是介于AST 和 机器码之间的一种代码，但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码然后执行。

#### 执行代码

1. 通过解释器逐行执行字节码，转换成机器码，省去生成二进制文件的操作，减小内存的压力
2. 执行过程中如果一部分代码重复，则把这部分代码叫做热点代码，使用编译器编译成机器码，保存起来
3. 代码执行越久，执行效率越高
4. 字节码不仅配合了解释器，而且还和编译器打交道，所以JS并不是完全的解释型语言，解释器和编译器结合的技术叫即时编译，JIT

## koa

### 核心 - 洋葱圈模型

![node-koa](/images/node-koa.png "node-koa")

遇到next，就进入下一层，一直到无next，然后再从中间一层一层往外返回

```js
 const Koa = require("koa");
 const app = new Koa();
 app.use( (ctx, next) => {
   console.log(1);
    next();
   console.log(2);
 });
 app.use( (ctx, next) => {
   console.log(3);
    next();
   console.log(4);
 });
 app.use( (ctx, next) => {
   console.log(5);
    next();
   console.log(6);
 });
app.listen(3000);

// koa的执行逻辑输出是：1，3，5，6，4，2
```

