// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { Theme, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogTheme from './blog/BlogLayout.vue'  // Import the blog theme from index.ts
import CustomeLayout from "./custome-layout.vue";

export default {
  extends: DefaultTheme,
  Layout: CustomeLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme