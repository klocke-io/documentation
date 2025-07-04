import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import {generateSidebar} from 'vitepress-sidebar'
import blogSidebar from './theme/utils/blog-sidebar.ts'

const communitySidebarConfig = {
  documentRootPath: '/content',
  scanStartPath: 'community',
  resolvePath: '/community/',
  collapsed: true,
  capitalizeFirst: true,
  useTitleFromFrontmatter: true,
  useFolderTitleFromIndexFile: true,
}
const docsSidebarConfig = {
  documentRootPath: '/content',
  scanStartPath: 'docs',
  resolvePath: '/docs/',
  collapsed: true,
  capitalizeFirst: true,
  useTitleFromFrontmatter: true,
}


export default defineConfig({
  srcDir: './content',
  cleanUrls: true,
  //ToDo fix syntax issues for markdown files on build time
  srcExclude: [
    '**/archived/**',
    // Custom template tag is used, check for alternative
    '**/community-bio.md',
    // Generated api reference which uses <> so indicate consumer input, CAPS could be used instead or escape via code block ``,
    '**/api-reference/extensions.md',
    '**/api-reference/operator.md',
    '**/api-reference/seedmanagement.md',
    '**/api-reference/core-v1.md',
    '**/api-reference/core.md',
    '**/etcd-druid/api-reference.md',
    '**/machine-controller-manager/documents/apis.md',
    // Missing end tag <> used in normal text not in code block
    '**/network-problem-detector/_index.md',
    // Custom template tag is used instead of normal markdown alert or github alert 
    // https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
    '**/tutorials/tutorial-custom-domain-with-istio.md',
    //inconsistent name of logo,content/docs/dashboard/images/Show-account-details.png starts with capital  letter
    '**/dashboard/project-operations.md',
  ],
  lastUpdated: true,
  ignoreDeadLinks: true, //ToDo fix dead links
  title: "Gardener",
  description: "A Managed Kubernetes Service Done Right",
  head: [
    [
      'link',
      {rel: 'icon', type: 'image/svg+xml', href: '/documentation/gardener-logo.svg'}
    ],
    [
      'link',
      {rel: 'icon', type: 'image/png', href: '/gardener-logo.svg'}
    ],
    ['meta', {name: 'theme-color', content: '#009f76'}],
    ['meta', {property: 'og:type', content: 'website'}],
    ['meta', {property: 'og:site_name', content: 'Gardener'}],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://raw.githubusercontent.com/klocke-io/documentation/refs/heads/master/website/public/og-gardener.png'
      }
    ],
    ['meta', {property: 'og:url', content: 'https://gardener.cloud/'}],
    //todo add analytics
    //[
    //  'script',
    //  {
    //    src: 'https://cdn.usefathom.com/script.js',
    //    'data-site': 'AZBRSFGG',
    //    'data-spa': 'auto',
    //    defer: ''
    //  }
    //]
  ],

  themeConfig: {
    logo: {src: '/gardener-logo.svg', width: 24, height: 24},
    nav: [
      {
        text: 'Demo',
        link: 'https://demo.gardener.cloud/',
      },
      {
        text: 'Adopters',
        link: '/adopter/_index.md',
      },
      {
        text: 'Documentation',
        items: [
          {text: 'User', link: '/docs/_index.md',},
          {text: 'Operator', link: '/docs/_index.md',},
          {text: 'Developer', link: '/docs/_index.md',},
          {text: 'All', link: '/docs/_index.md',},
        ]
      },
      {
        text: 'Blogs',
        link: '/blog',
      },
      {
        text: 'Community',
        link: '/community/_index.md',
      },
    ],
    sidebar: {
      '/blog/': blogSidebar['/blog/'],
      //@ts-ignore
      '/community/': generateSidebar([communitySidebarConfig])['/community/'],
      //@ts-ignore
      '/docs/': generateSidebar([docsSidebarConfig])['/docs/'],
    },
    editLink: {
      pattern: ({filePath, frontmatter }) => {
        const fileName = `${frontmatter?.path_base_for_github_subdir?.to ?? filePath.split("/").pop()}`
        const githubLink = `${frontmatter['github_repo']}/tree/master/${frontmatter['github_subdir']}/${fileName}`
        return githubLink
      },
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      {icon: 'github', link: 'https://github.com/gardener'},
      {
        icon: 'slack',
        link: 'https://join.slack.com/t/gardener-cloud/shared_invite/zt-33c9daems-3oOorhnqOSnldZPWqGmIBw'
      },
      {icon: 'youtube', link: 'https://www.youtube.com/@GardenerProject'}
    ],
    search: {
      provider: 'local',
      detailedView: true,
      options: {
        detailedView: true,
        miniSearch: {
          /**
           * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
           */
          options: {
            // Configure how fields are extracted from documents
            extractField: (document, fieldName) => {
              // Extract frontmatter metadata for search
              if (fieldName === 'categories' && document.frontmatter?.categories) {
                return Array.isArray(document.frontmatter.categories)
                    ? document.frontmatter.categories.join(' ')
                    : document.frontmatter.categories;
              }
              if (fieldName === 'tags' && document.frontmatter?.tags) {
                return Array.isArray(document.frontmatter.tags)
                    ? document.frontmatter.tags.join(' ')
                    : document.frontmatter.tags;
              }
              if (fieldName === 'description' && document.frontmatter?.description) {
                return document.frontmatter.description;
              }
              if (fieldName === 'page_synonyms' && document.frontmatter?.page_synonyms) {
                return Array.isArray(document.frontmatter.page_synonyms)
                    ? document.frontmatter.page_synonyms.join(' ')
                    : document.frontmatter.page_synonyms;
              }
              // Extract default fields
              return document[fieldName];
            },
            // Custom tokenizer to handle special characters in technical docs
            tokenize: (text) => text.toLowerCase().split(/[\s\-_/]+/),
            // Process terms to improve search (e.g., stemming)
            processTerm: (term) => term.toLowerCase()
          },
          /**
           * @type {import('minisearch').SearchOptions}
           */
          searchOptions: {
            // Fuzzy search with prefix matching for better results
            fuzzy: 0.2,
            prefix: true,
            // Boosting: Give more weight to title, less to tags/categories
            boost: {
              title: 5,        // Most important
              text: 3,         // Body content
              headings: 4,     // Section headings
              tags: 2,         // Tags metadata
              categories: 2,   // Categories metadata
              description: 4,  // Description field
              page_synonyms: 3 // Synonyms/alternate terms
            },
            // Fields to search in
            fields: ['title', 'text', 'headings', 'tags', 'categories', 'description', 'page_synonyms']
          }
        }
      }
    },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPFeature\.vue$/,
          replacement: fileURLToPath(
              new URL('./theme/components/VPFeature.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPTeamMembersItem\.vue$/,
          replacement: fileURLToPath(
              new URL('./theme/components/VPTeamMembersItem.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPNavBarMenuLink\.vue$/,
          replacement: fileURLToPath(
              new URL('./theme/components/VPNavBarMenuLink.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(
              new URL('./theme/components/VPFooter.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPSidebarGroup\.vue$/,
          replacement: fileURLToPath(
              new URL('./theme/components/VPSidebarGroup.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPMenu\.vue$/,
          replacement: fileURLToPath(
              new URL('./theme/components/VPMenu.vue', import.meta.url)
          )
        },
      ]
    }
  },
}
)

////https://vitepress-sidebar.cdget.com
//export default defineConfig(withSidebar(vitePressOptions, [
//  {
//    documentRootPath: '/content',
//    scanStartPath: 'blog',
//    resolvePath: '/blog/',
//    collapsed: false,
//    capitalizeFirst: true,
//    sortMenusByFrontmatterDate: true,
//    sortMenusOrderByDescending: true,
//    collapsed: true
//    // useTitleFromFrontmatter: true,
//  },
//  {
//    documentRootPath: '/content',
//    scanStartPath: 'community',
//    resolvePath: '/community/',
//    collapsed: false,
//    capitalizeFirst: true,
//    useTitleFromFrontmatter: true,
//    useFolderTitleFromIndexFile: true,
//  },
//  {
//    documentRootPath: '/content',
//    scanStartPath: 'docs',
//    resolvePath: '/docs/',
//    collapsed: true,
//    capitalizeFirst: true,
//    useTitleFromFrontmatter: true,
//  },
//]))
