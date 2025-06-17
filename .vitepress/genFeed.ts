import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

const baseUrl = `https://gardener.cloud`

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'Gardener Blog',
    description: 'Updates, news, and insights from the Gardener community',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: 'https://gardener.cloud/gardener-logo.svg',
    favicon: `${baseUrl}/favicon.ico`,
    copyright:
      'Copyright (c) Gardener contributors'
  })

  const posts = await createContentLoader('website/blog/**/*.md', {
    excerpt: true,
    render: true
  }).load()

  // Filter out index files
  const filteredPosts = posts.filter(post => 
    !post.url.endsWith('_index') && 
    !post.url.includes('/images/') &&
    post.frontmatter.publishdate
  )

  filteredPosts.sort(
    (a, b) =>
      +new Date(b.frontmatter.publishdate as string) -
      +new Date(a.frontmatter.publishdate as string)
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html?.replaceAll('&ZeroWidthSpace;', ''),
      author: [
        {
          name: frontmatter.author,
          link: frontmatter.twitter
            ? `https://twitter.com/${frontmatter.twitter}`
            : undefined
        }
      ],
      date: frontmatter.date
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
}
