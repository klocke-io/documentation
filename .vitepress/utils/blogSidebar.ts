import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { DefaultTheme } from 'vitepress'

/**
 * Generates the sidebar configuration for the blog section
 * @returns {DefaultTheme.SidebarItem[]} Sidebar configuration for blog section
 */
export function getBlogSidebar(): DefaultTheme.SidebarItem[] {
  const blogDir = path.resolve(__dirname, '../../website/blog')
  const years = fs.readdirSync(blogDir)
    .filter(file => 
      fs.statSync(path.join(blogDir, file)).isDirectory() && 
      /^20\d{2}$/.test(file) // Only include year directories (e.g. 2025)
    )
    .sort((a, b) => b.localeCompare(a)) // Sort years in descending order

  const items: DefaultTheme.SidebarItem[] = []

  // Process each year directory
  for (const year of years) {
    const yearPath = path.join(blogDir, year)
    const yearChildren: DefaultTheme.SidebarItem[] = []

    // Get all entries in the year directory
    const yearEntries = fs.readdirSync(yearPath)
      .filter(entry => !entry.startsWith('.') && entry !== '_index.md')
    
    // Check if the year has month subdirectories
    const hasMonthFolders = yearEntries.some(entry => 
      fs.statSync(path.join(yearPath, entry)).isDirectory() && 
      /^(0[1-9]|1[0-2])$/.test(entry) // Check if entry is a month folder (01-12)
    )

    if (hasMonthFolders) {
      // Process each month directory
      const months = yearEntries
        .filter(entry => fs.statSync(path.join(yearPath, entry)).isDirectory())
        .sort((a, b) => b.localeCompare(a)) // Sort months in descending order

      for (const month of months) {
        const monthPath = path.join(yearPath, month)
        const monthName = getMonthName(month)
        const monthChildren: DefaultTheme.SidebarItem[] = []

        // Process each blog post in the month directory
        const blogPosts = fs.readdirSync(monthPath)
          .filter(file => file.endsWith('.md') && file !== '_index.md')
          .sort((a, b) => b.localeCompare(a)) // Sort blog posts in descending order

        for (const blogPost of blogPosts) {
          const postPath = path.join(monthPath, blogPost)
          const postLink = `/blog/${year}/${month}/${blogPost.replace(/\.md$/, '')}`
          const title = getBlogPostTitle(postPath)
          
          monthChildren.push({
            text: title,
            link: postLink
          })
        }

        if (monthChildren.length > 0) {
          yearChildren.push({
            text: monthName,
            collapsed: true,
            items: monthChildren
          })
        }
      }
    } else {
      // Process each blog post directly in the year directory
      const blogPosts = yearEntries
        .filter(file => file.endsWith('.md') && file !== '_index.md')
        .sort((a, b) => b.localeCompare(a)) // Sort blog posts in descending order

      for (const blogPost of blogPosts) {
        const postPath = path.join(yearPath, blogPost)
        const postLink = `/blog/${year}/${blogPost.replace(/\.md$/, '')}`
        const title = getBlogPostTitle(postPath)
        
        yearChildren.push({
          text: title,
          link: postLink
        })
      }
    }

    if (yearChildren.length > 0) {
      items.push({
        text: year,
        collapsed: year !== new Date().getFullYear().toString(), // Expand current year by default
        items: yearChildren
      })
    }
  }

  return items
}

/**
 * Extracts the title from a blog post's frontmatter
 * @param {string} filePath - Path to the blog post file
 * @returns {string} The title from frontmatter or filename if not found
 */
function getBlogPostTitle(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    
    // First try to use linkTitle which is often more concise
    if (data.linkTitle) {
      return data.linkTitle
    }
    
    // Fall back to regular title
    if (data.title) {
      return data.title
    }
    
    // If no title is found, use the filename without date prefix
    const filename = path.basename(filePath, '.md')
    return filename.replace(/^\d{2}[-.\s]\d{2}[-.\s]/, '').replace(/-/g, ' ')
  } catch (error) {
    // If there's an error reading the file, return the filename
    const filename = path.basename(filePath, '.md')
    return filename.replace(/^\d{2}[-.\s]\d{2}[-.\s]/, '').replace(/-/g, ' ')
  }
}

/**
 * Converts a month number to its name
 * @param {string} month - Month as a string (e.g. '01', '02', etc.)
 * @returns {string} The month name
 */
function getMonthName(month: string): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const monthNum = parseInt(month, 10)
  return monthNames[monthNum - 1] || month
}
