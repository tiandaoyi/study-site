---
outline: deep
---

# 工程化

## 前端工程化概念

前端工程化是指将前端开发流程中的重复性、低效性的工作通过工具和流程的优化和规范化，以提高前端开发的效率和质量的一种开发模式。前端工程化包括以下方面：

- 自动化构建：利用构建工具对代码进行自动化构建，包括编译、压缩、打包、代码检查等，提高代码的质量和执行效率。
- 模块化开发：采用模块化开发，将代码拆分成多个独立的模块，便于维护和协作开发。
- 自动化测试：采用自动化测试框架对代码进行单元测试、集成测试、UI测试等，提高代码的质量和可靠性。
- 版本控制：采用版本控制工具进行代码的管理和协作开发。
- 规范化：采用规范化的编码风格、目录结构、注释等，使得代码易于理解和维护。
- 团队协作：采用团队协作工具和流程，提高团队协作效率和质量。

通过前端工程化，可以大大提高前端开发的效率和质量，减少重复性的工作，使开发者能够更加专注于业务逻辑和用户体验的开发。

## webpack

现代js应用的静态模块打包工具，webpack会从一个或多个入口点构建一个依赖图，然后组成一个或者多个bundles，他们均为静态资源，用于展示你的内容

### loader

文件转换器。本质是个函数（翻译官），webpack通过loader对其他类型的资源进行转译的预处理工作。

webpack自身只理解js/json，loader可以将其他类型文件转换为webpack能够处理的有效模块，通过loader的预处理函数压缩、打包、语言转译和更多其他特性。

执行顺序：从下到上，从右到左。

#### 常用loader

- raw-loader 加载文件原始内容(utf-8)
- file-loader 把文件输出到一个文件夹中，在代码中通过相对URL去引用输出的文件（处理图片和字体）
- source-map-loader 加载额外的source Map
- svg-inline-loader 将压缩后的SVG内容注入代码
- image-loader 加载并压缩图片文件
- json-loader 加载JSON文件（默认包含）
- babel-loader ES6转ES5
- awesome-typescript-loader 将ts转成js，性能优于ts-loader
- sass-loader 将scss/sass代码转成css
- css-loader 加载css，支持模块化、压缩、文件导入等特性
- style-loader 把css代码注入带javascript中，通过dom操作去加载css
- postcss-loader 扩展css语法，使用下一代css，可以配合autoprefixer插件自动补齐css3前缀
- eslint-loader 通过eslint检查javascript代码
- vue-loader 加载 vue.js单文件组件
- i18n-loader 国际化
- cache-loader 可以在一些性能开销较大的Loader之前添加，目的是将结果缓存到磁盘里

### plugins

插件（可以执行范围更广的任务），基于事件流框架Tapable，插件可以扩展Webpack的功能，在Webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过Webpack提供的API改变输出结果。

#### plugins原理

webpack插件是一个具有apply方法的javascript对象。apply方法会被webpack compiler调用，并且在整个编译生命周期都可以访问compiler对象。

插件架构基于tapable(webpack内部库)，就是我们熟悉的发布订阅模式， 类似nodejs的EventEmitter类，专注于自定义事件的触发和操作，还允许通过回调函数的参数访问事件的生产者。

#### 常用plugins

- html-webpack-plugin 简化HTML文件创建（依赖于html-loader）
- clean-webpack-plugin 目录清理
- mini-css-extract-plugin 分离样式文件，CSS提取为独立文件，支持按需加载（代替extract-text-webpack-plugin）
- ignore-plugin 忽略部分文件
- terser-webpack-plugin 支持压缩ES6（Webpack4）
- webpack-merge 提取公共配置，减少重复配置代码
- webpack-bundle-analyzer 可视化 Webpack输出文件的体积（业务组件、依赖第三方模块）
- webpack-parallel-uglify-plugin 多进程执行代码压缩，提示构建速度

### externals

webpack可以不处理应用的某些依赖库，使用externals可以在代码中通过CMD/AMD或者window/global全局的方式访问

可以不打包到bundle中，在运行时再从外部获取扩展依赖

### Tree shaking

Tree shaking 是一种在打包过程中剔除未使用代码（dead code）的优化技术，用于减小最终生成的代码体积。

可以通过以下几个步骤来实现 Tree shaking：

1. 使用 ES6 模块语法: 确保你的代码使用 ES6 模块语法（import/export）来定义模块之间的依赖关系。
2. 配置 Webpack 的 mode 为 production: 在 Webpack 配置文件中设置 mode: 'production'，以启用生产模式的优化。
3. 使用 UglifyJSPlugin 或 TerserPlugin: 在 Webpack 配置文件中添加 UglifyJSPlugin 或 TerserPlugin，用于压缩和混淆代码，并启用 Tree shaking。（Webpack 4+ 默认支持Tree shaking）
4. package.json中sideEffects可以将需要tree shaking的无副作用文件放入(源码中`// @sideEffects false`)
5. 检查结果: 构建项目后，可以检查生成的打包文件是否已经应用了 Tree shaking。可以使用工具（如 webpack-bundle-analyzer）来可视化分析打包文件的大小和组成部分，以确定是否成功剔除了未使用的代码。

### 代码分离

此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

用可接受的服务器性能压力增加来换取更好的用户体验。（webpack建议并发30以内的http请求）

#### 入口起点

使用entry配置手动地分离代码

#### 防止重复

使用entry dependencies或者SplitChunksPlugin去重和分离chunk

#### 动态导入

通过模块的内联函数调用来分离代码

```js
async function getComponent() {
  const element = document.createElement("div");
  const { default: _ } = await import("lodash");
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  return element;
}

getComponent().then((component) => {
  document.body.appendChild(component);
});
```

#### 预获取/预加载模块(prefetch/preload module)

- prefetch预获取：将来某些导航下可能需要的资源
- preload预加载：当前导航下可能需要的资源

```js
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```

这会生成`<link rel="prefetch" href="login-modal-chunk.js">`并追加到页面头部，指示着浏览器在闲置时间预取 login-modal-chunk.js 文件。（父chunk加载完成后就会生成）

preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。

preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。

#### bundle 分析工具

1. 测量构建时间 speed-measure-webpack-plugin
2. 分析包内容 webpack-bundle-analyzer
3. 在线分析统计文件（`stats.json`）: `webpack --config webpack.config.prod.js --profile --json > stats.json`
4. vscode的import cost插件，监测引入模块大小
5. webpack-chart： 可交互饼图

### devtool

sourceMap: 是将编译打包压缩后的代码，映射成源码

生产环境：

hidden-source-map: 生成的 Source Map 文件不会被暴露，适用于保护源代码的安全性。

开发环境：
eval-source-map: 在每个模块的末尾添加注释形式的 Source Map，可以提供准确的行列信息，但会增加打包文件的体积。
cheap-module-eval-source-map: 在每行代码末尾添加注释形式的 Source Map，对打包文件的体积影响较小，但提供的精确度较低。

### 性能优化与打包速度提升

1. node npm/yarn webpack版本升级
2. 优化loader配置：降低loader打包频率（exclude, include, 正则），babel-loader支持缓存（cacheDirectory开启）
3. 可视化方案分析，打包瓶颈性能
4. 减少查找过程（缩小打包作用域）: alias、modules、mainFiles、resolve、noParse、ignorePlugin等配置
5. 多线程提高构建速度: thread-loader
6. 充分利用缓存提升二次构建速度：babel-loader开启缓存、cache-loader、terser-webpack-plugin开启缓存
7. 提取公共代码：使用splitChunks进行分包；基础包分离，使用html-webpack-externals-plugin，将基础包通过CDN引入，不打入bundle中，或者使用splitChunksPlugin进行分离（webpack4默认）。
8. 按需加载：es的import语法；require.ensure
9. externals配置来提取常用库（资源CDN）
10. 第三方库提前打一次包：webpack.DllPlugin
11. 压缩代码：webpack-paralle-uglify-plugin、uglifyjs-webpack-plugin、terser-webpack-plugin压缩；mini-css-extract-plugin提取Chunk中的css代码到单独文件，通过css-loader的minimize选项开启cssnano压缩css
12. 图片压缩： imagemin、image-webpack-loader
13. 其他：控制包大小、合理使用sourceMap、开发环境内存编译、开发环境无用插件剔除、plugin精简并可靠

### 构建过程

初始化参数：从配置文件和Shell语句中读取与合并参数，得出最终的参数

开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译

确定入口：根据配置中的entry找出所有的入口文件

编译模块：从入口文件出发，调用所有配置的Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

完成模块编译：在经过第4步使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及他们之间的依赖关系

输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，Webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变Webpack的运行结果

### webpack相关原理

#### 模块打包原理

Webpack实际上为每个模块创造了一个可以导出和导入的环境，本质上并没有修改代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致

#### 文件监听原理

在源码发生变化时，自动重新构建出新的输出文件。

1. 启动 webpack 命令时，带上 --watch 参数
2. 在配置 webpack.config.js 中设置 watch:true

webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。

原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout 后再执行。

```js
module.export = {
 // 默认false,也就是不开启
 watch: true,
 // 只有开启监听模式时，watchOptions才有意义
 watchOptions: {
  // 默认为空，不监听的文件或者文件夹，支持正则匹配
  ignored: /node_modules/,
  // 监听到变化发生后会等300ms再去执行，默认300ms
  aggregateTimeout:300,
  // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
  poll:1000
  
 }
}
```

#### HMR

Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS （webpack dev server）与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该chunk的增量更新。

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 HotModuleReplacementPlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR。

## babel

Babel是一个广泛使用的JavaScript编译工具，用于将新版本的JavaScript代码转换为向后兼容的旧版本代码。它可以将最新的JavaScript语法、新的API和浏览器不支持的特性转换为在目标环境中可运行的代码。

Babel提供了一个插件系统，使开发人员可以根据自己的需求选择不同的插件来进行代码转换。这些插件可以进行语法转换、API转换、Polyfill填充等操作，以满足不同的编译需求。

Babel可以用于构建现代JavaScript项目，特别是在需要兼容旧版本浏览器或旧版Node.js的情况下。通过使用Babel，开发人员可以编写更具可读性和可维护性的代码，并在不同的环境中进行部署，从而提高开发效率和代码的兼容性。

作用：把es6打包成es5

### 普通项目中使用babel

首先安装依赖项

```sh
npm install @babel/core @babel/preset-env --save-dev
```

.babelrc文件

```json
{
  "presets": ["@babel/preset-env"]
}
```

或者也可以在package.json文件

```json
{
  "babel": {
    "presets": ["@babel/preset-env"]
  }
}
```

package.json文件中添加脚本即可使用

```json
{
  "scripts": {
    "build": "babel src -d dist"
  }
}
```

### webpack配置babel

首先安装依赖项

```shell
npm install babel-loader @babel/core @babel/preset-env --save-dev
```

在Webpack配置文件中，添加针对JS文件的Babel Loader配置。找到module.rules数组，添加一个新的规则对象：

```js
module.exports = {
  // 其他配置项...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

```

还可以在Babel配置文件.babelrc或babel.config.js中进一步配置Babel的转换规则。

### babel常用插件

@babel/preset-env：用于根据目标环境自动确定需要的转换插件和Polyfill填充。

@babel/preset-react：用于支持React应用的转换插件。

@babel/preset-typescript：用于支持TypeScript语法的转换插件。

@babel/plugin-proposal-class-properties：用于支持类属性语法的转换插件。

@babel/plugin-transform-runtime：用于将一些常用的工具函数提取到单独的模块中，以避免在每个文件中重复引入。

@babel/plugin-syntax-dynamic-import：用于支持动态导入语法的转换插件。

@babel/plugin-transform-arrow-functions：用于将箭头函数转换为普通函数的插件。

@babel/plugin-transform-async-to-generator：用于将异步函数转换为基于生成器的函数的插件。

### babel 原理

大多数Javascript Parser遵循estree规范，Babel最初基于acorn项目（轻量级现代Javascript 解析器）Babel大概分为三大部分：

一、解析：将代码转换成AST

词法分析：将代码（字符串）分割成token流，即语法单元组成的数组（类型、开始结束位置、变量名、数据值、初始值等）
语法分析：分析token流（上面生成的数组）并生成AST（比如let关键字，比如a = 1声明描述）

二、转换：访问AST的节点进行变化操作生产新的AST（Taro就是利用babel完成的小程序语法转换）

三、生成：以新的AST为基础生成代码

## vite

Vite是一个现代化的前端构建工具，用于开发快速、高效的现代Web应用程序。Vite的目标是提供一种开发体验，使开发者能够在开发过程中享受到即时的热模块替换（HMR）和快速的冷启动。它专注于开发阶段的构建，并利用现代浏览器的原生模块系统来提供快速的开发构建和开发服务器。

### vite特点

快速的冷启动：Vite利用ES模块的特性，可以在浏览器请求模块时按需构建并提供，无需预先构建整个应用程序，因此冷启动速度非常快。

即时的热模块替换（HMR）：Vite支持热模块替换，可以在不刷新整个页面的情况下实时更新代码和样式，提供了更流畅的开发体验。

原生ES模块支持：Vite直接使用浏览器原生的ES模块系统，无需将代码转换为其他模块规范（如CommonJS），可以直接在现代浏览器中运行。

插件化体系：Vite采用了插件化的设计，可以轻松扩展和定制构建过程，支持各种插件，如TypeScript、CSS预处理器等。

零配置开发：Vite提供了零配置的开发服务器，无需繁琐的配置，开箱即用。

### vite原理

1. ES模块：Vite利用现代浏览器原生支持的ES模块特性，通过使用原生的import/export语法来处理模块依赖关系。相比传统的打包工具，Vite不需要提前将所有模块打包成一个或多个捆绑包，而是在浏览器请求模块时按需构建和提供。
2. HTTP/2服务器推送：Vite使用HTTP/2服务器推送功能来优化模块的加载速度。当浏览器请求一个入口模块时，Vite的开发服务器会解析该模块及其依赖的模块，并通过HTTP/2服务器推送将这些模块一起发送给浏览器，以减少网络请求的延迟。这样，浏览器可以更快地获取所需的模块。

## Rollup

Rollup是一个 JavaScript 模块打包器，用于构建 JavaScript 库或应用程序。

Rollup 的主要目标是将 JavaScript 代码打包成更小、更高效的输出，以实现更快的加载时间和更高的性能。与其他打包工具相比，Rollup 更专注于 ES 模块的打包，因此在处理 ES 模块的场景下表现更好。

Rollup 支持使用插件进行各种转换和优化，如将 ES6+ 语法转换为 ES5、移除未使用的代码、代码拆分、代码压缩等。你可以通过 Rollup 的配置文件定义入口文件、输出文件的位置以及需要应用的插件。

Rollup 的优势之一是生成更简洁、更干净的打包结果，适用于构建库、组件和模块的场景。它与现代的开发工作流和构建工具（如 Babel、TypeScript）集成良好，并提供了许多扩展性和定制化的选项。

### 比webpack优势的地方

1. 支持导出es模块包
2. 支持程序流分析（通过对代码的静态分析，分析出冗余代码，在打包中将这些冗余代码删除掉，进一步缩小体积）
3. 开发应用使用webpack，开发库时建议使用rollup。

## 前端规范化

ESLint：用于检查和纠正 JavaScript 代码中的错误和潜在问题，支持配置各种规则和插件，可以定制适合项目的代码风格和规范。

Prettier：用于格式化代码的工具，支持多种编程语言，可以统一代码的风格，减少团队成员之间的格式差异。

Stylelint：用于检查和纠正 CSS 代码中的错误和潜在问题，支持配置各种规则和插件，可以帮助保持一致的样式代码风格。

EditorConfig：用于配置编辑器的插件，可以统一编辑器的编码风格、缩进设置等，确保团队成员在不同编辑器中有一致的开发环境。

Husky：用于在 Git 提交前执行脚本的工具，可以通过配置在提交代码前进行代码检查、格式化等操作，保证提交的代码符合规范。

lint-staged：用于在 Git 暂存区中只对变动的文件进行代码检查的工具，结合 Husky 可以优化代码检查的效率。

Commitlint：用于规范化提交信息的工具，可以通过配置规则和钩子函数来约束提交信息的格式和内容。

Documentation.js：用于生成项目文档的工具，可以根据代码中的注释自动生成文档，并提供丰富的配置选项和主题支持。

## 版本控制（git）

### 版本回滚

`git reset commit_id`

- 回退到上个版本 `git reset --hard HEAD^/HEAD~2`
- 推送到远程 `git push origin HEAD --force`
- 撤销某次操作 `git revert`

### 清除缓存

`git clean -df`

### 清除提交的缓存

`git rm -r --cached .`

### 打tag

`git tag -a -t3.xx -m 'feat: info'
`git push origin --tags`

### 删除某次commit

1. `git rebase -i 【要删除的commitId的前一个】`
2. 把pick改成drop
3. 如果有冲突 `git add .`，`git rebase --continue`
4. `git push -f`

### 合并其他分支上的特定commit

```bash
git cherry-pick <commit-hash>
```

将 `<commit-hash>` 替换为你想要合并的 commit 的哈希值。

## 前端模块方法规范

前端的模块方法有以下几种常见的方式：

CommonJS：CommonJS 是一种用于 JavaScript 的模块化规范，主要用于服务器端的 Node.js 开发。使用 require() 导入模块，使用 module.exports 导出模块。

AMD（Asynchronous Module Definition）：AMD 是另一种用于 JavaScript 的模块化规范，主要用于浏览器端的异步加载模块。使用 define() 定义模块，使用 require() 异步加载模块。

ES6 Modules：ES6 Modules 是 ECMAScript 2015（ES6）引入的官方模块化规范，可以在现代浏览器和支持的 Node.js 版本中使用。使用 import 导入模块，使用 export 导出模块。

UMD（Universal Module Definition）：UMD 是一种通用的模块定义规范，兼容 CommonJS、AMD 和全局变量的方式。通过判断环境来选择不同的模块加载方式。
