const { description } = require("../../package");

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,
  title: "Vyte API",

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    [
      "meta",
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "57x57",
        href: "/assets/favicons/apple-icon-57x57.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "60x60",
        href: "/assets/favicons/apple-icon-60x60.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "72x72",
        href: "/assets/favicons/apple-icon-72x72.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "76x76",
        href: "/assets/favicons/apple-icon-76x76.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        href: "/assets/favicons/apple-icon-114x114.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        href: "/assets/favicons/apple-icon-120x120.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        href: "/assets/favicons/apple-icon-144x144.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        href: "/assets/favicons/apple-icon-152x152.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/assets/favicons/apple-icon-180x180.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/assets/favicons/android-icon-192x192.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/assets/favicons/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/assets/favicons/favicon-96x96.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/assets/favicons/favicon-16x16.png",
      },
    ],
    ["link", { rel: "manifest", href: "/assets/favicons/manifest.json" }],
    ["meta", { name: "msapplication-TileColor", content: "#428FF0" }],
    [
      "meta",
      {
        name: "msapplication-TileImage",
        content: "/assets/favicons/ms-icon-144x144.png",
      },
    ],
    [
      "meta",
      {
        name: "msapplication-config",
        content: "/assets/favicons/browserconfig.xml",
      },
    ],
    ["meta", { name: "theme-color", content: "#428FF0" }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "saintmac/vyte-api-v2-doc",
    // Customising the header label
    // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
    repoLabel: "Contribute!",

    // Optional options for generating "Edit this page" link

    // if your docs are in a different repo from your main project:
    docsRepo: "saintmac/vyte-api-v2-doc",
    // if your docs are not at the root of the repo:
    docsDir: "docs",
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: "master",
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: "Help us improve this page!",
    lastUpdated: true,
    smoothScroll: true,
    logo: "/logo.svg",
    nav: [
      {
        text: "Guides",
        link: "/guides/",
      },
      {
        text: "Api Reference",
        link: "/reference/",
      },
    ],
    sidebar: {
      "/guides/": [
        {
          title: "API Guides",
          collapsable: false,
          children: [
            "",
            "getting-started",
            "create-and-manage-booking-pages",
            "scheduling-api-for-1-to-1-bookings",
            "add-scheduling-features-to-your-app-or-platform",
            "setup-team-booking",
            //"using-team-admins-for-notifications-and-event-management",
            "use-our-web-components",
          ],
        },
      ],
      "/reference/": [
        {
          title: "API Reference",
          collapsable: false,
          children: [
            "",
            "appointment-types",
            "availabilities",
            "calendars",
            "events",
            "locations",
            "locators",
            "slots",
            "team_admin_preferences",
            "teams",
            "thirdParties",
            "user_preference",
            "users",
            "vytemes",
            "webhooks",
            "errors",
          ],
        },
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    "vuepress-plugin-element-tabs",
    "vuepress-plugin-mermaidjs",
    "vuepress-plugin-export",
    "demo-code",
    "reading-progress",
    [(require("vuepress-intercom"), { appId: "sqoiibtg" })],
    [
      "vuepress-plugin-container",
      {
        type: "left",
        before: `<div class="left">`,
        after: "</div>",
      },
    ],
    [
      "vuepress-plugin-container",
      {
        type: "right",
        before: `<div class="right">`,
        after: "</div>",
      },
    ],
    [
      "vuepress-plugin-container",
      {
        type: "panel",
        before: `<div class="parent">`,
        after: "</div>",
      },
    ],
    [
      "vuepress-plugin-clean-urls",
      {
        normalSuffix: "/",
        indexSuffix: "/",
        notFoundPath: "/404.html",
      },
    ],
  ],
};
