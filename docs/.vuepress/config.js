const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,
  base: '/vyte-api-v2-doc/',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    editLinks: false,
    lastUpdated: true,
    smoothScroll: true,
    logo: '/logo.svg',
    nav: [
      {
        text: 'Api Reference',
        link: '/reference/',
      },
    ],
    sidebar: {
      '/reference/': [
        {
          title: 'API Reference',
          collapsable: true,
          children: [
            '',
            'events',
            'locations',
            'locators',
            'teams',
            'users',
            'webhooks',
            'errors'
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    'vuepress-plugin-element-tabs',
    'vuepress-plugin-mermaidjs',
    [require('vuepress-intercom'), { appId: 'sqoiibtg' }],
    [
      'vuepress-plugin-container',
      {
        type: 'left',
        before: `<div class="left">`,
        after: '</div>',
      },
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'right',
        before: `<div class="right">`,
        after: '</div>',
      },
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'panel',
        before: `<div class="parent">`,
        after: '</div>',
      },
    ],
  ]
}
