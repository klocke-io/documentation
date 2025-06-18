<script setup>
import DefaultTheme from 'vitepress/theme'
import './style.css'
import {withBase} from "vitepress";
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <footer class="footer">
        <div class="container">
          <div class="funding-notice">
            <div class="funding-image">
               <img :src="withBase('/eu-support.png')" alt="EU and German government funding logos">
            </div>
            <div class="funding-text">
              <p>
                <strong>Finanziert von der Europäischen Union – NextGenerationEU.</strong>
              </p>
              <p>
                The views and opinions expressed are solely those of the author(s) and do not necessarily reflect the views of the European Union or the European Commission. Neither the European Union nor the European Commission can be held responsible for them.
              </p>
            </div>
          </div>

          <div class="copyright">
            <p>Copyright © Linux Foundation Europe. Gardener is a project of Linux Foundation Europe.</p>
            <p>For applicable policies including privacy policy, terms of use and trademark usage guidelines, please see https://linuxfoundation.eu.</p>
            <p>Linux is a registered trademark of Linus Torvalds.</p>
          </div>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<style scoped>
/* Main Footer Container */
.footer {
  border-top: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  padding: 32px 24px;
  margin-top: 64px;
}

.container {
  max-width: 1152px;
  margin: 0 auto;
}

/* Columns for navigation links */
.footer-columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 48px;
}

.footer-column {
  flex-grow: 1;
  min-width: 160px;
}

.footer-column h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 6px;
}

.footer-column a {
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.footer-column a:hover {
  color: var(--vp-c-brand-1);
}

/* Funding Notice Section */
.funding-notice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  padding: 0 0 24px 0;
}

.funding-image img {
  max-width: 300px;
  height: auto;
  display: block;
}

.funding-text {
  flex: 1;
  min-width: 280px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.funding-text p {
  margin: 0;
}

/* Final Copyright Line */
.copyright {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.footer-legal-links {
  margin-top: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.footer-legal-links a {
  color: var(--vp-c-text-2);
  text-decoration: underline;
  margin: 0 4px;
  transition: color 0.2s;
}

.footer-legal-links a:hover {
  color: var(--vp-c-brand-1);
}

.footer-legal-sep {
  margin: 0 4px;
  color: var(--vp-c-divider);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-columns {
    justify-content: flex-start;
  }
}
</style>