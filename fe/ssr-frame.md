# Next.js

React开发框架

- 直观的、 基于页面 的路由系统（并支持 动态路由）
- 预渲染。支持在页面级的 静态生成 (SSG) 和 服务器端渲染 (SSR)
- 自动代码拆分，提升页面加载速度
- 具有经过优化的预取功能的 客户端路由
- 内置 CSS 和 Sass 的支持，并支持任何 CSS-in-JS 库
- 开发环境支持 快速刷新
- 利用 Serverless Functions 及 API 路由 构建 API 功能
- 完全可扩展

## 创建应用

使用`create-next-app`

```shell
npx create-next-app@latest --typescript
```

使用手动安装

```shell
npm install next react react-dom
```

## 基本特性

2种预渲染

- 静态生成SSG（推荐）：HTML在构建时生成，并在每次请求（request）时重用
- 服务器渲染SSR：在每次页面请求（request）时重新生成HTML。

### 静态生成SSG

不带数据的静态页面

场景：

- 营销页面
- 博客文章和个人简历
- 电商产品列表
- 帮助和文档

```js
function About() {
  return <div>About</div>
}

export default About
```

需要获取数据的静态生成

- 页面内容取决外部数据，使用`getStaticProps`

```js
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// 此函数在构建时被调用，需要导出名字为getStaticProps的函数
export async function getStaticProps() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 通过返回 { props: { posts } } 对象，Blog 组件
  // 在构建时将接收到 `posts` 参数
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

- 页面paths（路径）取决于外部数据，使用`getStaticPaths`(通常还要同时使用`getStaticProps`)

Next.js 允许你创建具有 动态路由 的页面。例如，你可以创建一个名为 pages/posts/[id].js 的文件用以展示以 id 标识的单篇博客文章。当你访问 posts/1 路径时将展示 id: 1 的博客文章。

关于fallback

- `true`：需要在构建时尽可能预渲染所有页面，并希望对于未预渲染的页面提供后备加载机制的场景。
- `false`：需要确保所有页面都能够在构建时预渲染，并且不希望提供后备加载机制的场景。(适用不常新增页面的情况)
- `'blocking'`：需要对于某些页面提供后备加载机制，同时又希望在用户首次访问时提供快速的加载体验的场景。

```js
// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 据博文列表生成所有需要预渲染的路径
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```

### 服务端渲染SSR

如果 page（页面）使用的是 服务器端渲染，则会在 每次页面请求时 重新生成页面的 HTML 。

需要导出名为`getServerSideProps`的async函数，在每次页面请求都会运行，而在构建时不运行。

```js
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

### 渲染 Rendering

将代码转为用户界面，允许创建混合应用，部分代码可以在服务器或者客户端上呈现。

`use client`与`use server`来边界。

#### Composition Patterns模式

如果仅使用服务器，安装包：`npm install server-only`

```js
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

建议只将客户端组件移动到客户端的单独页面中，最小原则，这样其他大部分仍然可以是服务端。
