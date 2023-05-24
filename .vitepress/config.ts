import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress/types'

const ogUrl = 'https://unocss.dev/'
const ogImage = `${ogUrl}og.png#1`
const title = 'Study site'
const description = `Tian Daoyi's study documents`

const Fe: DefaultTheme.NavItemWithLink[] = [
  { text: 'javascript', link: '/fe/javascript' },
  { text: 'html', link: '/fe/html' },
  { text: 'css', link: '/fe/css' },
  { text: '网络', link: '/fe/network' },
  { text: '浏览器', link: '/fe/browser' },
  { text: '框架', link: '/fe/frame' },
  { text: '数据流', link: '/fe/dataflow' },
  { text: '工程化', link: '/fe/engineering' },
]

const Node: DefaultTheme.NavItemWithLink[] = [
  { text: 'javascript', link: '/node/javascript' },
  { text: 'html', link: '/node/html' },
  { text: 'css', link: '/node/css' },
  { text: '网络', link: '/node/network' },
  { text: '浏览器', link: '/node/browser' },
  { text: '框架', link: '/node/frame' },
  { text: '数据流', link: '/node/dataflow' },
  { text: '工程化', link: '/node/engineering' },
]

const Algorithm: DefaultTheme.NavItemWithLink[] = [
  { text: 'javascript', link: '/algorithm/javascript' },
  { text: 'html', link: '/algorithm/html' },
  { text: 'css', link: '/algorithm/css' },
  { text: '网络', link: '/algorithm/network' },
  { text: '浏览器', link: '/algorithm/browser' },
  { text: '数据流', link: '/algorithm/dataflow' },
  { text: '工程化', link: '/algorithm/engineering' },
]

const Database: DefaultTheme.NavItemWithLink[] = [
  { text: 'javascript', link: '/database/javascript' },
  { text: 'html', link: '/database/html' },
  { text: 'css', link: '/database/css' },
  { text: '网络', link: '/database/network' },
  { text: '浏览器', link: '/database/browser' },
  { text: '数据流', link: '/database/dataflow' },
  { text: '工程化', link: '/database/engineering' },
]

const ComputerBasics: DefaultTheme.NavItemWithLink[] = [
  { text: 'javascript', link: '/computerBasics/javascript' },
  { text: 'html', link: '/computerBasics/html' },
  { text: 'css', link: '/computerBasics/css' },
  { text: '网络', link: '/computerBasics/network' },
  { text: '浏览器', link: '/computerBasics/browser' },
  { text: '数据流', link: '/computerBasics/dataflow' },
  { text: '工程化', link: '/computerBasics/engineering' },
]

const Nav: DefaultTheme.NavItem[] = [
  {
    text: '大前端',
    items: [
      {
        text: '大前端',
        items: Fe,
      },
    ],
    activeMatch: '^/fe/',
  },
  {
    text: 'Node',
    items: [
      {
        text: 'Node',
        items: Node,
      },
    ],
    activeMatch: '^/node/',
  },
  {
    text: '算法',
    items: [
      {
        text: '算法',
        items: Algorithm,
      },
    ],
    activeMatch: '^/algorithm/',
  },
  {
    text: '数据库',
    items: [
      {
        text: '数据库',
        items: Database,
      },
    ],
    activeMatch: '^/database/',
  },
  {
    text: '计算机基础',
    items: [
      {
        text: '计算机基础',
        items: ComputerBasics,
      },
    ],
    activeMatch: '^/computerBasics/',
  },
]
const SidebarFe: DefaultTheme.SidebarItem[] = [
  {
    text: '大前端',
    items: Fe,
  }
]

const SidebarNode: DefaultTheme.SidebarItem[] = [
  {
    text: 'Node',
    items: Node,
  }
]

const SidebarAlgorithm: DefaultTheme.SidebarItem[] = [
  {
    text: '算法',
    items: Algorithm,
  }
]

const SidebarDatabase: DefaultTheme.SidebarItem[] = [
  {
    text: '数据库',
    items: Database,
  }
]

const SidebarComputerBasics: DefaultTheme.SidebarItem[] = [
  {
    text: '计算机基础',
    items: ComputerBasics,
  }
]

export default defineConfig({
  lang: 'en-US',
  title,
  titleTemplate: title,
  description,
  outDir: './dist',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    // ['meta', { name: 'author', content: 'Anthony Fu' }],
    // ['meta', { property: 'og:type', content: 'website' }],
    // ['meta', { name: 'og:title', content: title }],
    // ['meta', { name: 'og:description', content: description }],
    // ['meta', { property: 'og:image', content: ogImage }],
    // ['meta', { name: 'twitter:title', content: title }],
    // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['meta', { name: 'twitter:image', content: ogImage }],
    // ['meta', { name: 'twitter:site', content: '@antfu7' }],
    // ['meta', { name: 'twitter:url', content: ogUrl }],
    ['link', { rel: 'search', type: 'application/opensearchdescription+xml', href: '/search.xml', title: 'UnoCSS' }],
  ],
  lastUpdated: false,
  cleanUrls: true,
  ignoreDeadLinks: [
    /^\/play/,
    /^\/interactive/,
    /:\/\/localhost/,
  ],

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    nav: Nav,
    search: {
      provider: 'local',
    },
    sidebar: {
      // 大前端
      // Node
      // 算法
      // 数据库
      // 计算机基础
      '/fe/': SidebarFe,
      '/node/': SidebarNode,
      '/algorithm/': SidebarAlgorithm,
      '/database/': SidebarDatabase,
      '/computerBasics/': SidebarComputerBasics,
    },
    // editLink: {
    //   pattern: 'https://github.com/unocss/unocss/edit/main/docs/:path',
    //   text: 'Suggest changes to this page',
    // },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tiandaoyi/study-site' },
      // { icon: 'discord', link: 'http://www.okdaoyi.com' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023 Tian Daoyi',
    },
  },
})
