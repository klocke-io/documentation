// https://vitepress.dev/guide/custom-theme
import { Theme, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import YouTubeVideo from './components/YouTubeVideo.vue'
import VPFooter from './components/VPFooter.vue'
import VPNavbarMenuGroupWrapper from './components/VPNavbarMenuGroupWrapper.vue'
import EmptyIndexLayout from './layouts/EmptyIndexLayout.vue'
import './style.css'
import posthog from 'posthog-js'

export default {
  extends: DefaultTheme,
  Layout: EmptyIndexLayout,
  enhanceApp({ app, router, siteData }) {
    app.component('YouTubeVideo', YouTubeVideo)
    app.component('VPFooter', VPFooter)
    app.component('VPNavbarMenuGroupWrapper', VPNavbarMenuGroupWrapper)
    
    if (typeof window !== 'undefined') {
      posthog.init('phc_zYmm7RPD5YnDyWVuBE8z1uQKlBimlxHGrCfELNXfsTD', {
        api_host: 'https://eu.i.posthog.com',
        defaults: '2025-11-30',
        cookieless_mode: 'always',
      })
    }
  },
} satisfies Theme
