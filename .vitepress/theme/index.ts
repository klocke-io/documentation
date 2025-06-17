// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { Theme, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogTheme from './blog/BlogLayout.vue'  // Import the blog theme from index.ts
import CustomeLayout from "./custome-layout.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    // For blog pages, use the blog theme layout
    const { page } = useData()
    console.log('Path check:', { 
      isBlogPath: page.value.filePath && page.value.filePath.includes('blog/'),
      path: page.value.filePath,
      relativePath: page.value.relativePath
    }) 
    
    // Check if this is a blog page based on the URL path
    if (page.value.relativePath && page.value.relativePath.startsWith('blog/')) {
      console.log('render BlogTheme')
      return h(BlogTheme)
    }
    // Otherwise use the default custom layout
    return h(CustomeLayout)
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme